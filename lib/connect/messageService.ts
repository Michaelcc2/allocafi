export async function createConversation() {
  throw new Error("Create conversations only between verified Connect identities.");
}

export async function sendMessage() {
  throw new Error("Messages must be encrypted before persistence and never logged as plaintext.");
}

export async function fetchConversation() {
  throw new Error("Users may only fetch conversations where they are participants.");
}

export async function fetchInbox() {
  throw new Error("Inbox queries must be scoped by verified user identity.");
}

export async function markMessageRead() {
  throw new Error("Read status updates must be participant-scoped.");
}

export async function deleteMessageLocal() {
  throw new Error("Local deletes should not imply deletion for the other participant.");
}
