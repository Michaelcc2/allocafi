export async function createConnectProfile() {
  throw new Error("Profile persistence is handled by the app/local beta now and Supabase RLS in production.");
}

export async function verifyWalletSignature() {
  throw new Error("Wallet signatures must verify ownership without moving funds or granting approvals.");
}

export async function updateUsername() {
  throw new Error("Username uniqueness should be enforced server-side in production.");
}

export async function getProfileByWallet() {
  throw new Error("Lookup must only expose public Connect profile metadata.");
}

export async function getProfileByUsername() {
  throw new Error("Lookup must only expose public Connect profile metadata.");
}
