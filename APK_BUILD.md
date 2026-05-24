# Build AllocaFi APK

## What you need on the computer

1. Node.js
2. Android Studio
3. Internet access for the first `npm install`

## Build steps

Open a terminal in this folder, then run:

```bash
npm install
npm run cap:add:android
```

Then open Android Studio:

```bash
npm run cap:open:android
```

In Android Studio:

1. Wait for Gradle sync to finish.
2. Go to Build > Build Bundle(s) / APK(s) > Build APK(s).
3. When it finishes, click Locate.

The APK will usually be here:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Send to phone without USB

Upload the APK to Google Drive, OneDrive, Dropbox, or email it to yourself.

On Android:

1. Download the APK.
2. Tap it.
3. Allow Install unknown apps if prompted.
4. Install AllocaFi.

## What will work in the APK

- View the AllocaFi interface
- Add public wallet addresses
- Read supported public balances when the phone has internet
- Save named destinations such as Venmo
- Connect with WalletConnect after adding a WalletConnect Project ID
- Send EVM assets such as Ethereum PYUSD through wallet approval
- Send Solana PYUSD through a connected Solana wallet when the wallet supports Solana transaction signing

Solana PYUSD uses the Token-2022 program, so the sending wallet must support Token-2022 transfers and Solana signing through the app connection.
