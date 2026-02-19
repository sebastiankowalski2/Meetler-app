//import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import CreateEventPage from './pages/CreateEventPage'
import EventPage from './pages/EventPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CreateEventPage />} />
        <Route path="/event/:eventId" element={<EventPage />} />
      </Routes>
    </>
  )
}

export default App
