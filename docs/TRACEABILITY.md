# Requirements traceability and open work

| Requirement | Canonical specification | Verification | Current state |
|---|---|---|---|
| Register and accept ToS | PRD, ANDROID | T11–T12 | Planned |
| One primary Start button | PRD, ANDROID | T14 | Planned |
| Dashboard statistics and reward | PRD, API_AND_DATA | T13, T17 | Planned |
| Real Chrome Android | PRD, CHROME_FEASIBILITY | T01–T10 | P0 BLOCKED |
| Non-root and one-tap control | CHROME_FEASIBILITY | T02, T05–T06 | P0 BLOCKED |
| Remote Playwright control/tunnel | ARCHITECTURE, CHROME_FEASIBILITY | T04, T07, T16 | P0 BLOCKED |
| Real device/network identity | ARCHITECTURE, TASK_POLICY | T08, T21 | Planned/Unverified |
| Floating and notification Stop | ANDROID, SECURITY_AND_REWARDS | T09, T19 | Planned |
| Authorized interaction library | TASK_POLICY | T15, T21 | Planned |
| Validated, non-deceptive rewards | SECURITY_AND_REWARDS, API_AND_DATA | T17, T21 | Business rules undecided |
| User/device isolation | SECURITY_AND_REWARDS | T16 | Planned |
| Deployment and incident response | OPERATIONS_AND_COMPLIANCE | T20 | Planned |

## Next mandatory actions
1. Decide domain authorization and reward funding; do not infer either.
2. Run P0 with real device evidence before implementing Chrome-specific assumptions.
3. Resolve architecture and permission constraints discovered in P0.
4. Implement only the verified scope; maintain risk register and traceability.
5. Keep all durable product/technical decisions in `docs/` and run reports in `report/`.

## Definition of verified
A linked, reproducible test artifact exists and matches the required device/version matrix. Documentation or a successful API request is not proof of Chrome automation.