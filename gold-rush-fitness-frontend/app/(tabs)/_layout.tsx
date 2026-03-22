// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';
import { AppDataProvider } from '../../context/AppDataContext';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      <Text style={styles.tabEmoji}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <AppDataProvider>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.inkBrown,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🪵" label="Trail" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="steps"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👢" label="Steps" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="❤️" label="Health" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏆" label="Rewards" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⛺" label="Settings" focused={focused} />
          ),
        }}
      />
    </Tabs>
    </AppDataProvider>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    gap: 2,
  },
  tabIconFocused: {},
  tabEmoji: {
    fontSize: 22,
  },
  tabLabel: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabLabelFocused: {
    color: Colors.trailGold,
    fontWeight: 'bold',
  },
});