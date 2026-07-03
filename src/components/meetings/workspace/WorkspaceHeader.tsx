import { Shield } from 'lucide-react'
import { SearchInput } from '../../ui/SearchInput'
import { WorkspaceAiToggle, WorkspacePageHeader } from '../../workspace'
import { FilterChips, type DateFilter } from '../FilterChips'
import { ws } from './workspaceUi'

interface WorkspaceHeaderProps {
  search: string
  onSearchChange: (value: string) => void
  periodLabel: string
  dateFilter: DateFilter
  onDateFilterChange: (value: DateFilter) => void
  customDate: string
  onCustomDateChange: (date: string) => void
  copilotOpen: boolean
  copilotDisabled: boolean
  onToggleCopilot: () => void
}

function CaptureBadge() {
  return (
    <div
      className="flex h-9 shrink-0 items-center gap-2 rounded-lg bg-surface-sunken/80 px-2.5"
      aria-label="Capture policy placeholder"
    >
      <Shield className="h-3.5 w-3.5 text-neutral-muted" strokeWidth={1.75} aria-hidden />
      <p className={ws.meta}>
        <span className={ws.metaStrong}>Capture</span>
        {' · '}
        Botless default
      </p>
    </div>
  )
}

export function WorkspaceHeader({
  search,
  onSearchChange,
  periodLabel,
  dateFilter,
  onDateFilterChange,
  customDate,
  onCustomDateChange,
  copilotOpen,
  copilotDisabled,
  onToggleCopilot,
}: WorkspaceHeaderProps) {
  return (
    <WorkspacePageHeader
      title="Meeting Workspace"
      subtitle={
        <>
          <span className={ws.metaStrong}>{periodLabel}</span>
        </>
      }
      leadingExtra={
        <div className="lg:hidden">
          <CaptureBadge />
        </div>
      }
      toolbar={
        <>
          <WorkspaceAiToggle
            open={copilotOpen}
            disabled={copilotDisabled}
            onClick={onToggleCopilot}
          />
          <FilterChips
            value={dateFilter}
            onChange={onDateFilterChange}
            customDate={customDate}
            onCustomDateChange={onCustomDateChange}
          />
          <div className="hidden lg:block">
            <CaptureBadge />
          </div>
          <div className="w-full min-w-[12rem] flex-1 sm:w-52 sm:flex-none lg:w-56 xl:w-64">
            <SearchInput
              placeholder="Search meetings…"
              value={search}
              onChange={onSearchChange}
              className="w-full"
            />
          </div>
        </>
      }
    />
  )
}
