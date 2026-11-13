#!/usr/bin/env python3
"""Serve src/ with the type and colour lab injected into the home page.

    python3 scripts/lab-server.py [port]      # default 3148

Local only. The lab lives in design-exploration/type-lab/ and is never copied
into src/, so it cannot be deployed. Fetch its fonts first with
`sh design-exploration/type-lab/fetch-fonts.sh`.
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'src'
LAB = ROOT / 'design-exploration' / 'type-lab'
INJECT = b'<script type="module" src="/lab/lab.js"></script>\n</body>'


class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        clean = path.split('?', 1)[0].split('#', 1)[0]
        if clean.startswith('/lab/'):
            target = (LAB / clean[len('/lab/'):]).resolve()
            return str(target) if LAB in target.parents else str(LAB / 'missing')
        return super().translate_path(path)

    def do_GET(self):
        if self.path.split('?', 1)[0] in ('/', '/index.html'):
            body = (SRC / 'index.html').read_bytes().replace(b'</body>', INJECT, 1)
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3148
    handler = lambda *args, **kwargs: Handler(*args, directory=str(SRC), **kwargs)  # noqa: E731
    print(f'Type lab: http://127.0.0.1:{port}/')
    ThreadingHTTPServer(('127.0.0.1', port), handler).serve_forever()
