# Build AllocaFi APK

## Installed toolchain

- Node.js 22 or newer and pnpm
- Microsoft OpenJDK 21
- Android Studio with Android SDK 36

## Build steps

From the project root:

```powershell
pnpm install
pnpm run android:sync
pnpm run test:android
cd android
.\gradlew.bat assembleDebug
```

The generated debug APK is located at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

The verified local test build is also copied to:

```text
artifacts/android/allocafi-debug.apk
```

Android Studio may be opened with `pnpm run android:open`. The `android/` project is already generated and must not be recreated with `cap add`.

## Send to phone without USB

Move the APK to the phone using OneDrive, Google Drive, email, or another trusted file-transfer method.

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
