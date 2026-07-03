import type { BusinessImpactDimensions } from '../../../../types/decisionIntelligence'
import { ws } from '../workspaceUi'

interface BusinessImpactBlockProps {
  impact: BusinessImpactDimensions
}

const dimensions: { key: keyof BusinessImpactDimensions; label: string }[] = [
  { key: 'operational', label: 'Operational' },
  { key: 'financial', label: 'Financial' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'customer', label: 'Customer' },
]

export function BusinessImpactBlock({ impact }: BusinessImpactBlockProps) {
  const filled = dimensions.filter(({ key }) => impact[key])

  if (filled.length === 0) return null

  return (
    <div className={ws.cardSupportRow}>
      <p className={ws.fieldLabel}>Business impact</p>
      <dl className={ws.cardMetaGridFlush}>
        {filled.map(({ key, label }) => (
          <div key={key} className={ws.fieldCell}>
            <dt className={ws.fieldLabel}>{label}</dt>
            <dd className={ws.fieldValue}>{impact[key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
