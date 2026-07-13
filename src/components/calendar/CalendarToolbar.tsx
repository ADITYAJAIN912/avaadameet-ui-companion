import { ChevronDown, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { CalendarEventCategory, CalendarViewMode } from '../../types/calendar'
import { CALENDAR_CATEGORIES, getCategoryTheme } from './categoryTheme'

interface CalendarToolbarProps {
  monthLabel: string
  selectedDate: string
  eventCount: number
  priorityCount: number
  view: CalendarViewMode
  selectedCategories: CalendarEventCategory[]
  onViewChange: (view: CalendarViewMode) => void
  onCategoryToggle: (category: CalendarEventCategory) => void
  onSelectAllCategories: () => void
  onToday: () => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

const views: { value: CalendarViewMode; label: string }[] = [
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
  { value: 'day', label: 'Day' },
]

function getIsoWeekLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`)
  const thursday = new Date(date)
  thursday.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  const firstThursday = new Date(thursday.getFullYear(), 0, 4)
  const week = 1 + Math.round(((thursday.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7)
  return `WK ${String(week).padStart(2, '0')}`
}

export function CalendarToolbar({
  monthLabel,
  selectedDate,
  eventCount,
  priorityCount,
  view,
  selectedCategories,
  onViewChange,
  onCategoryToggle,
  onSelectAllCategories,
  onToday,
  onPrevMonth,
  onNextMonth,
}: CalendarToolbarProps) {
  const [filterOpen, setFilterOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const allSelected = selectedCategories.length === CALENDAR_CATEGORIES.length
  const weekLabel = getIsoWeekLabel(selectedDate)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!popoverRef.current?.contains(event.target as Node)) setFilterOpen(false)
    }
    if (filterOpen) document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [filterOpen])

  return (
    <header className="reveal reveal-1 shrink-0">
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end md:gap-3">
        <div className="mr-auto min-w-[16rem]">
          <p className="kicker">Calendar</p>
          <div className="mt-1.5 flex flex-wrap items-end gap-3">
            <h1 className="text-display-md font-extrabold tracking-tight text-neutral-text">{monthLabel}</h1>
            <span className="font-mono text-small tabular-nums text-brand-teal">{weekLabel}</span>
          </div>
          <p className="mt-2 text-small font-medium text-neutral-muted">
            {eventCount} event{eventCount !== 1 ? 's' : ''} this month and {priorityCount} priority action{priorityCount !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex w-full items-center justify-between gap-2 md:w-auto md:justify-start">
          <button type="button" className="focus-ring flex-1 rounded-[12px] border border-neutral-border bg-surface px-5 py-[11px] text-body font-bold text-neutral-text transition-all duration-200 hover:border-brand-teal hover:text-brand-teal md:flex-none" onClick={onToday}>Today</button>
          <div className="flex gap-2">
            <button type="button" onClick={onPrevMonth} className="focus-ring inline-flex h-[42px] w-[42px] items-center justify-center rounded-[12px] border border-neutral-border bg-surface text-neutral-muted transition-all duration-200 hover:border-brand-teal hover:text-brand-teal" aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button type="button" onClick={onNextMonth} className="focus-ring inline-flex h-[42px] w-[42px] items-center justify-center rounded-[12px] border border-neutral-border bg-surface text-neutral-muted transition-all duration-200 hover:border-brand-teal hover:text-brand-teal" aria-label="Next month">
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="relative flex-1 md:flex-none" ref={popoverRef}>
            <button type="button" className="focus-ring flex w-full items-center justify-center gap-2 rounded-[12px] border border-neutral-border bg-surface px-5 py-[11px] text-body font-bold text-neutral-text transition-all duration-200 hover:border-brand-teal hover:text-brand-teal" aria-expanded={filterOpen} aria-haspopup="menu" onClick={() => setFilterOpen((open) => !open)}>
              <Filter className="h-4 w-4" strokeWidth={1.75} />
              Filter
              <ChevronDown className="h-4 w-4" strokeWidth={1.75} />
            </button>
            {filterOpen && (
              <div className="reveal-scale absolute right-0 z-30 mt-2 w-72 rounded-lg border border-neutral-border bg-surface p-2 shadow-lg" role="menu">
                <label className="focus-within:focus-ring flex cursor-pointer items-center gap-3 rounded-[12px] px-3 py-2 text-body font-semibold text-neutral-text transition-colors hover:bg-[#F3F3EA]">
                  <input type="checkbox" checked={allSelected} onChange={onSelectAllCategories} className="h-4 w-4 accent-brand-teal" />
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-teal" aria-hidden />
                  All categories
                </label>
                <div className="my-1 h-px bg-neutral-border" />
                {CALENDAR_CATEGORIES.map(({ value, label }) => {
                  const theme = getCategoryTheme(value)
                  return (
                    <label key={value} className="focus-within:focus-ring flex cursor-pointer items-center gap-3 rounded-[12px] px-3 py-2 text-small font-semibold text-neutral-text transition-colors hover:bg-[#F3F3EA]">
                      <input type="checkbox" checked={selectedCategories.includes(value)} onChange={() => onCategoryToggle(value)} className="h-4 w-4 accent-brand-teal" />
                      <span className={`h-2.5 w-2.5 rounded-full ${theme.dot}`} aria-hidden />
                      <span className={theme.text}>{label}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex flex-1 justify-between rounded-full border border-neutral-border bg-surface p-1 md:flex-none" aria-label="Calendar view">
            {views.map((option) => {
              const active = view === option.value
              return (
                <button key={option.value} type="button" onClick={() => onViewChange(option.value)} className={`focus-ring flex-1 rounded-full px-3 md:px-[18px] py-2 text-[13.5px] font-semibold transition-colors duration-200 ${active ? 'bg-brand-teal text-neutral-inverse' : 'text-neutral-muted hover:text-neutral-text'}`} aria-pressed={active}>
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
