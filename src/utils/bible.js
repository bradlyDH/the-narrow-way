import 'react-native-url-polyfill/auto';
import { CONFIG } from '../config';

export async function fetchESV(reference) {
  const ref = (reference || '').trim();
  if (!ref) throw new Error('Enter a verse reference');

  const params = new URLSearchParams({
    q: ref,
    'include-passage-references': 'false',
    'include-verse-numbers': 'false',
    'include-footnotes': 'false',
    'include-headings': 'false',
    'include-short-copyright': 'false',
  });

  const res = await fetch(`https://api.esv.org/v3/passage/text/?${params}`, {
    headers: { Authorization: `Token ${CONFIG.ESV_API_KEY}` },
  });
  if (!res.ok) throw new Error(`ESV API ${res.status}`);
  const data = await res.json();
  return (data?.passages?.[0] || '').trim();
}
