import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  message?: string;
  loading?: boolean;
  onRetry?: () => void;
};

export default function DataState({ title, message, loading, onRetry }: Props) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      {loading ? <ActivityIndicator color="#a78bfa" accessibilityLabel="Loading" /> : null}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {onRetry ? (
        <Pressable accessibilityRole="button" onPress={onRetry} style={styles.button}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 28, gap: 12, alignItems: 'center' },
  title: { color: '#ffffff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  message: { color: '#94a3b8', fontSize: 14, lineHeight: 22, textAlign: 'center' },
  button: { backgroundColor: '#312e81', borderRadius: 12, padding: 14 },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
