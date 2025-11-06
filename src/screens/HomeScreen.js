// // import React from 'react';
// // import { useEffect, useState } from 'react';
// // import { View, Text, StyleSheet, ScrollView } from 'react-native';
// // import Screen from '../components/Screen'; // default
// // import VerseCard from '../components/VerseCard'; // default
// // import { Colors } from '../constants/colors'; // named
// // import PulseTile from '../components/PulseTile'; // default
// // import TileButton from '../components/TileButton'; // default
// // import { supabase } from '../supabase';

// // export default function HomeScreen({ navigation }) {
// //   const [verse, setVerse] = useState({ ref: '', text: '', loading: true });

// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const {
// //           data: { user },
// //         } = await supabase.auth.getUser();
// //         if (!user) {
// //           setVerse((v) => ({ ...v, loading: false }));
// //           return;
// //         }
// //         const { data, error } = await supabase
// //           .from('profiles')
// //           .select('verse_ref, verse_text')
// //           .eq('id', user.id)
// //           .single();
// //         if (!error && data) {
// //           setVerse({
// //             ref: data.verse_ref || '',
// //             text: data.verse_text || '',
// //             loading: false,
// //           });
// //         } else {
// //           setVerse((v) => ({ ...v, loading: false }));
// //         }
// //       } catch {
// //         setVerse((v) => ({ ...v, loading: false }));
// //       }
// //     })();
// //   }, []);

// //   const tiles = [
// //     { label: 'Prayer List', emoji: '🙏', screen: 'PrayerList' },
// //     { label: 'Profile', emoji: '👤', screen: 'Profile' },
// //     { label: 'Today’s Quest', emoji: '🎯', screen: 'Quest' },
// //     { label: 'Progress', emoji: '📈', screen: 'Progress' },
// //     { label: 'Make Friends', emoji: '🤝', screen: 'MakeFriends' },
// //     { label: 'Friends List', emoji: '📋', screen: 'FriendsList' },
// //     { label: 'Resources', emoji: '🧰', screen: 'Resources' },
// //     { label: 'Donations', emoji: '❤️', screen: 'Donations' },
// //   ];

// //   const unreadEncouragements = false; // wire to real state later

// //   return (
// //     <ScrollView>
// //       <Screen>
// //         <View style={styles.header}>
// //           <Text style={styles.appTitle}>The Narrow Way</Text>
// //         </View>

// //         <View style={styles.body}>
// //           <Text style={styles.greeting}>Good morning</Text>
// //           <Text style={styles.sub}>Growing in obedience to Christ!</Text>

// //           {/* <VerseCard>Your Verse…</VerseCard> */}
// //           <VerseCard>
// //             {verse.loading
// //               ? 'Loading your verse...'
// //               : verse.text
// //               ? `${verse.ref ? verse.ref + ' - ' : ''}${verse.text}`
// //               : 'Set your favorite verse in profile.'}
// //           </VerseCard>

// //           <View style={{ height: 12 }} />
// //           <PulseTile
// //             label="Encouraging Messages"
// //             pulsing={unreadEncouragements}
// //             onPress={() => navigation.navigate('Encouragement')}
// //           />

// //           <View style={{ height: 18 }} />

// //           <View style={styles.grid}>
// //             {tiles.map((t) => (
// //               <View key={t.label} style={styles.gridItem}>
// //                 <TileButton
// //                   label={t.label}
// //                   emoji={t.emoji}
// //                   onPress={() => navigation.navigate(t.screen)}
// //                 />
// //               </View>
// //             ))}
// //           </View>
// //         </View>
// //       </Screen>
// //     </ScrollView>
// //   );
// // }

// // src/screens/HomeScreen.js
// import React, { useCallback, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import { useFocusEffect, useRoute } from '@react-navigation/native';

// import Screen from '../components/Screen';
// import VerseCard from '../components/VerseCard';
// import PulseTile from '../components/PulseTile';
// import TileButton from '../components/TileButton';
// import { Colors } from '../constants/colors';
// import { supabase } from '../supabase';

// export default function HomeScreen({ navigation }) {
//   const route = useRoute();

//   const [verse, setVerse] = useState({ ref: '', text: '', loading: true });

//   const loadVerse = useCallback(async () => {
//     setVerse((v) => ({ ...v, loading: true }));
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) {
//         setVerse({ ref: '', text: '', loading: false });
//         return;
//       }

//       const { data, error } = await supabase
//         .from('profiles')
//         .select('verse_ref, verse_text')
//         .eq('id', user.id)
//         .single();

//       if (error) throw error;

//       // normalize null/undefined → ''
//       const ref = (data?.verse_ref || '').trim();
//       const text = (data?.verse_text || '').trim();

//       setVerse({ ref, text, loading: false });
//     } catch {
//       setVerse({ ref: '', text: '', loading: false });
//     }
//   }, []);

//   // Refetch every time Home gains focus
//   useFocusEffect(
//     useCallback(() => {
//       let mounted = true;
//       (async () => {
//         if (mounted) await loadVerse();
//       })();
//       return () => {
//         mounted = false;
//       };
//     }, [loadVerse])
//   );

//   // Also refetch if Profile navigates back with { refreshAt }
//   useFocusEffect(
//     useCallback(() => {
//       if (route.params?.refreshAt) {
//         loadVerse();
//       }
//     }, [route.params?.refreshAt, loadVerse])
//   );

//   const tiles = [
//     { label: 'Prayer List', emoji: '🙏', screen: 'PrayerList' },
//     { label: 'Profile', emoji: '👤', screen: 'Profile' },
//     { label: 'Today’s Quest', emoji: '🎯', screen: 'Quest' },
//     { label: 'Progress', emoji: '📈', screen: 'Progress' },
//     { label: 'Make Friends', emoji: '🤝', screen: 'MakeFriends' },
//     { label: 'Friends List', emoji: '📋', screen: 'FriendsList' },
//     { label: 'Resources', emoji: '🧰', screen: 'Resources' },
//     { label: 'Donations', emoji: '❤️', screen: 'Donations' },
//   ];

//   const unreadEncouragements = false; // wire real state later

//   return (
//     <ScrollView>
//       <Screen>
//         <View style={styles.header}>
//           <Text style={styles.appTitle}>The Narrow Way</Text>
//         </View>

//         <View style={styles.body}>
//           <Text style={styles.greeting}>Good morning</Text>
//           <Text style={styles.sub}>Growing in obedience to Christ!</Text>

//           <VerseCard>
//             {verse.loading
//               ? 'Loading your verse...'
//               : verse.text
//               ? `${verse.ref ? verse.ref + ' - ' : ''}${verse.text}`
//               : 'Set your favorite verse in profile.'}
//           </VerseCard>

//           <View style={{ height: 12 }} />
//           <PulseTile
//             label="Encouraging Messages"
//             pulsing={unreadEncouragements}
//             onPress={() => navigation.navigate('Encouragement')}
//           />

//           <View style={{ height: 18 }} />

//           <View style={styles.grid}>
//             {tiles.map((t) => (
//               <View key={t.label} style={styles.gridItem}>
//                 <TileButton
//                   label={t.label}
//                   emoji={t.emoji}
//                   onPress={() => navigation.navigate(t.screen)}
//                 />
//               </View>
//             ))}
//           </View>
//         </View>
//       </Screen>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   header: { paddingTop: 0, paddingHorizontal: 16 },
//   appTitle: { fontSize: 22, fontWeight: '800', color: '#000' },

//   body: { paddingHorizontal: 16, paddingTop: 6 },
//   greeting: { fontSize: 32, fontWeight: '800', color: '#edf2fb' },
//   sub: {
//     color: Colors.text,
//     marginBottom: 12,
//     fontSize: 20,
//     fontWeight: '600',
//   },

//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   gridItem: {
//     width: '48%',
//     paddingBottom: 12,
//     // paddingHorizontal: 8,
//   },
// });

// src/screens/HomeScreen.js
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';

import Screen from '../components/Screen'; // default
import VerseCard from '../components/VerseCard'; // default
import PulseTile from '../components/PulseTile'; // default
import TileButton from '../components/TileButton'; // default
import { Colors } from '../constants/colors'; // named
import { supabase } from '../supabase';

export default function HomeScreen({ navigation }) {
  const route = useRoute();

  // Keep current value; no loading flag to avoid flicker
  const [verse, setVerse] = useState({ ref: '', text: '' });

  const loadVerse = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return; // keep whatever we already show

      const { data, error } = await supabase
        .from('profiles')
        .select('verse_ref, verse_text')
        .eq('id', user.id)
        .single();

      if (error) return;

      const ref = (data?.verse_ref || '').trim();
      const text = (data?.verse_text || '').trim();

      // Only update if different to prevent visual bounce
      setVerse((prev) =>
        prev.ref !== ref || prev.text !== text ? { ref, text } : prev
      );
    } catch {
      // swallow; keep previous value
    }
  }, []);

  // On focus:
  // 1) If Profile passed fresh values, apply them immediately (optimistic)
  // 2) Then revalidate quietly from Supabase
  useFocusEffect(
    useCallback(() => {
      // Accept verse updates from Profile (both can be undefined; guard safely)
      const incomingRef =
        typeof route.params?.verseRef === 'string'
          ? route.params.verseRef.trim()
          : undefined;
      const incomingText =
        typeof route.params?.verseText === 'string'
          ? route.params.verseText.trim()
          : undefined;

      if (incomingRef !== undefined || incomingText !== undefined) {
        setVerse((prev) => ({
          ref: incomingRef !== undefined ? incomingRef : prev.ref,
          text: incomingText !== undefined ? incomingText : prev.text,
        }));
      }

      // Also handle a { refreshAt } nudge if you use it
      // (no-op here; we revalidate regardless)
      loadVerse();
    }, [
      route.params?.verseRef,
      route.params?.verseText,
      route.params?.refreshAt,
      loadVerse,
    ])
  );

  const tiles = [
    { label: 'Prayer List', emoji: '🙏', screen: 'PrayerList' },
    { label: 'Profile', emoji: '👤', screen: 'Profile' },
    { label: 'Today’s Quest', emoji: '🎯', screen: 'Quest' },
    { label: 'Progress', emoji: '📈', screen: 'Progress' },
    { label: 'Make Friends', emoji: '🤝', screen: 'MakeFriends' },
    { label: 'Friends List', emoji: '📋', screen: 'FriendsList' },
    { label: 'Resources', emoji: '🧰', screen: 'Resources' },
    { label: 'Donations', emoji: '❤️', screen: 'Donations' },
  ];

  const unreadEncouragements = false; // wire real state later

  return (
    <ScrollView>
      <Screen>
        <View style={styles.header}>
          <Text style={styles.appTitle}>The Narrow Way</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.sub}>Growing in obedience to Christ!</Text>

          <VerseCard>
            {verse.text
              ? `${verse.ref ? verse.ref + ' - ' : ''}${verse.text}`
              : 'Set your favorite verse in profile.'}
          </VerseCard>

          <View style={{ height: 12 }} />
          <PulseTile
            label="Encouraging Messages"
            pulsing={unreadEncouragements}
            onPress={() => navigation.navigate('Encouragement')}
          />

          <View style={{ height: 18 }} />

          <View style={styles.grid}>
            {tiles.map((t) => (
              <View key={t.label} style={styles.gridItem}>
                <TileButton
                  label={t.label}
                  emoji={t.emoji}
                  onPress={() => navigation.navigate(t.screen)}
                />
              </View>
            ))}
          </View>
        </View>
      </Screen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 0, paddingHorizontal: 16 },
  appTitle: { fontSize: 22, fontWeight: '800', color: '#000' },

  body: { paddingHorizontal: 16, paddingTop: 6 },
  greeting: { fontSize: 32, fontWeight: '800', color: '#edf2fb' },
  sub: {
    color: Colors.text,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '600',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    paddingBottom: 12,
    // paddingHorizontal: 8,
  },
});
