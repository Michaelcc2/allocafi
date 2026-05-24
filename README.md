# AllocaFi

AllocaFi is a non-custodial crypto budgeting web app built around Virtual Bucket Accounts.

The app helps users organize public wallet balances into purpose-based accounts such as Bills, Food, Gas, Savings, Personal, Emergency Fund, and Goals without giving up custody of funds.

## Current MVP Capabilities

- Add public wallet addresses.
- Read supported wallet balances.
- Track Solana PYUSD with a configured Solana RPC provider.
- Connect Phantom for Solana wallet signing.
- Send from a selected Virtual Bucket Account through the connected wallet.
- Record bucket spending after wallet-signed sends.
- Create and rebalance Virtual Bucket Accounts.
- Use allocation templates.
- Manage bills, goals, saved recipients, and local transaction activity.
- Export and import encrypted AllocaFi Vault backups.
- Use local AI budget insights and optional backend OpenAI insights.
- Prepare for Render deployment.

## Product Rules

AllocaFi is non-custodial.

The app does not:

- Store private keys.
- Store seed phrases.
- Custody funds.
- Move crypto without wallet approval.

Wallet providers such as Phantom, Trust Wallet, MetaMask, Coinbase Wallet, and WalletConnect-compatible wallets are responsible for signing transactions.

AllocaFi organizes, tracks, budgets, and records activity.

## Local Development

Install dependencies:

```bash
npm install
```

Run the local app:

```bash
npm start
```

Open:

```txt
http://127.0.0.1:8765/index.html
```

Run checks:

```bash
npm test
npm run build
```

## Render Deployment

This project includes `render.yaml`.

See:

```txt
docs/RENDER_DEPLOYMENT.md
```

Important Render environment variables for live testing:

```txt
NODE_ENV=production
ALLOCAFI_PUBLIC_ORIGIN=https://your-render-app-name.onrender.com
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your_key
OPENAI_API_KEY=optional
WALLETCONNECT_PROJECT_ID=optional
```

## Data Storage

Current MVP data is browser-local using localStorage and encrypted Vault backups.

Supabase Auth/database is planned for account-based cloud sync later.

## Future Roadmap

- Supabase Auth and PostgreSQL database.
- Plaid bank connection.
- Stripe billing.
- Family dashboard.
- Business dashboard.
- Advanced AI budget assistant.
- Tax/export tools.
- Production observability and audit logs.
