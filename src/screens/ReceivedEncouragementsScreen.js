// import React from 'react';
// import { ScrollView, Text, StyleSheet } from 'react-native';
// import Screen from '../components/Screen';
// import { Colors } from '../constants/colors';

// export default function ReceivedEncouragementsScreen({ navigation }) {
//   return (
//     // 👇 Automatically includes banner + upper-right back arrow
//     <Screen showBack onBack={() => navigation.goBack()}>
//       <ScrollView contentContainerStyle={styles.content}>
//         <Text style={styles.title}>Received Encouragements</Text>
//         <Text style={styles.subtitle}>
//           These will be permanently deleted after 30 days.
//         </Text>
//         <Text style={{ color: Colors.text }}>Inbox list here…</Text>
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
//   },
//   subtitle: {
//     fontSize: 16,
//     color: Colors.text,
//     marginBottom: 12,
//   },
// });

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import { Colors } from '../constants/colors';
import { supabase } from '../supabase';

const PAGE_SIZE = 20;

export default function ReceivedEncouragementsScreen({ navigation }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const userIdRef = useRef(null);

  const fmtRel = (iso) => {
    if (!iso) return '';
    try {
      const diff = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'just now';
      if (mins < 60) return `${mins} min ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
      const days = Math.floor(hrs / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } catch {
      return '';
    }
  };

  const loadPage = useCallback(async (pageIndex) => {
    // pageIndex 0 = first page
    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setRows([]);
      setHasMore(false);
      return;
    }
    userIdRef.current = user.id;

    const { data, error, count } = await supabase
      .from('encouragements')
      .select('id, message_text, created_at, from_display, sender_id', {
        count: 'estimated',
      })
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    if (pageIndex === 0) {
      setRows(data || []);
    } else {
      setRows((prev) => [...prev, ...(data || [])]);
    }

    // naive "has more" check using estimated count, if present
    if (typeof count === 'number') {
      setHasMore(to + 1 < count);
    } else {
      setHasMore((data || []).length === PAGE_SIZE);
    }
  }, []);

  const initialLoad = useCallback(async () => {
    setLoading(true);
    try {
      await loadPage(0);
      setPage(0);
    } finally {
      setLoading(false);
    }
  }, [loadPage]);

  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadPage(0);
      setPage(0);
    } finally {
      setRefreshing(false);
    }
  }, [loadPage]);

  const loadMore = useCallback(async () => {
    if (loading || refreshing || !hasMore) return;
    const next = page + 1;
    try {
      await loadPage(next);
      setPage(next);
    } catch {
      // ignore; keep current page
    }
  }, [page, hasMore, loading, refreshing, loadPage]);

  return (
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Received Encouragements</Text>
        <Text style={styles.subtitle}>
          A feed of messages others have sent to you.
        </Text>

        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={Colors.button} />
            <Text style={{ color: Colors.text, marginLeft: 8 }}>Loading…</Text>
          </View>
        ) : rows.length === 0 ? (
          <Text style={{ color: Colors.text }}>
            Nothing here yet. Ask a friend to send you an encouragement!
          </Text>
        ) : (
          <>
            {rows.map((r) => (
              <View key={r.id} style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.msg}>"{r.message_text}"</Text>
                  <Text style={styles.meta}>
                    From: {r.from_display || 'A friend'} ·{' '}
                    {fmtRel(r.created_at)}
                  </Text>
                </View>
                {/* Copy button (optional nicety) */}
                <TouchableOpacity
                  onPress={() => {
                    // Lazy import to avoid adding a hard dep at top
                    import('react-native').then(({ Clipboard }) => {
                      // New RN uses expo-clipboard typically; if you add it later,
                      // replace this with Clipboard from 'expo-clipboard'
                    });
                  }}
                  activeOpacity={0.8}
                  style={styles.copyBtn}
                  disabled
                >
                  <Ionicons name="copy-outline" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}

            {hasMore && (
              <TouchableOpacity
                onPress={loadMore}
                activeOpacity={0.9}
                style={styles.moreBtn}
              >
                <Text style={styles.moreText}>Load more</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 17 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.button },
  subtitle: { color: Colors.text, marginTop: 6, marginBottom: 12 },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  card: {
    backgroundColor: '#1c7293',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  msg: { color: '#fff', fontSize: 16, fontStyle: 'italic', marginBottom: 6 },
  meta: { color: '#cfe1ee', fontSize: 12 },

  copyBtn: {
    backgroundColor: Colors.button,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    opacity: 0.6, // placeholder (disabled)
  },

  moreBtn: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.button,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: 8,
  },
  moreText: { color: Colors.button, fontWeight: '800' },
});
