import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps as RNTextInputProps,
  Pressable,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Colors, BorderRadius, Typography, Spacing } from '../../constants/theme';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const showPasswordToggle = secureTextEntry !== undefined;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <RNTextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : undefined,
            (rightIcon || showPasswordToggle) ? styles.inputWithRightIcon : undefined,
          ]}
          placeholderTextColor={Colors.dark.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        {showPasswordToggle && (
          <Pressable
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.rightIcon}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={Colors.dark.textMuted} />
            ) : (
              <Eye size={20} color={Colors.dark.textMuted} />
            )}
          </Pressable>
        )}
        {rightIcon && !showPasswordToggle && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

// Search Input
interface SearchInputProps extends Omit<TextInputProps, 'leftIcon'> {
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onClear,
  value,
  ...props
}) => {
  return (
    <View style={styles.searchContainer}>
      <RNTextInput
        style={styles.searchInput}
        placeholder="Search..."
        placeholderTextColor={Colors.dark.textMuted}
        value={value}
        {...props}
      />
      {value && onClear && (
        <Pressable onPress={onClear} style={styles.clearButton}>
          <Text style={styles.clearText}>✕</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  label: {
    color: Colors.dark.text,
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  inputFocused: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.dark.surfaceElevated,
  },
  inputError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    padding: Spacing.base,
    color: Colors.dark.text,
    fontSize: Typography.fontSize.base,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIcon: {
    paddingLeft: Spacing.base,
  },
  rightIcon: {
    paddingRight: Spacing.base,
  },
  error: {
    color: Colors.error,
    fontSize: Typography.fontSize.xs,
    marginTop: Spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
  },
  searchInput: {
    flex: 1,
    padding: Spacing.md,
    color: Colors.dark.text,
    fontSize: Typography.fontSize.base,
  },
  clearButton: {
    padding: Spacing.sm,
  },
  clearText: {
    color: Colors.dark.textMuted,
    fontSize: Typography.fontSize.sm,
  },
});
