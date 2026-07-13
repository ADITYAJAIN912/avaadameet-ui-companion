# AvaadaMeet — Developer Handoff

This document is the engineering handoff for continuing AvaadaMeet frontend and backend work.

## Current Status

**UI complete, client-only prototype.** React + TypeScript + Vite + Tailwind v4, backed entirely by mock data. Suitable for stakeholder demos and as a foundation for API integration. No backend, auth, or real AI is wired — the AI assistant is a UI-only mock (see below).

Last verified: `npm run build` (zero TS errors).

## Routes

| Route | Page | Notes |
|-------|------|-------|
| `/` | `pages/Home.tsx` | Stat cards, upcoming meetings, "Today's Brief" AI panel |
| `/meetings` | `pages/Meetings.tsx` → `ExecutiveMeetingWorkspace` | Three-column workspace: attention queue, AI review / prep checklist, knowledge panel |
| `/action-items` | `pages/ActionItems.tsx` | Three-column workspace: action queue, review detail, knowledge panel |
| `/calendar` | `pages/Calendar.tsx` | Month / week / day views with mini calendar and executive brief sidebar |

Shell: `components/layout/AppLayout.tsx` wraps all routes (sidebar + top bar + mobile tab bar + global AI assistant).

## Meetings & Action Items Workspace

Both pages share a dedicated visual system scoped under the `mw-*` CSS class prefix, defined in `src/components/meetings/workspace/meetingsWorkspace.css` and imported by both `ExecutiveMeetingWorkspace.tsx` and `ActionItems.tsx`. This is deliberately independent from the older shared `src/design-system/workspace.css` (`ws.*` classes) to avoid a CSS cascade-layer conflict with Tailwind (see "Known issues" below) — new work on these two pages should extend `meetingsWorkspace.css`, not the older `workspace.css`.

Each page follows the same layout: a queue column (left), a detail/review column (center), and a knowledge panel (right, hidden below 1180px).

## Global AI Assistant

`src/components/ai-copilot/` — a floating "Ask Avaada AI" button (bottom-right, every page) that opens a draggable, resizable dialog:

- `AiCopilotFab.tsx` — the trigger button
- `AiCopilotDialog.tsx` — the dialog shell, chat rendering, drag/resize wiring
- `AiCopilotPicker.tsx` — shown when no meeting/action item is selected; lets the user search and pick one, or ask a general question
- `useDraggableDialog.ts` — drag/resize interaction hook (position + size state, viewport clamping)
- `useAiCopilot()` (`src/context/AiCopilotContext.tsx`) — global context. Pages call `setPageConfig(...)` when their selected meeting/action item changes so the assistant opens pre-loaded with that context; the dialog's own picker can override this via `selectConfig(...)`.

Response content comes from `src/components/workspace/copilot/{meetingCopilot,actionCopilot,generalCopilot}.ts` — each exports a `create*CopilotConfig()` that builds canned starter prompts, quick actions, and mock responses (`buildResponse`) from the given meeting/action item/none. **No backend calls are made anywhere in this system.**

## Reusable UI Components (`components/ui/`)

| Component | Purpose |
|-----------|---------|
| `Button` | Primary/secondary/ghost actions |
| `Card` | Surface variants |
| `Toggle` | Auto-join switches; supports indeterminate master state |
| `SegmentedControl` | Tab-style filters (date range, status) |
| `SearchInput` | Search box used in page headers |
| `EmptyState` | Standard empty/coming-soon blocks |
| `StatCard` | Home dashboard metric cards |
| `Avatar`, `AvatarGroup` | Attendee avatars with stable colors |
| `Skeleton` | Per-page loading placeholders (`HomePageSkeleton`, `MeetingsPageSkeleton`, etc.) |

## Data Flow — One Context Per Domain

Every screen reads mock data through a Context provider, never by importing `data/mock*.ts` directly. This is deliberate: swapping in a real backend means editing the ~6 provider files below, not hunting through the component tree.

| Context | Provider | Wraps | Consumed by |
|---------|----------|-------|-------------|
| `useMeetings()` | `context/MeetingsContext.tsx` | `data/mockMeetings.ts` | Home, Meetings page, AI picker |
| `useActionItems()` | `context/ActionItemsContext.tsx` | `data/mockActionItems.ts` | Home, Calendar, Sidebar badge, MobileTabBar badge |
| `useActionWorkspace()` | `context/ActionWorkspaceContext.tsx` | `data/mockActionWorkspace.ts` | Action Items page, AI picker |
| `useCalendarEvents()` | `context/CalendarContext.tsx` | `data/mockCalendarEvents.ts` | Calendar page |
| `useDashboardInsights()` | `context/DashboardInsightsContext.tsx` | `data/mockDashboardInsights.ts` | Home "Today's Brief" panel |
| `useAiCopilot()` | `context/AiCopilotContext.tsx` | (no data file — dialog open/context state only) | AI assistant FAB + dialog |

All providers are nested in `App.tsx` and wrap every route. Each provider file has a `// TODO(backend): hydrate from GET /api/v1/...` comment marking exactly where to swap `useState(mockX)` for a real fetch — that's the only change needed; no consumer component should need to change.

One exception, by design: `utils/meetingContext.ts` and `utils/meetingQueuePreview.ts` call `getMeetingContextById(id, meeting)` directly from `data/mockMeetingContexts.ts`. This is a per-item **detail enrichment** lookup (decisions/risks/timeline for one already-resolved meeting), not a list read — it maps naturally to a `GET /meetings/:id/context` endpoint called lazily, so it's left outside the context layer intentionally rather than forced into `MeetingsContext`.

### Mock data files

| File | Contents |
|------|----------|
| `data/mockMeetings.ts` | Meeting records |
| `data/mockMeetingContexts.ts`, `mockMeetingReviewData.ts`, `mockDecisionIntelligence.ts` | Per-meeting AI review detail (decisions, risks, timeline) — see exception above |
| `data/mockActionItems.ts` | Simple action item records |
| `data/mockActionWorkspace.ts` | Full action item workspace detail |
| `data/mockCalendarEvents.ts`, `mockScheduleEvents.ts` | Calendar page events |
| `data/mockDashboardInsights.ts` | Home "Today's Brief" panel content |
| `data/constants.ts` | `TODAY`, `MOCK_NOW_TIME`, `USER_NAME`, `USER_EMAIL` — clock anchor for all date logic |

### Mock time assumptions

- `TODAY` and `MOCK_NOW_TIME` in `data/constants.ts` anchor all "is this past/upcoming" logic
- Home "upcoming" uses **future-only** (`utils/meetings.isMeetingUpcoming`)
- Meetings queue shows the full day including past/completed (`isMeetingPastOrCompleted`)

## Future API Integration Points

Each context provider is the single seam to edit — swap the `useState(mockX)` line for a real fetch (e.g. `useQuery`), keep the same value shape the hook already returns, and no consumer changes.

### 1. `MeetingsProvider` (`context/MeetingsContext.tsx`)

```ts
// Pseudocode
const { data: meetings = [] } = useQuery(['meetings'], () => api.getMeetings())
```

Keep `updateAutoJoin` / `setAutoJoinForIds` but call the API optimistically (update local state immediately, roll back on failure).

### 2. `ActionItemsProvider` / `ActionWorkspaceProvider`

Same pattern — `ActionItemsProvider` backs the simple list (Home stats, sidebar badge, Calendar sidebar); `ActionWorkspaceProvider` backs the rich Action Items page detail. These can point at two different endpoints, or one endpoint with two shapes/views.

### 3. `CalendarProvider`

Replace `getCalendarEvents()` with a real calendar sync API call. Category inference (`inferCategory` in `data/mockCalendarEvents.ts`) may become a server-side field instead of a client-side heuristic.

### 4. `DashboardInsightsProvider`

Replace with a real insights/analytics endpoint. Also fold the "Emails Delivered" stat card in `Home.tsx` (currently a literal `47`) into a real stats endpoint alongside this.

### 5. AI Assistant

Replace `buildResponse()` mock functions in `components/workspace/copilot/*.ts` with real API/LLM calls. The `AvaadaCopilotConfig` shape (starter prompts, quick actions, response blocks) can stay the same — only the response source changes. This is orthogonal to the context refactor above; `AiCopilotContext` only tracks *which* meeting/action item is active, not response content.

## Suggested Backend Endpoints

```
GET    /api/v1/me                          Current user profile
GET    /api/v1/meetings?from=&to=&q=       List meetings
PATCH  /api/v1/meetings/:id                Update autoJoin, videoRec
PATCH  /api/v1/meetings/bulk-auto-join     Master toggle for id set
GET    /api/v1/action-items?status=&q=     List action items
GET    /api/v1/dashboard/stats             Home stat cards
GET    /api/v1/calendar/events?from=&to=   Calendar view
POST   /api/v1/assistant/messages          AI assistant chat (or WebSocket)
GET    /api/v1/notifications               TopBar bell (future)
```

Recommended response shapes mirror `types/meeting.ts`, `types/actionWorkspace.ts`, and `types/meetingContext.ts`.

## Known TODOs

- [ ] Replace mock data with API hooks
- [ ] Implement real search (currently client-side filter only)
- [ ] Connect calendar OAuth providers
- [ ] Wire the AI assistant to a real backend/LLM
- [ ] Add an automated test suite (none exists today)
- [ ] Persist auto-join preference per user

## Known Issues / Gotchas

- **CSS cascade layers**: `src/index.css` imports `tokens.css` → `components.css` → `workspace.css` → Tailwind, in that order. Because of how CSS `@layer` priority is determined by first-appearance order, Tailwind's own `base` layer (Preflight) ends up with *higher* priority than the custom `components` layer that `workspace.css` styles live in — meaning some property overrides in `workspace.css` (notably `border-*` shorthand) can silently lose to Tailwind's reset regardless of selector specificity. Workaround used throughout: apply the affected style via a Tailwind utility class directly in JSX (which lives in the `utilities` layer, highest priority) instead of fighting it in `workspace.css`. If you hit "my CSS isn't applying" on this file, this is almost always why.
- `src/design-system/workspace.css` (~2700 lines) is largely superseded by `meetingsWorkspace.css` for Meetings/Action Items, but is left in place since it's still relied on for a handful of active tokens (page header, empty states, card primitives) and pruning it carries real risk of breaking live styles. Safe to leave as-is; do not add new work to it — extend `meetingsWorkspace.css` instead.

## Developer Notes

### Sidebar badge

- Expanded: numeric count next to "Action Items"
- Collapsed: small red dot indicator

### Loading UX

Each page uses `usePageLoading(ms)` + skeleton components to simulate fetch latency. Remove or gate behind real loading flags when APIs exist.

### Styling conventions

- Global tokens/utilities: `src/index.css` and `src/design-system/tokens.css`
- Meetings/Action Items specific: `src/components/meetings/workspace/meetingsWorkspace.css` (`mw-*` classes) — prefer this for any new work on those two pages
- Everything else: Tailwind utility classes directly in JSX

### TypeScript

Strict unused locals/parameters enabled. Shared types live in `src/types/`. No `any` in the codebase.

### Commands

```bash
npm run dev          # http://localhost:5173
npm run build        # production build (tsc -b && vite build)
npm run lint         # oxlint
npm run preview      # preview a production build locally
```
