---
name: fe-component-docs
description: Generate or refresh documentation for a React component — purpose, props table, variants, states, data dependencies, accessibility notes and usage examples — read from the source, not guessed. Use when the user says "document this component", "write component docs", "what does this component do", or when handing a component to another developer.
---

# Component documentation

Documents what the component actually does today. Every claim is read out of the
source; nothing is inferred from the name.

## Step 0 — load the rules (mandatory)

1. Read `.claude/wm/wm-contract.md (relative to the repo root)`.
2. Fetch **WM | HTML development guideline**
   (https://app.notion.com/p/9695262a68b7463db0d750634029da96) so documented naming
   and structure match the standard the component is expected to follow.
3. If the component renders dates, numbers or error text, fetch the relevant WM
   formatting pages so the docs state the company rule, not the local behaviour.

## Step 1 — read the source completely

Read the component file end to end, plus its SCSS partial, its types, and any
hook it calls. Then find its call sites:

```
rg "<ComponentName" src --glob "*.tsx"
```

Real usage tells you which props are actually used and which are dead.

## Step 2 — write the doc

```markdown
# <ComponentName>

**Location** `src/components/<domain>/<ComponentName>.tsx`
**Styles** `src/styles/<name>.scss`
**Client component** yes / no (`"use client"`)

## Purpose
What it is for, in two sentences. When to use it — and when to use something else.

## Props
| Prop | Type | Required | Default | Description |
|---|---|---|---|---|

Types copied from the source. If a prop is `any`, say so and flag it.

## Variants & states
Each visual variant, plus loading, empty, error and disabled states — and what
renders in each. Note any state the component cannot currently express.

## Data dependencies
Hooks called, query keys, services hit, and what the component does while the
request is pending or failed.

## Events
Callback props, when each fires, and what it receives.

## Styling
Root class name, which SCSS partial owns it, theme tokens used, and the
breakpoints where the layout changes.

## Accessibility
Roles, labels, keyboard interaction, focus handling. State known gaps honestly
rather than omitting the section.

## Usage
```tsx
// A real example copied from an actual call site, not invented
```

## Used by
Call sites found in the repo.

## Known limitations
Anything the next developer would otherwise discover the hard way.
```

## Step 3 — place it

Default to a `README.md` beside the component, or the repo's existing `doc/`
folder if that's where component docs already live — check before creating a new
convention. Ask the user if the docs should instead go to Notion; if so, use
`mcp__claude_ai_Notion__notion-create-pages` and follow the WM document rules.

## Rules

- Never document a prop, variant or behaviour you did not find in the source.
- If the component is doing something that violates a WM rule, note it under
  Known limitations rather than documenting the violation as intended design.
- Refreshing existing docs: diff against the source and update only what drifted.

## Output

**Other** — component documentation in markdown (repo file or Notion page).

## Reference

WM | Work Manual — https://app.notion.com/p/e72e1c92a33b457e99b776f0df57cd91
