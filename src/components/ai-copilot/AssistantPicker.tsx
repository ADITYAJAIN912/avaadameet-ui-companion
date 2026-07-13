import { useMemo, useState } from 'react'
import { CheckSquare, Search, Sparkles, Video } from 'lucide-react'
import { sortMeetingsChronologically } from '../../utils/meetings'
import { resolveMeetingContext } from '../../utils/meetingContext'
import { createMeetingCopilotConfig } from '../workspace/copilot/meetingCopilot'
import { createActionCopilotConfig } from '../workspace/copilot/actionCopilot'
import { createGeneralCopilotConfig } from '../workspace/copilot/generalCopilot'
import { useAiCopilot } from '../../context/AiCopilotContext'
import { useMeetings } from '../../context/MeetingsContext'
import { useActionWorkspace } from '../../context/ActionWorkspaceContext'

const GROUP_LABELS: Record<string, string> = {
  'needs-attention': 'Needs attention',
  today: 'Today',
  'this-week': 'This week',
  completed: 'Completed',
}

interface PickerRowProps {
  icon: 'meeting' | 'action'
  title: string
  meta: string
  onPick: () => void
}

function PickerRow({ icon, title, meta, onPick }: PickerRowProps) {
  const Icon = icon === 'meeting' ? Video : CheckSquare
  return (
    <button
      type="button"
      onClick={onPick}
      className="focus-ring flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-[var(--interactive-hover)]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-tealLight text-brand-teal">
        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-body font-medium text-neutral-text">{title}</span>
        <span className="block truncate text-caption text-neutral-muted">{meta}</span>
      </span>
    </button>
  )
}

export function AssistantPicker() {
  const { selectConfig } = useAiCopilot()
  const { meetings: allMeetings } = useMeetings()
  const { actionWorkspaceItems } = useActionWorkspace()
  const [search, setSearch] = useState('')

  const meetings = useMemo(
    () => [...allMeetings].sort(sortMeetingsChronologically),
    [allMeetings],
  )
  const actionItems = actionWorkspaceItems

  const filteredMeetings = useMemo(() => {
    if (!search) return meetings.slice(0, 6)
    const q = search.toLowerCase()
    return meetings.filter(
      (m) => m.title.toLowerCase().includes(q) || m.host.toLowerCase().includes(q),
    )
  }, [meetings, search])

  const filteredActionItems = useMemo(() => {
    if (!search) return actionItems.slice(0, 6)
    const q = search.toLowerCase()
    return actionItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.owner.toLowerCase().includes(q),
    )
  }, [actionItems, search])

  const groupedActionItems = useMemo(() => {
    const buckets: Record<string, typeof actionItems> = {}
    for (const item of filteredActionItems) {
      buckets[item.queueGroup] = buckets[item.queueGroup] ?? []
      buckets[item.queueGroup].push(item)
    }
    return buckets
  }, [filteredActionItems])

  const hasResults = filteredMeetings.length > 0 || filteredActionItems.length > 0

  function pickMeeting(id: string) {
    const context = resolveMeetingContext(id, meetings)
    if (context) selectConfig(createMeetingCopilotConfig(context))
  }

  function pickActionItem(id: string) {
    const item = actionItems.find((entry) => entry.id === id)
    if (item) selectConfig(createActionCopilotConfig(item))
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex h-11 items-center gap-2.5 rounded-md border border-neutral-border bg-surface px-3 focus-within:border-brand-teal">
        <Search className="h-4 w-4 shrink-0 text-neutral-muted" strokeWidth={1.75} aria-hidden />
        <input
          aria-label="Search meetings and action items"
          placeholder="Search a meeting or action item…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full bg-transparent text-body text-neutral-text outline-none placeholder:text-neutral-muted"
        />
      </label>

      <button
        type="button"
        onClick={() => selectConfig(createGeneralCopilotConfig())}
        className="focus-ring flex h-12 w-full items-center gap-3 rounded-md border border-brand-teal/30 bg-brand-tealLight px-4 text-body font-semibold text-brand-teal transition-colors hover:bg-brand-tealLight/70"
      >
        <Sparkles className="h-4.5 w-4.5 shrink-0" strokeWidth={1.75} aria-hidden />
        Ask a general question instead
      </button>

      {!hasResults ? (
        <p className="px-1 py-4 text-center text-body text-neutral-muted">
          No meetings or action items match your search.
        </p>
      ) : (
        <>
          {filteredMeetings.length > 0 && (
            <div>
              <p className="mb-1.5 px-1 text-caption font-semibold uppercase tracking-wide text-neutral-muted">
                Meetings
              </p>
              <div className="flex flex-col gap-0.5">
                {filteredMeetings.map((meeting) => (
                  <PickerRow
                    key={meeting.id}
                    icon="meeting"
                    title={meeting.title}
                    meta={`${meeting.date} · ${meeting.time} · ${meeting.host}`}
                    onPick={() => pickMeeting(meeting.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredActionItems.length > 0 && (
            <div>
              <p className="mb-1.5 px-1 text-caption font-semibold uppercase tracking-wide text-neutral-muted">
                Action items
              </p>
              {Object.entries(groupedActionItems).map(([group, items]) => (
                <div key={group} className="mb-2 flex flex-col gap-0.5">
                  {!search && (
                    <p className="px-1 pt-1 text-small font-medium text-neutral-muted">
                      {GROUP_LABELS[group] ?? group}
                    </p>
                  )}
                  {items.map((item) => (
                    <PickerRow
                      key={item.id}
                      icon="action"
                      title={item.title}
                      meta={`${item.owner} · ${item.status}`}
                      onPick={() => pickActionItem(item.id)}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
