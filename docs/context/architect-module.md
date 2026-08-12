# Architect Module — PRODION.ai

Module owner: Architecture / PMO  
Status: active draft (Aug 2026)  
Source of truth: GitHub `eemmenisza/App-Integrations` → `docs/context/`  
Related: `architecture.md`, `architect-qaas-nvidia.md`, `openstack-migration.md`, `qaas-crm-people-sync.md`, `openclaw.md`, `infrastructure.md`

## 1. Purpose

The Architect Module is the **single index of plans** for PRODION products, integrations, infrastructure, agents, and compliance. It does not replace product backlogs; it defines **target architecture, plan streams, phases, and Owner Decision Queue** items.

## 2. Problem

PRODION spans MetricQS/QaaS, DebtFlow, LUPUS-X, OpenClaw, Monday CRM, Lovable/Supabase apps, Marija edge, and Icom/Hadefield OpenStack. Without a unified Architect Module, plans fragment across chats, training folders, and ad-hoc docs.

## 3. Goals

| ID | Goal | Success signal |
|---|---|---|
| G1 | One architecture map agents and humans share | This module + `architecture.md` current |
| G2 | Bankable infra path (POPIA) | Workloads land at Icom/Hadefield |
| G3 | CRM person/party integrity | Parties + People Pool daily sync live |
| G4 | Feasibility-first QaaS | Plans → quantities → feasibility on approved drawings |
| G5 | Agent hub operable | OpenClaw → Icom; Cursor↔GitHub SoT |

## 4. Current state (summary)

| Layer | Today | Tag |
|---|---|---|
| Knowledge | G: → rsync → D:\…\App-Integrations → GitHub | [STATED] |
| Apps | React/Lovable + Supabase (MVP-capable; free tiers limited) | [STATED] |
| CRM | Monday Parties + People Pool; sync scaffold only | [STATED] |
| Agents | OpenClaw on WSL :18789; systemd unavailable | [STATED] |
| Edge | 123 Marija: UniFi, Synology, dual ISP; Axxess CGNAT | [RETRIEVED] |
| Local staging | D:/E:/F: available (~9.3 TB free combined) | [RETRIEVED] |
| DC target | Icom / Hadefields Office Park — POPIA OpenStack | [STATED] |
| Identity | Entra SMS/voice retiring → passkeys (Sep 2026 / Feb 2027) | [RETRIEVED] |
| Models | Claude/OpenAI primary for code; **NVIDIA Nemotron/NIM planned for QaaS volume agents** | [STATED] |

## 5. Target architecture

```
[Clients] Cursor · Lovable · Claude · Monday · browsers
                │
                ▼
[SoT] GitHub App-Integrations (+ Actions CRM pull)
                │
        ┌───────┴───────┐
        ▼               ▼
[Edge Marija]     [DC Icom/Hadefield POPIA]
 UniFi · NAS         OpenStack · OpenClaw · NVIDIA NIM
 D/E/F staging       QaaS APIs · Nemotron skills · sync workers
 Cool Ideas VPN ─────┘
                │
                ▼
[Data] Supabase (SaaS until decided) · Monday · People/Parties
```

## 6. Plan streams (Architect Module sections)

Each stream has: **Outcome · Scope · Phases · Exit · Owner Decisions · Links**.

### 6.1 Stream A — Application (Lovable / React / Supabase)

| Field | Content |
|---|---|
| Outcome | MVP apps for MetricQS/QaaS (and siblings) on GitHub |
| Scope | Web React first; React Native/Expo deferred; no Odoo 500-table clone |
| Phases | A0 training/guidelines → A1 MVP schema+RLS → A2 auth/CRM hooks → A3 Pro quotas |
| Exit | Deployed MVP with RLS + GitHub CI |
| Decisions | Supabase free vs Pro; Expo yes/no |
| Links | `F:\temp\ai1\lovable\…` courses; Lovable stack notes |

### 6.2 Stream B — Data products & governance

| Field | Content |
|---|---|
| Outcome | Bounded data products with Minimum Lovable Governance |
| Scope | Parties, People Pool, quantities, feasibility packs |
| Phases | B0 MLG model → B1 5 data products → B2 ODPS/modern arch → B3 POPIA RoPA |
| Exit | Named products + owners + quality rules |
| Decisions | Product owners; classification of PII |
| Links | Data Products MLG masterclass folder |

### 6.3 Stream C — CRM sync (QaaS Parties · People Pool · Monday)

| Field | Content |
|---|---|
| Outcome | Daily reconcile via GitHub Actions |
| Scope | Pull Monday → snapshots (artifact) + manifest (git); later QaaS export |
| Phases | C0 secrets/vars → C1 first workflow_dispatch → C2 two-way → C3 Icom worker |
| Exit | Stable daily manifest; no PII in git |
| Decisions | Board IDs; email uniqueness SoR |
| Links | `qaas-crm-people-sync.md`, `scripts/sync-qaas-monday.mjs` |

### 6.4 Stream D — Infrastructure (Marija ↔ Icom OpenStack)

| Field | Content |
|---|---|
| Outcome | Hybrid: edge Marija + POPIA DC at Icom/Hadefield |
| Scope | VPN (prefer Cool Ideas), tenant, floating IP, Swift, OpenClaw VM |
| Phases | D0 inventory → D1 landing → D2 pilot → D3 cutover → D4 harden |
| Exit | Bastion + pilot SLA; WSL-as-server retired |
| Decisions | Quotas; WireGuard; Postgres on Cinder vs Supabase SaaS |
| Links | `openstack-migration.md`, `infrastructure.md` |

### 6.5 Stream E — Agent hub (OpenClaw · Cursor · Claude)

| Field | Content |
|---|---|
| Outcome | Always-on gateway at Icom; Cursor remains laptop IDE |
| Scope | Models auth, workspace = App-Integrations, attach Claude Code |
| Phases | E0 credentials → E1 gateway daemon → E2 Icom migrate → E3 skills |
| Exit | Dashboard healthy; coding tools on phishing-resistant auth |
| Decisions | Anthropic/OpenAI keys; wire NVIDIA via Stream H |
| Links | `openclaw.md`; build.nvidia.com; HF Nemotron v3 |

### 6.6 Stream F — Identity & MFA (Entra)

| Field | Content |
|---|---|
| Outcome | Passkeys default before Microsoft SMS/voice retirement |
| Scope | Tenant users on SMS/voice → passkeys (or Security Store telecom) |
| Phases | F0 inventory → F1 campaign → F2 enforce before 2027-02-01 |
| Exit | No user MFA-only on Microsoft SMS/voice |
| Decisions | Opt-out until Feb 2027?; telecom provider need? |
| Links | learn.microsoft.com Entra SMS/voice retirement |

### 6.7 Stream G — Eco / project delivery (993 Marija example)

| Field | Content |
|---|---|
| Outcome | Feasibility-first eco estate delivery when plans ingested |
| Scope | QaaS BoQ, MSSA architect, commons, 1-keep/3-sell, PPP later |
| Phases | P0–P4 as prior programme (approvals → commons → build → PPP → close) |
| Exit | HOA + funded + BoQ baseline |
| Decisions | Disbursement wording; approved drawing set |
| Links | Prior Marija plan canvas / brief (outside this repo if not committed) |

### 6.8 Stream H — QaaS + NVIDIA models (Nemotron / NIM)

| Field | Content |
|---|---|
| Outcome | QaaS volume agents on Nemotron; Claude/Cursor keep coding |
| Scope | H1–H6 plan sections: API trial → OpenClaw → skills → Omni → Icom NIM → POPIA |
| Phases | H0 smoke → H1 OpenClaw provider → H2 skill pack → H3 Omni pilot → H4 Icom NIM |
| Exit | ≥1 prod skill on Icom NIM; QS review gate intact |
| Decisions | Nano vs Super default; Omni yes/no; GPU budget |
| Links | **`architect-qaas-nvidia.md`** · build.nvidia.com · HF Nemotron v3 |

## 7. Cross-cutting programme phasing

| Wave | Months (indicative) | Streams | Exit |
|---|---|---|---|
| W0 Foundation | 0–1 | A0, B0, C0, D0, E0, F0, **H0** | Secrets, inventory, board IDs, NVIDIA key |
| W1 Landing | 1–3 | A1, C1, D1, E1, **H1** | MVP schema; CRM pull; Icom tenant; OpenClaw+NVIDIA |
| W2 Pilot | 3–6 | A2, B1, C2, D2, E2, **H2–H3** | Pilot app + QaaS skill dry-run + optional Omni |
| W3 Production | 6–9 | A3, D3, F1–F2, **H4** | Cutover; passkeys; Icom NIM for QaaS |
| W4 Harden | 9–12 | B2–B3, D4, E3 | DR, RoPA, skills, cost caps |

## 8. Non-goals

- Cloning Odoo’s 500+ table UI generator in Lovable  
- Private OpenStack on Synology alone  
- Committing CRM PII snapshots to GitHub  
- React Native in W0–W1  
- Replacing MetricQS measurement engine with an LLM  
- Sending live Parties/People PII to NVIDIA cloud trial  

## 9. Owner Decision Queue (module-level)

1. Supabase stay SaaS vs Postgres on Icom Cinder?  
2. Monday board IDs + `MONDAY_API_TOKEN` in GitHub?  
3. Cool Ideas as Marija↔Hadefield VPN path?  
4. **Approve NVIDIA Nemotron/NIM for QaaS volume agents (Stream H)?**  
5. Entra passkey campaign owner and date?  
6. Merge PR #1 (`cursor/openclaw-workspace-linkage`) to `main`?  
7. Nano vs Super default; Nano Omni for drawings?  

## 10. Immediate next steps

1. Confirm Streams A–H owners (names).  
2. Close DQ #2, #3, #4 to unblock C1/D1/H0.  
3. Keep Architect Module + `architect-qaas-nvidia.md` updated when Stream H changes.  
4. Open canvases: `architect-module-plans` and `architect-qaas-nvidia-plans`.  

## 11. Document control

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-12 | Initial Architect Module with plan streams A–G |
| 0.2 | 2026-08-12 | Stream H — QaaS + NVIDIA Nemotron/NIM plan sections |
