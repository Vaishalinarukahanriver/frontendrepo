---
name: fe-figma-scaffold
description: Turn a Figma frame or design spec into a Next.js + TypeScript + PrimeReact component scaffold with its SCSS partial, following WM naming, folder-structure and breakpoint rules. Use when starting a new screen or component from a design, when the user says "build this Figma", "scaffold this component", "code this screen", or pastes a Figma link.
---

# Figma → component scaffold

Produces a working component skeleton from a design, wired to the conventions
this repo and the WM already use — so review comments are about behaviour, not
about folder names and breakpoints.

## Step 0 — load the rules (mandatory)

1. Read `.claude/wm/wm-contract.md (relative to the repo root)`.
2. Fetch **WM | HTML development guideline**
   (https://app.notion.com/p/9695262a68b7463db0d750634029da96) — it owns naming,
   folder structure and the media-query breakpoints. Do not work from the
   summary below if WM says otherwise.
3. If the design uses light/dark, also fetch **WM I Light/Dark Mode Color System**
   (https://app.notion.com/p/75711652f115489c9d0800aa76c44da4).

## Step 1 — review the design before writing code

WM requires a design review *before* development. Walk the WM checklist and
report anything that fails, to the user, before scaffolding:

- Container size consistent across pages (fluid / small / medium)
- Spacing & margin consistent for the same element across pages
- Repeated components (accordion, card, modal) identical between screens
- One font family site-wide; ask the designer for the type/colour library
  (e.g. h1 = 28px 700, h2 = 22px 700, p = 16px 400, small = 12px 400)
- Text line-break behaviour in responsive
- Empty / no-data / no-image states provided
- Button width driven by padding, never a fixed px
- Images flexible and fit-to-box
- Any specific browser-support request

These are the "rabbit holes" WM tells you to raise with the designer *before*
implementation, not after. List them; do not silently work around them.

## Step 2 — locate, don't invent

Before creating anything, search the repo for an existing component that
already does this. `src/components/` has ~20 domain folders and a
`commonComponents/` folder. Reuse or extend beats a new file.

## Step 3 — scaffold

Place files where this repo already puts them:

- Component → `src/components/<domain>/<ComponentName>.tsx`
- Route → `src/app/(main)/<segment>/page.tsx` (or `(full-page)` for auth/blank shells)
- Styles → `src/styles/<ComponentName>.scss`, or a `_partial.scss` imported by
  the domain entry point; follow the existing `_config.scss` / `_responsive.scss` split
- Types → `src/types/`

Rules to apply while writing:

- `"use client"` only when the component actually needs state, effects or handlers
- Class and id names: lowercase with hyphens — `main-container`, never
  `mainContainer` or `main_container`
- SCSS variables named main-colour-then-code — `$red-b1: #B12028`, not
  `$red-dark` or `$red-1`
- Icons named `icon-<thing>-<colour>` — `icon-arrow-right-white`. Check the
  assets folder for an existing icon before adding one
- Global variables for colours and repeating dimensions — no magic values
- Keep components small; split rather than nesting deeply
- Comment each meaningful block in TSX, SCSS and handlers, as WM requires
- Media-query breakpoints, in WM's order:
  `1920 → 1600 → 1366 → 1280 → 1024 → 991 → 768 → 640 → 480 → 375`
- Prefer PrimeReact components already used in the repo over new dependencies

## Step 4 — wire the data

If the screen needs server data, don't inline `fetch`. Follow the repo pattern:
an axios method on the relevant `src/api-services/*Service.ts`, a hook in
`src/hooks/API/<domain>/use<Thing>.ts` using `useQuery`/`useMutation` with a
`QUERIES` key, re-exported from `src/hooks/API/index.ts`. Mirror the shape of
`src/hooks/API/books/useGetBooksList.ts`.

Apply WM formatting rules to anything rendered: date format, three-digit comma
rule for numbers, error-message wording. Fetch those WM pages rather than
guessing.

## Step 5 — verify

Run `npm run lint`, and `npx tsc --noEmit` for type errors. Report real output;
don't claim it passes without running it.

## Output

**Other** — component + SCSS + hook files, plus a short scaffold summary listing
files created, WM rules applied, and any design questions from Step 1 that the
designer still needs to answer.

## Reference

WM | Work Manual — https://app.notion.com/p/e72e1c92a33b457e99b776f0df57cd91
