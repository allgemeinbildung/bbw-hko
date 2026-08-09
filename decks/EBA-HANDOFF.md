# Unterrichtsdeck für EBA — Übergabe

Der Deck-Generator ist für **EFZ** fertig und produktiv verdrahtet. Dieses Dokument
beschreibt, was steht, was für EBA fehlt und was beim Bauen schon bezahlt wurde.

Lies zuerst [`decks/README.md`](README.md) — dort steht die Architektur. Hier steht nur,
was EBA betrifft.

---

## 1. Ausgangslage

**Alles ist generiert.** Keine Konfigurationsdatei pro Deck, keine Handarbeit. Quelle
sind ausschliesslich die JSONs in `src/data/einheiten/<slug>/` und `begleiter.md`.

| Datei | Rolle |
|---|---|
| `src/lib/einheiten/deck-builder.ts` | Parser + Modell + beide HTML-Shells. Der ganze Generator. |
| `scripts/build-deck.mjs` | CLI (`npm run build:deck -- --all`), schreibt nach `decks/generated/` |
| `src/pages/einheiten/[setKey]/deck.astro` | Plattform-Route, Gast-Gate wie beim Begleiter |
| `src/components/einheiten/EinheitWorkbench.tsx` | Knopf «🖥️ Präsentation» + ZIP-Eintrag |

Zwei Ausgaben aus **einem** Modell: `index.html` (HyperFrames, nur für
`npx hyperframes check`) und `deck.html` (eigenständig — Plattform + ZIP).

Stand EFZ: 4 Einheiten, je 21 Folien, `check` 0 Fehler / 0 Layout-Probleme / WCAG AA
79 von 79.

---

## 2. Der Generator läuft auf EBA bereits — fast

Ein Trockenlauf gegen `1.1.1_lehrvertrag_orientieren` (EFZ-Guard umgangen) liefert
**17 Folien**, korrekt strukturiert, **alle Notizen gefüllt**:

```
titel · versprechen · ablauf
a-situation  ↳ a-leitfragen · a-mindmap · a-produkt
b-situation  ↳ b-leitfragen · b-mindmap · b-produkt
austausch · prinzip · transfer · kn-fall · kn-formen · kn-bewertung
```

Das funktioniert, weil EBA-Einheiten **jedes Feld führen**, das der Generator nutzt —
inklusive `mindmap_zentrum` / `mindmap_aeste`, `bewertungsraster`, `mehrdeutigkeit`,
`sit_farbe`, `leitfragen`, `zahlen_tabelle`. Einzig `emotion_tag` fehlt, und das ist
bereits optional.

Auch die Sektions-Zuordnung stimmt zufällig: EFZ hat A/B/C in Sektion 3/4/5, EBA hat
A/B in Sektion 3/4 — `sec(3 + i)` trifft beides. Die Überschriften-Dialekte
(`## 3. …` vs. `## Sektion 3 — …`) deckt der Parser schon ab.

### Zwei verifizierte Fehler

**a) Titel ist `undefined`.** `set.json` führt bei EBA **kein** `einheit_titel`.
Betroffen: `buildDeck()`, Titelfolie. Kandidaten als Quelle:

| Quelle | Wert im Beispiel |
|---|---|
| `set.modul_titel` | (vorhanden, Lebensbezugs-Satz) |
| Frontmatter `titel` in `begleiter.md` | „Begleit-Dokument — Ins Berufsleben einsteigen (1.1.1)" |
| `einheiten.index.json` → `titel` | der volle Kompetenz-Satz (lang) |

Empfehlung: `set.einheit_titel ?? set.modul_titel` — kurz und ohne Zusatzquelle.

**b) Zahlwort-Grammatik bei n = 2.** Erzeugt „Das Prinzip hinter allen **zwei**
Herausforderungen" und „Was haben Ihre **zwei** Herausforderungen gemeinsam?".
Richtig wäre „beiden". Betrifft `zahl()` / `Zahl()` in `deck-builder.ts`; ein Sonderfall
für 2 in genau diesen zwei Überschriften genügt.

---

## 3. Was inhaltlich zu entscheiden ist

Der Generator ist technisch fast fertig — die eigentliche Arbeit ist didaktisch.

1. **`dossier.json` wird bisher ignoriert.** EBA hat kein Lehrmittel, deshalb das
   selbst erzeugte Wissens-Dossier (A2, `nuggets`, Glossar, Sprachhilfe). Es hat keine
   Entsprechung im EFZ-Deck. Frage: eigene Folie(n) pro Herausforderung? Ein
   Nugget-Block in der Situation? Nur ein Verweis? Das ist die einzige echte
   Struktur­entscheidung.
2. **Zwei zusätzliche Sektionen** im Begleiter: `## Sektion „Wissens-Dossier (A2)"`
   und `## Sektion „Von der Lehrperson bereitzustellen"`. Sie tragen **keine Nummer**,
   der Parser überspringt sie deshalb still (kein Absturz, aber auch keine Notizen).
   Wenn ihr Inhalt ins Deck soll, muss das H2-Muster erweitert werden.
3. **Sprachniveau A2.** Alle SuS-sichtbaren Texte kommen wörtlich aus den JSONs, sind
   also schon A2. Aber die **generierten Rahmensätze** stammen aus EFZ-Wortschatz
   („Bewertet wird auf zwei Spuren", „Übertragen Sie das Prinzip auf einen neuen
   Kontext"). Diese Templates gehören für EBA sprachlich geprüft und vermutlich
   vereinfacht — sie stehen alle in `buildDeck()` und sind schnell gefunden.
4. **KN-Gewicht.** Bei EBA ist das Fachgespräch die Leitform; die drei `kn_typen` sind
   trotzdem alle vorhanden. Ob die Folie das gewichten soll, ist eine didaktische Frage.
5. **`status: "entwurf"`.** Beide EBA-Einheiten sind Entwürfe und damit nur für KT1
   sichtbar. Die Deck-Route erbt das Gast-Gate, nicht aber die Entwurfs-Logik aus
   `visibleEinheiten()` / `stripDraftComponents()` — vor dem Livegang prüfen.

---

## 4. Wo der EFZ-Guard sitzt

Drei Stellen; alle bewusst gesetzt, damit EBA nicht halbfertig ausgeliefert wird:

- `deckSourceFromFullSet()` in `deck-builder.ts` → `if (!lehrgang.startsWith('EFZ')) return null`
  (steuert Route **und** Workbench-Knopf **und** ZIP)
- `scripts/build-deck.mjs` → überspringt Nicht-EFZ mit Meldung
- `deck.astro` → 404 mit Hinweistext

---

## 5. Vorgehen

```bash
npm run build:deck -- --all                     # EFZ muss weiter grün bleiben
node scripts/build-deck.mjs 1.1.1_lehrvertrag_orientieren   # nach Guard-Öffnung
cd decks/generated/1.1.1_lehrvertrag_orientieren && npx hyperframes check .
```

`check` ist der wichtigste Wächter: Es prüft Überlauf (Layout-Sampling über die ganze
Zeitachse) und Kontrast. EBA-Texte sind kürzer als EFZ-Texte, Überlauf ist also
unwahrscheinlich — aber die Grössen-Buckets (`proseClass` / `cardClass`) sind auf
EFZ-Längen kalibriert und dürfen gern nachjustiert werden.

Regressionstest für EFZ: `decks/rechte-verstehen-nutzen/` ist das **von Hand gebaute
Referenzdeck**. Es diente als Massstab beim Bau des Generators und bleibt liegen.

---

## 6. Bereits bezahltes Lehrgeld

Diese Punkte haben je einen halben Debug-Zyklus gekostet. Nicht neu entdecken.

**Notizen niemals an H3-Überschriften hängen.** `1.3.1_konsum_verantworten` hat gar
keine H3-Struktur. Zuordnung läuft ausschliesslich über *(Sektionsnummer × Callout-Typ)*.

**Callouts und Tabellen können eingerückt in Listen stehen** (so in §6 von 1.3.1). Der
Parser toleriert führende Leerzeichen; ohne das fehlen genau dort die Notizen.

**Der HyperFrames-Player taugt nicht fürs ZIP.** Er lädt die Komposition in einem
iframe und greift auf dessen Dokument zu — auf `file://` gibt Chrome jeder Datei einen
eigenen Origin und blockiert genau das. Deshalb bringt `deck.html` eigene Navigation mit.

**Jede Folie braucht `startTime`/`endTime` im Island.** Ohne das meldet der Player
„no main-line slides resolved" und zeigt gar nichts — die Auflösung über `sceneId`
allein funktioniert in dieser Player-Version nicht.

**Logo nur einmal einbetten.** Als `<img src>` pro Folie wuchs die Datei von 220 kB auf
2.9 MB. Jetzt einmal als CSS-`background-image`.

**Mindmap-Ast braucht genau ein Grid-Kind** (`.mm-bi`). Bei mehreren zieht
`grid-template-rows: 1fr` nur die erste Zeile auf, und der «Vertiefung»-Hinweis bleibt
als eigene Zeile sichtbar — das Aufklappen wirkt dann kaputt.

**Farbe ist datengetrieben.** `sit_farbe` / `sit_farbe_light` pro Herausforderung,
`--acc-dark` wird daraus abgedunkelt (das JSON liefert nur einen *helleren* Mid-Ton).
Austausch, Transfer und KN haben **keine** eigene Farbe: Im Renderer bekommt ihre
`A4Page` `sit={null}` → neutrales Slate; im Deck erben sie BBW-Tiefgrün.

**Kein `hyperframes render`.** Ein Deck ist kein linearer Film und würde abgeschnitten
exportiert.

---

## 7. Was am fertigen EFZ-Deck geprüft ist

Damit klar ist, welches Verhalten erhalten bleiben muss:

- Zwei Navigationsachsen: → Hauptlinie, ↓ Unterfolien, Leertaste in Lesereihenfolge
- Mindmap: Äste einzeln per Klick oder Leertaste aufklappen, beim Wiederbetreten zu
- Beamer-Fenster folgt Folie **und** Ast-Zustand — auch wenn es mitten in der Folie
  geöffnet wird (Handshake überträgt beides)
- Referentenansicht: Notizen, nächste Folie, Timer; Beamer-Fenster ohne jede Chrome
- Notizen tragen Tafelbild, Coaching-Moves, Stolpersteine, Scaffolds, Bewertungsfehler
