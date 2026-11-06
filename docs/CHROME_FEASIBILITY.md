# P0 — Real Google Chrome Android feasibility investigation

## Fundamental constraint
An Android app cannot automatically control another app's internal browser tabs merely by launching it or opening a tunnel. Chrome DevTools Protocol (CDP) is a debugging interface, not an unrestricted Android app API. Playwright's Chromium CDP connector does not guarantee that arbitrary Android Chrome instances are attachable. ADB forwarding/wireless debugging may require user/system setup and may not meet a one-tap consumer UX.

## Questions to prove, not assume
1. Can an ordinary non-root Android app initiate/maintain the required Chrome debugging endpoint without special privileges?
2. Is external ADB USB or wireless pairing needed for each install, boot or session? Does it survive reboot?
3. Can a remote PC/VPS controller attach through an authenticated outbound-only tunnel with no public CDP port?
4. Can Playwright navigate, inspect, scroll, tap, wait and cancel reliably in the real Chrome app?
5. Does Chrome use the device's real network and device/browser properties without rewriting headers or fingerprints?
6. What happens on Android 12–16 variations, Chrome upgrades, screen lock, app switching, battery restrictions and lost connectivity?
7. Does the Stop control work without server connectivity or overlay permission?

## Experimental tracks
- **A:** Lab reference: authorized developer-mode Android, USB ADB forwarding to Chrome's DevTools socket; record whether browser and CDP work.
- **B:** Android wireless debugging/pairing; record user setup friction, expiry and reboot behavior.
- **C:** Explore app-local bridge feasibility using documented Android APIs and security boundaries; no root, exploit, hidden privilege escalation or security bypass.
- **D:** Remote transport: once a legitimate debugging endpoint is available, tunnel authenticated control only; never expose debugging publicly.
- **E:** Compare experimental Playwright Android support with direct CDP. Record supported APIs and gaps.
- **F:** If A–E fail consumer UX, produce a decision paper comparing supervised external-ADB mode, an explicitly labeled WebView-based alternate product, or discontinuing the Chrome-specific requirement. No silent substitution.

## Test matrix
Record device make/model (without personal identifiers), Android version/patch, Chrome version, Playwright version, connection method, initial permissions, setup time, reboot behavior, success/failure, logs, screenshots with private data redacted, and reproducible commands.

## Exit criteria
P0 passes only if real Chrome Android on target non-root devices is remotely controlled from server after ordinary user consent, without repeated external debugging steps inconsistent with the product promise; session survives expected lifecycle events; local Stop works offline; browser traffic remains on user network; and the method is allowed by platform/distribution policies.

## Explicitly prohibited claims
Do not describe Chrome Android remote CDP, tunnel bootstrap, one-click browser automation or reboot persistence as working until test evidence exists. A browser launched by Intent alone does not satisfy remote control acceptance.

## Verification log — 2026-11-07 sandbox (controller-side lab reference)
Environment: Debian 13 x86_64 container, Node 24, Playwright 1.57.0, Google Chrome for Testing 143.0.7499.4 (desktop). No adb, no Android SDK, no device — Track A/B device steps and questions 1, 2, 6, 7 could not be executed here and remain open. Evidence and reproducible scripts: report/2026-11-07-agent-sandbox-verification.md.

- **Track D analog:** a controller process attached to a real Chromium through a CDP HTTP endpoint on localhost (standing in for the authenticated tunnel) and executed the full BrowserAdapter action set — openAuthorizedUrl with allowlist prefix check, inspectState, tap, scroll, bounded wait, idempotent cancel — 8/8 steps passed; commands issued after cancel were rejected locally.
- **Track E:** Playwright 1.57.0 interoperates cleanly with desktop Chromium 143 over CDP. On the Android side, Playwright 1.57.0 exposes no public `android` API — only an internal experimental `_android` export whose device actions (tap, swipe, scroll, shell, installApk, …) operate through the adb server (enumeration fails with `ECONNREFUSED 127.0.0.1:5037` when adb is absent). Chrome page access on a device goes through per-app DevTools sockets surfaced by that adb-backed device API.
- **Negative control:** `chromium.connectOverCDP` to a port with no DevTools endpoint fails (`ECONNREFUSED`) — a transport alone does not grant CDP access, confirming the fundamental constraint above.

Conclusion: controller-side capability is proven on desktop Linux only. **No P0 exit criterion is satisfied; P0 remains BLOCKED** pending real-device evidence (real non-root Android, real Google Chrome, reboot/tunnel/Stop tests).
