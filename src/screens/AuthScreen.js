// src/screens/AuthScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import Screen from '../components/Screen';
import FloatingLabelInput from '../components/FloatingLabelInput';
import { Colors } from '../constants/colors';
import { supabase } from '../supabase';
import { ensureSessionAndProfile } from '../auth/bootstrap';
import { syncUserData } from '../logic/syncUserData';

export default function AuthScreen({ navigation }) {
  const [checkingSession, setCheckingSession] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);

  // On mount: if we already have a session, skip this screen
  useEffect(() => {
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // 🔹 Sync this user’s data into SQLite, then go into the app
          try {
            await syncUserData();
          } catch (e) {
            console.warn('AuthScreen: initial syncUserData failed', e);
          }

          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
          return;
        }
      } catch (e) {
        console.warn('AuthScreen: getUser error', e);
      } finally {
        setCheckingSession(false);
      }
    })();
  }, [navigation]);

  const onContinueGuest = async () => {
    setSubmitting(true);
    try {
      // This will create an anonymous session + profile row if needed
      await ensureSessionAndProfile();

      // 🔹 Pull down any user-specific data (if any) for this new anon user
      try {
        await syncUserData();
      } catch (e) {
        console.warn('AuthScreen: guest syncUserData failed', e);
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (e) {
      Alert.alert(
        'Guest error',
        e?.message || 'Failed to start a guest session. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onSignIn = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || password.length < 6) {
      Alert.alert(
        'Missing info',
        'Please enter your email and a password (at least 6 characters).'
      );
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        // Common helpful messages
        if (
          error.message.toLowerCase().includes('invalid login') ||
          error.message.toLowerCase().includes('invalid credentials')
        ) {
          Alert.alert('Sign-in failed', 'Email or password is incorrect.');
        } else if (
          error.message.toLowerCase().includes('email not confirmed')
        ) {
          Alert.alert(
            'Email not confirmed',
            'Please confirm your email first, then try signing in again.'
          );
        } else {
          Alert.alert('Sign-in error', error.message);
        }
        return;
      }

      const user = data?.user;
      if (!user) {
        Alert.alert('Sign-in error', 'No user returned. Please try again.');
        return;
      }

      // Make sure a profile row exists for this user (idempotent)
      try {
        await supabase
          .from('profiles')
          .upsert({ id: user.id }, { onConflict: 'id' });
      } catch (e) {
        console.warn('AuthScreen: upsert profile error', e);
      }

      // 🔹 Sync this user’s journal + quest status into SQLite
      try {
        await syncUserData();
      } catch (e) {
        console.warn('AuthScreen: sign-in syncUserData failed', e);
      }

      // Clear sensitive fields
      setPassword('');

      // Go into the app
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (e) {
      Alert.alert(
        'Sign-in error',
        e?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingSession) {
    return (
      <Screen>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.button} />
          <Text style={styles.loadingText}>Preparing your app…</Text>
        </View>
      </Screen>
    );
  }

  const disabled = submitting;

  return (
    <Screen dismissOnTap={false}>
      <View style={styles.content}>
        <Text style={styles.appTitle}>The Narrow Way</Text>
        <Text style={styles.subtitle}>
          Sign in to keep your progress across devices, or continue as a guest.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sign in with email</Text>

          <FloatingLabelInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={120}
          />

          <View style={{ height: 8 }} />

          <FloatingLabelInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            maxLength={128}
          />

          <TouchableOpacity
            onPress={onSignIn}
            disabled={disabled || !email.trim() || password.length < 6}
            activeOpacity={0.9}
            style={[
              styles.primaryBtn,
              (disabled || !email.trim() || password.length < 6) && {
                opacity: 0.6,
              },
            ]}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Sign in</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.smallHint}>
            New here? You can start as a guest and later create an account from
            your Profile screen.
          </Text>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerLabel}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          onPress={onContinueGuest}
          disabled={disabled}
          activeOpacity={0.9}
          style={[
            styles.guestBtn,
            disabled && {
              opacity: 0.6,
            },
          ]}
        >
          {submitting ? (
            <ActivityIndicator color={Colors.button} />
          ) : (
            <Text style={styles.guestBtnText}>Continue as guest</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.guestNote}>
          Guest mode uses a private, anonymous ID on this device. If you delete
          the app or change phones, your data may be lost unless you create an
          account later.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 8,
    color: Colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: Platform.OS === 'android' ? 24 : 16,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.button,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    color: Colors.text,
    fontSize: 14,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#374151',
  },
  sectionTitle: {
    color: '#F9FAFB',
    fontWeight: '800',
    marginBottom: 10,
    fontSize: 16,
  },
  primaryBtn: {
    marginTop: 14,
    backgroundColor: Colors.button,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  smallHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#9CA3AF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 12,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#4B5563',
  },
  dividerLabel: {
    marginHorizontal: 8,
    color: '#9CA3AF',
    fontSize: 12,
  },
  guestBtn: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.button,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  guestBtnText: {
    color: Colors.button,
    fontWeight: '800',
    fontSize: 15,
  },
  guestNote: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.text,
  },
});
