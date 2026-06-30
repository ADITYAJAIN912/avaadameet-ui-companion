import type { ActionItem } from '../types/actionItem'
import { TODAY } from '../data/constants'
import { formatDisplayDate } from './helpers'

export type ActionPriority = 'High' | 'Medium' | 'Low'

export type DueTone = 'overdue' | 'today' | 'tomorrow' | 'soon' | 'future' | 'done'

export interface RelativeDue {
  label: string
  tone: DueTone
  detail: string
}

/** Stable mock priority — Blocked items skew High. */
export function getActionPriority(item: ActionItem): ActionPriority {
  if (item.status === 'Blocked') return 'High'
  if (item.status === 'Done') return 'Low'
  const n = parseInt(item.id.replace(/\D/g, ''), 10) || 0
  if (n % 5 === 0 || item.openCount >= 2) return 'High'
  if (n % 2 === 0) return 'Medium'
  return 'Low'
}

export function getRelativeDue(item: ActionItem): RelativeDue {
  const detail = `${formatDisplayDate(item.date)} · ${item.time}`

  if (item.status === 'Done') {
    return { label: 'Completed', tone: 'done', detail }
  }

  const today = new Date(`${TODAY}T00:00:00`)
  const due = new Date(`${item.date}T00:00:00`)
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000)

  if (diffDays < 0) return { label: 'Overdue', tone: 'overdue', detail }
  if (diffDays === 0) return { label: 'Due Today', tone: 'today', detail }
  if (diffDays === 1) return { label: 'Tomorrow', tone: 'tomorrow', detail }
  if (diffDays <= 7) return { label: `In ${diffDays} days`, tone: 'soon', detail }
  return { label: formatDisplayDate(item.date), tone: 'future', detail }
}

export function dueToneClass(tone: DueTone): string {
  switch (tone) {
    case 'overdue':
      return 'font-medium text-status-danger'
    case 'today':
      return 'font-medium text-brand-teal'
    case 'tomorrow':
    case 'soon':
      return 'font-medium text-amber-700/90'
    case 'done':
      return 'text-neutral-muted/80'
    default:
      return 'text-neutral-muted'
  }
}

export function isActionItemOverdue(item: ActionItem): boolean {
  if (item.status === 'Done') return false
  return getRelativeDue(item).tone === 'overdue'
}

export interface ColumnMetrics {
  total: number
  overdue: number
  highPriority: number
}

export function getColumnMetrics(items: ActionItem[]): ColumnMetrics {
  return {
    total: items.length,
    overdue: items.filter(isActionItemOverdue).length,
    highPriority: items.filter((i) => getActionPriority(i) === 'High').length,
  }
}
