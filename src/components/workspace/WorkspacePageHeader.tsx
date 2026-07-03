import type { ReactNode } from 'react'
import { ws } from '../../design-system/workspace'

interface WorkspacePageHeaderProps {
  title: string
  subtitle: ReactNode
  toolbar: ReactNode
  leadingExtra?: ReactNode
}

/** Shared page header shell for three-column workspace modules. */
export function WorkspacePageHeader({
  title,
  subtitle,
  toolbar,
  leadingExtra,
}: WorkspacePageHeaderProps) {
  return (
    <header className="panel-surface shrink-0">
      <div className={ws.pageHeaderInner}>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <div className={ws.pageTitleBlock}>
              <h1 className={ws.pageTitle}>{title}</h1>
              <p className={ws.meta}>{subtitle}</p>
            </div>
            {leadingExtra}
          </div>
          <div className={ws.toolbar}>
            {toolbar}
          </div>
        </div>
      </div>
    </header>
  )
}
