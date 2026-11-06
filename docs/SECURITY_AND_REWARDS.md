# Security, privacy and reward integrity

## Trust zones
User device, secure tunnel, controller, database and websites are separate trust zones. Use device-held keys, authenticated TLS transport, short-lived session leases, per-user/per-device authorization and server-side task policy. Never publish CDP directly.

## Consent and stop
Version ToS and remote-control consent separately. Show active session state and a user-controlled Stop through overlay when permitted and notification fallback. Stop immediately disables local command execution even offline. No background remote control outside active sessions.

## Privacy
Collect only operational events needed to verify authorized tasks. Do not read unrelated tabs, passwords, cookies, financial data or private messages. Encrypt sensitive records, redact logs, define retention and deletion workflows. Use Android Keystore for secrets.

## Reward policy
Reward eligibility must be tied to an explicitly authorized task and verifiable completion, not fake human traffic, advertisement clicks or manufactured impressions. Record pending, approved, rejected and reversed entries. Display clear earning rules and dispute process. Review applicable consumer, privacy, tax and payment rules before cash-out features.

## Abuse controls
Task allowlists, action limits, device revocation, replay protection, anomalous-event review, administrator audit, rate limits and kill switches. Do not evade website anti-bot controls. Suspend tasks if website/operator authorization is revoked.

## Release gates
Threat model, permission review, penetration test of tunnel and session isolation, consent revocation test, Stop under network failure, reward reconciliation and incident response runbook.

## Evidence status — 2026-11-07
No security testing was performed. The sandbox verification used localhost-only endpoints, a throwaway browser profile and no credentials; no tunnel, keys or production systems were involved. One design-relevant observation from the lab: commands issued after cancel were rejected locally by the controller without contacting any server — the desktop analog of local Stop priority. All release gates above remain open. Evidence: report/2026-11-07-agent-sandbox-verification.md.
