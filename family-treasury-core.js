export const FAMILY_TREASURY_ROLES = ["Admin", "Parent", "Member", "Child", "Viewer"];

export const FAMILY_TREASURY_ROLE_PERMISSIONS = {
  Admin: {
    viewTreasury: true,
    inviteMembers: true,
    manageSettings: true,
    editBuckets: true,
    approveTransfers: true,
    approveSpending: true,
    viewReports: true,
    readOnly: false,
  },
  Parent: {
    viewTreasury: true,
    inviteMembers: true,
    manageSettings: false,
    editBuckets: true,
    approveTransfers: true,
    approveSpending: true,
    viewReports: true,
    readOnly: false,
  },
  Member: {
    viewTreasury: true,
    inviteMembers: false,
    manageSettings: false,
    editBuckets: false,
    approveTransfers: false,
    approveSpending: false,
    viewReports: true,
    readOnly: false,
  },
  Child: {
    viewTreasury: false,
    inviteMembers: false,
    manageSettings: false,
    editBuckets: false,
    approveTransfers: false,
    approveSpending: false,
    viewReports: false,
    readOnly: true,
  },
  Viewer: {
    viewTreasury: true,
    inviteMembers: false,
    manageSettings: false,
    editBuckets: false,
    approveTransfers: false,
    approveSpending: false,
    viewReports: true,
    readOnly: true,
  },
};

export const FAMILY_TREASURY_MOCK_DATA = {
  familyProfile: {
    id: "family_johnson",
    name: "Johnson Family",
    plan: "Pro Family",
    tagline: "United in purpose. Building generational wealth.",
    activeMemberId: "olivia",
    activeRole: "Admin",
    custodyModel: "non-custodial",
  },
  trustMessages: [
    "Non-custodial wallet logic",
    "No private keys stored",
    "No seed phrases stored",
    "Family transfers require wallet-approved transactions only",
    "Encrypted metadata placeholder for future backend APIs",
  ],
  members: [
    { id: "olivia", name: "Olivia", fullName: "Olivia Johnson", role: "Admin", label: "You", avatar: "OJ", color: "#c84cff" },
    { id: "noah", name: "Noah", fullName: "Noah Johnson", role: "Parent", label: "Member", avatar: "NJ", color: "#27d7ff" },
    { id: "sophia", name: "Sophia", fullName: "Sophia Johnson", role: "Member", label: "Member", avatar: "SJ", color: "#ffb545" },
    { id: "liam", name: "Liam", fullName: "Liam Johnson", role: "Child", label: "Member", avatar: "LJ", color: "#4c7dff" },
    { id: "emma", name: "Emma", fullName: "Emma Johnson", role: "Viewer", label: "Member", avatar: "EJ", color: "#2ee6a6" },
  ],
  wallets: [
    { id: "wallet-1", memberId: "olivia", asset: "USDC", network: "Base", balance: 108250.5, category: "Cash & Stablecoins" },
    { id: "wallet-2", memberId: "olivia", asset: "PYUSD", network: "Solana", balance: 62000, category: "Cash & Stablecoins" },
    { id: "wallet-3", memberId: "noah", asset: "USDT", network: "Ethereum", balance: 82500, category: "Cash & Stablecoins" },
    { id: "wallet-4", memberId: "sophia", asset: "DAI", network: "Polygon", balance: 48500, category: "Cash & Stablecoins" },
    { id: "wallet-5", memberId: "liam", asset: "USDC", network: "Solana", balance: 26400, category: "Child Savings" },
    { id: "wallet-6", memberId: "emma", asset: "USDC", network: "Base", balance: 24850, category: "Education Fund" },
    { id: "wallet-7", memberId: "olivia", asset: "Index Fund", network: "Manual", balance: 182000, category: "Investments" },
    { id: "wallet-8", memberId: "noah", asset: "Retirement", network: "Manual", balance: 143400.25, category: "Investments" },
    { id: "wallet-9", memberId: "olivia", asset: "Home Equity", network: "Manual", balance: 185000, category: "Real Estate" },
    { id: "wallet-10", memberId: "noah", asset: "Gold", network: "Manual", balance: 45250, category: "Precious Metals" },
    { id: "wallet-11", memberId: "sophia", asset: "Business Reserve", network: "Manual", balance: 84750, category: "Business Assets" },
    { id: "wallet-12", memberId: "emma", asset: "Other Assets", network: "Manual", balance: 190750, category: "Other Assets" },
  ],
  assetCategories: [
    { id: "cash", name: "Cash & Stablecoins", monthlyChange: 18.75, contributors: ["Olivia", "Noah", "Sophia"], accent: "green" },
    { id: "investments", name: "Investments", monthlyChange: 8.4, contributors: ["Olivia", "Noah"], accent: "blue" },
    { id: "real-estate", name: "Real Estate", monthlyChange: 2.1, contributors: ["Olivia", "Noah"], accent: "cyan" },
    { id: "metals", name: "Precious Metals", monthlyChange: 3.6, contributors: ["Noah"], accent: "gold" },
    { id: "emergency", name: "Emergency Fund", monthlyChange: 6.5, contributors: ["All members"], manualBalance: 50000, accent: "orange" },
    { id: "education", name: "Education Fund", monthlyChange: 5.2, contributors: ["Olivia", "Emma"], accent: "blue" },
    { id: "vacation", name: "Vacation Fund", monthlyChange: 12.4, contributors: ["All members"], manualBalance: 15000, accent: "green" },
    { id: "child", name: "Child Savings", monthlyChange: 9.8, contributors: ["Liam", "Emma"], accent: "purple" },
    { id: "business", name: "Business Assets", monthlyChange: 4.9, contributors: ["Sophia"], accent: "cyan" },
    { id: "other", name: "Other Assets", monthlyChange: 1.2, contributors: ["Emma"], accent: "purple" },
  ],
  goals: [
    { id: "home", name: "Dream Home", target: 500000, current: 125000, monthlyTarget: 7500, contributors: ["Olivia", "Noah"], estimatedCompletionDate: "2030-10-01" },
    { id: "college", name: "College Fund", target: 200000, current: 75000, monthlyTarget: 3200, contributors: ["Olivia", "Noah", "Emma"], estimatedCompletionDate: "2029-08-01" },
    { id: "vacation", name: "Family Vacation", target: 25000, current: 15000, monthlyTarget: 1200, contributors: ["All members"], estimatedCompletionDate: "2027-02-01" },
    { id: "emergency", name: "Emergency Fund", target: 50000, current: 50000, monthlyTarget: 1500, contributors: ["All members"], estimatedCompletionDate: "2026-05-01" },
    { id: "car", name: "Car Fund", target: 55000, current: 18000, monthlyTarget: 1000, contributors: ["Noah"], estimatedCompletionDate: "2029-06-01" },
    { id: "debt", name: "Debt Payoff", target: 30000, current: 22000, monthlyTarget: 1800, contributors: ["Olivia"], estimatedCompletionDate: "2026-10-01" },
    { id: "business-startup", name: "Business Startup Fund", target: 150000, current: 84750, monthlyTarget: 4200, contributors: ["Sophia", "Olivia"], estimatedCompletionDate: "2028-01-01" },
  ],
  budgetBuckets: [
    { id: "housing", name: "Housing", balance: 4200, monthlyTarget: 4200, amountSpent: 3850, members: ["Olivia", "Noah"], autoAllocationPercent: 22 },
    { id: "utilities", name: "Utilities", balance: 780, monthlyTarget: 900, amountSpent: 640, members: ["Olivia"], autoAllocationPercent: 4 },
    { id: "groceries", name: "Groceries", balance: 1450, monthlyTarget: 1800, amountSpent: 1685, members: ["All members"], autoAllocationPercent: 9 },
    { id: "transportation", name: "Transportation", balance: 920, monthlyTarget: 1200, amountSpent: 1115, members: ["Noah", "Sophia"], autoAllocationPercent: 6 },
    { id: "insurance", name: "Insurance", balance: 1050, monthlyTarget: 1200, amountSpent: 940, members: ["Olivia"], autoAllocationPercent: 6 },
    { id: "child-expenses", name: "Child Expenses", balance: 1250, monthlyTarget: 1600, amountSpent: 1325, members: ["Liam", "Emma"], autoAllocationPercent: 8 },
    { id: "education", name: "Education", balance: 2400, monthlyTarget: 3200, amountSpent: 2100, members: ["Sophia", "Emma"], autoAllocationPercent: 12 },
    { id: "family-emergency", name: "Family Emergency", balance: 50000, monthlyTarget: 50000, amountSpent: 0, members: ["All members"], autoAllocationPercent: 8 },
    { id: "investments", name: "Investments", balance: 325400.25, monthlyTarget: 12000, amountSpent: 6500, members: ["Olivia", "Noah"], autoAllocationPercent: 14 },
    { id: "vacation", name: "Vacation", balance: 15000, monthlyTarget: 25000, amountSpent: 2400, members: ["All members"], autoAllocationPercent: 5 },
    { id: "giving", name: "Giving/Charity", balance: 1800, monthlyTarget: 2000, amountSpent: 850, members: ["Olivia", "Noah"], autoAllocationPercent: 2 },
    { id: "business", name: "Business/Side Hustle", balance: 84750, monthlyTarget: 150000, amountSpent: 12000, members: ["Sophia"], autoAllocationPercent: 4 },
  ],
  transactions: [
    { id: "act-1", memberId: "noah", description: "Received from Noah", amount: 500, category: "Cash & Stablecoins", timestamp: "2026-05-24T14:30:00-05:00", status: "Completed" },
    { id: "act-2", memberId: "olivia", description: "Invested in Index Fund", amount: -1250, category: "Investments", timestamp: "2026-05-24T11:15:00-05:00", status: "Completed" },
    { id: "act-3", memberId: "sophia", description: "Paid for Groceries", amount: -85.5, category: "Groceries", timestamp: "2026-05-24T09:45:00-05:00", status: "Completed" },
    { id: "act-4", memberId: "olivia", description: "Salary Deposit", amount: 3500, category: "Cash & Stablecoins", timestamp: "2026-05-24T09:00:00-05:00", status: "Completed" },
    { id: "act-5", memberId: "emma", description: "Education contribution", amount: 250, category: "Education Fund", timestamp: "2026-05-23T17:20:00-05:00", status: "Pending" },
  ],
  chartHistory: [
    { label: "Apr 28", date: "2026-04-28", value: 570000 },
    { label: "Apr 30", date: "2026-04-30", value: 760000 },
    { label: "May 2", date: "2026-05-02", value: 580000 },
    { label: "May 6", date: "2026-05-06", value: 820000 },
    { label: "May 10", date: "2026-05-10", value: 940000 },
    { label: "May 14", date: "2026-05-14", value: 1045000 },
    { label: "May 18", date: "2026-05-18", value: 1230000 },
    { label: "May 22", date: "2026-05-22", value: 1320000 },
    { label: "May 24", date: "2026-05-24", value: 1248650.75 },
    { label: "May 26", date: "2026-05-26", value: 1340000 },
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

export function cloneFamilyTreasuryData(data = FAMILY_TREASURY_MOCK_DATA) {
  return JSON.parse(JSON.stringify(data));
}

export function getFamilyPermissions(role = "Viewer") {
  return {
    ...(FAMILY_TREASURY_ROLE_PERMISSIONS[role] || FAMILY_TREASURY_ROLE_PERMISSIONS.Viewer),
    role,
  };
}

export function canFamilyRole(role, permission) {
  return Boolean(getFamilyPermissions(role)[permission]);
}

export function getFamilyAssetRows(data = FAMILY_TREASURY_MOCK_DATA) {
  const total = sumBy(data.wallets, (wallet) => wallet.balance)
    + sumBy(data.assetCategories, (category) => category.manualBalance || 0);
  return (data.assetCategories || []).map((category) => {
    const walletTotal = sumBy(data.wallets.filter((wallet) => wallet.category === category.name), (wallet) => wallet.balance);
    const balance = roundCurrency(walletTotal + Number(category.manualBalance || 0));
    return {
      ...category,
      balance,
      percentOfTotal: total > 0 ? roundCurrency((balance / total) * 100) : 0,
      contributorCount: Array.isArray(category.contributors)
        ? category.contributors.includes("All members") ? data.members.length : category.contributors.length
        : 0,
    };
  });
}

export function getFamilyGoalRows(data = FAMILY_TREASURY_MOCK_DATA) {
  return (data.goals || []).map((goal) => {
    const progress = goal.target > 0 ? clamp((goal.current / goal.target) * 100, 0, 999) : 0;
    const remaining = roundCurrency(Math.max(Number(goal.target || 0) - Number(goal.current || 0), 0));
    let status = "on track";
    if (progress >= 100) status = "complete";
    else if (goal.monthlyTarget < remaining / 24) status = "behind";
    return {
      ...goal,
      progress: roundCurrency(progress),
      remaining,
      status,
    };
  });
}

export function getFamilyBudgetRows(data = FAMILY_TREASURY_MOCK_DATA) {
  return (data.budgetBuckets || []).map((bucket) => {
    const remaining = roundCurrency(Math.max(Number(bucket.monthlyTarget || 0) - Number(bucket.amountSpent || 0), 0));
    const spentPercent = bucket.monthlyTarget > 0 ? roundCurrency((Number(bucket.amountSpent || 0) / Number(bucket.monthlyTarget || 0)) * 100) : 0;
    return {
      ...bucket,
      remaining,
      spentPercent,
      isOverBudget: Number(bucket.amountSpent || 0) > Number(bucket.monthlyTarget || 0),
      manualEditState: "ready",
    };
  });
}

export function calculateFamilyTreasury(data = FAMILY_TREASURY_MOCK_DATA) {
  const assetRows = getFamilyAssetRows(data);
  const goalRows = getFamilyGoalRows(data);
  const budgetRows = getFamilyBudgetRows(data);
  const totalFamilyTreasury = sumBy(assetRows, (asset) => asset.balance);
  const stablecoinTotal = sumBy(assetRows.filter((asset) => asset.name === "Cash & Stablecoins"), (asset) => asset.balance);
  const investmentTotal = sumBy(assetRows.filter((asset) => asset.name === "Investments"), (asset) => asset.balance);
  const realEstateTotal = sumBy(assetRows.filter((asset) => asset.name === "Real Estate"), (asset) => asset.balance);
  const emergencyFundTotal = sumBy(assetRows.filter((asset) => asset.name === "Emergency Fund"), (asset) => asset.balance);
  const budgetSpent = sumBy(budgetRows, (bucket) => bucket.amountSpent);
  const budgetTarget = sumBy(budgetRows, (bucket) => bucket.monthlyTarget);
  const budgetRemaining = sumBy(budgetRows, (bucket) => bucket.remaining);
  const goalTarget = sumBy(goalRows, (goal) => goal.target);
  const goalCurrent = sumBy(goalRows, (goal) => goal.current);
  const monthlyContributionProgress = goalRows.length
    ? roundCurrency((sumBy(goalRows, (goal) => goal.monthlyTarget) / Math.max(goalTarget / 60, 1)) * 100)
    : 0;
  const memberContributionTotals = (data.members || []).map((member) => {
    const walletTotal = sumBy(data.wallets.filter((wallet) => wallet.memberId === member.id), (wallet) => wallet.balance);
    const activityContribution = sumBy(data.transactions.filter((tx) => tx.memberId === member.id && tx.amount > 0), (tx) => tx.amount);
    return {
      ...member,
      total: roundCurrency(walletTotal),
      monthlyContribution: roundCurrency(activityContribution),
      percent: totalFamilyTreasury > 0 ? roundCurrency((walletTotal / totalFamilyTreasury) * 100) : 0,
    };
  });
  const overBudgetCount = budgetRows.filter((bucket) => bucket.isOverBudget || bucket.spentPercent > 92).length;
  const underfundedGoals = goalRows.filter((goal) => goal.status === "behind").length;
  const emergencyMonths = budgetSpent > 0 ? roundCurrency(emergencyFundTotal / budgetSpent) : 0;
  const savingsRate = 24.5;
  const familyHealthScore = Math.round(clamp(
    96
      + Math.min(emergencyMonths * 2, 10)
      + (savingsRate >= 20 ? 5 : -5)
      - overBudgetCount * 3
      - underfundedGoals * 2,
    0,
    100,
  ));

  return {
    assetRows,
    goalRows,
    budgetRows,
    totalFamilyTreasury,
    thirtyDayGrowthPercentage: 18.75,
    connectedWallets: data.wallets.length,
    totalMembers: Math.min(data.members.length, 5),
    stablecoinTotal,
    investmentTotal,
    realEstateTotal,
    emergencyFundTotal,
    monthlySavingsRate: savingsRate,
    familyHealthScore,
    familyHealthGrade: familyHealthScore >= 90 ? "A+" : familyHealthScore >= 80 ? "A" : familyHealthScore >= 70 ? "B" : "C",
    goalCompletionPercentage: goalTarget > 0 ? roundCurrency((goalCurrent / goalTarget) * 100) : 0,
    monthlyContributionProgress,
    budgetSpent,
    budgetTarget,
    budgetRemaining,
    memberContributionTotals,
    chartHistory: data.chartHistory || [],
  };
}

export function generateFamilyInsights(data = FAMILY_TREASURY_MOCK_DATA, analytics = calculateFamilyTreasury(data)) {
  const overBudget = analytics.budgetRows.filter((bucket) => bucket.isOverBudget || bucket.spentPercent > 92);
  const underfundedGoals = analytics.goalRows.filter((goal) => goal.status === "behind");
  const strongestContributor = [...analytics.memberContributionTotals].sort((a, b) => b.monthlyContribution - a.monthlyContribution)[0];
  const emergencyLow = analytics.emergencyFundTotal < Math.max(analytics.budgetSpent * 2, 1);

  return [
    {
      id: "goal-projection",
      tone: "positive",
      title: "Goal projection",
      message: `Your family is projected to achieve ${analytics.goalRows.filter((goal) => goal.status !== "behind").length} of ${analytics.goalRows.length} goals this year.`,
    },
    {
      id: "savings-increase",
      tone: analytics.monthlySavingsRate >= 20 ? "positive" : "warning",
      title: "Savings recommendation",
      message: analytics.monthlySavingsRate >= 20
        ? "Great savings momentum. A small monthly increase can pull long-term goals forward."
        : "Increase monthly savings by $500 to keep every family goal on track.",
    },
    {
      id: "emergency-fund",
      tone: emergencyLow ? "warning" : "positive",
      title: "Emergency fund",
      message: emergencyLow
        ? "Emergency coverage is under two months of current spending. Refill before new discretionary transfers."
        : "Great job. Your emergency fund is fully funded for this family plan.",
    },
    {
      id: "overspending",
      tone: overBudget.length ? "warning" : "positive",
      title: "Overspending watch",
      message: overBudget.length
        ? `${overBudget[0].name} is running hot this month. Route new spending through approval before transfer.`
        : "No shared bucket is over budget. Keep grocery and transportation spend visible.",
    },
    {
      id: "rebalancing",
      tone: "action",
      title: "Rebalancing and strongest contributor",
      message: underfundedGoals.length
        ? `${strongestContributor?.name || "Your family"} is the strongest contributor. Shift 1.5% from Other Assets into ${underfundedGoals[0].name} after wallet approval.`
        : `${strongestContributor?.name || "Your family"} is the strongest contributor. Consider diversifying investments while stablecoin liquidity is strong.`,
    },
  ].slice(0, 5);
}

export function getFamilyTreasuryDashboardModel({
  data = FAMILY_TREASURY_MOCK_DATA,
  activeMemberId = data.familyProfile?.activeMemberId || data.members?.[0]?.id,
} = {}) {
  const activeMember = (data.members || []).find((member) => member.id === activeMemberId) || data.members?.[0];
  const analytics = calculateFamilyTreasury(data);
  return {
    data,
    activeMember,
    permissions: getFamilyPermissions(activeMember?.role),
    analytics,
    insights: generateFamilyInsights(data, analytics),
  };
}
