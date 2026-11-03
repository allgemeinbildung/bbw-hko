from pathlib import Path
import json,re,copy
root=Path('src/data/einheiten/1.2.1_regeln_schule_betrieb'); run=Path('docs/cloud-run/laeufe/2026-11-03-1.2.1_regeln_schule_betrieb')
def load(n): return json.loads((root/(n+'.json')).read_text(encoding='utf-8'))
def save(n,d): (root/(n+'.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
a,b,d,s,k,p=[load(n) for n in ['herausforderung_A','herausforderung_B','dossier','set','kn','prinzip']]
a['situation_text']='Im Unterricht macht mein Sitznachbar heimlich ein Foto. Auch die Lehrperson ist darauf zu sehen. Niemand hat ihr Einverständnis eingeholt. Mein Sitznachbar stellt das Foto in den Klassen-Chat. Die Lehrperson zieht sein Smartphone ein. Sie wirft auch mir vor, beim Foto mitgemacht zu haben. Sie will bei der Schulleitung einen schriftlichen Verweis beantragen. Ich erschrecke. Ich habe das Foto weder gemacht noch verschickt. Die Lehrperson hört mir gerade nicht zu. Wie erkläre ich ihr respektvoll und sachlich meine Sicht?'
a['leitfrage']='Wie erkläre ich der Lehrperson respektvoll und sachlich meine Sicht?'
b['situation_text']='Meine Vormittagspause im Betrieb dauert 15 Minuten. Heute helfe ich danach einer Kollegin bei einer Montage. Deshalb komme ich 10 Minuten zu spät an meinen Arbeitsplatz. Der Berufsbildner ermahnt mich laut vor dem ganzen Team. Er nennt mich unzuverlässig. Das kränkt mich. Ich wollte doch nur helfen. Wie kläre ich die Ermahnung ruhig unter vier Augen?'
b['leitfrage']='Wie kläre ich die Ermahnung ruhig unter vier Augen?'
for x,tag in [(a,'A'),(b,'B')]:
 lf=x['spuren']['ohne_medien']['leitfragen'][1]
 lf['text']=('Wie reagiere ich auf den falschen Vorwurf?' if tag=='A' else 'Wie reagiere ich auf die laute Ermahnung?')+' Prüfen Sie beide Wege in der Denkhilfe. Wählen Sie einen Weg und begründen Sie Ihre Wahl.'
 lf['liefert']='Zwei Wege und eine begründete Wahl'
 lf['loesung']['erwartungshorizont']['gut_wenn'][0]='Beide Wege sind abgewogen. Ein Weg ist mit Grund gewählt.'
 x['spuren']['ohne_medien']['kasten_s4']['spalten']=(['Laut widersprechen: Folgen','Sachlich klären: Folgen','Mein Weg mit Grund'] if tag=='A' else ['Ärger verschweigen: Folgen','Gespräch suchen: Folgen','Mein Weg mit Grund'])
 x['spuren']['ohne_medien']['kasten_s4']['loesung_zeilen']=([['Streit verstärkt den Vorwurf','Eigene Sicht wird hörbar','Sachlich klären: Gehör nutzen']] if tag=='A' else [['Ärger bleibt ungeklärt','Missverständnis lässt sich klären','Gespräch suchen: Lösung finden']])
 x['handlungsprodukt']['schritte'][0]['hint']='Notieren Sie die Fakten von Seite 1 und die Regel von Seite 2. Nutzen Sie das Beispiel auf Seite 5.'
 x['lernfortschritt']={'scaffold_90':'Die Beispielzeile auf Seite 3 und das andere Beispiel auf Seite 5 helfen Ihnen.', 'scaffold_100':('Formulieren Sie eine ruhige Rückfrage zum Vorwurf. Erklären Sie, wie diese Frage bei der Klärung hilft.' if tag=='A' else 'Üben Sie Ihr Gespräch zu zweit. Fragen Sie nach: Welcher Lösungsvorschlag überzeugt? Verbessern Sie Ihren Plan.')}
 for row in x['bewertungsraster']:
  row['vollstaendig_wenn']=[z.replace('nennt zwei Haltungen mit Grund','prüft zwei Wege und wählt einen mit Grund').replace('wählt Vier-Augen-Gespräch','begründet den gewählten Weg') for z in row['vollstaendig_wenn']]
 mode='beim Schreiben' if tag=='A' else 'beim Sprechen'
 for c in x['feedback_kriterien']: c['stufen_lernende']=[v.replace('Ich ',f'Ich {mode} ',1) if False else f'{v} Das zeige ich {mode}.' for v in c['stufen_lernende']]
b['spuren']['ohne_medien']['leitfragen'][0]['text']='Füllen Sie das Raster aus. Ordnen Sie zwei weitere Situationen aus Info-Karte B-01 den passenden Pflichten zu.'
b['leitfragen'][0]['scaffolding']['strategien']=['Lesen Sie in Info-Karte B-01 die Erklärung zum Weisungsrecht.','Suchen Sie dort die Sorgfaltspflicht. Lesen Sie in B-02 den Zweck einer Ermahnung.','Notieren Sie zu jeder Regel ein Stichwort.']
b['methoden'][0]['fuer']='für die Fakten von Seite 1 und Ihren Gesprächsplan'
b['methoden'][3]={'ref':'hko-eba-klare-frage','fuer':'für Ihre Einstiegsfrage und Rückfragen im Klärungsgespräch'}
a['leitfragen'][0]['scaffolding']['satzanfaenge'][1]='«Für Aufnahmen brauche ich …»'
a['leitfragen'][0]['loesung']['zeilen'][1]['text']='Bild- und Tonaufnahmen brauchen die ausdrückliche Genehmigung der betroffenen Person (§ 10 lit. e).'
a['leitfragen'][0]['loesung']['zeilen'][3]['text']='Ein allgemeines Handyverbot behaupten: Das Reglement verbietet hier die Aufnahme ohne Genehmigung, nicht jedes Handy.'
r=a['spuren']['ohne_medien']['leitfragen'][0]
r['raster']['beispielzeile'][0]='Foto ohne Genehmigung';r['raster']['beispielzeile'][1]='Genehmigung nötig'
r['loesung']['raster_zeilen'][0]=r['raster']['beispielzeile'];r['loesung']['raster_zeilen'][2][2]='Schulleitung verfügt Verweis'
r['loesung']['befund']='Lehrpersonen können während des Unterrichts Gegenstände zeitweilig einziehen. Schriftliche Verweise verfügt die Schulleitung; nur dabei sind Bussen möglich.'
a['spuren']['ohne_medien']['leitfragen'][1]['loesung']['erwartungshorizont']['beispiel_pol_1']='Laut widersprechen: Der Ärger ist verständlich, aber ein Streit erschwert die Klärung.'
a['spuren']['ohne_medien']['leitfragen'][1]['loesung']['erwartungshorizont']['beispiel_pol_2']='Sachlich klären: Ich habe weder fotografiert noch verschickt. Ich möchte vor einem Entscheid meine Sicht erklären. Keine Pflicht erfinden, den Sitznachbarn zu stoppen.'
a['handlungsprodukt']['beispielbild']['bloecke'][0]['zeilen'][1]['zellen']=['Regel','Leihfrist laut Ausleihzettel','Rückgabetermin beachten']
a['handlungsprodukt']['beispielbild']['bloecke'][0]['zeilen'][2]['zellen']=['Ansprechperson','Ausleihe um Klärung bitten','Frist nachfragen']
texts=[
'Die BBW hat ein Leitbild mit sechs Werten. Diese sind Verantwortung, Respekt, Gelassenheit, Verbindlichkeit, Haltung und Vielfalt. Übernehmen Sie Verantwortung für Ihr Handeln und Ihre Arbeit. Begegnen Sie anderen mit Respekt und Wertschätzung. Zeigen Sie Haltung gegen unangemessenes Verhalten. Diese Werte geben Ihnen im Schulalltag Orientierung.',
'An Berufsfachschulen und kantonalen Lehrwerkstätten gilt das Disziplinarreglement des Kantons Zürich. Stören Sie den Unterricht nicht. Befolgen Sie die Anweisungen der Lehrperson. Bild- und Tonaufnahmen brauchen die ausdrückliche Genehmigung jeder betroffenen Person. Bei Regelverstössen darf die Lehrperson Gegenstände während des Unterrichts zeitweilig einziehen. Sie darf Lernende aus der Unterrichtsstunde wegweisen. Ermahnungen spricht die Schulleitung aus. Sie kann dafür auch Lehrpersonen vorsehen. Das gilt für mündliche und schriftliche Ermahnungen. Schriftliche Verweise verfügt die Schulleitung. Nur bei schriftlichen Verweisen sind Bussen möglich.',
'Vor einer Disziplinarmassnahme dürfen Sie sich zu den Vorwürfen äussern. Dieses Recht heisst rechtliches Gehör. Sie dürfen Ihre Sicht ruhig und sachlich erklären. Dafür ist nicht immer ein persönliches Gespräch nötig. Eine Klärungsnotiz hält Ihre Sicht schriftlich fest. Nennen Sie darin die Tatsachen und Ihren eigenen Anteil. Bitten Sie bei offenen Fragen um ein Gespräch.',
'Im Lehrbetrieb gibt die Arbeitgeberin oder der Arbeitgeber Weisungen zur Arbeit. Dazu gehören Regeln zu Arbeitszeit, Pausen und Verhalten. Dieses Recht heisst Weisungsrecht. Die Berufsbildnerin oder der Berufsbildner gibt Ihnen entsprechende Anweisungen. Befolgen Sie rechtmässige Weisungen nach Treu und Glauben. Arbeiten Sie sorgfältig und schonen Sie Material. Das gehört zur Sorgfaltspflicht. Beispielhafte Situationen sind eine neue Arbeitsanweisung oder ein beschädigtes Werkzeug. Fragen Sie bei unklaren Anweisungen nach. Melden Sie Schäden sofort.',
'Eine Ermahnung erinnert Sie an eine verletzte Pflicht. Sie soll Ihnen helfen, Ihr Verhalten zu verbessern. Lautes Schimpfen kann Sie verletzen. Sie dürfen das ruhig ansprechen. Suchen Sie dafür einen passenden Zeitpunkt und ein Gespräch unter vier Augen. Das ist ein Vorschlag zur Klärung, keine gesetzliche Wartepflicht. Ein Streit vor dem Team erschwert oft die Lösung.',
'Bereiten Sie Ihr Klärungsgespräch mit vier Punkten vor. Erstens: Bitten Sie ruhig um ein Gespräch unter vier Augen. Zweitens: Schildern Sie die Fakten ohne Ausreden. Drittens: Zeigen Sie Verständnis für die andere Sicht. Viertens: Schlagen Sie eine konkrete Lösung vor. Halten Sie dazu kurze Stichworte in Ihrem Gesprächsplan fest. Nutzen Sie diese beim Sprechen. Hören Sie zu und fragen Sie bei Unklarheiten nach.'
]
examples=['In einer Gruppenarbeit lassen Sie andere ausreden.','Vor einer Tonaufnahme fragen Sie alle Beteiligten ausdrücklich um Erlaubnis.','Bei einer falschen Absenzenmeldung reichen Sie Ihre Erklärung schriftlich ein.','Im Lager erklärt Ihre Berufsbildnerin den sicheren Umgang mit einer neuen Verpackung.','Nach einer Kritik bitten Sie um einen ruhigen Termin.','Im Sportverein vereinbaren Sie nach einem Streit ein Gespräch. Sie notieren vorher Ihre Anliegen.']
for n,t,e in zip(d['nuggets'],texts,examples): n['inhalt']=t;n['beispiel']=e
# Separate Karte: alle Absenzregeln dort, keine Vermischung mit Foto-Fall.
n=copy.deepcopy(d['nuggets'][4]);n.update(id='nugget_B_04',titel='Schulabsenzen wegen Arbeit',inhalt='Ein wichtiger Kundenauftrag allein entschuldigt keine Schulabsenz. Für geschäftliche Inanspruchnahme gelten enge Voraussetzungen. Ein ausserordentliches Ereignis muss einen bedeutenden Schaden bedrohen. Auch das übrige Personal muss für dieselbe Schadensabwehr arbeiten. Eine weitere Ausnahme betrifft auswärtige Arbeit, die für Ihre Ausbildung unumgänglich ist. Der Schulbesuch muss dabei unzumutbar sein. Sie müssen den Unterricht nacharbeiten können. Planen Sie eine Absenz? Reichen Sie das schriftliche Gesuch mindestens 14 Tage im Voraus ein. Nennen Sie den Grund. Sie und Ihr Lehrbetrieb unterschreiben. Sind Sie minderjährig, unterschreibt auch Ihre erziehungsberechtigte Person. Die Schulleitung entscheidet. Bei anderen Absenzen reichen Sie das Gesuch baldmöglichst ein. An der BBW haben Sie vier Wochen für Unterschrift und Vorlage bei der Lehrperson. Diese Schulfrist ersetzt kein Gesuch im Voraus.',beispiel='Sie kennen einen Termin schon lange. Sie fragen frühzeitig nach dem Gesuch.',fuer_leitfrage=[],glossar_refs=['geschaeftliche_inanspruchnahme','schadensabwehr','schulleitungsentscheid'],recherche={'suchbegriffe':['Schulabsenz Gesuch Zürich','geschäftliche Inanspruchnahme Berufsfachschule'],'selbst_pruefen':'Prüfen Sie: Welche Frist gilt für eine geplante Absenz?'})
n['fakten_anker']=[{'behauptung':v,'wert':w,'quelle':q,'validiert':True,'lp_pruefen':False} for v,w,q in [('Geschäftliche Inanspruchnahme hat zwei eng begrenzte Gründe.','Ausnahmen','Disziplinarreglement LS 413.322, § 5 lit. a und b'),('Vorhersehbare Absenzen mindestens 14 Tage vorher schriftlich beantragen.','14 Tage','Disziplinarreglement LS 413.322, §§ 7–9'),('Vier Wochen für Unterschrift und Vorlage bei der Lehrperson.','vier Wochen','Auskunft Lehrperson BBW, 2026-11-03')]]
d['nuggets'].append(n)
d['nuggets'][1]['fakten_anker']=d['nuggets'][1]['fakten_anker'][:3]
d['nuggets'][1]['fakten_anker'][0]['behauptung']='Aufnahmen brauchen die ausdrückliche Genehmigung der betroffenen Person.'
d['nuggets'][1]['fakten_anker'] += [{'behauptung':'Ermahnungen auch durch Lehrpersonen, wenn von der Schulleitung vorgesehen. Bussen nur bei schriftlichen Verweisen.','wert':'Zuständigkeit und Busse','quelle':'Disziplinarreglement LS 413.322, § 14 Abs. 1 lit. b, § 16','validiert':True,'lp_pruefen':False}]
for g in d['glossar']:
 for key in ['erklaerung_a2','beispiel']: g[key]=g[key].replace('des Chefs','der Arbeitgeberin oder des Arbeitgebers').replace('Der Chef','Die Berufsbildnerin')
 if g['id']=='reglement': g['beispiel']='Das Disziplinarreglement gilt an der Berufsfachschule.'
 if g['id']=='schulleitung': g['beispiel']='Die Schulleitung entscheidet über schriftliche Verweise.'
for id,begriff,erk in [('geschaeftliche_inanspruchnahme','geschäftliche Inanspruchnahme','Der Betrieb braucht Sie während der Schulzeit.'),('schadensabwehr','Schadensabwehr','Sie verhindern einen Schaden.'),('schulleitungsentscheid','Schulleitungsentscheid','Die Schulleitung entscheidet über Ihr Gesuch.')]:
 if not any(g['id']==id for g in d['glossar']): d['glossar'].append({'id':id,'begriff':begriff,'erklaerung_a2':erk,'beispiel':'Sie prüfen die Voraussetzungen im Dossier.'})
d['sprachmodi_scaffolds'][0]['so_gehst_du_vor'][1]='2. Prüfen Sie Info-Karte A-02 im Dossier.'
d['sprachmodi_scaffolds'][1]['so_gehst_du_vor'][0]='1. Halten Sie die Tatsachen von Heft B, Seite 1, fest.'
d['sprachmodi_scaffolds'][1]['so_gehst_du_vor'][1]='2. Klären Sie die Regeln im Raster auf Heftseite 3.'
g=s['gemeinsamer_auftrag'];g['situation_text']='Heute ist Donnerstag. Meine Berufsbildnerin braucht mich nächsten Dienstag für einen Kundenauftrag. Der Auftrag ist wichtig, aber kein Notfall. Er findet am normalen Arbeitsort statt. Niemand hat ein Gesuch an die Schule gestellt. Am Dienstag findet ein obligatorischer Schulanlass statt. Ich will im Betrieb helfen und meine Schulpflicht erfüllen. Wie kläre ich das respektvoll mit meiner Berufsbildnerin?'
g['auftrag']='Prüfen Sie den Terminkonflikt. Halten Sie Ihre Ergebnisse fest und üben Sie das Gespräch mit der Berufsbildnerin.'
g['schritte'][1]['hint']='Lesen Sie Info-Karte B-04 im Dossier. Nutzen Sie Wichtige Wörter auf Seite A1.'
g['schritte'][2]={'label':'03 Ergebnisse festhalten','hint':'Notieren Sie auf A2: Wunsch des Betriebs, passende Schulregel und Ihren begründeten Vorschlag.'}
g['schritte'][3]['label']='04 Gespräch'
g['abgaben'][0]='Ergebnisse in den drei Stationen auf Seite A2'
g['produkte'][0].update(form='spur',stationen=['Wunsch des Betriebs','Schulregel: Grund und Frist prüfen','Mein Vorschlag mit Grund'])
g['produkte'][1]['stationen'][1]='Station 2: Arbeit ausserhalb der Schulzeit vorschlagen'
g['erwartungshorizont']['gut_wenn'][1]='§ 5: Normaler Kundenauftrag am Arbeitsort erfüllt keinen Ausnahmegrund. § 8: Gesuch mindestens 14 Tage vorher.'
g['erwartungshorizont']['tragfaehig']='Der Schulanlass ist obligatorisch. Kein Ausnahmegrund nach § 5 lit. a oder b liegt vor. Die Frist nach § 8 ist ebenfalls nicht erfüllt. Arbeit auf schulfreie Zeit verschieben; eine Freistellung nie selbst bewilligen.'
g['feedback_kriterien'][0]['indikator_produkt']='Geschäftliche Inanspruchnahme und Schadensabwehr sind beim Schreiben und Sprechen richtig erklärt.'
g['feedback_kriterien'][2]['indikator_produkt']='Mein Vorschlag beachtet die Frist und den Schulleitungsentscheid.'
for c in g['feedback_kriterien']: c['stufen_lernende']=[v+' Das zeige ich beim Schreiben und beim Sprechen.' for v in c['stufen_lernende']]
# KN: Schulrecht gilt hier tatsächlich; kein Meldeverbot erfinden.
def change(v):
 if isinstance(v,dict): return {key:change(val) for key,val in v.items()}
 if isinstance(v,list): return [change(z) for z in v]
 if isinstance(v,str): return v.replace('Kurswerkstatt','Lehrwerkstätte').replace('Kursleitung','Lehrperson').replace('Kurszentrum','kantonalen Lehrwerkstätte').replace('überbetrieblichen Kurs (üK)','kantonalen Lehrwerkstätte').replace('überbetrieblichen Kurs','kantonalen Lehrwerkstätte')
 return v
k=change(k)
k['hybrid_situation']['text']='Ich lerne in einer kantonalen Lehrwerkstätte. Gestern habe ich ein Spezialwerkzeug schmutzig in den falschen Schrank gelegt. Die Lehrperson hat vorher erklärt: Reinigen Sie das Werkzeug und legen Sie es richtig zurück. Heute stellt sie mich vor der Gruppe zur Rede. Sie will bei der Schulleitung einen schriftlichen Verweis beantragen. Ich erschrecke. Ich habe einen Fehler gemacht. Meine Sicht konnte ich noch nicht erklären. Wie kläre ich meinen Fehler respektvoll mit der Lehrperson?'
k['hybrid_situation']['leitfrage']='Wie kläre ich meinen Fehler respektvoll mit der Lehrperson?'
k['kn_typen'][0]['ablauf'][0]='Sie haben 15 Minuten zur Vorbereitung. Lesen Sie den Fall und notieren Sie Stichworte. Dossier und Hefte sind erlaubt. Internet ist nicht erlaubt.'
k['kn_typen'][0]['fragestruktur'][2]['frage']='Darf die Schule einen Verweis beschliessen, ohne Ihre Sicht anzuhören? Begründen Sie.'
k['kn_typen'][1]['aufgaben'][2]['aufgabe']='Warum dürfen Sie vor einem schriftlichen Verweis Ihre Sicht erklären? Begründen Sie.'
k['kn_typen'][1]['aufgaben'][3]['aufgabe']='Schreiben Sie zwei Sätze: Wie sprechen Sie die Lehrperson nach dem Unterricht respektvoll an?'
k['kn_typen'][2]['ablauf'][0]='Wählen Sie ein Produkt aus Ihren Heften. Nehmen Sie die Klärungsnotiz oder den Gesprächsplan.'
k['kn_typen'][2]['reflexionsfragen'][1]='Wie zeigt sich diese Regel im neuen Fall? Was ist gleich, was anders als in Ihrem Heft?'
k['hybrid_situation']['definition_lang']='Neue Szene in einer kantonalen Lehrwerkstätte: Spezialwerkzeug falsch versorgt. Schulregeln und rechtliches Gehör aus A werden mit respektvoller Gesprächsführung aus B verbunden. Kein üK-Fall; keine Anwendung des Schulreglements auf ein Verbandszentrum.'
p['hybrid_situation_spec']['fall_ausschluss_hefte_und_auftrag']=['Spezialwerkzeug','Werkzeugschrank','Lehrwerkstätte']
p['modi_auftrag_herleitung']=p['modi_auftrag_herleitung'].replace('Auswertungsraster','drei Prüfstationen')
g['kontext_ausschluss'][2]='Spezialwerkzeug in der Lehrwerkstätte (KN)'
# Paragraphen nur Quellen und LP-Lösungen.
def clean(v,key=''):
 if key in ['loesung','loesungsbild','fakten_anker','erwartungshorizont']: return v
 if isinstance(v,dict): return {kk:clean(vv,kk) for kk,vv in v.items()}
 if isinstance(v,list): return [clean(z,key) for z in v]
 if isinstance(v,str):
  v=re.sub(r'\s*\((?:§|OR)[^)]*\)','',v)
  v=v.replace('OR 321d Weisungsrecht Lehrbetrieb','Weisungsrecht Lehrbetrieb')
  return v
 return v
for name,obj in [('herausforderung_A',a),('herausforderung_B',b),('dossier',d),('set',s),('kn',k),('prinzip',p)]: save(name,clean(obj))
