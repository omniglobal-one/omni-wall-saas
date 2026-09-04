import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { ShareShell } from '@/components/layout/ShareShell'
import { Topbar } from '@/components/dashboard/Topbar'
import { ManageTabs } from './ManageTabs'
import { Badge } from '@/components/ui/Badge'
import type { Profile, Room, Photo, AuditLog } from '@/types'

type ManageTab = 'overview' | 'photos' | 'moderators' | 'settings'

export default async function ManageRoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ room_id: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { room_id } = await params
  const { tab } = await searchParams

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createServiceRoleClient()

  const { data: profile } = await admin.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  const role = (profile as Profile).role
  if (role !== 'admin' && role !== 'manager') redirect('/rooms')

  const { data: room } = await admin.from('rooms').select('*').eq('id', room_id).single()
  if (!room) notFound()

  const activeTab = (['overview', 'photos', 'moderators', 'settings'].includes(tab ?? '')
    ? tab
    : 'overview') as ManageTab

  const [{ data: photos }, { data: mods }, { count: memberCount }, { data: auditLogs }] = await Promise.all([
    admin.from('photos').select('*, moderator:profiles!moderated_by(id, full_name)').eq('room_id', room_id).order('uploaded_at', { ascending: false }),
    admin.from('room_moderators').select('*, profiles(*)').eq('room_id', room_id),
    admin.from('room_members').select('id', { count: 'exact', head: true }).eq('room_id', room_id),
    admin.from('audit_logs').select('*').eq('target_id', room_id).order('created_at', { ascending: false }).limit(20),
  ])

  // Resolve actor names for audit log entries
  const actorIdSet: Record<string, true> = {}
  ;(auditLogs ?? []).forEach(l => { if (l.actor_id) actorIdSet[l.actor_id] = true })
  const actorIds = Object.keys(actorIdSet)
  const { data: actorProfiles } = actorIds.length > 0
    ? await admin.from('profiles').select('id, full_name, username').in('id', actorIds)
    : { data: [] }
  const actorMap: Record<string, string> = Object.fromEntries(
    (actorProfiles ?? []).map(p => [p.id, (p.full_name ?? p.username ?? null)]).filter(([, v]) => v)
  )

  const baseUrl = `/manage/${room_id}`
  const appUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000'

  // A room's own overview/photos/moderators/settings tabs — page-level
  // content navigation (query-param-driven, so ManageTabs' SSR state and
  // deep links both keep working), not global nav. Previously lived as a
  // "subnav" section bolted onto the sidebar; moved here to match the doc's
  // own separation between persistent nav and a page's own tabs.
  const tabLinks: { label: string; href: string; tab: ManageTab }[] = [
    { label: 'Overview', href: baseUrl, tab: 'overview' },
    { label: 'Photos', href: `${baseUrl}?tab=photos`, tab: 'photos' },
    { label: 'Moderators', href: `${baseUrl}?tab=moderators`, tab: 'moderators' },
    { label: 'Settings', href: `${baseUrl}?tab=settings`, tab: 'settings' },
  ]

  return (
    <ShareShell role={role} userEmail={user.email ?? ''} userName={(profile as Profile).full_name}>
      <Topbar
        title={room.name}
        subtitle={<><span>Room management</span><Badge variant={room.status as 'active' | 'archived'} /></>}
      />
      <div className="flex gap-6 overflow-x-auto border-b border-omni-border px-4 sm:px-8">
        {tabLinks.map((t) => (
          <Link
            key={t.tab}
            href={t.href}
            className={`shrink-0 border-b-2 py-2.5 font-sans text-small font-semibold ${
              activeTab === t.tab ? 'border-accent text-omni-ink' : 'border-transparent text-omni-ink-faint hover:text-omni-ink'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>
      <ManageTabs
        room={room as Room}
        photos={(photos ?? []) as Photo[]}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        moderators={(mods ?? []) as any}
        memberCount={memberCount ?? 0}
        auditLogs={(auditLogs ?? []) as AuditLog[]}
        actorMap={actorMap}
        userRole={role}
        appUrl={appUrl}
        activeTab={activeTab}
      />
    </ShareShell>
  )
}
