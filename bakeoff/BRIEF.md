# Bake-off Brief — Grizzly Enterprise, Round 1

## The round

| Field      | Value                                                                                              |
| ---------- | -------------------------------------------------------------------------------------------------- |
| Base       | `bakeoff/base.html` — self-contained copy of the live incumbent (inlined CSS/JS, logo as data URI)  |
| Scope      | The whole single-page site, judged at 1440×900 desktop and 390×844 mobile                           |
| Ambition   | **BOLD** — visible redesign is mandatory, not optional                                              |
| Deliverable| One self-contained HTML file at `bakeoff/entries/<letter>-<skill>.html`                             |

Grizzly Enterprise is a real sales-training and life-coaching business. The site is live at grizzly-enterprise.com. Treat it as a real commercial landing page whose job is to make a visitor trust the business and fill in the contact form.

## Ambition: bold

You are **assigned** a visible redesign. This is not permission — it is the task.

**Failure line: if a side-by-side desktop screenshot of your entry and the base is not obviously different at a glance, you have failed the round.**

Your entry must introduce **at least three structural ideas the base does not have at all**. The base is three stacked centred blocks with no navigation, no call to action, no footer, and no contact details. Ideas that would count: a real navigation or header, a hero with an actual CTA path, a section rhythm other than centre-everything, an asymmetric or editorial layout, a typographic system with genuine scale contrast, a proof/process/approach section built only from copy you are allowed to write (see the fabrication gate), a designed footer, a distinctive card or list language, considered motion.

Restating the base with tidier spacing is a failing entry.

## Fixed — identity anchors

- **Palette family**: gold on black/near-black. The exact golds and greys are yours to retune; the *family* stays. Do not introduce a competing hue as the primary accent.
- **Logo**: the bear mark shipped in the base as a data URI. Keep it, inlined. You may resize, recolour within the palette, or use it as a motif.
- **Name lockup**: "GRIZZLY ENTERPRISE" remains the primary wordmark.
- **Language**: English.
- **Functionality**: the contact form must keep working exactly as specified below.

Fonts are **not** pinned. The base uses the system stack; choosing a real typeface is one of the levers open to you.

## Copy inventory — must appear verbatim

Every string below must be present and unchanged. You may **add** copy (nav labels, CTA text, eyebrows, footer, section intros). You may not remove or reword these.

```
GRIZZLY
ENTERPRISE
Sales Training & Life Coaching
Transforming performance through expert guidance
What We Offer
TOP PERFORMING SALES TRAINING
B2CONSUMER
B2BUSINESS
B2GOVERNMENT
MAXIMIZE CLIENT EXPERIENCE
IN PERSON
CONFERENCE/TRADESHOW
VIRTUAL
PHONE
LIFE COACHING
PERSONAL DEVELOPMENT
PERFORMANCE TRANSFORMATION
Contact Us
Name
Email
Phone
(optional)
Message
Send Message
```

Casing and letter-spacing are presentational — restyling `What We Offer` as `WHAT WE OFFER` is fine. Changing it to `Our Services` is not.

## Hard gates — pass/fail, and they cap an entry regardless of beauty

1. **Copy fidelity** — every string in the inventory present, unchanged.
2. **Form contract** — `POST` to `https://formspree.io/f/mqanzkpa`; field `name` attributes exactly `name`, `email`, `phone`, `message`; `phone` optional, the other three `required`; submit intercepted with `fetch` sending `Accept: application/json`; success and error states both rendered; the error fallback still names `grizzlydashenterprise@gmail.com`. Do not change the endpoint.
3. **No fabricated content** — this is a real business. No invented testimonials, client logos, case studies, statistics, "trusted by" rows, years-in-business, headcounts, team members, awards, prices, addresses, or phone numbers. If a section would need facts you do not have, do not build that section. Fabricating proof is an automatic fail, however good it looks.
4. **Dark shell declared** — `color-scheme: dark` (meta or CSS) and a `<meta name="theme-color">` matching the shell. The base ships `content="light"` on a fully dark page; fixing that is mandatory.
5. **Semantic actions** — real `<button>` for actions, `<a>` only for navigation. No `<a href="#">` standing in for a button. Any disclosure trigger carries `aria-expanded`. No row-wide `cursor: pointer` over a cell-only link.
6. **Visible focus** — every interactive element has a visible focus indicator. `outline: none` with no replacement is a fail.
7. **Motion respects `prefers-reduced-motion: reduce`** — and no content may be invisible when animation does not run. Nothing that starts at `opacity: 0` and depends on an animation or JS to become readable.
8. **Contrast** — body text ≥ 4.5:1, large text ≥ 3:1, against the background actually behind it.
9. **Status is announced, never colour-alone** — the form message region carries `role="status"` or `aria-live="polite"`; success and error are distinguishable by text, not only by colour.
10. **No overflow** — no horizontal scroll and no clipped text at 390, 768, and 1440. The base clips `CONFERENCE/TRADESHOW` inside its card; fixing that is mandatory.
11. **Self-contained** — one HTML file. Google Fonts are the only permitted external request. No CDN scripts, no frameworks, no analytics, no trackers, no remote images. Inline the logo.
12. **Visible difference** — see the failure line under Ambition.

## Known defects in the base (fixing these is expected, not credited as innovation)

- `CONFERENCE/TRADESHOW` overflows and is clipped by its card.
- `color-scheme: light` declared on an all-dark page; no `theme-color`.
- Dead `.about-section` / `.about-content` / `.about-text` CSS with no matching markup.
- `!important` on `.service-title` and `.service-list li` colours.
- `.company-name::before` uses a `top: -200vh` / `100vw` bleed hack.
- The contact section's `min-height: 100vh` plus flex centring leaves a large dead gap above the form.
- Service cards have no equalised rhythm — one title runs four lines, another one.
- No `prefers-reduced-motion` handling anywhere.
- The form's status message is not announced to assistive tech.
- No nav, no footer, no contact details, no call to action anywhere on the page.

## Process cap

- **Autonomous.** Ask no questions. Make the calls yourself and record them in your report.
- **No subagents.** Do the work in your own context.
- **Invoke only your assigned skill.** Named in your launch prompt. The other contenders' skills are forbidden.
- **Write exactly one file** — your entry at `bakeoff/entries/<letter>-<skill>.html`. Do not touch `index.html`, `styles.css`, `script.js`, the base, or anything else in the repo. No `git` commands.
- **Changelog comment** at the top of your entry: an HTML comment listing your design calls.
- **Build fully, then ONE self-review round**: capture your entry with `node bakeoff/shoot.mjs <entry> /tmp/<name>.png 1440 900` (and `390 844`), read the screenshots, compare against `bakeoff/judging/shots/base-desktop.png`, apply ONE fix batch, then stop. Do not loop.
- **Validate**: `node --check` on any extracted script is not applicable to inline HTML — instead confirm the page has no console errors by checking your capture rendered correctly.

## Your report

Return, as text: the design direction you chose and why; the three-plus structural ideas you added that the base lacks; which base defects you fixed; what you deliberately left alone; and anything you think fails a gate.
