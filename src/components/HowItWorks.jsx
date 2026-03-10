import React from 'react'

export default function HowItWorks({ EventView, EventPage }) {
  return (
    <>
      <div className="flex items-center justify-center">
        <div
          className={`hover:shadow-secondary border-2 border-white hover:border-secondary flex ${EventPage ? 'mt-12' : ' mt-24'} flex-col items-center justify-center p-4 mx-2 bg-gray-100 rounded-md shadow-2xl transition-all duration-500 shadow-black ${EventView ? ' w-92' : 'w-88 '}`}
        >
          <h1 className="text-2xl font-extrabold mb-4">📌How it works?</h1>
          <ol style={{ listStyleType: 'decimal' }} className="gap-4 text-left">
            {!EventView && (
              <li className="font-bold text-md">Create an event.</li>
            )}

            <li className="font-bold text-md">
              Mark the days when you are available.{' '}
            </li>

            {!EventView && (
              <li className="font-bold text-md">
                Share the event link with others.{' '}
              </li>
            )}
            {!EventView && (
              <li className="font-bold text-md">
                Easily find the best meeting dates.
              </li>
            )}
            {!EventPage && (
              <li className="font-bold text-md">Red - Everyone can go.</li>
            )}
            {!EventPage && (
              <li className="font-bold text-md">
                Orange - Second most popular dates.{' '}
              </li>
            )}
            {!EventPage && (
              <li className="font-bold text-md">
                Change your availability at any time.
              </li>
            )}
          </ol>
        </div>
      </div>
    </>
  )
}
