// app/(tabs)/steps.tsx — Step Tracking Screen
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
import { DAILY_STEP_GOAL, TRAIL_TOTAL_MILES } from '../../constants/theme';
import { MOCK_STATE } from '../../constants/mockData';
import StepRing from '../../components/StepRing';

export default function StepsScreen() {
  const { colors } = useTheme();
  const state = MOCK_STATE;
  const [selectedGoal, setSelectedGoal] = useState(DAILY_STEP_GOAL);

  const goals = [6000, 8000, 10000, 12000, 15000];
  const milesEarned = Math.floor(state.todaySteps / 2000);
  const stepsLeft = Math.max(0, selectedGoal - state.todaySteps);
  const minutesLeft = Math.round(stepsLeft / 100);

  const s = makeStyles(colors);

  return (
    <LinearGradient
      colors={[colors.gradientTop, colors.gradientBottom]}
      style={s.root}
    >
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.screenTitle}>📍 Today's March</Text>
        <Text style={s.screenSub}>Every step moves you down the trail</Text>

        {/* Main ring */}
        <View style={s.ringCard}>
          <StepRing steps={state.todaySteps} goal={selectedGoal} />

          <View style={s.statsGrid}>
            <View style={s.statBox}>
              <Text style={s.statValue}>{state.todaySteps.toLocaleString()}</Text>
              <Text style={s.statLabel}>Steps Today</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>{milesEarned}</Text>
              <Text style={s.statLabel}>Trail Miles Earned</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>{stepsLeft.toLocaleString()}</Text>
              <Text style={s.statLabel}>Steps Remaining</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>~{minutesLeft}m</Text>
              <Text style={s.statLabel}>Est. Walk Time</Text>
            </View>
          </View>
        </View>

        {/* Goal selector */}
        <View style={s.goalCard}>
          <Text style={s.cardTitle}>SET DAILY GOAL</Text>
          <View style={s.goalRow}>
            {goals.map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  s.goalChip,
                  selectedGoal === g && s.goalChipActive,
                ]}
                onPress={() => setSelectedGoal(g)}
              >
                <Text style={[
                  s.goalChipText,
                  selectedGoal === g && s.goalChipTextActive,
                ]}>
                  {(g / 1000).toFixed(0)}k
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={s.goalHint}>
            {selectedGoal.toLocaleString()} steps ≈ {Math.round(selectedGoal * 0.0005)} trail miles/day
          </Text>
        </View>

        {/* Hourly breakdown */}
        <View style={s.hourlyCard}>
          <Text style={s.cardTitle}>HOURLY BREAKDOWN</Text>
          <View style={s.hourlyBars}>
            {[2, 5, 3, 8, 6, 4, 7, 9, 11, 8, 6, 7].map((val, i) => (
              <View key={i} style={s.hourBarCol}>
                <View style={s.hourBarTrack}>
                  <View
                    style={[
                      s.hourBar,
                      {
                        height: `${(val / 12) * 100}%`,
                        backgroundColor:
                          val >= 9 ? colors.healthFull : val >= 6 ? colors.trailGold : colors.sunOrange,
                      },
                    ]}
                  />
                </View>
                <Text style={s.hourLabel}>{6 + i}</Text>
              </View>
            ))}
          </View>
          <Text style={s.hourAxisLabel}>Hour of Day (AM/PM)</Text>
        </View>

        {/* Trail conversion note */}
        <View style={s.conversionBox}>
          <Text style={s.conversionTitle}>⬛ How Steps → Trail Miles</Text>
          <Text style={s.conversionText}>
            Every 2,000 steps = 1 trail mile.{'\n'}
            At your goal of {selectedGoal.toLocaleString()} steps/day, you'd cover{' '}
            {(selectedGoal / 2000).toFixed(0)} miles and reach Oregon in{' '}
            {Math.ceil(TRAIL_TOTAL_MILES / (selectedGoal / 2000))} days.
          </Text>
        </View>

        {/* Connect health app */}
        <TouchableOpacity style={s.connectButton}>
          <Text style={s.connectIcon}>📱</Text>
          <View>
            <Text style={s.connectTitle}>Connect Health App</Text>
            <Text style={s.connectSub}>
              Sync real steps from Apple Health or Google Fit
            </Text>
          </View>
          <Text style={s.connectArrow}>→</Text>
        </TouchableOpacity>
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
    ringCard: {
      backgroundColor: colors.bgCard,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      gap: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      width: '100%',
    },
    statBox: {
      width: '47%',
      backgroundColor: colors.bgCardLight,
      borderRadius: 8,
      padding: 10,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    statValue: {
      color: colors.parchment,
      fontFamily: 'monospace',
      fontSize: 22,
      fontWeight: 'bold',
    },
    statLabel: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 9,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginTop: 2,
      textAlign: 'center',
    },
    goalCard: {
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 14,
      gap: 10,
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
    goalRow: {
      flexDirection: 'row',
      gap: 8,
    },
    goalChip: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 6,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.bgCardLight,
    },
    goalChipActive: {
      backgroundColor: colors.trailGold,
      borderColor: colors.trailGold,
    },
    goalChipText: {
      color: colors.parchmentDark,
      fontFamily: 'monospace',
      fontSize: 12,
      fontWeight: 'bold',
    },
    goalChipTextActive: {
      color: colors.inkDark,
    },
    goalHint: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 10,
      fontStyle: 'italic',
    },
    hourlyCard: {
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 14,
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    hourlyBars: {
      flexDirection: 'row',
      height: 80,
      gap: 4,
      alignItems: 'flex-end',
    },
    hourBarCol: {
      flex: 1,
      alignItems: 'center',
      height: '100%',
      gap: 2,
    },
    hourBarTrack: {
      flex: 1,
      width: '100%',
      backgroundColor: colors.bgCardLight,
      borderRadius: 2,
      justifyContent: 'flex-end',
    },
    hourBar: {
      width: '100%',
      borderRadius: 2,
      minHeight: 4,
    },
    hourLabel: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 7,
    },
    hourAxisLabel: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 9,
      textAlign: 'center',
      opacity: 0.6,
    },
    conversionBox: {
      backgroundColor: colors.bgCardLight,
      borderRadius: 8,
      padding: 12,
      gap: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    conversionTitle: {
      color: colors.trailGold,
      fontFamily: 'monospace',
      fontSize: 12,
      fontWeight: 'bold',
    },
    conversionText: {
      color: colors.parchmentDark,
      fontFamily: 'monospace',
      fontSize: 11,
      lineHeight: 17,
    },
    connectButton: {
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
    },
    connectIcon: { fontSize: 24 },
    connectTitle: {
      color: colors.parchment,
      fontFamily: 'monospace',
      fontSize: 13,
      fontWeight: 'bold',
    },
    connectSub: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 10,
      marginTop: 2,
    },
    connectArrow: {
      color: colors.trailGold,
      fontSize: 20,
      marginLeft: 'auto',
    },
  });
}