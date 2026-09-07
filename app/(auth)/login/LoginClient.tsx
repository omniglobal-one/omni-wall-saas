'use client'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { signIn } from '@/app/actions/auth'

export function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const raw = searchParams.get('redirect') ?? '/rooms'
  const redirectTo = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/rooms'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await signIn(email, password)
    setLoading(false)
    if (!result.success) {
      setError(result.error)
    } else {
      router.push(redirectTo)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <Input
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
        autoComplete="current-password"
      />
      {error !== null && <Alert tone="error">{error}</Alert>}
      <Button type="submit" disabled={loading} className="w-full justify-center">
        {loading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-contrast/30 border-t-accent-contrast" />
            Signing in…
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  )
}
