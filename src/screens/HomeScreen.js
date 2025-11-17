// // src/screens/HomeScreen.js
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
// import { useFocusEffect, useRoute } from '@react-navigation/native';
// import { useAutoScrollTop } from '../hooks/useAutoScrollTop';

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

//   const scrollRef = useRef(null);

//   // 👇 Auto-reset scroll to top whenever the screen becomes focused
//   useAutoScrollTop(scrollRef);

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

//   // Realtime: keep unread badge in sync
//   useEffect(() => {
//     let isMounted = true;

//     (async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user || !isMounted) return;

//       userIdRef.current = user.id;

//       if (rtChannelRef.current) {
//         supabase.removeChannel(rtChannelRef.current);
//         rtChannelRef.current = null;
//       }

//       const ch = supabase
//         .channel('encouragements-home')
//         .on(
//           'postgres_changes',
//           {
//             event: 'INSERT',
//             schema: 'public',
//             table: 'encouragements',
//             filter: `recipient_id=eq.${user.id}`,
//           },
//           () => loadUnreadCount()
//         )
//         .on(
//           'postgres_changes',
//           {
//             event: 'UPDATE',
//             schema: 'public',
//             table: 'encouragements',
//             filter: `recipient_id=eq.${user.id}`,
//           },
//           () => loadUnreadCount()
//         )
//         .on(
//           'postgres_changes',
//           {
//             event: 'DELETE',
//             schema: 'public',
//             table: 'encouragements',
//             filter: `recipient_id=eq.${user.id}`,
//           },
//           () => loadUnreadCount()
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

//   // Removed "Make Friends" here
//   const tiles = [
//     { label: 'Resources', emoji: '🧰', screen: 'Resources' },
//     { label: 'Donations', emoji: '❤️', screen: 'Donations' },
//   ];

//   const pulsing = unreadCount > 0;

//   const onPressEncouragements = () => {
//     if (unreadCount > 0) {
//       setUnreadCount(0); // optimistic clear
//       navigation.navigate('ReceivedEncouragements', { markRead: true }); // inside HomeStack
//     } else {
//       navigation.navigate('Encouragement'); // inside HomeStack
//     }
//   };

//   return (
//     <Screen dismissOnTap={false}>
//       <ScrollView
//         ref={scrollRef}
//         style={{ flex: 1 }}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//         keyboardDismissMode={Platform.OS === 'ios' ? 'on-drag' : 'none'}
//         nestedScrollEnabled
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
//     flexGrow: 1,
//     paddingHorizontal: 16,
//     paddingTop: 6,
//     paddingBottom: 24,
//   },
// });

// adding challenge tile
// src/screens/HomeScreen.js
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useAutoScrollTop } from '../hooks/useAutoScrollTop';

import Screen from '../components/Screen';
import VerseCard from '../components/VerseCard';
import PulseTile from '../components/PulseTile';
import TileButton from '../components/TileButton';
import { Colors } from '../constants/colors';
import { supabase } from '../supabase';
import { getOrCreateTodaysChallenge } from '../logic/dailyChallenge';
import ChallengeTile from '../components/ChallengeTile';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen({ navigation }) {
  const route = useRoute();

  const scrollRef = useRef(null);

  // 👇 Auto-reset scroll to top whenever the screen becomes focused
  useAutoScrollTop(scrollRef);

  // existing state
  const [verse, setVerse] = useState({ ref: '', text: '' });
  const [displayName, setDisplayName] = useState('');

  // inbox state
  const [unreadCount, setUnreadCount] = useState(0);

  // challenge tile logic
  const [todayChallenge, setTodayChallenge] = useState(null);

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

      // load today's challenge for the tile
      (async () => {
        try {
          const challenge = await getOrCreateTodaysChallenge();
          setTodayChallenge(challenge?.prompt || null);
        } catch (e) {
          console.warn('Error loading today challenge', e);
          setTodayChallenge(null);
        }
      })();

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
    { label: 'Bible', emoji: '✝️', screen: 'Bible' },
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
        ref={scrollRef}
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

          {/* 🔹 Today’s Live It Out Challenge tile */}
          <ChallengeTile
            title="Today’s Live It Out Challenge:"
            subtitle={todayChallenge}
          />

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
