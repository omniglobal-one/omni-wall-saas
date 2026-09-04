import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button, EmptyState } from '@omni/ui'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { ShareShell } from '@/components/layout/ShareShell'
import { Topbar } from '@/components/dashboard/Topbar'
import { RoomCard } from '@/components/rooms/RoomCard'
import type { Room, Profile, Role } from '@/types'

async function getRoomsForUser(userId: string, role: Role) {
  const admin = createServiceRoleClient()
  let rooms: Room[] = []

  if (role === 'admin') {
    const { data } = await admin.from('rooms').select('*').order('created_at', { ascending: false })
    rooms = data ?? []
  } else if (role === 'manager') {
    const { data } = await admin.from('rooms').select('*').eq('owner_id', userId).order('created_at', { ascending: false })
    rooms = data ?? []
  } else if (role === 'moderator') {
    const { data } = await admin
      .from('room_moderators')
      .select('rooms(*)')
      .eq('moderator_id', userId)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rooms = (data ?? []).flatMap((r: any) => (r.rooms ? [r.rooms as Room] : []))
  } else {
    const { data } = await admin
      .from('room_members')
      .select('rooms(*)')
      .eq('user_id', userId)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rooms = (data ?? []).flatMap((r: any) => (r.rooms ? [r.rooms as Room] : []))
  }

  return rooms
}

export default async function RoomsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createServiceRoleClient()
  const { data: profile } = await admin.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  const role = (profile as Profile).role
  const rooms = await getRoomsForUser(user.id, role)
  const isManagerOrAdmin = role === 'admin' || role === 'manager'

  return (
    <ShareShell role={role} userEmail={user.email ?? ''} userName={(profile as Profile).full_name}>
      <Topbar
        title="My Rooms"
        subtitle={`${rooms.length} room${rooms.length !== 1 ? 's' : ''}`}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="secondary">
              <Link href="/join">Join a room</Link>
            </Button>
            {isManagerOrAdmin && (
              <Button asChild>
                <Link href="/manage/new">Create room</Link>
              </Button>
            )}
          </div>
        }
      />
      <div className="p-4 sm:p-6 lg:p-8">
        {rooms.length === 0 ? (
          <EmptyState
            title="No rooms yet"
            description={isManagerOrAdmin ? 'Create your first room to get started.' : 'Enter a join code to join a room.'}
            action={
              isManagerOrAdmin
                ? <Button asChild><Link href="/manage/new">Create room</Link></Button>
                : <Button asChild><Link href="/join">Join a room</Link></Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map(room => (
              <RoomCard key={room.id} room={room} role={role} />
            ))}
          </div>
        )}
      </div>
    </ShareShell>
  )
}
