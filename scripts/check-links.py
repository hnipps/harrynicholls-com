"""Fail if a page in src/ references a local URL that CloudFront's S3 origin cannot serve.

The distribution uses the S3 REST endpoint, so only "/" maps to index.html. A
reference to a directory or a file that is not in src/ returns 403 in production
even when a local dev server resolves it.
"""
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / 'src')
HOST = 'https://site.test'

HTML_ATTR = re.compile(r'''\b(?:href|src|poster)\s*=\s*["']([^"'#][^"']*)["']''')
CSS_URL = re.compile(r'''url\(\s*["']?([^"')#][^"')]*?)["']?\s*\)''')
JS_PATH = re.compile(
    r'''["'`]((?:\.{0,2}/)[^"'`\s${}]+\.(?:html|css|js|png|jpe?g|svg|webp|gif|mp4|json|txt|xml|woff2?))["'`]''')
BASE = re.compile(r'''<base\s+href=["']([^"']+)["']''')


def references(path, text):
    refs = CSS_URL.findall(text)
    if path.suffix == '.html':
        refs += HTML_ATTR.findall(text)
    if path.suffix == '.js':
        refs += JS_PATH.findall(text)
    return refs


problems = {}
for path in sorted(ROOT.rglob('*')):
    if path.suffix not in {'.html', '.css', '.js'}:
        continue
    text = path.read_text(errors='ignore')
    page = '/' + path.relative_to(ROOT).as_posix()
    base_tag = BASE.search(text)
    base = urljoin(HOST + page, base_tag.group(1)) if base_tag else HOST + page
    for ref in references(path, BASE.sub('', text)):
        if ref.startswith(('data:', 'mailto:', 'tel:', 'javascript:', '{', '$')):
            continue
        url = urlparse(urljoin(base, ref))
        if url.netloc != urlparse(HOST).netloc or url.path == '/':
            continue
        target = ROOT / unquote(url.path).lstrip('/')
        if target.is_file():
            continue
        reason = 'directory URL' if target.is_dir() else 'missing file'
        problems.setdefault((url.path, reason), set()).add(page)

for (url_path, reason), pages in sorted(problems.items()):
    print(f'{reason}: {url_path} (from {", ".join(sorted(pages))})')
print(f'{len(problems)} unservable references under {ROOT}')
sys.exit(1 if problems else 0)
