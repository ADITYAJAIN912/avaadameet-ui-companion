import { AlertCircle, CalendarDays, CheckCircle2, ChevronRight, Clock, FileCheck } from 'lucide-react'
import type { CommitmentStatus, MeetingContext, MeetingContextCommitment } from '../../../types/meetingContext'
import { formatDisplayDate } from '../../../utils/helpers'
import { Avatar } from '../../ui/Avatar'
import { EmptyState } from '../../ui/EmptyState'

interface ActionsTabProps {
  context: MeetingContext
}

const statusLabel: Record<CommitmentStatus, string> = {
  proposed: 'Proposed',
  accepted: 'Accepted',
  overdue: 'Overdue',
  completed: 'Completed',
}

const statusClass: Record<CommitmentStatus, string> = {
  proposed: 'bg-surface-accent text-neutral-muted',
  accepted: 'bg-brand-tealLight text-brand-teal',
  overdue: 'bg-[#FEF2F2] text-[#DC2626]',
  completed: 'bg-[#E8F5EC] text-[#2A7A4A]',
}

const StatusIcon = ({ status }: { status: CommitmentStatus }) => {
  if (status === 'overdue') return <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} />
  if (status === 'completed') return <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
  if (status === 'proposed') return <Clock className="h-3.5 w-3.5" strokeWidth={2} />
  return <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
}

function dueDateLabel(action: MeetingContextCommitment): string {
  return action.status === 'overdue' ? `Overdue · ${formatDisplayDate(action.dueDate)}` : `Due ${formatDisplayDate(action.dueDate)}`
}

export function ActionsTab({ context }: ActionsTabProps) {
  if (context.commitments.length === 0) {
    return <EmptyState icon={FileCheck} title="Available after the meeting" description="Accepted commitments and owner follow-ups will appear here." />
  }

  return (
    <div className="space-y-4">
      {context.commitments.map((action, index) => (
        <article
          key={action.id}
          className={`focus-ring group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border bg-surface p-5 text-left transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-elevation-2 reveal reveal-${Math.min(index + 1, 6)} ${
            action.status === 'overdue' ? 'border-[#FCA5A5]/40 hover:border-[#FCA5A5]' : 'border-neutral-border/60 hover:border-brand-teal/30'
          }`}
        >
          {/* Overdue background gradient */}
          {action.status === 'overdue' && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FEF2F2]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          )}

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
            {/* Left column: Title & Status */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide ${statusClass[action.status]}`}>
                  <StatusIcon status={action.status} />
                  {statusLabel[action.status]}
                </span>
                <span className={`text-[10.5px] font-bold uppercase tracking-wider ${
                  action.priority === 'high' ? 'text-coral' : 'text-neutral-muted'
                }`}>
                  {action.priority} Priority
                </span>
              </div>
              <h2 className="mt-3 text-body-lg font-bold leading-tight tracking-[-0.01em] text-neutral-text transition-colors group-hover:text-brand-teal">
                {action.title}
              </h2>
              {action.dependencies.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {action.dependencies.map((dependency) => (
                    <span key={dependency} className="rounded-md border border-neutral-border/50 bg-surface-raised px-2 py-0.5 text-[11px] font-medium text-neutral-muted">
                      Dep: {dependency}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Right column: Owner & Meta */}
            <div className="flex shrink-0 flex-wrap items-center gap-6 lg:gap-8">
              {/* Owner */}
              <div className="flex items-center gap-3">
                <Avatar name={action.owner} size="sm" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-muted">Owner</p>
                  <p className="text-small font-semibold text-neutral-text">{action.owner}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden h-10 w-px bg-[var(--border-subtle)] lg:block" />

              {/* Due Date */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-muted">Timeline</p>
                <p className={`mt-0.5 flex items-center gap-1.5 font-mono text-small font-medium tabular-nums ${action.status === 'overdue' ? 'text-coral' : 'text-neutral-text'}`}>
                  <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {dueDateLabel(action)}
                </p>
              </div>

              {/* Action arrow */}
              <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-surface-accent text-brand-teal opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 lg:ml-4">
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
