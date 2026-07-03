import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { workspaceIcon, ws, wsCount } from '../../design-system/workspace'

interface KnowledgeMiniCardProps {
  icon: LucideIcon
  title: string
  count?: number
  children: ReactNode
}

export function KnowledgeMiniCard({ icon: Icon, title, count, children }: KnowledgeMiniCardProps) {
  return (
    <article className={ws.knowledgeMiniCard}>
      <header className={ws.knowledgeMiniHd}>
        <div className="flex min-w-0 items-center gap-2">
          <Icon
            className={`${workspaceIcon.sm} shrink-0 text-neutral-muted`}
            strokeWidth={workspaceIcon.stroke}
            aria-hidden
          />
          <h3 className={ws.knowledgeMiniTitle}>{title}</h3>
        </div>
        {count !== undefined ? <span className={wsCount}>{count}</span> : null}
      </header>
      <div className={ws.knowledgeMiniBd}>{children}</div>
    </article>
  )
}
