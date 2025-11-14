// // src/storage/mmkv.js
// import { MMKV } from 'react-native-mmkv';

// export const storage = new MMKV();

// export function getString(key, fallback = null) {
//   const value = storage.getString(key);
//   return value ?? fallback;
// }

// export function setString(key, value) {
//   storage.set(key, value);
// }

// src/storage/mmkv.js
// Temporary shim: behave like MMKV but in memory only (no native module).

const memoryStore = new Map();

export const storage = {
  getString(key) {
    const value = memoryStore.get(key);
    return typeof value === 'string' ? value : null;
  },
  set(key, value) {
    if (value === undefined || value === null) {
      memoryStore.delete(key);
    } else {
      memoryStore.set(key, String(value));
    }
  },
  delete(key) {
    memoryStore.delete(key);
  },
  clearAll() {
    memoryStore.clear();
  },
};

export function getString(key, fallback = null) {
  const value = storage.getString(key);
  return value == null ? fallback : value;
}

export function setString(key, value) {
  storage.set(key, value);
}

export function deleteKey(key) {
  storage.delete(key);
}
