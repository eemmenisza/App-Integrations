# QaaS Parties CRM ↔ People Pool ↔ Monday (daily GitHub pull)

Status: integration scaffold (Aug 2026)  
Entities: **QaaS Parties CRM**, **People Pool**, **Monday.com**  
Orchestration: **GitHub Actions daily pull** + local `scripts/sync-qaas-monday.mjs` [STATED]

## Topology

```
┌──────────────────┐         daily cron (GitHub Actions)
│  People Pool     │◄────────────────────────────────┐
│  (person master) │                                 │
└────────┬─────────┘                                 │
         │ person_id                                 │
         ▼                                           ▼
┌──────────────────┐      GraphQL pull      ┌─────────────────┐
│ QaaS Parties CRM │◄───────────────────────│ Monday.com      │
│ (party / account │      + reconcile       │ Parties board   │
│  + contact roles)│                        │ People Pool board│
└────────┬─────────┘                        └────────┬────────┘
         │                                           │
         └──────────────────┬────────────────────────┘
                            ▼
                 GitHub App-Integrations
                 • scripts/sync-qaas-monday.mjs
                 • .github/workflows/qaas-monday-daily.yml
                 • data/crm/manifest.json (safe metadata)
                 • snapshots → Actions artifacts (PII, not committed)
```

## Systems of record [GENERATED]

| Entity | Default SoR | Notes |
|---|---|---|
| People Pool | Monday People Pool board (until QaaS person table authoritative) | Shared `person_id` |
| Parties CRM | QaaS/Supabase for operational party rows; Monday for pipeline stage | Reconcile on `party_id` / email / monday item id |
| Pipeline stage / owner | Monday Parties board | Pull into QaaS daily |

## Field mapping (v1)

| People Pool | QaaS Parties / contacts | Monday |
|---|---|---|
| person_id | person_id | person_id (text) or item id link |
| full_name | display_name | Name |
| email | email | Email |
| phone | phone | Phone |
| — | party_id / org_name | Company / Account (Parties board) |
| role_title | role_at_party | Title |
| status | active | Status |
| updated_at | updated_at | Updated at |

## Daily pull (GitHub)

Workflow: `.github/workflows/qaas-monday-daily.yml`

- Schedule: `0 2 * * *` (02:00 UTC ≈ 04:00 SAST)
- Also: `workflow_dispatch` (manual)
- Steps: checkout → Node 22 → `npm ci` (none yet) → `node scripts/sync-qaas-monday.mjs` → upload snapshot artifact → commit **manifest only** if changed

### Required GitHub secrets / variables

| Name | Type | Purpose |
|---|---|---|
| `MONDAY_API_TOKEN` | secret | Monday API token |
| `MONDAY_PARTIES_BOARD_ID` | variable or secret | Parties CRM board id |
| `MONDAY_PEOPLE_POOL_BOARD_ID` | variable or secret | People Pool board id |
| `QAAS_PARTIES_EXPORT_URL` | optional secret | HTTPS/CSV/Supabase export for reconcile |

## Local run

```powershell
$env:MONDAY_API_TOKEN = "…"          # from 1Password — do not commit
$env:MONDAY_PARTIES_BOARD_ID = "…"
$env:MONDAY_PEOPLE_POOL_BOARD_ID = "…"
node scripts/sync-qaas-monday.mjs
```

Writes:

- `data/crm/snapshots/<date>/parties.json` (gitignored)
- `data/crm/snapshots/<date>/people-pool.json` (gitignored)
- `data/crm/manifest.json` (committed — counts, board ids, content hashes, no PII bodies)

## POPIA [STATED]

- Snapshots contain personal information → **do not commit**; Actions artifact + local/Icom storage only
- Production sync worker later moves to Icom/Hadefield OpenStack
- Manifest may record row counts and SHA-256 of snapshot files only

## Owner Decision Queue

1. Confirm Monday board IDs for **Parties CRM** and **People Pool**
2. Store `MONDAY_API_TOKEN` in GitHub Actions secrets + 1Password
3. QaaS Parties table/export endpoint for two-way reconcile
4. Email uniqueness owner (People Pool vs Parties)
5. Enable workflow on `main` after first successful manual `workflow_dispatch`
