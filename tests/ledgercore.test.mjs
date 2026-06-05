import assert from "node:assert/strict";
import {
  LEDGERCORE_EXPORT_DISCLAIMER,
  LEDGERCORE_LEGAL_REVIEW_COPY,
  PRODUCT_LINE_SOURCES,
  TAX_BUDGET_TEMPLATES,
  WRITE_OFF_ELIGIBILITY_TAGS,
  applyTaxBudgetTemplate,
  buildReviewQueue,
  createDefaultLedgerCoreState,
  createLedgerExport,
  createLedgerTransaction,
  createReceiptRecord,
  detectTaxCategory,
  getLedgerCoreMetrics,
  normalizeLedgerCoreState,
  updateLedgerReceipt,
  updateLedgerTransaction,
} from "../ledgercore-core.js";
import { renderLedgerCoreShell } from "../ledgercore-ui.js";

const state = createDefaultLedgerCoreState("2026-05-29T12:00:00.000Z");

assert.equal(
  LEDGERCORE_LEGAL_REVIEW_COPY,
  "Possible tax deductible expense — review before export.",
  "LedgerCore should use the required legal review wording"
);
assert.doesNotMatch(
  `${LEDGERCORE_LEGAL_REVIEW_COPY} ${LEDGERCORE_EXPORT_DISCLAIMER}`,
  /Guaranteed tax write-off/i,
  "LedgerCore must never promise guaranteed write-offs"
);

assert.equal(state.transactions.length >= 4, true, "default LedgerCore state should include realistic demo transactions");
assert.equal(PRODUCT_LINE_SOURCES.length, 7, "LedgerCore should enumerate reusable product line sources");
assert.equal(TAX_BUDGET_TEMPLATES.length, 5, "LedgerCore should include predetermined tax budget templates");
assert.ok(WRITE_OFF_ELIGIBILITY_TAGS.includes("Mixed Use"), "Mixed Use should be a supported eligibility tag");

const fuelCategory = detectTaxCategory({ merchant: "Pilot fuel stop", budgetAccount: "Fuel" });
assert.equal(fuelCategory.label, "Fuel", "fuel expenses should be detected");

const softwareTransaction = createLedgerTransaction({
  source: "AllocaFi Enterprise",
  merchantOrAddress: "GitHub software subscription",
  budgetAccountUsed: "Software",
  amount: 99,
  classification: "business",
});
assert.equal(softwareTransaction.possibleTaxCategory, "Software subscriptions", "software subscriptions should be categorized");
assert.match(softwareTransaction.writeOffEligibilityTag, /Possibly|Tax|Eligible/, "software expenses should receive an eligibility tag");

const phoneTransaction = createLedgerTransaction({
  merchantOrAddress: "Verizon phone bill",
  budgetAccountUsed: "Phone",
  amount: 120,
  writeOffEligibilityTag: "Mixed Use",
  mixedUseBusinessPercent: 70,
});
assert.equal(phoneTransaction.writeOffEligibilityTag, "Mixed Use", "mixed-use expenses should be represented");
assert.equal(phoneTransaction.mixedUseBusinessPercent, 70, "mixed-use business percentage should be preserved");

const nextState = updateLedgerTransaction(state, phoneTransaction);
const receipt = createReceiptRecord({
  transactionId: phoneTransaction.id,
  fileName: "phone-receipt.pdf",
  fileType: "application/pdf",
  verified: true,
});
const receiptState = updateLedgerReceipt(nextState, receipt);
assert.equal(receiptState.receipts.some((item) => item.fileName === "phone-receipt.pdf"), true, "receipts should be stored");

const reviewQueue = buildReviewQueue(nextState);
assert.ok(reviewQueue.some((item) => item.reason === "Mixed-use expense"), "mixed-use expenses should enter the review queue");
assert.ok(reviewQueue.some((item) => item.reason === "Missing receipt"), "missing receipts should enter the review queue");

const metrics = getLedgerCoreMetrics(state);
assert.equal(typeof metrics.totalLoggedTransactions, "number", "metrics should calculate logged transaction count");
assert.equal(typeof metrics.monthlySpendingScanned, "number", "metrics should calculate monthly spending");

const businessState = applyTaxBudgetTemplate(state, "business", "2026-05-29T12:00:00.000Z");
assert.equal(businessState.settings.defaultTaxTemplate, "business", "template selection should update settings");
assert.ok(businessState.templateAccounts.some((account) => account.name === "Payroll"), "business template should add payroll");

const exportRecord = createLedgerExport(state, "csv", "2026-05-29T12:00:00.000Z");
assert.equal(exportRecord.disclaimer, LEDGERCORE_EXPORT_DISCLAIMER, "exports should include the tax advice disclaimer");

const normalized = normalizeLedgerCoreState({ transactions: [softwareTransaction], settings: { defaultTaxTemplate: "family" } });
assert.equal(normalized.settings.defaultTaxTemplate, "family", "normalization should preserve settings overrides");
assert.equal(normalized.transactions[0].possibleTaxCategory, "Software subscriptions", "normalization should preserve transaction category logic");

const html = renderLedgerCoreShell(state);
assert.match(html, /AllocaFi LedgerCore&trade;/, "LedgerCore UI should render the brand");
assert.match(html, /Transaction Scan Engine/, "LedgerCore UI should render the scan engine");
assert.match(html, /Export Center/, "LedgerCore UI should render export navigation");
assert.match(html, /Possible tax deductible expense/, "LedgerCore UI should render the review wording");

console.log("LedgerCore checks passed");
