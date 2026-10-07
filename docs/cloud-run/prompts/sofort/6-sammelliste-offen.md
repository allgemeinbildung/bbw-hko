# Sammelliste aller offenen Punkte

Session in `D:\OS\dev\bbw-hko`, Branch `v42-skill`. Schreibt nur
`docs/cloud-run/OFFEN.md` und `scripts/offen.mjs`.

```
Offene Punkte der v4.2-Einheiten liegen verstreut: in 14 Laufordnern
(BERICHT.md, NACHTRAG.md, ENTSCHEIDE.md), in docs/upgrade-v4.2/
REVIEW-lernende-t2.md §8.4/§8.5/§9, in ENTSCHEIDE.md (E28–E32, je «offen»,
«nicht geprüft»), in BERICHT-skill.md §5/§8 und im RUECKBLICK-produktion-
2026-10-06.md §3 und §5.3. Du baust EINE Liste.

1. EINSAMMELN (Sonnet-Subagenten, je 3–4 Laufordner, nur lesen)
   Jeder Punkt, der als offen, nicht geprüft, nicht belegt, «braucht einen
   Entscheid», «vor dem Druck gegenhören», Fehler in Skill/Skript/Renderer
   oder Vorschlag markiert ist. Je Punkt: Fundstelle (Datei, Abschnitt),
   Wortlaut in einem Satz, Einheit oder «alle».

2. NACHPRÜFEN (du selbst, am heutigen Stand)
   Jeder Punkt wird am Repo geprüft: schon erledigt (Commit nennen)? durch
   einen Entscheid überholt (E-Nummer)? doppelt? Erledigtes kommt in einen
   Abschnitt «erledigt, belegt» — nicht löschen.

3. FORM docs/cloud-run/OFFEN.md — eine Tabelle, sortierbar:
   ID (O-001 …) · Einheit oder Bereich · Art · Punkt · Fundstelle · wer ·
   Stand · seit
   Art ∈ E Fehler einer Einheit · S Skill · K Karte · R Renderer ·
   P Skript/Tor · Q Quelle · H Hören/Sehen (Pietro) · D Entscheid (Pietro) ·
   F Fakt unbelegt.
   wer ∈ Pietro · Session. Kein Punkt ohne «wer».
   Oben drei Kurzlisten: «Pietro muss hören/sehen» (je Quelle: Einheit,
   Titel, von–bis, worauf achten), «Pietro muss entscheiden», «betrifft
   publizierte Hefte».

4. NACHFÜHRBAR MACHEN
   scripts/offen.mjs: liest in jedem Laufordner den Abschnitt «offen» des
   Berichts (festes Gerüst aus der Skill, sobald vorhanden; bis dahin
   Überschrift /^#+ .*offen/i) und meldet Punkte, die in OFFEN.md fehlen
   (Exit 1). Regel für die Skill (ein Satz, als Vorschlag in deiner
   Schlussmeldung, nicht selbst einbauen): Ein Lauf endet erst, wenn seine
   offenen Punkte in OFFEN.md stehen.

5. REGISTER
   D:\OS\pendenzen.yaml ist die einzige Liste von Verpflichtungen. OFFEN.md
   ist ein Mängelverzeichnis, keine zweite Pendenzenliste: Schlage mir
   EINE Registerzeile vor («bbw-hko: OFFEN.md abarbeiten», mit wann) und je
   eine für die Kurzlisten «hören/sehen» und «entscheiden». Nicht selbst
   schreiben — nur den Aufruf von register_cli.py nennen.

GRENZEN
Nichts beheben, nichts an Einheiten, Karten, Skill ändern. Keine
Lernendennamen, kein Quellentext in der Liste. Commit ohne Push.
Schlussmeldung: Anzahl je Art, die drei Kurzlisten.
```
