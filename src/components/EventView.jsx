import NicknameForm from '../components/NicknameForm'
import AvailabilityGrid from '../components/AvailabilityGrid'
import { useState } from 'react'

export default function EventView() {
  const [nickname, setNickname] = useState('')
  return (
    <div>
      <h1>Event View</h1>
      <h3>Username: {nickname}</h3>
      {nickname === '' ? (
        <NicknameForm setNickname={setNickname} />
      ) : (
        <AvailabilityGrid nickname={nickname} />
      )}
    </div>
  )
}
