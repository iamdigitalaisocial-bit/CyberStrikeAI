import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Chat } from './pages/Chat'
import { Tasks } from './pages/Tasks'
import { Vulnerabilities } from './pages/Vulnerabilities'
import { Placeholder } from './pages/Placeholder'

function RequireAuth({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

const ADVANCED_PLACEHOLDERS = [
  'agents', 'roles', 'skills', 'knowledge', 'mcp', 'workflows', 'rbac', 'audit', 'webshell', 'c2', 'settings',
]

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/vulnerabilities" element={<Vulnerabilities />} />
          {ADVANCED_PLACEHOLDERS.map((name) => (
            <Route key={name} path={`/${name}`} element={<Placeholder name={name} />} />
          ))}
        </Route>
      </Routes>
    </AuthProvider>
  )
}
