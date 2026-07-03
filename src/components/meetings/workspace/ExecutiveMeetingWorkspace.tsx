import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TODAY } from '../../../data/constants'
import type { Meeting } from '../../../types/meeting'
import { getDayGroup } from '../../../utils/helpers'
import { sortMeetingsChronologically } from '../../../utils/meetings'
import { resolveMeetingContext } from '../../../utils/meetingContext'
import type { DateFilter } from '../FilterChips'
import { WorkspaceHeader } from './WorkspaceHeader'
import { AttentionQueue } from './AttentionQueue'
import { MeetingWorkspace } from './MeetingWorkspace'
import { KnowledgePanel } from './KnowledgePanel'
import { ExecutiveCopilotPanel } from './companion/ExecutiveCopilotPanel'
import { workspaceLayout } from '../../../design-system/workspace'
import {
  useWorkspaceFloatingPanel,
  WorkspaceFloatingPanel,
} from '../../workspace'

type DayGroupKey = 'Today' | 'Tomorrow' | 'This Week'

const filterToGroups: Record<Exclude<DateFilter, 'custom'>, DayGroupKey[]> = {
  today: ['Today'],
  tomorrow: ['Tomorrow'],
  'this-week': ['Today', 'Tomorrow', 'This Week'],
}

const periodLabels: Record<Exclude<DateFilter, 'custom'>, string> = {
  today: 'Today',
  tomorrow: 'Tomorrow',
  'this-week': 'This week',
}

interface ExecutiveMeetingWorkspaceProps {
  meetings: Meeting[]
}

export function ExecutiveMeetingWorkspace({ meetings }: ExecutiveMeetingWorkspaceProps) {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState<DateFilter>('today')
  const [customDate, setCustomDate] = useState(TODAY)
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const { panelRef, width, position, startDrag, startResize, setInteraction } = useWorkspaceFloatingPanel({
    open: copilotOpen,
  })

  useEffect(() => {
    const f = searchParams.get('filter')
    if (f === 'today') setDateFilter('today')
    else if (f === 'tomorrow') setDateFilter('tomorrow')
    else if (f === 'this-week') setDateFilter('this-week')
  }, [searchParams])

  const filteredMeetings = useMemo(() => {
    return meetings
      .filter((m) => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
          m.title.toLowerCase().includes(q) ||
          m.host.toLowerCase().includes(q)
        )
      })
      .filter((m) => {
        if (dateFilter === 'custom') return m.date === customDate
        const group = getDayGroup(m.date)
        if (!group) return false
        return filterToGroups[dateFilter].includes(group)
      })
      .sort(sortMeetingsChronologically)
  }, [meetings, search, dateFilter, customDate])

  const meetingContext = useMemo(
    () => resolveMeetingContext(selectedMeetingId, meetings),
    [selectedMeetingId, meetings],
  )

  useEffect(() => {
    if (selectedMeetingId && !meetings.some((m) => m.id === selectedMeetingId)) {
      setSelectedMeetingId(null)
    }
  }, [meetings, selectedMeetingId])

  useEffect(() => {
    if (!meetingContext) {
      setCopilotOpen(false)
      setInteraction(null)
    }
  }, [meetingContext, setInteraction])

  const periodLabel =
    dateFilter === 'custom' ? `Custom · ${customDate}` : periodLabels[dateFilter]

  return (
    <div className={workspaceLayout.pageShell}>
      <WorkspaceHeader
        search={search}
        onSearchChange={setSearch}
        periodLabel={periodLabel}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        customDate={customDate}
        onCustomDateChange={setCustomDate}
        copilotOpen={copilotOpen}
        copilotDisabled={!meetingContext}
        onToggleCopilot={() => setCopilotOpen((prev) => !prev)}
      />

      <div className={workspaceLayout.gridMeetings}>
          <div className="flex min-h-0 flex-1 flex-col">
            <AttentionQueue
              meetings={filteredMeetings}
              selectedMeetingId={selectedMeetingId}
              onSelectMeeting={setSelectedMeetingId}
            />
          </div>

          <MeetingWorkspace context={meetingContext} />

          <KnowledgePanel context={meetingContext} onSelectMeeting={setSelectedMeetingId} />
      </div>

      {meetingContext ? (
        <WorkspaceFloatingPanel
          open={copilotOpen}
          width={width}
          x={position.x}
          y={position.y}
          panelRef={panelRef}
          onResizeStart={(event) => startResize(event)}
        >
          <ExecutiveCopilotPanel
            context={meetingContext}
            onDragStart={(event) => startDrag(event)}
            onClose={() => setCopilotOpen(false)}
          />
        </WorkspaceFloatingPanel>
      ) : null}
    </div>
  )
}
