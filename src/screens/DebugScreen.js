// src/screens/DebugScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Screen from '../components/Screen';
import { Colors } from '../constants/colors';
import { getLogLevel, setLogLevel, log, LOG_LEVELS } from '../utils/logger';
import { getString, setString } from '../storage/mmkv';

const LEVELS = ['silent', 'error', 'warn', 'info', 'debug', 'trace'];

export default function DebugScreen({ navigation }) {
  const [current, setCurrent] = useState(getLogLevel());

  useEffect(() => {
    setCurrent(getLogLevel());
  }, []);

  const onPick = (lvl) => {
    try {
      setLogLevel(lvl);
      setString?.('debug:logLevel', lvl);
      setCurrent(lvl);
      log('debug').info('Log level changed to:', lvl);
      Alert.alert('Logging', `Log level set to "${lvl}"`);
    } catch (e) {
      Alert.alert('Error', e?.message || String(e));
    }
  };

  return (
    <Screen showBack onBack={() => navigation.goBack()}>
      <View style={styles.wrap}>
        <Text style={styles.title}>Debug Settings</Text>
        <Text style={styles.sub}>Current level: {current}</Text>

        <View style={{ height: 12 }} />

        {LEVELS.map((lvl) => (
          <TouchableOpacity
            key={lvl}
            onPress={() => onPick(lvl)}
            style={[
              styles.levelBtn,
              current === lvl && { borderColor: Colors.button, borderWidth: 2 },
            ]}
            activeOpacity={0.9}
          >
            <Text
              style={[
                styles.levelText,
                current === lvl && { color: Colors.button, fontWeight: '900' },
              ]}
            >
              {lvl.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.button },
  sub: { marginTop: 6, color: Colors.text },
  levelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#e9eef3',
    marginBottom: 10,
  },
  levelText: { color: '#173f5f', fontWeight: '800' },
});
