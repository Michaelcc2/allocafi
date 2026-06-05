import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  FAMILY_TREASURY_MOCK_DATA,
  calculateFamilyTreasury,
  canFamilyRole,
  generateFamilyInsights,
  getFamilyAssetRows,
  getFamilyBudgetRows,
  getFamilyGoalRows,
} from "../family-treasury-core.js";

const [app, server, copyScript, familyCore] = await Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../server.js", import.meta.url), "utf8"),
  readFile(new URL("../scripts/copy-web-assets.mjs", import.meta.url), "utf8"),
  readFile(new URL("../family-treasury-core.js", import.meta.url), "utf8"),
]);

const analytics = calculateFamilyTreasury(FAMILY_TREASURY_MOCK_DATA);
const assets = getFamilyAssetRows(FAMILY_TREASURY_MOCK_DATA);
const goals = getFamilyGoalRows(FAMILY_TREASURY_MOCK_DATA);
const buckets = getFamilyBudgetRows(FAMILY_TREASURY_MOCK_DATA);
const insights = generateFamilyInsights(FAMILY_TREASURY_MOCK_DATA, analytics);

assert.equal(FAMILY_TREASURY_MOCK_DATA.familyProfile.name, "Johnson Family");
assert.equal(FAMILY_TREASURY_MOCK_DATA.members.length, 5, "family treasury should support up to 5 members");
assert.equal(FAMILY_TREASURY_MOCK_DATA.wallets.length, 12, "family treasury should include 12 connected wallets");
assert.equal(FAMILY_TREASURY_MOCK_DATA.assetCategories.length, 10, "family treasury should include 10 asset categories");
assert.equal(FAMILY_TREASURY_MOCK_DATA.goals.length, 7, "family treasury should include 7 goals");
assert.equal(FAMILY_TREASURY_MOCK_DATA.budgetBuckets.length, 12, "family treasury should include 12 shared budget accounts");

assert.equal(analytics.totalFamilyTreasury, 1248650.75, "family treasury total should reconcile to all assets");
assert.equal(
  analytics.totalFamilyTreasury,
  assets.reduce((sum, asset) => Math.round((sum + asset.balance) * 100) / 100, 0),
  "family treasury total should equal combined asset cards",
);
assert.equal(
  Math.round(assets.reduce((sum, asset) => sum + asset.percentOfTotal, 0)),
  100,
  "asset allocation percentages should total 100%",
);

const dreamHome = goals.find((goal) => goal.id === "home");
assert.equal(dreamHome.progress, 25, "Dream Home goal progress should calculate correctly");
assert.equal(goals.find((goal) => goal.id === "emergency").status, "complete", "Emergency Fund should be complete");

const groceries = buckets.find((bucket) => bucket.id === "groceries");
assert.equal(groceries.remaining, 115, "budget account remaining should be target minus spent");
assert.equal(groceries.spentPercent, 93.61, "budget account spent percent should calculate correctly");

assert.equal(canFamilyRole("Admin", "manageSettings"), true);
assert.equal(canFamilyRole("Parent", "approveSpending"), true);
assert.equal(canFamilyRole("Member", "approveTransfers"), false);
assert.equal(canFamilyRole("Child", "viewTreasury"), false);
assert.equal(canFamilyRole("Viewer", "readOnly"), true);

assert.ok(insights.length >= 3 && insights.length <= 5, "AI Family Insights should generate 3 to 5 cards");
assert.ok(insights.some((insight) => /Emergency fund/i.test(insight.title)), "emergency insight should be generated");
assert.ok(insights.some((insight) => /Strongest contributor/i.test(insight.title)), "strongest contributor insight should be generated");

assert.match(app, /renderFamilyDashboard/, "family treasury renderer should be wired into the app");
assert.match(app, /family-treasury-core\.js/, "app should consume the reusable family core");
assert.match(app, /family-route-active/, "family route should activate isolated dashboard mode");
assert.match(server, /"\/family\/treasury"/, "family treasury route should load the SPA");
assert.match(server, /family-treasury-core/, "nested family route assets should resolve to root files");
assert.match(copyScript, /family-treasury-core\.js/, "build should copy the family core file");
assert.match(familyCore, /No private keys stored/, "family dashboard should surface non-custodial safety language");
assert.doesNotMatch(familyCore, /(privateKey|seedPhrase|mnemonic)\s*:/i, "family mock data must not include private key or seed phrase fields");

console.log("Family treasury checks passed");
