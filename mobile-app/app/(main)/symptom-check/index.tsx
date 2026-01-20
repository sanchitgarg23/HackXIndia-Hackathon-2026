import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, Keyboard, ChevronRight, AlertTriangle, CheckCircle, ChevronLeft } from 'lucide-react-native';
import { Button, Card, TextInput } from '../../../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../../../constants/theme';
import { useIntakeStore } from '../../../stores';

export default function SymptomCheckScreen() {
  const router = useRouter();
  const { setIsRecording, updateCurrentIntake } = useIntakeStore();
  const [inputMode, setInputMode] = useState<'voice' | 'text' | null>(null);
  const [textSymptom, setTextSymptom] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoiceInput = () => {
    setInputMode('voice');
    // Simulate voice processing
    setIsProcessing(true);
    setTimeout(() => {
      updateCurrentIntake({
        symptoms: ['Headache', 'Fatigue'],
        rawTranscript: 'I have been having a headache and feeling tired',
        severity: 'low',
      });
      setIsProcessing(false);
      router.push('/(main)/symptom-check/review');
    }, 2000);
  };

  const handleTextSubmit = () => {
    if (!textSymptom.trim()) return;

    updateCurrentIntake({
      symptoms: [textSymptom],
      rawTranscript: textSymptom,
      severity: 'low',
    });
    router.push('/(main)/symptom-check/review');
  };

  // Initial Mode Selection
  if (inputMode === null) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Simple Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.dark.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Symptom Check</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>
              How would you like to{'\n'}describe your symptoms?
            </Text>
            <Text style={styles.heroSubtitle}>
              Choose your preferred input method. Our AI understands natural language.
            </Text>
          </View>

          {/* Input Method Cards */}
          <View style={styles.methodsContainer}>
            <Pressable onPress={handleVoiceInput} style={styles.methodCardPrimary}>
              <View style={styles.methodIcon}>
                <Mic size={32} color={Colors.primary[500]} />
              </View>
              <Text style={styles.methodTitle}>Voice Input</Text>
              <Text style={styles.methodDescription}>
                Speak naturally about how you're feeling. Best for detailed descriptions.
              </Text>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Recommended</Text>
              </View>
            </Pressable>

            <Pressable onPress={() => setInputMode('text')} style={styles.methodCard}>
              <View style={[styles.methodIcon, { backgroundColor: Colors.dark.border }]}>
                <Keyboard size={32} color={Colors.dark.textSecondary} />
              </View>
              <Text style={styles.methodTitle}>Text Input</Text>
              <Text style={styles.methodDescription}>
                Type your symptoms. Useful in quiet environments.
              </Text>
            </Pressable>
          </View>

          {/* Recent Checks */}
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Symptom Checks</Text>
            <Card variant="elevated" style={styles.recentCard}>
              <View style={styles.recentItem}>
                <View style={[styles.recentIcon, { backgroundColor: Colors.success + '20' }]}>
                  <CheckCircle size={18} color={Colors.success} />
                </View>
                <View style={styles.recentContent}>
                  <Text style={styles.recentTitle}>Mild Headache</Text>
                  <Text style={styles.recentSubtitle}>Self-care recommended</Text>
                </View>
                <Text style={styles.recentTime}>2h ago</Text>
              </View>
            </Card>
          </View>

          {/* Privacy Note */}
          <View style={styles.privacyNote}>
            <Text style={styles.privacyText}>
              🔒 Your data is processed on-device. Nothing is sent to external servers.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Voice Processing Screen
  if (inputMode === 'voice') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => setInputMode(null)} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.dark.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Processing...</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.processingContainer}>
          <Text style={styles.processingEmoji}>🎤</Text>
          <Text style={styles.processingTitle}>Analyzing your symptoms...</Text>
          <Text style={styles.processingSubtitle}>
            Processing with MedGemma AI
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Text Input Screen
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => setInputMode(null)} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.dark.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Text Input</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.textInputContainer}>
        <Text style={styles.inputLabel}>Describe your symptoms</Text>
        <TextInput
          placeholder="e.g. Severe headache on the left side, feeling nauseous..."
          value={textSymptom}
          onChangeText={setTextSymptom}
          multiline
          numberOfLines={6}
          style={styles.textArea}
        />

        <Button
          title="Analyze Symptoms"
          onPress={handleTextSubmit}
          disabled={!textSymptom.trim()}
          fullWidth
          style={styles.submitButton}
        />

        <Button
          title="Use Voice Instead"
          variant="ghost"
          onPress={handleVoiceInput}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 120,
  },
  heroSection: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['2xl'],
  },
  heroTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '700',
    color: Colors.dark.text,
    lineHeight: 32,
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.dark.textSecondary,
    lineHeight: 22,
  },
  methodsContainer: {
    gap: Spacing.base,
    marginBottom: Spacing['2xl'],
  },
  methodCardPrimary: {
    padding: Spacing.xl,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: Colors.primary[500] + '10',
    borderWidth: 1,
    borderColor: Colors.primary[500] + '30',
  },
  methodCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  methodIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary[500] + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  methodTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: Spacing.xs,
  },
  methodDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
  },
  recommendedBadge: {
    position: 'absolute',
    top: Spacing.base,
    right: Spacing.base,
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  recommendedText: {
    fontSize: Typography.fontSize.xs,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  recentSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: Spacing.base,
  },
  recentCard: {
    padding: Spacing.base,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  recentSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  recentTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
  },
  privacyNote: {
    backgroundColor: Colors.dark.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
  },
  privacyText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  processingEmoji: {
    fontSize: 64,
    marginBottom: Spacing.xl,
  },
  processingTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  processingSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  textInputContainer: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  inputLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  textArea: {
    height: 150,
    marginBottom: Spacing.xl,
  },
  submitButton: {
    marginBottom: Spacing.base,
  },
});
