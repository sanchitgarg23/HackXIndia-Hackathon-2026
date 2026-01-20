import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, Settings } from 'lucide-react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showNotifications?: boolean;
  showSettings?: boolean;
  rightAction?: React.ReactNode;
  leftAction?: React.ReactNode;
  transparent?: boolean;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  showNotifications = false,
  showSettings = false,
  rightAction,
  leftAction,
  transparent = false,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + Spacing.sm },
        !transparent && styles.background,
        style,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.left}>
          {showBack && (
            <Pressable
              onPress={() => router.back()}
              style={styles.iconButton}
              hitSlop={8}
            >
              <ChevronLeft size={24} color={Colors.dark.text} />
            </Pressable>
          )}
          {leftAction}
        </View>

        <View style={styles.center}>
          {title && (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.right}>
          {showNotifications && (
            <Pressable
              onPress={() => {}}
              style={styles.iconButton}
              hitSlop={8}
            >
              <Bell size={22} color={Colors.dark.text} />
              <View style={styles.notificationBadge} />
            </Pressable>
          )}
          {showSettings && (
            <Pressable
              onPress={() => router.push('/profile')}
              style={styles.iconButton}
              hitSlop={8}
            >
              <Settings size={22} color={Colors.dark.text} />
            </Pressable>
          )}
          {rightAction}
        </View>
      </View>
    </View>
  );
};

// Page Header with greeting
interface PageHeaderProps {
  greeting?: string;
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  greeting,
  title,
  subtitle,
  rightAction,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.pageHeader, { paddingTop: insets.top + Spacing.base }]}>
      <View style={styles.pageHeaderContent}>
        <View style={styles.pageHeaderText}>
          {greeting && <Text style={styles.greeting}>{greeting}</Text>}
          <Text style={styles.pageTitle}>{title}</Text>
          {subtitle && <Text style={styles.pageSubtitle}>{subtitle}</Text>}
        </View>
        {rightAction}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  background: {
    backgroundColor: Colors.dark.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 60,
    gap: Spacing.sm,
  },
  title: {
    color: Colors.dark.text,
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    fontSize: Typography.fontSize.sm,
  },
  iconButton: {
    padding: Spacing.sm,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  pageHeader: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  pageHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pageHeaderText: {
    flex: 1,
  },
  greeting: {
    color: Colors.dark.textSecondary,
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs,
  },
  pageTitle: {
    color: Colors.dark.text,
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '700',
  },
  pageSubtitle: {
    color: Colors.dark.textSecondary,
    fontSize: Typography.fontSize.base,
    marginTop: Spacing.xs,
  },
});
