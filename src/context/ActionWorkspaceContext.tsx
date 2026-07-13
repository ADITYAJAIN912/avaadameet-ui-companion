import { createContext, useContext, useState, type ReactNode } from 'react'
import { mockActionWorkspaceItems } from '../data/mockActionWorkspace'
import type { ActionWorkspaceItem } from '../types/actionWorkspace'

interface ActionWorkspaceContextValue {
  actionWorkspaceItems: ActionWorkspaceItem[]
  getActionWorkspaceItemById: (id: string) => ActionWorkspaceItem | undefined
}

const ActionWorkspaceContext = createContext<ActionWorkspaceContextValue | null>(null)

export function ActionWorkspaceProvider({ children }: { children: ReactNode }) {
  // TODO(backend): hydrate from GET /api/v1/action-items/workspace instead of mockActionWorkspaceItems
  const [actionWorkspaceItems] = useState<ActionWorkspaceItem[]>(mockActionWorkspaceItems)

  function getActionWorkspaceItemById(id: string) {
    return actionWorkspaceItems.find((item) => item.id === id)
  }

  return (
    <ActionWorkspaceContext.Provider
      value={{ actionWorkspaceItems, getActionWorkspaceItemById }}
    >
      {children}
    </ActionWorkspaceContext.Provider>
  )
}

export function useActionWorkspace() {
  const ctx = useContext(ActionWorkspaceContext)
  if (!ctx) throw new Error('useActionWorkspace must be used within ActionWorkspaceProvider')
  return ctx
}
