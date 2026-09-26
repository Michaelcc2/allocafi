import assert from "node:assert/strict";
import {
  createKeyValueStore,
  createMobileRuntime,
  detectMobileEnvironment,
  isAllowedDeepLink,
  isForbiddenStorageKey,
  normalizeAppUrl,
  normalizePermissionState,
  resolveBackButtonAction
} from "../mobile-runtime.js";

assert.deepEqual(detectMobileEnvironment({}), {
  capacitor: false,
  native: false,
  android: false,
  ios: false,
  platform: "web"
});
assert.equal(detectMobileEnvironment({ Capacitor: { getPlatform: () => "android", isNativePlatform: () => true } }).android, true);
assert.equal(resolveBackButtonAction({ modalOpen: true, canGoBack: true }), "close-modal");
assert.equal(resolveBackButtonAction({ canGoBack: true }), "navigate-back");
assert.equal(resolveBackButtonAction({ canGoBack: true, atRoot: true }), "background-app");
assert.equal(normalizePermissionState({ receive: "prompt-with-rationale" }), "prompt");
assert.equal(normalizePermissionState({ receive: "granted" }), "granted");
assert.equal(normalizeAppUrl("allocafi://auth/callback?ok=1").pathname, "/callback");
assert.equal(normalizeAppUrl("not a url"), null);
assert.equal(isAllowedDeepLink("https://allocafi-web.onrender.com/auth/callback#ok"), true);
assert.equal(isAllowedDeepLink("allocafi://auth/callback#ok"), true);
assert.equal(isAllowedDeepLink("https://example.test/auth/callback"), false);
assert.equal(isAllowedDeepLink("http://allocafi-web.onrender.com/auth/callback"), false);
assert.equal(isForbiddenStorageKey("wallet_private_key"), true);
assert.equal(isForbiddenStorageKey("recovery-phrase"), true);
assert.equal(isForbiddenStorageKey("dashboard-cache"), false);

const browserValues = new Map();
const localStorage = {
  getItem: key => browserValues.get(key) ?? null,
  setItem: (key, value) => browserValues.set(key, value),
  removeItem: key => browserValues.delete(key)
};
const browserStore = createKeyValueStore({ localStorage, namespace: "test" });
assert.equal(browserStore.backend, "localStorage-cache");
assert.equal(browserStore.secureBackend, "unavailable");
await browserStore.set("dashboard", "cached");
assert.equal(await browserStore.get("dashboard"), "cached");
assert.equal(browserValues.get("test:dashboard"), "cached");
await assert.rejects(() => browserStore.set("session", "token", { sensitive: true }), /encrypted native storage plugin/);
await assert.rejects(() => browserStore.set("seed_phrase", "words"), /must never be stored/);

const preferenceValues = new Map();
const Preferences = {
  async get({ key }) { return { value: preferenceValues.get(key) ?? null }; },
  async set({ key, value }) { preferenceValues.set(key, value); },
  async remove({ key }) { preferenceValues.delete(key); }
};
const nativeStore = createKeyValueStore({ Preferences, localStorage, namespace: "native" });
await nativeStore.set("dashboard", "cached");
assert.equal(await nativeStore.get("dashboard"), "cached");
await assert.rejects(() => nativeStore.set("session", "opaque-token", { sensitive: true }), /encrypted native storage plugin/);
assert.equal(browserValues.has("native:session"), false);

const secureValues = new Map();
const SecureStorage = {
  async get({ key }) { return { value: secureValues.get(key) ?? null }; },
  async set({ key, value }) { secureValues.set(key, value); },
  async remove({ key }) { secureValues.delete(key); }
};
const encryptedStore = createKeyValueStore({ Preferences, SecureStorage, localStorage, namespace: "encrypted" });
assert.equal(encryptedStore.secureBackend, "secureStorage");
await encryptedStore.set("session", "opaque-token", { sensitive: true });
assert.equal(await encryptedStore.get("session", { sensitive: true }), "opaque-token");

function mockPlugin(methods = {}) {
  const listeners = new Map();
  return {
    listeners,
    async addListener(name, callback) {
      listeners.set(name, callback);
      return { remove: async () => listeners.delete(name) };
    },
    ...methods
  };
}

let minimized = 0;
let clipboardText = "";
let registered = 0;
const App = mockPlugin({
  getState: async () => ({ isActive: true }),
  minimizeApp: async () => { minimized += 1; }
});
const Network = mockPlugin({ getStatus: async () => ({ connected: true, connectionType: "wifi" }) });
const Clipboard = {
  write: async ({ string }) => { clipboardText = string; },
  read: async () => ({ value: clipboardText })
};
const shared = [];
const Share = { share: async payload => { shared.push(payload); return { activityType: "test" }; } };
const opened = [];
const Browser = { open: async payload => opened.push(payload) };
const PushNotifications = mockPlugin({
  checkPermissions: async () => ({ receive: "granted" }),
  requestPermissions: async () => ({ receive: "granted" }),
  register: async () => { registered += 1; }
});
const runtime = createMobileRuntime({
  globalObject: {},
  capacitor: { getPlatform: () => "android", isNativePlatform: () => true },
  plugins: { App, Network, Preferences, Clipboard, Share, Browser, PushNotifications }
});

assert.equal(runtime.isNative, true);
assert.equal(runtime.isAndroid, true);
const events = { back: [], url: [], network: [], appState: [], registration: [] };
runtime.onBackButton(event => events.back.push(event));
runtime.onAppUrl(event => events.url.push(event));
runtime.onNetworkChange(event => events.network.push(event));
runtime.onAppStateChange(event => events.appState.push(event));
runtime.onNotificationRegistration(event => events.registration.push(event));
await runtime.start();
assert.deepEqual(events.network[0], { connected: true, connectionType: "wifi" });
assert.deepEqual(events.appState[0], { active: true });

App.listeners.get("backButton")({ canGoBack: false });
assert.equal(events.back[0].action, "background-app");
assert.equal(minimized, 1);
App.listeners.get("appUrlOpen")({ url: "allocafi://auth/callback#done" });
assert.equal(events.url[0].protocol, "allocafi:");
Network.listeners.get("networkStatusChange")({ connected: false, connectionType: "none" });
assert.deepEqual(events.network.at(-1), { connected: false, connectionType: "none" });
App.listeners.get("appStateChange")({ isActive: false });
assert.deepEqual(events.appState.at(-1), { active: false });
PushNotifications.listeners.get("registration")({ value: "device-token" });
assert.deepEqual(events.registration[0], { value: "device-token" });

await runtime.writeClipboard("public wallet address");
assert.equal((await runtime.readClipboard()).value, "public wallet address");
assert.equal((await runtime.share({ text: "Allocation complete" })).supported, true);
assert.equal(shared[0].text, "Allocation complete");
await runtime.openExternalLink("https://allocafi-web.onrender.com/help");
assert.equal(opened[0].url, "https://allocafi-web.onrender.com/help");
await assert.rejects(() => runtime.openExternalLink("javascript:alert(1)"), /HTTPS/);
assert.equal((await runtime.requestNotificationPermission()).state, "granted");
assert.deepEqual(await runtime.registerNotifications(), { supported: true, registered: true, permission: "granted" });
assert.equal(registered, 1);
assert.equal(await runtime.start().then(result => result.alreadyStarted), true);
await runtime.stop();
assert.equal(App.listeners.size, 0);
assert.equal(Network.listeners.size, 0);
assert.equal(PushNotifications.listeners.size, 0);

const webClipboard = [];
const browserListeners = new Map();
const documentListeners = new Map();
const webNavigator = {
  onLine: false,
  clipboard: {
    writeText: async value => webClipboard.push(value),
    readText: async () => webClipboard.at(-1)
  }
};
const webGlobal = {
  location: { href: "https://example.test/app" },
  document: {
    visibilityState: "visible",
    addEventListener: (name, callback) => documentListeners.set(name, callback),
    removeEventListener: name => documentListeners.delete(name)
  },
  addEventListener: (name, callback) => browserListeners.set(name, callback),
  removeEventListener: name => browserListeners.delete(name)
};
const webRuntime = createMobileRuntime({
  globalObject: webGlobal,
  localStorage,
  navigator: webNavigator
});
const webNetwork = [];
const webState = [];
const webUrls = [];
webRuntime.onNetworkChange(status => webNetwork.push(status));
webRuntime.onAppStateChange(state => webState.push(state));
webRuntime.onAppUrl(url => webUrls.push(url));
await webRuntime.start();
assert.deepEqual(webNetwork[0], { connected: false, connectionType: "unknown" });
webNavigator.onLine = true;
browserListeners.get("online")();
assert.deepEqual(webNetwork.at(-1), { connected: true, connectionType: "unknown" });
webGlobal.document.visibilityState = "hidden";
documentListeners.get("visibilitychange")();
assert.deepEqual(webState.at(-1), { active: false });
webGlobal.location.href = "https://example.test/app#budget";
browserListeners.get("hashchange")();
assert.equal(webUrls.at(-1).hash, "#budget");
assert.equal((await webRuntime.writeClipboard("browser copy")).native, false);
assert.equal((await webRuntime.readClipboard()).value, "browser copy");
assert.deepEqual(await webRuntime.getNotificationPermission(), { supported: false, feature: "push-notifications" });
await webRuntime.stop();
assert.equal(browserListeners.size, 0);
assert.equal(documentListeners.size, 0);

console.log("Mobile runtime native detection, lifecycle, storage, utilities, and notifications checks passed");
