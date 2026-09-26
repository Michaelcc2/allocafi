# AllocaFi Android implementation status (items 1-28)

This records what is implemented in the repository and what still requires credentials, hardware, or an external console. Accounts 2.0 remains a protected regression surface. Family and Business remain disabled.

| # | Work item | Status | Evidence / remaining action |
|---|---|---|---|
| 1 | Use the existing web app as the Android foundation | Complete | Capacitor 8 wraps the current HTML, CSS, and JavaScript app. |
| 2 | Preserve Accounts 2.0 | Complete | Readiness tests protect its feature key, isolated route, renderer, and search. |
| 3 | Keep Family and Business out of this release | Complete | Removed from advanced launch/navigation and direct route resolution. |
| 4 | Establish Android identity | Complete | `com.allocafi.app`, app name `AllocaFi`. |
| 5 | Generate the native Android project | Complete | Versioned `android/` project targets SDK 36 and supports API 24+. |
| 6 | Bundle web assets | Complete | The build copies approved assets to `www/`; Capacitor sync copies them into the app. |
| 7 | Add safe-area support | Complete | Status/navigation-bar insets are respected. |
| 8 | Make mobile controls touch-friendly | Complete | Phone controls use stable minimum touch targets and responsive spacing. |
| 9 | Make dialogs keyboard-safe | Complete | Dialog sizing and scrolling account for compact screens and the software keyboard. |
| 10 | Add phone, tablet, and landscape layouts | Complete | CSS covers compact portrait, tablet, and short landscape viewports. |
| 11 | Support account creation and login | Complete | Existing Supabase-backed Accounts 2.0 session flow is preserved. |
| 12 | Support logout and returning sessions | Complete | HttpOnly access/refresh cookies and per-user workspace restoration remain active. |
| 13 | Complete password recovery | Complete | Reset links return to `/auth/recovery`; users confirm and may preview the new password. |
| 14 | Keep account workspaces isolated | Complete | Cloud snapshots are owner-scoped and local workspaces are namespaced by verified user ID. |
| 15 | Protect secrets and sessions | Complete | Wallet secrets are rejected, tokens stay out of snapshots/browser storage, Android backup is disabled, and sensitive screens use `FLAG_SECURE`. |
| 16 | Add Android back-button behavior | Complete | Back closes a modal, navigates history, or backgrounds the root screen. |
| 17 | Add lifecycle handling | Complete | Foreground/background callbacks and session revalidation hooks are available. |
| 18 | Add network/offline handling | Complete | Connectivity state shows a persistent offline banner while saved values remain visible. |
| 19 | Add safe deep links | Complete | Only the production HTTPS auth path and `allocafi://auth/callback` are accepted. |
| 20 | Add native clipboard support | Complete | Capacitor Clipboard with browser fallback for public addresses. |
| 21 | Add native share support | Complete | Capacitor Share with browser fallback. |
| 22 | Add safe external-browser handoff | Complete | Only HTTPS external URLs are accepted. |
| 23 | Add push-notification plumbing | Code complete | Permission, registration, receive, and action hooks exist. FCM still needs `google-services.json` and server credentials. |
| 24 | Add branded launcher and splash assets | Complete | Adaptive launcher/round icons and splash resources are generated from AllocaFi branding. |
| 25 | Harden Android networking and WebView | Complete | Cleartext/mixed content/debugging/production logs are disabled. |
| 26 | Add automated Android readiness tests | Complete | `pnpm test` now includes mobile runtime and Android security gates. |
| 27 | Run emulator and physical-device matrix | Build complete; device test pending | JDK 21, Android SDK 36, and Android Studio are installed. A verified debug APK was compiled; physical-device installation and the matrix in `ANDROID_TESTING.md` still require connected hardware. |
| 28 | Prepare internal and closed testing | Build and CI prepared; not published | The debug APK and CI artifact workflow are ready. Play credentials, a production signing key, device evidence, and explicit publication approval remain required. |

## Deliberately deferred

- Plaid/bank connection is not added to Android until the separate bank-link scope is approved.
- Push delivery is not enabled until Firebase credentials and a notification backend are provided.
- A production-signed APK/AAB still requires the release keystore credentials. The workstation can compile debug Android packages with JDK 21 and SDK 36.
- Internal/closed Play uploads and every public publication action require explicit user approval and account access.
