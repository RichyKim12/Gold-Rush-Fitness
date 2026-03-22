// app/(tabs)/rewards.tsx — Rewards & Achievements Screen
import React, { useState, useRef, useEffect } from 'react';
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
import { TrophyIcon, CoinIcon, LightningIcon } from '../../components/PixelIcons';
import { useAppData } from '../../hooks/useAppData';

type Filter = 'all' | 'unlocked' | 'locked';

const TRAIL_MAP_WIDTH = 2800;
const TRAIL_MAP_HEIGHT = 140;
const TRAIL_H_PADDING = 100;

export default function RewardsScreen() {
  const { colors } = useTheme();
  const { state, isLoading, error } = useAppData();
  const [filter, setFilter] = useState<Filter>('all');
  const trailScrollRef = useRef<ScrollView>(null);
  const [scrollViewWidth, setScrollViewWidth] = useState(300);

  const progressPercent = (state.trailMiles / TRAIL_TOTAL_MILES) * 100;
  const wagonX = TRAIL_H_PADDING + (progressPercent / 100) * TRAIL_MAP_WIDTH;

  const scrollToWagon = (animated = true) => {
    trailScrollRef.current?.scrollTo({
      x: Math.max(0, wagonX - scrollViewWidth / 2),
      animated,
    });
  };

  // ✅ useEffect moved above early return
  useEffect(() => {
    if (isLoading || error) return;
    const timer = setTimeout(() => scrollToWagon(false), 100);
    return () => clearTimeout(timer);
  }, [isLoading, error]);

  if (isLoading || error) {
    return (
      <LinearGradient
        colors={[colors.gradientTop, colors.gradientBottom]}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={{ color: colors.parchment, fontSize: 14 }}>{error || 'Loading rewards...'}</Text>
      </LinearGradient>
    );
  }

  const filtered = REWARDS.filter((r) => {
    if (filter === 'unlocked') return state.unlockedRewards.includes(r.id);
    if (filter === 'locked') return !state.unlockedRewards.includes(r.id);
    return true;
  });

  const s = makeStyles(colors);

  return (
    <LinearGradient
      colors={[colors.gradientTop, colors.gradientBottom]}
      style={s.root}
    >
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <View style={s.titleRow}>
          <TrophyIcon size={22} />
          <Text style={s.screenTitle}>Rewards & Badges</Text>
        </View>
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
          <View style={s.trailCardHeader}>
            <View>
              <Text style={s.cardTitle}>TRAIL PROGRESS MAP</Text>
              <Text style={s.trailStats}>
                {state.trailMiles.toLocaleString()} / {TRAIL_TOTAL_MILES.toLocaleString()} mi
                {' '}· {progressPercent.toFixed(1)}% complete
              </Text>
            </View>
            <TouchableOpacity
              style={[s.jumpBtn, { borderColor: colors.trailGold }]}
              onPress={() => scrollToWagon(true)}
              activeOpacity={0.7}
            >
              <CoinIcon size={13} />
              <Text style={[s.jumpBtnLabel, { color: colors.trailGold }]}>My Position</Text>
            </TouchableOpacity>
          </View>

          <View
            style={s.trailScrollWrapper}
            onLayout={(e) => setScrollViewWidth(e.nativeEvent.layout.width)}
          >
            <ScrollView
              ref={trailScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={s.trailScroll}
              contentContainerStyle={{ width: TRAIL_MAP_WIDTH + TRAIL_H_PADDING * 2, paddingVertical: 8 }}
            >
              <View style={{ width: TRAIL_MAP_WIDTH + TRAIL_H_PADDING * 2, height: TRAIL_MAP_HEIGHT + 100 }}>

                <View
                  style={[
                    s.trailVisitedBg,
                    { left: TRAIL_H_PADDING, width: Math.max(0, wagonX - TRAIL_H_PADDING) },
                  ]}
                />

                <View style={[s.trailLine, { left: TRAIL_H_PADDING, width: TRAIL_MAP_WIDTH }]} />
                <View style={[s.trailLineFill, { left: TRAIL_H_PADDING, width: wagonX - TRAIL_H_PADDING }]} />

                {Array.from({ length: Math.floor(TRAIL_TOTAL_MILES / 100) }).map((_, i) => {
                  const mile = (i + 1) * 100;
                  const x = TRAIL_H_PADDING + (mile / TRAIL_TOTAL_MILES) * TRAIL_MAP_WIDTH;
                  const passed = state.trailMiles >= mile;
                  return (
                    <View key={`tick-${i}`} style={[s.tickMark, { left: x }]}>
                      <View style={[s.tickLine, { backgroundColor: passed ? colors.trailGold : colors.dirtDark, opacity: 0.5 }]} />
                      <Text style={[s.tickLabel, { color: passed ? colors.trailGold : colors.dirtLight, opacity: passed ? 0.7 : 0.4 }]}>
                        {mile}
                      </Text>
                    </View>
                  );
                })}

                {MILESTONES.map((m, i) => {
                  const x = TRAIL_H_PADDING + (m.mile / TRAIL_TOTAL_MILES) * TRAIL_MAP_WIDTH;
                  const passed = state.trailMiles >= m.mile;
                  return (
                    <View key={i} style={[s.milestoneDot, { left: x, transform: [{ translateX: -40 }] }]}>
                      <View style={[s.milestonePip, {
                        backgroundColor: passed ? colors.trailGold : colors.dirtDark,
                        borderColor: passed ? colors.parchment : colors.dirtLight,
                        opacity: passed ? 1 : 0.5,
                      }]} />
                      <Text style={[s.milestoneEmoji, { opacity: passed ? 1 : 0.35 }]}>
                        {m.emoji}
                      </Text>
                      <Text style={[s.milestoneName, { color: passed ? colors.parchment : colors.parchmentDark, opacity: passed ? 1 : 0.45 }]}>
                        {m.name.split(',')[0]}
                      </Text>
                    </View>
                  );
                })}

                {/* Wagon marker */}
                <View style={[s.wagonMarker, { left: wagonX - 14 }]}>
                  <CoinIcon size={28} />
                  <View style={[s.wagonNeedle, { backgroundColor: colors.trailGold }]} />
                </View>

              </View>
            </ScrollView>

            <LinearGradient
              colors={[colors.bgCard, `${colors.bgCard}00`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.fadeLeft}
              pointerEvents="none"
            />
            <LinearGradient
              colors={[`${colors.bgCard}00`, colors.bgCard]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.fadeRight}
              pointerEvents="none"
            />
          </View>
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
            <LightningIcon size={32} />
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
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
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
      paddingTop: 14,
      paddingHorizontal: 14,
      paddingBottom: 10,
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    trailCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    cardTitle: {
      color: colors.trailGold,
      fontFamily: 'monospace',
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    trailStats: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 10,
      marginTop: 2,
    },
    jumpBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    jumpBtnLabel: {
      fontFamily: 'monospace',
      fontSize: 10,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    trailScrollWrapper: {
      position: 'relative',
      height: TRAIL_MAP_HEIGHT + 112,
      marginHorizontal: -14,
    },
    trailScroll: {
      flex: 1,
    },
    trailVisitedBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      backgroundColor: `${colors.trailGold}0a`,
    },
    trailLine: {
      position: 'absolute',
      top: TRAIL_MAP_HEIGHT / 2 + 8,
      left: 0,
      height: 6,
      backgroundColor: colors.dirtDark,
      borderRadius: 3,
    },
    trailLineFill: {
      position: 'absolute',
      top: TRAIL_MAP_HEIGHT / 2 + 8,
      left: 0,
      height: 6,
      backgroundColor: colors.trailGold,
      borderRadius: 3,
    },
    tickMark: {
      position: 'absolute',
      top: TRAIL_MAP_HEIGHT / 2 + 16,
      alignItems: 'center',
    },
    tickLine: {
      width: 1,
      height: 8,
    },
    tickLabel: {
      fontFamily: 'monospace',
      fontSize: 12,
      marginTop: 2,
    },
    milestoneDot: {
      position: 'absolute',
      top: TRAIL_MAP_HEIGHT / 2 + 5,
      alignItems: 'center',
    },
    milestonePip: {
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 1.5,
    },
    milestoneEmoji: {
      fontSize: 28,
      marginTop: 22,
    },
    milestoneName: {
      fontFamily: 'monospace',
      fontSize: 13,
      textAlign: 'center',
      marginTop: 4,
    },
    milestoneAbove: {},
    milestoneBelow: {},
    wagonMarker: {
      position: 'absolute',
      top: TRAIL_MAP_HEIGHT / 2 - 50,
      width: 28,
      alignItems: 'center',
    },
    wagonNeedle: {
      width: 2,
      height: 28,
      borderRadius: 1,
      opacity: 0.6,
    },
    fadeLeft: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 24,
    },
    fadeRight: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: 24,
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
      flexBasis: '47%',
      flexGrow: 1,
      flexShrink: 1,
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 12,
      gap: 6,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      minHeight: 200,
      justifyContent: 'space-between',
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
      fontSize: 13,
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
      fontSize: 12,
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