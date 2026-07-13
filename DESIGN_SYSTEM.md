# Avaada Design System

Premium enterprise design language for **AvaadaMeet AI Companion**.  
Quality bar: Linear · Notion · Stripe.

**Token source of truth:** `src/design-system/tokens.css`  
**Component patterns:** `src/design-system/components.css` (`ds-*` classes)  
**Workspace layout tokens:** `src/design-system/workspace.ts` (`ws.*`/`wsBadge.*`)

> Components are not fully migrated. New work should use tokens and `ds-*` patterns where practical. Legacy classes (`card-surface`, `panel-surface`, etc.) remain in active use. Meetings and Action Items use a separate, newer system — see `src/components/meetings/workspace/meetingsWorkspace.css` (`mw-*` classes) and `docs/HANDOFF.md` for why.

---

## 1. Design principles

| Principle | Rule |
|-----------|------|
| Hierarchy over decoration | One focal element per view; metadata is quieter |
| Density with clarity | 8px grid; no oversized cards |
| Single elevation | One shadow per surface; never stack shadows |
| Shadow ≠ clip | Outer panel gets shadow; inner node gets `overflow` |
| Motion with purpose | Color/opacity transitions only; no shadow animation |
| Semantic color | Status colors convey meaning, not decoration |

---

## 2. Spacing system

**Base unit: 8px** (with 4px half-step for fine tuning)

| Token | Value | Use |
|-------|-------|-----|
| `--space-0-5` | 2px | Segment gaps |
| `--space-1` | 4px | Inline icon gap |
| `--space-1-5` | 6px | Segment padding |
| `--space-2` | 8px | **Default gap** between related items |
| `--space-2-5` | 10px | Compact card padding |
| `--space-3` | 12px | Card padding (sm) |
| `--space-4` | 16px | Card padding (md), row padding |
| `--space-6` | 24px | Section separation |
| `--space-8` | 32px | Empty state padding |

**Rules**
- Page sections: `gap-2` (8px) or `gap-3` (12px) — never `gap-6` on dense views
- Card internal padding: `p-3` (12px) executive dense · `p-4` (16px) comfortable
- Never use arbitrary values (`p-3.5`, `gap-2.5`) in new code unless tokenized

---

## 3. Typography scale

| Role | Token | Size | Weight | Use |
|------|-------|------|--------|-----|
| Display MD | `--font-size-display-md` | 32px | Semibold | Page title (one per view) |
| Display SM | `--font-size-display-sm` | 30px | Bold | KPI numbers |
| Heading LG | `--font-size-heading-lg` | 24px | Semibold | Rare marketing headers |
| Heading MD | `--font-size-heading-md` | 20px | Semibold | TopBar title |
| Heading SM | `--font-size-heading-sm` | 18px | Semibold | Section titles |
| Body LG | `--font-size-body-lg` | 16px | Regular | Comfortable body |
| Body | `--font-size-body` | 14px | Regular | **Default UI text** |
| Caption | `--font-size-caption` | 12px | Medium | Secondary labels |
| Small | `--font-size-small` | 11px | Regular | Metadata, timestamps |
| Micro | `--font-size-micro` | 10px | Medium | Uppercase section labels |

**CSS classes:** `ds-text-page-title`, `ds-text-section-title`, `ds-text-label`, `ds-text-metadata`

**Rules**
- One weight emphasis per line (don't mix semibold + bold in same card)
- Tabular nums for times and counts: `tabular-nums`
- Uppercase labels: micro + `tracking-wider` only

---

## 4. Color palette

### Brand
| Name | Variable | Hex |
|------|----------|-----|
| Navy | `--color-brand-navy` | `#0F2A4A` |
| Teal | `--color-brand-teal` | `#10A37F` |
| Teal hover | `--color-brand-teal-hover` | `#0D8F6F` |
| Teal muted | `--color-brand-teal-muted` | `#E6F7F1` |

### Neutrals (slate scale)
Canvas `#F8FAFC` · Border `#E2E8F0` · Text primary `#0F172A` · Text tertiary `#64748B`

### Status
| Status | Text | Background |
|--------|------|------------|
| Success | `--color-success` | `--color-success-muted` |
| Warning | `--color-warning` | `--color-warning-muted` |
| Danger | `--color-danger` | `--color-danger-muted` |
| Info | `--color-info` | `--color-info-muted` |

### Semantic surfaces
- `--surface-canvas` — app background
- `--surface-default` — cards, panels
- `--surface-sunken` — segment tracks, inset areas
- `--surface-accent` — subtle brand tint

---

## 5. Elevation & shadows

| Level | Token | Use |
|-------|-------|-----|
| 0 | `--elevation-0` | Flat rows, inline elements |
| 1 | `--elevation-1` | **Panels, cards** (default) |
| 2 | `--elevation-2` | Dropdowns, popovers |
| 3 | `--elevation-3` | Modals, command palette |

**Never**
- Put `overflow-hidden` on the same node as `box-shadow`
- Stack `shadow-sm` + `shadow-elevation-1`
- Animate shadows on hover

**Pattern**
```html
<div class="ds-surface-panel">
  <div class="ds-surface-clip">…scrollable content…</div>
</div>
```

---

## 6. Border radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | 6px | Buttons, inputs, segments |
| `--radius-md` | 8px | Chips, badges, inner elements |
| `--radius-lg` | 12px | Panels, cards |
| `--radius-full` | pill | Avatars, count badges |

**Rule:** Nested radii align — segment inside track uses `radius-sm`, track uses `radius-sm`.

---

## 7. Icon sizes

| Token | Size | Use |
|-------|------|-----|
| `--icon-xs` | 12px | Inline metadata |
| `--icon-sm` | 14px | Buttons, row actions |
| `--icon-md` | 16px | **Default** |
| `--icon-lg` | 20px | Section headers |
| `--icon-xl` | 24px | Empty states |

Tailwind: `h-icon-sm w-icon-sm` etc.  
Lucide: set `strokeWidth={1.75}` for md, `{1.5}` for sm.

---

## 8. Button hierarchy

| Variant | Class | When |
|---------|-------|------|
| **Primary** | `ds-btn ds-btn-primary` | One per view — Join, Save, Confirm |
| **Secondary** | `ds-btn ds-btn-secondary` | Supporting actions |
| **Ghost** | `ds-btn ds-btn-ghost` | Tertiary, toolbar icons |
| **Danger** | primary + danger tokens | Destructive only |

| Size | Height | Class |
|------|--------|-------|
| SM | 32px | `ds-btn-sm` |
| MD | 36px | default |
| LG | 40px | future |

**States**
- Hover: background shift only (no shadow change)
- Active: `scale(0.99)` max on primary CTA
- Disabled: `opacity: 0.5`, no pointer
- Focus: `ds-focus` / `focus-ring`

---

## 9. Chip & filter hierarchy

Three levels — do not mix:

| Level | Component | Pattern |
|-------|-----------|---------|
| **Group** | `SegmentedControl` / `ds-segment-track` | One track, no nested borders |
| **Standalone** | `Chip` | Single toggle outside a group |
| **Status** | `ds-badge-*` | Read-only labels |

**Active segment:** white fill on sunken track — **no shadow** on segment.

---

## 10. Badge styles

| Variant | Class | Use |
|---------|-------|-----|
| Neutral | `ds-badge-neutral` | Counts, sources |
| Accent | `ds-badge-accent` | Brand highlights |
| Success / Warning / Danger / Info | `ds-badge-*` | Status |

**Rules**
- Flat tinted background — no rings or glows
- Height: 24px (`1.5rem`)
- Font: caption, medium weight

---

## 11. Interactive states

| State | Treatment |
|-------|-----------|
| **Hover** | `background: var(--interactive-hover)` or border accent |
| **Active/Pressed** | `var(--interactive-active)` |
| **Selected** | `var(--interactive-selected)` |
| **Focus** | 2px teal ring, 2px offset |
| **Disabled** | 50% opacity, `cursor: not-allowed` |

**Rows:** `ds-row` with bottom border; hover background only.

---

## 12. Loading states

| Pattern | Class | Use |
|---------|-------|-----|
| Skeleton | `ds-skeleton` | Page/section placeholders |
| Spinner | `ds-spinner` | Inline button loading |
| Shimmer | `ds-shimmer` animation | 1.2s ease-in-out |

**Rule:** Match skeleton dimensions to final content — no layout shift.

---

## 13. Empty states

Use `ds-empty` pattern:
- Icon container: 48px, accent background
- Title: body, medium
- Description: caption, tertiary, max-width 320px
- Optional action: primary button below

---

## 14. Motion & transitions

| Token | Duration | Use |
|-------|----------|-----|
| `--duration-fast` | 120ms | Color, border |
| `--duration-normal` | 200ms | Opacity, transform |
| `--duration-slow` | 320ms | Panel slide |

| Easing | Use |
|--------|-----|
| `--ease-default` | General UI |
| `--ease-out` | Enter, reveal |
| `--ease-spring` | Rare delight (badges) |

**Do animate:** `color`, `background-color`, `border-color`, `opacity`, `transform`  
**Don't animate:** `box-shadow`, `width`, `height` (layout thrash)

Classes: `ds-transition-colors`, `ds-transition-opacity`

---

## 15. Layout tokens

| Token | Value |
|-------|-------|
| Sidebar width | 220px |
| TopBar height | 56px |
| Content max (standard) | 1152px (`6xl`) |
| Content max (calendar) | 1280px (`7xl`) |
| Command rail | 280px |

---

## 16. Migration map (legacy → design system)

| Legacy | Replace with |
|--------|--------------|
| `card-surface` | `ds-surface-panel` |
| `panel-surface` | `ds-surface-panel` |
| `surface-clip` | `ds-surface-clip` |
| `ease-premium` | `ds-transition-colors` |
| `shadow-elevation-1` on panels | `shadow-sm` / `--elevation-1` |
| `rounded-xl` on controls | `rounded-sm` / `rounded-lg` by context |
| `chip` in groups | `SegmentedControl` |

---

## 17. File reference

```
src/design-system/
├── tokens.css       # CSS custom properties (source of truth)
├── components.css   # ds-* component patterns
├── workspace.css    # workspace-*/ws.* layout patterns (Meetings, Action Items shell)
└── workspace.ts     # TS token objects (ws, wsBadge) for workspace.css classes

src/components/meetings/workspace/
└── meetingsWorkspace.css   # mw-* classes — the current system for Meetings & Action Items

tailwind.config.ts   # Theme wired to CSS variables
src/index.css        # Imports tokens + legacy bridge
```

---

*Version 1.0 — tokens first; component migration is ongoing, not blocked on a redesign approval.*
