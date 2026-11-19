/**
 * Entrance-animation policy shared by Reveal, Stagger, AnimatedText and ImageReveal.
 *
 * The boot script adds `js-anim` to <html> so reveal targets can start hidden, and removes it after
 * ENTRANCE_WINDOW_MS no matter what. If hydration lands inside that window, on-screen elements
 * animate in. If it lands later (slow device), on-screen content has already been shown by CSS, so
 * it is left alone instead of being hidden and replayed: this protects LCP and avoids flashes.
 * Elements below the fold can always animate when scrolled into view.
 */
export const ENTRANCE_WINDOW_MS = 1200;

export function isInViewport(el: Element) {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
}

export function entranceWindowOpen() {
  return document.documentElement.classList.contains("js-anim");
}

/** True when it is safe to hide this element now and animate it in. */
export function shouldAnimateEntrance(el: Element) {
  return !isInViewport(el) || entranceWindowOpen();
}
