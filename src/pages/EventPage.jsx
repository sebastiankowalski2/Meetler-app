import { useParams } from 'react-router-dom'
export default function EventPage() {
  const { eventId } = useParams()
  return (
    <div>
      <h1>Event Page</h1>
      <h2>Event ID: {eventId}</h2>
    </div>
  )
}
