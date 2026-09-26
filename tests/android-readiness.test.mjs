import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const failures = [];

async function requiredText(path, label = path) {
  try {
    return await readFile(new URL(path, root), "utf8");
  } catch {
    failures.push(`${label} is missing`);
    return "";
  }
}

function check(value, message) {
  try {
    assert.ok(value, message);
  } catch (error) {
    failures.push(error.message);
  }
}

function matches(source, pattern, message) {
  check(pattern.test(source), message);
}

function excludes(source, pattern, message) {
  check(!pattern.test(source), message);
}

async function exists(path) {
  try {
    await access(new URL(path, root));
    return true;
  } catch {
    return false;
  }
}

async function listFiles(path) {
  const directory = new URL(path, root);
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(entries.map(async (entry) => {
      const child = `${path.replace(/\/$/, "")}/${entry.name}`;
      return entry.isDirectory() ? listFiles(child) : [child];
    }));
    return nested.flat();
  } catch {
    return [];
  }
}

const [app, server, accountService, migration, indexHtml, styles, capacitorRaw, mobileRuntime, gitignore] = await Promise.all([
  requiredText("app.js"),
  requiredText("server.js"),
  requiredText("account-service.mjs"),
  requiredText("database/migrations/20260905_account_snapshots.sql"),
  requiredText("index.html"),
  requiredText("styles.css"),
  requiredText("capacitor.config.json"),
  requiredText("mobile-runtime.js", "mobile-runtime.js"),
  requiredText(".gitignore"),
]);

let capacitor = {};
try {
  capacitor = JSON.parse(capacitorRaw);
} catch {
  failures.push("capacitor.config.json must contain valid JSON");
}

// Non-custodial boundary: public addresses and wallet-approved actions only.
matches(server, /AllocaFi is non-custodial/, "server must retain the non-custodial guarantee");
matches(app, /Add a public wallet address/, "onboarding must remain public-address-first");
matches(app, /Wallet ownership verification stays separate/, "wallet verification must remain separate from tracking");
matches(app, /hasForbiddenSecretFields/, "imports must continue rejecting wallet secret fields");
excludes(app, /localStorage\.setItem\([^\n;]*(?:privateKey|seedPhrase|mnemonic|recoveryPhrase)/i, "wallet secrets must never be written to localStorage");
matches(server, /Never request private keys, seed phrases, custody, or automatic fund movement/, "AI policy must prohibit custody and secret requests");

// Auth/session isolation: tokens stay in protected cookies and snapshots stay owner-scoped.
matches(accountService, /HttpOnly; SameSite=Strict/, "auth cookies must remain HttpOnly and SameSite=Strict");
matches(accountService, /NODE_ENV === "production" \? "; Secure"/, "production auth cookies must require HTTPS");
matches(accountService, /req\.headers\["x-allocafi-user"\] !== user\.id/, "snapshot requests must reject stale or mismatched account identity");
matches(accountService, /const clean = \{ schemaVersion: 1, wallets: snapshot\.wallets, goals: snapshot\.goals, addressBook: snapshot\.addressBook/, "cloud snapshots must use the budget-data allowlist");
excludes(accountService.match(/const clean = \{[^;]+/s)?.[0] || "", /access_token|refresh_token|creator|masterWallet/, "cloud snapshots must not persist tokens or entitlements");
matches(migration, /alter table public\.account_snapshots enable row level security/, "account snapshots must have RLS enabled");
matches(migration, /auth\.uid\(\)\) = user_id/, "account snapshots must remain scoped to auth.uid()");
matches(app, /function switchAccountWorkspace/, "mobile must preserve per-account workspace switching");
matches(app, /allocafi-user-backup:/, "mobile must preserve namespaced per-account recovery backups");

// Accounts 2.0 is a protected regression surface for the Android redesign.
matches(app, /const ACCOUNTS_20_ENABLED_KEY = "allocafi-accounts-20-enabled-v1"/, "Accounts 2.0 feature marker must remain stable");
matches(app, /const ACCOUNTS_20_ISOLATED_TAB = "accounts20-isolated"/, "Accounts 2.0 isolated route must remain available for regression testing");
matches(app, /function renderAccounts20Isolated/, "Accounts 2.0 isolated renderer must remain present");
matches(app, /function renderAccounts20SearchPanel/, "Accounts 2.0 mobile search must remain present");
matches(indexHtml, /data-tab="accounts"/, "the primary Accounts navigation target must remain present");

// Family and Business prototypes may remain in source, but cannot be enabled in the Android release surface.
matches(app, /connect_family_chat_enabled:\s*false/, "Family messaging must remain disabled");
matches(app, /connect_enterprise_chat_enabled:\s*false/, "Business messaging must remain disabled");
const visibleTabs = app.match(/const visibleTabs = new Set\(([^;]+)\);/)?.[1] || "";
excludes(visibleTabs, /family|business|enterprise/i, "Family and Business must not be enabled in primary navigation");
const advancedIds = app.match(/const advancedIds = \[([^\]]+)\]/)?.[1] || "";
excludes(advancedIds, /["'](?:family|business|enterprise)["']/i, "Family and Business must not be launchable from Android advanced settings");
excludes(app, /return "business";|return "family";/, "Family and Business direct routes must remain disabled for Android release");

// Capacitor and native runtime policy.
check(capacitor.appId === "com.allocafi.app", "Capacitor appId must be com.allocafi.app");
check(capacitor.appName === "AllocaFi", "Capacitor appName must be AllocaFi");
check(capacitor.webDir === "www", "Capacitor webDir must remain www");
check(capacitor.server?.androidScheme === "https", "Capacitor Android scheme must be https");
check(capacitor.android?.webContentsDebuggingEnabled === false, "release WebView debugging must be disabled");
check(!Object.hasOwn(capacitor.server || {}, "url"), "release builds must bundle local web assets instead of loading a remote server URL");
check(capacitor.plugins?.CapacitorHttp?.enabled === true, "native HTTP patching must be enabled for bundled-app API calls");
check(capacitor.plugins?.CapacitorCookies?.enabled === true, "native cookie support must be enabled for protected account sessions");
matches(app, /const NATIVE_API_ORIGIN = "https:\/\/allocafi-web\.onrender\.com"/, "native API calls must use the allowlisted HTTPS production backend");
matches(app, /resolveRequestUrl/, "native requests must resolve bundled relative API paths");
excludes(app, /const NATIVE_API_ORIGIN = "http:/, "native API origin must never use cleartext HTTP");
matches(styles, /Mobile web scroll ownership and navigation stacking[\s\S]*?html\s*\{[\s\S]*?overflow-y:\s*auto\s*!important[\s\S]*?body\s*\{[\s\S]*?overflow:\s*visible\s*!important/, "mobile web must keep page scrolling on the document root instead of trapping touch input on body");
matches(styles, /\.controls-reference-cover\s*\{\s*isolation:\s*auto\s*!important/, "mobile fixed navigation must escape the controls stacking context");
matches(mobileRuntime, /allocafi-web\.onrender\.com/, "mobile runtime must explicitly allowlist the production App Link host");
matches(mobileRuntime, /isAllowedAppUrl|isAllowedDeepLink/, "mobile runtime must validate incoming URLs before routing them");
matches(mobileRuntime, /appUrlOpen[\s\S]{0,360}(?:isAllowedAppUrl|isAllowedDeepLink)/, "appUrlOpen must reject URLs outside the deep-link allowlist");
excludes(mobileRuntime, /\["https:",\s*"http:"\]\.includes/, "mobile external links must not permit cleartext HTTP");
matches(mobileRuntime, /Sensitive values require an encrypted native storage plugin/, "sensitive mobile data must require encrypted native storage");
matches(mobileRuntime, /FORBIDDEN_STORAGE_KEY/, "mobile storage must reject wallet-secret key names");

const androidRootPresent = await exists("android/app/src/main");
check(androidRootPresent, "generated Android project must exist at android/app/src/main");
excludes(gitignore, /^android\/$/m, "custom Android security configuration must be versioned instead of ignored");
const manifest = await requiredText("android/app/src/main/AndroidManifest.xml", "AndroidManifest.xml");
const networkSecurity = await requiredText("android/app/src/main/res/xml/network_security_config.xml", "network_security_config.xml");
const mainActivityPath = (await exists("android/app/src/main/java/com/allocafi/app/MainActivity.java"))
  ? "android/app/src/main/java/com/allocafi/app/MainActivity.java"
  : "android/app/src/main/java/com/allocafi/app/MainActivity.kt";
const mainActivity = await requiredText(mainActivityPath, "MainActivity.java or MainActivity.kt");

matches(manifest, /android:usesCleartextTraffic="false"/, "Android must reject cleartext traffic");
matches(manifest, /android:networkSecurityConfig="@xml\/network_security_config"/, "Android must use the release network security policy");
matches(manifest, /android:allowBackup="false"/, "Android backups must be disabled for local financial data");
matches(networkSecurity, /cleartextTrafficPermitted="false"/, "network security policy must reject cleartext traffic");
excludes(networkSecurity, /cleartextTrafficPermitted="true"/, "network security policy must not permit cleartext exceptions");
matches(mainActivity, /FLAG_SECURE/, "MainActivity must protect sensitive screens from screenshots and recents capture");

// Deep links are limited to the current production origin and HTTPS.
matches(manifest, /android:autoVerify="true"/, "production deep links must use Android App Links verification");
matches(manifest, /android:scheme="https"/, "deep-link intent filters must require HTTPS");
matches(manifest, /android:host="allocafi-web\.onrender\.com"/, "deep links must allowlist the live Allocafi Render host");
excludes(manifest, /android:scheme="http"/, "Android must not register HTTP deep links");
excludes(manifest, /android:host="\*"/, "Android deep links must not use wildcard hosts");
excludes(manifest, /android:pathPrefix="\/(?:family|business|enterprise)/i, "Android deep links must not expose Family or Business routes");

// Generated native assets and the bundled web entry point are release prerequisites.
const androidFiles = await listFiles("android/app/src/main");
check(androidFiles.some((path) => /\/mipmap[^/]*\/ic_launcher(?:_round)?\.(?:png|webp|xml)$/i.test(path)), "Android launcher icon resources must be present");
check(androidFiles.some((path) => /\/drawable[^/]*\/splash(?:screen)?\.(?:png|webp|xml)$/i.test(path)), "Android splash resources must be present");
check(androidFiles.includes("android/app/src/main/assets/public/index.html"), "Capacitor must bundle www/index.html into Android assets");
for (const assetPath of ["assets/allocafi-logo.svg", "assets/allocafi-mark.svg"]) {
  check(await exists(assetPath), `${assetPath} must remain available as Android branding source`);
  if (await exists(assetPath)) check((await stat(new URL(assetPath, root))).size > 100, `${assetPath} must not be empty`);
}

if (failures.length) {
  console.error("Android readiness checks failed:");
  failures.forEach((failure, index) => console.error(`${index + 1}. ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Android security and release-readiness checks passed");
}
