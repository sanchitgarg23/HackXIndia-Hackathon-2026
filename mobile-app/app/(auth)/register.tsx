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
import { User, Mail, Lock, Phone, ChevronLeft } from 'lucide-react-native';
import { Button, TextInput } from '../../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useAppStore, useUserStore } from '../../stores';

export default function RegisterScreen() {
  const router = useRouter();
  const { setOnboardingComplete } = useAppStore();
  const { setUser } = useUserStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setUser({
      id: '1',
      name: name || 'New User',
      email: email || 'user@medassist.com',
      phone: phone,
      role: 'PATIENT',
      language: 'en',
      allergies: [],
      chronicConditions: [],
      isOnboarded: true,
    });

    setOnboardingComplete();
    setIsLoading(false);
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
          {/* Back Button */}
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color={Colors.dark.text} />
          </Pressable>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join MedAssist and take control of your health
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              leftIcon={<User size={20} color={Colors.dark.textMuted} />}
            />

            <TextInput
              label="Email Address"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              leftIcon={<Mail size={20} color={Colors.dark.textMuted} />}
            />

            <TextInput
              label="Phone Number"
              placeholder="+91 98765 43210"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              leftIcon={<Phone size={20} color={Colors.dark.textMuted} />}
            />

            <TextInput
              label="Password"
              placeholder="Create a strong password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              leftIcon={<Lock size={20} color={Colors.dark.textMuted} />}
            />

            <TextInput
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              leftIcon={<Lock size={20} color={Colors.dark.textMuted} />}
            />

            {/* Terms Checkbox */}
            <Pressable
              style={styles.termsContainer}
              onPress={() => setAgreeTerms(!agreeTerms)}
            >
              <View
                style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}
              >
                {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </Pressable>

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              disabled={!agreeTerms}
              fullWidth
              style={styles.registerButton}
            />
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.loginLink}>Sign In</Text>
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
    paddingTop: 60,
    paddingBottom: Spacing['3xl'],
  },
  backButton: {
    marginBottom: Spacing.xl,
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
    alignSelf: 'flex-start',
  },
  header: {
    marginBottom: Spacing['2xl'],
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
  },
  form: {
    marginBottom: Spacing['2xl'],
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
    marginTop: Spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  termsText: {
    flex: 1,
    color: Colors.dark.textSecondary,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.fontSize.sm * 1.5,
  },
  termsLink: {
    color: Colors.primary[500],
  },
  registerButton: {
    marginTop: Spacing.base,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: Colors.dark.textSecondary,
    fontSize: Typography.fontSize.base,
  },
  loginLink: {
    color: Colors.primary[500],
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
  },
});
