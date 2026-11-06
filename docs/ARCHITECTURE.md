# Architecture baseline

## Components
**Android jeLajaH (Kotlin/Jetpack Compose):** registration, consent, dashboard, Start, foreground service, notification Stop, optional overlay Stop, Android Keystore, device identity, outbound tunnel, Chrome bridge.

**Server (TypeScript/Node.js):** authentication, device registry, session orchestrator, task policy engine, Playwright controller, QTE interaction adapter, event ingestion, reward ledger, admin APIs. Start as a modular monolith backed by PostgreSQL.

**QTEProject:** independently maintained library limited to authorized browser interactions: dwell, scroll, tap, navigation, state checks, cancellation and error recovery. Remove ad-click targeting, stealth, proxy rotation, fingerprint profiles and desktop-only mouse assumptions.

## Data flow
User Start -> API consent/device/policy validation -> issue short-lived session lease -> outbound authenticated device tunnel -> capability negotiation -> Playwright/Chrome adapter -> authorized task -> signed event receipt -> server validation -> append-only reward entry -> dashboard.

Chrome's website traffic goes directly over the Android device network, not through the control tunnel. Do not claim this without network verification.

## Android Chrome feasibility
A tunnel does not grant Chrome DevTools Protocol access. Stock non-root Android Chrome may require ADB debugging/pairing; Chrome Android does not provide a generic third-party app control API. Prove the exact supported path on real hardware before choosing the final bridge. Do not silently replace real Chrome with WebView.

## Session states
CREATED -> AUTHORIZED -> CONNECTING -> READY -> RUNNING -> STOPPING -> STOPPED. Exceptional states: REJECTED, FAILED, EXPIRED, DISCONNECTED. Stop is terminal for its session ID. Server commands require monotonically increasing sequence numbers and valid session lease.

## Reliability and isolation
Per-device keys and sessions; no cross-account access. Reconnect with event cursors and idempotency keys. Fail closed on lease expiry, consent withdrawal or tunnel disconnect. Limit tasks by domain, duration, action count and bandwidth.

## Deployment
HTTPS ingress, API/controller process, PostgreSQL, backups, structured logs and basic metrics. Avoid microservices and queue clusters until demonstrated need. Administrative access protected by strong authentication and least privilege.

## Interfaces
BrowserAdapter: openAuthorizedUrl, inspectState, tap, scroll, wait, cancel, close. Controller must not request credentials, unrelated tabs or personal content. Every action is traceable to a user-authorized task.