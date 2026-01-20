import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Header, Card } from '../../../components/ui';
import { Colors, Typography, Spacing } from '../../../constants/theme';

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Header title="Appointment Details" showBack />
      <View style={styles.content}>
        <Text style={styles.placeholder}>Appointment ID: {id}</Text>
        <Text style={styles.subtext}>Details coming soon...</Text>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  placeholder: {
    fontSize: Typography.fontSize.lg,
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  subtext: {
    fontSize: Typography.fontSize.base,
    color: Colors.dark.textMuted,
  },
});
