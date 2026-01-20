import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import {
  Home,
  FileText,
  Mic,
  Calendar,
  User,
} from 'lucide-react-native';
import { Colors, Spacing } from '../../constants/theme';
import { BlurView } from 'expo-blur';

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        ),
        tabBarActiveTintColor: Colors.primary[500],
        tabBarInactiveTintColor: Colors.dark.textMuted,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="symptom-check"
        options={{
          title: 'Check',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.centerTab, focused && styles.centerTabActive]}>
              <Mic size={24} color={focused ? '#FFFFFF' : Colors.dark.textMuted} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Visits',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="health-dashboard"
        options={{
          // Hide from tab bar
          href: null,
        }}
      />
      <Tabs.Screen
        name="medgemma-test"
        options={{
          // Hide from tab bar but accessible via navigation
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'rgba(10, 14, 26, 0.85)',
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    height: 85,
    paddingBottom: 20,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  centerTab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -28,
    borderWidth: 4,
    borderColor: Colors.dark.background,
  },
  centerTabActive: {
    backgroundColor: Colors.primary[500],
  },
});
