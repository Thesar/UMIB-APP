import { Link, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import DataState from '@/components/DataState';
import {
  accountError, guestNoteCount, requestAccountEmail, requestPasswordReset,
  resendAccountEmail, saveAccountPassword, signInAccount, signOutAccount,
  verifyAccountEmail, verifyPasswordReset,
} from '@/data/auth';
import { useAuth } from '@/providers/AuthProvider';

type Mode = 'signin' | 'signup' | 'reset';
type Stage = 'entry' | 'verify' | 'password';
type SwitchAction = 'signin' | 'recovery';

function ActionButton({ title, onPress, disabled = false, secondary = false }: {
  title: string; onPress: () => void; disabled?: boolean; secondary?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled}
      onPress={onPress} style={[styles.button, secondary && styles.secondary, disabled && styles.disabled]}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

export default function AccountScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const { user, loading, error } = useAuth();
  const [mode, setMode] = useState<Mode>(params.mode === 'signup' ? 'signup' : 'signin');
  const [stage, setStage] = useState<Stage>('entry');
  const [email, setEmail] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [switchPrompt, setSwitchPrompt] = useState<{ action: SwitchAction; count: number } | null>(null);
  const inProgress = useRef(false);

  const member = !!user && !user.is_anonymous;
  // This metadata is only a resumable UI hint. Supabase verifies the email and
  // password change, and note access is enforced by auth.uid(), never metadata.
  const needsPassword = member && user.user_metadata.screamulus_setup === 'password_pending';
  const pendingEmail = targetEmail || user?.new_email || email.trim().toLowerCase();
  const visibleStage: Stage = needsPassword ? 'password'
    : stage === 'entry' && mode === 'signup' && user?.new_email ? 'verify' : stage;

  async function run(action: () => Promise<void>) {
    if (inProgress.current) return;
    inProgress.current = true;
    setBusy(true);
    setNotice(null);
    try { await action(); }
    catch (failure) { setNotice(accountError(failure)); }
    finally { inProgress.current = false; setBusy(false); }
  }

  function changeMode(next: Mode) {
    setMode(next);
    setStage('entry');
    setTargetEmail('');
    setCode('');
    setPassword('');
    setConfirmation('');
    setNotice(null);
    setSwitchPrompt(null);
  }

  async function performSwitch(action: SwitchAction) {
    if (action === 'signin') {
      await signInAccount(email, password);
      setPassword('');
      setNotice('Signed in. Your account notes are ready.');
    } else {
      await verifyPasswordReset(pendingEmail, code);
      setStage('password');
      setCode('');
    }
    setSwitchPrompt(null);
  }

  async function checkSwitch(action: SwitchAction) {
    const count = await guestNoteCount();
    if (count > 0) setSwitchPrompt({ action, count });
    else await performSwitch(action);
  }

  function submit() {
    void run(async () => {
      if (visibleStage === 'password') {
        await saveAccountPassword(password, confirmation);
        setPassword('');
        setConfirmation('');
        setStage('entry');
        setMode('signin');
        setNotice(mode === 'reset' ? 'Password updated. You are signed in.' : 'Your account is ready. Your guest notes have been kept.');
      } else if (visibleStage === 'verify') {
        if (mode === 'reset') await checkSwitch('recovery');
        else {
          await verifyAccountEmail(pendingEmail, code);
          setStage('password');
          setCode('');
        }
      } else if (mode === 'signup') {
        setTargetEmail(await requestAccountEmail(email));
        setStage('verify');
        setNotice('Check your inbox for the verification code. Your guest notes stay with this account.');
      } else if (mode === 'reset') {
        setTargetEmail(await requestPasswordReset(email));
        setStage('verify');
        setNotice('If this email has an account, a reset code will arrive shortly.');
      } else {
        if (!email.trim() || !password) { setNotice('Enter your email and password.'); return; }
        await checkSwitch('signin');
      }
    });
  }

  if (loading || error) {
    return <View style={styles.page}><DataState title={loading ? 'Loading your account…' : 'Account unavailable'} loading={loading} message={error ?? undefined} />
      <Link href="/" dismissTo style={styles.link}>Continue as a guest</Link></View>;
  }

  const showAccount = member && !needsPassword && stage !== 'password'
    && !(mode === 'reset' && stage === 'verify');

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
      <Text style={styles.eyebrow}>SCREAMULUS</Text>
      {showAccount ? (
        <>
          <Text style={styles.title}>Your account</Text>
          <Text style={styles.description}>Signed in as {user.email}</Text>
          <Text style={styles.description}>Your private study notes are available whenever you sign in, including on another device.</Text>
          {notice ? <Text accessibilityLiveRegion="polite" style={styles.notice}>{notice}</Text> : null}
          <Link href="/" dismissTo style={styles.link}>Back to lessons</Link>
          <ActionButton title={busy ? 'Signing out…' : 'Sign out'} disabled={busy} secondary onPress={() => {
            void run(async () => {
              await signOutAccount();
              changeMode('signin');
              setNotice('Signed out. You can keep exploring as a guest.');
            });
          }} />
        </>
      ) : switchPrompt ? (
        <>
          <Text style={styles.title}>Switch to an existing account?</Text>
          <Text style={styles.description}>You have {switchPrompt.count} guest notes. Signing in opens the existing account’s notes. Your guest notes will no longer be accessible on this device.</Text>
          <Text style={styles.description}>To keep these guest notes, create a new account here instead.</Text>
          <ActionButton title="Create an account and keep guest notes" disabled={busy} onPress={() => changeMode('signup')} />
          <ActionButton title={busy ? 'Please wait…' : 'Continue to the existing account'} disabled={busy} secondary
            onPress={() => { void run(() => performSwitch(switchPrompt.action)); }} />
          <ActionButton title="Cancel" disabled={busy} secondary onPress={() => setSwitchPrompt(null)} />
          {notice ? <Text accessibilityLiveRegion="polite" style={styles.notice}>{notice}</Text> : null}
        </>
      ) : (
        <>
          <Text style={styles.title}>{visibleStage === 'password' ? 'Set your password'
            : visibleStage === 'verify' ? 'Check your email'
            : mode === 'signup' ? 'Keep your progress'
            : mode === 'reset' ? 'Reset your password' : 'Welcome back'}</Text>
          <Text style={styles.description}>{visibleStage === 'password' ? 'Your email is verified. Use at least 8 characters to finish setting up your password.'
            : visibleStage === 'verify' ? `Enter the code sent to ${pendingEmail}.`
            : mode === 'signup' ? 'Create an account to keep your guest notes and access them on other devices.'
            : mode === 'reset' ? 'Enter your account email to receive a password reset code.'
            : 'Sign in to access your notes. You can also explore every lesson as a guest.'}</Text>

          {visibleStage === 'entry' && mode !== 'reset' ? (
            <View style={styles.tabs}>
              <ActionButton title="Sign in" secondary={mode !== 'signin'} disabled={busy} onPress={() => changeMode('signin')} />
              <ActionButton title="Create account" secondary={mode !== 'signup'} disabled={busy} onPress={() => changeMode('signup')} />
            </View>
          ) : null}

          {visibleStage === 'entry' ? (
            <>
              <Text style={styles.label}>Email</Text>
              <TextInput accessibilityLabel="Email" value={email} onChangeText={setEmail} autoCapitalize="none"
                autoCorrect={false} keyboardType="email-address" autoComplete="email" textContentType="emailAddress"
                editable={!busy} style={styles.input} placeholder="you@example.com" placeholderTextColor="#94a3b8" />
            </>
          ) : null}
          {visibleStage === 'verify' ? (
            <>
              <Text style={styles.label}>Verification code</Text>
              <TextInput accessibilityLabel="Verification code" value={code} onChangeText={(text) => setCode(text.replace(/\D/g, ''))}
                keyboardType="number-pad" autoComplete="one-time-code" textContentType="oneTimeCode"
                maxLength={8} editable={!busy} style={styles.input} placeholder="Email code" placeholderTextColor="#94a3b8" />
            </>
          ) : null}
          {visibleStage === 'password' || (visibleStage === 'entry' && mode === 'signin') ? (
            <>
              <Text style={styles.label}>{visibleStage === 'password' ? 'New password' : 'Password'}</Text>
              <TextInput accessibilityLabel={visibleStage === 'password' ? 'New password' : 'Password'}
                value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" autoCorrect={false}
                textContentType={visibleStage === 'password' ? 'newPassword' : 'password'}
                autoComplete={visibleStage === 'password' ? 'new-password' : 'current-password'}
                editable={!busy} style={styles.input} />
            </>
          ) : null}
          {visibleStage === 'password' ? (
            <>
              <Text style={styles.label}>Confirm password</Text>
              <TextInput accessibilityLabel="Confirm password" value={confirmation} onChangeText={setConfirmation}
                secureTextEntry autoCapitalize="none" autoCorrect={false} textContentType="newPassword"
                autoComplete="new-password" editable={!busy} style={styles.input} />
            </>
          ) : null}

          {notice ? <Text accessibilityLiveRegion="polite" style={styles.notice}>{notice}</Text> : null}
          <ActionButton title={busy ? 'Please wait…' : visibleStage === 'password' ? 'Save password'
            : visibleStage === 'verify' ? 'Verify code' : mode === 'signin' ? 'Sign in to account' : 'Send email code'}
            onPress={submit} disabled={busy} />

          {visibleStage === 'verify' ? <ActionButton title="Resend code" secondary disabled={busy} onPress={() => {
            void run(async () => {
              if (mode === 'reset') await requestPasswordReset(pendingEmail);
              else await resendAccountEmail(pendingEmail);
              setNotice('A new code has been requested. Please check your inbox.');
            });
          }} /> : null}
          {visibleStage === 'entry' && mode === 'signin' ? <ActionButton title="Forgot password?" secondary disabled={busy} onPress={() => changeMode('reset')} /> : null}
          {visibleStage !== 'password' && (visibleStage !== 'entry' || mode === 'reset') ? <ActionButton title="Back to sign in" secondary disabled={busy} onPress={() => changeMode('signin')} /> : null}
          {!busy ? <Link href="/" dismissTo style={styles.link}>{member ? 'Back to lessons' : 'Continue as a guest'}</Link> : null}
          <Text style={styles.footnote}>Guest access includes the lesson library and private notes on this device. Creating a new account here keeps those notes.</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#0b1020' },
  content: { padding: 24, paddingBottom: 64, gap: 16, width: '100%', maxWidth: 560, alignSelf: 'center' },
  eyebrow: { color: '#a78bfa', fontSize: 13, fontWeight: '700', letterSpacing: 3 },
  title: { color: '#ffffff', fontSize: 30, fontWeight: 'bold' },
  description: { color: '#cbd5e1', fontSize: 15, lineHeight: 24 },
  label: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#64748b', color: '#ffffff', backgroundColor: '#1e293b', borderRadius: 12, padding: 15, fontSize: 16, minHeight: 50 },
  button: { backgroundColor: '#5b21b6', padding: 15, borderRadius: 12, alignItems: 'center', minHeight: 48 },
  buttonText: { color: '#ffffff', fontSize: 15, fontWeight: '600', textAlign: 'center' },
  secondary: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#475569' },
  disabled: { opacity: 0.5 },
  tabs: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  notice: { color: '#67e8f9', fontSize: 14, lineHeight: 23 },
  link: { color: '#c4b5fd', fontSize: 15, fontWeight: '600', paddingVertical: 12, textAlign: 'center' },
  footnote: { color: '#94a3b8', fontSize: 13, lineHeight: 21 },
});
