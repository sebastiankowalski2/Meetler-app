import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const isConfigured = !!(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY)

// Sends the "final date confirmed" email to one recipient. If EmailJS isn't
// configured (no .env keys set), this quietly no-ops instead of breaking
// the date-confirmation flow itself - confirming a date should always work
// even if nobody's ever set up email notifications.
export async function sendFinalDateEmail({
  toEmail,
  toName,
  eventName,
  eventDate,
  eventLink,
}) {
  if (!isConfigured) {
    console.warn(
      'EmailJS is not configured (missing VITE_EMAILJS_* env vars) - skipping confirmation email.',
    )
    return
  }
  if (!toEmail) return

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: toEmail,
        to_name: toName || 'there',
        event_name: eventName,
        event_date: eventDate,
        event_link: eventLink,
      },
      { publicKey: PUBLIC_KEY },
    )
  } catch (error) {
    console.error(`Failed to send confirmation email to ${toEmail}:`, error)
  }
}
