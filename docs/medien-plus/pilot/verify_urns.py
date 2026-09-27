"""Verifiziert SRF-URNs über den öffentlichen Integration Layer (ohne Auth).
Aufruf: python verify_urns.py urn1 urn2 ...  (oder Datei mit einer URN pro Zeile via @datei)"""
import json, sys, urllib.request, urllib.error

IL = "https://il.srgssr.ch/integrationlayer/2.0/mediaComposition/byUrn/{}.json"

def check(urn):
    try:
        with urllib.request.urlopen(IL.format(urn), timeout=30) as r:
            comp = json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return {"urn": urn, "status": f"HTTP {e.code}"}
    except Exception as e:
        return {"urn": urn, "status": f"ERR {e}"}
    cm = comp.get("chapterUrn")
    chapters = comp.get("chapterList", [])
    # Segment suchen, falls URN ein Segment ist
    hit = None
    for ch in chapters:
        if ch.get("urn") == urn:
            hit = ch
        for seg in ch.get("segmentList") or []:
            if seg.get("urn") == urn:
                hit = dict(seg, _chapter=ch)
    if hit is None and chapters:
        hit = chapters[0]
    ch = hit.get("_chapter", hit)
    return {
        "urn": urn,
        "status": "OK",
        "title": hit.get("title"),
        "show": (comp.get("show") or {}).get("title"),
        "date": (hit.get("date") or ch.get("date") or "")[:10],
        "dur_min": round((hit.get("duration") or 0) / 60000, 1),
        "blockReason": hit.get("blockReason") or ch.get("blockReason"),
        "validTo": hit.get("validTo") or ch.get("validTo"),
        "segment": "_chapter" in hit,
    }

args = sys.argv[1:]
if args and args[0].startswith("@"):
    args = [l.strip() for l in open(args[0][1:], encoding="utf-8") if l.strip()]
for u in args:
    print(json.dumps(check(u), ensure_ascii=False))
