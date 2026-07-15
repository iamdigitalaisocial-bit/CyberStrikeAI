import { useEffect, useState } from 'react'
import { client } from '../api/client'
import { Badge, Card, Table } from '../components/ui'

interface BatchQueue {
  id: string
  name?: string
  status: string
  createdAt?: string
  taskCount?: number
}

const STATUS_TONE: Record<string, 'default' | 'success' | 'high' | 'medium'> = {
  running: 'medium',
  completed: 'success',
  failed: 'high',
  pending: 'default',
}

export function Tasks() {
  const [queues, setQueues] = useState<BatchQueue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    client
      .get('/batch-tasks')
      .then((res) => setQueues(res.data.queues ?? []))
      .catch(() => setError('Could not load tasks.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-100 mb-4">Tasks</h1>
      <Card>
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!loading && !error && queues.length === 0 && (
          <p className="text-sm text-slate-500">No task queues yet — start one from Chat.</p>
        )}
        {!loading && queues.length > 0 && (
          <Table>
            <thead className="text-slate-500 border-b border-slate-800">
              <tr>
                <th className="py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium"># Tasks</th>
              </tr>
            </thead>
            <tbody>
              {queues.map((q) => (
                <tr key={q.id} className="border-b border-slate-900">
                  <td className="py-2 text-slate-200">{q.name ?? q.id}</td>
                  <td className="py-2">
                    <Badge tone={STATUS_TONE[q.status] ?? 'default'}>{q.status}</Badge>
                  </td>
                  <td className="py-2 text-slate-400">{q.taskCount ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  )
}
