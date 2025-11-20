// root/App.js
import 'react-native-gesture-handler';
import React, { useState, useRef, useEffect } from 'react';
import { View, AppState, Pressable, Platform } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppHeader from './src/components/AppHeader';
import { Colors } from './src/constants/colors';

import MainTabs from './src/navigation/MainTabs';
import AuthScreen from './src/screens/AuthScreen';
import DebugScreen from './src/screens/DebugScreen'; // optional, dev/admin only

import SplashScreenView from './src/screens/SplashScreen';
import { syncUserData } from './src/logic/syncUserData';
import { syncContent } from './src/logic/syncContent';
import { seedBibleIfNeeded } from './src/logic/seedBible';

// Optional admin helper (don’t crash if it’s missing)
let isAdminCached = () => false;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  isAdminCached =
    require('./src/utils/adminGate').isAdminCached ?? (() => false);
} catch {
  /* keep default */
}

// If your auth/bootstrap has side-effects, import it as a side-effect:
try {
  // eslint-disable-next-line global-require
  require('./src/auth/bootstrap');
} catch {
  /* optional */
}

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

const AppTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Colors.background },
};

// ---- Secret hotspot overlay (no inline screen component; uses navigationRef) ----
function SecretDebugHotspot() {
  const stateRef = useRef({ count: 0, timer: null });
  const allow = __DEV__ || isAdminCached();

  if (!allow) return null;

  const onTap = () => {
    clearTimeout(stateRef.current.timer);
    stateRef.current.count += 1;
    stateRef.current.timer = setTimeout(() => {
      stateRef.current.count = 0;
    }, 2000); // 5 taps within 2 seconds

    if (stateRef.current.count >= 5) {
      stateRef.current.count = 0;
      if (navigationRef.isReady()) {
        navigationRef.navigate('Debug');
      }
    }
  };

  return (
    <Pressable
      onPress={onTap}
      hitSlop={20}
      style={{
        position: 'absolute',
        right: 0,
        top: Platform.select({ ios: 8, android: 8 }),
        width: 44,
        height: 44,
        // while testing you can visualize it:
        // backgroundColor: 'rgba(255,0,0,0.08)',
      }}
    >
      {/* invisible tap target */}
      <View />
    </Pressable>
  );
}

// ✅ bootstrap: content only (your original behavior)
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
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', async (nextState) => {
      const prev = appState.current;
      appState.current = nextState;
      if (prev?.match(/background|inactive/) && nextState === 'active') {
        try {
          await syncUserData(); // throttled inside your sync logic
        } catch (e) {
          console.warn('[App] background syncUserData failed:', e);
        }
      }
    });
    return () => sub.remove();
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
          <NavigationContainer theme={AppTheme} ref={navigationRef}>
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

              {/* Debug screen: only mount for dev/admin so regular users can’t reach it */}
              {(__DEV__ || isAdminCached()) && (
                <Stack.Screen
                  name="Debug"
                  component={DebugScreen}
                  options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                    headerShown: true,
                    title: 'Debug',
                  }}
                />
              )}
            </Stack.Navigator>

            {/* Invisible, global, single overlay (NO extra navigator) */}
            <SecretDebugHotspot />
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
