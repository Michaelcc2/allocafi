import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
function extract(name) {
  const start = source.search(new RegExp(`(?:async )?function ${name}\\(`));
  assert.ok(start >= 0);
  const rest = source.slice(start);
  const next = rest.slice(1).search(/\n(?:async )?function /);
  return next < 0 ? rest : rest.slice(0, next + 1);
}
const localStorage = {};
Object.defineProperties(localStorage, {
  getItem: { value: key => localStorage[key] ?? null },
  setItem: { value: (key, value) => { localStorage[key] = String(value); } },
  removeItem: { value: key => { delete localStorage[key]; } },
});
const context = { localStorage, STORAGE_KEY: "wallet-buckets-v1", ACCOUNT_SESSION_KEY: "allocafi-account-session-v1", accountAuthenticated: false, accountSession: { creator: true },
  getCurrentSubscriptionPlan: () => ({ code: "free" }) };
runInNewContext(["accountWorkspaceKeys", "switchAccountWorkspace", "isCreatorAccount", "usesFreeTemplateLimit"].map(extract).join("\n"), context);
localStorage.setItem(context.STORAGE_KEY, "guest wallets");
localStorage.setItem(context.ACCOUNT_SESSION_KEY, "old token");
context.switchAccountWorkspace("user-a");
assert.equal(localStorage.getItem(context.STORAGE_KEY), null);
assert.equal(JSON.parse(localStorage.getItem("allocafi-user-backup:guest"))[context.STORAGE_KEY], "guest wallets");
assert.equal(JSON.parse(localStorage.getItem("allocafi-user-backup:guest"))[context.ACCOUNT_SESSION_KEY], undefined);
localStorage.setItem(context.STORAGE_KEY, "a wallets");
context.switchAccountWorkspace("signed-out");
assert.equal(localStorage.getItem(context.STORAGE_KEY), null);
context.switchAccountWorkspace("user-b");
assert.equal(localStorage.getItem(context.STORAGE_KEY), null);
localStorage.setItem(context.STORAGE_KEY, "b wallets");
context.switchAccountWorkspace("user-a");
assert.equal(localStorage.getItem(context.STORAGE_KEY), "a wallets");
assert.equal(context.isCreatorAccount(), false, "Cached identity alone cannot unlock creator access");
context.accountAuthenticated = true;
assert.equal(context.usesFreeTemplateLimit(), false);
context.accountSession.creator = false;
assert.equal(context.usesFreeTemplateLimit(), true);

let queue = [{ id: "change-1" }];
Object.assign(context, { accountSyncReady: true, accountSyncPromise: null, accountRevision: 0,
  loadCloudSyncQueue: () => queue, saveCloudSyncQueue: next => { queue = next; }, collectCloudSnapshot: () => ({ wallets: [] }),
  accountRequest: async () => ({ stored: false }), saveAccountProfile: () => {}, showToast: () => {}, renderAccountCloudPanel: () => {} });
runInNewContext(extract("flushCloudSync"), context);
assert.equal(await context.flushCloudSync(), false);
assert.equal(queue.length, 1, "A non-persistent response must not clear pending changes");
context.accountRequest = async () => { queue.push({ id: "change-2" }); return { stored: true, revision: 1 }; };
assert.equal(await context.flushCloudSync(), true);
assert.equal(queue.length, 1);
assert.equal(queue[0].id, "change-2", "Edits during an in-flight save must stay queued");
assert.equal(context.accountRevision, 1);
console.log("Account workspace isolation, creator gating, and reliable save checks passed");
