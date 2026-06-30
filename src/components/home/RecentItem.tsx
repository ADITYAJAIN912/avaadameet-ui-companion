import {
  CircleCheck,
  FileText,
  ScrollText,
  Video,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Meeting } from '../../types/meeting'
import { getMeetingArtifacts } from '../../utils/meetingMeta'

interface RecentItemProps {
  meeting: Meeting
}

type ActivityType = 'completed' | 'summary' | 'transcript' | 'recording'

interface ActivityEntry {
  type: ActivityType
  label: string
  detail: string
  icon: LucideIcon
}

const typeLabels: Record<ActivityType, string> = {
  completed: 'Meeting completed',
  summary: 'Summary available',
  transcript: 'Transcript generated',
  recording: 'Recording uploaded',
}

const typeIcons: Record<ActivityType, LucideIcon> = {
  completed: CircleCheck,
  summary: ScrollText,
  transcript: FileText,
  recording: Video,
}

function artifactToType(label: string): ActivityType | null {
  if (label.includes('Summary')) return 'summary'
  if (label.includes('Transcript')) return 'transcript'
  if (label.includes('Recording')) return 'recording'
  return null
}

function buildActivities(meeting: Meeting): ActivityEntry[] {
  const entries: ActivityEntry[] = [
    {
      type: 'completed',
      label: typeLabels.completed,
      detail: `${meeting.title} · ${meeting.time}`,
      icon: typeIcons.completed,
    },
  ]

  for (const artifact of getMeetingArtifacts(meeting)) {
    const type = artifactToType(artifact.label)
    if (!type) continue
    entries.push({
      type,
      label: typeLabels[type],
      detail: meeting.title,
      icon: typeIcons[type],
    })
  }

  return entries
}

export function RecentItem({ meeting }: RecentItemProps) {
  const activities = buildActivities(meeting)
  const grouped = activities.reduce<Record<ActivityType, ActivityEntry[]>>(
    (acc, entry) => {
      if (!acc[entry.type]) acc[entry.type] = []
      acc[entry.type].push(entry)
      return acc
    },
    {} as Record<ActivityType, ActivityEntry[]>,
  )

  const order: ActivityType[] = ['completed', 'summary', 'transcript', 'recording']

  return (
    <section className="card-surface-secondary flex h-full flex-col p-3 shadow-sm ease-premium hover:shadow-md">
      <h2 className="text-section-title">Recent Activity</h2>
      <p className="mt-0.5 text-[11px] text-neutral-muted">Today&apos;s completed meetings</p>

      <div className="mt-2.5 space-y-3">
        {order.map((type) => {
          const items = grouped[type]
          if (!items?.length) return null
          const Icon = typeIcons[type]

          return (
            <div key={type}>
              <div className="mb-1.5 flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-neutral-muted" strokeWidth={1.75} />
                <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-muted">
                  {typeLabels[type]}
                </p>
              </div>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li
                    key={`${type}-${item.detail}`}
                    className="rounded-lg border border-neutral-border/40 bg-white/70 px-2.5 py-1.5 ease-premium hover:border-neutral-border/60 hover:bg-white"
                  >
                    <p className="truncate text-caption text-neutral-text">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
