import EventForm from '../components/EventForm'
import HowItWorks from '../components/HowItWorks'
export default function CreateEventPage() {
  return (
    <div>
      <h1 className="text-3xl pt-10 font-extrabold mb-10">Create Your Event</h1>

      <EventForm />
      <HowItWorks />
    </div>
  )
}
