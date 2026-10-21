
import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  category: string;
  summary: string;
};

export default function Karta({
  title,
  category,
  summary,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.category}>{category}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.summary}>{summary}</Text>
      <Text style={styles.link}>Explore lesson →</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 18,
    marginBottom: 12,
  },
  category: {
    color: "#a78bfa",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  title: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  summary: {
    color: "#cbd5e1",
    fontSize: 14,
    marginBottom: 12,
  },
  link: {
    color: "#67e8f9",
    fontSize: 13,
    fontWeight: "600",
  },
});
