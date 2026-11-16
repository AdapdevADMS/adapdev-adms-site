/**
 * Shared by the Astro and Next builds: find every data-fx element and mount
 * its module. Each module exports mount(el, { reduced, signal }).
 *
 * Loading strategy
 * ----------------
 * Most effects live below the fold (CTA particle field, logo ticker, flow
 * lines, horizontal track, etc.). Loading, parsing and initialising them
 * during the critical window inflates Total Blocking Time with no visible
 * benefit, because the user cannot see the element yet.
 *
 * Elements are therefore mounted on demand:
 *
 *   - Eager: an element (or any ancestor) carrying data-fx-eager is mounted
 *     at DOMContentLoaded. The nav uses this because it responds to scroll
 *     from pixel zero.
 *   - Lazy (default): the element is observed through an IntersectionObserver
 *     with a generous rootMargin so the module is ready before the user
 *     reaches it. The actual mount runs in requestIdleCallback where
 *     available, so a long first paint is never interrupted.
 *
 * Graceful degradation: when IntersectionObserver is unavailable (older
 * browsers, test harnesses) every element falls back to eager mount, which
 * is identical to the previous behaviour.
 *
 * The exported `boot(loaders)` signature is unchanged, so the Next build
 * does not have to be updated to pick this up.
 */

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mount a lazy effect this far outside the viewport. 400px gives WebGL and
// canvas effects time to initialise before the user actually sees them.
const LAZY_ROOT_MARGIN = '400px 0px';

// Low-priority wrapper so a lazy mount cannot block user input on arrival.
const scheduleIdle = typeof requestIdleCallback === 'function'
  ? (fn) => requestIdleCallback(fn, { timeout: 1500 })
  : (fn) => setTimeout(fn, 0);

/**
 * Returns true if the element has opted into eager mount, either directly or
 * through an ancestor (so a whole region can be marked eager at once).
 */
function isEager(el) {
  return el.hasAttribute('data-fx-eager') || el.closest('[data-fx-eager]') != null;
}

export function boot(loaders) {
  const run = () => {
    // One (el, name) pair per declared effect. An element may list several
    // space-separated effects on data-fx; each becomes its own pair.
    const pairs = [];
    for (const el of document.querySelectorAll('[data-fx]')) {
      for (const name of el.dataset.fx.split(/\s+/)) {
        if (name) pairs.push([el, name]);
      }
    }
    if (pairs.length === 0) return;

    const mount = (el, name) => {
      const load = loaders[name];
      if (!load) {
        console.warn('[fx] no module for', name);
        return;
      }
      load().then((mod) => {
        try { mod.mount(el, { reduced }); }
        catch (e) { console.error('[fx]', name, e); }
      }).catch((e) => {
        console.error('[fx] failed to load', name, e);
      });
    };

    const canObserve = typeof IntersectionObserver === 'function';

    // Fallback: no IntersectionObserver support means we behave as before.
    if (!canObserve) {
      for (const [el, name] of pairs) mount(el, name);
      return;
    }

    // Split work into eager-now and lazy-later. The eager set is anything
    // explicitly opted in; everything else is observed and mounted on first
    // intersection.
    const lazy = [];
    for (const [el, name] of pairs) {
      if (isEager(el)) mount(el, name);
      else lazy.push([el, name]);
    }
    if (lazy.length === 0) return;

    // Group lazy effects by element so one IO entry can mount every effect
    // declared on that element at once.
    const byElement = new Map();
    for (const [el, name] of lazy) {
      if (!byElement.has(el)) byElement.set(el, []);
      byElement.get(el).push(name);
    }

    const io = new IntersectionObserver((records) => {
      for (const record of records) {
        if (!record.isIntersecting) continue;
        const el = record.target;
        io.unobserve(el);
        const names = byElement.get(el);
        if (!names) continue;
        byElement.delete(el);
        scheduleIdle(() => {
          for (const name of names) mount(el, name);
        });
      }
    }, { rootMargin: LAZY_ROOT_MARGIN });

    for (const el of byElement.keys()) io.observe(el);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
}
