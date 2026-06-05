import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [server, app, schema, renderConfig, packageJson] = await Promise.all([
  readFile(new URL("../server.js", import.meta.url), "utf8"),
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../database/schema.sql", import.meta.url), "utf8"),
  readFile(new URL("../render.yaml", import.meta.url), "utf8"),
  readFile(new URL("../package.json", import.meta.url), "utf8"),
]);

assert.match(server, /Content-Security-Policy/, "server should send a CSP header");
assert.match(server, /checkRateLimit/, "server should include rate limiting");
assert.doesNotMatch(server, /Access-Control-Allow-Origin": "\*"/, "CORS must not be wildcard");
assert.doesNotMatch(server, /!\^https:\\\/\\\/\.\+\/i\.test/, "Solana proxy must not allow arbitrary HTTPS endpoints");
assert.match(server, /rejectUnauthorized: !allowInsecureTlsFallback/, "TLS verification must be enabled outside local fallback mode");
assert.match(server, /isProduction \? "0\.0\.0\.0" : "127\.0\.0\.1"/, "production server must bind for hosted environments");
assert.match(server, /SOLANA_RPC_URL/, "server should support production Solana RPC environment variables");
assert.match(server, /\/api\/config\/client/, "server should expose only safe public client config");
assert.match(server, /handleAiRoute/, "server should expose a controlled AI gateway route");
assert.match(server, /redactForAi/, "AI requests must be redacted before provider calls");
assert.match(server, /OPENAI_API_KEY/, "OpenAI access must stay backend-only through environment variables");
assert.match(server, /api-key=\[redacted\]/, "AI redaction should hide RPC API keys");

assert.doesNotMatch(
  app,
  /localStorage\.setItem\(VAULT_AUTO_PASSWORD_KEY/,
  "Vault Auto Snapshot password must not be stored in localStorage"
);
assert.match(app, /hasForbiddenSecretFields/, "imports should reject private-key and seed-phrase fields");
assert.match(app, /validateVaultPayloadData/, "Vault restore should validate decrypted payload structure");
assert.match(app, /collectAiBudgetSnapshot/, "frontend should send summarized budget snapshots to the AI gateway");
assert.match(app, /refreshAiInsights/, "dashboard should be able to refresh AI insights");
assert.match(app, /openAiCategoryDialog/, "activity view should support AI category suggestions");
assert.match(app, /hydrateClientConfig/, "frontend should hydrate safe public deploy config");

assert.match(renderConfig, /healthCheckPath: \/api\/health/, "Render should check the app health route");
assert.match(renderConfig, /npm test && npm run build/, "Render build should run tests before packaging");
assert.match(renderConfig, /SOLANA_RPC_URL/, "Render config should expose Solana RPC setup");
assert.match(renderConfig, /OPENAI_API_KEY/, "Render config should expose OpenAI setup");
assert.match(packageJson, /"node": ">=20"/, "package should declare a modern Node runtime");

[
  "user_profiles",
  "wallet_metadata",
  "bucket_balances",
  "transaction_categories",
  "reports",
  "vault_backups",
  "vault_activity",
  "ai_memory",
  "onboarding_sessions",
  "service_events",
  "feature_flags",
].forEach((table) => {
  assert.match(schema, new RegExp(`create table if not exists public\\.${table}`), `${table} table should exist`);
  assert.match(schema, new RegExp(`alter table public\\.${table} enable row level security`), `${table} should enable RLS`);
});

console.log("Security and schema checks passed");
