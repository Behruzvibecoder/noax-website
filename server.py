#!/usr/bin/env python3
"""trevornoah.com nusxasi uchun oddiy statik server (to'g'ri MIME + .html fallback)."""
import os, http.server, socketserver

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT", "8080"))

# set_base.py qo'ygan prefiks (GitHub Pages uchun, masalan "/noax-website").
# Lokalda ham ishlashi uchun serverda uni kesib tashlaymiz.
BASE = ""
try:
    import json as _json
    BASE = _json.load(open(os.path.join(ROOT, ".basepath"))).get("base", "")
except Exception:
    pass

EXTRA_MIME = {
    ".wasm": "application/wasm",
    ".glb": "model/gltf-binary",
    ".gltf": "model/gltf+json",
    ".ktx2": "image/ktx2",
    ".exr": "image/x-exr",
    ".webp": "image/webp",
    ".woff2": "font/woff2",
    ".js": "text/javascript",
    ".mjs": "text/javascript",
}


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def guess_type(self, path):
        ext = os.path.splitext(path)[1].lower()
        if ext in EXTRA_MIME:
            return EXTRA_MIME[ext]
        return super().guess_type(path)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def translate_path(self, path):
        if BASE and (path == BASE or path.startswith(BASE + "/")):
            path = path[len(BASE):] or "/"
        fs = super().translate_path(path)
        if os.path.isdir(fs):
            idx = os.path.join(fs, "index.html")
            if os.path.exists(idx):
                return idx
            if os.path.exists(fs.rstrip("/") + ".html"):
                return fs.rstrip("/") + ".html"
        if not os.path.exists(fs) and os.path.exists(fs + ".html"):
            return fs + ".html"
        return fs

    def send_error(self, code, message=None, explain=None):
        """Topilmagan sahifalar uchun saytning o'z 404 sahifasini ko'rsatish."""
        page = os.path.join(ROOT, "404.html")
        if code == 404 and os.path.exists(page) and "." not in os.path.basename(self.path):
            body = open(page, "rb").read()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)

    def log_message(self, fmt, *args):
        code = str(args[1]) if len(args) > 1 else ""
        if code.startswith("4") or code.startswith("5"):
            super().log_message(fmt, *args)


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True

    def handle_error(self, request, client_address):
        # Brauzer so'rovni bekor qilganda chiqadigan shovqinni yashiramiz
        import sys
        exc = sys.exc_info()[0]
        if exc in (BrokenPipeError, ConnectionResetError):
            return
        super().handle_error(request, client_address)


with Server(("0.0.0.0", PORT), Handler) as httpd:
    print(f"serving {ROOT} on 0.0.0.0:{PORT}")
    httpd.serve_forever()
