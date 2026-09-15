# Allocafi Launch Runbook

This is the launch checklist for moving Allocafi to Render, connecting Supabase
auth/storage, and attaching `allocafi.com`.

## Current repo status

- Render service blueprint: `render.yaml`
- Node start command: `npm start`
- Build command: `npm install && npm test && npm run build`
- Health check: `/api/health`
- Production host binding: `0.0.0.0` when `NODE_ENV=production`
- Account storage migration: `database/migrations/20260905_account_snapshots.sql`
- Account setup details: `database/ACCOUNT_SETUP.md`

## Decisions before touching external accounts

- Domain: use `allocafi.com` if available. If the registrar shows it as unavailable
  or premium-priced, decide before buying an alternate spelling.
- DNS provider: Cloudflare is preferred because it supports apex CNAME flattening
  and makes Render DNS simpler.
- Render plan: keep `allocafi-web` on Free for preview if possible; upgrade only
  if sleep/cold starts or resource limits hurt the launch experience.
- Kali Trader: suspend or scale down the Render service first. Do not delete it
  until its GitHub repo, environment variables, database, and exports are backed
  up.

## Step 1: Back up Kali Trader before reducing Render usage

1. Confirm the Kali Trader GitHub repo has the latest committed code.
2. Export or document its Render environment variables.
3. Export any attached database or persistent disk data.
4. In Render, suspend the Kali Trader service or scale it to the lowest safe
   plan. Prefer suspend/scale-down over deletion.

This frees Render usage while keeping recovery possible.

## Step 2: Supabase project

Use an existing Supabase project only if it is cleanly separable from other
apps. A dedicated `allocafi-prod` Supabase project is safer for launch.

1. Create or select the Supabase project.
2. Enable email/password auth.
3. Require email confirmation.
4. Set the production Site URL to:
   `https://allocafi.com`
5. Add redirect URLs:
   `https://allocafi.com/**`
   `https://www.allocafi.com/**`
   `http://127.0.0.1:8765/**`
6. Run `database/migrations/20260905_account_snapshots.sql` in the SQL editor.
7. Copy only these public/project values into Render:
   `SUPABASE_URL`
   `SUPABASE_ANON_KEY`

Do not put a service-role key in the browser or in public client config.

## Step 3: Render web service

1. Connect this GitHub repo in Render.
2. Use the existing `render.yaml` blueprint or create a Node web service with:
   build command: `npm install && npm test && npm run build`
   start command: `npm start`
   health check path: `/api/health`
3. Set environment variables:
   `NODE_ENV=production`
   `ALLOCAFI_PUBLIC_ORIGIN=https://allocafi.com`
   `SUPABASE_URL=<your Supabase project URL>`
   `SUPABASE_ANON_KEY=<your Supabase anon key>`
4. Optional launch variables:
   `SOLANA_RPC_URL`
   `HELIUS_API_KEY`
   `WALLETCONNECT_PROJECT_ID`
   `OPENAI_API_KEY`
   `PLAID_CLIENT_ID`
   `PLAID_SECRET`
   `PLAID_ENV=sandbox`
5. Deploy and confirm `/api/health` returns `ok: true`.

## Step 4: Domain and DNS

1. Buy `allocafi.com` if available and acceptable in price.
2. Add `allocafi.com` or `www.allocafi.com` to the Render service under Custom
   Domains.
3. Configure DNS at the registrar/DNS provider using the records Render shows.
4. Remove any `AAAA` records while configuring Render, because Render custom
   domains use IPv4 routing.
5. Verify the domain in Render.
6. Confirm Render issues TLS and redirects HTTP to HTTPS.

## Step 5: Creator account verification

1. Go to `https://allocafi.com`.
2. Create/log in with `cobinsrn@gmail.com`.
3. Confirm the email through Supabase.
4. Verify Settings shows creator access.
5. Confirm this account can create more than three budget accounts without Core.
6. Confirm a non-creator test account stays on the Free limit.

Creator access is tied to a verified `cobinsrn@gmail.com` Supabase identity.
The master wallet `CkSczF3MMJcjNU7XzhXqQEr7mrv7xmroAT95JBpT2gGB` is recorded
for creator identity context, but knowing the wallet address does not grant
creator access.

## Step 6: Smoke tests after launch

- Create account
- Log out
- Log back in
- Confirm wallets and budget accounts restore
- Add a wallet address
- Create more than three budget accounts with the creator email
- Refresh wallet balance
- Run `/api/config/status` and confirm auth/database are true
- Test password reset email
- Test mobile layout for Accounts 2.0 before announcing launch

## Actions that require account owner handoff

- Buying the domain
- Entering payment details
- Disabling/suspending the Kali Trader Render service
- Adding Render custom domains
- Applying DNS records in the domain provider
- Creating/copying Supabase project keys
- Running the Supabase SQL migration

