/* Shyam — motifs.
   The bansuri and the mor pankh, drifting behind the page at different depths.
   Plus the Krishna silhouette: tribhanga stance, flute raised, feather in the hair. */

const NS = 'http://www.w3.org/2000/svg';

/* ---------- mor pankh ---------- */
export function feather(h = 120, tone = '#F2EDE3') {
  const r = (1.1165 * h).toFixed(1);
  const eye = `M0 ${-h} A${r} ${r} 0 0 1 0 ${h} A${r} ${r} 0 0 1 0 ${-h} Z`;
  const ih = h * 0.54, ir = (1.1165 * ih).toFixed(1);
  return `<svg viewBox="${-h} ${-h * 1.1} ${h * 2} ${h * 4.1}" aria-hidden="true">
    <path d="${eye}" fill="none" stroke="${tone}" stroke-width="${h * 0.055}"/>
    <path d="M0 ${-ih} A${ir} ${ir} 0 0 1 0 ${ih} A${ir} ${ir} 0 0 1 0 ${-ih} Z" fill="${tone}" opacity=".55"/>
    <circle r="${h * 0.15}" fill="#04050A"/>
    <path d="M0 ${h} C${h * 0.06} ${h * 1.7} ${-h * 0.05} ${h * 2.3} ${h * 0.02} ${h * 2.9}"
          fill="none" stroke="${tone}" stroke-width="${h * 0.035}" stroke-linecap="round"/>
  </svg>`;
}

/* ---------- bansuri ---------- */
export function flute(w = 300, tone = '#F2EDE3') {
  const t = w * 0.115, hole = t * 0.30, blow = t * 0.42;
  const xs = [0.30, 0.44, 0.55, 0.66, 0.77, 0.88];
  return `<svg viewBox="0 0 ${w} ${t * 2}" aria-hidden="true">
    <defs><mask id="fm${w}">
      <rect width="${w}" height="${t * 2}" fill="#fff"/>
      <circle cx="${w * 0.14}" cy="${t}" r="${blow}" fill="#000"/>
      ${xs.map(x => `<circle cx="${w * x}" cy="${t}" r="${hole}" fill="#000"/>`).join('')}
    </mask></defs>
    <rect x="0" y="${t * 0.5}" width="${w}" height="${t}" rx="${t / 2}"
          fill="${tone}" mask="url(#fm${w})"/>
  </svg>`;
}

/* ---------- the field of drifting motifs ---------- */
const FIELD = [
  { kind: 'f', x: '7%',  y: '16%', s: 17, rot: -14, op: .055, par: '0.10', dur: 46 },
  { kind: 'p', x: '86%', y: '11%', s: 118, rot: 12, op: .045, par: '0.05', dur: 62 },
  { kind: 'f', x: '93%', y: '40%', s: 12, rot: 22,  op: .05,  par: '0.16', dur: 54 },
  { kind: 'p', x: '4%',  y: '55%', s: 92, rot: -8,  op: .04,  par: '0.08', dur: 70 },
  { kind: 'f', x: '15%', y: '74%', s: 14, rot: 8,   op: .05,  par: '0.13', dur: 58 },
  { kind: 'p', x: '80%', y: '80%', s: 104, rot: -16, op: .035, par: '0.06', dur: 66 },
  { kind: 'f', x: '60%', y: '93%', s: 11, rot: -20, op: .045, par: '0.18', dur: 50 },
  { kind: 'd', x: '46%', y: '28%', s: 0,  rot: 0,   op: .05,  par: '0.20', dur: 44 },
  { kind: 'd', x: '24%', y: '60%', s: 0,  rot: 0,   op: .04,  par: '0.24', dur: 52 }
];

export function motifField(host) {
  FIELD.forEach((m, i) => {
    const d = document.createElement('div');
    d.className = 'motif';
    d.dataset.par = m.par;
    d.style.left = m.x; d.style.top = m.y;
    d.style.opacity = m.op;
    d.style.setProperty('--rot', m.rot + 'deg');
    d.style.setProperty('--dur', m.dur + 's');
    d.style.setProperty('--delay', (-i * 5) + 's');
    if (m.kind === 'f') { d.style.width = (m.s * 1.6) + 'px'; d.innerHTML = feather(m.s); }
    else if (m.kind === 'p') { d.style.width = m.s + 'px'; d.innerHTML = flute(m.s); }
    else {
      d.style.width = '72px';
      d.innerHTML = `<svg viewBox="0 0 150 18" aria-hidden="true">
        <circle cx="9" cy="9" r="6.5" fill="#F2EDE3"/>
        ${[38, 62, 86, 110, 134].map(x => `<circle cx="${x}" cy="9" r="4" fill="#F2EDE3"/>`).join('')}
      </svg>`;
    }
    host.appendChild(d);
  });
}

/* ---------- The relics: feather and flute, lit in the dark ----------
   A still life rather than a figure. His two attributes, at scale,
   raked by a single cold light. */
export function krishna(rim = '#4A5878') {
  return `<svg viewBox="0 0 560 900" class="krishna" role="img"
       aria-label="A peacock feather and a bansuri, lit in the dark">
  <defs>
    <linearGradient id="rq" x1="0.15" y1="0" x2="0.9" y2="1">
      <stop offset="0%"  stop-color="#39456A"/>
      <stop offset="46%" stop-color="#161C2C"/>
      <stop offset="100%" stop-color="#05070D"/>
    </linearGradient>
    <linearGradient id="rf" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0%"  stop-color="#4C5878"/>
      <stop offset="55%" stop-color="#1D2436"/>
      <stop offset="100%" stop-color="#080B12"/>
    </linearGradient>
    <radialGradient id="rh" cx="0.42" cy="0.30" r="0.62">
      <stop offset="0%"  stop-color="#8B9CC6" stop-opacity=".22"/>
      <stop offset="52%" stop-color="#3B4664" stop-opacity=".07"/>
      <stop offset="100%" stop-color="#04050A" stop-opacity="0"/>
    </radialGradient>
    <filter id="rb" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="16"/>
    </filter>
  </defs>

  <ellipse cx="272" cy="368" rx="266" ry="330" fill="url(#rh)"/>

  <!-- the bansuri, laid behind on the diagonal -->
  <g transform="rotate(-52 280 470)">
    <defs><mask id="rfm">
      <rect x="20" y="440" width="520" height="62" fill="#fff"/>
      <circle cx="82"  cy="471" r="10"   fill="#000"/>
      <circle cx="228" cy="471" r="7"    fill="#000"/><circle cx="278" cy="471" r="7" fill="#000"/>
      <circle cx="328" cy="471" r="7"    fill="#000"/><circle cx="378" cy="471" r="7" fill="#000"/>
      <circle cx="428" cy="471" r="7"    fill="#000"/><circle cx="478" cy="471" r="7" fill="#000"/>
    </mask></defs>
    <rect x="34" y="486" width="492" height="34" rx="17" fill="#000" opacity=".55" filter="url(#rb)"/>
    <rect x="34" y="454" width="492" height="34" rx="17" fill="url(#rf)" mask="url(#rfm)"/>
    <path d="M34 460 C160 452 400 452 526 460" fill="none" stroke="${rim}"
          stroke-width="1.6" opacity=".5"/>
  </g>

  <!-- the mor pankh, standing -->
  <g transform="translate(268,300) rotate(-6)">
    <ellipse cx="14" cy="360" rx="120" ry="20" fill="#000" opacity=".6" filter="url(#rb)"/>
    <path d="M0 620 C22 470 -14 400 4 246" fill="none" stroke="url(#rf)"
          stroke-width="11" stroke-linecap="round"/>
    <path d="M0 620 C22 470 -14 400 4 246" fill="none" stroke="${rim}"
          stroke-width="1.6" opacity=".45" stroke-linecap="round"/>
    <g>
      <path d="M0 -232 A259 259 0 0 1 0 232 A259 259 0 0 1 0 -232 Z" fill="url(#rq)"/>
      <path d="M0 -232 A259 259 0 0 1 0 232 A259 259 0 0 1 0 -232 Z"
            fill="none" stroke="${rim}" stroke-width="2.6" opacity=".7"/>
      <path d="M0 -150 A167 167 0 0 1 0 150 A167 167 0 0 1 0 -150 Z"
            fill="#101728" stroke="${rim}" stroke-width="1.4" opacity=".9"/>
      <path d="M0 -78 A87 87 0 0 1 0 78 A87 87 0 0 1 0 -78 Z" fill="#232C46"/>
      <ellipse cx="0" cy="0" rx="22" ry="34" fill="#04050A"/>
      <path d="M-52 -150 C-24 -96 -24 96 -52 150" fill="none" stroke="${rim}"
            stroke-width="1.2" opacity=".35"/>
      <path d="M52 -150 C24 -96 24 96 52 150" fill="none" stroke="${rim}"
            stroke-width="1.2" opacity=".22"/>
    </g>
    <!-- barbs -->
    <g stroke="${rim}" stroke-width="1.1" opacity=".26" fill="none" stroke-linecap="round">
      <path d="M-40 -220 C-92 -246 -128 -232 -150 -196"/>
      <path d="M40 -220 C92 -246 128 -232 150 -196"/>
      <path d="M-56 -120 C-118 -128 -164 -100 -186 -56"/>
      <path d="M56 -120 C118 -128 164 -100 186 -56"/>
      <path d="M-56 120 C-118 128 -164 100 -186 56"/>
      <path d="M56 120 C118 128 164 100 186 56"/>
      <path d="M-40 220 C-92 246 -128 232 -150 196"/>
      <path d="M40 220 C92 246 128 232 150 196"/>
    </g>
  </g>
</svg>`;
}
