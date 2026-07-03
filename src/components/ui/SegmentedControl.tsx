export interface SegmentedControlOption<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[]
  value: T
  onChange: (value: T) => void
  ariaLabel?: string
  size?: 'sm' | 'md'
  className?: string
}

const trackSize = {
  sm: 'h-7 p-0.5',
  md: 'h-9 p-0.5',
} as const

const segmentSize = {
  sm: 'h-6 min-w-[2rem] px-2 text-small rounded-md',
  md: 'h-8 min-w-[2.25rem] px-2.5 text-caption rounded-md',
} as const

/**
 * Single-track segmented control — no nested borders or capsule-in-capsule styling.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel = 'Options',
  size = 'md',
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex max-w-full shrink-0 items-center gap-0.5 overflow-x-auto rounded-lg bg-neutral-bg/70 ring-1 ring-inset ring-neutral-border/50 ${trackSize[size]} ${className}`}
    >
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`focus-ring inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-150 ${segmentSize[size]} ${
              active
                ? 'bg-white text-neutral-text'
                : 'bg-transparent text-neutral-muted hover:text-neutral-text'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
