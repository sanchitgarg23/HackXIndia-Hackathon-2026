import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Mic, Keyboard, ChevronRight, AlertTriangle, CheckCircle, Activity } from 'lucide-react-native';
import { Header, Button, Card, TextInput } from '../../../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../../../constants/theme';
import { useIntakeStore } from '../../../stores';

const { width } = Dimensions.get('window');

export default function SymptomCheckScreen() {
  const router = useRouter();
  const { isRecording, setIsRecording } = useIntakeStore();
  const [inputMode, setInputMode] = useState<'voice' | 'text' | null>(null);
  /* Voice Flow States */
  const [voiceStep, setVoiceStep] = useState<'idle' | 'recording' | 'processing' | 'questioning'>('idle');
  const [textSymptom, setTextSymptom] = useState('');

  // Animation values
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);

  const startRecording = () => {
    setIsRecording(true);
    setVoiceStep('recording');
    setInputMode('voice');
    // Animate pulse
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 800, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 800 }),
        withTiming(0.5, { duration: 800 })
      ),
      -1,
      false
    );
  };

  const stopRecording = () => {
    setIsRecording(false);
    pulseScale.value = withSpring(1);
    pulseOpacity.value = withSpring(0.5);
    
    // Move to processing then questioning
    setVoiceStep('processing');
    setTimeout(() => {
      setVoiceStep('questioning');
    }, 2000);
  };

  const handleVoiceResponse = () => {
    // Navigate to review after answering follow-up
    router.push('/(main)/symptom-check/review');
  };

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  if (inputMode === null) {
    return (
      <View style={styles.container}>
        <Header title="Symptom Check" showBack />
        
        <ScrollView contentContainerStyle={styles.content}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>How would you like to{'\n'}describe your symptoms?</Text>
            <Text style={styles.heroSubtitle}>
              Choose your preferred input method. Our AI understands natural language.
            </Text>
          </View>

          {/* Input Method Cards */}
          <View style={styles.methodsContainer}>
            <Pressable onPress={startRecording}>
              <LinearGradient
                colors={[Colors.primary[500] + '20', Colors.primary[600] + '10']}
                style={styles.methodCard}
              >
                <View style={[styles.methodIcon, { backgroundColor: Colors.primary[500] + '30' }]}>
                  <Mic size={32} color={Colors.primary[500]} />
                </View>
                <Text style={styles.methodTitle}>Voice Input</Text>
                <Text style={styles.methodDescription}>
                  Speak naturally about how you're feeling. Best for detailed descriptions.
                </Text>
                <View style={styles.methodBadge}>
                  <Text style={styles.methodBadgeText}>Recommended</Text>
                </View>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={() => setInputMode('text')}>
              <Card variant="elevated" style={styles.methodCard}>
                <View style={[styles.methodIcon, { backgroundColor: Colors.dark.border }]}>
                  <Keyboard size={32} color={Colors.dark.textSecondary} />
                </View>
                <Text style={styles.methodTitle}>Text Input</Text>
                <Text style={styles.methodDescription}>
                  Type your symptoms. Useful in quiet environments or for quick entries.
                </Text>
              </Card>
            </Pressable>
          </View>

          {/* Recent Checks */}
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Symptom Checks</Text>
            <Card variant="elevated" style={styles.recentCard}>
              <View style={styles.recentItem}>
                <View style={[styles.recentIcon, { backgroundColor: Colors.urgency.low + '20' }]}>
                  <CheckCircle size={18} color={Colors.urgency.low} />
                </View>
                <View style={styles.recentContent}>
                  <Text style={styles.recentTitle}>Mild Headache</Text>
                  <Text style={styles.recentSubtitle}>Self-care recommended</Text>
                </View>
                <Text style={styles.recentTime}>2h ago</Text>
              </View>
              <View style={styles.recentDivider} />
              <View style={styles.recentItem}>
                <View style={[styles.recentIcon, { backgroundColor: Colors.urgency.medium + '20' }]}>
                  <AlertTriangle size={18} color={Colors.urgency.medium} />
                </View>
                <View style={styles.recentContent}>
                  <Text style={styles.recentTitle}>Persistent Cough</Text>
                  <Text style={styles.recentSubtitle}>Teleconsult suggested</Text>
                </View>
                <Text style={styles.recentTime}>3 days ago</Text>
              </View>
            </Card>
          </View>

          {/* Info Note */}
          <View style={styles.infoNote}>
            <Text style={styles.infoText}>
              🔒 Your data is processed on-device. Nothing is sent to external servers.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (inputMode === 'voice') {
    return (
      <View style={styles.container}>
        <Header
          title={voiceStep === 'questioning' ? 'Follow-up' : (isRecording ? 'Listening...' : 'Voice Input')}
          showBack
          leftAction={
            !isRecording && voiceStep !== 'processing' && (
              <Pressable onPress={() => { setInputMode(null); setVoiceStep('idle'); }} style={styles.backButton}>
                <Text style={styles.backText}>Cancel</Text>
              </Pressable>
            )
          }
        />

        <View style={styles.voiceContainer}>
          {/* Questioning State */}
          {voiceStep === 'questioning' ? (
            <View style={styles.questionContainer}>
              <View style={[styles.aiAvatar, { backgroundColor: Colors.primary[500] + '20' }]}>
                 <Activity size={32} color={Colors.primary[500]} />
              </View>
              <Text style={styles.aiQuestion}>
                "I noticed you mentioned a headache. Is it accompanied by any sensitivity to light or nausea?"
              </Text>
              
              <View style={styles.answerOptions}>
                 <Button title="Yes" onPress={handleVoiceResponse} style={styles.answerBtn} />
                 <Button title="No" variant="outline" onPress={handleVoiceResponse} style={styles.answerBtn} />
              </View>
              <Button 
                title="Repy with Voice" 
                variant="ghost" 
                icon={<Mic size={18} color={Colors.primary[500]} />} 
                onPress={handleVoiceResponse}
              />
            </View>
          ) : voiceStep === 'processing' ? (
             <View style={styles.processingContainer}>
                <Activity size={48} color={Colors.primary[500]} />
                <Text style={styles.processingText}>Analying symptoms...</Text>
             </View>
          ) : (
            <>
              {/* Instructions */}
              <View style={styles.voiceInstructions}>
                <Text style={styles.voiceTitle}>
                  {isRecording
                    ? 'Describe your symptoms...'
                    : 'Tap the microphone to start'}
                </Text>
                <Text style={styles.voiceSubtitle}>
                  {isRecording
                    ? 'Speak clearly about what you\'re experiencing'
                    : 'Our AI will analyze your symptoms'}
                </Text>
              </View>

              {/* Microphone Button */}
              <View style={styles.micContainer}>
                {/* Pulse Animation */}
                {isRecording && (
                  <Animated.View style={[styles.pulse, pulseAnimatedStyle]} />
                )}
                
                <Pressable
                  onPress={isRecording ? stopRecording : startRecording}
                  style={[styles.micButton, isRecording && styles.micButtonActive]}
                >
                  <Mic size={40} color="#FFFFFF" />
                </Pressable>
              </View>

              {/* Transcript Preview */}
              {isRecording && (
                <View style={styles.transcriptContainer}>
                  <Text style={styles.transcriptLabel}>Transcribing...</Text>
                  <Text style={styles.transcriptText}>
                    "I've been having a headache since yesterday morning..."
                  </Text>
                </View>
              )}

              {/* Actions */}
              {isRecording && (
                <View style={styles.voiceActions}>
                  <Button
                    title="Stop & Analyze"
                    onPress={stopRecording}
                    fullWidth
                  />
                </View>
              )}
            </>
          )}
        </View>
      </View>
    );
  }

  // Text Input Mode
  return (
    <View style={styles.container}>
      <Header title="Text Input" showBack leftAction={
        <Pressable onPress={() => setInputMode(null)} style={styles.backButton}>
          <Text style={styles.backText}>Cancel</Text>
        </Pressable>
      }/>
      <View style={styles.textInputContainer}>
        <TextInput
          label="Describe your symptoms"
          placeholder="e.g. Severe headache on the left side..."
          value={textSymptom}
          onChangeText={setTextSymptom}
          multiline
          numberOfLines={6}
          style={{ height: 150 }}
        />
        <Button
          title="Analyze Symptoms"
          onPress={() => router.push('/(main)/symptom-check/review')}
          disabled={!textSymptom.trim()}
          style={{ marginTop: Spacing.xl, width: '100%' }}
        />
        <Button
          title="Use Voice Instead"
          variant="ghost"
          onPress={() => setInputMode('voice')}
          style={{ marginTop: Spacing.base }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
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
    lineHeight: Typography.fontSize['2xl'] * 1.3,
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.dark.textSecondary,
    lineHeight: Typography.fontSize.base * 1.5,
  },
  methodsContainer: {
    gap: Spacing.base,
    marginBottom: Spacing['2xl'],
  },
  methodCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: Colors.dark.border,
    position: 'relative',
  },
  methodIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
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
    lineHeight: Typography.fontSize.sm * 1.5,
  },
  methodBadge: {
    position: 'absolute',
    top: Spacing.base,
    right: Spacing.base,
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  methodBadgeText: {
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
    paddingVertical: Spacing.sm,
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
  recentDivider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginVertical: Spacing.sm,
  },
  infoNote: {
    backgroundColor: Colors.dark.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
  },
  infoText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  backButton: {
    padding: Spacing.sm,
  },
  backText: {
    color: Colors.primary[500],
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
  },
  voiceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  voiceInstructions: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  voiceTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '700',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  voiceSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  micContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['3xl'],
  },
  pulse: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primary[500],
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primary[500],
  },
  micButtonActive: {
    backgroundColor: Colors.primary[500],
  },
  transcriptContainer: {
    backgroundColor: Colors.dark.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
    width: '100%',
  },
  transcriptLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary[500],
    marginBottom: Spacing.xs,
    fontWeight: '500',
  },
  transcriptText: {
    fontSize: Typography.fontSize.base,
    color: Colors.dark.text,
    lineHeight: Typography.fontSize.base * 1.5,
    fontStyle: 'italic',
  },
  tipsContainer: {
    backgroundColor: Colors.dark.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    width: '100%',
  },
  tipsTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  tipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.xs,
  },
  voiceActions: {
    position: 'absolute',
    bottom: 40,
    left: Spacing.xl,
    right: Spacing.xl,
  },
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  processingText: {
    marginTop: Spacing.xl,
    fontSize: Typography.fontSize.lg,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  aiAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  aiQuestion: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '600',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: Spacing['3xl'],
    lineHeight: 32,
  },
  answerOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    width: '100%',
    paddingHorizontal: Spacing.xl,
  },
  answerBtn: {
    flex: 1,
  },
  textInputContainer: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
});
