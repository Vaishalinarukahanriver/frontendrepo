---
name: fe-weekly-report
description: Assemble the weekly work report (주간업무보고) from Notion TL tasks and git history, following the WM weekly-report guide including the per-person value check, ready for review and intranet upload. Use when the user says "weekly report", "주간보고", "what did I do this week", or on the weekly reporting day.
---

# Weekly work report

Builds the week's report from what actually happened, in the format WM
publishes — so it needs review, not rewriting.

## Step 0 — load the format from WM (mandatory, every run)

1. Read `.claude/wm/wm-contract.md (relative to the repo root)`.
2. Fetch **WM | 주간업무보고 작성 및 제출 가이드**
   (https://app.notion.com/p/2d8326b2d5fb808d95fad91edc7c4d43) — this is the live
   guide for the internal weekly work log, including sheet naming, the daily
   entry review, the per-person value check and the intranet upload path.
3. Fetch **WM | 주간 보고서 작성**
   (https://app.notion.com/p/223326b2d5fb8048aac4c4390223fdaf). This page is
   currently empty — if it is still empty, say so and fall back to the guide
   above; if it now has content, follow it.
4. Fetch **WM | Report** (https://app.notion.com/p/09990cac269f41ccabd31deb069512bf)
   when the output is a client-facing weekly report rather than the internal log.

Two different artifacts — confirm which one is wanted before writing:
- **Internal weekly work log (주간업무보고)** → Google Sheet, per-person value 1, intranet upload
- **Client weekly report (주간보고서)** → schedule vs plan, this week / next week / questions

## Step 1 — determine the week

Default to the current Mon–Fri unless told otherwise. Sheet naming follows the
WM example pattern, e.g. `개발컨설팅팀_주간 업무일지_<월> <n>주차(<MM_DD-MM_DD>)`.
Confirm the exact week label rather than guessing the week number.

## Step 2 — gather the evidence

- **Notion TL tasks** — query the task list for this assignee and week:
  ```
  mcp__claude_ai_Notion__notion-query-data-sources
    data_source_urls=["collection://291326b2-d5fb-817c-a07a-000b34a2418b"]
  ```
  Pull task name, project, phase, status and dates.
- **Git** — `git log --since=<Mon> --until=<Fri> --author=<me> --pretty="%ad %s" --date=short`
  across the repos worked on this week, plus merged PRs.
- **Slack / meetings** — only if the user points at them.

Map each day Mon–Fri to what was actually done. Where a day has no evidence, ask
rather than filling it in.

## Step 3 — apply the WM checks

The guide is explicit about these — do them and report the result:

- Daily entries present and accurate for Mon–Fri
- **Per-person value sums to 1** (인당 값 1) — if the allocations don't sum to 1,
  say so and show the arithmetic; do not quietly adjust numbers
- Final week sheet reflects the same content as the daily entries
- Nothing missing before submission

## Step 4 — produce the output

Deliver a table ready to paste into the sheet:

| Date | Project | Task | Detail | Allocation | Status |
|---|---|---|---|---|---|

Plus a short summary: completed / in progress / blocked / next week.

For the client-facing version, use the WM | Report structure instead, with
schedule against plan, this week's progress, next week's plan and open questions.

## Step 5 — submission checklist (the user does these)

Per the WM guide, remind them of the manual steps:
1. Download the sheet as `.xlsx`
2. Upload via `인트라넷 → 디비스쿨 → 업무보고 → 작성`
3. Match the format of the previously uploaded reports
4. Submit by Friday, or the designated reporting day

Do not claim any of these were done — they are outside this skill.

## Rules

- Report what happened. Never pad the week with plausible-sounding work.
- If a task slipped, it appears as slipped.
- Convert relative dates to absolute before writing.

## Output

**Report** — weekly work report table + summary, WM-format, ready for review and upload.

## Reference

WM | Work Manual — https://app.notion.com/p/e72e1c92a33b457e99b776f0df57cd91
