'use client'
import React, { useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight, Check, Trash2, Loader2 } from 'lucide-react'
import type { Photo } from '@/types'

interface PhotoLightboxProps {
  photos: Photo[]
  initialIndex: number
  onClose: () => void
  onModerate: (photoId: string, status: 'approved' | 'rejected') => Promise<void>
  onDelete: (photoId: string) => Promise<void>
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export function PhotoLightbox({ photos, initialIndex, onClose, onModerate, onDelete }: PhotoLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [acting, setActing] = useState<'approve' | 'reject' | 'delete' | null>(null)
  const [localPhotos, setLocalPhotos] = useState<Photo[]>(photos)

  const photo = localPhotos[index]

  const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex(i => Math.min(localPhotos.length - 1, i + 1)), [localPhotos.length])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  async function handleModerate(status: 'approved' | 'rejected') {
    if (!photo) return
    setActing(status === 'approved' ? 'approve' : 'reject')
    await onModerate(photo.id, status)
    setLocalPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, status } : p))
    setActing(null)
    // Auto-advance to next pending photo if there is one
    const nextPending = localPhotos.findIndex((p, i) => i > index && p.status === 'pending')
    if (nextPending !== -1) setIndex(nextPending)
  }

  async function handleDelete() {
    if (!photo) return
    setActing('delete')
    await onDelete(photo.id)
    const newPhotos = localPhotos.filter(p => p.id !== photo.id)
    setLocalPhotos(newPhotos)
    setActing(null)
    if (newPhotos.length === 0) { onClose(); return }
    setIndex(i => Math.min(i, newPhotos.length - 1))
  }

  if (!photo || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95" role="dialog" aria-modal="true">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${STATUS_STYLES[photo.status] ?? ''}`}>
            {photo.status}
          </span>
          <span className="text-white/70 text-sm truncate">{photo.file_name ?? photo.id}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-white/40 text-sm">{index + 1} / {localPhotos.length}</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Photo area */}
      <div className="flex-1 flex items-center justify-center relative min-h-0 px-16">
        {/* Prev */}
        <button
          onClick={prev}
          disabled={index === 0}
          className="absolute left-2 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          aria-label="Previous"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>

        {/* Image */}
        <div className="h-full w-full flex items-center justify-center py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={photo.id}
            src={photo.public_url}
            alt={photo.file_name ?? ''}
            className="max-h-full max-w-full object-contain select-none"
            style={{ maxHeight: 'calc(100vh - 180px)' }}
          />
        </div>

        {/* Next */}
        <button
          onClick={next}
          disabled={index === localPhotos.length - 1}
          className="absolute right-2 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          aria-label="Next"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-center gap-3 px-4 py-4 border-t border-white/10 flex-shrink-0">
        {photo.status !== 'approved' && (
          <button
            onClick={() => handleModerate('approved')}
            disabled={acting !== null}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {acting === 'approve' ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Approving…</>
            ) : (
              <><Check className="h-4 w-4" />Approve</>
            )}
          </button>
        )}
        {photo.status !== 'rejected' && (
          <button
            onClick={() => handleModerate('rejected')}
            disabled={acting !== null}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {acting === 'reject' ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Rejecting…</>
            ) : (
              <><X className="h-4 w-4" />Reject</>
            )}
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={acting !== null}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {acting === 'delete' ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Deleting…</>
          ) : (
            <><Trash2 className="h-4 w-4" />Delete</>
          )}
        </button>
      </div>

      {/* Thumbnail strip */}
      {localPhotos.length > 1 && (
        <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto flex-shrink-0 justify-center">
          {localPhotos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setIndex(i)}
              className={`relative flex-shrink-0 w-12 h-12 rounded overflow-hidden transition-all ${
                i === index ? 'ring-2 ring-white opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.public_url} alt="" className="w-full h-full object-cover" />
              {p.status === 'pending' && (
                <div className="absolute inset-0 border-2 border-amber-400 rounded pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}
