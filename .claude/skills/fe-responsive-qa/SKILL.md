---
name: fe-responsive-qa
description: Run a responsive QA pass on a page or component across the WM breakpoint ladder (1920 down to 375), capture screenshots, and produce a WM-format Report of layout defects. Use when the user says "responsive QA", "check this page on mobile", "test breakpoints", or before sharing a build.
---

# Responsive QA pass

Checks a screen at every breakpoint the WM mandates and writes up what breaks,
in the Report structure WM defines.

## Step 0 — load the rules (mandatory)

1. Read `.claude/wm/wm-contract.md (relative to the repo root)`.
2. Fetch **WM | HTML development guideline**
   (https://app.notion.com/p/9695262a68b7463db0d750634029da96) for the
   authoritative breakpoint ladder and layout rules.
3. Fetch **WM | Report** (https://app.notion.com/p/09990cac269f41ccabd31deb069512bf)
   — the output must follow that structure, read fresh, not from memory.

## Step 1 — establish the target

Ask for whatever is missing: the route to test, the environment
(local `npm run dev`, or staging `<staging URL from CLAUDE.md, if the project has one>`),
login role if the route is behind auth, and the TL task this belongs to.

## Step 2 — sweep the breakpoints

WM breakpoint ladder: `1920 → 1600 → 1366 → 1280 → 1024 → 991 → 768 → 640 → 480 → 375`.

Two ways to drive it — pick based on what's available:

- **Playwright** (repo already has it, `e2e/`, `npm run test:e2e`): write a
  throwaway spec that loops the widths, calls
  `page.setViewportSize({ width, height: 900 })` and screenshots each. Put
  scratch specs in the scratchpad, not in `e2e/`, unless the user wants it kept.
- **Claude in Chrome**: `mcp__claude-in-chrome__resize_window` per width, then
  `mcp__claude-in-chrome__computer` screenshot. Better for a quick eyeball pass.

At each width record: horizontal overflow, overlapping or clipped elements,
text line-break behaviour, images not fitting their box, buttons with a fixed
px width instead of padding, inconsistent spacing versus other pages, tables
that don't scroll inside their own container, and any tap target too small on
the ≤768 range.

## Step 3 — check against WM, not taste

A finding is only a defect if it violates a WM rule, the design, or plain
usability. Say which. Flag "design does not specify this breakpoint" as a
question for the designer rather than inventing behaviour.

## Step 4 — write the Report

Use the structure you fetched from WM | Report. As published today that is:
Title, Introduction, Summary, Content, References link, Findings, Conclusions.
If WM has changed, follow WM.

Fill Content with a per-breakpoint table:

| Width | Screenshot | Result | Defect | Severity | WM rule |
|---|---|---|---|---|---|

References must link the TL task, the WM pages applied, and the build/branch
tested.

## Step 5 — file it

If the user wants the findings tracked, add them as a comment on the TL task
(`mcp__claude_ai_Notion__notion-create-comment`). Per WM | Task (TL) Management,
comment before touching any status — and never set a status only QA or PM may
set.

## Output

**Report** — WM-format responsive QA report with per-breakpoint findings and
screenshots.

## Reference

WM | Work Manual — https://app.notion.com/p/e72e1c92a33b457e99b776f0df57cd91
