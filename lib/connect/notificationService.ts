export async function createNotification() {
  throw new Error("MVP notifications are in-app only; push notifications require a future provider.");
}

export async function markNotificationRead() {
  throw new Error("Notification updates must be user-scoped.");
}

export async function subscribeToNotifications() {
  throw new Error("Realtime subscriptions should use Supabase Realtime or WebSocket channels.");
}
