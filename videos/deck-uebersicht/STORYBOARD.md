---
format: 1920x1080
duration: 189s
message: "Sie öffnen das Unterrichtsdeck und wissen sofort, was jede Folie leistet und wie Sie sie im Klassenzimmer steuern."
arc: Hook → Versprechen → Bausteine (Katalog) → Mechanik → Steuerung → Abschluss
audience: "ABU-Lehrpersonen am BBW, die eine fertige /einheiten-Einheit im Unterricht halten"
mode: collaborative
music: calm minimal underscore
# Die Bibliothekssuche trifft nur auf Englisch — eine deutsche Stimmungsbeschreibung
# liefert keinen Treffer (getestet). Gemeint ist: ruhiger sachlicher Unterton, leises Pad,
# kein Drive. Bett liegt bei volume 0.10 statt der üblichen 0.12, weil 190s dichte
# deutsche Sprache darüber laufen.
---

## Video direction

**Palette (from `frame.md`, nothing invented).** Ground is `cream` `#0B1410` — the deck's own
`#stage` colour, so every captured slide plate sits on exactly the ground it sits on inside the
app. Secondary surface `cream-2` `#10201A` = the deck's own notes panel. Text is `ink` `#E8F3EC`.
The single accent is `green` `#8FD0A6` on dark, `green-deep` `#0E6E3A` for fills that carry white
text. `hf-a/b/c` (`#C0392B` · `#1A5276` · `#1E8449`) appear **only** when the video is speaking
about that Herausforderung — never as chrome, never as furniture. Chrome labels use the mono
`label` role (uppercase, tracked); all display and body type is the `Inter` ramp by role.

**Motion grammar + reveal model.** One camera, one feel. Long-tail settles — `power3` default,
never `back.out` / `bounce.out` / `elastic.out`. Every frame is **paced to the voiceover**: at
t=0 only what the VO is saying enters, and each further piece reveals on its spoken cue, weighted
into the back half. The Scene windows below are cut against the **real word timings** in
`audio_meta.json`, not estimates. Captured plates never arrive as a batch — one per named cue.

**The plates are the subject.** A slide plate is presented **inset on the ground**, ~78–86% of the
canvas width in the top ~83%, never full-bleed: it must read as *a slide the teacher will open*,
and the bottom ~17% stays clear for the caption band. Plate edges get a hairline `2px` rule
(`rule` token), no drop shadows — the pack is flat paper.

**Rhythm / held frames.** Deliberately held reads, placed so the film varies its energy:
**Frame 3** (the orientation breather), **Frame 7** (after the click mechanics), **Frame 11**
(the calm before the climax), and the last window of **Frame 12** (the payoff sits still). In a
hold the only sanctioned aliveness is low-amplitude `subtle jitter` (`sine-wave-loop`) — nothing
breathes, nothing drifts.

**Real state, never faked state.** Every mindmap/accordion/two-window change cuts between
**separately captured PNGs of that state**. No element is animated to imitate a behaviour the
deck performs itself. Cursors and highlight markers are the only drawn overlays.

**Negative list.** No browser chrome, nav bars, scrollbars or real OS cursors (the demo cursor is
a drawn overlay and is the one exception). No bokeh, no purple-blue "AI" gradients, no drop
shadows, no gradient fills — the pack is flat. No slideshow (front-load then freeze) and no
screensaver (independently floating elements). No `repeat`/`yoyo`, no `Math.random`, no wall-clock.
No slow pan or push in the back half of any frame. No Herausforderung colour used as chrome.

**Nachtrag (nach Sichtung der ersten Fassung).** Untertitel sind entfernt, und die auf die
Folien gezeichneten Formen (Markierkreise, Highlight-Kästen, Ringe, Unterstreichungen,
Sync-Boxen, Zeiger, Anker-Haarlinie) sind abgeschaltet — ihre Prozent-Positionen trafen oft
daneben. Die unten beschriebenen Szenen laufen unverändert, nur ohne diese Zeigehilfen: die
**echten Zustandswechsel der Aufnahmen** tragen jede Aussage allein.

## Frame 1 — Was Sie schon haben


- scene: Extreme Nahaufnahme auf die Notizenspalte — Coaching-Text aus begleiter.md; eine durchgehende Rückfahrt öffnet die ganze Referentenansicht
- voiceover: "Diese Notiz haben Sie nicht geschrieben. Den Fahrplan auch nicht. Und das Erwartungsbild ebenso wenig. Für jede Einheit auf der Plattform liegt das alles schon bereit — in einem einzigen Deck."
- duration: 11.024s
- transition_in: cut
- status: animated
- src: compositions/frames/01-was-sie-schon-haben.html
- type: hook
- persuasion: Friction reduction
- beat: relief + curiosity
- blueprint: zoom-out-workspace-reveal (Reproduce)
- focal: assets/presenter-a-mindmap.png
- roles: presenter-a-mindmap = cutout (the hero plate; its notes column is the opening macro)
- sfx: none
- asset_candidates: assets/presenter-a-mindmap.png — volle Referentenansicht, Notizen mit TAFELBILD-Erwartungshorizont, Zähler 4/12 · 3/5

Scene 1 (0.0–2.3s): extreme macro on the notes column only — the TAFELBILD paragraph fills the frame, `ink` on `cream-2`, type large enough to actually read three lines. Nothing else on screen. The one continuous decelerating **zoom-out** (`multi-phase-camera`) starts here and never stops or reverses; full-bleed macro, single depth layer.
Scene 2 (2.3–4.0s): the pull-back widens; as the VO says «Den Fahrplan», the UNTERRICHTSFAHRPLAN block enters at the lower edge and a **keyword glow** (`asr-keyword-glow`) lands on that heading as it is spoken.
Scene 3 (4.0–6.5s): still pulling back; the ERWARTUNGSHORIZONT lines enter on their cue at 5.0s with the same glow. Two depth layers now — notes column foreground, slide edge appearing behind at left.
Scene 4 (6.5–9.6s): the pull-back opens to the whole presenter view — slide left, notes right, control bar below — settling to ~84% of canvas in the top 83%. Three depth layers. Motion decelerates onto its long tail; no re-push.
Scene 5 (9.6–11.024s): locked and **still**. On «in einem einzigen Deck» a hairline accent rule (`green`) draws once beneath the whole plate (`svg-path-draw`). Held read; at most `subtle jitter` (`sine-wave-loop`, low amplitude).

narrativeRole: Öffnet auf dem fertigen Ergebnis statt auf einer Funktion — die Lehrperson sieht zuerst, was ihr abgenommen wird.
keyMessage: Die Vorbereitung liegt schon da.

## Frame 2 — Zwölf Bausteine, zwei Achsen

- scene: Die Fläche räumt sich frei, drei Zeilen bauen sich auf — zwölf Bausteine, zwei Achsen, eine Einheit
- voiceover: "Das Deck ist kein Foliensatz, den Sie durchklicken. Es ist ein Bauwerk: zwölf Bausteine auf der Hauptlinie — und unter dreien davon je fünf Unterfolien in der Tiefe."
- duration: 10.684s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/02-zwoelf-bausteine.html
- type: product_intro
- persuasion: Rule of three
- beat: clarity
- blueprint: kinetic-type-beats (Reproduce)
- sfx: none
- asset_candidates:

Scene 1 (0.0–3.3s): bare `cream` field, no plates. Centred, ~55% of frame: «KEIN FOLIENSATZ» builds by **per-word staggered reveal** (`dynamic-content-sequencing`) on a long-tail settle, `ink` at display weight. Mono `label` chip «DAS DECK» sits in the upper third.
Scene 2 (3.3–4.8s): on «Es ist ein Bauwerk» the line is replaced by «EIN BAUWERK.» as a **hard-cut flash word-swap** (`discrete-text-sequence`) — instant, same optical centre, no fade. The swap is the beat.
Scene 3 (4.8–7.1s): the line lifts to the upper third; beneath it, as «zwölf Bausteine» lands at 4.8s, a horizontal rail of **twelve tick marks draws left→right** (`svg-path-draw`) in `green`, with the numeral 12 counting up beside it (`counting-dynamic-scale`). Full-width strip, two depth layers.
Scene 4 (7.1–10.684s): on «unter dreien davon je fünf», three of the twelve ticks brighten to `green-deep` and from each, five short vertical ticks drop downward in a staggered cascade (`center-outward-expansion`, downward register). The two-axis shape now exists as pure diagram. Settles and holds still.

narrativeRole: Setzt die These der ganzen Einheit — alles Folgende ist Beleg dafür.
keyMessage: Zwölf Bausteine, zwei Achsen.

## Frame 3 — Der Einstieg: Titel, Versprechen, Überblick

- scene: Drei ruhige Karten nacheinander — Titelfolie, Kompetenzversprechen, Ablauf; jede hält kurz still
- voiceover: "Die ersten drei Bausteine ordnen ein. Der Titel zeigt die Farbwelt der Einheit. Das Kompetenzversprechen nennt den Massstab — ein Satz, an dem am Schluss gemessen wird. Und der Überblick legt den Weg offen: A, B, C, Austausch, Nachweis."
- duration: 18.704s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-einstieg.html
- type: feature_showcase
- persuasion: Feature-to-benefit translation
- beat: orientation
- blueprint: titlecard-reveal (Adapt)
- focal: assets/01-c1r0-versprechen.png
- roles: 00-c0r0-titel = supporting (card 1) · 01-c1r0-versprechen = cutout (the hero — the Massstab is the beat) · 02-c2r0-ablauf = supporting (card 3)
- sfx: none
- asset_candidates: assets/00-c0r0-titel.png — Titelfolie mit den drei farbigen Herausforderungs-Chips; assets/01-c1r0-versprechen.png — Kompetenzversprechen als Zitat plus drei Karten; assets/02-c2r0-ablauf.png — Ablauf als Stufenliste

Adapt: keep titlecard-reveal's card CHAIN and its one-restrained-move-per-card discipline; three cards instead of two, seamed by **cut-the-curve** rather than hard cuts, because this is the video's orientation breather and the seams should not punch. Longest frame in the film — the extra time is spent on holds, not on more motion.
Scene 1 (0.0–2.9s): empty ground; mono `label` «BAUSTEIN 01 · 02 · 03» slides up and holds. Nothing else.
Scene 2 (2.9–6.0s): card 1 — the Titel plate — enters with ONE move (slide-up + crossfade, `spring-pop-entrance` in its smooth-settle register), inset ~80%, hairline rule. On «Farbwelt» at 4.1s the three Herausforderung chips on the plate light in sequence (`asr-keyword-glow`) in `hf-a` → `hf-b` → `hf-c`. Then still.
Scene 3 (6.0–11.1s): **cut-the-curve** (`cut-catalog.md`) to card 2 — the Versprechen plate, both sides moving left at matched velocity. It holds. On «Massstab» at 7.9s a marker **highlight sweep** (`css-marker-patterns`) draws across the quote line; on «gemessen wird» at 9.9s the sweep completes. Held read otherwise — this is an allocated breather.
Scene 4 (11.1–14.1s): cut-the-curve to card 3 — the Ablauf plate. It arrives and simply holds while the VO says «legt den Weg offen».
Scene 5 (14.1–18.704s): the five step rows on the plate highlight one by one exactly on their spoken cues — A@14.1, B@15.0, C@15.8, Austausch@16.5, Nachweis@17.6 (`asr-keyword-glow`, `hf-a/b/c` for the first three, `green` for the last two). The frame ends still, the whole path lit.

narrativeRole: Erster Katalogblock — die Bausteine, die vor dem Unterricht Orientierung geben.
keyMessage: Der Massstab steht vor der ersten Aufgabe.

## Frame 4 — Eine Herausforderung, eine Folie

- scene: Die Folie Herausforderung A schwebt als Fläche; eine Kamerafahrt landet unten rechts auf dem Badge «↓ 5 Unterfolien»
- voiceover: "Dann kommt die erste Herausforderung. Eine Situation, eine Person, ein Betrieb — auf einer einzigen Folie. Und unten rechts dieser Hinweis: Hier geht es tiefer."
- duration: 12.983s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-herausforderung-a.html
- type: feature_showcase
- persuasion: Show-don't-tell proof
- beat: curiosity
- blueprint: device-surface-showcase (Adapt)
- focal: assets/03-c3r0-a-situation.png
- roles: 03-c3r0-a-situation = cutout (the hero surface)
- sfx: none
- asset_candidates: assets/03-c3r0-a-situation.png — Herausforderung A mit Situationstext, Persona und dem Badge «↓ 5 Unterfolien»

Adapt: keep the blueprint's hero-surface-held-while-the-camera-ranges structure and its static-hold-into-push camera. Drop the device mockup entirely — the deck is a web surface, not a product in a phone, and a fake device frame would misrepresent what the teacher opens. The plate itself is the hero surface.
Scene 1 (0.0–2.9s): the A plate arrives centred, inset ~82%, `hf-a` accent rail down its left edge (the plate's own red). Smooth settle, no overshoot. Two depth layers (plate + ground).
Scene 2 (2.9–6.2s): three region markers land on the plate on their spoken cues — a hand-drawn **circle** around the situation paragraph at 2.9s («Eine Situation»), around the persona line at 4.4s («eine Person»), around the Betrieb line at 5.6s («ein Betrieb») — all `css-marker-patterns`, `green`, each drawing in ~0.4s and staying.
Scene 3 (6.2–8.6s): on «auf einer einzigen Folie» the three markers fade together and the plate reads whole and **still** for two seconds. Deliberate stillness against the marker activity.
Scene 4 (8.6–11.4s): **zoom-to-target** (`coordinate-target-zoom`) onto the badge «↓ 5 Unterfolien» at the plate's lower right — scale plus counter-translate so the badge stays framed; the rest of the plate falls out of focus with **selective blur** (`depth-of-field-blur`).
Scene 5 (11.4–12.983s): the badge holds large in the lower third. On «Hier geht es tiefer» its ↓ glyph pulses once (`press-release-spring`, single finite beat). Holds.

narrativeRole: Führt die zweite Achse ein, ohne sie schon zu erklären — das Badge stellt die Frage.
keyMessage: Jede Herausforderung hat eine Tiefe.

## Frame 5 — Die Fünferkette

- scene: Fünf Kacheln fahren gestaffelt ein — Leitfragen, tragfähige Antwort, Mindmap, Handlungsprodukt, Musterlösung
- voiceover: "Unter jeder Herausforderung liegt dieselbe Kette. Vier Leitfragen. Wie eine tragfähige Antwort aussieht. Die Mindmap. Das Handlungsprodukt. Und ein ausgefülltes Muster."
- duration: 12.095s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-fuenferkette.html
- type: feature_showcase
- persuasion: Value stacking
- beat: confidence
- blueprint: grid-card-assemble (Adapt)
- focal: assets/06-c3r3-a-mindmap.png
- roles: 04-c3r1-a-leitfragen = supporting · 05-c3r2-a-leitfragen-loesung = supporting · 06-c3r3-a-mindmap = cutout (centre of the chain, and the next frame's subject) · 07-c3r4-a-produkt = supporting · 08-c3r5-a-muster = supporting
- sfx: none
- asset_candidates: assets/04-c3r1-a-leitfragen.png — vier Leitfragen; assets/05-c3r2-a-leitfragen-loesung.png — tragfähige Antwort, Akkordeon geschlossen; assets/06-c3r3-a-mindmap.png — Mindmap, Äste zu; assets/07-c3r4-a-produkt.png — Handlungsprodukt Regel-Spickzettel; assets/08-c3r5-a-muster.png — Musterlösung, Akkordeon geschlossen

Adapt: keep the staggered self-assembling cascade and the closing camera zoom-OUT that reveals the finished array. Change the cascade from "all five on one stagger" to **one card per spoken cue** — five separate reveals across 3.3–11.4s — because the VO names the five members one at a time and a single burst would front-load the whole shot.
Scene 1 (0.0–3.3s): the A plate sits small in the upper left (~22% width, the parent), `hf-a` rail. A vertical connector line **draws downward** from it (`svg-path-draw`) while the VO says «dieselbe Kette». Asymmetric 30/70, two depth layers.
Scene 2 (3.3–5.1s): card 1 (Leitfragen) slides in from the right and clips onto the connector at «Vier Leitfragen» (3.3s). Long-tail settle.
Scene 3 (5.1–7.7s): card 2 (Lösung der Leitfragen) arrives the same way at 5.1s («Wie eine tragfähige Antwort aussieht»).
Scene 4 (7.7–8.8s): card 3 (Mindmap) at 7.7s — the focal; it lands slightly larger than its siblings and holds the `green` hairline.
Scene 5 (8.8–10.3s): card 4 (Handlungsprodukt) at 8.8s.
Scene 6 (10.3–12.095s): card 5 (Musterlösung) at 10.3s completes the column; the camera then eases **back** just enough to fit all five plus the parent in frame (`multi-phase-camera`, single decelerating pull, no drift after). Holds.

narrativeRole: Der Kern des Katalogs — die Kette, die sich dreimal wiederholt.
keyMessage: Fünf Unterfolien, immer dieselben fünf.

## Frame 6 — Die Mindmap kommt auf Klick

- scene: Die Mindmap-Folie steht; ein Zeiger tippt einen Ast nach dem anderen an, jeder klappt auf — echte Aufnahmen der vier Zustände
- voiceover: "Die Mindmap ist Ihr Tafelbild. Beim Betreten stehen nur das Zentrum und die Ast-Titel da. Ein Klick, ein Ast. Sie sammeln zuerst mit der Klasse — und decken erst dann auf. Der gestrichelte Ast ist die Vertiefung für hundert Prozent."
- duration: 13.04s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-mindmap-klick.html
- type: feature_showcase
- persuasion: Show-don't-tell proof
- beat: control
- blueprint: cursor-ui-demo (Adapt)
- focal: assets/mindmap-4-offen.png
- roles: mindmap-0-zu = cutout (opening state) · mindmap-1-offen = cutout (state 2) · mindmap-2-offen = cutout (state 3) · mindmap-3-offen = cutout (state 4) · mindmap-4-offen = cutout (final state, the focal)
- sfx: click-soft
- asset_candidates: assets/mindmap-0-zu.png — alle Äste zu, optionaler Ast gestrichelt; assets/mindmap-1-offen.png — erster Ast offen; assets/mindmap-2-offen.png — zwei Äste offen; assets/mindmap-3-offen.png — drei Äste offen; assets/mindmap-4-offen.png — alle vier offen

Adapt: keep the signature — a visible cursor driving a real UI so the screen changes state shot-to-shot — and keep the locked static stage with element swaps doing the camera work. The one change: the state changes are **not reconstructed**; each is a separately captured PNG of the real deck, cut between at the click. The cursor is the only drawn element in the frame.
Scene 1 (0.0–2.0s): `mindmap-0-zu` arrives centred, inset ~84%, `hf-a` rail. Closed state — centre and four branch titles only. Smooth settle.
Scene 2 (2.0–5.1s): locked stage, no camera. As «Zentrum» (3.4s) and «Ast-Titel» (4.1s) are spoken, the centre node then the four `+` badges take a brief **keyword glow** (`asr-keyword-glow`) in sequence. Nothing opens yet.
Scene 3 (5.1–6.7s): the drawn cursor travels to branch 1 and clicks — press compression plus expanding **ripple** (`cursor-click-ripple`) — and on the click's peak the plate cuts to `mindmap-1-offen` (**zoom-through** seam, `cut-catalog.md`, minimal Z travel). One click, one branch, exactly as the VO says.
Scene 4 (6.7–8.3s): **held**. The cursor rests. Nothing opens while the VO says «Sie sammeln zuerst mit der Klasse» — the stillness is the teaching point.
Scene 5 (8.3–9.9s): on «und decken erst dann auf» two clicks land in quick succession — cut to `mindmap-2-offen` at 8.5s, to `mindmap-3-offen` at 9.2s, each a velocity-matched cut on the click.
Scene 6 (9.9–13.04s): the cursor moves to the dashed branch and clicks at 10.0s → `mindmap-4-offen`. A **zoom-to-target** (`coordinate-target-zoom`) eases onto that dashed branch as «Vertiefung für hundert Prozent» lands at 11.2s; the dashed border takes one `green` glow pulse. Holds still.

narrativeRole: Erstes der drei Verhalten, die kein Standbild fasst — hier wird der Katalog zur Mechanik.
keyMessage: Sie steuern, wann die Lösung erscheint.

## Frame 7 — Die Musterlösung öffnet einzeln

- scene: Der Kopf der Musterlösungsfolie bleibt fix, darunter wechseln die Abschnitte — einer auf, der vorige zu
- voiceover: "Die Musterlösung arbeitet anders: immer nur ein Abschnitt offen. Öffnen Sie den nächsten, schliesst der vorige. So bleibt an der Wand stehen, worüber Sie gerade sprechen."
- duration: 11.42s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-musterloesung.html
- type: benefit_highlight
- persuasion: Friction reduction
- beat: ease
- blueprint: fixed-anchor-cycle (Reproduce)
- focal: assets/muster-2-offen.png
- roles: muster-0-zu = cutout (anchor established) · muster-1-offen = cutout (state 2) · muster-2-offen = cutout (the focal — the swap that proves the accordion) · muster-3-offen = cutout (state 4)
- sfx: click-soft
- asset_candidates: assets/muster-0-zu.png — alle Abschnitte zu; assets/muster-1-offen.png — erster Abschnitt offen; assets/muster-2-offen.png — zweiter offen, erster zu; assets/muster-3-offen.png — dritter offen

Scene 1 (0.0–2.8s): the `muster-0-zu` plate arrives, inset ~84%. The plate's **header region is the pinned anchor** — it enters once and never moves again for the rest of the frame; a mono `label` «MUSTERLÖSUNG» locks beside it. All sections closed.
Scene 2 (2.8–4.9s): on «immer nur ein Abschnitt offen» (2.8s) the plate cuts to `muster-1-offen` — section one opens. Velocity-matched cut; the anchor region is pixel-identical across the cut, so the header visibly does not move.
Scene 3 (4.9–8.1s): the cycle proves itself — cut to `muster-2-offen` at 5.6s on «den nächsten», and to `muster-3-offen` at 6.8s on «schliesst der vorige». Each cut simultaneously opens one section and closes the previous; a brief `green` **highlight sweep** (`css-marker-patterns`) marks the section that just closed, so the closing is legible and not merely absent.
Scene 4 (8.1–11.42s): **held read** — an allocated breather. One section open, the anchor still, an **ambient glow** (`ambient-glow-bloom`) blooming softly behind the open section only. No camera, no drift; `subtle jitter` at most.

narrativeRole: Zweites Verhalten; zeigt zugleich, dass die Mechanik pro Folientyp bewusst verschieden ist.
keyMessage: Ein Abschnitt, nie die ganze Lösung.

## Frame 8 — Dreimal dieselbe Kette, drei Farben

- scene: Eine Kamerafahrt reist von der roten Spalte A über die blaue B zur grünen C; die Kette darunter bleibt sichtbar identisch
- voiceover: "B und C laufen genauso. Andere Situation, anderes Produkt, andere Farbe — aber dieselbe Kette. Wer A einmal gehalten hat, kennt B und C schon."
- duration: 10.61s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/08-abc.html
- type: benefit_highlight
- persuasion: Negative contrast
- beat: confidence
- blueprint: camera-journey (Adapt)
- focal: assets/15-c5r0-c-situation.png
- roles: 09-c4r0-b-situation = supporting (station B) · 15-c5r0-c-situation = cutout (station C, the landing) · 12-c4r3-b-mindmap = background (depth layer behind B, dim ~40%) · 18-c5r3-c-mindmap = background (depth layer behind C, dim ~40%)
- sfx: none
- asset_candidates: assets/09-c4r0-b-situation.png — Herausforderung B, Fall-Mappe, blau; assets/15-c5r0-c-situation.png — Herausforderung C, Antwortschreiben, grün; assets/12-c4r3-b-mindmap.png — Mindmap B; assets/18-c5r3-c-mindmap.png — Mindmap C

Adapt: use sub-shape **(B) cursorless flight** — a continuous multi-leg camera journey across one wide world, no cursor anywhere. Keep the motivated travel and the landing push. The world is a horizontal strip holding all three colour columns; the camera enters already moving so the frame inherits Frame 7's stillness by contrast.
Scene 1 (0.0–2.5s): open mid-flight on the B plate (blue, `hf-b` rail), its mindmap plate sitting behind it as a dimmed depth layer (~40%). Layered-depth framing, three layers. The camera is already travelling right.
Scene 2 (2.5–4.6s): the journey continues; the C plate (green, `hf-c`) enters from the right on «anderes Produkt» (3.7s) with its own dimmed mindmap behind. **Motion-blur streak** (`motion-blur-streak`) on the travel, easing off as C centres.
Scene 3 (4.6–5.5s): on «andere Farbe» (4.6s) the three accent rails — `hf-a` (off-screen left, brought in as a slim marker), `hf-b`, `hf-c` — align on one horizontal line and each takes a single glow. The colour claim, stated in one beat.
Scene 4 (5.5–7.0s): on «aber dieselbe Kette» the camera pulls **back** in one decelerating move; under each of the three columns the identical five-card chain appears as small silhouettes — three columns, one shape.
Scene 5 (7.0–10.61s): locked wide, no further camera. On «Wer A einmal gehalten hat» the A column dims to ~35% (already learned) while B and C hold full strength. Still to the end.

narrativeRole: Zahlt den Katalog aus — die Struktur ist gelernt, nicht dreimal neu.
keyMessage: Einmal verstanden, dreimal anwendbar.

## Frame 9 — Vom Fall zum Prinzip

- scene: Drei Stationen auf einer Fläche, die Kamera schwenkt von Austausch über Prinzip zu Transfer
- voiceover: "Danach hebt das Deck ab. Was haben die drei Herausforderungen gemeinsam? Das ist der Austausch. Daraus wird das Prinzip. Und das Prinzip wandert in einen neuen Kontext — der Transfer."
- duration: 11.755s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-prinzip.html
- type: feature_showcase
- persuasion: Feature-to-benefit translation
- beat: clarity
- blueprint: spatial-pan-stations (Reproduce)
- focal: assets/22-c7r0-prinzip.png
- roles: 21-c6r0-austausch = supporting (station 1) · 22-c7r0-prinzip = cutout (station 2, the focal — the unit's didactic core) · 23-c8r0-transfer = supporting (station 3, the landing)
- sfx: none
- asset_candidates: assets/21-c6r0-austausch.png — Was haben Ihre drei Herausforderungen gemeinsam; assets/22-c7r0-prinzip.png — das Prinzip hinter allen dreien; assets/23-c8r0-transfer.png — Transfer auf einen neuen Kontext

Scene 1 (0.0–1.9s): one oversized canvas, the three station plates pre-placed left→right and stepping visibly **upward** (the abstraction ladder is spatial, not decorative). All dim at ~45%. Camera at the left edge. Wide, three depth layers.
Scene 2 (1.9–4.9s): a single lateral **pan** (`viewport-change`) centres station 1 (Austausch) and brings it to full strength; on «gemeinsam?» (3.8s) a callout line reveals beside it.
Scene 3 (4.9–6.4s): station 1's mono label «AUSTAUSCH» stamps in on its cue (4.9s) with a spring-pop settle. Camera holds.
Scene 4 (6.4–8.1s): pan up-right to station 2 (Prinzip), the focal — it centres slightly larger than its neighbours and its label «PRINZIP» stamps at 7.2s. The previous station dims back to ~45% as it leaves centre.
Scene 5 (8.1–11.755s): final pan up-right to station 3 (Transfer); it centres at ~9.9s and the label stamps on «der Transfer» (10.9s). The camera lands and **holds** — the three stations visible as one rising line, the ladder complete.

narrativeRole: Der didaktische Kern der Einheit — die Abstraktionsleiter als eigener Katalogblock.
keyMessage: Drei Fälle werden zu einem Prinzip.

## Frame 10 — Der Nachweis

- scene: Die Fallfolie hält als Fläche, dann fahren drei Karten ein — Fachgespräch, Mini Case, Werkschau
- voiceover: "Am Ende steht der Kompetenznachweis. Ein neuer Fall, den die Lernenden noch nie gesehen haben. Und er läuft in einer von drei Formen — Sie entscheiden, welche zu Ihrer Klasse passt."
- duration: 10.815s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-nachweis.html
- type: feature_showcase
- persuasion: Risk reversal
- beat: control
- blueprint: device-surface-showcase (Adapt)
- focal: assets/25-c10r0-kn-formen.png
- roles: 24-c9r0-kn-fall = supporting (the case, held first) · 25-c10r0-kn-formen = cutout (the focal — the three forms are the reassurance)
- sfx: none
- asset_candidates: assets/24-c9r0-kn-fall.png — Mini Case, die Lohnabzug-Anfrage um 21 Uhr; assets/25-c10r0-kn-formen.png — der Nachweis in einer von drei Formen

Adapt: the blueprint's **stepwise-flow** variant — one surface completing its core loop, presented by a camera that holds rather than pushes. Two surfaces in sequence instead of a screen carousel inside one device; again no device frame.
Scene 1 (0.0–2.5s): the KN-Fall plate arrives centred, inset ~82%, neutral `green-deep` rail (the KN carries no Herausforderung colour — it inherits brand green, exactly as the deck does). Smooth settle, then still.
Scene 2 (2.5–5.8s): on «Ein neuer Fall» (2.5s) a hand-drawn **circle** (`css-marker-patterns`) draws around the case title, and on «noch nie gesehen haben» (4.3s) a short `green` underline sweeps beneath it. The plate otherwise holds — the case is meant to be read.
Scene 3 (5.8–8.1s): **scale-swap** (`scale-swap-transition`) at the shared centre — the case plate shrinks and fades as the KN-Formen plate arrives. On «drei Formen» (6.9s) the three form blocks on the plate light in a staggered sequence (`asr-keyword-glow`).
Scene 4 (8.1–10.815s): the three lit forms hold side by side while «Sie entscheiden» lands. No camera. Still to the cut.

narrativeRole: Schliesst den inhaltlichen Katalog; zeigt, dass die Prüfung mitgeliefert ist.
keyMessage: Der Nachweis ist schon gebaut.

## Frame 11 — Bewertet auf zwei Spuren

- scene: Zwei gleichgewichtige Flächen kippen von links und rechts herein und stehen nebeneinander
- voiceover: "Bewertet wird auf zwei Spuren: Sprache und Kommunikation — und Gesellschaft. Getrennt, damit eine schwache Sprache nicht das Sachurteil mitreisst."
- duration: 11.572s
- transition_in: crossfade
- status: animated
- src: compositions/frames/11-bewertung.html
- type: benefit_highlight
- persuasion: Show-don't-tell proof
- beat: peace of mind
- blueprint: comparison-split (Reproduce)
- focal: assets/26-c11r0-kn-bewertung.png
- roles: 26-c11r0-kn-bewertung = cutout (split into its two halves; both halves are the same captured plate)
- sfx: none
- asset_candidates: assets/26-c11r0-kn-bewertung.png — Bewertung auf zwei Spuren, SuK und Gesellschaft

Scene 1 (0.0–3.1s): the Bewertung plate arrives whole and centred but held at ~55% opacity; mono `label` «ZWEI SPUREN» in the upper third. Still — the frame waits for the VO to name the tracks.
Scene 2 (3.1–5.2s): on «Sprache und Kommunikation» (3.1s) the plate's left column lifts forward with the blueprint's mirrored **book-open tilt** (`split-tilt-cards`, left card entering from the left wing) and comes to full strength; an inner-edge pill badge «SuK» spring-pops on it at 4.1s.
Scene 3 (5.2–7.1s): on «und Gesellschaft» (5.2s) the right column lifts with the mirrored opposing tilt and its «Ges» pill pops at 5.4s. Both halves now stand side by side at equal weight — split-screen, three depth layers.
Scene 4 (7.1–11.572s): on «Getrennt» (7.1s) a vertical hairline **draws** down the seam between them (`svg-path-draw`, `green`). Then a **held read** — an allocated breather before the climax. Both halves still; `subtle jitter` at most. No camera.

narrativeRole: Letzter Baustein; beantwortet die Bewertungsfrage, die jede Lehrperson stellt.
keyMessage: Zwei Spuren, sauber getrennt.

## Frame 12 — Die zwei Achsen

- scene: Alle 27 Folienplatten bauen sich als Karte auf — zwölf Spalten, drei davon mit fünf Zeilen darunter; die Kamera fährt zurück, bis die ganze Karte im Bild steht
- voiceover: "Und so bewegen Sie sich darin. Pfeil rechts geht die Hauptlinie entlang — zwölf Bausteine. Pfeil runter öffnet die Tiefe der Herausforderung, in der Sie gerade stehen. Und die Leertaste läuft beides in Lesereihenfolge durch, alle siebenundzwanzig Folien."
- duration: 15.726s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/12-zwei-achsen.html
- type: feature_showcase
- persuasion: Show-don't-tell proof
- beat: mastery
- blueprint: grid-card-assemble (Adapt)
- focal: assets/03-c3r0-a-situation.png
- roles: 00-c0r0-titel = supporting (column 1) · 03-c3r0-a-situation = cutout (the column that opens downward — the focal) · 09-c4r0-b-situation = supporting (column 5) · 15-c5r0-c-situation = supporting (column 6) · 26-c11r0-kn-bewertung = supporting (column 12) · bar = supporting (the control bar, keys glow on cue)
- sfx: key-press-soft
- asset_candidates: assets/00-c0r0-titel.png — Spalte 1: titel; assets/01-c1r0-versprechen.png — Spalte 2: versprechen; assets/02-c2r0-ablauf.png — Spalte 3: ablauf; assets/03-c3r0-a-situation.png — Spalte 4: a-situation; assets/04-c3r1-a-leitfragen.png — Spalte 4, Unterfolie 1: a-leitfragen; assets/05-c3r2-a-leitfragen-loesung.png — Spalte 4, Unterfolie 2: a-leitfragen-loesung; assets/06-c3r3-a-mindmap.png — Spalte 4, Unterfolie 3: a-mindmap; assets/07-c3r4-a-produkt.png — Spalte 4, Unterfolie 4: a-produkt; assets/08-c3r5-a-muster.png — Spalte 4, Unterfolie 5: a-muster; assets/09-c4r0-b-situation.png — Spalte 5: b-situation; assets/10-c4r1-b-leitfragen.png — Spalte 5, Unterfolie 1: b-leitfragen; assets/11-c4r2-b-leitfragen-loesung.png — Spalte 5, Unterfolie 2: b-leitfragen-loesung; assets/12-c4r3-b-mindmap.png — Spalte 5, Unterfolie 3: b-mindmap; assets/13-c4r4-b-produkt.png — Spalte 5, Unterfolie 4: b-produkt; assets/14-c4r5-b-muster.png — Spalte 5, Unterfolie 5: b-muster; assets/15-c5r0-c-situation.png — Spalte 6: c-situation; assets/16-c5r1-c-leitfragen.png — Spalte 6, Unterfolie 1: c-leitfragen; assets/17-c5r2-c-leitfragen-loesung.png — Spalte 6, Unterfolie 2: c-leitfragen-loesung; assets/18-c5r3-c-mindmap.png — Spalte 6, Unterfolie 3: c-mindmap; assets/19-c5r4-c-produkt.png — Spalte 6, Unterfolie 4: c-produkt; assets/20-c5r5-c-muster.png — Spalte 6, Unterfolie 5: c-muster; assets/21-c6r0-austausch.png — Spalte 7: austausch; assets/22-c7r0-prinzip.png — Spalte 8: prinzip; assets/23-c8r0-transfer.png — Spalte 9: transfer; assets/24-c9r0-kn-fall.png — Spalte 10: kn-fall; assets/25-c10r0-kn-formen.png — Spalte 11: kn-formen; assets/26-c11r0-kn-bewertung.png — Spalte 12: kn-bewertung; assets/bar.png — die Bedienleiste mit Zähler und Pfeiltasten

Adapt: keep the staggered self-assembly and, critically, the blueprint's optional **camera zoom-OUT revealing the array inside a vaster whole** — that pull-back IS this frame's payoff. Change: the array assembles along **two** axes on separate spoken cues rather than one grid on one stagger, and the named plates carry the real captured columns while the remaining columns are represented as hairline-ruled plate outlines (the map must show 27 positions; only six are real captures and none is invented content).
Scene 1 (0.0–2.0s): a single plate centred, with `bar.png` inset below it at real size. Just the current position. Still.
Scene 2 (2.0–5.5s): on «Pfeil rechts» (2.0s) the → key on the bar takes a `green` glow, and the twelve column heads lay out **left→right** in a staggered cascade (`center-outward-expansion`, lateral register) — the real captures at their true positions, the rest as outlines. The numeral 12 counts up (`counting-dynamic-scale`) as «zwölf Bausteine» lands at 4.0s.
Scene 3 (5.5–10.0s): on «Pfeil runter» (5.5s) the ↓ key glows and, under columns 4, 5 and 6, five row plates each drop downward in sequence. The A column (the focal) opens first and slightly larger. The two-axis map now exists in full.
Scene 4 (10.0–13.7s): on «Leertaste» (10.3s) the camera eases **back** in one continuous decelerating pull until all 27 positions sit in frame, and a `green` path **draws** through them in reading order (`svg-path-draw`) — down each column, then on to the next.
Scene 5 (13.7–15.726s): the path completes; the numeral **27** sets beneath the map on «siebenundzwanzig» (14.0s). **Held read** — the climax sits still, no camera, no drift.

narrativeRole: Der Höhepunkt — die Struktur, die seit Frame 2 behauptet wurde, wird als Ganzes sichtbar.
keyMessage: Rechts die Linie, runter die Tiefe, Leertaste durch alles.

## Frame 13 — Was nur Sie sehen

- scene: Zweigeteilte Bühne — links die Folie, rechts die Notizenspalte; beim Weiterschalten wechseln beide gemeinsam, Zähler und Timer laufen mit
- voiceover: "Rechts steht, was nur Sie sehen. Coaching-Hinweise, der Unterrichtsfahrplan, das Erwartungsbild — alles aus dem Begleitdokument, automatisch zur richtigen Folie gestellt. Dazu der Zähler auf beiden Achsen, die nächste Folie im Voraus, und eine Uhr, die mitläuft."
- duration: 17.502s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-notizen.html
- type: benefit_highlight
- persuasion: Show-don't-tell proof
- beat: control
- blueprint: panel-edit-live-sync (Reproduce)
- focal: assets/presenter-a-mindmap.png
- roles: presenter-a-situation = supporting (the couple's first state) · presenter-a-mindmap = cutout (the focal — counter, notes and next-line all legible in one shot) · bar = supporting (zoom targets: counter, next line, timer)
- sfx: none
- asset_candidates: assets/presenter-a-situation.png — Referentenansicht mit Coaching und Fahrplan; assets/presenter-a-mindmap.png — Zähler 4/12 · 3/5, TAFELBILD-Notiz, Als-Nächstes-Zeile, Timer; assets/bar.png — Bedienleiste freigestellt

Scene 1 (0.0–2.3s): the full presenter view (`presenter-a-situation`) arrives as one bipartite stage — slide left, notes column right. On «was nur Sie sehen» the notes column brightens to full while the slide half eases to ~70%, establishing which half belongs to the teacher. Asymmetric 70/30, matching the app's own split.
Scene 2 (2.3–5.8s): three **highlight sweeps** (`css-marker-patterns`) land inside the notes column on their exact cues — COACHING at 2.3s, UNTERRICHTSFAHRPLAN at 3.5s, ERWARTUNGSHORIZONT at 5.0s. Each stays lit. The slide half does not move.
Scene 3 (5.8–9.8s): the live-sync signature — on «automatisch zur richtigen Folie gestellt» (7.4s) the slide half swaps to the mindmap state **and the notes column swaps with it in the same beat** (`control-target-sync`), both sides cutting on one velocity-matched seam. The couple is never broken.
Scene 4 (9.8–12.1s): **zoom-to-target** (`coordinate-target-zoom`) onto the control bar's counter «4 / 12 · 3/5» as «der Zähler auf beiden Achsen» lands (10.4s); the two numbers each take a glow, naming the two axes one last time.
Scene 5 (12.1–15.3s): the camera slides along the bar to the «Als Nächstes»-line on its cue (12.3s) and holds it framed.
Scene 6 (15.3–17.502s): final short move to the timer at 15.5s; it advances one second (a single finite tick, `discrete-text-sequence`) and the frame holds still.

narrativeRole: Die Steuerung als Nutzen erzählt — das Begleitdokument ist im Deck, nicht daneben.
keyMessage: Ihre Vorbereitung steht neben der Folie.

## Frame 14 — Zwei Fenster

- scene: Zwei Fenster fahren von links und rechts herein — Referentenansicht und blanke Klassenansicht, gekoppelt
- voiceover: "Ein Klick auf Beamer öffnet ein zweites Fenster. Das schieben Sie auf den Projektor: nur die Folie, keine Notizen, keine Leiste. Was Sie aufklappen, klappt dort mit auf."
- duration: 10.632s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/14-beamer.html
- type: benefit_highlight
- persuasion: Friction reduction
- beat: ease
- blueprint: comparison-split (Adapt)
- focal: assets/beamer-audience.png
- roles: presenter-a-mindmap = supporting (your window, left) · beamer-audience = cutout (the class's window, right — the focal, because it is the thing the teacher has never seen)
- sfx: click-soft, whoosh-soft
- asset_candidates: assets/presenter-a-mindmap.png — Ihre Ansicht mit Notizen; assets/beamer-audience.png — die Klassenansicht, nur die Folie

Adapt: keep the two-items-of-equal-weight entering from opposite wings and the inner-edge pill badges. Change: they are two application **windows**, not two cards, and the right one is **caused** by a click rather than simply arriving — the causality is the point. Both keep their real captured pixels.
Scene 1 (0.0–3.2s): the presenter view alone, centred. The drawn cursor travels to the «Beamer» button in the control bar and clicks at 0.9s — press compression plus **ripple** (`cursor-click-ripple`).
Scene 2 (3.2–5.0s): caused by that click, the audience window enters from the **right wing** with the mirrored book-open tilt while the presenter window settles into the left wing (`split-tilt-cards`). Split-screen, equal weight. Inner-edge pills spring-pop: «IHR BILDSCHIRM» left, «BEAMER» right.
Scene 3 (5.0–8.1s): three short strike-through markers (`css-marker-patterns`) land on the right window in turn on their cues — «nur die Folie» 5.0s, «keine Notizen» 5.9s, «keine Leiste» 6.8s — visibly marking what is *absent* there.
Scene 4 (8.1–10.632s): on «Was Sie aufklappen» (8.1s) a mindmap branch opens on the LEFT window and the identical branch opens on the RIGHT window in the **same beat** (`control-target-sync`) — the sync claim shown, not asserted. Both hold still to the cut.

narrativeRole: Löst die letzte praktische Sorge — wie kommt das an die Wand, ohne dass die Klasse die Lösungen sieht.
keyMessage: Ihre Notizen bleiben Ihre.

## Frame 15 — Für jede Einheit

- scene: Die Klassenansicht verkleinert sich zur Karte, das BBW-Zeichen setzt sich, darunter der Pfad
- voiceover: "Dieses Deck gibt es nicht nur für diese Einheit. Es wird für jede EFZ-Einheit erzeugt — aus denselben Daten. Sie finden es auf der Einheit, unter Präsentation."
- duration: 10.475s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/15-abschluss.html
- type: cta
- persuasion: Value stacking
- beat: motivation
- blueprint: logo-assemble-lockup (Reproduce)
- focal: assets/beamer-audience.png
- roles: beamer-audience = cutout (shrinks into the card that multiplies, then clears for the lockup)
- sfx: none
- asset_candidates: assets/beamer-audience.png — die Klassenansicht als Schlussbild; assets/logo-bbw-mark.png — BBW-Lockup für die Schlussmarke (in BRIEF.md § Assets geführt)

Scene 1 (0.0–2.9s): the audience window from Frame 14 continues seamlessly and shrinks to a single centred card (`card-morph-anchor`), holding its real pixels. Mono `label` «DIESE EINHEIT» beneath it.
Scene 2 (2.9–5.4s): on «jede EFZ-Einheit» (3.5s) the single card **multiplies outward** into a quiet grid of ten identical plate outlines (`center-outward-expansion`) — one per EFZ unit, all hairline-ruled, none carrying invented content. The label swaps to «JEDE EINHEIT» on a hard cut.
Scene 3 (5.4–7.1s): on «aus denselben Daten» the grid recedes and dims to ~30%; the BBW mark **assembles** at centre from its own parts (`svg-path-draw` for the outline, then a smooth settle) in `ink`.
Scene 4 (7.1–10.475s): the path types beneath the mark with a caret (`discrete-text-sequence` + `context-sensitive-cursor`) on its cue at 7.1s: «/einheiten → Einheit → Präsentation». It holds. This is the **only frame with a real exit** — over the last 0.4s the grid and path ease to zero while the mark holds, then the whole frame fades to the ground colour.

narrativeRole: Weitet den Einzelfall auf das System und sagt, wo es liegt.
keyMessage: Jede EFZ-Einheit hat ihr Deck.
