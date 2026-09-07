'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, Images, ShieldCheck, PlusCircle, LogIn, LogOut } from 'lucide-react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/app/actions/auth'
import type { Role } from '@/types'

const NAV_BY_ROLE: Record<Role, { href: string; label: string; icon: typeof Images }[]> = {
  admin: [
    { href: '/rooms', label: 'My Rooms', icon: Images },
    { href: '/admin', label: 'Admin', icon: ShieldCheck },
  ],
  manager: [
    { href: '/rooms', label: 'My Rooms', icon: Images },
    { href: '/manage/new', label: 'Create Room', icon: PlusCircle },
  ],
  moderator: [{ href: '/rooms', label: 'My Rooms', icon: Images }],
  user: [
    { href: '/rooms', label: 'My Rooms', icon: Images },
    { href: '/join', label: 'Join a Room', icon: LogIn },
  ],
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

interface ShareShellProps {
  role: Role
  userEmail: string
  userName?: string | null | undefined
  children: ReactNode
}

export function ShareShell({ role, userEmail, userName, children }: ShareShellProps) {
  const router = useRouter()
  const nav = NAV_BY_ROLE[role] ?? []

  async function handleSignOut() {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/70 px-4 md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="!px-2">
                <Menu className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {nav.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="size-4" /> {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <UserMenu role={role} userEmail={userEmail} userName={userName} onSignOut={handleSignOut} />
        </header>
        <div className="hidden justify-end border-b border-border/70 px-6 py-2.5 md:flex">
          <UserMenu role={role} userEmail={userEmail} userName={userName} onSignOut={handleSignOut} />
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

function UserMenu({
  role,
  userEmail,
  userName,
  onSignOut,
}: {
  role: Role
  userEmail: string
  userName?: string | null | undefined
  onSignOut: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full transition-opacity hover:opacity-80">
          <Avatar fullName={userName} size="sm" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="truncate text-sm font-medium">{userName ?? 'User'}</p>
          <p className="truncate text-xs font-normal text-muted-foreground">{userEmail}</p>
          <p className="mt-1 text-xs font-normal text-muted-foreground">{getRoleLabel(role)}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onSignOut} className="gap-2 text-danger focus:text-danger">
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
