import React from 'react'

export default function AvailabilityGrid({ nickname, eventData }) {
  return (
    <div>
      <h1>Availability Grid</h1>
      <p>Nickname: {nickname}</p>
      <p>Event Data: {JSON.stringify(eventData)}</p>

      {/* Here you would implement the actual grid based on the eventData */}
    </div>
  )
}
