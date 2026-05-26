import 'react-native-url-polyfill/auto';
import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import DashboardScreen from './src/screens/DashboardScreen';
import SensoresScreen from './src/screens/SensoresScreen';
import EventosScreen from './src/screens/EventosScreen';
import AlertasScreen from './src/screens/AlertasScreen';

const Tab = createBottomTabNavigator();

const COLORS = {
  bg: '#0a0a1a',
  card: '#12122a',
  accent: '#4f8ef7',
  muted: '#64748b',
  text: '#e2e8f0',
  border: '#1e1e3f',
};

const TabIcon = ({ emoji, focused }: { emoji: string; focused: boolean }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
);

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.card, borderBottomColor: COLORS.border, borderBottomWidth: 1 },
          headerTitleStyle: { color: COLORS.text, fontWeight: 'bold' },
          tabBarStyle: { backgroundColor: COLORS.card, borderTopColor: COLORS.border, borderTopWidth: 1 },
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: COLORS.muted,
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: 'Missão',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🚀" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Sensores"
          component={SensoresScreen}
          options={{
            title: 'Sensores',
            tabBarIcon: ({ focused }) => <TabIcon emoji="📡" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Eventos"
          component={EventosScreen}
          options={{
            title: 'Eventos',
            tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Alertas"
          component={AlertasScreen}
          options={{
            title: 'Alertas',
            tabBarIcon: ({ focused }) => <TabIcon emoji="⚠️" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
