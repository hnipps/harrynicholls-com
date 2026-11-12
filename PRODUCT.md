# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Primary: hiring managers, recruiters and the AI agents that screen for them, evaluating Harry for a senior engineering role. They arrive from a CV link, LinkedIn or a search and give the page about a minute.
- Secondary: peer engineers, founders and potential users of gitrove and Crosscheck who want to know who is behind the work.
- AI agents are a first-class reader. The page must be legible as plain HTML without running JavaScript, alongside `llms.txt` and the JSON-LD profile.

## Product Purpose

harrynicholls.com is Harry Nicholls's personal site. It is his resume with character: a reader should understand his track record quickly, get a sense of him as a person, and know how to get in touch. Success is a hiring reader contacting him, and a peer following his work or trying a project.

## Positioning

A resume that also shows the person. Harry is a Senior Product Engineer at ev.energy building AI products and agent infrastructure, founder of gitrove and Crosscheck, who uses formal methods (Dafny, Lean 4) to verify AI-generated code. Taste in music, personal photos and real commit activity sit beside the work as evidence of the person.

## Operating Context

- Static site. `src/` holds committed build output, built by `scripts/build-portfolio.py`, checked by `scripts/check-links.py`, and synced to S3 by GitHub Actions on push to `main`.
- The home page replaces the paper-stack experience, which is retired from the deployed site.

## Capabilities and Constraints

- Resume carries selected work, not a full role-by-role history. "Selected work" means professional employment: the current role at ev.energy and a few past roles.
- Side projects (gitrove, Crosscheck and the other case studies) are their own section, after selected work and before the commit graph.
- Contact appears twice: near the top of the page, above the fold, and in the footer below writing.
- An album gallery is a primary personality element. A personal photo album is included and is secondary to the albums.
- Albums and photos are hand-curated in the repo.
- A stylized commit graph is built from real GitHub contributions by a scheduled GitHub Action, so the deployed page stays plain HTML.
- Undecided: which albums and photos, and which past roles count as highlights. Harry supplies these.

## Brand Commitments

- Name: Harry Nicholls. Domain: harrynicholls.com.
- References Harry made binding for this reshape: the layout and feel of hamiltonulmer.com (a resume with character), the album gallery and secondary photo album of jrhu.me, and the stylized commit graph of marcelochaman.com.
- Simple and easy to read, for humans and AI agents.
- Standing preference: the plain personal-site convention, played straight. Character comes from typography and colour choices made with taste, not from a flashy page or a governing metaphor. The three reference sites set the craft bar.

## Evidence on Hand

- Summary, projects, profiles and contact: `src/llms.txt` and the JSON-LD in `src/index.html`.
- Five project case studies with screenshots: gitrove, Crosscheck, opsdeck, GoHome, Covered (`src/portfolio.html`, `src/assets/`).
- Portraits: `src/assets/hi-im-harry*.png`.
- Writing: Brainflow on Substack, older posts on Medium.
- Not on hand, do not fabricate: past employers, titles and dates; the album list and cover art; personal photos; testimonials.

## Product Principles

1. Resume first. A hiring reader gets the track record without scrolling past decoration.
2. Personality is evidence, not ornament. Albums, photos and commits are real and Harry's own.
3. Readable by machines. Content is in the HTML, in order, with no script required.
4. Simple beats clever. One page a reader finishes, over an experience they have to operate.
