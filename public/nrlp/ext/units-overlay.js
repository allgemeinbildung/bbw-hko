// public/nrlp/ext/units-overlay.js
// Hängt Einheiten- und Situationen-Knoten an Kompetenz-/Lebensbezug-Knoten.
// Aufruf aus controller.loadDataset() NACH buildGraphData().

const DATASET_LEHRGANG = {
  'nrlp_3j': 'EFZ_3J',
  'nrlp_4j': 'EFZ_4J',
  'nrlp_2j': 'EBA_2J',
};

function datasetKey(path) {
  const m = String(path).match(/nrlp_(\dj)/);
  return m ? `nrlp_${m[1]}` : 'nrlp_3j';
}

function lehrgangMatches(unitLehrgang, want) {
  if (!unitLehrgang) return true; // unspezifisch → überall zeigen
  const arr = Array.isArray(unitLehrgang) ? unitLehrgang : [unitLehrgang];
  return arr.includes(want);
}

// Sichtbarkeit: Entwurf-Einheiten für lp/gast ausblenden.
function einheitVisible(e, role) {
  if (role === 'kt1' || role === 'reviewer') return true;
  return e.status !== 'entwurf';
}

async function fetchIndex(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) return [];
    return await r.json();
  } catch (_) { return []; }
}

/**
 * @param {{nodes:Array,links:Array}} graphData  Ergebnis von buildGraphData()
 * @param {string} datasetPath                   z. B. "/nrlp_3j.json"
 * @param {string} role                          "lp" | "kt1" | "gast" | ...
 */
export async function augmentGraphWithUnits(graphData, datasetPath, role = 'lp') {
  const wantLehrgang = DATASET_LEHRGANG[datasetKey(datasetPath)];
  const [einheiten, situationen] = await Promise.all([
    fetchIndex('./einheiten.index.json'),
    fetchIndex('./situationen.index.json'),
  ]);

  // Lookup: Kompetenz-Label (k.nr) → Knoten-id ; Lebensbezug-Label (lb.nr) → Knoten-id
  const kompByLabel = new Map();
  const lbByLabel = new Map();
  graphData.nodes.forEach(n => {
    if (n.type === 'kompetenz') kompByLabel.set(String(n.label), n.id);
    if (n.type === 'lebensbezug') lbByLabel.set(String(n.label), n.id);
  });

  const existing = new Set(graphData.nodes.map(n => n.id));
  function pushNode(node) { if (!existing.has(node.id)) { existing.add(node.id); graphData.nodes.push(node); } }
  function pushLink(s, t, type, color) {
    if (!s || !t) return;
    graphData.links.push({ source: s, target: t, type, baseColor: color });
  }

  // --- Einheiten (offizielle Units aus /einheiten) ---
  // Anker = die abgedeckten Kompetenz-Knoten (z. B. "1.1.1"). Fallback: wenn im
  // aktiven Datensatz keine passende Kompetenz existiert, an den Lebensbezug
  // (e.modul, z. B. "1.1") hängen, damit eine offizielle Unit nie unsichtbar bleibt.
  einheiten
    .filter(e => lehrgangMatches(e.lehrgang, wantLehrgang) && einheitVisible(e, role))
    .forEach(e => {
      const targets = new Set();
      (e.abgedeckte_kompetenzen && e.abgedeckte_kompetenzen.length
        ? e.abgedeckte_kompetenzen
        : [e.kompetenz_nr]
      ).forEach(knr => { const id = kompByLabel.get(String(knr)); if (id) targets.add(id); });
      if (!targets.size && e.modul) {
        const lbId = lbByLabel.get(String(e.modul));
        if (lbId) targets.add(lbId);
      }
      if (!targets.size) return; // keine Anknüpfung im aktiven Datensatz
      const id = `EH__${e.id}`;
      pushNode({
        id, label: '★ ' + (e.einheit_titel || e.id),
        name: `Einheit: ${e.einheit_titel || e.id}`,
        type: 'einheit', color: '#0E6E3A', val: 9,
        data: { ...e, url: `/einheiten/${e.id}`, kind: 'einheit' },
      });
      targets.forEach(tId => pushLink(id, tId, 'einheit_kompetenz', '#0E6E3A'));
    });

  // --- Situationen (Sammlung "Herausforderungen", KEINE offiziellen Units) ---
  // Anker = präzisester ECHTER nRLP-Knoten:
  //   1) kompetenz_nr → Kompetenz-Knoten (z. B. "1.1.1")   [50/60 tragen das]
  //   2) sonst lebensbezug_nr → Lebensbezug-Knoten (z. B. "3.1")
  //   3) sonst kompetenz_nr als Lebensbezug (manche tragen 2-stellige Werte wie "2.1")
  // `modul` wird bewusst NICHT verwendet: bei Altsituationen ist das die
  // Lehrmittel-Kapitelnummer (z. B. "2.7"), nicht die nRLP-Verortung.
  situationen.forEach(s => {
    const kompId = s.kompetenz_nr ? kompByLabel.get(String(s.kompetenz_nr)) : null;
    const anchorId = kompId
      || (s.lebensbezug_nr ? lbByLabel.get(String(s.lebensbezug_nr)) : null)
      || (s.kompetenz_nr ? lbByLabel.get(String(s.kompetenz_nr)) : null);
    if (!anchorId) return;
    const id = `SIT__${s.id}`;
    pushNode({
      id, label: '◇ ' + (s.titel || s.id),
      name: `Situation: ${s.titel || s.id}`,
      type: 'situation', color: '#6b21a8', val: 7,
      data: { ...s, url: `/situationen/${s.id}`, kind: 'situation' },
    });
    pushLink(id, anchorId, kompId ? 'situation_kompetenz' : 'situation_lebensbezug', '#6b21a8');
  });

  return graphData;
}
