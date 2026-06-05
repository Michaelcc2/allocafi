const STORAGE_KEY = "wallet-buckets-v1";
const WALLETCONNECT_PROJECT_KEY = "allocafi-walletconnect-project-v1";
const cryptoApi = globalThis.crypto || {};
const crypto = {
  ...cryptoApi,
  subtle: cryptoApi.subtle,
  randomUUID: typeof cryptoApi.randomUUID === "function"
    ? cryptoApi.randomUUID.bind(cryptoApi)
    : () => `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
};
const SOLANA_RPC_URL_KEY = "allocafi-solana-rpc-url-v1";
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
const UNIFIED_FINANCE_KEY = "allocafi-unified-finance-v1";
const ACCOUNT_SESSION_KEY = "allocafi-account-session-v1";
const ACCOUNT_PROFILE_KEY = "allocafi-account-profile-v1";
const ACCOUNT_SYNC_QUEUE_KEY = "allocafi-cloud-sync-queue-v1";
const ACCOUNT_MIGRATION_KEY = "allocafi-cloud-migration-v1";
const CLOUD_PROVIDER_STATUS_KEY = "allocafi-cloud-provider-status-v1";
const AI_INSIGHTS_KEY = "allocafi-ai-insights-v1";
const AI_CATEGORY_SUGGESTIONS_KEY = "allocafi-ai-category-suggestions-v1";
const VAULT_KDF_ITERATIONS = 250000;
const VAULT_FILE_VERSION = 1;
const SOLANA_TOKEN_INDEXERS = [
  "https://public-api.solscan.io/account/tokens?account=",
  "https://api.solscan.io/account/tokens?address=",
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
};

function ensureUnifiedFinanceShell() {
  const nav = document.querySelector(".tab-nav");
  const overviewPanel = document.querySelector('[data-panel="overview"]');
  if (!nav || !overviewPanel || document.querySelector('[data-tab="unified"]')) return;

  const tabs = [
    ["unified", "Unified", "◈"],
    ["connect", "Connect", "+"],
    ["banks", "Banks", "$"],
    ["monthly", "Monthly", "%"],
    ["ai", "AI", "*"],
    ["family", "Family", "○"],
    ["business", "Business", "▨"],
    ["rewards", "Rewards", "★"],
    ["admin", "Admin", "#"],
  ];
  const visibleTabs = new Set(["connect", "monthly", "family"]);

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
            <p>Bank balances, crypto wallets, buckets, transactions, and AI insights in one command center</p>
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
            <p>Unified income, spending, recurring bills, buckets, and alerts</p>
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
            <h2>AI Insights</h2>
            <p>Plain-language insights for personal, family, business, and bucket health</p>
          </div>
          <span class="status-pill">Local rules now</span>
        </div>
        <div id="aiInsightsView" class="overview-grid"></div>
      </section>
    </section>
    <section class="tab-panel" data-panel="family">
      <section class="dashboard-panel" aria-label="Family Dashboard">
        <div class="panel-heading">
          <div>
            <h2>Family Dashboard</h2>
            <p>Shared household balances, member privacy, family buckets, goals, and activity</p>
          </div>
          <button id="createFamily" class="primary-button" type="button">Create Family</button>
        </div>
        <div id="familyDashboardView"></div>
      </section>
    </section>
    <section class="tab-panel" data-panel="business">
      <section class="dashboard-panel" aria-label="Business Dashboard">
        <div class="panel-heading">
          <div>
            <h2>Business Dashboard</h2>
            <p>Business cash, crypto treasury, taxes, vendors, payroll, reports, and exports</p>
          </div>
          <button id="createBusiness" class="primary-button" type="button">Create Business</button>
        </div>
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
            <h2>Admin Foundation</h2>
            <p>Route map, data models, rewards controls, proposal controls, and audit logs</p>
          </div>
          <span class="status-pill">Local admin preview</span>
        </div>
        <div id="adminDashboardView"></div>
      </section>
    </section>
  `);
}

ensureUnifiedFinanceShell();

function moveAdvancedSectionsIntoSettings() {
  const settingsPanel = document.querySelector('[data-panel="settings"] .dashboard-panel');
  if (!settingsPanel || document.querySelector("#advancedSystemsView")) return;
  const advancedIds = ["unified", "banks", "business", "rewards", "ai", "admin", "vault"];

  advancedIds.forEach((id) => {
    document.querySelector(`[data-tab="${id}"]`)?.remove();
  });

  const labels = {
    unified: ["Unified Finance", "Bank + crypto command center foundation"],
    banks: ["Bank Accounts", "Plaid-ready bank connection foundation"],
    business: ["Business Dashboard", "Business buckets, vendors, tax, reports"],
    rewards: ["Rewards", "ALFI Points and Golden Ticket foundation"],
    ai: ["AI Insights", "Budget insights, category suggestions, and AI safety"],
    admin: ["Admin", "Owner controls, models, routes, audit logs"],
    vault: ["Vault", "Encrypted data backup, restore, and memory"],
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
    <section class="settings-section" id="advancedSystemsView">
      <div class="panel-heading">
        <div>
          <h2>Advanced systems</h2>
          <p>Hidden from the main dashboard for now. These are owner, memory, and future premium systems.</p>
        </div>
      </div>
      <div class="settings-launch-grid">
        ${advancedIds.map((id) => `
          <button class="settings-launch-card" data-open-advanced="${id}" type="button">
            <strong>${labels[id][0]}</strong>
            <span>${labels[id][1]}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `);

  settingsPanel.querySelectorAll("[data-open-advanced]").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.openAdvanced));
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
const setupWizardButton = document.querySelector("#setupWizard");
const seedExamplesButton = document.querySelector("#seedExamples");
const demoModeButton = document.querySelector("#demoMode");
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
const addGoalButton = document.querySelector("#addGoal");
const addAddressBookButton = document.querySelector("#addAddressBook");
const suggestCategoriesButton = document.querySelector("#suggestCategories");
const walletConnectionStatus = document.querySelector("#walletConnectionStatus");
const accountCloudView = document.querySelector("#accountCloudView");
const cloudModeStatus = document.querySelector("#cloudModeStatus");
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

let wallets = loadWallets();
let priceCache = {};
let goals = loadGoals();
let addressBook = loadAddressBook();
let financeData = loadFinanceData();
let accountSession = loadAccountSession();
let accountProfile = loadAccountProfile();
let cloudProviderStatus = loadCloudProviderStatus();
let aiInsightsState = loadAiInsightsState();
let aiCategorySuggestions = loadAiCategorySuggestions();
let connectedProvider = null;
let connectedAccount = "";
let connectedWalletLabel = "";
let connectedSolanaProvider = null;
let connectedSolanaAccount = "";
let connectedSolanaWalletLabel = "";
let selectedWalletId = wallets[0]?.id || "";
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
  solanaRpcConfigured: Boolean(loadSolanaRpcUrl()),
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
  return custom ? [custom] : network.rpcs;
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
  const targets = canUseLocalSolanaProxy()
    ? [`/api/solana-rpc?endpoint=${encodeURIComponent(rpc)}`, rpc]
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

const BUCKET_TEMPLATES = {
  essentials: {
    name: "Essentials",
    buckets: [
      { name: "Bills", percent: 45, subaccounts: DEFAULT_BILL_SUBACCOUNTS },
      { name: "Food", percent: 15 },
      { name: "Transportation", percent: 10 },
      { name: "Medical", percent: 8 },
      { name: "Child Expenses", percent: 7 },
      { name: "Emergency Fund", percent: 15 },
    ],
  },
  growth: {
    name: "Financial Growth",
    buckets: [
      { name: "Emergency Fund", percent: 25 },
      { name: "Investments", percent: 20 },
      { name: "Long-Term Savings", percent: 20 },
      { name: "Vacation", percent: 10 },
      { name: "House Fund", percent: 15 },
      { name: "Education", percent: 10 },
    ],
  },
  lifestyle: {
    name: "Lifestyle",
    buckets: [
      { name: "Eating Out", percent: 20 },
      { name: "Entertainment", percent: 15 },
      { name: "Clothes", percent: 15 },
      { name: "Grooming", percent: 10 },
      { name: "Fitness", percent: 15 },
      { name: "Gifts", percent: 10 },
      { name: "Hobbies", percent: 15 },
    ],
  },
  planning: {
    name: "Planning / Irregular",
    buckets: [
      { name: "Maintenance", percent: 18 },
      { name: "Subscriptions", percent: 12 },
      { name: "Taxes", percent: 30 },
      { name: "Repairs", percent: 15 },
      { name: "Technology", percent: 10 },
      { name: "Holidays", percent: 15 },
    ],
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
  "Taxes",
  "Payroll",
  "Vendor Payments",
  "Fuel/Transportation",
  "Equipment",
  "Insurance",
  "Operating Expenses",
  "Profit",
  "Owner Draw",
  "Emergency Reserve",
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
  "POST /api/ai/insights",
  "POST /api/ai/categorize",
  "POST /api/onboarding/session",
  "GET /api/reports/monthly",
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

function loadWallets() {
  try {
    return (JSON.parse(localStorage.getItem(STORAGE_KEY)) || []).map((wallet) => {
      if (wallet.status === "Refreshing") {
        return {
          ...wallet,
          status: "Needs check",
          statusType: "error",
          error: wallet.error || "Last refresh did not finish. Try refresh again.",
        };
      }
      return wallet;
    });
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
      solanaRpcConfigured: Boolean(loadSolanaRpcUrl()),
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
    if (config.walletConnectProjectId && !loadWalletConnectProjectId()) {
      localStorage.setItem(WALLETCONNECT_PROJECT_KEY, config.walletConnectProjectId);
      if (walletConnectProjectInput) walletConnectProjectInput.value = config.walletConnectProjectId;
      updateWalletConnectionUi();
    }
  } catch {
    // The app still works without the optional public client config.
  }
}

function saveSolanaRpcUrl() {
  const value = solanaRpcUrlInput?.value.trim() || "";
  if (!value) {
    localStorage.removeItem(SOLANA_RPC_URL_KEY);
    showToast("Solana RPC URL cleared");
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
  if (tabName !== "wallets") {
    form?.classList.remove("open");
  }
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
  const price = priceCache[network.priceId];
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
  return meta ? `${meta.dateLabel} · ${meta.label}` : "No due date";
}

function getUpcomingBillItems() {
  const items = [];
  wallets.forEach((wallet) => {
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

function getWalletBalanceTaskCount(wallet) {
  if (!wallet?.allocation?.buckets?.length) return 0;
  return (getWalletAssignableAmount(wallet) > 0.01 ? 1 : 0)
    + (Number(wallet.allocation.pendingSpend || 0) > 0.01 ? 1 : 0)
    + (getWalletOverbalanceAmount(wallet) > 0.01 ? 1 : 0);
}

function getWalletAssignableAmount(wallet) {
  if (!wallet) return 0;
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

function getReadyToAssign() {
  return wallets.reduce((sum, wallet) => {
    return sum + getWalletAssignableAmount(wallet);
  }, 0);
}

function getMonthlyDashboard() {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const summary = wallets.reduce((totals, wallet) => {
    const allocation = wallet.allocation;
    const allocationTotals = allocation?.buckets?.length ? getAllocationTotals(wallet) : null;
    totals.trackedValue += getUsdValue(wallet);
    totals.walletBalance += getUsdValue(wallet);
    totals.bucketLeft += allocationTotals?.left || 0;
    totals.allocated += allocationTotals?.allocated || 0;
    totals.pendingIncrease += wallet.allocation?.buckets?.length ? getWalletAssignableAmount(wallet) : 0;
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
        totals.monthSpending += Number(tx.amount || 0);
        if (tx.type !== "bucket-reset" && tx.type !== "virtual-transfer") totals.moneyOut += Number(tx.amount || 0);
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
    moneyOut: 0,
    monthSpending: 0,
    bucketCount: 0,
    lowBuckets: [],
    ruleAlerts: [],
  });

  return summary;
}

function getDashboardDetails(dashboard) {
  const bucketRows = [];
  const categoryMap = {};
  const stablecoinMap = {};
  let stablecoinTotal = 0;
  let nativeTotal = 0;
  let billsAllocated = 0;
  let billsSpent = 0;
  let billsRequired = 0;

  wallets.forEach((wallet) => {
    const network = NETWORKS[wallet.network];
    const value = getUsdValue(wallet);
    if (["evm-usdc", "evm-stablecoin", "solana-token"].includes(network.kind)) {
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
      if (group === "Bills") {
        billsAllocated += allocated;
        billsSpent += spent;
        billsRequired += (bucket.subaccounts || []).reduce((sum, sub) => sum + Number(sub.required || 0), 0);
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
  if (dashboard.pendingIncrease > 0.01) insights.push(`Allocate ${formatUsd(dashboard.pendingIncrease)} of new funds into your buckets.`);
  if (dashboard.pendingSpend > 0.01) insights.push(`Assign ${formatUsd(dashboard.pendingSpend)} of spending so your bucket balances stay accurate.`);
  if (upcomingBills.length) {
    const bill = upcomingBills[0];
    insights.push(`${bill.bill.name} is ${bill.label.toLowerCase()}${Number(bill.bill.required || 0) > 0 ? ` for ${formatUsd(bill.bill.required)}` : ""}.`);
  }
  if (dashboard.lowBuckets.length) insights.push(dashboard.lowBuckets[0]);
  if (billsAllocated && billsRequired && billsAllocated < billsRequired) insights.push(`Bills are short by ${formatUsd(billsRequired - billsAllocated)} against required monthly amounts.`);
  if (!insights.length && wallets.length) insights.push("Your account view is organized. Keep categorizing spending to improve monthly insights.");
  if (!wallets.length) insights.push("Add a wallet to activate your AllocaFi financial overview.");

  return {
    bucketRows: bucketRows.sort((a, b) => b.allocated - a.allocated).slice(0, 6),
    categories: Object.entries(categoryMap).sort((a, b) => b[1] - a[1]),
    stablecoins: Object.entries(stablecoinMap).sort((a, b) => b[1] - a[1]),
    stablecoinTotal,
    nativeTotal,
    billsAllocated,
    billsSpent,
    billsRequired,
    goalCurrent,
    goalTotal,
    healthScore,
    insights: insights.slice(0, 4),
  };
}

function getAllTransactions() {
  return wallets.flatMap((wallet) => {
    const network = NETWORKS[wallet.network];
    return (wallet.allocation?.transactions || []).map((tx) => ({
      ...tx,
      walletName: wallet.name,
      walletAddress: wallet.address,
      asset: tx.asset || network.asset,
      network: network.label,
    }));
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function findAddressBookEntry(address, networkKey = "") {
  return addressBook.find((entry) =>
    entry.address.toLowerCase() === address.toLowerCase()
    && (!entry.network || !networkKey || entry.network === networkKey)
  );
}

function getBankTotals() {
  const accounts = financeData.bankAccounts || [];
  const activeAccounts = accounts.filter((account) => account.status !== "Disconnected");
  const total = activeAccounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);
  return { accounts: activeAccounts, total };
}

function getCryptoTotals() {
  const stableAssets = new Set(["USDC", "USDT", "PYUSD", "DAI", "FDUSD"]);
  return wallets.reduce((totals, wallet) => {
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
    connectedWallets: wallets.length,
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
  if (summary.stablecoinTotal > 0) insights.push(`${formatUsd(summary.stablecoinTotal)} is tracked in stablecoins. Keep bucket assignments updated after wallet sends.`);
  if (billsRequired > billsLeft) insights.push(`Your Bills bucket may be short by ${formatUsd(billsRequired - billsLeft)} based on upcoming recurring payments.`);
  if (bankSpend > cryptoSpend && bankSpend > 0) insights.push("Most spending this month is coming from bank activity, so bank categories should drive your monthly budget.");
  if (cryptoSpend > bankSpend && cryptoSpend > 0) insights.push("Most spending this month is coming from crypto activity, so bucket sends should auto-record against the selected account.");
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
    ["Active Buckets", String(summary.activeBuckets), "Wallet and unified Virtual Bucket Accounts"],
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
      <div class="overview-card-head"><span>Unified Buckets</span><strong>${bucketRows.length}</strong></div>
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
        ${transactions.length ? transactions.map((tx) => `<div class="overview-row compact"><span>${escapeHtml(tx.merchantLabel || tx.category || "Activity")} · ${escapeHtml(tx.sourceType)}</span><strong>${formatUsd(Number(tx.amount || 0))}</strong></div>`).join("") : `<p class="wallet-note">No unified transactions yet.</p>`}
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

function renderBankAccounts() {
  if (!bankAccountsView) return;
  const accounts = financeData.bankAccounts || [];
  if (!accounts.length) {
    bankAccountsView.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">$</div>
        <h3>No bank accounts connected</h3>
        <p>Create a sandbox bank connection to test unified bank + crypto budgeting.</p>
        <button class="primary-button bank-empty-connect" type="button">Connect Bank Account</button>
      </div>
    `;
    bankAccountsView.querySelector(".bank-empty-connect")?.addEventListener("click", openSandboxBankDialog);
    return;
  }

  bankAccountsView.innerHTML = accounts.map((account) => {
    const item = (financeData.bankItems || []).find((bankItem) => bankItem.id === account.itemId);
    const accountTransactions = (financeData.bankTransactions || []).filter((tx) => tx.accountId === account.id);
    const spending = accountTransactions.filter((tx) => Number(tx.amount) < 0).reduce((sum, tx) => sum + Math.abs(Number(tx.amount)), 0);
    const income = accountTransactions.filter((tx) => Number(tx.amount) > 0).reduce((sum, tx) => sum + Number(tx.amount), 0);
    return `
      <article class="wallet-card bucket-only-card">
        <div class="card-topline">
          <div>
            <h3>${escapeHtml(account.name)}</h3>
            <p class="wallet-network">${escapeHtml(item?.institution || "Sandbox Bank")} · ${escapeHtml(account.type || "checking")}</p>
          </div>
          <span class="status-pill ${account.status === "Disconnected" ? "error" : "live"}">${escapeHtml(account.status || "Healthy")}</span>
        </div>
        <div class="balance-row">
          <strong class="wallet-balance">${formatUsd(account.balance)}</strong>
          <span class="budget-text">${accountTransactions.length} synced transactions</span>
        </div>
        <div class="meter"><span style="width:${Math.min((Number(account.balance || 0) / Math.max(Number(account.balance || 0) + spending, 1)) * 100, 100)}%"></span></div>
        <div class="stats-grid">
          <div class="stat-tile"><span>Money In</span><strong>${formatUsd(income)}</strong></div>
          <div class="stat-tile"><span>Money Out</span><strong>${formatUsd(spending)}</strong></div>
        </div>
        <div class="dialog-actions">
          <button class="secondary-button sync-bank-one" data-bank-account-id="${account.id}" type="button">Sync</button>
          <button class="danger-button disconnect-bank" data-bank-item-id="${account.itemId}" type="button">Disconnect</button>
        </div>
      </article>
    `;
  }).join("");

  bankAccountsView.querySelectorAll(".sync-bank-one").forEach((button) => {
    button.addEventListener("click", () => syncBankAccount(button.dataset.bankAccountId));
  });
  bankAccountsView.querySelectorAll(".disconnect-bank").forEach((button) => {
    button.addEventListener("click", () => disconnectBankItem(button.dataset.bankItemId));
  });
}

function renderMonthlyBudgetPage() {
  if (!monthlyBudgetView) return;
  const summary = getUnifiedSummary();
  const bills = financeData.recurringBills || [];
  const subscriptions = summary.transactions.filter((tx) => /netflix|spotify|subscription|apple|google/i.test(tx.merchantLabel || tx.notes || ""));
  const buckets = financeData.unifiedBuckets || [];
  if (monthlyBudgetStatus) monthlyBudgetStatus.textContent = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

  monthlyBudgetView.innerHTML = `
    <div class="stats-grid">
      <div class="stat-tile"><span>Income</span><strong>${formatUsd(summary.monthlyIncome)}</strong></div>
      <div class="stat-tile"><span>Spending</span><strong>${formatUsd(summary.monthlySpending)}</strong></div>
      <div class="stat-tile"><span>Remaining</span><strong>${formatUsd(summary.monthlyIncome - summary.monthlySpending)}</strong></div>
      <div class="stat-tile"><span>Bank Spending</span><strong>${formatUsd(summary.currentMonthTransactions.filter((tx) => tx.sourceType === "bank" && Number(tx.amount) < 0).reduce((sum, tx) => sum + Math.abs(Number(tx.amount)), 0))}</strong></div>
      <div class="stat-tile"><span>Crypto Spending</span><strong>${formatUsd(summary.currentMonthTransactions.filter((tx) => tx.sourceType === "crypto").reduce((sum, tx) => sum + Math.abs(Number(tx.amount)), 0))}</strong></div>
      <div class="stat-tile"><span>Subscriptions</span><strong>${subscriptions.length}</strong></div>
    </div>
    <section class="overview-grid vault-card">
      <div class="overview-card">
        <div class="overview-card-head"><span>Bucket Progress</span><strong>${buckets.length}</strong></div>
        <div class="overview-list">
          ${buckets.map((bucket) => {
            const progress = bucket.monthlyGoal > 0 ? Math.min((Number(bucket.spent || 0) / Number(bucket.monthlyGoal)) * 100, 100) : 0;
            return `<div class="overview-row"><span>${escapeHtml(bucket.name)}</span><strong>${formatUsd(bucket.spent)} spent</strong><div class="mini-meter out"><i style="width:${progress}%"></i></div></div>`;
          }).join("")}
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-card-head"><span>Recurring Bills</span><strong>${formatUsd(bills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0))}</strong></div>
        <div class="overview-list">${bills.map((bill) => `<div class="overview-row compact"><span>${escapeHtml(bill.name)} · due ${bill.dueDay || "monthly"}</span><strong>${formatUsd(bill.amount)}</strong></div>`).join("")}</div>
      </div>
      <div class="overview-card insight-card">
        <div class="overview-card-head"><span>Monthly AI Summary</span><strong>${getUnifiedInsights().length}</strong></div>
        <div class="overview-list">${getUnifiedInsights().map((insight) => `<div class="overview-row compact"><span>${escapeHtml(insight)}</span></div>`).join("")}</div>
      </div>
    </section>
  `;
}

function renderAiInsightsPage() {
  if (!aiInsightsView) return;
  const dashboard = getMonthlyDashboard();
  const details = getDashboardDetails(dashboard);
  const aiInsights = getAiDisplayInsights(details.insights);
  const sections = [
    ["Personal Budgeting", aiInsights.map((insight) => insight.message || insight.title || "Review dashboard")],
    ["Family Budgeting", financeData.familyGroups.length ? ["Family dashboard is active. Review privacy settings before inviting more members.", "Shared family buckets can track groceries, rent, child expenses, and emergency savings."] : ["Create a family group to combine household balances and shared goals."]],
    ["Business Cash Flow", financeData.businessProfiles.length ? ["Business dashboard is active. Taxes, payroll, vendors, and owner draw are ready for tracking.", "Export center is prepared for CSV/PDF report flow."] : ["Create a business profile to track taxes, payroll, vendors, and operating expenses."]],
    ["AI Safety", [`Mode: ${aiInsightsState?.mode || "local-dashboard"}`, "Wallet addresses, secrets, API keys, and raw vault payloads are redacted before AI analysis.", "Suggestions are never auto-applied without user approval."]],
    ["Community Proposal Summaries", ["Community rewards are placeholder-only. Admin approval remains required before any funds are released."]],
  ];
  aiInsightsView.innerHTML = sections.map(([title, insights]) => `
    <div class="overview-card">
      <div class="overview-card-head"><span>${escapeHtml(title)}</span><strong>${insights.length}</strong></div>
      <div class="overview-list">${insights.map((insight) => `<div class="overview-row compact"><span>${escapeHtml(insight)}</span></div>`).join("")}</div>
    </div>
  `).join("") + `
    <div class="overview-card insight-card">
      <div class="overview-card-head"><span>AI Controls</span><strong>${aiInsightsState?.updatedAt ? "Updated" : "Ready"}</strong></div>
      <p class="wallet-note">Refresh budget insights from the secure gateway. If no OpenAI key is configured, AllocaFi uses the local insight engine.</p>
      <div class="dialog-actions">
        <button id="aiPageRefresh" class="secondary-button" type="button">Refresh AI</button>
        <button id="aiPageCategories" class="secondary-button" type="button">AI Categories</button>
      </div>
    </div>
  `;
  aiInsightsView.querySelector("#aiPageRefresh")?.addEventListener("click", refreshAiInsights);
  aiInsightsView.querySelector("#aiPageCategories")?.addEventListener("click", openAiCategoryDialog);
}

function renderFamilyDashboard() {
  if (!familyDashboardView) return;
  const family = financeData.familyGroups[0];
  if (!family) {
    familyDashboardView.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">○</div>
        <h3>No family group yet</h3>
        <p>Create a shared dashboard for household balances, privacy controls, bills, buckets, goals, and activity.</p>
        <button class="primary-button family-empty-create" type="button">Create Family</button>
      </div>
    `;
    familyDashboardView.querySelector(".family-empty-create")?.addEventListener("click", createFamilyGroup);
    return;
  }
  const summary = getUnifiedSummary();
  const members = family.members || [];
  const buckets = family.buckets || [];
  const goals = family.goals || [];
  familyDashboardView.innerHTML = `
    <div class="stats-grid">
      <div class="stat-tile"><span>Shared Family Balance</span><strong>${formatUsd(summary.netWorth)}</strong></div>
      <div class="stat-tile"><span>Family Bank Total</span><strong>${formatUsd(summary.bankTotal)}</strong></div>
      <div class="stat-tile"><span>Family Crypto Total</span><strong>${formatUsd(summary.cryptoTotal)}</strong></div>
      <div class="stat-tile"><span>Members</span><strong>${members.length}</strong></div>
    </div>
    <section class="overview-grid vault-card">
      <div class="overview-card">
        <div class="overview-card-head"><span>Members + Roles</span><strong>${escapeHtml(family.name)}</strong></div>
        <div class="overview-list">
          ${members.map((member) => `<div class="overview-row compact"><span>${escapeHtml(member.name)} · ${escapeHtml(member.role)}</span><strong>${escapeHtml(member.privacy)}</strong></div>`).join("")}
        </div>
        <div class="dialog-actions">
          <button class="secondary-button" id="inviteFamilyMember" type="button">Invite member</button>
          <button class="secondary-button" id="cycleFamilyPrivacy" type="button">Privacy settings</button>
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-card-head"><span>Shared Buckets</span><strong>${buckets.length}</strong></div>
        <div class="overview-list">${buckets.map((bucket) => `<div class="overview-row compact"><span>${escapeHtml(bucket.name)}</span><strong>${formatUsd(bucket.allocated || 0)}</strong></div>`).join("")}</div>
      </div>
      <div class="overview-card">
        <div class="overview-card-head"><span>Family Goals</span><strong>${goals.length}</strong></div>
        <div class="overview-list">${goals.map((goal) => `<div class="overview-row"><span>${escapeHtml(goal.name)}</span><strong>${formatUsd(goal.current)} / ${formatUsd(goal.target)}</strong><div class="mini-meter goals"><i style="width:${goal.target ? Math.min((goal.current / goal.target) * 100, 100) : 0}%"></i></div></div>`).join("")}</div>
      </div>
      <div class="overview-card insight-card">
        <div class="overview-card-head"><span>Family AI Insights</span><strong>2</strong></div>
        <div class="overview-list">
          <div class="overview-row compact"><span>Household bills and shared savings are ready to track across bank and crypto accounts.</span></div>
          <div class="overview-row compact"><span>Each member can show full balance, category totals, bucket totals, or hide account details.</span></div>
        </div>
      </div>
    </section>
  `;
  familyDashboardView.querySelector("#inviteFamilyMember")?.addEventListener("click", addFamilyInvite);
  familyDashboardView.querySelector("#cycleFamilyPrivacy")?.addEventListener("click", cycleFamilyPrivacy);
}

function renderBusinessDashboard() {
  if (!businessDashboardView) return;
  const business = financeData.businessProfiles[0];
  if (!business) {
    businessDashboardView.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">▨</div>
        <h3>No business profile yet</h3>
        <p>Create a business dashboard for bank accounts, crypto treasury, taxes, vendors, payroll, and reports.</p>
        <button class="primary-button business-empty-create" type="button">Create Business</button>
      </div>
    `;
    businessDashboardView.querySelector(".business-empty-create")?.addEventListener("click", createBusinessProfile);
    return;
  }
  const summary = getUnifiedSummary();
  const vendorTotal = (business.vendors || []).reduce((sum, vendor) => sum + Number(vendor.monthlySpend || 0), 0);
  const expenseTotal = (business.buckets || []).filter((bucket) => !["Profit", "Owner Draw"].includes(bucket.name)).reduce((sum, bucket) => sum + Number(bucket.allocated || 0), 0);
  const profitEstimate = Math.max(summary.monthlyIncome - expenseTotal - vendorTotal, 0);
  businessDashboardView.innerHTML = `
    <div class="stats-grid">
      <div class="stat-tile"><span>Business Cash</span><strong>${formatUsd(summary.bankTotal)}</strong></div>
      <div class="stat-tile"><span>Crypto Treasury</span><strong>${formatUsd(summary.cryptoTotal)}</strong></div>
      <div class="stat-tile"><span>Monthly Income</span><strong>${formatUsd(summary.monthlyIncome)}</strong></div>
      <div class="stat-tile"><span>Monthly Expenses</span><strong>${formatUsd(summary.monthlySpending + vendorTotal)}</strong></div>
      <div class="stat-tile"><span>Profit Estimate</span><strong>${formatUsd(profitEstimate)}</strong></div>
      <div class="stat-tile"><span>Vendors</span><strong>${(business.vendors || []).length}</strong></div>
    </div>
    <section class="overview-grid vault-card">
      <div class="overview-card">
        <div class="overview-card-head"><span>Business Buckets</span><strong>${business.buckets.length}</strong></div>
        <div class="overview-list">${business.buckets.map((bucket) => `<div class="overview-row compact"><span>${escapeHtml(bucket.name)}</span><strong>${formatUsd(bucket.allocated || 0)}</strong></div>`).join("")}</div>
      </div>
      <div class="overview-card">
        <div class="overview-card-head"><span>Vendor Tracking</span><strong>${formatUsd(vendorTotal)}</strong></div>
        <div class="overview-list">${(business.vendors || []).map((vendor) => `<div class="overview-row compact"><span>${escapeHtml(vendor.name)}</span><strong>${formatUsd(vendor.monthlySpend)}</strong></div>`).join("")}</div>
        <button id="addVendor" class="secondary-button" type="button">Add vendor</button>
      </div>
      <div class="overview-card">
        <div class="overview-card-head"><span>Export Center</span><strong>CSV/PDF</strong></div>
        <p class="wallet-note">CSV export works from the current transaction exporter. PDF is staged as a report print/export flow.</p>
        <div class="dialog-actions">
          <button id="businessCsvExport" class="secondary-button" type="button">CSV export</button>
          <button id="businessPdfPreview" class="secondary-button" type="button">PDF preview</button>
        </div>
      </div>
      <div class="overview-card insight-card">
        <div class="overview-card-head"><span>Business AI Insights</span><strong>2</strong></div>
        <div class="overview-list">
          <div class="overview-row compact"><span>Tax and payroll buckets are ready. Keep them funded before owner draw.</span></div>
          <div class="overview-row compact"><span>Vendor spending is separated from personal activity for cleaner reporting.</span></div>
        </div>
      </div>
    </section>
  `;
  businessDashboardView.querySelector("#addVendor")?.addEventListener("click", addBusinessVendor);
  businessDashboardView.querySelector("#businessCsvExport")?.addEventListener("click", exportTransactionsCsv);
  businessDashboardView.querySelector("#businessPdfPreview")?.addEventListener("click", openMonthlyReport);
}

function renderRewardsDashboard() {
  if (!rewardsDashboardView) return;
  const points = calculateAlfiPoints();
  const golden = financeData.rewards?.goldenTicket || {};
  rewardsDashboardView.innerHTML = `
    <div class="stats-grid">
      <div class="stat-tile gold-tile"><span>ALFI Points</span><strong>${points}</strong><small>In-app loyalty only</small></div>
      <div class="stat-tile gold-tile"><span>Golden Ticket</span><strong>${golden.reserved ? "Reserved" : golden.eligible ? "Eligible" : "Locked"}</strong><small>No ownership, token, equity, or cash value</small></div>
      <div class="stat-tile"><span>Paid Plan</span><strong>${escapeHtml(financeData.plan || "Free")}</strong></div>
      <div class="stat-tile"><span>Community</span><strong>${financeData.community?.proposals?.length || 0}</strong></div>
    </div>
    <section class="overview-grid vault-card">
      <div class="overview-card">
        <div class="overview-card-head"><span>Points History Foundation</span><strong>${ALFI_RULES.length}</strong></div>
        <div class="overview-list">${ALFI_RULES.map((rule) => `<div class="overview-row compact"><span>${escapeHtml(rule.label)}</span><strong>+${rule.points}</strong></div>`).join("")}</div>
      </div>
      <div class="overview-card gold-card">
        <div class="overview-card-head"><span>Founding Member Golden Ticket</span><strong>First 1,000</strong></div>
        <p class="wallet-note">Badge-only perks: founding member badge, discounted future plans, early access, boosted ALFI multiplier, and future community dashboard access.</p>
        <button id="markPaidPlan" class="secondary-button" type="button">Mark paid plan test</button>
      </div>
      <div class="overview-card insight-card">
        <div class="overview-card-head"><span>Community Rewards Placeholder</span><strong>Admin approval</strong></div>
        <div class="overview-list">
          ${(financeData.community?.proposals || []).map((proposal) => `<div class="overview-row compact"><span>${escapeHtml(proposal.title)} · ${escapeHtml(proposal.city)}, ${escapeHtml(proposal.state)}</span><strong>${escapeHtml(proposal.status)}</strong></div>`).join("")}
        </div>
      </div>
    </section>
  `;
  rewardsDashboardView.querySelector("#markPaidPlan")?.addEventListener("click", markPaidPlanTest);
}

function renderAdminDashboard() {
  if (!adminDashboardView) return;
  adminDashboardView.innerHTML = `
    <div class="stats-grid">
      <div class="stat-tile"><span>Database Models</span><strong>${DATABASE_MODEL_BLUEPRINT.length}</strong></div>
      <div class="stat-tile"><span>API Routes</span><strong>${BACKEND_ROUTE_BLUEPRINT.length}</strong></div>
      <div class="stat-tile"><span>Audit Logs</span><strong>${financeData.adminAuditLogs.length}</strong></div>
      <div class="stat-tile"><span>Mode</span><strong>Plaid sandbox ready</strong></div>
    </div>
    <section class="overview-grid vault-card">
      <div class="overview-card">
        <div class="overview-card-head"><span>Database Models</span><strong>Foundation</strong></div>
        <div class="rule-list">${DATABASE_MODEL_BLUEPRINT.map((model) => `<span class="rule-pill">${escapeHtml(model)}</span>`).join("")}</div>
      </div>
      <div class="overview-card">
        <div class="overview-card-head"><span>Backend Routes</span><strong>Blueprint</strong></div>
        <div class="overview-list">${BACKEND_ROUTE_BLUEPRINT.map((route) => `<div class="overview-row compact"><span>${escapeHtml(route)}</span></div>`).join("")}</div>
      </div>
      <div class="overview-card">
        <div class="overview-card-head"><span>Admin Controls</span><strong>Placeholder</strong></div>
        <div class="dialog-actions">
          <button id="pauseRewards" class="secondary-button" type="button">Pause rewards</button>
          <button id="approveProposal" class="secondary-button" type="button">Approve first proposal</button>
          <button id="rejectProposal" class="danger-button" type="button">Reject first proposal</button>
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-card-head"><span>Audit Logs</span><strong>${financeData.adminAuditLogs.length}</strong></div>
        <div class="overview-list">${financeData.adminAuditLogs.slice(0, 8).map((log) => `<div class="overview-row compact"><span>${escapeHtml(log.action)}</span><strong>${new Date(log.createdAt).toLocaleDateString()}</strong></div>`).join("")}</div>
      </div>
    </section>
  `;
  adminDashboardView.querySelector("#pauseRewards")?.addEventListener("click", () => {
    financeData.rewards.paused = !financeData.rewards.paused;
    addAdminAudit(`${financeData.rewards.paused ? "Paused" : "Resumed"} rewards`);
    render();
    showToast(financeData.rewards.paused ? "Rewards paused" : "Rewards resumed");
  });
  adminDashboardView.querySelector("#approveProposal")?.addEventListener("click", () => updateFirstProposal("Approved"));
  adminDashboardView.querySelector("#rejectProposal")?.addEventListener("click", () => updateFirstProposal("Rejected"));
}

function renderAccountCloudPanel() {
  if (!accountCloudView) return;
  const queue = loadCloudSyncQueue();
  const summary = getCloudDataSummary();
  const services = cloudProviderStatus?.services || {};
  const serviceRows = [
    ["Auth", services.auth ? "Ready" : "Needs keys"],
    ["Database", services.database ? "Ready" : "Needs schema"],
    ["Plaid", services.plaid ? "Ready" : "Later"],
    ["Stripe", services.stripe ? "Ready" : "Later"],
    ["OpenAI", services.openai ? "Ready" : "Later"],
    ["WalletConnect", services.walletConnect ? "Ready" : "Optional"],
    ["Solana RPC", services.solanaRpc ? "Ready" : "Public fallback"],
  ];
  const mode = accountSession?.provider === "supabase" ? "Cloud auth" : accountSession ? "Local preview" : "Not signed in";
  const migrated = hasMigratedLocalData();
  const aiLastRun = aiInsightsState?.updatedAt ? new Date(aiInsightsState.updatedAt).toLocaleString() : "Never";
  const aiMode = aiInsightsState?.mode || (services.openai ? "OpenAI ready" : "Local AI fallback");
  const aiInputTokens = Number(aiInsightsState?.cost?.inputTokens || aiInsightsState?.cost?.estimatedInputTokens || 0);
  const aiEstimatedCost = Number(aiInsightsState?.cost?.estimatedCostUsd || aiInsightsState?.cost?.estimatedUsd || 0);
  if (cloudModeStatus) {
    cloudModeStatus.textContent = accountSession ? mode : (cloudProviderStatus?.mode || "Local preview");
    cloudModeStatus.className = `status-pill ${accountSession?.provider === "supabase" ? "live" : "loading"}`;
  }

  accountCloudView.innerHTML = `
    <section class="overview-card account-cloud-card">
      <div class="overview-card-head">
        <span>Account</span>
        <strong>${accountSession ? escapeHtml(accountSession.email) : "Not signed in"}</strong>
      </div>
      <p class="wallet-note">${accountSession ? "This browser data can now be migrated and queued for cloud sync." : "Create a production account profile before moving the app to paid cloud plans."}</p>
      <div class="cloud-status-list">
        <div><span>Plan</span><strong>${escapeHtml(accountProfile?.plan || "Free")}</strong></div>
        <div><span>Provider</span><strong>${escapeHtml(accountSession?.provider || "none")}</strong></div>
        <div><span>Migration</span><strong>${migrated ? "Complete" : "Not yet"}</strong></div>
        <div><span>Sync queue</span><strong>${queue.length}</strong></div>
      </div>
      <div class="dialog-actions">
        ${accountSession ? `
          <button id="migrateLocalData" class="primary-button" type="button">${migrated ? "Re-save account data" : "Migrate local data"}</button>
          <button id="syncCloudNow" class="secondary-button" type="button">Sync now</button>
          <button id="logoutAccount" class="ghost-button" type="button">Logout</button>
        ` : `
          <button id="signupAccount" class="primary-button" type="button">Sign up</button>
          <button id="loginAccount" class="secondary-button" type="button">Login</button>
        `}
      </div>
    </section>
    <section class="overview-card account-cloud-card">
      <div class="overview-card-head">
        <span>Data ready to save</span>
        <strong>${summary.wallets} wallet${summary.wallets === 1 ? "" : "s"}</strong>
      </div>
      <div class="cloud-data-grid">
        <div><span>Virtual accounts</span><strong>${summary.buckets}</strong></div>
        <div><span>Transactions</span><strong>${summary.transactions}</strong></div>
        <div><span>Goals</span><strong>${summary.goals}</strong></div>
        <div><span>Saved addresses</span><strong>${summary.addressBook}</strong></div>
      </div>
      <p class="wallet-note">Until Supabase is connected, this stays on this browser and in encrypted Vault backups. After launch, the same snapshot can save to the user's account.</p>
    </section>
    <section class="overview-card account-cloud-card">
      <div class="overview-card-head">
        <span>AI Safety</span>
        <strong>${escapeHtml(aiMode)}</strong>
      </div>
      <div class="cloud-data-grid">
        <div><span>Redaction</span><strong>On</strong></div>
        <div><span>Approval</span><strong>Required</strong></div>
        <div><span>Last run</span><strong>${escapeHtml(aiLastRun)}</strong></div>
        <div><span>Est. tokens</span><strong>${aiInputTokens}</strong></div>
      </div>
      <p class="wallet-note">AI receives summaries with wallet addresses, secrets, and provider keys redacted. Category rules and budget changes still need user approval.</p>
      <p class="form-note">${aiEstimatedCost ? `Estimated AI cost: $${aiEstimatedCost.toFixed(4)}` : "Local fallback has no AI API cost."}</p>
    </section>
    <section class="overview-card account-cloud-card cloud-wide-card">
      <div class="overview-card-head">
        <span>Production services</span>
        <strong>${cloudProviderStatus?.configured ? "Configured" : "Setup needed"}</strong>
      </div>
      <div class="service-readiness-grid">
        ${serviceRows.map(([label, state]) => `
          <div class="service-readiness ${state === "Ready" ? "ready" : ""}">
            <span>${label}</span>
            <strong>${state}</strong>
          </div>
        `).join("")}
      </div>
      <div class="dialog-actions">
        <button id="refreshCloudStatus" class="secondary-button" type="button">Refresh service status</button>
      </div>
    </section>
  `;

  accountCloudView.querySelector("#signupAccount")?.addEventListener("click", () => openAccountAuthDialog("signup"));
  accountCloudView.querySelector("#loginAccount")?.addEventListener("click", () => openAccountAuthDialog("login"));
  accountCloudView.querySelector("#migrateLocalData")?.addEventListener("click", migrateLocalDataToAccount);
  accountCloudView.querySelector("#syncCloudNow")?.addEventListener("click", () => flushCloudSync("Manual sync"));
  accountCloudView.querySelector("#logoutAccount")?.addEventListener("click", logoutAccount);
  accountCloudView.querySelector("#refreshCloudStatus")?.addEventListener("click", refreshCloudProviderStatus);
}

function openSandboxBankDialog() {
  openDialog(`
    <div class="dialog-content">
      <h2>Connect Bank Account</h2>
      <p class="wallet-note">This creates a local Plaid-style sandbox connection for testing. Production requires Plaid Link, backend token exchange, encrypted access token storage, and environment variables.</p>
      <label>
        Institution
        <input id="bankInstitution" maxlength="40" placeholder="Chase, Capital One, Credit Union" value="Sandbox Bank" />
      </label>
      <label>
        Account name
        <input id="bankAccountName" maxlength="40" placeholder="Main Checking" value="Main Checking" />
      </label>
      <label>
        Current balance
        <input id="bankAccountBalance" type="number" min="0" step="0.01" value="1850.00" />
      </label>
      <label class="check-row">
        <input id="bankSampleTransactions" type="checkbox" checked />
        Add sample transactions for testing
      </label>
      <div class="dialog-actions">
        <button id="saveSandboxBank" class="primary-button" type="button">Save bank connection</button>
      </div>
      <p class="form-note">AllocaFi uses bank data only for balances, transactions, budgeting, categorization, insights, and virtual bucket tracking.</p>
    </div>
  `);
  dialogContent.querySelector("#saveSandboxBank").addEventListener("click", saveSandboxBankConnection);
}

function saveSandboxBankConnection() {
  const institution = dialogContent.querySelector("#bankInstitution").value.trim() || "Sandbox Bank";
  const name = dialogContent.querySelector("#bankAccountName").value.trim() || "Main Checking";
  const balance = Number(dialogContent.querySelector("#bankAccountBalance").value || 0);
  const addSamples = dialogContent.querySelector("#bankSampleTransactions").checked;
  const now = new Date();
  const itemId = crypto.randomUUID();
  const accountId = crypto.randomUUID();

  financeData.bankItems.unshift({
    id: itemId,
    institution,
    status: "Healthy",
    plaidMode: "sandbox-local",
    accessTokenStorage: "backend-encrypted-required",
    createdAt: now.toISOString(),
    lastSyncedAt: now.toISOString(),
  });
  financeData.bankAccounts.unshift({
    id: accountId,
    itemId,
    name,
    type: "checking",
    subtype: "checking",
    balance,
    availableBalance: balance,
    currency: "USD",
    status: "Healthy",
    lastSyncedAt: now.toISOString(),
  });

  if (addSamples) {
    const samples = [
      ["Payroll Deposit", 1200, "Income", "Available Cashflow", 1],
      ["Walmart Grocery", -86.42, "Food", "Food", 2],
      ["Shell Gas", -45.1, "Gas", "Gas", 3],
      ["Electric Utility", -118.22, "Bills", "Bills", 5],
      ["Netflix", -15.49, "Subscriptions", "Bills", 7],
    ];
    financeData.bankTransactions.unshift(...samples.map(([merchantLabel, amount, category, bucketName, daysAgo]) => {
      const date = new Date(now);
      date.setDate(date.getDate() - Number(daysAgo));
      return {
        id: crypto.randomUUID(),
        accountId,
        itemId,
        merchantLabel,
        amount,
        category,
        bucketName,
        pending: false,
        date: date.toISOString().slice(0, 10),
        notes: "Sandbox transaction",
        createdAt: now.toISOString(),
      };
    }));
  }

  saveFinanceData();
  addAdminAudit(`Connected sandbox bank account: ${institution}`);
  walletDialog.close();
  render();
  switchTab("banks");
  showToast("Bank account connected locally");
}

function syncBankAccount(accountId = "") {
  const accounts = accountId
    ? (financeData.bankAccounts || []).filter((account) => account.id === accountId)
    : (financeData.bankAccounts || []);
  accounts.forEach((account) => {
    if (account.status === "Disconnected") return;
    const adjustment = Number((Math.random() * 14 - 4).toFixed(2));
    account.balance = Math.max(Number(account.balance || 0) + adjustment, 0);
    account.availableBalance = account.balance;
    account.status = "Healthy";
    account.lastSyncedAt = new Date().toISOString();
  });
  (financeData.bankItems || []).forEach((item) => {
    item.status = "Healthy";
    item.lastSyncedAt = new Date().toISOString();
  });
  saveFinanceData();
  addAdminAudit("Synced bank balances");
  render();
  showToast("Bank balances synced");
}

function syncBankTransactions() {
  const account = (financeData.bankAccounts || []).find((item) => item.status !== "Disconnected");
  if (!account) {
    showToast("Connect a bank account first");
    return;
  }
  const merchants = [
    ["Grocery Market", -34.87],
    ["Coffee Shop", -6.45],
    ["Payroll Deposit", 650],
    ["Insurance", -92.8],
  ];
  const [merchantLabel, amount] = merchants[Math.floor(Math.random() * merchants.length)];
  const rule = suggestCategoryForMerchant(merchantLabel);
  financeData.bankTransactions.unshift({
    id: crypto.randomUUID(),
    accountId: account.id,
    itemId: account.itemId,
    merchantLabel,
    amount,
    category: rule.category,
    bucketName: rule.bucketName,
    pending: false,
    date: new Date().toISOString().slice(0, 10),
    notes: "Simulated sync",
    createdAt: new Date().toISOString(),
  });
  account.balance = Math.max(Number(account.balance || 0) + Number(amount), 0);
  account.availableBalance = account.balance;
  account.lastSyncedAt = new Date().toISOString();
  saveFinanceData();
  addAdminAudit("Synced bank transactions");
  render();
  showToast("Bank transactions synced");
}

function disconnectBankItem(bankItemId) {
  if (!window.confirm("Disconnect this bank item from local AllocaFi data?")) return;
  (financeData.bankItems || []).forEach((item) => {
    if (item.id === bankItemId) item.status = "Disconnected";
  });
  (financeData.bankAccounts || []).forEach((account) => {
    if (account.itemId === bankItemId) account.status = "Disconnected";
  });
  saveFinanceData();
  addAdminAudit("Disconnected bank item");
  render();
  showToast("Bank disconnected");
}

function createFamilyGroup() {
  if (financeData.familyGroups.length) return;
  const now = new Date().toISOString();
  financeData.familyGroups.push({
    id: crypto.randomUUID(),
    name: "My Family",
    createdAt: now,
    members: [
      { id: crypto.randomUUID(), name: "You", role: "Owner", privacy: "full account balance", joinedAt: now },
    ],
    buckets: FAMILY_DEFAULT_BUCKETS.map((name) => ({ id: crypto.randomUUID(), name, allocated: name.includes("Rent") ? 1200 : 150, spent: 0 })),
    goals: [
      { id: crypto.randomUUID(), name: "Family Emergency Fund", current: 500, target: 3000 },
      { id: crypto.randomUUID(), name: "Vacation", current: 250, target: 2000 },
    ],
    activity: [],
  });
  financeData.plan = financeData.plan === "Free" ? "Family" : financeData.plan;
  saveFinanceData();
  addAdminAudit("Created family group");
  render();
  showToast("Family dashboard created");
}

function addFamilyInvite() {
  const family = financeData.familyGroups[0];
  if (!family) return;
  const name = window.prompt("Invite member name");
  if (!name) return;
  const invite = { id: crypto.randomUUID(), familyId: family.id, name, role: "Member", status: "Pending", createdAt: new Date().toISOString() };
  financeData.familyInvites.unshift(invite);
  family.members.push({ id: crypto.randomUUID(), name, role: "Member", privacy: "bucket totals only", joinedAt: new Date().toISOString() });
  saveFinanceData();
  addAdminAudit(`Invited family member: ${name}`);
  render();
  showToast("Family invite added locally");
}

function cycleFamilyPrivacy() {
  const family = financeData.familyGroups[0];
  const member = family?.members?.[0];
  if (!member) return;
  const options = ["full account balance", "category totals only", "bucket totals only", "hidden account details"];
  const index = options.indexOf(member.privacy);
  member.privacy = options[(index + 1) % options.length];
  saveFinanceData();
  addAdminAudit(`Changed family privacy to ${member.privacy}`);
  render();
  showToast(`Privacy: ${member.privacy}`);
}

function createBusinessProfile() {
  if (financeData.businessProfiles.length) return;
  const now = new Date().toISOString();
  financeData.businessProfiles.push({
    id: crypto.randomUUID(),
    name: "My Business",
    createdAt: now,
    members: [
      { id: crypto.randomUUID(), name: "You", role: "Owner", joinedAt: now },
      { id: crypto.randomUUID(), name: "Accountant", role: "Accountant", joinedAt: now },
    ],
    buckets: BUSINESS_DEFAULT_BUCKETS.map((name) => ({ id: crypto.randomUUID(), name, allocated: name === "Taxes" ? 500 : name === "Payroll" ? 800 : 150, spent: 0 })),
    vendors: [
      { id: crypto.randomUUID(), name: "Fuel Vendor", monthlySpend: 240 },
      { id: crypto.randomUUID(), name: "Software Tools", monthlySpend: 89 },
    ],
    reports: [],
  });
  financeData.plan = financeData.plan === "Free" ? "Business" : financeData.plan;
  saveFinanceData();
  addAdminAudit("Created business profile");
  render();
  showToast("Business dashboard created");
}

function addBusinessVendor() {
  const business = financeData.businessProfiles[0];
  if (!business) return;
  const name = window.prompt("Vendor name");
  if (!name) return;
  const amount = Number(window.prompt("Monthly spend estimate", "100") || 0);
  business.vendors.unshift({ id: crypto.randomUUID(), name, monthlySpend: amount });
  saveFinanceData();
  addAdminAudit(`Added business vendor: ${name}`);
  render();
  showToast("Vendor added");
}

function calculateAlfiPoints() {
  const bucketCount = (financeData.unifiedBuckets || []).length + wallets.reduce((sum, wallet) => sum + (wallet.allocation?.buckets?.length || 0), 0);
  let points = 100;
  points += wallets.length * 25;
  points += (financeData.bankAccounts || []).filter((account) => account.status !== "Disconnected").length * 40;
  points += bucketCount * 10;
  points += financeData.familyGroups.length ? 100 : 0;
  points += financeData.businessProfiles.length ? 100 : 0;
  return points;
}

function markPaidPlanTest() {
  financeData.plan = financeData.familyGroups.length ? "Family" : financeData.businessProfiles.length ? "Business" : "Plus";
  financeData.rewards.goldenTicket = {
    ...(financeData.rewards.goldenTicket || {}),
    eligible: true,
    reserved: true,
    foundingMemberNumber: financeData.rewards.goldenTicket?.foundingMemberNumber || Math.floor(Math.random() * 1000) + 1,
  };
  saveFinanceData();
  addAdminAudit("Marked paid plan test and reserved Golden Ticket badge");
  render();
  showToast("Golden Ticket badge reserved for testing");
}

function updateFirstProposal(status) {
  const proposal = financeData.community?.proposals?.[0];
  if (!proposal) return;
  proposal.status = status;
  addAdminAudit(`${status} proposal: ${proposal.title}`);
  render();
  showToast(`Proposal ${status.toLowerCase()}`);
}

function collectAiBudgetSnapshot() {
  const dashboard = getMonthlyDashboard();
  const details = getDashboardDetails(dashboard);
  const summary = getUnifiedSummary();
  const overbalancedCount = wallets.filter((wallet) => getWalletOverbalanceAmount(wallet) > 0.01).length;
  return {
    summary: {
      netWorth: summary.netWorth,
      walletBalance: dashboard.walletBalance,
      stablecoinTotal: details.stablecoinTotal,
      pendingIncrease: dashboard.pendingIncrease,
      pendingSpend: dashboard.pendingSpend,
      moneyIn: summary.moneyIn,
      moneyOut: summary.moneyOut,
      activeBuckets: summary.activeBuckets,
      connectedWallets: wallets.length,
      connectedBankAccounts: summary.connectedBankAccounts,
    },
    bills: {
      allocated: details.billsAllocated,
      spent: details.billsSpent,
      required: details.billsRequired,
      shortBy: Math.max(details.billsRequired - details.billsAllocated, 0),
      upcomingCount: getUpcomingBillItems().length,
    },
    wallets: {
      count: wallets.length,
      overbalancedCount,
      assets: details.stablecoins.map(([asset, amount]) => ({ asset, amount })),
    },
    buckets: details.bucketRows.map((row) => ({
      name: row.bucket.name,
      group: row.group,
      allocated: row.allocated,
      spent: row.spent,
      left: row.left,
    })),
    goals: {
      count: goals.length,
      current: details.goalCurrent,
      target: details.goalTotal,
    },
    guardrails: {
      nonCustodial: true,
      neverMoveFunds: true,
      requireConfirmationForChanges: true,
    },
  };
}

function collectAiCategorizationSnapshot() {
  return {
    transactions: getUnifiedTransactions().slice(0, 16).map((tx) => ({
      sourceType: tx.sourceType,
      merchantLabel: tx.merchantLabel || tx.notes || tx.category || "Activity",
      amount: tx.displayAmount || Math.abs(Number(tx.amount || 0)),
      category: tx.category || "Uncategorized",
      bucketName: tx.bucketName || "",
      status: tx.status || "Local",
    })),
    savedRules: (financeData.categoryRules || []).slice(0, 20).map((rule) => ({
      match: rule.match,
      category: rule.category,
      bucketName: rule.bucketName,
    })),
    guardrails: {
      suggestionsOnly: true,
      userMustApproveRules: true,
    },
  };
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
  try {
    const response = await fetchWithTimeout("/api/ai/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collectAiBudgetSnapshot()),
    }, 12000);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "AI insights unavailable");
    saveAiInsightsState({
      mode: data.mode || "local-ai",
      model: data.model || "local-rules",
      redacted: Boolean(data.redacted),
      cost: data.cost || {},
      insights: Array.isArray(data.insights) ? data.insights : [],
      updatedAt: new Date().toISOString(),
    });
    render();
    showToast(data.mode === "openai" ? "AI insights updated" : "Local AI insights updated");
  } catch (error) {
    showToast(error?.message || "AI insights unavailable");
  }
}

async function openAiCategoryDialog() {
  try {
    const response = await fetchWithTimeout("/api/ai/categorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collectAiCategorizationSnapshot()),
    }, 12000);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "AI categories unavailable");
    const suggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
    saveAiCategorySuggestions(suggestions);
    openDialog(`
      <div class="dialog-content">
        <h2>AI Category Suggestions</h2>
        <p class="wallet-note">Suggestions are redacted and never auto-applied. Pick a suggestion to save a category memory rule.</p>
        <div class="overview-list">
          ${suggestions.length ? suggestions.map((suggestion, index) => `
            <div class="overview-row compact ai-suggestion-row">
              <span>
                <strong>${escapeHtml(suggestion.merchant || "Transaction")}</strong>
                ${escapeHtml(suggestion.reason || "Suggested from activity pattern")}
              </span>
              <strong>${escapeHtml(suggestion.bucketName || suggestion.category || "Review")}</strong>
              <button class="secondary-button apply-ai-category" data-ai-suggestion="${index}" type="button">Save rule</button>
            </div>
          `).join("") : `<p class="wallet-note">No transactions available for suggestions yet.</p>`}
        </div>
        <p class="form-note">${escapeHtml(data.mode || "local-ai")} · Redacted before analysis · User approval required</p>
      </div>
    `);
    dialogContent.querySelectorAll(".apply-ai-category").forEach((button) => {
      button.addEventListener("click", () => applyAiCategorySuggestion(Number(button.dataset.aiSuggestion || 0)));
    });
  } catch (error) {
    showToast(error?.message || "AI categories unavailable");
  }
}

function applyAiCategorySuggestion(index) {
  const suggestion = aiCategorySuggestions[index];
  if (!suggestion) return;
  const match = String(suggestion.merchant || "").replace(/\[[^\]]+\]/g, "").trim().slice(0, 40);
  if (!match) {
    showToast("This suggestion needs a clearer merchant");
    return;
  }
  financeData.categoryRules = financeData.categoryRules || [];
  financeData.categoryRules.unshift({
    id: crypto.randomUUID(),
    match,
    category: suggestion.category || "Uncategorized",
    bucketName: suggestion.bucketName || "",
    source: "ai-approved",
    confidence: Number(suggestion.confidence || 0),
    createdAt: new Date().toISOString(),
  });
  saveFinanceData();
  walletDialog.close();
  showToast("AI category rule saved");
}

function renderDashboard() {
  const dashboard = getMonthlyDashboard();
  const details = getDashboardDetails(dashboard);
  const upcomingBills = getUpcomingBillItems();
  const balanceTasks = wallets.flatMap((wallet) => {
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
    if (pendingIncrease > 0.01) {
      tasks.push({
        type: "newFunds",
        walletId: wallet.id,
        title: "New funds detected",
        detail: `${wallet.name} needs ${formatUsd(pendingIncrease)} allocated into Virtual Bucket Accounts.`,
        amount: pendingIncrease,
      });
    }
    if (pendingSpend > 0.01) {
      tasks.push({
        type: "unassignedSpend",
        walletId: wallet.id,
        title: "Unassigned spending",
        detail: `${wallet.name} has ${formatUsd(pendingSpend)} that needs a bucket or liquidation rebalance.`,
        amount: pendingSpend,
      });
    }
    return tasks;
  }).concat(upcomingBills.slice(0, 4).map((item) => ({
    type: "billDue",
    walletId: item.walletId,
    bucketId: item.bucketId,
    title: `${item.bill.name} ${item.label.toLowerCase()}`,
    detail: `${item.walletName} bill due ${item.dateLabel}${Number(item.bill.required || 0) > 0 ? ` for ${formatUsd(item.bill.required)}` : ""}.`,
    amount: Number(item.bill.required || 0),
  })));
  dashboardMonth.textContent = dashboard.monthLabel;
  const utilization = dashboard.allocated > 0
    ? Math.min((dashboard.monthSpending / dashboard.allocated) * 100, 999)
    : 0;
  const moneyIn = dashboard.pendingIncrease;
  const moneyOut = dashboard.moneyOut;
  const flowTotal = Math.max(moneyIn + moneyOut, 1);
  const stablecoinPercent = dashboard.walletBalance > 0 ? Math.min((details.stablecoinTotal / dashboard.walletBalance) * 100, 100) : 0;
  const billsTarget = details.billsRequired || details.billsAllocated || 1;
  const billsProgress = Math.min((Math.max(details.billsAllocated - details.billsSpent, 0) / billsTarget) * 100, 100);
  const goalProgress = details.goalTotal > 0 ? Math.min((details.goalCurrent / details.goalTotal) * 100, 100) : 0;

  const stats = [
    ["Net Worth", formatUsd(dashboard.trackedValue), "Total tracked value across wallets"],
    ["Wallet Balance", formatUsd(dashboard.walletBalance), "Live balances from saved addresses"],
    ["Recorded Spending", formatUsd(dashboard.monthSpending), `${utilization.toFixed(0)}% of allocated funds used`],
    ["Active Buckets", String(dashboard.bucketCount), "Virtual Bucket Accounts in use"],
  ];

  dashboardStats.innerHTML = stats.map(([label, value, helper]) => `
    <div class="stat-tile hero-stat">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${helper}</small>
    </div>
  `).join("");

  const alerts = [];
  dashboard.ruleAlerts.slice(0, 2).forEach((message) => alerts.push(message));
  dashboard.lowBuckets.slice(0, 2).forEach((message) => alerts.push(message));
  if (dashboard.bucketCount === 0 && wallets.length) alerts.push("Create Virtual Bucket Accounts to start budgeting tracked balances.");
  if (!wallets.length) alerts.push("Add a wallet address to start your AllocaFi dashboard.");
  const aiInsights = getAiDisplayInsights(details.insights);
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
          <small>Complete these to keep Virtual Bucket Accounts matched to the real wallet balance.</small>
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
                : task.type === "billDue"
                  ? `<button class="secondary-button dashboard-open-bills" data-wallet-id="${task.walletId}" data-bucket-id="${task.bucketId}" type="button">Bills</button>`
                : `<button class="secondary-button dashboard-assign-spend" data-wallet-id="${task.walletId}" type="button">Assign</button>`}
            </article>
          `).join("")}
        </div>
      </section>
    ` : ""}
    <section class="overview-grid">
      <div class="overview-card flow-card">
        <div class="overview-card-head"><span>Monthly Money Flow</span><strong>${formatUsd(moneyIn - moneyOut)}</strong></div>
        <div class="flow-bars">
          <div><span>Money In</span><strong>${formatUsd(moneyIn)}</strong><div class="mini-meter in"><i style="width:${Math.min((moneyIn / flowTotal) * 100, 100)}%"></i></div></div>
          <div><span>Money Out</span><strong>${formatUsd(moneyOut)}</strong><div class="mini-meter out"><i style="width:${Math.min((moneyOut / flowTotal) * 100, 100)}%"></i></div></div>
        </div>
      </div>
      <div class="overview-card health-card">
        <div class="overview-card-head"><span>Wallet Health Score</span><strong>${details.healthScore}/100</strong></div>
        <div class="health-ring" style="--score:${details.healthScore}%"><span>${details.healthScore}</span></div>
        <p>${details.healthScore >= 75 ? "Strong organization" : details.healthScore >= 50 ? "Good start" : "Needs allocation"}</p>
      </div>
      <div class="overview-card">
        <div class="overview-card-head"><span>Bucket Progress</span><strong>${dashboard.bucketCount}</strong></div>
        <div class="overview-list">
          ${details.bucketRows.length ? details.bucketRows.map((row) => {
            const progress = row.allocated > 0 ? Math.min((row.spent / row.allocated) * 100, 100) : 0;
            return `<div class="overview-row"><span>${escapeHtml(row.bucket.name)}</span><strong>${formatUsd(row.left)} balance</strong><div class="mini-meter"><i style="width:${progress}%"></i></div></div>`;
          }).join("") : `<p class="wallet-note">Create Virtual Bucket Accounts to see progress.</p>`}
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-card-head"><span>Spending Categories</span><strong>${formatUsd(dashboard.monthSpending)}</strong></div>
        <div class="overview-list">
          ${details.categories.length ? details.categories.map(([name, amount]) => `<div class="overview-row compact"><span>${escapeHtml(name)}</span><strong>${formatUsd(amount)}</strong></div>`).join("") : `<p class="wallet-note">No categorized spending this month.</p>`}
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-card-head"><span>Stablecoin Ratio</span><strong>${stablecoinPercent.toFixed(0)}%</strong></div>
        <div class="mini-meter stable"><i style="width:${stablecoinPercent}%"></i></div>
        <div class="overview-list">
          ${details.stablecoins.length ? details.stablecoins.map(([asset, amount]) => `<div class="overview-row compact"><span>${escapeHtml(asset)}</span><strong>${formatUsd(amount)}</strong></div>`).join("") : `<p class="wallet-note">No stablecoin balances tracked yet.</p>`}
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-card-head"><span>Bills Section</span><strong>${formatUsd(Math.max(details.billsAllocated - details.billsSpent, 0))}</strong></div>
        <div class="mini-meter bills"><i style="width:${billsProgress}%"></i></div>
        <p>${details.billsRequired ? `${formatUsd(details.billsRequired)} required monthly` : "Set bill amounts to track monthly requirements."}</p>
      </div>
      <div class="overview-card">
        <div class="overview-card-head"><span>Goal Tracking</span><strong>${goalProgress.toFixed(0)}%</strong></div>
        <div class="mini-meter goals"><i style="width:${goalProgress}%"></i></div>
        <p>${goals.length ? `${formatUsd(details.goalCurrent)} saved of ${formatUsd(details.goalTotal)}` : "Add goals for emergency funds, savings, or investing."}</p>
      </div>
      <div class="overview-card insight-card">
        <div class="overview-card-head">
          <span>AI Insights</span>
          <strong>${aiInsights.length}</strong>
        </div>
        <div class="overview-list">
          ${aiInsights.length ? aiInsights.map((insight) => {
            const severity = String(insight.severity || "info").toLowerCase();
            const severityClass = ["warning", "success", "risk", "action", "info"].includes(severity) ? severity : "info";
            return `
              <div class="overview-row compact ai-insight-row ${severityClass}">
                <span>
                  <strong>${escapeHtml(insight.title || "Insight")}</strong>
                  ${escapeHtml(insight.message || "")}
                </span>
                <em>${escapeHtml(insight.action || (insight.requiresConfirmation ? "Confirm first" : "Review"))}</em>
              </div>
            `;
          }).join("") : `<p class="wallet-note">No insights yet. Refresh AI after adding wallets and Virtual Bucket Accounts.</p>`}
        </div>
        <div class="dialog-actions">
          <button id="refreshAiInsights" class="secondary-button" type="button">Refresh AI</button>
        </div>
        <p class="form-note">${escapeHtml(aiModeLabel)} | ${aiInsightsState?.redacted ? "redacted summaries" : "local summaries"} | ${escapeHtml(aiUpdatedLabel)} | ${escapeHtml(aiCostLabel)}</p>
      </div>
    </section>
    ${alerts.length ? `<section class="overview-alert-strip">${alerts.map((alert) => `<div class="alert-tile"><span>Alert</span><strong>${escapeHtml(alert)}</strong></div>`).join("")}</section>` : ""}
  `;

  dashboardAlerts.querySelectorAll(".dashboard-allocate-pending").forEach((button) => {
    button.addEventListener("click", () => allocatePendingFunds(button.dataset.walletId));
  });
  dashboardAlerts.querySelectorAll(".dashboard-assign-spend").forEach((button) => {
    button.addEventListener("click", () => openSpendDialog(button.dataset.walletId, null, true));
  });
  dashboardAlerts.querySelectorAll(".dashboard-rebalance-wallet").forEach((button) => {
    button.addEventListener("click", () => refreshVirtualAccounts(button.dataset.walletId));
  });
  dashboardAlerts.querySelectorAll(".dashboard-open-bills").forEach((button) => {
    button.addEventListener("click", () => openBillsPlannerDialog(button.dataset.walletId, button.dataset.bucketId));
  });
  dashboardAlerts.querySelector("#refreshAiInsights")?.addEventListener("click", refreshAiInsights);
}
function renderGoals() {
  if (!goals.length) {
    goalList.innerHTML = `
      <div class="goal-card">
        <strong>No goals yet</strong>
        <span class="goal-meta">Create goals like Emergency Fund, Vacation, House Fund, or Bitcoin investing.</span>
      </div>
    `;
    return;
  }

  goalList.innerHTML = goals.map((goal) => {
    const current = Number(goal.current || 0);
    const target = Number(goal.target || 0);
    const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    return `
      <div class="goal-card">
        <div class="goal-topline">
          <strong>${escapeHtml(goal.name)}</strong>
          <span class="status-pill live">${percent.toFixed(0)}%</span>
        </div>
        <div class="goal-meter"><span style="width:${percent}%"></span></div>
        <span class="goal-meta">${formatUsd(current)} saved of ${formatUsd(target)} target</span>
        <div class="dialog-actions">
          <button class="secondary-button edit-goal" data-goal-id="${goal.id}" type="button">Update</button>
          <button class="danger-button delete-goal" data-goal-id="${goal.id}" type="button">Delete</button>
        </div>
      </div>
    `;
  }).join("");

  goalList.querySelectorAll(".edit-goal").forEach((button) => {
    button.addEventListener("click", () => openGoalDialog(button.dataset.goalId));
  });
  goalList.querySelectorAll(".delete-goal").forEach((button) => {
    button.addEventListener("click", () => {
      goals = goals.filter((goal) => goal.id !== button.dataset.goalId);
      saveGoals();
      renderGoals();
      showToast("Goal deleted");
    });
  });
}

function renderTransactionLog() {
  const search = transactionSearch?.value.trim().toLowerCase() || "";
  const monthMode = transactionMonth?.value || "all";
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const transactions = getAllTransactions().filter((tx) => {
    const haystack = `${tx.walletName} ${tx.bucketName || ""} ${tx.note || ""} ${tx.asset || ""} ${tx.network || ""}`.toLowerCase();
    const matchesSearch = !search || haystack.includes(search);
    const matchesMonth = monthMode !== "current" || tx.createdAt?.startsWith(monthKey);
    return matchesSearch && matchesMonth;
  });
  if (!transactions.length) {
    transactionLog.innerHTML = `
      <div class="log-row">
        <strong>No local transactions yet</strong>
        <span class="log-meta">Record bucket spending or send from a bucket to build this log.</span>
      </div>
    `;
    return;
  }

  transactionLog.innerHTML = transactions.slice(0, 20).map((tx) => `
    <div class="log-row">
      <div class="log-topline">
        <strong>${escapeHtml(tx.bucketName || "Uncategorized")}</strong>
        <span class="status-pill">${formatUsd(Number(tx.amount || 0))}</span>
      </div>
      <span class="log-meta">${new Date(tx.createdAt).toLocaleString()} Â· ${escapeHtml(tx.walletName)} Â· ${escapeHtml(tx.network)} ${escapeHtml(tx.asset || "")}</span>
      ${tx.note ? `<span class="log-meta">${escapeHtml(tx.note)}</span>` : ""}
      ${tx.txHash ? `<span class="log-meta">Tx: ${escapeHtml(tx.txHash)}</span>` : ""}
    </div>
  `).join("");
}

function getDashboardAlerts() {
  const dashboard = getMonthlyDashboard();
  const alerts = [];
  if (dashboard.pendingIncrease > 0.01) alerts.push(`New funds waiting to allocate: ${formatUsd(dashboard.pendingIncrease)}`);
  if (dashboard.pendingSpend > 0.01) alerts.push(`Unassigned spending needs a bucket: ${formatUsd(dashboard.pendingSpend)}`);
  getUpcomingBillItems().slice(0, 3).forEach((item) => {
    alerts.push(`${item.bill.name} ${item.label.toLowerCase()}${Number(item.bill.required || 0) > 0 ? ` for ${formatUsd(item.bill.required)}` : ""}.`);
  });
  dashboard.ruleAlerts.slice(0, 4).forEach((message) => alerts.push(message));
  dashboard.lowBuckets.slice(0, 3).forEach((message) => alerts.push(message));
  if (dashboard.bucketCount === 0 && wallets.length) alerts.push("Create Virtual Bucket Accounts to start budgeting tracked balances.");
  if (!wallets.length) alerts.push("Add a wallet address to start your AllocaFi dashboard.");
  return alerts;
}

function openMonthlyReport() {
  const dashboard = getMonthlyDashboard();
  const transactions = getAllTransactions();
  const alerts = getDashboardAlerts();
  const bucketRows = wallets.flatMap((wallet) => (wallet.allocation?.buckets || []).map((bucket) => {
    const allocated = Number(bucket.allocated || 0);
    const spent = Number(bucket.spent || 0);
    return {
      wallet: wallet.name,
      bucket: bucket.name,
      allocated,
      spent,
      left: allocated - spent,
    };
  }));
  const goalRows = goals.map((goal) => {
    const current = Number(goal.current || 0);
    const target = Number(goal.target || 0);
    const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    return { ...goal, current, target, progress };
  });

  openDialog(`
    <div class="dialog-content report-view">
      <div class="report-header">
        <h2>AllocaFi Monthly Report</h2>
        <p class="wallet-note">${escapeHtml(dashboard.monthLabel)} Â· Generated ${new Date().toLocaleString()}</p>
      </div>
      <div class="stats-grid">
        <div class="stat-tile"><span>Tracked value</span><strong>${formatUsd(dashboard.trackedValue)}</strong></div>
        <div class="stat-tile"><span>Available in buckets</span><strong>${formatUsd(dashboard.bucketLeft)}</strong></div>
        <div class="stat-tile"><span>Recorded spending</span><strong>${formatUsd(dashboard.monthSpending)}</strong></div>
        <div class="stat-tile"><span>Unassigned spend</span><strong>${formatUsd(dashboard.pendingSpend)}</strong></div>
      </div>
      <div class="report-section">
        <h3>Virtual Bucket Accounts</h3>
        ${bucketRows.length ? `
          <table class="report-table">
            <thead><tr><th>Wallet</th><th>Bucket</th><th>Allocated</th><th>Spent</th><th>Left</th></tr></thead>
            <tbody>${bucketRows.map((row) => `<tr><td>${escapeHtml(row.wallet)}</td><td>${escapeHtml(row.bucket)}</td><td>${formatUsd(row.allocated)}</td><td>${formatUsd(row.spent)}</td><td>${formatUsd(row.left)}</td></tr>`).join("")}</tbody>
          </table>
        ` : `<p class="wallet-note">No Virtual Bucket Accounts yet.</p>`}
      </div>
      <div class="report-section">
        <h3>Goals</h3>
        ${goalRows.length ? `
          <table class="report-table">
            <thead><tr><th>Goal</th><th>Current</th><th>Target</th><th>Progress</th></tr></thead>
            <tbody>${goalRows.map((goal) => `<tr><td>${escapeHtml(goal.name)}</td><td>${formatUsd(goal.current)}</td><td>${formatUsd(goal.target)}</td><td>${goal.progress.toFixed(0)}%</td></tr>`).join("")}</tbody>
          </table>
        ` : `<p class="wallet-note">No goals yet.</p>`}
      </div>
      <div class="report-section">
        <h3>Alerts</h3>
        ${alerts.length ? alerts.map((alert) => `<div class="alert-tile"><strong>${escapeHtml(alert)}</strong></div>`).join("") : `<p class="wallet-note">No active alerts.</p>`}
      </div>
      <div class="report-section">
        <h3>Recent Activity</h3>
        ${transactions.length ? `
          <table class="report-table">
            <thead><tr><th>Date</th><th>Wallet</th><th>Bucket</th><th>Amount</th><th>Note</th></tr></thead>
            <tbody>${transactions.slice(0, 12).map((tx) => `<tr><td>${new Date(tx.createdAt).toLocaleDateString()}</td><td>${escapeHtml(tx.walletName)}</td><td>${escapeHtml(tx.bucketName || "")}</td><td>${formatUsd(Number(tx.amount || 0))}</td><td>${escapeHtml(tx.note || tx.txHash || "")}</td></tr>`).join("")}</tbody>
          </table>
        ` : `<p class="wallet-note">No local activity recorded yet.</p>`}
      </div>
      <div class="dialog-actions">
        <button class="primary-button" type="button" id="printMonthlyReport">Print report</button>
      </div>
    </div>
  `);
  dialogContent.querySelector("#printMonthlyReport").addEventListener("click", () => window.print());
}

function renderAddressBook() {
  if (!addressBook.length) {
    addressBookList.innerHTML = `
      <div class="log-row">
        <strong>No saved nicknames yet</strong>
        <span class="log-meta">Save frequent recipients like Rent, Gas, Food, or Child Expenses.</span>
      </div>
    `;
    return;
  }

  addressBookList.innerHTML = addressBook.map((entry) => {
    const network = NETWORKS[entry.network];
    return `
      <div class="log-row">
        <div class="log-topline">
          <strong>${escapeHtml(entry.name)}</strong>
          <span class="status-pill">${escapeHtml(entry.bucketName || "No bucket")}</span>
        </div>
        <span class="log-meta">${network ? `${escapeHtml(network.label)} ${escapeHtml(network.asset)} Â· ` : ""}${escapeHtml(entry.address)}</span>
        <div class="dialog-actions">
          <button class="secondary-button edit-address-entry" data-address-id="${entry.id}" type="button">Edit</button>
          <button class="danger-button delete-address-entry" data-address-id="${entry.id}" type="button">Delete</button>
        </div>
      </div>
    `;
  }).join("");

  addressBookList.querySelectorAll(".edit-address-entry").forEach((button) => {
    button.addEventListener("click", () => openAddressBookDialog(button.dataset.addressId));
  });
  addressBookList.querySelectorAll(".delete-address-entry").forEach((button) => {
    button.addEventListener("click", () => {
      addressBook = addressBook.filter((entry) => entry.id !== button.dataset.addressId);
      saveAddressBook();
      renderAddressBook();
      showToast("Nickname deleted");
    });
  });
}

function renderAllocationPanel(wallet) {
  if (!wallet.allocation?.buckets?.length) {
    return `
      <div class="allocation-summary wide-empty">
        <strong>No Virtual Bucket Accounts yet</strong>
        <span>Use Auto Allocate in the wallet panel to split this balance into Virtual Bucket Accounts.</span>
      </div>
    `;
  }

  const totals = getAllocationTotals(wallet);
  const pendingIncrease = getWalletAssignableAmount(wallet);
  const pendingSpend = Number(wallet.allocation.pendingSpend || 0);
  const overbalance = getWalletOverbalanceAmount(wallet);
  const pendingHtml = pendingIncrease > 0.01 || pendingSpend > 0.01 || overbalance > 0.01
    ? `
      <div class="pending-box balance-required">
        <div class="balance-required-head">
          <strong>Wallet needs balancing</strong>
          <span>Complete these tasks so the Virtual Bucket Accounts match the real wallet activity.</span>
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
    return `
      <div class="bucket-row">
        <div class="bucket-topline">
          <strong>${escapeHtml(bucket.name)}</strong>
          <span class="bucket-balance">${formatUsd(balance)}</span>
        </div>
        <div class="meter-row">
          <div class="meter-label"><span>Allocation share</span><strong>${allocationPercent}%</strong></div>
          <div class="bucket-meter"><span style="width:${allocationPercent}%"></span></div>
        </div>
        <div class="bucket-money">
          <small>Spent ${formatUsd(spent)} of ${formatUsd(allocated)}</small>
        </div>
        <div class="bucket-actions">
          <button class="secondary-button spend-bucket" data-bucket-id="${bucket.id}" type="button">Record spend</button>
          <button class="primary-button send-bucket" data-bucket-id="${bucket.id}" type="button">Send from bucket</button>
          <button class="ghost-button rules-bucket" data-bucket-id="${bucket.id}" type="button">Rules</button>
          ${isBillsBucket(bucket) ? `<button class="ghost-button bills-bucket" data-bucket-id="${bucket.id}" type="button">Bills</button>` : ""}
        </div>
        ${renderBucketRules(bucket)}
      </div>
    `;
  }).join("");

  return `
    <div class="bucket-panel-heading">
      <div>
        <strong>Virtual Bucket Accounts</strong>
        <span>Available in buckets: ${formatUsd(totals.left)}</span>
      </div>
      <span class="status-pill live">${formatUsd(totals.walletValue)}</span>
    </div>
    ${pendingHtml}
    <div class="bucket-list">${bucketRows}</div>
  `;
}

function renderAllocationRows(buckets) {
  return buckets.map((bucket, index) => `
    <div class="allocation-row">
      <label>
        Bucket name
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

function shortAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
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

function isValidAddressForNetwork(address, networkKey) {
  const network = NETWORKS[networkKey];
  if (network.kind === "bitcoin") return isBitcoinAddress(address);
  if (["evm-usdc", "evm-stablecoin", "evm-native"].includes(network.kind)) return isEvmAddress(address);
  if (["solana-native", "solana-token"].includes(network.kind)) return isSolanaAddress(address);
  return false;
}

function cleanAddress(value) {
  return value.trim().replace(/\s+/g, "");
}

function populateNetworks() {
  Object.entries(NETWORKS).forEach(([key, network]) => {
    const optionLabel = `${network.label} ${network.asset}`;
    const option = new Option(optionLabel, key);
    networkSelect.add(option);
    filterNetwork.add(new Option(optionLabel, key));
  });
}

function getBucketGroup(name) {
  const normalized = name.toLowerCase();
  if (["rent", "mortgage", "utilities", "electric", "water", "internet", "phone", "bills"].some((word) => normalized.includes(word))) return "Bills";
  if (["savings", "emergency", "investment", "invest", "reserve"].some((word) => normalized.includes(word))) return "Savings";
  if (["vacation", "house", "car", "goal", "child"].some((word) => normalized.includes(word))) return "Goals";
  return "Available Cashflow";
}

function getBucketIcon(name) {
  const normalized = name.toLowerCase();
  if (normalized.includes("food") || normalized.includes("groceries") || normalized.includes("eating")) return "🛒";
  if (normalized.includes("gas") || normalized.includes("transport") || normalized.includes("car")) return "⛽";
  if (normalized.includes("bill") || normalized.includes("rent") || normalized.includes("mortgage") || normalized.includes("utilities")) return "🏠";
  if (normalized.includes("saving") || normalized.includes("emergency") || normalized.includes("reserve")) return "🏦";
  if (normalized.includes("invest")) return "📈";
  if (normalized.includes("vacation") || normalized.includes("travel")) return "🏖️";
  if (normalized.includes("child") || normalized.includes("education")) return "🎓";
  if (normalized.includes("medical")) return "⚕️";
  if (normalized.includes("tax")) return "🧾";
  if (normalized.includes("personal") || normalized.includes("free") || normalized.includes("lifestyle")) return "✨";
  return "💼";
}

function isSendCapableWallet(wallet) {
  const network = NETWORKS[wallet?.network];
  return Boolean(network && ["evm-native", "evm-usdc", "evm-stablecoin", "solana-token"].includes(network.kind));
}

function renderBucketAccounts() {
  const accounts = wallets.flatMap((wallet) => (wallet.allocation?.buckets || []).map((bucket) => {
    const walletOverbalance = getWalletOverbalanceAmount(wallet);
    const allocated = Number(bucket.allocated || 0);
    const spent = Number(bucket.spent || 0);
    const balance = Math.max(allocated - spent, 0);
    const usedPercent = allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0;
    const rules = bucket.rules || {};
    const subaccounts = normalizeSubaccounts(bucket.subaccounts || []);
    const monthlyRequired = getMonthlyBillTotal(bucket);
    const weeklyTarget = monthlyRequired / 4;
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
      canSend: isSendCapableWallet(wallet),
      bucket,
      group: getBucketGroup(bucket.name),
      icon: getBucketIcon(bucket.name),
      balance,
      allocated,
      spent,
      walletOverbalance,
      usedPercent,
      allocationPercent: 0,
      status,
      monthlyRequired,
      weeklyTarget,
      subaccounts,
    };
  }));

  if (!accounts.length) {
    bucketAccountsView.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">â–¤</div>
        <h3>No Virtual Bucket Accounts yet</h3>
        <p>Use Assign Money to create a starter weekly allocation plan.</p>
        <button class="primary-button empty-assign" type="button">Assign Money</button>
      </div>
    `;
    bucketAccountsView.querySelector(".empty-assign").addEventListener("click", openAssignMoneyDialog);
    return;
  }

  const groups = ["Available Cashflow", "Bills", "Savings", "Goals"];
  bucketAccountsView.innerHTML = groups.map((group) => {
    const rows = accounts.filter((account) => account.group === group);
    if (!rows.length) return "";
    const groupTotal = rows.reduce((sum, account) => sum + account.balance, 0);
    const isCashflowGroup = group === "Available Cashflow";
    return `
      <section class="bucket-group ${isCashflowGroup ? "cashflow-group" : ""}">
        <div class="bucket-group-heading">
          <div>
            <h3>${group}</h3>
            ${isCashflowGroup ? `<p>Flexible money available after priority accounts</p>` : ""}
          </div>
          <span class="${isCashflowGroup ? "cashflow-total" : ""}">${formatUsd(groupTotal)} ${isCashflowGroup ? "" : "total balance"}</span>
        </div>
        ${rows.map((account, index) => `
          <article class="account-row ${account.walletOverbalance > 0.01 ? "needs-rebalance" : ""}" data-wallet-id="${account.walletId}" data-bucket-id="${account.bucket.id}" tabindex="0" role="button" aria-label="Open ${escapeHtml(account.bucket.name)} account details">
            <div class="account-main">
              <div class="account-icon">${account.icon}</div>
              <div class="account-name">
                <strong>${escapeHtml(account.bucket.name)}</strong>
                <span>${escapeHtml(account.walletName)} · Spent ${formatUsd(account.spent)} this week${account.monthlyRequired > 0 ? ` · Weekly target ${formatUsd(account.weeklyTarget)}` : ""}</span>
              </div>
              <div class="account-amount ${index % 3 === 2 ? "blue" : ""}">
                <span>Subaccount Balance</span>
                <strong>${formatUsd(account.balance)}</strong>
              </div>
            </div>
            <div class="account-meter-stack">
              <div class="meter-row">
                <div class="meter-label"><span>Allocation share</span><strong>${Math.min(Math.max(Number(account.bucket.percent || 0), 0), 100)}%</strong></div>
                <div class="account-progress"><span style="width:${Math.min(Math.max(Number(account.bucket.percent || 0), 0), 100)}%"></span></div>
              </div>
              ${account.monthlyRequired > 0 ? `
                <div class="meter-row">
                  <div class="meter-label"><span>Monthly bill goal</span><strong>${Math.min((account.balance / account.monthlyRequired) * 100, 100).toFixed(0)}%</strong></div>
                  <div class="account-progress goal-progress"><span style="width:${Math.min((account.balance / account.monthlyRequired) * 100, 100)}%"></span></div>
                </div>
              ` : ""}
            </div>
            <div class="account-status">${escapeHtml(account.status)}</div>
            ${account.monthlyRequired > 0 ? `<div class="account-status">Monthly bills ${formatUsd(account.monthlyRequired)} · Weekly funding target ${formatUsd(account.weeklyTarget)}</div>` : ""}
            ${account.subaccounts.length ? `
              <div class="subaccount-list">
                ${account.subaccounts.map((subaccount) => `
                  <div class="subaccount-pill">
                    <span><strong>${escapeHtml(subaccount.name)}</strong><small>${escapeHtml(getBillDueText(subaccount))}</small></span>
                    <strong>${formatUsd(Number(subaccount.required || subaccount.allocated || 0))}</strong>
                  </div>
                `).join("")}
              </div>
            ` : ""}
            <div class="account-actions">
              <button class="primary-button account-detail" data-wallet-id="${account.walletId}" data-bucket-id="${account.bucket.id}" type="button">View</button>
              <button class="secondary-button account-edit" data-wallet-id="${account.walletId}" data-bucket-id="${account.bucket.id}" type="button">Edit</button>
              <button class="secondary-button account-move" data-bucket-id="${account.bucket.id}" type="button">Move</button>
              <button class="secondary-button account-spend" data-wallet-id="${account.walletId}" data-bucket-id="${account.bucket.id}" type="button">Record spend</button>
              ${account.walletOverbalance > 0.01 ? `<button class="primary-button account-rebalance" data-wallet-id="${account.walletId}" type="button">Refresh VBAs</button>` : ""}
              ${account.canSend ? `<button class="primary-button account-send" data-wallet-id="${account.walletId}" data-bucket-id="${account.bucket.id}" type="button">Send</button>` : ""}
              <button class="secondary-button account-rules" data-wallet-id="${account.walletId}" data-bucket-id="${account.bucket.id}" type="button">Rules</button>
              ${isBillsBucket(account.bucket) ? `<button class="secondary-button account-bills" data-wallet-id="${account.walletId}" data-bucket-id="${account.bucket.id}" type="button">Bills</button>` : ""}
            </div>
          </article>
        `).join("")}
      </section>
    `;
  }).join("");

  bucketAccountsView.querySelectorAll(".account-spend").forEach((button) => {
    button.addEventListener("click", () => openSpendDialog(button.dataset.walletId, button.dataset.bucketId));
  });
  bucketAccountsView.querySelectorAll(".account-row").forEach((row) => {
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
}

function getFundingQueueItems() {
  const items = [];
  const readyToAssign = getReadyToAssign();
  if (readyToAssign > 0.01) {
    items.push({
      type: "assign",
      title: `${formatUsd(readyToAssign)} ready to assign`,
      detail: "Split available value into your Virtual Bucket Accounts.",
      amount: readyToAssign,
    });
  }

  wallets.forEach((wallet) => {
    const overbalance = getWalletOverbalanceAmount(wallet);
    if (overbalance > 0.01) {
      items.push({
        type: "overbalance",
        walletId: wallet.id,
        title: `${wallet.name} needs VBA refresh`,
        detail: `Virtual Bucket Accounts are ${formatUsd(overbalance)} above the actual wallet balance. Refresh VBAs to match the current wallet.`,
        amount: overbalance,
      });
    }

    if (Number(wallet.allocation?.pendingSpend || 0) > 0.01) {
      items.push({
        type: "pendingSpend",
        walletId: wallet.id,
        title: `${formatUsd(wallet.allocation.pendingSpend)} unassigned spending`,
        detail: `${wallet.name} has spending that needs a bucket.`,
        amount: Number(wallet.allocation.pendingSpend),
      });
    }

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
            ${item.type === "assign" ? `<button class="primary-button queue-assign" type="button">Assign Money</button>` : ""}
            ${item.type === "overbalance" ? `<button class="primary-button queue-rebalance-wallet" data-wallet-id="${item.walletId}" type="button">Refresh VBAs</button>` : ""}
            ${item.type === "pendingSpend" ? `<button class="secondary-button queue-assign-spend" data-wallet-id="${item.walletId}" type="button">Assign spend</button>` : ""}
            ${item.type === "billDue" ? `<button class="secondary-button queue-open-bills" data-wallet-id="${item.walletId}" data-bucket-id="${item.bucketId}" type="button">Bills</button>` : ""}
            ${item.type === "reset" ? `<button class="primary-button queue-apply-reset" data-wallet-id="${item.walletId}" data-bucket-id="${item.bucketId}" type="button">Apply reset</button>` : ""}
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
  fundingQueue.querySelectorAll(".queue-assign-spend").forEach((button) => {
    button.addEventListener("click", () => openSpendDialog(button.dataset.walletId, null, true));
  });
  fundingQueue.querySelectorAll(".queue-rebalance-wallet").forEach((button) => {
    button.addEventListener("click", () => refreshVirtualAccounts(button.dataset.walletId));
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

function render() {
  const selectedNetwork = filterNetwork.value;
  const visibleWallets = wallets.filter((wallet) => selectedNetwork === "all" || wallet.network === selectedNetwork);
  if (!wallets.some((wallet) => wallet.id === selectedWalletId)) selectedWalletId = wallets[0]?.id || "";
  const activeWallet = visibleWallets.find((wallet) => wallet.id === selectedWalletId) || visibleWallets[0] || null;
  if (activeWallet) selectedWalletId = activeWallet.id;
  walletList.innerHTML = "";
  walletSidebarList.innerHTML = wallets.length ? wallets.map((wallet) => {
    const network = NETWORKS[wallet.network];
    const canSend = wallet.allocation?.buckets?.length && isSendCapableWallet(wallet);
    const taskCount = getWalletBalanceTaskCount(wallet);
    return `
      <button class="wallet-sidebar-item ${wallet.id === selectedWalletId ? "active" : ""} ${taskCount ? "needs-balance" : ""}" data-wallet-id="${wallet.id}" type="button">
        <strong>${escapeHtml(wallet.name)}</strong>
        <span>${escapeHtml(network.label)} ${escapeHtml(network.asset)}</span>
        <span>${formatBalance(wallet)}</span>
        ${taskCount ? `<span class="attention-pill">${taskCount} balance ${taskCount === 1 ? "task" : "tasks"}</span>` : ""}
      </button>
      <div class="wallet-sidebar-actions ${wallet.id === selectedWalletId ? "active" : ""}" data-wallet-actions="${wallet.id}">
        <button class="secondary-button sidebar-allocate" data-wallet-id="${wallet.id}" type="button">Auto Allocate</button>
        <button class="secondary-button sidebar-refresh" data-wallet-id="${wallet.id}" type="button">Refresh</button>
        ${wallet.allocation?.buckets?.length ? `<button class="secondary-button sidebar-rebalance" data-wallet-id="${wallet.id}" type="button">Refresh VBAs</button>` : ""}
        <button class="secondary-button sidebar-scan" data-wallet-id="${wallet.id}" type="button">Scan assets</button>
        <button class="ghost-button sidebar-copy" data-wallet-id="${wallet.id}" type="button">Copy</button>
        ${wallet.allocation?.buckets?.length ? `<button class="secondary-button sidebar-receive" data-wallet-id="${wallet.id}" type="button">Receive</button>` : ""}
        ${canSend ? `<button class="primary-button sidebar-send" data-wallet-id="${wallet.id}" type="button">Send</button>` : ""}
      </div>
    `;
  }).join("") : `
    <div class="wallet-sidebar-item">
      <strong>No wallets yet</strong>
      <span>Use the + button above to add one public address.</span>
    </div>
  `;
  walletSidebarList.querySelectorAll("[data-wallet-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedWalletId = button.dataset.walletId;
      render();
    });
  });
  walletSidebarList.querySelectorAll(".sidebar-allocate").forEach((button) => button.addEventListener("click", () => openAllocationDialog(button.dataset.walletId)));
  walletSidebarList.querySelectorAll(".sidebar-refresh").forEach((button) => button.addEventListener("click", () => refreshWallet(button.dataset.walletId)));
  walletSidebarList.querySelectorAll(".sidebar-rebalance").forEach((button) => button.addEventListener("click", () => refreshVirtualAccounts(button.dataset.walletId)));
  walletSidebarList.querySelectorAll(".sidebar-scan").forEach((button) => button.addEventListener("click", () => scanAssets(button.dataset.walletId)));
  walletSidebarList.querySelectorAll(".sidebar-copy").forEach((button) => {
    button.addEventListener("click", () => {
      const wallet = wallets.find((item) => item.id === button.dataset.walletId);
      if (wallet) copyAddress(wallet.address);
    });
  });
  walletSidebarList.querySelectorAll(".sidebar-receive").forEach((button) => button.addEventListener("click", () => openReceiveDialog(button.dataset.walletId)));
  walletSidebarList.querySelectorAll(".sidebar-send").forEach((button) => button.addEventListener("click", () => openSendDialog(button.dataset.walletId)));

  (activeWallet ? [activeWallet] : []).forEach((wallet) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const network = NETWORKS[wallet.network];

    card.dataset.id = wallet.id;
    card.classList.add("bucket-only-card");
    card.querySelectorAll(".card-topline, .balance-row, .meter, .wallet-address, .wallet-note, .card-actions, .more-actions").forEach((node) => node.remove());
    const statusBanner = wallet.error || wallet.status
      ? `<div class="wallet-status-banner ${wallet.statusType === "error" ? "error" : wallet.statusType === "loading" ? "loading" : wallet.statusType === "warning" ? "warning" : ""}">
          <strong>${escapeHtml(wallet.status || "Wallet status")}</strong>
          ${wallet.error ? `<span>${escapeHtml(wallet.error)}</span>` : ""}
        </div>`
      : "";
    card.querySelector(".allocation-panel").innerHTML = `${statusBanner}${renderAllocationPanel(wallet)}`;
    card.querySelectorAll(".spend-bucket").forEach((button) => {
      button.addEventListener("click", () => openSpendDialog(wallet.id, button.dataset.bucketId));
    });
    card.querySelectorAll(".send-bucket").forEach((button) => {
      button.hidden = !isSendCapableWallet(wallet);
      button.addEventListener("click", () => openSendDialog(wallet.id, button.dataset.bucketId));
    });
    card.querySelectorAll(".rules-bucket").forEach((button) => {
      button.addEventListener("click", () => openBucketRulesDialog(wallet.id, button.dataset.bucketId));
    });
    card.querySelectorAll(".bills-bucket").forEach((button) => {
      button.addEventListener("click", () => openBillsPlannerDialog(wallet.id, button.dataset.bucketId));
    });
    card.querySelector(".allocate-pending")?.addEventListener("click", () => allocatePendingFunds(wallet.id));
    card.querySelector(".assign-pending")?.addEventListener("click", () => openSpendDialog(wallet.id, null, true));
    card.querySelector(".rebalance-wallet")?.addEventListener("click", () => refreshVirtualAccounts(wallet.id));
    walletList.append(card);
  });

  totalBalance.textContent = formatUsd(getReadyToAssign());
  walletCount.textContent = wallets.length === 1 ? "1 wallet saved" : `${wallets.length} wallets saved`;
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
  renderRewardsDashboard();
  renderAdminDashboard();
  renderAccountCloudPanel();
  updateWalletConnectionUi();
}

function updateWalletConnectionUi() {
  const activeAccount = connectedAccount || connectedSolanaAccount;
  const short = activeAccount ? shortAddress(activeAccount) : "";
  const activeLabel = connectedAccount ? connectedWalletLabel : connectedSolanaWalletLabel;
  if (connectWalletButton) {
    const activeWallet = wallets.find((wallet) => wallet.id === selectedWalletId) || wallets[0];
    const network = NETWORKS[activeWallet?.network];
    const walletLabel = network?.kind?.startsWith("solana") ? "Solana" : "Wallet";
    connectWalletButton.textContent = activeAccount ? `${activeLabel || "Wallet"} ${short}` : `Connect ${walletLabel}`;
  }
  if (walletConnectionStatus) {
    walletConnectionStatus.textContent = activeAccount ? `${activeLabel || "Wallet"} connected ${short}` : "Not connected";
  }
  if (walletConnectProjectInput && !walletConnectProjectInput.value) {
    walletConnectProjectInput.value = loadWalletConnectProjectId();
  }
  if (solanaRpcUrlInput && !solanaRpcUrlInput.value) {
    solanaRpcUrlInput.value = loadSolanaRpcUrl();
  } else if (solanaRpcUrlInput && (solanaRpcUrlInput.value.includes("*") || solanaRpcUrlInput.value.includes("..."))) {
    solanaRpcUrlInput.value = "";
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

function openSendDialog(id, bucketId = null) {
  const wallet = wallets.find((item) => item.id === id);
  if (!wallet) return;
  const network = NETWORKS[wallet.network];
  const bucket = wallet.allocation?.buckets?.find((item) => item.id === bucketId);
  const savedRecipients = addressBook.filter((entry) => !entry.network || entry.network === wallet.network);
  const isSolanaSend = network.kind === "solana-token";
  const recipientPlaceholder = isSolanaSend ? "Solana wallet address" : "0x...";
  const sendButtonLabel = `Send with ${isSolanaSend ? "Solana wallet" : "wallet"}`;

  openDialog(`
    <div class="dialog-content">
      <h2>Send ${escapeHtml(network.asset)}</h2>
      <p class="wallet-note">${bucket ? `This send will be recorded under ${escapeHtml(bucket.name)}.` : "Your connected wallet will ask you to approve this transaction."}</p>
      <div class="send-grid">
        <label>
          Saved destination
          <select id="savedRecipient">
            <option value="">Choose saved destination</option>
            ${savedRecipients.map((entry) => `<option value="${entry.id}">${escapeHtml(entry.name)}${entry.network ? "" : " (any network)"}</option>`).join("")}
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
          <input id="sendAmount" type="number" min="0" step="0.00000001" placeholder="0.01" />
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

  dialogContent.querySelector("#savedRecipient").addEventListener("change", () => {
    const entry = addressBook.find((item) => item.id === dialogContent.querySelector("#savedRecipient").value);
    if (!entry) return;
    dialogContent.querySelector("#sendRecipient").value = entry.address;
    dialogContent.querySelector("#sendRecipientName").value = entry.name;
    if (entry.bucketId && !bucketId) showToast(`Suggested bucket: ${entry.bucketName}`);
  });
  dialogContent.querySelector("#sendRecipient").addEventListener("change", () => {
    const entry = findAddressBookEntry(cleanAddress(dialogContent.querySelector("#sendRecipient").value), wallet.network);
    if (!entry) return;
    dialogContent.querySelector("#sendRecipientName").value = entry.name;
    showToast(entry.bucketName ? `Suggested bucket: ${entry.bucketName}` : `Recognized ${entry.name}`);
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
  const activeWallet = wallets.find((wallet) => wallet.id === selectedWalletId) || wallets[0];
  const network = NETWORKS[activeWallet?.network];
  const isSolana = network?.kind?.startsWith("solana");
  const availability = getWalletAvailability();
  const options = isSolana
    ? [
      { id: "phantom", title: "Phantom", helper: "Best current Solana test wallet", available: availability.phantom, action: () => getSolanaProvider("phantom") },
      { id: "trust-walletconnect", title: "Trust Wallet", helper: "Use WalletConnect/Reown for mobile Solana where supported", available: availability.walletConnect, action: () => getSolanaProvider("trust-walletconnect") },
      { id: "walletconnect", title: "WalletConnect / Reown", helper: "Mobile wallet QR/deep link connection", available: availability.walletConnect, action: () => getSolanaProvider("walletconnect") },
    ]
    : [
      { id: "metamask", title: "MetaMask", helper: "Browser extension or injected provider", available: availability.metamask, action: () => connectWalletProvider("metamask") },
      { id: "coinbase", title: "Coinbase Wallet", helper: "Coinbase Wallet extension provider", available: availability.coinbase, action: () => connectWalletProvider("coinbase") },
      { id: "trust", title: "Trust Wallet", helper: "Trust extension if installed, or use WalletConnect below", available: availability.trust, action: () => connectWalletProvider("trust") },
      { id: "trust-walletconnect", title: "Trust Wallet Mobile", helper: "WalletConnect/Reown mobile connection", available: availability.walletConnect, action: () => connectWalletProvider("trust-walletconnect") },
      { id: "walletconnect", title: "WalletConnect / Reown", helper: "QR/deep link support for many wallets", available: availability.walletConnect, action: () => connectWalletProvider("walletconnect") },
    ];

  openDialog(`
    <div class="dialog-content">
      <h2>Connect Wallet</h2>
      <p class="wallet-note">${isSolana ? "Choose a Solana wallet for this account." : "Choose an EVM wallet for Ethereum, Base, Polygon, BNB, Arbitrum, Optimism, or Avalanche."}</p>
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
        <div class="overview-card-head"><span>Supported now</span><strong>${isSolana ? "Solana" : "EVM"}</strong></div>
        <p class="wallet-note">Phantom is supported for Solana. MetaMask, Coinbase Wallet, and Trust Wallet are supported through injected browser providers when installed. Trust Wallet mobile and other wallets use WalletConnect/Reown with a Project ID.</p>
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
        showToast(error?.message || "Wallet connection failed");
      }
    });
  });
}

function openAllocationDialog(id) {
  const wallet = wallets.find((item) => item.id === id);
  if (!wallet) return;
  const existing = wallet.allocation?.buckets?.length ? wallet.allocation.buckets : DEFAULT_BUCKETS;
  const walletValue = getWalletDisplayValue(wallet);
  const templateOptions = Object.entries(BUCKET_TEMPLATES).map(([key, template]) => `
    <label class="template-choice">
      <input type="checkbox" data-template-choice value="${key}" />
      <span>${escapeHtml(template.name)}</span>
    </label>
  `).join("");

  const rows = renderAllocationRows(existing);

  openDialog(`
    <div class="dialog-content">
      <h2>Auto Allocate</h2>
      <p class="wallet-note">Split ${escapeHtml(wallet.name)} into virtual weekly buckets. Current value: ${formatUsd(walletValue)}.</p>
      <div class="template-picker">
        <strong>Allocation templates</strong>
        <p class="form-note">Choose one or more. AllocaFi will combine them and rebalance percentages to 100%.</p>
        <div class="template-choice-grid">${templateOptions}</div>
        <button class="secondary-button" type="button" id="loadAllocationTemplate">Load template</button>
      </div>
      <div class="allocation-grid">${rows}</div>
      <div class="rule-list">
        <div class="rule-pill">Rules available after saving: minimum balance, warning threshold, protected bucket labels.</div>
      </div>
      <div class="dialog-actions">
        <button class="primary-button" type="button" id="saveAllocation">Save allocation</button>
        <button class="ghost-button" type="button" id="resetAllocation">Use defaults</button>
      </div>
      <p class="form-note">Percentages should add up to 100%. These buckets are app-side tracking only and do not move funds on-chain.</p>
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
      pendingIncrease: 0,
      pendingSpend: 0,
      lastValue: walletValue,
      updatedAt: new Date().toISOString(),
    };
    saveWallets();
    render();
    walletDialog.close();
    showToast("Default allocation saved");
  });
}

function openAssignMoneyDialog() {
  if (!wallets.length) {
    showToast("Add a wallet first");
    switchTab("wallets");
    return;
  }

  const walletOptions = wallets.map((wallet) => {
    const value = getWalletDisplayValue(wallet);
    return `<option value="${wallet.id}">${escapeHtml(wallet.name)} Â· ${formatUsd(value)}</option>`;
  }).join("");

  openDialog(`
    <div class="dialog-content">
      <h2>Assign Money</h2>
      <p class="wallet-note">Choose a tracked wallet and split available value into Virtual Bucket Accounts.</p>
      <div class="send-grid">
        <label>
          Wallet
          <select id="assignWallet">${walletOptions}</select>
        </label>
        <label>
          Amount to assign
          <input id="assignAmount" type="number" min="0" step="0.01" placeholder="100.00" />
        </label>
      </div>
      <div id="assignPreview" class="allocation-summary"></div>
      <div class="dialog-actions">
        <button class="primary-button" id="saveAssignedMoney" type="button">Assign to buckets</button>
        <button class="ghost-button" id="editAssignmentPlan" type="button">Edit bucket plan</button>
      </div>
      <p class="form-note">This is a virtual allocation only. Funds remain in your wallet.</p>
    </div>
  `);

  const walletSelect = dialogContent.querySelector("#assignWallet");
  const amountInput = dialogContent.querySelector("#assignAmount");
  const updatePreview = () => renderAssignPreview(walletSelect.value, Number(amountInput.value || 0));
  walletSelect.addEventListener("change", () => {
    const wallet = wallets.find((item) => item.id === walletSelect.value);
    amountInput.value = getWalletAssignableAmount(wallet).toFixed(2);
    updatePreview();
  });
  amountInput.addEventListener("input", updatePreview);
  const firstWallet = wallets.find((wallet) => wallet.id === walletSelect.value);
  amountInput.value = getWalletAssignableAmount(firstWallet).toFixed(2);
  updatePreview();

  dialogContent.querySelector("#saveAssignedMoney").addEventListener("click", saveAssignedMoney);
  dialogContent.querySelector("#editAssignmentPlan").addEventListener("click", () => openAllocationDialog(walletSelect.value));
}

function renderAssignPreview(walletId, amount) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet) return;
  const buckets = wallet.allocation?.buckets?.length ? wallet.allocation.buckets : DEFAULT_BUCKETS;
  const rows = buckets.map((bucket) => {
    const percent = Number(bucket.percent || 0);
    return `<span>${escapeHtml(bucket.name)} gets ${formatUsd(amount * (percent / 100))} (${percent}%)</span>`;
  }).join("");
  dialogContent.querySelector("#assignPreview").innerHTML = `
    <strong>Assignment preview</strong>
    ${rows || "<span>No bucket plan yet.</span>"}
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
  const name = bucketName.trim() || "New Bucket";
  const plan = getRebalancedBucketPlanWithNewBucket(wallet, name, percent);
  dialogContent.querySelector("#addBucketPreview").innerHTML = `
    <strong>Rebalanced template preview</strong>
    ${plan.map((bucket) => `<span>${escapeHtml(bucket.name)} ${Number(bucket.percent || 0).toFixed(1)}% · ${formatUsd(bucket.allocated)}</span>`).join("")}
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
  const walletOptions = wallets.map((wallet) => `
    <option value="${wallet.id}" ${wallet.id === defaultWalletId ? "selected" : ""}>${escapeHtml(wallet.name)} · ${formatUsd(getWalletDisplayValue(wallet))}</option>
  `).join("");

  openDialog(`
    <div class="dialog-content">
      <h2>Add Bucket</h2>
      <p class="wallet-note">Create a new Virtual Bucket Account. AllocaFi will rebalance the selected wallet's saved template to keep the total at 100%.</p>
      <div class="send-grid">
        <label>
          Wallet
          <select id="addBucketWallet">${walletOptions}</select>
        </label>
        <label>
          Bucket name
          <input id="addBucketName" maxlength="40" placeholder="Child Expenses, Taxes, Vacation" />
        </label>
        <label>
          New bucket share
          <input id="addBucketPercent" type="number" min="1" max="99" step="0.1" value="10" />
        </label>
      </div>
      <div id="addBucketPreview" class="allocation-summary"></div>
      <div class="dialog-actions">
        <button class="primary-button" id="saveAddedBucket" type="button">Create and rebalance</button>
        <button class="ghost-button" id="editFullTemplate" type="button">Edit full template</button>
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
    showToast("Add a bucket name");
    return;
  }
  if ((wallet.allocation?.buckets || []).some((bucket) => bucket.name.toLowerCase() === name.toLowerCase())) {
    showToast("That bucket already exists");
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
  showToast(`${name} bucket added and rebalanced`);
}

function saveAssignedMoney() {
  const walletId = dialogContent.querySelector("#assignWallet").value;
  const amount = Number(dialogContent.querySelector("#assignAmount").value || 0);
  const wallet = wallets.find((item) => item.id === walletId);
  const assignable = wallet ? getWalletAssignableAmount(wallet) : 0;
  if (!wallet || amount <= 0) {
    showToast("Enter an amount to assign");
    return;
  }
  if (assignable <= 0.01) {
    if (wallet.allocation) {
      wallet.allocation.pendingIncrease = 0;
      wallet.allocation.updatedAt = new Date().toISOString();
      saveWallets();
      render();
    }
    showToast("Wallet is already balanced");
    return;
  }
  if (amount > assignable + 0.01) {
    showToast(`Only ${formatUsd(assignable)} is available to assign`);
    return;
  }

  if (!wallet.allocation?.buckets?.length) {
    wallet.allocation = {
      cycle: "weekly",
      buckets: DEFAULT_BUCKETS.map((bucket) => ({
        id: crypto.randomUUID(),
        name: bucket.name,
        percent: bucket.percent,
        allocated: 0,
        spent: 0,
      })),
      pendingIncrease: 0,
      pendingSpend: 0,
      lastValue: getWalletDisplayValue(wallet),
      updatedAt: new Date().toISOString(),
    };
  }

  const safeAmount = Math.min(amount, assignable);
  wallet.allocation.buckets.forEach((bucket) => {
    bucket.allocated = Number(bucket.allocated || 0) + safeAmount * (Number(bucket.percent || 0) / 100);
  });
  wallet.allocation.pendingIncrease = Math.max(Number(wallet.allocation.pendingIncrease || 0) - safeAmount, 0);
  clampWalletPendingIncrease(wallet);
  wallet.allocation.lastValue = getWalletDisplayValue(wallet);
  wallet.allocation.updatedAt = new Date().toISOString();
  saveWallets();
  render();
  walletDialog.close();
  showToast("Money assigned");
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
    showToast("Create Virtual Bucket Accounts first");
    return;
  }

  openDialog(`
    <div class="dialog-content">
      <h2>Move Money</h2>
      <p class="wallet-note">Rebalance value between Virtual Bucket Accounts. This does not move funds on-chain.</p>
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
      <h2>Bucket Templates</h2>
      <p class="wallet-note">Apply starter Virtual Bucket Accounts to a tracked wallet.</p>
      <div class="send-grid">
        <label>
          Wallet
          <select id="templateWallet">
            ${wallets.map((wallet) => `<option value="${wallet.id}">${escapeHtml(wallet.name)} Â· ${formatUsd(getWalletDisplayValue(wallet))}</option>`).join("")}
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
            ${Object.entries(NETWORKS).map(([key, network]) => `<option value="${key}" ${entry.network === key ? "selected" : ""}>${escapeHtml(network.label)} ${escapeHtml(network.asset)}</option>`).join("")}
          </select>
        </label>
        <label>
          Default bucket
          <select id="addressNicknameBucket">
            <option value="">No default bucket</option>
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
      <p class="wallet-note">A simple local starter flow. Add your wallet first, then create Virtual Bucket Accounts.</p>
      <div class="send-grid">
        <label>
          Wallet name
          <input id="wizardName" placeholder="Main Spending Wallet" />
        </label>
        <label>
          Asset/network
          <select id="wizardNetwork">
            ${Object.entries(NETWORKS).map(([key, network]) => `<option value="${key}">${escapeHtml(network.label)} ${escapeHtml(network.asset)}</option>`).join("")}
          </select>
        </label>
        <label>
          Public address
          <input id="wizardAddress" spellcheck="false" placeholder="0x..., bc1..., 1..., or 3..." />
        </label>
      </div>
      <div class="dialog-actions">
        <button class="primary-button" id="wizardSave" type="button">Create wallet and buckets</button>
      </div>
      <p class="form-note">This stores only public wallet details and local budgeting data.</p>
    </div>
  `);
  dialogContent.querySelector("#wizardNetwork").value = "ethereumEth";
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
  let buckets = names.map((nameInput, index) => {
    const percentInput = dialogContent.querySelector(`[data-bucket-percent="${index}"]`);
    const name = nameInput.value.trim();
    const percent = Number(percentInput.value);
    const existing = wallet.allocation?.buckets?.[index];
    const rowSubaccounts = (nameInput.dataset.subaccounts || "").split("|").filter(Boolean);
    const existingSubaccounts = normalizeSubaccounts(existing?.subaccounts || []);
    return {
      id: existing?.id || crypto.randomUUID(),
      name: name || `Bucket ${index + 1}`,
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
  }).filter((bucket) => bucket.percent > 0);

  if (!buckets.length) {
    showToast("Keep at least one bucket above 0%");
    return;
  }

  const totalPercent = buckets.reduce((sum, bucket) => sum + bucket.percent, 0);
  if (Math.abs(totalPercent - 100) > 0.01) {
    const shouldReallocate = window.confirm(`Your active buckets add up to ${Number(totalPercent.toFixed(1))}%. Reallocate the remaining Virtual Bucket Accounts to 100% and skip blank or 0% rows?`);
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
    pendingIncrease: wallet.allocation?.pendingIncrease || 0,
    pendingSpend: wallet.allocation?.pendingSpend || 0,
    lastValue: walletValue,
    updatedAt: new Date().toISOString(),
  };
  saveWallets();
  render();
  walletDialog.close();
  showToast("Allocation saved");
}

function openSpendDialog(walletId, bucketId, usePending = false) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet?.allocation?.buckets?.length) return;
  const pendingSpend = Number(wallet.allocation.pendingSpend || 0);
  const placeholder = usePending && !bucketId
    ? `<option value="" selected>Choose bucket or action</option>`
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
      ${usePending ? `<p class="wallet-note">Assign detected spending of ${formatUsd(pendingSpend)} to a bucket. If this was a cashout or large transfer on purpose, choose Personal liquidation from the dropdown.</p>` : ""}
      <div class="send-grid">
        <label>
          ${usePending ? "Bucket or action" : "Bucket"}
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
          Protected bucket warning
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

function openBucketDetailDialog(walletId, bucketId) {
  const wallet = wallets.find((item) => item.id === walletId);
  const bucket = wallet?.allocation?.buckets?.find((item) => item.id === bucketId);
  if (!wallet || !bucket) return;

  const allocated = Number(bucket.allocated || 0);
  const spent = Number(bucket.spent || 0);
  const left = Math.max(allocated - spent, 0);
  const usedPercent = allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0;
  const rules = bucket.rules || {};
  const transactions = (wallet.allocation?.transactions || [])
    .filter((tx) => tx.bucketId === bucket.id || tx.bucketName?.includes(bucket.name))
    .slice(0, 8);
  const rulesText = [
    Number(rules.minimum || 0) > 0 ? `Minimum ${formatUsd(rules.minimum)}` : "",
    Number(rules.warning || 0) > 0 ? `Warning ${formatUsd(rules.warning)}` : "",
    Number(rules.refill || 0) > 0 ? `Refill ${formatUsd(rules.refill)}` : "",
    rules.reset && rules.reset !== "never" ? `Reset ${rules.reset}` : "",
    rules.protected ? "Protected" : "",
  ].filter(Boolean);
  const billSubaccounts = normalizeSubaccounts(bucket.subaccounts || []);
  const monthlyBillTotal = getMonthlyBillTotal(bucket);

  openDialog(`
    <div class="dialog-content">
      <h2>${escapeHtml(bucket.name)}</h2>
      <p class="wallet-note">${escapeHtml(wallet.name)} Â· Virtual Bucket Account</p>
      <div class="stats-grid">
        <div class="stat-tile"><span>Available</span><strong>${formatUsd(left)}</strong></div>
        <div class="stat-tile"><span>Allocated</span><strong>${formatUsd(allocated)}</strong></div>
        <div class="stat-tile"><span>Spent</span><strong>${formatUsd(spent)}</strong></div>
        <div class="stat-tile"><span>Used</span><strong>${usedPercent.toFixed(0)}%</strong></div>
      </div>
      <div class="account-progress"><span style="width:${usedPercent}%"></span></div>
      ${isBillsBucket(bucket) ? `
        <div class="report-section">
          <h3>Bills</h3>
          <div class="stats-grid">
            <div class="stat-tile"><span>Monthly bill goal</span><strong>${formatUsd(monthlyBillTotal)}</strong></div>
            <div class="stat-tile"><span>Weekly target</span><strong>${formatUsd(monthlyBillTotal / 4)}</strong></div>
          </div>
          ${billSubaccounts.length ? `
            <div class="subaccount-list">
              ${billSubaccounts.map((bill) => `
                <div class="subaccount-pill">
                  <span><strong>${escapeHtml(bill.name)}</strong><small>${escapeHtml(getBillDueText(bill))}</small></span>
                  <strong>${formatUsd(bill.required)}</strong>
                </div>
              `).join("")}
            </div>
          ` : `<p class="wallet-note">No bills added yet.</p>`}
        </div>
      ` : ""}
      <div class="report-section">
        <h3>Rules</h3>
        ${rulesText.length ? `<div class="rule-list">${rulesText.map((rule) => `<span class="rule-pill">${escapeHtml(rule)}</span>`).join("")}</div>` : `<p class="wallet-note">No custom rules yet.</p>`}
      </div>
      <div class="report-section">
        <h3>Recent activity</h3>
        ${transactions.length ? `
          <div class="transaction-log">
            ${transactions.map((tx) => `
              <div class="log-row">
                <div class="log-topline">
                  <strong>${escapeHtml(tx.note || tx.type || "Activity")}</strong>
                  <span class="status-pill">${formatUsd(Number(tx.amount || 0))}</span>
                </div>
                <span class="log-meta">${new Date(tx.createdAt).toLocaleString()}</span>
              </div>
            `).join("")}
          </div>
        ` : `<p class="wallet-note">No activity recorded for this account yet.</p>`}
      </div>
      <div class="dialog-actions">
        <button class="primary-button detail-spend" type="button">Record Spend</button>
        <button class="secondary-button detail-move" type="button">Move Money</button>
        <button class="secondary-button detail-rules" type="button">Rules</button>
        ${isBillsBucket(bucket) ? `<button class="secondary-button detail-bills" type="button">Edit Bills</button>` : ""}
        ${isSendCapableWallet(wallet) ? `<button class="secondary-button detail-send" type="button">Send from Bucket</button>` : ""}
      </div>
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
      <h2>Edit Account</h2>
      <p class="wallet-note">${escapeHtml(wallet.name)} Â· Virtual Bucket Account</p>
      <div class="send-grid">
        <label>
          Account name
          <input id="editBucketName" maxlength="40" value="${escapeHtml(bucket.name)}" />
        </label>
        <label>
          Allocation percent
          <input id="editBucketPercent" type="number" min="0" max="100" step="1" value="${Number(bucket.percent || 0)}" />
        </label>
      </div>
      <div class="dialog-actions">
        <button class="primary-button" id="saveBucketEdit" type="button">Save changes</button>
      </div>
    </div>
  `);

  dialogContent.querySelector("#saveBucketEdit").addEventListener("click", () => {
    const name = dialogContent.querySelector("#editBucketName").value.trim();
    const percent = Number(dialogContent.querySelector("#editBucketPercent").value || 0);
    if (!name) {
      showToast("Add an account name");
      return;
    }
    bucket.name = name;
    bucket.percent = percent;
    saveWallets();
    render();
    walletDialog.close();
    showToast("Account updated");
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
  showToast("Bucket rules saved");
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
    showToast("Choose a bucket or Personal liquidation");
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
    ? "This will set every Virtual Bucket Account for this wallet to $0 and keep your template for next time. Continue?"
    : `This will rebalance this wallet's Virtual Bucket Accounts to the current wallet balance of ${formatUsd(currentValue)} using your saved template. Continue?`;

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
  showToast(currentValue <= 0.01 ? "Wallet buckets reset to $0" : "Wallet buckets rebalanced");
}

function refreshVirtualAccounts(walletId) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet?.allocation?.buckets?.length) {
    showToast("Create Virtual Bucket Accounts first");
    return;
  }

  rebalanceWalletBucketsToCurrentBalance(wallet);
  saveWallets();
  render();
  showToast(`VBAs refreshed to ${formatUsd(getWalletDisplayValue(wallet))}`);
}

function refreshAllVirtualAccounts() {
  const targetWallets = wallets.filter((wallet) => wallet.allocation?.buckets?.length);
  if (!targetWallets.length) {
    showToast("Create Virtual Bucket Accounts first");
    return;
  }

  targetWallets.forEach((wallet) => rebalanceWalletBucketsToCurrentBalance(wallet));
  saveWallets();
  render();
  showToast("All VBAs refreshed to current wallet balances");
}

function allocatePendingFunds(walletId) {
  const wallet = wallets.find((item) => item.id === walletId);
  if (!wallet?.allocation?.buckets?.length) return;
  const assignable = getWalletAssignableAmount(wallet);
  const pendingIncrease = Number(wallet.allocation.pendingIncrease || 0);
  let remaining = pendingIncrease > 0.01 ? Math.min(pendingIncrease, assignable) : assignable;
  if (remaining <= 0.01) {
    wallet.allocation.pendingIncrease = 0;
    wallet.allocation.lastValue = getWalletDisplayValue(wallet);
    wallet.allocation.updatedAt = new Date().toISOString();
    saveWallets();
    render();
    showToast("Wallet is already balanced");
    return;
  }

  const fundedThisRound = [];
  wallet.allocation.buckets.forEach((bucket) => {
    const target = getBucketFundingTarget(bucket);
    if (target <= 0) return;
    const needed = Math.max(target - getBucketBalance(bucket), 0);
    if (needed <= 0.01 || remaining <= 0.01) return;
    const amount = Math.min(needed, remaining);
    bucket.allocated = Number(bucket.allocated || 0) + amount;
    remaining -= amount;
    fundedThisRound.push(`${bucket.name} ${formatUsd(amount)}`);
  });

  const targetBuckets = wallet.allocation.buckets;
  const rawWeightTotal = targetBuckets.reduce((sum, bucket) => sum + getNewFundsAllocationWeight(bucket), 0);
  const bucketWeights = targetBuckets.map((bucket) => rawWeightTotal > 0 ? getNewFundsAllocationWeight(bucket) : 1);
  const weightTotal = bucketWeights.reduce((sum, weight) => sum + weight, 0) || 1;
  const flexibleAmount = remaining;
  let distributed = 0;
  targetBuckets.forEach((bucket, index) => {
    if (flexibleAmount <= 0.01) return;
    const amount = index === targetBuckets.length - 1
      ? Math.max(flexibleAmount - distributed, 0)
      : flexibleAmount * (bucketWeights[index] / weightTotal);
    bucket.allocated = Number(bucket.allocated || 0) + amount;
    distributed += amount;
  });

  wallet.allocation.pendingIncrease = 0;
  wallet.allocation.lastValue = getWalletDisplayValue(wallet);
  wallet.allocation.updatedAt = new Date().toISOString();
  saveWallets();
  render();
  showToast(fundedThisRound.length ? "New funds allocated after filling targets" : "New funds allocated to flexible accounts");
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
  showToast(refillAmount > 0 ? `Reset and refilled ${formatUsd(refillAmount)}` : "Bucket reset applied");
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

function getWalletAvailability() {
  return {
    phantom: Boolean(findInjectedSolanaProvider()),
    metamask: Boolean(getNamedEthereumProvider("metamask")),
    coinbase: Boolean(getNamedEthereumProvider("coinbase")),
    trust: Boolean(getNamedEthereumProvider("trust")),
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
  const accounts = await injected.request({ method: "eth_requestAccounts" });
  connectedProvider = injected;
  connectedAccount = accounts?.[0] || "";
  connectedWalletLabel = labelForEthereumProvider(injected, walletType === "auto" ? "Browser Wallet" : walletType);
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
      description: "Non-custodial Virtual Bucket Accounts for stablecoin budgeting.",
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

function findInjectedSolanaProvider() {
  return window.phantom?.solana
    || window.solana
    || window.trustwallet?.solana
    || window.solflare
    || null;
}

function getSolanaProviderLabel(provider) {
  if (!provider) return "Solana Wallet";
  if (provider === window.phantom?.solana || provider.isPhantom) return "Phantom";
  if (provider === window.trustwallet?.solana || provider.isTrust || provider.isTrustWallet) return "Trust Wallet";
  if (provider === window.solflare || provider.isSolflare) return "Solflare";
  return "Solana Wallet";
}

async function connectInjectedSolanaProvider() {
  if (connectedSolanaProvider && connectedSolanaProvider === findInjectedSolanaProvider()) {
    connectedSolanaAccount = connectedSolanaAccount || connectedSolanaProvider.publicKey?.toString?.() || "";
    updateWalletConnectionUi();
    return connectedSolanaProvider;
  }

  const injected = findInjectedSolanaProvider();
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
      description: "Non-custodial Virtual Bucket Accounts for stablecoin budgeting.",
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
  const injected = await connectInjectedSolanaProvider();
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
      throw new Error("Connected Solana wallet does not match this bucket address");
    }

    setSendStatus("Preparing token accounts and transfer...", "loading");
    const rpcEndpoint = getSolanaRpcEndpoints(network)[0];
    const proxyEndpoint = canUseLocalSolanaProxy()
      ? `${window.location.origin}/api/solana-rpc?endpoint=${encodeURIComponent(rpcEndpoint)}`
      : "";
    const connectionEndpoints = proxyEndpoint ? [proxyEndpoint, rpcEndpoint] : [rpcEndpoint];
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
    wallet.status = "Sent";
    wallet.statusType = "live";
    wallet.error = `Transaction submitted: ${signature}`;
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
    setSendStatus("Checking recipient and connecting wallet...", "loading");
    if (!isEvmAddress(recipient)) throw new Error("Enter a valid 0x recipient address");
    const provider = await getEthereumProvider();
    setSendStatus(`Opening ${connectedWalletLabel || "wallet"} approval...`, "loading");
    const accounts = await provider.request({ method: "eth_requestAccounts" });
    const from = accounts[0];
    if (!from || from.toLowerCase() !== wallet.address.toLowerCase()) {
      throw new Error("Connected wallet does not match this bucket address");
    }

    const chainId = EVM_CHAINS[wallet.network];
    if (chainId) {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
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

    const txHash = await provider.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });
    setSendStatus("Transaction submitted. Recording bucket spend...", "loading");

    rememberRecipient(recipient, recipientName, wallet.network, bucketId);
    recordBucketSend(wallet, bucketId, Number(amount), txHash, recipient);
    wallet.status = "Sent";
    wallet.statusType = "live";
    wallet.error = `Transaction submitted: ${txHash}`;
    saveWallets();
    render();
    walletDialog.close();
    showToast("Transaction submitted");
  } catch (error) {
    const message = error?.message || "Transaction was not sent";
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
  if (!bucketId || !wallet.allocation?.buckets?.length) return;
  const network = NETWORKS[wallet.network];
  const bucket = wallet.allocation.buckets.find((item) => item.id === bucketId);
  if (!bucket) return;

  const spendValue = ["evm-usdc", "evm-stablecoin", "solana-token"].includes(network.kind)
    ? amount
    : amount * (priceCache[network.priceId] || 0);
  bucket.spent = Number(bucket.spent || 0) + spendValue;
  if (["evm-usdc", "evm-stablecoin", "solana-token"].includes(network.kind)) {
    wallet.balance = Math.max(Number(wallet.balance || 0) - amount, 0);
  }
  wallet.allocation.transactions = wallet.allocation.transactions || [];
  wallet.allocation.transactions.unshift({
    id: crypto.randomUUID(),
    type: "wallet-send",
    bucketId,
    bucketName: bucket.name,
    amount: spendValue,
    assetAmount: amount,
    asset: network.asset,
    recipient,
    txHash,
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
  saveWallets();
  render();
  showToast("Wallet removed");
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
  const customRpc = loadSolanaRpcUrl();
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
  const previousValue = getWalletDisplayValue(wallet);

  wallet.status = "Refreshing";
  wallet.statusType = "loading";
  wallet.error = "";
  saveWallets();
  render();

  const network = NETWORKS[wallet.network];
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
    trackAllocationDelta(wallet, previousValue);
    const overbalance = getWalletOverbalanceAmount(wallet);
    if (overbalance > 0.01) {
      wallet.status = "Needs VBA refresh";
      wallet.error = `Virtual Bucket Accounts are ${formatUsd(overbalance)} above this wallet. Tap Refresh VBAs to match the current balance.`;
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
  if (!wallet.allocation?.buckets?.length) return;
  const currentValue = getWalletDisplayValue(wallet);
  const prior = Number(wallet.allocation.lastValue ?? previousValue ?? currentValue);
  const delta = currentValue - prior;

  if (delta > 0.01) {
    wallet.allocation.pendingIncrease = Number(wallet.allocation.pendingIncrease || 0) + delta;
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
  const supportedNetworks = Object.entries(NETWORKS).filter(([, network]) => {
    if (baseNetwork.kind.startsWith("solana")) return network.kind.startsWith("solana");
    return ["evm-usdc", "evm-stablecoin", "evm-native"].includes(network.kind);
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
  wallet.status = "Scanning";
  wallet.statusType = "loading";
  wallet.error = "";
  saveWallets();
  render();

  try {
    const diagnostics = await fetchSolanaTokenDiagnostics(wallet);
    if (diagnostics.pyusdBalance > 0) {
      wallet.balance = diagnostics.pyusdBalance;
      wallet.status = "Found";
      wallet.statusType = "live";
      wallet.error = `Found ${formatUsd(diagnostics.pyusdBalance)} PYUSD on Solana`;
    } else if (diagnostics.tokens.length) {
      const found = diagnostics.tokens
        .slice(0, 4)
        .map((token) => `${token.asset}: ${token.amount}`)
        .join(", ");
      wallet.status = "No PYUSD";
      wallet.statusType = "error";
      wallet.error = `Solana address works, but no PYUSD was found. Other tokens found: ${found}`;
    } else if (diagnostics.directTokenAccount) {
      wallet.status = "Token account";
      wallet.statusType = diagnostics.directTokenAccount.mint === NETWORKS.solanaPyusd.mint ? "live" : "error";
      wallet.balance = diagnostics.directTokenAccount.mint === NETWORKS.solanaPyusd.mint ? diagnostics.directTokenAccount.amount : wallet.balance;
      wallet.error = diagnostics.directTokenAccount.mint === NETWORKS.solanaPyusd.mint
        ? `Found ${formatUsd(diagnostics.directTokenAccount.amount)} PYUSD in this token account`
        : `This is a ${diagnostics.directTokenAccount.asset} token account, not a PYUSD wallet owner address`;
    } else {
      wallet.status = "No tokens";
      wallet.statusType = "error";
      wallet.error = diagnostics.errors.length
        ? `Could not find Solana PYUSD. ${diagnostics.errors[0]}`
        : "Address is valid, but no Solana token accounts were found.";
    }
    wallet.updatedAt = new Date().toISOString();
    saveWallets();
    render();
    showToast(wallet.statusType === "live" ? "Solana PYUSD found" : "Solana scan complete");
  } catch (error) {
    wallet.status = "Needs check";
    wallet.statusType = "error";
    wallet.error = error?.message || "Could not scan Solana assets";
    saveWallets();
    render();
    showToast("Could not scan Solana assets");
  }
}

async function refreshAll() {
  if (!wallets.length) {
    showToast("Add a wallet first");
    return;
  }

  refreshAllButton.disabled = true;
  refreshAllButton.textContent = "Refreshing...";
  for (const wallet of wallets) {
    await refreshWallet(wallet.id);
  }
  refreshAllButton.disabled = false;
  refreshAllButton.textContent = "Refresh balances";
  showToast("Refresh complete");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const address = cleanAddress(String(data.get("address")));
  const network = String(data.get("network"));

  if (!isValidAddressForNetwork(address, network)) {
    const selectedNetwork = NETWORKS[network];
    const message = selectedNetwork.kind === "bitcoin"
      ? "Enter a valid Bitcoin address"
      : selectedNetwork.kind.startsWith("solana")
        ? "Enter a valid Solana address"
        : "Enter a valid EVM address starting with 0x";
    showToast(message);
    return;
  }

  const duplicate = wallets.some((wallet) => wallet.network === network && wallet.address.toLowerCase() === address.toLowerCase());
  if (duplicate) {
    showToast("That wallet is already saved for this network");
    return;
  }

  const wallet = {
    id: crypto.randomUUID(),
    name: String(data.get("walletName")).trim() || `${NETWORKS[network].label} ${shortAddress(address)}`,
    network,
    address,
    budget: Number(data.get("budget")) || 0,
    manualBalance: Number(data.get("manualBalance")) || 0,
    balance: Number(data.get("manualBalance")) || 0,
    note: String(data.get("note")).trim(),
    status: "Saved",
    statusType: "",
    createdAt: new Date().toISOString(),
  };

  wallets.unshift(wallet);
  selectedWalletId = wallet.id;
  saveWallets();
  form.reset();
  networkSelect.value = "bitcoin";
  form.classList.remove("open");
  render();
  showToast("Wallet bucket added");
  refreshWallet(wallet.id);
});

refreshAllButton.addEventListener("click", refreshAll);
filterNetwork.addEventListener("change", render);
connectWalletButton?.addEventListener("click", async () => {
  try {
    await openWalletConnectDialog();
  } catch (error) {
    showToast(error?.message || "Wallet connection did not finish");
  }
});
saveWalletConnectProjectButton?.addEventListener("click", saveWalletConnectProjectId);
saveSolanaRpcUrlButton?.addEventListener("click", saveSolanaRpcUrl);

seedExamplesButton.addEventListener("click", () => {
  const examples = [
    {
      name: "Food Account",
      network: "base",
      address: "0x1111111111111111111111111111111111111111",
      budget: 350,
      manualBalance: 124.5,
      note: "Groceries and quick meals",
    },
    {
      name: "Gas Account",
      network: "polygon",
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
  showToast("Example buckets added");
});

function loadDemoMode() {
  if (!window.confirm("Load demo data? This will replace current local AllocaFi data.")) return;
  const now = new Date().toISOString();
  wallets = [{
    id: crypto.randomUUID(),
    name: "Main USDC Wallet",
    network: "base",
    address: "0x1111111111111111111111111111111111111111",
    budget: 0,
    manualBalance: 2000,
    balance: 2000,
    note: "Demo stablecoin wallet",
    status: "Demo",
    statusType: "live",
    createdAt: now,
    allocation: {
      cycle: "weekly",
      pendingIncrease: 0,
      pendingSpend: 45,
      lastValue: 2000,
      updatedAt: now,
      buckets: [
        { id: crypto.randomUUID(), name: "Bills", percent: 40, allocated: 800, spent: 100, rules: { minimum: 700, warning: 725, refill: 800, reset: "monthly", protected: true } },
        { id: crypto.randomUUID(), name: "Food", percent: 18, allocated: 360, spent: 92.5, rules: { minimum: 75, warning: 100, refill: 250, reset: "weekly", protected: false } },
        { id: crypto.randomUUID(), name: "Gas", percent: 10, allocated: 200, spent: 40, rules: { minimum: 40, warning: 55, refill: 120, reset: "weekly", protected: false } },
        { id: crypto.randomUUID(), name: "Savings", percent: 22, allocated: 440, spent: 0, rules: { minimum: 400, warning: 420, refill: 500, reset: "never", protected: true } },
        { id: crypto.randomUUID(), name: "Personal", percent: 10, allocated: 200, spent: 35, rules: { minimum: 25, warning: 40, refill: 100, reset: "weekly", protected: false } },
      ],
      transactions: [
        { id: crypto.randomUUID(), bucketName: "Food", amount: 42.5, note: "Groceries", createdAt: now },
        { id: crypto.randomUUID(), bucketName: "Gas", amount: 40, note: "Fuel", createdAt: now },
        { id: crypto.randomUUID(), bucketName: "Bills", amount: 100, note: "Utilities", createdAt: now },
      ],
    },
  }];
  goals = [
    { id: crypto.randomUUID(), name: "Emergency Fund", current: 1200, target: 3000, createdAt: now },
    { id: crypto.randomUUID(), name: "Vacation", current: 450, target: 1500, createdAt: now },
  ];
  addressBook = [
    { id: crypto.randomUUID(), name: "Rent Wallet", address: "0x2222222222222222222222222222222222222222", network: "base", bucketName: "Bills", updatedAt: now },
    { id: crypto.randomUUID(), name: "Gas Card", address: "0x3333333333333333333333333333333333333333", network: "base", bucketName: "Gas", updatedAt: now },
  ];
  financeData = createDefaultFinanceData();
  const itemId = crypto.randomUUID();
  const accountId = crypto.randomUUID();
  financeData.plan = "Plus";
  financeData.bankItems = [{ id: itemId, institution: "Demo Credit Union", status: "Healthy", plaidMode: "sandbox-local", createdAt: now, lastSyncedAt: now }];
  financeData.bankAccounts = [{ id: accountId, itemId, name: "Main Checking", type: "checking", balance: 1850, availableBalance: 1850, status: "Healthy", lastSyncedAt: now }];
  financeData.bankTransactions = [
    { id: crypto.randomUUID(), accountId, itemId, merchantLabel: "Payroll Deposit", amount: 1200, category: "Income", bucketName: "Available Cashflow", pending: false, date: now.slice(0, 10), notes: "Demo income", createdAt: now },
    { id: crypto.randomUUID(), accountId, itemId, merchantLabel: "Walmart Grocery", amount: -86.42, category: "Food", bucketName: "Food", pending: false, date: now.slice(0, 10), notes: "Demo spending", createdAt: now },
    { id: crypto.randomUUID(), accountId, itemId, merchantLabel: "Electric Utility", amount: -118.22, category: "Bills", bucketName: "Bills", pending: false, date: now.slice(0, 10), notes: "Demo bill", createdAt: now },
  ];
  financeData.familyGroups = [{
    id: crypto.randomUUID(),
    name: "Demo Family",
    createdAt: now,
    members: [{ id: crypto.randomUUID(), name: "You", role: "Owner", privacy: "full account balance", joinedAt: now }],
    buckets: FAMILY_DEFAULT_BUCKETS.map((name) => ({ id: crypto.randomUUID(), name, allocated: name.includes("Rent") ? 1200 : 150, spent: 0 })),
    goals: [{ id: crypto.randomUUID(), name: "Family Emergency Fund", current: 500, target: 3000 }],
    activity: [],
  }];
  financeData.businessProfiles = [{
    id: crypto.randomUUID(),
    name: "Demo Business",
    createdAt: now,
    members: [{ id: crypto.randomUUID(), name: "You", role: "Owner", joinedAt: now }],
    buckets: BUSINESS_DEFAULT_BUCKETS.map((name) => ({ id: crypto.randomUUID(), name, allocated: name === "Taxes" ? 500 : 150, spent: 0 })),
    vendors: [{ id: crypto.randomUUID(), name: "Fuel Vendor", monthlySpend: 240 }],
    reports: [],
  }];
  saveWallets();
  saveGoals();
  saveAddressBook();
  saveFinanceData();
  render();
  switchTab("overview");
  showToast("Demo dashboard loaded");
}

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
    "asset_amount",
    "recipient",
    "tx_hash",
    "note",
  ]];
  getAllTransactions().forEach((tx) => {
    rows.push([
      tx.createdAt,
      tx.walletName,
      tx.walletAddress,
      tx.network,
      tx.asset,
      tx.bucketName,
      tx.amount,
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

function getAutoVaultPassword() {
  return autoVaultSessionPassword;
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
      solanaRpcConfigured: Boolean(loadSolanaRpcUrl()),
      walletConnectConfigured: Boolean(loadWalletConnectProjectId()),
      lastVaultBackup: localStorage.getItem(VAULT_LAST_BACKUP_KEY) || "",
    },
    vaultActivity: loadVaultActivity(),
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
    ["Virtual Bucket Accounts", byteSize(bucketData)],
    ["Bill planner", byteSize(billData)],
    ["Transactions", byteSize(transactions)],
    ["Goals", byteSize(data.goals)],
    ["Address book", byteSize(data.addressBook)],
    ["Settings", byteSize(data.settings)],
    ["Vault activity", byteSize(data.vaultActivity)],
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
  saveWallets();
  saveGoals();
  saveAddressBook();
  saveFinanceData();
  render();
  showToast("Local data reset");
}

setupWizardButton.addEventListener("click", openSetupWizard);
assignMoneyButton.addEventListener("click", openAssignMoneyDialog);
assignMoneyAccountsButton?.addEventListener("click", openAssignMoneyDialog);
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
monthlyReportButton.addEventListener("click", openMonthlyReport);
exportCsvButton.addEventListener("click", exportTransactionsCsv);
backupButton.addEventListener("click", exportFullBackup);
resetButton.addEventListener("click", resetAllLocalData);
demoModeButton.addEventListener("click", loadDemoMode);

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
networkSelect.value = "bitcoin";
render();
hydrateClientConfig();
refreshCloudProviderStatus();
refreshPrices();

