import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from './src/constants/colors';
import HomeScreen from './src/screens/HomeScreen';
import PrayerListScreen from './src/screens/PrayerListScreen';
import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';
import QuestScreen from './src/screens/QuestScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import EncouragementScreen from './src/screens/EncouragementScreen';
import ReceivedEncouragementsScreen from './src/screens/ReceivedEncouragementsScreen';
import MakeFriendsScreen from './src/screens/MakeFriendsScreen';
import FriendsListScreen from './src/screens/FriendsListScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DonationsScreen from './src/screens/DonationsScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ensureSessionAndProfile } from './src/auth/bootstrap';
import { supabase } from './src/supabase';

// ✅ Run this immediately on app load
(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    await supabase.auth.signInAnonymously();
  }
})();

const Stack = createNativeStackNavigator();
const AppTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Colors.background },
};

export default function App() {
  // const [ready, setReady] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       await ensureSessionAndProfile();
  //     } finally {
  //       setReady(true);
  //     }
  //   })();
  // }, []);

  // if (!ready) {
  //   return (
  //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //       <ActivityIndicator />
  //     </View>
  //   );
  // }
  // const [ready, setReady] = useState(false);
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       await ensureSessionAndProfile();
  //     } finally {
  //       setReady(true);
  //     }
  //   })();
  // }, []);
  // if (!ready)
  //   return (
  //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //       <ActivityIndicator />
  //     </View>
  //   );

  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await ensureSessionAndProfile();
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={AppTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false, // hide native header so our custom banner is the only one
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PrayerList" component={PrayerListScreen} />
          <Stack.Screen
            name="AnsweredPrayers"
            component={AnsweredPrayersScreen}
          />
          <Stack.Screen name="Quest" component={QuestScreen} />
          <Stack.Screen name="Progress" component={ProgressScreen} />
          <Stack.Screen name="Encouragement" component={EncouragementScreen} />
          <Stack.Screen
            name="ReceivedEncouragements"
            component={ReceivedEncouragementsScreen}
          />
          <Stack.Screen name="MakeFriends" component={MakeFriendsScreen} />
          <Stack.Screen name="FriendsList" component={FriendsListScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Donations" component={DonationsScreen} />
          <Stack.Screen name="Resources" component={ResourcesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
