// src/logic/seedBibleFromAsset.js
import { Asset } from 'expo-asset';
import { hardSeedBible, seedBibleIfNeeded } from './seedBible';

/**
 * Resolve bundled JSON and seed if missing (existing behavior).
 */
export async function seedBibleFromBundledJson({
  translation = 'WEB',
  minRows = 30000,
} = {}) {
  try {
    const asset = Asset.fromModule(require('../../assets/data/web_bible.json'));
    if (!asset.downloaded) await asset.downloadAsync();
    const fileUri = asset.localUri || asset.uri;
    if (!fileUri?.startsWith('file://')) return;

    await seedBibleIfNeeded({ fileUri, translation, minRows });
  } catch {
    // silent: asset may not exist
  }
}

/**
 * Force Wipe → Seed → Verify from the bundled JSON.
 * Call this from Debug tools or a one-time maintenance path.
 */
export async function reseedBibleFromBundledJson({ translation = 'WEB' } = {}) {
  const asset = Asset.fromModule(require('../../assets/data/web_bible.json'));
  if (!asset.downloaded) await asset.downloadAsync();
  const fileUri = asset.localUri || asset.uri;
  if (!fileUri?.startsWith('file://')) {
    throw new Error('Bundled Bible JSON not resolved to file://');
  }
  return hardSeedBible({ fileUri, translation });
}
