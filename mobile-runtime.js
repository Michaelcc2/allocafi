const DEFAULT_NAMESPACE = "allocafi.mobile";
const ALLOWED_APP_LINK_HOSTS = new Set(["allocafi-web.onrender.com"]);

const FORBIDDEN_STORAGE_KEY = /(?:seed(?:phrase)?|mnemonic|private[_-]?key|secret[_-]?key|recovery[_-]?(?:phrase|words?))/i;

function getGlobalObject(candidate) {
  if (candidate) return candidate;
  return typeof globalThis === "undefined" ? {} : globalThis;
}

function getPlugin(capacitor, name, injectedPlugins) {
  if (injectedPlugins?.[name]) return injectedPlugins[name];
  if (capacitor?.Plugins?.[name]) return capacitor.Plugins[name];
  if (typeof capacitor?.registerPlugin === "function") return capacitor.registerPlugin(name);
  return null;
}

function storageKey(namespace, key) {
  return `${namespace}:${key}`;
}

function unsupported(feature) {
  return { supported: false, feature };
}

async function removeListener(handle) {
  const resolved = await handle;
  if (typeof resolved?.remove === "function") await resolved.remove();
}

export function detectMobileEnvironment(globalObject) {
  const scope = getGlobalObject(globalObject);
  const capacitor = scope.Capacitor;
  const platform = typeof capacitor?.getPlatform === "function"
    ? capacitor.getPlatform()
    : "web";
  const native = typeof capacitor?.isNativePlatform === "function"
    ? Boolean(capacitor.isNativePlatform())
    : platform !== "web" && Boolean(capacitor);

  return Object.freeze({
    capacitor: Boolean(capacitor),
    native,
    android: native && platform === "android",
    ios: native && platform === "ios",
    platform
  });
}

export function isForbiddenStorageKey(key) {
  return FORBIDDEN_STORAGE_KEY.test(String(key || ""));
}

export function normalizeAppUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return Object.freeze({
      url: url.href,
      protocol: url.protocol,
      host: url.host,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash
    });
  } catch {
    return null;
  }
}

export function isAllowedDeepLink(value) {
  const parsed = typeof value === "string" ? normalizeAppUrl(value) : value;
  if (!parsed) return false;
  if (parsed.protocol === "https:") return ALLOWED_APP_LINK_HOSTS.has(parsed.host);
  return parsed.protocol === "allocafi:" && parsed.host === "auth" && parsed.pathname === "/callback";
}

export function resolveBackButtonAction({ modalOpen = false, canGoBack = false, atRoot = false } = {}) {
  if (modalOpen) return "close-modal";
  if (canGoBack && !atRoot) return "navigate-back";
  return "background-app";
}

export function normalizePermissionState(result) {
  const value = result?.receive || result?.display || result?.permission || result;
  if (value === "granted") return "granted";
  if (value === "denied") return "denied";
  if (value === "prompt" || value === "prompt-with-rationale") return "prompt";
  return "unknown";
}

export function createKeyValueStore({ Preferences, SecureStorage, localStorage, namespace = DEFAULT_NAMESPACE } = {}) {
  const hasPreferences = Boolean(
    Preferences
    && typeof Preferences.get === "function"
    && typeof Preferences.set === "function"
    && typeof Preferences.remove === "function"
  );
  const hasLocalStorage = Boolean(
    localStorage
    && typeof localStorage.getItem === "function"
    && typeof localStorage.setItem === "function"
    && typeof localStorage.removeItem === "function"
  );
  const hasSecureStorage = Boolean(
    SecureStorage
    && typeof SecureStorage.get === "function"
    && typeof SecureStorage.set === "function"
    && typeof SecureStorage.remove === "function"
  );

  function assertAllowedKey(key) {
    if (typeof key !== "string" || !key.trim()) throw new TypeError("Storage key must be a non-empty string");
    if (isForbiddenStorageKey(key)) {
      throw new Error("Seed phrases, recovery phrases, and private keys must never be stored");
    }
  }

  function requireBackend(sensitive) {
    if (sensitive && hasSecureStorage) return "secureStorage";
    if (sensitive) throw new Error("Sensitive values require an encrypted native storage plugin");
    if (hasPreferences) return "preferences";
    if (hasLocalStorage) return "localStorage";
    throw new Error("No key-value storage backend is available");
  }

  return Object.freeze({
    backend: hasPreferences ? "preferences" : hasLocalStorage ? "localStorage-cache" : "unavailable",
    secureBackend: hasSecureStorage ? "secureStorage" : "unavailable",

    async get(key, { sensitive = false } = {}) {
      assertAllowedKey(key);
      const backend = requireBackend(sensitive);
      if (backend === "secureStorage") {
        const result = await SecureStorage.get({ key: storageKey(namespace, key) });
        return result?.value ?? null;
      }
      if (backend === "preferences") {
        const result = await Preferences.get({ key: storageKey(namespace, key) });
        return result?.value ?? null;
      }
      return localStorage.getItem(storageKey(namespace, key));
    },

    async set(key, value, { sensitive = false } = {}) {
      assertAllowedKey(key);
      if (typeof value !== "string") throw new TypeError("Storage values must be strings");
      const backend = requireBackend(sensitive);
      if (backend === "secureStorage") {
        await SecureStorage.set({ key: storageKey(namespace, key), value });
      } else if (backend === "preferences") {
        await Preferences.set({ key: storageKey(namespace, key), value });
      } else {
        localStorage.setItem(storageKey(namespace, key), value);
      }
      return { backend, stored: true };
    },

    async remove(key, { sensitive = false } = {}) {
      assertAllowedKey(key);
      const backend = requireBackend(sensitive);
      if (backend === "secureStorage") {
        await SecureStorage.remove({ key: storageKey(namespace, key) });
      } else if (backend === "preferences") {
        await Preferences.remove({ key: storageKey(namespace, key) });
      } else {
        localStorage.removeItem(storageKey(namespace, key));
      }
      return { backend, removed: true };
    }
  });
}

export function createMobileRuntime(options = {}) {
  const scope = getGlobalObject(options.globalObject);
  const capacitor = options.capacitor || scope.Capacitor;
  const plugins = options.plugins || {};
  const environment = detectMobileEnvironment({ ...scope, Capacitor: capacitor });
  const App = getPlugin(capacitor, "App", plugins);
  const Network = getPlugin(capacitor, "Network", plugins);
  const Preferences = getPlugin(capacitor, "Preferences", plugins);
  const SecureStorage = getPlugin(capacitor, "SecureStorage", plugins);
  const Clipboard = getPlugin(capacitor, "Clipboard", plugins);
  const Share = getPlugin(capacitor, "Share", plugins);
  const Browser = getPlugin(capacitor, "Browser", plugins);
  const PushNotifications = getPlugin(capacitor, "PushNotifications", plugins);
  const localStorage = options.localStorage === undefined ? scope.localStorage : options.localStorage;
  const navigatorObject = options.navigator === undefined ? scope.navigator : options.navigator;
  const listenerHandles = [];
  const callbacks = {
    back: new Set(),
    url: new Set(),
    network: new Set(),
    appState: new Set(),
    notificationRegistration: new Set(),
    notificationError: new Set(),
    notificationReceived: new Set(),
    notificationAction: new Set()
  };
  let started = false;

  const storage = createKeyValueStore({
    Preferences,
    SecureStorage,
    localStorage,
    namespace: options.namespace || DEFAULT_NAMESPACE
  });

  function subscribe(type, callback) {
    if (typeof callback !== "function") throw new TypeError(`${type} callback must be a function`);
    callbacks[type].add(callback);
    return () => callbacks[type].delete(callback);
  }

  function emit(type, payload) {
    for (const callback of callbacks[type]) callback(payload);
  }

  function addPluginListener(plugin, eventName, handler) {
    if (typeof plugin?.addListener !== "function") return false;
    listenerHandles.push(plugin.addListener(eventName, handler));
    return true;
  }

  function addBrowserListener(target, eventName, handler) {
    if (typeof target?.addEventListener !== "function") return false;
    target.addEventListener(eventName, handler);
    listenerHandles.push({ remove: () => target.removeEventListener(eventName, handler) });
    return true;
  }

  async function start() {
    if (started) return { started: true, alreadyStarted: true };
    started = true;

    addPluginListener(App, "backButton", event => {
      const context = {
        canGoBack: Boolean(event?.canGoBack),
        modalOpen: Boolean(options.isModalOpen?.()),
        atRoot: Boolean(options.isAtRoot?.())
      };
      const action = resolveBackButtonAction(context);
      emit("back", { action, context, event });
      if (action === "close-modal") options.closeModal?.();
      else if (action === "navigate-back") options.navigateBack?.();
      else if (typeof options.backgroundApp === "function") options.backgroundApp();
      else App?.minimizeApp?.();
    });

    addPluginListener(App, "appUrlOpen", event => {
      const parsed = normalizeAppUrl(event?.url);
      if (parsed && isAllowedDeepLink(parsed)) emit("url", parsed);
    });
    addPluginListener(App, "appStateChange", event => emit("appState", { active: Boolean(event?.isActive) }));
    addPluginListener(Network, "networkStatusChange", status => emit("network", {
      connected: Boolean(status?.connected),
      connectionType: status?.connectionType || "unknown"
    }));
    addPluginListener(PushNotifications, "registration", token => emit("notificationRegistration", token));
    addPluginListener(PushNotifications, "registrationError", error => emit("notificationError", error));
    addPluginListener(PushNotifications, "pushNotificationReceived", notification => emit("notificationReceived", notification));
    addPluginListener(PushNotifications, "pushNotificationActionPerformed", action => emit("notificationAction", action));

    if (!environment.native) {
      const emitBrowserNetwork = () => emit("network", {
        connected: typeof navigatorObject?.onLine === "boolean" ? navigatorObject.onLine : true,
        connectionType: "unknown"
      });
      const emitBrowserState = () => emit("appState", {
        active: scope.document?.visibilityState !== "hidden"
      });
      const emitBrowserUrl = () => {
        const parsed = normalizeAppUrl(scope.location?.href);
        if (parsed) emit("url", parsed);
      };
      addBrowserListener(scope, "online", emitBrowserNetwork);
      addBrowserListener(scope, "offline", emitBrowserNetwork);
      addBrowserListener(scope, "popstate", emitBrowserUrl);
      addBrowserListener(scope, "hashchange", emitBrowserUrl);
      addBrowserListener(scope.document, "visibilitychange", emitBrowserState);
    }

    if (typeof Network?.getStatus === "function") {
      const status = await Network.getStatus();
      emit("network", { connected: Boolean(status?.connected), connectionType: status?.connectionType || "unknown" });
    } else if (typeof navigatorObject?.onLine === "boolean") {
      emit("network", { connected: navigatorObject.onLine, connectionType: "unknown" });
    }

    if (typeof App?.getState === "function") {
      const state = await App.getState();
      emit("appState", { active: Boolean(state?.isActive) });
    }

    return { started: true, environment };
  }

  async function stop() {
    const handles = listenerHandles.splice(0);
    await Promise.all(handles.map(removeListener));
    started = false;
    return { stopped: true };
  }

  async function writeClipboard(text) {
    if (typeof text !== "string") throw new TypeError("Clipboard text must be a string");
    if (typeof Clipboard?.write === "function") {
      await Clipboard.write({ string: text });
      return { supported: true, native: true };
    }
    if (typeof navigatorObject?.clipboard?.writeText === "function") {
      await navigatorObject.clipboard.writeText(text);
      return { supported: true, native: false };
    }
    return unsupported("clipboard-write");
  }

  async function readClipboard() {
    if (typeof Clipboard?.read === "function") {
      const result = await Clipboard.read();
      return { supported: true, native: true, value: result?.value ?? result?.string ?? "" };
    }
    if (typeof navigatorObject?.clipboard?.readText === "function") {
      return { supported: true, native: false, value: await navigatorObject.clipboard.readText() };
    }
    return unsupported("clipboard-read");
  }

  async function share(content) {
    const payload = typeof content === "string" ? { text: content } : { ...content };
    if (typeof Share?.share === "function") {
      const result = await Share.share(payload);
      return { supported: true, native: true, result };
    }
    if (typeof navigatorObject?.share === "function") {
      await navigatorObject.share(payload);
      return { supported: true, native: false };
    }
    return unsupported("share");
  }

  async function openExternalLink(value) {
    const parsed = normalizeAppUrl(value);
    if (!parsed || parsed.protocol !== "https:") throw new Error("Only valid HTTPS links may be opened");
    if (typeof Browser?.open === "function") {
      await Browser.open({ url: parsed.url });
      return { supported: true, native: true };
    }
    if (typeof scope.open === "function") {
      scope.open(parsed.url, "_blank", "noopener,noreferrer");
      return { supported: true, native: false };
    }
    return unsupported("open-link");
  }

  async function getNotificationPermission() {
    if (typeof PushNotifications?.checkPermissions !== "function") return unsupported("push-notifications");
    const result = await PushNotifications.checkPermissions();
    return { supported: true, state: normalizePermissionState(result), raw: result };
  }

  async function requestNotificationPermission() {
    if (typeof PushNotifications?.requestPermissions !== "function") return unsupported("push-notifications");
    const result = await PushNotifications.requestPermissions();
    return { supported: true, state: normalizePermissionState(result), raw: result };
  }

  async function registerNotifications() {
    if (typeof PushNotifications?.register !== "function") return unsupported("push-notifications");
    const permission = await getNotificationPermission();
    if (permission.state !== "granted") return { supported: true, registered: false, permission: permission.state };
    await PushNotifications.register();
    return { supported: true, registered: true, permission: "granted" };
  }

  return Object.freeze({
    environment,
    isNative: environment.native,
    isAndroid: environment.android,
    platform: environment.platform,
    storage,
    start,
    stop,
    onBackButton: callback => subscribe("back", callback),
    onAppUrl: callback => subscribe("url", callback),
    onNetworkChange: callback => subscribe("network", callback),
    onAppStateChange: callback => subscribe("appState", callback),
    onNotificationRegistration: callback => subscribe("notificationRegistration", callback),
    onNotificationError: callback => subscribe("notificationError", callback),
    onNotificationReceived: callback => subscribe("notificationReceived", callback),
    onNotificationAction: callback => subscribe("notificationAction", callback),
    writeClipboard,
    readClipboard,
    share,
    openExternalLink,
    getNotificationPermission,
    requestNotificationPermission,
    registerNotifications
  });
}

export default createMobileRuntime;
