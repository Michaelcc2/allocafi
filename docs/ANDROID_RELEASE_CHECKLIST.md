# AllocaFi Android Release Checklist

Use this checklist for each Android release candidate through internal and closed testing. Store publication is intentionally out of scope.

## 1. Source and build identity

- [ ] Record Git commit SHA, version name, version code, build date, and tester.
- [ ] Confirm the candidate contains only approved Free/Core functionality; Family and Business remain disabled.
- [ ] Confirm Accounts 2.0 behavior and data contracts have not been replaced or removed.
- [ ] Run the complete web test suite.
- [ ] Run `node tests/android-readiness.test.mjs` with zero failures.
- [ ] Run the production web build and `npm run cap:sync`.
- [ ] Build a release candidate from Android Studio/Gradle without debug signing or debug WebView configuration.

## 2. Static security gate

- [ ] `com.allocafi.app`, `AllocaFi`, and `www` match the approved Capacitor identity.
- [ ] No Capacitor `server.url` loads production UI remotely.
- [ ] `androidScheme` is HTTPS and WebView debugging is disabled.
- [ ] Android rejects cleartext traffic with no domain exceptions.
- [ ] Android backup is disabled for local financial data.
- [ ] Sensitive screens use `FLAG_SECURE` to protect screenshots and recents previews.
- [ ] App Links use `android:autoVerify="true"`, HTTPS, and explicit production hosts only.
- [ ] No wildcard, HTTP, Family, Business, or Enterprise deep link is registered.
- [ ] Launcher/adaptive icons, round icon, splash resources, and bundled `assets/public/index.html` are present.
- [ ] Customized Android manifest, runtime security policy, and branded resources are versioned or reproduced by a checked-in deterministic build script.
- [ ] APK Analyzer finds no private key, seed phrase, recovery phrase, service-role key, test credential, localhost URL, or production secret.

## 3. Non-custodial and account isolation

- [ ] Onboarding requests only public wallet addresses.
- [ ] No screen, import, message, log, or API request asks for or stores wallet secrets.
- [ ] Every send requires review and approval in the external wallet.
- [ ] Cancelled/rejected wallet requests never appear as completed sends.
- [ ] Login, logout, refresh, expiry, password reset, and email verification work.
- [ ] Auth tokens are not exposed in browser storage, logs, URLs, screenshots, or exported snapshots.
- [ ] Account A data never appears after switching to Account B or signing out.
- [ ] Cloud snapshots remain owner-scoped by backend identity and Supabase RLS.
- [ ] Conflicting edits and stale tabs produce a safe reload/conflict path instead of overwriting newer data.

## 4. Functional regression

- [ ] Add, refresh, rename, copy, and remove a public wallet address.
- [ ] Validate USDC, USDT, and PYUSD reads on every supported network.
- [ ] Verify one initial allocation prompt for a newly added funded wallet.
- [ ] Verify subsequent deposits use auto allocation without a duplicate initial prompt.
- [ ] Verify Free can use only three template buckets and Core/verified creator rules remain correct.
- [ ] Exercise Accounts 2.0 search, sort, allocation, spend, bills, rules, scrolling, empty states, and large values.
- [ ] Verify onboarding, settings, wallet dialogs, and Accounts 2.0 with keyboard open and 200% text scaling.
- [ ] Verify Family and Business are absent from Android navigation, deep links, checkout, and entitlement activation.

## 5. Emulator and device matrix

- [ ] Minimum-supported-API small phone emulator.
- [ ] Current stable API standard phone emulator.
- [ ] Current stable API large phone emulator.
- [ ] Current stable API tablet in portrait and landscape.
- [ ] At least one physical device on the minimum/older supported API where hardware is available.
- [ ] At least one physical device on the current Android release.
- [ ] Gesture navigation and three-button navigation.
- [ ] Standard scaling and 200% font/display scaling.

For each row, record device/model, Android API, WebView version, orientation, build SHA, tester, date, result, and evidence link.

## 6. Network and lifecycle

- [ ] Cold start online, offline, and on a slow network.
- [ ] Lose connectivity during login, balance refresh, cloud save, and wallet handoff.
- [ ] Restore connectivity and verify retries do not duplicate wallets, allocations, or transactions.
- [ ] Background/foreground after 1 minute, 15 minutes, and session expiry.
- [ ] Force-stop/process death during onboarding, allocation, and queued cloud save; then relaunch.
- [ ] Rotate during every form, modal, wallet handoff, and Accounts 2.0 screen.
- [ ] Android back closes the expected layer and does not silently discard changes.
- [ ] Install the candidate over the previous internal build and verify migration/data recovery.
- [ ] Reboot the physical device and verify session and local workspace behavior.

## 7. Internal testing track

- [ ] Create a signed Android App Bundle using protected release signing credentials.
- [ ] Upload to Google Play Console Internal testing; do not promote to Production.
- [ ] Review automated pre-launch report, security warnings, device compatibility, and crash/ANR results.
- [ ] Add approved internal testers and confirm the opt-in/install link on a clean device.
- [ ] Complete the full functional, security, network, and lifecycle pass from the Play-delivered build.
- [ ] Record crashes, ANRs, WebView console errors, wallet handoff failures, and Supabase/Render errors.
- [ ] Fix all release-blocking findings, increment version code, rebuild, and repeat the gate.

## 8. Closed testing track

- [ ] Promote only an internal build that passed all gates to a Closed testing track.
- [ ] Define tester cohort, test dates, feedback channel, supported devices, and rollback owner.
- [ ] Test fresh install, upgrade from internal build, account creation, returning login, and multi-device sync.
- [ ] Exercise representative real wallets using low-value test funds and explicit transaction approval.
- [ ] Monitor crashes, ANRs, authentication failures, API error rates, and support feedback throughout the test window.
- [ ] Close every critical/high security or data-isolation issue before considering a wider release.
- [ ] Archive the signed test report and release evidence. Stop here; public store submission requires separate approval and publication readiness review.

## Human-only residual requirements

- Google Play developer credentials and permission to manage testing tracks.
- Protected Android upload/signing key and recovery material.
- Physical Android hardware, USB debugging authorization, and biometric/device-lock testing.
- Access to test email inboxes for verification and password recovery.
- Authorized Supabase and Render dashboards/logs for production diagnostics.
- Wallet apps and intentionally low-value test wallets on each supported network.
- WalletConnect/Reown project credentials and any provider-specific allowlisting.
- Final legal/privacy review, financial-features declarations, data-safety answers, support contact, and brand/domain decision.
- Human review of screenshots, accessibility, performance, battery/network use, and Play pre-launch findings.

## Release decision

- [ ] QA owner: pass / fail
- [ ] Security owner: pass / fail
- [ ] Product owner: approve another closed-test build / hold
- [ ] Outstanding blockers and owners recorded
- [ ] No public publication action taken
