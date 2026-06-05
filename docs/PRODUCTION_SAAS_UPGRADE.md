# AllocaFi Production SaaS Upgrade

This project is still a local prototype, but it now has a production foundation that can be connected to Supabase, Plaid, Stripe, OpenAI, and WalletConnect/Reown without tearing out the working app.

## What AllocaFi Already Has

- Local dashboard and Virtual Budget Accounts.
- Crypto wallet tracking and balance refresh.
- Phantom Solana PYUSD send flow.
- WalletConnect/Reown project ID settings.
- Address book and saved destinations.
- Budget account allocation, templates, bills planner, goals, and monthly overview.
- Local encrypted Vault export/import and auto snapshot.
- Hidden foundations for bank, family, business, rewards, AI, and admin systems.

## What Was Added In This Pass

- Account and cloud foundation panel in Settings.
- Sign up, login, logout, password reset screens.
- Supabase Auth ready API routes.
- Local preview account mode when Supabase keys are missing.
- Local data migration status after account login.
- Cloud sync queue that tracks app data changes.
- Production service status checks for Supabase, Plaid, Stripe, OpenAI, and WalletConnect.
- Backend route placeholders for the production API map.
- Environment variable template in `.env.example`.
- PostgreSQL/Supabase schema in `database/schema.sql`.

## Phase 1: Production Foundation

1. Create a Supabase project.
2. Run `database/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env`.
4. Add Supabase URL, anon key, service role key, and database URL.
5. Restart the local server.
6. Test Settings -> Account & cloud foundation -> Refresh service status.

Local storage still acts as the browser cache. Once Supabase is connected, the account sync route is the place to persist user snapshots and then gradually replace each localStorage save path with database reads and writes.

## Phase 2: Account Connections

Plaid, WalletConnect/Reown, Phantom, MetaMask, Coinbase Wallet, and Trust Wallet stay separated by custody boundary:

- Plaid is for bank balances and transactions only.
- Crypto wallets remain non-custodial.
- Wallets sign transactions directly.
- AllocaFi never stores private keys or seed phrases.

## Phase 3: Paid Plans

Stripe plan names:

- Free: one crypto wallet, basic budget accounts, manual tracking.
- Plus: multiple wallets, bank connection, monthly budget, AI insights.
- Family: shared dashboards, family goals, privacy controls.
- Business: tax budget account, vendor tracking, reports, exports.

## Security Rules

- Never store crypto private keys.
- Never store seed phrases.
- Never move user funds directly.
- Never expose Plaid access tokens to the frontend.
- Encrypt Plaid access tokens before database storage.
- Use server-side route handlers for Supabase service role, Plaid, Stripe, and OpenAI keys.
- Keep the Vault system for portable encrypted backups.

## Production Readiness Notes

The current server returns `501 blueprint-ready` for API routes that are mapped but not yet connected to real services. That is intentional. It lets the frontend and roadmap see the production shape without pretending the app is live.

The next real build step is connecting Supabase persistence for:

- wallets
- budget_accounts
- transactions
- bills
- goals
- address book
- vault snapshot metadata
