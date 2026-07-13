import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { useActionItems } from '../context/ActionItemsContext'
import { useDashboardInsights } from '../context/DashboardInsightsContext'
import { useMeetings } from '../context/MeetingsContext'
import { TODAY, MOCK_NOW_TIME, USER_NAME } from '../data/constants'
import { usePageLoading } from '../hooks/usePageLoading'
import type { Meeting } from '../types/meeting'
import { getInitials, parseMeetingTime } from '../utils/helpers'
import { getDisplayAttendees } from '../utils/meetingDisplay'
import { getMeetingDurationMinutes, getPlatformLabel } from '../utils/meetingMeta'
import { sortMeetingsChronologically } from '../utils/meetings'

function isInProgress(meeting: Meeting): boolean {
  if (meeting.date !== TODAY || meeting.status === 'Completed') return false
  const start = parseMeetingTime(meeting.time)
  const end = start + getMeetingDurationMinutes(meeting)
  const now = parseMeetingTime(MOCK_NOW_TIME)
  return start <= now && now < end
}

function formatEndTime(meeting: Meeting): string {
  const end = parseMeetingTime(meeting.time) + getMeetingDurationMinutes(meeting)
  const hours = Math.floor(end / 60) % 24
  const minutes = end % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function untilLabel(meeting: Meeting): string {
  if (isInProgress(meeting)) return 'happening now'
  if (meeting.date !== TODAY) return 'upcoming'
  const diff = parseMeetingTime(meeting.time) - parseMeetingTime(MOCK_NOW_TIME)
  if (diff <= 0) return 'ready when you are'
  if (diff < 60) return `in ${diff} min`
  const hours = Math.floor(diff / 60)
  const minutes = diff % 60
  return minutes > 0 ? `in ${hours}h ${minutes}m` : `in ${hours}h`
}

function scheduleChip(meeting: Meeting): { label: string; className: string } {
  if (meeting.status === 'Completed') return { label: 'Done', className: 'bg-surface-accent text-brand-teal' }
  if (isInProgress(meeting)) return { label: 'Now', className: 'bg-surface-accent text-brand-teal' }
  return { label: 'Upcoming', className: 'bg-status-warningMuted text-status-warning' }
}

function actionChip(item: { date: string }): { label: string; className: string } {
  if (item.date < TODAY) {
    const days = Math.max(1, Math.round((new Date(`${TODAY}T00:00:00`).getTime() - new Date(`${item.date}T00:00:00`).getTime()) / 86400000))
    return { label: `${days}d late`, className: 'bg-coral-muted text-coral' }
  }
  if (item.date === TODAY) return { label: 'Today', className: 'bg-status-warningMuted text-status-warning' }
  return { label: 'Ahead', className: 'bg-surface-accent text-brand-teal' }
}

export function Home() {
  const isLoading = usePageLoading(400)
  const { meetings, upcomingForHome } = useMeetings()
  const { openActionStats, topOpenActionItems } = useActionItems()
  const { insights } = useDashboardInsights()

  const firstName = USER_NAME.split(' ')[0]

  const todayMeetings = useMemo(
    () => meetings.filter((meeting) => meeting.date === TODAY).sort(sortMeetingsChronologically),
    [meetings],
  )

  const nextMeeting = useMemo(() => {
    return meetings.find(isInProgress) ?? upcomingForHome[0]
  }, [meetings, upcomingForHome])

  const dueActions = useMemo(() => topOpenActionItems(3), [topOpenActionItems])

  const longestFreeSlot = useMemo(() => {
    return insights.find((insight) => insight.id === 'slot' || insight.label.toLowerCase().includes('longest'))?.value
  }, [insights])

  const kickDate = new Date(`${TODAY}T00:00:00`)
    .toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
    .toUpperCase()
    .replace(',', ' ·')

  if (isLoading) {
    return <LoadingScreen message="Curating your day..." />
  }

  const attendees = nextMeeting ? getDisplayAttendees(nextMeeting) : []

  return (
    <div className="flex h-full w-full flex-col min-h-0">
      {/* Greet row */}
      <div className="reveal reveal-1 mb-5 flex shrink-0 items-end justify-between gap-4">
        <div>
          <p className="kicker">{kickDate}</p>
          <h1 className="mt-1.5 text-display-md font-extrabold tracking-tight text-neutral-text">
            Good morning, {firstName}
          </h1>
        </div>
        <Link
          to="/calendar"
          className="focus-ring rounded-[12px] border border-neutral-border bg-surface px-5 py-[11px] text-body font-bold text-neutral-text transition-all duration-200 hover:border-brand-teal hover:text-brand-teal"
        >
          + New meeting
        </Link>
      </div>

      {/* Bento grid */}
      <div className="grid flex-1 min-h-0 grid-cols-1 gap-3.5 overflow-y-auto lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr_1fr_1fr] lg:overflow-hidden pb-4 lg:pb-0">
        {/* Hero tile — dark green */}
        <section className="reveal reveal-2 relative flex flex-col justify-between overflow-hidden rounded-lg border border-[var(--surface-ink)] bg-[var(--surface-ink)] p-[22px] text-[var(--text-on-ink)] transition-all duration-200 ease-out hover:-translate-y-[3px] hover:shadow-lg lg:col-span-8 lg:row-span-2">
          <span className="pointer-events-none absolute -right-[70px] -top-[70px] h-[260px] w-[260px] rounded-full border-[36px] border-[rgba(239,238,231,0.06)]" aria-hidden />
          <div>
            <p className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#A7C6AF]">
              <span className="pulse-live h-[7px] w-[7px] rounded-full bg-[#8FD1A5]" aria-hidden />
              Up next · {nextMeeting ? untilLabel(nextMeeting) : 'schedule clear'}
            </p>
            <h2 className="mb-1 mt-2.5 text-display-sm font-extrabold tracking-[-0.02em]">
              {nextMeeting ? nextMeeting.title : 'Your schedule is clear'}
            </h2>
            <p className="text-body font-medium text-[var(--text-on-ink-muted)]">
              {nextMeeting
                ? `${nextMeeting.time} – ${formatEndTime(nextMeeting)} · ${getPlatformLabel(nextMeeting.source)} · Prep notes ready`
                : 'A rare open stretch. Use it for focused work or planning the next priority.'}
            </p>
          </div>
          <div className="relative z-raised mt-5 flex items-center justify-between gap-4">
            <div className="flex" aria-label={`${attendees.length} attendees`}>
              {attendees.slice(0, 3).map((attendee, index) => (
                <span
                  key={`${attendee.email ?? attendee.name}-${index}`}
                  className={`flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-[var(--surface-ink)] bg-brand-teal text-[10px] font-bold text-white ${index > 0 ? '-ml-2' : ''}`}
                >
                  {getInitials(attendee.name)}
                </span>
              ))}
              {attendees.length > 3 && (
                <span className="-ml-2 flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-[var(--surface-ink)] bg-brand-teal text-[10px] font-bold text-white">
                  +{attendees.length - 3}
                </span>
              )}
            </div>
            <button
              type="button"
              className="focus-ring rounded-[12px] bg-surface-canvas px-5 py-[11px] text-body font-bold text-brand-teal transition-transform duration-200 hover:scale-105"
            >
              Join meeting →
            </button>
          </div>
        </section>

        {/* Stat tile — actions due */}
        <section className="reveal reveal-3 card-surface-interactive flex flex-col justify-between p-4 lg:col-span-4 lg:row-span-1">
          <div className="flex items-center justify-between text-caption font-semibold text-neutral-muted">
            Actions due
            <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-surface-accent text-[12px] text-brand-teal">☑</span>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <p className="text-[2rem] font-extrabold leading-none tracking-[-0.04em] text-neutral-text tabular-nums">
              {openActionStats.dueToday + openActionStats.overdue}
            </p>
            <p className={`text-small font-bold ${openActionStats.overdue > 0 ? 'text-coral' : 'text-neutral-muted'}`}>
              {openActionStats.overdue > 0 ? `${openActionStats.overdue} overdue` : 'All clear'}
            </p>
          </div>
        </section>

        {/* Stat tile — focus left */}
        <section className="reveal reveal-4 card-surface-interactive flex flex-col justify-between p-4 lg:col-span-4 lg:row-span-1">
          <div className="flex items-center justify-between text-caption font-semibold text-neutral-muted">
            Focus left
            <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-surface-accent text-[12px] text-brand-teal">◔</span>
          </div>
          <div className="mt-2">
            <p className="text-[1.35rem] font-extrabold leading-tight tracking-[-0.03em] text-neutral-text tabular-nums">
              {longestFreeSlot ?? '—'}
            </p>
            <p className="mt-0.5 text-small font-bold text-brand-teal">Longest free slot today</p>
          </div>
        </section>

        {/* Schedule tile */}
        <section className="reveal reveal-5 card-surface flex flex-col overflow-hidden p-0 lg:col-span-7 lg:row-span-3">
          <div className="flex shrink-0 items-center justify-between px-[22px] pb-3 pt-[18px]">
            <h3 className="text-card-title font-extrabold tracking-[-0.01em] text-neutral-text">Today's schedule</h3>
            <Link to="/calendar" className="focus-ring text-caption font-bold text-brand-teal hover:underline">
              Open calendar
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            {todayMeetings.length === 0 ? (
              <p className="border-t border-[var(--border-subtle)] px-[22px] py-6 text-body text-neutral-muted">
                No meetings today. Your calendar is open.
              </p>
            ) : (
              todayMeetings.map((meeting) => {
                const chip = scheduleChip(meeting)
                return (
                  <Link
                    key={meeting.id}
                    to="/meetings"
                    className="focus-ring flex cursor-pointer items-center gap-[15px] border-t border-[var(--border-subtle)] px-[22px] py-[13px] transition-colors duration-150 hover:bg-[#F3F3EA]"
                  >
                    <span className="min-w-[84px] font-mono text-[11.5px] text-neutral-muted tabular-nums">
                      {meeting.time}–{formatEndTime(meeting)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body-lg font-bold text-neutral-text">{meeting.title}</span>
                      <span className="mt-px block truncate text-small font-medium text-neutral-muted">
                        {getPlatformLabel(meeting.source)} · {meeting.attendees.length} people
                      </span>
                    </span>
                    <span className={`rounded-full px-[11px] py-1 text-micro font-bold ${chip.className}`}>{chip.label}</span>
                  </Link>
                )
              })
            )}
          </div>
        </section>

        {/* Actions tile */}
        <section className="reveal reveal-5 card-surface flex flex-col overflow-hidden p-0 lg:col-span-5 lg:row-span-2">
          <div className="flex shrink-0 items-center justify-between px-[22px] pb-3 pt-[18px]">
            <h3 className="text-card-title font-extrabold tracking-[-0.01em] text-neutral-text">Actions due</h3>
            <Link to="/action-items" className="focus-ring text-caption font-bold text-brand-teal hover:underline">
              See all
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            {dueActions.length === 0 ? (
              <p className="border-t border-[var(--border-subtle)] px-[22px] py-6 text-body text-neutral-muted">
                Nothing due. Enjoy the clear runway.
              </p>
            ) : (
              dueActions.map((item) => {
                const chip = actionChip(item)
                return (
                  <div key={item.id} className="flex items-center gap-3 border-t border-[var(--border-subtle)] px-[22px] py-3">
                    <span
                      className="h-[18px] w-[18px] shrink-0 cursor-pointer rounded-[6px] border-[1.5px] border-[var(--border-strong)] transition-all duration-150 hover:border-brand-teal hover:bg-surface-accent"
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 truncate text-body font-semibold text-neutral-text">{item.meetingTitle}</span>
                    <span className={`rounded-full px-[11px] py-1 text-micro font-bold ${chip.className}`}>{chip.label}</span>
                  </div>
                )
              })
            )}
          </div>
        </section>

        {/* AI Companion tile */}
        <section className="reveal reveal-6 rounded-lg border border-brand-teal/20 bg-brand-tealLight/50 p-[22px] transition-all duration-200 ease-out hover:-translate-y-[3px] hover:shadow-elevation-2 lg:col-span-5">
          <div className="mb-2.5 flex items-center gap-2.5">
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[10px] bg-brand-teal text-[14px] text-white shadow-[var(--shadow-glow-accent)]">✦</span>
            <span className="text-body-lg font-extrabold text-brand-navy">AI Companion</span>
          </div>
          <p className="text-[13px] font-medium leading-[1.6] text-neutral-text">
            {nextMeeting ? (
              <>
                Prep notes for <b className="font-bold text-brand-teal">{nextMeeting.title}</b> are ready.{' '}
              </>
            ) : null}
            {openActionStats.overdue > 0
              ? `${openActionStats.overdue} overdue action${openActionStats.overdue === 1 ? '' : 's'} — clear ${openActionStats.overdue === 1 ? 'it' : 'them'} before your next session.`
              : 'No overdue actions — you are on track for today.'}
          </p>
          <button
            type="button"
            className="focus-ring mt-[13px] rounded-[12px] border border-neutral-border bg-surface px-4 py-2 text-caption font-bold text-neutral-text transition-all duration-200 hover:border-brand-teal hover:text-brand-teal"
          >
            ▸ Play 60-sec brief
          </button>
        </section>
      </div>
    </div>
  )
}
