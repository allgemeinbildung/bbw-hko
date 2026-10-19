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

  // ── Sammelnde Dateiauswahl ─────────────────────────────────────────────
  // Ein <input type="file" data-sammeln> ersetzt bei jeder neuen Auswahl die
  // vorige — so verschwand bei Jens Sturm die erste Datei, wenn er eine zweite
  // wählte. Hier kommt jede Auswahl dazu; darunter steht die Liste der noch nicht
  // gespeicherten Dateien, jede mit «Entfernen». input.files bleibt die Quelle,
  // die Formulare lesen sie wie bisher.
  //
  //   window.hkoAuswahlLeeren(input) — nach erfolgreichem Upload statt input.value = ''

  const schluessel = (f) => `${f.name}|${f.size}|${f.lastModified}`

  function setzen(input, liste) {
    const dt = new DataTransfer()
    liste.forEach((f) => dt.items.add(f))
    input.files = dt.files
    input._hkoAuswahl = liste
    zeichnen(input)
  }

  function groesse(bytes) {
    return bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(bytes / 1024)) + ' KB'
  }

  function zeichnen(input) {
    let ul = input._hkoListe
    if (!ul) {
      ul = document.createElement('ul')
      ul.className = 'space-y-1 mt-2'
      input.insertAdjacentElement('afterend', ul)
      input._hkoListe = ul
    }
    ul.innerHTML = ''
    const liste = input._hkoAuswahl || []
    liste.forEach((f, i) => {
      const li = document.createElement('li')
      li.className = 'flex items-center justify-between text-sm bg-slate-50 border border-slate-200 rounded px-3 py-1.5'
      const name = document.createElement('span')
      name.className = 'truncate text-slate-700'
      name.textContent = `${f.name} · ${groesse(f.size)} · noch nicht gespeichert`
      const weg = document.createElement('button')
      weg.type = 'button'
      weg.className = 'ml-3 text-red-500 hover:text-red-700 text-xs shrink-0'
      weg.textContent = 'Entfernen'
      weg.addEventListener('click', () => {
        setzen(input, liste.filter((_, j) => j !== i))
        // Formulare, die auf change hören (z. B. Zähler), sollen es merken —
        // ohne dass der Sammel-Handler die Liste erneut zusammenführt.
        input._hkoIntern = true
        input.dispatchEvent(new Event('change', { bubbles: true }))
        input._hkoIntern = false
      })
      li.append(name, weg)
      ul.append(li)
    })
  }

  // Capture auf document: läuft vor den change-Handlern der Formulare (Alpine,
  // addEventListener), die sehen also schon die zusammengeführte Liste.
  document.addEventListener('change', (e) => {
    const input = e.target
    if (!(input instanceof HTMLInputElement) || input.type !== 'file' || !input.hasAttribute('data-sammeln')) return
    if (input._hkoIntern) return
    const vorher = input._hkoAuswahl || []
    const neu = Array.from(input.files || [])
    // Abbrechen im Dateidialog leert in manchen Browsern die Auswahl: dann die alte behalten.
    const bekannt = new Set(vorher.map(schluessel))
    setzen(input, [...vorher, ...neu.filter((f) => !bekannt.has(schluessel(f)))])
  }, true)

  window.hkoAuswahlLeeren = function (input) {
    if (!input) return
    input.value = ''
    input._hkoAuswahl = []
    zeichnen(input)
  }
})()
