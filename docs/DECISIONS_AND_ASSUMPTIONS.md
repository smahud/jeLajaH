# Decisions, assumptions and open questions

## Confirmed product direction (DECIDED)
D-01 Product and public repository name: jeLajaH, `smahud/jeLajaH`.
D-02 Android user app with registration, versioned ToS, dashboard and one primary Start action.
D-03 Dashboard displays pages loaded, rewards and operational stats; a floating Stop control is desired while browsing.
D-04 Central server orchestrates sessions over an authenticated tunnel; Android device and network identity remain real.
D-05 Target browser is the installed genuine Google Chrome Android app, not a disguised WebView or desktop Chromium.
D-06 QTEProject is a separate interaction-focused component; remove spoofing/stealth/ad-manipulation functionality.
D-07 Documentation lives under `docs/`; root README is an entry point. Keep initial server deployment a modular monolith.

## Unproven technical hypotheses (HYPOTHESIS / BLOCKED)
H-01 Stock non-root Android allows the desired one-tap, app-initiated, remotely controlled Chrome session without recurrent external ADB pairing. **BLOCKED pending P0**.
H-02 CDP can be reached securely through the Android app's outbound tunnel with no exposed debug port. **BLOCKED pending P0**.
H-03 Chrome debugging survives device reboot, browser updates, screen lock and OS background restrictions. **UNVERIFIED**.
H-04 Playwright can reliably control the Android Chrome version on the chosen device matrix with required commands. **UNVERIFIED**.
H-05 User network traffic remains direct and separate from control tunnel for all browser requests. **REQUIRES network capture**.
H-06 Overlay Stop is available on supported devices and distribution channels. **UNVERIFIED**; notification Stop required regardless.

## Business decisions not yet provided (UNDECIDED)
B-01 Are task domains owned by the operator, contracted partners or broader third-party websites? Require explicit permission for every domain.
B-02 Who funds rewards, what eligible outcome is paid, in which currency and at what rate?
B-03 Is reward informational, redeemable points or withdrawable money? Withdrawals are out of MVP until legal/payment review.
B-04 Target Android minSdk, supported devices/Chrome versions and distribution channel (Play Store/private).
B-05 Regions, user age eligibility, retention duration, identity verification and dispute SLA.
B-06 Is use permitted while screen is locked? Default: **no** until technically and policy justified.
B-07 Is remote controller hosted on private PC or cloud/VPS? Both conceptually possible; pick one MVP topology.

## Evidence notes — 2026-11-07 sandbox verification
- H-01, H-02: unchanged, still BLOCKED. The sandbox run exercised desktop Chromium only; no Android hardware was present (no adb, no SDK, no device).
- H-03: unchanged, UNVERIFIED — no Android device available to test reboot, screen-lock or background behavior.
- H-04: controller side partially informed — Playwright 1.57.0 drove desktop Chromium 143 over CDP with the full adapter action set (8/8 steps, report/2026-11-07-agent-sandbox-verification.md). Reliability on Android Chrome remains UNVERIFIED.
- H-05: not tested — no Android network capture is possible in this environment.
- H-06: not tested — no Android device available.
- Recorded fact: Playwright 1.57.0 ships no public `android` API (only an internal experimental `_android` export), and Android device enumeration requires the adb server (default port 5037). An app-local bridge must not assume first-class Playwright Android support.

## Decision discipline
Do not fill unresolved items with guesses. A feature is not VERIFIED because code was written. All changes need owner, date, rationale, alternatives, impact and acceptance evidence. If Chrome P0 fails, halt Chrome-specific implementation and request scope decision rather than silently switching browser.
