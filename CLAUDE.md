# Divii Frontend Starter

Starter project for the AI Frontend Training homework. One example entity (Product) is built
end to end the way Divii frontends are built, so you copy the pattern for your own entity.
Trainees: replace the product name and this paragraph with YOUR project (what it is, who uses it).

Stack: Next.js 15 (App Router) · React 19 · TypeScript (strict) · PrimeReact 10 · SCSS · TanStack Query · react-hook-form · Playwright

Backend: `NEXT_PUBLIC_API_BASE_URL` in `.env.local`. With `NEXT_PUBLIC_USE_MOCK=true` (default, HW1) the app uses
in-browser mock data and no backend is needed. With `false` (HW2) it calls the real API. A dependency-free example API
is in `mock-api/server.mjs` (`npm run mock-api`, port 4000). For HW2 trainees replace it with their OWN backend.

## Commands

```
npm run dev                 # http://localhost:3000
npx tsc --noEmit            # type-check - run after EVERY change
npm run lint
npm run build               # catches errors dev mode does not
npm run check               # type-check + lint + build in one go
npm run mock-api            # example backend on :4000 (HW2 practice)
npm run test:e2e            # Playwright, read-only specs, against localhost:3000 (starts dev server itself)
npm run test:e2e:ui         # same, in the visual runner (best for beginners)
npm run test:e2e:mutations  # ALSO runs *.mutation.spec.ts (create/edit/delete)
```

## Layout

```
src/
  app/
    layout.tsx               providers + the ONE global stylesheet import
    page.tsx                 redirects to /products/list
    (main)/                  route group: top bar + page container, no URL segment
      layout.tsx
      products/              list / create / details/[id] / edit/[id]   <- the route convention
  api-services/              one class per domain (axios); CoreAPIService = the shared axios instance
  hooks/API/<domain>/        TanStack Query hooks - the ONLY thing a screen calls for data
  components/
    common/                  TopHeading, StateBlocks (Loading / Empty / Error)
    layout/                  AppTopbar (nav + dark-mode toggle)
    products/                ProductsTable, ProductForm
  providers/                 QueryProvider, ToastProvider (useToast)
  mock/                      seed JSON + in-browser mock API (HW1)
  types/                     Product types + API envelope types
  utils/                     api-integration (endpoints + query keys), api-error, formatters, validation/
  styles/
    _variables.scss          tokens: colours ($gray-b1 ...), spacing, fonts, breakpoint mixin
    global.scss              light/dark colour values + base styles; @use's every partial
    layout/ components/ pages/   one partial per area
e2e/                         Playwright: <feature>.spec.ts (read-only), <feature>.mutation.spec.ts, responsive.spec.ts
mock-api/                    example backend (plain Node, no deps)
.claude/skills/              project skills (/fe-responsive-qa, /fe-build-handoff, ...), auto-loaded by Claude Code
.claude/wm/wm-contract.md    index of the WM pages the skills read at run time
```

## Data fetching - three layers, always

1. **Endpoint + query key** -> `src/utils/api-integration.ts` (`API_ENDPOINTS`, `QUERIES`)
2. **API call** -> `src/api-services/<Domain>Service.ts` (uses `CoreAPIService`; switches to the mock when `USE_MOCK`)
3. **Hook** -> `src/hooks/API/<domain>/use<Thing>.ts` (TanStack Query). Screens call hooks, never services.

Every list hook returns `isXLoading` (first load), `isXFetching` (background refresh), `isXError`, `xError`, and the
data. Every screen renders in this order: loading -> error -> empty -> data. Use `LoadingState`, `ErrorState`,
`EmptyState` from `components/common/StateBlocks`.

Mutations (`useProductMutations`) invalidate the list and detail keys on success, so lists refresh by themselves.

All errors are `ApiRequestError` (`utils/api-error.ts`): `message` for banners/toasts, `errors` (field -> message) for
forms via `setError`. The API envelope is `{ success, message, data }` and errors are
`{ success:false, message, statusCode, errors? }` - keep your own backend on this shape.

## Rules (from WM - fetch the page, do not guess)

- Company rules live in WM on Notion: https://app.notion.com/p/e72e1c92a33b457e99b776f0df57cd91. WM wins over this file.
- Class names: `lowercase-with-hyphens`, BEM-style blocks (`products-table__name`). Never camelCase or snake_case.
- Colours: never a hex value in a component or partial. Use `$gray-b1`-style tokens from `_variables.scss`; every light
  colour has exactly one dark value with the same name in `global.scss`.
- No hardcoded spacing/font sizes: use `$spacing-*`, `$font-size-*`.
- Responsive: `@include respond-below("sm") { ... }`. Check 1920 / 1600 / 1366 / 1280 / 1024 / 991 / 768 / 640 / 480 / 375.
  The page never scrolls sideways; wide tables scroll inside their own box.
- Dates `YYYY.MM.DD`, numbers with three-digit commas: use `utils/formatters.ts`, check the WM Date format and
  Three digit comma rule pages before changing.
- Frontend validation must match the backend rules exactly (`utils/validation/*.rules.ts` <-> backend DTO).
- Submit buttons are disabled while saving. API errors are shown, never swallowed.
- No `any` (ESLint errors on it). Type the API response in `src/types`.
- Reuse before you create: `TopHeading`, `StateBlocks`, `useToast`, `confirmDialog`, the hooks pattern.
- Every SCSS file starts with `@use "variables" as *;`. New partials are added to `global.scss`.

## Adding a new entity (what the homework actually is)

1. `src/types/<entity>.ts` - record, payload, list params, option arrays.
2. `src/utils/api-integration.ts` - add endpoints and query keys.
3. `src/utils/validation/<entity>.rules.ts` - rules + messages, matching the backend.
4. `src/api-services/<Entity>Service.ts` (+ a mock in `src/mock/` for HW1).
5. `src/hooks/API/<entity>/useGet<Entity>List.ts`, `useGet<Entity>.ts`, `use<Entity>Mutations.ts`.
6. `src/components/<entity>/<Entity>Table.tsx`, `<Entity>Form.tsx`.
7. `src/app/(main)/<entity>/list`, `create`, `details/[id]`, `edit/[id]` pages.
8. `src/styles/pages/_<entity>.scss`, then `@use "pages/<entity>";` in `global.scss`.
9. `e2e/<entity>.spec.ts`, `e2e/<entity>.mutation.spec.ts`; point `e2e/responsive.spec.ts` at the new route.
10. Add the link to `NAV` in `components/layout/AppTopbar.tsx`.

## Known traps

- Two `npm run dev` at once -> blank page with no error. Kill all node processes, delete `.next`, start one.
- Changed `.env.local` -> restart the dev server. Browser-side variables must start with `NEXT_PUBLIC_`.
- "useState only works in Client Components" -> add `"use client"` at the top of that file.
- Playwright times out on first run -> the page compiles on first visit. Open it once in the browser, then run again.
- Playwright typed or clicked but nothing happened -> it acted before React hydrated. `AppTopbar` sets
  `data-hydrated="true"` on `<html>`; call `waitForHydration(page)` from `e2e/helpers.ts` before interacting.
- Mock data lives in memory. A full page reload resets it; that is expected in HW1.
- `@use "variables"` twice in the same file -> "module already loaded". One `@use` per file.

## Git

Branch from `development`. One feature per PR. Never commit `.env.local`.
