export async function startVoiceCall() {
  throw new Error("Voice calls require verified identity, signaling, and browser WebRTC support.");
}

export async function acceptCall() {
  throw new Error("Call accept must emit a call_accept signal to the caller.");
}

export async function declineCall() {
  throw new Error("Call decline must emit a call_decline signal to the caller.");
}

export async function endCall() {
  throw new Error("Call end must close peer connections and expire signals.");
}

export async function sendWebRTCSignal() {
  throw new Error("Signals should be delivered through Supabase Realtime or WebSocket signaling.");
}

export async function subscribeToCallSignals() {
  throw new Error("Signal subscriptions must be scoped to the recipient user.");
}

export async function fetchCallHistory() {
  throw new Error("Call history queries must be user-scoped.");
}
