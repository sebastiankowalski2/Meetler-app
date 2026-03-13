import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useEffect, useState } from 'react'
import EventView from '../components/EventView'
import image from '../assets/web.png'
import image2 from '../assets/buzia.png'

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

  if (loading)
    return (
      <>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center h-50 gap-4">
            <img
              className="rounded-full animate-spin h-20 w-20"
              src={image}
              alt="Loading"
            />
            <h1 className="font-bold">Loading...</h1>
          </div>
        </div>
      </>
    )

  if (!eventData)
    return (
      <>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center h-50 gap-4">
            <a
              href="https://meetler.web.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="h-20 w-20" src={image2} alt="Loading" />
            </a>
            <h1 className="font-bold">Event not found</h1>
          </div>
        </div>
      </>
    )
  return (
    <>
      <EventView eventData={eventData} eventId={eventId} />
    </>
  )
}
