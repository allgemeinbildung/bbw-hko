# Sprachmodus-IDs — kanonische Nummerierung (SM1–SM9)

**Zweck:** Der nRLP listet die 9 Sprachmodi in fester Reihenfolge, **nummeriert sie aber nicht**. Damit beide Render-Pfade (LP-Metadaten-Block, SuS-Marker) maschinenlesbar auf Sprachmodi referenzieren können, definiert diese Datei die **verbindliche ID-Vergabe SM1–SM9** nach der Reihenfolge in `nrlp_*.json → zirkularitaet.sprachmodi[]`.

Diese IDs sind **Single Source of Truth**. In bbw-hko spiegelt `src/lib/einheiten/sprachfoerderung.ts` dieselbe Zuordnung.

| ID | Bezeichnung (Klartext-Label, nativ Umlaut) | Gruppe |
|---|---|---|
| `SM1` | Rezeption mündlich | Rezeption |
| `SM2` | Rezeption audiovisuell | Rezeption |
| `SM3` | Rezeption schriftlich und bildlich | Rezeption |
| `SM4` | Produktion mündlich | Produktion |
| `SM5` | Produktion schriftlich und bildlich | Produktion |
| `SM6` | Produktion multimedial | Produktion |
| `SM7` | Interaktion und Kollaboration mündlich | Interaktion |
| `SM8` | Interaktion und Kollaboration schriftlich | Interaktion |
| `SM9` | Interaktion und Kollaboration digital | Interaktion |

## Verwendung in den JSON-Dateien

Im `nrlp`-Block jeder `sit_*.json` (additiv neben den bestehenden Labels):

```jsonc
"nrlp": {
  "sprachmodi": ["Rezeption schriftlich und bildlich", "Interaktion und Kollaboration schriftlich"],
  "sprachmodus_ids": ["SM3", "SM8"]
}
```

**Regeln:**
- `sprachmodus_ids[i]` korrespondiert zu `sprachmodi[i]` (gleiche Reihenfolge, gleiche Länge).
- IDs sind transliterationsfrei (reine ASCII-Codes) → dürfen in Keys/Code stehen.
- Labels bleiben nativ mit Umlauten (Prosa-Regel).
- Backward-compat: Fehlt `sprachmodus_ids`, leitet der Renderer die IDs per Label-Lookup aus dieser Tabelle ab.

## Mapping-Authority

Wird der nRLP neu extrahiert und die Reihenfolge der `sprachmodi[]` ändert sich, ist **diese Tabelle** massgeblich — die IDs sind stabil an die Bezeichnung gebunden, nicht an die Array-Position.


## Schlichte SuS-Labels (schülerseitig, statt SM-Code)

| ID | SuS-Label |
|---|---|
| SM1 | Hören (Zuhören) |
| SM2 | Sehen & Hören |
| SM3 | Lesen (Texte verstehen) |
| SM4 | Sprechen |
| SM5 | Schreiben |
| SM6 | Multimedial gestalten |
| SM7 | Im Gespräch aushandeln |
| SM8 | Schriftlich aushandeln |
| SM9 | Digital zusammenarbeiten |

Lernende sehen das Label, nicht den Code. SM-ID bleibt Daten-/Lehrer-Ebene.
