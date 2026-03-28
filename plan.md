# Orbit - Implementation Progress Tracker

## Milestone Status

- [ ] **Milestone 1: Foundation & Infrastructure Setup** (IN PROGRESS)
- [ ] **Milestone 0: Landing Page**
- [ ] **Milestone 2: Authentication & User Onboarding**
- [ ] **Milestone 3: Core Dashboard & Navigation**
- [ ] **Milestone 4: Workspace & Board Management**
- [ ] **Milestone 5: Kanban Board with Drag & Drop**
- [ ] **Milestone 6: Team & User Management**
- [ ] **Milestone 7: Stripe Payments & Subscriptions**
- [ ] **Milestone 8: AI Features**
- [ ] **Milestone 9: Polish & Production Readiness**

---

## Milestone 1: Foundation & Infrastructure Setup

### 1.1 Dependencies & Configuration
- [x] Install Supabase client (@supabase/supabase-js, @supabase/ssr)
- [x] Install Stripe SDK (stripe, @stripe/stripe-js)
- [x] Install Resend SDK (resend)
- [x] Install AI SDK (ai, @ai-sdk/anthropic)
- [x] Install Shadcn/ui CLI and initialize
- [ ] Set up Docker Compose for local Supabase
- [ ] Create .env.local with integration keys
- [x] Create plan.md to track progress

### 1.2 Directory Structure
- [x] Create: lib/, components/ui/, app/api/, types/, db/, emails/

### 1.3 Core Library Files
- [ ] lib/supabase/client.ts, server.ts, middleware.ts
- [ ] lib/stripe.ts, lib/resend.ts, lib/ai.ts
- [x] lib/utils.ts

### 1.4 Database Schema
- [ ] Create migrations for users, teams, team_members, workspaces, boards, columns, tasks with RLS policies

### 1.5 Authentication
- [ ] Configure Supabase Auth, middleware.ts, lib/auth.ts

### 1.6 Shadcn/ui Components
- [x] Install button, card, input, label, select, dialog, dropdown-menu, avatar, badge, separator, sonner, form, sheet, tooltip, popover, command, switch, tabs, textarea

---

## Notes
- Using Next.js 16 with App Router
- Shadcn/ui with Tailwind CSS v4 (inline theme config in globals.css)
- Dark mode default with light mode toggle
- Database: Supabase (PostgreSQL with RLS)
- Payments: Stripe (Free/Lite $9/Pro $19 tiers)
- Email: Resend
- AI: Anthropic Claude via Vercel AI SDK
