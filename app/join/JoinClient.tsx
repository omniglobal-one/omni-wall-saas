'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Alert, Button, Input } from '@omni/ui'
import { joinRoom, guestJoinRoom } from '@/app/actions/members'

export function JoinClient({ initialAuthed }: { initialAuthed: boolean }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preCode = searchParams.get('code') ?? ''
  const [code, setCode] = useState(preCode.toUpperCase())
  const [displayName, setDisplayName] = useState('')
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authed] = useState<boolean>(initialAuthed)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-submit if code pre-filled and user is already logged in
  useEffect(() => {
    if (preCode && authed === true && preCode.length === 6) {
      handleJoin(preCode.toUpperCase())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed])

  async function handleJoin(joinCode?: string) {
    const codeToUse = (joinCode ?? code).toUpperCase()
    if (codeToUse.length !== 6) {
      setError('Enter a 6-character code.')
      return
    }

    if (authed === false && !ageConfirmed) {
      setError('Please confirm you are 13 years of age or older to continue.')
      return
    }

    setError(null)
    setLoading(true)

    try {
      if (authed === false) {
        // Guest flow: guestJoinRoom signs in anonymously server-side (so the resulting session
        // cookie can be httpOnly) and joins the room in the same call.
        const result = await guestJoinRoom(codeToUse, displayName.trim() || undefined)
        setLoading(false)
        if (!result.success) {
          setError(result.error)
        } else {
          // Pre-unlock the room gate so guests don't enter the code twice
          sessionStorage.setItem(`wall_access_${codeToUse}`, '1')
          router.push(`/room/${result.data}`)
        }
      } else {
        // Already signed in — normal join
        const result = await joinRoom(codeToUse)
        setLoading(false)
        if (!result.success) {
          setError(result.error)
        } else {
          sessionStorage.setItem(`wall_access_${codeToUse}`, '1')
          router.push(`/room/${result.data}`)
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-omni-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center gap-2 mb-10 justify-center">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.png" alt="" className="w-6 h-6 rounded" />
          </div>
          <span className="text-xl font-bold text-omni-ink">OMNI Share</span>
        </div>

        <h1 className="text-3xl font-bold text-omni-ink mb-2">Join a room</h1>
        <p className="text-omni-ink-soft mb-8">
          Enter the 6-character code shown at the event.
        </p>

        <div className="card p-8 text-left">
          {error !== null && <Alert tone="error" className="mb-6">{error}</Alert>}

          <div className="mb-4">
            <Input
              ref={inputRef}
              label="Room code"
              type="text"
              className="text-center font-mono text-3xl tracking-[0.5em] uppercase py-4"
              value={code}
              onChange={e => {
                const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
                setCode(val)
                setError(null)
              }}
              onKeyDown={e => { if (e.key === 'Enter') handleJoin() }}
              placeholder="XXXXXX"
              maxLength={6}
              spellCheck={false}
              autoCapitalize="characters"
              autoFocus
            />
          </div>

          {authed === false && (
            <div className="mb-6 space-y-4">
              <div>
                <Input
                  label="Your name (optional)"
                  type="text"
                  placeholder="e.g. Alice"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  maxLength={50}
                />
                <p className="text-xs text-omni-ink-faint mt-1.5">
                  Helps the moderator identify your photos. You can skip this.
                </p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-omni-border text-accent focus:ring-accent"
                  checked={ageConfirmed}
                  onChange={e => setAgeConfirmed(e.target.checked)}
                />
                <span className="text-sm text-omni-ink-soft">
                  I confirm I am 13 years of age or older.
                </span>
              </label>
            </div>
          )}

          <Button
            onClick={() => handleJoin()}
            className="w-full justify-center text-base py-3"
            disabled={loading || code.length !== 6}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-accent-contrast/30 border-t-accent-contrast rounded-full animate-spin" />
                Joining...
              </>
            ) : 'Join Room'}
          </Button>
        </div>

      </div>
    </div>
  )
}
