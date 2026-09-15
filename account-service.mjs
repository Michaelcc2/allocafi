export const CREATOR_EMAIL = "cobinsrn@gmail.com";
export const CREATOR_WALLET = "CkSczF3MMJcjNU7XzhXqQEr7mrv7xmroAT95JBpT2gGB";

export function accountIdentity(user) {
  const creator = Boolean(user?.email_confirmed_at && user.email?.toLowerCase() === CREATOR_EMAIL);
  return { userId: user.id, email: user.email, provider: "supabase", creator,
    masterWallet: creator ? CREATOR_WALLET : null };
}

export function createAccountService({ env = process.env, fetcher = fetch, readBody, sendJson }) {
  const base = () => (env.SUPABASE_URL || "").replace(/\/+$/, "");
  const key = () => env.SUPABASE_ANON_KEY || "";
  const cookieOptions = `Path=/api/; HttpOnly; SameSite=Strict${env.NODE_ENV === "production" ? "; Secure" : ""}`;
  function cookies(req) {
    return Object.fromEntries((req.headers.cookie || "").split(";").map(part => {
      const index = part.indexOf("=");
      return index < 0 ? ["", ""] : [part.slice(0, index).trim(), part.slice(index + 1)];
    }));
  }
  function setSession(res, session) {
    res.setHeader("Set-Cookie", [
      `allocafi_access=${session?.access_token || ""}; ${cookieOptions}; Max-Age=${session ? session.expires_in || 3600 : 0}`,
      `allocafi_refresh=${session?.refresh_token || ""}; ${cookieOptions}; Max-Age=${session ? 2592000 : 0}`,
    ]);
  }
  async function api(path, { token = key(), method = "GET", body, prefer } = {}) {
    const response = await fetcher(`${base()}${path}`, {
      method, headers: { apikey: key(), Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(prefer ? { Prefer: prefer } : {}) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.timeout(12000),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(response.status >= 500 ? "Account service unavailable. Try again shortly." : data.msg || data.message || "Account request failed.");
      error.status = response.status;
      throw error;
    }
    return data;
  }
  async function authenticate(req, res) {
    const stored = cookies(req);
    if (stored.allocafi_access) {
      try {
        const user = await api("/auth/v1/user", { token: stored.allocafi_access });
        return { user, token: stored.allocafi_access };
      } catch (error) {
        if (![401, 403].includes(error.status)) throw error;
      }
    }
    if (stored.allocafi_refresh) {
      try {
        const session = await api("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: { refresh_token: stored.allocafi_refresh } });
        setSession(res, session);
        return { user: session.user, token: session.access_token };
      } catch (error) {
        if ([400, 401, 403].includes(error.status)) { setSession(res, null); error.status = 401; }
        throw error;
      }
    }
    const error = new Error("Please log in."); error.status = 401; throw error;
  }
  return async function handle(req, res, path) {
    res.setHeader("Cache-Control", "no-store");
    try {
      if (req.method !== "GET") {
        const origin = req.headers.origin;
        const expected = env.ALLOCAFI_PUBLIC_ORIGIN || `http://127.0.0.1:${env.PORT || 8765}`;
        if ((origin && origin !== expected) || req.headers["sec-fetch-site"] === "cross-site") {
          return sendJson(res, 403, { message: "Request origin is not allowed." });
        }
      }
      if (!base() || !key()) return sendJson(res, 503, { code: "supabase_not_configured", message: "Account service is not connected yet. Your local data is still saved on this device." });
      if (path === "/api/auth/session" && req.method === "GET") {
        const { user } = await authenticate(req, res);
        return sendJson(res, 200, { session: accountIdentity(user) });
      }
      if (path === "/api/auth/logout" && req.method === "POST") {
        const token = cookies(req).allocafi_access;
        if (token) {
          try { await api("/auth/v1/logout", { token, method: "POST" }); }
          catch (error) { if (![401, 403].includes(error.status)) throw error; }
        }
        setSession(res, null);
        return sendJson(res, 200, { ok: true });
      }
      if (["/api/auth/login", "/api/auth/signup", "/api/auth/password-reset"].includes(path) && req.method === "POST") {
        const body = await readBody(req);
        const email = String(body.email || "").trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || (path !== "/api/auth/password-reset" && (typeof body.password !== "string" || body.password.length < 8))) {
          return sendJson(res, 400, { message: "Enter a valid email and a password of at least 8 characters." });
        }
        const authPath = path.endsWith("signup") ? "/auth/v1/signup" : path.endsWith("login") ? "/auth/v1/token?grant_type=password" : "/auth/v1/recover";
        const data = await api(authPath, { method: "POST", body: { email, ...(path.endsWith("password-reset") ? {} : { password: body.password }) } });
        if (path.endsWith("password-reset")) return sendJson(res, 200, { ok: true });
        const session = data.session || data;
        if (!session.access_token) return sendJson(res, 200, { verificationRequired: true, message: "Check your email to confirm your account, then log in." });
        setSession(res, session);
        return sendJson(res, 200, { session: accountIdentity(data.user || session.user) });
      }
      if (path === "/api/sync/snapshot" && ["GET", "POST"].includes(req.method)) {
        const { user, token } = await authenticate(req, res);
        if (req.headers["x-allocafi-user"] !== user.id) {
          return sendJson(res, 409, { message: "The signed-in account changed. Reload this tab before continuing." });
        }
        const filter = `user_id=eq.${encodeURIComponent(user.id)}`;
        if (req.method === "GET") {
          const rows = await api(`/rest/v1/account_snapshots?${filter}&select=snapshot,revision`, { token });
          return sendJson(res, 200, { stored: Boolean(rows[0]), snapshot: rows[0]?.snapshot || null, revision: rows[0]?.revision || 0 });
        }
        const { snapshot, revision } = await readBody(req);
        if (!snapshot || snapshot.schemaVersion !== 1 || !Array.isArray(snapshot.wallets) || !Array.isArray(snapshot.goals) || !Array.isArray(snapshot.addressBook) || !Number.isInteger(revision) || revision < 0) {
          return sendJson(res, 400, { message: "Invalid account snapshot." });
        }
        // Persist only budget data; identity and entitlements come from verified auth.
        const clean = { schemaVersion: 1, wallets: snapshot.wallets, goals: snapshot.goals, addressBook: snapshot.addressBook, financeData: snapshot.financeData || {}, onboarding: snapshot.onboarding || null };
        const rows = await api(`/rest/v1/account_snapshots${revision ? `?${filter}&revision=eq.${revision}` : ""}`, {
          token, method: revision ? "PATCH" : "POST", prefer: "return=representation",
          body: { user_id: user.id, snapshot: clean, revision: revision + 1, updated_at: new Date().toISOString() },
        });
        if (!rows.length) return sendJson(res, 409, { message: "This account changed on another device. Reload saved data before saving again." });
        return sendJson(res, 200, { stored: true, revision: rows[0].revision });
      }
      return sendJson(res, 405, { message: "Unsupported account operation." });
    } catch (error) {
      const status = error.status || 503;
      return sendJson(res, status, { stored: false, message: status === 409 ? "This account changed on another device. Reload saved data before saving again." : error.message });
    }
  };
}
