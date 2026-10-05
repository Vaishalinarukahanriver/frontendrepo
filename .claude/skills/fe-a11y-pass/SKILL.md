---
name: fe-a11y-pass
description: Audit a route or component for accessibility (WCAG 2.2 AA) — semantics, labels, keyboard path, focus, contrast, ARIA — and produce a WM-format Report with prioritised fixes. Use when the user says "accessibility pass", "a11y check", "is this keyboard accessible", "screen reader", or before a client-facing release.
---

# Accessibility pass

Finds the accessibility defects that block real users, and writes them up so
they can be fixed and tracked — not a raw axe dump.

## Step 0 — load the rules (mandatory)

1. Read `.claude/wm/wm-contract.md (relative to the repo root)`.
2. Fetch **WM | Report** (https://app.notion.com/p/09990cac269f41ccabd31deb069512bf)
   for the output structure.
3. Fetch **WM I Light/Dark Mode Color System**
   (https://app.notion.com/p/75711652f115489c9d0800aa76c44da4) — contrast must be
   judged in both modes, and against the project's registered `[day]`/`[night]`
   colours, not against arbitrary hex values.
4. Fetch **WM | Error Message List**
   (https://app.notion.com/p/f0a07346bd2349e28bc76abe2fe135ac) when auditing form
   validation — announced error text must match the approved wording.

## Step 1 — audit

Read the component source first; then, where a live page is available, verify in
the browser. Cover:

**Structure & semantics**
- One `h1` per page, heading levels not skipped
- Landmarks present (`header`, `nav`, `main`, `footer`); `main` is unique
- Lists, tables and forms use real elements — a `div` with an `onClick` is a defect
- Tables have `th` with `scope`, and a caption or accessible name

**Keyboard**
- Every interactive element reachable by Tab, in visual order
- Visible focus indicator (this repo has `_no-outline.scss` — check nothing has
  removed focus outlines without replacing them)
- No keyboard trap; modals trap focus deliberately and restore it on close
- Esc closes overlays; Enter/Space activate custom controls

**Forms** (repo uses react-hook-form + PrimeReact)
- Every input has a programmatic label — `<label htmlFor>`, not just a placeholder
- Required state conveyed non-visually
- Errors linked with `aria-describedby` and announced via a live region
- Error text matches WM error wording

**Media & imagery**
- Meaningful images have alt text; decorative ones have `alt=""`
- Icon-only buttons have an accessible name
- No information conveyed by colour alone

**Contrast** — 4.5:1 body text, 3:1 large text and UI boundaries. Check light
*and* dark mode.

**Dynamic content** — loading, toasts and async results announced
(`aria-live`); route changes move focus sensibly.

**PrimeReact specifics** — verify the accessible name actually renders on
`Dialog`, `Dropdown`, `DataTable` pagination and `TabMenu`; the defaults are
often generic.

## Step 2 — prioritise

Rank each finding:
- **Blocker** — feature unusable by keyboard or screen reader
- **Major** — WCAG AA failure with a workaround
- **Minor** — best practice / AAA

Give the concrete fix (file, line, replacement) for each — not just the rule ID.

## Step 3 — write the Report

Follow the structure fetched from WM | Report. Findings table:

| # | Severity | Location | WCAG ref | Issue | Fix |
|---|---|---|---|---|---|

References link the TL task, WM pages applied, and the route/build audited.

## Step 4 — track

On request, post the findings as a TL task comment. Comment before any status
change; a developer's terminal status is *Ready for QA* — only QA or PM may mark
anything *Fixed* or *Not an issue*.

## Output

**Report** — WM-format accessibility report with prioritised, actionable fixes.

## Reference

WM | Work Manual — https://app.notion.com/p/e72e1c92a33b457e99b776f0df57cd91
