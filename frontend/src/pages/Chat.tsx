import { useState, type FormEvent } from 'react'
import { streamSSE } from '../api/client'
import { Button, Card } from '../components/ui'

interface StreamEvent {
  type: 'conversation' | 'message_saved' | 'progress' | 'error' | 'cancelled' | 'response' | 'done'
  message: string
  data?: { conversationId?: string }
}

interface Turn {
  userMessage: string
  status: string | null // latest progress line, cleared once response/error/done lands
  response: string | null
  error: string | null
}

export function Chat() {
  const [turns, setTurns] = useState<Turn[]>([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [streaming, setStreaming] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!input.trim() || streaming) return

    const userMessage = input
    setInput('')
    setStreaming(true)
    setTurns((prev) => [...prev, { userMessage, status: 'Starting…', response: null, error: null }])

    const updateLastTurn = (patch: Partial<Turn>) => {
      setTurns((prev) => {
        const next = [...prev]
        next[next.length - 1] = { ...next[next.length - 1], ...patch }
        return next
      })
    }

    try {
      for await (const chunk of streamSSE('/eino-agent/stream', {
        message: userMessage,
        conversationId,
      })) {
        let ev: StreamEvent
        try {
          ev = JSON.parse(chunk)
        } catch {
          continue
        }

        if (ev.data?.conversationId && !conversationId) {
          setConversationId(ev.data.conversationId)
        }

        switch (ev.type) {
          case 'progress':
            updateLastTurn({ status: ev.message })
            break
          case 'response':
            updateLastTurn({ status: null, response: ev.message })
            break
          case 'error':
            updateLastTurn({ status: null, error: ev.message })
            break
          case 'cancelled':
            updateLastTurn({ status: null, error: `Cancelled: ${ev.message}` })
            break
          case 'done':
            break
        }
      }
    } catch {
      updateLastTurn({ status: null, error: 'Stream connection failed.' })
    } finally {
      setStreaming(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <div className="flex-1 overflow-auto space-y-3 mb-4">
        {turns.length === 0 && (
          <p className="text-sm text-slate-500">
            Tell it what to test — e.g. "Scan open ports on 192.168.1.1".
          </p>
        )}
        {turns.map((t, i) => (
          <div key={i} className="space-y-2">
            <Card className="bg-slate-800">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">You</p>
              <p className="text-sm text-slate-200 whitespace-pre-wrap">{t.userMessage}</p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Agent</p>
              {t.status && <p className="text-sm text-slate-500 italic">{t.status}</p>}
              {t.response && <p className="text-sm text-slate-200 whitespace-pre-wrap">{t.response}</p>}
              {t.error && <p className="text-sm text-red-400 whitespace-pre-wrap">⚠ {t.error}</p>}
            </Card>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message the agent…"
          className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-600"
        />
        <Button type="submit" disabled={streaming}>
          {streaming ? 'Running…' : 'Send'}
        </Button>
      </form>
    </div>
  )
}
