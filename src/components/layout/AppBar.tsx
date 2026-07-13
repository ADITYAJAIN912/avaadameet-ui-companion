import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Bell,
  Video,
  Check,
  MessageSquare,
  RefreshCw,
  Settings,
} from 'lucide-react'
import { getInitials } from '../../utils/helpers'
import { USER_NAME, USER_EMAIL } from '../../data/constants'
import { useLayout, type TextSize } from '../../context/LayoutContext'
import { useActionItems } from '../../context/ActionItemsContext'
import { useMeetings } from '../../context/MeetingsContext'
import { Logo } from '../ui/Logo'

const navItems = [
  { to: '/', label: 'Today', end: true },
  { to: '/calendar', label: 'Calendar' },
  { to: '/meetings', label: 'Meetings' },
  { to: '/action-items', label: 'Actions', badge: true },
]

interface NotificationItem {
  id: string
  title: string
  detail: string
  time: string
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Summary ready to review',
    detail: 'AI summary for your last meeting is ready for approval.',
    time: '10 min ago',
  },
  {
    id: 'n2',
    title: 'Action item overdue',
    detail: 'One of your open action items passed its due date.',
    time: '1 hr ago',
  },
  {
    id: 'n3',
    title: 'Meeting notes shared',
    detail: 'Notes from the leadership sync were shared with you.',
    time: 'Yesterday',
  },
]

const textSizeOptions: { value: TextSize; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'large', label: 'Large' },
  { value: 'xlarge', label: 'Extra large' },
]

export function AppBar() {
  const navigate = useNavigate()
  const { textSize, setTextSize } = useLayout()
  const { openActionCount } = useActionItems()
  const { upcomingForHome } = useMeetings()

  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [lastUpdated, setLastUpdated] = useState('9:42 AM')
  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const nextMeeting = upcomingForHome[0]
  const unreadCount = initialNotifications.length - readIds.size

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleRefresh() {
    setLastUpdated(
      new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    )
  }

  return (
    <header className="sticky top-0 z-sticky shrink-0 bg-surface-canvas/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] w-full max-w-[1120px] items-center justify-between gap-4 px-4 md:px-7">
      {/* Brand — Custom SVG Logo */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="focus-ring group flex shrink-0 items-center gap-2.5 rounded-md px-1 transition-transform duration-200 hover:scale-105"
        aria-label="Avaada — go to Today"
      >
        <Logo size="md" withText />
      </button>

      {/* Primary navigation — floating pill track */}
      <nav
        className="hidden h-full items-center md:flex"
        aria-label="Primary"
      >
        <div className="flex items-center gap-1 rounded-full border border-neutral-border bg-surface p-1">
          {navItems.map(({ to, label, end, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `focus-ring relative flex items-center gap-2 rounded-full px-[18px] py-2 text-[13.5px] font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'bg-brand-teal text-neutral-inverse'
                    : 'text-neutral-muted hover:text-neutral-text'
                }`
              }
            >
              {label}
              {badge && openActionCount > 0 && (
                <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-coral px-1.5 text-[10.5px] font-bold leading-none text-neutral-inverse">
                  {openActionCount}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Right cluster */}
      <div className="flex shrink-0 items-center gap-1.5">


        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            className="focus-ring relative flex h-11 w-11 items-center justify-center rounded-full text-neutral-muted transition-colors hover:bg-[var(--interactive-hover)] hover:text-neutral-text"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            aria-expanded={notifOpen}
          >
            <Bell className="h-5 w-5" strokeWidth={1.75} />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-coral ring-2 ring-[var(--surface-canvas)]" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full z-dropdown mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-lg border border-neutral-border bg-surface shadow-lg">
              <div className="flex items-center justify-between border-b border-neutral-border/60 px-4 py-3">
                <span className="text-body font-semibold text-neutral-text">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setReadIds(new Set(initialNotifications.map((n) => n.id)))}
                    className="focus-ring rounded-md px-2 py-1 text-caption font-medium text-brand-teal hover:bg-brand-tealLight"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <ul className="max-h-96 overflow-y-auto py-1">
                {initialNotifications.map((n) => {
                  const read = readIds.has(n.id)
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => setReadIds((prev) => new Set(prev).add(n.id))}
                        className="focus-ring flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--interactive-hover)]"
                      >
                        <span
                          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${read ? 'bg-transparent' : 'bg-brand-teal'}`}
                          aria-hidden
                        />
                        <span className="min-w-0">
                          <span className={`block text-body ${read ? 'font-normal text-neutral-muted' : 'font-semibold text-neutral-text'}`}>
                            {n.title}
                          </span>
                          <span className="block text-caption text-neutral-muted">{n.detail}</span>
                          <span className="mt-0.5 block text-small text-neutral-muted/80">{n.time}</span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Join now CTA */}
        {nextMeeting && (
          <button
            type="button"
            onClick={() => navigate('/')}
            className="focus-ring hidden h-10 items-center gap-2 rounded-[12px] bg-brand-teal px-5 text-body font-bold text-neutral-inverse transition-colors hover:bg-brand-tealHover sm:flex"
          >
            <Video className="h-4.5 w-4.5" strokeWidth={1.75} />
            Join now
          </button>
        )}

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className="focus-ring ml-1 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-[var(--interactive-hover)]"
            aria-label="Account and settings"
            aria-expanded={profileOpen}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C8D4C8] bg-surface-accent text-[12.5px] font-extrabold text-brand-teal"
            >
              {getInitials(USER_NAME)}
            </span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full z-dropdown mt-2 w-72 rounded-lg border border-neutral-border bg-surface shadow-lg">
              <div className="border-b border-neutral-border/60 px-4 py-3">
                <p className="text-body font-semibold text-neutral-text">{USER_NAME}</p>
                <p className="truncate text-caption text-neutral-muted">{USER_EMAIL}</p>
              </div>

              <div className="border-b border-neutral-border/60 px-4 py-3">
                <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-neutral-muted">
                  Text size
                </p>
                <div className="flex flex-col gap-1" role="radiogroup" aria-label="Text size">
                  {textSizeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={textSize === opt.value}
                      onClick={() => setTextSize(opt.value)}
                      className={`focus-ring flex h-10 items-center justify-between rounded-md px-3 text-body transition-colors ${
                        textSize === opt.value
                          ? 'bg-brand-tealLight font-semibold text-brand-teal'
                          : 'text-neutral-text hover:bg-[var(--interactive-hover)]'
                      }`}
                    >
                      {opt.label}
                      {textSize === opt.value && <Check className="h-4 w-4" strokeWidth={2} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="focus-ring flex h-11 w-full items-center gap-3 px-4 text-body text-neutral-text transition-colors hover:bg-[var(--interactive-hover)]"
                >
                  <RefreshCw className="h-4.5 w-4.5 text-neutral-muted" strokeWidth={1.75} />
                  Refresh
                  <span className="ml-auto text-caption text-neutral-muted">{lastUpdated}</span>
                </button>
                <button
                  type="button"
                  className="focus-ring flex h-11 w-full items-center gap-3 px-4 text-body text-neutral-text transition-colors hover:bg-[var(--interactive-hover)]"
                >
                  <MessageSquare className="h-4.5 w-4.5 text-neutral-muted" strokeWidth={1.75} />
                  Send feedback
                </button>
                <button
                  type="button"
                  className="focus-ring flex h-11 w-full items-center gap-3 px-4 text-body text-neutral-text transition-colors hover:bg-[var(--interactive-hover)]"
                >
                  <Settings className="h-4.5 w-4.5 text-neutral-muted" strokeWidth={1.75} />
                  Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </header>
  )
}
