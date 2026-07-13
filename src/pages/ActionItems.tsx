import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  AlertTriangle,
  Check,
  CircleDashed,
  Clock3,
  FileText,
  FolderKanban,
  Link2,
  SearchX,
  ShieldAlert,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import type { ActionItemStatus } from '../types/actionItem'
import type { ActionQueueGroup, ActionWorkspaceItem } from '../types/actionWorkspace'
import type { DependencyItem } from '../types/workspace'
import { departmentLabel } from '../types/workspace'
import { Avatar } from '../components/ui/Avatar'
import { EmptyState } from '../components/ui/EmptyState'
import { SearchInput } from '../components/ui/SearchInput'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { useAiCopilot } from '../context/AiCopilotContext'
import { useActionWorkspace } from '../context/ActionWorkspaceContext'
import { usePageLoading } from '../hooks/usePageLoading'
import { createActionCopilotConfig } from '../components/workspace/copilot/actionCopilot'

type FilterTab = 'all' | 'open' | 'completed'
type DecisionState = 'idle' | 'approved' | 'update-requested' | 'delegated' | 'rejected'

const GROUP_ORDER: ActionQueueGroup[] = ['needs-attention', 'today', 'this-week', 'completed']

const GROUP_LABELS: Record<ActionQueueGroup, string> = {
  'needs-attention': 'Needs attention',
  today: 'Today',
  'this-week': 'This week',
  completed: 'Completed',
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'completed', label: 'Completed' },
] as const

const statusLabel: Record<ActionItemStatus, string> = {
  Pending: 'Pending',
  'In Process': 'In process',
  Blocked: 'Blocked',
  Done: 'Done',
}

const statusTone: Record<ActionItemStatus, string> = {
  Pending: 'bg-status-warningMuted text-status-warning',
  'In Process': 'bg-surface-accent text-brand-teal',
  Blocked: 'bg-coral-muted text-coral',
  Done: 'bg-surface-accent text-brand-teal',
}

const dependencyLabel: Record<DependencyItem['kind'], string> = {
  'waiting-on': 'Waiting on…',
  'blocked-by': 'Blocked by…',
  'related-action': 'Related',
  risk: 'Risk',
}

function isFilterTab(value: string | null): value is FilterTab {
  return value === 'all' || value === 'open' || value === 'completed'
}

function toStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function parseDate(value: string): Date | null {
  const parts = value.split('-').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null
  const [year, month, day] = parts as [number, number, number]
  return new Date(year, month - 1, day)
}

function formatDueDate(value: string, status: ActionItemStatus): string {
  const dueDate = parseDate(value)
  if (!dueDate) return `Due ${value}`

  const dayMs = 24 * 60 * 60 * 1000
  const diffDays = Math.round((toStartOfDay(dueDate).getTime() - toStartOfDay(new Date()).getTime()) / dayMs)
  const dateWords = dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

  if (status === 'Done') return `Completed · due ${dateWords}`
  if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} overdue`
  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due tomorrow'
  if (diffDays <= 7) return `Due in ${diffDays} days`
  return `Due ${dateWords}`
}

function isOverdue(item: ActionWorkspaceItem): boolean {
  const dueDate = parseDate(item.dueDate)
  return item.status !== 'Done' && dueDate !== null && toStartOfDay(dueDate) < toStartOfDay(new Date())
}

function progressWords(progress: number): string {
  if (progress >= 100) return 'complete'
  if (progress >= 70) return 'nearly ready'
  if (progress >= 40) return 'in motion'
  if (progress > 0) return 'early progress'
  return 'not started'
}

function StatusChip({ status }: { status: ActionItemStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-[11px] py-1 text-micro font-bold ${statusTone[status]}`}>
      {statusLabel[status]}
    </span>
  )
}

function ProgressLine({ value, compact = false }: { value: number; compact?: boolean }) {
  return (
    <div className={compact ? 'min-w-28' : ''}>
      <div className="mb-2 flex items-center justify-between gap-3 font-mono text-[11.5px] text-neutral-muted">
        <span className="font-semibold text-neutral-text tabular-nums">{value}% · {progressWords(value)}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-surface-sunken">
        <div className="h-full rounded-full bg-brand-teal" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function Section({ title, children, count }: { title: string; children: ReactNode; count?: number }) {
  return (
    <section className="card-surface p-[22px]">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-card-title font-extrabold tracking-[-0.01em] text-neutral-text">{title}</h2>
        {typeof count === 'number' ? (
          <span className="rounded-full bg-surface-accent px-[11px] py-1 text-micro font-bold text-brand-teal tabular-nums">
            {count}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function ActionCheck({ complete }: { complete: boolean }) {
  return (
    <span
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] border-[1.5px] transition-all duration-fast ease-spring ${
        complete
          ? 'border-brand-teal bg-brand-teal text-neutral-inverse'
          : 'border-[var(--border-strong)] bg-transparent text-transparent group-hover:border-brand-teal group-hover:bg-surface-accent'
      }`}
      aria-hidden
    >
      {complete ? <Check className="h-3 w-3" strokeWidth={2.5} /> : null}
    </span>
  )
}

function ActionRow({ item, onSelect }: { item: ActionWorkspaceItem; onSelect: () => void }) {
  const overdue = isOverdue(item)
  const complete = item.status === 'Done'

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`focus-ring group flex w-full items-center gap-4 border-t border-[var(--border-subtle)] px-[22px] py-4 text-left transition-colors duration-150 hover:bg-[#F3F3EA] ${
        complete ? 'opacity-50' : ''
      }`}
    >
      <ActionCheck complete={complete} />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-body font-semibold text-neutral-text transition-colors group-hover:text-brand-teal">
          {item.title}
        </h3>
        <div className="mt-1 flex items-center gap-3 font-mono text-[11px] text-neutral-muted">
          <span className="inline-flex items-center gap-1.5">
            <Avatar name={item.owner} size="sm" />
            <span className="font-medium text-neutral-text">{item.owner}</span>
          </span>
          <span>·</span>
          <span className={overdue && !complete ? 'text-coral font-bold' : ''}>
            {formatDueDate(item.dueDate, item.status)}
          </span>
        </div>
      </div>
    </button>
  )
}

function DependencyCard({ dependency }: { dependency: DependencyItem }) {
  const riskTone = dependency.kind === 'risk' || dependency.kind === 'blocked-by'
    ? 'bg-coral-muted text-coral'
    : 'bg-surface-accent text-brand-teal'

  return (
    <div className="rounded-lg border border-neutral-border bg-surface p-[22px]">
      <span className={`inline-flex rounded-full px-[11px] py-1 text-micro font-bold ${riskTone}`}>
        {dependencyLabel[dependency.kind]}
      </span>
      <h3 className="mt-3 text-body font-semibold text-neutral-text">{dependency.label}</h3>
      <p className="mt-1 text-caption leading-relaxed text-neutral-muted">{dependency.detail}</p>
    </div>
  )
}

export function ActionItems() {
  const isLoading = usePageLoading(400)
  const [searchParams, setSearchParams] = useSearchParams()
  const filterParam = searchParams.get('filter')
  const initialFilter: FilterTab = isFilterTab(filterParam) ? filterParam : 'all'
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterTab>(initialFilter)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [decision, setDecision] = useState<DecisionState>('idle')
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const { actionWorkspaceItems: items } = useActionWorkspace()
  const scrollRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((item) => {
      if (filter === 'open' && item.status === 'Done') return false
      if (filter === 'completed' && item.status !== 'Done') return false
      if (!q) return true
      return item.title.toLowerCase().includes(q) || item.owner.toLowerCase().includes(q)
    })
  }, [items, filter, search])

  const grouped = useMemo(() => {
    const buckets: Record<ActionQueueGroup, ActionWorkspaceItem[]> = {
      'needs-attention': [],
      today: [],
      'this-week': [],
      completed: [],
    }
    for (const item of filtered) buckets[item.queueGroup].push(item)
    return buckets
  }, [filtered])

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  )

  const openCount = useMemo(() => items.filter((item) => item.status !== 'Done').length, [items])
  const overdueCount = useMemo(() => items.filter(isOverdue).length, [items])
  const completedCount = items.length - openCount

  const handleFilterChange = (nextFilter: FilterTab) => {
    setFilter(nextFilter)
    const next = new URLSearchParams(searchParams)
    if (nextFilter === 'all') next.delete('filter')
    else next.set('filter', nextFilter)
    setSearchParams(next, { replace: true })
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selected?.id])

  useEffect(() => {
    setDecision('idle')
    setShowRejectConfirm(false)
  }, [selected?.id])

  const { setPageConfig } = useAiCopilot()
  useEffect(() => {
    setPageConfig(selected ? createActionCopilotConfig(selected) : null)
    return () => setPageConfig(null)
  }, [selected, setPageConfig])

  const empty = GROUP_ORDER.every((group) => grouped[group].length === 0)

  if (isLoading) return <LoadingScreen message="Organizing your tasks..." />

  if (selected) {
    const dependencyItems = [...selected.dependencies, ...selected.context.dependencies]
    const linkedItems = [
      ...selected.context.linkedMeetings,
      ...selected.context.linkedDecisions,
      ...selected.context.linkedProjects,
      ...selected.context.linkedDocuments,
    ]
    const confidenceWords = `${selected.brief.aiConfidence} confidence`

    return (
      <div className="mx-auto flex h-full min-h-0 w-full flex-col bg-neutral-bg">
        <header className="shrink-0 pb-5 pt-2">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 reveal">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="focus-ring w-fit rounded-[12px] border border-neutral-border bg-surface px-5 py-[11px] text-body font-bold text-neutral-text transition-all duration-200 hover:border-brand-teal hover:text-brand-teal"
              aria-label="All actions"
            >
              ← All actions
            </button>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="min-w-0">
                <p className="kicker mb-2">Action brief</p>
                <h1 className="text-display-md font-extrabold tracking-tight text-neutral-text">{selected.title}</h1>
                <p className="mt-2 font-mono text-[11.5px] text-neutral-muted">
                  {selected.owner} · {departmentLabel[selected.department]} · {selected.project}
                </p>
              </div>
              <StatusChip status={selected.status} />
            </div>
          </div>
        </header>

        <main ref={scrollRef} className="flex-1 overflow-y-auto py-2" aria-label="Action item detail">
          <div className="mx-auto max-w-3xl space-y-6 pb-32">
            <Section title="What's happening">
              <div className="rounded-lg bg-[var(--surface-ink)] p-[22px] text-[var(--text-on-ink)]">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#A7C6AF]">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    AI brief
                  </span>
                  <details className="group text-body font-medium text-[var(--text-on-ink-muted)]">
                    <summary className="focus-ring cursor-pointer rounded-[12px] px-2 py-1 font-bold capitalize">{confidenceWords} · why</summary>
                    <ul className="mt-3 list-disc space-y-1 pl-5">
                      {(selected.brief.confidenceBecause ?? ['Based on action status, dependencies, owner context, and recent timeline signals.']).map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </details>
                </div>

                <div className="space-y-5">
                  {[
                    ['Outcome', selected.brief.outcome],
                    ['Impact', selected.brief.impact],
                    ['Key risk', selected.brief.keyRisk],
                    ['Next step', selected.brief.nextStep],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#A7C6AF]">{label}</p>
                      <p className="mt-2 text-body font-medium leading-relaxed text-[var(--text-on-ink-muted)]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            <Section title="Status">
              <div className={`mb-5 flex items-start gap-3 rounded-lg p-[22px] ${selected.review.approvalRequired ? 'bg-status-warningMuted text-status-warning' : 'bg-surface-accent text-brand-teal'}`}>
                {selected.review.approvalRequired ? <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden /> : <Check className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />}
                <div>
                  <h3 className="text-body font-semibold">{selected.review.approvalRequired ? 'Waiting for your approval' : 'Ready to execute'}</h3>
                  <p className="mt-1 text-body font-medium text-neutral-muted">{selected.review.impact}</p>
                </div>
              </div>
              <dl className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-neutral-border bg-surface p-[22px]">
                  <dt className="kicker text-neutral-muted">Blockers</dt>
                  <dd className="mt-2 text-body text-neutral-text">{selected.review.blockers}</dd>
                </div>
                <div className="rounded-lg border border-neutral-border bg-surface p-[22px]">
                  <dt className="kicker text-neutral-muted">Due date</dt>
                  <dd className="mt-2 font-mono text-[11.5px] text-neutral-text tabular-nums">{formatDueDate(selected.review.dueDate, selected.status)}</dd>
                </div>
              </dl>
              <div className="mt-5">
                <ProgressLine value={selected.review.progress} />
              </div>
            </Section>

            <Section title="Dependencies" count={dependencyItems.length}>
              {dependencyItems.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {dependencyItems.map((dependency) => <DependencyCard key={dependency.id} dependency={dependency} />)}
                </div>
              ) : (
                <p className="text-body text-neutral-muted">No dependencies are blocking this action.</p>
              )}
            </Section>

            <Section title="People, files & risks">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-caption font-semibold text-neutral-text">
                    <UserRound className="h-4 w-4 text-brand-teal" aria-hidden /> Owners
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {selected.context.owners.map((owner) => (
                      <div key={owner.name} className="card-surface-interactive flex items-center gap-3 p-3">
                        <Avatar name={owner.name} size="md" />
                        <div>
                          <p className="text-body font-semibold text-neutral-text">{owner.name}</p>
                          {owner.role ? <p className="text-small text-neutral-muted">{owner.role}</p> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-caption font-semibold text-neutral-text">
                    <Link2 className="h-4 w-4 text-brand-teal" aria-hidden /> Meetings, projects & documents
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {linkedItems.map((item) => (
                      <span key={`${item.type}-${item.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-neutral-border bg-surface px-[11px] text-caption font-semibold text-neutral-text">
                        {item.type === 'document' ? <FileText className="h-4 w-4 text-neutral-muted" aria-hidden /> : <FolderKanban className="h-4 w-4 text-neutral-muted" aria-hidden />}
                        {item.title}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-caption font-semibold text-neutral-text">
                    <ShieldAlert className="h-4 w-4 text-coral" aria-hidden /> Risks
                  </h3>
                  {selected.context.risks.length > 0 ? (
                    <ul className="space-y-2">
                      {selected.context.risks.map((risk) => (
                        <li key={risk} className="rounded-lg bg-coral-muted px-[22px] py-[13px] text-body font-medium leading-relaxed text-coral">
                          {risk}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-body text-neutral-muted">No material risks listed.</p>
                  )}
                </div>
              </div>
            </Section>
          </div>
        </main>

        <div className="sticky bottom-0 z-sticky border-t border-neutral-border bg-surface-raised px-5 py-4 shadow-md reveal-scale">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-h-6 text-caption text-neutral-muted" role="status">
              {decision === 'idle' ? 'Choose the next decision for this action.' : `Decision saved: ${decision.replace('-', ' ')}.`}
            </div>
            {showRejectConfirm ? (
              <div className="flex flex-wrap items-center gap-2 rounded-full bg-coral-muted px-3 py-2 text-caption text-coral">
                <span>Are you sure? The owner will be notified.</span>
                <button type="button" className="focus-ring rounded-[12px] border border-neutral-border bg-surface px-5 py-[11px] text-body font-bold text-coral transition-all duration-200 hover:border-brand-teal hover:text-brand-teal" onClick={() => { setDecision('rejected'); setShowRejectConfirm(false) }}>Confirm</button>
                <button type="button" className="focus-ring rounded-[12px] border border-neutral-border bg-surface px-5 py-[11px] text-body font-bold text-neutral-text transition-all duration-200 hover:border-brand-teal hover:text-brand-teal" onClick={() => setShowRejectConfirm(false)}>Cancel</button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDecision('approved')}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-[12px] border border-brand-teal bg-brand-teal px-5 py-[11px] text-body font-bold text-neutral-inverse transition-all duration-200 hover:-translate-y-px hover:bg-brand-tealHover [box-shadow:var(--shadow-glow-accent)]"
                >
                  <Check className="h-4 w-4" aria-hidden />
                  {decision === 'approved' ? '✓ Approved' : 'Approve'}
                </button>
                <button type="button" className="focus-ring inline-flex items-center justify-center gap-2 rounded-[12px] border border-neutral-border bg-surface px-5 py-[11px] text-body font-bold text-neutral-text transition-all duration-200 hover:border-brand-teal hover:text-brand-teal" onClick={() => setDecision('update-requested')}>
                  <Clock3 className="h-4 w-4" aria-hidden /> Request update
                </button>
                <button type="button" className="focus-ring inline-flex items-center justify-center gap-2 rounded-[12px] border border-neutral-border bg-surface px-5 py-[11px] text-body font-bold text-neutral-text transition-all duration-200 hover:border-brand-teal hover:text-brand-teal" onClick={() => setDecision('delegated')}>
                  <UserRound className="h-4 w-4" aria-hidden /> Delegate
                </button>
                <button type="button" className="focus-ring inline-flex items-center justify-center gap-2 rounded-[12px] border border-neutral-border bg-surface px-5 py-[11px] text-body font-bold text-coral transition-all duration-200 hover:border-brand-teal hover:text-brand-teal" onClick={() => setShowRejectConfirm(true)}>
                  <X className="h-4 w-4" aria-hidden /> Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col bg-neutral-bg">
      <header className="shrink-0 pb-5 pt-2 reveal">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="reveal reveal-1">
            <p className="kicker">Actions</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 className="text-display-md font-extrabold tracking-tight text-neutral-text">Action Items</h1>
              <span className="rounded-full bg-surface-accent px-[11px] py-1 text-micro font-bold text-brand-teal tabular-nums">
                {openCount} open
              </span>
              <span className="rounded-full bg-coral-muted px-[11px] py-1 text-micro font-bold text-coral tabular-nums">
                {overdueCount} overdue
              </span>
              <span className="rounded-full bg-surface-accent px-[11px] py-1 text-micro font-bold text-brand-teal tabular-nums">
                {completedCount} done
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center reveal reveal-2">
            <SegmentedControl
              options={FILTER_OPTIONS.map((item) => ({ value: item.value, label: item.label }))}
              value={filter}
              onChange={handleFilterChange}
              ariaLabel="Action filter"
              className="rounded-[12px] bg-surface"
            />
            <div className="w-full sm:w-72">
              <SearchInput
                placeholder="Search title or owner…"
                value={search}
                onChange={setSearch}
                className="w-full rounded-[12px] bg-surface"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="pb-8 flex-1 min-h-0 overflow-y-auto reveal reveal-3" aria-label="Action item queue">
        {empty ? (
          <div className="card-surface flex items-center justify-center p-8 py-16 reveal-fade">
            <EmptyState
              icon={SearchX}
              title="No action items found"
              description="Try another filter or search by an owner name, project, or action title."
              bare
            />
          </div>
        ) : (
          <div className="space-y-3.5">
            {GROUP_ORDER.map((group) => {
              const itemsInGroup = grouped[group]
              if (itemsInGroup.length === 0) return null
              const emphasized = group === 'needs-attention'
              const muted = group === 'completed'

              return (
                <section key={group} className="card-surface flex flex-col p-0 reveal reveal-5 shrink-0">
                  <div className="flex items-center justify-between px-[22px] pb-3 pt-[18px]">
                    <div className="flex items-center gap-3">
                      {emphasized ? (
                        <span className="flex items-center gap-2 text-coral">
                          <span className="h-2 w-2 rounded-full bg-coral pulse-live" aria-hidden />
                          <AlertTriangle className="h-4 w-4" aria-hidden />
                        </span>
                      ) : (
                        <CircleDashed className="h-4 w-4 text-neutral-muted" aria-hidden />
                      )}
                      <h2 className={`text-card-title font-extrabold tracking-[-0.01em] ${emphasized ? 'text-coral' : muted ? 'text-neutral-muted' : 'text-neutral-text'}`}>
                        {GROUP_LABELS[group]}
                      </h2>
                    </div>
                    <span className={`rounded-full px-[11px] py-1 text-micro font-bold tabular-nums ${emphasized ? 'bg-coral-muted text-coral' : 'bg-surface-accent text-brand-teal'}`}>
                      {itemsInGroup.length}
                    </span>
                  </div>
                  {itemsInGroup.map((item) => (
                    <ActionRow key={item.id} item={item} onSelect={() => setSelectedId(item.id)} />
                  ))}
                </section>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
