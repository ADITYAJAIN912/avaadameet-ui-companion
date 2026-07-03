import type { ReactNode } from 'react'
import { ws, wsCount } from './workspaceUi'

interface WorkspaceSectionProps {
  title: string
  label?: string
  question?: string
  children: ReactNode
  count?: number
  variant?: 'default' | 'hero' | 'secondary' | 'tier'
  scrollBody?: boolean
}

const variantClass: Record<NonNullable<WorkspaceSectionProps['variant']>, string> = {
  default: '',
  hero: ws.sectionCardHero,
  secondary: ws.sectionCardSecondary,
  tier: ws.sectionCardTier,
}

export function WorkspaceSection({
  title,
  label,
  question,
  children,
  count,
  variant = 'default',
  scrollBody = false,
}: WorkspaceSectionProps) {
  const isHero = variant === 'hero'
  const isTier = variant === 'tier'
  const heroLead = isHero ? (question ?? label) : undefined
  const sectionLabel = !isTier && !isHero ? (label ?? question) : undefined
  const labelFirst = Boolean(label) && !isTier && !isHero
  const bodyClass = scrollBody ? ws.sectionBdScroll : ws.sectionBd

  return (
    <section className={`${ws.sectionCard} ${variantClass[variant]}`}>
      <div className={ws.sectionHd}>
        <div className="min-w-0">
          {isHero ? (
            <>
              <h3 className="sr-only">{title}</h3>
              {heroLead ? (
                <p className={ws.sectionQuestionHero}>{heroLead}</p>
              ) : (
                <h3 className={ws.sectionTitle}>{title}</h3>
              )}
            </>
          ) : labelFirst ? (
            <>
              {sectionLabel ? (
                <p className={ws.sectionQuestion}>{sectionLabel}</p>
              ) : null}
              <h3 className={ws.sectionTitle}>{title}</h3>
            </>
          ) : (
            <>
              <h3 className={ws.sectionTitle}>{title}</h3>
              {sectionLabel ? (
                <p className={ws.sectionQuestion}>{sectionLabel}</p>
              ) : null}
            </>
          )}
        </div>
        {count !== undefined ? <span className={wsCount}>{count}</span> : null}
      </div>
      <div className={bodyClass}>{children}</div>
    </section>
  )
}
