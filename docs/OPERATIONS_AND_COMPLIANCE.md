# Operations, user protection and compliance baseline

## MVP deployment
Use a single secured Node.js/TypeScript controller/API service, PostgreSQL, HTTPS, backups and monitoring. A PC-hosted or VPS-hosted controller must be chosen explicitly; do not presume permanent availability of a personal PC. Isolate device sessions. Admin actions require authentication and audit logging.

## Observability
Measure active sessions, task outcomes, command latency, tunnel reconnects, Stop-to-quiescence latency, device compatibility, API errors, reward ledger discrepancies and user complaints. Redact URLs containing sensitive parameters and never log cookies, tokens or full personal browser history.

## Reliability
On tunnel loss, locally reject new commands and expire leases. After reconnection, reconcile event sequence and reward outcomes. Rate limit and bound device data usage; notify user of mobile-data/battery consumption. Implement backup and restoration drills.

## User rights
Publish plain-language ToS and privacy policy covering control scope, data processed, reward eligibility, withdrawal/revocation and deletion. Consent must be informed, specific and versioned; remote control must remain visible and stoppable. Do not imply that ToS acceptance alone authorizes activity on third-party websites.

## Legal/policy reviews before launch
Confirm permission from every website/operator, applicable anti-fraud and advertising policies, Android and Google Play requirements for overlays/foreground services/automation, local privacy law, consumer protection, tax and payment obligations. Cash-out/redemption is out of MVP until review. Do not promise earnings before funding and validation rules exist.

## Incident runbooks
Lost device: revoke device key and sessions. Compromised controller: rotate keys, pause all tasks and investigate audit events. Reward mismatch: freeze settlement, reconcile append-only ledger and issue reversing entries. Unauthorized task: immediately revoke and notify affected users/operators as required.

## Documentation/reporting
Every agent run writes a timestamped root `report/` summary including changes, tests, decisions, risks and next steps. Keep documentation synchronized with code; no deployment claim without test evidence.