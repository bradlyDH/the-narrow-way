// root/App.js
import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { View, AppState } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { seedBibleIfNeeded } from './src/logic/seedBible';

import AppHeader from './src/components/AppHeader';
import { Colors } from './src/constants/colors';
import MainTabs from './src/navigation/MainTabs';

import HomeScreen from './src/screens/HomeScreen';
import PrayerListScreen from './src/screens/PrayerListScreen';
import AnsweredPrayersScreen from './src/screens/AnsweredPrayersScreen';
import QuestScreen from './src/screens/QuestScreen';
import EncouragementScreen from './src/screens/EncouragementScreen';
import ReceivedEncouragementsScreen from './src/screens/ReceivedEncouragementsScreen';
import MakeFriendsScreen from './src/screens/MakeFriendsScreen';
import FriendsListScreen from './src/screens/FriendsListScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DonationsScreen from './src/screens/DonationsScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';
import BibleScreen from './src/screens/BibleScreen';

import { supabase } from './src/supabase';
import SplashScreenView from './src/screens/SplashScreen';
import { syncUserData } from './src/logic/syncUserData';
import { syncContent } from './src/logic/syncContent';
import AuthScreen from './src/screens/AuthScreen'; // 👈 NEW

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const AppTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Colors.background },
};

const defaultStackAnimation = 'slide_from_right';

// ---- Home tab nested stack (unchanged) ----
function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName="HomeMain"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: defaultStackAnimation,
        fullScreenSwipeEnabled: true,
        gestureEnabled: true,
      }}
    >
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen
        name="ReceivedEncouragements"
        component={ReceivedEncouragementsScreen}
      />
      <HomeStack.Screen name="Profile" component={ProfileScreen} />

      <HomeStack.Screen name="Resources" component={ResourcesScreen} />
      <HomeStack.Screen name="Donations" component={DonationsScreen} />
      <HomeStack.Screen
        name="AnsweredPrayers"
        component={AnsweredPrayersScreen}
      />
      <HomeStack.Screen
        name="Encouragement"
        component={EncouragementScreen}
        options={{ presentation: 'modal', animation: 'fade_from_bottom' }}
      />
      <HomeStack.Screen name="Bible" component={BibleScreen} />
    </HomeStack.Navigator>
  );
}

// ✅ bootstrap: content only
async function bootstrapApp() {
  try {
    await syncContent();
    await seedBibleIfNeeded();
    await syncUserData();
  } catch (e) {
    console.warn('Initial content sync failed:', e);
  }
}

export default function App() {
  const [ready, setReady] = useState(false);

  const appState = React.useRef(AppState.currentState);

  React.useEffect(() => {
    const sub = AppState.addEventListener('change', async (nextState) => {
      const prev = appState.current;
      appState.current = nextState;

      // When coming back from background/inactive → active, try a quiet sync
      if (prev.match(/background|inactive/) && nextState === 'active') {
        try {
          await syncUserData(); // your throttling will prevent spam
        } catch (e) {
          console.warn('[App] background syncUserData failed:', e);
        }
      }
    });

    return () => {
      sub.remove();
    };
  }, []);

  if (!ready) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View style={{ flex: 1 }}>
            <SplashScreenView
              load={bootstrapApp}
              onFinish={() => setReady(true)}
              animationMs={1800}
              minVisibleMs={900}
              maxWaitMs={8000}
            />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <NavigationContainer theme={AppTheme}>
            <Stack.Navigator
              initialRouteName="Auth"
              screenOptions={{
                headerShown: true,
                header: () => <AppHeader />,
                headerTransparent: true,
                contentStyle: { backgroundColor: Colors.background },
                animation: 'fade',
              }}
            >
              {/* Auth entry */}
              <Stack.Screen
                name="Auth"
                component={AuthScreen}
                options={{ headerShown: false }}
              />

              {/* Main app */}
              <Stack.Screen name="MainTabs" component={MainTabs} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
