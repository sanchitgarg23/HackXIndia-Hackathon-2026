import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, BorderRadius, Spacing, Shadows } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'gradient' | 'outlined';
  onPress?: () => void;
  style?: ViewStyle;
  padding?: keyof typeof Spacing | number;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  onPress,
  style,
  padding = 'base',
}) => {
  const paddingValue = typeof padding === 'number' ? padding : Spacing[padding];

  const content = (
    <View style={[styles.content, { padding: paddingValue }]}>{children}</View>
  );

  if (variant === 'glass') {
    const Wrapper = onPress ? Pressable : View;
    return (
      <Wrapper
        onPress={onPress}
        style={[styles.card, styles.glassCard, style]}
      >
        <BlurView intensity={20} tint="dark" style={styles.blur}>
          {content}
        </BlurView>
      </Wrapper>
    );
  }

  if (variant === 'gradient') {
    const Wrapper = onPress ? Pressable : View;
    return (
      <Wrapper onPress={onPress} style={[styles.card, style]}>
        <LinearGradient
          colors={[Colors.primary[500] + '20', Colors.primary[600] + '10']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { padding: paddingValue }]}
        >
          {children}
        </LinearGradient>
      </Wrapper>
    );
  }

  const variantStyles = {
    default: styles.defaultCard,
    elevated: styles.elevatedCard,
    outlined: styles.outlinedCard,
    glass: {},
    gradient: {},
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          variantStyles[variant],
          pressed && styles.pressed,
          style,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, variantStyles[variant], style]}>
      {content}
    </View>
  );
};

// Quick stat card for dashboard
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  color = Colors.primary[500],
  onPress,
}) => {
  return (
    <Card variant="elevated" onPress={onPress} style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <View style={styles.statText}>
        <View style={styles.statValue}>
          <View style={styles.statValueText}>
            {typeof value === 'string' ? (
              <View style={styles.valueContainer}>
                <View style={styles.valueNumber}>
                  <View style={[styles.badge, { backgroundColor: color }]} />
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  defaultCard: {
    backgroundColor: Colors.dark.card,
  },
  elevatedCard: {
    backgroundColor: Colors.dark.cardElevated,
    ...Shadows.md,
  },
  outlinedCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  blur: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: BorderRadius.xl,
  },
  gradient: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.primary[500] + '30',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  statCard: {
    flex: 1,
    minWidth: 100,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statText: {
    flex: 1,
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValueText: {
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueNumber: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
});
