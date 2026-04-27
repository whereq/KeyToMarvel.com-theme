# KeyToMarvel.com-theme — Claude Code Instructions

## Environment

- **Local dev**: WSL (Windows Subsystem for Linux)
- **PROD**: Raspberry Pi — accessible via `ssh whereq@rp4`
- When the user pastes screenshot paths in Windows format (e.g., `C:\Users\...`), mount and read them via the WSL path (e.g., `/mnt/c/Users/...`).

## Tech Stack

- Keycloakify, React, TailwindCSS, Yarn, Vite

## Development Workflow

- **Primary debug**: `yarn storybook` or `yarn dev` — use these for the vast majority of changes.
- **Backend integration testing**: package the theme JAR and deploy to KeyToMarvel.com (only when testing requires backend).
- Default to Storybook/Vite local debugging unless the task explicitly requires backend integration.
