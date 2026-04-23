# k2m-theme-superhero — Dependency Gap Report

> Generated: 2026-04-22  
> Purpose: Track version gaps between currently pinned dependencies and latest available releases, to guide future upgrade decisions.

---

## Keycloakify Core

| Package | Pinned in package.json | Installed | Latest (npm) | Gap |
|---------|----------------------|-----------|--------------|-----|
| `keycloakify` | `11.8.22` (exact) | `11.15.3` | `11.15.3` | 7 patch/minor releases |

**Notable changes between 11.8.22 → 11.15.3:**
- `KcContext` extended with `RequiredActionProviderModel` (v11.15.1)
- `KcSanitizer` now permits `target="_blank"` on anchor elements (v11.14.1)
- Early color scheme support added (v11.14.0)
- Various bug fixes: login link visibility, LoginPassword element wrapping, message header translation
- **No breaking API changes** — theme component code requires no changes

**Upgrade path:** Bump `"keycloakify": "11.8.22"` → `"keycloakify": "11.15.3"` and run `yarn install`. Low risk.

---

## Keycloakify UI Packages (must be upgraded together)

These three packages track the Keycloak server version. The version encoding is `KKMMPP.x.y` where `KK`=KC major, `MM`=KC minor, `PP`=KC patch.

| Package | Pinned | Installed | Latest | Tracks KC version |
|---------|--------|-----------|--------|------------------|
| `@keycloakify/keycloak-account-ui` | `~260007.0.3` | `260007.0.3` | `260502.0.2` | 26.0.7 → 26.5.2 |
| `@keycloakify/keycloak-admin-ui` | `~260007.0.4` | `260007.0.4` | `260502.0.0` | 26.0.7 → 26.5.2 |
| `@keycloakify/keycloak-ui-shared` | `~260007.0.2` | `260007.0.5` | `260502.0.0` | 26.0.7 → 26.5.2 |

**Impact:** These packages mirror the built-in Keycloak admin/account React UIs. If your Keycloak server is still on 26.0.x, stay on `260007.x`. Only upgrade when the KC server is upgraded to 26.5.x.

**Upgrade path (when upgrading KC server to 26.5.x):**
```
@keycloakify/keycloak-account-ui: ~260502.0.2
@keycloakify/keycloak-admin-ui:   ~260502.0.0
@keycloakify/keycloak-ui-shared:  ~260502.0.0
@keycloak/keycloak-admin-client:  26.5.x
keycloak-js:                      26.5.x
```
All five must be updated in lockstep. Expect possible breaking changes in the account/admin UI component APIs.

---

## Keycloak JS Client

| Package | Pinned | Latest |
|---------|--------|--------|
| `@keycloak/keycloak-admin-client` | `26.0.7` | `26.6.1` |
| `keycloak-js` | `26.0.7` | `26.6.1` |

**Impact:** These are tied to KC server version. Upgrade together with the `@keycloakify/*` packages above.

---

## PatternFly (Keycloak's UI Framework)

| Package | Pinned | Latest | Gap |
|---------|--------|--------|-----|
| `@patternfly/patternfly` | `^5.4.0` | `6.4.0` | **Major version** |
| `@patternfly/react-core` | `^5.4.1` | `6.4.3` | **Major version** |
| `@patternfly/react-icons` | `^5.4.0` | `6.4.0` | **Major version** |
| `@patternfly/react-styles` | `^5.4.0` | `6.4.0` | **Major version** |
| `@patternfly/react-table` | `^5.4.1` | `6.4.3` | **Major version** |
| `@patternfly/react-code-editor` | `^5.4.3` | `6.4.3` | **Major version** |

**Impact:** PatternFly 5 → 6 is a major rewrite with breaking component API changes. The `@keycloakify/keycloak-account-ui` and `@keycloakify/keycloak-admin-ui` packages dictate which PatternFly version to use — do **not** upgrade PatternFly independently. Wait for `@keycloakify/*` packages to declare PF6 support.

**Do not upgrade until:** The `@keycloakify/*` UI packages drop PF5 and require PF6.

---

## Build Tooling

| Package | Pinned | Latest | Gap |
|---------|--------|--------|-----|
| `vite` | `^6.2.2` | `6.x` | Minor |
| `@vitejs/plugin-react` | `^4.3.4` | `6.0.1` | **Major version** |
| `tailwindcss` / `@tailwindcss/vite` | `^4.0.14` | `4.2.4` | Minor |
| `typescript` | `^5.8.2` | `5.x` | Patch |

**@vitejs/plugin-react 4→6:** Breaking change. Currently on `4.x`; latest is `6.0.1`. Upgrade when Vite itself requires it or when fast-refresh behavior needs updating.

---

## Storybook

| Package | Pinned | Latest | Gap |
|---------|--------|--------|-----|
| `storybook` / `@storybook/react` / `@storybook/react-vite` | `^8.6.5` | `10.3.5` | **Major version (8 → 10)** |
| `@storybook/addon-essentials` | `^8.6.5` | `8.6.14` | Minor (within v8) |
| `@chromatic-com/storybook` | `^3` | `5.1.2` | Major |

**Impact:** Storybook 10 introduced major config and API changes. The current v8 setup is stable and fully functional. Upgrade only if specific v9/v10 features are needed (e.g., new test addon capabilities).

---

## Testing

| Package | Pinned | Latest | Gap |
|---------|--------|--------|-----|
| `vitest` | `^3.0.8` | `4.1.5` | **Major version** |
| `@vitest/browser` | `^3.0.8` | `4.1.5` | **Major version** |
| `playwright` | `^1.51.0` | `1.x` | Patch |

---

## Low-Priority / Cosmetic

| Package | Current | Latest |
|---------|---------|--------|
| `@fontsource/open-sans` | `5.2.5` | `5.2.7` |
| `@types/react` | `19.0.10` | `19.2.14` |
| `@types/react-dom` | `19.0.4` | `19.2.3` |

---

## Upgrade Priority Matrix

| Priority | Action | Condition |
|----------|--------|-----------|
| **When KC server upgrades to 26.5.x** | Update `@keycloakify/*` + `keycloak-js` + `keycloak-admin-client` all together | KC server upgrade |
| **Low / anytime** | Bump `keycloakify` from `11.8.22` → `11.15.3` | Safe, no breaking changes |
| **Low / anytime** | Tailwind CSS `4.0.14` → `4.2.4` | Minor |
| **Hold** | PatternFly 5 → 6 | Wait for `@keycloakify/*` to require it |
| **Hold** | Storybook 8 → 10 | Only if new test features needed |
| **Hold** | `@vitejs/plugin-react` 4 → 6 | Wait for ecosystem signal |
| **Hold** | Vitest 3 → 4 | Stable v3 is fine |
