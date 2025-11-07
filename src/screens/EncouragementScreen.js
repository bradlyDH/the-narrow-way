// import React from 'react';
// import { ScrollView, Text, StyleSheet } from 'react-native';
// import Screen from '../components/Screen';
// import { Colors } from '../constants/colors';

// export default function EncouragementScreen({ navigation }) {
//   return (
//     // 👇 Automatically shows sun-rays and back arrow in upper-right corner
//     <Screen showBack onBack={() => navigation.goBack()}>
//       <ScrollView contentContainerStyle={styles.content}>
//         <Text style={styles.title}>Send Encouragement 💬</Text>
//         <Text style={styles.subtitle}>
//           Choose who you’re lifting up, then pick a message.
//         </Text>
//         <Text style={{ color: Colors.text }}>
//           Search & template picker goes here…
//         </Text>
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

export default function EncouragementScreen({ navigation }) {
  // form
  const [toName, setToName] = useState('');
  const [openPicker, setOpenPicker] = useState(false);
  const [selected, setSelected] = useState(null);

  // ux
  const [sending, setSending] = useState(false);
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [recent, setRecent] = useState(null); // { message_text, created_at, from_display }

  const userIdRef = useRef(null);
  const displayNameRef = useRef('');

  const previewText = useMemo(
    () => (selected ? selected.text : ''),
    [selected]
  );

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
      // Prefer: the most recent received (recipient_id == me)
      // Fallback: the most recent I sent (sender_id == me)
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
  }, [loadAuthAndBanner]);

  const onPickTemplate = (tpl) => {
    setSelected(tpl);
    setOpenPicker(false);
  };

  const onSend = async () => {
    const clean = (s) => (s && s.trim().length ? s.trim() : '');
    const to = clean(toName);
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

      // Optional: include your own display name to make Received screen nicer later
      const from_display = displayNameRef.current || 'A friend';

      const { error } = await supabase.from('encouragements').insert({
        sender_id,
        recipient_id: null, // when you have a real friend id, fill it in
        to_name: to,
        template_key: selected.key,
        message_text: selected.text,
        from_display,
      });

      if (error) throw error;

      Alert.alert('Sent!', 'Your encouragement has been sent.');
      setToName('');
      setSelected(null);
      setOpenPicker(false);

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

        {/* Friend name */}
        <FloatingLabelInput
          label="Who is this for?"
          value={toName}
          onChangeText={setToName}
          maxLength={60}
        />

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
          disabled={sending}
          activeOpacity={0.9}
          style={[styles.primaryBtn, sending && { opacity: 0.6 }]}
        >
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Send Encouragement</Text>
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
