# AllocaFi Digital Team Workflow

## Standard Review Process

This workflow must be used for future development when instructed to use ADT or when a task touches protected AllocaFi systems.

## 1. Task Intake

Record:

- User request
- Scope
- Out-of-scope items
- Files or systems likely affected
- Risk level
- Required agents

## 2. Constitution Check

Review `00-adt-constitution.md`.

Confirm:

- The task preserves non-custodial architecture.
- No private keys, seed phrases, or recovery phrases are requested or stored.
- Wallet actions require user signatures.
- Existing dashboard structure is preserved unless explicitly approved.
- Protected systems are identified.

## 3. Agent Review

Select the relevant AllocaFi Digital Team agents from `01-adt-agent-directory.md`.

At minimum, major tasks require:

- Product review
- Architecture review
- Security review
- QA review
- Documentation review

## 4. Architecture Review

Confirm:

- Existing framework is respected.
- No unrelated refactors are introduced.
- Data ownership boundaries are preserved.
- Admin analytics and private user data remain separated.
- AI, Vault, Legal Core, Tax Ledger, and wallet systems remain within their allowed boundaries.

## 5. Security Review

Confirm:

- No protected fields can be modified improperly.
- No wallet balance, transaction, ALFI, subscription, tax, Vault, or admin record can be bypassed.
- Signature flows clearly show safe verification vs transaction risk.
- Secrets remain server-side.
- Audit logs exist for sensitive actions.

## 6. QA Review

Confirm:

- Existing flows still work.
- New behavior has tests where relevant.
- Browser UI is verified when UI changes occur.
- Error states are handled.
- No console errors appear in tested flows.

## 7. Implementation Plan

Before building, produce:

- Summary of proposed changes
- Files expected to change
- Risks
- Tests to run
- Rollback notes if applicable

## 8. Execution

Build only what the task asks for.

Rules:

- Do not expand scope without approval.
- Do not modify protected systems without review.
- Do not change dashboard structure without approval.
- Do not alter app code for documentation-only tasks.

## 9. Verification

Run appropriate checks:

- Static checks
- Unit or security tests
- Browser verification when UI changes occur
- Documentation review when docs change

## 10. Completion Report

Every completed ADT task should report:

- What changed
- Files changed
- Security review result
- QA review result
- Tests run
- Known limitations
- Next recommended steps

## Emergency Stop Conditions

Stop and request explicit approval if a task requires:

- Storing private keys
- Storing seed phrases
- Storing recovery phrases
- Custodying funds
- Changing wallet balance logic
- Changing transaction history logic
- Changing ALFI credit balances
- Changing premium status
- Removing audit logs
- Disabling security rules
- Exporting Vault data without verified user permission
- Changing dashboard structure without approval