# Claude Code Handoff — Feedback Matthi umsetzen (EBA-Einheit `1.1.1_lehrvertrag_orientieren`)

**Ziel:** 7 Feedback-Punkte von Matthi umsetzen — sowohl in der **konkreten Einheit** als auch (wo sinnvoll) **gehärtet im Generator-Skill**, damit künftige EBA-Einheiten die Fehler nicht wiederholen.
**Status der Einheit:** bereits generiert + reviewt (`status: "entwurf"`), wird **nicht** neu generiert. Fixes erfolgen direkt an den Dateien; Skill-Änderungen wirken nur auf zukünftige Generierungen.

## Kontext / relevante Pfade

- **Einheit:** `src/data/einheiten/1.1.1_lehrvertrag_orientieren/` — `herausforderung_A.json`, `herausforderung_B.json`, `kn.json`, `prinzip.json`, `set.json`, `dossier.json`, `begleiter.md`
- **Generator-Skill:** `.claude/skills/hko-2er-EBA-set-generator/SKILL.md` (+ `references/a2-language-rules.md`, `references/dossier-architecture.md`, `references/coherence-checklist.md`)
- **Renderer (student-facing):** `src/components/einheiten/docs/DocS.tsx`, `DocKnS.tsx`, `DocEbaDossier.tsx`; Word-Export `src/lib/einheiten/docx-builder.ts`; Bundle `src/components/einheiten/EinheitWorkbench.tsx`
- **Begleiter-Build:** `src/lib/einheiten/begleiter-builder.ts`
- **Index-Rebuild:** `npm run build:einheiten-index` · **Typecheck/Build:** `npm run build`
- Vollständige Befund-Map mit Zeilennummern: `docs/eba/feedback-matthi-mapping.md`

> ⚠ **Umlaut-/Sie-Regel** gilt für alle front-facing Prosa: echte Umlaute `ä ö ü`, kein `ß` (→ `ss`), Sie-Form in Aufträgen, ICH-Form im Narrativ. Siehe EBA-OVERRIDE im SKILL.

---

## Entscheidungen (vom Autor bestätigt)

| # | Punkt | Entscheidung |
|---|---|---|
| 1 | Prozentangaben 90 %/100 % unklar | **In Schülerunterlagen ausblenden** (nur im Begleiter/LP behalten) |
| 2 | KI-Tool nicht benannt | **Microsoft Copilot** (oder ähnliche KI) explizit nennen |
| 3 | Kontaktstellen-Liste fehlt | **Neuer Skill-Schritt:** nach Generierung Zusatzmaterial identifizieren → in den Begleiter («Von der LP bereitzustellen»), damit die LP es verteilt |
| 4 | Begriff «Nugget» | Sichtbar umbenennen zu **«Info-Karte»** |
| 5 | Du-Form ⚠ | **Überall Sie** (Regelverstoss korrigieren + A2-Gate härten) |
| 6 | «dumm wirken»-Satz | `situation_text` anpassen + **Hinweis im Skill** |
| 7 | Leitfrage 3 unlogisch | **Frage anpassen** (Matthis Variante) + **Alignment-Check schärfen** |

---

## Ausführungsreihenfolge (effizient, 5 Workstreams)

Reihenfolge minimiert Datei-Wechsel und Builds: erst alle Daten-Edits dieser Einheit (kein Build nötig), dann der eine globale Renderer-Eingriff (ein Build, EFZ-Regression prüfen), dann der Begleiter, dann die Skill-Härtung (kein Build), zuletzt Rebuild + Verifikation.

---

### WS1 — Daten-Fixes der Einheit (nur dieser Ordner, kein Build nötig)

Ein Durchgang durch `herausforderung_A.json`, `herausforderung_B.json`, `dossier.json`.

**P6 — `situation_text` (herausforderung_A.json, L53)**
Ersetze «Ich will nicht dumm wirken.» durch eine würdevolle Variante, z. B.:
> «Ich habe Angst, eine dumme Frage zu stellen. Aber ich will es richtig verstehen.»
A2 halten (kurze Sätze).

**P7 — Leitfrage 3 (herausforderung_A.json, L76)**
Aktuell: `"Prüfen Sie Ihren Fall. Was gilt, wenn im Vertrag nichts anderes steht?"`
→ an die Situation angleichen (Variante a):
> «Prüfen Sie Ihren Fall. Was gilt, wenn im Lehrvertrag eine andere Dauer steht als abgemacht?»
Prüfen, ob **Dossier Nugget A-02** (`dossier.json`, Probezeit-Regel) diesen Abweichungs-Fall stützt; falls nur die Default-Regel erklärt wird, einen Satz ergänzen, der den Fall «abweichende Vertragsklausel» abdeckt (sonst `ERR_DOSSIER_GAP`).

**P5 — Du → Sie im gesamten Dossier (dossier.json)** ⚠ Hauptarbeit
Konsequent auf Sie-Form/A2 umstellen. Betroffen u. a.:
- `einleitung.was_ist_das` (L24) + `einleitung.so_benutzt_du_es[]` (L26–30): «deine Hilfe» → «Ihre Hilfe», «findest du» → «finden Sie», «Du musst … nicht» → «Sie müssen … nicht», «Hast du eine Frage?» → «Haben Sie eine Frage?»
- Nugget-`inhalt`/`beispiel`: «regelt deine Lehre» → «regelt Ihre Lehre», «Du findest deinen Lohn» → «Sie finden Ihren Lohn», «Du verstehst einen Punkt nicht?» → «Verstehen Sie einen Punkt nicht?»
- `recherche.ki_beispiel.so_fragst_du`: «Sag, wer du bist …» → «Sagen Sie, wer Sie sind …»
- `recherche.ki_lernen[].strategie`/`prompt`: «Lass dich abfragen» → «Lassen Sie sich abfragen», «Spiel es durch» → «Spielen Sie es durch», «Tu so, als wäre ich …» → «Tun Sie so, als wäre ich …»
- `recherche.ki_beispiel.tipp` und alle weiteren «du/dein/dir»-Vorkommen.
Hinweis: `selbst_pruefen` ist bereits korrekt Sie («Schauen Sie …») — als Stilreferenz nehmen.
Abschluss-Check: `grep -n "\bdu\b\|\bdein\|\bdir\b\|\bdich\b\|Sag \|Lass \|Spiel \|Tu " dossier.json` muss leer sein (Imperative/Anreden).

**P2 — Microsoft Copilot benennen (dossier.json)**
In `einleitung` (oder als kurzer Zusatz) konkret nennen, welches Tool gemeint ist, z. B.:
> «Nutzen Sie eine KI wie **Microsoft Copilot** (an unserer Schule verfügbar) oder ein ähnliches Tool.»
Die generischen `ki_beispiel.prompt`/`ki_lernen` bleiben toolneutral; nur die Einstiegs-Empfehlung nennt Copilot.

**P3 (Daten-Teil) — Kontaktstellen-Liste (dossier.json, Nugget B-02)**
Nugget B-02 «Wer hilft mir? Die Kontaktstellen» um eine **abgesetzte, konkrete Liste** ergänzen (Berufsbildner/in, Lehrlingsverantwortliche/r, kantonales Berufsbildungsamt, Berufsfachschule/Klassenlehrperson, ggf. Schlichtungsstelle). Dann passt `herausforderung_B.json` `scaffold_90` («Kontaktstellen-Liste stehen bereit») — alternativ Scaffold-Wortlaut auf «… stellt die Lehrperson zur Verfügung» ändern. **Bevorzugt:** Liste ins Dossier (self-contained), da EBA kein Lehrmittel hat.

**P4 (Daten-Teil) — «Nugget» → «Info-Karte» (sichtbare Strings)**
Nur **sichtbare Wörter** ersetzen, **interne ID-Keys behalten** (`"id": "nugget_A_01"` bleibt — Referenzen würden sonst brechen). Ersetze das Wort «Nugget» in gerenderten Strings:
- `herausforderung_A.json` (9×) + `herausforderung_B.json` (8×): `leitfragen[].knoten_ref` «Dossier | Nugget A-01» → «Dossier | Info-Karte A-01»; `quellen_anker[].nugget_ref` analog
- `prinzip.json` (2×): `dossier_anker`/Texte
- `dossier.json` (2×): sichtbare Titel/Hinweise (nicht die `id`)
- `kn.json`: 0 Treffer — prüfen, ob KN auf Dossier verweist
Der Renderer leitet den Code «A-01» aus der ID ab (`nuggetCode()` in `DocEbaDossier.tsx`, `dossierNuggetCode()` in `docx-builder.ts`) — diese Funktionen bleiben unverändert, da sie nur «A-01» erzeugen, nicht das Wort «Nugget».

---

### WS2 — Renderer: Prozente in Schülerunterlagen ausblenden (P1, global — Build + EFZ-Regression!)

> ⚠ **Befund:** Im aktuellen `main`-Renderer rendern **weder `DocS.tsx` noch `docx-builder.ts`** die Felder `lernfortschritt.scaffold_90/100`. Die Karte «Mit Hilfe (90 %) / Selbstständig (100 %)» aus Matthis Screenshot stammt also aus einem Export-/Arbeitskopie-Pfad, der nicht im committeten Stand liegt.
> **Schritt 1:** Render-Ort lokalisieren — `grep -rn "scaffold_90\|Mit Hilfe\|Selbstständig (" src/` über den **aktuellen Arbeitsbaum** (inkl. evtl. uncommitteter Änderungen). Falls die Karte existiert: dort die `(90 %)`/`(100 %)`-Labels entfernen bzw. den Block aus dem SuS-Render nehmen.

**Bestätigt student-facing (sicher anzupassen):**
- `DocKnS.tsx` L244 — Überschrift «Niveaubänder — was 90 % / 100 % heisst» + die Labels aus `kn.json` `rubrik_shared.niveaubaender[]` («unter 90 %», «90 %», «100 %», L237–247). In der **SuS-Ansicht** die Prozentzahlen entfernen/durch Worte ersetzen (z. B. «Grundanforderung erfüllt» / «vollständig & selbstständig»). Numerische 90/100 nur im **Begleiter** (LP) und im Bewertungsraster für die LP behalten.
- Falls ein Differenzierungs-Karten-Block in `DocS.tsx`/`DocEbaDossier.tsx` existiert (Schritt 1): Prozente raus.

Begleiter behält die `[!differenzieren] 90 vs. 100`-Callouts (`begleiter.md` L139–140, L200–201) — das ist LP-Material und korrekt.

**Regression:** Nach der Änderung `npm run build` + stichprobenartig eine **EFZ-3J-Einheit** rendern (z. B. `1.1.1_konflikt_kommunizieren`), damit die Niveaubänder-Anzeige dort nicht kaputtgeht.

---

### WS3 — Begleiter: Sektion «Von der Lehrperson bereitzustellen» (P3, diese Einheit)

In `src/data/einheiten/1.1.1_lehrvertrag_orientieren/begleiter.md` eine neue Sektion ergänzen (vor «## Anhang», analog zu den bestehenden Sektionen). Inhalt: konsolidierte Liste aller Materialien, die die Aufträge voraussetzen, aber **nicht** als SuS-Blatt/Dossier-Karte vorliegen — hier v. a. die **Kontaktstellen-Liste** (HF B). Format: «Material · für welche Herausforderung · Quelle/Vorlage». Wenn die Liste bereits ins Dossier kam (WS1/P3), hier nur referenzieren statt duplizieren.

---

### WS4 — Skill-Härtung (`.claude/skills/hko-2er-EBA-set-generator/`, kein Build)

**P5 — A2-Gate um Du-Form-Scan erweitern (höchste Priorität, einziger echter Bug):**
- `SKILL.md` Z. 550 (A2-GATE) + `references/a2-language-rules.md`: neuen blockierenden Check ergänzen, z. B. `ERR_ANREDE_DU` — scannt **alle Dossier-Prosa-Felder** (`einleitung.*`, `nuggets[].inhalt/beispiel`, `recherche.ki_beispiel.*`, `recherche.ki_lernen[].*`) auf Du-Anrede/Du-Imperative («du/dein/dir/dich», Imperative ohne «Sie»). Bisher deckt der A2-Scan die Dossier-Anrede nicht ab.
- In `references/coherence-checklist.md` als Pflicht-Check für Phase 7 aufnehmen.

**P3 — Neue Phase «Material-Bedarfs-Analyse» (NEU):**
- Neue Phase nach **Phase 7 (Dossier)**, vor/in Phase 5 (Begleiter), z. B. **Phase 7.5**: Claude scannt nach Dossier-Fertigstellung alle SuS-Artefakte (`herausforderung_*.scaffolding`, `.schritte`, `leitfragen`, `handlungsprodukt`, `lernfortschritt.scaffold_*`) auf **referenzierte, aber nicht im Dossier vorhandene Materialien** (Listen, Vorlagen, Formulare, Tabellen). Ergebnis = Liste «Von der LP bereitzustellen».
- Diese Liste fließt in eine **neue Begleiter-Sektion** (Phase 5, Sektion-Aufbau in `SKILL.md` Z. 841 ff. erweitern): «Von der Lehrperson bereitzustellen». Damit ist WS3 künftig automatisch.
- Optional als eigener Coherence-Check: jedes Scaffold, das ein Artefakt verspricht («… stehen bereit»), muss entweder Dossier-Deckung haben **oder** in der LP-Material-Liste stehen.

**P1 — Prozente-Regel:**
- `SKILL.md` Z. 895 (`[!differenzieren] 90 vs. 100`) + Z. 1222 (Niveaubänder-Checklist): explizit festhalten, dass **90 %/100 % nur im Begleiter (LP)** erscheinen und in **SuS-Renders** (DocS, DocKnS-SuS) **nicht** ausgegeben werden. Falls eine SuS-Differenzierungsanzeige nötig ist, Wortlabels statt Prozente.

**P4 — Anker-Begriff «Info-Karte»:**
- `SKILL.md` (Z. 47, 199, 243, 377, 540, 625 u. a.) + `references/dossier-architecture.md`: sichtbares Anker-Format auf «Dossier | Info-Karte A-01» umstellen. **Interne ID-Konvention `nugget_A_01` bleibt** (nur Anzeige ändern). Renderer-Wording «Nugget» in Kommentaren/Labels optional angleichen.

**P7 — Alignment-Check schärfen:**
- `SKILL.md` «Constructive Alignment» (Z. 1088) + Coherence-Check 20 + `references/coherence-checklist.md`: Regel ergänzen, dass eine **Anwenden-Leitfrage (K3)** den im `situation_text` geschilderten **konkreten Fall** treffen muss (nicht einen anderen Default-Fall). Negativ-Beispiel aus diesem Feedback (LF3 «nichts anderes steht» vs. Situation «andere Dauer») als Illustration aufnehmen.

**P6 — Persona-Würde-Hinweis:**
- `SKILL.md` «ICH-Perspektive Formula» (Z. 1073) / «Authentizität» (Z. 1062): kurzer Hinweis, dass emotionale Unsicherheit **würdevoll** formuliert wird (z. B. «Angst, eine Frage zu stellen» statt «nicht dumm wirken») — keine selbstabwertende Formulierung in der Lernenden-Stimme.

**P2 — KI-Tool-Empfehlung:**
- `references/dossier-architecture.md` (L111–131) / `SKILL.md` Dossier-Einleitungs-Regel: festhalten, dass die Dossier-Einleitung **ein konkretes, schulseitig verfügbares KI-Tool** nennt (Default: **Microsoft Copilot**), die Beispiel-Prompts aber toolneutral bleiben.

---

### WS5 — Rebuild + Verifikation

```bash
npm run build:einheiten-index     # Index nach Daten-Edits neu bauen
npm run build                     # SSR-Build / Typecheck (Renderer-Änderungen)
```

**Verifikations-Checks (alle müssen passen):**
- `grep -rn "\bdu\b\|\bdein\|\bdir\b\|Sag \|Lass \|Spiel " src/data/einheiten/1.1.1_lehrvertrag_orientieren/dossier.json` → leer (P5)
- `grep -rn "Nugget" src/data/einheiten/1.1.1_lehrvertrag_orientieren/` → nur in `"id": "nugget_..."`-Keys, keine sichtbaren Strings (P4)
- `situation_text` enthält «dumm wirken» nicht mehr (P6); LF3 trifft den Abweichungs-Fall (P7)
- Dossier-Einleitung nennt Copilot (P2); Nugget B-02 enthält Kontaktstellen-Liste (P3)
- SuS-Render (DocS/DocKnS) zeigt keine «90 %/100 %»; Begleiter zeigt sie weiterhin (P1)
- Begleiter hat Sektion «Von der Lehrperson bereitzustellen» (P3)
- EFZ-Regression: `1.1.1_konflikt_kommunizieren` rendert unverändert korrekt
- Optional: Einheit lokal über `/einheiten/1.1.1_lehrvertrag_orientieren` öffnen (KT1, da `status: "entwurf"`) und A/B + KN-S visuell prüfen.

**Commit-Vorschlag:** `fix(eba): Matthi-Feedback 1.1.1 lehrvertrag + Skill-Härtung (Sie-Form, Info-Karte, Material-Bedarf, Alignment)`

---

## Quick-Reference: Punkt → Dateien

| # | Daten (Einheit) | Renderer | Skill |
|---|---|---|---|
| 1 | — | `DocKnS.tsx` L244 + kn.json niveaubänder; Scaffold-Karte (Ort suchen) | SKILL Z.895/1222 |
| 2 | `dossier.json` einleitung | — | `dossier-architecture.md` |
| 3 | `dossier.json` Nugget B-02 + `begleiter.md` neue Sektion | — | SKILL Phase 7.5 + Phase 5 Sektionen |
| 4 | hf_A/B `knoten_ref`+`nugget_ref`, prinzip, dossier (Strings) | Labels/Kommentare optional | SKILL Anker-Format + `dossier-architecture.md` |
| 5 | `dossier.json` (Du→Sie, ganz) | — | SKILL Z.550 + `a2-language-rules.md` + `coherence-checklist.md` |
| 6 | hf_A `situation_text` L53 | — | SKILL Z.1062/1073 |
| 7 | hf_A `leitfragen[3]` L76 (+ Nugget A-02) | — | SKILL Z.1088 + Check 20 |
