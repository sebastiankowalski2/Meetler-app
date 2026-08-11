import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { toast } from 'react-hot-toast'
import { AuthContext } from './authContextObject'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      toast.success('Signed in with Google!')
    } catch (error) {
      console.error('Google sign-in failed:', error)
      toast.error('Could not sign in with Google.')
    }
  }

  const signOutUser = async () => {
    try {
      await firebaseSignOut(auth)
      toast.success('Signed out.')
    } catch (error) {
      console.error('Sign-out failed:', error)
      toast.error('Could not sign out.')
    }
  }

  // Presentational only: changes what name is *shown* for the user. It never
  // touches uid, never changes which account is signed in, and can never be
  // used to take over someone else's identity - it only edits the profile
  // of whoever is currently authenticated.
  const updateDisplayName = async (newDisplayName) => {
    if (!auth.currentUser) return
    const trimmed = newDisplayName.trim()
    if (!trimmed) return

    try {
      await updateProfile(auth.currentUser, { displayName: trimmed })
      // updateProfile doesn't trigger onAuthStateChanged, so refresh our
      // local copy of the user manually.
      setUser({ ...auth.currentUser, displayName: trimmed })
      toast.success('Display name updated.')
    } catch (error) {
      console.error('Failed to update display name:', error)
      toast.error('Could not update display name.')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        signInWithGoogle,
        signOutUser,
        updateDisplayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
