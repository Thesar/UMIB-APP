
import { useState } from "react";
import { Link } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";

import Karta from "../components/Karta";
import { lessons } from "../data/lessons";

export default function HomeScreen() {
  const [calculusOnly, setCalculusOnly] = useState(false);

  const visibleLessons = calculusOnly
    ? lessons.filter((item) => item.category === "Calculus")
    : lessons;

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SCREAMULUS</Text>

      <Text style={styles.title}>
        Mathematics, but louder.
      </Text>

      <Text style={styles.subtitle}>
        Explore mathematical ideas before turning
        them into sound and motion.
      </Text>

      <Pressable
        style={styles.filter}
        onPress={() => setCalculusOnly(!calculusOnly)}
      >
        <Text style={styles.filterText}>
          {calculusOnly
            ? "Show all lessons"
            : "Show calculus only"}
        </Text>
      </Pressable>

      <FlatList
        data={visibleLessons}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/artikull/[id]",
              params: { id: item.id },
            }}
            asChild
          >
            <Pressable>
              <Karta
                title={item.title}
                category={item.category}
                summary={item.summary}
              />
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1020",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  logo: {
    color: "#a78bfa",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 3,
    marginBottom: 14,
  },
  title: {
    color: "#ffffff",
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  filter: {
    backgroundColor: "#312e81",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  filterText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  list: {
    paddingBottom: 32,
  },
});
