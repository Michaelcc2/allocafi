export async function sendContactRequest() {
  throw new Error("Contact requests require verified sender identity.");
}

export async function acceptContactRequest() {
  throw new Error("Accepting a contact request must update both participant views.");
}

export async function declineContactRequest() {
  throw new Error("Declines should not expose private user data.");
}

export async function removeContact() {
  throw new Error("Contact removal is local unless both sides agree to shared cleanup.");
}

export async function blockContact() {
  throw new Error("Blocked contacts must not create new conversations or call invites.");
}
