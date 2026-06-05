export type ProductLineSource =
  | "AllocaFi Core"
  | "AllocaFi Personal"
  | "AllocaFi Family"
  | "AllocaFi Enterprise"
  | "AllocaFi Commerce"
  | "AllocaFi Pay"
  | "AllocaFi Vault";

export type WriteOffEligibilityTag =
  | "Tax Eligible"
  | "Possibly Tax Eligible"
  | "Not Tax Eligible"
  | "Needs Review"
  | "Business Only"
  | "Personal Only"
  | "Mixed Use";

export interface TaxCategory {
  id: string;
  label: string;
  keywords: string[];
  defaultTag: WriteOffEligibilityTag;
}

export interface MixedUseRule {
  id: string;
  accountName: string;
  businessPercent: number;
  personalPercent: number;
  taxStatus: "Mixed Use";
  exportNote: string;
}

export interface LedgerTransaction {
  id: string;
  source: ProductLineSource;
  sourceEventId: string;
  walletAddress: string;
  tokenUsed: string;
  amount: number;
  fiatValueEstimate: number;
  timestamp: string;
  network: string;
  transactionHash: string;
  budgetAccountUsed: string;
  merchantOrAddress: string;
  receiptId: string;
  classification: "personal" | "business" | "family" | "commerce" | "enterprise" | "mixed";
  possibleTaxCategory: string;
  writeOffEligibilityTag: WriteOffEligibilityTag;
  mixedUseBusinessPercent: number;
  notes: string;
  reviewStatus: "needs_review" | "reviewed" | "export_ready";
  exportReady: boolean;
  receiptRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptRecord {
  id: string;
  transactionId: string;
  fileName: string;
  fileType: string;
  dataUrl: string;
  verified: boolean;
  missing: boolean;
  uploadedAt: string;
  notes: string;
}

export interface TaxBudgetTemplate {
  id: string;
  label: string;
  accounts: string[];
}

export interface LedgerExport {
  id: string;
  type: "csv" | "pdf" | "accountant-summary" | "category-breakdown" | "receipt-archive";
  createdAt: string;
  recordCount: number;
  disclaimer: string;
}

export interface ReviewQueueItem {
  id: string;
  transactionId: string;
  merchantOrAddress: string;
  amount: number;
  category: string;
  writeOffEligibilityTag: WriteOffEligibilityTag;
  reason: string;
  severity: "low" | "medium" | "high";
}

export interface LedgerCoreSettings {
  automaticScanEnabled: boolean;
  defaultTaxTemplate: string;
  defaultClassification: LedgerTransaction["classification"];
  receiptReminders: boolean;
  exportFormatPreference: LedgerExport["type"];
  privacyMode: boolean;
  vaultBackup: boolean;
  productLineIntegrations: Record<ProductLineSource, boolean>;
  mixedUseRules: MixedUseRule[];
}
