// loesungen-v42.ts — Dokument «Lösungen» je Heft und Spur (v4.2, E19, nur Lehrperson).
//
// Hier steht nur, WAS das Dokument zeigt: ein Modell aus dem aufgelösten Heft, Abschnitt für
// Abschnitt in der Folge der Heftseiten (S. 2 · S. 3 · S. 4 · Produkt S. 7 · Abschluss S. 8).
// Wie es aussieht, entscheiden die zwei Renderer, die beide nur dieses Modell lesen:
//   HTML  src/components/einheiten/docs/DocLoesungenV42.tsx  (Stil src/styles/v42/loesungen.css)
//   Word  src/lib/einheiten/docx-loesungen-v42.ts
// So können HTML und Word nicht auseinanderlaufen. Kein React, kein docx hier.
//
// Fehlt ein Lösungsfeld in den Daten, fehlt der Teil im Modell — kein Platzhalter.
// Die Lösungsfelder selbst (raster_zeilen, befund, loesung_zeilen, erwartung,
// abschluss.loesung, loesungsbild) liest sonst kein Dokument der Lernenden.

import type { Erwartungshorizont, Leitfrage, ProduktBild, SituationJson, SpurKey } from './types'

export const SPUR_NAME_LS: Record<SpurKey, string> = { ohne_medien: 'ohne Medien', mit_medien: 'mit Medien' }

/** Erklärzeile im Kopf der ersten Seite. */
export const LOESUNG_ERKLAERUNG = 'Grün = mögliche Lösung. Wo Lernende mit eigenen Beispielen arbeiten, ist sie eine von vielen.'

export type LsZeile = { label?: string; text: string; quelle?: string }

export interface LsLeitfrage {
  nr: number
  text: string
  zeilen: LsZeile[]
}

export interface LsRaster {
  nr: number
  text: string
  /** «Lehrmittel-Abschnitt: …» bzw. «Quelle: …» — eine Zeile. */
  quelle?: string
  /** Prüfdatum der Lösung gegen die Quelle (TT.MM.JJJJ). */
  stand?: string
  spalten: string[]
  /** Spaltenbreiten in %, parallel zu `spalten` (oder undefined = gleich breit). */
  breiten?: number[]
  /** Nur Spur ohne Medien: die im Heft vorgedruckte Zeile. */
  beispiel?: string[]
  /** Die mögliche Lösung, ohne die Beispielzeile. */
  zeilen: string[][]
  befund?: string
  /** Hinweise für die Lehrperson (`loesung.zeilen`): normale Farbe, kleiner. */
  hinweise: LsZeile[]
}

export interface LsVertiefung {
  titel: string
  herkunft?: string
  frage?: string
  erwartung: string
}

export interface LsBeurteilen {
  nr: number
  text: string
  gutWenn: string[]
  tragfaehig?: string
  antworten: string[]
  nichtTragfaehig?: string
  denkhilfe?: { titel: string; spalten: string[]; zeilen: string[][] }
  vertiefungTitel?: string
  vertiefungen: LsVertiefung[]
}

export interface LsProdukt {
  titel?: string
  hinweis?: string
  bild: ProduktBild
}

export interface LsAbschluss {
  verbindungen: { von: string; nach: string; text: string }[]
  eigeneKnoten: string[]
  transferTitel: string
  transfer?: string
  quercheck: { frage: string; antwort: string }[]
  mitnahme: { label: string; eintrag: string }[]
}

export interface LoesungenModell {
  buchstabe: string
  spur: SpurKey
  /** `Lösungen · Heft A · ohne Medien` — Kopf, Fusszeile, Dokumenttitel. */
  titel: string
  /** Kopfzeile oben rechts, wie `HEFT A · OHNE MEDIEN` bei den Heften. */
  docCode: string
  heftTitel?: string
  s2: LsLeitfrage[]
  s3: LsRaster | null
  s4: LsBeurteilen | null
  produkt: LsProdukt | null
  abschluss: LsAbschluss | null
}

const voll = (s?: string | null): s is string => !!s && !!s.trim()

function datumCh(d?: string): string | undefined {
  const m = d?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return m ? `${m[3]}.${m[2]}.${m[1]}` : d || undefined
}

function zeilenVon(lf?: Leitfrage): LsZeile[] {
  return (lf?.loesung?.zeilen ?? []).filter((z) => z && voll(z.text))
}

/** Wie rasterBreiten() in heft-v42/seiten-1-4.tsx: «Aussage» breit, «→ Begriff» 22 %. */
export function rasterBreitenLs(spalten: string[]): number[] | undefined {
  const a = spalten.findIndex((s) => /aussage/i.test(s))
  if (spalten.length !== 4 || a < 0 || a === 3) return undefined
  const rest = [18, 22]
  return spalten.map((_, i) => (i === a ? 38 : i === 3 ? 22 : rest.shift()!))
}

const gleich = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => (x ?? '').trim() === (b[i] ?? '').trim())

function s3Modell(sit: SituationJson): LsRaster | null {
  const lf = sit.leitfragen?.find((l) => l.antwortform === 'raster') ?? sit.leitfragen?.find((l) => l.nr === 3)
  if (!lf) return null
  const loesung = lf.loesung
  const raster = lf.raster
  const spalten = raster?.spalten ?? []
  const pflicht = sit.spur === 'mit_medien' ? sit.quellen?.find((q) => q.rolle === 'pflicht') : undefined
  // Wie im Heft (Seite3): Beispielzeile nur in der Spur ohne Medien.
  const beispiel = !pflicht && raster?.beispielzeile?.length ? raster.beispielzeile : undefined
  const alle = (loesung?.raster_zeilen ?? []).filter((z) => Array.isArray(z) && z.some(voll))
  const zeilen = beispiel ? alle.filter((z) => !gleich(z, beispiel)) : alle
  const hinweise = zeilenVon(lf)
  const befund = voll(loesung?.befund) ? loesung!.befund : undefined
  if (!zeilen.length && !befund && !hinweise.length) return null

  let quelle: string | undefined
  if (pflicht) {
    const herkunft = [pflicht.herausgeber, datumCh(pflicht.datum)].filter(Boolean).join(', ')
    quelle = `Quelle: ${pflicht.titel}${herkunft ? ` (${herkunft})` : ''}`
    if (pflicht.ersatz?.titel) quelle += ` · Ersatzquelle: ${pflicht.ersatz.titel}`
  } else if (raster?.knoten_ref) {
    const anker = sit.quellen_anker?.find((a) => a.ref && raster.knoten_ref!.startsWith(a.ref))
    quelle = [
      `Lehrmittel-Abschnitt: ${raster.knoten_ref.replace(/\s*\|\s*/g, ' · ')}`,
      anker && [anker.titel, anker.unterueberschrift].filter(Boolean).join(' · '),
    ].filter(Boolean).join(' · ')
  }
  return {
    nr: lf.nr,
    text: lf.text,
    quelle,
    stand: datumCh(loesung?.quelle_stand),
    spalten,
    breiten: rasterBreitenLs(spalten),
    beispiel,
    zeilen,
    befund,
    hinweise,
  }
}

function s4Modell(sit: SituationJson): LsBeurteilen | null {
  const lf = sit.leitfragen?.find((l) => !!l.pol_typ) ?? sit.leitfragen?.find((l) => l.nr === 4)
  const eh: Erwartungshorizont = lf?.loesung?.erwartungshorizont ?? {}
  const k = sit.kasten_s4
  const denkSpalten = k?.typ === 'denkhilfe' ? (k.spalten ?? []).filter(Boolean) : []
  const denkZeilen = k?.typ === 'denkhilfe' ? (k.loesung_zeilen ?? []).filter((z) => Array.isArray(z) && z.some(voll)) : []
  const vertiefungen: LsVertiefung[] = k?.typ === 'vertiefung'
    ? (sit.quellen ?? [])
        .filter((q) => q.rolle === 'vertiefung' && voll(q.erwartung))
        .slice(0, 2)
        .map((q) => ({
          titel: q.titel,
          herkunft: [q.herausgeber, datumCh(q.datum)].filter(Boolean).join(', ') || undefined,
          frage: q.leitfrage_vertiefung,
          erwartung: q.erwartung!,
        }))
    : []
  const gutWenn = (eh.gut_wenn ?? []).filter(voll)
  const antworten = [eh.beispiel_pol_1, eh.beispiel_pol_2].filter(voll)
  const denkhilfe = denkZeilen.length ? { titel: k?.titel || 'Denkhilfe', spalten: denkSpalten, zeilen: denkZeilen } : undefined
  if (!lf || (!gutWenn.length && !antworten.length && !voll(eh.nicht_tragfaehig) && !voll(eh.tragfaehig) && !denkhilfe && !vertiefungen.length)) return null
  return {
    nr: lf.nr,
    text: lf.text,
    gutWenn,
    tragfaehig: voll(eh.tragfaehig) ? eh.tragfaehig : undefined,
    antworten,
    nichtTragfaehig: voll(eh.nicht_tragfaehig) ? eh.nicht_tragfaehig : undefined,
    denkhilfe,
    vertiefungTitel: vertiefungen.length ? k?.titel || 'Vertiefung' : undefined,
    vertiefungen,
  }
}

function abschlussModell(sit: SituationJson, spur: SpurKey): LsAbschluss | null {
  const l = sit.abschluss?.loesung
  if (!l) return null
  const fragen = sit.abschluss?.quercheck ?? []
  const labels = sit.abschluss?.mitnahme ?? []
  const m: LsAbschluss = {
    verbindungen: (l.verbindungen ?? []).filter((v) => v && voll(v.von) && voll(v.nach) && voll(v.text)),
    eigeneKnoten: (l.eigene_knoten?.[spur] ?? []).filter(voll),
    transferTitel: sit.mindmap_aeste?.find((a) => a.transfer)?.titel || 'gilt auch bei …',
    transfer: voll(l.transfer) ? l.transfer : undefined,
    quercheck: fragen.map((frage, i) => ({ frage, antwort: l.quercheck?.[i] ?? '' })).filter((x) => voll(x.frage) && voll(x.antwort)),
    mitnahme: labels.map((label, i) => ({ label, eintrag: l.mitnahme?.[i] ?? '' })).filter((x) => voll(x.label) && voll(x.eintrag)),
  }
  const leer = !m.verbindungen.length && !m.eigeneKnoten.length && !m.transfer && !m.quercheck.length && !m.mitnahme.length
  return leer ? null : m
}

/** `Lösungen · Heft A · ohne Medien`. */
export function loesungenTitel(buchstabe: string, spur: SpurKey): string {
  return `Lösungen · Heft ${buchstabe} · ${SPUR_NAME_LS[spur]}`
}

/**
 * Das Modell eines Hefts in genau einer Spur (`sit` ist bereits aufgelöst, `sit.spur` gesetzt).
 * `null`, wenn das Heft keine einzige Lösung trägt — dann gibt es kein Dokument.
 */
export function loesungenModell(sit: SituationJson): LoesungenModell | null {
  const spur: SpurKey = sit.spur ?? 'ohne_medien'
  const L = sit.buchstabe || '?'
  const s2: LsLeitfrage[] = [1, 2]
    .map((nr) => sit.leitfragen?.find((l) => l.nr === nr))
    .filter((lf): lf is Leitfrage => !!lf)
    .map((lf) => ({ nr: lf.nr, text: lf.text, zeilen: zeilenVon(lf) }))
    .filter((x) => x.zeilen.length > 0)
  const bild = sit.handlungsprodukt?.loesungsbild
  const produkt: LsProdukt | null = bild
    ? { titel: sit.handlungsprodukt?.titel, hinweis: voll(bild.hinweis) ? bild.hinweis : undefined, bild }
    : null
  const m: LoesungenModell = {
    buchstabe: L,
    spur,
    titel: loesungenTitel(L, spur),
    docCode: `LÖSUNGEN ${L} · ${SPUR_NAME_LS[spur].toUpperCase()}`,
    heftTitel: sit.titel,
    s2,
    s3: s3Modell(sit),
    s4: s4Modell(sit),
    produkt,
    abschluss: abschlussModell(sit, spur),
  }
  return m.s2.length || m.s3 || m.s4 || m.produkt || m.abschluss ? m : null
}
