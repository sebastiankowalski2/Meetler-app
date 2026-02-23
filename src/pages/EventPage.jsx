import { useParams } from 'react-router-dom'
import EventView from '../components/EventView'

export default function EventPage() {
  const { eventId } = useParams()
  return (
    <>
      <h1>Event Page</h1>
      <h2>Event ID: {eventId}</h2>
      <br></br>
      <EventView />
    </>
  )
}
