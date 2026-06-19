#!/usr/bin/env python
"""
Repair double-encoded (cp1252-misread) UTF-8 mojibake in the prompt-builder
sub-app and its data, using ftfy. Mixed-corruption safe: ftfy only fixes spans
that are genuinely mojibake and leaves correct UTF-8 (e.g. clean 'ae'->ae) alone.

Usage:
  python scripts/fix-mojibake.py            # dry-run: report only
  python scripts/fix-mojibake.py --write     # rewrite files in place (UTF-8, no BOM, LF/CRLF preserved)
"""
import sys, os, subprocess

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

try:
    import ftfy
except ImportError:
    # The upstream hko-deploy sources are byte-for-byte copied in by
    # import-nrlp-graph.ps1, so this repair has to run after every import.
    # Bootstrap ftfy so the import step never fails on a fresh checkout.
    print("ftfy not found - installing ...")
    subprocess.run([sys.executable, "-m", "pip", "install", "--quiet", "ftfy"], check=True)
    import ftfy

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Sequences ftfy leaves alone because their middle byte decodes to a legit
# character (e.g. an en-dash), so it can't tell they're mojibake. These are the
# toggle arrows in render.js. Mapping: doubly-encoded form -> correct glyph.
EXPLICIT_FIXES = {
    "â–¾": "▾",  # â–¾ -> ▾  (open / expanded)
    "â–¸": "▸",  # â–¸ -> ▸  (collapsed)
}

FILES = [
    "public/nrlp/prompt-builder/render.js",
    "public/nrlp/prompt-builder/prompts.js",
    "public/nrlp/prompt-builder/state.js",
    "public/nrlp/prompt-builder/app.js",
    "public/nrlp/prompt-builder/index.html",
    "public/nrlp/prompt-builder/style.css",
    "public/nrlp_3j.json",
    "public/nrlp_2j.json",
    "public/nrlp_4j.json",
]

def show_diffs(orig, fixed, path, limit=8):
    # report up to `limit` changed line samples
    o = orig.splitlines()
    f = fixed.splitlines()
    n = 0
    for i, (a, b) in enumerate(zip(o, f)):
        if a != b:
            n += 1
            if n <= limit:
                print(f"  L{i+1}:")
                print(f"    - {a.strip()[:90]!r}")
                print(f"    + {b.strip()[:90]!r}")
    if n > limit:
        print(f"  ... and {n-limit} more changed lines")
    return n

def main():
    write = "--write" in sys.argv
    total_changed = 0
    for rel in FILES:
        p = os.path.join(ROOT, rel)
        if not os.path.exists(p):
            print(f"MISSING  {rel}")
            continue
        with open(p, "rb") as fh:
            raw = fh.read()
        had_bom = raw.startswith(b"\xef\xbb\xbf")
        text = raw.decode("utf-8-sig")
        fixed = ftfy.fix_encoding(text)
        for bad, good in EXPLICIT_FIXES.items():
            fixed = fixed.replace(bad, good)
        if fixed == text:
            print(f"CLEAN    {rel}")
            continue
        changed = sum(1 for a, b in zip(text.splitlines(), fixed.splitlines()) if a != b)
        total_changed += changed
        print(f"MOJIBAKE {rel}  ({changed} lines)")
        show_diffs(text, fixed, rel)
        if write:
            out = fixed.encode("utf-8")
            if had_bom:
                out = b"\xef\xbb\xbf" + out
            with open(p, "wb") as fh:
                fh.write(out)
            print(f"  -> written ({'with' if had_bom else 'no'} BOM)")
    print(f"\nTotal changed lines: {total_changed}  ({'WRITTEN' if write else 'dry-run'})")

if __name__ == "__main__":
    main()
