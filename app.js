const STORAGE_KEY = "wallet-buckets-v1";
const {
  ENTERPRISE_MOCK_DATA,
  ENTERPRISE_ROLES,
  ENTERPRISE_TIME_FILTERS,
  getEnterpriseDashboardModel,
} = await import("./enterprise-dashboard-core.js");
const {
  FAMILY_TREASURY_MOCK_DATA,
  getFamilyTreasuryDashboardModel,
} = await import("./family-treasury-core.js");
const {
  ALLOCAFI_PAY_TABS,
  PAY_PROVIDER_CONFIG,
  PAY_METHOD_TYPES,
  buildExternalPaymentLink,
  createDefaultPayState,
  createPayMethod,
  createPayTransaction,
  findBestPaymentRoute,
  getPayDashboardMetrics,
  normalizePayState,
  validatePaymentMethodInput,
} = await import("./allocafi-pay-core.js");
const {
  LEDGERCORE_EXPORT_DISCLAIMER,
  LEDGERCORE_LEGAL_REVIEW_COPY,
  LEDGERCORE_TABS,
  PRODUCT_LINE_SOURCES,
  TAX_BUDGET_TEMPLATES,
  TAX_CATEGORIES,
  WRITE_OFF_ELIGIBILITY_TAGS,
  applyTaxBudgetTemplate,
  buildReviewQueue,
  createDefaultLedgerCoreState,
  createLedgerExport,
  createLedgerTransaction,
  createReceiptRecord,
  detectTaxCategory,
  getLedgerCoreMetrics,
  markLedgerTransactionExportReady,
  markLedgerTransactionReviewed,
  normalizeLedgerCoreState,
  updateLedgerReceipt,
  updateLedgerTransaction,
} = await import("./ledgercore-core.js");
const {
  renderLedgerCoreShell,
  renderLedgerMixedRuleDialog,
  renderLedgerReceiptDialog,
  renderLedgerReceiptPreview,
  renderLedgerTransactionDialog,
} = await import("./ledgercore-ui.js");

const WALLETCONNECT_PROJECT_KEY = "allocafi-walletconnect-project-v1";
const cryptoApi = globalThis.crypto || {};
const crypto = {
  ...cryptoApi,
  subtle: cryptoApi.subtle,
  getRandomValues: typeof cryptoApi.getRandomValues === "function"
    ? cryptoApi.getRandomValues.bind(cryptoApi)
    : () => {
      throw new Error("Secure browser crypto is required for wallet sends and Vault encryption.");
    },
  randomUUID: typeof cryptoApi.randomUUID === "function"
    ? cryptoApi.randomUUID.bind(cryptoApi)
    : () => `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
};
const SOLANA_RPC_URL_KEY = "allocafi-solana-rpc-url-v1";
const SERVER_SOLANA_RPC_ENDPOINT = "__allocafi_server_solana_rpc__";
const WALLETCONNECT_PROVIDER_URL = "https://esm.sh/@walletconnect/ethereum-provider@2.23.6";
const WALLETCONNECT_UNIVERSAL_PROVIDER_URL = "https://esm.sh/@walletconnect/universal-provider@2.21.8";
const SOLANA_WEB3_URL = "https://esm.sh/@solana/web3.js@1.95.8";
const SOLANA_SPL_TOKEN_URL = "https://esm.sh/@solana/spl-token@0.4.9";
const SOLANA_TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
const SOLANA_TOKEN_2022_PROGRAM_ID = "TokenzQdBNbLqP5VEhdkAS6EPzYm3S5FWnW7zWuCxgu";
const PERSONAL_LIQUIDATION_ACTION = "__personal_liquidation";
const VAULT_ACTIVITY_KEY = "allocafi-vault-activity-v1";
const VAULT_LAST_BACKUP_KEY = "allocafi-vault-last-backup-v1";
const VAULT_AUTO_SNAPSHOT_KEY = "allocafi-vault-auto-snapshot-v1";
const VAULT_AUTO_SNAPSHOT_META_KEY = "allocafi-vault-auto-snapshot-meta-v1";
const VAULT_AUTO_PASSWORD_KEY = "allocafi-vault-auto-password-v1";
const VAULT2_OWNER_WALLET_KEY = "allocafi-vault2-owner-wallet-v1";
const VAULT2_RECOVERY_WALLETS_KEY = "allocafi-vault2-recovery-wallets-v1";
const VAULT2_TRUSTED_DEVICES_KEY = "allocafi-vault2-trusted-devices-v1";
const VAULT2_SESSION_KEY = "allocafi-vault2-session-v1";
const VAULT2_SNAPSHOT_HISTORY_KEY = "allocafi-vault2-snapshot-history-v1";
const VAULT2_ASSET_RECORDS_KEY = "allocafi-vault2-asset-records-v1";
const UNIFIED_FINANCE_KEY = "allocafi-unified-finance-v1";
const ACCOUNT_SESSION_KEY = "allocafi-account-session-v1";
const ACCOUNT_PROFILE_KEY = "allocafi-account-profile-v1";
const ACCOUNT_SYNC_QUEUE_KEY = "allocafi-cloud-sync-queue-v1";
const ACCOUNT_MIGRATION_KEY = "allocafi-cloud-migration-v1";
const CLOUD_PROVIDER_STATUS_KEY = "allocafi-cloud-provider-status-v1";
const AI_INSIGHTS_KEY = "allocafi-ai-insights-v1";
const AI_CATEGORY_SUGGESTIONS_KEY = "allocafi-ai-category-suggestions-v1";
const ALLOCAFI_AI_STATE_KEY = "allocafi-ai-operating-state-v1";
const ALLOCAFI_AI_CHAT_KEY = "allocafi-ai-chat-history-v1";
const ALLOCAFI_AI_LOG_KEY = "allocafi-ai-request-log-v1";
const ALLOCAFI_AI_PRICING_KEY = "allocafi-ai-pricing-rules-v1";
const ALLOCAFI_AI_CREDIT_SETTINGS_KEY = "allocafi-ai-credit-settings-v1";
const ALLOCAFI_AI_SKINS_KEY = "allocafi-ai-skins-v1";
const ALLOCAFI_AI_RULE_SUGGESTIONS_KEY = "allocafi-ai-rule-suggestions-v1";
const ALLOCAFI_VAULT_EXPORT_LOG_KEY = "allocafi-vault-export-log-v1";
const VIRTUAL_ASSET_ACCOUNTS_KEY = "allocafi-virtual-asset-accounts-v1";
const LEGAL_CORE_ASSET_RECORDS_KEY = "allocafi-legal-core-asset-records-v1";
const TAX_LEDGER_ASSET_RECORDS_KEY = "allocafi-tax-ledger-asset-records-v1";
const SUBSCRIPTION_STATE_KEY = "allocafi-subscription-state-v1";
const SUBSCRIPTION_BILLING_KEY = "allocafi-subscription-billing-v1";
const ALLOCAFI_PAY_KEY = "allocafi-pay-v1";
const ALLOCAFI_LEDGERCORE_KEY = "allocafi-ledgercore-v1";
const ALLOCAFI_CONNECT_KEY = "allocafi-connect-v1";
const DEMO_MODE_KEY = "allocafi-demo-mode-v1";
const DEMO_BACKUP_KEY = "allocafi-demo-backup-v1";
const ONBOARDING_STATUS_KEY = "allocafi-onboarding-status-v1";
const ONBOARDING_FLOW_KEY = "allocafi-onboarding-flow-v2";
const ONBOARDING_DEMO_STAGE_KEY = "allocafi-onboarding-demo-stage-v1";
const ONBOARDING_ALLOWED_OWNER_ASSETS = new Set(["USDC", "USDT", "PYUSD"]);
const ONBOARDING_FREE_BUCKET_LIMIT = 3;
const VAULT_KDF_ITERATIONS = 250000;
const VAULT_FILE_VERSION = 1;
const SOLANA_TOKEN_INDEXERS = [
  "https://public-api.solscan.io/account/tokens?account=",
  "https://api.solscan.io/account/tokens?address=",
];
const WALLET_CONNECT_TIMEOUT_MS = 60000;
const WALLET_TX_TIMEOUT_MS = 120000;
const BALANCE_AUDIT_TOLERANCE = 0.01;
const SEND_BALANCE_TOLERANCE = 0.000001;
const STABLECOIN_LIQUIDITY_RANGES = ["24H", "7D", "30D", "1Y"];
const ALLOCAFI_CONNECT_TABS = ["messages", "calls", "contacts", "requests", "security"];
const ALLOCAFI_CONNECT_FEATURE_FLAGS = {
  connect_enabled: true,
  connect_messaging_enabled: true,
  connect_voice_calls_enabled: true,
  connect_video_calls_enabled: false,
  connect_payment_requests_enabled: false,
  connect_invoice_requests_enabled: false,
  connect_commerce_chat_enabled: false,
  connect_family_chat_enabled: false,
  connect_enterprise_chat_enabled: false,
};
const CONNECT_SECURITY_PHRASES = ["seed phrase", "private key", "recovery phrase", "password", "login code", "12 words", "24 words"];
const STABLECOIN_MARKET_BASE = {
  PYUSD: {
    marketCap: 1080000000,
    volume24h: 52000000,
    liquidity: 77,
    stability: 99.96,
    change: 0.08,
  },
  USDC: {
    marketCap: 33800000000,
    volume24h: 8200000000,
    liquidity: 94,
    stability: 99.99,
    change: 0.02,
  },
  USDT: {
    marketCap: 112400000000,
    volume24h: 54500000000,
    liquidity: 91,
    stability: 99.97,
    change: -0.01,
  },
};
const STABLECOIN_MARKET_SERIES = {
  "24H": {
    liquidity: [76, 78, 77, 79, 81, 80, 83, 82, 85, 86, 85, 88],
    volume: [63, 66, 65, 70, 72, 71, 74, 76, 78, 77, 80, 82],
    stability: [94, 95, 96, 96, 97, 96, 98, 98, 97, 98, 99, 99],
  },
  "7D": {
    liquidity: [72, 74, 76, 78, 77, 80, 82, 84, 83, 86, 88, 89],
    volume: [58, 61, 64, 66, 65, 69, 72, 73, 76, 79, 81, 83],
    stability: [93, 94, 95, 96, 96, 97, 98, 97, 98, 98, 99, 99],
  },
  "30D": {
    liquidity: [68, 70, 71, 73, 76, 78, 79, 82, 84, 86, 87, 89],
    volume: [54, 56, 59, 63, 65, 68, 70, 72, 75, 78, 80, 84],
    stability: [92, 93, 94, 94, 95, 96, 97, 97, 98, 98, 99, 99],
  },
  "1Y": {
    liquidity: [52, 57, 61, 66, 69, 72, 76, 80, 82, 85, 88, 90],
    volume: [44, 48, 53, 57, 62, 66, 70, 73, 76, 79, 82, 86],
    stability: [88, 90, 91, 93, 94, 95, 96, 97, 97, 98, 99, 99],
  },
};
const STABLECOIN_RATIO_SPARKS = {
  PYUSD: [34, 46, 42, 58, 51, 64, 57, 73, 66, 82, 76, 88],
  USDC: [62, 63, 59, 66, 61, 69, 67, 75, 72, 80, 78, 84],
  USDS: [44, 52, 49, 61, 58, 67, 62, 76, 70, 82, 77, 86],
  USDT: [55, 61, 58, 70, 65, 75, 71, 81, 77, 86, 83, 89],
  FDUSD: [40, 43, 45, 52, 49, 58, 55, 63, 61, 68, 66, 72],
  DAI: [47, 50, 48, 53, 51, 57, 55, 60, 58, 64, 62, 66],
};
const STABLECOIN_LOGO_REFERENCE_PATH = "./assets/reference-icons/major-stablecoins-20260528.png";
const STABLECOIN_LOGO_ASSET_PATH = "./assets/reference-icons/stablecoins";
const STABLECOIN_LOGOS = {
  PYUSD: {
    symbol: "PYUSD",
    name: "PayPal USD",
    issuer: "PayPal",
    className: "pyusd",
    mark: "PYUSD",
    referenceImage: STABLECOIN_LOGO_REFERENCE_PATH,
    logoImage: `${STABLECOIN_LOGO_ASSET_PATH}/pyusd-reference.png`,
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    issuer: "Tether",
    className: "usdt",
    mark: "USDT",
    referenceImage: STABLECOIN_LOGO_REFERENCE_PATH,
    logoImage: `${STABLECOIN_LOGO_ASSET_PATH}/usdt-reference.png`,
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    issuer: "Circle",
    className: "usdc",
    mark: "USDC",
    referenceImage: STABLECOIN_LOGO_REFERENCE_PATH,
    logoImage: `${STABLECOIN_LOGO_ASSET_PATH}/usdc-reference.png`,
  },
  USDS: {
    symbol: "USDS",
    name: "Sky Dollar",
    issuer: "Sky Protocol",
    className: "usds",
    mark: "USDS",
    referenceImage: STABLECOIN_LOGO_REFERENCE_PATH,
    logoImage: `${STABLECOIN_LOGO_ASSET_PATH}/usds-reference.png`,
  },
  DAI: {
    symbol: "DAI",
    name: "Dai",
    issuer: "MakerDAO",
    className: "dai",
    mark: "DAI",
    referenceImage: STABLECOIN_LOGO_REFERENCE_PATH,
    logoImage: `${STABLECOIN_LOGO_ASSET_PATH}/dai-reference.png`,
  },
  FDUSD: {
    symbol: "FDUSD",
    name: "First Digital USD",
    issuer: "First Digital",
    className: "fdusd",
    mark: "FDUSD",
    referenceImage: "",
  },
};
const STABLECOIN_ALIASES = {
  "USDC.E": "USDC",
  "USD COIN": "USDC",
  "PAYPAL USD": "PYUSD",
  "TETHER USD": "USDT",
  "SKY DOLLAR": "USDS",
  "DAI STABLECOIN": "DAI",
};
const SUBSCRIPTION_PLANS = [
  {
    code: "free",
    name: "Free",
    monthlyPrice: 0,
    badge: "Start",
    description: "Manual stablecoin budgeting for one wallet.",
    features: ["1 wallet", "Up to 3 Virtual Budget Accounts", "Manual allocations", "Basic dashboard", "Manual spend tracking"],
    entitlements: { wallets: 1, buckets: 3, ai: false, analytics: false, reports: false, transfers: false, reserveAccounts: false, legalCore: false, users: 1, business: false },
  },
  {
    code: "premium",
    name: "AllocaFi Core",
    monthlyPrice: 7.99,
    badge: "Core",
    description: "Verified Core access with full templates, wallet-approved transfers, reserve accounts, and Legal Core tracking.",
    features: ["Multiple wallets", "Unlimited budget accounts", "Auto allocation", "Spending analytics", "Stablecoin transfers", "Reserve Asset Accounts", "Legal Core tracking", "Reports and exports"],
    entitlements: { wallets: Infinity, buckets: Infinity, ai: false, analytics: true, reports: true, transfers: true, reserveAccounts: true, legalCore: true, users: 1, business: false },
  },
  {
    code: "family",
    name: "Family",
    monthlyPrice: 19.99,
    badge: "Household",
    description: "Shared stablecoin budgeting with permissions for up to five users.",
    features: ["Up to 5 users", "Shared family budgeting", "Shared budget accounts", "Family treasury dashboard", "Goal tracking", "Shared reports", "Parent/guardian permissions"],
    entitlements: { wallets: Infinity, buckets: Infinity, ai: true, analytics: true, reports: true, transfers: true, reserveAccounts: true, legalCore: true, users: 5, family: true, business: false },
  },
  {
    code: "business",
    name: "Business",
    monthlyPrice: 39.99,
    badge: "Treasury",
    description: "Business treasury tools for vendor, payroll, tax, and team-wallet workflows.",
    features: ["Business treasury dashboard", "Vendor categories", "Tax/export tools", "Team wallets", "Treasury analytics", "Payroll budget account systems", "Multi-wallet allocation system"],
    entitlements: { wallets: Infinity, buckets: Infinity, ai: true, analytics: true, reports: true, transfers: true, reserveAccounts: true, legalCore: true, users: Infinity, family: false, business: true },
  },
];
const ADMIN_ENTITLEMENTS = {
  wallets: Infinity,
  buckets: Infinity,
  ai: true,
  analytics: true,
  reports: true,
  transfers: true,
  users: Infinity,
  family: true,
  business: true,
  reserveAccounts: true,
  legalCore: true,
  admin: true,
};
const SUBSCRIPTION_STABLECOINS = ["USDC", "USDT", "PYUSD"];
const SUBSCRIPTION_CHAINS = ["Solana", "Ethereum", "Base", "Polygon"];
const SUBSCRIPTION_WALLETS = ["Trust Wallet", "Phantom", "MetaMask", "Coinbase Wallet", "WalletConnect"];
const INITIAL_SUBSCRIPTION_PLAN_CODES = new Set(["free", "premium"]);
const SUBSCRIPTION_PAYMENT_METHODS = [
  { id: "card", label: "Pay with Card", detail: "Stripe, Apple Pay, Google Pay, debit, and credit cards" },
  { id: "stablecoin", label: "Pay with Stablecoin", detail: "USDC, USDT, or PYUSD from a connected wallet" },
];
const ONBOARDING_SUPPORTED_COPY = ["Trust Wallet", "Phantom", "WalletConnect", "USDC", "PYUSD", "USDT", "Ethereum", "Solana", "Base", "Polygon"];
const ACCOUNT_HELPER_KB = [
  {
    id: "wallet-address",
    keywords: ["wallet", "address", "connect", "upload", "trust", "phantom"],
    title: "Add a Wallet Address",
    answer: "Start with a public wallet address only. Use Phantom for Solana USDC/PYUSD, Trust Wallet or WalletConnect for mobile wallets, and an EVM address for Ethereum/Base/Polygon stablecoins. AllocaFi never asks for seed phrases or private keys.",
  },
  {
    id: "plans",
    keywords: ["plan", "free", "premium", "subscription", "send"],
    title: "Plan Access",
    answer: "Free is for one wallet, up to three Virtual Budget Accounts, manual allocations, and basic tracking. Premium unlocks multiple wallets, unlimited budget accounts, AI insights, advanced rules, reports, and sends from Virtual Budget Accounts.",
  },
  {
    id: "buckets",
    keywords: ["bucket", "vba", "virtual", "account", "edit", "customize"],
    title: "Virtual Budget Accounts",
    answer: "Use Auto Allocate to choose a template, or Customize Budget Accounts to keep only the budget accounts you want and set percentages. Rules-based allocation follows saved percentages and refill targets. AI-assisted allocation gives priority to bills, essentials, emergency savings, and underfunded targets.",
  },
  {
    id: "demo",
    keywords: ["demo", "fake", "fund", "100k", "test"],
    title: "Demo Funds",
    answer: "The onboarding test starts in demo mode with no funds. Add the owner demo wallet address first, then use Add Demo Funds to inject $100,000 into that single owner wallet for realistic testing.",
  },
  {
    id: "navigation",
    keywords: ["where", "navigate", "settings", "dashboard", "help", "how"],
    title: "Navigation",
    answer: "Overview shows the dashboard. Wallets is where you add addresses and receive funds. Accounts shows Virtual Budget Accounts. Activity tracks sends and spending. Settings contains onboarding tests, the helper, demo mode, billing, backups, and refresh tools.",
  },
];

const NETWORKS = {
  bitcoin: {
    label: "Bitcoin",
    asset: "BTC",
    kind: "bitcoin",
    priceId: "bitcoin",
    explorer: "https://mempool.space/address/",
    apis: [
      "https://blockstream.info/api/address/",
      "https://mempool.space/api/address/",
    ],
  },
  ethereumEth: {
    label: "Ethereum",
    asset: "ETH",
    kind: "evm-native",
    decimals: 18,
    priceId: "ethereum",
    rpcs: [
      "https://ethereum-rpc.publicnode.com",
      "https://eth.llamarpc.com",
      "https://cloudflare-eth.com",
    ],
    explorer: "https://etherscan.io/address/",
  },
  baseEth: {
    label: "Base",
    asset: "ETH",
    kind: "evm-native",
    decimals: 18,
    priceId: "ethereum",
    rpcs: [
      "https://mainnet.base.org",
      "https://base-rpc.publicnode.com",
      "https://base.llamarpc.com",
    ],
    explorer: "https://basescan.org/address/",
  },
  arbitrumEth: {
    label: "Arbitrum",
    asset: "ETH",
    kind: "evm-native",
    decimals: 18,
    priceId: "ethereum",
    rpcs: [
      "https://arb1.arbitrum.io/rpc",
      "https://arbitrum-one-rpc.publicnode.com",
      "https://arbitrum.llamarpc.com",
    ],
    explorer: "https://arbiscan.io/address/",
  },
  optimismEth: {
    label: "Optimism",
    asset: "ETH",
    kind: "evm-native",
    decimals: 18,
    priceId: "ethereum",
    rpcs: [
      "https://mainnet.optimism.io",
      "https://optimism-rpc.publicnode.com",
      "https://optimism.llamarpc.com",
    ],
    explorer: "https://optimistic.etherscan.io/address/",
  },
  polygonNative: {
    label: "Polygon",
    asset: "POL/MATIC",
    kind: "evm-native",
    decimals: 18,
    priceId: "matic-network",
    rpcs: [
      "https://polygon-bor-rpc.publicnode.com",
      "https://polygon.llamarpc.com",
      "https://polygon-rpc.com",
    ],
    explorer: "https://polygonscan.com/address/",
  },
  bnbNative: {
    label: "BNB Smart Chain",
    asset: "BNB",
    kind: "evm-native",
    decimals: 18,
    priceId: "binancecoin",
    rpcs: [
      "https://bsc-dataseed.binance.org",
      "https://bsc-rpc.publicnode.com",
      "https://binance.llamarpc.com",
    ],
    explorer: "https://bscscan.com/address/",
  },
  avalancheNative: {
    label: "Avalanche",
    asset: "AVAX",
    kind: "evm-native",
    decimals: 18,
    priceId: "avalanche-2",
    rpcs: [
      "https://api.avax.network/ext/bc/C/rpc",
      "https://avalanche-c-chain-rpc.publicnode.com",
      "https://avalanche.drpc.org",
    ],
    explorer: "https://snowtrace.io/address/",
  },
  base: {
    label: "Base",
    asset: "USDC",
    kind: "evm-usdc",
    decimals: 6,
    rpcs: [
      "https://mainnet.base.org",
      "https://base-rpc.publicnode.com",
      "https://base.llamarpc.com",
    ],
    usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bDa02913",
    explorer: "https://basescan.org/address/",
  },
  ethereum: {
    label: "Ethereum",
    asset: "USDC",
    kind: "evm-usdc",
    decimals: 6,
    rpcs: [
      "https://ethereum-rpc.publicnode.com",
      "https://eth.llamarpc.com",
      "https://cloudflare-eth.com",
    ],
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    explorer: "https://etherscan.io/address/",
  },
  ethereumUsdt: {
    label: "Ethereum",
    asset: "USDT",
    kind: "evm-stablecoin",
    decimals: 6,
    rpcs: [
      "https://ethereum-rpc.publicnode.com",
      "https://eth.llamarpc.com",
      "https://cloudflare-eth.com",
    ],
    token: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    explorer: "https://etherscan.io/address/",
  },
  ethereumDai: {
    label: "Ethereum",
    asset: "DAI",
    kind: "evm-stablecoin",
    decimals: 18,
    rpcs: [
      "https://ethereum-rpc.publicnode.com",
      "https://eth.llamarpc.com",
      "https://cloudflare-eth.com",
    ],
    token: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    explorer: "https://etherscan.io/address/",
  },
  ethereumPyusd: {
    label: "Ethereum",
    asset: "PYUSD",
    kind: "evm-stablecoin",
    decimals: 6,
    rpcs: [
      "https://ethereum-rpc.publicnode.com",
      "https://eth.llamarpc.com",
      "https://cloudflare-eth.com",
    ],
    token: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8",
    explorer: "https://etherscan.io/address/",
  },
  ethereumFdusd: {
    label: "Ethereum",
    asset: "FDUSD",
    kind: "evm-stablecoin",
    decimals: 18,
    rpcs: [
      "https://ethereum-rpc.publicnode.com",
      "https://eth.llamarpc.com",
      "https://cloudflare-eth.com",
    ],
    token: "0xc5f0f7b66764f6ec8c8dff7ba683102295e16409",
    explorer: "https://etherscan.io/address/",
  },
  ethereumUsds: {
    label: "Ethereum",
    asset: "USDS",
    kind: "evm-stablecoin",
    decimals: 18,
    rpcs: [
      "https://ethereum-rpc.publicnode.com",
      "https://eth.llamarpc.com",
      "https://cloudflare-eth.com",
    ],
    token: "0xdC035D45d973E3EC169d2276DDab16f1e407384F",
    explorer: "https://etherscan.io/address/",
  },
  polygon: {
    label: "Polygon",
    asset: "USDC",
    kind: "evm-usdc",
    decimals: 6,
    rpcs: [
      "https://polygon-bor-rpc.publicnode.com",
      "https://polygon.llamarpc.com",
      "https://polygon-rpc.com",
    ],
    usdc: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
    explorer: "https://polygonscan.com/address/",
  },
  polygonUsdt: {
    label: "Polygon",
    asset: "USDT",
    kind: "evm-stablecoin",
    decimals: 6,
    rpcs: [
      "https://polygon-bor-rpc.publicnode.com",
      "https://polygon.llamarpc.com",
      "https://polygon-rpc.com",
    ],
    token: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    explorer: "https://polygonscan.com/address/",
  },
  polygonDai: {
    label: "Polygon",
    asset: "DAI",
    kind: "evm-stablecoin",
    decimals: 18,
    rpcs: [
      "https://polygon-bor-rpc.publicnode.com",
      "https://polygon.llamarpc.com",
      "https://polygon-rpc.com",
    ],
    token: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    explorer: "https://polygonscan.com/address/",
  },
  polygonBridged: {
    label: "Polygon",
    asset: "USDC.e",
    kind: "evm-usdc",
    decimals: 6,
    rpcs: [
      "https://polygon-bor-rpc.publicnode.com",
      "https://polygon.llamarpc.com",
      "https://polygon-rpc.com",
    ],
    usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    explorer: "https://polygonscan.com/address/",
  },
  arbitrum: {
    label: "Arbitrum",
    asset: "USDC",
    kind: "evm-usdc",
    decimals: 6,
    rpcs: [
      "https://arb1.arbitrum.io/rpc",
      "https://arbitrum-one-rpc.publicnode.com",
      "https://arbitrum.llamarpc.com",
    ],
    usdc: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    explorer: "https://arbiscan.io/address/",
  },
  optimism: {
    label: "Optimism",
    asset: "USDC",
    kind: "evm-usdc",
    decimals: 6,
    rpcs: [
      "https://mainnet.optimism.io",
      "https://optimism-rpc.publicnode.com",
      "https://optimism.llamarpc.com",
    ],
    usdc: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
    explorer: "https://optimistic.etherscan.io/address/",
  },
  bnb: {
    label: "BNB Smart Chain",
    asset: "USDC",
    kind: "evm-usdc",
    decimals: 18,
    rpcs: [
      "https://bsc-dataseed.binance.org",
      "https://bsc-rpc.publicnode.com",
      "https://binance.llamarpc.com",
    ],
    usdc: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    explorer: "https://bscscan.com/address/",
  },
  bnbUsdt: {
    label: "BNB Smart Chain",
    asset: "USDT",
    kind: "evm-stablecoin",
    decimals: 18,
    rpcs: [
      "https://bsc-dataseed.binance.org",
      "https://bsc-rpc.publicnode.com",
      "https://binance.llamarpc.com",
    ],
    token: "0x55d398326f99059fF775485246999027B3197955",
    explorer: "https://bscscan.com/address/",
  },
  bnbDai: {
    label: "BNB Smart Chain",
    asset: "DAI",
    kind: "evm-stablecoin",
    decimals: 18,
    rpcs: [
      "https://bsc-dataseed.binance.org",
      "https://bsc-rpc.publicnode.com",
      "https://binance.llamarpc.com",
    ],
    token: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
    explorer: "https://bscscan.com/address/",
  },
  avalanche: {
    label: "Avalanche",
    asset: "USDC",
    kind: "evm-usdc",
    decimals: 6,
    rpcs: [
      "https://api.avax.network/ext/bc/C/rpc",
      "https://avalanche-c-chain-rpc.publicnode.com",
      "https://avalanche.drpc.org",
    ],
    usdc: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    explorer: "https://snowtrace.io/address/",
  },
  solanaNative: {
    label: "Solana",
    asset: "SOL",
    kind: "solana-native",
    decimals: 9,
    priceId: "solana",
    rpcs: [
      "https://api.mainnet-beta.solana.com",
      "https://solana-rpc.publicnode.com",
    ],
    explorer: "https://solscan.io/account/",
  },
  solanaUsdc: {
    label: "Solana",
    asset: "USDC",
    kind: "solana-token",
    decimals: 6,
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    tokenProgram: "token",
    rpcs: [
      "https://api.mainnet-beta.solana.com",
      "https://solana-rpc.publicnode.com",
    ],
    explorer: "https://solscan.io/account/",
  },
  solanaPyusd: {
    label: "Solana",
    asset: "PYUSD",
    kind: "solana-token",
    decimals: 6,
    mint: "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
    tokenProgram: "token2022",
    rpcs: [
      "https://api.mainnet-beta.solana.com",
      "https://solana-rpc.publicnode.com",
    ],
    explorer: "https://solscan.io/account/",
  },
  litecoinReserve: {
    label: "Litecoin",
    asset: "LTC",
    kind: "view-only-reserve",
    decimals: 8,
    priceId: "litecoin",
    explorer: "https://blockchair.com/litecoin/address/",
  },
  cardanoReserve: {
    label: "Cardano",
    asset: "ADA",
    kind: "view-only-reserve",
    decimals: 6,
    priceId: "cardano",
    explorer: "https://cardanoscan.io/address/",
  },
  xrpReserve: {
    label: "XRP Ledger",
    asset: "XRP",
    kind: "view-only-reserve",
    decimals: 6,
    priceId: "ripple",
    explorer: "https://xrpscan.com/account/",
  },
  hederaReserve: {
    label: "Hedera",
    asset: "HBAR",
    kind: "view-only-reserve",
    decimals: 8,
    priceId: "hedera-hashgraph",
    explorer: "https://hashscan.io/mainnet/account/",
  },
};

const SUPPORTED_NETWORK_KEYS = [
  "solanaPyusd",
  "solanaUsdc",
  "ethereum",
  "ethereumUsdt",
  "ethereumUsds",
  "ethereumFdusd",
  "bitcoin",
  "solanaNative",
  "ethereumEth",
  "polygonNative",
  "bnbNative",
  "avalancheNative",
  "litecoinReserve",
  "cardanoReserve",
  "xrpReserve",
  "hederaReserve",
];
const SUPPORTED_NETWORK_SET = new Set(SUPPORTED_NETWORK_KEYS);

function isSupportedNetworkKey(networkKey) {
  return SUPPORTED_NETWORK_SET.has(networkKey);
}

function getSupportedNetworkEntries() {
  return SUPPORTED_NETWORK_KEYS
    .map((key) => [key, NETWORKS[key]])
    .filter(([, network]) => Boolean(network));
}

function getSupportedWallets() {
  return wallets.filter((wallet) => NETWORKS[wallet.network] && isSupportedNetworkKey(wallet.network));
}

function isStablecoinBudgetNetwork(network) {
  if (!network) return false;
  return ["evm-usdc", "evm-stablecoin", "solana-token"].includes(network.kind)
    && SUPPORTED_STABLECOIN_ASSETS.includes(normalizeStablecoinSymbol(network.asset));
}

function isStablecoinBudgetWallet(wallet) {
  return isStablecoinBudgetNetwork(NETWORKS[wallet?.network]);
}

function isReserveAssetNetwork(networkOrKey) {
  const network = typeof networkOrKey === "string" ? NETWORKS[networkOrKey] : networkOrKey;
  if (!network) return false;
  return SUPPORTED_RESERVE_ASSETS.includes(getNetworkAssetSymbol(network));
}

function isReserveAssetWallet(wallet) {
  return isReserveAssetNetwork(NETWORKS[wallet?.network]);
}

function getReserveAccountIdForWallet(wallet) {
  const asset = getWalletReserveAssetSymbol(wallet);
  return asset ? `reserve-wallet-${asset.toLowerCase()}` : "";
}

function getBudgetWallets() {
  return getSupportedWallets().filter((wallet) => isStablecoinBudgetWallet(wallet));
}

function getReserveAssetWallets() {
  return getSupportedWallets().filter((wallet) => isReserveAssetWallet(wallet));
}

function openReserveAccountForWallet(walletId) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet) return;
  const accountId = getReserveAccountIdForWallet(wallet);
  const account = accountId ? getVirtualAssetAccountById(accountId) : null;
  if (account) {
    openVirtualAssetAccountFromDashboard(account.id);
    return;
  }
  switchTab("accounts");
  showToast("Reserve Asset Account is ready in Accounts");
}

function ensureUnifiedFinanceShell() {
  const nav = document.querySelector(".tab-nav");
  const overviewPanel = document.querySelector('[data-panel="overview"]');
  if (!nav || !overviewPanel || document.querySelector('[data-panel="unified"]')) return;

  const tabs = [
    ["unified", "Unified", "?"],
    ["connect", "Connect", "+"],
    ["banks", "Banks", "$"],
    ["monthly", "Monthly", "%"],
    ["ai", "AI", "*"],
    ["family", "Family", "?"],
    ["business", "Business", "?"],
    ["rewards", "Rewards", "?"],
    ["ledgercore", "LedgerCore", "L"],
    ["admin", "Admin", "#"],
  ];
  const visibleTabs = new Set([]);

  const accountsTab = nav.querySelector('[data-tab="accounts"]');
  tabs.slice(0, 3).forEach(([id, label, icon]) => {
    if (!visibleTabs.has(id)) return;
    const button = document.createElement("button");
    button.className = "tab-button";
    button.dataset.tab = id;
    button.type = "button";
    button.innerHTML = `<span class="icon">${icon}</span>${label}`;
    nav.insertBefore(button, accountsTab);
  });
  const goalsTab = nav.querySelector('[data-tab="goals"]');
  tabs.slice(3).forEach(([id, label, icon]) => {
    if (!visibleTabs.has(id)) return;
    const button = document.createElement("button");
    button.className = "tab-button";
    button.dataset.tab = id;
    button.type = "button";
    button.innerHTML = `<span class="icon">${icon}</span>${label}`;
    nav.insertBefore(button, goalsTab);
  });

  overviewPanel.insertAdjacentHTML("afterend", `
    <section class="tab-panel" data-panel="unified">
      <section class="dashboard-panel" aria-label="Unified Finance Dashboard">
        <div class="panel-heading">
          <div>
            <h2>Unified Finance</h2>
            <p>Bank balances, crypto wallets, budget accounts, transactions, and AI insights in one command center</p>
          </div>
          <span class="status-pill live">Non-custodial</span>
        </div>
        <div id="unifiedStats" class="stats-grid"></div>
        <div id="unifiedDashboard" class="overview-grid"></div>
      </section>
    </section>
    <section class="tab-panel" data-panel="connect">
      <section class="dashboard-panel" aria-label="Connect Accounts">
        <div class="panel-heading">
          <div>
            <h2>Connect Accounts</h2>
            <p>Add bank visibility for budgeting, or keep using crypto wallets only</p>
          </div>
          <button id="connectBank" class="primary-button" type="button">Connect Bank Account</button>
        </div>
        <div id="connectAccountsView" class="overview-grid"></div>
      </section>
    </section>
    <section class="tab-panel" data-panel="banks">
      <section class="dashboard-panel" aria-label="Bank Accounts">
        <div class="panel-heading">
          <div>
            <h2>Bank Accounts</h2>
            <p>Plaid-ready bank balances and transaction sync for budgeting only</p>
          </div>
          <div class="dialog-actions">
            <button id="syncBankBalances" class="secondary-button" type="button">Sync balances</button>
            <button id="syncBankTransactions" class="secondary-button" type="button">Sync transactions</button>
          </div>
        </div>
        <div id="bankAccountsView" class="wallet-list"></div>
      </section>
    </section>
    <section class="tab-panel" data-panel="monthly">
      <section class="dashboard-panel" aria-label="Monthly Budget">
        <div class="panel-heading">
          <div>
            <h2>Monthly Budget</h2>
            <p>Unified income, spending, recurring bills, budget accounts, and alerts</p>
          </div>
          <span id="monthlyBudgetStatus" class="status-pill live"></span>
        </div>
        <div id="monthlyBudgetView"></div>
      </section>
    </section>
    <section class="tab-panel" data-panel="ai">
      <section class="dashboard-panel" aria-label="AI Insights">
        <div class="panel-heading">
          <div>
            <h2>AllocaFi AI</h2>
            <p>Premium AI assistant, reports, visual skins, and protected account guidance</p>
          </div>
          <span class="status-pill">Rule-first gateway</span>
        </div>
        <div id="aiInsightsView" class="overview-grid"></div>
      </section>
    </section>
    <section class="tab-panel" data-panel="family">
      <section class="family-route-panel" aria-label="AllocaFi Family Treasury Dashboard">
        <div id="familyDashboardView"></div>
      </section>
    </section>
    <section class="tab-panel" data-panel="business">
      <section class="enterprise-route-panel" aria-label="AllocaFi Business Enterprise Dashboard">
        <div id="businessDashboardView"></div>
      </section>
    </section>
    <section class="tab-panel" data-panel="rewards">
      <section class="dashboard-panel" aria-label="Rewards">
        <div class="panel-heading">
          <div>
            <h2>Rewards</h2>
            <p>ALFI Points, Founding Member Golden Ticket, and community rewards foundation</p>
          </div>
          <span class="status-pill gold">Badge-only rewards</span>
        </div>
        <div id="rewardsDashboardView"></div>
      </section>
    </section>
    <section class="tab-panel" data-panel="admin">
      <section class="dashboard-panel" aria-label="Admin Dashboard">
        <div class="panel-heading">
          <div>
            <h2>AllocaFi Admin</h2>
            <p>Core admin controls plus Admin AI analytics, ALFI pricing, route map, and audit logs</p>
          </div>
          <span class="status-pill">Core + Admin AI</span>
        </div>
        <div id="adminDashboardView"></div>
      </section>
    </section>
    <section class="tab-panel" data-panel="pay">
      <section class="allocafi-pay-route-panel" aria-label="AllocaFi Pay Dashboard">
        <div id="allocafiPayView"></div>
      </section>
    </section>
    <section class="tab-panel" data-panel="ledgercore">
      <section class="ledgercore-route-panel" aria-label="AllocaFi LedgerCore Dashboard">
        <div id="ledgerCoreView"></div>
      </section>
    </section>
    <section class="tab-panel" data-panel="allocafi-connect">
      <section class="allocafi-connect-route-panel" aria-label="AllocaFi Connect Dashboard">
        <div id="allocafiConnectView"></div>
      </section>
    </section>
  `);
}

ensureUnifiedFinanceShell();

function moveAdvancedSectionsIntoSettings() {
  const settingsPanel = document.querySelector('[data-panel="settings"] .dashboard-panel');
  if (!settingsPanel || document.querySelector("#advancedSystemsView")) return;
  const advancedIds = ["pay", "ledgercore", "allocafi-connect", "unified", "banks", "monthly", "family", "business", "rewards", "ai", "admin"];

  advancedIds.forEach((id) => {
    document.querySelector(`[data-tab="${id}"]`)?.remove();
  });

  const labels = {
    pay: ["AllocaFi Pay", "Non-custodial payment routing, QR profiles, methods, contacts"],
    ledgercore: ["AllocaFi LedgerCore&trade;", "Receipt, tax, and transaction intelligence engine"],
    "allocafi-connect": ["AllocaFi Connect", "Secure wallet messaging and app-to-app calls"],
    unified: ["Unified Finance", "Bank + crypto command center foundation"],
    banks: ["Bank Accounts", "Plaid-ready bank connection foundation"],
    monthly: ["Monthly Budget", "Plaid-ready income, spending, and percentage view"],
    family: ["Family Treasury", "Premium family wealth OS and shared budget accounts"],
    business: ["Business / Enterprise", "Stablecoin treasury, budget accounts, team roles, analytics"],
    rewards: ["Rewards", "ALFI Points and Golden Ticket foundation"],
    ai: ["AllocaFi AI", "Future premium AI project parked in Settings"],
    admin: ["Admin Core + Admin AI", "Core owner controls, AI analytics, pricing, routes, audit logs"],
  };

  settingsPanel.insertAdjacentHTML("beforeend", `
    <section class="settings-section cloud-account-section" id="productionAccountView">
      <div class="panel-heading">
        <div>
          <h2>Account & cloud foundation</h2>
          <p>Production account login, data migration, and cloud sync readiness without changing today's local workflow.</p>
        </div>
        <span id="cloudModeStatus" class="status-pill loading">Checking</span>
      </div>
      <div id="accountCloudView" class="cloud-account-grid"></div>
    </section>
    <section class="settings-section" id="managementSystemsView">
      <div class="panel-heading">
        <div>
          <h2>Management systems</h2>
          <p>Advanced review tools moved out of Overview so the main dashboard stays clean.</p>
        </div>
      </div>
      <div id="settingsReviewSystems" class="overview-grid"></div>
    </section>
    <section class="settings-section" id="advancedSystemsView">
      <div class="panel-heading">
        <div>
          <h2>Advanced systems</h2>
          <p>Hidden from the main dashboard for now. These are owner, memory, and future premium systems.</p>
        </div>
      </div>
      <div class="settings-launch-grid">
        ${advancedIds.map((id) => `
          <button class="settings-launch-card ${id === "ai" ? "future-system-card" : ""}" data-open-advanced="${id}" type="button" ${id === "pay" ? "hidden" : ""}>
            <strong>${labels[id][0]}</strong>
            <span>${labels[id][1]}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `);

  settingsPanel.querySelectorAll("[data-open-advanced]").forEach((button) => {
    button.addEventListener("click", () => openAdvancedSystem(button.dataset.openAdvanced));
  });
}

moveAdvancedSectionsIntoSettings();

const form = document.querySelector("#walletForm");
const walletList = document.querySelector("#walletList");
const walletSidebarList = document.querySelector("#walletSidebarList");
const showWalletFormButton = document.querySelector("#showWalletForm");
const closeWalletFormButton = document.querySelector("#closeWalletForm");
const totalBalance = document.querySelector("#totalBalance");
const lastUpdated = document.querySelector("#lastUpdated");
const assignMoneyButton = document.querySelector("#assignMoney");
const addHeroWalletAddressButton = document.querySelector("#addHeroWalletAddress");
const assignMoneyAccountsButton = document.querySelector("#assignMoneyAccounts");
const refreshVbasButton = document.querySelector("#refreshVbas");
const refreshVbasAccountsButton = document.querySelector("#refreshVbasAccounts");
const addBucketAccountButton = document.querySelector("#addBucketAccount");
const moveMoneyAccountsButton = document.querySelector("#moveMoneyAccounts");
const applyTemplateAccountsButton = document.querySelector("#applyTemplateAccounts");
const walletCount = document.querySelector("#walletCount");
const dashboardMonth = document.querySelector("#dashboardMonth");
const dashboardStats = document.querySelector("#dashboardStats");
const dashboardAlerts = document.querySelector("#dashboardAlerts");
const goalList = document.querySelector("#goalList");
const transactionLog = document.querySelector("#transactionLog");
const addressBookList = document.querySelector("#addressBookList");
const bucketAccountsView = document.querySelector("#bucketAccountsView");
const fundingQueue = document.querySelector("#fundingQueue");
const transactionSearch = document.querySelector("#transactionSearch");
const transactionMonth = document.querySelector("#transactionMonth");
const networkSelect = document.querySelector("#network");
const filterNetwork = document.querySelector("#filterNetwork");
const refreshAllButton = document.querySelector("#refreshAll");
const connectWalletButton = document.querySelector("#connectWallet");
const openSubscriptionPaymentsButton = document.querySelector("#openSubscriptionPayments");
const setupWizardButton = document.querySelector("#setupWizard");
const seedExamplesButton = document.querySelector("#seedExamples");
const demoModeButton = document.querySelector("#demoMode");
const exitDemoModeButton = document.querySelector("#exitDemoMode");
const demoModeStatus = document.querySelector("#demoModeStatus");
const openOnboardingTestButton = document.querySelector("#openOnboardingTest");
const openAccountHelperButton = document.querySelector("#openAccountHelper");
const monthlyReportButton = document.querySelector("#monthlyReport");
const exportButton = document.querySelector("#exportData");
const exportCsvButton = document.querySelector("#exportCsv");
const backupButton = document.querySelector("#backupData");
const resetButton = document.querySelector("#resetData");
const importInput = document.querySelector("#importData");
const restoreBackupInput = document.querySelector("#restoreBackup");
const exportVaultButton = document.querySelector("#exportVault");
const importVaultInput = document.querySelector("#importVault");
const enableAutoVaultButton = document.querySelector("#enableAutoVault");
const restoreAutoVaultButton = document.querySelector("#restoreAutoVault");
const vaultStats = document.querySelector("#vaultStats");
const vaultBreakdown = document.querySelector("#vaultBreakdown");
const vaultSaved = document.querySelector("#vaultSaved");
const vaultActivityCount = document.querySelector("#vaultActivityCount");
const vaultActivityLog = document.querySelector("#vaultActivityLog");
const vault2SecurityView = document.querySelector("#vault2SecurityView");
const vault2AssetCount = document.querySelector("#vault2AssetCount");
const vault2AssetView = document.querySelector("#vault2AssetView");
const vault2DeviceCount = document.querySelector("#vault2DeviceCount");
const vault2DeviceView = document.querySelector("#vault2DeviceView");
const setVaultOwnerWalletButton = document.querySelector("#setVaultOwnerWallet");
const verifyVaultOwnerWalletButton = document.querySelector("#verifyVaultOwnerWallet");
const createVault2SnapshotButton = document.querySelector("#createVault2Snapshot");
const unifiedStats = document.querySelector("#unifiedStats");
const unifiedDashboard = document.querySelector("#unifiedDashboard");
const connectAccountsView = document.querySelector("#connectAccountsView");
const connectBankButton = document.querySelector("#connectBank");
const bankAccountsView = document.querySelector("#bankAccountsView");
const syncBankBalancesButton = document.querySelector("#syncBankBalances");
const syncBankTransactionsButton = document.querySelector("#syncBankTransactions");
const monthlyBudgetStatus = document.querySelector("#monthlyBudgetStatus");
const monthlyBudgetView = document.querySelector("#monthlyBudgetView");
const aiInsightsView = document.querySelector("#aiInsightsView");
const createFamilyButton = document.querySelector("#createFamily");
const familyDashboardView = document.querySelector("#familyDashboardView");
const createBusinessButton = document.querySelector("#createBusiness");
const businessDashboardView = document.querySelector("#businessDashboardView");
const rewardsDashboardView = document.querySelector("#rewardsDashboardView");
const adminDashboardView = document.querySelector("#adminDashboardView");
const allocafiPayView = document.querySelector("#allocafiPayView");
const ledgerCoreView = document.querySelector("#ledgerCoreView");
const allocafiConnectView = document.querySelector("#allocafiConnectView");
const addGoalButton = document.querySelector("#addGoal");
const addAddressBookButton = document.querySelector("#addAddressBook");
const suggestCategoriesButton = document.querySelector("#suggestCategories");
const walletConnectionStatus = document.querySelector("#walletConnectionStatus");
const accountCloudView = document.querySelector("#accountCloudView");
const cloudModeStatus = document.querySelector("#cloudModeStatus");
const settingsReviewSystemsView = document.querySelector("#settingsReviewSystems");
const subscriptionPaymentsView = document.querySelector("#subscriptionPaymentsView");
const walletConnectProjectInput = document.querySelector("#walletConnectProjectId");
const saveWalletConnectProjectButton = document.querySelector("#saveWalletConnectProject");
const solanaRpcUrlInput = document.querySelector("#solanaRpcUrl");
const saveSolanaRpcUrlButton = document.querySelector("#saveSolanaRpcUrl");
const toast = document.querySelector("#toast");
const template = document.querySelector("#walletCardTemplate");
const walletDialog = document.querySelector("#walletDialog");
const dialogContent = document.querySelector("#dialogContent");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const DEMO_OWNER_STARTER_BUDGET_ACCOUNTS = [
  { name: "Food", percent: 18 },
  { name: "Gas", percent: 10 },
  {
    name: "Bills",
    percent: 35,
    subaccounts: [
      "Rent/Mortgage",
      "Electric",
      "Water",
      "Internet",
      "Phone",
      "Insurance",
      "Car Payment",
      "Subscriptions",
    ],
  },
  { name: "Savings", percent: 25 },
  { name: "Free", percent: 12 },
];

let wallets = loadWallets();
let priceCache = {};
const legalCoreHistoricalPriceFetches = new Set();
let goals = loadGoals();
let addressBook = loadAddressBook();
let financeData = loadFinanceData();
let enterpriseDashboardRange = "This Month";
let enterpriseDashboardRole = ENTERPRISE_MOCK_DATA.businessProfile.activeRole;
let enterpriseDashboardQuery = "";
let familyTreasuryMemberId = FAMILY_TREASURY_MOCK_DATA.familyProfile.activeMemberId;
let familyTreasuryQuery = "";
let accountSession = loadAccountSession();
let accountProfile = loadAccountProfile();
let cloudProviderStatus = loadCloudProviderStatus();
let serverSolanaRpcConfigured = Boolean(cloudProviderStatus?.services?.solanaRpc);
let serverSolanaRpcHost = "";
let aiInsightsState = loadAiInsightsState();
let aiCategorySuggestions = loadAiCategorySuggestions();
let allocafiAiChat = loadAllocafiAiChat();
let allocafiAiLogs = loadAllocafiAiLogs();
let allocafiAiPricingRules = loadAllocafiAiPricingRules();
let allocafiAiCreditSettings = loadAllocafiAiCreditSettings();
let allocafiAiSkins = loadAllocafiAiSkins();
let allocafiAiRuleSuggestions = loadAllocafiAiRuleSuggestions();
let subscriptionState = loadSubscriptionState();
let subscriptionBillingHistory = loadSubscriptionBillingHistory();
let allocafiPayState = loadAllocaFiPayState();
let ledgerCoreState = loadLedgerCoreState();
let allocafiConnectState = loadAllocaFiConnectState();
let virtualAssetAccountState = loadVirtualAssetAccountState();
let legalCoreAssetRecords = loadLegalCoreAssetRecords();
let taxLedgerAssetRecords = loadTaxLedgerAssetRecords();
let connectedProvider = null;
let connectedAccount = "";
let connectedWalletLabel = "";
let connectedSolanaProvider = null;
let connectedSolanaAccount = "";
let connectedSolanaWalletLabel = "";
let selectedWalletId = wallets[0]?.id || "";
let stablecoinLiquidityRange = "24H";
let suppressAutoVaultSnapshot = false;
let autoVaultTimer = null;
let autoVaultSessionPassword = "";

// Remove the old prototype behavior where an Auto Snapshot password could live in localStorage.
localStorage.removeItem(VAULT_AUTO_PASSWORD_KEY);

window.allocafiHealth = () => ({
  wallets,
  selectedWalletId,
  connectedAccount,
  connectedWalletLabel,
  connectedSolanaAccount,
  connectedSolanaWalletLabel,
  accountEmail: accountSession?.email || "",
  cloudMode: cloudProviderStatus?.mode || "checking",
  demoModeActive: isDemoModeActive(),
  solanaRpcConfigured: hasConfiguredSolanaRpc(),
});

function fetchWithTimeout(url, options = {}, timeoutMs = 9000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => window.clearTimeout(timeout));
}

function loadSolanaRpcUrl() {
  const value = localStorage.getItem(SOLANA_RPC_URL_KEY) || "";
  if (value.includes("*") || value.includes("...")) return "";
  return value;
}

function hasConfiguredSolanaRpc() {
  return Boolean(loadSolanaRpcUrl() || serverSolanaRpcConfigured);
}

function isAllowedSolanaRpcUrl(value) {
  try {
    const endpoint = new URL(value);
    const allowedHosts = new Set([
      "api.mainnet-beta.solana.com",
      "solana-rpc.publicnode.com",
      "mainnet.helius-rpc.com",
      "rpc.helius.xyz",
      "solana-mainnet.g.alchemy.com",
    ]);
    return endpoint.protocol === "https:" && allowedHosts.has(endpoint.hostname);
  } catch {
    return false;
  }
}

function getSolanaRpcEndpoints(network) {
  const custom = loadSolanaRpcUrl();
  const serverEndpoint = !custom && serverSolanaRpcConfigured ? SERVER_SOLANA_RPC_ENDPOINT : "";
  return [...new Set([custom, serverEndpoint, ...(network.rpcs || [])].filter(Boolean))];
}

function canUseLocalSolanaProxy() {
  // The same-origin backend proxy works locally and on Render, and it can use
  // server-side RPC environment variables without exposing keys in the browser.
  return true;
}

async function fetchLocalSolanaPyusdBalance(wallet) {
  if (!canUseLocalSolanaProxy()) return null;
  const endpoint = loadSolanaRpcUrl();
  const params = new URLSearchParams({ address: wallet.address });
  if (endpoint) params.set("endpoint", endpoint);
  const response = await fetchWithTimeout(`/api/solana-pyusd-balance?${params.toString()}`, {}, 30000);
  if (!response.ok) throw new Error(`Local Solana balance lookup failed (${response.status})`);
  const result = await response.json();
  if (result.error) throw new Error(result.error.message || "Local Solana balance lookup failed");
  return Number(result.balance || 0);
}

async function postSolanaRpc(rpc, payload) {
  const useServerEndpoint = rpc === SERVER_SOLANA_RPC_ENDPOINT;
  const targets = canUseLocalSolanaProxy()
    ? [
        useServerEndpoint ? "/api/solana-rpc" : "/api/solana-rpc?endpoint=" + encodeURIComponent(rpc),
        ...(useServerEndpoint ? [] : [rpc]),
      ]
    : [rpc];
  let lastError = null;

  for (const target of targets) {
    try {
      const response = await fetchWithTimeout(target, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }, 20000);
      if (!response.ok) throw new Error(`Solana request failed (${response.status})`);
      const result = await response.json();
      if (result.error) throw new Error(result.error.message || "Solana returned an error");
      return result;
    } catch (error) {
      const message = error?.message || "";
      lastError = error?.name === "AbortError" || message.includes("aborted")
        ? new Error("Solana RPC timed out. Try again or save a faster Helius RPC URL in Settings.")
        : error;
    }
  }

  throw lastError || new Error("Solana request failed");
}

const EVM_CHAINS = {
  ethereumEth: "0x1",
  ethereum: "0x1",
  ethereumUsdt: "0x1",
  ethereumDai: "0x1",
  ethereumPyusd: "0x1",
  ethereumFdusd: "0x1",
  ethereumUsds: "0x1",
  baseEth: "0x2105",
  base: "0x2105",
  arbitrumEth: "0xa4b1",
  arbitrum: "0xa4b1",
  optimismEth: "0xa",
  optimism: "0xa",
  polygonNative: "0x89",
  polygon: "0x89",
  polygonUsdt: "0x89",
  polygonDai: "0x89",
  polygonBridged: "0x89",
  bnbNative: "0x38",
  bnb: "0x38",
  bnbUsdt: "0x38",
  bnbDai: "0x38",
  avalancheNative: "0xa86a",
  avalanche: "0xa86a",
};

const DEFAULT_BUCKETS = [
  { name: "Food", percent: 18 },
  { name: "Gas", percent: 10 },
  { name: "Bills", percent: 35 },
  { name: "Savings", percent: 25 },
  { name: "Free", percent: 12 },
];

const DEFAULT_BILL_SUBACCOUNTS = [
  "Rent/Mortgage",
  "Electric",
  "Water",
  "Internet",
  "Phone",
  "Insurance",
  "Car Payment",
  "Subscriptions",
];

const FUNDED_TARGET_WEIGHT_MULTIPLIER = 0.05;
const BILL_DUE_SOON_DAYS = 7;
const BILL_MONTH_OPTIONS = [
  { value: "monthly", label: "Every month" },
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
];

const BUDGET_TEMPLATE_CREATED_AT = "2026-05-31T00:00:00.000Z";
const BUDGET_TEMPLATE_CATEGORIES = [
  "Professional",
  "Family",
  "Business",
  "Crypto",
  "Lifestyle",
  "Fun",
  "AI Premium",
  "Custom",
];
const FEATURED_BUDGET_TEMPLATE_IDS = ["essentials", "growth", "lifestyle", "planning"];

function makeBudgetTemplateAccount(name, percent, icon, color, description, options = {}) {
  return { name, percent, icon, color, description, ...options };
}

function makeBudgetTemplate(id, name, category, description, buckets, options = {}) {
  return {
    id,
    name,
    category,
    description,
    isPremium: Boolean(options.isPremium),
    isAiTemplate: Boolean(options.isAiTemplate),
    accountCount: buckets.length,
    buckets,
    createdAt: BUDGET_TEMPLATE_CREATED_AT,
    updatedAt: BUDGET_TEMPLATE_CREATED_AT,
  };
}

const BUCKET_TEMPLATES = {
  essentials: makeBudgetTemplate("essentials", "Essential Budget", "Professional", "Core everyday budgeting with stronger everyday categories and a clear safety buffer.", [
    makeBudgetTemplateAccount("Housing & Bills", 32, "home", "#6b5cff", "Rent, mortgage, utilities, phone, internet, and required household obligations.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Groceries & Household", 14, "cart", "#ff7a32", "Food, home supplies, and everyday household needs."),
    makeBudgetTemplateAccount("Transportation", 9, "car", "#22c7ff", "Fuel, rides, transit, parking, and basic mobility."),
    makeBudgetTemplateAccount("Emergency Buffer", 14, "shield", "#44e68a", "Protected cash for urgent surprises."),
    makeBudgetTemplateAccount("Short-Term Savings", 12, "vault", "#20f0d0", "Near-term goals and planned reserves."),
    makeBudgetTemplateAccount("Insurance & Health", 8, "pulse", "#37d4ff", "Coverage, medical, pharmacy, and wellness basics."),
    makeBudgetTemplateAccount("Personal Care", 6, "user", "#ff6b99", "Hair, clothing basics, hygiene, and self-care."),
    makeBudgetTemplateAccount("Flex", 5, "spark", "#ff3faf", "Small flexible spending without breaking the plan."),
  ]),
  growth: makeBudgetTemplate("growth", "Financial Growth", "Professional", "Savings and investing plan for building momentum without ignoring essentials.", [
    makeBudgetTemplateAccount("Core Bills", 26, "home", "#6b5cff", "Recurring household obligations.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Essentials", 14, "cart", "#ff7a32", "Food, transportation basics, and required day-to-day spending."),
    makeBudgetTemplateAccount("Emergency Reserve", 12, "shield", "#44e68a", "Protected cash buffer before aggressive growth."),
    makeBudgetTemplateAccount("Investment Contribution", 24, "chart", "#b05cff", "Primary growth allocation for long-term investing."),
    makeBudgetTemplateAccount("Goal Savings", 12, "target", "#20f0d0", "House, car, travel, equipment, or planned milestone savings."),
    makeBudgetTemplateAccount("Skill & Income Growth", 6, "book", "#37d4ff", "Courses, credentials, tools, and income-building moves."),
    makeBudgetTemplateAccount("Flex", 6, "spark", "#ff3faf", "Controlled lifestyle flexibility."),
  ]),
  wealthBuilder: makeBudgetTemplate("wealthBuilder", "Wealth Builder Pro", "Professional", "Premium plan for wealth building, opportunity capital, and risk control.", [
    makeBudgetTemplateAccount("Lifestyle Floor", 22, "home", "#6b5cff", "Minimum lifestyle cost required to stay stable.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Long-Term Investments", 24, "chart", "#b05cff", "Primary long-term wealth-building account."),
    makeBudgetTemplateAccount("Opportunity Capital", 18, "spark", "#ff3faf", "Capital ready for deals, dips, launches, and strategic moves."),
    makeBudgetTemplateAccount("Emergency Fortress", 12, "shield", "#44e68a", "High-protection emergency reserve."),
    makeBudgetTemplateAccount("Tax Strategy Reserve", 8, "receipt", "#37d4ff", "Taxes, filings, and strategic tax planning."),
    makeBudgetTemplateAccount("Asset Buying Reserve", 6, "diamond", "#f6c85f", "Cash reserved for future income-producing or appreciating assets."),
    makeBudgetTemplateAccount("Debt/Leverage Control", 6, "vault", "#20f0d0", "Debt reduction, leverage safety, and balance sheet control."),
    makeBudgetTemplateAccount("Legacy/Giving", 4, "heart", "#ff6b99", "Giving, family legacy, and long-term impact."),
  ], { isPremium: true }),
  debtElimination: makeBudgetTemplate("debtElimination", "Debt Elimination", "Professional", "Focused payoff structure with protected basics and visible payoff pressure.", [
    makeBudgetTemplateAccount("Core Bills", 35, "home", "#6b5cff", "Required monthly obligations.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Essentials", 15, "cart", "#ff7a32", "Food, transportation, and must-have basics."),
    makeBudgetTemplateAccount("Minimum Debt Payments", 15, "receipt", "#37d4ff", "Required payments that keep accounts current."),
    makeBudgetTemplateAccount("Debt Snowball", 18, "target", "#ff3faf", "Extra principal for focused payoff acceleration."),
    makeBudgetTemplateAccount("Starter Emergency Fund", 8, "shield", "#44e68a", "Small emergency protection while eliminating debt."),
    makeBudgetTemplateAccount("Transportation", 6, "car", "#22c7ff", "Fuel, transit, and basic mobility."),
    makeBudgetTemplateAccount("Flex", 3, "spark", "#20f0d0", "Tiny controlled flex category."),
  ]),
  familyEssentials: makeBudgetTemplate("familyEssentials", "Family Essentials", "Family", "Household-first budget for dependents, shared needs, and family stability.", [
    makeBudgetTemplateAccount("Housing Hub", 28, "home", "#6b5cff", "Rent, mortgage, utilities, and family home costs."),
    makeBudgetTemplateAccount("Family Groceries", 18, "cart", "#ff7a32", "Groceries, household supplies, and family meals."),
    makeBudgetTemplateAccount("Childcare & School", 14, "family", "#ff6b99", "Childcare, school fees, uniforms, supplies, and activities."),
    makeBudgetTemplateAccount("Transportation", 10, "car", "#22c7ff", "Family vehicle, gas, transit, and rides."),
    makeBudgetTemplateAccount("Insurance & Medical", 10, "shield", "#44e68a", "Coverage, health, prescriptions, and protection."),
    makeBudgetTemplateAccount("Family Emergency", 12, "vault", "#20f0d0", "Emergency reserve for the household."),
    makeBudgetTemplateAccount("Family Joy", 8, "spark", "#b05cff", "Activities, birthdays, memories, and fun."),
  ]),
  singleParent: makeBudgetTemplate("singleParent", "Single Parent Plan", "Family", "Practical family plan with child priorities and extra protection.", [
    makeBudgetTemplateAccount("Home Base", 32, "home", "#6b5cff", "Housing, utilities, and essential home services."),
    makeBudgetTemplateAccount("Food & Household", 17, "cart", "#ff7a32", "Food, household basics, and family supplies."),
    makeBudgetTemplateAccount("Child Priority Fund", 16, "family", "#ff6b99", "Childcare, school, clothing, medicine, and activities."),
    makeBudgetTemplateAccount("Transportation", 9, "car", "#22c7ff", "Vehicle, gas, transit, and appointments."),
    makeBudgetTemplateAccount("Emergency Shield", 13, "shield", "#44e68a", "Protection for single-income surprises."),
    makeBudgetTemplateAccount("Parent Personal Care", 6, "user", "#20f0d0", "Parent wellness, personal needs, and recovery."),
    makeBudgetTemplateAccount("School & Activities", 7, "book", "#37d4ff", "Learning, sports, trips, and child development."),
  ]),
  familyLegacy: makeBudgetTemplate("familyLegacy", "Family Legacy", "Family", "Premium family plan for education, investing, experiences, and values.", [
    makeBudgetTemplateAccount("Home Stability", 24, "home", "#6b5cff", "Stable home and household obligations."),
    makeBudgetTemplateAccount("Education Fund", 18, "book", "#37d4ff", "Tuition, tutoring, books, technology, and skill building."),
    makeBudgetTemplateAccount("Family Investments", 20, "chart", "#b05cff", "Long-term wealth building for the family."),
    makeBudgetTemplateAccount("Groceries", 12, "cart", "#ff7a32", "Food and household staples."),
    makeBudgetTemplateAccount("Emergency Legacy Reserve", 12, "shield", "#44e68a", "Family protection reserve."),
    makeBudgetTemplateAccount("Experiences", 8, "spark", "#20f0d0", "Trips, memories, and quality time."),
    makeBudgetTemplateAccount("Giving & Values", 6, "heart", "#ff6b99", "Giving, church, community, and family values."),
  ], { isPremium: true }),
  ownerOperator: makeBudgetTemplate("ownerOperator", "Owner Operator", "Business", "Designed for trucking and vehicle-based operators.", [
    makeBudgetTemplateAccount("Fuel First", 28, "gas", "#ff7a32", "Diesel, fuel cards, route costs, and fuel reserve."),
    makeBudgetTemplateAccount("Truck Payment", 16, "truck", "#6b5cff", "Truck note, lease, trailer payment, or equipment financing."),
    makeBudgetTemplateAccount("Maintenance Reserve", 16, "tools", "#37d4ff", "Repairs, tires, oil, inspections, and service reserve."),
    makeBudgetTemplateAccount("Insurance & Permits", 10, "shield", "#44e68a", "Commercial insurance, permits, authority, and compliance."),
    makeBudgetTemplateAccount("Tax Reserve", 14, "receipt", "#b05cff", "Estimated taxes and tax planning."),
    makeBudgetTemplateAccount("Driver Pay", 12, "user", "#20f0d0", "Owner draw and operator income."),
    makeBudgetTemplateAccount("Breakdown Buffer", 4, "vault", "#ff3faf", "Downtime, towing, hotel, and emergency road costs."),
  ]),
  smallBusiness: makeBudgetTemplate("smallBusiness", "Small Business", "Business", "Operating budget for owners who need payroll, growth, and profit visibility.", [
    makeBudgetTemplateAccount("Operating Expenses", 24, "briefcase", "#6b5cff", "Rent, utilities, supplies, fees, and overhead."),
    makeBudgetTemplateAccount("Payroll", 20, "users", "#20f0d0", "Employees, contractors, and owner payroll planning."),
    makeBudgetTemplateAccount("Inventory/Supplies", 14, "store", "#ff7a32", "Products, materials, shipping supplies, and stock."),
    makeBudgetTemplateAccount("Tax Reserve", 14, "receipt", "#b05cff", "Tax reserve and quarterly filings."),
    makeBudgetTemplateAccount("Marketing Growth", 10, "megaphone", "#ff3faf", "Ads, campaigns, referrals, and brand growth."),
    makeBudgetTemplateAccount("Profit Hold", 10, "chart", "#f6c85f", "Owner profit and retained earnings."),
    makeBudgetTemplateAccount("Emergency Runway", 8, "shield", "#44e68a", "Business protection and slow-month runway."),
  ]),
  freelancer: makeBudgetTemplate("freelancer", "Freelancer", "Business", "Income smoothing and tax reserve plan for solo workers.", [
    makeBudgetTemplateAccount("Income Smoothing", 24, "vault", "#44e68a", "Reserve that stabilizes uneven client income."),
    makeBudgetTemplateAccount("Tax Reserve", 22, "receipt", "#b05cff", "Self-employment taxes and filings."),
    makeBudgetTemplateAccount("Client Tools", 12, "monitor", "#37d4ff", "Software, hardware, subscriptions, and production tools."),
    makeBudgetTemplateAccount("Marketing", 10, "megaphone", "#ff3faf", "Client acquisition, portfolio, ads, and outreach."),
    makeBudgetTemplateAccount("Bills Transfer", 16, "home", "#6b5cff", "Transfer to personal bills and living expenses.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Skill Upgrades", 6, "book", "#ff7a32", "Courses, coaching, and skills."),
    makeBudgetTemplateAccount("Personal Pay", 10, "user", "#20f0d0", "Owner draw and personal income."),
  ]),
  stablecoinIncome: makeBudgetTemplate("stablecoinIncome", "Stablecoin Income", "Crypto", "Stablecoin-first budget for crypto income routing.", [
    makeBudgetTemplateAccount("Bills from Stablecoins", 32, "home", "#6b5cff", "Required bills paid from stablecoin income.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Living Essentials", 14, "cart", "#ff7a32", "Food, gas, and everyday essentials."),
    makeBudgetTemplateAccount("Stablecoin Reserve", 18, "stablecoin", "#20f0d0", "USDC and stable liquidity reserve."),
    makeBudgetTemplateAccount("Emergency Liquidity", 14, "shield", "#44e68a", "Fast-access emergency reserve."),
    makeBudgetTemplateAccount("Investment Contribution", 12, "chart", "#b05cff", "Growth allocation from stablecoin income."),
    makeBudgetTemplateAccount("Tax Reserve", 6, "receipt", "#37d4ff", "Tax planning and reporting reserve."),
    makeBudgetTemplateAccount("Flex", 4, "spark", "#ff3faf", "Small flexible spending."),
  ]),
  cryptoInvestor: makeBudgetTemplate("cryptoInvestor", "Crypto Investor", "Crypto", "Reserve asset allocation with everyday spending protected.", [
    makeBudgetTemplateAccount("Core Bills", 24, "home", "#6b5cff", "Protected monthly bills before investing.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Emergency Liquidity", 14, "shield", "#44e68a", "Stable emergency reserve for market swings."),
    makeBudgetTemplateAccount("Dip Buying Cash", 18, "spark", "#ff3faf", "Cash set aside for future market opportunities."),
    makeBudgetTemplateAccount("Stablecoin Parking", 16, "stablecoin", "#20f0d0", "Stablecoin reserve for liquidity and timing."),
    makeBudgetTemplateAccount("Tax Reserve", 8, "receipt", "#37d4ff", "Tax and gain/loss planning."),
    makeBudgetTemplateAccount("Research/Tools", 5, "monitor", "#ff7a32", "Market tools, wallets, and education."),
    makeBudgetTemplateAccount("Long-Term Hold Plan", 15, "chart", "#b05cff", "Reserve allocation for long-term holdings."),
  ], { isPremium: true }),
  bitcoinStandard: makeBudgetTemplate("bitcoinStandard", "Bitcoin Standard", "Crypto", "Simple Bitcoin reserve plan with practical living categories.", [
    makeBudgetTemplateAccount("Monthly Bills", 28, "home", "#6b5cff", "Required monthly obligations.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Food & Essentials", 12, "cart", "#ff7a32", "Food, household, and everyday basics."),
    makeBudgetTemplateAccount("Bitcoin Buying Reserve", 30, "bitcoin", "#f7931a", "BTC reserve contribution."),
    makeBudgetTemplateAccount("Emergency Liquidity", 14, "shield", "#44e68a", "Stable emergency liquidity."),
    makeBudgetTemplateAccount("Tax Reserve", 6, "receipt", "#37d4ff", "Tax planning reserve."),
    makeBudgetTemplateAccount("Personal Flex", 10, "user", "#20f0d0", "Personal spending while keeping the BTC plan intact."),
  ]),
  lifestyle: makeBudgetTemplate("lifestyle", "Lifestyle Budget", "Lifestyle", "Balanced lifestyle budget for goals, fun, and everyday expenses.", [
    makeBudgetTemplateAccount("Dining & Social", 16, "utensils", "#ff7a32", "Restaurants, coffee, friends, and social meals."),
    makeBudgetTemplateAccount("Entertainment", 12, "spark", "#ff3faf", "Events, streaming, concerts, and fun."),
    makeBudgetTemplateAccount("Style & Grooming", 10, "shirt", "#b05cff", "Clothing, hair, grooming, and personal style."),
    makeBudgetTemplateAccount("Fitness & Wellness", 12, "pulse", "#44e68a", "Gym, wellness, supplements, and health routines."),
    makeBudgetTemplateAccount("Hobbies", 12, "game", "#6b5cff", "Creative hobbies, games, and interests."),
    makeBudgetTemplateAccount("Goals", 14, "target", "#37d4ff", "Lifestyle goals, purchases, and planned upgrades."),
    makeBudgetTemplateAccount("Emergency Reserve", 12, "shield", "#44e68a", "Safety buffer for lifestyle stability."),
    makeBudgetTemplateAccount("Flex", 12, "wallet", "#20f0d0", "Unplanned lifestyle spending with limits."),
  ]),
  travelLife: makeBudgetTemplate("travelLife", "Travel Life", "Lifestyle", "Travel-focused plan with everyday obligations still protected.", [
    makeBudgetTemplateAccount("Home Base", 24, "home", "#6b5cff", "Core home obligations while traveling.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Travel Fund", 30, "plane", "#37d4ff", "Flights, lodging, rentals, and trip costs."),
    makeBudgetTemplateAccount("Food", 10, "utensils", "#ff7a32", "Groceries, meals, and travel dining."),
    makeBudgetTemplateAccount("Transportation", 8, "car", "#22c7ff", "Gas, rides, transit, and local mobility."),
    makeBudgetTemplateAccount("Experiences", 12, "spark", "#ff3faf", "Tours, activities, memories, and entertainment."),
    makeBudgetTemplateAccount("Emergency Travel Buffer", 10, "shield", "#44e68a", "Travel disruption and emergency reserve."),
    makeBudgetTemplateAccount("Gear & Documents", 6, "briefcase", "#20f0d0", "Luggage, documents, gear, and travel prep."),
  ]),
  luxuryLifestyle: makeBudgetTemplate("luxuryLifestyle", "Luxury Lifestyle", "Lifestyle", "Premium lifestyle plan with spending caps and investing.", [
    makeBudgetTemplateAccount("Core Bills", 26, "home", "#6b5cff", "Core monthly obligations.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Premium Experiences", 18, "spark", "#ff3faf", "High-end events, dining, and experiences."),
    makeBudgetTemplateAccount("Travel & Hotels", 16, "plane", "#37d4ff", "Luxury travel, stays, and transportation."),
    makeBudgetTemplateAccount("Style/Grooming", 10, "shirt", "#b05cff", "Wardrobe, grooming, and presentation."),
    makeBudgetTemplateAccount("Investments", 12, "chart", "#f6c85f", "Growth contribution to keep lifestyle sustainable."),
    makeBudgetTemplateAccount("Emergency Reserve", 10, "shield", "#44e68a", "Safety buffer."),
    makeBudgetTemplateAccount("Concierge/Flex", 8, "wallet", "#20f0d0", "Services, upgrades, and flexible premium spending."),
  ], { isPremium: true }),
  vacationPlanner: makeBudgetTemplate("vacationPlanner", "Vacation Planner", "Lifestyle", "Short-term travel goal template.", [
    makeBudgetTemplateAccount("Core Bills", 32, "home", "#6b5cff", "Required monthly obligations.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Trip Fund", 28, "plane", "#37d4ff", "Main vacation savings account."),
    makeBudgetTemplateAccount("Food", 10, "utensils", "#ff7a32", "Groceries and meals before the trip."),
    makeBudgetTemplateAccount("Travel Gear", 8, "briefcase", "#20f0d0", "Luggage, clothing, passport, and prep."),
    makeBudgetTemplateAccount("Spending Money", 10, "wallet", "#ff3faf", "Cash for the trip."),
    makeBudgetTemplateAccount("Emergency Reserve", 8, "shield", "#44e68a", "Trip safety buffer."),
    makeBudgetTemplateAccount("Booking Fees", 4, "receipt", "#b05cff", "Deposits, taxes, fees, and small booking costs."),
  ]),
  planning: makeBudgetTemplate("planning", "Planning / Irregular Budget", "Professional", "For irregular bills, annual costs, taxes, and planned surprises.", [
    makeBudgetTemplateAccount("Annual Bills Vault", 18, "calendar", "#6b5cff", "Annual fees, renewals, registrations, and yearly bills."),
    makeBudgetTemplateAccount("Tax Reserve", 22, "receipt", "#ff3faf", "Tax reserves and filings."),
    makeBudgetTemplateAccount("Maintenance & Repairs", 16, "tools", "#37d4ff", "Home, car, appliance, and emergency repairs."),
    makeBudgetTemplateAccount("Insurance Renewals", 12, "shield", "#44e68a", "Premiums, deductibles, and policy renewals."),
    makeBudgetTemplateAccount("Tech Replacement", 10, "monitor", "#20f0d0", "Devices, upgrades, and equipment replacement."),
    makeBudgetTemplateAccount("Holidays & Gifts", 10, "gift", "#ff7a32", "Seasonal spending and gifts."),
    makeBudgetTemplateAccount("Emergency Overflow", 12, "vault", "#b05cff", "Extra reserve for irregular surprises."),
  ]),
  gamerMode: makeBudgetTemplate("gamerMode", "Gamer Mode", "Fun", "Gaming and subscriptions without losing budget discipline.", [
    makeBudgetTemplateAccount("Core Bills", 30, "home", "#6b5cff", "Required monthly obligations.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Internet & Power", 10, "wifi", "#37d4ff", "Internet, power, and gaming connectivity."),
    makeBudgetTemplateAccount("Game Passes", 10, "monitor", "#b05cff", "Subscriptions, passes, and online services."),
    makeBudgetTemplateAccount("Gaming Gear", 16, "game", "#ff3faf", "Hardware, accessories, and upgrades."),
    makeBudgetTemplateAccount("Food", 12, "utensils", "#ff7a32", "Groceries, snacks, and meals."),
    makeBudgetTemplateAccount("Emergency Reserve", 10, "shield", "#44e68a", "Safety buffer."),
    makeBudgetTemplateAccount("Tournament/Fun Fund", 7, "spark", "#20f0d0", "Events, tournaments, collectibles, and fun."),
    makeBudgetTemplateAccount("Savings", 5, "vault", "#f6c85f", "Future big purchases."),
  ]),
  creatorMode: makeBudgetTemplate("creatorMode", "Creator Mode", "Fun", "Creator budget for equipment, software, and audience growth.", [
    makeBudgetTemplateAccount("Core Bills", 26, "home", "#6b5cff", "Core monthly obligations.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Creator Equipment", 18, "camera", "#37d4ff", "Cameras, lights, audio, hardware, and studio gear."),
    makeBudgetTemplateAccount("Software Stack", 12, "monitor", "#b05cff", "Editing tools, subscriptions, plugins, and hosting."),
    makeBudgetTemplateAccount("Content Production", 12, "spark", "#ff7a32", "Props, shoots, locations, and production costs."),
    makeBudgetTemplateAccount("Marketing/Audience", 10, "megaphone", "#ff3faf", "Promotion, ads, collaborations, and growth."),
    makeBudgetTemplateAccount("Emergency Reserve", 10, "shield", "#44e68a", "Safety buffer."),
    makeBudgetTemplateAccount("Taxes", 7, "receipt", "#20f0d0", "Tax reserve for creator income."),
    makeBudgetTemplateAccount("Personal Pay", 5, "user", "#f6c85f", "Owner draw from creator income."),
  ]),
  sideHustle: makeBudgetTemplate("sideHustle", "Side Hustle", "Fun", "Simple side-business template for growth and taxes.", [
    makeBudgetTemplateAccount("Core Bills", 26, "home", "#6b5cff", "Core monthly obligations.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Business Supplies", 16, "briefcase", "#37d4ff", "Tools, products, packaging, and supplies."),
    makeBudgetTemplateAccount("Tax Reserve", 16, "receipt", "#b05cff", "Side-income tax reserve."),
    makeBudgetTemplateAccount("Marketing", 12, "megaphone", "#ff3faf", "Promotion, ads, content, and local outreach."),
    makeBudgetTemplateAccount("Reinvestment", 12, "chart", "#20f0d0", "Put money back into growth."),
    makeBudgetTemplateAccount("Emergency Reserve", 8, "shield", "#44e68a", "Safety buffer."),
    makeBudgetTemplateAccount("Profit Pull", 10, "wallet", "#ff7a32", "Profit you can safely take out."),
  ]),
  aiSmartBudget: makeBudgetTemplate("aiSmartBudget", "AI Smart Budget", "AI Premium", "AI-assisted starting split with safety caps and flexible reserve.", [
    makeBudgetTemplateAccount("Smart Bills", 30, "home", "#6b5cff", "Bills prioritized before optional spending.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Essentials", 13, "cart", "#ff7a32", "Food, gas, and recurring essentials."),
    makeBudgetTemplateAccount("Emergency Priority", 16, "shield", "#44e68a", "Safety buffer gets priority until stable."),
    makeBudgetTemplateAccount("Goal Builder", 14, "target", "#20f0d0", "Auto-optimized goal savings."),
    makeBudgetTemplateAccount("Investment Path", 14, "chart", "#b05cff", "Growth contribution based on available margin."),
    makeBudgetTemplateAccount("Risk Buffer", 7, "vault", "#37d4ff", "Extra protection for uncertain periods."),
    makeBudgetTemplateAccount("Adaptive Flex", 6, "spark", "#ff3faf", "Flexible category that can shrink or expand."),
  ], { isPremium: true, isAiTemplate: true }),
  firePlan: makeBudgetTemplate("firePlan", "FIRE Plan", "AI Premium", "High-savings premium plan for financial independence goals.", [
    makeBudgetTemplateAccount("Lean Bills", 24, "home", "#6b5cff", "Lean required obligations.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Essentials", 10, "cart", "#ff7a32", "Food, transportation, and must-have basics."),
    makeBudgetTemplateAccount("Index/Investment Engine", 38, "chart", "#b05cff", "Main financial independence investing account."),
    makeBudgetTemplateAccount("Emergency Reserve", 10, "shield", "#44e68a", "Safety buffer."),
    makeBudgetTemplateAccount("Tax Optimization", 8, "receipt", "#37d4ff", "Tax planning and account strategy."),
    makeBudgetTemplateAccount("Skill Income", 5, "book", "#20f0d0", "Skills, side income, and earning power."),
    makeBudgetTemplateAccount("Lifestyle Cap", 5, "spark", "#ff3faf", "Small capped lifestyle spending."),
  ], { isPremium: true, isAiTemplate: true }),
  millionaireBlueprint: makeBudgetTemplate("millionaireBlueprint", "Millionaire Blueprint", "AI Premium", "Premium wealth-building allocation for business, investing, and taxes.", [
    makeBudgetTemplateAccount("Lifestyle Base", 20, "home", "#6b5cff", "Controlled base lifestyle costs.", { subaccounts: DEFAULT_BILL_SUBACCOUNTS }),
    makeBudgetTemplateAccount("Investment Engine", 34, "chart", "#b05cff", "Primary wealth-building engine."),
    makeBudgetTemplateAccount("Business Capital", 16, "briefcase", "#37d4ff", "Capital for business, product, or income growth."),
    makeBudgetTemplateAccount("Tax Strategy", 10, "receipt", "#20f0d0", "Tax reserve and planning."),
    makeBudgetTemplateAccount("Opportunity Fund", 8, "spark", "#ff3faf", "Capital for deals, launches, dips, and strategic moves."),
    makeBudgetTemplateAccount("Emergency Fortress", 8, "shield", "#44e68a", "High-confidence emergency protection."),
    makeBudgetTemplateAccount("Giving/Legacy", 4, "heart", "#ff6b99", "Giving, legacy, and impact."),
  ], { isPremium: true, isAiTemplate: true }),
  customBuild: makeBudgetTemplate("customBuild", "Custom Build", "Custom", "Create exact custom account names and percentages.", [
    makeBudgetTemplateAccount("Custom Budget Accounts", 100, "sliders", "#20f0d0", "Open the custom builder to define your own plan."),
  ]),
};
const BUDGET_TEMPLATE_ART_BASE = "./assets/budget-template-art";
const BUDGET_TEMPLATE_DISPLAY_ORDER = [
  "essentials",
  "growth",
  "debtElimination",
  "wealthBuilder",
  "planning",
  "familyEssentials",
  "singleParent",
  "familyLegacy",
  "ownerOperator",
  "smallBusiness",
  "freelancer",
  "stablecoinIncome",
  "cryptoInvestor",
  "bitcoinStandard",
  "lifestyle",
  "travelLife",
  "luxuryLifestyle",
  "vacationPlanner",
  "gamerMode",
  "creatorMode",
  "sideHustle",
  "aiSmartBudget",
  "firePlan",
  "millionaireBlueprint",
  "customBuild",
];
const BUDGET_TEMPLATE_VISUALS = {
  essentials: {
    art: "essentials.png",
    icon: "wallet",
    label: "CORE",
    tags: ["Stable", "Balanced", "Secure"],
    focus: "Daily Essentials",
    bestFor: "New budgeters",
    difficulty: "Beginner",
  },
  growth: {
    art: "growth.png",
    icon: "chart",
    label: "GROWTH",
    tags: ["Growth Focus", "Long-Term", "Wealth Building"],
    focus: "Saving + investing",
    bestFor: "Momentum builders",
    difficulty: "Beginner",
  },
  wealthBuilder: {
    art: "wealth-builder.png",
    icon: "chart",
    label: "PRO",
    tags: ["Growth Engine", "Tax Ready", "Opportunity Fund"],
    focus: "Aggressive growth",
    bestFor: "Premium wealth plans",
    difficulty: "Advanced",
  },
  debtElimination: {
    art: "debt-elimination.png",
    icon: "target",
    label: "PAYOFF",
    tags: ["Payoff Focus", "Protect Basics", "Controlled Spend"],
    focus: "Debt payoff",
    bestFor: "Debt reduction",
    difficulty: "Focused",
  },
  planning: {
    art: "planning.png",
    icon: "calendar",
    label: "PLANNING",
    tags: ["Annual Costs", "Tax Planning", "Repairs Ready"],
    focus: "Irregular expenses",
    bestFor: "Annual costs",
    difficulty: "Intermediate",
  },
  familyEssentials: {
    art: "family-essentials.png",
    icon: "family",
    label: "FAMILY",
    tags: ["Household First", "Child Ready", "Protected"],
    focus: "Household stability",
    bestFor: "Families",
    difficulty: "Beginner",
  },
  singleParent: {
    art: "single-parent.png",
    icon: "family",
    label: "FAMILY",
    tags: ["Stability", "Child Focus", "Emergency Ready"],
    focus: "Single parent plan",
    bestFor: "Single parents",
    difficulty: "Beginner",
  },
  familyLegacy: {
    art: "family-legacy.png",
    icon: "crown",
    label: "LEGACY",
    tags: ["Education", "Legacy", "Experiences"],
    focus: "Generational wealth",
    bestFor: "Premium family plans",
    difficulty: "Advanced",
  },
  ownerOperator: {
    art: "owner-operator.png",
    icon: "truck",
    label: "BUSINESS",
    tags: ["Fuel First", "Protect Income", "Stay Road Ready"],
    focus: "Fuel First",
    bestFor: "Trucking ops",
    difficulty: "Beginner",
  },
  smallBusiness: {
    art: "small-business.png",
    icon: "store",
    label: "BUSINESS",
    tags: ["Cash Flow", "Growth Focus", "Profit Protection"],
    focus: "Operating cash flow",
    bestFor: "Small business",
    difficulty: "Beginner",
  },
  freelancer: {
    art: "freelancer.png",
    icon: "user",
    label: "BUSINESS",
    tags: ["Income Smoothing", "Tax Ready", "Solo Focus"],
    focus: "Income smoothing",
    bestFor: "Freelancers",
    difficulty: "Beginner",
  },
  stablecoinIncome: {
    art: "stablecoin-income.png",
    icon: "stablecoin",
    label: "CRYPTO",
    tags: ["USDC Flow", "Liquidity", "Spend Ready"],
    focus: "Stablecoin income",
    bestFor: "Stablecoin earners",
    difficulty: "Beginner",
  },
  cryptoInvestor: {
    art: "crypto-investor.png",
    icon: "bitcoin",
    label: "CRYPTO",
    tags: ["Reserve Assets", "Risk Control", "Dip Fund"],
    focus: "Reserve allocation",
    bestFor: "Crypto investors",
    difficulty: "Advanced",
  },
  bitcoinStandard: {
    art: "bitcoin-standard.png",
    icon: "bitcoin",
    label: "BITCOIN",
    tags: ["BTC Reserve", "Simple Split", "Long-Term"],
    focus: "Bitcoin reserve",
    bestFor: "BTC stackers",
    difficulty: "Beginner",
  },
  lifestyle: {
    art: "lifestyle.png",
    icon: "spark",
    label: "LIFESTYLE",
    tags: ["Balanced", "Flexible", "Lifestyle First"],
    focus: "Lifestyle balance",
    bestFor: "Balanced living",
    difficulty: "Beginner",
  },
  travelLife: {
    art: "travel-life.png",
    icon: "plane",
    label: "TRAVEL",
    tags: ["Travel Fund", "Experiences", "Protected"],
    focus: "Travel goals",
    bestFor: "Frequent travelers",
    difficulty: "Beginner",
  },
  luxuryLifestyle: {
    art: "luxury-lifestyle.png",
    icon: "diamond",
    label: "PREMIUM",
    tags: ["Lifestyle Caps", "Travel", "Investing"],
    focus: "Premium lifestyle",
    bestFor: "Premium users",
    difficulty: "Intermediate",
  },
  vacationPlanner: {
    art: "vacation-planner.png",
    icon: "plane",
    label: "VACATION",
    tags: ["Trip Goal", "Spending Money", "Simple"],
    focus: "Vacation planning",
    bestFor: "Short-term trips",
    difficulty: "Beginner",
  },
  gamerMode: {
    art: "gamer-mode.png",
    icon: "game",
    label: "FUN",
    tags: ["Gaming Gear", "Subscriptions", "Internet"],
    focus: "Gaming budget",
    bestFor: "Gamers",
    difficulty: "Beginner",
  },
  creatorMode: {
    art: "creator-mode.png",
    icon: "camera",
    label: "CREATOR",
    tags: ["Gear", "Software", "Audience Growth"],
    focus: "Creator tools",
    bestFor: "Creators",
    difficulty: "Intermediate",
  },
  sideHustle: {
    art: "side-hustle.png",
    icon: "briefcase",
    label: "HUSTLE",
    tags: ["Supplies", "Tax Reserve", "Profit"],
    focus: "Side income",
    bestFor: "Side businesses",
    difficulty: "Intermediate",
  },
  aiSmartBudget: {
    art: "ai-smart-budget.png",
    icon: "ai",
    label: "AI",
    tags: ["AI Insights", "Safety Caps", "Flexible"],
    focus: "AI allocation",
    bestFor: "Premium AI users",
    difficulty: "Smart Assist",
  },
  firePlan: {
    art: "fire-plan.png",
    icon: "spark",
    label: "FIRE",
    tags: ["High Savings", "Tax Ready", "Lean Lifestyle"],
    focus: "Financial freedom",
    bestFor: "FIRE planners",
    difficulty: "Advanced",
  },
  millionaireBlueprint: {
    art: "millionaire-blueprint.png",
    icon: "diamond",
    label: "BLUEPRINT",
    tags: ["Business Capital", "Investing", "Tax Reserve"],
    focus: "Wealth blueprint",
    bestFor: "Premium builders",
    difficulty: "Advanced",
  },
  customBuild: {
    art: "custom-build.png",
    icon: "sliders",
    label: "CUSTOM",
    tags: ["Name accounts", "Set percentages", "Preview first"],
    focus: "Custom control",
    bestFor: "Custom budgets",
    difficulty: "Custom",
  },
  __saved: {
    art: "saved-custom-budget.png",
    icon: "vault",
    label: "SAVED",
    tags: ["Use Current VBA Setup", "Current Wallet Plan"],
    focus: "Saved plan",
    bestFor: "Existing wallets",
    difficulty: "Ready",
  },
};

const DEFAULT_UNIFIED_BUCKETS = [
  { name: "Bills", monthlyGoal: 1200, allocated: 700, spent: 0, sourceType: "unified" },
  { name: "Food", monthlyGoal: 500, allocated: 250, spent: 0, sourceType: "unified" },
  { name: "Gas", monthlyGoal: 240, allocated: 120, spent: 0, sourceType: "unified" },
  { name: "Savings", monthlyGoal: 800, allocated: 500, spent: 0, sourceType: "unified" },
  { name: "Personal", monthlyGoal: 300, allocated: 180, spent: 0, sourceType: "unified" },
  { name: "Emergency Fund", monthlyGoal: 500, allocated: 300, spent: 0, sourceType: "unified" },
  { name: "Investments", monthlyGoal: 250, allocated: 100, spent: 0, sourceType: "unified" },
  { name: "Vacation", monthlyGoal: 200, allocated: 80, spent: 0, sourceType: "unified" },
];

const FAMILY_DEFAULT_BUCKETS = [
  "Rent/Mortgage",
  "Utilities",
  "Groceries",
  "Child Expenses",
  "Emergency Fund",
  "Vacation",
  "Car Note",
  "Insurance",
  "Savings",
  "Investments",
];

const BUSINESS_DEFAULT_BUCKETS = [
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
];

const ALFI_RULES = [
  { label: "Budgeting consistency", points: 35 },
  { label: "Completed bill goals", points: 50 },
  { label: "Connected accounts", points: 25 },
  { label: "Family or business plan status", points: 100 },
  { label: "Referrals and community participation", points: 75 },
];

const BACKEND_ROUTE_BLUEPRINT = [
  "GET /api/health",
  "POST /api/auth/signup",
  "POST /api/auth/login",
  "POST /api/auth/password-reset",
  "GET /api/users/profile",
  "PATCH /api/users/profile",
  "POST /api/plaid/create-link-token",
  "POST /api/plaid/exchange-public-token",
  "GET /api/bank/accounts",
  "POST /api/bank/sync-balances",
  "POST /api/bank/sync-transactions",
  "DELETE /api/bank/disconnect/:bankItemId",
  "GET /api/dashboard/unified",
  "GET /api/transactions/unified",
  "GET /api/budget/monthly",
  "GET /api/buckets",
  "POST /api/vault/backup",
  "POST /api/vault/restore-preview",
  "GET /api/vault/architecture",
  "POST /api/vault/challenge",
  "POST /api/vault/session",
  "POST /api/vault/snapshots",
  "GET /api/vault/manifest",
  "POST /api/ai/insights",
  "POST /api/ai/categorize",
  "POST /api/onboarding/session",
  "GET /api/reports/monthly",
  "GET /api/subscriptions/plans",
  "GET /api/subscriptions/state",
  "POST /api/subscriptions/checkout",
  "POST /api/subscriptions/crypto-payment-intent",
  "POST /api/subscriptions/crypto-verify",
  "POST /api/subscriptions/stripe-webhook",
  "POST /api/family/create",
  "POST /api/family/invite",
  "POST /api/family/accept-invite",
  "GET /api/family/dashboard",
  "PATCH /api/family/member-role",
  "PATCH /api/family/privacy",
  "POST /api/business/create",
  "GET /api/business/dashboard",
  "GET /api/business/export/csv",
  "GET /api/business/export/pdf",
  "GET /api/rewards/overview",
  "GET /api/rewards/points-history",
  "GET /api/rewards/golden-ticket",
  "GET /api/admin/dashboard",
  "PATCH /api/admin/proposal/approve",
  "PATCH /api/admin/proposal/reject",
  "GET /api/admin/audit-logs",
];

const DATABASE_MODEL_BLUEPRINT = [
  "User",
  "SubscriptionPlan",
  "Subscription",
  "PaymentMethod",
  "PaymentHistory",
  "WalletConnection",
  "Invoice",
  "FeatureEntitlement",
  "ConnectedCryptoWallet",
  "ConnectedBankItem",
  "ConnectedBankAccount",
  "BankTransaction",
  "CryptoTransaction",
  "UnifiedTransaction",
  "Bucket",
  "BucketAllocation",
  "CategoryRule",
  "RecurringBill",
  "MonthlyBudgetSummary",
  "FamilyGroup",
  "FamilyMember",
  "FamilyInvite",
  "FamilyPrivacySetting",
  "FamilyBucket",
  "FamilyGoal",
  "BusinessProfile",
  "BusinessMember",
  "BusinessBankAccount",
  "BusinessCryptoWallet",
  "BusinessBucket",
  "Vendor",
  "BusinessReport",
  "AiInsight",
  "AlfiPointsLedger",
  "GoldenTicket",
  "CommunityImpactPool",
  "Proposal",
  "Vote",
  "DonationRecord",
  "AdminAuditLog",
];

function localId() {
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeStoredWallet(wallet) {
  if (!wallet || typeof wallet !== "object") return null;
  const networkKey = String(wallet.network || "").trim();
  const address = String(wallet.address || "").trim();
  if (!networkKey || !address) return null;
  const allocation = wallet.allocation && typeof wallet.allocation === "object" ? wallet.allocation : {};
  return {
    ...wallet,
    id: wallet.id || crypto.randomUUID(),
    name: String(wallet.name || NETWORKS[networkKey]?.label || "Tracked wallet").trim(),
    network: networkKey,
    address,
    budget: Number(wallet.budget || 0),
    manualBalance: Number(wallet.manualBalance || 0),
    balance: Number(wallet.balance ?? wallet.manualBalance ?? 0),
    allocation: {
      ...allocation,
      buckets: Array.isArray(allocation.buckets) ? allocation.buckets : [],
      transactions: Array.isArray(allocation.transactions) ? allocation.transactions : [],
    },
  };
}

function shouldRestoreDemoOwnerBudgetAccounts(wallet) {
  return isDemoModeActive()
    && localStorage.getItem(ONBOARDING_DEMO_STAGE_KEY) === "funded"
    && wallet?.demoMode
    && getWalletDisplayValue(wallet) > 0.01
    && !wallet.allocation?.buckets?.length;
}

function restoreDemoOwnerBudgetAccounts(wallet, now = new Date().toISOString()) {
  if (!shouldRestoreDemoOwnerBudgetAccounts(wallet)) return wallet;
  const walletValue = getWalletDisplayValue(wallet);
  const restoredWallet = {
    ...wallet,
    allocation: {
      ...(wallet.allocation || {}),
      cycle: wallet.allocation?.cycle || "weekly",
      buckets: createAllocationBucketsFromTemplate(DEMO_OWNER_STARTER_BUDGET_ACCOUNTS, walletValue),
      transactions: Array.isArray(wallet.allocation?.transactions) ? wallet.allocation.transactions : [],
      pendingIncrease: 0,
      pendingSpend: Number(wallet.allocation?.pendingSpend || 0),
      lastValue: walletValue,
      updatedAt: now,
      autoMode: wallet.allocation?.autoMode || "rules",
      demoStarter: true,
    },
    updatedAt: now,
  };
  recordAutomaticAllocation(restoredWallet, walletValue, "Demo owner wallet setup");
  return restoredWallet;
}

function normalizeDemoModeWalletSet(loadedWallets) {
  if (!isDemoModeActive() || localStorage.getItem(ONBOARDING_DEMO_STAGE_KEY) !== "funded") return loadedWallets;
  const now = new Date().toISOString();
  const legacySeedKeys = new Set([
    "ethereum:0x1111111111111111111111111111111111111111",
    "solanapyusd:11111111111111111111111111111111",
    "ethereumusdt:0x2222222222222222222222222222222222222222",
  ]);
  const isLegacyMultiWalletDemo = loadedWallets.length > 1 && loadedWallets.every((wallet) =>
    wallet.demoMode && legacySeedKeys.has(`${String(wallet.network || "").toLowerCase()}:${String(wallet.address || "").toLowerCase()}`)
  );
  return (isLegacyMultiWalletDemo ? getDemoWalletSeed(now) : loadedWallets)
    .map((wallet) => restoreDemoOwnerBudgetAccounts(wallet, now));
}
function loadWallets() {
  try {
    const loadedWallets = (JSON.parse(localStorage.getItem(STORAGE_KEY)) || [])
      .map(normalizeStoredWallet)
      .filter(Boolean)
      .map((wallet) => {
        if (wallet.status === "Refreshing") {
          return {
            ...wallet,
            status: "Needs check",
            statusType: "error",
            error: wallet.error || "Last refresh did not finish. Try refresh again.",
          };
        }
        if (wallet.status === "Sent" || String(wallet.error || "").startsWith("Transaction submitted:")) {
          return {
            ...wallet,
            status: "",
            statusType: "",
            error: "",
          };
        }
        return wallet;
      });
    return normalizeDemoModeWalletSet(loadedWallets);
  } catch {
    return [];
  }
}
function loadGoals() {
  try {
    return JSON.parse(localStorage.getItem("allocafi-goals-v1")) || [];
  } catch {
    return [];
  }
}

function loadAddressBook() {
  try {
    return JSON.parse(localStorage.getItem("allocafi-address-book-v1")) || [];
  } catch {
    return [];
  }
}

function createDefaultFinanceData() {
  const now = new Date().toISOString();
  const defaultBuckets = [
    { id: "unified-bills", name: "Bills", monthlyGoal: 1200, allocated: 700, spent: 0, sourceType: "unified", createdAt: now },
    { id: "unified-food", name: "Food", monthlyGoal: 500, allocated: 250, spent: 0, sourceType: "unified", createdAt: now },
    { id: "unified-gas", name: "Gas", monthlyGoal: 240, allocated: 120, spent: 0, sourceType: "unified", createdAt: now },
    { id: "unified-savings", name: "Savings", monthlyGoal: 800, allocated: 500, spent: 0, sourceType: "unified", createdAt: now },
    { id: "unified-personal", name: "Personal", monthlyGoal: 300, allocated: 180, spent: 0, sourceType: "unified", createdAt: now },
    { id: "unified-emergency", name: "Emergency Fund", monthlyGoal: 500, allocated: 300, spent: 0, sourceType: "unified", createdAt: now },
    { id: "unified-investments", name: "Investments", monthlyGoal: 250, allocated: 100, spent: 0, sourceType: "unified", createdAt: now },
    { id: "unified-vacation", name: "Vacation", monthlyGoal: 200, allocated: 80, spent: 0, sourceType: "unified", createdAt: now },
  ];
  const defaultRules = [
    { id: localId(), match: "walmart", category: "Food", bucketName: "Food", source: "merchant", createdAt: now },
    { id: localId(), match: "shell", category: "Gas", bucketName: "Gas", source: "merchant", createdAt: now },
    { id: localId(), match: "rent", category: "Rent", bucketName: "Bills", source: "merchant", createdAt: now },
  ];
  const defaultBills = [
    { id: localId(), name: "Rent/Mortgage", amount: 1200, frequency: "monthly", bucketName: "Bills", dueDay: 1 },
    { id: localId(), name: "Utilities", amount: 250, frequency: "monthly", bucketName: "Bills", dueDay: 10 },
    { id: localId(), name: "Phone", amount: 90, frequency: "monthly", bucketName: "Bills", dueDay: 15 },
  ];
  const data = {
    version: 1,
    plan: "Free",
    bankItems: [],
    bankAccounts: [],
    bankTransactions: [],
    manualTransactions: [],
    unifiedBuckets: defaultBuckets,
    categoryRules: defaultRules,
    recurringBills: defaultBills,
    familyGroups: [],
    familyInvites: [],
    businessProfiles: [],
    rewards: {
      pointsLedger: [],
      goldenTicket: {
        eligible: false,
        reserved: false,
        foundingMemberNumber: null,
        note: "First 1,000 paid users can receive a badge-only Founding Member Golden Ticket.",
      },
    },
    community: {
      pools: [{ id: localId(), name: "Community Impact Pool", status: "placeholder", balance: 0 }],
      proposals: [
        { id: localId(), title: "Local school supply drive", status: "Draft", city: "Atlanta", state: "GA", votesFor: 0, votesAgainst: 0 },
      ],
      votes: [],
      donations: [],
      recognitionPreferences: [],
    },
    adminControls: {
      adminPowerEnabled: false,
      showPayModule: false,
      fullAppUnlocked: false,
    },
    adminAuditLogs: [
      { id: localId(), action: "Unified finance foundation initialized", createdAt: now },
    ],
  };
  return data;
}

function mergeFinanceDefaults(data) {
  const defaults = createDefaultFinanceData();
  return {
    ...defaults,
    ...data,
    bankItems: Array.isArray(data?.bankItems) ? data.bankItems : [],
    bankAccounts: Array.isArray(data?.bankAccounts) ? data.bankAccounts : [],
    bankTransactions: Array.isArray(data?.bankTransactions) ? data.bankTransactions : [],
    manualTransactions: Array.isArray(data?.manualTransactions) ? data.manualTransactions : [],
    unifiedBuckets: Array.isArray(data?.unifiedBuckets) && data.unifiedBuckets.length ? data.unifiedBuckets : defaults.unifiedBuckets,
    categoryRules: Array.isArray(data?.categoryRules) ? data.categoryRules : defaults.categoryRules,
    recurringBills: Array.isArray(data?.recurringBills) ? data.recurringBills : defaults.recurringBills,
    familyGroups: Array.isArray(data?.familyGroups) ? data.familyGroups : [],
    familyInvites: Array.isArray(data?.familyInvites) ? data.familyInvites : [],
    businessProfiles: Array.isArray(data?.businessProfiles) ? data.businessProfiles : [],
    rewards: { ...defaults.rewards, ...(data?.rewards || {}) },
    community: { ...defaults.community, ...(data?.community || {}) },
    adminControls: { ...defaults.adminControls, ...(data?.adminControls || {}) },
    adminAuditLogs: Array.isArray(data?.adminAuditLogs) ? data.adminAuditLogs : defaults.adminAuditLogs,
  };
}

function loadFinanceData() {
  try {
    return mergeFinanceDefaults(JSON.parse(localStorage.getItem(UNIFIED_FINANCE_KEY)) || {});
  } catch {
    return createDefaultFinanceData();
  }
}

function loadAccountSession() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNT_SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function loadAccountProfile() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNT_PROFILE_KEY)) || { plan: "Free", migratedAt: "", lastSyncedAt: "", provider: "local-preview" };
  } catch {
    return { plan: "Free", migratedAt: "", lastSyncedAt: "", provider: "local-preview" };
  }
}

function loadCloudProviderStatus() {
  try {
    return JSON.parse(localStorage.getItem(CLOUD_PROVIDER_STATUS_KEY)) || null;
  } catch {
    return null;
  }
}

function loadAiInsightsState() {
  try {
    return JSON.parse(localStorage.getItem(AI_INSIGHTS_KEY)) || { insights: [], mode: "local", updatedAt: "" };
  } catch {
    return { insights: [], mode: "local", updatedAt: "" };
  }
}

function saveAiInsightsState(state) {
  aiInsightsState = {
    ...state,
    updatedAt: state.updatedAt || new Date().toISOString(),
  };
  localStorage.setItem(AI_INSIGHTS_KEY, JSON.stringify(aiInsightsState));
}


function getDefaultAiPricingRules() {
  return [
    { featureName: "Informational AI chat", requestType: "informational", baseCreditCost: 1, estimatedProviderCost: 0.002, minimumProfitMargin: 0.8, active: true },
    { featureName: "Rule-based budget template", requestType: "rule_action", baseCreditCost: 1, estimatedProviderCost: 0, minimumProfitMargin: 1, active: true },
    { featureName: "AI budget analysis", requestType: "suggestion_only", baseCreditCost: 3, estimatedProviderCost: 0.015, minimumProfitMargin: 0.75, active: true },
    { featureName: "Monthly report", requestType: "report", baseCreditCost: 5, estimatedProviderCost: 0.02, minimumProfitMargin: 0.78, active: true },
    { featureName: "Tax suggestion report", requestType: "report", baseCreditCost: 8, estimatedProviderCost: 0.035, minimumProfitMargin: 0.78, active: true },
    { featureName: "Business report", requestType: "report", baseCreditCost: 10, estimatedProviderCost: 0.05, minimumProfitMargin: 0.75, active: true },
    { featureName: "Dashboard skin generation", requestType: "visual_only", baseCreditCost: 10, estimatedProviderCost: 0.08, minimumProfitMargin: 0.7, active: true },
    { featureName: "Image generation", requestType: "visual_only", baseCreditCost: 15, estimatedProviderCost: 0.12, minimumProfitMargin: 0.7, active: true },
    { featureName: "Premium image generation", requestType: "visual_only", baseCreditCost: 25, estimatedProviderCost: 0.2, minimumProfitMargin: 0.72, active: true },
    { featureName: "AI report export", requestType: "vault_export", baseCreditCost: 3, estimatedProviderCost: 0.01, minimumProfitMargin: 0.75, active: true },
    { featureName: "Tax Ledger export", requestType: "vault_export", baseCreditCost: 5, estimatedProviderCost: 0.015, minimumProfitMargin: 0.75, active: true },
    { featureName: "Accountant package", requestType: "vault_export", baseCreditCost: 10, estimatedProviderCost: 0.03, minimumProfitMargin: 0.78, active: true },
    { featureName: "Full encrypted vault backup", requestType: "vault_export", baseCreditCost: 15, estimatedProviderCost: 0.02, minimumProfitMargin: 0.85, active: true },
  ];
}

function loadAllocafiAiChat() {
  try {
    return JSON.parse(localStorage.getItem(ALLOCAFI_AI_CHAT_KEY)) || [
      { role: "assistant", message: "I am AllocaFi AI. I can explain budgeting, build reports, suggest bucket plans, and create visual skins. I cannot change balances, subscriptions, ALFI credits, transaction history, tax records, admin roles, or security rules.", createdAt: new Date().toISOString() },
    ];
  } catch {
    return [];
  }
}

function saveAllocafiAiChat(messages) {
  allocafiAiChat = messages.slice(-40);
  localStorage.setItem(ALLOCAFI_AI_CHAT_KEY, JSON.stringify(allocafiAiChat));
}

function loadAllocafiAiLogs() {
  try {
    return JSON.parse(localStorage.getItem(ALLOCAFI_AI_LOG_KEY)) || [];
  } catch {
    return [];
  }
}

function saveAllocafiAiLogs(logs) {
  allocafiAiLogs = logs.slice(0, 250);
  localStorage.setItem(ALLOCAFI_AI_LOG_KEY, JSON.stringify(allocafiAiLogs));
}

function loadAllocafiAiPricingRules() {
  try {
    const stored = JSON.parse(localStorage.getItem(ALLOCAFI_AI_PRICING_KEY));
    return Array.isArray(stored) && stored.length ? stored : getDefaultAiPricingRules();
  } catch {
    return getDefaultAiPricingRules();
  }
}

function saveAllocafiAiPricingRules(rules) {
  allocafiAiPricingRules = rules;
  localStorage.setItem(ALLOCAFI_AI_PRICING_KEY, JSON.stringify(allocafiAiPricingRules));
}

function loadAllocafiAiCreditSettings() {
  try {
    return {
      autoSpendLimit: 2,
      dailyLimit: 25,
      weeklyLimit: 100,
      disableImageGeneration: false,
      disableReports: false,
      ...JSON.parse(localStorage.getItem(ALLOCAFI_AI_CREDIT_SETTINGS_KEY)),
    };
  } catch {
    return { autoSpendLimit: 2, dailyLimit: 25, weeklyLimit: 100, disableImageGeneration: false, disableReports: false };
  }
}

function saveAllocafiAiCreditSettings(settings) {
  allocafiAiCreditSettings = { ...allocafiAiCreditSettings, ...settings };
  localStorage.setItem(ALLOCAFI_AI_CREDIT_SETTINGS_KEY, JSON.stringify(allocafiAiCreditSettings));
}

function loadAllocafiAiSkins() {
  try {
    return JSON.parse(localStorage.getItem(ALLOCAFI_AI_SKINS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveAllocafiAiSkins(skins) {
  allocafiAiSkins = skins.slice(0, 60);
  localStorage.setItem(ALLOCAFI_AI_SKINS_KEY, JSON.stringify(allocafiAiSkins));
}

function loadAllocafiAiRuleSuggestions() {
  try {
    return JSON.parse(localStorage.getItem(ALLOCAFI_AI_RULE_SUGGESTIONS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveAllocafiAiRuleSuggestions(suggestions) {
  allocafiAiRuleSuggestions = suggestions.slice(0, 80);
  localStorage.setItem(ALLOCAFI_AI_RULE_SUGGESTIONS_KEY, JSON.stringify(allocafiAiRuleSuggestions));
}

function loadVaultExportLogs() {
  try {
    return JSON.parse(localStorage.getItem(ALLOCAFI_VAULT_EXPORT_LOG_KEY)) || [];
  } catch {
    return [];
  }
}

function saveVaultExportLog(entry) {
  const logs = loadVaultExportLogs();
  localStorage.setItem(ALLOCAFI_VAULT_EXPORT_LOG_KEY, JSON.stringify([entry, ...logs].slice(0, 100)));
}

function getAllocafiAiBalance() {
  return ALFI_RULES.reduce((sum, rule) => sum + Number(rule.points || 0), 0);
}

function collectAiBudgetSnapshot() {
  const details = getDashboardDetails();
  const dashboard = getDashboardSummary();
  return {
    redacted: true,
    walletCount: getSupportedWallets().length,
    walletBalance: dashboard.walletBalance,
    stablecoinTotal: details.stablecoinTotal,
    bucketCount: dashboard.bucketCount,
    bucketLeft: dashboard.bucketLeft,
    pendingSpend: dashboard.pendingSpend,
    pendingIncrease: dashboard.pendingIncrease,
    budgetAccounts: getSupportedWallets().flatMap((wallet) => (wallet.allocation?.buckets || []).map((bucket) => ({
      name: bucket.name,
      allocated: Number(bucket.allocated || 0),
      spent: Number(bucket.spent || 0),
      left: Math.max(Number(bucket.allocated || 0) - Number(bucket.spent || 0), 0),
    }))).slice(0, 24),
    virtualAssetAccounts: typeof getVirtualAssetAccounts === "function"
      ? getVirtualAssetAccounts().map((account) => ({
        name: account.name,
        asset: account.asset,
        currentValue: account.currentValue,
        legalCoreStatus: account.legalStatus,
      })).slice(0, 24)
      : [],
  };
}

function classifyAllocafiAiPrompt(prompt = "") {
  const normalized = String(prompt || "").toLowerCase();
  if (/(change|edit|fake|alter|delete|remove|add).*(wallet balance|transaction|receipt|tax record|premium|subscription|alfi credit|admin role|audit log)|seed phrase|private key|recovery phrase/.test(normalized)) {
    return { classification: "RESTRICTED", allowed: false, reason: "Protected financial/account data cannot be generated or modified by AllocaFi AI." };
  }
  if (/(skin|theme|icon|banner|background|image|visual)/.test(normalized)) return { classification: "VISUAL_ONLY", allowed: true };
  if (/(trucking budget|50\/30\/20|emergency fund|family budget|business budget|savings goal)/.test(normalized)) return { classification: "RULE_ACTION", allowed: true };
  if (/(reallocate|suggest|analysis|report|tax|debt payoff|spending)/.test(normalized)) return { classification: "SUGGESTION_ONLY", allowed: true };
  return { classification: "INFORMATIONAL", allowed: true };
}

function shouldUseLocalAllocafiAiEngine() {
  return isAdminPowerEnabled() || ["127.0.0.1", "localhost", ""].includes(location.hostname);
}

function isAllocafiAiPreviewPlaceholder(data) {
  const message = typeof data === "string" ? data : data?.message || data?.response || "";
  return /Local preview server is serving static AllocaFi assets|static AllocaFi assets|preview placeholder/i.test(message);
}

function getAllocafiAiPricingForClassification(classification = "INFORMATIONAL") {
  const key = String(classification || "INFORMATIONAL").toLowerCase();
  return allocafiAiPricingRules.find((rule) => String(rule.requestType || "").toLowerCase() === key)
    || allocafiAiPricingRules.find((rule) => String(rule.featureName || "").toLowerCase().includes("informational"))
    || { baseCreditCost: 1, estimatedProviderCost: 0, minimumProfitMargin: 1 };
}

function confirmAllocafiAiCreditSpend(credits) {
  if (Number(credits || 0) <= Number(allocafiAiCreditSettings.autoSpendLimit || 0)) return true;
  return window.confirm(`This action costs ${credits} ALFI Credits. Continue?`);
}

function buildLocalAllocafiAiResponse(prompt, classification, snapshot = collectAiBudgetSnapshot()) {
  const text = String(prompt || "").trim();
  if (!classification.allowed) {
    return {
      message: "This request cannot be completed because AllocaFi AI cannot generate or alter financial/account proof, balances, receipts, transaction records, or protected account data.",
      suggestedActions: [],
      engine: "LOCAL_RESTRICTED",
      ruleUsed: "",
    };
  }
  if (classification.classification === "RULE_ACTION" && /trucking/i.test(text)) {
    return {
      message: "Trucking budget template: Fuel 30%, Maintenance 15%, Insurance 12%, Taxes 15%, Driver Pay 18%, Emergency Reserve 10%. Review and confirm before applying changes to any Virtual Budget Account.",
      suggestedActions: ["Create Fuel bucket", "Create Maintenance bucket", "Create Tax Reserve bucket"],
      engine: "Admin Local AI",
      ruleUsed: "trucking_budget_template",
    };
  }
  if (classification.classification === "VISUAL_ONLY") {
    return {
      message: "AllocaFi AI can create visual-only dashboard skins, bucket icons, storefront banners, and profile graphics. DEMO / SAMPLE DATA / NOT REAL FINANCIAL DATA is required for any demo financial imagery.",
      suggestedActions: ["Open skin generator", "Create dashboard background", "Create bucket icon"],
      engine: "Admin Local AI",
      ruleUsed: "visual_safety",
    };
  }
  const budgetLine = snapshot.bucketCount
    ? `${snapshot.bucketCount} budget accounts are tracked with ${formatUsd(snapshot.bucketLeft)} available.`
    : "No Virtual Budget Accounts are active yet.";
  const assetLine = snapshot.virtualAssetAccounts?.length
    ? `${snapshot.virtualAssetAccounts.length} Virtual Asset Accounts are ready for Legal Core review.`
    : "No Virtual Asset Accounts have a connected reserve balance yet.";
  return {
    message: `${budgetLine} ${assetLine} AllocaFi AI can suggest actions, but protected financial changes require user confirmation and wallet signatures where applicable.`,
    suggestedActions: ["Review budget accounts", "Review asset accounts", "Generate report"],
    engine: shouldUseLocalAllocafiAiEngine() ? "Admin Local AI" : "LOCAL_INFORMATIONAL",
    ruleUsed: classification.classification === "INFORMATIONAL" ? "" : classification.classification,
  };
}

async function runAllocafiAiPrompt(prompt, options = {}) {
  const classification = classifyAllocafiAiPrompt(prompt);
  const pricing = getAllocafiAiPricingForClassification(classification.classification);
  const credits = Number(options.alfiCost ?? pricing.baseCreditCost ?? 1);
  if (classification.allowed && !confirmAllocafiAiCreditSpend(credits)) {
    return { message: "AllocaFi AI request cancelled before ALFI charge.", suggestedActions: [], engine: "cancelled", ruleUsed: "" };
  }
  const snapshot = collectAiBudgetSnapshot();
  let result = buildLocalAllocafiAiResponse(prompt, classification, snapshot);
  if (!shouldUseLocalAllocafiAiEngine()) {
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, classification: classification.classification, budgetSnapshot: snapshot }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && !isAllocafiAiPreviewPlaceholder(data)) {
        result = {
          message: data.message || data.response || result.message,
          suggestedActions: data.suggestedActions || result.suggestedActions,
          engine: data.engine || data.provider || "AI_ACTION",
          ruleUsed: data.ruleUsed || "",
        };
      }
    } catch {
      result.engine = "Admin Local AI";
    }
  }
  saveAllocafiAiLogs([{
    id: crypto.randomUUID(),
    prompt,
    normalizedIntent: classification.classification.toLowerCase(),
    classification: classification.classification,
    status: classification.allowed ? "allowed" : "blocked",
    blockedReason: classification.allowed ? "" : classification.reason,
    provider: result.engine,
    model: result.engine,
    inputTokens: Math.ceil(String(prompt || "").length / 4),
    outputTokens: Math.ceil(String(result.message || "").length / 4),
    estimatedCost: Number(pricing.estimatedProviderCost || 0),
    alfiCharged: classification.allowed ? credits : 0,
    revenueValue: classification.allowed ? credits : 0,
    profit: classification.allowed ? credits - Number(pricing.estimatedProviderCost || 0) : 0,
    ruleUsed: result.ruleUsed || "",
    createdAt: new Date().toISOString(),
  }, ...allocafiAiLogs]);
  return result;
}

function getAiDisplayInsights(localInsights) {
  const recent = aiInsightsState?.updatedAt && (Date.now() - new Date(aiInsightsState.updatedAt).getTime()) < 24 * 60 * 60 * 1000;
  const insights = recent && Array.isArray(aiInsightsState.insights) && aiInsightsState.insights.length
    ? aiInsightsState.insights
    : localInsights.map((message) => ({
      title: "Local insight",
      severity: "info",
      message,
      action: "Review",
      requiresConfirmation: false,
      source: "local-dashboard",
    }));
  return insights.slice(0, 5);
}


async function refreshAiInsights() {
  const snapshot = collectAiBudgetSnapshot();
  const result = await runAllocafiAiPrompt("Generate monthly AllocaFi dashboard insights", { alfiCost: 1 });
  saveAiInsightsState({
    mode: result.engine || "Admin Local AI",
    redacted: true,
    cost: { estimatedCostUsd: 0, alfiCharged: 1 },
    insights: [
      { id: crypto.randomUUID(), title: "Budget Snapshot", severity: "info", message: result.message, action: "Review" },
      { id: crypto.randomUUID(), title: "Stablecoin Tracking", severity: snapshot.stablecoinTotal > 0 ? "success" : "warning", message: `${formatUsd(snapshot.stablecoinTotal)} in stablecoins is visible to the redacted AI snapshot.`, action: "Monitor" },
      { id: crypto.randomUUID(), title: "Legal Core", severity: snapshot.virtualAssetAccounts.length ? "success" : "info", message: `${snapshot.virtualAssetAccounts.length} Virtual Asset Accounts included in AI-safe context.`, action: "Open accounts" },
    ],
  });
  renderDashboard();
  renderAiInsightsPage();
  showToast("AllocaFi AI insights refreshed");
}

function renderAiInsightsPage() {
  if (!aiInsightsView) return;
  const latest = aiInsightsState?.insights || [];
  aiInsightsView.innerHTML = `
    <section class="overview-card ai-command-card">
      <div class="overview-card-head"><span>AllocaFi AI</span><strong>${escapeHtml(aiInsightsState?.mode || "Admin Local AI")}</strong></div>
      <p class="wallet-note">Rule-first AI runs on redacted summaries. It cannot directly modify wallet balances, ALFI credits, subscriptions, tax records, or Legal Core data.</p>
      <div class="send-grid">
        <label>Ask AllocaFi AI<input id="allocafiAiPrompt" placeholder="Create trucking budget, explain buckets, generate report..." /></label>
      </div>
      <div class="dialog-actions"><button class="primary-button" id="runAllocafiAiPromptButton" type="button">Run AllocaFi AI</button></div>
      <div class="overview-list">
        ${latest.map((insight) => `<div class="overview-row compact"><span>${escapeHtml(insight.title || "Insight")}</span><strong>${escapeHtml(insight.message || "")}</strong></div>`).join("") || `<p class="wallet-note">No AI insights yet.</p>`}
      </div>
    </section>
  `;
  aiInsightsView.querySelector("#runAllocafiAiPromptButton")?.addEventListener("click", async () => {
    const input = aiInsightsView.querySelector("#allocafiAiPrompt");
    const prompt = input?.value?.trim();
    if (!prompt) {
      showToast("Enter a prompt for AllocaFi AI");
      return;
    }
    const response = await runAllocafiAiPrompt(prompt);
    saveAllocafiAiChat([...allocafiAiChat, { role: "user", message: prompt, createdAt: new Date().toISOString() }, { role: "assistant", message: response.message, createdAt: new Date().toISOString() }]);
    saveAiInsightsState({ mode: response.engine, redacted: true, insights: [{ id: crypto.randomUUID(), title: "AllocaFi AI", severity: "info", message: response.message, action: "Review" }] });
    renderAiInsightsPage();
  });
}

function openAiCategoryDialog() {
  const snapshot = collectAiBudgetSnapshot();
  openDialog(`
    <div class="dialog-content">
      <h2>AllocaFi AI Category Suggestions</h2>
      <p class="wallet-note">AI suggestions use redacted budget snapshots and require user confirmation before app changes.</p>
      <div class="overview-list">
        ${snapshot.budgetAccounts.slice(0, 8).map((bucket) => `<div class="overview-row compact"><span>${escapeHtml(bucket.name)}</span><strong>${formatUsd(bucket.left)} available</strong></div>`).join("") || `<p class="wallet-note">Create budget accounts to receive category suggestions.</p>`}
      </div>
    </div>
  `);
}

function loadSubscriptionState() {
  try {
    return {
      planCode: "free",
      status: "active",
      billingCycle: "monthly",
      paymentMethod: "",
      renewsAt: "",
      ...JSON.parse(localStorage.getItem(SUBSCRIPTION_STATE_KEY)),
    };
  } catch {
    return { planCode: "free", status: "active", billingCycle: "monthly", paymentMethod: "", renewsAt: "" };
  }
}

function saveSubscriptionState(state) {
  subscriptionState = {
    ...subscriptionState,
    ...state,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(SUBSCRIPTION_STATE_KEY, JSON.stringify(subscriptionState));
}

function loadSubscriptionBillingHistory() {
  try {
    return JSON.parse(localStorage.getItem(SUBSCRIPTION_BILLING_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSubscriptionBillingHistory(history) {
  subscriptionBillingHistory = history.slice(0, 40);
  localStorage.setItem(SUBSCRIPTION_BILLING_KEY, JSON.stringify(subscriptionBillingHistory));
}

function addSubscriptionHistory(entry = {}) {
  const record = {
    id: entry.id || crypto.randomUUID(),
    planCode: entry.planCode || subscriptionState?.planCode || "free",
    planName: entry.planName || getSubscriptionPlan(entry.planCode || subscriptionState?.planCode || "free").name,
    amount: Number(entry.amount || 0),
    method: entry.method || "local",
    status: entry.status || "recorded",
    txHash: entry.txHash || "",
    createdAt: entry.createdAt || new Date().toISOString(),
  };
  saveSubscriptionBillingHistory([record, ...(subscriptionBillingHistory || [])]);
  return record;
}

function loadAllocaFiPayState() {
  try {
    return normalizePayState(JSON.parse(localStorage.getItem(ALLOCAFI_PAY_KEY)) || createDefaultPayState());
  } catch {
    return createDefaultPayState();
  }
}

function saveAllocaFiPayState() {
  allocafiPayState = normalizePayState(allocafiPayState);
  localStorage.setItem(ALLOCAFI_PAY_KEY, JSON.stringify(allocafiPayState));
}

function loadLedgerCoreState() {
  try {
    return normalizeLedgerCoreState(JSON.parse(localStorage.getItem(ALLOCAFI_LEDGERCORE_KEY)) || createDefaultLedgerCoreState());
  } catch {
    return createDefaultLedgerCoreState();
  }
}

function saveLedgerCoreState() {
  ledgerCoreState = normalizeLedgerCoreState(ledgerCoreState);
  localStorage.setItem(ALLOCAFI_LEDGERCORE_KEY, JSON.stringify(ledgerCoreState));
}

function createDefaultAllocaFiConnectState() {
  return {
    activeTab: "messages",
    profile: {
      id: localId(),
      userId: "local-user",
      walletAddress: "",
      chain: "evm",
      username: "",
      displayName: "",
      avatarUrl: "",
      verified: false,
      verificationSignatureHash: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastSeenAt: "",
      connectStatus: "setup_required",
    },
    conversations: [],
    messages: [],
    contacts: [],
    calls: [],
    callSignals: [],
    requests: [],
    blockedAddresses: [],
    reports: [],
    notifications: [],
    conversationKeys: {},
    settings: {
      featureFlags: { ...ALLOCAFI_CONNECT_FEATURE_FLAGS },
      stunServers: ["stun:stun.l.google.com:19302"],
      turnCredentialsMode: "backend-short-lived-placeholder",
    },
  };
}

function normalizeAllocaFiConnectState(state = {}) {
  const defaults = createDefaultAllocaFiConnectState();
  const profile = { ...defaults.profile, ...(state.profile || {}) };
  return {
    ...defaults,
    ...state,
    activeTab: ALLOCAFI_CONNECT_TABS.includes(state.activeTab) ? state.activeTab : "messages",
    profile: {
      ...profile,
      walletAddress: String(profile.walletAddress || "").trim(),
      username: String(profile.username || "").trim().toLowerCase(),
      displayName: String(profile.displayName || "").trim(),
      verified: Boolean(profile.verified),
      connectStatus: profile.verified ? "verified" : profile.walletAddress ? "view_only" : "setup_required",
    },
    conversations: Array.isArray(state.conversations) ? state.conversations : [],
    messages: Array.isArray(state.messages) ? state.messages : [],
    contacts: Array.isArray(state.contacts) ? state.contacts : [],
    calls: Array.isArray(state.calls) ? state.calls : [],
    callSignals: Array.isArray(state.callSignals) ? state.callSignals : [],
    requests: Array.isArray(state.requests) ? state.requests : [],
    blockedAddresses: Array.isArray(state.blockedAddresses) ? state.blockedAddresses : [],
    reports: Array.isArray(state.reports) ? state.reports : [],
    notifications: Array.isArray(state.notifications) ? state.notifications : [],
    conversationKeys: state.conversationKeys && typeof state.conversationKeys === "object" ? state.conversationKeys : {},
    settings: {
      ...defaults.settings,
      ...(state.settings || {}),
      featureFlags: {
        ...ALLOCAFI_CONNECT_FEATURE_FLAGS,
        ...(state.settings?.featureFlags || {}),
      },
    },
  };
}

function loadAllocaFiConnectState() {
  try {
    return normalizeAllocaFiConnectState(JSON.parse(localStorage.getItem(ALLOCAFI_CONNECT_KEY)) || {});
  } catch {
    return createDefaultAllocaFiConnectState();
  }
}

function saveAllocaFiConnectState() {
  allocafiConnectState = normalizeAllocaFiConnectState(allocafiConnectState);
  localStorage.setItem(ALLOCAFI_CONNECT_KEY, JSON.stringify(allocafiConnectState));
}

function loadAiCategorySuggestions() {
  try {
    return JSON.parse(localStorage.getItem(AI_CATEGORY_SUGGESTIONS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveAiCategorySuggestions(suggestions) {
  aiCategorySuggestions = suggestions.slice(0, 20);
  localStorage.setItem(AI_CATEGORY_SUGGESTIONS_KEY, JSON.stringify(aiCategorySuggestions));
}

function saveAccountSession(session) {
  accountSession = session;
  if (session) {
    localStorage.setItem(ACCOUNT_SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(ACCOUNT_SESSION_KEY);
  }
}

function saveAccountProfile(profile) {
  accountProfile = { ...accountProfile, ...profile };
  localStorage.setItem(ACCOUNT_PROFILE_KEY, JSON.stringify(accountProfile));
}

function loadCloudSyncQueue() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNT_SYNC_QUEUE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCloudSyncQueue(queue) {
  localStorage.setItem(ACCOUNT_SYNC_QUEUE_KEY, JSON.stringify(queue.slice(-25)));
}

function saveCloudProviderStatus(status) {
  cloudProviderStatus = status;
  localStorage.setItem(CLOUD_PROVIDER_STATUS_KEY, JSON.stringify(status));
}

function collectCloudSnapshot() {
  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    user: accountSession ? { id: accountSession.userId, email: accountSession.email, provider: accountSession.provider } : null,
    wallets,
    goals,
    addressBook,
    financeData,
    settings: {
      solanaRpcConfigured: hasConfiguredSolanaRpc(),
      walletConnectConfigured: Boolean(loadWalletConnectProjectId()),
    },
  };
}

function getCloudDataSummary(snapshot = collectCloudSnapshot()) {
  const bucketCount = (snapshot.wallets || []).reduce((sum, wallet) => sum + (wallet.allocation?.buckets?.length || 0), 0);
  const txCount = (snapshot.wallets || []).reduce((sum, wallet) => sum + (wallet.allocation?.transactions?.length || 0), 0)
    + (snapshot.financeData?.bankTransactions?.length || 0)
    + (snapshot.financeData?.manualTransactions?.length || 0);
  return {
    wallets: snapshot.wallets?.length || 0,
    buckets: bucketCount,
    transactions: txCount,
    goals: snapshot.goals?.length || 0,
    addressBook: snapshot.addressBook?.length || 0,
  };
}

function hasMigratedLocalData() {
  return Boolean(localStorage.getItem(ACCOUNT_MIGRATION_KEY) || accountProfile?.migratedAt);
}

function queueCloudSync(reason = "Data changed") {
  if (!accountSession) return;
  const queue = loadCloudSyncQueue();
  queue.push({
    id: crypto.randomUUID(),
    reason,
    createdAt: new Date().toISOString(),
    summary: getCloudDataSummary(),
  });
  saveCloudSyncQueue(queue);
  renderAccountCloudPanel();
}

async function refreshCloudProviderStatus() {
  try {
    const response = await fetchWithTimeout("/api/config/status", {}, 5000);
    if (!response.ok) throw new Error("Status unavailable");
    const status = await response.json();
    serverSolanaRpcConfigured = Boolean(status?.services?.solanaRpc || serverSolanaRpcConfigured);
    saveCloudProviderStatus(status);
  } catch {
    saveCloudProviderStatus({
      mode: "local-preview",
      configured: false,
      services: {},
      message: "Local prototype mode. Add environment keys to enable production services.",
    });
  }
  renderAccountCloudPanel();
}

function createLocalAccountSession(email, provider = "local-preview") {
  return {
    userId: `local-user-${btoa(email).replace(/=+$/g, "").slice(0, 18)}`,
    email,
    provider,
    signedInAt: new Date().toISOString(),
    accessToken: "",
  };
}

async function requestAccountAuth(mode, email, password) {
  const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
  try {
    const response = await fetchWithTimeout(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }, 9000);
    const data = await response.json().catch(() => ({}));
    if (response.ok && data.user) {
      return {
        ok: true,
        session: {
          userId: data.user.id || data.user.email || email,
          email: data.user.email || email,
          provider: data.provider || "supabase",
          accessToken: data.session?.access_token || "",
          signedInAt: new Date().toISOString(),
        },
        provider: data.provider || "supabase",
      };
    }
    return { ok: false, code: data.code || response.status, message: data.error?.message || data.message || "Cloud auth is not configured yet" };
  } catch (error) {
    return { ok: false, code: "network", message: error?.message || "Cloud auth is unavailable" };
  }
}

function openAccountAuthDialog(mode = "signup") {
  const title = mode === "signup" ? "Create account" : "Log in";
  dialogContent.innerHTML = `
    <h2>${title}</h2>
    <p class="wallet-note">This is the production account foundation. If Supabase keys are connected, this uses Supabase Auth. Otherwise it creates a local preview account for testing migration and sync flow.</p>
    <label>
      Email
      <input id="accountEmail" type="email" autocomplete="email" placeholder="you@example.com" value="${escapeHtml(accountSession?.email || "")}" />
    </label>
    <label>
      Password
      <input id="accountPassword" type="password" autocomplete="${mode === "signup" ? "new-password" : "current-password"}" placeholder="Minimum 8 characters" />
    </label>
    <div class="dialog-actions">
      <button id="submitAccountAuth" class="primary-button" type="button">${title}</button>
      <button id="resetAccountPassword" class="secondary-button" type="button">Password reset</button>
    </div>
  `;
  walletDialog.showModal();
  dialogContent.querySelector("#submitAccountAuth")?.addEventListener("click", () => submitAccountAuth(mode));
  dialogContent.querySelector("#resetAccountPassword")?.addEventListener("click", sendPasswordReset);
}

async function submitAccountAuth(mode) {
  const email = dialogContent.querySelector("#accountEmail")?.value.trim().toLowerCase();
  const password = dialogContent.querySelector("#accountPassword")?.value || "";
  if (!email || !email.includes("@")) {
    showToast("Enter a valid email");
    return;
  }
  if (password.length < 8) {
    showToast("Use at least 8 password characters");
    return;
  }

  const result = await requestAccountAuth(mode, email, password);
  const session = result.ok ? result.session : createLocalAccountSession(email);
  saveAccountSession(session);
  saveAccountProfile({
    provider: result.ok ? result.provider : "local-preview",
    plan: accountProfile?.plan || "Free",
  });
  queueCloudSync(mode === "signup" ? "Account created" : "Account login");
  walletDialog.close();
  render();
  const suffix = result.ok ? "with cloud auth" : "in local preview mode";
  showToast(`${mode === "signup" ? "Account created" : "Logged in"} ${suffix}`);
}

async function sendPasswordReset() {
  const email = dialogContent.querySelector("#accountEmail")?.value.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    showToast("Enter your email first");
    return;
  }
  try {
    const response = await fetchWithTimeout("/api/auth/password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }, 7000);
    if (response.ok) {
      showToast("Password reset requested");
      return;
    }
  } catch {
    // Fall through to local preview message.
  }
  showToast("Password reset is ready once Supabase env keys are added");
}

function logoutAccount() {
  saveAccountSession(null);
  render();
  showToast("Logged out");
}

function migrateLocalDataToAccount() {
  if (!accountSession) {
    openAccountAuthDialog("signup");
    return;
  }
  const migratedAt = new Date().toISOString();
  localStorage.setItem(ACCOUNT_MIGRATION_KEY, migratedAt);
  saveAccountProfile({ migratedAt });
  queueCloudSync("Migrated local browser data into account");
  flushCloudSync("Migration");
  render();
  showToast("Local data attached to account");
}

async function flushCloudSync(label = "Sync") {
  if (!accountSession) {
    showToast("Log in first");
    return;
  }
  const snapshot = collectCloudSnapshot();
  const queue = loadCloudSyncQueue();
  try {
    const response = await fetchWithTimeout("/api/sync/snapshot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": accountSession.accessToken ? `Bearer ${accountSession.accessToken}` : "",
      },
      body: JSON.stringify({ snapshot, queue }),
    }, 9000);
    const data = await response.json().catch(() => ({}));
    const syncedAt = new Date().toISOString();
    saveAccountProfile({ lastSyncedAt: syncedAt, lastSyncMode: data.mode || "local-preview" });
    if (response.ok) saveCloudSyncQueue([]);
    showToast(response.ok ? `${label} complete` : data.message || "Cloud sync waiting on production keys");
  } catch {
    showToast("Cloud sync queued locally");
  }
  renderAccountCloudPanel();
}

function loadWalletConnectProjectId() {
  return localStorage.getItem(WALLETCONNECT_PROJECT_KEY) || "";
}

async function hydrateClientConfig() {
  try {
    const response = await fetchWithTimeout("/api/config/client", {}, 7000);
    if (!response.ok) return;
    const config = await response.json();
    let shouldUpdateWalletUi = false;
    if (config.walletConnectProjectId && !loadWalletConnectProjectId()) {
      localStorage.setItem(WALLETCONNECT_PROJECT_KEY, config.walletConnectProjectId);
      if (walletConnectProjectInput) walletConnectProjectInput.value = config.walletConnectProjectId;
      shouldUpdateWalletUi = true;
    }
    serverSolanaRpcConfigured = Boolean(config.solanaRpcConfigured);
    serverSolanaRpcHost = config.solanaRpcHost || "";
    if (serverSolanaRpcConfigured) shouldUpdateWalletUi = true;
    if (shouldUpdateWalletUi) {
      updateWalletConnectionUi();
      renderAccountCloudPanel();
    }
  } catch {
    // The app still works without the optional public client config.
  }
}

function saveSolanaRpcUrl() {
  const value = solanaRpcUrlInput?.value.trim() || "";
  if (!value) {
    localStorage.removeItem(SOLANA_RPC_URL_KEY);
    showToast(serverSolanaRpcConfigured ? "Using server Solana RPC automatically" : "Solana RPC URL cleared");
    updateWalletConnectionUi();
    return;
  }
  if (value.includes("*") || value.includes("...")) {
    showToast("Copy the full RPC URL using the copy icon, not the masked text");
    return;
  }
  if (!isAllowedSolanaRpcUrl(value)) {
    showToast("Use a supported Solana RPC: Helius, Alchemy, Solana public, or PublicNode");
    return;
  }
  localStorage.setItem(SOLANA_RPC_URL_KEY, value);
  scheduleAutoVaultSnapshot();
  showToast("Solana RPC URL saved");
}

function saveWallets() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
  scheduleAutoVaultSnapshot();
  queueCloudSync("Wallet data saved");
}

function saveGoals() {
  localStorage.setItem("allocafi-goals-v1", JSON.stringify(goals));
  scheduleAutoVaultSnapshot();
  queueCloudSync("Goal data saved");
}

function saveAddressBook() {
  localStorage.setItem("allocafi-address-book-v1", JSON.stringify(addressBook));
  scheduleAutoVaultSnapshot();
  queueCloudSync("Address book saved");
}

function saveFinanceData() {
  localStorage.setItem(UNIFIED_FINANCE_KEY, JSON.stringify(financeData));
  scheduleAutoVaultSnapshot();
  queueCloudSync("Finance data saved");
}

function addAdminAudit(action) {
  financeData.adminAuditLogs = financeData.adminAuditLogs || [];
  financeData.adminAuditLogs.unshift({ id: crypto.randomUUID(), action, createdAt: new Date().toISOString() });
  financeData.adminAuditLogs = financeData.adminAuditLogs.slice(0, 25);
  saveFinanceData();
}

function getAdminControls() {
  financeData.adminControls = {
    adminPowerEnabled: false,
    showPayModule: false,
    fullAppUnlocked: false,
    ...(financeData.adminControls || {}),
  };
  financeData.adminControls.fullAppUnlocked = Boolean(financeData.adminControls.adminPowerEnabled);
  return financeData.adminControls;
}

function isAdminPowerEnabled() {
  return Boolean(getAdminControls().adminPowerEnabled);
}


function getSubscriptionPlan(planCode = subscriptionState?.planCode || "free") {
  return SUBSCRIPTION_PLANS.find((plan) => plan.code === planCode) || SUBSCRIPTION_PLANS[0];
}

function getCurrentSubscriptionPlan() {
  return getSubscriptionPlan(subscriptionState?.planCode || subscriptionState?.activePlan || "free");
}

function getCurrentEntitlements() {
  if (isAdminPowerEnabled()) return ADMIN_ENTITLEMENTS;
  return getCurrentSubscriptionPlan().entitlements || SUBSCRIPTION_PLANS[0].entitlements;
}

function formatPlanLimit(value) {
  return value === Infinity ? "Unlimited" : String(value);
}

function countVirtualBucketAccounts() {
  return getSupportedWallets().reduce((sum, wallet) => sum + (wallet.allocation?.buckets || []).length, 0);
}

function canAddWalletUnderPlan() {
  if (isDemoModeActive() || isAdminPowerEnabled()) return true;
  const limit = getCurrentEntitlements().wallets;
  return limit === Infinity || getSupportedWallets().length < limit;
}

function canUseBucketCountUnderPlan(nextCount) {
  if (isDemoModeActive() || isAdminPowerEnabled()) return true;
  const limit = getCurrentEntitlements().buckets;
  return limit === Infinity || nextCount <= limit;
}

function canSendFromVirtualBucketAccounts() {
  if (isAdminPowerEnabled()) return true;
  return Boolean(getCurrentEntitlements().transfers);
}

function canUseReserveAssetAccounts() {
  if (isAdminPowerEnabled() || isDemoModeActive()) return true;
  return Boolean(getCurrentEntitlements().reserveAccounts || getCurrentEntitlements().legalCore);
}

function canUseLegalCoreAddOns() {
  if (isAdminPowerEnabled() || isDemoModeActive()) return true;
  return Boolean(getCurrentEntitlements().legalCore);
}

function openSubscriptionCheckout(planCode = "premium") {
  const plan = getSubscriptionPlan(planCode);
  const entitlements = plan.entitlements || {};
  openDialog(`
    <div class="dialog-content">
      <h2>${escapeHtml(plan.name)} Plan</h2>
      <p class="wallet-note">${escapeHtml(plan.description || "Upgrade AllocaFi features.")}</p>
      <div class="overview-list">
        <div class="overview-row compact"><span>Wallets</span><strong>${formatPlanLimit(entitlements.wallets)}</strong></div>
        <div class="overview-row compact"><span>Budget accounts</span><strong>${formatPlanLimit(entitlements.buckets)}</strong></div>
        <div class="overview-row compact"><span>AI + analytics</span><strong>${entitlements.ai ? "Unlocked" : "Basic"}</strong></div>
        <div class="overview-row compact"><span>Reports + exports</span><strong>${entitlements.reports ? "Unlocked" : "Manual"}</strong></div>
      </div>
      <div class="dialog-actions">
        <button class="primary-button" id="activatePreviewPlan" type="button">Activate Local Preview</button>
      </div>
      <p class="form-note">Local preview activation does not charge a payment method.</p>
    </div>
  `);
  dialogContent.querySelector("#activatePreviewPlan")?.addEventListener("click", () => {
    saveSubscriptionState({ planCode: plan.code, status: plan.code === "free" ? "active" : "preview_active", paymentMethod: plan.code === "free" ? "free" : "local-preview" });
    addSubscriptionHistory({ planCode: plan.code, planName: plan.name, amount: plan.monthlyPrice || 0, method: "local-preview", status: "preview_active" });
    walletDialog.close();
    render();
    showToast(`${plan.name} preview activated`);
  });
}

function openSubscriptionPlansDialog() {
  openSubscriptionCheckout(subscriptionState?.planCode || "premium");
}
function canAccessAllocaFiPayModule() {
  const controls = getAdminControls();
  return Boolean(controls.adminPowerEnabled && controls.showPayModule);
}

function applyAdminDisplayControls() {
  const controls = getAdminControls();
  document.body.classList.toggle("admin-power-enabled", Boolean(controls.adminPowerEnabled));
  const payLauncher = document.querySelector('[data-open-advanced="pay"]');
  if (payLauncher) payLauncher.hidden = !canAccessAllocaFiPayModule();
}

function updateAdminControl(key, value) {
  const controls = getAdminControls();
  controls[key] = Boolean(value);
  if (key === "adminPowerEnabled") controls.fullAppUnlocked = Boolean(value);
  if (key === "adminPowerEnabled" && !value) controls.showPayModule = false;
  saveFinanceData();
  addAdminAudit(`${key === "adminPowerEnabled" ? "Admin Power" : "AllocaFi Pay module"} ${value ? "enabled" : "disabled"}`);
  render();
  showToast(key === "adminPowerEnabled"
    ? `Admin Power ${value ? "enabled" : "disabled"}`
    : `AllocaFi Pay module ${value ? "visible" : "hidden"}`);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function setSendStatus(message, type = "") {
  const status = dialogContent?.querySelector("#sendStatus");
  if (!status) return;
  status.textContent = message;
  status.className = `send-status ${type}`.trim();
}

function setSendButtonLoading(isLoading, label = "Send with wallet") {
  const button = dialogContent?.querySelector("#sendTransaction");
  if (!button) return;
  button.disabled = isLoading;
  button.textContent = isLoading ? "Preparing transaction..." : label;
}

function switchTab(tabName) {
  if (shouldForceOnboardingGate() && tabName !== "settings") {
    window.setTimeout(openCurrentOnboardingStep, 0);
    showToast("Complete onboarding to unlock AllocaFi");
    return;
  }
  if (tabName !== "wallets") {
    form?.classList.remove("open");
  }
  document.body.classList.toggle("enterprise-route-active", tabName === "business");
  document.body.classList.toggle("family-route-active", tabName === "family");
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
  tabPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === tabName);
  });
  const visibleButton = [...tabButtons].find((button) => button.dataset.tab === tabName);
  if (!visibleButton && tabName !== "settings") {
    document.querySelector('[data-tab="settings"]')?.classList.add("active");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openAdvancedSystem(tabName) {
  if (tabName === "ai") {
    switchTab("settings");
    showToast("AllocaFi AI is parked in Settings as a future premium project");
    return;
  }
  if (tabName === "pay" && !canAccessAllocaFiPayModule()) {
    showToast("Enable Admin Power and Pay module visibility in Admin Controls first");
    return;
  }
  switchTab(tabName);
  if (tabName === "business" && window.location.pathname !== "/business") {
    window.history.pushState({ tab: "business" }, "", "/business");
  } else if (tabName === "family" && window.location.pathname !== "/family/treasury") {
    window.history.pushState({ tab: "family" }, "", "/family/treasury");
  } else if (tabName === "pay" && window.location.hash !== "#pay") {
    window.history.pushState({ tab: "pay" }, "", "#pay");
  } else if (tabName === "ledgercore" && window.location.hash !== "#ledgercore") {
    window.history.pushState({ tab: "ledgercore" }, "", "#ledgercore");
  } else if (tabName === "allocafi-connect" && window.location.hash !== "#allocafi-connect") {
    window.history.pushState({ tab: "allocafi-connect" }, "", "#allocafi-connect");
  } else if (tabName === "ai" && window.location.hash !== "#allocafi-ai") {
    window.history.pushState({ tab: "ai" }, "", "#allocafi-ai");
  } else if (tabName === "admin" && window.location.hash !== "#admin") {
    window.history.pushState({ tab: "admin" }, "", "#admin");
  }
}

function getRouteTab(pathname = window.location.pathname, hash = window.location.hash) {
  const normalizedHash = String(hash || "").toLowerCase();
  if (["#admin", "#settings-admin"].includes(normalizedHash) || normalizedHash === "#allocafi-ai-admin") return "admin";
  if (["#allocafi-ai", "#ai", "#settings-ai"].includes(normalizedHash)) return "settings";
  if (["#ledgercore", "#allocafi-ledgercore", "#settings-ledgercore"].includes(normalizedHash)) return "ledgercore";
  if (["#allocafi-connect", "#connect", "#settings-connect"].includes(normalizedHash)) return "allocafi-connect";
  if (["#pay", "#allocafi-pay", "#settings-pay"].includes(normalizedHash)) return canAccessAllocaFiPayModule() ? "pay" : null;
  const normalized = String(pathname || "").replace(/\/+$/, "") || "/";
  if (["/business", "/enterprise", "/enterprise/dashboard"].includes(normalized)) return "business";
  if (["/family", "/family/treasury"].includes(normalized)) return "family";
  return null;
}

function activateRouteTab() {
  const routeTab = getRouteTab();
  const normalizedHash = String(window.location.hash || "").toLowerCase();
  if (routeTab) {
    switchTab(routeTab);
  } else if (["#pay", "#allocafi-pay", "#settings-pay"].includes(normalizedHash) && !canAccessAllocaFiPayModule()) {
    window.history.replaceState({ tab: "overview" }, "", `${window.location.pathname}${window.location.search}`);
    switchTab("overview");
  }
}

function escapeHtml(value) {
  return String(value)
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

function formatCompactUsd(value) {
  const numericValue = Number(value) || 0;
  const absValue = Math.abs(numericValue);
  const sign = numericValue < 0 ? "-" : "";
  if (absValue >= 1_000_000_000_000) return `${sign}$${(absValue / 1_000_000_000_000).toFixed(2)}T`;
  if (absValue >= 1_000_000_000) return `${sign}$${(absValue / 1_000_000_000).toFixed(1)}B`;
  if (absValue >= 1_000_000) return `${sign}$${(absValue / 1_000_000).toFixed(1)}M`;
  if (absValue >= 1_000) return `${sign}$${(absValue / 1_000).toFixed(1)}K`;
  return formatUsd(numericValue);
}

function getMoneyFitClass(text) {
  const length = String(text || "").length;
  if (length >= 18) return "money-fit-xxs";
  if (length >= 15) return "money-fit-xs";
  if (length >= 13) return "money-fit-sm";
  if (length >= 11) return "money-fit-md";
  return "";
}

function renderMoneyValue(value, options = {}) {
  const fullValue = formatUsd(value);
  const compactAt = Number.isFinite(options.compactAt) ? Number(options.compactAt) : Infinity;
  const numericValue = Number(value) || 0;
  const displayValue = Math.abs(numericValue) >= compactAt ? formatCompactUsd(numericValue) : fullValue;
  const compactClass = displayValue !== fullValue ? "money-compact" : "";
  const className = [options.className || "", "money-value", getMoneyFitClass(displayValue), compactClass]
    .filter(Boolean)
    .join(" ");
  const label = options.label ? `${options.label}: ${fullValue}` : fullValue;
  return `<span class="${escapeHtml(className)}" title="${escapeHtml(fullValue)}" aria-label="${escapeHtml(label)}" data-full-value="${escapeHtml(fullValue)}">${escapeHtml(displayValue)}</span>`;
}

function formatBtc(value) {
  return `${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  })} BTC`;
}

function formatCrypto(value, asset) {
  return `${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  })} ${asset}`;
}

function cryptoToHexWei(amount, decimals) {
  const [wholePart, fractionPart = ""] = String(amount).trim().split(".");
  if (!/^\d+$/.test(wholePart || "0") || !/^\d*$/.test(fractionPart)) {
    throw new Error("Enter a valid amount");
  }

  const fraction = fractionPart.padEnd(decimals, "0").slice(0, decimals);
  const raw = BigInt(wholePart || "0") * (10n ** BigInt(decimals)) + BigInt(fraction || "0");
  if (raw <= 0n) throw new Error("Enter an amount greater than zero");
  return `0x${raw.toString(16)}`;
}

function tokenAmountToRaw(amount, decimals) {
  const [wholePart, fractionPart = ""] = String(amount).trim().split(".");
  if (!/^\d+$/.test(wholePart || "0") || !/^\d*$/.test(fractionPart)) {
    throw new Error("Enter a valid amount");
  }

  const fraction = fractionPart.padEnd(decimals, "0").slice(0, decimals);
  const raw = BigInt(wholePart || "0") * (10n ** BigInt(decimals)) + BigInt(fraction || "0");
  if (raw <= 0n) throw new Error("Enter an amount greater than zero");
  return raw;
}

function bytesToBase64(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

function bytesToText(bytes) {
  return new TextDecoder().decode(bytes);
}

function textToBytes(text) {
  return new TextEncoder().encode(text);
}

function byteSize(value) {
  return textToBytes(typeof value === "string" ? value : JSON.stringify(value)).byteLength;
}

function formatBytes(bytes) {
  const value = Number(bytes || 0);
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}

function formatBalance(wallet) {
  const network = NETWORKS[wallet.network];
  const balance = Number(wallet.balance ?? wallet.manualBalance ?? 0);
  if (network.kind === "bitcoin") return formatBtc(balance);
  if (["evm-native", "solana-native"].includes(network.kind)) return formatCrypto(balance, network.asset);
  return formatUsd(balance);
}

function getUsdValue(wallet) {
  const network = NETWORKS[wallet.network];
  const balance = Number(wallet.balance ?? wallet.manualBalance ?? 0);
  if (!network) return 0;
  if (["evm-usdc", "evm-stablecoin", "solana-token"].includes(network.kind)) return balance;
  const price = getNetworkCurrentPrice(network);
  return price ? balance * price : 0;
}

function formatUsdEstimate(wallet) {
  const network = NETWORKS[wallet.network];
  if (!network || ["evm-usdc", "evm-stablecoin", "solana-token"].includes(network.kind)) return "";
  const price = priceCache[network.priceId];
  if (!price) return "USD estimate unavailable";
  return `Approx. ${formatUsd(getUsdValue(wallet))}`;
}

function getSubaccountName(subaccount) {
  return typeof subaccount === "string" ? subaccount : subaccount?.name || "";
}

function getSubaccountRequired(subaccount) {
  return typeof subaccount === "string" ? 0 : Number(subaccount?.required || 0);
}

function getSubaccountDueDay(subaccount) {
  return typeof subaccount === "string" ? 0 : Number(subaccount?.dueDay || 0);
}

function getSubaccountDueMonth(subaccount) {
  const value = typeof subaccount === "string" ? "monthly" : String(subaccount?.dueMonth || "monthly");
  return value === "" ? "monthly" : value;
}

function normalizeSubaccounts(subaccounts = []) {
  return subaccounts.map((subaccount) => ({
    id: typeof subaccount === "string" ? crypto.randomUUID() : subaccount.id || crypto.randomUUID(),
    name: getSubaccountName(subaccount),
    required: getSubaccountRequired(subaccount),
    allocated: typeof subaccount === "string" ? 0 : Number(subaccount.allocated || 0),
    dueDay: getSubaccountDueDay(subaccount),
    dueMonth: getSubaccountDueMonth(subaccount),
  })).filter((subaccount) => subaccount.name);
}

function isBillsBucket(bucket) {
  return getBucketGroup(bucket?.name || "") === "Bills";
}

function getMonthlyBillTotal(bucket) {
  return normalizeSubaccounts(bucket?.subaccounts || [])
    .reduce((sum, subaccount) => sum + Number(subaccount.required || 0), 0);
}

function getLastDayOfMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getNextBillDueDate(bill, fromDate = new Date()) {
  const dueDay = Number(bill.dueDay || 0);
  if (dueDay <= 0) return null;

  const base = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const dueMonth = getSubaccountDueMonth(bill);
  const buildDate = (year, month) => new Date(year, month, Math.min(dueDay, getLastDayOfMonth(year, month)));

  if (dueMonth === "monthly") {
    let candidate = buildDate(base.getFullYear(), base.getMonth());
    if (candidate < base) candidate = buildDate(base.getFullYear(), base.getMonth() + 1);
    return candidate;
  }

  const monthNumber = Number(dueMonth);
  if (!Number.isInteger(monthNumber) || monthNumber < 0 || monthNumber > 11) return null;
  let candidate = buildDate(base.getFullYear(), monthNumber);
  if (candidate < base) candidate = buildDate(base.getFullYear() + 1, monthNumber);
  return candidate;
}

function getBillDueMeta(bill, fromDate = new Date()) {
  const dueDate = getNextBillDueDate(bill, fromDate);
  if (!dueDate) return null;
  const base = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const daysUntil = Math.round((dueDate - base) / 86_400_000);
  const dateLabel = dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return {
    dueDate,
    daysUntil,
    dateLabel,
    label: daysUntil === 0 ? "Due today" : daysUntil === 1 ? "Due tomorrow" : `Due in ${daysUntil} days`,
  };
}

function getBillDueText(bill) {
  const meta = getBillDueMeta(bill);
  return meta ? `${meta.dateLabel} ï¿½ ${meta.label}` : "No due date";
}

function getUpcomingBillItems() {
  const items = [];
  getSupportedWallets().forEach((wallet) => {
    (wallet.allocation?.buckets || []).forEach((bucket) => {
      if (!isBillsBucket(bucket)) return;
      normalizeSubaccounts(bucket.subaccounts || []).forEach((bill) => {
        const meta = getBillDueMeta(bill);
        if (!meta || meta.daysUntil > BILL_DUE_SOON_DAYS) return;
        items.push({
          type: "billDue",
          walletId: wallet.id,
          bucketId: bucket.id,
          bill,
          walletName: wallet.name,
          bucketName: bucket.name,
          ...meta,
        });
      });
    });
  });
  return items.sort((a, b) => a.daysUntil - b.daysUntil);
}

function getWalletDisplayValue(wallet) {
  return getUsdValue(wallet);
}

function getAllocationTotals(wallet) {
  const buckets = wallet.allocation?.buckets || [];
  const allocated = buckets.reduce((sum, bucket) => sum + Number(bucket.allocated || 0), 0);
  const spent = buckets.reduce((sum, bucket) => sum + Number(bucket.spent || 0), 0);
  const left = allocated - spent;
  const walletValue = getWalletDisplayValue(wallet);
  const unallocated = walletValue - left;
  return { allocated, spent, left, walletValue, unallocated };
}

function getWalletOverbalanceAmount(wallet) {
  if (!wallet?.allocation?.buckets?.length) return 0;
  const totals = getAllocationTotals(wallet);
  return Math.max(totals.left - totals.walletValue, 0);
}

function getWalletIntegrityIssues(wallet) {
  const issues = [];
  if (!wallet || !isSupportedNetworkKey(wallet.network)) return issues;
  if (isReserveAssetWallet(wallet)) return issues;

  const walletValue = getWalletDisplayValue(wallet);
  if (!Number.isFinite(walletValue) || walletValue < -BALANCE_AUDIT_TOLERANCE) {
    issues.push({
      type: "invalidWalletValue",
      severity: "high",
      action: "repair",
      title: `${wallet.name} balance needs review`,
      detail: "This wallet has an invalid display balance. Refresh the wallet, then repair safe account data if needed.",
      amount: 0,
    });
  }

  const buckets = wallet.allocation?.buckets || [];
  if (!buckets.length) {
    if (walletValue > BALANCE_AUDIT_TOLERANCE) {
      issues.push({
        type: "missingBuckets",
        severity: "info",
        action: "autoAllocate",
        title: `${wallet.name} is not allocated yet`,
        detail: `${formatUsd(walletValue)} is tracked. Create a template once and AllocaFi can manage future deposits automatically.`,
        amount: walletValue,
      });
    }
    return issues;
  }

  const totals = getAllocationTotals(wallet);
  const overbalance = Math.max(totals.left - totals.walletValue, 0);
  const unallocated = Math.max(totals.unallocated, 0);
  const pendingIncrease = Number(wallet.allocation?.pendingIncrease || 0);
  const pendingSpend = Number(wallet.allocation?.pendingSpend || 0);
  const isLiquidated = walletValue <= BALANCE_AUDIT_TOLERANCE;

  if (isLiquidated && totals.left > BALANCE_AUDIT_TOLERANCE) {
    issues.push({
      type: "liquidatedNeedsRebalance",
      severity: "high",
      action: "refresh",
      title: `${wallet.name} appears liquidated`,
      detail: `This wallet reads $0, but Virtual Budget Accounts still show ${formatUsd(totals.left)}. Refresh VBAs to $0 or remove the liquidated accounts.`,
      amount: totals.left,
    });
  } else if (isLiquidated && totals.left <= BALANCE_AUDIT_TOLERANCE) {
    if (wallet.allocation?.awaitingFunds) {
      if (wallet.statusType === "error") {
        const asset = NETWORKS[wallet.network]?.asset || "stablecoin";
        issues.push({
          type: "awaitingFunds",
          severity: "medium",
          action: "refreshWallet",
          title: `${wallet.name} balance check needs review`,
          detail: wallet.error || `AllocaFi could not confirm this ${asset} balance. Press Refresh after checking the wallet address and network.`,
          amount: 0,
        });
      }
    } else {
      issues.push({
        type: "liquidatedEmptyAccounts",
        severity: "info",
        action: "removeLiquidated",
        title: `${wallet.name} has empty VBAs`,
        detail: "This wallet and its Virtual Budget Accounts are at $0. Remove the empty budget accounts if this asset was fully liquidated.",
        amount: 0,
      });
    }
  }

  if (!isLiquidated && overbalance > BALANCE_AUDIT_TOLERANCE) {
    issues.push({
      type: "overbalance",
      severity: "high",
      action: "refresh",
      title: `${wallet.name} VBAs exceed wallet balance`,
      detail: `Virtual Budget Accounts are ${formatUsd(overbalance)} above the real wallet balance. Refresh VBAs to match the wallet.`,
      amount: overbalance,
    });
  }

  if (!isLiquidated && unallocated > BALANCE_AUDIT_TOLERANCE) {
    issues.push({
      type: "unallocated",
      severity: "medium",
      action: "allocate",
      title: `${wallet.name} has unallocated funds`,
      detail: `${formatUsd(unallocated)} is in the wallet but not assigned to Virtual Budget Accounts.`,
      amount: unallocated,
    });
  }

  if (pendingIncrease > unallocated + BALANCE_AUDIT_TOLERANCE || (pendingIncrease > BALANCE_AUDIT_TOLERANCE && overbalance > BALANCE_AUDIT_TOLERANCE)) {
    issues.push({
      type: "stalePendingIncrease",
      severity: "high",
      action: "repair",
      title: `${wallet.name} has stale new-funds data`,
      detail: "A previous new-funds task no longer matches the current wallet balance. Repair safe issues to prevent double allocation.",
      amount: pendingIncrease,
    });
  }

  if (pendingSpend > BALANCE_AUDIT_TOLERANCE) {
    issues.push({
      type: "pendingSpend",
      severity: "medium",
      action: "assignSpend",
      title: `${wallet.name} has unassigned spending`,
      detail: `${formatUsd(pendingSpend)} needs a budget account or personal liquidation rebalance.`,
      amount: pendingSpend,
    });
  }

  const bucketNames = new Map();
  buckets.forEach((bucket) => {
    const allocated = Number(bucket.allocated || 0);
    const spent = Number(bucket.spent || 0);
    const percent = Number(bucket.percent || 0);
    const nameKey = String(bucket.name || "").trim().toLowerCase();

    if (!String(bucket.name || "").trim()) {
      issues.push({
        type: "missingBucketName",
        severity: "medium",
        action: "repair",
        bucketId: bucket.id,
        title: "Budget account name missing",
        detail: `${wallet.name} has a Virtual Budget Account without a name.`,
        amount: 0,
      });
    } else if (bucketNames.has(nameKey)) {
      issues.push({
        type: "duplicateBucketName",
        severity: "info",
        action: "review",
        bucketId: bucket.id,
        title: `${bucket.name} appears more than once`,
        detail: `${wallet.name} has duplicate budget account names for the same asset. This can make sends and spending review confusing.`,
        amount: 0,
      });
    } else {
      bucketNames.set(nameKey, bucket.id);
    }

    if (!Number.isFinite(allocated) || !Number.isFinite(spent) || allocated < -BALANCE_AUDIT_TOLERANCE || spent < -BALANCE_AUDIT_TOLERANCE) {
      issues.push({
        type: "invalidBucketNumbers",
        severity: "high",
        action: "repair",
        bucketId: bucket.id,
        title: `${bucket.name || "Budget Account"} has invalid numbers`,
        detail: "This budget account has a negative or invalid allocation/spending value. Repair safe issues will clamp it back to a usable value.",
        amount: Math.max(Math.abs(allocated || 0), Math.abs(spent || 0)),
      });
    }

    if (spent > allocated + BALANCE_AUDIT_TOLERANCE) {
      issues.push({
        type: "overspentBucket",
        severity: "high",
        action: "repair",
        bucketId: bucket.id,
        title: `${bucket.name} is overspent`,
        detail: `${bucket.name} spent ${formatUsd(spent)} against ${formatUsd(allocated)} allocated. Repair safe issues will mark it empty instead of letting it go negative.`,
        amount: spent - allocated,
      });
    }

    if (!Number.isFinite(percent) || percent < 0) {
      issues.push({
        type: "invalidPercent",
        severity: "medium",
        action: "repair",
        bucketId: bucket.id,
        title: `${bucket.name} has an invalid template share`,
        detail: "This budget account has a negative or invalid allocation percentage.",
        amount: 0,
      });
    }
  });

  return issues;
}

function getBalanceIntegritySummary() {
  const issues = getBudgetWallets().flatMap((wallet) =>
    getWalletIntegrityIssues(wallet).map((issue) => ({ ...issue, walletId: wallet.id, walletName: wallet.name }))
  );
  const highCount = issues.filter((issue) => issue.severity === "high").length;
  const mediumCount = issues.filter((issue) => issue.severity === "medium").length;
  const score = Math.max(0, 100 - highCount * 18 - mediumCount * 9 - Math.max(issues.length - highCount - mediumCount, 0) * 4);
  return { issues, highCount, mediumCount, score };
}

function repairWalletData(walletId) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet?.allocation?.buckets?.length) return false;

  let changed = false;
  wallet.allocation.buckets.forEach((bucket, index) => {
    if (!String(bucket.name || "").trim()) {
      bucket.name = `Budget Account ${index + 1}`;
      changed = true;
    }
    const allocated = Number(bucket.allocated || 0);
    const spent = Number(bucket.spent || 0);
    const percent = Number(bucket.percent || 0);
    if (!Number.isFinite(allocated) || allocated < 0) {
      bucket.allocated = 0;
      changed = true;
    }
    if (!Number.isFinite(spent) || spent < 0) {
      bucket.spent = 0;
      changed = true;
    }
    if (Number(bucket.spent || 0) > Number(bucket.allocated || 0)) {
      bucket.spent = Number(bucket.allocated || 0);
      changed = true;
    }
    if (!Number.isFinite(percent) || percent < 0) {
      bucket.percent = 0;
      changed = true;
    }
  });

  if (getWalletOverbalanceAmount(wallet) > BALANCE_AUDIT_TOLERANCE) {
    rebalanceWalletBucketsToCurrentBalance(wallet);
    changed = true;
  } else {
    const assignable = Math.max(getAllocationTotals(wallet).unallocated, 0);
    const pendingIncrease = Number(wallet.allocation.pendingIncrease || 0);
    const nextPendingIncrease = pendingIncrease > BALANCE_AUDIT_TOLERANCE
      ? Math.min(pendingIncrease, assignable)
      : 0;
    if (Math.abs(nextPendingIncrease - pendingIncrease) > BALANCE_AUDIT_TOLERANCE) {
      wallet.allocation.pendingIncrease = nextPendingIncrease;
      changed = true;
    }
  }

  if (!Number.isFinite(Number(wallet.allocation.pendingSpend || 0)) || Number(wallet.allocation.pendingSpend || 0) < 0) {
    wallet.allocation.pendingSpend = 0;
    changed = true;
  }

  if (changed) {
    wallet.allocation.updatedAt = new Date().toISOString();
    wallet.allocation.lastAuditAt = new Date().toISOString();
  }
  return changed;
}

function repairWalletDataWithConfirmation(walletId) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet) return;
  const issues = getWalletIntegrityIssues(wallet);
  if (!issues.length) {
    showToast("Data check passed");
    return;
  }
  const willRebalance = getWalletOverbalanceAmount(wallet) > BALANCE_AUDIT_TOLERANCE;
  const message = willRebalance
    ? `Repair safe issues for ${wallet.name}? This will refresh VBAs to the current wallet balance and clean up stale/invalid local numbers.`
    : `Repair safe issues for ${wallet.name}? This cleans up stale or invalid local numbers without moving funds.`;
  if (!window.confirm(message)) return;
  const changed = repairWalletData(walletId);
  if (changed) {
    saveWallets();
    render();
    showToast("Balance data repaired");
  } else {
    showToast("No repair needed");
  }
}

function removeLiquidatedAccountsWithConfirmation(walletId) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet?.allocation?.buckets?.length) {
    showToast("No Virtual Budget Accounts to remove");
    return;
  }
  const walletValue = getWalletDisplayValue(wallet);
  if (walletValue > BALANCE_AUDIT_TOLERANCE) {
    showToast("Wallet still has a balance. Refresh VBAs instead.");
    return;
  }
  const bucketCount = wallet.allocation.buckets.length;
  if (!window.confirm(`Remove ${bucketCount} empty Virtual Budget Account${bucketCount === 1 ? "" : "s"} from ${wallet.name}? The wallet address stays saved, and no crypto moves.`)) return;

  const transactions = wallet.allocation.transactions || [];
  transactions.unshift({
    id: crypto.randomUUID(),
    type: "liquidated-vbas-removed",
    bucketName: "Liquidated accounts removed",
    amount: 0,
    note: "Removed empty Virtual Budget Accounts after wallet reached $0.",
    createdAt: new Date().toISOString(),
  });

  wallet.allocation = {
    buckets: [],
    transactions,
    pendingIncrease: 0,
    pendingSpend: 0,
    moneyIn: 0,
    lastValue: 0,
    updatedAt: new Date().toISOString(),
    liquidatedAt: new Date().toISOString(),
  };
  saveWallets();
  render();
  showToast("Empty Virtual Budget Accounts removed");
}

function getWalletBalanceTaskCount(wallet) {
  if (isReserveAssetWallet(wallet)) return 0;
  return getWalletIntegrityIssues(wallet).length;
}

function getWalletAssignableAmount(wallet) {
  if (!wallet || isReserveAssetWallet(wallet)) return 0;
  const walletValue = Math.max(getWalletDisplayValue(wallet), 0);
  if (!wallet.allocation?.buckets?.length) return walletValue;
  const totals = getAllocationTotals(wallet);
  const unallocated = Math.max(totals.unallocated, 0);
  const pendingIncrease = Number(wallet.allocation.pendingIncrease || 0);
  if (pendingIncrease > 0.01) return Math.min(pendingIncrease, unallocated);
  return unallocated;
}

function clampWalletPendingIncrease(wallet) {
  if (!wallet.allocation?.buckets?.length) return;
  const pendingIncrease = Number(wallet.allocation.pendingIncrease || 0);
  if (pendingIncrease <= 0) return;
  const assignable = getWalletAssignableAmount(wallet);
  wallet.allocation.pendingIncrease = assignable > 0.01 ? assignable : 0;
}

function getBucketBalance(bucket) {
  return Math.max(Number(bucket.allocated || 0) - Number(bucket.spent || 0), 0);
}

function getBucketFundingTarget(bucket) {
  const rules = bucket.rules || {};
  if (isBillsBucket(bucket)) {
    const monthlyTotal = getMonthlyBillTotal(bucket);
    if (monthlyTotal > 0) return monthlyTotal / 4;
  }
  return Number(rules.refill || rules.minimum || 0);
}

function getNewFundsAllocationWeight(bucket) {
  const baseWeight = Math.max(Number(bucket.percent || 0), 0);
  const target = getBucketFundingTarget(bucket);
  if (target > 0 && getBucketBalance(bucket) >= target) {
    return baseWeight * FUNDED_TARGET_WEIGHT_MULTIPLIER;
  }
  return baseWeight;
}

function getAiAssistedAllocationWeight(bucket) {
  const baseWeight = getNewFundsAllocationWeight(bucket);
  const normalizedName = String(bucket?.name || "").toLowerCase();
  const group = getBucketGroup(bucket?.name || "");
  let multiplier = 1;
  if (group === "Bills") multiplier += 0.35;
  if (["Food", "Gas", "Transportation", "Medical"].some((keyword) => normalizedName.includes(keyword.toLowerCase()))) multiplier += 0.2;
  if (normalizedName.includes("emergency")) multiplier += 0.3;
  if (normalizedName.includes("savings") || normalizedName.includes("fund")) multiplier += 0.15;
  if (getBucketFundingTarget(bucket) > getBucketBalance(bucket)) multiplier += 0.25;
  return Math.max(baseWeight * multiplier, baseWeight > 0 ? 0.1 : 0);
}

function getAutoAllocationWeight(bucket, allocationMode = "rules") {
  return allocationMode === "ai"
    ? getAiAssistedAllocationWeight(bucket)
    : getNewFundsAllocationWeight(bucket);
}

function createAutoAllocationBucketsFromTemplate(templateBuckets, baseAmount = 0, allocationMode = "rules") {
  if (allocationMode !== "ai") return createAllocationBucketsFromTemplate(templateBuckets, baseAmount);
  const weightedBuckets = templateBuckets.map((bucket) => ({
    ...bucket,
    _autoWeight: getAiAssistedAllocationWeight({ ...bucket, allocated: 0, spent: 0 }),
  }));
  const totalWeight = weightedBuckets.reduce((sum, bucket) => sum + Number(bucket._autoWeight || 0), 0) || weightedBuckets.length || 1;
  let usedPercent = 0;
  const adjustedBuckets = weightedBuckets.map((bucket, index) => {
    const percent = index === weightedBuckets.length - 1
      ? Math.max(100 - usedPercent, 0)
      : Number(((Number(bucket._autoWeight || 0) / totalWeight) * 100).toFixed(1));
    usedPercent += percent;
    const { _autoWeight, ...cleanBucket } = bucket;
    return { ...cleanBucket, percent: Number(percent.toFixed(1)) };
  });
  return createAllocationBucketsFromTemplate(adjustedBuckets, baseAmount);
}

function getReadyToAssign() {
  return getSupportedWallets().reduce((sum, wallet) => {
    return sum + getWalletAssignableAmount(wallet);
  }, 0);
}

function getMonthlyDashboard() {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const summary = getSupportedWallets().reduce((totals, wallet) => {
    const walletValue = getUsdValue(wallet);
    totals.trackedValue += walletValue;
    if (isReserveAssetWallet(wallet)) return totals;
    const allocation = wallet.allocation;
    const allocationTotals = allocation?.buckets?.length ? getAllocationTotals(wallet) : null;
    totals.walletBalance += walletValue;
    totals.bucketLeft += allocationTotals?.left || 0;
    totals.allocated += allocationTotals?.allocated || 0;
    const pendingIncrease = wallet.allocation?.buckets?.length ? getWalletAssignableAmount(wallet) : 0;
    totals.pendingIncrease += pendingIncrease;
    totals.moneyIn += pendingIncrease;
    totals.pendingSpend += Number(allocation?.pendingSpend || 0);
    totals.moneyOut += Number(allocation?.pendingSpend || 0);
    totals.bucketCount += allocation?.buckets?.length || 0;

    (allocation?.buckets || []).forEach((bucket) => {
      const allocated = Number(bucket.allocated || 0);
      const left = allocated - Number(bucket.spent || 0);
      const rules = bucket.rules || {};
      if (allocated > 0 && left / allocated <= 0.15) {
        totals.lowBuckets.push(`${wallet.name}: ${bucket.name} balance is ${formatUsd(Math.max(left, 0))}`);
      }
      if (Number(rules.minimum || 0) > 0 && left < Number(rules.minimum)) {
        totals.ruleAlerts.push(`${bucket.name} is below its minimum by ${formatUsd(Number(rules.minimum) - left)}`);
      }
      if (Number(rules.warning || 0) > 0 && left <= Number(rules.warning)) {
        totals.ruleAlerts.push(`${bucket.name} is at or below warning level`);
      }
      if (Number(rules.refill || 0) > 0 && left < Number(rules.refill)) {
        totals.ruleAlerts.push(`${bucket.name} needs ${formatUsd(Number(rules.refill) - left)} to hit refill target`);
      }
      if (rules.protected && Number(bucket.spent || 0) > 0) {
        totals.ruleAlerts.push(`${bucket.name} is protected and has recorded spending`);
      }
    });

    (allocation?.transactions || []).forEach((tx) => {
      if (tx.createdAt?.startsWith(monthKey)) {
        const amount = Number(tx.amount || 0);
        const flowDirection = getTransactionFlowDirection(tx);
        if (flowDirection === "out") {
          totals.monthSpending += amount;
          totals.moneyOut += amount;
        } else if (flowDirection === "in") {
          totals.moneyIn += amount;
        }
      }
    });
    return totals;
  }, {
    monthLabel,
    trackedValue: 0,
    walletBalance: 0,
    bucketLeft: 0,
    allocated: 0,
    pendingIncrease: 0,
    pendingSpend: 0,
    moneyIn: 0,
    moneyOut: 0,
    monthSpending: 0,
    bucketCount: 0,
    lowBuckets: [],
    ruleAlerts: [],
  });

  return summary;
}

function getDashboardSummary() {
  return getMonthlyDashboard();
}

function getDashboardDetails(dashboard = getDashboardSummary()) {
  const bucketRows = [];
  const categoryMap = {};
  const spendingRows = [];
  const billRows = [];
  const stablecoinMap = {};
  let stablecoinTotal = 0;
  let nativeTotal = 0;
  let billsAllocated = 0;
  let billsSpent = 0;
  let billsBalance = 0;
  let billsRequired = 0;
  let cashflowBalance = 0;
  let cashflowSpent = 0;

  getSupportedWallets().forEach((wallet) => {
    const network = NETWORKS[wallet.network];
    const value = getUsdValue(wallet);
    if (isReserveAssetWallet(wallet)) {
      nativeTotal += value;
      return;
    }
    if (isStablecoinBudgetNetwork(network)) {
      stablecoinMap[network.asset] = (stablecoinMap[network.asset] || 0) + value;
      stablecoinTotal += value;
    } else {
      nativeTotal += value;
    }

    (wallet.allocation?.buckets || []).forEach((bucket) => {
      const allocated = Number(bucket.allocated || 0);
      const spent = Number(bucket.spent || 0);
      const left = Math.max(allocated - spent, 0);
      const group = getBucketGroup(bucket.name);
      categoryMap[group] = (categoryMap[group] || 0) + spent;
      bucketRows.push({ wallet, bucket, allocated, spent, left, group });
      if (spent > 0) {
        spendingRows.push({ wallet, bucket, group, spent, left });
      }
      if (group === "Available Cashflow") {
        cashflowBalance += left;
        cashflowSpent += spent;
      }
      if (group === "Bills") {
        billsAllocated += allocated;
        billsSpent += spent;
        billsBalance += left;
        normalizeSubaccounts(bucket.subaccounts || []).forEach((bill) => {
          const required = Number(bill.required || 0);
          const due = getBillDueMeta(bill);
          billsRequired += required;
          billRows.push({
            wallet,
            bucket,
            bill,
            required,
            dueLabel: due?.dateLabel || "No due date",
            dueSoonLabel: due?.label || "",
            dueSort: Number.isFinite(due?.daysUntil) ? due.daysUntil : 999,
          });
        });
      }
    });
  });

  const goalTotal = goals.reduce((sum, goal) => sum + Number(goal.target || 0), 0);
  const goalCurrent = goals.reduce((sum, goal) => sum + Number(goal.current || 0), 0);
  const allocationCoverage = dashboard.walletBalance > 0 ? Math.min((dashboard.allocated / dashboard.walletBalance) * 100, 100) : 0;
  const savingsBuckets = bucketRows.filter((row) => row.group === "Savings" || row.group === "Goals");
  const savingsLeft = savingsBuckets.reduce((sum, row) => sum + row.left, 0);
  const savingsRate = dashboard.walletBalance > 0 ? Math.min((savingsLeft / dashboard.walletBalance) * 100, 100) : 0;
  const lowBucketPenalty = Math.min((dashboard.lowBuckets.length + dashboard.ruleAlerts.length) * 8, 32);
  const healthScore = Math.max(Math.round(40 + allocationCoverage * 0.35 + savingsRate * 0.25 - lowBucketPenalty), wallets.length ? 10 : 0);

  const insights = [];
  const upcomingBills = getUpcomingBillItems();
  if (dashboard.pendingIncrease > 0.01) insights.push(`Allocate ${formatUsd(dashboard.pendingIncrease)} of new funds into your budget accounts.`);
  if (dashboard.pendingSpend > 0.01) insights.push(`Assign ${formatUsd(dashboard.pendingSpend)} of spending so your budget account balances stay accurate.`);
  if (upcomingBills.length) {
    const bill = upcomingBills[0];
    insights.push(`${bill.bill.name} is ${bill.label.toLowerCase()}${Number(bill.bill.required || 0) > 0 ? ` for ${formatUsd(bill.bill.required)}` : ""}.`);
  }
  if (dashboard.lowBuckets.length) insights.push(dashboard.lowBuckets[0]);
  if (billsBalance && billsRequired && billsBalance < billsRequired) insights.push(`Bills are short by ${formatUsd(billsRequired - billsBalance)} against required monthly amounts.`);
  const supportedWalletCount = getSupportedWallets().length;
  if (!insights.length && supportedWalletCount) insights.push("Your account view is organized. Keep categorizing spending to improve monthly insights.");
  if (!supportedWalletCount) insights.push("Add a supported wallet to activate your AllocaFi financial overview.");

  return {
    bucketRows: bucketRows.sort((a, b) => b.left - a.left),
    categories: Object.entries(categoryMap).sort((a, b) => b[1] - a[1]),
    spendingRows: spendingRows.sort((a, b) => b.spent - a.spent),
    billRows: billRows.sort((a, b) => a.dueSort - b.dueSort || b.required - a.required),
    stablecoins: Object.entries(stablecoinMap).sort((a, b) => b[1] - a[1]),
    stablecoinTotal,
    nativeTotal,
    billsAllocated,
    billsSpent,
    billsBalance,
    billsRequired,
    cashflowBalance,
    cashflowSpent,
    goalCurrent,
    goalTotal,
    healthScore,
    insights: insights.slice(0, 4),
  };
}

function getStablecoinStatus(coin) {
  if (coin.stability < 99.4 || coin.liquidity < 50) return { key: "critical", label: "Critical", signal: "Review before large moves" };
  if (coin.stability < 99.7 || coin.liquidity < 65) return { key: "caution", label: "Caution", signal: "Activity elevated" };
  if (coin.stability < 99.9 || coin.liquidity < 75) return { key: "watch", label: "Watch", signal: "Monitor" };
  return { key: "healthy", label: "Healthy", signal: "Low volatility" };
}

function getLiquidityStrength(score) {
  if (score >= 90) return "Deep";
  if (score >= 78) return "Strong";
  if (score >= 65) return "Moderate";
  return "Thin";
}

function getStablecoinLiquiditySnapshot(range = stablecoinLiquidityRange) {
  const activeRange = STABLECOIN_LIQUIDITY_RANGES.includes(range) ? range : "24H";
  const rangeScale = { "24H": 1, "7D": 1.04, "30D": 1.08, "1Y": 1.16 }[activeRange] || 1;
  const coins = Object.entries(STABLECOIN_MARKET_BASE).map(([symbol, base]) => {
    const coin = {
      symbol,
      marketCap: base.marketCap * rangeScale,
      volume24h: base.volume24h * (activeRange === "24H" ? 1 : activeRange === "7D" ? 1.08 : activeRange === "30D" ? 0.96 : 1.22),
      liquidity: Math.min(base.liquidity + (activeRange === "1Y" ? 2 : activeRange === "30D" ? 1 : 0), 99),
      stability: Math.min(base.stability + (activeRange === "24H" ? 0 : 0.01), 99.99),
      change: base.change * (activeRange === "1Y" ? 6 : activeRange === "30D" ? 2.2 : activeRange === "7D" ? 1.4 : 1),
    };
    const status = getStablecoinStatus(coin);
    return {
      ...coin,
      status,
      liquidityStrength: getLiquidityStrength(coin.liquidity),
    };
  });
  const series = STABLECOIN_MARKET_SERIES[activeRange] || STABLECOIN_MARKET_SERIES["24H"];
  const averageLiquidity = Math.round(coins.reduce((sum, coin) => sum + coin.liquidity, 0) / coins.length);
  return {
    range: activeRange,
    coins,
    series,
    averageLiquidity,
    source: "mock-market-data-api-ready",
  };
}

function getStablecoinRiskSummary(snapshot) {
  const order = { healthy: 0, watch: 1, caution: 2, critical: 3 };
  const strongest = snapshot.coins.reduce((current, coin) =>
    order[coin.status.key] > order[current.status.key] ? coin : current
  , snapshot.coins[0]);
  if (!strongest) return { key: "healthy", label: "Normal", message: "Stablecoin market activity is within normal ranges." };
  if (strongest.status.key === "critical") {
    return { key: "critical", label: "Critical", message: "Market movement is elevated. Review liquidity before large transfers." };
  }
  if (strongest.status.key === "caution") {
    return { key: "caution", label: "Caution", message: `${strongest.symbol} activity is elevated compared with its normal range.` };
  }
  if (strongest.status.key === "watch") {
    return { key: "watch", label: "Watch", message: `${strongest.symbol} liquidity is steady with a monitor signal active.` };
  }
  return { key: "healthy", label: "Normal", message: "Stablecoin liquidity is healthy across tracked markets." };
}

function getStablecoinLiquidityInsight(snapshot) {
  const risk = getStablecoinRiskSummary(snapshot);
  if (risk.key !== "healthy") return risk.message;
  if (snapshot.range === "7D") return "PYUSD adoption activity is trending higher while USDC and USDT liquidity remain deep.";
  if (snapshot.range === "30D") return "Stablecoin markets currently show low volatility across the AllocaFi supported set.";
  if (snapshot.range === "1Y") return "Longer term stablecoin liquidity depth continues to support self-custody spending workflows.";
  return "USDC liquidity remains strong across major venues while PYUSD and USDT activity stays stable.";
}

function getLiquidityChartBounds(values, marginRatio = 0.22) {
  const numericValues = (values || []).map(Number).filter(Number.isFinite);
  if (!numericValues.length) return { min: 0, max: 100 };
  const rawMin = Math.min(...numericValues);
  const rawMax = Math.max(...numericValues);
  const spread = Math.max(rawMax - rawMin, Math.abs(rawMax) * 0.04, 1);
  const min = rawMin - spread * marginRatio;
  const max = rawMax + spread * marginRatio;
  if (max <= min) return { min: rawMin - 1, max: rawMax + 1 };
  return { min, max };
}

function buildLiquidityChartPath(values, width = 280, height = 86, padding = 8, bounds = getLiquidityChartBounds(values), verticalPadding = padding) {
  if (!values?.length) return "";
  const xPadding = Math.max(Number(padding) || 0, 0);
  const yPadding = Math.max(Number(verticalPadding) || 0, 0);
  const range = Math.max(bounds.max - bounds.min, 1);
  return values.map((value, index) => {
    const x = xPadding + (index / Math.max(values.length - 1, 1)) * (width - xPadding * 2);
    const normalized = (Number(value) - bounds.min) / range;
    const y = height - yPadding - Math.max(Math.min(normalized, 1), 0) * (height - yPadding * 2);
    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
}

function buildLiquidityAreaPath(values, width = 280, height = 86, padding = 8, bounds = getLiquidityChartBounds(values), verticalPadding = padding) {
  const line = buildLiquidityChartPath(values, width, height, padding, bounds, verticalPadding);
  if (!line) return "";
  const xPadding = Math.max(Number(padding) || 0, 0);
  const yPadding = Math.max(Number(verticalPadding) || 0, 0);
  const endX = width - xPadding;
  const bottomY = height - yPadding;
  return `${line} L ${endX} ${bottomY} L ${xPadding} ${bottomY} Z`;
}

function renderStablecoinLiquidityMonitor(details = {}) {
  const snapshot = getStablecoinLiquiditySnapshot();
  const risk = getStablecoinRiskSummary(snapshot);
  const holdings = Object.fromEntries(details.stablecoins || []);
  const coinRows = snapshot.coins.map((coin) => ({
    ...coin,
    meta: getStablecoinDisplayMeta(coin.symbol),
    walletBalance: Math.max(Number(holdings[coin.symbol] || 0), 0),
  }));
  const chartWidth = 420;
  const chartHeight = 176;
  const chartXPadding = 0;
  const chartYPadding = 6;
  const chartBounds = getLiquidityChartBounds([
    ...snapshot.series.liquidity,
    ...snapshot.series.volume,
    ...snapshot.series.stability
  ], 0.035);
  const liquidityPath = buildLiquidityChartPath(snapshot.series.liquidity, chartWidth, chartHeight, chartXPadding, chartBounds, chartYPadding);
  const volumePath = buildLiquidityChartPath(snapshot.series.volume, chartWidth, chartHeight, chartXPadding, chartBounds, chartYPadding);
  const stabilityPath = buildLiquidityChartPath(snapshot.series.stability, chartWidth, chartHeight, chartXPadding, chartBounds, chartYPadding);
  const areaPath = buildLiquidityAreaPath(snapshot.series.liquidity, chartWidth, chartHeight, chartXPadding, chartBounds, chartYPadding);
  const insight = getStablecoinLiquidityInsight(snapshot);
  const statusCount = coinRows.filter((coin) => coin.status.key === "healthy").length;

  return `
    <div class="overview-card liquidity-monitor-card risk-${escapeHtml(risk.key)}">
      <div class="liquidity-monitor-head">
        <div>
          <h3>Stablecoin Liquidity Monitor</h3>
          <span>Real-time liquidity, volume, and stability tracking</span>
        </div>
        <span class="live-market-pill"><i></i> Live</span>
      </div>
      <div class="liquidity-range-tabs" aria-label="Stablecoin liquidity time range">
        ${STABLECOIN_LIQUIDITY_RANGES.map((range) => `
          <button class="liquidity-range-button ${range === snapshot.range ? "active" : ""}" data-liquidity-range="${range}" type="button">${range}</button>
        `).join("")}
      </div>
      <div class="liquidity-chart-wrap">
        <svg class="liquidity-chart" viewBox="0 0 420 176" role="img" aria-label="Stablecoin liquidity, volume, and stability chart">
          <defs>
            <linearGradient id="liquidityAreaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="rgba(255, 63, 175, 0.35)" />
              <stop offset="55%" stop-color="rgba(23, 103, 255, 0.18)" />
              <stop offset="100%" stop-color="rgba(32, 240, 208, 0.02)" />
            </linearGradient>
          </defs>
          <path class="liquidity-grid-line" d="M0 24 H420 M0 62 H420 M0 100 H420 M0 138 H420 M0 170 H420"></path>
          <path class="liquidity-area" d="${areaPath}"></path>
          <path class="liquidity-line liquidity-main" d="${liquidityPath}"></path>
          <path class="liquidity-line liquidity-volume" d="${volumePath}"></path>
          <path class="liquidity-line liquidity-stability" d="${stabilityPath}"></path>
        </svg>
        <div class="liquidity-chart-legend">
          <span><i class="legend-liquidity"></i>Liquidity</span>
          <span><i class="legend-volume"></i>Volume</span>
          <span><i class="legend-stability"></i>Stability</span>
        </div>
      </div>
      <div class="liquidity-risk-strip ${escapeHtml(risk.key)}">
        <span>${escapeHtml(risk.label)}</span>
        <strong>${escapeHtml(risk.message)}</strong>
      </div>
      <div class="stablecoin-mini-grid">
        ${coinRows.map((coin) => `
          <article class="stablecoin-mini-card ${escapeHtml(coin.status.key)}">
            <div class="stablecoin-mini-head">
              <span class="stablecoin-mini-logo">${renderStablecoinLogo(coin.symbol, coin.symbol, { className: "liquidity-coin-logo" })}</span>
              <div>
                <strong>${escapeHtml(coin.symbol)}</strong>
                <small>${escapeHtml(coin.meta.name)}</small>
                <span class="stablecoin-status-line"><i></i>${escapeHtml(coin.status.label)}</span>
              </div>
              <em>${coin.change >= 0 ? "+" : ""}${coin.change.toFixed(2)}%</em>
            </div>
            <div class="stablecoin-mini-balance">
              <span>Wallet balance</span>
              <strong>${renderMoneyValue(coin.walletBalance, { compactAt: 1_000_000, label: `${coin.symbol} wallet balance` })}</strong>
            </div>
            <div class="stablecoin-metrics-grid">
              <span>Market Cap<strong>${formatCompactUsd(coin.marketCap)}</strong></span>
              <span>Liquidity<strong>${escapeHtml(coin.liquidityStrength)}</strong></span>
              <span>24H Volume<strong>${formatCompactUsd(coin.volume24h)}</strong></span>
              <span>Stability<strong>${coin.stability.toFixed(2)}%</strong></span>
            </div>
          </article>
        `).join("")}
      </div>
      <div class="liquidity-ai-insight">
        <span>AI Market Note</span>
        <strong>${escapeHtml(insight)}</strong>
      </div>
      <p class="liquidity-source-note">${statusCount}/${coinRows.length} healthy - API-ready for CoinGecko, DefiLlama, CoinMarketCap, and on-chain analytics.</p>
    </div>
  `;
}

function getVbaAccentClass(name, index) {
  const normalized = String(name || "").toLowerCase();
  if (normalized.includes("bill") || normalized.includes("rent") || normalized.includes("mortgage")) return "green";
  if (normalized.includes("food") || normalized.includes("grocery")) return "orange";
  if (normalized.includes("saving") || normalized.includes("emergency") || normalized.includes("reserve")) return "cyan";
  if (normalized.includes("gas") || normalized.includes("transport") || normalized.includes("car")) return "green";
  if (normalized.includes("free") || normalized.includes("personal")) return "pink";
  if (normalized.includes("invest")) return "cyan";
  if (normalized.includes("family") || normalized.includes("child")) return "pink";
  if (normalized.includes("travel") || normalized.includes("vacation")) return "teal";
  return ["violet", "blue", "cyan", "pink", "green"][index % 5];
}


function renderBudgetAccountIcon(name) {
  const normalized = String(name || "").toLowerCase();
  let key = "default";
  if (normalized.includes("bill") || normalized.includes("rent") || normalized.includes("mortgage")) key = "bills";
  else if (normalized.includes("house") || normalized.includes("home")) key = "housing";
  else if (normalized.includes("food") || normalized.includes("grocery") || normalized.includes("meal")) key = "food";
  else if (normalized.includes("emergency") || normalized.includes("reserve")) key = "emergency";
  else if (normalized.includes("saving") || normalized.includes("vault")) key = "savings";
  else if (normalized.includes("develop") || normalized.includes("allocafi") || normalized.includes("tech")) key = "development";
  else if (normalized.includes("child") || normalized.includes("kid") || normalized.includes("school")) key = "child";
  else if (normalized.includes("cloth") || normalized.includes("apparel")) key = "clothing";
  else if (normalized.includes("groom") || normalized.includes("personal care")) key = "grooming";
  else if (normalized.includes("travel") || normalized.includes("vacation")) key = "travel";
  else if (normalized.includes("gas") || normalized.includes("car") || normalized.includes("auto") || normalized.includes("transport")) key = "transportation";
  else if (normalized.includes("medical") || normalized.includes("health")) key = "medical";

  const icons = {
    food: '<svg class="overview-icon-svg budget-account-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v8"/><path d="M5 3v4.5A2.5 2.5 0 0 0 7.5 10 2.5 2.5 0 0 0 10 7.5V3"/><path d="M7.5 10v11"/><path d="M16.5 3v18"/><path d="M16.5 3c2.2 1.5 3.5 3.8 3.5 6.8V12h-3.5"/></svg>',
    clothing: '<svg class="overview-icon-svg budget-account-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4 5 6.5v4L8 9v11h8V9l3 1.5v-4L16 4"/><path d="M9.5 4c.5 1.3 1.3 2 2.5 2s2-.7 2.5-2"/></svg>',
    child: '<svg class="overview-icon-svg budget-account-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 8 4-8 4-8-4 8-4Z"/><path d="M6.5 10.5V15c1.6 1.4 3.4 2 5.5 2s3.9-.6 5.5-2v-4.5"/><path d="M20 8v5"/></svg>',
    development: '<svg class="overview-icon-svg budget-account-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 5-4 14"/></svg>',
    grooming: '<svg class="overview-icon-svg budget-account-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="6.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="16.5" r="2.5"/><path d="M9 9.5 19 19"/><path d="M9 14.5 19 5"/></svg>',
    travel: '<svg class="overview-icon-svg budget-account-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18"/><path d="m13 5 7 7-7 7"/><path d="M8 7l4 5-4 5"/></svg>',
    medical: '<svg class="overview-icon-svg budget-account-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/><rect x="4" y="4" width="16" height="16" rx="4"/></svg>',
  };
  const fallback = {
    bills: "bills",
    housing: "housing",
    emergency: "stableCheck",
    savings: "stableCheck",
    transportation: "car",
    default: "accounts",
  };
  const labels = {
    bills: "Bills budget account",
    housing: "Housing budget account",
    food: "Food budget account",
    emergency: "Emergency budget account",
    savings: "Savings budget account",
    development: "Development budget account",
    child: "Child expenses budget account",
    clothing: "Clothing budget account",
    grooming: "Grooming budget account",
    travel: "Travel budget account",
    transportation: "Transportation budget account",
    medical: "Medical budget account",
    default: "Budget account",
  };
  const icon = icons[key] || renderOverviewPanelIcon(fallback[key] || fallback.default);
  return '<span class="vba-icon" aria-label="' + escapeHtml(labels[key] || labels.default) + '">' + icon + '</span>';
}

function renderVirtualBucketAccountSummary(details, dashboard) {
  const rows = [...(details.bucketRows || [])]
    .sort((a, b) => Number(b.left || 0) - Number(a.left || 0));
  const totalAvailable = Math.max(Number(dashboard.bucketLeft || 0), 0);
  const walletBalance = Math.max(Number(dashboard.walletBalance || 0), 0);
  const allocatedPercent = walletBalance > 0 ? Math.min((totalAvailable / walletBalance) * 100, 100) : 0;
  const topBucket = rows[0];
  const averageBucketBalance = rows.length ? totalAvailable / rows.length : 0;
  const compactAllocated = formatCompactUsd(totalAvailable).replace(".0K", "K").replace(".0M", "M").replace(".0B", "B");

  return `
    <div class="overview-card vba-summary-card">
      <div class="vba-summary-head">
        <div>
          <span class="vba-summary-kicker">AllocaFi Budget Layer</span>
          <h3>Virtual Budget Account Summary</h3>
        </div>
        <div class="vba-summary-allocation">
          <span>Allocated</span>
          <strong>${escapeHtml(compactAllocated)}</strong>
        </div>
      </div>
      <div class="vba-summary-metrics">
        <span class="vba-metric-pill">
          <i aria-label="Budget accounts">${renderOverviewPanelIcon("accounts")}</i>
          <small>Budget accounts</small>
          <b>${rows.length}</b>
        </span>
        <span class="vba-metric-pill">
          <i aria-label="Average balance">${renderOverviewPanelIcon("average")}</i>
          <small>Average balance</small>
          <b>${escapeHtml(formatCompactUsd(averageBucketBalance).replace(".0K", "K"))}</b>
        </span>
        <span class="vba-metric-pill">
          <i aria-label="Largest budget account">${renderOverviewPanelIcon("largest")}</i>
          <small>Largest budget account</small>
          <b title="${escapeHtml(topBucket?.bucket?.name || "Ready")}">${escapeHtml(topBucket?.bucket?.name || "Ready")}</b>
        </span>
      </div>
      <div class="vba-account-list ${rows.length > 5 ? "scrollable" : ""}">
        ${rows.length ? rows.map((row, index) => {
          const allocationShare = walletBalance > 0
            ? Math.min((Number(row.allocated || row.left || 0) / walletBalance) * 100, 100)
            : totalAvailable > 0
              ? Math.min((Number(row.left || 0) / totalAvailable) * 100, 100)
              : 0;
          const accent = getVbaAccentClass(row.bucket.name, index);
          return `
            <button class="vba-summary-row accent-${accent}" data-wallet-id="${row.wallet.id}" data-bucket-id="${row.bucket.id}" type="button">
              ${renderBudgetAccountIcon(row.bucket.name)}
              <span class="vba-row-main">
                <strong>${escapeHtml(row.bucket.name)}</strong>
                <small>${allocationShare.toFixed(0)}% allocated</small>
                <i class="vba-progress"><b style="width:${Math.max(allocationShare, rows.length ? 5 : 0)}%"></b></i>
              </span>
              <span class="vba-row-amount">
                <strong>${renderMoneyValue(row.left, { compactAt: 1_000_000, label: `${row.bucket.name} available balance` })}</strong>
                <small>Available</small>
                <em>${renderMoneyValue(row.allocated, { compactAt: 1_000_000, label: `${row.bucket.name} allocated balance` })} allocated</em>
                <em>${renderMoneyValue(row.spent, { compactAt: 1_000_000, label: `${row.bucket.name} spent this month` })} spent</em>
              </span>
              <span class="vba-chevron">&rsaquo;</span>
            </button>
          `;
        }).join("") : `
          <div class="vba-empty-state">
            <strong>No Virtual Budget Accounts yet</strong>
            <span>Auto Allocate a wallet to see live account balances here.</span>
          </div>
        `}
      </div>
      <div class="vba-summary-footer">
        <span>${allocatedPercent.toFixed(0)}% of tracked wallet value assigned</span>
      </div>
    </div>
  `;
}

function normalizeStablecoinSymbol(asset) {
  const raw = String(asset || "").toUpperCase().replace(/[^A-Z0-9. ]/g, "").trim();
  const compact = raw.replace(/\s+/g, " ");
  if (STABLECOIN_LOGOS[compact]) return compact;
  if (STABLECOIN_ALIASES[compact]) return STABLECOIN_ALIASES[compact];
  const embedded = Object.keys(STABLECOIN_LOGOS).find((symbol) => compact.includes(symbol));
  return embedded || compact;
}

function getStablecoinDisplayMeta(asset) {
  const symbol = normalizeStablecoinSymbol(asset);
  const meta = STABLECOIN_LOGOS[symbol];
  if (meta) return meta;
  return {
    symbol,
    name: "Stablecoin",
    issuer: "",
    mark: symbol.slice(0, 1) || "$",
    className: symbol.toLowerCase().replace(/[^a-z0-9]+/g, "") || "stable",
    referenceImage: "",
    logoImage: "",
  };
}

function renderStablecoinLogo(asset, fallbackMark = "$", options = {}) {
  const symbol = normalizeStablecoinSymbol(asset);
  const meta = STABLECOIN_LOGOS[symbol];
  const extraClass = options.className ? ` ${escapeHtml(options.className)}` : "";
  const aria = options.decorative === false
    ? `role="img" aria-label="${escapeHtml(meta?.name || symbol || "Stablecoin")} logo"`
    : `aria-hidden="true"`;
  if (meta?.logoImage) {
    const imageAlt = options.decorative === false ? `${meta.name || symbol || "Stablecoin"} logo` : "";
    const imageAria = options.decorative === false ? "" : ` aria-hidden="true"`;
    return `<img class="stablecoin-logo stablecoin-logo-${escapeHtml(meta.className)} stablecoin-logo-reference${extraClass}" src="${escapeHtml(meta.logoImage)}" alt="${escapeHtml(imageAlt)}"${imageAria} loading="eager" decoding="async" />`;
  }
  if (symbol === "USDC") {
    return `
      <svg class="stablecoin-logo stablecoin-logo-usdc${extraClass}" viewBox="0 0 64 64" ${aria}>
        <circle class="stablecoin-logo-bg" cx="32" cy="32" r="30"></circle>
        <path class="stablecoin-logo-mark" d="M23 15a20 20 0 0 0 0 34M41 15a20 20 0 0 1 0 34"></path>
        <path class="stablecoin-logo-mark" d="M32 17v30M39 24.5c-1.8-3.1-11.4-4.4-12.4 1.1-.8 4.6 9.1 4.9 11.7 7.4 3.2 3.1.4 8.2-6.2 8.2-4.1 0-7.2-1.4-8.8-3.7"></path>
      </svg>
    `;
  }
  if (symbol === "PYUSD") {
    return `
      <svg class="stablecoin-logo stablecoin-logo-pyusd${extraClass}" viewBox="0 0 64 64" ${aria}>
        <circle class="stablecoin-logo-bg" cx="32" cy="32" r="30"></circle>
        <path class="pyusd-shadow" d="M19 45 24.5 18h17c8.2 0 12.4 4.3 10.8 11.2-1.5 6.3-6.7 10-14.5 10h-7.1L29.5 45H19Z"></path>
        <path class="pyusd-front" d="M15.5 49 21 22h17c8.1 0 12.4 4.3 10.7 11.2-1.5 6.2-6.7 9.8-14.4 9.8h-7.1L26 49H15.5Z"></path>
        <path class="pyusd-cut" d="M30.2 30.8h5.5c2.4 0 3.7 1.1 3.2 3-.4 2-2.1 3.1-4.6 3.1H29l1.2-6.1Z"></path>
        <path class="pyusd-line" d="M14 30h24.5"></path>
        <path class="pyusd-line" d="M13 38h21"></path>
      </svg>
    `;
  }
  if (symbol === "USDT") {
    return `
      <svg class="stablecoin-logo stablecoin-logo-usdt${extraClass}" viewBox="0 0 64 64" ${aria}>
        <circle class="stablecoin-logo-bg" cx="32" cy="32" r="30"></circle>
        <path class="stablecoin-logo-mark" d="M17 19h30v8H36v6.3c8.6.5 15 2.2 15 4.3s-8.5 4.7-19 4.7-19-2.1-19-4.7c0-2.1 6.4-3.8 15-4.3V27H17v-8Z"></path>
        <path class="stablecoin-logo-mark" d="M28 35.8v8.5h8v-8.5"></path>
        <path class="usdt-ring" d="M20 37.5c3.1 1.5 7.1 2.2 12 2.2s8.9-.7 12-2.2"></path>
      </svg>
    `;
  }
  if (symbol === "USDS") {
    return `
      <svg class="stablecoin-logo stablecoin-logo-usds${extraClass}" viewBox="0 0 64 64" ${aria}>
        <circle class="stablecoin-logo-bg" cx="32" cy="32" r="30"></circle>
        <path class="usds-ring" d="M19 45a22 22 0 1 1 25.8-2.3"></path>
        <path class="usds-mark" d="M22 40c2.4 3.1 6.4 4.8 11 4.8 6.3 0 10.8-3.1 10.8-7.8 0-5.4-4.7-6.7-10-7.8-4.2-.9-6.2-1.7-6.2-3.8 0-1.9 1.9-3.3 5.2-3.3 3.4 0 6.1 1.2 7.8 3.4"></path>
        <path class="usds-swoosh" d="M23 20c4.6-6.5 16.7-7.4 25.5 2.5"></path>
      </svg>
    `;
  }
  if (symbol === "DAI") {
    return `
      <svg class="stablecoin-logo stablecoin-logo-dai${extraClass}" viewBox="0 0 64 64" ${aria}>
        <circle class="stablecoin-logo-bg" cx="32" cy="32" r="30"></circle>
        <path class="dai-mark" d="M20 18h13c8.7 0 14.5 5.4 14.5 14S41.7 46 33 46H20V18Z"></path>
        <path class="dai-line" d="M14 28h38"></path>
        <path class="dai-line" d="M14 36h38"></path>
      </svg>
    `;
  }
  if (symbol === "FDUSD") {
    return `
      <svg class="stablecoin-logo stablecoin-logo-fdusd${extraClass}" viewBox="0 0 64 64" ${aria}>
        <circle class="stablecoin-logo-bg" cx="32" cy="32" r="30"></circle>
        <path class="fdusd-mark" d="M22 18h23M22 18v28M22 31h18M22 46h10"></path>
      </svg>
    `;
  }
  return `<span class="stablecoin-logo-fallback${extraClass}">${escapeHtml(fallbackMark || symbol.slice(0, 1) || "$")}</span>`;
}


const SUPPORTED_STABLECOIN_ASSETS = ["USDC", "USDT", "PYUSD", "FDUSD", "DAI", "USDS"];
const SUPPORTED_RESERVE_ASSETS = ["BTC", "ETH", "SOL", "LTC", "ADA", "XRP", "AVAX", "HBAR", "BNB", "POL"];
const RESERVE_ASSET_SYMBOL_REFERENCE_ID = "legal-core-asset-symbol-reference-2026-05-31";
const RESERVE_ASSET_SYMBOL_REFERENCE_PATH = "./assets/reference-icons/legal-core-assets/legal-core-asset-symbol-reference-2026-05-31.png";
const RESERVE_ASSET_METADATA = {
  BTC: { name: "Bitcoin", defaultAccountName: "Bitcoin Reserve", mark: "B", className: "btc", priceId: "bitcoin", fallbackPrice: 100000, change24h: 1.8 },
  ETH: { name: "Ethereum", defaultAccountName: "Ethereum Reserve", mark: "E", className: "eth", priceId: "ethereum", fallbackPrice: 3800, change24h: 1.2 },
  SOL: { name: "Solana", defaultAccountName: "Solana Reserve", mark: "S", className: "sol", priceId: "solana", fallbackPrice: 165, change24h: 2.4 },
  LTC: { name: "Litecoin", defaultAccountName: "Litecoin Reserve", mark: "L", className: "ltc", priceId: "litecoin", fallbackPrice: 88, change24h: 0.6 },
  ADA: { name: "Cardano", defaultAccountName: "Cardano Reserve", mark: "A", className: "ada", priceId: "cardano", fallbackPrice: 0.62, change24h: 0.9 },
  XRP: { name: "XRP", defaultAccountName: "XRP Reserve", mark: "X", className: "xrp", priceId: "ripple", fallbackPrice: 0.58, change24h: 0.7 },
  AVAX: { name: "Avalanche", defaultAccountName: "Avalanche Reserve", mark: "A", className: "avax", priceId: "avalanche-2", fallbackPrice: 36, change24h: 1.4 },
  HBAR: { name: "Hedera", defaultAccountName: "Hedera Reserve", mark: "H", className: "hbar", priceId: "hedera-hashgraph", fallbackPrice: 0.095, change24h: 0.4 },
  BNB: { name: "BNB", defaultAccountName: "BNB Reserve", mark: "B", className: "bnb", priceId: "binancecoin", fallbackPrice: 610, change24h: 0.8 },
  POL: { name: "Polygon", defaultAccountName: "Polygon Reserve", mark: "P", className: "pol", priceId: "polygon-ecosystem-token", fallbackPrice: 0.72, change24h: 0.5 },
};
const LEGAL_CORE_PRICE_SOURCE_LABELS = {
  user_entered_cost_basis: "User-entered cost basis",
  wallet_metadata_cost_basis: "Wallet metadata cost basis",
  coingecko_market_chart_range: "Historical market estimate",
  legacy_stored_price: "Legacy stored price",
  needs_verification: "Needs verification",
};
const LEGAL_CORE_CONFIDENCE_LABELS = {
  verified_user_input: "User provided",
  estimated_nearest_hour: "Estimated near acquisition time",
  estimated_nearest_day: "Estimated nearest market day",
  missing: "Needs review",
};
const VIRTUAL_ASSET_ACCOUNT_TEMPLATES = [
  ...SUPPORTED_RESERVE_ASSETS.map((asset) => ({ id: `reserve-template-${asset.toLowerCase()}`, asset, name: RESERVE_ASSET_METADATA[asset].defaultAccountName, accountType: "reserve" })),
  { id: "reserve-template-retirement", asset: "MULTI", name: "Retirement Crypto", accountType: "strategy" },
  { id: "reserve-template-long-term", asset: "MULTI", name: "Long-Term Holdings", accountType: "strategy" },
  { id: "reserve-template-trading", asset: "MULTI", name: "Trading Reserve", accountType: "strategy" },
  { id: "reserve-template-custom", asset: "CUSTOM", name: "Custom Asset Account", accountType: "custom-template" },
];

function loadVirtualAssetAccountState() {
  const saved = loadJsonStorage(VIRTUAL_ASSET_ACCOUNTS_KEY, {});
  return {
    customAccounts: Array.isArray(saved.customAccounts) ? saved.customAccounts : [],
    accountOverrides: saved.accountOverrides && typeof saved.accountOverrides === "object" ? saved.accountOverrides : {},
  };
}

function saveVirtualAssetAccountState(nextState = virtualAssetAccountState) {
  virtualAssetAccountState = {
    customAccounts: Array.isArray(nextState.customAccounts) ? nextState.customAccounts : [],
    accountOverrides: nextState.accountOverrides && typeof nextState.accountOverrides === "object" ? nextState.accountOverrides : {},
  };
  saveJsonStorage(VIRTUAL_ASSET_ACCOUNTS_KEY, virtualAssetAccountState);
  scheduleAutoVaultSnapshot();
}

function loadLegalCoreAssetRecords() {
  return loadJsonStorage(LEGAL_CORE_ASSET_RECORDS_KEY, []);
}

function saveLegalCoreAssetRecords(records = legalCoreAssetRecords) {
  legalCoreAssetRecords = Array.isArray(records) ? records : [];
  saveJsonStorage(LEGAL_CORE_ASSET_RECORDS_KEY, legalCoreAssetRecords);
  scheduleAutoVaultSnapshot();
}

function loadTaxLedgerAssetRecords() {
  return loadJsonStorage(TAX_LEDGER_ASSET_RECORDS_KEY, []);
}

function saveTaxLedgerAssetRecords(records = taxLedgerAssetRecords) {
  taxLedgerAssetRecords = Array.isArray(records) ? records : [];
  saveJsonStorage(TAX_LEDGER_ASSET_RECORDS_KEY, taxLedgerAssetRecords);
  scheduleAutoVaultSnapshot();
}

function normalizeReserveAssetSymbol(asset) {
  const compact = String(asset || "").toUpperCase().replace(/[^A-Z0-9/]/g, "");
  if (compact.includes("POL") || compact.includes("MATIC")) return "POL";
  if (compact.includes("BTC")) return "BTC";
  if (compact.includes("ETH")) return "ETH";
  if (compact.includes("SOL")) return "SOL";
  if (compact.includes("LTC")) return "LTC";
  if (compact.includes("ADA")) return "ADA";
  if (compact.includes("XRP")) return "XRP";
  if (compact.includes("AVAX")) return "AVAX";
  if (compact.includes("HBAR")) return "HBAR";
  if (compact.includes("BNB")) return "BNB";
  return compact;
}

function getReserveAssetMeta(asset) {
  const symbol = normalizeReserveAssetSymbol(asset);
  return RESERVE_ASSET_METADATA[symbol] || {
    name: symbol === "MULTI" ? "Multi-Asset Strategy" : "Custom Asset",
    defaultAccountName: symbol === "MULTI" ? "Strategy Account" : "Custom Asset Account",
    mark: symbol.slice(0, 1) || "A",
    className: symbol.toLowerCase().replace(/[^a-z0-9]+/g, "") || "custom",
    priceId: "",
    fallbackPrice: 0,
    change24h: 0,
  };
}

function getNetworkAssetSymbol(networkOrAsset) {
  const asset = typeof networkOrAsset === "string" ? networkOrAsset : networkOrAsset?.asset;
  return normalizeReserveAssetSymbol(asset);
}

function getAssetCurrentPrice(asset) {
  const symbol = normalizeReserveAssetSymbol(asset);
  const meta = RESERVE_ASSET_METADATA[symbol];
  if (!meta) return 0;
  return Number(priceCache[meta.priceId] || meta.fallbackPrice || 0);
}

function getNetworkCurrentPrice(network) {
  if (!network?.priceId) return 0;
  return Number(priceCache[network.priceId] || getAssetCurrentPrice(getNetworkAssetSymbol(network)) || 0);
}

function formatAssetQuantity(quantity, asset) {
  const symbol = normalizeReserveAssetSymbol(asset);
  const decimals = ["BTC", "ETH", "SOL", "LTC", "BNB", "AVAX"].includes(symbol) ? 8 : 4;
  return `${Number(quantity || 0).toLocaleString("en-US", { minimumFractionDigits: Number(quantity || 0) ? 0 : 0, maximumFractionDigits: decimals })} ${symbol}`;
}

function renderReserveAssetSymbolSvg(symbol, name) {
  const aria = `role="img" aria-label="${escapeHtml(name)} logo"`;
  const logos = {
    BTC: `<svg viewBox="0 0 64 64" ${aria}><circle cx="32" cy="32" r="31" fill="#f7931a"></circle><text x="32" y="43" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="34" font-weight="900" fill="#fff">â‚¿</text></svg>`,
    ETH: `<svg viewBox="0 0 64 64" ${aria}><circle cx="32" cy="32" r="31" fill="#627eea"></circle><path d="M32 8 16.5 34 32 25.5 47.5 34 32 8Z" fill="#fff" opacity=".93"></path><path d="M16.5 37 32 56 47.5 37 32 45.5 16.5 37Z" fill="#fff" opacity=".82"></path></svg>`,
    SOL: `<svg viewBox="0 0 64 64" ${aria}><circle cx="32" cy="32" r="31" fill="#050505"></circle><path d="M20 19h30l-6 7H14l6-7Z" fill="#14f195"></path><path d="M44 28H14l6 7h30l-6-7Z" fill="#66a6ff"></path><path d="M20 38h30l-6 7H14l6-7Z" fill="#9945ff"></path></svg>`,
    LTC: `<svg viewBox="0 0 64 64" ${aria}><circle cx="32" cy="32" r="31" fill="#345d9d"></circle><text x="33" y="43" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="36" font-weight="900" font-style="italic" fill="#fff">Å</text></svg>`,
    ADA: `<svg viewBox="0 0 64 64" ${aria}><circle cx="32" cy="32" r="31" fill="#0033ad"></circle><g fill="#fff"><circle cx="32" cy="32" r="5"></circle><circle cx="32" cy="17" r="2.8"></circle><circle cx="32" cy="47" r="2.8"></circle><circle cx="17" cy="32" r="2.8"></circle><circle cx="47" cy="32" r="2.8"></circle><circle cx="22" cy="22" r="2.3"></circle><circle cx="42" cy="22" r="2.3"></circle><circle cx="22" cy="42" r="2.3"></circle><circle cx="42" cy="42" r="2.3"></circle><circle cx="12" cy="24" r="1.6"></circle><circle cx="52" cy="24" r="1.6"></circle><circle cx="12" cy="40" r="1.6"></circle><circle cx="52" cy="40" r="1.6"></circle></g></svg>`,
    XRP: `<svg viewBox="0 0 64 64" ${aria}><circle cx="32" cy="32" r="31" fill="#23292f"></circle><path d="M18 19h8c3 4 6 6 10 6s7-2 10-6h8L41 33l13 12h-8c-3-4-6-6-10-6s-7 2-10 6h-8l13-12L18 19Z" fill="#fff"></path></svg>`,
    AVAX: `<svg viewBox="0 0 64 64" ${aria}><circle cx="32" cy="32" r="31" fill="#e84142"></circle><path d="M31.5 15c1.1-1.9 3.9-1.9 5 0l14.6 25.3c1.1 1.9-.3 4.2-2.5 4.2H38.2c-2 0-3.3-2.1-2.4-3.9l2.9-5.3c.8-1.5.8-3.2 0-4.7L31.5 15Z" fill="#fff"></path><path d="M23.5 29.8c.9-1.6 3.2-1.6 4.1 0l3 5.4c.4.7.4 1.6 0 2.3l-3.1 5.6c-.4.8-1.2 1.3-2.1 1.3H15.7c-1.9 0-3.1-2-2.2-3.6l10-11Z" fill="#fff"></path></svg>`,
    HBAR: `<svg viewBox="0 0 64 64" ${aria}><circle cx="32" cy="32" r="31" fill="#050505"></circle><path d="M22 16h6v13h8V16h6v32h-6V35h-8v13h-6V16Z" fill="#fff"></path><path d="M18 29h28v5H18z" fill="#fff"></path></svg>`,
    BNB: `<svg viewBox="0 0 64 64" ${aria}><circle cx="32" cy="32" r="31" fill="#f3ba2f"></circle><path d="m32 13 8 8-8 8-8-8 8-8Zm-14 14 8 8-8 8-8-8 8-8Zm28 0 8 8-8 8-8-8 8-8Zm-14 14 8 8-8 8-8-8 8-8Zm0-14 5 5-5 5-5-5 5-5Z" fill="#fff"></path></svg>`,
    POL: `<svg viewBox="0 0 64 64" ${aria}><circle cx="32" cy="32" r="31" fill="#8247e5"></circle><path d="M42.4 23.1 33 28.5v10.8l9.4 5.4 9.4-5.4V28.5l-9.4-5.4Zm0 6.1 4.1 2.4v4.8l-4.1 2.4-4.1-2.4v-4.8l4.1-2.4Zm-20.8-6.1-9.4 5.4v10.8l9.4 5.4 9.4-5.4V28.5l-9.4-5.4Zm0 6.1 4.1 2.4v4.8l-4.1 2.4-4.1-2.4v-4.8l4.1-2.4Z" fill="#fff"></path><path d="m30.5 30.5 4-2.2v6.4l-4 2.2v-6.4Z" fill="#fff"></path></svg>`,
  };
  return logos[symbol] || "";
}

function renderAssetLogo(asset, options = {}) {
  const symbol = normalizeReserveAssetSymbol(asset);
  const meta = getReserveAssetMeta(symbol);
  const extraClass = options.className ? ` ${escapeHtml(options.className)}` : "";
  const symbolSvg = renderReserveAssetSymbolSvg(symbol, meta.name);
  const referenceAttrs = `data-symbol-reference="${RESERVE_ASSET_SYMBOL_REFERENCE_ID}" data-symbol-reference-path="${RESERVE_ASSET_SYMBOL_REFERENCE_PATH}" data-asset-symbol="${escapeHtml(symbol)}"`;
  if (symbolSvg) {
    return `<span class="asset-logo canonical-asset-logo asset-logo-${escapeHtml(meta.className)}${extraClass}" ${referenceAttrs}>${symbolSvg}</span>`;
  }
  return `<span class="asset-logo asset-logo-${escapeHtml(meta.className)}${extraClass}" role="img" aria-label="${escapeHtml(meta.name)} logo" ${referenceAttrs}><i>${escapeHtml(meta.mark)}</i></span>`;
}

function getWalletReserveAssetSymbol(wallet) {
  const network = NETWORKS[wallet?.network];
  const symbol = getNetworkAssetSymbol(network);
  return SUPPORTED_RESERVE_ASSETS.includes(symbol) ? symbol : "";
}

function getVirtualAssetAccountOverrides(accountId) {
  return virtualAssetAccountState.accountOverrides?.[accountId] || {};
}

function applyVirtualAssetAccountOverride(account) {
  const override = getVirtualAssetAccountOverrides(account.id);
  return {
    ...account,
    name: override.name || account.name,
    archived: Boolean(override.archived || account.archived),
  };
}

function getWalletDerivedVirtualAssetAccounts() {
  const grouped = new Map();
  getSupportedWallets().forEach((wallet) => {
    const asset = getWalletReserveAssetSymbol(wallet);
    if (!asset) return;
    const meta = getReserveAssetMeta(asset);
    const quantity = Number(wallet.balance ?? wallet.manualBalance ?? 0);
    const currentPrice = getAssetCurrentPrice(asset);
    const currentValue = quantity * currentPrice;
    const costBasis = Number(wallet.assetAccount?.costBasis || wallet.costBasis || 0);
    const key = `reserve-wallet-${asset.toLowerCase()}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        id: key,
        source: "connected-wallet",
        accountType: "reserve",
        asset,
        meta,
        name: meta.defaultAccountName,
        quantity: 0,
        balance: 0,
        currentPrice,
        currentValue: 0,
        costBasis: 0,
        costBasisSource: "",
        costBasisComplete: true,
        sourceWalletIds: [],
        walletAddresses: [],
        acquisitionDate: wallet.createdAt || wallet.updatedAt || new Date().toISOString(),
        lastSync: wallet.updatedAt || wallet.createdAt || "",
      });
    }
    const account = grouped.get(key);
    account.quantity += quantity;
    account.balance += quantity;
    account.currentValue += currentValue;
    account.costBasis += costBasis;
    if (costBasis > 0) account.costBasisSource = "wallet_metadata_cost_basis";
    if (quantity > 0 && costBasis <= 0) account.costBasisComplete = false;
    account.sourceWalletIds.push(wallet.id);
    account.walletAddresses.push(wallet.address);
    if (wallet.updatedAt && (!account.lastSync || new Date(wallet.updatedAt) > new Date(account.lastSync))) account.lastSync = wallet.updatedAt;
    if (wallet.createdAt && new Date(wallet.createdAt) < new Date(account.acquisitionDate)) account.acquisitionDate = wallet.createdAt;
  });
  return [...grouped.values()].map((account) => decorateVirtualAssetAccount(account));
}

function decorateVirtualAssetAccount(account) {
  const asset = normalizeReserveAssetSymbol(account.asset || "CUSTOM");
  const meta = getReserveAssetMeta(asset);
  const quantity = Number(account.quantity ?? account.balance ?? 0);
  const currentPrice = Number(account.currentPrice || getAssetCurrentPrice(asset) || 0);
  const currentValue = Number(account.currentValue ?? (quantity * currentPrice) ?? 0);
  const costBasis = Number(account.costBasis || 0);
  const hasCostBasis = costBasis > 0;
  const gain = hasCostBasis ? currentValue - costBasis : 0;
  const gainPercent = costBasis > 0 ? (gain / costBasis) * 100 : 0;
  const acquisitionDate = account.acquisitionDate || account.createdAt || new Date().toISOString();
  const holdingPeriodDays = Math.max(0, Math.floor((Date.now() - new Date(acquisitionDate).getTime()) / 86400000) || 0);
  const hasBalance = currentValue > 0 || quantity > 0;
  const legalStatus = hasBalance && !hasCostBasis
    ? "Cost Basis Needed"
    : account.legalStatus || (hasBalance ? "Legal Core Verified" : "Tracking Ready");
  return applyVirtualAssetAccountOverride({
    ...account,
    asset,
    meta,
    quantity,
    balance: quantity,
    currentPrice,
    currentValue,
    costBasis,
    unrealizedGain: gain,
    unrealizedLoss: gain < 0 ? Math.abs(gain) : 0,
    gainPercent,
    holdingPeriodDays,
    legalStatus,
    costBasisSource: account.costBasisSource || (hasCostBasis ? "user_entered_cost_basis" : ""),
    costBasisComplete: account.costBasisComplete !== false && (!hasBalance || hasCostBasis),
    classificationStatus: account.classificationStatus || (hasBalance ? (hasCostBasis ? "Verified" : "Cost basis needed") : "Pending setup"),
    lastSync: account.lastSync || account.updatedAt || account.createdAt || "",
  });
}

function getTemplateVirtualAssetAccounts(existingAssets = new Set()) {
  return VIRTUAL_ASSET_ACCOUNT_TEMPLATES
    .filter((template) => !existingAssets.has(template.asset))
    .map((template) => decorateVirtualAssetAccount({
      ...template,
      source: "template",
      quantity: 0,
      currentValue: 0,
      costBasis: 0,
      sourceWalletIds: [],
      walletAddresses: [],
      acquisitionDate: "",
      legalStatus: template.asset === "MULTI" || template.asset === "CUSTOM" ? "Strategy Ready" : "Tracking Ready",
      lastSync: "",
    }));
}

function getCustomVirtualAssetAccounts() {
  return (virtualAssetAccountState.customAccounts || [])
    .filter((account) => !account.archived)
    .map((account) => decorateVirtualAssetAccount({ ...account, source: "custom" }));
}

function getVirtualAssetAccounts(options = {}) {
  const walletAccounts = getWalletDerivedVirtualAssetAccounts();
  const customAccounts = getCustomVirtualAssetAccounts();
  const existingAssets = new Set([...walletAccounts, ...customAccounts].map((account) => account.asset).filter((asset) => SUPPORTED_RESERVE_ASSETS.includes(asset)));
  const templateAccounts = getTemplateVirtualAssetAccounts(existingAssets);
  const accounts = [...walletAccounts, ...customAccounts, ...templateAccounts]
    .map((account) => applyVirtualAssetAccountOverride(account))
    .filter((account) => options.includeArchived || !account.archived);
  return accounts;
}

function getVirtualAssetAccountById(accountId) {
  return getVirtualAssetAccounts({ includeArchived: true }).find((account) => account.id === accountId) || null;
}

function getUserTrackedAssetAccounts(options = {}) {
  if (!canUseReserveAssetAccounts()) return [];
  return getVirtualAssetAccounts(options)
    .filter((account) => SUPPORTED_RESERVE_ASSETS.includes(account.asset) && account.source !== "template");
}

function getAssetAccountSignedUnrealizedGain(account) {
  const legal = buildLegalCoreRecordForAccount(account);
  if (Number(legal.costBasis || 0) > 0) {
    return Number(account.currentValue || 0) - Number(legal.costBasis || 0);
  }
  return Number(account.unrealizedGain || 0);
}

function getAssetAccountGainPercent(account) {
  const legal = buildLegalCoreRecordForAccount(account);
  const costBasis = Number(legal.costBasis || 0);
  return costBasis > 0 ? (getAssetAccountSignedUnrealizedGain(account) / costBasis) * 100 : 0;
}

function getStoredHistoricalAssetPriceRecord(asset, acquiredAt = new Date().toISOString()) {
  const symbol = normalizeReserveAssetSymbol(asset);
  const acquiredDay = String(acquiredAt || "").slice(0, 10);
  const meta = getReserveAssetMeta(symbol);
  const stored = legalCoreAssetRecords.find((record) => record.asset === symbol && record.acquisitionDate?.slice(0, 10) === acquiredDay);
  const storedPrice = Number(stored?.historicalMarketPrice || 0);
  if (!storedPrice) return null;
  if (!stored.priceSource && meta.fallbackPrice && Math.abs(storedPrice - Number(meta.fallbackPrice)) < 0.000001) return null;
  return {
    historicalMarketPrice: storedPrice,
    priceSource: stored.priceSource || "legacy_stored_price",
    priceConfidence: stored.priceConfidence || "estimated_nearest_day",
    priceTimestamp: stored.priceTimestamp || stored.updatedAt || `${acquiredDay}T00:00:00.000Z`,
    priceSourceUrl: stored.priceSourceUrl || "",
    priceNote: stored.priceNote || "",
  };
}

function getHistoricalAssetPrice(asset, acquiredAt = new Date().toISOString()) {
  return Number(getStoredHistoricalAssetPriceRecord(asset, acquiredAt)?.historicalMarketPrice || 0);
}

function getLegalCorePriceBasis(account) {
  const quantity = Number(account.quantity || 0);
  const explicitCostBasis = Number(account.costBasis || 0);
  if (quantity > 0 && explicitCostBasis > 0) {
    return {
      historicalMarketPrice: explicitCostBasis / quantity,
      costBasis: explicitCostBasis,
      priceSource: account.costBasisSource || "user_entered_cost_basis",
      priceConfidence: "verified_user_input",
      priceTimestamp: account.acquisitionDate || account.createdAt || new Date().toISOString(),
      priceSourceUrl: "",
      priceNote: "Purchase price comes from user-entered or imported cost basis metadata.",
      costBasisStatus: "verified",
    };
  }

  const acquiredAt = account.acquisitionDate || account.createdAt || new Date().toISOString();
  const stored = getStoredHistoricalAssetPriceRecord(account.asset, acquiredAt);
  if (quantity > 0 && stored?.historicalMarketPrice) {
    return {
      ...stored,
      costBasis: quantity * Number(stored.historicalMarketPrice || 0),
      costBasisStatus: "estimated",
      priceNote: stored.priceNote || "Historical market estimate only. Use exchange/order receipts for verified purchase price.",
    };
  }

  return {
    historicalMarketPrice: 0,
    costBasis: 0,
    priceSource: "needs_verification",
    priceConfidence: "missing",
    priceTimestamp: acquiredAt,
    priceSourceUrl: "",
    priceNote: "Wallet address alone does not prove purchase price. Add an exchange/order receipt, swap record, or verified cost basis.",
    costBasisStatus: "needs_verification",
  };
}

function formatLegalCorePriceSource(record = {}) {
  return LEGAL_CORE_PRICE_SOURCE_LABELS[record.priceSource] || record.priceSource || "Needs verification";
}

function formatLegalCoreConfidence(record = {}) {
  return LEGAL_CORE_CONFIDENCE_LABELS[record.priceConfidence] || record.priceConfidence || "Needs review";
}

function buildLegalCoreRecordForAccount(account) {
  const acquiredAt = account.acquisitionDate || account.createdAt || new Date().toISOString();
  const priceBasis = getLegalCorePriceBasis(account);
  const historicalMarketPrice = Number(priceBasis.historicalMarketPrice || 0);
  const costBasis = Number(priceBasis.costBasis || 0);
  const currentValue = Number(account.currentValue || 0);
  const realizedGain = Number(account.realizedGain || 0);
  const realizedLoss = Number(account.realizedLoss || 0);
  const classificationStatus = priceBasis.costBasisStatus === "estimated"
    ? "Estimated cost basis"
    : priceBasis.costBasisStatus === "verified"
      ? "Verified cost basis"
      : account.classificationStatus || "Needs cost basis verification";
  const legalCoreStatus = priceBasis.costBasisStatus === "estimated"
    ? "Estimate Ready"
    : priceBasis.costBasisStatus === "verified"
      ? "Legal Core Verified"
      : account.legalStatus || "Cost Basis Needed";
  return {
    id: `legal-core-${account.id}`,
    accountId: account.id,
    accountName: account.name,
    asset: account.asset,
    acquisitionDate: acquiredAt.slice(0, 10),
    acquisitionTime: acquiredAt.includes("T") ? acquiredAt.slice(11, 19) : "00:00:00",
    assetQuantity: Number(account.quantity || 0),
    acquisitionWallet: account.walletAddresses?.[0] || "",
    acquisitionTransactionHash: account.acquisitionTransactionHash || "",
    historicalMarketPrice,
    costBasis,
    priceSource: priceBasis.priceSource,
    priceSourceLabel: formatLegalCorePriceSource(priceBasis),
    priceConfidence: priceBasis.priceConfidence,
    priceConfidenceLabel: formatLegalCoreConfidence(priceBasis),
    priceTimestamp: priceBasis.priceTimestamp,
    priceSourceUrl: priceBasis.priceSourceUrl || "",
    priceNote: priceBasis.priceNote || "",
    costBasisStatus: priceBasis.costBasisStatus,
    currentPrice: account.currentPrice,
    currentValue,
    holdingPeriodDays: account.holdingPeriodDays,
    unrealizedGain: costBasis > 0 ? Math.max(currentValue - costBasis, 0) : 0,
    unrealizedLoss: costBasis > 0 ? Math.max(costBasis - currentValue, 0) : 0,
    realizedGain,
    realizedLoss,
    transferHistory: account.transferHistory || [],
    dispositionHistory: account.dispositionHistory || [],
    classificationStatus,
    legalCoreStatus,
    updatedAt: new Date().toISOString(),
  };
}

async function ensureLegalCoreHistoricalPrice(accountId) {
  const account = getVirtualAssetAccountById(accountId);
  if (!account || !SUPPORTED_RESERVE_ASSETS.includes(account.asset) || Number(account.quantity || 0) <= 0) return null;
  const currentRecord = buildLegalCoreRecordForAccount(account);
  if (currentRecord.costBasisStatus !== "needs_verification") return currentRecord;

  const acquiredAt = account.acquisitionDate || account.createdAt || new Date().toISOString();
  const requestKey = `${account.asset}:${String(acquiredAt).slice(0, 10)}`;
  if (legalCoreHistoricalPriceFetches.has(requestKey)) return currentRecord;
  legalCoreHistoricalPriceFetches.add(requestKey);

  try {
    const params = new URLSearchParams({ asset: account.asset, timestamp: acquiredAt });
    const response = await fetchWithTimeout(`/api/prices/historical?${params.toString()}`, {}, 15000);
    const data = await response.json();
    if (!response.ok || !data.ok || !Number(data.marketPriceUsd)) {
      throw new Error(data.message || "Historical price unavailable");
    }
    const record = {
      ...currentRecord,
      historicalMarketPrice: Number(data.marketPriceUsd),
      costBasis: Number(account.quantity || 0) * Number(data.marketPriceUsd),
      priceSource: data.source || "coingecko_market_chart_range",
      priceSourceLabel: "Historical market estimate",
      priceConfidence: data.confidence || "estimated_nearest_day",
      priceConfidenceLabel: formatLegalCoreConfidence({ priceConfidence: data.confidence || "estimated_nearest_day" }),
      priceTimestamp: data.priceTimestamp || acquiredAt,
      priceSourceUrl: data.sourceUrl || "",
      priceNote: data.note || "Historical market estimate only. Use exchange/order receipts for verified purchase price.",
      costBasisStatus: "estimated",
      classificationStatus: "Estimated cost basis",
      legalCoreStatus: "Estimate Ready",
      updatedAt: new Date().toISOString(),
    };
    const merged = new Map((legalCoreAssetRecords || []).map((item) => [item.id, item]));
    merged.set(record.id, { ...(merged.get(record.id) || {}), ...record });
    saveLegalCoreAssetRecords([...merged.values()]);
    saveTaxLedgerAssetRecords(buildTaxLedgerAssetRecords());
    updateOpenAssetAccountLegalCoreFields(account.id);
    render();
    return record;
  } catch (error) {
    updateOpenAssetAccountLegalCoreFields(account.id, error?.message || "Historical price unavailable");
    return currentRecord;
  } finally {
    legalCoreHistoricalPriceFetches.delete(requestKey);
  }
}

function renderLegalCoreHistoricalPriceValue(legal) {
  return legal.historicalMarketPrice > 0 ? formatUsd(legal.historicalMarketPrice) : "Needs verification";
}

function updateOpenAssetAccountLegalCoreFields(accountId, errorMessage = "") {
  const hasOpenAccount = [...dialogContent.querySelectorAll("[data-asset-price-account]")].some((node) => node.dataset.assetPriceAccount === accountId);
  if (!walletDialog.open || !hasOpenAccount) return;
  const account = getVirtualAssetAccountById(accountId);
  if (!account) return;
  const legal = buildLegalCoreRecordForAccount(account);
  const setText = (field, value) => {
    dialogContent.querySelectorAll(`[data-legal-core-field="${field}"]`).forEach((node) => {
      node.textContent = value;
    });
  };
  setText("historical-price", renderLegalCoreHistoricalPriceValue(legal));
  setText("cost-basis", legal.costBasis > 0 ? formatUsd(legal.costBasis) : "Needs verification");
  setText("price-source", legal.priceSourceLabel);
  setText("price-confidence", errorMessage || legal.priceConfidenceLabel);
  setText("price-note", errorMessage || legal.priceNote || "");
  setText("classification", legal.classificationStatus);
  setText("legal-status", legal.legalCoreStatus);
  const gain = legal.costBasis > 0 ? Number(account.currentValue || 0) - legal.costBasis : 0;
  setText("unrealized-gain", legal.costBasis > 0 ? `${gain >= 0 ? "+" : "-"}${formatUsd(Math.abs(gain))}` : "Needs basis");
  setText("gain-percent", legal.costBasis > 0 ? `${gain >= 0 ? "+" : ""}${((gain / legal.costBasis) * 100).toFixed(1)}%` : "Add receipt or estimate");
  dialogContent.querySelectorAll('[data-legal-core-field="unrealized-gain"]').forEach((node) => {
    node.classList.toggle("positive", gain >= 0);
    node.classList.toggle("negative", gain < 0);
  });
}

function syncLegalCoreAssetRecords() {
  const liveRecords = getVirtualAssetAccounts()
    .filter((account) => SUPPORTED_RESERVE_ASSETS.includes(account.asset))
    .map(buildLegalCoreRecordForAccount);
  const merged = new Map((legalCoreAssetRecords || []).map((record) => [record.id, record]));
  liveRecords.forEach((record) => merged.set(record.id, { ...(merged.get(record.id) || {}), ...record }));
  legalCoreAssetRecords = [...merged.values()];
  return legalCoreAssetRecords;
}

function buildTaxLedgerAssetRecords(accounts = getVirtualAssetAccounts()) {
  return accounts
    .filter((account) => SUPPORTED_RESERVE_ASSETS.includes(account.asset))
    .map((account) => {
      const legal = buildLegalCoreRecordForAccount(account);
      return {
        id: `tax-ledger-${account.id}`,
        accountId: account.id,
        accountName: account.name,
        asset: account.asset,
        quantity: legal.assetQuantity,
        costBasis: legal.costBasis,
        costBasisStatus: legal.costBasisStatus,
        priceSource: legal.priceSourceLabel,
        priceConfidence: legal.priceConfidenceLabel,
        currentValue: legal.currentValue,
        unrealizedGain: legal.unrealizedGain,
        unrealizedLoss: legal.unrealizedLoss,
        realizedGain: legal.realizedGain,
        realizedLoss: legal.realizedLoss,
        holdingPeriodDays: legal.holdingPeriodDays,
        reportTypes: ["Cost Basis Report", "Gain/Loss Report", "Portfolio Report", "Asset Report", "Accountant Report", "Future Tax Report"],
        exportReady: true,
        updatedAt: new Date().toISOString(),
      };
    });
}

function classifyAssetTransaction(transaction = {}) {
  const intent = `${transaction.type || ""} ${transaction.destinationType || ""} ${transaction.destination || ""} ${transaction.note || ""}`.toLowerCase();
  if (intent.includes("failed") || intent.includes("rejected")) {
    return { classification: "Failed Transaction", legalCoreStatus: "Invalid", disposalStatus: "No Disposal", taxLedgerImpact: "No taxable event" };
  }
  if (intent.includes("dex") || intent.includes("swap")) {
    return { classification: "DEX Swap", legalCoreStatus: "Confirmed Disposal", disposalStatus: "Confirmed Disposal", taxLedgerImpact: "Gain/loss review required" };
  }
  if (intent.includes("stablecoin") || intent.includes("conversion") || intent.includes("sale")) {
    return { classification: "Stablecoin Conversion", legalCoreStatus: "Confirmed Sale", disposalStatus: "Confirmed Disposal", taxLedgerImpact: "Sale proceeds recorded" };
  }
  if (intent.includes("exchange") || intent.includes("deposit")) {
    return { classification: "Exchange Deposit", legalCoreStatus: "Potential Disposal", disposalStatus: "Pending Review", taxLedgerImpact: "Review exchange activity" };
  }
  if (intent.includes("wallet transfer") || intent.includes("self") || intent.includes("movement")) {
    return { classification: "Wallet Transfer", legalCoreStatus: "Movement Only", disposalStatus: "No Disposal", taxLedgerImpact: "No taxable event" };
  }
  return { classification: "Unknown Destination", legalCoreStatus: "Needs Classification", disposalStatus: "Pending Review", taxLedgerImpact: "Manual review required" };
}

function getPendingAssetClassifications() {
  return syncLegalCoreAssetRecords().filter((record) => /pending|needs|potential/i.test(`${record.classificationStatus} ${record.legalCoreStatus}`));
}

function getAssetAccountTimeline(account) {
  const legal = buildLegalCoreRecordForAccount(account);
  const timeline = [
    {
      type: "Acquired",
      title: `Acquired ${formatAssetQuantity(legal.assetQuantity, account.asset)}`,
      detail: `Price: ${renderLegalCoreHistoricalPriceValue(legal)} | ${legal.priceSourceLabel} | ${legal.legalCoreStatus}`,
      createdAt: account.acquisitionDate || account.createdAt || new Date().toISOString(),
    },
    ...(account.transferHistory || []).map((item) => ({
      type: "Transferred",
      title: `${formatAssetQuantity(item.quantity || 0, account.asset)} transfer`,
      detail: item.classification || "Movement Only",
      createdAt: item.createdAt || new Date().toISOString(),
    })),
    ...(account.dispositionHistory || []).map((item) => ({
      type: "Sold",
      title: `${formatAssetQuantity(item.quantity || 0, account.asset)} disposition`,
      detail: `Gain: ${formatUsd(Number(item.gain || 0))}`,
      createdAt: item.createdAt || new Date().toISOString(),
    })),
    {
      type: "Legal Core Update",
      title: legal.classificationStatus,
      detail: `${legal.legalCoreStatus} | Holding period ${legal.holdingPeriodDays} days`,
      createdAt: legal.updatedAt,
    },
  ];
  return timeline.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

function buildVaultAssetExportStructure() {
  const accounts = getVirtualAssetAccounts();
  const legalRecords = syncLegalCoreAssetRecords();
  const taxRecords = buildTaxLedgerAssetRecords(accounts);
  return {
    "Asset Accounts": accounts.map((account) => ({
      name: account.name,
      asset: account.asset,
      quantity: account.quantity,
      currentValue: account.currentValue,
      legalCoreStatus: account.legalStatus,
    })),
    "Legal Core": {
      Acquisitions: legalRecords.map((record) => ({
        accountName: record.accountName,
        asset: record.asset,
        quantity: record.assetQuantity,
        price: record.historicalMarketPrice,
        priceSource: record.priceSourceLabel,
        priceConfidence: record.priceConfidenceLabel,
        costBasisStatus: record.costBasisStatus,
        date: record.acquisitionDate,
      })),
      Transfers: accounts.flatMap((account) => account.transferHistory || []),
      Disposals: accounts.flatMap((account) => account.dispositionHistory || []),
      Classifications: legalRecords.map((record) => ({ accountName: record.accountName, status: record.classificationStatus, legalCoreStatus: record.legalCoreStatus })),
    },
    "Tax Ledger": {
      "Cost Basis": taxRecords.map((record) => ({ accountName: record.accountName, asset: record.asset, costBasis: record.costBasis })),
      Gains: taxRecords.map((record) => ({ accountName: record.accountName, asset: record.asset, unrealizedGain: record.unrealizedGain, realizedGain: record.realizedGain })),
      Losses: taxRecords.map((record) => ({ accountName: record.accountName, asset: record.asset, unrealizedLoss: record.unrealizedLoss, realizedLoss: record.realizedLoss })),
    },
    Reports: {
      "Asset Performance": taxRecords,
      "Portfolio Summary": getAssetRatioLegalCoreModel(getDashboardDetails(), getDashboardSummary(), 0).summary,
      "Legal Core Reports": legalRecords,
    },
  };
}

function getAssetRatioLegalCoreModel(details, dashboard, stablecoinPercent) {
  const assetAccounts = getUserTrackedAssetAccounts().filter((account) => SUPPORTED_RESERVE_ASSETS.includes(account.asset));
  const stablecoinValue = 0;
  const reserveAssetValue = assetAccounts.reduce((sum, account) => sum + Number(account.currentValue || 0), 0);
  const totalPortfolioValue = reserveAssetValue;
  const otherAssetValue = 0;
  const safeTotal = totalPortfolioValue || 1;
  const unrealizedGainLoss = assetAccounts.reduce((sum, account) => sum + getAssetAccountSignedUnrealizedGain(account), 0);
  return {
    summary: {
      totalPortfolioValue,
      stablecoinValue,
      reserveAssetValue,
      otherAssetValue,
      stablecoinPercent: 0,
      reserveAssetPercent: Math.min((reserveAssetValue / safeTotal) * 100, 100),
      otherAssetPercent: 0,
      unrealizedGainLoss,
      legalCoreTracked: assetAccounts.filter((account) => account.currentValue > 0 || account.legalStatus === "Legal Core Verified").length,
    },
    stableRows: [],
    assetRows: assetAccounts.map((account) => {
      const signedGain = getAssetAccountSignedUnrealizedGain(account);
      const gainPercent = getAssetAccountGainPercent(account);
      return {
        kind: "reserve",
        accountId: account.id,
        asset: account.asset,
        name: account.meta.name,
        accountName: account.name,
        amount: account.quantity,
        currentValue: account.currentValue,
        portfolioPercent: totalPortfolioValue ? (account.currentValue / totalPortfolioValue) * 100 : 0,
        unrealizedGain: signedGain,
        unrealizedGainPercent: gainPercent,
        legalStatus: account.legalStatus,
        meta: account.meta,
      };
    }),
  };
}

function renderAssetRatioRow(row) {
  if (row.kind === "stablecoin") {
    const linePath = buildLiquidityChartPath(row.spark, 96, 34, 3);
    const areaPath = buildLiquidityAreaPath(row.spark, 96, 34, 3);
    return `
      <article class="stablecoin-allocation-row asset-ratio-row stablecoin-token-${escapeHtml(row.meta.className)} ${row.amount > 0 ? "has-balance" : "is-empty"}">
        <span class="stablecoin-asset-icon">${renderStablecoinLogo(row.asset, row.meta.mark)}</span>
        <span class="stablecoin-asset-copy">
          <strong>${escapeHtml(row.asset)}</strong>
          <small>${escapeHtml(row.name)}</small>
        </span>
        <svg class="stablecoin-sparkline" viewBox="0 0 96 34" aria-hidden="true">
          <path class="spark-area" d="${areaPath}"></path>
          <path class="spark-line" d="${linePath}"></path>
        </svg>
        <span class="stablecoin-asset-value">
          <strong>${renderMoneyValue(row.currentValue, { compactAt: 1_000_000, label: `${row.asset} current value` })}</strong>
          <small>${row.portfolioPercent.toFixed(2)}% portfolio</small>
        </span>
        <span class="asset-ratio-change ${row.change24h >= 0 ? "positive" : "negative"}"><strong>${row.change24h >= 0 ? "+" : ""}${row.change24h.toFixed(2)}%</strong><small>24h</small></span>
        <span class="legal-core-chip">${escapeHtml(row.legalStatus)}</span>
      </article>
    `;
  }
  return `
    <article class="stablecoin-allocation-row asset-ratio-row reserve-asset-row ${row.currentValue > 0 ? "has-balance" : "is-empty"}" data-open-asset-account="${escapeHtml(row.accountId)}" role="button" tabindex="0" aria-label="Open ${escapeHtml(row.accountName)}">
      <span class="stablecoin-asset-icon">${renderAssetLogo(row.asset)}</span>
      <span class="stablecoin-asset-copy">
        <strong>${escapeHtml(row.name)}</strong>
        <small>${escapeHtml(row.asset)} | ${escapeHtml(row.accountName)}</small>
      </span>
      <span class="asset-ratio-balance">
        <strong>${escapeHtml(formatAssetQuantity(row.amount, row.asset))}</strong>
        <small>${renderMoneyValue(row.currentValue, { compactAt: 1_000_000, label: `${row.asset} market value` })} | ${row.portfolioPercent.toFixed(2)}%</small>
      </span>
      <span class="asset-ratio-change ${row.unrealizedGain >= 0 ? "positive" : "negative"}"><strong>${row.unrealizedGain >= 0 ? "+" : "-"}${formatUsd(Math.abs(row.unrealizedGain || 0))}</strong><small>${row.unrealizedGainPercent ? `${row.unrealizedGainPercent >= 0 ? "+" : ""}${row.unrealizedGainPercent.toFixed(1)}% unrealized` : "Unrealized"}</small></span>
      <span class="legal-core-chip ${row.legalStatus === "Legal Core Verified" ? "verified" : "pending"}">${escapeHtml(row.legalStatus)}</span>
    </article>
  `;
}

function renderAssetRatioLegalCoreCard(details, dashboard, stablecoinPercent) {
  const model = getAssetRatioLegalCoreModel(details, dashboard, stablecoinPercent);
  const { summary } = model;
  const rows = model.assetRows.slice(0, 12);
  const gainTone = summary.unrealizedGainLoss >= 0 ? "positive" : "negative";
  return `
    <div class="overview-card stablecoin-ratio-card asset-ratio-legal-core-card">
      <div class="ratio-card-head">
        <span class="ratio-card-icon" aria-label="Asset Ratio and Legal Core">${renderOverviewPanelIcon("stableRatio")}</span>
        <div>
          <h3>Asset Ratio & Legal Core Tracker</h3>
          <p>Portfolio allocation, reserve assets, and Legal Core status</p>
        </div>
        <div class="ratio-total-pill">
          <strong>${summary.reserveAssetPercent.toFixed(0)}%</strong>
          <span>Reserve Assets</span>
        </div>
      </div>
      <div class="asset-ratio-metrics">
        <article><span>Total Portfolio Value</span><strong>${renderMoneyValue(summary.totalPortfolioValue, { compactAt: 10_000_000, label: "Total portfolio value" })}</strong></article>
        <article><span>Stablecoin Allocation</span><strong>${summary.stablecoinPercent.toFixed(1)}%</strong></article>
        <article><span>Reserve Asset Allocation</span><strong>${summary.reserveAssetPercent.toFixed(1)}%</strong></article>
        <article><span>Other Asset Allocation</span><strong>${summary.otherAssetPercent.toFixed(1)}%</strong></article>
        <article><span>Total Unrealized Gain/Loss</span><strong class="${gainTone}">${summary.unrealizedGainLoss >= 0 ? "+" : "-"}${formatUsd(Math.abs(summary.unrealizedGainLoss))}</strong></article>
        <article><span>Legal Core Tracking</span><strong>${summary.legalCoreTracked}</strong></article>
      </div>
      <div class="asset-ratio-segment-rail" style="--stable-ratio:${summary.stablecoinPercent.toFixed(2)}%; --reserve-ratio:${summary.reserveAssetPercent.toFixed(2)}%; --other-ratio:${summary.otherAssetPercent.toFixed(2)}%">
        <i class="stable"></i><i class="reserve"></i><i class="other"></i>
      </div>
      <div class="stablecoin-allocation-list asset-ratio-list ${rows.length > 5 ? "scrollable" : ""}">
        ${rows.length ? rows.map(renderAssetRatioRow).join("") : `
          <div class="stablecoin-empty-state">
            <strong>No assets tracked yet</strong>
            <span>Add a stablecoin or reserve-asset wallet to activate Asset Ratio & Legal Core Tracker.</span>
          </div>
        `}
      </div>
      <button class="stable-allocation-callout" type="button" data-open-asset-accounts>
        <span class="stable-callout-icon" aria-label="Asset account status">${renderOverviewPanelIcon("stableCheck")}</span>
        <span>
          <strong>Open Virtual Asset Accounts</strong>
          <small>Asset management stays inside Wallets & Accounts. Dashboard widgets remain view-only.</small>
        </span>
        <em>View Accounts</em>
      </button>
    </div>
  `;
}
function getStablecoinRatioRows(details) {
  const holdings = Object.fromEntries(details.stablecoins || []);
  const activeAssets = (details.stablecoins || []).map(([asset]) => asset);
  const preferredAssets = ["PYUSD", "USDC", "USDS", "USDT", "FDUSD", "DAI"];
  const rowAssets = [...activeAssets];
  if (Number(details.stablecoinTotal || 0) > 0) {
    preferredAssets.forEach((asset) => {
      if (rowAssets.length < 4 && !rowAssets.includes(asset)) rowAssets.push(asset);
    });
  }
  return rowAssets.slice(0, 6).map((asset) => {
    const amount = Number(holdings[asset] || 0);
    const share = Number(details.stablecoinTotal || 0) > 0
      ? Math.min((amount / Number(details.stablecoinTotal || 1)) * 100, 100)
      : 0;
    return {
      asset,
      amount,
      share,
      meta: getStablecoinDisplayMeta(asset),
      spark: STABLECOIN_RATIO_SPARKS[asset] || STABLECOIN_RATIO_SPARKS.USDC,
    };
  });
}

function renderStablecoinRatioCard(details, dashboard, stablecoinPercent) {
  return renderAssetRatioLegalCoreCard(details, dashboard, stablecoinPercent);
}

function getUpcomingBillIcon(name) {
  const normalized = String(name || "").toLowerCase();
  if (normalized.includes("rent") || normalized.includes("mortgage") || normalized.includes("housing")) return renderOverviewPanelIcon("housing");
  if (normalized.includes("electric") || normalized.includes("power") || normalized.includes("water") || normalized.includes("utility")) return renderOverviewPanelIcon("utility");
  if (normalized.includes("internet") || normalized.includes("wifi")) return renderOverviewPanelIcon("wifi");
  if (normalized.includes("phone")) return renderOverviewPanelIcon("phone");
  if (normalized.includes("insurance")) return renderOverviewPanelIcon("insurance");
  if (normalized.includes("car") || normalized.includes("auto")) return renderOverviewPanelIcon("car");
  if (normalized.includes("subscription")) return renderOverviewPanelIcon("subscription");
  return renderOverviewPanelIcon("bills");
}

function getUpcomingBillCategory(name) {
  const normalized = String(name || "").toLowerCase();
  if (normalized.includes("rent") || normalized.includes("mortgage") || normalized.includes("housing")) return "Monthly Housing";
  if (normalized.includes("electric") || normalized.includes("water") || normalized.includes("utility")) return "Monthly Utility";
  if (normalized.includes("internet") || normalized.includes("phone")) return "Monthly Service";
  if (normalized.includes("insurance")) return "Coverage";
  if (normalized.includes("car")) return "Transportation";
  if (normalized.includes("subscription")) return "Subscription";
  return "Monthly Bill";
}

function getUpcomingBillPriority(row) {
  const required = Number(row.required || 0);
  if (row.dueSort < 0) return { key: "high", label: "Overdue" };
  if (row.dueSort <= 3 || required >= 1000) return { key: "high", label: "High Priority" };
  if (row.dueSort <= 10 || required >= 250) return { key: "medium", label: "Medium Priority" };
  return { key: "low", label: "Low Priority" };
}

function renderUpcomingBillPayIcon() {
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3.5" y="6.5" width="17" height="11" rx="3"></rect>
      <path d="M16 12h4.5"></path>
      <path d="m18.4 9.8 2.1 2.2-2.1 2.2"></path>
      <path d="M7 10.5h4"></path>
    </svg>
  `;
}

function renderUpcomingBillsCard(details) {
  const rows = details.billRows || [];
  const visibleRows = rows.slice(0, 5);
  const totalDue = Math.max(Number(details.billsRequired || 0), 0);
  const funded = Math.max(Number(details.billsBalance || 0), 0);
  const progress = totalDue > 0 ? Math.min((funded / totalDue) * 100, 100) : 0;
  const upcomingCount = rows.filter((row) => row.dueSort >= 0 && row.dueSort <= 31).length;
  const overdueCount = rows.filter((row) => row.dueSort < 0).length;
  const nextBill = rows.find((row) => row.dueSort < 0) || rows.find((row) => row.dueSort >= 0 && row.dueSort <= 31);
  const statusTone = overdueCount ? "alert" : upcomingCount ? "due" : "quiet";
  const statusHeadline = overdueCount ? "Review overdue bills" : upcomingCount ? "Upcoming payment" : "Stay on track";
  const statusText = nextBill
    ? `${nextBill.bill.name} ${String(nextBill.dueSoonLabel || "needs a due date").toLowerCase()}${Number(nextBill.required || 0) > 0 ? ` for ${formatUsd(nextBill.required)}` : ""}.`
    : rows.length
      ? "Add due dates here to unlock bill reminders without crowding the dashboard."
      : "Create your Bills account to track upcoming payments.";
  return `
    <div class="overview-card upcoming-bills-card">
      <div class="upcoming-bills-head">
        <span class="upcoming-bills-icon" aria-label="Upcoming bills">${renderOverviewPanelIcon("bills")}</span>
        <div>
          <h3>Upcoming Bills</h3>
          <p>Stay ahead of your payments</p>
        </div>
        <div class="upcoming-bills-total">
          <span>Total Due</span>
          <strong>${renderMoneyValue(totalDue, { compactAt: 1_000_000, label: "Total due" })}</strong>
        </div>
      </div>
      <div class="upcoming-bills-rail" style="--bill-progress:${progress}%"><i></i></div>
      <button class="bill-status-card ${escapeHtml(statusTone)}" type="button" data-open-upcoming-bills>
        <span aria-label="Bill status">${renderOverviewPanelIcon(statusTone === "alert" ? "alert" : statusTone === "due" ? "calendar" : "check")}</span>
        <span>
          <strong>${escapeHtml(statusHeadline)}</strong>
          <small>${escapeHtml(statusText)}</small>
        </span>
        <em>Manage Bills ï¿½</em>
      </button>
      <div class="upcoming-bill-list ${visibleRows.length > 4 ? "scrollable" : ""}">
        ${visibleRows.length ? visibleRows.map((row) => {
          const priority = getUpcomingBillPriority(row);
          const dueText = row.dueSoonLabel || "No due date";
          const scheduleText = row.dueLabel === "No due date" ? "Not scheduled" : row.dueLabel;
          return `
            <div class="upcoming-bill-row priority-${escapeHtml(priority.key)}">
              <button class="upcoming-bill-main" type="button" data-open-bill-row data-wallet-id="${row.wallet.id}" data-bucket-id="${row.bucket.id}" aria-label="Open ${escapeHtml(row.bill.name)} bill details">
                <span class="upcoming-bill-icon">${getUpcomingBillIcon(row.bill.name)}</span>
                <span class="upcoming-bill-copy">
                  <strong>${escapeHtml(row.bill.name)}</strong>
                  <small>${escapeHtml(getUpcomingBillCategory(row.bill.name))}</small>
                  <em>${escapeHtml(priority.label)}</em>
                </span>
                <span class="upcoming-bill-amount">
                  <strong>${renderMoneyValue(row.required, { compactAt: 1_000_000, label: `${row.bill.name} due amount` })}</strong>
                  <small>${escapeHtml(dueText)}</small>
                  <b>${escapeHtml(scheduleText)}</b>
                </span>
              </button>
              <button class="upcoming-bill-pay" type="button" data-pay-bill-row data-wallet-id="${row.wallet.id}" data-bucket-id="${row.bucket.id}" data-bill-name="${escapeHtml(row.bill.name)}" data-bill-amount="${Number(row.required || 0)}" aria-label="Pay ${escapeHtml(row.bill.name)} bill">
                ${renderUpcomingBillPayIcon()}
                <span>Pay</span>
              </button>
            </div>
          `;
        }).join("") : `
          <div class="upcoming-bills-empty">
            <strong>No upcoming bills yet</strong>
            <span>Add bills inside a Bills Virtual Budget Account to see dates, due amounts, and alerts here.</span>
          </div>
        `}
      </div>
      <div class="upcoming-bill-stats">
        <span><strong>${rows.length}</strong><small>Total Bills</small></span>
        <span><strong>${renderMoneyValue(totalDue, { compactAt: 1_000_000, label: "Total due" })}</strong><small>Total Due</small></span>
        <span><strong>${renderMoneyValue(details.billsSpent || 0, { compactAt: 1_000_000, label: "Paid this month" })}</strong><small>Paid This Month</small></span>
        <span><strong>${overdueCount}</strong><small>Overdue</small></span>
      </div>
    </div>
  `;
}

function getPreviousMonthLabel() {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function getMonthlyTrendPath(values, width = 160, height = 46, padding = 4) {
  return buildLiquidityChartPath(values, width, height, padding);
}

function getMonthlyTrendAreaPath(values, width = 160, height = 46, padding = 4) {
  return buildLiquidityAreaPath(values, width, height, padding);
}

function renderMonthlyTrendSvg(values) {
  const linePath = getMonthlyTrendPath(values);
  const areaPath = getMonthlyTrendAreaPath(values);
  return `
    <svg class="monthly-trend-line" viewBox="0 0 160 46" aria-hidden="true">
      <path class="monthly-trend-area" d="${areaPath}"></path>
      <path class="monthly-trend-path" d="${linePath}"></path>
      <circle cx="156" cy="${linePath ? linePath.split(" ").slice(-1)[0] : 23}" r="3.2"></circle>
    </svg>
  `;
}

function getEssentialBucketMonthlyGoal(details = {}) {
  const essentialPattern = /bill|rent|mortgage|utility|utilities|electric|water|internet|phone|insurance|food|grocery|gas|transport|medical|health|child|care/i;
  return (details.bucketRows || []).reduce((sum, row) => {
    const bucketName = String(row.bucket?.name || "");
    if (!essentialPattern.test(bucketName) && !["Bills", "Available Cashflow"].includes(row.group)) return sum;
    return sum + Math.max(Number(row.bucket?.monthlyGoal || 0), 0);
  }, 0);
}

function getMonthlyExpenseBaseline(details = {}, dashboard = {}) {
  const listedBills = Math.max(Number(details.billsRequired || 0), 0);
  if (listedBills > 0) {
    return { amount: listedBills, source: "listed bills", label: "listed bills" };
  }

  const recurringBills = (financeData.recurringBills || []).reduce((sum, bill) => sum + Math.max(Number(bill.amount || 0), 0), 0);
  if (recurringBills > 0) {
    return { amount: recurringBills, source: "recurring bills", label: "recurring bills" };
  }

  const essentialGoals = getEssentialBucketMonthlyGoal(details);
  if (essentialGoals > 0) {
    return { amount: essentialGoals, source: "monthly goals", label: "monthly goals" };
  }

  const observedOutflow = Math.max(Number(dashboard.monthSpending || 0), Number(dashboard.moneyOut || 0), 0);
  if (observedOutflow > 0) {
    return { amount: observedOutflow, source: "recorded spending", label: "recorded spending" };
  }

  return { amount: 0, source: "missing", label: "monthly expenses" };
}

function formatReserveMonths(months) {
  const value = Number(months || 0);
  if (value > 0 && value < 0.1) return "<0.1";
  return value.toFixed(1);
}

function renderMonthlyStatIcon(type) {
  const icons = {
    cashflow: '<svg class="monthly-stat-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18"/><path d="M16.5 7.5c-.8-1.2-2.1-1.9-4-1.9-2.4 0-4 1-4 2.7 0 1.8 1.7 2.4 4.2 3 2.7.7 4.3 1.5 4.3 3.7 0 2-1.8 3.4-4.5 3.4-2.2 0-4-.8-5.1-2.2"/><path d="M5 19.5h14"/></svg>',
    allocated: '<svg class="monthly-stat-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9h-9V3Z"/><path d="M15 3.6A9 9 0 0 1 20.4 9H15V3.6Z"/><path d="M7.5 15.5h4"/><path d="M7.5 18h7"/></svg>',
    reserve: '<svg class="monthly-stat-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 19 6v5.3c0 4.5-2.8 7.8-7 9.2-4.2-1.4-7-4.7-7-9.2V6l7-2.5Z"/><path d="m8.6 12.1 2.2 2.2 4.8-5"/></svg>',
    assetReserve: '<svg class="monthly-stat-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 7.2v9.1L12 21 4 16.3V7.2L12 3Z"/><path d="M12 3v18"/><path d="m4 7.2 8 4.5 8-4.5"/><path d="m8.4 14.5 3.6 2 3.6-2"/></svg>',
  };
  return icons[type] || icons.cashflow;
}

function renderOverviewPanelIcon(type) {
  const icons = {
    accounts: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4-8 4-8-4 8-4Z"/><path d="m4 12 8 4 8-4"/><path d="m4 17 8 4 8-4"/></svg>',
    average: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17h16"/><path d="M5 13c2-4 4-4 6 0s4 4 8-3"/><path d="M7 20h10"/></svg>',
    largest: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 20h10"/><path d="M9 17h6"/><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 7H5a3 3 0 0 0 3 3"/><path d="M16 7h3a3 3 0 0 1-3 3"/></svg>',
    stableRatio: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="4"/><circle cx="15.5" cy="15.5" r="4.5"/><path d="M8 5.5v5"/><path d="M5.6 8h4.8"/><path d="M15.5 12.8v5.4"/><path d="M12.9 15.5h5.2"/></svg>',
    stableCheck: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 19 6v5.2c0 4.4-2.8 7.8-7 9.3-4.2-1.5-7-4.9-7-9.3V6l7-2.5Z"/><path d="M8.5 12.3 11 14.8l4.8-5.2"/></svg>',
    bills: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="2.5"/><path d="M8 8h8"/><path d="M8 12h8"/><path d="M8 16h5"/></svg>',
    calendar: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M4 10h16"/><path d="m8.5 15 2.2 2.2 4.8-5"/></svg>',
    alert: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 21 20H3L12 4Z"/><path d="M12 9v5"/><path d="M12 17.5h.01"/></svg>',
    check: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.3 2.3 2.3 4.8-5"/></svg>',
    housing: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="m4 11 8-7 8 7"/><path d="M6.5 10.5V20h11v-9.5"/><path d="M10 20v-5h4v5"/></svg>',
    utility: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="m13 3-7 11h5l-1 7 8-12h-5l1-6Z"/></svg>',
    wifi: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 9.5a11 11 0 0 1 15 0"/><path d="M8 13a6 6 0 0 1 8 0"/><path d="M11 16.5a1.5 1.5 0 0 1 2 0"/><path d="M12 19h.01"/></svg>',
    phone: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="3" width="8" height="18" rx="2"/><path d="M11 17h2"/></svg>',
    insurance: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 19 6v5.2c0 4.4-2.8 7.8-7 9.3-4.2-1.5-7-4.9-7-9.3V6l7-2.5Z"/><path d="M12 8v7"/><path d="M8.5 11.5h7"/></svg>',
    car: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 14h14l-1.6-5A2.7 2.7 0 0 0 14.8 7H9.2a2.7 2.7 0 0 0-2.6 2L5 14Z"/><path d="M7 17h.01"/><path d="M17 17h.01"/><path d="M6 14v4"/><path d="M18 14v4"/></svg>',
    subscription: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="3"/><path d="m10 10 5 2-5 2v-4Z"/></svg>',
    flow: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h10"/><path d="m12 5 3 3-3 3"/><path d="M19 16H9"/><path d="m12 13-3 3 3 3"/></svg>',
    in: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M5 19h14"/></svg>',
    out: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V9"/><path d="m7.5 13.5 4.5-4.5 4.5 4.5"/><path d="M5 5h14"/></svg>',
    insight: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M8.5 14.5a6 6 0 1 1 7 0c-.8.7-1.2 1.4-1.4 2H9.9c-.2-.6-.6-1.3-1.4-2Z"/></svg>',
    target: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12h7"/><path d="m16 8 3-3"/></svg>',
    progress: '<svg class="overview-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V5"/><path d="M5 19h14"/><path d="M8 15l3.5-4 3 2.5L19 8"/></svg>',
  };
  return icons[type] || icons.bills;
}

function renderMonthlyDashboardStats(dashboard, details, utilization, stablecoinPercent) {
  const emergencyRow = (details.bucketRows || []).find((row) =>
    String(row.bucket?.name || "").toLowerCase().includes("emergency")
  );
  const emergencyBalance = Number(emergencyRow?.left || 0);
  const expenseBaseline = getMonthlyExpenseBaseline(details, dashboard);
  const reserveMonths = emergencyBalance > 0 && expenseBaseline.amount > 0 ? emergencyBalance / expenseBaseline.amount : 0;
  const reserveHelper = expenseBaseline.amount > 0
    ? `${formatReserveMonths(reserveMonths)} months of ${expenseBaseline.label} covered`
    : "Add bill amounts to calculate coverage";
  const reserveCompare = expenseBaseline.amount > 0
    ? `Baseline ${formatUsd(expenseBaseline.amount)}/mo`
    : "Needs monthly expense data";
  const allocationPercent = dashboard.walletBalance > 0
    ? Math.min((Number(dashboard.bucketLeft || 0) / Number(dashboard.walletBalance || 0)) * 100, 100)
    : 0;
  const assetReserveAccounts = getUserTrackedAssetAccounts();
  const assetReserveSummary = getVirtualAssetAccountsSummary(assetReserveAccounts);
  const assetReserveGain = Number(assetReserveSummary.totalGain || 0);
  const stats = [
    {
      key: "cashflow",
      accent: "cashflow",
      icon: renderMonthlyStatIcon("cashflow"),
      iconLabel: "Cashflow available funds",
      label: "Cashflow",
      valueHtml: renderMoneyValue(Math.max(details.cashflowBalance || dashboard.walletBalance || 0, 0), { compactAt: 10_000_000, label: "Cashflow" }),
      helper: "Available to allocate or spend",
      badge: dashboard.pendingIncrease > 0 ? "New funds" : "Healthy",
      compare: "Updated now",
      trend: [24, 27, 31, 29, 35, 33, 38, 42, 52, 56, 55, 63, 70],
    },
    {
      key: "allocated",
      accent: "allocated",
      icon: renderMonthlyStatIcon("allocated"),
      iconLabel: "Allocated funds",
      label: "Allocated Funds",
      valueHtml: renderMoneyValue(dashboard.bucketLeft, { compactAt: 10_000_000, label: "Allocated funds" }),
      helper: `${allocationPercent.toFixed(0)}% of total balance allocated`,
      badge: `${dashboard.bucketCount} budget account${dashboard.bucketCount === 1 ? "" : "s"}`,
      compare: "Updated now",
      trend: [20, 23, 27, 25, 33, 30, 36, 39, 50, 52, 51, 57, 66],
    },
    {
      key: "reserve",
      accent: "reserve",
      icon: renderMonthlyStatIcon("reserve"),
      iconLabel: "Emergency reserve protection",
      label: "Emergency Reserve",
      valueHtml: renderMoneyValue(emergencyBalance, { compactAt: 10_000_000, label: "Emergency reserve" }),
      helper: reserveHelper,
      badge: reserveMonths >= 3 ? "On Track" : "Build reserve",
      compare: reserveCompare,
      trend: [17, 20, 22, 28, 26, 34, 31, 38, 43, 55, 57, 59, 68],
    },
    {
      key: "assetReserve",
      accent: "asset-reserve",
      icon: renderMonthlyStatIcon("assetReserve"),
      iconLabel: "Asset reserve value",
      label: "Asset Reserve",
      valueHtml: renderMoneyValue(assetReserveSummary.totalValue, { compactAt: 10_000_000, label: "Asset reserve" }),
      helper: `${assetReserveAccounts.length} reserve wallet${assetReserveAccounts.length === 1 ? "" : "s"} tracked`,
      badge: `${assetReserveGain >= 0 ? "+" : "-"}${formatUsd(Math.abs(assetReserveGain))}`,
      compare: "Legal Core assets",
      trend: [19, 23, 28, 26, 33, 39, 37, 44, 51, 49, 58, 62, 69],
    },
  ];

  return stats.map((stat) => `
    <article class="stat-tile hero-stat monthly-stat-card fintech-stat-card accent-${stat.accent}">
      <div class="monthly-stat-main">
          <span class="monthly-stat-icon" aria-label="${escapeHtml(stat.iconLabel || stat.label)}" title="${escapeHtml(stat.iconLabel || stat.label)}">${stat.icon}</span>
          <span>
            <em>${escapeHtml(stat.label)}</em>
          <strong>${stat.valueHtml}</strong>
          <small>${escapeHtml(stat.helper)}</small>
        </span>
      </div>
      ${renderMonthlyTrendSvg(stat.trend)}
      <div class="monthly-stat-foot">
        <b>${escapeHtml(stat.badge)}</b>
        <small>${escapeHtml(stat.compare)}</small>
      </div>
    </article>
  `).join("");
}

function getMoneyFlowDisplayMetrics(moneyIn = 0, moneyOut = 0) {
  const inAmount = Math.max(Number(moneyIn || 0), 0);
  const outAmount = Math.max(Number(moneyOut || 0), 0);
  const flowTotal = inAmount + outAmount;
  const scale = Math.max(inAmount, outAmount, 1);
  const inWidth = flowTotal > 0 && inAmount > 0 ? Math.min((inAmount / scale) * 100, 100) : 0;
  const outWidth = flowTotal > 0 && outAmount > 0 ? Math.min((outAmount / scale) * 100, 100) : 0;
  const inShare = flowTotal > 0 ? Math.min((inAmount / flowTotal) * 100, 100) : 0;
  const outShare = flowTotal > 0 ? Math.min((outAmount / flowTotal) * 100, 100) : 0;
  const net = inAmount - outAmount;
  const netClass = net > 0.01 ? "positive" : net < -0.01 ? "negative" : "balanced";
  const netLabel = netClass === "positive" ? "Positive flow" : netClass === "negative" ? "Outflow ahead" : "Balanced";
  const scaleLabel = flowTotal > 0 ? `Total tracked flow: ${formatUsd(flowTotal)}` : "No tracked flow yet";
  return { inAmount, outAmount, flowTotal, scale, inWidth, outWidth, inShare, outShare, net, netClass, netLabel, scaleLabel };
}

function renderMonthlyMoneyFlowStrip(moneyIn, moneyOut) {
  const flow = getMoneyFlowDisplayMetrics(moneyIn, moneyOut);
  const cycle = getCurrentBudgetCycleSummary();
  const cycleUsed = cycle.weeklyAllocated > 0 ? Math.min((cycle.spent / cycle.weeklyAllocated) * 100, 100) : 0;
  return `
    <section class="monthly-flow-strip" aria-label="Monthly money flow">
      <div class="monthly-flow-strip-head">
        <div>
          <span>Monthly Money Flow</span>
          <small>${escapeHtml(flow.scaleLabel)}</small>
        </div>
        <strong>${renderMoneyValue(flow.net, { compactAt: 10_000_000, label: "Monthly money flow" })}</strong>
        <em class="flow-balance-pill ${escapeHtml(flow.netClass)}">${escapeHtml(flow.netLabel)}</em>
      </div>
      <p class="monthly-flow-source-note">Each bar fills by its share of total monthly flow so Money In and Money Out are measured on the same scale.</p>
      <div class="monthly-flow-strip-grid">
        <div class="monthly-flow-compact money-in">
          <span class="flow-row-icon" aria-label="Money in">${renderOverviewPanelIcon("in")}</span>
          <div class="flow-row-summary">
            <strong>Money In</strong>
            <em>${renderMoneyValue(flow.inAmount, { compactAt: 10_000_000, label: "Money in" })}</em>
          </div>
          <b>${flow.flowTotal > 0 ? `${flow.inShare.toFixed(0)}%` : "Idle"}</b>
          <i aria-label="Money in share of total monthly flow"><small style="width:${flow.inShare}%"></small></i>
          <small class="flow-scale-caption">${flow.flowTotal > 0 ? `${flow.inShare.toFixed(0)}% of total flow` : "No money in recorded"}</small>
        </div>
        <div class="monthly-flow-compact money-out">
          <span class="flow-row-icon" aria-label="Money out">${renderOverviewPanelIcon("out")}</span>
          <div class="flow-row-summary">
            <strong>Money Out</strong>
            <em>${renderMoneyValue(flow.outAmount, { compactAt: 10_000_000, label: "Money out" })}</em>
          </div>
          <b>${flow.flowTotal > 0 ? `${flow.outShare.toFixed(0)}%` : "Idle"}</b>
          <i aria-label="Money out share of total monthly flow"><small style="width:${flow.outShare}%"></small></i>
          <small class="flow-scale-caption">${flow.flowTotal > 0 ? `${flow.outShare.toFixed(0)}% of total flow` : "No money out recorded"}</small>
        </div>
      </div>
      <div class="weekly-cycle-control-card">
        <div>
          <span>Active Weekly Budget Cycle</span>
          <strong>${escapeHtml(cycle.period)}</strong>
          <small>Most budget accounts are judged weekly so staying under budget builds liquidity.</small>
        </div>
        <div>
          <span>Spent This Week</span>
          <strong>${renderMoneyValue(cycle.spent, { compactAt: 10_000_000, label: "Weekly spending" })}</strong>
          <small>${renderMoneyValue(cycle.remaining, { compactAt: 10_000_000, label: "Weekly remaining" })} remaining from active budget accounts</small>
        </div>
        <div>
          <span>Bills Exception</span>
          <strong>${renderMoneyValue(cycle.billMonthlyTarget, { compactAt: 10_000_000, label: "Monthly bill target" })}</strong>
          <small>Billing accounts follow bill due dates and monthly required amounts.</small>
        </div>
        <i class="weekly-cycle-meter"><b style="width:${cycleUsed}%"></b></i>
      </div>
    </section>
  `;
}
function getMonthlyOverviewAiInsights(dashboard, details, moneyIn, moneyOut) {
  const topSpending = details.spendingRows[0];
  const topSpendingPercent = dashboard.monthSpending > 0 && topSpending
    ? Math.min((topSpending.spent / dashboard.monthSpending) * 100, 100)
    : 0;
  const budgetProgress = dashboard.allocated > 0
    ? Math.min((dashboard.monthSpending / dashboard.allocated) * 100, 100)
    : 0;
  const smartMessage = moneyOut > moneyIn && moneyOut > 0
    ? "Money out is higher than new unallocated funds this month. Keep budget account sends categorized."
    : dashboard.monthSpending > 0
      ? "Spending is recorded and tied back to your Virtual Budget Accounts."
      : "No recorded budget account spending yet this month.";
  const insights = [{
    title: "Smart insight",
    severity: "info",
    message: smartMessage,
    action: "Monthly Dashboard",
    source: "monthly-dashboard",
  }];
  insights.push({
    title: "Top spending budget account",
    severity: topSpending ? "action" : "info",
    message: topSpending
      ? `${topSpending.bucket.name} has ${formatUsd(topSpending.spent)} recorded this month (${topSpendingPercent.toFixed(0)}% of spending).`
      : "No spending budget account has activity yet this month.",
    action: topSpending ? "Review account" : "Waiting",
    source: "monthly-dashboard",
  });
  insights.push({
    title: "Budget progress",
    severity: budgetProgress > 80 ? "warning" : "success",
    message: `${budgetProgress.toFixed(0)}% of monthly allocated funds have been used.`,
    action: "Track",
    source: "monthly-dashboard",
  });
  return insights;
}

function renderMonthlyMoneyFlowPanel({ dashboard, details, moneyIn, moneyOut, utilization }) {
  const flow = getMoneyFlowDisplayMetrics(moneyIn, moneyOut);
  const moneyInPercent = flow.inWidth;
  const moneyOutPercent = flow.outWidth;
  const topSpending = details.spendingRows[0];
  const topSpendingPercent = dashboard.monthSpending > 0 && topSpending
    ? Math.min((topSpending.spent / dashboard.monthSpending) * 100, 100)
    : 0;
  const budgetProgress = dashboard.allocated > 0
    ? Math.min((dashboard.monthSpending / dashboard.allocated) * 100, 100)
    : 0;
  const insight = moneyOut > moneyIn && moneyOut > 0
    ? "Money out is higher than new unallocated funds this month. Keep budget account sends categorized."
    : dashboard.monthSpending > 0
      ? "Spending is recorded and tied back to your Virtual Budget Accounts."
      : "No recorded budget account spending yet this month.";

  return `
    <section class="monthly-flow-panel" aria-label="Monthly money flow">
      <div class="monthly-flow-head">
        <span class="monthly-flow-icon" aria-label="Monthly money flow">${renderOverviewPanelIcon("flow")}</span>
        <div>
          <h3>Monthly Money Flow</h3>
          <p>Track monthly movement with bars scaled against the larger side</p>
        </div>
        <span class="monthly-range-pill">This Month</span>
      </div>
      <div class="monthly-flow-rows">
        <div class="monthly-flow-row money-in">
          <span class="flow-row-icon" aria-label="Money in">${renderOverviewPanelIcon("in")}</span>
          <div class="flow-row-copy">
            <strong>Money In</strong>
            <em>${formatUsd(flow.inAmount)}</em>
            <small>${flow.flowTotal > 0 ? `${flow.inShare.toFixed(0)}% of total flow / ${flow.inWidth.toFixed(0)}% of larger side` : "No money in recorded yet"}</small>
          </div>
          <b>${flow.flowTotal > 0 ? `${moneyInPercent.toFixed(0)}%` : "Idle"}</b>
          <div class="monthly-flow-track"><i style="width:${moneyInPercent}%"></i></div>
        </div>
        <div class="monthly-flow-row money-out">
          <span class="flow-row-icon" aria-label="Money out">${renderOverviewPanelIcon("out")}</span>
          <div class="flow-row-copy">
            <strong>Money Out</strong>
            <em>${formatUsd(flow.outAmount)}</em>
            <small>${flow.flowTotal > 0 ? `${flow.outShare.toFixed(0)}% of total flow / ${flow.outWidth.toFixed(0)}% of larger side` : "No money out recorded yet"}</small>
          </div>
          <b>${flow.flowTotal > 0 ? `${moneyOutPercent.toFixed(0)}%` : "Idle"}</b>
          <div class="monthly-flow-track"><i style="width:${moneyOutPercent}%"></i></div>
        </div>
      </div>
      <div class="monthly-dashboard-insights">
        <article>
          <span class="insight-icon" aria-label="Smart insight">${renderOverviewPanelIcon("insight")}</span>
          <div>
            <strong>Smart Insight</strong>
            <small>${escapeHtml(insight)}</small>
          </div>
        </article>
        <article>
          <span class="insight-icon teal" aria-label="Top spending budget account">${renderOverviewPanelIcon("target")}</span>
          <div>
            <strong>Top Spending Budget Account</strong>
            <small>${topSpending ? `${escapeHtml(topSpending.bucket.name)} ï¿½ ${formatUsd(topSpending.spent)} (${topSpendingPercent.toFixed(0)}%)` : "No spending category yet"}</small>
          </div>
        </article>
        <article>
          <span class="insight-icon violet" aria-label="Budget progress">${renderOverviewPanelIcon("progress")}</span>
          <div>
            <strong>Budget Progress</strong>
            <small>${budgetProgress.toFixed(0)}% of monthly allocation used</small>
            <i class="budget-progress-line"><b style="width:${budgetProgress}%"></b></i>
          </div>
        </article>
      </div>
    </section>
  `;
}

function getAllTransactions() {
  return getSupportedWallets().flatMap((wallet) => {
    const network = NETWORKS[wallet.network];
    return (wallet.allocation?.transactions || []).map((tx, index) => ({
      ...tx,
      id: tx.id || `${wallet.id}-tx-${index}`,
      walletId: wallet.id,
      walletName: wallet.name,
      walletAddress: wallet.address,
      asset: tx.asset || network.asset,
      network: network.label,
    }));
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function isAutomaticMoneyInTransaction(tx = {}) {
  return String(tx.type || "").toLowerCase() === "auto-allocation";
}

function getTransactionWalletMeta(tx = {}) {
  const wallet = wallets.find((item) =>
    item.id === tx.walletId
    || item.address === tx.walletAddress
    || item.name === tx.walletName
  );
  const network = NETWORKS[wallet?.network] || {};
  return {
    wallet,
    walletName: tx.walletName || wallet?.name || "Tracked wallet",
    walletAddress: tx.walletAddress || wallet?.address || "",
    networkLabel: tx.network || network.label || "Tracked network",
    asset: tx.asset || network.asset || "Asset",
  };
}

function getTransactionStatusLabel(tx = {}) {
  if (tx.status) return tx.status;
  if (tx.txHash) return "On-chain submitted";
  if (isAutomaticMoneyInTransaction(tx)) return "Wallet balance recorded";
  const direction = getTransactionFlowDirection(tx);
  if (direction === "internal") return "Internal record";
  return "AllocaFi record";
}

function getTransactionReference(tx = {}) {
  const meta = getTransactionWalletMeta(tx);
  if (tx.txHash) {
    return {
      label: "Transaction hash",
      value: tx.txHash,
      detail: "Hash returned by the connected wallet provider",
    };
  }
  if (isAutomaticMoneyInTransaction(tx)) {
    return {
      label: "Wallet address reference",
      value: meta.walletAddress || "Address unavailable",
      detail: "Public wallet address used for balance and receipt organization",
    };
  }
  return {
    label: "Local receipt reference",
    value: meta.walletAddress || getTransactionReceiptId(tx),
    detail: "Local AllocaFi record for user review",
  };
}

function getTransactionAssetAmountLabel(tx = {}) {
  const meta = getTransactionWalletMeta(tx);
  const rawAmount = Number(tx.assetAmount ?? tx.assetQuantity ?? tx.tokenAmount ?? tx.amount ?? 0);
  const amount = Math.abs(Number.isFinite(rawAmount) ? rawAmount : 0);
  const maxDigits = amount >= 1000 ? 2 : 8;
  return `${amount.toLocaleString(undefined, { maximumFractionDigits: maxDigits })} ${meta.asset}`;
}

function getTransactionDisplayTitle(tx) {
  if (isAutomaticMoneyInTransaction(tx)) return "Money In - Auto";
  if (tx.displayTitle) return tx.displayTitle;
  const bucketName = tx.bucketName && tx.bucketName !== "Unassigned spend"
    ? tx.bucketName
    : "";
  if (tx.type === "bucket-send") return `${bucketName || "Budget Account"} Release`;
  if (tx.type === "main-wallet-send-rebalanced") return "Main Wallet Release + VBA Rebalance";
  if (tx.type === "wallet-send") return "Main Wallet Send";
  if (tx.type === "bucket-removed-reallocated") return `${bucketName || "VBA"} Removed + Reallocated`;
  if (tx.type === "liquidated-vbas-removed") return "Liquidated VBAs Removed";
  if (tx.type === "personal-liquidation") return "Personal Liquidation Rebalance";
  if (tx.type === "bucket-reset") return `${bucketName || "Budget Account"} Reset`;
  if (tx.type === "virtual-transfer") return "VBA Transfer";
  return tx.note || bucketName || tx.type || "Activity";
}

function getTransactionDisplayMeta(tx) {
  if (isAutomaticMoneyInTransaction(tx)) {
    const meta = getTransactionWalletMeta(tx);
    const addressText = meta.walletAddress ? `${shortAddress(meta.walletAddress)} wallet` : "tracked wallet";
    return `${meta.asset} received on ${meta.networkLabel} - ${addressText}`;
  }
  const parts = [];
  if (tx.bucketName && !["Unassigned spend", "Main wallet send"].includes(tx.bucketName)) {
    parts.push(`${tx.bucketName} Virtual Budget Account`);
  }
  if (tx.recipient) parts.push(`To ${shortAddress(tx.recipient)}`);
  if (tx.assetAmount && tx.asset) parts.push(`${Number(tx.assetAmount).toLocaleString(undefined, { maximumFractionDigits: 8 })} ${tx.asset}`);
  if (tx.note && tx.note !== tx.displayTitle) parts.push(tx.note);
  return parts.join(" - ");
}

function getTransactionFlowDirection(tx = {}) {
  const type = String(tx.type || "").toLowerCase();
  if (type === "auto-allocation" || type.includes("allocation")) return "in";
  if (type.includes("send") || type.includes("spend") || type === "personal-liquidation") return "out";
  if (type === "virtual-transfer" || type === "bucket-reset" || type.includes("reallocated") || type.includes("rebalance") || type.includes("removed")) return "internal";
  if (Number(tx.amount || 0) < 0) return "out";
  return "out";
}

function getTransactionFlowLabel(direction = "out") {
  if (direction === "in") return "Money In";
  if (direction === "internal") return "Internal";
  return "Money Out";
}

function getTransactionReceiptId(tx = {}) {
  const date = new Date(tx.createdAt || tx.date || Date.now());
  const day = Number.isFinite(date.getTime())
    ? `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`
    : "LOCAL";
  const source = String(tx.id || tx.txHash || tx.note || "receipt").replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase() || "LOCAL";
  return `AF-${day}-${source}`;
}

function getTransactionReceiptSummary(tx = {}) {
  const direction = getTransactionFlowDirection(tx);
  const meta = getTransactionWalletMeta(tx);
  const amount = Math.abs(Number(tx.amount || 0));
  const date = new Date(tx.createdAt || tx.date || Date.now());
  const createdLabel = Number.isFinite(date.getTime()) ? date.toLocaleString() : "Local time unavailable";
  return {
    direction,
    flowLabel: getTransactionFlowLabel(direction),
    icon: direction === "out" ? "out" : direction === "internal" ? "flow" : "in",
    title: getTransactionDisplayTitle(tx),
    meta: getTransactionDisplayMeta(tx) || "AllocaFi record",
    receiptId: getTransactionReceiptId(tx),
    status: getTransactionStatusLabel(tx),
    reference: getTransactionReference(tx),
    walletName: meta.walletName,
    walletAddress: meta.walletAddress,
    networkLabel: meta.networkLabel,
    asset: meta.asset,
    amountText: `${direction === "in" ? "+" : direction === "out" ? "-" : ""}${formatUsd(amount)}`,
    assetAmountText: getTransactionAssetAmountLabel(tx),
    createdLabel,
    sourceLabel: tx.sourceLabel || (isAutomaticMoneyInTransaction(tx) ? "Detected wallet deposit" : tx.note || "AllocaFi activity"),
  };
}

function getTransactionReceiptNarrative(tx = {}) {
  if (isAutomaticMoneyInTransaction(tx)) {
    return "Money In - Auto means AllocaFi detected value entering the tracked wallet and organized it as a professional money-in receipt. The receipt is tied to the public wallet address, network, asset, recorded amount, timestamp, and AllocaFi receipt ID. AllocaFi did not custody funds, move funds, or sign a blockchain transaction.";
  }
  return "AllocaFi organizes this receipt for budgeting, tax review, and user records. It does not custody funds or replace wallet, bank, merchant, or blockchain explorer records.";
}

function formatCycleDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getCycleWindow(value = new Date(), cycle = "weekly") {
  const date = value instanceof Date ? new Date(value) : new Date(value || Date.now());
  const safeDate = Number.isFinite(date.getTime()) ? date : new Date();
  const start = new Date(safeDate);
  start.setHours(0, 0, 0, 0);
  if (cycle === "monthly") {
    start.setDate(1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end, label: `${formatCycleDate(start)} - ${formatCycleDate(end)}` };
  }
  const mondayOffset = (safeDate.getDay() + 6) % 7;
  start.setDate(start.getDate() - mondayOffset);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end, label: `${formatCycleDate(start)} - ${formatCycleDate(end)}` };
}

function getTransactionBudgetContext(tx = {}) {
  const wallet = wallets.find((item) => item.id === tx.walletId || item.address === tx.walletAddress || item.name === tx.walletName);
  const bucket = wallet?.allocation?.buckets?.find((item) =>
    item.id === tx.bucketId
    || String(item.name || "").toLowerCase() === String(tx.bucketName || "").toLowerCase()
    || String(tx.bucketName || "").toLowerCase().includes(String(item.name || "").toLowerCase())
  );
  return { wallet, bucket };
}

function getTransactionCycleInfo(tx = {}) {
  const { wallet, bucket } = getTransactionBudgetContext(tx);
  const date = new Date(tx.createdAt || tx.date || Date.now());
  const safeDate = Number.isFinite(date.getTime()) ? date : new Date();
  const flowDirection = getTransactionFlowDirection(tx);
  const bucketName = bucket?.name || tx.bucketName || "Unassigned";
  const group = getBucketGroup(bucketName);
  if (group === "Bills" && bucket) {
    const monthlyTotal = getMonthlyBillTotal(bucket);
    const bills = normalizeSubaccounts(bucket.subaccounts || []).filter((bill) => Number(bill.required || 0) > 0 || Number(bill.dueDay || 0) > 0);
    const duePreview = bills.slice(0, 2).map((bill) => `${bill.name}: ${getBillDueText(bill)}`).join(" | ");
    return {
      kind: "billing",
      label: "Billing account",
      period: duePreview || "Monthly bill schedule",
      detail: monthlyTotal > 0 ? `${formatUsd(monthlyTotal)} monthly bill plan` : "Bill account schedule",
    };
  }
  if (flowDirection === "internal" && String(tx.type || "").toLowerCase() === "bucket-reset") {
    const cycle = bucket?.rules?.reset && bucket.rules.reset !== "never" ? bucket.rules.reset : wallet?.allocation?.cycle || "weekly";
    const window = getCycleWindow(safeDate, cycle === "monthly" ? "monthly" : "weekly");
    return { kind: "cycle-close", label: "Cycle close", period: window.label, detail: `Closed ${cycle || "weekly"} budget cycle` };
  }
  const cycle = bucket?.rules?.reset && bucket.rules.reset !== "never"
    ? bucket.rules.reset
    : wallet?.allocation?.cycle || "weekly";
  const normalizedCycle = cycle === "monthly" ? "monthly" : "weekly";
  const window = getCycleWindow(safeDate, normalizedCycle);
  return {
    kind: normalizedCycle,
    label: normalizedCycle === "monthly" ? "Monthly cycle" : "Weekly budget cycle",
    period: window.label,
    detail: normalizedCycle === "weekly"
      ? "Budget accounts are measured one week at a time"
      : "Monthly budget rule",
  };
}

function getCurrentBudgetCycleSummary() {
  const window = getCycleWindow(new Date(), "weekly");
  let spent = 0;
  let moneyIn = 0;
  let internal = 0;
  getAllTransactions().forEach((tx) => {
    const date = new Date(tx.createdAt || tx.date || 0);
    if (!Number.isFinite(date.getTime()) || date < window.start || date > window.end) return;
    const { bucket } = getTransactionBudgetContext(tx);
    if (getBucketGroup(bucket?.name || tx.bucketName || "") === "Bills") return;
    const amount = Math.abs(Number(tx.amount || 0));
    const direction = getTransactionFlowDirection(tx);
    if (direction === "out") spent += amount;
    else if (direction === "in") moneyIn += amount;
    else internal += amount;
  });
  const weeklyAllocated = getSupportedWallets().reduce((sum, wallet) => sum + (wallet.allocation?.buckets || []).reduce((bucketSum, bucket) => {
    return getBucketGroup(bucket.name) === "Bills" ? bucketSum : bucketSum + Number(bucket.allocated || 0);
  }, 0), 0);
  const billMonthlyTarget = getSupportedWallets().reduce((sum, wallet) => sum + (wallet.allocation?.buckets || []).reduce((bucketSum, bucket) => {
    return getBucketGroup(bucket.name) === "Bills" ? bucketSum + getMonthlyBillTotal(bucket) : bucketSum;
  }, 0), 0);
  return {
    period: window.label,
    spent,
    moneyIn,
    internal,
    weeklyAllocated,
    remaining: Math.max(weeklyAllocated - spent, 0),
    billMonthlyTarget,
  };
}
function getNetworkFamilyKey(networkKey = "") {
  const network = NETWORKS[networkKey];
  if (!network) return "";
  if (network.kind?.startsWith("evm")) return `evm:${EVM_CHAINS[networkKey] || network.label}`;
  if (network.kind?.startsWith("solana")) return "solana";
  return network.kind || networkKey;
}

function isAddressBookNetworkCompatible(entryNetwork = "", targetNetwork = "") {
  if (!entryNetwork || !targetNetwork) return true;
  if (entryNetwork === targetNetwork) return true;
  const entryFamily = getNetworkFamilyKey(entryNetwork);
  const targetFamily = getNetworkFamilyKey(targetNetwork);
  return Boolean(entryFamily && targetFamily && entryFamily === targetFamily);
}

function getAddressBookNetworkLabel(entry, targetNetworkKey = "") {
  if (!entry?.network) return "Any matching network";
  const network = NETWORKS[entry.network];
  if (!network) return "Saved network";
  if (targetNetworkKey && entry.network !== targetNetworkKey && isAddressBookNetworkCompatible(entry.network, targetNetworkKey)) {
    return `${network.asset} on ${network.label} compatible`;
  }
  return `${network.asset} on ${network.label}`;
}

function findAddressBookEntry(address, networkKey = "") {
  const normalizedAddress = String(address || "").toLowerCase();
  return addressBook.find((entry) =>
    String(entry.address || "").toLowerCase() === normalizedAddress
    && isAddressBookNetworkCompatible(entry.network, networkKey)
  );
}

function getBankTotals() {
  const accounts = financeData.bankAccounts || [];
  const activeAccounts = accounts.filter((account) => account.status !== "Disconnected");
  const total = activeAccounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);
  return { accounts: activeAccounts, total };
}

function getCryptoTotals() {
  const stableAssets = new Set(["USDC", "USDT", "PYUSD", "USDS", "FDUSD"]);
  return getSupportedWallets().reduce((totals, wallet) => {
    const network = NETWORKS[wallet.network];
    const value = getUsdValue(wallet);
    totals.total += value;
    if (stableAssets.has(network?.asset)) totals.stablecoins += value;
    return totals;
  }, { total: 0, stablecoins: 0 });
}

function getUnifiedTransactions() {
  const cryptoTransactions = getAllTransactions().map((tx) => ({
    id: tx.id || crypto.randomUUID(),
    sourceType: "crypto",
    sourceAccount: tx.walletName,
    accountId: tx.walletAddress,
    amount: -Math.abs(Number(tx.amount || 0)),
    displayAmount: Math.abs(Number(tx.amount || 0)),
    category: tx.bucketName || "Uncategorized",
    bucketName: tx.bucketName || "Uncategorized",
    merchantLabel: tx.recipient ? shortAddress(tx.recipient) : tx.note || tx.txHash || "Wallet activity",
    status: tx.txHash ? "Completed" : "Local",
    date: tx.createdAt || new Date().toISOString(),
    notes: tx.note || tx.txHash || "",
  }));

  const bankTransactions = (financeData.bankTransactions || []).map((tx) => ({
    ...tx,
    sourceType: "bank",
    sourceAccount: financeData.bankAccounts.find((account) => account.id === tx.accountId)?.name || "Bank account",
    displayAmount: Math.abs(Number(tx.amount || 0)),
    status: tx.pending ? "Pending" : "Completed",
    date: tx.date || tx.createdAt,
  }));

  const manualTransactions = (financeData.manualTransactions || []).map((tx) => ({
    ...tx,
    sourceType: "manual",
    sourceAccount: tx.sourceAccount || "Manual entry",
    displayAmount: Math.abs(Number(tx.amount || 0)),
    status: tx.status || "Local",
    date: tx.date || tx.createdAt,
  }));

  return [...bankTransactions, ...cryptoTransactions, ...manualTransactions]
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
}

function getUnifiedSummary() {
  const dashboard = getMonthlyDashboard();
  const bank = getBankTotals();
  const crypto = getCryptoTotals();
  const transactions = getUnifiedTransactions();
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentMonthTransactions = transactions.filter((tx) => String(tx.date || tx.createdAt || "").startsWith(monthKey));
  const moneyIn = currentMonthTransactions
    .filter((tx) => Number(tx.amount || 0) > 0)
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0) + dashboard.pendingIncrease;
  const moneyOut = Math.abs(currentMonthTransactions
    .filter((tx) => Number(tx.amount || 0) < 0)
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)) + dashboard.moneyOut;
  const connectedWallets = getSupportedWallets().length;
  const activeBuckets = (financeData.unifiedBuckets || []).length + dashboard.bucketCount;
  return {
    netWorth: bank.total + crypto.total,
    bankTotal: bank.total,
    cryptoTotal: crypto.total,
    stablecoinTotal: crypto.stablecoins,
    moneyIn,
    moneyOut,
    monthlyIncome: moneyIn,
    monthlySpending: moneyOut,
    activeBuckets,
    connectedWallets,
    connectedBankAccounts: bank.accounts.length,
    transactions,
    currentMonthTransactions,
  };
}

function suggestCategoryForMerchant(label) {
  const normalized = String(label || "").toLowerCase();
  const rule = (financeData.categoryRules || []).find((item) => normalized.includes(String(item.match || "").toLowerCase()));
  if (rule) return rule;
  if (normalized.includes("payroll") || normalized.includes("deposit")) return { category: "Income", bucketName: "Available Cashflow" };
  if (normalized.includes("walmart") || normalized.includes("grocery")) return { category: "Food", bucketName: "Food" };
  if (normalized.includes("gas") || normalized.includes("shell")) return { category: "Gas", bucketName: "Gas" };
  if (normalized.includes("rent") || normalized.includes("electric") || normalized.includes("utility")) return { category: "Bills", bucketName: "Bills" };
  return { category: "Uncategorized", bucketName: "" };
}

function getAllocationSuggestion(amount) {
  const split = [
    ["Bills", 40],
    ["Savings", 20],
    ["Food", 15],
    ["Gas", 10],
    ["Personal", 10],
    ["Investments", 5],
  ];
  return split.map(([name, percent]) => ({
    name,
    percent,
    amount: Number(amount || 0) * (percent / 100),
  }));
}

function getUnifiedInsights() {
  const summary = getUnifiedSummary();
  const bankSpend = summary.currentMonthTransactions
    .filter((tx) => tx.sourceType === "bank" && Number(tx.amount || 0) < 0)
    .reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0);
  const cryptoSpend = summary.currentMonthTransactions
    .filter((tx) => tx.sourceType === "crypto")
    .reduce((sum, tx) => sum + Math.abs(Number(tx.amount || 0)), 0);
  const billsRequired = (financeData.recurringBills || []).reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
  const billsBucket = (financeData.unifiedBuckets || []).find((bucket) => bucket.name === "Bills");
  const billsLeft = Math.max(Number(billsBucket?.allocated || 0) - Number(billsBucket?.spent || 0), 0);
  const insights = [];

  if (summary.connectedBankAccounts === 0) insights.push("Connect a bank account when ready to see bank income and card spending beside crypto activity.");
  if (summary.stablecoinTotal > 0) insights.push(`${formatUsd(summary.stablecoinTotal)} is tracked in stablecoins. Keep budget account assignments updated after wallet sends.`);
  if (billsRequired > billsLeft) insights.push(`Your Bills budget account may be short by ${formatUsd(billsRequired - billsLeft)} based on upcoming recurring payments.`);
  if (bankSpend > cryptoSpend && bankSpend > 0) insights.push("Most spending this month is coming from bank activity, so bank categories should drive your monthly budget.");
  if (cryptoSpend > bankSpend && cryptoSpend > 0) insights.push("Most spending this month is coming from crypto activity, so budget account sends should auto-record against the selected account.");
  if (summary.moneyIn > 0) insights.push(`New income detected: ${formatUsd(summary.moneyIn)}. Suggested allocation can split it into Bills, Savings, Food, Gas, Personal, and Investments.`);
  if (!insights.length) insights.push("AllocaFi is ready. Add bank accounts, wallets, or family/business plans to unlock deeper insights.");
  return insights.slice(0, 8);
}

function renderUnifiedFinance() {
  if (!unifiedStats || !unifiedDashboard) return;
  const summary = getUnifiedSummary();
  const insights = getUnifiedInsights();
  const transactions = summary.transactions.slice(0, 8);
  const suggestedAmount = summary.moneyIn || 1200;
  const suggestion = getAllocationSuggestion(suggestedAmount);
  const bucketRows = (financeData.unifiedBuckets || []).slice(0, 8);

  unifiedStats.innerHTML = [
    ["Net Worth", formatUsd(summary.netWorth), "Bank plus crypto value"],
    ["Bank Balance", formatUsd(summary.bankTotal), `${summary.connectedBankAccounts} bank account${summary.connectedBankAccounts === 1 ? "" : "s"}`],
    ["Crypto Balance", formatUsd(summary.cryptoTotal), `${summary.connectedWallets} crypto wallet${summary.connectedWallets === 1 ? "" : "s"}`],
    ["Stablecoins", formatUsd(summary.stablecoinTotal), "USDC, PYUSD, USDT, DAI, FDUSD"],
    ["Money In", formatUsd(summary.moneyIn), "Deposits and detected new funds"],
    ["Money Out", formatUsd(summary.moneyOut), "Bank, crypto, and manual spending"],
    ["Active Budget Accounts", String(summary.activeBuckets), "Wallet and unified Virtual Budget Accounts"],
    ["Recent Activity", String(summary.transactions.length), "Unified transaction records"],
  ].map(([label, value, helper]) => `
    <div class="stat-tile hero-stat">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${helper}</small>
    </div>
  `).join("");

  unifiedDashboard.innerHTML = `
    <div class="overview-card flow-card">
      <div class="overview-card-head"><span>Bank + Crypto Mix</span><strong>${formatUsd(summary.netWorth)}</strong></div>
      <div class="flow-bars">
        <div><span>Bank</span><strong>${formatUsd(summary.bankTotal)}</strong><div class="mini-meter in"><i style="width:${summary.netWorth ? Math.min((summary.bankTotal / summary.netWorth) * 100, 100) : 0}%"></i></div></div>
        <div><span>Crypto</span><strong>${formatUsd(summary.cryptoTotal)}</strong><div class="mini-meter stable"><i style="width:${summary.netWorth ? Math.min((summary.cryptoTotal / summary.netWorth) * 100, 100) : 0}%"></i></div></div>
      </div>
    </div>
    <div class="overview-card">
      <div class="overview-card-head"><span>Auto Allocation Suggestion</span><strong>${formatUsd(suggestedAmount)}</strong></div>
      <div class="overview-list">
        ${suggestion.map((row) => `<div class="overview-row"><span>${row.name} ${row.percent}%</span><strong>${formatUsd(row.amount)}</strong><div class="mini-meter"><i style="width:${row.percent}%"></i></div></div>`).join("")}
      </div>
    </div>
    <div class="overview-card">
      <div class="overview-card-head"><span>Unified Budget Accounts</span><strong>${bucketRows.length}</strong></div>
      <div class="overview-list">
        ${bucketRows.map((bucket) => {
          const allocated = Number(bucket.allocated || 0);
          const spent = Number(bucket.spent || 0);
          const progress = bucket.monthlyGoal > 0 ? Math.min((allocated / Number(bucket.monthlyGoal)) * 100, 100) : 0;
          return `<div class="overview-row"><span>${escapeHtml(bucket.name)}</span><strong>${formatUsd(Math.max(allocated - spent, 0))}</strong><div class="mini-meter"><i style="width:${progress}%"></i></div></div>`;
        }).join("")}
      </div>
    </div>
    <div class="overview-card">
      <div class="overview-card-head"><span>Recent Transactions</span><strong>${transactions.length}</strong></div>
      <div class="overview-list">
        ${transactions.length ? transactions.map((tx) => `<div class="overview-row compact"><span>${escapeHtml(tx.merchantLabel || tx.category || "Activity")} ï¿½ ${escapeHtml(tx.sourceType)}</span><strong>${formatUsd(Number(tx.amount || 0))}</strong></div>`).join("") : `<p class="wallet-note">No unified transactions yet.</p>`}
      </div>
    </div>
    <div class="overview-card insight-card">
      <div class="overview-card-head"><span>AI Budget Insights</span><strong>${insights.length}</strong></div>
      <div class="overview-list">${insights.map((insight) => `<div class="overview-row compact"><span>${escapeHtml(insight)}</span></div>`).join("")}</div>
    </div>
  `;
}

function renderConnectAccounts() {
  if (!connectAccountsView) return;
  const bank = getBankTotals();
  connectAccountsView.innerHTML = `
    <div class="overview-card">
      <div class="overview-card-head"><span>Plaid Bank Connection</span><strong>${bank.accounts.length ? "Connected" : "Ready"}</strong></div>
      <p class="wallet-note">This MVP creates a local Plaid-style bank profile for testing. Production Plaid Link needs backend token exchange and encrypted token storage.</p>
      <div class="rule-list">
        <span class="rule-pill">No access tokens in frontend</span>
        <span class="rule-pill">Balances + transactions only</span>
        <span class="rule-pill">Disconnect required</span>
        <span class="rule-pill">Sandbox mode ready</span>
      </div>
    </div>
    <div class="overview-card">
      <div class="overview-card-head"><span>Crypto Wallets</span><strong>${wallets.length}</strong></div>
      <p class="wallet-note">Crypto remains non-custodial. AllocaFi reads public balances and sends only through user-approved wallet signing.</p>
      <button class="secondary-button" type="button" id="connectGoWallets">Open Wallets</button>
    </div>
    <div class="overview-card">
      <div class="overview-card-head"><span>Security Boundary</span><strong>View only</strong></div>
      <p class="wallet-note">AllocaFi is not a bank, not a money transmitter, and does not custody funds. Bank data is used for budgeting and insights.</p>
    </div>
  `;
  connectAccountsView.querySelector("#connectGoWallets")?.addEventListener("click", () => switchTab("wallets"));
}

function normalizeConnectWallet(address = "") {
  return String(address || "").trim();
}

function getConnectWalletKey(address = "") {
  return normalizeConnectWallet(address).toLowerCase();
}

function connectWalletMatches(left = "", right = "") {
  return Boolean(left && right && getConnectWalletKey(left) === getConnectWalletKey(right));
}

function getConnectIdentityLabel(profile = allocafiConnectState.profile) {
  if (profile.displayName) return profile.displayName;
  if (profile.username) return `@${profile.username}`;
  return profile.walletAddress ? shortAddress(profile.walletAddress) : "Connect identity";
}

function getConnectActiveWalletCandidate() {
  if (connectedSolanaAccount) return { walletAddress: connectedSolanaAccount, chain: "solana", provider: connectedSolanaWalletLabel || "Solana Wallet" };
  if (connectedAccount) return { walletAddress: connectedAccount, chain: "evm", provider: connectedWalletLabel || "EVM Wallet" };
  const selectedWallet = wallets.find((wallet) => wallet.id === selectedWalletId) || wallets[0];
  if (!selectedWallet?.address) return null;
  return { walletAddress: selectedWallet.address, chain: getVaultChainForNetwork(selectedWallet.network), provider: NETWORKS[selectedWallet.network]?.label || "Saved wallet" };
}

function getConnectVerificationMessage(walletAddress) {
  return `AllocaFi Connect verification: I confirm that I own this wallet address and want to activate secure communication inside AllocaFi. This request does not authorize transactions or give AllocaFi access to my funds.\n\nWallet: ${walletAddress}\nTimestamp: ${new Date().toISOString()}`;
}

async function requestConnectWalletSignature(profile) {
  const message = getConnectVerificationMessage(profile.walletAddress);
  if (profile.chain === "solana") {
    const provider = await getSolanaProvider();
    const activeAddress = connectedSolanaAccount || provider.publicKey?.toString?.();
    if (!connectWalletMatches(activeAddress, profile.walletAddress)) throw new Error("Connected Solana wallet does not match this Connect identity");
    if (!provider.signMessage) throw new Error("This Solana wallet does not support message signing");
    const result = await provider.signMessage(textToBytes(message), "utf8");
    const signature = result?.signature || result;
    return { signature: bytesToBase64(signature instanceof Uint8Array ? signature : new Uint8Array(signature)), encoding: "base64", message };
  }

  const provider = walletProvider === "auto" ? await getEthereumProvider() : await connectWalletProvider(walletProvider);
  const providerLabel = walletProvider === "auto" ? connectedWalletLabel || "wallet" : labelForEthereumProvider(provider, walletProvider);
  const accounts = await getEthereumAccounts(provider, providerLabel);
  const activeAddress = accounts?.[0] || connectedAccount;
  if (!connectWalletMatches(activeAddress, profile.walletAddress)) throw new Error("Connected EVM wallet does not match this Connect identity");
  const signature = await requestWalletWithTimeout(
    provider,
    { method: "personal_sign", params: [textToHex(message), activeAddress] },
    WALLET_CONNECT_TIMEOUT_MS,
    "AllocaFi Connect verification timed out. Approve or reject the request in your wallet.",
  );
  return { signature, encoding: "hex", message };
}

function scanSecurityPhrases(message = "") {
  const normalized = String(message || "").toLowerCase();
  return CONNECT_SECURITY_PHRASES.filter((phrase) => normalized.includes(phrase));
}

function validateSafeMessage(message = "") {
  const riskyPhrases = scanSecurityPhrases(message);
  if (!riskyPhrases.length) return true;
  return window.confirm("Sensitive security phrase detected. Never share wallet recovery details. Send anyway?");
}

function isConnectLinkWarningNeeded(message = "") {
  return /https?:\/\/|www\.|\.com|\.io|\.xyz|\.app/i.test(String(message || ""));
}

function validateEncryptedPayload(payload) {
  return Boolean(payload && payload.version && payload.iv && payload.ciphertext && payload.algorithm);
}

function generateConversationKey() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return bytesToBase64(bytes);
}

async function importConnectConversationKey(keyBase64) {
  return crypto.subtle.importKey("raw", base64ToBytes(keyBase64), { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

async function encryptMessage(message, keyBase64) {
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const key = await importConnectConversationKey(keyBase64);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, textToBytes(message));
  return {
    version: "connect-dev-aes-gcm-v1",
    algorithm: "AES-GCM",
    devOnly: true,
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(encrypted)),
  };
}

async function decryptMessage(encryptedPayload, keyBase64) {
  if (!validateEncryptedPayload(encryptedPayload)) throw new Error("Encrypted payload is invalid");
  const key = await importConnectConversationKey(keyBase64);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64ToBytes(encryptedPayload.iv) }, key, base64ToBytes(encryptedPayload.ciphertext));
  return bytesToText(new Uint8Array(decrypted));
}

function getConnectConversationKey(conversationId) {
  allocafiConnectState.conversationKeys = allocafiConnectState.conversationKeys || {};
  if (!allocafiConnectState.conversationKeys[conversationId]) {
    allocafiConnectState.conversationKeys[conversationId] = generateConversationKey();
  }
  return allocafiConnectState.conversationKeys[conversationId];
}

function getConnectConversationId(walletA, walletB) {
  const [left, right] = [getConnectWalletKey(walletA), getConnectWalletKey(walletB)].sort();
  return `connect-thread-${left}-${right}`;
}

function getConnectBlockedRecord(walletAddress) {
  const key = getConnectWalletKey(walletAddress);
  return allocafiConnectState.blockedAddresses.find((item) => getConnectWalletKey(item.blockedWallet) === key);
}

function isConnectBlocked(walletAddress) {
  return Boolean(getConnectBlockedRecord(walletAddress));
}

function getConnectConversationByParticipant(walletAddress) {
  const profileWallet = allocafiConnectState.profile.walletAddress;
  const conversationId = getConnectConversationId(profileWallet, walletAddress);
  return allocafiConnectState.conversations.find((item) => item.id === conversationId);
}

function resolveConnectRecipient(input = "") {
  const value = normalizeConnectWallet(input);
  if (!value) return "";
  const normalized = value.replace(/^@/, "").toLowerCase();
  const contact = allocafiConnectState.contacts.find((entry) => {
    const username = String(entry.contactUsername || "").replace(/^@/, "").toLowerCase();
    const nickname = String(entry.nickname || "").replace(/^@/, "").toLowerCase();
    return username === normalized || nickname === normalized || connectWalletMatches(entry.contactWallet, value);
  });
  if (contact?.contactWallet) return normalizeConnectWallet(contact.contactWallet);
  if (String(allocafiConnectState.profile?.username || "").replace(/^@/, "").toLowerCase() === normalized) {
    return normalizeConnectWallet(allocafiConnectState.profile.walletAddress);
  }
  return value;
}

function upsertConnectConversation(recipientWallet, options = {}) {
  const profile = allocafiConnectState.profile;
  const conversationId = getConnectConversationId(profile.walletAddress, recipientWallet);
  let conversation = allocafiConnectState.conversations.find((item) => item.id === conversationId);
  if (!conversation) {
    conversation = {
      id: conversationId,
      participantWallets: [profile.walletAddress, recipientWallet],
      participantUserIds: [profile.id, options.recipientUserId || ""],
      lastMessageAt: "",
      lastMessagePreviewEncrypted: "",
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mutedBy: [],
      blockedStatus: "clear",
    };
    allocafiConnectState.conversations.unshift(conversation);
  }
  getConnectConversationKey(conversationId);
  return conversation;
}

function getConnectInbox() {
  return [...allocafiConnectState.conversations].sort((left, right) => Date.parse(right.lastMessageAt || right.updatedAt || 0) - Date.parse(left.lastMessageAt || left.updatedAt || 0));
}

function getConnectMessages(conversationId) {
  return allocafiConnectState.messages
    .filter((message) => message.conversationId === conversationId && !message.deletedBySender && !message.deletedByRecipient)
    .sort((left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt));
}

async function sendConnectMessage(recipientInput, messageText) {
  const profile = allocafiConnectState.profile;
  const recipientWallet = resolveConnectRecipient(recipientInput);
  if (!profile.walletAddress || !profile.verified) throw new Error("Verify your AllocaFi Connect wallet identity first");
  if (!recipientWallet) throw new Error("Enter a recipient wallet or username");
  if (connectWalletMatches(profile.walletAddress, recipientWallet)) throw new Error("Enter a different recipient wallet");
  if (isConnectBlocked(recipientWallet)) throw new Error("You blocked this wallet address");
  if (!messageText.trim()) throw new Error("Enter a message");
  if (!validateSafeMessage(messageText)) throw new Error("Message cancelled");
  if (isConnectLinkWarningNeeded(messageText) && !window.confirm("This message contains a link. Only send links you trust.")) throw new Error("Message cancelled");

  const conversation = upsertConnectConversation(recipientWallet);
  const key = getConnectConversationKey(conversation.id);
  const encryptedPayload = await encryptMessage(messageText, key);
  const previewHash = await sha256Hex(messageText.slice(0, 80));
  const now = new Date().toISOString();
  const message = {
    id: crypto.randomUUID(),
    conversationId: conversation.id,
    senderWallet: profile.walletAddress,
    recipientWallet,
    senderUserId: profile.id,
    recipientUserId: "",
    encryptedPayload,
    plaintextPreviewHash: previewHash,
    messageType: "text",
    deliveryStatus: "delivered_local_beta",
    readStatus: "unread",
    createdAt: now,
    updatedAt: now,
    deletedBySender: false,
    deletedByRecipient: false,
    protocolSource: "allocafi-connect-dev-encryption",
  };
  allocafiConnectState.messages.push(message);
  conversation.lastMessageAt = now;
  conversation.lastMessagePreviewEncrypted = encryptedPayload.ciphertext.slice(0, 64);
  conversation.updatedAt = now;
  saveAllocaFiConnectState();
  createConnectNotification("new_message", "Message sent", `Encrypted message delivered to ${shortAddress(recipientWallet)}.`);
  return message;
}

function createConnectNotification(type, title, body, metadata = {}) {
  allocafiConnectState.notifications.unshift({
    id: crypto.randomUUID(),
    userId: allocafiConnectState.profile.id,
    type,
    title,
    body,
    read: false,
    metadata,
    createdAt: new Date().toISOString(),
  });
  allocafiConnectState.notifications = allocafiConnectState.notifications.slice(0, 80);
}

function blockWalletAddress(walletAddress, reason = "User blocked") {
  const normalized = normalizeConnectWallet(walletAddress);
  if (!normalized || isConnectBlocked(normalized)) return;
  allocafiConnectState.blockedAddresses.unshift({
    id: crypto.randomUUID(),
    blockerUserId: allocafiConnectState.profile.id,
    blockedWallet: normalized,
    blockedUserId: "",
    reason,
    createdAt: new Date().toISOString(),
  });
  allocafiConnectState.contacts = allocafiConnectState.contacts.map((contact) => connectWalletMatches(contact.contactWallet, normalized) ? { ...contact, status: "blocked" } : contact);
  saveAllocaFiConnectState();
}

function unblockWalletAddress(walletAddress) {
  allocafiConnectState.blockedAddresses = allocafiConnectState.blockedAddresses.filter((item) => !connectWalletMatches(item.blockedWallet, walletAddress));
  saveAllocaFiConnectState();
}

function reportMessage(messageId, reportType = "other", description = "") {
  const message = allocafiConnectState.messages.find((item) => item.id === messageId);
  const reportedWallet = message?.senderWallet && !connectWalletMatches(message.senderWallet, allocafiConnectState.profile.walletAddress)
    ? message.senderWallet
    : message?.recipientWallet || "";
  allocafiConnectState.reports.unshift({
    id: crypto.randomUUID(),
    reporterUserId: allocafiConnectState.profile.id,
    reportedWallet,
    reportedUserId: "",
    reportType,
    messageId,
    description,
    status: "open",
    createdAt: new Date().toISOString(),
  });
  saveAllocaFiConnectState();
}

function deleteConversationLocal(conversationId) {
  allocafiConnectState.messages = allocafiConnectState.messages.map((message) => message.conversationId === conversationId
    ? {
      ...message,
      deletedBySender: connectWalletMatches(message.senderWallet, allocafiConnectState.profile.walletAddress) || message.deletedBySender,
      deletedByRecipient: connectWalletMatches(message.recipientWallet, allocafiConnectState.profile.walletAddress) || message.deletedByRecipient,
    }
    : message);
  saveAllocaFiConnectState();
}

function sendContactRequest(contactWallet, nickname = "") {
  const wallet = normalizeConnectWallet(contactWallet);
  if (!wallet) throw new Error("Enter a wallet address");
  if (connectWalletMatches(wallet, allocafiConnectState.profile.walletAddress)) throw new Error("Cannot add your own wallet");
  if (isConnectBlocked(wallet)) throw new Error("Unblock this wallet before sending a request");
  const existing = allocafiConnectState.contacts.find((contact) => connectWalletMatches(contact.contactWallet, wallet));
  if (existing) return existing;
  const contact = {
    id: crypto.randomUUID(),
    ownerUserId: allocafiConnectState.profile.id,
    contactUserId: "",
    contactWallet: wallet,
    contactUsername: "",
    nickname,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  allocafiConnectState.contacts.unshift(contact);
  allocafiConnectState.requests.unshift({
    id: crypto.randomUUID(),
    type: "contact_request",
    fromUserId: allocafiConnectState.profile.id,
    toUserId: "",
    fromWallet: allocafiConnectState.profile.walletAddress,
    toWallet: wallet,
    status: "pending",
    payloadEncrypted: "local-contact-request-placeholder",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  saveAllocaFiConnectState();
  return contact;
}

function updateContactStatus(contactId, status) {
  allocafiConnectState.contacts = allocafiConnectState.contacts.map((contact) => contact.id === contactId ? { ...contact, status, updatedAt: new Date().toISOString() } : contact);
  saveAllocaFiConnectState();
}

function createConnectPeerConnection() {
  if (!("RTCPeerConnection" in window)) throw new Error("Browser does not support WebRTC");
  return new RTCPeerConnection({
    iceServers: [
      ...(allocafiConnectState.settings.stunServers || []).map((urls) => ({ urls })),
      // TURN credentials must be delivered by a backend endpoint as short-lived credentials in production.
    ],
  });
}

function startVoiceCall(recipientWallet) {
  const recipient = normalizeConnectWallet(recipientWallet);
  if (!allocafiConnectState.profile.verified) throw new Error("Verify your Connect wallet before calling");
  if (!recipient) throw new Error("Enter a recipient wallet");
  if (isConnectBlocked(recipient)) throw new Error("You blocked this wallet");
  let peerConnection = null;
  try {
    peerConnection = createConnectPeerConnection();
    peerConnection.close();
  } catch (error) {
    const call = {
      id: crypto.randomUUID(),
      callerUserId: allocafiConnectState.profile.id,
      callerWallet: allocafiConnectState.profile.walletAddress,
      recipientUserId: "",
      recipientWallet: recipient,
      callType: "voice",
      callStatus: "failed",
      startedAt: new Date().toISOString(),
      answeredAt: "",
      endedAt: new Date().toISOString(),
      durationSeconds: 0,
      missed: false,
      declined: false,
      failureReason: error.message || "WebRTC unavailable",
    };
    allocafiConnectState.calls.unshift(call);
    saveAllocaFiConnectState();
    throw error;
  }
  const call = {
    id: crypto.randomUUID(),
    callerUserId: allocafiConnectState.profile.id,
    callerWallet: allocafiConnectState.profile.walletAddress,
    recipientUserId: "",
    recipientWallet: recipient,
    callType: "voice",
    callStatus: "ringing",
    startedAt: new Date().toISOString(),
    answeredAt: "",
    endedAt: "",
    durationSeconds: 0,
    missed: false,
    declined: false,
    failureReason: "",
  };
  allocafiConnectState.calls.unshift(call);
  allocafiConnectState.callSignals.unshift({
    id: crypto.randomUUID(),
    callId: call.id,
    fromUserId: allocafiConnectState.profile.id,
    toUserId: "",
    signalType: "call_invite",
    signalPayload: { callType: "voice", recipientWallet: recipient },
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
  });
  createConnectNotification("incoming_call", "Voice call invite created", `Calling ${shortAddress(recipient)} inside AllocaFi Connect.`, { callId: call.id });
  saveAllocaFiConnectState();
  return call;
}

function updateConnectCall(callId, status) {
  const now = new Date().toISOString();
  allocafiConnectState.calls = allocafiConnectState.calls.map((call) => {
    if (call.id !== callId) return call;
    const started = Date.parse(call.answeredAt || call.startedAt || now);
    return {
      ...call,
      callStatus: status,
      answeredAt: status === "active" ? now : call.answeredAt,
      endedAt: ["ended", "declined", "missed"].includes(status) ? now : call.endedAt,
      durationSeconds: status === "ended" ? Math.max(Math.round((Date.now() - started) / 1000), 0) : call.durationSeconds,
      missed: status === "missed",
      declined: status === "declined",
    };
  });
  saveAllocaFiConnectState();
}

function renderConnectWalletBadge() {
  const profile = allocafiConnectState.profile;
  return `<span class="connect-verified-badge ${profile.verified ? "verified" : "beta"}">${profile.verified ? "Verified Wallet" : "Signature Needed"}</span>`;
}

function renderAllocaFiConnect() {
  if (!allocafiConnectView) return;
  const profile = allocafiConnectState.profile;
  const unread = allocafiConnectState.messages.filter((message) => message.readStatus !== "read" && connectWalletMatches(message.recipientWallet, profile.walletAddress)).length;
  const latestCall = allocafiConnectState.calls[0];
  allocafiConnectView.innerHTML = `
    <section class="allocafi-connect-shell">
      <header class="connect-hero">
        <div class="connect-hero-copy">
          <span class="connect-kicker">AllocaFi Connect Beta</span>
          <h2>Secure wallet messaging and app-to-app calls</h2>
          <p>Communicate through verified wallet identity. No phone numbers, no SMS, no carrier calling, and no emergency calling.</p>
          <div class="connect-chip-row">
            ${renderConnectWalletBadge()}
            <span>Messaging ${ALLOCAFI_CONNECT_FEATURE_FLAGS.connect_messaging_enabled ? "on" : "off"}</span>
            <span>Voice beta ${ALLOCAFI_CONNECT_FEATURE_FLAGS.connect_voice_calls_enabled ? "on" : "off"}</span>
            <span>Video locked</span>
          </div>
        </div>
        <aside class="connect-identity-card">
          <span class="connect-lock-icon">${renderOverviewPanelIcon("stableCheck")}</span>
          <div>
            <small>Connected Wallet Identity</small>
            <strong>${escapeHtml(getConnectIdentityLabel(profile))}</strong>
            <span>${profile.walletAddress ? escapeHtml(shortAddress(profile.walletAddress)) : "No Connect wallet yet"}</span>
          </div>
          <button class="secondary-button" data-connect-profile type="button">${profile.walletAddress ? "Manage Identity" : "Activate Connect"}</button>
        </aside>
      </header>

      <section class="connect-warning-banner">
        <strong>Security reminder</strong>
        <span>Never share your seed phrase, private key, password, login code, 12 words, 24 words, or recovery phrase in any message.</span>
      </section>

      <section class="connect-metric-grid">
        <article><span>Inbox</span><strong>${getConnectInbox().length}</strong><small>${unread} unread</small></article>
        <article><span>Contacts</span><strong>${allocafiConnectState.contacts.length}</strong><small>${allocafiConnectState.contacts.filter((item) => item.status === "accepted").length} accepted</small></article>
        <article><span>Calls</span><strong>${allocafiConnectState.calls.length}</strong><small>${latestCall ? latestCall.callStatus : "No calls yet"}</small></article>
        <article><span>Security</span><strong>${allocafiConnectState.blockedAddresses.length}</strong><small>blocked addresses</small></article>
      </section>

      <nav class="connect-tabs" aria-label="AllocaFi Connect tabs">
        ${ALLOCAFI_CONNECT_TABS.map((tab) => `<button class="${allocafiConnectState.activeTab === tab ? "active" : ""}" data-connect-tab="${tab}" type="button">${tab[0].toUpperCase()}${tab.slice(1)}</button>`).join("")}
      </nav>

      <section class="connect-workspace">
        ${renderConnectActiveTab()}
      </section>
    </section>
  `;
  bindAllocaFiConnectControls();
}

function renderConnectActiveTab() {
  if (allocafiConnectState.activeTab === "calls") return renderConnectCallsTab();
  if (allocafiConnectState.activeTab === "contacts") return renderConnectContactsTab();
  if (allocafiConnectState.activeTab === "requests") return renderConnectRequestsTab();
  if (allocafiConnectState.activeTab === "security") return renderConnectSecurityTab();
  return renderConnectMessagesTab();
}

function renderConnectMessagesTab() {
  const inbox = getConnectInbox();
  return `
    <section class="connect-panel">
      <div class="connect-panel-head">
        <div><span>Encrypted Inbox</span><h3>Messages</h3></div>
        <button class="primary-button" data-connect-new-message type="button">New message</button>
      </div>
      <div class="connect-list">
        ${inbox.length ? inbox.map((conversation) => {
          const otherWallet = conversation.participantWallets.find((wallet) => !connectWalletMatches(wallet, allocafiConnectState.profile.walletAddress)) || conversation.participantWallets[0] || "";
          const last = allocafiConnectState.messages.filter((message) => message.conversationId === conversation.id).at(-1);
          return `
            <article class="connect-thread-row" data-connect-open-thread="${escapeHtml(conversation.id)}" tabindex="0" role="button">
              <span class="connect-avatar">${escapeHtml(shortAddress(otherWallet).slice(0, 2).toUpperCase())}</span>
              <div><strong>${escapeHtml(shortAddress(otherWallet))}</strong><small>Encrypted message | ${escapeHtml(last?.deliveryStatus || "ready")}</small></div>
              <em>${conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleTimeString() : "Draft"}</em>
            </article>
          `;
        }).join("") : `<div class="connect-empty-state"><strong>No messages yet</strong><span>Start an encrypted app-to-app conversation with a verified wallet identity.</span><button class="primary-button" data-connect-new-message type="button">Start secure message</button></div>`}
      </div>
      <div class="connect-future-grid">
        ${renderConnectFutureCard("Payment request messages", "Locked", "Future payment requests will require confirmation and wallet approval.")}
        ${renderConnectFutureCard("Invoice messages", "Locked", "Business invoices will stay metadata-only until payment rails are approved.")}
      </div>
    </section>
  `;
}

function renderConnectCallsTab() {
  return `
    <section class="connect-panel">
      <div class="connect-panel-head">
        <div><span>App-to-app only</span><h3>Voice Calls</h3></div>
        <button class="primary-button" data-connect-start-call type="button">Start voice call</button>
      </div>
      <div class="connect-list">
        ${allocafiConnectState.calls.length ? allocafiConnectState.calls.map((call) => `
          <article class="connect-call-row">
            <span class="connect-avatar">${call.callType === "voice" ? "VC" : "VD"}</span>
            <div><strong>${escapeHtml(shortAddress(call.recipientWallet || call.callerWallet))}</strong><small>${escapeHtml(call.callStatus)} | ${escapeHtml(call.failureReason || "WebRTC signaling beta")}</small></div>
            <div class="connect-row-actions">
              ${call.callStatus === "ringing" ? `<button class="secondary-button" data-connect-call-active="${escapeHtml(call.id)}" type="button">Accept</button><button class="danger-button" data-connect-call-decline="${escapeHtml(call.id)}" type="button">Decline</button>` : ""}
              ${call.callStatus === "active" ? `<button class="secondary-button" data-connect-call-end="${escapeHtml(call.id)}" type="button">End</button>` : ""}
            </div>
          </article>
        `).join("") : `<div class="connect-empty-state"><strong>No calls yet</strong><span>Voice calls are internet-based AllocaFi app-to-app calls. No phone numbers, SMS, carrier minutes, or emergency calling.</span></div>`}
      </div>
      <div class="connect-future-grid">
        ${renderConnectFutureCard("Video Calls", "Coming Soon", "Feature flag: connect_video_calls_enabled = false.")}
        ${renderConnectFutureCard("Premium support messages", "Future", "Support channels will never ask for wallet secrets.")}
      </div>
    </section>
  `;
}

function renderConnectContactsTab() {
  return `
    <section class="connect-panel">
      <div class="connect-panel-head">
        <div><span>Wallet contacts</span><h3>Contacts</h3></div>
        <button class="primary-button" data-connect-add-contact type="button">Add contact</button>
      </div>
      <div class="connect-list">
        ${allocafiConnectState.contacts.length ? allocafiConnectState.contacts.map((contact) => `
          <article class="connect-thread-row">
            <span class="connect-avatar">${escapeHtml(shortAddress(contact.contactWallet).slice(0, 2).toUpperCase())}</span>
            <div><strong>${escapeHtml(contact.nickname || contact.contactUsername || shortAddress(contact.contactWallet))}</strong><small>${escapeHtml(contact.status)} | ${escapeHtml(contact.contactWallet)}</small></div>
            <div class="connect-row-actions">
              ${contact.status === "pending" ? `<button class="secondary-button" data-connect-accept-contact="${escapeHtml(contact.id)}" type="button">Accept</button><button class="ghost-button" data-connect-decline-contact="${escapeHtml(contact.id)}" type="button">Decline</button>` : ""}
              <button class="danger-button" data-connect-block-wallet="${escapeHtml(contact.contactWallet)}" type="button">Block</button>
            </div>
          </article>
        `).join("") : `<div class="connect-empty-state"><strong>No contacts yet</strong><span>Add a username or wallet address to start secure AllocaFi communication.</span></div>`}
      </div>
      <div class="connect-future-grid">
        ${renderConnectFutureCard("Family secure chat", "Future", "Family communication hooks stay locked until Family permissions are complete.")}
        ${renderConnectFutureCard("Business secure chat", "Future", "Enterprise chat hooks require role-based permissions.")}
      </div>
    </section>
  `;
}

function renderConnectRequestsTab() {
  return `
    <section class="connect-panel">
      <div class="connect-panel-head">
        <div><span>Incoming requests</span><h3>Requests</h3></div>
        <span class="status-pill beta">${allocafiConnectState.requests.length} total</span>
      </div>
      <div class="connect-list">
        ${allocafiConnectState.requests.length ? allocafiConnectState.requests.map((request) => `
          <article class="connect-thread-row">
            <span class="connect-avatar">RQ</span>
            <div><strong>${escapeHtml(request.type.replaceAll("_", " "))}</strong><small>${escapeHtml(shortAddress(request.fromWallet || request.toWallet))} | ${escapeHtml(request.status)}</small></div>
          </article>
        `).join("") : `<div class="connect-empty-state"><strong>No requests</strong><span>Contact, message, payment, and invoice requests will appear here.</span></div>`}
      </div>
      <div class="connect-future-grid">
        ${renderConnectFutureCard("Future payment requests", "Locked", "No funds move in this build.")}
        ${renderConnectFutureCard("Future invoice requests", "Locked", "Invoice messaging is a future business system.")}
      </div>
    </section>
  `;
}

function renderConnectSecurityTab() {
  const profile = allocafiConnectState.profile;
  return `
    <section class="connect-panel">
      <div class="connect-panel-head">
        <div><span>Security Center</span><h3>Wallet communication safety</h3></div>
        ${renderConnectWalletBadge()}
      </div>
      <div class="connect-security-grid">
        <article><span>Verified wallet identity</span><strong>${profile.verified ? "Active" : "Signature required"}</strong><small>${profile.walletAddress ? escapeHtml(profile.walletAddress) : "No wallet saved"}</small></article>
        <article><span>Encryption status</span><strong>Dev encrypted</strong><small>XMTP/audited E2EE adapter ready</small></article>
        <article><span>Blocked addresses</span><strong>${allocafiConnectState.blockedAddresses.length}</strong><small>Blocked wallets cannot start local conversations</small></article>
        <article><span>Reports</span><strong>${allocafiConnectState.reports.length}</strong><small>Suspicious messages and wallets</small></article>
      </div>
      <div class="connect-list">
        ${allocafiConnectState.blockedAddresses.length ? allocafiConnectState.blockedAddresses.map((item) => `
          <article class="connect-thread-row">
            <span class="connect-avatar">BL</span>
            <div><strong>${escapeHtml(shortAddress(item.blockedWallet))}</strong><small>${escapeHtml(item.reason || "Blocked")}</small></div>
            <button class="secondary-button" data-connect-unblock-wallet="${escapeHtml(item.blockedWallet)}" type="button">Unblock</button>
          </article>
        `).join("") : `<div class="connect-empty-state"><strong>No blocked addresses</strong><span>Blocked wallets will appear here.</span></div>`}
      </div>
      <div class="connect-future-grid">
        ${renderConnectFutureCard("Vault recovery alerts", "Future", "Sensitive recovery notifications will require verified wallet ownership.")}
        ${renderConnectFutureCard("Export/delete communication data", "Placeholder", "Future privacy workflow for communication records.")}
      </div>
    </section>
  `;
}

function renderConnectFutureCard(title, badge, description) {
  return `<article class="connect-future-card"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(badge)}</span><p>${escapeHtml(description)}</p></article>`;
}

function bindAllocaFiConnectControls() {
  allocafiConnectView.querySelectorAll("[data-connect-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      allocafiConnectState.activeTab = button.dataset.connectTab;
      saveAllocaFiConnectState();
      renderAllocaFiConnect();
    });
  });
  allocafiConnectView.querySelector("[data-connect-profile]")?.addEventListener("click", openConnectProfileDialog);
  allocafiConnectView.querySelectorAll("[data-connect-new-message]").forEach((button) => button.addEventListener("click", openConnectNewMessageDialog));
  allocafiConnectView.querySelectorAll("[data-connect-open-thread]").forEach((row) => {
    row.addEventListener("click", () => openConnectConversationDialog(row.dataset.connectOpenThread));
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openConnectConversationDialog(row.dataset.connectOpenThread);
      }
    });
  });
  allocafiConnectView.querySelector("[data-connect-start-call]")?.addEventListener("click", openConnectStartCallDialog);
  allocafiConnectView.querySelector("[data-connect-add-contact]")?.addEventListener("click", openConnectAddContactDialog);
  allocafiConnectView.querySelectorAll("[data-connect-accept-contact]").forEach((button) => button.addEventListener("click", () => { updateContactStatus(button.dataset.connectAcceptContact, "accepted"); renderAllocaFiConnect(); }));
  allocafiConnectView.querySelectorAll("[data-connect-decline-contact]").forEach((button) => button.addEventListener("click", () => { updateContactStatus(button.dataset.connectDeclineContact, "declined"); renderAllocaFiConnect(); }));
  allocafiConnectView.querySelectorAll("[data-connect-block-wallet]").forEach((button) => button.addEventListener("click", () => { blockWalletAddress(button.dataset.connectBlockWallet, "Blocked from Contacts"); renderAllocaFiConnect(); }));
  allocafiConnectView.querySelectorAll("[data-connect-unblock-wallet]").forEach((button) => button.addEventListener("click", () => { unblockWalletAddress(button.dataset.connectUnblockWallet); renderAllocaFiConnect(); }));
  allocafiConnectView.querySelectorAll("[data-connect-call-active]").forEach((button) => button.addEventListener("click", () => { updateConnectCall(button.dataset.connectCallActive, "active"); renderAllocaFiConnect(); }));
  allocafiConnectView.querySelectorAll("[data-connect-call-decline]").forEach((button) => button.addEventListener("click", () => { updateConnectCall(button.dataset.connectCallDecline, "declined"); renderAllocaFiConnect(); }));
  allocafiConnectView.querySelectorAll("[data-connect-call-end]").forEach((button) => button.addEventListener("click", () => { updateConnectCall(button.dataset.connectCallEnd, "ended"); renderAllocaFiConnect(); }));
}

function openConnectProfileDialog() {
  const profile = allocafiConnectState.profile;
  const candidate = getConnectActiveWalletCandidate();
  openDialog(`
    <div class="dialog-content connect-dialog">
      <h2>AllocaFi Connect Identity</h2>
      <p class="wallet-note">Verify a wallet to activate app-to-app secure communication. This signature does not authorize transactions or give AllocaFi access to funds.</p>
      <div class="send-grid">
        <label>Wallet address<input id="connectWalletAddress" spellcheck="false" value="${escapeHtml(profile.walletAddress || candidate?.walletAddress || "")}" placeholder="0x... or Solana wallet address" /></label>
        <label>Chain<select id="connectWalletChain"><option value="evm" ${profile.chain === "evm" ? "selected" : ""}>EVM</option><option value="solana" ${profile.chain === "solana" ? "selected" : ""}>Solana</option></select></label>
        <label>Username<input id="connectUsername" value="${escapeHtml(profile.username || "")}" placeholder="yourname" /></label>
        <label>Display name<input id="connectDisplayName" value="${escapeHtml(profile.displayName || "")}" placeholder="Your display name" /></label>
      </div>
      <div class="connect-warning-banner"><strong>Wallet signature text</strong><span>${escapeHtml(getConnectVerificationMessage(profile.walletAddress || candidate?.walletAddress || "your wallet")).split("\n")[0]}</span></div>
      <div class="dialog-actions">
        <button id="saveConnectViewOnly" class="secondary-button" type="button">Save View-Only</button>
        <button id="verifyConnectIdentity" class="primary-button" type="button">Verify with Wallet Signature</button>
      </div>
    </div>
  `);
  const readProfileForm = () => ({
    walletAddress: normalizeConnectWallet(dialogContent.querySelector("#connectWalletAddress")?.value || ""),
    chain: dialogContent.querySelector("#connectWalletChain")?.value || "evm",
    username: String(dialogContent.querySelector("#connectUsername")?.value || "").trim().toLowerCase().replace(/[^a-z0-9_.-]/g, ""),
    displayName: String(dialogContent.querySelector("#connectDisplayName")?.value || "").trim(),
  });
  dialogContent.querySelector("#saveConnectViewOnly")?.addEventListener("click", () => {
    const next = readProfileForm();
    if (!next.walletAddress) {
      showToast("Enter a wallet address");
      return;
    }
    allocafiConnectState.profile = { ...allocafiConnectState.profile, ...next, verified: false, verificationSignatureHash: "", updatedAt: new Date().toISOString(), connectStatus: "view_only" };
    saveAllocaFiConnectState();
    walletDialog.close();
    renderAllocaFiConnect();
    showToast("Connect identity saved as view-only");
  });
  dialogContent.querySelector("#verifyConnectIdentity")?.addEventListener("click", async () => {
    const next = readProfileForm();
    if (!next.walletAddress) {
      showToast("Enter a wallet address");
      return;
    }
    try {
      const signatureType = classifyVaultSignatureRequest("vault_access");
      if (signatureType.movesFunds || signatureType.grantsApproval) throw new Error("Unsafe signature request blocked");
      const signed = await requestConnectWalletSignature({ ...allocafiConnectState.profile, ...next });
      const signatureHash = await sha256Hex(`${signed.signature}:${signed.message}:${signed.encoding}`);
      allocafiConnectState.profile = {
        ...allocafiConnectState.profile,
        ...next,
        verified: true,
        verificationSignatureHash: signatureHash,
        updatedAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        connectStatus: "verified",
      };
      saveAllocaFiConnectState();
      walletDialog.close();
      renderAllocaFiConnect();
      showToast("AllocaFi Connect wallet verified");
    } catch (error) {
      showToast(error?.message || "Connect verification failed");
    }
  });
}

function openConnectNewMessageDialog(prefillRecipient = "") {
  openDialog(`
    <div class="dialog-content connect-dialog">
      <h2>New Secure Message</h2>
      <p class="wallet-note">Messages are encrypted before being saved. Never send wallet recovery details.</p>
      <div class="send-grid">
        <label>Recipient wallet or username<input id="connectRecipient" spellcheck="false" value="${escapeHtml(prefillRecipient)}" placeholder="0x..., Solana address, or username" /></label>
        <label>Message<textarea id="connectMessageText" rows="6" placeholder="Type a secure app-to-app message"></textarea></label>
      </div>
      <div class="connect-warning-banner"><strong>Warning</strong><span>Never share your seed phrase, private key, recovery phrase, password, login code, 12 words, or 24 words.</span></div>
      <div id="connectMessageStatus" class="send-status">Ready to encrypt locally.</div>
      <div class="dialog-actions"><button id="sendConnectMessage" class="primary-button" type="button">Encrypt & Send</button></div>
    </div>
  `);
  dialogContent.querySelector("#sendConnectMessage")?.addEventListener("click", async () => {
    const recipient = dialogContent.querySelector("#connectRecipient")?.value || "";
    const text = dialogContent.querySelector("#connectMessageText")?.value || "";
    const status = dialogContent.querySelector("#connectMessageStatus");
    try {
      status.textContent = "Encrypting message...";
      status.className = "send-status loading";
      await sendConnectMessage(recipient, text);
      walletDialog.close();
      renderAllocaFiConnect();
      showToast("Encrypted message sent");
    } catch (error) {
      status.textContent = error?.message || "Message failed to send";
      status.className = "send-status error";
    }
  });
}

async function openConnectConversationDialog(conversationId) {
  const conversation = allocafiConnectState.conversations.find((item) => item.id === conversationId);
  if (!conversation) return;
  const otherWallet = conversation.participantWallets.find((wallet) => !connectWalletMatches(wallet, allocafiConnectState.profile.walletAddress)) || "";
  const messages = getConnectMessages(conversationId);
  const key = getConnectConversationKey(conversationId);
  const messageRows = [];
  for (const message of messages) {
    let body = "Encrypted message unavailable";
    try {
      body = await decryptMessage(message.encryptedPayload, key);
    } catch {
      body = "Encryption/decryption failed";
    }
    messageRows.push(`
      <article class="connect-message-bubble ${connectWalletMatches(message.senderWallet, allocafiConnectState.profile.walletAddress) ? "mine" : "theirs"}">
        <span>${escapeHtml(connectWalletMatches(message.senderWallet, allocafiConnectState.profile.walletAddress) ? "You" : shortAddress(message.senderWallet))}</span>
        <p>${escapeHtml(body)}</p>
        <small>${escapeHtml(message.deliveryStatus)} | ${new Date(message.createdAt).toLocaleString()}</small>
        <button class="ghost-button" data-connect-report-message="${escapeHtml(message.id)}" type="button">Report</button>
      </article>
    `);
  }
  openDialog(`
    <div class="dialog-content connect-dialog connect-thread-dialog">
      <h2>${escapeHtml(shortAddress(otherWallet))}</h2>
      <p class="wallet-note">Thread uses local dev encryption now and is ready for future XMTP/audited E2EE integration.</p>
      <div class="connect-message-thread">${messageRows.join("") || `<p class="wallet-note">No messages in this thread yet.</p>`}</div>
      <div class="dialog-actions">
        <button class="primary-button" data-connect-reply="${escapeHtml(otherWallet)}" type="button">Reply</button>
        <button class="secondary-button" data-connect-delete-thread="${escapeHtml(conversationId)}" type="button">Delete locally</button>
        <button class="danger-button" data-connect-block-wallet="${escapeHtml(otherWallet)}" type="button">Block wallet</button>
      </div>
    </div>
  `);
  dialogContent.querySelector("[data-connect-reply]")?.addEventListener("click", () => openConnectNewMessageDialog(otherWallet));
  dialogContent.querySelector("[data-connect-delete-thread]")?.addEventListener("click", () => {
    deleteConversationLocal(conversationId);
    walletDialog.close();
    renderAllocaFiConnect();
    showToast("Conversation deleted locally");
  });
  dialogContent.querySelector("[data-connect-block-wallet]")?.addEventListener("click", () => {
    blockWalletAddress(otherWallet, "Blocked from conversation");
    walletDialog.close();
    renderAllocaFiConnect();
    showToast("Wallet blocked");
  });
  dialogContent.querySelectorAll("[data-connect-report-message]").forEach((button) => {
    button.addEventListener("click", () => {
      reportMessage(button.dataset.connectReportMessage, "other", "Reported from conversation thread");
      showToast("Message reported");
    });
  });
}

function openConnectAddContactDialog() {
  openDialog(`
    <div class="dialog-content connect-dialog">
      <h2>Add Connect Contact</h2>
      <div class="send-grid">
        <label>Wallet address or username<input id="connectContactWallet" spellcheck="false" placeholder="0x..., Solana address, or username" /></label>
        <label>Nickname<input id="connectContactNickname" placeholder="Optional nickname" /></label>
      </div>
      <div class="dialog-actions"><button id="saveConnectContact" class="primary-button" type="button">Send Contact Request</button></div>
    </div>
  `);
  dialogContent.querySelector("#saveConnectContact")?.addEventListener("click", () => {
    try {
      sendContactRequest(dialogContent.querySelector("#connectContactWallet")?.value || "", dialogContent.querySelector("#connectContactNickname")?.value || "");
      walletDialog.close();
      renderAllocaFiConnect();
      showToast("Contact request created");
    } catch (error) {
      showToast(error?.message || "Could not add contact");
    }
  });
}

function openConnectStartCallDialog() {
  openDialog(`
    <div class="dialog-content connect-dialog">
      <h2>Start Voice Call</h2>
      <p class="wallet-note">AllocaFi Connect calls are app-to-app WebRTC calls only. No phone numbers, SMS, carrier minutes, or emergency calling.</p>
      <div class="send-grid">
        <label>Recipient wallet<input id="connectCallRecipient" spellcheck="false" placeholder="Verified Connect wallet" /></label>
      </div>
      <div id="connectCallStatus" class="send-status">Ready to create WebRTC voice invite.</div>
      <div class="dialog-actions"><button id="startConnectCall" class="primary-button" type="button">Start Voice Call</button></div>
    </div>
  `);
  dialogContent.querySelector("#startConnectCall")?.addEventListener("click", () => {
    const status = dialogContent.querySelector("#connectCallStatus");
    try {
      const call = startVoiceCall(dialogContent.querySelector("#connectCallRecipient")?.value || "");
      status.textContent = `Voice call invite created: ${call.callStatus}`;
      status.className = "send-status loading";
      renderAllocaFiConnect();
      showToast("Voice call invite created");
    } catch (error) {
      status.textContent = error?.message || "Call failed to connect";
      status.className = "send-status error";
    }
  });
}


function getBucketGroup(name = "") {
  const normalized = String(name || "").toLowerCase();
  if (/bill|rent|mortgage|utility|insurance|phone|internet/.test(normalized)) return "Bills";
  if (/saving|emergency|reserve|vacation|goal|retirement/.test(normalized)) return "Savings";
  if (/invest|asset|crypto|wealth/.test(normalized)) return "Goals";
  return "Available Cashflow";
}

function getBucketCategoryType(name = "") {
  const normalized = String(name || "").toLowerCase();
  if (/food|grocery|restaurant/.test(normalized)) return "food";
  if (/gas|fuel|car|auto|transport/.test(normalized)) return "transport";
  if (/bill|rent|mortgage|utility|insurance/.test(normalized)) return "bills";
  if (/saving|emergency|reserve/.test(normalized)) return "savings";
  if (/vacation|travel/.test(normalized)) return "travel";
  if (/invest|asset|crypto|wealth/.test(normalized)) return "invest";
  if (/tax/.test(normalized)) return "tax";
  if (/medical|health/.test(normalized)) return "medical";
  return "default";
}

function getBucketCategoryIcon(categoryType = "default") {
  const icons = {
    food: renderOverviewPanelIcon("target"),
    transport: renderOverviewPanelIcon("car"),
    bills: renderOverviewPanelIcon("bills"),
    savings: renderOverviewPanelIcon("reserve"),
    travel: renderOverviewPanelIcon("out"),
    invest: renderOverviewPanelIcon("progress"),
    tax: renderOverviewPanelIcon("check"),
    medical: renderOverviewPanelIcon("insurance"),
    default: renderOverviewPanelIcon("accounts"),
  };
  return icons[categoryType] || icons.default;
}

function getBucketTransactionMeta(wallet, bucket) {
  const transactions = (wallet?.allocation?.transactions || [])
    .filter((tx) => tx.bucketId === bucket?.id || tx.bucketName === bucket?.name || tx.bucketName?.includes(bucket?.name))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const spent = transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  const latest = transactions[0];
  if (!latest) {
    return {
      transactions,
      spent,
      count: 0,
      title: "",
      detail: "No activity yet",
    };
  }
  const dateLabel = latest.createdAt ? new Date(latest.createdAt).toLocaleDateString() : "Recent";
  return {
    transactions,
    spent,
    count: transactions.length,
    title: formatUsd(Number(latest.amount || 0)),
    detail: `${dateLabel} - ${latest.displayTitle || latest.type || "Activity"}`,
  };
}
function getVbaBalanceIcon(tokenLabel = "") {
  const stablecoinMeta = STABLECOIN_LOGOS[normalizeStablecoinSymbol(tokenLabel)];
  if (stablecoinMeta) return renderStablecoinLogo(stablecoinMeta.symbol);
  const reserveSymbol = normalizeReserveAssetSymbol(tokenLabel);
  if (RESERVE_ASSET_METADATA[reserveSymbol]) return renderAssetLogo(reserveSymbol);
  return renderOverviewPanelIcon("accounts");
}

function renderEnterpriseStablecoinBreakdownCoin(coin) {
  return renderStablecoinLogo(coin.asset);
}

function openSandboxBankDialog() {
  openDialog(`
    <div class="dialog-content">
      <h2>Connect Bank Account</h2>
      <p class="wallet-note">Local preview mode adds a sample read-only bank account for unified budgeting. Production bank sync remains provider-gated.</p>
      <div class="dialog-actions">
        <button class="primary-button" id="addPreviewBankAccount" type="button">Add Local Preview</button>
      </div>
    </div>
  `);
  dialogContent.querySelector("#addPreviewBankAccount")?.addEventListener("click", () => {
    financeData.bankAccounts = financeData.bankAccounts || [];
    if (!financeData.bankAccounts.some((account) => account.id === "preview-checking")) {
      financeData.bankAccounts.unshift({
        id: "preview-checking",
        name: "Preview Checking",
        type: "Checking",
        institution: "AllocaFi Local Preview",
        balance: 2450,
        status: "Connected",
        updatedAt: new Date().toISOString(),
      });
      saveFinanceData();
    }
    walletDialog.close();
    render();
    showToast("Preview bank account connected");
  });
}

function syncBankTransactions() {
  financeData.bankTransactions = Array.isArray(financeData.bankTransactions) ? financeData.bankTransactions : [];
  if (!financeData.bankTransactions.some((tx) => tx.id === "preview-bank-tx-1")) {
    financeData.bankTransactions.unshift(
      { id: "preview-bank-tx-1", accountId: "preview-checking", description: "Payroll deposit", category: "Income", amount: 3200, direction: "in", createdAt: new Date().toISOString() },
      { id: "preview-bank-tx-2", accountId: "preview-checking", description: "Utilities", category: "Bills", amount: -185.42, direction: "out", createdAt: new Date().toISOString() }
    );
    saveFinanceData();
  }
  renderMonthlyBudgetPage();
  renderUnifiedFinance();
  showToast("Preview bank transactions synced");
}

function createFamilyGroup() {
  openAdvancedSystem("family");
  showToast("Family Treasury preview opened");
}

function createBusinessProfile() {
  openAdvancedSystem("business");
  showToast("Business dashboard preview opened");
}

function openMonthlyReport() {
  const dashboard = getMonthlyDashboard();
  openDialog(`
    <div class="dialog-content">
      <h2>Monthly Budget Report</h2>
      <p class="wallet-note">Local preview report built from visible wallet, budget account, and bank summary data.</p>
      <div class="overview-list">
        <div class="overview-row compact"><span>Month</span><strong>${escapeHtml(dashboard.monthLabel || "Current month")}</strong></div>
        <div class="overview-row compact"><span>Allocated</span><strong>${formatUsd(dashboard.allocated || 0)}</strong></div>
        <div class="overview-row compact"><span>Spending</span><strong>${formatUsd(dashboard.monthSpending || 0)}</strong></div>
        <div class="overview-row compact"><span>Remaining</span><strong>${formatUsd((dashboard.allocated || 0) - (dashboard.monthSpending || 0))}</strong></div>
      </div>
    </div>
  `);
}
function renderBankAccounts() {
  if (!bankAccountsView) return;
  const accounts = financeData.bankAccounts || [];
  bankAccountsView.innerHTML = accounts.length ? `
    <div class="overview-card">
      <div class="overview-card-head"><span>Bank Accounts</span><strong>${accounts.length}</strong></div>
      <div class="overview-list">
        ${accounts.map((account) => `<div class="overview-row compact"><span>${escapeHtml(account.name || "Bank account")}</span><strong>${formatUsd(account.balance || 0)}</strong></div>`).join("")}
      </div>
    </div>
  ` : `
    <div class="overview-card">
      <div class="overview-card-head"><span>Bank Accounts</span><strong>Local preview</strong></div>
      <p class="wallet-note">Connect bank data later for Plaid-ready income, spending, and monthly budget views.</p>
    </div>
  `;
}

function getMasterWalletStatus(wallet) {
  if (wallet?.statusType === "error") return { label: "Needs review", className: "error" };
  if (wallet?.statusType === "warning") return { label: wallet.status || "Needs sync", className: "warning" };
  if (wallet?.status === "Manual") return { label: "Manual", className: "manual" };
  return { label: wallet?.status || "Connected", className: "live" };
}


function getWalletActionIcon(type) {
  const icons = {
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 19.5 20 4l-5.1 15.2-3.4-6.7-7-3.1Z"/><path d="m11.5 12.5 3.4 6.7"/></svg>',
    receive: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 19h14"/></svg>',
    allocate: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h4a4 4 0 0 1 4 4v8"/><path d="M18 6h-4a4 4 0 0 0-4 4v8"/><path d="M4 6h2"/><path d="M18 6h2"/><path d="M10 18h4"/></svg>',
    view: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 12s3.2-5.5 8.5-5.5S20.5 12 20.5 12 17.3 17.5 12 17.5 3.5 12 3.5 12Z"/><circle cx="12" cy="12" r="2.6"/></svg>',
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4.6-1 10-10a2.2 2.2 0 0 0-3.1-3.1l-10 10L4 20Z"/><path d="m14 7 3 3"/></svg>',
    move: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h11"/><path d="m15 4 3 3-3 3"/><path d="M17 17H6"/><path d="m9 14-3 3 3 3"/></svg>',
    spend: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10v16l-2.5-1.4L12 20l-2.5-1.4L7 20V4Z"/><path d="M10 9h4"/><path d="M10 13h4"/></svg>',
    rules: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="7" r="2.4"/><circle cx="8" cy="18" r="2.4"/><path d="M8.2 7.2 15.8 7"/><path d="M7 8.2 8 15.6"/><path d="M10.1 17.1 16.2 8.9"/></svg>',
    bills: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M8 8h8"/><path d="M8 12h8"/><path d="M8 16h5"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 0 1-13.7 5.6"/><path d="M4 12A8 8 0 0 1 17.7 6.4"/><path d="M7 18H3v4"/><path d="M17 6h4V2"/></svg>',
    layers: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4-8 4-8-4 8-4Z"/><path d="m4 12 8 4 8-4"/><path d="m4 17 8 4 8-4"/></svg>',
    scan: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20a8 8 0 1 0-8-8"/><path d="M12 16a4 4 0 1 0-4-4"/><path d="M12 12h8"/><path d="M12 12l5.4-5.4"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M5 16V7a2 2 0 0 1 2-2h9"/></svg>',
    remove: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="m9 11 .5 7"/><path d="m15 11-.5 7"/><path d="M6.5 7 8 20h8l1.5-13"/></svg>',
  };
  return icons[type] || "";
}


function getVirtualAssetAccountsSummary(accounts = getVirtualAssetAccounts()) {
  const activeAccounts = accounts.filter((account) => !account.archived);
  return activeAccounts.reduce((summary, account) => {
    const legal = SUPPORTED_RESERVE_ASSETS.includes(account.asset) ? buildLegalCoreRecordForAccount(account) : null;
    summary.totalValue += Number(account.currentValue || 0);
    summary.totalCostBasis += Number(legal?.costBasis || account.costBasis || 0);
    summary.totalGain += legal?.costBasis > 0 ? Number(account.currentValue || 0) - Number(legal.costBasis || 0) : 0;
    if (account.currentValue > 0 || legal?.legalCoreStatus === "Legal Core Verified" || legal?.legalCoreStatus === "Estimate Ready") summary.legalCoreTracked += 1;
    if (/pending|review|needs/i.test(`${legal?.classificationStatus || ""} ${legal?.legalCoreStatus || ""}`)) summary.pendingClassifications += 1;
    return summary;
  }, {
    accountCount: activeAccounts.length,
    totalValue: 0,
    totalCostBasis: 0,
    totalGain: 0,
    legalCoreTracked: 0,
    pendingClassifications: 0,
  });
}
function renderVirtualAssetAccountsSection() {
  if (!canUseReserveAssetAccounts()) {
    return `
    <section class="wallet-account-group virtual-asset-accounts-section asset-account-locked-section">
      <div class="wallet-account-heading">
        <div>
          <h3>Asset Accounts</h3>
          <p>Reserve Asset Accounts and Legal Core are included with AllocaFi Core.</p>
        </div>
        <span>Core</span>
      </div>
      <div class="allocation-summary wide-empty">
        <strong>Reserve accounts locked on Free</strong>
        <span>Free keeps stablecoin budgeting simple: 3 Virtual Budget Accounts, manual spends, and no reserve asset or Legal Core add-ons.</span>
        <button class="primary-button asset-account-upgrade" type="button">Upgrade to AllocaFi Core</button>
      </div>
    </section>
  `;
  }
  const accounts = getVirtualAssetAccounts();
  const summary = getVirtualAssetAccountsSummary(accounts);
  return `
    <section class="wallet-account-group virtual-asset-accounts-section">
      <div class="wallet-account-heading">
        <div>
          <h3>Asset Accounts</h3>
          <p>Budget Accounts organize spending. Asset Accounts organize wealth.</p>
        </div>
        <span>${renderMoneyValue(summary.totalValue, { compactAt: 10_000_000, label: "Asset Accounts total value" })}</span>
      </div>
      <div class="asset-account-summary-strip">
        <article><span>Cost Basis</span><strong>${renderMoneyValue(summary.totalCostBasis, { compactAt: 10_000_000, label: "Asset cost basis" })}</strong></article>
        <article><span>Unrealized Gain/Loss</span><strong class="${summary.totalGain >= 0 ? "positive" : "negative"}">${summary.totalGain >= 0 ? "+" : "-"}${formatUsd(Math.abs(summary.totalGain))}</strong></article>
        <article><span>Legal Core Records</span><strong>${summary.legalCoreTracked}</strong></article>
        <button class="primary-button create-asset-account" type="button">${getWalletActionIcon("layers")}<span>Create Asset Account</span></button>
      </div>
      <div class="asset-account-groups virtual-asset-account-groups">
        <section class="asset-account-group">
          <div class="asset-account-heading">
            <div><strong>Reserve Asset Accounts</strong><small>${accounts.length} account${accounts.length === 1 ? "" : "s"} | Non-custodial organization</small></div>
            <div><span>${renderMoneyValue(summary.totalValue, { compactAt: 10_000_000, label: "Reserve asset value" })}</span><small>${summary.legalCoreTracked} Legal Core tracked</small></div>
          </div>
          <div class="asset-account-list">
            ${accounts.map((account) => {
              const legal = buildLegalCoreRecordForAccount(account);
              return `
              <article class="account-row virtual-asset-row asset-account-${escapeHtml(account.meta.className)} ${account.currentValue > 0 ? "has-balance" : "is-empty"}" data-asset-account-id="${escapeHtml(account.id)}" tabindex="0" role="button" aria-label="Open ${escapeHtml(account.name)}">
                <div class="account-card-hero">
                  <div class="account-identity-panel">
                    <span class="account-card-kicker">Virtual Asset Account</span>
                    <div class="account-title-cluster">
                      <span class="account-icon asset-account-logo-wrap">${renderAssetLogo(account.asset)}</span>
                      <div class="account-name">
                  <span class="account-title-row"><strong>${escapeHtml(account.name)}</strong><span class="account-title-edit" aria-hidden="true">${getWalletActionIcon("edit")}</span></span>
                  <span class="account-source-line">
                    <em>${escapeHtml(account.asset)} Reserve</em>
                    <em class="account-purpose-chip">${escapeHtml(legal.legalCoreStatus)}</em>
                    <small>${account.walletAddresses?.length ? escapeHtml(account.walletAddresses.map(shortAddress).join(", ")) : "No wallet address linked"}</small>
                  </span>
                        <span class="account-spent-line">Holding period <b>${account.holdingPeriodDays}</b> days | Last sync ${escapeHtml(account.lastSync ? new Date(account.lastSync).toLocaleString() : "Not synced")}</span>
                      </div>
                    </div>
                  </div>
                  <div class="account-amount blue">
                    <span>Current Value</span>
                    <strong>${renderMoneyValue(account.currentValue, { className: "account-balance-money", compactAt: 1_000_000, label: `${account.name} current value` })}</strong>
                    <i class="account-coin-stack" aria-hidden="true">${renderAssetLogo(account.asset)}</i>
                  </div>
                </div>
                <div class="asset-account-stat-grid">
                  <span><small>Balance</small><b>${escapeHtml(formatAssetQuantity(account.quantity, account.asset))}</b></span>
                  <span><small>Cost Basis</small><b>${legal.costBasis > 0 ? renderMoneyValue(legal.costBasis, { compactAt: 1_000_000, label: `${account.name} cost basis` }) : "Needs verification"}</b></span>
                  <span><small>Gain</small><b class="${(legal.costBasis > 0 ? account.currentValue - legal.costBasis : account.unrealizedGain) >= 0 ? "positive" : "negative"}">${(legal.costBasis > 0 ? account.currentValue - legal.costBasis : account.unrealizedGain) >= 0 ? "+" : "-"}${formatUsd(Math.abs(legal.costBasis > 0 ? account.currentValue - legal.costBasis : account.unrealizedGain))}</b></span>
                <span><small>Legal Core</small><b>${escapeHtml(legal.legalCoreStatus)}</b></span>
                </div>
                <div class="account-actions asset-account-actions">
                  <button class="primary-button account-action-card asset-account-open" data-asset-account-id="${escapeHtml(account.id)}" type="button">${getWalletActionIcon("view")}<span>View</span></button>
                  <button class="secondary-button account-action-card asset-account-receive" data-asset-account-id="${escapeHtml(account.id)}" type="button">${getWalletActionIcon("receive")}<span>Receive</span></button>
                  <button class="secondary-button account-action-card asset-account-send" data-asset-account-id="${escapeHtml(account.id)}" type="button">${getWalletActionIcon("send")}<span>Send</span></button>
                  <button class="secondary-button account-action-card asset-account-legal" data-asset-account-id="${escapeHtml(account.id)}" type="button">${getWalletActionIcon("rules")}<span>Legal Core</span></button>
                  <button class="secondary-button account-action-card asset-account-export" data-asset-account-id="${escapeHtml(account.id)}" type="button">${getWalletActionIcon("layers")}<span>Export</span></button>
                </div>
              </article>
            `;
            }).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function bindVirtualAssetAccountControls(root = document) {
  root.querySelector(".asset-account-upgrade")?.addEventListener("click", () => openSubscriptionCheckout("premium"));
  root.querySelectorAll(".virtual-asset-row").forEach((row) => {
    row.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      openVirtualAssetAccountDialog(row.dataset.assetAccountId);
    });
    row.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openVirtualAssetAccountDialog(row.dataset.assetAccountId);
    });
  });
  root.querySelector(".create-asset-account")?.addEventListener("click", openCreateAssetAccountDialog);
  root.querySelectorAll(".asset-account-open").forEach((button) => button.addEventListener("click", () => openVirtualAssetAccountDialog(button.dataset.assetAccountId)));
  root.querySelectorAll(".asset-account-receive").forEach((button) => button.addEventListener("click", () => openAssetAccountReceiveDialog(button.dataset.assetAccountId)));
  root.querySelectorAll(".asset-account-send").forEach((button) => button.addEventListener("click", () => openAssetAccountSendDialog(button.dataset.assetAccountId)));
  root.querySelectorAll(".asset-account-legal").forEach((button) => button.addEventListener("click", () => openAssetAccountRecordsDialog(button.dataset.assetAccountId, "legal")));
  root.querySelectorAll(".asset-account-tax").forEach((button) => button.addEventListener("click", () => openAssetAccountRecordsDialog(button.dataset.assetAccountId, "tax")));
  root.querySelectorAll(".asset-account-export").forEach((button) => button.addEventListener("click", () => exportAssetAccountRecords(button.dataset.assetAccountId)));
  root.querySelectorAll(".asset-account-rename").forEach((button) => button.addEventListener("click", () => renameVirtualAssetAccount(button.dataset.assetAccountId)));
  root.querySelectorAll(".asset-account-archive").forEach((button) => button.addEventListener("click", () => archiveVirtualAssetAccount(button.dataset.assetAccountId)));
  root.querySelectorAll(".asset-account-timeline").forEach((button) => button.addEventListener("click", () => openAssetAccountRecordsDialog(button.dataset.assetAccountId, "timeline")));
  root.querySelectorAll(".asset-account-acquisitions").forEach((button) => button.addEventListener("click", () => openAssetAccountRecordsDialog(button.dataset.assetAccountId, "acquisitions")));
  root.querySelectorAll(".asset-account-transfers").forEach((button) => button.addEventListener("click", () => openAssetAccountRecordsDialog(button.dataset.assetAccountId, "transfers")));
  root.querySelectorAll(".asset-account-disposals").forEach((button) => button.addEventListener("click", () => openAssetAccountRecordsDialog(button.dataset.assetAccountId, "disposals")));
}

function getAccountWalletGroupKey(address = "") {
  return String(address || "unassigned-wallet").trim().toLowerCase() || "unassigned-wallet";
}
function renderBucketAccounts() {
  if (!bucketAccountsView) return;
  const accounts = getSupportedWallets().flatMap((wallet) => (wallet.allocation?.buckets || []).map((bucket) => {
    const walletOverbalance = getWalletOverbalanceAmount(wallet);
    const allocated = Number(bucket.allocated || 0);
    const spent = Number(bucket.spent || 0);
    const balance = Math.max(allocated - spent, 0);
    const usedPercent = allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0;
    const rules = bucket.rules || {};
    const subaccounts = normalizeSubaccounts(bucket.subaccounts || []);
    const monthlyRequired = getMonthlyBillTotal(bucket);
    const weeklyTarget = monthlyRequired / 4;
    const network = NETWORKS[wallet.network];
    const createdAt = bucket.createdAt || bucket.updatedAt || wallet.allocation?.updatedAt || wallet.updatedAt;
    const createdLabel = createdAt ? new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Local";
    const allocationPercent = Math.min(Math.max(Number(bucket.percent || 0), 0), 100);
    const categoryType = getBucketCategoryType(bucket.name);
    const txMeta = getBucketTransactionMeta(wallet, bucket);
    const upcomingBill = isBillsBucket(bucket)
      ? subaccounts.map((bill) => ({ bill, meta: getBillDueMeta(bill) }))
        .filter((item) => item.meta && item.meta.daysUntil <= BILL_DUE_SOON_DAYS)
        .sort((a, b) => a.meta.daysUntil - b.meta.daysUntil)[0]
      : null;
    const status = walletOverbalance > 0.01
      ? `Needs VBA refresh. Wallet is ${formatUsd(walletOverbalance)} under these virtual balances.`
      : upcomingBill
        ? `${upcomingBill.bill.name} ${upcomingBill.meta.label.toLowerCase()}${Number(upcomingBill.bill.required || 0) > 0 ? ` for ${formatUsd(upcomingBill.bill.required)}` : ""}.`
      : Number(rules.minimum || 0) > 0 && balance < Number(rules.minimum)
        ? `Underfunded. Needs ${formatUsd(Number(rules.minimum) - balance)}.`
        : monthlyRequired > 0
        ? `Monthly required ${formatUsd(monthlyRequired)}. ${formatUsd(Math.max(monthlyRequired - balance, 0))} remaining.`
      : spent > 0
        ? `Funded. Spent ${formatUsd(spent)} of ${formatUsd(allocated)}.`
        : "Funded";
    return {
      walletId: wallet.id,
      walletName: wallet.name,
      walletAddress: wallet.address,
      walletAssetLabel: getWalletAssetLabel(wallet),
      networkLabel: network?.label || "Wallet",
      tokenLabel: network?.asset || "Asset",
      canSend: isSendCapableWallet(wallet),
      bucket,
      group: getBucketGroup(bucket.name),
      categoryType,
      balance,
      allocated,
      spent,
      walletOverbalance,
      usedPercent,
      allocationPercent,
      status,
      monthlyRequired,
      weeklyTarget,
      subaccounts,
      createdLabel,
      autoFunding: Number(rules.refill || 0) > 0,
      txMeta,
    };
  }));
  const assetAccountsSection = renderVirtualAssetAccountsSection();
  if (!accounts.length) {
    bucketAccountsView.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">Ã¢ï¿½-Â¤</div>
        <h3>No Virtual Budget Accounts yet</h3>
        <p>Use Auto Allocate to create a starter weekly allocation plan.</p>
        <button class="primary-button empty-assign" type="button">Auto Allocate</button>
      </div>
      ${assetAccountsSection}
    `;
    bucketAccountsView.querySelector(".empty-assign").addEventListener("click", openAssignMoneyDialog);
    bindVirtualAssetAccountControls(bucketAccountsView);
    return;
  }

  const walletGroups = accounts.reduce((groupMap, account) => {
    const walletKey = getAccountWalletGroupKey(account.walletAddress);
    if (!groupMap.has(walletKey)) {
      groupMap.set(walletKey, {
        address: account.walletAddress,
        walletNames: new Set(),
        assets: new Map(),
        totalBalance: 0,
        totalBuckets: 0,
      });
    }
    const walletGroup = groupMap.get(walletKey);
    walletGroup.walletNames.add(account.walletName);
    walletGroup.totalBalance += account.balance;
    walletGroup.totalBuckets += 1;

    const assetKey = `${walletKey}:${account.walletAssetLabel}`;
    if (!walletGroup.assets.has(assetKey)) {
      walletGroup.assets.set(assetKey, {
        walletId: account.walletId,
        assetLabel: account.walletAssetLabel,
        walletNames: new Set(),
        rows: [],
        totalBalance: 0,
        canSend: account.canSend,
      });
    }
    const assetGroup = walletGroup.assets.get(assetKey);
    assetGroup.walletNames.add(account.walletName);
    assetGroup.rows.push(account);
    assetGroup.totalBalance += account.balance;
    assetGroup.canSend = assetGroup.canSend || account.canSend;
    return groupMap;
  }, new Map());

  const groupOrder = ["Available Cashflow", "Bills", "Savings", "Goals"];
  bucketAccountsView.innerHTML = [...walletGroups.values()].map((walletGroup) => {
    const assetGroups = [...walletGroup.assets.values()].sort((a, b) => a.assetLabel.localeCompare(b.assetLabel));
    const walletNameList = [...walletGroup.walletNames].filter(Boolean);
    const walletTitle = walletNameList.length > 1 ? "Shared wallet address" : walletNameList[0] || "Wallet address";
    const walletSubtitle = `${shortAddress(walletGroup.address)} ï¿½ ${assetGroups.length} asset${assetGroups.length === 1 ? "" : "s"} ï¿½ ${walletGroup.totalBuckets} Virtual Budget Account${walletGroup.totalBuckets === 1 ? "" : "s"}`;
    return `
      <section class="wallet-account-group">
        <div class="wallet-account-heading">
          <div>
            <h3>${escapeHtml(walletTitle)}</h3>
            <p>${escapeHtml(walletSubtitle)}</p>
          </div>
          <span>${renderMoneyValue(walletGroup.totalBalance, { compactAt: 1_000_000, label: `${walletTitle} total balance` })}</span>
        </div>
        <div class="asset-account-groups">
          ${assetGroups.map((assetGroup) => {
            const rows = assetGroup.rows.sort((a, b) => {
              const groupDifference = groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group);
              if (groupDifference !== 0) return groupDifference;
              return a.bucket.name.localeCompare(b.bucket.name);
            });
            const cashflowTotal = rows
              .filter((account) => account.group === "Available Cashflow")
              .reduce((sum, account) => sum + account.balance, 0);
            return `
              <section class="asset-account-group">
                <div class="asset-account-heading">
                  <div>
                    <strong>${escapeHtml(assetGroup.assetLabel)}</strong>
                    <small>${escapeHtml([...assetGroup.walletNames].filter(Boolean).join(", ") || "Wallet")} ï¿½ ${rows.length} budget account${rows.length === 1 ? "" : "s"}${assetGroup.canSend ? " ï¿½ Send enabled" : ""}</small>
                  </div>
                  <div>
                    <span>${renderMoneyValue(assetGroup.totalBalance, { compactAt: 1_000_000, label: `${assetGroup.assetLabel} total balance` })}</span>
                    ${cashflowTotal > 0 ? `<small>${renderMoneyValue(cashflowTotal, { compactAt: 1_000_000, label: `${assetGroup.assetLabel} available cashflow` })} available cashflow</small>` : ""}
                  </div>
                </div>
                <div class="asset-account-list">
                  ${rows.map((account, index) => `
                    <article class="account-row personalized-vba-card account-category-${escapeHtml(account.categoryType)} ${account.walletOverbalance > 0.01 ? "needs-rebalance" : ""}" style="--account-share:${account.allocationPercent}%; --account-utilized:${account.usedPercent}%" data-wallet-id="${account.walletId}" data-bucket-id="${account.bucket.id}" tabindex="0" role="button" aria-label="Open ${escapeHtml(account.bucket.name)} account details">
                      <div class="account-card-hero">
                        <div class="account-identity-panel">
                          <span class="account-card-kicker">Virtual Budget Account</span>
                          <div class="account-title-cluster">
                            <span class="account-icon">${getBucketCategoryIcon(account.categoryType)}</span>
                            <div class="account-name">
                              <span class="account-title-row"><strong>${escapeHtml(account.bucket.name)}</strong><span class="account-title-edit" aria-hidden="true">${getWalletActionIcon("edit")}</span></span>
                              <span class="account-source-line">
                                <em>${escapeHtml(account.tokenLabel)} on ${escapeHtml(account.networkLabel)}</em>
                                <em class="account-purpose-chip">${escapeHtml(account.group)}</em>
                                <small>${escapeHtml(shortAddress(account.walletAddress))}<span class="account-copy-glyph" aria-hidden="true">${getWalletActionIcon("copy")}</span></small>
                              </span>
                              <span class="account-spent-line">Spent <b>${renderMoneyValue(account.spent, { compactAt: 1_000_000, label: `${account.bucket.name} spent this week` })}</b> this week${account.monthlyRequired > 0 ? ` ï¿½ Weekly target ${renderMoneyValue(account.weeklyTarget, { compactAt: 1_000_000, label: `${account.bucket.name} weekly target` })}` : ""}</span>
                            </div>
                          </div>
                        </div>

                        <div class="account-amount ${index % 3 === 2 ? "blue" : ""}">
                          <span>Subaccount Balance</span>
                          <strong>${renderMoneyValue(account.balance, { className: "account-balance-money", compactAt: 1_000_000, label: `${account.bucket.name} subaccount balance` })}</strong>
                          <i class="account-coin-stack" aria-hidden="true">${getVbaBalanceIcon(account.tokenLabel)}</i>
                        </div>
                      </div>

                      <div class="account-meter-stack">
                        <div class="meter-row">
                          <div class="meter-label"><span>Allocation share <i aria-hidden="true">i</i></span><strong>${account.allocationPercent}%</strong></div>
                          <div class="account-progress"><span style="width:${account.allocationPercent}%"></span></div>
                        </div>
                        ${account.monthlyRequired > 0 ? `
                          <div class="meter-row">
                            <div class="meter-label"><span>Monthly bill goal</span><strong>${Math.min((account.balance / account.monthlyRequired) * 100, 100).toFixed(0)}%</strong></div>
                            <div class="account-progress goal-progress"><span style="width:${Math.min((account.balance / account.monthlyRequired) * 100, 100)}%"></span></div>
                          </div>
                        ` : ""}
                      </div>

                      <div class="account-funding-row">
                        <span>Funded <i></i></span>
                        <small>${escapeHtml(account.status)}</small>
                      </div>

                      <div class="account-actions">
                        <button class="primary-button account-action-card account-detail" data-wallet-id="${account.walletId}" data-bucket-id="${account.bucket.id}" type="button">${getWalletActionIcon("view")}<span>View</span></button>
                        <button class="secondary-button account-action-card account-edit" data-wallet-id="${account.walletId}" data-bucket-id="${account.bucket.id}" type="button">${getWalletActionIcon("edit")}<span>Customize</span></button>
                        <button class="secondary-button account-action-card account-move" data-bucket-id="${account.bucket.id}" type="button">${getWalletActionIcon("move")}<span>Move</span></button>
                        ${account.walletOverbalance > 0.01 ? `<button class="primary-button account-action-card account-rebalance" data-wallet-id="${account.walletId}" type="button">${getWalletActionIcon("layers")}<span>Refresh VBAs</span></button>` : ""}
                        ${account.canSend && canSendFromVirtualBucketAccounts() ? `<button class="primary-button account-action-card account-send" data-wallet-id="${account.walletId}" data-bucket-id="${account.bucket.id}" type="button">${getWalletActionIcon("send")}<span>Send</span></button>` : ""}
                        <button class="secondary-button account-action-card account-rules" data-wallet-id="${account.walletId}" data-bucket-id="${account.bucket.id}" type="button">${getWalletActionIcon("rules")}<span>Rules</span></button>
                        ${isBillsBucket(account.bucket) ? `<button class="secondary-button account-action-card account-bills" data-wallet-id="${account.walletId}" data-bucket-id="${account.bucket.id}" type="button">${getWalletActionIcon("bills")}<span>Bills</span></button>` : ""}
                      </div>

                      ${account.subaccounts.length ? `
                        <div class="subaccount-list">
                          ${account.subaccounts.map((subaccount) => `
                            <div class="subaccount-pill">
                              <span><strong>${escapeHtml(subaccount.name)}</strong><small>${escapeHtml(getBillDueText(subaccount))}</small></span>
                              <strong>${renderMoneyValue(Number(subaccount.required || subaccount.allocated || 0), { compactAt: 1_000_000, label: `${subaccount.name} amount` })}</strong>
                            </div>
                          `).join("")}
                        </div>
                      ` : ""}
                    </article>
                  `).join("")}
                </div>
              </section>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }).join("");

  bucketAccountsView.innerHTML += assetAccountsSection;

  bucketAccountsView.querySelectorAll(".account-row:not(.virtual-asset-row)").forEach((row) => {
    row.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      openBucketDetailDialog(row.dataset.walletId, row.dataset.bucketId);
    });
    row.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openBucketDetailDialog(row.dataset.walletId, row.dataset.bucketId);
    });
  });
  bucketAccountsView.querySelectorAll(".account-detail").forEach((button) => {
    button.addEventListener("click", () => openBucketDetailDialog(button.dataset.walletId, button.dataset.bucketId));
  });
  bucketAccountsView.querySelectorAll(".account-edit").forEach((button) => {
    button.addEventListener("click", () => {
      const wallet = wallets.find((item) => item.id === button.dataset.walletId);
      const bucket = wallet?.allocation?.buckets?.find((item) => item.id === button.dataset.bucketId);
      if (isBillsBucket(bucket)) {
        openBillsPlannerDialog(button.dataset.walletId, button.dataset.bucketId);
        return;
      }
      openEditBucketDialog(button.dataset.walletId, button.dataset.bucketId);
    });
  });
  bucketAccountsView.querySelectorAll(".account-move").forEach((button) => {
    button.addEventListener("click", () => openMoveMoneyDialog(button.dataset.bucketId));
  });
  bucketAccountsView.querySelectorAll(".account-send").forEach((button) => {
    button.addEventListener("click", () => openSendDialog(button.dataset.walletId, button.dataset.bucketId));
  });
  bucketAccountsView.querySelectorAll(".account-rebalance").forEach((button) => {
    button.addEventListener("click", () => refreshVirtualAccounts(button.dataset.walletId));
  });
  bucketAccountsView.querySelectorAll(".account-rules").forEach((button) => {
    button.addEventListener("click", () => openBucketRulesDialog(button.dataset.walletId, button.dataset.bucketId));
  });
  bucketAccountsView.querySelectorAll(".account-bills").forEach((button) => {
    button.addEventListener("click", () => openBillsPlannerDialog(button.dataset.walletId, button.dataset.bucketId));
  });
  bindVirtualAssetAccountControls(bucketAccountsView);
}

function getFundingQueueItems() {
  const items = [];
  const readyToAssign = getReadyToAssign();
  if (readyToAssign > 0.01) {
    items.push({
      type: "assign",
      title: `${formatUsd(readyToAssign)} ready to assign`,
      detail: "Split available value into your Virtual Budget Accounts.",
      amount: readyToAssign,
    });
  }

  getSupportedWallets().forEach((wallet) => {
    const overbalance = getWalletOverbalanceAmount(wallet);
    if (overbalance > 0.01) {
      items.push({
        type: "overbalance",
        walletId: wallet.id,
        title: `${wallet.name} needs VBA refresh`,
        detail: `Virtual Budget Accounts are ${formatUsd(overbalance)} above the actual wallet balance. Refresh VBAs to match the current wallet.`,
        amount: overbalance,
      });
    }

    if (Number(wallet.allocation?.pendingSpend || 0) > 0.01) {
      items.push({
        type: "pendingSpend",
        walletId: wallet.id,
        title: `${formatUsd(wallet.allocation.pendingSpend)} unassigned spending`,
        detail: `${wallet.name} has spending that needs a budget account.`,
        amount: Number(wallet.allocation.pendingSpend),
      });
    }

    getWalletIntegrityIssues(wallet)
      .filter((issue) => !["overbalance", "unallocated", "pendingSpend"].includes(issue.type))
      .forEach((issue) => {
        items.push({
          type: "integrity",
          walletId: wallet.id,
          bucketId: issue.bucketId || "",
          action: issue.action,
          title: issue.title,
          detail: issue.detail,
          amount: issue.amount || 0,
        });
      });

    (wallet.allocation?.buckets || []).forEach((bucket) => {
      const allocated = Number(bucket.allocated || 0);
      const spent = Number(bucket.spent || 0);
      const left = allocated - spent;
      const rules = bucket.rules || {};
      const minimum = Number(rules.minimum || 0);
      const warning = Number(rules.warning || 0);
      const refill = Number(rules.refill || 0);

      if (minimum > 0 && left < minimum) {
        items.push({
          type: "minimum",
          walletId: wallet.id,
          bucketId: bucket.id,
          title: `${bucket.name} below minimum`,
          detail: `${wallet.name} needs ${formatUsd(minimum - left)} to reach the minimum.`,
          amount: minimum - left,
        });
      } else if (warning > 0 && left <= warning) {
        items.push({
          type: "warning",
          walletId: wallet.id,
          bucketId: bucket.id,
          title: `${bucket.name} is near empty`,
          detail: `${wallet.name} has a ${formatUsd(Math.max(left, 0))} balance in this account.`,
          amount: Math.max(left, 0),
        });
      }

      if (refill > 0 && left < refill) {
        items.push({
          type: "refill",
          walletId: wallet.id,
          bucketId: bucket.id,
          title: `${bucket.name} needs refill`,
          detail: `${formatUsd(refill - left)} needed to hit the refill target.`,
          amount: refill - left,
        });
      }

      const resetDue = getResetDue(bucket);
      if (resetDue) {
        items.push({
          type: "reset",
          walletId: wallet.id,
          bucketId: bucket.id,
          title: `${bucket.name} ${resetDue} reset due`,
          detail: `Close this budget cycle without changing the real account balance, then refill toward ${formatUsd(refill || allocated)} only from available unallocated funds.`,
          amount: Math.max((refill || allocated) - left, 0),
        });
      }
    });
  });

  getUpcomingBillItems().slice(0, 4).forEach((item) => {
    items.push({
      type: "billDue",
      walletId: item.walletId,
      bucketId: item.bucketId,
      title: `${item.bill.name} ${item.label.toLowerCase()}`,
      detail: `${item.dateLabel} due date${Number(item.bill.required || 0) > 0 ? ` for ${formatUsd(item.bill.required)}` : ""}.`,
      amount: Number(item.bill.required || 0),
    });
  });

  return items.slice(0, 8);
}

function getResetDue(bucket) {
  const rules = bucket.rules || {};
  if (!rules.reset || rules.reset === "never") return "";
  const lastReset = rules.lastReset ? new Date(rules.lastReset) : new Date(0);
  const now = new Date();
  const days = (now - lastReset) / 86_400_000;
  if (rules.reset === "weekly" && days >= 7) return "weekly";
  if (rules.reset === "monthly" && (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear())) return "monthly";
  return "";
}


function renderDashboard() {
  const dashboard = getMonthlyDashboard();
  const details = getDashboardDetails(dashboard);
  const integrity = getBalanceIntegritySummary();
  const balanceTasks = getSupportedWallets().flatMap((wallet) => {
    const tasks = [];
    const pendingIncrease = getWalletAssignableAmount(wallet);
    const pendingSpend = Number(wallet.allocation?.pendingSpend || 0);
    const overbalance = getWalletOverbalanceAmount(wallet);
    if (overbalance > 0.01) {
      tasks.push({
        type: "overbalance",
        walletId: wallet.id,
        title: "Virtual accounts over wallet",
        detail: `${wallet.name} VBAs are ${formatUsd(overbalance)} above the real wallet balance. Refresh VBAs to match the current wallet.`,
        amount: overbalance,
      });
    }
    if (!isReserveAssetWallet(wallet) && pendingIncrease > 0.01) {
      tasks.push({
        type: "newFunds",
        walletId: wallet.id,
        title: "New funds detected",
        detail: `${wallet.name} needs ${formatUsd(pendingIncrease)} allocated into Virtual Budget Accounts.`,
        amount: pendingIncrease,
      });
    }
    if (pendingSpend > 0.01) {
      tasks.push({
        type: "unassignedSpend",
        walletId: wallet.id,
        title: "Unassigned spending",
        detail: `${wallet.name} has ${formatUsd(pendingSpend)} that needs a budget account or liquidation rebalance.`,
        amount: pendingSpend,
      });
    }
    getWalletIntegrityIssues(wallet)
      .filter((issue) => !["overbalance", "unallocated", "pendingSpend"].includes(issue.type))
      .forEach((issue) => {
        tasks.push({
          type: "integrity",
          walletId: wallet.id,
          bucketId: issue.bucketId || "",
          action: issue.action,
          title: issue.title,
          detail: issue.detail,
          amount: issue.amount || 0,
        });
      });
    return tasks;
  });
  dashboardMonth.textContent = dashboard.monthLabel;
  const utilization = dashboard.allocated > 0
    ? Math.min((dashboard.monthSpending / dashboard.allocated) * 100, 999)
    : 0;
  const moneyIn = dashboard.moneyIn;
  const moneyOut = dashboard.moneyOut;
  const stablecoinPercent = dashboard.walletBalance > 0 ? Math.min((details.stablecoinTotal / dashboard.walletBalance) * 100, 100) : 0;
  const goalProgress = details.goalTotal > 0 ? Math.min((details.goalCurrent / details.goalTotal) * 100, 100) : 0;

  dashboardStats.closest(".dashboard-panel")?.classList.add("monthly-dashboard-shell");
  dashboardStats.innerHTML = `
    ${renderMonthlyDashboardStats(dashboard, details, utilization, stablecoinPercent)}
    ${renderMonthlyMoneyFlowStrip(moneyIn, moneyOut)}
  `;

  const alerts = [];
  dashboard.ruleAlerts.slice(0, 2).forEach((message) => alerts.push(message));
  dashboard.lowBuckets.slice(0, 2).forEach((message) => alerts.push(message));
  const supportedWalletCount = getSupportedWallets().length;
  if (dashboard.bucketCount === 0 && supportedWalletCount) alerts.push("Create Virtual Budget Accounts to start budgeting tracked balances.");
  if (!supportedWalletCount) alerts.push("Add a supported wallet address to start your AllocaFi dashboard.");
  const dashboardInsightRows = getMonthlyOverviewAiInsights(dashboard, details, moneyIn, moneyOut);
  const aiInsights = [
    ...dashboardInsightRows,
    ...getAiDisplayInsights(details.insights),
    ...alerts.map((message) => ({
      title: "Alert",
      severity: "warning",
      message,
      action: "Review",
      source: "monthly-dashboard",
    })),
  ];
  const aiUpdatedLabel = aiInsightsState?.updatedAt ? new Date(aiInsightsState.updatedAt).toLocaleString() : "Not refreshed yet";
  const aiModeLabel = aiInsightsState?.mode || "local-dashboard";
  const aiRunCost = Number(aiInsightsState?.cost?.estimatedCostUsd || aiInsightsState?.cost?.estimatedUsd || 0);
  const aiCostLabel = aiRunCost
    ? `Est. $${aiRunCost.toFixed(4)}`
    : "No AI cost";

  dashboardAlerts.innerHTML = `
    ${balanceTasks.length ? `
      <section class="balance-task-strip">
        <div class="balance-task-heading">
          <div>
            <span>Wallet Balance Tasks</span>
            <strong>${balanceTasks.length} wallet ${balanceTasks.length === 1 ? "task" : "tasks"} need attention</strong>
          </div>
          <small>Complete these to keep Virtual Budget Accounts matched to the real wallet balance.</small>
        </div>
        <div class="balance-task-list">
          ${balanceTasks.map((task) => `
            <article class="balance-task-card ${task.type === "unassignedSpend" ? "spend-task" : ""}">
              <div>
                <span>${escapeHtml(task.title)}</span>
                <strong>${formatUsd(task.amount)}</strong>
                <p>${escapeHtml(task.detail)}</p>
              </div>
              ${task.type === "newFunds"
                ? `<button class="primary-button dashboard-allocate-pending" data-wallet-id="${task.walletId}" type="button">Allocate</button>`
                : task.type === "overbalance"
                  ? `<button class="primary-button dashboard-rebalance-wallet" data-wallet-id="${task.walletId}" type="button">Refresh VBAs</button>`
                : task.type === "integrity" && task.action === "refresh"
                  ? `<button class="primary-button dashboard-rebalance-wallet" data-wallet-id="${task.walletId}" type="button">Refresh VBAs</button>`
                : task.type === "integrity" && task.action === "refreshWallet"
                  ? `<button class="primary-button dashboard-refresh-wallet" data-wallet-id="${task.walletId}" type="button">Refresh</button>`
                : task.type === "integrity" && task.action === "removeLiquidated"
                  ? `<button class="secondary-button dashboard-remove-liquidated" data-wallet-id="${task.walletId}" type="button">Remove empty VBAs</button>`
                : task.type === "integrity" && task.action === "autoAllocate"
                  ? `<button class="primary-button dashboard-auto-allocate" data-wallet-id="${task.walletId}" type="button">Auto Allocate</button>`
                : task.type === "integrity" && task.action === "repair"
                  ? `<button class="primary-button dashboard-repair-data" data-wallet-id="${task.walletId}" type="button">Repair</button>`
                : task.type === "integrity" && task.action === "review"
                  ? `<button class="secondary-button dashboard-review-bucket" data-wallet-id="${task.walletId}" data-bucket-id="${task.bucketId}" type="button">Review</button>`
                : `<button class="secondary-button dashboard-assign-spend" data-wallet-id="${task.walletId}" type="button">Assign</button>`}
            </article>
          `).join("")}
        </div>
      </section>
    ` : ""}
    <section class="overview-grid">
      <div class="overview-feature-pair">
        ${renderStablecoinLiquidityMonitor(details)}
        ${renderVirtualBucketAccountSummary(details, dashboard)}
      </div>
      <div class="overview-feature-pair overview-secondary-pair">
        ${renderStablecoinRatioCard(details, dashboard, stablecoinPercent)}
        ${renderUpcomingBillsCard(details)}
      </div>
      <div class="overview-card insight-card ai-command-card">
        <div class="ai-command-hero">
          <div class="ai-orbit" aria-hidden="true"><span></span><i></i></div>
          <div>
            <span class="subscription-kicker">AI Budget Copilot</span>
            <h3>AI Insights</h3>
            <p>Redacted, custody-safe guidance for stablecoin allocation, spending pressure, and budget account health.</p>
          </div>
          <strong>${aiInsights.length}</strong>
        </div>
        <div class="ai-insight-grid">
          ${aiInsights.length ? aiInsights.map((insight) => {
            const severity = String(insight.severity || "info").toLowerCase();
            const severityClass = ["warning", "success", "risk", "action", "info"].includes(severity) ? severity : "info";
            return `
              <article class="ai-insight-row ${severityClass}">
                <span class="ai-severity-dot" aria-hidden="true"></span>
                <div>
                  <strong>${escapeHtml(insight.title || "Insight")}</strong>
                  <p>${escapeHtml(insight.message || "")}</p>
                </div>
                <em>${escapeHtml(insight.action || (insight.requiresConfirmation ? "Confirm first" : "Review"))}</em>
              </article>
            `;
          }).join("") : `<p class="wallet-note">No insights yet. Refresh AI after adding wallets and Virtual Budget Accounts.</p>`}
        </div>
        <div class="ai-command-footer">
          <div>
            <span>${escapeHtml(aiModeLabel)}</span>
            <small>${aiInsightsState?.redacted ? "redacted summaries" : "local summaries"} | ${escapeHtml(aiUpdatedLabel)} | ${escapeHtml(aiCostLabel)}</small>
          </div>
          <button id="refreshAiInsights" class="secondary-button" type="button">Refresh AI</button>
        </div>
      </div>
    </section>
  `;

  renderSettingsManagementSystems(details, dashboard, integrity, goalProgress);

  dashboardAlerts.querySelectorAll(".dashboard-allocate-pending").forEach((button) => {
    button.addEventListener("click", () => allocatePendingFunds(button.dataset.walletId));
  });
  dashboardAlerts.querySelectorAll(".dashboard-auto-allocate").forEach((button) => {
    button.addEventListener("click", () => openAssignMoneyDialog(button.dataset.walletId));
  });
  dashboardAlerts.querySelectorAll(".dashboard-assign-spend").forEach((button) => {
    button.addEventListener("click", () => openSpendDialog(button.dataset.walletId, null, true));
  });
  dashboardAlerts.querySelectorAll(".dashboard-rebalance-wallet").forEach((button) => {
    button.addEventListener("click", () => refreshVirtualAccounts(button.dataset.walletId));
  });
  dashboardAlerts.querySelectorAll(".dashboard-refresh-wallet").forEach((button) => {
    button.addEventListener("click", () => refreshWallet(button.dataset.walletId));
  });
  dashboardAlerts.querySelectorAll(".dashboard-repair-data").forEach((button) => {
    button.addEventListener("click", () => repairWalletDataWithConfirmation(button.dataset.walletId));
  });
  dashboardAlerts.querySelectorAll(".dashboard-remove-liquidated").forEach((button) => {
    button.addEventListener("click", () => removeLiquidatedAccountsWithConfirmation(button.dataset.walletId));
  });
  dashboardAlerts.querySelectorAll(".dashboard-review-bucket").forEach((button) => {
    button.addEventListener("click", () => openBucketDetailDialog(button.dataset.walletId, button.dataset.bucketId));
  });
  dashboardAlerts.querySelectorAll(".dashboard-open-bills").forEach((button) => {
    button.addEventListener("click", () => openBillsPlannerDialog(button.dataset.walletId, button.dataset.bucketId));
  });
  dashboardAlerts.querySelectorAll(".vba-summary-row").forEach((button) => {
    button.addEventListener("click", () => openBucketDetailDialog(button.dataset.walletId, button.dataset.bucketId));
  });
  dashboardAlerts.querySelector("[data-open-vba-accounts]")?.addEventListener("click", () => switchTab("accounts"));
  dashboardAlerts.querySelector("[data-open-stablecoin-details]")?.addEventListener("click", () => switchTab("wallets"));
  dashboardAlerts.querySelector("[data-open-upcoming-bills]")?.addEventListener("click", () => switchTab("accounts"));
  dashboardAlerts.querySelectorAll("[data-open-bill-row]").forEach((button) => {
    button.addEventListener("click", () => openBillsPlannerDialog(button.dataset.walletId, button.dataset.bucketId));
  });
  dashboardAlerts.querySelectorAll("[data-pay-bill-row]").forEach((button) => {
    button.addEventListener("click", () => {
      openSendDialog(button.dataset.walletId, button.dataset.bucketId, {
        amount: Number(button.dataset.billAmount || 0),
        billName: button.dataset.billName || "Bill",
      });
    });
  });
  dashboardAlerts.querySelectorAll(".liquidity-range-button").forEach((button) => {
    button.addEventListener("click", () => {
      stablecoinLiquidityRange = button.dataset.liquidityRange || "24H";
      renderDashboard();
    });
  });
  dashboardAlerts.querySelector("#refreshAiInsights")?.addEventListener("click", refreshAiInsights);
}

function repairSafeBalanceIssues() {
  const integrity = getBalanceIntegritySummary();
  const repairableWalletIds = [...new Set(integrity.issues.filter((issue) => issue.action === "repair").map((issue) => issue.walletId))];
  if (!repairableWalletIds.length) {
    showToast("Data check passed");
    return;
  }
  if (!window.confirm("Repair safe balance issues now? This can refresh overbalanced VBAs to the current wallet balance and clean up stale local numbers. It will not move crypto.")) return;
  let changed = false;
  repairableWalletIds.forEach((walletId) => {
    changed = repairWalletData(walletId) || changed;
  });
  if (changed) {
    saveWallets();
    render();
    showToast("Balance data repaired");
  } else {
    showToast("No repair needed");
  }
}

function renderSettingsManagementSystems(details, dashboard, integrity, goalProgress) {
  if (!settingsReviewSystemsView) return;

  const goalRows = goals.slice(0, 4).map((goal) => {
    const current = Number(goal.current || 0);
    const target = Number(goal.target || 0);
    const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    return `
      <div class="overview-row compact">
        <span>${escapeHtml(goal.name)}</span>
        <strong>${formatUsd(current)}</strong>
        <div class="mini-meter goals"><i style="width:${percent}%"></i></div>
        <small>${target > 0 ? `${percent.toFixed(0)}% of ${formatUsd(target)}` : "No target set"}</small>
      </div>
    `;
  }).join("");

  settingsReviewSystemsView.innerHTML = `
    <div class="overview-card data-check-card settings-management-card">
      <div class="overview-card-head"><span>Data Check</span><strong>${integrity.score}/100</strong></div>
      <p>${integrity.issues.length ? `${integrity.issues.length} item${integrity.issues.length === 1 ? "" : "s"} to review so balances stay trusted.` : "All tracked wallet and VBA numbers reconcile."}</p>
      <div class="overview-list">
        ${integrity.issues.length ? integrity.issues.slice(0, 4).map((issue) => `
          <div class="overview-row compact data-check-row ${escapeHtml(issue.severity)}">
            <span>${escapeHtml(issue.title)}</span>
            <strong>${issue.amount ? formatUsd(issue.amount) : issue.severity}</strong>
          </div>
        `).join("") : `<div class="overview-row compact data-check-row success"><span>Wallets match VBAs</span><strong>Clear</strong></div>`}
      </div>
      ${integrity.issues.some((issue) => issue.action === "repair") ? `<button id="settingsRepairBalanceData" class="secondary-button" type="button">Repair safe issues</button>` : ""}
    </div>
    <div class="overview-card spending-summary-card settings-management-card">
      <div class="overview-card-head"><span>Spending + Cashflow</span><strong>${formatUsd(details.cashflowBalance)}</strong></div>
      <p class="wallet-note">Review-only cashflow view while we decide the best user-facing role for this metric.</p>
      <div class="overview-list scroll-list">
        <div class="overview-row compact cashflow-summary-row">
          <span>Current cashflow</span>
          <strong>${formatUsd(details.cashflowBalance)}</strong>
        </div>
        ${details.spendingRows.length ? details.spendingRows.map((row) => `
          <div class="overview-row compact">
            <span>${escapeHtml(row.bucket.name)} spent</span>
            <strong>${formatUsd(row.spent)}</strong>
          </div>
        `).join("") : `<p class="wallet-note">No money-out activity from subaccounts this month.</p>`}
      </div>
    </div>
    <div class="overview-card settings-management-card">
      <div class="overview-card-head"><span>Goal Tracking</span><strong>${goalProgress.toFixed(0)}%</strong></div>
      <div class="mini-meter goals"><i style="width:${goalProgress}%"></i></div>
      <p class="wallet-note">${goals.length ? `${formatUsd(details.goalCurrent)} saved of ${formatUsd(details.goalTotal)}` : "Standalone goals are tucked into Settings while goals linked to budget accounts evolve inside Wallets and Accounts."}</p>
      <div class="overview-list scroll-list">
        ${goalRows || `<p class="wallet-note">No standalone goals yet.</p>`}
      </div>
      <div class="dialog-actions">
        <button class="secondary-button" data-open-goal-tools type="button">Open goal tools</button>
        <button class="ghost-button" data-add-goal-from-settings type="button">Add goal</button>
      </div>
    </div>
  `;

  settingsReviewSystemsView.querySelector("#settingsRepairBalanceData")?.addEventListener("click", repairSafeBalanceIssues);
  settingsReviewSystemsView.querySelector("[data-open-goal-tools]")?.addEventListener("click", () => switchTab("goals"));
  settingsReviewSystemsView.querySelector("[data-add-goal-from-settings]")?.addEventListener("click", openGoalDialog);
}


function renderGoals() {
  if (!goalList) return;
  goalList.innerHTML = goals.length ? goals.map((goal) => `
    <article class="overview-row compact"><span>${escapeHtml(goal.name || "Goal")}</span><strong>${formatUsd(goal.current || 0)} / ${formatUsd(goal.target || 0)}</strong></article>
  `).join("") : `<p class="wallet-note">No standalone goals yet.</p>`;
}

function renderTransactionLog() {
  if (!transactionLog) return;
  const rows = getAllTransactions().slice(0, 30);
  const summary = rows.reduce((totals, tx) => {
    const direction = getTransactionFlowDirection(tx);
    const amount = Math.abs(Number(tx.amount || 0));
    if (direction === "in") totals.moneyIn += amount;
    if (direction === "out") totals.moneyOut += amount;
    return totals;
  }, { moneyIn: 0, moneyOut: 0 });
  transactionLog.innerHTML = `
    <section class="receipt-ledger-summary">
      <div><span>Money In</span><strong>${formatUsd(summary.moneyIn)}</strong><small>Deposits and wallet increases</small></div>
      <div><span>Money Out</span><strong>${formatUsd(summary.moneyOut)}</strong><small>Spending and sends</small></div>
      <div><span>Receipts</span><strong>${rows.length}</strong><small>Organized AllocaFi records</small></div>
    </section>
    ${rows.length ? rows.map((tx) => {
      const receipt = getTransactionReceiptSummary(tx);
      const chips = [receipt.networkLabel, receipt.asset, receipt.flowLabel, receipt.status].filter(Boolean);
      return `
        <article class="receipt-log-row flow-${escapeHtml(receipt.direction)}">
          <span class="receipt-flow-mark">
            ${renderOverviewPanelIcon(receipt.icon)}
            <span>${escapeHtml(receipt.flowLabel)}</span>
          </span>
          <div class="receipt-log-main">
            <div class="receipt-log-title">
              <strong>${escapeHtml(receipt.title)}</strong>
              <span>${escapeHtml(receipt.status)}</span>
            </div>
            <small>${escapeHtml(receipt.meta)}</small>
            <div class="receipt-chip-row">
              ${chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join("")}
            </div>
            <small class="receipt-hash">Receipt ${escapeHtml(receipt.receiptId)}${receipt.walletAddress ? ` | Address ${escapeHtml(receipt.walletAddress)}` : ""}</small>
          </div>
          <div class="receipt-log-amount">
            <span>${escapeHtml(receipt.flowLabel)}</span>
            <strong>${escapeHtml(receipt.amountText)}</strong>
            <small>${escapeHtml(receipt.assetAmountText)}</small>
            <button class="secondary-button receipt-view-button" data-open-transaction-receipt="${escapeHtml(tx.id)}" type="button">View Receipt</button>
          </div>
        </article>
      `;
    }).join("") : `<p class="wallet-note">No transaction activity yet.</p>`}
  `;
  transactionLog.querySelectorAll("[data-open-transaction-receipt]").forEach((button) => {
    button.addEventListener("click", () => openTransactionReceiptDialog(button.dataset.openTransactionReceipt));
  });
}

function openTransactionReceiptDialog(transactionId) {
  const tx = getAllTransactions().find((item) => item.id === transactionId) || {};
  const receipt = getTransactionReceiptSummary(tx);
  openDialog(`
    <div class="dialog-content transaction-receipt-modal">
      <section class="receipt-modal-hero flow-${escapeHtml(receipt.direction)}">
        <span class="receipt-modal-icon">${renderOverviewPanelIcon(receipt.icon)}</span>
        <div>
          <span>AllocaFi Transaction Receipt</span>
          <h2>${escapeHtml(receipt.title)}</h2>
          <small>${escapeHtml(receipt.receiptId)} | ${escapeHtml(receipt.createdLabel)}</small>
        </div>
        <strong>${escapeHtml(receipt.amountText)}</strong>
      </section>
      <section class="receipt-modal-grid">
        <article><span>Status</span><strong>${escapeHtml(receipt.status)}</strong><small>${escapeHtml(receipt.flowLabel)}</small></article>
        <article><span>Asset</span><strong>${escapeHtml(receipt.asset)}</strong><small>${escapeHtml(receipt.assetAmountText)}</small></article>
        <article><span>Network</span><strong>${escapeHtml(receipt.networkLabel)}</strong><small>Tracked public wallet</small></article>
        <article><span>Wallet</span><strong>${escapeHtml(receipt.walletName)}</strong><small>${receipt.walletAddress ? escapeHtml(shortAddress(receipt.walletAddress)) : "Address unavailable"}</small></article>
      </section>
      <section class="receipt-modal-ledger">
        <div><span>Wallet Address</span><strong>${escapeHtml(receipt.walletAddress || "Address unavailable")}</strong><small>Public address only</small></div>
        <div><span>${escapeHtml(receipt.reference.label)}</span><strong>${escapeHtml(receipt.reference.value)}</strong><small>${escapeHtml(receipt.reference.detail)}</small></div>
        <div><span>Receipt Source</span><strong>${escapeHtml(receipt.sourceLabel)}</strong><small>Recorded by AllocaFi activity tracking</small></div>
        <div><span>Receipt ID</span><strong>${escapeHtml(receipt.receiptId)}</strong><small>Use this ID for AllocaFi support or export review</small></div>
      </section>
      <p class="receipt-modal-text">${escapeHtml(getTransactionReceiptNarrative(tx))}</p>
    </div>
  `);
}

function renderAddressBook() {
  if (!addressBookList) return;
  addressBookList.innerHTML = addressBook.length ? addressBook.map((entry) => `
    <article class="overview-row compact"><span>${escapeHtml(entry.name || "Saved destination")}</span><strong>${escapeHtml(shortAddress(entry.address || ""))}</strong></article>
  `).join("") : `<p class="wallet-note">No saved destinations yet.</p>`;
}

function renderMonthlyBudgetPage() {
  if (!monthlyBudgetView) return;
  const dashboard = getDashboardSummary();
  const details = getDashboardDetails(dashboard);
  if (monthlyBudgetStatus) monthlyBudgetStatus.textContent = dashboard.monthLabel || "This Month";
  monthlyBudgetView.innerHTML = `
    ${renderMonthlyDashboardStats(dashboard, details, dashboard.allocated ? (dashboard.monthSpending / dashboard.allocated) * 100 : 0, dashboard.walletBalance ? (details.stablecoinTotal / dashboard.walletBalance) * 100 : 0)}
    ${renderMonthlyMoneyFlowPanel({ dashboard, details, moneyIn: dashboard.moneyIn, moneyOut: dashboard.moneyOut, utilization: dashboard.allocated ? (dashboard.monthSpending / dashboard.allocated) * 100 : 0 })}
  `;
}

function renderFamilyDashboard() {
  if (!familyDashboardView) return;
  const model = getFamilyTreasuryDashboardModel(FAMILY_TREASURY_MOCK_DATA, { activeMemberId: familyTreasuryMemberId, query: familyTreasuryQuery });
  familyDashboardView.innerHTML = `<div class="overview-card"><div class="overview-card-head"><span>AllocaFi Family</span><strong>${formatUsd(model.analytics.totalFamilyTreasury || 0)}</strong></div><p class="wallet-note">Shared family treasury preview remains non-custodial.</p></div>`;
}

function renderBusinessDashboard() {
  if (!businessDashboardView) return;
  const model = getEnterpriseDashboardModel(ENTERPRISE_MOCK_DATA, { role: enterpriseDashboardRole, range: enterpriseDashboardRange, query: enterpriseDashboardQuery });
  businessDashboardView.innerHTML = `<div class="overview-card"><div class="overview-card-head"><span>AllocaFi Enterprise</span><strong>${formatUsd(model.analytics.totalAllocatedBalance || 0)}</strong></div><p class="wallet-note">Business treasury analytics preview.</p></div>`;
}

function renderAllocaFiPay() {
  if (!allocafiPayView) return;
  const metrics = getPayDashboardMetrics(allocafiPayState);
  allocafiPayView.innerHTML = `<div class="overview-card"><div class="overview-card-head"><span>AllocaFi Pay</span><strong>${renderMoneyValue(metrics.totalPayBalance || 0)}</strong></div><p class="wallet-note">Payment routing remains external and wallet-approved.</p></div>`;
}

function renderAllocaFiLedgerCore() {
  if (!ledgerCoreView) return;
  ledgerCoreState = normalizeLedgerCoreState(ledgerCoreState);
  ledgerCoreView.innerHTML = renderLedgerCoreShell(ledgerCoreState);
}

function renderRewardsDashboard() {
  if (!rewardsDashboardView) return;
  rewardsDashboardView.innerHTML = `<div class="overview-card"><div class="overview-card-head"><span>ALFI Rewards</span><strong>${getAllocafiAiBalance()}</strong></div><p class="wallet-note">Points preview for rewards and AI usage controls.</p></div>`;
}

function renderAdminDashboard() {
  if (!adminDashboardView) return;
  const controls = getAdminControls();
  const aiCalls = allocafiAiLogs.length;
  const blockedCalls = allocafiAiLogs.filter((log) => log.status === "blocked").length;
  const totalAlfi = allocafiAiLogs.reduce((sum, log) => sum + Number(log.alfiCharged || 0), 0);
  const estimatedCost = allocafiAiLogs.reduce((sum, log) => sum + Number(log.estimatedCost || 0), 0);
  const activePricingRules = allocafiAiPricingRules.filter((rule) => rule.active !== false).length;
  const auditRows = (financeData.adminAuditLogs || []).slice(0, 8).map((log) => `
    <div class="overview-row compact">
      <span>${escapeHtml(log.action)}</span>
      <strong>${new Date(log.createdAt).toLocaleDateString()}</strong>
    </div>
  `).join("");

  adminDashboardView.innerHTML = `
    <div class="admin-core-grid">
      <section class="overview-card admin-core-card">
        <div class="overview-card-head">
          <span>Admin Core</span>
          <strong>${controls.adminPowerEnabled ? "Enabled" : "Off"}</strong>
        </div>
        <p class="wallet-note">Local owner controls for unlocking core testing, premium entitlements, module visibility, and protected previews. This does not custody funds or store private keys.</p>
        <div class="admin-control-actions">
          <button id="toggleAdminPower" class="${controls.adminPowerEnabled ? "danger-button" : "primary-button"}" type="button">${controls.adminPowerEnabled ? "Turn Off Admin Core" : "Turn On Admin Core"}</button>
          <button id="togglePayModule" class="secondary-button" type="button" ${controls.adminPowerEnabled ? "" : "disabled"}>${controls.showPayModule ? "Hide AllocaFi Pay" : "Show AllocaFi Pay"}</button>
        </div>
        <div class="overview-list">
          <div class="overview-row compact"><span>Full app unlocked</span><strong>${controls.fullAppUnlocked ? "Yes" : "No"}</strong></div>
          <div class="overview-row compact"><span>Pay module visible</span><strong>${controls.showPayModule ? "Yes" : "No"}</strong></div>
          <div class="overview-row compact"><span>Core entitlement mode</span><strong>${controls.adminPowerEnabled ? "Admin" : getCurrentSubscriptionPlan().name}</strong></div>
        </div>
      </section>

      <section class="overview-card admin-ai-card">
        <div class="overview-card-head">
          <span>Admin AI</span>
          <strong>Kept</strong>
        </div>
        <p class="wallet-note">Admin AI remains available for local analytics, pricing review, route visibility, and blocked request monitoring while user-facing AllocaFi AI is parked in Settings for a later build.</p>
        <div class="vault2-status-grid">
          <div><span>AI calls</span><strong>${aiCalls}</strong></div>
          <div><span>Blocked</span><strong>${blockedCalls}</strong></div>
          <div><span>ALFI used</span><strong>${totalAlfi}</strong></div>
          <div><span>Pricing rules</span><strong>${activePricingRules}</strong></div>
        </div>
        <div class="overview-list">
          <div class="overview-row compact"><span>Estimated API cost</span><strong>${formatUsd(estimatedCost)}</strong></div>
          <div class="overview-row compact"><span>User AI status</span><strong>Future project</strong></div>
        </div>
      </section>

      <section class="overview-card admin-audit-card">
        <div class="overview-card-head">
          <span>Admin Audit Log</span>
          <strong>${(financeData.adminAuditLogs || []).length}</strong>
        </div>
        <div class="overview-list">${auditRows || `<p class="wallet-note">No admin actions recorded yet.</p>`}</div>
      </section>
    </div>
  `;

  adminDashboardView.querySelector("#toggleAdminPower")?.addEventListener("click", () => {
    updateAdminControl("adminPowerEnabled", !controls.adminPowerEnabled);
  });
  adminDashboardView.querySelector("#togglePayModule")?.addEventListener("click", () => {
    if (!controls.adminPowerEnabled) {
      showToast("Turn on Admin Core first");
      return;
    }
    updateAdminControl("showPayModule", !controls.showPayModule);
  });
}

function renderAccountCloudPanel() {
  if (!accountCloudView) return;
  accountCloudView.innerHTML = `<div class="overview-card"><div class="overview-card-head"><span>Account Cloud</span><strong>${escapeHtml(accountProfile.provider || "local-preview")}</strong></div><p class="wallet-note">Local profile and sync queue preview.</p></div>`;
}

function renderSubscriptionPaymentsSystem() {
  if (!subscriptionPaymentsView) return;
  const plan = getCurrentSubscriptionPlan();
  subscriptionPaymentsView.innerHTML = `<div class="overview-card"><div class="overview-card-head"><span>Premium Membership</span><strong>${escapeHtml(plan.name)}</strong></div><p class="wallet-note">Local preview billing state. No payment is charged here.</p></div>`;
}

function renderFundingQueue() {
  const items = getFundingQueueItems();
  if (!items.length) {
    fundingQueue.innerHTML = `
      <div class="queue-header">
        <h3>Balance Tasks</h3>
        <span class="status-pill live">All clear</span>
      </div>
    `;
    return;
  }

  fundingQueue.innerHTML = `
    <div class="queue-header">
      <h3>Balance Tasks</h3>
      <span class="status-pill">${items.length} items</span>
    </div>
    <div class="queue-list">
      ${items.map((item, index) => `
        <div class="queue-item">
          <div class="queue-topline">
            <strong>${escapeHtml(item.title)}</strong>
            <span class="status-pill">${formatUsd(item.amount)}</span>
          </div>
          <p>${escapeHtml(item.detail)}</p>
          <div class="queue-actions">
            ${item.type === "assign" ? `<button class="primary-button queue-assign" type="button">Auto Allocate</button>` : ""}
            ${item.type === "overbalance" ? `<button class="primary-button queue-rebalance-wallet" data-wallet-id="${item.walletId}" type="button">Refresh VBAs</button>` : ""}
            ${item.type === "pendingSpend" ? `<button class="secondary-button queue-assign-spend" data-wallet-id="${item.walletId}" type="button">Assign spend</button>` : ""}
            ${item.type === "billDue" ? `<button class="secondary-button queue-open-bills" data-wallet-id="${item.walletId}" data-bucket-id="${item.bucketId}" type="button">Bills</button>` : ""}
            ${item.type === "reset" ? `<button class="primary-button queue-apply-reset" data-wallet-id="${item.walletId}" data-bucket-id="${item.bucketId}" type="button">Apply reset</button>` : ""}
            ${item.type === "integrity" && item.action === "refresh" ? `<button class="primary-button queue-rebalance-wallet" data-wallet-id="${item.walletId}" type="button">Refresh VBAs</button>` : ""}
            ${item.type === "integrity" && item.action === "removeLiquidated" ? `<button class="secondary-button queue-remove-liquidated" data-wallet-id="${item.walletId}" type="button">Remove empty VBAs</button>` : ""}
            ${item.type === "integrity" && item.action === "autoAllocate" ? `<button class="primary-button queue-auto-allocate" data-wallet-id="${item.walletId}" type="button">Auto Allocate</button>` : ""}
            ${item.type === "integrity" && item.action === "repair" ? `<button class="primary-button queue-repair-data" data-wallet-id="${item.walletId}" type="button">Repair</button>` : ""}
            ${item.type === "integrity" && item.action === "review" ? `<button class="secondary-button queue-review-bucket" data-wallet-id="${item.walletId}" data-bucket-id="${item.bucketId}" type="button">Review</button>` : ""}
            ${item.bucketId ? `<button class="secondary-button queue-rules" data-wallet-id="${item.walletId}" data-bucket-id="${item.bucketId}" type="button">Rules</button>` : ""}
            <button class="ghost-button queue-review" data-index="${index}" type="button">Mark reviewed</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  fundingQueue.querySelectorAll(".queue-assign").forEach((button) => {
    button.addEventListener("click", openAssignMoneyDialog);
  });
  fundingQueue.querySelectorAll(".queue-auto-allocate").forEach((button) => {
    button.addEventListener("click", () => openAssignMoneyDialog(button.dataset.walletId));
  });
  fundingQueue.querySelectorAll(".queue-assign-spend").forEach((button) => {
    button.addEventListener("click", () => openSpendDialog(button.dataset.walletId, null, true));
  });
  fundingQueue.querySelectorAll(".queue-rebalance-wallet").forEach((button) => {
    button.addEventListener("click", () => refreshVirtualAccounts(button.dataset.walletId));
  });
  fundingQueue.querySelectorAll(".queue-repair-data").forEach((button) => {
    button.addEventListener("click", () => repairWalletDataWithConfirmation(button.dataset.walletId));
  });
  fundingQueue.querySelectorAll(".queue-remove-liquidated").forEach((button) => {
    button.addEventListener("click", () => removeLiquidatedAccountsWithConfirmation(button.dataset.walletId));
  });
  fundingQueue.querySelectorAll(".queue-review-bucket").forEach((button) => {
    button.addEventListener("click", () => openBucketDetailDialog(button.dataset.walletId, button.dataset.bucketId));
  });
  fundingQueue.querySelectorAll(".queue-open-bills").forEach((button) => {
    button.addEventListener("click", () => openBillsPlannerDialog(button.dataset.walletId, button.dataset.bucketId));
  });
  fundingQueue.querySelectorAll(".queue-rules").forEach((button) => {
    button.addEventListener("click", () => openBucketRulesDialog(button.dataset.walletId, button.dataset.bucketId));
  });
  fundingQueue.querySelectorAll(".queue-apply-reset").forEach((button) => {
    button.addEventListener("click", () => applyBucketReset(button.dataset.walletId, button.dataset.bucketId));
  });
  fundingQueue.querySelectorAll(".queue-review").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".queue-item").remove();
      showToast("Marked reviewed locally");
    });
  });
}

function getWalletAssetLabel(wallet) {
  const network = NETWORKS[wallet?.network] || {};
  const asset = network.asset || wallet?.asset || "Asset";
  return `${network.label || "Wallet"} ${asset ? `(${asset})` : ""}`.trim();
}
function isSendCapableWallet(wallet) {
  const network = NETWORKS[wallet?.network];
  const kind = network?.kind || "";
  return Boolean(kind.startsWith("evm") || kind === "solana-token" || kind === "solana-native");
}
function renderAllocationPanel(wallet) {
  if (isReserveAssetWallet(wallet)) {
    const reserveAccountId = getReserveAccountIdForWallet(wallet);
    const asset = getWalletReserveAssetSymbol(wallet);
    const reserveAccount = reserveAccountId ? getVirtualAssetAccountById(reserveAccountId) : null;
    const accountValue = Number(reserveAccount?.currentValue || getUsdValue(wallet) || 0);
    return `
      <div class="allocation-summary wide-empty asset-reserve-wallet-summary">
        <strong>${escapeHtml(asset || NETWORKS[wallet.network]?.asset || "Asset")} automatically routed to Asset Reserve</strong>
        <span>Reserve asset addresses are view-only in Wallets. They appear in Asset Ratio & Legal Core Tracker and inside Asset Accounts.</span>
        <span class="status-pill live">${renderMoneyValue(accountValue, { compactAt: 1_000_000, label: "Reserve asset value" })}</span>
        <button class="primary-button open-wallet-reserve-account" data-open-wallet-reserve-account="${escapeHtml(reserveAccountId)}" type="button">Open Reserve Account</button>
      </div>
    `;
  }
  if (!wallet.allocation?.buckets?.length) {
    if (isDemoModeActive() && wallet.demoOnboarding && getWalletDisplayValue(wallet) <= 0.01) {
      return `
        <div class="allocation-summary wide-empty onboarding-demo-funds-panel">
          <strong>Demo wallet connected</strong>
          <span>The guide confirmed this owner wallet address. Add demo funds to test allocation from one wallet.</span>
          <button class="primary-button add-demo-funds" type="button">Add Demo Funds</button>
        </div>
      `;
    }
    return `
      <div class="allocation-summary wide-empty">
        <strong>No Virtual Budget Accounts yet</strong>
        <span>Use Auto Allocate in the wallet panel to split this balance into Virtual Budget Accounts.</span>
      </div>
    `;
  }

  const totals = getAllocationTotals(wallet);
  const pendingIncrease = getWalletAssignableAmount(wallet);
  const pendingSpend = Number(wallet.allocation.pendingSpend || 0);
  const overbalance = getWalletOverbalanceAmount(wallet);
  const awaitingFundsHtml = wallet.allocation?.awaitingFunds && totals.walletValue <= 0.01
    ? `
      <div class="pending-box balance-required onboarding-awaiting-funds">
        <div class="balance-required-head">
          <strong>Wallet ready, funds not detected yet</strong>
          <span>Add ${escapeHtml(NETWORKS[wallet.network]?.asset || "stablecoin")} to this Owner Wallet, then press Refresh. Your Virtual Budget Accounts keep their template percentages and stay at $0.00 until value arrives.</span>
        </div>
        <div class="balance-required-actions">
          <div><span>Current wallet balance</span><strong>${formatUsd(totals.walletValue)}</strong><button class="primary-button refresh-wallet-balance" type="button">Refresh</button></div>
        </div>
      </div>
    `
    : "";
  const pendingHtml = pendingIncrease > 0.01 || pendingSpend > 0.01 || overbalance > 0.01
    ? `
      <div class="pending-box balance-required">
        <div class="balance-required-head">
          <strong>Wallet needs balancing</strong>
          <span>Complete these tasks so the Virtual Budget Accounts match the real wallet activity.</span>
        </div>
        <div class="balance-required-actions">
          ${overbalance > 0.01 ? `<div><span>VBAs over wallet balance</span><strong>${formatUsd(overbalance)}</strong><button class="primary-button rebalance-wallet" type="button">Refresh VBAs</button></div>` : ""}
          ${pendingIncrease > 0.01 ? `<div><span>New funds detected</span><strong>${formatUsd(pendingIncrease)}</strong><button class="secondary-button allocate-pending" type="button">Allocate</button></div>` : ""}
          ${pendingSpend > 0.01 ? `<div><span>Unassigned spending</span><strong>${formatUsd(pendingSpend)}</strong><button class="secondary-button assign-pending" type="button">Assign</button></div>` : ""}
        </div>
      </div>
    `
    : "";

  const bucketRows = wallet.allocation.buckets.map((bucket) => {
    const allocated = Number(bucket.allocated || 0);
    const spent = Number(bucket.spent || 0);
    const balance = Math.max(allocated - spent, 0);
    const allocationPercent = Math.min(Math.max(Number(bucket.percent || 0), 0), 100);
    const allocationLabel = Number.isInteger(allocationPercent) ? allocationPercent.toFixed(0) : allocationPercent.toFixed(1);
    return `
      <div class="bucket-row wallet-vba-row">
        <div class="bucket-topline">
          <strong>${escapeHtml(bucket.name)}</strong>
          <span class="bucket-balance">${formatUsd(balance)}</span>
        </div>
        <div class="meter-row">
          <div class="meter-label"><span>Allocation share</span><strong>${allocationLabel}%</strong></div>
          <div class="bucket-meter"><span style="width:${allocationPercent}%"></span></div>
        </div>
        <div class="bucket-money">
          <small>Spent ${formatUsd(spent)} of ${formatUsd(allocated)}</small>
          <small>${escapeHtml(getWalletAssetLabel(wallet))}</small>
        </div>
        <div class="bucket-actions">
          <button class="secondary-button spend-bucket" data-bucket-id="${escapeHtml(bucket.id)}" type="button">Record spend</button>
          <button class="primary-button send-bucket" data-bucket-id="${escapeHtml(bucket.id)}" type="button">Send from budget account</button>
          <button class="ghost-button rules-bucket" data-bucket-id="${escapeHtml(bucket.id)}" type="button">Rules</button>
          ${isBillsBucket(bucket) ? `<button class="ghost-button bills-bucket" data-bucket-id="${escapeHtml(bucket.id)}" type="button">Bills</button>` : ""}
          <button class="danger-button remove-bucket" data-bucket-id="${escapeHtml(bucket.id)}" type="button" aria-label="Remove ${escapeHtml(bucket.name)}">Remove</button>
        </div>
        ${renderBucketRules(bucket)}
      </div>
    `;
  }).join("");

  return `
    <div class="bucket-panel-heading">
      <div>
        <strong>Virtual Budget Accounts</strong>
        <span>Available in budget accounts: ${formatUsd(totals.left)}</span>
      </div>
      <span class="status-pill live">${formatUsd(totals.walletValue)}</span>
    </div>
    ${awaitingFundsHtml}
    ${pendingHtml}
    <div class="bucket-list wallet-vba-scroll-list">${bucketRows}</div>
  `;
}

function renderAllocationRows(buckets) {
  return buckets.map((bucket, index) => `
    <div class="allocation-row">
      <label class="check-row bucket-include-choice">
        <input data-bucket-enabled="${index}" type="checkbox" ${Number(bucket.percent || 0) > 0 ? "checked" : ""} />
        <span>Use budget account</span>
      </label>
      <label>
        Budget account name
        <input data-bucket-name="${index}" data-subaccounts="${escapeHtml((bucket.subaccounts || []).map(getSubaccountName).join("|"))}" value="${escapeHtml(bucket.name)}" />
      </label>
      <label>
        Percent
        <input data-bucket-percent="${index}" type="number" min="0" max="100" step="0.1" value="${Number(bucket.percent || 0)}" />
      </label>
    </div>
  `).join("");
}

function combineAllocationTemplates(templateKeys) {
  const bucketMap = new Map();
  templateKeys.forEach((key) => {
    const template = BUCKET_TEMPLATES[key];
    if (!template) return;
    template.buckets.forEach((bucket) => {
      const normalized = bucket.name.toLowerCase();
      const existing = bucketMap.get(normalized);
      if (existing) {
        existing.weight += Number(bucket.percent || 0);
        existing.subaccounts = [...new Set([...(existing.subaccounts || []), ...(bucket.subaccounts || [])])];
      } else {
        bucketMap.set(normalized, {
          name: bucket.name,
          weight: Number(bucket.percent || 0),
          subaccounts: bucket.subaccounts || [],
        });
      }
    });
  });

  const buckets = [...bucketMap.values()];
  const totalWeight = buckets.reduce((sum, bucket) => sum + bucket.weight, 0) || buckets.length || 1;
  return buckets.map((bucket, index) => {
    const rawPercent = (bucket.weight / totalWeight) * 100;
    const percent = index === buckets.length - 1
      ? 0
      : Number(rawPercent.toFixed(1));
    return {
      name: bucket.name,
      percent,
      subaccounts: bucket.subaccounts,
      _rawPercent: rawPercent,
    };
  }).map((bucket, index, all) => {
    if (index !== all.length - 1) return bucket;
    const used = all.slice(0, -1).reduce((sum, item) => sum + item.percent, 0);
    return { ...bucket, percent: Number(Math.max(100 - used, 0).toFixed(1)) };
  });
}

function getBudgetTemplateEntries() {
  return Object.entries(BUCKET_TEMPLATES).sort(([leftKey], [rightKey]) => {
    const leftIndex = BUDGET_TEMPLATE_DISPLAY_ORDER.indexOf(leftKey);
    const rightIndex = BUDGET_TEMPLATE_DISPLAY_ORDER.indexOf(rightKey);
    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex);
  });
}

function getBudgetTemplateList() {
  return getBudgetTemplateEntries().map(([, template]) => template);
}

function getDefaultAssignmentTemplateKey(wallet = null) {
  return wallet?.allocation?.buckets?.length ? "__saved" : "essentials";
}

function getTemplatePercentTotal(templateOrBuckets) {
  const buckets = Array.isArray(templateOrBuckets) ? templateOrBuckets : templateOrBuckets?.buckets || [];
  return Number(buckets.reduce((sum, bucket) => sum + Number(bucket.percent || 0), 0).toFixed(2));
}

function validateBudgetTemplatePercentages(templateOrBuckets) {
  const total = getTemplatePercentTotal(templateOrBuckets);
  return {
    ok: Math.abs(total - 100) < 0.01,
    total,
  };
}

function canUsePremiumBudgetTemplate(template) {
  if (!template?.isPremium) return true;
  if (isAdminPowerEnabled() || isDemoModeActive()) return true;
  const entitlements = getCurrentEntitlements();
  return Boolean(entitlements.ai || entitlements.analytics || entitlements.business || entitlements.family);
}

function isBudgetTemplateLocked(template) {
  return Boolean(template?.isPremium && !canUsePremiumBudgetTemplate(template));
}

function getBudgetTemplateVisual(templateOrKey) {
  const key = typeof templateOrKey === "string" ? templateOrKey : templateOrKey?.id;
  const template = typeof templateOrKey === "string" ? BUCKET_TEMPLATES[key] : templateOrKey;
  return BUDGET_TEMPLATE_VISUALS[key] || {
    art: "custom-build.png",
    icon: template?.icon || "sliders",
    label: template?.category || "CUSTOM",
    tags: ["Preview first", "No funds move"],
    focus: template?.name || "Custom plan",
    bestFor: "Custom budgets",
    difficulty: "Custom",
  };
}

function getBudgetTemplateArtUrl(templateOrKey) {
  const visual = getBudgetTemplateVisual(templateOrKey);
  return `${BUDGET_TEMPLATE_ART_BASE}/${visual.art}?v=budget-art-clean-20260602`;
}

function getBudgetTemplateIconGlyph(icon = "") {
  const icons = {
    ai: "AI",
    bitcoin: "BTC",
    briefcase: "Biz",
    calendar: "Cal",
    camera: "Cam",
    chart: "%",
    crown: "Pro",
    diamond: "$",
    family: "Fam",
    game: "Play",
    plane: "Go",
    sliders: "%",
    spark: "*",
    stablecoin: "$",
    store: "Shop",
    target: "Goal",
    truck: "Truck",
    user: "Solo",
    vault: "Safe",
    wallet: "$",
  };
  return icons[icon] || "$";
}

function renderBudgetTemplatePicture(templateOrKey) {
  const visual = getBudgetTemplateVisual(templateOrKey);
  const templateId = typeof templateOrKey === "string" ? templateOrKey : templateOrKey?.id || "custom";
  return `
    <span class="budget-template-picture template-art-card template-art-${escapeHtml(templateId)}">
      <img src="${escapeHtml(getBudgetTemplateArtUrl(templateOrKey))}" alt="" decoding="async" />
      <span class="template-art-icon" aria-hidden="true">${escapeHtml(getBudgetTemplateIconGlyph(visual.icon))}</span>
    </span>
  `;
}

function renderBudgetTemplateBadges(template, locked = false) {
  const total = getTemplatePercentTotal(template);
  return `
    <span class="template-card-badge">${template.accountCount} accounts</span>
    <span class="template-card-badge ${Math.abs(total - 100) < 0.01 ? "valid" : "warn"}">${total}% plan</span>
    ${template.isAiTemplate ? `<span class="template-card-badge ai-template-badge">AI glow</span>` : ""}
    ${locked ? `<span class="template-card-badge premium-template-locked">Premium</span>` : template.isPremium ? `<span class="template-card-badge premium">Premium</span>` : ""}
  `;
}

function getBudgetTemplateDonutGradient(templateOrBuckets) {
  const buckets = Array.isArray(templateOrBuckets) ? templateOrBuckets : templateOrBuckets?.buckets || [];
  let cursor = 0;
  const segments = buckets.map((bucket) => {
    const percent = Math.max(Number(bucket.percent || 0), 0);
    const start = cursor;
    cursor += percent;
    return `${bucket.color || "#2F80FF"} ${start}% ${cursor}%`;
  }).filter(Boolean);
  return segments.length ? segments.join(", ") : "#2F80FF 0% 100%";
}

function renderBudgetTemplateDonut(templateOrBuckets, options = {}) {
  const buckets = Array.isArray(templateOrBuckets) ? templateOrBuckets : templateOrBuckets?.buckets || [];
  const template = Array.isArray(templateOrBuckets) ? null : templateOrBuckets;
  const visual = getBudgetTemplateVisual(template?.id || options.visualKey || "customBuild");
  const accountCount = options.accountCount || template?.accountCount || buckets.length || 0;
  return `
    <span class="template-allocation-donut" style="--donut-gradient:${escapeHtml(getBudgetTemplateDonutGradient(buckets))}">
      <span>
        <i>${escapeHtml(getBudgetTemplateIconGlyph(visual.icon))}</i>
        <b>${accountCount}</b>
        <small>${accountCount === 1 ? "Account" : "Accounts"}</small>
      </span>
    </span>
  `;
}

function renderBudgetTemplateBreakdown(templateOrBuckets) {
  const buckets = Array.isArray(templateOrBuckets) ? templateOrBuckets : templateOrBuckets?.buckets || [];
  return buckets.map((bucket) => `
    <span class="template-breakdown-row">
      <i style="--bucket-color:${escapeHtml(bucket.color || "#2F80FF")}"></i>
      <b>${escapeHtml(bucket.name)}</b>
      <strong>${Number(bucket.percent || 0)}%</strong>
    </span>
  `).join("");
}

function renderBudgetTemplateTags(templateOrKey) {
  const visual = getBudgetTemplateVisual(templateOrKey);
  return (visual.tags || []).slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
}

function renderBudgetTemplateCard(template, selectedKey, variant = "browse", options = {}) {
  const locked = !options.allowLockedTemplates && isBudgetTemplateLocked(template);
  const isSelected = selectedKey === template.id;
  const visual = getBudgetTemplateVisual(template);
  return `
    <label class="budget-template-card budget-template-row ${variant === "featured" ? "featured-template-card" : "browse-template-card"} ${isSelected ? "selected" : ""} ${locked ? "locked" : ""} ${template.isAiTemplate ? "ai-template" : ""}" data-template-select="${escapeHtml(template.id)}" data-template-locked="${locked ? "true" : "false"}">
      <input type="radio" name="assignmentTemplate" data-assignment-template value="${escapeHtml(template.id)}" ${isSelected ? "checked" : ""} ${locked ? "disabled" : ""} />
      ${renderBudgetTemplatePicture(template)}
      <span class="template-card-copy">
        <span class="template-card-meta">
          <b>${escapeHtml(template.name)}</b>
          <em>${escapeHtml(visual.label || template.category)}</em>
        </span>
        <small>${escapeHtml(template.description)}</small>
        <span class="template-card-badges">${renderBudgetTemplateBadges(template, locked)}</span>
        <span class="template-card-preview-pills">${renderBudgetTemplateTags(template)}</span>
      </span>
      <span class="template-card-donut-wrap">${renderBudgetTemplateDonut(template)}</span>
      <span class="template-card-breakdown">${renderBudgetTemplateBreakdown(template)}</span>
      <span class="template-card-check">${isSelected ? "&#10003;" : locked ? "Lock" : "&#8250;"}</span>
    </label>
  `;
}

function renderBudgetTemplateEmptyPreviewPanel() {
  return `
    <aside class="budget-template-preview-panel empty-template-preview">
      <div class="template-preview-heading">
        <span class="template-preview-eye" aria-hidden="true">${escapeHtml(getBudgetTemplateIconGlyph("sliders"))}</span>
        <span>
          <small>Selection Required</small>
          <strong>Choose a template</strong>
        </span>
      </div>
      <div class="template-preview-card">
        <span class="template-preview-title">
          <span class="template-preview-icon" aria-hidden="true">${escapeHtml(getBudgetTemplateIconGlyph("sliders"))}</span>
          <span>
            <b>No template selected</b>
            <em>Required step</em>
          </span>
        </span>
        <p>Select one budget template from the library before choosing Free or AllocaFi Core.</p>
        <div class="template-preview-stats">
          <span><small>Status</small><b>Waiting</b></span>
          <span><small>Next Step</small><b>Pick template</b></span>
        </div>
      </div>
    </aside>
  `;
}

function renderBudgetTemplatePreviewPanel(wallet, selectedKey) {
  const useSavedPlan = selectedKey === "__saved" && wallet?.allocation?.buckets?.length;
  const template = useSavedPlan ? null : BUCKET_TEMPLATES[selectedKey] || BUCKET_TEMPLATES.essentials;
  const buckets = useSavedPlan ? wallet.allocation.buckets : template.buckets;
  const accountCount = buckets.length;
  const total = getTemplatePercentTotal(buckets);
  const visualKey = useSavedPlan ? "__saved" : template.id;
  const visual = getBudgetTemplateVisual(visualKey);
  const title = useSavedPlan ? "Saved Custom Budget Accounts" : template.name;
  const category = useSavedPlan ? "SAVED" : (visual.label || template.category);
  const description = useSavedPlan
    ? "Use the Virtual Budget Account setup already saved to this wallet."
    : template.description;
  return `
    <aside class="budget-template-preview-panel">
      <div class="template-preview-heading">
        <span class="template-preview-eye" aria-hidden="true">${escapeHtml(getBudgetTemplateIconGlyph(visual.icon))}</span>
        <span>
          <small>Selected Preview</small>
          <strong>${escapeHtml(title)}</strong>
        </span>
      </div>
      <div class="template-preview-card">
        <span class="template-preview-title">
          <span class="template-preview-icon" aria-hidden="true">${escapeHtml(getBudgetTemplateIconGlyph(visual.icon))}</span>
          <span>
            <b>${escapeHtml(title)}</b>
            <em>${escapeHtml(category)}</em>
          </span>
        </span>
        <p>${escapeHtml(description)}</p>
        <div class="template-preview-donut">${renderBudgetTemplateDonut(buckets, { accountCount, visualKey })}</div>
        <div class="template-preview-stats">
          <span><small>Total Accounts</small><b>${accountCount}</b></span>
          <span><small>Allocation Plan</small><b>${total}%</b></span>
          <span><small>Primary Focus</small><b>${escapeHtml(visual.focus || "Budget plan")}</b></span>
          <span><small>Best For</small><b>${escapeHtml(visual.bestFor || "AllocaFi users")}</b></span>
          <span><small>Difficulty</small><b>${escapeHtml(visual.difficulty || "Beginner")}</b></span>
        </div>
        <div class="template-preview-breakdown">${renderBudgetTemplateBreakdown(buckets)}</div>
        <button class="primary-button template-preview-action" type="button" data-scroll-to-allocation-preview>Preview Template</button>
      </div>
    </aside>
  `;
}

function renderSavedBudgetPlanChoice(wallet, selectedKey) {
  if (!wallet?.allocation?.buckets?.length) return "";
  const isSelected = selectedKey === "__saved";
  const total = getTemplatePercentTotal(wallet.allocation.buckets);
  return `
    <label class="budget-template-card budget-template-row saved-template-card ${isSelected ? "selected" : ""}" data-template-select="__saved" data-template-locked="false">
      <input type="radio" name="assignmentTemplate" data-assignment-template value="__saved" ${isSelected ? "checked" : ""} />
      ${renderBudgetTemplatePicture("__saved")}
      <span class="template-card-copy">
        <span class="template-card-meta">
          <b>Saved Custom Budget Accounts</b>
          <em>Current wallet plan</em>
        </span>
        <small>Use the budget account setup already saved to this wallet.</small>
        <span class="template-card-badges">
          <span class="template-card-badge">${wallet.allocation.buckets.length} accounts</span>
          <span class="template-card-badge ${Math.abs(total - 100) < 0.01 ? "valid" : "warn"}">${total}% plan</span>
        </span>
        <span class="template-card-preview-pills">${renderBudgetTemplateTags("__saved")}</span>
      </span>
      <span class="template-card-donut-wrap">${renderBudgetTemplateDonut(wallet.allocation.buckets, { accountCount: wallet.allocation.buckets.length, visualKey: "__saved" })}</span>
      <span class="template-card-breakdown">${renderBudgetTemplateBreakdown(wallet.allocation.buckets)}</span>
      <span class="template-card-check">${isSelected ? "&#10003;" : "&#8250;"}</span>
    </label>
  `;
}

function renderBudgetTemplateChoices(wallet = null, options = {}) {
  const selectedKey = Object.prototype.hasOwnProperty.call(options, "selectedKey") ? options.selectedKey : getDefaultAssignmentTemplateKey(wallet);
  const requiresTemplateSelection = Boolean(options.requireTemplateSelection);
  const hasSelectedTemplate = Boolean(selectedKey && (selectedKey === "__saved" || BUCKET_TEMPLATES[selectedKey]));
  const activeCategory = options.activeCategory || "Professional";
  const search = String(options.search || "").trim().toLowerCase();
  const filteredTemplates = getBudgetTemplateList().filter((template) => {
    const haystack = `${template.name} ${template.category} ${template.description} ${template.buckets.map((bucket) => bucket.name).join(" ")}`.toLowerCase();
    const categoryMatch = activeCategory === "All Templates" || template.category === activeCategory;
    return categoryMatch && (!search || haystack.includes(search));
  });
  const browseCards = filteredTemplates.length
    ? filteredTemplates.map((template) => renderBudgetTemplateCard(template, selectedKey, "browse", { allowLockedTemplates: options.allowLockedTemplates })).join("")
    : `<div class="budget-template-empty">No templates found for this search.</div>`;
  const categoryTabs = ["All Templates", ...BUDGET_TEMPLATE_CATEGORIES].map((category) => `
    <button class="budget-template-tab ${category === activeCategory ? "active" : ""}" type="button" data-template-category="${escapeHtml(category)}">${escapeHtml(category)}</button>
  `).join("");

  const actionLabel = options.actionLabel || "Auto Allocate";
  return `
    <section class="budget-template-marketplace">
      <div class="budget-template-search-bar">
        <label class="budget-template-search">
          <span>Search templates</span>
          <input id="budgetTemplateSearch" type="search" placeholder="Search business, crypto, family..." value="${escapeHtml(options.search || "")}" />
        </label>
        <div class="budget-template-filter-chip">
          <span aria-hidden="true">&#9638;</span>
          <strong>${escapeHtml(activeCategory)}</strong>
        </div>
      </div>
      <div class="budget-template-category-tabs">${categoryTabs}</div>
      <div class="budget-template-marketplace-grid">
        <div class="budget-template-results">
          ${renderSavedBudgetPlanChoice(wallet, selectedKey)}
          <div class="budget-template-list">${browseCards}</div>
        </div>
        ${hasSelectedTemplate ? renderBudgetTemplatePreviewPanel(wallet, selectedKey) : renderBudgetTemplateEmptyPreviewPanel()}
      </div>
      <div class="budget-template-footer-actions budget-template-action-footer">
        <span class="budget-template-owner-wallet-summary">
          <i aria-hidden="true">${getWalletActionIcon("allocate")}</i>
          <span class="owner-wallet-copy">
            <strong>Owner Wallet</strong>
            <small>${escapeHtml(wallet?.name || "Owner Wallet")}${wallet?.address ? ` - ${escapeHtml(shortAddress(wallet.address))}` : ""}</small>
          </span>
          <span class="owner-wallet-stat">
            <b>Asset</b>
            <em>${escapeHtml(NETWORKS[wallet?.network]?.asset || wallet?.asset || "Asset")}</em>
          </span>
          <span class="owner-wallet-stat">
            <b>Total Value</b>
            <em>${renderMoneyValue(wallet ? getWalletDisplayValue(wallet) : 0, { compactAt: 10_000_000, label: "Owner wallet total value" })}</em>
          </span>
        </span>
        <button class="primary-button" type="button" data-auto-allocate-template ${requiresTemplateSelection && !hasSelectedTemplate ? "disabled aria-disabled=\"true\"" : ""}>${escapeHtml(requiresTemplateSelection && !hasSelectedTemplate ? "Select Template First" : actionLabel)}</button>
      </div>
    </section>
  `;
}

function getAssignmentTemplateBuckets(wallet, templateKey = "") {
  if (templateKey === "__saved" && wallet?.allocation?.buckets?.length) {
    return wallet.allocation.buckets.map((bucket) => ({ ...bucket }));
  }
  const template = BUCKET_TEMPLATES[templateKey] || BUCKET_TEMPLATES.essentials;
  return template.buckets.map((bucket) => ({ ...bucket }));
}

function createAllocationBucketsFromTemplate(templateBuckets, baseAmount = 0) {
  return templateBuckets.map((bucket) => ({
    id: bucket.id || crypto.randomUUID(),
    name: bucket.name,
    percent: Number(bucket.percent || 0),
    allocated: baseAmount * (Number(bucket.percent || 0) / 100),
    spent: Number(bucket.spent || 0),
    icon: bucket.icon || "",
    color: bucket.color || "",
    description: bucket.description || "",
    rules: bucket.rules || {},
    subaccounts: Array.isArray(bucket.subaccounts)
      ? bucket.subaccounts.map((item) => typeof item === "string"
        ? {
          id: crypto.randomUUID(),
          name: item,
          required: 0,
          allocated: 0,
          dueDay: 0,
          dueMonth: "monthly",
        }
        : { ...item, id: item.id || crypto.randomUUID() })
      : [],
  }));
}

function getAssignmentTemplateName(templateKey = "") {
  if (templateKey === "__saved") return "Saved Custom Budget Accounts";
  return BUCKET_TEMPLATES[templateKey]?.name || "Budget Template";
}

function renderMasterWalletCard(wallet, selectedWalletId) {
  const network = NETWORKS[wallet.network];
  const taskCount = getWalletBalanceTaskCount(wallet);
  const isReserveAsset = isReserveAssetWallet(wallet);
  const canSend = isSendCapableWallet(wallet) && !isReserveAsset;
  const status = getMasterWalletStatus(wallet);
  const walletValue = getWalletDisplayValue(wallet);
  const isActive = wallet.id === selectedWalletId;
  const walletType = `${network.asset} - ${network.label} wallet`;
  const reserveAccountId = isReserveAsset ? getReserveAccountIdForWallet(wallet) : "";
  const canInjectDemoFunds = isDemoModeActive() && wallet.demoOnboarding && walletValue <= 0.01 && !isReserveAsset;

  return `
    <article class="master-wallet-card ${isActive ? "active" : ""} ${taskCount ? "needs-balance" : ""}">
      <div class="master-wallet-header">
        <button class="wallet-sidebar-item ${isActive ? "active" : ""} ${taskCount ? "needs-balance" : ""}" data-wallet-id="${escapeHtml(wallet.id)}" type="button">
          <span class="master-wallet-title-stack">
            <strong>${escapeHtml(wallet.name)}</strong>
            <small>${escapeHtml(shortAddress(wallet.address))}</small>
            <span class="master-wallet-badges">
              <span class="master-wallet-chip">${escapeHtml(network.asset)}</span>
              <span class="master-wallet-chip chain">${escapeHtml(network.label)} wallet</span>
              <span class="master-wallet-status ${status.className}">
                <i></i>${escapeHtml(status.label)}
              </span>
            </span>
          </span>
          <span class="master-wallet-compact-balance">
            <small>${escapeHtml(walletType)}</small>
            <strong>${renderMoneyValue(walletValue, { compactAt: 1_000_000, label: `${wallet.name} wallet balance` })}</strong>
          </span>
        </button>
      </div>

      ${taskCount ? `<div class="attention-pill master-wallet-attention">${taskCount} balance ${taskCount === 1 ? "task" : "tasks"} needs review</div>` : ""}

      <div class="wallet-sidebar-actions ${isActive ? "active" : ""}" data-wallet-actions="${escapeHtml(wallet.id)}">
        <button class="primary-button master-wallet-action sidebar-send" data-wallet-id="${escapeHtml(wallet.id)}" type="button" ${canSend ? "" : "disabled"}>${getWalletActionIcon("send")}<span>Send</span></button>
        <button class="secondary-button master-wallet-action sidebar-receive" data-wallet-id="${escapeHtml(wallet.id)}" type="button">${getWalletActionIcon("receive")}<span>Receive</span></button>
        ${isReserveAsset
          ? `<button class="secondary-button master-wallet-action sidebar-reserve" data-wallet-id="${escapeHtml(wallet.id)}" data-asset-account-id="${escapeHtml(reserveAccountId)}" type="button">${getWalletActionIcon("layers")}<span>Reserve Account</span></button>`
          : `<button class="secondary-button master-wallet-action sidebar-allocate" data-wallet-id="${escapeHtml(wallet.id)}" type="button">${getWalletActionIcon("allocate")}<span>Auto Allocate</span></button>`}
        <button class="secondary-button master-wallet-action sidebar-refresh" data-wallet-id="${escapeHtml(wallet.id)}" type="button">${getWalletActionIcon("refresh")}<span>Refresh</span></button>
        ${canInjectDemoFunds ? `<button class="primary-button master-wallet-action sidebar-demo-funds" data-wallet-id="${escapeHtml(wallet.id)}" type="button">${getWalletActionIcon("receive")}<span>Add Demo Funds</span></button>` : ""}
        ${isReserveAsset ? "" : `<button class="secondary-button master-wallet-action sidebar-rebalance" data-wallet-id="${escapeHtml(wallet.id)}" type="button">${getWalletActionIcon("layers")}<span>Refresh VBAs</span></button>`}
        <button class="secondary-button master-wallet-action sidebar-scan" data-wallet-id="${escapeHtml(wallet.id)}" type="button">${getWalletActionIcon("scan")}<span>Scan Assets</span></button>
        <button class="ghost-button master-wallet-action sidebar-copy" data-wallet-id="${escapeHtml(wallet.id)}" type="button">${getWalletActionIcon("copy")}<span>Copy Address</span></button>
        <button class="danger-button master-wallet-action sidebar-remove" data-wallet-id="${escapeHtml(wallet.id)}" type="button">${getWalletActionIcon("remove")}<span>Remove Wallet</span></button>
      </div>
    </article>
  `;
}

function isEvmAddress(value) {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

function isBitcoinAddress(value) {
  return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,90}$/.test(value.trim());
}

function isSolanaAddress(value) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value.trim());
}

function cleanAddress(value) {
  return value.trim().replace(/\s+/g, "");
}

function getBucketIcon(name) {
  const normalized = name.toLowerCase();
  if (normalized.includes("food") || normalized.includes("groceries") || normalized.includes("eating")) return "Food";
  if (normalized.includes("gas") || normalized.includes("transport") || normalized.includes("car")) return "Auto";
  if (normalized.includes("bill") || normalized.includes("rent") || normalized.includes("mortgage") || normalized.includes("utilities")) return "Bills";
  if (normalized.includes("saving") || normalized.includes("emergency") || normalized.includes("reserve")) return "Safe";
  if (normalized.includes("invest")) return "Invest";
  if (normalized.includes("vacation") || normalized.includes("travel")) return "Travel";
  if (normalized.includes("child") || normalized.includes("education")) return "Child";
  if (normalized.includes("medical")) return "Health";
  if (normalized.includes("tax")) return "Tax";
  if (normalized.includes("personal") || normalized.includes("free") || normalized.includes("lifestyle")) return "Life";
  return "Budget";
}

function getSendSpendValue(wallet, amount) {
  const network = NETWORKS[wallet?.network];
  const numericAmount = Number(amount || 0);
  if (!network) return numericAmount;
  return ["evm-usdc", "evm-stablecoin", "solana-token"].includes(network.kind)
    ? numericAmount
    : numericAmount * (priceCache[network.priceId] || 0);
}

function validateSendAmountAgainstBalances(wallet, bucketId, amount) {
  const spendValue = getSendSpendValue(wallet, amount);
  const walletValue = Math.max(getWalletDisplayValue(wallet), 0);
  if (spendValue > walletValue + SEND_BALANCE_TOLERANCE) {
    throw new Error(`Amount exceeds this wallet's current balance of ${formatUsd(walletValue)}`);
  }
  if (!bucketId) return;

  const bucket = wallet.allocation?.buckets?.find((item) => item.id === bucketId);
  if (!bucket) throw new Error("This Virtual Budget Account was not found");
  const bucketBalance = getBucketBalance(bucket);
  const available = Math.min(bucketBalance, walletValue);
  if (spendValue > available + SEND_BALANCE_TOLERANCE) {
    throw new Error(`${bucket.name} only has ${formatUsd(available)} available. Send from the main wallet or move money first.`);
  }
}

function render() {
  const selectedNetwork = filterNetwork.value;
  const supportedWallets = getSupportedWallets();
  const unsupportedWallets = wallets.filter((wallet) => !isSupportedNetworkKey(wallet.network));
  const visibleWallets = supportedWallets.filter((wallet) => selectedNetwork === "all" || wallet.network === selectedNetwork);
  if (!supportedWallets.some((wallet) => wallet.id === selectedWalletId)) selectedWalletId = supportedWallets[0]?.id || "";
  const activeWallet = visibleWallets.find((wallet) => wallet.id === selectedWalletId) || visibleWallets[0] || null;
  if (activeWallet) selectedWalletId = activeWallet.id;
  walletList.innerHTML = "";
  const unsupportedRows = unsupportedWallets.map((wallet) => {
    const network = NETWORKS[wallet.network];
    return `
      <div class="wallet-sidebar-item unsupported-wallet">
        <strong>${escapeHtml(wallet.name)}</strong>
        <span>${network ? `${escapeHtml(network.label)} ${escapeHtml(network.asset)}` : "Unsupported asset"}</span>
        <span>Hidden from launch totals</span>
      </div>
    `;
  }).join("");
  walletSidebarList.innerHTML = supportedWallets.length ? `${supportedWallets.map((wallet) => renderMasterWalletCard(wallet, selectedWalletId)).join("")}${unsupportedRows}` : unsupportedRows || `
    <div class="wallet-sidebar-item master-wallet-empty">
      <strong>No wallets yet</strong>
      <span>Use the + button above to add a supported public address.</span>
    </div>
  `;
  walletSidebarList.querySelectorAll(".wallet-sidebar-item[data-wallet-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedWalletId = button.dataset.walletId;
      render();
    });
  });
  walletSidebarList.querySelectorAll(".sidebar-allocate").forEach((button) => button.addEventListener("click", () => openAssignMoneyDialog(button.dataset.walletId)));
  walletSidebarList.querySelectorAll(".sidebar-reserve").forEach((button) => button.addEventListener("click", () => openReserveAccountForWallet(button.dataset.walletId)));
  walletSidebarList.querySelectorAll(".sidebar-refresh").forEach((button) => button.addEventListener("click", () => refreshWallet(button.dataset.walletId)));
  walletSidebarList.querySelectorAll(".sidebar-rebalance").forEach((button) => button.addEventListener("click", () => refreshVirtualAccounts(button.dataset.walletId)));
  walletSidebarList.querySelectorAll(".sidebar-demo-funds").forEach((button) => button.addEventListener("click", () => injectOnboardingDemoFunds(button.dataset.walletId)));
  walletSidebarList.querySelectorAll(".sidebar-scan").forEach((button) => button.addEventListener("click", () => scanAssets(button.dataset.walletId)));
  walletSidebarList.querySelectorAll(".sidebar-copy").forEach((button) => {
    button.addEventListener("click", () => {
      const wallet = wallets.find((item) => item.id === button.dataset.walletId);
      if (wallet) copyAddress(wallet.address);
    });
  });
  walletSidebarList.querySelectorAll(".sidebar-remove").forEach((button) => button.addEventListener("click", () => confirmDeleteWallet(button.dataset.walletId)));
  walletSidebarList.querySelectorAll(".sidebar-receive").forEach((button) => button.addEventListener("click", () => openReceiveDialog(button.dataset.walletId)));
  walletSidebarList.querySelectorAll(".sidebar-send").forEach((button) => button.addEventListener("click", () => openSendDialog(button.dataset.walletId)));

  (activeWallet ? [activeWallet] : []).forEach((wallet) => {
    const card = template.content.firstElementChild.cloneNode(true);

    card.dataset.id = wallet.id;
    card.classList.add("bucket-only-card");
    card.querySelectorAll(".card-topline, .balance-row, .meter, .wallet-address, .wallet-note, .card-actions, .more-actions").forEach((node) => node.remove());
    const statusBanner = wallet.error || wallet.status
      ? `<div class="wallet-status-banner ${wallet.statusType === "error" ? "error" : wallet.statusType === "loading" ? "loading" : wallet.statusType === "warning" ? "warning" : ""}">
          <div>
            <strong>${escapeHtml(wallet.status || "Wallet status")}</strong>
            ${wallet.error ? `<span>${escapeHtml(wallet.error)}</span>` : ""}
          </div>
          <button class="status-dismiss" data-clear-wallet-status="${wallet.id}" aria-label="Dismiss wallet status" type="button">x</button>
        </div>`
      : "";
    card.querySelector(".allocation-panel").innerHTML = `${statusBanner}${renderAllocationPanel(wallet)}`;
    card.querySelectorAll(".spend-bucket").forEach((button) => {
      button.addEventListener("click", () => openSpendDialog(wallet.id, button.dataset.bucketId));
    });    card.querySelectorAll(".send-bucket").forEach((button) => {
      button.hidden = !isSendCapableWallet(wallet) || !canSendFromVirtualBucketAccounts();
      button.addEventListener("click", () => openSendDialog(wallet.id, button.dataset.bucketId));
    });
    card.querySelectorAll(".rules-bucket").forEach((button) => {
      button.addEventListener("click", () => openBucketRulesDialog(wallet.id, button.dataset.bucketId));
    });
    card.querySelectorAll(".bills-bucket").forEach((button) => {
      button.addEventListener("click", () => openBillsPlannerDialog(wallet.id, button.dataset.bucketId));
    });
    card.querySelectorAll(".remove-bucket").forEach((button) => {
      button.addEventListener("click", () => removeBucketWithReallocation(wallet.id, button.dataset.bucketId));
    });
    card.querySelector(".allocate-pending")?.addEventListener("click", () => allocatePendingFunds(wallet.id));
    card.querySelector(".assign-pending")?.addEventListener("click", () => openSpendDialog(wallet.id, null, true));
    card.querySelector(".rebalance-wallet")?.addEventListener("click", () => refreshVirtualAccounts(wallet.id));
    card.querySelector(".refresh-wallet-balance")?.addEventListener("click", () => refreshWallet(wallet.id));
    card.querySelector(".add-demo-funds")?.addEventListener("click", () => injectOnboardingDemoFunds(wallet.id));
    card.querySelector("[data-open-wallet-reserve-account]")?.addEventListener("click", () => openReserveAccountForWallet(wallet.id));
    card.querySelector("[data-clear-wallet-status]")?.addEventListener("click", () => clearWalletStatus(wallet.id));
    walletList.append(card);
  });
  const unifiedSummary = getUnifiedSummary();
  totalBalance.textContent = formatUsd(unifiedSummary.netWorth);
  lastUpdated.textContent = `Total Connected Wallet Addresses: ${unifiedSummary.connectedWallets}`;
  walletCount.textContent = `${supportedWallets.length} supported wallet${supportedWallets.length === 1 ? "" : "s"} saved${unsupportedWallets.length ? ` ï¿½ ${unsupportedWallets.length} hidden` : ""}`;
  renderDashboard();
  renderGoals();
  renderTransactionLog();
  renderAddressBook();
  renderBucketAccounts();
  renderFundingQueue();
  renderVaultDashboard();
  renderUnifiedFinance();
  renderConnectAccounts();
  renderBankAccounts();
  renderMonthlyBudgetPage();
  renderAiInsightsPage();
  renderFamilyDashboard();
  renderBusinessDashboard();
  renderAllocaFiPay();
  renderAllocaFiLedgerCore();
  renderAllocaFiConnect();
  renderRewardsDashboard();
  renderAdminDashboard();
  renderAccountCloudPanel();
  renderSubscriptionPaymentsSystem();
  applyAdminDisplayControls();
  updateDemoModeControls();
  updateWalletConnectionUi();
}

function updateWalletConnectionUi() {
  const activeAccount = connectedAccount || connectedSolanaAccount;
  const short = activeAccount ? shortAddress(activeAccount) : "";
  const activeLabel = connectedAccount ? connectedWalletLabel : connectedSolanaWalletLabel;
  if (connectWalletButton) {
    const label = connectWalletButton.querySelector(".control-label");
    if (label) {
      label.textContent = "Add Wallet Address";
    } else {
      connectWalletButton.textContent = "Add Wallet Address";
    }
  }
  if (walletConnectionStatus) {
    walletConnectionStatus.textContent = activeAccount ? `${activeLabel || "Wallet"} connected ${short}` : "Not connected";
  }
  if (walletConnectProjectInput && !walletConnectProjectInput.value) {
    walletConnectProjectInput.value = loadWalletConnectProjectId();
  }
  if (solanaRpcUrlInput) {
    const savedRpc = loadSolanaRpcUrl();
    if (!solanaRpcUrlInput.value) {
      solanaRpcUrlInput.value = savedRpc;
    } else if (solanaRpcUrlInput.value.includes("*") || solanaRpcUrlInput.value.includes("...")) {
      solanaRpcUrlInput.value = "";
    }
    solanaRpcUrlInput.placeholder = !savedRpc && serverSolanaRpcConfigured
      ? "Using server RPC" + (serverSolanaRpcHost ? " (" + serverSolanaRpcHost + ")" : "")
      : "https://mainnet.helius-rpc.com/?api-key=...";
  }
}

function renderBucketRules(bucket) {
  const rules = bucket.rules || {};
  const activeRules = [];
  if (Number(rules.minimum || 0) > 0) activeRules.push(`Min ${formatUsd(rules.minimum)}`);
  if (Number(rules.warning || 0) > 0) activeRules.push(`Warn ${formatUsd(rules.warning)}`);
  if (Number(rules.refill || 0) > 0) activeRules.push(`Refill ${formatUsd(rules.refill)}`);
  if (rules.protected) activeRules.push("Protected");
  if (rules.reset && rules.reset !== "never") activeRules.push(`Reset ${rules.reset}`);
  if (!activeRules.length) return "";
  return `<div class="rule-list">${activeRules.map((rule) => `<span class="rule-pill">${escapeHtml(rule)}</span>`).join("")}</div>`;
}

function openDialog(html) {
  dialogContent.innerHTML = html;
  if (walletDialog.open) return;
  if (typeof walletDialog.showModal === "function") {
    walletDialog.showModal();
  } else {
    walletDialog.setAttribute("open", "");
  }
}

function openReceiveDialog(id) {
  const wallet = wallets.find((item) => item.id === id);
  if (!wallet) return;
  const network = NETWORKS[wallet.network];
  const qrData = encodeURIComponent(wallet.address);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qrData}`;

  openDialog(`
    <div class="dialog-content">
      <h2>Receive ${escapeHtml(network.asset)}</h2>
      <p class="wallet-note">${escapeHtml(network.label)} network</p>
      <div class="qr-box">
        <img alt="Receive address QR code" src="${qrUrl}" />
        <p class="qr-fallback">If the QR does not load, use the copy button below.</p>
      </div>
      <div class="address-box">${escapeHtml(wallet.address)}</div>
      <div class="dialog-actions">
        <button class="primary-button" type="button" data-copy-dialog="${escapeHtml(wallet.address)}">Copy address</button>
        <a class="ghost-link" target="_blank" rel="noreferrer" href="${network.explorer}${wallet.address}">Explorer</a>
      </div>
      <p class="form-note">Only send ${escapeHtml(network.asset)} on ${escapeHtml(network.label)} to this address.</p>
    </div>
  `);

  dialogContent.querySelector("[data-copy-dialog]").addEventListener("click", () => copyAddress(wallet.address));
}

function openSendDialog(id, bucketId = null, options = {}) {
  const wallet = wallets.find((item) => item.id === id);
  if (!wallet) return;
  if (bucketId && !canSendFromVirtualBucketAccounts()) {
    showToast("Premium unlocks sends from Virtual Budget Accounts");
    openSubscriptionCheckout("premium");
    return;
  }
  const network = NETWORKS[wallet.network];
  const bucket = wallet.allocation?.buckets?.find((item) => item.id === bucketId);
  const savedRecipients = addressBook.filter((entry) => isAddressBookNetworkCompatible(entry.network, wallet.network));
  const isSolanaSend = network.kind === "solana-token";
  const recipientPlaceholder = isSolanaSend ? "Solana wallet address" : "0x...";
  const sendButtonLabel = `Send with ${isSolanaSend ? "Solana wallet" : "wallet"}`;
  const sendLimit = bucket ? Math.min(getBucketBalance(bucket), getWalletDisplayValue(wallet)) : getWalletDisplayValue(wallet);
  const sendOptions = options && typeof options === "object" ? options : {};
  const billName = String(sendOptions.billName || "").trim();
  const requestedAmount = Math.max(Number(sendOptions.amount || 0), 0);
  const prefilledAmount = requestedAmount > 0 ? Math.min(requestedAmount, Math.max(sendLimit, 0)) : 0;
  const prefilledAmountValue = prefilledAmount > 0 ? String(Number(prefilledAmount.toFixed(8))) : "";
  const sendNote = billName
    ? `Pay ${escapeHtml(billName)} from ${bucket ? escapeHtml(bucket.name) : "this wallet"}. Your connected wallet must approve and sign before funds move.`
    : bucket
      ? `This send is capped by ${escapeHtml(bucket.name)}'s Virtual Budget Account balance.`
      : "Main wallet send. AllocaFi will rebalance Virtual Budget Accounts after the wallet balance changes.";

  openDialog(`
    <div class="dialog-content">
      <h2>Send ${escapeHtml(network.asset)}</h2>
      <p class="wallet-note">${sendNote}</p>
      <div class="send-limit-banner">
        <span>${bucket ? `${escapeHtml(bucket.name)} available` : "Wallet available"}</span>
        <strong>${formatUsd(Math.max(sendLimit, 0))}</strong>
      </div>
      <div class="send-grid">
        <label>
          Saved destination
          <select id="savedRecipient">
            <option value="">${savedRecipients.length ? "Choose saved destination" : "No saved destinations for this asset yet"}</option>
            ${savedRecipients.map((entry) => `<option value="${entry.id}">${escapeHtml(entry.name)} ï¿½ ${escapeHtml(getAddressBookNetworkLabel(entry, wallet.network))}</option>`).join("")}
          </select>
        </label>
        <label>
          From
          <div class="address-box">${escapeHtml(wallet.address)}</div>
        </label>
        <label>
          Recipient address
          <input id="sendRecipient" spellcheck="false" placeholder="${escapeHtml(recipientPlaceholder)}" />
        </label>
        <label>
          Save destination as
          <input id="sendRecipientName" maxlength="40" placeholder="Venmo, rent, gas card..." />
        </label>
        <label>
          Amount
          <input id="sendAmount" type="number" min="0" max="${Math.max(sendLimit, 0)}" step="0.00000001" value="${prefilledAmountValue}" placeholder="0.01" />
        </label>
      </div>
      <div class="dialog-actions">
        <button class="primary-button" type="button" id="sendTransaction">${sendButtonLabel}</button>
        <button class="secondary-button" type="button" id="manageRecipients">Manage destinations</button>
      </div>
      <div id="sendStatus" class="send-status">Ready. Your wallet will open for approval after the transaction is prepared.</div>
      <p class="form-note">Save frequent destinations like Venmo, rent, or family. This app never stores private keys.</p>
    </div>
  `);

  if (billName) {
    setSendStatus(`${billName} loaded. Add or confirm the recipient, then approve the transaction in your wallet.`, "loading");
  }

  dialogContent.querySelector("#savedRecipient").addEventListener("change", () => {
    const entry = addressBook.find((item) => item.id === dialogContent.querySelector("#savedRecipient").value);
    if (!entry) return;
    dialogContent.querySelector("#sendRecipient").value = entry.address;
    dialogContent.querySelector("#sendRecipientName").value = entry.name;
    setSendStatus(`${entry.name} loaded. Review the address and amount, then send.`, "loading");
    if (entry.bucketId && !bucketId) showToast(`Suggested budget account: ${entry.bucketName}`);
  });
  dialogContent.querySelector("#sendRecipient").addEventListener("change", () => {
    const entry = findAddressBookEntry(cleanAddress(dialogContent.querySelector("#sendRecipient").value), wallet.network);
    if (!entry) return;
    dialogContent.querySelector("#sendRecipientName").value = entry.name;
    showToast(entry.bucketName ? `Suggested budget account: ${entry.bucketName}` : `Recognized ${entry.name}`);
  });
  dialogContent.querySelector("#sendTransaction").addEventListener("click", () => {
    if (isSolanaSend) {
      sendSolanaTokenTransaction(wallet.id, bucketId, sendButtonLabel);
      return;
    }
    sendNativeTransaction(wallet.id, bucketId, sendButtonLabel);
  });
  dialogContent.querySelector("#manageRecipients").addEventListener("click", () => openAddressBookDialog(null, { network: wallet.network }));
}

function openWalletConnectDialog() {
  const availability = getWalletAvailability();
  const options = [
    { id: "phantom", title: "Phantom", helper: "Solana PYUSD and Solana USDC", available: availability.phantom, action: () => getSolanaProvider("phantom") },
    { id: "metamask", title: "MetaMask", helper: "Ethereum USDC, USDT, USDS, and FDUSD", available: availability.metamask, action: () => connectWalletProvider("metamask") },
    { id: "coinbase", title: "Coinbase Wallet", helper: "Ethereum stablecoins", available: availability.coinbase, action: () => connectWalletProvider("coinbase") },
    { id: "trust", title: "Trust Wallet", helper: "Browser extension when installed", available: availability.trust, action: () => connectWalletProvider("trust") },
    { id: "walletconnect-solana", title: "WalletConnect / Reown Solana", helper: "Mobile Solana wallets where supported", available: availability.walletConnect, action: () => getSolanaProvider("walletconnect") },
    { id: "walletconnect-evm", title: "WalletConnect / Reown Ethereum", helper: "Mobile Ethereum wallets", available: availability.walletConnect, action: () => connectWalletProvider("walletconnect") },
  ];

  openDialog(`
    <div class="dialog-content">
      <h2>Connect Wallet</h2>
      <p class="wallet-note">Choose the wallet you want to approve sends with. AllocaFi is currently focused on Solana PYUSD/USDC, Ethereum USDC/USDT/USDS/FDUSD, and Bitcoin tracking.</p>
      <div class="wallet-provider-grid">
        ${options.map((option) => `
          <button class="wallet-provider-card ${option.available ? "" : "disabled"}" data-wallet-provider="${option.id}" type="button">
            <strong>${escapeHtml(option.title)}</strong>
            <span>${escapeHtml(option.helper)}</span>
            <small>${option.available ? "Available" : option.id.includes("walletconnect") ? "Needs Project ID" : "Not detected"}</small>
          </button>
        `).join("")}
      </div>
      <div class="overview-card">
        <div class="overview-card-head"><span>Supported now</span><strong>Focused test list</strong></div>
        <p class="wallet-note">Sends require wallet approval. Bitcoin is view-only for now. No private keys or seed phrases are stored.</p>
      </div>
      <p class="form-note">AllocaFi never stores private keys or seed phrases. The wallet signs transactions outside the app.</p>
    </div>
  `);

  dialogContent.querySelectorAll("[data-wallet-provider]").forEach((button) => {
    button.addEventListener("click", async () => {
      const option = options.find((item) => item.id === button.dataset.walletProvider);
      if (!option) return;
      try {
        button.disabled = true;
        button.querySelector("small").textContent = "Connecting...";
        await option.action();
        walletDialog.close();
      } catch (error) {
        button.disabled = false;
        button.querySelector("small").textContent = option.available ? "Try again" : "Not ready";
        showToast(normalizeWalletError(error, "Wallet connection failed"));
      }
    });
  });
}

function openAllocationDialog(id) {
  const wallet = wallets.find((item) => item.id === id);
  if (!wallet) return;
  const existing = wallet.allocation?.buckets?.length ? wallet.allocation.buckets : DEFAULT_BUCKETS;
  const walletValue = getWalletDisplayValue(wallet);
  const savedMode = wallet.allocation?.autoMode || "rules";
  const templateOptions = Object.entries(BUCKET_TEMPLATES).filter(([key]) => key !== "customBuild").map(([key, template]) => {
    const locked = isBudgetTemplateLocked(template);
    return `
    <label class="template-choice budget-template-mini-choice ${locked ? "locked" : ""} ${template.isAiTemplate ? "ai-template" : ""}">
      <input type="checkbox" data-template-choice value="${key}" ${locked ? "disabled" : ""} />
      ${renderBudgetTemplatePicture(key)}
      <span class="template-choice-copy">
        <b>${escapeHtml(template.name)}</b>
        <small>${escapeHtml(template.category || "Template")} - ${template.accountCount} accounts - ${getTemplatePercentTotal(template)}% plan${locked ? " - Premium locked" : template.isAiTemplate ? " - AI assisted" : ""}</small>
      </span>
      <span class="template-choice-state">${locked ? "Lock" : template.isAiTemplate ? "AI" : "+"}</span>
    </label>
  `;
  }).join("");

  const rows = renderAllocationRows(existing);

  openDialog(`
    <div class="dialog-content">
      <h2>Customize Budget Accounts</h2>
      <p class="wallet-note">Choose the Virtual Budget Accounts and percentages you want for ${escapeHtml(wallet.name)}. Current value: ${formatUsd(walletValue)}.</p>
      <div class="template-picker">
        <strong>Budget templates</strong>
        <p class="form-note">Choose one or more templates, then keep only the budget accounts you want and adjust the percentages.</p>
        <div class="template-choice-grid budget-template-mini-grid">${templateOptions}</div>
        <button class="secondary-button" type="button" id="loadAllocationTemplate">Apply selected templates</button>
      </div>
      <div class="template-picker allocation-method-picker">
        <strong>Auto allocation method</strong>
        <div class="template-choice-grid allocation-method-grid">
          <label class="template-choice">
            <input type="radio" name="customAllocationMode" value="rules" ${savedMode !== "ai" ? "checked" : ""} />
            <span><b>Rules-based</b><small>Use percentages, bill targets, refill levels, warnings, and protected budget account settings.</small></span>
          </label>
          <label class="template-choice">
            <input type="radio" name="customAllocationMode" value="ai" ${savedMode === "ai" ? "checked" : ""} />
            <span><b>AI-assisted</b><small>Use local budget insights with the same saved rules before applying an auto allocation.</small></span>
          </label>
        </div>
      </div>
      <div class="allocation-grid">${rows}</div>
      <div class="rule-list">
        <div class="rule-pill">After saving, Auto Allocate uses this customized budget account plan instead of the starter defaults.</div>
      </div>
      <div class="dialog-actions">
        <button class="primary-button" type="button" id="saveAllocation">Save Custom Auto Allocation</button>
        <button class="ghost-button" type="button" id="resetAllocation">Use defaults</button>
      </div>
      <p class="form-note">Percentages should add up to 100%. These budget accounts are app-side tracking only and do not move funds on-chain.</p>
    </div>
  `);

  dialogContent.querySelector("#saveAllocation").addEventListener("click", () => saveAllocation(wallet.id));
  dialogContent.querySelector("#loadAllocationTemplate").addEventListener("click", () => {
    const selectedTemplates = [...dialogContent.querySelectorAll("[data-template-choice]:checked")]
      .map((input) => input.value);
    if (!selectedTemplates.length) {
      showToast("Choose at least one template");
      return;
    }
    const combined = combineAllocationTemplates(selectedTemplates);
    dialogContent.querySelector(".allocation-grid").innerHTML = renderAllocationRows(combined);
    showToast(`${selectedTemplates.length} template${selectedTemplates.length > 1 ? "s" : ""} loaded`);
  });
  dialogContent.querySelector("#resetAllocation").addEventListener("click", () => {
    wallet.allocation = {
      cycle: "weekly",
      buckets: DEFAULT_BUCKETS.map((bucket) => ({
        id: crypto.randomUUID(),
        name: bucket.name,
        percent: bucket.percent,
        allocated: walletValue * (bucket.percent / 100),
        spent: 0,
      })),
      transactions: wallet.allocation?.transactions || [],
      pendingIncrease: 0,
      pendingSpend: 0,
      lastValue: walletValue,
      updatedAt: new Date().toISOString(),
      autoMode: "rules",
    };
    saveWallets();
    render();
    walletDialog.close();
    showToast("Default allocation saved");
  });
}

function openAssignMoneyDialogLegacy() {
  const supportedWallets = getBudgetWallets();
  if (!supportedWallets.length) {
    showToast("Add a wallet first");
    switchTab("wallets");
    return;
  }

  const walletOptions = supportedWallets.map((wallet) => {
    const value = getWalletDisplayValue(wallet);
    return `<option value="${wallet.id}">${escapeHtml(wallet.name)} Â· ${formatUsd(value)}</option>`;
  }).join("");
  const firstWallet = supportedWallets[0];

  openDialog(`
    <div class="dialog-content">
      <h2>Choose Budget Template</h2>
      <p class="wallet-note">Pick a template or saved custom budget account plan first, then Auto Allocate into Virtual Budget Accounts.</p>
      <div class="template-picker auto-allocate-template-picker">
        <strong>Budget template</strong>
        <p class="form-note">Choose the budget account plan before reviewing the wallet amount. Use Customize Budget Accounts for exact budget account choices and percentages.</p>
        <div id="assignmentTemplateChoices" class="template-choice-grid">${renderBudgetTemplateChoices(firstWallet)}</div>
      </div>
      <div class="send-grid">
        <label>
          Wallet
          <select id="assignWallet">${walletOptions}</select>
        </label>
        <label>
          Amount to auto allocate
          <input id="assignAmount" type="number" min="0" step="0.01" placeholder="100.00" />
        </label>
      </div>
      <div class="template-picker allocation-method-picker">
        <strong>Auto allocation method</strong>
        <div class="template-choice-grid allocation-method-grid">
          <label class="template-choice">
            <input type="radio" name="assignmentMode" value="rules" ${(firstWallet.allocation?.autoMode || "rules") !== "ai" ? "checked" : ""} />
            <span><b>Rules-based</b><small>Use saved percentages, bill targets, refill rules, and warning levels.</small></span>
          </label>
          <label class="template-choice">
            <input type="radio" name="assignmentMode" value="ai" ${firstWallet.allocation?.autoMode === "ai" ? "checked" : ""} />
            <span><b>AI-assisted</b><small>Use local budget insights with the same rule guardrails.</small></span>
          </label>
        </div>
      </div>
      <div id="assignPreview" class="allocation-summary"></div>
      <div class="dialog-actions">
        <button class="primary-button" id="saveAssignedMoney" type="button">Auto Allocate</button>
        <button class="ghost-button" id="editAssignmentPlan" type="button">Customize Budget Accounts</button>
      </div>
      <p class="form-note">This is a virtual allocation only. Funds remain in your wallet.</p>
    </div>
  `);

  const walletSelect = dialogContent.querySelector("#assignWallet");
  const amountInput = dialogContent.querySelector("#assignAmount");
  const templateChoices = dialogContent.querySelector("#assignmentTemplateChoices");
  const updatePreview = () => renderAssignPreview(walletSelect.value, Number(amountInput.value || 0));
  walletSelect.addEventListener("change", () => {
    const wallet = wallets.find((item) => item.id === walletSelect.value);
    amountInput.value = getWalletAssignableAmount(wallet).toFixed(2);
    templateChoices.innerHTML = renderBudgetTemplateChoices(wallet);
    dialogContent.querySelectorAll("[name='assignmentMode']").forEach((input) => {
      input.checked = input.value === (wallet?.allocation?.autoMode || "rules");
    });
    templateChoices.querySelectorAll("[data-assignment-template]").forEach((input) => {
      input.addEventListener("change", updatePreview);
    });
    updatePreview();
  });
  amountInput.addEventListener("input", updatePreview);
  templateChoices.querySelectorAll("[data-assignment-template]").forEach((input) => {
    input.addEventListener("change", updatePreview);
  });
  amountInput.value = getWalletAssignableAmount(firstWallet).toFixed(2);
  updatePreview();

  dialogContent.querySelector("#saveAssignedMoney").addEventListener("click", saveAssignedMoney);
  dialogContent.querySelector("#editAssignmentPlan").addEventListener("click", () => openAllocationDialog(walletSelect.value));
}

function openAssignMoneyDialog(preferredWalletId = "") {
  const supportedWallets = getBudgetWallets();
  if (!supportedWallets.length) {
    showToast("Add a wallet first");
    switchTab("wallets");
    return;
  }

  const preferredId = typeof preferredWalletId === "string" ? preferredWalletId : "";
  const preferredWallet = supportedWallets.find((wallet) => wallet.id === preferredId);
  const firstWallet = preferredWallet || supportedWallets.find((wallet) => /owner/i.test(`${wallet.name || ""} ${wallet.role || ""} ${wallet.type || ""}`)) || supportedWallets[0];
  let selectedTemplateKey = getDefaultAssignmentTemplateKey(firstWallet);
  let activeTemplateCategory = "Professional";
  let templateSearch = "";

  openDialog(`
    <div class="dialog-content budget-template-library-modal">
      <section class="budget-template-hero-card">
        <span class="budget-template-hero-icon" aria-hidden="true"><i></i></span>
        <span>
          <h2>Budget Template Library</h2>
          <p>Choose a budget account plan before reviewing the wallet amount. Use Customize Budget Accounts for exact budget account choices and percentages.</p>
        </span>
        <span class="budget-template-hero-art" aria-hidden="true"><i></i><i></i><i></i></span>
      </section>

      <div id="assignmentTemplateChoices" class="budget-template-library-scroll" data-wallet-id="${escapeHtml(firstWallet.id)}">
        ${renderBudgetTemplateChoices(firstWallet, { selectedKey: selectedTemplateKey, activeCategory: activeTemplateCategory, search: templateSearch })}
      </div>
    </div>
  `);

  const templateChoices = dialogContent.querySelector("#assignmentTemplateChoices");
  const getAssignmentWallet = () => wallets.find((item) => item.id === templateChoices.dataset.walletId) || firstWallet;
  const renderTemplateLibrary = () => {
    const wallet = getAssignmentWallet();
    templateChoices.innerHTML = renderBudgetTemplateChoices(wallet, {
      selectedKey: selectedTemplateKey,
      activeCategory: activeTemplateCategory,
      search: templateSearch,
    });
  };

  templateChoices.addEventListener("click", (event) => {
    const autoAllocateButton = event.target.closest("[data-auto-allocate-template]");
    if (autoAllocateButton) {
      saveAssignedMoney();
      return;
    }

    const customButton = event.target.closest("[data-open-custom-template]");
    if (customButton) {
      openAllocationDialog(getAssignmentWallet().id);
      return;
    }

    const categoryButton = event.target.closest("[data-template-category]");
    if (categoryButton) {
      activeTemplateCategory = categoryButton.dataset.templateCategory || "Professional";
      renderTemplateLibrary();
      return;
    }

    const card = event.target.closest("[data-template-select]");
    if (!card) return;
    const nextTemplateKey = card.dataset.templateSelect || "essentials";
    const template = BUCKET_TEMPLATES[nextTemplateKey];
    if (template && isBudgetTemplateLocked(template)) {
      showToast("Upgrade to Premium to use that budget template");
      openSubscriptionCheckout("premium");
      return;
    }
    selectedTemplateKey = nextTemplateKey;
    renderTemplateLibrary();
  });

  templateChoices.addEventListener("input", (event) => {
    if (!event.target.matches("#budgetTemplateSearch")) return;
    templateSearch = event.target.value;
    renderTemplateLibrary();
    const searchInput = templateChoices.querySelector("#budgetTemplateSearch");
    searchInput?.focus();
  });
}
function renderAssignPreviewLegacy(walletId, amount) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet) return;
  const templateKey = dialogContent.querySelector("[data-assignment-template]:checked")?.value || (wallet.allocation?.buckets?.length ? "__saved" : "essentials");
  const buckets = getAssignmentTemplateBuckets(wallet, templateKey);
  const rows = buckets.map((bucket) => {
    const percent = Number(bucket.percent || 0);
    return `<span>${escapeHtml(bucket.name)} ï¿½ ${percent}%${amount > 0 ? ` ï¿½ ${formatUsd(amount * (percent / 100))}` : ""}</span>`;
  }).join("");
  const templateName = getAssignmentTemplateName(templateKey);
  dialogContent.querySelector("#assignPreview").innerHTML = `
    <strong>${escapeHtml(templateName)} auto allocation</strong>
    ${rows || "<span>No budget account plan yet.</span>"}
  `;
}

function renderAssignPreview(walletId, amount) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet) return;
  const templateKey = dialogContent.querySelector("[data-assignment-template]:checked")?.value || getDefaultAssignmentTemplateKey(wallet);
  const buckets = getAssignmentTemplateBuckets(wallet, templateKey);
  const validation = validateBudgetTemplatePercentages(buckets);
  const rows = buckets.map((bucket) => {
    const percent = Number(bucket.percent || 0);
    return `
      <span class="assign-preview-row">
        <i style="--bucket-color:${escapeHtml(bucket.color || "#20f0d0")}"></i>
        <b>${escapeHtml(bucket.name)}</b>
        <em>${percent}%</em>
        <strong>${amount > 0 ? formatUsd(amount * (percent / 100)) : formatUsd(0)}</strong>
      </span>
    `;
  }).join("");
  const templateName = getAssignmentTemplateName(templateKey);
  const selectedTemplate = BUCKET_TEMPLATES[templateKey];
  const customNote = templateKey === "customBuild"
    ? `<p class="assign-preview-note">Custom Build opens the exact account builder before any plan is saved.</p>`
    : "";
  const premiumNote = selectedTemplate?.isPremium
    ? `<span class="assign-preview-chip">Premium template</span>`
    : "";
  const statusLabel = validation.ok ? "Template total verified at 100%." : `Template needs review: ${validation.total}% total.`;
  dialogContent.querySelector("#assignPreview").innerHTML = `
    <div class="assign-preview-head">
      <span>
        <strong>${escapeHtml(templateName)} preview</strong>
        <small>${escapeHtml(statusLabel)}</small>
      </span>
      ${premiumNote}
    </div>
    <div class="assign-preview-list">${rows || "<span>No budget account plan yet.</span>"}</div>
    ${customNote}
  `;
}

function getRebalancedBucketPlanWithNewBucket(wallet, bucketName, requestedPercent) {
  const walletValue = getWalletDisplayValue(wallet);
  const currentBuckets = (wallet.allocation?.buckets || []).map((bucket) => ({ ...bucket }));
  const hasCurrentBuckets = currentBuckets.length > 0;
  const newPercent = hasCurrentBuckets
    ? Math.min(Math.max(Number(requestedPercent || 10), 1), 99)
    : 100;
  const remainingPercent = Math.max(100 - newPercent, 0);
  const rawWeightTotal = currentBuckets.reduce((sum, bucket) => sum + Math.max(Number(bucket.percent || 0), 0), 0);
  const weightTotal = rawWeightTotal || currentBuckets.length || 1;
  let usedPercent = 0;

  const scaledBuckets = currentBuckets.map((bucket, index) => {
    const weight = rawWeightTotal > 0
      ? Math.max(Number(bucket.percent || 0), 0)
      : 1;
    const percent = index === currentBuckets.length - 1
      ? Math.max(remainingPercent - usedPercent, 0)
      : Number(((weight / weightTotal) * remainingPercent).toFixed(1));
    usedPercent += percent;
    return {
      ...bucket,
      percent,
      allocated: walletValue * (percent / 100),
      spent: Number(bucket.spent || 0),
    };
  });

  const newBucket = {
    id: crypto.randomUUID(),
    name: bucketName,
    percent: Number((100 - scaledBuckets.reduce((sum, bucket) => sum + Number(bucket.percent || 0), 0)).toFixed(1)),
    allocated: 0,
    spent: 0,
    rules: {},
    subaccounts: getBucketGroup(bucketName) === "Bills"
      ? DEFAULT_BILL_SUBACCOUNTS.map((name) => ({
        id: crypto.randomUUID(),
        name,
        required: 0,
        allocated: 0,
        dueDay: 0,
        dueMonth: "monthly",
      }))
      : [],
  };
  newBucket.allocated = walletValue * (newBucket.percent / 100);

  return [...scaledBuckets, newBucket];
}

function renderAddBucketPreview(walletId, bucketName, percent) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet) return;
  const name = bucketName.trim() || "New Budget Account";
  const plan = getRebalancedBucketPlanWithNewBucket(wallet, name, percent);
  dialogContent.querySelector("#addBucketPreview").innerHTML = `
    <strong>Rebalanced template preview</strong>
    ${plan.map((bucket) => `<span>${escapeHtml(bucket.name)} ${Number(bucket.percent || 0).toFixed(1)}% ï¿½ ${formatUsd(bucket.allocated)}</span>`).join("")}
  `;
}

function openAddBucketAccountDialog() {
  if (!wallets.length) {
    showToast("Add a wallet first");
    switchTab("wallets");
    return;
  }

  const defaultWalletId = wallets.some((wallet) => wallet.id === selectedWalletId)
    ? selectedWalletId
    : wallets[0].id;
  const walletOptions = getSupportedWallets().map((wallet) => `
    <option value="${wallet.id}" ${wallet.id === defaultWalletId ? "selected" : ""}>${escapeHtml(wallet.name)} ï¿½ ${formatUsd(getWalletDisplayValue(wallet))}</option>
  `).join("");

  openDialog(`
    <div class="dialog-content">
      <h2>Add Budget Account</h2>
      <p class="wallet-note">Create a new Virtual Budget Account. AllocaFi will rebalance the selected wallet's saved template to keep the total at 100%.</p>
      <div class="send-grid">
        <label>
          Wallet
          <select id="addBucketWallet">${walletOptions}</select>
        </label>
        <label>
          Budget account name
          <input id="addBucketName" maxlength="40" placeholder="Child Expenses, Taxes, Vacation" />
        </label>
        <label>
          New budget account share
          <input id="addBucketPercent" type="number" min="1" max="99" step="0.1" value="10" />
        </label>
      </div>
      <div id="addBucketPreview" class="allocation-summary"></div>
      <div class="dialog-actions">
        <button class="primary-button" id="saveAddedBucket" type="button">Create and rebalance</button>
        <button class="ghost-button" id="editFullTemplate" type="button">Customize Budget Accounts</button>
      </div>
      <p class="form-note">Funds stay in the wallet. This only refreshes the virtual account plan inside AllocaFi.</p>
    </div>
  `);

  const walletSelect = dialogContent.querySelector("#addBucketWallet");
  const nameInput = dialogContent.querySelector("#addBucketName");
  const percentInput = dialogContent.querySelector("#addBucketPercent");
  const updatePreview = () => renderAddBucketPreview(walletSelect.value, nameInput.value, Number(percentInput.value || 0));
  walletSelect.addEventListener("change", updatePreview);
  nameInput.addEventListener("input", updatePreview);
  percentInput.addEventListener("input", updatePreview);
  dialogContent.querySelector("#saveAddedBucket").addEventListener("click", saveAddedBucketAccount);
  dialogContent.querySelector("#editFullTemplate").addEventListener("click", () => openAllocationDialog(walletSelect.value));
  updatePreview();
}

function saveAddedBucketAccount() {
  const walletId = dialogContent.querySelector("#addBucketWallet").value;
  const name = dialogContent.querySelector("#addBucketName").value.trim();
  const percent = Number(dialogContent.querySelector("#addBucketPercent").value || 0);
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet) return;
  if (!name) {
    showToast("Add a budget account name");
    return;
  }
  if ((wallet.allocation?.buckets || []).some((bucket) => bucket.name.toLowerCase() === name.toLowerCase())) {
    showToast("That budget account already exists");
    return;
  }
  if (!canUseBucketCountUnderPlan(countVirtualBucketAccounts() + 1)) {
    showToast("Upgrade to Premium for more Virtual Budget Accounts");
    openSubscriptionCheckout("premium");
    return;
  }

  const walletValue = getWalletDisplayValue(wallet);
  wallet.allocation = wallet.allocation || {
    cycle: "weekly",
    buckets: [],
    pendingIncrease: 0,
    pendingSpend: 0,
    lastValue: walletValue,
    updatedAt: new Date().toISOString(),
  };
  wallet.allocation.buckets = getRebalancedBucketPlanWithNewBucket(wallet, name, percent);
  wallet.allocation.pendingIncrease = 0;
  wallet.allocation.pendingSpend = Number(wallet.allocation.pendingSpend || 0);
  wallet.allocation.lastValue = walletValue;
  wallet.allocation.updatedAt = new Date().toISOString();
  saveWallets();
  render();
  walletDialog.close();
  showToast(`${name} budget account added and rebalanced`);
}

function saveAssignedMoney() {
  const templateHost = dialogContent.querySelector("#assignmentTemplateChoices");
  const walletId = dialogContent.querySelector("#assignWallet")?.value || templateHost?.dataset.walletId || getBudgetWallets()[0]?.id || "";
  const wallet = wallets.find((item) => item.id === walletId);
  const templateKey = dialogContent.querySelector("[data-assignment-template]:checked")?.value || (wallet?.allocation?.buckets?.length ? "__saved" : "essentials");
  const allocationMode = dialogContent.querySelector("[name='assignmentMode']:checked")?.value || wallet?.allocation?.autoMode || "rules";
  const existingBuckets = wallet?.allocation?.buckets || [];
  const useSavedPlan = templateKey === "__saved" && existingBuckets.length;
  const assignable = wallet ? getWalletAssignableAmount(wallet) : 0;
  const amountInput = dialogContent.querySelector("#assignAmount");
  const amount = amountInput ? Number(amountInput.value || 0) : assignable;
  const walletValue = wallet ? Math.max(getWalletDisplayValue(wallet), 0) : 0;
  if (!wallet) return;
  if (templateKey === "customBuild") {
    openAllocationDialog(walletId);
    return;
  }
  const selectedTemplate = BUCKET_TEMPLATES[templateKey];
  if (selectedTemplate && isBudgetTemplateLocked(selectedTemplate)) {
    showToast("Upgrade to Premium to use that budget template");
    openSubscriptionCheckout("premium");
    return;
  }

  if (useSavedPlan && assignable <= 0.01) {
    if (wallet.allocation) {
      wallet.allocation.pendingIncrease = 0;
      wallet.allocation.updatedAt = new Date().toISOString();
      saveWallets();
      render();
    }
    showToast("Wallet is already balanced");
    return;
  }
  if (useSavedPlan && amount > assignable + 0.01) {
    showToast(`Only ${formatUsd(assignable)} is available to assign`);
    return;
  }

  const safeAmount = useSavedPlan ? Math.min(amount, assignable) : Math.max(assignable, 0);

  if (!useSavedPlan) {
    const templateBuckets = getAssignmentTemplateBuckets(wallet, templateKey);
    const validation = validateBudgetTemplatePercentages(templateBuckets);
    if (!validation.ok) {
      showToast(`${getAssignmentTemplateName(templateKey)} must equal 100% before applying`);
      return;
    }
    if (existingBuckets.length) {
      const confirmed = window.confirm(`Apply ${getAssignmentTemplateName(templateKey)}? This will replace the current Virtual Budget Accounts and reallocate the current wallet balance.`);
      if (!confirmed) return;
    }
    const nextTotalBuckets = countVirtualBucketAccounts() - existingBuckets.length + templateBuckets.length;
    if (!canUseBucketCountUnderPlan(nextTotalBuckets)) {
      showToast("Upgrade to Premium to auto-create more budget accounts");
      openSubscriptionCheckout("premium");
      return;
    }
    const awaitingFunds = walletValue <= 0.01;
    wallet.allocation = {
      cycle: wallet.allocation?.cycle || "weekly",
      buckets: createAutoAllocationBucketsFromTemplate(templateBuckets, awaitingFunds ? 0 : walletValue, allocationMode),
      transactions: wallet.allocation?.transactions || [],
      pendingIncrease: 0,
      pendingSpend: 0,
      lastValue: walletValue,
      updatedAt: new Date().toISOString(),
      autoMode: allocationMode,
      awaitingFunds,
    };
    if (awaitingFunds) {
      const asset = NETWORKS[wallet.network]?.asset || "stablecoin";
      wallet.status = "Awaiting funds";
      wallet.statusType = "warning";
      wallet.error = `Add ${asset} to this Owner Wallet, then press Refresh to update the balance. Your Virtual Budget Accounts are ready but unfunded.`;
    } else {
      wallet.status = "Live";
      wallet.statusType = "live";
      wallet.error = "";
    }
  } else {
    wallet.allocation.autoMode = allocationMode;
    allocateAmountToWalletBuckets(wallet, safeAmount, allocationMode);
    wallet.allocation.pendingIncrease = Math.max(Number(wallet.allocation.pendingIncrease || 0) - safeAmount, 0);
    clampWalletPendingIncrease(wallet);
    wallet.allocation.lastValue = getWalletDisplayValue(wallet);
    wallet.allocation.updatedAt = new Date().toISOString();
    if (safeAmount > 0.01) {
      recordAutomaticAllocation(wallet, safeAmount, `${getAssignmentTemplateName(templateKey)} ${allocationMode === "ai" ? "AI-assisted" : "rules-based"} auto allocation`);
    }
  }

  saveWallets();
  render();
  walletDialog.close();
  showToast(!useSavedPlan && existingBuckets.length
    ? `${getAssignmentTemplateName(templateKey)} applied to current wallet balance`
    : `${allocationMode === "ai" ? "AI-assisted" : "Rules-based"} auto allocation saved`);
}

function openGoalDialog(goalId = null) {
  const goal = goals.find((item) => item.id === goalId) || {};
  openDialog(`
    <div class="dialog-content">
      <h2>${goal.id ? "Update goal" : "Add goal"}</h2>
      <div class="send-grid">
        <label>
          Goal name
          <input id="goalName" value="${escapeHtml(goal.name || "")}" placeholder="Emergency Fund" />
        </label>
        <label>
          Current amount
          <input id="goalCurrent" type="number" min="0" step="0.01" value="${Number(goal.current || 0)}" />
        </label>
        <label>
          Target amount
          <input id="goalTarget" type="number" min="0" step="0.01" value="${Number(goal.target || 0)}" />
        </label>
      </div>
      <div class="dialog-actions">
        <button class="primary-button" id="saveGoal" type="button">Save goal</button>
      </div>
    </div>
  `);
  dialogContent.querySelector("#saveGoal").addEventListener("click", () => saveGoal(goal.id));
}

function getBucketOptions(selectedBucketId = "") {
  return wallets.flatMap((wallet) => (wallet.allocation?.buckets || []).map((bucket) => ({
    walletId: wallet.id,
    bucketId: bucket.id,
    label: `${wallet.name} Â· ${bucket.name}`,
  }))).map((option) => `
    <option value="${option.bucketId}" ${option.bucketId === selectedBucketId ? "selected" : ""}>${escapeHtml(option.label)}</option>
  `).join("");
}

function getAllBucketOptions(selectedBucketId = "") {
  return wallets.flatMap((wallet) => (wallet.allocation?.buckets || []).map((bucket) => {
    const allocated = Number(bucket.allocated || 0);
    const spent = Number(bucket.spent || 0);
    const left = Math.max(allocated - spent, 0);
    return {
      walletId: wallet.id,
      bucketId: bucket.id,
      label: `${wallet.name} Â· ${bucket.name} (${formatUsd(left)} balance)`,
    };
  })).map((option) => `
    <option value="${option.walletId}:${option.bucketId}" ${option.bucketId === selectedBucketId ? "selected" : ""}>${escapeHtml(option.label)}</option>
  `).join("");
}

function findBucketByComposite(value) {
  const [walletId, bucketId] = value.split(":");
  const wallet = wallets.find((item) => item.id === walletId);
  const bucket = wallet?.allocation?.buckets?.find((item) => item.id === bucketId);
  return { wallet, bucket };
}

function openMoveMoneyDialog(sourceBucketId = "") {
  const options = getAllBucketOptions(sourceBucketId);
  if (!options) {
    showToast("Create Virtual Budget Accounts first");
    return;
  }

  openDialog(`
    <div class="dialog-content">
      <h2>Move Money</h2>
      <p class="wallet-note">Rebalance value between Virtual Budget Accounts. This does not move funds on-chain.</p>
      <div class="send-grid">
        <label>
          From
          <select id="moveFrom">${options}</select>
        </label>
        <label>
          To
          <select id="moveTo">${options}</select>
        </label>
        <label>
          Amount
          <input id="moveAmount" type="number" min="0" step="0.01" placeholder="50.00" />
        </label>
        <label>
          Note
          <input id="moveNote" maxlength="80" placeholder="Rebalance for the week" />
        </label>
      </div>
      <div class="dialog-actions">
        <button class="primary-button" id="saveMoveMoney" type="button">Move money</button>
      </div>
    </div>
  `);
  dialogContent.querySelector("#saveMoveMoney").addEventListener("click", saveMoveMoney);
}

function openTemplateDialog() {
  if (!wallets.length) {
    showToast("Add a wallet first");
    switchTab("wallets");
    return;
  }
  openDialog(`
    <div class="dialog-content">
      <h2>Budget Account Templates</h2>
      <p class="wallet-note">Apply starter Virtual Budget Accounts to a tracked wallet.</p>
      <div class="send-grid">
        <label>
          Wallet
          <select id="templateWallet">
            ${getSupportedWallets().map((wallet) => `<option value="${wallet.id}">${escapeHtml(wallet.name)} Â· ${formatUsd(getWalletDisplayValue(wallet))}</option>`).join("")}
          </select>
        </label>
        <label>
          Template
          <select id="templateType">
            ${Object.entries(BUCKET_TEMPLATES).map(([key, template]) => `<option value="${key}">${escapeHtml(template.name)}</option>`).join("")}
          </select>
        </label>
        <label class="check-row">
          <input id="templateReallocate" type="checkbox" checked />
          Reallocate current wallet value by template percentages
        </label>
      </div>
      <div id="templatePreview" class="allocation-summary"></div>
      <div class="dialog-actions">
        <button class="primary-button" id="applyTemplate" type="button">Apply template</button>
      </div>
    </div>
  `);
  const updatePreview = () => {
    const template = BUCKET_TEMPLATES[dialogContent.querySelector("#templateType").value];
    dialogContent.querySelector("#templatePreview").innerHTML = `
      <strong>${escapeHtml(template.name)}</strong>
      ${template.buckets.map((bucket) => `<span>${escapeHtml(bucket.name)} Â· ${bucket.percent}%${bucket.subaccounts ? ` Â· ${bucket.subaccounts.length} bill subaccounts` : ""}</span>`).join("")}
    `;
  };
  dialogContent.querySelector("#templateType").addEventListener("change", updatePreview);
  dialogContent.querySelector("#applyTemplate").addEventListener("click", applyBucketTemplate);
  updatePreview();
}

function applyBucketTemplate() {
  const wallet = wallets.find((item) => item.id === dialogContent.querySelector("#templateWallet").value);
  const template = BUCKET_TEMPLATES[dialogContent.querySelector("#templateType").value];
  const shouldReallocate = dialogContent.querySelector("#templateReallocate").checked;
  if (!wallet || !template) return;
  const walletValue = getWalletDisplayValue(wallet);

  wallet.allocation = wallet.allocation || {
    cycle: "weekly",
    buckets: [],
    pendingIncrease: 0,
    pendingSpend: 0,
    lastValue: walletValue,
    updatedAt: new Date().toISOString(),
  };

  const newTemplateBuckets = template.buckets.filter((templateBucket) => !wallet.allocation.buckets.some((bucket) => bucket.name.toLowerCase() === templateBucket.name.toLowerCase())).length;
  if (!canUseBucketCountUnderPlan(countVirtualBucketAccounts() + newTemplateBuckets)) {
    showToast("Upgrade to Premium for unlimited budget accounts");
    openSubscriptionCheckout("premium");
    return;
  }

  template.buckets.forEach((templateBucket) => {
    const existing = wallet.allocation.buckets.find((bucket) => bucket.name.toLowerCase() === templateBucket.name.toLowerCase());
    const allocated = shouldReallocate ? walletValue * (templateBucket.percent / 100) : 0;
    const existingSubaccounts = normalizeSubaccounts(existing?.subaccounts || []);
    const bucketData = {
      id: existing?.id || crypto.randomUUID(),
      name: templateBucket.name,
      percent: templateBucket.percent,
      allocated,
      spent: existing?.spent || 0,
      rules: existing?.rules || {},
      subaccounts: templateBucket.subaccounts?.map((name) => ({
        id: existingSubaccounts.find((item) => item.name.toLowerCase() === name.toLowerCase())?.id || crypto.randomUUID(),
        name,
        required: existingSubaccounts.find((item) => item.name.toLowerCase() === name.toLowerCase())?.required || 0,
        allocated: existingSubaccounts.find((item) => item.name.toLowerCase() === name.toLowerCase())?.allocated || 0,
        dueDay: existingSubaccounts.find((item) => item.name.toLowerCase() === name.toLowerCase())?.dueDay || 0,
        dueMonth: existingSubaccounts.find((item) => item.name.toLowerCase() === name.toLowerCase())?.dueMonth || "monthly",
      })) || existing?.subaccounts || [],
    };
    if (existing) Object.assign(existing, bucketData);
    else wallet.allocation.buckets.push(bucketData);
  });

  wallet.allocation.updatedAt = new Date().toISOString();
  wallet.allocation.lastValue = walletValue;
  saveWallets();
  render();
  walletDialog.close();
  showToast(`${template.name} template applied`);
}

function saveMoveMoney() {
  const fromValue = dialogContent.querySelector("#moveFrom").value;
  const toValue = dialogContent.querySelector("#moveTo").value;
  const amount = Number(dialogContent.querySelector("#moveAmount").value || 0);
  const note = dialogContent.querySelector("#moveNote").value.trim();
  const from = findBucketByComposite(fromValue);
  const to = findBucketByComposite(toValue);

  if (!from.bucket || !to.bucket || fromValue === toValue) {
    showToast("Choose two different accounts");
    return;
  }
  if (amount <= 0) {
    showToast("Enter an amount to move");
    return;
  }

  const available = Math.max(Number(from.bucket.allocated || 0) - Number(from.bucket.spent || 0), 0);
  if (amount > available) {
    showToast(`Only ${formatUsd(available)} is available`);
    return;
  }

  from.bucket.allocated = Number(from.bucket.allocated || 0) - amount;
  to.bucket.allocated = Number(to.bucket.allocated || 0) + amount;
  const tx = {
    id: crypto.randomUUID(),
    type: "virtual-transfer",
    bucketId: to.bucket.id,
    bucketName: `${from.bucket.name} â†’ ${to.bucket.name}`,
    amount,
    note,
    createdAt: new Date().toISOString(),
  };
  to.wallet.allocation.transactions = to.wallet.allocation.transactions || [];
  to.wallet.allocation.transactions.unshift(tx);
  saveWallets();
  render();
  walletDialog.close();
  showToast("Virtual money moved");
}

function openAddressBookDialog(entryId = null, seed = {}) {
  const entry = addressBook.find((item) => item.id === entryId) || seed;
  openDialog(`
    <div class="dialog-content">
      <h2>${entry.id ? "Edit nickname" : "Add nickname"}</h2>
      <div class="send-grid">
        <label>
          Nickname
          <input id="addressNickname" value="${escapeHtml(entry.name || "")}" placeholder="Rent Wallet" />
        </label>
        <label>
          Public address
          <input id="addressNicknameAddress" spellcheck="false" value="${escapeHtml(entry.address || "")}" placeholder="0x..." />
        </label>
        <label>
          Asset/network
          <select id="addressNicknameNetwork">
            <option value="">Any matching network</option>
            ${getSupportedNetworkEntries().map(([key, network]) => `<option value="${key}" ${entry.network === key ? "selected" : ""}>${escapeHtml(network.label)} ${escapeHtml(network.asset)}</option>`).join("")}
          </select>
        </label>
        <label>
          Default budget account
          <select id="addressNicknameBucket">
            <option value="">No default budget account</option>
            ${getBucketOptions(entry.bucketId)}
          </select>
        </label>
      </div>
      <div class="dialog-actions">
        <button class="primary-button" id="saveAddressNickname" type="button">Save nickname</button>
      </div>
    </div>
  `);
  dialogContent.querySelector("#saveAddressNickname").addEventListener("click", () => saveAddressBookEntry(entry.id));
}

function saveAddressBookEntry(entryId = null) {
  const name = dialogContent.querySelector("#addressNickname").value.trim();
  const address = cleanAddress(dialogContent.querySelector("#addressNicknameAddress").value);
  const network = dialogContent.querySelector("#addressNicknameNetwork").value;
  const bucketId = dialogContent.querySelector("#addressNicknameBucket").value;
  const bucket = wallets.flatMap((wallet) => wallet.allocation?.buckets || []).find((item) => item.id === bucketId);

  if (!name || !address) {
    showToast("Add a nickname and address");
    return;
  }

  const entry = {
    id: entryId || crypto.randomUUID(),
    name,
    address,
    network,
    bucketId,
    bucketName: bucket?.name || "",
    updatedAt: new Date().toISOString(),
  };

  addressBook = entryId
    ? addressBook.map((item) => item.id === entryId ? entry : item)
    : [entry, ...addressBook.filter((item) => item.address.toLowerCase() !== address.toLowerCase() || item.network !== network)];

  saveAddressBook();
  renderAddressBook();
  walletDialog.close();
  showToast("Nickname saved");
}

function saveGoal(goalId = null) {
  const name = dialogContent.querySelector("#goalName").value.trim();
  const current = Number(dialogContent.querySelector("#goalCurrent").value || 0);
  const target = Number(dialogContent.querySelector("#goalTarget").value || 0);
  if (!name || target <= 0) {
    showToast("Add a goal name and target amount");
    return;
  }

  if (goalId) {
    goals = goals.map((goal) => goal.id === goalId ? { ...goal, name, current, target } : goal);
  } else {
    goals.unshift({ id: crypto.randomUUID(), name, current, target, createdAt: new Date().toISOString() });
  }

  saveGoals();
  renderGoals();
  walletDialog.close();
  showToast("Goal saved");
}

function openSetupWizard() {
  openDialog(`
    <div class="dialog-content">
      <h2>AllocaFi setup wizard</h2>
      <p class="wallet-note">A simple local starter flow. Add your wallet first, then create Virtual Budget Accounts.</p>
      <div class="send-grid">
        <label>
          Wallet name
          <input id="wizardName" placeholder="Main Spending Wallet" />
        </label>
        <label>
          Asset/network
          <select id="wizardNetwork">
            ${getSupportedNetworkEntries().map(([key, network]) => `<option value="${key}">${escapeHtml(network.label)} ${escapeHtml(network.asset)}</option>`).join("")}
          </select>
        </label>
        <label>
          Public address
          <input id="wizardAddress" spellcheck="false" placeholder="0x..., bc1..., 1..., or 3..." />
        </label>
      </div>
      <div class="dialog-actions">
        <button class="primary-button" id="wizardSave" type="button">Create wallet and budget accounts</button>
      </div>
      <p class="form-note">This stores only public wallet details and local budgeting data.</p>
    </div>
  `);
  dialogContent.querySelector("#wizardNetwork").value = "solanaPyusd";
  dialogContent.querySelector("#wizardSave").addEventListener("click", saveWizardWallet);
}

function saveWizardWallet() {
  const name = dialogContent.querySelector("#wizardName").value.trim() || "Main Spending Wallet";
  const network = dialogContent.querySelector("#wizardNetwork").value;
  const address = cleanAddress(dialogContent.querySelector("#wizardAddress").value);
  if (!isValidAddressForNetwork(address, network)) {
    showToast("Enter a valid address for the selected asset");
    return;
  }
  if (!canAddWalletUnderPlan()) {
    showToast("Upgrade to Premium for multiple wallets");
    openSubscriptionCheckout("premium");
    return;
  }
  if (!canUseBucketCountUnderPlan(countVirtualBucketAccounts() + DEFAULT_BUCKETS.length)) {
    showToast("Upgrade to Premium to create starter budget accounts");
    openSubscriptionCheckout("premium");
    return;
  }
  const walletValue = 0;
  const wallet = {
    id: crypto.randomUUID(),
    name,
    network,
    address,
    budget: 0,
    manualBalance: 0,
    balance: 0,
    note: "",
    status: "Saved",
    statusType: "",
    createdAt: new Date().toISOString(),
    allocation: {
      cycle: "weekly",
      buckets: DEFAULT_BUCKETS.map((bucket) => ({
        id: crypto.randomUUID(),
        name: bucket.name,
        percent: bucket.percent,
        allocated: walletValue * (bucket.percent / 100),
        spent: 0,
      })),
      pendingIncrease: 0,
      pendingSpend: 0,
      lastValue: walletValue,
      updatedAt: new Date().toISOString(),
    },
  };
  wallets.unshift(wallet);
  saveWallets();
  walletDialog.close();
  render();
  refreshWallet(wallet.id);
  showToast("Starter wallet created");
}

function saveAllocation(id) {
  const wallet = wallets.find((item) => item.id === id);
  if (!wallet) return;

  const names = [...dialogContent.querySelectorAll("[data-bucket-name]")];
  const walletValue = getWalletDisplayValue(wallet);
  const allocationMode = dialogContent.querySelector("[name='customAllocationMode']:checked")?.value || "rules";
  let buckets = names.map((nameInput, index) => {
    const percentInput = dialogContent.querySelector(`[data-bucket-percent="${index}"]`);
    const enabledInput = dialogContent.querySelector(`[data-bucket-enabled="${index}"]`);
    const name = nameInput.value.trim();
    const percent = Number(percentInput.value);
    const existing = wallet.allocation?.buckets?.[index];
    const rowSubaccounts = (nameInput.dataset.subaccounts || "").split("|").filter(Boolean);
    const existingSubaccounts = normalizeSubaccounts(existing?.subaccounts || []);
    return {
      enabled: !enabledInput || enabledInput.checked,
      id: existing?.id || crypto.randomUUID(),
      name: name || `Budget Account ${index + 1}`,
      percent: Number.isFinite(percent) ? percent : 0,
      allocated: walletValue * (percent / 100),
      spent: existing?.spent || 0,
      subaccounts: rowSubaccounts.length
        ? rowSubaccounts.map((subaccount) => ({
          id: existingSubaccounts.find((item) => item.name.toLowerCase() === subaccount.toLowerCase())?.id || crypto.randomUUID(),
          name: subaccount,
          required: existingSubaccounts.find((item) => item.name.toLowerCase() === subaccount.toLowerCase())?.required || 0,
          allocated: existingSubaccounts.find((item) => item.name.toLowerCase() === subaccount.toLowerCase())?.allocated || 0,
          dueDay: existingSubaccounts.find((item) => item.name.toLowerCase() === subaccount.toLowerCase())?.dueDay || 0,
          dueMonth: existingSubaccounts.find((item) => item.name.toLowerCase() === subaccount.toLowerCase())?.dueMonth || "monthly",
        }))
        : existing?.subaccounts || [],
    };
  }).filter((bucket) => bucket.enabled && bucket.percent > 0).map(({ enabled, ...bucket }) => bucket);

  if (!buckets.length) {
    showToast("Keep at least one budget account above 0%");
    return;
  }
  const existingCount = wallet.allocation?.buckets?.length || 0;
  const nextTotalBuckets = countVirtualBucketAccounts() - existingCount + buckets.length;
  if (!canUseBucketCountUnderPlan(nextTotalBuckets)) {
    showToast("Upgrade to Premium for unlimited budget accounts");
    openSubscriptionCheckout("premium");
    return;
  }

  const totalPercent = buckets.reduce((sum, bucket) => sum + bucket.percent, 0);
  if (Math.abs(totalPercent - 100) > 0.01) {
    const shouldReallocate = window.confirm(`Your active budget accounts add up to ${Number(totalPercent.toFixed(1))}%. Reallocate the active Virtual Budget Accounts to 100% and skip blank or 0% rows?`);
    if (!shouldReallocate) return;
    buckets = buckets.map((bucket, index) => {
      const percent = index === buckets.length - 1
        ? 0
        : Number(((bucket.percent / totalPercent) * 100).toFixed(1));
      return { ...bucket, percent };
    }).map((bucket, index, all) => {
      if (index !== all.length - 1) return bucket;
      const used = all.slice(0, -1).reduce((sum, item) => sum + item.percent, 0);
      return { ...bucket, percent: Number(Math.max(100 - used, 0).toFixed(1)) };
    });
  }

  buckets = buckets.map((bucket) => ({
    ...bucket,
    allocated: walletValue * (bucket.percent / 100),
  }));

  wallet.allocation = {
    cycle: "weekly",
    buckets,
    transactions: wallet.allocation?.transactions || [],
    pendingIncrease: 0,
    pendingSpend: wallet.allocation?.pendingSpend || 0,
    lastValue: walletValue,
    updatedAt: new Date().toISOString(),
    autoMode: allocationMode,
  };
  saveWallets();
  render();
  walletDialog.close();
  showToast(`${allocationMode === "ai" ? "AI-assisted" : "Rules-based"} custom auto allocation saved`);
}

function openSpendDialog(walletId, bucketId, usePending = false) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet?.allocation?.buckets?.length) return;
  const pendingSpend = Number(wallet.allocation.pendingSpend || 0);
  const placeholder = usePending && !bucketId
    ? `<option value="" selected>Choose budget account or action</option>`
    : "";
  const options = wallet.allocation.buckets.map((bucket) => `
    <option value="${bucket.id}" ${bucket.id === bucketId ? "selected" : ""}>${escapeHtml(bucket.name)}</option>
  `).join("");
  const liquidationOption = usePending
    ? `<option value="${PERSONAL_LIQUIDATION_ACTION}">Personal liquidation / rebalance wallet</option>`
    : "";

  openDialog(`
    <div class="dialog-content">
      <h2>Record spend</h2>
      ${usePending ? `<p class="wallet-note">Assign detected spending of ${formatUsd(pendingSpend)} to a budget account. If this was a cashout or large transfer on purpose, choose Personal liquidation from the dropdown.</p>` : ""}
      <div class="send-grid">
        <label>
          ${usePending ? "Budget account or action" : "Budget account"}
          <select id="spendBucket">${placeholder}${options}${liquidationOption}</select>
        </label>
        <label>
          Amount
          <input id="spendAmount" type="number" min="0" step="0.01" value="${usePending ? pendingSpend.toFixed(2) : ""}" placeholder="25.00" />
        </label>
        <label>
          Note
          <input id="spendNote" maxlength="80" placeholder="Groceries, gas, bill payment" />
        </label>
      </div>
      <div class="dialog-actions">
        <button class="primary-button" type="button" id="saveSpend">Save spend</button>
      </div>
    </div>
  `);

  dialogContent.querySelector("#saveSpend").addEventListener("click", () => saveSpend(wallet.id, usePending));
}

function renderBillMonthOptions(selected = "monthly") {
  return BILL_MONTH_OPTIONS.map((month) => `
    <option value="${month.value}" ${String(selected) === String(month.value) ? "selected" : ""}>${month.label}</option>
  `).join("");
}

function renderBillPlannerRows(subaccounts) {
  const bills = normalizeSubaccounts(subaccounts);
  return bills.map((bill, index) => `
    <div class="bill-row" data-bill-row="${index}" data-bill-id="${escapeHtml(bill.id)}">
      <label>
        Bill name
        <input data-bill-name value="${escapeHtml(bill.name)}" maxlength="40" />
      </label>
      <label>
        Goal amount
        <input data-bill-required type="number" min="0" step="0.01" value="${Number(bill.required || 0)}" />
      </label>
      <label>
        Due month
        <select data-bill-due-month>${renderBillMonthOptions(bill.dueMonth)}</select>
      </label>
      <label>
        Due date
        <input data-bill-due-day type="number" min="1" max="31" step="1" value="${Number(bill.dueDay || 0) || ""}" placeholder="15" />
      </label>
      <button class="ghost-button remove-bill-row" type="button">Remove</button>
    </div>
  `).join("");
}

function applyBillFundingPlan(wallet, bucket, monthlyTotal) {
  const walletValue = getWalletDisplayValue(wallet);
  if (!walletValue) return;
  const weeklyTarget = Math.min(monthlyTotal / 4, walletValue);
  const otherBuckets = wallet.allocation.buckets.filter((item) => item.id !== bucket.id);
  const remainingValue = Math.max(walletValue - weeklyTarget, 0);
  const otherTotal = otherBuckets.reduce((sum, item) => sum + Number(item.allocated || 0), 0) || otherBuckets.reduce((sum, item) => sum + Number(item.percent || 0), 0) || otherBuckets.length || 1;

  bucket.allocated = weeklyTarget;
  bucket.percent = Number(((weeklyTarget / walletValue) * 100).toFixed(1));
  bucket.rules = {
    ...(bucket.rules || {}),
    minimum: weeklyTarget,
    refill: weeklyTarget,
    reset: "monthly",
    lastReset: bucket.rules?.lastReset || new Date().toISOString(),
  };

  otherBuckets.forEach((item, index) => {
    const weight = Number(item.allocated || 0) || Number(item.percent || 0) || 1;
    const allocated = index === otherBuckets.length - 1
      ? Math.max(walletValue - weeklyTarget - otherBuckets.slice(0, -1).reduce((sum, prior) => sum + Number(prior.allocated || 0), 0), 0)
      : remainingValue * (weight / otherTotal);
    item.allocated = allocated;
    item.percent = Number(((allocated / walletValue) * 100).toFixed(1));
  });
}

function openBillsPlannerDialog(walletId, bucketId) {
  const wallet = wallets.find((item) => item.id === walletId);
  const bucket = wallet?.allocation?.buckets?.find((item) => item.id === bucketId);
  if (!wallet || !bucket) return;

  if (!bucket.subaccounts?.length) {
    bucket.subaccounts = DEFAULT_BILL_SUBACCOUNTS.map((name) => ({
      id: crypto.randomUUID(),
      name,
      required: 0,
      allocated: 0,
      dueDay: 0,
      dueMonth: "monthly",
    }));
  }

  const monthlyTotal = getMonthlyBillTotal(bucket);
  openDialog(`
    <div class="dialog-content wide-dialog">
      <h2>Bills Planner</h2>
      <p class="wallet-note">Edit the actual household bills you pay each month, including amount and due date. AllocaFi can convert the monthly total into a weekly funding target and alert you when bills are coming due.</p>
      <div class="stats-grid">
        <div class="stat-tile"><span>Monthly Bill Goal</span><strong id="billMonthlyTotal">${formatUsd(monthlyTotal)}</strong></div>
        <div class="stat-tile"><span>Weekly Target</span><strong id="billWeeklyTarget">${formatUsd(monthlyTotal / 4)}</strong></div>
      </div>
      <div id="billPlannerRows" class="bill-planner-list">
        ${renderBillPlannerRows(bucket.subaccounts)}
      </div>
      <div class="dialog-actions">
        <button class="secondary-button" id="addBillRow" type="button">Add Bill</button>
        <button class="secondary-button" id="restoreCommonBills" type="button">Restore Common Bills</button>
      </div>
      <label class="check-row">
        <input id="autoFundBills" type="checkbox" checked />
        Use monthly bill total to set weekly Bills allocation
      </label>
      <div class="dialog-actions">
        <button class="primary-button" id="saveBillsPlanner" type="button">Save Bills</button>
      </div>
    </div>
  `);

  const rowsContainer = dialogContent.querySelector("#billPlannerRows");
  const updateTotals = () => {
    const total = [...rowsContainer.querySelectorAll("[data-bill-required]")]
      .reduce((sum, input) => sum + Number(input.value || 0), 0);
    dialogContent.querySelector("#billMonthlyTotal").textContent = formatUsd(total);
    dialogContent.querySelector("#billWeeklyTarget").textContent = formatUsd(total / 4);
  };
  const wireRemoveButtons = () => {
    rowsContainer.querySelectorAll(".remove-bill-row").forEach((button) => {
      button.onclick = () => {
        button.closest(".bill-row")?.remove();
        updateTotals();
      };
    });
    rowsContainer.querySelectorAll("[data-bill-required]").forEach((input) => {
      input.oninput = updateTotals;
    });
  };

  dialogContent.querySelector("#addBillRow").addEventListener("click", () => {
    rowsContainer.insertAdjacentHTML("beforeend", renderBillPlannerRows([{ name: "New Bill", required: 0, dueDay: 0, dueMonth: "monthly" }]));
    wireRemoveButtons();
    updateTotals();
  });
  dialogContent.querySelector("#restoreCommonBills").addEventListener("click", () => {
    rowsContainer.innerHTML = renderBillPlannerRows(DEFAULT_BILL_SUBACCOUNTS.map((name) => ({ name, required: 0, dueDay: 0, dueMonth: "monthly" })));
    wireRemoveButtons();
    updateTotals();
  });
  dialogContent.querySelector("#saveBillsPlanner").addEventListener("click", () => saveBillsPlanner(wallet.id, bucket.id));
  wireRemoveButtons();
  updateTotals();
}

function saveBillsPlanner(walletId, bucketId) {
  const wallet = wallets.find((item) => item.id === walletId);
  const bucket = wallet?.allocation?.buckets?.find((item) => item.id === bucketId);
  if (!wallet || !bucket) return;

  const bills = [...dialogContent.querySelectorAll(".bill-row")].map((row) => ({
    id: row.dataset.billId || crypto.randomUUID(),
    name: row.querySelector("[data-bill-name]").value.trim(),
    required: Number(row.querySelector("[data-bill-required]").value || 0),
    dueDay: Math.min(Math.max(Number(row.querySelector("[data-bill-due-day]").value || 0), 0), 31),
    dueMonth: row.querySelector("[data-bill-due-month]").value || "monthly",
    allocated: 0,
  })).filter((bill) => bill.name);

  bucket.subaccounts = bills;
  const monthlyTotal = bills.reduce((sum, bill) => sum + bill.required, 0);
  if (dialogContent.querySelector("#autoFundBills").checked) {
    applyBillFundingPlan(wallet, bucket, monthlyTotal);
  }
  if (bucket.rules?.reset === "monthly" && !bucket.rules.lastReset) {
    bucket.rules.lastReset = new Date().toISOString();
  }

  wallet.allocation.updatedAt = new Date().toISOString();
  wallet.allocation.lastValue = getWalletDisplayValue(wallet);
  saveWallets();
  render();
  walletDialog.close();
  showToast("Bills planner saved");
}

function openBucketRulesDialog(walletId, bucketId) {
  const wallet = wallets.find((item) => item.id === walletId);
  const bucket = wallet?.allocation?.buckets?.find((item) => item.id === bucketId);
  if (!wallet || !bucket) return;
  const rules = bucket.rules || {};

  openDialog(`
    <div class="dialog-content">
      <h2>${escapeHtml(bucket.name)} rules</h2>
      <p class="wallet-note">Rules create local alerts and warnings. They do not lock funds on-chain.</p>
      <div class="send-grid">
        <label>
          Minimum balance
          <input id="ruleMinimum" type="number" min="0" step="0.01" value="${Number(rules.minimum || 0)}" />
        </label>
        <label>
          Warning threshold
          <input id="ruleWarning" type="number" min="0" step="0.01" value="${Number(rules.warning || 0)}" />
        </label>
        <label>
          Weekly refill target
          <input id="ruleRefill" type="number" min="0" step="0.01" value="${Number(rules.refill || 0)}" />
        </label>
        <label>
          Reset cycle
          <select id="ruleReset">
            <option value="never" ${rules.reset === "never" || !rules.reset ? "selected" : ""}>Never</option>
            <option value="weekly" ${rules.reset === "weekly" ? "selected" : ""}>Weekly</option>
            <option value="monthly" ${rules.reset === "monthly" ? "selected" : ""}>Monthly</option>
          </select>
        </label>
        <label class="check-row">
          <input id="ruleProtected" type="checkbox" ${rules.protected ? "checked" : ""} />
          Protected budget account warning
        </label>
        <label>
          Last reset date
          <input id="ruleLastReset" type="date" value="${rules.lastReset ? rules.lastReset.slice(0, 10) : ""}" />
        </label>
      </div>
      <div class="dialog-actions">
        <button class="primary-button" id="saveBucketRules" type="button">Save rules</button>
      </div>
    </div>
  `);

  dialogContent.querySelector("#saveBucketRules").addEventListener("click", () => saveBucketRules(wallet.id, bucket.id));
}


function openVirtualAssetAccountFromDashboard(accountId) {
  switchTab("accounts");
  window.setTimeout(() => openVirtualAssetAccountDialog(accountId), 40);
}

function getVirtualAssetSourceWallet(account) {
  return wallets.find((wallet) => account?.sourceWalletIds?.includes(wallet.id)) || null;
}

function openVirtualAssetAccountDialog(accountId) {
  if (!canUseReserveAssetAccounts()) {
    showToast("AllocaFi Core unlocks Reserve Asset Accounts");
    openSubscriptionCheckout("premium");
    return;
  }
  const account = getVirtualAssetAccountById(accountId);
  if (!account) return;
  const legal = buildLegalCoreRecordForAccount(account);
  const timeline = getAssetAccountTimeline(account).slice(0, 8);
  const actionId = escapeHtml(account.id);
  const legalGain = legal.costBasis > 0 ? account.currentValue - legal.costBasis : 0;
  const legalGainPercent = legal.costBasis > 0 ? (legalGain / legal.costBasis) * 100 : 0;
  openDialog(`
    <div class="dialog-content wide-dialog vba-detail-modal asset-account-detail-modal" data-asset-price-account="${actionId}">
      <section class="vba-detail-hero asset-detail-hero">
        <span class="vba-detail-icon asset-detail-icon">${renderAssetLogo(account.asset)}</span>
        <div class="vba-detail-heading">
          <span class="vba-detail-kicker">Virtual Asset Account</span>
          <h2>${escapeHtml(account.name)}</h2>
          <div class="vba-detail-tags">
            <span>${escapeHtml(account.meta.name)}</span>
            <span>${escapeHtml(account.asset)}</span>
            <span data-legal-core-field="legal-status">${escapeHtml(legal.legalCoreStatus)}</span>
          </div>
        </div>
        <aside class="vba-detail-balance">
          <span class="account-coin-stack vba-detail-coin">${renderAssetLogo(account.asset)}</span>
          <small>Current Value</small>
          <strong>${renderMoneyValue(account.currentValue, { compactAt: 1_000_000, label: `${account.name} current value` })}</strong>
          <em>${escapeHtml(formatAssetQuantity(account.quantity, account.asset))}</em>
        </aside>
      </section>
      <section class="vba-detail-metric-strip asset-detail-metric-strip" aria-label="Asset account summary">
        <article><span>Cost Basis</span><strong data-legal-core-field="cost-basis">${legal.costBasis > 0 ? renderMoneyValue(legal.costBasis, { compactAt: 1_000_000, label: `${account.name} cost basis` }) : "Needs verification"}</strong><small data-legal-core-field="price-source">${escapeHtml(legal.priceSourceLabel)}</small></article>
        <article><span>Gain</span><strong data-legal-core-field="unrealized-gain" class="${legalGain >= 0 ? "positive" : "negative"}">${legal.costBasis > 0 ? `${legalGain >= 0 ? "+" : "-"}${formatUsd(Math.abs(legalGain))}` : "Needs basis"}</strong><small data-legal-core-field="gain-percent">${legal.costBasis > 0 ? `${legalGainPercent >= 0 ? "+" : ""}${legalGainPercent.toFixed(1)}%` : "Add receipt or estimate"}</small></article>
        <article><span>Holding Period</span><strong>${account.holdingPeriodDays} Days</strong><small>From acquisition record</small></article>
        <article><span>Legal Core</span><strong data-legal-core-field="legal-status">${escapeHtml(legal.legalCoreStatus)}</strong><small data-legal-core-field="classification">${escapeHtml(legal.classificationStatus)}</small></article>
        <article><span>Last Sync</span><strong>${escapeHtml(account.lastSync ? new Date(account.lastSync).toLocaleTimeString() : "Not synced")}</strong><small>${escapeHtml(account.lastSync ? new Date(account.lastSync).toLocaleDateString() : "Connect wallet")}</small></article>
      </section>
      <section class="vba-detail-workspace">
        <section class="vba-detail-panel vba-detail-activity">
          <div class="vba-detail-section-head">
            <div><span>Asset Timeline System</span><h3>Timeline</h3></div>
            <strong>${timeline.length} events</strong>
          </div>
          <div class="vba-activity-list">
            ${timeline.map((item) => `
              <div class="vba-activity-row">
                <span class="vba-activity-icon">${getWalletActionIcon(item.type === "Sold" ? "send" : item.type === "Transferred" ? "move" : "receive")}</span>
                <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail)} | ${escapeHtml(new Date(item.createdAt).toLocaleString())}</small></div>
                <b>${escapeHtml(item.type)}</b>
              </div>
            `).join("")}
          </div>
        </section>
        <aside class="vba-detail-side">
          <section class="vba-detail-panel">
            <div class="vba-detail-section-head"><div><span>Records</span><h3>Legal Core + Tax Ledger</h3></div><strong>Vault-ready</strong></div>
            <div class="vba-detail-mini-stats">
              <span><small>Historical price</small><b data-legal-core-field="historical-price">${escapeHtml(renderLegalCoreHistoricalPriceValue(legal))}</b></span>
              <span><small>Price confidence</small><b data-legal-core-field="price-confidence">${escapeHtml(legal.priceConfidenceLabel)}</b></span>
              <span><small>Tax Ledger</small><b>${legal.unrealizedGain || legal.unrealizedLoss ? "Gain/Loss Ready" : "Tracking Ready"}</b></span>
            </div>
            <p class="wallet-note" data-legal-core-field="price-note">${escapeHtml(legal.priceNote || "AllocaFi records public wallet metadata, asset history, and classifications only. It never stores private keys, seed phrases, or recovery phrases.")}</p>
          </section>
          <section class="vba-detail-panel">
            <div class="vba-detail-section-head"><div><span>Account tools</span><h3>Quick actions</h3></div></div>
            <div class="vba-detail-action-grid asset-detail-action-grid">
              <button class="secondary-button vba-detail-action asset-account-receive" data-asset-account-id="${actionId}" type="button">${getWalletActionIcon("receive")}<span>Receive</span></button>
              <button class="primary-button vba-detail-action asset-account-send" data-asset-account-id="${actionId}" type="button">${getWalletActionIcon("send")}<span>Send</span></button>
              <button class="secondary-button vba-detail-action asset-account-timeline" data-asset-account-id="${actionId}" type="button">${getWalletActionIcon("view")}<span>View Timeline</span></button>
              <button class="secondary-button vba-detail-action asset-account-acquisitions" data-asset-account-id="${actionId}" type="button">${getWalletActionIcon("receive")}<span>View Acquisitions</span></button>
              <button class="secondary-button vba-detail-action asset-account-transfers" data-asset-account-id="${actionId}" type="button">${getWalletActionIcon("move")}<span>View Transfers</span></button>
              <button class="secondary-button vba-detail-action asset-account-disposals" data-asset-account-id="${actionId}" type="button">${getWalletActionIcon("send")}<span>View Disposals</span></button>
              <button class="secondary-button vba-detail-action asset-account-legal" data-asset-account-id="${actionId}" type="button">${getWalletActionIcon("rules")}<span>View Legal Core Records</span></button>
              <button class="secondary-button vba-detail-action asset-account-tax" data-asset-account-id="${actionId}" type="button">${getWalletActionIcon("spend")}<span>View Tax Ledger Records</span></button>
              <button class="secondary-button vba-detail-action asset-account-export" data-asset-account-id="${actionId}" type="button">${getWalletActionIcon("layers")}<span>Export Records</span></button>
              <button class="secondary-button vba-detail-action asset-account-rename" data-asset-account-id="${actionId}" type="button">${getWalletActionIcon("edit")}<span>Rename Account</span></button>
              <button class="danger-button vba-detail-action asset-account-archive" data-asset-account-id="${actionId}" type="button">${getWalletActionIcon("remove")}<span>Archive Account</span></button>
            </div>
          </section>
        </aside>
      </section>
    </div>
  `);
  bindVirtualAssetAccountControls(dialogContent);
  ensureLegalCoreHistoricalPrice(account.id);
}

function openCreateAssetAccountDialog() {
  if (!canUseReserveAssetAccounts()) {
    showToast("AllocaFi Core unlocks Reserve Asset Accounts");
    openSubscriptionCheckout("premium");
    return;
  }
  openDialog(`
    <div class="dialog-content">
      <h2>Create Asset Account</h2>
      <p class="wallet-note">Create a non-custodial organizational account for reserve assets. AllocaFi stores metadata only.</p>
      <div class="send-grid">
        <label>Account name<input id="assetAccountName" maxlength="48" placeholder="Bitcoin Reserve" /></label>
        <label>Asset<select id="assetAccountAsset">${SUPPORTED_RESERVE_ASSETS.map((asset) => `<option value="${asset}">${asset} - ${escapeHtml(getReserveAssetMeta(asset).name)}</option>`).join("")}</select></label>
        <label>Quantity<input id="assetAccountQuantity" type="number" min="0" step="0.00000001" placeholder="0.00" /></label>
        <label>Cost basis USD<input id="assetAccountCostBasis" type="number" min="0" step="0.01" placeholder="0.00" /></label>
        <label>Acquisition date<input id="assetAccountAcquired" type="date" /></label>
      </div>
      <div class="dialog-actions"><button id="saveAssetAccount" class="primary-button" type="button">Save Asset Account</button></div>
    </div>
  `);
  dialogContent.querySelector("#saveAssetAccount").addEventListener("click", () => {
    const asset = dialogContent.querySelector("#assetAccountAsset").value;
    const meta = getReserveAssetMeta(asset);
    const quantity = Number(dialogContent.querySelector("#assetAccountQuantity").value || 0);
    const costBasis = Number(dialogContent.querySelector("#assetAccountCostBasis").value || 0);
    const acquisitionDate = dialogContent.querySelector("#assetAccountAcquired").value
      ? new Date(`${dialogContent.querySelector("#assetAccountAcquired").value}T12:00:00`).toISOString()
      : new Date().toISOString();
    const account = {
      id: crypto.randomUUID(),
      name: dialogContent.querySelector("#assetAccountName").value.trim() || meta.defaultAccountName,
      asset,
      accountType: "reserve",
      quantity,
      costBasis,
      costBasisSource: costBasis > 0 ? "user_entered_cost_basis" : "",
      acquisitionDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      legalStatus: quantity > 0 ? (costBasis > 0 ? "Legal Core Verified" : "Cost Basis Needed") : "Tracking Ready",
    };
    virtualAssetAccountState.customAccounts.unshift(account);
    saveVirtualAssetAccountState(virtualAssetAccountState);
    saveLegalCoreAssetRecords(syncLegalCoreAssetRecords());
    saveTaxLedgerAssetRecords(buildTaxLedgerAssetRecords());
    render();
    walletDialog.close();
    showToast("Virtual Asset Account created");
  });
}

function openAssetAccountReceiveDialog(accountId) {
  const account = getVirtualAssetAccountById(accountId);
  if (!account) return;
  const sourceWallet = getVirtualAssetSourceWallet(account);
  if (sourceWallet) {
    openReceiveDialog(sourceWallet.id);
    return;
  }
  openDialog(`
    <div class="dialog-content">
      <h2>Receive ${escapeHtml(account.asset)}</h2>
      <p class="wallet-note">Link or add a public ${escapeHtml(account.meta.name)} wallet address to receive into this non-custodial Asset Account.</p>
      <div class="dialog-actions">
        <button class="primary-button" type="button" id="assetReceiveAddWallet">Add Wallet Address</button>
      </div>
      <p class="form-note">AllocaFi does not custody funds. Receive addresses come from your external wallet.</p>
    </div>
  `);
  dialogContent.querySelector("#assetReceiveAddWallet").addEventListener("click", openStablecoinAddressEntry);
}

function openAssetAccountSendDialog(accountId) {
  const account = getVirtualAssetAccountById(accountId);
  if (!account) return;
  const sourceWallet = getVirtualAssetSourceWallet(account);
  openDialog(`
    <div class="dialog-content">
      <h2>Send from ${escapeHtml(account.name)}</h2>
      <p class="wallet-note">Sending is available only inside Asset Accounts and always requires external wallet signature approval.</p>
      <div class="send-limit-banner"><span>Available balance</span><strong>${escapeHtml(formatAssetQuantity(account.quantity, account.asset))}</strong></div>
      <div class="send-grid">
        <label>Destination type<select id="assetSendDestinationType"><option value="wallet transfer">Wallet Transfer</option><option value="exchange deposit">Exchange Deposit</option><option value="dex swap">DEX Swap</option><option value="stablecoin conversion">Stablecoin Conversion</option><option value="unknown destination">Unknown Destination</option></select></label>
        <label>Destination wallet<input id="assetSendDestination" spellcheck="false" placeholder="External wallet address" /></label>
        <label>Amount<input id="assetSendAmount" type="number" min="0" step="0.00000001" placeholder="0.00" /></label>
      </div>
      <div class="dialog-actions">
        <button class="primary-button" id="prepareAssetSend" type="button">Review Wallet Signature</button>
        ${sourceWallet && NETWORKS[sourceWallet.network]?.kind === "evm-native" ? `<button class="secondary-button" id="openNativeWalletSend" type="button">Open Connected Wallet Send</button>` : ""}
      </div>
      <div id="assetSendStatus" class="send-status">Ready. AllocaFi will classify the transaction before your wallet signs.</div>
      <p class="form-note">Supported provider route: Phantom, Trust Wallet, WalletConnect, and Coinbase Wallet. No private keys or seed phrases are stored.</p>
    </div>
  `);
  const prepare = () => {
    const destinationType = dialogContent.querySelector("#assetSendDestinationType").value;
    const destination = dialogContent.querySelector("#assetSendDestination").value.trim();
    const amount = Number(dialogContent.querySelector("#assetSendAmount").value || 0);
    if (!destination) {
      setSendStatus("Enter a destination wallet.", "error");
      return false;
    }
    if (amount <= 0 || amount > Number(account.quantity || 0)) {
      setSendStatus("Enter an amount within this Asset Account balance.", "error");
      return false;
    }
    const classification = classifyAssetTransaction({ destinationType, destination, amount, asset: account.asset });
    if (!confirmWalletRequestSafety("transaction", `This will request a wallet-signed ${account.asset} transfer of ${amount} from ${account.name}. Legal Core classification: ${classification.classification}.`)) return false;
    const nextRecord = {
      id: crypto.randomUUID(),
      accountId: account.id,
      asset: account.asset,
      amount,
      destination,
      destinationType,
      classification: classification.classification,
      legalCoreStatus: classification.legalCoreStatus,
      disposalStatus: classification.disposalStatus,
      createdAt: new Date().toISOString(),
    };
    legalCoreAssetRecords = [nextRecord, ...syncLegalCoreAssetRecords()];
    saveLegalCoreAssetRecords(legalCoreAssetRecords);
    saveTaxLedgerAssetRecords(buildTaxLedgerAssetRecords());
    dialogContent.querySelector("#assetSendStatus").textContent = `Prepared for external wallet signature. ${classification.classification}: ${classification.legalCoreStatus}.`;
    dialogContent.querySelector("#assetSendStatus").className = "send-status loading";
    showToast("Legal Core classification prepared");
    return true;
  };
  dialogContent.querySelector("#prepareAssetSend").addEventListener("click", prepare);
  dialogContent.querySelector("#openNativeWalletSend")?.addEventListener("click", () => {
    if (prepare() && sourceWallet) openSendDialog(sourceWallet.id);
  });
}

function openAssetAccountRecordsDialog(accountId, mode = "timeline") {
  if (!canUseLegalCoreAddOns()) {
    showToast("AllocaFi Core unlocks Legal Core records");
    openSubscriptionCheckout("premium");
    return;
  }
  const account = getVirtualAssetAccountById(accountId);
  if (!account) return;
  const legal = buildLegalCoreRecordForAccount(account);
  const timeline = getAssetAccountTimeline(account);
  const taxRecords = buildTaxLedgerAssetRecords([account]);
  const rows = mode === "legal"
    ? Object.entries(legal).map(([key, value]) => ({ label: key, value: typeof value === "object" ? JSON.stringify(value) : String(value) }))
    : mode === "tax"
      ? taxRecords.flatMap((record) => Object.entries(record).map(([key, value]) => ({ label: key, value: typeof value === "object" ? JSON.stringify(value) : String(value) })))
      : timeline.map((item) => ({ label: item.type, value: `${item.title} | ${item.detail}` }));
  openDialog(`
    <div class="dialog-content wide-dialog">
      <h2>${escapeHtml(account.name)} ${escapeHtml(mode === "legal" ? "Legal Core Records" : mode === "tax" ? "Tax Ledger Records" : "Timeline")}</h2>
      <div class="overview-list scroll-list">
        ${rows.map((row) => `<div class="overview-row compact"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.value)}</strong></div>`).join("")}
      </div>
    </div>
  `);
  ensureLegalCoreHistoricalPrice(account.id);
}

function exportAssetAccountRecords(accountId) {
  const account = getVirtualAssetAccountById(accountId);
  if (!account) return;
  const payload = {
    account,
    legalCore: buildLegalCoreRecordForAccount(account),
    taxLedger: buildTaxLedgerAssetRecords([account]),
    vaultExportStructure: buildVaultAssetExportStructure(),
    exportedAt: new Date().toISOString(),
  };
  downloadJson(`allocafi-${account.asset.toLowerCase()}-asset-account-records.json`, payload);
  addVaultActivity(`Asset account export created: ${account.name}`);
  showToast("Asset Account records exported");
}

function renameVirtualAssetAccount(accountId) {
  const account = getVirtualAssetAccountById(accountId);
  if (!account) return;
  const name = window.prompt("Rename Asset Account", account.name);
  if (!name?.trim()) return;
  virtualAssetAccountState.accountOverrides = virtualAssetAccountState.accountOverrides || {};
  virtualAssetAccountState.accountOverrides[accountId] = { ...(virtualAssetAccountState.accountOverrides[accountId] || {}), name: name.trim() };
  saveVirtualAssetAccountState(virtualAssetAccountState);
  render();
  walletDialog.close();
  showToast("Asset Account renamed");
}

function archiveVirtualAssetAccount(accountId) {
  const account = getVirtualAssetAccountById(accountId);
  if (!account || !window.confirm(`Archive ${account.name}? This only hides the organizational account and never moves assets.`)) return;
  virtualAssetAccountState.accountOverrides = virtualAssetAccountState.accountOverrides || {};
  virtualAssetAccountState.accountOverrides[accountId] = { ...(virtualAssetAccountState.accountOverrides[accountId] || {}), archived: true };
  saveVirtualAssetAccountState(virtualAssetAccountState);
  render();
  walletDialog.close();
  showToast("Asset Account archived");
}
function openBucketDetailDialog(walletId, bucketId) {
  const wallet = wallets.find((item) => item.id === walletId);
  const bucket = wallet?.allocation?.buckets?.find((item) => item.id === bucketId);
  if (!wallet || !bucket) return;

  const allocated = Number(bucket.allocated || 0);
  const spent = Number(bucket.spent || 0);
  const left = Math.max(allocated - spent, 0);
  const usedPercent = allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0;
  const rules = bucket.rules || {};
  const network = NETWORKS[wallet.network] || {};
  const assetLabel = network.asset || getWalletAssetLabel(wallet);
  const categoryType = getBucketCategoryType(bucket.name);
  const usedLabel = `${usedPercent.toFixed(0)}%`;
  const healthLabel = allocated <= 0 ? "Ready" : usedPercent >= 95 ? "Needs refill" : usedPercent >= 75 ? "Watch" : "Healthy";
  const transactions = (wallet.allocation?.transactions || [])
    .filter((tx) => tx.bucketId === bucket.id || tx.bucketName?.includes(bucket.name))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 12);
  const rulesText = [
    Number(rules.minimum || 0) > 0 ? `Minimum ${formatUsd(rules.minimum)}` : "",
    Number(rules.warning || 0) > 0 ? `Warning ${formatUsd(rules.warning)}` : "",
    Number(rules.refill || 0) > 0 ? `Refill ${formatUsd(rules.refill)}` : "",
    rules.reset && rules.reset !== "never" ? `Reset ${rules.reset}` : "",
    rules.protected ? "Protected" : "",
  ].filter(Boolean);
  const billSubaccounts = normalizeSubaccounts(bucket.subaccounts || []);
  const monthlyBillTotal = getMonthlyBillTotal(bucket);
  const progressWidth = Math.max(0, Math.min(usedPercent, 100)).toFixed(1);
  const metricItems = [
    ["Allocated", renderMoneyValue(allocated, { compactAt: 1_000_000, label: `${bucket.name} allocated` }), `${Number(bucket.percent || 0).toFixed(0)}% of wallet plan`],
    ["Spent", renderMoneyValue(spent, { compactAt: 1_000_000, label: `${bucket.name} spent` }), `${usedLabel} used`],
    ["Rules", rulesText.length ? `${rulesText.length} active` : "None yet", rules.protected ? "Protected warnings on" : "Local account guardrails"],
  ];
  const actionButtons = [
    `<button class="primary-button vba-detail-action detail-spend" type="button">${getWalletActionIcon("spend")}<span>Record Spend</span></button>`,
    `<button class="secondary-button vba-detail-action detail-move" type="button">${getWalletActionIcon("move")}<span>Move Money</span></button>`,
    `<button class="secondary-button vba-detail-action detail-rules" type="button">${getWalletActionIcon("rules")}<span>Rules</span></button>`,
    isBillsBucket(bucket) ? `<button class="secondary-button vba-detail-action detail-bills" type="button">${getWalletActionIcon("bills")}<span>Edit Bills</span></button>` : "",
    isSendCapableWallet(wallet) && canSendFromVirtualBucketAccounts() ? `<button class="secondary-button vba-detail-action detail-send" type="button">${getWalletActionIcon("send")}<span>Send from Budget Account</span></button>` : "",
  ].filter(Boolean);

  openDialog(`
    <div class="dialog-content wide-dialog vba-detail-modal">
      <section class="vba-detail-hero">
        <span class="vba-detail-icon">${getBucketCategoryIcon(categoryType)}</span>
        <div class="vba-detail-heading">
          <span class="vba-detail-kicker">Virtual Budget Account</span>
          <h2>${escapeHtml(bucket.name)}</h2>
          <div class="vba-detail-tags">
            <span>${escapeHtml(getWalletAssetLabel(wallet))}</span>
            <span>${escapeHtml(wallet.name)}</span>
            <span>${escapeHtml(shortAddress(wallet.address))}</span>
          </div>
        </div>
        <aside class="vba-detail-balance">
          <span class="account-coin-stack vba-detail-coin">${getVbaBalanceIcon(assetLabel)}</span>
          <small>Available</small>
          <strong>${renderMoneyValue(left, { compactAt: 1_000_000, label: `${bucket.name} available balance` })}</strong>
          <em>${escapeHtml(healthLabel)}</em>
        </aside>
      </section>

      <section class="vba-detail-meter-card" style="--vba-used:${progressWidth}%">
        <div>
          <span>Spent this cycle</span>
          <strong>${renderMoneyValue(spent, { compactAt: 1_000_000, label: `${bucket.name} spent this cycle` })}</strong>
        </div>
        <div>
          <span>Remaining from allocation</span>
          <strong>${renderMoneyValue(left, { compactAt: 1_000_000, label: `${bucket.name} remaining allocation` })}</strong>
        </div>
        <div>
          <span>Utilization</span>
          <strong>${usedLabel}</strong>
        </div>
        <div class="vba-detail-track"><span></span></div>
      </section>

      <section class="vba-detail-metric-strip" aria-label="Budget account summary">
        ${metricItems.map(([label, value, detail]) => `
          <article>
            <span>${escapeHtml(label)}</span>
            <strong>${label === "Rules" ? escapeHtml(value) : value}</strong>
            <small>${escapeHtml(detail)}</small>
          </article>
        `).join("")}
      </section>

      <section class="vba-detail-workspace">
        <section class="vba-detail-panel vba-detail-activity">
          <div class="vba-detail-section-head">
            <div>
              <span>Transaction history</span>
              <h3>Recent activity</h3>
            </div>
            <strong>${transactions.length ? `${transactions.length} shown` : "No entries"}</strong>
          </div>
          ${transactions.length ? `
            <div class="vba-activity-list">
              ${transactions.map((tx) => {
                const title = getTransactionDisplayTitle(tx);
                const meta = getTransactionDisplayMeta(tx);
                const timestamp = tx.createdAt ? new Date(tx.createdAt) : null;
                const dateLabel = timestamp && Number.isFinite(timestamp.getTime()) ? timestamp.toLocaleString() : "Recent";
                return `
                  <div class="vba-activity-row">
                    <span class="vba-activity-icon">${getWalletActionIcon(tx.type?.includes("send") ? "send" : "spend")}</span>
                    <div>
                      <strong>${escapeHtml(title)}</strong>
                      <small>${escapeHtml(dateLabel)}${meta ? ` ï¿½ ${escapeHtml(meta)}` : ""}</small>
                    </div>
                    <b>${renderMoneyValue(Number(tx.amount || 0), { compactAt: 1_000_000, label: `${title} amount` })}</b>
                  </div>
                `;
              }).join("")}
            </div>
          ` : `
            <div class="vba-detail-empty">
              <strong>No activity recorded yet</strong>
              <span>Spend, transfers, and budget account releases will appear here first.</span>
            </div>
          `}
        </section>

        <aside class="vba-detail-side">
          <section class="vba-detail-panel">
            <div class="vba-detail-section-head">
              <div>
                <span>Controls</span>
                <h3>Rules</h3>
              </div>
              <strong>${rulesText.length ? "Active" : "Open"}</strong>
            </div>
            ${rulesText.length ? `<div class="rule-list">${rulesText.map((rule) => `<span class="rule-pill">${escapeHtml(rule)}</span>`).join("")}</div>` : `<p class="wallet-note">No custom rules yet.</p>`}
          </section>

          ${isBillsBucket(bucket) ? `
            <section class="vba-detail-panel">
              <div class="vba-detail-section-head">
                <div>
                  <span>Bill planning</span>
                  <h3>Scheduled needs</h3>
                </div>
                <strong>${renderMoneyValue(monthlyBillTotal, { compactAt: 1_000_000, label: `${bucket.name} monthly bill goal` })}</strong>
              </div>
              <div class="vba-detail-mini-stats">
                <span><small>Monthly goal</small><b>${renderMoneyValue(monthlyBillTotal, { compactAt: 1_000_000, label: `${bucket.name} monthly bill goal` })}</b></span>
                <span><small>Weekly target</small><b>${renderMoneyValue(monthlyBillTotal / 4, { compactAt: 1_000_000, label: `${bucket.name} weekly bill target` })}</b></span>
              </div>
              ${billSubaccounts.length ? `
                <div class="vba-detail-bill-list">
                  ${billSubaccounts.map((bill) => `
                    <div>
                      <span><strong>${escapeHtml(bill.name)}</strong><small>${escapeHtml(getBillDueText(bill))}</small></span>
                      <b>${renderMoneyValue(bill.required, { compactAt: 1_000_000, label: `${bill.name} bill amount` })}</b>
                    </div>
                  `).join("")}
                </div>
              ` : `<p class="wallet-note">No bills added yet.</p>`}
            </section>
          ` : ""}

          <section class="vba-detail-panel">
            <div class="vba-detail-section-head">
              <div>
                <span>Account tools</span>
                <h3>Quick actions</h3>
              </div>
            </div>
            <div class="vba-detail-action-grid">
              ${actionButtons.join("")}
            </div>
          </section>
        </aside>
      </section>
    </div>
  `);

  dialogContent.querySelector(".detail-spend").addEventListener("click", () => openSpendDialog(wallet.id, bucket.id));
  dialogContent.querySelector(".detail-move").addEventListener("click", () => openMoveMoneyDialog(bucket.id));
  dialogContent.querySelector(".detail-rules").addEventListener("click", () => openBucketRulesDialog(wallet.id, bucket.id));
  dialogContent.querySelector(".detail-bills")?.addEventListener("click", () => openBillsPlannerDialog(wallet.id, bucket.id));
  dialogContent.querySelector(".detail-send")?.addEventListener("click", () => openSendDialog(wallet.id, bucket.id));
}

function openEditBucketDialog(walletId, bucketId) {
  const wallet = wallets.find((item) => item.id === walletId);
  const bucket = wallet?.allocation?.buckets?.find((item) => item.id === bucketId);
  if (!wallet || !bucket) return;

  openDialog(`
    <div class="dialog-content">
      <h2>Customize Budget Account</h2>
      <p class="wallet-note">Change this budget account's name and allocation share for ${escapeHtml(wallet.name)}. Use Customize Budget Accounts from Auto Allocate when you want to rebuild the full plan.</p>
      <div class="send-grid">
        <label>
          Budget account name
          <input id="editBucketName" maxlength="40" value="${escapeHtml(bucket.name)}" />
        </label>
        <label>
          Allocation percent
          <input id="editBucketPercent" type="number" min="0" max="100" step="1" value="${Number(bucket.percent || 0)}" />
        </label>
      </div>
      <div class="dialog-actions">
        <button class="primary-button" id="saveBucketEdit" type="button">Save Budget Account</button>
      </div>
    </div>
  `);

  dialogContent.querySelector("#saveBucketEdit").addEventListener("click", () => {
    const name = dialogContent.querySelector("#editBucketName").value.trim();
    const percent = Number(dialogContent.querySelector("#editBucketPercent").value || 0);
    if (!name) {
      showToast("Add a budget account name");
      return;
    }
    bucket.name = name;
    bucket.percent = percent;
    saveWallets();
    render();
    walletDialog.close();
    showToast("Budget account updated");
  });
}

function saveBucketRules(walletId, bucketId) {
  const wallet = wallets.find((item) => item.id === walletId);
  const bucket = wallet?.allocation?.buckets?.find((item) => item.id === bucketId);
  if (!bucket) return;

  bucket.rules = {
    minimum: Number(dialogContent.querySelector("#ruleMinimum").value || 0),
    warning: Number(dialogContent.querySelector("#ruleWarning").value || 0),
    refill: Number(dialogContent.querySelector("#ruleRefill").value || 0),
    reset: dialogContent.querySelector("#ruleReset").value,
    protected: dialogContent.querySelector("#ruleProtected").checked,
    lastReset: dialogContent.querySelector("#ruleLastReset").value
      ? new Date(`${dialogContent.querySelector("#ruleLastReset").value}T00:00:00`).toISOString()
      : bucket.rules?.lastReset || "",
    updatedAt: new Date().toISOString(),
  };

  saveWallets();
  render();
  walletDialog.close();
  showToast("Budget account rules saved");
}

function saveSpend(walletId, usePending) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet?.allocation?.buckets?.length) return;
  const bucketId = dialogContent.querySelector("#spendBucket").value;
  const amount = Number(dialogContent.querySelector("#spendAmount").value || 0);
  const note = dialogContent.querySelector("#spendNote").value.trim();
  if (bucketId === PERSONAL_LIQUIDATION_ACTION) {
    savePersonalLiquidation(walletId);
    return;
  }
  if (!bucketId) {
    showToast("Choose a budget account or Personal liquidation");
    return;
  }
  if (amount <= 0) {
    showToast("Enter a spend amount");
    return;
  }

  const bucket = wallet.allocation.buckets.find((item) => item.id === bucketId);
  if (!bucket) return;
  if (bucket.rules?.protected && !window.confirm(`${bucket.name} is protected. Record this spend anyway?`)) return;
  bucket.spent = Number(bucket.spent || 0) + amount;
  wallet.allocation.transactions = wallet.allocation.transactions || [];
  wallet.allocation.transactions.unshift({
    id: crypto.randomUUID(),
    bucketId,
    bucketName: bucket.name,
    amount,
    note,
    createdAt: new Date().toISOString(),
  });

  if (usePending) {
    wallet.allocation.pendingSpend = Math.max(Number(wallet.allocation.pendingSpend || 0) - amount, 0);
  }

  clampWalletPendingIncrease(wallet);
  saveWallets();
  render();
  walletDialog.close();
  showToast(`Recorded ${formatUsd(amount)} for ${bucket.name}`);
}

function getBucketRebalanceWeights(buckets) {
  const weights = buckets.map((bucket) => Math.max(Number(bucket.percent || 0), 0));
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  if (weightTotal > 0) return { weights, weightTotal };
  return {
    weights: buckets.map(() => 1),
    weightTotal: buckets.length || 1,
  };
}

function rebalanceWalletBucketsToCurrentBalance(wallet) {
  const buckets = wallet.allocation?.buckets || [];
  if (!buckets.length) return;

  const currentValue = Math.max(getWalletDisplayValue(wallet), 0);
  const { weights, weightTotal } = getBucketRebalanceWeights(buckets);
  let assigned = 0;

  buckets.forEach((bucket, index) => {
    const amount = currentValue <= 0.01
      ? 0
      : index === buckets.length - 1
        ? Math.max(currentValue - assigned, 0)
        : currentValue * (weights[index] / weightTotal);

    bucket.allocated = amount;
    bucket.spent = 0;
    assigned += amount;
  });

  wallet.allocation.pendingIncrease = 0;
  wallet.allocation.pendingSpend = 0;
  wallet.allocation.lastValue = currentValue;
  wallet.allocation.updatedAt = new Date().toISOString();
}

function savePersonalLiquidation(walletId) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet?.allocation?.buckets?.length) return;

  const currentValue = Math.max(getWalletDisplayValue(wallet), 0);
  const pendingSpend = Number(wallet.allocation.pendingSpend || 0);
  const note = dialogContent.querySelector("#spendNote")?.value.trim() || "Personal liquidation";
  const message = currentValue <= 0.01
    ? "This will set every Virtual Budget Account for this wallet to $0 and keep your template for next time. Continue?"
    : `This will rebalance this wallet's Virtual Budget Accounts to the current wallet balance of ${formatUsd(currentValue)} using your saved template. Continue?`;

  if (!window.confirm(message)) return;

  wallet.allocation.transactions = wallet.allocation.transactions || [];
  wallet.allocation.transactions.unshift({
    id: crypto.randomUUID(),
    type: "personal-liquidation",
    bucketName: "Personal liquidation",
    amount: pendingSpend,
    note,
    createdAt: new Date().toISOString(),
  });

  rebalanceWalletBucketsToCurrentBalance(wallet);
  saveWallets();
  render();
  walletDialog.close();
  showToast(currentValue <= 0.01 ? "Wallet budget accounts reset to $0" : "Wallet budget accounts rebalanced");
}

function refreshVirtualAccounts(walletId) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet?.allocation?.buckets?.length) {
    showToast("Create Virtual Budget Accounts first");
    return;
  }

  rebalanceWalletBucketsToCurrentBalance(wallet);
  saveWallets();
  render();
  showToast(`VBAs refreshed to ${formatUsd(getWalletDisplayValue(wallet))}`);
}

function refreshAllVirtualAccounts() {
  const targetWallets = getSupportedWallets().filter((wallet) => wallet.allocation?.buckets?.length);
  if (!targetWallets.length) {
    showToast("Create Virtual Budget Accounts first");
    return;
  }

  targetWallets.forEach((wallet) => rebalanceWalletBucketsToCurrentBalance(wallet));
  saveWallets();
  render();
  showToast("All VBAs refreshed to current wallet balances");
}

function allocateAmountToWalletBuckets(wallet, amount, allocationMode = wallet?.allocation?.autoMode || "rules") {
  if (!wallet?.allocation?.buckets?.length) return { allocated: 0, fundedThisRound: [] };
  const amountToAllocate = Math.max(Number(amount || 0), 0);
  if (amountToAllocate <= 0.01) return { allocated: 0, fundedThisRound: [] };

  let remaining = amountToAllocate;
  const fundedThisRound = [];
  wallet.allocation.buckets.forEach((bucket) => {
    const target = getBucketFundingTarget(bucket);
    if (target <= 0) return;
    const needed = Math.max(target - getBucketBalance(bucket), 0);
    if (needed <= 0.01 || remaining <= 0.01) return;
    const amountNeeded = Math.min(needed, remaining);
    bucket.allocated = Number(bucket.allocated || 0) + amountNeeded;
    remaining -= amountNeeded;
    fundedThisRound.push(`${bucket.name} ${formatUsd(amountNeeded)}`);
  });

  const targetBuckets = wallet.allocation.buckets;
  const rawWeightTotal = targetBuckets.reduce((sum, bucket) => sum + getAutoAllocationWeight(bucket, allocationMode), 0);
  const bucketWeights = targetBuckets.map((bucket) => rawWeightTotal > 0 ? getAutoAllocationWeight(bucket, allocationMode) : 1);
  const weightTotal = bucketWeights.reduce((sum, weight) => sum + weight, 0) || 1;
  const flexibleAmount = remaining;
  let distributed = 0;
  targetBuckets.forEach((bucket, index) => {
    if (flexibleAmount <= 0.01) return;
    const amountForBucket = index === targetBuckets.length - 1
      ? Math.max(flexibleAmount - distributed, 0)
      : flexibleAmount * (bucketWeights[index] / weightTotal);
    bucket.allocated = Number(bucket.allocated || 0) + amountForBucket;
    distributed += amountForBucket;
  });

  return { allocated: amountToAllocate, fundedThisRound };
}

function recordAutomaticAllocation(wallet, amount, source = "Detected wallet deposit") {
  if (!wallet?.allocation) return;
  const network = NETWORKS[wallet.network] || {};
  const safeAmount = Number(amount || 0);
  wallet.allocation.transactions = wallet.allocation.transactions || [];
  wallet.allocation.transactions.unshift({
    id: crypto.randomUUID(),
    type: "auto-allocation",
    receiptType: "money-in-auto",
    bucketName: "Money In",
    amount: safeAmount,
    displayTitle: "Money In - Auto",
    note: "Incoming wallet value captured from the tracked wallet address.",
    sourceLabel: source || "Detected wallet deposit",
    walletName: wallet.name,
    walletAddress: wallet.address,
    network: network.label || wallet.network || "Tracked network",
    asset: network.asset || "Asset",
    status: "Wallet balance recorded",
    createdAt: new Date().toISOString(),
  });
}

function allocatePendingFunds(walletId) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet?.allocation?.buckets?.length) return;
  const assignable = getWalletAssignableAmount(wallet);
  const pendingIncrease = Number(wallet.allocation.pendingIncrease || 0);
  const amountToAllocate = pendingIncrease > 0.01 ? Math.min(pendingIncrease, assignable) : assignable;
  if (amountToAllocate <= 0.01) {
    wallet.allocation.pendingIncrease = 0;
    wallet.allocation.lastValue = getWalletDisplayValue(wallet);
    wallet.allocation.updatedAt = new Date().toISOString();
    saveWallets();
    render();
    showToast("Wallet is already balanced");
    return;
  }

  const allocationMode = wallet.allocation?.autoMode || "rules";
  const { fundedThisRound } = allocateAmountToWalletBuckets(wallet, amountToAllocate, allocationMode);
  recordAutomaticAllocation(wallet, amountToAllocate, "Detected wallet deposit");

  wallet.allocation.pendingIncrease = 0;
  wallet.allocation.lastValue = getWalletDisplayValue(wallet);
  wallet.allocation.updatedAt = new Date().toISOString();
  saveWallets();
  render();
  showToast(fundedThisRound.length ? "Money in recorded and organized" : "Money in recorded");
}

function removeBucketWithReallocation(walletId, bucketId) {
  const wallet = wallets.find((item) => item.id === walletId);
  const buckets = wallet?.allocation?.buckets || [];
  const bucket = buckets.find((item) => item.id === bucketId);
  if (!wallet || !bucket) return;

  const balance = getBucketBalance(bucket);
  const remainingBuckets = buckets.filter((item) => item.id !== bucketId);
  const hasFunds = balance > 0.01;
  const message = hasFunds && remainingBuckets.length
    ? `Remove ${bucket.name} and reallocate ${formatUsd(balance)} to the remaining Virtual Budget Accounts by the saved template?`
    : hasFunds
      ? `Remove ${bucket.name}? ${formatUsd(balance)} will become unallocated wallet value until you create another Virtual Budget Account.`
      : `Remove empty ${bucket.name} Virtual Budget Account?`;
  if (!window.confirm(message)) return;

  if (hasFunds && remainingBuckets.length) {
    const { weights, weightTotal } = getBucketRebalanceWeights(remainingBuckets);
    let distributed = 0;
    remainingBuckets.forEach((targetBucket, index) => {
      const amountForBucket = index === remainingBuckets.length - 1
        ? Math.max(balance - distributed, 0)
        : balance * (weights[index] / weightTotal);
      targetBucket.allocated = Number(targetBucket.allocated || 0) + amountForBucket;
      distributed += amountForBucket;
    });
  }

  wallet.allocation.buckets = remainingBuckets;
  wallet.allocation.pendingIncrease = remainingBuckets.length
    ? 0
    : Math.max(getWalletDisplayValue(wallet), 0);
  wallet.allocation.transactions = wallet.allocation.transactions || [];
  wallet.allocation.transactions.unshift({
    id: crypto.randomUUID(),
    type: "bucket-removed-reallocated",
    bucketName: bucket.name,
    amount: balance,
    displayTitle: `${bucket.name} Removed + Reallocated`,
    note: hasFunds && remainingBuckets.length
      ? `${formatUsd(balance)} reallocated to remaining Virtual Budget Accounts.`
      : "Removed from the local AllocaFi budget layer. No crypto moved.",
    createdAt: new Date().toISOString(),
  });
  wallet.allocation.lastValue = getWalletDisplayValue(wallet);
  wallet.allocation.updatedAt = new Date().toISOString();
  saveWallets();
  render();
  showToast(hasFunds && remainingBuckets.length ? "VBA removed and funds reallocated" : "VBA removed");
}

function applyBucketReset(walletId, bucketId) {
  const wallet = wallets.find((item) => item.id === walletId);
  const bucket = wallet?.allocation?.buckets?.find((item) => item.id === bucketId);
  if (!wallet || !bucket) return;

  const rules = bucket.rules || {};
  const allocated = Number(bucket.allocated || 0);
  const spent = Number(bucket.spent || 0);
  const currentBalance = Math.max(allocated - spent, 0);
  const target = Number(rules.refill || allocated || 0);
  const refillNeeded = Math.max(target - currentBalance, 0);
  const ready = getWalletAssignableAmount(wallet);
  const refillAmount = Math.min(refillNeeded, ready);

  bucket.allocated = currentBalance;
  bucket.spent = 0;
  if (refillAmount > 0) {
    bucket.allocated = Number(bucket.allocated || 0) + refillAmount;
    wallet.allocation.pendingIncrease = Math.max(Number(wallet.allocation.pendingIncrease || 0) - refillAmount, 0);
  }
  bucket.rules = {
    ...rules,
    lastReset: new Date().toISOString(),
  };
  wallet.allocation.transactions = wallet.allocation.transactions || [];
  wallet.allocation.transactions.unshift({
    id: crypto.randomUUID(),
    type: "bucket-reset",
    bucketId: bucket.id,
    bucketName: bucket.name,
    amount: refillAmount,
    note: `Closed ${rules.reset || "scheduled"} cycle${refillAmount > 0 ? ` and refilled ${formatUsd(refillAmount)}` : ""}`,
    createdAt: new Date().toISOString(),
  });
  saveWallets();
  render();
  showToast(refillAmount > 0 ? `Reset and refilled ${formatUsd(refillAmount)}` : "Budget account reset applied");
}

function saveWalletConnectProjectId() {
  const projectId = walletConnectProjectInput?.value.trim() || "";
  if (!projectId) {
    showToast("Paste a WalletConnect Project ID first");
    return;
  }
  localStorage.setItem(WALLETCONNECT_PROJECT_KEY, projectId);
  scheduleAutoVaultSnapshot();
  showToast("WalletConnect Project ID saved");
}

function getWalletConnectRpcMap() {
  return Object.entries(EVM_CHAINS).reduce((rpcMap, [networkKey, chainHex]) => {
    if (!isSupportedNetworkKey(networkKey)) return rpcMap;
    const network = NETWORKS[networkKey];
    const chainId = Number.parseInt(chainHex, 16);
    if (network?.rpcs?.[0] && !rpcMap[chainId]) rpcMap[chainId] = network.rpcs[0];
    return rpcMap;
  }, {});
}

function getInjectedEthereumProviders() {
  const providers = [];
  if (window.ethereum?.providers?.length) providers.push(...window.ethereum.providers);
  if (window.ethereum) providers.push(window.ethereum);
  if (window.coinbaseWalletExtension) providers.push(window.coinbaseWalletExtension);
  if (window.trustwallet?.ethereum) providers.push(window.trustwallet.ethereum);
  return providers.filter((provider, index, all) =>
    provider?.request && all.findIndex((item) => item === provider) === index
  );
}

function getNamedEthereumProvider(walletType = "auto") {
  const providers = getInjectedEthereumProviders();
  if (walletType === "metamask") return providers.find((provider) => provider.isMetaMask && !provider.isCoinbaseWallet) || null;
  if (walletType === "coinbase") return providers.find((provider) => provider.isCoinbaseWallet || provider === window.coinbaseWalletExtension) || null;
  if (walletType === "trust") return providers.find((provider) => provider.isTrust || provider.isTrustWallet || provider === window.trustwallet?.ethereum) || null;
  return providers[0] || null;
}

function labelForEthereumProvider(provider, fallback = "Browser Wallet") {
  if (!provider) return fallback;
  if (provider.isCoinbaseWallet) return "Coinbase Wallet";
  if (provider.isTrust || provider.isTrustWallet || provider === window.trustwallet?.ethereum) return "Trust Wallet";
  if (provider.isMetaMask) return "MetaMask";
  return fallback;
}

function normalizeWalletError(error, fallback = "Wallet request did not complete") {
  const message = String(error?.message || "");
  if (error?.code === 4001 || /user rejected|rejected by user|user denied/i.test(message)) {
    return "Wallet request was rejected";
  }
  if (error?.code === -32002 || /already pending|request.*pending|pending request/i.test(message)) {
    return "A wallet request is already open. Finish or close it in your wallet, then try again.";
  }
  if (/timeout|timed out/i.test(message)) return message;
  return message || fallback;
}

function requestWalletWithTimeout(provider, payload, timeoutMs, timeoutMessage) {
  if (!provider?.request) throw new Error("Wallet provider is not available");
  let timeoutId = 0;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
  });
  return Promise.race([
    provider.request(payload),
    timeout,
  ]).finally(() => window.clearTimeout(timeoutId));
}

async function getEthereumAccounts(provider, label = "wallet") {
  let accounts = [];
  try {
    accounts = await requestWalletWithTimeout(
      provider,
      { method: "eth_accounts" },
      8000,
      `${label} did not return connected accounts yet. Approve the connection request and try again.`,
    );
  } catch {
    accounts = [];
  }
  if (accounts?.length) return accounts;

  setSendStatus(
    `Approve the ${label} connection popup. If you do not see the final button, scroll the wallet popup.`,
    "loading",
  );
  return requestWalletWithTimeout(
    provider,
    { method: "eth_requestAccounts" },
    WALLET_CONNECT_TIMEOUT_MS,
    `${label} connection timed out. Open the wallet popup, approve or reject the request, then try again.`,
  );
}

async function getEthereumChainId(provider) {
  try {
    return await requestWalletWithTimeout(
      provider,
      { method: "eth_chainId" },
      8000,
      "Wallet did not return the current network yet",
    );
  } catch {
    return "";
  }
}

function getWalletAvailability() {
  return {
    phantom: Boolean(getNamedSolanaProvider("phantom")),
    metamask: Boolean(getNamedEthereumProvider("metamask")),
    coinbase: Boolean(getNamedEthereumProvider("coinbase")),
    trust: Boolean(getNamedEthereumProvider("trust")),
    trustSolana: Boolean(getNamedSolanaProvider("trust")),
    injectedEvm: Boolean(getNamedEthereumProvider("auto")),
    walletConnect: Boolean(loadWalletConnectProjectId()),
  };
}

async function connectInjectedEthereumProvider(walletType = "auto") {
  const injected = getNamedEthereumProvider(walletType);
  if (!injected) {
    const labels = { metamask: "MetaMask", coinbase: "Coinbase Wallet", trust: "Trust Wallet" };
    throw new Error(`${labels[walletType] || "Browser wallet"} was not found in this browser`);
  }
  const providerLabel = labelForEthereumProvider(injected, walletType === "auto" ? "Browser Wallet" : walletType);
  const accounts = await getEthereumAccounts(injected, providerLabel);
  connectedProvider = injected;
  connectedAccount = accounts?.[0] || "";
  connectedWalletLabel = providerLabel;
  injected.on?.("accountsChanged", (accounts) => {
    connectedAccount = accounts?.[0] || "";
    updateWalletConnectionUi();
  });
  injected.on?.("disconnect", () => {
    connectedAccount = "";
    connectedProvider = null;
    connectedWalletLabel = "";
    updateWalletConnectionUi();
  });
  updateWalletConnectionUi();
  showToast(connectedAccount ? `${connectedWalletLabel} connected ${shortAddress(connectedAccount)}` : `${connectedWalletLabel} connected`);
  return connectedProvider;
}

async function connectWalletConnectProvider(label = "WalletConnect/Reown") {
  if (connectedProvider && connectedAccount && connectedWalletLabel === label) return connectedProvider;

  const projectId = loadWalletConnectProjectId();
  if (!projectId) {
    switchTab("settings");
    showToast("Add your WalletConnect Project ID in Settings");
    throw new Error("WalletConnect/Reown Project ID is required");
  }

  const { EthereumProvider } = await import(WALLETCONNECT_PROVIDER_URL);
  connectedProvider = await EthereumProvider.init({
    projectId,
    chains: [1],
    optionalChains: [...new Set(Object.values(EVM_CHAINS).map((chainHex) => Number.parseInt(chainHex, 16)))],
    rpcMap: getWalletConnectRpcMap(),
    showQrModal: true,
    metadata: {
      name: "AllocaFi",
      description: "Non-custodial Virtual Budget Accounts for stablecoin budgeting.",
      url: window.location.origin || "https://allocafi.local",
      icons: [],
    },
  });

  connectedProvider.on?.("accountsChanged", (accounts) => {
    connectedAccount = accounts?.[0] || "";
    updateWalletConnectionUi();
  });
  connectedProvider.on?.("disconnect", () => {
    connectedAccount = "";
    connectedProvider = null;
    connectedWalletLabel = "";
    updateWalletConnectionUi();
  });

  await connectedProvider.connect();
  const accounts = await connectedProvider.request({ method: "eth_accounts" });
  connectedAccount = accounts?.[0] || "";
  connectedWalletLabel = label;
  updateWalletConnectionUi();
  showToast(connectedAccount ? `${label} connected ${shortAddress(connectedAccount)}` : `${label} connected`);
  return connectedProvider;
}

async function connectWalletProvider(walletType = "auto") {
  if (connectedProvider && connectedAccount && walletType === "auto") return connectedProvider;
  if (walletType === "walletconnect" || walletType === "trust-walletconnect") {
    return connectWalletConnectProvider(walletType === "trust-walletconnect" ? "Trust Wallet" : "WalletConnect/Reown");
  }
  return connectInjectedEthereumProvider(walletType);
}

async function getEthereumProvider() {
  if (connectedProvider) return connectedProvider;
  return connectWalletProvider();
}

async function connectSelectedWalletProvider() {
  const activeWallet = wallets.find((wallet) => wallet.id === selectedWalletId) || wallets[0];
  const network = NETWORKS[activeWallet?.network];
  if (network?.kind?.startsWith("solana")) return getSolanaProvider();
  return openWalletConnectDialog();
}

function getInjectedSolanaProviders() {
  const providers = [];
  if (window.phantom?.solana) providers.push(window.phantom.solana);
  if (window.solana) providers.push(window.solana);
  if (window.trustwallet?.solana) providers.push(window.trustwallet.solana);
  if (window.solflare) providers.push(window.solflare);
  return providers.filter((provider, index, all) =>
    provider && all.findIndex((item) => item === provider) === index
  );
}

function getNamedSolanaProvider(walletType = "auto") {
  const providers = getInjectedSolanaProviders();
  if (walletType === "phantom") return providers.find((provider) => provider === window.phantom?.solana || provider.isPhantom) || null;
  if (walletType === "trust") return providers.find((provider) => provider === window.trustwallet?.solana || provider.isTrust || provider.isTrustWallet) || null;
  if (walletType === "solflare") return providers.find((provider) => provider === window.solflare || provider.isSolflare) || null;
  return providers[0] || null;
}

function findInjectedSolanaProvider() {
  return getNamedSolanaProvider("auto");
}

function getSolanaProviderLabel(provider) {
  if (!provider) return "Solana Wallet";
  if (provider === window.phantom?.solana || provider.isPhantom) return "Phantom";
  if (provider === window.trustwallet?.solana || provider.isTrust || provider.isTrustWallet) return "Trust Wallet";
  if (provider === window.solflare || provider.isSolflare) return "Solflare";
  return "Solana Wallet";
}

async function connectInjectedSolanaProvider(walletType = "auto") {
  const injected = getNamedSolanaProvider(walletType);
  if (connectedSolanaProvider && connectedSolanaProvider === injected) {
    connectedSolanaAccount = connectedSolanaAccount || connectedSolanaProvider.publicKey?.toString?.() || "";
    updateWalletConnectionUi();
    return connectedSolanaProvider;
  }

  if (injected) {
    const response = injected.connect
      ? await injected.connect()
      : await injected.request?.({ method: "connect" });
    connectedSolanaProvider = injected;
    connectedSolanaAccount = response?.publicKey?.toString?.() || injected.publicKey?.toString?.() || "";
    connectedSolanaWalletLabel = getSolanaProviderLabel(injected);
    injected.on?.("accountChanged", (publicKey) => {
      connectedSolanaAccount = publicKey?.toString?.() || injected.publicKey?.toString?.() || "";
      updateWalletConnectionUi();
    });
    injected.on?.("disconnect", () => {
      connectedSolanaAccount = "";
      connectedSolanaProvider = null;
      connectedSolanaWalletLabel = "";
      updateWalletConnectionUi();
    });
    updateWalletConnectionUi();
    showToast(connectedSolanaAccount ? `${connectedSolanaWalletLabel} connected ${shortAddress(connectedSolanaAccount)}` : `${connectedSolanaWalletLabel} connected`);
    return connectedSolanaProvider;
  }

  return null;
}

async function connectWalletConnectSolanaProvider(label = "WalletConnect/Reown") {
  if (connectedSolanaProvider && connectedSolanaAccount && connectedSolanaWalletLabel === label) return connectedSolanaProvider;

  const projectId = loadWalletConnectProjectId();
  if (!projectId) {
    switchTab("settings");
    showToast("Add your WalletConnect Project ID in Settings");
    throw new Error("WalletConnect/Reown Project ID is required for Solana mobile wallets");
  }

  const UniversalProviderModule = await import(WALLETCONNECT_UNIVERSAL_PROVIDER_URL);
  const UniversalProvider = UniversalProviderModule.default || UniversalProviderModule.UniversalProvider;
  const provider = await UniversalProvider.init({
    projectId,
    metadata: {
      name: "AllocaFi",
      description: "Non-custodial Virtual Budget Accounts for stablecoin budgeting.",
      url: window.location.origin || "https://allocafi.local",
      icons: [],
    },
  });

  await provider.connect({
    namespaces: {
      solana: {
        methods: ["solana_requestAccounts", "solana_getAccounts", "solana_signAndSendTransaction"],
        chains: ["solana:mainnetBeta"],
        events: ["accountsChanged", "disconnect"],
      },
    },
  });

  const accounts = await provider.request({
    chainId: "solana:mainnetBeta",
    method: "solana_getAccounts",
    params: {},
  });
  connectedSolanaProvider = provider;
  connectedSolanaAccount = accounts?.[0]?.pubkey || provider.session?.namespaces?.solana?.accounts?.[0]?.split(":").pop() || "";
  connectedSolanaWalletLabel = label;
  updateWalletConnectionUi();
  showToast(connectedSolanaAccount ? `${label} connected ${shortAddress(connectedSolanaAccount)}` : `${label} connected`);
  return connectedSolanaProvider;
}

async function getSolanaProvider(walletType = "auto") {
  if (connectedSolanaProvider && walletType === "auto") {
    connectedSolanaAccount = connectedSolanaAccount || connectedSolanaProvider.publicKey?.toString?.() || "";
    updateWalletConnectionUi();
    return connectedSolanaProvider;
  }
  if (walletType === "walletconnect" || walletType === "trust-walletconnect") {
    return connectWalletConnectSolanaProvider(walletType === "trust-walletconnect" ? "Trust Wallet" : "WalletConnect/Reown");
  }
  const injected = await connectInjectedSolanaProvider(walletType);
  if (injected) return injected;
  return connectWalletConnectSolanaProvider("WalletConnect/Reown");
}

function isWalletConnectSolanaProvider(provider) {
  return provider && provider !== findInjectedSolanaProvider() && typeof provider.request === "function";
}

async function sendSolanaTokenTransaction(id, bucketId = null, buttonLabel = "Send with Solana wallet") {
  const wallet = wallets.find((item) => item.id === id);
  if (!wallet) return;
  const network = NETWORKS[wallet.network];
  const recipient = cleanAddress(dialogContent.querySelector("#sendRecipient").value);
  const recipientName = dialogContent.querySelector("#sendRecipientName")?.value.trim() || "";
  const amount = dialogContent.querySelector("#sendAmount").value;

  try {
    setSendButtonLoading(true, buttonLabel);
    setSendStatus("Checking recipient and amount...", "loading");
    if (!isSolanaAddress(recipient)) throw new Error("Enter a valid Solana recipient address");
    if (Number(amount) <= 0) throw new Error("Enter an amount greater than zero");
    if ((String(amount).split(".")[1] || "").length > network.decimals) {
      throw new Error(`${network.asset} supports up to ${network.decimals} decimal places`);
    }
    validateSendAmountAgainstBalances(wallet, bucketId, amount);
    if (typeof crypto.getRandomValues !== "function") {
      throw new Error("Secure browser crypto is required. Open AllocaFi over HTTPS or use a modern browser.");
    }

    setSendStatus("Loading Solana transaction tools...", "loading");
    const [{ Connection, PublicKey, Transaction }, splToken] = await Promise.all([
      import(SOLANA_WEB3_URL),
      import(SOLANA_SPL_TOKEN_URL),
    ]);
    const {
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      TOKEN_2022_PROGRAM_ID,
      createAssociatedTokenAccountInstruction,
      createTransferCheckedInstruction,
      getAssociatedTokenAddress,
    } = splToken;

    setSendStatus("Connecting to your Solana wallet...", "loading");
    const provider = await getSolanaProvider();
    const fromAddress = connectedSolanaAccount || provider.publicKey?.toString?.();
    if (!fromAddress || fromAddress !== wallet.address) {
      throw new Error("Connected Solana wallet does not match this budget account address");
    }

    setSendStatus("Preparing token accounts and transfer...", "loading");
    const customRpc = loadSolanaRpcUrl();
    const rpcEndpoints = getSolanaRpcEndpoints(network);
    const connectionEndpoints = [...new Set([
      canUseLocalSolanaProxy()
        ? customRpc
          ? `${window.location.origin}/api/solana-rpc?endpoint=${encodeURIComponent(customRpc)}`
          : `${window.location.origin}/api/solana-rpc`
        : "",
      ...rpcEndpoints,
    ].filter(Boolean))];
    const owner = new PublicKey(fromAddress);
    const recipientOwner = new PublicKey(recipient);
    const mint = new PublicKey(network.mint);
    const tokenProgramId = network.tokenProgram === "token2022" ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;
    const sourceAta = await getAssociatedTokenAddress(mint, owner, false, tokenProgramId, ASSOCIATED_TOKEN_PROGRAM_ID);
    const destinationAta = await getAssociatedTokenAddress(mint, recipientOwner, false, tokenProgramId, ASSOCIATED_TOKEN_PROGRAM_ID);
    const instructions = [];
    let connection = null;
    let destinationInfo = null;
    let blockhash = null;
    let connectionError = null;
    for (const endpoint of connectionEndpoints) {
      try {
        connection = new Connection(endpoint, "confirmed");
        destinationInfo = await connection.getAccountInfo(destinationAta);
        blockhash = await connection.getLatestBlockhash("confirmed");
        break;
      } catch (error) {
        connectionError = error;
        connection = null;
      }
    }
    if (!connection || !blockhash) throw connectionError || new Error("Could not prepare Solana transaction");
    if (!destinationInfo) {
      instructions.push(createAssociatedTokenAccountInstruction(
        owner,
        destinationAta,
        recipientOwner,
        mint,
        tokenProgramId,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      ));
    }
    instructions.push(createTransferCheckedInstruction(
      sourceAta,
      mint,
      destinationAta,
      owner,
      tokenAmountToRaw(amount, network.decimals),
      network.decimals,
      [],
      tokenProgramId,
    ));

    const transaction = new Transaction().add(...instructions);
    transaction.feePayer = owner;
    transaction.recentBlockhash = blockhash.blockhash;

    if (!confirmWalletRequestSafety("transaction", `This will request a wallet-signed ${network.asset} transfer of ${amount} on ${network.label}.`)) throw new Error("Wallet transaction cancelled before approval");
    setSendStatus(`Opening wallet approval. Confirm in ${connectedSolanaWalletLabel || "your Solana wallet"} to submit.`, "loading");
    let signature = "";
    if (isWalletConnectSolanaProvider(provider)) {
      const serialized = transaction.serialize({ requireAllSignatures: false, verifySignatures: false });
      const result = await provider.request({
        chainId: "solana:mainnetBeta",
        method: "solana_signAndSendTransaction",
        params: {
          transaction: bytesToBase64(serialized),
          sendOptions: {
            skipPreflight: false,
            preflightCommitment: "confirmed",
            maxRetries: 3,
          },
        },
      });
      signature = result?.signature || result;
    } else if (provider.signAndSendTransaction) {
      const result = await provider.signAndSendTransaction(transaction);
      signature = result?.signature || result;
    } else if (provider.signTransaction) {
      const signed = await provider.signTransaction(transaction);
      signature = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: false, maxRetries: 3 });
    } else {
      throw new Error("Connected Solana wallet cannot send transactions from this app");
    }

    rememberRecipient(recipient, recipientName, wallet.network, bucketId);
    recordBucketSend(wallet, bucketId, Number(amount), signature, recipient);
    wallet.status = "";
    wallet.statusType = "";
    wallet.error = "";
    wallet.lastTransactionHash = signature;
    saveWallets();
    render();
    walletDialog.close();
    showToast("Solana PYUSD transaction submitted");
  } catch (error) {
    const message = error?.message || "Solana transaction was not sent";
    setSendStatus(message, "error");
    showToast(message);
  } finally {
    setSendButtonLoading(false, buttonLabel);
  }
}

async function sendNativeTransaction(id, bucketId = null, buttonLabel = "Send with wallet") {
  const wallet = wallets.find((item) => item.id === id);
  if (!wallet) return;
  const network = NETWORKS[wallet.network];
  const recipient = cleanAddress(dialogContent.querySelector("#sendRecipient").value);
  const recipientName = dialogContent.querySelector("#sendRecipientName")?.value.trim() || "";
  const amount = dialogContent.querySelector("#sendAmount").value;

  try {
    setSendButtonLoading(true, buttonLabel);
    setSendStatus("Checking recipient and amount...", "loading");
    if (!isEvmAddress(recipient)) throw new Error("Enter a valid 0x recipient address");
    if (Number(amount) <= 0) throw new Error("Enter an amount greater than zero");
    if ((String(amount).split(".")[1] || "").length > network.decimals) {
      throw new Error(`${network.asset} supports up to ${network.decimals} decimal places`);
    }
    validateSendAmountAgainstBalances(wallet, bucketId, amount);

    setSendStatus("Connecting to your Ethereum wallet...", "loading");
    const provider = await getEthereumProvider();
    const walletLabel = connectedWalletLabel || labelForEthereumProvider(provider, "wallet");
    const accounts = await getEthereumAccounts(provider, walletLabel);
    const from = accounts[0];
    connectedAccount = from || connectedAccount;
    updateWalletConnectionUi();
    if (!from || from.toLowerCase() !== wallet.address.toLowerCase()) {
      throw new Error("Connected wallet does not match this budget account address");
    }

    const chainId = EVM_CHAINS[wallet.network];
    if (chainId) {
      const currentChainId = await getEthereumChainId(provider);
      try {
        setSendStatus(`Checking ${network.label} network in ${walletLabel}...`, "loading");
        if (!currentChainId || currentChainId.toLowerCase() !== chainId.toLowerCase()) {
          await requestWalletWithTimeout(
            provider,
            {
              method: "wallet_switchEthereumChain",
              params: [{ chainId }],
            },
            WALLET_CONNECT_TIMEOUT_MS,
            `${walletLabel} network switch timed out. Approve or close the wallet popup, then try again.`,
          );
        }
      } catch (error) {
        if (error?.code === 4902) {
          throw new Error("Your wallet does not have this network added yet");
        }
        throw error;
      }
    }

    const tokenAddress = network.token || network.usdc;
    const txParams = tokenAddress
      ? {
        from,
        to: tokenAddress,
        value: "0x0",
        data: encodeErc20Transfer(recipient, amount, network.decimals),
      }
      : {
        from,
        to: recipient,
        value: cryptoToHexWei(amount, network.decimals),
      };

    if (!confirmWalletRequestSafety("transaction", `This will request a wallet-signed ${network.asset} transfer of ${amount} on ${network.label}.`)) throw new Error("Wallet transaction cancelled before approval");
    setSendStatus(`Confirm the ${network.asset} transaction in ${walletLabel}. Keep this window open.`, "loading");
    const txHash = await requestWalletWithTimeout(
      provider,
      {
        method: "eth_sendTransaction",
        params: [txParams],
      },
      WALLET_TX_TIMEOUT_MS,
      `${walletLabel} transaction approval timed out. Open the wallet popup, approve or reject it, then try again.`,
    );
    setSendStatus("Transaction submitted. Recording budget account spend...", "loading");

    rememberRecipient(recipient, recipientName, wallet.network, bucketId);
    recordBucketSend(wallet, bucketId, Number(amount), txHash, recipient);
    wallet.status = "";
    wallet.statusType = "";
    wallet.error = "";
    wallet.lastTransactionHash = txHash;
    saveWallets();
    render();
    walletDialog.close();
    showToast("Transaction submitted");
  } catch (error) {
    const message = normalizeWalletError(error, "Transaction was not sent");
    setSendStatus(message, "error");
    showToast(message);
  } finally {
    setSendButtonLoading(false, buttonLabel);
  }
}

function rememberRecipient(address, name, network, bucketId) {
  if (!address || !name) return;
  const bucket = wallets.flatMap((wallet) => wallet.allocation?.buckets || []).find((item) => item.id === bucketId);
  const existing = findAddressBookEntry(address, network);
  const entry = {
    id: existing?.id || crypto.randomUUID(),
    name,
    address,
    network,
    bucketId: bucketId || existing?.bucketId || "",
    bucketName: bucket?.name || existing?.bucketName || "",
    updatedAt: new Date().toISOString(),
  };
  addressBook = existing
    ? addressBook.map((item) => item.id === existing.id ? entry : item)
    : [entry, ...addressBook];
  saveAddressBook();
}

function recordBucketSend(wallet, bucketId, amount, txHash, recipient) {
  const network = NETWORKS[wallet.network];
  wallet.allocation = wallet.allocation || { buckets: [], transactions: [] };
  const bucket = bucketId ? wallet.allocation.buckets.find((item) => item.id === bucketId) : null;
  const hasVirtualAccounts = Boolean(wallet.allocation.buckets?.length);

  const spendValue = getSendSpendValue(wallet, amount);
  if (bucket) {
    bucket.spent = Number(bucket.spent || 0) + spendValue;
  } else if (!hasVirtualAccounts) {
    wallet.allocation.pendingSpend = Number(wallet.allocation.pendingSpend || 0) + spendValue;
  }
  if (["evm-usdc", "evm-stablecoin", "solana-token"].includes(network.kind)) {
    wallet.balance = Math.max(Number(wallet.balance || 0) - amount, 0);
  }
  if (!bucket && hasVirtualAccounts) {
    rebalanceWalletBucketsToCurrentBalance(wallet);
  }
  wallet.allocation.transactions = wallet.allocation.transactions || [];
  wallet.allocation.transactions.unshift({
    id: crypto.randomUUID(),
    type: bucket ? "bucket-send" : hasVirtualAccounts ? "main-wallet-send-rebalanced" : "wallet-send",
    bucketId: bucket?.id || "",
    bucketName: bucket?.name || (hasVirtualAccounts ? "Main wallet send" : "Unassigned spend"),
    amount: spendValue,
    assetAmount: amount,
    asset: network.asset,
    recipient,
    txHash,
    displayTitle: bucket
      ? `${bucket.name} Budget Account Release`
      : hasVirtualAccounts
        ? "Main Wallet Release + VBA Rebalance"
        : "Main Wallet Send",
    note: bucket
      ? `Sent from ${bucket.name} Virtual Budget Account.`
      : hasVirtualAccounts
        ? "Sent from main wallet and rebalanced Virtual Budget Accounts to the new wallet balance."
        : "Sent from main wallet before funds were allocated.",
    createdAt: new Date().toISOString(),
  });
  wallet.allocation.pendingTxs = wallet.allocation.pendingTxs || [];
  wallet.allocation.pendingTxs.unshift({
    txHash,
    amount: spendValue,
    createdAt: new Date().toISOString(),
  });
  wallet.allocation.lastValue = getWalletDisplayValue(wallet);
  wallet.allocation.updatedAt = new Date().toISOString();
}

async function copyAddress(address) {
  try {
    await navigator.clipboard.writeText(address);
    showToast(`Copied ${shortAddress(address)}`);
  } catch {
    showToast("Copy was blocked by the browser");
  }
}

function deleteWallet(id) {
  wallets = wallets.filter((wallet) => wallet.id !== id);
  if (selectedWalletId === id) selectedWalletId = getSupportedWallets()[0]?.id || "";
  saveWallets();
  render();
  showToast("Wallet removed");
}

function confirmDeleteWallet(id) {
  const wallet = wallets.find((item) => item.id === id);
  if (!wallet) return;
  const network = NETWORKS[wallet.network];
  const assetLabel = network ? `${network.asset} on ${network.label}` : "this wallet";
  const bucketCount = wallet.allocation?.buckets?.length || 0;
  const message = `Remove ${wallet.name} (${assetLabel}) from AllocaFi? This only deletes the saved local wallet profile${bucketCount ? ` and ${bucketCount} Virtual Budget Account${bucketCount === 1 ? "" : "s"}` : ""}. It does not move or delete crypto.`;
  if (!window.confirm(message)) return;
  deleteWallet(id);
}

function clearWalletStatus(id) {
  const wallet = wallets.find((item) => item.id === id);
  if (!wallet) return;
  wallet.status = "";
  wallet.statusType = "";
  wallet.error = "";
  saveWallets();
  render();
}

function encodeBalanceOf(address) {
  const selector = "70a08231";
  const paddedAddress = address.toLowerCase().replace("0x", "").padStart(64, "0");
  return `0x${selector}${paddedAddress}`;
}

function parseTokenBalance(hexValue, decimals) {
  const raw = BigInt(hexValue || "0x0");
  const divisor = 10n ** BigInt(decimals);
  const whole = raw / divisor;
  const fraction = raw % divisor;
  return Number(`${whole}.${fraction.toString().padStart(decimals, "0")}`);
}

function getSolanaTokenProgramId(network) {
  return network.tokenProgram === "token2022" ? SOLANA_TOKEN_2022_PROGRAM_ID : SOLANA_TOKEN_PROGRAM_ID;
}

function parseSolanaTokenAccounts(accounts, mint = "") {
  return (accounts || []).reduce((tokens, account) => {
    const info = account.account?.data?.parsed?.info;
    if (!info?.mint || !info.tokenAmount) return tokens;
    if (mint && info.mint !== mint) return tokens;
    tokens.push({
      tokenAccount: account.pubkey,
      mint: info.mint,
      owner: info.owner,
      amount: Number(info.tokenAmount.uiAmountString || info.tokenAmount.uiAmount || 0),
      decimals: Number(info.tokenAmount.decimals || 0),
      program: account.account?.owner || "",
    });
    return tokens;
  }, []);
}

function parseSolanaIndexerTokens(payload, mint = "") {
  const rawTokens = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.tokens)
        ? payload.tokens
        : [];

  return rawTokens.reduce((tokens, item) => {
    const tokenMint = item.mint || item.tokenAddress || item.token_address || item.address;
    if (!tokenMint) return tokens;
    if (mint && tokenMint !== mint) return tokens;
    const rawAmount = item.amount ?? item.tokenAmount?.uiAmount ?? item.tokenAmount?.uiAmountString ?? item.uiAmount ?? item.balance ?? 0;
    const decimals = Number(item.decimals ?? item.tokenAmount?.decimals ?? 0);
    const amount = typeof rawAmount === "string" && rawAmount.includes(".")
      ? Number(rawAmount)
      : decimals > 0 && Number(rawAmount) > 1_000_000
        ? Number(rawAmount) / (10 ** decimals)
        : Number(rawAmount);
    tokens.push({
      tokenAccount: item.tokenAccount || item.token_account || item.associatedTokenAddress || "",
      mint: tokenMint,
      owner: item.owner || "",
      amount,
      decimals,
      program: item.programId || item.program || "indexer",
    });
    return tokens;
  }, []);
}

function parseSolanaDasAssets(payload, mint = "") {
  const items = payload?.result?.items || payload?.items || [];
  return items.reduce((tokens, item) => {
    const tokenInfo = item.token_info || item.tokenInfo || {};
    const tokenMint = item.id || tokenInfo.mint || item.mint;
    if (!tokenMint) return tokens;
    if (mint && tokenMint !== mint) return tokens;
    const decimals = Number(tokenInfo.decimals || item.decimals || 0);
    const rawBalance = tokenInfo.balance ?? tokenInfo.token_amount ?? item.balance ?? item.amount ?? 0;
    const amount = tokenInfo.ui_amount
      ? Number(tokenInfo.ui_amount)
      : tokenInfo.uiAmount
        ? Number(tokenInfo.uiAmount)
        : decimals > 0
          ? Number(rawBalance || 0) / (10 ** decimals)
          : Number(rawBalance || 0);
    if (amount <= 0) return tokens;
    tokens.push({
      tokenAccount: tokenInfo.associated_token_address || tokenInfo.associatedTokenAddress || "",
      mint: tokenMint,
      owner: item.ownership?.owner || "",
      amount,
      decimals,
      program: tokenInfo.token_program || tokenInfo.tokenProgram || "das",
    });
    return tokens;
  }, []);
}

async function fetchSolanaDasTokens(wallet, mint = "") {
  const customRpc = loadSolanaRpcUrl() || (serverSolanaRpcConfigured ? SERVER_SOLANA_RPC_ENDPOINT : "");
  if (!customRpc) return [];
  const result = await postSolanaRpc(customRpc, {
    jsonrpc: "2.0",
    id: Date.now(),
    method: "getAssetsByOwner",
    params: {
      ownerAddress: wallet.address,
      page: 1,
      limit: 1000,
      displayOptions: {
        showFungible: true,
        showFungibleTokens: true,
        showNativeBalance: true,
      },
      options: {
        showFungible: true,
        showFungibleTokens: true,
        showZeroBalance: false,
      },
    },
  });
  return parseSolanaDasAssets(result, mint);
}

function shouldIgnoreSolanaError(error) {
  const message = error?.message || "";
  return message.includes("unrecognized Token program id");
}

function encodeErc20Transfer(address, amount, decimals) {
  const selector = "a9059cbb";
  const paddedAddress = address.toLowerCase().replace("0x", "").padStart(64, "0");
  const rawAmount = cryptoToHexWei(amount, decimals).replace("0x", "").padStart(64, "0");
  return `0x${selector}${paddedAddress}${rawAmount}`;
}

async function fetchTokenBalance(wallet) {
  const network = NETWORKS[wallet.network];
  let lastError = null;
  const tokenAddress = network.token || network.usdc;

  for (const rpc of network.rpcs) {
    try {
      const response = await fetchWithTimeout(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method: "eth_call",
          params: [
            {
              to: tokenAddress,
              data: encodeBalanceOf(wallet.address),
            },
            "latest",
          ],
        }),
      });

      if (!response.ok) throw new Error(`Balance request failed (${response.status})`);

      const result = await response.json();
      if (result.error) throw new Error(result.error.message || "Network returned an error");
      return parseTokenBalance(result.result, network.decimals);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Balance request failed");
}

async function fetchSolanaNativeBalance(wallet) {
  const network = NETWORKS[wallet.network];
  let lastError = null;

  for (const rpc of network.rpcs) {
    try {
      const result = await postSolanaRpc(rpc, {
        jsonrpc: "2.0",
        id: Date.now(),
        method: "getBalance",
        params: [wallet.address],
      });
      return Number(result.result?.value || 0) / 1_000_000_000;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Solana balance request failed");
}

async function fetchSolanaTokenBalance(wallet) {
  const network = NETWORKS[wallet.network];
  let lastError = null;
  let zeroBalanceSeen = false;
  const programId = getSolanaTokenProgramId(network);
  const requests = [
    { mint: network.mint },
    ...(network.tokenProgram === "token2022" ? [] : [{ programId }]),
  ];

  if (network.mint === NETWORKS.solanaPyusd.mint) {
    try {
      const localBalance = await fetchLocalSolanaPyusdBalance(wallet);
      if (localBalance !== null) return localBalance;
    } catch (error) {
      const message = error?.message || "";
      lastError = message.includes("Failed to fetch")
        ? new Error("AllocaFi Solana balance service is not reachable. Restart the app server, then refresh again.")
        : error;
    }
  }

  try {
    const dasTokens = await fetchSolanaDasTokens(wallet, network.mint);
    const dasBalance = dasTokens.reduce((sum, token) => sum + token.amount, 0);
    if (dasBalance > 0) return dasBalance;
    if (loadSolanaRpcUrl()) zeroBalanceSeen = true;
  } catch (error) {
    if (!shouldIgnoreSolanaError(error)) lastError = error;
  }

  for (const rpc of getSolanaRpcEndpoints(network)) {
    for (const ownerFilter of requests) {
      try {
        const result = await postSolanaRpc(rpc, {
          jsonrpc: "2.0",
          id: Date.now(),
          method: "getTokenAccountsByOwner",
          params: [
            wallet.address,
            ownerFilter,
            { encoding: "jsonParsed" },
          ],
        });
        const tokens = parseSolanaTokenAccounts(result.result?.value || [], network.mint);
        const balance = tokens.reduce((sum, token) => sum + token.amount, 0);
        if (balance > 0) return balance;
        if (ownerFilter.programId) zeroBalanceSeen = true;
      } catch (error) {
        if (!shouldIgnoreSolanaError(error)) lastError = error;
      }
    }

    try {
      const result = await postSolanaRpc(rpc, {
        jsonrpc: "2.0",
        id: Date.now(),
        method: "getParsedAccountInfo",
        params: [
          wallet.address,
          { encoding: "jsonParsed" },
        ],
      });
      const info = result.result?.value?.data?.parsed?.info;
      if (info?.mint === network.mint) {
        return Number(info.tokenAmount?.uiAmountString || 0);
      }
    } catch (error) {
      if (!shouldIgnoreSolanaError(error)) lastError = error;
    }
  }

  if (!loadSolanaRpcUrl()) for (const rpc of getSolanaRpcEndpoints(network)) {
    try {
      const result = await postSolanaRpc(rpc, {
        jsonrpc: "2.0",
        id: Date.now(),
        method: "getAssetsByOwner",
        params: {
          ownerAddress: wallet.address,
          page: 1,
          limit: 1000,
          displayOptions: {
            showFungible: true,
            showNativeBalance: true,
          },
          options: {
            showFungible: true,
            showZeroBalance: false,
          },
        },
      });
      const tokens = parseSolanaDasAssets(result, network.mint);
      const balance = tokens.reduce((sum, token) => sum + token.amount, 0);
      if (balance > 0) return balance;
      zeroBalanceSeen = true;
    } catch (error) {
      lastError = error;
    }
  }

  for (const indexer of SOLANA_TOKEN_INDEXERS) {
    try {
      const response = await fetchWithTimeout(`${indexer}${wallet.address}`, {}, 9000);
      if (!response.ok) throw new Error(`Solana token index request failed (${response.status})`);
      const payload = await response.json();
      const tokens = parseSolanaIndexerTokens(payload, network.mint);
      const balance = tokens.reduce((sum, token) => sum + token.amount, 0);
      if (balance > 0) return balance;
      zeroBalanceSeen = true;
    } catch (error) {
      lastError = error;
    }
  }

  if (zeroBalanceSeen) return 0;
  throw lastError || new Error("Solana token request failed");
}

async function fetchSolanaTokenDiagnostics(wallet) {
  const tokenNetworks = Object.values(NETWORKS).filter((network) => network.kind === "solana-token");
  const knownMints = tokenNetworks.reduce((map, network) => {
    map[network.mint] = network.asset;
    return map;
  }, {});
  const programs = [SOLANA_TOKEN_PROGRAM_ID, SOLANA_TOKEN_2022_PROGRAM_ID];
  const diagnostics = {
    sol: 0,
    tokens: [],
    pyusdBalance: 0,
    directTokenAccount: null,
    errors: [],
  };

  try {
    diagnostics.sol = await fetchSolanaNativeBalance({ ...wallet, network: "solanaNative" });
  } catch (error) {
    diagnostics.errors.push(error?.message || "Could not read SOL balance");
  }

  for (const rpc of getSolanaRpcEndpoints(NETWORKS.solanaPyusd)) {
    let foundAny = false;
    for (const programId of programs) {
      try {
        const result = await postSolanaRpc(rpc, {
          jsonrpc: "2.0",
          id: Date.now(),
          method: "getTokenAccountsByOwner",
          params: [
            wallet.address,
            { programId },
            { encoding: "jsonParsed" },
          ],
        });
        const tokens = parseSolanaTokenAccounts(result.result?.value || []).map((token) => ({
          ...token,
          asset: knownMints[token.mint] || "Unknown token",
        }));
        diagnostics.tokens.push(...tokens);
        foundAny = foundAny || tokens.length > 0;
      } catch (error) {
        if (!shouldIgnoreSolanaError(error)) {
          diagnostics.errors.push(error?.message || "Could not scan token accounts");
        }
      }
    }

    try {
      const result = await postSolanaRpc(rpc, {
        jsonrpc: "2.0",
        id: Date.now(),
        method: "getParsedAccountInfo",
        params: [
          wallet.address,
          { encoding: "jsonParsed" },
        ],
      });
      const info = result.result?.value?.data?.parsed?.info;
      if (info?.mint) {
        diagnostics.directTokenAccount = {
          asset: knownMints[info.mint] || "Unknown token",
          mint: info.mint,
          owner: info.owner,
          amount: Number(info.tokenAmount?.uiAmountString || 0),
        };
      }
    } catch (error) {
      if (!shouldIgnoreSolanaError(error)) {
        diagnostics.errors.push(error?.message || "Could not check direct token account");
      }
    }

    if (foundAny || diagnostics.directTokenAccount) break;
  }

  for (const rpc of getSolanaRpcEndpoints(NETWORKS.solanaPyusd)) {
    try {
      const result = await postSolanaRpc(rpc, {
        jsonrpc: "2.0",
        id: Date.now(),
        method: "getAssetsByOwner",
        params: {
          ownerAddress: wallet.address,
          page: 1,
          limit: 1000,
          displayOptions: {
            showFungible: true,
            showNativeBalance: true,
          },
          options: {
            showFungible: true,
            showZeroBalance: false,
          },
        },
      });
      const tokens = parseSolanaDasAssets(result).map((token) => ({
        ...token,
        asset: knownMints[token.mint] || "Unknown token",
      }));
      diagnostics.tokens.push(...tokens);
      if (tokens.length) break;
    } catch (error) {
      if (!shouldIgnoreSolanaError(error)) {
        diagnostics.errors.push(error?.message || "Could not scan Helius assets");
      }
    }
  }

  for (const indexer of SOLANA_TOKEN_INDEXERS) {
    try {
      const response = await fetchWithTimeout(`${indexer}${wallet.address}`, {}, 9000);
      if (!response.ok) throw new Error(`Solana token index request failed (${response.status})`);
      const payload = await response.json();
      const tokens = parseSolanaIndexerTokens(payload).map((token) => ({
        ...token,
        asset: knownMints[token.mint] || "Unknown token",
      }));
      diagnostics.tokens.push(...tokens);
      if (tokens.length) break;
    } catch (error) {
      if (!shouldIgnoreSolanaError(error)) {
        diagnostics.errors.push(error?.message || "Could not scan Solana indexer");
      }
    }
  }

  diagnostics.pyusdBalance = diagnostics.tokens
    .filter((token) => token.mint === NETWORKS.solanaPyusd.mint)
    .reduce((sum, token) => sum + token.amount, 0);
  if (diagnostics.directTokenAccount?.mint === NETWORKS.solanaPyusd.mint) {
    diagnostics.pyusdBalance += diagnostics.directTokenAccount.amount;
  }
  diagnostics.tokens = diagnostics.tokens.filter((token, index, all) =>
    index === all.findIndex((item) => item.tokenAccount === token.tokenAccount)
  );
  diagnostics.errors = [...new Set(diagnostics.errors)].slice(0, 4);
  return diagnostics;
}

async function fetchBitcoinBalance(wallet) {
  const network = NETWORKS[wallet.network];
  let lastError = null;

  for (const api of network.apis) {
    try {
      const response = await fetchWithTimeout(`${api}${wallet.address}`, {}, 9000);
      if (!response.ok) throw new Error("Bitcoin balance request failed");

      const result = await response.json();
      const chainStats = result.chain_stats || {};
      const mempoolStats = result.mempool_stats || {};
      const confirmed = (chainStats.funded_txo_sum || 0) - (chainStats.spent_txo_sum || 0);
      const pending = (mempoolStats.funded_txo_sum || 0) - (mempoolStats.spent_txo_sum || 0);
      return (confirmed + pending) / 100_000_000;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Bitcoin balance request failed");
}

async function refreshPrices() {
  const ids = [...new Set(Object.values(NETWORKS).map((network) => network.priceId).filter(Boolean))];
  if (!ids.length) return;

  try {
    const response = await fetchWithTimeout(`https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd`, {}, 9000);
    if (!response.ok) throw new Error("Price request failed");
    const prices = await response.json();
    priceCache = ids.reduce((cache, id) => {
      if (prices[id]?.usd) cache[id] = Number(prices[id].usd);
      return cache;
    }, {});
    render();
  } catch {
    showToast("Price estimates are unavailable right now");
  }
}

async function fetchNativeBalance(wallet) {
  const network = NETWORKS[wallet.network];
  let lastError = null;

  for (const rpc of network.rpcs) {
    try {
      const response = await fetchWithTimeout(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method: "eth_getBalance",
          params: [wallet.address, "latest"],
        }),
      });

      if (!response.ok) throw new Error(`Balance request failed (${response.status})`);

      const result = await response.json();
      if (result.error) throw new Error(result.error.message || "Network returned an error");
      return parseTokenBalance(result.result, network.decimals);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Balance request failed");
}

async function fetchWalletBalance(wallet) {
  const network = NETWORKS[wallet.network];
  if (network.kind === "bitcoin") return fetchBitcoinBalance(wallet);
  if (network.kind === "evm-native") return fetchNativeBalance(wallet);
  if (network.kind === "evm-usdc" || network.kind === "evm-stablecoin") return fetchTokenBalance(wallet);
  if (network.kind === "solana-native") return fetchSolanaNativeBalance(wallet);
  if (network.kind === "solana-token") return fetchSolanaTokenBalance(wallet);
  throw new Error("Unsupported asset");
}

async function refreshWallet(id) {
  const wallet = wallets.find((item) => item.id === id);
  if (!wallet) return;
  if (!isSupportedNetworkKey(wallet.network)) {
    wallet.status = "Unsupported";
    wallet.statusType = "warning";
    wallet.error = "This asset is hidden during launch testing. Add one of the supported assets instead.";
    saveWallets();
    render();
    return;
  }
  const previousValue = getWalletDisplayValue(wallet);

  wallet.status = "Refreshing";
  wallet.statusType = "loading";
  wallet.error = "";
  saveWallets();
  render();

  const network = NETWORKS[wallet.network];
  if (network.kind === "view-only-reserve") {
    wallet.balance = Number(wallet.manualBalance || wallet.balance || 0);
    wallet.status = wallet.balance > 0 ? "Manual Legal Core tracking" : "Manual setup";
    wallet.statusType = wallet.balance > 0 ? "live" : "warning";
    wallet.error = wallet.balance > 0 ? "" : "Add a manual balance or connect a native indexer when available.";
    wallet.updatedAt = new Date().toISOString();
    saveWallets();
    render();
    return;
  }
  try {
    try {
      wallet.balance = await fetchWalletBalance(wallet);
    } catch (error) {
      if (network.kind !== "solana-token") throw error;
      const diagnostics = await fetchSolanaTokenDiagnostics(wallet);
      if (diagnostics.pyusdBalance > 0) {
        wallet.balance = diagnostics.pyusdBalance;
        wallet.error = "";
      } else {
        throw new Error(diagnostics.errors[0] || error?.message || "Solana token request failed");
      }
    }
    if (network.kind === "solana-token" && wallet.balance <= 0) {
      const diagnostics = await fetchSolanaTokenDiagnostics(wallet);
      if (diagnostics.pyusdBalance > 0) {
        wallet.balance = diagnostics.pyusdBalance;
      } else if (diagnostics.tokens.length) {
        const found = diagnostics.tokens
          .slice(0, 3)
          .map((token) => `${token.asset}: ${token.amount}`)
          .join(", ");
        wallet.error = `Solana address works, but no ${network.asset} was found. Other tokens found: ${found}`;
      } else if (diagnostics.directTokenAccount) {
        wallet.error = diagnostics.directTokenAccount.mint === network.mint
          ? `Found ${formatUsd(diagnostics.directTokenAccount.amount)} ${network.asset} in this token account`
          : `This is a ${diagnostics.directTokenAccount.asset} token account, not a ${network.asset} wallet owner address`;
        if (diagnostics.directTokenAccount.mint === network.mint) wallet.balance = diagnostics.directTokenAccount.amount;
      } else if (diagnostics.errors.length) {
        wallet.error = `Could not find ${network.asset}. ${diagnostics.errors[0]}`;
      }
    }
    await refreshPrices();
    if (isReserveAssetWallet(wallet)) {
      if (wallet.allocation) {
        wallet.allocation.pendingIncrease = 0;
        wallet.allocation.pendingSpend = 0;
      }
      wallet.status = wallet.balance > 0 ? "Reserve tracked" : `No ${NETWORKS[wallet.network].asset} found`;
      wallet.error = wallet.balance > 0 ? "" : wallet.error || "Asset address is tracked for Legal Core only.";
      wallet.statusType = wallet.balance > 0 ? "live" : wallet.error ? "warning" : "live";
      wallet.updatedAt = new Date().toISOString();
      saveLegalCoreAssetRecords(syncLegalCoreAssetRecords());
      saveTaxLedgerAssetRecords(buildTaxLedgerAssetRecords());
      lastUpdated.textContent = `Updated ${new Date(wallet.updatedAt).toLocaleString()}`;
      showToast(`${wallet.name} reserve updated`);
      saveWallets();
      render();
      return;
    }
    trackAllocationDelta(wallet, previousValue);
    const walletValueAfterRefresh = getWalletDisplayValue(wallet);
    const awaitingFunds = Boolean(wallet.allocation?.awaitingFunds) && walletValueAfterRefresh <= 0.01;
    const overbalance = getWalletOverbalanceAmount(wallet);
    if (overbalance > 0.01) {
      wallet.status = "Needs VBA refresh";
      wallet.error = `Virtual Budget Accounts are ${formatUsd(overbalance)} above this wallet. Tap Refresh VBAs to match the current balance.`;
      wallet.statusType = "warning";
    } else if (awaitingFunds) {
      const asset = NETWORKS[wallet.network]?.asset || "stablecoin";
      wallet.status = "Awaiting funds";
      wallet.error = `No ${asset} detected yet. Add funds to this Owner Wallet, then press Refresh to update and auto-fund the budget accounts.`;
      wallet.statusType = "warning";
    } else {
      wallet.status = "Live";
      wallet.error = wallet.balance > 0 ? "" : wallet.error || `No ${NETWORKS[wallet.network].asset} found on this address`;
      wallet.statusType = wallet.balance > 0 ? "live" : wallet.error ? "error" : "live";
    }
    wallet.updatedAt = new Date().toISOString();
    lastUpdated.textContent = `Updated ${new Date(wallet.updatedAt).toLocaleString()}`;
    showToast(`${wallet.name} balance updated`);
  } catch (error) {
    wallet.balance = wallet.manualBalance || wallet.balance || 0;
    wallet.status = wallet.manualBalance ? "Manual" : "Needs check";
    wallet.statusType = wallet.manualBalance ? "" : "error";
    wallet.error = error?.message ? `Could not check balance: ${error.message}` : "Could not check balance";
    showToast(`Could not refresh ${wallet.name}`);
  }

  saveWallets();
  render();
}

function trackAllocationDelta(wallet, previousValue) {
  if (isReserveAssetWallet(wallet)) return;
  if (!wallet.allocation?.buckets?.length) return;
  const currentValue = getWalletDisplayValue(wallet);
  const prior = Number(wallet.allocation.lastValue ?? previousValue ?? currentValue);
  const delta = currentValue - prior;

  if (delta > 0.01) {
    if (wallet.allocation.awaitingFunds) wallet.allocation.awaitingFunds = false;
    const { allocated } = allocateAmountToWalletBuckets(wallet, delta);
    if (allocated > 0.01) {
      wallet.allocation.pendingIncrease = 0;
      recordAutomaticAllocation(wallet, allocated, "Detected deposit");
    } else {
      wallet.allocation.pendingIncrease = Number(wallet.allocation.pendingIncrease || 0) + delta;
    }
  }

  if (delta < -0.01) {
    const recorded = consumePendingTxValue(wallet, Math.abs(delta));
    const unassigned = Math.max(Math.abs(delta) - recorded, 0);
    if (unassigned > 0.01) {
      wallet.allocation.pendingSpend = Number(wallet.allocation.pendingSpend || 0) + unassigned;
    }
  }

  clampWalletPendingIncrease(wallet);
  wallet.allocation.lastValue = currentValue;
  wallet.allocation.updatedAt = new Date().toISOString();
}

function consumePendingTxValue(wallet, decrease) {
  const pendingTxs = wallet.allocation?.pendingTxs || [];
  if (!pendingTxs.length || decrease <= 0) return 0;

  let remaining = decrease;
  let consumed = 0;

  wallet.allocation.pendingTxs = pendingTxs.filter((tx) => {
    if (remaining <= 0.01) return true;
    const txAmount = Number(tx.amount || 0);
    if (txAmount <= 0) return false;
    const useAmount = Math.min(txAmount, remaining);
    remaining -= useAmount;
    consumed += useAmount;
    const leftover = txAmount - useAmount;
    if (leftover > 0.01) {
      tx.amount = leftover;
      return true;
    }
    return false;
  });

  return consumed;
}

async function scanAssets(id) {
  const wallet = wallets.find((item) => item.id === id);
  if (!wallet) return;
  const baseNetwork = NETWORKS[wallet.network];
  if (baseNetwork.kind.startsWith("solana")) {
    await scanSolanaAssets(wallet);
    return;
  }
  if (baseNetwork.kind.startsWith("solana") && !isSolanaAddress(wallet.address)) return;
  if (!baseNetwork.kind.startsWith("solana") && !isEvmAddress(wallet.address)) return;

  wallet.status = "Scanning";
  wallet.statusType = "loading";
  wallet.error = "";
  saveWallets();
  render();

  const results = [];
  const supportedNetworks = getSupportedNetworkEntries().filter(([, network]) => {
    if (baseNetwork.kind.startsWith("solana")) return network.kind.startsWith("solana");
    return ["evm-usdc", "evm-stablecoin"].includes(network.kind);
  });

  for (const [networkKey, network] of supportedNetworks) {
    try {
      const balance = await fetchWalletBalance({ ...wallet, network: networkKey });
      if (balance > 0) {
        const amount = ["evm-usdc", "evm-stablecoin"].includes(network.kind) ? formatUsd(balance) : formatCrypto(balance, network.asset);
        results.push(`${network.label} ${network.asset}: ${amount}`);
      }
    } catch {
      // Individual public RPCs can be flaky; keep scanning the remaining networks.
    }
  }

  wallet.status = results.length ? "Found" : "Nothing found";
  wallet.statusType = results.length ? "live" : "error";
  wallet.error = results.length
    ? `Found balances on ${results.join(", ")}`
    : "No supported token or native coin balance found. Check the asset network in your wallet.";
  saveWallets();
  render();
  showToast(wallet.status);
}

async function scanSolanaAssets(wallet) {
  const targetNetwork = NETWORKS[wallet.network] || NETWORKS.solanaPyusd;
  wallet.status = "Scanning";
  wallet.statusType = "loading";
  wallet.error = "";
  saveWallets();
  render();

  try {
    const diagnostics = await fetchSolanaTokenDiagnostics(wallet);
    const targetBalance = diagnostics.tokens
      .filter((token) => token.mint === targetNetwork.mint)
      .reduce((sum, token) => sum + Number(token.amount || 0), 0)
      + (diagnostics.directTokenAccount?.mint === targetNetwork.mint ? Number(diagnostics.directTokenAccount.amount || 0) : 0);
    if (targetBalance > 0) {
      wallet.balance = targetBalance;
      wallet.status = "Found";
      wallet.statusType = "live";
      wallet.error = `Found ${formatUsd(targetBalance)} ${targetNetwork.asset} on Solana`;
    } else if (diagnostics.tokens.length) {
      const found = diagnostics.tokens
        .slice(0, 4)
        .map((token) => `${token.asset}: ${token.amount}`)
        .join(", ");
      wallet.status = `No ${targetNetwork.asset}`;
      wallet.statusType = "error";
      wallet.error = `Solana address works, but no ${targetNetwork.asset} was found. Other tokens found: ${found}`;
    } else if (diagnostics.directTokenAccount) {
      wallet.status = "Token account";
      wallet.statusType = diagnostics.directTokenAccount.mint === targetNetwork.mint ? "live" : "error";
      wallet.balance = diagnostics.directTokenAccount.mint === targetNetwork.mint ? diagnostics.directTokenAccount.amount : wallet.balance;
      wallet.error = diagnostics.directTokenAccount.mint === targetNetwork.mint
        ? `Found ${formatUsd(diagnostics.directTokenAccount.amount)} ${targetNetwork.asset} in this token account`
        : `This is a ${diagnostics.directTokenAccount.asset} token account, not a ${targetNetwork.asset} wallet owner address`;
    } else {
      wallet.status = "No tokens";
      wallet.statusType = "error";
      wallet.error = diagnostics.errors.length
        ? `Could not find Solana ${targetNetwork.asset}. ${diagnostics.errors[0]}`
        : "Address is valid, but no Solana token accounts were found.";
    }
    wallet.updatedAt = new Date().toISOString();
    saveWallets();
    render();
    showToast(wallet.statusType === "live" ? `Solana ${targetNetwork.asset} found` : "Solana scan complete");
  } catch (error) {
    wallet.status = "Needs check";
    wallet.statusType = "error";
    wallet.error = error?.message || "Could not scan Solana assets";
    saveWallets();
    render();
    showToast("Could not scan Solana assets");
  }
}

function shortAddress(address = "") {
  const value = String(address || "").trim();
  if (!value) return "Not set";
  if (value.length <= 14) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function isValidAddressForNetwork(address, networkKey) {
  const value = String(address || "").trim();
  const network = NETWORKS[networkKey];
  if (!value || !network) return false;
  if (network.kind?.startsWith("evm")) return /^0x[a-fA-F0-9]{40}$/.test(value);
  if (network.kind?.startsWith("solana")) return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);
  if (network.kind === "bitcoin") return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{20,}$/i.test(value);
  if (network.kind === "view-only-reserve") return value.length >= 6 && !/\s/.test(value);
  return value.length >= 6;
}

function populateNetworks() {
  const entries = getSupportedNetworkEntries();
  const optionHtml = entries.map(([key, network]) => {
    const label = `${network.label} ${network.asset ? `(${network.asset})` : ""}`.trim();
    return `<option value="${escapeHtml(key)}">${escapeHtml(label)}</option>`;
  }).join("");
  if (networkSelect) networkSelect.innerHTML = optionHtml;
  if (filterNetwork) {
    filterNetwork.innerHTML = `<option value="all">All supported assets</option>${optionHtml}`;
  }
}

function saveViewOnlyWalletAddress({ network, address, name, budget, manualBalance, note } = {}) {
  const networkKey = String(network || "").trim();
  const cleanAddress = String(address || "").trim();
  const networkMeta = NETWORKS[networkKey];
  if (!networkMeta || !isSupportedNetworkKey(networkKey)) {
    showToast("Choose a supported AllocaFi network");
    return null;
  }
  if (!isValidAddressForNetwork(cleanAddress, networkKey)) {
    showToast("Enter a valid public wallet address");
    return null;
  }
  const balance = Math.max(0, Number(manualBalance || 0));
  const now = new Date().toISOString();
  const wallet = {
    id: crypto.randomUUID(),
    name: String(name || "").trim() || `${networkMeta.label} ${networkMeta.asset || "Wallet"}`,
    network: networkKey,
    address: cleanAddress,
    budget: Math.max(0, Number(budget || 0)),
    manualBalance: balance,
    balance,
    status: balance > 0 ? "Manual balance" : "Needs check",
    statusType: balance > 0 ? "" : "warning",
    error: "",
    note: String(note || "").trim(),
    allocation: { buckets: [], transactions: [] },
    createdAt: now,
    lastUpdated: "",
  };
  wallets.unshift(wallet);
  selectedWalletId = wallet.id;
  saveWallets();
  render();
  showToast(`${wallet.name} added`);
  return wallet;
}
function openStablecoinAddressEntry() {
  if (!form) {
    showToast("Wallet address form is unavailable");
    return;
  }
  switchTab("wallets");
  form.classList.add("open");
  if (networkSelect && !networkSelect.value) networkSelect.value = "solanaPyusd";
  const nameInput = form.querySelector("#walletName");
  const addressInput = form.querySelector("#address");
  (addressInput || nameInput)?.focus();
}
async function refreshAll() {
  if (!wallets.length) {
    showToast("Add a wallet first");
    return;
  }

  refreshAllButton.disabled = true;
  refreshAllButton.querySelector(".control-label")?.replaceChildren("Refreshing...");
  for (const wallet of getSupportedWallets()) {
    await refreshWallet(wallet.id);
  }
  refreshAllButton.disabled = false;
  refreshAllButton.querySelector(".control-label")?.replaceChildren("Refresh");
  showToast("Refresh complete");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const wallet = saveViewOnlyWalletAddress({
    network: data.get("network"),
    address: data.get("address"),
    name: data.get("walletName"),
    budget: data.get("budget"),
    manualBalance: data.get("manualBalance"),
    note: data.get("note"),
  });
  if (!wallet) return;
  form.reset();
  networkSelect.value = "solanaPyusd";
  form.classList.remove("open");
});

refreshAllButton.addEventListener("click", refreshAll);
filterNetwork.addEventListener("change", render);
connectWalletButton?.addEventListener("click", async () => {
  try {
    openStablecoinAddressEntry();
  } catch (error) {
    showToast(error?.message || "Wallet address setup did not finish");
  }
});
saveWalletConnectProjectButton?.addEventListener("click", saveWalletConnectProjectId);
saveSolanaRpcUrlButton?.addEventListener("click", saveSolanaRpcUrl);

seedExamplesButton.addEventListener("click", () => {
  const examples = [
    {
      name: "Food Account",
      network: "ethereum",
      address: "0x1111111111111111111111111111111111111111",
      budget: 350,
      manualBalance: 124.5,
      note: "Groceries and quick meals",
    },
    {
      name: "Gas Account",
      network: "ethereumUsdt",
      address: "0x2222222222222222222222222222222222222222",
      budget: 180,
      manualBalance: 72.25,
      note: "Fuel and rideshare",
    },
  ].map((item) => ({
    ...item,
    id: crypto.randomUUID(),
    balance: item.manualBalance,
    status: "Manual",
    statusType: "",
    createdAt: new Date().toISOString(),
  }));

  wallets = [...examples, ...wallets];
  saveWallets();
  render();
  showToast("Example budget accounts added");
});

function isDemoModeActive() {
  return localStorage.getItem(DEMO_MODE_KEY) === "active";
}

function createDemoModeBackup() {
  return {
    app: "AllocaFi",
    version: 1,
    createdAt: new Date().toISOString(),
    wallets,
    goals,
    addressBook,
    financeData,
    aiInsightsState,
    aiCategorySuggestions,
    selectedWalletId,
  };
}

function saveDemoModeBackup() {
  if (isDemoModeActive()) return;
  localStorage.setItem(DEMO_BACKUP_KEY, JSON.stringify(createDemoModeBackup()));
}

function readDemoModeBackup() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_BACKUP_KEY)) || null;
  } catch {
    return null;
  }
}

function clearDemoModeState() {
  localStorage.removeItem(DEMO_MODE_KEY);
  localStorage.removeItem(DEMO_BACKUP_KEY);
  localStorage.removeItem(ONBOARDING_DEMO_STAGE_KEY);
}

function createDemoWallet({ name, network, address, balance, note, withStarterBudgetAccounts = false }, now) {
  const wallet = {
    id: crypto.randomUUID(),
    name,
    network,
    address,
    budget: 0,
    manualBalance: balance,
    balance,
    note,
    status: "Demo balance",
    statusType: "live",
    demoMode: true,
    createdAt: now,
    updatedAt: now,
  };

  if (withStarterBudgetAccounts && Number(balance || 0) > 0.01) {
    wallet.allocation = {
      cycle: "weekly",
      buckets: createAllocationBucketsFromTemplate(DEMO_OWNER_STARTER_BUDGET_ACCOUNTS, balance),
      transactions: [],
      pendingIncrease: 0,
      pendingSpend: 0,
      lastValue: balance,
      updatedAt: now,
      autoMode: "rules",
      demoStarter: true,
    };
    recordAutomaticAllocation(wallet, balance, "Demo owner wallet setup");
  }

  return wallet;
}

function getDemoWalletSeed(now) {
  return [
    createDemoWallet({
      name: "Owner Demo Wallet",
      network: "ethereum",
      address: "0x1111111111111111111111111111111111111111",
      balance: 100000,
      note: "Demo-only owner wallet for testing allocations from a single connected wallet.",
      withStarterBudgetAccounts: true,
    }, now),
  ];
}
function updateDemoModeControls() {
  const active = isDemoModeActive();
  if (demoModeButton) demoModeButton.textContent = active ? "Restart Demo" : "Start Demo";
  if (exitDemoModeButton) exitDemoModeButton.hidden = !active;
  const onboardingStage = localStorage.getItem(ONBOARDING_DEMO_STAGE_KEY);
  const hasDemoFunds = getSupportedWallets().some((wallet) => wallet.demoMode && getWalletDisplayValue(wallet) > 0);
  if (demoModeStatus) demoModeStatus.textContent = active
    ? onboardingStage === "awaiting-funds" && !hasDemoFunds
      ? "$100K Owner Wallet Ready"
      : "$100K Owner Wallet Active"
    : "Sandbox Off";
  demoModeButton?.closest(".demo-mode-section")?.classList.toggle("active", active);
}

function loadDemoMode() {
  const active = isDemoModeActive();
  const message = active
    ? "Restart the demo sandbox? This keeps your saved backup and reloads the single $100,000 owner demo wallet."
    : "Start demo mode? Your current local data will be backed up, then replaced with one $100,000 owner demo wallet. Exit Demo restores your previous local data.";
  if (!window.confirm(message)) return;

  const now = new Date().toISOString();
  saveDemoModeBackup();
  localStorage.setItem(DEMO_MODE_KEY, "active");
  localStorage.setItem(ONBOARDING_DEMO_STAGE_KEY, "funded");
  wallets = getDemoWalletSeed(now);
  goals = [];
  addressBook = [];
  financeData = createDefaultFinanceData();
  financeData.plan = "Demo";
  financeData.bankItems = [];
  financeData.bankAccounts = [];
  financeData.bankTransactions = [];
  financeData.familyGroups = [];
  financeData.businessProfiles = [];
  selectedWalletId = wallets[0]?.id || "";
  if (filterNetwork) filterNetwork.value = "all";
  saveAiInsightsState({ insights: [], mode: "demo", updatedAt: now });
  saveAiCategorySuggestions([]);
  saveWallets();
  saveGoals();
  saveAddressBook();
  saveFinanceData();
  render();
  switchTab("wallets");
  showToast("Demo mode started with one $100K owner wallet");
}

function startOnboardingDemoMode() {
  const active = isDemoModeActive();
  const message = active
    ? "Restart the onboarding demo? This clears the current demo and waits for you to add a test wallet address before adding funds."
    : "Start onboarding demo mode? Your current local data will be backed up, then the test flow starts with no funds until you add a demo wallet address.";
  if (!window.confirm(message)) return false;

  const now = new Date().toISOString();
  saveDemoModeBackup();
  localStorage.setItem(DEMO_MODE_KEY, "active");
  localStorage.setItem(ONBOARDING_DEMO_STAGE_KEY, "awaiting-wallet");
  wallets = [];
  goals = [];
  addressBook = [];
  financeData = createDefaultFinanceData();
  financeData.plan = "Demo";
  financeData.bankItems = [];
  financeData.bankAccounts = [];
  financeData.bankTransactions = [];
  financeData.familyGroups = [];
  financeData.businessProfiles = [];
  selectedWalletId = "";
  if (filterNetwork) filterNetwork.value = "all";
  saveAiInsightsState({ insights: [], mode: "demo-onboarding", updatedAt: now });
  saveAiCategorySuggestions([]);
  saveWallets();
  saveGoals();
  saveAddressBook();
  saveFinanceData();
  render();
  showToast("Onboarding demo started. Add a test wallet address first.");
  return true;
}

function createDefaultOnboardingFlow() {
  return {
    startedAt: "",
    step: "welcome",
    templateKey: "",
    templateSelectedAt: "",
    planCode: "",
    selectedPlanCode: "",
    signatureWalletProvider: "",
    ownerWalletId: "",
    ownerWalletAddress: "",
    vaultSignatureStatus: "pending",
    completedAt: "",
  };
}

function loadOnboardingFlow() {
  const stored = loadJsonStorage(ONBOARDING_FLOW_KEY, null);
  return { ...createDefaultOnboardingFlow(), ...(stored && typeof stored === "object" ? stored : {}) };
}

function saveOnboardingFlow(flow) {
  saveJsonStorage(ONBOARDING_FLOW_KEY, { ...createDefaultOnboardingFlow(), ...flow });
}

function updateOnboardingFlow(patch = {}) {
  const current = loadOnboardingFlow();
  const next = {
    ...current,
    ...patch,
    startedAt: current.startedAt || patch.startedAt || new Date().toISOString(),
  };
  saveOnboardingFlow(next);
  localStorage.setItem(ONBOARDING_STATUS_KEY, next.completedAt ? "complete" : "started");
  return next;
}

function isOnboardingComplete() {
  return localStorage.getItem(ONBOARDING_STATUS_KEY) === "complete";
}

function isOnboardingFlowActive() {
  const flow = loadOnboardingFlow();
  return Boolean(flow.startedAt && !flow.completedAt);
}

function shouldForceOnboardingGate() {
  if (isDemoModeActive() || isOnboardingComplete()) return false;
  return !wallets.length || isOnboardingFlowActive();
}

function getOnboardingStepNumber(step = loadOnboardingFlow().step) {
  const steps = ["welcome", "template", "plan", "wallet", "vault"];
  return Math.max(steps.indexOf(step), 0) + 1;
}

function renderOnboardingProgress(step = "welcome") {
  const active = getOnboardingStepNumber(step);
  return `
    <span class="onboarding-progress-label">Setup Progress</span>
    <span class="onboarding-progress-dots" aria-label="Setup step ${active} of 5">
      ${[1, 2, 3, 4, 5].map((item) => `<i class="${item === active ? "active" : ""}"></i>`).join("")}
    </span>
  `;
}

function renderOnboardingFooter(step, nextInstruction) {
  return `
    <div class="onboarding-flow-footer">
      <span class="onboarding-next-instruction">${escapeHtml(nextInstruction)}</span>
      <span class="onboarding-progress">${renderOnboardingProgress(step)}</span>
    </div>
  `;
}

function renderOnboardingShell({ step, kicker, title, copy = [], body = "", actions = "", nextInstruction = "" }) {
  const copyLines = Array.isArray(copy) ? copy : [copy];
  return `
    <div class="dialog-content onboarding-modal onboarding-flow-modal" data-onboarding-lock="true" data-onboarding-step="${escapeHtml(step)}">
      <div class="onboarding-flow-brand">
        <span class="onboarding-brand-mark" aria-hidden="true"></span>
        <strong>AllocaFi</strong>
      </div>
      <section class="onboarding-flow-main">
        <span class="subscription-kicker">${escapeHtml(kicker)}</span>
        <h2>${escapeHtml(title)}</h2>
        <div class="onboarding-flow-copy">
          ${copyLines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
        </div>
        ${body}
        ${actions ? `<div class="dialog-actions onboarding-flow-actions">${actions}</div>` : ""}
      </section>
      ${renderOnboardingFooter(step, nextInstruction)}
    </div>
  `;
}

function getOnboardingPreviewWallet() {
  return {
    id: "onboarding-template-preview-wallet",
    name: "Template Preview Wallet",
    network: "solanaUsdc",
    address: "",
    manualBalance: 100000,
    balance: 100000,
    allocation: { buckets: [] },
  };
}

function getOnboardingSelectedTemplateKey() {
  const flow = loadOnboardingFlow();
  const key = flow.templateKey || "";
  return flow.templateSelectedAt && BUCKET_TEMPLATES[key] ? key : "";
}

function getOnboardingSelectedTemplateName() {
  const key = getOnboardingSelectedTemplateKey();
  return key ? getAssignmentTemplateName(key) : "No budget template selected";
}

function hasOnboardingTemplateSelection() {
  return Boolean(getOnboardingSelectedTemplateKey());
}

function normalizeOnboardingPercentages(buckets) {
  const source = buckets.slice(0, ONBOARDING_FREE_BUCKET_LIMIT).map((bucket) => ({ ...bucket }));
  const total = source.reduce((sum, bucket) => sum + Math.max(Number(bucket.percent || 0), 0), 0) || source.length || 1;
  let used = 0;
  return source.map((bucket, index) => {
    const percent = index === source.length - 1
      ? Number((100 - used).toFixed(1))
      : Number(((Math.max(Number(bucket.percent || 0), 0) / total) * 100).toFixed(1));
    used += percent;
    return { ...bucket, percent };
  });
}

function getOnboardingTemplateBucketsForPlan(templateKey, planCode) {
  const templateBuckets = getAssignmentTemplateBuckets(null, templateKey);
  return planCode === "free" ? normalizeOnboardingPercentages(templateBuckets) : templateBuckets;
}

function applyOnboardingTemplateToWallet(walletId) {
  const flow = loadOnboardingFlow();
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet) return { allocationBase: 0, awaitingFunds: true };
  const allocationBase = Math.max(getWalletDisplayValue(wallet), 0);
  const awaitingFunds = allocationBase <= 0.01;
  const onboardingPlanCode = flow.selectedPlanCode || flow.planCode;
  const buckets = getOnboardingTemplateBucketsForPlan(flow.templateKey, onboardingPlanCode);
  wallet.allocation = {
    cycle: wallet.allocation?.cycle || "weekly",
    buckets: createAutoAllocationBucketsFromTemplate(buckets, awaitingFunds ? 0 : allocationBase, "rules"),
    transactions: wallet.allocation?.transactions || [],
    pendingIncrease: 0,
    pendingSpend: 0,
    lastValue: allocationBase,
    updatedAt: new Date().toISOString(),
    autoMode: "rules",
    onboardingTemplate: flow.templateKey,
    onboardingPlan: onboardingPlanCode,
    awaitingFunds,
  };
  if (awaitingFunds) {
    const asset = NETWORKS[wallet.network]?.asset || "stablecoin";
    wallet.status = "Awaiting funds";
    wallet.statusType = "warning";
    wallet.error = `Add ${asset} to this Owner Wallet, then press Refresh to update the balance. Your Virtual Budget Accounts are ready but unfunded.`;
  } else {
    wallet.status = "Live";
    wallet.statusType = "live";
    wallet.error = "";
    recordAutomaticAllocation(wallet, allocationBase, `${getAssignmentTemplateName(flow.templateKey)} onboarding auto allocation`);
  }
  return { allocationBase, awaitingFunds };
}

function openCurrentOnboardingStep() {
  if (isOnboardingComplete() || isDemoModeActive()) return;
  const flow = loadOnboardingFlow();
  if (walletDialog.open && dialogContent.querySelector("[data-onboarding-lock='true']")) return;
  if (flow.step === "template") return openOnboardingTemplateDialog();
  if (flow.step === "plan") return openOnboardingPlansDialog();
  if (flow.step === "wallet") return openOnboardingWalletGuideDialog();
  if (flow.step === "vault") return openOnboardingVaultSignatureDialog();
  return openOnboardingWelcomeDialog();
}
function getOnboardingNetworkOptions(selectedNetwork = "solanaUsdc") {
  const onboardingKeys = Object.keys(NETWORKS).filter((key) => ONBOARDING_ALLOWED_OWNER_ASSETS.has(NETWORKS[key]?.asset));
  return onboardingKeys
    .map((key) => {
      const network = NETWORKS[key];
      return `<option value="${key}" ${key === selectedNetwork ? "selected" : ""}>${escapeHtml(network.asset)} on ${escapeHtml(network.label)}</option>`;
    })
    .join("");
}

function getOnboardingPlanCards(testMode = false) {
  const selectedTemplate = getOnboardingSelectedTemplateName();
  const cards = `
    <article class="subscription-plan-card onboarding-plan-card">
      <div class="plan-topline">
        <span>FREE</span>
        <strong>Free</strong>
      </div>
      <div class="plan-price">Free</div>
      <p>Start with the core version of ${escapeHtml(selectedTemplate)}.</p>
      <ul>
        <li>3 core Virtual Budget Accounts</li>
        <li>One stablecoin Owner Wallet</li>
        <li>No signature required</li>
        <li>Manual spends only</li>
        <li>No reserve or Legal Core add-ons</li>
      </ul>
      <button class="primary-button onboarding-plan-select" data-onboarding-plan="free" type="button">Continue Free</button>
    </article>
    <article class="subscription-plan-card onboarding-plan-card popular">
      <div class="plan-topline">
        <span>RECOMMENDED</span>
        <strong>AllocaFi Core + Legal Core</strong>
      </div>
      <div class="plan-price">$7.99<small>/mo</small></div>
      <p>Sign from wallet first, then complete the $7.99 stablecoin payment.</p>
      <ul>
        <li>Unlimited Virtual Budget Accounts</li>
        <li>Full selected template</li>
        <li>Legal Core reserve asset tracker</li>
        <li>Signature-only Vault activation</li>
        <li>$7.99 USDC / PYUSD / USDT payment</li>
      </ul>
      <button class="primary-button onboarding-plan-select" data-onboarding-plan="premium" type="button">Choose Core</button>
    </article>
  `;

  const demoCard = testMode || isDemoModeActive()
    ? `
      <article class="subscription-plan-card onboarding-plan-card demo-onboarding-card active">
        <div class="plan-topline">
          <span>Testing</span>
          <strong>Demo Account</strong>
        </div>
        <div class="plan-price">$100K<small> sandbox</small></div>
        <p>Use a no-risk account with fake stablecoin balances after the wallet-address step.</p>
        <ul>
          <li>Starts empty so onboarding can be tested</li>
          <li>Adds $100,000 to one owner wallet</li>
          <li>Good for testing templates and budget accounts</li>
        </ul>
        <button class="secondary-button onboarding-plan-select" data-onboarding-plan="demo" type="button">Use Demo Account</button>
      </article>
    `
    : "";

  return `${cards}${demoCard}`;
}
function openOnboardingWelcomeDialog({ testMode = false } = {}) {
  updateOnboardingFlow({ step: "welcome", testMode });
  openDialog(`
    <div class="dialog-content onboarding-modal onboarding-flow-modal onboarding-welcome-vault-lock" data-onboarding-lock="true" data-onboarding-step="welcome">
      <nav class="welcome-vault-nav" aria-label="AllocaFi onboarding">
        <span class="welcome-vault-logo">
          <img src="assets/allocafi-mark.svg" alt="" />
          <span>AllocaFi</span>
        </span>
      </nav>

      <section class="welcome-vault-hero">
        <div class="welcome-vault-copy">
          <span class="welcome-vault-kicker">WELCOME</span>
          <h2>Welcome to AllocaFi</h2>
          <p class="welcome-vault-subtitle">The smarter way to budget, save, and grow<br />with stablecoins.</p>

          <div class="welcome-vault-feature-list" aria-label="AllocaFi onboarding steps">
            <article>
              <span class="welcome-vault-feature-icon shield" aria-hidden="true"></span>
              <span>
                <strong>Non-custodial stablecoin budgeting, organized from day one.</strong>
                <small>Create smart budgets. Stay in control. Always.</small>
              </span>
            </article>
            <article>
              <span class="welcome-vault-feature-icon chart" aria-hidden="true"></span>
              <span>
                <strong>Choose a budget template.</strong>
                <small>Start fast with templates built for your goals.</small>
              </span>
            </article>
            <article>
              <span class="welcome-vault-feature-icon wallet" aria-hidden="true"></span>
              <span>
                <strong>Select a plan.</strong>
                <small>Free or AllocaFi Core.</small>
              </span>
            </article>
            <article>
              <span class="welcome-vault-feature-icon lock" aria-hidden="true"></span>
              <span>
                <strong>Add a USDC, USDT, or PYUSD wallet.</strong>
                <small>You're always in control of your funds.</small>
              </span>
            </article>
            <article>
              <span class="welcome-vault-feature-icon sign" aria-hidden="true"></span>
              <span>
                <strong>Activate your encrypted Vault.</strong>
                <small>Your wallet signature activates the encrypted data Vault. When you disconnect, your data stays encrypted until you connect again.</small>
              </span>
            </article>
          </div>
        </div>

        <div class="welcome-vault-art-wrap" aria-hidden="true">
          <img class="welcome-vault-art" src="assets/welcome-onboarding-vault-hero-20260603-clean.png" alt="" />
        </div>
      </section>

      <section class="welcome-vault-cards" aria-label="AllocaFi setup highlights">
        <article>
          <span class="welcome-vault-card-icon">1</span>
          <span>
            <strong>Choose A Budget Template</strong>
            <small>Start with a template.</small>
          </span>
        </article>
        <article>
          <span class="welcome-vault-card-icon">2</span>
          <span>
            <strong>Subscription Plan</strong>
            <small>Free or Core.</small>
          </span>
        </article>
        <article>
          <span class="welcome-vault-card-icon">3</span>
          <span>
            <strong>Wallet Signature Only</strong>
            <small>Activates encrypted data vault.</small>
          </span>
        </article>
      </section>

      <button class="primary-button welcome-vault-cta" id="onboardingChooseTemplate" type="button">
        <span>Choose Budget Template</span>
        <span class="welcome-vault-cta-arrow" aria-hidden="true"></span>
      </button>
      ${renderOnboardingFooter("welcome", "Next: select template.")}
    </div>
  `);

  dialogContent.querySelector("#onboardingChooseTemplate").addEventListener("click", () => {
    updateOnboardingFlow({ step: "template", templateKey: "", templateSelectedAt: "" });
    openOnboardingTemplateDialog();
  });
}
function openOnboardingTemplateDialog() {
  updateOnboardingFlow({ step: "template" });
  const previewWallet = getOnboardingPreviewWallet();
  let selectedTemplateKey = getOnboardingSelectedTemplateKey();
  let activeTemplateCategory = "Professional";
  let templateSearch = "";

  openDialog(`
    <div class="dialog-content budget-template-library-modal" data-onboarding-lock="true">
      <section class="budget-template-hero-card">
        <span class="budget-template-hero-icon" aria-hidden="true"><i></i></span>
        <span>
          <h2>Budget Template Library</h2>
          <p>Choose a budget account plan. Free will keep 3 core accounts. AllocaFi Core keeps the complete template.</p>
        </span>
        <span class="budget-template-hero-art" aria-hidden="true"><i></i><i></i><i></i></span>
      </section>

      <div id="assignmentTemplateChoices" class="budget-template-library-scroll" data-wallet-id="${escapeHtml(previewWallet.id)}">
        ${renderBudgetTemplateChoices(previewWallet, { selectedKey: selectedTemplateKey, activeCategory: activeTemplateCategory, search: templateSearch, allowLockedTemplates: true, requireTemplateSelection: true, actionLabel: "Continue to Plan" })}
      </div>
      <div class="dialog-actions onboarding-flow-actions onboarding-template-back-row">
        <button class="ghost-button" id="onboardingBackWelcomeFromTemplate" type="button">Back to Welcome</button>
      </div>
      ${renderOnboardingFooter("template", "Next: choose plan.")}
    </div>
  `);

  dialogContent.querySelector("#onboardingBackWelcomeFromTemplate")?.addEventListener("click", () => openOnboardingWelcomeDialog());
  const templateChoices = dialogContent.querySelector("#assignmentTemplateChoices");
  const renderTemplateLibrary = () => {
    templateChoices.innerHTML = renderBudgetTemplateChoices(previewWallet, {
      selectedKey: selectedTemplateKey,
      activeCategory: activeTemplateCategory,
      search: templateSearch,
      allowLockedTemplates: true,
      requireTemplateSelection: true,
      actionLabel: "Continue to Plan",
    });
  };

  templateChoices.addEventListener("click", (event) => {
    const autoAllocateButton = event.target.closest("[data-auto-allocate-template]");
    if (autoAllocateButton) {
      if (!selectedTemplateKey) {
        showToast("Choose a budget template first");
        return;
      }
      updateOnboardingFlow({ step: "plan", templateKey: selectedTemplateKey, templateSelectedAt: new Date().toISOString() });
      openOnboardingPlansDialog();
      return;
    }

    const categoryButton = event.target.closest("[data-template-category]");
    if (categoryButton) {
      activeTemplateCategory = categoryButton.dataset.templateCategory || "Professional";
      renderTemplateLibrary();
      return;
    }

    const card = event.target.closest("[data-template-select]");
    if (!card) return;
    selectedTemplateKey = card.dataset.templateSelect || "";
    if (!BUCKET_TEMPLATES[selectedTemplateKey]) return;
    updateOnboardingFlow({ templateKey: selectedTemplateKey, templateSelectedAt: new Date().toISOString() });
    renderTemplateLibrary();
  });

  templateChoices.addEventListener("input", (event) => {
    if (!event.target.matches("#budgetTemplateSearch")) return;
    templateSearch = event.target.value;
    renderTemplateLibrary();
    templateChoices.querySelector("#budgetTemplateSearch")?.focus();
  });
}
function openOnboardingPlansDialog({ testMode = false } = {}) {
  if (!hasOnboardingTemplateSelection()) {
    showToast("Choose a budget template first");
    return openOnboardingTemplateDialog();
  }
  updateOnboardingFlow({ step: "plan", testMode });
  openDialog(`
    <div class="dialog-content onboarding-modal onboarding-flow-modal wide-dialog" data-onboarding-lock="true" data-onboarding-step="plan">
      <div class="onboarding-flow-brand">
        <span class="onboarding-brand-mark" aria-hidden="true"></span>
        <strong>AllocaFi</strong>
      </div>
      <section class="onboarding-flow-main">
        <span class="subscription-kicker">Choose Plan</span>
        <h2>Choose your plan</h2>
        <p class="wallet-note">Your selected template is ready: <strong>${escapeHtml(getOnboardingSelectedTemplateName())}</strong>. Choose how much of it you want unlocked.</p>
        <div class="subscription-plan-grid onboarding-plan-grid">
          ${getOnboardingPlanCards(testMode)}
        </div>
        <div class="dialog-actions onboarding-flow-actions">
          <button class="ghost-button" id="onboardingBackTemplate" type="button">Back to Templates</button>
        </div>
      </section>
      ${renderOnboardingFooter("plan", "Next: add stablecoin owner wallet.")}
    </div>
  `);

  dialogContent.addEventListener("click", (event) => {
    const button = event.target.closest("[data-onboarding-plan]");
    if (!button) return;
    event.preventDefault();
    selectOnboardingPlan(button.dataset.onboardingPlan, { testMode });
  });
  dialogContent.querySelector("#onboardingBackTemplate").addEventListener("click", openOnboardingTemplateDialog);
}

function selectOnboardingPlan(planCode, { testMode = false } = {}) {
  const selectedPlanCode = planCode === "demo" ? "premium" : planCode === "premium" ? "premium" : "free";
  if (planCode === "demo") {
    saveSubscriptionState({ planCode: "premium", status: "demo_active", paymentMethod: "demo" });
    addSubscriptionHistory({ planCode: "demo", planName: "Demo Account", amount: 0, method: "demo", status: "onboarding" });
  } else if (selectedPlanCode === "free") {
    saveSubscriptionState({ planCode: "free", status: "active", paymentMethod: "free" });
    addSubscriptionHistory({ planCode: "free", planName: "Free", amount: 0, method: "onboarding", status: "selected" });
  } else {
    saveSubscriptionState({ planCode: "free", status: "pending_core", paymentMethod: "pending-stablecoin" });
    addSubscriptionHistory({ planCode: "premium", planName: "AllocaFi Core + Legal Core", amount: 7.99, method: "onboarding", status: "pending_signature" });
  }
  updateOnboardingFlow({
    step: "wallet",
    planCode: selectedPlanCode,
    selectedPlanCode,
    vaultSignatureStatus: selectedPlanCode === "free" ? "not_required" : "pending",
    corePaymentStatus: selectedPlanCode === "premium" ? "pending_signature" : "not_required",
  });
  openOnboardingWalletGuideDialog({ testMode: testMode || planCode === "demo", selectedPlanCode });
}
function getOnboardingWalletDiagnosis(networkKey, address) {
  const network = NETWORKS[networkKey];
  const availability = getWalletAvailability();
  const valid = Boolean(network && isValidAddressForNetwork(address, networkKey));
  const expectedWallet = network?.kind === "solana-token"
    ? "Phantom or Trust Wallet for Solana signing"
    : "Trust Wallet, MetaMask, Coinbase Wallet, or WalletConnect for EVM signing";
  const detected = network?.kind === "solana-token"
    ? availability.phantom || availability.trust
    : availability.trust || availability.injectedEvm || availability.walletConnect;

  if (!valid) {
    return {
      ok: false,
      title: "Address needs review",
      detail: `This does not look like a ${network?.asset || "supported"} ${network?.label || "wallet"} public address. If the wallet will not connect, make sure the user is using ${expectedWallet}.`,
    };
  }

  return {
    ok: true,
    title: "Wallet address connected",
    detail: detected
      ? `${expectedWallet} is available or configured. AllocaFi can track this public address, and wallet signing can be tested when needed.`
      : `The public address can be tracked. For wallet-signed sends, install or connect ${expectedWallet}.`,
  };
}

function openOnboardingWalletGuideDialog({ testMode = false, selectedPlanCode = "" } = {}) {
  const flow = loadOnboardingFlow();
  const planForScreen = selectedPlanCode || flow.selectedPlanCode || flow.planCode;
  const isFreePlan = planForScreen !== "premium";
  updateOnboardingFlow({ step: "wallet", testMode, planCode: planForScreen, selectedPlanCode: planForScreen });
  openDialog(`
    <div class="dialog-content onboarding-modal onboarding-flow-modal" data-onboarding-lock="true" data-onboarding-step="wallet">
      <div class="onboarding-flow-brand">
        <span class="onboarding-brand-mark" aria-hidden="true"></span>
        <strong>AllocaFi</strong>
      </div>
      <section class="onboarding-flow-main">
        <span class="subscription-kicker">Owner Wallet</span>
        <h2>Add your Owner Wallet</h2>
        <p class="wallet-note">${isFreePlan ? "Add a stablecoin public address. Free activates after this step and auto-allocates into 3 Virtual Budget Accounts." : "Start with the stablecoin wallet that funds your budget accounts. Core requires a signature-only verification step next."} Only USDC, USDT, or PYUSD can be used for initial setup.</p>
        <div class="send-grid onboarding-wallet-grid">
          <label>
            Stablecoin network
            <select id="onboardingNetwork">${getOnboardingNetworkOptions()}</select>
          </label>
          <label>
            Public wallet address
            <input id="onboardingAddress" spellcheck="false" placeholder="Paste USDC, USDT, or PYUSD wallet address" />
          </label>
        </div>
        <div class="onboarding-allowed-assets">
          <span>USDC allowed</span>
          <span>USDT allowed</span>
          <span>PYUSD allowed</span>
        </div>
        <div id="onboardingAiCheck" class="allocation-summary">
          <strong>${isFreePlan ? "Free activates limited tracking" : "Reserve assets are added later"}</strong>
          <span>${isFreePlan ? "After this address is saved, AllocaFi will read the public wallet value and auto-allocate the chosen template down to 3 budget accounts." : "BTC, ETH, SOL, LTC, XRP, ADA, AVAX, HBAR, BNB, and POL become reserve asset wallets after Core activation."}</span>
        </div>
        <div class="dialog-actions onboarding-flow-actions">
          <button class="primary-button" id="onboardingCheckWallet" type="button">${isFreePlan ? "Activate Free Plan" : "Continue with Owner Wallet"}</button>
          ${testMode ? `<button class="secondary-button" id="onboardingUseDemoAddress" type="button">Use Demo Address</button>` : ""}
          <button class="ghost-button" id="onboardingBackPlans" type="button">Back</button>
        </div>
      </section>
      ${renderOnboardingFooter("wallet", isFreePlan ? "Next: enter AllocaFi Free." : "Next: sign wallet for Core.")}
    </div>
  `);

  dialogContent.querySelector("#onboardingBackPlans").addEventListener("click", () => openOnboardingPlansDialog({ testMode }));
  dialogContent.querySelector("#onboardingUseDemoAddress")?.addEventListener("click", () => {
    dialogContent.querySelector("#onboardingNetwork").value = "solanaUsdc";
    dialogContent.querySelector("#onboardingAddress").value = "11111111111111111111111111111111";
    dialogContent.querySelector("#onboardingAiCheck").innerHTML = `
      <strong>Demo address loaded</strong>
      <span>Use this test address, then activate the Vault preview on the next step.</span>
    `;
  });
  dialogContent.querySelector("#onboardingCheckWallet").addEventListener("click", () => saveOnboardingWallet({ testMode }));
}
async function saveOnboardingWallet({ testMode = false } = {}) {
  const networkKey = dialogContent.querySelector("#onboardingNetwork").value;
  const address = cleanAddress(dialogContent.querySelector("#onboardingAddress").value);
  const network = NETWORKS[networkKey];
  const checkBox = dialogContent.querySelector("#onboardingAiCheck");

  if (!ONBOARDING_ALLOWED_OWNER_ASSETS.has(network?.asset)) {
    checkBox.innerHTML = `
      <strong>Stablecoin Owner Wallet required</strong>
      <span>Initial setup only accepts USDC, USDT, or PYUSD. Reserve assets are added after activation.</span>
    `;
    return;
  }

  const diagnosis = getOnboardingWalletDiagnosis(networkKey, address);
  checkBox.innerHTML = `
    <strong>${escapeHtml(diagnosis.title)}</strong>
    <span>${escapeHtml(diagnosis.detail)}</span>
  `;
  if (!diagnosis.ok) return;

  const now = new Date().toISOString();
  const wallet = {
    id: crypto.randomUUID(),
    name: `Owner ${network.asset} Wallet`,
    role: "Owner Wallet",
    network: networkKey,
    address,
    budget: 0,
    manualBalance: 0,
    balance: 0,
    note: "Primary stablecoin Owner Wallet added during onboarding.",
    status: "Owner wallet connected",
    statusType: "live",
    ownerWallet: true,
    demoMode: isDemoModeActive(),
    demoOnboarding: testMode || isDemoModeActive(),
    createdAt: now,
    updatedAt: now,
  };

  if (isDemoModeActive()) {
    wallets = [wallet];
    localStorage.setItem(ONBOARDING_DEMO_STAGE_KEY, "awaiting-funds");
  } else {
    const duplicate = wallets.some((item) => item.network === networkKey && item.address.toLowerCase() === address.toLowerCase());
    if (duplicate) {
      showToast("That wallet is already saved");
      return;
    }
    wallets = [wallet, ...wallets.filter((item) => !item.ownerWallet)];
  }

  selectedWalletId = wallet.id;
  const flow = loadOnboardingFlow();
  const onboardingPlanCode = flow.selectedPlanCode || flow.planCode;
  saveWallets();
  await refreshOnboardingOwnerWalletBalance(wallet, "#onboardingAiCheck");
  if (onboardingPlanCode === "free" && !isDemoModeActive()) {
    await completeFreeOnboarding(wallet, { testMode, balanceAlreadyChecked: true });
    return;
  }
  updateOnboardingFlow({ step: "vault", ownerWalletId: wallet.id, ownerWalletAddress: wallet.address });
  render();
  openOnboardingVaultSignatureDialog({ testMode: testMode || isDemoModeActive() });
}

async function completeFreeOnboarding(wallet, { testMode = false, balanceAlreadyChecked = false } = {}) {
  const statusBox = dialogContent.querySelector("#onboardingAiCheck");
  if (statusBox) {
    statusBox.innerHTML = `<strong>Activating Free plan</strong><span>Checking the public wallet balance and creating 3 Virtual Budget Accounts from your selected template.</span>`;
  }
  wallet.freePlanViewOnly = true;
  wallet.verifiedOwner = false;
  wallet.status = "Free tracking active";
  wallet.statusType = "live";
  saveSubscriptionState({ planCode: "free", status: "active", paymentMethod: "free" });
  updateOnboardingFlow({
    step: "complete",
    ownerWalletId: wallet.id,
    ownerWalletAddress: wallet.address,
    vaultSignatureStatus: "not_required",
    corePaymentStatus: "not_required",
  });
  saveWallets();
  if (!balanceAlreadyChecked) {
    await refreshOnboardingOwnerWalletBalance(wallet, "#onboardingAiCheck");
  }
  const activeWallet = wallets.find((item) => item.id === wallet.id) || wallet;
  const onboardingAllocation = applyOnboardingTemplateToWallet(activeWallet.id);
  const completed = updateOnboardingFlow({ step: "complete", completedAt: new Date().toISOString() });
  localStorage.setItem(ONBOARDING_STATUS_KEY, "complete");
  saveOnboardingFlow(completed);
  saveWallets();
  render();
  walletDialog.close();
  switchTab("overview");
  showToast(onboardingAllocation.awaitingFunds
    ? "Free plan activated. Add funds to this wallet, then press Refresh to fund your budget accounts."
    : "Free plan activated with 3 Virtual Budget Accounts");
}
function getOnboardingOwnerWallet() {
  const flow = loadOnboardingFlow();
  return wallets.find((item) => item.id === flow.ownerWalletId) || wallets.find((item) => item.ownerWallet) || wallets[0] || null;
}

function getOnboardingSignatureProviderOptions(wallet) {
  const network = NETWORKS[wallet?.network] || {};
  const chain = getVaultChainForNetwork(wallet?.network);
  const availability = getWalletAvailability();
  const options = chain === "solana"
    ? [
      { id: "phantom", label: "Phantom", detail: "Solana wallet extension", available: availability.phantom },
      { id: "trust", label: "Trust Wallet", detail: "Trust Wallet Solana extension", available: availability.trustSolana },
      { id: "walletconnect", label: "WalletConnect / Reown", detail: "Mobile Solana wallets", available: availability.walletConnect },
    ]
    : [
      { id: "trust", label: "Trust Wallet", detail: `${network.asset || "Stablecoin"} owner wallet`, available: availability.trust },
      { id: "metamask", label: "MetaMask", detail: "Ethereum-compatible wallet", available: availability.metamask },
      { id: "coinbase", label: "Coinbase Wallet", detail: "Coinbase browser wallet", available: availability.coinbase },
      { id: "walletconnect", label: "WalletConnect / Reown", detail: "Mobile EVM wallets", available: availability.walletConnect },
    ];
  return options.filter((option) => option.available);
}

function getOnboardingSignatureProviderLabel(providerId = "", wallet = null) {
  return getOnboardingSignatureProviderOptions(wallet).find((option) => option.id === providerId)?.label || "Selected wallet";
}

function renderOnboardingSignatureProviderPicker(wallet, selectedProvider = "", signatureVerified = false) {
  const options = getOnboardingSignatureProviderOptions(wallet);
  const selectedIsAvailable = options.some((option) => option.id === selectedProvider);
  const safeSelected = selectedIsAvailable ? selectedProvider : "";
  if (!options.length) {
    return `
      <div class="allocation-summary onboarding-signature-provider-warning">
        <strong>No matching wallet extension detected</strong>
        <span>Install or enable the wallet that owns ${escapeHtml(shortAddress(wallet.address))}, then reload this step. Wallet address alone cannot activate Core.</span>
      </div>
    `;
  }
  return `
    <label class="onboarding-signature-provider">
      <span>Sign from wallet</span>
      <select id="onboardingSignatureProvider" ${signatureVerified ? "disabled" : ""}>
        <option value="">Select the wallet that owns this address</option>
        ${options.map((option) => `
          <option value="${escapeHtml(option.id)}" ${option.id === safeSelected ? "selected" : ""}>${escapeHtml(option.label)} - ${escapeHtml(option.detail)}</option>
        `).join("")}
      </select>
      <small>Owner Wallet: ${escapeHtml(shortAddress(wallet.address))}. AllocaFi rejects signatures from any other wallet address.</small>
    </label>
  `;
}

function getOnboardingVaultMessage(wallet) {
  return [
    "AllocaFi Vault activation",
    `I confirm that I own this wallet address and want to activate encrypted AllocaFi Vault protection.`,
    `Wallet: ${wallet.address}`,
    `Timestamp: ${new Date().toISOString()}`,
    "This request does not authorize transactions, token approvals, transfers, delegation, or access to funds.",
  ].join("\n");
}

async function refreshOnboardingOwnerWalletBalance(wallet, statusSelector = "") {
  const statusBox = statusSelector ? dialogContent.querySelector(statusSelector) : null;
  const network = NETWORKS[wallet?.network] || {};
  const asset = network.asset || "stablecoin";
  if (!wallet) return { ok: false, hasFunds: false, value: 0, error: "Owner Wallet was not found" };
  if (statusBox) {
    statusBox.innerHTML = `<strong>Reading Owner Wallet balance</strong><span>Checking ${escapeHtml(asset)} at ${escapeHtml(shortAddress(wallet.address))}. This does not move funds.</span>`;
  }
  const previousValue = getWalletDisplayValue(wallet);
  wallet.status = "Checking balance";
  wallet.statusType = "loading";
  wallet.error = "";
  wallet.updatedAt = new Date().toISOString();
  saveWallets();

  try {
    try {
      wallet.balance = await fetchWalletBalance(wallet);
    } catch (error) {
      if (network.kind !== "solana-token") throw error;
      const diagnostics = await fetchSolanaTokenDiagnostics(wallet);
      if (diagnostics.pyusdBalance > 0) {
        wallet.balance = diagnostics.pyusdBalance;
        wallet.error = "";
      } else {
        throw new Error(diagnostics.errors[0] || error?.message || "Solana token request failed");
      }
    }

    if (network.kind === "solana-token" && wallet.balance <= 0) {
      const diagnostics = await fetchSolanaTokenDiagnostics(wallet);
      if (diagnostics.pyusdBalance > 0) {
        wallet.balance = diagnostics.pyusdBalance;
        wallet.error = "";
      } else if (diagnostics.tokens.length) {
        const found = diagnostics.tokens.slice(0, 3).map((token) => `${token.asset}: ${token.amount}`).join(", ");
        wallet.error = `Solana address works, but no ${asset} was found. Other tokens found: ${found}`;
      } else if (diagnostics.directTokenAccount) {
        wallet.error = diagnostics.directTokenAccount.mint === network.mint
          ? `Found ${formatUsd(diagnostics.directTokenAccount.amount)} ${asset} in this token account`
          : `This is a ${diagnostics.directTokenAccount.asset} token account, not a ${asset} wallet owner address`;
        if (diagnostics.directTokenAccount.mint === network.mint) wallet.balance = diagnostics.directTokenAccount.amount;
      } else if (diagnostics.errors.length) {
        wallet.error = `Could not find ${asset}. ${diagnostics.errors[0]}`;
      }
    }

    await refreshPrices();
    trackAllocationDelta(wallet, previousValue);
    const walletValue = getWalletDisplayValue(wallet);
    if (walletValue > 0.01) {
      wallet.status = "Live";
      wallet.statusType = "live";
      wallet.error = "";
      if (statusBox) {
        statusBox.innerHTML = `<strong>Balance detected</strong><span>${formatUsd(walletValue)} in ${escapeHtml(asset)} is ready for the selected budget template.</span>`;
      }
    } else {
      wallet.status = "Awaiting funds";
      wallet.statusType = "warning";
      wallet.error = wallet.error || `No ${asset} found yet. Add funds to this Owner Wallet and AllocaFi will update the budget accounts after Refresh.`;
      if (statusBox) {
        statusBox.innerHTML = `<strong>Wallet saved, funds not detected yet</strong><span>${escapeHtml(wallet.error)}</span>`;
      }
    }
    wallet.updatedAt = new Date().toISOString();
    saveWallets();
    return { ok: true, hasFunds: walletValue > 0.01, value: walletValue };
  } catch (error) {
    const message = error?.message || "Could not read wallet balance automatically";
    wallet.balance = Number(wallet.manualBalance || wallet.balance || 0);
    wallet.status = "Balance check failed";
    wallet.statusType = "error";
    wallet.error = `Could not check balance automatically: ${message}`;
    wallet.updatedAt = new Date().toISOString();
    saveWallets();
    if (statusBox) {
      statusBox.innerHTML = `<strong>Balance check needs review</strong><span>${escapeHtml(wallet.error)}</span>`;
    }
    return { ok: false, hasFunds: false, value: getWalletDisplayValue(wallet), error: message };
  }
}

async function requestOnboardingVaultSignature(wallet) {
  const flow = loadOnboardingFlow();
  const selectedProvider = dialogContent.querySelector("#onboardingSignatureProvider")?.value || flow.signatureWalletProvider || "";
  if (!selectedProvider) throw new Error("Choose the wallet extension that controls the Owner Wallet address");
  const ownerWallet = {
    address: wallet.address,
    chain: getVaultChainForNetwork(wallet.network),
    provider: getOnboardingSignatureProviderLabel(selectedProvider, wallet),
  };
  const message = getOnboardingVaultMessage(wallet);
  updateOnboardingFlow({ signatureWalletProvider: selectedProvider });
  try {
    return await requestVaultOwnerSignature(ownerWallet, { message }, { walletProvider: selectedProvider });
  } catch (error) {
    if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
      const confirmed = window.confirm("No matching wallet provider responded. Complete local onboarding preview without a real signature? Production still requires wallet signature verification.");
      if (!confirmed) throw error;
      const signature = await sha256Hex(`local-onboarding-preview:${ownerWallet.address}:${message}`);
      return { signature, encoding: "local-preview", message };
    }
    throw error;
  }
}

function openOnboardingVaultSignatureDialog({ testMode = false } = {}) {
  const wallet = getOnboardingOwnerWallet();
  if (!wallet) {
    updateOnboardingFlow({ step: "wallet" });
    openOnboardingWalletGuideDialog({ testMode });
    return;
  }
  const flow = loadOnboardingFlow();
  const signatureVerified = flow.vaultSignatureStatus === "verified";
  const selectedSignatureProvider = getOnboardingSignatureProviderOptions(wallet).some((option) => option.id === flow.signatureWalletProvider)
    ? flow.signatureWalletProvider
    : "";
  updateOnboardingFlow({ step: "vault", ownerWalletId: wallet.id, ownerWalletAddress: wallet.address, signatureWalletProvider: selectedSignatureProvider });
  openDialog(`
    <div class="dialog-content onboarding-modal onboarding-flow-modal" data-onboarding-lock="true" data-onboarding-step="vault">
      <div class="onboarding-flow-brand">
        <span class="onboarding-brand-mark" aria-hidden="true"></span>
        <strong>AllocaFi</strong>
      </div>
      <section class="onboarding-flow-main">
        <span class="subscription-kicker">AllocaFi Core</span>
        <h2>${signatureVerified ? "Complete Core payment" : "Sign from wallet"}</h2>
        <p class="wallet-note">${signatureVerified ? "Wallet ownership is verified. Complete the $7.99 stablecoin payment to unlock AllocaFi Core." : "Sign a free wallet message first. This proves wallet ownership and does not move funds, approve tokens, or grant AllocaFi spending permission."}</p>
        <div class="onboarding-vault-card ${signatureVerified ? "payment-ready" : ""}">
          <strong>${signatureVerified ? "Signature verified" : "Signature-only wallet verification"}</strong>
          <span>${escapeHtml(shortAddress(wallet.address))} - ${escapeHtml(NETWORKS[wallet.network]?.asset || "Stablecoin")}</span>
          <div class="onboarding-safe-list">
            ${signatureVerified ? `<span>Wallet verified</span><span>Payment required</span><span>Core unlock pending</span>` : `<span>No funds move</span><span>No token approvals</span><span>Signature only</span>`}
          </div>
          ${renderOnboardingSignatureProviderPicker(wallet, selectedSignatureProvider, signatureVerified)}
          <button class="primary-button onboarding-primary-cta" id="onboardingActivateVault" type="button" ${!signatureVerified && !selectedSignatureProvider ? "disabled aria-disabled=\"true\"" : ""}>${signatureVerified ? "Pay $7.99 USDC / PYUSD / USDT" : "Sign From Wallet"}</button>
          <small>${signatureVerified ? "Stablecoin payment step. Production routes through the connected wallet transaction." : "Free wallet signature. No transaction."}</small>
        </div>
        <div id="onboardingVaultStatus" class="allocation-summary">
          <strong>${signatureVerified ? "Ready for payment" : "After signature"}</strong>
          <span>${signatureVerified ? "The same button now completes the Core payment step and activates full template access." : "The button will change into Pay $7.99 USDC / PYUSD / USDT after your wallet signature is verified."}</span>
        </div>
        <div class="dialog-actions onboarding-flow-actions">
          <button class="ghost-button" id="onboardingBackWalletFromVault" type="button">Back</button>
        </div>
      </section>
      ${renderOnboardingFooter("vault", signatureVerified ? "Next: complete Core payment." : "Next: pay 7.99 stablecoin.")}
    </div>
  `);

  const signatureProviderSelect = dialogContent.querySelector("#onboardingSignatureProvider");
  const activateButton = dialogContent.querySelector("#onboardingActivateVault");
  signatureProviderSelect?.addEventListener("change", () => {
    const selectedProvider = signatureProviderSelect.value || "";
    updateOnboardingFlow({ signatureWalletProvider: selectedProvider });
    if (!signatureVerified) {
      activateButton.disabled = !selectedProvider;
      activateButton.setAttribute("aria-disabled", selectedProvider ? "false" : "true");
    }
    const statusBox = dialogContent.querySelector("#onboardingVaultStatus");
    if (statusBox && selectedProvider) {
      statusBox.innerHTML = `<strong>${escapeHtml(getOnboardingSignatureProviderLabel(selectedProvider, wallet))} selected</strong><span>Click Sign From Wallet. The signature must come from ${escapeHtml(shortAddress(wallet.address))} or AllocaFi will reject it.</span>`;
    }
  });
  dialogContent.querySelector("#onboardingBackWalletFromVault")?.addEventListener("click", () => openOnboardingWalletGuideDialog({ testMode, selectedPlanCode: "premium" }));
  activateButton.addEventListener("click", () => {
    if (signatureVerified) {
      completeCoreOnboardingPayment({ testMode });
      return;
    }
    activateOnboardingVault({ testMode });
  });
}

async function activateOnboardingVault({ testMode = false } = {}) {
  const wallet = getOnboardingOwnerWallet();
  const statusBox = dialogContent.querySelector("#onboardingVaultStatus");
  if (!wallet) return;
  statusBox.innerHTML = `<strong>Waiting for signature</strong><span>Approve the safe verification message in your wallet. No funds move.</span>`;
  try {
    const signatureType = classifyVaultSignatureRequest("vault_access");
    if (signatureType.movesFunds || signatureType.grantsApproval || signatureType.grantsDelegation) {
      throw new Error("Unsafe signature request blocked");
    }
    const signed = await requestOnboardingVaultSignature(wallet);
    const signatureHash = await sha256Hex(`${signed.signature}:${signed.message}:${signed.encoding}`);
    saveVault2OwnerWallet({
      address: wallet.address,
      chain: getVaultChainForNetwork(wallet.network),
      provider: NETWORKS[wallet.network]?.label || "Saved wallet",
      verificationStatus: "verified",
      signatureHash,
      lastSignatureAt: new Date().toISOString(),
      onboardingActivated: false,
      corePaymentStatus: "pending_payment",
    });
    saveVault2Session({
      token: crypto.randomUUID(),
      walletAddress: wallet.address,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
    addVaultActivity("Verified owner wallet signature during Core onboarding");
    updateOnboardingFlow({
      step: "vault",
      vaultSignatureStatus: "verified",
      corePaymentStatus: "pending_payment",
      coreSignatureHash: signatureHash,
    });
    showToast("Wallet signature verified. Complete Core payment.");
    openOnboardingVaultSignatureDialog({ testMode });
  } catch (error) {
    statusBox.innerHTML = `<strong>Signature needed</strong><span>${escapeHtml(error?.message || "Wallet signature is required before Core payment.")}</span>`;
    showToast(error?.message || "Vault signature required");
  }
}

async function completeCoreOnboardingPayment({ testMode = false } = {}) {
  const wallet = getOnboardingOwnerWallet();
  const statusBox = dialogContent.querySelector("#onboardingVaultStatus");
  if (!wallet) return;
  const flow = loadOnboardingFlow();
  if (flow.vaultSignatureStatus !== "verified") {
    showToast("Sign from wallet before paying for Core");
    return;
  }
  if (!confirmWalletRequestSafety("transaction", "This will request a wallet-approved $7.99 stablecoin payment for AllocaFi Core in production. Local preview records the payment without storing private keys.")) return;
  statusBox.innerHTML = `<strong>Processing Core payment</strong><span>Recording the $7.99 stablecoin payment preview and unlocking Core.</span>`;
  const network = NETWORKS[wallet.network] || {};
  const paymentHash = await sha256Hex(`allocafi-core-payment:${wallet.address}:${network.asset || "stablecoin"}:${Date.now()}`);
  saveSubscriptionState({
    planCode: "premium",
    status: "active",
    paymentMethod: `${network.asset || "Stablecoin"} onboarding payment`,
    lastPaymentHash: paymentHash,
  });
  addSubscriptionHistory({
    planCode: "premium",
    planName: "AllocaFi Core + Legal Core",
    amount: 7.99,
    method: network.asset || "Stablecoin",
    status: "paid",
    txHash: paymentHash,
  });
  await refreshOnboardingOwnerWalletBalance(wallet, "#onboardingVaultStatus");
  const onboardingAllocation = applyOnboardingTemplateToWallet(wallet.id);
  saveVault2OwnerWallet({
    address: wallet.address,
    chain: getVaultChainForNetwork(wallet.network),
    provider: network.label || "Saved wallet",
    verificationStatus: "verified",
    signatureHash: flow.coreSignatureHash || "",
    lastSignatureAt: new Date().toISOString(),
    onboardingActivated: true,
    corePaymentStatus: "paid",
    corePaymentHash: paymentHash,
  });
  addVaultActivity("Activated AllocaFi Core after wallet signature and stablecoin payment");
  const completed = updateOnboardingFlow({
    step: "complete",
    vaultSignatureStatus: "verified",
    corePaymentStatus: "paid",
    corePaymentHash: paymentHash,
    completedAt: new Date().toISOString(),
  });
  localStorage.setItem(ONBOARDING_STATUS_KEY, "complete");
  saveOnboardingFlow(completed);
  saveWallets();
  render();
  walletDialog.close();
  switchTab("overview");
  showToast(onboardingAllocation.awaitingFunds
    ? "AllocaFi Core activated. Add funds to this wallet, then press Refresh to fund your budget accounts."
    : "AllocaFi Core activated");
}
function openOnboardingWalletResultDialog(walletId, diagnosis, { testMode = false } = {}) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet) return;
  openDialog(`
    <div class="dialog-content onboarding-modal">
      <span class="subscription-kicker">Wallet check</span>
      <h2>${escapeHtml(diagnosis.title)}</h2>
      <p class="wallet-note">${escapeHtml(diagnosis.detail)}</p>
      <div class="stats-grid">
        <div class="stat-tile"><span>Wallet</span><strong>${escapeHtml(shortAddress(wallet.address))}</strong></div>
        <div class="stat-tile"><span>Asset</span><strong>${escapeHtml(getWalletAssetLabel(wallet))}</strong></div>
        <div class="stat-tile"><span>Balance</span><strong>${formatUsd(getWalletDisplayValue(wallet))}</strong></div>
      </div>
      <div class="dialog-actions">
        ${testMode ? `<button class="primary-button" id="onboardingAddDemoFunds" type="button">Add Demo Funds</button>` : `<button class="primary-button" id="onboardingCreateBuckets" type="button">Choose Budget Template</button>`}
        <button class="secondary-button" id="onboardingGoWallet" type="button">View Wallet</button>
      </div>
      <p class="form-note">${testMode ? "Demo funds are fake balances for onboarding tests only." : "Next, use Auto Allocate to create Virtual Budget Accounts."}</p>
    </div>
  `);

  dialogContent.querySelector("#onboardingAddDemoFunds")?.addEventListener("click", () => injectOnboardingDemoFunds(wallet.id));
  dialogContent.querySelector("#onboardingCreateBuckets")?.addEventListener("click", openAssignMoneyDialog);
  dialogContent.querySelector("#onboardingGoWallet").addEventListener("click", () => {
    walletDialog.close();
    switchTab("wallets");
  });
}

function buildOnboardingFundedWallets(sourceWallet, now) {
  const primaryNetwork = NETWORKS[sourceWallet.network] ? sourceWallet.network : "solanaPyusd";
  const primaryNetworkMeta = NETWORKS[primaryNetwork];
  return [createDemoWallet({
    name: `${primaryNetworkMeta.asset} Owner Demo Wallet`,
    network: primaryNetwork,
    address: sourceWallet.address,
    balance: 100000,
    note: "Primary owner demo wallet funded for single-wallet allocation testing.",
    withStarterBudgetAccounts: true,
  }, now)].map((wallet) => ({
    ...wallet,
    demoOnboarding: false,
  }));
}
function injectOnboardingDemoFunds(walletId) {
  const sourceWallet = wallets.find((item) => item.id === walletId) || wallets[0];
  if (!sourceWallet) {
    showToast("Add a demo wallet address first");
    return;
  }
  const now = new Date().toISOString();
  wallets = buildOnboardingFundedWallets(sourceWallet, now);
  selectedWalletId = wallets[0]?.id || "";
  localStorage.setItem(ONBOARDING_DEMO_STAGE_KEY, "funded");
  saveWallets();
  render();
  switchTab("wallets");
  showToast("Demo funds added to the owner wallet");
  openOnboardingTutorialDialog();
}

function openOnboardingTutorialDialog() {
  openDialog(`
    <div class="dialog-content onboarding-modal">
      <span class="subscription-kicker">Final step</span>
      <h2>Create Virtual Budget Accounts</h2>
      <p class="wallet-note">Your owner demo wallet is ready. The guide can now help you create budget accounts, customize percentages, and learn where each tool lives.</p>
      <div class="onboarding-step-list">
        <div><strong>1. Auto Allocate</strong><span>Choose a budget template and split funds into Virtual Budget Accounts.</span></div>
        <div><strong>2. Customize Budget Accounts</strong><span>Keep the budget accounts you want, edit percentages, and choose rules-based or AI-assisted allocation.</span></div>
        <div><strong>3. Ask Account Helper</strong><span>Use the Settings helper for common questions before using live AI calls.</span></div>
      </div>
      <div class="dialog-actions">
        <button class="primary-button" id="onboardingAutoAllocate" type="button">Auto Allocate Now</button>
        <button class="secondary-button" id="onboardingOpenHelper" type="button">Open Account Helper</button>
        <button class="ghost-button" id="onboardingFinish" type="button">Finish</button>
      </div>
    </div>
  `);

  dialogContent.querySelector("#onboardingAutoAllocate").addEventListener("click", openAssignMoneyDialog);
  dialogContent.querySelector("#onboardingOpenHelper").addEventListener("click", openAccountHelperDialog);
  dialogContent.querySelector("#onboardingFinish").addEventListener("click", () => {
    localStorage.setItem(ONBOARDING_STATUS_KEY, "complete");
    walletDialog.close();
  });
}

function startOnboardingTestFlow() {
  if (!startOnboardingDemoMode()) return;
  openOnboardingWelcomeDialog({ testMode: true });
}

function getAccountHelperAnswer(question) {
  const normalized = String(question || "").toLowerCase();
  const match = ACCOUNT_HELPER_KB.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)));
  return match || {
    id: "fallback",
    title: "Best Next Step",
    answer: "Try Settings for onboarding and account controls, Wallets for public addresses, Accounts for Virtual Budget Accounts, and Auto Allocate for templates. A future AI call can analyze new questions that are not in this local guide.",
  };
}

function renderAccountHelperAnswer(question = "") {
  const answer = getAccountHelperAnswer(question);
  return `
    <div class="allocation-summary account-helper-answer">
      <strong>${escapeHtml(answer.title)}</strong>
      <span>${escapeHtml(answer.answer)}</span>
    </div>
  `;
}

function openAccountHelperDialog() {
  openDialog(`
    <div class="dialog-content onboarding-modal">
      <span class="subscription-kicker">Account Helper</span>
      <h2>Ask setup and navigation questions</h2>
      <p class="wallet-note">This helper answers common questions from a local guide first. New or unusual questions can later fall back to AI, which cuts down on repeated AI calls.</p>
      <div class="send-grid">
        <label>
          Question
          <input id="accountHelperQuestion" placeholder="How do I connect Phantom or edit budget accounts?" />
        </label>
      </div>
      <div class="onboarding-chip-grid">
        <button class="helper-chip" data-helper-question="How do I add a wallet address?" type="button">Wallet address</button>
        <button class="helper-chip" data-helper-question="What is Premium for?" type="button">Plans</button>
        <button class="helper-chip" data-helper-question="How do I customize budget accounts?" type="button">Budget Accounts</button>
        <button class="helper-chip" data-helper-question="How does demo funding work?" type="button">Demo funds</button>
      </div>
      <div id="accountHelperAnswer">${renderAccountHelperAnswer("wallet")}</div>
      <div class="dialog-actions">
        <button class="primary-button" id="askAccountHelper" type="button">Ask Helper</button>
      </div>
    </div>
  `);

  const questionInput = dialogContent.querySelector("#accountHelperQuestion");
  const answerBox = dialogContent.querySelector("#accountHelperAnswer");
  const ask = () => {
    answerBox.innerHTML = renderAccountHelperAnswer(questionInput.value);
  };
  dialogContent.querySelector("#askAccountHelper").addEventListener("click", ask);
  dialogContent.querySelectorAll("[data-helper-question]").forEach((button) => {
    button.addEventListener("click", () => {
      questionInput.value = button.dataset.helperQuestion;
      ask();
    });
  });
}

function maybeOpenFirstRunOnboarding() {
  if (!shouldForceOnboardingGate() || walletDialog.open) return;
  openCurrentOnboardingStep();
}

function exitDemoMode() {
  if (!isDemoModeActive()) {
    showToast("Demo mode is not active");
    return;
  }
  if (!window.confirm("Exit demo mode and restore your previous local AllocaFi data?")) return;
  const backup = readDemoModeBackup();
  wallets = Array.isArray(backup?.wallets) ? backup.wallets : [];
  goals = Array.isArray(backup?.goals) ? backup.goals : [];
  addressBook = Array.isArray(backup?.addressBook) ? backup.addressBook : [];
  financeData = mergeFinanceDefaults(backup?.financeData || {});
  selectedWalletId = backup?.selectedWalletId && wallets.some((wallet) => wallet.id === backup.selectedWalletId)
    ? backup.selectedWalletId
    : wallets[0]?.id || "";
  saveAiInsightsState(backup?.aiInsightsState || { insights: [], mode: "local", updatedAt: new Date().toISOString() });
  saveAiCategorySuggestions(Array.isArray(backup?.aiCategorySuggestions) ? backup.aiCategorySuggestions : []);
  clearDemoModeState();
  saveWallets();
  saveGoals();
  saveAddressBook();
  saveFinanceData();
  render();
  switchTab("settings");
  showToast("Demo mode ended");
}

walletDialog.addEventListener("cancel", (event) => {
  if (dialogContent.querySelector("[data-onboarding-lock='true']") || shouldForceOnboardingGate()) {
    event.preventDefault();
  }
});

exportButton.addEventListener("click", () => {
  downloadJson("allocafi-wallets.json", wallets);
});

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function exportTransactionsCsv() {
  const rows = [[
    "date",
    "wallet",
    "wallet_address",
    "network",
    "asset",
    "bucket",
    "amount_usd",
    "flow_direction",
    "receipt_id",
    "cycle_label",
    "cycle_period",
    "asset_amount",
    "recipient",
    "tx_hash",
    "note",
  ]];
  getAllTransactions().forEach((tx) => {
    const cycle = getTransactionCycleInfo(tx);
    rows.push([
      tx.createdAt,
      tx.walletName,
      tx.walletAddress,
      tx.network,
      tx.asset,
      tx.bucketName,
      tx.amount,
      getTransactionFlowLabel(getTransactionFlowDirection(tx)),
      getTransactionReceiptId(tx),
      cycle.label,
      cycle.period,
      tx.assetAmount || "",
      tx.recipient || "",
      tx.txHash || "",
      tx.note || "",
    ]);
  });
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "allocafi-transactions.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function exportFullBackup() {
  downloadJson("allocafi-backup.json", {
    app: "AllocaFi",
    version: 1,
    exportedAt: new Date().toISOString(),
    wallets,
    goals,
    addressBook,
    financeData,
  });
  showToast("Backup exported");
}

function loadVaultActivity() {
  try {
    return JSON.parse(localStorage.getItem(VAULT_ACTIVITY_KEY)) || [];
  } catch {
    return [];
  }
}

function addVaultActivity(message) {
  const activity = loadVaultActivity();
  activity.unshift({ id: crypto.randomUUID(), message, createdAt: new Date().toISOString() });
  localStorage.setItem(VAULT_ACTIVITY_KEY, JSON.stringify(activity.slice(0, 12)));
  renderVaultDashboard();
}

function loadJsonStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function saveJsonStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function bytesToHex(bytes) {
  return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function textToHex(text) {
  return "0x" + bytesToHex(textToBytes(text));
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", textToBytes(value));
  return bytesToHex(new Uint8Array(digest));
}

function getAutoVaultPassword() {
  return autoVaultSessionPassword;
}

function loadVault2OwnerWallet() {
  return loadJsonStorage(VAULT2_OWNER_WALLET_KEY, null);
}

function saveVault2OwnerWallet(ownerWallet) {
  if (!ownerWallet) {
    localStorage.removeItem(VAULT2_OWNER_WALLET_KEY);
    return;
  }
  saveJsonStorage(VAULT2_OWNER_WALLET_KEY, {
    ...ownerWallet,
    updatedAt: new Date().toISOString(),
  });
}

function loadVault2RecoveryWallets() {
  return loadJsonStorage(VAULT2_RECOVERY_WALLETS_KEY, []);
}

function loadVault2TrustedDevices() {
  return loadJsonStorage(VAULT2_TRUSTED_DEVICES_KEY, []);
}

function saveVault2TrustedDevices(devices) {
  saveJsonStorage(VAULT2_TRUSTED_DEVICES_KEY, devices.slice(0, 8));
}

function loadVault2Session() {
  const session = loadJsonStorage(VAULT2_SESSION_KEY, null);
  if (!session?.token || !session.expiresAt || Date.parse(session.expiresAt) <= Date.now()) return null;
  return session;
}

function saveVault2Session(session) {
  if (!session?.token) return;
  saveJsonStorage(VAULT2_SESSION_KEY, session);
}

function loadVault2SnapshotHistory() {
  return loadJsonStorage(VAULT2_SNAPSHOT_HISTORY_KEY, []);
}

function saveVault2SnapshotHistory(snapshot) {
  const history = loadVault2SnapshotHistory();
  saveJsonStorage(VAULT2_SNAPSHOT_HISTORY_KEY, [snapshot, ...history].slice(0, 42));
}

function getVaultChainForNetwork(networkKey) {
  const network = NETWORKS[networkKey];
  if (network?.kind?.startsWith("solana")) return "solana";
  if (network?.kind?.startsWith("evm")) return "evm";
  return network?.label?.toLowerCase().includes("solana") ? "solana" : "evm";
}

function getVaultOwnerCandidate() {
  if (connectedSolanaAccount) {
    return { address: connectedSolanaAccount, chain: "solana", provider: connectedSolanaWalletLabel || "Solana Wallet" };
  }
  if (connectedAccount) {
    return { address: connectedAccount, chain: "evm", provider: connectedWalletLabel || "EVM Wallet" };
  }
  const selectedWallet = wallets.find((wallet) => wallet.id === selectedWalletId) || wallets[0];
  if (!selectedWallet?.address) return null;
  return {
    address: selectedWallet.address,
    chain: getVaultChainForNetwork(selectedWallet.network),
    provider: NETWORKS[selectedWallet.network]?.label || "Saved wallet",
  };
}

function classifyVaultSignatureRequest(kind = "vault_access") {
  if (kind === "vault_access") {
    return {
      classification: "safe-verification",
      movesFunds: false,
      grantsApproval: false,
      grantsDelegation: false,
      label: "Safe Vault verification",
    };
  }
  return {
    classification: "dangerous-transaction",
    movesFunds: true,
    grantsApproval: true,
    grantsDelegation: true,
    label: "Transaction or approval",
  };
}

function confirmWalletRequestSafety(kind, detail) {
  const request = classifyVaultSignatureRequest(kind);
  if (!request.movesFunds && !request.grantsApproval && !request.grantsDelegation) return true;
  return window.confirm([
    "Wallet safety check",
    detail || "This wallet request may move funds or grant permissions.",
    "Only continue if the recipient, amount, token, and network are correct.",
  ].join("\n\n"));
}

async function getVault2DeviceFingerprint() {
  const profile = [
    navigator.userAgent,
    navigator.language,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    location.origin,
  ].join("|");
  return sha256Hex(profile);
}

function createVault2AssetReference(type, id) {
  return `vault2-encrypted-ref://${type}/${id}`;
}

function collectVault2AssetRecords(ownerWallet = loadVault2OwnerWallet()) {
  const ownerAddress = ownerWallet?.address || "pending-owner";
  const records = [];
  const pushRecord = (type, sourceId, label, alfiCost = 0) => {
    records.push({
      id: `${type}-${sourceId}`,
      ownerWallet: ownerAddress,
      assetType: type,
      label,
      alfiCost,
      version: 1,
      permissions: ["owner"],
      encryptedAssetRef: createVault2AssetReference(type, sourceId),
      createdAt: new Date().toISOString(),
    });
  };

  (aiInsightsState?.insights || []).slice(0, 12).forEach((insight, index) => {
    pushRecord("ai_budget_memory", insight.id || `insight-${index}`, insight.title || "AI budget insight", 0);
  });
  (aiCategorySuggestions || []).slice(0, 12).forEach((suggestion, index) => {
    pushRecord("ai_category_recommendation", suggestion.id || `category-${index}`, suggestion.category || "AI category suggestion", 0);
  });
  (ledgerCoreState?.exports || []).slice(0, 12).forEach((item) => {
    pushRecord("tax_ledger_report", item.id || item.createdAt || crypto.randomUUID(), item.type || "LedgerCore export", 0);
  });
  syncLegalCoreAssetRecords().slice(0, 12).forEach((item) => {
    pushRecord("virtual_asset_account", item.accountId || item.id || crypto.randomUUID(), item.accountName || "Virtual Asset Account", 0);
    pushRecord("legal_core_record", item.id || item.accountId || crypto.randomUUID(), item.legalCoreStatus || "Legal Core record", 0);
  });
  (subscriptionBillingHistory || []).slice(0, 12).forEach((item) => {
    pushRecord("premium_billing_record", item.id || item.createdAt || crypto.randomUUID(), item.planCode || "Premium record", 0);
  });

  const saved = loadJsonStorage(VAULT2_ASSET_RECORDS_KEY, []);
  return [...records, ...saved].slice(0, 80);
}

function collectVault2State() {
  const ownerWallet = loadVault2OwnerWallet();
  return {
    ownerWallet,
    recoveryWallets: loadVault2RecoveryWallets(),
    trustedDevices: loadVault2TrustedDevices(),
    session: loadVault2Session() ? { active: true, expiresAt: loadVault2Session().expiresAt } : { active: false },
    snapshots: loadVault2SnapshotHistory().map(({ id, createdAt, encryptedSizeBytes, retention }) => ({ id, createdAt, encryptedSizeBytes, retention })),
    assetRecords: collectVault2AssetRecords(ownerWallet).map(({ id, assetType, label, alfiCost, version, permissions, encryptedAssetRef, createdAt }) => ({ id, assetType, label, alfiCost, version, permissions, encryptedAssetRef, createdAt })),
  };
}

function restoreVault2State(vault2 = {}) {
  if (vault2.ownerWallet) saveVault2OwnerWallet(vault2.ownerWallet);
  if (Array.isArray(vault2.recoveryWallets)) saveJsonStorage(VAULT2_RECOVERY_WALLETS_KEY, vault2.recoveryWallets);
  if (Array.isArray(vault2.trustedDevices)) saveVault2TrustedDevices(vault2.trustedDevices);
  if (Array.isArray(vault2.assetRecords)) saveJsonStorage(VAULT2_ASSET_RECORDS_KEY, vault2.assetRecords);
}

function createVault2Manifest() {
  const ownerWallet = loadVault2OwnerWallet();
  const data = collectVaultData();
  const history = loadVault2SnapshotHistory();
  const assetRecords = collectVault2AssetRecords(ownerWallet);
  return {
    schemaVersion: 2,
    zeroKnowledge: true,
    ownerWallet: ownerWallet ? { address: ownerWallet.address, chain: ownerWallet.chain, verificationStatus: ownerWallet.verificationStatus } : null,
    dataTypes: {
      financial: wallets.length,
      virtualAccounts: wallets.flatMap((wallet) => wallet.allocation?.buckets || []).length,
      transactions: wallets.flatMap((wallet) => wallet.allocation?.transactions || []).length,
      premium: subscriptionState?.planCode || subscriptionState?.activePlan || "free",
      alfiRecords: ALFI_RULES.length,
      aiMemory: (aiInsightsState?.insights || []).length + (aiCategorySuggestions || []).length,
      assets: assetRecords.length,
      family: Boolean(familyTreasuryMemberId),
      enterprise: Boolean(enterpriseDashboardRole),
      commerce: Boolean(allocafiPayState?.profile || allocafiPayState?.methods?.length),
    },
    storage: {
      encryptedReferencesOnly: true,
      localCacheBytes: byteSize(data),
      retainedVersions: history.length,
    },
    generatedAssets: assetRecords.map(({ id, assetType, version, alfiCost, permissions, encryptedAssetRef }) => ({ id, assetType, version, alfiCost, permissions, encryptedAssetRef })),
    createdAt: new Date().toISOString(),
  };
}


async function createVaultExportChallenge(ownerWallet, exportType) {
  const response = await fetch("/api/vault/export/challenge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ownerWallet: ownerWallet.address, chain: ownerWallet.chain, exportType }),
  });
  if (!response.ok) throw new Error("Vault export challenge failed");
  return response.json();
}

function buildLocalVaultExportPayload(exportType) {
  const summary = getUnifiedSummary();
  const now = new Date().toISOString();
  if (exportType === "basic_budget") {
    return {
      exportType,
      createdAt: now,
      buckets: financeData.unifiedBuckets.map((bucket) => ({ name: bucket.name, monthlyGoal: bucket.monthlyGoal, allocated: bucket.allocated, spent: bucket.spent })),
      spendingSummary: { monthlyIncome: summary.monthlyIncome, monthlySpending: summary.monthlySpending },
    };
  }
  if (exportType === "tax_ledger" || exportType === "accountant_package") {
    return {
      exportType,
      createdAt: now,
      taxCategories: getLedgerCategoryBreakdown?.() || [],
      receiptMetadata: ledgerCoreState?.receipts || [],
      assetAccounts: buildVaultAssetExportStructure(),
      notes: "Accountant-ready export requires wallet signature verification and excludes private keys.",
    };
  }
  if (exportType === "ai_report") {
    return {
      exportType,
      createdAt: now,
      aiReports: allocafiAiChat.filter((message) => message.role === "assistant").slice(-12),
      recommendations: aiInsightsState?.insights || [],
    };
  }
  return {
    exportType,
    createdAt: now,
    encryptedBackup: true,
    vault2: collectVault2State(),
    note: "Full backup packages must be encrypted before persistent storage.",
  };
}

function downloadVaultExportPackage(exportType, payload) {
  const stamp = new Date().toISOString().slice(0, 10);
  if (exportType === "basic_budget") {
    const rows = [["Bucket", "Monthly Goal", "Allocated", "Spent"], ...(payload.buckets || []).map((bucket) => [bucket.name, bucket.monthlyGoal, bucket.allocated, bucket.spent])];
    downloadLedgerFile(`allocafi-basic-budget-export-${stamp}.csv`, rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n"), "text/csv");
    return;
  }
  if (exportType === "accountant_package" || exportType === "tax_ledger") {
    downloadLedgerFile(`allocafi-${exportType}-${stamp}.json`, JSON.stringify(payload, null, 2), "application/json");
    return;
  }
  downloadJson(`allocafi-${exportType}-${stamp}.json`, payload);
}

async function requestSecureVaultExport(exportType) {
  const ownerWallet = loadVault2OwnerWallet();
  if (!ownerWallet?.address) {
    showToast("Set and verify your Owner Wallet before exporting Vault data");
    return;
  }
  let challenge;
  try {
    challenge = await createVaultExportChallenge(ownerWallet, exportType);
  } catch {
    showToast("Secure export server route is not available yet");
    return;
  }
  let signed;
  try {
    signed = await requestVaultOwnerSignature(ownerWallet, { message: challenge.message });
  } catch (error) {
    showToast(error?.message || "Wallet signature required for export");
    saveVaultExportLog({ id: localId(), walletAddress: ownerWallet.address, exportType, status: "signature_failed", createdAt: new Date().toISOString() });
    return;
  }
  const payload = buildLocalVaultExportPayload(exportType);
  const encryptedVault = exportType === "full_vault_backup"
    ? { ciphertext: "encrypted-client-side-package", encryption: { method: "AES-256-GCM" } }
    : undefined;
  const response = await fetch("/api/vault/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      exportRequestId: challenge.exportRequestId,
      exportType,
      ownerWallet: ownerWallet.address,
      chain: ownerWallet.chain,
      signedMessage: challenge.message,
      signature: signed.signature,
      signatureEncoding: signed.encoding,
      plan: subscriptionState?.planCode || "free",
      alfiBalance: getAllocafiAiBalance(),
      encryptedVault,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    showToast(data.message || "Vault export denied");
    saveVaultExportLog({ id: localId(), walletAddress: ownerWallet.address, exportType, status: "denied", reason: data.message || data.code, createdAt: new Date().toISOString() });
    return;
  }
  const audit = {
    id: data.exportRequest?.id || localId(),
    walletAddress: ownerWallet.address,
    exportType,
    status: "exported",
    expiresAt: data.exportRequest?.expiresAt,
    createdAt: new Date().toISOString(),
  };
  saveVaultExportLog(audit);
  addVaultActivity(`Vault export created: ${exportType}`);
  downloadVaultExportPackage(exportType, { ...payload, walletVerificationProof: { walletAddress: ownerWallet.address, exportRequestId: challenge.exportRequestId, signatureStatus: "verified", expiresAt: data.exportRequest?.expiresAt } });
  showToast("Secure Vault export created");
  renderVault2SecurityPanel();
}

function renderVault2SecurityPanel() {
  if (!vault2SecurityView) return;
  const ownerWallet = loadVault2OwnerWallet();
  const session = loadVault2Session();
  const devices = loadVault2TrustedDevices();
  const recoveryWallets = loadVault2RecoveryWallets();
  const history = loadVault2SnapshotHistory();
  const assetRecords = collectVault2AssetRecords(ownerWallet);
  const signatureType = classifyVaultSignatureRequest("vault_access");
  const exportLogs = loadVaultExportLogs();

  if (vault2AssetCount) vault2AssetCount.textContent = String(assetRecords.length);
  if (vault2AssetView) {
    vault2AssetView.innerHTML = assetRecords.length ? assetRecords.slice(0, 8).map((asset) => `
      <div class="overview-row compact">
        <span>${escapeHtml(asset.label || asset.assetType)}</span>
        <strong>${escapeHtml(asset.assetType)}</strong>
      </div>
    `).join("") : `<p class="wallet-note">Generated AI assets, reports, skins, and commerce media will register here as encrypted ownership records.</p>`;
  }
  if (vault2DeviceCount) vault2DeviceCount.textContent = String(devices.length);
  if (vault2DeviceView) {
    vault2DeviceView.innerHTML = devices.length ? devices.map((device) => `
      <div class="overview-row compact">
        <span>${escapeHtml(device.label || "Trusted device")}</span>
        <strong>${device.trusted ? "Trusted" : "Review"}</strong>
      </div>
    `).join("") : `<p class="wallet-note">No trusted device recorded yet. Verification adds this browser without storing private keys.</p>`;
  }

  vault2SecurityView.innerHTML = `
    <section class="overview-card vault2-owner-card">
      <div class="overview-card-head">
        <span>Primary Owner Wallet</span>
        <strong>${ownerWallet ? escapeHtml(shortAddress(ownerWallet.address)) : "Not set"}</strong>
      </div>
      <p class="wallet-note">Your Owner Wallet protects access to your encrypted AllocaFi Vault. Keep control of this wallet. You will need it to restore your dashboard, ALFI Credits, subscriptions, generated assets, reports, tax records, and encrypted financial data.</p>
      <div class="vault2-status-grid">
        <div><span>Verification</span><strong>${ownerWallet?.verificationStatus === "verified" ? "Verified" : "Signature needed"}</strong></div>
        <div><span>Session</span><strong>${session ? "Active" : "Locked"}</strong></div>
        <div><span>Recovery wallets</span><strong>${recoveryWallets.length}/2</strong></div>
        <div><span>Snapshot versions</span><strong>${history.length}</strong></div>
      </div>
    </section>
    <section class="overview-card vault2-owner-card">
      <div class="overview-card-head">
        <span>Signature Safety</span>
        <strong>${escapeHtml(signatureType.classification)}</strong>
      </div>
      <div class="vault2-safety-list">
        <div><span>No funds move</span><strong>${signatureType.movesFunds ? "No" : "Yes"}</strong></div>
        <div><span>No token approvals</span><strong>${signatureType.grantsApproval ? "No" : "Yes"}</strong></div>
        <div><span>No delegation rights</span><strong>${signatureType.grantsDelegation ? "No" : "Yes"}</strong></div>
      </div>
    </section>
    <section class="overview-card vault2-owner-card vault-export-card">
      <div class="overview-card-head">
        <span>Secure Vault Export</span>
        <strong>Wallet signature required</strong>
      </div>
      <p class="wallet-note">Wallet address alone never unlocks private financial data. Export requires Primary Owner Wallet match, free message signature, server verification, audit log, and expiring package access.</p>
      <div class="vault-export-grid">
        <button data-vault-export="basic_budget" type="button">Basic Budget Export</button>
        <button data-vault-export="tax_ledger" type="button">Tax Ledger Export</button>
        <button data-vault-export="ai_report" type="button">AI Report Export</button>
        <button data-vault-export="full_vault_backup" type="button">Full Vault Backup</button>
        <button data-vault-export="accountant_package" type="button">Accountant Package</button>
      </div>
      <div class="overview-list">${exportLogs.slice(0, 4).map((log) => `<div class="overview-row compact"><span>${escapeHtml(log.exportType)}</span><strong>${escapeHtml(log.status)}</strong></div>`).join("") || `<p class="wallet-note">No secure exports yet.</p>`}</div>
    </section>
  `;
  vault2SecurityView.querySelectorAll("[data-vault-export]").forEach((button) => {
    button.addEventListener("click", () => requestSecureVaultExport(button.dataset.vaultExport));
  });
}
async function setPrimaryVaultOwnerWallet() {
  const candidate = getVaultOwnerCandidate();
  if (!candidate) {
    showToast("Connect or save a wallet address first");
    return;
  }
  const existing = loadVault2OwnerWallet();
  if (existing?.address && existing.address !== candidate.address && !window.confirm("Replace the current Owner Wallet? The new wallet must verify before restore access is granted.")) return;
  saveVault2OwnerWallet({
    ...candidate,
    verificationStatus: "pending_signature",
    createdAt: existing?.createdAt || new Date().toISOString(),
  });
  addVaultActivity(`Owner Wallet set to ${shortAddress(candidate.address)}`);
  renderVault2SecurityPanel();
  showToast("Owner Wallet saved. Verify it to unlock Vault 2.0 recovery.");
}

async function requestVaultOwnerSignature(ownerWallet, challenge, options = {}) {
  const walletProvider = options.walletProvider || "auto";
  if (ownerWallet.chain === "solana") {
    const provider = await getSolanaProvider(walletProvider);
    const activeAddress = connectedSolanaAccount || provider.publicKey?.toString?.();
    if (activeAddress !== ownerWallet.address) throw new Error("Connected Solana wallet does not match the Owner Wallet");
    if (!provider.signMessage) throw new Error("This Solana wallet does not support message signing");
    const result = await provider.signMessage(textToBytes(challenge.message), "utf8");
    const signature = result?.signature || result;
    return { signature: bytesToBase64(signature instanceof Uint8Array ? signature : new Uint8Array(signature)), encoding: "base64" };
  }

  const provider = walletProvider === "auto" ? await getEthereumProvider() : await connectWalletProvider(walletProvider);
  const providerLabel = walletProvider === "auto" ? connectedWalletLabel || "wallet" : labelForEthereumProvider(provider, walletProvider);
  const accounts = await getEthereumAccounts(provider, providerLabel);
  const activeAddress = accounts?.[0] || connectedAccount;
  if (!activeAddress || activeAddress.toLowerCase() !== ownerWallet.address.toLowerCase()) {
    throw new Error("Connected EVM wallet does not match the Owner Wallet");
  }
  const signature = await requestWalletWithTimeout(
    provider,
    { method: "personal_sign", params: [textToHex(challenge.message), activeAddress] },
    WALLET_CONNECT_TIMEOUT_MS,
    "Owner Wallet signature timed out. Approve or reject the request in your wallet.",
  );
  return { signature, encoding: "hex" };
}

async function verifyVaultOwnerWallet() {
  let ownerWallet = loadVault2OwnerWallet();
  if (!ownerWallet) {
    await setPrimaryVaultOwnerWallet();
    ownerWallet = loadVault2OwnerWallet();
  }
  if (!ownerWallet) return;

  const signatureType = classifyVaultSignatureRequest("vault_access");
  if (signatureType.movesFunds || signatureType.grantsApproval) {
    showToast("Unsafe signature request blocked");
    return;
  }

  try {
    const deviceFingerprint = await getVault2DeviceFingerprint();
    const challengeResponse = await fetchWithTimeout("/api/vault/challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerWallet: ownerWallet.address, chain: ownerWallet.chain, purpose: "vault_access" }),
    }, 9000);
    const challenge = await challengeResponse.json();
    if (!challengeResponse.ok) throw new Error(challenge.message || "Could not create Vault challenge");
    const signed = await requestVaultOwnerSignature(ownerWallet, challenge);
    const sessionResponse = await fetchWithTimeout("/api/vault/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challengeId: challenge.challengeId,
        ownerWallet: ownerWallet.address,
        chain: ownerWallet.chain,
        signature: signed.signature,
        signatureEncoding: signed.encoding,
        deviceFingerprint,
      }),
    }, 12000);
    const session = await sessionResponse.json();
    if (!sessionResponse.ok) throw new Error(session.message || "Owner Wallet verification failed");
    saveVault2Session(session);
    saveVault2OwnerWallet({ ...ownerWallet, verificationStatus: "verified", lastSignatureAt: new Date().toISOString() });
    const devices = loadVault2TrustedDevices();
    if (!devices.some((device) => device.fingerprint === deviceFingerprint)) {
      saveVault2TrustedDevices([{ fingerprint: deviceFingerprint, label: navigator.platform || "This browser", trusted: true, createdAt: new Date().toISOString() }, ...devices]);
    }
    addVaultActivity("Owner Wallet verified for Vault 2.0");
    renderVault2SecurityPanel();
    showToast("Vault 2.0 access verified");
  } catch (error) {
    addVaultActivity("Failed Owner Wallet verification attempt");
    showToast(error?.message || "Vault verification failed");
  }
}

async function createVault2Snapshot() {
  let session = loadVault2Session();
  if (!session) {
    await verifyVaultOwnerWallet();
    session = loadVault2Session();
  }
  if (!session) return;
  const password = getAutoVaultPassword() || window.prompt("Create a Vault 2.0 encryption password for this snapshot.");
  if (!password) return;
  try {
    const payload = createVaultPayload();
    const { file, analytics } = await encryptVaultPayload(payload, password);
    const manifest = createVault2Manifest();
    const assetRecords = collectVault2AssetRecords(loadVault2OwnerWallet());
    const response = await fetchWithTimeout("/api/vault/snapshots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.token}`,
      },
      body: JSON.stringify({
        vaultVersion: 2,
        snapshotVersion: loadVault2SnapshotHistory().length + 1,
        encryptedVault: file,
        manifest,
        assetRecords,
        encryptedSizeBytes: analytics.encryptedSize,
      }),
    }, 12000);
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Vault 2.0 snapshot was not accepted");
    saveVault2SnapshotHistory({
      id: result.snapshotId || crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      encryptedSizeBytes: analytics.encryptedSize,
      retention: "current/previous/daily/weekly",
      manifest,
    });
    saveJsonStorage(VAULT2_ASSET_RECORDS_KEY, assetRecords);
    addVaultActivity("Vault 2.0 encrypted snapshot saved");
    renderVaultDashboard();
    showToast("Vault 2.0 snapshot saved");
  } catch (error) {
    showToast(error?.message || "Could not save Vault 2.0 snapshot");
  }
}

function isAutoVaultEnabled() {
  return Boolean(localStorage.getItem(VAULT_AUTO_SNAPSHOT_KEY) || localStorage.getItem(VAULT_AUTO_SNAPSHOT_META_KEY));
}

function isAutoVaultUnlocked() {
  return Boolean(autoVaultSessionPassword);
}

function loadAutoVaultMeta() {
  try {
    return JSON.parse(localStorage.getItem(VAULT_AUTO_SNAPSHOT_META_KEY)) || null;
  } catch {
    return null;
  }
}

function scheduleAutoVaultSnapshot() {
  if (suppressAutoVaultSnapshot || !isAutoVaultUnlocked()) return;
  window.clearTimeout(autoVaultTimer);
  autoVaultTimer = window.setTimeout(() => {
    createAutoVaultSnapshot();
  }, 900);
}

function collectVaultData() {
  return {
    wallets,
    goals,
    addressBook,
    financeData,
    settings: {
      solanaRpcConfigured: hasConfiguredSolanaRpc(),
      walletConnectConfigured: Boolean(loadWalletConnectProjectId()),
      lastVaultBackup: localStorage.getItem(VAULT_LAST_BACKUP_KEY) || "",
    },
    vaultActivity: loadVaultActivity(),
    virtualAssetAccounts: getVirtualAssetAccounts(),
    legalCoreAssetRecords: syncLegalCoreAssetRecords(),
    taxLedgerAssetRecords: buildTaxLedgerAssetRecords(),
    assetVaultExportStructure: buildVaultAssetExportStructure(),
    vault2: collectVault2State(),
  };
}

function hasForbiddenSecretFields(value, path = "") {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some((item, index) => hasForbiddenSecretFields(item, `${path}[${index}]`));
  return Object.entries(value).some(([key, nested]) => {
    const normalized = key.toLowerCase().replace(/[_\s-]/g, "");
    if (/(seedphrase|mnemonic|privatekey|secretkey|recoveryphrase)/.test(normalized)) return true;
    return hasForbiddenSecretFields(nested, path ? `${path}.${key}` : key);
  });
}

function validateVaultPayloadData(payload) {
  if (!payload || payload.app_name !== "AllocaFi" || payload.validation !== "allocafi-vault") {
    throw new Error("Invalid AllocaFi Vault file");
  }
  if (payload.vault_version > VAULT_FILE_VERSION) {
    throw new Error("This Vault was created by a newer AllocaFi version");
  }
  const data = payload.data || {};
  if (!Array.isArray(data.wallets) || !Array.isArray(data.goals) || !Array.isArray(data.addressBook) || !data.financeData) {
    throw new Error("Vault data is missing required sections");
  }
  if (hasForbiddenSecretFields(data)) {
    throw new Error("Vault contains forbidden private-key or seed-phrase fields");
  }
  return true;
}

function normalizeVaultData(data) {
  const addresses = [...new Set((data.wallets || []).map((wallet) => wallet.address).filter(Boolean))];
  const networks = [...new Set((data.wallets || []).map((wallet) => wallet.network).filter(Boolean))];
  const bucketNames = [...new Set((data.wallets || []).flatMap((wallet) => (wallet.allocation?.buckets || []).map((bucket) => bucket.name)).filter(Boolean))];
  const categories = [...new Set((data.wallets || []).flatMap((wallet) => (wallet.allocation?.transactions || []).map((tx) => tx.bucketName || tx.category)).filter(Boolean))];

  return {
    refs: { addresses, networks, bucketNames, categories },
    data,
  };
}

function createVaultPayload() {
  const data = collectVaultData();
  const normalized = normalizeVaultData(data);
  return {
    vault_version: VAULT_FILE_VERSION,
    app_name: "AllocaFi",
    created_at: new Date().toISOString(),
    data_schema_version: 1,
    normalized,
    data,
    validation: "allocafi-vault",
  };
}

async function compressBytes(bytes) {
  if (!("CompressionStream" in window)) return { bytes, compression: "none" };
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip"));
  return { bytes: new Uint8Array(await new Response(stream).arrayBuffer()), compression: "gzip" };
}

async function decompressBytes(bytes, compression) {
  if (compression === "none") return bytes;
  if (compression !== "gzip" || !("DecompressionStream" in window)) throw new Error("Compression format is not supported in this browser");
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function deriveVaultKey(password, salt) {
  const baseKey = await crypto.subtle.importKey("raw", textToBytes(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: VAULT_KDF_ITERATIONS, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptVaultPayload(payload, password) {
  const rawText = JSON.stringify(payload);
  const rawBytes = textToBytes(rawText);
  const normalizedBytes = byteSize(payload.normalized);
  const compressed = await compressBytes(rawBytes);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveVaultKey(password, salt);
  const cipherBytes = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, compressed.bytes));
  const encryptedSize = byteSize(bytesToBase64(cipherBytes));

  return {
    file: {
      app: "AllocaFi Vault",
      version: VAULT_FILE_VERSION,
      created_at: payload.created_at,
      encryption: {
        method: "AES-256-GCM",
        kdf: "PBKDF2-SHA256",
        iterations: VAULT_KDF_ITERATIONS,
        salt: bytesToBase64(salt),
        iv: bytesToBase64(iv),
      },
      compression: compressed.compression,
      analytics: {
        original_size: rawBytes.byteLength,
        normalized_size: normalizedBytes,
        compressed_size: compressed.bytes.byteLength,
        encrypted_size: encryptedSize,
      },
      ciphertext: bytesToBase64(cipherBytes),
    },
    analytics: {
      originalSize: rawBytes.byteLength,
      normalizedSize: normalizedBytes,
      compressedSize: compressed.bytes.byteLength,
      encryptedSize,
      savedPercent: rawBytes.byteLength ? Math.max(0, Math.round((1 - compressed.bytes.byteLength / rawBytes.byteLength) * 100)) : 0,
    },
  };
}

async function decryptVaultFile(vaultFile, password) {
  if (vaultFile?.app !== "AllocaFi Vault" || !vaultFile.ciphertext || !vaultFile.encryption) {
    throw new Error("This is not a valid AllocaFi Vault file");
  }
  if (!vaultFile.encryption.salt || !vaultFile.encryption.iv || vaultFile.encryption.method !== "AES-256-GCM") {
    throw new Error("Vault encryption metadata is invalid");
  }
  const salt = base64ToBytes(vaultFile.encryption.salt);
  const iv = base64ToBytes(vaultFile.encryption.iv);
  const key = await deriveVaultKey(password, salt);
  const compressedBytes = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, base64ToBytes(vaultFile.ciphertext)));
  const rawBytes = await decompressBytes(compressedBytes, vaultFile.compression || "none");
  const payload = JSON.parse(bytesToText(rawBytes));
  validateVaultPayloadData(payload);
  return payload;
}

function getVaultCategorySizes() {
  const data = collectVaultData();
  const walletsSize = byteSize(data.wallets);
  const bucketData = (data.wallets || []).flatMap((wallet) => wallet.allocation?.buckets || []);
  const transactions = (data.wallets || []).flatMap((wallet) => wallet.allocation?.transactions || []);
  const billData = bucketData.flatMap((bucket) => bucket.subaccounts || []);
  return [
    ["Wallets", walletsSize],
    ["Virtual Budget Accounts", byteSize(bucketData)],
    ["Bill planner", byteSize(billData)],
    ["Transactions", byteSize(transactions)],
    ["Goals", byteSize(data.goals)],
    ["Address book", byteSize(data.addressBook)],
    ["Settings", byteSize(data.settings)],
    ["Vault activity", byteSize(data.vaultActivity)],
    ["Vault 2.0 ownership", byteSize(data.vault2)],
  ];
}

async function getVaultAnalytics() {
  const payload = createVaultPayload();
  const rawBytes = textToBytes(JSON.stringify(payload));
  const normalizedSize = byteSize(payload.normalized);
  const compressed = await compressBytes(rawBytes);
  const encryptedEstimate = compressed.bytes.byteLength + 96;
  return {
    originalSize: rawBytes.byteLength,
    normalizedSize,
    compressedSize: compressed.bytes.byteLength,
    encryptedSize: encryptedEstimate,
    savedPercent: rawBytes.byteLength ? Math.max(0, Math.round((1 - compressed.bytes.byteLength / rawBytes.byteLength) * 100)) : 0,
    compression: compressed.compression,
    categories: getVaultCategorySizes(),
  };
}

async function renderVaultDashboard() {
  if (!vaultStats || !vaultBreakdown) return;
  try {
    const analytics = await getVaultAnalytics();
    const lastBackup = localStorage.getItem(VAULT_LAST_BACKUP_KEY);
    const autoMeta = loadAutoVaultMeta();
    vaultSaved.textContent = `${analytics.savedPercent}%`;
    vaultStats.innerHTML = [
      ["App data", formatBytes(analytics.originalSize), "Current local AllocaFi data"],
      ["Compressed", formatBytes(analytics.compressedSize), analytics.compression === "gzip" ? "Browser gzip available" : "Compression unavailable"],
      ["Encrypted file", formatBytes(analytics.encryptedSize), "Estimated .afv size"],
      ["Last backup", lastBackup ? new Date(lastBackup).toLocaleDateString() : "Never", "Encrypted vault export"],
      ["Auto Snapshot", autoMeta ? new Date(autoMeta.createdAt).toLocaleTimeString() : "Off", autoMeta ? `${isAutoVaultUnlocked() ? "Unlocked this session" : "Locked until password entry"}, ${formatBytes(autoMeta.encryptedSize)}` : "Local browser restore point"],
      ["Stored where", "This device", "Browser local storage, not cloud"],
    ].map(([label, value, detail]) => `<div class="stat-tile"><span>${label}</span><strong>${value}</strong><small>${detail}</small></div>`).join("");
    vaultBreakdown.innerHTML = analytics.categories.map(([name, size]) => `
      <div class="overview-row compact">
        <span>${escapeHtml(name)}</span>
        <strong>${formatBytes(size)}</strong>
      </div>
    `).join("");
    const activity = loadVaultActivity();
    vaultActivityCount.textContent = String(activity.length);
    vaultActivityLog.innerHTML = activity.length ? activity.map((item) => `
      <div class="log-row">
        <div class="log-topline">
          <strong>${escapeHtml(item.message)}</strong>
          <span class="status-pill">${new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
        <span class="log-meta">${new Date(item.createdAt).toLocaleString()}</span>
      </div>
    `).join("") : `<p class="wallet-note">No vault activity yet.</p>`;
    renderVault2SecurityPanel();
  } catch {
    vaultStats.innerHTML = `<div class="alert-tile"><strong>Vault analytics unavailable</strong><span>Try refreshing the app.</span></div>`;
  }
}

async function exportVaultFile() {
  const password = window.prompt("Create a Vault password. Do not use your wallet password or seed phrase.");
  if (!password) return;
  const confirmPassword = window.prompt("Confirm Vault password.");
  if (password !== confirmPassword) {
    showToast("Vault passwords did not match");
    return;
  }
  try {
    const payload = createVaultPayload();
    const { file, analytics } = await encryptVaultPayload(payload, password);
    const date = new Date().toISOString().slice(0, 10).replaceAll("-", "_");
    const blob = new Blob([JSON.stringify(file)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `allocafi_vault_backup_${date}.afv`;
    anchor.click();
    URL.revokeObjectURL(url);
    localStorage.setItem(VAULT_LAST_BACKUP_KEY, new Date().toISOString());
    addVaultActivity(`Exported encrypted vault (${analytics.savedPercent}% compression savings)`);
    showToast("Encrypted Vault exported");
  } catch (error) {
    showToast(error?.message || "Could not export Vault");
  }
}

async function createAutoVaultSnapshot() {
  const password = getAutoVaultPassword();
  if (!password) return;
  try {
    const payload = createVaultPayload();
    const { file, analytics } = await encryptVaultPayload(payload, password);
    localStorage.setItem(VAULT_AUTO_SNAPSHOT_KEY, JSON.stringify(file));
    localStorage.setItem(VAULT_AUTO_SNAPSHOT_META_KEY, JSON.stringify({
      createdAt: new Date().toISOString(),
      encryptedSize: analytics.encryptedSize,
      savedPercent: analytics.savedPercent,
      storage: "Local browser storage on this device",
    }));
    addVaultActivity(`Auto snapshot saved (${analytics.savedPercent}% savings)`);
  } catch {
    addVaultActivity("Auto snapshot failed");
  }
}

async function enableAutoVaultSnapshot() {
  if (isAutoVaultEnabled() && !window.confirm("Auto Snapshot is already enabled. Replace the local snapshot password?")) return;
  const password = window.prompt("Create an Auto Snapshot password for this session. AllocaFi will not store this password.");
  if (!password) return;
  const confirmPassword = window.prompt("Confirm Auto Snapshot password.");
  if (password !== confirmPassword) {
    showToast("Passwords did not match");
    return;
  }
  autoVaultSessionPassword = password;
  localStorage.removeItem(VAULT_AUTO_PASSWORD_KEY);
  await createAutoVaultSnapshot();
  renderVaultDashboard();
  showToast("Auto Snapshot unlocked for this session");
}

async function restoreAutoVaultSnapshot() {
  const stored = localStorage.getItem(VAULT_AUTO_SNAPSHOT_KEY);
  if (!stored) {
    showToast("No Auto Snapshot saved yet");
    return;
  }
  const password = getAutoVaultPassword() || window.prompt("Enter the Auto Snapshot password.");
  if (!password) return;
  try {
    const payload = await decryptVaultFile(JSON.parse(stored), password);
    autoVaultSessionPassword = password;
    const data = payload.data;
    if (!data || !Array.isArray(data.wallets) || !Array.isArray(data.goals) || !Array.isArray(data.addressBook)) {
      throw new Error("Auto Snapshot is missing required AllocaFi data");
    }
    if (!window.confirm("Restore the latest local Auto Snapshot? It will replace current local app data.")) return;
    suppressAutoVaultSnapshot = true;
    wallets = data.wallets.filter((wallet) => wallet.name && wallet.address && NETWORKS[wallet.network]);
    goals = data.goals.filter((goal) => goal.name);
    addressBook = data.addressBook.filter((entry) => entry.name && entry.address);
    financeData = mergeFinanceDefaults(data.financeData || {});
    restoreVault2State(data.vault2 || {});
    saveWallets();
    saveGoals();
    saveAddressBook();
    saveFinanceData();
    suppressAutoVaultSnapshot = false;
    addVaultActivity("Restored local Auto Snapshot");
    render();
    showToast("Auto Snapshot restored");
  } catch (error) {
    suppressAutoVaultSnapshot = false;
    showToast(error?.message || "Could not restore Auto Snapshot");
  }
}

async function importVaultFile(file) {
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast("Vault file is too large");
    importVaultInput.value = "";
    return;
  }
  const password = window.prompt("Enter the Vault password to restore this backup.");
  if (!password) return;
  try {
    const vaultFile = JSON.parse(await file.text());
    const payload = await decryptVaultFile(vaultFile, password);
    const data = payload.data;
    if (!data || !Array.isArray(data.wallets) || !Array.isArray(data.goals) || !Array.isArray(data.addressBook)) {
      throw new Error("Vault is missing required AllocaFi data");
    }
    if (!window.confirm("Restore this Vault? It will replace current local AllocaFi data on this browser.")) return;

    wallets = data.wallets.filter((wallet) => wallet.name && wallet.address && NETWORKS[wallet.network]);
    goals = data.goals.filter((goal) => goal.name);
    addressBook = data.addressBook.filter((entry) => entry.name && entry.address);
    financeData = mergeFinanceDefaults(data.financeData || {});
    restoreVault2State(data.vault2 || {});
    saveWallets();
    saveGoals();
    saveAddressBook();
    saveFinanceData();
    addVaultActivity("Restored encrypted vault");
    render();
    showToast("Vault restored");
  } catch (error) {
    showToast(error?.message || "Wrong password or corrupted Vault file");
  } finally {
    importVaultInput.value = "";
  }
}

function validateBackup(data) {
  return data
    && data.app === "AllocaFi"
    && Array.isArray(data.wallets)
    && Array.isArray(data.goals)
    && Array.isArray(data.addressBook)
    && !hasForbiddenSecretFields(data);
}

async function restoreFullBackup(file) {
  try {
    if (file.size > 5 * 1024 * 1024) throw new Error("Backup too large");
    const backup = JSON.parse(await file.text());
    if (!validateBackup(backup)) throw new Error("Invalid backup");
    if (!window.confirm("Restore this backup? It will replace current local AllocaFi data.")) return;

    wallets = backup.wallets.filter((wallet) => wallet.name && wallet.address && NETWORKS[wallet.network]);
    goals = backup.goals.filter((goal) => goal.name);
    addressBook = backup.addressBook.filter((entry) => entry.name && entry.address);
    financeData = mergeFinanceDefaults(backup.financeData || {});
    clearDemoModeState();
    saveWallets();
    saveGoals();
    saveAddressBook();
    saveFinanceData();
    render();
    showToast("Backup restored");
  } catch {
    showToast("That backup file did not work");
  } finally {
    restoreBackupInput.value = "";
  }
}

function resetAllLocalData() {
  if (!window.confirm("Reset all local AllocaFi data on this browser?")) return;
  wallets = [];
  goals = [];
  addressBook = [];
  financeData = createDefaultFinanceData();
  clearDemoModeState();
  saveWallets();
  saveGoals();
  saveAddressBook();
  saveFinanceData();
  render();
  showToast("Local data reset");
}

setupWizardButton?.addEventListener("click", openSetupWizard);
assignMoneyButton.addEventListener("click", openAssignMoneyDialog);
addHeroWalletAddressButton?.addEventListener("click", openStablecoinAddressEntry);
assignMoneyAccountsButton?.addEventListener("click", openAssignMoneyDialog);
openSubscriptionPaymentsButton?.addEventListener("click", openSubscriptionPlansDialog);
refreshVbasButton?.addEventListener("click", refreshAllVirtualAccounts);
refreshVbasAccountsButton?.addEventListener("click", refreshAllVirtualAccounts);
addBucketAccountButton?.addEventListener("click", openAddBucketAccountDialog);
moveMoneyAccountsButton?.addEventListener("click", () => openMoveMoneyDialog());
applyTemplateAccountsButton?.addEventListener("click", openTemplateDialog);
addGoalButton.addEventListener("click", () => openGoalDialog());
addAddressBookButton.addEventListener("click", () => openAddressBookDialog());
suggestCategoriesButton?.addEventListener("click", openAiCategoryDialog);
connectBankButton?.addEventListener("click", openSandboxBankDialog);
syncBankBalancesButton?.addEventListener("click", () => syncBankAccount());
syncBankTransactionsButton?.addEventListener("click", syncBankTransactions);
createFamilyButton?.addEventListener("click", createFamilyGroup);
createBusinessButton?.addEventListener("click", createBusinessProfile);
monthlyReportButton?.addEventListener("click", openMonthlyReport);
document.querySelector("[data-open-subscriptions-report]")?.addEventListener("click", () => openSubscriptionCheckout(subscriptionState.planCode || "premium"));
exportCsvButton.addEventListener("click", exportTransactionsCsv);
backupButton.addEventListener("click", exportFullBackup);
resetButton.addEventListener("click", resetAllLocalData);
demoModeButton?.addEventListener("click", loadDemoMode);
exitDemoModeButton?.addEventListener("click", exitDemoMode);
openOnboardingTestButton?.addEventListener("click", startOnboardingTestFlow);
openAccountHelperButton?.addEventListener("click", openAccountHelperDialog);

importInput.addEventListener("change", async () => {
  const file = importInput.files?.[0];
  if (!file) return;

  try {
    if (file.size > 2 * 1024 * 1024) throw new Error("Import file too large");
    const imported = JSON.parse(await file.text());
    if (!Array.isArray(imported)) throw new Error("Invalid file");
    if (hasForbiddenSecretFields(imported)) throw new Error("Import contains forbidden private-key or seed-phrase fields");
    wallets = imported.filter((wallet) => wallet.name && wallet.address && NETWORKS[wallet.network]);
    saveWallets();
    render();
    showToast("Wallets imported");
  } catch {
    showToast("That import file did not work");
  } finally {
    importInput.value = "";
  }
});

restoreBackupInput.addEventListener("change", async () => {
  const file = restoreBackupInput.files?.[0];
  if (!file) return;
  await restoreFullBackup(file);
});
exportVaultButton?.addEventListener("click", exportVaultFile);
setVaultOwnerWalletButton?.addEventListener("click", setPrimaryVaultOwnerWallet);
verifyVaultOwnerWalletButton?.addEventListener("click", verifyVaultOwnerWallet);
createVault2SnapshotButton?.addEventListener("click", createVault2Snapshot);
enableAutoVaultButton?.addEventListener("click", enableAutoVaultSnapshot);
restoreAutoVaultButton?.addEventListener("click", restoreAutoVaultSnapshot);
importVaultInput?.addEventListener("change", async () => {
  const file = importVaultInput.files?.[0];
  await importVaultFile(file);
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tab));
});
transactionSearch?.addEventListener("input", renderTransactionLog);
transactionMonth?.addEventListener("change", renderTransactionLog);
showWalletFormButton?.addEventListener("click", () => {
  form.classList.toggle("open");
});
closeWalletFormButton?.addEventListener("click", () => {
  form.classList.remove("open");
});

populateNetworks();
networkSelect.value = "solanaPyusd";
try {
  render();
} catch (error) {
  document.body.dataset.renderError = error?.message || "Unknown render error";
  console.error("AllocaFi startup render failed", error);
  if (dashboardAlerts) {
    dashboardAlerts.innerHTML = `<div class="alert-tile allocafi-startup-render-error"><strong>Dashboard render needs review</strong><span>${escapeHtml(error?.message || "Unknown render error")}</span></div>`;
  }
}
activateRouteTab();
window.addEventListener("popstate", activateRouteTab);
await hydrateClientConfig();
refreshCloudProviderStatus();
refreshPrices();
setTimeout(maybeOpenFirstRunOnboarding, 450);








