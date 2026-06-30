import { useState } from 'react'
import type { ActionItem } from '../../types/actionItem'
import { getColumnMetrics } from '../../utils/actionItemMeta'
import { KanbanCard } from './KanbanCard'

const KANBAN_PAGE_SIZE = 8

const columnTheme: Record<
  ActionItem['status'],
  { accent: string; header: string }
> = {
  Pending: {
    accent: 'border-l-amber-300/70',
    header: 'bg-amber-50/35',
  },
  'In Process': {
    accent: 'border-l-blue-300/70',
    header: 'bg-blue-50/35',
  },
  Blocked: {
    accent: 'border-l-red-300/70',
    header: 'bg-red-50/35',
  },
  Done: {
    accent: 'border-l-emerald-300/70',
    header: 'bg-emerald-50/35',
  },
}

interface KanbanColumnProps {
  title: ActionItem['status']
  items: ActionItem[]
}

export function KanbanColumn({ title, items }: KanbanColumnProps) {
  const [expanded, setExpanded] = useState(false)
  const theme = columnTheme[title]
  const metrics = getColumnMetrics(items)
  const hasMore = items.length > KANBAN_PAGE_SIZE
  const visibleItems = expanded ? items : items.slice(0, KANBAN_PAGE_SIZE)
  const hiddenCount = items.length - KANBAN_PAGE_SIZE

  return (
    <div
      className={`flex w-[17.5rem] shrink-0 flex-col self-start overflow-hidden rounded-lg border border-neutral-border/60 border-l-2 bg-white/90 shadow-sm ${theme.accent} ${
        items.length > 0 ? 'max-h-[calc(100dvh-12.5rem)]' : ''
      }`}
    >
      <header
        className={`sticky top-0 z-10 shrink-0 border-b border-neutral-border/40 px-2.5 py-2 ${theme.header}`}
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-caption font-semibold text-neutral-text">{title}</h3>
          <span className="shrink-0 rounded-md bg-white/80 px-1.5 py-px text-[11px] font-semibold tabular-nums text-neutral-muted ring-1 ring-neutral-border/40">
            {metrics.total}
          </span>
        </div>
        {metrics.total > 0 && (
          <p className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0 text-[10px] text-neutral-muted">
            <span>{metrics.total} tasks</span>
            {metrics.overdue > 0 && (
              <span className="text-status-danger">{metrics.overdue} overdue</span>
            )}
            {metrics.highPriority > 0 && (
              <span>{metrics.highPriority} high priority</span>
            )}
          </p>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-1.5">
        <div className="flex flex-col gap-1.5">
          {visibleItems.map((item) => (
            <KanbanCard key={item.id} item={item} />
          ))}
        </div>

        {items.length === 0 && (
          <p className="py-3 text-center text-[11px] text-neutral-muted">No items</p>
        )}

        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="focus-ring mt-1.5 w-full rounded-md py-1 text-center text-[11px] font-medium text-brand-teal ease-premium hover:bg-brand-tealLight/30 hover:text-brand-teal/80"
          >
            {expanded ? 'Show less' : `Show ${hiddenCount} more`}
          </button>
        )}
      </div>
    </div>
  )
}
