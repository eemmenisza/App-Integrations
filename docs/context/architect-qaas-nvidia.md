# Architect Module — QaaS plan sections (NVIDIA models)

Parent: `docs/context/architect-module.md` (Stream **H** + Stream **G** eco delivery)  
Status: draft (Aug 2026)  
Products: MetricQS / **QaaS** (Quantity Surveyor AI)  
Models: **NVIDIA Nemotron v3** via **NIM** (build.nvidia.com → self-host at Icom)

## 1. Purpose

Define plan sections for QaaS that use **NVIDIA models** for high-volume, POPIA-aware agent work (takeoff assist, BoQ classification, variance narrative, CRM party matching), while **Claude/Cursor** remain primary for application code and architecture edits. [GENERATED]

## 2. Problem

QaaS needs: ingest approved plans → quantities (ASAQS) → valuations → feasibility. That creates many repetitive NLP/vision/classification tasks. Cloud Claude/OpenAI alone is costly and may keep personal/project data off-POPIA path. NVIDIA Nemotron/NIM gives an open, GPU-deployable path at **Icom/Hadefield**. [INFERRED]

## 3. Goals

| ID | Goal | Success signal |
|---|---|---|
| QG1 | QaaS agent skills run on NVIDIA for volume tasks | ≥1 skill on NIM/Nemotron in pilot |
| QG2 | Phishing-resistant / controllable inference path | API key trial → Icom NIM |
| QG3 | Keep human QS + ASAQS rules authoritative | Model outputs always reviewable |
| QG4 | Align Parties/People with QaaS project contacts | Stream C sync + QaaS party_id |
| QG5 | Feasibility pack generation assisted, not unsupervised | Signed QS acceptance gate |

## 4. Model routing (QaaS)

| Workload | Model preference | Why |
|---|---|---|
| App/code (Lovable, sync scripts, RLS) | Claude / Cursor | Quality for engineering [STATED] |
| BoQ line classification, unit hints, narrative | **Nemotron 3 Nano** (or Nano Omni if drawings/images) | Throughput / cost [GENERATED] |
| Multi-step feasibility reasoning, risk register draft | **Nemotron 3 Super** | Tool-calling / reasoning [GENERATED] |
| Heavy multi-doc synthesis (optional later) | Nemotron Ultra or keep Claude | Cost vs accuracy trade-off [GENERATED] |
| Safety / content filter on user uploads | Nemotron safety models (catalog) | Guardrails [INFERRED] |

**Authoritative systems (never model-only):** ASAQS rules, MetricQS ground truth, approved CAD/PDF geometry, signed rates. [STATED]

## 5. QaaS NVIDIA agent plan sections

### 5.1 Section H1 — Discovery & API trial

| Field | Content |
|---|---|
| Outcome | NVIDIA API key + smoke test Nemotron from build.nvidia.com |
| Scope | OpenAI-compatible `https://integrate.api.nvidia.com/v1`; no PII in trial prompts |
| Exit | Logged sample completion for Nano (and optional Omni) |
| Decisions | Which catalog model IDs for Nano / Super |
| Links | https://build.nvidia.com/explore/discover · HF Nemotron v3 collection |

### 5.2 Section H2 — OpenClaw provider wiring

| Field | Content |
|---|---|
| Outcome | OpenClaw can call NVIDIA as custom OpenAI-compatible provider |
| Scope | WSL gateway first; secrets in 1Password / env — not git |
| Exit | `openclaw` agent turn succeeds with Nemotron model id |
| Decisions | Default QaaS skill model = Nano vs Super |
| Links | `openclaw.md` |

### 5.3 Section H3 — QaaS skill pack (NVIDIA-backed)

| Field | Content |
|---|---|
| Outcome | Named skills: `qaas.classify-boq`, `qaas.variance-narrate`, `qaas.party-match`, `qaas.feasibility-draft` |
| Scope | Inputs from MetricQS/Supabase exports; outputs JSON schemas; human approve |
| Exit | 4 skills documented + dry-run on QAAS-TEST-01 fixture (not live Marija PII) |
| Decisions | JSON schema ownership; rejection/retry policy |
| Links | Local fixture QAAS-TEST-01; Marija plans when approved |

### 5.4 Section H4 — Vision / drawings (optional Omni)

| Field | Content |
|---|---|
| Outcome | Assist sheet labelling / legend extraction from plan images |
| Scope | **Assist only** — not substitute for PDF/DWG/IFC takeoff |
| Exit | Pilot on redacted sheets; QS confirms usefulness |
| Decisions | Enable Nano Omni yes/no |
| Links | Nemotron 3 Nano Omni docs |

### 5.5 Section H5 — Icom NIM production

| Field | Content |
|---|---|
| Outcome | Self-hosted NIM at Icom/Hadefield for POPIA QaaS inference |
| Scope | GPU quota, network isolated to QaaS VPC; Cool Ideas VPN from Marija |
| Exit | Latency/SLO met; trial API key retired for prod traffic |
| Decisions | GPU SKU; Nano only vs Nano+Super |
| Links | `openstack-migration.md` Stream D |

### 5.6 Section H6 — Governance & POPIA

| Field | Content |
|---|---|
| Outcome | RoPA entry for QaaS AI processing; no CRM PII in cloud trial |
| Scope | Prompt logging policy; retention on Icom; Parties/People keys only |
| Exit | Signed processing description + model card refs |
| Decisions | Log prompts yes/no; retention days |
| Links | MLG masterclass; Architect Module Stream B |

## 6. Phases (Stream H)

| Phase | Window | Focus | Exit |
|---|---|---|---|
| H0 | Mo 0–1 | API key, model pick, no-PII smoke tests | Catalog models confirmed |
| H1 | Mo 1–2 | OpenClaw NVIDIA provider | One successful agent turn |
| H2 | Mo 2–4 | Skill pack on fixtures | 4 skills dry-run OK |
| H3 | Mo 4–6 | Optional Omni + Marija redacted pilot | QS sign-off on assist value |
| H4 | Mo 6–9 | Icom NIM cutover | Prod traffic on DC GPUs |

Aligns with Architect waves **W1–W3**. [GENERATED]

## 7. Target flow

```
Approved plans (PDF/DWG/IFC) → MetricQS / QaaS core (authoritative quantities)
                │
                ▼
        QaaS skill pack ──► NVIDIA Nemotron (Nano/Super/Omni)
                │                 │
                │                 ├─ Trial: build.nvidia.com NIM API
                │                 └─ Prod: Icom NIM (POPIA)
                ▼
        Human QS review → BoQ / feasibility pack → Parties CRM (Monday sync)
```

## 8. Non-goals

- Replacing MetricQS measurement engine with an LLM  
- Sending live Parties/People PII to NVIDIA cloud trial  
- Using Nemotron as sole coder instead of Claude/Cursor  

## 9. Owner Decision Queue

1. Approve NVIDIA as **QaaS volume model** provider (yes/no)?  
2. Start on **build.nvidia.com** trial then Icom NIM — confirm?  
3. Default skill model: **Nano** vs **Super**?  
4. Enable **Nano Omni** for drawing assist?  
5. GPU budget at Icom for NIM (ZAR/mo)?  
6. Store `NVIDIA_API_KEY` in 1Password + OpenClaw env (not git)?  

## 10. Immediate next steps

1. Create NVIDIA API key; smoke-test Nano chat completion (synthetic BoQ lines only).  
2. Document model IDs chosen in this file.  
3. Wire OpenClaw custom provider (H1).  
4. Implement `qaas.classify-boq` dry-run against QAAS-TEST-01.  
