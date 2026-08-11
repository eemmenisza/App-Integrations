# OpenStack migration plan — PRODION.ai

Status: draft plan (Aug 2026)  
Topology: **hybrid** — Icom datacenter OpenStack for always-on / POPIA workloads; Marija premises for edge/LAN/NAS; local D:/E:/F: for staging & DR landing.

## Datacenter target [STATED]

**Final target:** Icom Servers / infrastructure at **Hadefields Office Park** (Hatfield, Pretoria) — **POPIA-compliant** datacenter for production OpenStack.

Address reference (public listing): Block B, Hadefields Office Park, 1267 Pretorius Street, Hatfield, Pretoria, 0083 · I-Com Services. [RETRIEVED]

## Recommendation [GENERATED]

Migrate always-on compute, personal-data processing, and production APIs to **OpenStack at Icom / Hadefield**. Keep Marija (UDM, Synology, solar) as edge. Use local **D:/E:/F:** only for staging, image cache, migration scratch, and DR pull — not the production control plane.

## Local PC storage [RETRIEVED]

Measured Aug 2026 on operator PC (NTFS):

| Drive | Total | Free | Planned role |
|---|---|---|---|
| D: | ~7.45 TB | ~7.11 TB | Existing Backup + App-Integrations mirror; migration scratch / image library |
| E: | ~932 GB | ~893 GB | Staging / VM disks / OpenClaw local overflow |
| F: | ~932 GB | ~931 GB | Cold backup / Swift sync landing / DR pull |

## Network path [RETRIEVED] + [INFERRED]

- Site A (edge): 123 Marija — UniFi UDM Pro Max `192.168.1.1`
- Axxess VAN7448: CGNAT `100.67.201.130` (static billed, not terminating correctly) — **do not** rely for DC VPN
- Prefer **Cool Ideas FTTX262093** (or dedicated link) for Marija ↔ Hadefield / Icom VPN
- Site B (DC): Icom @ Hadefield — POPIA processing location for in-scope personal information

## Phases

| Phase | Window | Focus | Exit |
|---|---|---|---|
| P0 Decide | Mo 0–1 | Inventory, POPIA scope, CGNAT path, Icom capacity confirm | Workload + data-classification matrix |
| P1 Landing | Mo 1–2 | Icom OpenStack tenant, nets, VPN, Swift/S3, secrets | Bastion SSH + backup bucket at Icom |
| P2 Pilot | Mo 2–4 | OpenClaw VM + one app staging at Icom | 2-week pilot SLA |
| P3 Cutover | Mo 4–7 | Dual-run → prod at Hadefield; retire WSL-as-server | DNS live; POPIA processing in DC |
| P4 Harden | Mo 7–9 | DR restore (F: + Synology ↔ Icom), cost, runbooks | Signed close-out |

## Move vs stay

**Move to Icom/Hadefield OpenStack:** OpenClaw Gateway, app API/workers holding personal data, object backups of in-scope datasets, optional CI runners.  
**Stay (initially):** UniFi/IoT, Synology shares, solar, Supabase SaaS (confirm POPIA operator agreement), Cursor/Claude/Lovable/Monday CRM clients, G:→rsync knowledge path, GitHub SoT (+ Cursor integrate), local **D:/E:/F:** staging & DR landing.

## Owner Decision Queue

1. ~~Public OpenStack vs private CapEx?~~ → **Decided: Icom / Hadefield POPIA DC** [STATED]
2. Cool Ideas as primary Marija↔Hadefield VPN / public-IP path?
3. Supabase stay SaaS (with operator contract) vs Postgres on Icom Cinder?
4. Pilot product: MetricQS / DebtFlow / LUPUS-X?
5. ZAR/mo budget + OpenClaw HA need at Icom?
6. POPIA records of processing + operator agreement with Icom signed?
7. Commit this file + merge feature branch to `main`?

## Immediate next steps

1. Confirm Icom OpenStack project quotas (vCPU/RAM/disk/floating IP) and POPIA operator schedule  
2. Answer DQ #2–#3 and #6  
3. Workload + data-classification matrix (CPU/RAM/disk, ports, RPO/RTO, personal-data flag)  
4. WireGuard/IPsec prototype: UDM → Icom VPC via Cool Ideas  
5. Assign folders on D:/E:/F: (e.g. `D:\openstack\images`, `E:\openstack\staging`, `F:\openstack\dr`)  
