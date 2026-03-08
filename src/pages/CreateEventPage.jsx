import EventForm from '../components/EventForm'
import HowItWorks from '../components/HowItWorks'
import WebImage from '../assets/web.png'

export default function CreateEventPage() {

  return (
    <div className='items-center align-middle justify-center flex flex-col mb-4 gap-10'>
      <div className="relative w-50">
        <img
          className={`transition-all duration-200 absolute -left-3.5 w-20 h-auto shadow-2xl shadow-black rounded-full top-5 cursor-pointer hover:scale-95`}
          src={WebImage}
          alt="Web Image"
        />
        <h1 className="text-blue-500 text-5xl pt-7 font-extrabold "><span className='text-6xl'>M</span>eetler</h1>
      </div>
      
      <HowItWorks EventPage={true} />
      <h1 className="text-3xl pt-10 font-extrabold ">Create Your Event</h1>
      <EventForm />
    </div>
  )
}
