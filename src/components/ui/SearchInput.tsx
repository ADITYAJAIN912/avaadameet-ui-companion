import { forwardRef } from 'react'
import { Search } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    { value, onChange, placeholder = 'Search...', className = '' },
    forwardedRef,
  ) {
    return (
      <label
        className={`flex h-11 min-w-0 items-center gap-2.5 rounded-md border border-neutral-border bg-surface px-3 shadow-xs transition-colors focus-within:border-brand-teal hover:border-neutral-border ${className}`}
      >
        <Search className="h-4 w-4 shrink-0 text-neutral-muted" strokeWidth={1.75} aria-hidden />
        <input
          ref={forwardedRef}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-body text-neutral-text outline-none placeholder:text-neutral-muted"
        />
      </label>
    )
  },
)
