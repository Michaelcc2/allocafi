import assert from "node:assert/strict";
import {
  buildExternalPaymentLink,
  createDefaultPayState,
  createPayMethod,
  createPayTransaction,
  findBestPaymentRoute,
  getPayDashboardMetrics,
  getPayMonthlyExpenseBaseline,
  validatePaymentMethodInput,
  validateWalletAddress,
} from "../allocafi-pay-core.js";

const state = createDefaultPayState("2026-05-27T16:25:10.000Z");

assert.equal(state.methods.length, 7, "default Pay state should include fiat and stablecoin methods");
assert.equal(state.preferences.requireManualConfirmation, true, "manual confirmation should be the safe default");

assert.equal(
  validatePaymentMethodInput({ provider: "cashapp", qrImageUrl: "data:image/png;base64,abc", active: true }, []).valid,
  true,
  "fiat QR-only destination references should be valid"
);

assert.equal(
  validatePaymentMethodInput({ provider: "venmo", displayHandle: "", qrImageUrl: "" }, []).valid,
  false,
  "empty QR and empty handle should be rejected"
);

assert.equal(
  validatePaymentMethodInput({ provider: "cashapp", displayHandle: "$alexcarter" }, state.methods).valid,
  false,
  "duplicate payment method references should be rejected"
);

assert.equal(
  validatePaymentMethodInput({ provider: "cashapp", displayHandle: "seed phrase words" }, []).valid,
  false,
  "private-key style secrets should be rejected from payment handles"
);

assert.equal(
  validateWalletAddress("evm", "0x742d35Cc6634C0532925a3b844Bc454e4438f44e").valid,
  true,
  "EVM wallet address should validate"
);

assert.equal(
  validateWalletAddress("solana", "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo").valid,
  true,
  "Solana wallet address should validate"
);

const cashAppRoute = findBestPaymentRoute(
  [state.methods.find((method) => method.provider === "cashapp")],
  [createPayMethod({ provider: "cashapp", displayHandle: "$casarah", active: true })],
  { amount: 25 }
);
assert.equal(cashAppRoute.status, "matched", "matching fiat methods should route");
assert.equal(cashAppRoute.recommended.provider, "cashapp", "Cash App should be recommended for matching Cash App users");
assert.match(cashAppRoute.recommended.deepLink, /cash\.app/, "Cash App route should expose an external link");

const cryptoRoute = findBestPaymentRoute(
  [state.methods.find((method) => method.provider === "usdc")],
  [createPayMethod({ provider: "usdc", walletAddress: "0x8ba1f109551bD432803012645Ac136ddd64DBA72", asset: "USDC", active: true })],
  { amount: 44 }
);
assert.equal(cryptoRoute.status, "matched", "matching stablecoin methods should route");
assert.equal(cryptoRoute.recommended.type, "crypto", "stablecoin route should be marked as crypto");

const noMatchRoute = findBestPaymentRoute(
  [createPayMethod({ provider: "cashapp", displayHandle: "$sender", active: true })],
  [createPayMethod({ provider: "venmo", displayHandle: "@receiver", active: true })],
  { amount: 12 }
);
assert.equal(noMatchRoute.status, "no-match", "incompatible methods should produce a no-match route");

assert.equal(
  buildExternalPaymentLink(createPayMethod({ provider: "paypal", displayHandle: "paypal.me/alexcarter" })),
  "https://paypal.me/alexcarter",
  "PayPal payment links should normalize to PayPal.me"
);

const metrics = getPayDashboardMetrics({ dashboard: {}, details: {}, payState: state });
assert.equal(metrics.nonCustodial, true, "Pay dashboard metrics should carry non-custodial flag");
assert.equal(metrics.totalPayBalance, 12580.45, "empty wallet data should use safe demo Pay balance");
assert.equal(metrics.stablecoinBreakdown.USDC, 6250, "demo metrics should include USDC breakdown");

const reserveDetails = {
  billsRequired: 755,
  stablecoins: [["PYUSD", 14.03]],
  stablecoinTotal: 14.03,
  bucketRows: [
    { bucket: { name: "Emergency Fund" }, left: 14.03 },
    { bucket: { name: "Bills" }, left: 0, group: "Bills" },
  ],
};
const reserveBaseline = getPayMonthlyExpenseBaseline({ details: reserveDetails, dashboard: { moneyOut: 1, monthSpending: 1 } });
assert.equal(reserveBaseline.amount, 755, "reserve coverage should prioritize listed monthly bills");
const reserveMetrics = getPayDashboardMetrics({ dashboard: { moneyOut: 1, monthSpending: 1 }, details: reserveDetails, payState: state });
assert.equal(reserveMetrics.reserveExpenseBaseline, 755, "reserve metrics should expose the expense baseline");
assert.ok(reserveMetrics.reserveMonths < 0.1, "small emergency reserves should not show inflated months of coverage");

const tx = createPayTransaction({
  direction: "sent",
  contactName: "QA Contact",
  method: "Venmo",
  amount: 17,
  status: "routed externally",
  externalAppLabel: "Venmo",
});
assert.equal(tx.status, "routed externally", "fiat records should store route attempts without claiming processing");

console.log("AllocaFi Pay checks passed");
