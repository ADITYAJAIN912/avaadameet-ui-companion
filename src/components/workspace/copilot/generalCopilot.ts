import type { AvaadaCopilotConfig, CopilotResponseBlock, CopilotSuggestion } from './copilotTypes'

const starterPrompts: CopilotSuggestion[] = [
  { id: 'g1', label: "What's on my plate today?" },
  { id: 'g2', label: 'Summarize this week' },
  { id: 'g3', label: 'What needs my attention?' },
  { id: 'g4', label: 'Show overdue action items' },
]

const quickActions = ['Daily Digest', 'Weekly Summary', 'Open Risks'] as const

const followUps = ['Show more', 'Explain further', 'Generate email'] as const

function buildGeneralCopilotResponse(promptLabel: string): CopilotResponseBlock[] {
  const normalized = promptLabel.toLowerCase()

  if (normalized.includes('overdue')) {
    return [
      {
        id: 'summary',
        type: 'summary',
        title: 'Overdue items',
        content: 'Select a meeting or action item from Meetings or Action Items to see specific overdue work.',
      },
    ]
  }

  return [
    {
      id: 'summary',
      type: 'summary',
      title: 'Avaada AI',
      content:
        'Open a meeting or action item to get context-aware answers, or ask a general question about your workspace.',
    },
  ]
}

export function createGeneralCopilotConfig(): AvaadaCopilotConfig {
  return {
    contextId: 'general',
    contextLabel: 'General workspace',
    contextHints: [],
    promptHeading: 'How can I help?',
    starterPrompts,
    quickActions,
    followUps,
    inputPlaceholder: 'Ask Avaada AI...',
    defaultSendPrompt: "What's on my plate today?",
    buildResponse: buildGeneralCopilotResponse,
  }
}
