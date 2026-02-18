import React, { useState } from 'react'

export default function EventForm() {
  const [formData, setFormData] = useState({
    eventName: '',
    eventLocation: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="eventName">Event Name:</label>
        <input
          type="text"
          id="eventName"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="eventLocation">Location:</label>
        <input
          type="text"
          id="eventLocation"
          name="eventLocation"
          value={formData.eventLocation}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Create Event</button>
    </form>
  )
}
