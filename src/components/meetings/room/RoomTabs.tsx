export type RoomTab = 'overview' | 'decisions' | 'actions' | 'timeline' | 'people-files'

interface RoomTabsProps {
  value: RoomTab
  onChange: (tab: RoomTab) => void
}

const tabs: { value: RoomTab; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'decisions', label: 'Decisions' },
  { value: 'actions', label: 'Actions' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'people-files', label: 'People & files' },
]

export function RoomTabs({ value, onChange }: RoomTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Meeting room sections"
      className="relative flex gap-0 overflow-x-auto border-b border-[var(--border-subtle)]"
    >
      {tabs.map((tab) => {
        const selected = value === tab.value
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`room-panel-${tab.value}`}
            id={`room-tab-${tab.value}`}
            onClick={() => onChange(tab.value)}
            className={`focus-ring relative shrink-0 px-5 py-3 text-body font-semibold transition-colors duration-200 ${
              selected
                ? 'text-brand-teal'
                : 'text-neutral-muted hover:text-neutral-text'
            }`}
          >
            {tab.label}
            {/* Underline indicator */}
            {selected && (
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full bg-brand-teal"
                aria-hidden
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
