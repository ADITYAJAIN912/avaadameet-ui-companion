import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

export type TextSize = 'default' | 'large' | 'xlarge'

interface LayoutContextValue {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  companionOpen: boolean
  setCompanionOpen: (open: boolean) => void
  toggleCompanion: () => void
  textSize: TextSize
  setTextSize: (size: TextSize) => void
}

const LayoutContext = createContext<LayoutContextValue | null>(null)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [companionOpen, setCompanionOpen] = useState(false)
  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    const saved = localStorage.getItem('avaada-text-size')
    return (saved === 'large' || saved === 'xlarge') ? saved : 'default'
  })

  useEffect(() => {
    const root = document.documentElement
    if (textSize === 'default') {
      root.removeAttribute('data-text-size')
    } else {
      root.setAttribute('data-text-size', textSize)
    }
    localStorage.setItem('avaada-text-size', textSize)
  }, [textSize])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const toggleCompanion = useCallback(() => {
    setCompanionOpen((prev) => !prev)
  }, [])

  const setTextSize = useCallback((size: TextSize) => {
    setTextSizeState(size)
  }, [])

  return (
    <LayoutContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        companionOpen,
        setCompanionOpen,
        toggleCompanion,
        textSize,
        setTextSize,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const ctx = useContext(LayoutContext)
  if (!ctx) throw new Error('useLayout must be used within LayoutProvider')
  return ctx
}
