import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="word" options={{ headerShown: false }} />
      <Stack.Screen name="definition" options={{ headerShown: false }} />
      <Stack.Screen name="add-word" options={{ headerShown: false }} />
      <Stack.Screen name="dictionary-list" options={{ headerShown: false }} />
    </Stack>
  );
}
