#!/usr/bin/env python3
"""Saytning ildiz yo'lini (base path) o'zgartirish.

GitHub Pages'da loyiha sayti `https://user.github.io/repo/` manzilida turadi, shuning uchun
`/books`, `/main.css`, `/models/...` kabi ildizdan boshlanadigan yo'llar ishlamaydi.
Bu skript barcha shunday yo'llarga prefiks qo'shadi (yoki olib tashlaydi).

    python3 set_base.py /trevornoah-clone   # prefiks qo'shish
    python3 set_base.py /                   # ildizga qaytarish (localhost uchun)
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
STATE = os.path.join(ROOT, ".basepath")
CHUNK = os.path.join(ROOT, "chunk-022tjzda.js")


def current() -> str:
    if os.path.exists(STATE):
        return json.load(open(STATE)).get("base", "")
    return ""


def main() -> None:
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    new = "/" + sys.argv[1].strip("/")
    new = "" if new == "/" else new
    old = current()
    if old == new:
        print(f"base allaqachon '{new or '/'}'")
        return

    def strip(p: str) -> str:
        return p[len(old):] if old and p.startswith(old + "/") else p

    n = 0
    for f in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True):
        s = open(f, encoding="utf-8").read()
        o = s

        def fix(m):
            attr, path = m.group(1), m.group(2)
            return f'{attr}="{new}{strip(path)}"'

        s = re.sub(r'(src|href)="(/[^"]*)"', fix, s)
        s = re.sub(
            r'srcset="([^"]*)"',
            lambda m: 'srcset="'
            + ", ".join(
                (new + strip(p.strip().split(" ")[0]) + (" " + " ".join(p.strip().split(" ")[1:]) if len(p.strip().split(" ")) > 1 else ""))
                if p.strip().startswith("/")
                else p.strip()
                for p in m.group(1).split(",")
            )
            + '"',
            s,
        )
        if s != o:
            open(f, "w", encoding="utf-8").write(s)
            n += 1

    # WebGL asset yo'li (GLB / KTX2 / basis)
    js = open(CHUNK, encoding="utf-8").read()
    js = re.sub(r'this\.path="[^"]*"', f'this.path="{new}"', js, count=1)
    js = js.replace(f'setTranscoderPath({old}"/basis/")', 'setTranscoderPath(this.path+"/basis/")')
    open(CHUNK, "w", encoding="utf-8").write(js)

    json.dump({"base": new}, open(STATE, "w"))
    print(f"base: '{old or '/'}' -> '{new or '/'}'  ({n} ta HTML yangilandi)")


if __name__ == "__main__":
    main()
