import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  collection,
  collectionGroup,
  query,
  where,
  getDocs,
  getCountFromServer,
  doc,
  getDoc,
  deleteDoc,
  addDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/useAuth'
import AuthControls from '../components/AuthControls'
import UserMenu from '../components/UserMenu'
import AppHeader from '../components/AppHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import CreateGroupDialog from '../components/CreateGroupDialog'
import EventListCard from '../components/EventListCard'
import GroupAvatar from '../components/GroupAvatar'
import ScrollToTopButton from '../components/ScrollToTopButton'
import { toast } from 'react-hot-toast'
import { isEventEnded } from '../utils/eventStatus'

export default function MyEventsPage() {
  const { user, authLoading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('events') // 'events' | 'groups'

  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [pendingDelete, setPendingDelete] = useState(null) // { id, data } | null
  const [pendingLeave, setPendingLeave] = useState(null) // { id, data } | null
  const [busyEventId, setBusyEventId] = useState(null)

  const [groups, setGroups] = useState([])
  const [groupsLoading, setGroupsLoading] = useState(true)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [creatingGroup, setCreatingGroup] = useState(false)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setEvents([])
      setEventsLoading(false)
      return
    }

    let cancelled = false

    const loadMyEvents = async () => {
      setEventsLoading(true)
      try {
        const results = new Map() // eventId -> { id, data, roles: Set }

        // 1) Events the user created directly.
        const createdQuery = query(
          collection(db, 'events'),
          where('createdBy', '==', user.uid),
        )
        const createdSnap = await getDocs(createdQuery)
        createdSnap.forEach((eventDoc) => {
          results.set(eventDoc.id, {
            id: eventDoc.id,
            data: eventDoc.data(),
            roles: new Set(['creator']),
          })
        })

        // 2) Events the user joined as a participant (across all events),
        // found via a collection-group query on the "participants" subcollections.
        // NOTE: this requires a Firestore collection-group index on
        // participants.uid (Firestore will prompt with a console link
        // the first time this query runs if it's missing).
        const participantQuery = query(
          collectionGroup(db, 'participants'),
          where('uid', '==', user.uid),
        )
        const participantSnap = await getDocs(participantQuery)

        const missingEventIds = []
        participantSnap.forEach((participantDoc) => {
          const eventId = participantDoc.ref.parent.parent.id
          if (results.has(eventId)) {
            results.get(eventId).roles.add('participant')
          } else {
            missingEventIds.push(eventId)
          }
        })

        // Fetch event data for joined-but-not-created events.
        await Promise.all(
          missingEventIds.map(async (eventId) => {
            const eventSnap = await getDoc(doc(db, 'events', eventId))
            if (eventSnap.exists()) {
              results.set(eventId, {
                id: eventId,
                data: eventSnap.data(),
                roles: new Set(['participant']),
              })
            }
          }),
        )

        // Cheap aggregation query - counts docs without fetching them.
        await Promise.all(
          Array.from(results.values()).map(async (event) => {
            try {
              const countSnap = await getCountFromServer(
                collection(db, 'events', event.id, 'participants'),
              )
              event.participantCount = countSnap.data().count
            } catch (error) {
              console.error(
                `Failed to count participants for ${event.id}:`,
                error,
              )
            }
          }),
        )

        if (!cancelled) {
          setEvents(Array.from(results.values()))
        }
      } catch (error) {
        console.error('Failed to load my events:', error)
        if (!cancelled) {
          toast.error('Could not load your events.')
        }
      } finally {
        if (!cancelled) setEventsLoading(false)
      }
    }

    loadMyEvents()

    return () => {
      cancelled = true
    }
  }, [user, authLoading])

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setGroups([])
      setGroupsLoading(false)
      return
    }

    let cancelled = false

    const loadMyGroups = async () => {
      setGroupsLoading(true)
      try {
        // Groups the user belongs to, found via a collection-group query on
        // "members" subcollections. Requires a Firestore collection-group
        // index on members.uid.
        const membershipQuery = query(
          collectionGroup(db, 'members'),
          where('uid', '==', user.uid),
        )
        const membershipSnap = await getDocs(membershipQuery)

        const groupIds = membershipSnap.docs.map(
          (memberDoc) => memberDoc.ref.parent.parent.id,
        )

        const groupResults = await Promise.all(
          groupIds.map(async (groupId) => {
            const groupSnap = await getDoc(doc(db, 'groups', groupId))
            if (!groupSnap.exists()) return null

            const membersSnap = await getDocs(
              collection(db, 'groups', groupId, 'members'),
            )

            return {
              id: groupId,
              data: groupSnap.data(),
              memberCount: membersSnap.size,
            }
          }),
        )

        if (!cancelled) {
          setGroups(groupResults.filter(Boolean))
        }
      } catch (error) {
        console.error('Failed to load my groups:', error)
        if (!cancelled) {
          toast.error('Could not load your groups.')
        }
      } finally {
        if (!cancelled) setGroupsLoading(false)
      }
    }

    loadMyGroups()

    return () => {
      cancelled = true
    }
  }, [user, authLoading])

  // Upcoming events first (soonest end date first), ended events pushed to
  // the bottom and shown grayed-out rather than hidden entirely.
  const sortedEvents = useMemo(() => {
    const withStatus = events.map((event) => ({
      ...event,
      ended: isEventEnded(event.data),
    }))

    const byEndDateAsc = (a, b) =>
      (a.data.dateEnd || '').localeCompare(b.data.dateEnd || '')

    const upcoming = withStatus.filter((e) => !e.ended).sort(byEndDateAsc)
    const ended = withStatus
      .filter((e) => e.ended)
      .sort((a, b) => byEndDateAsc(b, a)) // most recently ended first

    return [...upcoming, ...ended]
  }, [events])

  const deleteEventCompletely = async () => {
    if (!pendingDelete) return
    const { id } = pendingDelete
    setBusyEventId(id)
    try {
      const participantsSnap = await getDocs(
        collection(db, 'events', id, 'participants'),
      )
      await Promise.all(participantsSnap.docs.map((p) => deleteDoc(p.ref)))
      await deleteDoc(doc(db, 'events', id))

      setEvents((prev) => prev.filter((e) => e.id !== id))
      toast.success('Event deleted.')
    } catch (error) {
      console.error('Failed to delete event:', error)
      toast.error('Could not delete this event.')
    } finally {
      setBusyEventId(null)
      setPendingDelete(null)
    }
  }

  const leaveEvent = async () => {
    if (!pendingLeave || !user) return
    const { id } = pendingLeave
    setBusyEventId(id)
    try {
      await deleteDoc(doc(db, 'events', id, 'participants', user.uid))
      setEvents((prev) => prev.filter((e) => e.id !== id))
      toast.success('You left this event.')
    } catch (error) {
      console.error('Failed to leave event:', error)
      toast.error('Could not remove your availability.')
    } finally {
      setBusyEventId(null)
      setPendingLeave(null)
    }
  }

  const createGroup = async (name) => {
    if (!user) return
    setCreatingGroup(true)
    try {
      const groupRef = await addDoc(collection(db, 'groups'), {
        name,
        ownerUid: user.uid,
        ownerName: user.displayName || user.email || 'Anonymous',
        createdAt: serverTimestamp(),
      })

      // The owner is automatically a member too.
      await setDoc(doc(db, 'groups', groupRef.id, 'members', user.uid), {
        uid: user.uid,
        displayName: user.displayName || user.email || 'Anonymous',
        joinedAt: serverTimestamp(),
      })

      toast.success('Group created!')
      setShowCreateGroup(false)
      navigate(`/group/${groupRef.id}`)
    } catch (error) {
      console.error('Failed to create group:', error)
      toast.error('Could not create the group.')
    } finally {
      setCreatingGroup(false)
    }
  }

  return (
    <div className="min-h-full flex flex-col">
      <AppHeader right={user ? <UserMenu avatarOnly /> : null} />

      <div className="items-center align-middle justify-center flex flex-col gap-6 pt-8 pb-16 px-4">
        <h1 className="font-display text-primary text-3xl sm:text-4xl font-extrabold">
          My Meetler
        </h1>

        {!authLoading && !user && (
          <div
            style={{
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            }}
            className="flex flex-col items-center gap-4 p-6 rounded-2xl shadow-lg"
          >
            <p className="font-bold">
              Sign in with Google to see your events and groups.
            </p>
            <AuthControls />
          </div>
        )}

        {user && (
          <div className="flex items-center gap-1 rounded-full bg-white/50 backdrop-blur-md p-1 shadow-inner">
            <button
              onClick={() => setTab('events')}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors duration-150 cursor-pointer ${tab === 'events' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-white/60'}`}
            >
              📅 Events
            </button>
            <button
              onClick={() => setTab('groups')}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors duration-150 cursor-pointer ${tab === 'groups' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-white/60'}`}
            >
              👥 Groups
            </button>
          </div>
        )}

        {user && tab === 'events' && eventsLoading && (
          <p className="font-bold">Loading your events...</p>
        )}

        {user &&
          tab === 'events' &&
          !eventsLoading &&
          sortedEvents.length === 0 && (
            <p className="font-bold text-center max-w-sm">
              No events yet. Create one, or open an invite link and set your
              availability while signed in.
            </p>
          )}

        {user &&
          tab === 'events' &&
          !eventsLoading &&
          sortedEvents.length > 0 && (
            <div className="flex flex-col gap-3 w-full max-w-xl">
              {sortedEvents.map(
                ({ id, data, roles, ended, participantCount }) => {
                  const isCreatorRole = roles.has('creator')
                  const isBusy = busyEventId === id

                  return (
                    <EventListCard
                      key={id}
                      id={id}
                      data={data}
                      ended={ended}
                      participantCount={participantCount}
                      badge={Array.from(roles)
                        .map((role) =>
                          role === 'creator' ? '👑 Creator' : '🙋 Participant',
                        )
                        .join(' · ')}
                      cornerAction={
                        isCreatorRole
                          ? {
                              icon: '🗑️',
                              title: 'Delete event',
                              disabled: isBusy,
                              onClick: () => setPendingDelete({ id, data }),
                            }
                          : {
                              icon: '✕',
                              title: 'Remove from My Events',
                              disabled: isBusy,
                              onClick: () => setPendingLeave({ id, data }),
                            }
                      }
                    />
                  )
                },
              )}
            </div>
          )}

        {user && tab === 'groups' && (
          <div className="flex flex-col gap-3 w-full max-w-xl">
            <button
              onClick={() => setShowCreateGroup(true)}
              className="self-center rounded-xl bg-primary text-white text-sm font-bold px-4 py-2 hover:bg-primary-hover transition-colors duration-150 cursor-pointer"
            >
              + New group
            </button>

            {groupsLoading && (
              <p className="font-bold text-center">Loading your groups...</p>
            )}

            {!groupsLoading && groups.length === 0 && (
              <p className="font-bold text-center max-w-sm mx-auto">
                No groups yet. Create one to organize recurring events with the
                same people.
              </p>
            )}

            {!groupsLoading &&
              groups.map(({ id, data, memberCount }) => (
                <Link
                  key={id}
                  to={`/group/${id}`}
                  style={{
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.35)',
                  }}
                  className="flex items-center gap-3 p-4 rounded-xl shadow-md hover:opacity-90 hover:shadow-lg transition-shadow duration-200"
                >
                  <GroupAvatar
                    name={data.name}
                    photoDataUrl={data.photoDataUrl}
                  />
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-lg font-extrabold text-primary">
                      {data.name}
                    </span>
                    <span className="text-xs opacity-70">
                      {memberCount} {memberCount === 1 ? 'member' : 'members'}
                    </span>
                    {data.ownerUid === user.uid && (
                      <span className="text-xs font-bold text-primary">
                        👑 Owner
                      </span>
                    )}
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this event?"
        message={`"${pendingDelete?.data?.eventName}" and everyone's availability will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete event"
        onConfirm={deleteEventCompletely}
        onCancel={() => setPendingDelete(null)}
      />

      <ConfirmDialog
        open={!!pendingLeave}
        title="Remove yourself from this event?"
        message={`Your availability for "${pendingLeave?.data?.eventName}" will be deleted and it will disappear from My Events. You can rejoin later using the event link.`}
        confirmLabel="Remove me"
        onConfirm={leaveEvent}
        onCancel={() => setPendingLeave(null)}
      />

      <CreateGroupDialog
        open={showCreateGroup}
        busy={creatingGroup}
        onCreate={createGroup}
        onCancel={() => setShowCreateGroup(false)}
      />

      <ScrollToTopButton />
    </div>
  )
}
