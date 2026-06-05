import { createServer } from "node:http";
import { request as httpsRequest } from "node:https";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(".");
const port = Number(process.env.PORT || 8765);
const solanaPyusdMint = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";
const solanaTokenPrograms = [
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  "TokenzQdBNbLqP5VEhdkAS6EPzYm3S5FWnW7zWuCxgu",
];
const solanaAllowlist = new Set([
  "https://api.mainnet-beta.solana.com",
  "https://solana-rpc.publicnode.com",
]);
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
  });
  res.end(body);
}

function sendJson(res, status, payload) {
  send(res, status, JSON.stringify(payload), "application/json");
}

async function readRequestBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
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
  };
  return {
    mode: services.auth && services.database ? "production-ready" : "local-preview",
    configured: Object.values(services).some(Boolean),
    services,
    requiredForPhase1: ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "DATABASE_URL"],
    optionalNext: ["PLAID_CLIENT_ID", "PLAID_SECRET", "STRIPE_SECRET_KEY", "OPENAI_API_KEY", "WALLETCONNECT_PROJECT_ID"],
  };
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
    /^\/api\/dashboard\/unified/,
    /^\/api\/budget\/monthly/,
    /^\/api\/plaid\//,
    /^\/api\/bank\//,
    /^\/api\/family\//,
    /^\/api\/business\//,
    /^\/api\/rewards\//,
    /^\/api\/admin\//,
  ].some((pattern) => pattern.test(path));
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
      // This is for the local dev proxy only; production should use a proper CA bundle.
      rejectUnauthorized: false,
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
  if (!solanaAllowlist.has(endpoint) && !/^https:\/\/.+/i.test(endpoint || "")) {
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
  const endpoints = [
    customEndpoint,
    "https://api.mainnet-beta.solana.com",
    "https://solana-rpc.publicnode.com",
  ].filter(Boolean);

  try {
    const result = await fetchSolanaPyusdBalance(address, endpoints);
    send(res, 200, JSON.stringify(result), "application/json");
  } catch (error) {
    send(res, 502, JSON.stringify({ error: { message: error?.message || "Solana balance lookup failed" } }), "application/json");
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
  if (req.method === "OPTIONS") {
    send(res, 204, "");
    return;
  }
  if (url.pathname === "/api/config/status" && req.method === "GET") {
    sendJson(res, 200, getConfigStatus());
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

server.listen(port, "127.0.0.1", () => {
  console.log(`AllocaFi running at http://127.0.0.1:${port}/index.html`);
});
