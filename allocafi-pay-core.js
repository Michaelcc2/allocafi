export const ALLOCAFI_PAY_STORAGE_VERSION = 1;

/**
 * @typedef {Object} PaymentMethod
 * @property {string} id
 * @property {string} provider
 * @property {string} providerName
 * @property {"fiat"|"crypto"} type
 * @property {string} displayHandle
 * @property {string} qrImageUrl
 * @property {string} walletAddress
 * @property {string} network
 * @property {string} asset
 * @property {boolean} active
 * @property {boolean} preferred
 * @property {string} dateAdded
 * @property {string} lastUsed
 *
 * @typedef {PaymentMethod & { qrImageUrl: string }} QRPaymentMethod
 * @typedef {PaymentMethod & { walletAddress: string, asset: string, network: string }} CryptoWalletMethod
 *
 * @typedef {Object} PaymentRoute
 * @property {string} provider
 * @property {string} providerName
 * @property {"fiat"|"crypto"} type
 * @property {string} senderMethodId
 * @property {string} receiverHandle
 * @property {string} receiverAddress
 * @property {string} deepLink
 * @property {string} asset
 * @property {number} amount
 *
 * @typedef {Object} PaymentContact
 * @property {string} id
 * @property {string} name
 * @property {string} avatar
 * @property {string} preferredProvider
 * @property {string} handle
 * @property {string} lastRoute
 * @property {Array<Partial<PaymentMethod>>} methods
 *
 * @typedef {Object} PaymentTransaction
 * @property {string} id
 * @property {"sent"|"received"|"requested"} direction
 * @property {string} contactName
 * @property {string} method
 * @property {number} amount
 * @property {string} currency
 * @property {string} timestamp
 * @property {string} status
 * @property {string} txHash
 * @property {string} externalAppLabel
 * @property {string} note
 *
 * @typedef {Object} RoutingResult
 * @property {"matched"|"no-match"} status
 * @property {string} title
 * @property {string} message
 * @property {PaymentRoute|null} recommended
 * @property {Array<{sender: PaymentMethod, receiver: PaymentMethod, provider: string, key: string}>} options
 *
 * @typedef {Object} PayDashboardMetrics
 * @property {number} cashflow
 * @property {number} allocatedFunds
 * @property {number} emergencyReserve
 * @property {number} reserveMonths
 * @property {number} paymentActivity
 * @property {number} activeMethodCount
 * @property {number} totalPayBalance
 * @property {Record<string, number>} stablecoinBreakdown
 * @property {boolean} nonCustodial
 */

export const ALLOCAFI_PAY_TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "methods", label: "Payment Methods" },
  { id: "qr", label: "QR Profile" },
  { id: "routing", label: "Smart Routing" },
  { id: "transactions", label: "Transaction Records" },
  { id: "security", label: "Security & Privacy" },
  { id: "preferences", label: "Preferences" },
];

export const PAY_PROVIDER_CONFIG = {
  cashapp: { label: "Cash App", type: "fiat", accent: "cashapp", short: "$", handlePrefix: "$", deepLink: (handle) => `https://cash.app/${normalizePaymentHandle("cashapp", handle)}` },
  venmo: { label: "Venmo", type: "fiat", accent: "venmo", short: "V", handlePrefix: "@", deepLink: (handle) => `https://venmo.com/${normalizePaymentHandle("venmo", handle).replace(/^@/, "")}` },
  zelle: { label: "Zelle", type: "fiat", accent: "zelle", short: "Z", handlePrefix: "", deepLink: () => "" },
  paypal: { label: "PayPal", type: "fiat", accent: "paypal", short: "P", handlePrefix: "", deepLink: (handle) => String(handle || "").startsWith("http") ? handle : `https://paypal.me/${String(handle || "").replace(/^@/, "")}` },
  trust: { label: "Trust Wallet", type: "crypto", accent: "trust", short: "T", walletKind: "multi" },
  phantom: { label: "Phantom", type: "crypto", accent: "phantom", short: "P", walletKind: "solana" },
  solana: { label: "Solana Wallet", type: "crypto", accent: "solana", short: "S", walletKind: "solana" },
  evm: { label: "EVM Wallet", type: "crypto", accent: "evm", short: "E", walletKind: "evm" },
  usdc: { label: "USDC Wallet", type: "crypto", accent: "usdc", short: "U", asset: "USDC" },
  pyusd: { label: "PYUSD Wallet", type: "crypto", accent: "pyusd", short: "P", asset: "PYUSD" },
  usdt: { label: "USDT Wallet", type: "crypto", accent: "usdt", short: "T", asset: "USDT" },
};

export const PAY_ROUTE_PRIORITY = ["cashapp", "venmo", "paypal", "zelle", "usdc", "pyusd", "usdt", "phantom", "solana", "evm", "trust"];

export const PAY_METHOD_TYPES = {
  FIAT: "fiat",
  CRYPTO: "crypto",
};

export const DEFAULT_PAY_CONTACTS = [
  {
    id: "contact-sarah",
    name: "Sarah J.",
    avatar: "SJ",
    preferredProvider: "cashapp",
    handle: "$casarah",
    lastRoute: "Cash App",
    methods: [
      { provider: "cashapp", displayHandle: "$casarah", active: true },
      { provider: "usdc", displayHandle: "USDC wallet", walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", asset: "USDC", active: true },
    ],
  },
  {
    id: "contact-mike",
    name: "Mike D.",
    avatar: "MD",
    preferredProvider: "venmo",
    handle: "@miked",
    lastRoute: "Venmo",
    methods: [
      { provider: "venmo", displayHandle: "@miked", active: true },
      { provider: "paypal", displayHandle: "miked-pay", active: true },
    ],
  },
  {
    id: "contact-john",
    name: "John K.",
    avatar: "JK",
    preferredProvider: "venmo",
    handle: "johnk@venmo",
    lastRoute: "Venmo",
    methods: [
      { provider: "venmo", displayHandle: "johnk@venmo", active: true },
      { provider: "usdt", displayHandle: "USDT wallet", walletAddress: "0x8ba1f109551bD432803012645Ac136ddd64DBA72", asset: "USDT", active: true },
    ],
  },
  {
    id: "contact-lisa",
    name: "Lisa M.",
    avatar: "LM",
    preferredProvider: "cashapp",
    handle: "$lisam24",
    lastRoute: "Cash App",
    methods: [
      { provider: "cashapp", displayHandle: "$lisam24", active: true },
      { provider: "zelle", displayHandle: "lisa@example.com", active: true },
    ],
  },
];

export function createDefaultPayState(now = new Date().toISOString()) {
  return {
    version: ALLOCAFI_PAY_STORAGE_VERSION,
    activeTab: "dashboard",
    preferences: {
      publicName: "Alex Carter",
      publicHandle: "@alexc",
      defaultCurrency: "USD",
      preferredProvider: "cashapp",
      requireManualConfirmation: true,
      showNonCustodialPrompts: true,
    },
    methods: [
      createPayMethod({ id: "pay-cashapp", provider: "cashapp", displayHandle: "$alexcarter", active: true, preferred: true, dateAdded: now, lastUsed: now }),
      createPayMethod({ id: "pay-venmo", provider: "venmo", displayHandle: "@alexcarter", active: true, dateAdded: now, lastUsed: now }),
      createPayMethod({ id: "pay-zelle", provider: "zelle", displayHandle: "alex.carter@example.com", active: true, dateAdded: now, lastUsed: "" }),
      createPayMethod({ id: "pay-paypal", provider: "paypal", displayHandle: "paypal.me/alexcarter", active: true, dateAdded: now, lastUsed: now }),
      createPayMethod({ id: "pay-usdc", provider: "usdc", displayHandle: "USDC Wallet", walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", asset: "USDC", network: "Ethereum", active: true, dateAdded: now, lastUsed: now }),
      createPayMethod({ id: "pay-pyusd", provider: "pyusd", displayHandle: "PYUSD Wallet", walletAddress: "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo", asset: "PYUSD", network: "Solana", active: true, dateAdded: now, lastUsed: "" }),
      createPayMethod({ id: "pay-usdt", provider: "usdt", displayHandle: "USDT Wallet", walletAddress: "0x8ba1f109551bD432803012645Ac136ddd64DBA72", asset: "USDT", network: "EVM", active: true, dateAdded: now, lastUsed: "" }),
    ],
    contacts: DEFAULT_PAY_CONTACTS,
    transactions: [
      createPayTransaction({ id: "pay-tx-1", direction: "received", contactName: "Sarah J.", method: "USDC", amount: 250, currency: "USDC", status: "crypto transfer confirmed", timestamp: minutesAgo(2), externalAppLabel: "Wallet", txHash: "0x7f3a...a8b9", note: "USDC from contact" }),
      createPayTransaction({ id: "pay-tx-2", direction: "sent", contactName: "Mike D.", method: "Cash App", amount: 75, currency: "USD", status: "routed externally", timestamp: minutesAgo(15), externalAppLabel: "Cash App", note: "Manual confirmation recorded" }),
      createPayTransaction({ id: "pay-tx-3", direction: "received", contactName: "AllocaFi Commerce", method: "USDC", amount: 450, currency: "USDC", status: "crypto transfer confirmed", timestamp: minutesAgo(60), externalAppLabel: "Storefront", txHash: "0x91d2...4f21", note: "Storefront payment" }),
      createPayTransaction({ id: "pay-tx-4", direction: "sent", contactName: "John K.", method: "Venmo", amount: 120, currency: "USD", status: "routed externally", timestamp: hoursAgo(3), externalAppLabel: "Venmo", note: "Route launched externally" }),
    ],
  };
}

export function minutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60000).toISOString();
}

export function hoursAgo(hours) {
  return new Date(Date.now() - hours * 3600000).toISOString();
}

export function createPayMethod(input = {}) {
  const provider = String(input.provider || "cashapp").toLowerCase();
  const config = PAY_PROVIDER_CONFIG[provider] || PAY_PROVIDER_CONFIG.cashapp;
  return {
    id: input.id || `pay-method-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    provider,
    providerName: config.label,
    type: config.type,
    displayHandle: normalizePaymentHandle(provider, input.displayHandle || input.handle || ""),
    qrImageUrl: input.qrImageUrl || "",
    walletAddress: String(input.walletAddress || "").trim(),
    network: input.network || "",
    asset: input.asset || config.asset || "",
    active: input.active !== false,
    preferred: Boolean(input.preferred),
    dateAdded: input.dateAdded || new Date().toISOString(),
    lastUsed: input.lastUsed || "",
  };
}

export function createPayTransaction(input = {}) {
  return {
    id: input.id || `pay-tx-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    direction: input.direction || "sent",
    contactName: input.contactName || "Manual contact",
    method: input.method || "Manual",
    amount: Number(input.amount || 0),
    currency: input.currency || "USD",
    timestamp: input.timestamp || new Date().toISOString(),
    status: input.status || "routed externally",
    txHash: input.txHash || "",
    externalAppLabel: input.externalAppLabel || "",
    note: input.note || "",
  };
}

export function normalizePaymentHandle(provider, value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const config = PAY_PROVIDER_CONFIG[String(provider || "").toLowerCase()] || {};
  if (provider === "cashapp") return raw.startsWith("$") ? raw : `$${raw.replace(/^@/, "")}`;
  if (provider === "venmo") return raw.startsWith("@") ? raw : `@${raw.replace(/^\$/, "")}`;
  if (provider === "paypal") return raw.replace(/^(?:https?:\/\/)?(?:www\.)?paypal\.me\//i, "");
  if (config.type === "crypto") return raw;
  return raw;
}

export function hasForbiddenPaySecret(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value || "");
  return /(seed\s*phrase|mnemonic|private\s*key|secret\s*key|recovery\s*phrase)/i.test(text);
}

export function validateWalletAddress(provider, address) {
  const walletAddress = String(address || "").trim();
  if (!walletAddress) return { valid: false, message: "Wallet address is required." };
  if (hasForbiddenPaySecret(walletAddress)) return { valid: false, message: "Never enter seed phrases, private keys, or recovery phrases." };
  const normalizedProvider = String(provider || "").toLowerCase();
  const looksEvm = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
  const looksSolana = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress);
  if (["evm", "trust", "usdc", "usdt"].includes(normalizedProvider) && looksEvm) return { valid: true, message: "Valid EVM-style address." };
  if (["phantom", "solana", "pyusd", "trust"].includes(normalizedProvider) && looksSolana) return { valid: true, message: "Valid Solana-style address." };
  if (["usdc", "usdt", "pyusd"].includes(normalizedProvider) && (looksEvm || looksSolana)) return { valid: true, message: "Valid stablecoin wallet address." };
  return { valid: false, message: "Enter a valid EVM address or Solana address for this method." };
}

export function validatePaymentHandle(provider, handle) {
  const normalizedProvider = String(provider || "").toLowerCase();
  const value = normalizePaymentHandle(normalizedProvider, handle);
  if (!value) return { valid: false, message: "Payment handle or reference is required." };
  if (hasForbiddenPaySecret(value)) return { valid: false, message: "Do not store private keys, seed phrases, or recovery phrases." };
  if (normalizedProvider === "cashapp" && !/^\$[A-Za-z0-9_]{1,30}$/.test(value)) return { valid: false, message: "Cash App handle should look like $alexcarter." };
  if (normalizedProvider === "venmo" && !/^@[A-Za-z0-9_.-]{2,40}$/.test(value)) return { valid: false, message: "Venmo handle should look like @alexcarter." };
  if (normalizedProvider === "zelle" && !(/^(\+?[0-9().\-\s]{7,20}|[^@\s]+@[^@\s]+\.[^@\s]+)$/.test(value))) return { valid: false, message: "Zelle reference should be an email or phone number." };
  if (normalizedProvider === "paypal" && !/^(https?:\/\/)?(paypal\.me\/)?[A-Za-z0-9_.-]{2,60}$/i.test(value)) return { valid: false, message: "PayPal should be a PayPal.me link or profile name." };
  return { valid: true, message: "Valid payment reference." };
}

export function validatePaymentMethodInput(input, existingMethods = []) {
  const provider = String(input.provider || "").toLowerCase();
  const config = PAY_PROVIDER_CONFIG[provider];
  if (!config) return { valid: false, message: "Choose a supported provider." };
  if (hasForbiddenPaySecret(input)) return { valid: false, message: "Private keys, seed phrases, and recovery phrases are not allowed." };
  const reference = config.type === "crypto" ? String(input.walletAddress || input.displayHandle || "") : String(input.displayHandle || "");
  const qrReference = config.type !== "crypto" ? String(input.qrImageUrl || "").trim() : "";
  const validation = config.type === "crypto"
    ? validateWalletAddress(provider, reference)
    : reference
      ? validatePaymentHandle(provider, reference)
      : qrReference
        ? { valid: true, message: "QR payment reference saved." }
        : { valid: false, message: "Payment handle, link, email, phone, or QR image is required." };
  if (!validation.valid) return validation;
  const normalizedReference = config.type === "crypto" ? reference.trim().toLowerCase() : normalizePaymentHandle(provider, reference || qrReference.slice(0, 96)).toLowerCase();
  const duplicate = existingMethods.some((method) => {
    if (method.id && method.id === input.id) return false;
    const existingReference = method.type === "crypto"
      ? String(method.walletAddress || method.displayHandle || "").trim().toLowerCase()
      : normalizePaymentHandle(method.provider, method.displayHandle || String(method.qrImageUrl || "").slice(0, 96)).toLowerCase();
    return String(method.provider).toLowerCase() === provider && existingReference === normalizedReference;
  });
  if (duplicate) return { valid: false, message: "This payment method already exists." };
  return { valid: true, message: "Payment method is valid." };
}

export function normalizePayState(state) {
  const defaults = createDefaultPayState();
  const data = state && typeof state === "object" ? state : {};
  const methods = Array.isArray(data.methods) ? data.methods.map(createPayMethod) : defaults.methods;
  return {
    ...defaults,
    ...data,
    preferences: { ...defaults.preferences, ...(data.preferences || {}) },
    methods,
    contacts: Array.isArray(data.contacts) ? data.contacts : defaults.contacts,
    transactions: Array.isArray(data.transactions) ? data.transactions.map(createPayTransaction) : defaults.transactions,
    activeTab: ALLOCAFI_PAY_TABS.some((tab) => tab.id === data.activeTab) ? data.activeTab : "dashboard",
  };
}

export function getActivePayMethods(methods = []) {
  return methods.filter((method) => method && method.active !== false);
}

export function getMethodCompatibilityKey(method) {
  const provider = String(method?.provider || "").toLowerCase();
  const config = PAY_PROVIDER_CONFIG[provider] || {};
  if (config.type !== "crypto") return provider;
  return method.asset ? `crypto:${String(method.asset).toUpperCase()}` : `crypto:${config.walletKind || provider}`;
}

export function findBestPaymentRoute(senderMethods = [], receiverMethods = [], options = {}) {
  const senders = getActivePayMethods(senderMethods);
  const receivers = getActivePayMethods(receiverMethods);
  const senderKeys = new Map(senders.map((method) => [getMethodCompatibilityKey(method), method]));
  const routeCandidates = receivers
    .map((receiver) => {
      const key = getMethodCompatibilityKey(receiver);
      const sender = senderKeys.get(key);
      return sender ? { sender, receiver, provider: receiver.provider, key } : null;
    })
    .filter(Boolean);
  if (!routeCandidates.length) {
    return {
      status: "no-match",
      title: "No shared payment route found",
      message: "Exchange a payment method manually, or use a crypto wallet transfer if both users approve it.",
      recommended: null,
      options: [],
    };
  }
  const recommended = routeCandidates.sort((a, b) => {
    const providerA = PAY_ROUTE_PRIORITY.indexOf(a.provider);
    const providerB = PAY_ROUTE_PRIORITY.indexOf(b.provider);
    return (providerA === -1 ? 99 : providerA) - (providerB === -1 ? 99 : providerB);
  })[0];
  const config = PAY_PROVIDER_CONFIG[recommended.provider] || {};
  const isCrypto = config.type === "crypto";
  return {
    status: "matched",
    title: `${config.label || recommended.provider} is the recommended route`,
    message: isCrypto
      ? "Prepare a wallet transfer request. The user approves and signs in their own wallet."
      : `Open ${config.label} or copy the receiver reference. The user confirms payment in the external app.`,
    recommended: {
      provider: recommended.provider,
      providerName: config.label || recommended.provider,
      type: config.type || "fiat",
      senderMethodId: recommended.sender.id || "",
      receiverHandle: recommended.receiver.displayHandle || recommended.receiver.walletAddress || "",
      receiverAddress: recommended.receiver.walletAddress || "",
      deepLink: buildExternalPaymentLink(recommended.receiver),
      asset: recommended.receiver.asset || "",
      amount: Number(options.amount || 0),
    },
    options: routeCandidates,
  };
}

export function buildExternalPaymentLink(method) {
  const provider = String(method?.provider || "").toLowerCase();
  const config = PAY_PROVIDER_CONFIG[provider];
  if (!config?.deepLink) return "";
  return config.deepLink(method.displayHandle || method.walletAddress || "");
}

export function getPayMonthlyExpenseBaseline({ dashboard = {}, details = {} } = {}) {
  const listedBills = Math.max(Number(details.billsRequired || 0), 0);
  if (listedBills > 0) return { amount: listedBills, source: "listed bills" };

  const essentialPattern = /bill|rent|mortgage|utility|utilities|electric|water|internet|phone|insurance|food|grocery|gas|transport|medical|health|child|care/i;
  const essentialGoals = (details.bucketRows || []).reduce((sum, row) => {
    const bucketName = String(row.bucket?.name || "");
    if (!essentialPattern.test(bucketName) && row.group !== "Bills" && row.group !== "Available Cashflow") return sum;
    return sum + Math.max(Number(row.bucket?.monthlyGoal || 0), 0);
  }, 0);
  if (essentialGoals > 0) return { amount: essentialGoals, source: "monthly goals" };

  const observedOutflow = Math.max(Number(dashboard.monthSpending || 0), Number(dashboard.moneyOut || 0), 0);
  if (observedOutflow > 0) return { amount: observedOutflow, source: "recorded spending" };

  return { amount: 0, source: "missing" };
}

export function getPayDashboardMetrics({ dashboard = {}, details = {}, payState = {} } = {}) {
  const methods = getActivePayMethods(payState.methods || []);
  const transactions = Array.isArray(payState.transactions) ? payState.transactions : [];
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const weeklyActivity = transactions.filter((tx) => Date.parse(tx.timestamp || "") >= weekAgo).length;
  const emergencyRows = (details.bucketRows || []).filter((row) => /emergency|reserve/i.test(row.bucket?.name || ""));
  const emergencyReserve = emergencyRows.reduce((sum, row) => sum + Number(row.left || 0), 0);
  const expenseBaseline = getPayMonthlyExpenseBaseline({ dashboard, details });
  const liveStablecoins = Object.fromEntries((details.stablecoins || []).map(([asset, amount]) => [asset, Number(amount || 0)]));
  const hasLiveStablecoins = Object.values(liveStablecoins).some((amount) => Number(amount || 0) > 0);
  const stablecoinBreakdown = hasLiveStablecoins ? liveStablecoins : { USDC: 6250, PYUSD: 4000, USDT: 2330.45 };
  const totalPayBalance = hasLiveStablecoins
    ? Number(details.stablecoinTotal || 0)
    : Object.values(stablecoinBreakdown).reduce((sum, amount) => sum + Number(amount || 0), 0);
  return {
    cashflow: Math.max(Number(details.cashflowBalance || dashboard.walletBalance || 0), hasLiveStablecoins ? 0 : 4250),
    allocatedFunds: Math.max(Number(dashboard.bucketLeft || dashboard.allocated || 0), hasLiveStablecoins ? 0 : 8250),
    emergencyReserve: Math.max(emergencyReserve, hasLiveStablecoins ? 0 : 2500),
    reserveMonths: emergencyReserve > 0 && expenseBaseline.amount > 0 ? emergencyReserve / expenseBaseline.amount : hasLiveStablecoins ? 0 : 3.1,
    reserveExpenseBaseline: expenseBaseline.amount,
    reserveBaselineSource: expenseBaseline.source,
    paymentActivity: weeklyActivity,
    activeMethodCount: methods.length,
    totalPayBalance,
    stablecoinBreakdown,
    nonCustodial: true,
  };
}
