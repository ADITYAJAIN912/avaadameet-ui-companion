import { createContext, useContext, useState, type ReactNode } from 'react'
import { mockDashboardInsights, type DashboardInsight } from '../data/mockDashboardInsights'

interface DashboardInsightsContextValue {
  insights: DashboardInsight[]
}

const DashboardInsightsContext = createContext<DashboardInsightsContextValue | null>(null)

export function DashboardInsightsProvider({ children }: { children: ReactNode }) {
  // TODO(backend): hydrate from GET /api/v1/dashboard/insights instead of mockDashboardInsights
  const [insights] = useState<DashboardInsight[]>(mockDashboardInsights)

  return (
    <DashboardInsightsContext.Provider value={{ insights }}>
      {children}
    </DashboardInsightsContext.Provider>
  )
}

export function useDashboardInsights() {
  const ctx = useContext(DashboardInsightsContext)
  if (!ctx) throw new Error('useDashboardInsights must be used within DashboardInsightsProvider')
  return ctx
}
