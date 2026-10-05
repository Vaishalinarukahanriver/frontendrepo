# WM Contract — the single source of truth for every Divii skill

**WM | Work Manual:** https://app.notion.com/p/e72e1c92a33b457e99b776f0df57cd91

Every skill in `.claude/skills/fe-* (in this repo)` loads this file first. It exists so that
company rules live in **one** place (Notion WM) and never get frozen into a
skill file. Korea-team task standards are still being published into WM, so a
skill that reads WM at run time stays correct automatically; a skill that
hardcodes a format goes stale the day WM changes.

---

## The non-negotiable rule

> Anything a skill produces — a **CM (Communications)** or a **Report** — must
> pull its format and rule from WM, **not from memory**.

Concretely, before writing a CM or a Report you MUST:

1. Fetch the WM page that governs that artifact (see the index below) using the
   Notion MCP tool `mcp__claude_ai_Notion__notion-fetch`.
2. Follow the structure you just read, even if it differs from the fallback in
   this file or from anything the skill body suggests. **WM wins.**
3. Cite the WM page URL in the artifact's "References" section.
4. If the WM page is **empty or missing** (several are still being written),
   say so out loud in your output:
   > ⚠️ WM page *<name>* is not yet published. Structure below follows the
   > interim fallback in `wm-contract.md` and must be re-checked once WM is
   > updated.
   Never silently invent a format and present it as the company standard.

If Notion is unreachable, stop and tell the user — do not produce a CM or
Report from memory.

---

## How to load WM at run time

```
mcp__claude_ai_Notion__notion-fetch  id="<WM page url from the index below>"
```

To find a rule when you don't know which page holds it, search the WM database
directly rather than guessing:

```
mcp__claude_ai_Notion__notion-search
  query="<the rule you need>"
  data_source_url="collection://31c59392-0394-4e56-b30c-ccd68b7ef886"
```

That collection **is** the WM | Work Manual database, so anything newly
published by the Korea team shows up there without this file changing.

---

## WM index (fetch these, don't paraphrase them)

### Output formats — always fetch before producing the artifact
| Artifact | WM page | URL |
|---|---|---|
| Report | WM \| Report | https://app.notion.com/p/09990cac269f41ccabd31deb069512bf |
| CM | WM \| CM 작성 | https://app.notion.com/p/223326b2d5fb8065be60f875d65af192 |
| Weekly report (client) | WM \| 주간 보고서 작성 | https://app.notion.com/p/223326b2d5fb8048aac4c4390223fdaf |
| Weekly work log (internal) | WM \| 주간업무보고 작성 및 제출 가이드 | https://app.notion.com/p/2d8326b2d5fb808d95fad91edc7c4d43 |
| Meeting notes | WM \| Meeting Notes Guidelines | https://app.notion.com/p/0fa80c36a358428caad98664fa91d19c |
| Document list & how to write each | WM \| 문서 리스트 및 작성 방법 | https://app.notion.com/p/9ac6b4627432483e8c4fc2e8f8b84404 |

### Frontend engineering rules
| Topic | WM page | URL |
|---|---|---|
| HTML/SCSS folder structure, naming, breakpoints | WM \| HTML development guideline | https://app.notion.com/p/9695262a68b7463db0d750634029da96 |
| Light/dark colour system ([day]/[night]/Constant) | WM I Light/Dark Mode Color System | https://app.notion.com/p/75711652f115489c9d0800aa76c44da4 |
| Design hand-off expectations | WM \| Design guidelines for designers | https://app.notion.com/p/3d66aa4c0ef1487c87abd45f16f280cb |
| Figma file setup rules | WM \| Figma Setting Rules | https://app.notion.com/p/2fdb2ebedc3742ba9ea38a9cd8ddc40e |
| Figma design system | WM \| Design system in Figma | https://app.notion.com/p/d63b6fafcc2944698a3b731e8d600a51 |
| Date formatting | WM \| Development - Date format Manual | https://app.notion.com/p/c9e5a7fdd2f541a1a6bf127e3e92cc27 |
| Number formatting (thousands separator) | WM \| Development - Three digit coma rule | https://app.notion.com/p/3ba0ef434e254bb4a20d10cb17f57655 |
| Password rules | WM \| Development - Password Format | https://app.notion.com/p/6b6da9b04c134821b0d7d5e2ee3ad7d3 |
| Error message wording | WM \| Error Message List | https://app.notion.com/p/f0a07346bd2349e28bc76abe2fe135ac |

### Process rules
| Topic | WM page | URL |
|---|---|---|
| QA flow & issue statuses | WM \| Work Manual for QA Process | https://app.notion.com/p/bab0d0977e6c4c48943c1c6476dd6e95 |
| QA case templates | WM \| QA Template | https://app.notion.com/p/89e8efe5cbf746a29882ae011be5446e |
| Task (TL) rules — comment before status change | WM \| Task (TL) Management | https://app.notion.com/p/2863fce2ebeb4bb5a766ae067c6175b4 |
| Task list management | WM \| Task List Management | https://app.notion.com/862b448c4aac4f76b2f26b2b7a62a004 |
| Sharing a build | WM \| Build sharing plan | https://app.notion.com/p/cb95b97f449e417995c449e08aba4f1f |
| Who owns what | WM \| Roles and responsibilities | https://app.notion.com/p/77093627fb7c4b7ea2e01ed2048589e0 |

---

## Interim fallbacks (use ONLY when the WM page is empty, and flag it)

### Report — as published in WM | Report
WM currently defines a Report as accurate and specific, well organised and
grammatically correct, verified, free from errors and duplication, with this
structure:

1. Title
2. Introduction
3. Summary
4. Content
5. References link
6. Findings
7. Conclusions

### CM (Communications) — ⚠️ WM | CM 작성 is currently an empty page
Until the Korea team publishes it, use this minimal shape and mark it as
interim every single time:

```
CM | <Project> — <Subject>            (title line)
To / CC:
Date:
1. Background        — why this CM exists, one or two lines
2. Content           — what happened / what is being communicated
3. Impact & schedule — effect on scope, timeline or cost
4. Action required   — who must do what, by when
5. References        — TL task link, MN link, WM rule link
```

Re-fetch WM | CM 작성 on every run. The moment it has content, that content
replaces this block.

---

## House rules that apply to every skill

- **Never change a Notion task status without leaving a comment first**
  (WM | Task (TL) Management).
- **Never mark an issue Fixed or Not-an-issue** — only QA or PM may
  (WM | Work Manual for QA Process). A developer's terminal status is
  *Ready for QA*.
- **Link the evidence.** Every CM, Report and task comment carries links to the
  TL task, the WM rule applied, and the build/PR/Figma it refers to.
- **Ask, don't assume.** If a required input (project, TL task URL, sprint
  range, build URL) is missing, ask for it rather than filling in a plausible
  guess.
- **Language.** Match the audience: internal Korea-team artifacts may be Korean,
  India-team and client-facing English artifacts stay English. If unsure, ask.

---

## Project context (example: a Next.js admin frontend. Read CLAUDE.md in the repo you are in.)

Stack the frontend skills assume, and should re-verify from `package.json`
before scaffolding:

- Next.js 15 (App Router, `src/app/(main)` and `src/app/(full-page)`), React 19, TypeScript
- PrimeReact 10 + PrimeFlex, SCSS partials in `src/styles`
- TanStack Query v5 for server state, Redux Toolkit for client state
- axios services in `src/api-services/*Service.ts`
- query hooks in `src/hooks/API/<domain>/use*.ts`, re-exported from `src/hooks/API/index.ts`
- Playwright e2e in `e2e/`
