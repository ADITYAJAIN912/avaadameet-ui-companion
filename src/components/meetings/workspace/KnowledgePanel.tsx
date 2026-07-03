import {
  BookOpen,
  ChevronRight,
  FileText,
  FolderKanban,
  GitBranch,
  Link2,
  Sparkles,
  Users,
} from 'lucide-react'
import type { MeetingContext } from '../../../types/meetingContext'
import { KnowledgeMiniCard, WorkspaceEmptyState } from '../../workspace'
import { ws } from './workspaceUi'

interface KnowledgePanelProps {
  context: MeetingContext | null
  onSelectMeeting?: (meetingId: string) => void
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function KnowledgePanel({ context, onSelectMeeting }: KnowledgePanelProps) {
  return (
    <aside
      className="panel-surface hidden h-full min-h-0 min-w-0 w-full flex-col lg:flex"
      aria-label="Knowledge panel"
    >
      <div className={ws.panelHd}>
        <h2 className={ws.panelTitle}>Knowledge</h2>
        <p className={ws.meta}>
          {context ? 'Related context & linked assets' : 'Select a meeting to view related context'}
        </p>
      </div>

      <div className={ws.panelBd}>
        {!context ? (
          <WorkspaceEmptyState
            icon={<BookOpen className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            title="Knowledge context appears here"
            description="After selecting a meeting, this panel shows related meetings, decision threads, projects, documents, and people."
          />
        ) : (
          <div key={context.id} className={`${ws.contextEnter} ${ws.contextKnowledgeFlow}`}>
            <KnowledgeMiniCard icon={Sparkles} title="Overview">
              <div className={ws.knowledgeMetrics}>
                <div className={ws.knowledgeMetric}>
                  <p className={ws.fieldLabel}>Decisions</p>
                  <p className={`${ws.fieldValue} tabular-nums`}>{context.decisions.length}</p>
                </div>
                <div className={ws.knowledgeMetric}>
                  <p className={ws.fieldLabel}>Actions</p>
                  <p className={`${ws.fieldValue} tabular-nums`}>{context.commitments.length}</p>
                </div>
              </div>
            </KnowledgeMiniCard>

            {(context.intelligence.crossMeeting.sharedDecisions.length > 0 ||
              context.intelligence.crossMeeting.repeatedTopics.length > 0) && (
              <KnowledgeMiniCard icon={GitBranch} title="Context">
                {context.intelligence.crossMeeting.sharedDecisions.length > 0 && (
                  <div className={ws.knowledgeRow}>
                    <p className={ws.fieldLabel}>Shared decisions</p>
                    <ul className="mt-1.5 space-y-1">
                      {context.intelligence.crossMeeting.sharedDecisions.slice(0, 3).map((d) => (
                        <li key={d} className={ws.meta}>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {context.intelligence.crossMeeting.repeatedTopics.length > 0 && (
                  <div className={ws.knowledgeRow}>
                    <p className={ws.fieldLabel}>Recurring topics</p>
                    <p className={`mt-1.5 ${ws.meta}`}>
                      {context.intelligence.crossMeeting.repeatedTopics.join(' · ')}
                    </p>
                  </div>
                )}
              </KnowledgeMiniCard>
            )}

            <KnowledgeMiniCard
              icon={Link2}
              title="Related meetings"
              count={context.linkedMeetings.length}
            >
              {context.linkedMeetings.length === 0 ? (
                <p className={ws.knowledgeMeta}>None linked</p>
              ) : (
                context.linkedMeetings.map((meeting) => (
                  <button
                    key={meeting.id}
                    type="button"
                    onClick={() => onSelectMeeting?.(meeting.id)}
                    className={`${ws.knowledgeMeetingBtn} ${ws.interactive} group`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className={`truncate ${ws.knowledgeValue}`}>{meeting.title}</p>
                      <p className={`mt-0.5 tabular-nums ${ws.knowledgeMeta}`}>
                        {meeting.date} · {meeting.time}
                      </p>
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
              icon={GitBranch}
              title="Decision threads"
              count={context.relatedThreads.length}
            >
              {context.relatedThreads.length === 0 ? (
                <p className={ws.knowledgeMeta}>None linked</p>
              ) : (
                context.relatedThreads.map((thread) => (
                  <div key={thread.id} className={ws.knowledgeRow}>
                    <p className={ws.knowledgeValue}>{thread.title}</p>
                    <p className={ws.knowledgeMeta}>{thread.status}</p>
                  </div>
                ))
              )}
            </KnowledgeMiniCard>

            <KnowledgeMiniCard
              icon={Users}
              title="People"
              count={context.peopleMentioned.length}
            >
              {context.peopleMentioned.length === 0 ? (
                <p className={ws.knowledgeMeta}>None listed</p>
              ) : (
                context.peopleMentioned.map((person) => (
                  <div key={person.name} className={ws.knowledgePersonRow}>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-caption font-medium text-neutral-muted">
                      {initials(person.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className={`block truncate ${ws.knowledgeValue}`}>{person.name}</span>
                      {person.role ? (
                        <span className={`block truncate ${ws.knowledgeMeta}`}>{person.role}</span>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </KnowledgeMiniCard>

            <KnowledgeMiniCard
              icon={FolderKanban}
              title="Assets"
              count={context.linkedProjects.length + context.relatedDocuments.length}
            >
              {context.linkedProjects.length === 0 && context.relatedDocuments.length === 0 ? (
                <p className={ws.knowledgeMeta}>None linked</p>
              ) : (
                <>
                  {context.linkedProjects.length > 0 && (
                    <p className={ws.knowledgeMeta}>
                      {context.linkedProjects.map((project) => project.name).join(' · ')}
                    </p>
                  )}
                  {context.relatedDocuments.map((doc) => (
                    <div key={doc.id} className={ws.knowledgeDocCard}>
                      <FileText className="h-3.5 w-3.5 shrink-0 text-neutral-muted" strokeWidth={1.75} aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className={`truncate ${ws.knowledgeValue}`}>{doc.title}</p>
                        <p className={ws.knowledgeMeta}>{doc.type}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </KnowledgeMiniCard>
          </div>
        )}
      </div>
    </aside>
  )
}
