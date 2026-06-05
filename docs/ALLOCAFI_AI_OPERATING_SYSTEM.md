# AllocaFi AI Operating System

AllocaFi AI is a premium, rule-first AI layer for budgeting help, reports, visual customization, and protected account guidance.

## Core Security Model

- All AI requests pass through the AI Security Classifier before execution.
- Built-in rules run before any external AI provider call.
- External provider calls stay server-side and use `OPENAI_API_KEY`; no API key is exposed to the frontend.
- All AI suggestions that could change app data are suggestion-only until the user confirms.
- AllocaFi AI cannot directly modify wallet balances, blockchain data, ALFI credit balances, premium status, transaction history, tax records, admin roles, payment records, audit logs, or security rules.
- Admin AI analytics storage is separate from user Vault data.

## AI Pipeline

Prompt -> Security Classifier -> Rule Engine -> Permission Check -> ALFI Credit Check -> Optional AI Provider -> Response -> Audit Log.

## User Features

- Chat-style AllocaFi AI interface.
- Budget education and setup suggestions.
- Rule-based templates for trucking, 50/30/20, emergency fund, family, and business budgets.
- Report prompts for spending, bucket usage, monthly budget, tax categories, family, and business expenses.
- Visual skin and image generation guardrails.
- ALFI auto-spend, daily, and weekly limits.

## Admin Features

- AI usage today, week, and month.
- ALFI consumed, estimated AI cost, revenue, net profit, and rule savings.
- Most expensive users and prompt types.
- Admin AI analytics chatbot.
- ALFI pricing manager with reason-note audit logging.
- Prompt optimization and rule conversion suggestions.

## Vault Export Security

AllocaFi Vault exports are separated from AI Admin analytics. Before export:

1. User connects Primary Membership Wallet.
2. Wallet must match the Vault owner wallet.
3. User signs a free cryptographic message.
4. Server verifies the signature.
5. Export request is audit logged.
6. Export package is created with an expiration time.

Wallet address alone never unlocks private financial data.

## New Environment Variables

- `OPENAI_API_KEY`: optional server-side AI provider key.
- `OPENAI_MODEL`: optional model override, defaults to `gpt-4.1`.
- `ALFI_REVENUE_USD`: estimated revenue value per ALFI credit, defaults to `0.05`.
- `ALLOCAFI_AI_CONFIRMATION_THRESHOLD`: ALFI threshold requiring explicit confirmation, defaults to `10`.