/**
 * Fork-Pilot «Meine Fassung» (VERTRAG §7, §9).
 *  POST /api/fassungen/<einheit>/buendel   multipart: heft (A|B|auftrag), kommentare (JSON),
 *                                          optional text oder datei (nur Auftrag «eigener_text»)
 *  → { buendel: BuendelSicht[] }  — bei EBA mit eigenem Text, neuer Situation oder neuem
 *    Handlungsprodukt (Heft A/B) zwei: Heft und Dossier (F15).
 *
 * Ein Modellaufruf pro Bündel. An OpenAI geht kein Personenbezug (Invariante 9):
 * `baueAnfrage` bekommt nur Einheit, Heft, Kommentare und den eigenen Text.
 * Ein Modellfehler ergibt ein Bündel mit Status `fehler` und allgemeiner Meldung (F11).
 */
import type { APIRoute } from 'astro'
import { createAdminClient } from '../../../../lib/supabase'
import { einheitById, loadEinheit } from '../../../../lib/einheiten/index'
import { werkstattKontext } from '../../../../lib/werkstatt/kontext'
import { wendeAn } from '../../../../lib/fork/anwenden'
import { pflichtPfade, DOSSIER_AUFTRAEGE, type AuftragKey } from '../../../../lib/fork/positivliste'
import { baueAnfrage } from '../../../../lib/fork/anfrage'
import { frageModell } from '../../../../lib/fork/openai'
import { pruefeVorschlag } from '../../../../lib/fork/vorschlag'
import { MAX_BYTES, textAusDatei, textAusEingabe } from '../../../../lib/fork/text'
import { HEFT_DATEI, type BuendelHeft, type KommentarEingabe } from '../../../../lib/fork/typen'
import {
  FASSUNG_BUCKET, aufrufeHeute, buendelSicht, fehler, glossarBegriffe, holeOderLegeFassung, json,
  leitfragenAus, maxAufrufeProTag, methodenRefs, pruefeKommentare, zugang, type Admin, type BuendelRow, type RohDateien,
} from '../../../../lib/fork/server'

export const prerender = false

const DOSSIER_KOMMENTAR: Partial<Record<AuftragKey, string>> = {
  eigener_text: 'Neues Dossier in A2 zum eigenen Text',
  situation_umformulieren: 'Dossier an die neue Situation anpassen',
  handlungsprodukt_aendern: 'Dossier an das neue Handlungsprodukt anpassen',
}

interface Lauf {
  heft: BuendelHeft
  kommentare: KommentarEingabe[]
  pflicht: string[]
  glossarBegriffe?: string[]
  glossarIds?: string[]
}

export const POST: APIRoute = async ({ locals, params, request }) => {
  const z = await zugang(locals, params.einheit)
  if (!z.ok) return z.res

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return fehler('Ungültige Anfrage.', 400)
  }
  const heft = String(form.get('heft') ?? '')
  const k = pruefeKommentare(form.get('kommentare'), heft, z.eba)
  if ('fehler' in k) return fehler(k.fehler, 400)
  const kommentare = k.kommentare
  const eigener = kommentare.some((c) => c.auftrag === 'eigener_text')

  // Eigener Text: eingefügt oder als Datei, nie beides (F2).
  const feld = form.get('text')
  const datei = form.get('datei')
  const hatDatei = datei instanceof File && datei.size > 0
  const hatFeld = typeof feld === 'string' && feld.trim() !== ''
  if (hatDatei && hatFeld) return fehler('Bitte entweder Text einfügen oder eine Datei hochladen, nicht beides.', 400)
  let text: string | null = null
  if (hatDatei) {
    if (datei.size > MAX_BYTES) return fehler('Die Datei ist zu gross (höchstens 5 MB).', 400)
    try {
      text = (await textAusDatei(datei.name, new Uint8Array(await datei.arrayBuffer()))).text
    } catch (e) {
      return fehler(e instanceof Error ? e.message : 'Die Datei lässt sich nicht lesen.', 400)
    }
  } else if (hatFeld) {
    text = textAusEingabe(feld as string).text || null
  }
  if (text && !eigener) return fehler('Ein eigener Text ist nur beim Auftrag «Eigenen Text verwenden» möglich.', 400)
  if (eigener && !text) return fehler('Für «Eigenen Text verwenden» braucht es einen Text oder eine Datei.', 400)

  const dossierAuftraege = DOSSIER_AUFTRAEGE.filter((a) => kommentare.some((c) => c.auftrag === a))
  const mitDossier = dossierAuftraege.length > 0 && z.eba && heft !== 'auftrag' && z.roh.dossier != null
  const admin = createAdminClient()
  try {
    // Tagesgrenze (F4): jedes Bündel ist ein Modellaufruf, das Dossier zählt mit.
    const max = maxAufrufeProTag()
    if ((await aufrufeHeute(admin, z.userId)) + (mitDossier ? 2 : 1) > max) {
      return fehler(`Tagesgrenze erreicht: höchstens ${max} Vorschläge pro Tag. Morgen geht es weiter.`, 429)
    }

    const fassung = await holeOderLegeFassung(admin, z.userId, z.slug, eigener ? 'ohne_medien' : undefined)
    const rohOriginal = z.roh
    const rohAktuell = wendeAn(rohOriginal, fassung.ersetzungen ?? []).dateien as RohDateien
    const set = loadEinheit(z.slug)
    const entry = einheitById(z.slug)
    if (!set || !entry) return fehler('Einheit nicht gefunden.', 404)
    const kontext = werkstattKontext(set, entry)

    const d = HEFT_DATEI[heft as BuendelHeft]
    const lfs = eigener ? leitfragenAus(kommentare.filter((c) => c.auftrag === 'eigener_text')) : undefined
    const pflicht = [...new Set([...new Set(kommentare.map((c) => c.auftrag))].flatMap((a) =>
      pflichtPfade(a, d, rohAktuell[d], { eba: z.eba, ...(a === 'eigener_text' ? { geaenderteLeitfragen: lfs } : {}) })))]
    const laeufe: Lauf[] = [{ heft: heft as BuendelHeft, kommentare, pflicht, ...(heft === 'auftrag' ? {} : { glossarBegriffe: glossarBegriffe(rohAktuell.set, heft) }) }]
    if (mitDossier) {
      const dossier = rohAktuell.dossier as { glossar?: { id?: unknown }[] } | null
      laeufe.push({
        heft: 'dossier',
        kommentare: dossierAuftraege.map((a) => ({ auftrag: a, datei: 'dossier' as const, pfad: 'einleitung.was_ist_das', kommentar: DOSSIER_KOMMENTAR[a]! })),
        pflicht: [...new Set(dossierAuftraege.flatMap((a) =>
          pflichtPfade(a, 'dossier', rohAktuell.dossier, { eba: true, heft, ...(a === 'eigener_text' ? { geaenderteLeitfragen: lfs } : {}) })))],
        glossarIds: (dossier?.glossar ?? []).map((g) => g?.id).filter((x): x is string => typeof x === 'string'),
      })
    }

    // Zeilen anlegen (zählen ab jetzt zur Tagesgrenze), Klartext einmal speichern.
    const rows: BuendelRow[] = []
    for (const l of laeufe) {
      const { data, error } = await admin.from('einheit_fassung_buendel')
        .insert({ fassung_id: fassung.id, user_id: z.userId, heft: l.heft, kommentare: l.kommentare, status: 'offen' }).select('*').single()
      if (error || !data) throw new Error('Bündel nicht anlegbar')
      rows.push(data as BuendelRow)
    }
    if (text) {
      const pfad = `${z.userId}/${rows[0].id}.txt`
      const { error } = await admin.storage.from(FASSUNG_BUCKET).upload(pfad, new TextEncoder().encode(text), { contentType: 'text/plain; charset=utf-8', upsert: false })
      if (error) {
        await admin.from('einheit_fassung_buendel').delete().in('id', rows.map((r) => r.id))
        return fehler('Der Text konnte nicht gespeichert werden.', 502)
      }
      const { data } = await admin.from('einheit_fassung_buendel').update({ text_pfad: pfad }).in('id', rows.map((r) => r.id)).select('*')
      for (const r of (data ?? []) as BuendelRow[]) rows[rows.findIndex((x) => x.id === r.id)] = r
    }

    const ergebnisse = await Promise.all(laeufe.map((l, i) => verarbeite(admin, rows[i], l, {
      kontext, eba: z.eba, text, rohOriginal, rohAktuell,
    })))
    return json({ buendel: ergebnisse })
  } catch {
    return fehler('Der Vorschlag konnte nicht gespeichert werden.', 502)
  }
}

async function verarbeite(
  admin: Admin, row: BuendelRow, l: Lauf,
  c: { kontext: ReturnType<typeof werkstattKontext>; eba: boolean; text: string | null; rohOriginal: RohDateien; rohAktuell: RohDateien },
) {
  const datei = HEFT_DATEI[l.heft]
  let art: string | undefined
  let patch: Partial<BuendelRow>
  try {
    const { system, nutzer } = baueAnfrage({
      kontext: c.kontext, datei, roh: c.rohAktuell[datei], rohOriginal: c.rohOriginal[datei], kommentare: l.kommentare,
      eigenerText: c.text, eba: c.eba, pflicht: l.pflicht, glossarBegriffe: l.glossarBegriffe,
    })
    const erg = await frageModell({ system, nutzer })
    if (!erg.ok) {
      // Nur die Art loggen — `meldung` kann den Ablehnungstext des Modells tragen (F11).
      console.warn(`[fassungen] Modellaufruf ${row.id}: ${erg.fehler}`)
      art = erg.fehler
      patch = { status: 'fehler' }
    } else {
      const pruefe = (antwort: typeof erg.antwort) => pruefeVorschlag({
        datei, rohOriginal: c.rohOriginal[datei], rohAktuell: c.rohAktuell[datei], antwort,
        kommentare: l.kommentare, eba: c.eba, buendelId: row.id, pflicht: l.pflicht, methodenRefs: methodenRefs(),
        glossarBegriffe: l.glossarBegriffe, glossarIds: l.glossarIds,
      })
      let antwort = erg.antwort
      let vorschlag = pruefe(antwort)
      // Eine Korrekturrunde (Befund 14.11.2026): Schon ein Pflichtfeld knapp über der Grenze
      // macht den ganzen Vorschlag unvollständig. Darum einmal nachfragen — nur für die
      // fehlenden Pfade, mit dem Grund des Servers. Zählt nicht als eigenes Bündel.
      if (!vorschlag.vollstaendig && vorschlag.fehlend.length) {
        const gruende = vorschlag.fehlend.map((p) => {
          const v = vorschlag.verworfen.find((x) => x.pfad === p)
          return `- ${p}: ${v ? v.grund : 'fehlt in der Antwort'}`
        })
        const nachfrage = await frageModell({
          system,
          nutzer: `${nutzer}\n\nKORREKTUR: Diese Pflicht-Pfade sind noch nicht gültig. Senden Sie NUR diese Pfade neu — ersetzt (deutlich unter der Grenze) oder bestätigt:\n${gruende.join('\n')}`,
        })
        if (nachfrage.ok) {
          const neu = new Set(vorschlag.fehlend)
          antwort = {
            ersetzungen: [...antwort.ersetzungen.filter((e) => !neu.has(e.pfad)), ...nachfrage.antwort.ersetzungen.filter((e) => neu.has(e.pfad))],
            bestaetigt: [...antwort.bestaetigt, ...nachfrage.antwort.bestaetigt.filter((b) => neu.has(b.pfad))],
            hinweis: antwort.hinweis,
          }
          vorschlag = pruefe(antwort)
        } else {
          console.warn(`[fassungen] Korrekturrunde ${row.id}: ${nachfrage.fehler}`)
        }
      }
      patch = { status: vorschlag.vollstaendig ? 'vorschlag' : 'unvollstaendig', vorschlag, modell: erg.modell }
    }
  } catch (e) {
    console.warn(`[fassungen] Prüfung ${row.id}: ${e instanceof Error ? e.name : 'Fehler'}`)
    patch = { status: 'fehler' }
  }
  const { data } = await admin.from('einheit_fassung_buendel').update(patch).eq('id', row.id).select('*').single()
  return buendelSicht((data as BuendelRow | null) ?? { ...row, ...patch }, art)
}
