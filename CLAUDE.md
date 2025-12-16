# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Boekenwurmen Frontend is a SvelteKit application for an interactive reading platform. Built with Svelte 5 (using runes-based reactivity), TypeScript, and Tailwind CSS.

## Common Commands

### Development
```bash
npm run dev              # Start development server (Vite)
npm run build            # Production build
npm run preview          # Preview production build
```

### Code Quality
```bash
npm run check            # Type check with svelte-check
npm run check:watch      # Type check in watch mode
npm run lint             # Run ESLint + Prettier validation
npm run format           # Auto-format code with Prettier
```

### Testing
```bash
npm test                 # Run all tests once (unit tests with Vitest)
npm run test:unit        # Run tests in watch mode
```

**Test Structure:**
- **Client tests** (Svelte components): `src/**/*.svelte.{test,spec}.{js,ts}`
  - Uses Vitest browser mode with Playwright (Chromium headless)
  - Tests component rendering and behavior
- **Server tests** (utilities/logic): `src/**/*.{test,spec}.{js,ts}` (excluding `.svelte.*`)
  - Runs in Node.js environment

### Component Documentation
```bash
npm run storybook        # Start Storybook dev server (port 6006)
npm run build-storybook  # Build static Storybook
```

## Architecture

### Svelte 5 Runes Pattern
This project uses Svelte 5's modern reactivity system:
- `$props()` - Destructure component props with TypeScript types
- `$state()` - Create reactive state variables
- `$derived()` - Computed reactive values
- `{@render children()}` - Render layout slots

Example:
```typescript
type Props = {
  count?: number;
  onClick?: () => void;
};

let { count = 0, onClick }: Props = $props();
let doubled = $derived(count * 2);
```

### File-Based Routing (SvelteKit)
- `src/routes/+layout.svelte` - Root layout (wraps all pages, imports global CSS)
- `src/routes/+page.svelte` - Home page at `/`
- `src/routes/[folder]/+page.svelte` - Route pages
- `src/routes/layout.css` - Global styles with Tailwind imports

### Component Organization
Components follow this structure:
```
src/lib/components/
├── ComponentName.svelte           # Implementation
├── ComponentName.stories.svelte   # Storybook documentation
└── [ComponentName.test.ts]        # Optional unit tests
```

Separate style files may exist (e.g., `button.css` for shared component styles).

### Testing Configuration (vite.config.ts)
Two test projects run simultaneously:
1. **Client project**: Browser-rendered tests for Svelte components
   - Requires assertions (`expect.requireAssertions: true`)
2. **Server project**: Node.js tests for utilities and server logic

### ESLint Philosophy
The project enforces strict code quality rules:
- **Type Safety**: Explicit return types required, avoid `any`, use inline type imports
- **Modern JS/TS**: Prefer `const`, arrow functions, template literals, optional chaining (`?.`), nullish coalescing (`??`)
- **Svelte Patterns**: Use directive shorthands (`class:`, `style:`), typed event dispatchers
- **Import Safety**: No index file imports (prevents circular dependencies)
- **Relaxed in Tests**: Tests allow `any` types and `console.log`

Key rules:
- Functions need explicit return types (except in tests/config/stories)
- Use `type` instead of `interface`
- Promises must be awaited or returned (`no-floating-promises`)
- Prefer `T[]` over `Array<T>` for simple arrays

### Styling
- **Tailwind CSS 4**: Primary styling framework via `@tailwindcss/vite` plugin
- **Plugins**: `@tailwindcss/forms`, `@tailwindcss/typography`
- **Import**: `@import 'tailwindcss'` in `src/routes/layout.css`
- **Prettier Integration**: Auto-sorts Tailwind classes with `prettier-plugin-tailwindcss`

### Environment Variables
Configure in `.env` (see `.env.example`):
- `PUBLIC_API_URL` - Backend API endpoint (public, accessible in client code)

## Development Workflow

### Adding a New Component
1. Create `ComponentName.svelte` in `src/lib/components/`
2. Use Svelte 5 runes for props and state
3. Add TypeScript types for props
4. Create `ComponentName.stories.svelte` for documentation
5. Write tests in `ComponentName.test.ts` if needed (for complex logic)
6. Export from `src/lib/index.ts` if reusable

### Running Tests
- Component tests automatically use browser rendering (Vitest + Playwright)
- All tests require assertions (`expect()` calls)
- Test files next to components: `Component.svelte.test.ts`

### Type Checking
Run `npm run check` before committing to catch TypeScript and Svelte type errors. The CI pipeline runs this automatically.

## Deployment

### Docker
Multi-stage Dockerfile:
1. **Builder stage**: Node 22-alpine, runs `npm ci` and `npm run build`
2. **Production stage**: Serves built app, includes health check

### Docker Compose
Orchestrates frontend (port 3000) and backend (port 3012) with shared network bridge.

### CI/CD (GitHub Actions)
Pipeline runs on push/PR to `main`:
1. Setup Node.js 20
2. Install dependencies (`npm install` + `npm ci`)
3. Install Playwright browsers
4. Run tests (`npm test`)
5. Build project (`npm run build`)

All steps must pass for PR approval.

## Key Files

- `vite.config.ts` - Build config, test projects, Vite plugins
- `svelte.config.js` - Svelte preprocessing (mdsvex support)
- `eslint.config.js` - Comprehensive linting rules (200+ lines)
- `tsconfig.json` - TypeScript strict mode configuration
- `package.json` - Dependencies and npm scripts
- `.github/workflows/pipeline.yml` - CI/CD automation

## Notes

- **State Management**: Currently component-level state with `$state()`. No global store yet (consider Svelte stores or context API for complex shared state).
- **Storybook Integration**: All components should have stories for documentation and visual testing.
- **Type Safety First**: Explicit types preferred over inference. TypeScript strict mode enabled.
- **No Index Imports**: ESLint blocks `import from '../index'` patterns to prevent circular dependencies.
