/**
 * Fork-Pilot «Meine Fassung» — Prüfung einer Modellantwort (VERTRAG §4, §6, §7 letzter
 * Absatz; ENTSCHEIDE F7). Der Server parst `wert_json`, prüft Pfad gegen die
 * Positivliste und den Auftrag, Form und Budget, setzt `original_hash` selbst und
 * verwirft alles andere mit Grund.
 *
 * Reine Funktion: kein Netz, kein Dateisystem. Was ersetzbar ist, entscheidet allein
 * `positivliste.ts` (Invariante 4); hier wird nur zusammengeführt.
 */
import { lesePfad, setzePfad, kanonisch, wertHash, type FassungsDatei } from './adresse.ts'
import { feldFuer, erlaubtFuerAuftrag, pruefeWert, lpTexte, type AuftragKey, type PruefKontext } from './positivliste.ts'
import type { ModellAntwort } from './openai.ts'
import type { KommentarEingabe, Vorschlag, VorschlagErsetzung } from './typen.ts'

const HINWEIS_MAX = 1000

/** Nummer der Leitfrage aus einem Pfad wie `spuren.ohne_medien.leitfragen[nr=3].text`. */
function leitfrageNr(pfad: string): number | null {
  const m = /leitfragen\[nr=(\d+)\]/.exec(pfad)
  return m ? Number(m[1]) : null
}

/** Aufträge der Kommentare in der Reihenfolge ihres ersten Auftretens, je mit den Ziel-Leitfragen (§4 «derselben Leitfrage»). */
function auftraegeAus(kommentare: KommentarEingabe[]): { auftrag: AuftragKey; zielLeitfragen: number[] }[] {
  const liste: { auftrag: AuftragKey; zielLeitfragen: number[] }[] = []
  for (const k of kommentare) {
    let eintrag = liste.find((x) => x.auftrag === k.auftrag)
    if (!eintrag) { eintrag = { auftrag: k.auftrag, zielLeitfragen: [] }; liste.push(eintrag) }
    const n = leitfrageNr(k.pfad)
    if (n !== null && !eintrag.zielLeitfragen.includes(n)) eintrag.zielLeitfragen.push(n)
  }
  return liste
}

function kopie<T>(v: T): T {
  return v === undefined ? v : (JSON.parse(JSON.stringify(v)) as T)
}

const kuerze = (s: string, max: number): string => {
  const z = [...s]
  return z.length > max ? z.slice(0, max).join('') : s
}

/** Prüft die Antwort des Modells für genau eine Datei eines Bündels. */
export function pruefeVorschlag(args: {
  datei: FassungsDatei
  /** Rohdatei wie auf der Platte — Hash und Budget messen dagegen. */
  rohOriginal: unknown
  /** Rohdatei mit der bisherigen Fassung — das hat das Modell gesehen. */
  rohAktuell: unknown
  antwort: ModellAntwort
  kommentare: KommentarEingabe[]
  eba: boolean
  buendelId: string
  /** positivliste.pflichtPfade(...) für dieses Bündel. */
  pflicht: string[]
  methodenRefs: Set<string>
  glossarBegriffe?: string[]
  glossarIds?: string[]
}): Vorschlag {
  const { datei, rohOriginal, rohAktuell, antwort } = args
  const auftraege = auftraegeAus(args.kommentare)
  const ersetzungen: VorschlagErsetzung[] = []
  const bestaetigt: Vorschlag['bestaetigt'] = []
  const verworfen: Vorschlag['verworfen'] = []
  const verwirf = (d: string, pfad: string, grund: string) => verworfen.push({ datei: d, pfad, grund })
  const bestaetige = (pfad: string, begruendung: string) => {
    if (!bestaetigt.some((b) => b.pfad === pfad)) bestaetigt.push({ pfad, begruendung })
  }

  // 1. Parsen, Datei und Positivliste; doppelte Pfade (nur die erste gilt).
  const gesehen = new Set<string>()
  const kandidaten: { pfad: string; wert: unknown; begruendung: string }[] = []
  for (const e of antwort.ersetzungen) {
    // Ein Aufruf gilt genau einer Datei. Echter Durchgang 14.11.2026: Das Modell schrieb `datei`
    // im Dossier-Aufruf anders (der Heft-Lesekontext steht daneben). Liegt der Pfad in DIESER
    // Datei, zählt die Ersetzung zu ihr; sonst bleibt es «falsche Datei».
    if (e.datei !== datei && !(feldFuer(datei, e.pfad) && lesePfad(rohAktuell, e.pfad) !== undefined)) {
      verwirf(e.datei, e.pfad, `falsche Datei (erwartet ${datei})`); continue
    }
    if (gesehen.has(e.pfad)) { verwirf(e.datei, e.pfad, 'doppelt'); continue }
    gesehen.add(e.pfad)
    let wert: unknown
    try {
      wert = JSON.parse(e.wert_json)
    } catch {
      // Echter Durchgang 14.11.2026: Das Modell schickt Text-Felder manchmal als nackten Text
      // statt als JSON-Zeichenkette. Ist das Original ein Text, gilt der nackte Text als Wert.
      if (typeof lesePfad(rohOriginal, e.pfad) === 'string' && typeof e.wert_json === 'string' && e.wert_json.trim()) wert = e.wert_json.trim()
      else { verwirf(datei, e.pfad, 'kein gültiges JSON'); continue }
    }
    if (!feldFuer(datei, e.pfad)) { verwirf(datei, e.pfad, 'nicht ersetzbar'); continue }
    // Dossier D2: `fakten_anker` ist im Vertrag fest leer (die Belege gehören zum alten Text).
    // Der Server setzt das selbst, statt die ganze Info-Karte zu verwerfen.
    if (datei === 'dossier' && /^nuggets\[id=[^\]]+\]$/.test(e.pfad) && wert && typeof wert === 'object' && !Array.isArray(wert)) {
      wert = { ...(wert as Record<string, unknown>), fakten_anker: [] }
    }
    // Dossier D3: feste Teilfelder der Sprachkarte stellt der Server wieder her, statt die
    // ganze Karte zu verwerfen (echter Durchgang 14.11.2026).
    if (datei === 'dossier' && /^sprachmodi_scaffolds\[tag=[^\]]+\]$/.test(e.pfad) && wert && typeof wert === 'object' && !Array.isArray(wert)) {
      const alt = lesePfad(rohAktuell, e.pfad) as Record<string, unknown> | undefined
      if (alt) wert = { ...(wert as Record<string, unknown>), tag: alt.tag, sm_id: alt.sm_id, modus_label: alt.modus_label, strategien: alt.strategien }
    }
    kandidaten.push({ pfad: e.pfad, wert, begruendung: e.begruendung })
  }
  // Dossier D8: Vokabeln sind Glossar-IDs. Das Modell nennt oft den Begriff — der Server bildet
  // ihn auf die ID ab, und zwar im Glossar dieser Antwort, falls es ersetzt wird, sonst im aktuellen.
  const neuesGlossar = kandidaten.find((k) => k.pfad === 'glossar')?.wert as { id?: string; begriff?: string }[] | undefined
  const glossarJetzt = (Array.isArray(neuesGlossar) ? neuesGlossar : ((rohAktuell as { glossar?: { id?: string; begriff?: string }[] })?.glossar ?? []))
  const vok = kandidaten.find((k) => k.pfad === 'leseblatt.vokabeln')
  if (datei === 'dossier' && vok && Array.isArray(vok.wert)) {
    const ids = new Set(glossarJetzt.map((g) => g.id))
    const nachBegriff = new Map(glossarJetzt.map((g) => [String(g.begriff ?? '').toLowerCase().trim(), g.id]))
    vok.wert = (vok.wert as unknown[]).map((x) => (typeof x === 'string' && !ids.has(x) && nachBegriff.get(x.toLowerCase().trim())) || x)
  }
  // F14: Kommt die ganze Schrittliste (H24L/G6L), gilt sie — Einzel-Hints derselben Datei fallen weg.
  //      Sonst adressierten sie nach einem Label-Wechsel ein Label, das es nicht mehr gibt (§1 Reihenfolge).
  if (kandidaten.some((k) => ['H24L', 'G6L'].includes(feldFuer(datei, k.pfad)!.nr))) {
    for (let i = kandidaten.length - 1; i >= 0; i--) {
      if (!['H24', 'G6'].includes(feldFuer(datei, kandidaten[i].pfad)!.nr)) continue
      verwirf(datei, kandidaten[i].pfad, 'durch Schrittliste ersetzt')
      kandidaten.splice(i, 1)
    }
  }

  // 2. LP-Texte desselben Hefts, Original und Vorschlag (§6, Invariante 6). Der Vorschlag
  //    ist die bisherige Fassung mit allen LP-Feldern dieser Antwort — strenger ist sicherer.
  const vorschlagRoh = kopie(rohAktuell)
  for (const k of kandidaten) {
    const feld = feldFuer(datei, k.pfad)!
    if (feld.lp || feld.lpTeile) setzePfad(vorschlagRoh, k.pfad, kopie(k.wert))
  }
  const ctx: PruefKontext = {
    methodenRefs: args.methodenRefs,
    glossarBegriffe: args.glossarBegriffe,
    // D8 prüft gegen das Glossar NACH der Ersetzung (Vertrag) — also das dieser Antwort, falls vorhanden.
    glossarIds: Array.isArray(neuesGlossar) ? neuesGlossar.map((g) => g?.id).filter((x): x is string => typeof x === 'string') : args.glossarIds,
    lpTexte: [...new Set([...lpTexte(datei, rohOriginal), ...lpTexte(datei, vorschlagRoh)])],
  }

  // 3. Bestätigung, Auftrag (§4), Form und Budget (§6).
  for (const k of kandidaten) {
    if (kanonisch(k.wert) === kanonisch(lesePfad(rohAktuell, k.pfad))) { bestaetige(k.pfad, k.begruendung); continue }
    // F6: Ein Bündel mit eigenem Text legt die Fassung auf «ohne Medien» fest — für alle Aufträge darin.
    if (auftraege.some((a) => a.auftrag === 'eigener_text') && k.pfad.startsWith('spuren.mit_medien.')) {
      verwirf(datei, k.pfad, 'Eigener Text gilt nur für die Spur ohne Medien')
      continue
    }
    let auftrag: AuftragKey | null = null
    let ersterGrund = 'Kein Auftrag im Bündel'
    for (const [i, a] of auftraege.entries()) {
      const grund = erlaubtFuerAuftrag(a.auftrag, datei, k.pfad, { eba: args.eba, zielLeitfragen: a.zielLeitfragen })
      if (grund === null) { auftrag = a.auftrag; break }
      if (i === 0) ersterGrund = grund
    }
    if (!auftrag) { verwirf(datei, k.pfad, ersterGrund); continue }
    const original = lesePfad(rohOriginal, k.pfad)
    const grund = pruefeWert(datei, k.pfad, original, k.wert, ctx)
    if (grund) { verwirf(datei, k.pfad, grund); continue }
    ersetzungen.push({
      datei, pfad: k.pfad, wert: k.wert, original_hash: wertHash(original),
      auftrag, buendel_id: args.buendelId, begruendung: k.begruendung,
    })
  }

  // 4. Ausdrückliche Bestätigungen: nur Pfade der Positivliste, sonst ignorieren.
  for (const b of antwort.bestaetigt) {
    if (feldFuer(datei, b.pfad) && !ersetzungen.some((e) => e.pfad === b.pfad)) bestaetige(b.pfad, b.begruendung)
  }

  // 5. Vollständigkeit (4a, F7): jede Pflicht ersetzt oder bestätigt.
  const erledigt = new Set([...ersetzungen.map((e) => e.pfad), ...bestaetigt.map((b) => b.pfad)])
  const fehlend = [...new Set(args.pflicht)].filter((p) => !erledigt.has(p))

  return {
    ersetzungen, bestaetigt, verworfen, fehlend,
    vollstaendig: fehlend.length === 0,
    hinweis: kuerze(typeof antwort.hinweis === 'string' ? antwort.hinweis : '', HINWEIS_MAX),
  }
}
