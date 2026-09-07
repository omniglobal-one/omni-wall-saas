'use client'
import { useState } from 'react'
import { ArrowUp, ArrowDown, X, Plus } from 'lucide-react'
import type { SocialLink } from '@/types'

const PLATFORMS = [
  'Instagram', 'Twitter/X', 'Facebook', 'TikTok', 'YouTube',
  'WhatsApp', 'Snapchat', 'Telegram',
  'LinkedIn', 'GitHub', 'Reddit', 'Medium',
  'Twitch', 'Discord', 'Pinterest',
  'Google Reviews', 'Website', 'Email', 'Other',
]

interface SocialLinkEditorProps {
  links: SocialLink[]
  onChange: (links: SocialLink[]) => void
}

export function SocialLinkEditor({ links, onChange }: SocialLinkEditorProps) {
  const [showAdd, setShowAdd] = useState(false)
  const [newLink, setNewLink] = useState<Omit<SocialLink, 'display_order'>>({
    platform: PLATFORMS[0] ?? 'Other',
    label: '',
    url: '',
  })

  function addLink() {
    if (links.length >= 20) return
    const trimmedUrl = newLink.url.trim()
    const trimmedLabel = newLink.label.trim()
    if (!trimmedUrl || !trimmedLabel) return
    if (!/^https?:\/\//i.test(trimmedUrl)) return
    onChange([...links, { ...newLink, url: trimmedUrl, label: trimmedLabel, display_order: links.length }])
    setNewLink({ platform: PLATFORMS[0] ?? 'Other', label: '', url: '' })
    setShowAdd(false)
  }

  function removeLink(index: number) {
    onChange(links.filter((_, i) => i !== index).map((l, i) => ({ ...l, display_order: i })))
  }

  function moveLink(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= links.length) return
    const updated = [...links]
    const a = updated[index]!
    const b = updated[target]!
    updated[index] = { ...b, display_order: index }
    updated[target] = { ...a, display_order: target }
    onChange(updated)
  }

  return (
    <div className="flex flex-col gap-3">
      {links.length > 0 && (
        <div className="card divide-y divide-border overflow-hidden">
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">{link.label}</p>
                <p className="truncate text-xs text-text-tertiary">{link.platform} · {link.url}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-1">
                <button type="button" onClick={() => moveLink(index, -1)} disabled={index === 0}
                  className="flex h-7 w-7 items-center justify-center rounded text-text-tertiary transition-colors hover:bg-bg-border hover:text-text-primary disabled:opacity-30">
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => moveLink(index, 1)} disabled={index === links.length - 1}
                  className="flex h-7 w-7 items-center justify-center rounded text-text-tertiary transition-colors hover:bg-bg-border hover:text-text-primary disabled:opacity-30">
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => removeLink(index)}
                  className="ml-1 flex h-7 w-7 items-center justify-center rounded text-text-tertiary transition-colors hover:bg-danger/10 hover:text-danger">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {links.length === 0 && !showAdd && (
        <p className="text-xs text-text-tertiary">No links added yet.</p>
      )}

      {links.length < 20 && (
        showAdd ? (
          <div className="card flex flex-col gap-3 p-4">
            <select value={newLink.platform} onChange={e => setNewLink(f => ({ ...f, platform: e.target.value }))} className="input text-sm">
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input type="text" placeholder="Label (e.g. Event Page)" value={newLink.label}
              onChange={e => setNewLink(f => ({ ...f, label: e.target.value }))} className="input text-sm" maxLength={50} />
            <input type="url" placeholder="https://…" value={newLink.url}
              onChange={e => setNewLink(f => ({ ...f, url: e.target.value }))} className="input text-sm" />
            <div className="flex gap-2">
              <button type="button" onClick={addLink} className="btn-primary text-sm">Add</button>
              <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setShowAdd(true)} className="btn-secondary w-full justify-center text-sm">
            <Plus className="h-4 w-4" /> Add Link
          </button>
        )
      )}
    </div>
  )
}
