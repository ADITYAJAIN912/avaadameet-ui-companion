import { useMemo } from 'react'
import { Calendar, Mail, CheckSquare, Clock } from 'lucide-react'
import { StatCard } from '../components/ui/StatCard'
import { UpcomingSection } from '../components/home/UpcomingRow'
import { ExecutiveSummary } from '../components/home/ExecutiveSummary'
import { DashboardBriefPanel } from '../components/home/DashboardBriefPanel'
import { HomePageSkeleton } from '../components/ui/Skeleton'
import { TODAY, USER_NAME } from '../data/constants'
import { getOpenActionStats, sortActionItems, mockActionItems } from '../data/mockActionItems'
import { formatLongDate } from '../utils/helpers'
import { useMeetings } from '../context/MeetingsContext'
import { usePageLoading } from '../hooks/usePageLoading'

export function Home() {
  const isLoading = usePageLoading(400)
  const {
    meetings,
    upcomingForHome,
    recentToday,
    meetingsThisWeekCount,
    upcomingTodayCount,
    updateAutoJoin,
  } = useMeetings()

  const actionStats = getOpenActionStats()
  const meetingsTodayCount = useMemo(
    () => meetings.filter((m) => m.date === TODAY).length,
    [meetings],
  )

  const priorityActions = useMemo(
    () => sortActionItems(mockActionItems.filter((a) => a.status !== 'Done')).slice(0, 2),
    [],
  )

  if (isLoading) {
    return <HomePageSkeleton />
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-2.5 lg:max-h-[calc(100dvh-8.25rem)] lg:overflow-hidden">
      <ExecutiveSummary
        userName={USER_NAME}
        dateLabel={formatLongDate()}
        meetingsToday={meetingsTodayCount}
        upcomingCount={upcomingTodayCount}
        openActions={actionStats.total}
      />

      <div className="grid shrink-0 grid-cols-2 gap-2 lg:grid-cols-4">
        <StatCard
          value={meetingsThisWeekCount}
          label="Meetings"
          icon={Calendar}
          to="/meetings?filter=this-week"
          trend="18% vs last week"
          trendPositive
          caption="Highest this month"
        />
        <StatCard
          value={47}
          label="Emails Delivered"
          icon={Mail}
          to="/meetings"
          trend="12% this month"
          trendPositive
          caption="Delivery rate 98.4%"
        />
        <StatCard
          value={actionStats.total}
          label="Open Actions"
          icon={CheckSquare}
          to="/action-items?filter=open"
          trend={
            actionStats.overdue > 0 ? `${actionStats.overdue} overdue` : 'None overdue'
          }
          trendNegative={actionStats.overdue > 0}
          caption={
            actionStats.dueToday > 0
              ? `${actionStats.dueToday} due today`
              : 'No items due today'
          }
        />
        <StatCard
          value={upcomingTodayCount}
          label="Upcoming"
          icon={Clock}
          to="/meetings?filter=today"
          trend="Remaining today"
          caption={`${meetingsTodayCount} scheduled total`}
        />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 lg:grid-cols-5 lg:gap-3">
        <UpcomingSection
          className="order-2 h-full min-h-0 lg:order-1 lg:col-span-3"
          meetings={upcomingForHome}
          onAutoJoinChange={updateAutoJoin}
        />
        <div className="order-1 h-full min-h-0 lg:order-2 lg:col-span-2">
          <DashboardBriefPanel
            recentMeeting={recentToday}
            priorityActions={priorityActions}
          />
        </div>
      </div>
    </div>
  )
}
