import { useEffect, useRef, useState } from 'react'
import { Bot, ChevronDown, Sparkles, SendHorizontal, X } from 'lucide-react'
import { useAiCopilot } from '../../context/AiCopilotContext'
import { AssistantPicker } from './AssistantPicker'
import type { CopilotMessage, CopilotResponseBlock } from '../workspace/copilot/copilotTypes'

function BlockCard({ block }: { block: CopilotResponseBlock }) {
  const shell =
    'rounded-lg border border-neutral-border bg-surface p-4 shadow-sm'
  const label =
    'mb-1.5 font-mono text-micro font-semibold uppercase tracking-wider text-neutral-muted'

  if (block.type === 'summary') {
    return (
      <div className={shell}>
        <div className={label}>{block.title}</div>
        <p className="text-body leading-relaxed text-neutral-text">{block.content}</p>
      </div>
    )
  }

  if (block.type === 'decision') {
    return (
      <div className={shell}>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="text-body font-semibold text-neutral-text">{block.title}</span>
          <span className="shrink-0 rounded-full bg-brand-tealLight px-2.5 py-1 text-small font-semibold text-brand-teal">
            {block.status}
          </span>
        </div>
        <p className="text-caption text-neutral-muted">Owner: {block.owner}</p>
        <p className="mt-1 text-body text-neutral-text">{block.businessImpact}</p>
      </div>
    )
  }

  if (block.type === 'action') {
    return (
      <div className={shell}>
        <div className={label}>Action</div>
        <p className="text-body font-semibold text-neutral-text">{block.title}</p>
        <p className="mt-1 text-caption text-neutral-muted">
          {block.owner} · Due {block.dueDate} · {block.priority}
        </p>
      </div>
    )
  }

  if (block.type === 'list') {
    return (
      <div className={shell}>
        <div className={label}>{block.title}</div>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-body text-neutral-text">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    )
  }

  if (block.type === 'timeline') {
    return (
      <div className={shell}>
        <div className={label}>{block.title}</div>
        <ul className="flex flex-col gap-2">
          {block.items.map((item) => (
            <li key={item.label} className="border-l-2 border-brand-teal/40 pl-3 text-body text-neutral-text">
              <span className="font-semibold">{item.label}</span> — {item.detail}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className={`${shell} overflow-x-auto`}>
      <div className={label}>{block.title}</div>
      <table className="w-full text-caption">
        <thead>
          <tr className="border-b border-neutral-border text-left text-neutral-muted">
            {block.columns.map((column) => (
              <th key={column} className="py-1.5 pr-3 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`} className="border-b border-neutral-border/50 last:border-0">
              {row.map((cell) => (
                <td key={cell} className="py-1.5 pr-3 text-neutral-text">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Docked assistant rail — replaces the old floating draggable dialog.
 * Desktop: fixed right-hand panel below the app bar. Mobile: full-screen sheet.
 */
export function AssistantRail() {
  const { open, closeDialog, activeConfig, view, openPicker } = useAiCopilot()
  const config = activeConfig
  const [messages, setMessages] = useState<CopilotMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)

  // Dragging state
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 })

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return // Only allow left-click
    
    // Ignore drag if clicking the close button or dropdown
    if ((e.target as HTMLElement).closest('button')) return

    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    setPosition({
      x: dragStartRef.current.posX + (e.clientX - dragStartRef.current.x),
      y: dragStartRef.current.posY + (e.clientY - dragStartRef.current.y),
    })
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }


  useEffect(() => {
    setMessages([])
  }, [config?.contextId])

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeDialog()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, closeDialog])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  if (!open) return null

  const showPicker = view === 'picker' || !config

  function addInteraction(label: string) {
    if (!label.trim() || !config) return
    const token = `${Date.now()}-${Math.round(Math.random() * 100000)}`
    setMessages((prev) => [
      ...prev,
      { id: `u-${token}`, role: 'user', prompt: label },
      { id: `a-${token}`, role: 'assistant', blocks: config.buildResponse(label.toLowerCase()) },
    ])
    setInputValue('')
  }

  return (
    <aside
      role="dialog"
      aria-labelledby="assistant-rail-title"
      className="fixed inset-0 z-overlay flex flex-col border-neutral-border bg-surface-canvas shadow-lg md:inset-auto md:bottom-28 md:right-8 md:top-auto md:h-[640px] md:max-h-[calc(100vh-160px)] md:w-[420px] md:rounded-2xl md:border md:shadow-2xl overflow-hidden transition-[opacity,transform] duration-200 md:transition-none"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      {/* Header — acts as the drag handle */}
      <header
        className={`flex shrink-0 items-center justify-between gap-3 border-b border-neutral-border bg-surface px-4 py-3 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-teal text-neutral-inverse">
            <Sparkles className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 id="assistant-rail-title" className="text-body font-semibold text-neutral-text">
              Avaada Assistant
            </h2>
            {showPicker || !config ? (
              <p className="truncate text-caption text-neutral-muted">
                Choose what to discuss
              </p>
            ) : (
              <button
                type="button"
                onClick={openPicker}
                className="focus-ring flex max-w-full items-center gap-1 rounded text-caption font-medium text-brand-teal hover:underline"
              >
                <span className="truncate">{config.contextLabel}</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
              </button>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={closeDialog}
          aria-label="Close assistant"
          className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-neutral-muted transition-colors hover:bg-surface-sunken hover:text-neutral-text"
        >
          <X className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </button>
      </header>

      {/* Context hints */}
      {!showPicker && config && config.contextHints.length > 0 && (
        <div className="flex shrink-0 flex-wrap gap-1.5 border-b border-neutral-border bg-surface px-4 py-2.5">
          {config.contextHints.map((hint) => (
            <span
              key={hint}
              className="rounded-full bg-surface-sunken px-2.5 py-1 text-small font-medium text-neutral-muted"
            >
              {hint}
            </span>
          ))}
        </div>
      )}

      {/* Body */}
      <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto p-4">
        {showPicker || !config ? (
          <AssistantPicker />
        ) : messages.length === 0 ? (
          <div>
            <div className="mb-3 flex items-center gap-2 text-body font-semibold text-neutral-text">
              <Sparkles className="h-4 w-4 text-brand-teal" strokeWidth={2} aria-hidden />
              {config.promptHeading}
            </div>
            <div className="flex flex-col gap-2">
              {config.starterPrompts.map((prompt) => (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => addInteraction(prompt.label)}
                  className="focus-ring rounded-lg border border-neutral-border bg-surface px-4 py-3 text-left text-body text-neutral-text shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-teal/40 hover:bg-brand-tealLight/40"
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col gap-2">
                <div
                  className={
                    message.role === 'assistant'
                      ? 'max-w-full self-start'
                      : 'max-w-[85%] self-end rounded-xl rounded-br-sm bg-[var(--surface-ink)] px-4 py-2.5 text-body text-[var(--text-on-ink)]'
                  }
                >
                  <div
                    className={`mb-0.5 text-small font-semibold ${
                      message.role === 'assistant'
                        ? 'text-brand-teal'
                        : 'text-[var(--text-on-ink-muted)]'
                    }`}
                  >
                    {message.role === 'assistant' ? 'Avaada AI' : 'You'}
                  </div>
                  {message.prompt ? <div>{message.prompt}</div> : null}
                </div>
                {message.blocks?.length ? (
                  <div className="flex flex-col gap-2">
                    {message.blocks.map((block) => (
                      <BlockCard key={block.id} block={block} />
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            <div>
              <p className="mb-1.5 text-caption font-semibold uppercase tracking-wide text-neutral-muted">
                Follow up
              </p>
              <div className="flex flex-wrap gap-1.5">
                {config.followUps.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => addInteraction(item)}
                    className="focus-ring rounded-full border border-neutral-border bg-surface px-3 py-1.5 text-caption font-medium text-neutral-text transition-colors hover:border-brand-teal/40 hover:text-brand-teal"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      {!showPicker && config && (
        <footer className="shrink-0 border-t border-neutral-border bg-surface p-3">
          <div className="mb-2 flex gap-1.5 overflow-x-auto pb-0.5">
            {config.quickActions.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => addInteraction(action)}
                className="focus-ring shrink-0 whitespace-nowrap rounded-full border border-neutral-border bg-surface px-3 py-1.5 text-caption font-medium text-neutral-text transition-colors hover:border-brand-teal/40 hover:text-brand-teal"
              >
                {action}
              </button>
            ))}
          </div>

          <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              addInteraction(inputValue || config.defaultSendPrompt)
            }}
          >
            <input
              aria-label="Ask Avaada AI"
              placeholder={config.inputPlaceholder}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              autoFocus
              className="h-12 w-full rounded-full border border-neutral-border bg-surface-canvas px-4 text-body text-neutral-text outline-none placeholder:text-neutral-muted focus:border-brand-teal"
            />
            <button
              type="submit"
              aria-label="Send"
              className="focus-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-teal text-neutral-inverse transition-colors hover:bg-brand-tealHover"
            >
              <SendHorizontal className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </button>
          </form>

          <p className="mt-2 flex items-center gap-1.5 text-small text-neutral-muted">
            <Bot className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            AI-generated — verify important details. UI-only mock, no backend calls.
          </p>
        </footer>
      )}
    </aside>
  )
}
