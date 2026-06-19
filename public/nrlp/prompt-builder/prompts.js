// prompts.js - One function per output type.
// Each function receives the selection state (S) and returns a prompt string.

import { orientierungAusUnits } from './orientierung.js';
import { skShort } from '../ext/sk-labels.js';

export const OUTPUT_TYPES = [
  { value: 'lernsituation', label: 'Lernsituation erstellen' },
  { value: 'aufgabe', label: 'Aufgabenstellung (Handlungsprodukt)' },
  { value: 'raster', label: 'Beurteilungsraster' },
  { value: 'prüfung', label: 'Pruefungsaufgabe' },
  { value: 'arbeitsblatt', label: 'Arbeitsblatt / Fallbeispiel' },
  { value: 'reflexion', label: 'Reflexionsfragen' },
];

function formatKompetenzen(kompetenzen) {
  if (!kompetenzen.length) return '  - Keine Kompetenzen ausgewaehlt.';
  return kompetenzen.map(k => `  - ${k.nr}: ${k.text}`).join('\n');
}

// Generisch: R-Wert eines Konzepts im aktuellen Thema aus der zirkularitaet ziehen.
export function rWertFor(nrlp, bucket, name, themaNr) {
  if (!nrlp || !name || themaNr == null) return null;
  const list = nrlp?.zirkularitaet?.[bucket] || [];
  const hit = list.find(x => x.bezeichnung === name);
  return hit?.wiederholungen?.[`T${themaNr}`] || null;
}

function formatSprachmodi(sprachmodi, nrlp, themaNr) {
  if (!sprachmodi.length) return '  - Keine Sprachmodi ausgewaehlt.';
  return sprachmodi
    .map(sm => {
      const name = typeof sm === 'string' ? sm : sm.modus;
      const head = typeof sm === 'string' ? `  - ${sm}` : `  - ${sm.modus}: ${sm.detail}`;
      const r = rWertFor(nrlp, 'sprachmodi', name, themaNr);
      return [head, `    -> Progressionsstufe: ${r || 'keine Angabe'}`, `    -> ${giProgressionHint(r)}`].join('\n');
    })
    .join('\n');
}

function formatSchluesselkompetenzen(schluessel, nrlp, themaNr) {
  if (!schluessel.length) return '  - Keine Schluesselkompetenzen ausgewaehlt.';
  return schluessel
    .map((sk, i) => {
      // Thema-SK sind volle Bildungsrat-Sätze; zirkularitaet nutzt das Kurzlabel.
      const r = rWertFor(nrlp, 'schluesselkompetenzen', skShort(sk), themaNr);
      return [`  SK${i + 1}: ${sk}`, `    -> Progressionsstufe: ${r || 'keine Angabe'}`, `    -> ${giProgressionHint(r)}`].join('\n');
    })
    .join('\n');
}

function giProgressionHint(rWert) {
  if (!rWert) {
    return 'Keine Progressionsinformation verfuegbar. Passe das Niveau nach eigenem Ermessen an.';
  }
  if (rWert === 'R1') {
    return 'Dieser Aspekt wird in diesem Thema erstmals eingefuehrt. Erkläre Grundbegriffe direkt im Situationstext. Setze kein Vorwissen voraus.';
  }
  if (rWert === 'R2') {
    return 'Dieser Aspekt wurde in einem frueheren Thema eingefuehrt. Setze Grundbegriffe als bekannt voraus und vertiefe auf Anwendungsebene (K3).';
  }
  return 'Dieser Aspekt ist den Lernenden vertraut. Arbeite auf Analyse- und Transferebene (K4/K5). Vorwissen explizit aktivieren und verknüpfen.';
}

function formatGesellschaft(S, nrlp) {
  if (!S.gesellschaft.length) return '  - Keine gesellschaftlichen Inhalte ausgewaehlt.';

  return S.gesellschaft
    .map((gi) => {
      let rWert = null;
      if (nrlp?.zirkularitaet?.gesellschaftsinhalte) {
        const zgi = nrlp.zirkularitaet.gesellschaftsinhalte.find(x => x.bezeichnung === gi.aspekt);
        rWert = zgi?.wiederholungen?.[`T${S.thema.nr}`] || null;
      }
      return [
        `  - ${gi.aspekt}: ${gi.detail}`,
        `    -> Progressionsstufe: ${rWert || 'keine Angabe'}`,
        `    -> ${giProgressionHint(rWert)}`,
      ].join('\n');
    })
    .join('\n');
}

function firstLebensbezug(S) {
  return S.lebensbezuege.length ? S.lebensbezuege[0] : null;
}

function firstBeispiel(S) {
  return S.beispiele.length ? S.beispiele[0] : null;
}

function sharedBlocks(S, nrlp) {
  const lb = firstLebensbezug(S);
  const themaNr = S.thema?.nr;

  // Orientierungsbeispiel: offizielle umsetzungsbeispiele (sobald publiziert) haben
  // Vorrang; sonst Interim aus einer echten Einheit/Situation.
  const offiziell = firstBeispiel(S);
  const interim = offiziell ? null : orientierungAusUnits(S, nrlp?._datasetPath);
  const beQuelle = offiziell ? 'nRLP-Umsetzungsbeispiel' : (interim?.quelle || '—');

  return {
    themaNr,
    themaTitel: S.thema?.titel || '',
    themaLehrjahr: S.thema?.lehrjahr || '',
    leitideeKurz: S.thema?.leitidee?.kurz || 'Keine Leitidee verfuegbar.',
    lebensbezugZeile: lb
      ? `LEBENSBEZUG ${lb.nr}: ${lb.text}`
      : 'LEBENSBEZUG: Nicht ausgewaehlt (bei Bedarf ergaenzen).',
    kompetenzen: formatKompetenzen(S.kompetenzen),
    gesellschaft: formatGesellschaft(S, nrlp),
    sprachmodi: formatSprachmodi(S.sprachmodi, nrlp, themaNr),
    schluessel: formatSchluesselkompetenzen(S.schluessel, nrlp, themaNr),
    beispielHerausforderung: offiziell?.herausforderung || interim?.herausforderung
      || 'Noch kein Orientierungsbeispiel — offizielle Umsetzungsbeispiele folgen (~Ende Juni 2026).',
    beispielProdukt: offiziell?.produkt || interim?.produkt
      || 'Noch kein Produktbeispiel verfügbar.',
    beQuelle,
    lektionenThema: S.thema?.lektionen || null,
    lektionenLB: lb?.lektionen || null,
    pruefungstyp: (S.pruefungstyp || '').trim() || '[aus UI befuellen]',
    pruefungsdauer: (S.pruefungsdauer || '').trim() || '[aus UI befuellen]',
    hilfsmittel: (S.hilfsmittel || '').trim() || '[aus UI befuellen]',
    handlungsprodukt: (S.handlungsprodukt || '').trim() || '[durch Lehrperson eintragen]',
  };
}

function lernsituation(S, niveau, nrlp) {
  const C = sharedBlocks(S, nrlp);
  return [
    'Du bist Lehrperson im Allgemeinbildenden Unterricht (ABU) an einer Berufsfachschule in der Schweiz.',
    `Deine Zielgruppe sind Lernende im ${C.themaLehrjahr}. Lehrjahr, Alter ca. 15-20 Jahre.`,
    '',
    `Wir arbeiten an Thema T${C.themaNr} - ${C.themaTitel}.`,
    `Leitidee: ${C.leitideeKurz}`,
    '',
    C.lebensbezugZeile,
    '',
    'AUSGEWAEHLTE KOMPETENZEN:',
    C.kompetenzen,
    '',
    'GESELLSCHAFTLICHE INHALTE:',
    C.gesellschaft,
    '',
    'SPRACHMODI:',
    C.sprachmodi,
    '',
    'SCHLUESSELKOMPETENZEN (2-3 für diese Einheit):',
    C.schluessel,
    '',
    `ORIENTIERUNGSBEISPIEL (${C.beQuelle} — nicht 1:1 kopieren, nur als Massstab für Detailgrad und Tonalitaet):`,
    `Herausforderung: ${C.beispielHerausforderung}`,
    `Produkt: ${C.beispielProdukt}`,
    '',
    'DEINE AUFGABE: Erstelle eine vollständige Lernsituation mit folgenden Qualitaetskriterien:',
    '',
    '1. AUSGANGSSITUATION (ICH-Perspektive)',
    '   Schreibe die Einstiegssituation in der Du-Form oder Ich-Form der Lernenden.',
    '   Die Situation muss authentisch und verortbar sein (konkreter Ort, konkrete Person, konkrete Zeit),',
    '   ein echtes Problem enthalten das emotional beruehrt, und in der Berufs- oder Lebenswelt',
    `   von Lernenden im ${C.themaLehrjahr}. Lehrjahr angesiedelt sein.`,
    '',
    '2. PROBLEMSTELLUNG (K3/K4-Niveau)',
    '   Die Herausforderung muss auf Bloom-Niveau K3 (Entscheiden und Begründen) oder K4 (Analysieren)',
    '   operieren. Vermeide K1/K2-Aufgaben (beschreibe, erkläre, nenne). Die Lernenden müssen eine',
    '   echte Entscheidung treffen und begründen oder eine Situation analysieren und bewerten.',
    '   Es darf keine einzige richtige Lösung geben - mehrere Loesungswege müssen möglich sein.',
    '',
    '3. HANDLUNGSPRODUKT',
    '   Definiere ein konkretes, authentisches Produkt das:',
    '   - in der realen Lebens- oder Berufswelt tatsächlich vorkommt,',
    `   - direkt an den gewählten Sprachmodus gebunden ist (${C.sprachmodi}),`,
    '   - als Kompetenznachweis bewertet werden kann,',
    '   - und dessen Qualitaetskriterien für Lernende vorab transparent sind.',
    '',
    '4. PROZESSSTRUKTUR (IPERKA oder SOL)',
    '   Gliedere den Lernprozess entweder nach IPERKA (Informieren, Planen, Entscheiden, Realisieren,',
    '   Kontrollieren, Auswerten) oder beschreibe, wie Lernende sich das noetige Wissen selbststaendig',
    '   erarbeiten. Weise jedem Schritt eine ungefaehre Zeit zu.',
    '',
    '5. DIFFERENZIERUNG (90/100-Modell)',
    '   Grundauftrag (für alle, 90%): [Kernaufgabe auf K3/K4]',
    '   Erweiterungsauftrag (für Schnellere, 100%): [Transfer oder kreative Anwendung auf K5]',
    '   Unterstützung (für Lernende die Muehe haben, < 70%): [Scaffolding, Satzanfaenge, vereinfachter Kontext]',
    '',
    `Sprachniveau der Materialien: ${niveau}`,
    'Schweizer Hochdeutsch, kein Eszett, gendergerechte Sprache (Lernende, Berufsbildner/in), Schweizer Kontext (CHF, AHV, Migros/Coop, etc.).',
  ].join('\n');
}

function aufgabe(S, niveau, nrlp) {
  const C = sharedBlocks(S, nrlp);
  return [
    'Du bist Lehrperson im Allgemeinbildenden Unterricht (ABU) an einer Berufsfachschule in der Schweiz.',
    `Deine Zielgruppe sind Lernende im ${C.themaLehrjahr}. Lehrjahr, Alter ca. 15-20 Jahre.`,
    '',
    `Thema: T${C.themaNr} - ${C.themaTitel} | ${C.lebensbezugZeile}`,
    '',
    'KOMPETENZEN:',
    C.kompetenzen,
    '',
    'GESELLSCHAFTLICHE INHALTE:',
    C.gesellschaft,
    '',
    'SPRACHMODI:',
    C.sprachmodi,
    '',
    'SCHLUESSELKOMPETENZEN:',
    C.schluessel,
    '',
    'DEINE AUFGABE: Erstelle eine vollständige Aufgabenstellung für ein Handlungsprodukt.',
    '',
    'QUALITAETSKRITERIEN - diese sind nicht verhandelbar:',
    '',
    '1. KOMPETENZZIEL-VERB',
    '   Beginne den Auftrag mit einem K3/K4-Handlungsverb das direkt aus den gewählten Kompetenzen stammt.',
    '   Erlaubte Verben: entscheide und begründe / analysiere und bewerte / entwickle einen Plan /',
    '   wähle aus und argumentiere / beurteile und empfehle.',
    '   Verboten: beschreibe, erkläre, nenne, liste auf (= K1/K2).',
    '',
    '2. OFFENE AUFGABENSTRUKTUR',
    '   Die Aufgabe muss echte Entscheidungsspielraeume lassen. Die Lernenden müssen eigene',
    '   Entscheidungen treffen und begründen können. Keine Mal-nach-Zahlen-Anleitungen.',
    '   Mehrere nachvollziehbare Loesungswege müssen möglich sein.',
    '',
    '3. TRANSPARENTE BEWERTUNGSKRITERIEN',
    '   Mache die Beurteilungskriterien direkt in der Aufgabenstellung sichtbar.',
    '   Formuliere sie in der Du-Form für Lernende: "Deine Arbeit wird beurteilt nach..."',
    '   Kriterien müssen beobachtbar und spezifisch für dieses Produkt sein.',
    '',
    '4. SCAFFOLDING NACH SPRACHMODUS',
    '   Leite die Hilfestellungen direkt aus den gewählten Sprachmodi ab:',
    C.sprachmodi,
    '   Pro Sprachmodus: biete 2-3 konkrete Scaffolding-Elemente an (Satzanfaenge, Leitfragen,',
    '   Strukturvorlagen, Gespraechsbausteine oder Checklisten - je nach Modus).',
    '',
    '5. DIFFERENZIERUNG (90/100-Modell)',
    '   Kennzeichne klar:',
    '   GRUNDAUFTRAG (für alle Lernenden): [Kernaufgabe auf K3]',
    '   ERWEITERUNGSAUFTRAG (selbststaendig, ausserhalb der Unterrichtszeit): [Transfer/Kreativitaet K5]',
    '',
    '6. FORMALE ANGABEN',
    '   Umfang, Format, Abgabemodalitaet und Zeitrahmen müssen explizit angegeben sein.',
    '',
    `Sprachniveau: ${niveau}`,
    'Schweizer Hochdeutsch, kein Eszett, Schweizer Kontext (CHF, AHV, konkrete Schweizer Unternehmen oder Institutionen).',
  ].join('\n');
}

function raster(S, niveau, nrlp) {
  const C = sharedBlocks(S, nrlp);
  return [
    'Du bist Lehrperson im Allgemeinbildenden Unterricht (ABU) an einer Berufsfachschule in der Schweiz.',
    '',
    `Thema: T${C.themaNr} - ${C.themaTitel} | ${C.lebensbezugZeile}`,
    '',
    'KOMPETENZEN (Grundlage für die Kriterien):',
    C.kompetenzen,
    '',
    'GESELLSCHAFTLICHE INHALTE:',
    C.gesellschaft,
    '',
    'SPRACHMODI:',
    C.sprachmodi,
    '',
    'SCHLUESSELKOMPETENZEN:',
    C.schluessel,
    '',
    'DEINE AUFGABE: Erstelle ein vollstaendiges Beurteilungsraster.',
    '',
    'STRUKTURVORGABEN:',
    '',
    '1. ZWEI HAUPTKATEGORIEN (nRLP-konform)',
    '   Kategorie A - Aspekt Gesellschaft (Inhalt, Fachwissen, gesellschaftliche Einordnung)',
    '   Kategorie B - Aspekt Sprache (Form, Ausdruck, Sprachrichtigkeit, Mediennutzung)',
    '',
    '2. KRITERIEN DIREKT AUS DEM HANDLUNGSPRODUKT ABLEITEN',
    '   Leite die Kriterien nicht abstrakt aus den Kompetenzen ab, sondern konkret aus dem Produkt.',
    '   Pro Kategorie: 2-3 produktspezifische, beobachtbare Kriterien.',
    '',
    '3. VIER NIVEAUSTUFEN (konsistent mit dem 90/100-Modell)',
    '   Stufe 1 - Nicht erfüllt (< 70%): Beschreibung was fehlt oder falsch ist.',
    '   Stufe 2 - Grundlegend (70%): Mindestanforderung erfüllt, mit Luecken.',
    '   Stufe 3 - Kompetent (90%): Vollständig und korrekt, entspricht dem Grundauftrag.',
    '   Stufe 4 - Vertieft (100%): Uebertrifft die Erwartungen, Transfer oder Eigeninitiative erkennbar.',
    '',
    '4. GEWICHTUNG',
    '   Gib die Gewichtung der zwei Kategorien an: Gesellschaft X% / Sprache Y%.',
    '   Standard-Vorschlag wenn nicht anders definiert: 50% / 50%.',
    '   Begründe die Gewichtung kurz.',
    '',
    '5. FORMAT',
    '   Erstelle das Raster als Markdown-Tabelle mit den Spalten:',
    '   | Kriterium | Nicht erfüllt (< 70%) | Grundlegend (70%) | Kompetent (90%) | Vertieft (100%) |',
    '',
    '6. PROZESS-CHECKLISTE (IPERKA-Layer, optional aber empfohlen)',
    '   Ergänze nach der Haupttabelle eine binaere Prozess-Checkliste für die IPERKA-Schritte:',
    '   [ ] I - Habe ich alle notwendigen Informationen beschafft?',
    '   [ ] P - Habe ich mein Vorgehen geplant bevor ich begonnen habe?',
    '   [ ] E - Habe ich eine begründete Entscheidung getroffen?',
    '   [ ] R - Habe ich das Produkt vollständig erstellt?',
    '   [ ] K - Habe ich mein Produkt anhand der Kriterien ueberprueft?',
    '   [ ] A - Habe ich meinen Lernprozess reflektiert?',
    '',
    `Alle Kriterientexte in Sprache der Lernenden: Sprachniveau ${niveau}, Schweizer Hochdeutsch, kein Eszett.`,
  ].join('\n');
}

function prüfung(S, niveau, nrlp) {
  const C = sharedBlocks(S, nrlp);
  return [
    'Du bist Lehrperson im Allgemeinbildenden Unterricht (ABU) an einer Berufsfachschule in der Schweiz.',
    `Deine Zielgruppe sind Lernende im ${C.themaLehrjahr}. Lehrjahr.`,
    '',
    `Thema: T${C.themaNr} - ${C.themaTitel} | ${C.lebensbezugZeile}`,
    '',
    'KOMPETENZEN:',
    C.kompetenzen,
    '',
    'GESELLSCHAFTLICHE INHALTE:',
    C.gesellschaft,
    '',
    'SPRACHMODI:',
    C.sprachmodi,
    '',
    'SCHLUESSELKOMPETENZEN:',
    C.schluessel,
    '',
    `PRUEFUNGSTYP: ${C.pruefungstyp}`,
    `DAUER: ${C.pruefungsdauer}`,
    `HILFSMITTEL: ${C.hilfsmittel}`,
    '',
    'DEINE AUFGABE: Erstelle eine vollständige Pruefungsaufgabe.',
    '',
    'QUALITAETSKRITERIEN - ZWINGEND:',
    '',
    '1. NEUER STIMULUS (Transfer, nicht Reproduktion)',
    '   Der Stimulus muss eine neue Situation sein, die die Lernenden so nicht im Unterricht gesehen haben.',
    '   Anforderungen an den Stimulus:',
    '   - authentisch und verortbar (konkrete Person, Ort, Zeitpunkt)',
    '   - eingebettete Ambiguitaet, keine eindeutig richtige Antwort',
    '   - Entscheidungen auf K3/K4',
    '   - Länge 80-150 Wörter (Kurztext oder Fallbeschreibung)',
    '   Keine Folien, keine abstrakten Beschreibungen.',
    '',
    '2. GESTUFTE TEILAUFGABEN (Bloom-Progression)',
    '   Formuliere 3-4 Teilaufgaben in expliziter Bloom-Stufung:',
    '   T1 (K2 - Verstehen), T2 (K3 - Entscheiden), T3 (K4 - Analysieren), T4 (K4/K5 - Transfer optional).',
    '   Keine reinen Wissensabfragen (K1): "Was ist...?", "Nenne drei..." sind verboten.',
    '',
    '3. PUNKTE UND ZEITANGABE',
    '   Jede Teilaufgabe erhaelt Punktezahl und empfohlene Bearbeitungszeit.',
    '   Gesamtpunkte = 100% der Pruefungsleistung.',
    '   Gewichtungsregel: T1 <= 20%, T2 >= 35%, T3 >= 30%, T4 optional.',
    '',
    '4. MUSTERLOESUNG MIT BEWERTUNGSHINWEISEN',
    '   Am Ende eine vollständige Musterloesung mit Bewertungshinweisen pro Teilaufgabe',
    '   (Vollpunkte/Teilkriterien) und klarer Verbindung zum Raster.',
    '',
    `Sprachniveau Pruefungstext: ${niveau}`,
    "Schweizer Hochdeutsch, kein Eszett, Schweizer Kontext (CHF, AHV, Sozialversicherungen, konkrete Arbeitssituation).",
  ].join('\n');
}

function arbeitsblatt(S, niveau, nrlp) {
  const C = sharedBlocks(S, nrlp);
  return [
    'Du bist Lehrperson im Allgemeinbildenden Unterricht (ABU) an einer Berufsfachschule in der Schweiz.',
    `Deine Zielgruppe sind Lernende im ${C.themaLehrjahr}. Lehrjahr.`,
    '',
    `Thema: T${C.themaNr} - ${C.themaTitel} | ${C.lebensbezugZeile}`,
    '',
    'KOMPETENZEN:',
    C.kompetenzen,
    '',
    'GESELLSCHAFTLICHE INHALTE:',
    C.gesellschaft,
    '',
    'SPRACHMODI:',
    C.sprachmodi,
    '',
    'SCHLUESSELKOMPETENZEN:',
    C.schluessel,
    '',
    'DEINE AUFGABE: Erstelle ein druckfaehiges Arbeitsblatt mit Fallbeispiel für die AVIVA-Phase "Verarbeiten".',
    '',
    'STRUKTURVORGABEN:',
    '',
    '1. FALLBEISPIEL (Einstieg)',
    '   Länge: 1-2 Absaetze, max. 120 Wörter.',
    '   Authentisch, in Berufs- oder Lebenswelt verortbar, Problem klar erkennbar, Ich-Perspektive oder Du-Form.',
    '',
    '2. AUFGABEN (3-5 Aufgaben in Bloom-Stufung)',
    '   Methoden und Aufgabenformen direkt aus den gewählten Sprachmodi ableiten:',
    C.sprachmodi,
    '   Bloom-Stufung: Aufgabe 1-2 auf K2, Aufgabe 3-4 auf K3, Aufgabe 5 optional auf K4.',
    '',
    '3. SCAFFOLDING (pro Aufgabe)',
    '   Pro Aufgabe 1-2 konkrete Hilfestellungen passend zum Sprachmodus.',
    '',
    '4. DIFFERENZIERUNG',
    '   Aufgabe 5 als Erweiterungsaufgabe kennzeichnen. Optional vereinfachtes Fallbeispiel anbieten.',
    '',
    '5. DRUCKFORMAT',
    '   A4, maximal 2 Seiten, 11pt Fliesstext, 13pt Aufgabenstellung, 4-6 Zeilen Antwortraum pro schriftlicher Aufgabe,',
    '   graustufen-kompatibel.',
    '',
    `Sprachniveau: ${niveau}`,
    'Schweizer Hochdeutsch, kein Eszett, Schweizer Kontext.',
  ].join('\n');
}

function reflexion(S, niveau, nrlp) {
  const C = sharedBlocks(S, nrlp);
  return [
    'Du bist Lehrperson im Allgemeinbildenden Unterricht (ABU) an einer Berufsfachschule in der Schweiz.',
    `Deine Zielgruppe sind Lernende im ${C.themaLehrjahr}. Lehrjahr - viele reflektieren zum ersten Mal systematisch.`,
    '',
    `Thema: T${C.themaNr} - ${C.themaTitel} | ${C.lebensbezugZeile}`,
    '',
    'SCHLUESSELKOMPETENZEN (Kern dieser Einheit):',
    C.schluessel,
    '',
    'SPRACHMODI (wurden in der Einheit eingesetzt):',
    C.sprachmodi,
    '',
    'KOMPETENZEN:',
    C.kompetenzen,
    '',
    `HANDLUNGSPRODUKT DER EINHEIT: ${C.handlungsprodukt}`,
    '',
    'DEINE AUFGABE: Erstelle einen strukturierten Reflexionsauftrag nach IPERKA-Phase A (Auswerten).',
    '',
    'STRUKTUR DER REFLEXION (drei Ebenen, insgesamt 6-8 Fragen):',
    '',
    'EBENE 1 - ERGEBNIS BEWERTEN (Produkt, 2 Fragen)',
    '   Fokus: Wie gut ist das konkrete Handlungsprodukt geworden?',
    '',
    'EBENE 2 - PROZESS BEWERTEN (eigene Handlung, 2-3 Fragen)',
    '   Fokus: Wie bin ich durch die IPERKA-Schritte gegangen? Welche Entscheidungen habe ich getroffen?',
    '   Jede Frage muss eine gewaehlte Schluesselkompetenz explizit adressieren.',
    '',
    'EBENE 3 - TRANSFER ABLEITEN (Zukunft, 2-3 Fragen)',
    '   Fokus: Dekontextualisierung in neue Situationen.',
    '   Mindestens eine Frage zur beruflichen Praxis, mindestens eine zu einer neuen Situation.',
    '',
    'FORMAT-VORGABEN:',
    '   - Alle Fragen als offene Fragen (keine Ja/Nein-Fragen).',
    '   - Mindestens 2 Fragen für Partnerreflexion kennzeichnen.',
    '   - Pro Ebene 2-3 Satzanfaenge als Scaffolding anbieten.',
    '   - Optional eine Visualisierungsaufgabe als Alternative zur schriftlichen Reflexion.',
    '',
    `Sprachniveau: ${niveau}`,
    'Schweizer Hochdeutsch, kein Eszett, Du-Form der Lernenden, Schweizer Kontext.',
  ].join('\n');
}

function comboPromptChain(S, niveau, nrlp) {
  const C = sharedBlocks(S, nrlp);
  return [
    '# SCHRITT 1: Initialisierung (Rolle und Lehrplan-Kontext)',
    '',
    'Du bist Lehrperson im Allgemeinbildenden Unterricht (ABU) an einer Berufsfachschule in der Schweiz, spezialisiert auf HKO.',
    `Wir arbeiten an Thema T${C.themaNr} - ${C.themaTitel} (${C.themaLehrjahr}. Lehrjahr).`,
    `Leitidee: ${C.leitideeKurz}`,
    C.lebensbezugZeile,
    '',
    'AUSGEWAEHLTE KOMPETENZEN:',
    C.kompetenzen,
    '',
    'GESELLSCHAFTLICHE INHALTE:',
    C.gesellschaft,
    '',
    'SPRACHMODI:',
    C.sprachmodi,
    '',
    'SCHLUESSELKOMPETENZEN:',
    C.schluessel,
    '',
    `ORIENTIERUNGSBEISPIEL (${C.beQuelle}) - Herausforderung: ${C.beispielHerausforderung}`,
    `ORIENTIERUNGSBEISPIEL - Produkt: ${C.beispielProdukt}`,
    '',
    'Bestaetige den Kontext in 2-3 Sätzen. Generiere noch keinen Unterrichtsinhalt.',
    '',
    '---',
    '# SCHRITT 2: Lernsituation (v2-Qualität)',
    '',
    'Erstelle eine vollständige Lernsituation mit folgenden Muss-Kriterien:',
    '- Ausgangssituation in Ich- oder Du-Form mit konkretem Ort, Person, Zeit und echtem Problem.',
    '- Problemstellung auf K3/K4, mehrere nachvollziehbare Loesungswege, keine K1/K2-Logik.',
    '- Authentisches Handlungsprodukt, direkt an Sprachmodi gekoppelt, mit transparenten Kriterien.',
    '- Prozessstruktur via IPERKA oder SOL mit Zeitangaben.',
    '- Differenzierung nach 90/100-Modell inkl. Unterstützung <70%.',
    '',
    '---',
    '# SCHRITT 3: Aufgabenstellung (Handlungsprodukt)',
    '',
    'Erstelle die Aufgabenstellung passend zur Lernsituation mit Muss-Kriterien:',
    '- Start mit K3/K4-Handlungsverb; keine Verben auf K1/K2.',
    '- Offene Aufgabenstruktur mit Entscheidungsspielraeumen.',
    '- Sichtbare Beurteilungskriterien in Du-Form.',
    '- Pro Sprachmodus 2-3 konkrete Scaffolding-Elemente.',
    '- Differenzierung Grundauftrag (90%) und Erweiterung (100%).',
    '- Explizite Angaben zu Umfang, Format, Abgabe, Zeitrahmen.',
    '',
    '---',
    '# SCHRITT 4: Beurteilungsraster',
    '',
    'Erstelle ein vollstaendiges Raster mit Muss-Kriterien:',
    '- Zwei Kategorien: Gesellschaft und Sprache.',
    '- Pro Kategorie 2-3 produktspezifische, beobachtbare Kriterien.',
    '- Vier Niveaustufen (<70 / 70 / 90 / 100).',
    '- Gewichtung Gesellschaft/Sprache mit kurzer Begründung (Standard 50/50).',
    '- Markdown-Tabelle im geforderten Spaltenformat.',
    '- Optional IPERKA-Prozess-Checkliste.',
    '',
    '---',
    '# SCHRITT 5: Pruefungsaufgabe und Arbeitsblatt',
    '',
    `Nutze folgende Pruefungsparameter: Typ=${C.pruefungstyp}, Dauer=${C.pruefungsdauer}, Hilfsmittel=${C.hilfsmittel}.`,
    'A) Pruefungsaufgabe mit neuem Stimulus (80-150 Wörter), Bloom-Progression T1-T4, Punkte+Zeit, Musterloesung+Bewertungshinweise.',
    'B) Arbeitsblatt (A4, max. 2 Seiten) mit Fallbeispiel, 3-5 Aufgaben in Bloom-Stufung, sprachmodusbezogenem Scaffolding, Differenzierung.',
    '',
    '---',
    '# SCHRITT 6: Reflexion',
    '',
    `Handlungsprodukt der Einheit: ${C.handlungsprodukt}.`,
    'Erstelle 6-8 offene Reflexionsfragen auf drei Ebenen (Ergebnis, Prozess, Transfer),',
    'mit mindestens 2 Partnerfragen, Satzanfaengen pro Ebene und optionaler Visualisierungsalternative.',
    '',
    `Globale Sprachvorgaben für alle Schritte: Sprachniveau ${niveau}, Schweizer Hochdeutsch, kein Eszett, gendergerechte Sprache, Schweizer Kontext.`,
  ].join('\n');
}

const TEMPLATES = { lernsituation, aufgabe, raster, prüfung, arbeitsblatt, reflexion, combo: comboPromptChain };

export function buildPrompt(S, outputType, niveau = 'B1', nrlp = null) {
  if (!S.thema) return '';
  const fn = TEMPLATES[outputType] || lernsituation;
  const body = fn(S, niveau, nrlp);
  // Lektionen als Lehrpersonen-Entscheid rahmen; ABU = 3 Lektionen à 45 Min/Woche.
  const lb = S.lebensbezuege?.[0];
  const richtwert = lb?.lektionen
    ? ` Richtwert nRLP für diesen Lebensbezug: ca. ${lb.lektionen} Lektionen (Thema gesamt: ${S.thema?.lektionen ?? '–'}).`
    : '';
  const rahmen = `RAHMEN: ABU umfasst 3 Lektionen à 45 Min pro Woche. Wie viele Lektionen du einsetzt, entscheidest du als Lehrperson.${richtwert}`;
  return `${rahmen}\n\n${body}`;
}

