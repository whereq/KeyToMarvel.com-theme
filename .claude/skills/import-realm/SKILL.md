---
name: import-realm
description: Import a Keycloak realm from a realm-representation JSON into the shared KeyToMarvel.com Keycloak, idempotently and WITHOUT restarting the server (no downtime for other realms/apps). Use when asked to "import a realm", "create the <app> realm from the JSON", "load a realm export", or to provision an app's clients + roles (e.g. chroniq.cc-realm.json). Drives kcadm.sh via docker exec; new realm → create, existing realm → partialImport. Complements onboard-realm (which does SMTP/IdPs/themes).
---

# import-realm

Import an app's realm (its **clients + roles + service-account role mappings**) from a
realm-representation JSON into the shared Keycloak, with **zero restart** so the other
realms (flowdesk.top, catobigato, whereq, …) stay online. The heavy lifting is a
self-contained, **idempotent** script — re-running is safe.

This complements the **`onboard-realm`** skill: that one owns realm login settings,
themes, SMTP, and the Google/WeChat identity providers + avatar mappers; **this** one
owns the app's clients, roles, and service account. Typical flow for a brand-new app:
run `import-realm` for the clients/roles, then `onboard-realm` for SMTP/IdPs.

## When to use / not use

- ✅ Adding a new app realm (or its clients/roles) to a **running** shared Keycloak.
- ✅ Re-applying an updated `*-realm.json` (idempotent via partialImport OVERWRITE).
- ❌ Not for SMTP/IdP/theme setup — use `onboard-realm`.

## Method & the gotchas it avoids

The **only safe way** to import into a running shared instance is `kcadm.sh` over
`docker exec` (Admin REST) — no restart. The script uses:

- new realm → `kcadm create realms -f <file>`
- existing realm → `kcadm create partialImport -r <realm> -s ifResourceExists=OVERWRITE -f <file>`

It deliberately does **not** use:

- `kc.sh bootstrap-admin` — on a running server it tries to bind the management
  port (9000) the live server already holds, and fails. (Learned the hard way.)
- `--import-realm` at boot — only runs at startup, i.e. requires a **restart** that
  interrupts every realm on the shared instance.

## Prerequisites

- Run on the host that owns the Keycloak container.
  - PROD: reach it first (e.g. `ssh whereq@whereq`); container `keycloak-k2m`.
  - WSL local: container `docker-keycloak-1` (pass `--container docker-keycloak-1`).
- Host has `docker` (+ `python3` for JSON validation).
- The **master admin** username + password (PROD default user: `whereq-admin`).
- A **secret-free** realm JSON: the confidential client's `secret` must be a
  placeholder (e.g. `CHANGE_ME_REGENERATE_AFTER_IMPORT`) — never commit real
  secrets. See `chroniq.cc/keycloak/chroniq.cc-realm.json` as the canonical template.

## How to run

Password can be supplied three ways (or reuse an existing session):

```bash
cd .claude/skills/import-realm

# 1) Prompt at runtime (secure; nothing in shell history)
./import-realm.sh /path/to/chroniq.cc-realm.json

# 2) Env var (non-interactive / CI)
KC_ADMIN_PASSWORD='…' ./import-realm.sh /path/to/chroniq.cc-realm.json

# 3) Flag
./import-realm.sh /path/to/chroniq.cc-realm.json --password '…'

# Reuse a session you already logged in with (kcadm config credentials):
./import-realm.sh /path/to/chroniq.cc-realm.json --use-session

# Preview only:
./import-realm.sh /path/to/chroniq.cc-realm.json --dry-run

# WSL local container + regenerate the backend secret after import:
./import-realm.sh chroniq.cc-realm.json --container docker-keycloak-1 --regen-secret chroniq-backend
```

The password is forwarded to the container via a **forwarded env var** (`docker exec -e KC_PW`),
so it never appears in any process argv on host or container.

## What it does

1. Validates the JSON and reads the `realm` name.
2. Authenticates `kcadm` (flag / env / prompt / existing session).
3. Copies the file into the container (`/tmp/<name>.json`).
4. Detects whether the realm exists → `create realms` (new) or `partialImport`
   (existing; `--on-exists overwrite|skip|fail`, default overwrite).
5. Optionally regenerates a confidential client secret (`--regen-secret`).
6. Verifies: prints realm enabled state, clients, and realm roles.
7. Prints the post-import checklist.

## Post-import (the script reminds you)

1. Regenerate the `*-backend` client secret → app backend env (`KEYCLOAK_ADMIN_CLIENT_SECRET`).
2. Confirm the service account has `realm-management: manage-users, view-realm`.
3. Ensure the realm login theme is deployed (else set `k2m-theme-vegeta` temporarily).
4. Run `onboard-realm` for SMTP / Google / WeChat / avatar.

## Notes

- **Idempotent:** safe to re-run; existing clients/roles are overwritten, not duplicated.
- **Never** commit a realm JSON containing a real client secret; ship a placeholder.
- Role/entitlement changes take effect on the user's next token refresh (≤60s).
