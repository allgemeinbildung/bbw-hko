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

/**
 * Eine Karte der Methodenkartei (src/data/methoden/<id>.json) — plattformweit und
 * einheitenunabhängig. Sie beschreibt ein Werkzeug ein einziges Mal und wird von jeder
 * Herausforderung referenziert, die es braucht.
 *
 * Das `beispiel` hat bewusst ein festes, neutrales Sujet: Die Karte weiss nicht, in
 * welcher Einheit sie landet. Das ist kein Mangel, sondern das Verfahren des Lehrmittels
 * selbst — dessen Muster-Leserbrief handelt immer von Alkohol am Steuer und taugt
 * trotzdem als Vorlage für jedes Thema.
 */
export interface MethodeKarte {
  id: string
  name: string
  quelle: 'lehrmittel' | 'hko'
  kap?: string
  seiten?: string
  fuer?: string
  /** nur `lehrmittel`: was im Kapitel steht, in zwei Sätzen. Ersetzt es nicht. */
  lesen?: string
  /** nur `hko`: die Karte muss vollständig sein, dahinter kommt kein Kapitel. */
  schritte?: string[]
  ankommt?: string
  /** Musterbeispiel — das, was ein Lehrmittelkapitel mit seinem Muster leistet. */
  beispiel?: string[]
  /** Beobachtbares Symptom plus Abhilfe — anders als `ankommt`, das die Entscheidung nennt. */
  fehler?: string
  merk?: string
}

/** Was in herausforderung_*.json steht: Kürzel plus die einheitenspezifische Übertragung. */
export interface MethodeRef {
  ref: string
  /** Wofür in genau dieser Abgabe — überschreibt das generische `fuer` der Karte. */
  fuer?: string
  /** Nur bei Lehrmittel-Karten: was mit dem Kapitel in dieser Abgabe zu tun ist. */
  tun?: string
  /** Ausnahme: eigenes Musterbeispiel statt des Karten-Beispiels. */
  beispiel?: string[]
}

/** Karte + Übertragung, wie sie die Renderer sehen (Ergebnis von resolveMethoden). */
export interface Methode extends MethodeKarte {
  tun?: string
}

// ---------------------------------------------------------------------------
// Heft v4.2 (template `heft_8page_v42`) — Leitfaden docs/upgrade-v4.2 §11.
// Alles additiv und optional: Kein Feld hier wird gelesen, solange eine
// Herausforderung nicht `template: "heft_8page_v42"` trägt.
// ---------------------------------------------------------------------------

/** Wert von `SituationJson.template`, an dem aller v4.2-Code hängt. */
export const TEMPLATE_V42 = 'heft_8page_v42'

/** Die zwei Spuren eines Hefts. `ohne_medien` = traditionell (Methoden + Scaffolding). */
export type SpurKey = 'ohne_medien' | 'mit_medien'

/** Pol-Typ von LF4 (Leitfaden §6.1). */
export type PolTyp =
  | 'lehrmittel_quelle'
  | 'position_gegenposition'
  | 'modell_eigener_fall'
  | 'recht_praxis'
  | 'quelle_quelle'

/** Raster als Antwortfeld von LF3 (Seite 3). Letzte Spalte ist immer «→ Begriff». */
export interface RasterSpec {
  /** Medien-Spur: ID der Pflichtquelle (`src/data/quellen/<id>.json`). */
  quelle_ref?: string
  /** Spur ohne Medien: Lehrmittel-Abschnitt, am Buch verifiziert («Kap. 8.2 | S. 199-202»). */
  knoten_ref?: string
  /** Spur ohne Medien: Leseauftrag. In der Medien-Spur steht er auf der Pflichtquelle. */
  auftrag?: string
  spalten: string[]
  zeilen: number
  /** Nur Spur ohne Medien: vorausgefüllte erste Zeile, parallel zu `spalten`. */
  beispielzeile?: string[]
}

/** Erwartungshorizont für LF4 und den gemeinsamen Auftrag — nur Lehrperson, nie im Heft. */
export interface Erwartungshorizont {
  gut_wenn?: string[]
  beispiel_pol_1?: string
  beispiel_pol_2?: string
  tragfaehig?: string
  nicht_tragfaehig?: string
}

export interface LeitfrageLoesung {
  kern?: string
  /** Bei LF4 darf `zeilen` fehlen — dann trägt `erwartungshorizont` die Lösung. */
  zeilen?: { label?: string; text: string; quelle?: string }[]
  /** v4.2: Bindung der Lösung an Quelle (ID) oder Lehrmittel-Abschnitt. */
  quelle_ref?: string
  /** v4.2: Datum (JJJJ-MM-TT), an dem die Lösung gegen die Quelle geprüft wurde. */
  quelle_stand?: string
  erwartungshorizont?: Erwartungshorizont
  /** v4.2 (E19), nur LF3: das ausgefüllte Raster — eine Zeile je Rasterzeile, eine Zelle je Spalte. */
  raster_zeilen?: string[][]
  /** v4.2 (E19), nur LF3: ein möglicher Befund in zwei bis drei Sätzen. */
  befund?: string
}

export interface Leitfrage {
  nr: number
  text: string
  bloom?: string
  knoten_ref?: string
  /**
   * Optional: benennt nominal (3–7 Wörter, ohne Verb), welchen Baustein des
   * Handlungsprodukts diese Leitfrage liefert. Rein additiv — fehlt das Feld,
   * rendern HTML und DOCX exakt wie bisher.
   */
  liefert?: string
  /**
   * Optional: Schreibhilfe für genau diese Leitfrage, gerendert als schmale
   * rechte Spalte neben Frage und Schreibfeld (HTML wie DOCX, in beiden Modi).
   * Bewusst dasselbe Vokabular wie `handlungsprodukt.scaffolding` — dort für
   * das ganze Produkt, hier für den einen Denkschritt.
   * `strategien` = «So gehen Sie vor» (knappe Liste), `satzanfaenge` =
   * «Satzanfänge» (kursiv, in Guillemets), `produkt` = «Ins Produkt» (ein Satz).
   * Rein additiv — fehlt das Feld, rendern HTML und DOCX exakt wie bisher.
   */
  scaffolding?: { strategien?: string[]; satzanfaenge?: string[]; produkt?: string }
  feld_hoehe_mm?: number
  /**
   * Lehrpersonen-Lösung zu dieser Leitfrage — speist ausschliesslich die Unterfolie
   * «Lösung der Leitfragen» im Unterrichtsdeck. Bewusst NICHT in DocS gerendert:
   * der Schülerbogen bleibt unverändert, das Feld darf nie im ZIP für Lernende landen.
   * `kern` ist die kurze Zeile auf dem Aufklapp-Titel, `zeilen` der Massstab selbst.
   */
  loesung?: LeitfrageLoesung
  /** v4.2: `raster` nur bei LF3. Fehlend = `schreibfeld`. */
  antwortform?: 'schreibfeld' | 'raster'
  /** v4.2: nur bei `antwortform: 'raster'`. */
  raster?: RasterSpec
  /** v4.2: nur LF4. */
  pol_typ?: PolTyp
}

/**
 * Eine Karte der Quellenkartei (`src/data/quellen/<id>.json`) — Leitfaden §11.4.
 * Das Repo ist öffentlich: Die Karte trägt nur Metadaten und einen eigenen
 * Kurzbeschrieb. Transkripte und Volltexte liegen im privaten Archiv (`archiv_ref`).
 */
export interface QuelleKarte {
  id: string
  typ: 'artikel' | 'grafik' | 'video' | 'audio' | 'rechtstext' | 'webseite' | string
  /** Titel, wie er im Heft gedruckt wird (Budget §3.1). Wenn gekürzt: Original in `titel_original`. */
  titel: string
  /** Wörtlicher Titel der Quelle, falls `titel` für den Druck gekürzt ist. */
  titel_original?: string
  herausgeber: string
  /** Publikationsdatum JJJJ-MM-TT (oder JJJJ, wenn die Quelle nur das Jahr nennt). */
  datum: string
  url: string
  sprachmodus?: string
  /** Welcher Ausschnitt gilt: Absätze/Grafik (Text) oder Zeitmarken mm:ss (Audio/Video). */
  verortung?: { absaetze?: string; von?: string; bis?: string }
  /** Länge des Ausschnitts, gemessen (Audio/Video). */
  dauer_sek?: number
  /** Länge des Ausschnitts, gemessen (Text). */
  woerter?: number
  kurzbeschrieb: string
  /** Datum JJJJ-MM-TT, an dem Abruf, Titel, Datum und Sachlage geprüft wurden. */
  sachlage_geprueft: string
  /** Ordner im privaten Archiv, relativ zu `_lab/quellen-archiv/bbw-hko/` — nie ein Volltext. */
  archiv_ref?: string
  /** ID der Ersatzquelle. Nur gültig mit gleichem Auftrag und Raster. */
  ersatz_ref?: string | null
  lizenz_hinweis?: string
  /** `true` wäre ein Fallmaterial — in der Kartei immer `false`. */
  konstruiert: boolean
  /** SRF: URN des Beitrags bzw. Segments (über `media_composition` bestätigt). */
  urn?: string
}

/** Was in `spuren.mit_medien.quellen[]` auf der Platte steht: Kürzel + Einsatz im Heft. */
export interface QuelleRef {
  ref: string
  rolle: 'pflicht' | 'vertiefung'
  fuer_leitfrage?: number[]
  /** Nur Pflichtquelle: Lese-/Seh-/Hörauftrag über dem Raster (Seite 3). */
  auftrag?: string
  /** Nur Pflichtquelle: Spiegel von `leitfragen[LF3].raster` (Spalten, Zeilen). */
  raster?: Pick<RasterSpec, 'spalten' | 'zeilen'>
  /** Nur Vertiefung: die eine Leitfrage auf der Karte (Seite 4). */
  leitfrage_vertiefung?: string
  /** v4.2 (E19), nur Vertiefung und nur Lehrperson: was eine tragfähige Antwort enthält. */
  erwartung?: string
}

/** Karte + Einsatz, wie sie die Renderer sehen (Ergebnis von `resolveQuellen`). */
export interface Quelle extends QuelleKarte, Omit<QuelleRef, 'ref'> {
  /** Aufgelöste Ersatzquelle (`ersatz_ref`), falls vorhanden. */
  ersatz?: QuelleKarte
}

/** Kasten auf Seite 4: Vertiefung (Medien-Spur) oder Denkhilfe (Spur ohne Medien). */
export interface KastenS4 {
  typ: 'vertiefung' | 'denkhilfe'
  titel: string
  /** Nur Denkhilfe: 2–3 Spaltenköpfe der Tabelle. */
  spalten?: string[]
  hinweis?: string
  /** v4.2 (E19), nur Denkhilfe und nur Lehrperson: mögliche Einträge, eine Zelle je Spalte. */
  loesung_zeilen?: string[][]
}

/**
 * Eine Spur eines Hefts — nur das, was von der Spur abhängt (Leitfaden §4.1).
 * Der Kern (Situation, LF1, LF2, Produkt, Kriterien, Mindmap, Abschluss) steht
 * genau einmal auf der Herausforderung selbst und wird hier nie wiederholt.
 */
export interface Spur {
  /** Genau LF3 (`antwortform: 'raster'`) und LF4 (`pol_typ` gesetzt). */
  leitfragen: Leitfrage[]
  /**
   * Nur Medien-Spur. Zwei Stadien wie bei `methoden`: auf der Platte {@link QuelleRef},
   * nach `loadEinheit` {@link Quelle}. Der Typ beschreibt das aufgelöste Stadium.
   */
  quellen?: Quelle[]
  kasten_s4?: KastenS4
  /** Ersetzt den Platzhalter `{ ref: "__spur__" }` in `methoden` (Karte 2). */
  methoden_ref_rezeption?: MethodeRef
  /** Überschreibt `lernfortschritt.scaffold_90`. */
  scaffold_90?: string
}

/** Feedback-Kriterium eines Hefts oder des gemeinsamen Auftrags — Wortlaut aus `kn.rubrik_shared`. */
export interface FeedbackKriterium {
  kn_kriterium: string
  dimension: 'SuK' | 'Ges' | string
  /** Die vier Stufen, wörtlich aus dem KN. */
  stufen: string[]
  /** «Woran sehe ich das in meinem Produkt?» */
  indikator_produkt?: string
}

/** Gemeinsamer Auftrag (Auftragsbogen, 4 Seiten) — Leitfaden §7 und §11.2. In beiden Spuren identisch. */
export interface GemeinsamerAuftrag {
  titel?: string
  lebensbereich?: string
  persona?: Persona
  situation_text?: string
  zahlen_tabelle?: { label: string; wert: string }[]
  leitfrage?: string
  mehrdeutigkeit?: { trade_off?: string; hint?: string }
  aktivierte_trade_offs?: string[]
  sprachmodi?: string[]
  sozialform?: { zulaessig?: Array<'einzel' | 'partner' | 'gruppe' | string>; empfehlung?: string }
  auftrag?: string
  schritte?: { label: string; hint: string }[]
  abgaben?: string[]
  /**
   * Was der Auftrag aus den Heften braucht, mit Seitenverweis (Auftragsbogen A1).
   * Ersetzt den Verweis vom Heft auf den Auftrag: das Heft nennt keine Woche.
   */
  heft_bezug?: { heft: string; titel?: string; inhalte: string[] }[]
  /** Alle vier KN-Kriterien. */
  feedback_kriterien?: FeedbackKriterium[]
  kontext_ausschluss?: string[]
  /** Nur Lehrperson (Begleiter) — nie auf dem Auftragsbogen. */
  erwartungshorizont?: Erwartungshorizont
  /** Seitenfolge des Bogens; informativ, der Renderer kennt die vier Seiten. */
  bogen?: string[]
  /**
   * v4.2 (E25), optional: die zwei Produkte des Auftrags — `produkte[0]` belegt A2,
   * `produkte[1]` belegt A3 des Auftragsbogens. Fehlt das Feld, rendert der Bogen wie
   * bisher (Schritt 04 als Fläche, Schritt 05 als Sprechspur mit drei festen Stationen).
   */
  produkte?: AuftragProdukt[]
}

/** Ein Produkt des gemeinsamen Auftrags und die Seite, die es auf dem Auftragsbogen trägt (E25). */
export interface AuftragProdukt {
  /** Nummer des Schritts (1–5), dessen Produkt die Seite trägt; Titel und Hint kommen von dort. */
  schritt: number
  /** `flaeche`: freie Arbeitsfläche (Schriftliches, Bildliches) · `spur`: Stationen mit Schreibzeilen (Mündliches planen). */
  form: 'flaeche' | 'spur'
  /** Sprachmodus dieses Produkts, wörtlich einer aus `gemeinsamer_auftrag.sprachmodi`. */
  modus: string
  /** Nur `spur`: zwei bis vier Stationen in Ich-Form. */
  stationen?: string[]
  /** Nur `spur`: der Satz über den Stationen (wie vorgehen, wie abgeben). */
  hinweis?: string
  /** Nur `spur`, optional: Zieldauer («3–4 Minuten»). Ohne Angabe entfällt die Zeile «Ziel … · Probelauf». */
  dauer?: string
}

/** Seite 8 unten: Quer-Check und «Das nehme ich mit» (drei feste Zeilen). */
export interface Abschluss {
  quercheck?: string[]
  mitnahme?: string[]
  /** v4.2 (E19), nur Lehrperson: mögliche Lösung der Seite 8. */
  loesung?: AbschlussLoesung
}

/** Mögliche Lösung des Abschlusses (S. 8) — Begriffsnetz, Quer-Check, «Das nehme ich mit». */
export interface AbschlussLoesung {
  /** Beschriftete Verbindungen im Begriffsnetz; `von`/`nach` sind Knoten oder der Titel des Transfer-Felds. */
  verbindungen?: { von: string; nach: string; text: string }[]
  /** Eintrag im Feld «gilt auch bei …». */
  transfer?: string
  /** Begriffe für die zwei leeren Knoten, je Spur (aus dem Raster von S. 3). */
  eigene_knoten?: Partial<Record<SpurKey, string[]>>
  /** Antworten auf die Quer-Check-Fragen, gleiche Reihenfolge. */
  quercheck?: string[]
  /** Einträge zu den drei Zeilen «Das nehme ich mit», gleiche Reihenfolge. */
  mitnahme?: string[]
}

export interface Wochenplan {
  woche: number
  lektionen: number
  inhalt: string
}

export interface GlossarEintrag {
  begriff: string
  definition: string
  /** Woher der Begriff stammt: Lehrmittel, Quelle (S. 3) oder das Heft selbst. */
  herkunft?: 'lehrmittel' | 'quelle' | 'heft' | string
  heft?: 'A' | 'B' | string
  /** Nur in dieser Spur (Begriff aus deren Quelle). Fehlt das Feld, gilt der Eintrag in beiden. */
  spur?: SpurKey
}

/**
 * v4.2: ausgefülltes Handlungsprodukt als «Bild» — aus Daten gezeichnet (HTML und Word),
 * kein Pixelbild. Zwei Verwendungen am Handlungsprodukt: `beispielbild` (neutraler Fall,
 * im Heft auf S. 6) und `loesungsbild` (Lösung zum Fall des Hefts, nur Lehrperson).
 */
export interface ProduktBild {
  /** Kopfzeile des Blatts, nennt den Fall. */
  titel: string
  /** Nur Lehrperson: wann zeigen, worauf achten. Nie im Heft. */
  hinweis?: string
  /**
   * Markierungen. Die Position in der Liste bestimmt das Zeichen (Kontur statt Farbe):
   * 1. gefüllter Kreis, 2. leerer Kreis, 3. halb gefüllter Kreis.
   */
  legende?: { key: string; text: string }[]
  bloecke: ProduktBildBlock[]
}

/**
 * Ein Block des Blatts — genau eine von vier Arten: Liste (`eintraege`), Tabelle
 * (`kopf` + `zeilen`), Fliesstext (`text`, E26) oder Wechselrede (`wechsel`, E26).
 */
export interface ProduktBildBlock {
  titel: string
  eintraege?: { text: string; marke?: string; notiz?: string }[]
  kopf?: string[]
  zeilen?: { zellen: string[]; marke?: string; stark?: boolean }[]
  /** E26: Absätze in Schreibschrift — Brief, Statement, Kommentar, Leserbrief. */
  text?: string[]
  /** E26: Wechselrede — Gespräch, Diskussion, Interview; Sprecher links, Beitrag rechts. `marke` wie bei Listen. */
  wechsel?: { wer: string; text: string; marke?: string }[]
}

export interface SituationJson {
  id?: string
  /**
   * Layout-Variante des Bogens. Einziger Schalter für die Seitenaufteilung —
   * nie `status` oder ein anderes Feld dafür verwenden.
   * `default_4page_v2` (Default, auch wenn das Feld fehlt): Checkliste
   * Vollständigkeit steht auf Seite 1 (Cockpit).
   * `default_4page_v3`: Checkliste steht stattdessen auf der Selbstcheck-Seite,
   * vor der Reflexion.
   * `heft_8page_v42` ({@link TEMPLATE_V42}): Heft mit zwei Spuren, Seitenfolge
   * gemäss Leitfaden v4.2 §3. Einziger Schalter für allen v4.2-Renderer-Code.
   */
  template?: string
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
  /**
   * E3 — benennt, wozu das `leitfragen_intro` dient, und steuert damit, wo es steht.
   * Rein additiv: fehlt das Feld, bleibt das Intro der nackte Absatz auf Seite 2.
   * `vorbereitung` — Kasten auf Seite 1 (Cockpit); Seite 2 zeigt es dann nicht mehr.
   * `kontext` / `pfad` — bleibt auf Seite 2, bekommt nur eine Beschriftungszeile.
   */
  auftakt_typ?: 'vorbereitung' | 'kontext' | 'pfad'
  /**
   * Autarkie-Regel: A darf Material erzeugen, das B und C weiterverwenden dürfen —
   * als Angebot, nie als Bedingung. `verbindlich` ist darum immer `false`.
   * Wird (noch) nicht gerendert; der Begleiter kann daraus einen Coaching-Hinweis
   * für Variante A (alle drei nacheinander) bauen.
   */
  bereitet_vor?: { fuer: Array<'A' | 'B' | 'C'>; material: string; verbindlich: false }
  /**
   * Bestand: alle Leitfragen der Herausforderung.
   * v4.2, zwei Stadien: Auf der Platte stehen hier nur LF1 und LF2 (Kern); LF3 und LF4
   * liegen in `spuren.*.leitfragen`. Nach `loadEinheit` (→ `resolveSpur`) stehen alle
   * vier hier — jeder Renderer sieht ein Heft mit vier Leitfragen.
   */
  leitfragen?: Leitfrage[]
  /**
   * v4.2, nur auf der Platte: die zwei Spuren. Eine Spur fehlt, wenn sie nicht zulässig
   * ist (Leitfaden §4.4). `resolveSpur` setzt die gewählte Spur ein und ENTFERNT dieses
   * Feld — ein Renderer bekommt es nie zu sehen.
   */
  spuren?: Partial<Record<SpurKey, Spur>>
  /** v4.2, nur nach der Auflösung: welche Spur dieses Heft zeigt. */
  spur?: SpurKey
  /** v4.2, nur nach der Auflösung: welche Spuren die Herausforderung überhaupt hat. */
  spuren_verfuegbar?: SpurKey[]
  /** v4.2, nur nach der Auflösung und nur in der Medien-Spur: Pflicht- und Vertiefungsquellen. */
  quellen?: Quelle[]
  /** v4.2, nur nach der Auflösung: Kasten auf Seite 4 der gewählten Spur. */
  kasten_s4?: KastenS4
  /** v4.2: genau zwei KN-Kriterien (1 SuK + 1 Ges); ersetzt `lernfortschritt.kriterien` im Rendering. */
  feedback_kriterien?: FeedbackKriterium[]
  /** v4.2: Seite 8 unten; ersetzt `reflexion_fragen` im Rendering. */
  abschluss?: Abschluss
  mindmap_zentrum?: string
  /** `transfer: true` (v4.2) markiert den einen Ast «gilt auch bei …». */
  mindmap_aeste?: { titel: string; optional?: boolean; punkte?: string[]; transfer?: boolean }[]
  /**
   * v4.2: Glossar dieses Hefts in der eingesetzten Spur. Steht NICHT in der Heft-Datei:
   * `loadEinheit` setzt es aus `set.glossar` ein (Einträge mit passendem `heft`, ohne
   * `spur` oder mit der wirksamen Spur). Die Punkte der Mindmap-Äste sind Begriffe daraus —
   * das Begriffsnetz auf S. 8 zeigt die Begriffe als Knoten, das Glossar darunter erklärt sie.
   */
  glossar?: GlossarEintrag[]
  handlungsprodukt?: {
    format?: string
    format_detail?: string
    titel?: string
    abgaben?: string[]          // Cluster 6 — konkrete Abgabe(n) fuer den "Das liefern Sie ab"-Block (additiv)
    beschreibung?: string
    schritte?: { label: string; hint: string }[]
    schreib_label?: string
    schreib_note?: string
    /** v4.2: Verweis auf die Methodenseite, unter den Schritten (Seite 5). */
    hilfe_verweis?: string
    /** v4.2: neutrales Beispiel des Produkts an einem anderen Fall — im Heft auf S. 6. */
    beispielbild?: ProduktBild
    /** v4.2: mögliche Lösung zum Fall des Hefts — nur Lehrperson (Dokument «Lösungen»). */
    loesungsbild?: ProduktBild
    // C6 — language scaffolds for the Handlungsprodukt (additive); aligned to HP format + output Sprachmodus
    scaffolding?: { satzanfaenge?: string[]; strategien?: string[]; struktur?: string[] }
  }
  /**
   * Werkzeugseite «05 · Methoden» — vier feste Felder gegenüber der Arbeitsfläche.
   *
   * ACHTUNG, zwei Stadien: In der JSON-Datei auf der Platte steht eine Liste von
   * {@link MethodeRef} (nur Kürzel + Übertragung). `loadEinheit` löst sie gegen die
   * Kartei auf, bevor sie irgendein Renderer sieht — ab da ist es {@link Methode}.
   * Der Typ hier beschreibt das aufgelöste Stadium, weil alle Konsumenten nur das kennen.
   *
   * Rein additiv und datengesteuert: Fehlt das Feld (Stand: alle Einheiten ausser 3.2.1),
   * wird die Seite gar nicht erst gerendert und der Bogen bleibt bei sieben Seiten. Erst
   * mit Daten wächst er auf acht — dann liegt Seite 6 (Methoden) im gehefteten Heft
   * gegenüber Seite 7 (Arbeitsfläche).
   *
   * Zwei Herkünfte, im Graudruck an der Kontur unterscheidbar:
   *  - `lehrmittel` → `kap` (+ optional `seiten`) und das Paar `lesen` / `tun`.
   *    `tun` überträgt die Methode auf genau diese Abgabe und wird deshalb pro
   *    Herausforderung neu formuliert.
   *  - `hko` → eigene Karte für das, was das Lehrmittel nicht anleitet: `schritte`
   *    und `ankommt`. Sie muss vollständig sein, denn dahinter kommt nichts.
   * `seiten` bleibt leer, solange die Seitenzahl nicht am Buch verifiziert ist —
   * ein erfundener Verweis kostet Vertrauen für alle echten.
   */
  methoden?: Methode[]
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
  /** Kanonischer Lehrgang — steuert Datensatz-Auflösung und EBA-Rendering. Einwertig. */
  lehrgang?: string
  /**
   * Alle Lehrgänge, für die die Einheit gültig ist (nur Katalog-Filter + Anzeige).
   * Fehlend = [lehrgang]. Nur zulässig, wenn die abgedeckten Kompetenzen in allen
   * genannten Datensätzen nummern- und textgleich sind — siehe ./lehrgang.ts.
   */
  lehrgaenge?: string[]
  /** Anzeige-Titel der Einheit im Katalog. */
  einheit_titel?: string
  /**
   * v4.2: welche Spur die Einheit zeigt. `wahl` (Default): beide werden exportiert,
   * die Lehrperson schaltet um; angezeigt wird zuerst `DEFAULT_SPUR`.
   */
  spur?: SpurKey | 'wahl'
  /** v4.2: 12 Lektionen über vier Wochen. */
  wochenplan?: Wochenplan[]
  /** v4.2: ersetzt `austausch_phase` und `dekontextualisierungs_aufgabe` im Rendering. */
  gemeinsamer_auftrag?: GemeinsamerAuftrag
  /** v4.2: Glossar der Einheit (Auftragsbogen Seite A3). */
  glossar?: GlossarEintrag[]
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
  herausforderungen?: Record<string, { herausforderung: string; konfliktart: string; handlungsprodukt_typ?: string; transferrable?: boolean; /** v4.2: Kompetenzen pro Heft */ kompetenzen?: string[] }>
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
    fall_ausschluss_hefte_und_auftrag?: string[]
  }
  // v4.2 (Leitfaden §11.3)
  modi_kn?: string[]
  modi_pro_heft?: Record<string, string[]>
  /** Berechnet: modi_kn − (modi_pro_heft.A ∪ modi_pro_heft.B), Leitfaden §7.2. */
  modi_auftrag?: string[]
  kn_kriterien_verteilung?: Record<string, string[]>
  pol_typ_verteilung?: Record<string, Partial<Record<SpurKey, PolTyp>>>
  mindmap_zentrum_kurz?: string
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
  lehrgang?: string
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
  lehrgang?: string
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
  /** Kanonischer Lehrgang (aus herausforderung_A.json) — einwertig. */
  lehrgang: string
  /** Alle gültigen Lehrgänge, inkl. `lehrgang`. Siehe ./lehrgang.ts. */
  lehrgaenge: string[]
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
  /** Mindestens eine Herausforderung hat eine Methoden-Werkzeugseite. */
  hat_methoden: boolean
  /** EBA-Wissens-Dossier (dossier.json) vorhanden. */
  hat_dossier: boolean
  /** v4.2 — mindestens eine Herausforderung führt `spuren`. */
  hat_spuren?: boolean
  /** v4.2 — mindestens eine Herausforderung hat die Spur `mit_medien`. */
  hat_medien?: boolean
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
  leseblatt?: any
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
  /**
   * v4.2: die Spur, in der `hf_A`/`hf_B` aufgelöst sind. Fehlt bei Einheiten ohne Spuren.
   */
  spur?: SpurKey
  /**
   * v4.2: dieselben Hefte, je verfügbarer Spur fertig aufgelöst — damit die Workbench
   * ohne eigene Auflösungslogik umschalten und beide Spuren exportieren kann.
   * `spur_varianten[spur]` ist identisch mit `{ hf_A, hf_B }` oben. Fehlt bei
   * Einheiten ohne Spuren.
   */
  spur_varianten?: Partial<Record<SpurKey, { hf_A: SituationJson | null; hf_B: SituationJson | null }>>
}
