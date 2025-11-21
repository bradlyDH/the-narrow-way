// // src/screens/DebugScreen.js
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
//   Platform,
// } from 'react-native';

// import Screen from '../components/Screen';
// import { Colors } from '../constants/colors';

// // logging
// import { getLogLevel, setLogLevel, log } from '../utils/logger';

// // storage + bible utilities
// import * as FileSystem from 'expo-file-system';
// import { Asset } from 'expo-asset';
// import { getDb } from '../storage/db';
// import { hardSeedBible, verifyBible, wipeBible } from '../logic/seedBible';

// const LEVELS = ['silent', 'error', 'warn', 'info', 'debug', 'trace'];

// export default function DebugScreen({ navigation }) {
//   const [current, setCurrent] = useState(getLogLevel());
//   const [busy, setBusy] = useState(false);
//   const [bibleStatus, setBibleStatus] = useState(null);
//   const L = log('debug');

//   useEffect(() => {
//     setCurrent(getLogLevel());
//   }, []);

//   // ----- Log level controls -----
//   const onPick = (lvl) => {
//     try {
//       setLogLevel(lvl);
//       setCurrent(lvl);
//       L.info('Log level changed to:', lvl);
//       Alert.alert('Logging', `Log level set to "${lvl}"`);
//     } catch (e) {
//       Alert.alert('Error', e?.message || String(e));
//     }
//   };

//   // ----- Bible tools -----
//   async function resolveBibleJsonAsset() {
//     // Path from src/screens to project root assets/
//     const a = Asset.fromModule(require('../../assets/data/web_bible.json'));
//     if (!a.downloaded) await a.downloadAsync();
//     const fileUri = a.localUri || a.uri;
//     if (!fileUri || !fileUri.startsWith('file://')) {
//       throw new Error('WEB JSON asset not found or not local.');
//     }
//     return fileUri;
//   }

//   async function runVerify() {
//     try {
//       setBusy(true);
//       const stats = await verifyBible({ translation: 'WEB' });
//       setBibleStatus(stats); // { total, books, ok }
//       Alert.alert(
//         'Verify Bible',
//         `WEB: books=${stats.books}, verses=${stats.total}, ok=${
//           stats.ok ? 'yes' : 'no'
//         }`
//       );
//     } catch (e) {
//       Alert.alert('Verify failed', e?.message || String(e));
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function checkDbHealth() {
//     try {
//       setBusy(true);
//       const stats = await verifyBible({ translation: 'WEB' });
//       setBibleStatus(stats);
//       Alert.alert(
//         'DB Health',
//         `WEB: books=${stats.books}, verses=${stats.total}, ok=${
//           stats.ok ? 'yes' : 'no'
//         }`
//       );
//     } catch (e) {
//       Alert.alert('Health check failed', e?.message || String(e));
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function runReseed() {
//     try {
//       setBusy(true);
//       // const fileUri = await resolveBibleJsonAsset();
//       // const res = await hardSeedBible({
//       // fileUri,
//       const res = await hardSeedBible({
//         translation: 'WEB',
//         onProgress: (inserted, total) =>
//           L.debug(`[hardSeedBible] ${inserted}/${total}`), // ← backticks
//       });
//       setBibleStatus(res.verify);
//       Alert.alert(
//         'Reseed complete',
//         `WEB: books=${res.verify.books}, verses=${res.verify.total}, ok=${
//           res.verify.ok ? 'yes' : 'no'
//         }`
//       );
//     } catch (e) {
//       Alert.alert('Reseed failed', e?.message || String(e));
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function runWipe() {
//     try {
//       setBusy(true);
//       await wipeBible({ translation: 'WEB' });
//       setBibleStatus(null);
//       Alert.alert('Wipe complete', 'Removed all WEB rows. You can now reseed.');
//     } catch (e) {
//       Alert.alert('Wipe failed', e?.message || String(e));
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function dumpBookCounts() {
//     try {
//       setBusy(true);
//       const db = await getDb();
//       const rows = await db.getAllAsync(
//         `SELECT book, COUNT(*) AS verses
//          FROM bible_verses
//          WHERE translation_code = 'WEB'
//          GROUP BY book
//          ORDER BY MIN(rowid);`
//       );
//       L.info('[WEB per-book counts]', rows);
//       Alert.alert('Counts logged', 'Check Metro console for per-book totals.');
//     } catch (e) {
//       Alert.alert('Query failed', e?.message || String(e));
//     } finally {
//       setBusy(false);
//     }
//   }

//   // ----- Helpers you added: count JSON rows & list distinct DB books -----
//   async function checkJsonCount() {
//     try {
//       setBusy(true);
//       const rows = require('../../assets/data/web_bible.json');
//       const len = Array.isArray(rows) ? rows.length : NaN;
//       Alert.alert('JSON rows', String(len));
//     } catch (e) {
//       Alert.alert('JSON read fialed', e?.message || String(e));
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function listDistinctBooks() {
//     try {
//       setBusy(true);
//       const db = await getDb();
//       const rows = await db.getAllAsync(
//         `SELECT book, COUNT(*) AS verses
//          FROM bible_verses
//          WHERE translation_code='WEB'
//          GROUP BY book
//          ORDER BY MIN(rowid);`
//       );
//       console.log(
//         '[WEB books]',
//         rows.map((r) => r.book)
//       );
//       console.log('[WEB per-book counts]', rows);
//       Alert.alert('Logged', 'Books + counts printed to Metro.');
//     } catch (e) {
//       Alert.alert('Query failed', e?.message || String(e));
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function reseedWebSafe() {
//     try {
//       setBusy(true);

//       // 1) Confirm bundled JSON is intact
//       const rows = require('../../assets/data/web_bible.json');
//       const totalRows = Array.isArray(rows) ? rows.length : 0;
//       if (totalRows < 30000) {
//         Alert.alert(
//           'Reseed aborted',
//           `Bundled JSON looks incomplete (rows=${totalRows}). Replace assets/data/web_bible.json.`
//         );
//         return;
//       }

//       // 2) Wipe current WEB
//       await wipeBible({ translation: 'WEB' });

//       // 3) Reseed using bundled data (no fileUri; avoids file:// headaches)
//       const res = await hardSeedBible({
//         translation: 'WEB',
//         onProgress: (inserted, total) =>
//           log('debug').debug(`[hardSeedBible] ${inserted}/${total}`),
//       });

//       // 4) Verify and report
//       const stats = await verifyBible({ translation: 'WEB' });
//       setBibleStatus(stats);

//       Alert.alert(
//         'Reseed complete',
//         `WEB: books=${stats.books}, verses=${stats.total}, ok=${
//           stats.ok ? 'yes' : 'no'
//         }`
//       );
//     } catch (e) {
//       Alert.alert('Reseed failed', e?.message || String(e));
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <Screen showBack onBack={() => navigation.goBack()}>
//       <ScrollView
//         style={{ flex: 1 }}
//         contentContainerStyle={styles.scrollContent}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator
//       >
//         <View style={styles.wrap}>
//           <Text style={styles.title}>Debug Settings</Text>
//           <Text style={styles.sub}>Current log level: {current}</Text>

//           <View style={{ height: 12 }} />

//           {LEVELS.map((lvl) => (
//             <TouchableOpacity
//               key={lvl}
//               onPress={() => onPick(lvl)}
//               style={[
//                 styles.levelBtn,
//                 current === lvl && {
//                   borderColor: Colors.button,
//                   borderWidth: 2,
//                 },
//               ]}
//               activeOpacity={0.9}
//             >
//               <Text
//                 style={[
//                   styles.levelText,
//                   current === lvl && {
//                     color: Colors.button,
//                     fontWeight: '900',
//                   },
//                 ]}
//               >
//                 {lvl.toUpperCase()}
//               </Text>
//             </TouchableOpacity>
//           ))}

//           <View style={{ height: 24 }} />

//           <Text style={styles.title}>Bible Tools</Text>
//           <Text style={styles.sub}>
//             {busy
//               ? 'Working…'
//               : bibleStatus
//               ? `WEB: ${bibleStatus.books} books, ${
//                   bibleStatus.total
//                 } verses (${bibleStatus.ok ? 'OK' : 'incomplete'})`
//               : 'No status yet'}
//           </Text>

//           <View style={{ height: 12 }} />

//           <TouchableOpacity
//             onPress={runVerify}
//             style={styles.actionBtn}
//             activeOpacity={0.9}
//             disabled={busy}
//           >
//             <Text style={styles.actionText}>Verify Bible (counts)</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={runReseed}
//             style={styles.actionBtn}
//             activeOpacity={0.9}
//             disabled={busy}
//           >
//             <Text style={styles.actionText}>Hard Reseed from JSON</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={dumpBookCounts}
//             style={styles.actionBtn}
//             activeOpacity={0.9}
//             disabled={busy}
//           >
//             <Text style={styles.actionText}>Log per-book counts</Text>
//           </TouchableOpacity>

//           {/* New helper actions */}
//           <TouchableOpacity
//             onPress={checkJsonCount}
//             style={styles.actionBtn}
//             activeOpacity={0.9}
//             disabled={busy}
//           >
//             <Text style={styles.actionText}>Check JSON row count</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={listDistinctBooks}
//             style={styles.actionBtn}
//             activeOpacity={0.9}
//             disabled={busy}
//           >
//             <Text style={styles.actionText}>Log distinct books</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={checkDbHealth}
//             style={styles.actionBtn}
//             activeOpacity={0.9}
//             disabled={busy}
//           >
//             <Text style={styles.actionText}>Check DB health</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={reseedWebSafe}
//             style={styles.actionBtn}
//             activeOpacity={0.9}
//             disabled={busy}
//           >
//             <Text style={styles.actionText}>Reseed WEB (safe)</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={async () => {
//               try {
//                 await sendTestEmail('yourgmail@gmail.com');
//                 Alert.alert('Success', 'Test email sent!');
//               } catch (e) {
//                 Alert.alert('Email failed', e?.message || 'Unknown error');
//               }
//             }}
//             style={styles.actionBtn}
//             activeOpacity={0.9}
//           >
//             <Text style={styles.actionText}>Send test email</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={runWipe}
//             style={[styles.actionBtn, { backgroundColor: '#fee2e2' }]}
//             activeOpacity={0.9}
//             disabled={busy}
//           >
//             <Text style={[styles.actionText, { color: '#991b1b' }]}>
//               Wipe WEB
//             </Text>
//           </TouchableOpacity>

//           {busy && (
//             <View style={{ marginTop: 12 }}>
//               <ActivityIndicator />
//             </View>
//           )}
//         </View>
//       </ScrollView>
//     </Screen>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContent: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 24,
//   },
//   wrap: {},
//   title: { fontSize: 24, fontWeight: '800', color: Colors.button },
//   sub: { marginTop: 6, color: Colors.text },

//   levelBtn: {
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     borderRadius: 12,
//     backgroundColor: '#e9eef3',
//     marginBottom: 10,
//   },
//   levelText: { color: '#173f5f', fontWeight: '800' },

//   actionBtn: {
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     borderRadius: 12,
//     backgroundColor: '#eef2ff',
//     marginBottom: 10,
//   },
//   actionText: { color: '#1d4ed8', fontWeight: '800' },
// });

// src/screens/DebugScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';

import Screen from '../components/Screen';
import { Colors } from '../constants/colors';

// logging
import { getLogLevel, setLogLevel, log } from '../utils/logger';

// storage + bible utilities
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { getDb } from '../storage/db';
import { hardSeedBible, verifyBible, wipeBible } from '../logic/seedBible';

// Supabase (for invoking your Edge Function)
import { supabase } from '../supabase';

const LEVELS = ['silent', 'error', 'warn', 'info', 'debug', 'trace'];

export default function DebugScreen({ navigation }) {
  const [current, setCurrent] = useState(getLogLevel());
  const [busy, setBusy] = useState(false);
  const [bibleStatus, setBibleStatus] = useState(null);
  const L = log('debug');

  useEffect(() => {
    setCurrent(getLogLevel());
  }, []);

  // ----- Log level controls -----
  const onPick = (lvl) => {
    try {
      setLogLevel(lvl);
      setCurrent(lvl);
      L.info('Log level changed to:', lvl);
      Alert.alert('Logging', `Log level set to "${lvl}"`);
    } catch (e) {
      Alert.alert('Error', e?.message || String(e));
    }
  };

  // ----- Bible tools -----
  async function resolveBibleJsonAsset() {
    // Path from src/screens to project root assets/
    const a = Asset.fromModule(require('../../assets/data/web_bible.json'));
    if (!a.downloaded) await a.downloadAsync();
    const fileUri = a.localUri || a.uri;
    if (!fileUri || !fileUri.startsWith('file://')) {
      throw new Error('WEB JSON asset not found or not local.');
    }
    return fileUri;
  }

  async function runVerify() {
    try {
      setBusy(true);
      const stats = await verifyBible({ translation: 'WEB' });
      setBibleStatus(stats); // { total, books, ok }
      Alert.alert(
        'Verify Bible',
        `WEB: books=${stats.books}, verses=${stats.total}, ok=${
          stats.ok ? 'yes' : 'no'
        }`
      );
    } catch (e) {
      Alert.alert('Verify failed', e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  async function checkDbHealth() {
    try {
      setBusy(true);
      const stats = await verifyBible({ translation: 'WEB' });
      setBibleStatus(stats);
      Alert.alert(
        'DB Health',
        `WEB: books=${stats.books}, verses=${stats.total}, ok=${
          stats.ok ? 'yes' : 'no'
        }`
      );
    } catch (e) {
      Alert.alert('Health check failed', e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  async function runReseed() {
    try {
      setBusy(true);
      // If you prefer fileUri-based seeding, uncomment next two lines and pass fileUri below.
      // const fileUri = await resolveBibleJsonAsset();
      // const res = await hardSeedBible({ fileUri, translation: 'WEB', onProgress: (inserted, total) => L.debug(`[hardSeedBible] ${inserted}/${total}`) });

      const res = await hardSeedBible({
        translation: 'WEB',
        onProgress: (inserted, total) =>
          L.debug(`[hardSeedBible] ${inserted}/${total}`),
      });
      setBibleStatus(res.verify);
      Alert.alert(
        'Reseed complete',
        `WEB: books=${res.verify.books}, verses=${res.verify.total}, ok=${
          res.verify.ok ? 'yes' : 'no'
        }`
      );
    } catch (e) {
      Alert.alert('Reseed failed', e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  async function runWipe() {
    try {
      setBusy(true);
      await wipeBible({ translation: 'WEB' });
      setBibleStatus(null);
      Alert.alert('Wipe complete', 'Removed all WEB rows. You can now reseed.');
    } catch (e) {
      Alert.alert('Wipe failed', e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  async function dumpBookCounts() {
    try {
      setBusy(true);
      const db = await getDb();
      const rows = await db.getAllAsync(
        `SELECT book, COUNT(*) AS verses
         FROM bible_verses
         WHERE translation_code = 'WEB'
         GROUP BY book
         ORDER BY MIN(rowid);`
      );
      L.info('[WEB per-book counts]', rows);
      Alert.alert('Counts logged', 'Check Metro console for per-book totals.');
    } catch (e) {
      Alert.alert('Query failed', e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  // ----- Helpers you added: count JSON rows & list distinct DB books -----
  async function checkJsonCount() {
    try {
      setBusy(true);
      const rows = require('../../assets/data/web_bible.json');
      const len = Array.isArray(rows) ? rows.length : NaN;
      Alert.alert('JSON rows', String(len));
    } catch (e) {
      Alert.alert('JSON read failed', e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  async function listDistinctBooks() {
    try {
      setBusy(true);
      const db = await getDb();
      const rows = await db.getAllAsync(
        `SELECT book, COUNT(*) AS verses
         FROM bible_verses
         WHERE translation_code='WEB'
         GROUP BY book
         ORDER BY MIN(rowid);`
      );
      console.log(
        '[WEB books]',
        rows.map((r) => r.book)
      );
      console.log('[WEB per-book counts]', rows);
      Alert.alert('Logged', 'Books + counts printed to Metro.');
    } catch (e) {
      Alert.alert('Query failed', e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  async function reseedWebSafe() {
    try {
      setBusy(true);

      // 1) Confirm bundled JSON is intact
      const rows = require('../../assets/data/web_bible.json');
      const totalRows = Array.isArray(rows) ? rows.length : 0;
      if (totalRows < 30000) {
        Alert.alert(
          'Reseed aborted',
          `Bundled JSON looks incomplete (rows=${totalRows}). Replace assets/data/web_bible.json.`
        );
        return;
      }

      // 2) Wipe current WEB
      await wipeBible({ translation: 'WEB' });

      // 3) Reseed using bundled data (no fileUri; avoids file:// headaches)
      const res = await hardSeedBible({
        translation: 'WEB',
        onProgress: (inserted, total) =>
          log('debug').debug(`[hardSeedBible] ${inserted}/${total}`),
      });

      // 4) Verify and report
      const stats = await verifyBible({ translation: 'WEB' });
      setBibleStatus(stats);

      Alert.alert(
        'Reseed complete',
        `WEB: books=${stats.books}, verses=${stats.total}, ok=${
          stats.ok ? 'yes' : 'no'
        }`
      );
    } catch (e) {
      Alert.alert('Reseed failed', e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  // ----- Email test via Supabase Edge Function (uses current session JWT automatically) -----
  async function sendTestEmail() {
    try {
      setBusy(true);
      const { data, error } = await supabase.functions.invoke('email', {
        body: {
          to: 'support@thenarrowwayapp.com', // <-- change me
          subject: 'TNW test email',
          text: 'If you got this, the pipeline works ✅',
        },
      });
      if (error) {
        // Surface as much as possible
        console.log('[email invoke error]', JSON.stringify(error, null, 2));
        const status = error?.status ?? 'unknown';
        const msg =
          error?.message ||
          error?.name ||
          (typeof error === 'string' ? error : 'Unknown error');

        // Some environments tuck provider error in error.context
        const ctx = error?.context ? JSON.stringify(error.context) : '';
        Alert.alert('Email failed', `status=${status}\n${msg}\n${ctx}`);
        return;
      }
      Alert.alert(
        'Success',
        'Test email sent. Check your inbox & Postmark Activity.'
      );
    } catch (e) {
      Alert.alert('Email failed (catch)', e?.message || 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        <View style={styles.wrap}>
          <Text style={styles.title}>Debug Settings</Text>
          <Text style={styles.sub}>Current log level: {current}</Text>

          <View style={{ height: 12 }} />

          {LEVELS.map((lvl) => (
            <TouchableOpacity
              key={lvl}
              onPress={() => onPick(lvl)}
              style={[
                styles.levelBtn,
                current === lvl && {
                  borderColor: Colors.button,
                  borderWidth: 2,
                },
              ]}
              activeOpacity={0.9}
            >
              <Text
                style={[
                  styles.levelText,
                  current === lvl && {
                    color: Colors.button,
                    fontWeight: '900',
                  },
                ]}
              >
                {lvl.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={{ height: 24 }} />

          <Text style={styles.title}>Bible Tools</Text>
          <Text style={styles.sub}>
            {busy
              ? 'Working…'
              : bibleStatus
              ? `WEB: ${bibleStatus.books} books, ${
                  bibleStatus.total
                } verses (${bibleStatus.ok ? 'OK' : 'incomplete'})`
              : 'No status yet'}
          </Text>

          <View style={{ height: 12 }} />

          <TouchableOpacity
            onPress={runVerify}
            style={styles.actionBtn}
            activeOpacity={0.9}
            disabled={busy}
          >
            <Text style={styles.actionText}>Verify Bible (counts)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={runReseed}
            style={styles.actionBtn}
            activeOpacity={0.9}
            disabled={busy}
          >
            <Text style={styles.actionText}>Hard Reseed from JSON</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={dumpBookCounts}
            style={styles.actionBtn}
            activeOpacity={0.9}
            disabled={busy}
          >
            <Text style={styles.actionText}>Log per-book counts</Text>
          </TouchableOpacity>

          {/* New helper actions */}
          <TouchableOpacity
            onPress={checkJsonCount}
            style={styles.actionBtn}
            activeOpacity={0.9}
            disabled={busy}
          >
            <Text style={styles.actionText}>Check JSON row count</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={listDistinctBooks}
            style={styles.actionBtn}
            activeOpacity={0.9}
            disabled={busy}
          >
            <Text style={styles.actionText}>Log distinct books</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={checkDbHealth}
            style={styles.actionBtn}
            activeOpacity={0.9}
            disabled={busy}
          >
            <Text style={styles.actionText}>Check DB health</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={reseedWebSafe}
            style={styles.actionBtn}
            activeOpacity={0.9}
            disabled={busy}
          >
            <Text style={styles.actionText}>Reseed WEB (safe)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={sendTestEmail}
            style={styles.actionBtn}
            activeOpacity={0.9}
            disabled={busy}
          >
            <Text style={styles.actionText}>Send test email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={runWipe}
            style={[styles.actionBtn, { backgroundColor: '#fee2e2' }]}
            activeOpacity={0.9}
            disabled={busy}
          >
            <Text style={[styles.actionText, { color: '#991b1b' }]}>
              Wipe WEB
            </Text>
          </TouchableOpacity>

          {busy && (
            <View style={{ marginTop: 12 }}>
              <ActivityIndicator />
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  wrap: {},
  title: { fontSize: 24, fontWeight: '800', color: Colors.button },
  sub: { marginTop: 6, color: Colors.text },

  levelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#e9eef3',
    marginBottom: 10,
  },
  levelText: { color: '#173f5f', fontWeight: '800' },

  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    marginBottom: 10,
  },
  actionText: { color: '#1d4ed8', fontWeight: '800' },
});
