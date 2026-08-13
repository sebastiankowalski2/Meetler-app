import { useEffect, useState, useMemo, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/useAuth'
import AppHeader from '../components/AppHeader'
import UserMenu from '../components/UserMenu'
import LoginRequired from '../components/LoginRequired'
import ConfirmDialog from '../components/ConfirmDialog'
import Modal from '../components/Modal'
import EventListCard from '../components/EventListCard'
import EventForm from '../components/EventForm'
import GroupAvatar from '../components/GroupAvatar'
import { toast } from 'react-hot-toast'
import { isEventEnded } from '../utils/eventStatus'
import { resizeImageToDataUrl } from '../utils/imageResize'

export default function GroupPage() {
  const { groupId } = useParams()
  const { user, authLoading } = useAuth()
  const navigate = useNavigate()
  const photoInputRef = useRef(null)

  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [pendingRemoveMember, setPendingRemoveMember] = useState(null)
  const [pendingLeaveGroup, setPendingLeaveGroup] = useState(false)
  const [pendingDeleteGroup, setPendingDeleteGroup] = useState(false)
  const [busy, setBusy] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const [savingName, setSavingName] = useState(false)

  const isOwner = !!user && group?.ownerUid === user.uid

  useEffect(() => {
    if (authLoading || !user) return

    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const groupSnap = await getDoc(doc(db, 'groups', groupId))
        if (!groupSnap.exists()) {
          if (!cancelled) {
            toast.error('This group no longer exists.')
            navigate('/my-events')
          }
          return
        }

        const membersSnap = await getDocs(
          collection(db, 'groups', groupId, 'members'),
        )
        const memberList = membersSnap.docs.map((d) => d.data())

        const amMember = memberList.some((m) => m.uid === user.uid)
        if (!amMember) {
          if (!cancelled) navigate(`/group/${groupId}/join`)
          return
        }

        const eventsSnap = await getDocs(
          query(collection(db, 'events'), where('groupId', '==', groupId)),
        )

        if (!cancelled) {
          setGroup(groupSnap.data())
          setMembers(memberList)
          setEvents(eventsSnap.docs.map((d) => ({ id: d.id, data: d.data() })))
        }
      } catch (error) {
        console.error('Failed to load group:', error)
        if (!cancelled) toast.error('Could not load this group.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [groupId, user, authLoading, navigate])

  const sortedEvents = useMemo(() => {
    const withStatus = events.map((e) => ({
      ...e,
      ended: isEventEnded(e.data),
    }))
    const byEndDateAsc = (a, b) =>
      (a.data.dateEnd || '').localeCompare(b.data.dateEnd || '')
    const upcoming = withStatus.filter((e) => !e.ended).sort(byEndDateAsc)
    const ended = withStatus
      .filter((e) => e.ended)
      .sort((a, b) => byEndDateAsc(b, a))
    return [...upcoming, ...ended]
  }, [events])

  const copyInviteLink = () => {
    const link = `${window.location.origin}/group/${groupId}/join`
    navigator.clipboard.writeText(link)
    toast.success('Invite link copied to clipboard!')
  }

  const removeMember = async () => {
    if (!pendingRemoveMember) return
    setBusy(true)
    try {
      await deleteDoc(
        doc(db, 'groups', groupId, 'members', pendingRemoveMember.uid),
      )
      setMembers((prev) =>
        prev.filter((m) => m.uid !== pendingRemoveMember.uid),
      )
      toast.success(
        `Removed ${pendingRemoveMember.displayName} from the group.`,
      )
    } catch (error) {
      console.error('Failed to remove member:', error)
      toast.error('Could not remove this member.')
    } finally {
      setBusy(false)
      setPendingRemoveMember(null)
    }
  }

  const leaveGroup = async () => {
    if (!user) return
    setBusy(true)
    try {
      await deleteDoc(doc(db, 'groups', groupId, 'members', user.uid))
      toast.success('You left the group.')
      navigate('/my-events')
    } catch (error) {
      console.error('Failed to leave group:', error)
      toast.error('Could not leave this group.')
    } finally {
      setBusy(false)
      setPendingLeaveGroup(false)
    }
  }

  const deleteGroup = async () => {
    setBusy(true)
    try {
      const membersSnap = await getDocs(
        collection(db, 'groups', groupId, 'members'),
      )
      await Promise.all(membersSnap.docs.map((m) => deleteDoc(m.ref)))
      await deleteDoc(doc(db, 'groups', groupId))
      // Events created in this group are intentionally left untouched -
      // they still belong to whoever created them.
      toast.success('Group deleted. Its events were kept.')
      navigate('/my-events')
    } catch (error) {
      console.error('Failed to delete group:', error)
      toast.error('Could not delete this group.')
    } finally {
      setBusy(false)
      setPendingDeleteGroup(false)
    }
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file || !isOwner) return

    setUploadingPhoto(true)
    try {
      const photoDataUrl = await resizeImageToDataUrl(file)
      await updateDoc(doc(db, 'groups', groupId), { photoDataUrl })
      setGroup((prev) => ({ ...prev, photoDataUrl }))
      toast.success('Group photo updated!')
    } catch (error) {
      console.error('Failed to update group photo:', error)
      toast.error(error.message || 'Could not update the group photo.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const startEditingName = () => {
    setNameDraft(group?.name || '')
    setEditingName(true)
  }

  const saveName = async (e) => {
    e.preventDefault()
    const trimmed = nameDraft.trim()
    if (!trimmed || trimmed === group?.name) {
      setEditingName(false)
      return
    }

    setSavingName(true)
    try {
      await updateDoc(doc(db, 'groups', groupId), { name: trimmed })
      setGroup((prev) => ({ ...prev, name: trimmed }))
      toast.success('Group renamed.')
      setEditingName(false)
    } catch (error) {
      console.error('Failed to rename group:', error)
      toast.error('Could not rename the group.')
    } finally {
      setSavingName(false)
    }
  }

  if (!authLoading && !user) {
    return (
      <div className="min-h-full flex flex-col">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center p-6">
          <LoginRequired message="Zaloguj się przez Google, aby zobaczyć tę grupę." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full flex flex-col">
      <AppHeader right={<UserMenu avatarOnly />} />

      <div className="flex flex-col items-center gap-6 pt-8 pb-16 px-4">
        {(authLoading || loading) && (
          <p className="font-bold">Loading group…</p>
        )}

        {!loading && group && (
          <>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="relative">
                <GroupAvatar
                  name={group.name}
                  photoDataUrl={group.photoDataUrl}
                  size="w-20 h-20 text-2xl"
                />
                {isOwner && (
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    title="Change group photo"
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm shadow-md hover:bg-primary-hover transition-colors duration-150 cursor-pointer disabled:opacity-60"
                  >
                    {uploadingPhoto ? '…' : '📷'}
                  </button>
                )}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              {editingName ? (
                <form
                  onSubmit={saveName}
                  className="flex items-center gap-2 mt-1"
                >
                  <input
                    autoFocus
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    maxLength={50}
                    className="rounded-xl border border-slate-300 px-3 py-1.5 text-lg font-extrabold text-primary text-center focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={savingName}
                    className="text-sm font-bold text-primary hover:underline cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingName(false)}
                    className="text-sm font-bold opacity-60 hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <h1 className="font-display text-primary text-3xl sm:text-4xl font-extrabold flex items-center gap-2">
                  {group.name}
                  {isOwner && (
                    <button
                      onClick={startEditingName}
                      title="Rename group"
                      className="text-lg opacity-60 hover:opacity-100 cursor-pointer"
                    >
                      ✏️
                    </button>
                  )}
                </h1>
              )}

              <p className="text-sm opacity-70">
                {members.length} {members.length === 1 ? 'member' : 'members'}
                {isOwner && ' · 👑 you own this group'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={copyInviteLink}
                className="rounded-xl bg-primary text-white text-sm font-bold px-4 py-2 hover:bg-primary-hover transition-colors duration-150 cursor-pointer"
              >
                🔗 Copy invite link
              </button>
              {isOwner ? (
                <button
                  disabled={busy}
                  onClick={() => setPendingDeleteGroup(true)}
                  className="rounded-xl bg-white text-rose-600 border-2 border-rose-200 text-sm font-bold px-4 py-2 hover:bg-rose-50 transition-colors duration-150 cursor-pointer disabled:opacity-50"
                >
                  🗑️ Delete group
                </button>
              ) : (
                <button
                  disabled={busy}
                  onClick={() => setPendingLeaveGroup(true)}
                  className="rounded-xl bg-white text-rose-600 border-2 border-rose-200 text-sm font-bold px-4 py-2 hover:bg-rose-50 transition-colors duration-150 cursor-pointer disabled:opacity-50"
                >
                  Leave group
                </button>
              )}
            </div>

            <div
              style={{
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.35)',
              }}
              className="w-full max-w-xl rounded-2xl shadow-md p-4"
            >
              <h2 className="font-display font-extrabold text-primary mb-2">
                Members
              </h2>
              <ul className="flex flex-col gap-1">
                {members.map((member) => (
                  <li
                    key={member.uid}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm font-bold text-slate-800 hover:bg-white/50"
                  >
                    <span className="truncate">
                      {member.uid === group.ownerUid && '👑 '}
                      {member.displayName}
                    </span>
                    {isOwner && member.uid !== user.uid && (
                      <button
                        disabled={busy}
                        onClick={() => setPendingRemoveMember(member)}
                        title="Remove from group"
                        className="text-slate-400 hover:text-rose-600 cursor-pointer leading-none shrink-0 disabled:opacity-40"
                      >
                        ✕
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full max-w-xl flex items-center justify-between">
              <h2 className="font-display font-extrabold text-primary text-lg">
                Events in this group
              </h2>
              <button
                onClick={() => setShowCreateEvent(true)}
                className="rounded-xl bg-primary text-white text-sm font-bold px-3 py-1.5 hover:bg-primary-hover transition-colors duration-150 cursor-pointer"
              >
                + New event
              </button>
            </div>

            {sortedEvents.length === 0 && (
              <p className="font-bold text-center max-w-sm opacity-80">
                No events in this group yet.
              </p>
            )}

            {sortedEvents.length > 0 && (
              <div className="flex flex-col gap-3 w-full max-w-xl">
                {sortedEvents.map(({ id, data, ended }) => (
                  <EventListCard key={id} id={id} data={data} ended={ended} />
                ))}
              </div>
            )}

            <Link
              to="/my-events"
              className="text-primary font-bold hover:underline text-sm mt-2"
            >
              ← Back to My Events
            </Link>
          </>
        )}
      </div>

      <Modal
        open={showCreateEvent}
        title="New event"
        onClose={() => setShowCreateEvent(false)}
      >
        <EventForm groupId={groupId} />
      </Modal>

      <ConfirmDialog
        open={!!pendingRemoveMember}
        title="Remove member?"
        message={`${pendingRemoveMember?.displayName || 'This member'} will be removed from "${group?.name}".`}
        confirmLabel="Remove"
        onConfirm={removeMember}
        onCancel={() => setPendingRemoveMember(null)}
      />

      <ConfirmDialog
        open={pendingLeaveGroup}
        title="Leave this group?"
        message={`You'll stop seeing "${group?.name}" and its events in My Events. Events you created will stay untouched.`}
        confirmLabel="Leave group"
        onConfirm={leaveGroup}
        onCancel={() => setPendingLeaveGroup(false)}
      />

      <ConfirmDialog
        open={pendingDeleteGroup}
        title="Delete this group?"
        message={`"${group?.name}" will be permanently deleted for everyone. Events created in it are kept and stay accessible via their links.`}
        confirmLabel="Delete group"
        onConfirm={deleteGroup}
        onCancel={() => setPendingDeleteGroup(false)}
      />
    </div>
  )
}
