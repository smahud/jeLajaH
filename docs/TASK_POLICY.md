# Authorized tasks and QTEProject integration

## Purpose
"Human-like" means smooth, comprehensible UI interaction for testing and accessibility-oriented workflows. It does **not** mean concealing automation, pretending to be a human to websites, defeating anti-bot systems, generating fake engagement or interacting with advertisements.

## Allowed task model
Every task has an accountable operator, authorized domain allowlist, purpose, expected action, maximum duration, action budget, network/data budget, reward eligibility rule, revocation mechanism and audit policy. User sees an accurate summary of the automation scope before consenting. Server validates task and domain on each navigation, including redirects.

## QTE migration
Retain/rewrite: navigation, bounded dwell, scroll, tap, DOM state validation, timeout/retry, cancellation, session state and reporting.
Remove: stealth plugins, fingerprint manipulation, proxy rotation, ad-target selection/clicking, fabricated ad views, evasion tactics, misleading traffic analytics and desktop-only mouse assumptions.
Android tap/scroll must use a validated browser adapter, not a desktop cursor physics model.

## Task execution safeguards
No arbitrary code evaluation from task definitions. No interaction with login/payment forms, ads, consent banners or sensitive account controls unless specifically authorized and user-visible. Respect robots/site terms where applicable, operator agreements, rate limits and anti-automation restrictions. Stop on redirects outside allowlist. Explicitly label automated traffic to site operators when required.

## Metrics
`pages_loaded` counts verified successful page navigations; `tasks_completed` counts task completion; `valid_tasks` counts approved eligible outcomes. They are not interchangeable. Do not tie reward solely to pages loaded.

## Adapter contract
`BrowserAdapter.openAuthorizedUrl`, `inspectState`, `tap`, `scroll`, `wait`, `cancel`, `close`. Every call checks active session, task policy and deadline; cancellation is immediate and idempotent.

## Evidence note — 2026-11-07
The adapter contract was demonstrated in a controller-side desktop lab: allowlist prefix enforcement before navigation, inspectState, tap, bounded wait, idempotent cancel, and local rejection of post-cancel commands all passed against a local allowlisted test page (report/2026-11-07-agent-sandbox-verification.md). This is a lab analog only — no authorized task, real Chrome Android session, or reward accounting has run.
