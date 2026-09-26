# AllocaFi Android Testing

This guide covers development and release-candidate testing through real-device and Google Play internal/closed testing. It does not authorize store publication.

## Readiness gate

Run the static Android security gate before opening Android Studio:

```bash
node tests/android-readiness.test.mjs
```

The gate fails closed when the generated Android project, production App Link allowlist, cleartext policy, secure runtime flags, launcher assets, splash assets, or bundled web entry point are missing. It also protects the non-custodial boundary, user/session isolation, Accounts 2.0 markers, and the disabled Family/Business release surface.

## Workstation setup

Install Node.js 20 or newer, Android Studio, the Android SDK and platform tools, and a supported JDK. In Android Studio, install at least one current stable Android SDK plus an emulator image with Google Play services.

Create or refresh the native project only after the Capacitor configuration is release-ready:

```bash
npm install
npm run cap:add:android
npm run cap:sync
npm run cap:open:android
```

After every web change, run `npm run cap:sync`, rerun the readiness gate, and rebuild the Android app. Do not manually edit generated web files under `android/app/src/main/assets/public`; update the web source and sync it.

## Required device matrix

| Target | Minimum coverage | Purpose |
| --- | --- | --- |
| Small phone emulator | Current minimum supported Android API, 360 x 640 class viewport | Overflow, keyboard, onboarding, and compact Accounts 2.0 |
| Standard phone emulator | Current stable Android API, Pixel-class profile | Primary regression pass |
| Large phone emulator | Current stable API, 412 x 915 class viewport | Large text, dialogs, allocation sheets |
| Tablet emulator | Current stable API, portrait and landscape | Responsive navigation and multi-column layouts |
| Older physical phone | Minimum supported API where available | WebView compatibility and constrained performance |
| Current physical phone | Current Android release | Biometrics/device policies, wallet handoff, notifications, and real network behavior |

Test normal text and at least 200% font/display scaling. Test gesture and three-button navigation. Record Android version, WebView version, model, build SHA, and result for every release candidate.

## Core regression pass

1. Create an account, confirm the password, show/hide the password, verify email, log in, log out, and log back in.
2. Confirm a different account cannot see the previous account's wallets, goals, address book, local cache, or cloud snapshot.
3. Force session expiry and verify refresh succeeds or the user is returned to login without losing queued changes.
4. Add only public wallet addresses. Verify no workflow asks for or accepts a seed phrase, private key, recovery phrase, or signing authority.
5. Add supported USDC, USDT, and PYUSD addresses and verify network-specific balances and error states.
6. Add a wallet with an existing balance and confirm only one initial allocation prompt appears.
7. Simulate a later deposit and confirm the auto-allocation workflow runs without showing the initial prompt again.
8. Exercise Accounts 2.0 search, sort, add/edit/remove budget accounts, free three-account limit, creator entitlement, scrolling, and high-value balance layouts.
9. Confirm Family and Business are absent from Android primary navigation, deep links, and purchasable release paths.
10. Confirm wallet sends require external wallet review and approval. Cancel in the wallet and verify AllocaFi records no successful send.

## Lifecycle and resilience

- **Slow network:** throttle to high latency and low bandwidth. Verify loading indicators, disabled duplicate actions, timeouts, retry copy, and queued saves.
- **Offline start:** launch in airplane mode. Verify cached data is identified as local/stale and no false zero balance replaces the last known balance.
- **Offline transition:** disconnect during login, balance refresh, snapshot save, and wallet handoff. Restore connectivity and verify safe retry without duplication.
- **Process death:** background the app, terminate it from Android Studio, and relaunch. Verify authenticated restoration or a clean login prompt and correct account workspace.
- **Rotation:** rotate during onboarding, password entry, wallet creation, allocation, dialogs, and Accounts 2.0 scrolling. Verify no duplicate submit and no lost state.
- **Background/foreground:** leave the app for 1 minute, 15 minutes, and beyond session expiry. Verify sensitive screens are protected in recents and stale sessions revalidate.
- **Back navigation:** test Android back from every modal, nested screen, wallet handoff, deep link, and onboarding step. It must never exit through a destructive action without warning.
- **Update install:** install a newer release candidate over the prior internal build. Verify account isolation, migrations, and local recovery data remain valid.

## Security checks

Verify release builds have WebView debugging disabled, reject cleartext HTTP, disallow Android backup of local financial data, use `FLAG_SECURE` for sensitive content, and contain no API secrets. App Links must be verified HTTPS links and must allowlist only the production host. Reject wildcard hosts, arbitrary redirect URLs, and Family/Business routes.

Inspect the release bundle with Android Studio's APK Analyzer. Search strings and resources for Supabase service-role keys, private keys, seed phrases, test credentials, localhost URLs, cleartext endpoints, and debug-only server URLs. A Supabase publishable/anon key may be public, but authorization must still be enforced by RLS and the backend.

## Wallet and PYUSD notes

Use matching networks. Ethereum PYUSD sends only to Ethereum PYUSD addresses; Solana PYUSD sends only to Solana PYUSD addresses. WalletConnect handoff must return to the same pending action and require explicit wallet approval. Solana balance tracking and any Solana send implementation must be tested independently; balance-read support does not prove send support.

## Evidence

For each candidate, save the static gate output, unit-test output, Gradle test/build output, emulator screenshots, device matrix, network/lifecycle results, and any crash logs. Use the release checklist in `docs/ANDROID_RELEASE_CHECKLIST.md` as the sign-off record.
