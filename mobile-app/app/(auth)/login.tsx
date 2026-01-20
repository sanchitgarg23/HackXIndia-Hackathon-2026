import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Phone } from 'lucide-react-native';
import { Button, TextInput } from '../../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useAppStore, useUserStore } from '../../stores';

export default function LoginScreen() {
  const router = useRouter();
  const { setOnboardingComplete } = useAppStore();
  const { setUser } = useUserStore();
  
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate login - in production, this would call the auth API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock user data
    setUser({
      id: '1',
      name: 'Demo User',
      email: email || 'demo@medassist.com',
      phone: phone || '+91 98765 43210',
      language: 'en',
      allergies: [],
      chronicConditions: [],
      isOnboarded: true,
    });
    
    setOnboardingComplete();
    setIsLoading(false);
    router.replace('/(main)');
  };

  const handleGuestLogin = () => {
    setUser({
      id: 'guest',
      name: 'Guest User',
      email: 'guest@medassist.com',
      language: 'en',
      allergies: [],
      chronicConditions: [],
      isOnboarded: true,
    });
    setOnboardingComplete();
    router.replace('/(main)');
  };

  return (
    <LinearGradient
      colors={[Colors.dark.background, '#0F1629', Colors.dark.background]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🩺</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue managing your health
            </Text>
          </View>

          {/* Login Method Toggle */}
          <View style={styles.toggleContainer}>
            <Pressable
              style={[
                styles.toggleButton,
                loginMethod === 'email' && styles.toggleButtonActive,
              ]}
              onPress={() => setLoginMethod('email')}
            >
              <Mail
                size={18}
                color={loginMethod === 'email' ? Colors.primary[500] : Colors.dark.textMuted}
              />
              <Text
                style={[
                  styles.toggleText,
                  loginMethod === 'email' && styles.toggleTextActive,
                ]}
              >
                Email
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.toggleButton,
                loginMethod === 'phone' && styles.toggleButtonActive,
              ]}
              onPress={() => setLoginMethod('phone')}
            >
              <Phone
                size={18}
                color={loginMethod === 'phone' ? Colors.primary[500] : Colors.dark.textMuted}
              />
              <Text
                style={[
                  styles.toggleText,
                  loginMethod === 'phone' && styles.toggleTextActive,
                ]}
              >
                Phone
              </Text>
            </Pressable>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {loginMethod === 'email' ? (
              <TextInput
                label="Email Address"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                leftIcon={<Mail size={20} color={Colors.dark.textMuted} />}
              />
            ) : (
              <TextInput
                label="Phone Number"
                placeholder="+91 98765 43210"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                leftIcon={<Phone size={20} color={Colors.dark.textMuted} />}
              />
            )}

            <TextInput
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              leftIcon={<Lock size={20} color={Colors.dark.textMuted} />}
            />

            <Pressable style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </Pressable>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={styles.loginButton}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Guest Login */}
            <Button
              title="Continue as Guest"
              variant="outline"
              onPress={handleGuestLogin}
              fullWidth
            />
          </View>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: 80,
    paddingBottom: Spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  logo: {
    fontSize: 56,
    marginBottom: Spacing.base,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.xl,
    padding: 4,
    marginBottom: Spacing['2xl'],
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  toggleButtonActive: {
    backgroundColor: Colors.dark.cardElevated,
  },
  toggleText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textMuted,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: Colors.primary[500],
  },
  form: {
    marginBottom: Spacing['2xl'],
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -Spacing.sm,
    marginBottom: Spacing.xl,
  },
  forgotPasswordText: {
    color: Colors.primary[500],
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: Spacing.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.dark.border,
  },
  dividerText: {
    color: Colors.dark.textMuted,
    fontSize: Typography.fontSize.sm,
    marginHorizontal: Spacing.base,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: Colors.dark.textSecondary,
    fontSize: Typography.fontSize.base,
  },
  registerLink: {
    color: Colors.primary[500],
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
  },
});
