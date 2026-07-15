import type { ButtonHTMLAttributes, ReactNode, TableHTMLAttributes } from 'react'

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const base = 'px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50'
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-500',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-800',
    danger: 'bg-red-600 text-white hover:bg-red-500',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-lg p-4 ${className}`}>
      {children}
    </div>
  )
}

export function Badge({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'critical' | 'high' | 'medium' | 'low' | 'success' }) {
  const tones = {
    default: 'bg-slate-800 text-slate-300',
    critical: 'bg-red-950 text-red-400 border border-red-900',
    high: 'bg-orange-950 text-orange-400 border border-orange-900',
    medium: 'bg-yellow-950 text-yellow-400 border border-yellow-900',
    low: 'bg-slate-800 text-slate-400',
    success: 'bg-emerald-950 text-emerald-400 border border-emerald-900',
  }
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${tones[tone]}`}>{children}</span>
}

export function Table({ className = '', ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={`w-full text-sm text-left ${className}`} {...props} />
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-800 rounded-lg p-5 min-w-[320px] max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-slate-100">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
