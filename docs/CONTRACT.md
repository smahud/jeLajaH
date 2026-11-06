# Documentation and agent execution contract

1. Read `docs/INDEX.md`, `docs/PRD.md`, `docs/DECISIONS_AND_ASSUMPTIONS.md`, and `docs/RISK_REGISTER.md` before modifying implementation.
2. Treat docs as the canonical specification. Do not invent requirements, silently downgrade real Chrome to WebView or claim P0 feasibility without reproducible evidence.
3. Respect user consent, local Stop priority, authorized-domain scope, no spoofing, no stealth, no fabricated traffic and no ad manipulation.
4. Keep MVP minimal: Android client, TypeScript modular monolith and PostgreSQL; introduce complexity only with measured justification.
5. For **every agent execution**, create a dated report under root `report/` including scope, changes, tests actually executed, outcomes, risks, blockers and next actions.
6. Update the relevant docs, risk register and traceability whenever implementation changes architecture, interfaces or requirements.
7. Never commit credentials, private user data, device identifiers or unredacted browser captures.
8. Do not deploy, trigger live tasks or initiate externally visible browsing without explicit authorization and required checks.
9. Run automated tests where possible, distinguish untested from passed, and record honest failure evidence.
10. When P0 fails, stop dependent implementation and request an explicit product decision.