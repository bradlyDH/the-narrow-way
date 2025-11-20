// src/utils/shortId.js
export function shortCodeFromUid(uid) {
  try {
    const hex = String(uid ?? '').replace(/[^a-f0-9]/gi, '');
    const chunk = hex.slice(0, 10) || '0000000000';
    const num = parseInt(chunk, 16);
    return num.toString(36).toUpperCase().padStart(7, '0').slice(0, 9);
  } catch {
    return String(uid ?? '')
      .replace(/-/g, '')
      .slice(0, 9)
      .toUpperCase();
  }
}
