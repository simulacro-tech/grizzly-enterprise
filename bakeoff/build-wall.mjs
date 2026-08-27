import { readFileSync, writeFileSync } from 'node:fs';

const S = 'bakeoff/judging/shots/webp/';
const uri = (f) => 'url("data:image/webp;base64,' + readFileSync(S + f).toString('base64') + '")';

// Taste rank order, best first.
const CELLS = [
  { k: 'd', rank: 1, name: 'redesign-existing-projects', file: 'd-redesign-existing-projects', d: '1440/2730', m: '390/3342' },
  { k: 'c', rank: 2, name: 'ui-ux-pro-max',              file: 'c-ui-ux-pro-max',              d: '1440/3308', m: '390/3708' },
  { k: 'a', rank: 3, name: 'design-taste-frontend',      file: 'a-design-taste-frontend',      d: '1440/3166', m: '390/3574' },
  { k: 'b', rank: 4, name: 'impeccable',                 file: 'b-impeccable',                 d: '1440/2786', m: '390/3302' },
];

const vars = CELLS.map((c) =>
  `  --${c.k}-d: ${uri(c.file + '-desktop.webp')};\n  --${c.k}-m: ${uri(c.file + '-mobile.webp')};`
).join('\n');

const cellRules = CELLS.map((c) => `
.cell-${c.k} .shot { background-image: var(--${c.k}-d); aspect-ratio: ${c.d}; }
.cell-${c.k} .t-mob:checked ~ .pane .shot { background-image: var(--${c.k}-m); aspect-ratio: ${c.m}; }
.cell-${c.k} .t-base:checked ~ .pane .shot { background-image: var(--base-d); aspect-ratio: 1440/2630; }
.cell-${c.k} .t-base:checked ~ .t-mob:checked ~ .pane .shot { background-image: var(--base-m); aspect-ratio: 390/2486; }`
).join('\n');

const cellsHtml = CELLS.map((c) => `
      <section class="cell cell-${c.k}">
        <input class="t t-base" type="checkbox" id="base-${c.k}">
        <input class="t t-mob" type="checkbox" id="mob-${c.k}">
        <div class="pane"><div class="shot"></div></div>
        <div class="pill">
          <span class="rank">${c.rank}</span>
          <label class="name" for="base-${c.k}" title="Toggle against the live original">${c.name}</label>
          <label class="mode" for="mob-${c.k}" title="Toggle mobile capture">390</label>
        </div>
      </section>`
).join('\n');

const html = `<title>Grizzly Redesign Wall</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans:wght@400;500&display=swap">
<style>
:root {
  /* Single-theme dark by intent: the content is dark screenshots, and a light
     ground would misrepresent every capture on the wall. */
  --void: #0d0e11;   /* gutter — cool graphite, so the captures' warm blacks read as content */
  --cell: #16181d;
  --chrome: rgba(11, 12, 15, 0.88);
  --edge: rgba(233, 231, 226, 0.14);
  --ink: #e9e7e2;    /* warm bone */
  --dim: #7f8894;    /* steel — deliberately cool, never mistakable for the contenders' gold */
  --live: #c96a4b;   /* muted rust: "showing the original" */
  --base-d: ${uri('base-desktop.webp')};
  --base-m: ${uri('base-mobile.webp')};
${vars}
}
* { box-sizing: border-box; }
html, body { height: 100%; }
body {
  margin: 0;
  background: var(--void);
  color: var(--ink);
  font-family: 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1px;
  height: 100dvh;
  background: var(--void);
}
.cell { position: relative; overflow: hidden; background: var(--cell); }
.pane {
  position: absolute; inset: 0;
  overflow-y: auto; overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(233, 231, 226, 0.22) transparent;
}
.pane::-webkit-scrollbar { width: 9px; }
.pane::-webkit-scrollbar-thumb {
  background: rgba(233, 231, 226, 0.2);
  border-radius: 9px;
  border: 3px solid transparent;
  background-clip: content-box;
}
.shot {
  width: 100%;
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: top center;
}
${cellRules}

/* Mobile captures are 390 wide — don't upscale them across a half-viewport cell. */
.t-mob:checked ~ .pane .shot { width: min(100%, 390px); margin-inline: auto; }

.t { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }

.pill {
  position: absolute; z-index: 5; top: 10px; left: 10px;
  display: flex; align-items: stretch;
  background: var(--chrome);
  border: 1px solid var(--edge);
  border-radius: 999px;
  backdrop-filter: blur(8px);
  overflow: hidden;
  font-size: 11.5px;
  line-height: 1;
}
.rank, .name, .mode { display: flex; align-items: center; padding: 7px 10px; }
.rank {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--dim);
  padding-right: 8px;
}
.cell-d .rank { color: var(--ink); }
.name {
  font-weight: 500;
  letter-spacing: 0.005em;
  color: var(--ink);
  cursor: pointer;
  border-left: 1px solid var(--edge);
  white-space: nowrap;
}
.mode {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-weight: 500;
  color: var(--dim);
  cursor: pointer;
  border-left: 1px solid var(--edge);
  font-variant-numeric: tabular-nums;
}
.name:hover, .mode:hover { background: rgba(233, 231, 226, 0.07); }
.t-base:checked ~ .pill .name { color: var(--live); }
.t-base:checked ~ .pill .name::after { content: ' · original'; color: var(--live); opacity: 0.75; }
.t-mob:checked ~ .pill .mode { color: var(--ink); background: rgba(233, 231, 226, 0.1); }
.t:focus-visible ~ .pill { outline: 2px solid var(--ink); outline-offset: 2px; }

@media (prefers-reduced-motion: no-preference) {
  .name, .mode { transition: background 120ms ease, color 120ms ease; }
}
@media (max-width: 760px) {
  .grid { grid-template-columns: 1fr; grid-template-rows: repeat(4, 1fr); }
}
</style>

<main class="grid">
${cellsHtml}
</main>
`;

writeFileSync('bakeoff/wall.html', html);
console.log('wall.html', (html.length / 1024 / 1024).toFixed(2), 'MB');
