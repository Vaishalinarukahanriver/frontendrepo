# AI Frontend Training - Homework

The authoritative text is section 13 of the training page. This file is the short version so it is next to the code.

- Training page: https://app.notion.com/p/3e9326b2d5fb80c0872def7b6a848d3c
- Main task + submissions table: https://app.notion.com/p/3e9326b2d5fb81298fb5e4afc8157861

The topic is your choice. There is no fixed Figma screen and no fixed API. Build any screen you like, design it
yourself (Figma or Claude Design) and, for HW2, create your own API in any stack you know.

## Homework 1 - a screen from a design (Steps 1, 2, 5) - due Tue 6 Oct 2026, end of day

In this repo, with `NEXT_PUBLIC_USE_MOCK=true`:

1. Set up the project (README section 2) and let Claude read `CLAUDE.md`.
2. Design one list screen for your own entity. Run the design check from Step 2 Part A on your own design and write
   down the questions.
3. Add the entity following `CLAUDE.md` -> "Adding a new entity", steps 1 to 3 and the mock in `src/mock/`.
4. Build the list page with mock data: `TopHeading`, filters, `LoadingState` / `EmptyState` / data, WM naming, tokens only.
5. Run `npx tsc --noEmit`, `npm run lint`, and the responsive sweep (`npx playwright test e2e/responsive.spec.ts`
   after pointing `ROUTE` and `HEADING` at your page).

## Homework 2 - a full feature with a real API (Steps 3 to 8) - due Thu 9 Oct 2026, end of day

Start only after HW1 is **Pass**.

1. Write your own backend with list (search, filter, paging), get one, create, update, delete. Keep the response
   envelope from `mock-api/server.mjs`.
2. Set `NEXT_PUBLIC_USE_MOCK=false` and `NEXT_PUBLIC_API_BASE_URL`. Add the service and the three hooks.
3. Create and edit forms with react-hook-form; validation rules must match your backend; submit disabled while saving;
   API errors shown on the fields and in a banner.
4. Details page and delete with confirmation. List refreshes by itself after every change.
5. Test cases in the WM QA Template format. Playwright: `<entity>.spec.ts` (read-only) and
   `<entity>.mutation.spec.ts` (create / edit / delete). All four checks green: lint, type-check, build, e2e.
6. The QA build report with the 10 parts from Step 8 (the `/fe-build-handoff` skill writes it).

## How to submit (both)

1. Open **your own page** in the Submissions & Feedback table on the main task page and fill in every section
   (what you built, demo link, repo / branch, how to run it, exact prompts and skills, one problem you solved, check output).
2. At the top of your page set **HW status -> Submitted** and **submitted on**.
3. Post one line in the comments of the main task page: "HW1 submitted, please review" + link to your page, tagging Vaishali.

Not on Slack, not by DM. Feedback and the result (Excellent / Pass / Resubmit) come back in the Feedback section of
your page within one working day.
