// src/navigation/MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

import HomeScreen from '../screens/HomeScreen';
import PrayerListScreen from '../screens/PrayerListScreen';
import QuestScreen from '../screens/QuestScreen';
import JournalScreen from '../screens/JournalScreen';

import FriendsListScreen from '../screens/FriendsListScreen';
import MakeFriendsScreen from '../screens/MakeFriendsScreen';

import EncouragementScreen from '../screens/EncouragementScreen';
import ReceivedEncouragementsScreen from '../screens/ReceivedEncouragementsScreen';
import AnsweredPrayersScreen from '../screens/AnsweredPrayersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import DonationsScreen from '../screens/DonationsScreen';
import BibleScreen from '../screens/BibleScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const PrayerStack = createNativeStackNavigator();
const FriendsStack = createNativeStackNavigator();

// ----- Home tab stack -----
function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName="HomeMain"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'fade_from_bottom',
        gestureEnabled: true,
        fullScreenSwipeEnabled: true,
      }}
    >
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Encouragement" component={EncouragementScreen} />
      <HomeStack.Screen
        name="ReceivedEncouragements"
        component={ReceivedEncouragementsScreen}
      />
      <HomeStack.Screen
        name="AnsweredPrayers"
        component={AnsweredPrayersScreen}
      />
      <HomeStack.Screen name="Profile" component={ProfileScreen} />
      <HomeStack.Screen name="Bible" component={BibleScreen} />
      <HomeStack.Screen name="Resources" component={ResourcesScreen} />
      <HomeStack.Screen name="Donations" component={DonationsScreen} />
    </HomeStack.Navigator>
  );
}

// ----- Prayer tab stack -----
function PrayerStackScreen() {
  return (
    <PrayerStack.Navigator
      initialRouteName="PrayerListMain"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        presentation: 'modal',
        animation: 'slide_from_right',
        gestureEnabled: true,
        fullScreenSwipeEnabled: true,
      }}
    >
      <PrayerStack.Screen name="PrayerListMain" component={PrayerListScreen} />
      <PrayerStack.Screen
        name="AnsweredPrayers"
        component={AnsweredPrayersScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </PrayerStack.Navigator>
  );
}

// ----- Friends tab stack -----
function FriendsStackScreen() {
  return (
    <FriendsStack.Navigator
      initialRouteName="FriendsList"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
        gestureEnabled: true,
        fullScreenSwipeEnabled: true,
      }}
    >
      <FriendsStack.Screen name="FriendsList" component={FriendsListScreen} />
      <FriendsStack.Screen name="MakeFriends" component={MakeFriendsScreen} />
    </FriendsStack.Navigator>
  );
}

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,

        // scene itself just uses your app background
        sceneContainerStyle: {
          backgroundColor: Colors.background,
        },

        tabBarActiveTintColor: '#b1c63dff',
        tabBarInactiveTintColor: '#475569',

        // 🔹 Standard, non-floating tab bar
        tabBarStyle: {
          backgroundColor: Colors.button,
          borderTopWidth: 0,
          height: 58 + insets.bottom,
          paddingTop: 6,
          paddingBottom: 8 + insets.bottom,
        },

        tabBarLabelStyle: { fontWeight: '700', textAlign: 'center' },
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            Home: 'home-outline',
            Prayers: 'book-outline',
            Quest: 'flag-outline',
            Progress: 'stats-chart-outline',
            Friends: 'people-outline',
          };
          const name = iconMap[route.name] || 'ellipse-outline';
          return <Ionicons name={name} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Home',
          // whatever icon/options you already had
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // If we're already on Home tab and the stack is deep,
            // pop back to the root "HomeMain" screen.
            const state = route?.state;

            if (state && state.type === 'stack' && state.index > 0) {
              // Prevent the default behavior (which would just re-focus the tab)
              e.preventDefault();

              // Navigate to the root of the HomeStack
              navigation.navigate('Home', {
                screen: 'HomeMain',
              });
            }
            // If state is undefined (first load) or index === 0,
            // we let the default behavior happen.
          },
        })}
      />

      <Tab.Screen
        name="Prayers"
        component={PrayerStackScreen}
        options={{ tabBarLabel: 'Prayers' }}
      />
      <Tab.Screen name="Quest" component={QuestScreen} />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          title: 'Journal',
          // keep whatever icon config you had, or a new one, e.g.:
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="journal-outline" size={size} color={color} />
          ),
        }}
      />

      {/* <Tab.Screen name="Friends" component={FriendsStackScreen} /> */}
      <Tab.Screen
        name="Friends" // ← this is the tab route name
        component={FriendsStackScreen}
        options={{
          title: 'Friends',
          // tabBarIcon, etc. go here
          unmountOnBlur: false, // optional; leave as-is or tweak
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Make sure default behavior still runs
            // e.preventDefault(); // ← only use if you *don't* want the default

            // Always reset to FriendsList when the Friends tab is pressed
            navigation.navigate('Friends', {
              screen: 'FriendsList', // ← name inside FriendsStack.Navigator
            });
          },
        })}
      />
    </Tab.Navigator>
  );
}
