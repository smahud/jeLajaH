# Android application specification

## Stack
Kotlin, Jetpack Compose, Android Keystore, HTTPS/WebSocket client, lifecycle-aware foreground operation subject to Android and Google Play policies.

## Screens
- Registration/login/recovery.
- Versioned ToS and Privacy Notice, plus separate explicit remote-control disclosure.
- Dashboard: pages loaded, eligible tasks, session duration, pending/available reward, readiness, one primary Start button.
- Session summary and reward history (secondary navigation).

## Active session
Start verifies permissions and server readiness. Launch real Google Chrome Android only on proven supported devices. Display ongoing notification and optional overlay floating Stop (requires user-granted overlay permission). Notification Stop must work if overlay is unavailable. Local Stop revokes session immediately and prevents further actions before awaiting server acknowledgment.

## Device bridge
Maintain outbound authenticated tunnel. Never expose an unauthenticated CDP socket. Do not require root or assume unrestricted access to another app's browser process. Document per-version Android/Chrome compatibility; fail with clear message if unsupported.

## Device safety
Handle screen lock, app backgrounding, battery optimization, connectivity loss, process death and reboot. User must always retain control. Do not capture unrelated tabs, passwords, cookies, notifications or other applications.

## Acceptance tests
First run, consent refusal, permission denial, Start, Stop, rapid double taps, tunnel loss, controller loss, Android app termination, reboot, Chrome update and reward display consistency.