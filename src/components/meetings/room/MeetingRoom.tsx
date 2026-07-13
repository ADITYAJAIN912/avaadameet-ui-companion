import { ArrowLeft, CalendarDays, Check, Clock, Download, Mail, Share2, Users, Video } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { MeetingContext } from '../../../types/meetingContext'
import { formatDisplayDate } from '../../../utils/helpers'
import { ActionsTab } from './ActionsTab'
import { DecisionsTab } from './DecisionsTab'
import { OverviewTab } from './OverviewTab'
import { PeopleFilesTab } from './PeopleFilesTab'
import { RoomTabs, type RoomTab } from './RoomTabs'
import { TimelineTab } from './TimelineTab'
import { EmptyState } from '../../ui/EmptyState'

interface MeetingRoomProps {
  context: MeetingContext | null
  onBack: () => void
  onSelectMeeting: (meetingId: string) => void
}

const statusLabel: Record<MeetingContext['status'], string> = {
  completed: 'Summary ready',
  scheduled: 'Scheduled',
  upcoming: 'Upcoming',
  live: 'Live',
}

const statusClass: Record<MeetingContext['status'], string> = {
  completed: 'bg-surface-accent text-brand-teal',
  scheduled: 'bg-[#E8F5EC] text-[#2A7A4A]',
  upcoming: 'bg-status-warningMuted text-status-warning',
  live: 'bg-[#E8F5EC] text-[#2A7A4A]',
}

function TabPanel({ tab, context, onSelectMeeting }: { tab: RoomTab; context: MeetingContext; onSelectMeeting: (meetingId: string) => void }) {
  const isFuture = context.status === 'upcoming' || context.status === 'scheduled'
  if (isFuture && tab !== 'overview') {
    return (
      <EmptyState
        icon={CalendarDays}
        title="Available after the meeting"
        description="The AI review, decisions, actions, and knowledge graph unlock once the session has been captured."
        className="card-surface"
      />
    )
  }

  if (tab === 'overview') return <OverviewTab context={context} onSelectMeeting={onSelectMeeting} />
  if (tab === 'decisions') return <DecisionsTab context={context} />
  if (tab === 'actions') return <ActionsTab context={context} />
  if (tab === 'timeline') return <TimelineTab context={context} />
  return <PeopleFilesTab context={context} />
}

export function MeetingRoom({ context, onBack, onSelectMeeting }: MeetingRoomProps) {
  const [tab, setTab] = useState<RoomTab>('overview')
  const [approved, setApproved] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTab('overview')
    setApproved(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [context?.id])

  if (!context) {
    return (
      <main className="flex w-full items-center justify-center bg-surface-canvas py-24">
        <EmptyState icon={CalendarDays} title="Meeting not found" description="Return to the library and choose another meeting." />
      </main>
    )
  }

  const isLive = context.status === 'live'
  const isCompleted = context.status === 'completed'

  return (
    <main className="flex flex-1 min-h-0 overflow-y-auto w-full flex-col text-neutral-text pb-8">

      {/* ── Hero Header ── */}
      <header
        className={`relative shrink-0 overflow-hidden rounded-xl border p-6 ${
          isLive
            ? 'border-[var(--surface-ink)] bg-[var(--surface-ink)] text-[var(--text-on-ink)]'
            : 'card-surface'
        }`}
      >
        {isLive && (
          <span className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full border-[32px] border-[rgba(239,238,231,0.07)]" aria-hidden />
        )}

        {/* Back nav */}
        <button
          type="button"
          onClick={onBack}
          className={`relative z-10 mb-5 -ml-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-small font-semibold transition-colors duration-150 focus-ring ${
            isLive
              ? 'text-[var(--text-on-ink-muted)] hover:text-[var(--text-on-ink)]'
              : 'text-neutral-muted hover:text-neutral-text hover:bg-[#F3F3EA]'
          }`}
          aria-label="Back to all meetings"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          All meetings
        </button>

        {/* Title block */}
        <div className="relative z-10 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="reveal reveal-1 min-w-0 max-w-4xl">
            {/* Status + platform badges */}
            <div className="flex flex-wrap items-center gap-2">
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#A7C6AF]">
                  <span className="pulse-live h-[7px] w-[7px] rounded-full bg-[#8FD1A5]" aria-hidden />
                  {statusLabel[context.status]}
                </span>
              ) : (
                <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusClass[context.status]}`}>
                  {statusLabel[context.status]}
                </span>
              )}
              {isCompleted && (
                <button
                  type="button"
                  className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-neutral-border bg-surface px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-muted hover:border-brand-teal hover:text-brand-teal transition-colors"
                  aria-label="Download as PDF"
                >
                  <Download className="h-3 w-3" strokeWidth={2} aria-hidden />
                  PDF
                </button>
              )}
              <span className={`rounded-full border px-3 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide ${isLive ? 'border-[rgba(239,238,231,0.2)] text-[var(--text-on-ink-muted)]' : 'border-neutral-border text-neutral-muted'}`}>
                {context.platform}
              </span>
            </div>

            {/* Title */}
            <h1 className={`mt-3 text-display-sm font-extrabold leading-tight tracking-[-0.02em] ${isLive ? 'text-[var(--text-on-ink)]' : 'text-neutral-text'}`}>
              {context.title}
            </h1>

            {/* Meta row */}
            <div className={`mt-2 flex flex-wrap items-center gap-3 text-small font-medium tabular-nums ${isLive ? 'text-[var(--text-on-ink-muted)]' : 'text-neutral-muted'}`}>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                {formatDisplayDate(context.date)}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                {context.duration}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                {context.organizer}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="reveal reveal-2 flex flex-wrap items-center gap-2">
            {/* Primary CTA */}
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-teal px-5 py-2.5 text-body font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:bg-brand-tealHover hover:shadow-[var(--shadow-glow-accent)] focus-ring"
            >
              <Video className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              Join meeting
            </button>

            {isCompleted && (
              <button
                type="button"
                onClick={() => setApproved(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-border bg-surface px-5 py-2.5 text-body font-bold text-neutral-text transition-all duration-200 hover:border-brand-teal hover:text-brand-teal focus-ring"
              >
                {approved && <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />}
                {approved ? 'Approved' : 'Approve summary'}
              </button>
            )}

            {/* Secondary actions grouped */}
            <div className="flex items-center gap-1 rounded-lg border border-neutral-border bg-surface p-1">
              <button
                type="button"
                title="Share notes"
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-small font-semibold text-neutral-muted transition-colors hover:bg-[#F3F3EA] hover:text-neutral-text focus-ring"
              >
                <Share2 className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                Share
              </button>
              <div className="h-5 w-px bg-[var(--border-subtle)]" />
              <button
                type="button"
                title="Export brief"
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-small font-semibold text-neutral-muted transition-colors hover:bg-[#F3F3EA] hover:text-neutral-text focus-ring"
              >
                <Download className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                Export
              </button>
              <div className="h-5 w-px bg-[var(--border-subtle)]" />
              <button
                type="button"
                title="Generate email"
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-small font-semibold text-neutral-muted transition-colors hover:bg-[#F3F3EA] hover:text-neutral-text focus-ring"
              >
                <Mail className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                Email
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Tab bar ── */}
      <div className="mt-5 shrink-0">
        <RoomTabs value={tab} onChange={setTab} />
      </div>

      {/* ── Tab content ── */}
      <div ref={scrollRef} className="py-6 shrink-0">
        <section
          key={tab}
          role="tabpanel"
          id={`room-panel-${tab}`}
          aria-labelledby={`room-tab-${tab}`}
          className="reveal"
        >
          <TabPanel tab={tab} context={context} onSelectMeeting={onSelectMeeting} />
        </section>
      </div>
    </main>
  )
}
