import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

const source = await readFile(new URL("../server.js", import.meta.url), "utf8");
const functions = source.slice(source.indexOf("function parseTokenAccounts("), source.indexOf("async function handleSolanaPyusdBalance("));
const mint = "test-mint";
async function scan(postRpc) {
  const context = { postRpc, solanaPyusdMint: mint, solanaTokenPrograms: ["legacy", "token2022"] };
  runInNewContext(`${functions}; this.scan = fetchSolanaPyusdBalance;`, context);
  return context.scan("wallet", ["primary", "fallback"]);
}

await assert.rejects(scan(async () => { throw new Error("connect EACCES"); }), /Balance is unavailable/);
assert.equal((await scan(async (_, payload) => {
  if (payload.method === "getAccountInfo") return { result: { value: { data: { parsed: { info: { mint, tokenAmount: { uiAmountString: "325.50" } } } } } } };
  return { result: { value: [] } };
})).balance, 325.5, "Empty owner scans must still check direct token accounts");
assert.equal((await scan(async (endpoint, payload) => {
  if (endpoint === "fallback" && payload.method === "getTokenAccountsByOwner") return { result: { value: [{ account: { data: { parsed: { info: { mint, tokenAmount: { uiAmountString: "301" } } } } } }] } };
  return { result: { value: payload.method === "getAccountInfo" ? null : [] } };
})).balance, 301, "An empty provider response must allow fallback providers");
assert.equal((await scan(async (_, payload) => ({ result: { value: payload.method === "getAccountInfo" ? null : [] } }))).balance, 0);
console.log("PYUSD balance behavior checks passed");
