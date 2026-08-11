import { createContext } from 'react'

export const AuthContext = createContext({
  user: null,
  authLoading: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  updateDisplayName: async () => {},
})
