# Bauplan — <ordnername>

Alle Entscheide, die sonst ein Mensch während der Generierung trifft. Lokal
vorbereitet und von Pietro freigegeben; die Cloud-Session führt ihn aus und
ändert keinen Entscheid. Kopieren nach `docs/cloud-run/bauplaene/<ordnername>.md`.

Kein Lehrmitteltext in diese Datei — nur Kapitel und Seite als Verweis und
eigene Formulierungen. Sie liegt im öffentlichen Repo.

**Freigabe:** offen | freigegeben am JJJJ-MM-TT

## 1. Verortung

| | |
|---|---|
| Ordnername | `X.Y.Z_slug` (nach dem ersten Druck nicht mehr änderbar) |
| Lehrgang (kanonisch) | EFZ_3J / EFZ_4J |
| Weitere Lehrgänge | — (nur wenn Nummer und Text dort identisch sind) |
| Kompetenz | X.Y.Z — Wortlaut aus dem nRLP-Datensatz |
| Weitere geübte Kompetenzen | — (`nr_primary`; im Zweifel leer) |
| Fokus | ein Satz |

## 2. Lehrmittel

| Kapitel (Datei) | Seiten | Wofür |
|---|---|---|
| `2.2_Budget.md` | 48–53 | Kernkapitel |

Kapitel ausserhalb der Crosswalk-Zeile hier begründen und den Crosswalk
vor dem Lauf nachführen.

## 3. Roter Faden

- **Kern-Kompetenzversprechen:** «Ich kann …» (K3/K4-Verb)
- **Spannungsfelder:** X vs. Y · …
- **Transfer-Anker:** das Prinzip in einem Satz, ohne Fall
- **SK:** A = …, B = …, (C = …) · Schnittmenge für den KN = …
- **Aspekte:** … (nRLP) · … (über Konfliktart aktiviert: welche, welches Signalwort)

## 4. Herausforderungen

Pro Herausforderung genau eine Variante — die gewählte, nicht die Auswahl.

### A — <Titel>

- Konfliktart:
- Handlungsprodukt (Typ und Format):
- Situation in zwei Sätzen (Ich-Form, neutrale Persona, Stufe 1 oder 2):
- Kapitel und Seiten:
- Methodenkarten (vier Refs aus `src/data/methoden/`, zwei davon mit Beispiel):

### B — <Titel>

…

### C — <Titel> (entfällt bei Zweier-Heften)

…

## 5. Kompetenznachweis

- **Hybrid-Fall in drei Sätzen** (muss neu sein — nicht aus A/B/C):
- **Dem KN vorbehalten** (kommt in keiner Herausforderung und keiner Quelle vor):

## 6. Quellen (nur Hefte mit Medien-Spur)

Lokal recherchiert und geprüft; die Karten liegen vor dem Lauf unter
`src/data/quellen/`. Die Cloud recherchiert nicht.

| Slot | Quellen-ID | Stand |
|---|---|---|
| A Pflicht | `q-…` | Karte vorhanden / offen |
| A Ersatz | | |
| A Vertiefung 1 / 2 | | |
| B … | | |

Ist ein Slot «offen», erzeugt die Cloud nur die Spur ohne Medien und meldet es
im Bericht.

## 7. Ausnahmen und Hinweise

Alles, wofür die Skill sonst anhalten würde (`knoten_ref` über mehr als drei
Seiten, Abweichung von einer Regel, bekannte Stolpersteine im Kapitel).
