import axios from 'axios'

const TOKEN_KEY = 'cyberstrikeai_token'

export const client = axios.create({ baseURL: '/api' })

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

client.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearToken()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export async function login(username: string, password: string): Promise<string> {
  const res = await client.post('/auth/login', { username, password })
  const token: string = res.data.token
  setToken(token)
  return token
}

export async function logout() {
  await client.post('/auth/logout').catch(() => {})
  clearToken()
}

/**
 * Opens a Server-Sent Events stream for POST endpoints (fetch-based, since
 * EventSource can't send a body/auth header). Yields raw `data:` payloads.
 */
export async function* streamSSE(path: string, body: unknown): AsyncGenerator<string> {
  const token = getToken()
  const res = await fetch(`/api${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
  if (!res.ok || !res.body) {
    throw new Error(`Stream request failed: ${res.status}`)
  }
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (line.startsWith('data:')) {
        yield line.slice(5).trim()
      }
    }
  }
}
