import { RENDER, BLACKS, markSVG } from './garments.js';

/* ---------------- data ---------------- */
const PRODUCTS = [
  { sku:'S1-01', id:'tee',      name:'Boxy Tee',        render:'tee',
    cloth:'260 gsm compact cotton', dye:'kajal', inr:4800,  usd:58,
    made:300, left:284, sizes:['S','M','L','XL'], out:[],
    fit:'Boxy, drops one size. Model wears M at 5\'11".',
    detail:'Garment-dyed after make so the seams shade with the body. Tonal mark embroidered at chest, 8 mm.',
    care:'Cold wash inside out. Line dry in shade. Never bleach.' },
  { sku:'S1-02', id:'hoodie',   name:'Bansuri Hoodie',  render:'hoodie',
    cloth:'480 gsm loopback terry', dye:'neel', inr:12900, usd:155,
    made:150, left:96, sizes:['S','M','L','XL'], out:['S'],
    fit:'True to size with a deliberate drop shoulder.',
    detail:'Indigo overdyed on black. Split kurta hem, brass-tipped drawcords, tonal mark at chest.',
    care:'Cold wash inside out. Do not tumble. Re-dye free within two years.' },
  { sku:'S1-03', id:'kurta',    name:'Kurta Shirt',     render:'kurta',
    cloth:'10 oz washed cotton canvas', dye:'raakh', inr:9800, usd:118,
    made:120, left:71, sizes:['S','M','L','XL'], out:[],
    fit:'Straight, long body. Side vents from the hip.',
    detail:'Mandarin collar, centre placket, six cast brass buttons carrying the mark.',
    care:'Machine wash cold. Warm iron on the placket only.' },
  { sku:'S1-04', id:'trouser',  name:'Drape Trouser',   render:'trouser',
    cloth:'Wool-cotton twill', dye:'kajal', inr:11500, usd:138,
    made:100, left:63, sizes:['30','32','34','36'], out:['36'],
    fit:'High rise, double pleat, wide through the thigh.',
    detail:'Dhoti fall at the hem so the break sits soft. Cast brass closure at the waistband.',
    care:'Dry clean only.' },
  { sku:'S1-07', id:'cap',      name:'Six-Panel Cap',   render:'cap',
    cloth:'Brushed twill', dye:'mor', inr:3400, usd:41,
    made:200, left:151, sizes:['One size'], out:[],
    fit:'Unstructured, adjustable brass slider.',
    detail:'Peacock-black: reads flat until raking light finds the teal. Tonal mark on the left panel.',
    care:'Spot clean only.' },
  { sku:'S1-08', id:'mala',     name:'Tulsi Mala',      render:'mala',
    cloth:'Blackened tulsi wood, 108 bead', dye:'kajal', inr:2900, usd:35,
    made:250, left:238, sizes:['One size'], out:[],
    fit:'Sits at the collarbone. 108 beads and a guru bead.',
    detail:'Turned from tulsi, blackened by hand. No two are the same depth of black.',
    care:'Keep dry. It will lighten where it is touched most, and that is correct.' }
];

const INR = n => '₹' + n.toLocaleString('en-IN');

/* ---------------- state ---------------- */
const bag = [];
let openSku = null, chosenSize = null, chosenDye = null;

const $ = s => document.querySelector(s);
const el = (t, c) => { const e = document.createElement(t); if (c) e.className = c; return e; };

/* ---------------- countdown ---------------- */
const TARGET = new Date('2026-10-11T14:43:00+05:30').getTime();
const pad = n => String(n).padStart(2, '0');
function tick() {
  let t = Math.max(0, TARGET - Date.now());
  $('#cd').textContent = pad(Math.floor(t / 864e5));
  $('#ch').textContent = pad(Math.floor(t / 36e5) % 24);
  $('#cm').textContent = pad(Math.floor(t / 6e4) % 60);
  $('#cs').textContent = pad(Math.floor(t / 1e3) % 60);
}
tick(); setInterval(tick, 1000);

/* ---------------- hero torch ---------------- */
const veil = $('#veil'), hero = $('#hero');
hero.addEventListener('pointermove', e => {
  const r = hero.getBoundingClientRect();
  veil.style.setProperty('--x', ((e.clientX - r.left) / r.width * 100) + '%');
  veil.style.setProperty('--y', ((e.clientY - r.top) / r.height * 100) + '%');
});
hero.addEventListener('pointerleave', () => {
  veil.style.setProperty('--x', '50%'); veil.style.setProperty('--y', '38%');
});

/* the hero slot sweeps once on load, then rests at twelve */
const slot = $('#heroSlot');
if (slot && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  slot.style.transform = 'rotate(-330deg)';
  setTimeout(() => { slot.style.transform = 'rotate(0deg)'; }, 220);
}

/* ---------------- product grid ---------------- */
const grid = $('#pgrid');
PRODUCTS.forEach(p => {
  const card = el('button', 'p');
  card.type = 'button';
  card.setAttribute('aria-label', 'Open ' + p.name);
  card.innerHTML =
    `<div class="img"><span class="sku">${p.sku}</span>
       ${RENDER[p.render](BLACKS[p.dye])}
       <span class="qv">Quick view</span></div>
     <div class="info">
       <span class="nm">${p.name}</span>
       <span class="sp">${p.cloth} &middot; ${BLACKS[p.dye].name}</span>
       <span class="pr"><span class="inr">${INR(p.inr)}</span><span class="usd">$${p.usd}</span></span>
       <span class="left"><span>${p.left} of ${p.made}</span>
         <span class="bar"><i style="width:${Math.round(p.left / p.made * 100)}%"></i></span></span>
     </div>`;
  card.addEventListener('click', () => openQuick(p.sku));
  grid.appendChild(card);
});
$('#unitsLeft').textContent =
  PRODUCTS.reduce((a, p) => a + p.left, 0) + ' of 1,310 remaining';

/* ---------------- black system demo ---------------- */
const swWrap = $('#swatches'), demoArt = $('#demoArt');
let demoDye = 'kajal';
function paintDemo() {
  const b = BLACKS[demoDye];
  demoArt.innerHTML = RENDER.hoodie(b);
  $('#demoName').textContent = b.name;
  $('#demoNote').textContent = b.note;
  swWrap.querySelectorAll('.sw').forEach(s =>
    s.setAttribute('aria-pressed', String(s.dataset.k === demoDye)));
}
Object.entries(BLACKS).forEach(([k, b]) => {
  const s = el('button', 'sw');
  s.type = 'button'; s.dataset.k = k; s.setAttribute('aria-pressed', 'false');
  s.innerHTML = `<i style="background:linear-gradient(150deg,${b.hi},${b.lo})"></i><span>${b.name}</span>`;
  s.addEventListener('click', () => { demoDye = k; paintDemo(); });
  swWrap.appendChild(s);
});
paintDemo();

/* ---------------- drop clock ---------------- */
const DROPS = [
  '11 October 2026','10 November 2026','9 December 2026','8 January 2027',
  '6 February 2027','8 March 2027','6 April 2027','6 May 2027',
  '4 June 2027','4 July 2027','2 August 2027','1 September 2027'
];
const clock = $('#clock'), clockNote = $('#clockNote');
DROPS.forEach((date, i) => {
  const d = el('button', 'dial' + (i === 0 ? ' on' : ''));
  d.type = 'button';
  d.innerHTML =
    `<svg viewBox="0 0 70 70" aria-hidden="true"><g transform="rotate(${i * 30} 35 35)">
       <circle cx="35" cy="35" r="30" fill="${i === 0 ? '#C7A252' : '#F2EDE3'}"/>
       <rect x="33.5" y="4" width="3" height="32" fill="#080A11"/></g></svg>
     <i>${String(i + 1).padStart(3, '0')}</i>`;
  const show = () => { clockNote.textContent = 'Drop ' + String(i + 1).padStart(3, '0') + ' · ' + date; };
  d.addEventListener('mouseenter', show);
  d.addEventListener('focus', show);
  d.addEventListener('click', show);
  clock.appendChild(d);
});
clock.addEventListener('mouseleave', () => { clockNote.textContent = 'Drop 001 · 11 October 2026'; });

/* ---------------- quick view ---------------- */
const scrim = $('#scrim'), quick = $('#quick'), qbody = $('#qbody'), bagDrawer = $('#bag');

function closeAll() {
  quick.hidden = true; bagDrawer.hidden = true; scrim.hidden = true;
  document.body.style.overflow = '';
}
scrim.addEventListener('click', closeAll);
$('#quickX').addEventListener('click', closeAll);
$('#bagX').addEventListener('click', closeAll);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

function openQuick(sku) {
  const p = PRODUCTS.find(x => x.sku === sku);
  openSku = sku; chosenSize = p.sizes.length === 1 ? p.sizes[0] : null; chosenDye = p.dye;
  paintQuick();
  scrim.hidden = false; bagDrawer.hidden = true; quick.hidden = false;
  document.body.style.overflow = 'hidden';
  quick.scrollTop = 0;
}

function paintQuick() {
  const p = PRODUCTS.find(x => x.sku === openSku);
  const b = BLACKS[chosenDye];
  qbody.innerHTML =
    `<div class="qart">${RENDER[p.render](b)}</div>
     <div class="qsku">${p.sku} &middot; ${p.left} of ${p.made} remaining</div>
     <h2 class="qtitle">${p.name}</h2>
     <div class="qprice">${INR(p.inr)}<small>$${p.usd}</small></div>
     <dl class="qspec">
       <dt>Cloth</dt><dd>${p.cloth}</dd>
       <dt>Black</dt><dd>${b.name} &mdash; ${b.note}</dd>
       <dt>Fit</dt><dd>${p.fit}</dd>
       <dt>Detail</dt><dd>${p.detail}</dd>
       <dt>Care</dt><dd>${p.care}</dd>
     </dl>
     <div class="grp"><span class="lab">Black</span><div class="opts dye" id="qdye"></div></div>
     <div class="grp"><span class="lab">Size</span><div class="opts" id="qsize"></div></div>
     <button class="cta" id="add">Add to bag</button>
     <p class="note">One unit per person. Nothing restocked after the drop closes.</p>`;

  const dyeWrap = qbody.querySelector('#qdye');
  Object.entries(BLACKS).forEach(([k, bb]) => {
    const btn = el('button'); btn.type = 'button';
    btn.setAttribute('aria-pressed', String(k === chosenDye));
    btn.innerHTML = `<i style="background:linear-gradient(150deg,${bb.hi},${bb.lo})"></i>${bb.name}`;
    btn.addEventListener('click', () => { chosenDye = k; paintQuick(); });
    dyeWrap.appendChild(btn);
  });

  const sizeWrap = qbody.querySelector('#qsize');
  p.sizes.forEach(z => {
    const btn = el('button'); btn.type = 'button'; btn.textContent = z;
    if (p.out.includes(z)) btn.disabled = true;
    btn.setAttribute('aria-pressed', String(z === chosenSize));
    btn.addEventListener('click', () => { chosenSize = z; paintQuick(); });
    sizeWrap.appendChild(btn);
  });

  const add = qbody.querySelector('#add');
  add.disabled = !chosenSize;
  if (!chosenSize) add.textContent = 'Select a size';
  add.addEventListener('click', () => {
    if (bag.some(i => i.sku === p.sku)) { add.textContent = 'Already in bag'; add.disabled = true; return; }
    bag.push({ sku: p.sku, name: p.name, render: p.render, dye: chosenDye,
               size: chosenSize, inr: p.inr });
    p.left = Math.max(0, p.left - 1);
    paintBag(); closeAll(); openBag();
  });
}

/* ---------------- bag ---------------- */
function openBag() {
  paintBag();
  scrim.hidden = false; quick.hidden = true; bagDrawer.hidden = false;
  document.body.style.overflow = 'hidden';
}
$('#bagBtn').addEventListener('click', openBag);

function paintBag() {
  const wrap = $('#bagItems');
  wrap.innerHTML = '';
  if (!bag.length) {
    wrap.innerHTML = '<p class="empty">Nothing yet. The room is still dark.</p>';
    $('#bagTotal').innerHTML = '';
    $('#checkout').disabled = true;
  } else {
    bag.forEach((it, i) => {
      const row = el('div', 'bitem');
      row.innerHTML =
        `<div class="th">${RENDER[it.render](BLACKS[it.dye], { mark: false })}</div>
         <div><div class="bn">${it.name}</div>
           <div class="bs">${BLACKS[it.dye].name} &middot; ${it.size}</div>
           <button class="rm" type="button">Remove</button></div>
         <div class="bp">${INR(it.inr)}</div>`;
      row.querySelector('.rm').addEventListener('click', () => {
        const p = PRODUCTS.find(x => x.sku === it.sku);
        if (p) p.left += 1;
        bag.splice(i, 1); paintBag();
      });
      wrap.appendChild(row);
    });
    const total = bag.reduce((a, i) => a + i.inr, 0);
    $('#bagTotal').innerHTML = `<span class="lab">Total</span><b>${INR(total)}</b>`;
    $('#checkout').disabled = false;
  }
  $('#bagCount').textContent = bag.length;
}
paintBag();

$('#checkout').addEventListener('click', function () {
  this.textContent = 'Drop opens 11 October';
  this.disabled = true;
});

/* ---------------- signup ---------------- */
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const ph = $('#ph'), note = $('#formNote');
  if (ph.value.replace(/\D/g, '').length < 8) {
    note.textContent = 'That number looks short. Include the country code.';
    note.className = 'note'; ph.focus(); return;
  }
  note.textContent = 'Added. Next message: 11 October, 14:43 IST.';
  note.className = 'note ok';
  ph.value = ''; ph.placeholder = 'Saved';
});

/* ---------------- scroll reveal ---------------- */
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const obs = new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  const secs = document.querySelectorAll('.reveal');
  secs.forEach(s => { s.classList.add('pre'); obs.observe(s); });
  setTimeout(() => secs.forEach(s => s.classList.add('in')), 1600);
}
