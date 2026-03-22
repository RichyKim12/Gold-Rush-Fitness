// app/(tabs)/index.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { MILESTONES, TRAIL_TOTAL_MILES } from '../../constants/theme';
import { useAppData } from '../../hooks/useAppData';
import WagonScene from '../../components/WagonScene';
import HealthBar from '../../components/HealthBar';
import StepRing from '../../components/StepRing';
import WeekHeatmap from '../../components/WeekHeatmap';
import { useRouter } from 'expo-router';


export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { state, isLoading, error } = useAppData();

  // Guard against loading state — don't check for zero values
  if (isLoading || error) {
    return (
      <LinearGradient
        colors={[colors.gradientTop, colors.gradientBottom]}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={{ color: colors.parchment, fontSize: 14 }}>{error || 'Loading trail data...'}</Text>
      </LinearGradient>
    );
  }

  const progressPercent = (state.trailMiles / TRAIL_TOTAL_MILES) * 100;
  const nextMilestone = MILESTONES.find((m) => m.mile > state.trailMiles) || MILESTONES[MILESTONES.length - 1];
  const prevMilestone = [...MILESTONES].reverse().find((m) => m.mile <= state.trailMiles) || MILESTONES[0];
  const milesFromNext = nextMilestone.mile - state.trailMiles;

  const s = makeStyles(colors);

  return (
    <LinearGradient
      colors={[colors.gradientTop, colors.gradientBottom]}
      style={s.root}
    >
      <StatusBar barStyle={colors.parchment === '#f2e8d0' ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.eyebrow}>🪵 Day 39 on the Trail</Text>
            <Text style={s.title}>
              {state.playerName}'s{'\n'}Wagon Party
            </Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.streakBadge}>🔥 {state.currentStreak}</Text>
            <Text style={s.streakLabel}>day streak</Text>
          </View>
        </View>

        {/* WAGON SCENE */}
        <View style={s.sceneCard}>
          <WagonScene
            progressPercent={progressPercent}
            milesFromNext={milesFromNext}
            nextMilestone={nextMilestone.name}
          />
          <View style={s.locationRow}>
            <View style={s.locationItem}>
              <Text style={s.locationLabel}>Last Stop</Text>
              <Text style={s.locationValue}>
                {prevMilestone.emoji} {prevMilestone.name}
              </Text>
            </View>
            <View style={s.locationDivider} />
            <View style={s.locationItem}>
              <Text style={s.locationLabel}>Next Stop</Text>
              <Text style={s.locationValue}>
                {nextMilestone.emoji} {nextMilestone.name}
              </Text>
            </View>
            <View style={s.locationDivider} />
            <View style={s.locationItem}>
              <Text style={s.locationLabel}>Miles</Text>
              <Text style={s.locationValue}>
                📍 {state.trailMiles.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* PARTY STATUS STRIP */}
        <View style={s.statusStrip}>
          <View style={s.statusItem}>
            <Text style={s.statusIcon}>🍖</Text>
            <Text style={s.statusLabel}>Rations</Text>
            <Text style={s.statusValue}>{state.rations}</Text>
          </View>
          <View style={s.statusItem}>
            <Text style={s.statusIcon}>🐂</Text>
            <Text style={s.statusLabel}>Pace</Text>
            <Text style={s.statusValue}>{state.pace}</Text>
          </View>
          <View style={s.statusItem}>
            <Text style={s.statusIcon}>👨‍👩‍👧‍👦</Text>
            <Text style={s.statusLabel}>Party</Text>
            <Text style={s.statusValue}>{state.partySize} members</Text>
          </View>
        </View>

        {/* STEPS + HEALTH ROW */}
        <View style={s.statsRow}>
          <View style={s.stepsCard}>
            <Text style={s.cardTitle}>TODAY'S MARCH</Text>
            <View style={{ alignItems: 'center' }}>
              <StepRing steps={state.todaySteps} />
            </View>
            <TouchableOpacity
              style={[s.logButton, { alignSelf: 'flex-end' }]}
              onPress={() => router.push('/steps')}
            >
              <Text style={s.logButtonText}>View Details →</Text>
            </TouchableOpacity>
          </View>

          <View style={s.healthCard}>
            <Text style={s.cardTitle}>PARTY HEALTH</Text>
            <HealthBar score={state.healthScore} label="Your Vitality" showDetails />
            <HealthBar score={Math.max(0, state.healthScore - 8)} label="Oxen Strength" />
            <HealthBar score={Math.max(0, state.healthScore - 15)} label="Wagon Condition" />
            <TouchableOpacity
              style={s.logButton}
              onPress={() => router.push('/health')}
            >
              <Text style={s.logButtonText}>Full Report →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* WEEK HEATMAP */}
        <WeekHeatmap history={state.weekHistory} />

        {/* REWARDS PREVIEW */}
        <TouchableOpacity
          style={s.rewardsPreview}
          onPress={() => router.push('/rewards')}
        >
          <View style={s.rewardsLeft}>
            <Text style={s.rewardsTitle}>🏆 Rewards & Badges</Text>
            <Text style={s.rewardsSub}>
              {state.unlockedRewards.length} unlocked · Keep marching!
            </Text>
          </View>
          <Text style={s.rewardsArrow}>→</Text>
        </TouchableOpacity>

        {/* DAILY TIP */}
        <View style={s.tipBox}>
          <Text style={s.tipIcon}>📜</Text>
          <Text style={s.tipText}>
            "A pioneer in good health can cover 15–20 miles a day. Your{' '}
            {(10000).toLocaleString()} daily steps keep the party strong!"
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    root: { flex: 1 },
    scroll: { padding: 16, paddingTop: 52, gap: 12 },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    eyebrow: {
      color: colors.trailGold,
      // fontFamily: 'monospace',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 4,
    },
    title: {
      color: colors.parchment,
      fontSize: 26,
      fontWeight: 'bold',
      lineHeight: 30,
      // fontFamily: 'serif',
    },
    headerRight: {
      alignItems: 'center',
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    streakBadge: { fontSize: 24, color: colors.parchment, },
    streakLabel: {
      color: colors.parchmentDark,
      // fontFamily: 'monospace',
      fontSize: 9,
      textTransform: 'uppercase',
    },
    sceneCard: {
      backgroundColor: colors.bgCard,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    locationRow: {
      flexDirection: 'row',
      padding: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    locationItem: { flex: 1, alignItems: 'center' },
    locationDivider: {
      width: 1,
      backgroundColor: colors.border,
      marginHorizontal: 8,
    },
    locationLabel: {
      color: colors.dirtLight,
      // fontFamily: 'monospace',
      fontSize: 9,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 3,
    },
    locationValue: {
      color: colors.parchment,
      // fontFamily: 'monospace',
      fontSize: 10,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    statusStrip: {
      flexDirection: 'row',
      backgroundColor: colors.bgCard,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    statusItem: {
      flex: 1,
      alignItems: 'center',
      padding: 10,
      borderRightWidth: 1,
      borderRightColor: colors.border,
    },
    statusIcon: { fontSize: 18, marginBottom: 2 },
    statusLabel: {
      color: colors.dirtLight,
      // fontFamily: 'monospace',
      fontSize: 9,
      textTransform: 'uppercase',
    },
    statusValue: {
      color: colors.parchment,
      // fontFamily: 'monospace',
      fontSize: 10,
      fontWeight: 'bold',
      marginTop: 2,
    },
    statsRow: { flexDirection: 'row', gap: 10 },

    stepsCard: {
      flex: 1,
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
      justifyContent: 'space-between',  // ← pushes button to bottom
    },
    healthCard: {
      flex: 1.4,
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 10,
    },
    cardTitle: {
      color: colors.trailGold,
      // fontFamily: 'monospace',
      fontSize: 9,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 4,
      alignSelf: 'flex-start',
    },
    logButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
      alignSelf: 'flex-end',
    },
    logButtonText: {
      color: colors.trailGold,
      // fontFamily: 'monospace',
      fontSize: 10,
    },
    rewardsPreview: {
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    rewardsLeft: { flex: 1 },
    rewardsTitle: {
      color: colors.parchment,
      // fontFamily: 'monospace',
      fontSize: 14,
      fontWeight: 'bold',
    },
    rewardsSub: {
      color: colors.dirtLight,
      // fontFamily: 'monospace',
      fontSize: 10,
      marginTop: 3,
    },
    rewardsArrow: { color: colors.trailGold, fontSize: 20 },
    tipBox: {
      flexDirection: 'row',
      backgroundColor: colors.bgCardLight,
      borderRadius: 8,
      padding: 12,
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
    },
    tipIcon: { fontSize: 18 },
    tipText: {
      color: colors.parchmentDark,
      // fontFamily: 'monospace',
      fontSize: 11,
      flex: 1,
      lineHeight: 16,
      fontStyle: 'italic',
    },
  });
}