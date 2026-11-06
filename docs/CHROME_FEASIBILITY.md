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