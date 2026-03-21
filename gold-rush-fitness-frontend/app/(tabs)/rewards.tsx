// app/(tabs)/rewards.tsx — Rewards & Achievements Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, REWARDS, MILESTONES, TRAIL_TOTAL_MILES } from '../../constants/theme';
import { MOCK_STATE } from '../../constants/mockData';

type Filter = 'all' | 'unlocked' | 'locked';

export default function RewardsScreen() {
  const state = MOCK_STATE;
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = REWARDS.filter((r) => {
    if (filter === 'unlocked') return state.unlockedRewards.includes(r.id);
    if (filter === 'locked') return !state.unlockedRewards.includes(r.id);
    return true;
  });

  const progressPercent = (state.trailMiles / TRAIL_TOTAL_MILES) * 100;

  return (
    <LinearGradient
      colors={[Colors.bgDeep, Colors.inkBrown]}
      style={styles.root}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>🏆 Rewards & Badges</Text>
        <Text style={styles.screenSub}>Earn badges by walking the trail</Text>

        {/* Summary stats */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{state.unlockedRewards.length}</Text>
            <Text style={styles.summaryLabel}>Badges Earned</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{REWARDS.length - state.unlockedRewards.length}</Text>
            <Text style={styles.summaryLabel}>Remaining</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{state.currentStreak}</Text>
            <Text style={styles.summaryLabel}>Day Streak</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{state.longestStreak}</Text>
            <Text style={styles.summaryLabel}>Best Streak</Text>
          </View>
        </View>

        {/* Trail progress map */}
        <View style={styles.trailCard}>
          <Text style={styles.cardTitle}>TRAIL PROGRESS MAP</Text>
          <View style={styles.trailMap}>
            {/* Track line */}
            <View style={styles.trailLine} />
            <View style={[styles.trailLineFill, { width: `${progressPercent}%` }]} />

            {/* Milestones */}
            {MILESTONES.map((m, i) => {
              const pct = (m.mile / TRAIL_TOTAL_MILES) * 100;
              const passed = state.trailMiles >= m.mile;
              return (
                <View
                  key={i}
                  style={[styles.milestoneDot, { left: `${pct}%` }]}
                >
                  <Text style={[styles.milestoneEmoji, { opacity: passed ? 1 : 0.35 }]}>
                    {m.emoji}
                  </Text>
                  {i % 2 === 0 ? (
                    <Text style={[styles.milestoneName, styles.milestoneAbove, { opacity: passed ? 1 : 0.4 }]}>
                      {m.name.split(',')[0]}
                    </Text>
                  ) : (
                    <Text style={[styles.milestoneName, styles.milestoneBelow, { opacity: passed ? 1 : 0.4 }]}>
                      {m.name.split(',')[0]}
                    </Text>
                  )}
                </View>
              );
            })}

            {/* Wagon position */}
            <View style={[styles.wagonMarker, { left: `${progressPercent}%` }]}>
              <Text style={styles.wagonEmoji}>🪙</Text>
            </View>
          </View>

          <Text style={styles.trailStats}>
            {state.trailMiles.toLocaleString()} / {TRAIL_TOTAL_MILES.toLocaleString()} miles
            ({progressPercent.toFixed(1)}%)
          </Text>
        </View>

        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {(['all', 'unlocked', 'locked'] as Filter[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Badge grid */}
        <View style={styles.badgeGrid}>
          {filtered.map((reward) => {
            const unlocked = state.unlockedRewards.includes(reward.id);
            const milePct = reward.miles > 0
              ? Math.min(state.trailMiles / reward.miles, 1)
              : 1;

            return (
              <View
                key={reward.id}
                style={[
                  styles.badgeCard,
                  unlocked && styles.badgeCardUnlocked,
                ]}
              >
                {/* Badge icon */}
                <View style={[
                  styles.badgeIconWrap,
                  { backgroundColor: unlocked ? 'rgba(212,160,23,0.15)' : Colors.bgCardLight }
                ]}>
                  <Text style={[styles.badgeIcon, { opacity: unlocked ? 1 : 0.3 }]}>
                    {reward.icon}
                  </Text>
                  {unlocked && (
                    <View style={styles.checkBadge}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </View>

                <Text style={[styles.badgeTitle, { opacity: unlocked ? 1 : 0.5 }]}>
                  {reward.title}
                </Text>
                <Text style={[styles.badgeDesc, { opacity: unlocked ? 0.8 : 0.4 }]}>
                  {reward.description}
                </Text>

                <View style={styles.badgeCondition}>
                  <Text style={styles.conditionText}>{reward.condition}</Text>
                </View>

                {/* Progress toward badge if not unlocked */}
                {!unlocked && reward.miles > 0 && (
                  <View style={styles.badgeProgress}>
                    <View style={styles.badgeProgressBar}>
                      <View
                        style={[
                          styles.badgeProgressFill,
                          { width: `${milePct * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.badgeProgressText}>
                      {Math.round(milePct * 100)}%
                    </Text>
                  </View>
                )}

                {unlocked && (
                  <Text style={styles.unlockedLabel}>✨ EARNED</Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Daily challenge box */}
        <View style={styles.challengeCard}>
          <Text style={styles.cardTitle}>TODAY'S TRAIL CHALLENGE</Text>
          <View style={styles.challengeContent}>
            <Text style={styles.challengeIcon}>⚡</Text>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>Power March</Text>
              <Text style={styles.challengeDesc}>
                Hit 12,000 steps today for a 2x vitality boost
              </Text>
              <View style={styles.challengeProgress}>
                <View style={styles.challengeBar}>
                  <View
                    style={[
                      styles.challengeFill,
                      { width: `${Math.min(state.todaySteps / 12000, 1) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.challengePct}>
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

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 16, paddingTop: 52, gap: 14 },
  screenTitle: {
    color: Colors.parchment,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  screenSub: {
    color: Colors.dirtLight,
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
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryValue: {
    color: Colors.trailGold,
    fontFamily: 'monospace',
    fontSize: 22,
    fontWeight: 'bold',
  },
  summaryLabel: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  trailCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    color: Colors.trailGold,
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
    backgroundColor: Colors.dirtDark,
    borderRadius: 2,
  },
  trailLineFill: {
    position: 'absolute',
    top: 30,
    left: 0,
    height: 4,
    backgroundColor: Colors.trailGold,
    borderRadius: 2,
  },
  milestoneDot: {
    position: 'absolute',
    top: 22,
    alignItems: 'center',
    transform: [{ translateX: -10 }],
  },
  milestoneEmoji: {
    fontSize: 16,
  },
  milestoneName: {
    color: Colors.parchmentDark,
    fontFamily: 'monospace',
    fontSize: 6,
    position: 'absolute',
    width: 50,
    textAlign: 'center',
  },
  milestoneAbove: {
    bottom: 36,
  },
  milestoneBelow: {
    top: 24,
  },
  wagonMarker: {
    position: 'absolute',
    top: 14,
    transform: [{ translateX: -10 }],
  },
  wagonEmoji: {
    fontSize: 18,
  },
  trailStats: {
    color: Colors.dirtLight,
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
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabActive: {
    backgroundColor: Colors.trailGold,
    borderColor: Colors.trailGold,
  },
  filterText: {
    color: Colors.parchmentDark,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  filterTextActive: {
    color: Colors.inkDark,
    fontWeight: 'bold',
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeCard: {
    width: '47%',
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  badgeCardUnlocked: {
    borderColor: 'rgba(212, 160, 23, 0.5)',
    backgroundColor: 'rgba(212, 160, 23, 0.05)',
  },
  badgeIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeIcon: {
    fontSize: 28,
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.healthFull,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: Colors.inkDark,
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeTitle: {
    color: Colors.parchment,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  badgeDesc: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 8,
    textAlign: 'center',
    lineHeight: 12,
  },
  badgeCondition: {
    backgroundColor: Colors.bgCardLight,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  conditionText: {
    color: Colors.trailGold,
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
    backgroundColor: Colors.bgCardLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  badgeProgressFill: {
    height: '100%',
    backgroundColor: Colors.sunOrange,
    borderRadius: 2,
  },
  badgeProgressText: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 8,
  },
  unlockedLabel: {
    color: Colors.trailGold,
    fontFamily: 'monospace',
    fontSize: 9,
    letterSpacing: 1,
  },
  challengeCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(232, 135, 58, 0.4)',
  },
  challengeContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  challengeIcon: {
    fontSize: 32,
  },
  challengeInfo: {
    flex: 1,
    gap: 6,
  },
  challengeTitle: {
    color: Colors.parchment,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
  },
  challengeDesc: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 10,
    lineHeight: 14,
  },
  challengeProgress: {
    gap: 3,
  },
  challengeBar: {
    height: 6,
    backgroundColor: Colors.bgCardLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  challengeFill: {
    height: '100%',
    backgroundColor: Colors.sunOrange,
    borderRadius: 3,
  },
  challengePct: {
    color: Colors.parchmentDark,
    fontFamily: 'monospace',
    fontSize: 9,
  },
});