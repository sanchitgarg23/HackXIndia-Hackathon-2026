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
  Mic,
  FileText,
  Calendar,
  AlertCircle,
  Activity,
  Heart,
  Pill,
  ChevronRight,
  Bell,
  Stethoscope,
  Cpu,
} from 'lucide-react-native';
import { PageHeader, Card, Button } from '../../components/ui';
import { Colors, Typography, Spacing, BorderRadius, getHealthScoreColor } from '../../constants/theme';
import { useUserStore, useHealthStore } from '../../stores';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const { healthScore, diagnoses, documents, medications, activeConditions } = useHealthStore();

  const healthColor = getHealthScoreColor(healthScore);
  const greeting = getGreeting();

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <PageHeader
          greeting={greeting}
          title={user?.name || 'Welcome'}
          rightAction={
            <Pressable style={styles.notificationButton}>
              <Bell size={22} color={Colors.dark.text} />
              <View style={styles.notificationDot} />
            </Pressable>
          }
        />

        {/* Health Score Card */}
        <View style={styles.section}>
          <Pressable onPress={() => router.push('/(main)/health-dashboard')}>
            <LinearGradient
              colors={[healthColor.bg + '30', healthColor.bg + '10']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.healthCard}
            >
              <View style={styles.healthCardContent}>
                <View style={styles.healthScoreContainer}>
                  <View style={[styles.healthScoreCircle, { borderColor: healthColor.bg }]}>
                    <Text style={[styles.healthScore, { color: healthColor.bg }]}>
                      {healthScore}
                    </Text>
                  </View>
                  <View style={styles.healthInfo}>
                    <Text style={styles.healthLabel}>Health Score</Text>
                    <Text style={[styles.healthStatus, { color: healthColor.bg }]}>
                      {healthColor.label}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={24} color={Colors.dark.textMuted} />
              </View>

              {/* Active Conditions */}
              {activeConditions.length > 0 && (
                <View style={styles.conditionsContainer}>
                  <Text style={styles.conditionsLabel}>Active Conditions:</Text>
                  <Text style={styles.conditionsText} numberOfLines={1}>
                    {activeConditions.join(', ')}
                  </Text>
                </View>
              )}
            </LinearGradient>
          </Pressable>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <QuickActionCard
              icon={<Mic size={24} color={Colors.primary[500]} />}
              label="Symptom Check"
              color={Colors.primary[500]}
              onPress={() => router.push('/(main)/symptom-check')}
            />
            <QuickActionCard
              icon={<FileText size={24} color={Colors.accent[500]} />}
              label="Upload Report"
              color={Colors.accent[500]}
              onPress={() => router.push('/(main)/documents/upload')}
            />
            <QuickActionCard
              icon={<Calendar size={24} color="#8B5CF6" />}
              label="Book Visit"
              color="#8B5CF6"
              onPress={() => router.push('/(main)/appointments/book')}
            />
            <QuickActionCard
              icon={<Cpu size={24} color="#10B981" />}
              label="Test AI"
              color="#10B981"
              onPress={() => router.push('/(main)/medgemma-test')}
            />
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Overview</Text>
          <View style={styles.statsRow}>
            <StatBox
              icon={<Stethoscope size={20} color={Colors.primary[500]} />}
              value={diagnoses.length || 12}
              label="Diagnoses"
              color={Colors.primary[500]}
            />
            <StatBox
              icon={<FileText size={20} color={Colors.accent[500]} />}
              value={documents.length || 8}
              label="Reports"
              color={Colors.accent[500]}
            />
            <StatBox
              icon={<Pill size={20} color="#F59E0B" />}
              value={medications.filter(m => m.isActive).length || 3}
              label="Medicines"
              color="#F59E0B"
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Pressable onPress={() => alert('Activity History coming soon')}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>

          <Card variant="elevated" style={styles.activityCard}>
            <ActivityItem
              icon={<Mic size={18} color={Colors.primary[500]} />}
              title="Symptom Check Completed"
              subtitle="Mild headache, fatigue - Self-care recommended"
              time="2 hours ago"
              color={Colors.primary[500]}
            />
            <View style={styles.activityDivider} />
            <ActivityItem
              icon={<FileText size={18} color={Colors.accent[500]} />}
              title="Blood Test Report Analyzed"
              subtitle="All parameters within normal range"
              time="Yesterday"
              color={Colors.accent[500]}
            />
            <View style={styles.activityDivider} />
            <ActivityItem
              icon={<Calendar size={18} color="#8B5CF6" />}
              title="Upcoming Appointment"
              subtitle="Dr. Sharma - General Checkup"
              time="Tomorrow, 10:00 AM"
              color="#8B5CF6"
            />
          </Card>
        </View>

        {/* Emergency CTA */}
        <View style={styles.emergencySection}>
          <LinearGradient
            colors={[Colors.error + '20', Colors.error + '10']}
            style={styles.emergencyCard}
          >
            <View style={styles.emergencyContent}>
              <AlertCircle size={32} color={Colors.error} />
              <View style={styles.emergencyText}>
                <Text style={styles.emergencyTitle}>Emergency Assistance</Text>
                <Text style={styles.emergencySubtitle}>
                  Tap for immediate help or to alert emergency contacts
                </Text>
              </View>
            </View>
            <Button
              title="SOS"
              variant="danger"
              size="sm"
              onPress={() => {
                alert('Faking SOS trigger...');
                // In a real app we would use Alert.alert or toast
              }}
            />
          </LinearGradient>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

// Quick Action Card Component
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onPress: () => void;
}

const QuickActionCard: React.FC<QuickActionProps> = ({ icon, label, color, onPress }) => (
  <Pressable style={styles.quickAction} onPress={onPress}>
    <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
      {icon}
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </Pressable>
);

// Stat Box Component
interface StatBoxProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}

const StatBox: React.FC<StatBoxProps> = ({ icon, value, label, color }) => (
  <Card variant="elevated" style={styles.statBox}>
    <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>{icon}</View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel} numberOfLines={1}>{label}</Text>
  </Card>
);

// Activity Item Component
interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  time: string;
  color: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, title, subtitle, time, color }) => (
  <View style={styles.activityItem}>
    <View style={[styles.activityIcon, { backgroundColor: color + '20' }]}>{icon}</View>
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activitySubtitle} numberOfLines={1}>
        {subtitle}
      </Text>
    </View>
    <Text style={styles.activityTime}>{time}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    paddingBottom: Spacing['5xl'],
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
    marginBottom: Spacing.base,
  },
  seeAll: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[500],
    fontWeight: '500',
  },
  notificationButton: {
    padding: Spacing.sm,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  healthCard: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  healthCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  healthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthScoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.base,
  },
  healthScore: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '700',
  },
  healthInfo: {
    justifyContent: 'center',
  },
  healthLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
    marginBottom: 2,
  },
  healthStatus: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
  },
  conditionsContainer: {
    marginTop: Spacing.base,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  conditionsLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
    marginRight: Spacing.xs,
  },
  conditionsText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    width: (width - Spacing.xl * 2 - Spacing.base * 3) / 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.sm, // Reduced padding for better text fit
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '700',
    color: Colors.dark.text,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  activityCard: {
    padding: Spacing.base,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  activityTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
  },
  activityTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
  },
  activityDivider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginVertical: Spacing.sm,
  },
  emergencySection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  emergencyCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emergencyText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  emergencyTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  emergencySubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  bottomSpacing: {
    height: 100,
  },
});
