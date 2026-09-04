import { Suspense } from 'react'
import Link from 'next/link'
import { LoginClient } from './LoginClient'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-omni-bg p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-accent">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.png" alt="" className="h-5 w-5 rounded-sm" />
          </div>
          <span className="font-mono text-caption uppercase tracking-wide text-omni-ink-faint">OMNI Share</span>
        </div>
        <h1 className="font-display text-h1-lg font-semibold text-omni-ink">Welcome back</h1>
        <p className="mt-2 text-body text-omni-ink-soft">Sign in to your account to continue</p>

        <div className="mt-6 rounded-md border border-omni-border bg-omni-surface p-6">
          <Suspense fallback={null}>
            <LoginClient />
          </Suspense>
        </div>

        <p className="hidden mt-6 text-center text-small text-omni-ink-faint">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-omni-ink hover:underline">Create one</Link>
        </p>
        <p className="mt-2 text-center text-small text-omni-ink-faint">OMNI Share — Real-time photo sharing platform</p>
        <p className="mt-2 text-center text-caption text-omni-ink-faint">
          <Link href="/privacy" className="hover:underline">Privacy Policy &amp; Terms of Use</Link>
        </p>
      </div>
    </div>
  )
}
