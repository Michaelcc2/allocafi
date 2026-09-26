# AllocaFi Android Platform

This directory contains the Capacitor 8 Android shell for the existing AllocaFi web application. The web deployment remains unchanged. The Android shell packages the generated `www` output and uses application ID `com.allocafi.app` with the display name `AllocaFi`.

## Current status

The native project, hardened manifest, network policy, app-link declarations, release-signing contract, adaptive launcher resources, branded splash resources, and Android 13 notification permission are present. The shell does not yet prove that authentication, cloud restore, wallet updates, notifications, or Accounts 2.0 work on a device. Those flows require the integration work listed under Blockers.

## Toolchain

- Node.js 22 or newer. Capacitor 8 does not support Node 20.
- Android Studio with JDK 21.
- Android SDK Platform 36 and matching build tools.
- A physical device or emulator running Android 7.0 (API 24) or newer.

Install dependencies and synchronize the packaged web assets:

```powershell
npm install
npm run android:sync
```

Open the generated project:

```powershell
npm run android:open
```

Useful checks:

```powershell
npm run android:doctor
npm run android:debug
```

`android:add` is only for regenerating the native project when `android/` does not exist. Normal development uses `android:sync`.

## Security baseline

- Cleartext HTTP and mixed content are disabled in Capacitor and the Android manifest.
- The network security policy trusts system certificate authorities only.
- WebView debugging and Capacitor production logging are disabled.
- Android cloud backup and device-to-device transfer are disabled for files, databases, shared preferences, external files, and WebView-backed financial workspace data.
- The generated FileProvider only exposes `shared/` under app-private files and cache storage.
- No seed phrase, wallet private key, Supabase service-role key, signing key, or signing password belongs in the Android project.

## App links and authentication callbacks

The manifest accepts HTTPS authentication links for:

- `https://allocafi-web.onrender.com/auth...`
- A future custom domain supplied through `ALLOCAFI_FUTURE_DOMAIN`; the safe default is the non-resolving `future-domain.invalid`.
- The fallback custom scheme `allocafi://auth...`.

Set the future host during Gradle configuration only after the final domain is owned:

```powershell
$env:ALLOCAFI_FUTURE_DOMAIN = "app.example.com"
```

Each HTTPS host must publish `/.well-known/assetlinks.json` containing `com.allocafi.app` and the SHA-256 fingerprint of the real Play signing certificate. An intent filter alone does not verify an Android App Link. Supabase Auth must also allow the exact callback URLs.

The installed `@capacitor/app` plugin provides `appUrlOpen`, `getLaunchUrl()`, and `backButton` hooks. The generated `BridgeActivity` retains Capacitor's normal back behavior. A future frontend adapter should:

1. Validate the scheme, host, and callback path before using an incoming URL.
2. Never log authentication query parameters or fragments.
3. Close an open modal first, navigate the web history second, and allow the default Android exit behavior when neither applies.
4. Avoid registering a `backButton` listener until all three outcomes are implemented, because an incomplete listener can trap the user in the app.

## Notifications

`POST_NOTIFICATIONS` is declared for Android 13 and newer. This declaration does not request permission or deliver notifications. Production notifications still require:

- A user-timed runtime permission request and a usable denied state.
- Firebase configuration and a non-secret `google-services.json` supplied through the release pipeline.
- Device-token registration, rotation, logout cleanup, and a backend sender.
- Notification routing that validates destinations before opening an account or allocation screen.

Do not claim notification support until these pieces are implemented and tested.

## Release signing

Release tasks fail closed when signing variables are missing. Keep the keystore outside the repository and set all four variables in the local release environment or CI secret store:

```powershell
$env:ALLOCAFI_ANDROID_KEYSTORE_FILE = "C:\secure\allocafi-release.jks"
$env:ALLOCAFI_ANDROID_KEYSTORE_PASSWORD = "<secret>"
$env:ALLOCAFI_ANDROID_KEY_ALIAS = "allocafi"
$env:ALLOCAFI_ANDROID_KEY_PASSWORD = "<secret>"
npm run android:release
```

`android/keystore.properties.example` is documentation only and contains no credential. Never commit a `.jks`, `.keystore`, password, Play upload key, or service-account JSON file.

## Brand resources

Launcher and splash PNGs are derived from `assets/allocafi-mark.svg` on a `#060815` background. Adaptive launcher icons use the dark background color plus a transparent foreground mark. Rebuild and visually inspect icons after any brand change; Android launchers apply different masks and can crop artwork outside the adaptive safe zone.

## Native API and session boundary

The packaged app runs at Capacitor's local HTTPS origin and keeps its UI/assets inside the APK. `resolveRequestUrl` sends only `/api/...` calls to `https://allocafi-web.onrender.com`. Capacitor's official native HTTP and cookie patches are enabled so the backend can retain HttpOnly access/refresh cookies without exposing Supabase tokens to JavaScript storage.

The backend accepts state-changing requests only from the deployed web origin or Capacitor's `https://localhost` origin. Cleartext traffic, arbitrary remote hosts, and wildcard native origins remain rejected. Logout still revokes the server session and clears protected cookies.

## Packaged assets

The build recursively copies the complete `assets/` directory into `www/assets` before every Capacitor sync, including onboarding, template, logo, icon, and reference artwork. Verify a cold offline launch on an emulator and physical device before release.

## Source tracking

The native Android source is versioned. Generated Gradle state, `android/local.properties`, build outputs, copied web assets, signing files, Firebase credentials, and IDE-local settings remain ignored.

## Acceptance checklist

- Run the existing web tests before and after Android synchronization.
- Build debug and signed release bundles with the supported JDK and SDK.
- Inspect the merged release manifest for permissions, exported components, and cleartext settings.
- Verify cold-start and warm-start authentication callbacks from both approved hosts.
- Verify Android back button and predictive-back gestures through onboarding, modals, Accounts 2.0, and settings.
- Test login, logout, session expiry, account restoration, wallet reads, PYUSD, initial allocation, later auto-allocation, and creator entitlements on a real device.
- Test notification acceptance, denial, later enablement, token rotation, logout cleanup, and safe routing.
- Test airplane mode, slow networks, process death, device restart, and app upgrade without losing or crossing account state.
- Confirm backup/restore and device transfer do not copy financial workspace data.
- Run Play internal testing, then closed testing, before production rollout.
