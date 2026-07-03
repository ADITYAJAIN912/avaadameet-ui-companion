import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BookOpen,
  Check,
  CheckSquare,
  ChevronRight,
  Clock3,
  FileText,
  GitBranch,
  LayoutTemplate,
  Link2,
  ShieldAlert,
  Sparkles,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { getActionWorkspaceItems } from '../data/mockActionWorkspace'
import type { ActionItemStatus } from '../types/actionItem'
import type { ActionQueueGroup, ActionWorkspaceItem } from '../types/actionWorkspace'
import { departmentLabel } from '../types/workspace'
import { SearchInput } from '../components/ui/SearchInput'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Button } from '../components/ui/Button'
import { WorkspaceSection } from '../components/meetings/workspace/WorkspaceSection'
import { ActionSummarySection } from '../components/action-items/ActionSummarySection'
import { TimelineHighlightsSection } from '../components/meetings/workspace/review/TimelineHighlightsSection'
import {
  KnowledgeMiniCard,
  useWorkspaceFloatingPanel,
  WorkspaceAiToggle,
  WorkspaceEmptyState,
  WorkspaceFloatingPanel,
  WorkspacePageHeader,
} from '../components/workspace'
import { ActionCopilotPanel } from '../components/workspace/copilot'
import {
  priorityBadgeTone,
  queueCardClass,
  workspaceLayout,
  ws,
  wsBadge,
  wsCount,
} from '../components/meetings/workspace/workspaceUi'

type FilterTab = 'all' | 'open' | 'completed'

const GROUP_LABELS: Record<ActionQueueGroup, string> = {
  'needs-attention': 'Needs attention',
  today: 'Today',
  'this-week': 'This week',
  completed: 'Completed',
}

const queueStatusBadgeTone: Record<ActionItemStatus, string> = {
  Pending: wsBadge.info,
  'In Process': wsBadge.accent,
  Blocked: wsBadge.danger,
  Done: wsBadge.neutral,
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
  Pending: wsBadge.info,
  'In Process': wsBadge.accent,
  Blocked: wsBadge.danger,
  Done: wsBadge.neutral,
}

const emptyStateItems = [
  {
    icon: Sparkles,
    title: 'Review action briefings',
    description: 'Start with outcomes, blockers, and next steps — not raw task lists.',
  },
  {
    icon: CheckSquare,
    title: 'Approve critical actions',
    description: 'Confirm ownership, dependencies, and impact before execution.',
  },
  {
    icon: GitBranch,
    title: 'Track dependencies',
    description: 'Surface blocked work and related actions across teams.',
  },
  {
    icon: ShieldAlert,
    title: 'Monitor execution risks',
    description: 'Review timeline activity and approval requirements early.',
  },
] as const

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

interface ActionAiPanelProps {
  item: ActionWorkspaceItem
  open: boolean
  width: number
  x: number
  y: number
  panelRef: React.RefObject<HTMLDivElement | null>
  onClose: () => void
  onDragStart: (event: React.PointerEvent<HTMLElement>) => void
  onResizeStart: (event: React.PointerEvent<HTMLDivElement>) => void
}

function ActionAiPanel({
  item,
  open,
  width,
  x,
  y,
  panelRef,
  onClose,
  onDragStart,
  onResizeStart,
}: ActionAiPanelProps) {
  return (
    <WorkspaceFloatingPanel
      open={open}
      width={width}
      x={x}
      y={y}
      panelRef={panelRef}
      onResizeStart={onResizeStart}
    >
      <ActionCopilotPanel item={item} onDragStart={onDragStart} onClose={onClose} />
    </WorkspaceFloatingPanel>
  )
}

export function ActionItems() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterTab>('all')
  const items = useMemo(() => getActionWorkspaceItems(), [])
  const scrollRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filter === 'open' && item.status === 'Done') return false
      if (filter === 'completed' && item.status !== 'Done') return false
      if (!search) return true
      const q = search.toLowerCase()
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

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = useMemo(
    () => filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? null,
    [filtered, selectedId],
  )
  const timelineHighlights = useMemo(
    () =>
      (selected?.timeline ?? []).map((row) => ({
        id: row.id,
        time: row.time,
        label: row.event,
      })),
    [selected?.timeline],
  )

  useEffect(() => {
    if (selected && selected.id !== selectedId) setSelectedId(selected.id)
  }, [selected, selectedId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selected?.id])

  const [aiOpen, setAiOpen] = useState(false)
  const { panelRef, width: aiWidth, position: aiPos, startDrag, startResize } = useWorkspaceFloatingPanel({
    open: aiOpen,
    enabled: Boolean(selected),
  })

  const linkedCount = selected
    ? selected.context.linkedMeetings.length + selected.context.linkedDecisions.length
    : 0
  const dependencyCount = selected
    ? selected.dependencies.length + selected.context.dependencies.length
    : 0

  return (
    <div className={`${workspaceLayout.pageShell} ${ws.pageActionItems}`}>
      <WorkspacePageHeader
        title="Action Items"
        subtitle={
          <>
            <span className={ws.metaStrong}>Execution tracking</span>
          </>
        }
        toolbar={
          <>
            <WorkspaceAiToggle
              open={aiOpen}
              disabled={!selected}
              onClick={() => setAiOpen((prev) => !prev)}
            />
            <SegmentedControl
              options={FILTER_OPTIONS.map((item) => ({ value: item.value, label: item.label }))}
              value={filter}
              onChange={(value) => setFilter(value as FilterTab)}
              ariaLabel="Action filter"
            />
            <div className="w-full min-w-[12rem] flex-1 sm:w-52 sm:flex-none lg:w-56 xl:w-64">
              <SearchInput
                placeholder="Search actions or owners…"
                value={search}
                onChange={setSearch}
                className="w-full"
              />
            </div>
          </>
        }
      />

      <div className={workspaceLayout.grid}>
        <aside
          className="panel-surface flex h-full min-h-0 min-w-0 w-full flex-col"
          aria-label="Action queue"
        >
          <div className={ws.panelHd}>
            <h2 className={ws.panelTitle}>Action queue</h2>
            <p className={ws.meta}>
              <span className={`tabular-nums ${ws.metaStrong}`}>{filtered.length}</span>
              {' '}
              action item{filtered.length !== 1 ? 's' : ''} in view
            </p>
          </div>
          <div className={ws.panelBd}>
            <div className={ws.queueSections}>
              {(Object.keys(grouped) as ActionQueueGroup[]).map((group) => {
                const itemsInGroup = grouped[group]
                if (itemsInGroup.length === 0) return null
                return (
                  <section key={group} aria-label={GROUP_LABELS[group]}>
                    <div className={`${ws.groupHd} ${ws.queueGroupHd}`}>
                      <h3 className={ws.queueEyebrow}>{GROUP_LABELS[group]}</h3>
                      <span className={wsCount}>{itemsInGroup.length}</span>
                    </div>
                    <div className={ws.queueList}>
                      {itemsInGroup.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                          className={queueCardClass(selected?.id === item.id)}
                        >
                          <div className={ws.queueCardBody}>
                            <p className={ws.queueCardTitle}>{item.title}</p>
                            <p className={ws.queueCardOwner}>
                              <span className={ws.queueCardMetaStrong}>{item.owner}</span>
                              <span className="text-neutral-border/80"> · </span>
                              <span>{departmentLabel[item.department]}</span>
                            </p>
                            {selected?.id !== item.id ? (
                              <div className={ws.queueCardStatus} aria-label="Status">
                                <span className={queueStatusBadgeTone[item.status]}>{statusLabel[item.status]}</span>
                                {item.priority !== 'low' ? (
                                  <span className={`${priorityBadgeTone(item.priority)} capitalize`}>
                                    {item.priority}
                                  </span>
                                ) : null}
                              </div>
                            ) : null}
                            {selected?.id !== item.id ? (
                              <div className={ws.queueCardProgress} aria-label={`${item.progress}% complete`}>
                                <div className={ws.progressTrack}>
                                  <div
                                    className={ws.progressFill}
                                    style={{ width: `${item.progress}%` }}
                                  />
                                </div>
                                <span className={ws.queueCardProgressLabel}>{item.progress}%</span>
                              </div>
                            ) : null}
                            <p className={ws.queueCardFoot}>
                              Due <span className="tabular-nums">{item.dueDate}</span>
                              {item.aiGenerated ? ' · AI generated' : ''}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        </aside>

        <main className="panel-surface flex min-h-0 min-w-0 w-full flex-col" aria-label="Action workspace">
          {selected ? (
            <div key={selected.id} className={`flex min-h-0 flex-1 flex-col ${ws.contextEnter}`}>
              <div className={ws.panelHd}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h2 className={ws.workspaceTitle}>{selected.title}</h2>
                    <p className={ws.meta}>
                      <span className={`tabular-nums ${ws.metaStrong}`}>{selected.owner}</span>
                      <span className="text-neutral-border/80"> · </span>
                      {departmentLabel[selected.department]}
                      <span className="text-neutral-border/80"> · </span>
                      {selected.project}
                    </p>
                  </div>
                  <span className={`shrink-0 normal-case tracking-normal ${statusTone[selected.status]}`}>
                    {statusLabel[selected.status]}
                  </span>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col">
                <div ref={scrollRef} className={ws.panelBd}>
                  <div className={ws.flow}>
                    <WorkspaceSection title="Summary" question="What is happening?" variant="hero">
                      <ActionSummarySection brief={selected.brief} />
                    </WorkspaceSection>

                    <WorkspaceSection title="Action review" variant="secondary" scrollBody>
                      <div className={ws.actionReviewPanel}>
                        <div className={ws.cardHd}>
                          {selected.review.approvalRequired ? (
                            <span className={wsBadge.warning}>Pending approval</span>
                          ) : (
                            <span className={wsBadge.neutral}>Ready to execute</span>
                          )}
                        </div>

                        <dl className={ws.cardMetaGrid}>
                          <div className={`${ws.fieldCell} ${ws.cardMetaGridSpan2}`}>
                            <dt className={ws.fieldLabel}>Blockers</dt>
                            <dd className={ws.fieldValue}>{selected.review.blockers}</dd>
                          </div>
                          <div className={ws.fieldCell}>
                            <dt className={ws.fieldLabel}>Progress</dt>
                            <dd>
                              <div className={ws.queueCardProgress}>
                                <div className={ws.progressTrack}>
                                  <div
                                    className={ws.progressFill}
                                    style={{ width: `${selected.review.progress}%` }}
                                  />
                                </div>
                                <span className={ws.queueCardProgressLabel}>
                                  {selected.review.progress}%
                                </span>
                              </div>
                            </dd>
                          </div>
                          <div className={ws.fieldCell}>
                            <dt className={ws.fieldLabel}>Due date</dt>
                            <dd className={`${ws.fieldValue} tabular-nums`}>{selected.review.dueDate}</dd>
                          </div>
                        </dl>
                      </div>
                    </WorkspaceSection>

                    <WorkspaceSection title="Timeline" variant="tier" scrollBody>
                      {timelineHighlights.length > 0 ? (
                        <TimelineHighlightsSection highlights={timelineHighlights} />
                      ) : (
                        <p className={`${ws.meta} px-1`}>
                          Updates will appear here as execution progresses.
                        </p>
                      )}
                    </WorkspaceSection>

                    <WorkspaceSection
                      title="Dependencies"
                      variant="tier"
                      count={dependencyCount}
                    >
                      {selected.dependencies.length > 0 ? (
                        <div className="space-y-3">
                          {selected.dependencies.map((dep) => (
                            <div key={dep.id} className={ws.knowledgeRow}>
                              <p className={ws.fieldLabel}>{dep.label}</p>
                              <p className={ws.fieldValue}>{dep.detail}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className={`${ws.meta} px-1`}>No dependencies linked to this action.</p>
                      )}
                    </WorkspaceSection>
                  </div>
                </div>

                <div className="workspace-sticky-footer">
                  <div className={ws.footerBar}>
                    {selected.review.approvalRequired ? (
                      <p className={ws.meta}>
                        <span className={wsBadge.warning}>Approval required</span>
                        {' — '}
                        Record approval to unblock execution.
                      </p>
                    ) : (
                      <p className={ws.eyebrow}>What happens next?</p>
                    )}
                    <div className={ws.footerActions}>
                      <Button variant="primary" className={ws.footerPrimary}>
                        <Check className="h-3.5 w-3.5" strokeWidth={1.75} /> Approve
                      </Button>
                      <Button variant="ghost" className={ws.footerSecondary}>
                        <UserRound className="h-3.5 w-3.5" strokeWidth={1.75} /> Delegate
                      </Button>
                      <Button variant="ghost" className={ws.footerSecondary}>
                        <X className="h-3.5 w-3.5" strokeWidth={1.75} /> Reject
                      </Button>
                      <Button variant="ghost" className={ws.footerSecondary}>
                        <Clock3 className="h-3.5 w-3.5" strokeWidth={1.75} /> Request Update
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className={`mx-auto flex w-full max-w-lg flex-1 flex-col justify-center ${ws.panelBdEmpty}`}>
                <WorkspaceEmptyState
                  icon={<LayoutTemplate className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
                  title="Select an action item"
                  description="Review critical actions, approve commitments, track execution, and monitor dependencies from one workspace."
                  className="border-0 bg-transparent p-0"
                />

                <ul className="mt-4 space-y-2">
                  {emptyStateItems.map(({ icon: Icon, title, description }) => (
                    <li key={title} className={`${ws.emptyHint} ${ws.cardTimeline}`}>
                      <div className="icon-well icon-well-neutral icon-well-lg">
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                      </div>
                      <div className={ws.cardTimelineBody}>
                        <p className={ws.cardTitle}>{title}</p>
                        <p className={ws.meta}>{description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </main>

        <aside
          className="panel-surface hidden h-full min-h-0 min-w-0 w-full flex-col lg:flex"
          aria-label="Knowledge panel"
        >
          <div className={ws.panelHd}>
            <h2 className={ws.panelTitle}>Knowledge</h2>
            <p className={ws.meta}>
              {selected ? 'Related context & linked assets' : 'Select an action to view related context'}
            </p>
          </div>
          <div className={ws.panelBd}>
            {!selected ? (
              <WorkspaceEmptyState
                icon={<BookOpen className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
                title="Knowledge context appears here"
                description="After selecting an action, this panel shows related meetings, decisions, projects, documents, owners, and risks."
              />
            ) : (
              <div key={selected.id} className={`${ws.contextEnter} ${ws.contextKnowledgeFlow}`}>
                <KnowledgeMiniCard icon={BookOpen} title="Overview">
                  <div className={ws.knowledgeMetrics}>
                    <div className={ws.knowledgeMetric}>
                      <p className={ws.fieldLabel}>Dependencies</p>
                      <p className={`${ws.fieldValue} tabular-nums`}>{dependencyCount}</p>
                    </div>
                    <div className={ws.knowledgeMetric}>
                      <p className={ws.fieldLabel}>Linked</p>
                      <p className={`${ws.fieldValue} tabular-nums`}>{linkedCount}</p>
                    </div>
                  </div>
                </KnowledgeMiniCard>

                <KnowledgeMiniCard
                  icon={GitBranch}
                  title="Decisions"
                  count={selected.context.linkedDecisions.length}
                >
                  {selected.context.linkedDecisions.length === 0 ? (
                    <p className={ws.knowledgeMeta}>None linked</p>
                  ) : (
                    selected.context.linkedDecisions.map((link) => (
                      <div key={link.id} className={ws.knowledgeRow}>
                        <p className={`${ws.knowledgeValue} line-clamp-2`}>{link.title}</p>
                        <p className={ws.knowledgeMeta}>{link.type}</p>
                      </div>
                    ))
                  )}
                </KnowledgeMiniCard>

                <KnowledgeMiniCard
                  icon={Link2}
                  title="Related meetings"
                  count={selected.context.linkedMeetings.length}
                >
                  {selected.context.linkedMeetings.length === 0 ? (
                    <p className={ws.knowledgeMeta}>None linked</p>
                  ) : (
                    selected.context.linkedMeetings.map((meeting) => (
                      <button
                        key={meeting.id}
                        type="button"
                        className={`${ws.knowledgeMeetingBtn} ${ws.interactive} group`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className={`truncate ${ws.knowledgeValue}`}>{meeting.title}</p>
                          <p className={ws.knowledgeMeta}>{meeting.type}</p>
                        </div>
                        <ChevronRight
                          className="h-3.5 w-3.5 shrink-0 text-neutral-muted transition-transform duration-200 group-hover:translate-x-0.5"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </button>
                    ))
                  )}
                </KnowledgeMiniCard>

                <KnowledgeMiniCard
                  icon={Users}
                  title="People"
                  count={selected.context.owners.length}
                >
                  {selected.context.owners.length === 0 ? (
                    <p className={ws.knowledgeMeta}>None listed</p>
                  ) : (
                    selected.context.owners.map((owner) => (
                      <div key={owner.name} className={ws.knowledgePersonRow}>
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-caption font-medium text-neutral-muted">
                          {initials(owner.name)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className={`block truncate ${ws.knowledgeValue}`}>{owner.name}</span>
                          {owner.role ? (
                            <span className={`block truncate ${ws.knowledgeMeta}`}>{owner.role}</span>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </KnowledgeMiniCard>

                <KnowledgeMiniCard
                  icon={LayoutTemplate}
                  title="Assets"
                  count={
                    selected.context.linkedProjects.length + selected.context.linkedDocuments.length
                  }
                >
                  {selected.context.linkedProjects.length === 0 &&
                  selected.context.linkedDocuments.length === 0 ? (
                    <p className={ws.knowledgeMeta}>None linked</p>
                  ) : (
                    <>
                      {selected.context.linkedProjects.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {selected.context.linkedProjects.map((project) => (
                            <span key={project.id} className={ws.statChip}>
                              {project.title}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {selected.context.linkedDocuments.length > 0
                        ? selected.context.linkedDocuments.map((doc) => (
                            <div key={doc.id} className={ws.knowledgeDocCard}>
                              <div className={ws.iconWell}>
                                <FileText className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className={`truncate ${ws.knowledgeValue}`}>{doc.title}</p>
                                <p className={ws.knowledgeMeta}>{doc.type}</p>
                              </div>
                            </div>
                          ))
                        : null}
                    </>
                  )}
                </KnowledgeMiniCard>

                {selected.context.risks.length > 0 ? (
                  <KnowledgeMiniCard
                    icon={ShieldAlert}
                    title="Risks"
                    count={selected.context.risks.length}
                  >
                    {selected.context.risks.map((risk) => (
                      <p key={risk} className={ws.knowledgeValue}>
                        {risk}
                      </p>
                    ))}
                  </KnowledgeMiniCard>
                ) : null}
              </div>
            )}
          </div>
        </aside>
      </div>

      {selected ? (
        <ActionAiPanel
          item={selected}
          open={aiOpen}
          width={aiWidth}
          x={aiPos.x}
          y={aiPos.y}
          panelRef={panelRef}
          onClose={() => setAiOpen(false)}
          onDragStart={(event) => startDrag(event)}
          onResizeStart={(event) => startResize(event)}
        />
      ) : null}
    </div>
  )
}
