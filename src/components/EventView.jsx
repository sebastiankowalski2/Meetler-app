import NicknameForm from '../components/NicknameForm'
import AvailabilityGrid from '../components/AvailabilityGrid'
import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { toast } from 'react-hot-toast'

export default function EventView({ eventData, eventId }) {
  const [nickname, setNickname] = useState('')
  const [selectedDates, setSelectedDates] = useState({})

  const isGuest = nickname === 'Guest'

  useEffect(() => {
    const preloadAvailability = async () => {
      if (!nickname) return

      try {
        const participantRef = doc(
          db,
          'events',
          eventId,
          'participants',
          nickname.toLowerCase().trim(),
        )

        const snapshot = await getDoc(participantRef)

        if (snapshot.exists()) {
          const data = snapshot.data()
          setSelectedDates(data.availability || {})
          toast.success('Loaded previous availability')
        } else {
          setSelectedDates({})
        }
      } catch (error) {
        toast.error('Failed to load availability.')
        console.error(error)
      }
    }

    preloadAvailability()
  }, [nickname, eventId])

  return (
    <div>
      <h1>Event View</h1>
      <h3>Username: {nickname}</h3>
      <div className="justify-center flex align-middle items-center">
        <span className="text-2xl pr-1">🏷️</span>
        <h2 className="text-2xl mb-2 mt-2 pr-2 pl-2 text-blue-500 text-shadow-lg inset-shadow-sm shadow-sm font-bold">
          {eventData.eventName.toUpperCase()}
        </h2>
        <span className="text-2xl pl-1">🏷️</span>
      </div>

      {/* Only show the location if it exists in the event data - if the user didnt fill it out, we dont want to show an empty location field*/}
      {eventData.eventLocation && (
        <div className="justify-center flex align-middle items-center">
          <span className="text-2xl pb-2 pr-1">📍</span>
          <h2 className="text-2xl mb-4 mt-2 pr-2 pl-2 text-yellow-300 text-shadow-lg inset-shadow-sm shadow-sm font-bold">
            {eventData.eventLocation.toUpperCase()}
          </h2>
          <span className="text-2xl pb-2 pl-1">📍</span>
        </div>
      )}
      {nickname === '' ? (
        <NicknameForm setNickname={setNickname} />
      ) : (
        <AvailabilityGrid
          isGuest={isGuest}
          eventData={eventData}
          eventId={eventId}
          nickname={nickname}
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
        />
      )}
    </div>
  )
}
