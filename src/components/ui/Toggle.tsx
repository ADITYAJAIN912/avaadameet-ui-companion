interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  ariaLabel?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  /** Partially on — click always enables (checkbox indeterminate → checked). */
  indeterminate?: boolean
}

export function Toggle({
  checked,
  onChange,
  label,
  ariaLabel,
  disabled = false,
  size = 'sm',
  indeterminate = false,
}: ToggleProps) {
  const trackSize = size === 'sm' ? 'h-6 w-11' : 'h-7 w-[3.25rem]'
  const thumbSize = size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'
  const translate = indeterminate
    ? size === 'sm'
      ? 'translate-x-2.5'
      : 'translate-x-3.5'
    : checked
      ? size === 'sm'
        ? 'translate-x-[1.375rem]'
        : 'translate-x-[1.625rem]'
      : 'translate-x-0.5'

  const trackColor = indeterminate
    ? 'bg-brand-teal/50'
    : checked
      ? 'bg-brand-teal'
      : 'bg-neutral-border'

  const switchLabel = ariaLabel ?? label ?? 'Toggle'

  function handleClick() {
    if (disabled) return
    if (indeterminate) {
      onChange(true)
    } else {
      onChange(!checked)
    }
  }

  return (
    <label
      className={`inline-flex items-center gap-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-label={label ? undefined : switchLabel}
        disabled={disabled}
        onClick={handleClick}
        className={`focus-ring relative inline-flex shrink-0 items-center rounded-full ease-premium ${trackSize} ${trackColor}`}
      >
        {indeterminate ? (
          <span
            className="absolute left-1/2 top-1/2 h-0.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-opacity duration-200"
            aria-hidden
          />
        ) : (
          <span
            className={`inline-block rounded-full bg-white shadow-sm ease-premium ${thumbSize} ${translate}`}
          />
        )}
      </button>
      {label && (
        <span
          className={`text-body ${checked || indeterminate ? 'text-brand-teal font-medium' : 'text-neutral-muted'}`}
        >
          {label}
        </span>
      )}
    </label>
  )
}
