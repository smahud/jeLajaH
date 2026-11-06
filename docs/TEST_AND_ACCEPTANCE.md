# Test strategy and release acceptance

## P0 device experiments (must pass before Chrome-specific build)
- T01 Real Chrome installed, not WebView or Chromium substitute.
- T02 Non-root Android baseline and user permissions documented.
- T03 Local lab ADB/CDP reference works or fails with evidence.
- T04 Remote PC/VPS control over authenticated outbound tunnel.
- T05 No recurrent external ADB dependency for promised one-tap UX.
- T06 Reboot, Chrome restart, OS background, screen lock and network switching.
- T07 Tap/scroll/navigate/state/cancel actions on operator-owned test site.
- T08 Direct browser network identity confirmed by independent capture.
- T09 Floating Stop, notification Stop, offline Stop, server outage.
- T10 Android/Chrome/Playwright compatibility matrix.

## Product tests
- T11 Registration, login, recovery, logout, account deletion.
- T12 ToS refusal and withdrawal prevent session start/continuation.
- T13 Dashboard counters reconcile with server event records.
- T14 Start double-tap and retry do not create duplicate sessions.
- T15 Task allowlist, redirects, timeouts, action budgets and policy revocation.
- T16 Device pairing/revocation, session isolation, token expiry and replay rejection.
- T17 Reward credit once per valid outcome; reversals, disputes and crash recovery.
- T18 Network loss, process death, Android permission denial, low battery/data cap.
- T19 Accessibility, localization, foreground notification and overlay fallback.
- T20 Backup restore, audit trail, log redaction, privacy retention and incident drill.
- T21 Verify no ad clicking, impression fabrication, stealth or fingerprint spoofing.

## Evidence requirements
Each test records date, test owner, device/software versions, prerequisites, steps, expected and actual results, redacted logs, pass/fail and linked issue. Store summaries in `report/`, not personal secrets. Never label an unexecuted test as passed.

## Evidence log — 2026-11-07 sandbox run (report/2026-11-07-agent-sandbox-verification.md)
No test in this file is marked passed. Honest status after the sandbox run:
- T01–T06, T08–T10: NOT RUN — no Android device, adb or SDK in the verification environment.
- T03: desktop analog executed — a controller attached to desktop Chromium over a CDP endpoint and completed openAuthorizedUrl/inspectState/tap/scroll/wait/cancel on a local allowlisted page (8/8 steps). The ADB-on-Android half of T03 could not run, so T03 as specified is NOT passed.
- T07: NOT RUN as specified (requires real Chrome Android and an operator-owned test site). The desktop-equivalent action sequence passed on a local test page and is archived as lab evidence only.
- T11–T21: NOT RUN — no product implementation exists.

## Release gates
G0 P0 feasibility PASS; G1 consent/security architecture review; G2 API and Android MVP tests; G3 reward integrity and authorized task pilot; G4 legal/distribution and operational readiness. Any critical risk blocks release.