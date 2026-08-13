# Orbit

A team project management app in the vein of Linear — workspaces, boards, and kanban task tracking with drag and drop.

Built as a full-stack Next.js application with team-based multi-tenancy, subscription billing, and AI-assisted features.

> **Status:** in active development. Core workspace, board, and task flows are implemented; see [Roadmap](#roadmap).

## Features

- **Team onboarding** — create a team on signup, with team-scoped routing (`/[teamSlug]/…`)
- **Workspaces and boards** — multiple boards per workspace, scoped per team
- **Kanban with drag and drop** — task reordering and column moves via `@dnd-kit`
- **Team and user management** — invite and manage members within a team
- **Subscription billing** — Stripe checkout for Lite and Pro tiers
- **Transactional email** — welcome emails through Resend, templated with React Email
- **AI features** — Vercel AI SDK wired to Claude
- **Dark mode by default**, with a light mode toggle

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, `proxy.ts`) |
| UI | React 19, shadcn/ui, Base UI, Tailwind CSS 4 |
| Database & auth | Supabase (Postgres + GoTrue), run locally via Docker |
| Payments | Stripe |
| Email | Resend + React Email |
| AI | Vercel AI SDK (`ai`) with `@ai-sdk/anthropic` |
| Drag & drop | `@dnd-kit` |

## Getting started

### Prerequisites

- Node.js 20+
- Docker (for the local Supabase stack)
- A Stripe account and a Resend account for billing and email

### 1. Install

```bash
npm install
```

### 2. Start Supabase locally

```bash
docker compose up -d
```

This brings up `supabase-db` (Postgres 15.6) and `supabase-auth` (GoTrue). Migrations live in `db/migrations`.

### 3. Configure environment

Create `.env.local` in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_LITE_PRICE_ID=
STRIPE_PRO_PRICE_ID=

# Resend
RESEND_API_KEY=
```

### 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
app/
  (app)/            Authenticated app shell
    [teamSlug]/     Team-scoped routes
    dashboard/
  api/              Route handlers: boards, tasks, teams, workspaces
  auth/  login/  signup/  signout/
  onboarding/       Team creation flow
components/
  board/  kanban/  workspace/  nav/  ui/
db/migrations/      Supabase SQL migrations
lib/                Clients, helpers, server utilities
types/              Shared TypeScript types
```

## Roadmap

- [ ] Realtime board updates via Supabase channels
- [ ] Expanded AI features beyond the current SDK integration
- [ ] Deeper team permissions and roles
