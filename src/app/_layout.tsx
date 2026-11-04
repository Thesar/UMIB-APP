
import { Stack } from "expo-router";
import { useEffect } from "react";

import { watchSessionRefresh } from "../lib/supabase";

export default function RootLayout() {
  useEffect(watchSessionRefresh, []);

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
