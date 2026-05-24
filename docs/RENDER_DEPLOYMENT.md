# AllocaFi Render Deployment Guide

This gets the current AllocaFi web app live for testing wallet reads, Solana PYUSD balance checks, Phantom send flow, Virtual Bucket Accounts, Vault export/import, and AI insights.

## What Codex Already Prepared

- `render.yaml` for Render deployment.
- `/api/health` health check.
- Production host binding for Render.
- Environment variable checklist.
- Backend Solana RPC support through `SOLANA_RPC_URL`.
- Backend OpenAI AI insights route through `OPENAI_API_KEY`.
- Local fallback AI rules if no OpenAI key is set.
- Public Reown Project ID hydration through `WALLETCONNECT_PROJECT_ID`.

## What You Need Accounts For

You still own these provider accounts and keys:

- Render: hosts the web app.
- Helius or Alchemy: reliable Solana RPC for PYUSD balance reads.
- Reown: WalletConnect Project ID.
- OpenAI: optional real AI insights.
- Supabase: later, for user login/database.
- Plaid: later, for bank account connections.

## Fastest Live Test Setup

For a live test, start with only these:

1. Render account
2. GitHub repo connected to Render
3. Helius or Alchemy Solana RPC URL
4. Optional OpenAI API key
5. Optional Reown Project ID

Supabase and Plaid can wait.

## Render Settings

Create a new Render web service from the repo.

Render should detect `render.yaml`. If you set it manually:

- Build command: `npm install && npm test && npm run build`
- Start command: `npm start`
- Health check path: `/api/health`
- Runtime: Node
- Plan: Free is fine for testing

## Required Environment Variables For Testing

Set these in Render:

```txt
NODE_ENV=production
ALLOCAFI_RATE_LIMIT=120
ALLOCAFI_PUBLIC_ORIGIN=https://your-render-app-name.onrender.com
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your_helius_key
```

Use either Helius or Alchemy for `SOLANA_RPC_URL`.

Helius example:

```txt
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your_helius_key
```

Alchemy example:

```txt
SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/your_alchemy_key
```

## Optional Environment Variables

Real AI insights:

```txt
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4.1
```

WalletConnect/Reown:

```txt
WALLETCONNECT_PROJECT_ID=your_reown_project_id
```

This value is public for wallet connection setup. AllocaFi can read it from Render and fill the app connection setting automatically.

Later Supabase:

```txt
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_database_url
```

Later Plaid:

```txt
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox
PLAID_PRODUCTS=transactions
PLAID_COUNTRY_CODES=US
```

## Testing After Deploy

After Render deploys, open:

```txt
https://your-render-app-name.onrender.com/index.html
```

Then test in this order:

1. Open Settings and check service readiness.
2. Add a Solana PYUSD public wallet address.
3. Refresh wallet balance.
4. Create/refresh Virtual Bucket Accounts.
5. Connect Phantom.
6. Use Send from a bucket with a tiny test amount.
7. Confirm the spend gets recorded.
8. Refresh AI insights if `OPENAI_API_KEY` is set.
9. Export a Vault backup.

## Important MVP Limit

Until Supabase is connected, app data is saved in the current browser using local storage and Vault backups.

That means:

- Wallet/bucket setup on your computer will not automatically appear on your phone.
- Use Vault export/import if you need to move test data between devices.
- Supabase later will make accounts sync across devices.

## Security Reminder

AllocaFi is non-custodial.

Do not add private keys, seed phrases, or recovery phrases anywhere.

Render environment variables can store service keys like RPC, OpenAI, Reown, Supabase, and Plaid keys, but the app should never store crypto private keys.
