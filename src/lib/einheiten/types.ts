// Shared types for the Einheiten workflow (renderer + begleiter port).
// Mirrors the JSON shape coming out of src/data/einheiten/<slug>/*.json.
// Permissive on purpose — the JSONs are authored by humans and the renderer
// already guards every field with optional chaining.

export interface Persona {
  beruf?: string
  betrieb?: string
  ort?: string
}

export interface SubHerausforderung {
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
  // Cluster 1 — machine-readable Lehrplan-Bezüge (additive, see references/sprachmodus-ids.md)
  sprachmodus_ids?: string[]        // parallel to sprachmodi[]; e.g. ["SM3","SM8"]
  kompetenz_id?: string             // explicit alias of nr, e.g. "1.1.1"
  lebensbezug_id?: string           // explicit alias of lebensbezug, e.g. "1.1"
  kompetenz_text?: string           // Klartext Kompetenz-Satz (RLP) — primäre Kompetenz
  lebensbezug_text?: string         // Klartext Lebensbezug-Satz (RLP)
  // Verbatim aus nrlp_3j/4j.json aufgelöste Kompetenz-Sätze für ALLE nr_primary,
  // SSR-seitig via enrichKompetenzen() befüllt (src/lib/einheiten/kompetenz-text.ts).
  kompetenzen?: { nr: string; text: string }[]
}

export interface SituationJson {
  id?: string
  modul?: string
  modul_titel?: string
  lehrgang?: string
  buchstabe: 'A' | 'B' | 'C'
  sit_farbe?: string
  sit_farbe_light?: string
  sit_farbe_mid?: string
  titel?: string
  emotion_tag?: string
  nrlp?: NrlpRef
  persona?: Persona
  herausforderung?: SubHerausforderung
  situation_text?: string
  zahlen_tabelle?: { label: string; wert: string }[]
  leitfrage?: string
  mehrdeutigkeit?: { explizit?: boolean; trade_off?: string; hint?: string }
  wochen_plan?: { label: string; text: string; aktiv?: boolean }[]
  // C1 — relaxed: abgabe/gewicht/kriterium now optional + unrendered; NEW vollstaendig_wenn drives the Checkliste
  bewertungsraster?: { produkt: string; abgabe?: string; gewicht?: number; kriterium?: string; vollstaendig_wenn?: string[] }[]
  quellen_anker?: { ref: string; titel: string; seiten?: string; unterueberschrift?: string; nugget_ref?: string; fuer_leitfrage?: number[] }[]
  leitfragen_intro?: string
  leitfragen?: { nr: number; text: string; bloom?: string; knoten_ref?: string; feld_hoehe_mm?: number }[]
  mindmap_zentrum?: string
  mindmap_aeste?: { titel: string; optional?: boolean; punkte?: string[] }[]
  handlungsprodukt?: {
    format?: string
    format_detail?: string
    titel?: string
    abgaben?: string[]          // Cluster 6 — konkrete Abgabe(n) fuer den "Das liefern Sie ab"-Block (additiv)
    beschreibung?: string
    schritte?: { label: string; hint: string }[]
    schreib_label?: string
    schreib_note?: string
    // C6 — language scaffolds for the Handlungsprodukt (additive); aligned to HP format + output Sprachmodus
    scaffolding?: { satzanfaenge?: string[]; strategien?: string[]; struktur?: string[] }
  }
  // C6 — progress/quality criteria (present in data, now typed; additive). scaffold_90/100 = differentiation.
  lernfortschritt?: {
    kriterien?: { kriterium: string; indikator: string; gewicht_prozent?: number }[]
    scaffold_90?: string
    scaffold_100?: string
  }
  reflexion_fragen?: { nr: string | number; text: string; sub?: string | null; feld_hoehe_mm?: number }[]
  dekontextualisierung?: { frage?: string; ziel?: string }
  prinzip_ref?: string
  prinzip_handoff?: {
    kernkonzept?: string
    lehrmittel_anker?: string
    kn_aktivierung?: string
    transfer_check?: string
  }
  sk_anker?: { sk: number; wo: string }[]
}

export interface SetJson {
  id?: string
  prinzip_ref?: string
  kn_ref?: string
  herausforderungen?: string[]
  konzept_progression?: { position: number | string; herausforderung?: string; konzept: string }[]
  austausch_phase?: {
    format?: string
    dauer_min?: number | string
    gruppenarbeit_jigsaw?: { runde_1?: string; runde_2?: string; runde_3?: string }
    einzelarbeit_plenum?: string
    // C8 — structured closure variants (keep old keys for back-compat; renderer reads new ?? old)
    gruppenpuzzle?: { runde_1?: string; runde_2?: string; runde_3?: string }  // alias of gruppenarbeit_jigsaw
    plenum?: string            // alias of einzelarbeit_plenum
    einzelauftrag?: string     // NEW individual-closure prompt
  }
  dekontextualisierungs_aufgabe?: {
    auftrag?: string
    format?: string
    ziel?: string
    gewicht_prozent?: number
    abgabe?: string
  }
  // Cluster 3 — optional per-unit override; normally derived from sit_*.nrlp.sprachmodus_ids
  sprachfoerderung?: { sprachmodus_ids?: string[]; hinweis_hoerverstaendnis?: string }
  // Sichtbarkeit (KT1-only Drafts). Beide optional; fehlend = live für alle.
  status?: 'entwurf' | 'publiziert'
  entwurf_komponenten?: string[]   // z. B. ['ki-fluency'] → einzelne Bausteine nur KT1
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
  lehrgang?: string
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
    definition_kurz?: string    // SuS: kurze Erklärung "Hybrid-Herausforderung" bei Erstverwendung
    definition_lang?: string    // LP: ausführlichere Erklärung
    aktivierte_trade_offs?: string[]
    alignment_note?: {
      herausforderungen_mapping?: { hf_letter: string; scene_element: string }[]
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
  modul?: string
  kompetenz_nr?: string
  lehrgang?: string
  topic_slug?: string
  kern_kompetenzversprechen?: string
  bloom_zielprofil?: Record<string, string>
  herausforderungen?: Record<string, { herausforderung: string; konfliktart: string; handlungsprodukt_typ?: string; transferrable?: boolean }>
  sk_pro_situation?: Record<string, number[]>
  sk_schnittmenge_kn?: { primary: number[] }
  aspekte?: Record<string, string>
  mehrdeutigkeits_architektur?: { trade_off_raum: string[]; verbindlich?: string }
  dekontextualisierungs_anker?: { anker_statement?: string; transferfeld?: string }
  zirkularitaet?: {
    r1_aktuell?: string
    r2_voraussicht?: string
    r3_voraussicht?: string
  }
  persona_pool_units?: { berufe: string[]; orte: string[] }
  persona_pool_kn_neu?: { berufe: string[]; orte: string[] }
  hybrid_situation_spec?: {
    max_woerter?: number
    perspektive?: string
    must_activate_trade_offs_min?: number
    must_combine_herausforderungen?: string[]
    lehrjahr_constraint?: string
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

// ---------------------------------------------------------------------------
// KI-Toolbox layer (additive) — complementary to the unit, see
// docs/handoff-ki-renderer-teil-a.md. Permissive on purpose (all optional).
// Three separate per-unit files: ki.json, lernprompt.json, lernbegleiter.json.
// ---------------------------------------------------------------------------

export interface KiAssignment {
  key: 'ki_1' | 'ki_2' | string
  pattern?: string
  titel?: string
  ziel?: string
  bezug?: string
  auftrag?: string
  prompt_strategie?: string[]
  ki_frei_vorher?: string
  schritte?: string[]
  guetekriterien?: { kriterium: string; indikator: string }[]
  reflexion?: string[]
}
export interface KiJson {
  id?: string
  modul_titel?: string
  thema?: string
  lehrgang?: string
  timing?: string
  nrlp_anker?: {
    thema_text?: string
    gesellschaft_details?: { aspekt: string; detail: string; kompetenz_anker?: string }[]
    schluesselkompetenzen_texte?: string[]
  }
  ki_leitfragen?: { offen?: string; kritisch?: string; vergleichend?: string; urteilend?: string }
  assignments?: KiAssignment[]
}

export interface LernpromptTechnik {
  key?: string
  titel?: string
  erklaerung?: string
  thema_bezug?: string
  beispiel_basis?: string
  beispiel_fortgeschritten?: string
  warnung?: string
  baukasten?: { rolle?: string[]; kontext?: string[]; aufgabe?: string[]; format?: string[] }
}
export interface LernpromptStacking {
  technik_keys?: string[]
  logik_und_ziel?: string
  prompt_1?: string
  prompt_2?: string
}
export interface LernpromptJson {
  id?: string
  lernprompt?: {
    version?: string
    thema_kontext?: string
    techniken?: LernpromptTechnik[]
    stacking_seite_1?: LernpromptStacking
    stacking_seite_2?: LernpromptStacking
    prompt_vorlage?: string
  }
}

export interface LernbegleiterStrategie {
  key?: string
  technik?: string
  wann?: string
  prompt_basis?: string
  prompt_fortgeschritten?: string
  warnung?: string
}
export interface LernbegleiterJson {
  id?: string
  lernbegleiter?: {
    version?: string
    titel?: string
    ziel?: string
    kompetenzversprechen?: string
    ki_frei_zuerst?: { auftrag?: string; selbsteinschaetzung?: string[] }
    strategie_karten?: LernbegleiterStrategie[]
    kn_typ_tracks?: { typ?: string; label?: string; uebungsfokus?: string; prompt?: string }[]
    rubrik_fokus?: { dimension?: string; kriterien?: string[]; so_uebst_du?: string }[]
    integritaet_warnung?: string
    selbstcheck?: string[]
  }
}

export interface EinheitIndexEntry {
  id: string
  /** Sichtbarkeit der ganzen Einheit. Fehlend/`publiziert` = live; `entwurf` = nur KT1. */
  status?: 'entwurf' | 'publiziert'
  /** Bausteine, die (bei sonst live Einheit) nur KT1 sieht. Gruppen-Keys, z. B. `ki-fluency`. */
  entwurf_komponenten?: string[]
  kompetenz_nr: string
  /** B1 — alle real abgedeckten Kompetenzen (Union der nrlp.nr_primary über A/B/C). */
  abgedeckte_kompetenzen: string[]
  slug: string
  titel: string
  /** Anzeige-Titel der Einheit (aus set.json `einheit_titel`), z. B. "Im Konflikt kommunizieren". */
  einheit_titel: string
  lehrgang: string
  modul: string | null
  modul_titel: string | null
  thema_nr: number | null
  themen: string[]
  aspekte: string[]
  dominanter_aspekt: string | null
  sk: number[]
  sprachmodi: string[]
  herausforderungen: string[]
  hf_titel: { A: string | null; B: string | null; C: string | null }
  hat_kn: boolean
  hat_begleiter: boolean
  hat_ki: boolean
  hat_lernprompt: boolean
  hat_lernbegleiter: boolean
  hybrid_situation_titel: string | null
  kn_typen: { typ: string; label: string }[]
  bundle_dateien: number
}

export interface DossierJson {
  id: string; kompetenz_nr?: string; sprachniveau?: string
  nuggets?: any[]
  sprachmodi_scaffolds?: any[]
  transfer_wissensblatt?: any
  glossar?: any[]
}

export interface EinheitFullSet {
  id: string
  hf_A: SituationJson | null
  hf_B: SituationJson | null
  hf_C: SituationJson | null
  kn: KnJson | null
  prinzip: PrinzipJson | null
  set: SetJson | null
  begleiter: { raw: string; meta: BegleiterMeta } | null
  /** KI-Toolbox «Lies mich!» — teacher-facing didactic guide (markdown, same shape as begleiter). */
  kiLiesmich: { raw: string; meta: BegleiterMeta } | null
  ki: KiJson | null
  lernprompt: LernpromptJson | null
  lernbegleiter: LernbegleiterJson | null
  dossier: DossierJson | null
}
