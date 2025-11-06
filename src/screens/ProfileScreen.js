import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { Colors } from '../constants/colors';
import { supabase } from '../supabase';
// import 'react-native-get-random-values'; // ensures UUID works on mobile
// import { v4 as uuidv4 } from 'uuid';

// Converts UUID → short, human-friendly base36 ID
function shortCodeFromUid(uid) {
  try {
    const hex = (uid || '').replace(/[^a-f0-9]/gi, '');
    const chunk = hex.slice(0, 10) || '0000000000';
    const num = parseInt(chunk, 16);
    return num.toString(36).toUpperCase().slice(0, 9);
  } catch {
    return uid.slice(0, 9).toUpperCase();
  }
}

export default function ProfileScreen({ navigation }) {
  const [uid, setUid] = useState('');
  const [shortId, setShortId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [verseRef, setVerseRef] = useState('');
  const [verseText, setVerseText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Get the currently authenticated (anonymous) user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          console.warn(
            'No active auth session. Ensure anonymous sign-in is running at app start.'
          );
          setLoading(false);
          return;
        }

        const uid = user.id;
        setUid(uid);
        setShortId(shortCodeFromUid(uid));

        // Try to fetch profile data for this user
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name, verse_ref, verse_text')
          .eq('id', uid)
          .single();

        if (!error && data) {
          setDisplayName(data.display_name || '');
          setVerseRef(data.verse_ref || '');
          setVerseText(data.verse_text || '');
        } else if (error && error.code === 'PGRST116') {
          // No row found yet — create one
          await supabase.from('profiles').insert({
            id: uid,
            display_name: '',
            verse_ref: '',
            verse_text: '',
          });
        }
      } catch (e) {
        console.error('Profile load error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSave = async () => {
    setSaving(true);
    try {
      const clean = (s) => (s && s.trim().length ? s.trim() : null);

      const { error } = await supabase
        .from('profiles')
        // .upsert({
        //   id: uid,
        //   display_name: displayName.trim(),
        //   verse_ref: verseRef.trim(),
        //   verse_text: verseText.trim(),
        // })
        .upsert(
          {
            id: uid, // PK
            display_name: clean(displayName),
            verse_ref: clean(verseRef),
            verse_text: clean(verseText),
          },
          { onConflict: 'id' } // make it an UPSERT on the id column
        )
        .select();

      if (error) throw error;
      // Alert.alert('Saved', 'Your profile has been updated.');
      // // Ensure Home refetches immediately on return
      // navigation.navigate('Home', { refreshAt: Date.now() });
      Alert.alert('Saved', 'Your profile has been updated.');
      // Update Home and still allow silent revalidation
      const toRoute = (s) => (s && s.trim().length ? s.trim() : '');
      navigation.navigate('Home', {
        verseRef: toRoute(verseRef),
        verseText: toRoute(verseText),
        refreshAt: Date.now(),
      });
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Screen showBack onBack={() => navigation.goBack()}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.button} />
          <Text style={{ color: Colors.text, marginTop: 8 }}>
            Loading profile…
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>
        {/* <Text style={styles.subtitle}>
          Update your name and favorite Scripture.
        </Text> */}

        {/* Unique ID (read-only) */}
        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Your User ID (share with friends)</Text>
          <View style={styles.idRow}>
            <Text style={styles.idValue}>{shortId || '—'}</Text>
          </View>
          <Text style={styles.helpText}>
            Friends can find you using this ID.
          </Text>
        </View>

        {/* Display Name */}
        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="e.g., John D."
            placeholderTextColor="#9fb1c1"
            style={styles.input}
            maxLength={60}
          />
        </View>

        {/* Favorite Verse */}
        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Favorite Verse (Reference)</Text>
          <TextInput
            value={verseRef}
            onChangeText={setVerseRef}
            placeholder="e.g., John 3:16"
            placeholderTextColor="#9fb1c1"
            style={styles.input}
            maxLength={60}
          />
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Favorite Verse (Text)</Text>
          <TextInput
            value={verseText}
            onChangeText={setVerseText}
            placeholder="Enter verse text"
            placeholderTextColor="#9fb1c1"
            style={[styles.input, styles.multiline]}
            multiline
          />
        </View>

        <TouchableOpacity
          onPress={onSave}
          activeOpacity={0.9}
          disabled={saving}
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons
                name="save-outline"
                size={18}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.saveText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 17 },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.button,
    marginBottom: 8,
  },
  subtitle: {
    backgroundColor: '#e9eef3',
    borderRadius: 16,
    color: Colors.button,
    marginTop: 4,
    marginBottom: 12,
    opacity: 0.7,
    fontSize: 20,
    fontWeight: '800',
  },
  fieldBlock: { marginTop: 12 },
  label: { marginBottom: 8, fontSize: 16, fontWeight: '800', color: '#1b2140' },
  input: {
    backgroundColor: '#e9eef3',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    color: Colors.button,
    fontWeight: '700',
    fontSize: 16,
  },
  multiline: { height: 110, paddingTop: 12, lineHeight: 20 },
  idRow: {
    backgroundColor: '#e9eef3',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    alignItems: 'center',
    flexDirection: 'row',
  },
  idValue: { fontSize: 16, fontWeight: '800', color: Colors.button },
  saveBtn: {
    backgroundColor: Colors.button,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveText: { color: '#fff', fontWeight: '800' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
