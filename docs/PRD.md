# jeLajaH — Product Requirements Document
Version 1.1 | 2026-11-07 | Status: documentation baseline, not implemented; 2026-11-07 controller-side desktop lab evidence added (see report/), Android P0 still unproven

## Vision
jeLajaH is an Android application for consent-based, visible and stoppable authorized browsing tasks. A user registers, accepts versioned Terms of Service and a separate remote-control disclosure, sees a dashboard and presses one primary Start button. Google Chrome Android, if the technical feasibility gate passes, runs tasks through the user's real device and network. A centralized controller orchestrates tasks via an authenticated tunnel. Rewards are transparent, auditable and awarded only for eligible authorized tasks.

## Actors
- User: registers, consents, starts/stops sessions, reviews reward ledger.
- Administrator: publishes allowlisted tasks, configures rewards, reviews fraud/quality signals, reconciles ledger, suspends unsafe tasks.
- Controller: authenticates devices, schedules tasks, records events and outcomes.
- Authorized website/operator: expressly permits the relevant automated activity.

## MVP user journey
1. Register/login and recover account.
2. Accept ToS and Privacy Notice; separately acknowledge browser remote-control permissions and limitations. Store consent version, timestamp and device.
3. Dashboard: total loaded pages, valid tasks, session time, pending/available reward, connectivity and device readiness. One primary action: Start.
4. Start: re-check consent, device status, policy, task availability and connectivity; show active-session notification and open Chrome only when supported.
5. During session: user sees browser, task progress and an Android floating Stop control; notification Stop is fallback.
6. Stop: immediately block further commands, revoke session lease, close control connection, settle events and return to dashboard.
7. History: review individual sessions, task outcomes, reward adjustments and dispute status.

## Functional requirements
- FR-01 Account authentication, consent versioning, session and device management.
- FR-02 Single-action dashboard with accurate server-backed statistics.
- FR-03 Device pairing and mutually authenticated outbound control tunnel.
- FR-04 Start/Stop idempotency and a user-priority local kill switch.
- FR-05 Real Chrome Android control only after proven supported on stock non-root devices; no hidden WebView substitution.
- FR-06 Task allowlists, domain restrictions, explicit task purpose and per-session budget/time limits.
- FR-07 Interaction adapter supporting navigation, tap, scroll, dwell, state checks and recovery for authorized tasks.
- FR-08 Event integrity, deduplication and append-only reward accounting.
- FR-09 Admin task publishing, pause/revoke, audit, reward reconciliation and support.
- FR-10 Accessible UX, network loss recovery, foreground notification and privacy controls.

## Non-functional requirements
- No spoofed fingerprints, user agents, device identities or network origin; no stealth plugins, proxy rotation or deceptive human traffic.
- Do not automate ad clicks, manufacture impressions, bypass anti-bot defenses or misrepresent automation as human-origin engagement.
- Never expose CDP on a public interface. Control only during active informed-consent sessions.
- Keep Chrome traffic direct from device; tunnel only control-plane messages and minimum necessary telemetry.
- Use a modular monolith initially: Kotlin/Compose Android client; TypeScript server; PostgreSQL; pinned QTE interaction adapter.
- Account deletion, data minimization, retention policy, observability and abuse response required.

## Hard P0 technical gate
Demonstrate Playwright-to-real-Chrome-Android control on a stock non-root device, including setup, reboot persistence, no repeated external ADB dependency, tunnel, browser network identity, Android background restrictions and immediate Stop. Android Chrome debugging is not automatically enabled by a tunnel. If P0 fails, record the incompatibility and revise product scope transparently; do not claim a working one-tap experience.

Status 2026-11-07: P0 has not been executed on any Android device. Only a controller-side desktop lab reference exists (report/2026-11-07-agent-sandbox-verification.md); the gate remains closed.

## Acceptance criteria
- Consent and task authorization are auditable.
- Start cannot run without a valid device, active consent and eligible task.
- Stop blocks commands even if server is offline; session lease expires.
- Each completed task has event evidence, policy decision and reward ledger reference.
- A page load alone never guarantees reward.
- No website or ad network receives misrepresented human engagement.
- Chrome control is verified on the documented Android/Chrome matrix before release.

## Out of scope for MVP
Payments/cash-out until legal and operational review; large-scale device farms; arbitrary internet-wide browsing; stealth/fingerprint manipulation; background control without user-visible session; unsupported Android workarounds.

## Release decision
P0 feasibility -> P1 secure Android/server MVP -> P2 task/reward verification -> P3 limited authorized pilot. Each gate requires reproducible evidence, security review and documented rollback.