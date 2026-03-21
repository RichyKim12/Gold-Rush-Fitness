// app/(auth)/login.tsx — Oregon Trail themed login screen
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const { colors } = useTheme();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await login(email.trim().toLowerCase(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.detail || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const s = makeStyles(colors);

  return (
    <LinearGradient colors={[colors.gradientTop, colors.gradientBottom]} style={s.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.flex}
      >
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={s.header}>
            <Text style={s.logo}>🪵</Text>
            <Text style={s.title}>The Oregon Trail</Text>
            <Text style={s.subtitle}>FITNESS TRACKER</Text>
          </View>

          {/* Login card */}
          <View style={s.card}>
            <Text style={s.cardTitle}>SIGN IN TO YOUR WAGON</Text>

            <View style={s.field}>
              <Text style={s.label}>📧 Trail Name (Email)</Text>
              <TextInput
                style={s.input}
                placeholder="pioneer@trail.com"
                placeholderTextColor={colors.dirtLight}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={s.field}>
              <Text style={s.label}>🔑 Password</Text>
              <TextInput
                style={s.input}
                placeholder="••••••••"
                placeholderTextColor={colors.dirtLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            {error && (
              <View style={s.errorBox}>
                <Text style={s.errorText}>⚠️ {error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[s.button, loading && s.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.inkDark} />
              ) : (
                <Text style={s.buttonText}>Mount Up →</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Register link */}
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={s.linkText}>
              New to the trail?{' '}
              <Text style={s.linkHighlight}>Join a wagon party</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    root: { flex: 1 },
    flex: { flex: 1 },
    scroll: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 24,
      gap: 20,
    },
    header: { alignItems: 'center', gap: 4 },
    logo: { fontSize: 48, marginBottom: 8 },
    title: {
      color: colors.parchment,
      fontSize: 28,
      fontWeight: 'bold',
      fontFamily: 'serif',
    },
    subtitle: {
      color: colors.trailGold,
      fontFamily: 'monospace',
      fontSize: 11,
      letterSpacing: 4,
      textTransform: 'uppercase',
    },
    card: {
      backgroundColor: colors.bgCard,
      borderRadius: 12,
      padding: 20,
      gap: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: {
      color: colors.trailGold,
      fontFamily: 'monospace',
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 4,
    },
    field: { gap: 6 },
    label: {
      color: colors.parchmentDark,
      fontFamily: 'monospace',
      fontSize: 11,
    },
    input: {
      backgroundColor: colors.bgCardLight,
      borderRadius: 8,
      padding: 12,
      color: colors.parchment,
      fontFamily: 'monospace',
      fontSize: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    errorBox: {
      backgroundColor: `${colors.healthLow}22`,
      borderRadius: 6,
      padding: 10,
      borderWidth: 1,
      borderColor: colors.healthLow,
    },
    errorText: {
      color: colors.healthLow,
      fontFamily: 'monospace',
      fontSize: 11,
    },
    button: {
      backgroundColor: colors.trailGold,
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 4,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: {
      color: colors.inkDark,
      fontFamily: 'monospace',
      fontSize: 14,
      fontWeight: 'bold',
    },
    linkText: {
      color: colors.parchmentDark,
      fontFamily: 'monospace',
      fontSize: 12,
      textAlign: 'center',
    },
    linkHighlight: {
      color: colors.trailGold,
      fontWeight: 'bold',
    },
  });
}
