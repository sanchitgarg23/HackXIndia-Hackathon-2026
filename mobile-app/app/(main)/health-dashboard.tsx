import React from 'react';
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
import {
  Heart,
  Activity,
  Droplets,
  Scale,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Pill,
  Calendar,
  Plus,
} from 'lucide-react-native';
import { Header, Card, Button } from '../../components/ui';
import { Colors, Typography, Spacing, BorderRadius, getHealthScoreColor } from '../../constants/theme';
import { useHealthStore } from '../../stores';

const { width } = Dimensions.get('window');

// Mock data for the health dashboard


export default function HealthDashboardScreen() {
  const router = useRouter();
  const {
    healthScore,
    vitals,
    activeConditions,
    medications,
    diagnoses,
    fetchDashboard,
    isLoading
  } = useHealthStore();

  React.useEffect(() => {
    fetchDashboard();
  }, []);

  const score = healthScore || 0;
  const healthColor = getHealthScoreColor(score);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={14} color={Colors.success} />;
      case 'down':
        return <TrendingDown size={14} color={Colors.error} />;
      default:
        return <Minus size={14} color={Colors.dark.textMuted} />;
    }
  };

  const getVitalIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('pressure')) return <Activity size={20} color={Colors.error} />;
    if (t.includes('heart') || t.includes('rate')) return <Heart size={20} color={Colors.primary[500]} />;
    if (t.includes('sugar') || t.includes('glucose')) return <Droplets size={20} color={Colors.accent[500]} />;
    if (t.includes('weight')) return <Scale size={20} color="#8B5CF6" />;
    return <Activity size={20} color={Colors.dark.textMuted} />;
  };

  const getVitalColor = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('pressure')) return Colors.error;
    if (t.includes('heart')) return Colors.primary[500];
    if (t.includes('sugar')) return Colors.accent[500];
    if (t.includes('weight')) return '#8B5CF6';
    return Colors.dark.textMuted;
  };

  return (
    <View style={styles.container}>
      <Header title="Health Dashboard" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Health Score Hero */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[healthColor.bg + '30', healthColor.bg + '10']}
            style={styles.scoreCard}
          >
            <View style={styles.scoreContainer}>
              <View style={[styles.scoreCircle, { borderColor: healthColor.bg }]}>
                <Text style={[styles.scoreValue, { color: healthColor.bg }]}>{score}</Text>
                <Text style={styles.scoreLabel}>/ 100</Text>
              </View>
              <View style={styles.scoreInfo}>
                <Text style={styles.scoreTitle}>Overall Health Score</Text>
                <Text style={[styles.scoreStatus, { color: healthColor.bg }]}>
                  {healthColor.label}
                </Text>
                <Text style={styles.scoreDescription}>
                  Based on recent diagnoses, vitals, and lifestyle factors
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Vitals Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vitals</Text>
            <Pressable
              style={styles.addVitalButton}
              onPress={() => alert('Log Vital feature coming in Phase 2')}
            >
              <Plus size={18} color={Colors.primary[500]} />
              <Text style={styles.addVitalText}>Log Vital</Text>
            </Pressable>
          </View>
          <View style={styles.vitalsGrid}>
            {vitals.map((vital, index) => (
              <Card key={vital._id || index} variant="elevated" style={styles.vitalCard}>
                <View style={[styles.vitalIcon, { backgroundColor: getVitalColor(vital.title) + '20' }]}>
                  {getVitalIcon(vital.title)}
                </View>
                <Text style={styles.vitalLabel}>{vital.title}</Text>
                <View style={styles.vitalValueRow}>
                  <Text style={styles.vitalValue}>{vital.data.value}</Text>
                  <Text style={styles.vitalUnit}>{vital.data.unit}</Text>
                </View>
                <View style={styles.vitalMeta}>
                  {getTrendIcon(vital.data.trend)}
                  <Text style={styles.vitalTime}>{new Date(vital.date).toLocaleDateString()}</Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Active Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Conditions</Text>
          <Card variant="elevated" style={styles.conditionsCard}>
            {activeConditions.length === 0 && <Text style={{ color: Colors.dark.textMuted, textAlign: 'center' }}>No active conditions</Text>}
            {activeConditions.map((condition, index) => (
              <React.Fragment key={index}>
                <View style={styles.conditionRow}>
                  <View style={styles.conditionInfo}>
                    <View style={[
                      styles.conditionDot,
                      { backgroundColor: Colors.warning }
                    ]} />
                    <View>
                      <Text style={styles.conditionName}>{condition}</Text>
                      <Text style={styles.conditionSince}>Active</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.conditionBadge,
                    { backgroundColor: Colors.warning + '20' }
                  ]}>
                    <Text style={[
                      styles.conditionStatus,
                      { color: Colors.warning }
                    ]}>
                      Ongoing
                    </Text>
                  </View>
                </View>
                {index < activeConditions.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </Card>
        </View>

        {/* Medications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Medications</Text>
            <Pressable onPress={() => alert('Manage Medications coming soon')}>
              <Text style={styles.seeAll}>Manage</Text>
            </Pressable>
          </View>
          <Card variant="elevated" style={styles.medicationsCard}>
            {medications.length === 0 && <Text style={{ color: Colors.dark.textMuted, textAlign: 'center' }}>No active medications</Text>}
            {medications.map((med, index) => (
              <React.Fragment key={med._id || index}>
                <View style={styles.medicationRow}>
                  <View style={[styles.medIcon, { backgroundColor: Colors.warning + '20' }]}>
                    <Pill size={18} color={Colors.warning} />
                  </View>
                  <View style={styles.medInfo}>
                    <Text style={styles.medName}>{med.title}</Text>
                    <Text style={styles.medDosage}>{med.data.dosage} • {med.data.frequency}</Text>
                  </View>
                  {/* Mock next dose logic */}
                  <View style={styles.nextDose}>
                    <Clock size={12} color={Colors.primary[500]} />
                    <Text style={styles.nextDoseText}>8:00 AM</Text>
                  </View>
                </View>
                {index < medications.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </Card>
        </View>

        {/* Diagnosis Timeline */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Diagnoses</Text>
            <Pressable onPress={() => alert('All Diagnoses coming soon')}>
              <Text style={styles.seeAll}>View All</Text>
            </Pressable>
          </View>
          {diagnoses.length === 0 && <Text style={{ color: Colors.dark.textMuted, textAlign: 'center' }}>No recent diagnoses</Text>}
          {diagnoses.map((diagnosis, index) => (
            <Card key={diagnosis._id || index} variant="elevated" style={styles.diagnosisCard}>
              <View style={styles.diagnosisRow}>
                <View style={[
                  styles.diagnosisIcon,
                  { backgroundColor: diagnosis.data.status === 'resolved' ? Colors.success + '20' : Colors.warning + '20' }
                ]}>
                  {diagnosis.data.status === 'resolved' ? (
                    <CheckCircle size={18} color={Colors.success} />
                  ) : (
                    <AlertTriangle size={18} color={Colors.warning} />
                  )}
                </View>
                <View style={styles.diagnosisInfo}>
                  <Text style={styles.diagnosisName}>{diagnosis.title}</Text>
                  <Text style={styles.diagnosisDate}>{new Date(diagnosis.date).toLocaleDateString()}</Text>
                </View>
                <View style={[
                  styles.diagnosisBadge,
                  { backgroundColor: diagnosis.data.status === 'resolved' ? Colors.success + '20' : Colors.warning + '20' }
                ]}>
                  <Text style={[
                    styles.diagnosisStatus,
                    { color: diagnosis.data.status === 'resolved' ? Colors.success : Colors.warning }
                  ]}>
                    {diagnosis.data.status ? (diagnosis.data.status.charAt(0).toUpperCase() + diagnosis.data.status.slice(1)) : 'Active'}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <Button
              title="New Symptom Check"
              icon={<Activity size={18} color="#FFFFFF" />}
              onPress={() => router.push('/(main)/symptom-check')}
              style={{ flex: 1, marginRight: Spacing.sm }}
            />
            <Button
              title="Upload Report"
              variant="outline"
              icon={<FileText size={18} color={Colors.primary[500]} />}
              onPress={() => router.push('/(main)/documents/upload')}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    marginBottom: Spacing.xl,
  },
  scoreCard: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.xl,
  },
  scoreValue: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  scoreStatus: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
    lineHeight: Typography.fontSize.xs * 1.5,
  },
  section: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  seeAll: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[500],
    fontWeight: '500',
  },
  addVitalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addVitalText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[500],
    fontWeight: '500',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  vitalCard: {
    width: (width - Spacing.xl * 2 - Spacing.md) / 2,
    padding: Spacing.base,
  },
  vitalIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  vitalLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
    marginBottom: 4,
  },
  vitalValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  vitalValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.dark.text,
    marginRight: 4,
  },
  vitalUnit: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
  },
  vitalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vitalTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
  },
  conditionsCard: {
    padding: Spacing.base,
  },
  conditionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  conditionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  conditionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  conditionName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  conditionSince: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  conditionBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  conditionStatus: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginVertical: Spacing.sm,
  },
  medicationsCard: {
    padding: Spacing.base,
  },
  medicationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  medIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  medDosage: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  nextDose: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary[500] + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  nextDoseText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary[500],
    fontWeight: '500',
  },
  diagnosisCard: {
    padding: Spacing.base,
    marginBottom: Spacing.sm,
  },
  diagnosisRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diagnosisIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  diagnosisInfo: {
    flex: 1,
  },
  diagnosisName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  diagnosisDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  diagnosisBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  diagnosisStatus: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  bottomSpacing: {
    height: 40,
  },
});
