//import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import CreateEventPage from './pages/CreateEventPage'
import EventPage from './pages/EventPage'
import MyEventsPage from './pages/MyEventsPage'
import GroupPage from './pages/GroupPage'
import JoinGroupPage from './pages/JoinGroupPage'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'meetler-toast',
        }}
      />
      <Routes>
        <Route path="/" element={<CreateEventPage />} />
        <Route path="/event/:eventId" element={<EventPage />} />
        <Route path="/my-events" element={<MyEventsPage />} />
        <Route path="/group/:groupId" element={<GroupPage />} />
        <Route path="/group/:groupId/join" element={<JoinGroupPage />} />
      </Routes>
    </>
  )
}

export default App
