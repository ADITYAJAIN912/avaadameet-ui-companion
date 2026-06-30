export interface DashboardInsight {
  id: string
  label: string
  value: string
  tone?: 'neutral' | 'warning' | 'positive'
}

/** Realistic executive dashboard insights — mock only. */
export const mockDashboardInsights: DashboardInsight[] = [
  {
    id: 'load',
    label: 'Meeting load',
    value: '6.5 hrs scheduled today',
    tone: 'warning',
  },
  {
    id: 'focus',
    label: 'Focus time available',
    value: '2h 15m between meetings',
    tone: 'positive',
  },
  {
    id: 'slot',
    label: 'Longest free slot',
    value: '1h 30m · 2:30–4:00pm',
    tone: 'neutral',
  },
  {
    id: 'urgent',
    label: 'Recommendation',
    value: 'Review board deck before 4pm client call',
    tone: 'warning',
  },
]
