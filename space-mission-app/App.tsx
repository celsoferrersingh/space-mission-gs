import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

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

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: COLORS.card, borderBottomColor: COLORS.border, borderBottomWidth: 1 },
          headerTitleStyle: { color: COLORS.text, fontWeight: 'bold' },
          tabBarStyle: { backgroundColor: COLORS.card, borderTopColor: COLORS.border, borderTopWidth: 1 },
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: COLORS.muted,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';
            if (route.name === 'Dashboard') iconName = focused ? 'planet' : 'planet-outline';
            else if (route.name === 'Sensores') iconName = focused ? 'radio' : 'radio-outline';
            else if (route.name === 'Eventos') iconName = focused ? 'list' : 'list-outline';
            else if (route.name === 'Alertas') iconName = focused ? 'warning' : 'warning-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: '🚀 Missão' }}
        />
        <Tab.Screen
          name="Sensores"
          component={SensoresScreen}
          options={{ title: '📡 Sensores' }}
        />
        <Tab.Screen
          name="Eventos"
          component={EventosScreen}
          options={{ title: '📋 Eventos' }}
        />
        <Tab.Screen
          name="Alertas"
          component={AlertasScreen}
          options={{ title: '⚠️ Alertas' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
