import NicknameForm from '../components/NicknameForm'
import AvailabilityGrid from '../components/AvailabilityGrid'
import { useState } from 'react'

export default function EventView({ eventData }) {
  const [nickname, setNickname] = useState('')
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

      {
        // Only show the location if it exists in the event data - if the user didnt fill it out, we dont want to show an empty location field
      }
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
        <AvailabilityGrid nickname={nickname} eventData={eventData} />
      )}
    </div>
  )
}
