import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  collection,
  collectionGroup,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/useAuth'
import AuthControls from '../components/AuthControls'
import { toast } from 'react-hot-toast'

export default function MyEventsPage() {
  const { user, authLoading } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="items-center align-middle justify-center flex flex-col gap-6 pt-10 px-4">
      <h1 className="text-primary text-4xl font-extrabold">
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

      {user && loading && <p className="font-bold">Loading your events...</p>}

      {user && !loading && events.length === 0 && (
        <p className="font-bold">
          No events yet. Create one, or open an invite link and set your
          availability while signed in.
        </p>
      )}

      {user && !loading && events.length > 0 && (
        <div className="flex flex-col gap-3 w-full max-w-xl">
          {events.map(({ id, data, roles }) => (
            <Link
              key={id}
              to={`/event/${id}`}
              style={{
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.35)',
              }}
              className="flex flex-col items-start gap-1 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 text-left"
            >
              <span className="text-lg font-extrabold text-primary">
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
              <span className="text-xs font-bold text-primary">
                {Array.from(roles)
                  .map((role) =>
                    role === 'creator' ? '👑 Creator' : '🙋 Participant',
                  )
                  .join(' · ')}
              </span>
            </Link>
          ))}
        </div>
      )}

      <Link to="/" className="text-primary font-bold hover:underline mt-4">
        ← Back to home
      </Link>
    </div>
  )
}
