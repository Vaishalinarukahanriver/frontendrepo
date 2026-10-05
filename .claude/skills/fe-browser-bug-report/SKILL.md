---
name: fe-browser-bug-report
description: Reproduce a frontend defect across browsers and write it up as a WM-format bug Report using the WM QA-process status vocabulary, ready to post on the TL task. Use when the user says "file a bug", "this breaks in Safari", "cross-browser issue", "write this up for QA", or reports something not working on one browser only.
---

# Cross-browser bug report

Turns "it's broken on Safari" into a reproducible, WM-compliant bug entry that
QA can act on without a follow-up question.

## Step 0 — load the rules (mandatory)

1. Read `.claude/wm/wm-contract.md (relative to the repo root)`.
2. Fetch **WM | Work Manual for QA Process**
   (https://app.notion.com/p/bab0d0977e6c4c48943c1c6476dd6e95) — it owns the issue
   status vocabulary and who may set which status. Use the statuses it lists,
   read fresh.
3. Fetch **WM | Report** (https://app.notion.com/p/09990cac269f41ccabd31deb069512bf)
   for the write-up structure.
4. Fetch **WM | QA Template** (https://app.notion.com/p/89e8efe5cbf746a29882ae011be5446e)
   when the defect is in a covered area (login, signup, phone verification, SNS
   login, push, image/video upload, chat) — reuse those cases instead of writing new ones.

## Step 1 — reproduce before reporting

Do not file a bug you have not reproduced. Establish:

- Exact URL / route and the environment (local, `<staging URL>`, prod)
- User role and any data preconditions
- Minimal, numbered steps to reproduce
- Expected vs actual result
- Whether it reproduces on a clean session (incognito, cleared cache)

Use Claude in Chrome to walk the steps and capture evidence:
`mcp__claude-in-chrome__navigate`, `computer` for screenshots,
`read_console_messages` for JS errors, `read_network_requests` for failing
calls. A `gif_creator` recording is worth more than three paragraphs for a
timing or animation bug.

## Step 2 — isolate the browser dimension

State clearly which browsers/versions/OS it does and does not occur on. If only
one browser is available, say so — write "not verified on X", never guess.

Then name the likely cause: a CSS feature with partial support, a
`Date`/`Intl` difference, an input-type quirk, a scroll or `100vh` behaviour, a
polyfill gap. If it's a genuine engine difference, note the supported
alternative.

## Step 3 — assess severity

- **Blocker** — core flow unusable
- **Major** — feature broken, workaround exists
- **Minor** — cosmetic / edge case

Add the WM rule violated where one applies (date format, three-digit comma,
error wording, breakpoint behaviour).

## Step 4 — write it up

Use the structure fetched from WM | Report. The Content section carries:

```
Environment      browser + version, OS, viewport, build/branch, URL
Preconditions    role, data state
Steps            1. … 2. … 3. …
Expected
Actual
Evidence         screenshots, console errors, failing request, recording
Browsers         reproduces / does not reproduce / not verified
Severity
Suspected cause
Proposed fix
```

Set the status to whatever WM's QA-process page defines for a newly reported
issue — do not pick a status from memory.

## Step 5 — file it

Post as a comment on the TL task via `mcp__claude_ai_Notion__notion-create-comment`.
Per WM: comment first, then change status; a developer may move an issue to
*Ready for QA* only, and only QA or PM may mark it *Fixed* or *Not an issue*.

## Output

**Report** — WM-format cross-browser bug report, posted as a TL task comment on request.

## Reference

WM | Work Manual — https://app.notion.com/p/e72e1c92a33b457e99b776f0df57cd91
