import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, ChevronRight, ClipboardList } from 'lucide-react'
import {
  mockActionItems,
  sortActionItems,
  type ActionItem,
} from '../data/mockActionItems'
import { ViewToggle } from '../components/ui/ViewToggle'
import { ActionItemRow } from '../components/action-items/ActionItemRow'
import { KanbanBoard } from '../components/action-items/KanbanBoard'
import { StatusLegend } from '../components/action-items/StatusLegend'
import { SearchInput } from '../components/ui/SearchInput'
import { Chip } from '../components/ui/Chip'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ActionItemsPageSkeleton } from '../components/ui/Skeleton'
import { usePageLoading } from '../hooks/usePageLoading'

type StatusFilter = 'All' | ActionItem['status']

const statusTabs: StatusFilter[] = [
  'All',
  'Pending',
  'In Process',
  'Blocked',
  'Done',
]

const ACTIVE_VISIBLE_DEFAULT = 8

export function ActionItems() {
  const isLoading = usePageLoading(500)
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [view, setView] = useState<'list' | 'kanban'>('list')
  const [doneExpanded, setDoneExpanded] = useState(false)
  const [activeExpanded, setActiveExpanded] = useState(false)

  useEffect(() => {
    const f = searchParams.get('filter')
    if (f === 'open' || f === 'pending') setStatusFilter('All')
    else if (f === 'blocked') setStatusFilter('Blocked')
    else if (f === 'done') setStatusFilter('Done')
    else if (f === 'in-process') setStatusFilter('In Process')
  }, [searchParams])

  const filtered = useMemo(() => {
    let items = mockActionItems.filter((item) => {
      if (!search) return true
      return item.meetingTitle.toLowerCase().includes(search.toLowerCase())
    })
    if (statusFilter !== 'All') {
      items = items.filter((item) => item.status === statusFilter)
    }
    return sortActionItems(items)
  }, [search, statusFilter])

  const activeItems = filtered.filter((i) => i.status !== 'Done')
  const doneItems = filtered.filter((i) => i.status === 'Done')
  const showDoneCollapsed = view === 'list' && statusFilter === 'All' && doneItems.length > 0

  const hasMoreActive =
    statusFilter === 'All' && activeItems.length > ACTIVE_VISIBLE_DEFAULT
  const visibleActive =
    statusFilter === 'All' && !activeExpanded
      ? activeItems.slice(0, ACTIVE_VISIBLE_DEFAULT)
      : activeItems
  const hiddenActiveCount = activeItems.length - ACTIVE_VISIBLE_DEFAULT

  if (isLoading) {
    return <ActionItemsPageSkeleton />
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchInput
            shortcutId="action-items-search"
            placeholder="Search action items or meeting names"
            value={search}
            onChange={setSearch}
          />

          <div className="inline-flex h-9 flex-wrap items-center gap-1 rounded-xl border border-neutral-border/70 bg-white p-0.5 shadow-elevation-1">
            {statusTabs.map((tab) => (
              <Chip
                key={tab}
                label={tab}
                active={statusFilter === tab}
                onClick={() => {
                  setStatusFilter(tab)
                  setActiveExpanded(false)
                }}
                className="rounded-lg"
              />
            ))}
          </div>

          <ViewToggle
            options={[
              { value: 'list', label: 'List' },
              { value: 'kanban', label: 'Kanban' },
            ]}
            value={view}
            onChange={setView}
          />
        </div>

        {view === 'list' && <StatusLegend />}
      </div>

      {view === 'kanban' ? (
        <KanbanBoard items={filtered} />
      ) : (
        <>
          <Card variant="container" className="overflow-hidden p-0">
            {visibleActive.map((item) => (
              <ActionItemRow key={item.id} item={item} />
            ))}

            {filtered.length === 0 && (
              <EmptyState
                bare
                icon={ClipboardList}
                title="No action items found"
                description="Nothing matches your search or status filter."
                actionHint="Reset filters to All or try a different keyword."
              />
            )}
          </Card>

          {hasMoreActive && !activeExpanded && (
            <button
              type="button"
              onClick={() => setActiveExpanded(true)}
              className="focus-ring rounded-md text-body font-medium text-brand-teal ease-premium hover:text-brand-teal/80"
            >
              Show {hiddenActiveCount} more
            </button>
          )}
          {hasMoreActive && activeExpanded && (
            <button
              type="button"
              onClick={() => setActiveExpanded(false)}
              className="focus-ring rounded-md text-body font-medium text-brand-teal ease-premium hover:text-brand-teal/80"
            >
              Show less
            </button>
          )}

          {showDoneCollapsed && (
            <>
              <button
                type="button"
                onClick={() => setDoneExpanded(!doneExpanded)}
                className="focus-ring card-surface-interactive card-hover-lift flex w-full items-center gap-2 px-4 py-3.5 text-body font-medium text-neutral-muted"
              >
                {doneExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Done ({doneItems.length})
              </button>
              {doneExpanded && (
                <Card variant="container" className="overflow-hidden p-0">
                  {doneItems.map((item) => (
                    <ActionItemRow key={item.id} item={item} />
                  ))}
                </Card>
              )}
            </>
          )}

          {!showDoneCollapsed && doneItems.length > 0 && (
            <Card variant="container" className="overflow-hidden p-0">
              {doneItems.map((item) => (
                <ActionItemRow key={item.id} item={item} />
              ))}
            </Card>
          )}
        </>
      )}
    </div>
  )
}
