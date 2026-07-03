/**
 * Workspace design tokens — TypeScript API for Meetings, Action Items, and future modules.
 * Pair with workspace.css and panel-surface from the global layer.
 */

/** Three-column workspace grid: queue 23% · center 58% · context 19% */
export const workspaceLayout = {
  pageShell:
    'workspace-module mx-auto flex h-[calc(100dvh-8.25rem)] max-w-[90rem] flex-col gap-0 overflow-hidden md:h-[calc(100dvh-7.75rem)] lg:h-[calc(100dvh-7.25rem)]',
  grid: 'workspace-grid-shell relative flex min-h-0 flex-1 flex-col overflow-hidden lg:grid lg:grid-cols-[minmax(0,23fr)_minmax(0,58fr)_minmax(0,19fr)]',
  gridMeetings:
    'workspace-grid-shell relative min-h-0 flex-1 overflow-hidden flex flex-col lg:grid lg:grid-cols-[minmax(0,23fr)_minmax(0,58fr)_minmax(0,19fr)]',
} as const

export const workspaceAi = {
  defaultWidth: 460,
  minWidth: 380,
  maxWidth: 720,
  defaultTop: 96,
  viewportMargin: 16,
  zIndex: 'z-50',
} as const

export const workspaceIcon = {
  stroke: 1.75,
  strokeBold: 1.8,
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
} as const

/** Tailwind class bundles — prefer over ad-hoc strings in workspace components. */
export const ws = {
  pageTitle: 'workspace-page-title',
  pageTitleBlock: 'workspace-page-title-block',
  pageHeaderInner: 'workspace-page-header-inner',
  workspaceTitle: 'workspace-workspace-title truncate',
  eyebrow: 'workspace-eyebrow',
  queueEyebrow: 'workspace-queue-eyebrow',
  panelTitle: 'workspace-panel-title',
  sectionTitle: 'workspace-section-title',
  sectionHd: 'workspace-section-hd',
  sectionCard: 'workspace-section-card',
  sectionCardHero: 'workspace-section-card-hero',
  sectionCardSecondary: 'workspace-section-card-secondary',
  sectionCardTier: 'workspace-section-card-tier',
  sectionBd: 'workspace-section-bd',
  sectionBdScroll: 'workspace-section-bd workspace-section-bd-scroll',
  sectionQuestion: 'workspace-section-question',
  sectionQuestionHero: 'workspace-section-question-hero',
  cardTitle: 'workspace-card-title',
  copilotTitle: 'truncate text-caption font-semibold text-neutral-text',
  meta: 'workspace-meta',
  metaStrong: 'workspace-meta-strong',
  fieldLabel: 'workspace-field-label',
  fieldValue: 'workspace-field-value',
  /** @deprecated Use fieldLabel */
  label: 'workspace-field-label',
  panelHd: 'workspace-panel-hd',
  panelBd: 'workspace-panel-bd workspace-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain',
  panelBdEmpty: 'workspace-panel-bd-empty',
  heroBodyWithBadge: 'workspace-hero-body workspace-hero-body--with-badge',
  flow: 'workspace-stagger workspace-review-flow',
  /** Action Items page root — scoped hierarchy refinements in workspace.css */
  pageActionItems: 'action-items-workspace',
  /** Queue card content stack — pairs with action-items queue rules */
  queueCardBody: 'workspace-queue-card-body',
  group: 'space-y-2',
  groupHd: 'flex items-center justify-between gap-2 px-0.5',
  queueSections: 'workspace-queue-sections',
  queueList: 'workspace-queue-list',
  queueGroupHd: 'workspace-queue-group-hd',
  toolbar: 'workspace-toolbar',
  contextStack: 'workspace-context-stack',
  contextKnowledgeFlow: 'workspace-context-stack workspace-context-knowledge-flow',
  contextEnter: 'workspace-context-enter',
  contextGroupHd: 'workspace-context-group-hd',
  contextGroupTitle: 'workspace-context-group-title',
  contextGroupBody: 'workspace-context-group-body',
  contextItem: 'workspace-context-item',
  contextItemTitle: 'workspace-context-item-title',
  contextItemValue: 'workspace-context-item-value',
  cardLift: 'workspace-card workspace-card-lift',
  cardAlert: 'workspace-card-alert',
  cardStack: 'workspace-card-stack',
  cardGrid: 'workspace-card-grid',
  cardHd: 'workspace-card-hd',
  cardPrimary: 'workspace-card-primary',
  cardSupport: 'workspace-card-support',
  cardSupportRow: 'workspace-card-support-row',
  cardFt: 'workspace-card-ft',
  cardNotice: 'workspace-card-notice',
  cardFieldStack: 'workspace-card-field-stack',
  cardMetaGrid: 'workspace-card-meta-grid',
  cardMetaGridSpan2: 'workspace-card-meta-grid-span-2',
  cardTimeline: 'workspace-card-timeline',
  cardTimelineBody: 'workspace-card-timeline-body',
  cardTimelineHd: 'workspace-card-timeline-hd',
  fieldCell: 'workspace-field-cell',
  fieldGrid: 'workspace-field-grid',
  fieldGridSpan2: 'workspace-field-grid-span-2',
  fieldGridFlush: 'workspace-field-grid workspace-field-grid--flush',
  cardMetaGridFlush: 'workspace-card-meta-grid workspace-card-meta-grid--flush',
  fieldChips: 'workspace-field-chips',
  fieldSurface: 'workspace-field-surface',
  knowledgeMetrics: 'workspace-knowledge-metrics',
  knowledgeMetric: 'workspace-knowledge-metric',
  knowledgeChips: 'workspace-knowledge-chips',
  knowledgeItem: 'workspace-knowledge-item',
  knowledgeMiniCard: 'workspace-knowledge-mini-card',
  knowledgeMiniHd: 'workspace-knowledge-mini-hd',
  knowledgeMiniBd: 'workspace-knowledge-mini-bd',
  knowledgeMiniTitle: 'workspace-knowledge-mini-title',
  knowledgeMeta: 'workspace-knowledge-meta',
  knowledgeValue: 'workspace-knowledge-value',
  knowledgeMeetingBtn: 'workspace-knowledge-meeting-btn',
  knowledgeDocCard: 'workspace-knowledge-doc-card',
  knowledgePersonRow: 'workspace-knowledge-person-row',
  knowledgeRow: 'workspace-knowledge-row',
  empty: 'workspace-empty',
  interactive:
    'focus-ring outline-none transition-[color,background-color,box-shadow,transform] duration-200 ease-out active:scale-[0.99]',
  aiToggle: 'workspace-ai-toggle focus-ring',
  footerPrimary:
    'workspace-footer-primary btn-premium inline-flex h-control-sm items-center gap-1.5 rounded-lg px-3.5 text-caption font-semibold shadow-sm',
  footerSecondary:
    'workspace-footer-secondary btn-premium inline-flex h-control-sm items-center gap-1.5 rounded-lg px-3 text-caption font-medium text-neutral-muted hover:text-neutral-text',
  queueCard: 'focus-ring workspace-queue-card',
  queueCardTitleRow: 'workspace-queue-card-title-row',
  queueCardTitle: 'workspace-queue-card-title line-clamp-2 min-w-0',
  queueCardOwner: 'workspace-queue-card-owner',
  queueCardStatus: 'workspace-queue-card-status',
  queueCardFoot: 'workspace-queue-card-foot',
  queueCardMeta: 'workspace-queue-card-meta',
  queueCardMetaStrong: 'workspace-queue-card-meta-strong tabular-nums',
  queueCardStats: 'workspace-queue-card-stats',
  queueCardStatsAttention: 'workspace-queue-card-stats-attention',
  queueCardBadges: 'workspace-queue-card-badges',
  queueCardProgress: 'workspace-queue-card-progress',
  queueCardProgressLabel: 'workspace-queue-card-progress-label',
  queueCardSelected: 'workspace-queue-card-selected',
  queueCardIdle: 'workspace-queue-card-idle',
  statChip: 'workspace-stat-chip',
  iconWell: 'workspace-icon-well',
  iconWellLg: 'workspace-icon-well workspace-icon-well-lg',
  divider: 'workspace-divider',
  heroHeader: 'workspace-hero-header',
  heroBody: 'workspace-hero-body',
  heroDetails: 'workspace-hero-details',
  heroKicker: 'workspace-hero-kicker',
  heroDetailValue: 'workspace-field-value',
  heroFooter: 'workspace-hero-footer',
  summaryInfoGrid: 'workspace-summary-info-grid',
  infoCard: 'workspace-info-card',
  infoCardValue: 'workspace-info-card-value',
  actionReviewPanel: 'workspace-action-review-panel',
  actionReviewHd: 'workspace-action-review-hd',
  actionReviewGrid: 'workspace-action-review-grid',
  actionReviewField: 'workspace-action-review-field',
  actionReviewSpanWide: 'workspace-action-review-span-wide',
  queueCardDept: 'workspace-queue-card-dept',
  knowledgeMiniCardAlt: 'workspace-knowledge-mini-card-alt',
  footerActions: 'workspace-footer-actions',
  footerBar: 'workspace-footer-bar',
  footerRecs: 'workspace-footer-recs',
  emptyHint: 'workspace-empty-hint',
  riskInset: 'workspace-risk-inset',
  inputBar: 'workspace-input-bar',
  controlInput: 'workspace-control-input focus-ring',
  progressTrack: 'workspace-progress-track',
  progressFill: 'workspace-progress-fill',
} as const

export const wsBadge = {
  base: 'workspace-badge',
  neutral: 'workspace-badge workspace-badge-neutral',
  accent: 'workspace-badge workspace-badge-accent',
  warning: 'workspace-badge workspace-badge-warning',
  danger: 'workspace-badge workspace-badge-danger',
  info: 'workspace-badge workspace-badge-info',
} as const

export const wsCount = 'workspace-count'

export function priorityBadgeTone(
  priority: 'high' | 'medium' | 'low',
): (typeof wsBadge)[keyof typeof wsBadge] {
  if (priority === 'high') return wsBadge.danger
  if (priority === 'medium') return wsBadge.warning
  return wsBadge.neutral
}

export function riskBadgeTone(
  risk: 'high' | 'medium' | 'low',
): (typeof wsBadge)[keyof typeof wsBadge] {
  if (risk === 'high') return wsBadge.danger
  if (risk === 'medium') return wsBadge.warning
  return wsBadge.neutral
}

export function queueCardClass(isSelected: boolean): string {
  return `${ws.queueCard} ${isSelected ? ws.queueCardSelected : ws.queueCardIdle}`
}
