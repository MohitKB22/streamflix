# Netflix Clone

A production-style streaming app: Netflix-level UX patterns (browse rails, hover previews,
continue watching, adaptive playback) built with original branding, placeholder assets, and
open-source/user-supplied media. No Netflix code, assets, or trademarks are used anywhere in
this repo.

**Status: Phase 2 of 17 (Folder Structure + Database Schema).** See [Roadmap](#roadmap) below.

## Tech stack & decisions

The original spec offered several either/or choices. Picks, and why:

| Layer | Chosen | Alternative offered | Why |
|---|---|---|---|
| Backend | Next.js Route Handlers | NestJS | One deployable app, one language boundary, no second server to run/deploy/version alongside Next.js. Revisit if the API needs to be consumed by non-web clients independently. |
| Auth | Auth.js (NextAuth v5) | Clerk | Free, open-source, full control over the `User`/`Session` tables in our own Postgres schema instead of a hosted user store. |
| Search | PostgreSQL full-text search | Meilisearch | No extra service to run for v1. `.env.example` already has Meilisearch vars stubbed for a later swap if relevance/latency demands it. |

Everything else follows the requested stack as-is: Next.js 15 (App Router), React 19,
TypeScript, Tailwind CSS, Framer Motion, Shadcn UI, TanStack Query, Zustand, React Hook Form,
Zod, Prisma + PostgreSQL, Cloudinary, Stripe, Resend.

## Folder structure

```
netflix-clone/
├── prisma/
│   └── schema.prisma        # 23 models — see "Database schema" below
├── src/
│   ├── app/                 # Next.js App Router: routes, layouts, API handlers
│   │   └── api/health/      # proof-of-life route, GET → { status: "ok" }
│   ├── components/
│   │   ├── ui/               # Shadcn primitives (button, dialog, skeleton, ...)
│   │   ├── layout/            # navbar, footer, sidebar shells
│   │   └── shared/            # cards, carousels, modals used across features
│   ├── features/             # one folder per product area, self-contained
│   │   ├── auth/  browse/  content/  player/  search/
│   │   └── my-list/  profile/  admin/  recommendations/
│   ├── hooks/                # cross-feature hooks (useDebounce, useInfiniteScroll, ...)
│   ├── services/              # API client functions, one file per domain
│   ├── store/                 # Zustand stores (auth, player, ui)
│   ├── lib/
│   │   ├── db/                # Prisma client singleton
│   │   ├── auth/               # Auth.js config, adapters, callbacks
│   │   └── api/                # shared response/error/pagination helpers
│   ├── utils/                 # pure helper functions (formatters, slugify, ...)
│   ├── types/                  # shared TS types/interfaces not owned by Prisma
│   ├── schemas/                # Zod schemas — one source of truth for validation
│   ├── middleware/             # RBAC + rate-limit helpers used by route handlers
│   ├── emails/                 # React Email templates (Resend)
│   └── config/                 # site config, plan/pricing tiers, feature flags
├── tests/
│   ├── unit/                   # Jest + React Testing Library
│   └── e2e/                    # Playwright / Cypress
└── .github/workflows/          # CI/CD (Phase 16)
```

Folders that are currently empty are intentional — they're the contract for where each later
phase's code will live, established now so nothing has to be restructured mid-build.

## Database schema

`prisma/schema.prisma` — 23 models, 10 enums, fully validated. Covers:

- **Identity & access**: `User`, `Profile` (multi-profile + Kids Mode via `ProfileType`),
  `Session`, `RefreshToken`
- **Catalog**: `Movie`, `Series`, `Season`, `Episode`, `Genre`, `Actor`, plus join tables
  (`MovieGenre`, `SeriesGenre`, `MovieCast`, `SeriesCast`)
- **Engagement**: `Review`, `Rating`, `Favorite`, `WatchlistItem`, `WatchHistory`,
  `ContinueWatching`
- **Billing**: `Subscription`, `Payment` (Stripe fields included)
- **Notifications**: `Notification`

Design notes worth knowing before you extend it:

- Movies and series are separate tables rather than one polymorphic "Content" table — a bit of
  duplicated columns (title, slug, description...) in exchange for simple, type-safe Prisma
  queries with no discriminator-column logic in application code.
- Models that can point at *either* a movie or a series (`Review`, `Rating`, `Favorite`,
  `WatchlistItem`) use two nullable foreign keys (`movieId` / `seriesId`) since Prisma has no
  native polymorphic relation. Postgres treats `NULL` as distinct for `UNIQUE` constraints, so
  the `@@unique` pairs on those models work correctly. A `CHECK (movieId IS NOT NULL) != (seriesId
  IS NOT NULL)` constraint should be added via a raw SQL migration for stricter integrity —
  Prisma doesn't support CHECK constraints declaratively yet.
- Full-text search (Phase 10) will add a generated `tsvector` column + GIN index on `Movie` and
  `Series` via raw SQL migration. The schema is laid out so that's additive, not a redesign.
- `ContinueWatching` is deliberately separate from `WatchHistory`: one row per
  `(profile, title)` holding the current resume point, so the home-page rail is a plain indexed
  lookup instead of a "group by, take latest" query over the full history table on every load.

**How this was validated**: this sandbox's network allowlist doesn't include
`binaries.prisma.sh`, so the normal `npx prisma validate` couldn't download its native engine
binary. Instead I validated it programmatically with `@prisma/internals` (`getDMMF` +
`getConfig` + `formatSchema`) — the same WASM-based parser Prisma's own tooling uses — which
parses every model, resolves every relation and back-relation, and checks the datasource/generator
blocks without needing that binary. It came back clean (23 models, 10 enums, zero errors), and
`schema.prisma` is already in the canonical `prisma format` layout. On your own machine, with
normal internet access, `npx prisma format` and `npx prisma validate` will also work directly.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# fill in DATABASE_URL at minimum to go further than `npm run dev`

# 3. Generate the Prisma client and apply the schema
npx prisma generate
npx prisma migrate dev --name init

# 4. Run it
npm run dev
# → http://localhost:3000        (placeholder home page)
# → http://localhost:3000/api/health   ({ status: "ok" })
```

## Roadmap

| # | Phase | Status |
|---|---|---|
| 1 | Folder structure | ✅ Done |
| 2 | Database schema | ✅ Done |
| 3 | Authentication | ⬜ Next |
| 4 | API development | ⬜ |
| 5 | UI components | ⬜ |
| 6 | Layout | ⬜ |
| 7 | Pages | ⬜ |
| 8 | State management | ⬜ |
| 9 | Video streaming | ⬜ |
| 10 | Search | ⬜ |
| 11 | Recommendation engine | ⬜ |
| 12 | Admin panel | ⬜ |
| 13 | Testing | ⬜ |
| 14 | Deployment | ⬜ |
| 15 | Docker setup | ⬜ |
| 16 | GitHub Actions | ⬜ |
| 17 | Documentation | ⬜ |

Each phase will build on this foundation without restructuring it.
