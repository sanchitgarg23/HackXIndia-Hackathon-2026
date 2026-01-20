import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Video,
  Building2,
  AlertCircle,
  Info,
  ChevronRight,
} from 'lucide-react-native';
import { Header, Card, Button } from '../../../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../../../constants/theme';
import { useIntakeStore } from '../../../stores';
import { medgemmaService } from '../../../services/medgemma-service';

const urgencyColors = {
  low: Colors.urgency.low,
  medium: Colors.urgency.medium,
  high: Colors.urgency.high,
  critical: Colors.urgency.critical,
};

export default function SymptomReviewScreen() {
  const router = useRouter();
  const { currentIntake, updateCurrentIntake, clearCurrentIntake } = useIntakeStore();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation values
  const progressWidth = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    let mounted = true;

    const runAnalysis = async () => {
      try {
        // Start animation
        progressWidth.value = withTiming(0.8, { duration: 2000, easing: Easing.out(Easing.quad) });

        // Ensure model is ready
        if (!medgemmaService.isReady()) {
          await medgemmaService.initializeModel();
        }

        // Prepare query
        const query = currentIntake.rawTranscript || currentIntake.chiefComplaint || currentIntake.symptoms?.join(', ') || "General checkup";

        // Run inference
        const analysis = await medgemmaService.inferSymptoms(query);

        if (mounted) {
          // Complete animation
          progressWidth.value = withTiming(1, { duration: 500 });

          // Update store
          updateCurrentIntake({
            symptoms: analysis.normalizedSymptoms,
            duration: analysis.duration,
            severity: analysis.severity,
            riskFactors: analysis.riskFactors,
            redFlags: analysis.redFlags,
            urgencyScore: analysis.urgencyScore === 'low' ? 1 : analysis.urgencyScore === 'medium' ? 5 : analysis.urgencyScore === 'high' ? 8 : 10,
            escalationLevel: analysis.urgencyScore === 'emergency' ? 'emergency' : analysis.urgencyScore === 'high' ? 'clinic_visit' : analysis.urgencyScore === 'medium' ? 'teleconsult' : 'self_care',
            recommendations: analysis.recommendations,
            confidenceGaps: analysis.confidenceGaps,
          });

          // Show content
          setTimeout(() => {
            setIsAnalyzing(false);
            contentOpacity.value = withTiming(1, { duration: 500 });
          }, 800);
        }
      } catch (err: any) {
        console.error('Analysis failed:', err);
        if (mounted) {
          setError(err.message || "Failed to analyze symptoms");
          setIsAnalyzing(false);
        }
      }
    };

    runAnalysis();

    return () => { mounted = false; };
  }, []);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const handleDone = () => {
    clearCurrentIntake();
    router.replace('/(main)');
  };

  if (isAnalyzing) {
    return (
      <View style={styles.container}>
        <Header title="Analyzing..." showBack />
        <View style={styles.analyzingContainer}>
          <Text style={styles.analyzingEmoji}>🧠</Text>
          <Text style={styles.analyzingTitle}>AI is analyzing your symptoms</Text>
          <Text style={styles.analyzingSubtitle}>
            Processing with MedGemma on-device...
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressBar, progressAnimatedStyle]}>
                <LinearGradient
                  colors={[Colors.primary[400], Colors.primary[600]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressGradient}
                />
              </Animated.View>
            </View>
          </View>
          <View style={styles.privacyNote}>
            <Text style={styles.privacyText}>
              🔒 All processing happens on your device
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title="Error" showBack />
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
          <AlertTriangle size={48} color={Colors.error} />
          <Text style={{ ...Typography.textStyle.h3, marginTop: 16, textAlign: 'center' }}>Analysis Failed</Text>
          <Text style={{ ...Typography.textStyle.body, marginTop: 8, textAlign: 'center', color: Colors.dark.textSecondary }}>{error}</Text>
          <Button title="Try Again" onPress={() => router.back()} style={{ marginTop: 24 }} />
        </View>
      </View>
    )
  }

  const urgencyLevels = {
    'low': 'low',
    'medium': 'medium',
    'high': 'high',
    'emergency': 'critical'
  };

  // Map store urgencyScore (number) back to string level for display if needed, or use escalationLevel
  const urgencyLevelKey = currentIntake.urgencyScore ? (currentIntake.urgencyScore < 4 ? 'low' : currentIntake.urgencyScore < 7 ? 'medium' : currentIntake.urgencyScore < 9 ? 'high' : 'critical') : 'low';
  const urgencyColor = urgencyColors[urgencyLevelKey];

  return (
    <View style={styles.container}>
      <Header title="Analysis Results" showBack />

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={contentAnimatedStyle}
      >
        {/* Urgency Banner */}
        <LinearGradient
          colors={[urgencyColor + '30', urgencyColor + '10']}
          style={styles.urgencyBanner}
        >
          <View style={[styles.urgencyIcon, { backgroundColor: urgencyColor }]}>
            {urgencyLevelKey === 'low' ? (
              <CheckCircle size={24} color="#FFFFFF" />
            ) : urgencyLevelKey === 'critical' ? (
              <AlertCircle size={24} color="#FFFFFF" />
            ) : (
              <AlertTriangle size={24} color="#FFFFFF" />
            )}
          </View>
          <View style={styles.urgencyContent}>
            <Text style={[styles.urgencyLabel, { color: urgencyColor }]}>
              {urgencyLevelKey.toUpperCase()} URGENCY
            </Text>
            <Text style={styles.urgencyTitle}>{currentIntake.chiefComplaint || currentIntake.symptoms?.[0] || 'Symptom Analysis'}</Text>
          </View>
        </LinearGradient>

        {/* Symptoms List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identified Symptoms</Text>
          <Card variant="elevated" style={styles.symptomsCard}>
            {currentIntake.symptoms?.map((symptom, index) => (
              <React.Fragment key={index}>
                <View style={styles.symptomRow}>
                  <View style={styles.symptomInfo}>
                    <Text style={styles.symptomName}>{symptom}</Text>
                  </View>
                  <View style={styles.symptomMeta}>
                    <View style={[
                      styles.severityBadge,
                      {
                        backgroundColor:
                          currentIntake.severity === 'low' ? Colors.success + '20' :
                            currentIntake.severity === 'medium' ? Colors.warning + '20' :
                              Colors.error + '20'
                      }
                    ]}>
                      <Text style={[
                        styles.severityText,
                        {
                          color:
                            currentIntake.severity === 'low' ? Colors.success :
                              currentIntake.severity === 'medium' ? Colors.warning :
                                Colors.error
                        }
                      ]}>
                        {currentIntake.severity || 'Unknown'}
                      </Text>
                    </View>
                    <View style={styles.durationBadge}>
                      <Clock size={12} color={Colors.dark.textMuted} />
                      <Text style={styles.durationText}>{currentIntake.duration || 'Unknown duration'}</Text>
                    </View>
                  </View>
                </View>
                {index < (currentIntake.symptoms?.length || 0) - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </Card>
        </View>

        {/* Risk Factors */}
        {currentIntake.riskFactors && currentIntake.riskFactors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contributing Factors</Text>
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
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <Card variant="elevated" style={styles.recommendationsCard}>
              {currentIntake.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationRow}>
                  <CheckCircle size={18} color={rec.type === 'medical' ? Colors.warning : Colors.success} />
                  <Text style={styles.recommendationText}>{rec.title}</Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Suggested Next Step */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Next Step</Text>
          <Pressable onPress={() => router.push('/(main)/appointments/book')}>
            <LinearGradient
              colors={[Colors.primary[500] + '20', Colors.primary[600] + '10']}
              style={styles.actionCard}
            >
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
                      : currentIntake.escalationLevel === 'emergency'
                        ? 'Go to Emergency Room'
                        : 'Self-Care Recommended'}
                </Text>
                <Text style={styles.actionSubtitle}>
                  {currentIntake.escalationLevel === 'self_care'
                    ? 'Monitor symptoms and follow recommendations'
                    : 'Consult with a doctor for proper evaluation'}
                </Text>
              </View>
              <ChevronRight size={24} color={Colors.primary[500]} />
            </LinearGradient>
          </Pressable>
        </View>

        {/* Confidence Gaps */}
        {currentIntake.confidenceGaps && currentIntake.confidenceGaps.length > 0 && (
          <View style={styles.section}>
            <Card variant="outlined" style={styles.gapsCard}>
              <Info size={18} color={Colors.info} />
              <View style={styles.gapsContent}>
                <Text style={styles.gapsTitle}>Additional Info Needed</Text>
                <Text style={styles.gapsText}>
                  {currentIntake.confidenceGaps.join(', ')}
                </Text>
              </View>
            </Card>
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ This analysis is for informational purposes only and does not constitute medical advice.
            Always consult a healthcare professional for proper diagnosis and treatment.
          </Text>
        </View>
      </Animated.ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <Button
          title="Done"
          onPress={handleDone}
          fullWidth
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
  progressContainer: {
    width: '60%',
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.dark.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressGradient: {
    flex: 1,
  },
  privacyNote: {
    marginTop: Spacing.xl,
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
    borderWidth: 1,
    borderColor: Colors.dark.border,
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
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  symptomsCard: {
    padding: Spacing.base,
  },
  symptomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  symptomInfo: {
    flex: 1,
  },
  symptomName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  symptomDetail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  symptomMeta: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
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
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
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
  recommendationsCard: {
    padding: Spacing.base,
  },
  recommendationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
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
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.primary[500] + '30',
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
  gapsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  gapsContent: {
    flex: 1,
  },
  gapsTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.info,
    marginBottom: 2,
  },
  gapsText: {
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
    lineHeight: Typography.fontSize.xs * 1.5,
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
