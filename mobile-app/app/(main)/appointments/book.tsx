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
import {
  Video,
  Building2,
  User,
  Calendar,
  Clock,
  ChevronRight,
  Check,
  MapPin,
} from 'lucide-react-native';
import { Header, Card, Button } from '../../../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../../../constants/theme';

const consultTypes = [
  {
    id: 'teleconsult',
    icon: Video,
    title: 'Video Consultation',
    description: 'Connect with a doctor from home',
    duration: '15-30 mins',
    price: '₹299',
  },
  {
    id: 'clinic',
    icon: Building2,
    title: 'Clinic Visit',
    description: 'In-person consultation at a clinic',
    duration: '30-45 mins',
    price: '₹499',
  },
];

const mockDoctors = [
  { id: '1', name: 'Dr. Priya Sharma', specialty: 'General Physician', rating: 4.8, experience: '12 years', available: true },
  { id: '2', name: 'Dr. Rajesh Kumar', specialty: 'General Physician', rating: 4.6, experience: '8 years', available: true },
  { id: '3', name: 'Dr. Anita Singh', specialty: 'General Physician', rating: 4.9, experience: '15 years', available: false },
];

const timeSlots = [
  { id: '1', time: '09:00 AM', available: true },
  { id: '2', time: '10:00 AM', available: true },
  { id: '3', time: '11:00 AM', available: false },
  { id: '4', time: '02:00 PM', available: true },
  { id: '5', time: '03:00 PM', available: true },
  { id: '6', time: '04:00 PM', available: true },
];

export default function BookAppointmentScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [consultType, setConsultType] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>('Today');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const handleBook = async () => {
    setIsBooking(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsBooking(false);
    // Replace with push to success screen
    router.push('/(main)/appointments/booking-success');
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Consultation Type</Text>
      <View style={styles.typeCards}>
        {consultTypes.map((type) => (
          <Pressable key={type.id} onPress={() => setConsultType(type.id)}>
            <Card
              variant={consultType === type.id ? 'gradient' : 'elevated'}
              style={[
                styles.typeCard,
                { width: (Dimensions.get('window').width - (Spacing.xl * 2) - Spacing.md) / 2 },
                consultType === type.id && styles.typeCardSelected,
              ]}
            >
              <View style={[
                styles.typeIcon,
                { backgroundColor: consultType === type.id ? Colors.primary[500] + '30' : Colors.dark.surface }
              ]}>
                <type.icon
                  size={28}
                  color={consultType === type.id ? Colors.primary[500] : Colors.dark.textMuted}
                />
              </View>
              <Text style={styles.typeTitle}>{type.title}</Text>
              <Text style={styles.typeDescription}>{type.description}</Text>
              <View style={styles.typeMeta}>
                <Text style={styles.typeDuration}>{type.duration}</Text>
                <Text style={styles.typePrice}>{type.price}</Text>
              </View>
              {consultType === type.id && (
                <View style={styles.selectedBadge}>
                  <Check size={14} color="#FFFFFF" />
                </View>
              )}
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Doctor</Text>
      <View style={styles.doctorList}>
        {mockDoctors.map((doctor) => (
          <Pressable
            key={doctor.id}
            onPress={() => doctor.available && setSelectedDoctor(doctor.id)}
            disabled={!doctor.available}
          >
            <Card
              variant={selectedDoctor === doctor.id ? 'gradient' : 'elevated'}
              style={[
                styles.doctorCard,
                !doctor.available && styles.doctorCardDisabled,
                selectedDoctor === doctor.id && { borderColor: Colors.primary[500] }
              ]}
            >
              <View style={styles.doctorAvatar}>
                <User size={24} color={Colors.dark.textMuted} />
              </View>
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                <View style={styles.doctorMeta}>
                  <Text style={styles.doctorRating}>⭐ {doctor.rating}</Text>
                  <Text style={styles.doctorExperience}>{doctor.experience}</Text>
                </View>
              </View>
              {doctor.available ? (
                selectedDoctor === doctor.id ? (
                  <View style={styles.selectedBadgeSmall}>
                    <Check size={12} color="#FFFFFF" />
                  </View>
                ) : (
                  <View style={{ width: 20 }} /> /* Spacer to prevent shift */
                )
              ) : (
                <Text style={styles.unavailableText}>Unavailable</Text>
              )}
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Date & Time</Text>
      
      {/* Date Selection */}
      <Text style={styles.subTitle}>Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
        {['Today', 'Tomorrow', 'Jan 22', 'Jan 23', 'Jan 24'].map((date) => (
          <Pressable
            key={date}
            style={[
              styles.dateChip,
              selectedDate === date && styles.dateChipSelected,
            ]}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={[
              styles.dateChipText,
              selectedDate === date && styles.dateChipTextSelected,
            ]}>
              {date}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Time Selection */}
      <Text style={styles.subTitle}>Available Slots</Text>
      <View style={styles.timeGrid}>
        {timeSlots.map((slot) => (
          <Pressable
            key={slot.id}
            style={[
              styles.timeSlot,
              !slot.available && styles.timeSlotDisabled,
              selectedTime === slot.id && styles.timeSlotSelected,
            ]}
            onPress={() => slot.available && setSelectedTime(slot.id)}
            disabled={!slot.available}
          >
            <Text style={[
              styles.timeSlotText,
              !slot.available && styles.timeSlotTextDisabled,
              selectedTime === slot.id && styles.timeSlotTextSelected,
            ]}>
              {slot.time}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!consultType;
      case 2:
        return !!selectedDoctor;
      case 3:
        return !!selectedDate && !!selectedTime;
      default:
        return false;
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Book Appointment" 
        showBack 
        onBackPress={() => {
          if (step > 1) {
            setStep(step - 1);
          } else {
            router.back();
          }
        }}
      />

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {[1, 2, 3].map((s) => (
          <View key={s} style={styles.progressStep}>
            <View style={[
              styles.progressDot,
              step >= s && styles.progressDotActive,
            ]}>
              {step > s ? (
                <Check size={12} color="#FFFFFF" />
              ) : (
                <Text style={[
                  styles.progressNumber,
                  step >= s && styles.progressNumberActive,
                ]}>
                  {s}
                </Text>
              )}
            </View>
            {s < 3 && (
              <View style={[
                styles.progressLine,
                step > s && styles.progressLineActive,
              ]} />
            )}
          </View>
        ))}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      
        <View style={styles.footerActions}>
          <Button
            title={step === 3 ? (isBooking ? 'Booking...' : 'Confirm Booking') : 'Continue'}
            onPress={step === 3 ? handleBook : () => setStep(step + 1)}
            disabled={!canProceed()}
            loading={isBooking}
            style={styles.continueButton}
          />
          {step > 1 && (
            <Button
              title="Back"
              variant="ghost"
              onPress={() => setStep(step - 1)}
              style={styles.backButton}
            />
          )}
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  progressDotActive: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  progressNumber: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.dark.textMuted,
  },
  progressNumberActive: {
    color: '#FFFFFF',
  },
  progressLine: {
    width: 60,
    height: 2,
    backgroundColor: Colors.dark.border,
    marginHorizontal: Spacing.xs,
  },
  progressLineActive: {
    backgroundColor: Colors.primary[500],
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 120,
  },
  stepContent: {
    paddingTop: Spacing.base,
  },
  stepTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: Spacing.xl,
  },
  subTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xl,
  },
  typeCard: {
    padding: Spacing.xl,
    position: 'relative',
    minHeight: 180,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardSelected: {
    borderColor: Colors.primary[500],
  }, 
  typeCards: {
    gap: Spacing.md,
    flexDirection: 'row', // Align horizontally
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  typeTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.md,
  },
  typeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeDuration: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textMuted,
  },
  typePrice: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.primary[500],
  },
  selectedBadge: {
    position: 'absolute',
    top: Spacing.base,
    right: Spacing.base,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorList: {
    gap: Spacing.md,
  },
  doctorCard: {
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  doctorCardDisabled: {
    opacity: 0.5,
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
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  doctorSpecialty: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  doctorMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: 4,
  },
  doctorRating: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
  },
  doctorExperience: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
  },
  unavailableText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.error,
    fontWeight: '500',
  },
  dateScroll: {
    marginBottom: Spacing.md,
  },
  dateChip: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.dark.surface,
    marginRight: Spacing.sm,
  },
  dateChipSelected: {
    backgroundColor: Colors.primary[500],
  },
  dateChipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  dateChipTextSelected: {
    color: '#FFFFFF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeSlot: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  timeSlotDisabled: {
    opacity: 0.4,
  },
  timeSlotSelected: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  timeSlotText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  timeSlotTextDisabled: {
    color: Colors.dark.textMuted,
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
  footerActions: {
    flexDirection: 'column',
    gap: Spacing.md,
    marginTop: Spacing.xl,
    width: '100%',
  },
  bottomSpacing: {
    height: 100, // Extra space at bottom to clear tabs/safe area
  },
  backButton: {
    width: '100%',
  },
  continueButton: {
    width: '100%',
  },
});
