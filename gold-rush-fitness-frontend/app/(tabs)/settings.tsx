// app/(tabs)/settings.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, ThemePreference } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen() {
  const { preference, setPreference, colors, activeTheme } = useTheme();
  const { logout, displayName } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn('Logout failed', e);
    }
  };

  const options: { label: string; value: ThemePreference; icon: string; sub: string }[] = [
    {
      label: 'Dark Mode',
      value: 'dark',
      icon: '🌑',
      sub: 'Classic trail look — campfire nights',
    },
    {
      label: 'Light Mode',
      value: 'light',
      icon: '☀️',
      sub: 'Bright prairie days',
    },
    {
      label: 'Follow System',
      value: 'system',
      icon: '📱',
      sub: 'Matches your device setting',
    },
  ];

  const s = makeStyles(colors);

  return (
    <LinearGradient
      colors={[colors.gradientTop, colors.gradientBottom]}
      style={s.root}
    >
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.screenTitle}>⚙️ Settings</Text>
        <Text style={s.screenSub}>Customize your trail experience</Text>

        {/* Appearance */}
        <View style={s.card}>
          <Text style={s.cardTitle}>APPEARANCE</Text>

          {options.map((opt) => {
            const active = preference === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[s.optionRow, active && s.optionRowActive]}
                onPress={() => setPreference(opt.value)}
                activeOpacity={0.7}
              >
                <Text style={s.optionIcon}>{opt.icon}</Text>
                <View style={s.optionText}>
                  <Text style={[s.optionLabel, active && s.optionLabelActive]}>
                    {opt.label}
                  </Text>
                  <Text style={s.optionSub}>{opt.sub}</Text>
                </View>
                <View style={[s.radioOuter, active && s.radioOuterActive]}>
                  {active && <View style={s.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Current state info */}
        <View style={s.infoBox}>
          <Text style={s.infoText}>
            Currently showing:{' '}
            <Text style={{ color: colors.trailGold, fontWeight: 'bold' }}>
              {activeTheme === 'dark' ? '🌑 Dark Mode' : '☀️ Light Mode'}
            </Text>
            {preference === 'system' ? '  (from system)' : ''}
          </Text>
        </View>

        {/* About */}
        <View style={s.card}>
          <Text style={s.cardTitle}>ABOUT</Text>
          <View style={s.aboutRow}>
            <Text style={s.aboutLabel}>Version</Text>
            <Text style={s.aboutValue}>1.0.0</Text>
          </View>
          <View style={[s.aboutRow, { borderBottomWidth: 0 }]}>
            <Text style={s.aboutLabel}>Trail Length</Text>
            <Text style={s.aboutValue}>2,170 miles</Text>
          </View>
        </View>

        {/* Account */}
        <View style={s.card}>
          <Text style={s.cardTitle}>ACCOUNT</Text>
          {displayName ? (
            <View style={s.aboutRow}>
              <Text style={s.aboutLabel}>Pioneer</Text>
              <Text style={s.aboutValue}>{displayName}</Text>
            </View>
          ) : null}
          <TouchableOpacity style={s.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
            <Text style={s.logoutIcon}>🚪</Text>
            <Text style={s.logoutText}>Leave the Trail (Log Out)</Text>
          </TouchableOpacity>
        </View>

        <View style={s.tipBox}>
          <Text style={s.tipText}>
            📜 "Whether you travel by day or night, the trail to Oregon awaits."
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function makeStyles(colors: ReturnType<typeof import('../../context/ThemeContext').useTheme>['colors']) {
  return StyleSheet.create({
    root: { flex: 1 },
    scroll: { padding: 16, paddingTop: 52, gap: 14 },
    screenTitle: {
      color: colors.parchment,
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: 'serif',
    },
    screenSub: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 12,
      fontStyle: 'italic',
      marginBottom: 4,
    },
    card: {
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 4,
    },
    cardTitle: {
      color: colors.trailGold,
      fontFamily: 'monospace',
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 8,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'transparent',
      marginBottom: 4,
    },
    optionRowActive: {
      borderColor: colors.border,
      backgroundColor: colors.bgCardLight,
    },
    optionIcon: { fontSize: 22 },
    optionText: { flex: 1 },
    optionLabel: {
      color: colors.parchmentDark,
      fontFamily: 'monospace',
      fontSize: 13,
      fontWeight: 'bold',
    },
    optionLabelActive: {
      color: colors.parchment,
    },
    optionSub: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 9,
      marginTop: 2,
    },
    radioOuter: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: colors.dirtLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOuterActive: {
      borderColor: colors.trailGold,
    },
    radioInner: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.trailGold,
    },
    infoBox: {
      backgroundColor: colors.bgCardLight,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoText: {
      color: colors.parchmentDark,
      fontFamily: 'monospace',
      fontSize: 11,
    },
    aboutRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    aboutLabel: {
      color: colors.parchmentDark,
      fontFamily: 'monospace',
      fontSize: 12,
    },
    aboutValue: {
      color: colors.parchment,
      fontFamily: 'monospace',
      fontSize: 12,
      fontWeight: 'bold',
    },
    tipBox: {
      backgroundColor: colors.bgCardLight,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
    },
    tipText: {
      color: colors.parchmentDark,
      fontFamily: 'monospace',
      fontSize: 11,
      lineHeight: 17,
      fontStyle: 'italic',
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderRadius: 8,
      backgroundColor: 'rgba(200, 50, 50, 0.15)',
      borderWidth: 1,
      borderColor: 'rgba(200, 50, 50, 0.4)',
      marginTop: 8,
    },
    logoutIcon: {
      fontSize: 20,
    },
    logoutText: {
      color: '#e05555',
      fontFamily: 'monospace',
      fontSize: 12,
      fontWeight: 'bold',
    },
  });
}