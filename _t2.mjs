import { Marked } from 'marked'
import fs from 'fs'
const LABELS=['lernziel','hinweis','beispiel','warnung','reflexion','coaching','mehrdeutigkeit','differenzieren','erwartungshorizont','troubleshooting','tafelbild','ki_einsatz']
const raw=fs.readFileSync('src/data/einheiten/1.1.1_rechte_verstehen_nutzen/begleiter.md','utf8')
const m=/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw); const body=raw.slice(m[0].length)
const marked=new Marked({gfm:true,breaks:false})
marked.use({extensions:[{name:'callout',level:'block',
  start(src){const i=src.search(/^>\s*\[!/m);return i<0?undefined:i},
  tokenizer(src){const rule=/^(?:>[ \t]*\[!([A-Za-z_]+)\][ \t]*(.*?)\r?\n)((?:>.*(?:\r?\n|$))*)/;const mt=rule.exec(src);if(!mt)return;const type=mt[1].toLowerCase();if(!LABELS.includes(type))return;const tokens=[];this.lexer.blockTokens('',tokens);return{type:'callout',raw:mt[0],calloutType:type,title:(mt[2]||'').trim(),tokens}},
  renderer(){return''}}]})
const tokens=marked.lexer(body)
// count only top-level callouts
const top={}
for(const t of tokens){ if(t.type==='callout') top[t.calloutType]=(top[t.calloutType]||0)+1 }
console.log('TOP-LEVEL callouts:',JSON.stringify(top,null,2))
