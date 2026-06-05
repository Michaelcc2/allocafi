# AllocaFi Digital Team Constitution

## Purpose

This constitution establishes the permanent governing rules for AllocaFi and the AllocaFi Digital Team framework.

All future planning, product design, architecture, engineering, security review, QA review, documentation, and deployment decisions must respect this constitution unless the project owner explicitly approves a change.

## Permanent Governing Rules

1. AllocaFi is non-custodial.
2. AllocaFi must never store private keys.
3. AllocaFi must never store seed phrases.
4. AllocaFi must never store recovery phrases or mnemonic phrases.
5. Wallet actions require user signatures.
6. Wallet signatures must clearly distinguish safe verification from transactions, approvals, delegations, or transfers.
7. AllocaFi must never custody user funds.
8. AllocaFi must never modify blockchain balances without explicit user wallet approval.
9. The dashboard is analytics-first.
10. Virtual Budget Accounts organize spending.
11. Virtual Asset Accounts organize wealth.
12. Legal Core validates blockchain-backed asset records.
13. Tax Ledger Core handles gain/loss and reporting records.
14. Vault protects user data and exports.
15. Vault exports require verified wallet ownership before sensitive financial data can be exported.
16. Admin analytics must remain separate from private user Vault data.
17. Security reviews are mandatory.
18. QA reviews are mandatory.
19. Existing dashboard structure must be preserved unless explicitly approved.
20. Existing architecture must be preserved unless explicitly approved.
21. Existing product behavior must not be broken by future systems.
22. AI systems may advise, classify, summarize, and suggest, but must not directly alter protected financial, wallet, subscription, admin, audit, Vault, tax, or blockchain records.

## Protected Systems

The following systems require heightened review before modification:

- Wallet connection and signature flows
- Virtual Budget Account logic
- Virtual Asset Account logic
- Balance calculation logic
- Transaction history
- Tax Ledger Core
- Legal Core
- Vault and export system
- ALFI Credit system
- Premium membership system
- Admin controls
- Audit logs
- Security rules
- Database schemas
- User identity records

## Required Review Standard

Every major change must include:

- Product review
- Architecture review
- Security review
- QA review
- Documentation review
- Completion report

## Non-Negotiable Security Position

AllocaFi exists to help users organize, understand, preserve, and recover their financial experience without taking custody of their money.

User money remains in user-controlled wallets.
User identity is controlled through verified wallet ownership.
User data is protected through Vault systems.
User exports require explicit cryptographic proof where sensitive data is involved.