/**
 * Tiny shared flag for the intro curtain. It lives at module level, so it resets on a
 * full page load and stays "done" across client-side navigation.
 */
let done = false;
const listeners = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
}

/** Runs cb once the intro is finished (immediately if it already is). Returns a cleanup. */
export function onIntroDone(cb: () => void): () => void {
  if (done) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
