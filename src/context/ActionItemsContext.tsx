import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { mockActionItems, sortActionItems } from '../data/mockActionItems'
import { TODAY } from '../data/constants'
import type { ActionItem } from '../types/actionItem'

interface OpenActionStats {
  total: number
  overdue: number
  dueToday: number
}

interface ActionItemsContextValue {
  actionItems: ActionItem[]
  openActionCount: number
  openActionStats: OpenActionStats
  topOpenActionItems: (limit: number) => ActionItem[]
}

const ActionItemsContext = createContext<ActionItemsContextValue | null>(null)

export function ActionItemsProvider({ children }: { children: ReactNode }) {
  // TODO(backend): hydrate from GET /api/v1/action-items instead of mockActionItems
  const [actionItems] = useState<ActionItem[]>(mockActionItems)

  const openActionCount = useMemo(
    () => actionItems.filter((a) => a.status !== 'Done').length,
    [actionItems],
  )

  const openActionStats = useMemo<OpenActionStats>(() => {
    const open = actionItems.filter((a) => a.status !== 'Done')
    return {
      total: open.length,
      overdue: open.filter((a) => a.date < TODAY).length,
      dueToday: open.filter((a) => a.date === TODAY).length,
    }
  }, [actionItems])

  const topOpenActionItems = useMemo(
    () => (limit: number) =>
      sortActionItems(actionItems.filter((a) => a.status !== 'Done')).slice(0, limit),
    [actionItems],
  )

  return (
    <ActionItemsContext.Provider
      value={{ actionItems, openActionCount, openActionStats, topOpenActionItems }}
    >
      {children}
    </ActionItemsContext.Provider>
  )
}

export function useActionItems() {
  const ctx = useContext(ActionItemsContext)
  if (!ctx) throw new Error('useActionItems must be used within ActionItemsProvider')
  return ctx
}
