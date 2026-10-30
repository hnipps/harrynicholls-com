"""Build isolated, complete theme documents from the preserved studies and real case studies."""
from pathlib import Path
import re

HERE = Path(__file__).resolve().parent
SOURCE = HERE.parent
THEMES = ['personal-letter', 'signal-press', 'symbols-pixels', 'minimal-data', 'working-index']
STORIES = re.findall(r'<section class="story" id="([^"]+)">(.*?)</section>', (SOURCE / 'project-stories.html').read_text(), re.S)


def disclosures():
    sections = []
    for slug, content in STORIES:
        if slug == 'gitrove':
            continue
        heading, body = content.split('</h2>', 1)
        sections.append(f'<section class="story complete-story" id="{slug}">{heading}</h2><details><summary>Read the full case study</summary>{body}</details></section>')
    return ''.join(sections)


def adapt_paths(page):
    page = page.replace('../src/assets/', '../../../src/assets/')
    page = page.replace('src="screenshots/', 'src="../../screenshots/')
    page = re.sub(r'(href|src)="(prototype\.(?:css|js)|reading-studies.css|symbols-pixels\.(?:css|js)|minimal-data\.(?:css|js))"', r'\1="../../\2"', page)
    page = page.replace('project-stories.html#', '#')
    page = page.replace('href="index.html"', 'href="../../index.html" target="_top"')
    page = page.replace('Back to directions', 'Design exploration')
    def unframe_external(match):
        anchor = match.group(0)
        if 'target=' not in anchor:
            anchor = anchor[:-1] + ' target="_blank" rel="noopener noreferrer">'
        return anchor
    page = re.sub(r'<a\b[^>]*href="https?://[^>]+>', unframe_external, page)
    return page


for theme in THEMES:
    page = (SOURCE / f'{theme}.html').read_text()
    if theme == 'personal-letter':
        def fill_question(match):
            entry = match.group(0)
            for slug, content in STORIES:
                if slug != 'gitrove' and f'project-stories.html#{slug}' in entry:
                    intro = re.search(r'<div class="entry-content">(<p>.*?</p>)', entry, re.S).group(1)
                    notes = f'<section class="story complete-story" id="{slug}">{content}</section>'
                    entry = re.sub(r'<div class="entry-content">.*</div></details>$', f'<div class="entry-content">{intro}{notes}</div></details>', entry, flags=re.S)
                    break
            return entry
        page = re.sub(r'<details class="letter-entry">.*?</details>', fill_question, page, flags=re.S)
    else:
        page = page.replace('</main>', disclosures() + '</main>', 1)
    # The under-sheet stays still. Its real controls remain live once it is exposed.
    page = page.replace('</head>', '<link rel="stylesheet" href="theme-content.css"><script src="theme-content.js" defer></script></head>')
    (HERE / 'themes' / f'{theme}.html').write_text(adapt_paths(page))

# The final sheet deliberately uses browser defaults: the punchline is still a complete website.
links = ''.join(f'<li><a href="#{slug}">{re.sub(r"<.*?>", "", content.split("</h2>")[0])}</a></li>' for slug, content in STORIES)
sections = ''.join(f'<section id="{slug}">{content}</section>' for slug, content in STORIES)
raw = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Harry Nicholls — HTML, finally</title>
<link rel="stylesheet" href="bare-html.css">
<script src="theme-content.js" defer></script></head>
<body><header><h1>Harry Nicholls’s home page</h1><p>Welcome to my corner of the World Wide Web.</p><p><em>Well. Under all that design, it’s still a website.</em></p>
<p><button type="button" data-reset-stack>Put the paper back</button></p>
<nav aria-label="Page navigation"><a href="#work">Projects</a> | <a href="#about">About me</a> | <a href="#contact">Email me</a></nav><hr></header>
<main id="main"><p>I’m a product engineer building AI products, agent infrastructure, and useful things for everyday life.</p><p>Currently a Senior Product Engineer at <a href="https://ev.energy/">ev.energy</a>. Independently building <a href="https://gitrove.com">gitrove</a> and <a href="https://github.com/nicholls-inc/crosscheck">Crosscheck</a>.</p>
<section id="work"><h2>My projects</h2><ul>'''+links+'''</ul></section>
<section id="about"><h2>About me</h2><p>I’m a software engineer, a dad of three, and a woodworker, based in the Toronto area and working remotely.</p><p>At ev.energy, I build AI products and their infrastructure: MCP servers, agent gateways, and agentic CI workflows. I care about useful products, strong engineering teams, and work that’s good for people and the planet.</p><p>Away from a screen, you’ll find me with my partner and our three kids, skiing, making coffee, or in the workshop.</p></section>'''+sections+'''</main>
<hr><footer id="contact"><h2>Get in touch!</h2><p><a href="mailto:harry.m.nicholls@gmail.com">harry.m.nicholls@gmail.com</a></p><p><a href="https://github.com/hnipps">GitHub</a> | <a href="https://brainflow.substack.com/">Substack</a> | <a href="https://harrynicholls.medium.com/">Medium</a> | <a href="https://www.linkedin.com/in/harry-nicholls-91779959/">LinkedIn</a> | <a href="https://x.com/harrynicholls">X</a></p><p><button type="button" data-reset-stack>Put the paper back</button></p><p>© 2026 Nicholls Inc.</p></footer></body></html>'''
(HERE / 'themes' / 'bare-html.html').write_text(adapt_paths(raw))
print('Built six complete, isolated theme documents.')
