# AllocaFi MVP Architecture And Security Audit

## Current MVP

AllocaFi is a vanilla HTML/CSS/JavaScript single page app served by a local Node server. The working product is still non-custodial: it reads public wallet data, lets users organize balances into Virtual Bucket Accounts, and sends only through external wallet approval.

Current user-facing areas:

- Overview
- Wallets
- Virtual Bucket Accounts
- Goals
- Activity and address book
- Vault
- Settings

Current infrastructure areas that should stay in Settings or backend/admin space:

- Account and cloud foundation
- WalletConnect/Reown Project ID
- Solana RPC provider
- Vault memory/backup controls
- Admin controls
- Bank, family, business, rewards, and AI foundations

## Data Flow

1. User adds a public wallet address.
2. App reads public wallet/token balances from supported providers.
3. User creates or auto-generates Virtual Bucket Accounts.
4. User records spending or sends through a connected wallet.
5. App updates local virtual balances.
6. App can export encrypted Vault backups.
7. Cloud sync currently queues data locally until Supabase persistence is connected.

## Key Risks Found

| Area | Risk | Fix |
|---|---|---|
| Solana proxy | Prototype accepted arbitrary HTTPS endpoints | Strict host allowlist |
| TLS | Local proxy disabled certificate verification | Production TLS verification enforced |
| Vault auto snapshot | Password could be stored in localStorage | Password now kept in session memory only |
| CORS | Wildcard origin | Restricted local origin |
| Security headers | Missing CSP and browser hardening headers | Added CSP, frame, nosniff, referrer, permissions headers |
| API abuse | No rate limiting | Added local in-memory rate limit |
| Imports | Backup/Vault validation too loose | Added file size checks and forbidden secret-field validation |
| Architecture | Large app.js monolith | Add tests now, modular migration later |

## Target Architecture

```text
AllocaFi Web / Capacitor Mobile
  -> Settings and Security Center
  -> API Gateway
    -> Auth
    -> Wallet metadata
    -> Buckets
    -> Transactions
    -> Vault
    -> AI insights
    -> Bank provider
    -> Audit logs
  -> Security Layer
    -> Validation
    -> Redaction
    -> Rate limits
    -> CSP
    -> RLS
  -> PostgreSQL / Supabase
  -> Workers
    -> AI insights
    -> Category learning
    -> Vault health checks
    -> Reports
```

## AI Design

AI belongs behind backend routes only. The browser should not call OpenAI directly.

AI modules:

- AI Gateway
- Redaction layer
- Budget insight engine
- Category suggestion engine
- Vault intelligence
- Family finance assistant
- Business finance assistant
- Support assistant
- AI cost tracker
- AI eval tests

Sensitive data should be summarized or redacted before AI calls. AI should never receive private keys, seed phrases, Plaid tokens, raw Vault files, or wallet signing authority.

## Acceptance Criteria For Current Hardening Pass

- App still loads locally.
- Existing dashboard, wallets, buckets, Vault, and send flows remain intact.
- Solana proxy cannot be used as an open proxy.
- Production TLS verification is not disabled.
- Vault auto snapshot password is not stored in localStorage.
- Import/restore rejects obviously unsafe files.
- Database schema includes the requested production tables.
- Basic tests pass.
