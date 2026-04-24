# Keycloakify Theme — Full Development & Deployment Guide

Custom Keycloak UI theme for the **KeyToMarvel / WhereQ** identity platform,
built with [Keycloakify](https://www.keycloakify.dev/).

| | |
|---|---|
| Theme name | `k2m-theme-superhero` |
| Keycloak target | 26.0.7 |
| Keycloakify | 11.8.22 |
| Stack | React 19 · TypeScript 5.8 · Vite 6 · Tailwind CSS 4 · PatternFly 5 |

---

## Table of Contents

1. [How Keycloakify works](#1-how-keycloakify-works)
2. [Prerequisites](#2-prerequisites)
3. [Project structure](#3-project-structure)
4. [Lifecycle overview](#4-lifecycle-overview)
5. [Install dependencies](#5-install-dependencies)
6. [Step 1 — Scaffold a new page](#6-step-1--scaffold-a-new-page)
7. [Step 2 — Extend KcContext (optional)](#7-step-2--extend-kccontext-optional)
8. [Step 3 — Implement the page component](#8-step-3--implement-the-page-component)
9. [Step 4 — Register the page in KcPage.tsx](#9-step-4--register-the-page-in-kcpagetsx)
10. [Step 5 — Customize the Template](#10-step-5--customize-the-template)
11. [Step 6 — Develop with Storybook](#11-step-6--develop-with-storybook)
12. [Step 7 — Develop with Vite mock mode](#12-step-7--develop-with-vite-mock-mode)
13. [Step 8 — Build the theme JAR](#13-step-8--build-the-theme-jar)
14. [Step 9 — Deploy to Keycloak](#14-step-9--deploy-to-keycloak)
    - 14.1 [Standalone / bare-metal](#141-standalone--bare-metal)
    - 14.2 [Docker / Docker Compose](#142-docker--docker-compose)
    - 14.3 [Kubernetes / Helm](#143-kubernetes--helm)
    - 14.4 [Cloud registries (AWS, Azure, GCP)](#144-cloud-registries-aws-azure-gcp)
15. [Step 10 — Activate the theme in Keycloak Admin](#15-step-10--activate-the-theme-in-keycloak-admin)
16. [Reference — all CLI commands](#16-reference--all-cli-commands)
17. [Troubleshooting](#17-troubleshooting)

---

## 1. How Keycloakify works

Keycloakify lets you write Keycloak login / account / admin UI pages as standard
React components, then packages them into a `.jar` that Keycloak loads as a theme
provider.

```
React source  ──(vite build)──▶  dist/
                                    │
                          (keycloakify build)
                                    │
                                    ▼
                         dist_keycloak/
                           ├─ keycloak-theme-for-kc-22-to-25.jar
                           └─ keycloak-theme-for-kc-all-other-versions.jar
```

At runtime Keycloak injects a global `window.kcContext` object into the page.
The entry point `src/main.tsx` detects it:

- `window.kcContext` **present** → renders `<KcPage>` (the Keycloak theme)
- `window.kcContext` **absent** → lazy-loads `main.app.tsx` (standalone SPA)

This dual-entry design means you can develop and preview all theme pages
**without a running Keycloak instance** by supplying a mock context.

---

## 2. Prerequisites

| Tool | Min version | Notes |
|------|------------|-------|
| Node.js | 20 LTS | 22 also works |
| Yarn | 1.22+ (classic) | project uses `yarn.lock` |
| Java | 17+ | only for standalone Keycloak deployment |
| Docker | 24+ | only for container deployments |
| Keycloak | 26.0.7 | target version; see JAR selection in §13 |

---

## 3. Project structure

```
KeyToMarvel.com-theme/
└── k2m-theme-superhero/
    ├── src/
    │   ├── main.tsx                    ← entry point; detects window.kcContext
    │   ├── main.app.tsx                ← standalone SPA (lazy-loaded when not KC)
    │   ├── index.css                   ← Tailwind CSS root import
    │   └── keycloak-theme/
    │       ├── kc.gen.tsx              ← AUTO-GENERATED — never edit manually
    │       ├── layout/
    │       │   ├── KcContext.ts        ← KcContext type extension point
    │       │   ├── i18n.ts             ← i18n builder
    │       │   ├── Template.tsx        ← shared page shell (Header + Footer + messages)
    │       │   ├── Header.tsx
    │       │   └── Footer.tsx
    │       ├── login/
    │       │   ├── KcPage.tsx          ← page router (switch on pageId)
    │       │   ├── KcPageStory.tsx     ← Storybook / mock-mode helpers
    │       │   └── pages/
    │       │       ├── login/          ← Login.tsx, LoginForm.tsx, Login.stories.tsx
    │       │       ├── register/       ← Register.tsx, RegisterForm.tsx
    │       │       ├── idp/            ← IdpReviewUserProfile.tsx
    │       │       ├── terms/          ← Terms.tsx
    │       │       ├── Info.tsx
    │       │       ├── Error.tsx
    │       │       ├── LogoutConfirm.tsx
    │       │       ├── DeleteAccountConfirm.tsx
    │       │       └── LoginVerifyEmail.tsx
    │       ├── profile/                ← LoginUpdateProfile + form field elements
    │       ├── account/                ← Single-Page account UI
    │       ├── admin/                  ← Admin UI
    │       └── shared/                 ← PatternFly / keycloak-ui-shared overrides
    ├── dist_keycloak/                  ← build output (add to .gitignore in CI)
    │   ├── keycloak-theme-for-kc-22-to-25.jar
    │   ├── keycloak-theme-for-kc-all-other-versions.jar
    │   └── theme/k2m-theme-superhero/{login,account,admin}/
    ├── .storybook/
    ├── vite.config.ts
    ├── tsconfig.json
    └── package.json
```

---

## 4. Lifecycle overview

```
scaffold page            yarn keycloakify add-page
        │
extend KcContext         edit layout/KcContext.ts  (if new properties needed)
        │
implement component      src/keycloak-theme/login/pages/<page>/
        │
register in router       login/KcPage.tsx  (add case "<page>.ftl")
        │
customize Template       layout/Template.tsx  (shared chrome)
        │
dev — Storybook          yarn storybook          ← no KC needed
dev — Vite mock          yarn dev                ← no KC needed
        │
build JAR                yarn build-keycloak-theme
        │
deploy JAR               copy to providers/ + kc.sh build
        │
activate in Admin        Realm Settings → Themes → k2m-theme-superhero
```

---

## 5. Install dependencies

```bash
cd k2m-theme-superhero
yarn install
# postinstall runs `keycloakify sync-extensions` automatically
```

---

## 6. Step 1 — Scaffold a new page

Keycloakify can eject a copy of any built-in page for customization:

```bash
yarn keycloakify add-page
```

The interactive prompt lists all available Keycloak page IDs. Select one (e.g.,
`login-reset-password.ftl`) and Keycloakify writes the component file into
`src/keycloak-theme/login/pages/`.

To also scaffold a Storybook story for the new page:

```bash
yarn keycloakify add-story
```

---

## 7. Step 2 — Extend KcContext (optional)

`KcContext` is the typed representation of the server-side data Keycloak passes to
each page. If you need extra properties (e.g., custom realm attributes), extend it
in `src/keycloak-theme/layout/KcContext.ts`:

```ts
// layout/KcContext.ts
export type KcContextExtension = {
    themeName: ThemeName;
    properties: Record<KcEnvName, string> & {};
    // Add custom server-side properties here, e.g.:
    // myRealmAttribute: string;
};
```

After editing, regenerate the auto-generated file:

```bash
yarn keycloakify update-kc-gen
```

Commit the updated `kc.gen.tsx` alongside your changes.

---

## 8. Step 3 — Implement the page component

Each page receives three standard props from Keycloakify:

| Prop | Type | Purpose |
|------|------|---------|
| `kcContext` | `KcContext` (narrowed to the page) | server-side data |
| `i18n` | `I18n` | translation helpers (`msg`, `msgStr`) |
| `Template` | React component | shared page shell |

Minimal page skeleton:

```tsx
// src/keycloak-theme/login/pages/login-reset-password/LoginResetPassword.tsx
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";

type Props = PageProps<
    Extract<KcContext, { pageId: "login-reset-password.ftl" }>,
    I18n
>;

export default function LoginResetPassword({ kcContext, i18n, Template, doUseDefaultCss, classes }: Props) {
    const { url } = kcContext;
    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("emailForgotTitle")}
        >
            {/* Your JSX here */}
        </Template>
    );
}
```

### Template props you will use most often

| Prop | Default | Effect |
|------|---------|--------|
| `headerNode` | — | page title shown in the top bar |
| `displayMessage` | `true` | shows/hides the KC flash message block |
| `displayInfo` | `false` | shows `infoNode` below the form |
| `infoNode` | `null` | extra content below the form |
| `socialProvidersNode` | `null` | IdP button list |
| `doUseDefaultCss` | `false` | set to `false` to suppress KC base CSS |

---

## 9. Step 4 — Register the page in KcPage.tsx

Open `src/keycloak-theme/login/KcPage.tsx` and add a `case` for your page:

```tsx
// 1. Add the lazy import at the top
const LoginResetPassword = lazy(
    () => import("./pages/login-reset-password/LoginResetPassword")
);

// 2. Add the case inside the switch
case "login-reset-password.ftl": return (
    <LoginResetPassword
        {...{ kcContext, i18n, classes }}
        Template={Template}
        doUseDefaultCss={doUseDefaultCss}
    />
);
```

Pages not explicitly listed in the switch fall through to `<DefaultPage>`, which
renders the Keycloakify built-in implementation.

---

## 10. Step 5 — Customize the Template

The shared `Template` (`src/keycloak-theme/layout/Template.tsx`) controls the
page chrome: Header, Footer, flash messages, language switcher, and layout.

Key areas to modify:

| Area | Location in Template.tsx |
|------|--------------------------|
| Background / overall layout | `<div id="template-oaa">` className |
| Page title / username display | `<div id="top-bar">` |
| Language switcher | `enabledLanguages` filter block |
| Flash message styling | `alert-${message.type}` block |
| Content width | `<div id="kc-content">` — currently `w-1/4 min-w-[20rem]` |

The Header and Footer are separate components at
`src/keycloak-theme/layout/Header.tsx` and `Footer.tsx`.

---

## 11. Step 6 — Develop with Storybook

Storybook is the primary development environment. No Keycloak instance is needed.

```bash
yarn storybook
# → http://localhost:6006
```

Each story file sits next to its page component and passes a mock `KcContext`
using the `createKcPageStory` helper:

```tsx
// Login.stories.tsx
import { createKcPageStory } from "../../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login.ftl" });

export default { title: "login/login.ftl", component: KcPageStory };

// Default story — uses Keycloakify's built-in mock context
export const Default = { render: () => <KcPageStory /> };

// Override specific context values to test edge cases
export const WithInvalidCredential = {
    render: () => (
        <KcPageStory
            kcContext={{
                login: { username: "johndoe" },
                messagesPerField: {
                    existsError: (field: string) =>
                        ["username", "password"].includes(field),
                    get: () => "Invalid username or password."
                }
            }}
        />
    )
};
```

### Available pages to story

| `pageId` | Component |
|----------|-----------|
| `login.ftl` | `Login.tsx` |
| `register.ftl` | `Register.tsx` |
| `login-update-profile.ftl` | `LoginUpdateProfile.tsx` |
| `idp-review-user-profile.ftl` | `IdpReviewUserProfile.tsx` |
| `login-idp-link-confirm.ftl` | `LoginIdpLinkConfirm.tsx` |
| `login-verify-email.ftl` | `LoginVerifyEmail.tsx` |
| `login-page-expired.ftl` | `LoginPageExpired.tsx` |
| `logout-confirm.ftl` | `LogoutConfirm.tsx` |
| `terms.ftl` | `Terms.tsx` |
| `info.ftl` | `Info.tsx` |
| `delete-account-confirm.ftl` | `DeleteAccountConfirm.tsx` |
| `error.ftl` | `Error.tsx` |

---

## 12. Step 7 — Develop with Vite mock mode

Use this when you want full-page HMR in a browser tab rather than the Storybook
canvas.

**1. Uncomment the mock block in `src/main.tsx` (lines 9–24):**

```ts
import { getKcContextMock } from "./keycloak-theme/login/KcPageStory";

if (import.meta.env.DEV) {
    window.kcContext = getKcContextMock({
        pageId: "login.ftl",   // ← change to the page you want
        overrides: {}
    });
}
```

**2. Start the dev server:**

```bash
yarn dev
# → http://localhost:5173
```

**3. Comment the block back out before building.**  
Leaving it in raises the bundle size and bakes a mock context into production.

---

## 13. Step 8 — Build the theme JAR

```bash
yarn build-keycloak-theme
```

Internally this runs:

```
tsc -b                  TypeScript type-check + emit
vite build              Produces dist/
keycloakify build       Packages dist/ → dist_keycloak/ JARs
```

### Output files

| File | Use for |
|------|---------|
| `dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar` | **Keycloak 26+** — use this |
| `dist_keycloak/keycloak-theme-for-kc-22-to-25.jar` | Keycloak 22–25 |

The theme name embedded in the JAR is **`k2m-theme-superhero`**.

---

## 14. Step 9 — Deploy to Keycloak

### 14.1 Standalone / bare-metal

```bash
# 1. Copy the JAR
cp dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar \
   /opt/keycloak/providers/k2m-theme-superhero.jar

# 2. Rebuild the Keycloak provider cache
/opt/keycloak/bin/kc.sh build

# 3. Start (or restart) Keycloak
/opt/keycloak/bin/kc.sh start
```

### 14.2 Docker / Docker Compose

#### Dockerfile

```dockerfile
FROM quay.io/keycloak/keycloak:26.0.7

# Copy the theme JAR
COPY dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar \
     /opt/keycloak/providers/k2m-theme-superhero.jar

# Pre-build providers for faster startup
RUN /opt/keycloak/bin/kc.sh build

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--optimized"]
```

```bash
docker build -t k2m-keycloak:latest .
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  k2m-keycloak:latest
```

#### Docker Compose

```yaml
services:
  keycloak:
    build: .
    image: k2m-keycloak:latest
    ports:
      - "8080:8080"
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    command: start-dev       # use `start --optimized` in production
```

```bash
docker compose up --build
```

### 14.3 Kubernetes / Helm

#### Option A — Custom image (recommended)

Build the image from §14.2, push it to your registry, then point the Helm chart
at it:

```yaml
# values.yaml  (Bitnami or Codecentric Keycloak chart)
image:
  repository: your-registry/k2m-keycloak
  tag: latest
```

#### Option B — initContainer mount

```yaml
initContainers:
  - name: theme-provider
    image: busybox
    command: ["sh", "-c", "cp /theme/*.jar /providers/"]
    volumeMounts:
      - name: theme-jar
        mountPath: /theme
      - name: providers
        mountPath: /providers

volumes:
  - name: theme-jar
    configMap:
      name: k2m-theme-jar   # ConfigMap has a 1 MB limit — prefer Option A for large JARs
  - name: providers
    emptyDir: {}
```

#### Realm import (apply theme automatically on startup)

Include theme selection in your realm export JSON:

```json
{
  "realm": "your-realm",
  "loginTheme": "k2m-theme-superhero",
  "accountTheme": "k2m-theme-superhero",
  "adminTheme": "k2m-theme-superhero"
}
```

Pass it to Keycloak at startup:

```bash
# standalone
kc.sh import --file /opt/keycloak/data/import/realm.json

# Docker / Kubernetes env var
KC_IMPORT=/opt/keycloak/data/import/realm.json
```

### 14.4 Cloud registries (AWS, Azure, GCP)

Build the custom image from §14.2 first, then push to your cloud registry.

#### AWS ECR

```bash
aws ecr get-login-password --region <region> | \
  docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com

docker tag k2m-keycloak:latest \
  <account>.dkr.ecr.<region>.amazonaws.com/k2m-keycloak:latest

docker push <account>.dkr.ecr.<region>.amazonaws.com/k2m-keycloak:latest
```

Update your ECS task definition or EKS deployment to reference the new image tag.

#### Azure ACR

```bash
az acr login --name <registry-name>

docker tag k2m-keycloak:latest \
  <registry-name>.azurecr.io/k2m-keycloak:latest

docker push <registry-name>.azurecr.io/k2m-keycloak:latest
```

#### GCP GCR / Artifact Registry

```bash
gcloud auth configure-docker

docker tag k2m-keycloak:latest \
  gcr.io/<project-id>/k2m-keycloak:latest

docker push gcr.io/<project-id>/k2m-keycloak:latest
```

---

## 15. Step 10 — Activate the theme in Keycloak Admin

1. Log in to the Admin Console: `http://<host>:8080/admin`
2. Select your realm.
3. Go to **Realm Settings → Themes**.
4. Set each dropdown to `k2m-theme-superhero`:
   - **Login theme**
   - **Account theme**
   - **Admin console theme** (optional)
5. Click **Save**.
6. Verify by opening the login page:
   `http://<host>:8080/realms/<realm>/protocol/openid-connect/auth?client_id=<client>&redirect_uri=...`

---

## 16. Reference — all CLI commands

| Command | What it does |
|---------|-------------|
| `yarn install` | Install dependencies; runs `keycloakify sync-extensions` |
| `yarn dev` | Vite dev server with mock KcContext (port 5173) |
| `yarn storybook` | Storybook dev server (port 6006) |
| `yarn build` | TypeScript + Vite build only (no JAR) |
| `yarn build-keycloak-theme` | Full build → produces JARs in `dist_keycloak/` |
| `yarn build-storybook` | Build static Storybook site |
| `yarn lint` | ESLint |
| `yarn keycloakify add-page` | Scaffold a new page component |
| `yarn keycloakify add-story` | Scaffold a Storybook story for a page |
| `yarn keycloakify update-kc-gen` | Regenerate `kc.gen.tsx` after adding pages/extensions |

---

## 17. Troubleshooting

### Theme does not appear in the Admin Console dropdown

- Confirm the JAR is in `/opt/keycloak/providers/` and `kc.sh build` was run
  after copying it.
- Check Keycloak startup logs:
  ```bash
  grep -i "k2m-theme" /opt/keycloak/logs/keycloak.log
  ```

### Build fails with TypeScript errors

```bash
# Run type-check separately for detailed output
yarn tsc --noEmit
```

### Storybook canvas is blank

- Check that the mock block in `src/main.tsx` is **commented out** when running
  Storybook (the mock is injected by the story itself, not `main.tsx`).
- Run `yarn storybook` from inside `k2m-theme-superhero/`.

### `dist_keycloak/` is missing after `yarn build`

`yarn build` only runs `tsc + vite`. The JARs are produced by the additional
`keycloakify build` step. Always use:

```bash
yarn build-keycloak-theme
```

### `kc.gen.tsx` is out of date after adding a page

```bash
yarn keycloakify update-kc-gen
```

Commit the regenerated file. The hash comment at the top of `kc.gen.tsx` must
match your current page set or Keycloakify will warn at build time.

### Wrong JAR for the Keycloak version

| Keycloak version | JAR file |
|-----------------|----------|
| 22 – 25 | `keycloak-theme-for-kc-22-to-25.jar` |
| 26+ | `keycloak-theme-for-kc-all-other-versions.jar` |
