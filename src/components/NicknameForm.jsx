import React, { useState } from 'react'

export default function NicknameForm({ setNickname }) {
  const [inputValue, setInputValue] = useState('')

  const handleChange = (e) => {
    const { value } = e.target
    setInputValue(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Nickname submitted:', inputValue)

    setNickname(inputValue)

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

        <div className="form-group w-90 items-center border-10 border-blue-400 bg-blue-200 flex flex-col p-2 pt-4 rounded-3xl gap-2 bos-shadow-lg shadow-blue-950 shadow-2xl relative z-50">
          <form onSubmit={handleSubmit}>
            <div className="">
              <label className="text-2xl font-semibold" htmlFor="nickname">
                Nickname:{' '}
              </label>
              <br></br>
              <input
                className="bg-white mt-5 text-slate-900 p-2 rounded-lg w-60 mb-4 active:outline-blue-500 focus:outline-blue-500 transition-colors duration-250"
                type="text"
                placeholder="Enter your nickname"
                id="nickname"
                name="nickname"
                value={inputValue}
                onChange={handleChange}
                required
              />
            </div>
            <button
              className="bg-blue-500 text-lg mt-2 mr-2 mb-3 text-white cursor-pointer rounded-2xl p-2 hover:bg-blue-600 transition-all duration-250 hover:shadow-sm hover:shadow-blue-950 w-32"
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
