import EventForm from '../components/EventForm'
import HowItWorks from '../components/HowItWorks'
import WebImage from '../assets/web.png'
import { useState } from 'react'

export default function CreateEventPage() {
  const [mClicked, setMClicked] = useState(false)

  function handleMClick() {
    setMClicked(!mClicked)
  }

  return (
    <div className="items-center align-middle justify-center flex flex-col gap-10 eventFormStyle">
      <div className="relative w-50">
        <img
          onClick={handleMClick}
          className={`active:scale-95 absolute -left-3.5 w-20 h-auto shadow-2xl shadow-gray-600 rounded-full top-5 cursor-pointer`}
          src={WebImage}
          alt="Web Image"
        />
        <h1 className="text-primary text-5xl pt-7 font-extrabold ">
          <span className="text-6xl">M</span>eetler
        </h1>
      </div>

      <HowItWorks EventPage={true} />
      <div
        style={{
          position: 'relative',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          zIndex: 1,
        }}
        className="flex flex-col items-center align-middle justify-center shadow-lg shadow-white/50 px-1.5 sm:px-20 rounded-3xl gap-4 mt-2 pb-2 mb-10"
      >
        <h1
          className={`perspective-[1000px] text-3xl pt-4 font-extrabold mb-0 transition-all duration-1000`}
        >
          Create{' '}
          <span
            className={`inline-block ${
              mClicked
                ? 'transform-3d -translate-z-1000px -translate-y-200px animate-spin text-red-600'
                : ''
            } transition-all duration-8000`}
          >
            Your
          </span>{' '}
          Event
        </h1>
        <EventForm mClicked={mClicked} />
      </div>
    </div>
  )
}
