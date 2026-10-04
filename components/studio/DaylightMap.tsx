import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useInView } from 'framer-motion';
import { LAND, LAND_ROWS } from './landGrid';

const ease = [0.16, 1, 0.3, 1] as const;
const HOUR = 3600_000;

// Home plus the cities our clients work from. Add more as { name, country, tz, lat, lon }.
type City = { name: string; country: string; tz: string; lat: number; lon: number; home?: boolean };
const CITIES: City[] = [
  { name: 'Dubai', country: 'UAE', tz: 'Asia/Dubai', lat: 25.2, lon: 55.27, home: true },
  { name: 'London', country: 'UK', tz: 'Europe/London', lat: 51.5, lon: -0.13 },
  { name: 'New York', country: 'USA', tz: 'America/New_York', lat: 40.71, lon: -74.0 },
  { name: 'Salt Lake City', country: 'USA', tz: 'America/Denver', lat: 40.76, lon: -111.89 },
  { name: 'Toronto', country: 'Canada', tz: 'America/Toronto', lat: 43.65, lon: -79.38 },
  { name: 'Berlin', country: 'Germany', tz: 'Europe/Berlin', lat: 52.52, lon: 13.4 },
  { name: 'Amsterdam', country: 'Netherlands', tz: 'Europe/Amsterdam', lat: 52.37, lon: 4.9 },
  { name: 'Riyadh', country: 'Saudi Arabia', tz: 'Asia/Riyadh', lat: 24.71, lon: 46.68 },
  { name: 'Doha', country: 'Qatar', tz: 'Asia/Qatar', lat: 25.29, lon: 51.53 },
  { name: 'Karachi', country: 'Pakistan', tz: 'Asia/Karachi', lat: 24.86, lon: 67.0 },
  { name: 'Singapore', country: 'Singapore', tz: 'Asia/Singapore', lat: 1.35, lon: 103.82 },
  { name: 'Sydney', country: 'Australia', tz: 'Australia/Sydney', lat: -33.87, lon: 151.21 },
];

/* ------------------------------------------------------------------ */
/* Time                                                                */
/* ------------------------------------------------------------------ */

// Formatters are slow to build and get asked for on every frame of a drag
const fmts = new Map<string, Intl.DateTimeFormat>();
const fmt = (tz: string, kind: 'hour' | 'time' | 'day') => {
  const key = `${tz}|${kind}`;
  let f = fmts.get(key);
  if (!f) {
    const opts: Intl.DateTimeFormatOptions =
      kind === 'hour' ? { hour: 'numeric', hourCycle: 'h23' } : kind === 'time' ? { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' } : { weekday: 'short' };
    f = new Intl.DateTimeFormat('en-GB', { timeZone: tz, ...opts });
    fmts.set(key, f);
  }
  return f;
};
const hourAt = (tz: string, t: number) => Number(fmt(tz, 'hour').format(t));
const timeAt = (tz: string, t: number) => fmt(tz, 'time').format(t);
const dayAt = (tz: string, t: number) => fmt(tz, 'day').format(t);
type Phase = 'work' | 'edge' | 'night';
const phase = (h: number): Phase => (h >= 9 && h < 18 ? 'work' : (h >= 7 && h < 9) || (h >= 18 && h < 22) ? 'edge' : 'night');
const PHASE_LABEL: Record<Phase, string> = { work: 'Working hours', edge: 'Early or late', night: 'Asleep' };

/* ------------------------------------------------------------------ */
/* The sun                                                             */
/* ------------------------------------------------------------------ */

const RAD = Math.PI / 180;
/** Where the sun is directly overhead at time t (good to about a degree). */
const subsolar = (t: number) => {
  const d = new Date(t);
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const day = (t - start) / 86400_000;
  const g = (2 * Math.PI / 365) * (day - 1);
  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g);
  const eot = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g)); // minutes
  const utcMin = d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60;
  let lon = -((utcMin + eot) / 4 - 180);
  lon = ((lon + 540) % 360) - 180;
  return { lat: decl / RAD, lon };
};

// Map projection (equirectangular), as fractions of the map box
const mapX = (lon: number) => (lon + 180) / 360;
const mapY = (lat: number) => (LAND.top - lat) / (LAND.rows * LAND.step);
const ASPECT = LAND.cols / LAND.rows;

/** Land cells as [lat, lon] pairs, decoded once. */
const landCells = (() => {
  const cells: { lat: number; lon: number; c: number; r: number }[] = [];
  LAND_ROWS.forEach((hex, r) => {
    for (let i = 0; i < hex.length; i++) {
      const n = parseInt(hex[i], 16);
      for (let b = 0; b < 4; b++) {
        if (n & (8 >> b)) {
          const c = i * 4 + b;
          if (c < LAND.cols) cells.push({ c, r, lat: LAND.top - (r + 0.5) * LAND.step, lon: -180 + (c + 0.5) * LAND.step });
        }
      }
    }
  });
  return cells;
})();

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Paints the dotted world, lit by the sun at time t. */
const paint = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  const sun = subsolar(t);
  const sd = Math.sin(sun.lat * RAD), cd = Math.cos(sun.lat * RAD);
  const cw = w / LAND.cols, ch = h / LAND.rows;
  const r = Math.max(0.6, Math.min(cw, ch) * 0.34);
  const LEVELS = 10;
  const day: Path2D[] = Array.from({ length: LEVELS }, () => new Path2D());
  const dusk = new Path2D();

  for (const cell of landCells) {
    const lat = cell.lat * RAD;
    const cosZ = Math.sin(lat) * sd + Math.cos(lat) * cd * Math.cos((cell.lon - sun.lon) * RAD);
    const x = (cell.c + 0.5) * cw, y = (cell.r + 0.5) * ch;
    if (Math.abs(cosZ) < 0.05) { dusk.moveTo(x + r, y); dusk.arc(x, y, r, 0, Math.PI * 2); continue; }
    const lvl = Math.round(smooth(-0.12, 0.35, cosZ) * (LEVELS - 1));
    day[lvl].moveTo(x + r, y);
    day[lvl].arc(x, y, r, 0, Math.PI * 2);
  }

  ctx.clearRect(0, 0, w, h);
  day.forEach((p, i) => {
    const k = i / (LEVELS - 1);
    ctx.fillStyle = `rgba(${Math.round(255 - 20 * (1 - k))},${Math.round(255 - 40 * (1 - k))},255,${0.16 + 0.66 * k})`;
    ctx.fill(p);
  });
  // The line between day and night, where the light turns violet
  ctx.fillStyle = 'rgba(185,161,255,0.85)';
  ctx.fill(dusk);
};

/* ------------------------------------------------------------------ */
/* The section                                                         */
/* ------------------------------------------------------------------ */

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.4em] text-white/50">
    <span className="w-1.5 h-1.5 rounded-full bg-[#703FEC]" />
    {children}
  </p>
);

const SunIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden>
    <circle cx="8" cy="8" r="3.2" fill="currentColor" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
      <line key={d} x1="8" y1="0.8" x2="8" y2="2.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" transform={`rotate(${d} 8 8)`} />
    ))}
  </svg>
);

/**
 * A live map of the world lit by the real sun. Drag the map or the timeline to move the
 * sun across the next 24 hours and see who's at work, who's waking up and who's asleep.
 */
export const DaylightMap: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { amount: 0.25 });
  const [now, setNow] = useState(() => Date.now());
  const [offset, setOffset] = useState(0); // hours ahead of now, 0 to 24
  const [hover, setHover] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const played = useRef(false);
  const drag = useRef<{ x: number; offset: number } | null>(null);

  const t = now + offset * HOUR;

  // Keep the clock honest while the section is on screen
  useEffect(() => {
    if (!inView) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, [inView]);

  // First time it's seen, the sun goes once around the world and lands on now
  useEffect(() => {
    if (!inView || played.current) return;
    played.current = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const controls = animate(24, 0, { duration: 2.8, ease: [0.65, 0, 0.35, 1], onUpdate: setOffset });
    return () => controls.stop();
  }, [inView]);

  // Size the canvas to its box
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Repaint whenever the moment or the size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size.w) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(size.w * dpr)) {
      canvas.width = Math.round(size.w * dpr);
      canvas.height = Math.round(size.h * dpr);
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint(ctx, size.w, size.h, t);
  }, [t, size]);

  const sun = subsolar(t);
  const cityPhase = useMemo(() => new Map(CITIES.map((c) => [c.name, phase(hourAt(c.tz, t))])), [t]);
  const awake = CITIES.filter((c) => cityPhase.get(c.name) === 'work');

  const wrap = (h: number) => ((h % 24) + 24) % 24;

  // The coming hour that suits the most cities, preferring hours when the studio is in
  const best = () => {
    let top = -1, pick = 1;
    const base = Math.ceil(now / HOUR) * HOUR;
    for (let h = 0; h < 24; h++) {
      const at = base + h * HOUR;
      const n = CITIES.filter((c) => phase(hourAt(c.tz, at)) === 'work').length + (phase(hourAt('Asia/Dubai', at)) === 'work' ? 0.5 : 0);
      if (n > top) { top = n; pick = (at - now) / HOUR; }
    }
    animate(offset, pick, { duration: 1.2, ease, onUpdate: setOffset });
  };
  const backToNow = () => animate(offset, offset > 12 ? 24 : 0, { duration: 1, ease, onUpdate: (v) => setOffset(v >= 24 ? 0 : v) });

  // Dragging the map: pull the sun east or west, the hour wraps around the day
  const onMapDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, offset };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMapMove = (e: React.PointerEvent) => {
    if (!drag.current || !size.w) return;
    const dh = ((e.clientX - drag.current.x) / size.w) * 24;
    setOffset(wrap(drag.current.offset - dh));
  };
  const onMapUp = () => { drag.current = null; };

  // The timeline under the map
  const fromTrack = (clientX: number) => {
    const r = trackRef.current?.getBoundingClientRect();
    if (!r) return;
    setOffset(Math.min(24, Math.max(0, ((clientX - r.left) / r.width) * 24)));
  };
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 1 : 0.25;
    if (e.key === 'ArrowRight') setOffset((o) => Math.min(24, o + step));
    else if (e.key === 'ArrowLeft') setOffset((o) => Math.max(0, o - step));
    else if (e.key === 'Home') setOffset(0);
    else return;
    e.preventDefault();
  };

  const isNow = offset < 0.02 || offset > 23.98;

  return (
    <section className="px-2 md:px-3">
      <div ref={sectionRef} className="relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] bg-[#050505] text-white">
        <div className="relative max-w-[1400px] mx-auto px-5 md:px-12 pt-16 md:pt-24 pb-10 md:pb-14">
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 lg:gap-16 items-end">
            <div>
              <Label>Where we work</Label>
              <h2 className="mt-5 text-[2.6rem] md:text-7xl lg:text-8xl font-bold tracking-[-0.05em] leading-[0.98]">
                Somewhere, it’s always <span className="italic text-[#b9a1ff]">working hours.</span>
              </h2>
            </div>
            <p className="text-white/60 leading-relaxed lg:pb-3 max-w-md">
              We’re based in Dubai and work with clients across North America, Europe, the Gulf, Asia and Australia. Drag the world to move the sun and find a time that suits you.
            </p>
          </div>
        </div>

        {/* The map */}
        <div className="relative max-w-[1400px] mx-auto px-2 md:px-8">
        {/* Readout, above the map on phones */}
          <div className="md:hidden px-3 mb-3">
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">{isNow ? 'Right now in Dubai' : 'A call at, Dubai time'}</p>
            <p className="mt-1 font-mono text-2xl md:text-5xl tabular-nums tracking-tight">
              {timeAt('Asia/Dubai', t)}
              <span className="ml-2 font-sans text-xs md:text-base font-semibold tracking-normal text-white/40">{dayAt('Asia/Dubai', t)}</span>
            </p>
          </div>
          <div
            ref={mapRef}
            onPointerDown={onMapDown}
            onPointerMove={onMapMove}
            onPointerUp={onMapUp}
            onPointerCancel={onMapUp}
            className="relative w-full cursor-grab active:cursor-grabbing select-none touch-pan-y"
            style={{ aspectRatio: `${ASPECT}` }}
          >
            {/* The sun's glow, lighting the day side */}
            <div
              aria-hidden
              className="pointer-events-none absolute w-[70%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ left: `${mapX(sun.lon) * 100}%`, top: `${mapY(sun.lat) * 100}%`, background: 'radial-gradient(circle, rgba(255,214,150,0.16), rgba(112,63,236,0.08) 40%, transparent 68%)' }}
            />
            <canvas ref={canvasRef} aria-hidden className="absolute inset-0 w-full h-full" />

            {/* The sun itself */}
            <div aria-hidden className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${mapX(sun.lon) * 100}%`, top: `${mapY(sun.lat) * 100}%` }}>
              <span className="absolute inset-0 -m-6 rounded-full bg-[#FFC24B]/25 blur-xl" />
              <SunIcon className="relative w-5 h-5 md:w-7 md:h-7 text-[#FFD27A] drop-shadow-[0_0_12px_rgba(255,194,75,0.9)]" />
            </div>

            {/* Cities */}
            {CITIES.map((c) => {
              const p = cityPhase.get(c.name)!;
              const on = hover === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerEnter={() => setHover(c.name)}
                  onPointerLeave={() => setHover((h) => (h === c.name ? null : h))}
                  onFocus={() => setHover(c.name)}
                  onBlur={() => setHover(null)}
                  onClick={() => setHover((h) => (h === c.name ? null : c.name))}
                  aria-label={`${c.name}: ${timeAt(c.tz, t)}, ${PHASE_LABEL[p].toLowerCase()}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 p-2 md:p-2.5 cursor-pointer"
                  style={{ left: `${mapX(c.lon) * 100}%`, top: `${mapY(c.lat) * 100}%`, zIndex: on ? 30 : c.home ? 20 : 10 }}
                >
                  <span className="relative block">
                    {(p === 'work' || c.home) && (
                      <span className={`absolute inset-0 rounded-full animate-ping ${c.home ? 'bg-[#703FEC]/70' : 'bg-white/50'}`} />
                    )}
                    <span
                      className={`relative block rounded-full transition-[background-color,box-shadow,transform] duration-500 ${on ? 'scale-150' : ''} ${
                        c.home
                          ? 'w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-[#703FEC] shadow-[0_0_0_3px_rgba(112,63,236,0.35),0_0_20px_rgba(112,63,236,0.9)]'
                          : p === 'work'
                            ? 'w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]'
                            : p === 'edge'
                              ? 'w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-[#b9a1ff] shadow-[0_0_14px_rgba(185,161,255,0.8)]'
                              : 'w-1.5 h-1.5 md:w-2 md:h-2 bg-[#703FEC] shadow-[0_0_18px_6px_rgba(112,63,236,0.45)]'
                      }`}
                    />
                  </span>
                  <AnimatePresence>
                    {on && (
                      <motion.span
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, transition: { duration: 0.12 } }}
                        transition={{ duration: 0.3, ease }}
                        className={`pointer-events-none absolute bottom-full mb-2 whitespace-nowrap rounded-2xl border border-white/10 bg-[#111]/95 px-4 py-3 text-left shadow-2xl backdrop-blur ${mapX(c.lon) > 0.8 ? 'right-0' : mapX(c.lon) < 0.15 ? 'left-0' : 'left-1/2 -translate-x-1/2'}`}
                      >
                        <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">{c.home ? 'Our studio' : c.country}</span>
                        <span className="mt-1 block text-base font-semibold tracking-tight">{c.name}</span>
                        <span className="mt-0.5 block font-mono text-2xl tabular-nums">{timeAt(c.tz, t)}</span>
                        <span className="mt-1 flex items-center gap-1.5 text-xs text-white/55">
                          <span className={`w-1.5 h-1.5 rounded-full ${p === 'work' ? 'bg-emerald-400' : p === 'edge' ? 'bg-amber-300' : 'bg-white/30'}`} />
                          {PHASE_LABEL[p]}
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}

            {/* Readout, top left */}
            <div className="pointer-events-none absolute left-6 top-2 hidden md:block">
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">{isNow ? 'Right now in Dubai' : 'A call at, Dubai time'}</p>
              <p className="mt-1 font-mono text-2xl md:text-5xl tabular-nums tracking-tight">
                {timeAt('Asia/Dubai', t)}
                <span className="ml-2 font-sans text-xs md:text-base font-semibold tracking-normal text-white/40">{dayAt('Asia/Dubai', t)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Timeline and controls */}
        <div className="relative max-w-[1400px] mx-auto px-5 md:px-12 pt-8 md:pt-10 pb-14 md:pb-20">
          <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
            <div className="md:w-56 shrink-0">
              <p className="text-2xl md:text-3xl font-bold tracking-[-0.03em]">
                <span className="text-[#b9a1ff]">{awake.length}</span> of {CITIES.length} cities
              </p>
              <p className="text-sm text-white/50">{isNow ? 'are at work right now' : 'would be at work then'}</p>
            </div>

            <div className="flex-1">
              <div
                ref={trackRef}
                role="slider"
                tabIndex={0}
                aria-label="Hours from now"
                aria-valuemin={0}
                aria-valuemax={24}
                aria-valuenow={Math.round(offset * 4) / 4}
                aria-valuetext={`${timeAt('Asia/Dubai', t)} in Dubai, ${awake.length} of ${CITIES.length} cities at work`}
                onKeyDown={onKey}
                onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); fromTrack(e.clientX); }}
                onPointerMove={(e) => e.buttons === 1 && fromTrack(e.clientX)}
                className="relative h-12 cursor-ew-resize touch-pan-y outline-none rounded-full focus-visible:ring-2 focus-visible:ring-[#b9a1ff]/60"
              >
                {/* Dubai's day along the next 24 hours */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex h-2 gap-[2px] overflow-hidden rounded-full">
                  {Array.from({ length: 24 }, (_, h) => {
                    const p = phase(hourAt('Asia/Dubai', now + h * HOUR));
                    return <span key={h} className={`flex-1 ${p === 'work' ? 'bg-[#703FEC]' : p === 'edge' ? 'bg-[#703FEC]/35' : 'bg-white/10'}`} />;
                  })}
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${(offset / 24) * 100}%` }}>
                  <span className="grid place-items-center w-10 h-10 rounded-full bg-white text-[#E6A23C] shadow-[0_0_24px_rgba(255,194,75,0.55)]">
                    <SunIcon className="w-5 h-5" />
                  </span>
                </div>
              </div>
              <div className="mt-1 flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                <span>Now</span><span>+6h</span><span>+12h</span><span>+18h</span><span>+24h</span>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button onClick={best} className="rounded-full bg-white text-black px-4 md:px-5 py-3 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#703FEC] hover:text-white transition-colors">Best hour</button>
              <button onClick={backToNow} disabled={isNow} className="rounded-full border border-white/15 px-4 md:px-5 py-3 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white hover:border-white/40 disabled:opacity-30 disabled:pointer-events-none transition-colors">Now</button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
