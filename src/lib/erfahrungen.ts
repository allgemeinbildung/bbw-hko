// erfahrungen.ts — Rückmeldungen anderer Lehrpersonen zu einer Einheit, ohne Namen
// (Entscheid KT 29.09.2026, Migration 022).
//
// Gelesen wird mit dem Service-Role-Client, weil RLS einer Lehrperson nur ihre
// eigenen Zeilen zeigt. Die Anonymität hängt deshalb allein an ÖFFENTLICHE_SPALTEN:
// kein lp_id, keine Klasse, keine Abteilung, keine Dateien, kein KT1-Kommentar.
// Wer hier eine Spalte ergänzt, veröffentlicht sie.

import { createAdminClient } from './supabase'

const OEFFENTLICHE_SPALTEN = [
  'id',
  'created_at',
  'feedback_art',
  'dauer_lektionen',
  'genutzt_sit_a', 'genutzt_sit_b', 'genutzt_sit_c', 'genutzt_kn',
  'kn_typ_verwendet', 'kn_typ_anders',
  'tauglichkeit', 'qualitaet_situation', 'qualitaet_handlungsprodukt',
  'schwierigkeit', 'motivation', 'kn_validitaet',
  'kn_fairness', 'kn_zeit_angemessen', 'kn_raster_brauchbar', 'kn_ergebnis',
  'niveau_passung', 'noetiges_scaffolding', 'weiterempfehlung',
  'eigene_anpassungen', 'anmerkungen',
].join(', ')

export interface Erfahrung {
  id: string
  created_at: string
  feedback_art: '1zu1' | 'angepasst'
  dauer_lektionen: number | null
  genutzt_sit_a: boolean | null
  genutzt_sit_b: boolean | null
  genutzt_sit_c: boolean | null
  genutzt_kn: boolean | null
  kn_typ_verwendet: string | null
  kn_typ_anders: string | null
  tauglichkeit: number | null
  qualitaet_situation: number | null
  qualitaet_handlungsprodukt: number | null
  schwierigkeit: number | null
  motivation: number | null
  kn_validitaet: number | null
  kn_fairness: number | null
  kn_zeit_angemessen: number | null
  kn_raster_brauchbar: number | null
  kn_ergebnis: string | null
  niveau_passung: string | null
  noetiges_scaffolding: string | null
  weiterempfehlung: boolean | null
  eigene_anpassungen: string | null
  anmerkungen: string | null
}

export const BEWERTUNGEN: Array<[keyof Erfahrung, string]> = [
  ['tauglichkeit', 'Passt in den Unterricht'],
  ['qualitaet_situation', 'Qualität der Herausforderungen'],
  ['qualitaet_handlungsprodukt', 'Qualität des Handlungsprodukts'],
  ['schwierigkeit', 'Anspruch für die Lernenden'],
  ['motivation', 'Engagement der Lernenden'],
  ['kn_validitaet', 'KN misst die Kompetenz'],
]

export interface ErfahrungenUebersicht {
  liste: Erfahrung[]
  mittel: Array<{ label: string; wert: number; n: number }>
  empfehlung: { ja: number; n: number }
  niveau: Record<'zu_leicht' | 'passend' | 'zu_schwer', number>
}

export async function ladeErfahrungen(einheitId: string): Promise<ErfahrungenUebersicht | null> {
  try {
    const { data, error } = await createAdminClient()
      .from('einheit_feedbacks')
      .select(OEFFENTLICHE_SPALTEN)
      .eq('einheit_id', einheitId)
      .eq('fuer_lp_sichtbar', true)
      .in('feedback_art', ['1zu1', 'angepasst'])
      .in('status', ['eingereicht', 'gesichtet', 'weitergeleitet_kt2'])
      .order('created_at', { ascending: false })
    if (error) throw error
    const liste = (data ?? []) as unknown as Erfahrung[]

    const mittel = BEWERTUNGEN.map(([key, label]) => {
      const werte = liste.map((e) => e[key]).filter((v): v is number => typeof v === 'number')
      return { label, wert: werte.length ? werte.reduce((a, b) => a + b, 0) / werte.length : 0, n: werte.length }
    }).filter((m) => m.n > 0)

    const emp = liste.filter((e) => typeof e.weiterempfehlung === 'boolean')
    const niveau = { zu_leicht: 0, passend: 0, zu_schwer: 0 }
    for (const e of liste) if (e.niveau_passung && e.niveau_passung in niveau) niveau[e.niveau_passung as keyof typeof niveau]++

    return {
      liste,
      mittel,
      empfehlung: { ja: emp.filter((e) => e.weiterempfehlung).length, n: emp.length },
      niveau,
    }
  } catch (e) {
    // Fehlt die Spalte (Migration 022 nicht angewendet) oder der Dienst: Seite
    // ohne den Abschnitt ausliefern statt sie zu brechen.
    console.error('[erfahrungen]', e)
    return null
  }
}
