import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Typography, Spacing } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const sizeStyles = {
    sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.base },
    md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
    lg: { paddingVertical: Spacing.base, paddingHorizontal: Spacing['2xl'] },
  };

  const textSizes = {
    sm: Typography.fontSize.sm,
    md: Typography.fontSize.base,
    lg: Typography.fontSize.lg,
  };

  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={isDisabled ? ['#475569', '#334155'] : [Colors.primary[500], Colors.primary[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.button,
            sizeStyles[size],
            isDisabled && styles.disabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              {icon}
              <Text
                style={[
                  styles.text,
                  { fontSize: textSizes[size] },
                  icon && styles.textWithIcon,
                  textStyle,
                ]}
              >
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyles = {
    secondary: {
      button: styles.secondaryButton,
      text: styles.secondaryText,
    },
    outline: {
      button: styles.outlineButton,
      text: styles.outlineText,
    },
    ghost: {
      button: styles.ghostButton,
      text: styles.ghostText,
    },
    danger: {
      button: styles.dangerButton,
      text: styles.dangerText,
    },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        sizeStyles[size],
        variantStyles[variant].button,
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary[500] : '#FFFFFF'}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              { fontSize: textSizes[size] },
              variantStyles[variant].text,
              icon && styles.textWithIcon,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.xl,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  textWithIcon: {
    marginLeft: Spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  secondaryButton: {
    backgroundColor: Colors.dark.surfaceElevated,
  },
  secondaryText: {
    color: Colors.dark.text,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary[500],
  },
  outlineText: {
    color: Colors.primary[500],
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: Colors.primary[500],
  },
  dangerButton: {
    backgroundColor: Colors.error,
  },
  dangerText: {
    color: '#FFFFFF',
  },
});
