import { Calendar, Check, Clock, MapPin, Repeat2, Video, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { CalendarEvent } from '../../types/calendar'
import { TODAY, MOCK_NOW_TIME } from '../../data/constants'
import { formatSelectedDayLabel } from '../../utils/calendar'
import { formatEventTimeRange, getPlatformLabel } from '../../utils/calendarSchedule'
import { parseMeetingTime } from '../../utils/helpers'
import { Avatar } from '../ui/Avatar'
import { Toggle } from '../ui/Toggle'
import { getBlockLabel, getCategoryTheme, isCalendarBlock } from './categoryTheme'

interface EventSheetProps {
  event: CalendarEvent | null
  onClose: () => void
}

function isUpcoming(event: CalendarEvent): boolean {
  if (event.date > TODAY) return true
  if (event.date < TODAY) return false
  return parseMeetingTime(event.time) >= parseMeetingTime(MOCK_NOW_TIME)
}

function buildPrepChecklist(event: CalendarEvent): string[] {
  const items: string[] = []
  if (event.importance === 'high') {
    items.push(`Review materials for ${event.title}`)
    items.push('Confirm attendee list and dial-in')
  }
  if (event.category === 'board' || event.category === 'sales' || event.category === 'leadership') items.push('Prepare talking points and deck')
  if (event.category === 'review' || event.category === 'engineering') items.push('Scan decisions, blockers, and open risks')
  if (event.location?.toLowerCase().includes('board')) items.push('Arrive 10 minutes early for room setup')
  if (event.platform === 'GOOGLE') items.push('Confirm Google Meet link and audio')
  items.push('Download offline copies of shared docs')
  return Array.from(new Set(items)).slice(0, 5)
}

export function EventSheet({ event, onClose }: EventSheetProps) {
  const [autoJoin, setAutoJoin] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const prepItems = useMemo(() => (event && !isCalendarBlock(event.blockType) ? buildPrepChecklist(event) : []), [event])
  const completed = prepItems.filter((item) => checkedItems[`${event?.id}:${item}`]).length

  useEffect(() => {
    function handleKeyDown(keyboardEvent: KeyboardEvent) {
      if (keyboardEvent.key === 'Escape') onClose()
    }
    if (event) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [event, onClose])

  useEffect(() => setAutoJoin(false), [event?.id])

  if (!event) return null

  const theme = getCategoryTheme(event.category)
  const block = isCalendarBlock(event.blockType)
  const canJoin = !block && isUpcoming(event)
  const visibleAttendees = event.attendees.slice(0, 8)
  const attendeeOverflow = Math.max(event.attendees.length - visibleAttendees.length, 0)

  return (
    <>
      <button type="button" aria-label="Close event details" className="fixed inset-x-0 top-[4.25rem] bottom-0 z-40 cursor-default bg-neutral-text/20" onClick={onClose} />
      <aside role="dialog" aria-modal="true" aria-labelledby="event-sheet-title" className="reveal-scale fixed right-0 top-[4.25rem] bottom-0 z-50 w-full max-w-md overflow-y-auto border-l border-neutral-border bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-[22px] py-[18px]">
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-2 rounded-full px-[11px] py-1 text-micro font-bold ${theme.wash} ${theme.text}`}>
              <span className={`h-2 w-2 rounded-full ${theme.dot}`} aria-hidden />
              {theme.label}
            </span>
            <span className="rounded-full bg-status-warningMuted px-[11px] py-1 text-micro font-bold text-status-warning">{event.importance ?? 'normal'} importance</span>
          </div>
          <button type="button" onClick={onClose} className="focus-ring inline-flex h-[42px] w-[42px] items-center justify-center rounded-[12px] border border-neutral-border bg-surface text-neutral-muted transition-colors hover:border-brand-teal hover:text-brand-teal" aria-label="Close details">
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="space-y-7 px-[22px] py-[22px]">
          <section>
            <p className="kicker">Event details</p>
            <h2 id="event-sheet-title" className="mt-1.5 text-heading-md font-extrabold tracking-[-0.01em] text-neutral-text">{event.title}</h2>
            <div className="mt-5 space-y-3 text-caption text-neutral-muted">
              <p className="flex items-center gap-3"><Calendar className="h-4 w-4" strokeWidth={1.75} />{formatSelectedDayLabel(event.date)}</p>
              <p className="flex items-center gap-3"><Clock className="h-4 w-4" strokeWidth={1.75} /><span className="font-mono tabular-nums">{formatEventTimeRange(event)} - {event.durationMinutes} minutes</span></p>
              <p className="flex items-center gap-3"><MapPin className="h-4 w-4" strokeWidth={1.75} />{event.location ?? getPlatformLabel(event)}</p>
              {event.isRecurring && <p className="flex items-center gap-3"><Repeat2 className="h-4 w-4" strokeWidth={1.75} />Recurring meeting</p>}
            </div>
          </section>

          {block ? (
            <section className="rounded-lg border border-dashed border-neutral-border bg-[#F3F3EA] p-[22px]">
              <p className="text-body-lg font-bold text-neutral-text">{getBlockLabel(event.blockType)}</p>
              <p className="mt-2 text-caption leading-relaxed text-neutral-muted">Protected calendar time for recovery and focus. Notifications stay quiet unless a critical meeting is added.</p>
            </section>
          ) : (
            <>
              <section>
                <h3 className="text-card-title font-extrabold tracking-[-0.01em] text-neutral-text">Attendees</h3>
                <div className="mt-3 space-y-3">
                  {visibleAttendees.map((attendee) => (
                    <div key={attendee.email ?? attendee.name} className="flex items-center gap-3 rounded-[12px] border-t border-[var(--border-subtle)] px-[22px] py-[13px] transition-colors hover:bg-[#F3F3EA]">
                      <Avatar name={attendee.name} email={attendee.email} size="md" />
                      <div className="min-w-0">
                        <p className="truncate text-body-lg font-bold text-neutral-text">{attendee.name}</p>
                        {attendee.email && <p className="truncate text-small text-neutral-muted">{attendee.email}</p>}
                      </div>
                    </div>
                  ))}
                  {attendeeOverflow > 0 && <p className="text-small text-neutral-muted">+{attendeeOverflow} more attendees</p>}
                </div>
              </section>

              {canJoin && (
                <button type="button" className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-[12px] border border-brand-teal bg-brand-teal px-5 py-[11px] text-body font-bold text-neutral-inverse transition-all duration-200 hover:bg-brand-tealHover">
                  <Video className="h-5 w-5" strokeWidth={1.75} />
                  Join meeting
                </button>
              )}

              {event.platform === 'GOOGLE' && canJoin && (
                <div className="rounded-lg border border-neutral-border bg-surface p-[22px]">
                  <Toggle checked={autoJoin} onChange={setAutoJoin} label="Auto-join when meeting starts" size="md" />
                </div>
              )}

              <section>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-card-title font-extrabold tracking-[-0.01em] text-neutral-text">Preparation checklist</h3>
                  <span className="text-small font-medium text-neutral-muted">{completed} of {prepItems.length} done</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[#F3F3EA]"><div className="h-full rounded-full bg-brand-teal transition-all" style={{ width: `${prepItems.length === 0 ? 0 : (completed / prepItems.length) * 100}%` }} /></div>
                <ul className="mt-4 space-y-3">
                  {prepItems.map((item) => {
                    const key = `${event.id}:${item}`
                    const checked = Boolean(checkedItems[key])
                    return (
                      <li key={item}>
                        <label className="focus-within:focus-ring flex cursor-pointer items-start gap-3 rounded-[12px] border-t border-[var(--border-subtle)] px-[22px] py-[13px] text-caption text-neutral-text transition-colors hover:bg-[#F3F3EA]">
                          <input type="checkbox" checked={checked} onChange={() => setCheckedItems((current) => ({ ...current, [key]: !checked }))} className="sr-only" />
                          <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checked ? 'border-brand-teal bg-brand-teal text-neutral-inverse' : 'border-neutral-border bg-surface'}`}>{checked && <Check className="h-3.5 w-3.5" strokeWidth={2} />}</span>
                          <span>{item}</span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </section>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
