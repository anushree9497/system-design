# Contributing to the Design System

Thank you for contributing! This guide explains how to add components.

## Quick Start (via Portal)

The easiest way to submit a component is through the **Design System Portal**:

1. Go to the portal: `http://your-portal-url/submit`
2. Fill in component metadata (name, description, category)
3. Write your component code in the editor
4. Define inputs and outputs
5. Configure Storybook story
6. Submit — a PR is created automatically!

## Manual Contribution (via Git)

### Prerequisites
- Node.js 20+
- npm 10+

### Setup
```bash
git clone https://github.com/your-org/design-system.git
cd design-system
npm install
```

### Create Your Component

1. **Create a branch:**
   ```bash
   git checkout -b community/add-your-component
   ```

2. **Scaffold the component:**
   ```bash
   mkdir -p libs/community/src/lib/your-component
   ```

3. **Required files:**
   ```
   libs/community/src/lib/your-component/
   ├── your-component.component.ts      # Component class
   ├── your-component.component.html    # Template
   ├── your-component.component.scss    # Styles
   ├── your-component.component.spec.ts # Tests
   ├── your-component.stories.ts        # Storybook story
   ├── index.ts                         # Barrel export
   └── README.md                        # Documentation
   ```

4. **Component requirements:**
   - Must be a standalone component
   - Must use `ds-` prefix for selector
   - Must use design tokens from `@ds/core` for styling
   - Must include at least one Storybook story
   - Must have basic unit tests
   - Must be accessible (keyboard nav, ARIA, contrast)

5. **Run checks:**
   ```bash
   npx nx test community
   npx nx lint community
   npx nx run components:storybook  # Verify your story renders
   ```

6. **Submit PR:**
   ```bash
   git add .
   git commit -m "feat(community): add your-component"
   git push origin community/add-your-component
   ```

### Component Guidelines

#### DO:
- Use design tokens (`var(--ds-color-primary-500)`, `var(--ds-space-md)`, etc.)
- Make components standalone (no NgModule required)
- Support both light and dark themes
- Add `autodocs` tag to stories
- Write meaningful descriptions for all inputs/outputs
- Handle edge cases (empty state, overflow, loading)

#### DON'T:
- Use hardcoded colors or pixel values
- Create components that duplicate existing ones
- Add heavy dependencies without discussion
- Break existing public APIs
- Skip accessibility

### Design Tokens Reference

Use these CSS variables instead of hardcoded values:

| Category | Example Variables |
|----------|------------------|
| Colors | `--ds-color-primary-500`, `--ds-color-neutral-800` |
| Spacing | `--ds-space-xs`, `--ds-space-md`, `--ds-space-xl` |
| Typography | `--ds-font-size-sm`, `--ds-font-weight-medium` |
| Radius | `--ds-radius-sm`, `--ds-radius-md`, `--ds-radius-lg` |
| Shadows | `--ds-shadow-sm`, `--ds-shadow-md`, `--ds-shadow-lg` |
| Transitions | `--ds-transition-fast`, `--ds-transition-normal` |

### Review Process

1. PR is auto-labeled by the CI
2. Automated checks run (lint, test, build, a11y)
3. A maintainer reviews code quality and design consistency
4. Feedback addressed (if any)
5. Merged → auto-published to npm → appears in Storybook

## Questions?

- Open a discussion in the repo
- Tag maintainers in your PR
- Check existing components for reference patterns
