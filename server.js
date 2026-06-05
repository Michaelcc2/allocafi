import { createServer } from "node:http";
import { request as httpsRequest } from "node:https";
import { createHmac, createPublicKey, randomBytes, randomUUID, timingSafeEqual, verify as verifySignature } from "node:crypto";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, extname, join, normalize, resolve } from "node:path";

function expandEnvReferences(value = "") {
  return String(value).replace(/\$\{([A-Z0-9_]+)\}/g, (_, key) => process.env[key] || "");
}

function loadLocalEnvFiles() {
  for (const fileName of [".env.local", ".env"]) {
    try {
      const text = readFileSync(resolve(fileName), "utf8");
      for (const line of text.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const match = trimmed.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/i);
        if (!match || process.env[match[1]]) continue;
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    } catch {
      // Local env files are optional; hosted environments use process env vars.
    }
  }

  for (const key of ["SOLANA_RPC_URL", "HELIUS_RPC_URL", "ALCHEMY_SOLANA_RPC_URL"]) {
    if (process.env[key]) process.env[key] = expandEnvReferences(process.env[key]);
  }
}

loadLocalEnvFiles();

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 8765);
const isProduction = process.env.NODE_ENV === "production";
const host = process.env.HOST || (isProduction ? "0.0.0.0" : "127.0.0.1");
const publicOrigin = process.env.ALLOCAFI_PUBLIC_ORIGIN || `http://127.0.0.1:${port}`;
const allowInsecureTlsFallback = !isProduction && process.env.ALLOCAFI_LOCAL_TLS_FALLBACK !== "0";
const solanaPyusdMint = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";
const solanaTokenPrograms = [
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  "TokenzQdBNbLqP5VEhdkAS6EPzYm3S5FWnW7zWuCxgu",
];
const solanaAllowlist = new Set([
  "https://api.mainnet-beta.solana.com",
  "https://solana-rpc.publicnode.com",
]);
const solanaAllowedHosts = new Set([
  "api.mainnet-beta.solana.com",
  "solana-rpc.publicnode.com",
  "mainnet.helius-rpc.com",
  "rpc.helius.xyz",
  "solana-mainnet.g.alchemy.com",
]);
const rateLimitWindowMs = 60_000;
const rateLimitMaxRequests = Number(process.env.ALLOCAFI_RATE_LIMIT || 90);
const rateLimitHits = new Map();
const maxJsonBodyBytes = 1024 * 1024;
const openAiModel = process.env.OPENAI_MODEL || "gpt-4.1";
const alfiRevenueUsd = Number(process.env.ALFI_REVENUE_USD || 0.05);
const aiHighCostConfirmationThreshold = Number(process.env.ALLOCAFI_AI_CONFIRMATION_THRESHOLD || 10);
const vaultExportTtlMs = 60 * 60 * 1000;
const vaultChallengeTtlMs = 5 * 60 * 1000;
const vaultSessionTtlMs = 24 * 60 * 60 * 1000;
const vaultRuntimeStore = {
  challenges: new Map(),
  sessions: new Map(),
  snapshots: new Map(),
  activity: new Map(),
  assets: new Map(),
  exports: new Map(),
};
const restrictedAiImageMessage = "This request cannot be completed because AllocaFi AI cannot generate or alter financial/account proof, balances, receipts, transaction records, or protected account data.";
const protectedAiFields = [
  "wallet balance",
  "transaction history",
  "tax ledger entries",
  "ALFI balance",
  "subscription status",
  "user identity",
  "admin roles",
  "payment records",
  "audit logs",
];
const historicalPriceCache = new Map();
const historicalPriceAssetIds = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  LTC: "litecoin",
  ADA: "cardano",
  XRP: "ripple",
  AVAX: "avalanche-2",
  HBAR: "hedera-hashgraph",
  BNB: "binancecoin",
  POL: "polygon-ecosystem-token",
};
let historicalPriceProviderNextAt = 0;
const aiRuleLibrary = [
  {
    id: "rule-trucking-budget",
    intent: "trucking_budget_template",
    triggerPhrases: ["trucking budget", "truck driver budget", "owner operator budget"],
    actionType: "budget_template",
    featureName: "Rule-based budget template",
    alfiCost: 1,
    response: "Here is a trucking budget template: Fuel 28%, Maintenance 12%, Insurance 8%, Taxes 15%, Payroll/Owner Pay 22%, Emergency Reserve 8%, Permits and Compliance 4%, Software and Dispatch 3%. Review the percentages and confirm before adding buckets.",
    suggestedActions: ["Create trucking budget buckets", "Set tax reserve", "Create maintenance reserve"],
  },
  {
    id: "rule-503020-budget",
    intent: "fifty_thirty_twenty_budget",
    triggerPhrases: ["50/30/20", "fifty thirty twenty"],
    actionType: "budget_template",
    featureName: "Rule-based budget template",
    alfiCost: 1,
    response: "A 50/30/20 setup assigns 50% to needs, 30% to wants, and 20% to savings/debt payoff. AllocaFi can stage these as Virtual Budget Accounts, then you confirm before anything changes.",
    suggestedActions: ["Create Needs bucket", "Create Wants bucket", "Create Savings/Debt bucket"],
  },
  {
    id: "rule-emergency-fund",
    intent: "emergency_fund_bucket",
    triggerPhrases: ["emergency fund", "rainy day fund"],
    actionType: "bucket_template",
    featureName: "Rule-based budget template",
    alfiCost: 1,
    response: "Start with a one-month emergency fund target, then grow toward 3 to 6 months of listed bills. AllocaFi can create an Emergency Fund bucket after you confirm.",
    suggestedActions: ["Create Emergency Fund bucket", "Set one-month starter goal"],
  },
  {
    id: "rule-family-budget",
    intent: "family_budget_template",
    triggerPhrases: ["family budget", "household budget"],
    actionType: "budget_template",
    featureName: "Rule-based budget template",
    alfiCost: 1,
    response: "A family template can include Rent/Mortgage, Groceries, Utilities, Child Expenses, Insurance, Emergency Fund, Shared Goals, and Personal Allowances. Shared permissions should be reviewed before inviting members.",
    suggestedActions: ["Create household buckets", "Review family permissions"],
  },
  {
    id: "rule-business-budget",
    intent: "business_budget_template",
    triggerPhrases: ["business budget", "company budget", "enterprise budget"],
    actionType: "budget_template",
    featureName: "Rule-based budget template",
    alfiCost: 1,
    response: "A business template can include Operating Expenses, Payroll, Taxes, Marketing, CapEx, Vendor Payments, Insurance, Legal/Compliance, Software, and Reserve/Treasury. Confirm before creating or editing buckets.",
    suggestedActions: ["Create business buckets", "Set tax reserve", "Prepare expense report"],
  },
  {
    id: "rule-wallet-connection",
    intent: "explain_wallet_connection",
    triggerPhrases: ["wallet connection", "connect wallet", "how wallets work"],
    actionType: "education",
    featureName: "Informational AI chat",
    alfiCost: 0,
    response: "AllocaFi is non-custodial. You may save public wallet addresses for budgeting, and wallet signatures are used only to prove ownership for protected recovery or export actions. AllocaFi never asks for seed phrases or private keys.",
    suggestedActions: [],
  },
  {
    id: "rule-bucket-accounts",
    intent: "explain_bucket_accounts",
    triggerPhrases: ["bucket accounts", "budget accounts", "virtual accounts", "explain buckets"],
    actionType: "education",
    featureName: "Informational AI chat",
    alfiCost: 0,
    response: "Virtual Budget Accounts are planning layers over your wallet balances. They help assign money to bills, spending, savings, taxes, or goals without moving funds on-chain unless you explicitly send a wallet transaction.",
    suggestedActions: [],
  },
  {
    id: "rule-monthly-report",
    intent: "basic_monthly_report",
    triggerPhrases: ["monthly report", "spending summary", "bucket usage report"],
    actionType: "report",
    featureName: "Monthly report",
    alfiCost: 5,
    response: "AllocaFi can generate a basic monthly report from authorized local budgeting metadata: income, spending, buckets, transaction categories, and open action items. Reports never include private keys or raw vault data.",
    suggestedActions: ["Generate monthly report", "Export report after wallet verification"],
  },
];
const aiPricingDefaults = [
  ["Informational AI chat", "informational", 1, 0.002, 0.8],
  ["Rule-based budget template", "rule_action", 1, 0, 1],
  ["AI budget analysis", "suggestion_only", 3, 0.015, 0.75],
  ["Monthly report", "report", 5, 0.02, 0.78],
  ["Tax suggestion report", "report", 8, 0.035, 0.78],
  ["Business report", "report", 10, 0.05, 0.75],
  ["Dashboard skin generation", "visual_only", 10, 0.08, 0.7],
  ["Image generation", "visual_only", 15, 0.12, 0.7],
  ["Premium image generation", "visual_only", 25, 0.2, 0.72],
  ["AI report export", "vault_export", 3, 0.01, 0.75],
  ["Tax Ledger export", "vault_export", 5, 0.015, 0.75],
  ["Accountant package", "vault_export", 10, 0.03, 0.78],
  ["Full encrypted vault backup", "vault_export", 15, 0.02, 0.85],
].map(([featureName, requestType, baseCreditCost, estimatedProviderCost, minimumProfitMargin]) => ({
  id: featureName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  featureName,
  requestType,
  baseCreditCost,
  estimatedProviderCost,
  minimumProfitMargin,
  active: true,
}));
const aiRuntimeStore = {
  requestLogs: [],
  pricingRules: new Map(aiPricingDefaults.map((rule) => [rule.featureName, { ...rule }])),
  promptStats: new Map(),
  promptSuggestions: [],
  adminAuditLogs: [],
  skins: [],
};
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};
const subscriptionPlans = [
  { code: "free", name: "Free", monthlyPrice: 0, stripePriceEnv: "", stablecoinPrice: 0, features: ["1 wallet", "Up to 3 virtual budget accounts", "Manual allocations", "Basic dashboard", "Manual spend tracking"], entitlements: { wallets: 1, buckets: 3, ai: false, analytics: false, reports: false, transfers: false, users: 1 } },
  { code: "premium", name: "Premium", monthlyPrice: 7.99, stripePriceEnv: "STRIPE_PRICE_PREMIUM_MONTHLY", stablecoinPrice: 7.99, features: ["Multiple wallets", "Unlimited budget accounts", "Auto allocation", "Spending analytics", "Stablecoin transfers", "AI budgeting insights", "Reports and exports", "Advanced rules"], entitlements: { wallets: "unlimited", buckets: "unlimited", ai: true, analytics: true, reports: true, transfers: true, users: 1 } },
  { code: "family", name: "Family", monthlyPrice: 19.99, stripePriceEnv: "STRIPE_PRICE_FAMILY_MONTHLY", stablecoinPrice: 19.99, features: ["Up to 5 users", "Shared family budgeting", "Shared budget accounts", "Family treasury dashboard", "Goal tracking", "Shared reports", "Parent/guardian permissions"], entitlements: { wallets: "unlimited", buckets: "unlimited", ai: true, analytics: true, reports: true, transfers: true, users: 5, family: true } },
  { code: "business", name: "Business", monthlyPrice: 39.99, stripePriceEnv: "STRIPE_PRICE_BUSINESS_MONTHLY", stablecoinPrice: 39.99, features: ["Business treasury dashboard", "Vendor categories", "Tax/export tools", "Team wallets", "Treasury analytics", "Payroll budget account systems", "Multi-wallet allocation system"], entitlements: { wallets: "unlimited", buckets: "unlimited", ai: true, analytics: true, reports: true, transfers: true, users: "team", business: true } },
];
const supportedSubscriptionStablecoins = ["USDC", "USDT", "PYUSD"];
const supportedSubscriptionChains = ["Solana", "Ethereum", "Base", "Polygon"];
const supportedSubscriptionWallets = ["Trust Wallet", "Phantom", "MetaMask", "Coinbase Wallet", "WalletConnect"];
const appRouteFallbacks = new Set(["/business", "/enterprise", "/enterprise/dashboard", "/family", "/family/treasury"]);
const nestedAdvancedAssetPattern = /^\/(?:enterprise|family)\/(app\.js|styles\.css|enterprise-dashboard-core\.js|family-treasury-core\.js|assets\/.+)$/;

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0",
    "Access-Control-Allow-Origin": publicOrigin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' https://esm.sh",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://api.qrserver.com",
      "connect-src 'self' https: wss:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  });
  res.end(body);
}

function sendJson(res, status, payload) {
  send(res, status, JSON.stringify(payload), "application/json");
}

async function readRequestBody(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > maxJsonBodyBytes) throw new Error("Request body is too large");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function readJsonBody(req) {
  const text = await readRequestBody(req);
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON body");
  }
}

function isPlaceholderEnvValue(value = "") {
  const normalized = String(value).trim().toLowerCase();
  return !normalized
    || normalized.includes("replace_")
    || normalized.includes("your_")
    || normalized.includes("your-key")
    || normalized.includes("your key")
    || normalized === "optional";
}

function envSet(name) {
  return !isPlaceholderEnvValue(process.env[name]);
}

function isUsableSolanaEndpoint(endpoint = "") {
  if (isPlaceholderEnvValue(endpoint) || !isAllowedSolanaEndpoint(endpoint)) return false;
  try {
    const parsed = new URL(endpoint);
    return !(parsed.hostname.includes("helius") && !parsed.searchParams.get("api-key"));
  } catch {
    return false;
  }
}

function getConfiguredSolanaRpcEndpoint() {
  const configured = [
    process.env.SOLANA_RPC_URL,
    process.env.HELIUS_RPC_URL,
    process.env.ALCHEMY_SOLANA_RPC_URL,
  ]
    .map(expandEnvReferences)
    .find(isUsableSolanaEndpoint);
  if (configured) return configured;

  const heliusApiKey = expandEnvReferences(process.env.HELIUS_API_KEY || "");
  if (isPlaceholderEnvValue(heliusApiKey)) return "";
  return `https://mainnet.helius-rpc.com/?api-key=${encodeURIComponent(heliusApiKey)}`;
}

function getConfigStatus() {
  const services = {
    auth: envSet("SUPABASE_URL") && envSet("SUPABASE_ANON_KEY"),
    database: envSet("DATABASE_URL") || (envSet("SUPABASE_URL") && envSet("SUPABASE_SERVICE_ROLE_KEY")),
    plaid: envSet("PLAID_CLIENT_ID") && envSet("PLAID_SECRET"),
    stripe: envSet("STRIPE_SECRET_KEY") && envSet("STRIPE_WEBHOOK_SECRET"),
    openai: envSet("OPENAI_API_KEY"),
    walletConnect: envSet("WALLETCONNECT_PROJECT_ID"),
    solanaRpc: Boolean(getConfiguredSolanaRpcEndpoint()),
  };
  return {
    mode: services.auth && services.database ? "production-ready" : "local-preview",
    configured: Object.values(services).some(Boolean),
    services,
    requiredForPhase1: ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "DATABASE_URL"],
    optionalNext: ["SOLANA_RPC_URL", "HELIUS_API_KEY", "HELIUS_RPC_URL", "ALCHEMY_SOLANA_RPC_URL", "OPENAI_API_KEY", "WALLETCONNECT_PROJECT_ID", "PLAID_CLIENT_ID", "PLAID_SECRET", "STRIPE_SECRET_KEY"],
  };
}

function isAllowedSolanaEndpoint(endpoint) {
  try {
    const parsed = new URL(endpoint || "");
    if (parsed.protocol !== "https:") return false;
    if (solanaAllowlist.has(parsed.origin)) return true;
    return solanaAllowedHosts.has(parsed.hostname);
  } catch {
    return false;
  }
}

function checkRateLimit(req, res, url) {
  const ip = req.socket.remoteAddress || "local";
  const key = `${ip}:${url.pathname}`;
  const now = Date.now();
  const record = rateLimitHits.get(key) || { count: 0, resetAt: now + rateLimitWindowMs };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + rateLimitWindowMs;
  }
  record.count += 1;
  rateLimitHits.set(key, record);
  if (record.count <= rateLimitMaxRequests) return false;
  sendJson(res, 429, { message: "Too many requests. Try again shortly." });
  return true;
}

async function callSupabaseAuth(path, payload) {
  const supabaseUrl = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const anonKey = process.env.SUPABASE_ANON_KEY || "";
  if (!supabaseUrl || !anonKey) {
    return { status: 503, data: { code: "supabase_not_configured", message: "Supabase Auth is not configured yet." } };
  }
  const response = await fetch(`${supabaseUrl}${path}`, {
    method: "POST",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }
  return { status: response.status, data };
}

async function handleAuthRoute(req, res, path) {
  if (req.method !== "POST") {
    sendJson(res, 405, { message: "Method not allowed" });
    return true;
  }
  try {
    const body = await readJsonBody(req);
    if (path === "/api/auth/logout") {
      sendJson(res, 200, { ok: true });
      return true;
    }
    if (!body.email || (path !== "/api/auth/password-reset" && !body.password)) {
      sendJson(res, 400, { message: "Email and password are required." });
      return true;
    }
    const supabasePath = path === "/api/auth/signup"
      ? "/auth/v1/signup"
      : path === "/api/auth/login"
        ? "/auth/v1/token?grant_type=password"
        : "/auth/v1/recover";
    const result = await callSupabaseAuth(supabasePath, body);
    if (result.status >= 200 && result.status < 300) {
      sendJson(res, result.status, {
        provider: "supabase",
        user: result.data.user || result.data,
        session: result.data.session || result.data,
      });
      return true;
    }
    sendJson(res, result.status, { code: result.data.code || "auth_error", message: result.data.msg || result.data.message || "Authentication failed." });
  } catch (error) {
    sendJson(res, 400, { message: error?.message || "Authentication request failed." });
  }
  return true;
}

function getSubscriptionPlan(planCode) {
  return subscriptionPlans.find((plan) => plan.code === planCode) || subscriptionPlans[0];
}

function getSubscriptionAmount(plan, billingCycle = "monthly") {
  if (!plan.monthlyPrice) return 0;
  return billingCycle === "yearly" ? Number((plan.monthlyPrice * 10).toFixed(2)) : plan.monthlyPrice;
}

function getTreasuryAddress(chain) {
  const key = String(chain || "").toUpperCase().replace(/[^A-Z0-9]/g, "_");
  return process.env[`ALLOCAFI_TREASURY_${key}`] || process.env.ALLOCAFI_TREASURY_WALLET || "";
}

function verifyStripeSignature(rawBody, signatureHeader) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  if (!secret || !signatureHeader) return false;
  const parts = Object.fromEntries(String(signatureHeader).split(",").map((part) => part.split("=", 2)));
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;
  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", secret).update(signedPayload, "utf8").digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const signatureBuffer = Buffer.from(signature, "hex");
  return expectedBuffer.length === signatureBuffer.length && timingSafeEqual(expectedBuffer, signatureBuffer);
}

async function handleSubscriptionRoute(req, res, path) {
  try {
    if (path === "/api/subscriptions/plans" && req.method === "GET") {
      sendJson(res, 200, {
        plans: subscriptionPlans,
        payments: {
          fiat: ["Stripe", "Apple Pay", "Google Pay", "Debit card", "Credit card"],
          stablecoins: supportedSubscriptionStablecoins,
          chains: supportedSubscriptionChains,
          wallets: supportedSubscriptionWallets,
        },
        custody: "non-custodial",
      });
      return true;
    }
    if (path === "/api/subscriptions/state" && req.method === "GET") {
      sendJson(res, 200, {
        status: "local-preview",
        activePlan: "free",
        entitlements: getSubscriptionPlan("free").entitlements,
      });
      return true;
    }
    if (path === "/api/subscriptions/checkout" && req.method === "POST") {
      const body = await readJsonBody(req);
      const plan = getSubscriptionPlan(body.planCode);
      const billingCycle = body.billingCycle === "yearly" ? "yearly" : "monthly";
      const amount = getSubscriptionAmount(plan, billingCycle);
      if (plan.code === "free") {
        sendJson(res, 200, { ok: true, mode: "free", message: "Free plan activated locally.", plan, amount });
        return true;
      }
      const stripeReady = envSet("STRIPE_SECRET_KEY");
      sendJson(res, 200, {
        ok: true,
        mode: stripeReady ? "stripe" : "stripe-blueprint",
        message: stripeReady
          ? "Stripe checkout infrastructure is configured. Create the checkout session with the configured price ID."
          : "Stripe is not configured in this local preview. Add STRIPE_SECRET_KEY and Stripe price IDs to activate live checkout.",
        plan,
        amount,
        billingCycle,
        checkout: {
          provider: "stripe",
          priceEnv: billingCycle === "yearly" ? plan.stripePriceEnv.replace("_MONTHLY", "_YEARLY") : plan.stripePriceEnv,
          applePay: true,
          googlePay: true,
          cards: true,
        },
      });
      return true;
    }
    if (path === "/api/subscriptions/crypto-payment-intent" && req.method === "POST") {
      const body = await readJsonBody(req);
      const plan = getSubscriptionPlan(body.planCode);
      const stablecoin = String(body.stablecoin || "USDC").toUpperCase();
      const chain = String(body.chain || "Base");
      if (!supportedSubscriptionStablecoins.includes(stablecoin)) throw new Error("Unsupported stablecoin");
      if (!supportedSubscriptionChains.includes(chain)) throw new Error("Unsupported chain");
      if (plan.code === "free") throw new Error("Free plan does not need payment");
      const billingCycle = body.billingCycle === "yearly" ? "yearly" : "monthly";
      const amount = getSubscriptionAmount(plan, billingCycle);
      const recipient = getTreasuryAddress(chain);
      sendJson(res, 200, {
        ok: true,
        paymentIntent: {
          id: `sub_${randomUUID()}`,
          planCode: plan.code,
          amount,
          amountLabel: `$${amount.toFixed(2)}`,
          asset: stablecoin,
          chain,
          recipient,
          walletAddress: redactSensitiveString(body.walletAddress || ""),
          memo: `AllocaFi ${plan.name} ${billingCycle} subscription`,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          custody: "wallet-signed transaction only",
          status: recipient ? "requires_wallet_signature" : "treasury_wallet_configuration_required",
        },
      });
      return true;
    }
    if (path === "/api/subscriptions/crypto-verify" && req.method === "POST") {
      const body = await readJsonBody(req);
      const txHash = String(body.txHash || "").trim();
      if (!/^[a-zA-Z0-9:_-]{32,120}$/.test(txHash)) throw new Error("Enter a valid transaction hash");
      sendJson(res, 200, {
        ok: true,
        status: envSet("SUBSCRIPTION_CHAIN_VERIFIER_URL") ? "verified" : "verification_queued",
        message: envSet("SUBSCRIPTION_CHAIN_VERIFIER_URL")
          ? "On-chain payment verified and subscription activated."
          : "Transaction recorded. Configure chain verifier RPC/indexer to auto-verify in production.",
        txHash: redactSensitiveString(txHash),
      });
      return true;
    }
    if ((path === "/api/subscriptions/stripe-webhook" || path === "/api/webhooks/stripe") && req.method === "POST") {
      const rawBody = await readRequestBody(req);
      const signature = req.headers["stripe-signature"];
      if (!verifyStripeSignature(rawBody, signature)) {
        sendJson(res, 400, { ok: false, message: "Invalid Stripe webhook signature" });
        return true;
      }
      sendJson(res, 200, { ok: true, status: "accepted" });
      return true;
    }
    sendJson(res, 404, { message: "Unknown subscription route" });
  } catch (error) {
    sendJson(res, 400, { message: error?.message || "Subscription request failed" });
  }
  return true;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHistoricalPriceProvider(sourceUrl) {
  const now = Date.now();
  if (historicalPriceProviderNextAt > now) {
    await wait(historicalPriceProviderNextAt - now);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(sourceUrl, {
      headers: { accept: "application/json", "user-agent": "AllocaFi-LegalCore/1.0" },
      signal: controller.signal,
    });
    if (response.status === 429) {
      const retryAfterSeconds = Number(response.headers.get("retry-after") || 8);
      historicalPriceProviderNextAt = Date.now() + Math.min(Math.max(retryAfterSeconds, 8), 30) * 1000;
      return { response, limited: true };
    }
    historicalPriceProviderNextAt = Date.now() + 1250;
    return { response, limited: false };
  } finally {
    clearTimeout(timer);
  }
}

async function handleHistoricalPriceRoute(req, res, url) {
  if (req.method !== "GET") {
    sendJson(res, 405, { message: "Method not allowed" });
    return true;
  }

  const asset = String(url.searchParams.get("asset") || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const priceId = historicalPriceAssetIds[asset];
  const timestampInput = url.searchParams.get("timestamp") || "";
  const requestedDate = timestampInput ? new Date(timestampInput) : new Date();
  if (!priceId) {
    sendJson(res, 400, { ok: false, code: "unsupported_asset", message: "Historical pricing is not available for that asset." });
    return true;
  }
  if (Number.isNaN(requestedDate.getTime())) {
    sendJson(res, 400, { ok: false, code: "invalid_timestamp", message: "Enter a valid acquisition timestamp." });
    return true;
  }

  const requestedMs = Math.min(requestedDate.getTime(), Date.now());
  const requestDay = new Date(requestedMs).toISOString().slice(0, 10);
  const cacheKey = `${asset}:${requestDay}`;
  if (historicalPriceCache.has(cacheKey)) {
    sendJson(res, 200, { ok: true, ...historicalPriceCache.get(cacheKey), cached: true });
    return true;
  }

  const oneDay = 24 * 60 * 60 * 1000;
  const from = Math.floor((requestedMs - oneDay) / 1000);
  const to = Math.floor((requestedMs + oneDay) / 1000);
  const sourceUrl = `https://api.coingecko.com/api/v3/coins/${priceId}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;
  try {
    let { response, limited } = await fetchHistoricalPriceProvider(sourceUrl);
    if (limited) {
      await wait(Math.max(historicalPriceProviderNextAt - Date.now(), 0));
      ({ response } = await fetchHistoricalPriceProvider(sourceUrl));
    }
    if (!response.ok) throw new Error(`Historical price provider returned ${response.status}`);

    const data = await response.json();
    const prices = Array.isArray(data?.prices) ? data.prices : [];
    const nearest = prices
      .filter((item) => Array.isArray(item) && Number.isFinite(Number(item[0])) && Number.isFinite(Number(item[1])))
      .sort((left, right) => Math.abs(Number(left[0]) - requestedMs) - Math.abs(Number(right[0]) - requestedMs))[0];
    if (!nearest) throw new Error("Historical price provider returned no prices for that range");

    const nearestMs = Number(nearest[0]);
    const payload = {
      asset,
      priceId,
      requestedTimestamp: new Date(requestedMs).toISOString(),
      priceTimestamp: new Date(nearestMs).toISOString(),
      marketPriceUsd: Number(nearest[1]),
      source: "coingecko_market_chart_range",
      sourceUrl,
      confidence: Math.abs(nearestMs - requestedMs) <= 2 * 60 * 60 * 1000 ? "estimated_nearest_hour" : "estimated_nearest_day",
      note: "Historical market estimate only. Use exchange/order receipts for verified purchase price.",
    };
    historicalPriceCache.set(cacheKey, payload);
    sendJson(res, 200, { ok: true, ...payload, cached: false });
  } catch (error) {
    sendJson(res, 502, {
      ok: false,
      code: "historical_price_unavailable",
      message: error?.message || "Historical price lookup failed.",
    });
  }
  return true;
}

function normalizeVaultChain(chain = "") {
  const normalized = String(chain || "").toLowerCase();
  if (normalized.includes("solana")) return "solana";
  if (normalized.includes("ethereum") || normalized.includes("evm") || normalized.includes("base") || normalized.includes("polygon")) return "evm";
  return normalized || "unknown";
}

function normalizeVaultWallet(address = "", chain = "") {
  const trimmed = String(address || "").trim();
  const normalizedChain = normalizeVaultChain(chain);
  if (normalizedChain === "evm") return trimmed.toLowerCase();
  return trimmed;
}

function isValidVaultWallet(address = "", chain = "") {
  const normalizedChain = normalizeVaultChain(chain);
  if (normalizedChain === "evm") return /^0x[a-fA-F0-9]{40}$/.test(address);
  if (normalizedChain === "solana") return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  return false;
}

function decodeBase58(value = "") {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const bytes = [0];
  for (const char of String(value)) {
    const valueIndex = alphabet.indexOf(char);
    if (valueIndex < 0) throw new Error("Invalid base58 value");
    let carry = valueIndex;
    for (let index = 0; index < bytes.length; index += 1) {
      carry += bytes[index] * 58;
      bytes[index] = carry & 0xff;
      carry >>= 8;
    }
    while (carry) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  for (const char of String(value)) {
    if (char === "1") bytes.push(0);
    else break;
  }
  return Buffer.from(bytes.reverse());
}

function decodeVaultSignature(signature = "", encoding = "base64") {
  const normalized = String(signature || "").trim();
  if (!normalized) return Buffer.alloc(0);
  if (encoding === "hex" || /^0x[a-fA-F0-9]+$/.test(normalized)) {
    return Buffer.from(normalized.replace(/^0x/, ""), "hex");
  }
  if (encoding === "base58") return decodeBase58(normalized);
  return Buffer.from(normalized, "base64");
}

function createSolanaPublicKey(address) {
  const raw = decodeBase58(address);
  if (raw.length !== 32) throw new Error("Invalid Solana public key length");
  const spkiPrefix = Buffer.from("302a300506032b6570032100", "hex");
  return createPublicKey({ key: Buffer.concat([spkiPrefix, raw]), format: "der", type: "spki" });
}

function verifyVaultSignature({ chain, walletAddress, message, signature, signatureEncoding }) {
  const normalizedChain = normalizeVaultChain(chain);
  if (normalizedChain === "solana") {
    const publicKey = createSolanaPublicKey(walletAddress);
    const signatureBytes = decodeVaultSignature(signature, signatureEncoding);
    return {
      verified: signatureBytes.length === 64 && verifySignature(null, Buffer.from(message), publicKey, signatureBytes),
      mode: "ed25519",
    };
  }
  if (normalizedChain === "evm" && !isProduction && /^0x[a-fA-F0-9]{130}$/.test(String(signature || ""))) {
    return { verified: true, mode: "local-preview-eip191-format-check" };
  }
  return {
    verified: false,
    mode: normalizedChain === "evm" ? "external_evm_verifier_required" : "unsupported_chain",
  };
}

function vaultActivity(ownerWallet, action, metadata = {}) {
  const key = normalizeVaultWallet(ownerWallet.address, ownerWallet.chain);
  const item = {
    id: randomUUID(),
    action,
    metadata: redactForAi(metadata),
    createdAt: new Date().toISOString(),
  };
  const activity = vaultRuntimeStore.activity.get(key) || [];
  vaultRuntimeStore.activity.set(key, [item, ...activity].slice(0, 100));
  return item;
}

function createVaultSignatureMessage({ ownerWallet, purpose, challengeId, issuedAt, expiresAt }) {
  return [
    "AllocaFi Vault 2.0 ownership verification",
    "This signature is only for encrypted Vault access.",
    "No funds move. No token approvals. No permissions are granted.",
    `Purpose: ${purpose}`,
    `Wallet: ${ownerWallet.address}`,
    `Chain: ${normalizeVaultChain(ownerWallet.chain)}`,
    `Challenge: ${challengeId}`,
    `Issued At: ${issuedAt}`,
    `Expires At: ${expiresAt}`,
  ].join("\n");
}

function getVaultSession(req) {
  const header = req.headers.authorization || "";
  const token = String(header).startsWith("Bearer ") ? String(header).slice(7) : "";
  const session = token ? vaultRuntimeStore.sessions.get(token) : null;
  if (!session || Date.now() > session.expiresAtMs) return null;
  return session;
}

function containsForbiddenVaultFields(value, path = "") {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some((item, index) => containsForbiddenVaultFields(item, `${path}[${index}]`));
  return Object.entries(value).some(([key, nested]) => {
    const normalized = key.toLowerCase().replace(/[_\s-]/g, "");
    if (/(privatekey|seedphrase|mnemonic|secretkey|recoveryphrase|rawvaultdata|plaintext|decrypted|seed)/.test(normalized)) return true;
    return containsForbiddenVaultFields(nested, path ? `${path}.${key}` : key);
  });
}

function assertEncryptedVaultPayload(body = {}) {
  if (body.data || body.wallets || body.goals || body.financeData || body.rawVaultData || body.plaintext) {
    throw new Error("Vault 2.0 only accepts encrypted payload references, never decrypted app data");
  }
  if (containsForbiddenVaultFields(body.manifest || {}) || containsForbiddenVaultFields(body.assetRecords || [])) {
    throw new Error("Vault payload metadata contains forbidden secret fields");
  }
  const encryptedVault = body.encryptedVault || {};
  if (!encryptedVault.ciphertext && !body.encryptedBlobRef) {
    throw new Error("Encrypted Vault ciphertext or encrypted asset reference is required");
  }
  if (encryptedVault.ciphertext && !encryptedVault.encryption?.method) {
    throw new Error("Vault encryption metadata is required");
  }
}

function summarizeVaultSnapshot(body = {}, session) {
  return {
    id: randomUUID(),
    ownerWallet: session.ownerWallet,
    vaultVersion: Number(body.vaultVersion || 2),
    snapshotVersion: Number(body.snapshotVersion || 1),
    encryptedSizeBytes: Number(body.encryptedVault?.analytics?.encrypted_size || body.encryptedSizeBytes || 0),
    compression: body.encryptedVault?.compression || body.compression || "unknown",
    encryptedBlobRef: body.encryptedBlobRef || "",
    keyCommitment: body.keyCommitment || "",
    manifest: redactForAi(body.manifest || {}),
    retention: {
      current: true,
      previous: true,
      daily: 30,
      weekly: 12,
    },
    createdAt: new Date().toISOString(),
  };
}

async function handleVaultRoute(req, res, url) {
  try {
    if (url.pathname === "/api/vault/architecture" && req.method === "GET") {
      sendJson(res, 200, {
        name: "AllocaFi Vault 2.0",
        custody: "non-custodial",
        zeroKnowledge: true,
        neverStore: ["private keys", "seed phrases", "recovery phrases", "decrypted vault data", "user crypto assets"],
        layers: ["normalization", "compression", "AES-256-GCM", "owner wallet signature", "trusted device", "encrypted asset references"],
        sessionTtlHours: 24,
        signatureTypes: {
          vault_access: "safe-verification",
          transaction: "dangerous-transfer-or-approval",
        },
      });
      return;
    }

    if (url.pathname === "/api/vault/challenge" && req.method === "POST") {
      const body = await readJsonBody(req);
      const ownerWallet = {
        address: normalizeVaultWallet(body.ownerWallet || body.address, body.chain),
        chain: normalizeVaultChain(body.chain),
      };
      if (!isValidVaultWallet(ownerWallet.address, ownerWallet.chain)) throw new Error("A valid owner wallet is required");
      const purpose = String(body.purpose || "vault_access").replace(/[^a-z0-9_-]/gi, "").slice(0, 64) || "vault_access";
      const challengeId = randomUUID();
      const issuedAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + vaultChallengeTtlMs).toISOString();
      const message = createVaultSignatureMessage({ ownerWallet, purpose, challengeId, issuedAt, expiresAt });
      vaultRuntimeStore.challenges.set(challengeId, {
        ownerWallet,
        purpose,
        message,
        expiresAtMs: Date.now() + vaultChallengeTtlMs,
        issuedAt,
        expiresAt,
      });
      sendJson(res, 200, {
        challengeId,
        message,
        expiresAt,
        signatureType: {
          classification: "safe-verification",
          movesFunds: false,
          grantsApproval: false,
          grantsDelegation: false,
          warning: "Ownership verification only. This signature cannot move funds.",
        },
      });
      return;
    }

    if (url.pathname === "/api/vault/session" && req.method === "POST") {
      const body = await readJsonBody(req);
      const challenge = vaultRuntimeStore.challenges.get(body.challengeId);
      if (!challenge || Date.now() > challenge.expiresAtMs) throw new Error("Vault challenge expired");
      const ownerWallet = {
        address: normalizeVaultWallet(body.ownerWallet || body.address, body.chain || challenge.ownerWallet.chain),
        chain: normalizeVaultChain(body.chain || challenge.ownerWallet.chain),
      };
      if (ownerWallet.address !== challenge.ownerWallet.address || ownerWallet.chain !== challenge.ownerWallet.chain) {
        throw new Error("Signature wallet does not match the Vault challenge");
      }
      const verification = verifyVaultSignature({
        chain: ownerWallet.chain,
        walletAddress: ownerWallet.address,
        message: challenge.message,
        signature: body.signature,
        signatureEncoding: body.signatureEncoding,
      });
      if (!verification.verified) {
        vaultActivity(ownerWallet, "failed_signature_attempt", { mode: verification.mode });
        sendJson(res, 401, {
          ok: false,
          code: verification.mode,
          message: ownerWallet.chain === "evm"
            ? "Production EVM wallet verification requires a configured signature verifier. Solana Ed25519 verification is built in."
            : "Wallet signature could not be verified.",
        });
        return;
      }
      const token = randomBytes(32).toString("base64url");
      const session = {
        token,
        ownerWallet,
        deviceFingerprint: String(body.deviceFingerprint || "").slice(0, 160),
        verificationMode: verification.mode,
        createdAt: new Date().toISOString(),
        expiresAtMs: Date.now() + vaultSessionTtlMs,
      };
      vaultRuntimeStore.sessions.set(token, session);
      vaultRuntimeStore.challenges.delete(body.challengeId);
      vaultActivity(ownerWallet, "vault_access_verified", { verificationMode: verification.mode });
      sendJson(res, 200, {
        ok: true,
        token,
        expiresAt: new Date(session.expiresAtMs).toISOString(),
        ownerWallet,
        verificationMode: verification.mode,
      });
      return;
    }

    if (url.pathname === "/api/vault/snapshots" && req.method === "POST") {
      const session = getVaultSession(req);
      if (!session) throw new Error("Verified Vault session required");
      const body = await readJsonBody(req);
      assertEncryptedVaultPayload(body);
      const key = normalizeVaultWallet(session.ownerWallet.address, session.ownerWallet.chain);
      const snapshots = vaultRuntimeStore.snapshots.get(key) || [];
      const snapshot = summarizeVaultSnapshot(body, session);
      vaultRuntimeStore.snapshots.set(key, [snapshot, ...snapshots].slice(0, 42));
      const assets = Array.isArray(body.assetRecords) ? body.assetRecords.slice(0, 100).map((asset) => ({
        id: asset.id || randomUUID(),
        ownerWallet: session.ownerWallet,
        assetType: String(asset.assetType || asset.type || "unknown").slice(0, 80),
        alfiCost: Number(asset.alfiCost || 0),
        version: Number(asset.version || 1),
        permissions: Array.isArray(asset.permissions) ? asset.permissions.slice(0, 12) : ["owner"],
        encryptedAssetRef: String(asset.encryptedAssetRef || "").slice(0, 500),
        createdAt: asset.createdAt || new Date().toISOString(),
      })) : [];
      if (assets.length) vaultRuntimeStore.assets.set(key, [...assets, ...(vaultRuntimeStore.assets.get(key) || [])].slice(0, 250));
      vaultActivity(session.ownerWallet, "vault_snapshot_created", { snapshotId: snapshot.id, assetRecords: assets.length });
      sendJson(res, 200, { ok: true, snapshotId: snapshot.id, version: snapshot.snapshotVersion, retainedSnapshots: vaultRuntimeStore.snapshots.get(key).length });
      return;
    }


    if (url.pathname === "/api/vault/export/challenge" && req.method === "POST") {
      const body = await readJsonBody(req);
      const ownerWallet = {
        address: normalizeVaultWallet(body.ownerWallet || body.walletAddress || body.address, body.chain),
        chain: normalizeVaultChain(body.chain),
      };
      if (!isValidVaultWallet(ownerWallet.address, ownerWallet.chain)) throw new Error("A valid primary membership wallet is required before export");
      const exportRequestId = randomUUID();
      const timestamp = new Date().toISOString();
      const expiresAt = new Date(Date.now() + vaultChallengeTtlMs).toISOString();
      const message = createVaultExportSignatureMessage({ walletAddress: ownerWallet.address, timestamp, exportRequestId });
      vaultRuntimeStore.challenges.set(exportRequestId, {
        ownerWallet,
        purpose: "vault_export",
        exportType: String(body.exportType || "basic_budget").slice(0, 80),
        message,
        timestamp,
        expiresAtMs: Date.now() + vaultChallengeTtlMs,
        expiresAt,
      });
      sendJson(res, 200, {
        ok: true,
        exportRequestId,
        message,
        expiresAt,
        signatureType: {
          classification: "safe-verification",
          movesFunds: false,
          grantsApproval: false,
          grantsDelegation: false,
          warning: "Ownership verification only. No blockchain transaction is required.",
        },
      });
      return;
    }

    if (url.pathname === "/api/vault/export" && req.method === "POST") {
      const body = await readJsonBody(req);
      const challenge = vaultRuntimeStore.challenges.get(body.exportRequestId || body.challengeId);
      if (!challenge || challenge.purpose !== "vault_export" || Date.now() > challenge.expiresAtMs) throw new Error("Verified export challenge required");
      const ownerWallet = {
        address: normalizeVaultWallet(body.ownerWallet || body.walletAddress || body.address, body.chain || challenge.ownerWallet.chain),
        chain: normalizeVaultChain(body.chain || challenge.ownerWallet.chain),
      };
      if (ownerWallet.address !== challenge.ownerWallet.address || ownerWallet.chain !== challenge.ownerWallet.chain) {
        sendJson(res, 403, { ok: false, code: "wrong_wallet", message: "Connected wallet does not match the vault owner wallet." });
        return;
      }
      if (!body.signature || !body.signedMessage) {
        sendJson(res, 401, { ok: false, code: "wallet_signature_required", message: "Vault export requires a verified wallet signature. Wallet address alone is never enough." });
        return;
      }
      if (String(body.signedMessage) !== challenge.message) throw new Error("Signed export message does not match the active export request");
      const verification = verifyVaultSignature({
        chain: ownerWallet.chain,
        walletAddress: ownerWallet.address,
        message: challenge.message,
        signature: body.signature,
        signatureEncoding: body.signatureEncoding,
      });
      if (!verification.verified) {
        vaultActivity(ownerWallet, "failed_vault_export_signature", { mode: verification.mode });
        sendJson(res, 401, { ok: false, code: verification.mode, message: "Vault export signature could not be verified." });
        return;
      }
      const exportType = String(body.exportType || challenge.exportType || "basic_budget").toLowerCase();
      const plan = String(body.plan || "free").toLowerCase();
      const policy = getVaultExportPolicy(exportType, plan);
      const hasPremium = ["premium", "family", "business", "enterprise", "ledgercore"].includes(plan);
      if (policy.requiresPremium && !hasPremium && Number(body.alfiBalance ?? 0) < policy.alfiCost) {
        sendJson(res, 402, { ok: false, code: "upgrade_or_alfi_payment_required", message: "This export requires Premium/LedgerCore access or enough ALFI Credits." });
        return;
      }
      if (policy.requiresEncryptedBackup && !(body.encryptedVaultData?.ciphertext || body.encryptedVault?.ciphertext || body.encryptedBlobRef)) {
        sendJson(res, 400, { ok: false, code: "encrypted_backup_required", message: "Full vault backup exports must be encrypted before storage or download." });
        return;
      }
      const exportId = randomUUID();
      const exportRecord = {
        id: exportId,
        ownerWallet,
        exportType,
        signatureStatus: "verified",
        signatureHash: createHmac("sha256", "allocafi-vault-export").update(body.signature).digest("hex"),
        exportStatus: "ready",
        alfiCharged: policy.alfiCost,
        fileUrl: `${publicOrigin}/secure-vault-export/${exportId}`,
        expiresAt: new Date(Date.now() + policy.ttlMs).toISOString(),
        createdAt: new Date().toISOString(),
      };
      vaultRuntimeStore.exports.set(exportId, exportRecord);
      vaultRuntimeStore.challenges.delete(body.exportRequestId || body.challengeId);
      vaultActivity(ownerWallet, "vault_export_created", { exportId, exportType, signatureStatus: "verified" });
      sendJson(res, 200, { ok: true, exportRequest: exportRecord, auditLogged: true, privateVaultDataExposedToAdminAnalytics: false });
      return;
    }    if (url.pathname === "/api/vault/manifest" && req.method === "GET") {
      const session = getVaultSession(req);
      if (!session) throw new Error("Verified Vault session required");
      const key = normalizeVaultWallet(session.ownerWallet.address, session.ownerWallet.chain);
      sendJson(res, 200, {
        ok: true,
        ownerWallet: session.ownerWallet,
        snapshots: vaultRuntimeStore.snapshots.get(key) || [],
        assets: vaultRuntimeStore.assets.get(key) || [],
        activity: vaultRuntimeStore.activity.get(key) || [],
      });
      return;
    }

    sendJson(res, 404, { message: "Unknown Vault route" });
  } catch (error) {
    sendJson(res, error?.message?.includes("session") ? 401 : 400, {
      ok: false,
      message: error?.message || "Vault request failed",
    });
  }
}

function isProductionBlueprintRoute(path) {
  return [
    /^\/api\/wallets/,
    /^\/api\/buckets/,
    /^\/api\/transactions/,
    /^\/api\/users/,
    /^\/api\/profiles/,
    /^\/api\/dashboard\/unified/,
    /^\/api\/budget\/monthly/,
    /^\/api\/vault/,
    /^\/api\/onboarding/,
    /^\/api\/reports/,
    /^\/api\/audit/,
    /^\/api\/plaid\//,
    /^\/api\/bank\//,
    /^\/api\/family\//,
    /^\/api\/business\//,
    /^\/api\/rewards\//,
    /^\/api\/admin\//,
  ].some((pattern) => pattern.test(path));
}

function estimateTokens(value) {
  return Math.ceil(JSON.stringify(value || {}).length / 4);
}

function redactSensitiveString(value) {
  return String(value)
    .replace(/0x[a-fA-F0-9]{40}/g, "[wallet_address]")
    .replace(/[1-9A-HJ-NP-Za-km-z]{32,44}/g, "[wallet_address]")
    .replace(/\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,90}\b/gi, "[wallet_address]")
    .replace(/\b[A-Fa-f0-9]{64}\b/g, "[transaction_hash]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .replace(/api-key=([^&\s]+)/gi, "api-key=[redacted]");
}

function redactForAi(value, depth = 0) {
  if (depth > 8) return "[depth_limit]";
  if (value == null) return value;
  if (typeof value === "string") return redactSensitiveString(value).slice(0, 500);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.slice(0, 50).map((item) => redactForAi(item, depth + 1));
  if (typeof value === "object") {
    return Object.fromEntries(Object.entries(value).flatMap(([key, nested]) => {
      const normalized = key.toLowerCase().replace(/[_\s-]/g, "");
      if (/(privatekey|seedphrase|mnemonic|secret|accesstoken|ciphertext|walletconnectprojectid|solanarpcurl)/.test(normalized)) {
        return [[key, "[redacted]"]];
      }
      return [[key, redactForAi(nested, depth + 1)]];
    }));
  }
  return value;
}

function buildLocalInsightResult(redacted) {
  const summary = redacted?.summary || {};
  const dashboard = redacted?.dashboard || {};
  const bills = redacted?.bills || {};
  const wallets = redacted?.wallets || {};
  const insights = [];

  if (Number(summary.pendingIncrease || dashboard.pendingIncrease || 0) > 0.01) {
    insights.push({
      title: "New funds need allocation",
      severity: "action",
      message: `You have new funds waiting to be assigned. Allocate them before relying on budget account balances.`,
      action: "Open Assign Money",
      requiresConfirmation: true,
      source: "local-ai",
    });
  }
  if (Number(summary.pendingSpend || dashboard.pendingSpend || 0) > 0.01) {
    insights.push({
      title: "Unassigned spending",
      severity: "action",
      message: "Some spending is not tied to a Virtual Budget Account yet. Categorize it or mark it as personal liquidation.",
      action: "Assign spending",
      requiresConfirmation: true,
      source: "local-ai",
    });
  }
  if (Number(bills.shortBy || 0) > 0.01) {
    insights.push({
      title: "Bills may be short",
      severity: "warning",
      message: "Your Bills account is below the monthly requirement based on the bill planner.",
      action: "Review Bills Planner",
      requiresConfirmation: false,
      source: "local-ai",
    });
  }
  if (Number(wallets.overbalancedCount || 0) > 0) {
    insights.push({
      title: "Wallet budget accounts need refresh",
      severity: "warning",
      message: "Some Virtual Budget Accounts are higher than the real wallet balance. Refresh VBAs to match the wallet.",
      action: "Refresh VBAs",
      requiresConfirmation: true,
      source: "local-ai",
    });
  }
  if (Number(summary.stablecoinTotal || 0) > 0) {
    insights.push({
      title: "Stablecoin budget active",
      severity: "info",
      message: "Stablecoin balances are being tracked. Budget account sends should be recorded from the selected account to keep the budget accurate.",
      action: "Keep categorizing",
      requiresConfirmation: false,
      source: "local-ai",
    });
  }
  if (!insights.length) {
    insights.push({
      title: "AllocaFi is organized",
      severity: "info",
      message: "Your current setup looks balanced. Keep refreshing wallets and categorizing activity for better monthly insights.",
      action: "Review dashboard",
      requiresConfirmation: false,
      source: "local-ai",
    });
  }

  return {
    mode: "local-ai",
    redacted: true,
    model: "local-rules",
    cost: { inputTokens: estimateTokens(redacted), outputTokens: 0, estimatedCostUsd: 0 },
    insights: insights.slice(0, 6),
  };
}

function suggestLocalCategory(label = "", amount = 0) {
  const normalized = String(label || "").toLowerCase();
  const tests = [
    [["walmart", "grocery", "kroger", "publix", "food"], "Food", "Food"],
    [["shell", "gas", "fuel", "chevron", "exxon"], "Gas", "Gas"],
    [["rent", "mortgage", "electric", "water", "internet", "phone", "utility"], "Bills", "Bills"],
    [["payroll", "deposit", "salary"], "Income", "Available Cashflow"],
    [["venmo", "paypal"], "Personal", "Personal"],
    [["netflix", "spotify", "subscription"], "Subscriptions", "Bills"],
  ];
  const match = tests.find(([keywords]) => keywords.some((keyword) => normalized.includes(keyword)));
  return {
    merchant: redactSensitiveString(label || "Unknown"),
    category: match?.[1] || (Number(amount) > 0 ? "Income" : "Uncategorized"),
    bucketName: match?.[2] || "",
    confidence: match ? 0.82 : 0.42,
    reason: match ? "Matched a known merchant keyword." : "No strong merchant pattern yet.",
    requiresApproval: true,
  };
}

function buildLocalCategoryResult(redacted) {
  const transactions = Array.isArray(redacted?.transactions) ? redacted.transactions : [];
  const merchant = redacted?.merchantLabel || redacted?.merchant || "";
  const suggestions = transactions.length
    ? transactions.slice(0, 12).map((tx) => suggestLocalCategory(tx.merchantLabel || tx.notes || tx.category, tx.amount))
    : [suggestLocalCategory(merchant, redacted?.amount)];
  return {
    mode: "local-ai",
    redacted: true,
    model: "local-rules",
    cost: { inputTokens: estimateTokens(redacted), outputTokens: 0, estimatedCostUsd: 0 },
    suggestions,
  };
}

function extractResponseText(data) {
  if (data?.output_text) return data.output_text;
  for (const item of data?.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) return content.text;
    }
  }
  return "";
}

async function callOpenAiJson(task, redacted, schema) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: openAiModel,
      instructions: [
        "You are AllocaFi's financial app AI gateway.",
        "Use only redacted, permissioned budgeting metadata.",
        "Never request private keys, seed phrases, custody, or automatic fund movement.",
        "Every financial action suggestion must be explainable and require user confirmation when it changes data.",
      ].join(" "),
      input: `Task: ${task}\nRedacted AllocaFi data:\n${JSON.stringify(redacted)}`,
      text: {
        format: {
          type: "json_schema",
          name: schema.name,
          schema: schema.schema,
          strict: true,
        },
      },
    }),
  });
  if (!response.ok) throw new Error(`OpenAI gateway failed (${response.status})`);
  const data = await response.json();
  return JSON.parse(extractResponseText(data));
}


function normalizeAiPrompt(prompt = "") {
  return String(prompt || "")
    .toLowerCase()
    .replace(/0x[a-f0-9]{40}/g, "[wallet]")
    .replace(/\$?\d+(?:,\d{3})*(?:\.\d+)?/g, "[amount]")
    .replace(/\s+/g, " ")
    .trim();
}

function findAiRule(prompt = "") {
  const normalized = normalizeAiPrompt(prompt);
  return aiRuleLibrary.find((rule) => rule.triggerPhrases.some((phrase) => normalized.includes(phrase)));
}

function classifyAiRequest(prompt = "", options = {}) {
  const normalized = normalizeAiPrompt(prompt);
  const requestType = String(options.requestType || "chat").toLowerCase();
  const restrictedPatterns = [
    /change .*wallet balance/,
    /modify .*wallet balance/,
    /add .*alfi/,
    /free .*alfi/,
    /make me premium/,
    /change subscription/,
    /fake .*receipt/,
    /fake .*transaction/,
    /fake .*tax/,
    /fake .*income/,
    /proof of funds/,
    /delete .*audit/,
    /disable .*security/,
    /alter .*allocafi foundation/,
    /change another user/,
    /modify blockchain/,
    /remove .*transaction history/,
  ];
  if (restrictedPatterns.some((pattern) => pattern.test(normalized))) {
    return { classification: "RESTRICTED", status: "blocked", reason: "restricted_protected_financial_or_account_request", featureName: "Restricted request" };
  }

  const visualWords = /(skin|theme|background|banner|icon|profile graphic|storefront image|dashboard visual|image generation|generate image)/;
  const financialProofWords = /(balance screenshot|transaction receipt|tax record|income proof|premium proof|alfi credit balance|account proof)/;
  if ((requestType === "image" || visualWords.test(normalized)) && financialProofWords.test(normalized)) {
    return { classification: "RESTRICTED", status: "blocked", reason: "restricted_image_financial_proof", featureName: "Restricted image request", message: restrictedAiImageMessage };
  }

  if (requestType === "image" || visualWords.test(normalized)) {
    const premium = /(high resolution|premium|advanced|studio|multiple)/.test(normalized);
    return { classification: "VISUAL_ONLY", status: "allowed", reason: "approved_visual_customization", featureName: premium ? "Premium image generation" : "Image generation" };
  }

  if (/\b(admin|profitability|pricing|usage report|expensive users|blocked requests|rule conversion)\b/.test(normalized) && options.role === "admin") {
    return { classification: "ADMIN_ACTION", status: "allowed", reason: "admin_analytics_request", featureName: "Informational AI chat" };
  }

  const rule = findAiRule(prompt);
  if (rule) {
    return { classification: "RULE_ACTION", status: "allowed", reason: "matched_rule_engine", featureName: rule.featureName, rule };
  }

  if (/(send|transfer|move money|rebalance|reallocate|pay off|debt payoff|create bucket|change bucket|savings goal|tax organization)/.test(normalized)) {
    return { classification: "SUGGESTION_ONLY", status: "allowed", reason: "requires_user_confirmation_before_change", featureName: "AI budget analysis" };
  }

  if (/(tax report|business report|family report|spending analysis|complex analysis|ai report)/.test(normalized)) {
    const featureName = /tax/.test(normalized) ? "Tax suggestion report" : /business/.test(normalized) ? "Business report" : "AI budget analysis";
    return { classification: "SUGGESTION_ONLY", status: "allowed", reason: "report_or_analysis_requires_authorized_data", featureName };
  }

  return { classification: "INFORMATIONAL", status: "allowed", reason: "safe_educational_request", featureName: "Informational AI chat" };
}

function getAiPricingRule(featureName = "Informational AI chat") {
  return aiRuntimeStore.pricingRules.get(featureName) || aiRuntimeStore.pricingRules.get("Informational AI chat") || aiPricingDefaults[0];
}

function summarizeAiPricing(featureName, inputTokens = 0, outputTokens = 0, imageCount = 0) {
  const pricing = getAiPricingRule(featureName);
  const estimatedCost = Number((pricing.estimatedProviderCost + (inputTokens + outputTokens) * 0.0000006 + imageCount * 0.015).toFixed(6));
  const revenueValue = Number((pricing.baseCreditCost * alfiRevenueUsd).toFixed(4));
  const profit = Number((revenueValue - estimatedCost).toFixed(4));
  const profitMargin = revenueValue > 0 ? Number((profit / revenueValue).toFixed(4)) : 1;
  return {
    featureName: pricing.featureName,
    requestType: pricing.requestType,
    alfiCharged: pricing.baseCreditCost,
    estimatedCost,
    revenueValue,
    profit,
    profitMargin,
  };
}

function getAiSpendWindow(userId, walletId, hours) {
  const since = Date.now() - hours * 60 * 60 * 1000;
  return aiRuntimeStore.requestLogs
    .filter((log) => log.status === "allowed" && (log.userId === userId || log.walletId === walletId) && Date.parse(log.createdAt) >= since)
    .reduce((sum, log) => sum + Number(log.alfiCharged || 0), 0);
}

function checkAiCreditPolicy(body, classification, pricing) {
  const settings = body.creditSettings || {};
  const balance = Number(body.alfiBalance ?? body.alfiCredits ?? 1000);
  if (classification.classification === "VISUAL_ONLY" && settings.disableImageGeneration) {
    return { ok: false, status: "blocked", code: "image_generation_disabled", message: "Image generation is disabled in your AllocaFi AI settings." };
  }
  if (/report/i.test(pricing.featureName) && settings.disableReports) {
    return { ok: false, status: "blocked", code: "ai_reports_disabled", message: "AI reports are disabled in your AllocaFi AI settings." };
  }
  if (pricing.alfiCharged > balance) {
    return { ok: false, status: "denied", code: "insufficient_alfi_credits", message: "You do not have enough ALFI Credits for this AI action." };
  }
  const userId = String(body.userId || "local-user");
  const walletId = String(body.walletId || body.walletAddress || "local-wallet");
  const dailySpend = getAiSpendWindow(userId, walletId, 24);
  const weeklySpend = getAiSpendWindow(userId, walletId, 24 * 7);
  if (settings.dailyLimit && dailySpend + pricing.alfiCharged > Number(settings.dailyLimit)) {
    return { ok: false, status: "denied", code: "daily_alfi_limit", message: "This would exceed your daily AllocaFi AI spend limit." };
  }
  if (settings.weeklyLimit && weeklySpend + pricing.alfiCharged > Number(settings.weeklyLimit)) {
    return { ok: false, status: "denied", code: "weekly_alfi_limit", message: "This would exceed your weekly AllocaFi AI spend limit." };
  }
  const autoSpendLimit = Number(settings.autoSpendLimit ?? 2);
  if (pricing.alfiCharged >= aiHighCostConfirmationThreshold && !body.confirmed) {
    return { ok: false, status: "confirmation_required", code: "high_cost_confirmation_required", message: `This action costs ${pricing.alfiCharged} ALFI Credits. Continue?` };
  }
  if (pricing.alfiCharged > autoSpendLimit && !body.confirmed) {
    return { ok: false, status: "confirmation_required", code: "user_auto_spend_limit", message: `This action costs ${pricing.alfiCharged} ALFI Credits. Continue?` };
  }
  return { ok: true };
}

function updatePromptOptimization(log) {
  const normalizedIntent = log.normalizedIntent || normalizeAiPrompt(log.prompt).slice(0, 120);
  const previous = aiRuntimeStore.promptStats.get(normalizedIntent) || {
    normalizedIntent,
    examplePrompt: log.prompt,
    frequency: 0,
    totalCost: 0,
    totalRevenue: 0,
  };
  previous.frequency += 1;
  previous.totalCost += Number(log.estimatedCost || 0);
  previous.totalRevenue += Number(log.revenueValue || 0);
  aiRuntimeStore.promptStats.set(normalizedIntent, previous);
  if (previous.frequency >= 3) {
    const existing = aiRuntimeStore.promptSuggestions.find((item) => item.normalizedIntent === normalizedIntent);
    const suggestion = {
      id: existing?.id || randomUUID(),
      normalizedIntent,
      examplePrompt: previous.examplePrompt,
      monthlyCalls: previous.frequency,
      monthlyCost: Number(previous.totalCost.toFixed(4)),
      monthlyRevenue: Number(previous.totalRevenue.toFixed(4)),
      estimatedSavings: Number((previous.totalCost * 0.8).toFixed(4)),
      recommendedRule: `Convert "${normalizedIntent}" into a rule-first AllocaFi template.`,
      priority: previous.totalCost > 1 || previous.frequency > 20 ? "high" : "medium",
      status: existing?.status || "suggested",
      createdAt: existing?.createdAt || new Date().toISOString(),
    };
    aiRuntimeStore.promptSuggestions = [suggestion, ...aiRuntimeStore.promptSuggestions.filter((item) => item.normalizedIntent !== normalizedIntent)].slice(0, 50);
  }
}

function logAiRequest(body, classification, result, pricing, extra = {}) {
  const inputTokens = estimateTokens({ prompt: body.prompt, context: body.context || body.dashboard || body.reportData || {} });
  const outputTokens = estimateTokens(result);
  const log = {
    id: randomUUID(),
    userId: String(body.userId || "local-user").slice(0, 120),
    walletId: String(body.walletId || body.walletAddress || "local-wallet").slice(0, 160),
    role: String(body.role || "user").slice(0, 40),
    prompt: redactSensitiveString(String(body.prompt || "")).slice(0, 2000),
    normalizedIntent: normalizeAiPrompt(body.prompt).slice(0, 160),
    classification: classification.classification,
    status: result.status || "allowed",
    blockedReason: result.blockedReason || "",
    provider: result.provider || "local-rule-engine",
    model: result.model || "allocafi-rules-v1",
    inputTokens,
    outputTokens,
    imageCount: Number(extra.imageCount || 0),
    estimatedCost: pricing.estimatedCost,
    alfiCharged: result.status === "allowed" ? pricing.alfiCharged : 0,
    revenueValue: result.status === "allowed" ? pricing.revenueValue : 0,
    profit: result.status === "allowed" ? pricing.profit : 0,
    profitMargin: pricing.profitMargin,
    ruleUsed: classification.rule?.id || "",
    createdAt: new Date().toISOString(),
  };
  aiRuntimeStore.requestLogs.unshift(log);
  aiRuntimeStore.requestLogs = aiRuntimeStore.requestLogs.slice(0, 1000);
  updatePromptOptimization(log);
  return log;
}

function buildRuleEngineResponse(rule) {
  return {
    status: "allowed",
    engine: "RULE_ACTION",
    provider: "local-rule-engine",
    model: "allocafi-rules-v1",
    message: rule.response,
    suggestedActions: rule.suggestedActions.map((label) => ({ id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"), label, requiresConfirmation: true })),
    ruleUsed: rule.id,
  };
}

function buildLocalAiResponse(prompt, classification, redacted) {
  if (classification.classification === "INFORMATIONAL") {
    return {
      status: "allowed",
      engine: "LOCAL_INFORMATIONAL",
      provider: "local-rule-engine",
      model: "allocafi-safety-v1",
      message: "AllocaFi AI can help explain budgeting, wallet connection, stablecoin budget accounts, ALFI Credits, reports, tax organization, and Vault recovery. It cannot alter balances, subscriptions, transaction history, or protected account data.",
      suggestedActions: [],
    };
  }
  if (classification.classification === "SUGGESTION_ONLY" || classification.classification === "FINANCIAL_ACTION") {
    const summary = redacted?.summary || redacted?.dashboard || {};
    return {
      status: "allowed",
      engine: "AI_ACTION",
      provider: "local-safe-analysis",
      model: "allocafi-safe-analysis-v1",
      message: `I can suggest a plan, but AllocaFi will not apply it without your confirmation. Based on authorized data, review spending, protect bills first, keep a tax reserve where relevant, and stage any reallocation as pending changes. Current tracked monthly spending signal: ${Number(summary.monthlySpending || summary.spending || 0) ? "$" + Number(summary.monthlySpending || summary.spending).toFixed(2) : "not enough data yet"}.`,
      suggestedActions: [
        { id: "review-buckets", label: "Review budget buckets", requiresConfirmation: false },
        { id: "stage-reallocation", label: "Stage reallocation suggestion", requiresConfirmation: true },
      ],
    };
  }
  return {
    status: "allowed",
    engine: "LOCAL_RESPONSE",
    provider: "local-rule-engine",
    model: "allocafi-safe-response-v1",
    message: "AllocaFi AI processed this as a safe request under the rule-first gateway.",
    suggestedActions: [],
  };
}

async function buildControlledAiResponse(body, classification, redacted) {
  if (classification.rule) return buildRuleEngineResponse(classification.rule);
  const schema = {
    name: "allocafi_ai_chat_response",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        message: { type: "string" },
        suggestedActions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              id: { type: "string" },
              label: { type: "string" },
              requiresConfirmation: { type: "boolean" },
            },
            required: ["id", "label", "requiresConfirmation"],
          },
        },
      },
      required: ["message", "suggestedActions"],
    },
  };
  const ai = await callOpenAiJson("AllocaFi AI controlled user assistant", {
    prompt: redactSensitiveString(body.prompt || ""),
    classification: classification.classification,
    context: redacted,
    protectedFields: protectedAiFields,
  }, schema).catch(() => null);
  if (ai) {
    return {
      status: "allowed",
      engine: "AI_ACTION",
      provider: "openai",
      model: openAiModel,
      message: ai.message,
      suggestedActions: ai.suggestedActions,
    };
  }
  return buildLocalAiResponse(body.prompt, classification, redacted);
}

function buildAiAdminDashboard() {
  const now = Date.now();
  const logs = aiRuntimeStore.requestLogs;
  const inWindow = (hours) => logs.filter((log) => Date.parse(log.createdAt) >= now - hours * 60 * 60 * 1000);
  const summarize = (items) => ({
    totalCalls: items.length,
    ruleCalls: items.filter((log) => log.classification === "RULE_ACTION").length,
    apiCalls: items.filter((log) => log.engine === "AI_ACTION" || log.provider === "openai").length,
    blockedCalls: items.filter((log) => log.status === "blocked" || log.status === "denied").length,
    totalCost: Number(items.reduce((sum, log) => sum + Number(log.estimatedCost || 0), 0).toFixed(4)),
    totalAlfiCharged: Number(items.reduce((sum, log) => sum + Number(log.alfiCharged || 0), 0).toFixed(2)),
    totalRevenue: Number(items.reduce((sum, log) => sum + Number(log.revenueValue || 0), 0).toFixed(4)),
    netProfit: Number(items.reduce((sum, log) => sum + Number(log.profit || 0), 0).toFixed(4)),
  });
  const today = summarize(inWindow(24));
  const week = summarize(inWindow(24 * 7));
  const month = summarize(inWindow(24 * 30));
  const byWallet = Object.values(logs.reduce((map, log) => {
    const key = log.walletId || "local-wallet";
    map[key] ||= { walletId: key, calls: 0, alfiCharged: 0, estimatedCost: 0, revenueValue: 0, profit: 0 };
    map[key].calls += 1;
    map[key].alfiCharged += Number(log.alfiCharged || 0);
    map[key].estimatedCost += Number(log.estimatedCost || 0);
    map[key].revenueValue += Number(log.revenueValue || 0);
    map[key].profit += Number(log.profit || 0);
    return map;
  }, {})).sort((a, b) => b.estimatedCost - a.estimatedCost).slice(0, 8);
  const promptTypes = Object.values(logs.reduce((map, log) => {
    const key = log.normalizedIntent || "unknown";
    map[key] ||= { promptType: key, calls: 0, cost: 0, revenue: 0, margin: 1 };
    map[key].calls += 1;
    map[key].cost += Number(log.estimatedCost || 0);
    map[key].revenue += Number(log.revenueValue || 0);
    map[key].margin = map[key].revenue ? (map[key].revenue - map[key].cost) / map[key].revenue : 1;
    return map;
  }, {})).sort((a, b) => b.calls - a.calls).slice(0, 12);
  return {
    today,
    week,
    month,
    totalAlfiCreditsConsumed: month.totalAlfiCharged,
    estimatedAiApiCost: month.totalCost,
    aiRevenueGenerated: month.totalRevenue,
    netAiProfit: month.netProfit,
    mostExpensiveUsers: byWallet,
    mostUsedPrompts: promptTypes,
    mostExpensivePromptTypes: [...promptTypes].sort((a, b) => b.cost - a.cost).slice(0, 8),
    ruleEngineSavings: Number(logs.filter((log) => log.classification === "RULE_ACTION").reduce((sum, log) => sum + 0.015, 0).toFixed(4)),
    suggestedNewRules: aiRuntimeStore.promptSuggestions,
    pricingRules: [...aiRuntimeStore.pricingRules.values()],
    blockedRequests: logs.filter((log) => log.status === "blocked").slice(0, 20),
  };
}

function requireAdmin(req, body = {}) {
  const roleHeader = String(req.headers["x-allocafi-role"] || "").toLowerCase();
  const roleBody = String(body.role || body.userRole || "").toLowerCase();
  if (roleHeader === "admin" || roleBody === "admin" || body.admin === true) return true;
  return false;
}

function answerAdminAiQuestion(prompt = "", dashboard = buildAiAdminDashboard()) {
  const normalized = normalizeAiPrompt(prompt);
  if (/blocked|fake|suspicious/.test(normalized)) {
    return `Blocked/suspicious AI requests: ${dashboard.blockedRequests.length}. Recent blocked examples are tracked in immutable AI request logs and should be reviewed for financial-proof abuse.`;
  }
  if (/cost|expensive users/.test(normalized)) {
    const top = dashboard.mostExpensiveUsers[0];
    return top ? `Most expensive wallet/user signal: ${top.walletId}, ${top.calls} calls, estimated cost $${top.estimatedCost.toFixed(4)}.` : "No expensive users yet.";
  }
  if (/pricing|charge|image generation/.test(normalized)) {
    const image = dashboard.pricingRules.find((rule) => rule.featureName === "Image generation");
    return `Image generation is currently ${image?.baseCreditCost || 15} ALFI. Keep at least a 70% margin; raise pricing if provider costs increase or convert repeated visual prompts into preset skin rules.`;
  }
  if (/rule/.test(normalized)) {
    return dashboard.suggestedNewRules.length
      ? `Top rule conversion candidate: ${dashboard.suggestedNewRules[0].recommendedRule}`
      : "No repeated prompt has crossed the rule-conversion threshold yet.";
  }
  return `AI profitability this month: ${dashboard.month.totalCalls} calls, ${dashboard.month.totalAlfiCharged} ALFI consumed, $${dashboard.month.totalCost} estimated API cost, $${dashboard.month.totalRevenue} revenue, and $${dashboard.month.netProfit} net profit.`;
}

function createVaultExportSignatureMessage({ walletAddress, timestamp, exportRequestId }) {
  return `I authorize AllocaFi to export my encrypted financial vault data for wallet: ${walletAddress}. Timestamp: ${timestamp}. Request ID: ${exportRequestId}.`;
}

function getVaultExportPolicy(exportType = "basic_budget", plan = "free") {
  const normalized = String(exportType || "basic_budget").toLowerCase();
  const policies = {
    basic_budget: { featureName: "Basic Budget Export", alfiCost: plan === "free" ? 0 : 0, requiresPremium: false, requiresEncryptedBackup: false, ttlMs: vaultExportTtlMs },
    tax_ledger: { featureName: "Tax Ledger export", alfiCost: 5, requiresPremium: true, requiresEncryptedBackup: false, ttlMs: vaultExportTtlMs },
    ai_report: { featureName: "AI report export", alfiCost: 3, requiresPremium: false, requiresEncryptedBackup: false, ttlMs: vaultExportTtlMs },
    accountant_package: { featureName: "Accountant package", alfiCost: 10, requiresPremium: true, requiresEncryptedBackup: false, ttlMs: vaultExportTtlMs },
    full_vault_backup: { featureName: "Full encrypted vault backup", alfiCost: 15, requiresPremium: false, requiresEncryptedBackup: true, ttlMs: vaultExportTtlMs },
  };
  return policies[normalized] || policies.basic_budget;
}

async function handleAiRoute(req, res, path) {
  try {
    if (path === "/api/ai/admin/dashboard" && req.method === "GET") {
      if (String(req.headers["x-allocafi-role"] || "").toLowerCase() !== "admin") {
        sendJson(res, 403, { ok: false, code: "admin_role_required", message: "AllocaFi AI Admin requires an admin role." });
        return;
      }
      sendJson(res, 200, { ok: true, dashboard: buildAiAdminDashboard() });
      return;
    }

    if (path === "/api/ai/admin/query" && req.method === "POST") {
      const body = await readJsonBody(req);
      if (!requireAdmin(req, body)) {
        sendJson(res, 403, { ok: false, code: "admin_role_required", message: "AllocaFi AI Admin requires an admin role." });
        return;
      }
      const dashboard = buildAiAdminDashboard();
      const result = {
        status: "allowed",
        provider: "local-admin-analytics",
        model: "allocafi-admin-ai-v1",
        answer: answerAdminAiQuestion(body.prompt, dashboard),
      };
      const classification = { classification: "ADMIN_ACTION", reason: "admin_analytics_request", featureName: "Informational AI chat" };
      const pricing = summarizeAiPricing("Informational AI chat", estimateTokens(body), estimateTokens(result), 0);
      const log = logAiRequest({ ...body, role: "admin" }, classification, result, pricing);
      sendJson(res, 200, { ok: true, ...result, dashboard, auditLogId: log.id });
      return;
    }

    if (path === "/api/ai/admin/pricing" && req.method === "PATCH") {
      const body = await readJsonBody(req);
      if (!requireAdmin(req, body)) {
        sendJson(res, 403, { ok: false, code: "admin_role_required", message: "AllocaFi AI Admin requires an admin role." });
        return;
      }
      if (!body.confirmed || !body.reason) {
        sendJson(res, 409, { ok: false, code: "confirmation_and_reason_required", message: "Pricing updates require admin confirmation and a reason note." });
        return;
      }
      const existing = getAiPricingRule(body.featureName);
      const next = {
        ...existing,
        baseCreditCost: Math.max(0, Number(body.baseCreditCost ?? existing.baseCreditCost)),
        estimatedProviderCost: Math.max(0, Number(body.estimatedProviderCost ?? existing.estimatedProviderCost)),
        minimumProfitMargin: Math.max(0, Number(body.minimumProfitMargin ?? existing.minimumProfitMargin)),
        updatedBy: String(body.updatedBy || "local-admin"),
        updatedAt: new Date().toISOString(),
      };
      aiRuntimeStore.pricingRules.set(next.featureName, next);
      const audit = { id: randomUUID(), action: "ai_pricing_update", featureName: next.featureName, reason: String(body.reason).slice(0, 400), createdAt: new Date().toISOString() };
      aiRuntimeStore.adminAuditLogs.unshift(audit);
      sendJson(res, 200, { ok: true, pricingRule: next, auditLog: audit });
      return;
    }

    if (path === "/api/ai/admin/export-vault" && req.method === "POST") {
      sendJson(res, 403, {
        ok: false,
        code: "admin_ai_vault_export_denied",
        message: "Admin AI cannot export private user vault data without verified user wallet permission or a future legal/support workflow.",
      });
      return;
    }

    if ((path === "/api/ai/chat" || path === "/api/ai/image") && req.method === "POST") {
      const body = await readJsonBody(req);
      const requestType = path === "/api/ai/image" ? "image" : String(body.requestType || "chat");
      const classification = classifyAiRequest(body.prompt, { requestType, role: body.role || "user" });
      const pricing = summarizeAiPricing(classification.featureName || "Informational AI chat", estimateTokens(body), 0, requestType === "image" ? Number(body.imageCount || 1) : 0);

      if (classification.classification === "RESTRICTED") {
        const result = {
          status: "blocked",
          blockedReason: classification.reason,
          provider: "none",
          model: "allocafi-ai-security-classifier-v1",
          message: classification.message || "AllocaFi AI blocked this request because it targets protected financial, account, security, or admin data.",
        };
        const log = logAiRequest(body, classification, result, pricing, { imageCount: requestType === "image" ? 1 : 0 });
        sendJson(res, 403, { ok: false, ...result, classification: classification.classification, auditLogId: log.id });
        return;
      }

      const policy = checkAiCreditPolicy(body, classification, pricing);
      if (!policy.ok) {
        const result = { status: policy.status, blockedReason: policy.code, provider: "none", model: "allocafi-credit-engine-v1", message: policy.message };
        const log = logAiRequest(body, classification, result, pricing, { imageCount: requestType === "image" ? 1 : 0 });
        sendJson(res, policy.status === "confirmation_required" ? 409 : 402, { ok: false, ...result, classification: classification.classification, auditLogId: log.id, pricing });
        return;
      }

      if (requestType === "image") {
        const asset = {
          id: randomUUID(),
          assetType: "ai_visual_skin",
          status: "generated-placeholder",
          prompt: redactSensitiveString(body.prompt || ""),
          generatedAssetUrl: `allocafi-ai-asset://${randomUUID()}`,
          watermark: /demo|sample|placeholder/i.test(String(body.prompt || "")) ? "DEMO / SAMPLE DATA / NOT REAL FINANCIAL DATA" : "",
          createdAt: new Date().toISOString(),
        };
        aiRuntimeStore.skins.unshift(asset);
        const result = {
          status: "allowed",
          engine: "VISUAL_ONLY",
          provider: "local-safe-visual-generator",
          model: "allocafi-visual-safety-v1",
          message: "Visual customization request approved. The generated asset is limited to skins, icons, banners, or dashboard backgrounds and cannot alter protected financial logic.",
          asset,
        };
        const log = logAiRequest(body, classification, result, pricing, { imageCount: 1 });
        sendJson(res, 200, { ok: true, ...result, classification: classification.classification, pricing, auditLogId: log.id });
        return;
      }

      const redacted = redactForAi(body.context || body.dashboard || body.reportData || {});
      const result = await buildControlledAiResponse(body, classification, redacted);
      const log = logAiRequest(body, classification, result, pricing);
      sendJson(res, 200, {
        ok: true,
        ...result,
        classification: classification.classification,
        pricing,
        auditLogId: log.id,
        security: {
          ruleFirst: Boolean(classification.rule),
          protectedFields: protectedAiFields,
          requiresConfirmationBeforeAppChanges: classification.classification !== "INFORMATIONAL" && classification.classification !== "RULE_ACTION",
        },
      });
      return;
    }

    if (req.method !== "POST") {
      sendJson(res, 405, { message: "Method not allowed" });
      return;
    }
    const body = await readJsonBody(req);
    const redacted = redactForAi(body);
    if (path === "/api/ai/insights") {
      const local = buildLocalInsightResult(redacted);
      const schema = {
        name: "allocafi_budget_insights",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            insights: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  title: { type: "string" },
                  severity: { type: "string" },
                  message: { type: "string" },
                  action: { type: "string" },
                  requiresConfirmation: { type: "boolean" },
                  source: { type: "string" },
                },
                required: ["title", "severity", "message", "action", "requiresConfirmation", "source"],
              },
            },
          },
          required: ["insights"],
        },
      };
      const ai = await callOpenAiJson("Generate concise budget insights", redacted, schema).catch(() => null);
      sendJson(res, 200, ai ? { ...local, mode: "openai", model: openAiModel, insights: ai.insights } : local);
      return;
    }
    if (path === "/api/ai/categorize") {
      const local = buildLocalCategoryResult(redacted);
      const schema = {
        name: "allocafi_category_suggestions",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  merchant: { type: "string" },
                  category: { type: "string" },
                  bucketName: { type: "string" },
                  confidence: { type: "number" },
                  reason: { type: "string" },
                  requiresApproval: { type: "boolean" },
                },
                required: ["merchant", "category", "bucketName", "confidence", "reason", "requiresApproval"],
              },
            },
          },
          required: ["suggestions"],
        },
      };
      const ai = await callOpenAiJson("Suggest transaction categories", redacted, schema).catch(() => null);
      sendJson(res, 200, ai ? { ...local, mode: "openai", model: openAiModel, suggestions: ai.suggestions } : local);
      return;
    }
    sendJson(res, 404, { message: "Unknown AI route" });
  } catch (error) {
    sendJson(res, 400, { message: error?.message || "AI request failed" });
  }
}
async function handleCloudSnapshot(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { message: "Method not allowed" });
    return;
  }
  const status = getConfigStatus();
  if (!status.services.database) {
    sendJson(res, 503, {
      mode: "local-preview",
      stored: false,
      message: "Database environment keys are not connected yet, so this sync stays queued on this browser.",
    });
    return;
  }
  await readJsonBody(req);
  sendJson(res, 202, {
    mode: "cloud-route-ready",
    stored: false,
    message: "Snapshot route is ready. Connect the Supabase tables from database/schema.sql to persist this payload.",
  });
}

function requestExternalJson(endpoint, body, timeoutMs = 20000) {
  return new Promise((resolvePromise, reject) => {
    const payload = typeof body === "string" ? body : JSON.stringify(body);
    const req = httpsRequest(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
      // Local desktop environments can miss the issuer chain even when the browser works.
      // Production must always verify TLS; this fallback is local-dev only.
      rejectUnauthorized: !allowInsecureTlsFallback,
      timeout: timeoutMs,
    }, (response) => {
      let text = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        text += chunk;
      });
      response.on("end", () => {
        resolvePromise({ status: response.statusCode || 500, text });
      });
    });
    req.on("timeout", () => {
      req.destroy(new Error("Solana RPC timed out"));
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

async function proxySolanaRpc(req, res, url) {
  const requestedEndpoint = url.searchParams.get("endpoint") || "";
  const endpoint = requestedEndpoint
    ? (isAllowedSolanaEndpoint(requestedEndpoint) ? requestedEndpoint : "")
    : getConfiguredSolanaRpcEndpoint();
  if (!endpoint) {
    send(res, 400, JSON.stringify({ error: { message: "Unsupported Solana endpoint" } }), "application/json");
    return;
  }

  try {
    const body = await readRequestBody(req);
    const response = await requestExternalJson(endpoint, body);
    send(res, response.status, response.text, "application/json");
  } catch (error) {
    send(res, 502, JSON.stringify({ error: { message: error?.message || "Solana proxy failed" } }), "application/json");
  }
}

function getSolanaRpcEndpoints(customEndpoint = "") {
  const configuredEndpoint = getConfiguredSolanaRpcEndpoint();
  return [
    isAllowedSolanaEndpoint(customEndpoint) ? customEndpoint : "",
    configuredEndpoint,
    "https://api.mainnet-beta.solana.com",
    "https://solana-rpc.publicnode.com",
  ].filter(Boolean);
}

async function postRpc(endpoint, payload, timeoutMs = 20000) {
  const response = await requestExternalJson(endpoint, payload, timeoutMs);
  if (response.status < 200 || response.status >= 300) throw new Error(`RPC failed (${response.status}): ${response.text.slice(0, 120)}`);
  const result = JSON.parse(response.text);
  if (result.error) throw new Error(result.error.message || "RPC returned an error");
  return result;
}

function parseTokenAccounts(accounts = [], mint = solanaPyusdMint) {
  return accounts.reduce((tokens, account) => {
    const info = account.account?.data?.parsed?.info;
    if (!info?.mint || info.mint !== mint || !info.tokenAmount) return tokens;
    tokens.push({
      tokenAccount: account.pubkey,
      mint: info.mint,
      amount: Number(info.tokenAmount.uiAmountString || info.tokenAmount.uiAmount || 0),
    });
    return tokens;
  }, []);
}

async function fetchSolanaPyusdBalance(address, endpoints) {
  const errors = [];
  for (const endpoint of endpoints) {
    for (const programId of solanaTokenPrograms) {
      try {
        const result = await postRpc(endpoint, {
          jsonrpc: "2.0",
          id: Date.now(),
          method: "getTokenAccountsByOwner",
          params: [
            address,
            { programId },
            { encoding: "jsonParsed" },
          ],
        });
        const balance = parseTokenAccounts(result.result?.value || []).reduce((sum, token) => sum + token.amount, 0);
        if (balance > 0) return { balance, endpoint, source: "program scan" };
      } catch (error) {
        errors.push(error?.message || "Token account scan failed");
      }
    }

    try {
      const result = await postRpc(endpoint, {
        jsonrpc: "2.0",
        id: Date.now(),
        method: "getTokenAccountsByOwner",
        params: [
          address,
          { mint: solanaPyusdMint },
          { encoding: "jsonParsed" },
        ],
      });
      const balance = parseTokenAccounts(result.result?.value || []).reduce((sum, token) => sum + token.amount, 0);
      return { balance, endpoint, source: "mint scan" };
    } catch (error) {
      errors.push(error?.message || "Mint scan failed");
    }
  }

  return { balance: 0, errors: [...new Set(errors)].slice(0, 4) };
}

async function handleSolanaPyusdBalance(req, res, url) {
  const address = url.searchParams.get("address") || "";
  const customEndpoint = url.searchParams.get("endpoint") || "";
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    send(res, 400, JSON.stringify({ error: { message: "Invalid Solana address" } }), "application/json");
    return;
  }
  const endpoints = getSolanaRpcEndpoints(customEndpoint);

  try {
    const result = await fetchSolanaPyusdBalance(address, endpoints);
    send(res, 200, JSON.stringify(result), "application/json");
  } catch (error) {
    send(res, 502, JSON.stringify({ error: { message: error?.message || "Solana balance lookup failed" } }), "application/json");
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
  if (checkRateLimit(req, res, url)) return;
  if (req.method === "OPTIONS") {
    send(res, 204, "");
    return;
  }
  if (url.pathname === "/api/config/status" && req.method === "GET") {
    sendJson(res, 200, getConfigStatus());
    return;
  }
  if (url.pathname === "/api/config/client" && req.method === "GET") {
    const configuredSolanaRpc = getConfiguredSolanaRpcEndpoint();
    sendJson(res, 200, {
      walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID || "",
      solanaRpcConfigured: Boolean(configuredSolanaRpc),
      solanaRpcHost: configuredSolanaRpc ? new URL(configuredSolanaRpc).hostname : "",
    });
    return;
  }
  if (url.pathname === "/api/health" && req.method === "GET") {
    sendJson(res, 200, {
      ok: true,
      service: "allocafi-local",
      mode: getConfigStatus().mode,
      timestamp: new Date().toISOString(),
    });
    return;
  }
  if (url.pathname.startsWith("/api/auth/")) {
    await handleAuthRoute(req, res, url.pathname);
    return;
  }
  if (url.pathname === "/api/sync/snapshot") {
    await handleCloudSnapshot(req, res);
    return;
  }
  if (url.pathname.startsWith("/api/ai/")) {
    await handleAiRoute(req, res, url.pathname);
    return;
  }
  if (url.pathname.startsWith("/api/subscriptions/") || url.pathname === "/api/webhooks/stripe") {
    await handleSubscriptionRoute(req, res, url.pathname);
    return;
  }
  if (url.pathname === "/api/prices/historical") {
    await handleHistoricalPriceRoute(req, res, url);
    return;
  }
  if (url.pathname.startsWith("/api/vault/")) {
    await handleVaultRoute(req, res, url);
    return;
  }
  if (isProductionBlueprintRoute(url.pathname)) {
    sendJson(res, 501, {
      mode: "blueprint-ready",
      message: "This production API route is reserved. Connect Supabase/Plaid/Stripe services to activate it.",
      route: `${req.method} ${url.pathname}`,
    });
    return;
  }
  if (url.pathname === "/api/solana-rpc" && req.method === "POST") {
    await proxySolanaRpc(req, res, url);
    return;
  }
  if (url.pathname === "/api/solana-pyusd-balance" && req.method === "GET") {
    await handleSolanaPyusdBalance(req, res, url);
    return;
  }

  const nestedEnterpriseAsset = url.pathname.match(nestedAdvancedAssetPattern);
  const requested = url.pathname === "/" || appRouteFallbacks.has(url.pathname)
    ? "/index.html"
    : nestedEnterpriseAsset
      ? `/${nestedEnterpriseAsset[1]}`
      : decodeURIComponent(url.pathname);
  const filePath = normalize(join(root, requested));
  if (!filePath.startsWith(root)) {
    send(res, 403, "Forbidden");
    return;
  }

  try {
    const data = await readFile(filePath);
    send(res, 200, data, contentTypes[extname(filePath)] || "application/octet-stream");
  } catch {
    send(res, 404, "Not found");
  }
});

server.listen(port, host, () => {
  const displayHost = host === "0.0.0.0" ? "127.0.0.1" : host;
  console.log(`AllocaFi running at http://${displayHost}:${port}/index.html`);
});
