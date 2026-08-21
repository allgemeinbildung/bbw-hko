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

## Notes — Entscheide während des Laufs (Stand: Build abgeschlossen)

- **Stimme:** Lena Fischer (HeyGen Starfish `88f5e1546a4245cca66c332671eb6d78`, Deutsch), neutral,
  ohne Emotions-Tag. **Einschränkung:** HeyGen führt 23 deutsche Stimmen, alle
  bundesdeutsch — kein Schweizer Hochdeutsch. Ein Wechsel ist billig (~0.30 USD für
  alle 15 Zeilen neu).
- **`hyperframes ... --list` zeigt nur 50 Stimmen** (hart kodiertes Limit im Skript). Die
  deutschen Stimmen findet man erst über `GET /v3/voices?engine=starfish&page=N`.
- **BGM:** Die Bibliothekssuche matcht nur auf Englisch; `music:` steht darum auf
  `calm minimal underscore`. Bett auf `volume 0.10` statt 0.12, weil 189s dichte Sprache
  darüber laufen. Der Assembler loopt den 98s-Track selbst auf die volle Länge.
- **Drei TTS-Zeilen (06/07/08) fielen beim ersten Lauf mit `fetch failed` aus** und wurden
  einzeln nachgezogen. **Achtung für spätere Läufe:** `audio.mjs fetch-sfx` baut
  `audio_meta.json` aus der Engine-Meta neu und wirft dabei von Hand nachgetragene
  Stimmen und den BGM-Cue weg — erst SFX holen, dann nachpatchen.
- **Audio liegt als MP3, nicht als WAV.** Mit 16 MB WAV überschritt der Seitenaufbau die
  fest verdrahtete 10s-Navigationsgrenze von `hyperframes snapshot`. Verifiziert wurde
  darum über `hyperframes check --snapshots --at …` (respektiert `--timeout`).
- **Caption-Skin:** `captions.mjs` injiziert die Farbschlüssel aus `frame.md`
  (`--green`, `--pink`, …), das Skin liest aber `--cap-*`. Ohne Brücke fiel jede
  Caption-Farbe auf die Preset-Literale zurück — die Pille war altrosa/rot, also genau
  die Farbe, die die Video-Direktion als Chrome verbietet. Die Brücke steht jetzt in
  `.hyperframes/caption-skin.html`.
- **`frame.md` wurde nach `build-frame.mjs` von Hand korrigiert.** Die automatische
  Rollenzuordnung hatte das flächenstärkste Rot (Herausforderung A) ins Chrome gehoben
  und BBW-Grün nach hinten geschoben.
- **Frame 12 zeigt alle 27 Platten als echte Aufnahmen**, nicht fünf Fotos zwischen
  Platzhaltern — die Karte ist der Höhepunkt und muss das echte Deck zeigen.
- **Logo:** `assets/logo-bbw-mark.png` muss RGBA bleiben. Eine Verkleinerung über
  `convert("RGB")` plattet den Alphakanal auf Schwarz und das Zeichen erscheint als
  schwarzer Kasten. Auf dem dunklen Grund läuft es über
  `filter: brightness(0) invert(1)` — dieselbe Logik wie die weisse Logo-Variante der
  Plattform für den dunklen Admin-Header.

## Änderung nach Sichtung der ersten Fassung

- **Keine Untertitel.** Der Caption-Track ist entfernt (`compositions/captions.html` +
  `caption_groups.json` gelöscht, Assembler meldet `captions: no`). Die Sprache trägt
  allein. Damit ist auch die 17-%-Sperrzone am unteren Rand frei — Beschriftungen dürfen
  wieder unter die Platte.
- **Keine gezeichneten Formen auf den Folien.** Markierkreise, Highlight-Kästen, Ringe,
  Unterstreichungen, Sync-Boxen, der Zeiger samt Klick-Ripple und die Anker-Haarlinie in
  Frame 7 sind abgeschaltet (je Frame ein kommentierter `display: none`-Block). Grund:
  ihre Position war pro Platte aus Prozentwerten geschätzt und traf oft nicht die Stelle,
  auf die sie zeigen sollten.
- **Was die Aussage jetzt trägt:** die echten Zustandswechsel der Aufnahmen — Mindmap Ast
  für Ast, Musterlösung Abschnitt für Abschnitt, zwei Fenster nebeneinander, die
  27-Platten-Karte. Das war ohnehin der belastbare Teil; die Formen waren nur Zeigehilfe.
- Erhalten bleiben: Kamerafahrten und Zooms, die farbigen Herausforderungs-Rails **neben**
  der Platte, die Diagramm-Elemente in Frame 2 und 12 (aus Positionen berechnet, nicht
  geschätzt) und die Fenster-Pills in Frame 14.
- Die erste Fassung liegt als `renders/video-v1-mit-formen-und-untertiteln.mp4` daneben.

## Stimmwahl — Befunde aus den Hörproben

**Wichtig: Die Akzent-Anweisung schreibt den Text um, statt nur die Aussprache zu färben.**
Mit `Accent: Schweizer Hochdeutsch, wie es in Zürich gesprochen wird` in den Director's
Notes hat **Zubenelgenubi den Transkripttext nach Schweizerdeutsch übersetzt** — also
Dialekt gesprochen statt Hochdeutsch mit Schweizer Färbung. Andere Stimmen trugen hörbar
zu dick auf. Genau davor warnt die Gemini-Doku (Prompt-Klassifikator, „model reads your
style instructions aloud").

→ **Akzent-Anweisung ist in `scripts/gemini-tts.mjs` standardmässig AUS.** Sie lässt sich
mit `--accent` zum Vergleich zuschalten, gehört aber nicht in den Produktionslauf. Die
Style- und Pacing-Notes allein liefern den ruhigen, weichen Ton, der gewünscht war —
HeyGens Härte war ohnehin das Problem, nicht der fehlende Schweizer Akzent.

**Provider-Stand:**
- **Gemini** (`gemini-2.5-flash-preview-tts`) läuft ohne Einschränkung, 30 Stimmen,
  Sprechweise per Text steuerbar. Adapter: `scripts/gemini-tts.mjs` (Audio liegt über
  REST in `steps[].content[].data`, nicht in `output_audio` — das ist SDK-Zucker).
- **ElevenLabs** ist auf diesem Key fast dicht: keine Rechte `voices_read` / `user_read`,
  und Library-Stimmen (Charlotte, Rachel, Aria) liefern HTTP 402
  „Free users cannot use library voices via the API". Nur **Sarah**
  (`EXAVITQu4vr4xnSDxMaL`) funktioniert. Adapter: `scripts/eleven-tts.mjs`.

**Engere Auswahl nach Sichtung:** Schedar (ausgeglichen), Iapetus (klar),
Rasalgethi (informativ) — alle ohne Akzent-Anweisung.
