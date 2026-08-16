# Sprachförderung-Methoden — Bibliothek je Sprachmodus (zwei-Schichten-Modell)

> **Stand: HKO-Experten-Review 2026-06.** Methoden an nRLP-Vokabular gebunden
> (Lesestrategien, Markierhilfe, Lesestruktur, 3B-Schema, Redemittel). Mirror in
> Code: `bbw-hko/src/lib/einheiten/sprachfoerderung.ts`.

**Zweck (Cluster 3):** Das Material wirkt heute wie ein „gesellschaftlicher
Lehrplan"; die Sprachförderung — besonders die **Rezeption (Leseverständnis,
SM3)** — geht unter. Der LP-Abschnitt „Sprachförderung" macht sie sichtbar.

## Zwei-Schichten-Modell (verbindlich)

| Schicht | Quelle | Stabilität |
|---|---|---|
| Generischer Methoden-Kern | diese Bibliothek (je SM-ID) | fix pro SM-ID |
| **Kontext-Spitze** | `kompetenz.sprachmodi[].detail` aus `nrlp_3j/4j.json` | variiert pro Kompetenz |

Der Renderer zieht den Methoden-Kern zur SM-ID und injiziert die passende
`detail`-Zeichenkette als **„In dieser Einheit konkret:"**. Eine Bibliothek,
keine Duplizierung pro Lernsituation — aber an das echte nRLP-Ziel verankert.

## Regeln

- **Nur trainierte Modi** rendern (Vereinigung der `sit_*.sprachmodus_ids`). Rezeption **zuerst** (Platzierung/Prominenz), aber **alle vorhandenen Modi in voller Tiefe** — Produktion/Interaktion tragen SuK-Gewicht (bi-dimensional).
- **Kein 90/100** in dieser Bibliothek — diese Achse (Anforderungsband) gehört in den KN, nicht in den Förder-Block.
- **Canon-Vokabular** aus nRLP-`detail`-Strings: „Lesestrategien", „Markierhilfe", „Lesestruktur". Keine Fremd-Strategien (SQ3R, reziprokes Lesen) importieren.

## Format je Eintrag

```
Ziel:      [1 Satz — das Warum, SM-attribuiert]
Vorgehen:  [3 nummerierte Schritte]
Material:  [benannte Scaffolds]
In dieser Einheit konkret: [nRLP detail-Injektion]
```

## Methoden je SM-ID (Methoden-Kern)

| SM | Bezeichnung (nRLP verbatim) | SuS-Label | Ziel / Vorgehen / Material |
|---|---|---|---|
| `SM1` | Rezeption mündlich | Hören (Zuhören) | **Ziel:** Gesprochenes gezielt verstehen. **Vorgehen:** 2 Leitfragen → global hören, dann Notizauftrag (3 Fakten) → Plenum. **Material:** Leitfragen, Notizraster. *(Audio durch LP — siehe Hinweis)* |
| `SM2` | Rezeption audiovisuell | Sehen & Hören | **Ziel:** Bild-/Tonquellen verstehen. **Vorgehen:** 2 Leitfragen → mit Stopp-Stellen sehen, notieren → Plenum. **Material:** Leitfragen, Beobachtungsraster. *(Material durch LP)* |
| `SM3` | Rezeption schriftlich und bildlich | Lesen (Texte verstehen) | **Ziel:** Zentrale Aussagen aus Texten entnehmen (dokumentierter Schwerpunkt). **Vorgehen:** Überfliegen (Lesestruktur) → genaues Lesen mit Markierhilfe (+Randsymbole) → in 2–3 Sätzen zusammenfassen (Lesestrategien). **Material:** Wortliste, Markierhilfe, Lesegitter. |
| `SM4` | Produktion mündlich | Sprechen | **Ziel:** Mündlich klar/strukturiert formulieren. **Vorgehen:** Kernaussage+Begründung vorbereiten → mit Redemitteln formulieren → 60-Sek-Pitch + Feedback. **Material:** Redemittel/Satzanfänge. |
| `SM5` | Produktion schriftlich und bildlich | Schreiben | **Ziel:** Schriftlich strukturiert/begründet darstellen. **Vorgehen:** 3B-Schema gliedern → Entwurf → mit Checkliste überarbeiten. **Material:** 3B-Schema, Checkliste. |
| `SM6` | Produktion multimedial | Multimedial gestalten | **Ziel:** Inhalte in Bild/Text/Ton aufbereiten. **Vorgehen:** Storyboard → 1 Bild + 1 Kernsatz pro Abschnitt → zusammenführen/prüfen. **Material:** Storyboard-Vorlage. |
| `SM7` | Interaktion und Kollaboration mündlich | Im Gespräch aushandeln | **Ziel:** Aktiv zuhören, Bezug nehmen, Ergebnis erzielen. **Vorgehen:** Rollen vergeben → erst paraphrasieren, dann antworten → Ergebnis festhalten. **Material:** Rollenkarten, Redemittel. |
| `SM8` | Interaktion und Kollaboration schriftlich | Schriftlich aushandeln | **Ziel:** Schriftlich auf Beiträge Bezug nehmen. **Vorgehen:** Beitrag lesen → Antwort mit Bezugnahme → Zwischenergebnis sichern. **Material:** Redemittel für Bezugnahme. |
| `SM9` | Interaktion und Kollaboration digital | Digital zusammenarbeiten | **Ziel:** Digital sachlich/regelkonform zusammenarbeiten. **Vorgehen:** Kanal/Quellen wählen → knapp/adressatengerecht (Netiquette) → Belege einbinden. **Material:** Netiquette-Regeln. |

## Hörverständnis-Hinweis (erscheint, wenn SM1/SM2 vorkommt)

> Hörverstehen (SM1/SM2): Es wird kein Audio-/Videomaterial generiert. Förderung durch die Lehrperson: kurzer Input (eigenes oder bestehendes Material, z. B. SRF), 2 Leitfragen vor dem Hören, Notizauftrag (3 Fakten) beim zweiten Durchgang, Sicherung im Plenum.

## SuS-Marker

Lernende sehen das **schlichte Label** (nicht den Code): „Sie üben: Lesen (Texte verstehen) · Kompetenz 1.1.1". SM-ID bleibt Daten-/Lehrer-Ebene.

**SM-ID-Quelle:** `references/sprachmodus-ids.md`.
