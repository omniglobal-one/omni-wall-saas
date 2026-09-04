'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar, BottomTabNav, type NavDestination } from '@omni/ui'
import { signOut } from '@/app/actions/auth'
import type { Role } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: ReactNode
}

const icons = {
  rooms: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  ),
  admin: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  newRoom: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="4" x2="12" y2="20" /><line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  ),
  join: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
}

function getNavItems(role: Role): NavItem[] {
  const navByRole: Record<Role, NavItem[]> = {
    admin: [
      { label: 'My Rooms', href: '/rooms', icon: icons.rooms },
      { label: 'Admin', href: '/admin', icon: icons.admin },
    ],
    manager: [
      { label: 'My Rooms', href: '/rooms', icon: icons.rooms },
      { label: 'Create Room', href: '/manage/new', icon: icons.newRoom },
    ],
    moderator: [
      { label: 'My Rooms', href: '/rooms', icon: icons.rooms },
    ],
    user: [
      { label: 'My Rooms', href: '/rooms', icon: icons.rooms },
      { label: 'Join a Room', href: '/join', icon: icons.join },
    ],
  }
  return navByRole[role] ?? []
}

function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    admin: 'Platform Admin',
    manager: 'Room Manager',
    moderator: 'Moderator',
    user: 'Member',
  }
  return labels[role] ?? role
}

function toDestination(item: NavItem, pathname: string): NavDestination {
  return {
    key: item.href,
    label: item.label,
    href: item.href,
    icon: item.icon,
    active: pathname === item.href || pathname.startsWith(item.href + '/'),
  }
}

const renderLink = (dest: NavDestination, children: ReactNode) => (
  <Link key={dest.key} href={dest.href}>
    {children}
  </Link>
)

interface ShareShellProps {
  role: Role
  userEmail: string
  userName?: string | null | undefined
  children: ReactNode
}

function ShareSidebarDesktop({ role, userEmail, userName }: Omit<ShareShellProps, 'children'>) {
  const pathname = usePathname()
  const router = useRouter()
  const destinations = getNavItems(role).map((item) => toDestination(item, pathname))

  async function handleSignOut() {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <Sidebar
      destinations={destinations}
      renderLink={renderLink}
      productName="Share"
      productLogo={
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-accent">
          <Image src="/icon.png" alt="" width={20} height={20} className="rounded-sm" />
        </div>
      }
      footer={
        <div>
          <div className="flex justify-center lg:hidden">
            <button type="button" onClick={handleSignOut} aria-label="Sign out" className="flex h-9 w-9 items-center justify-center rounded-sm text-omni-ink-soft hover:bg-omni-surface-sunk hover:text-omni-ink">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:block">
            <p className="truncate px-1 text-small font-semibold text-omni-ink">{userName ?? 'User'}</p>
            <p className="truncate px-1 text-caption text-omni-ink-faint">{userEmail}</p>
            <p className="mt-1 truncate px-1 text-caption text-omni-ink-faint">{getRoleLabel(role)}</p>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-2 flex h-9 w-full items-center gap-2 rounded-sm px-3 text-small font-semibold text-omni-ink-soft hover:bg-omni-surface-sunk hover:text-omni-ink"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      }
    />
  )
}

function ShareBottomNav({ role }: Pick<ShareShellProps, 'role'>) {
  const pathname = usePathname()
  return <BottomTabNav destinations={getNavItems(role).map((item) => toDestination(item, pathname))} renderLink={renderLink} />
}

export function ShareShell({ role, userEmail, userName, children }: ShareShellProps) {
  return (
    <div className="flex h-screen bg-omni-bg">
      <ShareSidebarDesktop role={role} userEmail={userEmail} userName={userName} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-16 sm:pb-0">{children}</main>
      </div>
      <ShareBottomNav role={role} />
    </div>
  )
}
