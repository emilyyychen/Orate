import { Stack } from 'expo-router';

export default function RecordLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="mic-check" />
      <Stack.Screen name="countdown" />
      <Stack.Screen name="recording" />
      <Stack.Screen name="paused" />
      <Stack.Screen name="analysis" />
      <Stack.Screen name="results-ready" />
    </Stack>
  );
}
