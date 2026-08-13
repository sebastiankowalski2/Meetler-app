import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/useAuth'
import AppHeader from '../components/AppHeader'
import UserMenu from '../components/UserMenu'
import LoginRequired from '../components/LoginRequired'
import GroupAvatar from '../components/GroupAvatar'
import { toast } from 'react-hot-toast'

export default function JoinGroupPage() {
  const { groupId } = useParams()
  const { user, authLoading } = useAuth()
  const navigate = useNavigate()

  const [group, setGroup] = useState(null)
  const [memberCount, setMemberCount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (authLoading || !user) return

    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const groupSnap = await getDoc(doc(db, 'groups', groupId))
        if (!groupSnap.exists()) {
          if (!cancelled) setNotFound(true)
          return
        }

        const membersSnap = await getDocs(
          collection(db, 'groups', groupId, 'members'),
        )

        const alreadyMember = membersSnap.docs.some(
          (d) => d.data().uid === user.uid,
        )

        if (alreadyMember) {
          if (!cancelled) navigate(`/group/${groupId}`)
          return
        }

        if (!cancelled) {
          setGroup(groupSnap.data())
          setMemberCount(membersSnap.size)
        }
      } catch (error) {
        console.error('Failed to load group invite:', error)
        if (!cancelled) toast.error('Could not load this invite.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [groupId, user, authLoading, navigate])

  const joinGroup = async () => {
    if (!user) return
    setJoining(true)
    try {
      await setDoc(doc(db, 'groups', groupId, 'members', user.uid), {
        uid: user.uid,
        displayName: user.displayName || user.email || 'Anonymous',
        joinedAt: serverTimestamp(),
      })
      toast.success(`You joined ${group?.name}!`)
      navigate(`/group/${groupId}`)
    } catch (error) {
      console.error('Failed to join group:', error)
      toast.error('Could not join this group.')
      setJoining(false)
    }
  }

  return (
    <div className="min-h-full flex flex-col">
      <AppHeader right={user ? <UserMenu /> : null} />

      <div className="flex-1 flex items-center justify-center p-6">
        {!authLoading && !user && (
          <LoginRequired message="Zaloguj się przez Google, aby zobaczyć i dołączyć do tej grupy." />
        )}

        {user && loading && <p className="font-bold">Loading invite…</p>}

        {user && !loading && notFound && (
          <p className="font-bold text-center">
            This invite link is no longer valid.
          </p>
        )}

        {user && !loading && group && (
          <div
            style={{
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
            }}
            className="flex flex-col items-center gap-4 p-6 rounded-2xl shadow-lg text-center max-w-sm"
          >
            <GroupAvatar
              name={group.name}
              photoDataUrl={group.photoDataUrl}
              size="w-16 h-16 text-xl"
            />
            <p className="font-display text-xl font-extrabold text-primary">
              Join "{group.name}"?
            </p>
            <p className="text-sm opacity-80">
              {memberCount} {memberCount === 1 ? 'person is' : 'people are'}{' '}
              already in this group. You'll be able to see and create events
              together.
            </p>
            <button
              disabled={joining}
              onClick={joinGroup}
              className="rounded-xl bg-primary text-white text-sm font-bold px-5 py-2.5 hover:bg-primary-hover transition-colors duration-150 cursor-pointer disabled:opacity-60"
            >
              {joining ? 'Joining…' : 'Join group'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
