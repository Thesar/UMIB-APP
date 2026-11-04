
import { Link, Stack } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text } from "react-native";

import { watchSessionRefresh } from "../lib/supabase";
import { AuthProvider, useAuth } from "../providers/AuthProvider";

function AccountLink() {
  const { user } = useAuth();
  return (
    <Link href="/account" asChild>
      <Pressable accessibilityRole="link" style={{ padding: 10 }}>
        <Text style={{ color: "#c4b5fd", fontWeight: "600" }}>
          {user && !user.is_anonymous ? "Account" : "Sign in"}
        </Text>
      </Pressable>
    </Link>
  );
}

export default function RootLayout() {
  useEffect(watchSessionRefresh, []);

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerRight: () => <AccountLink />,
          headerStyle: { backgroundColor: "#111827" },
          headerTintColor: "#ffffff",
          contentStyle: { backgroundColor: "#0b1020" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Screamulus" }} />
        <Stack.Screen name="artikull/[id]" options={{ title: "Math Lesson" }} />
        <Stack.Screen name="account" options={{ title: "Your account", headerRight: () => null }} />
      </Stack>
    </AuthProvider>
  );
}
