import { NavLink } from 'react-router-dom'
import { Home, Video, CheckSquare, Calendar } from 'lucide-react'
import { useActionItems } from '../../context/ActionItemsContext'

const tabs = [
  { to: '/', icon: Home, label: 'Today', end: true },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/meetings', icon: Video, label: 'Meetings' },
  { to: '/action-items', icon: CheckSquare, label: 'Actions', badge: true },
]

export function MobileTabBar() {
  const { openActionCount: actionCount } = useActionItems()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-neutral-border bg-surface/85 backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
      {tabs.map(({ to, icon: Icon, label, end, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `focus-ring relative flex flex-1 flex-col items-center gap-1 py-3 text-caption font-medium transition-colors duration-200 ${
              isActive ? 'text-brand-teal' : 'text-neutral-muted'
            }`
          }
        >
          <div className="relative">
            <Icon className="h-5 w-5" />
            {badge && actionCount > 0 && (
              <span className="absolute -right-2 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-coral px-1 text-[10px] font-semibold text-neutral-inverse">
                {actionCount}
              </span>
            )}
          </div>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
