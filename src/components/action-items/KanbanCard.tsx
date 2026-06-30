import { memo } from 'react'
import type { ActionItem } from '../../types/actionItem'
import { ActionStatusBadge, PriorityBadge } from '../ui/Badge'
import { Card } from '../ui/Card'
import {
  getActionPriority,
  getRelativeDue,
  dueToneClass,
} from '../../utils/actionItemMeta'
import { formatDisplayDate } from '../../utils/helpers'

interface KanbanCardProps {
  item: ActionItem
}

const statusAccent: Record<ActionItem['status'], string> = {
  Pending: 'border-l-amber-300/80',
  'In Process': 'border-l-blue-300/80',
  Blocked: 'border-l-red-300/80',
  Done: 'border-l-emerald-300/80',
}

export const KanbanCard = memo(function KanbanCard({ item }: KanbanCardProps) {
  const due = getRelativeDue(item)
  const priority = getActionPriority(item)

  return (
    <Card
      variant="interactive"
      className={`group relative min-h-[3.75rem] cursor-default overflow-hidden border-l-2 p-2.5 ${statusAccent[item.status]}`}
    >
      <p className="line-clamp-2 text-body font-medium leading-snug text-neutral-text">
        {item.meetingTitle}
      </p>

      <p className="mt-0.5 text-[11px] leading-tight text-neutral-muted">
        <span className={dueToneClass(due.tone)}>{due.label}</span>
        <span aria-hidden> · </span>
        <span className="tabular-nums">{formatDisplayDate(item.date)}</span>
        <span aria-hidden> · </span>
        <span className="tabular-nums">{item.time}</span>
      </p>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-white from-55% via-white/95 to-transparent px-2.5 pb-2 pt-5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
        aria-hidden
      >
        <div className="pointer-events-auto flex w-full flex-wrap items-center gap-1">
          <ActionStatusBadge status={item.status} className="text-[10px]" />
          <PriorityBadge priority={priority} className="text-[10px]" />
          <span className="text-[10px] text-neutral-muted">
            {item.actionsCount} actions · {item.openCount} open
          </span>
        </div>
      </div>

      <span className="sr-only">
        {item.status}, {priority} priority, {item.openCount} of {item.actionsCount} actions open
      </span>
    </Card>
  )
})
