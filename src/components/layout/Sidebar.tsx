import { NavLink, useNavigate } from 'react-router-dom'
import { Bell, Settings } from 'lucide-react'
import { getInitials } from '../../utils/helpers'
import { USER_NAME, USER_EMAIL } from '../../data/constants'
import { useActionItems } from '../../context/ActionItemsContext'

const navItems = [
  { to: '/', label: 'Feed', end: true },
  { to: '/calendar', label: 'Calendar' },
  { to: '/meetings', label: 'Meetings' },
  { to: '/action-items', label: 'Actions', badge: true },
]

export function Sidebar() {
  const navigate = useNavigate()
  const { openActionCount } = useActionItems()

  return (
    <aside className="hidden w-[260px] shrink-0 flex-col border-r border-neutral-border bg-surface lg:flex">
      <div className="flex h-[4.25rem] items-center px-6 border-b border-neutral-border">
        {/* Brand */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="focus-ring group flex shrink-0 items-center gap-2.5 rounded-md px-1"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-brand-teal text-[15px] font-extrabold text-neutral-inverse transition-transform duration-200 group-hover:scale-105">
            A
          </span>
          <span className="text-[16px] font-bold tracking-tight text-neutral-text">
            AvaadaMeet
          </span>
        </button>
      </div>

      <nav className="flex-1 px-4 py-6" aria-label="Primary">
        <div className="text-micro font-semibold uppercase tracking-wider text-neutral-muted px-2 mb-3">Workspace</div>
        <ul className="flex flex-col gap-1.5">
          {navItems.map(({ to, label, end, badge }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `focus-ring relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-body transition-colors duration-200 ${
                    isActive
                      ? 'bg-brand-tealLight font-semibold text-brand-teal'
                      : 'text-neutral-muted hover:bg-[var(--interactive-hover)] hover:text-neutral-text'
                  }`
                }
              >
                {label}
                {badge && openActionCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1.5 text-[11px] font-bold leading-none text-neutral-inverse">
                    {openActionCount}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Utilities */}
      <div className="border-t border-neutral-border p-4">
        <ul className="flex flex-col gap-1 mb-4">
          <li>
            <button className="focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2 text-body text-neutral-muted transition-colors hover:bg-[var(--interactive-hover)] hover:text-neutral-text">
              <Bell className="h-4.5 w-4.5" strokeWidth={1.75} />
              Notifications
            </button>
          </li>
          <li>
            <button className="focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2 text-body text-neutral-muted transition-colors hover:bg-[var(--interactive-hover)] hover:text-neutral-text">
              <Settings className="h-4.5 w-4.5" strokeWidth={1.75} />
              Settings
            </button>
          </li>
        </ul>

        {/* Profile */}
        <button className="focus-ring flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[var(--interactive-hover)] border border-neutral-border bg-surface-canvas shadow-xs">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy text-[12px] font-bold text-neutral-inverse">
            {getInitials(USER_NAME)}
          </span>
          <div className="flex flex-col items-start overflow-hidden text-left">
            <span className="truncate text-body font-semibold text-neutral-text">{USER_NAME}</span>
            <span className="truncate text-caption text-neutral-muted">{USER_EMAIL}</span>
          </div>
        </button>
      </div>
    </aside>
  )
}
