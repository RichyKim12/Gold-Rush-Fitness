// app/(tabs)/rewards.tsx — Rewards & Achievements Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { REWARDS, MILESTONES, TRAIL_TOTAL_MILES } from '../../constants/theme';
import { MOCK_STATE } from '../../constants/mockData';

type Filter = 'all' | 'unlocked' | 'locked';

export default function RewardsScreen() {
  const { colors } = useTheme();
  const state = MOCK_STATE;
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = REWARDS.filter((r) => {
    if (filter === 'unlocked') return state.unlockedRewards.includes(r.id);
    if (filter === 'locked') return !state.unlockedRewards.includes(r.id);
    return true;
  });

  const progressPercent = (state.trailMiles / TRAIL_TOTAL_MILES) * 100;

  const s = makeStyles(colors);

  return (
    <LinearGradient
      colors={[colors.gradientTop, colors.gradientBottom]}
      style={s.root}
    >
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.screenTitle}>🏆 Rewards & Badges</Text>
        <Text style={s.screenSub}>Earn badges by walking the trail</Text>

        {/* Summary stats */}
        <View style={s.summaryRow}>
          <View style={s.summaryBox}>
            <Text style={s.summaryValue}>{state.unlockedRewards.length}</Text>
            <Text style={s.summaryLabel}>Badges Earned</Text>
          </View>
          <View style={s.summaryBox}>
            <Text style={s.summaryValue}>{REWARDS.length - state.unlockedRewards.length}</Text>
            <Text style={s.summaryLabel}>Remaining</Text>
          </View>
          <View style={s.summaryBox}>
            <Text style={s.summaryValue}>{state.currentStreak}</Text>
            <Text style={s.summaryLabel}>Day Streak</Text>
          </View>
          <View style={s.summaryBox}>
            <Text style={s.summaryValue}>{state.longestStreak}</Text>
            <Text style={s.summaryLabel}>Best Streak</Text>
          </View>
        </View>

        {/* Trail progress map */}
        <View style={s.trailCard}>
          <Text style={s.cardTitle}>TRAIL PROGRESS MAP</Text>
          <View style={s.trailMap}>
            <View style={s.trailLine} />
            <View style={[s.trailLineFill, { width: `${progressPercent}%` }]} />

            {MILESTONES.map((m, i) => {
              const pct = (m.mile / TRAIL_TOTAL_MILES) * 100;
              const passed = state.trailMiles >= m.mile;
              return (
                <View key={i} style={[s.milestoneDot, { left: `${pct}%` }]}>
                  <Text style={[s.milestoneEmoji, { opacity: passed ? 1 : 0.35 }]}>
                    {m.emoji}
                  </Text>
                  {i % 2 === 0 ? (
                    <Text style={[s.milestoneName, s.milestoneAbove, { opacity: passed ? 1 : 0.4 }]}>
                      {m.name.split(',')[0]}
                    </Text>
                  ) : (
                    <Text style={[s.milestoneName, s.milestoneBelow, { opacity: passed ? 1 : 0.4 }]}>
                      {m.name.split(',')[0]}
                    </Text>
                  )}
                </View>
              );
            })}

            <View style={[s.wagonMarker, { left: `${progressPercent}%` }]}>
              <Text style={s.wagonEmoji}>🪙</Text>
            </View>
          </View>

          <Text style={s.trailStats}>
            {state.trailMiles.toLocaleString()} / {TRAIL_TOTAL_MILES.toLocaleString()} miles
            ({progressPercent.toFixed(1)}%)
          </Text>
        </View>

        {/* Filter tabs */}
        <View style={s.filterRow}>
          {(['all', 'unlocked', 'locked'] as Filter[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[s.filterTab, filter === f && s.filterTabActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[s.filterText, filter === f && s.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Badge grid */}
        <View style={s.badgeGrid}>
          {filtered.map((reward) => {
            const unlocked = state.unlockedRewards.includes(reward.id);
            const milePct = reward.miles > 0
              ? Math.min(state.trailMiles / reward.miles, 1)
              : 1;

            return (
              <View
                key={reward.id}
                style={[
                  s.badgeCard,
                  unlocked && {
                    borderColor: `${colors.trailGold}80`,
                    backgroundColor: `${colors.trailGold}0d`,
                  },
                ]}
              >
                <View style={[
                  s.badgeIconWrap,
                  { backgroundColor: unlocked ? `${colors.trailGold}26` : colors.bgCardLight },
                ]}>
                  <Text style={[s.badgeIcon, { opacity: unlocked ? 1 : 0.3 }]}>
                    {reward.icon}
                  </Text>
                  {unlocked && (
                    <View style={[s.checkBadge, { backgroundColor: colors.healthFull }]}>
                      <Text style={[s.checkText, { color: colors.inkDark }]}>✓</Text>
                    </View>
                  )}
                </View>

                <Text style={[s.badgeTitle, { opacity: unlocked ? 1 : 0.5 }]}>
                  {reward.title}
                </Text>
                <Text style={[s.badgeDesc, { opacity: unlocked ? 0.8 : 0.4 }]}>
                  {reward.description}
                </Text>

                <View style={s.badgeCondition}>
                  <Text style={s.conditionText}>{reward.condition}</Text>
                </View>

                {!unlocked && reward.miles > 0 && (
                  <View style={s.badgeProgress}>
                    <View style={s.badgeProgressBar}>
                      <View style={[s.badgeProgressFill, { width: `${milePct * 100}%` }]} />
                    </View>
                    <Text style={s.badgeProgressText}>
                      {Math.round(milePct * 100)}%
                    </Text>
                  </View>
                )}

                {unlocked && (
                  <Text style={s.unlockedLabel}>✨ EARNED</Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Daily challenge */}
        <View style={s.challengeCard}>
          <Text style={s.cardTitle}>TODAY'S TRAIL CHALLENGE</Text>
          <View style={s.challengeContent}>
            <Text style={s.challengeIcon}>⚡</Text>
            <View style={s.challengeInfo}>
              <Text style={s.challengeTitle}>Power March</Text>
              <Text style={s.challengeDesc}>
                Hit 12,000 steps today for a 2x vitality boost
              </Text>
              <View style={s.challengeProgress}>
                <View style={s.challengeBar}>
                  <View
                    style={[
                      s.challengeFill,
                      { width: `${Math.min(state.todaySteps / 12000, 1) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={s.challengePct}>
                  {state.todaySteps.toLocaleString()} / 12,000
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </LinearGradient>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors']) {
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
    summaryRow: {
      flexDirection: 'row',
      gap: 8,
    },
    summaryBox: {
      flex: 1,
      backgroundColor: colors.bgCard,
      borderRadius: 8,
      padding: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryValue: {
      color: colors.trailGold,
      fontFamily: 'monospace',
      fontSize: 22,
      fontWeight: 'bold',
    },
    summaryLabel: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 8,
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 2,
    },
    trailCard: {
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 14,
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
    },
    trailMap: {
      height: 80,
      position: 'relative',
      marginHorizontal: 10,
      marginVertical: 20,
    },
    trailLine: {
      position: 'absolute',
      top: 30,
      left: 0,
      right: 0,
      height: 4,
      backgroundColor: colors.dirtDark,
      borderRadius: 2,
    },
    trailLineFill: {
      position: 'absolute',
      top: 30,
      left: 0,
      height: 4,
      backgroundColor: colors.trailGold,
      borderRadius: 2,
    },
    milestoneDot: {
      position: 'absolute',
      top: 22,
      alignItems: 'center',
      transform: [{ translateX: -10 }],
    },
    milestoneEmoji: { fontSize: 16 },
    milestoneName: {
      color: colors.parchmentDark,
      fontFamily: 'monospace',
      fontSize: 6,
      position: 'absolute',
      width: 50,
      textAlign: 'center',
    },
    milestoneAbove: { bottom: 36 },
    milestoneBelow: { top: 24 },
    wagonMarker: {
      position: 'absolute',
      top: 14,
      transform: [{ translateX: -10 }],
    },
    wagonEmoji: { fontSize: 18 },
    trailStats: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 10,
      textAlign: 'center',
    },
    filterRow: {
      flexDirection: 'row',
      gap: 8,
    },
    filterTab: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      borderRadius: 6,
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterTabActive: {
      backgroundColor: colors.trailGold,
      borderColor: colors.trailGold,
    },
    filterText: {
      color: colors.parchmentDark,
      fontFamily: 'monospace',
      fontSize: 12,
    },
    filterTextActive: {
      color: colors.inkDark,
      fontWeight: 'bold',
    },
    badgeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    badgeCard: {
      width: '47%',
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 12,
      gap: 6,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    badgeIconWrap: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    badgeIcon: { fontSize: 28 },
    checkBadge: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 18,
      height: 18,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkText: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    badgeTitle: {
      color: colors.parchment,
      fontFamily: 'monospace',
      fontSize: 11,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    badgeDesc: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 8,
      textAlign: 'center',
      lineHeight: 12,
    },
    badgeCondition: {
      backgroundColor: colors.bgCardLight,
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    conditionText: {
      color: colors.trailGold,
      fontFamily: 'monospace',
      fontSize: 8,
    },
    badgeProgress: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      width: '100%',
    },
    badgeProgressBar: {
      flex: 1,
      height: 4,
      backgroundColor: colors.bgCardLight,
      borderRadius: 2,
      overflow: 'hidden',
    },
    badgeProgressFill: {
      height: '100%',
      backgroundColor: colors.sunOrange,
      borderRadius: 2,
    },
    badgeProgressText: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 8,
    },
    unlockedLabel: {
      color: colors.trailGold,
      fontFamily: 'monospace',
      fontSize: 9,
      letterSpacing: 1,
    },
    challengeCard: {
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 14,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    challengeContent: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
    },
    challengeIcon: { fontSize: 32 },
    challengeInfo: {
      flex: 1,
      gap: 6,
    },
    challengeTitle: {
      color: colors.parchment,
      fontFamily: 'monospace',
      fontSize: 14,
      fontWeight: 'bold',
    },
    challengeDesc: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 10,
      lineHeight: 14,
    },
    challengeProgress: { gap: 3 },
    challengeBar: {
      height: 6,
      backgroundColor: colors.bgCardLight,
      borderRadius: 3,
      overflow: 'hidden',
    },
    challengeFill: {
      height: '100%',
      backgroundColor: colors.sunOrange,
      borderRadius: 3,
    },
    challengePct: {
      color: colors.parchmentDark,
      fontFamily: 'monospace',
      fontSize: 9,
    },
  });
}