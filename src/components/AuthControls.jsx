import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Small, reusable block of UI for Google sign-in / sign-out + a link to
// "My events". Doesn't render its own positioning wrapper so it can be
// dropped into different layouts (dropdown panel, header corner, etc).
//
// `showEditName`: exposes an inline editor for the *display name* only.
// This never changes the account/uid - it's purely presentational, wired
// through AuthContext.updateDisplayName.
export default function AuthControls({ compact = false, showEditName = false }) {
  const { user, authLoading, signInWithGoogle, signOutUser, updateDisplayName } =
    useAuth()
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')

  if (authLoading) {
    return <p className="text-xs opacity-70">Loading account…</p>
  }

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-2 bg-white text-black text-sm font-bold px-3 py-1.5 rounded-lg border-2 border-primary hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
      >
        <GoogleIcon />
        Sign in with Google
      </button>
    )
  }

  const startEditing = () => {
    setNameDraft(user.displayName || '')
    setEditingName(true)
  }

  const saveName = async (e) => {
    e.preventDefault()
    await updateDisplayName(nameDraft)
    setEditingName(false)
  }

  return (
    <div
      className={`flex ${compact ? 'flex-row items-center gap-2' : 'flex-col items-start gap-2'}`}
    >
      <div className="flex items-center gap-2">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName || 'Account'}
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-full border border-white"
          />
        )}
        <span className="text-sm font-bold truncate max-w-32">
          {user.displayName || user.email}
        </span>
      </div>

      {showEditName &&
        (editingName ? (
          <form onSubmit={saveName} className="flex items-center gap-1">
            <input
              autoFocus
              className="bg-white text-black text-sm p-1 rounded w-32"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              maxLength={30}
            />
            <button
              type="submit"
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingName(false)}
              className="text-xs font-bold opacity-70 hover:underline cursor-pointer"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={startEditing}
            className="text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            ✏️ Edit display name
          </button>
        ))}

      <Link
        to="/my-events"
        className="text-sm font-bold text-primary hover:underline"
      >
        📅 My Events
      </Link>
      <button
        onClick={signOutUser}
        className="text-sm font-bold text-red-600 hover:underline cursor-pointer"
      >
        Sign out
      </button>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20.4H24v7.2h11.3C33.6 32 29.2 34.9 24 34.9c-6.1 0-11.1-5-11.1-11.1S17.9 12.7 24 12.7c2.8 0 5.4 1.1 7.3 2.8l5.1-5.1C33.1 7.3 28.8 5.5 24 5.5 13.8 5.5 5.5 13.8 5.5 24S13.8 42.5 24 42.5 42.5 34.2 42.5 24c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.9 14.6l5.9 4.3C14.4 15.2 18.9 12.7 24 12.7c2.8 0 5.4 1.1 7.3 2.8l5.1-5.1C33.1 7.3 28.8 5.5 24 5.5c-7.4 0-13.7 4.2-16.9 10.4z"
      />
      <path
        fill="#4CAF50"
        d="M24 42.5c4.7 0 9-1.8 12.2-4.8l-5.6-4.7C28.8 34.6 26.5 35.4 24 35.4c-5.2 0-9.6-3.4-11.2-8.1l-5.9 4.5C10.2 38.3 16.6 42.5 24 42.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20.4H24v7.2h11.3c-.9 2.5-2.5 4.6-4.7 6l5.6 4.7c-.4.4 6.3-4.6 6.3-14.4 0-1.2-.1-2.4-.4-3.9z"
      />
    </svg>
  )
}
