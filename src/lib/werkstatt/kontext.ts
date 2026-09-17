// Werkstatt — eine geladene Einheit auf das reduziert, was ein LLM-Prompt braucht.
//
// Warum eine eigene Zwischenform und nicht direkt `EinheitFullSet`: Der Prompt darf
// nicht das ganze JSON sehen. Er braucht genau die Felder, die ein erzeugtes Material
// mit der Einheit konsistent halten — Prinzip, Trade-off-Raum, Bloom-Korridor,
// verbrauchte Personas, Beurteilungsmassstab — und sonst nichts. Alles, was hier nicht
// steht, kann ein Auftrag auch nicht versehentlich in den Prompt schreiben.
//
// Die Reduktion ist zugleich der Ort, an dem die Rohdaten normalisiert werden: die
// JSONs sind von Hand geschrieben, fast jedes Feld ist optional, und ab hier ist alles
// ein String oder ein Array — kein Konsument muss mehr `?.` schreiben.

import type {
  EinheitFullSet,
  EinheitIndexEntry,
  SituationJson,
} from '../einheiten/types'
import { lehrgangLabel, lehrgaengeOf, isEbaLehrgang, sortLehrgaenge } from '../einheiten/lehrgang'

export type HfLetter = 'A' | 'B' | 'C'

const s = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')
const a = <T,>(v: T[] | undefined | null): T[] => (Array.isArray(v) ? v : [])

/** Eine Herausforderung, so wie ein Prompt sie zitieren darf. */
export interface WerkstattHf {
  buchstabe: HfLetter
  titel: string
  /** `herausforderung.label` — was die Herausforderung didaktisch leistet. */
  label: string
  emotionTag: string
  persona: { beruf: string; betrieb: string; ort: string }
  situationText: string
  zahlen: { label: string; wert: string }[]
  leitfrage: string
  leitfragen: { nr: number; text: string; bloom: string; liefert: string }[]
  produkt: {
    format: string
    formatDetail: string
    titel: string
    beschreibung: string
    schritte: { label: string; hint: string }[]
    satzanfaenge: string[]
    strategien: string[]
    struktur: string[]
  }
  tradeOff: string
  tradeOffHint: string
  scaffold90: string
  scaffold100: string
  kriterien: { kriterium: string; indikator: string }[]
  dekontext: { frage: string; ziel: string }
  quellen: { ref: string; titel: string; seiten: string }[]
  kernkonzept: string
  knAktivierung: string
  sk: number[]
  sprachmodi: string[]
  kompetenzen: { nr: string; text: string }[]
  hatMethoden: boolean
  /** `default_4page_v2` | `default_4page_v3` — entscheidet über die Bogen-Anatomie. */
  template: string
}

/** Die ganze Einheit als Prompt-Kontext. */
export interface WerkstattKontext {
  slug: string
  einheitTitel: string
  modul: string
  modulTitel: string
  themaNr: number | null
  lehrgang: string
  lehrgangLabel: string
  lehrgaenge: string[]
  /** Nur die ZUSÄTZLICHEN Lehrgänge, als Klartext — leer, wenn die Einheit einwertig ist. */
  weitereLehrgaenge: string[]
  istEba: boolean
  lehrjahrHinweis: string

  kompetenzversprechen: string
  kompetenzen: { nr: string; text: string }[]
  lebensbezug: { nr: string; text: string }

  ankerStatement: string
  transferfeld: string
  mehrdeutigkeitVerbindlich: string
  tradeOffRaum: string[]
  bloom: { lf: string; stufe: string }[]
  aspekte: { aspekt: string; r: string }[]
  zirkularitaet: { r1: string; r2: string; r3: string }

  personaVerbraucht: { berufe: string[]; orte: string[] }
  personaKnReserviert: { berufe: string[]; orte: string[] }

  konzepte: string[]
  kapitel: string[]
  konzeptProgression: { position: string; hf: string; konzept: string }[]

  rubrikKriterien: { name: string; dimension: string }[]
  niveaubaender: { label: string; definition: string }[]
  knTypen: { typ: string; label: string }[]
  hybrid: {
    titel: string
    text: string
    leitfrage: string
    tradeOffs: string[]
    maxWoerter: number | null
    minTradeOffs: number | null
    perspektive: string
  } | null

  dekontextAufgabe: { auftrag: string; format: string; ziel: string }
  hfs: WerkstattHf[]
  hatDossier: boolean
}

function toHf(sit: SituationJson | null, letter: HfLetter): WerkstattHf | null {
  if (!sit) return null
  const hp = sit.handlungsprodukt ?? {}
  return {
    buchstabe: letter,
    titel: s(sit.titel),
    label: s(sit.herausforderung?.label),
    emotionTag: s(sit.emotion_tag),
    persona: {
      beruf: s(sit.persona?.beruf),
      betrieb: s(sit.persona?.betrieb),
      ort: s(sit.persona?.ort),
    },
    situationText: s(sit.situation_text),
    zahlen: a(sit.zahlen_tabelle).map((z) => ({ label: s(z.label), wert: s(z.wert) })),
    leitfrage: s(sit.leitfrage),
    leitfragen: a(sit.leitfragen).map((l) => ({
      nr: Number(l.nr) || 0,
      text: s(l.text),
      bloom: s(l.bloom),
      liefert: s(l.liefert),
    })),
    produkt: {
      format: s(hp.format),
      formatDetail: s(hp.format_detail),
      titel: s(hp.titel),
      beschreibung: s(hp.beschreibung),
      schritte: a(hp.schritte).map((x) => ({ label: s(x.label), hint: s(x.hint) })),
      satzanfaenge: a(hp.scaffolding?.satzanfaenge).map(s).filter(Boolean),
      strategien: a(hp.scaffolding?.strategien).map(s).filter(Boolean),
      struktur: a(hp.scaffolding?.struktur).map(s).filter(Boolean),
    },
    tradeOff: s(sit.mehrdeutigkeit?.trade_off),
    tradeOffHint: s(sit.mehrdeutigkeit?.hint),
    scaffold90: s(sit.lernfortschritt?.scaffold_90),
    scaffold100: s(sit.lernfortschritt?.scaffold_100),
    kriterien: a(sit.lernfortschritt?.kriterien).map((k) => ({
      kriterium: s(k.kriterium),
      indikator: s(k.indikator),
    })),
    dekontext: {
      frage: s(sit.dekontextualisierung?.frage),
      ziel: s(sit.dekontextualisierung?.ziel),
    },
    quellen: a(sit.quellen_anker).map((q) => ({
      ref: s(q.ref),
      titel: s(q.titel),
      seiten: s(q.seiten),
    })),
    kernkonzept: s(sit.prinzip_handoff?.kernkonzept),
    knAktivierung: s(sit.prinzip_handoff?.kn_aktivierung),
    sk: a(sit.nrlp?.sk).map(Number).filter((n) => !Number.isNaN(n)),
    sprachmodi: a(sit.nrlp?.sprachmodi).map(s).filter(Boolean),
    // `nrlp.kompetenzen` wird SSR-seitig von enrichKompetenzen() befüllt; ohne diesen
    // Schritt bleibt nur der in der Herausforderung gespeicherte Primärsatz.
    kompetenzen: a(sit.nrlp?.kompetenzen).length
      ? a(sit.nrlp?.kompetenzen).map((k) => ({ nr: s(k.nr), text: s(k.text) }))
      : s(sit.nrlp?.nr)
        ? [{ nr: s(sit.nrlp?.nr), text: s(sit.nrlp?.kompetenz_text) }]
        : [],
    hatMethoden: a(sit.methoden).length > 0,
    template: s(sit.template) || 'default_4page_v2',
  }
}

/**
 * Baut den Prompt-Kontext. `set` sollte durch `enrichKompetenzen()` gelaufen sein —
 * sonst fehlen die Kompetenz-Klartexte, und der Prompt zitiert nur Nummern.
 */
export function werkstattKontext(set: EinheitFullSet, entry: EinheitIndexEntry): WerkstattKontext {
  const p = set.prinzip
  const kn = set.kn
  const st = set.set
  const hfs = ([
    toHf(set.hf_A, 'A'),
    toHf(set.hf_B, 'B'),
    toHf(set.hf_C, 'C'),
  ].filter(Boolean) as WerkstattHf[])

  const erste = hfs[0]
  const lehrgang = s(entry.lehrgang) || s(p?.lehrgang) || 'EFZ_3J'

  // Kompetenz-Klartexte über alle Herausforderungen einsammeln; der Index kennt die
  // abgedeckten Nummern, die Texte liegen in den Herausforderungen.
  const textMap = new Map<string, string>()
  for (const hf of hfs) for (const k of hf.kompetenzen) if (k.nr && k.text && !textMap.has(k.nr)) textMap.set(k.nr, k.text)
  const nrs = a(entry.abgedeckte_kompetenzen).length ? a(entry.abgedeckte_kompetenzen) : [entry.kompetenz_nr]
  const kompetenzen = nrs.filter(Boolean).map((nr) => ({ nr: String(nr), text: textMap.get(String(nr)) ?? '' }))

  const spec = p?.hybrid_situation_spec ?? {}
  const hyb = kn?.hybrid_situation

  return {
    slug: entry.id,
    einheitTitel: s(entry.einheit_titel) || s(entry.titel) || entry.id,
    modul: s(entry.modul ?? ''),
    modulTitel: s(entry.modul_titel ?? ''),
    themaNr: entry.thema_nr ?? null,
    lehrgang,
    lehrgangLabel: lehrgangLabel(lehrgang),
    lehrgaenge: sortLehrgaenge(lehrgaengeOf(entry)),
    weitereLehrgaenge: sortLehrgaenge(lehrgaengeOf(entry))
      .filter((l) => l !== lehrgang)
      .map(lehrgangLabel),
    istEba: isEbaLehrgang(lehrgang),
    // Das Lehrjahr steht nirgends kanonisch in der Einheit; der Prompt soll es
    // deshalb aus der Einheit ableiten statt eine Zahl zu erfinden.
    lehrjahrHinweis: isEbaLehrgang(lehrgang)
      ? 'EBA, 2-jährige Grundbildung'
      : `${lehrgangLabel(lehrgang)}, Thema T${entry.thema_nr ?? '?'}`,

    kompetenzversprechen: s(p?.kern_kompetenzversprechen) || s(kn?.kern_kompetenzversprechen),
    kompetenzen,
    lebensbezug: {
      nr: s(entry.modul ?? ''),
      text: s(entry.modul_titel ?? '') || s(erste?.titel),
    },

    ankerStatement: s(p?.dekontextualisierungs_anker?.anker_statement),
    transferfeld: s(p?.dekontextualisierungs_anker?.transferfeld),
    mehrdeutigkeitVerbindlich:
      s(p?.mehrdeutigkeits_architektur?.verbindlich) || s(kn?.mehrdeutigkeits_pflicht),
    tradeOffRaum: a(p?.mehrdeutigkeits_architektur?.trade_off_raum).map(s).filter(Boolean),
    bloom: Object.entries(p?.bloom_zielprofil ?? {}).map(([lf, stufe]) => ({ lf, stufe: s(stufe) })),
    aspekte: Object.entries(p?.aspekte ?? {}).map(([aspekt, r]) => ({ aspekt, r: s(r) })),
    zirkularitaet: {
      r1: s(p?.zirkularitaet?.r1_aktuell),
      r2: s(p?.zirkularitaet?.r2_voraussicht),
      r3: s(p?.zirkularitaet?.r3_voraussicht),
    },

    // Verbrauchte Personas = Pool aus dem Prinzip PLUS was in A/B/C real steht.
    // Der Pool allein reicht nicht: er ist eine Planungsgrösse, die Herausforderung
    // ist die Tatsache.
    personaVerbraucht: {
      berufe: unique([...a(p?.persona_pool_units?.berufe).map(s), ...hfs.map((h) => h.persona.beruf)]),
      orte: unique([...a(p?.persona_pool_units?.orte).map(s), ...hfs.map((h) => h.persona.ort)]),
    },
    personaKnReserviert: {
      berufe: unique([...a(p?.persona_pool_kn_neu?.berufe).map(s), s(hyb?.persona?.beruf)]),
      orte: unique([...a(p?.persona_pool_kn_neu?.orte).map(s), s(hyb?.persona?.ort)]),
    },

    konzepte: unique(a((p as { quellen_anker?: { konzepte?: string[] } } | null)?.quellen_anker?.konzepte).map(s)),
    kapitel: unique(a((p as { quellen_anker?: { chapters?: string[] } } | null)?.quellen_anker?.chapters).map(s)),
    konzeptProgression: a(st?.konzept_progression).map((x) => ({
      position: String(x.position ?? ''),
      hf: s(x.herausforderung),
      konzept: s(x.konzept),
    })),

    rubrikKriterien: a(kn?.rubrik_shared?.kriterien).map((k) => ({
      name: s(k.name),
      dimension: s(k.dimension),
    })),
    niveaubaender: a(kn?.rubrik_shared?.niveaubaender).map((n) => ({
      label: s(n.label),
      definition: s(n.definition),
    })),
    knTypen: a(kn?.kn_typen).map((t) => ({ typ: s(t.typ), label: s(t.label) })),
    hybrid: hyb
      ? {
          titel: s(hyb.titel),
          text: s(hyb.text),
          leitfrage: s(hyb.leitfrage),
          tradeOffs: a(hyb.aktivierte_trade_offs).map(s).filter(Boolean),
          maxWoerter: typeof spec.max_woerter === 'number' ? spec.max_woerter : null,
          minTradeOffs:
            typeof spec.must_activate_trade_offs_min === 'number' ? spec.must_activate_trade_offs_min : null,
          perspektive: s(spec.perspektive) || 'ICH',
        }
      : null,

    dekontextAufgabe: {
      auftrag: s(st?.dekontextualisierungs_aufgabe?.auftrag),
      format: s(st?.dekontextualisierungs_aufgabe?.format),
      ziel: s(st?.dekontextualisierungs_aufgabe?.ziel),
    },
    hfs,
    hatDossier: !!set.dossier,
  }
}

export function hfAusKontext(k: WerkstattKontext, letter: string | null): WerkstattHf | null {
  if (!letter) return null
  return k.hfs.find((h) => h.buchstabe === letter) ?? null
}

function unique(list: string[]): string[] {
  const out: string[] = []
  for (const v of list) {
    const t = s(v)
    if (t && !out.includes(t)) out.push(t)
  }
  return out
}
