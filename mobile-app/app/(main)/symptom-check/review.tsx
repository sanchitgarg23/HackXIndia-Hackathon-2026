import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Video,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { Card, Button } from '../../../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../../../constants/theme';
import { useIntakeStore } from '../../../stores';

export default function SymptomReviewScreen() {
  const router = useRouter();
  const { currentIntake, updateCurrentIntake, clearCurrentIntake } = useIntakeStore();
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    // Simulate AI analysis with mock data
    const timer = setTimeout(() => {
      updateCurrentIntake({
        symptoms: currentIntake.symptoms || ['Headache', 'Fatigue'],
        duration: '2 days',
        severity: 'low',
        riskFactors: ['Stress', 'Poor sleep'],
        redFlags: [],
        urgencyScore: 25,
        escalationLevel: 'self_care',
        recommendations: [
          { type: 'self_care', title: 'Rest and stay hydrated' },
          { type: 'self_care', title: 'Take over-the-counter pain relief if needed' },
          { type: 'monitor', title: 'Monitor symptoms for 48 hours' },
        ],
        confidenceGaps: [],
      });
      setIsAnalyzing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleDone = () => {
    clearCurrentIntake();
    router.replace('/(main)');
  };

  const handleBookAppointment = () => {
    router.push('/(main)/appointments/book');
  };

  // Analyzing Screen
  if (isAnalyzing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.dark.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Analyzing...</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.analyzingContainer}>
          <Text style={styles.analyzingEmoji}>🧠</Text>
          <Text style={styles.analyzingTitle}>AI is analyzing your symptoms</Text>
          <Text style={styles.analyzingSubtitle}>
            Processing with MedGemma on-device...
          </Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.privacyText}>
            🔒 All processing happens on your device
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get urgency color
  const getUrgencyColor = () => {
    const score = currentIntake.urgencyScore || 25;
    if (score < 30) return Colors.success;
    if (score < 60) return Colors.warning;
    return Colors.error;
  };

  const urgencyColor = getUrgencyColor();
  const urgencyLabel = (currentIntake.urgencyScore || 25) < 30 ? 'LOW' :
    (currentIntake.urgencyScore || 25) < 60 ? 'MEDIUM' : 'HIGH';

  // Results Screen
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.dark.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Analysis Results</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Urgency Banner */}
        <View style={[styles.urgencyBanner, { backgroundColor: urgencyColor + '20' }]}>
          <View style={[styles.urgencyIcon, { backgroundColor: urgencyColor }]}>
            {urgencyLabel === 'LOW' ? (
              <CheckCircle size={24} color="#FFFFFF" />
            ) : (
              <AlertTriangle size={24} color="#FFFFFF" />
            )}
          </View>
          <View style={styles.urgencyContent}>
            <Text style={[styles.urgencyLabel, { color: urgencyColor }]}>
              {urgencyLabel} URGENCY
            </Text>
            <Text style={styles.urgencyTitle}>
              {currentIntake.symptoms?.[0] || 'Symptom Analysis'}
            </Text>
          </View>
        </View>

        {/* Symptoms List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IDENTIFIED SYMPTOMS</Text>
          <Card variant="elevated" style={styles.card}>
            {(currentIntake.symptoms || ['Headache']).map((symptom, index) => (
              <View key={index} style={styles.symptomRow}>
                <Text style={styles.symptomName}>{symptom}</Text>
                <View style={[styles.severityBadge, { backgroundColor: urgencyColor + '20' }]}>
                  <Text style={[styles.severityText, { color: urgencyColor }]}>
                    {currentIntake.severity || 'low'}
                  </Text>
                </View>
              </View>
            ))}
            {currentIntake.duration && (
              <View style={styles.durationRow}>
                <Clock size={14} color={Colors.dark.textMuted} />
                <Text style={styles.durationText}>Duration: {currentIntake.duration}</Text>
              </View>
            )}
          </Card>
        </View>

        {/* Risk Factors */}
        {currentIntake.riskFactors && currentIntake.riskFactors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONTRIBUTING FACTORS</Text>
            <View style={styles.tagsContainer}>
              {currentIntake.riskFactors.map((factor, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{factor}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recommendations */}
        {currentIntake.recommendations && currentIntake.recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RECOMMENDATIONS</Text>
            <Card variant="elevated" style={styles.card}>
              {currentIntake.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationRow}>
                  <CheckCircle size={18} color={Colors.success} />
                  <Text style={styles.recommendationText}>{rec.title}</Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Next Step */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUGGESTED NEXT STEP</Text>
          <Pressable onPress={handleBookAppointment}>
            <Card variant="elevated" style={styles.actionCard}>
              <View style={styles.actionIcon}>
                {currentIntake.escalationLevel === 'teleconsult' ? (
                  <Video size={28} color={Colors.primary[500]} />
                ) : currentIntake.escalationLevel === 'clinic_visit' ? (
                  <Building2 size={28} color={Colors.primary[500]} />
                ) : (
                  <CheckCircle size={28} color={Colors.success} />
                )}
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>
                  {currentIntake.escalationLevel === 'teleconsult'
                    ? 'Book a Teleconsult'
                    : currentIntake.escalationLevel === 'clinic_visit'
                      ? 'Schedule a Clinic Visit'
                      : 'Self-Care Recommended'}
                </Text>
                <Text style={styles.actionSubtitle}>
                  {currentIntake.escalationLevel === 'self_care'
                    ? 'Monitor symptoms and follow recommendations'
                    : 'Consult with a doctor for proper evaluation'}
                </Text>
              </View>
              <ChevronRight size={24} color={Colors.primary[500]} />
            </Card>
          </Pressable>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ This analysis is for informational purposes only and does not constitute medical advice.
            Always consult a healthcare professional for proper diagnosis and treatment.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomContainer}>
        <Button
          title="Done"
          onPress={handleDone}
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
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  analyzingEmoji: {
    fontSize: 64,
    marginBottom: Spacing.xl,
  },
  analyzingTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  analyzingSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
  },
  progressBar: {
    width: '60%',
    height: 4,
    backgroundColor: Colors.dark.surface,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  progressFill: {
    width: '70%',
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 2,
  },
  privacyText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textMuted,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 120,
  },
  urgencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
    marginTop: Spacing.base,
  },
  urgencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  urgencyContent: {
    flex: 1,
  },
  urgencyLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  urgencyTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  card: {
    padding: Spacing.base,
  },
  symptomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  symptomName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  severityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  severityText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  durationText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textMuted,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.dark.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
  },
  recommendationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  recommendationText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.dark.text,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary[500] + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
  },
  disclaimer: {
    backgroundColor: Colors.dark.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.base,
  },
  disclaimerText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
    lineHeight: 18,
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xl,
    paddingBottom: Spacing['3xl'],
    backgroundColor: Colors.dark.background,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
});
