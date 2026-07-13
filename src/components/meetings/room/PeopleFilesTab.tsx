import { FileText, Users } from 'lucide-react'
import type { MeetingContext } from '../../../types/meetingContext'
import { Avatar } from '../../ui/Avatar'
import { EmptyState } from '../../ui/EmptyState'

interface PeopleFilesTabProps {
  context: MeetingContext
}

export function PeopleFilesTab({ context }: PeopleFilesTabProps) {
  const hasContent =
    context.peopleMentioned.length > 0 ||
    context.linkedProjects.length > 0 ||
    context.relatedDocuments.length > 0 ||
    context.relatedThreads.length > 0 ||
    context.intelligence.crossMeeting.sharedDecisions.length > 0 ||
    context.intelligence.crossMeeting.repeatedTopics.length > 0

  if (!hasContent) {
    return <EmptyState icon={Users} title="No linked context yet" description="People, projects, documents, and decision threads will collect here." />
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {context.peopleMentioned.length > 0 ? (
        <section className="card-surface reveal p-[22px]">
          <p className="kicker">Directory</p>
          <h2 className="text-card-title font-extrabold tracking-[-0.01em] text-neutral-text">People</h2>
          <div className="mt-4 space-y-3">
            {context.peopleMentioned.map((person, index) => (
              <div key={person.name} className={`card-surface-interactive flex items-center gap-3 p-3 reveal reveal-${Math.min(index + 1, 6)}`}>
                <Avatar name={person.name} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-body font-semibold text-neutral-text">{person.name}</p>
                  {person.role ? <p className="truncate text-caption text-neutral-muted">{person.role}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {context.linkedProjects.length > 0 ? (
        <section className="card-surface reveal reveal-1 p-[22px]">
          <p className="kicker">Portfolio</p>
          <h2 className="text-card-title font-extrabold tracking-[-0.01em] text-neutral-text">Linked projects</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {context.linkedProjects.map((project) => (
              <span key={project.id} className="rounded-full bg-surface-accent px-[11px] py-1 text-micro font-bold text-brand-teal">{project.name}</span>
            ))}
          </div>
        </section>
      ) : null}

      {context.relatedDocuments.length > 0 ? (
        <section className="card-surface reveal reveal-2 p-[22px]">
          <p className="kicker">Archive</p>
          <h2 className="text-card-title font-extrabold tracking-[-0.01em] text-neutral-text">Documents</h2>
          <div className="mt-4 space-y-3">
            {context.relatedDocuments.map((doc, index) => (
              <div key={doc.id} className={`card-surface-interactive flex items-center gap-3 p-3 reveal reveal-${Math.min(index + 1, 6)}`}>
                <FileText className="h-5 w-5 shrink-0 text-brand-teal" strokeWidth={1.8} aria-hidden />
                <div className="min-w-0">
                  <p className="truncate text-body font-semibold text-neutral-text">{doc.title}</p>
                  <p className="text-caption text-neutral-muted">{doc.type}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {context.relatedThreads.length > 0 ? (
        <section className="card-surface reveal reveal-3 p-[22px]">
          <p className="kicker">Threads</p>
          <h2 className="text-card-title font-extrabold tracking-[-0.01em] text-neutral-text">Decision threads</h2>
          <div className="mt-4 space-y-3">
            {context.relatedThreads.map((thread) => (
              <div key={thread.id} className="card-surface-interactive p-3">
                <p className="text-body font-semibold text-neutral-text">{thread.title}</p>
                <p className="mt-1 font-mono text-caption uppercase tracking-[0.08em] text-neutral-muted">{thread.status}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {(context.intelligence.crossMeeting.sharedDecisions.length > 0 || context.intelligence.crossMeeting.repeatedTopics.length > 0) ? (
        <section className="card-surface reveal reveal-4 p-[22px] lg:col-span-2">
          <p className="kicker">Pattern language</p>
          <h2 className="text-card-title font-extrabold tracking-[-0.01em] text-neutral-text">Shared decisions & repeated topics</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="kicker text-neutral-muted">Shared decisions</p>
              {context.intelligence.crossMeeting.sharedDecisions.map((item) => (
                <p key={item} className="card-surface-interactive p-3 text-caption text-neutral-text">{item}</p>
              ))}
            </div>
            <div className="space-y-2">
              <p className="kicker text-neutral-muted">Repeated topics</p>
              {context.intelligence.crossMeeting.repeatedTopics.map((item) => (
                <p key={item} className="card-surface-interactive p-3 text-caption text-neutral-text">{item}</p>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
