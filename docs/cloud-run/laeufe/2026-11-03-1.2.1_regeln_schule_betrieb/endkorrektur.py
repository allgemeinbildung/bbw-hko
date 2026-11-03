from pathlib import Path
import json
r=Path('src/data/einheiten/1.2.1_regeln_schule_betrieb')
fix={'Fachw?rter':'Fachwörter','erkl?re':'erkläre','begr?nde':'begründe','Begr?nden':'Begründen','n?chsten':'nächsten','Zust?ndigkeiten':'Zuständigkeiten','vollst?ndig':'vollständig','?berlegt':'überlegt','?berzeugt':'überzeugt','L?sung':'Lösung','w?hrend':'während','pr?fen':'prüfen','f?r':'für'}
for p in r.glob('*.json'):
 t=p.read_text(encoding='utf-8')
 for x,y in fix.items(): t=t.replace(x,y)
 p.write_text(t,encoding='utf-8')
p=r/'set.json';d=json.loads(p.read_text(encoding='utf-8'));cs=d['gemeinsamer_auftrag']['feedback_kriterien']
cs[0]['stufen_lernende']=['Ich nutze beim Schreiben falsche Fachwörter. Meine Sprache ist fehlerhaft.','Ich nutze beim Schreiben einige Fachwörter richtig. Meine Sprache hat Fehler.','Ich nutze beim Schreiben passende Fachwörter. Meine Sprache ist meist richtig.','Ich erkläre beim Schreiben Fachwörter selbst. Meine Sprache ist richtig.']
cs[1]['stufen_lernende']=['Ich begründe beim Sprechen nicht. Mein Ton passt nicht.','Ich begründe beim Sprechen wenig. Mein Ton passt teilweise.','Ich begründe beim Sprechen klar. Mein Ton bleibt respektvoll.','Ich begründe beim Sprechen vollständig. Mein Ton bleibt ruhig und überlegt.']
cs[2]['stufen_lernende']=['Ich erkenne beim Schreiben keine Regeln oder Zuständigkeiten.','Ich erkenne beim Schreiben einige Regeln. Mein Vorgehen ist unsicher.','Ich erkenne beim Schreiben Regeln und Zuständigkeiten. Mein Vorgehen passt.','Ich wende beim Schreiben Regeln und Zuständigkeiten genau und sicher an.']
cs[3]['stufen_lernende']=['Ich zeige beim Sprechen keine Haltung und suche keine Lösung.','Ich deute beim Sprechen meine Haltung an und suche kaum Lösungen.','Ich zeige beim Sprechen Respekt und suche eine faire Lösung.','Ich begründe beim Sprechen meine Haltung klar. Meine faire Lösung überzeugt.']
cs[0]['indikator_produkt']='Ich erkläre geschäftliche Inanspruchnahme und Schadensabwehr richtig.'
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
