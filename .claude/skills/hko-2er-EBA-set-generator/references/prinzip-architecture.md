# Prinzip-Architektur — 3er-Set

Design-Regeln fuer Phase 0.5 der `hko-3er-set-generator`-Skill. Das Prinzip ist der rote Faden, der die drei Lernaufgaben zusammenhaelt — und der Brueckenpfeiler zur inline-KN-Generierung.

---

## 1. Was ist ein gutes Prinzip

Ein Prinzip ist die explizite Antwort auf die Frage: *Welche eine Kompetenz-Auspraegung verbindet alle drei Lernaufgaben?* Es ist mehr als die NRLP-Kompetenz-Beschreibung (die ist die rechtliche Grundlage), aber weniger als die einzelne Herausforderung (die ist konkret). Es operiert auf der Ebene des Versprechens: "Nach diesen drei Lernaufgaben kann ich X."

### Kriterien fuer ein gutes `kern_kompetenzversprechen`
- Ein Satz, ICH-Perspektive
- Endet auf K3- oder K4-Verb (entscheiden, analysieren, beurteilen, positionieren, gestalten, kommunizieren, …)
- Paraphrasiert mindestens ein Aktionsverb aus der NRLP-Kompetenz-Beschreibung
- Spannt einen Trade-off-Raum auf (Mehrdeutigkeit ist Pflicht)
- Erlaubt drei unterscheidbare Herausforderungen (sonst sind die drei Herausforderungen redundant)

---

## 2. Herausforderungen — von 5 auf 3

Im 5er-Set war jede Herausforderung eine eigene Lerneinheit. Im 3er-Set ist die Logik gleich, nur die Anzahl reduziert:
- Herausforderung A: erster Konflikttyp (z.B. Marktpreisbildung als Mechanismus)
- Herausforderung B: zweiter Konflikttyp (z.B. Konsumentenethik)
- Herausforderung C: dritter Konflikttyp (z.B. Empfehlungsverantwortung)

Jede Herausforderung hat:
- `herausforderung` — Kurzbezeichnung, 1-3 Worte
- `konfliktart` — der spezifische Konflikt, der diese Herausforderung traegt
- `handlungsprodukt_typ` — was am Ende dieser Herausforderung entsteht (E-Mail, Rollenportrait, Werbeanalyse, ...)
- `transferrable: true` — bestaetigt, dass diese Konfliktart in der KN-Hybrid-Herausforderung aktiviert werden darf

---

## 3. SK-Schnittmenge fuer den KN

Im 5er-Set unterscheidet man `primary` (SK in >=3 von 5) und `secondary` (in genau 2 von 5).

Im 3er-Set ist die Logik schmaler:
- `primary`: SK in mindestens 2 von 3 Herausforderungen — das sind die SK, die der KN testen darf
- Kein `secondary`-Tier mehr — mit nur 3 Units ist der Beleg fuer eine SK zu schwach, wenn sie nur in einer Herausforderung auftaucht. Das schaerft die KN-Ausrichtung.

Wenn der `primary`-Tier weniger als 2 SK enthaelt: das Set ist nicht KN-faehig. Pietro wird gewarnt; Skill 1 muss die Herausforderungen anders zuschneiden.

---

## 4. Mehrdeutigkeits-Architektur

Mehrdeutigkeit (SK11) ist im 3er-Set Pflicht in 3 von 3 Herausforderungen — kein Slot fuer "in der einen Herausforderung lassen wir es weg". Mit drei Herausforderungen kann eine fehlende Mehrdeutigkeit das ganze SK11-Versprechen kippen.

### `trade_off_raum`
Eine Liste von 2-4 Spannungspolen, die ueber das gesamte 3er-Set tragen koennen. Jeder Eintrag ist eine kurze Phrase mit "X vs. Y"-Struktur:
- "Marktlogik vs. Bedarfsorientierung"
- "Sofortige vs. ueberlegte Bedduerfnisbefriedigung"
- "Vorgaben einhalten vs. Lernschritt wagen"

Jede der drei Herausforderungen aktiviert mindestens einen dieser Trade-offs in `mehrdeutigkeit.trade_off`. Die Hybrid-Herausforderung im KN aktiviert mindestens einen — typisch denselben, der die thematisch dichteste Spannung traegt.

### `verbindlich`
Eine Regel, die ueber alle Herausforderungen konstant bleibt — sie macht die Mehrdeutigkeit nicht aufloesbar. Beispiel: "Beide Optionen muessen begruendbar bleiben — eine 'richtige' Wahl gibt es nicht."

---

## 4a. Aspekt-Antizipation

Aspekte im Prinzip kommen aus zwei Quellen:
1. NRLP-Kompetenz `gesellschaftliche_inhalte[].aspekt`
2. Antizipation aus den `herausforderungen[*].konfliktart`

Wenn eine Konfliktart einen Aspekt impliziert, der nicht im NRLP-Eintrag steht, wird er
trotzdem in `prinzip.aspekte` aufgenommen — sonst schlaegt Coherence Check 4 in Phase 2
fehl, sobald eine Herausforderung den implizierten Aspekt aktiviert.

Beispiel 3.2.2: NRLP-Kompetenztext nennt Wirtschaft + Oekologie. Herausforderung B (Fairtrade)
aktiviert inhaerent Ethik. Ohne Antizipation in Phase 0.5 generiert Phase 2 ein Sit_B mit
`gesellschaft: [Wirtschaft, Ethik]` und der Audit faellt um.

Heuristik: siehe SKILL.md Phase 0.5 Step 2a.

### Anwendungsregel (strikt, NEU in v1.2)

Die Tabelle greift NUR auf `herausforderungen[*].konfliktart`-Strings. Wenn die
Konfliktart kein Signalwort enthaelt, aktiviert die Herausforderung diesen
Aspekt nicht — auch wenn das Thema didaktisch dazu passt.

Bei Bedarf konfliktart so umformulieren, dass das gewuenschte Signal
explizit wird. Das macht die Aspekt-Aktivierung dokumentiert und
nachvollziehbar.

Anti-Pattern: Sit_A in 3.2.1 hatte konfliktart 'Marktlogik vs. knappe
Ressourcen' — Identitaet wurde dennoch antizipiert, obwohl keines der
Signalwoerter (Identitaet/Rolle/Zugehoerigkeit/Sozialisation) im String
steht. Der Generator hat das Signal vermutlich aus der Ich-Konsum-Reflexion
am Ende der Herausforderung gezogen — das ist 'Erweiterung', nicht 'Antizipation'.

---

## 5. Persona-Pools

### `persona_pool_units` (3 + 3)
3 Berufe + 3 Orte, die in den 3 Lernaufgaben verwendet werden. Authentische Schweizer Berufsbildungs-Kontexte. Jede Persona einmal pro Herausforderung.

### `persona_pool_kn_neu` (2 + 2)
2 Berufe + 2 Orte, die in den 3 Units NICHT vorkommen. Phase 4 verwendet `[0]` als Default-Hybrid-Persona; `[1]` ist Reserve, falls Pietro einen Persona-Wechsel braucht. **Disjunkt** von `persona_pool_units` (Check 9).

Im Vergleich zum 5er-Set ist der Pool kleiner (2 statt 3), weil im 3er-Set nur eine Hybrid-Herausforderung entsteht (nicht 3 Mini-Cases).

---

## 6. `hybrid_situation_spec` — neuer Brueckenstein

Im 5er-Set wurde die KN-Hybrid-Logik aus dem `kn_anchor` rekonstruiert. Im 3er-Set ist sie explizit im Prinzip als `hybrid_situation_spec` definiert:

```json
{
  "max_woerter": 120,
  "perspektive": "ICH",
  "must_activate_trade_offs_min": 1,
  "must_combine_herausforderungen": ["A", "B", "C"],
  "persona_source": "persona_pool_kn_neu",
  "endet_mit_leitfrage": true,
  "qualitaetskriterien": [...]
}
```

Diese Felder sind Phase-4-Constraints — sie werden in Phase 0.5 mitformuliert, in Phase 4 konsumiert.

---

## 7. Transfer-Anker

Ein generisches Prinzip-Statement, das aus allen drei Herausforderungen abstrahiert werden kann. Im 3er-Set hat es zwei Konsumenten:
- **Per-Herausforderung Vorbereitung**: `sit_*.dekontextualisierung.ziel` referenziert diesen Anker
- **Set-Aufgabe (Transfer)**: `set.dekontextualisierungs_aufgabe.ziel` referenziert ihn ebenfalls — Lernende uebertragen das Prinzip auf einen selbst gewaehlten neuen Kontext. Der Transfer wird im set-level "Austausch & Transfer"-Dokument bearbeitet (C8); die fruehere bewertungsraster-Zeile "Transfer" (15 %) entfaellt — `gewicht` wird nicht mehr gerendert.

Beispiel-Anker fuer Preisbildung:
> "Preise entstehen am Markt, aber Empfehlungs- und Konsumentscheide tragen ethische Verantwortung. Wer in der Wertschoepfungskette beraet, kann zwischen Marge und Bedarf unterscheiden."

---

## 8. `kn_vorgabe` — entfernt im 3er-Set

Im 5er-Set hatte das Prinzip einen `kn_vorgabe`-Block (methode_primary, anzahl_faelle, rubric_typ, ...). Im 3er-Set ist diese Logik **entfernt** — die KN-Architektur ist fix (1 Hybrid + 3 Typen + bi-dim Rubrik), nicht generation-time-konfigurierbar. LP waehlt am Platform-Layer, nicht im JSON.

Stattdessen: das neue `hybrid_situation_spec` ist die einzige KN-Generation-time-Spec. Alles andere (3 KN-Typen, Rubrik) ist Skill-konstant.

---

## 9. Phase-0.5-Schritte — Kurzfassung

1. NRLP X.Y.Z aus Phase 0 laden
2. Drei Kandidaten-Kern-Versprechen vorschlagen (je ein K3/K4-Verb, je eine andere SK-Schwerpunkt-Achse)
3. User waehlt Kandidat 1, 2 oder 3 (oder beschreibt was er sucht)
4. Selektierten Kandidat zum vollstaendigen Prinzip-JSON expandieren — 3 Herausforderungen, sk_pro_situation, sk_schnittmenge_kn (nur primary), trade_off_raum, persona_pools 3+2, hybrid_situation_spec, dekontextualisierungs_anker, zirkularitaet
5. Markdown-Zusammenfassung zur Review zeigen (nicht raw JSON)
6. Nach User-OK schreiben nach `src/data/einheiten/{X.Y.Z}_{topic_slug}/prinzip.json`

---

## 10. EBA-2er-Kalibrierung (`lehrgang=EBA_2J`) — verbindlicher Override

Diese Datei ist die EBA-Fassung. Die Architektur ist identisch; nur die Set-Groesse und die
Schwellen aendern sich. Wo oben „drei/A/B/C" oder „K3/K4" steht, gilt fuer EBA:

- **§2 Herausforderungen — 2 statt 3:** nur **A** (erster Konflikttyp) + **B** (zweiter Konflikttyp),
  C entfaellt. **Spiralen-Regel (verbindlich):** A und B tragen **denselben Trade-off** in
  **maximal kontrastreichen** Kontexten (verschiedene Abteilungen, verschiedene Konfliktarten).
  Zwei Datenpunkte sind das Minimum, um ein uebertragbares Muster sichtbar zu machen — ohne Kontrast
  sieht die lernende Person zwei Einzelfaelle statt ein Prinzip.
- **§1 Kern-Versprechen — K-Decke K3:** endet auf K2- oder K3-Verb (nicht K4). Bloom-Zielprofil
  LF1-2 K2 / LF3-4 K3; K4 nur als optionale 100%-Extension.
- **§3 SK-Schnittmenge — 2 von 2:** `primary` = SK in **beiden** Herausforderungen. Minimum 2 SK
  gesamt (RLP Z.791). Kein secondary-Tier.
- **§4 Mehrdeutigkeit — 2 von 2, aber gefuehrt:** beide Herausforderungen aktivieren einen Trade-off.
  EBA fuehrt staerker: das **Dossier-Transfer-Wissensblatt macht den Trade-off sichtbar**, die
  lernende Person muss ihn nicht selbst herausarbeiten.
- **§5 Persona-Pools — units 2+2:** `persona_pool_units` = **2 Berufe + 2 Orte** aus **>=2
  Abteilungen** (hko-framework §11 EBA-Override), EBA-Berufe bevorzugt, LJ1-2.
  `persona_pool_kn_neu` bleibt 2+2, disjunkt.
- **§6 hybrid_situation_spec:** `must_combine_herausforderungen: ["A","B"]`,
  `lehrjahr_constraint` nur LJ1-2.
- **§7 Transfer-Anker:** abstrahiert aus **beiden** Herausforderungen; zusaetzlicher Konsument ist
  das **Dossier** (`transfer_wissensblatt.prinzip_in_einfach` = A2-Fassung des anker_statement).
- **Quoten (RLP Z.791):** 2 SK / 2 Aspekte / 1 Modus. EBA-Schwerpunkt muendlich → Fachgespraech
  ist KN-Primaerform.
- **Quellen-Anker statt Lehrmittel:** `quellen_anker.dossier_nuggets` skizziert die Nugget-Bereiche
  pro Herausforderung; `konzepte` ist der Seed fuers Dossier-Glossar (A2-erklaert).
- **§9 Phase-0.5-Schritte:** Step 2 schlaegt EBA-K3-Kandidaten vor; Step 4 expandiert auf **2**
  Herausforderungen, persona_pools 2+2.
