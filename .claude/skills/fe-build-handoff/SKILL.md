---
name: fe-build-handoff
description: Prepare a frontend build hand-off to QA — verify the build, list what changed and what to test, and write the detail report WM's QA process requires from the developer. Use when the user says "share the build", "hand off to QA", "ready for QA", "deploy to staging for testing".
---

# Build hand-off to QA

WM's QA process opens with *"Developer → share the build as per the QA plan
with the detail report."* This produces that detail report, and checks the build
is genuinely ready before it goes out.

## Step 0 — load the rules (mandatory)

1. Read `.claude/wm/wm-contract.md (relative to the repo root)`.
2. Fetch **WM | Work Manual for QA Process**
   (https://app.notion.com/p/bab0d0977e6c4c48943c1c6476dd6e95) — the flow and the
   status vocabulary. Read the statuses fresh; do not assume them.
3. Fetch **WM | Build sharing plan**
   (https://app.notion.com/p/cb95b97f449e417995c449e08aba4f1f) for what a shared
   build must include.
4. Fetch **WM | Report** (https://app.notion.com/p/09990cac269f41ccabd31deb069512bf)
   for the detail-report structure.
5. Fetch **WM | QA Template** (https://app.notion.com/p/89e8efe5cbf746a29882ae011be5446e)
   — where the build touches a covered area, point QA at the existing template
   cases rather than writing new ones.

## Step 1 — verify before handing off

Run these and report the real output. Do not hand off on a red build:

```
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e            # or the specific specs the change affects
```

If something fails, say so and stop. A hand-off with a failing build wastes a QA
cycle.

## Step 2 — establish the scope

- Branch / commit / build number and the deployed URL
  (staging is `<staging URL from CLAUDE.md, if the project has one>`)
- `git log --oneline <last-shared-tag-or-commit>..HEAD` for what's in this build
- The TL tasks covered — with links
- Reopened issues included in this build, and what changed for each

## Step 3 — write the detail report

Follow the structure fetched from WM | Report. Content carries:

```
Build            branch · commit · build no. · deployed URL · date
Scope            TL tasks included, with links
Changes          grouped by feature, in QA-testable language, not commit messages
Fixed issues     issue → what was changed → now Ready for QA
Test accounts    roles and credentials needed (never paste real production secrets)
Preconditions    data setup QA needs before starting
What to test     numbered, per feature; link WM QA Template cases where they exist
Known issues     what is deliberately NOT fixed in this build, and why
Not covered      areas untouched, so QA can prioritise
Verification     lint / typecheck / build / e2e results as actually run
Responsive       breakpoints already checked by the developer
Browsers         browsers already checked
```

## Step 4 — hand off correctly

Per WM's QA process:

- Move the fixed issues to **Ready for QA** and **assign them to the QA team** —
  QA does not test "Ready for QA" issues until they are assigned to them.
- **Comment before changing any status** (WM | Task (TL) Management).
- A developer must **never** set *Fixed* or *Not an issue* — only QA or PM may.
- Post the detail report as a comment on the TL task
  (`mcp__claude_ai_Notion__notion-create-comment`), then notify the QA channel.

Show the user the report and the intended status changes before making them.
Status changes and notifications are outward-facing — get the go-ahead first.

## Output

**Report** — build hand-off detail report, posted as a TL task comment, with the
QA assignment steps carried out on the user's confirmation.

## Reference

WM | Work Manual — https://app.notion.com/p/e72e1c92a33b457e99b776f0df57cd91
