import { Card } from '../components/ui'

export function Placeholder({ name }: { name: string }) {
  return (
    <Card>
      <h1 className="text-lg font-semibold text-slate-100 capitalize mb-1">{name}</h1>
      <p className="text-sm text-slate-500">This screen hasn't been rebuilt yet — coming next.</p>
    </Card>
  )
}
