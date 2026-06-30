import type { CalendarEventCategory, CalendarEventColor } from '../types/calendar'

/** Blue = internal, Green = standups, Purple = reviews, Orange = client, Gray = personal */
const categoryColorMap: Record<CalendarEventCategory, CalendarEventColor> = {
  meeting: 'blue',
  engineering: 'blue',
  leadership: 'blue',
  compliance: 'blue',
  standup: 'green',
  review: 'purple',
  sales: 'orange',
  board: 'orange',
  personal: 'gray',
}

const colorStyles: Record<
  CalendarEventColor,
  { pill: string; stripe: string; card: string; dot: string }
> = {
  blue: {
    pill: 'bg-blue-50/90 text-blue-900 ring-1 ring-blue-100/70',
    stripe: 'border-l-blue-400',
    card: 'border-l-blue-400 bg-blue-50/35',
    dot: 'bg-blue-400',
  },
  green: {
    pill: 'bg-emerald-50/90 text-emerald-900 ring-1 ring-emerald-100/70',
    stripe: 'border-l-emerald-500',
    card: 'border-l-emerald-500 bg-emerald-50/35',
    dot: 'bg-emerald-500',
  },
  purple: {
    pill: 'bg-violet-50/90 text-violet-900 ring-1 ring-violet-100/70',
    stripe: 'border-l-violet-400',
    card: 'border-l-violet-400 bg-violet-50/35',
    dot: 'bg-violet-400',
  },
  orange: {
    pill: 'bg-amber-50/90 text-amber-900 ring-1 ring-amber-100/70',
    stripe: 'border-l-amber-400',
    card: 'border-l-amber-400 bg-amber-50/35',
    dot: 'bg-amber-400',
  },
  red: {
    pill: 'bg-red-50/90 text-red-900 ring-1 ring-red-100/70',
    stripe: 'border-l-red-400',
    card: 'border-l-red-400 bg-red-50/35',
    dot: 'bg-red-400',
  },
  gray: {
    pill: 'bg-neutral-bg text-neutral-text ring-1 ring-neutral-border/50',
    stripe: 'border-l-neutral-border',
    card: 'border-l-neutral-border bg-neutral-bg/70',
    dot: 'bg-neutral-muted',
  },
}

export function getEventColor(category: CalendarEventCategory): CalendarEventColor {
  return categoryColorMap[category]
}

export function getEventStyles(category: CalendarEventCategory) {
  return colorStyles[getEventColor(category)]
}
