# Design System

An Angular + Angular Material design system with a developer portal for community contributions.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Initial Setup From Scratch](#initial-setup-from-scratch)
- [Running the Design System](#running-the-design-system)
- [Running the Portal](#running-the-portal)
- [Publishing Setup](#publishing-setup)
- [How Consumers Use the Library](#how-consumers-use-the-library)
- [How Contributors Add Components](#how-contributors-add-components)
- [Adding Official Components (Core Team)](#adding-official-components-core-team)
- [Changesets and Versioning](#changesets-and-versioning)
- [Storybook Deployment](#storybook-deployment)
- [Architecture Flow](#architecture-flow)
- [Available Components](#available-components)
- [Environment Variables](#environment-variables)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Tech Stack](#tech-stack)

---

## Project Structure

```
├── design-system/           # The design system monorepo (Nx)
│   ├── libs/
│   │   ├── core/            # Design tokens, theming, provider
│   │   ├── components/      # Official component library
│   │   └── community/       # Community-contributed components
│   ├── .storybook/          # Storybook configuration
│   ├── .github/             # CI/CD workflows, PR templates
│   └── CONTRIBUTING.md      # Contribution guidelines
│
├── portal/                  # Component submission portal
│   ├── frontend/            # Angular app (Material + Code Editor)
│   │   └── src/app/
│   │       ├── components/
│   │       │   ├── component-form/    # Multi-step submission wizard
│   │       │   ├── code-editor/       # Code editor with TS/HTML/SCSS tabs
│   │       │   ├── prop-builder/      # @Input/@Output definition UI
│   │       │   ├── live-preview/      # Sandboxed component preview
│   │       │   ├── story-customizer/  # Storybook config + preview
│   │       │   └── browse/            # Component registry browser
│   │       ├── services/
│   │       └── models/
│   └── backend/             # NestJS API
│       └── src/
│           ├── components/  # Submission endpoint + validation
│           ├── github/      # GitHub API (branch, commit, PR creation)
│           └── templates/   # File scaffolding (component, spec, story, readme)
```

---

## Prerequisites

| Requirement | Minimum Version | Check Command |
|-------------|----------------|---------------|
| Node.js | 20+ | `node --version` |
| npm | 10+ | `npm --version` |
| Angular CLI | 19+ | `ng version` |
| Git | 2.30+ | `git --version` |

Install global tools:

```bash
npm install -g @angular/cli nx
```

---

## Initial Setup From Scratch

### Step 1: Create the Nx Workspace

```bash
npx create-nx-workspace@latest design-system \
  --preset=angular-monorepo \
  --appName=docs \
  --style=scss \
  --nxCloud=skip \
  --packageManager=npm
```

### Step 2: Add Angular Material

```bash
cd design-system
npx nx g @angular/material:ng-add --project=docs
```

### Step 3: Generate Libraries

```bash
npx nx g @nx/angular:library core --publishable --importPath=@yourorg/core
npx nx g @nx/angular:library components --publishable --importPath=@yourorg/components
npx nx g @nx/angular:library community --publishable --importPath=@yourorg/community
```

### Step 4: Add Storybook

```bash
npx nx g @nx/storybook:configuration --project=components --uiFramework=@storybook/angular
npx nx g @nx/storybook:configuration --project=community --uiFramework=@storybook/angular
```

### Step 5: Initialize Changesets

```bash
npm install -D @changesets/cli
npx changeset init
```

### Step 6: Set Up the Portal

```bash
cd ../portal/frontend
npm install

cd ../backend
npm install
cp .env.example .env
```

### Step 7: Create GitHub Repository

```bash
cd ../../design-system
git init
git add .
git commit -m "feat: initial design system setup"
git remote add origin https://github.com/your-org/design-system.git
git push -u origin main
```

---

## Running the Design System

### Install Dependencies

```bash
cd design-system
npm install
```

### Run Storybook

```bash
npx nx run components:storybook
```

Opens at http://localhost:6006

### Build Libraries

```bash
# Build all
npx nx run-many --target=build --all

# Build individually
npx nx build core
npx nx build components
npx nx build community
```

Output goes to `dist/libs/core`, `dist/libs/components`, `dist/libs/community`.

### Run Tests

```bash
# All tests
npx nx run-many --target=test --all

# Single library
npx nx test components

# With coverage
npx nx test components --coverage
```

### Run Linting

```bash
npx nx run-many --target=lint --all
npx nx lint core
```

### Check Affected (after changes)

```bash
npx nx affected --target=build --base=main
npx nx affected --target=test --base=main
```

---

## Running the Portal

### Frontend

```bash
cd portal/frontend
npm install
ng serve
```

Opens at http://localhost:4200

| Route | Description |
|-------|-------------|
| `/submit` | Component submission wizard |
| `/browse` | Browse existing components |

### Backend

```bash
cd portal/backend
npm install
cp .env.example .env
# Edit .env with your GitHub credentials
npm run start:dev
```

API runs at http://localhost:3000

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/components` | POST | Submit a new component |
| `/api/components/validate` | POST | Validate before submitting |
| `/api/components/categories` | GET | List available categories |
| `/api/components/check-name/:name` | GET | Check name availability |

### Run Both Together

```bash
# Install concurrently
npm install -g concurrently

# Run from project root
concurrently "cd portal/backend && npm run start:dev" "cd portal/frontend && ng serve"
```

---

## Publishing Setup

### Option A: GitHub Packages (Private)

1. Create `.npmrc` in design-system root:

```
@yourorg:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

2. Generate a GitHub Token at https://github.com/settings/tokens with `write:packages` and `read:packages` scopes.

3. Publish:

```bash
npx nx build core && cd dist/libs/core && npm publish
npx nx build components && cd dist/libs/components && npm publish
```

### Option B: Verdaccio (Local/Self-Hosted)

```bash
npm install -g verdaccio
verdaccio
npm set registry http://localhost:4873
npx nx build core && cd dist/libs/core && npm publish
```

### Option C: npm Public

```bash
npm login
npx nx build core && cd dist/libs/core && npm publish --access=public
```

### Auto-Publish via CI

The `.github/workflows/publish.yml` auto-publishes on merge to main. Set `NPM_TOKEN` in GitHub repo secrets.

---

## How Consumers Use the Library

### Step 1: Install

```bash
npm install @yourorg/core @yourorg/components
```

If using GitHub Packages, add `.npmrc`:

```
@yourorg:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=YOUR_READ_TOKEN
```

### Step 2: Configure App

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideDesignSystem } from '@yourorg/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideDesignSystem({ theme: 'light' }),
  ],
};
```

### Step 3: Add Global Styles

```scss
// styles.scss
@use '@yourorg/core/tokens' as tokens;
@use '@yourorg/core/theme' as theme;

@include theme.ds-theme();

.dark-mode {
  @include theme.ds-dark-theme();
}
```

### Step 4: Use Components

```typescript
import { Component } from '@angular/core';
import { DsButtonComponent, DsCardComponent, DsInputComponent } from '@yourorg/components';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DsButtonComponent, DsCardComponent, DsInputComponent],
  template: `
    <ds-card title="Login" variant="elevated" [showActions]="true">
      <ds-input label="Email" type="email" prefixIcon="mail" [fullWidth]="true"></ds-input>
      <ds-input label="Password" type="password" prefixIcon="lock" [fullWidth]="true"></ds-input>
      <div dsCardActions>
        <ds-button variant="primary" size="lg">Sign In</ds-button>
      </div>
    </ds-card>
  `,
})
export class LoginComponent {}
```

---

## How Contributors Add Components

### Via the Portal (Recommended)

1. Open http://localhost:4200/submit
2. Step 1: Enter component name (kebab-case), selector, description, category
3. Step 2: Write TypeScript, HTML, SCSS in the tabbed editor
4. Step 3: Define @Input and @Output properties with types and defaults
5. Step 4: See live preview and configure Storybook controls
6. Step 5: Enter author info and click "Create Pull Request"

The backend automatically scaffolds all files and creates a GitHub PR.

### Via Git (Manual)

```bash
git clone https://github.com/your-org/design-system.git
cd design-system && npm install
git checkout -b community/add-status-badge
mkdir -p libs/community/src/lib/status-badge
```

Create required files then submit:

```bash
npx nx test community
npx nx lint community
git add . && git commit -m "feat(community): add status-badge component"
git push origin community/add-status-badge
```

Required files per component:

```
libs/community/src/lib/status-badge/
├── status-badge.component.ts
├── status-badge.component.html
├── status-badge.component.scss
├── status-badge.component.spec.ts
├── status-badge.stories.ts
├── index.ts
└── README.md
```

---

## Adding Official Components (Core Team)

```bash
git checkout -b feat/add-dialog
mkdir -p libs/components/src/lib/dialog
```

Create component, story, and spec. Then:

```bash
npx nx test components
npx nx lint components
npx changeset  # Select @yourorg/components, minor bump
git add . && git commit -m "feat(components): add ds-dialog"
git push origin feat/add-dialog
```

---

## Changesets and Versioning

### Setup (first time)

```bash
npx changeset init
```

### Creating a Changeset (with every PR)

```bash
npx changeset
# Select package → bump type → write summary
```

### Releasing

```bash
npx changeset version   # Bumps versions + updates changelogs
git add . && git commit -m "chore: version packages"
npx changeset publish   # Publishes to npm
```

Or automate with the Changesets GitHub Action in `.github/workflows/release.yml`.

---

## Storybook Deployment

### Option A: GitHub Pages (Free)

Already configured in `.github/workflows/publish.yml`. Enable in repo Settings → Pages → Source: GitHub Actions.

Deployed to: `https://your-org.github.io/design-system/`

### Option B: Chromatic

```bash
npm install -D chromatic
npx chromatic --project-token=YOUR_TOKEN
```

### Option C: Vercel/Netlify

Build command: `npx nx run components:build-storybook`
Output directory: `dist/storybook`

---

## Architecture Flow

```
Developer → Portal UI → Backend API → GitHub PR → CI Validates → Merge
                                                                    │
                                                                    ▼
Consumer → npm install @yourorg/components → Import → Use ← npm Publish
                                                             Storybook Deploy
```

Portal submission flow in detail:

1. Developer fills form in Portal UI
2. Frontend POSTs to Backend API
3. Backend validates submission
4. TemplateService generates 7 files (component, template, styles, spec, story, index, readme)
5. GithubService creates branch, commits files, opens PR
6. CI runs lint + test + build + accessibility
7. Maintainer reviews and merges
8. Publish workflow builds and publishes to npm, deploys Storybook

---

## Available Components

### Core (@yourorg/core)

| Export | Description |
|--------|-------------|
| `provideDesignSystem()` | App-level provider for theme config |
| `_tokens.scss` | 70+ CSS custom properties |
| `_theme.scss` | Angular Material custom theme |
| `ds-theme()` mixin | Apply full Material theme |
| `ds-dark-theme()` mixin | Apply dark mode |

### Components (@yourorg/components)

| Component | Selector | Key Inputs |
|-----------|----------|------------|
| Button | `ds-button` | variant, size, loading, disabled, icon |
| Card | `ds-card` | title, subtitle, variant, clickable, showActions |
| Input | `ds-input` | label, type, placeholder, prefixIcon, suffixIcon, hint, error |

### Community (@yourorg/community)

Accepting contributions via the portal.

---

## Environment Variables

### Portal Backend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GITHUB_TOKEN` | PAT with `repo` + `write:packages` scope | Yes | — |
| `GITHUB_OWNER` | GitHub org or username | Yes | — |
| `GITHUB_REPO` | Repository name | Yes | — |
| `GITHUB_BASE_BRANCH` | Target branch for PRs | No | main |

### GitHub Actions Secrets

| Secret | Purpose |
|--------|---------|
| `NPM_TOKEN` | Authenticate to npm registry for publishing |

---

## Examples

### Example 1: Button Variants

```typescript
import { Component } from '@angular/core';
import { DsButtonComponent } from '@yourorg/components';

@Component({
  selector: 'app-buttons-demo',
  standalone: true,
  imports: [DsButtonComponent],
  template: `
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      <ds-button variant="primary">Primary</ds-button>
      <ds-button variant="secondary">Secondary</ds-button>
      <ds-button variant="outline">Outline</ds-button>
      <ds-button variant="ghost">Ghost</ds-button>
      <ds-button variant="danger">Delete</ds-button>
      <ds-button variant="primary" size="sm">Small</ds-button>
      <ds-button variant="primary" size="lg" icon="rocket">Launch</ds-button>
      <ds-button variant="primary" [loading]="true">Saving...</ds-button>
      <ds-button variant="primary" [disabled]="true">Disabled</ds-button>
    </div>
  `,
})
export class ButtonsDemoComponent {}
```

### Example 2: Card with Actions

```typescript
import { Component } from '@angular/core';
import { DsCardComponent, DsButtonComponent } from '@yourorg/components';

@Component({
  selector: 'app-card-demo',
  standalone: true,
  imports: [DsCardComponent, DsButtonComponent],
  template: `
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
      <ds-card title="Elevated" variant="elevated">
        <p>Card with shadow that lifts on hover.</p>
      </ds-card>

      <ds-card title="Outlined" variant="outlined">
        <p>Card with a border.</p>
      </ds-card>

      <ds-card title="With Actions" variant="elevated" [showActions]="true">
        <p>Card with action buttons.</p>
        <div dsCardActions>
          <ds-button variant="ghost" size="sm">Cancel</ds-button>
          <ds-button variant="primary" size="sm">Save</ds-button>
        </div>
      </ds-card>
    </div>
  `,
})
export class CardDemoComponent {}
```

### Example 3: Form with Validation

```typescript
import { Component } from '@angular/core';
import { DsInputComponent, DsButtonComponent, DsCardComponent } from '@yourorg/components';

@Component({
  selector: 'app-form-demo',
  standalone: true,
  imports: [DsInputComponent, DsButtonComponent, DsCardComponent],
  template: `
    <ds-card title="Contact Form" variant="elevated" [showActions]="true">
      <ds-input
        label="Full Name"
        placeholder="John Doe"
        prefixIcon="person"
        [fullWidth]="true"
        [required]="true">
      </ds-input>

      <ds-input
        label="Email"
        type="email"
        placeholder="john@example.com"
        prefixIcon="mail"
        hint="We will never share your email"
        [fullWidth]="true"
        [required]="true">
      </ds-input>

      <ds-input
        label="Website"
        type="url"
        placeholder="https://example.com"
        prefixIcon="language"
        suffixIcon="open_in_new"
        [fullWidth]="true">
      </ds-input>

      <div dsCardActions>
        <ds-button variant="outline">Cancel</ds-button>
        <ds-button variant="primary" icon="send">Submit</ds-button>
      </div>
    </ds-card>
  `,
})
export class FormDemoComponent {}
```

### Example 4: Using Design Tokens in Custom Styles

```scss
.my-custom-section {
  padding: var(--ds-space-lg);
  background: var(--ds-color-neutral-50);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-md);
  font-family: var(--ds-font-family-base);
  transition: all var(--ds-transition-normal);

  &:hover {
    box-shadow: var(--ds-shadow-lg);
    transform: translateY(-2px);
  }

  .title {
    font-size: var(--ds-font-size-xl);
    font-weight: var(--ds-font-weight-semibold);
    color: var(--ds-color-neutral-900);
  }

  .accent-text {
    color: var(--ds-color-primary-500);
  }
}
```

### Example 5: Dark Mode Toggle

```typescript
import { Component, signal } from '@angular/core';
import { DsButtonComponent } from '@yourorg/components';

@Component({
  selector: 'app-dark-mode',
  standalone: true,
  imports: [DsButtonComponent],
  template: `
    <ds-button
      variant="ghost"
      [icon]="isDark() ? 'light_mode' : 'dark_mode'"
      (click)="toggle()">
      {{ isDark() ? 'Light Mode' : 'Dark Mode' }}
    </ds-button>
  `,
})
export class DarkModeComponent {
  isDark = signal(false);

  toggle() {
    this.isDark.update(v => !v);
    document.body.classList.toggle('dark-mode');
  }
}
```

### Example 6: What the Portal Generates

When a developer submits "status-badge" via the portal, these files are created:

**status-badge.component.ts:**

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
})
export class StatusBadgeComponent {
  @Input() status: 'active' | 'inactive' | 'pending' = 'active';
  @Input() label = '';
  @Input() dot = false;
}
```

**status-badge.stories.ts:**

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { StatusBadgeComponent } from './status-badge.component';

const meta: Meta<StatusBadgeComponent> = {
  title: 'Community/StatusBadge',
  component: StatusBadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: ['active', 'inactive', 'pending'] },
    label: { control: 'text' },
    dot: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<StatusBadgeComponent>;

export const Default: Story = {
  args: { status: 'active', label: 'Active', dot: false },
};
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `nx: command not found` | Run `npm install -g nx` or use `npx nx` |
| ng-packagr build fails | Verify tsconfig.base.json paths |
| Storybook can't find stories | Check `.storybook/main.ts` stories glob |
| Portal can't create PR | Verify GITHUB_TOKEN has repo scope |
| npm publish 403 | Check .npmrc registry URL and token |
| Styles not applied | Ensure `@use '@yourorg/core/theme'` in global styles |
| Dark mode not working | Add `.dark-mode` class to a parent element |
| Component name taken | Choose different name or check existing |
| Backend won't start | Verify .env file exists with all required vars |

### Useful Debug Commands

```bash
npx nx reset              # Clear Nx cache
npx nx graph              # View dependency graph
npx nx affected --target=test  # Test only changed libs
npx nx show project components --web  # See project details
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Monorepo | Nx 20 | Multi-package management, caching |
| Framework | Angular 19 | Component framework |
| UI Library | Angular Material 19 | Base component primitives |
| Theming | SCSS + CSS Custom Properties | Design tokens |
| Documentation | Storybook 8 | Interactive component docs |
| Portal Frontend | Angular 19 + Material | Developer submission UI |
| Portal Backend | NestJS 10 | API, validation, scaffolding |
| GitHub Integration | Octokit | PR creation |
| CI/CD | GitHub Actions | Lint, test, build, publish |
| Publishing | npm (private registry) | Package distribution |
| Versioning | Changesets | Semantic versioning + changelogs |
