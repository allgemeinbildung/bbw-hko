/**
 * herkunft.mjs — Abstammung einer Einheit: Stand der Vorlage an einem Git-Commit
 * lesen und mit dem heutigen Stand vergleichen (ENTSCHEIDE E38, Stufe D;
 * references/belege.md §8). Grundlage für check-belege («neu zu prüfen», kopierter
 * Beleg) und check-fakten (kopierte Faktenzeile).
 *
 *   import { gitRepoFuer, commitLesbar, vorlageAm, vorlageHeute, vergleicheVorlage } from './lib/herkunft.mjs'
 *
 * VERGLEICHSSTAND. Die Vorlage am `stand_commit` kommt aus Git (`git show
 * <commit>:<pfad>`): aus dem Baum selbst, wenn er ein eigenes Git-Repo ist — sonst
 * aus dem Repo dieses Skripts (eine Temp-Kopie unter --wurzel hat kein .git; wie in
 * scripts/karten.mjs). «Heute» ist die Vorlage, wie sie im Baum liegt.
 *
 * WAS VERGLICHEN WIRD.
 *   Lösungsfelder  die Liste aus lib/loesungsfelder.mjs, je Feldpfad der Hash:
 *                  geändert (anderer Hash) · neu · entfernt
 *   Faktenfelder   jedes Textfeld der Vorlage (Hefte, set.json, kn.json; der Begleiter
 *                  als Ganzes — seine Absatzzählung verschiebt sich), in dem
 *                  lib/aussagen.mjs eine Aussage über die Welt findet: geändert heisst,
 *                  die Aussagen des Felds (Art und Treffer) sind nicht mehr dieselben.
 *                  Eine Umformulierung ohne Zahl, Artikel oder Datum zählt nicht.
 *
 * Fehlt Git oder der Commit, ist nichts verglichen — der Aufrufer meldet HINWEIS und
 * endet mit Exit 2, nie «grün».
 *
 * Reines Node, keine Abhängigkeiten, nur lesend. Gibt Feldpfade und Hashes zurück,
 * nie Text.
 */
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { loesungsfelderAus } from './loesungsfelder.mjs'
import { textfelder, TEMPLATE_V42 } from './pruefung.mjs'
import { findeAussagen } from './aussagen.mjs'

const SKRIPT_REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const DATEIEN = ['herausforderung_A.json', 'herausforderung_B.json', 'set.json', 'kn.json']
const norm = (p) => resolve(p).replace(/\\/g, '/').replace(/\/$/, '').toLowerCase()

/**
 * Das Git-Repo, aus dem der Vergleichsstand kommt.
 * @returns {{ repo: string|null, grund: string }}
 */
export function gitRepoFuer(wurzel) {
  const top = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd: wurzel, encoding: 'utf8' })
  if (top.error) return { repo: null, grund: `git nicht ausführbar (${top.error.message})` }
  if (top.status === 0 && norm(top.stdout.trim()) === norm(wurzel)) return { repo: wurzel, grund: '' }
  const eigen = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd: SKRIPT_REPO, encoding: 'utf8' })
  if (eigen.status !== 0) return { repo: null, grund: 'weder der Baum noch das Repo dieses Skripts ist ein Git-Repo' }
  return { repo: SKRIPT_REPO, grund: '' }
}

/** Ist der Commit im Repo lesbar? → voller Hash oder null. */
export function commitLesbar(repo, commit) {
  if (!/^[0-9a-f]{7,40}$/.test(String(commit ?? ''))) return null
  const r = spawnSync('git', ['rev-parse', '--verify', '--quiet', `${commit}^{commit}`], { cwd: repo, encoding: 'utf8' })
  return r.status === 0 ? r.stdout.trim() : null
}

function zeige(repo, commit, pfad) {
  const r = spawnSync('git', ['show', `${commit}:${pfad}`], { cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  return r.status === 0 ? r.stdout.replace(/^﻿/, '') : null
}

/**
 * Die Vorlage, wie sie am Commit stand.
 * @returns {{ vorhanden: boolean, dateien: Record<string, any>, begleiter: string|null, fehler: string[] }}
 */
export function vorlageAm(repo, commit, vorlage) {
  const out = { vorhanden: false, dateien: {}, begleiter: null, fehler: [] }
  for (const f of DATEIEN) {
    const roh = zeige(repo, commit, `src/data/einheiten/${vorlage}/${f}`)
    if (roh === null) continue
    out.vorhanden = true
    try { out.dateien[f] = JSON.parse(roh) } catch (e) { out.fehler.push(`${f}: ${e.message}`) }
  }
  const b = zeige(repo, commit, `src/data/einheiten/${vorlage}/begleiter.md`)
  if (b !== null) { out.vorhanden = true; out.begleiter = b.replace(/\r\n?/g, '\n') }
  return out
}

/** Die Vorlage, wie sie heute im Baum liegt — gleiche Form wie vorlageAm(). */
export function vorlageHeute(wurzel, vorlage) {
  const dir = join(wurzel, 'src', 'data', 'einheiten', vorlage)
  const out = { vorhanden: existsSync(dir), dateien: {}, begleiter: null, fehler: [] }
  if (!out.vorhanden) return out
  for (const f of DATEIEN) {
    const p = join(dir, f)
    if (!existsSync(p)) continue
    try { out.dateien[f] = JSON.parse(readFileSync(p, 'utf8').replace(/^﻿/, '')) } catch (e) { out.fehler.push(`${f}: ${e.message}`) }
  }
  const b = join(dir, 'begleiter.md')
  if (existsSync(b)) out.begleiter = readFileSync(b, 'utf8').replace(/^﻿/, '').replace(/\r\n?/g, '\n')
  return out
}

/** Lösungsfelder eines Stands: Feldpfad → Hash. */
export function loesungsHashes(stand) {
  return new Map(loesungsfelderAus(stand.dateien).map((f) => [f.feld, f.hash]))
}

/** Aussagen über die Welt je Textfeld eines Stands: Feld → sortierte Liste «art:treffer». */
function aussagenJeFeld(stand) {
  const hefte = ['A', 'B'].filter((h) => stand.dateien[`herausforderung_${h}.json`]).map((h) => ({ heft: h, datei: `herausforderung_${h}.json`, json: stand.dateien[`herausforderung_${h}.json`] }))
  const E = { hefte, json: stand.dateien, begleiter: stand.begleiter, quellen: new Map(), methoden: new Map(), v42: hefte.some((h) => h.json.template === TEMPLATE_V42) }
  const out = new Map()
  const n = (s) => String(s).normalize('NFKC').toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim()
  for (const f of textfelder(E, { karten: false })) {
    const a = findeAussagen(f.text).map((x) => `${x.art}:${n(x.treffer)}`)
    if (!a.length) continue
    // Begleiter als ein Feld: Die Absatznummer ist kein fester Ort.
    const feld = f.datei === 'begleiter.md' ? 'begleiter.md' : f.feld
    out.set(feld, [...(out.get(feld) ?? []), ...a])
  }
  for (const [k, v] of out) out.set(k, v.sort())
  return out
}

/**
 * Was sich zwischen zwei Ständen der Vorlage geändert hat.
 * @returns {{ loesung: { feld: string, art: 'geaendert'|'neu'|'entfernt', hash_alt: string|null }[],
 *             fakten:  { feld: string, art: 'geaendert'|'neu'|'entfernt' }[] }}
 */
export function vergleicheVorlage(alt, neu) {
  const loesung = []
  const a = loesungsHashes(alt); const b = loesungsHashes(neu)
  for (const [feld, h] of a) { if (!b.has(feld)) loesung.push({ feld, art: 'entfernt', hash_alt: h }); else if (b.get(feld) !== h) loesung.push({ feld, art: 'geaendert', hash_alt: h }) }
  for (const feld of b.keys()) if (!a.has(feld)) loesung.push({ feld, art: 'neu', hash_alt: null })
  const fakten = []
  const fa = aussagenJeFeld(alt); const fb = aussagenJeFeld(neu)
  for (const [feld, l] of fa) { if (!fb.has(feld)) fakten.push({ feld, art: 'entfernt' }); else if (fb.get(feld).join('\n') !== l.join('\n')) fakten.push({ feld, art: 'geaendert' }) }
  for (const feld of fb.keys()) if (!fa.has(feld)) fakten.push({ feld, art: 'neu' })
  return { loesung, fakten }
}
