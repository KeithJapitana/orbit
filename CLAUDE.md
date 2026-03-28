# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint via flat config (`eslint.config.mjs`)
- No test framework is configured yet.

## Stack

Next.js 16.2.1 / React 19.2.4 / TypeScript (strict) / Tailwind CSS v4 / ESLint v9.

## Critical: This is NOT the Next.js you know

Next.js 16 has breaking changes — APIs, conventions, and file structure may all differ from training data. **Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.** Heed deprecation notices.

Notable Next.js 16 differences:
- `params` in page/layout components is a `Promise` (must be awaited or use `.then()`)
- Route segment config uses `export const unstable_instant` for instant navigation validation
- Cache Components feature with `'use cache'` directive on async components
- No `tailwind.config.js` — Tailwind v4 config is in `app/globals.css` via `@theme inline`
- ESLint uses v9 flat config format (`eslint.config.mjs`), not `.eslintrc`

## Architecture

- App Router only (`app/` directory). No Pages Router usage.
- Pages are React Server Components by default. Use `"use client"` directive only when needed.
- `@/*` path alias maps to project root (configured in `tsconfig.json`).
- Root layout (`app/layout.tsx`) sets up Geist fonts as CSS variables.
- Global styles in `app/globals.css` — Tailwind imported via `@import "tailwindcss"`, theme defined with `@theme inline`.
- Dark mode via `prefers-color-scheme` media query in CSS variables.

## Key docs to read before writing code

- `node_modules/next/dist/docs/01-app/01-getting-started/` — getting started guides
- `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md` — instant navigation with `unstable_instant`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — server/client component boundaries
