# Handoff — Feedback-Ausbau für den gemeinsamen Kompetenznachweis (KT2)

> **Für eine neue Claude-Code-Session.** Dieses Dokument ist eigenständig: es setzt kein
> Wissen aus der vorherigen Session voraus. Lies zuerst `CLAUDE.md` im Repo-Root, dann dieses
> Dokument. Alle Pfade sind relativ zum Repo-Root `bbw-hko/`.

## 0. Worum es geht (Kontext & Ziel)

Die ABU-Materialplattform (Astro 4 SSR + Supabase + Alpine.js, Vercel) hat drei LP-Workflows:
**Materialien** (`/einreichen`), **Situationen** (`/situationen`), **Einheiten** (`/einheiten`).
Lehrpersonen (`lp`) unterrichten und geben Feedback; Kernteam 1 (`kt1`) sichtet.

**Zweck dieses Feedbacks:** KT1 soll Daten an das Team weitergeben, das den **gemeinsamen
Kompetenznachweis** baut — eine schulweite Jahresend-Prüfung, die **alle Klassen** ablegen
(hier «KT2» genannt). KT2 braucht aus dem Unterricht:
1. **was im Unterricht funktioniert hat / nicht**,
2. **welche Kompetenznachweise und Handlungsprodukte erfolgreich waren / nicht**,
3. **neue oder angepasste Herausforderungen / Handlungsprodukte**, die LPs erstellt haben.

Das aktuelle Feedback erfasst diese drei Punkte nur teilweise. Dieses Handoff beschreibt die
Anpassungen, die die Lücken schliessen. Die Analyse dahinter ist in §1–§2 zusammengefasst.

## 1. Ist-Zustand (was es heute gibt)

Drei Feedback-Oberflächen:

| Stream | Tabelle (Migration) | API | Formular |
|---|---|---|---|
| Situationen (einzelne Situation) | `feedbacks` (006) | `POST /api/feedbacks` → `src/pages/api/feedbacks/index.ts`; `GET`/`PATCH /api/feedbacks/[id]` → `src/pages/api/feedbacks/[id].ts` | `src/pages/situationen/[id]/feedback.astro` (Alpine `feedbackForm()`) |
| Einheiten (ganze Einheit) | `einheit_feedbacks` (009) | `POST /api/einheit-feedbacks` → `src/pages/api/einheit-feedbacks/index.ts` | `src/pages/einheiten/[setKey]/feedback.astro` (vanilla JS `gather()`/`send()`) |
| Eingereichte Materialien | `materials` (010) | `POST/PATCH /api/materials...` | `src/components/IntakeForm.astro` |

**Beide Feedback-Tabellen** haben heute:
- Kontext: `klasse`, `lehrjahr`, `abteilung`, getestet (`getestet_am` bzw. `getestet_von/_bis`), `dauer_lektionen`
- Ratings 1–5: `tauglichkeit`, `qualitaet`, `schwierigkeit`, `motivation`; `weiterempfehlung` (bool)
- Offen: `was_funktionierte`, `was_nicht_funktionierte`, `aenderungsvorschlaege`, `eigene_anpassungen`, `anmerkungen`
- Workflow: `status` ∈ `entwurf | eingereicht | gesichtet | weitergeleitet_kt2`, `kt1_kommentar`, `reviewed_by/_at`

**Einheiten zusätzlich:** `genutzt_sit_a/b/c`, `genutzt_kn`, `kn_typ_verwendet`, `kn_validitaet` (1–5), `begleiter_nuetzlich`.

## 2. Lücken gegenüber dem KT2-Ziel (Begründung der Arbeit)

1. **`qualitaet` vermischt Situation + Handlungsprodukt** in einer Zahl → Produkt-Erfolg nicht isolierbar.
2. **KN-Erfolg unterspezifiziert:** nur `kn_validitaet`. Für einen *vergleichbaren* KN fehlen Fairness, Zeitangemessenheit, Raster-Brauchbarkeit und ein **grobes Ergebnis** (Bestehensquote) — letzteres das wertvollste Kalibrierungsdatum.
3. **Niveau** nur als blanke `schwierigkeit`-Zahl ohne Richtung und ohne nötiges Scaffolding.
4. **Neue/angepasste Ideen** stecken nur im Freitext `eigene_anpassungen` — unsuchbar, **ohne Datei-Anhang**, **ohne Freigabe** für den gemeinsamen KN.
5. **Eingereichte Materialien haben gar keinen Erprobungs-Loop** — die reichste Quelle für neue Handlungsprodukte fliesst nirgendwo zu KT2.
6. **`weitergeleitet_kt2` trägt keine strukturierte Nutzlast** — der Status existiert, aber KT2 hat keine durchsuchbare Ansicht.

## 3. Wichtige Patterns, die wiederverwendet werden

- **Datei-Upload (privat, Service-Role + Signed URLs):** Vorlage ist
  `src/pages/api/materials/[id]/files.ts` + der private Storage-Bucket aus
  `supabase/migrations/010_material_hko_fields.sql`. Upload/Download laufen über
  `createAdminClient()` (`src/lib/supabase.ts`) **nach** expliziter Besitz-/Rollenprüfung;
  Metadaten (`[{name,path,size,type,uploaded_at}]`) landen in einer JSONB-Spalte der Zeile,
  die Bytes im Bucket. Pfad-Schema: `{owner_id}/{row_id}/{uuid}_{safeName}`. Max 15 MB,
  Extension-Allow-List. **Diese Datei 1:1 als Blaupause nehmen.**
- **Upload-Flow im Formular** (Vorlage `src/components/IntakeForm.astro`): erst Zeile speichern
  (POST → liefert `data.id`), dann Dateien per `FormData` an den Files-Endpoint; im Edit-Modus
  bestehende Dateien mit Download + Entfernen anzeigen.
- **Likert/Radio-Pills & Checkboxen:** beide Feedback-Formulare haben das Muster schon
  (`.radio-pill`, `.check-item`, `.input`, `.field-label` sind global in `src/layouts/Base.astro`).
- **Bedingte Felder:** `x-show` (Alpine, Situationen) bzw. ein `hidden`-Toggle (vanilla, Einheiten).

## 4. Umsetzung in Phasen

> Reihenfolge: **P1 → P2 → P4** liefern ~80 % des KT2-Werts (alle auf bestehenden Mustern).
> **P3, P5** danach. **P6, P7** sind die grösseren strukturellen Ergänzungen.
> Jede Phase ist einzeln lauffähig & deploybar.

### P0 — Vorbereitung
- `CLAUDE.md` + dieses Dokument lesen.
- Migrationen laufen über das **gehostete Supabase-Dashboard** (kein CLI im Repo):
  SQL-Editor `https://supabase.com/dashboard/project/<PROJECT_REF>/sql/new`.
  Projekt-Ref steht in `.env` als Host von `PUBLIC_SUPABASE_URL`
  (zuletzt `mbslkjxkleiudzsbjqau` — vor Gebrauch verifizieren).
- Verifikation ohne DB: `npm run build` kompiliert alle `.astro`/Routes (kein Typecheck, aber
  fängt Syntax/Template-Fehler). Browser-Login mit Seed-Usern funktioniert ggf. nicht (Seed-User
  evtl. nicht in der verbundenen DB) — nicht blockieren lassen.

### P1 — Qualität aufsplitten + Niveau-Richtung  *(must)*
**Migration `011`** (neue Datei `supabase/migrations/011_feedback_kt2_fields.sql`, idempotent
mit `add column if not exists`; zusätzlich an `supabase/setup_full.sql` anhängen):

Auf **`feedbacks`** *und* **`einheit_feedbacks`**:
```sql
add column if not exists qualitaet_situation        int check (qualitaet_situation between 1 and 5),
add column if not exists qualitaet_handlungsprodukt  int check (qualitaet_handlungsprodukt between 1 and 5),
add column if not exists niveau_passung text check (niveau_passung in ('zu_leicht','passend','zu_schwer')),
add column if not exists noetiges_scaffolding text,
```
(`qualitaet` bleibt erhalten für Rückwärtskompatibilität — nicht entfernen, nur nicht mehr im
Formular abfragen. **Prüfen**, ob `src/pages/admin/dashboard.astro` und
`src/pages/situationen/admin/index.astro` `qualitaet` aggregieren; falls ja, auf den Mittel der
zwei neuen Spalten umstellen oder beide anzeigen.)

**Formulare:** im Bewertungsblock `qualitaet` durch zwei Zeilen ersetzen
(„Qualität der Situation" / „Qualität des Handlungsprodukts"); `schwierigkeit` (1–5) bleibt,
darunter `niveau_passung` (drei Pills) + `noetiges_scaffolding` (Textarea).
- Einheiten: `src/pages/einheiten/[setKey]/feedback.astro` — neue Felder in die `[...]`-Rating-Liste
  bzw. neue `<section>`; in `gather()` die Parse-Liste für Integer ergänzen.
- Situationen: `src/pages/situationen/[id]/feedback.astro` — `ratingQuestions` erweitern, Felder
  ins `initial`-Objekt + ins `payload` aufnehmen.

**API:** Felder in `feedbacks/index.ts` (POST), `feedbacks/[id].ts` (PATCH),
`einheit-feedbacks/index.ts` (POST) durchreichen.

### P2 — KN-Erfolg-Block  *(must, nur Einheiten + später Material-Loop)*
**Migration 011**, auf **`einheit_feedbacks`**:
```sql
add column if not exists kn_fairness         int check (kn_fairness between 1 and 5),
add column if not exists kn_zeit_angemessen  int check (kn_zeit_angemessen between 1 and 5),
add column if not exists kn_raster_brauchbar int check (kn_raster_brauchbar between 1 and 5),
add column if not exists kn_ergebnis text check (kn_ergebnis in ('unter_50','50_75','75_90','ueber_90')),
```
(`kn_validitaet` existiert bereits — behalten.)

**Formular Einheiten:** neue `<section>` „Erfolg des Kompetenznachweises", **nur sichtbar wenn
`genutzt_kn` angehakt** (in vanilla JS via `hidden`-Toggle an die Checkbox hängen). `kn_ergebnis`
als Select mit den vier Buckets (Label z. B. „Bestehensquote: <50 % / 50–75 % / 75–90 % / >90 %").

**API:** Felder in `einheit-feedbacks/index.ts` durchreichen.

### P3 — Taxonomie-Echo  *(could)*
**Migration 011**, auf **`feedbacks`** + **`einheit_feedbacks`**:
```sql
add column if not exists wirksame_sk      text[] not null default '{}',
add column if not exists wirksame_aspekte text[] not null default '{}',
```
Multi-Select „Welche SK / Aspekte kamen tatsächlich zum Tragen?", **vorbelegt** aus den deklarierten
SK/Aspekten der Einheit/Situation (aus dem Index `src/lib/einheiten` bzw. `src/lib/situationen`,
analog wie die Feedback-Seite heute `meta.kn_typen` lädt). SK-Labels via `src/lib/sk-labels.ts`.

### P4 — Strukturierte „Neue/angepasste Idee" + Upload + Freigabe  *(must — Kern für KT2-Ziel 3)*
**Migration 011**, auf **`feedbacks`** + **`einheit_feedbacks`** (+ später `material_feedbacks`):
```sql
add column if not exists neue_idee              boolean not null default false,
add column if not exists idee_typ text check (idee_typ in ('herausforderung','handlungsprodukt','kn_aufgabe')),
add column if not exists idee_titel             text,
add column if not exists idee_beschreibung      text,
add column if not exists freigabe_gemeinsamer_kn boolean not null default false,
add column if not exists idee_dateien           jsonb not null default '[]',
```
Privater Storage-Bucket (in 011, Muster aus 010):
```sql
insert into storage.buckets (id, name, public)
values ('feedback-uploads', 'feedback-uploads', false)
on conflict (id) do nothing;
```

**Upload-Endpoints** (Blaupause `src/pages/api/materials/[id]/files.ts`):
- Empfehlung: **gemeinsamen Helper** `src/lib/feedback-uploads.ts` extrahieren, der
  `(table, idColumn, jsonbColumn, bucket, locals, id)` bekommt und POST/DELETE/GET kapselt —
  vermeidet 3-fache Duplikation. `authorize()` muss Besitz (`lp_id`) prüfen und nur in
  `status ∈ ('entwurf','eingereicht')` Schreiben erlauben; Download zusätzlich für `kt1`/`reviewer`.
- Routen: `src/pages/api/feedbacks/[id]/files.ts`,
  `src/pages/api/einheit-feedbacks/[id]/files.ts`,
  (P6) `src/pages/api/material-feedbacks/[id]/files.ts`.

**⚠ Voraussetzung für Einheiten-Upload:** `einheit-feedbacks` hat **noch keinen `[id].ts`** (nur
POST). Für Upload-nach-Erstellen und Entwurf-Bearbeitung **`src/pages/api/einheit-feedbacks/[id].ts`
mit PATCH anlegen** (Muster: `feedbacks/[id].ts`). Das Einheiten-Formular muss zudem die von POST
zurückgegebene `data.id` aufnehmen (heute verwirft `send()` die Antwort) und danach Dateien hochladen
— exakt wie `IntakeForm.astro` es im `submitMaterial()` macht.

**Formulare (beide):** Toggle „Ich habe eine neue/angepasste Herausforderung oder ein neues
Handlungsprodukt erstellt" (`neue_idee`). Wenn an: `idee_typ` (Radio), `idee_titel`, `idee_beschreibung`,
Datei-Upload-Block (Muster Block Z aus `IntakeForm.astro`), und Checkbox `freigabe_gemeinsamer_kn`
(„Darf das Kernteam dies für den gemeinsamen Kompetenznachweis verwenden?").
**Validierung:** wenn `neue_idee` → `idee_titel` + `idee_beschreibung` Pflicht.

### P5 — Konsistenz beider Formulare  *(should, klein)*
- `feedbacks.getestet_am` (Datum) vs. `einheit_feedbacks.getestet_von/_bis` (Range) — bewusst lassen
  oder angleichen; in beiden Admin-Ansichten konsistent darstellen.
- Sicherstellen, dass beide Formulare denselben neuen Block-Satz in gleicher Reihenfolge zeigen.

### P6 — Erprobungs-Loop für eingereichte Materialien  *(should — grösste strukturelle Lücke)*
Eingereichte Materialien (`materials`) haben heute **kein** Post-Unterricht-Feedback.
- **Neue Tabelle** `material_feedbacks` (Migration 011 oder 012), Schema analog
  `einheit_feedbacks`, aber `material_id uuid references public.materials(id) on delete cascade`
  statt `einheit_id`; gleiche Rating-/KN-/Niveau-/Neue-Idee-/Upload-Spalten wie oben; RLS wie bei
  `feedbacks` (LP eigene, kt1/reviewer alle). Separate Tabelle statt Felder an `materials`, weil
  *Design* (materials) und *Erprobung* (Feedback, ggf. mehrfach) getrennt bleiben sollen.
- **Route + Formular:** `POST/PATCH /api/material-feedbacks`, Einstieg von `/meine-materialien`
  (Button „Erfahrung berichten" pro eigenem Material). Upload via P4-Helper.
- **API:** `src/pages/api/material-feedbacks/index.ts` + `[id].ts` + `[id]/files.ts`.

### P7 — KT2-Handoff mit Nutzlast  *(should)*
`weitergeleitet_kt2` existiert als Status auf `feedbacks` + `einheit_feedbacks` (und P6:
`material_feedbacks`) — heute ohne Ansicht.
- **KT1-Aktion „an KT2 weiterleiten"** in den Admin-Feedback-Ansichten: setzt
  `status='weitergeleitet_kt2'`.
- **Neue Admin-Seite** `src/pages/admin/kt2.astro` (`kt1`-only): vereint alle Zeilen mit
  `status='weitergeleitet_kt2'` **oder** `freigabe_gemeinsamer_kn=true` aus den (zwei bzw. drei)
  Feedback-Quellen, **filterbar nach Kompetenz** (`einheit_id` / `situation_id` / Material-Kompetenz),
  zeigt `idee_*` + Download-Links (`idee_dateien` via Files-GET-Endpoint) + KN-Erfolg + Ergebnis-Bucket.
  Das ist die „Übergabemappe" für das Team gemeinsamer KN.
- In den Admin-Navbar (`src/layouts/Admin.astro`) einen Tab ergänzen (Bar-Konvention siehe CLAUDE.md
  „Design system / Layout chrome").

## 5. Bekannte Stolpersteine / Gaps (vor Start prüfen)
- **`einheit-feedbacks` ohne `[id].ts`** → für Upload + Entwurf-Edit nötig (P4).
- **Keine Einheiten-Feedback-Admin-Ansicht** gefunden (`src/pages/**/admin/**` liefert nur
  `situationen/admin/index.astro` + `admin/`); für P7 ggf. KT1-Review-UI für Einheiten-Feedback
  zuerst bauen. Verifizieren, wohin der „Einheiten →"-Link im Admin-Bar heute zeigt.
- **`einheiten/[setKey]/feedback.astro` verwirft die POST-Antwort** (`send()`); für File-Upload die
  `data.id` aufnehmen.
- **Storage:** Bucket privat lassen; nie über Storage-RLS, immer über Service-Role + Pfad-Whitelist
  (Pfad muss in der JSONB-Spalte der Zeile stehen, bevor er per Signed URL ausgeliefert wird).
- **Migration idempotent** halten und an `supabase/setup_full.sql` anhängen (Konvention aus 010).
- Build-Adapter warnt wegen Node-Version — unkritisch.

## 6. Datenschutz / Lean-Regeln (nicht verletzen)
- **Keine** Einzelschüler-Noten erfassen — nur Bestehensquote-Buckets (`kn_ergebnis`).
- Taxonomie im Feedback nur als **Echo** der bereits deklarierten SK/Aspekte, nicht die volle Liste.
- Neue-Idee-Felder nur sichtbar bei `neue_idee=true`; KN-Block nur bei `genutzt_kn=true` — Formular
  kurz halten.

## 7. Definition of Done
- [ ] Migration 011 (+ ggf. 012 für `material_feedbacks`) angelegt, idempotent, in `setup_full.sql`.
- [ ] Beide Feedback-Formulare zeigen: gesplittete Qualität, Niveau-Passung, (Einheit) KN-Erfolg-Block,
      Neue-Idee-Block mit Upload + Freigabe.
- [ ] Upload-Endpoints + gemeinsamer Helper; `einheit-feedbacks/[id].ts` (PATCH) ergänzt.
- [ ] API-Routen reichen alle neuen Felder durch (POST + PATCH).
- [ ] Admin/Dashboard-Aggregationen, die `qualitaet` lasen, aktualisiert.
- [ ] (P6) Material-Feedback-Loop ab `/meine-materialien`.
- [ ] (P7) `/admin/kt2`-Übergabeansicht + „an KT2 weiterleiten"-Aktion.
- [ ] `npm run build` grün.
- [ ] Migration im Supabase-Dashboard ausgeführt + mit `select` auf `information_schema.columns`
      und `storage.buckets` verifiziert (Vorgehen: siehe Muster, das für 010 verwendet wurde).

## 8. Feld-Referenz (Kurzform, alle neuen Spalten)

| Spalte | Typ | Tabellen | Phase |
|---|---|---|---|
| `qualitaet_situation` | int 1–5 | feedbacks, einheit_feedbacks, material_feedbacks | P1 |
| `qualitaet_handlungsprodukt` | int 1–5 | dito | P1 |
| `niveau_passung` | text (`zu_leicht`/`passend`/`zu_schwer`) | dito | P1 |
| `noetiges_scaffolding` | text | dito | P1 |
| `kn_fairness` | int 1–5 | einheit_feedbacks, material_feedbacks | P2 |
| `kn_zeit_angemessen` | int 1–5 | dito | P2 |
| `kn_raster_brauchbar` | int 1–5 | dito | P2 |
| `kn_ergebnis` | text (`unter_50`/`50_75`/`75_90`/`ueber_90`) | dito | P2 |
| `wirksame_sk` | text[] | feedbacks, einheit_feedbacks, material_feedbacks | P3 |
| `wirksame_aspekte` | text[] | dito | P3 |
| `neue_idee` | bool | dito | P4 |
| `idee_typ` | text (`herausforderung`/`handlungsprodukt`/`kn_aufgabe`) | dito | P4 |
| `idee_titel` | text | dito | P4 |
| `idee_beschreibung` | text | dito | P4 |
| `freigabe_gemeinsamer_kn` | bool | dito | P4 |
| `idee_dateien` | jsonb `[]` | dito | P4 |

Bucket: `feedback-uploads` (privat). Bestehende, NICHT zu entfernende Spalten: `qualitaet`,
`kn_validitaet`, `begleiter_nuetzlich`, alle Kontext-/Workflow-Felder.
