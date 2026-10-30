# Scroll pass-through and visitor-facing cleanup

Reproduced the reported unresponsiveness after a peel at phone width: an expanded sheaf's transparent hover bridge was the hit-test target at (220,500), and a 350px wheel event left the current document at scrollY=0. The host intentionally has overflow hidden because the actual page scrolls inside an iframe. Events on the host's navigation cannot naturally scroll that document.

The transparent bridge now has pointer-events disabled. Wheel input directly over the paper navigation is forwarded to the current document and closes the fan. A one-finger pan that starts on a paper also scrolls that document, while suppressing the following synthetic tap. Keyboard activation, ordinary mouse clicks, and subsequent taps retain their normal selection behavior. Motion and page-location rules are unchanged.

Removed the redundant Project atlas shortcut from its source. The generated theme documents no longer include a link back to the exploration gallery. Only the theme runtime is built into src, so the research gallery remains development source rather than a visitor-facing site route.

The dedicated regression uses actual wheel input after every normal-motion peel at desktop and phone widths, both over the former hover bridge and over an exposed paper. It also uses an actual touch pan and verifies scrolling without selection. All six generated views are checked for the removed shortcut and exploration links. No browser runtime exceptions were observed.
