// // ./src/utils/bible.js
// import 'react-native-url-polyfill/auto';
// import { CONFIG } from '../config';

// export async function fetchESV(reference) {
//   const ref = (reference || '').trim();
//   if (!ref) throw new Error('Enter a verse reference');

//   const params = new URLSearchParams({
//     q: ref,
//     'include-passage-references': 'false',
//     'include-verse-numbers': 'false',
//     'include-footnotes': 'false',
//     'include-headings': 'false',
//     'include-short-copyright': 'false',
//   });

//   const res = await fetch(`https://api.esv.org/v3/passage/text/?${params}`, {
//     headers: { Authorization: `Token ${CONFIG.ESV_API_KEY}` },
//   });
//   if (!res.ok) throw new Error(`ESV API ${res.status}`);
//   const data = await res.json();
//   return (data?.passages?.[0] || '').trim();
// }

// src/utils/bible.js
import 'react-native-url-polyfill/auto';
import { CONFIG } from '../config';

const _cache = new Map(); // key -> { at:number, text:string }
const TTL_MS = 60 * 1000;

function keyFor(reference) {
  return String(reference ?? '')
    .trim()
    .replace(/\s+/g, ' ');
}

export async function fetchESV(reference) {
  const ref = keyFor(reference);
  if (!ref) throw new Error('Enter a verse reference');

  // small in-memory cache
  const now = Date.now();
  const hit = _cache.get(ref);
  if (hit && now - hit.at < TTL_MS) return hit.text;

  const params = new URLSearchParams({
    q: ref,
    'include-passage-references': 'false',
    'include-verse-numbers': 'false',
    'include-footnotes': 'false',
    'include-headings': 'false',
    'include-short-copyright': 'false',
  });

  let res;
  try {
    res = await fetch(`https://api.esv.org/v3/passage/text/?${params}`, {
      headers: { Authorization: `Token ${CONFIG.ESV_API_KEY}` },
    });
  } catch (e) {
    throw new Error('Network error while contacting ESV API.');
  }

  if (!res.ok) {
    const body = await safeJson(res);
    const msg = body?.detail || `ESV API ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();
  const text = (data?.passages?.[0] || '').trim();

  _cache.set(ref, { at: now, text });
  return text;
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
