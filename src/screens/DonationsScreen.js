import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import Screen from '../components/Screen';
import { Colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const ORGS = [
  {
    title: 'Kafunjo Project',
    sub: 'Supporting communities in Uganda',
    url: 'https://www.kafunjoprojectus.org/take-action',
  },
  {
    title: 'Hope Rising Haiti',
    sub: 'Bringing hope and resources to Haiti',
    url: 'https://www.hoperisinghaiti.org/',
  },
];

export default function DonationsScreen({ navigation }) {
  const [amount, setAmount] = useState('');

  const sanitize = (t) => {
    const cleaned = t.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    const dollars = parts[0] || '';
    const cents = parts[1] ? parts[1].slice(0, 2) : '';
    return cents.length ? `${dollars}.${cents}` : dollars;
  };
  const onChangeAmount = (t) => setAmount(sanitize(t));
  const donatePress = () => {
    if (!amount || Number(amount) <= 0) {
      Alert.alert('Enter an amount', 'Please enter a valid dollar amount.');
      return;
    }
    Alert.alert('Coming soon', 'Payment processing will be added later.');
  };
  const open = (url) => Linking.openURL(url).catch(() => {});

  return (
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Donations ❤️</Text>

        <Text style={styles.subtitle}>
          2 Corinthians 9:7 "each one must give as he has decided in his heart,
          not reluctantly or under compulsion, for God loves a cheerful giver"
        </Text>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            50% of ALL donations are given to charity
          </Text>
        </View>

        <Text style={styles.label}>Donation Amount</Text>
        <View style={styles.amountWrap}>
          <Text style={styles.dollar}>$</Text>
          <TextInput
            value={amount}
            onChangeText={onChangeAmount}
            keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
            placeholder="0.00"
            placeholderTextColor="#9fb1c1"
            style={styles.amountInput}
            maxLength={10}
          />
        </View>

        <Text style={[styles.label, { marginTop: 18 }]}>Payment Method</Text>

        <TouchableOpacity
          style={styles.payRow}
          activeOpacity={0.9}
          onPress={donatePress}
        >
          <Ionicons
            name="logo-google-playstore"
            size={18}
            color={Colors.button}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.payText}>Google Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.payRow}
          activeOpacity={0.9}
          onPress={donatePress}
        >
          <Ionicons
            name="logo-apple"
            size={18}
            color={Colors.button}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.payText}>Apple Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.payRow}
          activeOpacity={0.9}
          onPress={donatePress}
        >
          <Ionicons
            name="card-outline"
            size={20}
            color={Colors.button}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.payText}>Debit/Credit Card</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.donateBtn}
          activeOpacity={0.9}
          onPress={donatePress}
        >
          <Text style={styles.donateText}>Donate Now</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { marginTop: 14 }]}>
          Organizations To Give To
        </Text>

        {ORGS.map((o) => (
          <TouchableOpacity
            key={o.title}
            style={styles.orgCard}
            activeOpacity={0.9}
            onPress={() => open(o.url)}
          >
            <Text style={styles.orgTitle}>{o.title}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 4,
              }}
            >
              <Text style={styles.orgSub}>{o.sub}</Text>
              <Ionicons
                name="open-outline"
                size={18}
                color={Colors.sun}
                style={{ marginLeft: 8 }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.button,
    marginTop: 8,
  },
  subtitle: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    color: '#080630ff',
    marginTop: 8,
    lineHeight: 20,
    opacity: 0.7,
    fontSize: 18,
    fontWeight: '600',
  },
  notice: {
    backgroundColor: '#f5ee9e55',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 14,
  },
  noticeText: { color: '#2b2f44', fontWeight: '700', textAlign: 'center' },

  label: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '800',
    color: '#1b2140',
  },
  amountWrap: {
    backgroundColor: '#e9eef3',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
  },
  dollar: {
    color: Colors.button,
    fontWeight: '900',
    marginRight: 8,
    fontSize: 18,
  },
  amountInput: {
    flex: 1,
    color: Colors.button,
    fontWeight: '700',
    fontSize: 18,
    paddingVertical: 0,
  },

  payRow: {
    borderWidth: 2,
    borderColor: '#a6bbca',
    borderRadius: 14,
    opacity: 0.85,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  payText: { color: Colors.button, fontWeight: '800', fontSize: 16 },

  donateBtn: {
    backgroundColor: '#8f96ad',
    borderRadius: 14,
    opacity: 0.85,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  donateText: { color: '#fff', fontWeight: '800' },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1b2140',
    marginTop: 18,
    marginBottom: 8,
  },
  orgCard: {
    backgroundColor: '#1c7293',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    opacity: 0.85,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  orgTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  orgSub: { color: Colors.text, fontSize: 14 },
});
