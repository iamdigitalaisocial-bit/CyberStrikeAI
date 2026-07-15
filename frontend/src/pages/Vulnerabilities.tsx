import { useEffect, useState } from 'react'
import { client } from '../api/client'
import { Badge, Card, Table } from '../components/ui'

interface Vulnerability {
  id: string
  title?: string
  name?: string
  severity: string
  target?: string
  createdAt?: string
}

const SEVERITY_TONE: Record<string, 'critical' | 'high' | 'medium' | 'low'> = {
  critical: 'critical',
  high: 'high',
  medium: 'medium',
  low: 'low',
}

export function Vulnerabilities() {
  const [items, setItems] = useState<Vulnerability[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    client
      .get('/vulnerabilities')
      .then((res) => setItems(res.data.vulnerabilities ?? []))
      .catch(() => setError('Could not load vulnerabilities.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-100 mb-4">Vulnerabilities</h1>
      <Card>
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="text-sm text-slate-500">No findings yet.</p>
        )}
        {!loading && items.length > 0 && (
          <Table>
            <thead className="text-slate-500 border-b border-slate-800">
              <tr>
                <th className="py-2 font-medium">Finding</th>
                <th className="py-2 font-medium">Severity</th>
                <th className="py-2 font-medium">Target</th>
              </tr>
            </thead>
            <tbody>
              {items.map((v) => (
                <tr key={v.id} className="border-b border-slate-900">
                  <td className="py-2 text-slate-200">{v.title ?? v.name ?? v.id}</td>
                  <td className="py-2">
                    <Badge tone={SEVERITY_TONE[v.severity?.toLowerCase()] ?? 'default'}>{v.severity}</Badge>
                  </td>
                  <td className="py-2 text-slate-400">{v.target ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  )
}
