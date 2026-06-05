import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const [server, app, schema, renderConfig, packageJson, ledgerCore, ledgerTypes, copyAssets] = await Promise.all([
  readFile(new URL("../server.js", import.meta.url), "utf8"),
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../database/schema.sql", import.meta.url), "utf8"),
  readFile(new URL("../render.yaml", import.meta.url), "utf8"),
  readFile(new URL("../package.json", import.meta.url), "utf8"),
  readFile(new URL("../ledgercore-core.js", import.meta.url), "utf8"),
  readFile(new URL("../ledgercore-types.d.ts", import.meta.url), "utf8"),
  readFile(new URL("../scripts/copy-web-assets.mjs", import.meta.url), "utf8"),
]);
const styles = await readFile(new URL("../styles.css", import.meta.url), "utf8");
const [usdtReferenceLogo, usdsReferenceLogo] = await Promise.all([
  stat(new URL("../assets/reference-icons/stablecoins/usdt-reference.png", import.meta.url)),
  stat(new URL("../assets/reference-icons/stablecoins/usds-reference.png", import.meta.url)),
]);

assert.match(server, /Content-Security-Policy/, "server should send a CSP header");
assert.match(server, /checkRateLimit/, "server should include rate limiting");
assert.doesNotMatch(server, /Access-Control-Allow-Origin": "\*"/, "CORS must not be wildcard");
assert.doesNotMatch(server, /!\^https:\\\/\\\/\.\+\/i\.test/, "Solana proxy must not allow arbitrary HTTPS endpoints");
assert.match(server, /rejectUnauthorized: !allowInsecureTlsFallback/, "TLS verification must be enabled outside local fallback mode");
assert.match(server, /isProduction \? "0\.0\.0\.0" : "127\.0\.0\.1"/, "production server must bind for hosted environments");
assert.match(server, /SOLANA_RPC_URL/, "server should support production Solana RPC environment variables");
assert.match(server, /\/api\/config\/client/, "server should expose only safe public client config");
assert.match(server, /handleVaultRoute/, "server should expose Vault 2.0 zero-knowledge routes");
assert.match(server, /\/api\/vault\/challenge/, "Vault 2.0 should create wallet signature challenges");
assert.match(server, /safe-verification/, "Vault signature challenges should classify safe verification requests");
assert.match(server, /verifySignature/, "Vault 2.0 should verify Solana Ed25519 wallet signatures server-side");
assert.match(server, /external_evm_verifier_required/, "Production EVM Vault verification should require an external verifier");
assert.match(server, /Vault 2\.0 only accepts encrypted payload references/, "Vault 2.0 routes must reject plaintext app data");
assert.match(server, /handleAiRoute/, "server should expose a controlled AI gateway route");
assert.match(server, /redactForAi/, "AI requests must be redacted before provider calls");
assert.match(server, /OPENAI_API_KEY/, "OpenAI access must stay backend-only through environment variables");
assert.match(server, /api-key=\[redacted\]/, "AI redaction should hide RPC API keys");
assert.match(server, /classifyAiRequest/, "AllocaFi AI must classify every request before execution");
assert.match(server, /restrictedAiImageMessage/, "Image safety should show the required blocked financial-proof message");
assert.match(server, /RULE_ACTION/, "Rule-first AI router should classify built-in templates");
assert.match(server, /checkAiCreditPolicy/, "ALFI Credit Engine should enforce credit balance, limits, and confirmations");
assert.match(server, /high_cost_confirmation_required/, "High-cost AI actions should require confirmation before charging ALFI");
assert.match(server, /\/api\/ai\/admin\/dashboard/, "AllocaFi AI Admin dashboard route should exist");
assert.match(server, /admin_role_required/, "AI Admin routes should deny non-admin access");
assert.match(server, /admin_ai_vault_export_denied/, "Admin AI must not export private user vault data");
assert.match(server, /updatePromptOptimization/, "Repeated prompts should create rule conversion suggestions");
assert.match(server, /logAiRequest/, "AI requests should be audit logged with cost and ALFI usage");
assert.match(server, /ai_pricing_update/, "Admin pricing updates should create audit logs");
assert.match(server, /\/api\/vault\/export\/challenge/, "Vault export should require a signature challenge");
assert.match(server, /wallet_signature_required/, "Vault export must deny wallet-address-only requests");
assert.match(server, /wrong_wallet/, "Vault export must deny a connected wallet mismatch");
assert.match(server, /Full vault backup exports must be encrypted/, "Full Vault backup exports must be encrypted");
assert.match(server, /privateVaultDataExposedToAdminAnalytics: false/, "Admin analytics must remain separate from private vault data");

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
assert.match(app, /VAULT2_OWNER_WALLET_KEY/, "Vault 2.0 should store Owner Wallet metadata locally");
assert.match(app, /classifyVaultSignatureRequest/, "Vault 2.0 should classify wallet signature requests");
assert.match(app, /confirmWalletRequestSafety/, "Wallet sends should warn before transaction approvals");
assert.match(app, /createVault2Snapshot/, "Vault 2.0 should create encrypted snapshot records");
assert.match(app, /encryptedAssetRef/, "Vault 2.0 should track encrypted AI asset references");
assert.match(app, /Your Owner Wallet protects access to your encrypted AllocaFi Vault/, "Settings should warn users about Owner Wallet recovery");
assert.match(app, /AllocaFi AI/, "Dashboard should expose the AllocaFi AI branded assistant");
assert.match(app, /runAllocafiAiPrompt/, "User AI chat should run through the controlled AI prompt flow");
assert.match(app, /classifyAllocafiAiPrompt/, "Frontend should mirror the AI security classifier before requests");
assert.match(app, /This action costs \$\{credits\} ALFI Credits\. Continue\?/, "High-cost AI actions should show ALFI confirmation");
assert.match(app, /requestSecureVaultExport/, "Vault exports should go through secure wallet ownership verification");
assert.match(app, /Wallet address alone never unlocks private financial data/, "Vault export UI should warn against address-only export");
assert.match(app, /DEMO \/ SAMPLE DATA \/ NOT REAL FINANCIAL DATA|demo|sample/i, "Demo visual generation should support sample-data watermarking");
assert.match(app, /adminControls:\s*\{[\s\S]*?adminPowerEnabled:\s*false/, "Admin Power should default off for new users");
assert.match(app, /const ADMIN_ENTITLEMENTS = \{[\s\S]*?transfers:\s*true/, "Admin Power should unlock full local entitlements");
assert.match(app, /if \(isAdminPowerEnabled\(\)\) return ADMIN_ENTITLEMENTS;/, "Entitlement checks should respect Admin Power");
assert.match(app, /id === "pay" \? "hidden" : ""/, "AllocaFi Pay settings launcher should be hidden by default");
assert.match(app, /\["#admin", "#settings-admin"\]\.includes/, "Admin controls should support a direct settings route");
assert.match(app, /replaceState\(\{ tab: "overview" \}/, "Blocked Pay routes should clear back to the overview route");
assert.match(app, /className: "account-balance-money"/, "Accounts tab balances should use the large guarded money style");
assert.match(app, /ledgercore: \["AllocaFi LedgerCore&trade;"/, "LedgerCore should appear in Advanced Systems settings");
assert.match(app, /data-panel="ledgercore"/, "LedgerCore should have a full application panel");
assert.match(app, /renderAllocaFiLedgerCore\(\)/, "Main render loop should refresh LedgerCore");
assert.match(copyAssets, /ledgercore-core\.js/, "Build should copy the LedgerCore logic module");
assert.match(copyAssets, /ledgercore-ui\.js/, "Build should copy the LedgerCore UI module");
assert.match(ledgerTypes, /interface LedgerTransaction/, "LedgerCore should define LedgerTransaction data model");
assert.match(ledgerTypes, /interface LedgerCoreSettings/, "LedgerCore should define settings data model");
assert.match(ledgerCore, /Possible tax deductible expense .{1,3} review before export\./, "LedgerCore should use the required tax review wording");
assert.doesNotMatch(`${app}\n${ledgerCore}`, /Guaranteed tax write-off/i, "LedgerCore must not promise guaranteed write-offs");
assert.match(packageJson, /"node": ">=20"/, "package should declare a modern Node runtime");
assert.match(app, /const STABLECOIN_LOGOS = \{[\s\S]*?PYUSD:[\s\S]*?USDT:[\s\S]*?USDC:[\s\S]*?USDS:[\s\S]*?DAI:/, "Stablecoin logos should be centralized for accurate rendering");
assert.match(app, /name: "Sky Dollar"/, "USDS should use Sky Dollar reference metadata");
assert.match(app, /logoImage: `\$\{STABLECOIN_LOGO_ASSET_PATH\}\/usdt-reference\.png`/, "USDT should render from its saved reference image asset");
assert.match(app, /logoImage: `\$\{STABLECOIN_LOGO_ASSET_PATH\}\/usds-reference\.png`/, "USDS should render from its saved reference image asset");
assert.match(app, /stablecoin-logo-reference/, "Stablecoin renderer should prefer reference image assets over approximated marks");
assert.ok(usdtReferenceLogo.size > 1000, "USDT reference logo asset should be saved");
assert.ok(usdsReferenceLogo.size > 1000, "USDS reference logo asset should be saved");
assert.match(app, /renderStablecoinLogo\(stablecoinMeta\.symbol\)/, "VBA balance coins should use canonical stablecoin logos");
assert.match(app, /renderStablecoinLogo\(coin\.asset\)/, "Enterprise stablecoin breakdown should use canonical stablecoin logos");
assert.match(app, /renderStablecoinLiquidityMonitor\(details\)/, "Liquidity monitor should receive wallet stablecoin balances");
assert.match(app, /renderStablecoinLogo\(coin\.symbol, coin\.symbol, \{ className: "liquidity-coin-logo" \}\)/, "Liquidity monitor should keep visible coin logos");
assert.match(app, /Wallet balance[\s\S]*?coin\.walletBalance/, "Liquidity monitor should show per-coin wallet balances");
assert.match(styles, /\.liquidity-range-tabs \{[\s\S]*?justify-self: stretch;[\s\S]*?width: 100%;/, "Liquidity range tabs should stretch to the chart width");
assert.doesNotMatch(styles, /\.liquidity-range-tabs \{[\s\S]*?width: min\(100%, 340px\);/, "Liquidity range tabs should not shrink into a short pill");
assert.match(styles, /\.stablecoin-mini-logo \{[\s\S]*?height: 46px;/, "Liquidity monitor coin cards should reserve space for visible coin logos");
assert.match(styles, /\.stablecoin-mini-balance \{[\s\S]*?grid-template-columns: minmax\(0, 1fr\) max-content;/, "Liquidity monitor should keep balance information visible and aligned");
assert.match(app, /function getMonthlyExpenseBaseline/, "Monthly dashboard should centralize expense baseline logic");
assert.match(app, /function renderMonthlyStatIcon/, "Monthly dashboard metric cards should use explicit fintech icons");
assert.match(app, /function renderOverviewPanelIcon/, "Overview dashboard panels should use reusable fintech icons");
assert.doesNotMatch(app, /<span class="(?:ratio-card-icon|upcoming-bills-icon|monthly-flow-icon|flow-row-icon|insight-icon[^"\n]*)">\?<\/span>/, "Overview panel icons should not render question mark placeholders");
assert.match(app, /aria-label="Budget accounts">\$\{renderOverviewPanelIcon\("accounts"\)\}<\/i>/, "VBA summary account metric should use a real icon");
assert.match(app, /aria-label="Average balance">\$\{renderOverviewPanelIcon\("average"\)\}<\/i>/, "VBA summary average metric should use a real icon");
assert.match(app, /aria-label="Largest budget account">\$\{renderOverviewPanelIcon\("largest"\)\}<\/i>/, "VBA summary largest metric should use a real icon");
assert.match(app, /function renderBudgetAccountIcon/, "VBA summary rows should use dedicated SVG budget account icons");
assert.match(app, /\$\{renderBudgetAccountIcon\(row\.bucket\.name\)\}/, "VBA summary rows should render SVG icons instead of text glyphs");
assert.doesNotMatch(app, /getBucketIcon\(row\.bucket\.name\)/, "VBA summary rows should not render emoji-style bucket icons");
assert.doesNotMatch(app, /return "\?+";/, "Legacy budget account icon helpers should not return question mark placeholders");
assert.match(app, /<span class="upcoming-bill-icon">\$\{getUpcomingBillIcon\(row\.bill\.name\)\}<\/span>/, "Upcoming bill rows should render category icons directly");
assert.match(app, /return renderOverviewPanelIcon\("housing"\)/, "Upcoming bill icon helper should use category SVGs");
assert.match(app, /class="bill-status-card[\s\S]{0,240}renderOverviewPanelIcon\(statusTone === "alert" \? "alert" : statusTone === "due" \? "calendar" : "check"\)/, "Upcoming bill status should use explicit status icons");
assert.match(app, /class="monthly-flow-icon"[\s\S]{0,90}renderOverviewPanelIcon\("flow"\)/, "Monthly money flow should use a flow icon");
assert.doesNotMatch(app, /<i[^>]*>\?<\/i>/, "VBA summary metric pills should not render question mark placeholders");
assert.doesNotMatch(app, /<span>\?<\/span>|\? Non-Custodial|<em>\? /, "Visible dashboard badges should not use question mark placeholders");
assert.match(app, /function getMoneyFlowDisplayMetrics/, "Monthly money flow should use explicit measurement metrics");
assert.match(app, /scaleLabel = flowTotal > 0 \? `Total tracked flow: \$\{formatUsd\(flowTotal\)\}`/, "Monthly money flow should disclose the total measured flow");
assert.match(app, /style="width:\$\{flow\.inShare\}%"/, "Money In strip bar width should match its share of total flow");
assert.match(app, /style="width:\$\{flow\.outShare\}%"/, "Money Out strip bar width should match its share of total flow");
assert.match(app, /class="flow-row-summary"[\s\S]{0,120}<strong>Money In<\/strong>/, "Compact monthly flow labels should sit beside their symbols");
assert.match(styles, /\.monthly-flow-compact \{[\s\S]*?grid-template-columns: 46px minmax\(0, 1fr\) minmax\(58px, max-content\);/, "Compact monthly flow cards should give Money In and Money Out equal space");
assert.match(styles, /\.monthly-flow-compact > i \{[\s\S]*?grid-column: 1 \/ -1;/, "Compact monthly flow tracks should start at the edge of each card");
assert.match(styles, /\.flow-scale-caption \{[\s\S]*?grid-column: 1 \/ -1;/, "Monthly flow captions should align with the full-width track");
assert.match(styles, /\.monthly-flow-row \{[\s\S]*?grid-template-columns: 58px minmax\(130px, 182px\) minmax\(180px, 1fr\) 48px;/, "Monthly flow bars should start close to the Money In and Money Out text");
assert.match(styles, /\.monthly-flow-track \{[\s\S]*?grid-column: 3;/, "Monthly flow track should sit directly after the label/value copy on desktop");
assert.match(app, /function getTransactionFlowDirection/, "Transaction logs should classify money in, money out, and internal movements");
assert.match(app, /type === "auto-allocation"[\s\S]*?return "in"/, "Auto allocation should be treated as budget funding, not money out");
assert.match(app, /function getTransactionReceiptId/, "Transaction logs should generate professional receipt IDs");
assert.match(app, /function getCurrentBudgetCycleSummary/, "Budget cycle analytics should summarize the active weekly cycle");
assert.match(app, /receipt-ledger-summary/, "Activity tab should render a receipt-style transaction summary");
assert.match(app, /transaction-receipt-modal/, "Users should be able to open a full digital receipt");
assert.match(styles, /\.receipt-log-row \{[\s\S]*?grid-template-columns: 92px minmax\(0, 1fr\) minmax\(170px, auto\);/, "Receipt rows should use an advanced fintech layout");
assert.match(styles, /\.weekly-cycle-control-card \{[\s\S]*?grid-template-columns: repeat\(3, minmax\(0, 1fr\)\);/, "Overview money flow should show weekly budget-cycle controls");
assert.match(styles, /\.overview-icon-svg \{[\s\S]*?stroke: currentColor;/, "Overview dashboard icons should render as styled SVGs");
assert.match(styles, /\.vba-icon \.overview-icon-svg \{[\s\S]*?stroke: rgba\(255, 255, 255, 0\.94\);/, "VBA row SVG icons should render crisply inside the card tiles");
assert.doesNotMatch(app, /icon: "\?",\n\s+label: "(?:Cashflow|Allocated Funds|Emergency Reserve)"/, "Monthly dashboard metric icons should not render question mark placeholders");
assert.match(styles, /\.monthly-stat-svg \{[\s\S]*?stroke: currentColor;/, "Monthly dashboard metric icons should render as styled SVGs");
assert.match(app, /listedBills > 0/, "Emergency reserve analytics should prioritize listed bill amounts");
assert.match(app, /Add bill amounts to calculate coverage/, "Reserve coverage should avoid false precision when no expense baseline exists");
assert.match(app, /Budget accounts/, "VBA summary metric labels should be user-readable");
assert.match(app, /Average balance/, "VBA summary should explain average budget account balance clearly");
assert.match(app, /Largest budget account/, "VBA summary should explain the largest budget account metric clearly");
assert.match(styles, /grid-template-columns: repeat\(auto-fit, minmax\(150px, 1fr\)\)/, "VBA summary metric cards should wrap before labels crowd");
assert.match(styles, /\.vba-row-main small \{[\s\S]*?text-overflow: ellipsis;/, "VBA budget account source text should not overlap amount columns");
assert.match(styles, /Keep budget account rows using the full summary card height/, "VBA summary should document that the bucket list must use the full card height");
assert.match(styles, /\.vba-account-list\.scrollable \{[\s\S]*?max-height: none;/, "Scrollable VBA summary rows should fill the full card instead of leaving bottom gaps");
assert.doesNotMatch(styles, /\.vba-account-list\.scrollable \{[\s\S]*?max-height: 620px;/, "Scrollable VBA summary rows must not be capped to a shorter height");
assert.match(styles, /img\.stablecoin-logo-reference \{[\s\S]*?object-fit: contain;/, "Reference stablecoin image assets should render as circular logos");
assert.match(
  app,
  /connectWalletButton\?\.[\s\S]{0,220}openStablecoinAddressEntry/,
  "Overview wallet action should open address-only onboarding"
);
assert.doesNotMatch(
  app,
  /connectWalletButton\?\.[\s\S]{0,260}openWalletConnectDialog/,
  "Overview wallet action must not open a wallet-provider connect prompt"
);


assert.match(app, /Asset Ratio & Legal Core Tracker/, "Asset Ratio dashboard card should be renamed in place");
assert.match(app, /SUPPORTED_RESERVE_ASSETS = \["BTC", "ETH", "SOL", "LTC", "ADA", "XRP", "AVAX", "HBAR", "BNB", "POL"\]/, "Supported reserve assets should be centralized");
for (const [asset, priceId] of Object.entries({
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
})) {
  assert.match(server, new RegExp(`${asset}: "${priceId}"`), `${asset} should have a Legal Core historical price provider id`);
  assert.match(app, new RegExp(`${asset}: \\{[\\s\\S]{0,220}priceId: "${priceId}"`), `${asset} should have matching frontend Legal Core price metadata`);
}
assert.match(server, /fetchHistoricalPriceProvider/, "Historical price provider should be wrapped for retry and throttling");
assert.match(server, /response\.status === 429/, "Historical price provider should handle rate limits");
assert.match(app, /function renderVirtualAssetAccountsSection/, "Virtual Asset Accounts should organize wealth inside Wallets & Accounts");
assert.match(app, /Budget Accounts organize spending\. Asset Accounts organize wealth\./, "Accounts UI should teach the budget-vs-asset split");
assert.match(app, /data-open-asset-account/, "Dashboard asset rows should open Virtual Asset Accounts instead of send screens");
assert.match(app, /function openAssetAccountSendDialog/, "Asset sends should only be initiated inside Asset Accounts");
assert.match(app, /Review Wallet Signature/, "Asset send flow should require wallet signature review");
assert.match(app, /classifyAssetTransaction/, "Legal Core should classify outgoing asset transactions");
assert.match(app, /DEX Swap[\s\S]*?Confirmed Disposal/, "DEX swaps should classify as confirmed disposals");
assert.match(app, /Stablecoin Conversion[\s\S]*?Confirmed Sale/, "Stablecoin conversions should classify as confirmed sales");
assert.match(app, /Wallet Transfer[\s\S]*?Movement Only[\s\S]*?No Disposal/, "Wallet transfers should classify as movement only with no disposal");
assert.match(app, /function getHistoricalAssetPrice/, "Historical Price Engine should store and reuse acquisition pricing");
assert.match(server, /\/api\/prices\/historical/, "Server should expose a backend-only historical price lookup route");
assert.match(server, /coingecko_market_chart_range/, "Historical price lookup should label CoinGecko market estimates");
assert.match(app, /function ensureLegalCoreHistoricalPrice/, "Legal Core should fetch historical prices before using receipt cost basis estimates");
assert.match(app, /priceSource:\s*"needs_verification"/, "Legal Core should mark missing purchase prices as needing verification");
assert.match(app, /if \(!stored\.priceSource && meta\.fallbackPrice && Math\.abs\(storedPrice - Number\(meta\.fallbackPrice\)\) < 0\.000001\) return null;/, "Legacy fallback prices should not be treated as verified historical prices");
assert.match(app, /unrealizedGain:\s*costBasis > 0 \? Math\.max\(currentValue - costBasis, 0\) : 0/, "Legal Core must not show false unrealized gains when cost basis is missing");
assert.match(app, /summary\.totalGain \+= legal\?\.costBasis > 0 \? Number\(account\.currentValue \|\| 0\) - Number\(legal\.costBasis \|\| 0\) : 0;/, "Asset summary gain/loss should require verified or estimated cost basis");
assert.doesNotMatch(app, /function getHistoricalAssetPrice[\s\S]{0,220}getAssetCurrentPrice/, "Historical purchase price must not fall back to current/fallback market price");
assert.doesNotMatch(app, /wallet\.assetAccount\?\.costBasis \|\| wallet\.costBasis \|\| currentValue/, "Wallet-derived cost basis must not default to current value");
assert.match(app, /buildTaxLedgerAssetRecords/, "Tax Ledger Core should receive asset gain/loss records");
assert.match(app, /buildVaultAssetExportStructure/, "Vault export structure should include Asset Accounts, Legal Core, Tax Ledger, and Reports");
assert.doesNotMatch(app, /asset-ratio-legal-core-card[\s\S]{0,5000}account-send/, "Dashboard Asset Ratio card must not expose send buttons");
assert.match(schema, /create table if not exists public\.virtual_asset_accounts/, "Virtual Asset Accounts table should exist");
assert.match(schema, /create table if not exists public\.asset_legal_core_records/, "Legal Core asset records table should exist");
assert.match(schema, /create table if not exists public\.asset_transaction_classifications/, "Asset classification table should exist");
assert.match(schema, /create table if not exists public\.asset_historical_prices/, "Historical price table should exist");
assert.match(schema, /create table if not exists public\.asset_tax_ledger_records/, "Asset Tax Ledger table should exist");
assert.match(renderConfig, /healthCheckPath: \/api\/health/, "Render should check the app health route");
assert.match(renderConfig, /npm test && npm run build/, "Render build should run tests before packaging");
assert.match(renderConfig, /SOLANA_RPC_URL/, "Render config should expose Solana RPC setup");
assert.match(renderConfig, /OPENAI_API_KEY/, "Render config should expose OpenAI setup");
assert.match(schema, /create table if not exists public\.coin_logo_references/, "Coin logo references should be tracked in the database schema");
assert.match(schema, /major-stablecoins-20260528\.png/, "Stablecoin logo reference image should be saved in database metadata");
assert.match(schema, /logo_image_path text not null default ''/, "Coin logo reference table should store per-coin logo asset paths");
assert.match(schema, /stablecoins\/usdt-reference\.png/, "USDT database seed should point to the saved reference logo asset");
assert.match(schema, /stablecoins\/usds-reference\.png/, "USDS database seed should point to the saved reference logo asset");
assert.match(schema, /alter table public\.coin_logo_references enable row level security/, "Coin logo reference table should enable RLS");

[
  "user_profiles",
  "wallet_metadata",
  "virtual_asset_accounts",
  "asset_historical_prices",
  "asset_legal_core_records",
  "asset_transaction_classifications",
  "asset_tax_ledger_records",
  "bucket_balances",
  "transaction_categories",
  "reports",
  "vault_backups",
  "vault_activity",
  "vault_owner_wallets",
  "vault_recovery_wallets",
  "vault_trusted_devices",
  "vault_signature_challenges",
  "vault_sessions",
  "vault_snapshots_v2",
  "vault_asset_records",
  "vault_restore_events",
  "ai_memory",
  "ai_request_logs",
  "ai_rules",
  "alfi_pricing_rules",
  "ai_usage_summaries",
  "prompt_optimization_suggestions",
  "ai_skins",
  "user_vaults",
  "vault_export_requests",
  "vault_audit_logs",
  "admin_ai_analytics_store",
  "onboarding_sessions",
  "service_events",
  "feature_flags",
].forEach((table) => {
  assert.match(schema, new RegExp(`create table if not exists public\\.${table}`), `${table} table should exist`);
  assert.match(schema, new RegExp(`alter table public\\.${table} enable row level security`), `${table} should enable RLS`);
});

console.log("Security and schema checks passed");


