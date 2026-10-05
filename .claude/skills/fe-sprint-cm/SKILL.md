---
name: fe-sprint-cm
description: Draft a sprint / frontend progress CM (Communications) for the PM, Korea team or client — pulling the CM format live from WM and the actual progress from Notion tasks and git history. Use when the user says "write a CM", "sprint update", "progress communication", "update the PM/client on where we are".
---

# Sprint progress CM

Communicates where the frontend actually is — built from task and commit
evidence, in the CM format WM publishes.

## Step 0 — load the CM format from WM (mandatory, every run)

1. Read `.claude/wm/wm-contract.md (relative to the repo root)`.
2. Fetch **WM | CM 작성**
   (https://app.notion.com/p/223326b2d5fb8065be60f875d65af192).

   **This page is currently empty.** The Korea team is still publishing task
   standards into WM. So:
   - If it now has content → follow it exactly, ignore the fallback below.
   - If it is still empty → use the interim CM shape in `wm-contract.md` and
     open the CM with the warning line the contract specifies, so the reader
     knows the format is provisional.

   Never write a CM from memory of a previous run — re-fetch every time.

3. Also search WM for anything newly published on communications:
   ```
   mcp__claude_ai_Notion__notion-search
     query="CM communications format"
     data_source_url="collection://31c59392-0394-4e56-b30c-ccd68b7ef886"
   ```
4. Fetch **WM | Task (TL) Management**
   (https://app.notion.com/p/2863fce2ebeb4bb5a766ae067c6175b4) for the rules on
   status and comments referenced in the CM.

## Step 1 — gather real progress

Ask for the period and the audience (internal PM / Korea team / client) if not
given — the level of detail differs sharply between them.

Then collect evidence:

- **Notion** — query the TL task list for the assignee and period:
  ```
  mcp__claude_ai_Notion__notion-query-data-sources
    data_source_urls=["collection://291326b2-d5fb-817c-a07a-000b34a2418b"]
    query="SELECT … WHERE date(\"date:Due Date:start\") BETWEEN ? AND ?"
  ```
  Capture: completed, in progress, blocked, and due-but-not-started.
- **Git** — `git log --since=<start> --until=<end> --author=<me> --oneline` plus
  merged PRs (`gh pr list --state merged --search "merged:>=<start>"`).
- **Blockers** — anything waiting on design, backend, QA or client confirmation.
  Name what is blocked, on whom, and since when.

## Step 2 — draft the CM

Fill the WM structure. Whatever the section names turn out to be, the content
must answer:

- What was completed this period, with task links
- What is in progress and its honest percentage / remaining work
- What is blocked, on whom, and the impact on the schedule
- What is planned for next period
- Decisions or confirmations needed from the reader, with a by-when

Rules:

- **Every claim links to evidence** — a TL task, PR or build URL.
- **No optimistic rounding.** If a task is at 60%, it is not "almost done".
- **Schedule impact stated plainly.** If something slips, say by how much.
- **Match the audience's language** — Korean for the Korea team where that is the
  norm, English for the India team and English-speaking clients. Ask if unsure.
- Client-facing CMs omit internal blame and internal-only task detail.

## Step 3 — deliver

Draft first, show the user, then send only on their go-ahead. Sending is
outward-facing — never send a CM without explicit confirmation.

On approval: post as a TL task comment
(`mcp__claude_ai_Notion__notion-create-comment`) and/or send to the agreed Slack
channel. Per WM, comment before changing any task status.

## Output

**CM** — sprint / frontend progress communication, WM-format, evidence-linked.

## Reference

WM | Work Manual — https://app.notion.com/p/e72e1c92a33b457e99b776f0df57cd91
