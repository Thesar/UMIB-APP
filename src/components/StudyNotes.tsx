import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { createStudyNote, listStudyNotes } from '@/data/study-notes';
import { useRemoteData } from '@/hooks/use-remote-data';
import { useAuth } from '@/providers/AuthProvider';
import { Link } from 'expo-router';

import DataState from './DataState';

export default function StudyNotes({ lessonId }: { lessonId: string }) {
  const { user, loading, error } = useAuth();
  if (loading || error) {
    return <DataState title={loading ? 'Loading your session…' : 'Session unavailable'} message={error ?? undefined} loading={loading} />;
  }
  // A different owner gets fresh component state: no old notes or draft leak.
  return <StudyNotesForm key={`${lessonId}:${user?.id ?? 'visitor'}`} lessonId={lessonId} isGuest={!user || !!user.is_anonymous} userId={user?.id} />;
}

function StudyNotesForm({ lessonId, isGuest, userId }: { lessonId: string; isGuest: boolean; userId?: string }) {
  const sessionReady = !!userId;
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const saveInProgress = useRef(false);
  const loadNotes = useCallback(
    (signal: AbortSignal) => listStudyNotes(lessonId, signal, userId),
    [lessonId, userId],
  );
  const { data: notes, loading, error, retry } = useRemoteData(loadNotes);

  async function saveNote() {
    if (saveInProgress.current || !body.trim() || !userId) return;
    saveInProgress.current = true;
    setSaving(true);
    setMessage(null);

    try {
      await createStudyNote(lessonId, body, userId);
      setBody('');
      setMessage('Saved online. Your note will be here when you reopen this lesson.');
      retry();
    } catch {
      setMessage('Your note was not confirmed saved. Check your connection and try again.');
    } finally {
      saveInProgress.current = false;
      setSaving(false);
    }
  }

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>My study notes</Text>
      <Text style={styles.help}>
        Explain the formula in your own words, or write a question to revisit.
        {isGuest ? ' Guest notes stay on this device’s temporary account. Clearing app data loses access.' : ' Your private notes are connected to your account and available on your other devices.'}
      </Text>
      {isGuest ? <Link href={{ pathname: '/account', params: { mode: 'signup' } }} style={styles.link}>Create an account to keep these notes</Link> : null}
      <TextInput
        accessibilityLabel="Study note"
        placeholder="What did you learn about this graph?"
        placeholderTextColor="#94a3b8"
        value={body}
        onChangeText={(text) => { setBody(text); setMessage(null); }}
        editable={!saving && !loading && sessionReady}
        multiline
        maxLength={1000}
        textAlignVertical="top"
        style={styles.input}
      />
      <Text style={styles.counter}>{body.length}/1000</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: saving || !body.trim() || !sessionReady, busy: saving }}
        disabled={saving || !body.trim() || !sessionReady}
        onPress={saveNote}
        style={[styles.button, (saving || !body.trim() || !sessionReady) && styles.disabled]}
      >
        <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save note'}</Text>
      </Pressable>
      {message ? <Text accessibilityLiveRegion="polite" style={styles.status}>{message}</Text> : null}

      <Text style={styles.subheading}>Your latest 20 notes</Text>
      {loading || error ? (
        <DataState
          title={loading ? 'Loading your notes…' : 'Notes unavailable'}
          message={error ?? undefined}
          loading={loading}
          onRetry={loading ? undefined : retry}
        />
      ) : notes?.length ? (
        notes.map((note) => (
          <View key={note.id} style={styles.note}>
            <Text style={styles.noteBody}>{note.body}</Text>
            <Text style={styles.date}>{new Date(note.created_at).toLocaleString()}</Text>
          </View>
        ))
      ) : <Text style={styles.help}>No notes yet. Save your first thought above.</Text>}
      {!loading ? (
        <Pressable accessibilityRole="button" onPress={retry} style={styles.refresh}>
          <Text style={styles.link}>Refresh notes</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 32, gap: 12 },
  heading: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  subheading: { color: '#ffffff', fontSize: 16, fontWeight: '600', marginTop: 12 },
  help: { color: '#94a3b8', fontSize: 14, lineHeight: 22 },
  input: { color: '#ffffff', backgroundColor: '#1e293b', borderColor: '#64748b', borderWidth: 1, borderRadius: 12, padding: 14, minHeight: 110, fontSize: 16 },
  counter: { color: '#94a3b8', fontSize: 12, textAlign: 'right' },
  button: { backgroundColor: '#5b21b6', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '600', fontSize: 16 },
  disabled: { opacity: 0.5 },
  status: { color: '#67e8f9', lineHeight: 22 },
  note: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, gap: 10 },
  noteBody: { color: '#ffffff', fontSize: 16, lineHeight: 24 },
  date: { color: '#94a3b8', fontSize: 12 },
  refresh: { paddingVertical: 12, alignSelf: 'flex-start' },
  link: { color: '#a78bfa', fontWeight: '600' },
});
