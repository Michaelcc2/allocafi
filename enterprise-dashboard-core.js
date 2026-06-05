export const ENTERPRISE_TIME_FILTERS = ["This Month", "30D", "90D", "1Y"];

export const ENTERPRISE_ROLES = [
  "Owner",
  "Admin",
  "Finance Manager",
  "Accountant",
  "Employee",
  "Viewer",
];

export const ENTERPRISE_ROLE_PERMISSIONS = {
  Owner: {
    manageBuckets: true,
    approvePayments: true,
    viewReports: true,
    exportReports: true,
    requestPayments: true,
    manageTeam: true,
    readOnly: false,
  },
  Admin: {
    manageBuckets: true,
    approvePayments: true,
    viewReports: true,
    exportReports: true,
    requestPayments: true,
    manageTeam: true,
    readOnly: false,
  },
  "Finance Manager": {
    manageBuckets: false,
    approvePayments: true,
    viewReports: true,
    exportReports: true,
    requestPayments: true,
    manageTeam: false,
    readOnly: false,
  },
  Accountant: {
    manageBuckets: false,
    approvePayments: false,
    viewReports: true,
    exportReports: true,
    requestPayments: false,
    manageTeam: false,
    readOnly: false,
  },
  Employee: {
    manageBuckets: false,
    approvePayments: false,
    viewReports: false,
    exportReports: false,
    requestPayments: true,
    manageTeam: false,
    readOnly: false,
  },
  Viewer: {
    manageBuckets: false,
    approvePayments: false,
    viewReports: true,
    exportReports: false,
    requestPayments: false,
    manageTeam: false,
    readOnly: true,
  },
};

export const ENTERPRISE_MOCK_DATA = {
  businessProfile: {
    id: "biz_atlas_innovations",
    name: "Atlas Innovations Inc.",
    verified: true,
    accountLabel: "Enterprise Account",
    plan: "Enterprise",
    activeRole: "Owner",
    ownerName: "Atlas Team",
    ownerInitials: "AT",
    custodyModel: "non-custodial",
  },
  team: [
    { id: "team-owner", name: "Atlas Team", role: "Owner", status: "Active" },
    { id: "team-admin", name: "Mira Chen", role: "Admin", status: "Active" },
    { id: "team-finance", name: "Jordan Lee", role: "Finance Manager", status: "Active" },
    { id: "team-accountant", name: "Priya Shah", role: "Accountant", status: "Active" },
    { id: "team-employee", name: "Operations Desk", role: "Employee", status: "Limited" },
    { id: "team-viewer", name: "Board Viewer", role: "Viewer", status: "Read-only" },
  ],
  stablecoinBalances: [
    { asset: "USDC", balance: 12250000, network: "Solana", color: "#35a7ff" },
    { asset: "USDT", balance: 8450000, network: "Ethereum", color: "#2ee6a6" },
    { asset: "DAI", balance: 2130671.25, network: "Base", color: "#f7b84b" },
    { asset: "PYUSD", balance: 2000000, network: "Solana", color: "#6c5cff" },
  ],
  bucketAccounts: [
    {
      id: "operating",
      name: "Operating Expenses",
      balance: 5750000,
      asset: "USDC",
      budgetPeriod: "Monthly",
      budgetAmount: 6500000,
      actualSpend: 6250000,
      status: "On Track",
      accent: "green",
      category: "Operations",
    },
    {
      id: "payroll",
      name: "Payroll",
      balance: 4200000,
      asset: "USDC",
      budgetPeriod: "Monthly",
      budgetAmount: 4500000,
      actualSpend: 4200000,
      status: "On Track",
      accent: "cyan",
      category: "People",
    },
    {
      id: "taxes",
      name: "Taxes",
      balance: 2850000,
      asset: "USDC",
      budgetPeriod: "Yearly",
      budgetAmount: 3200000,
      actualSpend: 2710000,
      status: "Watch",
      accent: "purple",
      category: "Compliance",
    },
    {
      id: "marketing",
      name: "Marketing",
      balance: 1750000,
      asset: "USDC",
      budgetPeriod: "Monthly",
      budgetAmount: 2000000,
      actualSpend: 1760000,
      status: "On Track",
      accent: "gold",
      category: "Growth",
    },
    {
      id: "capex",
      name: "CapEx / Investments",
      balance: 4850000,
      asset: "USDC",
      budgetPeriod: "Quarterly",
      budgetAmount: 5600000,
      actualSpend: 1290000,
      status: "On Track",
      accent: "blue",
      category: "Investments",
    },
    {
      id: "reserve",
      name: "Reserve / Treasury",
      balance: 3180671.25,
      asset: "PYUSD",
      budgetPeriod: "Target",
      budgetAmount: 3800000,
      actualSpend: 120000,
      status: "Healthy",
      accent: "green",
      category: "Treasury",
    },
    {
      id: "vendors",
      name: "Vendor Payments",
      balance: 820000,
      asset: "USDT",
      budgetPeriod: "Monthly",
      budgetAmount: 1100000,
      actualSpend: 960000,
      status: "Watch",
      accent: "cyan",
      category: "Vendors",
    },
    {
      id: "insurance",
      name: "Insurance",
      balance: 420000,
      asset: "DAI",
      budgetPeriod: "Quarterly",
      budgetAmount: 480000,
      actualSpend: 410000,
      status: "On Track",
      accent: "green",
      category: "Risk",
    },
    {
      id: "legal",
      name: "Legal / Compliance",
      balance: 300000,
      asset: "DAI",
      budgetPeriod: "Quarterly",
      budgetAmount: 420000,
      actualSpend: 432000,
      status: "Over Budget",
      accent: "purple",
      category: "Compliance",
    },
    {
      id: "software",
      name: "Software / SaaS",
      balance: 280000,
      asset: "USDT",
      budgetPeriod: "Monthly",
      budgetAmount: 320000,
      actualSpend: 284500,
      status: "On Track",
      accent: "blue",
      category: "Tools",
    },
    {
      id: "travel",
      name: "Travel",
      balance: 190000,
      asset: "USDC",
      budgetPeriod: "Monthly",
      budgetAmount: 280000,
      actualSpend: 245000,
      status: "Watch",
      accent: "gold",
      category: "Operations",
    },
    {
      id: "emergency",
      name: "Emergency Fund",
      balance: 240000,
      asset: "PYUSD",
      budgetPeriod: "Target",
      budgetAmount: 300000,
      actualSpend: 0,
      status: "Healthy",
      accent: "green",
      category: "Treasury",
    },
  ],
  transactions: [
    {
      id: "tx-acme",
      type: "Vendor payment",
      description: "Payment to Acme Solutions",
      amount: -250000,
      asset: "USDC",
      timestamp: "2026-05-24T10:24:00-05:00",
      status: "Completed",
      bucket: "Vendor Payments",
    },
    {
      id: "tx-payroll",
      type: "Payroll",
      description: "Payroll - May 2026",
      amount: -1200000,
      asset: "USDC",
      timestamp: "2026-05-24T09:00:00-05:00",
      status: "Completed",
      bucket: "Payroll",
    },
    {
      id: "tx-invoice",
      type: "Invoice payment",
      description: "Invoice from Globex Corp",
      amount: 850000,
      asset: "USDC",
      timestamp: "2026-05-23T16:15:00-05:00",
      status: "Completed",
      bucket: "Operating Expenses",
    },
    {
      id: "tx-marketing",
      type: "Vendor payment",
      description: "Payment to Marketing Agency",
      amount: -125000,
      asset: "USDC",
      timestamp: "2026-05-23T11:30:00-05:00",
      status: "Completed",
      bucket: "Marketing",
    },
    {
      id: "tx-saas",
      type: "SaaS subscription",
      description: "Subscription - SaaS Tools",
      amount: -8450,
      asset: "USDC",
      timestamp: "2026-05-22T14:45:00-05:00",
      status: "Completed",
      bucket: "Software / SaaS",
    },
    {
      id: "tx-stablecoin",
      type: "Stablecoin received",
      description: "Client stablecoin settlement",
      amount: 4200000,
      asset: "USDT",
      timestamp: "2026-05-21T15:10:00-05:00",
      status: "Completed",
      bucket: "Reserve / Treasury",
    },
    {
      id: "tx-transfer",
      type: "Bucket transfer",
      description: "Transfer from Treasury to Taxes",
      amount: 375000,
      asset: "PYUSD",
      timestamp: "2026-05-21T12:20:00-05:00",
      status: "Pending",
      bucket: "Taxes",
    },
    {
      id: "tx-failed",
      type: "Vendor payment",
      description: "Cross-border vendor attempt",
      amount: -56000,
      asset: "DAI",
      timestamp: "2026-05-20T08:05:00-05:00",
      status: "Failed",
      bucket: "Legal / Compliance",
    },
  ],
  cashFlowHistory: [
    { label: "Mar 8", date: "2026-03-08", inflows: 2100000, outflows: 2450000 },
    { label: "Mar 15", date: "2026-03-15", inflows: 1700000, outflows: 2600000 },
    { label: "Mar 22", date: "2026-03-22", inflows: 2800000, outflows: 2100000 },
    { label: "Mar 29", date: "2026-03-29", inflows: 1950000, outflows: 2200000 },
    { label: "Apr 5", date: "2026-04-05", inflows: 2600000, outflows: 2050000 },
    { label: "Apr 12", date: "2026-04-12", inflows: 3400000, outflows: 2550000 },
    { label: "Apr 19", date: "2026-04-19", inflows: 2350000, outflows: 2480000 },
    { label: "Apr 26", date: "2026-04-26", inflows: 3150000, outflows: 2300000 },
    { label: "May 1", date: "2026-05-01", inflows: 2100000, outflows: 1650000 },
    { label: "May 8", date: "2026-05-08", inflows: 3200000, outflows: 1923000 },
    { label: "May 15", date: "2026-05-15", inflows: 1850000, outflows: 2050000 },
    { label: "May 22", date: "2026-05-22", inflows: 4500000, outflows: 2800000 },
    { label: "May 26", date: "2026-05-26", inflows: 4000000, outflows: 1400000 },
  ],
  budgetVsActual: [
    { category: "Operating Expenses", budget: 7000000, actual: 6250000, color: "#2ee6a6" },
    { category: "Payroll", budget: 4500000, actual: 4200000, color: "#27d7ff" },
    { category: "Marketing", budget: 2000000, actual: 1760000, color: "#ffb545" },
    { category: "CapEx / Investments", budget: 1500000, actual: 1290000, color: "#4c7dff" },
    { category: "Other", budget: 600000, actual: 450000, color: "#6f5cff" },
  ],
  trustSignals: [
    {
      title: "Enterprise Grade Security",
      detail: "Bank-level encryption and custody-free design",
    },
    {
      title: "Real-time Global Settlement",
      detail: "24/7, instant, borderless stablecoin visibility",
    },
    {
      title: "Compliant & Audit Ready",
      detail: "SOC 2, GDPR, AML export foundation",
    },
    {
      title: "99.99% Uptime",
      detail: "Built for mission-critical treasury ops",
    },
    {
      title: "Non-custodial Wallet Logic",
      detail: "No private keys stored. Wallet-approved transactions only.",
    },
  ],
};

function roundCurrency(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(Number(value) || 0, min), max);
}

function sumBy(items, selector) {
  return roundCurrency((items || []).reduce((sum, item) => sum + Number(selector(item) || 0), 0));
}

function getCashFlowPointsForRange(data, range) {
  const history = [...(data.cashFlowHistory || [])].map((point) => ({
    ...point,
    netCashFlow: roundCurrency(Number(point.inflows || 0) - Number(point.outflows || 0)),
  }));
  if (range === "This Month") return history.filter((point) => String(point.date || "").startsWith("2026-05"));
  const rangeSizes = { "30D": 6, "90D": 9, "1Y": history.length };
  return history.slice(-(rangeSizes[range] || rangeSizes["This Month"] || 5));
}

export function cloneEnterpriseData(data = ENTERPRISE_MOCK_DATA) {
  return JSON.parse(JSON.stringify(data));
}

export function getEnterprisePermissions(role = "Viewer") {
  return {
    ...(ENTERPRISE_ROLE_PERMISSIONS[role] || ENTERPRISE_ROLE_PERMISSIONS.Viewer),
    role,
  };
}

export function canEnterpriseRole(role, permission) {
  return Boolean(getEnterprisePermissions(role)[permission]);
}

export function getEnterpriseBucketRows(data = ENTERPRISE_MOCK_DATA) {
  return (data.bucketAccounts || []).map((bucket) => {
    const progress = bucket.budgetAmount > 0 ? clamp((bucket.balance / bucket.budgetAmount) * 100, 0, 999) : 0;
    const actualProgress = bucket.budgetAmount > 0 ? clamp((bucket.actualSpend / bucket.budgetAmount) * 100, 0, 999) : 0;
    const remaining = roundCurrency(Math.max(Number(bucket.budgetAmount || 0) - Number(bucket.balance || 0), 0));
    return {
      ...bucket,
      progress: roundCurrency(progress),
      actualProgress: roundCurrency(actualProgress),
      remaining,
      isOverBudget: Number(bucket.actualSpend || 0) > Number(bucket.budgetAmount || 0),
    };
  });
}

export function getEnterpriseCashFlowForRange(data = ENTERPRISE_MOCK_DATA, range = "This Month") {
  const points = getCashFlowPointsForRange(data, range);
  const monthlyInflows = sumBy(points, (point) => point.inflows);
  const monthlyOutflows = sumBy(points, (point) => point.outflows);
  return {
    range,
    points,
    monthlyInflows,
    monthlyOutflows,
    netCashFlow: roundCurrency(monthlyInflows - monthlyOutflows),
  };
}

export function calculateEnterpriseAnalytics(data = ENTERPRISE_MOCK_DATA, range = "This Month") {
  const stablecoinTotal = sumBy(data.stablecoinBalances, (coin) => coin.balance);
  const bucketRows = getEnterpriseBucketRows(data);
  const bucketTotal = sumBy(bucketRows, (bucket) => bucket.balance);
  const budgetTotal = sumBy(data.budgetVsActual, (item) => item.budget);
  const budgetUsed = sumBy(data.budgetVsActual, (item) => item.actual);
  const cashFlow = getEnterpriseCashFlowForRange(data, range);
  const payrollBucket = bucketRows.find((bucket) => bucket.id === "payroll");
  const reserveBuckets = bucketRows.filter((bucket) => /reserve|treasury|emergency/i.test(bucket.name));
  const reserveTotal = sumBy(reserveBuckets, (bucket) => bucket.balance);
  const averageMonthlyOutflows = Math.max(cashFlow.monthlyOutflows || 0, 1);
  const overBudgetCount = (data.budgetVsActual || []).filter((item) => Number(item.actual || 0) > Number(item.budget || 0)).length;
  const budgetUsePercent = budgetTotal > 0 ? clamp((budgetUsed / budgetTotal) * 100, 0, 999) : 0;
  const stablecoinAllocationPercentages = (data.stablecoinBalances || []).map((coin) => ({
    ...coin,
    percent: stablecoinTotal > 0 ? roundCurrency((Number(coin.balance || 0) / stablecoinTotal) * 100) : 0,
  }));
  const expenseCategoryPercentages = (data.budgetVsActual || []).map((item) => ({
    ...item,
    percentUsed: item.budget > 0 ? roundCurrency((Number(item.actual || 0) / Number(item.budget || 0)) * 100) : 0,
    remaining: roundCurrency(Math.max(Number(item.budget || 0) - Number(item.actual || 0), 0)),
    isOverBudget: Number(item.actual || 0) > Number(item.budget || 0),
  }));
  const reserveRatio = roundCurrency(reserveTotal / averageMonthlyOutflows);
  const cashRunwayMonths = roundCurrency(stablecoinTotal / averageMonthlyOutflows);
  const payrollRunwayMonths = payrollBucket?.actualSpend
    ? roundCurrency(Number(payrollBucket.balance || 0) / Number(payrollBucket.actualSpend || 1))
    : 0;
  const budgetHealthScore = Math.round(clamp(
    100
      - Math.max(budgetUsePercent - 85, 0) * 0.7
      - overBudgetCount * 8
      + Math.min(reserveRatio * 3, 12)
      + (cashFlow.netCashFlow > 0 ? 8 : -12),
    0,
    100,
  ));

  return {
    totalAllocatedBalance: stablecoinTotal,
    stablecoinTotal,
    bucketTotal,
    bucketDelta: roundCurrency(stablecoinTotal - bucketTotal),
    bucketRows,
    budgetTotal,
    budgetUsed,
    budgetRemaining: roundCurrency(Math.max(budgetTotal - budgetUsed, 0)),
    budgetUsePercent: roundCurrency(budgetUsePercent),
    stablecoinAllocationPercentages,
    expenseCategoryPercentages,
    cashFlow,
    cashRunwayMonths,
    payrollRunwayMonths,
    reserveTotal,
    reserveRatio,
    budgetHealthScore,
    thirtyDayGrowthPercent: 12.45,
  };
}

export function generateEnterpriseInsights(data = ENTERPRISE_MOCK_DATA, analytics = calculateEnterpriseAnalytics(data)) {
  const legal = analytics.expenseCategoryPercentages.find((item) => /other|legal|compliance/i.test(item.category));
  const taxes = analytics.bucketRows.find((bucket) => bucket.id === "taxes");
  const vendorsDue = (data.transactions || []).filter((tx) => tx.status === "Pending" || /vendor/i.test(tx.type)).length;
  const projectedSavings = Math.max(analytics.cashFlow.netCashFlow, 0);
  const reallocationSource = analytics.bucketRows.find((bucket) => bucket.id === "reserve");
  const reallocationTarget = analytics.bucketRows.find((bucket) => bucket.id === "legal" || bucket.status === "Over Budget");
  const taxReserveWarning = taxes && taxes.progress < 92;

  return [
    {
      id: "projected-savings",
      tone: "positive",
      title: "Projected savings this month",
      metric: projectedSavings,
      message: projectedSavings > 0
        ? `Projected to save ${Math.round((projectedSavings / analytics.cashFlow.monthlyInflows) * 100)}% of this month's inflows after current outflows.`
        : "Current outflows are above inflows. Freeze optional spend until settlement improves.",
    },
    {
      id: "overspending-alert",
      tone: legal?.isOverBudget ? "warning" : "positive",
      title: "Overspending alerts",
      metric: analytics.budgetUsePercent,
      message: legal?.isOverBudget
        ? "Legal / Compliance is over budget. Route new approvals through Finance Manager review."
        : "No major category is over budget. Keep vendor and travel requests under review.",
    },
    {
      id: "payroll-runway",
      tone: analytics.payrollRunwayMonths >= 1 ? "positive" : "warning",
      title: "Payroll runway estimate",
      metric: analytics.payrollRunwayMonths,
      message: `Payroll bucket covers about ${analytics.payrollRunwayMonths.toFixed(1)} monthly payroll cycles at the current run rate.`,
    },
    {
      id: "tax-reserve",
      tone: taxReserveWarning ? "warning" : "positive",
      title: "Tax reserve warning",
      metric: taxes?.progress || 0,
      message: taxReserveWarning
        ? "Tax reserve is below the 92% enterprise threshold. Refill before owner draw or discretionary CapEx."
        : "Tax reserve is above the enterprise threshold for the current planning cycle.",
    },
    {
      id: "reallocation",
      tone: "action",
      title: "Suggested bucket reallocation",
      metric: analytics.reserveRatio,
      message: reallocationSource && reallocationTarget
        ? `Move 2% from ${reallocationSource.name} to ${reallocationTarget.name} after wallet approval to reduce budget pressure.`
        : "No reallocation needed. Treasury coverage is balanced across active buckets.",
    },
    {
      id: "vendor-reminder",
      tone: vendorsDue > 3 ? "warning" : "action",
      title: "Vendor payment reminder",
      metric: vendorsDue,
      message: `${vendorsDue} vendor-related items need review, including pending bucket transfers and recent vendor payouts.`,
    },
    {
      id: "cash-flow-health",
      tone: analytics.cashFlow.netCashFlow > 0 ? "positive" : "warning",
      title: "Cash flow health summary",
      metric: analytics.budgetHealthScore,
      message: analytics.cashFlow.netCashFlow > 0
        ? `Cash flow health score is ${analytics.budgetHealthScore}/100 with positive net flow and ${analytics.cashRunwayMonths.toFixed(1)} months of runway.`
        : `Cash flow health score is ${analytics.budgetHealthScore}/100. Review outflows before approving new payments.`,
    },
  ].slice(0, 5);
}

export function getEnterpriseDashboardModel({
  data = ENTERPRISE_MOCK_DATA,
  range = "This Month",
  activeRole = data.businessProfile?.activeRole || "Owner",
} = {}) {
  const normalizedRange = ENTERPRISE_TIME_FILTERS.includes(range) ? range : "This Month";
  const analytics = calculateEnterpriseAnalytics(data, normalizedRange);
  return {
    data,
    activeRole,
    permissions: getEnterprisePermissions(activeRole),
    analytics,
    insights: generateEnterpriseInsights(data, analytics),
  };
}
