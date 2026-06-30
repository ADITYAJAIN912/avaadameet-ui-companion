import { Link } from 'react-router-dom'
import {
  AlertCircle,
  CircleCheck,
  FileText,
  ScrollText,
  Sparkles,
  Video,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Meeting } from '../../types/meeting'
import type { ActionItem } from '../../types/actionItem'
import { mockDashboardInsights } from '../../data/mockDashboardInsights'
import { getMeetingArtifacts } from '../../utils/meetingMeta'

interface DashboardBriefPanelProps {
  recentMeeting?: Meeting
  priorityActions: ActionItem[]
}

type FeedKind = 'completed' | 'summary' | 'transcript' | 'recording'

interface FeedItem {
  id: string
  kind: FeedKind
  label: string
  context: string
  icon: LucideIcon
}

const feedIcons: Record<FeedKind, LucideIcon> = {
  completed: CircleCheck,
  summary: ScrollText,
  transcript: FileText,
  recording: Video,
}

const insightTone = {
  neutral: 'text-neutral-text',
  warning: 'text-amber-800/90',
  positive: 'text-brand-teal',
} as const

function artifactKind(label: string): FeedKind | null {
  if (label.includes('Summary')) return 'summary'
  if (label.includes('Transcript')) return 'transcript'
  if (label.includes('Recording')) return 'recording'
  return null
}

function buildFeed(meeting: Meeting): FeedItem[] {
  const items: FeedItem[] = [
    {
      id: `${meeting.id}-done`,
      kind: 'completed',
      label: 'Meeting completed',
      context: `${meeting.title} · ${meeting.time}`,
      icon: feedIcons.completed,
    },
  ]

  for (const artifact of getMeetingArtifacts(meeting)) {
    const kind = artifactKind(artifact.label)
    if (!kind) continue
    items.push({
      id: `${meeting.id}-${kind}`,
      kind,
      label:
        kind === 'summary'
          ? 'Summary available'
          : kind === 'transcript'
            ? 'Transcript generated'
            : 'Recording uploaded',
      context: meeting.title,
      icon: feedIcons[kind],
    })
  }

  return items
}

const statusAccent: Record<ActionItem['status'], string> = {
  Blocked: 'text-status-danger',
  Pending: 'text-amber-800/90',
  'In Process': 'text-blue-800/90',
  Done: 'text-neutral-muted',
}

export function DashboardBriefPanel({
  recentMeeting,
  priorityActions,
}: DashboardBriefPanelProps) {
  const feed = recentMeeting ? buildFeed(recentMeeting) : []

  return (
    <section className="card-surface flex h-full min-h-0 flex-col overflow-hidden shadow-sm">
      <header className="flex shrink-0 items-center justify-between border-b border-neutral-border/40 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-tealLight/60">
            <Sparkles className="h-3.5 w-3.5 text-brand-teal" strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="text-card-heading leading-none">Today&apos;s Brief</h2>
            <p className="mt-0.5 text-[10px] text-neutral-muted">Insights · priorities · activity</p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-100">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden />
          Live
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-1.5 p-2.5">
          {mockDashboardInsights.map((insight) => (
            <div
              key={insight.id}
              className="rounded-lg border border-neutral-border/35 bg-neutral-bg/25 px-2 py-1.5"
            >
              <p className="text-[9px] font-medium uppercase tracking-wide text-neutral-muted">
                {insight.label}
              </p>
              <p
                className={`mt-0.5 line-clamp-2 text-[11px] leading-snug ${
                  insightTone[insight.tone ?? 'neutral']
                }`}
              >
                {insight.value}
              </p>
            </div>
          ))}
        </div>

        {priorityActions.length > 0 && (
          <div className="border-t border-neutral-border/40 px-2.5 py-2">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-muted">
                <AlertCircle className="h-3 w-3" strokeWidth={1.75} />
                Needs attention
              </p>
              <Link
                to="/action-items?filter=open"
                className="focus-ring text-[10px] font-medium text-brand-teal hover:text-brand-teal/80"
              >
                View all
              </Link>
            </div>
            <ul className="space-y-1">
              {priorityActions.map((item) => (
                <li key={item.id}>
                  <Link
                    to="/action-items"
                    className="focus-ring group flex items-center justify-between gap-2 rounded-lg border border-neutral-border/40 bg-white/80 px-2 py-1.5 ease-premium hover:border-brand-teal/25 hover:bg-brand-tealLight/20"
                  >
                    <span className="min-w-0 truncate text-caption text-neutral-text group-hover:text-neutral-text">
                      {item.meetingTitle}
                    </span>
                    <span
                      className={`shrink-0 text-[10px] font-medium ${statusAccent[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {feed.length > 0 && (
          <div className="border-t border-neutral-border/40 px-2.5 py-2">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-muted">
              Activity stream
            </p>
            <ul className="space-y-0.5" aria-label="Recent activity">
              {feed.map((item) => {
                const Icon = item.icon
                return (
                  <li
                    key={item.id}
                    className="flex items-start gap-2 rounded-md px-1 py-1 ease-premium hover:bg-neutral-bg/60"
                  >
                    <Icon
                      className="mt-0.5 h-3 w-3 shrink-0 text-neutral-muted"
                      strokeWidth={1.75}
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-neutral-text">{item.label}</p>
                      <p className="truncate text-[10px] text-neutral-muted">{item.context}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
