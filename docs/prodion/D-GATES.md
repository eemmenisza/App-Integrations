# Prodion OpenStack / Proxmox — autonomous pack

Date: 2026-09-03 06:55 SAST  
Score: **D 0/12** — no gate evidence  
Runtime: volume `D:` (pre-Icom)  
Target: Icom Pretoria DC — **not live**

## Hard locks

- Do not install OpenStack as files on Windows `D:`.
- Do not wipe the Windows boot disk.
- Do not increment `D n/12` without Georges/Elmar evidence.
- Do not mark UAT PASS without Piet/AJ evidence.
- Product chrome name: **Take-off** only.
- No GPU vendor commit before ~50-drawing benchmark.

## ISO (hypervisor, not the app)

- File: `proxmox-ve_9.2-1.iso`
- SHA256: `4e88fe416df9b527624a175f24c9aa07c714d3332afb1ee3dbf3879573ef2c6c`
- Official: https://www.proxmox.com/en/downloads/proxmox-virtual-environment/iso/proxmox-ve-9-2-iso-installer
- Last seen 2026-09-03 06:54 SAST: curl ~38% / 628MB of 1.58G in PowerShell ISE
- After 100%:

```powershell
Get-Item D:\proxmox-ve_9.2-1.iso | Select FullName, Length
Get-FileHash D:\proxmox-ve_9.2-1.iso -Algorithm SHA256
```

Then Rufus **DD mode** or balenaEtcher. Boot a **dedicated** box.

## D1–D12

| Gate | Meaning | Evidence required |
|---|---|---|
| D1 | Access / jump / console | IP:8006 or IPMI screenshot |
| D2 | Proxmox cluster | `pveversion -v` + node list |
| D3 | Control plane | Keystone/Horizon or chosen CP health |
| D4 | qaas-uat | URL + deploy SHA |
| D5 | qaas-prod | URL + deploy SHA |
| D6 | TLS / VLAN | cert + VLAN id |
| D7 | IdP | Authentik/Keycloak realm live |
| D8 | Object store | bucket write test |
| D9 | Core image | golden image id |
| D10 | One extract job | job id + output hash |
| D11 | Audit trail | sample event |
| D12 | GPU hold + POPIA-ZA | hold note + ZA processing location |

## Tool split

| Tool | Job |
|---|---|
| Grok Bot 07:00 SAST | Board only |
| Cursor + Claude Code | App kernel on `build-quantify` |
| Georges | Keep `D:` stack up; land Icom D1–D3 |
| This pack | Checklist only |

## GitHub visibility 2026-09-03

- Token user: `eemmenisza`
- Visible: `App-Integrations`, empty `Consolidated-Dev001`
- `build-quantify` did not resolve on first connect
