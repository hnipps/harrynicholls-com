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

- Static site. `src/` holds committed build output. `scripts/build-home.py` generates the commit graph, albums and photos regions of `src/index.html` from `content/`; `scripts/check-links.py` checks every local reference; GitHub Actions syncs `src/` to S3 on push to `main` and once a day.
- The home page replaces the earlier personal-letter landing page. The paper-stack experience before it is already retired.

## Capabilities and Constraints

- Resume carries selected work, not a full role-by-role history. "Selected work" means professional employment: the current role at ev.energy and a few past roles.
- Side projects (gitrove, Crosscheck and the other case studies) are their own section, after selected work and before the commit graph.
- Contact appears twice: near the top of the page, above the fold, and in the footer below writing.
- An album gallery is a primary personality element. A personal photo album is included and is secondary to the albums.
- Albums and photos are hand-curated in the repo.
- A stylized commit graph is built from real GitHub contributions by a scheduled GitHub Action, so the deployed page stays plain HTML.
- Selected work lists ev.energy, Restaurant Brands International, SpotHero, Rangle.io and Northstar Robotics. The Flyfish Club and Seed Club contracts, the consulting years and education fold into one "Earlier" entry.
- Side projects are the ones under Projects on Harry's resume: gitrove, Crosscheck and Recommender. The other case studies stay in `src/portfolio.html`.
- Undecided: which albums and photos. Both sections ship as placeholders until Harry fills `content/albums.json` and `content/photos.json`.

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
- Work history, from Harry's current resume (newest first):
  - Senior Product Engineer, ev.energy, remote, 04/2024 to present. Smart charging for EVs.
  - Tech Lead, Restaurant Brands International (Tim Hortons), Toronto, 02/2023 to 04/2024. Led 8 engineers on the Tims app.
  - Software Engineer (contractor), Seed Club, remote, 02/2022 to 12/2022.
  - Project Lead, Flyfish Club NFT launch (contractor), VCR Group, remote, 08/2021 to 01/2022.
  - Senior Engineer I, Front End, SpotHero, Toronto, 03/2020 to 07/2021.
  - Software Developer, Rangle.io, Toronto, 08/2018 to 03/2020.
  - Software Engineer and Project Lead, Northstar Robotics, Winnipeg area, 09/2016 to 07/2018.
  - Consultant, BCS Consulting and Sapient Global Markets, 2013 to 2016.
- Education: MChem, First Class Honours, University of Bath, 2009 to 2013.
- Side projects also include Recommender, a personal film and TV recommender (`src/assets/recommender/`).
- Figures on the page, each taken from Harry's current resume: support tickets fell 11% after the verification re-architecture; 1,249 tool calls in 30 days, 77% from colleagues; LLM code review in 12 repos with about 1,100 reviews in 30 days; the Tims app has over 2 million daily users, and Harry led 8 engineers on it; FlyfishClub.com generated $16m in NFT sales, built by 4 engineers and 1 designer; Recommender has run about 248 experiments and shipped one; gitrove launched 09/2026.
- Harry approved publishing any of the resume's per-role detail, metrics included. Colleagues are not named, and there is no phone number on the site.
- Not on hand, do not fabricate: the album list and cover art; personal photos; testimonials.

## Product Principles

1. Resume first. A hiring reader gets the track record without scrolling past decoration.
2. Personality is evidence, not ornament. Albums, photos and commits are real and Harry's own.
3. Readable by machines. Content is in the HTML, in order, with no script required.
4. Simple beats clever. One page a reader finishes, over an experience they have to operate.
