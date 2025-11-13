// // // src/screens/ProfileScreen.js
// // import React, { useEffect, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   Alert,
// // } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import Screen from '../components/Screen';
// // import FloatingLabelInput from '../components/FloatingLabelInput';
// // import { Colors } from '../constants/colors';
// // import { supabase } from '../supabase';

// // // Converts UUID → short, human-friendly base36 ID (kept from your file)
// // function shortCodeFromUid(uid) {
// //   try {
// //     const hex = (uid || '').replace(/[^a-f0-9]/gi, '');
// //     const chunk = hex.slice(0, 10) || '0000000000';
// //     const num = parseInt(chunk, 16);
// //     return num.toString(36).toUpperCase().slice(0, 9);
// //   } catch {
// //     return uid.slice(0, 9).toUpperCase();
// //   }
// // }

// // export default function ProfileScreen({ navigation }) {
// //   const [uid, setUid] = useState('');
// //   const [shortId, setShortId] = useState('');
// //   const [displayName, setDisplayName] = useState('');
// //   const [verseRef, setVerseRef] = useState('');
// //   const [verseText, setVerseText] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [finding, setFinding] = useState(false);
// //   const [findError, setFindError] = useState('');
// //   const [lastLookup, setLastLookup] = useState({ ref: '', text: '' });

// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const {
// //           data: { user },
// //           error: authError,
// //         } = await supabase.auth.getUser();
// //         if (authError || !user) {
// //           setLoading(false);
// //           return;
// //         }
// //         const myId = user.id;
// //         setUid(myId);
// //         setShortId(shortCodeFromUid(myId));

// //         const { data, error } = await supabase
// //           .from('profiles')
// //           .select('display_name, verse_ref, verse_text')
// //           .eq('id', myId)
// //           .single();

// //         if (!error && data) {
// //           setDisplayName(data.display_name || '');
// //           setVerseRef(data.verse_ref || '');
// //           setVerseText(data.verse_text || '');
// //         } else if (error && error.code === 'PGRST116') {
// //           await supabase.from('profiles').insert({
// //             id: myId,
// //             display_name: '',
// //             verse_ref: '',
// //             verse_text: '',
// //           });
// //         }
// //       } catch (e) {
// //         console.error('Profile load error:', e);
// //       } finally {
// //         setLoading(false);
// //       }
// //     })();
// //   }, []);

// //   const onSave = async () => {
// //     setSaving(true);
// //     try {
// //       const clean = (s) => (s && s.trim().length ? s.trim() : null);

// //       const { error } = await supabase
// //         .from('profiles')
// //         .upsert(
// //           {
// //             id: uid,
// //             display_name: clean(displayName),
// //             verse_ref: clean(verseRef),
// //             verse_text: clean(verseText),
// //           },
// //           { onConflict: 'id' }
// //         )
// //         .select();

// //       if (error) throw error;

// //       Alert.alert('Saved', 'Your profile has been updated.');

// //       // ✅ Navigate to the Home *tab* within MainTabs and pass the same params
// //       const toRoute = (s) => (s && s.trim().length ? s.trim() : '');
// //       navigation.navigate('MainTabs', {
// //         screen: 'Home',
// //         params: {
// //           verseRef: toRoute(verseRef),
// //           verseText: toRoute(verseText),
// //           refreshAt: Date.now(),
// //         },
// //       });
// //     } catch (e) {
// //       Alert.alert('Error', e.message || 'Failed to save.');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const onFindVerse = async () => {
// //     // your existing verse lookup logic (unchanged)
// //     setFindError('Not implemented here to keep this drop-in focused.');
// //   };

// //   if (loading) {
// //     return (
// //       <Screen showBack onBack={() => navigation.goBack()}>
// //         <View style={styles.loadingWrap}>
// //           <ActivityIndicator size="large" color={Colors.button} />
// //           <Text style={{ color: Colors.text, marginTop: 8 }}>
// //             Loading profile…
// //           </Text>
// //         </View>
// //       </Screen>
// //     );
// //   }

// //   return (
// //     <Screen showBack onBack={() => navigation.goBack()}>
// //       <ScrollView contentContainerStyle={styles.content}>
// //         <Text style={styles.title}>Profile</Text>

// //         {/* Unique ID (read-only) */}
// //         <View style={styles.fieldBlock}>
// //           <Text style={styles.label}>Your User ID (share with friends)</Text>
// //           <View style={styles.idRow}>
// //             <Text style={styles.idValue}>{shortId || '—'}</Text>
// //           </View>
// //           <Text style={styles.helpText}>
// //             Friends can find you using this ID.
// //           </Text>
// //         </View>

// //         {/* Display Name */}
// //         <View style={styles.fieldBlock}>
// //           <FloatingLabelInput
// //             label="Display Name"
// //             value={displayName}
// //             onChangeText={setDisplayName}
// //             maxLength={60}
// //           />
// //         </View>

// //         {/* Favorite Verse (Reference) */}
// //         <View style={styles.fieldBlock}>
// //           <FloatingLabelInput
// //             label="Favorite Verse (Reference)"
// //             value={verseRef}
// //             onChangeText={setVerseRef}
// //             maxLength={60}
// //           />
// //         </View>

// //         {/* Favorite Verse (Text) */}
// //         <View style={styles.fieldBlock}>
// //           <FloatingLabelInput
// //             label="Favorite Verse (Text)"
// //             value={verseText}
// //             onChangeText={setVerseText}
// //             multiline
// //             maxLength={500}
// //           />
// //         </View>

// //         <TouchableOpacity
// //           onPress={onSave}
// //           activeOpacity={0.9}
// //           disabled={saving}
// //           style={[styles.saveBtn, saving && { opacity: 0.6 }]}
// //         >
// //           {saving ? (
// //             <ActivityIndicator color="#fff" />
// //           ) : (
// //             <>
// //               <Ionicons
// //                 name="save-outline"
// //                 size={18}
// //                 color="#fff"
// //                 style={{ marginRight: 8 }}
// //               />
// //               <Text style={styles.saveText}>Save Changes</Text>
// //             </>
// //           )}
// //         </TouchableOpacity>
// //       </ScrollView>
// //     </Screen>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 17 },
// //   title: {
// //     fontSize: 32,
// //     fontWeight: '800',
// //     color: Colors.button,
// //     marginBottom: 8,
// //   },
// //   fieldBlock: { marginTop: 12 },
// //   label: { marginBottom: 8, fontSize: 16, fontWeight: '800', color: '#1b2140' },
// //   idRow: {
// //     backgroundColor: '#e9eef3',
// //     borderRadius: 12,
// //     paddingHorizontal: 14,
// //     height: 48,
// //     alignItems: 'center',
// //     flexDirection: 'row',
// //   },
// //   idValue: { fontSize: 16, fontWeight: '800', color: Colors.button },
// //   helpText: { color: Colors.text, marginTop: 4 },
// //   saveBtn: {
// //     backgroundColor: Colors.button,
// //     borderRadius: 14,
// //     paddingVertical: 14,
// //     alignItems: 'center',
// //     marginTop: 16,
// //     opacity: 0.85,
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //   },
// //   saveText: { color: '#fff', fontWeight: '800' },
// //   loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
// // });

// // src/screens/ProfileScreen.js
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import Screen from '../components/Screen';
// import { Colors } from '../constants/colors';
// import { supabase } from '../supabase';
// import FloatingLabelInput from '../components/FloatingLabelInput';
// import { fetchESV } from '../utils/bible';

// // Fallback: converts UUID → short, human-friendly base36 ID
// function shortCodeFromUid(uid) {
//   try {
//     const hex = (uid || '').replace(/[^a-f0-9]/gi, '');
//     const chunk = hex.slice(0, 10) || '0000000000';
//     const num = parseInt(chunk, 16);
//     return num.toString(36).toUpperCase().slice(0, 9);
//   } catch {
//     return (uid || '').slice(0, 9).toUpperCase();
//   }
// }

// export default function ProfileScreen({ navigation }) {
//   const [uid, setUid] = useState('');
//   const [shortId, setShortId] = useState(''); // ← prefer DB (profiles.short_id), fallback to derived
//   const [displayName, setDisplayName] = useState('');
//   const [verseRef, setVerseRef] = useState('');
//   const [verseText, setVerseText] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [finding, setFinding] = useState(false);
//   const [findError, setFindError] = useState('');
//   const [lastLookup, setLastLookup] = useState({ ref: '', text: '' });

//   useEffect(() => {
//     (async () => {
//       try {
//         const {
//           data: { user },
//           error: authError,
//         } = await supabase.auth.getUser();

//         if (authError || !user) {
//           console.warn(
//             'No active auth session. Ensure anonymous sign-in is running at app start.'
//           );
//           setLoading(false);
//           return;
//         }

//         const myId = user.id;
//         setUid(myId);

//         // Try to fetch profile (including short_id)
//         let { data, error } = await supabase
//           .from('profiles')
//           .select('display_name, verse_ref, verse_text, short_id')
//           .eq('id', myId)
//           .single();

//         if (error && error.code === 'PGRST116') {
//           // No row yet — create minimal row, then reselect to get short_id if generated by DB
//           const { data: inserted, error: insErr } = await supabase
//             .from('profiles')
//             .insert({
//               id: myId,
//               display_name: '',
//               verse_ref: '',
//               verse_text: '',
//             })
//             .select('display_name, verse_ref, verse_text, short_id')
//             .single();
//           if (insErr) throw insErr;
//           data = inserted;
//         } else if (error) {
//           throw error;
//         }

//         setDisplayName(data?.display_name || '');
//         setVerseRef(data?.verse_ref || '');
//         setVerseText(data?.verse_text || '');

//         // Prefer DB short_id; otherwise derive one so user always sees something usable
//         setShortId(data?.short_id || shortCodeFromUid(myId));
//       } catch (e) {
//         console.error('Profile load error:', e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const onSave = async () => {
//     setSaving(true);
//     try {
//       const clean = (s) => (s && s.trim().length ? s.trim() : null);

//       const { error } = await supabase
//         .from('profiles')
//         .upsert(
//           {
//             id: uid, // PK
//             display_name: clean(displayName),
//             verse_ref: clean(verseRef),
//             verse_text: clean(verseText),
//           },
//           { onConflict: 'id' }
//         )
//         .select();

//       if (error) throw error;

//       Alert.alert('Saved', 'Your profile has been updated.');

//       // Navigate like the diff: ensure we land on Home tab inside MainTabs with params
//       const toRoute = (s) => (s && s.trim().length ? s.trim() : '');
//       navigation.navigate('MainTabs', {
//         screen: 'Home',
//         params: {
//           verseRef: toRoute(verseRef),
//           verseText: toRoute(verseText),
//           refreshAt: Date.now(),
//         },
//       });
//     } catch (e) {
//       Alert.alert('Error', e.message || 'Failed to save.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const onFindVerse = async () => {
//     const ref = (verseRef || '').trim();
//     if (!ref) {
//       setFindError('Enter a verse reference (e.g., John 3:16)');
//       return;
//     }

//     if (lastLookup.ref === ref && lastLookup.text) {
//       setVerseText(lastLookup.text);
//       setFindError('');
//       return;
//     }

//     try {
//       setFinding(true);
//       setFindError('');
//       const text = await fetchESV(ref);
//       setVerseText(text);
//       setLastLookup({ ref, text });
//     } catch (e) {
//       setFindError(e?.message || 'Lookup failed.');
//     } finally {
//       setFinding(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Screen showBack onBack={() => navigation.goBack()}>
//         <View style={styles.loadingWrap}>
//           <ActivityIndicator size="large" color={Colors.button} />
//           <Text style={{ color: Colors.text, marginTop: 8 }}>
//             Loading profile…
//           </Text>
//         </View>
//       </Screen>
//     );
//   }

//   return (
//     <Screen showBack onBack={() => navigation.goBack()}>
//       <ScrollView contentContainerStyle={styles.content}>
//         <Text style={styles.title}>Profile</Text>

//         {/* Unique ID (read-only, from profiles.short_id or fallback) */}
//         <View style={styles.fieldBlock}>
//           <Text style={styles.label}>Your User ID (share with friends)</Text>
//           <View style={styles.idRow}>
//             <Text style={styles.idValue}>{shortId || '—'}</Text>
//           </View>
//           <Text style={styles.helpText}>
//             Friends can find you using this ID.
//           </Text>
//         </View>

//         {/* Display Name */}
//         <View style={styles.fieldBlock}>
//           <FloatingLabelInput
//             label="Display Name"
//             value={displayName}
//             onChangeText={setDisplayName}
//             maxLength={60}
//           />
//         </View>

//         {/* Favorite Verse (Reference) */}
//         <View style={styles.fieldBlock}>
//           <FloatingLabelInput
//             label="Favorite Verse (Reference)"
//             value={verseRef}
//             onChangeText={setVerseRef}
//             maxLength={60}
//           />
//         </View>

//         {/* Find Verse row */}
//         <View
//           style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}
//         >
//           <TouchableOpacity
//             onPress={onFindVerse}
//             disabled={finding || !verseRef.trim()}
//             activeOpacity={0.9}
//             style={[
//               styles.findBtn,
//               (finding || !verseRef.trim()) && { opacity: 0.6 },
//             ]}
//           >
//             {finding ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.findBtnText}>Find Verse</Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => {
//               setVerseRef('');
//               setVerseText('');
//               setFindError('');
//             }}
//             style={{
//               marginLeft: 12,
//               paddingVertical: 10,
//               paddingHorizontal: 12,
//             }}
//           >
//             <Text style={styles.clearBtn}>Clear</Text>
//           </TouchableOpacity>
//         </View>

//         {!!findError && (
//           <Text style={{ color: '#a30000', marginTop: 6 }}>{findError}</Text>
//         )}

//         {/* Favorite Verse (Text) */}
//         <View style={styles.fieldBlock}>
//           <FloatingLabelInput
//             label="Favorite Verse (Text)"
//             value={verseText}
//             onChangeText={setVerseText}
//             multiline
//             autoGrow
//             minLines={3}
//             maxLines={20}
//             editable
//             inputStyle={{ textAlignVertical: 'top' }}
//             maxLength={8000}
//           />
//         </View>

//         <TouchableOpacity
//           onPress={onSave}
//           activeOpacity={0.9}
//           disabled={saving}
//           style={[styles.saveBtn, saving && { opacity: 0.6 }]}
//         >
//           {saving ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <>
//               <Ionicons
//                 name="save-outline"
//                 size={18}
//                 color="#fff"
//                 style={{ marginRight: 8 }}
//               />
//               <Text style={styles.saveText}>Save Changes</Text>
//             </>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </Screen>
//   );
// }

// const styles = StyleSheet.create({
//   content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 17 },
//   title: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: Colors.button,
//     marginBottom: 8,
//   },
//   fieldBlock: { marginTop: 12 },
//   label: { marginBottom: 8, fontSize: 16, fontWeight: '800', color: '#1b2140' },
//   idRow: {
//     backgroundColor: '#e9eef3',
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     height: 48,
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   idValue: { fontSize: 16, fontWeight: '800', color: Colors.button },
//   helpText: { marginTop: 6, color: Colors.text, fontSize: 13 },
//   saveBtn: {
//     backgroundColor: Colors.button,
//     borderRadius: 14,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginTop: 16,
//     opacity: 0.85,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   saveText: { color: '#fff', fontWeight: '800' },
//   loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   findBtn: {
//     backgroundColor: Colors.button,
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   findBtnText: { color: '#fff', fontWeight: '800', opacity: 0.95 },
//   clearBtn: {
//     backgroundColor: '#fff',
//     fontWeight: '800',
//     borderRadius: 12,
//     opacity: 0.7,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//   },
// });

// src/screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
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
import { Colors } from '../constants/colors';
import { supabase } from '../supabase';
import FloatingLabelInput from '../components/FloatingLabelInput';
import { fetchESV } from '../utils/bible';

// Fallback: converts UUID → short, human-friendly base36 ID
function shortCodeFromUid(uid) {
  try {
    const hex = (uid || '').replace(/[^a-f0-9]/gi, '');
    const chunk = hex.slice(0, 10) || '0000000000';
    const num = parseInt(chunk, 16);
    return num.toString(36).toUpperCase().slice(0, 9);
  } catch {
    return (uid || '').slice(0, 9).toUpperCase();
  }
}

export default function ProfileScreen({ navigation }) {
  const [uid, setUid] = useState('');
  const [shortId, setShortId] = useState(''); // ← prefer DB (profiles.short_id), fallback to derived
  const [displayName, setDisplayName] = useState('');
  const [verseRef, setVerseRef] = useState('');
  const [verseText, setVerseText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [finding, setFinding] = useState(false);
  const [findError, setFindError] = useState('');
  const [lastLookup, setLastLookup] = useState({ ref: '', text: '' });

  useEffect(() => {
    (async () => {
      try {
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

        const myId = user.id;
        setUid(myId);

        // Try to fetch profile (including short_id)
        let { data, error } = await supabase
          .from('profiles')
          .select('display_name, verse_ref, verse_text, short_id')
          .eq('id', myId)
          .single();

        if (error && error.code === 'PGRST116') {
          // No row yet — create minimal row, then reselect to get short_id if generated by DB
          const { data: inserted, error: insErr } = await supabase
            .from('profiles')
            .insert({
              id: myId,
              display_name: '',
              verse_ref: '',
              verse_text: '',
            })
            .select('display_name, verse_ref, verse_text, short_id')
            .single();
          if (insErr) throw insErr;
          data = inserted;
        } else if (error) {
          throw error;
        }

        setDisplayName(data?.display_name || '');
        setVerseRef(data?.verse_ref || '');
        setVerseText(data?.verse_text || '');

        // Prefer DB short_id; otherwise derive one so user always sees something usable
        setShortId(data?.short_id || shortCodeFromUid(myId));
      } catch (e) {
        console.error('Profile load error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSave = async () => {
    // Enforce: if a verseRef is present, verseText must come from a successful lookup
    const ref = (verseRef || '').trim();
    const fromLookup =
      !!ref &&
      !!verseText &&
      lastLookup.ref === ref &&
      lastLookup.text === verseText;

    if (ref && !fromLookup) {
      Alert.alert(
        'Find Verse Required',
        'Please use the “Find Verse” button to fetch the verse text for this reference before saving.'
      );
      return;
    }

    setSaving(true);
    try {
      const clean = (s) => (s && s.trim().length ? s.trim() : null);

      const { error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: uid, // PK
            display_name: clean(displayName),
            verse_ref: clean(verseRef),
            verse_text: clean(verseText),
          },
          { onConflict: 'id' }
        )
        .select();

      if (error) throw error;

      Alert.alert('Saved', 'Your profile has been updated.');

      // Navigate like the diff: ensure we land on Home tab inside MainTabs with params
      const toRoute = (s) => (s && s.trim().length ? s.trim() : '');
      navigation.navigate('MainTabs', {
        screen: 'Home',
        params: {
          verseRef: toRoute(verseRef),
          verseText: toRoute(verseText),
          refreshAt: Date.now(),
        },
      });
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const onFindVerse = async () => {
    const ref = (verseRef || '').trim();
    if (!ref) {
      setFindError('Enter a verse reference (e.g., John 3:16)');
      return;
    }

    if (lastLookup.ref === ref && lastLookup.text) {
      setVerseText(lastLookup.text);
      setFindError('');
      return;
    }

    try {
      setFinding(true);
      setFindError('');
      const text = await fetchESV(ref);
      setVerseText(text);
      setLastLookup({ ref, text });
    } catch (e) {
      setFindError(e?.message || 'Lookup failed.');
    } finally {
      setFinding(false);
    }
  };

  // UX: Disable Save unless either
  //  - user is only changing display name, OR
  //  - a verseRef is present and verseText matches latest lookup for that ref
  const canSave =
    !saving &&
    // something changed / present
    (!!displayName.trim() || !!verseRef.trim() || !!verseText.trim()) &&
    // allow saving display name only (no verse fields touched)
    ((!verseRef.trim() && !verseText.trim()) ||
      // if verseRef exists, require a matching lookup
      (lastLookup.ref === (verseRef || '').trim() &&
        lastLookup.text === verseText));

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

        {/* Unique ID (read-only, from profiles.short_id or fallback) */}
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
          <FloatingLabelInput
            label="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            maxLength={60}
          />
        </View>

        {/* Favorite Verse (Reference) */}
        <View style={styles.fieldBlock}>
          <FloatingLabelInput
            label="Favorite Verse (Reference)"
            value={verseRef}
            onChangeText={(v) => {
              // When ref changes, clear the text and last lookup to prevent stale saves
              setVerseRef(v);
              setVerseText('');
              setLastLookup({ ref: '', text: '' });
            }}
            maxLength={60}
          />
        </View>

        {/* Find Verse row */}
        <View
          style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}
        >
          <TouchableOpacity
            onPress={onFindVerse}
            disabled={finding || !verseRef.trim()}
            activeOpacity={0.9}
            style={[
              styles.findBtn,
              (finding || !verseRef.trim()) && { opacity: 0.6 },
            ]}
          >
            {finding ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.findBtnText}>Find Verse</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setVerseRef('');
              setVerseText('');
              setFindError('');
              setLastLookup({ ref: '', text: '' });
            }}
            style={{
              marginLeft: 12,
              paddingVertical: 10,
              paddingHorizontal: 12,
            }}
          >
            <Text style={styles.clearBtn}>Clear</Text>
          </TouchableOpacity>
        </View>

        {!!findError && (
          <Text style={{ color: '#a30000', marginTop: 6 }}>{findError}</Text>
        )}

        {/* Favorite Verse (Text) — read-only, must be filled via Find Verse */}
        <View style={styles.fieldBlock}>
          <FloatingLabelInput
            label="Favorite Verse (Text)"
            value={verseText}
            // Read-only: users must use "Find Verse"
            editable={false}
            multiline
            autoGrow
            minLines={3}
            maxLines={20}
            inputStyle={{ textAlignVertical: 'top', opacity: 0.9 }}
            maxLength={8000}
          />
          <Text style={styles.helpText}>
            Use “Find Verse” to fill this text. You can’t edit it manually.
          </Text>
        </View>

        <TouchableOpacity
          onPress={onSave}
          activeOpacity={0.9}
          disabled={!canSave}
          style={[styles.saveBtn, (!canSave || saving) && { opacity: 0.6 }]}
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
  fieldBlock: { marginTop: 12 },
  label: { marginBottom: 8, fontSize: 16, fontWeight: '800', color: '#1b2140' },
  idRow: {
    backgroundColor: '#e9eef3',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    alignItems: 'center',
    flexDirection: 'row',
  },
  idValue: { fontSize: 16, fontWeight: '800', color: Colors.button },
  helpText: { marginTop: 6, color: Colors.text, fontSize: 13 },
  saveBtn: {
    backgroundColor: Colors.button,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    opacity: 0.85,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveText: { color: '#fff', fontWeight: '800' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  findBtn: {
    backgroundColor: Colors.button,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  findBtnText: { color: '#fff', fontWeight: '800', opacity: 0.95 },
  clearBtn: {
    backgroundColor: '#fff',
    fontWeight: '800',
    borderRadius: 12,
    opacity: 0.7,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});
