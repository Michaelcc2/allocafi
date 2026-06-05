# AllocaFi Project History

This file records major AllocaFi project decisions, architecture milestones, security decisions, and product direction.

## How To Use This File

Add entries in reverse chronological order.

Each entry should include:

- Date
- Decision title
- Context
- Decision made
- Systems affected
- Security impact
- QA impact
- Follow-up items

## Project History Entries

### 2026-06-01 - ADT Marketing Command Center Added

Context:
- AllocaFi needs a permanent marketing agent that can explain the project, use cases, security benefits, and real-world value without exposing details attackers could use.

Decision:
- Added the AllocaFi Top Marketing Agent, Marketing Compliance Review Agent, and Use Case Storytelling Agent to the ADT Agent Directory.
- Created `06-marketing-command-center/` as the organized home for marketing strategy, advertising copy, use cases, security-safe messaging, and review checklists.

Systems Affected:
- ADT governance documentation.
- Marketing documentation workflow.

Security Impact:
- Public security messaging now has explicit guardrails to explain non-custodial protections without publishing sensitive implementation details.

QA Impact:
- Marketing assets now require accuracy review against the actual app before public launch.

Follow-Up:
- Use `Use ADT Marketing Review` before publishing ads, landing pages, onboarding copy, launch pages, social scripts, or investor-facing product summaries.

### YYYY-MM-DD - Decision Title

Context:
- Describe the problem or opportunity.

Decision:
- Describe what was decided.

Systems Affected:
- List affected systems.

Security Impact:
- Describe security implications.

QA Impact:
- Describe testing or validation needs.

Follow-Up:
- List next actions.

## Reserved Milestones

- Non-custodial wallet foundation
- Virtual Budget Account foundation
- Virtual Asset Account foundation
- Legal Core foundation
- Tax Ledger Core foundation
- Vault foundation
- AllocaFi AI foundation
- AllocaFi AI Admin foundation
- Commerce foundation
- Family foundation
- Enterprise foundation
- Deployment readiness review
