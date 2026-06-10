---
name: sveltekit-feature
description: "Scaffold a new SvelteKit feature following the project workflow: Vitest test first, then API endpoint, then frontend UI. Use when building any new feature, endpoint, or page."
argument-hint: "[feature name or description]"
---

# SvelteKit Feature Builder

## When to Use

- Building any new feature in this project
- Adding a new API endpoint or server action
- Creating a new page or UI component that consumes an API

## Workflow

Always follow this exact order. Never skip a step.

### Step 1: Unit Test

Create the test file in `tests/` using Vitest:

```ts
import { describe, it, expect } from 'vitest';

describe('feature name', () => {
  it('should define the expected behavior', () => {
    expect(true).toBe(true);
  });
});
```

Run the test to confirm it fails before implementing:

```bash
npm run test
```

### Step 2: API Endpoint

Build the SvelteKit server endpoint in `src/routes/api/`:

- Use `+server.ts` for REST endpoints
- Use Drizzle ORM for all database access
- Return JSON responses
- Keep functions small and single-purpose

### Step 3: Frontend UI

Build the UI that consumes the API:

- Check `src/components/` for existing reusable components first
- Use Tailwind CSS and shadcn-ui exclusively
- Reference `DESIGN.md` for colors, typography, and spacing
- No custom CSS unless absolutely necessary

### Step 4: Verify

Run tests again to confirm everything passes:

```bash
npm run test
```

## Rules

- Never skip writing tests — they are the source of truth
- Never add inline comments (`//`) in any code
- Keep code simple and readable — avoid over-engineering
- All database access through Drizzle ORM, never raw SQL
