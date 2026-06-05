export type ConnectEncryptedPayload = {
  version: string;
  algorithm: string;
  iv: string;
  ciphertext: string;
  devOnly?: boolean;
};

export async function generateConversationKey(): Promise<string> {
  throw new Error("Production Connect encryption should use XMTP or an audited E2EE key exchange.");
}

export async function rotateConversationKey(): Promise<string> {
  throw new Error("Conversation key rotation requires production E2EE protocol integration.");
}

export async function encryptMessage(): Promise<ConnectEncryptedPayload> {
  throw new Error("Use the local app dev encryption only for beta previews; production should replace this with XMTP/audited E2EE.");
}

export async function decryptMessage(): Promise<string> {
  throw new Error("Decrypt only client-side for the verified message participant.");
}

export function validateEncryptedPayload(payload: Partial<ConnectEncryptedPayload>): boolean {
  return Boolean(payload?.version && payload?.algorithm && payload?.iv && payload?.ciphertext);
}
