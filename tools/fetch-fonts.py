#!/usr/bin/env python3
"""Self-host every Google Fonts family a repo uses, static head link and
per-language dynamic loader alike. Writes public/fonts/<slug>.css per family
string plus the woff2 files, then rewrites index.html and _headers."""
import sys, os, re, urllib.request

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36")

def get(url, binary=False):
    r = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(r, timeout=90) as f:
        return f.read() if binary else f.read().decode("utf-8")

def slug(fam):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", fam.lower())).strip("-")

def fetch_family(fam, fontdir):
    css = get(f"https://fonts.googleapis.com/css2?family={fam}&display=swap")
    n = 0
    for u in sorted(set(re.findall(r"url\((https://fonts\.gstatic\.com/[^)]+)\)", css))):
        parts = u.split("/")
        name = f"{parts[4] if len(parts) > 5 else 'font'}-{parts[-1]}"
        path = os.path.join(fontdir, name)
        if not os.path.exists(path):
            open(path, "wb").write(get(u, binary=True))
        css = css.replace(u, "/fonts/" + name)
        n += 1
    return css, n

if __name__ == "__main__":
    repo = sys.argv[1]
    idx = os.path.join(repo, "public/index.html")
    fontdir = os.path.join(repo, "public/fonts")
    os.makedirs(fontdir, exist_ok=True)
    html = open(idx, encoding="utf-8").read()

    # every dynamic per-language family string
    fams = sorted(set(re.findall(r"font:'([^']+)'", html)))
    # the static head link's family list
    m = re.search(r'<link[^>]*href="https://fonts\.googleapis\.com/css2\?([^"]+)"[^>]*>', html)
    static_q = m.group(1) if m else None
    if static_q:
        fams.append(static_q.replace("&display=swap", "").replace("family=", "", 1))

    total = 0
    for fam in fams:
        css, n = fetch_family(fam, fontdir)
        out = os.path.join(fontdir, slug(fam) + ".css")
        open(out, "w", encoding="utf-8").write(css)
        total += n
        print(f"  {slug(fam)[:60]:<60} {n:>3} woff2")
    print(f"TOTAL {total} woff2 references, {len(os.listdir(fontdir))} files in public/fonts")
    print("STATIC SLUG:", slug(fams[-1]) if static_q else "(none)")
