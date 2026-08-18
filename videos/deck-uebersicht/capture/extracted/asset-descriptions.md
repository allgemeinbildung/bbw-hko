# Asset-Inventar — Unterrichtsdeck (echte Captures)

Alle PNGs sind **echte Pixel des Decks**, aufgenommen an `http://localhost:4600/1.1.1_rechte_verstehen_nutzen/deck.html`
(byte-gleiche Standalone-Ausgabe der Route `/einheiten/1.1.1_rechte_verstehen_nutzen/deck`).
Aufnahme über die Tastatur-API des Decks selbst — nichts nachgebaut, nichts gezeichnet.
Auflösung 3840×2160 (2× von 1920×1080), `prefers-reduced-motion: reduce`, damit jede Aufnahme ein
ausgelaufener Endzustand ist und kein halb gezeichneter Frame.

## Struktur, die die Aufnahmen belegen

12 Spalten auf der Hauptlinie; drei davon (A/B/C) tragen je 5 Unterfolien. 27 Szenen gesamt.
`capture/deck/map.json` hält die vom Deck selbst ermittelte Achsen-Karte.

## `capture/deck/slides/` — die 27 sauberen Folienplatten (ohne Bedienleiste, ohne Notizen)

Dateiname trägt die Position: `NN-c<Spalte>r<Zeile>-<scene-id>.png`. `r0` = Hauptlinie.

| Datei | Was darauf ist | Rolle im Video |
|---|---|---|
| `00-c0r0-titel.png` | Titelfolie: Einheitentitel, Kompetenzversprechen-Zeile, drei farbige Herausforderungs-Chips (A rot, B blau, C grün), Austausch- + KN-Chip, Lebensbezug-Fusszeile, BBW-Lockup, Löwen-Wasserzeichen | Eröffnung; zeigt sofort die Farbwelt der ganzen Einheit |
| `01-c1r0-versprechen.png` | Kompetenzversprechen als Zitat + drei Karten (eine je Herausforderung) + Aspekte-Chips | Baustein «Der Massstab» |
| `02-c2r0-ablauf.png` | Ablauf als Stufenliste A · B · C · Austausch · Kompetenznachweis | Baustein «Überblick»; gute Basis für die Achsen-Erklärung |
| `03-c3r0-a-situation.png` | Herausforderung A, Situationstext, Persona, Emotion-Tag; unten rechts das Badge «↓ 5 Unterfolien» | Beleg, dass die Folie eine Tiefe hat |
| `04-c3r1-a-leitfragen.png` | Vier Leitfragen von Verstehen bis Formulieren | Unterfolie 1 |
| `05-c3r2-a-leitfragen-loesung.png` | «So sieht eine tragfähige Antwort aus» — Akkordeon, geschlossen | Unterfolie 2 |
| `06-c3r3-a-mindmap.png` | Mindmap-Folie, Äste geschlossen | Unterfolie 3 |
| `07-c3r4-a-produkt.png` | Handlungsprodukt Regel-Spickzettel | Unterfolie 4 |
| `08-c3r5-a-muster.png` | Musterlösung, Akkordeon geschlossen | Unterfolie 5 |
| `09-c4r0-b-situation.png` … `14-c4r5-b-muster.png` | dieselbe Fünferkette für Herausforderung B (Fall-Mappe, blau) | Beweis, dass die Kette pro Herausforderung identisch ist |
| `15-c5r0-c-situation.png` … `20-c5r5-c-muster.png` | dieselbe Fünferkette für Herausforderung C (Antwortschreiben, grün) | dito |
| `21-c6r0-austausch.png` | «Was haben Ihre drei Herausforderungen gemeinsam?» | Baustein «Austausch» |
| `22-c7r0-prinzip.png` | Das Prinzip hinter allen drei Herausforderungen | Baustein «Prinzip» |
| `23-c8r0-transfer.png` | Transfer auf einen neuen Kontext | Baustein «Transfer» |
| `24-c9r0-kn-fall.png` | Mini Case — die Lohnabzug-Anfrage um 21 Uhr | Baustein «KN-Fall» |
| `25-c10r0-kn-formen.png` | Der Nachweis in einer von drei Formen | Baustein «KN-Formen» |
| `26-c11r0-kn-bewertung.png` | Bewertung auf zwei Spuren (Sprache/Kommunikation, Gesellschaft) | Schlussbaustein |

## `capture/deck/states/` — die Verhalten, die kein Standbild fasst

| Datei | Zustand |
|---|---|
| `mindmap-0-zu.png` | Zentrum + vier Ast-Titel, alle zu (`+`), der optionale Ast gestrichelt rosa |
| `mindmap-1-offen.png` … `mindmap-4-offen.png` | je ein Ast mehr offen (`−`), Inhalt eingeblendet |
| `muster-0-zu.png` | Musterlösung, alle Abschnitte zu |
| `muster-1-offen.png` … `muster-3-offen.png` | Akkordeon: genau ein Abschnitt offen, Öffnen schliesst den vorigen |

Als Sequenz abgespielt ergeben diese Platten die echte Klick-Mechanik — ohne dass irgendetwas
animiert nachgebaut werden müsste.

## `capture/deck/chrome/` — die Bedienung

| Datei | Was darauf ist |
|---|---|
| `presenter-titel.png` | volle Referentenansicht auf der Titelfolie: Folie links, Notizenspalte rechts, Bedienleiste unten |
| `presenter-a-situation.png` | dito auf Herausforderung A — Notizen zeigen Coaching + Unterrichtsfahrplan aus `begleiter.md` |
| `presenter-a-mindmap.png` | **Schlüsselbild**: Zähler «4 / 12 · 3/5» (beide Achsen gleichzeitig sichtbar), Notizen mit TAFELBILD-Erwartungsbild, «Als Nächstes»-Zeile, Timer |
| `presenter-kn-bewertung.png` | Referentenansicht auf der Bewertungsfolie |
| `bar.png` | die Bedienleiste freigestellt: ‹ · Zähler · › · ↑ ↓ · Notizen · Beamer · Vollbild |
| `beamer-audience.png` | das Beamer-Fenster (`?mode=audience`): nur die Folie, keine Notizen, keine Leiste — was die Klasse sieht |

`presenter-*.png` + `beamer-audience.png` nebeneinander ergeben das Zwei-Fenster-Bild
(Lehrpersonen-Ansicht / Klassenansicht), ohne dass eine Doppelfenster-Aufnahme nötig wäre.

## `capture/assets/svgs/`

Drei SVGs aus der Seite (Mindmap-Verbindungslinien `mm-links` u. a.). Für das Video nicht nötig —
die Linien sind in den Folienplatten bereits enthalten.

## Nicht vorhanden

Keine Fotos, keine Videos, keine Logodateien in dieser Aufnahme. Logo und Löwe stehen im
Repository (`public/logo-bbw-mark.png`, `public/lion-only.svg`) und sind in `BRIEF.md` als
Assets geführt.
