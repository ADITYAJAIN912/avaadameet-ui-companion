import { TODAY } from '../../data/constants'

export type DateFilter = 'today' | 'tomorrow' | 'this-week' | 'custom'

interface FilterChipsProps {
  value: DateFilter
  onChange: (value: DateFilter) => void
  customDate?: string
  onCustomDateChange?: (date: string) => void
}

const filters: { value: DateFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'this-week', label: 'This Week' },
  { value: 'custom', label: 'Custom' },
]

export function FilterChips({
  value,
  onChange,
  customDate = TODAY,
  onCustomDateChange,
}: FilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        role="group"
        aria-label="Date filter"
        className="flex gap-1 overflow-x-auto rounded-full border border-neutral-border bg-surface p-1"
      >
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            aria-pressed={value === filter.value}
            className={`focus-ring shrink-0 rounded-full px-[18px] py-2 text-body font-semibold transition-all duration-200 ${
              value === filter.value
                ? 'bg-brand-teal text-neutral-inverse'
                : 'text-neutral-muted hover:text-neutral-text'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      {value === 'custom' && onCustomDateChange && (
        <input
          type="date"
          value={customDate}
          onChange={(e) => onCustomDateChange(e.target.value)}
          className="focus-ring rounded-[12px] border border-neutral-border bg-surface px-5 py-[11px] font-mono text-small text-neutral-text tabular-nums transition-all duration-200 hover:border-brand-teal"
          aria-label="Pick a custom date"
        />
      )}
    </div>
  )
}
