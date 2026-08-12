# OpenClaw — Command Hub linkage

Installed: WSL2 · OpenClaw 2026.7.1-2  
Workspace: `/mnt/d/Backup/100_CLEAN_UP/App-Integrations`  
Gateway: loopback `:18789` (token auth)  
Daemon: systemd user services unavailable in this WSL session — use `openclaw gateway run`

## Architecture

```
G:\... Markdown knowledge
        │ rsync
        ▼
D:\Backup\100_CLEAN_UP\App-Integrations
(= WSL /mnt/d/Backup/100_CLEAN_UP/App-Integrations)
        │
        ├── AGENTS.md / CLAUDE.md / AI_CONTEXT.md
        ├── docs/context/*.md
        └── application source
                 │
                 ▼
              GitHub (source of truth)
                 │
       ┌─────────┼─────────┬──────────┬──────────┐
       ▼         ▼         ▼          ▼          ▼
    Lovable   Claude    OpenAI     Cursor    Monday CRM
              (+ Code)  (+ Codex)  ◄──────►  (CRM / work)
                 \         /         ▲
                  \       /          │ GitHub integrate
                   ▼     ▼           │
                 OpenClaw Gateway (WSL → Icom)
```

See also: `docs/context/architecture.md`.

## Link targets

| System | How it connects | Status |
|---|---|---|
| Cursor | IDE on this repo; **GitHub integrate now** (branch/PR/push) | Active |
| GitHub | Source of truth for code + context docs | Active |
| Monday CRM | Parties CRM + People Pool boards; daily GitHub pull | Scaffold ready |
| QaaS Parties CRM | Operational parties; reconcile with Monday Parties | Needs export/API |
| People Pool | Person master shared `person_id` | Needs board ID var |
| Claude | `openclaw onboard` Anthropic API key or `claude-cli` / setup-token; `openclaw attach` for Claude Code | Needs credentials |
| OpenAI | `openclaw onboard` `openai-api-key` or Codex device code | Needs credentials |
| Lovable | Consumes GitHub App-Integrations; no direct OpenClaw install | Via GitHub push |
| Agent workflows | OpenClaw Gateway agents + Cursor/Claude on same workspace | Workspace linked |
| WSL project files | Workspace path set to App-Integrations mount | Done |

## Operator commands (WSL)

```bash
export PATH="$HOME/.npm-global/bin:$PATH"
openclaw gateway run          # start gateway (no systemd)
openclaw dashboard            # Control UI
openclaw configure            # interactive models/channels
openclaw onboard              # re-run auth (Claude / OpenAI)
openclaw attach               # attach Claude Code to gateway session
openclaw doctor
```

## Owner Decision Queue

1. Provide Anthropic and/or OpenAI credentials via interactive WSL `openclaw onboard` (prefer 1Password; avoid pasting secrets into chat).
2. Enable WSL systemd user services if a persistent Gateway daemon is required.
3. Complete GitHub push auth so Lovable sees context docs.
4. Supply Monday API token + Parties / People Pool board IDs for daily GitHub pull (`docs/context/qaas-crm-people-sync.md`).
