import { Stack } from 'expo-router';
import { Colors } from '../../../constants/theme';

export default function AppointmentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.dark.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="book" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
