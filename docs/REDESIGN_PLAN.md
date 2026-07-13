# AvaadaMeet 2.0 — Full UI Redesign Plan

**Goal:** A ground-up redesign of the meeting companion. Same features, entirely new structure.
**Quality bar:** Apple Calendar / Stripe Dashboard / Linear / Amie / Notion Calendar.
**Hard requirement:** Excellent usability for older users (executives 55+) — large type, high contrast, zero hidden gestures, shallow navigation.

---

## 1. Design direction — "Calm Executive"

The current UI is a dense, neubrutalist three-column workspace. The redesign replaces it with a
**calm, spacious, one-thing-at-a-time** experience. Principles:

| # | Principle | What it means in practice |
|---|-----------|---------------------------|
| 1 | **Today first** | The app opens into *your day*, not a dashboard of widgets. Everything radiates from "what's next". |
| 2 | **One primary surface per screen** | No three-column grids. Master → detail, full-width, progressive disclosure via tabs. |
| 3 | **Words over icons** | Every action is a labeled button. Icon-only controls are banned except universally understood ones (←, ✕, 🔔 with label tooltip). |
| 4 | **Big, obvious, forgiving** | 16px minimum body text, 48px touch targets, generous whitespace, confirmation on destructive actions, visible focus rings. |
| 5 | **Quiet AI, loud clarity** | AI is a calm assistant panel, never a floating draggable window. AI content is always labeled "AI" with confidence shown in plain language. |
| 6 | **Depth through light, not lines** | Soft ambient elevation (Stripe-style), warm canvas, no hard black offset shadows, no 2px borders. |

---

## 2. Foundations (new token system)

### 2.1 Typography — readable first

| Role | Font | Size / weight | Use |
|------|------|---------------|-----|
| Display | **Fraunces** (soft serif) | 40/34px, 560 | Greeting, page titles — warm, premium editorial feel |
| Heading | Inter | 22/18px, 650 | Section + card titles |
| **Body (default)** | Inter | **16px**, 450, lh 1.6 | All UI text — *raised from 14px* |
| Secondary | Inter | 14px, 450 | Metadata (never below 13px anywhere) |
| Numeric | Inter tabular | — | Times, counts, KPIs |

- Global **text-size setting** (Default / Large / Extra large) in the profile menu → scales the whole rem base (16 → 18 → 20). This is the single highest-impact accessibility feature for older users.
- Line length capped at ~70ch. No uppercase micro-labels below 12px.

### 2.2 Color — high contrast, one accent

| Token | Light | Dark | Notes |
|-------|-------|------|-------|
| Canvas | `#FAF9F7` warm paper | `#101418` | Warm, not clinical slate |
| Surface | `#FFFFFF` | `#171C22` | Cards, panels |
| Ink (text) | `#1A2333` | `#E9EDF2` | ≥ 12:1 contrast on canvas |
| Text secondary | `#5A6472` | `#9AA6B4` | ≥ 4.6:1 — nothing lighter is used for text |
| **Accent** | `#0E6E5C` deep emerald | `#3ECFAB` | Buttons, links, "now" indicator — single accent only |
| Accent wash | `#E8F4F0` | `#12332C` | Selected states, AI panel tint |
| Success / Warning / Danger / Info | `#177245` / `#9A5B00` / `#B3261E` / `#1B5FA8` | darkened for AA on white | Status always = **color + icon + word** (never color alone) |

All status chips carry text ("Overdue", "Blocked") — designed for reduced color perception.

### 2.3 Space, shape, elevation, motion

- **Grid:** 8px base, but *comfortable density*: card padding 20–24px, list rows 64px min height.
- **Radius:** 10px controls · 16px cards · 24px sheets/modals. Friendly, consistent.
- **Elevation:** layered soft shadows only — `0 1px 2px rgba(16,24,40,.05)` (card) → `0 12px 32px rgba(16,24,40,.10)` (sheet). Never animated, never offset-black.
- **Controls:** buttons 48px (primary) / 40px (secondary); inputs 48px; toggles 32×52px with ON/OFF text inside.
- **Motion:** 180–240ms ease-out fades/slides only; full `prefers-reduced-motion` support; no parallax, no springs.
- **Focus:** 3px accent ring, 2px offset, everywhere, always visible on keyboard nav.

---

## 3. New Information Architecture

### Old structure (discarded)
Sidebar (4 items) → dense pages; Meetings & Actions = three-column workspaces; AI = floating draggable dialog.

### New structure

```
┌────────────────────────────────────────────────────────────────────┐
│ TOP APP BAR   Avaada ◆   [Today] [Calendar] [Meetings] [Actions]   │
│               ─────────  Search ⌘K            🔔  Join now  (GM)   │
├────────────────────────────────────────────────┬───────────────────┤
│                                                │                   │
│                MAIN STAGE                      │   ASSISTANT RAIL  │
│         (one surface, max 880px reading)       │  (docked, 360px,  │
│                                                │   collapsible)    │
│                                                │                   │
└────────────────────────────────────────────────┴───────────────────┘
```

1. **Top horizontal navigation** replaces the left sidebar — four large, labeled tabs, always visible, never collapses into icons. (Older users never lose the nav; on mobile it becomes a bottom tab bar with labels.)
2. **Main stage** — a single readable column/canvas per screen. Detail views are *full screens with a big ← Back*, not columns squeezed beside a list.
3. **Assistant rail** — the AI copilot becomes a **docked right-hand panel** (like Notion AI / Copilot in Office), toggled by one persistent "Assistant" button. No dragging, no resizing, no floating window. It is context-aware: opens pre-loaded with whatever meeting/action is on the main stage.
4. **Command palette + global search (⌘K / search box)** — new capability; searches meetings, actions, people, and calendar in one field with big result rows.

Routes: `/today` (default) · `/calendar` · `/meetings` + `/meetings/:id` · `/actions` + `/actions/:id`.

---

## 4. Screen blueprints

### 4.1 Today (new home — replaces "Home" dashboard)

A day-planner, not a stats dashboard. Layout: hero + two stacked sections.

1. **Hero — "Good morning, Gyanpriya"** (Fraunces display)
   - Date + one-line AI daily summary in plain language ("4 meetings, 3 free hours after 2 PM, 2 actions are overdue.") — absorbs the old 4 insight cards into one sentence with details on click.
   - **Up-next card** (largest element on screen): meeting title, time-until in words ("in 25 minutes"), attendees, and one giant **Join meeting** button. Live "Happening now" state with pulsing (motion-safe) indicator.

2. **Your day — vertical agenda timeline** (replaces "Upcoming Meetings" list)
   - Full day as a large-type timeline: meetings, focus blocks, lunch. "Now" line in accent.
   - Each row: time, title, platform, attendee avatars, **Auto-join** labeled toggle, and Join when within 15 min. Row click → meeting detail.

3. **Needs your attention** (replaces stat cards + activity stream)
   - Max 3 large cards: overdue/blocked actions, meetings awaiting summary approval, new AI summaries ready. Each card = one sentence + one button ("Review", "Approve", "Open"). "All clear ✓" state when empty.
   - Quiet footer link: "This week: 12 meetings · 8 open actions · 47 emails sent" → absorbs old stat-card numbers.

### 4.2 Calendar

Keeps Month / Week / Day but restructured as a **single full-width canvas** (no permanent sidebar).

- **Toolbar:** big "Today" button, ‹ › arrows, month label, **view switcher as three labeled buttons** (Month · Week · Day — not a tiny segmented control), and a "Filter" button opening a checklist popover (category filters with color + label).
- **Month:** large cells, up to 3 named event pills (not dots), "+2 more" opens a **day peek sheet**.
- **Week:** time grid, 60px hour rows, current-time line; event cards show title + time at readable size.
- **Day:** the Today-page timeline component reused at full width with prep hints inline.
- **Event peek → detail sheet:** clicking any event opens a **large right-hand sheet** (not a tiny popover): title, time, attendees w/ emails, location/link, **Join**, Auto-join toggle, recurring badge, and the **Preparation checklist** (moved here from the old sidebar — prep belongs to the event, not to a rail).
- Mini-calendar + "executive brief" sidebar are **deleted**; their content lives in Today (brief) and the event sheet (prep). One calendar, one purpose.

### 4.3 Meetings — "Library → Meeting Room"

**Library (list) view**
- Large search field + date filter as labeled chips (Today · Tomorrow · This week · Pick dates…), synced to URL.
- **Grouped list rows** (not a card grid): Today / Earlier this week / Last week. Each 72px row: time, title, host, attendee count, and a **status word**: "Summary ready" (accent) / "Awaiting review" / "Upcoming".

**Meeting Room (full-screen detail)** — replaces the 3-column workspace with a **tabbed single column** (880px reading width) + persistent header:
- Header: ← All meetings, title, date · time · organizer, status chip, and action bar: **Approve summary** (primary) · Share notes · Export brief · Generate email.
- **Tabs (large, labeled, underline style):**
  1. **Overview** — the AI brief as a readable letter: Outcome, Impact, Key risk, Next step. Confidence in plain words: "High confidence — based on 3 sources ▸". Related meetings as large link cards (navigates within room).
  2. **Decisions** — conflict alerts first (full-width amber cards with "Resolve" guidance), then one **expandable card per decision**: owner, status word, why it matters, business impact, risks, AI recommendation. One decision expanded at a time.
  3. **Actions** — commitments as rows: checkbox-style status, owner avatar+name, due date in words ("due Friday"), priority word, dependency chips. Overdue rows get a red left edge + "Overdue" word.
  4. **Timeline** — the decision-flow chain and narrative timeline as a vertical story (Context → Decision → Action → Risk → Outcome), replacing the cramped chain diagram.
  5. **People & files** — people mentioned (avatar, name, role), linked projects, documents. Absorbs the old Knowledge Panel.
- **Upcoming meetings** show Overview = prep checklist (big checkboxes, progress "3 of 5 done") + attendees + related meetings; other tabs show friendly "Available after the meeting" placeholders.

### 4.4 Actions — "Focus queue → Action detail"

**Queue view**
- Filter as labeled chips (All · Open · Completed) + search.
- Groups kept (**Needs attention → Today → This week → Completed**) but as full-width rows: status word chip, title, owner (avatar + name), due date in words, progress as a **fraction + thin bar** ("60% · on track"), "AI generated" tag.
- Row click → full-screen detail (no side-by-side columns).

**Action detail (full screen)**
- Header: ← All actions, title, owner · department · project, status.
- Single column sections: **What's happening** (AI brief) → **Status** (banner: "Waiting for your approval" / "Ready to execute", blockers, due date, progress) → **Dependencies** (cards with type words: "Waiting on…", "Blocked by…") → **People, files & risks** (absorbed knowledge panel).
- **Sticky bottom action bar** (always visible, never hidden in a menu): **Approve** (primary) · Request update · Delegate · Reject. Reject asks "Are you sure?" with plain-language consequence.

### 4.5 Assistant rail (replaces floating AI dialog)

- One persistent **"Assistant"** button (top bar + a subtle tab on the right edge). Opens a **docked 360px rail**; main content reflows (no overlap, nothing to drag).
- Header states context in words: "Discussing: *Q3 Budget Review*" with a **Change ▾** picker (searchable big rows — meetings, actions, "General question").
- **Starter prompts as large tappable cards** (max 4 visible, "More ▾"), then chat with 16px text; structured answer blocks (summary / decision / action / table) rendered as the same cards used on the main stage — visual consistency.
- Quick actions as labeled buttons under the composer: Generate email · Status brief · Create MOM · Export.
- Honest labeling: "AI-generated — verify important details" footer; confidence always in words.

### 4.6 Shell details

- **Top bar:** brand, 4 nav tabs, global search (⌘K), notifications (real list panel with read states — upgraded from decorative bell), **Join now** (jumps to the imminent meeting), profile menu → theme (Light/Dark/System), **Text size**, Settings, feedback, last-refreshed.
- **Mobile:** bottom tab bar with **labels + icons** (Today · Calendar · Meetings · Actions), assistant becomes a full-screen sheet; all rows already ≥48px.
- **Loading:** skeletons matching final layout; **Empty states** always = friendly sentence + one clear next-step button.

---

## 5. New component library (v2)

| Component | Replaces | Notes |
|-----------|----------|-------|
| `AppBar`, `NavTabs`, `MobileTabs` | Sidebar/TopBar/MobileTabBar | Horizontal nav, labeled |
| `CommandSearch` | — (new) | ⌘K palette + search field, large result rows |
| `HeroNextUp` | ExecutiveSummary | Join CTA, live state |
| `DayTimeline` | UpcomingRow + DayView | Shared Today/Calendar-day component |
| `AttentionCard` | StatCard + brief panel | Sentence + one action |
| `EventSheet` | Calendar sidebars | Right sheet w/ prep checklist |
| `MeetingRoom` + `RoomTabs` | ExecutiveMeetingWorkspace (mw-*) | Tabbed single column |
| `DecisionCard`, `ConflictBanner`, `CommitmentRow`, `StoryTimeline` | DecisionIntelligence/Flow/ActionReview sections | Progressive disclosure |
| `QueueRow`, `ActionDetail`, `StickyActionBar` | ActionItems 3-column workspace | Full-screen detail |
| `AssistantRail`, `ContextPicker`, `AnswerBlocks` | AiCopilotDialog/Fab/Picker | Docked, no drag/resize |
| `Chip`, `FilterChips`, `StatusWord`, `BigToggle`, `Progress`, `Banner`, `SheetModal` | SegmentedControl, Toggle, badges | 48px targets, text-first |
| Kept: `Avatar(Group)`, `Skeleton`, `EmptyState`, `Button` (rebuilt sizes) | | |

CSS: one new token file (`tokens.v2.css`) + Tailwind theme; **delete** `workspace.css` (2,700 lines), `meetingsWorkspace.css`, and all `mw-*`/neubrutalist styles at the end of migration.

---

## 6. Feature-parity checklist (nothing lost)

Auto-join (per meeting + master) ✓ Today hero + timeline · Join buttons ✓ hero/timeline/event sheet · Stat KPIs ✓ hero sentence + week footer · AI daily insights ✓ hero summary · Activity stream ✓ Attention cards · Month/Week/Day ✓ · Category filters ✓ filter popover · Mini-calendar ✗ replaced by month view itself · Prep checklist ✓ event sheet + Meeting Room Overview · Meeting search/date filters ✓ library · AI brief/confidence ✓ Overview tab · Decision intelligence + conflicts ✓ Decisions tab · Commitments ✓ Actions tab · Decision chain/narrative ✓ Timeline tab · Knowledge panel ✓ People & files tab · Approve/Share/Export/Email ✓ room header · Action groups/filters/search ✓ queue · Approve/Delegate/Reject/Request-update ✓ sticky bar · Dependencies/risks ✓ detail sections · AI copilot (3 configs, prompts, quick actions, structured blocks, context picker) ✓ Assistant rail · Theme toggle ✓ + new text-size setting · Notifications ✓ upgraded to real panel · Global search/⌘K ✓ new.

---

## 7. Build plan (phased, always shippable)

| Phase | Scope | Outcome |
|-------|-------|---------|
| **1. Foundations** | `tokens.v2.css`, Tailwind theme, fonts (Fraunces + Inter), rebuilt `Button/Chip/Toggle/Card/Banner/StatusWord`, text-size setting | Design system ready |
| **2. Shell** | AppBar + NavTabs + mobile tabs, routes (`/today`, `/meetings/:id`, `/actions/:id`), CommandSearch | New skeleton around old pages |
| **3. Today** | HeroNextUp, DayTimeline, AttentionCards | New default screen |
| **4. Meetings** | Library list + Meeting Room tabs | Retire `mw-*` meetings CSS |
| **5. Actions** | Queue + full-screen detail + sticky bar | Retire actions workspace |
| **6. Calendar** | Toolbar, Month/Week/Day, EventSheet | Retire sidebars |
| **7. Assistant** | AssistantRail + ContextPicker + AnswerBlocks | Retire floating dialog |
| **8. Cleanup** | Delete legacy CSS (`workspace.css`, `meetingsWorkspace.css`, old components), a11y audit (keyboard pass, contrast check, reduced-motion), docs update | Zero legacy debt |

Existing contexts (`MeetingsContext`, `ActionWorkspaceContext`, etc.) and all mock data/types are **kept unchanged** — this is a pure view-layer rebuild, preserving the documented backend-integration seam.
