# Cherry-pick plan — porting round 1 onto the live site

Status: **agreed, not started.** Round 1 entries are evidence; nothing here has been ported. Do this work on a fresh branch off `main`, not on `bakeoff/round-1`.

## Shape of the work

- Branch off `main` (suggested `redesign/round-1-port`), normal branch → PR → merge.
- **The entries are single self-contained HTML files; the live site is not.** Ported CSS goes back into `styles.css`, JS into `script.js`, markup into `index.html`, and the bear stays a real file in `icons/`, not a data URI. Do not merge an entry wholesale — it will collapse the three-file structure and inline a 3.3KB SVG four times.
- `CNAME` must survive the port (`grizzly-enterprise.com`, GitHub Pages).
- Re-run `node bakeoff/gates.mjs <file>` and `node bakeoff/shoot.mjs` against the ported result. Both harnesses work on any HTML file; `gates.mjs` covers the mechanical subset of the twelve gates and the site must still pass every one.

## What to take

| From | Take | Why |
| ---- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| D    | Ledger structure, ARIA plumbing, scroll-spy, masked-bear motif, hero spec strip  | Best-verified engineering in the round; judge confirmed it in a live DOM probe |
| C    | Section rhythm and the full-bleed statement band                                 | Best composition; no dead zones                                             |
| A    | The full-bleed gold inversion band (black type on gold)                          | The single best idea in the round and the strongest thumbnail read          |
| —    | A display face that is nobody's default                                          | See open decision below                                                     |

A's band and C's statement band do the same structural job — one full-bleed interruption between hero and offer. Pick one, don't stack both.

## Fix on the way in

The convergent failures, which every entry shipped and which will otherwise travel with the borrowed code:

- **Pin an accessible gold.** The ledger's numbered ordinals want a dark gold; A landed at 3.09:1 and D at 4.34:1. Set a token floor at ≥ 4.5:1 for anything under 18px and use it everywhere — this was the round's only gate failure and it recurred three times independently.
- **Add `scroll-margin-top` / `scroll-padding-top`** matching the sticky header height. 4/4 entries omitted it; all four are one padding change from a live bug.
- **Drop `body { overflow-x: hidden }`.** Judges forced it off in A, C and D and measured zero overflow — it is dead defence inherited from the base, and it forces `overflow-y: auto` onto `<body>`, which breaks `position: sticky`.
- **`…` not `...`** in the message placeholder and the "Sending" state.
- **No hover affordance on non-interactive rows.** B, C and D all paint hover states on ledger rows or chips that aren't links — inert on touch, and it promises a click that doesn't exist.
- **Add `touch-action: manipulation`, `-webkit-tap-highlight-color` and `env(safe-area-inset-*)`** — absent from all four, on a full-bleed dark mobile shell.

Carried with specific pieces:

- Taking **D's** ledger: cut "We read every message and reply ourselves" — the one line on any entry asserting an unverified operational fact — and guard `.nav a[aria-current]` with `:not(.btn)` alongside the existing guards, or the gold-on-gold CTA bug returns.
- Taking **C's** statement band: give it a real `<h2>`. It ships as a 4rem `<p>` that two navs link to, so heading navigation skips the second-largest type on the page. Do not take C's 10.9px uppercase mono for form labels or CTAs.
- Taking **A's** band: A's in-page nav is `preventDefault`ed without moving focus or updating `location.hash` — don't port that handler; keep the base's simpler smooth scroll, or fix focus and hash properly.

## Open decision — the display face

The one thing needing a human call. C used Libre Bodoni, D used Fraunces (flagged by the design hook as an overused/AI-default face, and its changelog claims soft/wonk axes the font request never asks for). A stayed on a grotesque and got its contrast from an optical two-line lockup — which, measured, is ~20px out of alignment in both A and B.

Pick a face deliberately rather than inheriting one from an entry.

## Also worth keeping

The base's own defects are all fixed in every entry and must stay fixed: `CONFERENCE/TRADESHOW` no longer clipping, `color-scheme: dark` plus a matching `theme-color`, the dead `.about-*` CSS gone, no `!important` colour rules, no `top: -200vh` bleed hack, no `min-height: 100vh` dead gap over the form, `prefers-reduced-motion` honoured, and the form status announced via `role="status"` with text labels rather than colour alone.
