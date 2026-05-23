// Shared types for the Einheiten workflow (renderer + begleiter port).
// Mirrors the JSON shape coming out of src/data/einheiten/<slug>/*.json.
// Permissive on purpose — the JSONs are authored by humans and the renderer
// already guards every field with optional chaining.

export interface Persona {
  beruf?: string
  betrieb?: string
  ort?: string
}

export interface SubFacette {
  buchstabe?: string
  label?: string
}

export interface NrlpRef {
  nr?: string
  nr_primary?: string[]
  lebensbezug?: string
  themen?: string[]
  gesellschaft?: { aspekt: string; iteration?: string }[]
  sprachmodi?: string[]
  sk?: number[]
}

export interface SituationJson {
  id?: string
  modul?: string
  modul_titel?: string
  lehrgang?: string
  situation: 'A' | 'B' | 'C'
  sit_farbe?: string
  sit_farbe_light?: string
  sit_farbe_mid?: string
  titel?: string
  emotion_tag?: string
  nrlp?: NrlpRef
  persona?: Persona
  sub_facette?: SubFacette
  situation_text?: string
  zahlen_tabelle?: { label: string; wert: string }[]
  leitfrage?: string
  mehrdeutigkeit?: { explizit?: boolean; trade_off?: string }
  wochen_plan?: { label: string; text: string }[]
  bewertungsraster?: { produkt: string; abgabe: string; gewicht: number; kriterium: string }[]
  quellen_anker?: { ref: string; titel: string; seiten: string }[]
  leitfragen_intro?: string
  leitfragen?: { nr: number; text: string; bloom?: string; knoten_ref?: string; feld_hoehe_mm?: number }[]
  mindmap_zentrum?: string
  mindmap_aeste?: { titel: string; optional?: boolean; punkte?: string[] }[]
  handlungsprodukt?: {
    format?: string
    titel?: string
    beschreibung?: string
    schritte?: { label: string; hint: string }[]
    schreib_label?: string
  }
  reflexion_fragen?: { nr: string | number; text: string; sub?: string; feld_hoehe_mm?: number }[]
  dekontextualisierung?: { frage?: string }
}

export interface SetJson {
  id?: string
  konzept_progression?: { position: number | string; konzept: string }[]
  austausch_phase?: {
    format?: string
    dauer_min?: number | string
    gruppenarbeit_jigsaw?: { runde_1?: string; runde_2?: string; runde_3?: string }
    einzelarbeit_plenum?: string
  }
  dekontextualisierungs_aufgabe?: {
    auftrag?: string
    format?: string
    gewicht_prozent?: number
    abgabe?: string
  }
}

export interface KnTyp {
  typ: 'fachgespraech' | 'mini_case_schriftlich' | 'werkschau_transfer' | string
  label: string
  format?: string
  ablauf?: string[]
  fragestruktur?: { nr: number; frage: string; typ?: string; k_stufe?: number }[]
  aufgaben?: { nr: number; aufgabe: string; typ?: string; k_stufe?: number }[]
  reflexionsfragen?: string[]
  optional_praesentation?: string
  sk?: number[]
  aspekte?: string[]
}

export interface KnJson {
  id?: string
  kompetenz_nr?: string
  topic_slug?: string
  kern_kompetenzversprechen?: string
  dominanter_aspekt?: string
  mehrdeutigkeits_pflicht?: string
  hybrid_situation?: {
    titel?: string
    persona?: Persona
    emotion_tag?: string
    text?: string
    leitfrage?: string
    aktivierte_trade_offs?: string[]
    alignment_note?: {
      subfacetten_mapping?: { sit_letter: string; scene_element: string }[]
    }
  }
  kn_typen?: KnTyp[]
  rubrik_shared?: {
    kriterien?: { name: string; dimension: 'SuK' | 'Ges' | string; stufen?: string[] }[]
    niveaubaender?: { label: string; definition: string }[]
  }
}

export interface PrinzipJson {
  id?: string
  kern_kompetenzversprechen?: string
  sub_facetten?: Record<string, { facette: string; konfliktart: string }>
  zirkularitaet?: {
    r1_aktuell?: string
    r2_voraussicht?: string
    r3_voraussicht?: string
  }
}

export interface BegleiterMeta {
  titel?: string
  untertitel?: string
  kompetenz?: string
  kompetenz_slug?: string
  beruf?: string
  thema?: string
  fach?: string
  autor?: string
  stand?: string
  version?: string
  dateiname?: string
  [k: string]: string | undefined
}

export interface EinheitIndexEntry {
  id: string
  kompetenz_nr: string
  slug: string
  titel: string
  lehrgang: string
  modul: string | null
  modul_titel: string | null
  thema_nr: number | null
  themen: string[]
  aspekte: string[]
  dominanter_aspekt: string | null
  sk: number[]
  sprachmodi: string[]
  situationen: string[]
  sit_titel: { A: string | null; B: string | null; C: string | null }
  hat_kn: boolean
  hat_begleiter: boolean
  hybrid_situation_titel: string | null
  kn_typen: { typ: string; label: string }[]
  bundle_dateien: number
}

export interface EinheitFullSet {
  id: string
  sit_A: SituationJson | null
  sit_B: SituationJson | null
  sit_C: SituationJson | null
  kn: KnJson | null
  prinzip: PrinzipJson | null
  set: SetJson | null
  begleiter: { raw: string; meta: BegleiterMeta } | null
}
