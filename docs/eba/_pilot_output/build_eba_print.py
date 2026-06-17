#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EBA Print-Generator (data-complete) — liest die 6 Set-JSONs und emittiert EIN
Print-A4-HTML, das JEDES relevante Feld rendert. Dokument-Set wie EFZ:
  Deckblatt · DOC-S A · DOC-S B · Austausch & Transfer · KN · Dossier.
Design = EBA-Prinzipien P1-P5. Dient zugleich als Spec fuer die React-Komponenten.
Aufruf:  python3 build_eba_print.py   (im Ordner docs/eba/_pilot_output/)
"""
import json, html, glob, os, re

BASE = os.path.dirname(os.path.abspath(__file__))
def load(suffix):
    for f in glob.glob(os.path.join(BASE, f"*_{suffix}.json")):
        return json.load(open(f, encoding="utf-8"))
    return {}

P = load("prinzip"); A = load("herausforderung_A"); B = load("herausforderung_B")
S = load("set"); K = load("kn"); D = load("dossier")

def e(x): return html.escape(str(x)) if x is not None else ""
def lines(h=22): return f'<div class="lines" style="height:{h}mm"></div>'
def nugcode(i):
    m = re.search(r'_([AB])_?0*?(\d+)$', i, re.I)
    return f"{m.group(1).upper()}-{int(m.group(2)):02d}" if m else i

OUT = []
def w(s): OUT.append(s)

# ---------- page helpers ----------
def page(cls, code, right, body):
    w(f'<section class="page {cls}"><div class="strip"></div>'
      f'<div class="head"><span class="code">{code}</span><span>{right}</span></div>{body}</section>')

def meta_block(sit):
    n = sit.get("nrlp", {})
    komp = n.get("nr",""); modus = " · ".join(n.get("sprachmodi", []))
    sk = ", ".join(f"SK{x}" for x in n.get("sk", []))
    asp = ", ".join(g.get("aspekt","") for g in n.get("gesellschaft", []))
    rows = [
        ("Kompetenz", f'{komp} — {e(P.get("kern_kompetenzversprechen",""))}'),
        ("Lebensbezug", e(n.get("lebensbezug",""))),
        ("Aspekte", e(asp)),
        ("Sprachmodi", e(modus)),
        ("Schlüsselkompetenzen", e(sk)),
    ]
    inner = "".join(f'<div class="meta-row"><span class="meta-l">{l}</span><span>{v}</span></div>' for l,v in rows if v)
    return f'<div class="meta">{inner}</div>'

# ---------- DOC-S (per Herausforderung) ----------
def doc_s(sit, letter):
    cls = "a" if letter=="A" else "b"
    hp = sit.get("handlungsprodukt", {})
    n = sit.get("nrlp", {})
    # --- Seite 1: Cockpit + Situation ---
    cards = (f'<div class="cards">'
             f'<div class="card"><h4>Das bist du</h4><div class="big">{e(sit.get("persona",{}).get("beruf",""))}</div>'
             f'<div class="sub">{e(sit.get("persona",{}).get("betrieb",""))}, {e(sit.get("persona",{}).get("ort",""))}</div></div>'
             f'<div class="card"><h4>Das machst du</h4><div class="big">{e(hp.get("format",""))}</div>'
             f'<div class="sub">{e(hp.get("titel",""))}</div></div></div>')
    trade = sit.get("mehrdeutigkeit",{})
    tradehtml = (f'<div class="tradeoff"><span class="t">Zwei Wege:</span> {e(trade.get("trade_off",""))}. '
                 f'{e(trade.get("hint",""))}</div>') if trade.get("trade_off") else ""
    body1 = (f'<h2>Herausforderung {letter} — {e(sit.get("titel",""))}</h2>'
             f'{cards}{meta_block(sit)}'
             f'<div class="situation"><p>{e(sit.get("situation_text",""))}</p></div>'
             f'<div class="leitfrage-haupt">{e(sit.get("leitfrage",""))}</div>{tradehtml}')
    page(cls, f"DOC-S · HF {letter} · Seite 1", e(sit.get("modul_titel","")), body1)

    # --- Seite 2: Leitfragen (P1 einzeln, mit Bloom + Anker + Schreibfeld) ---
    intro = sit.get("leitfragen_intro","")
    lf = ""
    for q in sit.get("leitfragen", []):
        lf += (f'<div class="lf"><div class="lf-head"><span class="lf-nr">{q.get("nr")}</span>'
               f'<span class="lf-q">{e(q.get("text",""))}</span></div>'
               f'<div class="lf-meta"><span class="bloom">{e(q.get("bloom",""))}</span>'
               f'<span class="anker">{e(q.get("knoten_ref",""))}</span></div>'
               f'{lines(40 if q.get("nr")==4 else 24)}</div>')
    body2 = f'<h2>Beantworte die vier Fragen</h2><p class="hint">{e(intro)}</p>{lf}'
    page(cls, f"DOC-S · HF {letter} · Seite 2", "Leitfragen", body2)

    # --- Seite 3: Mindmap ---
    aeste = sit.get("mindmap_aeste", [])
    asthtml = ""
    for ast in aeste:
        opt = ' <span class="opt">· optional</span>' if ast.get("optional") else ""
        pts = "".join(f"<li>{e(p)}</li>" for p in ast.get("punkte", []))
        asthtml += f'<div class="mm-ast"><h4>{e(ast.get("titel",""))}{opt}</h4><ul>{pts}<li class="blank">&nbsp;</li></ul></div>'
    body3 = (f'<h2>Mindmap: {e(sit.get("mindmap_zentrum",""))}</h2>'
             f'<p class="hint">Bau deine Mindmap aus dem Zentrum und diesen vier Ästen. Ergänze eigene Punkte.</p>'
             f'<div class="mm-center">{e(sit.get("mindmap_zentrum",""))}</div>'
             f'<div class="mm-grid">{asthtml}</div>')
    page(cls, f"DOC-S · HF {letter} · Seite 3", "Mindmap", body3)

    # --- Seite 4: Handlungsprodukt (Anleitung + Scaffolding + Schreibflaeche) ---
    sc = hp.get("scaffolding", {})
    schritte = ""
    steps = hp.get("schritte", [])
    for i, s in enumerate(steps, 1):
        schritte += (f'<div class="schritt"><span class="n">{i}</span><span class="txt">'
                     f'<b>{e(s.get("label",""))}</b> — {e(s.get("hint",""))}'
                     f'<span class="of">Schritt {i} von {len(steps)}</span></span></div>')
    def grp(label, items):
        items = [x for x in (items or []) if x]
        if not items: return ""
        return f'<div class="sg-label">{label}</div><ul>' + "".join(f"<li>{e(x)}</li>" for x in items) + "</ul>"
    scaff = grp("Satzanfänge", sc.get("satzanfaenge")) + grp("Strategien", sc.get("strategien")) + grp("Aufbau", sc.get("struktur"))
    guete = ""
    for k in (sit.get("lernfortschritt",{}).get("kriterien") or []):
        if k.get("kriterium") or k.get("indikator"):
            guete += f'<li><span class="cb">☐</span> <b>{e(k.get("kriterium",""))}</b> — {e(k.get("indikator",""))}</li>'
    lf90 = sit.get("lernfortschritt",{}).get("scaffold_90",""); lf100 = sit.get("lernfortschritt",{}).get("scaffold_100","")
    body4 = (f'<h2>Handlungsprodukt: {e(hp.get("titel",""))}</h2>'
             f'<p class="lead">{e(hp.get("beschreibung",""))}</p>'
             f'<p class="hint">{e(hp.get("format_detail",""))}</p>'
             f'<div class="abgabe"><b>Das lieferst du ab:</b> {e(hp.get("format",""))}</div>'
             f'<span class="step-of">So gehst du vor</span>{schritte}'
             f'<div class="work"><div class="scaffold"><h4>Wie geht das?</h4>{scaff}</div>'
             f'<div class="flaeche"><b>{e(hp.get("schreib_label","HIER ERARBEITEN"))}</b>{lines(60)}'
             f'<div class="niveau"><div class="opt-box"><b>Mit Hilfe (90%)</b><br>{e(lf90)}</div>'
             f'<div class="opt-box"><b>Selbstständig (100%)</b><br>{e(lf100)}</div></div></div></div>'
             + (f'<div class="guete"><div class="sg-label">Gütekriterien</div><ul class="guete-list">{guete}</ul></div>' if guete else ""))
    page(cls, f"DOC-S · HF {letter} · Seite 4", "Handlungsprodukt", body4)

    # --- Seite 5: Checkliste + Reflexion + Ressourcen + Transfer-Frage ---
    chk = ""
    for b in sit.get("bewertungsraster", []):
        bl = "".join(f"<li>{e(v)}</li>" for v in (b.get("vollstaendig_wenn") or []) if v)
        chk += f'<tr><td><b>{e(b.get("produkt",""))}</b></td><td><ul class="chk">{bl}</ul></td><td class="cc">☐</td></tr>'
    refl = ""
    for r in sit.get("reflexion_fragen", []):
        refl += f'<div class="lf"><div class="lf-head"><span class="lf-nr">{e(r.get("nr",""))}</span><span class="lf-q">{e(r.get("text",""))}</span></div>{lines(20)}</div>'
    ress = ""
    for q in sit.get("quellen_anker", []):
        ress += f'<li><b>{e(q.get("titel",""))}</b>{(" · "+e(q.get("unterueberschrift",""))) if q.get("unterueberschrift") else ""} <span class="anker">{e(q.get("nugget_ref",""))}</span></li>'
    dk = sit.get("dekontextualisierung",{})
    body5 = (f'<h2>Selbstcheck & Reflexion</h2>'
             f'<div class="sg-label">Checkliste — bin ich fertig?</div>'
             f'<table class="chk-table"><thead><tr><th>Produkt</th><th>Vollständig, wenn …</th><th>☐</th></tr></thead><tbody>{chk}</tbody></table>'
             f'<div class="sg-label" style="margin-top:5mm">Reflexion</div>{refl}'
             f'<div class="sg-label" style="margin-top:4mm">Ressourcen (im Dossier)</div><ul class="ress">{ress}</ul>'
             + (f'<div class="transfer-q"><b>Weiterdenken:</b> {e(dk.get("frage",""))}</div>' if dk.get("frage") else "")
             )
    page(cls, f"DOC-S · HF {letter} · Seite 5", "Selbstcheck", body5)

# ---------- DOC Austausch & Transfer ----------
def doc_austausch():
    ap = S.get("austausch_phase", {})
    ja = ap.get("gruppenarbeit_jigsaw", {})
    runden = "".join(f'<div class="schritt"><span class="n">{i}</span><span class="txt">{e(t)}<span class="of">Runde {i}</span></span></div>'
                     for i,(k,t) in enumerate(sorted(ja.items()),1))
    prog = "".join(f'<li><b>{e(kp.get("herausforderung","").split("_hf_")[-1] or kp.get("position"))}</b> — {e(kp.get("konzept",""))}</li>'
                   for kp in S.get("konzept_progression", []))
    dk = S.get("dekontextualisierungs_aufgabe", {})
    body = (f'<h2>Austausch &amp; Transfer</h2>'
            f'<p class="lead">Jetzt vergleicht ihr eure beiden Fälle und findet die gemeinsame Regel.</p>'
            f'<div class="sg-label">Das habt ihr gelernt</div><ul class="ress">{prog}</ul>'
            f'<div class="block accent"><h3>Variante GA — Austausch in der Gruppe (Jigsaw)</h3>{runden}</div>'
            f'<div class="block"><h3>Variante EA — alleine</h3><p>{e(ap.get("einzelauftrag",""))}</p></div>'
            f'<div class="block"><h3>Variante PL — im Plenum</h3><p>{e(ap.get("einzelarbeit_plenum",""))}</p></div>'
            f'<div class="block accent"><h3>Transfer-Aufgabe ({e(dk.get("gewicht_prozent",""))}%)</h3>'
            f'<p class="lead">{e(dk.get("auftrag",""))}</p>'
            f'<p class="hint">{e(dk.get("format",""))}</p>'
            f'<div class="tradeoff"><span class="t">Die Grundregel:</span> {e(dk.get("ziel",""))}</div>{lines(40)}</div>')
    page("", "DOC · Austausch & Transfer", "Set-Abschluss", body)

# ---------- DOC-KN ----------
def doc_kn():
    h = K.get("hybrid_situation", {})
    amap = "".join(f'<li><b>aus {e(m.get("hf_letter",""))}:</b> {e(m.get("scene_element",""))}</li>'
                   for m in h.get("alignment_note",{}).get("herausforderungen_mapping", []))
    body1 = (f'<h2>Kompetenznachweis</h2>'
             f'<div class="cards"><div class="card"><h4>Das bist du</h4><div class="big">{e(h.get("persona",{}).get("beruf",""))}</div>'
             f'<div class="sub">{e(h.get("persona",{}).get("betrieb",""))}, {e(h.get("persona",{}).get("ort",""))}</div></div></div>'
             f'<div class="situation"><p>{e(h.get("text",""))}</p></div>'
             f'<div class="leitfrage-haupt">{e(h.get("leitfrage",""))}</div>'
             f'<div class="block"><h3>Was hier zusammenkommt</h3><ul class="ress">{amap}</ul></div>')
    page("kn", "DOC-KN · Hybrid-Herausforderung", "Das zeigst du", body1)

    # KN-Typen
    tb = ""
    for t in K.get("kn_typen", []):
        ablauf = "".join(f"<li>{e(x)}</li>" for x in t.get("ablauf", []))
        items = ""
        if t.get("fragestruktur"):
            items = "<ol class='kn-q'>" + "".join(f'<li><span class="ks">K{q.get("k_stufe")}</span> {e(q.get("frage",""))}</li>' for q in t["fragestruktur"]) + "</ol>"
        elif t.get("aufgaben"):
            items = "<ol class='kn-q'>" + "".join(f'<li><span class="ks">K{q.get("k_stufe")}</span> {e(q.get("aufgabe",""))}</li>' for q in t["aufgaben"]) + "</ol>"
        elif t.get("reflexionsfragen"):
            items = "<ol class='kn-q'>" + "".join(f"<li>{e(x)}</li>" for x in t["reflexionsfragen"]) + "</ol>"
        modi = " · ".join(t.get("sprachmodi", []))
        tb += (f'<div class="block accent"><h3>{e(t.get("label",""))}</h3>'
               f'<p class="hint"><b>Format:</b> {e(t.get("format",""))} &nbsp;|&nbsp; <b>Sprachmodi:</b> {e(modi)}</p>'
               f'<ul class="ablauf">{ablauf}</ul>{items}</div>')
    page("kn", "DOC-KN · Prüfformen", "Drei Wege (Fachgespräch = Standard)", f'<h2>So kannst du den Nachweis machen</h2>{tb}')

    # Rubrik
    r = K.get("rubrik_shared", {})
    head = "<tr><th>Kriterium</th><th>Dim.</th>" + "".join(f"<th>Stufe {i}</th>" for i in range(4)) + "</tr>"
    body = ""
    for k in r.get("kriterien", []):
        st = "".join(f"<td>{e(s)}</td>" for s in k.get("stufen", []))
        intg = f'<br><span class="intg">{e(k.get("_integriert",""))}</span>' if k.get("_integriert") else ""
        body += f'<tr><td><b>{e(k.get("name",""))}</b>{intg}</td><td>{e(k.get("dimension",""))}</td>{st}</tr>'
    niv = " &nbsp;·&nbsp; ".join(f'<b>{e(n.get("label",""))}:</b> {e(n.get("definition",""))}' for n in r.get("niveaubaender", []))
    body3 = (f'<h2>Bewertung (bi-dimensional)</h2>'
             f'<p class="hint">Zwei getrennte Noten: Sprache (SuK) und Inhalt (Ges).</p>'
             f'<table class="rubrik"><thead>{head}</thead><tbody>{body}</tbody></table>'
             f'<p class="niv">{niv}</p>')
    page("kn", "DOC-KN · Bewertung", "Bi-dimensionale Rubrik", body3)

# ---------- Dossier ----------
def doc_dossier():
    def nug(n):
        tag = (n.get("tag","") or "").lower(); tag = tag if tag in ("a","b") else "ab"
        fk = ""
        for f in n.get("fakten_anker", []):
            if f.get("validiert"): fk += f'<span class="fk-ok">✓ geprüft · {e(f.get("quelle",""))}</span> '
            elif f.get("lp_pruefen"): fk += f'<span class="fk-pr">⚠ LP prüfen: {e(f.get("wert",""))}</span> '
        return (f'<div class="nugget tag-{tag}"><div class="ntop"><span class="ncode">{nugcode(n.get("id",""))}</span>'
                f'<h3>{e(n.get("titel",""))}</h3></div><p>{e(n.get("inhalt",""))}</p>'
                f'<div class="bsp"><b>Beispiel:</b> {e(n.get("beispiel",""))}</div>'
                + (f'<div class="fakt">{fk}</div>' if fk else "") + "</div>")
    nugs = D.get("nuggets", [])
    pa = "".join(nug(n) for n in nugs if n.get("tag")=="A")
    pb = "".join(nug(n) for n in nugs if n.get("tag")=="B")
    page("", "Dossier · Wissen", "Hier schlägst du nach",
         f'<h2>Dein Wissens-Dossier</h2><div class="dossier-intro"><p><b>So benutzt du es:</b> nicht von vorne lesen. '
         f'Bei einer Frage beim Anker nachschlagen, z. B. <span class="anker">Dossier | Nugget A-02</span>.</p></div>{pa}{pb}')

    # Sprachhilfe
    sh = ""
    for sc in D.get("sprachmodi_scaffolds", []):
        sgv = sc.get("so_gehst_du_vor", [])
        def _clean(x): return re.sub(r"^\d+\.\s*", "", x)
        steps = "".join(f'<div class="schritt"><span class="n">{i}</span><span class="txt">{e(_clean(x))}<span class="of">Schritt {i} von {len(sgv)}</span></span></div>'
                        for i,x in enumerate(sgv,1))
        sa = "".join(f"<li>{e(x)}</li>" for x in sc.get("satzanfaenge", []) if x)
        sh += (f'<div class="block accent"><h3>Herausforderung {e(sc.get("tag",""))} — {e(sc.get("modus_label",""))}</h3>'
               f'<div class="sg-label">Satzanfänge</div><ul>{sa}</ul>{steps}</div>')
    tw = D.get("transfer_wissensblatt", {})
    aus = tw.get("austausch_scaffolds", {})
    ausa = "".join(f"<li>{e(x)}</li>" for x in aus.get("satzanfaenge", []) if x)
    page("", "Dossier · Sprachhilfe", "So schreibst du",
         f'<h2>So schreibst du Schritt für Schritt</h2>{sh}'
         f'<div class="block"><h3>Das Grundprinzip</h3><p class="lead">{e(tw.get("prinzip_in_einfach",""))}</p>'
         f'<p>{e(tw.get("fachsystematik",""))}</p><div class="sg-label">Austausch — Satzanfänge</div><ul>{ausa}</ul></div>')

    # Glossar
    g = "".join(f'<div class="gloss"><span class="gb">{e(x.get("begriff",""))}</span> — <span class="ge">{e(x.get("erklaerung_a2",""))}</span> <span class="gx">Bsp.: {e(x.get("beispiel",""))}</span></div>' for x in D.get("glossar", []))
    page("", "Dossier · Glossar", "Schwierige Wörter", f'<h2>Glossar</h2><div class="glossar">{g}</div>')

# ---------- assemble ----------
def deckblatt():
    leg = ('<div class="legend">'
           '<div class="it"><span class="sw" style="background:#C0392B"></span> A — Lehrvertrag verstehen</div>'
           '<div class="it"><span class="sw" style="background:#1A5276"></span> B — Hilfe holen</div>'
           '<div class="it"><span class="sw" style="background:#0E6E3A"></span> Dossier — Wissen nachschlagen</div></div>')
    page("", "EBA · Start", f'{e(P.get("modul",""))} · {e(P.get("kompetenz_nr",""))}',
         f'<h1>Mein Lehrvertrag — und wer mir hilft</h1>'
         f'<p class="lead">{e(P.get("kern_kompetenzversprechen",""))}</p>'
         f'<div class="block accent"><h3>So arbeitest du</h3>{leg}'
         f'<p class="hint" style="margin-top:4mm">Hängst du bei einer Frage? Schau im Dossier nach — jede Frage zeigt dir die Stelle.</p></div>')

CSS = open(os.path.join(BASE,"_eba_print.css"),encoding="utf-8").read() if os.path.exists(os.path.join(BASE,"_eba_print.css")) else ""

deckblatt(); doc_s(A,"A"); doc_s(B,"B"); doc_austausch(); doc_kn(); doc_dossier()

HTML = f"""<!doctype html><html lang="de-CH"><head><meta charset="utf-8">
<title>EBA Print (data-complete) — 1.1.1</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>
<div class="noprint">EBA Print — <b>data-complete</b> aus den 6 JSONs generiert. Drucken → PDF (A4). Jedes JSON-Feld ist gerendert.</div>
{''.join(OUT)}
</body></html>"""
open(os.path.join(BASE,"1.1.1_PRINT_full.html"),"w",encoding="utf-8").write(HTML)
print("geschrieben: 1.1.1_PRINT_full.html  ·  Seiten:", len(OUT))
