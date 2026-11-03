import json, copy, subprocess
from pathlib import Path

ROOT=Path('D:/OS/dev/bbw-hko')
O='2.1.1_budget_planen'
OUT=ROOT/'src/data/einheiten'/O
AS=ROOT/'.claude/skills/bbw-hko-heft-v42/assets'
RUN=ROOT/'docs/cloud-run/laeufe/2026-11-03-2.1.1_budget_planen'
DATE='2026-11-03'
def load(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def template(n): return load(AS/f'eba-{n}-template.json')
def write(n,d):
    s=json.dumps(d,ensure_ascii=False,indent=2)+'\n'
    assert '{{' not in s and chr(223) not in s, n
    (OUT/n).write_text(s,encoding='utf-8')
def check():
    r=subprocess.run(['node','scripts/check-v42.mjs',O],cwd=ROOT,capture_output=True)
    (RUN/'schreib-check.txt').write_bytes(r.stdout+r.stderr)
    print(r.stdout.decode('utf-8',errors='replace')[-8000:])
P=load(ROOT/'public/nrlp_2j.json')
T=next(t for t in P['themen'] if t['nr']==2)
LB=T['lebensbezuege'][0]
SM3='Rezeption schriftlich und bildlich'; SM4='Produktion mündlich'; SM5='Produktion schriftlich und bildlich'; SM7='Interaktion und Kollaboration mündlich'
MOD='Bewusst konsumieren und handeln — Geld und Konsum planen'
PERSON={'beruf':'Lernende/r EBA, 1. Lehrjahr','betrieb':'eigener Lehrbetrieb','ort':'eigener Wohnort'}
PROM='Ich kann ein Budget erstellen, Risiken für Schulden erkennen und eine bezahlbare Konsumwahl begründen.'
TR=['Heute nutzen vs. Geld für später behalten','Schnell ersetzen vs. länger nutzen','Eigener Wunsch vs. gemeinsames Geld schützen']
ANK='Vor einer Konsumwahl prüfe ich mein Geld, spätere Zahlungen und eine Möglichkeit zur längeren Nutzung.'
VER='Ein schneller Kauf und längeres Warten haben Vorteile. Entscheidend sind das verfügbare Geld, der Bedarf und die Folgen.'
TIT={'A':'Mein Lohn reicht bis Monatsende','B':'Eine Jacke länger nutzen'}
LAB={'A':'Monatsbudget erstellen','B':'Konsumwahl umsetzen'}
PROD={'A':'Mein Monatsbudget mit Risikoprüfung','B':'Meine Konsumwahl in 60 Sekunden'}
FORM={'A':'Budgettabelle mit kommentierter Zahlungswahl auf einer Seite','B':'Mündliche Erklärung mit Stichwortzettel, 60 Sekunden'}
CONCEPT={'A':'Verfügbares Geld und spätere Zahlungen zusammen planen.','B':'Bezahlbare Wege zur längeren Nutzung umsetzen.'}
OUT.mkdir(exist_ok=True)
pr=template('prinzip')
pr.update(id=O+'_prinzip',modul='2.1',kompetenz_nr='2.1.1',topic_slug='budget_planen',erstellt_am=DATE,kern_kompetenzversprechen=PROM)
pr['herausforderungen']={L:{'herausforderung':LAB[L],'konfliktart':TR[i],'handlungsprodukt_typ':FORM[L],'kompetenzen':[LB['kompetenzen'][i]['nr']],'transferrable':True} for i,L in enumerate('AB')}
pr.update(sk_pro_situation={'A':[1,3,9],'B':[1,3,9]},sk_schnittmenge_kn={'primary':[1,3,9]},aspekte={'Wirtschaft':'R1','Ökologie':'R1'},modi_units=[SM3,SM4],modi_kn=[SM3,SM4,SM5,SM7])
pr['mehrdeutigkeits_architektur']={'trade_off_raum':TR,'verbindlich':VER}
pr['dekontextualisierungs_anker']={'anker_statement':ANK,'transferfeld':'Technik für ein Hobby oder Ausstattung für eine Reise: Rest, Folgekosten und Weiterverwendung prüfen.'}
pr['zirkularitaet']={'r1_aktuell':'R1','r2_voraussicht':"T7 '"+next(t['titel'] for t in P['themen'] if t['nr']==7)+"' — Wirtschaft R2",'r3_voraussicht':'—'}
pr['quellen_anker']={'chapters':[{'ref':'Dossier','titel':'Budget und Konsum','seiten':'Info-Karten A-01 bis B-03'}],'konzepte':['Budget','Restbetrag','Rate','Reparatur','Secondhand']}
pr['hybrid_situation_spec'].update(must_activate_trade_offs_min=2,persona_neutral='Lernende/r EBA, 1. Lehrjahr · eigener Lehrbetrieb · eigener Wohnort (Stufe 2: der Fall ist neu, nicht die Person)',fall_ausschluss_hefte_und_auftrag=['Pavillon','Quartierfest'])
pr['modi_pro_heft']={'A':[SM3],'B':[SM4]}
pr['kn_kriterien_verteilung']={'A':['Fachkorrektheit','Wirtschaftliches Prinzip'],'B':['Argumentation','Position / Werthaltung']}
pr['pol_typ_verteilung']={'A':{'ohne_medien':'modell_eigener_fall'},'B':{'ohne_medien':'position_gegenposition'}}
pr.update(mindmap_zentrum_kurz='Geld und Nutzung planen',modi_auftrag=[SM5,SM7],modi_auftrag_herleitung='KN {SM3, SM4, SM5, SM7} minus A {SM3} und B {SM4} ergibt {SM5, SM7}. SM3 in A ersetzt SM2 ausdrücklich gemäss Freigabe vom 03.11.2026; audiovisuelle Rezeption bleibt Lehrplanlücke.',auftrag_lebensbereich='Berufsfachschule: Klassenstand')
write('prinzip.json',pr)

names=['Fachkorrektheit','Argumentation','Wirtschaftliches Prinzip','Position / Werthaltung']
simple=['Fachwörter richtig nutzen','Meine Wahl begründen','Mit dem verfügbaren Geld planen','Meine Priorität erklären']
stages=[
['Fachwörter fehlen oder sind falsch. Die Angaben sind unverständlich.','Einige Fachwörter stimmen. Manche Angaben bleiben unklar.','Die Fachwörter stimmen. Die Angaben sind verständlich und passen zum Fall.','Die Fachwörter stimmen und sind selbst erklärt. Alle Angaben passen zum Fall.'],
['Ein Grund für die Wahl fehlt.','Ein Grund ist genannt. Der Bezug zu den Angaben bleibt unklar.','Die Wahl hat einen passenden Grund mit Angaben aus dem Fall.','Die Wahl hat passende Gründe. Ein Gegenargument und eine Folge sind erklärt.'],
['Verfügbares Geld und spätere Kosten sind nicht berücksichtigt.','Das verfügbare Geld oder spätere Kosten sind teilweise berücksichtigt.','Verfügbares Geld und spätere Kosten sind richtig berücksichtigt.','Die Planung stimmt. Das Vorgehen ist auch auf eine neue Belastung übertragen.'],
['Eine eigene Priorität fehlt.','Eine eigene Priorität ist angedeutet.','Eine eigene Priorität ist klar genannt.','Eine eigene Priorität ist begründet. Ein Nachteil der Wahl ist anerkannt.']]
ich=[
['Ich nutze keine passenden Fachwörter. Meine Angaben sind unverständlich.','Einige meiner Fachwörter stimmen. Manche Angaben bleiben unklar.','Ich nutze passende Fachwörter. Meine Angaben sind verständlich und passen zum Fall.','Ich erkläre die richtigen Fachwörter selbst. Alle meine Angaben passen zum Fall.'],
['Ich nenne keinen Grund für meine Wahl.','Ich nenne einen Grund. Der Bezug zu den Angaben bleibt unklar.','Ich begründe meine Wahl mit passenden Angaben aus dem Fall.','Ich begründe meine Wahl. Ich erkläre auch ein Gegenargument und eine Folge.'],
['Ich beachte das verfügbare Geld und spätere Kosten nicht.','Ich beachte das verfügbare Geld oder spätere Kosten zum Teil.','Ich beachte das verfügbare Geld und spätere Kosten richtig.','Meine Planung stimmt. Ich wende das Vorgehen auch bei einer neuen Belastung an.'],
['Ich nenne keine eigene Priorität.','Ich deute meine eigene Priorität an.','Ich nenne meine eigene Priorität klar.','Ich begründe meine Priorität. Ich erkenne einen Nachteil meiner Wahl an.']]
KR=[{'name':n,'name_lernende':simple[i],'dimension':'SuK' if i<2 else 'Ges','stufen':stages[i],'stufen_lernende':ich[i]} for i,n in enumerate(names)]
def feedback(i,indicator):
    k=copy.deepcopy(KR[i]); k['kn_kriterium']=k.pop('name'); k['indikator_produkt']=indicator; return k
kn=template('kn')
kn.update(id=O+'_kn',modul='2.1',kompetenz_nr='2.1.1',topic_slug='budget_planen',erstellt_am=DATE,set_ref=O+'_set',prinzip_ref=O+'_prinzip',anchored_situations=[O+'_hf_A',O+'_hf_B'],dominanter_aspekt='Wirtschaft',kern_kompetenzversprechen=PROM,mehrdeutigkeits_pflicht=VER)
kq='Wie erfülle ich unseren Bedarf und behalte Geld und die spätere Nutzung im Blick?'
kn['hybrid_situation'].update(titel='Ein Pavillon fürs Quartierfest',persona=PERSON,text='Ich helfe freiwillig beim Quartierfest. Das Organisationsteam braucht einen Pavillon. Dafür haben wir 180 Franken. Andere feste Ausgaben kosten 60 Franken. Die Miete kostet insgesamt 70 Franken. Rückgabe ist am Folgetag. Kaufen kostet insgesamt 210 Franken: sofort oder drei Raten zu je 70 Franken. Weitere Gebühren gibt es nicht. Das Team will den Pavillon später wieder nutzen. Ein weiterer Termin und zusätzliche Einnahmen sind noch nicht zugesagt. '+kq,leitfrage=kq,aktivierte_trade_offs=TR[:2],definition_lang='Die beiden Herausforderungen verbinden begrenztes Geld mit längerer Nutzung. Neu sind das Organisationsteam, der Verleih und das Quartierengagement. Beide Werkzeuge sind nötig: Rest nachrechnen und Nutzung ohne neuen Besitz abwägen.',alignment_note={'herausforderungen_mapping':[{'hf_letter':'A','scene_element':'Budgetrest und zwei noch offene Raten ohne zugesagte spätere Einnahmen.'},{'hf_letter':'B','scene_element':'Mieten für den aktuellen Bedarf gegenüber Besitz für mögliche spätere Nutzung.'}],'new_dimensions':[]})
kn['hybrid_situation']['text']='Erfundener Fall. '+kn['hybrid_situation']['text']
questions=['Erklären Sie den frei verfügbaren Rest nach den anderen festen Ausgaben.','Berechnen Sie den Rest nach der Miete. Wie viel bleibt beim Kauf nach der ersten Rate noch offen?','Wählen Sie Miete oder Kauf. Begründen Sie die Wahl mit dem Geld und der Nutzung.','Vergleichen Sie Ihr Vorgehen mit einem Ihrer beiden Hefte. Was übernehmen Sie für diesen neuen Fall?','Nennen Sie Ihre wichtigste Priorität und einen Nachteil Ihrer Wahl.']
for i,q in enumerate(kn['kn_typen'][0]['fragestruktur']): q['frage']=questions[i]
tasks=['Erklären Sie Budget und Restbetrag am Fall.','Berechnen Sie den Rest nach Miete und nach der ersten Kaufrate. Nennen Sie die noch offene Kaufsumme.','Wählen Sie Miete oder Kauf. Schreiben Sie einen Grund, ein Gegenargument und eine Folge auf.','Formulieren Sie eine Regel für die Planung. Prüfen Sie zusätzlich 20 Franken neue Kosten bei der Miete.']
for i,q in enumerate(kn['kn_typen'][1]['aufgaben']):
    q['aufgabe']=tasks[i]; q.pop('tabelle',None)
kn['kn_typen'][2]['ablauf'][0]=f'Lernende wählen eines ihrer zwei Produkte aus den Heften ({PROD["A"]}; {PROD["B"]}).'
kn['kn_typen'][2]['reflexionsfragen']=['Welche Grundregel haben Sie gelernt? Formulieren Sie sie in einem Satz.','Wie nutzen Sie die Grundregel für den Pavillon? Nennen Sie etwas Gleiches und etwas Neues.','Wo reicht die Grundregel allein nicht? Nutzen Sie dafür Ihre Erfahrungen mit beiden Heften.']
for typ in kn['kn_typen']: typ.update(sk=[1,3,9],aspekte=['Wirtschaft','Ökologie'])
kn['rubrik_shared']['kriterien']=KR
write('kn.json',kn)
print('Phase 2/3 geschrieben')

def scaffold(strats,starts,product): return {'strategien':strats,'satzanfaenge':['«'+x+'»' for x in starts],'produkt':product}
def zeilen(items,card): return [{'label':a,'text':b,'quelle':'Dossier, Info-Karte '+card} for a,b in items]
def tblock(title,head,rows): return {'titel':title,'kopf':head,'zeilen':[{'zellen':r} for r in rows]}
def bild(title,blocks,legend=None,solution=False):
    b={'titel':title,'legende':legend or [],'bloecke':blocks}
    if solution: b['hinweis']='Eine mögliche Lösung, erst nach der eigenen Arbeit zeigen. Fallüberlegungen sind keine allgemeine Kaufregel.'
    return b
Atexts=[
 'Wofür brauchen Sie Ihr Geld jeden Monat? Erklären Sie feste und veränderbare Kosten mit je einem Beispiel.',
 'Ordnen Sie die Angaben im Raster. Berechnen Sie danach den frei verfügbaren Rest in zwei Sätzen.',
 'Wählen Sie für das Headset Raten oder Ansparen. Begründen Sie Ihre Wahl mit dem Budget und einer Folge.']
Btexts=[
 'Wie können Sie eine Jacke länger nutzen? Erklären Sie zwei Möglichkeiten mit der Info-Karte.',
 'Vergleichen Sie die drei Wege im Raster. Halten Sie in zwei Sätzen fest, welche Wege mit 90 Franken möglich sind.',
 'Wählen Sie Reparatur oder Secondhand. Begründen Sie Ihre Wahl mit dem Bedarf und der längeren Nutzung.']
H={}
for idx,L in enumerate('AB'):
    a=L=='A'; h=template('herausforderung'); c=LB['kompetenzen'][idx]
    h.update(id=O+'_hf_'+L,modul='2.1',modul_titel=MOD,buchstabe=L,titel=TIT[L],herausforderung={'buchstabe':L,'label':LAB[L]},prinzip_ref=O+'_prinzip',persona=PERSON)
    for k,v in zip(['sit_farbe','sit_farbe_light','sit_farbe_mid'],['#C0392B','#FADBD8','#E74C3C'] if a else ['#2471A3','#D6EAF8','#3498DB']): h[k]=v
    h['nrlp']={'nr':c['nr'],'nr_primary':[c['nr']],'lebensbezug':'2.1','themen':['T2'],'gesellschaft':[{'aspekt':c['gesellschaftliche_inhalte'][0]['aspekt'],'iteration':'R1'}],'sprachmodi':[SM3 if a else SM4],'sprachmodus_ids':['SM3' if a else 'SM4'],'sk':[1,3,9],'kompetenz_id':c['nr'],'lebensbezug_id':'2.1','kompetenz_text':c['text'],'lebensbezug_text':LB['text']}
    h['situation_text']=('Ich erhalte 780 Franken Nettolohn im Monat. Zu Hause zahle ich 120, fürs Handy 30, für ÖV 80 und Streaming 15 Franken. Ich plane 140 für Essen unterwegs, 110 für Freizeit, 60 für Kleider, 40 für Körperpflege und 10 für Schulmaterial. Ich lege 100 Franken zurück. Meine Eltern zahlen Krankenkasse, Gesundheitskosten und Lehrmittel direkt. Weitere Rechnungen habe ich hier nicht. Nun wünsche ich mir ein Gaming-Headset. Es kostet sofort 120 Franken. Das Ratenangebot kostet dreimal 44, insgesamt 132 Franken. Ich habe noch kein Geld dafür gespart. Reicht mein Geld, auch später?'
    if a else 'Meine Regenjacke hat einen kaputten Verschluss. Ich habe 90 Franken für Kleidung. Diese Woche bin ich oft draussen. Der Reparaturdienst kann den Verschluss für 35 Franken ersetzen. Der übrige Stoff ist noch gut. Die Reparatur dauert sieben Tage. Eine passende Secondhand-Jacke kostet 60 Franken und ist heute verfügbar. Sie ist dicht und unbeschädigt. Eine neue Jacke gefällt mir auch. Sie kostet 120 Franken. Ich will eine passende Lösung und nicht mehr als mein Kleidungsgeld ausgeben. Eine Umweltbilanz zu diesen Angeboten habe ich nicht.')
    vals=[('Nettolohn pro Monat','CHF 780'),('Feste Kosten','CHF 245'),('Veränderbare Kosten','CHF 360'),('Zurückgelegt','CHF 100')] if a else [('Kleidungsgeld','CHF 90'),('Reparatur','CHF 35'),('Secondhand','CHF 60'),('Neue Jacke','CHF 120')]
    h['zahlen_tabelle']=[{'label':x,'wert':y} for x,y in vals]
    h['leitfrage']='Wie plane ich meinen Lohn und meinen Wunsch, ohne später Geld zu vermissen?' if a else 'Wie bekomme ich eine passende Jacke und behalte dabei Geld und Material im Blick?'
    h['mehrdeutigkeit']={'explizit':True,'trade_off':TR[idx],'hint':'Vergleichen Sie: sofort nutzen und mehr zahlen oder erst sparen und warten.' if a else 'Prüfen Sie: Die Reparatur braucht Zeit. Secondhand ist sofort verfügbar, kostet aber mehr.'}
    cards=['Mein Geld für einen Monat','So rechne ich mein Budget','Heute kaufen, später zahlen?'] if a else ['Länger nutzen statt schnell ersetzen','Drei Angebote prüfen','Meine Wahl braucht einen Grund']
    h['quellen_anker']=[{'ref':'Dossier','titel':cards[i],'unterueberschrift':'','seiten':f'Info-Karte {L}-0{i+1}','fuer_leitfrage':[i+1]} for i in range(3)]
    h['leitfragen_intro']='Leitfrage 1 klärt die Wörter. Leitfrage 2 liefert die Rechnung. Leitfrage 3 liefert die Wahl mit Grund.' if a else 'Leitfrage 1 zeigt Möglichkeiten. Leitfrage 2 liefert den Vergleich. Leitfrage 3 liefert die Wahl für Ihre Erklärung.'
    allq=h['leitfragen']+h['spuren']['ohne_medien']['leitfragen']
    liefert=['Die Kategorien im eigenen Budget','Die Beträge und der Rest','Die Zahlungswahl mit einer Folge'] if a else ['Die Wege zur längeren Nutzung','Der Vergleich der drei Angebote','Die Konsumwahl mit einem Grund']
    for i,q in enumerate(allq):
        q.update(knoten_ref=f'Dossier | Info-Karte {L}-0{i+1}',text=(Atexts if a else Btexts)[i],liefert=liefert[i])
        q['scaffolding']=scaffold([f'Lesen Sie Info-Karte {L}-0{i+1}.','Markieren Sie passende Angaben im Fall.','Übernehmen Sie das Ergebnis in Ihr Produkt.'],['Ich finde …','Für meinen Fall heisst das …','Mein Grund ist …'],liefert[i]+'.')
    allq[0]['loesung']={'kern':'Kostenarten mit Beispielen erklären.' if a else 'Vorhandenes länger nutzen statt ersetzen.','zeilen':zeilen([('Fixkosten','Feste geplante Rechnungen, etwa Handy und ÖV.'),('Veränderbar','Ausgaben mit Spielraum, etwa Freizeit und Kleider.'),('Zurücklegen','100 sind eingeplant und nicht nochmals frei verfügbar. Fallüberlegung.')] if a else [('Reparatur','Den Verschluss ersetzen und die vorhandene Jacke weitertragen.'),('Secondhand','Eine schon gebrauchte Jacke weiter nutzen.'),('Grenze','Längere Nutzung schont meist Rohstoffe. Keine gemessene Bilanz für diese Angebote behaupten.')],L+'-01')}
    rq=allq[1]; ra=rq['raster']
    ra.update(knoten_ref=rq['knoten_ref'],auftrag=f'Lesen Sie Info-Karte {L}-02. Im Raster ist die erste Zeile schon ausgefüllt, als Beispiel. Füllen Sie zwei weitere Zeilen aus.',spalten=['Posten','Betrag CHF','Wofür?','→ Begriff'] if a else ['Weg','Kosten CHF','Nutzen / Grenze','→ Begriff'],zeilen=3)
    rows=[['Feste Kosten','245','Rechnungen','Fixkosten'],['Veränderbar','360','Alltag und Freizeit','veränderbare Kosten'],['Zurückgelegt','100','später / unerwartet','Reserve']] if a else [['Reparatur','35','sieben Tage warten','Reparatur'],['Gebraucht kaufen','60','heute verfügbar','Secondhand'],['Neu kaufen','120','30 fehlen','Konsum']]
    ra['beispielzeile']=rows[0]
    rq['loesung']={'kern':'Nach allen Posten bleiben 75 Franken.' if a else 'Zwei Wege passen zum Kleidungsgeld.','quelle_ref':rq['knoten_ref'],'quelle_stand':DATE,'zeilen':zeilen([('Fixkosten','120 + 30 + 80 + 15 = 245. Fallrechnung.'),('Veränderbar','140 + 110 + 60 + 40 + 10 = 360. Fallrechnung.'),('Rest','780 − 245 − 360 − 100 = 75. Fallrechnung.')] if a else [('Reparatur','90 − 35 = 55 Rest. Der Stoff bleibt in Nutzung. Fallrechnung.'),('Secondhand','90 − 60 = 30 Rest. Sofort verfügbar. Fallrechnung.'),('Neu','90 − 120 = −30. Ohne Änderung nicht bezahlbar. Fallrechnung.')],L+'-02'),'raster_zeilen':rows,'befund':'Fallüberlegung: Ich habe 75 Franken frei. Das reicht nicht für den Sofortkauf zu 120 Franken.' if a else 'Fallüberlegung: Ich kann Reparatur oder Secondhand bezahlen. Für die neue Jacke fehlen 30 Franken.'}
    pq=allq[2]; pq['pol_typ']=pr['pol_typ_verteilung'][L]['ohne_medien']
    pq['loesung']={'kern':'Ansparen oder Raten mit Folgen begründen.' if a else 'Reparatur oder Secondhand passend begründen.','erwartungshorizont':{'gut_wenn':['Beide Wege sind konkret verglichen.','Geld und eine Folge sind berücksichtigt.','Die Wahl enthält einen Grund und einen Nachteil.'],'beispiel_pol_1':'Fallüberlegung: Ich spare dreimal 40 Franken. So zahle ich 120 statt 132 und habe monatlich 35 frei. Dafür warte ich.' if a else 'Fallüberlegung: Ich lasse für 35 Franken reparieren. Ich nutze die Jacke weiter und behalte 55. Die Wartezeit überbrücke ich mit geliehener Kleidung.','beispiel_pol_2':'Fallüberlegung: Ich zahle dreimal 44 Franken. Ich nutze das Headset sofort. Es kostet insgesamt 132, also 12 mehr. Monatlich bleiben nur 31 frei.' if a else 'Fallüberlegung: Ich kaufe Secondhand für 60 Franken. So habe ich heute eine passende Jacke und behalte 30. Die alte Jacke bleibt vorerst kaputt.','nicht_tragfaehig':'Nur die kleine Rate nennen und Gesamtpreis oder spätere Belastung übersehen.' if a else 'Die neue Jacke ohne Deckung kaufen oder aus dem Preis eine genaue Umweltbilanz ableiten.'}}
    sp=h['spuren']['ohne_medien']
    sp['kasten_s4'].update(spalten=['Weg','Vorteil','Grenze'],hinweis='Notieren Sie Stichworte zu beiden Wegen. Schreiben Sie danach Ihren Entscheid mit Grund.',loesung_zeilen=[['Ansparen','120 insgesamt','erst nach drei Monaten'],['Raten','sofort nutzen','132 total; 31 Rest']] if a else [['Reparatur','35; länger nutzen','sieben Tage warten'],['Secondhand','heute; weiter nutzen','60; alte Jacke bleibt']])
    sp['methoden_ref_rezeption']={'ref':'hko-eba-raster-fuellen','fuer':'für Beträge und Begriffe im Raster (S. 3)' if a else 'für den Angebotsvergleich im Raster (S. 3)','beispiel':['Eine andere Rechnung: Monatsbeitrag 25 Franken → feste Kosten.'] if a else ['Ein anderes Angebot: gebrauchtes Buch, 8 Franken → Secondhand.']}
    sp['scaffold_90']='Nutzen Sie die Beispielzeile im Raster (S. 3) und das Beispiel zum Produkt (S. 5).'
    h['lernfortschritt']={'scaffold_90':sp['scaffold_90'],'scaffold_100':'Prüfen Sie freiwillig eine weitere Ausgabe in Ihrem Plan. Nennen Sie den neuen Rest.' if a else 'Prüfen Sie freiwillig ein anderes Kleidungsstück. Erklären Sie eine Möglichkeit zur längeren Nutzung.'}
    hp=h['handlungsprodukt']; hp.update(format=FORM[L],titel=PROD[L],format_detail='Erstellen Sie eine Seite mit allen Posten, Summen, Rest und Zahlungswahl. Ergänzen Sie zwei Risiken mit je einer Massnahme.' if a else 'Planen Sie eine Erklärung auf einem Stichwortzettel. Nennen Sie Wahl, zwei Angaben, Gegenargument und nächsten Schritt.',beschreibung='Ich plane meinen Monat. Ich zeige meine Zahlungswahl und prüfe zwei Risiken.' if a else 'Ich erkläre meine Wahl. Ich sage auch, was dagegen spricht und welchen Schritt ich als Nächstes mache.')
    labels=['Kategorien übernehmen','Beträge nachrechnen','Zahlungsweg wählen','Risiken prüfen','Prüfen und abschliessen'] if a else ['Möglichkeiten sammeln','Angebote vergleichen','Wahl begründen','Erklärung planen','Sprechen und prüfen']
    hints=['Nutzen Sie Leitfrage 1 (S. 2). Schreiben Sie die Kategorien als Titel ins Budget.','Nutzen Sie Leitfrage 2 (S. 3). Übernehmen Sie alle Posten und rechnen Sie den Rest aus.','Nutzen Sie Leitfrage 3 (S. 4). Notieren Sie Zahlungswahl, Gesamtkosten und Rest.','Ergänzen Sie zwei Risiken mit je einer Massnahme. Nutzen Sie Beispiel S. 5 und Methoden S. 6.','Prüfen Sie mit den Kriterien (S. 7). Bei 20 Franken neuer Rate: Wie viel bleibt? Beantworten Sie den Quer-Check (S. 8).'] if a else ['Nutzen Sie Leitfrage 1 (S. 2). Notieren Sie zwei Wege zur längeren Nutzung.','Nutzen Sie Leitfrage 2 (S. 3). Wählen Sie zwei Angaben für Ihre Erklärung aus.','Nutzen Sie Leitfrage 3 (S. 4). Notieren Sie Ihre Wahl mit einem Grund.','Planen Sie Gegenargument und nächsten Schritt. Nutzen Sie Beispiel S. 5 und Methoden S. 6.','Sprechen Sie 60 Sekunden zu einer Person. Prüfen Sie mit den Kriterien (S. 7). Füllen Sie den Abschluss (S. 8) aus.']
    hp['schritte']=[{'label':f'{i+1:02} '+labels[i],'hint':hints[i]} for i in range(5)]
    hp['abgaben']=['Ein Monatsbudget mit Zahlungswahl und zwei Risiken samt Massnahmen','Selbsteinschätzung auf S. 7'] if a else ['Ein Stichwortzettel mit Wahl, Angaben und nächstem Schritt','Eine mündliche Erklärung von 60 Sekunden','Selbsteinschätzung auf S. 7']
    hp['format_detail']+=' Nutzen Sie das Raster als Grundlage.'
    if a:
        legend=[{'key':'fest','text':'fest eingeplant'},{'key':'frei','text':'veränderbar'},{'key':'risiko','text':'spätere Zahlung prüfen'}]
        hp['beispielbild']=bild('Anderer Fall: Zubehör fürs Instrument',[tblock('Mein Monat',['Posten','CHF'],[['Einnahmen','700'],['Feste Kosten','230'],['Veränderbar','270'],['Zurückgelegt','100'],['Rest','100']]),tblock('Mein Kauf',['Punkt','Mein Plan'],[['Wahl','80 sparen; dann kaufen'],['Rest','20 in diesem Monat'],['Risiko 1','Mehrkäufe: Ausgaben notieren'],['Risiko 2','Zusatzabo: Rest neu rechnen']])],legend)
        hp['loesungsbild']=bild('Mögliche Lösung: Monatsbudget und Headset',[tblock('Mein Monat',['Posten','CHF'],[['Nettolohn','780'],['Zuhause / Handy','120 / 30'],['ÖV / Streaming','80 / 15'],['Fix total','245'],['Essen / Freizeit','140 / 110'],['Kleider / Pflege / Schule','60 / 40 / 10'],['Veränderbar total','360'],['Zurückgelegt','100'],['Rest','75']]),tblock('Mein Kauf',['Punkt','Mein Plan'],[['Wahl','Ansparen: 3 × 40 = 120'],['Rest','35 je Monat; Raten: 31'],['Nachteil','Ich muss warten.'],['Risiko 1','Mehrkäufe: täglich notieren'],['Risiko 2','Neue Rate: vorher Rest prüfen'],['Neue Belastung','Ratenweg: 31 − 20 = 11']])],legend,True)
    else:
        hp['beispielbild']=bild('Anderer Fall: Schultasche',[{'titel':'Meine Wahl mit Grund','text':['Ich repariere die Tasche für 20 Franken. Mein Geld dafür: 50 Franken. Es bleiben 30.','Ich nutze vorhandenes Material weiter. Dagegen spricht die Wartezeit.']},{'titel':'Mein nächster Schritt','text':['Heute frage ich beim Reparaturdienst nach. Bis dahin leihe ich eine Tasche.']}])
        hp['loesungsbild']=bild('Mögliche Erklärung: Regenjacke',[{'titel':'Meine Wahl mit Grund','text':['Fallüberlegung: Ich repariere für 35 Franken. Es bleiben 55. Der Stoff ist noch gut. Ich nutze meine Jacke weiter.','Secondhand ist heute verfügbar, kostet aber 60 Franken. Die Reparatur dauert sieben Tage. Das ist mein Nachteil.']},{'titel':'Mein nächster Schritt','text':['Fallüberlegung: Ich frage heute eine vertraute Person nach einer Jacke für die Wartezeit. Dann vereinbare ich die Reparatur. Meine Priorität ist, vorhandenes Material weiter zu nutzen.']}],solution=True)
    h['feedback_kriterien']=[feedback(0,'Kostenbegriffe sind verständlich. Beträge, Rest und Zahlungswahl sind klar beschriftet.'),feedback(2,'Budget und spätere Belastung stimmen. Eine neue Monatsrate von 20 ist geprüft.')] if a else [feedback(1,'Zwei Angaben, ein Gegenargument und eine Folge tragen die mündliche Wahl.'),feedback(3,'Die eigene Priorität und ein Nachteil der bezahlbaren Wahl sind hörbar.')]
    h['methoden']=[{'ref':'hko-eba-wort-klaeren','fuer':'für Budgetwörter' if a else 'für Wörter zu Material und Nutzung'},{'ref':'__spur__','fuer':'Rezeptionswerkzeug der gewählten Spur'},{'ref':'hko-eba-zwei-wege-abwaegen','fuer':'für Raten und Ansparen' if a else 'für Reparatur und Secondhand'},{'ref':'hko-eba-klare-frage' if a else 'hko-eba-fakt-oder-gefuehl','fuer':'für die Frage, wer welche Kosten übernimmt' if a else 'für Angebotsangaben und eigene Vorlieben','beispiel':['«Welche Kosten bezahlen meine Eltern direkt?»'] if a else ['Angabe: «Die Reparatur kostet 35 Franken.»','Vorliebe: «Die neue Farbe gefällt mir.»']}]
    terms=[['Budget','Nettolohn'],['Fixkosten','veränderbare Kosten'],['Restbetrag','Reserve','Rate']] if a else [['Konsum','Reparatur'],['Secondhand','Material'],['Herkunft','Nutzung']]
    h['mindmap_zentrum']=pr['mindmap_zentrum_kurz']
    h['mindmap_aeste']=[{'titel':t,'punkte':p,'optional':False} for t,p in zip(['Was habe ich?','Was brauche ich?','Was folgt daraus?'],terms)]+[{'titel':'gilt auch bei …','punkte':[],'optional':False,'transfer':True}]
    flat=sum(terms,[])
    h['abschluss']={'quercheck':['Habe ich nach allen Posten 75 Franken frei? Wie rechne ich das?','Kann ich bei Raten noch 20 Franken zusätzlich zahlen? Wie viel bleibt?'] if a else ['Kann ich Reparatur und Secondhand bezahlen? Wie viel bleibt jeweils?','Habe ich einen nächsten Schritt mit Zeitpunkt? Welchen?'],'mitnahme':['So berechne ich den freien Rest','So prüfe ich eine spätere Zahlung','Mir noch unklar'] if a else ['So nutze ich Dinge länger','So erkläre ich meine Konsumwahl','Mir noch unklar'],'loesung':{'verbindungen':[{'von':flat[i%len(flat)],'nach':flat[(i+1)%len(flat)] if i<4 else 'gilt auch bei …','text':'hilft beim Prüfen von'} for i in range(5)],'transfer':'Eine Hobbyausrüstung und eine Reiseausstattung: zuerst Geld und spätere Kosten prüfen.','eigene_knoten':{'ohne_medien':['Sparbetrag','Schulden'] if a else ['Entsorgung','nachhaltig']},'quercheck':['Fallrechnung: 780 − 245 − 360 − 100 = 75. Die Elternzahlungen sind nicht nochmals abgezogen.','Fallrechnung: Nach 44 Franken Rate bleiben 31. Eine zusätzliche Rate von 20 lässt nur 11.'] if a else ['Fallrechnung: Reparatur lässt 55, Secondhand lässt 30 Franken. Beide sind bezahlbar.','Fallüberlegung: Heute eine Übergangslösung anfragen und dann die Reparatur vereinbaren. Andere passende Schritte gelten.'],'mitnahme':['Fallrechnung: Einnahmen minus Ausgaben minus Zurücklegen.','Fallüberlegung: Alle Raten und den Gesamtpreis vor dem Kauf prüfen.','Beispiel: Welche eigenen Kosten sind bisher nicht erfasst?'] if a else ['Reparatur und Secondhand nutzen Vorhandenes weiter.','Wahl, Angaben, Gegenargument und nächsten Schritt erklären.','Beispiel: Wo finde ich einen passenden Reparaturdienst?']}}
    h['bewertungsraster']=[{'produkt':'Leitfragen','vollstaendig_wenn':['Leitfrage 1 beantwortet','Leitfrage 3 mit Grund und Nachteil beantwortet']},{'produkt':'Raster','vollstaendig_wenn':['Drei Zeilen mit passenden Begriffen','Zwei eigene Zeilen ausgefüllt','Ergebnis in zwei Sätzen']},{'produkt':'Monatsbudget' if a else 'Konsumerklärung','vollstaendig_wenn':['Alle Posten, Summen und Rest','Zahlungswahl und zwei Risiken mit Massnahmen','Neue Belastung geprüft'] if a else ['Stichwortzettel mit nächstem Schritt','Zwei Angaben und ein Gegenargument','Erklärung mündlich gehalten']},{'produkt':'Abschluss','vollstaendig_wenn':['Quer-Check: jede Frage abgehakt und beantwortet','«Das nehme ich mit» ausgefüllt']}]
    h['wochen_plan'][2]['text']='Monatsbudget, Kriterien, Abschluss mit Quer-Check' if a else 'Konsumerklärung, Kriterien, Abschluss mit Quer-Check'
    h['dekontextualisierung']={'frage':'Wie plane ich eine andere grössere Ausgabe?' if a else 'Wie nutze ich einen anderen Gegenstand länger?','ziel':ANK}
    h['prinzip_handoff']={'kernkonzept':CONCEPT[L],'lehrmittel_anker':f'Dossier | Info-Karten {L}-01 bis {L}-03','kn_aktivierung':'Rest und offene Verpflichtungen für einen neuen Fall ausrechnen.' if a else 'Nutzung ohne Neukauf auf einen neuen Gegenstand übertragen.','transfer_check':'Kann die lernende Person das Vorgehen mit anderen Kosten und Gegenständen anwenden?'}
    h['sk_anker']=[{'sk':1,'wo':'S. 3 — Angaben aus dem Fall im Raster mit der Info-Karte prüfen.'},{'sk':3,'wo':'S. 4–5 — zwei Wege prüfen und einen nächsten Schritt planen.'},{'sk':9,'wo':'S. 5 und 8 — spätere Geldfolgen beachten.' if a else 'S. 5 und 8 — Vorhandenes länger nutzen und bezahlbar handeln.'}]
    if a:
        h['spuren']['ohne_medien']['leitfragen'][0]['loesung']['befund']='Fallüberlegung: Ich habe 75 Franken frei. Für den Sofortkauf zu 120 fehlen 45 Franken.'
    H[L]=h; write('herausforderung_'+L+'.json',h); check()

# Dossier: eigene Wissensgrundlage, keine kopierten Quellentexte.
CITY='https://www.stadt-zuerich.ch/dam/web/de/bildung/volksschule/schulorganisation/schulkreise/schwamendingen/schulkreisel-mai-2026.pdf'
RATE='https://www.zh.ch/de/soziales/sozialhilfe/sozialhilfehandbuch/flexdata-definition/4-persoenliche-hilfe/4-2-zusammenarbeit-mit-institutionen-der-persoenlichen-hilfe/4-2-01-schuldenberatung-und-schuldensanierung.html'
BAFU='https://www.bafu.admin.ch/de/kreislaufwirtschaft'
TEXTIL='https://www.zh.ch/de/politik-staat/kanton/kantonale-verwaltung/beschaffung-einkaeufe/nachhaltige-beschaffung/beschaffungsleitlinien/textilien.html'
HELP='https://www.stadt-zuerich.ch/schuldenpraevention'
G=[
('budget','Budget','Ein Plan für Geld, das hereinkommt, und für geplante Ausgaben.','Ich plane meinen Monat.'),
('einnahmen','Einnahmen','Geld, das ich bekomme.','Mein Lohn ist eine Einnahme.'),
('nettolohn','Nettolohn','Der Lohn, den ich nach Abzügen ausbezahlt bekomme.','Im Fall bekomme ich 780 Franken.'),
('fixkosten','Fixkosten','Feste geplante Kosten, zum Beispiel eine vereinbarte Monatsrechnung.','Das Handyabo steht fest im Plan.'),
('veraenderbar','veränderbare Kosten','Ausgaben, deren Höhe ich im Alltag beeinflussen kann.','Ich gebe weniger für Freizeit aus.'),
('rest','Restbetrag','Geld, das nach den eingeplanten Posten noch frei ist.','Nach dem Rechnen bleiben 75 Franken.'),
('reserve','Reserve','Geld, das ich für unerwartete Kosten zurücklege.','Ich lege Geld für eine Panne zurück.'),
('sparbetrag','Sparbetrag','Geld, das ich für einen späteren Wunsch zurücklege.','Ich spare für Zubehör.'),
('rate','Rate','Ein Teil einer Zahlung. Weitere Teile folgen zu vereinbarten Terminen.','Im Fall zahle ich dreimal 44 Franken.'),
('schulden','Schulden','Geld, das ich einer anderen Person oder einer Firma noch bezahlen muss.','Nach der ersten Rate bleiben zwei Raten offen.'),
('aufpreis','Aufpreis','Zusätzliches Geld gegenüber dem günstigeren Angebot.','Die Raten kosten im Fall zusammen 12 Franken mehr.'),
('konsum','Konsum','Dinge oder Leistungen kaufen und nutzen.','Ich kaufe und nutze eine Jacke.'),
('reparatur','Reparatur','Etwas Kaputtes wieder nutzbar machen.','Der Verschluss wird ersetzt.'),
('secondhand','Secondhand','Ein Gegenstand, den schon jemand anderes genutzt hat.','Ich kaufe eine gebrauchte Jacke.'),
('material','Material','Der Stoff, aus dem ein Gegenstand besteht.','Die Jacke besteht aus einem Gewebe.'),
('herkunft','Herkunft','Der Ort, von dem ein Gegenstand oder sein Material kommt.','Auf einem Etikett steht das Herstellungsland.'),
('nutzung','Nutzung','Die Zeit und Art, wie ich einen Gegenstand gebrauche.','Ich trage die Jacke weiter.'),
('entsorgung','Entsorgung','Dinge abgeben, wenn sie nicht mehr nutzbar sind.','Ich prüfe die passende Sammelstelle.'),
('nachhaltig','nachhaltig','Mit Geld und natürlichen Grundlagen auch für später sorgfältig umgehen.','Ich nutze vorhandene Dinge länger.'),
('rohstoff','Rohstoff','Eine Grundlage aus der Natur für die Herstellung von Dingen.','Baumwolle ist ein Rohstoff.'),
('herstellung','Herstellung','Die Arbeit und Schritte, durch die ein Produkt entsteht.','Stoff nähen gehört zur Herstellung.'),
('mehrweg','Mehrweg','Einen Gegenstand mehrfach statt nur einmal nutzen.','Ich gebe ein Leihset nach der Nutzung zurück.'),
('gegenargument','Gegenargument','Ein Grund, der gegen eine Wahl spricht.','Die Wartezeit spricht gegen die Reparatur.'),
('prioritaet','Priorität','Das, was mir bei einer Wahl besonders wichtig ist.','Für mich ist wenig ausgeben besonders wichtig.'),
('risiko','Risiko','Etwas kann anders laufen als geplant und Probleme machen.','Ein weiterer Kauf kann den Rest aufbrauchen.')]
GD={t[1]:{'id':t[0],'begriff':t[1],'erklaerung_a2':t[2],'beispiel':t[3]} for t in G}
d=template('dossier')
d.update(id=O+'_dossier',modul='2.1',kompetenz_nr='2.1.1',topic_slug='budget_planen',erstellt_am=DATE,set_ref=O+'_set')
d['kopf']={'einheit_titel':'Budget planen','kompetenz_nr':'2.1.1','kompetenz_text':LB['kompetenzen'][0]['text'],'lebensbezug_nr':'2.1','lebensbezug_text':LB['text'],'thema_nr':'T2','thema_titel':T['titel'],'lehrjahr':1,'lehrgang':'EBA_2J','sprachniveau':'A2'}
d['einleitung']={'was_ist_das':'Hier finden Sie Wissen für Budget und Konsumwahl. Alle Preise in den Beispielen sind erfunden.','so_benutzt_du_es':['Suchen Sie die Info-Karte zur Leitfrage.','Lesen Sie den Text und das Beispiel.','Klären Sie unbekannte Wörter im Glossar.','Nutzen Sie die Angaben aus dem Fall.','Prüfen Sie Ihre Rechnung und Ihre Wahl.']}
contents=[
('Mein Geld für einen Monat','Ein Budget ordnet Einnahmen und geplante Ausgaben. Der Nettolohn ist der ausbezahlte Lohn nach Abzügen. Fixkosten sind feste geplante Rechnungen, etwa Handy und ÖV. Veränderbare Kosten hängen von meinen Entscheidungen ab, etwa Freizeit und Kleider. Klären Sie, welche Kosten die Eltern direkt bezahlen. Ziehen Sie diese nicht nochmals vom eigenen Lohn ab. Eine Reserve ist Geld für unerwartete Kosten. Ein Sparbetrag ist Geld für einen späteren Wunsch. Beides ist nicht mehr frei verfügbar.','Ein erfundener Fall: Die Eltern bezahlen die Krankenkasse direkt. Das ist keine zusätzliche Einnahme auf meinem Konto.',[CITY],['budget','nettolohn','fixkosten','veraenderbar','reserve']),
('So rechne ich mein Budget','Schreiben Sie zuerst alle Einnahmen auf. Addieren Sie dann die festen Kosten und die veränderbaren Kosten getrennt. Planen Sie auch Geld zum Zurücklegen. Rechnen Sie: Einnahmen minus Kosten minus zurückgelegtes Geld ergeben den freien Restbetrag. Prüfen Sie alle Posten, nicht nur die kleinen Wünsche. Ein negativer Rest zeigt eine Lücke im Plan. Dann braucht es weniger Ausgaben oder geklärte zusätzliche Einnahmen. Vergleichen Sie den Plan später mit den wirklichen Ausgaben.','Fallrechnung: 780 − 245 − 360 − 100 = 75 Franken. Für einen Sofortkauf zu 120 fehlen 45 Franken.',[CITY,'https://www.schulden-zh.ch/media/budgetvorlage-fuer-lernende.pdf'],['einnahmen','rest','sparbetrag']),
('Heute kaufen, später zahlen?','Eine Rate ist nur ein Teil der ganzen Zahlung. Weitere Raten folgen später. Rechnen Sie alle Raten und Gebühren zusammen. Vergleichen Sie diesen Gesamtpreis mit dem Sofortpreis. Tragen Sie jede Rate in den Plan des passenden Monats ein. Sonst ist das Geld vielleicht schon anders eingeplant. Auch zusätzliche Abos und viele kleine Käufe brauchen Platz im Budget. Eine Möglichkeit ist, zuerst zu sparen und später zu kaufen. Bei Geldproblemen hilft eine vertraute Person oder eine Fachstelle. Die Schuldenprävention Stadt Zürich bietet kostenlose, vertrauliche Auskünfte.','Fallangebot: dreimal 44 = 132 Franken, also 12 Franken Aufpreis gegenüber 120. Rest mit Rate: 75 − 44 = 31. Ansparen: dreimal 40 = 120. Rest beim Sparen: 35.',[RATE,HELP],['rate','schulden','aufpreis','risiko']),
('Länger nutzen statt schnell ersetzen','Konsum bedeutet Dinge oder Leistungen kaufen und nutzen. Bei Textilien entstehen Umweltwirkungen in mehreren Schritten: Rohstoff, Herstellung, Nutzung und Entsorgung. Rohstoffe sind Grundlagen aus der Natur. Reparieren macht einen kaputten Gegenstand wieder nutzbar. Secondhand bedeutet: Jemand hat den Gegenstand schon genutzt. Reparieren, Teilen und Weiterverwenden können die Nutzungsdauer verlängern. Vorhandene Dinge länger zu nutzen schont meist Rohstoffe. Für einen genauen Vergleich einzelner Angebote braucht es weitere Angaben.','Fallüberlegung: Der Stoff der Jacke ist gut. Ein neuer Verschluss ermöglicht die weitere Nutzung.',[BAFU,TEXTIL],['konsum','rohstoff','herstellung','nutzung','entsorgung','reparatur','secondhand']),
('Drei Angebote prüfen','Notieren Sie zu jedem Angebot Kosten, Nutzen und eine Grenze. Rechnen Sie den Preis vom verfügbaren Geld ab. Achten Sie auch auf Material, Herkunft und Zustand. Das Material ist der Stoff eines Gegenstands. Herkunft nennt einen Ort, etwa das Herstellungsland. Fehlende Angaben bleiben offen. Ein höherer Preis beweist keine bessere Umweltbilanz. Langlebigkeit und Reparierbarkeit brauchen passende Angaben. Eine genaue Nutzungsdauer oder Umweltzahl dürfen Sie nicht erfinden.','Fallvergleich: Reparatur kostet 35, Secondhand 60 und neu 120 Franken. Bei 90 Franken Kleidungsgeld bleiben 55, 30 oder −30 Franken.',[TEXTIL],['material','herkunft','rest']),
('Meine Wahl braucht einen Grund','Vergleichen Sie Bedarf, verfügbares Geld und längere Nutzung. Wählen Sie dann einen Weg mit einem passenden Grund. Nennen Sie auch einen Nachteil. So zeigen Sie eine eigene Priorität: Was ist Ihnen besonders wichtig? Ein Gegenargument spricht gegen Ihre Wahl. Prüfen Sie, wie Sie damit umgehen. Planen Sie einen nächsten Schritt mit Zeitpunkt. Eine bezahlbare Lösung kann Reparatur, Secondhand oder Teilen sein. Welche passt, hängt vom Fall ab.','Fallüberlegung: Ich spare mit der Reparatur Geld und Material. Dafür warte ich sieben Tage. Heute frage ich nach einer geliehenen Jacke für die Wartezeit.',[BAFU],['prioritaet','gegenargument','nachhaltig'])]
d['nuggets']=[]
for i,(title,content,example,urls,refs) in enumerate(contents):
    L='A' if i<3 else 'B'; n=i%3+1
    d['nuggets'].append({'id':f'nugget_{L}_0{n}','tag':L,'titel':title,'inhalt':content,'beispiel':example,'fuer_leitfrage':[n],'fakten_anker':[{'behauptung':'Budget und Kostenträger prüfen.' if i<2 else 'Spätere Zahlung und Unterstützung beachten.' if i==2 else 'Nutzung und prüfbare Produktangaben beachten.','wert':'F1–F3' if i<2 else 'F4–F5' if i==2 else 'F6–F8','quelle':u+' · Abruf '+DATE,'validiert':True,'lp_pruefen':False} for u in urls],'glossar_refs':refs,'recherche':{'suchbegriffe':['Budget Lernende','Kosten Eltern'] if L=='A' else ['Textilien länger nutzen','Reparatur Secondhand'],'selbst_pruefen':'Prüfen Sie: Sind die Angaben im Fall vorhanden? Welche Aussage bleibt offen?'}})
d['sprachmodi_scaffolds']=[]
for L in 'AB':
    d['sprachmodi_scaffolds'].append({'tag':L,'sm_id':'SM3' if L=='A' else 'SM4','modus_label':SM3 if L=='A' else SM4,'satzanfaenge':['Ich finde die Angabe …','Für meinen Plan heisst das …','Ich prüfe noch …'] if L=='A' else ['Ich wähle …','Mein Gegenargument ist …','Als Nächstes mache ich …'],'strategien':['Lesen Sie zuerst die Titel.','Markieren Sie wichtige Angaben.','Erklären Sie das Ergebnis selbst.'] if L=='A' else ['Planen Sie mit Stichworten.','Sprechen Sie langsam und klar.','Nennen Sie einen Grund und einen Nachteil.'],'struktur':['Angabe finden','Mit dem Plan verbinden'] if L=='A' else ['Wahl und Grund','Nachteil und nächster Schritt'],'so_gehst_du_vor':['Lesen Sie die passende Info-Karte.','Nutzen Sie das Glossar.','Notieren Sie nur passende Angaben.','Prüfen Sie das Ergebnis am Fall.','Verbessern Sie Ihr Produkt.']})
d['transfer_wissensblatt']={'fachsystematik':'Zuerst Geld und Bedarf klären. Dann alle Kosten und spätere Zahlungen prüfen. Wege zur längeren Nutzung vergleichen. Eine Wahl mit Grund und Nachteil treffen. Den nächsten Schritt planen.','prinzip_in_einfach':'Prüfen Sie Ihr Geld, bevor Sie wählen. Denken Sie auch an spätere Zahlungen. Prüfen Sie eine Möglichkeit zur längeren Nutzung.'}
d['glossar']=list(GD.values())
d['leseblatt']={'titel':'Geld einteilen und Dinge nutzen','einleitung':'Lesen Sie die Texte. Beantworten Sie danach die Fragen.','gesamttext_quelle':'nuggets','richtig_falsch':[{'text':t,'loesung':v} for t,v in [('Fixkosten sind feste geplante Rechnungen.',True),('Eine Rate zeigt immer den ganzen Kaufpreis.',False),('Zurückgelegtes Geld ist noch frei für weitere Käufe.',False),('Reparieren kann die Nutzungsdauer verlängern.',True),('Ein hoher Preis beweist eine bessere Umweltbilanz.',False)]],'w_fragen':['Welche Kosten bezahlen die Eltern direkt? Was müssen Sie deshalb im Budget beachten?','Wie prüfen Sie den Gesamtpreis eines Ratenangebots?','Welche Angaben vergleichen Sie vor einer Konsumwahl?'],'vokabeln':['budget','fixkosten','rate','reparatur','secondhand','rest']}
write('dossier.json',d)

s=template('set')
s.update(id=O+'_set',modul='2.1',modul_titel=MOD,einheit_titel='Budget planen',thema='T2',prinzip_ref=O+'_prinzip',kn_ref=O+'_kn',herausforderungen=[O+'_hf_A',O+'_hf_B'])
s['wochenplan']=[{'woche':1,'lektionen':3,'inhalt':'Heft A: Budget und Zahlungsrisiken'},{'woche':2,'lektionen':3,'inhalt':'Heft B: bezahlbare Konsumwahl'},{'woche':3,'lektionen':3,'inhalt':'Freiwilliger gemeinsamer Auftrag oder Übung/Puffer; KN nach Vorbereitung'}]
s['konzept_progression']=[{'position':i+1,'herausforderung':O+'_hf_'+L,'konzept':CONCEPT[L]} for i,L in enumerate('AB')]
s['glossar']=[]
for L in 'AB':
    for term in sum([x['punkte'] for x in H[L]['mindmap_aeste']],[]): s['glossar'].append({'begriff':term,'definition':GD[term]['erklaerung_a2'],'herkunft':'dossier','heft':L})
    for term in H[L]['abschluss']['loesung']['eigene_knoten']['ohne_medien']: s['glossar'].append({'begriff':term,'definition':GD[term]['erklaerung_a2'],'herkunft':'dossier','heft':L,'spur':'ohne_medien'})
ga=s['gemeinsamer_auftrag']; ga.update(titel='Unser Klassenstand braucht Becher',lebensbereich=pr['auftrag_lebensbereich'],persona=PERSON,woerter=[{'begriff':b,'definition':GD[b]['erklaerung_a2']} for b in ['Budget','Restbetrag','Mehrweg']]+[{'begriff':'leihen','definition':'Etwas gegen Geld nutzen und danach zurückgeben.'},{'begriff':'Rückgabe','definition':'Den geliehenen Gegenstand wieder abgeben.'}])
ga['woerter'][0]['definition']='Ein Plan für Einnahmen und Ausgaben.'
ga['woerter'][1]['definition']='Geld nach allen eingeplanten Posten.'
ga['situation_text']='Ich plane mit einer anderen Person die Becher für unseren Klassenstand. Wir haben dafür 100 Franken. Andere nötige Ausgaben kosten 45 Franken. Ein Mehrweg-Leihset kostet insgesamt 30 Franken, mit Reinigung und Rückgabe. Es gibt kein Depot und keine Zusatzgebühr. Wir geben es am nächsten Schultag zurück. Ein eigenes Mehrwegset kostet 70 Franken. Beide Sets reichen für unseren Bedarf. Die andere Person möchte das eigene Set für später behalten. Einen weiteren Anlass haben wir noch nicht geplant. Zusätzliche Einnahmen sind nicht zugesagt.'
ga['situation_text']='Ich plane zu zweit die Becher für unseren Klassenstand. Wir haben 100 Franken, andere nötige Ausgaben kosten 45 Franken. Ein Mehrweg-Leihset kostet 30 Franken, mit Reinigung und Rückgabe am nächsten Schultag. Weitere Kosten gibt es nicht. Ein eigenes Mehrwegset kostet 70 Franken. Beide Sets reichen. Die andere Person will ein eigenes Set für später. Ein weiterer Anlass und zusätzliche Einnahmen sind nicht zugesagt.'
ga['zahlen_tabelle']=[{'label':x,'wert':y} for x,y in [('Geld für diesen Teil','CHF 100'),('Andere nötige Ausgaben','CHF 45'),('Leihset, alles enthalten','CHF 30'),('Eigenes Set kaufen','CHF 70')]]
ga['leitfrage']='Wie decken wir unseren Bedarf und schützen das gemeinsame Geld auch für später?'
ga['mehrdeutigkeit']={'trade_off':TR[2],'hint':'Prüfen Sie Geld und spätere Nutzung. Begründen Sie Ihre Wahl und nennen Sie einen Nachteil.'}
ga.update(aktivierte_trade_offs=TR[:2],sprachmodi=[SM5,SM7],auftrag='Nutzen Sie Heft A und Heft B für eine Beschlussnotiz und ein Einigungsgespräch.')
ga['schritte']=[{'label':l,'hint':h} for l,h in [('01 Rest prüfen','Planen Sie zuerst allein. Nutzen Sie die Budgetrechnung aus Heft A (S. 3).'),('02 Nutzung vergleichen','Nutzen Sie den Vergleich aus Heft B (S. 3). Notieren Sie für beide Wege Kosten, Nutzen und eine Grenze.'),('03 Beschlussnotiz','Schreiben Sie zu zweit 4–5 Sätze: Kosten, Wahl, Nachteil, Bedingung und Aufgabe je Person.'),('04 Einigungsgespräch','Planen Sie Ihren eigenen Beitrag. Sprechen Sie zu zweit über Vorschlag, Einwand und Vereinbarung. Wechseln Sie die Rollen.'),('05 Prüfen und verbessern','Prüfen Sie beide Produkte mit den vier Kriterien auf A4. Jede Person schätzt sich selbst ein.')]]
ga['schritte'][2]['hint']='Schreiben Sie auf A2 zu zweit 4–5 Sätze: Kosten, Wahl, Nachteil, Bedingung und Aufgabe je Person.'
ga['schritte'][3]['hint']='Planen Sie auf A3 Ihren Beitrag. Besprechen Sie zu zweit Vorschlag, Einwand und Vereinbarung. Wechseln Sie die Rollen.'
ga['schritte'][4]['hint']='Prüfen Sie auf A4 beide Produkte. Wie ändert sich Ihr Plan bei 10 Franken neuen Kosten? Jede Person schätzt sich selbst ein.'
ga['abgaben']=['Eine gemeinsame Beschlussnotiz mit 4–5 Sätzen','Ein Gespräch mit Rollenwechsel und eigenen Stichworten','Eine eigene Selbsteinschätzung auf A4']
ga['produkte']=[{'schritt':3,'form':'flaeche','modus':SM5},{'schritt':4,'form':'spur','modus':SM7,'stationen':['Mein Vorschlag mit Kosten','Mein Einwand und meine Antwort','Unsere Vereinbarung und mein Anteil'],'hinweis':'Notieren Sie Stichworte für Ihren Beitrag. Führen Sie das Gespräch zu zweit. Wechseln Sie danach die Rollen.','dauer':'2–3 Minuten je Rollenlauf'}]
ga['heft_bezug']=[{'heft':L,'titel':TIT[L],'inhalte':(['Budgetrechnung im Raster (S. 3)','Produkt und Beispiel (S. 5)','Wichtige Wörter (S. 2)'] if L=='A' else ['Angebotsvergleich im Raster (S. 3)','Wahl und Denkhilfe (S. 4)','Wichtige Wörter (S. 2)'])} for L in 'AB']
ind=['Beschluss und Gespräch nennen passende Kostenbegriffe und verständliche Angaben.','Gründe und Gegenargumente verbinden Kosten und Nutzung.','Der Rest von 25 und die fehlenden 15 beim Kauf sind richtig berücksichtigt.','Jede Person erklärt ihre Priorität und einen Nachteil der gemeinsamen Wahl.']
ga['feedback_kriterien']=[feedback(i,x) for i,x in enumerate(ind)]
ga['kontext_ausschluss']=['Gaming-Headset (Heft A)','Regenjacke (Heft B)','Pavillon, Quartierfest (KN)']
ga['erwartungshorizont']={'gut_wenn':['Rest und beide Wege sind richtig gerechnet.','Beschluss enthält Wahl, Nachteil und Aufgaben je Person.','Beide Personen bringen Grund, Einwand und Antwort ins Gespräch ein.'],'tragfaehig':'Fallüberlegung: Nach nötigen Ausgaben bleiben 55 Franken. Wir leihen. 100 − 45 − 30 = 25 Rest. Kaufen lässt −15. Wir nutzen das Leihset mehrfach und geben es zurück. Person 1 holt es, Person 2 organisiert die Rückgabe. Nachteil: kein eigenes Set. Einen Kauf prüfen wir erst mit geklärter Finanzierung und weiterem Bedarf.','nicht_tragfaehig':'Kaufen ohne Deckung oder nur eine Person sprechen lassen. Der Besitz allein belegt keine bessere Umweltwirkung.'}
ga['erwartungshorizont']['tragfaehig']+=' Fallüberlegung zur neuen Belastung: 25 − 10 = 15 Rest beim Leihen.'
write('set.json',s); check()

def mark(path,fmt=''): return '<!--hko:'+path+('|' + fmt if fmt else '')+'-->\n<!--/hko-->' if fmt else '<!--hko:'+path+'--><!--/hko-->'
md=f'''---
titel: "Begleit-Dokument — Budget planen (2.1)"
untertitel: "Zwei EBA-Hefte, Dossier, gemeinsamer Auftrag und Kompetenznachweis"
kompetenz: "2.1 — {PROM}"
autor: "Kernteam 1 — BBW Winterthur"
stand: "{DATE}"
version: "2.1.0"
lehrgang: "EBA 2J"
thema: "T2 — {T['titel']}"
lebensbezug: "2.1"
quellen_json: ["set.json", "prinzip.json", "herausforderung_A.json", "herausforderung_B.json", "kn.json", "dossier.json"]
---

# Begleitung — Budget planen

## 0. So funktioniert diese Einheit

Die Lernenden rechnen an einem vollständig erfundenen Fall. Niemand muss private Geldbeträge offenlegen. Drei Leitfragen führen jeweils vom Wissen über ein Raster zu einer begründeten Wahl. Das Dossier enthält das nötige Wissen; ein Lehrmittel ist nicht vorausgesetzt. Ein Begriffsnetz wird technisch mitgeführt, aber nicht als Aufgabe gedruckt.

**Versprechen:** {mark('kn.kern_kompetenzversprechen')}

**Prinzip:** {mark('prinzip.dekontextualisierungs_anker.anker_statement')}

**Lebensbezug:** {mark('hf_A.nrlp.lebensbezug_text')}

## 1. Überblick

**A, Kompetenz 2.1.1:** {mark('hf_A.nrlp.kompetenz_text')}

**B, Kompetenz 2.1.2:** {mark('hf_B.nrlp.kompetenz_text')}

| Teil | Modus | SK | Produkt |
|---|---|---|---|
| Heft A | {mark('prinzip.modi_pro_heft.A[0]')} | 1, 3, 9 | {mark('hf_A.handlungsprodukt.titel')} |
| Heft B | {mark('prinzip.modi_pro_heft.B[0]')} | 1, 3, 9 | {mark('hf_B.handlungsprodukt.titel')} |
| Auftrag | Schreiben und mündlich aushandeln | 1, 3, 9 | Beschlussnotiz und Einigungsgespräch |
| KN | Fall lesen, erklären, besprechen oder schriftlich bearbeiten | 1, 3, 9 | Kurzgespräch, Mini Case oder Werkschau |

SK 1 trennt gegebene Angaben und Vermutungen. SK 3 entwickelt passende Lösungen. SK 9 hält finanzielle Folgen und längere Nutzung zusammen. Alle drei stammen aus Thema 2. Wirtschaft ist der dominante Aspekt, Ökologie der zweite; beide werden erstmals auf R1 bearbeitet.

A übt Fachkorrektheit und wirtschaftliches Prinzip. B übt Argumentation und Position/Werthaltung. Im KN und im Auftrag gelten alle vier Kriterien. Die Ich-Fassungen erklären denselben Massstab. Nur der KN wird benotet.

## 2. Durchführung

Plane als Vorschlag drei Wochen: zuerst A, dann B, danach Übung, freiwilliger Auftrag und KN. Der Lehrplan weist dem ganzen Thema 22 Lektionen zu, aber kein eigenes Kontingent für diesen Lebensbezug. Passe den Vorschlag an deine Klasse an. Das Kurzgespräch braucht pro Person 5–10 Minuten, daher für eine ganze Klasse gestaffelte Termine. Zwei Partnerdurchgänge beim Auftrag brauchen je 2–3 Minuten. Lege vor der Produktion fest, ob Papier oder Laptop genutzt wird.

| S. | Inhalt | Lernende tun |
|---|---|---|
| 1 | Situation | lesen und Angaben markieren |
| 2 | Leitfrage 1 | Info-Karte und Wichtige Wörter nutzen |
| 3 | Leitfrage 2 | Beispiel lesen, zwei Rasterzeilen füllen, Ergebnis schreiben |
| 4 | Leitfrage 3 | Denkhilfe, dann Wahl mit Grund |
| 5 | Auftrag und Beispiel | eigenes Produkt erstellen oder planen |
| 6 | Methoden | bei Bedarf nachschlagen |
| 7 | Prüfen | Kriterien ankreuzen und verbessern; Plus freiwillig |
| 8 | Abschluss | Quer-Check beantworten, Mitnahme und Checkliste |

**Genehmigte Lehrplanlücke SM2:** Kompetenz 2.1.1 und das offizielle Umsetzungsbeispiel verlangen audiovisuelle Rezeption. Diese Einheit ersetzt sie mit ausdrücklicher Freigabe vom 03.11.2026 durch schriftliche Dossierarbeit (SM3). Lesen weist Videoverstehen nicht nach. B führt SM4; schriftliches Lesen am Raster ist dort nur geübt.

**Freiwillige Ergänzung für dich:** Suche einen kurzen, frei zugänglichen Erklärclip zu Budget, Ausgaben und Schuldenfallen für Lernende. Prüfe ihn selbst auf aktuelle Schweizer Angaben, A2-Verständlichkeit und vollständigen Zugang ohne Konto. Lass die Lernenden mit drei Beobachtungsfragen arbeiten: Welche Ausgaben nennt der Clip? Welche Schuldenrisiken zeigt er? Welcher Tipp hilft bei unserem Budget? Danach übertragen sie einen Tipp ins Budget. Es wurde hier kein Clip geprüft; deshalb gibt es keinen Video-Link und keinen behaupteten Mediennachweis. Ausgangspunkt ist das offizielle Beispiel `eba__2.1.1__4` im lokalen Umsetzungsindex.

'''
for i,L in enumerate('AB'):
    a=L=='A'; root='hf_'+L
    md+=f'## {i+3}. Herausforderung {L} — {LAB[L]}\n\n'
    md+='**Titel:** '+mark(root+'.titel')+'\n\n**Situation:**\n\n'+mark(root+'.situation_text','quote')+'\n\n'
    md+='**Leitfrage:** '+mark(root+'.leitfrage')+'\n\n**Spannung:** '+mark(root+'.mehrdeutigkeit.trade_off')+'\n\n'
    md+='### Produkt\n\n'+mark(root+'.handlungsprodukt.titel')+'\n\n'+mark(root+'.handlungsprodukt.format_detail')+'\n\n'
    for j in range(5): md+=mark(root+f'.handlungsprodukt.schritte[{j}].label')+' — '+mark(root+f'.handlungsprodukt.schritte[{j}].hint')+'\n\n'
    md+='**Abgaben:**\n\n'+mark(root+'.handlungsprodukt.abgaben','liste')+'\n\n### Hinweise je Seite\n\n'
    desc=(['S. 1: Lass alle Posten finden. Krankenkasse und Gesundheitskosten bezahlen im Fall die Eltern direkt. Das ist keine allgemeine Regel für Familien. 780 Franken ist ein plausibler erfundener Nettolohn, kein Mindestlohn und kein Durchschnittswert.','S. 2: Frage nach je einem Beispiel für Fixkosten und veränderbare Kosten. Die Reserve gehört nicht nochmals in den freien Rest.','S. 3: Lass die zwei Gruppenrechnungen und den Rest am Fall kontrollieren. Die erste Rasterzeile ist ausgefüllt, zwei Zeilen werden selbst bearbeitet. Frage: Welcher Posten fehlt noch?','S. 4: Der Sofortkauf passt ohne Änderung nicht. Raten und Ansparen sind begründbar, kosten aber verschieden viel. Stelle neben die Monatsrate immer den Gesamtpreis.','S. 5: Das andere Beispiel zeigt die Form, nicht die Lösung des Heftfalls. Im eigenen Budget müssen alle Einzelposten sichtbar sein. Zwei Risiken mit Massnahmen gehören zur Abgabe.','S. 6: Nutze die vier A2-Karten gezielt. Die klare Frage richtet sich an Kostenträger, ohne private Angaben im Unterricht zu verlangen.','S. 7: Zwei Kriterien prüfen. Die höchste Stufe beim wirtschaftlichen Prinzip braucht die neue zusätzliche Monatsrate aus Schritt 05. Lass diese Rechnung sichtbar notieren.','S. 8: Beide Fragen beantworten, nicht nur ankreuzen. Auf dem Ratenweg bleiben nach der zusätzlichen Belastung nur 11 Franken. Das ist ein Transfer, kein zusätzlicher Weltfakt.'] if a else ['S. 1: Prüfe den Bedarf: Regen diese Woche, Reparatur erst später. Angebote und Zustand sind gegeben, keine Internetrecherche nötig.','S. 2: Frage, wie vorhandenes Material weiter nutzbar bleibt. Herkunft oder Preis allein beweisen keine bessere Umweltbilanz.','S. 3: Reparatur und Secondhand passen zum Geld. Die dritte Rasterzeile macht die fehlende Deckung beim Neukauf sichtbar. Unbekannte Angaben bleiben offen.','S. 4: Beide bezahlbaren Wege haben einen Nachteil. Frage nach einer Übergangslösung statt eine moralisch richtige Antwort zu verlangen.','S. 5: Lass einen Stichwortzettel planen. Die Erklärung muss tatsächlich gesprochen werden; ein fertig geschriebener Text reicht nicht als mündliche Leistung.','S. 6: Die A2-Methoden helfen beim Erklären von Fakten und Vorlieben sowie beim Gegenüberstellen der Wege.','S. 7: Paare hören sich die Erklärung nacheinander an. Eine Person erklärt, die andere meldet zwei Kriterien zurück; dann wechseln sie. Eine Aufnahme ist nicht nötig.','S. 8: Prüfe den Geldrest beider Wege und den nächsten Schritt mit Zeitpunkt. Die Abgabe bereitet die mündliche Form des KN vor.'])
    md+='\n\n'.join(desc)+'\n\n'
    md+='### Coaching und Stolpersteine\n\n'
    md+=('Zu Leitfrage 1: «Welche Rechnung steht fest?» Zu Leitfrage 2: «Haben Sie zurückgelegtes Geld schon abgezogen?» Zu Leitfrage 3: «Wie viel bezahlen Sie insgesamt?» Typischer Fehler: nur die erste Rate sehen. Gib eine leere Dreimonatszeile als mündliche Stütze und lass jede Rate einsetzen.\n\n' if a else 'Zu Leitfrage 1: «Was bleibt nach der Reparatur nutzbar?» Zu Leitfrage 2: «Welcher Betrag fehlt?» Zu Leitfrage 3: «Was spricht gegen Ihre Wahl?» Typischer Fehler: teuer mit nachhaltig gleichsetzen. Verlange eine konkrete Angebotsangabe und markiere fehlende Belege als offen.\n\n')
    md+='Das Heft hat nur die Variante ohne Medien. Falls der eingespiegelte Lösungsblock von «beiden Spuren» spricht, bedeutet das hier «in dieser Variante».\n\n'
    md+=f'### Tafelbild — Begriffsnetz Heft {L}\n\n> [!tafelbild] Freiwillig für dich, an der Wandtafel — nicht im Heft\n> '+('Einnahmen → Kosten und Zurücklegen → Rest → Wahl → spätere Zahlung.' if a else 'Bedarf → vorhandenes Material → Reparatur oder Secondhand → Kosten und Nutzen → nächster Schritt.')+'\n\n'
    md+='### Wann ist das Heft fertig? (Selbstcheck — formativ, nicht benotet)\n\n'
    for j in range(4): md+=mark(root+f'.bewertungsraster[{j}].produkt')+'\n\n'+mark(root+f'.bewertungsraster[{j}].vollstaendig_wenn','checkliste')+'\n\n'
md+='''## 5. Differenzierung und Dossier

Sechs Info-Karten decken die drei Leitfragen beider Hefte ab. Lass bei Bedarf zuerst das Leseblatt bearbeiten. Satzanfänge, drei kurze Strategien und die Beispielzeile sind Stützen; das freiwillige Plus verlangt keinen privaten Lohnzettel. Die Dossierbegriffe erklären auch Wörter wie Aufpreis und Gegenargument.

Fachbasis sind amtliche Informationen von Stadt und Kanton Zürich sowie BAFU; URLs und Abrufdatum stehen in den Faktenankern des Dossiers. Die Schuldenberatungs-Vorlage ergänzt das Rechenverfahren. Für konkrete Angebote liegen keine gemessenen Umweltwerte vor. Begründe deshalb mit den gegebenen Angaben und kennzeichne Annahmen. Kein Lehrmittel und keine Medienkarte sind Voraussetzung.

## 6. Gemeinsamer Auftrag — Unser Klassenstand braucht Becher

> [!hinweis] Freiwillig für dich
> Der gemeinsame Auftrag ist ein Angebot. Du entscheidest, ob er in deiner Klasse passt.
> Ohne ihn folgt der KN direkt nach Heft B. Woche 3 dient zum Üben und als Puffer.

Die Berufsfachschule bildet einen neuen Lebensbereich. Budgetrechnung aus A und Nutzungsvergleich aus B sind beide erforderlich. A1 erklärt wichtige Wörter vor der Situation. Der Heft-Bezug steht auf A2; Wörter findest du immer unter «Wichtige Wörter (S. 2)».

'''
md+=mark('set.gemeinsamer_auftrag.situation_text','quote')+'\n\n'
for j in range(5): md+=mark(f'set.gemeinsamer_auftrag.schritte[{j}].label')+' — '+mark(f'set.gemeinsamer_auftrag.schritte[{j}].hint')+'\n\n'
md+='''### Beschluss und Gespräch organisieren

Zuerst plant jede Person einzeln. Danach arbeiten ausschliesslich Zweiergruppen. Auf A2 schreiben sie die Beschlussnotiz, auf A3 planen sie ihren eigenen Gesprächsanteil. Beide bringen einen Vorschlag, Einwand und eine Antwort ein. Danach Rollenwechsel. Pro Rollenlauf sind 2–3 Minuten vorgesehen. Abgegeben werden Notiz, Gespräch mit eigenen Stichworten und individuelle Selbsteinschätzung. Kein Gruppenpuzzle, kein Upload.

### Erwartungshorizont

'''+mark('set.gemeinsamer_auftrag.erwartungshorizont.tragfaehig')+'\n\n'+mark('set.gemeinsamer_auftrag.erwartungshorizont.nicht_tragfaehig')+'\n\n'
md+='''## 7. Kohärenz

Der Weg ist Kategorien verstehen → Angaben rechnen oder vergleichen → Wahl begründen → Produkt herstellen → prüfen. A liefert den Geldrest, B die längere Nutzung und die begründete mündliche Erklärung. Der Auftrag ergänzt schriftlichen Beschluss und mündliches Aushandeln. Der KN überträgt beide Konzepte auf Engagement im Quartier. Die reservierten Gegenstände erscheinen nicht in den Übungsfällen. Die audiovisuelle Lücke ist in §2 offen ausgewiesen und wird nicht als erfüllt bewertet.

## 8. Kompetenznachweis

'''+mark('kn.hybrid_situation.text','quote')+'\n\n'
for i,typ in enumerate(kn['kn_typen']):
    md+='**'+mark(f'kn.kn_typen[{i}].label')+'** — '+mark(f'kn.kn_typen[{i}].format')+'\n\n'+mark(f'kn.kn_typen[{i}].ablauf','liste')+'\n\n'
md+='''### Erwartungshorizont für die Lehrperson

Fallrechnung: Nach anderen Ausgaben sind 120 Franken verfügbar. Mieten lässt 50. Nach der ersten Kaufrate bleiben ebenfalls 50, aber weitere 140 sind offen. Ein Sofortkauf lässt eine Lücke von 90. Zusätzliche Einnahmen sind nicht zugesagt. Eine weitere Belastung von 20 lässt beim Mietweg 30 übrig. Kaufen ist nur mit geklärter späterer Deckung tragfähig. Ein gutes Argument bezieht Nutzung und spätere Termine ein, ohne aus Besitz allein einen Umweltvorteil abzuleiten. Diese Fallüberlegungen sind keine Rechtsprüfung des Ratenangebots.

Dossier und Hefte sind erlaubt, Internet nicht. Lass für das Kurzgespräch Stichworte auf den Seiten 2 und 3 vorbereiten. Plane Gespräche gestaffelt oder wähle für einen gemeinsamen Termin die schriftliche Alternative. Werkschau: zwei Heftprodukte verfügbar halten, Werkwahl in zwei Sätzen, Reflexion 120–150 Wörter.

### Von der Lehrperson bereitzustellen

Dossier, beide Hefte, passendes KN-Blatt, Papier oder Laptop für die Produkte und ein einfacher Taschenrechner genügen. Sage Papier oder Laptop vor der Produktphase an. Keine Originalrechnungen, privaten Konten oder bezahlten Dienste nötig.

### Auftragsbogen und KN: gleicher Massstab

A4 nutzt «Punkte · Kriterium · Ich · Partner/in». Heft, Auftrag und KN enthalten einfache Ich-Fassungen. Bewertet wird derselbe KN-Massstab; die Formulierung für Lernende ändert ihn nicht. Die höchste wirtschaftliche Stufe ist durch die zusätzliche Belastung erreichbar. B zeigt für Argumentation ausdrücklich ein Gegenargument und eine Folge. Niveaubänder werden in einfacher Sie-Form erklärt.

'''
for i in range(4):
    md+='**'+mark(f'kn.rubrik_shared.kriterien[{i}].name')+'**\n\n'+mark(f'kn.rubrik_shared.kriterien[{i}].stufen','liste')+'\n\n'
(OUT/'begleiter.md').write_text(md,encoding='utf-8')
subprocess.run(['node','.claude/skills/bbw-hko-heft-v42/scripts/begleiter-marker.mjs',O],cwd=ROOT,check=True)
print('Phase 8 geschrieben')

ARCH=Path('D:/OS/_lab/quellen-archiv/bbw-hko/_pruefung')/O
ARCH.mkdir(parents=True,exist_ok=True)
def archive(name,data): (ARCH/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
FA=[('Nettolohn pro Monat',780,''),('Beitrag zu Hause',120,''),('Handy',30,''),('ÖV',80,''),('Streaming',15,''),('Feste Kosten',245,'120 + 30 + 80 + 15'),('Verpflegung auswärts',140,''),('Freizeit',110,''),('Kleider',60,''),('Körperpflege',40,''),('Schulmaterial',10,''),('Veränderbare Kosten',360,'140 + 110 + 60 + 40 + 10'),('Zurückgelegt',100,''),('Rest vor Kauf',75,'780 − 245 − 360 − 100'),('Sofortpreis Headset',120,''),('Monatliche Headsetrate',44,''),('Gesamtpreis Ratenangebot',132,'3 × 44'),('Aufpreis Ratenangebot',12,'132 − 120'),('Rest mit Raten',31,'75 − 44'),('Sparbetrag für Headset',40,'120 : 3'),('Rest beim Ansparen',35,'75 − 40'),('Fehlbetrag Sofortkauf',45,'120 − 75'),('Neue Monatsrate',20,''),('Rest nach neuer Monatsrate',11,'31 − 20')]
FB=[('Kleidungsgeld',90,''),('Reparatur',35,''),('Secondhand',60,''),('Neue Jacke',120,''),('Restbetrag Reparatur',55,'90 − 35'),('Restbetrag Secondhand',30,'90 − 60'),('Fehlbetrag Neukauf',30,'120 − 90')]
FC=[('Geld für diesen Teil',100,''),('Andere nötige Ausgaben',45,''),('Leihset, alles enthalten',30,''),('Eigenes Set kaufen',70,''),('Verfügbar nach nötigen Ausgaben',55,'100 − 45'),('Rest nach Leihen',25,'100 − 45 − 30'),('Fehlbetrag Kaufen',15,'70 − 55'),('Neue Kosten',10,''),('Rest nach neuen Kosten',15,'25 − 10')]
for L,items in [('A',FA),('B',FB),('auftrag',FC)]:
    block={'zahlen':[dict(name=n,wert=v,einheit='CHF',**({'abgeleitet_aus':expr} if expr else {})) for n,v,expr in items],'ausgeschlossen':[],'geschrieben_am':DATE,'von':{'rolle':'Implementation / Fallautor '+L,'modell':'gpt-6.1-sol'}}
    if L=='A': block['zahlen'].append({'name':'Anzahl Headsetraten','wert':3,'einheit':'Monate','schreibweisen':['dreimal','drei Monaten']})
    if L=='B': block['zahlen'].append({'name':'Dauer Reparatur','wert':7,'einheit':'Tage','schreibweisen':['sieben Tage']})
    archive('fall.'+L+'.json',block)
