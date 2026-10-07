# Sprachregeln (verbindlich)

## Umlaute
- Sichtbare Prosa: echte `ä/ö/ü` (titel, ziel, auftrag, warnung, prompt …).
- `ae/oe/ue` NUR in IDs, JSON-Keys, Dateinamen.
- **Kein `ß`** — immer `ss` (Schweizer Konvention).
- Pre-Write-Scan: Datei darf kein `ß` enthalten; keine Transliteration (`ae/oe/ue`)
  in sichtbarer Prosa.

## Gendern
- Schrägstrich-Ein-Wort-Form: `Berufsbildner/in`, `Lernende/r`, `Mitlernende`,
  `eine/ein`. Keine Doppelnennung, kein Gender-Stern, kein Binnen-I.

## Codes
- Keine rohen SK-/SM-Codes (`SK6`, `SM3`) in sichtbarer Schüler-Prosa — Klartext
  verwenden. Ausnahme: `nrlp_anker.schluesselkompetenzen_texte` trägt bewusst
  «SK6 — Standpunkte begründen» (Code + Klartext), das ist erlaubt.

## Ton (learner-facing)
- Sie-Form gegenüber Lernenden. Konkret, knapp, keine Floskeln.
- **Beispiel-Prompts sind in der Du-Form gegenüber der KI** — niemand siezt eine KI.
  Betrifft jeden Text, den der/die Lernende AN die KI schickt:
  `techniken[].beispiel_basis` / `beispiel_fortgeschritten`,
  `stacking_seite_1/2.prompt_1` / `prompt_2`, `prompt_basis` /
  `prompt_fortgeschritten`, `kn_typ_tracks[].prompt` sowie jeder in «…» zitierte
  Prompt (z. B. in `prompt_strategie`). Innerhalb dieser Prompts: KI = Du
  («Du bist mein Lerncoach», «Nenne …», «Frag mich ab»), der Selbstbezug der/des
  Lernenden bleibt Ich-Form («… zu meinen Notizen», «meine Position»), Platzhalter
  `[mein Text]`. NUR die Rahmung/Anweisung an die Lernenden um den Prompt herum
  (Lead-in vor dem «…», `auftrag`, `schritte`, `erklaerung`, `warnung`, `wann`,
  `so_uebst_du`, `ziel`, `titel`) bleibt Sie.
- Lehrer-Vokabular (dekontextualisieren, summativ, Konsistenz-Trias) gehört NICHT
  in Schüler-Texte.
- **Namen der KN-Formen gehören nicht in Schüler-Texte:** kein «Mini Case»,
  «Mini Case schriftlich», «Werkschau», «Transfer-Reflexion» — in keinem Format.
  Stattdessen sagen, was dort geschieht («im schriftlichen Kompetenznachweis»,
  «wenn Sie Ihre Arbeiten zeigen und erklären»). «Fachgespräch» bleibt. Ausnahmen
  und Tabelle: SKILL.md, Abschnitt «Namen der KN-Formen».

## v4.2-Einheiten (`template: "heft_8page_v42"`)

Regelquelle ist `.claude/skills/bbw-hko-heft-v42/references/sprache.md` §1-§8 und
§12-§13 — dort lesen, hier nicht kopieren. Für die Toolbox heisst das in Kürze
(vollständig: SKILL.md, Abschnitt «v4.2-Regeln»):

- «Heft A», «Heft B» — nie «Herausforderung A/B»; «gemeinsamer Auftrag» — nie
  «Austausch & Transfer».
- «Spannungsfeld» oder «Zielkonflikt» — nie «Trade-off».
- «0 bis 3 Punkte» — nie «Stufe» oder «Niveau».
- Kein «Spur», kein «Pflichtquelle», keine Woche, Lektion oder Minute Unterrichtszeit
  in Texten für Lernende.
- Keine erfundene Person: «mein Lehrbetrieb», «eine Kollegin».
- Kein Begriff aus dem Fall-Ausschluss des KN, in keinem Feld.
- Die Du-Form **im Prompt an die KI** bleibt (oben, «Ton»); alles um den Prompt
  herum ist Sie. Der Liesmich spricht die Lehrperson wie bisher mit Sie an — er
  ist nicht der Begleiter.
