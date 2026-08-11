import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  collection,
  collectionGroup,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/useAuth'
import AuthControls from '../components/AuthControls'
import AppHeader from '../components/AppHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import { toast } from 'react-hot-toast'
import { isEventEnded } from '../utils/eventStatus'

export default function MyEventsPage() {
  const { user, authLoading } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingDelete, setPendingDelete] = useState(null) // { id, data } | null
  const [pendingLeave, setPendingLeave] = useState(null) // { id, data } | null
  const [busyEventId, setBusyEventId] = useState(null)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setEvents([])
      setLoading(false)
      return
    }

    let cancelled = false

    const loadMyEvents = async () => {
      setLoading(true)
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

        if (!cancelled) {
          setEvents(Array.from(results.values()))
        }
      } catch (error) {
        console.error('Failed to load my events:', error)
        if (!cancelled) {
          toast.error('Could not load your events.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadMyEvents()

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

    const upcoming = withStatus
      .filter((e) => !e.ended)
      .sort(byEndDateAsc)
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
      await Promise.all(
        participantsSnap.docs.map((p) => deleteDoc(p.ref)),
      )
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

  return (
    <div className="min-h-full flex flex-col">
      <AppHeader right={user ? <AuthControls compact /> : null} />

      <div className="items-center align-middle justify-center flex flex-col gap-6 pt-8 pb-16 px-4">
        <h1 className="font-display text-primary text-3xl sm:text-4xl font-extrabold">
          📅 My Events
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
              Sign in with Google to see events you created or joined.
            </p>
            <AuthControls />
          </div>
        )}

        {user && loading && (
          <p className="font-bold">Loading your events...</p>
        )}

        {user && !loading && sortedEvents.length === 0 && (
          <p className="font-bold text-center max-w-sm">
            No events yet. Create one, or open an invite link and set your
            availability while signed in.
          </p>
        )}

        {user && !loading && sortedEvents.length > 0 && (
          <div className="flex flex-col gap-3 w-full max-w-xl">
            {sortedEvents.map(({ id, data, roles, ended }) => {
              const isCreatorRole = roles.has('creator')
              const isBusy = busyEventId === id

              return (
                <div
                  key={id}
                  style={{
                    backdropFilter: 'blur(10px)',
                    backgroundColor: ended
                      ? 'rgba(255, 255, 255, 0.18)'
                      : 'rgba(255, 255, 255, 0.35)',
                  }}
                  className={`relative rounded-xl shadow-md transition-shadow duration-200 ${ended ? 'opacity-60 hover:opacity-80' : 'hover:shadow-lg'}`}
                >
                  <Link
                    to={`/event/${id}`}
                    className="flex flex-col items-start gap-1 p-4 text-left"
                  >
                    <span className="text-lg font-extrabold text-primary pr-6">
                      {data.eventName}
                    </span>
                    {data.eventLocation && (
                      <span className="text-sm">🗺️ {data.eventLocation}</span>
                    )}
                    <span className="text-xs opacity-70">
                      {data.dateStart && data.dateEnd
                        ? `${data.dateStart} → ${data.dateEnd}`
                        : null}
                    </span>
                    <span className="flex items-center gap-2 text-xs font-bold text-primary">
                      {Array.from(roles)
                        .map((role) =>
                          role === 'creator' ? '👑 Creator' : '🙋 Participant',
                        )
                        .join(' · ')}
                      {ended && (
                        <span className="rounded-full bg-slate-200 text-slate-600 px-2 py-0.5">
                          Ended
                        </span>
                      )}
                    </span>
                  </Link>

                  {isCreatorRole ? (
                    <button
                      disabled={isBusy}
                      onClick={() => setPendingDelete({ id, data })}
                      title="Delete event"
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition-colors duration-150 cursor-pointer disabled:opacity-40"
                    >
                      🗑️
                    </button>
                  ) : (
                    <button
                      disabled={isBusy}
                      onClick={() => setPendingLeave({ id, data })}
                      title="Remove from My Events"
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition-colors duration-150 cursor-pointer disabled:opacity-40"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )
            })}
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
    </div>
  )
}
