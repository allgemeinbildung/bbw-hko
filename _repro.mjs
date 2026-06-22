import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

// bundle the docx-builder to CJS so we can require it
await build({
  entryPoints: ['src/lib/einheiten/docx-builder.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: '/tmp/builder.mjs',
  external: ['docx','jszip'],
});
const mod = await import('/tmp/builder.mjs');
const { buildDocS, docToBlob } = mod;
const sit = JSON.parse(fs.readFileSync('src/data/einheiten/1.1.1_konflikt_kommunizieren/herausforderung_B.json','utf8'));
const set = JSON.parse(fs.readFileSync('src/data/einheiten/1.1.1_konflikt_kommunizieren/set.json','utf8'));
for (const mode of ['info','fill']) {
  const doc = buildDocS({ sit, set, abteilung: 'Test', mode, logoPng: null });
  const blob = await docToBlob(doc);
  const buf = Buffer.from(await blob.arrayBuffer());
  fs.writeFileSync(`/tmp/doc-B-${mode}.docx`, buf);
  console.log('wrote', mode, buf.length);
}
