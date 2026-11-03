from pathlib import Path
import json,re
r=Path('src/data/einheiten/1.2.1_regeln_schule_betrieb');run=Path('docs/cloud-run/laeufe/2026-11-03-1.2.1_regeln_schule_betrieb')
def load(n):return json.loads((r/(n+'.json')).read_text(encoding='utf-8'))
def save(n,d):(r/(n+'.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
a,b,d,s,k,p=[load(n) for n in ['herausforderung_A','herausforderung_B','dossier','set','kn','prinzip']]
for x in [a,b]: x['lernfortschritt']['scaffold_90']='Nutzen Sie die Beispielzeile auf Seite 3. Das andere Beispiel steht auf Seite 5.'
a['leitfragen'][0]['scaffolding']['produkt']='Diese Regeln brauchen Sie für Ihre Klärungsnotiz.'
b['mehrdeutigkeit']['hint']='Nehmen Sie die Kritik ernst. Suchen Sie ein ruhiges Gespräch unter vier Augen.'
d['leseblatt']['w_fragen'][2]='Warum hilft ein Gespräch unter vier Augen bei einem Streit?'
k['kn_typen'][2]['reflexionsfragen'][2]='Sie haben einen Fehler gemacht. Wie hilft Ihnen jetzt das Gelernte?'
k['rubrik_shared']['niveaubaender'][2]['definition_lernende']='Bei mindestens drei Kriterien haben Sie jeweils 3 Punkte erreicht.'
for obj in [k,p]: obj['kern_kompetenzversprechen']='Ich kenne wichtige Regeln und Zuständigkeiten in Schule und Betrieb. Ich kläre Unklarheiten oder Vorwürfe respektvoll.'
s['gemeinsamer_auftrag']['mehrdeutigkeit']['hint']='Nehmen Sie das Anliegen des Betriebs ernst. Erklären Sie die Regeln der Schule klar.'
for n,o in [('herausforderung_A',a),('herausforderung_B',b),('dossier',d),('set',s),('kn',k),('prinzip',p)]:save(n,o)
path=r/'begleiter.md';t=path.read_text(encoding='utf-8');t=t.replace('überbetrieblichen Kurs (üK)','kantonalen Lehrwerkstätte').replace('überbetrieblicher Kurs','kantonale Lehrwerkstätte').replace('sechs Info-Karten','sieben Info-Karten').replace('Auswertungsraster','Prüfstationen').replace('B-01 bis B-03','B-01 bis B-04')
t=t.replace('Laut kantonalem Disziplinarreglement (§ 4 Abs. 1 lit. f und § 5) gilt geschäftliche Inanspruchnahme nur bei ausserordentlichen Ereignissen zur Abwendung bedeutenden Schadens.','Nach § 5 lit. a braucht es ein ausserordentliches Ereignis, bedeutenden drohenden Schaden und den Einsatz des übrigen Personals für denselben Zweck. § 5 lit. b kennt daneben die unumgängliche auswärtige Ausbildungsarbeit bei unzumutbarem Schulweg und möglichem Nacharbeiten. Beides fehlt im Auftragsfall.')
t=t.replace('Lehrperson darf Handys einziehen, Verweise und Bussen verfügt nur die Schulleitung','Lehrperson darf Gegenstände während des Unterrichts zeitweilig einziehen; Ermahnungen auch durch Lehrpersonen, wenn vorgesehen; schriftliche Verweise durch die Schulleitung, Bussen nur dabei')
objs={'kn':k,'prinzip':p,'hf_A':a,'hf_B':b,'set':s}
def sync(m):
 key=m[1];expr=key.split('|')[0];bits=re.findall(r'[^.\[\]]+',expr);v=objs[bits[0]]
 for bit in bits[1:]:v=v[int(bit)] if isinstance(v,list) else v[bit]
 return '<!--hko:'+key+'-->'+ ('\n> '+v+'\n' if '|quote' in key else str(v))+'<!--/hko-->'
t=re.sub(r'<!--hko:([^>]+)-->(.*?)<!--/hko-->',sync,t,flags=re.S)
for tag,x in [('A',a),('B',b)]:
 details=(['Foto und Urheberschaft trennen. Niemand muss eine fremde Tat zugeben.','A-01 und A-02 lesen; Genehmigung aller betroffenen Personen benennen.','Beispielzeile lesen; zwei eigene Vorfälle mit Regel und Zuständigkeit ergänzen.','Folgen von lautem Widerspruch und sachlicher Klärung abwägen. Gehör bedeutet Äusserungsmöglichkeit, nicht zwingend Gespräch.','Klärungsnotiz mit 60–80 Wörtern auf separatem Blatt verfassen.','Fakt oder Gefühl, Raster, zwei Wege und Nachrichtenaufbau bei Bedarf nutzen.','Zwei Kriterien prüfen, eine konkrete Stelle verbessern; Plus bleibt freiwillig.','Begriffsnetz verbinden, Quer-Check beantworten und eigene Mitnahme notieren.'] if tag=='A' else ['15 Minuten Pause und 10 Minuten Überzug markieren; Hilfe erklärt, entschuldigt nicht automatisch.','B-01 und B-02 lesen; Weisungsrecht und Sorgfaltspflicht unterscheiden.','Zwei Situationen aus B-01 selbst zuordnen; nicht nach einer Tabelle auf Seite 1 suchen.','Ärger verschweigen und Gespräch suchen vergleichen; einen Weg mit Grund wählen.','Vier Punkte als Stichwortblatt schreiben; danach kurz mündlich erproben.','Klare Frage für Einstieg und Rückfrage nutzen; keine Anrede-Gruss-Nachricht bestellen.','Kriterien beim Sprechen mit dem Plan prüfen; Plus als freiwilliger Probelauf.','Begriffsnetz verbinden und zwei Quer-Checks mit eigenen Antworten abschliessen.'])
 section='\n### Hinweise je Seite — Heft '+tag+'\n\nRichtzeiten sind ein Vorschlag: insgesamt 135 Minuten einschliesslich kurzer Wechsel.\n\n| Seite | Minuten | Fokus und Coaching |\n|---|---:|---|\n'
 for i,(mins,desc) in enumerate(zip([10,25,20,20,30,5,15,10],details),1):section+=f'| {i} | {mins} | {desc} |\n'
 section+='\n### Coaching zu den drei Leitfragen\n\n'
 moves=(['LF1: «Welche Person muss eine Aufnahme erlauben?» Auf den genauen Satz in A-02 zeigen lassen.','LF2: «Wer darf diese Massnahme anordnen?» Erst Regel, dann Rolle, dann Fachwort eintragen lassen.','LF3: «Was passiert bei jedem Weg?» Zuerst Denkhilfe, danach eigene Wahl mit Grund. Bei Wut die Folgen anerkennen, ohne den fremden Vorwurf zu bestätigen.'] if tag=='A' else ['LF1: «Was darf der Betrieb anordnen, was müssen Sie sorgfältig tun?» Zwei Textstellen markieren lassen.','LF2: «Welche der beiden Situationen aus B-01 passt zu Ihrer Zeile?» Neue Arbeitsanweisung und Werkzeugschaden unterscheiden.','LF3: «Was bleibt ungeklärt, wenn Sie schweigen?» Beide Wege ernst nehmen; nicht allein das erwartete Wort «Gespräch» belohnen.'])
 section+='\n'.join('- '+z for z in moves)+'\n\n### Tafelbild — Begriffsnetz '+tag+'\n\n> [!tafelbild] Freiwillig für dich, nicht als zusätzliche Abgabe\n> '+('Reglement → Regeln; Lehrperson → Unterrichtsmassnahmen; Schulleitung → Verweis; rechtliches Gehör → eigene Sicht; Leitbild → Respekt.' if tag=='A' else 'Weisungsrecht → Betriebsregeln; Sorgfaltspflicht → Material schonen; Ermahnung → Pflicht klären; Gesprächsplan → Lösungsvorschlag.')+'\n\n### Wann ist Heft '+tag+' fertig?\n\n| Produkt | Formativ prüfen |\n|---|---|\n'
 for row in x['bewertungsraster']:section+='| '+row['produkt']+' | '+'; '.join(row['vollstaendig_wenn'])+' |\n'
 # append inside respective section
 target='## 4. Herausforderung B' if tag=='A' else '## 5. Dossier'
 t=t.replace(target,section+'\n'+target)
t+='''
## 8. Differenzierung und Vorbereitung

Vor der Produktion Papier oder Laptop festlegen. Pro Person ein separates Notizblatt für Heft A und ein Stichwortblatt für Heft B bereitstellen. Dossier und beide Hefte bleiben verfügbar. Kein Internet und keine externen Materialien nötig. Das Leseblatt ist optional; es ersetzt nicht die Leitfragen. Unbekannte Wörter zuerst gemeinsam im Glossar klären. Satzanfänge anbieten, keine vollständigen Fallantworten diktieren.

Die siebte Info-Karte B-04 ist für den gemeinsamen Auftrag. Die übrigen Karten decken die drei Leitfragen jedes Hefts. Das freiwillige Plus auf S. 7 erweitert das eigene Produkt ohne neue Pflichtabgabe.

### Auftrag: Durchführung und Stolpersteine

A1 (15 Min.): Fall lesen. Heute Donnerstag, Einsatz nächsten Dienstag, normaler Arbeitsort und kein Notfall. A2 (20 Min.): Drei gedruckte Stationen ausfüllen; keine zusätzliche Tabelle verlangen. A3 (35 Min.): Gespräch planen und zweimal mit Rollenwechsel spielen. A4 (20 Min.): Ich- und Partner-Rückmeldung, Verbesserung. Rückmeldung und Puffer weitere 45 Minuten nach Bedarf.

Coaching: «Welche Voraussetzung fehlt beim Kundenauftrag?» B-04 öffnen lassen. Ein wichtiger Auftrag allein begründet keine Ausnahme. Arbeitszeit verschieben ist möglich; Unterricht eigenmächtig streichen ist keine Lösung. Das vierwöchige Unterschreiben und Vorlegen laut BBW-Praxis ist keine Erlaubnis, ein vorhersehbares Gesuch nachträglich einzureichen. § 8 verlangt bei anderen Absenzen unverzügliche Einreichung, sobald die Umstände dies erlauben. Bei vorhersehbaren Absenzen mindestens 14 Tage vorher; § 8 Abs. 2 schützt unverschuldete Verspätungen. Keine automatische Ablehnung allein aus «weniger als 14 Tage» ableiten.

### Auftragsbogen und KN: gleicher Massstab

A1 erklärt Wichtige Wörter vor dem Fall. A2 verweist auf Wichtige Wörter (S. 2) in den Heften. A4 zeigt Punkte, Kriterium, Ich und Partner/in. Der Auftrag übt Schreiben und Sprechen. Kriterien auf S. 7 der Hefte sind formativ; nur der KN ist benotet. Im KN gelten unverändert die vier Kriterien mit 0–3 Punkten und den gedruckten Niveaubändern.

## 9. KN: Erwartungshorizont und Punkteanker

Die kantonale Lehrwerkstätte fällt unter § 1 lit. b. Das Reglement gilt nicht automatisch in üK-Zentren. Der Fall nennt eine missachtete Anweisung der Lehrperson. Damit genügt A-02 zur Regel und Zuständigkeit; A-03 deckt die Äusserungsmöglichkeit vor einer Massnahme. B-03 liefert die Gesprächsstruktur. Kein angebliches Verbot einer Meldung an den Betrieb prüfen. § 17 regelt Mitteilungen bestimmter Massnahmen; es ist keine allgemeine Schweigepflicht.

Die folgenden Anker zeigen Antwortqualität, keine zusätzlichen Einzelnoten. Die Schlussbewertung erfolgt über die vier KN-Kriterien, nicht durch Summieren der Fragenpunkte. Rechts- und Sprachkriterium getrennt beurteilen; kurze richtige Antworten reichen. Notizen sind Stützen, kein auswendig zu lernender Mustertext.

| Kurzgespräch | 2 Punkte, wenn … | 3 Punkte, wenn … |
|---|---|---|
| F1 Zuständigkeit | Lehrperson und Schulleitung richtig unterschieden werden. | Unterrichtsmassnahmen der Lehrperson und schriftlicher Verweis der Schulleitung sicher erklärt werden. |
| F2 Regel und Quelle | Die missachtete Anweisung erkannt und A-02 genannt wird. | Reinigung und Rückgabe auf die konkrete Anweisung bezogen werden; A-02 eigenständig erläutert wird. |
| F3 Gehör | Eine Äusserungsmöglichkeit vor dem Verweis gefordert wird. | Der Zweck erklärt wird: Vorwürfe prüfen und die eigene Sicht vor dem Entscheid hören. Kein zwingendes persönliches Gespräch behauptet wird. |
| F4 Vergleich | Eine Gemeinsamkeit und ein Unterschied zu den Heften genannt werden. | A: Schulzuständigkeit und Gehör, B: Fehler eingestehen und sachlich klären, am neuen Gegenstand sicher verbunden werden. |
| F5 Haltung | Ein ruhiges Gespräch und ein begründeter Lösungsvorschlag genannt werden. | Eigener Fehler, respektvoller Ton und konkrete Vorbeugung überzeugend zusammenpassen. |

| Mini Case | 2 Punkte, wenn … | 3 Punkte, wenn … |
|---|---|---|
| A1 Regelverstoss | Reinigung/Rückgabe und Zuständigkeit der Lehrperson erkannt werden. | Die missachtete Anweisung genau erklärt und vom Verweisentscheid unterschieden wird. |
| A2 Tabelle | Drei passende Zeilen aus Fall, Regel und Zuständigkeit entstehen. | Die drei Zeilen sicher unterscheiden: Werkzeug falsch versorgt/Anweisung/Lehrperson; beantragter Verweis/Massnahme/Schulleitung; eigene Sicht/Gehör/Schule ermöglicht Stellungnahme. |
| A3 Gehör | Das Recht auf Erklärung vor dem Entscheid genannt wird. | Der Schutz vor einem einseitigen Entscheid in eigenen Worten begründet wird. |
| A4 Ansprache | Zwei respektvolle Sätze Fehler und Gesprächswunsch zeigen. | Die zwei Sätze zusätzlich einen konkreten Lösungsvorschlag passend und knapp vermitteln. |

| Werkschau | 2 Punkte, wenn … | 3 Punkte, wenn … |
|---|---|---|
| Werkwahl | Zwei Sätze die Wahl eines eigenen Produkts begründen. | Ein konkretes Merkmal des Produkts die Wahl nachvollziehbar trägt. |
| Reflexion 1 | Eine richtige Grundregel in einem Satz steht. | Die Regel präzise und mit eigenen Worten formuliert ist. |
| Reflexion 2 | Gemeinsamkeit und Unterschied zum neuen Fall erklärt werden. | Beide Hefte sicher verbunden werden, ohne Betriebsrecht und Schulrecht gleichzusetzen. |
| Reflexion 3 | Ein sinnvoller nächster Schritt bei einem Fehler erklärt wird. | Verantwortung, eigene Sicht und konkrete Vorbeugung begründet zusammenpassen. |

120–150 Wörter gelten für die gesamte Transfer-Reflexion. Die optionale Präsentation dauert fünf Minuten; eine Anschlussfrage kommt aus dem Kurzgespräch. Die kurze schriftliche Ansprache allein zeigt keine vollständige Gesprächsführung. Für eine differenzierte Bewertung alle Aufgaben und die gesamte Reflexion heranziehen.

## 10. Quellen und rechtliche Grenzen

Verbindliche lokale Quellen: Disziplinarreglement Berufsbildung, LS 413.322, vom 5. März 2015, §§ 1, 5, 7–10, 14–17; Leitbild BBW, 3. September 2026, S. 4; Auskunft der Lehrperson vom 3. November 2026 zur vierwöchigen Unterschrift und Vorlage. § 14 lit. b erlaubt mündliche und schriftliche Ermahnungen durch die Schulleitung oder vorgesehene Lehrpersonen. § 16 erlaubt Bussen bei schriftlichen Verweisen: maximal Fr. 100 beim ersten, Fr. 200 beim zweiten, Fr. 500 ab dem dritten. Keine Busse als selbstständige Massnahme lehren.

Die Betriebsbegriffe stützen sich auf OR Art. 321a und 321d (bestehendes Quellenarchiv). Weisungen gelten innerhalb rechtlicher Grenzen; der Betrieb kann zwingende Schutzbestimmungen nicht selbst aufheben. Gesprächsschritte und Nacharbeit sind pädagogische Vorschläge, keine automatische Pflicht oder Sanktion. Die Klärungsnotiz beweist weder eine Mittäterschaft noch eine Pflicht, den Sitznachbarn zu stoppen.
'''
path.write_text(t,encoding='utf-8')
# Archiv: Fall ausdrücklich erfassen.
ar=Path('D:/OS/_lab/quellen-archiv/bbw-hko/_pruefung/1.2.1_regeln_schule_betrieb')
f=json.loads((ar/'fall.json').read_text(encoding='utf-8'));f['faelle']['kn']={'zahlen':[],'ausgeschlossen':[],'geschrieben_am':'2026-11-03','von':{'rolle':'Korrektur nach Gegenlesung','modell':'gpt-6.1-sol'},'kontext':k['hybrid_situation']['text']};(ar/'fall.json').write_text(json.dumps(f,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# Alte Wortlautzeilen nicht als aktuelle Prüfung ausgeben; neue Zeilen aus geprüften Quellenankern.
f=json.loads((ar/'fakten.json').read_text(encoding='utf-8')); rows=[]
for i,n in enumerate(d['nuggets']):
 for an in n['fakten_anker']:
  rows.append({'wortlaut_im_heft':an['behauptung'],'feld':f'dossier.json › nuggets[{i}].fakten_anker','art':'sachverhalt','primaerquelle':('D:/OS/Clippings/A010101L1_Leitbild_BBW_20260903.pdf' if i==0 else 'D:/OS/Clippings/Disziplinarreglement.pdf') if 'OR ' not in an['quelle'] and 'berufsbildung.ch' not in an['quelle'] else 'https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de','fundstelle':an['quelle'],'abgerufen_am':'2026-11-03','urteil':'belegt','bemerkung':'Lokale Gegenprüfung; Betriebsrecht aus bestehendem Quellenarchiv. Gesprächsstruktur ist didaktische Empfehlung. BBW-Frist: Auskunft Lehrperson, keine PDF-Aussage.','von':{'rolle':'Korrektur nach Gegenlesung','modell':'gpt-6.1-sol'}})
f['zeilen']=rows;(ar/'fakten.json').write_text(json.dumps(f,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
