// // // src/screens/BibleScreen.js
// // import React, { useEffect, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TouchableOpacity,
// // } from 'react-native';

// // import Screen from '../components/Screen';
// // import { Colors } from '../constants/colors';
// // import { getDb } from '../storage/db';
// // import { seedBibleIfNeeded } from '../logic/seedBible';

// // // You can refine or move this list later
// // const BOOKS = [
// //   'Genesis',
// //   'Exodus',
// //   'Leviticus',
// //   'Numbers',
// //   'Deuteronomy',
// //   'Joshua',
// //   'Judges',
// //   'Ruth',
// //   '1 Samuel',
// //   '2 Samuel',
// //   '1 Kings',
// //   '2 Kings',
// //   '1 Chronicles',
// //   '2 Chronicles',
// //   'Ezra',
// //   'Nehemiah',
// //   'Esther',
// //   'Job',
// //   'Psalms',
// //   'Proverbs',
// //   'Ecclesiastes',
// //   'Song of Solomon',
// //   'Isaiah',
// //   'Jeremiah',
// //   'Lamentations',
// //   'Ezekiel',
// //   'Daniel',
// //   'Hosea',
// //   'Joel',
// //   'Amos',
// //   'Obadiah',
// //   'Jonah',
// //   'Micah',
// //   'Nahum',
// //   'Habakkuk',
// //   'Zephaniah',
// //   'Haggai',
// //   'Zechariah',
// //   'Malachi',
// //   'Matthew',
// //   'Mark',
// //   'Luke',
// //   'John',
// //   'Acts',
// //   'Romans',
// //   '1 Corinthians',
// //   '2 Corinthians',
// //   'Galatians',
// //   'Ephesians',
// //   'Philippians',
// //   'Colossians',
// //   '1 Thessalonians',
// //   '2 Thessalonians',
// //   '1 Timothy',
// //   '2 Timothy',
// //   'Titus',
// //   'Philemon',
// //   'Hebrews',
// //   'James',
// //   '1 Peter',
// //   '2 Peter',
// //   '1 John',
// //   '2 John',
// //   '3 John',
// //   'Jude',
// //   'Revelation',
// // ];

// // export default function BibleScreen({ route, navigation }) {
// //   const initialBook = route?.params?.book || 'John';
// //   const initialChapter = route?.params?.chapter || 1;

// //   const [book, setBook] = useState(initialBook);
// //   const [chapter, setChapter] = useState(initialChapter);
// //   const [verses, setVerses] = useState([]);
// //   const [maxChapter, setMaxChapter] = useState(150); // safe fallback
// //   const [loading, setLoading] = useState(true);

// //   // Load verses for current book/chapter from SQLite
// //   useEffect(() => {
// //     let mounted = true;

// //     (async () => {
// //       try {
// //         setLoading(true);

// //         // 🔹 Ensure WEB is seeded before reading
// //         await seedBibleIfNeeded();

// //         const db = await getDb();

// //         // 1) Find verses
// //         const rows = await db.getAllAsync(
// //           `
// //           SELECT verse, text
// //           FROM bible_verses
// //           WHERE translation_code = 'WEB'
// //             AND book = ?
// //             AND chapter = ?
// //           ORDER BY verse ASC;
// //         `,
// //           [book, chapter]
// //         );

// //         // 2) Optionally, compute maxChapter for this book (first time only or when book changes)
// //         const chapRow = await db.getFirstAsync(
// //           `
// //           SELECT MAX(chapter) AS max_chapter
// //           FROM bible_verses
// //           WHERE translation_code = 'WEB'
// //             AND book = ?;
// //         `,
// //           [book]
// //         );

// //         if (!mounted) return;
// //         setVerses(rows || []);
// //         setMaxChapter(chapRow?.max_chapter || 1);
// //       } catch (e) {
// //         if (mounted) {
// //           setVerses([]);
// //         }
// //       } finally {
// //         if (mounted) setLoading(false);
// //       }
// //     })();

// //     return () => {
// //       mounted = false;
// //     };
// //   }, [book, chapter]);

// //   const onPrevChapter = () => {
// //     if (chapter > 1) {
// //       setChapter((c) => c - 1);
// //     }
// //   };

// //   const onNextChapter = () => {
// //     if (chapter < maxChapter) {
// //       setChapter((c) => c + 1);
// //     }
// //   };

// //   return (
// //     <Screen showBack onBack={() => navigation.goBack()}>
// //       <ScrollView
// //         contentContainerStyle={styles.content}
// //         keyboardShouldPersistTaps="handled"
// //       >
// //         <Text style={styles.title}>Bible (WEB)</Text>

// //         {/* Book selector (simple horizontal chips for now) */}
// //         <View style={styles.bookRow}>
// //           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
// //             {BOOKS.map((b) => {
// //               const active = b === book;
// //               return (
// //                 <TouchableOpacity
// //                   key={b}
// //                   onPress={() => {
// //                     setBook(b);
// //                     setChapter(1);
// //                   }}
// //                   style={[styles.bookChip, active && styles.bookChipActive]}
// //                 >
// //                   <Text
// //                     style={[
// //                       styles.bookChipText,
// //                       active && styles.bookChipTextActive,
// //                     ]}
// //                   >
// //                     {b}
// //                   </Text>
// //                 </TouchableOpacity>
// //               );
// //             })}
// //           </ScrollView>
// //         </View>

// //         {/* Chapter controls */}
// //         <View style={styles.chapterRow}>
// //           <TouchableOpacity
// //             onPress={onPrevChapter}
// //             disabled={chapter <= 1}
// //             style={[styles.chapterBtn, chapter <= 1 && { opacity: 0.4 }]}
// //           >
// //             <Text style={styles.chapterBtnText}>Prev</Text>
// //           </TouchableOpacity>

// //           <Text style={styles.chapterLabel}>
// //             {book} {chapter}
// //           </Text>

// //           <TouchableOpacity
// //             onPress={onNextChapter}
// //             disabled={chapter >= maxChapter}
// //             style={[
// //               styles.chapterBtn,
// //               chapter >= maxChapter && { opacity: 0.4 },
// //             ]}
// //           >
// //             <Text style={styles.chapterBtnText}>Next</Text>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Verses */}
// //         {loading ? (
// //           <Text style={styles.loadingText}>Loading chapter…</Text>
// //         ) : verses.length === 0 ? (
// //           <Text style={styles.loadingText}>
// //             No verses found for this chapter.
// //           </Text>
// //         ) : (
// //           <View style={styles.versesBlock}>
// //             {verses.map((v) => (
// //               <Text key={v.verse} style={styles.verseText}>
// //                 <Text style={styles.verseNumber}>{v.verse} </Text>
// //                 {v.text}
// //               </Text>
// //             ))}
// //           </View>
// //         )}

// //         <View style={{ height: 20 }} />
// //       </ScrollView>
// //     </Screen>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   content: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 20,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: '800',
// //     color: Colors.button,
// //     marginBottom: 12,
// //   },
// //   bookRow: {
// //     marginBottom: 10,
// //   },
// //   bookChip: {
// //     borderRadius: 999,
// //     paddingHorizontal: 10,
// //     paddingVertical: 6,
// //     backgroundColor: '#111827',
// //     marginRight: 6,
// //   },
// //   bookChipActive: {
// //     backgroundColor: Colors.button,
// //   },
// //   bookChipText: {
// //     color: '#e5e7eb',
// //     fontSize: 13,
// //   },
// //   bookChipTextActive: {
// //     color: '#fff',
// //     fontWeight: '700',
// //   },
// //   chapterRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     marginBottom: 10,
// //   },
// //   chapterBtn: {
// //     backgroundColor: '#111827',
// //     borderRadius: 999,
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //   },
// //   chapterBtnText: {
// //     color: '#e5e7eb',
// //     fontWeight: '700',
// //   },
// //   chapterLabel: {
// //     color: '#3126fdff',
// //     fontSize: 24,
// //     fontWeight: '700',
// //   },
// //   versesBlock: {
// //     marginTop: 8,
// //   },
// //   verseText: {
// //     color: '#194499ff',
// //     fontSize: 15,
// //     marginBottom: 4,
// //     lineHeight: 22,
// //   },
// //   verseNumber: {
// //     color: '#000000ff',
// //     fontSize: 12,
// //   },
// //   loadingText: {
// //     color: '#9ca3af',
// //     marginTop: 8,
// //   },
// // });

// // // src/screens/BibleScreen.js
// // import React, { useEffect, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TouchableOpacity,
// // } from 'react-native';

// // import Screen from '../components/Screen';
// // import { Colors } from '../constants/colors';
// // import { getDb } from '../storage/db';
// // import { seedBibleIfNeeded } from '../logic/seedBible';

// // // You can refine or move this list later
// // const BOOKS = [
// //   'Genesis',
// //   'Exodus',
// //   'Leviticus',
// //   'Numbers',
// //   'Deuteronomy',
// //   'Joshua',
// //   'Judges',
// //   'Ruth',
// //   '1 Samuel',
// //   '2 Samuel',
// //   '1 Kings',
// //   '2 Kings',
// //   '1 Chronicles',
// //   '2 Chronicles',
// //   'Ezra',
// //   'Nehemiah',
// //   'Esther',
// //   'Job',
// //   'Psalms',
// //   'Proverbs',
// //   'Ecclesiastes',
// //   'Song of Solomon',
// //   'Isaiah',
// //   'Jeremiah',
// //   'Lamentations',
// //   'Ezekiel',
// //   'Daniel',
// //   'Hosea',
// //   'Joel',
// //   'Amos',
// //   'Obadiah',
// //   'Jonah',
// //   'Micah',
// //   'Nahum',
// //   'Habakkuk',
// //   'Zephaniah',
// //   'Haggai',
// //   'Zechariah',
// //   'Malachi',
// //   'Matthew',
// //   'Mark',
// //   'Luke',
// //   'John',
// //   'Acts',
// //   'Romans',
// //   '1 Corinthians',
// //   '2 Corinthians',
// //   'Galatians',
// //   'Ephesians',
// //   'Philippians',
// //   'Colossians',
// //   '1 Thessalonians',
// //   '2 Thessalonians',
// //   '1 Timothy',
// //   '2 Timothy',
// //   'Titus',
// //   'Philemon',
// //   'Hebrews',
// //   'James',
// //   '1 Peter',
// //   '2 Peter',
// //   '1 John',
// //   '2 John',
// //   '3 John',
// //   'Jude',
// //   'Revelation',
// // ];

// // export default function BibleScreen({ route, navigation }) {
// //   const initialBook = route?.params?.book || 'John';
// //   const initialChapter = route?.params?.chapter || 1;
// //   const initialVerse = route?.params?.verse || null;

// //   const [book, setBook] = useState(initialBook);
// //   const [chapter, setChapter] = useState(initialChapter);
// //   const [verses, setVerses] = useState([]);
// //   const [maxChapter, setMaxChapter] = useState(150); // safe fallback
// //   const [loading, setLoading] = useState(true);
// //   const [highlightVerse, setHighlightVerse] = useState(initialVerse);

// //   // Load verses for current book/chapter from SQLite
// //   useEffect(() => {
// //     let mounted = true;

// //     (async () => {
// //       try {
// //         setLoading(true);

// //         // 🔹 Ensure WEB is seeded before reading
// //         await seedBibleIfNeeded();

// //         const db = await getDb();

// //         // 1) Find verses
// //         const rows = await db.getAllAsync(
// //           `
// //           SELECT verse, text
// //           FROM bible_verses
// //           WHERE translation_code = 'WEB'
// //             AND book = ?
// //             AND chapter = ?
// //           ORDER BY verse ASC;
// //         `,
// //           [book, chapter]
// //         );

// //         // 2) Compute maxChapter for this book
// //         const chapRow = await db.getFirstAsync(
// //           `
// //           SELECT MAX(chapter) AS max_chapter
// //           FROM bible_verses
// //           WHERE translation_code = 'WEB'
// //             AND book = ?;
// //         `,
// //           [book]
// //         );

// //         if (!mounted) return;
// //         setVerses(rows || []);
// //         setMaxChapter(chapRow?.max_chapter || 1);

// //         // Highlight only if we navigated with verse that matches this book/chapter
// //         if (
// //           route?.params?.verse &&
// //           book === initialBook &&
// //           chapter === initialChapter
// //         ) {
// //           setHighlightVerse(route.params.verse);
// //         } else {
// //           setHighlightVerse(null);
// //         }
// //       } catch (e) {
// //         if (mounted) {
// //           console.warn('Error loading Bible chapter:', e);
// //           setVerses([]);
// //         }
// //       } finally {
// //         if (mounted) setLoading(false);
// //       }
// //     })();

// //     return () => {
// //       mounted = false;
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [book, chapter]);

// //   const onPrevChapter = () => {
// //     if (chapter > 1) {
// //       setChapter((c) => c - 1);
// //     }
// //   };

// //   const onNextChapter = () => {
// //     if (chapter < maxChapter) {
// //       setChapter((c) => c + 1);
// //     }
// //   };

// //   const onSelectBook = (b) => {
// //     setBook(b);
// //     setChapter(1);
// //     setHighlightVerse(null);
// //   };

// //   const onSelectChapter = (ch) => {
// //     setChapter(ch);
// //     setHighlightVerse(null);
// //   };

// //   // Build a list [1..maxChapter] for chapter chips
// //   const chapterNumbers = [];
// //   for (let i = 1; i <= maxChapter; i += 1) {
// //     chapterNumbers.push(i);
// //   }

// //   return (
// //     <Screen showBack onBack={() => navigation.goBack()}>
// //       <ScrollView
// //         contentContainerStyle={styles.content}
// //         keyboardShouldPersistTaps="handled"
// //       >
// //         <Text style={styles.title}>Bible (WEB)</Text>

// //         {/* Book selector (simple horizontal chips for now) */}
// //         <View style={styles.bookRow}>
// //           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
// //             {BOOKS.map((b) => {
// //               const active = b === book;
// //               return (
// //                 <TouchableOpacity
// //                   key={b}
// //                   onPress={() => onSelectBook(b)}
// //                   style={[styles.bookChip, active && styles.bookChipActive]}
// //                 >
// //                   <Text
// //                     style={[
// //                       styles.bookChipText,
// //                       active && styles.bookChipTextActive,
// //                     ]}
// //                   >
// //                     {b}
// //                   </Text>
// //                 </TouchableOpacity>
// //               );
// //             })}
// //           </ScrollView>
// //         </View>

// //         {/* Chapter controls */}
// //         <View style={styles.chapterRow}>
// //           <TouchableOpacity
// //             onPress={onPrevChapter}
// //             disabled={chapter <= 1}
// //             style={[styles.chapterBtn, chapter <= 1 && { opacity: 0.4 }]}
// //           >
// //             <Text style={styles.chapterBtnText}>Prev</Text>
// //           </TouchableOpacity>

// //           <Text style={styles.chapterLabel}>
// //             {book} {chapter}
// //           </Text>

// //           <TouchableOpacity
// //             onPress={onNextChapter}
// //             disabled={chapter >= maxChapter}
// //             style={[
// //               styles.chapterBtn,
// //               chapter >= maxChapter && { opacity: 0.4 },
// //             ]}
// //           >
// //             <Text style={styles.chapterBtnText}>Next</Text>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Chapter chips (1..maxChapter) */}
// //         <View style={styles.chapterChipRow}>
// //           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
// //             {chapterNumbers.map((ch) => {
// //               const active = ch === chapter;
// //               return (
// //                 <TouchableOpacity
// //                   key={ch}
// //                   onPress={() => onSelectChapter(ch)}
// //                   style={[
// //                     styles.chapterChip,
// //                     active && styles.chapterChipActive,
// //                   ]}
// //                 >
// //                   <Text
// //                     style={[
// //                       styles.chapterChipText,
// //                       active && styles.chapterChipTextActive,
// //                     ]}
// //                   >
// //                     {ch}
// //                   </Text>
// //                 </TouchableOpacity>
// //               );
// //             })}
// //           </ScrollView>
// //         </View>

// //         {/* Verses */}
// //         {loading ? (
// //           <Text style={styles.loadingText}>Loading chapter…</Text>
// //         ) : verses.length === 0 ? (
// //           <Text style={styles.loadingText}>
// //             No verses found for this chapter.
// //           </Text>
// //         ) : (
// //           <View style={styles.versesBlock}>
// //             {verses.map((v) => {
// //               const isHighlighted = highlightVerse === v.verse;
// //               return (
// //                 <View
// //                   key={v.verse}
// //                   style={[
// //                     styles.verseRow,
// //                     isHighlighted && styles.verseRowHighlighted,
// //                   ]}
// //                 >
// //                   <Text style={styles.verseNumber}>{v.verse} </Text>
// //                   <Text style={styles.verseText}>{v.text}</Text>
// //                 </View>
// //               );
// //             })}
// //           </View>
// //         )}

// //         <View style={{ height: 20 }} />
// //       </ScrollView>
// //     </Screen>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   content: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 20,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: '800',
// //     color: Colors.button,
// //     marginBottom: 12,
// //   },
// //   bookRow: {
// //     marginBottom: 10,
// //   },
// //   bookChip: {
// //     borderRadius: 999,
// //     paddingHorizontal: 10,
// //     paddingVertical: 6,
// //     backgroundColor: '#111827',
// //     marginRight: 6,
// //   },
// //   bookChipActive: {
// //     backgroundColor: Colors.button,
// //   },
// //   bookChipText: {
// //     color: '#e5e7eb',
// //     fontSize: 13,
// //   },
// //   bookChipTextActive: {
// //     color: '#fff',
// //     fontWeight: '700',
// //   },
// //   chapterRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     marginBottom: 6,
// //   },
// //   chapterBtn: {
// //     backgroundColor: '#111827',
// //     borderRadius: 999,
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //   },
// //   chapterBtnText: {
// //     color: '#e5e7eb',
// //     fontWeight: '700',
// //   },
// //   chapterLabel: {
// //     color: '#3126fdff',
// //     fontSize: 24,
// //     fontWeight: '700',
// //   },

// //   chapterChipRow: {
// //     marginBottom: 10,
// //   },
// //   chapterChip: {
// //     borderRadius: 999,
// //     paddingHorizontal: 10,
// //     paddingVertical: 5,
// //     backgroundColor: '#020617',
// //     marginRight: 6,
// //     borderWidth: StyleSheet.hairlineWidth,
// //     borderColor: '#1f2937',
// //   },
// //   chapterChipActive: {
// //     backgroundColor: Colors.button,
// //     borderColor: Colors.button,
// //   },
// //   chapterChipText: {
// //     color: '#d1d5db',
// //     fontSize: 13,
// //   },
// //   chapterChipTextActive: {
// //     color: '#fff',
// //     fontWeight: '700',
// //   },

// //   versesBlock: {
// //     marginTop: 8,
// //   },
// //   verseRow: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-start',
// //     paddingVertical: 2,
// //   },
// //   verseRowHighlighted: {
// //     backgroundColor: 'rgba(248, 250, 252, 0.15)',
// //     borderRadius: 8,
// //   },
// //   verseText: {
// //     flex: 1,
// //     color: '#194499ff',
// //     fontSize: 15,
// //     marginBottom: 4,
// //     lineHeight: 22,
// //   },
// //   verseNumber: {
// //     color: '#000000ff',
// //     fontSize: 12,
// //     marginRight: 4,
// //     marginTop: 2,
// //   },
// //   loadingText: {
// //     color: '#9ca3af',
// //     marginTop: 8,
// //   },
// // });

// // src/screens/BibleScreen.js
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native';

// import Screen from '../components/Screen';
// import { Colors } from '../constants/colors';
// import { getDb } from '../storage/db';
// import { seedBibleIfNeeded } from '../logic/seedBible';
// import { getString, setString } from '../storage/mmkv';

// // You can refine or move this list later
// const BOOKS = [
//   'Genesis',
//   'Exodus',
//   'Leviticus',
//   'Numbers',
//   'Deuteronomy',
//   'Joshua',
//   'Judges',
//   'Ruth',
//   '1 Samuel',
//   '2 Samuel',
//   '1 Kings',
//   '2 Kings',
//   '1 Chronicles',
//   '2 Chronicles',
//   'Ezra',
//   'Nehemiah',
//   'Esther',
//   'Job',
//   'Psalms',
//   'Proverbs',
//   'Ecclesiastes',
//   'Song of Solomon',
//   'Isaiah',
//   'Jeremiah',
//   'Lamentations',
//   'Ezekiel',
//   'Daniel',
//   'Hosea',
//   'Joel',
//   'Amos',
//   'Obadiah',
//   'Jonah',
//   'Micah',
//   'Nahum',
//   'Habakkuk',
//   'Zephaniah',
//   'Haggai',
//   'Zechariah',
//   'Malachi',
//   'Matthew',
//   'Mark',
//   'Luke',
//   'John',
//   'Acts',
//   'Romans',
//   '1 Corinthians',
//   '2 Corinthians',
//   'Galatians',
//   'Ephesians',
//   'Philippians',
//   'Colossians',
//   '1 Thessalonians',
//   '2 Thessalonians',
//   '1 Timothy',
//   '2 Timothy',
//   'Titus',
//   'Philemon',
//   'Hebrews',
//   'James',
//   '1 Peter',
//   '2 Peter',
//   '1 John',
//   '2 John',
//   '3 John',
//   'Jude',
//   'Revelation',
// ];

// const LAST_KEY = 'bible:last'; // MMKV key for "last opened" location

// export default function BibleScreen({ route, navigation }) {
//   const initialBook = route?.params?.book || 'John';
//   const initialChapter = route?.params?.chapter || 1;
//   const initialVerse = route?.params?.verse || null;

//   const [book, setBook] = useState(initialBook);
//   const [chapter, setChapter] = useState(initialChapter);
//   const [verses, setVerses] = useState([]);
//   const [maxChapter, setMaxChapter] = useState(150); // safe fallback
//   const [loading, setLoading] = useState(true);
//   const [highlightVerse, setHighlightVerse] = useState(initialVerse);
//   const [hydrated, setHydrated] = useState(false); // wait until we decide where to start

//   // 1️⃣ On mount, decide starting location:
//   //    - If route params (book/chapter) exist, use them
//   //    - Else, use last saved in MMKV
//   //    - Else, fall back to John 1
//   useEffect(() => {
//     let didSetFromRoute = false;

//     const routeBook =
//       typeof route?.params?.book === 'string' ? route.params.book : null;
//     const routeChapter =
//       typeof route?.params?.chapter === 'number' ? route.params.chapter : null;

//     if (routeBook && routeChapter) {
//       const safeBook = BOOKS.includes(routeBook) ? routeBook : 'John';
//       const safeChapter =
//         Number.isFinite(routeChapter) && routeChapter > 0 ? routeChapter : 1;

//       setBook(safeBook);
//       setChapter(safeChapter);
//       didSetFromRoute = true;
//       setHydrated(true);
//     }

//     if (!didSetFromRoute) {
//       try {
//         const raw = getString(LAST_KEY, null);
//         if (raw) {
//           const parsed = JSON.parse(raw);
//           const fromStoreBook = BOOKS.includes(parsed.book)
//             ? parsed.book
//             : 'John';
//           const fromStoreChapter =
//             Number.isFinite(parsed.chapter) && parsed.chapter > 0
//               ? parsed.chapter
//               : 1;

//           setBook(fromStoreBook);
//           setChapter(fromStoreChapter);
//         } else {
//           // no stored data; keep initialBook/initialChapter
//           setBook(initialBook);
//           setChapter(initialChapter);
//         }
//       } catch (e) {
//         // if something goes wrong, just keep initial defaults
//         setBook(initialBook);
//         setChapter(initialChapter);
//       } finally {
//         setHydrated(true);
//       }
//     }
//   }, [
//     route?.params?.book,
//     route?.params?.chapter,
//     initialBook,
//     initialChapter,
//   ]);

//   // 2️⃣ Whenever book/chapter change *after hydration*, persist to MMKV
//   useEffect(() => {
//     if (!hydrated) return;
//     try {
//       setString(
//         LAST_KEY,
//         JSON.stringify({
//           book,
//           chapter,
//         })
//       );
//     } catch (e) {
//       // non-fatal
//     }
//   }, [book, chapter, hydrated]);

//   // 3️⃣ Load verses for current book/chapter from SQLite
//   useEffect(() => {
//     if (!hydrated) return;

//     let mounted = true;

//     (async () => {
//       try {
//         setLoading(true);

//         // 🔹 Ensure WEB is seeded before reading
//         await seedBibleIfNeeded();

//         const db = await getDb();

//         // 1) Find verses
//         const rows = await db.getAllAsync(
//           `
//           SELECT verse, text
//           FROM bible_verses
//           WHERE translation_code = 'WEB'
//             AND book = ?
//             AND chapter = ?
//           ORDER BY verse ASC;
//         `,
//           [book, chapter]
//         );

//         // 2) Compute maxChapter for this book
//         const chapRow = await db.getFirstAsync(
//           `
//           SELECT MAX(chapter) AS max_chapter
//           FROM bible_verses
//           WHERE translation_code = 'WEB'
//             AND book = ?;
//         `,
//           [book]
//         );

//         if (!mounted) return;
//         setVerses(rows || []);
//         setMaxChapter(chapRow?.max_chapter || 1);

//         // Highlight only if we navigated with verse that matches this book/chapter
//         if (
//           route?.params?.verse &&
//           book === initialBook &&
//           chapter === initialChapter
//         ) {
//           setHighlightVerse(route.params.verse);
//         } else {
//           setHighlightVerse(null);
//         }
//       } catch (e) {
//         if (mounted) {
//           console.warn('Error loading Bible chapter:', e);
//           setVerses([]);
//         }
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [book, chapter, hydrated]);

//   const onPrevChapter = () => {
//     if (chapter > 1) {
//       setChapter((c) => c - 1);
//     }
//   };

//   const onNextChapter = () => {
//     if (chapter < maxChapter) {
//       setChapter((c) => c + 1);
//     }
//   };

//   const onSelectBook = (b) => {
//     setBook(b);
//     setChapter(1);
//     setHighlightVerse(null);
//   };

//   const onSelectChapter = (ch) => {
//     setChapter(ch);
//     setHighlightVerse(null);
//   };

//   // Build a list [1..maxChapter] for chapter chips
//   const chapterNumbers = [];
//   for (let i = 1; i <= maxChapter; i += 1) {
//     chapterNumbers.push(i);
//   }

//   return (
//     <Screen showBack onBack={() => navigation.goBack()}>
//       <ScrollView
//         contentContainerStyle={styles.content}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Text style={styles.title}>Bible (WEB)</Text>

//         {/* Book selector (simple horizontal chips for now) */}
//         <View style={styles.bookRow}>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {BOOKS.map((b) => {
//               const active = b === book;
//               return (
//                 <TouchableOpacity
//                   key={b}
//                   onPress={() => onSelectBook(b)}
//                   style={[styles.bookChip, active && styles.bookChipActive]}
//                 >
//                   <Text
//                     style={[
//                       styles.bookChipText,
//                       active && styles.bookChipTextActive,
//                     ]}
//                   >
//                     {b}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </ScrollView>
//         </View>

//         {/* Chapter controls */}
//         <View style={styles.chapterRow}>
//           <TouchableOpacity
//             onPress={onPrevChapter}
//             disabled={chapter <= 1}
//             style={[styles.chapterBtn, chapter <= 1 && { opacity: 0.4 }]}
//           >
//             <Text style={styles.chapterBtnText}>Prev</Text>
//           </TouchableOpacity>

//           <Text style={styles.chapterLabel}>
//             {book} {chapter}
//           </Text>

//           <TouchableOpacity
//             onPress={onNextChapter}
//             disabled={chapter >= maxChapter}
//             style={[
//               styles.chapterBtn,
//               chapter >= maxChapter && { opacity: 0.4 },
//             ]}
//           >
//             <Text style={styles.chapterBtnText}>Next</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Chapter chips (1..maxChapter) */}
//         <View style={styles.chapterChipRow}>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {chapterNumbers.map((ch) => {
//               const active = ch === chapter;
//               return (
//                 <TouchableOpacity
//                   key={ch}
//                   onPress={() => onSelectChapter(ch)}
//                   style={[
//                     styles.chapterChip,
//                     active && styles.chapterChipActive,
//                   ]}
//                 >
//                   <Text
//                     style={[
//                       styles.chapterChipText,
//                       active && styles.chapterChipTextActive,
//                     ]}
//                   >
//                     {ch}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </ScrollView>
//         </View>

//         {/* Verses */}
//         {loading ? (
//           <Text style={styles.loadingText}>Loading chapter…</Text>
//         ) : verses.length === 0 ? (
//           <Text style={styles.loadingText}>
//             No verses found for this chapter.
//           </Text>
//         ) : (
//           <View style={styles.versesBlock}>
//             {verses.map((v) => {
//               const isHighlighted = highlightVerse === v.verse;
//               return (
//                 <View
//                   key={v.verse}
//                   style={[
//                     styles.verseRow,
//                     isHighlighted && styles.verseRowHighlighted,
//                   ]}
//                 >
//                   <Text style={styles.verseNumber}>{v.verse} </Text>
//                   <Text style={styles.verseText}>{v.text}</Text>
//                 </View>
//               );
//             })}
//           </View>
//         )}

//         <View style={{ height: 20 }} />
//       </ScrollView>
//     </Screen>
//   );
// }

// const styles = StyleSheet.create({
//   content: {
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '800',
//     color: Colors.button,
//     marginBottom: 12,
//   },
//   bookRow: {
//     marginBottom: 10,
//   },
//   bookChip: {
//     borderRadius: 999,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     backgroundColor: '#111827',
//     marginRight: 6,
//   },
//   bookChipActive: {
//     backgroundColor: Colors.button,
//   },
//   bookChipText: {
//     color: '#e5e7eb',
//     fontSize: 13,
//   },
//   bookChipTextActive: {
//     color: '#fff',
//     fontWeight: '700',
//   },
//   chapterRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 6,
//   },
//   chapterBtn: {
//     backgroundColor: '#111827',
//     borderRadius: 999,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//   },
//   chapterBtnText: {
//     color: '#e5e7eb',
//     fontWeight: '700',
//   },
//   chapterLabel: {
//     color: '#3126fdff',
//     fontSize: 24,
//     fontWeight: '700',
//   },

//   chapterChipRow: {
//     marginBottom: 10,
//   },
//   chapterChip: {
//     borderRadius: 999,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     backgroundColor: '#020617',
//     marginRight: 6,
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: '#1f2937',
//   },
//   chapterChipActive: {
//     backgroundColor: Colors.button,
//     borderColor: Colors.button,
//   },
//   chapterChipText: {
//     color: '#d1d5db',
//     fontSize: 13,
//   },
//   chapterChipTextActive: {
//     color: '#fff',
//     fontWeight: '700',
//   },

//   versesBlock: {
//     marginTop: 8,
//   },
//   verseRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     paddingVertical: 2,
//   },
//   verseRowHighlighted: {
//     backgroundColor: 'rgba(248, 250, 252, 0.15)',
//     borderRadius: 8,
//   },
//   verseText: {
//     flex: 1,
//     color: '#194499ff',
//     fontSize: 15,
//     marginBottom: 4,
//     lineHeight: 22,
//   },
//   verseNumber: {
//     color: '#000000ff',
//     fontSize: 12,
//     marginRight: 4,
//     marginTop: 2,
//   },
//   loadingText: {
//     color: '#9ca3af',
//     marginTop: 8,
//   },
// });

// src/screens/BibleScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Screen from '../components/Screen';
import { Colors } from '../constants/colors';
import { getDb } from '../storage/db';
import { seedBibleIfNeeded } from '../logic/seedBible';
import { getString, setString } from '../storage/mmkv';

const BOOKS = [
  'Genesis',
  'Exodus',
  'Leviticus',
  'Numbers',
  'Deuteronomy',
  'Joshua',
  'Judges',
  'Ruth',
  '1 Samuel',
  '2 Samuel',
  '1 Kings',
  '2 Kings',
  '1 Chronicles',
  '2 Chronicles',
  'Ezra',
  'Nehemiah',
  'Esther',
  'Job',
  'Psalms',
  'Proverbs',
  'Ecclesiastes',
  'Song of Solomon',
  'Isaiah',
  'Jeremiah',
  'Lamentations',
  'Ezekiel',
  'Daniel',
  'Hosea',
  'Joel',
  'Amos',
  'Obadiah',
  'Jonah',
  'Micah',
  'Nahum',
  'Habakkuk',
  'Zephaniah',
  'Haggai',
  'Zechariah',
  'Malachi',
  'Matthew',
  'Mark',
  'Luke',
  'John',
  'Acts',
  'Romans',
  '1 Corinthians',
  '2 Corinthians',
  'Galatians',
  'Ephesians',
  'Philippians',
  'Colossians',
  '1 Thessalonians',
  '2 Thessalonians',
  '1 Timothy',
  '2 Timothy',
  'Titus',
  'Philemon',
  'Hebrews',
  'James',
  '1 Peter',
  '2 Peter',
  '1 John',
  '2 John',
  '3 John',
  'Jude',
  'Revelation',
];

const LAST_LOCATION_KEY = 'bible:last-location';

export default function BibleScreen({ route, navigation }) {
  // Fallback defaults
  const [book, setBook] = useState('John');
  const [chapter, setChapter] = useState(1);
  const [verses, setVerses] = useState([]);
  const [maxChapter, setMaxChapter] = useState(150); // safe fallback
  const [loading, setLoading] = useState(true);
  const [highlightVerse, setHighlightVerse] = useState(null);

  // Helper: persist current location
  const persistLocation = (b, ch, v = null) => {
    try {
      const payload = { book: b, chapter: ch, verse: v };
      setString(LAST_LOCATION_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  };

  // On mount / param change: decide where to go
  useEffect(() => {
    const paramBook = route?.params?.book;
    const paramChapter = route?.params?.chapter;
    const paramVerse = route?.params?.verse;

    if (paramBook) {
      const b = paramBook;
      const ch = paramChapter || 1;
      const v = paramVerse ?? null;

      setBook(b);
      setChapter(ch);
      setHighlightVerse(v);
      persistLocation(b, ch, v);
      return;
    }

    // No params → load last location from MMKV
    try {
      const raw = getString(LAST_LOCATION_KEY, null);
      if (raw) {
        const saved = JSON.parse(raw);
        const b = saved.book || 'John';
        const ch = saved.chapter || 1;
        const v = saved.verse ?? null;
        setBook(b);
        setChapter(ch);
        setHighlightVerse(v);
      }
    } catch {
      // fall back to defaults
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.book, route?.params?.chapter, route?.params?.verse]);

  // Load verses for current book/chapter from SQLite
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        await seedBibleIfNeeded();
        const db = await getDb();

        const rows = await db.getAllAsync(
          `
          SELECT verse, text
          FROM bible_verses
          WHERE translation_code = 'WEB'
            AND book = ?
            AND chapter = ?
          ORDER BY verse ASC;
        `,
          [book, chapter]
        );

        const chapRow = await db.getFirstAsync(
          `
          SELECT MAX(chapter) AS max_chapter
          FROM bible_verses
          WHERE translation_code = 'WEB'
            AND book = ?;
        `,
          [book]
        );

        if (!mounted) return;
        setVerses(rows || []);
        setMaxChapter(chapRow?.max_chapter || 1);
      } catch (e) {
        if (mounted) {
          console.warn('Error loading Bible chapter:', e);
          setVerses([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [book, chapter]);

  const onPrevChapter = () => {
    if (chapter > 1) {
      setChapter((c) => {
        const next = c - 1;
        persistLocation(book, next, null);
        setHighlightVerse(null);
        return next;
      });
    }
  };

  const onNextChapter = () => {
    if (chapter < maxChapter) {
      setChapter((c) => {
        const next = c + 1;
        persistLocation(book, next, null);
        setHighlightVerse(null);
        return next;
      });
    }
  };

  const onSelectBook = (b) => {
    setBook(b);
    setChapter(1);
    setHighlightVerse(null);
    persistLocation(b, 1, null);
  };

  const onSelectChapter = (ch) => {
    setChapter(ch);
    setHighlightVerse(null);
    persistLocation(book, ch, null);
  };

  // Build a list [1..maxChapter] for chapter chips
  const chapterNumbers = [];
  for (let i = 1; i <= maxChapter; i += 1) {
    chapterNumbers.push(i);
  }

  return (
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Bible (WEB)</Text>

        {/* Book selector */}
        <View style={styles.bookRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {BOOKS.map((b) => {
              const active = b === book;
              return (
                <TouchableOpacity
                  key={b}
                  onPress={() => onSelectBook(b)}
                  style={[styles.bookChip, active && styles.bookChipActive]}
                >
                  <Text
                    style={[
                      styles.bookChipText,
                      active && styles.bookChipTextActive,
                    ]}
                  >
                    {b}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Chapter controls */}
        <View style={styles.chapterRow}>
          <TouchableOpacity
            onPress={onPrevChapter}
            disabled={chapter <= 1}
            style={[styles.chapterBtn, chapter <= 1 && { opacity: 0.4 }]}
          >
            <Text style={styles.chapterBtnText}>Prev</Text>
          </TouchableOpacity>

          <Text style={styles.chapterLabel}>
            {book} {chapter}
          </Text>

          <TouchableOpacity
            onPress={onNextChapter}
            disabled={chapter >= maxChapter}
            style={[
              styles.chapterBtn,
              chapter >= maxChapter && { opacity: 0.4 },
            ]}
          >
            <Text style={styles.chapterBtnText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Chapter chips (1..maxChapter) */}
        <View style={styles.chapterChipRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {chapterNumbers.map((ch) => {
              const active = ch === chapter;
              return (
                <TouchableOpacity
                  key={ch}
                  onPress={() => onSelectChapter(ch)}
                  style={[
                    styles.chapterChip,
                    active && styles.chapterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chapterChipText,
                      active && styles.chapterChipTextActive,
                    ]}
                  >
                    {ch}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Verses */}
        {loading ? (
          <Text style={styles.loadingText}>Loading chapter…</Text>
        ) : verses.length === 0 ? (
          <Text style={styles.loadingText}>
            No verses found for this chapter.
          </Text>
        ) : (
          <View style={styles.versesBlock}>
            {verses.map((v) => {
              const isHighlighted = highlightVerse === v.verse;
              return (
                <View
                  key={v.verse}
                  style={[
                    styles.verseRow,
                    isHighlighted && styles.verseRowHighlighted,
                  ]}
                >
                  <Text style={styles.verseNumber}>{v.verse} </Text>
                  <Text style={styles.verseText}>{v.text}</Text>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.button,
    marginBottom: 12,
  },
  bookRow: {
    marginBottom: 10,
  },
  bookChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#111827',
    marginRight: 6,
  },
  bookChipActive: {
    backgroundColor: Colors.button,
  },
  bookChipText: {
    color: '#e5e7eb',
    fontSize: 13,
  },
  bookChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  chapterBtn: {
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chapterBtnText: {
    color: '#e5e7eb',
    fontWeight: '700',
  },
  chapterLabel: {
    color: '#3126fdff',
    fontSize: 24,
    fontWeight: '700',
  },
  chapterChipRow: {
    marginBottom: 10,
  },
  chapterChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#020617',
    marginRight: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#1f2937',
  },
  chapterChipActive: {
    backgroundColor: Colors.button,
    borderColor: Colors.button,
  },
  chapterChipText: {
    color: '#d1d5db',
    fontSize: 13,
  },
  chapterChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  versesBlock: {
    marginTop: 8,
  },
  verseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 2,
  },
  verseRowHighlighted: {
    backgroundColor: 'rgba(248, 250, 252, 0.15)',
    borderRadius: 8,
  },
  verseText: {
    flex: 1,
    color: '#194499ff',
    fontSize: 15,
    marginBottom: 4,
    lineHeight: 22,
  },
  verseNumber: {
    color: '#000000ff',
    fontSize: 12,
    marginRight: 4,
    marginTop: 2,
  },
  loadingText: {
    color: '#9ca3af',
    marginTop: 8,
  },
});
