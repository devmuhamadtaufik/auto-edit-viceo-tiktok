# Project Guidelines

## Tech Stack

- **Framework**: SvelteKit (fullstack — frontend + backend API)
- **Database**: SQLite with Drizzle ORM and better-sqlite3
- **Video Processing**: FFmpeg via fluent-ffmpeg
- **Job Queue**: p-queue (in-memory, concurrency: 1)
- **Web Admin**: Datasette for SQLite management
- **UI**: Tailwind CSS + shadcn-ui
- **Testing**: Vitest
- **Infrastructure**: VPS 1GB RAM, Caddy (reverse proxy), PM2 (process manager)

## Coding Rules

1. **No inline comments** — never use `//` in any code
2. **Simple, readable code** — avoid over-engineering; prefer clarity over cleverness
3. **Clean code principles** — meaningful names, single responsibility, small functions
4. **UI decisions** — always reference `DESIGN.md` before building any UI
5. **Component reuse** — never create a new component if one already exists in `/components`
6. **Styling** — always use Tailwind CSS and shadcn-ui; no custom CSS unless absolutely necessary

## Development Workflow

Always follow this order when building any feature:

1. **Unit Test first** — write Vitest tests that define expected behavior
2. **API second** — build the SvelteKit server endpoint or server action
3. **Frontend last** — build the UI that consumes the API

Unit tests are the source of truth. If a test fails, the feature is not complete. Never skip or defer writing tests.

## Build and Test

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run Vitest tests
npm run test:watch   # Run tests in watch mode
```

## Architecture

### Resource Constraints

This runs on a VPS with 1GB RAM and 1 CPU. All code must be efficient and avoid unnecessary memory usage.

### Video Processing

FFmpeg jobs must always be processed one at a time via p-queue (concurrency: 1). Never introduce Redis, BullMQ, or any external queue service.

### Project Structure

```
src/
  lib/
    db/          # Drizzle schema, migrations, queries
    queue/       # p-queue setup and job definitions
    video/       # FFmpeg processing logic
  routes/
    api/         # SvelteKit API endpoints
    +page.svelte # Frontend pages
  components/    # Reusable UI components (shadcn-ui based)
tests/           # Vitest test files
```

## Conventions

- All database access goes through Drizzle ORM — never write raw SQL
- API routes return JSON; use SvelteKit `+server.ts` files
- FFmpeg operations are wrapped in promises and queued via p-queue
- See `DESIGN.md` for design system, color palette, typography, and component guidelines
