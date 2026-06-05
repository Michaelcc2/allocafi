# AllocaFi Vault 2.0 Architecture

AllocaFi Vault 2.0 is the encrypted memory and restoration engine for the AllocaFi ecosystem. It is not a wallet, does not custody assets, and must never store private keys, seed phrases, recovery phrases, or decrypted Vault payloads.

## Security Model

- Non-custodial: crypto remains in Trust Wallet, Phantom, Coinbase Wallet, WalletConnect-compatible wallets, and future supported wallets.
- Zero-knowledge storage: Vault APIs accept encrypted ciphertext, encrypted references, and redacted manifests only.
- Owner Wallet identity: a verified Primary Owner Wallet controls Vault access, dashboard recovery, premium ownership, ALFI ownership, family/enterprise/commerce ownership, and AI asset ownership.
- Recovery wallets: optional recovery wallets are stored as verified metadata and must be approved by the Primary Owner Wallet.
- Trusted devices: verified sessions can register a device fingerprint hash. Raw device secrets are not stored.
- Signature classification: safe Vault signatures are separated from transaction or approval requests. Transaction requests receive explicit wallet safety warnings.
- Session security: Vault sessions expire after 24 hours and require a fresh wallet signature after expiration, device changes, logout, or suspicious activity.

## Data Pipeline

User activity flows through:

1. Data collection
2. Normalization
3. Compression
4. AES-256-GCM encryption
5. Owner Wallet binding
6. Device trust metadata
7. Vault snapshot creation
8. Encrypted storage

The server stores only encrypted payload references, redacted manifests, version metadata, ownership records, and audit events.

## Stored Metadata

Vault 2.0 can store recovery metadata for:

- Financial data references
- Premium/subscription records
- ALFI credit records
- AI memory summaries
- Generated AI assets
- Dashboard layouts, presets, skins, and themes
- Commerce asset references
- Family dashboard records
- Enterprise dashboard records
- Tax ledger report references

Large assets such as images, PDFs, receipts, skin packages, exports, and commerce media must live in asset storage. Vault stores encrypted asset references only.

## Production Tables

Vault 2.0 adds:

- `vault_owner_wallets`
- `vault_recovery_wallets`
- `vault_trusted_devices`
- `vault_signature_challenges`
- `vault_sessions`
- `vault_snapshots_v2`
- `vault_asset_records`
- `vault_restore_events`

All tables are RLS-enabled in `database/schema.sql`.

## API Boundary

Vault APIs:

- `GET /api/vault/architecture`
- `POST /api/vault/challenge`
- `POST /api/vault/session`
- `POST /api/vault/snapshots`
- `GET /api/vault/manifest`

`/api/vault/snapshots` rejects plaintext app data and requires a verified Vault session.

## Verification Notes

Solana Owner Wallet verification uses Ed25519 signature verification server-side. EVM Owner Wallet verification requires a production EIP-191/EIP-1271 verifier service; local preview only performs signature-format gating and labels that mode explicitly.
