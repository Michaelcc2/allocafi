# Security Messaging Guardrails

## Public Security Goal

Explain why AllocaFi is safer and more trustworthy without publishing details that help attackers.

## Approved Public Language

- AllocaFi is non-custodial.
- AllocaFi never stores private keys, seed phrases, or recovery phrases.
- Wallet signatures are used to verify ownership for sensitive actions.
- Transaction approvals happen in the user's external wallet.
- Vault exports require verified wallet ownership.
- Admin analytics should remain separate from private user Vault data.
- AllocaFi records financial organization metadata and reports; it does not take custody of funds.

## Avoid Publishing

- Exact internal encryption workflow details beyond high-level user value.
- API route maps intended only for internal engineering.
- Rate limits, detection thresholds, or abuse rules.
- Internal admin workflows.
- Recovery bypass assumptions.
- Penetration testing details.
- Database table exposure details that are not necessary for public docs.
- Exact examples of blocked exploit attempts.

## Safe Security Copy Examples

### Short

"AllocaFi helps organize wallet-based finances without taking custody of your crypto. You keep your wallet. AllocaFi never asks for your private keys or seed phrase."

### Medium

"Sensitive actions use wallet ownership verification. When AllocaFi asks for a verification signature, no funds move. Actual transactions still require approval inside your external wallet."

### Vault

"AllocaFi Vault protects user-owned app data and export records. Sensitive exports require verified wallet ownership so a wallet address alone cannot unlock private financial records."

## Unsafe Security Copy Examples

Do not say:

- "AllocaFi is unhackable."
- "Nobody can ever access anything."
- "We can recover your crypto if your wallet is lost."
- "Our encryption works by [detailed internal design]."
- "Here are the exact rules attackers must bypass."

## Marketing Review Rule

Any ad or public page mentioning security must answer:

1. Is the claim true?
2. Is the wording understandable?
3. Does it avoid technical attack details?
4. Does it avoid guarantees?
5. Did Security review it?
