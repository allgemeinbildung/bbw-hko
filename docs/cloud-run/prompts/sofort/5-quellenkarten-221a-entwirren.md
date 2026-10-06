# Quellenkarten q-221a: vertauschte Inhalte entwirren

**Worum es geht.** Bei `2.2.1_ausgrenzung_analysieren`, Heft A, wurden am
05.10.2026 Quelle und Ersatzquelle getauscht (Commit `e400163`). Statt die
Zuordnung im Heft zu ändern, wurden die **Inhalte der zwei Karten vertauscht**
und die IDs behalten. Folge: Die Karte `q-221a-pflicht` (heute: «Musliminnen in
der Schweiz …») zeigt mit `archiv_ref` auf den Archivordner
`q-221a-pflicht-ersatz` — und umgekehrt. Wer das Transkript zur Karte sucht,
landet im falschen Ordner, ausser er liest den Hinweis in `lizenz_hinweis`.
Dazu sind die Zeitmarken «neu gerechnet, nicht gehört». Die Einheit ist live.

Session in `D:\OS\dev\bbw-hko`, Branch `v42-skill`.

```
1. Lage belegen: beide Karten, beide Archivordner
   (D:\OS\_lab\quellen-archiv\bbw-hko\q-221a-pflicht[-ersatz]\), die Stellen
   in herausforderung_A.json, set.json, begleiter.md und auf /m/<ordner>,
   die auf die Karten zeigen. NACHTRAG §9 des Laufs 2026-10-04-221 lesen.
2. Gerade ziehen, ohne dass sich für Lernende etwas ändert: Die
   ARCHIVORDNER tauschen ihre Namen (drei Schritte über einen Zwischennamen),
   danach `archiv_ref` in beiden Karten auf den Ordner gleichen Namens; den
   Hinweis zum Tausch aus `lizenz_hinweis` entfernen. Karten-IDs, URLs, URN
   und der gedruckte Kurzlink bleiben, wie sie sind.
   Vorher prüfen, ob irgendeine Datei (Bauplan, Berichte, _pruefung,
   _briefs) den Ordnernamen nennt, und dort nachführen.
3. Zeitmarken: Mit den Untertiteln/dem Transkript in voller Auflösung jede
   Zeitmarke der Quelle und der Lösungen von Heft A nachrechnen (zitierte
   Aussage muss im genannten Bereich liegen). Abweichungen über 3 Sekunden
   korrigieren. Was nur Hören klärt, kommt auf die Gegenhör-Liste.
4. Tor: check-all für 2.2.1_ausgrenzung_analysieren, Export, Messung,
   bestand-v42 --pruefen. Sichtbarer Text darf sich nur bei Zeitmarken
   ändern.
5. Bericht als Abschnitt im Laufordner 2026-10-04-221; Commit ohne Push;
   mir die Gegenhör-Liste nennen. Deploy erst auf mein «ok».

Nicht anfassen: andere Einheiten, andere Karten, Renderer, Skripte.
```
