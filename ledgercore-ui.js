import {
  LEDGERCORE_EXPORT_DISCLAIMER,
  LEDGERCORE_LEGAL_REVIEW_COPY,
  LEDGERCORE_TABS,
  PRODUCT_LINE_SOURCES,
  TAX_BUDGET_TEMPLATES,
  TAX_CATEGORIES,
  WRITE_OFF_ELIGIBILITY_TAGS,
  buildReviewQueue,
  getLedgerCoreMetrics,
} from "./ledgercore-core.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatUsd(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function activeClass(activeTab, id) {
  return activeTab === id ? "active" : "";
}

function getReceiptForTransaction(state, transaction) {
  return (state.receipts || []).find((receipt) => receipt.id === transaction.receiptId);
}

function renderMetricCard(label, value, helper, tone = "blue") {
  return `
    <article class="ledger-metric-card ledger-tone-${escapeHtml(tone)}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(helper)}</small>
    </article>
  `;
}

function renderLedgerBadge(text, tone = "") {
  return `<span class="ledger-badge ${escapeHtml(tone)}">${escapeHtml(text)}</span>`;
}

function renderTransactionRow(tx, state, compact = false) {
  const receipt = getReceiptForTransaction(state, tx);
  const receiptLabel = receipt?.verified ? "Receipt verified" : receipt ? "Receipt stored" : tx.receiptRequired ? "Missing receipt" : "Optional receipt";
  return `
    <article class="ledger-transaction-row ${tx.exportReady ? "export-ready" : ""}">
      <div class="ledger-row-main">
        <span class="ledger-row-icon">${escapeHtml((tx.possibleTaxCategory || "L").slice(0, 2).toUpperCase())}</span>
        <div>
          <strong>${escapeHtml(tx.merchantOrAddress)}</strong>
          <small>${escapeHtml(tx.budgetAccountUsed)} - ${escapeHtml(tx.tokenUsed)} on ${escapeHtml(tx.network)}</small>
          <em>${LEDGERCORE_LEGAL_REVIEW_COPY}</em>
        </div>
      </div>
      <div class="ledger-row-meta">
        <strong>${formatUsd(Math.abs(tx.fiatValueEstimate || tx.amount))}</strong>
        <small>${formatDate(tx.timestamp)}</small>
      </div>
      <div class="ledger-row-tags">
        ${renderLedgerBadge(tx.possibleTaxCategory, "cyan")}
        ${renderLedgerBadge(tx.writeOffEligibilityTag, tx.writeOffEligibilityTag === "Mixed Use" ? "gold" : tx.writeOffEligibilityTag === "Not Tax Eligible" ? "muted" : "purple")}
        ${renderLedgerBadge(receiptLabel, receipt?.verified ? "green" : tx.receiptRequired && !receipt ? "warning" : "muted")}
      </div>
      ${compact ? "" : `
        <div class="ledger-row-actions">
          <button data-ledger-edit="${escapeHtml(tx.id)}" type="button">Edit</button>
          <button data-ledger-attach-receipt="${escapeHtml(tx.id)}" type="button">${receipt ? "Replace Receipt" : "Attach Receipt"}</button>
          <button data-ledger-review="${escapeHtml(tx.id)}" type="button">Review</button>
          <button data-ledger-export-ready="${escapeHtml(tx.id)}" type="button">${tx.exportReady ? "Ready" : "Mark Export Ready"}</button>
        </div>
      `}
    </article>
  `;
}

function renderLedgerDashboard(state) {
  const metrics = getLedgerCoreMetrics(state);
  const reviewQueue = buildReviewQueue(state);
  const recent = (state.transactions || []).slice(0, 4);
  const categoryRows = TAX_CATEGORIES.filter((item) => item.id !== "uncategorized").slice(0, 8);
  return `
    <section class="ledger-metric-grid">
      ${renderMetricCard("Total Logged Transactions", String(metrics.totalLoggedTransactions), "Every scanned spending event", "blue")}
      ${renderMetricCard("Possible Tax-Deductible Expenses", String(metrics.possibleTaxDeductibleExpenses), "Review before export", "purple")}
      ${renderMetricCard("Receipts Stored", String(metrics.receiptsStored), "Attached and local", "teal")}
      ${renderMetricCard("Needs Review", String(metrics.needsReview), "Missing receipts, mixed use, high value", "gold")}
      ${renderMetricCard("Monthly Spending Scanned", formatUsd(metrics.monthlySpendingScanned), "Current month ledger scan", "cyan")}
      ${renderMetricCard("Export Ready Records", String(metrics.exportReadyRecords), "Reviewed and accountant-ready", "green")}
    </section>
    <section class="ledger-dashboard-grid">
      <article class="ledger-glass-card ledger-engine-card">
        <div class="ledger-card-heading">
          <div>
            <h3>Transaction Scan Engine</h3>
            <p>Logs wallet sends, payment routes, merchant records, receipts, classifications, and possible tax categories.</p>
          </div>
          <span>${state.settings?.automaticScanEnabled ? "Auto scan on" : "Manual scan"}</span>
        </div>
        <div class="ledger-engine-actions">
          <button class="primary-button" data-ledger-scan type="button">Scan Transactions</button>
          <button class="secondary-button" data-ledger-add-transaction type="button">Add Transaction</button>
          <button class="secondary-button" data-ledger-upload-receipt type="button">Upload Receipt</button>
        </div>
        <div class="ledger-engine-fields">
          ${["wallet address", "token used", "fiat value estimate", "network", "transaction hash", "budget account", "merchant/address", "receipt", "classification", "tax category", "eligibility tag", "review status"].map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
        </div>
      </article>
      <article class="ledger-glass-card">
        <div class="ledger-card-heading">
          <div><h3>Needs Review</h3><p>Items requiring confirmation before export.</p></div>
          <button data-ledger-tab="review" type="button">Open Queue</button>
        </div>
        <div class="ledger-review-mini">
          ${reviewQueue.slice(0, 5).map((item) => `
            <button data-ledger-review="${escapeHtml(item.transactionId)}" type="button">
              <span>${escapeHtml(item.severity)}</span>
              <strong>${escapeHtml(item.reason)}</strong>
              <small>${escapeHtml(item.merchantOrAddress)} - ${formatUsd(item.amount)}</small>
            </button>
          `).join("") || `<div class="ledger-empty-state"><strong>No review items</strong><span>New scans will appear here when receipts or categories need confirmation.</span></div>`}
        </div>
      </article>
      <article class="ledger-glass-card ledger-wide-card">
        <div class="ledger-card-heading">
          <div><h3>Recent Ledger Records</h3><p>${LEDGERCORE_LEGAL_REVIEW_COPY}</p></div>
          <button data-ledger-tab="transactions" type="button">View All</button>
        </div>
        <div class="ledger-transaction-list">
          ${recent.map((tx) => renderTransactionRow(tx, state, true)).join("") || `<div class="ledger-empty-state"><strong>No ledger records yet</strong><span>Scan transactions or add a manual record.</span></div>`}
        </div>
      </article>
      <article class="ledger-glass-card">
        <div class="ledger-card-heading"><div><h3>Tax Category Detection</h3><p>Local rules suggest categories for review.</p></div></div>
        <div class="ledger-category-cloud">
          ${categoryRows.map((category) => `<span>${escapeHtml(category.label)}</span>`).join("")}
        </div>
      </article>
      <article class="ledger-glass-card">
        <div class="ledger-card-heading"><div><h3>Product Line Integration</h3><p>LedgerCore can organize records across the ecosystem.</p></div></div>
        <div class="ledger-integration-list">
          ${PRODUCT_LINE_SOURCES.map((source) => `<span><strong>${escapeHtml(source)}</strong><small>${state.settings?.productLineIntegrations?.[source] ? "Enabled" : "Paused"}</small></span>`).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderLedgerTransactions(state) {
  return `
    <section class="ledger-tab-panel">
      <div class="ledger-section-toolbar">
        <div><h3>Transaction Scan Engine</h3><p>Every spending event becomes a reviewable ledger record.</p></div>
        <div>
          <button class="primary-button" data-ledger-scan type="button">Scan Now</button>
          <button class="secondary-button" data-ledger-add-transaction type="button">Add Transaction</button>
        </div>
      </div>
      <div class="ledger-transaction-list full">
        ${(state.transactions || []).map((tx) => renderTransactionRow(tx, state)).join("") || `<div class="ledger-empty-state"><strong>No transactions yet</strong><span>Add or scan a transaction to begin.</span></div>`}
      </div>
    </section>
  `;
}

function renderLedgerTemplates(state) {
  return `
    <section class="ledger-tab-panel">
      <div class="ledger-section-toolbar">
        <div><h3>Predetermined Tax Budget Templates</h3><p>Apply a template to create tax-aware budget account labels and eligibility tags.</p></div>
      </div>
      <div class="ledger-template-grid">
        ${TAX_BUDGET_TEMPLATES.map((template) => `
          <article class="ledger-template-card ${state.settings?.defaultTaxTemplate === template.id ? "active" : ""}">
            <h4>${escapeHtml(template.label)}</h4>
            <div>${template.accounts.map((account) => `<span>${escapeHtml(account)}</span>`).join("")}</div>
            <button data-ledger-apply-template="${escapeHtml(template.id)}" type="button">${state.settings?.defaultTaxTemplate === template.id ? "Applied" : "Apply Template"}</button>
          </article>
        `).join("")}
      </div>
      <article class="ledger-glass-card ledger-wide-card">
        <div class="ledger-card-heading"><div><h3>Write-Off Eligibility Tags</h3><p>Budget accounts can be tagged before export.</p></div></div>
        <div class="ledger-template-account-list">
          ${(state.templateAccounts || []).map((account) => `
            <span>
              <strong>${escapeHtml(account.name)}</strong>
              <small>${escapeHtml(account.writeOffEligibilityTag)}${account.mixedUseBusinessPercent ? ` - ${account.mixedUseBusinessPercent}% business` : ""}</small>
              ${account.exportNote ? `<em>${escapeHtml(account.exportNote)}</em>` : ""}
            </span>
          `).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderLedgerReceipts(state) {
  return `
    <section class="ledger-tab-panel">
      <div class="ledger-section-toolbar">
        <div><h3>Receipt Storage</h3><p>Upload, attach, replace, remove, preview, verify, or flag missing receipts.</p></div>
        <button class="primary-button" data-ledger-upload-receipt type="button">Upload Receipt</button>
      </div>
      <div class="ledger-receipt-grid">
        ${(state.receipts || []).map((receipt) => `
          <article class="ledger-receipt-card ${receipt.missing ? "missing" : ""}">
            <span>${receipt.fileType?.includes("pdf") ? "PDF" : "IMG"}</span>
            <strong>${escapeHtml(receipt.fileName)}</strong>
            <small>${receipt.verified ? "Verified" : receipt.missing ? "Missing receipt flagged" : "Needs verification"} - ${formatDate(receipt.uploadedAt)}</small>
            <div class="ledger-row-actions">
              <button data-ledger-preview-receipt="${escapeHtml(receipt.id)}" type="button">Preview</button>
              <button data-ledger-replace-receipt="${escapeHtml(receipt.id)}" type="button">Replace</button>
              <button data-ledger-verify-receipt="${escapeHtml(receipt.id)}" type="button">${receipt.verified ? "Verified" : "Mark Verified"}</button>
              <button data-ledger-missing-receipt="${escapeHtml(receipt.id)}" type="button">Flag Missing</button>
              <button data-ledger-delete-receipt="${escapeHtml(receipt.id)}" type="button">Remove</button>
            </div>
          </article>
        `).join("") || `<div class="ledger-empty-state"><strong>No receipts stored</strong><span>Upload a receipt image or PDF to attach it to a transaction.</span></div>`}
      </div>
    </section>
  `;
}

function renderLedgerReview(state) {
  const reviewQueue = buildReviewQueue(state);
  return `
    <section class="ledger-tab-panel">
      <div class="ledger-section-toolbar">
        <div><h3>Review Queue</h3><p>Resolve missing receipts, mixed-use expenses, uncategorized records, high-value expenses, and unclear merchants.</p></div>
      </div>
      <div class="ledger-review-list">
        ${reviewQueue.map((item) => `
          <article class="ledger-review-item severity-${escapeHtml(item.severity)}">
            <span>${escapeHtml(item.severity)}</span>
            <div>
              <strong>${escapeHtml(item.reason)}</strong>
              <small>${escapeHtml(item.merchantOrAddress)} - ${formatUsd(item.amount)} - ${escapeHtml(item.category)}</small>
              <em>${LEDGERCORE_LEGAL_REVIEW_COPY}</em>
            </div>
            <button data-ledger-review="${escapeHtml(item.transactionId)}" type="button">Review</button>
            <button data-ledger-export-ready="${escapeHtml(item.transactionId)}" type="button">Mark Ready</button>
          </article>
        `).join("") || `<div class="ledger-empty-state"><strong>Review queue clear</strong><span>LedgerCore will add records here when a scan needs confirmation.</span></div>`}
      </div>
    </section>
  `;
}

function renderLedgerExports(state) {
  const exportButtons = [
    ["csv", "CSV", "Raw ledger rows for spreadsheets"],
    ["pdf", "PDF Report", "Print-ready summary generated locally"],
    ["accountant-summary", "Accountant-Ready Summary", "Reviewed records, notes, and totals"],
    ["category-breakdown", "Tax Category Breakdown", "Totals grouped by possible category"],
    ["receipt-archive", "Receipt Archive List", "Receipt file list and verification status"],
  ];
  return `
    <section class="ledger-tab-panel">
      <div class="ledger-section-toolbar">
        <div><h3>Export Center</h3><p>${LEDGERCORE_EXPORT_DISCLAIMER}</p></div>
      </div>
      <div class="ledger-export-grid">
        ${exportButtons.map(([type, label, detail]) => `
          <article class="ledger-export-card">
            <strong>${escapeHtml(label)}</strong>
            <span>${escapeHtml(detail)}</span>
            <button data-ledger-export="${escapeHtml(type)}" type="button">Generate ${escapeHtml(label)}</button>
          </article>
        `).join("")}
      </div>
      <article class="ledger-glass-card ledger-wide-card">
        <div class="ledger-card-heading"><div><h3>Export History</h3><p>Local export attempts are recorded for future Vault backup.</p></div></div>
        <div class="ledger-export-history">
          ${(state.exports || []).slice(0, 8).map((item) => `<span><strong>${escapeHtml(item.type)}</strong><small>${formatDate(item.createdAt)} - ${item.recordCount} records</small></span>`).join("") || `<span><strong>No exports yet</strong><small>Generate an export to start the audit trail.</small></span>`}
        </div>
      </article>
    </section>
  `;
}

function renderLedgerSettings(state) {
  const settings = state.settings || {};
  return `
    <section class="ledger-tab-panel">
      <div class="ledger-section-toolbar">
        <div><h3>Settings Controls</h3><p>Control automatic scans, templates, reminders, integrations, privacy, and Vault backup.</p></div>
        <button class="primary-button" data-ledger-save-settings type="button">Save Settings</button>
      </div>
      <div class="ledger-settings-grid">
        <label class="ledger-toggle-row"><input id="ledgerAutoScan" type="checkbox" ${settings.automaticScanEnabled ? "checked" : ""} /> <span><strong>Enable automatic scan</strong><small>Create ledger records from spending events.</small></span></label>
        <label>Default tax template<select id="ledgerDefaultTemplate">${TAX_BUDGET_TEMPLATES.map((template) => `<option value="${escapeHtml(template.id)}" ${settings.defaultTaxTemplate === template.id ? "selected" : ""}>${escapeHtml(template.label)}</option>`).join("")}</select></label>
        <label>Default classification<select id="ledgerDefaultClassification">${["personal", "business", "family", "commerce", "enterprise", "mixed"].map((item) => `<option value="${item}" ${settings.defaultClassification === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>
        <label>Export format preference<select id="ledgerExportPreference">${["csv", "pdf", "accountant-summary", "category-breakdown", "receipt-archive"].map((item) => `<option value="${item}" ${settings.exportFormatPreference === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>
        <label class="ledger-toggle-row"><input id="ledgerReceiptReminders" type="checkbox" ${settings.receiptReminders ? "checked" : ""} /> <span><strong>Receipt reminders</strong><small>Flag missing receipts in the review queue.</small></span></label>
        <label class="ledger-toggle-row"><input id="ledgerPrivacyMode" type="checkbox" ${settings.privacyMode ? "checked" : ""} /> <span><strong>Privacy mode</strong><small>Mask merchant details in shared reviews.</small></span></label>
        <label class="ledger-toggle-row"><input id="ledgerVaultBackup" type="checkbox" ${settings.vaultBackup ? "checked" : ""} /> <span><strong>Vault backup</strong><small>Prepare receipt and export records for Vault storage.</small></span></label>
      </div>
      <article class="ledger-glass-card ledger-wide-card">
        <div class="ledger-card-heading"><div><h3>Product Line Integrations</h3><p>Choose which AllocaFi systems can feed LedgerCore.</p></div></div>
        <div class="ledger-integration-toggle-grid">
          ${PRODUCT_LINE_SOURCES.map((source) => `<label class="ledger-toggle-row"><input data-ledger-integration="${escapeHtml(source)}" type="checkbox" ${settings.productLineIntegrations?.[source] ? "checked" : ""} /> <span><strong>${escapeHtml(source)}</strong><small>${settings.productLineIntegrations?.[source] ? "Enabled" : "Paused"}</small></span></label>`).join("")}
        </div>
      </article>
      <article class="ledger-glass-card ledger-wide-card">
        <div class="ledger-card-heading"><div><h3>Mixed-Use Percentage Rules</h3><p>Phone Bill Account example: 70% business, 30% personal.</p></div><button data-ledger-add-mixed-rule type="button">Add Rule</button></div>
        <div class="ledger-mixed-rule-list">
          ${(settings.mixedUseRules || []).map((rule) => `<span><strong>${escapeHtml(rule.accountName)}</strong><small>${rule.businessPercent}% business / ${rule.personalPercent}% personal - ${escapeHtml(rule.exportNote)}</small></span>`).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderLedgerSecurity() {
  return `
    <section class="ledger-tab-panel">
      <div class="ledger-security-grid">
        ${[
          ["Never upload seed phrases", "Receipts should never include recovery phrases, seed words, or private keys."],
          ["Never upload private keys", "LedgerCore only organizes records and public transaction references."],
          ["Not tax advice", "AllocaFi provides possible tax category suggestions only."],
          ["No custody", "AllocaFi does not custody funds or move money inside LedgerCore."],
          ["Records only", "LedgerCore organizes transaction, receipt, review, and export records."],
        ].map(([title, detail]) => `<article class="ledger-warning-card"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span></article>`).join("")}
      </div>
    </section>
  `;
}

function renderLedgerContent(state) {
  const active = state.activeTab || "dashboard";
  if (active === "transactions") return renderLedgerTransactions(state);
  if (active === "templates") return renderLedgerTemplates(state);
  if (active === "receipts") return renderLedgerReceipts(state);
  if (active === "review") return renderLedgerReview(state);
  if (active === "exports") return renderLedgerExports(state);
  if (active === "settings") return renderLedgerSettings(state);
  if (active === "security") return renderLedgerSecurity(state);
  return renderLedgerDashboard(state);
}

export function renderLedgerCoreShell(state) {
  const active = state.activeTab || "dashboard";
  return `
    <section class="ledgercore-dashboard">
      <aside class="ledger-sidebar">
        <div class="ledger-brand-lockup">
          <span class="ledger-brand-mark">LC</span>
          <div><strong>AllocaFi LedgerCore&trade;</strong><small>Tax intelligence engine</small></div>
        </div>
        <nav class="ledger-nav">
          ${LEDGERCORE_TABS.map((tab) => `<button class="${activeClass(active, tab.id)}" data-ledger-tab="${escapeHtml(tab.id)}" type="button">${escapeHtml(tab.label)}</button>`).join("")}
        </nav>
        <div class="ledger-side-note">
          <strong>Professional review required</strong>
          <span>${LEDGERCORE_LEGAL_REVIEW_COPY}</span>
        </div>
      </aside>
      <main class="ledger-main">
        <header class="ledger-topbar">
          <div class="ledger-hero-pill">
            <strong>The receipt, tax, and transaction intelligence engine behind the AllocaFi ecosystem.</strong>
            <span>Logs spending, stores receipts, detects categories, and prepares review-ready exports.</span>
          </div>
          <div class="ledger-top-actions">
            <button data-ledger-scan type="button">Scan</button>
            <button data-ledger-export="${escapeHtml(state.settings?.exportFormatPreference || "csv")}" type="button">Export</button>
          </div>
        </header>
        ${renderLedgerContent(state)}
      </main>
    </section>
  `;
}

export function renderLedgerTransactionDialog(transaction = {}, state = {}) {
  const isEditing = Boolean(transaction?.id);
  const category = transaction.possibleTaxCategory || "Uncategorized";
  const tag = transaction.writeOffEligibilityTag || "Needs Review";
  return `
    <div class="dialog-content ledger-dialog">
      <h2>${isEditing ? "Edit" : "Add"} Ledger Transaction</h2>
      <p class="wallet-note">${LEDGERCORE_LEGAL_REVIEW_COPY}</p>
      <div class="ledger-dialog-grid">
        <label>Source<select id="ledgerTxSource">${PRODUCT_LINE_SOURCES.map((source) => `<option value="${escapeHtml(source)}" ${transaction.source === source ? "selected" : ""}>${escapeHtml(source)}</option>`).join("")}</select></label>
        <label>Wallet address<input id="ledgerTxWallet" value="${escapeHtml(transaction.walletAddress || "")}" placeholder="Public wallet address or external route" /></label>
        <label>Token used<input id="ledgerTxToken" value="${escapeHtml(transaction.tokenUsed || "USDC")}" /></label>
        <label>Amount<input id="ledgerTxAmount" type="number" min="0" step="0.01" value="${escapeHtml(transaction.amount || "")}" /></label>
        <label>Fiat estimate<input id="ledgerTxFiat" type="number" min="0" step="0.01" value="${escapeHtml(transaction.fiatValueEstimate || transaction.amount || "")}" /></label>
        <label>Network<input id="ledgerTxNetwork" value="${escapeHtml(transaction.network || "Local record")}" /></label>
        <label>Transaction hash<input id="ledgerTxHash" value="${escapeHtml(transaction.transactionHash || "")}" /></label>
        <label>Budget account<input id="ledgerTxBudget" value="${escapeHtml(transaction.budgetAccountUsed || "")}" /></label>
        <label>Merchant/address<input id="ledgerTxMerchant" value="${escapeHtml(transaction.merchantOrAddress || "")}" /></label>
        <label>Classification<select id="ledgerTxClassification">${["personal", "business", "family", "commerce", "enterprise", "mixed"].map((item) => `<option value="${item}" ${transaction.classification === item || (!transaction.classification && state.settings?.defaultClassification === item) ? "selected" : ""}>${item}</option>`).join("")}</select></label>
        <label>Possible tax category<select id="ledgerTxCategory">${TAX_CATEGORIES.map((item) => `<option value="${escapeHtml(item.label)}" ${category === item.label ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}</select></label>
        <label>Eligibility tag<select id="ledgerTxTag">${WRITE_OFF_ELIGIBILITY_TAGS.map((item) => `<option value="${escapeHtml(item)}" ${tag === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}</select></label>
        <label>Mixed-use business %<input id="ledgerTxMixedPercent" type="number" min="0" max="100" step="1" value="${escapeHtml(transaction.mixedUseBusinessPercent || 0)}" /></label>
        <label>Review status<select id="ledgerTxReviewStatus">${["needs_review", "reviewed", "export_ready"].map((item) => `<option value="${item}" ${transaction.reviewStatus === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>
      </div>
      <label>Notes<textarea id="ledgerTxNotes" rows="3">${escapeHtml(transaction.notes || "")}</textarea></label>
      <label class="check-row"><input id="ledgerTxReceiptRequired" type="checkbox" ${transaction.receiptRequired !== false ? "checked" : ""} /> Receipt required</label>
      <label class="check-row"><input id="ledgerTxExportReady" type="checkbox" ${transaction.exportReady ? "checked" : ""} /> Mark export ready</label>
      <div class="dialog-actions">
        <button id="saveLedgerTransaction" class="primary-button" type="button">Save Transaction</button>
      </div>
      <p class="form-note">${LEDGERCORE_EXPORT_DISCLAIMER}</p>
    </div>
  `;
}

export function renderLedgerReceiptDialog({ receipt = {}, transactionId = "", transactions = [] } = {}) {
  const selectedTx = receipt.transactionId || transactionId;
  return `
    <div class="dialog-content ledger-dialog">
      <h2>${receipt.id ? "Replace" : "Upload"} Receipt</h2>
      <p class="wallet-note">Upload a receipt image/PDF only. Never upload seed phrases, private keys, bank passwords, or recovery phrases.</p>
      <label>Attach to transaction<select id="ledgerReceiptTx">${transactions.map((tx) => `<option value="${escapeHtml(tx.id)}" ${selectedTx === tx.id ? "selected" : ""}>${escapeHtml(tx.merchantOrAddress)} - ${formatUsd(tx.fiatValueEstimate || tx.amount)}</option>`).join("")}</select></label>
      <label>Receipt image/PDF<input id="ledgerReceiptFile" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" /></label>
      <div id="ledgerReceiptPreview" class="ledger-receipt-preview">${receipt.dataUrl ? (receipt.fileType?.includes("pdf") ? `<span>PDF stored: ${escapeHtml(receipt.fileName)}</span>` : `<img alt="Receipt preview" src="${escapeHtml(receipt.dataUrl)}" />`) : `<span>No receipt selected</span>`}</div>
      <label>Notes<input id="ledgerReceiptNotes" value="${escapeHtml(receipt.notes || "")}" placeholder="Receipt memo" /></label>
      <label class="check-row"><input id="ledgerReceiptVerified" type="checkbox" ${receipt.verified ? "checked" : ""} /> Mark receipt verified</label>
      <div class="dialog-actions"><button id="saveLedgerReceipt" class="primary-button" type="button">Save Receipt</button></div>
    </div>
  `;
}

export function renderLedgerReceiptPreview(receipt = {}) {
  return `
    <div class="dialog-content ledger-dialog">
      <h2>Receipt Preview</h2>
      <p class="wallet-note">${escapeHtml(receipt.fileName || "Receipt")}</p>
      <div class="ledger-receipt-preview large">
        ${receipt.dataUrl
          ? receipt.fileType?.includes("pdf")
            ? `<iframe title="Receipt PDF preview" src="${escapeHtml(receipt.dataUrl)}"></iframe>`
            : `<img alt="Receipt preview" src="${escapeHtml(receipt.dataUrl)}" />`
          : `<span>No local preview data stored for this receipt.</span>`}
      </div>
      <div class="dialog-actions"><button id="closeLedgerReceiptPreview" class="secondary-button" type="button">Close</button></div>
    </div>
  `;
}

export function renderLedgerMixedRuleDialog() {
  return `
    <div class="dialog-content ledger-dialog">
      <h2>Add Mixed-Use Rule</h2>
      <label>Budget account<input id="ledgerMixedAccount" value="Phone Bill Account" /></label>
      <label>Business use percentage<input id="ledgerMixedBusiness" type="number" min="0" max="100" value="70" /></label>
      <div class="dialog-actions"><button id="saveLedgerMixedRule" class="primary-button" type="button">Save Rule</button></div>
      <p class="form-note">Example export note: User marked 70% business use.</p>
    </div>
  `;
}
