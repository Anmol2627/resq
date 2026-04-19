# RESQ+

Emergency response web app that connects people in distress with nearby responders. Users sign up on a landing page, manage profile and emergency contacts, trigger SOS incidents synced in **Supabase**, and use **live maps** plus an **operations** view for responders to accept incidents and open directions.

## Features

- **Landing** — Marketing page with login, multi-step signup (profile, medical notes, emergency contacts, role), and guest access for quick SOS.
- **Main app** (`/app`) — Dashboard, SOS flow, active incident tracking with real map (Leaflet), live map, operations hub, profile, skills library, settings.
- **SOS workflow** — Create incidents in Postgres; optional WhatsApp alerts from the tracking screen; Google Maps directions for responders.
- **Cross-device** — Incidents and presence update via Supabase + React Query polling.
- **Deployment** — `vercel.json` SPA rewrites so client routes (e.g. `/app`) work on refresh.

## Tech stack

| Area | Choice |
|------|--------|
| UI | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui-style components, Framer Motion |
| Data & auth | Supabase (Auth + Postgres + RLS) |
| Server state | TanStack React Query |
| Maps | Leaflet (dynamic import) |
| Routing | React Router v6 |

## Prerequisites

- **Node.js** 18+ (20 LTS recommended)
- **npm** (ships with Node)
- A **Supabase** project with Auth enabled (email/password; optional anonymous sign-in for guest SOS)

## Environment variables

Create a `.env` file in the project root (do **not** commit it):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Restart the dev server after changing env values.

## Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (e.g. `http://localhost:5173` or `http://localhost:8080` if you pass `--port`).

Useful scripts:

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint |

## Supabase database

1. In the Supabase dashboard, open **SQL Editor**.
2. Run the script in [`supabase/schema.sql`](supabase/schema.sql) (creates `profiles`, `emergency_contacts`, `incidents`, triggers, and RLS policies).

Re-run safe parts of the script when the repo adds migrations (policies use `drop policy if exists` / `create policy` patterns where applicable).

**Auth tips for development**

- If signup emails hit rate limits, space out attempts or relax email confirmation in Supabase Auth settings while testing.
- Ensure RLS policies match your product rules after schema changes.

## Deploying (Vercel)

1. Connect the GitHub repo to Vercel.
2. Set **Environment Variables** in the Vercel project: same `VITE_SUPABASE_*` keys as local.
3. Deploy; `vercel.json` already rewrites unknown paths to `index.html` for SPA routing.

Do **not** add `.env` to git — use Vercel’s env UI only.

## Repository layout (high level)

```
src/
  pages/          # Landing, main Index shell, NotFound
  screens/        # Feature screens (SOS, map, operations, profile, settings, …)
  components/     # Shared UI (nexus shell, shadcn-style primitives)
  hooks/resq.ts   # React Query hooks for Supabase-backed APIs
  lib/resq.ts     # Supabase data access (incidents, profile, map users, …)
  lib/supabase.ts # Supabase browser client (null if env missing)
supabase/
  schema.sql      # Canonical DB + RLS for local/prod setup
vercel.json       # SPA fallback rewrites
```

## Contributing

1. Create a branch from `main`.
2. Run `npm run lint` and `npm run build` before opening a PR.
3. Keep secrets out of commits (`.env`, keys, service role keys).

## License

Private project unless otherwise specified by the repository owners.
