// app/(tabs)/index.tsx — Home Screen
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
import { Colors, MILESTONES, DAILY_STEP_GOAL, TRAIL_TOTAL_MILES } from '../../constants/theme';
import { MOCK_STATE } from '../../constants/mockData';
import WagonScene from '../../components/WagonScene';
import HealthBar from '../../components/HealthBar';
import StepRing from '../../components/StepRing';
import WeekHeatmap from '../../components/WeekHeatmap';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const state = MOCK_STATE;

  const progressPercent = (state.trailMiles / TRAIL_TOTAL_MILES) * 100;

  // Find next milestone
  const nextMilestone = MILESTONES.find((m) => m.mile > state.trailMiles) || MILESTONES[MILESTONES.length - 1];
  const prevMilestone = [...MILESTONES].reverse().find((m) => m.mile <= state.trailMiles) || MILESTONES[0];
  const milesFromNext = nextMilestone.mile - state.trailMiles;

  return (
    <LinearGradient
      colors={[Colors.bgDeep, Colors.inkBrown]}
      style={styles.root}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>🪵 Day 39 on the Trail</Text>
            <Text style={styles.title}>
              {state.playerName}'s{'\n'}Wagon Party
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.streakBadge}>🔥 {state.currentStreak}</Text>
            <Text style={styles.streakLabel}>day streak</Text>
          </View>
        </View>

        {/* WAGON SCENE */}
        <View style={styles.sceneCard}>
          <WagonScene
            progressPercent={progressPercent}
            milesFromNext={milesFromNext}
            nextMilestone={nextMilestone.name}
          />
          {/* Location info */}
          <View style={styles.locationRow}>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>Last Stop</Text>
              <Text style={styles.locationValue}>
                {prevMilestone.emoji} {prevMilestone.name}
              </Text>
            </View>
            <View style={styles.locationDivider} />
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>Next Stop</Text>
              <Text style={styles.locationValue}>
                {nextMilestone.emoji} {nextMilestone.name}
              </Text>
            </View>
            <View style={styles.locationDivider} />
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>Miles</Text>
              <Text style={styles.locationValue}>
                📍 {state.trailMiles.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* PARTY STATUS STRIP */}
        <View style={styles.statusStrip}>
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>🍖</Text>
            <Text style={styles.statusLabel}>Rations</Text>
            <Text style={styles.statusValue}>{state.rations}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>🐂</Text>
            <Text style={styles.statusLabel}>Pace</Text>
            <Text style={styles.statusValue}>{state.pace}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>👨‍👩‍👧‍👦</Text>
            <Text style={styles.statusLabel}>Party</Text>
            <Text style={styles.statusValue}>{state.partySize} members</Text>
          </View>
        </View>

        {/* STEPS + HEALTH ROW */}
        <View style={styles.statsRow}>
          {/* Step ring */}
          <View style={styles.stepsCard}>
            <Text style={styles.cardTitle}>TODAY'S MARCH</Text>
            <StepRing steps={state.todaySteps} />
            <TouchableOpacity
              style={styles.logButton}
              onPress={() => router.push('/steps')}
            >
              <Text style={styles.logButtonText}>View Details →</Text>
            </TouchableOpacity>
          </View>

          {/* Health bars */}
          <View style={styles.healthCard}>
            <Text style={styles.cardTitle}>PARTY HEALTH</Text>
            <HealthBar score={state.healthScore} label="Your Vitality" showDetails />
            <HealthBar score={Math.max(0, state.healthScore - 8)} label="Oxen Strength" />
            <HealthBar score={Math.max(0, state.healthScore - 15)} label="Wagon Condition" />
            <TouchableOpacity
              style={styles.logButton}
              onPress={() => router.push('/health')}
            >
              <Text style={styles.logButtonText}>Full Report →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* WEEK HEATMAP */}
        <WeekHeatmap history={state.weekHistory} />

        {/* REWARDS PREVIEW */}
        <TouchableOpacity
          style={styles.rewardsPreview}
          onPress={() => router.push('/rewards')}
        >
          <View style={styles.rewardsLeft}>
            <Text style={styles.rewardsTitle}>🏆 Rewards & Badges</Text>
            <Text style={styles.rewardsSub}>
              {state.unlockedRewards.length} unlocked · Keep marching!
            </Text>
          </View>
          <Text style={styles.rewardsArrow}>→</Text>
        </TouchableOpacity>

        {/* DAILY TIP */}
        <View style={styles.tipBox}>
          <Text style={styles.tipIcon}>📜</Text>
          <Text style={styles.tipText}>
            "A pioneer in good health can cover 15–20 miles a day. Your{' '}
            {DAILY_STEP_GOAL.toLocaleString()} daily steps keep the party strong!"
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingTop: 52,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  eyebrow: {
    color: Colors.trailGold,
    fontFamily: 'monospace',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    color: Colors.parchment,
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 30,
    fontFamily: 'serif',
  },
  headerRight: {
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakBadge: {
    fontSize: 24,
  },
  streakLabel: {
    color: Colors.parchmentDark,
    fontFamily: 'monospace',
    fontSize: 9,
    textTransform: 'uppercase',
  },
  sceneCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationRow: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  locationItem: {
    flex: 1,
    alignItems: 'center',
  },
  locationDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  locationLabel: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  locationValue: {
    color: Colors.parchment,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  statusIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  statusLabel: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 9,
    textTransform: 'uppercase',
  },
  statusValue: {
    color: Colors.parchment,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  stepsCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  healthCard: {
    flex: 1.4,
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  cardTitle: {
    color: Colors.trailGold,
    fontFamily: 'monospace',
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
    borderColor: Colors.border,
    alignSelf: 'flex-end',
  },
  logButtonText: {
    color: Colors.trailGold,
    fontFamily: 'monospace',
    fontSize: 10,
  },
  rewardsPreview: {
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rewardsLeft: {
    flex: 1,
  },
  rewardsTitle: {
    color: Colors.parchment,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rewardsSub: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 10,
    marginTop: 3,
  },
  rewardsArrow: {
    color: Colors.trailGold,
    fontSize: 20,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(212, 160, 23, 0.08)',
    borderRadius: 8,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 160, 23, 0.2)',
    marginBottom: 24,
  },
  tipIcon: {
    fontSize: 18,
  },
  tipText: {
    color: Colors.parchmentDark,
    fontFamily: 'monospace',
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
    fontStyle: 'italic',
  },
});