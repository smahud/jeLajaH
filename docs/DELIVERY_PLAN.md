# Delivery plan and execution contract

## P0 — hard feasibility gate
On a stock non-root Android device, prove actual Chrome Android control using documented Playwright/CDP capabilities. Compare USB ADB lab control, wireless debugging and any app-local authorized bridge. Record whether repeated external ADB pairing is needed after reboot. Verify real device/network identity, authenticated tunnel, browser actions, disconnect recovery and local Stop. Produce evidence matrix: Android version, Chrome version, device model, setup steps, logs, results and limitations. If unsupported, stop and propose an honest revised product scope.

### P0 evidence status — 2026-11-07
P0 is NOT passed. A controller-side lab reference succeeded on desktop Linux (Playwright-over-CDP to desktop Chromium, full adapter action set, 8/8 steps) and is archived with reproducible scripts in report/2026-11-07-agent-sandbox-verification.md. All device-dependent P0 evidence — real non-root Android, real Google Chrome, reboot persistence, tunnel from the device, network identity, local Stop on device — is still missing and must be produced on real hardware before P1.

## P1 — secure foundation
Initialize Android Kotlin/Compose client, Node.js/TypeScript modular monolith, PostgreSQL schema, CI, lint/test, OpenAPI, authentication, consent, device registry and tunnel protocol. No production browser control until P0 passes.

## P2 — user MVP
Registration, consent, dashboard, Start, active notification, optional floating Stop, local kill switch, session history, authorized task allowlists and state machine.

## P3 — interaction and reward
Integrate QTEProject as pinned dependency after removing stealth, ad-click targeting, proxy rotation and fingerprint manipulation. Implement task outcome verification, append-only reward ledger, reconciliation, event deduplication and admin review.

## P4 — pilot and release
Test against authorized domains only. Perform end-to-end, device compatibility, tunnel isolation, privacy, security, offline Stop, battery/background and data integrity tests. Limited pilot with rollback plan before wider release.

## Definition of done
Every feature has documented acceptance criteria, tests, logs, failure behavior, user disclosure and rollback. No claim of Android Chrome compatibility without reproducible device evidence. No payment/cash-out launch without policy and legal review.

## Agent execution contract
Read docs/PRD.md first, preserve architecture baseline, keep implementation minimal, avoid overengineering, never bypass P0. For every execution, write a dated report under root report/ describing changes, tests, unresolved risks and next steps. Never commit secrets. Require user authorization for production deployment and externally visible actions.