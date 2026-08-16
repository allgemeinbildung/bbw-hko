// Guards the redundancy inside the nRLP datasets (public/nrlp_{2j,3j,4j}.json).
//
// Each dataset stores a theme's Schluesselkompetenzen TWICE:
//
//   themen[].schluesselkompetenzen              -> array of SK long texts
//   zirkularitaet.schluesselkompetenzen[]        -> {bezeichnung, wiederholungen: {T5: "R2", …}}
//     .wiederholungen                               (the SK spiral, SLP page 5)
//
// Both are extracted from the same Bildungsrat PDF, and they drifted: between
// 2026-06-14 and 2026-08-16 nrlp_4j.json listed 1 SK for T5 where the spiral
// says 6 (T4: 5 vs 7, T6: 4 vs 5). Nothing failed — the app just showed too few
// SK. See docs/nrlp-4j-sk-bug-2026-08.md.
//
// This script fails the build when the two disagree again.
//
//   node scripts/check-nrlp-consistency.mjs   -> report, exit 1 on any mismatch
//
// Runs first on prebuild, before anything derives data from the datasets.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const DATASETS = ['nrlp_2j.json', 'nrlp_3j.json', 'nrlp_4j.json']

// nrlp_3j.json T7 (Schlussarbeit) is the only theme that lists all 12 SK, in the
// same order as the zirkularitaet table. It is the vocabulary reference: every SK
// long text anywhere in any dataset must be one of these strings, character for
// character. A near-miss is a typo, and a typo silently breaks the full->short
// lookup in IntakeForm's skShortFor().
const VOCAB_SOURCE = { file: 'nrlp_3j.json', thema: '7' }

const load = (f) => JSON.parse(readFileSync(join(root, 'public', f), 'utf8'))
const themaKey = (t) => 'T' + t.nr
// T7 Schlussarbeit draws on all 12 SK and is deliberately absent from the
// spiral. It has no Lebensbezuege — that is the structural marker, so we do not
// hardcode a theme number.
const inSpiral = (t) => (t.lebensbezuege || []).length > 0

const errors = []
const notes = []

// ---------------------------------------------------------------- vocabulary
const vocabDs = load(VOCAB_SOURCE.file)
const vocabThema = vocabDs.themen.find((t) => String(t.nr) === VOCAB_SOURCE.thema)
const VOCAB = vocabThema?.schluesselkompetenzen ?? []
if (VOCAB.length !== 12) {
  console.error(
    `FATAL: ${VOCAB_SOURCE.file} T${VOCAB_SOURCE.thema} should list all 12 SK as the ` +
      `vocabulary reference, found ${VOCAB.length}. Fix that theme first — this check ` +
      `cannot validate anything without it.`,
  )
  process.exit(1)
}
const vocabIndex = new Map(VOCAB.map((text, i) => [text, i]))

// "Did someone drop or change a word" hint. Token overlap, not substring: the
// real-world case was a missing "sich" in the MIDDLE of the sentence, which no
// prefix/substring test catches.
const tokens = (s) => new Set(s.toLowerCase().match(/[a-zäöüß]+/g) ?? [])
const overlap = (a, b) => {
  const inter = [...a].filter((x) => b.has(x)).length
  return inter / new Set([...a, ...b]).size
}
const nearest = (text) => {
  const ts = tokens(text)
  let best = null
  let bestScore = 0
  for (const v of VOCAB) {
    const score = overlap(ts, tokens(v))
    if (score > bestScore) {
      bestScore = score
      best = v
    }
  }
  return bestScore >= 0.5 ? best : null
}

// ---------------------------------------------------------------- per dataset
for (const file of DATASETS) {
  const ds = load(file)
  const zirk = ds.zirkularitaet?.schluesselkompetenzen ?? []

  if (zirk.length !== VOCAB.length) {
    errors.push(
      `${file}: zirkularitaet lists ${zirk.length} SK, expected ${VOCAB.length}. ` +
        `The index mapping between the spiral and the SK vocabulary no longer holds.`,
    )
    continue
  }

  for (const t of ds.themen ?? []) {
    const key = themaKey(t)
    const listed = t.schluesselkompetenzen ?? []

    if (!inSpiral(t)) {
      if (listed.length !== VOCAB.length) {
        notes.push(
          `${file} ${key} "${t.titel}" sits outside the spiral (no Lebensbezuege) and ` +
            `lists ${listed.length} SK instead of all ${VOCAB.length}.`,
        )
      }
      continue
    }

    // Vocabulary: every listed long text must be a known SK string.
    const listedIdx = new Set()
    for (const text of listed) {
      if (vocabIndex.has(text)) {
        listedIdx.add(vocabIndex.get(text))
        continue
      }
      const hint = nearest(text)
      errors.push(
        `${file} ${key}: unknown SK text ${JSON.stringify(text)}` +
          (hint ? `\n    did you mean: ${JSON.stringify(hint)}` : `\n    not close to any of the 12 canonical SK texts`),
      )
    }

    // Spiral: the set must match what zirkularitaet claims for this theme.
    const spiralIdx = new Set()
    zirk.forEach((sk, i) => {
      if (sk.wiederholungen?.[key]) spiralIdx.add(i)
    })

    const missing = [...spiralIdx].filter((i) => !listedIdx.has(i))
    const extra = [...listedIdx].filter((i) => !spiralIdx.has(i))
    if (missing.length || extra.length) {
      const fmt = (idx) => idx.map((i) => `SK${i + 1} ${zirk[i].bezeichnung}`).join(', ')
      errors.push(
        `${file} ${key} "${t.titel}": themen[].schluesselkompetenzen disagrees with the spiral` +
          (missing.length ? `\n    missing (spiral has it, theme does not): ${fmt(missing)}` : '') +
          (extra.length ? `\n    extra (theme has it, spiral does not): ${fmt(extra)}` : ''),
      )
    }
  }
}

// ---------------------------------------------------------------- report
for (const n of notes) console.warn(`note: ${n}`)

if (errors.length) {
  console.error(`\nnRLP consistency check FAILED — ${errors.length} problem(s):\n`)
  for (const e of errors) console.error(`  ${e}\n`)
  console.error(
    `The SK of a theme are stored twice per dataset and must agree. The spiral\n` +
      `(zirkularitaet.schluesselkompetenzen[].wiederholungen) mirrors page 5 of the\n` +
      `Bildungsrat SLP and is the reliable side; themen[].schluesselkompetenzen is the\n` +
      `one that has drifted before. Background: docs/nrlp-4j-sk-bug-2026-08.md\n`,
  )
  process.exit(1)
}

console.log(`nRLP consistency OK — ${DATASETS.length} datasets, SK spiral and theme lists agree.`)
