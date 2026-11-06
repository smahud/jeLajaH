# API and data contract

## REST
POST /v1/auth/register
POST /v1/auth/login
POST /v1/consents
GET /v1/me/dashboard
GET /v1/me/rewards
POST /v1/devices/pair
GET /v1/devices
POST /v1/sessions/start
POST /v1/sessions/{id}/stop
GET /v1/sessions/{id}
GET /v1/me/history

Admin (RBAC): task create/publish/pause, domain allowlist, device revoke, session terminate, reward reconciliation, audit lookup.

## Entities
users(id,status,created_at)
consents(id,user_id,version,scope,accepted_at,revoked_at)
devices(id,user_id,public_key,capabilities,status,last_seen_at)
tasks(id,operator_id,allowlisted_domains,policy_version,reward_rule,status)
sessions(id,user_id,device_id,task_id,state,lease_expires_at,started_at,stopped_at)
session_events(id,session_id,sequence,event_type,event_time,payload_hash)
task_outcomes(id,session_id,task_id,verdict,reason,evidence_ref)
reward_ledger(id,user_id,task_outcome_id,amount,currency,status,created_at)
audit_events(id,actor,action,target,timestamp,metadata)

## Tunnel envelope
{version,device_id,session_id,sequence,command_id,issued_at,expires_at,type,payload}
Commands are authorized per session and task; use idempotency keys, monotonic sequences and acknowledgments. Stop/revoke outranks queued commands.

## Reward invariants
One eligible verified outcome produces at most one credit. Ledger entries are append-only; corrections are reversing entries. Pages loaded and eligible outcomes are separate metrics. Never calculate payouts solely from page load count.

## API safety
HTTPS, short-lived tokens, device binding, input validation, rate limiting, authorization checks, audit logs, no credentials in telemetry. Publish an OpenAPI contract before implementation.

## Status — 2026-11-07
Not implemented; this document remains a design baseline only (no server code exists in the repository). Documentation QA on 2026-11-07: relative links intact, no placeholders (report/2026-11-07-agent-sandbox-verification.md). Publish the OpenAPI contract before implementation, as required above.
