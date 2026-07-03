import type { MeetingContext } from '../../../types/meetingContext'
import { WorkspaceSection } from './WorkspaceSection'
import { BriefSection } from './review/BriefSection'
import { ActionReviewSection } from './review/ActionReviewSection'
import { DecisionIntelligenceSection } from './intelligence/DecisionIntelligenceSection'
import { DecisionFlowSection } from './intelligence/DecisionFlowSection'
import { ws } from './workspaceUi'

interface MeetingWorkspaceContentProps {
  context: MeetingContext
}

export function MeetingWorkspaceContent({ context }: MeetingWorkspaceContentProps) {
  const { intelligence } = context

  return (
    <div className={ws.flow}>
      <WorkspaceSection title="Summary" question="What happened?" variant="hero">
        <BriefSection brief={context.brief} />
      </WorkspaceSection>

      <WorkspaceSection title="Decision flow" variant="tier" scrollBody>
        <DecisionFlowSection
          steps={intelligence.narrativeTimeline}
          crossMeeting={intelligence.crossMeeting}
        />
      </WorkspaceSection>

      <WorkspaceSection
        title="Decision intelligence"
        count={context.decisions.length}
        variant="tier"
        scrollBody
      >
        <DecisionIntelligenceSection
          decisions={context.decisions}
          intelligence={intelligence.decisionIntelligence}
          risks={intelligence.riskIntelligence}
          conflicts={intelligence.conflicts}
        />
      </WorkspaceSection>

      <WorkspaceSection
        title="Action review"
        question="What needs attention?"
        count={context.commitments.length}
        variant="secondary"
        scrollBody
      >
        <ActionReviewSection commitments={context.commitments} />
      </WorkspaceSection>
    </div>
  )
}
