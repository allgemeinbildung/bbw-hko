-- ============================================================
-- ABU-Materialplattform — Demo-Seed für Präsentation
-- Ausführen im Supabase SQL Editor (service role erforderlich)
-- ============================================================
-- Erstellt 3 Demo-LP-Accounts + 12 Materialien in versch. Status
-- Passwort für alle Demo-Accounts: demo1234
-- ============================================================

do $$
declare
  lp1 uuid := '11111111-1111-1111-1111-111111111111';
  lp2 uuid := '22222222-2222-2222-2222-222222222222';
  lp3 uuid := '33333333-3333-3333-3333-333333333333';
begin

  -- ── Auth-User anlegen ──────────────────────────────────────
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token
  ) values
    ('00000000-0000-0000-0000-000000000000', lp1, 'authenticated', 'authenticated',
     'anna.bauer@bbw.ch', crypt('demo1234', gen_salt('bf')),
     now(), '{"provider":"email","providers":["email"]}', '{}',
     now() - interval '30 days', now(), '', ''),
    ('00000000-0000-0000-0000-000000000000', lp2, 'authenticated', 'authenticated',
     'bruno.mueller@bbw.ch', crypt('demo1234', gen_salt('bf')),
     now(), '{"provider":"email","providers":["email"]}', '{}',
     now() - interval '25 days', now(), '', ''),
    ('00000000-0000-0000-0000-000000000000', lp3, 'authenticated', 'authenticated',
     'claudia.frei@bbw.ch', crypt('demo1234', gen_salt('bf')),
     now(), '{"provider":"email","providers":["email"]}', '{}',
     now() - interval '20 days', now(), '', '')
  on conflict (id) do nothing;

  -- ── Profile anlegen ───────────────────────────────────────
  insert into public.profiles (id, full_name, abteilung, role) values
    (lp1, 'Anna Bauer',     'Abt. 3', 'lp'),
    (lp2, 'Bruno Müller',   'Abt. 1', 'lp'),
    (lp3, 'Claudia Frei',   'Abt. 2', 'lp')
  on conflict (id) do nothing;

  -- ── Materialien ───────────────────────────────────────────

  -- 1 — T1 LJ1 EFZ-3J · freigegeben
  insert into public.materials (
    submitted_by, typ, lehrdauer, lehrjahr, thema_nr, thema_titel, titel,
    abteilung, schluesselkompetenzen, aspekte,
    sprachmodus_primaer, sprachmodi_sekundaer,
    herausforderung_text, handlungsprodukt_typ, handlungsprodukt_beschreibung,
    beurteilungsraster, selbstcheck, status, created_at
  ) values (
    lp1, 'kompetenznachweis', 'EFZ-3J', 1, 1, 'Berufseinstieg und Identität',
    'Mein Lehrvertrag — Rechte und Pflichten kennen',
    'Abt. 3',
    ARRAY['Ziele setzen und anpassen', 'Standpunkte begründen', 'Teamarbeit'],
    ARRAY['Recht', 'Identität und Sozialisation'],
    'Rezeption schriftlich und bildlich',
    ARRAY['Interaktion und Kollaboration schriftlich'],
    'Ich bin seit 3 Monaten Lernende/r bei der Firma Müller AG. Mein Berufsbildner teilt mir mit, dass mein Lehrvertrag angepasst werden soll — ich verstehe aber nicht warum und was das rechtlich für mich bedeutet. Ich muss die wichtigsten Klauseln meines Lehrvertrags analysieren und beurteilen, ob die geplanten Änderungen zulässig sind.',
    'schriftlich',
    'Lernende analysieren ihren eigenen Lehrvertrag und identifizieren 3 kritische Klauseln. Sie verfassen eine strukturierte Stellungnahme (1 Seite) an den Berufsbildner.',
    true,
    '{"h":{"ich_perspektive":true,"k3_oder_hoeher":true,"min_schluesselkompetenzen":true,"min_aspekte":true,"situation_konkret":true},"kn":{"kompetenz_formuliert":true,"bewertungsraster_vorhanden":true,"eigenstaendig_loesbar":true,"min_schluesselkompetenzen":true,"bearbeitungszeit_realistisch":true}}',
    'freigegeben', now() - interval '28 days'
  );

  -- 2 — T1 LJ1 EFZ-3J · gesichtet
  insert into public.materials (
    submitted_by, typ, lehrdauer, lehrjahr, thema_nr, thema_titel, titel,
    abteilung, schluesselkompetenzen, aspekte,
    sprachmodus_primaer, sprachmodi_sekundaer,
    herausforderung_text, handlungsprodukt_typ, handlungsprodukt_beschreibung,
    beurteilungsraster, selbstcheck, status, created_at
  ) values (
    lp2, 'kompetenznachweis', 'EFZ-3J', 1, 1, 'Berufseinstieg und Identität',
    'Digitale Kommunikation im Betrieb — Chancen und Risiken',
    'Abt. 1',
    ARRAY['Technologische und digitale Transformation', 'Werthaltungen reflektieren', 'Quellen unterscheiden'],
    ARRAY['Technologische und digitale Transformation', 'Identität und Sozialisation'],
    'Interaktion und Kollaboration digital',
    ARRAY['Produktion schriftlich und bildlich'],
    'Ich arbeite seit 2 Monaten im Büro und nutze täglich digitale Kommunikationstools. Neulich erhielt ich eine E-Mail, die mich aufforderte, auf einen Link zu klicken — mein Vorgesetzter warnt mich vor Phishing. Ich muss verstehen, wie digitale Kommunikation sicher und professionell genutzt wird.',
    'schriftlich',
    'Lernende erstellen eine 1-seitige Richtlinie für sicheres digitales Kommunizieren im Betrieb, inkl. 3 konkreter Regeln.',
    false,
    '{"h":{"ich_perspektive":true,"k3_oder_hoeher":true,"min_schluesselkompetenzen":true,"min_aspekte":true,"situation_konkret":true},"kn":{"kompetenz_formuliert":true,"bewertungsraster_vorhanden":false,"eigenstaendig_loesbar":true,"min_schluesselkompetenzen":true,"bearbeitungszeit_realistisch":true}}',
    'gesichtet', now() - interval '22 days'
  );

  -- 3 — T1 LJ2 EFZ-3J · revision_noetig
  insert into public.materials (
    submitted_by, typ, lehrdauer, lehrjahr, thema_nr, thema_titel, titel,
    abteilung, schluesselkompetenzen, aspekte,
    sprachmodus_primaer, sprachmodi_sekundaer,
    herausforderung_text, handlungsprodukt_typ, handlungsprodukt_beschreibung,
    beurteilungsraster, selbstcheck, status, kt1_kommentar, created_at
  ) values (
    lp3, 'kompetenznachweis', 'EFZ-3J', 2, 1, 'Berufseinstieg und Identität',
    'Berufliche Identität — Wer bin ich im Betrieb?',
    'Abt. 2',
    ARRAY['Werthaltungen reflektieren', 'Standpunkte begründen'],
    ARRAY['Identität und Sozialisation', 'Ethik'],
    'Produktion mündlich',
    ARRAY[]::text[],
    'Ich bin jetzt im zweiten Lehrjahr und merke, dass meine Rolle im Betrieb grösser wird. Kollegen fragen mich um Rat und mein Vorgesetzter übergibt mir mehr Verantwortung. Ich frage mich, wer ich als Berufsperson bin und wie ich meine Stärken gezielt einsetzen kann.',
    'mündlich',
    'Lernende halten eine 3-minütige Präsentation über ihre berufliche Identität und nennen 2 konkrete Stärken mit Beispielen aus dem Betrieb.',
    false,
    '{"h":{"ich_perspektive":true,"k3_oder_hoeher":false,"min_schluesselkompetenzen":false,"min_aspekte":true,"situation_konkret":true},"kn":{"kompetenz_formuliert":true,"bewertungsraster_vorhanden":false,"eigenstaendig_loesbar":true,"min_schluesselkompetenzen":false,"bearbeitungszeit_realistisch":true}}',
    'revision_noetig',
    'Kognitives Niveau K3 ist nicht erfüllt — die Aufgabe bleibt auf Verständnisebene (K2). Bitte konkrete Analyse-/Beurteilungsaufgabe einbauen. Zudem fehlt ein Bewertungsraster.',
    now() - interval '18 days'
  );

  -- 4 — T2 LJ1 EFZ-3J · freigegeben
  insert into public.materials (
    submitted_by, typ, lehrdauer, lehrjahr, thema_nr, thema_titel, titel,
    abteilung, schluesselkompetenzen, aspekte,
    sprachmodus_primaer, sprachmodi_sekundaer,
    herausforderung_text, handlungsprodukt_typ, handlungsprodukt_beschreibung,
    beurteilungsraster, selbstcheck, status, created_at
  ) values (
    lp1, 'kompetenznachweis', 'EFZ-3J', 1, 2, 'Meinungsbildung und politische Partizipation',
    'Fake News erkennen — Medienkritik im Alltag',
    'Abt. 3',
    ARRAY['Quellen unterscheiden', 'Werthaltungen reflektieren', 'Standpunkte begründen'],
    ARRAY['Politik', 'Technologische und digitale Transformation'],
    'Rezeption audiovisuell',
    ARRAY['Produktion schriftlich und bildlich', 'Interaktion und Kollaboration digital'],
    'Ich scrolle durch meinen Instagram-Feed und sehe einen viralen Beitrag über eine politische Entscheidung — meine Kollegin hat ihn geteilt und glaubt ihn sofort. Ich bin unsicher, ob die Information stimmt, und will herausfinden, wie ich verlässliche von irreführenden Quellen unterscheide.',
    'multimedial',
    'Lernende analysieren 3 Social-Media-Beiträge zu einem aktuellen politischen Thema nach dem SIFT-Prinzip und erstellen eine kurze Erklär-Story (Instagram-Format, 5 Slides) über ihre Erkenntnisse.',
    true,
    '{"h":{"ich_perspektive":true,"k3_oder_hoeher":true,"min_schluesselkompetenzen":true,"min_aspekte":true,"situation_konkret":true},"kn":{"kompetenz_formuliert":true,"bewertungsraster_vorhanden":true,"eigenstaendig_loesbar":true,"min_schluesselkompetenzen":true,"bearbeitungszeit_realistisch":true}}',
    'freigegeben', now() - interval '20 days'
  );

  -- 5 — T2 LJ2 EFZ-3J · eingereicht
  insert into public.materials (
    submitted_by, typ, lehrdauer, lehrjahr, thema_nr, thema_titel, titel,
    abteilung, schluesselkompetenzen, aspekte,
    sprachmodus_primaer, sprachmodi_sekundaer,
    herausforderung_text, handlungsprodukt_typ, handlungsprodukt_beschreibung,
    beurteilungsraster, selbstcheck, status, created_at
  ) values (
    lp2, 'kompetenznachweis', 'EFZ-3J', 2, 2, 'Meinungsbildung und politische Partizipation',
    'Abstimmung vorbereiten — informiert mitstimmen',
    'Abt. 1',
    ARRAY['Quellen unterscheiden', 'Standpunkte begründen', 'Werthaltungen reflektieren'],
    ARRAY['Politik', 'Ethik'],
    'Rezeption schriftlich und bildlich',
    ARRAY['Produktion mündlich'],
    'Ich bin 18 und werde zum ersten Mal abstimmen. Es liegt eine Volksinitiative vor, bei der ich mich noch nicht entschieden habe. Meine Eltern sind verschiedener Meinung — ich will mir selbst eine fundierte Meinung bilden und meine Entscheidung begründen können.',
    'schriftlich',
    'Lernende erstellen einen 2-seitigen Abstimmungsratgeber zu einer echten aktuellen Vorlage: Pro/Kontra-Analyse, Quellenangaben, persönliche Begründung der Stimmabsicht.',
    false,
    '{"h":{"ich_perspektive":true,"k3_oder_hoeher":true,"min_schluesselkompetenzen":true,"min_aspekte":true,"situation_konkret":true},"kn":{"kompetenz_formuliert":true,"bewertungsraster_vorhanden":false,"eigenstaendig_loesbar":true,"min_schluesselkompetenzen":true,"bearbeitungszeit_realistisch":true}}',
    'eingereicht', now() - interval '5 days'
  );

  -- 6 — T3 LJ1 EFZ-3J · freigegeben
  insert into public.materials (
    submitted_by, typ, lehrdauer, lehrjahr, thema_nr, thema_titel, titel,
    abteilung, schluesselkompetenzen, aspekte,
    sprachmodus_primaer, sprachmodi_sekundaer,
    herausforderung_text, handlungsprodukt_typ, handlungsprodukt_beschreibung,
    beurteilungsraster, selbstcheck, status, created_at
  ) values (
    lp3, 'kompetenznachweis', 'EFZ-3J', 1, 3, 'Konsum und Nachhaltigkeit',
    'Mein Lohn — Budget planen und Konsum reflektieren',
    'Abt. 2',
    ARRAY['Ziele setzen und anpassen', 'Innovation und Problemlösung', 'Werthaltungen reflektieren'],
    ARRAY['Wirtschaft', 'Ökologie', 'Ethik'],
    'Produktion schriftlich und bildlich',
    ARRAY['Interaktion und Kollaboration schriftlich'],
    'Ich habe meinen ersten Lohn erhalten und weiss nicht, wie ich das Geld sinnvoll einteilen soll. Meine Ausbildnerin schlägt vor, ein Monatsbudget zu erstellen. Gleichzeitig möchte ich nachhaltig konsumieren, muss aber auch sparen.',
    'schriftlich',
    'Lernende erstellen ihr persönliches Monatsbudget, vergleichen 2 Konsumentscheide nach ökologischen und wirtschaftlichen Kriterien und begründen schriftlich, wie sie nachhaltiger konsumieren könnten.',
    true,
    '{"h":{"ich_perspektive":true,"k3_oder_hoeher":true,"min_schluesselkompetenzen":true,"min_aspekte":true,"situation_konkret":true},"kn":{"kompetenz_formuliert":true,"bewertungsraster_vorhanden":true,"eigenstaendig_loesbar":true,"min_schluesselkompetenzen":true,"bearbeitungszeit_realistisch":true}}',
    'freigegeben', now() - interval '15 days'
  );

  -- 7 — T3 LJ2 EFZ-3J · gesichtet
  insert into public.materials (
    submitted_by, typ, lehrdauer, lehrjahr, thema_nr, thema_titel, titel,
    abteilung, schluesselkompetenzen, aspekte,
    sprachmodus_primaer, sprachmodi_sekundaer,
    herausforderung_text, handlungsprodukt_typ, handlungsprodukt_beschreibung,
    beurteilungsraster, selbstcheck, status, created_at
  ) values (
    lp1, 'kompetenznachweis', 'EFZ-3J', 2, 3, 'Konsum und Nachhaltigkeit',
    'Online-Shopping — Konsumrecht und Rückgabe',
    'Abt. 3',
    ARRAY['Quellen unterscheiden', 'Standpunkte begründen'],
    ARRAY['Recht', 'Wirtschaft'],
    'Interaktion und Kollaboration schriftlich',
    ARRAY['Rezeption schriftlich und bildlich'],
    'Ich habe bei einem Online-Shop eine Jacke bestellt, die nicht der Beschreibung entspricht. Der Shop verweigert die Rücknahme und beruft sich auf seine AGB. Ich weiss nicht, welche Rechte ich als Konsument habe und wie ich vorgehen soll.',
    'schriftlich',
    'Lernende analysieren einen realen oder fiktiven Onlinekauf-Konflikt, bestimmen die relevanten Konsumentenrechte und verfassen einen formellen Reklamationsbrief.',
    false,
    '{"h":{"ich_perspektive":true,"k3_oder_hoeher":true,"min_schluesselkompetenzen":true,"min_aspekte":true,"situation_konkret":true},"kn":{"kompetenz_formuliert":true,"bewertungsraster_vorhanden":false,"eigenstaendig_loesbar":true,"min_schluesselkompetenzen":false,"bearbeitungszeit_realistisch":true}}',
    'gesichtet', now() - interval '10 days'
  );

  -- 8 — T1 LJ1 EBA · freigegeben
  insert into public.materials (
    submitted_by, typ, lehrdauer, lehrjahr, thema_nr, thema_titel, titel,
    abteilung, schluesselkompetenzen, aspekte,
    sprachmodus_primaer, sprachmodi_sekundaer,
    herausforderung_text, handlungsprodukt_typ, handlungsprodukt_beschreibung,
    beurteilungsraster, selbstcheck, status, created_at
  ) values (
    lp2, 'kompetenznachweis', 'EBA', 1, 1, 'Berufseinstieg und Identität',
    'Mein Arbeitsalltag — Rechte und Pflichten im EBA',
    'Abt. 1',
    ARRAY['Ziele setzen und anpassen', 'Teamarbeit'],
    ARRAY['Recht', 'Identität und Sozialisation'],
    'Rezeption schriftlich und bildlich',
    ARRAY['Interaktion und Kollaboration mündlich'],
    'Ich habe meine EBA-Ausbildung begonnen und merke, dass mein Berufsbildner andere Erwartungen hat als ich. Er sagt, ich sei oft zu spät. Ich möchte verstehen, welche Pflichten ich als Lernende/r habe und wie ich Konflikte im Betrieb ansprechen kann.',
    'mündlich',
    'Lernende führen ein strukturiertes Feedbackgespräch (Rollenspiel) mit dem Berufsbildner und bereiten dazu 3 eigene Lernziele mit konkreten Massnahmen vor.',
    true,
    '{"h":{"ich_perspektive":true,"k3_oder_hoeher":true,"min_schluesselkompetenzen":true,"min_aspekte":true,"situation_konkret":true},"kn":{"kompetenz_formuliert":true,"bewertungsraster_vorhanden":true,"eigenstaendig_loesbar":true,"min_schluesselkompetenzen":true,"bearbeitungszeit_realistisch":true}}',
    'freigegeben', now() - interval '26 days'
  );

  -- 9 — T2 LJ1 EBA · eingereicht
  insert into public.materials (
    submitted_by, typ, lehrdauer, lehrjahr, thema_nr, thema_titel, titel,
    abteilung, schluesselkompetenzen, aspekte,
    sprachmodus_primaer, sprachmodi_sekundaer,
    herausforderung_text, handlungsprodukt_typ, handlungsprodukt_beschreibung,
    beurteilungsraster, selbstcheck, status, created_at
  ) values (
    lp3, 'kompetenznachweis', 'EBA', 1, 2, 'Meinungsbildung und politische Partizipation',
    'Nachrichten verstehen — Medien kritisch lesen',
    'Abt. 2',
    ARRAY['Quellen unterscheiden', 'Werthaltungen reflektieren'],
    ARRAY['Politik', 'Kultur'],
    'Rezeption audiovisuell',
    ARRAY[]::text[],
    'In meinem Betrieb diskutieren Kolleginnen über einen Bericht im Tagesschau. Ich verstehe nicht alles und bin unsicher, ob ich der Information vertrauen kann. Ich will lernen, Nachrichten besser einzuordnen.',
    'multimedial',
    'Lernende schauen 2 Berichte zum gleichen Thema (SRF vs. anderer Kanal) und erstellen eine Mindmap der Unterschiede. Sie begründen mündlich, welchem Bericht sie mehr vertrauen und warum.',
    false,
    '{"h":{"ich_perspektive":true,"k3_oder_hoeher":false,"min_schluesselkompetenzen":true,"min_aspekte":true,"situation_konkret":true},"kn":{"kompetenz_formuliert":true,"bewertungsraster_vorhanden":false,"eigenstaendig_loesbar":true,"min_schluesselkompetenzen":true,"bearbeitungszeit_realistisch":true}}',
    'eingereicht', now() - interval '3 days'
  );

  -- 10 — T3 LJ1 EFZ-4J · eingereicht
  insert into public.materials (
    submitted_by, typ, lehrdauer, lehrjahr, thema_nr, thema_titel, titel,
    abteilung, schluesselkompetenzen, aspekte,
    sprachmodus_primaer, sprachmodi_sekundaer,
    herausforderung_text, handlungsprodukt_typ, handlungsprodukt_beschreibung,
    beurteilungsraster, selbstcheck, status, created_at
  ) values (
    lp1, 'kompetenznachweis', 'EFZ-4J', 1, 3, 'Konsum und Nachhaltigkeit',
    'Faire Mode — Konsum und globale Verantwortung',
    'Abt. 3',
    ARRAY['Werthaltungen reflektieren', 'Innovation und Problemlösung', 'Quellen unterscheiden', 'Standpunkte begründen'],
    ARRAY['Ökologie', 'Ethik', 'Wirtschaft', 'Identität und Sozialisation'],
    'Rezeption audiovisuell',
    ARRAY['Produktion multimedial', 'Interaktion und Kollaboration schriftlich'],
    'Ich kaufe gerne Kleider bei Temu und Shein. In der Schule habe ich einen Dokumentarfilm über Arbeitsbedingungen in asiatischen Textilfabriken gesehen. Jetzt bin ich unsicher: Ist mein Konsumverhalten ethisch vertretbar? Wie kann ich modisch bleiben und trotzdem nachhaltig kaufen?',
    'multimedial',
    'Lernende recherchieren die Lieferkette eines Fast-Fashion-Produkts, bewerten die ökologischen und sozialen Kosten und erstellen ein 3-minütiges Video-Statement zu ihrer persönlichen Konsumhaltung.',
    true,
    '{"h":{"ich_perspektive":true,"k3_oder_hoeher":true,"min_schluesselkompetenzen":true,"min_aspekte":true,"situation_konkret":true},"kn":{"kompetenz_formuliert":true,"bewertungsraster_vorhanden":true,"eigenstaendig_loesbar":true,"min_schluesselkompetenzen":true,"bearbeitungszeit_realistisch":true}}',
    'eingereicht', now() - interval '2 days'
  );

  -- 11 — T1 LJ3 EFZ-3J · freigegeben
  insert into public.materials (
    submitted_by, typ, lehrdauer, lehrjahr, thema_nr, thema_titel, titel,
    abteilung, schluesselkompetenzen, aspekte,
    sprachmodus_primaer, sprachmodi_sekundaer,
    herausforderung_text, handlungsprodukt_typ, handlungsprodukt_beschreibung,
    beurteilungsraster, selbstcheck, status, created_at
  ) values (
    lp2, 'kompetenznachweis', 'EFZ-3J', 3, 1, 'Berufseinstieg und Identität',
    'Lehrende = Lernende? Wissenstransfer im Betrieb',
    'Abt. 1',
    ARRAY['Teamarbeit', 'Innovation und Problemlösung', 'Ziele setzen und anpassen'],
    ARRAY['Identität und Sozialisation', 'Technologische und digitale Transformation'],
    'Interaktion und Kollaboration mündlich',
    ARRAY['Produktion multimedial'],
    'Ich bin im letzten Lehrjahr und mein Berufsbildner fragt mich, ob ich eine neue Lernende in digitalen Tools einarbeiten kann. Ich soll ihr nächste Woche zeigen, wie ich unsere Betriebssoftware nutze. Ich habe das selbst nie erklärt und weiss nicht, wie ich Wissen gut weitergeben kann.',
    'mündlich',
    'Lernende planen und führen eine 10-minütige Einführung für eine fiktive neue Kollegin durch. Sie nutzen dabei eine selbst erstellte visuelle Hilfestellung (z. B. Ablaufdiagramm, Screenshot-Anleitung).',
    true,
    '{"h":{"ich_perspektive":true,"k3_oder_hoeher":true,"min_schluesselkompetenzen":true,"min_aspekte":true,"situation_konkret":true},"kn":{"kompetenz_formuliert":true,"bewertungsraster_vorhanden":true,"eigenstaendig_loesbar":true,"min_schluesselkompetenzen":true,"bearbeitungszeit_realistisch":true}}',
    'freigegeben', now() - interval '12 days'
  );

  -- 12 — T2 LJ3 EFZ-3J · eingereicht
  insert into public.materials (
    submitted_by, typ, lehrdauer, lehrjahr, thema_nr, thema_titel, titel,
    abteilung, schluesselkompetenzen, aspekte,
    sprachmodus_primaer, sprachmodi_sekundaer,
    herausforderung_text, handlungsprodukt_typ, handlungsprodukt_beschreibung,
    beurteilungsraster, selbstcheck, status, created_at
  ) values (
    lp3, 'kompetenznachweis', 'EFZ-3J', 3, 2, 'Meinungsbildung und politische Partizipation',
    'Jetzt darf ich abstimmen — Volksinitiative analysieren',
    'Abt. 2',
    ARRAY['Quellen unterscheiden', 'Standpunkte begründen', 'Werthaltungen reflektieren', 'Ziele setzen und anpassen'],
    ARRAY['Politik', 'Recht', 'Ethik'],
    'Produktion schriftlich und bildlich',
    ARRAY['Rezeption schriftlich und bildlich', 'Interaktion und Kollaboration mündlich'],
    'In zwei Wochen kommt eine kantonale Initiative zur Abstimmung, die die Schulpolitik betrifft. Meine Kolleginnen diskutieren, aber ich verstehe die Argumente kaum. Ich will nicht einfach dem Gefühl folgen, sondern die Initiative wirklich verstehen und meine Stimme bewusst einsetzen.',
    'mischform',
    'Lernende lesen die offiziellen Abstimmungsunterlagen, analysieren je 2 Pro- und Kontra-Argumente nach Sachlichkeit und Belegen, und präsentieren ihr Urteil in einer 5-Minuten-Diskussion im Klassenplenum.',
    false,
    '{"h":{"ich_perspektive":true,"k3_oder_hoeher":true,"min_schluesselkompetenzen":true,"min_aspekte":true,"situation_konkret":true},"kn":{"kompetenz_formuliert":true,"bewertungsraster_vorhanden":false,"eigenstaendig_loesbar":true,"min_schluesselkompetenzen":true,"bearbeitungszeit_realistisch":true}}',
    'eingereicht', now() - interval '1 day'
  );

end $$;
