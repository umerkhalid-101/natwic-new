import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { motion, animate, useAnimationControls, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';

/**
 * The lead form's "hold the plane" check. The hold is the part people see; the real check
 * is Cloudflare Turnstile, run invisibly while they hold, and verified again in api/lead.ts.
 *
 * VITE_TURNSTILE_SITE_KEY (client) and TURNSTILE_SECRET_KEY (api/lead.ts) are set together.
 * Without the site key the hold alone passes, so local dev and previews still work.
 */

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const HOLD_MS = 1100;
// A press shorter than this is a tap or click: the fill finishes on its own (screen readers, keyboard, quick taps)
const TAP_MS = 250;
// How long the check waits for Turnstile, which may ask for a click first
const CONFIRM_MS = 30_000;
// A fresh token after a failed send normally takes under a second
const READ_MS = 8_000;

const within = <T,>(p: Promise<T>, ms: number) =>
  Promise.race([p, new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error('timed out')), ms))]);
const ease = [0.16, 1, 0.3, 1] as const;

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  execute: (id: string) => void;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: Turnstile } }

let loading: Promise<Turnstile> | null = null;
const loadTurnstile = () =>
  (loading ??= new Promise<Turnstile>((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const s = document.createElement('script');
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile missing')));
    s.onerror = () => { loading = null; reject(new Error('turnstile failed to load')); };
    document.head.appendChild(s);
  }));

export type HumanState = 'idle' | 'holding' | 'checking' | 'verified' | 'failed';

type Deferred = { promise: Promise<string>; resolve: (t: string) => void; reject: (e: unknown) => void };
const deferred = (): Deferred => {
  let resolve!: Deferred['resolve'], reject!: Deferred['reject'];
  const promise = new Promise<string>((res, rej) => { resolve = res; reject = rej; });
  promise.catch(() => { /* read by whoever awaits it */ });
  return { promise, resolve, reject };
};

/** Owns the Turnstile widget and the check's state. `box` is where Turnstile may ask for a click. */
export const useHumanCheck = (dark: boolean) => {
  const [state, setState] = useState<HumanState>('idle');
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const token = useRef<Deferred | null>(null);

  /** Starts a fresh Turnstile run in the background; its token lands in `token`. */
  const prepare = useCallback(async () => {
    if (!SITE_KEY) return;
    const d = deferred();
    token.current = d;
    try {
      const ts = await loadTurnstile();
      if (!box.current) throw new Error('form is gone');
      if (widget.current) ts.reset(widget.current);
      else {
        widget.current = ts.render(box.current, {
          sitekey: SITE_KEY,
          execution: 'execute',
          appearance: 'interaction-only',
          theme: dark ? 'dark' : 'light',
          size: 'flexible',
          retry: 'never',
          callback: (t: string) => token.current?.resolve(t),
          'error-callback': () => { token.current?.reject(new Error('turnstile error')); return true; },
          'timeout-callback': () => token.current?.reject(new Error('turnstile timed out')),
          'unsupported-callback': () => token.current?.reject(new Error('turnstile unsupported')),
          // Tokens last 5 minutes: after that the visitor holds again, rather than sending a dead token
          'expired-callback': () => { token.current = null; setState('idle'); },
        });
      }
      ts.execute(widget.current);
    } catch (e) {
      d.reject(e);
    }
  }, [dark]);

  /** The hold began: give Turnstile a head start */
  const begin = useCallback(() => {
    setState((s) => (s === 'verified' || s === 'checking' ? s : 'holding'));
    if (SITE_KEY && (!token.current || state === 'failed')) void prepare();
  }, [prepare, state]);

  const cancel = useCallback(() => setState((s) => (s === 'holding' ? 'idle' : s)), []);

  /** The hold finished: wait for Turnstile's answer (long enough for its own click, if it asks) */
  const confirm = useCallback(async () => {
    if (!SITE_KEY) return setState('verified');
    setState('checking');
    try {
      if (!token.current) throw new Error('no run');
      await within(token.current.promise, CONFIRM_MS);
      setState('verified');
    } catch {
      setState('failed');
    }
  }, []);

  /**
   * The token for this send: '' without Turnstile, null if there isn't a good one. On null the
   * check goes back to "Hold again" so the send waits for the person, never goes out as spam.
   */
  const read = useCallback(async (): Promise<string | null> => {
    if (!SITE_KEY) return '';
    try {
      if (!token.current) throw new Error('no run');
      return await within(token.current.promise, READ_MS);
    } catch {
      token.current = null;
      setState('failed');
      return null;
    }
  }, []);

  /** Tokens work once: after a send, quietly fetch the next one */
  const refresh = useCallback(() => { if (SITE_KEY) void prepare(); }, [prepare]);

  /** A new message: back to the start */
  const reset = useCallback(() => {
    if (widget.current) { try { window.turnstile?.remove(widget.current); } catch { /* already gone */ } }
    widget.current = null;
    token.current = null;
    setState('idle');
  }, []);

  useEffect(() => () => { if (widget.current) { try { window.turnstile?.remove(widget.current); } catch { /* already gone */ } } }, []);

  return { state, box, begin, cancel, confirm, read, refresh, reset };
};

export type HumanCheck = ReturnType<typeof useHumanCheck>;

const LABEL: Record<HumanState, string> = {
  idle: 'Hold to verify',
  holding: 'Keep holding…',
  checking: 'Checking…',
  verified: 'Verified',
  failed: 'Hold again',
};

/** Read out by screen readers as the check moves on */
const STATUS: Record<HumanState, string> = {
  idle: 'Press to confirm you’re a person.',
  holding: '',
  checking: 'Checking…',
  verified: 'Verified. You can send your message.',
  failed: 'That check didn’t work. Press again.',
};

/** The pill: hold the plane until it fills, by pointer or with Space / Enter. */
export const HumanCheckButton = React.forwardRef<HTMLButtonElement, {
  check: HumanCheck;
  /** QuickBrief's tone classes for the pill and its fill */
  pill: string;
  fill: string;
  nudge: number;
  onFocus?: () => void;
}>(({ check, pill, fill, nudge, onFocus }, ref) => {
  const statusId = useId();
  const p = useMotionValue(0);
  const run = useRef<ReturnType<typeof animate> | null>(null);
  const reduce = useReducedMotion();
  const done = check.state === 'verified' || check.state === 'checking';
  const scaleX = useTransform(p, (v) => (done ? 1 : v));
  const planeX = useTransform(p, [0, 1], [0, 4]);
  const planeRotate = useTransform(p, [0, 1], [0, -18]);

  useEffect(() => {
    if (check.state === 'idle' || check.state === 'failed') p.set(0);
  }, [check.state]);

  // Shake in place (no remount), so the focus Send just gave the pill stays on it
  const shake = useAnimationControls();
  useEffect(() => {
    if (nudge && !reduce) void shake.start({ x: [0, -10, 9, -6, 4, 0], transition: { duration: 0.45 } });
  }, [nudge]);

  // The hold finishes on a real timer; the fill only shows it. Throttled frames (low-power
  // mode, a background tab) slow the fill, but never leave someone holding forever.
  const timer = useRef<number | null>(null);
  const finished = useRef(false);
  const pressedAt = useRef(0);
  // Nobody is holding (a tap, or a screen reader's click): say "Verifying…", not "Keep holding…"
  const [auto, setAuto] = useState(false);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const start = () => {
    if (done || timer.current) return;
    finished.current = false;
    setAuto(false);
    pressedAt.current = Date.now();
    check.begin();
    run.current?.stop();
    const left = HOLD_MS * (1 - p.get());
    run.current = animate(p, 1, { duration: left / 1000, ease: 'linear' });
    timer.current = window.setTimeout(() => {
      timer.current = null;
      finished.current = true;
      run.current?.stop();
      p.set(1);
      void check.confirm();
    }, left);
  };
  /** Let go: a quick tap carries on by itself; letting go partway through a hold drains it */
  const stop = () => {
    if (done || finished.current || !timer.current) return;
    if (Date.now() - pressedAt.current < TAP_MS) { setAuto(true); return; }
    window.clearTimeout(timer.current);
    timer.current = null;
    run.current?.stop();
    check.cancel();
    run.current = animate(p, 0, { duration: 0.25, ease });
  };

  return (
    <motion.span animate={shake} className="inline-flex">
      <button
        ref={ref}
        type="button"
        aria-describedby={statusId}
        onPointerDown={(e) => { if (e.button === 0) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* still holds */ } start(); } }}
        onPointerUp={stop}
        onPointerCancel={stop}
        onKeyDown={(e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start(); } }}
        onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); stop(); } }}
        // Screen readers send a bare click, with no press before it: run the check for them
        onClick={() => { if (!timer.current && !done) { start(); setAuto(true); } }}
        onBlur={stop}
        onFocus={onFocus}
        onContextMenu={(e) => e.preventDefault()}
        className={`relative overflow-hidden inline-flex items-center gap-3 rounded-full border pl-1.5 pr-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] select-none touch-none transition-colors ${pill} ${done ? 'cursor-default' : 'cursor-pointer'}`}
      >
        <motion.span aria-hidden className={`absolute inset-0 origin-left ${fill}`} style={{ scaleX }} />
        <span className="relative w-10 h-10 rounded-full bg-[#703FEC] text-white grid place-items-center">
          {check.state === 'verified' ? (
            <motion.svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <motion.path d="M5 12.5 10 17.5 19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : 0.35, ease }} />
            </motion.svg>
          ) : check.state === 'checking' ? (
            <motion.span
              aria-hidden
              className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
              animate={reduce ? {} : { rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            />
          ) : (
            <motion.svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden style={{ x: planeX, rotate: planeRotate }}>
              <path d="M3 11.5 21 3l-7.5 18-2.5-7.5L3 11.5Z" />
            </motion.svg>
          )}
        </span>
        <span className="relative">{check.state === 'holding' && auto ? 'Verifying…' : LABEL[check.state]}</span>
      </button>
      <span id={statusId} role="status" className="sr-only">{STATUS[check.state]}</span>
    </motion.span>
  );
});
HumanCheckButton.displayName = 'HumanCheckButton';
