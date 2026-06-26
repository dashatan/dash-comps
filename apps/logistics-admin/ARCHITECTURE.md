# Logistics Admin — Architecture

European fleet operations dashboard with a real HTTP API, hexagonal frontend layers, and shared seed data.

## Monorepo packages

| Package                     | Role                                                       |
| --------------------------- | ---------------------------------------------------------- |
| `@dash/logistics-contracts` | Zod schemas and DTO types shared by API and admin          |
| `@dash/logistics-seed`      | Mock data generators, `LogisticsDataStore`, tracker events |
| `@dash/logistics-api`       | Hono REST API (`:3001`), SQLite meta persistence           |
| `@dash/logistics-admin`     | React SPA (Vite + TanStack Router + Query)                 |

## Frontend layers (`apps/logistics-admin/src`)

```
routes/          → thin TanStack Router files
features/        → pages, components, hooks (UI only)
domain/          → repository port interfaces
infrastructure/  → HTTP clients, DTO mappers
core/            → env, api-client, query-client, query-keys
shared/          → cross-feature UI and hooks
```

**Rule:** feature pages import repositories via `infrastructure/http/repositories` — never raw `fetch` or deleted `src/data/*`.

## API

- Base path: `/api/v1/*`
- Dev proxy: Vite forwards `/api` → `http://localhost:3001`
- Run stack: `pnpm dev:stack` or `pnpm dev:api` + `pnpm dev:admin`

## Adding a new module

1. Add Zod schemas to `packages/logistics-contracts`
2. Add store methods in `packages/logistics-seed`
3. Expose Hono routes in `apps/logistics-api/src/app.ts`
4. Add port + repository in `domain/` and `infrastructure/http/`
5. Create `features/<module>/` with pages, hooks, components
6. Add explicit route under `src/routes/<module>/`
7. Register nav in `src/config/menu-items.ts`

## Tracker

Uses `tracker-legacy` with `Event[]` from `/api/v1/tracker/live` and `/api/v1/tracker/playback`.
