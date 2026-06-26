# Vercel deployment (monorepo)

One Git repository, **three Vercel projects**. The existing `dash-comps` project serves the showcase app at https://dash-comps.vercel.app. Each push can trigger all three; ignored-build scripts skip apps with no relevant changes.

## Projects

| Vercel project name  | Root directory         | URL                                   |
| -------------------- | ---------------------- | ------------------------------------- |
| `dash-logistics`     | `apps/logistics-admin` | https://dash-logistics.vercel.app     |
| `dash-logistics-api` | `apps/logistics-api`   | https://dash-logistics-api.vercel.app |
| `dash-comps`         | `apps/showcase`        | https://dash-comps.vercel.app         |

Config lives in each app’s `vercel.json` (install, build, rewrites, ignore command).

## One-time dashboard setup

1. In [Vercel](https://vercel.com), import this repo **three times** (or add three projects from the monorepo).
2. For each project, set **Root Directory** to the path in the table above.
3. Enable **Include source files outside of the Root Directory** (monorepo).
4. Set the **project name** exactly as in the table (`dash-logistics` for the admin app).
5. Use **Node.js 20.x**.
6. Leave build/install settings empty in the UI if `vercel.json` is present — the file overrides them.

### Admin ↔ API

`dash-logistics` builds with:

```env
VITE_API_URL=https://dash-logistics-api.vercel.app/api
```

Defined in `apps/logistics-admin/vercel.json`. Override in the Vercel dashboard if you use a custom API domain, then redeploy admin.

### API (serverless)

- Entry: `apps/logistics-api/api/[[...route]].ts` (`hono/vercel`)
- Local dev still uses `pnpm dev:api` (`@hono/node-server` + SQLite meta in `src/index.ts`)
- Production uses in-memory `LogisticsDataStore` only (no SQLite on serverless)

## Ignored build step

Scripts in `scripts/vercel/`:

| Script                      | Used by              |
| --------------------------- | -------------------- |
| `ignore-logistics-admin.sh` | `dash-logistics`     |
| `ignore-logistics-api.sh`   | `dash-logistics-api` |
| `ignore-showcase.sh`        | `dash-comps`         |

Vercel: exit **0** = build, exit **1** = skip.

## Verify after deploy

```text
GET https://dash-logistics-api.vercel.app/api/health
→ {"status":"ok"}

https://dash-logistics.vercel.app
→ Overview KPIs load
```

## Local development

Unchanged:

```bash
pnpm dev:stack    # API + admin
pnpm dev:api      # API only
pnpm dev:admin    # admin only (proxies /api → :3001)
```
