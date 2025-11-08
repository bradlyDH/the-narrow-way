// src/screens/ReceivedEncouragementsScreen.js
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
import Screen from '../components/Screen';
import { Colors } from '../constants/colors';
import { supabase } from '../supabase';

const PAGE_SIZE = 20;

export default function ReceivedEncouragementsScreen({ navigation, route }) {
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
      .select(
        'id, message_text, created_at, from_display, sender_id, read_at',
        {
          count: 'estimated',
        }
      )
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    if (pageIndex === 0) {
      setRows(data || []);
    } else {
      setRows((prev) => [...prev, ...(data || [])]);
    }

    if (typeof count === 'number') {
      setHasMore(to + 1 < count);
    } else {
      setHasMore((data || []).length === PAGE_SIZE);
    }
  }, []);

  // mark all current-user unread as read
  const markAllRead = useCallback(async () => {
    const uid = userIdRef.current;
    if (!uid) return;
    await supabase
      .from('encouragements')
      .update({ read_at: new Date().toISOString() })
      .eq('recipient_id', uid)
      .is('read_at', null);
  }, []);

  const initialLoad = useCallback(async () => {
    setLoading(true);
    try {
      await loadPage(0);
      setPage(0);
      // If called with markRead flag (from tile tap when unread>0), mark read now
      if (route?.params?.markRead) {
        await markAllRead();
      }
    } finally {
      setLoading(false);
    }
  }, [loadPage, markAllRead, route?.params?.markRead]);

  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadPage(0);
      setPage(0);
      await markAllRead();
    } finally {
      setRefreshing(false);
    }
  }, [loadPage, markAllRead]);

  const loadMore = useCallback(async () => {
    if (loading || refreshing || !hasMore) return;
    const next = page + 1;
    try {
      await loadPage(next);
      setPage(next);
    } catch {}
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
