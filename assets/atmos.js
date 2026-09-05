/* Shyam — atmosphere.
   A slow drift of layered value-noise over black with a single cold light source,
   rendered small and scaled up so it reads as smoke or silk moving in the dark.
   Plus a fine grain pass so flat black never looks like a flat fill. */

export function atmosphere(canvas, opts = {}) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const W = 190, H = 110;                       // noise field, upscaled to fill
  const buf = document.createElement('canvas');
  buf.width = W; buf.height = H;
  const bctx = buf.getContext('2d');
  const img = bctx.createImageData(W, H);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hue = opts.hue || [5, 6, 11];            // blue-black, barely lifted
  const lift = opts.lift ?? 0.38;

  /* value noise on a hashed lattice */
  const P = new Uint8Array(512);
  for (let i = 0; i < 256; i++) P[i] = i;
  let seed = 20261011;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  for (let i = 255; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; [P[i], P[j]] = [P[j], P[i]]; }
  for (let i = 0; i < 256; i++) P[256 + i] = P[i];
  const fade = t => t * t * (3 - 2 * t);
  const hash = (x, y, z) => P[(P[(P[x & 255] + y) & 255] + z) & 255] / 255;

  function noise(x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
    const lerp = (a, b, t) => a + (b - a) * t;
    const c00 = lerp(hash(xi, yi, zi), hash(xi + 1, yi, zi), xf);
    const c10 = lerp(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), xf);
    const c01 = lerp(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), xf);
    const c11 = lerp(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), xf);
    return lerp(lerp(c00, c10, yf), lerp(c01, c11, yf), zf);
  }
  function fbm(x, y, z) {
    let v = 0, a = 0.5, f = 1;
    for (let o = 0; o < 3; o++) { v += a * noise(x * f, y * f, z * f); f *= 2.1; a *= 0.5; }
    return v;
  }

  let t = 0, raf = 0, running = true;

  function frame() {
    const d = img.data;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const n = fbm(x / 26, y / 26, t);
        /* cold key light from upper-left, falls off across the field */
        const key = Math.max(0, 1 - Math.hypot(x / W - 0.34, y / H - 0.16) * 1.55);
        const v = Math.pow(n, 3.1) * 96 * lift + key * key * key * 34 * lift;
        const i = (y * W + x) * 4;
        d[i] = hue[0] + v * 0.72;
        d[i + 1] = hue[1] + v * 0.80;
        d[i + 2] = hue[2] + v;
        d[i + 3] = 255;
      }
    }
    bctx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(buf, 0, 0, canvas.width, canvas.height);
    if (running && !reduced) { t += 0.0016; raf = requestAnimationFrame(frame); }
  }

  function size() {
    const r = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(2, Math.round(canvas.clientWidth * r));
    canvas.height = Math.max(2, Math.round(canvas.clientHeight * r));
    if (reduced) frame();
  }
  addEventListener('resize', size, { passive: true });
  size();
  if (!reduced) raf = requestAnimationFrame(frame);

  /* pause when the tab is hidden */
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running && !reduced) raf = requestAnimationFrame(frame);
    else cancelAnimationFrame(raf);
  });

  return { stop() { running = false; cancelAnimationFrame(raf); } };
}

/* Film grain — a tiled noise tile, animated by nudging its offset. */
export function grain(el) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const im = g.createImageData(128, 128);
  for (let i = 0; i < im.data.length; i += 4) {
    const v = 118 + Math.random() * 74;
    im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
    im.data[i + 3] = 16;
  }
  g.putImageData(im, 0, 0);
  el.style.backgroundImage = `url(${c.toDataURL()})`;
}

/* Parallax — every [data-par] moves at its own fraction of scroll. */
export function parallax() {
  const els = [...document.querySelectorAll('[data-par]')];
  if (!els.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let ticking = false;
  function run() {
    const vh = innerHeight;
    els.forEach(e => {
      const r = e.getBoundingClientRect();
      const mid = r.top + r.height / 2 - vh / 2;
      e.style.transform = `translate3d(0, ${(-mid * parseFloat(e.dataset.par)).toFixed(1)}px, 0)`;
    });
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
  addEventListener('resize', run, { passive: true });
  run();
}
