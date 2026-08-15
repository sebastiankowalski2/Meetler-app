import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { getLocalDateString } from './eventStatus'

// Creates a brand-new, independent event pre-filled with another event's
// name/location. Dates default to "starting today, one week long" (same
// default as a fresh event) rather than copying the old dates, since a
// duplicated event is almost always for a *future* occurrence. Deliberately
// starts with zero participants - people should re-confirm availability for
// the new date, not inherit stale answers from the original.
export async function duplicateEvent({ sourceEvent, user, groupId = null }) {
  const today = getLocalDateString()
  const endDateObj = new Date()
  endDateObj.setDate(endDateObj.getDate() + 7)
  const end = getLocalDateString(endDateObj)

  const docRef = await addDoc(collection(db, 'events'), {
    eventName: sourceEvent.eventName,
    eventLocation: sourceEvent.eventLocation || '',
    dateStart: today,
    dateEnd: end,
    createdBy: user ? user.uid : null,
    createdByName: user ? user.displayName || user.email : null,
    groupId: groupId ?? sourceEvent.groupId ?? null,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}
