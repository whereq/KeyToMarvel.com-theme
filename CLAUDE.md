# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A **collection of independent Keycloakify themes** for the shared KeyToMarvel.com Keycloak
server. Each `k2m-theme-*` directory is a **self-contained project** with its own
`package.json`, `yarn.lock`, `node_modules`, and Vite/Keycloakify config. There is **no root
package.json and no workspace** — you `cd` into a theme directory to work on it.

Themes (alias → directory → internal name used in the JAR/DB):

| Alias        | Directory              | Internal name           | Notes |
|--------------|------------------------|-------------------------|-------|
| `superhero`  | `k2m-theme-superhero`  | `k2m-theme-superhero`   | has extra theme dirs |
| `morph`      | `k2m-theme-morph`      | `keytomarvel-com-theme` | has extra theme dirs |
| `vegeta`     | `k2m-theme-vegeta`     | `k2m-theme-vegeta`      | default theme for most realms + email; has welcome page |
| `flowdesk`   | `k2m-theme-flowdesk`   | `k2m-theme-flowdesk`    | login only |
| `chroniq`    | `k2m-theme-chroniq`    | `k2m-theme-chroniq`     | login only |
| `catobigato` | `k2m-theme-catobigato` | `k2m-theme-catobigato`  | login only |
| `whereq.com` | `k2m-theme-whereq-com` | `k2m-theme-whereq-com`  | login only |

The authoritative registry (which realms use which theme for login/account/admin/email) lives
in `bin/deploy.sh` (`THEME_REGISTRY` and `REALM_THEME_MAP`). `vegeta` is the fullest theme
(login + account + admin + email) and is the fallback for account/admin/email on most realms.

## Commands

Run these **inside a theme directory** (e.g. `cd k2m-theme-vegeta`):

- `yarn dev` — Vite dev server with mocked `kcContext`. Binds `0.0.0.0` so a Windows browser can
  reach WSL2. Switch the page under test via `?ui_locales=<tag>` and the `pageId` in
  `src/main.tsx`.
- `yarn storybook` — Storybook (vegeta on port 6007). Primary way to iterate on pages.
- `yarn build` — `tsc -b && vite build`.
- `yarn build-keycloak-theme` — full build → produces the deployable JAR at
  `dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar` (same filename for every theme).
- `yarn lint` — ESLint over the theme.

**Prefer `yarn dev` / `yarn storybook`** for the vast majority of changes. Only build the JAR
and deploy to the backend when a change genuinely requires a running Keycloak (see
`docs/Local_Debug.md` for `npx keycloakify start-keycloak --external` and DevTools override
tricks).

Note: Tailwind version differs across themes — newer themes (vegeta, chroniq, flowdesk,
whereq-com) use **Tailwind v4** via `@tailwindcss/vite` (no `tailwind.config.js`); older ones
(superhero, morph) use Tailwind v3 with `tailwind.config.js` + `postcss.config.js`. Check the
theme before assuming.

## Theme architecture

Each theme's source lives under `src/keycloak-theme/`, split by Keycloak theme type:
`login/`, `account/`, `admin/`, `email/`, `welcome/`, plus shared `layout/`, `profile/`, and
`shared/` (vendored PatternFly / keycloak-ui-shared components + a custom `shared/ui/` design
system: `Button`, `Input`, `Card`, `FormField`, etc.).

- `src/main.tsx` — dev/entry bootstrap. In `import.meta.env.DEV` it injects a mock
  `window.kcContext` (page + locale + social providers) so pages render without a backend; in a
  real deploy it renders `KcPage` against the server-provided context.
- `login/KcPage.tsx` — the router: a `switch (kcContext.pageId)` mapping each `*.ftl` page to a
  lazy-loaded component under `login/pages/`. `doUseDefaultCss = false` — these themes fully
  replace Keycloak's stock CSS. To add/customize a page, add its component and a case here.
- `layout/Template.tsx` + `layout/i18n.ts` — shared page shell and i18n wiring. Custom message
  overrides live in `login/messages/messages_<locale>.properties`.
- `kc.gen.tsx` is **generated** (by `keycloakify sync-extensions`, run on `postinstall`) — do
  not hand-edit.
- Path aliases (in each `vite.config.ts`): `@` → `/src`, `@keycloak-theme` → `/src/keycloak-theme`.

When creating a new theme, the fastest path is copying an existing similar one (e.g. whereq-com
was copied from flowdesk) and updating `themeName` in `vite.config.ts`, the design tokens/CSS,
messages, and the registry entries in `bin/deploy.sh`.

## Release & deploy workflow

Two scripts at the repo root orchestrate the full cycle:

- **`bin/release.sh -m "message"`** (run locally) — stages, commits, squashes commits ahead of
  origin, auto-increments a `vX.Y.Z` tag, and pushes `main` + tags. Merges a dev branch into
  `main` first if you're on one. `--dry-run` and `--no-squash` supported.
- **`bin/deploy.sh <alias>`** (run **on the PROD server**) — pulls `main`, builds the theme,
  copies the JAR to the Keycloak `providers/` dir renamed to `<internal-name>.jar` (one JAR per
  theme so they never overwrite each other), copies welcome/extra theme dirs where applicable,
  restarts the `keycloak-k2m` container, then verifies/repairs the `realm` table's
  `login_theme`/`account_theme`/`admin_theme`/`email_theme` columns against `REALM_THEME_MAP`.
  Flags: `--skip-build`, `--skip-pull`, `--dry-run`, `--db-only`, `--list`.

Typical flow: make changes → test in `yarn dev`/`storybook` → `bin/release.sh -m "..."` locally
→ SSH to PROD → `bin/deploy.sh <alias>`.

## Environment

- **Local dev**: WSL (Windows Subsystem for Linux).
- **PROD (current)**: New server with **two SSH entry points depending on network location** —
  both reach the same box:
  - **Inside home (LAN)**: `ssh whereq@whereq` (resolves to a home LAN IP, e.g. `192.168.0.199`).
  - **Outside home**: `ssh ssh.whereq.com`.
  - **Auto-detect** when the user hasn't said where they are: probe the LAN host first —
    `ssh -o ConnectTimeout=6 -o BatchMode=yes whereq@whereq 'echo ok'`. Prints `ok` → inside
    home; times out / refused → use `ssh ssh.whereq.com`. Determine it yourself; don't ask.
  - Git repos live under `/home/whereq/git` (e.g. `/home/whereq/git/KeyToMarvel.com-theme`).
  - Keycloak runs in Docker: containers `keycloak-k2m` (server) and `whereq-db` (Postgres, db
    `k2m`, user `whereq`).
  - Keycloak volumes: `/home/whereq/git/KeyToMarvel.com/docker/volumes/keycloak` — `providers/`
    for theme JARs, `themes/` for exploded themes.
  - **Always use this new server for PROD work.** Do NOT use the old Raspberry Pi
    (`ssh whereq@rp4`), which is retired.
- When the user pastes Windows screenshot paths (e.g. `C:\Users\...`), read them via the WSL
  path (e.g. `/mnt/c/Users/...`).
