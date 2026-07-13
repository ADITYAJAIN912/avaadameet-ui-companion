import { CalendarDays, Download, Users } from 'lucide-react'
import type { Meeting } from '../../../types/meeting'
import { TODAY } from '../../../data/constants'
import { formatDisplayDate, getDayGroup } from '../../../utils/helpers'
import type { DateFilter } from '../FilterChips'
import { SearchInput } from '../../ui/SearchInput'
import { EmptyState } from '../../ui/EmptyState'

interface MeetingLibraryProps {
  meetings: Meeting[]
  search: string
  onSearchChange: (value: string) => void
  dateFilter: DateFilter
  onDateFilterChange: (value: DateFilter) => void
  customDate: string
  onCustomDateChange: (value: string) => void
  onSelectMeeting: (meetingId: string) => void
}

const filters: { value: DateFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'this-week', label: 'This week' },
  { value: 'custom', label: 'Pick date' },
]

function groupHeading(date: string): string {
  const group = getDayGroup(date)
  if (group === 'This Week') return formatDisplayDate(date)
  return group ?? formatDisplayDate(date)
}

type StatusStyle = {
  accent: string
  badge: string
  badgeText: string
  label: string
}

function getStatusStyle(meeting: Meeting): StatusStyle {
  if (meeting.status === 'Completed') {
    return {
      accent: 'bg-brand-teal',
      badge: 'bg-surface-accent text-brand-teal',
      badgeText: 'bg-surface-accent',
      label: 'Summary ready',
    }
  }
  if (meeting.status === 'Scheduled') {
    return {
      accent: 'bg-[#8FD1A5]',
      badge: 'bg-[#E8F5EC] text-[#2A7A4A]',
      badgeText: 'bg-[#E8F5EC]',
      label: 'Live now',
    }
  }
  return {
    accent: 'bg-status-warning',
    badge: 'bg-status-warningMuted text-status-warning',
    badgeText: 'bg-status-warningMuted',
    label: 'Upcoming',
  }
}

export function MeetingLibrary({
  meetings,
  search,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  customDate,
  onCustomDateChange,
  onSelectMeeting,
}: MeetingLibraryProps) {
  const groups = meetings.reduce<Array<{ heading: string; items: Meeting[] }>>((acc, meeting) => {
    const heading = groupHeading(meeting.date)
    const current = acc.find((group) => group.heading === heading)
    if (current) current.items.push(meeting)
    else acc.push({ heading, items: [meeting] })
    return acc
  }, [])

  const formattedCount = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(meetings.length)

  return (
    <main className="flex h-full min-h-0 w-full flex-col text-neutral-text">
      {/* ── Header ── */}
      <header className="shrink-0 pb-6">
        <div className="reveal flex flex-col gap-1">
          <p className="kicker">Meetings</p>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-display-md font-extrabold tracking-tight text-neutral-text">Meeting library</h1>
            <span className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-neutral-muted tabular-nums">
              {formattedCount} meetings
            </span>
          </div>
        </div>

        {/* Controls bar — search grows, filters sit flush right */}
        <div className="reveal reveal-1 mt-5 flex w-full items-center gap-3">
          <div className="min-w-0 flex-1">
            <SearchInput
              value={search}
              onChange={onSearchChange}
              placeholder="Search by title or host"
              className="w-full"
            />
          </div>

          {/* Date filters */}
          <div
            role="group"
            aria-label="Filter meetings by date"
            className="flex shrink-0 gap-1 overflow-x-auto rounded-full border border-neutral-border bg-surface p-1"
          >
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => onDateFilterChange(filter.value)}
                aria-pressed={dateFilter === filter.value}
                className={`focus-ring shrink-0 rounded-full px-4 py-1.5 text-body font-semibold transition-all duration-200 ${
                  dateFilter === filter.value
                    ? 'bg-brand-teal text-neutral-inverse shadow-sm'
                    : 'text-neutral-muted hover:text-neutral-text'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {dateFilter === 'custom' && (
            <input
              type="date"
              aria-label="Pick meeting date"
              value={customDate}
              onChange={(e) => onCustomDateChange(e.target.value)}
              className="focus-ring shrink-0 rounded-full border border-neutral-border bg-surface px-4 py-2 font-mono text-small text-neutral-text tabular-nums transition-all duration-200 hover:border-brand-teal"
            />
          )}
        </div>
      </header>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto pb-8">
        {meetings.length === 0 ? (
          <div className="reveal flex items-center justify-center py-16">
            <EmptyState
              icon={CalendarDays}
              title="No meetings found"
              description="Try another date range or search term. Your meeting room will open here when a match appears."
              className="card-surface"
            />
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map((group, groupIndex) => (
              <section
                key={group.heading}
                aria-labelledby={`meeting-group-${group.heading}`}
                className={`reveal reveal-${Math.min(groupIndex + 2, 6)}`}
              >
                {/* Group heading */}
                <div className="mb-3 flex items-center gap-3">
                  <h2
                    id={`meeting-group-${group.heading}`}
                    className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-muted"
                  >
                    {group.heading}
                  </h2>
                  <div className="h-px flex-1 bg-[var(--border-subtle)]" />
                  <span className="font-mono text-[10px] text-neutral-muted/60">
                    {group.items.length} {group.items.length === 1 ? 'meeting' : 'meetings'}
                  </span>
                </div>

                {/* Meeting cards */}
                <div className="space-y-2">
                  {group.items.map((meeting) => {
                    const style = getStatusStyle(meeting)
                    const isLive = meeting.status === 'Scheduled'

                    if (isLive) {
                      return (
                        <button
                          key={meeting.id}
                          type="button"
                          onClick={() => onSelectMeeting(meeting.id)}
                          className="focus-ring group relative flex w-full overflow-hidden rounded-xl border border-[var(--surface-ink)] bg-[var(--surface-ink)] p-5 text-left text-[var(--text-on-ink)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-lg"
                        >
                          {/* Decorative ring */}
                          <span className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full border-[32px] border-[rgba(239,238,231,0.07)]" aria-hidden />

                          <div className="relative z-10 flex w-full flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#A7C6AF]">
                                <span className="pulse-live h-[7px] w-[7px] rounded-full bg-[#8FD1A5]" aria-hidden />
                                Live · {meeting.time}
                              </span>
                            </div>
                            <span className="text-display-sm font-extrabold tracking-[-0.02em] leading-tight">
                              {meeting.title}
                            </span>
                            <span className="flex items-center gap-3 text-body font-medium text-[var(--text-on-ink-muted)]">
                              <span className="flex items-center gap-1.5">
                                <Users className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                                {meeting.attendees.length} attendees
                              </span>
                              <span>·</span>
                              <span>{meeting.source}</span>
                            </span>
                          </div>
                        </button>
                      )
                    }

                    return (
                      <button
                        key={meeting.id}
                        type="button"
                        onClick={() => onSelectMeeting(meeting.id)}
                        className="focus-ring group flex w-full items-stretch overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-surface text-left transition-all duration-200 hover:-translate-y-[1px] hover:border-neutral-border hover:shadow-md"
                      >
                        {/* Status accent stripe */}
                        <div className={`w-1 shrink-0 rounded-l-xl ${style.accent}`} />

                        {/* Content */}
                        <div className="flex flex-1 items-center gap-4 px-5 py-4">
                          {/* Time badge */}
                          <div className="shrink-0 text-center">
                            <div className="font-mono text-[11px] font-bold tabular-nums text-neutral-muted">
                              {meeting.date === TODAY
                                ? meeting.time
                                : formatDisplayDate(meeting.date)}
                            </div>
                            {meeting.date !== TODAY && (
                              <div className="mt-0.5 font-mono text-[10px] tabular-nums text-neutral-muted/60">
                                {meeting.time}
                              </div>
                            )}
                          </div>

                          {/* Divider */}
                          <div className="h-8 w-px shrink-0 bg-[var(--border-subtle)]" />

                          {/* Title + meta */}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-body-lg font-bold text-neutral-text transition-colors group-hover:text-brand-teal">
                              {meeting.title}
                            </p>
                            <p className="mt-0.5 flex items-center gap-2 truncate text-small font-medium text-neutral-muted">
                              <span>{meeting.host}</span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" strokeWidth={1.8} aria-hidden />
                                {meeting.attendees.length}
                              </span>
                              <span>·</span>
                              <span>{meeting.source}</span>
                            </p>
                          </div>

                          {/* Right actions */}
                          <div className="ml-auto flex shrink-0 items-center gap-2">
                            {meeting.status === 'Completed' && (
                              <button
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-muted transition-colors hover:bg-neutral-muted/10 hover:text-brand-teal"
                                title="Download as PDF"
                                aria-label="Download as PDF"
                              >
                                <Download className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                              </button>
                            )}
                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${style.badge}`}
                            >
                              {style.label}
                            </span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
