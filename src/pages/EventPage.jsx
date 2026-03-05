import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useEffect, useState } from 'react'
import EventView from '../components/EventView'

export default function EventPage() {
  const { eventId } = useParams()
  const [eventData, setEventData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, 'events', eventId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setEventData(docSnap.data())
      }

      setLoading(false)
    }

    fetchEvent()
  }, [eventId])

  if (loading) return <p>Loading...</p>

  if (!eventData) return <p>Event not found</p>
  return (
    <>
      {/* <div className="absolute bg-white rounded-4xl p-0.5 top-1 left-1">
        <h2 className="text-sm">Event ID: {eventId}</h2>
      </div> */}
      <EventView eventData={eventData} eventId={eventId} />
    </>
  )
}
