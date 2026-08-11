//import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import CreateEventPage from './pages/CreateEventPage'
import EventPage from './pages/EventPage'
import MyEventsPage from './pages/MyEventsPage'
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
      </Routes>
    </>
  )
}

export default App
