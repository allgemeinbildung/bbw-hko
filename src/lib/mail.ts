/**
 * Transaktions-Mails über Resend (HTTP-API, kein SDK nötig).
 *
 * Konfiguration (Vercel → Environment Variables, danach neu deployen):
 *   RESEND_API_KEY        API-Key aus resend.com
 *   MAIL_FROM             Absender, z. B. «Materialplattform <noreply@bbw-hko.ch>»
 *                         (Domain muss in Resend verifiziert sein)
 *
 * Fehlt die Konfiguration, wird nichts gesendet und nur geloggt: lokal und in
 * Previews darf eine Aktion nie an einem Mailausfall scheitern. Aus demselben
 * Grund wirft `sendMail` nie und bricht nach 5 s ab.
 */
export interface Mail {
  to: string | string[]
  subject: string
  text: string
  replyTo?: string
}

/** Ist der Versand eingerichtet? Steuert, ob die Oberfläche E-Mails verspricht. */
export function mailAktiv(): boolean {
  return !!(import.meta.env.RESEND_API_KEY && import.meta.env.MAIL_FROM)
}

export async function sendMail(mail: Mail): Promise<boolean> {
  const key = import.meta.env.RESEND_API_KEY
  const from = import.meta.env.MAIL_FROM
  const to = (Array.isArray(mail.to) ? mail.to : [mail.to]).filter((a) => a && a.includes('@'))
  if (!key || !from) {
    console.warn(`[mail] RESEND_API_KEY/MAIL_FROM fehlt — nicht gesendet: ${mail.subject}`)
    return false
  }
  if (to.length === 0) return false

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 5000)
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        subject: mail.subject,
        text: mail.text,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      }),
      signal: ctrl.signal,
    })
    if (!res.ok) {
      console.error(`[mail] Resend ${res.status}: ${await res.text().catch(() => '')}`)
      return false
    }
    return true
  } catch (e) {
    console.error('[mail] Versand fehlgeschlagen:', e)
    return false
  } finally {
    clearTimeout(timer)
  }
}
