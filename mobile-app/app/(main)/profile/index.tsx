import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  User,
  ChevronRight,
  Bell,
  Shield,
  Globe,
  HelpCircle,
  LogOut,
  Heart,
  FileText,
  AlertCircle,
  Settings,
  Moon,
} from 'lucide-react-native';
import { PageHeader, Card } from '../../../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../../../constants/theme';
import { useUserStore, useAppStore } from '../../../stores';

const menuSections = [
  {
    title: 'Health',
    items: [
      { id: 'health-dashboard', label: 'Health Dashboard', icon: Heart, color: Colors.error },
      { id: 'medical-history', label: 'Medical History', icon: FileText, color: Colors.primary[500] },
      { id: 'emergency', label: 'Emergency Contacts', icon: AlertCircle, color: Colors.warning },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 'notifications', label: 'Notifications', icon: Bell, color: Colors.primary[500] },
      { id: 'language', label: 'Language', icon: Globe, color: Colors.accent[500], value: 'English' },
      { id: 'dark-mode', label: 'Dark Mode', icon: Moon, color: '#8B5CF6', toggle: true },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'privacy', label: 'Privacy & Security', icon: Shield, color: Colors.success },
      { id: 'help', label: 'Help & Support', icon: HelpCircle, color: Colors.info },
      { id: 'settings', label: 'App Settings', icon: Settings, color: Colors.dark.textSecondary },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const { isDarkMode, toggleDarkMode } = useAppStore();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const handleMenuPress = (id: string) => {
    switch (id) {
      case 'health-dashboard':
        // This route is hidden from tabs but accessible via push
        router.push('/(main)/health-dashboard');
        break;
      case 'medical-history':
        router.push('/(main)/documents');
        break;
      case 'emergency':
        alert('Emergency Contacts coming in Phase 2');
        break;
      case 'notifications':
        alert('Notification Settings coming in Phase 2');
        break;
      case 'language':
        alert('Language Selection coming in Phase 2');
        break;
      case 'privacy':
        alert('Privacy Settings coming in Phase 2');
        break;
      case 'help':
        alert('Help & Support coming in Phase 2');
        break;
      case 'settings':
        alert('App Settings coming in Phase 2');
        break;
      case 'dark-mode':
        toggleDarkMode();
        break;
      default:
        console.log('Unknown menu item:', id);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={[Colors.primary[500] + '30', Colors.primary[600] + '10']}
            style={styles.profileGradient}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={40} color={Colors.dark.textMuted} />
              </View>
              <Pressable style={styles.editAvatarButton}>
                <Text style={styles.editAvatarText}>Edit</Text>
              </Pressable>
            </View>
            <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'guest@medassist.com'}</Text>
            
            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Visits</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>8</Text>
                <Text style={styles.statLabel}>Reports</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>85</Text>
                <Text style={styles.statLabel}>Health Score</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card variant="elevated" style={styles.menuCard}>
              {section.items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <Pressable
                    style={styles.menuItem}
                    onPress={() => handleMenuPress(item.id)}
                  >
                    <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                      <item.icon size={20} color={item.color} />
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    {'value' in item && item.value && (
                      <Text style={styles.menuValue}>{item.value}</Text>
                    )}
                    {'toggle' in item && item.toggle ? (
                      <View style={[styles.toggle, isDarkMode && styles.toggleActive]}>
                        <View style={[styles.toggleKnob, isDarkMode && styles.toggleKnobActive]} />
                      </View>
                    ) : (
                      <ChevronRight size={20} color={Colors.dark.textMuted} />
                    )}
                  </Pressable>
                  {index < section.items.length - 1 && <View style={styles.menuDivider} />}
                </React.Fragment>
              ))}
            </Card>
          </View>
        ))}

        {/* Logout Button */}
        <Card variant="elevated" style={styles.logoutCard}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </Card>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>MedAssist v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 MedAssist. All rights reserved.</Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  profileHeader: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    marginBottom: Spacing.xl,
  },
  profileGradient: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.base,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primary[500],
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  editAvatarText: {
    fontSize: Typography.fontSize.xs,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  userName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    width: '100%',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.dark.border,
  },
  menuSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.dark.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  menuValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textMuted,
    marginRight: Spacing.sm,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginLeft: 60,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.dark.border,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: Colors.primary[500],
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  toggleKnobActive: {
    transform: [{ translateX: 20 }],
  },
  logoutCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    padding: 0,
    overflow: 'hidden',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  logoutText: {
    fontSize: Typography.fontSize.base,
    color: Colors.error,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  appVersion: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textMuted,
  },
  appCopyright: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
    marginTop: 4,
  },
  bottomSpacing: {
    height: 40,
  },
});
