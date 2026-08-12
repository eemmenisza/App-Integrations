# Architecture — PRODION.ai integrations

GitHub (`eemmenisza/App-Integrations`) is the **source of truth** for application and context docs. [STATED]

**Architect Module (plans):** `docs/context/architect-module.md` — streams A–H, waves W0–W4.  
**QaaS + NVIDIA:** `docs/context/architect-qaas-nvidia.md` — sections H1–H6 (Nemotron/NIM).

## System map

```
G:\... Markdown knowledge
        │ rsync
        ▼
D:\Backup\100_CLEAN_UP\App-Integrations
(= WSL /mnt/d/.../App-Integrations)
        │
        ├── AGENTS.md / CLAUDE.md / AI_CONTEXT.md
        ├── docs/context/*.md
        ├── scripts/sync-qaas-monday.mjs
        └── .github/workflows/qaas-monday-daily.yml
                 │
                 ▼
              GitHub (source of truth)
                 │ daily cron pull
                 │
       ┌─────────┼─────────┬──────────┬────────────────────┐
       ▼         ▼         ▼          ▼                    ▼
    Lovable   Claude    OpenAI     Cursor              Monday.com
              (+ Code)  (+ Codex)  ◄──────►                │
                 \         /         ▲                     │
                  \       /          │              ┌──────┴──────┐
                   ▼     ▼           │              ▼             ▼
                 OpenClaw Gateway    │      Parties CRM     People Pool
                 (WSL → Icom)        │              │             │
                                     │              └──────┬──────┘
                                     │                     ▼
                                     │              QaaS Parties
                                     └─────────────────────┘
```

## Integration roles

| System | Role | Link |
|---|---|---|
| **GitHub** | SoT + daily CRM pull orchestration | Actions workflow + Cursor |
| **Cursor** | Primary IDE / agent coding | GitHub integrate now [STATED] |
| **Monday.com** | Parties CRM + People Pool boards | Daily GraphQL pull [STATED] |
| **QaaS Parties CRM** | Operational parties / roles | Reconcile with Monday Parties |
| **People Pool** | Person master (`person_id`) | Monday board + QaaS person keys |
| Lovable | App UI path | Consumes GitHub |
| Claude / OpenAI | Models | OpenClaw + Cursor |
| OpenClaw | Command hub | Workspace → Icom/Hadefield |
| Supabase | App data | MetricQS/QaaS, DebtFlow, LUPUS-X |

## GitHub ↔ Cursor [STATED]

- Workspace: `D:\Backup\100_CLEAN_UP\App-Integrations`
- Branch/PR/push against `https://github.com/eemmenisza/App-Integrations.git`
- Agents follow `AGENTS.md`, `AI_CONTEXT.md`, `docs/context/*.md`

## QaaS Parties + People Pool + Monday [STATED]

- Daily pull via `.github/workflows/qaas-monday-daily.yml` (02:00 UTC)
- Script: `scripts/sync-qaas-monday.mjs`
- Contract: `docs/context/qaas-crm-people-sync.md`
- Manifest committed at `data/crm/manifest.json`; PII snapshots gitignored / Actions artifacts
- POPIA: production processing → Icom/Hadefield when not covered by SaaS operator terms

## Owner Decision Queue

1. Set GitHub secret `MONDAY_API_TOKEN` + vars `MONDAY_PARTIES_BOARD_ID`, `MONDAY_PEOPLE_POOL_BOARD_ID`
2. Optional secret `QAAS_PARTIES_EXPORT_URL` for two-way reconcile
3. Enable Monday↔GitHub delivery integration (PRs) separately from CRM pull?
4. Email uniqueness owner: People Pool vs Parties?
5. First manual `workflow_dispatch` on `main` after merge?
