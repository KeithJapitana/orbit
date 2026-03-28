# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Orbit** is a Linear-style project management application that enables teams to collaborate on tasks through workspaces, Kanban boards, and team management.

**Tech Stack**: Next.js 16, Supabase (PostgreSQL, Auth, Realtime), Stripe, Resend, AI SDK (Anthropic Claude), Shadcn/ui, Tailwind CSS v4, TypeScript (strict)

## Commands

### Development
- `npm run dev` — Start dev server (http://localhost:3000)
- `npm run build` — Production build
- `npm run lint` — ESLint via flat config (`eslint.config.mjs`)

### Supabase (Docker)
- `docker compose up -d` — Start Supabase services locally (PostgreSQL, Auth, Studio on :54323)
- `docker compose down` — Stop Supabase services
- `docker compose logs -f` — View Supabase logs
- Access Supabase Studio: http://localhost:54323 (default credentials in docker-compose.yml)

### Database
- Apply migrations: Run SQL files in `db/migrations/` via Supabase Studio SQL editor
- Seed data: Create and run seed scripts as needed

### Stripe (Local Testing)
- `stripe listen --forward-to localhost:3000/api/webhooks/stripe` — Forward webhook events locally
- Use Stripe test mode keys in `.env.local`

## Stack

Next.js 16.2.1 / React 19.2.4 / TypeScript (strict) / Tailwind CSS v4 / ESLint v9

### Key Dependencies
- `@supabase/supabase-js`, `@supabase/ssr` — Database & auth
- `stripe`, `@stripe/stripe-js` — Payments
- `resend` — Transactional emails
- `ai`, `@ai-sdk/anthropic` — AI features (Claude)
- `@dnd-kit/*` — Drag and drop for Kanban
- `next-themes` — Dark/light mode
- `lucide-react` — Icons
- `class-variance-authority`, `clsx`, `tailwind-merge` — Utility classes

## Critical: This is NOT the Next.js you know

Next.js 16 has breaking changes — APIs, conventions, and file structure may differ from training data. **Read the relevant guide in `node_modules/next/dist/docs/` before writing code.** Heed deprecation notices.

Notable Next.js 16 differences:
- `params` in page/layout components is a `Promise` (must be awaited or use `.then()`)
- Route segment config uses `export const unstable_instant` for instant navigation validation
- Cache Components feature with `'use cache'` directive on async components
- No `tailwind.config.js` — Tailwind v4 config is in `app/globals.css` via `@theme inline`
- ESLint uses v9 flat config format (`eslint.config.mjs`), not `.eslintrc`
- **Middleware is renamed to proxy.ts** - but middleware.ts still works (with deprecation warning)

## Architecture

### Directory Structure
```
app/                    # Next.js App Router
  (app)/               # Protected routes (requires auth)
    dashboard/         # Team dashboard
    [teamSlug]/        # Team-scoped routes
      workspaces/      # Workspace list
      workspace/[id]/  # Single workspace
      board/[id]/      # Kanban board view
      team/            # Team management
      billing/         # Subscription management
  api/                 # API routes & webhooks
    webhooks/stripe/   # Stripe webhook handler
    teams/             # Team CRUD
    workspaces/        # Workspace CRUD
    boards/            # Board CRUD
    tasks/             # Task CRUD & reordering
  login/               # Login page
  signup/              # Sign up page
  onboarding/          # New user onboarding
components/            # React components
  ui/                  # Shadcn UI components
  nav/                 # Navigation components
  kanban/              # Kanban board components
  team/                # Team management components
lib/                   # Utility libraries
  supabase/            # Supabase clients (browser, server, middleware)
  stripe.ts            # Stripe client
  resend.ts            # Resend client
  ai.ts                # AI SDK config
  auth.ts              # Auth helpers
  permissions.ts       # RBAC helpers
  subscription-limits.ts # Usage limits
types/                 # TypeScript type definitions
db/                    # Database migrations and seeds
emails/                # React Email templates
```

### App Router Conventions
- App Router only (`app/` directory). No Pages Router usage.
- Pages are React Server Components by default. Use `"use client"` directive only when needed.
- `@/*` path alias maps to project root (configured in `tsconfig.json`).
- Root layout (`app/layout.tsx`) sets up Geist fonts, ThemeProvider, TooltipProvider, and Sonner toaster.
- Global styles in `app/globals.css` — Tailwind imported via `@import "tailwindcss"`, theme defined with `@theme inline`.
- Dark mode via `next-themes` with toggle (defaultTheme="dark").

### Data Layer
- **Supabase**: PostgreSQL with Row Level Security (RLS)
- **Realtime**: Supabase Realtime for live collaboration
- **Auth**: Supabase Auth (email/password, magic links)
- **Storage**: Supabase Storage for avatars and file uploads

### Authentication
- Proxy (`proxy.ts`) protects authenticated routes (rename of middleware.ts)
- Server components: use `createClient()` from `lib/supabase/server.ts`
- Client components: use `createClient()` from `lib/supabase/client.ts`
- Route handlers: use `createClient()` pattern from server.ts

### UI Components
- **Shadcn/ui**: Base component library (Radix UI + Tailwind)
- **Dark mode**: Default dark, toggleable via ThemeProvider (next-themes)
- **Drag & Drop**: `@dnd-kit` for Kanban board interactions
- **Icons**: Lucide React

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_LITE_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...

# Resend
RESEND_API_KEY=re_...

# AI (Anthropic)
ANTHROPIC_API_KEY=sk-ant-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Key docs to read before writing code

- `node_modules/next/dist/docs/01-app/01-getting-started/` — getting started guides
- `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md` — instant navigation with `unstable_instant`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — server/client component boundaries
- Supabase docs: https://supabase.com/docs/guides/auth/server-side/nextjs
- Stripe docs: https://stripe.com/docs/webhooks/best-practices

## Common Tasks

### Adding a Shadcn Component
```bash
npx shadcn@latest add [component-name]
# Example: npx shadcn@latest add dialog
```

### Creating a Database Migration
- Create SQL file in `db/migrations/` with naming: `00N_description.sql`
- Run via Supabase Studio SQL editor (http://localhost:54323)

### Testing Stripe Webhooks Locally
1. Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
2. Copy the webhook signing key to `STRIPE_WEBHOOK_SECRET` in `.env.local`
3. Trigger test events from Stripe Dashboard

### Adding a New API Route
Create `app/api/[route]/route.ts` and export named handlers:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  // Handle POST request
}
```

### RLS Policy Pattern
All tables have RLS enabled with policies:
- `users can read teams they are members of`
- `users can insert teams (become owner)`
- `users can update teams they own or are admin of`
- Always check `team_members` for membership

### Server Action Pattern
For mutations, use Server Actions for better UX:
```typescript
// app/actions/tasks.ts
'use server';

import { createClient } from '@/lib/supabase/server';

export async function createTask(formData: FormData) {
  const supabase = await createClient();
  // ... create task
}
```

## Subscription Tiers & Limits

| Tier   | Workspaces | Boards | Team Members | Price  |
|--------|------------|--------|--------------|--------|
| Free  | 1          | 2      | 5            | $0     |
| Lite  | 5          | 10     | 15           | $9/mo  |
| Pro   | Unlimited  | Unlimited | Unlimited | $19/mo |

Enforce limits via `lib/subscription-limits.ts` helpers.

## Implementation Status

Track progress in `plan.md` at project root.
