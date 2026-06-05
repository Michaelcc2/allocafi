export function scanSecurityPhrases(message: string): string[] {
  const phrases = ["seed phrase", "private key", "recovery phrase", "password", "login code", "12 words", "24 words"];
  const normalized = message.toLowerCase();
  return phrases.filter((phrase) => normalized.includes(phrase));
}

export function validateSafeMessage(message: string): boolean {
  return scanSecurityPhrases(message).length === 0;
}

export async function blockWalletAddress() {
  throw new Error("Blocked wallets must not be able to send new messages or call invites.");
}

export async function unblockWalletAddress() {
  throw new Error("Unblock actions must be user-scoped.");
}

export async function reportMessage() {
  throw new Error("Reports must not expose decrypted message content to admins.");
}
