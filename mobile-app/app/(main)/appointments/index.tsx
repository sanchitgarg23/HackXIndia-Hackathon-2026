import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  Video,
  Building2,
  User,
  ChevronRight,
} from 'lucide-react-native';
import { PageHeader, Card, Button } from '../../../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../../../constants/theme';

const mockAppointments = {
  upcoming: [
    {
      id: '1',
      type: 'teleconsult',
      doctorName: 'Dr. Priya Sharma',
      specialty: 'General Physician',
      date: '2024-01-22',
      time: '10:00 AM',
      status: 'confirmed',
    },
    {
      id: '2',
      type: 'clinic',
      doctorName: 'Dr. Rajesh Kumar',
      specialty: 'Cardiologist',
      date: '2024-01-25',
      time: '3:30 PM',
      location: 'Apollo Clinic, Sector 17',
      status: 'confirmed',
    },
  ],
  past: [
    {
      id: '3',
      type: 'teleconsult',
      doctorName: 'Dr. Anita Singh',
      specialty: 'Dermatologist',
      date: '2024-01-10',
      time: '11:00 AM',
      status: 'completed',
    },
    {
      id: '4',
      type: 'clinic',
      doctorName: 'Dr. Priya Sharma',
      specialty: 'General Physician',
      date: '2024-01-05',
      time: '4:00 PM',
      status: 'completed',
    },
  ],
};

export default function AppointmentsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const appointments = activeTab === 'upcoming' ? mockAppointments.upcoming : mockAppointments.past;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'completed':
        return Colors.primary[500];
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.dark.textMuted;
    }
  };

  const renderAppointment = ({ item }: { item: typeof mockAppointments.upcoming[0] }) => (
    <Pressable onPress={() => router.push(`/(main)/appointments/${item.id}`)}>
      <Card variant="elevated" style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <View style={styles.typeContainer}>
            {item.type === 'teleconsult' ? (
              <View style={[styles.typeIcon, { backgroundColor: Colors.primary[500] + '20' }]}>
                <Video size={18} color={Colors.primary[500]} />
              </View>
            ) : (
              <View style={[styles.typeIcon, { backgroundColor: Colors.accent[500] + '20' }]}>
                <Building2 size={18} color={Colors.accent[500]} />
              </View>
            )}
            <Text style={styles.typeText}>
              {item.type === 'teleconsult' ? 'Video Consult' : 'Clinic Visit'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.doctorInfo}>
          <View style={styles.doctorAvatar}>
            <User size={24} color={Colors.dark.textMuted} />
          </View>
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{item.doctorName}</Text>
            <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
          </View>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Calendar size={16} color={Colors.dark.textMuted} />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Clock size={16} color={Colors.dark.textMuted} />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
          {'location' in item && item.location && (
            <View style={styles.detailRow}>
              <MapPin size={16} color={Colors.dark.textMuted} />
              <Text style={styles.detailText} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          )}
        </View>

        {activeTab === 'upcoming' && (
          <View style={styles.appointmentActions}>
            {item.type === 'teleconsult' && (
              <Button
                title="Join Call"
                size="sm"
                onPress={() => {}}
                icon={<Video size={16} color="#FFFFFF" />}
                style={{ flex: 1, marginRight: Spacing.sm }}
              />
            )}
            <Button
              title="Reschedule"
              variant="outline"
              size="sm"
              onPress={() => alert('Rescheduling functionality coming soon')}
              style={{ flex: 1 }}
            />
          </View>
        )}
      </Card>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PageHeader
        title="Appointments"
        subtitle={`${mockAppointments.upcoming.length} upcoming visits`}
        rightAction={
          <Pressable
            style={styles.addButton}
            onPress={() => router.push('/(main)/appointments/book')}
          >
            <Plus size={20} color="#FFFFFF" />
          </Pressable>
        }
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
            Upcoming
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
            Past
          </Text>
        </Pressable>
      </View>

      {/* Book CTA for Empty State or List Header */}
      {activeTab === 'upcoming' && (
        <Pressable
          style={styles.bookCTA}
          onPress={() => router.push('/(main)/appointments/book')}
        >
          <LinearGradient
            colors={[Colors.primary[500] + '20', Colors.primary[600] + '10']}
            style={styles.bookGradient}
          >
            <View style={styles.bookIcon}>
              <Calendar size={24} color={Colors.primary[500]} />
            </View>
            <View style={styles.bookText}>
              <Text style={styles.bookTitle}>Book New Appointment</Text>
              <Text style={styles.bookSubtitle}>
                Teleconsult or in-person visit
              </Text>
            </View>
            <ChevronRight size={20} color={Colors.primary[500]} />
          </LinearGradient>
        </Pressable>
      )}

      {/* Appointments List */}
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Calendar size={48} color={Colors.dark.textMuted} />
            <Text style={styles.emptyTitle}>No appointments</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'upcoming'
                ? 'Book your first appointment to get started'
                : 'Your past appointments will appear here'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.base,
    gap: Spacing.md,
  },
  tab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.dark.surface,
  },
  tabActive: {
    backgroundColor: Colors.primary[500],
  },
  tabText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bookCTA: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.base,
  },
  bookGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.primary[500] + '30',
  },
  bookIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary[500] + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  bookText: {
    flex: 1,
  },
  bookTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  bookSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  listContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 120, // Bottom padding for tab bar
    paddingTop: Spacing.base,
  },
  appointmentCard: {
    marginBottom: Spacing.md,
    padding: Spacing.base,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  doctorSpecialty: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  appointmentDetails: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textSecondary,
  },
  appointmentActions: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginTop: Spacing.base,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
