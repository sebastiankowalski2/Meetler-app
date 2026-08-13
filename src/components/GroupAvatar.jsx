export default function GroupAvatar({ name, photoDataUrl, size = 'w-10 h-10' }) {
  if (photoDataUrl) {
    return (
      <img
        src={photoDataUrl}
        alt=""
        className={`${size} rounded-full object-cover border border-white/70 shadow shrink-0`}
      />
    )
  }

  const initial = (name || '?').trim().slice(0, 1).toUpperCase()

  return (
    <span
      className={`${size} rounded-full bg-primary text-white flex items-center justify-center font-extrabold shadow shrink-0`}
    >
      {initial}
    </span>
  )
}
