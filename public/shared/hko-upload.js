// hko-upload.js — Datei-Upload an Vercel vorbei, direkt zu Supabase Storage.
//
// Vercel-Serverless nimmt höchstens 4.5 MB pro Anfrage an. Der frühere multipart-
// POST an /api/…/files scheiterte darum bei jeder grösseren Datei mit einem
// nackten «Upload fehlgeschlagen.» (Meldung Martina Ruoss, ZIP zu 1.2).
//
//   window.hkoDateienHochladen(endpoint, files) → Promise<FileMeta[]>
//
// endpoint = '/api/einheit-feedbacks/<id>/files' (oder feedbacks / material-feedbacks).
// Liefert die vollständige Dateiliste des Eintrags; wirft Error mit einer Meldung,
// die so angezeigt werden kann. Server: src/lib/feedback-uploads.ts.
;(function () {
  const MAX_BYTES = 15 * 1024 * 1024

  async function fehler(res, fallback) {
    const body = await res.json().catch(() => ({}))
    return new Error(body.error || `${fallback} (Code ${res.status}).`)
  }

  window.hkoDateienHochladen = async function (endpoint, fileList) {
    const files = Array.from(fileList || []).filter((f) => f && f.size > 0)
    if (files.length === 0) return null
    const zuGross = files.find((f) => f.size > MAX_BYTES)
    if (zuGross) throw new Error(`«${zuGross.name}» ist grösser als 15 MB.`)

    // 1) signierte Upload-URLs holen
    const sign = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: files.map((f) => ({ name: f.name, size: f.size })) }),
    })
    if (!sign.ok) throw await fehler(sign, 'Upload-Vorbereitung fehlgeschlagen')
    const slots = (await sign.json())?.data ?? []
    if (slots.length !== files.length) throw new Error('Upload-Vorbereitung unvollständig. Bitte erneut versuchen.')

    // 2) Bytes direkt zu Supabase Storage
    const hochgeladen = []
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData()
      fd.append('cacheControl', '3600')
      fd.append('', files[i])
      const up = await fetch(slots[i].signedUrl, { method: 'PUT', headers: { 'x-upsert': 'false' }, body: fd })
      if (!up.ok) throw new Error(`Upload von «${files[i].name}» fehlgeschlagen (Speicher-Code ${up.status}).`)
      hochgeladen.push({ name: files[i].name, path: slots[i].path, type: files[i].type })
    }

    // 3) beim Eintrag registrieren
    const reg = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: hochgeladen }),
    })
    if (!reg.ok) throw await fehler(reg, 'Dateien konnten nicht gespeichert werden')
    return (await reg.json())?.data ?? []
  }
})()
