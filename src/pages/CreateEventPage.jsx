import EventForm from '../components/EventForm'
import HowItWorks from '../components/HowItWorks'
import AuthControls from '../components/AuthControls'
import AppHeader from '../components/AppHeader'
import { useState } from 'react'

export default function CreateEventPage() {
  const [mClicked, setMClicked] = useState(false)

  function handleMClick(e) {
    e.preventDefault() // logo stays a spin toy on the home page itself
    setMClicked(!mClicked)
  }

  return (
    <div className="items-center align-middle justify-center flex flex-col gap-4 eventFormStyle">
      <AppHeader
        onLogoClick={handleMClick}
        spin={mClicked}
        right={<AuthControls compact />}
      />

      <h1 className="text-primary font-display text-2xl sm:text-3xl font-extrabold text-center px-4 mt-4">
        Find a time that works for everyone.
      </h1>

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
