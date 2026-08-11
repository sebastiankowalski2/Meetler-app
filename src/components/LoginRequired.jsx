import AuthControls from './AuthControls'

// Shown in place of (or alongside) any protected action when there's no
// signed-in user. There is no separate "session" concept here - this is
// purely a UI reflection of the single source of truth: Firebase Auth.
export default function LoginRequired({ message }) {
  return (
    <div
      style={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
      }}
      className="flex flex-col items-center gap-3 p-4 rounded-xl shadow-md text-center"
    >
      <p className="font-bold">
        {message || 'To use this feature, sign in with Google.'}
      </p>
      <AuthControls />
    </div>
  )
}
