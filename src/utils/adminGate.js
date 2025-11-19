// src/utils/adminGate.js
// Tiny in-memory admin gate with subscribe support.
// You can wire this to MMKV later if you want persistence.

let _isAdmin = false;
const _subs = new Set();

/**
 * Read current admin flag (cached, in-memory)
 */
export function isAdminCached() {
  return _isAdmin === true;
}

/**
 * Set admin flag and notify subscribers (no-ops if unchanged)
 */
export function setAdminCached(flag) {
  const next = !!flag;
  if (next === _isAdmin) return;
  _isAdmin = next;
  // notify
  for (const cb of _subs) {
    try {
      cb(_isAdmin);
    } catch {}
  }
}

/**
 * Subscribe to admin flag changes.
 * Returns an unsubscribe function.
 */
export function subscribeAdmin(cb) {
  if (typeof cb !== 'function') {
    return () => {};
  }
  _subs.add(cb);
  // immediately push current value
  try {
    cb(_isAdmin);
  } catch {}
  // unsubscribe
  return () => {
    _subs.delete(cb);
  };
}
