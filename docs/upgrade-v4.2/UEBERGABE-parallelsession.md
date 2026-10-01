# Übergabe aus der Parallelsession «Produktionspipeline» (01.10.2026, ca. 22:42–23:05)

Diese Session hat wegen eines Stop-Hooks kurz denselben Bau begonnen, den die Session «Einheit 1.3.1 Orchestration» ausführt. Sie hat aufgehört, sobald das sichtbar wurde. **Massgeblich ist `ENTSCHEIDE.md` der Orchestrator-Session, nicht `VERTRAG.md`.** Alles hier ist uncommittet im Arbeitsbaum; übernehmen, umbauen oder verwerfen.

## Was im Arbeitsbaum von dieser Session stammt

| Pfad | Was | Empfehlung |
|---|---|---|
| `docs/upgrade-v4.2/VERTRAG.md` | eigener Datenvertrag (Datei `spur.ts`, `spuren` bleibt im Heft, Umschalten im Browser) | **überholt durch ENTSCHEIDE E3**; löschen oder als verworfen markieren |
| `src/lib/einheiten/spur.ts`, `quellen.ts`; Änderungen in `index.ts`, `types.ts`, `scripts/build-einheiten-index.mjs`, beide Indexe | Spur-Auflösung nach VERTRAG, bedient zusätzlich die Feldnamen aus E3 (`spur`, `spuren_verfuegbar`, flache Kartenfelder). `loadEinheit(slug, opts)` und `spur_varianten` sind **nicht** gebaut. Bestand geprüft: 11 von 11 Einheiten liefern byte-gleich wie HEAD. | gegen E3 abgleichen; `quellen.ts` und die Index-Flags `hat_spuren`/`hat_medien` sind vertragsneutral |
| `scripts/check-v42.mjs`, `package.json` (`check:v42`), `scripts/check-einheiten.mjs`, `scripts/check-lf-loesung.mjs` | Prüfregeln §11.5, Budgets §3.1, Platzhalter, Refs, Wortlaut Feedback-Kriterien, Fall-Ausschluss; die zwei Bestands-Checks prüfen v4.2-Hefte je Spur. Bestand: Ausgabe unverändert. | brauchbar, vertragsneutral (arbeitet auf Rohdateien) |
| `herausforderung_A.json`, `herausforderung_B.json` (Kern + `spuren.ohne_medien`) | Lehrmittel-Korrekturen, jede Seitenangabe am Text bestätigt; keine Platzhalter mehr in der traditionellen Spur. `spuren.mit_medien` unberührt. | **übernehmen** — siehe Befunde unten |

## Fachprüfung gegen das Lehrmittel — Befunde (eingearbeitet)

- **Heft A, LF3 ohne Medien:** Das Lehrmittel hat keinen Abschnitt mit vier Einflüssen auf Bedürfnisse. Belegt ist nur «Werbung weckt neue Bedürfnisse» (Kap. 2.7, S. 73); S. 74, 76, 77 betreffen Einkommen, Geld, Trend → Nachfrage. LF3 fragt deshalb neu nach Einflüssen auf **Kaufwünsche und Nachfrage**, Quelle Kap. 2.7 S. 73–77. Umfeld, Herkunft, Impulskauf sind als «eigene Beobachtung, nicht aus dem Lehrmittel» gekennzeichnet.
- **Heft B, LF3 ohne Medien:** Kap. 8.2 S. 199–200 trägt «Ursachen und Folgen von Verschuldung», nicht den Ablauf einer Spirale. «Schuldenspirale» steht in Kap. 2.2 S. 48; «Mahnung» in Kap. 2.4 S. 62.
- **Seiten:** A Kap. 2.7 → 73–75, Kap. 17.2 → 381–383; B Kap. 8.2 → 199–200.
- **Beispiele ans Buch angeglichen** (Existenz-/Wahlbedürfnis, Maslow-Benennung, variable Kosten ohne Take-away).
- **Netto-Rechnung B LF2:** AHV/IV/EO/ALV gelten erst ab dem Jahr des 18. Geburtstags; Lösung entsprechend formuliert, CHF 800 der Situation sind netto.

## Noch offen aus diesen Aufträgen

- B `spuren.mit_medien.leitfragen[1]`: nennt noch «streiche Take-away» und «Kap. 8.2 | S. 199-202».
- B `prinzip_handoff.lehrmittel_anker`: noch «Kap. 8.2 S. 199-202».
- A `leitfragen[1].loesung`: «Zugehörigkeit» statt «Dazugehörigkeit» (Buchbenennung).
- B LF1-Auftragstext fragt nach dem Entstehen einer Spirale aus einer offenen Rechnung; das Buch liefert dafür keinen Ablauf.
- Fitness-Jahresabo in B: Buch führt «Sport» als variabel, der Fall als fix. Als Fallüberlegung gekennzeichnet.
- `check-v42` meldet 17 Budget-Überschreitungen (u. a. `quellen_anker`-Zeilen, `mehrdeutigkeit.hint`, Denkhilfe-Spaltenköpfe A, LF4-Texte).
- `check-v42`: `prinzip_handoff.kn_aktivierung` nennt E-Bike/Leasing → Falschmeldung, Feld ausnehmen.
- `check-lf-loesung`: LF4 trägt `erwartungshorizont` statt `zeilen` → vier falsche `ERR_LF_LOESUNG_MISSING`.
- `begleiter-loesungen.ts`: lokaler Typ verlangt `loesung.zeilen` noch als Pflicht.

## Quellensuche

Zwei Suchaufträge (Heft A, Heft B, je Pflicht, Ersatz, zwei Vertiefungen) liefen bei der Übergabe noch. Sie schreiben nur nach `D:\OS\_lab\quellen-archiv\bbw-hko\<quellen-id>\kandidat-<n>\`, nichts ins Repo. Die Kandidatenlisten werden unten angehängt, sobald sie da sind.
