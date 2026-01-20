import { Stack } from 'expo-router';
import { Colors } from '../../../constants/theme';

export default function DocumentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.dark.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="upload" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
