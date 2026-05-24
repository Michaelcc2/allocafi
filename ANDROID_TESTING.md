# AllocaFi Android Testing

## What is ready

AllocaFi now has Capacitor project files so it can be packaged as an Android app.

The app also has a WalletConnect setup area for Trust Wallet testing:

1. Open AllocaFi.
2. Go to Settings.
3. Paste a WalletConnect Project ID.
4. Tap Save Project ID.
5. Tap Connect Wallet.
6. Approve the connection in Trust Wallet.

## Build on Windows

Install these first:

- Node.js
- Android Studio
- Android SDK tools through Android Studio

Then run:

```bash
npm install
npm run cap:add:android
npm run cap:open:android
```

Android Studio will open the Android project. Connect your Android phone with USB debugging turned on, then press Run.

## After web changes

Whenever the web app changes, run:

```bash
npm run cap:sync
```

Then run the app again from Android Studio.

## PYUSD testing notes

Use matching networks:

- Ethereum PYUSD sends only to Ethereum PYUSD addresses.
- Solana PYUSD sends only to Solana PYUSD addresses.

The current WalletConnect send flow supports EVM assets such as Ethereum PYUSD. Solana PYUSD balance tracking is available, and Solana sending should be treated as the next build step.
