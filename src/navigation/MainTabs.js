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

        sceneContainerStyle: {
          backgroundColor: Colors.background,
        },

        tabBarActiveTintColor: '#b1c63dff',
        tabBarInactiveTintColor: '#475569',

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
            Journal: 'document-text-outline', // ← valid Ionicon
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
        options={{ tabBarLabel: 'Home' }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            // Always take the Home stack back to its root
            navigation.navigate('Home', { screen: 'HomeMain' });
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
          // icon handled in screenOptions above
        }}
      />

      <Tab.Screen
        name="Friends"
        component={FriendsStackScreen}
        options={{
          title: 'Friends',
          unmountOnBlur: false,
        }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Friends', { screen: 'FriendsList' });
          },
        })}
      />
    </Tab.Navigator>
  );
}
