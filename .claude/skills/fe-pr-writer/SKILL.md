---
name: fe-pr-writer
description: Write a pull request title and description from the actual diff — what changed, why, how it was tested, WM rules applied, TL task linked. Use when the user says "write the PR", "PR description", "raise a PR", or has finished a branch and needs it described for review.
---

# PR description writer

Writes the PR from the diff, not from the branch name. A reviewer should know
what to look at and what was already verified before opening a file.

## Step 0 — load the rules (mandatory)

1. Read `.claude/wm/wm-contract.md (relative to the repo root)`.
2. Fetch **WM | Task (TL) Management**
   (https://app.notion.com/p/2863fce2ebeb4bb5a766ae067c6175b4) — every change needs
   a TL task, and discussion links belong in that task's comments.
3. Fetch **WM | HTML development guideline**
   (https://app.notion.com/p/9695262a68b7463db0d750634029da96) when the diff
   touches markup or SCSS, so the "WM rules applied" section is accurate.

## Step 1 — read the actual change

```
git fetch origin
git log --oneline origin/<base>..HEAD
git diff origin/<base>...HEAD --stat
git diff origin/<base>...HEAD
```

Read the diff. Group the changes by intent, not by file. Note anything that
looks unintentional — a stray `console.log`, a committed `.env` value, a
formatting-only churn file, a lockfile change nobody asked for — and raise it
before writing the description.

## Step 2 — get the missing context

Ask for the TL task URL if it isn't in the branch name or commits. Ask what was
tested manually if the diff has no test coverage. Do not invent a rationale — if
you can't tell *why* from the diff and the task, ask.

## Step 3 — write it

**Title:** `<type>: <imperative summary>` — under ~72 chars, no ticket-number
noise if the body links the task. Types: `feat`, `fix`, `refactor`, `style`,
`chore`, `docs`, `test`.

**Body:**

```markdown
## What
One paragraph a reviewer can read in ten seconds.

## Why
The problem or requirement. Link the TL task.

## Changes
- Grouped by intent, with the key file(s) per group
- Behaviour changes called out explicitly

## Screenshots / recordings
Before → after for anything visual. Include the breakpoints touched.

## How to test
1. Numbered steps a reviewer can actually follow
2. Env, role and data preconditions

## Verified
- [ ] npm run lint
- [ ] npx tsc --noEmit
- [ ] npm run test:e2e (or the specific spec)
- [ ] Responsive checked at <widths>
- [ ] Light and dark mode

## WM rules applied
- <rule> — <WM page link>

## Risks / follow-ups
Anything deliberately left out, and why.

## Links
TL task · Figma · Staging URL
```

Only tick a checkbox for something you actually ran and saw pass. Report failures
with their output rather than dropping the line.

## Step 4 — raise it, if asked

`gh pr create --base <base> --title "…" --body-file <file>`. Push and open the PR
only when the user asks for it. End the PR body with:

```
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Output

**Other** — PR title + description markdown, and the opened PR when requested.

## Reference

WM | Work Manual — https://app.notion.com/p/e72e1c92a33b457e99b776f0df57cd91
