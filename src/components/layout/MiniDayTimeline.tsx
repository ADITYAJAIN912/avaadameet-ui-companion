import { useMemo } from 'react'
import { useMeetings } from '../../context/MeetingsContext'
import { TODAY } from '../../data/constants'
import { sortMeetingsChronologically } from '../../utils/meetings'

export function MiniDayTimeline() {
  const { meetings } = useMeetings()

  const todayMeetings = useMemo(
    () =>
      meetings
        .filter((m) => m.date === TODAY)
        .sort(sortMeetingsChronologically),
    [meetings],
  )

  const completedCount = todayMeetings.filter((m) => m.status === 'Completed').length
  const remaining = todayMeetings.length - completedCount

  return (
    <aside className="hidden w-[260px] shrink-0 xl:flex flex-col py-4 pl-4 pr-0">
      <div className="flex flex-col flex-1 min-h-0 rounded-xl border border-neutral-border bg-surface shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-3 pt-3 pb-2.5 border-b border-neutral-border shrink-0">
          <p className="text-micro font-semibold uppercase tracking-widest text-neutral-muted">Today</p>
          <p className="mt-0.5 text-[13px] font-semibold text-neutral-text">
            {remaining} left · {completedCount} done
          </p>
        </div>

        {/* Meeting list */}
        <ul className="flex-1 overflow-y-auto py-1.5 min-h-0">
          {todayMeetings.length === 0 && (
            <li className="px-3 py-3 text-[11px] text-neutral-muted">No meetings today</li>
          )}
          {todayMeetings.map((meeting) => {
            const isDone = meeting.status === 'Completed'
            return (
              <li
                key={meeting.id}
                className={`flex flex-col gap-0.5 px-3 py-2 border-b border-neutral-border/50 last:border-0 ${isDone ? 'opacity-40' : ''}`}
              >
                {/* Time */}
                <span className="text-[10px] font-medium text-neutral-muted tabular-nums">
                  {meeting.time}
                </span>
                {/* Title */}
                <span className={`text-[11.5px] leading-tight text-neutral-text truncate ${isDone ? 'line-through' : ''}`}>
                  {meeting.title}
                </span>
              </li>
            )
          })}
        </ul>

      </div>
    </aside>
  )
}
