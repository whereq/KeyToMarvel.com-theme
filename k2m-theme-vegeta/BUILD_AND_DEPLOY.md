# k2m-theme-vegeta — Development Guide

A comprehensive guide covering theme initialization, local development workflows, debugging strategies, and production build/deployment.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Prerequisites](#2-prerequisites)
3. [Initial Setup](#3-initial-setup)
4. [Understanding the Theme Structure](#4-understanding-the-theme-structure)
5. [Development Workflows](#5-development-workflows)
   - 5.1 [Vite Dev Server (mock mode)](#51-vite-dev-server-mock-mode)
   - 5.2 [Storybook](#52-storybook)
   - 5.3 [Against a Live Keycloak Instance](#53-against-a-live-keycloak-instance)
6. [Debugging](#6-debugging)
7. [Adding & Customizing Pages](#7-adding--customizing-pages)
8. [i18n — Message Keys](#8-i18n--message-keys)
9. [Design Tokens & Theming](#9-design-tokens--theming)
10. [Building for Deployment](#10-building-for-deployment)
    - 10.1 [Build with Yarn](#101-build-with-yarn)
    - 10.2 [Build with npm](#102-build-with-npm)
11. [Deploying to Keycloak](#11-deploying-to-keycloak)
    - 11.0 [One-command deploy script](#110-one-command-deploy-script-recommended)
    - 11.1 [Method 1: Drop JAR into providers directory](#111-method-1-drop-jar-into-providers-directory)
    - 11.2 [Method 2: Docker run](#112-method-2-docker-run-quick-test)
    - 11.3 [Method 3: Keycloakify test server](#113-method-3-keycloakify-test-server-dev-only)
    - 11.4 [Welcome Theme — Docker Volume Mount](#114-welcome-theme--docker-volume-mount)
    - 11.5 [Login Message Overrides — Docker Volume Mount](#115-login-message-overrides--docker-volume-mount)
    - 11.6 [Activating login / account / admin / email themes](#116-activating-login--account--admin--email-themes)
12. [Key Architecture Decisions](#12-key-architecture-decisions)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Project Overview

`k2m-theme-vegeta` is a custom Keycloak theme built with [Keycloakify](https://keycloakify.dev) 11.x. It provides fully customized UI for all five Keycloak theme types:

| Type      | Implementation       | Location                          | Deployment         |
|-----------|----------------------|-----------------------------------|--------------------|
| `login`   | React (custom)       | `src/keycloak-theme/login/`              | bundled in JAR     |
| `account` | React SPA (upstream) | `src/keycloak-theme/account/`            | bundled in JAR     |
| `admin`   | React SPA (upstream) | `src/keycloak-theme/admin/`              | bundled in JAR     |
| `email`   | FreeMarker FTL       | `src/keycloak-theme/email/`              | bundled in JAR     |
| `welcome` | FreeMarker FTL       | `src/keycloak-theme/welcome/`            | **separate volume mount** — not in JAR |
| `login messages` | `.properties` | `src/keycloak-theme/login/messages/` | **separate volume mount** — overrides JAR messages |

**Design system:** Dark MetroUI — flat, sharp corners, bold typography, `--vg-*` CSS custom properties.
**Frontend accent:** cyan (`--vg-cyan-400`) for user-facing surfaces.
**Backend accent:** gold (`--vg-gold-400`) for admin/system surfaces.

---

## 2. Prerequisites

| Tool       | Version    | Notes                                      |
|------------|------------|--------------------------------------------|
| Node.js    | ≥ 20.x     | LTS recommended                            |
| Yarn       | ≥ 1.22     | Classic (v1); used as primary package manager |
| npm        | ≥ 10.x     | Alternative to Yarn; requires `.npmrc`     |
| Java       | ≥ 21       | Only needed to run the Keycloak JAR locally |
| Docker     | optional   | Easiest way to spin up a local Keycloak    |

---

## 3. Initial Setup

### 3.1 Install Dependencies

**With Yarn (recommended):**

```bash
yarn install
```

`yarn install` automatically runs `postinstall`, which executes `keycloakify sync-extensions`. This command:
- Generates `src/keycloak-theme/kc.gen.tsx`
- Copies managed files for `account` and `admin` theme types into `src/keycloak-theme/account/` and `src/keycloak-theme/admin/`

> **Warning:** Never manually edit files that begin with the comment block:
> ```
> WARNING: Before modifying this file, run:
> $ npx keycloakify own --path "<file>"
> ```
> These are managed by Keycloakify and get overwritten on every `yarn install`.

**With npm:**

```bash
npm install
```

npm requires the `.npmrc` at the project root with `legacy-peer-deps=true` because `@keycloakify/keycloak-account-ui` declares peer deps on `@types/react@^18` while this project uses React 19.

### 3.2 Verify Installation

After install, confirm the generated files exist:

```bash
ls src/keycloak-theme/kc.gen.tsx
ls src/keycloak-theme/account/KcPage.tsx
ls src/keycloak-theme/admin/KcPage.tsx
```

If these are missing, run `sync-extensions` manually:

```bash
yarn keycloakify sync-extensions
# or
npx keycloakify sync-extensions
```

---

## 4. Understanding the Theme Structure

```
src/
├── index.css                        # Global design tokens (--vg-* CSS vars) + Tailwind v4
├── main.tsx                         # App entry — routes to KcPage or AppEntrypoint
├── main.app.tsx                     # Non-Keycloak app shell (used in dev/preview only)
├── vite-env.d.ts                    # Vite client type reference
└── keycloak-theme/
    ├── kc.gen.tsx                   # AUTO-GENERATED — do not edit
    ├── layout/
    │   ├── KcContext.ts             # Union of all login page KcContext types
    │   ├── i18n.ts                  # i18n builder — exports useI18n, I18n type
    │   ├── Header.tsx               # Fixed top nav bar
    │   ├── Footer.tsx               # Fixed bottom bar
    │   └── Template.tsx             # Shared login page shell (card layout)
    ├── login/
    │   ├── KcContext.ts             # Login theme KcContext type
    │   ├── KcPage.tsx               # Page router — maps pageId → component
    │   ├── KcPageStory.tsx          # Storybook/mock helper
    │   └── pages/
    │       ├── login/               # Login, LoginPassword, LoginUsername, etc.
    │       ├── register/            # Register, RegisterForm, TermsAcceptance, etc.
    │       ├── otp/                 # LoginOtp, LoginConfigTotp
    │       ├── idp/                 # LoginIdpLinkConfirm
    │       ├── webauthn/            # WebauthnAuthenticate, WebauthnRegister
    │       └── terms/              # TermsAndConditions
    ├── profile/
    │   ├── UserProfileFormFields.tsx  # Dynamic user profile field renderer
    │   ├── elements/                  # InputTag, SelectTag, TextareaTag, etc.
    │   └── utils.ts
    ├── shared/
    │   └── ui/                       # Reusable Vg* components
    │       ├── Button.tsx            # VgButton — variants: primary/secondary/ghost/danger/frontend/backend
    │       ├── Input.tsx             # VgInput
    │       ├── PasswordInput.tsx     # VgPasswordInput (with show/hide toggle)
    │       ├── FormField.tsx         # VgFormField (label + error wrapper)
    │       ├── Alert.tsx             # VgAlert — info/success/warning/error
    │       ├── Card.tsx              # VgCard
    │       ├── Checkbox.tsx          # VgCheckbox
    │       ├── Divider.tsx           # VgDivider (with optional label)
    │       ├── Select.tsx            # VgSelect
    │       ├── Textarea.tsx          # VgTextarea
    │       ├── SocialButton.tsx      # VgSocialButton
    │       └── index.ts             # Barrel export
    ├── account/                      # AUTO-MANAGED — run `keycloakify own` before editing
    ├── admin/                        # AUTO-MANAGED — run `keycloakify own` before editing
    ├── email/
    │   ├── theme.properties          # Required for Keycloakify to detect & bundle email theme
    │   ├── html/                     # HTML email templates (.ftl)
    │   ├── text/                     # Plain-text email templates (.ftl)
    │   └── messages/                 # Email i18n messages
    └── welcome/
        └── index.ftl                 # Welcome page — deployed via themes/ volume, NOT bundled in JAR
```

### Key Files to Know

| File | Purpose |
|------|---------|
| `vite.config.ts` | All Keycloakify options live here — `themeName`, `accountThemeImplementation` |
| `src/index.css` | All `--vg-*` design tokens; the single source of truth for colors/spacing/fonts |
| `login/KcPage.tsx` | Add new page routes here when implementing new Keycloak pages |
| `shared/ui/index.ts` | Import from here — `import { VgButton, VgInput } from "@keycloak-theme/shared/ui"` |

---

## 5. Development Workflows

There are three ways to develop and test the theme, each suited to a different stage of work.

### 5.1 Vite Dev Server (mock mode)

**Best for:** Fast iteration on individual pages without a running Keycloak.

```bash
yarn dev
# or
npm run dev
```

The Vite dev server starts at `http://localhost:5173`. By default it renders your regular `main.app.tsx`. To render a specific Keycloak page, uncomment the mock block in `src/main.tsx`:

```tsx
// src/main.tsx
import { getKcContextMock } from "./keycloak-theme/login/KcPageStory";

if (import.meta.env.DEV) {
    window.kcContext = getKcContextMock({
        pageId: "login.ftl",     // ← change to any page you want to test
        overrides: {
            // realm: { displayName: "My Realm" },
            // social: { displayInfo: true, providers: [...] },
        }
    });
}
```

Available `pageId` values (from `login/KcPage.tsx`):

```
login.ftl                    login-password.ftl
login-username.ftl           login-reset-password.ftl
login-update-password.ftl    login-verify-email.ftl
login-otp.ftl                login-config-totp.ftl
login-page-expired.ftl       register.ftl
login-idp-link-confirm.ftl   webauthn-authenticate.ftl
webauthn-register.ftl        delete-account-confirm.ftl
logout-confirm.ftl           info.ftl
error.ftl                    terms.ftl
```

**Hot reload** works fully — save any `.tsx`, `.css`, or `.ts` file and the browser updates instantly.

#### Providing mock data overrides

The `overrides` object is deep-merged into the mock context. Examples:

```tsx
// Test with social providers visible
window.kcContext = getKcContextMock({
    pageId: "login.ftl",
    overrides: {
        social: {
            displayInfo: true,
            providers: [
                { alias: "google", displayName: "Google", loginUrl: "#", providerId: "google" },
                { alias: "github", displayName: "GitHub", loginUrl: "#", providerId: "github" },
            ],
        },
    },
});

// Test error state
window.kcContext = getKcContextMock({
    pageId: "login.ftl",
    overrides: {
        message: { type: "error", summary: "Invalid username or password." },
    },
});

// Test registration page
window.kcContext = getKcContextMock({
    pageId: "register.ftl",
    overrides: {},
});
```

### 5.2 Storybook

**Best for:** Isolated component development; visual snapshot testing; design review without any backend.

```bash
yarn storybook
# or
npm run storybook
```

Opens at `http://localhost:6007`.

Stories live in `src/stories/`. The pattern:

```tsx
// src/stories/Login.stories.tsx
import { createKcPageStory } from "../keycloak-theme/login/KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login.ftl" });

export const WithSocialProviders: Story = {
    args: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: [
                    { alias: "google", displayName: "Google", loginUrl: "#", providerId: "google" },
                ],
            },
        },
    },
};
```

**When to use Storybook over `yarn dev`:**
- Testing multiple states of the same page side by side
- Sharing visual progress with non-developers
- Testing edge cases (empty state, long text, error states)

**Build Storybook for static hosting:**

```bash
yarn build-storybook
# Output: storybook-static/
```

### 5.3 Against a Live Keycloak Instance

**Best for:** End-to-end flow testing; account and admin themes (which can't be mocked); verifying the actual FTL/Java integration.

#### Option A — Docker (easiest)

```bash
# Start Keycloak 26 in dev mode
docker run --rm -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:26.0.7 start-dev
```

Build and deploy the theme JAR (see Section 10), then restart the container with the JAR mounted.

#### Option B — Keycloakify's built-in start-keycloak

Keycloakify can download and start Keycloak automatically with your theme pre-installed:

```bash
# Build theme first
yarn build-keycloak-theme

# Start Keycloak with theme (requires Java 21+)
npx keycloakify start-keycloak
```

This downloads the correct Keycloak version, installs your JAR, and starts Keycloak at `http://localhost:8080`. The admin console is at `http://localhost:8080/admin` (admin/admin).

#### Option C — Docker Compose with volume mount

```yaml
# docker-compose.yml
services:
  keycloak:
    image: quay.io/keycloak/keycloak:26.0.7
    command: start-dev
    environment:
      KC_BOOTSTRAP_ADMIN_USERNAME: admin
      KC_BOOTSTRAP_ADMIN_PASSWORD: admin
    ports:
      - "8080:8080"
    volumes:
      - ./dist_keycloak/keycloak-theme-k2m-theme-vegeta-*.jar:/opt/keycloak/providers/k2m-theme.jar
```

```bash
yarn build-keycloak-theme
docker compose up
```

#### Activating the theme in Keycloak Admin

1. Open `http://localhost:8080/admin`
2. Go to **Realm Settings → Themes**
3. Set **Login Theme** to `k2m-theme-vegeta`
4. Set **Account Theme** to `k2m-theme-vegeta`
5. Save and navigate to the login page of your realm

---

## 6. Debugging

### Browser DevTools

All `--vg-*` CSS custom properties are inspectable in the Elements panel. Every component uses `var(--vg-*)` directly — no compiled class names to decode.

### TypeScript errors

```bash
# Type-check without building (fast)
yarn tsc --noEmit

# With npm
npx tsc --noEmit
```

Common gotchas:

| Error | Cause | Fix |
|-------|-------|-----|
| `Module has no exported member 'DispatchFormAction'` | Removed in Keycloakify 11 | Use `(action: FormAction) => void` |
| `currentLanguage` comparison fails | `currentLanguage` is `{ languageTag, label }`, not a string | Compare `currentLanguage.languageTag` |
| `Property 'X' does not exist on type 'PasswordPolicies'` | `PasswordPolicies` only has standard policies | Don't use custom properties |
| `Argument of type '"myKey"' not assignable` | `msg()` only accepts known keys | Use `advancedMsg("myKey")` for custom keys |
| `adminThemeImplementation` invalid | Not a valid option in Keycloakify 11.x | Remove it — admin type is auto-detected |

### Keycloakify API reference (v11.15.3)

The most-used types, confirmed from `node_modules/keycloakify`:

```ts
// useUserProfileForm return type
const { formState, dispatchFormAction } = useUserProfileForm({ kcContext, i18n, doMakeUserConfirmPassword });
const { formFieldStates, isFormSubmittable } = formState;
// formFieldStates: FormFieldState[]
// FormFieldState = { attribute: Attribute; displayableErrors: FormFieldError[]; valueOrValues: string | string[]; }

// i18n
const { msg, msgStr, advancedMsg, advancedMsgStr, currentLanguage, enabledLanguages } = i18n;
// currentLanguage: { languageTag: string; label: string; }
// enabledLanguages: { languageTag: string; label: string; href: string; }[]
// msg() — typed, only accepts known Keycloak message keys, returns ReactElement
// advancedMsg() — accepts any string, returns ReactElement
// msgStr() / advancedMsgStr() — same but return string (for placeholder, title, etc.)
```

### Logging Keycloak context in development

```tsx
// Add to any page component during debugging
if (import.meta.env.DEV) {
    console.log("[kcContext]", kcContext);
}
```

---

## 7. Adding & Customizing Pages

### Claiming ownership of a managed file

Before modifying any file under `account/` or `admin/` that shows the WARNING comment:

```bash
npx keycloakify own --path "account/KcAccountUi.tsx"
npx keycloakify own --path "admin/KcAdminUi.tsx"
```

This marks the file as owned, preventing it from being overwritten by `sync-extensions`.

### Adding a new login page

1. Create the component in `src/keycloak-theme/login/pages/<category>/MyPage.tsx`
2. Register it in `src/keycloak-theme/login/KcPage.tsx`:

```tsx
// KcPage.tsx
import MyPage from "./pages/category/MyPage";

// In the switch:
case "my-page.ftl":
    return <MyPage {...{ kcContext, i18n, classes, Template, doUseDefaultCss }} />;
```

3. Add a Storybook story in `src/stories/MyPage.stories.tsx`

### Component conventions

Always use shared components from `@keycloak-theme/shared/ui`:

```tsx
import { VgButton, VgInput, VgFormField, VgAlert } from "@keycloak-theme/shared/ui";

// User-facing CTA → frontend variant (cyan)
<VgButton variant="frontend" size="lg" fullWidth type="submit">Sign In</VgButton>

// Admin/destructive action → backend (gold) or danger (red)
<VgButton variant="backend">Admin Action</VgButton>
<VgButton variant="danger">Delete Account</VgButton>
```

---

## 8. i18n — Message Keys

Keycloakify's `msg()` and `msgStr()` functions are **strictly typed** — they only accept message keys that exist in Keycloak's default message bundle.

**Rule of thumb:**
- Use `msg("doLogIn")` / `msgStr("doLogIn")` for **known standard Keycloak keys**
- Use `advancedMsg("myCustomKey")` / `advancedMsgStr("myCustomKey")` for **any other key** (custom theme keys, webauthn keys not in the bundle, etc.)

To add custom messages, place them in the i18n builder:

```ts
// src/keycloak-theme/layout/i18n.ts
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            "myApp-welcome": "Welcome to KeyToMarvel",
            "myApp-tagline": "Your keys, your realm.",
        },
        "zh-CN": {
            "myApp-welcome": "欢迎来到 KeyToMarvel",
        },
    })
    .build();
```

After adding custom keys, they become accepted by `msg()` with full type safety.

---

## 9. Design Tokens & Theming

All design tokens are defined in `src/index.css` as CSS custom properties under the `--vg-*` namespace. They are available globally — in Tailwind `@theme {}` blocks, inline styles, and CSS files.

### Color roles

| Token | Value | Usage |
|-------|-------|-------|
| `--vg-bg-base` | `#0a0a0f` | Page background |
| `--vg-bg-card` | `#141419` | Card / panel surface |
| `--vg-bg-elevated` | `#1a1a22` | Elevated inputs, dropdowns |
| `--vg-cyan-400` | `#00c9e4` | Frontend accent (user-facing CTAs) |
| `--vg-gold-400` | `#f5c518` | Backend accent (admin/system actions) |
| `--vg-purple-500` | `#7c3aed` | Primary brand color |
| `--vg-error` | `#f43f5e` | Error states |
| `--vg-text-primary` | `#f0f0f5` | Main text |
| `--vg-text-muted` | `#6b7280` | Placeholder / secondary |

To change the theme's primary brand color, update `--vg-purple-*` values in `src/index.css`. All components that use `var(--vg-purple-*)` will update automatically.

---

## 10. Building for Deployment

### 10.1 Build with Yarn

**Step 1: TypeScript check + Vite build**

```bash
yarn build
```

This runs `tsc -b && vite build` and outputs to `dist/`. It validates TypeScript before bundling — a failing type check aborts the build.

**Step 2: Build the Keycloak theme JAR**

```bash
yarn build-keycloak-theme
```

This runs `yarn build` (step 1) followed by `keycloakify build`, which packages the output into a deployable JAR at:

```
dist_keycloak/keycloak-theme-k2m-theme-vegeta-<version>.jar
```

### 10.2 Build with npm

```bash
# TypeScript check + Vite bundle
npm run build

# Full theme JAR (note: uses yarn internally via build-keycloak-theme script)
npm run build-keycloak-theme
```

> **Note:** The `build-keycloak-theme` script in `package.json` invokes `yarn build` internally. If you are using only npm, change the script to use `npm run build`:
>
> ```json
> "build-keycloak-theme": "npm run build && keycloakify build"
> ```

### Build output summary

| Command | Output | Purpose |
|---------|--------|---------|
| `yarn build` | `dist/` | Vite bundle (web assets) |
| `yarn build-keycloak-theme` | `dist_keycloak/*.jar` | Deployable Keycloak provider JAR |
| `yarn build-storybook` | `storybook-static/` | Static Storybook site |

### CI/CD example (GitHub Actions)

```yaml
- name: Install dependencies
  run: yarn install --frozen-lockfile

- name: Build Keycloak theme
  run: yarn build-keycloak-theme

- name: Upload JAR artifact
  uses: actions/upload-artifact@v4
  with:
    name: keycloak-theme
    path: dist_keycloak/*.jar
```

---

## 11. Deploying to Keycloak

### 11.0 Deploy scripts (recommended)

Two scripts in `bin/` cover both the build-on-WSL and deploy-on-Pi workflows.

#### `bin/build-and-deploy.sh` — WSL local dev (has Node.js/Yarn)

Builds the JAR then deploys all artifacts in one step:

```bash
# Deploy to the default target (../../KeyToMarvel.com/docker/volumes/keycloak)
./bin/build-and-deploy.sh

# Deploy to a custom target
./bin/build-and-deploy.sh /path/to/keycloak/volumes
```

| Step | Action |
|------|--------|
| 1 | `yarn build-keycloak-theme` — TypeScript check + Vite bundle + JAR |
| 2 | Calls `deploy.sh` to copy all artifacts |

#### `bin/deploy.sh` — Raspberry Pi PROD (no build needed)

Copies pre-built artifacts to the Keycloak volumes. **Run this on the Pi after `git pull`:**

```bash
cd ~/git/KeyToMarvel.com-theme/k2m-theme-vegeta
git pull
./bin/deploy.sh          # uses default path ../../KeyToMarvel.com/docker/volumes/keycloak
```

| Step | Action |
|------|--------|
| 1 | Copy JAR (`dist_keycloak/`) → `providers/` |
| 2 | Copy `src/keycloak-theme/welcome/index.ftl` + generate `theme.properties` → `themes/…/welcome/` |
| 3 | Copy `src/keycloak-theme/login/messages/*.properties` + generate `theme.properties` → `themes/…/login/` |

> **Why the JAR must already exist:** `deploy.sh` does not run a build. If `dist_keycloak/` is missing or stale, build the JAR on WSL first (`yarn build-keycloak-theme`), commit the JAR to the repo (or transfer it separately), then run `deploy.sh` on the Pi.

> **`docker/volumes/` is gitignored in `KeyToMarvel.com`** — all volume content is managed exclusively by these scripts. Never edit files under `docker/volumes/` directly; always modify the source in this repo and re-run `deploy.sh`.

After deploying on the Pi, restart Keycloak (production `start` mode requires a restart):

```bash
cd ~/git/KeyToMarvel.com/docker
docker compose -f docker-compose-rp4.yml restart keycloak
```

---

### What the JAR contains

`yarn build-keycloak-theme` produces two JARs in `dist_keycloak/`:

| JAR | Target |
|-----|--------|
| `keycloak-theme-for-kc-22-to-25.jar` | Keycloak 22–25 |
| `keycloak-theme-for-kc-all-other-versions.jar` | Keycloak 26+ (**use this one**) |

The JAR bundles: `login`, `account`, `admin`, `email`. The `welcome` theme is **not in the JAR** — see [Section 11.4](#114-welcome-theme-docker-volume-mount) for how to deploy it. Login message overrides are volume-mounted separately — see [Section 11.5](#115-login-message-overrides--docker-volume-mount).

---

### 11.1 Method 1: Drop JAR into providers directory

Copy the JAR to Keycloak's `providers/` directory and restart:

```bash
cp dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar /opt/keycloak/providers/k2m-theme.jar
/opt/keycloak/bin/kc.sh build   # triggers static file build (production only)
/opt/keycloak/bin/kc.sh start   # start Keycloak
```

For development mode:

```bash
/opt/keycloak/bin/kc.sh start-dev
```

> Keycloak scans `providers/` on startup. No additional configuration is needed — any `.jar` with a Keycloak theme is automatically discovered.

---

### 11.2 Method 2: Docker run (quick test)

```bash
docker run --rm -p 8080:8080 \
  -v "$(pwd)/dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar:/opt/keycloak/providers/k2m-theme.jar" \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:26.0.7 start-dev
```

---

### 11.3 Method 3: Keycloakify test server (dev only)

```bash
npx keycloakify start-keycloak
```

Automatically downloads Keycloak, installs your built JAR, and starts on port 8080.

---

### 11.4 Welcome Theme — Docker Volume Mount

The `welcome` theme is **server-wide** (not per-realm) and is **not bundled into the JAR** by Keycloakify. It must be deployed as a raw FTL directory mounted into the container's `/opt/keycloak/themes/` path, alongside the JAR in `/opt/keycloak/providers/`.

#### Host directory structure

Alongside your existing `provider/` volume, create a `themes/` directory:

```
docker/volumes/keycloak/
├── provider/                                        ← JAR lives here (already set up)
│   └── keycloak-theme-for-kc-all-other-versions.jar
└── themes/                                          ← add this for welcome
    └── k2m-theme-vegeta/
        └── welcome/
            ├── theme.properties
            └── index.ftl
```

#### Step 1 — Create the directory

```bash
mkdir -p docker/volumes/keycloak/themes/k2m-theme-vegeta/welcome
```

#### Step 2 — Copy the welcome files

Run from the `k2m-theme-vegeta` project root:

```bash
cp src/keycloak-theme/welcome/index.ftl \
   path/to/docker/volumes/keycloak/themes/k2m-theme-vegeta/welcome/

echo "parent=keycloak" > \
   path/to/docker/volumes/keycloak/themes/k2m-theme-vegeta/welcome/theme.properties
```

#### Step 3 — Update docker-compose.yml

Add the `themes` volume mount and `KC_SPI_THEME_WELCOME_THEME` environment variable:

```yaml
services:
  keycloak:
    image: quay.io/keycloak/keycloak:26.0.7
    command: start-dev
    environment:
      KC_BOOTSTRAP_ADMIN_USERNAME: admin
      KC_BOOTSTRAP_ADMIN_PASSWORD: admin
      KC_SPI_THEME_WELCOME_THEME: k2m-theme-vegeta      # ← activates welcome theme
    ports:
      - "8080:8080"
    volumes:
      - ./volumes/keycloak/provider:/opt/keycloak/providers  # ← JAR (login/account/admin/email)
      - ./volumes/keycloak/themes:/opt/keycloak/themes       # ← welcome FTL files
```

#### Step 4 — Restart

```bash
docker compose down && docker compose up -d
```

Navigate to `http://your-keycloak/` to see the Vegeta welcome page.

#### Why two separate volume mounts

| Mount | Contents | How Keycloak uses it |
|-------|----------|----------------------|
| `/opt/keycloak/providers/` | JAR file | Scanned at startup; login, account, admin, email registered automatically |
| `/opt/keycloak/themes/` | Raw FTL directories | Loaded directly by Keycloak's theme engine; no JAR needed |

Keycloak merges themes from both locations without conflict.

#### Updating the welcome page

Since `index.ftl` has no build step (inline CSS, no compiled assets), updates are instant:

```bash
cp src/keycloak-theme/welcome/index.ftl \
   docker/volumes/keycloak/themes/k2m-theme-vegeta/welcome/
# dev mode (start-dev): Keycloak reloads FTL on each request — no restart needed
# production mode (start): restart the container after changing FTL files
```

---

### 11.5 Login Message Overrides — Docker Volume Mount

Keycloak validates that any `${key}` display name set on a User Profile attribute can be
resolved from the active login theme's message bundle before saving. If a key is missing,
the Admin Console throws:

```
Error! User Profile configuration has not been saved
Please add translations before saving: {{error}}
```

The JAR (compiled from `src/keycloak-theme/layout/i18n.ts`) already contains these keys.
The volume-mounted override files at `src/keycloak-theme/login/messages/` take precedence
over the JAR messages, so fixes to i18n keys take effect without a JAR rebuild.

#### Source files

```
src/keycloak-theme/login/messages/
├── messages_en.properties     # English: firstName, lastName, username, email, locale, avatar
└── messages_zh_CN.properties  # zh-CN translations of the same keys
```

#### Important: key format must match the display name

The `${key}` in the display name field must exactly match the key in the `.properties` file:

| Display name field | Required key | Correct |
|--------------------|--------------|---------|
| `${firstName}` | `firstName` | `firstName=First name` |
| `${lastName}` | `lastName` | `lastName=Last name` |
| `${profile.attribute.firstName}` | `profile.attribute.firstName` | `profile.attribute.firstName=First name` |

The default Keycloak attribute display names use the bare key format (e.g., `${firstName}`),
not the `profile.attribute.*` prefix.

#### Deployed structure

`bin/deploy.sh` copies these files to the volume:

```
themes/k2m-theme-vegeta/login/
├── theme.properties          # parent=keycloak (generated by deploy script)
└── messages/
    ├── messages_en.properties
    └── messages_zh_CN.properties
```

`theme.properties` with `parent=keycloak` ensures all standard Keycloak login message keys
are still available through inheritance. Only the keys explicitly defined in the override
files shadow the JAR; everything else falls through to the parent.

#### Updating

1. Edit `src/keycloak-theme/login/messages/messages_en.properties`
2. Run `./bin/deploy.sh` (or manually copy the file — no JAR rebuild needed)
3. In `start-dev` mode Keycloak reloads message files on each request (no restart needed).
   In production `start` mode, restart the container.

---

### 11.6 Activating login / account / admin / email themes

These are all per-realm and activated through the Keycloak Admin Console:

1. Log into Keycloak Admin Console: `http://your-keycloak/admin`
2. Select your realm → **Realm Settings** → **Themes**
3. Set:
   - **Login Theme**: `k2m-theme-vegeta`
   - **Account Theme**: `k2m-theme-vegeta`
   - **Admin Theme**: `k2m-theme-vegeta`
   - **Email Theme**: `k2m-theme-vegeta`
4. Click **Save**
5. Verify: `http://your-keycloak/realms/<your-realm>/account`

---

## 12. Key Architecture Decisions

### Why no `"keycloakify"` field in `package.json`?

Keycloakify supports two ways to configure options — via `package.json` or via `vite.config.ts`. Using **both simultaneously causes `keycloakify sync-extensions` to exit with code 255**. All options are kept in `vite.config.ts` only.

### Why `legacy-peer-deps=true` in `.npmrc`?

`@keycloakify/keycloak-account-ui` declares `@types/react@^18.3.11` as a peer dependency. This project uses `@types/react@^19`. The flag suppresses npm's ERESOLVE error. Yarn handles this silently through its own resolution strategy.

### Why `adminThemeImplementation` is absent from `vite.config.ts`?

This option does not exist in Keycloakify 11.x's vite plugin type definitions. The admin theme is handled entirely by the auto-generated files in `src/keycloak-theme/admin/`, which use `@keycloakify/keycloak-admin-ui`.

### Why `advancedMsg()` for some keys?

Keycloakify's `msg()` is strictly typed to only accept message keys in Keycloak's compiled default message bundle. Keys like `"webauthn-login-intro"`, `"loginOtpTitle"`, and custom keys must use `advancedMsg()`, which accepts any string and falls back gracefully.

### `formState` wrapper in `useUserProfileForm`

In Keycloakify 11.x the hook returns `{ formState, dispatchFormAction }` where `formState` contains both `formFieldStates` and `isFormSubmittable`. Older examples or docs may destructure these directly at the top level — that API no longer exists.

### Why the welcome theme is not in the JAR

Keycloakify v11's build pipeline only processes `login`, `email`, `account`, and `admin` theme types — `welcome` is intentionally absent from its `implementedThemeTypes` type system. Attempting to bundle it via the JAR is not possible without forking Keycloakify itself.

Additionally, the `welcome` theme is **server-wide** (not per-realm), so it is configured differently: via the `KC_SPI_THEME_WELCOME_THEME` environment variable rather than through Realm Settings. Deploying it as a raw FTL directory mounted to `/opt/keycloak/themes/` is the correct and officially supported approach for this theme type.

### Why `email/theme.properties` is required

Keycloakify detects native FTL themes by checking for the presence of a `theme.properties` file in the directory (`getIsNative` in the vite plugin). Without it, even a fully populated `email/` directory with `html/`, `text/`, and `messages/` subdirectories will be silently ignored and excluded from the JAR. The file only needs one line: `parent=base`.

---

## 13. Troubleshooting

### `keycloakify sync-extensions` fails with exit code 255

**Cause:** Both a `"keycloakify"` field in `package.json` AND keycloakify options in `vite.config.ts` are present.

**Fix:** Remove the `"keycloakify"` block from `package.json`. All options belong in `vite.config.ts`.

---

### `yarn install` peer dependency warnings for admin-ui

**Symptom:**

```
warning "@keycloakify/keycloak-admin-ui" has unmet peer dependency "dagre@^0.8.5"
```

**Fix:** These peer dependencies must be explicitly listed in `dependencies`. They are already added to this project's `package.json`. If you see new warnings after upgrading `@keycloakify/keycloak-admin-ui`, add the missing packages:

```bash
yarn add dagre file-saver file-selector flat monaco-editor p-debounce react-dropzone reactflow use-react-router-breadcrumbs
```

---

### `npm install` ERESOLVE error

**Symptom:**

```
npm error ERESOLVE could not resolve
npm error Could not resolve dependency:
npm error peer @types/react@"^18.3.11" from @keycloakify/keycloak-account-ui
```

**Fix:** The `.npmrc` file at the project root must contain:

```
legacy-peer-deps=true
```

---

### `yarn build` fails with TypeScript errors

Run the type checker independently for a clear error list:

```bash
yarn tsc --noEmit
```

Common fixes:

- `DispatchFormAction` does not exist → use `(action: FormAction) => void`
- `ReturnType<typeof useUserProfileForm>[...]` inline → use `FormFieldError[]` directly
- Unknown i18n key in `msg()` → switch to `advancedMsg()`
- `currentLanguage` used as string → use `currentLanguage.languageTag`

---

### Theme not showing in Keycloak Admin after JAR deployment

1. Confirm the JAR landed in `/opt/keycloak/providers/` — not in `themes/`
2. Run `kc.sh build` before `kc.sh start` (required in production mode)
3. In dev mode (`start-dev`) the JAR is hot-detected; a browser refresh should suffice
4. Check Keycloak logs for provider scan errors: `grep -i "theme" /opt/keycloak/logs/keycloak.log`

---

### Changes to email FTL files not reflecting

Email FTL templates are bundled inside the JAR. After editing any file under `src/keycloak-theme/email/`, rebuild and redeploy the JAR:

```bash
yarn build-keycloak-theme
# then copy the new JAR to providers/ and restart Keycloak
```

In production mode, a container restart is required. In `start-dev` mode a restart is also needed because the JAR is read once on startup.

---

### Changes to welcome FTL not reflecting

The welcome `index.ftl` is **not in the JAR** — it lives in the Docker volume at:
```
docker/volumes/keycloak/themes/k2m-theme-vegeta/welcome/index.ftl
```

Copy the updated file to the volume:

```bash
cp src/keycloak-theme/welcome/index.ftl \
   docker/volumes/keycloak/themes/k2m-theme-vegeta/welcome/
```

- **`start-dev` mode**: Keycloak reloads FTL on every request — no restart needed.
- **`start` (production) mode**: restart the container after the file is updated.

---

### Welcome theme not appearing (`http://your-keycloak/` still shows default page)

Check the following in order:

1. Confirm `KC_SPI_THEME_WELCOME_THEME=k2m-theme-vegeta` is set in the container environment:
   ```bash
   docker compose exec keycloak env | grep WELCOME
   ```
2. Confirm `theme.properties` exists in the volume:
   ```bash
   cat docker/volumes/keycloak/themes/k2m-theme-vegeta/welcome/theme.properties
   # must print: parent=keycloak
   ```
3. Confirm the `themes/` volume is mounted to `/opt/keycloak/themes/` (not `providers/`):
   ```bash
   docker compose exec keycloak ls /opt/keycloak/themes/k2m-theme-vegeta/welcome/
   ```
4. Restart the container — the welcome theme env var is read at startup.

---

### Storybook fails to start

```bash
# Clear Storybook cache
rm -rf node_modules/.cache/storybook
yarn storybook
```

---

*Last updated: 2026-04-24*
