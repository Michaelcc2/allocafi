import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  ENTERPRISE_MOCK_DATA,
  calculateEnterpriseAnalytics,
  canEnterpriseRole,
  generateEnterpriseInsights,
  getEnterpriseBucketRows,
  getEnterpriseCashFlowForRange,
} from "../enterprise-dashboard-core.js";

const [app, server, indexHtml, copyScript, enterpriseCore] = await Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../server.js", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../scripts/copy-web-assets.mjs", import.meta.url), "utf8"),
  readFile(new URL("../enterprise-dashboard-core.js", import.meta.url), "utf8"),
]);

const analytics = calculateEnterpriseAnalytics(ENTERPRISE_MOCK_DATA, "This Month");
const bucketRows = getEnterpriseBucketRows(ENTERPRISE_MOCK_DATA);
const cashFlow = getEnterpriseCashFlowForRange(ENTERPRISE_MOCK_DATA, "This Month");
const insights = generateEnterpriseInsights(ENTERPRISE_MOCK_DATA, analytics);

assert.equal(ENTERPRISE_MOCK_DATA.businessProfile.name, "Atlas Innovations Inc.");
assert.equal(ENTERPRISE_MOCK_DATA.bucketAccounts.length, 12, "enterprise dashboard should include 12 business budget accounts");
assert.deepEqual(
  ENTERPRISE_MOCK_DATA.bucketAccounts.map((bucket) => bucket.name),
  [
    "Operating Expenses",
    "Payroll",
    "Taxes",
    "Marketing",
    "CapEx / Investments",
    "Reserve / Treasury",
    "Vendor Payments",
    "Insurance",
    "Legal / Compliance",
    "Software / SaaS",
    "Travel",
    "Emergency Fund",
  ],
);

assert.ok(ENTERPRISE_MOCK_DATA.stablecoinBalances.some((coin) => coin.asset === "PYUSD"), "PYUSD should be represented");
assert.equal(analytics.totalAllocatedBalance, 24830671.25, "total allocated balance should match stablecoin total");
assert.equal(analytics.bucketTotal, analytics.stablecoinTotal, "virtual budget account balances should reconcile to stablecoin balances");
assert.equal(analytics.bucketDelta, 0, "enterprise virtual budget accounts should not double-count custody balances");

const operating = bucketRows.find((bucket) => bucket.id === "operating");
assert.equal(operating.progress, 88.46, "budget account progress should be balance divided by budget");
assert.equal(operating.remaining, 750000, "remaining budget account amount should be budget minus allocated balance");
assert.equal(
  bucketRows.find((bucket) => bucket.id === "legal").isOverBudget,
  true,
  "over-budget categories should be flagged",
);

assert.equal(cashFlow.monthlyInflows, 15650000);
assert.equal(cashFlow.monthlyOutflows, 9823000);
assert.equal(cashFlow.netCashFlow, 5827000);
assert.equal(analytics.budgetTotal, 15600000);
assert.equal(analytics.budgetUsed, 13950000);
assert.equal(analytics.budgetRemaining, 1650000);
assert.equal(analytics.expenseCategoryPercentages.find((item) => item.category === "Payroll").percentUsed, 93.33);

assert.equal(canEnterpriseRole("Owner", "manageBuckets"), true);
assert.equal(canEnterpriseRole("Admin", "manageBuckets"), true);
assert.equal(canEnterpriseRole("Finance Manager", "approvePayments"), true);
assert.equal(canEnterpriseRole("Accountant", "exportReports"), true);
assert.equal(canEnterpriseRole("Employee", "requestPayments"), true);
assert.equal(canEnterpriseRole("Viewer", "manageBuckets"), false);

assert.ok(insights.length >= 3 && insights.length <= 5, "dashboard should render 3 to 5 AI-ready insight cards");
assert.ok(insights.some((insight) => /Payroll runway/i.test(insight.title)), "payroll runway insight should be generated");
assert.ok(insights.some((insight) => /Tax reserve/i.test(insight.title)), "tax reserve insight should be generated");

assert.match(app, /renderBusinessDashboard/, "enterprise dashboard renderer should be wired into the app");
assert.match(app, /enterprise-dashboard-core\.js/, "app should consume the reusable enterprise core");
assert.match(enterpriseCore, /No private keys stored/, "dashboard should surface non-custodial safety language");
assert.doesNotMatch(app, /localStorage\.setItem\([^)]*(privateKey|seedPhrase|mnemonic)/i, "dashboard must not store private keys or seed phrases");
assert.match(indexHtml, /type="module" src="\.\/app\.js(?:\?v=[^"]+)?"/, "app should load as a module for enterprise core imports");
assert.match(server, /appRouteFallbacks/, "server should include app route fallbacks");
assert.match(server, /"\/business"/, "business route should load the SPA");
assert.match(server, /"\/enterprise\/dashboard"/, "enterprise dashboard route should load the SPA");
assert.match(server, /nestedAdvancedAssetPattern/, "nested advanced route assets should resolve to root files");
assert.match(copyScript, /enterprise-dashboard-core\.js/, "build should copy the enterprise core file");

console.log("Enterprise dashboard checks passed");
