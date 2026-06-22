import { Marked } from 'marked'
import fs from 'fs'

const LABELS = ['lernziel','hinweis','beispiel','warnung','reflexion','coaching','mehrdeutigkeit','differenzieren','erwartungshorizont','troubleshooting','tafelbild','ki_einsatz']

const raw = fs.readFileSync('src/data/einheiten/1.1.1_rechte_verstehen_nutzen/begleiter.md','utf8')
const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
const body = raw.slice(m[0].length)

const marked = new Marked({ gfm:true, breaks:false })
marked.use({ extensions:[{
  name:'callout', level:'block',
  start(src){ const i=src.search(/^>\s*\[!/m); return i<0?undefined:i },
  tokenizer(src){
    const rule=/^(?:>[ \t]*\[!([A-Za-z_]+)\][ \t]*(.*?)\r?\n)((?:>.*(?:\r?\n|$))*)/
    const mt=rule.exec(src); if(!mt) return
    const type=mt[1].toLowerCase(); if(!LABELS.includes(type)) return
    const tokens=[]; this.lexer.blockTokens(mt[3].split(/\r?\n/).map(l=>l.replace(/^>[ \t]?/,'')).join('\n').replace(/\n+$/,''),tokens)
    return {type:'callout',raw:mt[0],calloutType:type,title:(mt[2]||'').trim(),tokens}
  },
  renderer(){return ''}
}]})

const counts={}
let bodyHasStrayHeader=0
function walk(toks){
  for(const t of toks){
    if(t.type==='callout'){
      counts[t.calloutType]=(counts[t.calloutType]||0)+1
      // check body text doesn't contain a stray [!type] header
      const bodyRaw=JSON.stringify(t.tokens)
      if(/\[!(erwartungshorizont|troubleshooting|tafelbild|ki_einsatz|coaching)\]/.test(bodyRaw)){
        bodyHasStrayHeader++
        console.log('STRAY callout header inside body of:',t.calloutType,'·',t.title)
      }
      walk(t.tokens)
    } else if(t.tokens) walk(t.tokens)
    if(t.type==='list'&&t.items) for(const it of t.items) walk(it.tokens||[])
  }
}
const tokens=marked.lexer(body)
walk(tokens)
console.log('Callout counts:',JSON.stringify(counts,null,2))
console.log('Stray headers swallowed into bodies:',bodyHasStrayHeader)
