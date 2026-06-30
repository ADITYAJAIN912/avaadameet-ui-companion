import { SlidersHorizontal } from 'lucide-react'
import type { CalendarFilterCategory } from '../../types/calendar'
import { Chip } from '../ui/Chip'
import { Button } from '../ui/Button'

const filters: { value: CalendarFilterCategory; label: string }[] = [
  { value: 'all', label: 'All Events' },
  { value: 'meetings', label: 'Meetings' },
  { value: 'standups', label: 'Standups' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'personal', label: 'Personal' },
]

interface CalendarFilterBarProps {
  value: CalendarFilterCategory
  onChange: (value: CalendarFilterCategory) => void
  dateLabel: string
}

export function CalendarFilterBar({ value, onChange, dateLabel }: CalendarFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <Chip
            key={f.value}
            label={f.label}
            active={value === f.value}
            onClick={() => onChange(f.value)}
          />
        ))}
        <Button variant="secondary" className="h-9 gap-1.5 px-3 text-caption" aria-label="Filter options">
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} />
          Filter
        </Button>
      </div>
      <p className="text-caption text-neutral-muted">{dateLabel}</p>
    </div>
  )
}
