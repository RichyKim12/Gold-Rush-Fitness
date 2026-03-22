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
import { MOCK_STATE } from '../../constants/mockData';
import WagonScene from '../../components/WagonScene';
import HealthBar from '../../components/HealthBar';
import StepRing from '../../components/StepRing';
import WeekHeatmap from '../../components/WeekHeatmap';
import { useRouter } from 'expo-router';
import { TrailIcon, StreakIcon, PinIcon, TrophyIcon } from '../../components/PixelIcons';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const state = MOCK_STATE;

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
            <View style={s.eyebrowRow}>
              <TrailIcon size={14} />
              <Text style={s.eyebrow}>Day 39 on the Trail</Text>
            </View>
            <Text style={s.title}>
              {state.playerName}'s{'\n'}Wagon Party
            </Text>
          </View>
          <View style={s.headerRight}>
            <View style={s.streakRow}>
              <StreakIcon size={22} />
              <Text style={s.streakBadge}>{state.currentStreak}</Text>
            </View>
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
              <View style={s.milesRow}>
                <PinIcon size={12} />
                <Text style={s.locationValue}>{state.trailMiles.toLocaleString()}</Text>
              </View>
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
            <View style={s.rewardsTitleRow}>
              <TrophyIcon size={16} />
              <Text style={s.rewardsTitle}>Rewards & Badges</Text>
            </View>
            <Text style={s.rewardsSub}>
              {state.unlockedRewards.length} unlocked · Keep marching!
            </Text>
          </View>
          <Text style={s.rewardsArrow}>→</Text>
        </TouchableOpacity>
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
    eyebrowRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
    },
    eyebrow: {
      color: colors.trailGold,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    title: {
      color: colors.parchment,
      fontSize: 26,
      fontWeight: 'bold',
      lineHeight: 30,
    },
    headerRight: {
      alignItems: 'center',
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    streakRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    streakBadge: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.parchment,
    },
    streakLabel: {
      color: colors.parchmentDark,
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
      fontSize: 9,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 3,
    },
    locationValue: {
      color: colors.parchment,
      fontSize: 10,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    milesRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
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
      fontSize: 9,
      textTransform: 'uppercase',
    },
    statusValue: {
      color: colors.parchment,
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
      justifyContent: 'space-between',
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
    rewardsTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    rewardsTitle: {
      color: colors.parchment,
      fontSize: 14,
      fontWeight: 'bold',
    },
    rewardsSub: {
      color: colors.dirtLight,
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
      fontSize: 11,
      flex: 1,
      lineHeight: 16,
      fontStyle: 'italic',
    },
  });
}
