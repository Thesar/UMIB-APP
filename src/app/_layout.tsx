
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#111827",
        },
        headerTintColor: "#ffffff",
        contentStyle: {
          backgroundColor: "#0b1020",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Screamulus" }}
      />

      <Stack.Screen
        name="artikull/[id]"
        options={{ title: "Math Lesson" }}
      />
    </Stack>
  );
}
