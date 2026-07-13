import { Outlet } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { AppBar } from './AppBar'
import { MobileTabBar } from './MobileTabBar'
import { MiniDayTimeline } from './MiniDayTimeline'
import { AssistantRail } from '../ai-copilot/AssistantRail'
import { useAiCopilot } from '../../context/AiCopilotContext'

export function AppLayout() {
  const { open, openDialog } = useAiCopilot()

  return (
    <div className="flex h-svh flex-col bg-neutral-bg overflow-hidden">
      <AppBar />
      <div className="flex flex-1 min-h-0">
        <MiniDayTimeline />
        <main className="mx-auto w-full max-w-[1120px] flex flex-col flex-1 min-h-0 px-4 pb-24 pt-4 md:px-7 md:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileTabBar />
      {!open && (
        <button
          type="button"
          onClick={openDialog}
          className="focus-ring group fixed bottom-24 right-4 z-raised flex items-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-xl md:bottom-8 md:right-8"
          aria-label="Open Avaada Companion"
        >
          {/* Text Pill */}
          <div className="hidden items-center justify-center rounded-full bg-brand-navy px-5 py-3 text-[14.5px] font-extrabold tracking-tight text-white shadow-lg border border-white/10 sm:flex">
            Ask your Companion
          </div>
          
          {/* Icon Circle */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-teal shadow-[var(--shadow-glow-accent)] transition-transform duration-300 group-hover:scale-105">
             <Sparkles className="h-7 w-7 text-white drop-shadow-sm" strokeWidth={2} />
          </div>
        </button>
      )}
      <AssistantRail />
    </div>
  )
}
