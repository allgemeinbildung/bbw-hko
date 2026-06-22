import { GESELLSCHAFT_COLORS, LEHRJAHR_COLORS, THEMA_COLORS } from '../config.js';

export function normalizeConceptLabel(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' und ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function getMatchingNodeIds(label, nodeMap) {
  const normalized = normalizeConceptLabel(label);
  const ids = nodeMap.get(normalized) || [];
  return ids;
}

function getKompetenzIdsByVariante(variante, nodes) {
  const list = [];
  nodes.forEach(n => {
    if (n.type !== 'kompetenz') return;
    const v = n.data?.variante;
    if (String(v || '').toLowerCase() === String(variante || '').toLowerCase()) {
      list.push(n.id);
    }
  });
  return list;
}

export function buildGraphData(nrlp) {
  const nodes = [];
  const links = [];
  const linkKeys = new Set();
  const nodeIds = new Set();

  function pushNode(node) {
    if (!node || !node.id || nodeIds.has(node.id)) return;
    nodeIds.add(node.id);
    nodes.push(node);
  }

  function pushLink(link) {
    if (!link) return;
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    if (!s || !t || s === t) return;
    const key = `${s}|${t}|${link.type || ''}|${link.iteration || ''}`;
    if (linkKeys.has(key)) return;
    linkKeys.add(key);
    links.push(link);
  }

  const themen = nrlp.themen || [];
  const sprachmodi = nrlp.zirkularitaet?.sprachmodi || [];
  const gesellschaftsinhalte = nrlp.zirkularitaet?.gesellschaftsinhalte || [];
  const schluesselkompetenzen = nrlp.zirkularitaet?.schluesselkompetenzen || [];

  themen.forEach(t => {
    pushNode({
      id: `T${t.nr}`,
      label: `T${t.nr}`,
      name: `T${t.nr}: ${t.titel}`,
      type: 'thema',
      lehrjahr: t.lehrjahr,
      color: THEMA_COLORS[t.nr] || LEHRJAHR_COLORS[t.lehrjahr] || '#888',
      val: 15,
      data: t
    });
  });

  gesellschaftsinhalte.forEach(g => {
    pushNode({
      id: `G__${g.bezeichnung}`,
      label: g.bezeichnung,
      name: g.bezeichnung,
      type: 'gesellschaft',
      color: GESELLSCHAFT_COLORS[g.bezeichnung] || '#9b59b6',
      val: 6,
      data: g
    });

    const vorkommen = g.wiederholungen || {};
    Object.entries(vorkommen).forEach(([thema, iteration]) => {
      pushLink({
        source: thema,
        target: `G__${g.bezeichnung}`,
        type: 'thema_gesellschaft',
        iteration,
        baseColor: '#9b59b6'
      });
    });
  });

  sprachmodi.forEach(sm => {
    pushNode({
      id: `SM__${sm.bezeichnung}`,
      label: sm.bezeichnung,
      name: sm.bezeichnung,
      type: 'sprachmodus',
      color: '#e91e63',
      val: 6,
      data: sm
    });

    const vorkommen = sm.wiederholungen || {};
    Object.entries(vorkommen).forEach(([thema, iteration]) => {
      pushLink({
        source: thema,
        target: `SM__${sm.bezeichnung}`,
        type: 'thema_sprachmodus',
        iteration,
        baseColor: '#e91e63'
      });
    });
  });

  schluesselkompetenzen.forEach(sk => {
    pushNode({
      id: `SK__${sk.bezeichnung}`,
      label: sk.bezeichnung,
      name: sk.bezeichnung,
      type: 'sk',
      color: '#f97316',
      val: 6,
      data: sk
    });

    const vorkommen = sk.wiederholungen || {};
    Object.entries(vorkommen).forEach(([thema, iteration]) => {
      pushLink({
        source: thema,
        target: `SK__${sk.bezeichnung}`,
        type: 'thema_sk',
        iteration,
        baseColor: '#f97316'
      });
    });
  });

  const skNodeMap = new Map();
  nodes.forEach(n => {
    if (n.type !== 'sk') return;
    const normalized = normalizeConceptLabel(n.label);
    if (!skNodeMap.has(normalized)) skNodeMap.set(normalized, []);
    skNodeMap.get(normalized).push(n.id);
  });

  sprachmodi.forEach(sm => {
    const smId = `SM__${sm.bezeichnung}`;
    const smTopics = new Set(Object.keys(sm.wiederholungen || {}));

    const linkedSkIds = new Set();
    (sm.bezuege?.schluesselkompetenzen || []).forEach(label => {
      getMatchingNodeIds(label, skNodeMap).forEach(id => linkedSkIds.add(id));
    });

    linkedSkIds.forEach(skId => {
      const skNode = nodes.find(n => n.id === skId);
      if (!skNode) return;
      const skTopics = new Set(Object.keys(skNode.data?.wiederholungen || {}));
      const intersection = [...smTopics].filter(t => skTopics.has(t));
      if (!intersection.length) return;
      intersection.sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10));
      pushLink({
        source: smId,
        target: skId,
        type: 'sprachmodus_sk',
        iteration: intersection.join(', '),
        baseColor: '#f97316'
      });
    });
  });

  themen.forEach(t => {
    const tId = `T${t.nr}`;
    const lbs = t.lebensbezuege || [];

    lbs.forEach((lb, iLb) => {
      const lbId = `LB__T${t.nr}_${iLb + 1}`;
      pushNode({
        id: lbId,
        label: lb.nr || `LB${iLb + 1}`,
        name: `${lb.nr || `T${t.nr} LB${iLb + 1}`}: ${lb.text?.slice(0, 70) || ''}`,
        type: 'lebensbezug',
        color: '#6366f1',
        val: 7,
        data: {
          ...lb,
          thema_nr: t.nr,
          thema_titel: t.titel,
          nr: iLb + 1
        }
      });
      pushLink({ source: tId, target: lbId, type: 'thema_lebensbezug', iteration: `R${iLb + 1}`, baseColor: '#6366f1' });

      const kompetenzen = lb.kompetenzen || [];
      kompetenzen.forEach((k, iK) => {
        const kId = `K__T${t.nr}_LB${iLb + 1}_${k.nr || iK + 1}`;
        pushNode({
          id: kId,
          label: k.nr || `K${iK + 1}`,
          name: `${k.nr || `K${iK + 1}`}: ${(k.text || '').slice(0, 80)}`,
          type: 'kompetenz',
          color: '#14b8a6',
          val: 7,
          data: {
            ...k,
            thema_nr: t.nr,
            thema_titel: t.titel,
            lebensbezug_nr: iLb + 1,
            variante: lb.variante
          }
        });
        pushLink({ source: lbId, target: kId, type: 'lebensbezug_kompetenz', iteration: `R${iK + 1}`, baseColor: '#14b8a6' });
        pushLink({ source: tId, target: kId, type: 'thema_kompetenz', iteration: `LB${iLb + 1}`, baseColor: '#14b8a6' });

        (k.gesellschaftliche_inhalte || []).forEach(gi => {
          const gId = `G__${gi.aspekt}`;
          if (nodeIds.has(gId)) {
            pushLink({ source: kId, target: gId, type: 'kompetenz_gesellschaft', iteration: 'K', baseColor: '#9b59b6' });
          }
        });

        (k.sprachmodi || []).forEach(sm => {
          const smId = `SM__${sm.modus}`;
          if (nodeIds.has(smId)) {
            pushLink({ source: kId, target: smId, type: 'kompetenz_sprachmodus', iteration: 'K', baseColor: '#e91e63' });
          }
        });

        (t.schluesselkompetenzen || []).forEach(skLabel => {
          const ids = getMatchingNodeIds(skLabel, skNodeMap);
          ids.forEach(skId => {
            pushLink({ source: kId, target: skId, type: 'kompetenz_sk', iteration: 'K', baseColor: '#f97316' });
          });
        });
      });
    });
  });

  const umsetzungen = nrlp.umsetzungen || nrlp.umsetzungsbeispiele || [];
  umsetzungen.forEach((u, idx) => {
    const uId = `U__${u.variante || idx + 1}`;
    pushNode({
      id: uId,
      label: u.variante || `U${idx + 1}`,
      name: `${u.variante || `U${idx + 1}`}: ${(u.herausforderung || u.produkt || '').slice(0, 70)}`,
      type: 'umsetzung',
      color: '#10b981',
      val: 7,
      data: u
    });

    if (u.thema_nr) {
      const tId = `T${u.thema_nr}`;
      if (nodeIds.has(tId)) {
        pushLink({
          source: tId,
          target: uId,
          type: 'thema_umsetzung',
          iteration: `R${u.thema_nr}`,
          baseColor: '#10b981'
        });
      }
    }

    (u.scaffolds || []).forEach((s, sIdx) => {
      const sId = `S__${u.variante || idx + 1}_${sIdx + 1}`;
      pushNode({
        id: sId,
        label: s.modus || `S${sIdx + 1}`,
        name: `${s.modus || `S${sIdx + 1}`}: ${(s.detail || '').slice(0, 70)}`,
        type: 'scaffold',
        color: '#06b6d4',
        val: 6,
        data: { ...s, umsetzung_variante: u.variante, niveau: u.niveau }
      });
      pushLink({ source: uId, target: sId, type: 'umsetzung_scaffold', baseColor: '#06b6d4' });
    });

    const bewertung = u.bewertung ||
      Object.entries(u.bewertungspositionen || {}).flatMap(([domain, items]) =>
        (items || []).map(text => ({ domain, text }))
      );
    bewertung.forEach((b, bIdx) => {
      const bId = `B__${u.variante || idx + 1}_${bIdx + 1}`;
      pushNode({
        id: bId,
        label: b.domain || `B${bIdx + 1}`,
        name: `${b.domain || `B${bIdx + 1}`}: ${(b.text || '').slice(0, 70)}`,
        type: 'bewertung',
        color: '#f59e0b',
        val: 6,
        data: { ...b, umsetzung_variante: u.variante }
      });
      pushLink({
        source: bId,
        target: uId,
        type: 'bewertung_umsetzung',
        baseColor: '#f59e0b'
      });

      const kompetenzTargets = getKompetenzIdsByVariante(u.variante, nodes);
      kompetenzTargets.forEach(kId => {
        pushLink({
          source: bId,
          target: kId,
          type: 'bewertung_kompetenz',
          baseColor: '#14b8a6'
        });
      });
    });
  });

  return { nodes, links };
}

export function updateNodeDegrees(data) {
  const nodeDegreeMap = new Map();
  let maxDeg = 1;
  (data.links || []).forEach(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source;
    const t = typeof l.target === 'object' ? l.target.id : l.target;
    nodeDegreeMap.set(s, (nodeDegreeMap.get(s) || 0) + 1);
    nodeDegreeMap.set(t, (nodeDegreeMap.get(t) || 0) + 1);
  });
  nodeDegreeMap.forEach(v => {
    if (v > maxDeg) maxDeg = v;
  });
  return { nodeDegreeMap, maxNodeDegree: maxDeg };
}

