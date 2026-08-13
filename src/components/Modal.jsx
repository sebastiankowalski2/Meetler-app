import { createPortal } from 'react-dom'

export default function Modal({ open, title, onClose, children }) {
  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(15, 15, 25, 0.30)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-black/5 my-8"
      >
        <div className="flex items-center justify-between mb-3">
          {title && (
            <h3 className="font-display text-lg font-extrabold text-slate-900">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-auto text-slate-400 hover:text-red-500 cursor-pointer text-xl leading-none"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
