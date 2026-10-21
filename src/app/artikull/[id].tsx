
import { Link, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { getLesson } from "../../data/lessons";

export default function LessonDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLesson(id);

  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Lesson not found.</Text>
        <Link href="/" style={styles.back}>
          Back to lessons
        </Link>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.category}>{lesson.category}</Text>

      <Text style={styles.title}>{lesson.title}</Text>

      <View style={styles.formulaBox}>
        <Text style={styles.formula}>{lesson.formula}</Text>
      </View>

      <Text style={styles.heading}>What does it mean?</Text>

      <Text style={styles.description}>
        {lesson.explanation}
      </Text>

      <Link href="/" style={styles.back}>
        ← Back to lessons
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#0b1020",
  },
  category: {
    color: "#a78bfa",
    fontSize: 14,
    marginBottom: 14,
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 24,
  },
  formulaBox: {
    backgroundColor: "#1e293b",
    padding: 24,
    borderRadius: 16,
    marginBottom: 28,
  },
  formula: {
    color: "#67e8f9",
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
  },
  heading: {
    color: "#ffffff",
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 14,
  },
  description: {
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 27,
  },
  back: {
    color: "#a78bfa",
    fontSize: 16,
    marginTop: 35,
    marginBottom: 60,
  },
});
