# Divii Frontend Starter

The starting point for the **AI Frontend Training** homework. Clone it, run it, then build your own screen and
feature inside it with Claude Code, following the training page.

- Training page (steps, rules, prompts, pass criteria): https://app.notion.com/p/3e9326b2d5fb80c0872def7b6a848d3c
- Homework submission (your own page in the table): https://app.notion.com/p/3e9326b2d5fb81298fb5e4afc8157861
- Homework details and submission steps: [docs/HOMEWORK.md](docs/HOMEWORK.md)

What is inside: Next.js 15 + React 19 + TypeScript + PrimeReact 10 + SCSS, laid out the Divii way, with one example
entity (**Product**) built end to end: list with search / filter / paging, create, details, edit, delete, loading /
empty / error states, dark mode, Playwright tests, and a dependency-free example API. `CLAUDE.md` tells Claude Code how
the project works, and `.claude/skills/` contains the frontend skills (type `/` in Claude Code to see them).

## 1. Prerequisites

- Node.js 20 or newer, Git, VS Code
- Claude Code (VS Code extension or terminal), logged in with your company account
- Chrome + the Claude in Chrome extension (for screenshots and console reading)

## 2. Set up (5 minutes)

```bash
git clone https://github.com/Vaishalinarukahanriver/frontendrepo.git
cd frontendrepo
npm install
copy .env.example .env.local        # Windows   (macOS/Linux: cp .env.example .env.local)
npx playwright install chromium
npm run dev
```

Open http://localhost:3000. You should see the Products list with mock data.

Then open the folder in Claude Code and paste the first prompt from the training page:

> Read CLAUDE.md and look around the repo. Explain to me in simple words: what this app does, how the folders are
> organised, how a page gets its data from the API, and which commands I should run to check my work. Don't change any code.

## 3. Mock data vs. real API

`.env.local` has one switch:

| `NEXT_PUBLIC_USE_MOCK` | What happens                                                                 | Used for |
|------------------------|------------------------------------------------------------------------------|----------|
| `true` (default)       | Screens use the in-browser mock in `src/mock/`. No backend needed.           | HW1      |
| `false`                | Screens call `NEXT_PUBLIC_API_BASE_URL` through axios.                       | HW2      |

To see the real-API path working before you write your own backend, run the bundled example API in a second terminal:

```bash
npm run mock-api            # http://localhost:4000/api/v1/products
```

set `NEXT_PUBLIC_USE_MOCK=false`, restart `npm run dev`. Stop the mock API and reload the page to see the error state.

For HW2 you write **your own** backend (NestJS, Spring Boot, Express, anything you know) with the same endpoints and
the same response envelope as `mock-api/server.mjs`, and point `NEXT_PUBLIC_API_BASE_URL` at it.

## 4. Check your work (run these after every change)

```bash
npx tsc --noEmit        # type-check
npm run lint
npm run build
npm run test:e2e        # Playwright, read-only specs; starts the dev server if needed
npm run test:e2e:ui     # visual runner
```

`npm run check` runs type-check + lint + build together. `npm run test:e2e:mutations` also runs the create / edit /
delete spec.

The responsive sweep (`e2e/responsive.spec.ts`) screenshots the list page at every WM width into `e2e/screenshots/`
and fails if the page scrolls sideways.

## 5. Where things are

See `CLAUDE.md` -> Layout. Short version:

- `src/app/(main)/products/` - the four pages (list, create, details, edit)
- `src/hooks/API/products/` - the hooks the pages call
- `src/api-services/` - the axios layer (and the mock switch)
- `src/utils/api-integration.ts` - endpoint paths and query keys
- `src/styles/` - tokens, light/dark colours, one partial per area
- `e2e/` - Playwright specs

## 6. Your homework in this repo

Keep Product as a reference, and add your own entity next to it following `CLAUDE.md` -> "Adding a new entity".
Design your own screen (Figma or Claude Design), build it with mock data first (HW1), then on your own API (HW2).
The full list of what you must do and the pass criteria are in section 13 of the training page.

## 7. Skills

Claude Code loads the skills in `.claude/skills/` automatically when you open this folder. Type `/` in Claude Code
to see them, for example `/fe-responsive-qa`, `/fe-build-handoff`, `/fe-pr-writer`, `/smoke-test`. They read the WM
pages from Notion at run time through `.claude/wm/wm-contract.md`, so the Notion connector must be on.
