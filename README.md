# Prism

Prism is an interactive values audit that guides users through instinct and tradeoff questions, then presents a wrapped-style results experience.

## Stack

- SvelteKit (Svelte 5)
- Tailwind CSS v4
- Vercel adapter

## Getting Started

```sh
pnpm install
pnpm dev
```

## Scripts

```sh
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm check
pnpm test
```

## Project Structure

- `src/routes`: Pages and route-level layouts.
- `src/lib`: Shared components, data, and stores.
- `static`: Static assets served as-is.

## Deploy

This project is configured for Vercel via `@sveltejs/adapter-vercel`.
Deploy by connecting the repo in Vercel or running the Vercel CLI.
