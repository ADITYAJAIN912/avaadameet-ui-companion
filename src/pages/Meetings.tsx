import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { MeetingLibrary } from '../components/meetings/room/MeetingLibrary'
import { MeetingRoom } from '../components/meetings/room/MeetingRoom'
import { useAiCopilot } from '../context/AiCopilotContext'
import { useMeetings } from '../context/MeetingsContext'
import { TODAY } from '../data/constants'
import { usePageLoading } from '../hooks/usePageLoading'
import type { DateFilter } from '../components/meetings/FilterChips'
import { createMeetingCopilotConfig } from '../components/workspace/copilot/meetingCopilot'
import { getDayGroup } from '../utils/helpers'
import { sortMeetingsChronologically } from '../utils/meetings'
import { resolveMeetingContext } from '../utils/meetingContext'

const filterToGroups: Record<Exclude<DateFilter, 'custom'>, Array<'Today' | 'Tomorrow' | 'This Week'>> = {
  today: ['Today'],
  tomorrow: ['Tomorrow'],
  'this-week': ['Today', 'Tomorrow', 'This Week'],
}

function isDateFilter(value: string | null): value is DateFilter {
  return value === 'today' || value === 'tomorrow' || value === 'this-week' || value === 'custom'
}

export function Meetings() {
  const isLoading = usePageLoading(450)
  const { meetings } = useMeetings()
  const { setPageConfig } = useAiCopilot()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState<DateFilter>('today')
  const [customDate, setCustomDate] = useState(TODAY)
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)

  useEffect(() => {
    const filter = searchParams.get('filter')
    if (isDateFilter(filter)) setDateFilter(filter)
  }, [searchParams])

  useEffect(() => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.set('filter', dateFilter)
      return next
    }, { replace: true })
  }, [dateFilter, setSearchParams])

  const filteredMeetings = useMemo(() => {
    return meetings
      .filter((meeting) => {
        if (!search.trim()) return true
        const q = search.toLowerCase().trim()
        return meeting.title.toLowerCase().includes(q) || meeting.host.toLowerCase().includes(q)
      })
      .filter((meeting) => {
        if (dateFilter === 'custom') return meeting.date === customDate
        const group = getDayGroup(meeting.date)
        return group ? filterToGroups[dateFilter].includes(group) : false
      })
      .sort(sortMeetingsChronologically)
  }, [meetings, search, dateFilter, customDate])

  const meetingContext = useMemo(
    () => resolveMeetingContext(selectedMeetingId, meetings),
    [selectedMeetingId, meetings],
  )

  useEffect(() => {
    if (selectedMeetingId && !meetings.some((meeting) => meeting.id === selectedMeetingId)) {
      setSelectedMeetingId(null)
    }
  }, [meetings, selectedMeetingId])

  useEffect(() => {
    setPageConfig(meetingContext ? createMeetingCopilotConfig(meetingContext) : null)
    return () => setPageConfig(null)
  }, [meetingContext, setPageConfig])

  if (isLoading) {
    return <LoadingScreen message="Preparing your meetings..." />
  }

  if (selectedMeetingId) {
    return (
      <MeetingRoom
        context={meetingContext}
        onBack={() => setSelectedMeetingId(null)}
        onSelectMeeting={setSelectedMeetingId}
      />
    )
  }

  return (
    <MeetingLibrary
      meetings={filteredMeetings}
      search={search}
      onSearchChange={setSearch}
      dateFilter={dateFilter}
      onDateFilterChange={setDateFilter}
      customDate={customDate}
      onCustomDateChange={setCustomDate}
      onSelectMeeting={setSelectedMeetingId}
    />
  )
}
