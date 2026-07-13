import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { AvaadaCopilotConfig } from '../components/workspace/copilot/copilotTypes'

export type AiCopilotView = 'picker' | 'chat'

interface AiCopilotContextValue {
  /** Config supplied by the current page's selected meeting/action item, if any. */
  pageConfig: AvaadaCopilotConfig | null
  setPageConfig: (config: AvaadaCopilotConfig | null) => void
  /** Config the user explicitly picked inside the dialog (overrides pageConfig until cleared). */
  pickedConfig: AvaadaCopilotConfig | null
  selectConfig: (config: AvaadaCopilotConfig) => void
  activeConfig: AvaadaCopilotConfig | null
  view: AiCopilotView
  open: boolean
  openDialog: () => void
  closeDialog: () => void
  openPicker: () => void
}

const AiCopilotContext = createContext<AiCopilotContextValue | null>(null)

export function AiCopilotProvider({ children }: { children: ReactNode }) {
  const [pageConfig, setPageConfigState] = useState<AvaadaCopilotConfig | null>(null)
  const [pickedConfig, setPickedConfig] = useState<AvaadaCopilotConfig | null>(null)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<AiCopilotView>('picker')

  const setPageConfig = useCallback((config: AvaadaCopilotConfig | null) => {
    setPageConfigState(config)
    // A fresh page-level selection always takes priority over a stale picked one.
    setPickedConfig(null)
  }, [])

  const activeConfig = pickedConfig ?? pageConfig

  const openDialog = useCallback(() => {
    setView(activeConfig ? 'chat' : 'picker')
    setOpen(true)
  }, [activeConfig])

  const closeDialog = useCallback(() => setOpen(false), [])

  const openPicker = useCallback(() => setView('picker'), [])

  const selectConfig = useCallback((config: AvaadaCopilotConfig) => {
    setPickedConfig(config)
    setView('chat')
  }, [])

  return (
    <AiCopilotContext.Provider
      value={{
        pageConfig,
        setPageConfig,
        pickedConfig,
        selectConfig,
        activeConfig,
        view,
        open,
        openDialog,
        closeDialog,
        openPicker,
      }}
    >
      {children}
    </AiCopilotContext.Provider>
  )
}

export function useAiCopilot() {
  const ctx = useContext(AiCopilotContext)
  if (!ctx) throw new Error('useAiCopilot must be used within AiCopilotProvider')
  return ctx
}
