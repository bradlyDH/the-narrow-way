// // import React from 'react';
// // import { ScrollView, Text, StyleSheet } from 'react-native';
// // import Screen from '../components/Screen';
// // import { Colors } from '../constants/colors';

// // export default function ProfileScreen({ navigation }) {
// //   return (
// //     // 👇 Uses Screen wrapper to handle banner + back arrow automatically
// //     <Screen showBack onBack={() => navigation.goBack()}>
// //       <ScrollView contentContainerStyle={styles.content}>
// //         <Text style={styles.title}>Profile</Text>
// //         <Text style={styles.subtitle}>
// //           Update your name and favorite Scripture.
// //         </Text>
// //         <Text style={{ color: Colors.text }}>Profile form…</Text>
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
// //   },
// //   subtitle: {
// //     fontSize: 16,
// //     color: Colors.text,
// //     marginBottom: 12,
// //   },
// // });

// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Platform,
// } from 'react-native';
// import Screen from '../components/Screen';
// import { Colors } from '../constants/colors';
// import { Ionicons } from '@expo/vector-icons';
// import { supabase } from '../supabase'; // adjust path if your supabase.js lives elsewhere

// // --- Helpers ---
// // Deterministic short code from the auth UID (no DB column required)
// // Strip hyphens, take a chunk, convert to base36, upper-case, cut to 9 chars.
// function shortCodeFromUid(uid) {
//   try {
//     const hex = (uid || '').replace(/[^a-f0-9]/gi, '');
//     const chunk = hex.slice(0, 10) || '0000000000';
//     const num = parseInt(chunk, 16);
//     return num.toString(36).toUpperCase().padStart(7, '0').slice(0, 9);
//   } catch {
//     // Fallback: first 9 of uid (safe)
//     return (uid || '').replace(/-/g, '').slice(0, 9).toUpperCase();
//   }
// }

// export default function ProfileScreen({ navigation }) {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');

//   const [displayName, setDisplayName] = useState('');
//   const [verseRef, setVerseRef] = useState('');
//   const [verseText, setVerseText] = useState('');

//   const [uid, setUid] = useState(null);

//   const shortId = useMemo(() => shortCodeFromUid(uid), [uid]);

//   useEffect(() => {
//     let isMounted = true;

//     (async () => {
//       setLoading(true);
//       setError('');

//       // 1) Get the current user
//       const {
//         data: { user },
//         error: authErr,
//       } = await supabase.auth.getUser();

//       if (authErr || !user) {
//         if (!isMounted) return;
//         setError(
//           authErr?.message || 'You must be signed in to view your profile.'
//         );
//         setLoading(false);
//         return;
//       }

//       if (!isMounted) return;
//       setUid(user.id);

//       // 2) Fetch profile
//       const { data, error: profErr } = await supabase
//         .from('profiles')
//         .select('display_name, verse_ref, verse_text')
//         .eq('id', user.id)
//         .single();

//       if (profErr && profErr.code !== 'PGRST116') {
//         // PGRST116 = no rows, which is fine for first-time users
//         if (!isMounted) return;
//         setError(profErr.message);
//         setLoading(false);
//         return;
//       }

//       if (!isMounted) return;
//       if (data) {
//         setDisplayName(data.display_name || '');
//         setVerseRef(data.verse_ref || '');
//         setVerseText(data.verse_text || '');
//       }
//       setLoading(false);
//     })();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const onSave = async () => {
//     setSaving(true);
//     setError('');

//     try {
//       // Basic client validation
//       if (!displayName.trim()) {
//         setSaving(false);
//         Alert.alert('Display Name required', 'Please enter your display name.');
//         return;
//       }

//       const { error: upErr } = await supabase.from('profiles').upsert(
//         {
//           id: uid, // PK = auth UID
//           display_name: displayName.trim(),
//           verse_ref: verseRef.trim(),
//           verse_text: verseText.trim(),
//         },
//         { onConflict: 'id' } // ensure it updates existing row
//       );

//       if (upErr) {
//         setError(upErr.message);
//         setSaving(false);
//         return;
//       }

//       setSaving(false);
//       Alert.alert('Saved', 'Your profile has been updated.');
//     } catch (e) {
//       setSaving(false);
//       setError(e?.message || 'Something went wrong saving your profile.');
//     }
//   };

//   return (
//     <Screen showBack onBack={() => navigation.goBack()}>
//       {loading ? (
//         <View style={styles.loadingWrap}>
//           <ActivityIndicator size="large" color={Colors.button} />
//           <Text style={{ color: Colors.text, marginTop: 8 }}>
//             Loading profile…
//           </Text>
//         </View>
//       ) : (
//         <ScrollView
//           contentContainerStyle={styles.content}
//           keyboardShouldPersistTaps="handled"
//         >
//           <Text style={styles.title}>Profile</Text>
//           <Text style={styles.subtitle}>
//             Update your name and favorite Scripture.
//           </Text>

//           {!!error && (
//             <View style={styles.errorBox}>
//               <Ionicons
//                 name="alert-circle"
//                 size={18}
//                 color="#a30000"
//                 style={{ marginRight: 6 }}
//               />
//               <Text style={styles.errorText}>{error}</Text>
//             </View>
//           )}

//           {/* Unique ID (read-only) */}
//           <View style={styles.fieldBlock}>
//             <Text style={styles.label}>Your User ID (share with friends)</Text>
//             <View style={styles.idRow}>
//               <Text style={styles.idValue}>{shortId || '—'}</Text>
//             </View>
//             <Text style={styles.helpText}>
//               Friends can find you using this ID. It’s derived from your
//               account—no need to memorize it.
//             </Text>
//           </View>

//           {/* Display Name */}
//           <View style={styles.fieldBlock}>
//             <Text style={styles.label}>Display Name</Text>
//             <TextInput
//               value={displayName}
//               onChangeText={setDisplayName}
//               placeholder="e.g., John D."
//               placeholderTextColor="#9fb1c1"
//               style={styles.input}
//               maxLength={60}
//               returnKeyType="done"
//             />
//           </View>

//           {/* Favorite Verse */}
//           <View style={styles.fieldInline}>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.label}>Favorite Verse (Reference)</Text>
//               <TextInput
//                 value={verseRef}
//                 onChangeText={setVerseRef}
//                 placeholder="e.g., John 3:16"
//                 placeholderTextColor="#9fb1c1"
//                 style={styles.input}
//                 maxLength={60}
//                 returnKeyType="next"
//               />
//             </View>
//           </View>

//           <View style={styles.fieldBlock}>
//             <Text style={styles.label}>Favorite Verse (Text)</Text>
//             <TextInput
//               value={verseText}
//               onChangeText={setVerseText}
//               placeholder="Enter the verse text"
//               placeholderTextColor="#9fb1c1"
//               style={[styles.input, styles.multiline]}
//               multiline
//               textAlignVertical="top"
//               maxLength={500}
//             />
//           </View>

//           <TouchableOpacity
//             onPress={onSave}
//             activeOpacity={0.9}
//             disabled={saving}
//             style={[styles.saveBtn, saving && { opacity: 0.6 }]}
//           >
//             {saving ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons
//                   name="save-outline"
//                   size={18}
//                   color="#fff"
//                   style={{ marginRight: 8 }}
//                 />
//                 <Text style={styles.saveText}>Save Changes</Text>
//               </>
//             )}
//           </TouchableOpacity>

//           <View style={{ height: 18 }} />
//         </ScrollView>
//       )}
//     </Screen>
//   );
// }

// const styles = StyleSheet.create({
//   content: { paddingHorizontal: 16, paddingBottom: 24 },
//   title: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: Colors.button,
//     marginTop: 8,
//   },
//   subtitle: { color: Colors.text, marginTop: 4, marginBottom: 12 },

//   loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

//   errorBox: {
//     backgroundColor: '#ffe8e8',
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   errorText: { color: '#7a0000', flex: 1 },

//   fieldBlock: { marginTop: 12 },
//   fieldInline: { marginTop: 12, flexDirection: 'row', gap: 12 },

//   label: { marginBottom: 8, fontSize: 16, fontWeight: '800', color: '#1b2140' },
//   helpText: { marginTop: 6, color: Colors.text, fontSize: 13 },

//   input: {
//     backgroundColor: '#e9eef3',
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     height: 48,
//     color: Colors.button,
//     fontWeight: '700',
//     fontSize: 16,
//   },
//   multiline: {
//     height: 110,
//     paddingTop: 12,
//     lineHeight: 20,
//   },

//   idRow: {
//     backgroundColor: '#e9eef3',
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     height: 48,
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   idValue: {
//     fontSize: 16,
//     fontWeight: '800',
//     color: Colors.button,
//     letterSpacing: 1.2,
//   },

//   saveBtn: {
//     backgroundColor: Colors.button,
//     borderRadius: 14,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginTop: 16,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   saveText: { color: '#fff', fontWeight: '800' },
// });

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
import AsyncStorage from '@react-native-async-storage/async-storage';
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
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: uid,
          display_name: displayName.trim(),
          verse_ref: verseRef.trim(),
          verse_text: verseText.trim(),
        })
        .select();

      if (error) throw error;
      Alert.alert('Saved', 'Your profile has been updated.');
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
