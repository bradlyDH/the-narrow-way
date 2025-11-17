// src/screens/EncouragementScreen.js
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

import Screen from '../components/Screen';
import FloatingLabelInput from '../components/FloatingLabelInput';
import { Colors } from '../constants/colors';
import { supabase } from '../supabase';

const TEMPLATES = [
  { key: 'loved_valued', text: 'You are loved and valued by God!' },
  { key: 'keep_pressing', text: 'Keep pressing on, God sees your efforts!' },
  { key: 'praying_today', text: 'Praying for you today!' },
  { key: 'grace_sufficient', text: "God's grace is sufficient for you!" },
  { key: 'light_world', text: 'You are a light in this world!' },
];

// helpers
const norm = (s) => (s || '').trim().toLowerCase();

export default function EncouragementScreen({ navigation }) {
  const route = useRoute();

  // form
  const [toName, setToName] = useState('');
  const [openPicker, setOpenPicker] = useState(false);
  const [selected, setSelected] = useState(null);

  // recipient (must be one of my friends)
  const [recipientId, setRecipientId] = useState(null);
  const [recipientDisplay, setRecipientDisplay] = useState('');
  const [recipientShortId, setRecipientShortId] = useState('');

  // friends for type-ahead
  const [friends, setFriends] = useState([]); // [{ id, display_name, short_id }]
  const [loadingFriends, setLoadingFriends] = useState(true);

  // ux
  const [sending, setSending] = useState(false);
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [recent, setRecent] = useState(null); // { message_text, created_at, from_display }

  const userIdRef = useRef(null);
  const displayNameRef = useRef('');

  // Prefill from navigation params when coming from Friends list
  useEffect(() => {
    if (route.params?.targetId) setOpenPicker(true);
  }, [route.params?.targetId]);

  useEffect(() => {
    const nameFromRoute =
      typeof route.params?.targetName === 'string'
        ? route.params.targetName
        : '';
    const idFromRoute =
      typeof route.params?.targetId === 'string' ? route.params.targetId : null;
    const shortFromRoute =
      typeof route.params?.targetShortId === 'string'
        ? route.params.targetShortId
        : '';

    if (nameFromRoute) setToName(nameFromRoute);
    if (idFromRoute) {
      setRecipientId(idFromRoute);
      setRecipientDisplay(nameFromRoute || '');
      setRecipientShortId(shortFromRoute || '');
    }
  }, [route.params]);

  const previewText = useMemo(
    () => (selected ? selected.text : ''),
    [selected]
  );

  // ---------- Load my accepted friends for type-ahead ----------
  const loadFriends = useCallback(async () => {
    setLoadingFriends(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setFriends([]);
        return;
      }
      userIdRef.current = user.id;

      // Fetch accepted friendships where I'm requester or addressee
      const { data, error } = await supabase
        .from('friendships')
        .select(
          `
            id, status,
            requester:requester_id ( id, display_name, short_id ),
            addressee:addressee_id ( id, display_name, short_id )
          `
        )
        .eq('status', 'accepted')
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

      if (error) throw error;

      // Normalize to a flat list of other people (unique by id)
      const mine = (data || [])
        .map((row) => {
          const req = row.requester;
          const add = row.addressee;
          if (!req || !add) return null;
          const other = req.id === user.id ? add : req;
          return other
            ? {
                id: other.id,
                display_name: other.display_name || '',
                short_id: other.short_id || '',
                _name: norm(other.display_name || ''),
                _sid: norm(other.short_id || ''),
              }
            : null;
        })
        .filter(Boolean);

      // de-dup by id
      const unique = [];
      const seen = new Set();
      for (const p of mine) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          unique.push(p);
        }
      }

      setFriends(unique);
    } catch {
      setFriends([]);
    } finally {
      setLoadingFriends(false);
    }
  }, []);

  // ---------- Load auth and banner ----------
  const loadAuthAndBanner = useCallback(async () => {
    setLoadingBanner(true);
    try {
      // who am I?
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setRecent(null);
        setLoadingBanner(false);
        return;
      }
      userIdRef.current = user.id;

      // try to read profile for display name
      const { data: prof } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();
      displayNameRef.current = (prof?.display_name || '').trim();

      // fetch the most recent encouragement for banner
      const { data: received, error: recErr } = await supabase
        .from('encouragements')
        .select(
          'id, message_text, created_at, from_display, recipient_id, sender_id'
        )
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!recErr && received && received.length) {
        setRecent({
          message_text: received[0].message_text,
          created_at: received[0].created_at,
          from_display: received[0].from_display || 'A friend',
        });
      } else {
        const { data: sent } = await supabase
          .from('encouragements')
          .select('id, message_text, created_at, to_name')
          .eq('sender_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (sent && sent.length) {
          setRecent({
            message_text: sent[0].message_text,
            created_at: sent[0].created_at,
            from_display: `You → ${sent[0].to_name || 'friend'}`,
          });
        } else {
          setRecent(null);
        }
      }
    } catch {
      setRecent(null);
    } finally {
      setLoadingBanner(false);
    }
  }, []);

  useEffect(() => {
    loadAuthAndBanner();
    loadFriends(); // load friends for type-ahead
  }, [loadAuthAndBanner, loadFriends]);

  const onPickTemplate = (tpl) => {
    setSelected(tpl);
    setOpenPicker(false);
  };

  // ---------- Type-ahead filtering ----------
  const suggestions = useMemo(() => {
    const q = norm(toName);
    if (!q) return [];
    return friends.filter((p) => p._name.includes(q)).slice(0, 8);
  }, [toName, friends]);

  // Try to auto-select an exact friend when the text matches exactly
  const autoSelectExact = useCallback(
    (text) => {
      const q = norm(text);
      if (!q) return false;
      const exact = friends.find((p) => p._name === q);
      if (exact) {
        setRecipientId(exact.id);
        setRecipientDisplay(exact.display_name || '');
        setRecipientShortId(exact.short_id || '');
        return true;
      }
      return false;
    },
    [friends]
  );

  const onChooseSuggestion = (p) => {
    setToName(p.display_name || p.short_id || '');
    setRecipientId(p.id);
    setRecipientDisplay(p.display_name || '');
    setRecipientShortId(p.short_id || '');
  };

  const onChangeToName = (t) => {
    setToName(t);
    // Clear any previous selection while typing
    setRecipientId(null);
    setRecipientDisplay('');
    setRecipientShortId('');
    // If they typed an exact match, auto-select
    autoSelectExact(t);
  };

  const onBlurToName = () => {
    // If blur happens without a selected friend, clear the field to enforce friends-only
    if (!recipientId) {
      setToName('');
    }
  };

  const onSend = async () => {
    const clean = (s) => (s && s.trim().length ? s.trim() : '');
    const to = clean(toName);

    // Enforce: must choose a friend from your list
    if (!recipientId) {
      Alert.alert(
        'Select a Friend',
        'Please choose a friend from your suggestions list.'
      );
      return;
    }
    if (!to) {
      Alert.alert('Friend required', "Please enter your friend's name.");
      return;
    }
    if (!selected) {
      Alert.alert(
        'Message required',
        'Please select an encouragement message.'
      );
      return;
    }

    setSending(true);
    try {
      const sender_id = userIdRef.current;
      if (!sender_id) {
        throw new Error('No active session. Please relaunch the app.');
      }

      const from_display = displayNameRef.current || 'A friend';

      const { error } = await supabase.from('encouragements').insert({
        sender_id,
        recipient_id: recipientId, // must be set by selection
        to_name: to, // keep for display
        template_key: selected.key,
        message_text: selected.text,
        from_display,
      });

      if (error) throw error;

      Alert.alert('Sent!', 'Your encouragement has been sent.');
      setToName('');
      setSelected(null);
      setOpenPicker(false);
      setRecipientId(null);
      setRecipientDisplay('');
      setRecipientShortId('');

      // refresh banner quietly
      loadAuthAndBanner();
    } catch (e) {
      Alert.alert('Error', e?.message || 'Failed to send encouragement.');
    } finally {
      setSending(false);
    }
  };

  const fmtRel = (iso) => {
    if (!iso) return '';
    try {
      const ms = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(ms / 60000);
      if (mins < 1) return 'just now';
      if (mins < 60) return `${mins} min ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
      const days = Math.floor(hrs / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } catch {
      return '';
    }
  };

  // Only enable send when valid selection + template picked
  const canSend = !!recipientId && !!selected && !sending;

  return (
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Most Recent Banner */}
        {loadingBanner ? (
          <View style={styles.bannerSkeleton}>
            <ActivityIndicator color="#fff" />
          </View>
        ) : recent ? (
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>Most Recent Encouragement</Text>
            <Text style={styles.bannerQuote}>"{recent.message_text}"</Text>
            <Text style={styles.bannerFrom}>
              From: {recent.from_display} · {fmtRel(recent.created_at)}
            </Text>
          </View>
        ) : null}

        <Text style={styles.pageTitle}>Send Encouragement 💬</Text>
        <Text style={styles.subtitle}>
          Choose who you’re lifting up, then pick a Christ-Centered message.
          {'\n'}(No custom messages; we’re keeping this app safe and
          encouraging.)
        </Text>

        {/* Friend name (friends-only with type-ahead) */}
        <FloatingLabelInput
          label={
            loadingFriends
              ? 'Who is this for? (loading friends…)'
              : 'Who is this for?'
          }
          value={toName}
          onChangeText={onChangeToName}
          onBlur={onBlurToName}
          placeholder="Type a friend’s name or ID"
          maxLength={60}
          autoCorrect={false}
          autoCapitalize="words"
        />

        {/* Selected friend chip */}
        {!!recipientId && (
          <View style={styles.selectedChip}>
            <Ionicons
              name="person-circle-outline"
              size={16}
              color="#0b2545"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.selectedChipText}>
              {recipientDisplay || 'Unnamed User'} · ID: {recipientShortId}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setRecipientId(null);
                setRecipientDisplay('');
                setRecipientShortId('');
                setToName('');
              }}
              style={{ marginLeft: 8 }}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Ionicons name="close" size={14} color="#0b2545" />
            </TouchableOpacity>
          </View>
        )}

        {/* Suggestions list (only my friends) */}
        {suggestions.length > 0 && !recipientId && (
          <View style={styles.suggestionBox}>
            {suggestions.map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => onChooseSuggestion(p)}
                activeOpacity={0.9}
                style={styles.suggestionRow}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={18}
                  color="#0b2545"
                  style={{ marginRight: 8 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.suggestionName}>
                    {p.display_name || 'Unnamed User'}
                  </Text>
                  <Text style={styles.suggestionMeta}>ID: {p.short_id}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 12 }} />

        {/* Message picker (collapsible) */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setOpenPicker((s) => !s)}
          style={styles.pickerHeader}
        >
          <Text style={styles.pickerHeaderText}>
            {selected ? selected.text : 'Select a message'}
          </Text>
          <Ionicons
            name={openPicker ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>

        {openPicker && (
          <View style={{ marginTop: 10 }}>
            {TEMPLATES.map((tpl) => {
              const active = selected?.key === tpl.key;
              return (
                <TouchableOpacity
                  key={tpl.key}
                  activeOpacity={0.9}
                  onPress={() => onPickTemplate(tpl)}
                  style={[styles.tplBtn, active && styles.tplBtnActive]}
                >
                  <Text
                    style={[styles.tplBtnText, active && { fontWeight: '800' }]}
                  >
                    {tpl.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Preview */}
        {!!previewText && (
          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>Preview:</Text>
            <Text style={styles.previewText}>{previewText}</Text>
          </View>
        )}

        {/* Send */}
        <TouchableOpacity
          onPress={onSend}
          disabled={!canSend}
          activeOpacity={0.9}
          style={[styles.primaryBtn, (!canSend || sending) && { opacity: 0.6 }]}
        >
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>
              {recipientId ? 'Send Encouragement' : 'Select a Friend to Send'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Received */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ReceivedEncouragements')}
          activeOpacity={0.9}
          style={styles.secondaryBtn}
        >
          <Text style={styles.secondaryBtnText}>
            Show Received Encouragements
          </Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 17 },

  banner: {
    backgroundColor: '#1d5b79',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  bannerSkeleton: {
    backgroundColor: '#184c65',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
  },
  bannerTitle: { color: '#f8ed62', fontWeight: '800', marginBottom: 6 },
  bannerQuote: {
    color: '#ecf5fb',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  bannerFrom: { color: '#cfe1ee', fontSize: 12 },

  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.button,
    marginTop: 4,
  },
  subtitle: { color: Colors.text, marginTop: 6, marginBottom: 14 },

  // Selected friend chip
  selectedChip: {
    marginTop: 8,
    backgroundColor: '#e9eef3',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedChipText: { color: '#0b2545', fontWeight: '800' },

  // Suggestions
  suggestionBox: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: '#e9eef3',
    overflow: 'hidden',
  },
  suggestionRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#d2dbe3',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  suggestionName: { color: '#0b2545', fontWeight: '800' },
  suggestionMeta: { color: '#4a6378', fontSize: 12 },

  pickerHeader: {
    backgroundColor: '#1e4e6a',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerHeaderText: { color: '#fff', fontWeight: '800' },

  tplBtn: {
    backgroundColor: '#8fa7b7',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  tplBtnActive: { backgroundColor: '#5a7a8f' },
  tplBtnText: { color: '#0f1d2b', fontWeight: '700' },

  previewBox: {
    backgroundColor: '#f1eaa6',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    marginBottom: 10,
  },
  previewLabel: { color: '#6b6400', fontWeight: '800', marginBottom: 6 },
  previewText: { color: '#3a3600', fontWeight: '700' },

  primaryBtn: {
    backgroundColor: Colors.button,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },

  secondaryBtn: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.button,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  secondaryBtnText: { color: Colors.button, fontWeight: '800' },
});
