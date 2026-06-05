export const CONNECT_REQUEST_TYPES = [
  "contact_request",
  "message_request",
  "payment_request_future",
  "invoice_request_future",
];

export async function createConnectRequest() {
  throw new Error("Requests must store encrypted payloads only.");
}

export async function updateConnectRequestStatus() {
  throw new Error("Request status changes must be scoped to sender or recipient.");
}

export async function fetchConnectRequests() {
  throw new Error("Request inbox queries must be user-scoped.");
}
