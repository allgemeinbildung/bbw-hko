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
  PrinzipJson,
  SituationJson,
  SpurKey,
} from '../einheiten/types'
import { TEMPLATE_V42 } from '../einheiten/types'
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
  /** Nur Heft v4.2 (`heft_8page_v42`) — fehlt bei jeder Bestandseinheit. */
  v42?: WerkstattHeftV42
}

// ---------------------------------------------------------------------------
// Heft v4.2 (ENTSCHEIDE E29). Alles hier hängt an `template === TEMPLATE_V42` bzw.
// `spur_varianten`; eine Bestandseinheit bekommt keines dieser Felder, ihr Kontext
// und ihre Prompts bleiben zeichengleich.
// ---------------------------------------------------------------------------

export const SPUR_LABEL: Record<string, string> = {
  ohne_medien: 'ohne Medien',
  mit_medien: 'mit Medien',
}

export const POL_TYP_LABEL: Record<string, string> = {
  lehrmittel_quelle: 'Lehrmittel ↔ Quelle',
  position_gegenposition: 'Position ↔ Gegenposition',
  modell_eigener_fall: 'Modell ↔ eigener Fall',
  recht_praxis: 'Recht ↔ Praxis',
  quelle_quelle: 'Quelle ↔ Quelle',
}

/** Was ein Heft v4.2 über die gemeinsamen Felder von {@link WerkstattHf} hinaus trägt. */
export interface WerkstattHeftV42 {
  /** Die Spur, in der dieses Heft aufgelöst ist — kann von der Spur der Einheit abweichen. */
  spur: SpurKey
  spurenVerfuegbar: SpurKey[]
  konfliktart: string
  produktTyp: string
  leitfragen: {
    nr: number
    text: string
    bloom: string
    liefert: string
    polTyp: string
    strategien: string[]
    satzanfaenge: string[]
    insProdukt: string
  }[]
  /** Antwortfeld von LF3. `abschnitt` nur in der Spur ohne Medien (Lehrmittel-Abschnitt). */
  raster: { abschnitt: string; auftrag: string; spalten: string[]; zeilen: number; beispielzeile: string[] } | null
  /** Quelle der Medien-Spur — nur Metadaten der Karte, nie Volltext oder Transkript. */
  quelle: { titel: string; herausgeber: string; datum: string; ausschnitt: string } | null
  kasten: { typ: string; titel: string; spalten: string[]; hinweis: string } | null
  feedbackKriterien: { name: string; dimension: string; indikator: string }[]
  glossar: { begriff: string; definition: string }[]
  beispielbild: { titel: string; bloecke: string[] } | null
  abgaben: string[]
  mindmap: { zentrum: string; aeste: { titel: string; punkte: string[]; transfer: boolean }[] }
  abschluss: { quercheck: string[]; mitnahme: string[] }
  methoden: { name: string; fuer: string }[]
}

/** Was die Einheit v4.2 als Ganzes trägt — anstelle von Persona-Pools, Austausch und Transfer. */
export interface WerkstattV42 {
  /** Die Spur, in der die Einheit geladen wurde. */
  spur: SpurKey
  /** Hefte, die es nur in einer Spur gibt — mit der Spur, die für sie gilt. */
  einspurig: { heft: string; spur: SpurKey }[]
  zentrum: string
  kriterienVerteilung: { heft: string; kriterien: string[] }[]
  personaNeutral: string
  /** Dem KN vorbehalten: Titel der Szene und die gesperrten Fall-Begriffe. */
  kn: { titel: string; fallBegriffe: string[] }
  auftrag: {
    titel: string
    lebensbereich: string
    situation: string
    leitfrage: string
    tradeOff: string
    sprachmodi: string[]
    produkte: string[]
    kontextAusschluss: string[]
  } | null
  /** Verbraucht: je Heft und für den gemeinsamen Auftrag Fall-Begriffe und Lebensbereich. */
  verbraucht: { wo: string; titel: string; lebensbereich: string; begriffe: string }[]
  /** Die vier KN-Kriterien im Wortlaut, mit den Beschreibungen je Punktzahl (0 bis 3). */
  rubrik: { name: string; dimension: string; stufen: string[] }[]
  /** Muster der Spur ohne Medien (Raster am Lehrmittel, Denkhilfe) — Vorlage für ein weiteres Heft. */
  musterOhneMedien: {
    heft: string
    abschnitt: string
    auftrag: string
    spalten: string[]
    beispielzeile: string[]
    denkhilfe: { spalten: string[]; hinweis: string } | null
  }[]
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
  /** Nur Einheiten im Format v4.2 — fehlt bei jeder Bestandseinheit. */
  v42?: WerkstattV42
}

function rasterVon(sit: SituationJson): NonNullable<WerkstattHeftV42['raster']> | null {
  const lf3 = a(sit.leitfragen).find((l) => l.antwortform === 'raster' && l.raster)
  const r = lf3?.raster
  if (!r) return null
  const pflicht = a(sit.quellen).find((q) => q.rolle === 'pflicht')
  return {
    abschnitt: s(r.knoten_ref),
    // In der Medien-Spur steht der Lese- oder Hörauftrag auf der Quelle, nicht am Raster.
    auftrag: s(r.auftrag) || s(pflicht?.auftrag),
    spalten: a(r.spalten).map(s).filter(Boolean),
    zeilen: Number(r.zeilen) || 0,
    beispielzeile: a(r.beispielzeile).map(s).filter(Boolean),
  }
}

function toHeftV42(sit: SituationJson, prinzip: PrinzipJson | null): WerkstattHeftV42 {
  const hp = sit.handlungsprodukt ?? {}
  const ph = prinzip?.herausforderungen?.[sit.buchstabe]
  const pflicht = a(sit.quellen).find((q) => q.rolle === 'pflicht')
  const v = pflicht?.verortung
  const kasten = sit.kasten_s4
  const verfuegbar = a(sit.spuren_verfuegbar)
  return {
    spur: (sit.spur ?? verfuegbar[0] ?? 'ohne_medien') as SpurKey,
    spurenVerfuegbar: verfuegbar,
    konfliktart: s(ph?.konfliktart),
    produktTyp: s(ph?.handlungsprodukt_typ),
    leitfragen: a(sit.leitfragen).map((l) => ({
      nr: Number(l.nr) || 0,
      text: s(l.text),
      bloom: s(l.bloom),
      liefert: s(l.liefert),
      polTyp: s(l.pol_typ),
      strategien: a(l.scaffolding?.strategien).map(s).filter(Boolean),
      satzanfaenge: a(l.scaffolding?.satzanfaenge).map(s).filter(Boolean),
      insProdukt: s(l.scaffolding?.produkt),
    })),
    raster: rasterVon(sit),
    // Von der Karte nur Titel, Herausgeber, Datum und Ausschnitt — kein Kurzbeschrieb,
    // kein Link, nie ein Volltext.
    quelle: pflicht
      ? {
          titel: s(pflicht.titel),
          herausgeber: s(pflicht.herausgeber),
          datum: s(pflicht.datum),
          ausschnitt: s(v?.absaetze) || [s(v?.von), s(v?.bis)].filter(Boolean).join('–'),
        }
      : null,
    kasten: kasten
      ? {
          typ: s(kasten.typ),
          titel: s(kasten.titel),
          spalten: a(kasten.spalten).map(s).filter(Boolean),
          hinweis: s(kasten.hinweis),
        }
      : null,
    feedbackKriterien: a(sit.feedback_kriterien).map((f) => ({
      name: s(f.kn_kriterium),
      dimension: s(f.dimension),
      indikator: s(f.indikator_produkt),
    })),
    glossar: a(sit.glossar)
      .map((g) => ({ begriff: s(g.begriff), definition: s(g.definition) }))
      .filter((g) => g.begriff),
    beispielbild: hp.beispielbild
      ? { titel: s(hp.beispielbild.titel), bloecke: a(hp.beispielbild.bloecke).map((b) => s(b.titel)).filter(Boolean) }
      : null,
    abgaben: a(hp.abgaben).map(s).filter(Boolean),
    mindmap: {
      zentrum: s(sit.mindmap_zentrum),
      aeste: a(sit.mindmap_aeste).map((x) => ({
        titel: s(x.titel),
        punkte: a(x.punkte).map(s).filter(Boolean),
        transfer: !!x.transfer,
      })),
    },
    abschluss: {
      quercheck: a(sit.abschluss?.quercheck).map(s).filter(Boolean),
      mitnahme: a(sit.abschluss?.mitnahme).map(s).filter(Boolean),
    },
    methoden: a(sit.methoden)
      .map((m) => ({ name: s(m.name), fuer: s(m.fuer) }))
      .filter((m) => m.name),
  }
}

/** Die Einheits-Ebene des v4.2-Vertrags. Liest nur vorhandene Felder, erfindet keine. */
function toV42(set: EinheitFullSet, hfs: WerkstattHf[]): WerkstattV42 {
  const p = set.prinzip
  const ga = set.set?.gemeinsamer_auftrag
  const spec = (p?.hybrid_situation_spec ?? {}) as NonNullable<PrinzipJson['hybrid_situation_spec']> & {
    persona_neutral?: string
  }
  const ausschluss = a(ga?.kontext_ausschluss).map(s).filter(Boolean)
  // Die Einträge von `kontext_ausschluss` tragen ihre Herkunft in Klammern: «… (Heft A)», «… (KN)».
  const begriffeVon = (marke: string): string => {
    const e = ausschluss.find((x) => x.endsWith(`(${marke})`))
    return e ? e.slice(0, e.length - marke.length - 2).trim() : ''
  }
  const spur = (set.spur ?? hfs[0]?.v42?.spur ?? 'ohne_medien') as SpurKey
  const schritte = a(ga?.schritte)
  const produkte = a(ga?.produkte).length
    ? a(ga?.produkte).map((x) => {
        const st = schritte[Number(x.schritt) - 1]
        return [s(st?.label), s(x.modus) && `(${s(x.modus)})`, s(st?.hint) && `— ${s(st?.hint)}`]
          .filter(Boolean)
          .join(' ')
      })
    : a(ga?.abgaben).map(s)
  const persona = set.kn?.hybrid_situation?.persona ?? set.hf_A?.persona ?? set.hf_B?.persona
  const ohne = set.spur_varianten?.ohne_medien
  return {
    spur,
    einspurig: hfs
      .filter((h) => h.v42 && h.v42.spurenVerfuegbar.length === 1)
      .map((h) => ({ heft: h.buchstabe, spur: h.v42!.spur })),
    zentrum: s(p?.mindmap_zentrum_kurz) || s(hfs[0]?.v42?.mindmap.zentrum),
    kriterienVerteilung: Object.entries(p?.kn_kriterien_verteilung ?? {}).map(([heft, kriterien]) => ({
      heft,
      kriterien: a(kriterien).map(s).filter(Boolean),
    })),
    personaNeutral:
      // Die Klammer am Schluss («Stufe 2: …») ist eine Notiz der Skill, keine Angabe zur Persona.
      s(spec.persona_neutral).replace(/\s*\([^)]*\)\s*$/, '') || [s(persona?.beruf), s(persona?.betrieb), s(persona?.ort)].filter(Boolean).join(' · '),
    kn: {
      titel: s(set.kn?.hybrid_situation?.titel),
      fallBegriffe: unique([
        ...a(spec.fall_ausschluss_hefte_und_auftrag).map(s),
        ...begriffeVon('KN').split(',').map(s),
      ]),
    },
    auftrag: ga
      ? {
          titel: s(ga.titel),
          lebensbereich: s(ga.lebensbereich),
          situation: s(ga.situation_text),
          leitfrage: s(ga.leitfrage),
          tradeOff: s(ga.mehrdeutigkeit?.trade_off),
          sprachmodi: a(ga.sprachmodi).map(s).filter(Boolean),
          produkte: produkte.filter(Boolean),
          kontextAusschluss: ausschluss,
        }
      : null,
    verbraucht: [
      ...hfs.map((h) => ({
        wo: `Heft ${h.buchstabe}`,
        titel: h.titel,
        lebensbereich: '',
        begriffe: begriffeVon(`Heft ${h.buchstabe}`),
      })),
      ...(ga
        ? [{ wo: 'Gemeinsamer Auftrag', titel: s(ga.titel), lebensbereich: s(ga.lebensbereich), begriffe: '' }]
        : []),
    ],
    rubrik: a(set.kn?.rubrik_shared?.kriterien).map((k) => ({
      name: s(k.name),
      dimension: s(k.dimension),
      stufen: a(k.stufen).map(s).filter(Boolean),
    })),
    musterOhneMedien: ([ohne?.hf_A, ohne?.hf_B].filter(Boolean) as SituationJson[])
      .filter((h) => h.spur === 'ohne_medien')
      .map((h) => {
        const r = rasterVon(h)
        const k = h.kasten_s4
        return {
          heft: h.buchstabe,
          abschnitt: r?.abschnitt ?? '',
          auftrag: r?.auftrag ?? '',
          spalten: r?.spalten ?? [],
          beispielzeile: r?.beispielzeile ?? [],
          denkhilfe:
            k?.typ === 'denkhilfe' ? { spalten: a(k.spalten).map(s).filter(Boolean), hinweis: s(k.hinweis) } : null,
        }
      })
      .filter((m) => m.spalten.length),
  }
}

/** Kapitel der Einheit. Bei v4.2 sind es Objekte (`ref`, `titel`, `seiten`), keine Strings. */
function kapitelV42(p: PrinzipJson | null): string[] {
  const chapters = a((p as { quellen_anker?: { chapters?: unknown[] } } | null)?.quellen_anker?.chapters)
  return unique(
    chapters.map((c) => {
      if (typeof c === 'string') return c
      const o = (c ?? {}) as { ref?: string; titel?: string; seiten?: string }
      return [s(o.ref), s(o.titel)].filter(Boolean).join(' ') + (s(o.seiten) ? ` (${s(o.seiten)})` : '')
    })
  )
}

function toHf(sit: SituationJson | null, letter: HfLetter, prinzip?: PrinzipJson | null): WerkstattHf | null {
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
    ...(sit.template === TEMPLATE_V42 ? { v42: toHeftV42(sit, prinzip ?? null) } : {}),
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
    toHf(set.hf_A, 'A', p),
    toHf(set.hf_B, 'B', p),
    toHf(set.hf_C, 'C', p),
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

  const basis: WerkstattKontext = {
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

  // Alles Neue hängt am v4.2-Format (E29). Eine Bestandseinheit verlässt die Funktion hier —
  // mit genau dem Objekt, das sie immer bekommen hat.
  const istV42 = !!set.spur_varianten || hfs.some((h) => h.v42)
  if (!istV42) return basis

  // v4.2 kennt keine Persona-Pools und keine Transfer-Aufgabe des Sets: Die Persona ist
  // neutral, verbraucht werden Fall und Lebensbereich. Die Felder des alten Formats bleiben
  // darum leer, statt aus der neutralen Persona einen Schein-Pool zu bilden.
  return {
    ...basis,
    personaVerbraucht: { berufe: [], orte: [] },
    personaKnReserviert: { berufe: [], orte: [] },
    kapitel: kapitelV42(p),
    v42: toV42(set, hfs),
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
