import { TYPE_LABELS } from '../config.js';
import { getState } from '../state.js';
import { hexToRgba } from '../utils/color.js';
import { escHtml, escHtmlMultiline } from '../utils/dom.js';

export function hideDetail() {
  const detailSidebar = document.getElementById('detail-sidebar');
  document.getElementById('detail-content').innerHTML = '';
  detailSidebar.classList.add('empty');
}

export function showDetail(node) {
  const state = getState();

  let html = `<h3>
    <span class="type-badge" style="background:${node.color};${node.type === 'sk' ? 'color:#111' : ''}">${TYPE_LABELS[node.type] || node.type}</span>
    ${escHtml(node.name)}
  </h3>`;

  if (node.type === 'thema') {
    const t = node.data;
    html += `<div class="detail-meta">Lehrjahr ${t.lehrjahr} &middot; ${t.lektionen} Lektionen${t.vollständig === false ? ' &middot; <em>Entwurf</em>' : ''}</div>`;

    const leitideeKurz = t.leitidee?.kurz || t.skizze?.leitidee;
    const leitideeDetail = t.leitidee?.detail || t.skizze?.detail;
    if (leitideeKurz) {
      html += `<div class="detail-leitidee-kurz">${escHtml(leitideeKurz)}</div>`;
    }
    if (leitideeDetail) {
      html += `<div class="detail-leitidee-detail">${escHtml(leitideeDetail)}</div>`;
    }

    if (t.sprachmodi?.length) {
      html += '<hr class="divider"><div class="detail-list-section"><h4>Sprachmodi</h4><ul>';
      t.sprachmodi.forEach(s => {
        html += `<li>${escHtml(s)}</li>`;
      });
      html += '</ul></div>';
    }

    if (t.schluesselkompetenzen?.length) {
      html += '<div class="detail-list-section"><h4>Schlüsselkompetenzen</h4><ul>';
      t.schluesselkompetenzen.forEach(s => {
        html += `<li>${escHtml(s)}</li>`;
      });
      html += '</ul></div>';
    }

    if (t.skizze?.individuelle_lebensbezuege?.length) {
      html += '<hr class="divider"><div class="detail-list-section"><h4>Individuelle Lebensbezüge</h4><ul>';
      t.skizze.individuelle_lebensbezuege.forEach(lb => {
        html += `<li>${escHtml(lb)}</li>`;
      });
      html += '</ul></div>';
    }

    const links = state.graphInstance?.graphData()?.links || [];
    const connected = {};
    links.forEach(l => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      const tgt = typeof l.target === 'object' ? l.target.id : l.target;
      if (s === node.id || tgt === node.id) {
        const otherId = s === node.id ? tgt : s;
        const other = state.allNodes.find(n => n.id === otherId);
        if (other) {
          if (!connected[other.type]) connected[other.type] = [];
          connected[other.type].push({ node: other, iteration: l.iteration });
        }
      }
    });

    const typeOrder = ['lebensbezug', 'kompetenz', 'gesellschaft', 'sprachmodus', 'sk', 'umsetzung'];
    const hasConnections = typeOrder.some(k => connected[k]?.length);
    if (hasConnections) {
      html += '<hr class="divider">';
      typeOrder.forEach(t2 => {
        if (!connected[t2]?.length) return;
        html += `<div class="conn-section"><h4>${TYPE_LABELS[t2]} (${connected[t2].length})</h4><div class="conn-pills">`;
        connected[t2].forEach(({ node: cn, iteration }) => {
          html += `<span class="conn-pill" style="background:${hexToRgba(cn.color, 0.15)};color:${cn.color};border:1px solid ${hexToRgba(cn.color, 0.3)}">${escHtml(cn.label)} <span style="opacity:0.65">${iteration}</span></span>`;
        });
        html += '</div></div>';
      });
    }
  } else if (node.type === 'lebensbezug') {
    const lb = node.data;
    html += `<div class="lb-meta">Thema ${lb.thema_nr} — ${escHtml(lb.thema_titel)} &middot; ${lb.lektionen} Lektionen</div>`;
    html += `<div class="detail-leitidee-kurz">${escHtml(lb.text)}</div>`;

    if (lb.kompetenzen?.length) {
      html += '<hr class="divider">';
      html += '<div class="conn-section"><h4>Sub-Kompetenzen</h4><div class="conn-pills">';
      lb.kompetenzen.forEach(k => {
        html += `<span class="conn-pill">${escHtml(k.nr)}</span>`;
      });
      html += '</div></div>';
      lb.kompetenzen.forEach(k => {
        html += '<div class="detail-kompetenz">';
        html += `<div class="kompetenz-nr">${escHtml(k.nr)}</div>`;
        html += `<div class="kompetenz-text">${escHtmlMultiline(k.text)}</div>`;
        if (k.gesellschaftliche_inhalte?.length) {
          html += '<div class="kompetenz-sub"><h4>Gesellschaftliche Inhalte</h4><ul>';
          k.gesellschaftliche_inhalte.forEach(gi => {
            html += `<li><strong>${escHtml(gi.aspekt)}</strong> — ${escHtml(gi.detail)}</li>`;
          });
          html += '</ul></div>';
        }
        if (k.sprachmodi?.length) {
          html += '<div class="kompetenz-sub"><h4>Sprachmodi</h4><ul>';
          k.sprachmodi.forEach(sm => {
            html += `<li><strong>${escHtml(sm.modus)}</strong> — ${escHtml(sm.detail)}</li>`;
          });
          html += '</ul></div>';
        }
        html += '</div>';
      });
    } else {
      html += '<p style="color:var(--text-muted);font-size:0.75rem;margin-top:10px">Keine Kompetenzen ausgearbeitet.</p>';
    }
  } else if (node.type === 'kompetenz') {
    const k = node.data;
    html += `<div class="lb-meta">Thema ${k.thema_nr} — ${escHtml(k.thema_titel)} &middot; Lebensbezug ${escHtml(k.lebensbezug_nr)}</div>`;
    html += `<div class="detail-leitidee-kurz">${escHtmlMultiline(k.text)}</div>`;
    if (k.gesellschaftliche_inhalte?.length) {
      html += '<div class="kompetenz-sub"><h4>Gesellschaftliche Inhalte</h4><ul>';
      k.gesellschaftliche_inhalte.forEach(gi => {
        html += `<li><strong>${escHtml(gi.aspekt)}</strong> — ${escHtml(gi.detail)}</li>`;
      });
      html += '</ul></div>';
    }
    if (k.sprachmodi?.length) {
      html += '<div class="kompetenz-sub"><h4>Sprachmodi</h4><ul>';
      k.sprachmodi.forEach(sm => {
        html += `<li><strong>${escHtml(sm.modus)}</strong> — ${escHtml(sm.detail)}</li>`;
      });
      html += '</ul></div>';
    }
  } else if (node.type === 'umsetzung') {
    const u = node.data;
    html += `<div class="detail-meta">Variante ${escHtml(u.variante)} &middot; Niveau ${escHtml(u.niveau || '-')} &middot; Thema ${escHtml(String(u.thema_nr || '-'))}</div>`;
    if (u.lebensbezug) html += `<div class="detail-leitidee-kurz">${escHtmlMultiline(u.lebensbezug)}</div>`;
    if (u.herausforderung) html += `<div class="detail-desc"><strong>Herausforderung:</strong> ${escHtmlMultiline(u.herausforderung)}</div>`;
    if (u.produkt) html += `<div class="detail-desc"><strong>Produkt:</strong> ${escHtmlMultiline(u.produkt)}</div>`;
  } else if (node.type === 'scaffold') {
    const s = node.data;
    html += `<div class="detail-meta">Umsetzung ${escHtml(s.umsetzung_variante || '-')} &middot; Niveau ${escHtml(s.niveau || '-')}</div>`;
    if (s.modus) html += `<div class="detail-desc"><strong>Modus:</strong> ${escHtml(s.modus)}</div>`;
    if (s.detail) html += `<div class="detail-leitidee-kurz">${escHtmlMultiline(s.detail)}</div>`;
  } else if (node.type === 'bewertung') {
    const b = node.data;
    html += `<div class="detail-meta">Domäne: ${escHtml(b.domain || '-')} &middot; Umsetzung ${escHtml(b.umsetzung_variante || '-')}</div>`;
    html += `<div class="detail-leitidee-kurz">${escHtmlMultiline(b.text || '')}</div>`;
  } else if (node.type === 'einheit' || node.type === 'situation') {
    const d = node.data;
    if (d.einheit_titel || d.modul_titel)
      html += `<div class="detail-meta">${escHtml(d.modul_titel || ('Modul ' + (d.modul || '')))}</div>`;
    if (d.titel) html += `<div class="detail-leitidee-kurz">${escHtml(d.titel)}</div>`;
    html += `<a class="nrlp-open-btn" href="${d.url}" target="_top">
               ${node.type === 'einheit' ? 'Einheit öffnen →' : 'Situation öffnen →'}
             </a>`;
  } else {
    if (node.data.beschreibung) {
      html += `<div class="detail-desc">${escHtml(node.data.beschreibung)}</div>`;
    }

    if (node.type === 'sprachmodus') {
      const skLinks = state.allLinks
        .filter(l => {
          const s = typeof l.source === 'object' ? l.source.id : l.source;
          const t = typeof l.target === 'object' ? l.target.id : l.target;
          const touchesNode = s === node.id || t === node.id;
          if (!touchesNode) return false;
          const otherId = s === node.id ? t : s;
          return typeof otherId === 'string' && otherId.startsWith('SK__');
        })
        .map(l => {
          const s = typeof l.source === 'object' ? l.source.id : l.source;
          const t = typeof l.target === 'object' ? l.target.id : l.target;
          const otherId = s === node.id ? t : s;
          return {
            skNode: state.allNodes.find(n => n.id === otherId),
            sharedThemen: l.iteration || ''
          };
        })
        .filter(x => x.skNode);

      if (skLinks.length) {
        html += '<hr class="divider"><div class="conn-section"><h4>Verknüpfte Schlüsselkompetenzen</h4><div class="conn-pills">';
        skLinks.forEach(({ skNode, sharedThemen }) => {
          html += `<span class="conn-pill" style="background:${hexToRgba(skNode.color, 0.15)};color:${skNode.color};border:1px solid ${hexToRgba(skNode.color, 0.3)}">${escHtml(skNode.label)} <span style="opacity:0.65">${escHtml(sharedThemen)}</span></span>`;
        });
        html += '</div></div>';
      }
    }

    const w = node.data.wiederholungen;
    if (w && Object.keys(w).length) {
      html += '<hr class="divider"><div class="conn-section"><h4>Vorkommen in Themen</h4><div class="conn-pills">';
      Object.entries(w)
        .sort((a, b) => parseInt(a[0].slice(1), 10) - parseInt(b[0].slice(1), 10))
        .forEach(([thema, iter]) => {
          const tn = state.allNodes.find(n => n.id === thema);
          const col = tn?.color || '#888';
          const themaName = tn ? escHtml(tn.data?.titel || thema) : thema;
          html += `<span class="conn-pill" style="background:${hexToRgba(col, 0.15)};color:${col};border:1px solid ${hexToRgba(col, 0.3)}" title="${themaName}">${thema} <span style="opacity:0.65">${iter}</span></span>`;
        });
      html += '</div></div>';

      html += '<div class="detail-list-section" style="margin-top:10px"><h4>Themen (Vollnamen)</h4><ul>';
      Object.entries(w)
        .sort((a, b) => parseInt(a[0].slice(1), 10) - parseInt(b[0].slice(1), 10))
        .forEach(([thema, iter]) => {
          const tn = state.allNodes.find(n => n.id === thema);
          const col = tn?.color || '#888';
          html += `<li style="border-left-color:${col}"><strong style="color:${col}">${thema}</strong> ${iter} — ${escHtml(tn?.data?.titel || thema)}</li>`;
        });
      html += '</ul></div>';
    }
  }

  const detailSidebar = document.getElementById('detail-sidebar');
  const detailContent = document.getElementById('detail-content');
  detailContent.innerHTML = html;
  detailSidebar.classList.remove('empty');
  detailSidebar.scrollTop = 0;
}

