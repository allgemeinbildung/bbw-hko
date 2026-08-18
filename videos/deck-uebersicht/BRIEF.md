---
workflow: product-launch-video
flow: automation
storyboard: yes
message: "Sie öffnen das Unterrichtsdeck und wissen sofort, was jede Folie leistet und wie Sie sie im Klassenzimmer steuern."
destination: embed
aspect: 1920x1080
language: de
audience: "ABU-Lehrpersonen am BBW, die eine fertige /einheiten-Einheit im Unterricht halten"
length: 180s
angle: catalog
---

## Intent

Ein Onboarding-Video für Lehrpersonen: Es führt das Unterrichtsdeck einer EFZ-Einheit
(`/einheiten/<slug>/deck`) als **Baustein-Katalog** vor — jede der Hauptfolien wird benannt und
gesagt, was sie im Unterricht leistet — und schliesst mit der Steuerung (zwei Achsen, Notizen,
Beamer, Vollbild).

Kein Werbevideo. Es ist eine Tour durch etwas, das die Lehrperson bereits besitzt
(show-it-as-is): Die Bilder sind die **echten Screens des Decks**, damit die Lehrperson genau
das wiedererkennt, was sie öffnet.

Das Deck ist **generisch über alle EFZ-Einheiten** — es wird vollständig aus den JSONs +
`begleiter.md` erzeugt (`src/lib/einheiten/deck-builder.ts`). Das Video erklärt darum das Deck
**als System** und benutzt `1.1.1_rechte_verstehen_nutzen` durchgehend als Musterfall.

Ton: sachlich, kollegial, Sie-Form. Kein Marketing-Superlativ, keine Ausrufezeichen — die
Zielgruppe sind Berufsfachschullehrpersonen, die wissen wollen, wie das Ding funktioniert.

## Assets

- decks/generated/1.1.1_rechte_verstehen_nutzen/deck.html — Capture-Quelle. Byte-gleiche
  Standalone-Ausgabe der Route `/einheiten/1.1.1_rechte_verstehen_nutzen/deck`; die Live-URL ist
  Session-gated, die lokale Datei nicht.
- public/logo-bbw-mark.png — BBW-Logo (Lockup) für Titel- und Endkarte.
- public/lion-only.svg — Löwen-Wasserzeichen, wie auf den Plattform-Karten.
- decks/README.md — die verbindliche Beschreibung der zwei Achsen und der Mindmap-Mechanik.
- src/lib/einheiten/deck-builder.ts — Quelle der Folienreihenfolge und der Notizen-Herkunft.

## Customizations

- **Verhalten statt Standbild.** Die drei Mechaniken, die kein Screenshot fassen kann
  (→/↓-Achsen, Mindmap ein Ast pro Klick, Musterlösungs-Akkordeon), werden gezeigt, indem die
  **Zustände einzeln aufgenommen** und zwischen echten Frames animiert wird. Keine gezeichneten
  Diagramme, keine nachgebauten Folien.
- **Deutsche KI-Stimme** als durchgehender Faden; das Skript wird am Storyboard-Gate freigegeben,
  bevor etwas gesprochen wird.
- **Design erbt die Plattform**: BBW Tiefgrün `#0E6E3A`, `--brand-dark` `#094d28`,
  `--brand-tint` `#e8f3ec`, die Thema-Identitätsfarben und die Logo-Assets. Das Video soll wie
  ein Teil von bbw-hko.ch aussehen, weil es dort eingebettet wird.
- **Publish** am Ende: `npx hyperframes publish` für eine stabile URL, damit ein späteres Update
  denselben Link behält und die Einbettung nicht bricht.

## Notes

- Die Live-URL `https://bbw-hko.ch/einheiten/.../deck` verlangt eine Session (`deck.astro`
  leitet ohne Login um und sperrt `gast` aus). Nicht einloggen — lokal capturen.
- Das Deck nennt **keine Wochen** (bewusst, `decks/README.md`). Das Video darf keine Taktung
  behaupten; die Verteilung auf Lektionen entscheidet die Lehrperson.
- Struktur, die das Video treffen muss: Hauptlinie = Titel · Versprechen · Übersicht ·
  [Vorwissens-Check] · A · B · C · Austausch · Prinzip · Transfer · KN-Fall · KN-Formen ·
  Bewertung. Unterfolien je Herausforderung = Leitfragen · Mindmap · Handlungsprodukt
  [· Musterlösung].
- Tasten, die vorkommen müssen: → ← (Hauptlinie), ↓ ↑ (Unterfolien), Leertaste (Lesereihenfolge
  durch alle 21 Folien), N (Notizen), F (Vollbild), Beamer-Knopf (zweites Fenster,
  BroadcastChannel-Sync).
- Die Notizen sind Lehrpersonen-Material (Coaching, Tafelbild, Erwartungshorizont) und stammen
  aus `begleiter.md` — das ist ein Verkaufsargument des Decks und gehört ins Video.
