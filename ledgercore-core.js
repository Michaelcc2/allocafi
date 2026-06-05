export const LEDGERCORE_LEGAL_REVIEW_COPY = "Possible tax deductible expense — review before export.";
export const LEDGERCORE_EXPORT_DISCLAIMER = "AllocaFi provides transaction organization and possible tax category suggestions. This is not tax advice. Please review with a qualified tax professional.";

export const LEDGERCORE_TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "transactions", label: "Transaction Scan" },
  { id: "templates", label: "Tax Templates" },
  { id: "receipts", label: "Receipts" },
  { id: "review", label: "Review Queue" },
  { id: "exports", label: "Export Center" },
  { id: "settings", label: "Settings" },
  { id: "security", label: "Security" },
];

export const PRODUCT_LINE_SOURCES = [
  "AllocaFi Core",
  "AllocaFi Personal",
  "AllocaFi Family",
  "AllocaFi Enterprise",
  "AllocaFi Commerce",
  "AllocaFi Pay",
  "AllocaFi Vault",
];

export const WRITE_OFF_ELIGIBILITY_TAGS = [
  "Tax Eligible",
  "Possibly Tax Eligible",
  "Not Tax Eligible",
  "Needs Review",
  "Business Only",
  "Personal Only",
  "Mixed Use",
];

export const TAX_CATEGORIES = [
  { id: "business-meals", label: "Business meals", keywords: ["meal", "restaurant", "lunch", "dinner", "coffee", "catering"], defaultTag: "Possibly Tax Eligible" },
  { id: "fuel", label: "Fuel", keywords: ["fuel", "gas", "shell", "chevron", "exxon", "bp", "truck stop"], defaultTag: "Possibly Tax Eligible" },
  { id: "office-supplies", label: "Office supplies", keywords: ["office", "supplies", "staples", "paper", "printer", "ink"], defaultTag: "Possibly Tax Eligible" },
  { id: "software", label: "Software subscriptions", keywords: ["software", "saas", "subscription", "adobe", "figma", "github", "openai", "slack"], defaultTag: "Possibly Tax Eligible" },
  { id: "equipment", label: "Equipment", keywords: ["equipment", "laptop", "computer", "monitor", "camera", "hardware"], defaultTag: "Possibly Tax Eligible" },
  { id: "internet-phone", label: "Internet/phone", keywords: ["internet", "phone", "mobile", "verizon", "att", "t-mobile", "comcast"], defaultTag: "Mixed Use" },
  { id: "travel", label: "Travel", keywords: ["travel", "hotel", "flight", "airline", "uber", "lyft", "lodging"], defaultTag: "Possibly Tax Eligible" },
  { id: "vehicle", label: "Vehicle expenses", keywords: ["vehicle", "maintenance", "repair", "parking", "toll", "tires", "oil change"], defaultTag: "Possibly Tax Eligible" },
  { id: "childcare", label: "Childcare", keywords: ["childcare", "daycare", "child care", "babysitter"], defaultTag: "Needs Review" },
  { id: "medical", label: "Medical", keywords: ["medical", "doctor", "dentist", "pharmacy", "health", "clinic"], defaultTag: "Needs Review" },
  { id: "education", label: "Education", keywords: ["education", "school", "tuition", "course", "training", "books"], defaultTag: "Needs Review" },
  { id: "rent-office", label: "Rent/office space", keywords: ["rent", "office", "cowork", "workspace", "lease"], defaultTag: "Possibly Tax Eligible" },
  { id: "marketing", label: "Marketing", keywords: ["marketing", "ads", "advertising", "facebook ads", "google ads", "brand"], defaultTag: "Possibly Tax Eligible" },
  { id: "contractor", label: "Contractor payments", keywords: ["contractor", "freelance", "vendor", "consultant", "1099"], defaultTag: "Possibly Tax Eligible" },
  { id: "inventory", label: "Inventory", keywords: ["inventory", "stock", "wholesale", "goods", "materials"], defaultTag: "Possibly Tax Eligible" },
  { id: "business-utilities", label: "Business utilities", keywords: ["utility", "utilities", "electric", "water", "power"], defaultTag: "Mixed Use" },
  { id: "uncategorized", label: "Uncategorized", keywords: [], defaultTag: "Needs Review" },
];

export const TAX_BUDGET_TEMPLATES = [
  { id: "personal", label: "Personal Template", accounts: ["Food", "Gas", "Bills", "Savings", "Rent", "Medical", "Child expenses", "Education"] },
  { id: "trucking", label: "Self-Employed / Trucking Template", accounts: ["Fuel", "Maintenance", "Insurance", "Truck payment", "Tolls", "Parking", "Meals", "Phone", "Business supplies", "Load board subscriptions"] },
  { id: "business", label: "Business Template", accounts: ["Payroll", "Software", "Marketing", "Office supplies", "Contractor payments", "Equipment", "Travel", "Meals", "Inventory", "Taxes"] },
  { id: "commerce", label: "Commerce Template", accounts: ["Sales revenue", "Refunds", "Payment processing fees", "Shipping", "Inventory", "Packaging", "Advertising", "Platform fees", "Customer receipts"] },
  { id: "family", label: "Family Template", accounts: ["Childcare", "Medical", "Education", "Household bills", "Groceries", "Family savings", "Emergency fund"] },
];

const BUSINESS_ONLY = new Set(["Payroll", "Software", "Marketing", "Office supplies", "Contractor payments", "Equipment", "Travel", "Meals", "Inventory", "Taxes", "Fuel", "Maintenance", "Truck payment", "Tolls", "Parking", "Business supplies", "Load board subscriptions", "Sales revenue", "Refunds", "Payment processing fees", "Shipping", "Packaging", "Advertising", "Platform fees", "Customer receipts"]);
const REVIEW_ACCOUNTS = new Set(["Medical", "Child expenses", "Childcare", "Education", "Phone", "Business utilities", "Internet/phone"]);

function localId(prefix = "ledger") {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toIso(value, fallback = new Date().toISOString()) {
  const date = value ? new Date(value) : new Date(fallback);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

export function detectTaxCategory(input = {}) {
  const haystack = [
    input.merchant,
    input.merchantOrAddress,
    input.budgetAccount,
    input.budgetAccountUsed,
    input.notes,
    input.externalAppLabel,
    input.network,
  ].map((value) => String(value || "").toLowerCase()).join(" ");
  const category = TAX_CATEGORIES.find((item) => item.id !== "uncategorized" && item.keywords.some((keyword) => haystack.includes(keyword)));
  return category || TAX_CATEGORIES.find((item) => item.id === "uncategorized");
}

export function getTemplateAccountTag(accountName = "") {
  const normalized = String(accountName).toLowerCase();
  if (BUSINESS_ONLY.has(accountName)) return "Business Only";
  if (normalized.includes("phone") || normalized.includes("internet") || normalized.includes("utility")) return "Mixed Use";
  if (REVIEW_ACCOUNTS.has(accountName)) return "Needs Review";
  if (normalized.includes("food") || normalized.includes("gas") || normalized.includes("rent") || normalized.includes("bills") || normalized.includes("savings")) return "Personal Only";
  return "Possibly Tax Eligible";
}

export function createLedgerTransaction(data = {}, now = new Date().toISOString()) {
  const category = data.possibleTaxCategory
    ? TAX_CATEGORIES.find((item) => item.label === data.possibleTaxCategory || item.id === data.possibleTaxCategory) || detectTaxCategory(data)
    : detectTaxCategory(data);
  const writeOffTag = data.writeOffEligibilityTag || category.defaultTag || "Needs Review";
  const mixedUseBusinessPercent = writeOffTag === "Mixed Use"
    ? Math.max(0, Math.min(100, Number(data.mixedUseBusinessPercent ?? 70)))
    : 0;
  return {
    id: data.id || localId("ledger-tx"),
    source: data.source || "AllocaFi Core",
    sourceEventId: data.sourceEventId || "",
    walletAddress: data.walletAddress || "",
    tokenUsed: data.tokenUsed || data.asset || "USD",
    amount: Number(data.amount || 0),
    fiatValueEstimate: Number(data.fiatValueEstimate ?? data.amount ?? 0),
    timestamp: toIso(data.timestamp || data.createdAt, now),
    network: data.network || "Local record",
    transactionHash: data.transactionHash || data.txHash || "",
    budgetAccountUsed: data.budgetAccountUsed || data.budgetAccount || "Unassigned",
    merchantOrAddress: data.merchantOrAddress || data.merchant || data.recipient || "Manual record",
    receiptId: data.receiptId || "",
    classification: data.classification || "personal",
    possibleTaxCategory: category.label,
    writeOffEligibilityTag: writeOffTag,
    mixedUseBusinessPercent,
    notes: data.notes || data.note || "",
    reviewStatus: data.reviewStatus || (writeOffTag === "Not Tax Eligible" ? "reviewed" : "needs_review"),
    exportReady: Boolean(data.exportReady),
    receiptRequired: data.receiptRequired ?? (writeOffTag !== "Not Tax Eligible" || Number(data.amount || 0) >= 250),
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
}

export function createReceiptRecord(data = {}, now = new Date().toISOString()) {
  return {
    id: data.id || localId("receipt"),
    transactionId: data.transactionId || "",
    fileName: data.fileName || "receipt-upload",
    fileType: data.fileType || "unknown",
    dataUrl: data.dataUrl || "",
    verified: Boolean(data.verified),
    missing: Boolean(data.missing),
    uploadedAt: data.uploadedAt || now,
    notes: data.notes || "",
  };
}

function createTemplateAccounts(templateId = "personal") {
  const template = TAX_BUDGET_TEMPLATES.find((item) => item.id === templateId) || TAX_BUDGET_TEMPLATES[0];
  return template.accounts.map((name) => ({
    id: localId("tax-account"),
    name,
    writeOffEligibilityTag: getTemplateAccountTag(name),
    mixedUseBusinessPercent: name.toLowerCase().includes("phone") ? 70 : 0,
    exportNote: name.toLowerCase().includes("phone") ? "User marked 70% business use." : "",
  }));
}

function createDefaultTransactions(now) {
  return [
    createLedgerTransaction({
      source: "AllocaFi Enterprise",
      walletAddress: "0x742d...f44e",
      tokenUsed: "USDC",
      amount: 184.22,
      fiatValueEstimate: 184.22,
      network: "Ethereum",
      transactionHash: "0xledgercorefuel001",
      budgetAccountUsed: "Fuel",
      merchantOrAddress: "Pilot Truck Stop",
      classification: "business",
      notes: "Route fuel purchase",
    }, now),
    createLedgerTransaction({
      source: "AllocaFi Core",
      walletAddress: "2b1k...4GXo",
      tokenUsed: "PYUSD",
      amount: 59.99,
      fiatValueEstimate: 59.99,
      network: "Solana",
      transactionHash: "sol-ledger-soft-002",
      budgetAccountUsed: "Software",
      merchantOrAddress: "Adobe software subscription",
      classification: "business",
      notes: "Monthly design tools",
      receiptId: "receipt-demo-software",
      exportReady: true,
      reviewStatus: "reviewed",
    }, now),
    createLedgerTransaction({
      source: "AllocaFi Family",
      walletAddress: "local-family",
      tokenUsed: "USD",
      amount: 420,
      fiatValueEstimate: 420,
      network: "External payment reference",
      budgetAccountUsed: "Childcare",
      merchantOrAddress: "BrightStart Childcare",
      classification: "family",
      notes: "Family childcare record",
    }, now),
    createLedgerTransaction({
      source: "AllocaFi Pay",
      walletAddress: "external-route",
      tokenUsed: "USD",
      amount: 96.48,
      fiatValueEstimate: 96.48,
      network: "External app",
      budgetAccountUsed: "Phone",
      merchantOrAddress: "Verizon phone bill",
      classification: "business",
      writeOffEligibilityTag: "Mixed Use",
      mixedUseBusinessPercent: 70,
      notes: "User marked 70% business use.",
    }, now),
  ];
}

export function createDefaultLedgerCoreState(now = new Date().toISOString()) {
  return {
    activeTab: "dashboard",
    transactions: createDefaultTransactions(now),
    receipts: [
      createReceiptRecord({
        id: "receipt-demo-software",
        transactionId: "",
        fileName: "adobe-software-receipt.pdf",
        fileType: "application/pdf",
        verified: true,
        notes: "Demo receipt record",
      }, now),
    ],
    exports: [],
    templateAccounts: createTemplateAccounts("personal"),
    settings: {
      automaticScanEnabled: true,
      defaultTaxTemplate: "personal",
      defaultClassification: "personal",
      receiptReminders: true,
      exportFormatPreference: "csv",
      privacyMode: false,
      vaultBackup: true,
      productLineIntegrations: PRODUCT_LINE_SOURCES.reduce((map, source) => ({ ...map, [source]: true }), {}),
      mixedUseRules: [
        { id: "mixed-phone", accountName: "Phone Bill Account", businessPercent: 70, personalPercent: 30, taxStatus: "Mixed Use", exportNote: "User marked 70% business use." },
      ],
    },
  };
}

export function normalizeLedgerCoreState(value = {}, now = new Date().toISOString()) {
  const defaults = createDefaultLedgerCoreState(now);
  const settings = {
    ...defaults.settings,
    ...(value.settings || {}),
    productLineIntegrations: {
      ...defaults.settings.productLineIntegrations,
      ...(value.settings?.productLineIntegrations || {}),
    },
    mixedUseRules: Array.isArray(value.settings?.mixedUseRules) ? value.settings.mixedUseRules : defaults.settings.mixedUseRules,
  };
  return {
    ...defaults,
    ...value,
    activeTab: value.activeTab || defaults.activeTab,
    transactions: Array.isArray(value.transactions) ? value.transactions.map((tx) => createLedgerTransaction(tx, tx.updatedAt || now)) : defaults.transactions,
    receipts: Array.isArray(value.receipts) ? value.receipts.map((receipt) => createReceiptRecord(receipt, receipt.uploadedAt || now)) : defaults.receipts,
    exports: Array.isArray(value.exports) ? value.exports : defaults.exports,
    templateAccounts: Array.isArray(value.templateAccounts) && value.templateAccounts.length ? value.templateAccounts : defaults.templateAccounts,
    settings,
  };
}

export function applyTaxBudgetTemplate(state, templateId, now = new Date().toISOString()) {
  const template = TAX_BUDGET_TEMPLATES.find((item) => item.id === templateId) || TAX_BUDGET_TEMPLATES[0];
  return {
    ...state,
    templateAccounts: createTemplateAccounts(template.id),
    settings: {
      ...state.settings,
      defaultTaxTemplate: template.id,
    },
    lastTemplateAppliedAt: now,
  };
}

export function buildReviewQueue(state = {}) {
  const receipts = new Map((state.receipts || []).map((receipt) => [receipt.id, receipt]));
  return (state.transactions || []).flatMap((tx) => {
    const items = [];
    const amount = Math.abs(Number(tx.fiatValueEstimate || tx.amount || 0));
    const hasReceipt = Boolean(tx.receiptId && receipts.get(tx.receiptId) && !receipts.get(tx.receiptId).missing);
    const unclearMerchant = !/[a-z]{4,}/i.test(tx.merchantOrAddress || "") || /^0x/i.test(tx.merchantOrAddress || "");
    if (tx.receiptRequired && !hasReceipt) items.push({ reason: "Missing receipt", severity: amount >= 250 ? "high" : "medium" });
    if (tx.writeOffEligibilityTag === "Mixed Use") items.push({ reason: "Mixed-use expense", severity: "medium" });
    if (tx.possibleTaxCategory === "Uncategorized") items.push({ reason: "Uncategorized transaction", severity: "medium" });
    if (amount >= 500) items.push({ reason: "High-value expense", severity: "high" });
    if (unclearMerchant) items.push({ reason: "Unclear merchant name", severity: "medium" });
    if (tx.reviewStatus === "needs_review" && !items.length) items.push({ reason: "Possible business expense needs confirmation", severity: "low" });
    return items.map((item, index) => ({
      id: `${tx.id}-${index}-${item.reason.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      transactionId: tx.id,
      merchantOrAddress: tx.merchantOrAddress,
      amount: tx.fiatValueEstimate,
      category: tx.possibleTaxCategory,
      writeOffEligibilityTag: tx.writeOffEligibilityTag,
      ...item,
    }));
  });
}

export function getLedgerCoreMetrics(state = {}) {
  const transactions = state.transactions || [];
  const receipts = state.receipts || [];
  const reviewQueue = buildReviewQueue(state);
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthlySpendingScanned = transactions
    .filter((tx) => String(tx.timestamp || "").startsWith(monthKey))
    .reduce((sum, tx) => sum + Math.abs(Number(tx.fiatValueEstimate || tx.amount || 0)), 0);
  return {
    totalLoggedTransactions: transactions.length,
    possibleTaxDeductibleExpenses: transactions.filter((tx) => tx.writeOffEligibilityTag !== "Not Tax Eligible" && tx.writeOffEligibilityTag !== "Personal Only").length,
    receiptsStored: receipts.filter((receipt) => !receipt.missing).length,
    needsReview: reviewQueue.length,
    monthlySpendingScanned,
    exportReadyRecords: transactions.filter((tx) => tx.exportReady).length,
  };
}

export function createLedgerExport(state, type = "csv", now = new Date().toISOString()) {
  const exportRecord = {
    id: localId("ledger-export"),
    type,
    createdAt: now,
    recordCount: (state.transactions || []).length,
    disclaimer: LEDGERCORE_EXPORT_DISCLAIMER,
  };
  return exportRecord;
}

export function updateLedgerTransaction(state, transaction) {
  const exists = (state.transactions || []).some((tx) => tx.id === transaction.id);
  return {
    ...state,
    transactions: exists
      ? state.transactions.map((tx) => tx.id === transaction.id ? transaction : tx)
      : [transaction, ...(state.transactions || [])],
  };
}

export function updateLedgerReceipt(state, receipt) {
  const exists = (state.receipts || []).some((item) => item.id === receipt.id);
  return {
    ...state,
    receipts: exists
      ? state.receipts.map((item) => item.id === receipt.id ? receipt : item)
      : [receipt, ...(state.receipts || [])],
  };
}

export function markLedgerTransactionReviewed(state, transactionId) {
  return {
    ...state,
    transactions: (state.transactions || []).map((tx) => tx.id === transactionId ? { ...tx, reviewStatus: "reviewed", updatedAt: new Date().toISOString() } : tx),
  };
}

export function markLedgerTransactionExportReady(state, transactionId, ready = true) {
  return {
    ...state,
    transactions: (state.transactions || []).map((tx) => tx.id === transactionId ? { ...tx, exportReady: ready, reviewStatus: ready ? "reviewed" : tx.reviewStatus, updatedAt: new Date().toISOString() } : tx),
  };
}
