# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using React 19, TypeScript, and Tailwind CSS v4. It follows the App Router pattern with the `app/` directory structure.

## Development Commands

- `npm run dev` - Start the development server (defaults to http://localhost:3000)
- `npm run build` - Create a production build
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## Tech Stack & Configuration

- **Next.js 16.2.1** - Note: This version has breaking changes from older Next.js. APIs, conventions, and file structure may differ from training data. Read guides in `node_modules/next/dist/docs/` before writing code.
- **React 19.2.4** - Latest React with new features and potential API changes
- **Tailwind CSS v4** - Uses `@tailwindcss/postcss` plugin and `@import "tailwindcss"` syntax (no `tailwind.config.js`)
- **TypeScript** with `strict: true` enabled
- **ESLint v9** with flat config format (`eslint.config.mjs`)

## Path Aliases

The `@/*` alias maps to the project root (`./`), so `@/components/Button` resolves to `./components/Button`.

## Tailwind CSS v4 Notes

- Tailwind v4 uses a new `@theme inline` syntax in CSS files rather than a separate config file
- CSS variables are used for theme colors (`--background`, `--foreground`)
- Dark mode is handled via `@media (prefers-color-scheme: dark)` in `globals.css`
- Import Tailwind with `@import "tailwindcss";` instead of the old `@tailwind` directives

## Architecture

- Uses Next.js App Router (not Pages Router)
- Root layout is in `app/layout.tsx` with Geist font family setup
- Pages are server components by default
- Global styles in `app/globals.css` with Tailwind imports and CSS custom properties
