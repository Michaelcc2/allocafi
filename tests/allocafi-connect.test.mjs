import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [
  app,
  styles,
  schema,
  migration,
  encryption,
  webrtc,
  profileService,
  messageService,
  callService,
  contactService,
  requestService,
  securityService,
  notificationService,
] = await Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../styles.css", import.meta.url), "utf8"),
  readFile(new URL("../database/schema.sql", import.meta.url), "utf8"),
  readFile(new URL("../database/migrations/20260601_allocafi_connect.sql", import.meta.url), "utf8"),
  readFile(new URL("../lib/connect/encryption.ts", import.meta.url), "utf8"),
  readFile(new URL("../lib/connect/webrtc.ts", import.meta.url), "utf8"),
  readFile(new URL("../lib/connect/profileService.ts", import.meta.url), "utf8"),
  readFile(new URL("../lib/connect/messageService.ts", import.meta.url), "utf8"),
  readFile(new URL("../lib/connect/callService.ts", import.meta.url), "utf8"),
  readFile(new URL("../lib/connect/contactService.ts", import.meta.url), "utf8"),
  readFile(new URL("../lib/connect/requestService.ts", import.meta.url), "utf8"),
  readFile(new URL("../lib/connect/securityService.ts", import.meta.url), "utf8"),
  readFile(new URL("../lib/connect/notificationService.ts", import.meta.url), "utf8"),
]);

assert.match(app, /data-panel="allocafi-connect"/, "AllocaFi Connect should have its own Settings Advanced Systems panel");
assert.match(app, /"allocafi-connect": \["AllocaFi Connect", "Secure wallet messaging and app-to-app calls"\]/, "Settings tile should use the approved title and subtitle");
assert.match(app, /ALLOCAFI_CONNECT_FEATURE_FLAGS = \{[\s\S]*?connect_enabled:\s*true[\s\S]*?connect_messaging_enabled:\s*true[\s\S]*?connect_voice_calls_enabled:\s*true[\s\S]*?connect_video_calls_enabled:\s*false/, "Connect feature flags should enable messaging/voice and keep video locked");
assert.match(app, /AllocaFi Connect verification: I confirm that I own this wallet address/, "Wallet identity should use a safe signature message");
assert.match(app, /This request does not authorize transactions or give AllocaFi access to my funds/, "Signature copy should make clear no funds move");
assert.match(app, /signMessage|personal_sign/, "Wallet verification should use wallet signatures");
assert.match(app, /Never share your seed phrase, private key[\s\S]{0,120}recovery phrase/, "Connect UI should warn users not to share secrets");
assert.match(app, /Sensitive security phrase detected/, "Message safety should warn on sensitive phrases");
assert.match(app, /function encryptMessage/, "Connect should encrypt messages before storage");
assert.match(app, /connect-dev-aes-gcm-v1/, "Development encryption payload should be clearly versioned");
assert.match(app, /encryptedPayload/, "Messages should store encrypted payloads");
assert.match(app, /plaintextPreviewHash/, "Message previews should use hashes instead of plaintext");
assert.doesNotMatch(app, /plaintextMessage|messagePlaintext|plainMessage/, "Connect should not introduce plaintext message storage fields");
assert.match(app, /function blockWalletAddress/, "Connect should support blocking wallet addresses");
assert.match(app, /function reportMessage/, "Connect should support suspicious message reports");
assert.match(app, /RTCPeerConnection/, "Connect should include WebRTC voice call support");
assert.match(app, /No phone numbers, SMS, carrier minutes, or emergency calling/, "Connect should stay app-to-app only");
assert.match(app, /Payment Requests|Invoice Messages|Video Calls|Vault Alerts/, "Future financial communication hooks should appear locked");
assert.match(styles, /\.allocafi-connect-route-panel/, "Connect panel styles should be scoped to its route");
assert.match(styles, /\.connect-tabs/, "Connect should render tab navigation");
assert.match(styles, /@media \(max-width: 900px\)[\s\S]*?\.connect-metric-grid/, "Connect should include responsive mobile styling");

for (const table of [
  "connect_profiles",
  "connect_conversations",
  "connect_messages",
  "connect_contacts",
  "connect_calls",
  "connect_call_signals",
  "connect_requests",
  "connect_blocked_addresses",
  "connect_reports",
  "connect_notifications",
  "connect_settings",
]) {
  assert.match(schema, new RegExp(`create table if not exists public\\.${table}`), `${table} should exist in schema`);
  assert.match(schema, new RegExp(`alter table public\\.${table} enable row level security`), `${table} should enable RLS`);
  assert.match(migration, new RegExp(`create table if not exists public\\.${table}`), `${table} should exist in Connect migration`);
}

assert.match(schema, /encrypted_payload jsonb not null/, "Connect messages should require encrypted payloads");
assert.match(schema, /verification_signature_hash text not null/, "Connect profile should store signature proof metadata");
assert.match(schema, /expires_at timestamptz not null default \(now\(\) \+ interval '5 minutes'\)/, "Call signals should expire quickly");
assert.match(schema, /video_calls_enabled boolean not null default false/, "Video calls should default off at database level");
assert.match(schema, /create index if not exists connect_messages_conversation_created_idx/, "Message query indexes should exist");
assert.match(schema, /create index if not exists connect_profiles_username_idx/, "Username search index should exist");

assert.match(encryption, /Production Connect encryption should use XMTP or an audited E2EE key exchange/, "Encryption service should reserve production XMTP/audited E2EE");
assert.match(webrtc, /TURN credentials must be fetched from a backend endpoint as short-lived credentials/, "WebRTC service should avoid frontend TURN secrets");
assert.match(profileService, /verifyWalletSignature/, "Profile service should reserve signature verification");
assert.match(messageService, /sendMessage/, "Message service should reserve send message API");
assert.match(callService, /subscribeToCallSignals/, "Call service should reserve signaling API");
assert.match(contactService, /sendContactRequest/, "Contact service should reserve contact request API");
assert.match(requestService, /payment_request_future|invoice_request_future/, "Request service should reserve future financial request hooks");
assert.match(securityService, /seed phrase|private key|recovery phrase/, "Security service should scan sensitive phrases");
assert.match(notificationService, /subscribeToNotifications/, "Notification service should reserve realtime notifications");

console.log("AllocaFi Connect checks passed");
