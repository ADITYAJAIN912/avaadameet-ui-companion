# AvaadaMeet AI Companion

High-fidelity frontend prototype for Avaada's internal meeting intelligence product. The UI is presentation-ready for PMs, designers, and engineers; all data is mocked locally with no backend, authentication, or live AI.

## Overview

AvaadaMeet surfaces meetings, action items, a calendar, and a global AI assistant in a compact enterprise layout: persistent left sidebar, top bar, and four primary routes. Meetings and Action Items use a shared three-column "workspace" layout (queue → detail → knowledge panel). State for meetings (including auto-join toggles) is held in React context so Home and Meetings stay in sync.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Routing | react-router-dom v7 |
| Styling | Tailwind CSS v4 + design tokens (`src/index.css`, `src/design-system/`) |
| Icons | lucide-react |

## Folder Structure

```
src/
├── components/
│   ├── ui/              # Reusable primitives (Button, Card, Toggle, SearchInput, …)
│   ├── layout/          # App shell (Sidebar, TopBar, MobileTabBar)
│   ├── home/            # Home-specific sections (Upcoming, Dashboard brief)
│   ├── meetings/        # Meetings workspace (queue, review, knowledge panel)
│   ├── calendar/        # Calendar views (month/week/day, mini calendar)
│   ├── workspace/       # Shared workspace primitives + AI copilot config builders
│   └── ai-copilot/      # Global "Ask Avaada AI" floating button + draggable dialog
├── context/             # MeetingsContext, LayoutContext, AiCopilotContext
├── data/                # Mock arrays + app constants
├── design-system/       # CSS tokens + component classes shared across pages
├── hooks/               # useCountUp, usePageLoading
├── pages/               # Route-level page components
├── types/               # Shared TypeScript interfaces
├── utils/               # Pure helpers (dates, meeting queries, metadata)
├── App.tsx
├── main.tsx
└── index.css            # Global styles + design token imports
```

## Project Architecture

```
main.tsx
  └── App.tsx
        ├── LayoutProvider              (sidebar collapse)
        ├── MeetingsProvider            (meetings + derived stats)
        ├── ActionItemsProvider         (simple action item list + stats)
        ├── ActionWorkspaceProvider     (action item workspace detail)
        ├── CalendarProvider            (calendar events)
        ├── DashboardInsightsProvider   (Home "Today's Brief" content)
        └── AiCopilotProvider           (global AI assistant state)
              └── AppLayout
                    ├── Sidebar / TopBar / MobileTabBar
                    ├── <Outlet />  → pages/*
                    ├── AiCopilotFab (floating trigger, every page)
                    └── AiCopilotDialog (draggable/resizable, every page)
```

Every page/component reads data through one of these contexts — never by importing `data/mock*.ts` directly. This is the integration seam: swapping mock data for a real API means editing the provider file, not the component tree. See `docs/HANDOFF.md` for the full breakdown of which context backs which screen.

**LayoutContext** controls sidebar collapse. **AiCopilotContext** tracks which meeting/action item context the AI assistant should open with, set by whichever workspace page currently has an item selected.

Mock time is anchored to `TODAY` and `MOCK_NOW_TIME` in `src/data/constants.ts`. All "upcoming", "past", and relative due-date logic reads from these constants.

## Meetings & Action Items Workspace

Both pages share a dedicated visual system under `src/components/meetings/workspace/meetingsWorkspace.css` (`mw-*` classes) — a three-column layout: an item queue (left), a review/detail panel (center), and a knowledge panel showing related context (right). See `docs/HANDOFF.md` for the full breakdown and a note on why this is a separate stylesheet from the older `design-system/workspace.css`.

## Global AI Assistant

A floating "Ask Avaada AI" button appears on every page (bottom-right). Opening it with no meeting/action item selected shows a picker to search and choose one, or ask a general question. The dialog is fully draggable (by its header) and resizable (all edges + corners), and does not block interaction with the rest of the app. All responses are canned mock data — see `src/components/workspace/copilot/`.

## Component Organization

| Category | Examples |
|----------|----------|
| **UI primitives** | `Button`, `Card`, `Toggle`, `SegmentedControl`, `SearchInput`, `EmptyState`, `StatCard`, `Avatar` |
| **Layout** | `AppLayout`, `Sidebar`, `TopBar`, `MobileTabBar` |
| **Workspace** | `AttentionQueue`, `KnowledgePanel`, `MeetingWorkspace` (Meetings); inline `mw-*` markup (Action Items) |
| **AI Assistant** | `AiCopilotFab`, `AiCopilotDialog`, `AiCopilotPicker` |

Feature-specific components live under `components/<feature>/`. Cross-cutting primitives live under `components/ui/`.

## Mock Data

| File | Contents |
|------|----------|
| `data/constants.ts` | `TODAY`, `MOCK_NOW_TIME`, `USER_NAME`, `USER_EMAIL` |
| `data/mockMeetings.ts` | Meeting records (re-exports types/constants) |
| `data/mockMeetingContexts.ts`, `mockMeetingReviewData.ts`, `mockDecisionIntelligence.ts` | AI review detail for Meetings workspace |
| `data/mockActionItems.ts` | Simple action item records (Home stats, sidebar badge) |
| `data/mockActionWorkspace.ts` | Full action item workspace detail |
| `data/mockCalendarEvents.ts`, `mockScheduleEvents.ts` | Calendar page events |
| `data/mockDashboardInsights.ts` | Home "Today's Brief" panel content |

Query helpers (`isMeetingUpcoming`, `getMeetingsThisWeekFrom`, etc.) live in `utils/meetings.ts`. Display metadata (duration, starts-in, artifacts) is derived in `utils/meetingMeta.ts`.

## Features Implemented

- **Home** — Welcome header, animated stat cards, upcoming meetings, "Today's Brief" AI insights panel
- **Meetings** — Search, date filters (Today / Tomorrow / This Week / Custom), attention queue grouped by urgency, AI review workspace with decision intelligence, prep checklist for upcoming meetings, knowledge panel
- **Action Items** — Search, status filters, action queue grouped by urgency, review detail with approval workflow, dependency/timeline tracking, knowledge panel
- **Calendar** — Month / week / day views, mini calendar, executive brief sidebar
- **AI Assistant** — Global floating button + draggable/resizable dialog, context-aware picker (mock responses only)
- **Responsive** — Sidebar collapses at tablet; bottom tab bar on mobile

## Responsive Behaviour

| Breakpoint | Behaviour |
|------------|-----------|
| `< 768px` | Bottom tab navigation; sidebar hidden |
| `768–1023px` | Collapsed sidebar (64px); icon badges |
| `≥ 1024px` | Full sidebar (~220px) |

## Known Limitations

- No real API, auth, WebSocket, or AI responses — everything is mock data
- "Emails Delivered" stat and some TopBar controls are static placeholders
- Search is client-side filtering only, not a real search backend

## Future Backend Integration Points

| Area | Suggested approach |
|------|-------------------|
| Meetings | Replace `mockMeetings` with `GET /meetings`; hydrate `MeetingsProvider` |
| Auto-join | `PATCH /meetings/:id/auto-join` + bulk endpoint for master toggle |
| Action items | `GET /action-items` with server-side status/priority |
| Stats | `GET /dashboard/stats` for home cards |
| AI Assistant | Real backend/LLM behind `POST /assistant/messages`, replacing the mock `buildResponse()` functions |
| Calendar | OAuth + `GET /calendar/events` |
| User | `GET /me` for TopBar profile and welcome name |

See `docs/HANDOFF.md` for full integration details, suggested endpoint shapes, and known CSS gotchas.

## How to Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # optional — serve production build
```

## Lint

```bash
npm run lint
```
