import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PRIMARY_NAV = [
  { to: '/chat', label: 'Chat' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/vulnerabilities', label: 'Vulnerabilities' },
]

const ADVANCED_NAV = [
  { to: '/agents', label: 'Agents' },
  { to: '/roles', label: 'Roles' },
  { to: '/skills', label: 'Skills' },
  { to: '/knowledge', label: 'Knowledge' },
  { to: '/mcp', label: 'MCP' },
  { to: '/workflows', label: 'Workflows' },
  { to: '/rbac', label: 'Users & Access' },
  { to: '/audit', label: 'Audit' },
  { to: '/webshell', label: 'WebShell' },
  { to: '/c2', label: 'C2' },
  { to: '/settings', label: 'Settings' },
]

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `block px-3 py-2 rounded-md text-sm transition-colors ${
    isActive ? 'bg-emerald-600/20 text-emerald-400 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
  }`
}

export function Layout() {
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const { logout } = useAuth()

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      <nav className="w-56 border-r border-slate-800 flex flex-col p-3 shrink-0">
        <div className="text-sm font-bold text-slate-100 px-3 py-2 mb-2">CyberStrikeAI</div>

        <div className="space-y-1">
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <button
          onClick={() => setAdvancedOpen((v) => !v)}
          className="mt-4 px-3 py-1.5 text-xs uppercase tracking-wide text-slate-500 hover:text-slate-300 flex items-center gap-1"
        >
          {advancedOpen ? '▾' : '▸'} Advanced
        </button>
        {advancedOpen && (
          <div className="space-y-1 mt-1">
            {ADVANCED_NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        <button
          onClick={() => void logout()}
          className="mt-auto px-3 py-2 text-sm text-slate-500 hover:text-red-400 text-left"
        >
          Log out
        </button>
      </nav>

      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
