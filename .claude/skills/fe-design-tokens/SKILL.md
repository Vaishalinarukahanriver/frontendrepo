---
name: fe-design-tokens
description: Build and audit the SCSS light/dark token layer against the WM Light/Dark Mode Color System — [day]/[night] one-to-one pairing, Constant group, no hardcoded hex in components. Use when the user says "design tokens", "dark mode", "colour system", "theme variables", or when hardcoded colours are appearing in components.
---

# Design token sync

Keeps the SCSS colour layer honest against the WM colour system, so dark mode
doesn't need a second implementation.

## Step 0 — load the rules (mandatory)

1. Read `.claude/wm/wm-contract.md (relative to the repo root)`.
2. Fetch **WM I Light/Dark Mode Color System**
   (https://app.notion.com/p/75711652f115489c9d0800aa76c44da4) — it owns the
   naming and pairing rules. The published rules are:
   - Colours are substituted **1:1**. Two different colours cannot both map to
     one colour. Every `[day]` token needs exactly one `[night]` counterpart.
   - Light-mode colours are suffixed **`[day]`**, dark-mode **`[night]`**.
   - Paired colours must have **identical names apart from the `[day]`/`[night]`
     suffix**.
   - Grey values get their own project-specific entries registered in the
     library — not the shared Divii greys.
   - Colours used in both modes go in a separate **Constant** group.
   - Opacity and other styles can be registered and substituted too, not just colour.
3. Fetch **WM | HTML development guideline**
   (https://app.notion.com/p/9695262a68b7463db0d750634029da96) for the SCSS
   variable naming rule: main colour then code — `$red-b1: #B12028`, not
   `$red-dark` or `$red-1`.

## Step 1 — audit what exists

This repo's colour layer lives in `src/styles/` — `_config.scss`,
`_layout_light.scss`, `_layout_dark.scss`, `_layout_dim.scss`.

Find the violations:

```
rg "#[0-9a-fA-F]{3,8}\b" src/components src/app --glob "*.{tsx,scss}"
rg "rgba?\(" src/components src/app --glob "*.{tsx,scss}"
```

Report:
- Hardcoded hex/rgba in components and pages that should be a token
- `[day]` tokens with no `[night]` counterpart, and vice versa
- Paired tokens whose names differ by more than the suffix
- Two distinct light colours collapsing onto one dark colour (breaks the 1:1 rule)
- Mode-independent colours not grouped as Constant
- Variables named against the WM convention
- Inline `style={{ color: … }}` in TSX

## Step 2 — produce the token layer

When asked to build or extend it:

- Define each pair once, named identically apart from the mode suffix
- Keep Constant colours in their own group
- Expose tokens as CSS custom properties so runtime theme switching works
  without recompiling SCSS
- Import order and partial structure follow whatever `src/styles` already does —
  match the existing pattern rather than introducing a new one
- Never define a colour only inside a dark-mode block; define the light value
  first, then override

## Step 3 — migrate call sites

When replacing hardcoded values, change one domain folder at a time and run
`npm run lint` after each. Show the user the mapping table before applying a
bulk replace — a wrong token mapping is invisible until someone opens dark mode.

## Step 4 — verify in both modes

Screenshot the affected screens in light and dark. Check contrast holds in both
(4.5:1 body text, 3:1 UI boundaries) — a pair that satisfies the 1:1 naming rule
can still fail contrast.

## Output

**Other** — SCSS/CSS token layer and migrated call sites, plus a findings list of
WM colour-system violations with the fix for each.

## Reference

WM | Work Manual — https://app.notion.com/p/e72e1c92a33b457e99b776f0df57cd91
