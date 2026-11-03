# EBA-Dossier — Wissen für Hefte und KN

Aus dem alten Dossier-Teil übernommen, auf v4.2 reduziert. Vorlage
`assets/eba-dossier-template.json`, Formreferenz Gold `dossier.json`.

Aus allen Leitfragen und KN-Ansprüchen Bedarfsliste ableiten: Heft/Leitfrage,
Info-Karte, benötigtes Wissen, Primärquelle. Nach Entwurf, vor endgültigen
Lösungen/Audits fertigstellen; sachliche Änderungen lösen Nachprüfung aus.

- `kopf` aus `public/nrlp_2j.json`; Kompetenz-/Lebensbezugstext wörtlich.
  Lehrgang `EBA_2J`, Niveau `A2`, Template `dossier_eba_v1`.
- `nuggets`: interne ID `nugget_A_01`, Tag A/B, sichtbarer Name Info-Karte;
  `titel`, kurzer eigener `inhalt`, Schweizer `beispiel`, `fuer_leitfrage`,
  `fakten_anker`, `glossar_refs`, `recherche`. In der Regel drei je Heft.
  Keine KN-Falllösung und keine kopierten Quellenvolltexte.
- `recherche`: zwei bis drei einfache Suchbegriffe plus konkretes
  `selbst_pruefen`. Keine KI-Prompts; diese gehören zur KI-Toolbox.
- `sprachmodi_scaffolds`: je Heft passend zum eigenen Modus `sm_id`,
  `modus_label`, Satzanfänge, Strategien, Struktur, `so_gehst_du_vor`.
- `transfer_wissensblatt`: `fachsystematik`, `prinzip_in_einfach`, keine
  `austausch_scaffolds`. Anwendung steht im gemeinsamen Auftrag.
- `glossar`: eindeutige ID, Begriff, `erklaerung_a2`, Beispiel. Alle
  Fachbegriffe erklären; `glossar_refs` und sämtliche Heftanker auflösen.

Beträge, Fristen, Rechtsstände und Sachaussagen an aktuelle amtliche
Primärquellen binden. `fakten_anker[].quelle` nennt URL und Abrufdatum;
`validiert` erst nach Prüfung setzen. `lp_pruefen` ist offener Befund, kein
bestandener Faktencheck. Fakten-Audit schliesst Dossier ein; keine zirkuläre
Begründung allein durch die eigene Info-Karte und keine Gold-Belege kopieren.
Jede Leitfrage samt Rasterlösung muss mit genannter Karte und Fall lösbar sein —
aber die Karte rechnet oder entscheidet den Heftfall **nicht** vor: `beispiel` mit
eigenen Zahlen und eigenem Fall (`eba-profil.md` §6.2, `ERR_EBA_VORWEG`). `inhalt` in
Sie-Form, ohne Paragraphen; `selbst_pruefen` je Karte konkret, `so_gehst_du_vor` je
Modus eigen (§6.4). Jede Regel, auf die Auftrag oder Erwartungshorizont bauen, steht
auf einer Karte (§6.1).
Jeder KN-Anspruch wird geübt und hat Wissensdeckung; sonst ergänzen oder ändern.
A2-Regeln auf den ganzen Lernendentext anwenden, Sie in Anweisungen, Ich im Fall.

## Optionales Leseblatt

Titel, Einleitung, `gesamttext_quelle: nuggets`, fünf `richtig_falsch` mit
internem booleschem Lösungsschlüssel, drei `w_fragen`, sechs `vokabeln`
(existierende Glossar-IDs). Keine Kopie des Gesamttexts. Fragen durch
`nuggets[].inhalt` beantworten lassen, nicht nur durch Beispiele/Hintergrund.
Richtige und falsche Aussagen mischen.
Renderer setzt **Wichtige Wörter vor den Lesetext**, zieht Text A vor B.
Mit Vokabeln: zwei Absätze auf erster, vier je Folgeseite, dann Aufgabenseite.
Sechs kurze Karten ergeben drei Seiten; bei mehr Karten keine Dreiseitigkeit
versprechen. Knapp schreiben, Leseblatt messen. Keine Wortliste am Schluss.
