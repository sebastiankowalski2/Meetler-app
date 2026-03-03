//import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import CreateEventPage from './pages/CreateEventPage'
import EventPage from './pages/EventPage'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'meetler-toast',
        }}
      />
      <Routes>
        <Route path="/" element={<CreateEventPage />} />
        <Route path="/event/:eventId" element={<EventPage />} />
      </Routes>
    </>
  )
}

export default App
