// Mechanical gate checks. Text-level only — judges verify the rest by eye/code.
import { readFileSync } from 'node:fs';

const COPY = [
  'GRIZZLY','ENTERPRISE','Sales Training & Life Coaching',
  'Transforming performance through expert guidance','What We Offer',
  'TOP PERFORMING SALES TRAINING','B2CONSUMER','B2BUSINESS','B2GOVERNMENT',
  'MAXIMIZE CLIENT EXPERIENCE','IN PERSON','CONFERENCE/TRADESHOW','VIRTUAL','PHONE',
  'LIFE COACHING','PERSONAL DEVELOPMENT','PERFORMANCE TRANSFORMATION',
  'Contact Us','Name','Email','Phone','(optional)','Message','Send Message',
];

const file = process.argv[2];
const src = readFileSync(file, 'utf8');
// Strip tags/comments to compare rendered text, case- and whitespace-insensitively.
const text = src
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ');
const hay = (text + ' ' + src.replace(/\s+/g, ' ')).toUpperCase();

const missing = COPY.filter((s) => !hay.includes(s.toUpperCase()));

const checks = {
  'g1  copy inventory':      missing.length ? 'FAIL — missing: ' + missing.join(' | ') : 'pass',
  'g2  formspree endpoint':  /formspree\.io\/f\/mqanzkpa/.test(src) ? 'pass' : 'FAIL',
  'g2  field names':         ['name','email','phone','message'].every(n=>new RegExp(`name=["']${n}["']`).test(src)) ? 'pass' : 'FAIL',
  'g2  accept json':         /Accept/i.test(src) && /application\/json/.test(src) ? 'pass' : 'FAIL',
  'g2  fallback email':      /grizzlydashenterprise@gmail\.com/.test(src) ? 'pass' : 'FAIL',
  'g4  color-scheme dark':   /color-scheme:\s*dark/i.test(src) || /name=["']color-scheme["']\s+content=["']dark/i.test(src) ? 'pass' : 'FAIL',
  'g4  theme-color':         /name=["']theme-color["']/i.test(src) ? 'pass' : 'FAIL',
  'g5  no <a href="#"> btn': /<a[^>]+href=["']#["']/.test(src) ? 'FAIL' : 'pass',
  'g6  focus-visible':       /:focus-visible/.test(src) ? 'pass' : 'WARN — no :focus-visible',
  'g7  reduced-motion':      /prefers-reduced-motion/.test(src) ? 'pass' : 'FAIL',
  'g9  live region':         /role=["']status["']|aria-live=/.test(src) ? 'pass' : 'FAIL',
  'g11 external requests':   (() => {
      // Only resource-loading URLs count: src=, and href= on <link>.
      // <a href> is navigation, not a request the page makes.
      const res = [
        ...src.matchAll(/\bsrc=["'](https?:\/\/[^"']+)/g),
        ...src.matchAll(/<link\b[^>]*\bhref=["'](https?:\/\/[^"']+)/g),
        ...src.matchAll(/url\((["']?)(https?:\/\/[^)"']+)/g),
      ].map((m) => m[m.length - 1]);
      const bad = res.filter((u) => !/fonts\.(googleapis|gstatic)\.com/.test(u));
      return bad.length ? 'FAIL — ' + [...new Set(bad)].join(' ') : 'pass';
    })(),
  'g11 no framework cdn':    /react|tailwind|cdn\.jsdelivr|unpkg/i.test(src) ? 'FAIL' : 'pass',
};

console.log('\n=== ' + file.split('/').pop() + ' (' + (src.length/1024).toFixed(1) + ' KB) ===');
for (const [k, v] of Object.entries(checks)) {
  console.log((v.startsWith('pass') ? '  ok   ' : v.startsWith('WARN') ? '  warn ' : '  FAIL ') + k.padEnd(24) + (v === 'pass' ? '' : v));
}
