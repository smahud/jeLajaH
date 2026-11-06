# Risk register — live document
Updated 2026-11-07. Scores: Severity (Critical/High/Medium), Status (Open/Blocked/Mitigating). No risk is closed without evidence.

| ID | Risk / failure mode | Severity | Status | Mitigation / owner gate |
|---|---|---|---|---|
| R01 | Stock non-root Android cannot expose Chrome CDP for app-initiated remote control | Critical | BLOCKED | P0 real-device proof; stop Chrome-specific build if infeasible |
| R02 | ADB wireless debugging requires recurrent pairing, breaks one-tap UX | Critical | Open | Reboot and re-pair tests; disclose requirement or revise scope |
| R03 | Chrome/Android update breaks DevTools/Playwright compatibility | High | Open | Version matrix, smoke tests, staged rollouts |
| R04 | Android background/foreground-service restrictions terminate session | High | Open | Lifecycle tests, user-visible notification, fail-closed |
| R05 | Floating overlay unavailable, permission denied or obscures UI | High | Open | Notification Stop and app Stop fallback; accessibility tests |
| R06 | Stop cannot reach server during outage | Critical | Open | Local command gate, lease expiry, eventual server reconciliation |
| R07 | Exposed CDP or stolen tunnel token gives control of private tabs | Critical | Open | No public CDP, device keys, scoped leases, revocation, penetration test |
| R08 | Cross-tenant session mix-up or task injection | Critical | Open | Authorization on every command, per-device isolation, signed IDs |
| R09 | Task redirects outside authorized domains | High | Open | URL/redirect allowlist enforcement, abort on violation |
| R10 | Automation produces deceptive web traffic, ad impressions or clicks | Critical | Open | Prohibit ad interaction and misleading engagement; partner authorization |
| R11 | Reward fraud, replay, double-credit or ledger mismatch | High | Open | Idempotency, outcome verification, append-only ledger, reconciliation |
| R12 | No sustainable reward funding or unclear eligibility | High | UNDECIDED | Define partner funding and approved completion rule before pilot |
| R13 | Privacy overcollection (tabs, credentials, history, telemetry) | Critical | Open | Data minimization, scope limits, redaction, deletion |
| R14 | Android/Play Store policies prohibit chosen automation/permissions | High | Open | Distribution/legal policy review before build and release |
| R15 | Network identity differs due to proxy, VPN, DNS or tunnel misrouting | High | Open | Capture egress/DNS behavior; control-plane-only tunnel |
| R16 | Cellular data, battery and thermal drain harm user | High | Open | Data caps, duty cycles, thermal/battery checks, pause and disclosures |
| R17 | Device lost, stolen, shared or account compromised | High | Open | Device revocation, strong auth, pairing verification, local Stop |
| R18 | Offline event replay or clock drift corrupts accounting | Medium | Open | Server time, event sequence, replay detection, reconciliation |
| R19 | Personal data in screenshots/logs or public GitHub reports | High | Open | Redact by default, private evidence storage, secrets scanning |
| R20 | Arbitrary server commands exceed user consent | Critical | Open | Task-scoped command schema, least privilege, transparent activity |
| R21 | Session runs when screen locked or user not present | High | UNDECIDED | Default pause; user research and policy review |
| R22 | Rewards may trigger payment, tax, consumer or gambling-like compliance obligations | High | Open | Local counsel review before withdrawal/redemption |
| R23 | Unsupported WebView fallback falsely advertised as real Chrome | High | Open | Strict capability check, explicit product decision |
| R24 | Repository agent makes unsupported claims or implements stealth/ad logic | High | Open | CONTRACT and review gates, docs traceability, tests |
| R25 | Server outage/database loss loses sessions or reward balances | High | Open | Backups, restore drills, durable events, recovery playbook |

## Risk response
Critical unresolved risks prevent production release. P0 failure requires documented scope decision, not silent workaround. Owners, test links and closure dates must be added as work begins.