import { createServer } from "node:http";
import { request as httpsRequest } from "node:https";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(".");
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
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
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

function envSet(name) {
  return Boolean(process.env[name] && !String(process.env[name]).includes("replace_"));
}

function getConfigStatus() {
  const services = {
    auth: envSet("SUPABASE_URL") && envSet("SUPABASE_ANON_KEY"),
    database: envSet("DATABASE_URL") || (envSet("SUPABASE_URL") && envSet("SUPABASE_SERVICE_ROLE_KEY")),
    plaid: envSet("PLAID_CLIENT_ID") && envSet("PLAID_SECRET"),
    stripe: envSet("STRIPE_SECRET_KEY") && envSet("STRIPE_WEBHOOK_SECRET"),
    openai: envSet("OPENAI_API_KEY"),
    walletConnect: envSet("WALLETCONNECT_PROJECT_ID"),
    solanaRpc: envSet("SOLANA_RPC_URL") || envSet("HELIUS_RPC_URL") || envSet("ALCHEMY_SOLANA_RPC_URL"),
  };
  return {
    mode: services.auth && services.database ? "production-ready" : "local-preview",
    configured: Object.values(services).some(Boolean),
    services,
    requiredForPhase1: ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "DATABASE_URL"],
    optionalNext: ["SOLANA_RPC_URL", "HELIUS_RPC_URL", "ALCHEMY_SOLANA_RPC_URL", "OPENAI_API_KEY", "WALLETCONNECT_PROJECT_ID", "PLAID_CLIENT_ID", "PLAID_SECRET", "STRIPE_SECRET_KEY"],
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
      message: `You have new funds waiting to be assigned. Allocate them before relying on bucket balances.`,
      action: "Open Assign Money",
      requiresConfirmation: true,
      source: "local-ai",
    });
  }
  if (Number(summary.pendingSpend || dashboard.pendingSpend || 0) > 0.01) {
    insights.push({
      title: "Unassigned spending",
      severity: "action",
      message: "Some spending is not tied to a Virtual Bucket Account yet. Categorize it or mark it as personal liquidation.",
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
      title: "Wallet buckets need refresh",
      severity: "warning",
      message: "Some Virtual Bucket Accounts are higher than the real wallet balance. Refresh VBAs to match the wallet.",
      action: "Refresh VBAs",
      requiresConfirmation: true,
      source: "local-ai",
    });
  }
  if (Number(summary.stablecoinTotal || 0) > 0) {
    insights.push({
      title: "Stablecoin budget active",
      severity: "info",
      message: "Stablecoin balances are being tracked. Bucket sends should be recorded from the selected account to keep the budget accurate.",
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

async function handleAiRoute(req, res, path) {
  if (req.method !== "POST") {
    sendJson(res, 405, { message: "Method not allowed" });
    return;
  }
  try {
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
  const endpoint = url.searchParams.get("endpoint");
  if (!isAllowedSolanaEndpoint(endpoint)) {
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
  const configuredEndpoint = process.env.SOLANA_RPC_URL || process.env.HELIUS_RPC_URL || process.env.ALCHEMY_SOLANA_RPC_URL || "";
  return [
    isAllowedSolanaEndpoint(customEndpoint) ? customEndpoint : "",
    isAllowedSolanaEndpoint(configuredEndpoint) ? configuredEndpoint : "",
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
    sendJson(res, 200, {
      walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID || "",
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

  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
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
