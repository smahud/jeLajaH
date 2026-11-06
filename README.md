# jeLajaH

Android-first, user-consented authorized browsing task platform with centralized orchestration, real-device Chrome as a **P0 feasibility target**, transparent reward accounting and immediate user Stop.

**Status:** documentation-only baseline. No Android Chrome remote-control capability has been proven, and no production automation is implemented.

**Verification 2026-11-07 (Linux sandbox):** controller-side lab evidence added — a separate Playwright 1.57 controller attached to real Chromium 143 over a CDP endpoint and completed the full BrowserAdapter action set on a local allowlisted test page (8/8 steps passed, including allowlist enforcement, idempotent cancel and local rejection of post-cancel commands). Playwright's Android automation was confirmed adb-dependent (enumeration fails without an adb server on port 5037), and a transport without a live DevTools endpoint was confirmed insufficient for CDP attach. **All Android device-dependent P0 items remain BLOCKED** — the verification environment has no adb, Android SDK or device. Evidence and reproducible scripts: [report/2026-11-07-agent-sandbox-verification.md](report/2026-11-07-agent-sandbox-verification.md).

## Documentation — canonical source of truth
Start with **[docs/INDEX.md](docs/INDEX.md)**. This links the PRD, architecture, Android UI and lifecycle, Chrome feasibility research, API/data contract, task policy, security and rewards, risk register, tests, operations, decisions, traceability, agent contract and delivery plan.

## Critical constraints
- Real Android device and network; no fingerprint spoofing, stealth, deceptive ad traffic or fabricated human engagement.
- Only operator-authorized tasks with informed user consent.
- Real Google Chrome Android (not silently substituted with WebView).
- Local Stop works even if server connectivity fails.
- A tunnel alone does not grant Chrome CDP access; non-root one-tap feasibility must be proven in P0.
- Every agent execution creates a dated root `report/` record; canonical specifications stay in `docs/`.

Public repository: https://github.com/smahud/jeLajaH
