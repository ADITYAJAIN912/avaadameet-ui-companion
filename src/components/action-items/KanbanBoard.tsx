import type { ActionItem } from '../../types/actionItem'
import { KanbanColumn } from './KanbanColumn'

const columns: ActionItem['status'][] = ['Pending', 'In Process', 'Blocked', 'Done']

interface KanbanBoardProps {
  items: ActionItem[]
}

export function KanbanBoard({ items }: KanbanBoardProps) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1">
      {columns.map((status) => (
        <KanbanColumn
          key={status}
          title={status}
          items={items.filter((i) => i.status === status)}
        />
      ))}
    </div>
  )
}
