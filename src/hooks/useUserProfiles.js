import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

// Looks up the CURRENT display name/photo for a list of uids from the
// public users/{uid} profile docs. Callers should fall back to whatever
// snapshotted name they already have (e.g. participant.displayName) for
// any uid not present in the returned map - that covers profiles that
// haven't synced yet, or lookups that fail.
export function useUserProfiles(uids = []) {
  const key = uids.filter(Boolean).sort().join(',')
  const [profiles, setProfiles] = useState({})

  useEffect(() => {
    const validUids = key ? key.split(',') : []
    let cancelled = false

    Promise.all(
      validUids.map(async (uid) => {
        try {
          const snap = await getDoc(doc(db, 'users', uid))
          return snap.exists() ? [uid, snap.data()] : null
        } catch {
          return null
        }
      }),
    ).then((results) => {
      if (cancelled) return
      const map = {}
      results.forEach((entry) => {
        if (entry) map[entry[0]] = entry[1]
      })
      setProfiles(map)
    })

    return () => {
      cancelled = true
    }
  }, [key])

  return profiles
}
