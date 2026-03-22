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
import StepRing from '../../components/StepRing';
import WeekHeatmap from '../../components/WeekHeatmap';
import { useRouter } from 'expo-router';
import { TrailIcon, StreakIcon, PinIcon, TrophyIcon, DehydrationIcon, HealthIcon } from '../../components/PixelIcons';

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

  // Mock hydration data — replace with real state later
  const hydrationDaysMissed: number = 1;
  const hydrationStreak = 5;
  const hydrationPct = Math.max(0, Math.min(1, 1 - hydrationDaysMissed / 7));
  const hydrationRisk = hydrationDaysMissed === 0 ? 'None' : hydrationDaysMissed <= 1 ? 'Low' : hydrationDaysMissed <= 3 ? 'Medium' : hydrationDaysMissed <= 6 ? 'High' : 'Critical';
  const hydrationColor = hydrationRisk === 'None' ? colors.healthFull : hydrationRisk === 'Low' ? colors.healthGood : hydrationRisk === 'Medium' ? colors.healthLow : colors.healthEmpty;

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

        {/* VITALITY BAR */}
        <TouchableOpacity style={s.vitalityCard} onPress={() => router.push('/health')} activeOpacity={0.85}>
          <View style={s.vitalityHeader}>
            <View style={s.vitalityTitleRow}>
              <HealthIcon size={14} />
              <Text style={s.vitalityTitle}>Overall Vitality</Text>
            </View>
            <View style={s.vitalityScoreRow}>
              <Text style={[s.vitalityScoreNum, { color: colors.healthFull }]}>{state.healthScore}</Text>
              <Text style={s.vitalityScoreMax}> / 100</Text>
            </View>
          </View>
          <View style={s.vitalityBarTrack}>
            <View style={[s.vitalityBarFill, {
              width: `${state.healthScore}%`,
              backgroundColor: state.healthScore >= 70 ? colors.healthFull : state.healthScore >= 40 ? colors.healthGood : colors.healthLow,
            }]} />
          </View>
          <View style={s.vitalityFooter}>
            <Text style={s.vitalityHint}>
              {state.healthScore >= 70 ? '💪 Party is healthy' : state.healthScore >= 40 ? '⚠️ Health declining' : '🚨 Critical condition'}
            </Text>
            <Text style={s.vitalityLink}>Full Report →</Text>
          </View>
        </TouchableOpacity>

        {/* STEPS + HYDRATION ROW */}
        <View style={s.statsRow}>
          
          {/* Steps card */}
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

          {/* Hydration card */}
          <TouchableOpacity style={s.hydrationCard} onPress={() => router.push('/health')} activeOpacity={0.85}>
            <View style={s.hydrationHeader}>
              <DehydrationIcon size={18} />
              <Text style={s.cardTitle}>HYDRATION</Text>
            </View>

            <View style={[s.riskBadge, { backgroundColor: `${hydrationColor}22`, borderColor: hydrationColor }]}>
              <Text style={[s.riskText, { color: hydrationColor }]}>{hydrationRisk} Risk</Text>
            </View>

            <View style={s.hydrationBarTrack}>
              <View style={[s.hydrationBarFill, { width: `${hydrationPct * 100}%`, backgroundColor: hydrationColor }]} />
            </View>

            <View style={s.hydrationStats}>
              <View style={s.hydrationStat}>
                <Text style={[s.hydrationStatValue, { color: colors.parchment }]}>{hydrationStreak}</Text>
                <Text style={s.hydrationStatLabel}>Day Streak</Text>
              </View>
              <View style={s.hydrationDivider} />
              <View style={s.hydrationStat}>
                <Text style={[s.hydrationStatValue, { color: hydrationColor }]}>{hydrationDaysMissed}</Text>
                <Text style={s.hydrationStatLabel}>Days Missed</Text>
              </View>
            </View>

            {hydrationDaysMissed >= 2 && (
              <View style={[s.hydrationWarning, { borderColor: hydrationColor }]}>
                <Text style={[s.hydrationWarningText, { color: hydrationColor }]}>
                  {7 - hydrationDaysMissed}d until Critical
                </Text>
              </View>
            )}

            <TouchableOpacity style={s.logButton} onPress={() => router.push('/health')}>
              <Text style={s.logButtonText}>Log Water →</Text>
            </TouchableOpacity>
          </TouchableOpacity>
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

    // Vitality card
    vitalityCard: {
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 14,
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    vitalityHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    vitalityTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    vitalityTitle: {
      color: colors.trailGold,
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    vitalityScoreRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    vitalityScoreNum: {
      fontSize: 22,
      fontWeight: 'bold',
      fontFamily: 'monospace',
    },
    vitalityScoreMax: {
      color: colors.dirtLight,
      fontSize: 12,
      fontFamily: 'monospace',
      marginBottom: 1,
    },
    vitalityBarTrack: {
      height: 8,
      backgroundColor: colors.bgCardLight,
      borderRadius: 4,
      overflow: 'hidden',
    },
    vitalityBarFill: {
      height: '100%',
      borderRadius: 4,
    },
    vitalityFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    vitalityHint: {
      color: colors.dirtLight,
      fontSize: 10,
      fontFamily: 'monospace',
    },
    vitalityLink: {
      color: colors.trailGold,
      fontSize: 10,
      fontFamily: 'monospace',
    },

    // Stats row
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
    hydrationCard: {
      flex: 1,
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
      justifyContent: 'space-between',
    },
    hydrationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    riskBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      borderWidth: 1,
    },
    riskText: {
      fontFamily: 'monospace',
      fontSize: 10,
      fontWeight: 'bold',
    },
    hydrationBarTrack: {
      height: 6,
      backgroundColor: colors.bgCardLight,
      borderRadius: 3,
      overflow: 'hidden',
    },
    hydrationBarFill: {
      height: '100%',
      borderRadius: 3,
    },
    hydrationStats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    hydrationStat: {
      flex: 1,
      alignItems: 'center',
    },
    hydrationDivider: {
      width: 1,
      height: 24,
      backgroundColor: colors.border,
    },
    hydrationStatValue: {
      fontFamily: 'monospace',
      fontSize: 18,
      fontWeight: 'bold',
    },
    hydrationStatLabel: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 2,
      textAlign: 'center',
    },
    hydrationWarning: {
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    hydrationWarningText: {
      fontFamily: 'monospace',
      fontSize: 9,
      fontWeight: 'bold',
      textAlign: 'center',
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
