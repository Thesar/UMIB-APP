import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';

export default function AccountBanner() {
  const { user } = useAuth();
  const member = !!user && !user.is_anonymous;
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{member ? 'Your study notes are connected to your account.' : 'Guest mode · Explore lessons and try saving a note.'}</Text>
      <Link href={{ pathname: '/account', params: { mode: member ? 'signin' : 'signup' } }} style={styles.link}>
        {member ? 'Manage account' : 'Create an account to keep your notes'}
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { padding: 14, borderRadius: 12, backgroundColor: '#171d36', marginBottom: 16, gap: 10 },
  text: { color: '#cbd5e1', fontSize: 13, lineHeight: 20 },
  link: { color: '#c4b5fd', fontSize: 13, fontWeight: '600', paddingVertical: 4 },
});
