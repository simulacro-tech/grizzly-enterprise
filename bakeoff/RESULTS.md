# Bake-off Results — Grizzly Enterprise

## Round 1 — bold redesign, four contenders

Brief: `bakeoff/BRIEF.md`. Base: `bakeoff/base.html` (the live incumbent, inlined into one file). Ambition dial set to **bold** — visible redesign mandatory, with the failure line "if a side-by-side screenshot is not obviously different, you failed". Twelve hard gates, pass/fail, capping an entry regardless of beauty.

### Scoreboard

| # | Entry                       | Gates     | Crit | Major | Minor | Build tokens | Build time | Judge verdict | Taste |
| - | --------------------------- | --------- | ---- | ----- | ----- | ------------ | ---------- | ------------- | ----- |
| D | redesign-existing-projects  | **12/12** | 0    | 3     | 10    | 108,854      | 8m 26s     | ship-worthy   | **1** |
| C | ui-ux-pro-max               | **12/12** | 0    | 4     | 13    | 120,236      | 9m 23s     | ship-worthy   | 2     |
| A | design-taste-frontend       | 11/12     | 1    | 3     | 9     | 136,072      | 10m 19s    | needs work    | 3     |
| B | impeccable                  | **12/12** | 0    | 2     | 12    | 161,487      | 15m 18s    | ship-worthy   | 4     |

Judging cost a further 492k tokens (four judges, 118–132k each). Round total ≈ 1.02M tokens.

Only one gate failed all round: **A, gate 8 (contrast)** — an 11px/700 label in `--gold-deep #8a6b1f` measuring 3.09:1 on the lead card's tinted background.

### Per entry

**D — redesign-existing-projects · taste rank 1 · ship-worthy.** Warm-black editorial masthead in Fraunces/Archivo, numbered full-bleed ledger rows, hairline spec strip, sticky rail with scroll-spy, split contact, designed footer. The best-verified entry in the round: the judge confirmed the motif bleed, the `:not(.btn)` specificity fix and the ARIA plumbing in a live DOM probe, including re-measuring with `overflow-x` forced visible to rule out a masked overflow. Two one-line edits from shippable — lift `--gold-deep` on the ledger ordinals (4.34:1, currently saved from a gate failure only by being `aria-hidden`) and cut "We read every message and reply ourselves", the one line on the page asserting an unverified operational fact. Its real weakness is the typeface: the changelog claims Fraunces' soft/wonk axes, but the font request asks for `opsz,wght` only and `font-variation-settings` never appears — what ships is visually interchangeable with Playfair Display. A default wearing the description of a decision.

**C — ui-ux-pro-max · taste rank 2 · ship-worthy.** The most compositionally complete entry: Libre Bodoni masthead with an outlined `ENTERPRISE`, numbered index, a full-bleed statement band, best section rhythm of the four, no dead zones. Four majors, and they cluster on the conversion surface — every form label, both hero CTAs and the submit button are set in 10.9px uppercase mono at 0.16em tracking, the hardest-to-scan setting available on the four fields the page funnels toward. The statement band is a 4rem `<p>` with no heading despite two navs linking to it, so heading navigation skips the second-largest type on the page. Its self-reported contrast floor of 5.38:1 is really 4.57:1 once translucent overlays are composited — still passing, with ~1.5% of headroom rather than the ~20% claimed. And the `text-stroke` line backing up the outlined wordmark is not a real CSS property, so the fallback is inert; if the stroke ever fails, an inventory string renders fully invisible rather than degraded.

**A — design-taste-frontend · taste rank 3 · needs work.** The single best idea in the round: a full-bleed gold inversion band, black type on gold, between hero and offer — the only true colour inversion any contender attempted and by far the strongest read at thumbnail size. Zero border-radius as a one-shape rule is held honestly (two declarations in the file, both `0`). But it carries the round's only gate failure, and two majors undercut its own pitch: an unconditional 1.4s `setTimeout` reveals every element regardless of viewport, so the below-fold reveal choreography the changelog sells never actually plays; and in-page navigation is `preventDefault`ed without moving focus or updating `location.hash`, so keyboard users watch the page move while focus stays in the header and no section is deep-linkable. The offer section also speaks three different list languages (chips, ruled stack, split band) where one would do.

**B — impeccable · taste rank 4 · ship-worthy.** The most original thinking: one family only (Archivo variable) with the width axis carrying state — nav hover 76→96%, button hover 88→100% — and a wordmark setting GRIZZLY at wdth 125 over ENTERPRISE at 62. As concept work it is the strongest entry. As a shipped artifact it is the least resolved. Two of its five headline claims did not survive measurement: "every layout quantity is a whole multiple of `--mod`" is 4 of 32 expressions, the rest being `/2.75`, `/3.5`, `×0.85` — magic numbers in a costume; and the wordmark that "spans the full measure" fills 73% of it with the two lines 20px out of alignment. The 12-column ruled grid painted behind the offer section does not correspond to the actual `0.75mod / 5fr / 6fr` row grid — decoration masquerading as structure. Worst, `.direct { margin-top: auto }` opens a measured 329px dead gap in the contact column: a smaller reintroduction of the exact defect the brief listed as a mandatory fix. To its credit it disclosed that its own detector ran degraded and undercounted, which is why the judge measured everything independently.

### Convergence — the round's strongest evidence

Moves multiple contenders made **independently**, with no knowledge of each other. These are spec-amendment candidates:

| Move                                                                  | Count |
| --------------------------------------------------------------------- | ----- |
| Deleted the three-card grid for a numbered directory of ruled rows      | 4/4   |
| Added a sticky header with nav and a CTA                                | 4/4   |
| Added a designed footer carrying the email                              | 4/4   |
| Made the hero asymmetric, bear as oversized motif bleeding off-right    | 4/4   |
| Replaced cold silver `#c0c0c0` with a warm bone/off-white neutral       | 4/4   |
| Split contact two-column, name/email paired on one row                  | 4/4   |
| Added a hero CTA pair (primary + ghost)                                 | 4/4   |
| Added a hero spec/index strip under the CTAs                            | 3/4   |

Six unanimous agreements say the incumbent's problem is not polish but genre: a centred stack of glass cards is the wrong form for this content, and every contender independently reached for the same replacement.

### Convergent failures — more useful than the successes

The same independence makes the shared *defects* diagnostic. These are model-default failure modes no design skill prevented:

- **Deep-gold micro-labels fail contrast.** Three entries introduced a numbered index and set its ordinal in a dark gold: A at 3.09:1 (**the round's only gate failure**), D at 4.34:1, C at 4.87:1 on hover. The numbered-ledger idea reliably drags a sub-4.5:1 gold micro-label in behind it. Any spec adopting the ledger must pin a minimum accessible gold.
- **"Optically justified" wordmarks that aren't.** A and B both claimed two lines flush to the same measure; both are off by ~20px, independently, in the same direction. The claim gets made and never measured.
- **No `scroll-margin-top` under a sticky header.** 4/4. Currently absorbed by section padding in every entry — B has 1px of clearance at 390 — so it is one padding change from being a live bug in all four.
- **False hover affordances on non-interactive rows.** 3/4 (B, C, D) paint a hover state on ledger rows or chips that are not links. No `cursor: pointer`, so no gate failure, but the same misdirection, and inert on touch.
- **Vestigial `body { overflow-x: hidden }`.** 4/4 kept it. Judges forced it off in A, C and D and measured zero overflow — it is dead defence carried over from the base, and it forces `overflow-y: auto` onto `<body>`, a known `position: sticky` breaker.
- **`...` instead of `…`.** 4/4, inherited from the base's placeholder and never noticed.
- **No `touch-action`, `-webkit-tap-highlight-color` or `env(safe-area-inset-*)`.** 4/4, on full-bleed dark mobile shells.

### Verdict

No entry ships as-is. **D is the closest to shippable** and the best-verified, but its typeface is the round's safest choice. **C is the best composition** but sets the entire conversion surface in 10.9px mono. **A owns the single best idea** — the gold inversion band — inside the round's only gate-failing entry. **B has the most interesting design system** and the least resolved page.

That distribution argues for cherry-picking over a straight winner: D's structure and verified engineering, C's section rhythm, A's gold band, and a display face that is nobody's default.

### Process notes

- The skill's capture recipe (a 1440×3400 window) misrepresents this site: the base's `min-height: 100vh` contact section stretches into a 3400px void and hero animations freeze mid-fade. Replaced with `bakeoff/shoot.mjs`, a dependency-free CDP harness capturing full-page at a real 1440×900 viewport. All captures in `bakeoff/judging/shots/`.
- A design hook flagged D's Fraunces as an overused face. Per the freeze rule this was recorded as a judging finding rather than fixed. The narrow per-file ignore could not be persisted — the `hook-admin.mjs ignore-value` call was blocked by the auto-mode classifier — so it remains unpersisted and is disclosed here instead.
- `bakeoff/gates.mjs` runs the mechanical subset of the gates. Its first version flagged C for an external request that was really a footer link to the site's own domain; the check now counts only resource-loading positions (`src=`, `<link href=`, `url()`).
