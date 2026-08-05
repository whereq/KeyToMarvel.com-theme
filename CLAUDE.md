# KeyToMarvel.com-theme — Claude Code Instructions

## Environment

- **Local dev**: WSL (Windows Subsystem for Linux)
- **PROD (current)**: New server. It has **two SSH entry points depending on network location** — both reach the same box:
  - **Inside home (LAN)**: `ssh whereq@whereq` (the `whereq` host resolves to a home LAN IP, e.g. `192.168.0.199`).
  - **Outside home**: `ssh ssh.whereq.com`.
  - **Auto-detect which to use** when the user hasn't said where they are: probe the LAN host first with a short timeout —
    `ssh -o ConnectTimeout=6 -o BatchMode=yes whereq@whereq 'echo ok'`. If it prints `ok`, you're inside home; if it times out / connection-refused, you're outside → use `ssh ssh.whereq.com`. Don't ask the user; determine it yourself.
  - The git repos live under `/home/whereq/git` (e.g. `/home/whereq/git/KeyToMarvel.com-theme`).
  - Keycloak runs in Docker: containers `keycloak-k2m` (server) and `whereq-db` (Postgres, db `k2m`, user `whereq`).
  - Keycloak volumes: `/home/whereq/git/KeyToMarvel.com/docker/volumes/keycloak` (`providers/` for theme JARs, `themes/` for exploded themes).
  - **Always use this new server for PROD work.** Do NOT use the old Raspberry Pi (`ssh whereq@rp4`), which is retired.
- **PROD (retired)**: old Raspberry Pi via `ssh whereq@rp4` — no longer used.
- When the user pastes screenshot paths in Windows format (e.g., `C:\Users\...`), mount and read them via the WSL path (e.g., `/mnt/c/Users/...`).

## Tech Stack

- Keycloakify, React, TailwindCSS, Yarn, Vite

## Development Workflow

- **Primary debug**: `yarn storybook` or `yarn dev` — use these for the vast majority of changes.
- **Backend integration testing**: package the theme JAR and deploy to KeyToMarvel.com (only when testing requires backend).
- Default to Storybook/Vite local debugging unless the task explicitly requires backend integration.
