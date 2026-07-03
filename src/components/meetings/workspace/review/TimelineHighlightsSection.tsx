import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Flag,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react'
import type { TimelineHighlight } from '../../../../types/meetingContext'
import { ws } from '../workspaceUi'

interface TimelineHighlightsSectionProps {
  highlights: TimelineHighlight[]
}

interface TimelineMeta {
  icon: LucideIcon
  markerClass: string
  iconClass: string
}

function resolveTimelineMeta(label: string, index: number, total: number): TimelineMeta {
  const lower = label.toLowerCase()

  if (/risk|escalat|concern|block/i.test(lower)) {
    return {
      icon: AlertTriangle,
      markerClass: 'bg-status-warning',
      iconClass: 'text-status-warning',
    }
  }
  if (/approv|confirm|consensus|sign.?off/i.test(lower)) {
    return {
      icon: CheckCircle2,
      markerClass: 'bg-neutral-border',
      iconClass: 'text-neutral-muted',
    }
  }
  if (/budget|cost|fund|spend/i.test(lower)) {
    return {
      icon: CircleDollarSign,
      markerClass: 'bg-neutral-border',
      iconClass: 'text-neutral-muted',
    }
  }
  if (/deploy|engineer|technical|release/i.test(lower)) {
    return {
      icon: CircleDollarSign,
      markerClass: 'bg-neutral-border',
      iconClass: 'text-neutral-muted',
    }
  }
  if (index === total - 1) {
    return {
      icon: Flag,
      markerClass: 'bg-brand-teal',
      iconClass: 'text-brand-teal',
    }
  }
  return {
    icon: MessageSquare,
    markerClass: 'bg-neutral-border',
    iconClass: 'text-neutral-muted',
  }
}

export function TimelineHighlightsSection({ highlights }: TimelineHighlightsSectionProps) {
  return (
    <div className="relative pl-0.5">
      <div
        className="absolute bottom-2 left-[4.25rem] top-2 w-px bg-neutral-border/50"
        aria-hidden
      />
      <ul className="space-y-0">
        {highlights.map((item, index) => {
          const meta = resolveTimelineMeta(item.label, index, highlights.length)
          const Icon = meta.icon

          return (
            <li
              key={item.id}
              className="group relative flex gap-3 pb-3 transition-[padding] duration-200 last:pb-0"
            >
              <span
                className={`w-12 shrink-0 pt-1 text-right text-small font-medium tabular-nums transition-colors duration-200 ${ws.meta} group-hover:text-neutral-text`}
              >
                {item.time}
              </span>

              <div className="relative z-[1] flex w-7 shrink-0 justify-center pt-1">
                <span
                  className={`h-2 w-2 rounded-full ${meta.markerClass}`}
                  aria-hidden
                />
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-start gap-2">
                  <Icon
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${meta.iconClass}`}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <p className={ws.cardPrimary}>{item.label}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
