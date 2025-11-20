import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

/**
 * Copies a prebuilt SQLite DB asset into the app's SQLite/ folder on first run.
 * If assetModule is omitted or missing, it's a safe no-op.
 */
export async function installPrebuiltDbOnce({
  dbName = 'app_v2.db',
  assetModule, // optional
} = {}) {
  const sqliteDir = FileSystem.documentDirectory + 'SQLite/';
  await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });

  const dest = sqliteDir + dbName;
  const exists = await FileSystem.getInfoAsync(dest);
  if (exists.exists) return { installed: false, path: dest };

  if (!assetModule) return { installed: false, path: dest };

  let asset;
  try {
    asset = Asset.fromModule(assetModule);
  } catch {
    return { installed: false, path: dest };
  }
  if (!asset.downloaded) await asset.downloadAsync();
  const from = asset.localUri || asset.uri;
  await FileSystem.copyAsync({ from, to: dest });
  return { installed: true, path: dest };
}

export async function openInstalledDb(dbName = 'app_v2.db') {
  const db = await SQLite.openDatabaseAsync(dbName);
  return db;
}
