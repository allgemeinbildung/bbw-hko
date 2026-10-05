# Handoff-Prompt

Auf claude.ai/code: Repo `allgemeinbildung/bbw-hko-produktion`, Branch `cloud`,
Konnektoren abwählen. Diesen Block als erste Nachricht einfügen, Datum anpassen:

```
Produktionslauf bbw-hko, Datum 2026-10-02.

Lies docs/cloud-run/RUN.md vollständig und führe es aus. Die Aufträge stehen in
docs/cloud-run/auftragsliste.md, die freigegebenen Baupläne in
docs/cloud-run/bauplaene/. Niemand beantwortet Rückfragen: Was der Bauplan
entscheidet, gilt; was er offen lässt, entscheidest du nach RUN.md und hältst es
fest. Beginne mit `npm ci && node scripts/cloud-preflight.mjs` und produziere
nichts, wenn der Preflight rot ist.
```
