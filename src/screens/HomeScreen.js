// src/screens/HomeScreen.js
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

  // track current user id for realtime
  const [userId, setUserId] = useState(null);
  const channelRef = useRef(null);

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

  // unread count (also captures user id for realtime)
  const loadUnreadCount = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setUserId(null);
        setUnreadCount(0);
        return;
      }
      setUserId(user.id);

      const { count } = await supabase
        .from('encouragements')
        .select('id', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .is('read_at', null);

      setUnreadCount(count || 0);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  // on focus re-validate everything
  useFocusEffect(
    useCallback(() => {
      // accept optimistic verse updates from Profile
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

  // ---- Realtime: new encouragements → update unread instantly ----
  useEffect(() => {
    // tear down any prior channel when user changes
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (!userId) return;

    const channel = supabase
      .channel(`encouragements-inbox-${userId}`)
      // New message for me
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'encouragements',
          filter: `recipient_id=eq.${userId}`,
        },
        () => {
          // increment optimistically
          setUnreadCount((n) => (Number.isFinite(n) ? n + 1 : 1));
        }
      )
      // If someone toggles read_at from null → not null elsewhere,
      // you could decrement here. Home only needs to light up on INSERTs.
      .subscribe((status) => {
        // no-op; can log status if you want
      });

    channelRef.current = channel;
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId]);

  const tiles = [
    // { label: 'Prayers List', emoji: '🙏', screen: 'PrayerList' },
    { label: 'Profile', emoji: '👤', screen: 'Profile' },
    // { label: 'Today’s Quest', emoji: '🎯', screen: 'Quest' },
    // { label: 'Progress', emoji: '📈', screen: 'Progress' },
    { label: 'Make Friends', emoji: '🤝', screen: 'MakeFriends' },
    // { label: 'Friends List', emoji: '📋', screen: 'FriendsList' },
    { label: 'Resources', emoji: '🧰', screen: 'Resources' },
    { label: 'Donations', emoji: '❤️', screen: 'Donations' },
  ];

  const pulsing = unreadCount > 0;

  // What happens when the user taps the Enc Messages tile
  const onPressEncouragements = () => {
    if (unreadCount > 0) {
      // Optimistically stop the animation & clear badge
      setUnreadCount(0);
      // Go to inbox; screen will mark as read server-side
      navigation.navigate('ReceivedEncouragements', { markRead: true });
    } else {
      navigation.navigate('Encouragement');
    }
  };

  return (
    <ScrollView>
      <Screen showBack={false}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>The Narrow Way</Text>
        </View>

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
  },
});
