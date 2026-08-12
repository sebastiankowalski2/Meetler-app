import { useState } from 'react'
import { createPortal } from 'react-dom'

export default function CreateGroupDialog({ open, onCreate, onCancel, busy }) {
  const [name, setName] = useState('')

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onCreate(trimmed)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15, 15, 25, 0.55)' }}
      onClick={onCancel}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-black/5"
      >
        <h3 className="font-display text-lg font-extrabold text-slate-900">
          New group
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Give your group a name. You can invite people once it's created.
        </p>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ekipa z pracy"
          maxLength={50}
          className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors duration-150 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || busy}
            className="rounded-xl px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-hover transition-colors duration-150 cursor-pointer disabled:opacity-50"
          >
            Create group
          </button>
        </div>
      </form>
    </div>,
    document.body,
  )
}
