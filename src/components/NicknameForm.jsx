import React, { useState } from 'react'

export default function NicknameForm({ setNickname, eventId }) {
  const [inputValue, setInputValue] = useState('')

  const handleChange = (e) => {
    const { value } = e.target
    setInputValue(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setNickname(inputValue)
    localStorage.setItem(`nickname-${eventId}`, inputValue)
    setInputValue('')
  }
  // Set the nickname to "Guest" when the guest button is clicked - if user is a Guest, they can only see the availability grid but they cant edit it.
  const handleGuestSubmit = (e) => {
    e.preventDefault()
    setNickname('Guest')
  }

  const handleBackdropClick = () => {
    setNickname('Guest')
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Blur overlay background */}
        <div
          onClick={handleBackdropClick}
          className="absolute inset-0  backdrop-blur-xs z-40"
        ></div>

        <div
          style={{
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
          }}
          className="form-group w-90 items-center border-10 border-primary bg-transparent flex flex-col p-2 pt-4 rounded-3xl gap-2 bos-shadow-lg shadow-blue-950 shadow-2xl relative z-50"
        >
          <form onSubmit={handleSubmit}>
            <div className="">
              <label className="text-2xl font-semibold" htmlFor="nickname">
                Nickname:{' '}
              </label>
              <br></br>
              <input
                className="bg-white mt-5 text-slate-900 p-2 rounded-lg w-60 mb-4 active:outline-primary focus:outline-primary transition-colors duration-250"
                type="text"
                placeholder="Enter your nickname"
                id="nickname"
                name="nickname"
                value={inputValue}
                onChange={handleChange}
                maxLength={20}
                required
              />
            </div>
            <button
              className="bg-primary text-lg mt-2 mr-2 mb-3 text-white cursor-pointer rounded-2xl p-2 hover:bg-primary-hover transition-all duration-250 hover:shadow-sm hover:shadow-primary-hover w-32"
              type="submit"
            >
              Set Nickname
            </button>
            <button
              className="bg-green-500 text-lg mt-2 ml-1 text-white cursor-pointer rounded-2xl p-2 hover:bg-green-600 transition-all duration-250 hover:shadow-sm hover:shadow-green-950 w-32"
              type="submit"
              onClick={handleGuestSubmit}
            >
              Guest
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
