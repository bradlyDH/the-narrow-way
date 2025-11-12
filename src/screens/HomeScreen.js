// // src/screens/HomeScreen.js
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import { useFocusEffect, useRoute } from '@react-navigation/native';

// import Screen from '../components/Screen';
// import VerseCard from '../components/VerseCard';
// import PulseTile from '../components/PulseTile';
// import TileButton from '../components/TileButton';
// import { Colors } from '../constants/colors';
// import { supabase } from '../supabase';

// function getGreeting() {
//   const hour = new Date().getHours();
//   if (hour < 12) return 'Good morning';
//   if (hour < 18) return 'Good afternoon';
//   return 'Good evening';
// }

// export default function HomeScreen({ navigation }) {
//   const route = useRoute();

//   // existing state
//   const [verse, setVerse] = useState({ ref: '', text: '' });
//   const [displayName, setDisplayName] = useState('');

//   // inbox state
//   const [unreadCount, setUnreadCount] = useState(0);

//   // NEW: cache uid for realtime filters
//   const userIdRef = useRef(null);

//   const loadVerse = useCallback(async () => {
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return;

//       userIdRef.current = user.id; // keep it around

//       const { data, error } = await supabase
//         .from('profiles')
//         .select('verse_ref, verse_text')
//         .eq('id', user.id)
//         .single();

//       if (error) return;

//       const ref = (data?.verse_ref || '').trim();
//       const text = (data?.verse_text || '').trim();
//       setVerse((prev) =>
//         prev.ref !== ref || prev.text !== text ? { ref, text } : prev
//       );
//     } catch {}
//   }, []);

//   const loadProfile = useCallback(async () => {
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) {
//         setDisplayName('');
//         return;
//       }

//       userIdRef.current = user.id; // keep it around

//       const { data, error } = await supabase
//         .from('profiles')
//         .select('display_name')
//         .eq('id', user.id)
//         .single();

//       if (error) throw error;
//       setDisplayName((data?.display_name || '').trim());
//     } catch {
//       setDisplayName('');
//     }
//   }, []);

//   // unread count
//   const loadUnreadCount = useCallback(async () => {
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) {
//         setUnreadCount(0);
//         return;
//       }
//       userIdRef.current = user.id;

//       const { count } = await supabase
//         .from('encouragements')
//         .select('id', { count: 'exact', head: true })
//         .eq('recipient_id', user.id)
//         .is('read_at', null);

//       setUnreadCount(count || 0);
//     } catch {
//       setUnreadCount(0);
//     }
//   }, []);

//   // NEW: realtime for unread + own profile changes
//   useEffect(() => {
//     let encChannel,
//       meChannel,
//       mounted = true;

//     (async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return;
//       userIdRef.current = user.id;

//       // Encourage realtime: any INSERT/UPDATE/DELETE for rows addressed to me
//       encChannel = supabase
//         .channel(`encouragements-live-${user.id}`)
//         .on(
//           'postgres_changes',
//           {
//             event: '*',
//             schema: 'public',
//             table: 'encouragements',
//             filter: `recipient_id=eq.${user.id}`,
//           },
//           () => {
//             if (mounted) loadUnreadCount();
//           }
//         )
//         .subscribe();

//       // My profile realtime: display_name / verse changes
//       meChannel = supabase
//         .channel(`profile-live-${user.id}`)
//         .on(
//           'postgres_changes',
//           {
//             event: '*',
//             schema: 'public',
//             table: 'profiles',
//             filter: `id=eq.${user.id}`,
//           },
//           () => {
//             if (!mounted) return;
//             // refresh both name and verse (user may edit either)
//             loadProfile();
//             loadVerse();
//           }
//         )
//         .subscribe();
//     })();

//     return () => {
//       mounted = false;
//       if (encChannel) supabase.removeChannel(encChannel);
//       if (meChannel) supabase.removeChannel(meChannel);
//     };
//   }, [loadUnreadCount, loadProfile, loadVerse]);

//   // on focus re-validate everything
//   useFocusEffect(
//     useCallback(() => {
//       const incomingRef =
//         typeof route.params?.verseRef === 'string'
//           ? route.params.verseRef.trim()
//           : undefined;
//       const incomingText =
//         typeof route.params?.verseText === 'string'
//           ? route.params.verseText.trim()
//           : undefined;

//       if (incomingRef !== undefined || incomingText !== undefined) {
//         setVerse((prev) => ({
//           ref: incomingRef !== undefined ? incomingRef : prev.ref,
//           text: incomingText !== undefined ? incomingText : prev.text,
//         }));
//       }

//       loadVerse();
//       loadProfile();
//       loadUnreadCount();

//       if (route.params) {
//         navigation.setParams({
//           verseRef: undefined,
//           verseText: undefined,
//           refreshAt: undefined,
//         });
//       }
//     }, [
//       route.params?.verseRef,
//       route.params?.verseText,
//       route.params?.refreshAt,
//       loadVerse,
//       loadProfile,
//       loadUnreadCount,
//       navigation,
//     ])
//   );

//   const tiles = [
//     { label: 'Profile', emoji: '👤', screen: 'Profile' },
//     { label: 'Make Friends', emoji: '🤝', screen: 'MakeFriends' },
//     { label: 'Resources', emoji: '🧰', screen: 'Resources' },
//     { label: 'Donations', emoji: '❤️', screen: 'Donations' },
//   ];

//   const pulsing = unreadCount > 0;

//   // Tap behavior: go to inbox when there's unread, else composer.
//   const onPressEncouragements = () => {
//     if (unreadCount > 0) {
//       setUnreadCount(0); // optimistic clear
//       navigation.navigate('ReceivedEncouragements', { markRead: true }); // keep your flag
//     } else {
//       navigation.navigate('Encouragement');
//     }
//   };

//   return (
//     <Screen>
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         <View style={styles.body}>
//           <Text style={styles.greeting}>
//             {getGreeting()}
//             {displayName ? `, ${displayName}` : ''}
//           </Text>
//           <Text style={styles.sub}>Growing in obedience to Christ!</Text>

//           <VerseCard>
//             {verse.text
//               ? `${verse.ref ? verse.ref + ' : ' : ''}"${verse.text}"`
//               : 'Set your favorite verse in profile.'}
//           </VerseCard>

//           <View style={{ height: 10 }} />

//           <PulseTile
//             label="Encouraging Messages"
//             pulsing={pulsing}
//             count={unreadCount}
//             onPress={onPressEncouragements}
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
//       </ScrollView>
//     </Screen>
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
//   },
//   scrollContent: {
//     flexGrow: 1, // lets Screen's background fill under short pages
//     paddingHorizontal: 16,
//     paddingTop: 6,
//     paddingBottom: 24,
//   },
// });

// // src/screens/HomeScreen.js
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import { useFocusEffect, useRoute } from '@react-navigation/native';

// import Screen from '../components/Screen';
// import VerseCard from '../components/VerseCard';
// import PulseTile from '../components/PulseTile';
// import TileButton from '../components/TileButton';
// import { Colors } from '../constants/colors';
// import { supabase } from '../supabase';

// function getGreeting() {
//   const hour = new Date().getHours();
//   if (hour < 12) return 'Good morning';
//   if (hour < 18) return 'Good afternoon';
//   return 'Good evening';
// }

// export default function HomeScreen({ navigation }) {
//   const route = useRoute();

//   // existing state
//   const [verse, setVerse] = useState({ ref: '', text: '' });
//   const [displayName, setDisplayName] = useState('');

//   // inbox state
//   const [unreadCount, setUnreadCount] = useState(0);

//   const userIdRef = useRef(null);
//   const rtChannelRef = useRef(null);

//   const loadVerse = useCallback(async () => {
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return;

//       const { data, error } = await supabase
//         .from('profiles')
//         .select('verse_ref, verse_text')
//         .eq('id', user.id)
//         .single();

//       if (error) return;

//       const ref = (data?.verse_ref || '').trim();
//       const text = (data?.verse_text || '').trim();
//       setVerse((prev) =>
//         prev.ref !== ref || prev.text !== text ? { ref, text } : prev
//       );
//     } catch {}
//   }, []);

//   const loadProfile = useCallback(async () => {
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) {
//         setDisplayName('');
//         return;
//       }
//       userIdRef.current = user.id;

//       const { data, error } = await supabase
//         .from('profiles')
//         .select('display_name')
//         .eq('id', user.id)
//         .single();

//       if (error) throw error;
//       setDisplayName((data?.display_name || '').trim());
//     } catch {
//       setDisplayName('');
//     }
//   }, []);

//   // unread count
//   const loadUnreadCount = useCallback(async () => {
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) {
//         setUnreadCount(0);
//         return;
//       }
//       userIdRef.current = user.id;

//       const { count, error } = await supabase
//         .from('encouragements')
//         .select('id', { count: 'exact', head: true })
//         .eq('recipient_id', user.id)
//         .is('read_at', null);

//       if (error) throw error;
//       setUnreadCount(count || 0);
//     } catch {
//       setUnreadCount(0);
//     }
//   }, []);

//   // Realtime: keep unread badge in sync (restore the “live” notification)
//   useEffect(() => {
//     let isMounted = true;

//     (async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user || !isMounted) return;

//       userIdRef.current = user.id;

//       // Clean any prior channel (hot reload safety)
//       if (rtChannelRef.current) {
//         supabase.removeChannel(rtChannelRef.current);
//         rtChannelRef.current = null;
//       }

//       const ch = supabase
//         .channel('encouragements-home')
//         // New message to me -> increment (or just reload to be safe)
//         .on(
//           'postgres_changes',
//           {
//             event: 'INSERT',
//             schema: 'public',
//             table: 'encouragements',
//             filter: `recipient_id=eq.${user.id}`,
//           },
//           () => {
//             // simple +1 is okay, but reload is safest if multiple devices act
//             loadUnreadCount();
//           }
//         )
//         // Any updates (e.g., messages marked read elsewhere) -> recompute
//         .on(
//           'postgres_changes',
//           {
//             event: 'UPDATE',
//             schema: 'public',
//             table: 'encouragements',
//             filter: `recipient_id=eq.${user.id}`,
//           },
//           () => {
//             loadUnreadCount();
//           }
//         )
//         // Defensive: if rows are deleted, recompute
//         .on(
//           'postgres_changes',
//           {
//             event: 'DELETE',
//             schema: 'public',
//             table: 'encouragements',
//             filter: `recipient_id=eq.${user.id}`,
//           },
//           () => {
//             loadUnreadCount();
//           }
//         )
//         .subscribe();

//       rtChannelRef.current = ch;
//     })();

//     return () => {
//       isMounted = false;
//       if (rtChannelRef.current) {
//         supabase.removeChannel(rtChannelRef.current);
//         rtChannelRef.current = null;
//       }
//     };
//   }, [loadUnreadCount]);

//   // on focus re-validate everything
//   useFocusEffect(
//     useCallback(() => {
//       const incomingRef =
//         typeof route.params?.verseRef === 'string'
//           ? route.params.verseRef.trim()
//           : undefined;
//       const incomingText =
//         typeof route.params?.verseText === 'string'
//           ? route.params.verseText.trim()
//           : undefined;

//       if (incomingRef !== undefined || incomingText !== undefined) {
//         setVerse((prev) => ({
//           ref: incomingRef !== undefined ? incomingRef : prev.ref,
//           text: incomingText !== undefined ? incomingText : prev.text,
//         }));
//       }

//       loadVerse();
//       loadProfile();
//       loadUnreadCount();

//       if (route.params) {
//         navigation.setParams({
//           verseRef: undefined,
//           verseText: undefined,
//           refreshAt: undefined,
//         });
//       }
//     }, [
//       route.params?.verseRef,
//       route.params?.verseText,
//       route.params?.refreshAt,
//       loadVerse,
//       loadProfile,
//       loadUnreadCount,
//       navigation,
//     ])
//   );

//   const tiles = [
//     // { label: 'Prayers List', emoji: '🙏', screen: 'PrayerList' },
//     { label: 'Profile', emoji: '👤', screen: 'Profile' },
//     // { label: 'Today’s Quest', emoji: '🎯', screen: 'Quest' },
//     // { label: 'Progress', emoji: '📈', screen: 'Progress' },
//     { label: 'Make Friends', emoji: '🤝', screen: 'MakeFriends' },
//     // { label: 'Friends List', emoji: '📋', screen: 'Friends' }, // tab name
//     { label: 'Resources', emoji: '🧰', screen: 'Resources' },
//     { label: 'Donations', emoji: '❤️', screen: 'Donations' },
//   ];

//   const pulsing = unreadCount > 0;

//   // Tap behavior: go to inbox when there's unread, else composer.
//   const onPressEncouragements = () => {
//     if (unreadCount > 0) {
//       setUnreadCount(0); // optimistic clear
//       navigation.navigate('ReceivedEncouragements', { markRead: true }); // inside HomeStack
//     } else {
//       navigation.navigate('Encouragement'); // inside HomeStack
//     }
//   };

//   return (
//     <Screen>
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         <View style={styles.body}>
//           <Text style={styles.greeting}>
//             {getGreeting()}
//             {displayName ? `, ${displayName}` : ''}
//           </Text>
//           <Text style={styles.sub}>Growing in obedience to Christ!</Text>

//           {/* Verse */}
//           <VerseCard>
//             {verse.text
//               ? `${verse.ref ? verse.ref + ' : ' : ''}"${verse.text}"`
//               : 'Set your favorite verse in profile.'}
//           </VerseCard>

//           <View style={{ height: 10 }} />

//           <PulseTile
//             label="Encouraging Messages"
//             pulsing={pulsing}
//             count={unreadCount}
//             onPress={onPressEncouragements}
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
//       </ScrollView>
//     </Screen>
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
//   },
//   scrollContent: {
//     flexGrow: 1, // lets Screen's background fill under short pages
//     paddingHorizontal: 16,
//     paddingTop: 6,
//     paddingBottom: 24,
//   },
// });

// src/screens/HomeScreen.js
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';

import Screen from '../components/Screen';
import VerseCard from '../components/VerseCard';
import PulseTile from '../components/PulseTile';
import TileButton from '../components/TileButton';
import { Colors } from '../constants/colors';
import { supabase } from '../supabase';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen({ navigation }) {
  const route = useRoute();

  // existing state
  const [verse, setVerse] = useState({ ref: '', text: '' });
  const [displayName, setDisplayName] = useState('');

  // inbox state
  const [unreadCount, setUnreadCount] = useState(0);

  const userIdRef = useRef(null);
  const rtChannelRef = useRef(null);

  const loadVerse = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('verse_ref, verse_text')
        .eq('id', user.id)
        .single();

      if (error) return;

      const ref = (data?.verse_ref || '').trim();
      const text = (data?.verse_text || '').trim();
      setVerse((prev) =>
        prev.ref !== ref || prev.text !== text ? { ref, text } : prev
      );
    } catch {}
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setDisplayName('');
        return;
      }
      userIdRef.current = user.id;

      const { data, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setDisplayName((data?.display_name || '').trim());
    } catch {
      setDisplayName('');
    }
  }, []);

  // unread count
  const loadUnreadCount = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setUnreadCount(0);
        return;
      }
      userIdRef.current = user.id;

      const { count, error } = await supabase
        .from('encouragements')
        .select('id', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .is('read_at', null);

      if (error) throw error;
      setUnreadCount(count || 0);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  // Realtime: keep unread badge in sync
  useEffect(() => {
    let isMounted = true;

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !isMounted) return;

      userIdRef.current = user.id;

      if (rtChannelRef.current) {
        supabase.removeChannel(rtChannelRef.current);
        rtChannelRef.current = null;
      }

      const ch = supabase
        .channel('encouragements-home')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'encouragements',
            filter: `recipient_id=eq.${user.id}`,
          },
          () => loadUnreadCount()
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'encouragements',
            filter: `recipient_id=eq.${user.id}`,
          },
          () => loadUnreadCount()
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'encouragements',
            filter: `recipient_id=eq.${user.id}`,
          },
          () => loadUnreadCount()
        )
        .subscribe();

      rtChannelRef.current = ch;
    })();

    return () => {
      isMounted = false;
      if (rtChannelRef.current) {
        supabase.removeChannel(rtChannelRef.current);
        rtChannelRef.current = null;
      }
    };
  }, [loadUnreadCount]);

  // on focus re-validate everything
  useFocusEffect(
    useCallback(() => {
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

      loadVerse();
      loadProfile();
      loadUnreadCount();

      if (route.params) {
        navigation.setParams({
          verseRef: undefined,
          verseText: undefined,
          refreshAt: undefined,
        });
      }
    }, [
      route.params?.verseRef,
      route.params?.verseText,
      route.params?.refreshAt,
      loadVerse,
      loadProfile,
      loadUnreadCount,
      navigation,
    ])
  );

  // Removed "Make Friends" here
  const tiles = [
    { label: 'Profile', emoji: '👤', screen: 'Profile' },
    { label: 'Resources', emoji: '🧰', screen: 'Resources' },
    { label: 'Donations', emoji: '❤️', screen: 'Donations' },
  ];

  const pulsing = unreadCount > 0;

  const onPressEncouragements = () => {
    if (unreadCount > 0) {
      setUnreadCount(0); // optimistic clear
      navigation.navigate('ReceivedEncouragements', { markRead: true }); // inside HomeStack
    } else {
      navigation.navigate('Encouragement'); // inside HomeStack
    }
  };

  return (
    <Screen dismissOnTap={false}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'on-drag' : 'none'}
        nestedScrollEnabled
      >
        <View style={styles.body}>
          <Text style={styles.greeting}>
            {getGreeting()}
            {displayName ? `, ${displayName}` : ''}
          </Text>
          <Text style={styles.sub}>Growing in obedience to Christ!</Text>

          <VerseCard>
            {verse.text
              ? `${verse.ref ? verse.ref + ' : ' : ''}"${verse.text}"`
              : 'Set your favorite verse in profile.'}
          </VerseCard>

          <View style={{ height: 10 }} />

          <PulseTile
            label="Encouraging Messages"
            pulsing={pulsing}
            count={unreadCount}
            onPress={onPressEncouragements}
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
      </ScrollView>
    </Screen>
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 24,
  },
});
