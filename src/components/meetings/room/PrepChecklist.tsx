import { Check } from 'lucide-react'
import { useState } from 'react'
import type { MeetingContext } from '../../../types/meetingContext'
import { Avatar } from '../../ui/Avatar'

interface PrepChecklistProps {
  context: MeetingContext
}

function buildChecklist(context: MeetingContext): string[] {
  const items = [
    `Share agenda with ${context.attendees.length > 1 ? 'attendees' : context.attendees[0]?.name ?? 'attendees'}`,
    'Confirm microphone and screen-share setup',
    'Review open action items from the last related meeting',
  ]
  if (context.linkedMeetings.length > 0) items.push(`Review notes from ${context.linkedMeetings[0].title}`)
  return items
}

export function PrepChecklist({ context }: PrepChecklistProps) {
  const items = buildChecklist(context)
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const done = checked.size
  const pct = items.length === 0 ? 0 : Math.round((done / items.length) * 100)

  function toggle(index: number) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <div className="space-y-8">
      <section className="card-surface reveal p-[22px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="kicker">Prep checklist</p>
            <h2 className="mt-2 text-card-title font-extrabold tracking-[-0.01em] text-neutral-text">Before the room opens</h2>
          </div>
          <p className="font-mono text-caption font-medium text-neutral-muted tabular-nums">{done} of {items.length} done · {pct}%</p>
        </div>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-surface-accent" aria-hidden>
          <div className="h-full rounded-full bg-brand-teal transition-all duration-slow ease-out" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-5 space-y-3">
          {items.map((label, index) => {
            const isChecked = checked.has(index)
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggle(index)}
                className={`card-surface-interactive focus-ring group flex min-h-12 w-full items-center gap-3 px-[22px] py-[13px] text-left hover:bg-[#F3F3EA] reveal reveal-${Math.min(index + 1, 6)}`}
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${isChecked ? 'border-brand-teal bg-brand-teal text-neutral-inverse' : 'border-neutral-border bg-surface text-transparent'}`}>
                  <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                </span>
                <span className="text-body text-neutral-text">{label}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="card-surface reveal reveal-1 p-[22px]">
        <p className="kicker text-neutral-muted">Attendees</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {context.attendees.map((attendee) => (
            <div key={attendee.email ?? attendee.name} className="card-surface-interactive flex items-center gap-3 p-3">
              <Avatar name={attendee.name} email={attendee.email} size="md" />
              <div className="min-w-0">
                <p className="truncate text-body font-semibold text-neutral-text">{attendee.name}</p>
                {attendee.email ? <p className="truncate text-small text-neutral-muted">{attendee.email}</p> : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
