/* Shyam — garment renderers.
   Each returns an <svg> string. Rendered as layered vector "product shots":
   gradient body, fold shadows, edge highlights, seam stitching, tonal mark.
   The two colour stops come from the selected black recipe. */

export const BLACKS = {
  kajal: { name: 'Kajal',  hi: '#131313', lo: '#000000', note: 'Kohl. Double-dipped reactive.' },
  neel:  { name: 'Neel',   hi: '#1A2340', lo: '#05080F', note: 'Indigo over black.' },
  raakh: { name: 'Raakh',  hi: '#33322E', lo: '#141311', note: 'Ash. Sun-faded.' },
  mitti: { name: 'Mitti',  hi: '#2A231D', lo: '#0D0A08', note: 'Iron-mordant, Bagru.' },
  mor:   { name: 'Mor',    hi: '#18261F', lo: '#070C09', note: 'Teal in raking light.' }
};

let uid = 0;

function shell(id, b, inner, mark) {
  const g = `g${id}`;
  return `<svg viewBox="0 0 400 500" class="gsvg" role="img" aria-label="Garment render">
    <defs>
      <linearGradient id="${g}b" x1="0.18" y1="0" x2="0.86" y2="1">
        <stop offset="0%" stop-color="${b.hi}"/>
        <stop offset="42%" stop-color="${b.lo}"/>
        <stop offset="78%" stop-color="${b.hi}" stop-opacity="0.72"/>
        <stop offset="100%" stop-color="${b.lo}"/>
      </linearGradient>
      <linearGradient id="${g}r" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.10"/>
        <stop offset="30%" stop-color="#FFFFFF" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="${g}s" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stop-color="#000" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
      <filter id="${g}f" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="9"/>
      </filter>
    </defs>
    <ellipse cx="200" cy="466" rx="122" ry="17" fill="url(#${g}s)"/>
    ${inner(g)}
    ${mark || ''}
  </svg>`;
}

/* soft fold shadow */
const fold = (g, d, o = 0.5) =>
  `<path d="${d}" fill="#000" opacity="${o}" filter="url(#${g}f)"/>`;
/* thread-thin seam */
const seam = (d, o = 0.15) =>
  `<path d="${d}" fill="none" stroke="#9AA0AD" stroke-width="0.8" opacity="${o}" stroke-dasharray="2.5 4"/>`;
/* catch-light along an edge */
const lit = (d, o = 0.14) =>
  `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="1.6" opacity="${o}"/>`;

/* tonal embroidered mark — a disc cut once at twelve */
export function markSVG(cx, cy, r, tone = 0.30) {
  const w = r * 0.10;
  return `<g opacity="${tone}">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#F2EDE3"/>
    <rect x="${cx - w / 2}" y="${cy - r}" width="${w}" height="${r + 0.5}" fill="#05060B"/>
  </g>`;
}

/* ---------- TEE ---------- */
export const tee = (b, o = {}) => shell(++uid, b, g => `
  <path d="M148 92 C160 78 174 70 200 70 C226 70 240 78 252 92
           L318 116 L344 176 L306 198 L288 168 L288 410
           C288 424 280 430 262 430 L138 430 C120 430 112 424 112 410
           L112 168 L94 198 L56 176 L82 116 Z"
        fill="url(#${g}b)"/>
  ${fold(g, 'M126 190 L146 200 L142 400 L120 396 Z', 0.42)}
  ${fold(g, 'M258 196 L282 186 L286 400 L262 404 Z', 0.34)}
  ${fold(g, 'M186 250 L214 250 L206 428 L192 428 Z', 0.22)}
  ${lit('M118 176 L118 402')}
  ${lit('M282 176 L282 402', 0.10)}
  <path d="M148 92 C168 118 232 118 252 92 L246 84 C230 104 170 104 154 84 Z"
        fill="${b.hi}" opacity="0.9"/>
  ${seam('M150 90 C170 116 230 116 250 90')}
  ${seam('M112 168 L112 410')}
  ${seam('M288 168 L288 410')}
  ${seam('M112 420 L288 420')}
  <rect x="0" y="0" width="400" height="500" fill="url(#${g}r)" style="mix-blend-mode:screen"/>
`, o.mark === false ? '' : markSVG(200, 196, 15, 0.26));

/* ---------- HOODIE ---------- */
export const hoodie = (b, o = {}) => shell(++uid, b, g => `
  <path d="M138 104 C150 66 250 66 262 104 C246 132 154 132 138 104 Z"
        fill="${b.lo}"/>
  <path d="M142 106 C154 74 246 74 258 106 C242 128 158 128 142 106 Z"
        fill="${b.hi}" opacity="0.55"/>
  <path d="M144 108 C158 92 242 92 256 108 L330 134 L358 200 L314 224 L296 190 L296 424
           C296 438 288 444 268 444 L132 444 C112 444 104 438 104 424
           L104 190 L86 224 L42 200 L70 134 Z"
        fill="url(#${g}b)"/>
  ${fold(g, 'M118 210 L142 220 L138 418 L114 412 Z', 0.44)}
  ${fold(g, 'M266 214 L292 204 L296 418 L270 422 Z', 0.36)}
  ${fold(g, 'M182 140 L218 140 L212 300 L190 300 Z', 0.30)}
  <path d="M124 322 L124 384 L276 384 L276 322 L238 312 L162 312 Z"
        fill="${b.lo}" opacity="0.85"/>
  ${seam('M124 322 L124 384 L276 384 L276 322')}
  ${lit('M110 200 L110 416')}
  <rect x="192" y="106" width="5" height="52" rx="2.5" fill="#5A5F6B" opacity="0.75"/>
  <rect x="205" y="106" width="5" height="52" rx="2.5" fill="#5A5F6B" opacity="0.75"/>
  <circle cx="194.5" cy="160" r="4" fill="#8A7038"/>
  <circle cx="207.5" cy="160" r="4" fill="#8A7038"/>
  ${seam('M104 190 L104 424')}
  ${seam('M296 190 L296 424')}
  <rect x="0" y="0" width="400" height="500" fill="url(#${g}r)" style="mix-blend-mode:screen"/>
`, o.mark === false ? '' : markSVG(200, 230, 14, 0.24));

/* ---------- KURTA SHIRT ---------- */
export const kurta = (b, o = {}) => shell(++uid, b, g => `
  <path d="M152 90 L200 108 L248 90 L316 116 L342 178 L304 200 L286 170 L286 446
           L114 446 L114 170 L96 200 L58 178 L84 116 Z"
        fill="url(#${g}b)"/>
  ${fold(g, 'M126 194 L148 204 L144 434 L122 428 Z', 0.42)}
  ${fold(g, 'M256 200 L280 190 L284 434 L260 438 Z', 0.34)}
  ${fold(g, 'M206 130 L222 130 L216 440 L202 440 Z', 0.24)}
  <path d="M178 74 L222 74 L222 98 L200 108 L178 98 Z" fill="${b.hi}" opacity="0.7"/>
  ${seam('M178 76 L178 98 M222 76 L222 98 M178 76 L222 76')}
  <path d="M192 108 L192 446 L208 446 L208 108 Z" fill="${b.hi}" opacity="0.45"/>
  ${seam('M192 110 L192 444')}
  ${seam('M208 110 L208 444')}
  ${[150, 200, 250, 300, 350, 400].map(y =>
    `<circle cx="200" cy="${y}" r="3.6" fill="#8A7038" opacity="0.9"/>`).join('')}
  ${seam('M114 394 L114 446 M286 394 L286 446')}
  ${lit('M120 178 L120 438')}
  <rect x="0" y="0" width="400" height="500" fill="url(#${g}r)" style="mix-blend-mode:screen"/>
`, o.mark === false ? '' : markSVG(252, 168, 12, 0.24));

/* ---------- TROUSER ---------- */
export const trouser = (b, o = {}) => shell(++uid, b, g => `
  <path d="M118 66 L282 66 L282 108 L118 108 Z" fill="${b.hi}" opacity="0.92"/>
  <path d="M118 108 L110 452 L186 452 L200 214 L214 452 L290 452 L282 108 Z"
        fill="url(#${g}b)"/>
  ${fold(g, 'M132 120 L154 128 L146 440 L124 436 Z', 0.42)}
  ${fold(g, 'M248 128 L272 118 L278 436 L254 440 Z', 0.34)}
  ${fold(g, 'M164 130 L178 130 L172 430 L158 430 Z', 0.26)}
  ${fold(g, 'M224 130 L238 130 L244 430 L230 430 Z', 0.26)}
  ${seam('M118 66 L118 108 M282 66 L282 108 M118 70 L282 70')}
  ${seam('M168 108 L168 440')}
  ${seam('M232 108 L232 440')}
  ${seam('M110 444 L186 444 M214 444 L290 444')}
  ${lit('M116 120 L112 440')}
  <circle cx="200" cy="88" r="7" fill="#B08F44"/>
  <rect x="199.3" y="81" width="1.4" height="7.4" fill="#0A0803"/>
  <rect x="0" y="0" width="400" height="500" fill="url(#${g}r)" style="mix-blend-mode:screen"/>
`, o.mark === false ? '' : '');

/* ---------- CAP ---------- */
export const cap = (b, o = {}) => shell(++uid, b, g => `
  <path d="M92 300 C92 168 308 168 308 300 Z" fill="url(#${g}b)"/>
  ${fold(g, 'M120 210 L146 200 L140 298 L116 298 Z', 0.36)}
  ${fold(g, 'M254 200 L282 212 L286 298 L258 298 Z', 0.30)}
  ${seam('M200 172 L200 300')}
  ${seam('M132 196 C170 236 176 268 176 300')}
  ${seam('M268 196 C230 236 224 268 224 300')}
  <path d="M92 300 C160 342 318 336 352 306 L352 288 C316 316 160 322 92 284 Z"
        fill="${b.lo}"/>
  ${lit('M92 300 C160 342 318 336 352 306', 0.10)}
  <circle cx="200" cy="176" r="7" fill="${b.hi}"/>
  <rect x="0" y="0" width="400" height="500" fill="url(#${g}r)" style="mix-blend-mode:screen"/>
`, o.mark === false ? '' : markSVG(226, 250, 13, 0.30));

/* ---------- MALA ---------- */
export const mala = (b, o = {}) => shell(++uid, b, g => {
  let beads = '';
  const cx = 200, cy = 250, rx = 92, ry = 118;
  for (let i = 0; i < 44; i++) {
    const a = (i / 44) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
    const lightFace = Math.cos(a - 0.9) * 0.5 + 0.5;
    beads += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8.4" fill="${b.lo}"/>
              <circle cx="${(x - 2.2).toFixed(1)}" cy="${(y - 2.4).toFixed(1)}" r="3.1"
                      fill="#FFFFFF" opacity="${(0.05 + lightFace * 0.16).toFixed(2)}"/>`;
  }
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none"
                   stroke="${b.hi}" stroke-width="1.4" opacity="0.5"/>
    ${beads}
    <circle cx="${cx}" cy="${cy + ry + 4}" r="12.5" fill="${b.hi}"/>
    <circle cx="${cx - 3}" cy="${cy + ry + 1}" r="4.4" fill="#FFFFFF" opacity="0.16"/>
    <rect x="0" y="0" width="400" height="500" fill="url(#${g}r)" style="mix-blend-mode:screen"/>`;
}, '');

export const RENDER = { tee, hoodie, kurta, trouser, cap, mala };
