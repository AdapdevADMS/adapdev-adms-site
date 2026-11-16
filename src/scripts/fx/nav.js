// Topbar. Desktop (1200+): once the page moves, the links fold into the
// capsule; pointing at the capsule with a mouse brings them back. Below 1200
// the dots icon opens the dropdown menu and any menu link closes it.
//
// Performance note
// ----------------
// Scroll/resize handlers both READ layout (window.scrollY, innerWidth) and
// WRITE layout (root.classList.toggle). Doing that synchronously on every
// scroll event triggered a 384 ms forced-reflow in the Lighthouse audit (and
// a 194 ms long task on the main thread). We now coalesce all reads and
// writes into a single rAF-driven pass per animation frame, which keeps the
// update rate matched to the display and removes the layout thrash.
const WIDE = 1200;

export function mount(root) {
  const capsule = root.querySelector(".capsule");
  const toggle = root.querySelector(".nav-toggle");
  let hovered = false;
  let pending = false;

  // Coalesced update: all layout reads and the single classList write happen
  // inside one animation frame. classList.toggle with the computed boolean is
  // idempotent — if nothing changed, the browser does no style invalidation.
  const update = () => {
    pending = false;
    const collapse = window.scrollY > 8 && !hovered && window.innerWidth >= WIDE;
    root.classList.toggle("is-collapsed", collapse);
  };
  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  };

  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);

  const wideMouse = (e) => e.pointerType === "mouse" && window.innerWidth >= WIDE;
  capsule.addEventListener("pointerenter", (e) => { if (wideMouse(e)) { hovered = true;  schedule(); } });
  capsule.addEventListener("pointerleave", (e) => { if (wideMouse(e)) { hovered = false; schedule(); } });

  // Initial run so the first paint reflects the current scroll position.
  schedule();

  const setOpen = (open) => {
    root.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  // Keep syncToggle coalesced with the scroll pass so a resize does not run
  // two handlers in a row that both read innerWidth.
  let syncPending = false;
  const syncToggle = () => {
    syncPending = false;
    const wide = window.innerWidth >= WIDE;
    toggle.tabIndex = wide ? -1 : 0;
    if (wide) setOpen(false);
  };
  const scheduleSync = () => {
    if (syncPending) return;
    syncPending = true;
    requestAnimationFrame(syncToggle);
  };
  syncToggle();
  addEventListener("resize", scheduleSync);

  toggle.addEventListener("click", () => {
    if (window.innerWidth < WIDE) setOpen(!root.classList.contains("is-open"));
  });
  root.querySelectorAll(".menu a, .logo").forEach((a) =>
    a.addEventListener("click", () => setOpen(false))
  );
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
}
