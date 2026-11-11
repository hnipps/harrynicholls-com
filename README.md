# HarryNicholls.com

Source code for my personal website.

## Home page

`src/index.html` is written by hand. Its stylesheet, script and fonts are in
`src/landing/`. The look comes from the Slow Victory toolkit v0.4: Hyperlegible
Sans, Space Grotesk labels, the Casimir Dunmore hand, photocopy-grey palette.
`PRODUCT.md` says who the page is for.

`npm run build` publishes the six older portfolio views to
`src/portfolio-views/`. They are no longer linked from the home page, and the
build no longer writes `src/index.html`.

The fonts in `src/landing/fonts/` are Latin subsets, all SIL OFL 1.1, with
their licence files beside them. `scripts/subset-landing-fonts.py` remakes them.

Merging to `main` deploys to production.
