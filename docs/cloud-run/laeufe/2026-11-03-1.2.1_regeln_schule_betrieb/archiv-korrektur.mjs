import fs from 'node:fs';
import {loesungsfelder} from '../../../../scripts/lib/loesungsfelder.mjs';
import {ladeEinheit,textfelder} from '../../../../scripts/lib/pruefung.mjs';
const slug='1.2.1_regeln_schule_betrieb',base='src/data/einheiten/'+slug,ar='D:/OS/_lab/quellen-archiv/bbw-hko/_pruefung/'+slug;
const read=n=>JSON.parse(fs.readFileSync(base+'/'+n+'.json','utf8')),save=(n,v)=>fs.writeFileSync(base+'/'+n+'.json',JSON.stringify(v,null,2)+'\n');
const s=read('set');s.gemeinsamer_auftrag.produkte[0].hinweis='Schreiben Sie zu jeder Station kurze Stichworte. Begründen Sie Ihren Vorschlag.';save('set',s);
const a=read('herausforderung_A');a.handlungsprodukt.loesungsbild.bloecke[0].zeilen[1].zellen[1]='Aufnahmen nur mit Genehmigung (§ 10)';a.handlungsprodukt.loesungsbild.bloecke[1].eintraege[0].text='Ich habe das Foto weder aufgenommen noch verschickt. Ich respektiere die Regeln zu Aufnahmen.';save('herausforderung_A',a);
const b=read('herausforderung_B');b.handlungsprodukt.loesungsbild.bloecke[0].zeilen[2].zellen[1]='Rückkehr war zu spät; Pausenregel beachten';b.spuren.ohne_medien.leitfragen[1].loesung.erwartungshorizont.gut_wenn[1]='Der Unterschied zwischen dauerhaftem Verschweigen des Ärgers und einem ruhigen Vier-Augen-Gespräch ist erkannt.';save('herausforderung_B',b);
const d=read('dossier');let old=JSON.parse(fs.readFileSync(ar+'/belege.json','utf8'));
old.zeilen=loesungsfelder(base).felder.map(f=>{
 const z=old.zeilen.find(z=>z.feld===f.feld)||{feld:f.feld,spur:f.spur,herkunft:'fallueberlegung',anker:'',wo:'',stelle:'',urteil:'stimmt'};
 z.hash=f.hash;z.geprueft_am='2026-11-03';z.von={rolle:'Korrektur-Selbstprüfung; nicht unabhängig',modell:'gpt-6.1-sol'};
 if(z.herkunft==='dossier') {
  let id=z.stelle;
  if(f.feld.includes('herausforderung_A')&& /zeilen\[(1|3)\]/.test(f.feld))id='nugget_A_02';
  if(f.feld.includes('herausforderung_B')&&f.feld.includes('zeilen[3]'))id='nugget_B_02';
  z.stelle=id;z.anker=d.nuggets.find(n=>n.id===id).inhalt.split('. ').slice(0,2).join('. ');
 }
 z.bemerkung='Nach Gegenlesung an korrigierten Info-Karten, lokalem Reglement und Fall neu geprüft. Fallüberlegungen sind mögliche Antworten, keine zusätzlichen Rechtsregeln.';
 return z;
});fs.writeFileSync(ar+'/belege.json',JSON.stringify(old,null,2)+'\n');
const E=ladeEinheit(process.cwd(),slug),fields=textfelder(E,{dossier:true});
const listed=fs.readFileSync('docs/cloud-run/laeufe/2026-11-03-1.2.1_regeln_schule_betrieb/fakten-liste-nach-korrektur.txt','utf16le');
const names=[...new Set([...listed.matchAll(/^  (?:artikel|frist|betrag|datum) +(.+)$/gm)].map(m=>m[1].trim()))];
const zh='https://www.zh.ch/de/politik-staat/gesetze-beschluesse/gesetzessammlung/zhlex-ls/erlass-413_322-2015_03_05-2015_08_01.html';
const facts={format:'bbw-hko/fakten@1',einheit:slug,zeilen:names.map(name=>{
 const f=fields.find(f=>f.feld===name);if(!f)throw Error(name);
 return {feld:name,wortlaut_im_heft:f.text,art:'sonst',primaerquelle:f.text.includes('321')?'https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de':zh,fundstelle:f.text.includes('321')?'OR Art. 321a und 321d':'LS 413.322, §§ 5, 7–10, 14–16; Leitbild BBW S. 4; Auskunft Lehrperson 2026-11-03',abgerufen_am:'2026-11-03',urteil:'belegt',bemerkung:'Reglement und Leitbild lokal gelesen; kein Netzabruf. Vier Wochen: ausschliesslich schulische Auskunft zur Unterschrift und Vorlage. OR: bestehende archivierte Prüfung, in diesem Lauf nicht extern neu geprüft. Die Leseblatt-Busse ist absichtlich falsch; Schlüssel false geprüft. Pädagogische Hinweise sind Empfehlungen.',von:{rolle:'Korrektur-Selbstprüfung; nicht unabhängig',modell:'gpt-6.1-sol'}};
})};fs.writeFileSync(ar+'/fakten.json',JSON.stringify(facts,null,2)+'\n');
