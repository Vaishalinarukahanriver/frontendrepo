---
name: smoke-test
description: Run a scoped smoke test after a fix on the app in this repo — type-check, build, boot the frontend and/or NestJS backend, exercise the touched route and its neighbours with Playwright plus the API with curl, and report pass/fail with screenshots. Use when the user says "smoke test", "verify the fix", "did I break anything", after a QA ticket fix, or before handing a build to QA.
---

# Smoke test

A smoke test answers two questions: **does the fixed thing work**, and **is anything that used to
work now broken**. It is not a full regression suite — scope it to the change plus its blast radius.

| | path | run |
|---|---|---|
| frontend | `the frontend repo root (this repo)` | `npm run dev` → :3000 |
| backend | `your backend repo (see CLAUDE.md -> Backend)` | `npm run start:dev` → :4000, Swagger `/docs`, prefix `/api/v1` |

Staging (deployed build, not local code): `<staging URL from CLAUDE.md, if the project has one>`.

## Step 0 — scope it

State up front, in one block: the ticket id, the files changed, the route(s) and/or endpoint(s)
under test, the neighbours at risk (anything importing a changed component, any other caller of a
changed service method — check with a grep, do not assume), and the login role required. Grep for
importers before deciding the blast radius is "just this page".

## Step 1 — static gates

Cheapest first; stop and fix before going further.

```powershell
npx tsc --noEmit                      # both repos, whichever was touched
npm run lint                          # backend (eslint --fix)
npm run build                         # only if the change touches config, routing, or SSR
```

Backend `npm test` runs zero specs (stale `rootDir` in package.json) — do not report it as a pass.

## Step 2 — boot

Frontend, and this matters: **exactly one `next dev` at a time**. Two servers write the same
`.next` and the page chunks 404, which renders as a blank page with only the hamburger and *no
console error* — easy to misread as an auth failure. Kill strays, `rm -rf .next`, start one.

```powershell
Get-Process node -ErrorAction SilentlyContinue | Select-Object Id,StartTime   # spot strays
npm run dev
```

Backend: `npm run start:dev`, then confirm it is actually up before testing anything:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4000/docs
```

## Step 3 — the API pass (only if the backend changed)

For each touched endpoint: happy path, one validation failure, and one authorization case (a role
that must be refused). Get a token from `POST /api/v1/auth/login`, then:

```bash
curl -s -X GET "http://localhost:4000/api/v1/<path>" -H "Authorization: Bearer $TOKEN" | head -c 600
```

Assert the envelope shape the interceptor guarantees — `{ success, message, data, ... }` — and that
a 403 is a 403, not a 200 with empty data. Record status code and the first lines of the body.

## Step 4 — the UI pass

Point Playwright at **local** code, because staging serves the deployed build:

```powershell
$env:PLAYWRIGHT_BASE_URL="http://localhost:3000"; npx playwright test <spec>
```

Two known traps in this repo:

- First compile of a route exceeds the 15 s `beforeEach` wait. Warm it first with the saved token:
  ```powershell
  curl -H "Cookie: token=$(node -e "console.log(require('./e2e/.auth/principal.json').cookies.find(c=>c.name==='token').value)")" http://localhost:3000/dashboard
  ```
- A `page.route` regex whose API path equals the page's own route intercepts the HTML document too
  and serves JSON → blank page. Guard every handler:
  `if (req.resourceType() === 'document' || req.method() !== 'GET') return route.continue();`

Prefer running the existing `e2e/*.spec.ts` that covers the touched screen (one file per feature,
`admin` / `regional` variants for role behaviour, auth via `e2e/.auth/*.json`). If no spec covers
it, write a throwaway one in the scratchpad — do not add to `e2e/` unless the developer asks to keep it.
`*.mutation.spec.ts` stay skipped unless `E2E_ALLOW_MUTATIONS=1`, and never run those against
staging without saying so first.

Checklist per screen: page renders (assert the `<h1 class="top-heading-title">` heading, not just
the URL); the fixed behaviour now behaves; list loads with rows; filter / search / pagination still
work; a row action opens its detail or modal; no error toast (`.p-toast-message-error`); browser
console clean of new errors. Screenshot the fixed state.

Then the blast radius from Step 0 — one quick pass over each neighbouring screen. And if the change
touched layout or SCSS, check 1920 / 1366 / 768 / 375 before calling it done.

## Step 5 — report

```markdown
## Smoke test — <ticket id> — PASS | FAIL | PASS WITH NOTES

Scope: <routes / endpoints> · role: <role> · env: local (fe :3000 / be :4000)

| Check | Result | Evidence |
|---|---|---|
| tsc --noEmit | pass | 0 errors |
| <route> renders | pass | screenshot path |
| <the fix itself> | pass | what you observed |
| <neighbour> | pass | ... |
| <endpoint> 200 / 403 | pass | status + body head |

Fixed behaviour confirmed: <one sentence>
Not covered: <what you could not test, and why>
New issues found: <or "none">
```

Report honestly. A skipped check is listed as skipped, never as a pass, and a failure is quoted
with its actual output. If something outside the ticket broke, raise it immediately — that is a
regression, and it outranks finishing the queue.
