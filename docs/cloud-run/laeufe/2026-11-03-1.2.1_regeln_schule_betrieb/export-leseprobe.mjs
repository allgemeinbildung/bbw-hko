import {chromium} from 'playwright';
import fs from 'node:fs';
const dir='D:/OS/_lab/tmp-121-final',run='docs/cloud-run/laeufe/2026-11-03-1.2.1_regeln_schule_betrieb';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const page=await browser.newPage({viewport:{width:1100,height:1200}});let result='';
for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.html'))){await page.goto('file:///'+dir+'/'+file);await page.evaluate(()=>document.fonts.ready);let pages=await page.locator('.a4-page').all();for(let i=0;i<pages.length;i++){result+='\n## '+file+' Seite '+(i+1)+'\n'+await pages[i].innerText()+'\n';if(['heft-a-ohne-medien.html','heft-b-ohne-medien.html','auftragsbogen.html','dossier.html','kn-s_fachgespraech.html'].includes(file))await pages[i].screenshot({path:run+'/'+file.replace('.html','')+'-'+(i+1)+'.png'});}}
fs.writeFileSync(run+'/export-leseprobe-nach-korrektur.txt',result);await browser.close();
