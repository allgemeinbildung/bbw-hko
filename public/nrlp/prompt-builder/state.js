// ─────────────────────────────────────────────────────────────────────────────
// state.js — Single source of truth for selection state + all mutations.
// ─────────────────────────────────────────────────────────────────────────────

export const S = {
  thema: null,        // thema object
  lebensbezuege: [],  // array of lb objects
  kompetenzen: [],    // kompetenz objects (carry ._lb = lb.nr)
  sprachmodi: [],     // strings (free mode) | {modus, detail} objects (official mode)
  schluessel: [],     // strings (free mode)
  gesellschaft: [],   // {aspekt, detail} objects
  beispiele: [],      // array of umsetzungsbeispiel objects
  pruefungstyp: '',
  pruefungsdauer: '',
  hilfsmittel: '',
  handlungsprodukt: '',
  comboSelection: 'official', // 'official' | 'free' for Mode C
};

export function resetState() {
  S.thema = null;
  S.lebensbezuege = [];
  S.kompetenzen = [];
  S.sprachmodi = [];
  S.schluessel = [];
  S.gesellschaft = [];
  S.beispiele = [];
  S.pruefungstyp = '';
  S.pruefungsdauer = '';
  S.hilfsmittel = '';
  S.handlungsprodukt = '';
}

export function selectThema(nrlp, nr) {
  S.thema = nrlp.themen.find(t => t.nr === nr);
  S.lebensbezuege = [];
  S.kompetenzen = [];
  S.sprachmodi = [];
  S.schluessel = [];
  S.gesellschaft = [];
  S.beispiele = [];
  S.pruefungstyp = '';
  S.pruefungsdauer = '';
  S.hilfsmittel = '';
  S.handlungsprodukt = '';
}

export function setComboSelection(mode) {
  S.comboSelection = mode;
}

export function setPruefungstyp(value) {
  S.pruefungstyp = value || '';
}

export function setPruefungsdauer(value) {
  S.pruefungsdauer = value || '';
}

export function setHilfsmittel(value) {
  S.hilfsmittel = value || '';
}

export function setHandlungsprodukt(value) {
  S.handlungsprodukt = value || '';
}

// Official mode: select/deselect a lebensbezug (toggles open + clears orphaned kompetenzen)
export function selectLB(nrlp, nr) {
  const lb = S.thema.lebensbezuege.find(x => x.nr === nr);
  if (S.lebensbezuege.some(x => x.nr === nr)) {
    S.lebensbezuege = [];
    S.beispiele = [];
  } else {
    S.lebensbezuege = [lb];
    S.kompetenzen = S.kompetenzen.filter(k => lb.kompetenzen.find(x => x.nr === k.nr));
    const example = nrlp.umsetzungsbeispiele?.find(b => b.thema_nr === S.thema.nr && b.variante === nr);
    S.beispiele = example ? [example] : [];
  }
}

// Free mode: toggle open a lebensbezug for drilling into kompetenzen (no exclusive lock)
export function toggleLBOpen(nrlp, nr) {
  const idx = S.lebensbezuege.findIndex(x => x.nr === nr);
  if (idx >= 0) {
    S.lebensbezuege.splice(idx, 1);
    const bIdx = S.beispiele.findIndex(b => b.thema_nr === S.thema.nr && b.variante === nr);
    if (bIdx >= 0) S.beispiele.splice(bIdx, 1);
  } else {
    const lb = S.thema.lebensbezuege.find(x => x.nr === nr);
    S.lebensbezuege.push(lb);
    const example = nrlp.umsetzungsbeispiele?.find(b => b.thema_nr === S.thema.nr && b.variante === nr);
    if (example) S.beispiele.push(example);
  }
}

export function toggleKomp(lbnr, knr) {
  const lb = S.thema.lebensbezuege.find(x => x.nr === lbnr);
  const k = lb.kompetenzen.find(x => x.nr === knr);
  k._lb = lbnr;
  const idx = S.kompetenzen.findIndex(x => x.nr === knr);
  if (idx >= 0) {
    S.kompetenzen.splice(idx, 1);
    // clean up GI + SM orphaned by removal
    S.gesellschaft = S.gesellschaft.filter(gi =>
      S.kompetenzen.some(kk => (kk.gesellschaftliche_inhalte || [])
        .find(x => x.aspekt === gi.aspekt && x.detail === gi.detail))
    );
    S.sprachmodi = S.sprachmodi.filter(sm => {
      if (typeof sm === 'string') return true;
      return S.kompetenzen.some(kk => (kk.sprachmodi || [])
        .find(x => x.modus === sm.modus && x.detail === sm.detail));
    });
  } else {
    S.kompetenzen.push(k);
    // auto-add GI + SM from newly added komp
    for (const gi of (k.gesellschaftliche_inhalte || []))
      if (!S.gesellschaft.find(x => x.aspekt === gi.aspekt && x.detail === gi.detail))
        S.gesellschaft.push(gi);
    for (const sm of (k.sprachmodi || []))
      if (!S.sprachmodi.find(x => x.modus === sm.modus && x.detail === sm.detail))
        S.sprachmodi.push(sm);
  }
}

export function toggleSM_str(sm) {
  const idx = S.sprachmodi.indexOf(sm);
  if (idx >= 0) S.sprachmodi.splice(idx, 1);
  else S.sprachmodi.push(sm);
}

export function toggleSM_obj(modus, detail) {
  const idx = S.sprachmodi.findIndex(x => x.modus === modus && x.detail === detail);
  if (idx >= 0) S.sprachmodi.splice(idx, 1);
  else S.sprachmodi.push({ modus, detail });
}

export function toggleSK(sk) {
  const idx = S.schluessel.indexOf(sk);
  if (idx >= 0) S.schluessel.splice(idx, 1);
  else S.schluessel.push(sk);
}

export function toggleGI(aspekt, detail) {
  const idx = S.gesellschaft.findIndex(x => x.aspekt === aspekt && x.detail === detail);
  if (idx >= 0) S.gesellschaft.splice(idx, 1);
  else S.gesellschaft.push({ aspekt, detail });
}

export function bulkToggleGI(items, selectAll) {
  if (selectAll) {
    for (const item of items) {
      if (!S.gesellschaft.find(x => x.aspekt === item.aspekt && x.detail === item.detail)) {
        S.gesellschaft.push({ ...item });
      }
    }
  } else {
    for (const item of items) {
      const idx = S.gesellschaft.findIndex(x => x.aspekt === item.aspekt && x.detail === item.detail);
      if (idx >= 0) S.gesellschaft.splice(idx, 1);
    }
  }
}

export function bulkToggleSM_obj(items, selectAll) {
  if (selectAll) {
    for (const item of items) {
      if (!S.sprachmodi.find(x => x.modus === item.modus && x.detail === item.detail)) {
        S.sprachmodi.push({ ...item });
      }
    }
  } else {
    for (const item of items) {
      const idx = S.sprachmodi.findIndex(x => x.modus === item.modus && x.detail === item.detail);
      if (idx >= 0) S.sprachmodi.splice(idx, 1);
    }
  }
}

export function bulkToggleSM_str(items, selectAll) {
  if (selectAll) {
    for (const sm of items) {
      if (!S.sprachmodi.includes(sm)) S.sprachmodi.push(sm);
    }
  } else {
    S.sprachmodi = S.sprachmodi.filter(sm => typeof sm !== 'string' || !items.includes(sm));
  }
}

export function bulkToggleSK(items, selectAll) {
  if (selectAll) {
    for (const sk of items) {
      if (!S.schluessel.includes(sk)) S.schluessel.push(sk);
    }
  } else {
    S.schluessel = S.schluessel.filter(sk => !items.includes(sk));
  }
}

export function toggleAllKomp(lbnr, knrs, selectAll) {
  const lb = S.thema.lebensbezuege.find(x => x.nr === lbnr);
  if (!lb) return;
  for (const knr of knrs) {
    const isSel = S.kompetenzen.some(x => x.nr === knr);
    if (selectAll && !isSel) {
      const k = lb.kompetenzen.find(x => x.nr === knr);
      if (k) {
        k._lb = lbnr;
        S.kompetenzen.push(k);
        for (const gi of (k.gesellschaftliche_inhalte || []))
          if (!S.gesellschaft.find(x => x.aspekt === gi.aspekt && x.detail === gi.detail)) S.gesellschaft.push(gi);
        for (const sm of (k.sprachmodi || []))
          if (!S.sprachmodi.find(x => x.modus === sm.modus && x.detail === sm.detail)) S.sprachmodi.push(sm);
      }
    } else if (!selectAll && isSel) {
      const idx = S.kompetenzen.findIndex(x => x.nr === knr);
      S.kompetenzen.splice(idx, 1);
    }
  }
  // Post-bulk cleanup if deselecting (remove orphaned GI/SM)
  if (!selectAll) {
    S.gesellschaft = S.gesellschaft.filter(gi =>
      S.kompetenzen.some(kk => (kk.gesellschaftliche_inhalte || [])
        .find(x => x.aspekt === gi.aspekt && x.detail === gi.detail))
    );
    S.sprachmodi = S.sprachmodi.filter(sm => {
      if (typeof sm === 'string') return true;
      return S.kompetenzen.some(kk => (kk.sprachmodi || [])
        .find(x => x.modus === sm.modus && x.detail === sm.detail));
    });
  }
}

