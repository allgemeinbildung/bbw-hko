# Unterrichtsdeck — 1.1.1 «Rechte verstehen & nutzen»

Deck für die Lehrperson zur Einheit `src/data/einheiten/1.1.1_rechte_verstehen_nutzen/`.
Inhalte aus den Situations-JSONs, didaktische Führung aus `begleiter.md`.

**Statische Folien, keine Animation.** Ein Tastendruck = eine Folie.

## Zwei Oberflächen

| | Was darauf läuft |
|---|---|
| **Audience-Tab** → Beamer | Nur die Folie. Keine Notizen, kein Zähler, keine Steuerung. |
| **Presenter-Tab** → Ihr Bildschirm | Folienvorschau · Notizen (editierbar) · nächste Folie · Zähler · Timer |

```bash
npm run dev
```

Dann im Browser auf **Present** klicken oder **P** drücken — der zweite Tab ist die
Beamer-Ansicht, der erste wird zur Referentenansicht. Beide synchronisieren sich.

- **→ / Leertaste** weiter · **← / Backspace** zurück
- **Google Meet:** «Bildschirm teilen → Ein Tab» und den **Audience-Tab** wählen — nicht Fenster, nicht ganzer Bildschirm
- **Zoom:** Audience-Tab in ein eigenes Fenster ziehen und dieses Fenster teilen

Die Notizen lassen sich in der Referentenansicht direkt überschreiben; die Änderungen
bleiben im Browser gespeichert, die Datei bleibt unverändert.

## Durchführungs-Variante

Das Deck ist auf **Variante A** des Begleiters gebaut: alle Lernenden bearbeiten alle
drei Herausforderungen nacheinander, eine pro Woche.

| Woche | Folien | Inhalt |
|---|---|---|
| — | 1–3 | Titel · Kompetenzversprechen · Fahrplan |
| **1** | 4–6 | Herausforderung A — Situation · Leitfragen · Regel-Spickzettel |
| **2** | 7–9 | Herausforderung B — Situation · Leitfragen · Fall-Mappe |
| **3** | 10–12 | Herausforderung C — Situation · Leitfragen · Antwortschreiben |
| **4** | 13–15 | Austausch (Plenum) · Das Prinzip · Transfer-Auftrag |
| **5** | 16–18 | KN-Hybrid-Fall · Prüfform · Bewertungsraster |

Pro Herausforderung läuft ein AViVA-Bogen über rund drei Lektionen. Die Folien geben
**keine Minutentaktung** vor — der Begleiter nennt bewusst nur Richtwerte.

Wenn Sie auf Variante B oder C umstellen (Auswahl bzw. Gruppenpuzzle), müssen Folie 3
(Fahrplan) und Folie 13 (Austausch) angepasst werden — bei Variante C ersetzt das
Gruppenpuzzle mit drei Runden die Plenumssynthese.

## Was auf der Folie steht und was nur Sie sehen

**Folie (Lernende):** Situationstext, Zahlen-Tabelle, Leitfrage, die vier Leitfragen mit
Bloom-Stufe und Kapitelverweis, Format und Vorgehen des Handlungsprodukts, Selbstcheck,
Zielkonflikt, Transfer-Auftrag, Hybrid-Fall, Prüfformen, Bewertungsraster.

**Notizen (nur Lehrperson):**

- **Tafelbild** — die fachliche Soll-Lösung mit Pflicht-Ästen und optionaler Vertiefung
- **Coaching-Moves** pro Leitfrage und die typischen **Stolpersteine** mit der Frage, die weiterhilft
- **Mehrdeutigkeit halten** — wie der Zielkonflikt offen bleibt
- **Scaffolds** 80 % / 100 % zum Abgeben
- **Bewertung** — zwei getrennte Noten, häufigster Bewertungsfehler

Die erste Notizzeile ist bewusst kurz: sie erscheint in der Referentenansicht als
Vorschau auf die nächste Folie.

Der vollständige Erwartungshorizont je KN-Frage steht im Begleitdokument, Kapitel 8 —
er ist zu lang für das Notizfeld und wird beim Korrigieren gebraucht, nicht im Unterricht.

## Bearbeiten

Alles liegt in `index.html`, die Folien sind kommentiert (`<!-- 4 · A SITUATION -->`).
Die Notizen stehen im JSON-Island oben (`application/hyperframes-slideshow+json`), je
Folie unter `notes`; `\n\n` trennt Absätze.

Farben: `--acc` pro Folie. A/B/C übernehmen die `sit_farbe` der Einheit (A `#C0392B`,
B `#1A5276`, C `#1E8449`), Rahmenfolien BBW-Tiefgrün `#0E6E3A`.

Nach jeder Änderung:

```bash
npm run check
```

> Nicht `hyperframes render` verwenden — ein Deck ist kein linearer Film und würde
> abgeschnitten exportiert. Für Standbilder `npm run snapshot`.

### Zwei Dinge, die beim Umbauen leicht kaputtgehen

- Jede Folie braucht `startTime`/`endTime` im Island. Der Player meldet sonst
  «no main-line slides resolved» und zeigt gar nichts.
- Die erste Folie (`#scene-titel`) ist per CSS sichtbar gesetzt. Ohne das zeigt ein frisch
  geöffneter Audience-Tab ein leeres Bild, bis zum ersten Weiterklicken.
