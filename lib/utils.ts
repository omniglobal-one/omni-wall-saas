import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function getInitials(name?: string | null): string {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  const first = parts[0]?.[0] ?? ''
  const last = parts[1]?.[0] ?? ''
  return (first + last).toUpperCase() || '?'
}
