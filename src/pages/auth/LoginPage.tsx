import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, FormField, Input } from '@/components/FormElements'
import { loginWithEmailPassword } from '@/lib/auth'

/** After login, everyone lands on the main dashboard (`/`). Employee role is redirected to `/hr/ess` by `DashboardLayout`. */
function defaultRouteAfterLogin(): string {
  return '/'
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? null

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void (async () => {
      try {
        setError(null)
        setLoading(true)
        const user = await loginWithEmailPassword(email, password)
        navigate(from || defaultRouteAfterLogin(), { replace: true })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed')
      } finally {
        setLoading(false)
      }
    })()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-surface-200 bg-white p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="/Logo.png"
            alt="Bookito"
            className="mb-6 h-32 w-auto max-w-full object-contain"
          />
          <h1 className="sr-only">Bookito ERP — Sign in</h1>
          <p className="text-sm text-surface-500">
            Sign in with the email and password issued by your HR administrator.
          </p>
          {error && <p className="mt-4 w-full rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Email">
            <Input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </FormField>
          <FormField label="Password">
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </FormField>
          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
