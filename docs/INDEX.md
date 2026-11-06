# Documentation index — jeLajaH

This directory is the canonical project specification. Last documentation consolidation: 2026-11-07.

## Read in order
1. [PRD](PRD.md) — product goals, actors, user flow, functional and nonfunctional requirements.
2. [DECISIONS_AND_ASSUMPTIONS](DECISIONS_AND_ASSUMPTIONS.md) — binding decisions, open questions and unproven assumptions.
3. [ARCHITECTURE](ARCHITECTURE.md) — components, trust boundaries and control flow.
4. [CHROME_FEASIBILITY](CHROME_FEASIBILITY.md) — P0 investigation of real Chrome Android control.
5. [ANDROID](ANDROID.md) — app UI, permissions, lifecycle and stop behavior.
6. [API_AND_DATA](API_AND_DATA.md) — interface and persistence baseline.
7. [TASK_POLICY](TASK_POLICY.md) — permitted activity, human-like terminology and QTE migration.
8. [SECURITY_AND_REWARDS](SECURITY_AND_REWARDS.md) — threat model and reward integrity.
9. [RISK_REGISTER](RISK_REGISTER.md) — known blockers, foreseeable failure modes and mitigations.
10. [TEST_AND_ACCEPTANCE](TEST_AND_ACCEPTANCE.md) — reproducible evidence and release gates.
11. [OPERATIONS_AND_COMPLIANCE](OPERATIONS_AND_COMPLIANCE.md) — deployment, privacy, distribution and operations.
12. [DELIVERY_PLAN](DELIVERY_PLAN.md) — phased delivery and execution contract.
13. [TRACEABILITY](TRACEABILITY.md) — requirements-to-test map and outstanding work.

## Evidence status legend
- **DECIDED:** accepted product direction; not proof of implementation.
- **HYPOTHESIS:** needs reproducible experiment.
- **BLOCKED:** cannot be treated as shippable until prerequisite succeeds.
- **UNDECIDED:** requires explicit product/business decision.
- **VERIFIED:** supported by logged test evidence in repository; no P0 Chrome tests have been verified as of this document.

## Change control
Any architecture or scope change must update the relevant canonical document, decision log, risk register, tests and README links. Do not duplicate contradictory requirements. Every agent execution must create a dated report in root `report/` with results, evidence and unresolved issues. No passwords, tokens, device identifiers or personal data in reports.

## Product integrity
The app must not create deceptive human traffic, ad impressions/clicks, bypass website anti-bot defenses or hide automated origin. Only run authorized tasks with informed user consent. A real fingerprint/network is not proof that automation is permitted.