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
import { Colors, DAILY_STEP_GOAL, TRAIL_TOTAL_MILES } from '../../constants/theme';
import { MOCK_STATE } from '../../constants/mockData';
import StepRing from '../../components/StepRing';

export default function StepsScreen() {
  const state = MOCK_STATE;
  const [selectedGoal, setSelectedGoal] = useState(DAILY_STEP_GOAL);

  const goals = [6000, 8000, 10000, 12000, 15000];
  const milesEarned = Math.floor(state.todaySteps / 2000); // 2000 steps = 1 trail mile

  const stepsLeft = Math.max(0, selectedGoal - state.todaySteps);
  const minutesLeft = Math.round(stepsLeft / 100); // ~100 steps/min

  return (
    <LinearGradient
      colors={[Colors.bgDeep, Colors.inkBrown]}
      style={styles.root}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>📍 Today's March</Text>
        <Text style={styles.screenSub}>Every step moves you down the trail</Text>

        {/* Main ring */}
        <View style={styles.ringCard}>
          <StepRing steps={state.todaySteps} goal={selectedGoal} />

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{state.todaySteps.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Steps Today</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{milesEarned}</Text>
              <Text style={styles.statLabel}>Trail Miles Earned</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stepsLeft.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Steps Remaining</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>~{minutesLeft}m</Text>
              <Text style={styles.statLabel}>Est. Walk Time</Text>
            </View>
          </View>
        </View>

        {/* Goal selector */}
        <View style={styles.goalCard}>
          <Text style={styles.cardTitle}>SET DAILY GOAL</Text>
          <View style={styles.goalRow}>
            {goals.map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.goalChip,
                  selectedGoal === g && styles.goalChipActive,
                ]}
                onPress={() => setSelectedGoal(g)}
              >
                <Text style={[
                  styles.goalChipText,
                  selectedGoal === g && styles.goalChipTextActive,
                ]}>
                  {(g / 1000).toFixed(0)}k
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.goalHint}>
            {selectedGoal.toLocaleString()} steps ≈ {Math.round(selectedGoal * 0.0005)} trail miles/day
          </Text>
        </View>

        {/* Hourly breakdown placeholder */}
        <View style={styles.hourlyCard}>
          <Text style={styles.cardTitle}>HOURLY BREAKDOWN</Text>
          <View style={styles.hourlyBars}>
            {[2, 5, 3, 8, 6, 4, 7, 9, 11, 8, 6, 7].map((val, i) => (
              <View key={i} style={styles.hourBarCol}>
                <View style={styles.hourBarTrack}>
                  <View
                    style={[
                      styles.hourBar,
                      {
                        height: `${(val / 12) * 100}%`,
                        backgroundColor:
                          val >= 9 ? Colors.healthFull : val >= 6 ? Colors.trailGold : Colors.sunOrange,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.hourLabel}>{6 + i}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.hourAxisLabel}>Hour of Day (AM/PM)</Text>
        </View>

        {/* Trail conversion note */}
        <View style={styles.conversionBox}>
          <Text style={styles.conversionTitle}>⬛ How Steps → Trail Miles</Text>
          <Text style={styles.conversionText}>
            Every 2,000 steps = 1 trail mile.{'\n'}
            At your goal of {selectedGoal.toLocaleString()} steps/day, you'd cover{' '}
            {(selectedGoal / 2000).toFixed(0)} miles and reach Oregon in{' '}
            {Math.ceil(TRAIL_TOTAL_MILES / (selectedGoal / 2000))} days.
          </Text>
        </View>

        {/* Placeholder: Pedometer connection */}
        <TouchableOpacity style={styles.connectButton}>
          <Text style={styles.connectIcon}>📱</Text>
          <View>
            <Text style={styles.connectTitle}>Connect Health App</Text>
            <Text style={styles.connectSub}>
              Sync real steps from Apple Health or Google Fit
            </Text>
          </View>
          <Text style={styles.connectArrow}>→</Text>
        </TouchableOpacity>
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
  ringCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
  },
  statBox: {
    width: '47%',
    backgroundColor: Colors.bgCardLight,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  statValue: {
    color: Colors.parchment,
    fontFamily: 'monospace',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
    textAlign: 'center',
  },
  goalCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 14,
    gap: 10,
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
    borderColor: Colors.border,
    backgroundColor: Colors.bgCardLight,
  },
  goalChipActive: {
    backgroundColor: Colors.trailGold,
    borderColor: Colors.trailGold,
  },
  goalChipText: {
    color: Colors.parchmentDark,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
  },
  goalChipTextActive: {
    color: Colors.inkDark,
  },
  goalHint: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 10,
    fontStyle: 'italic',
  },
  hourlyCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
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
    backgroundColor: Colors.bgCardLight,
    borderRadius: 2,
    justifyContent: 'flex-end',
  },
  hourBar: {
    width: '100%',
    borderRadius: 2,
    minHeight: 4,
  },
  hourLabel: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 7,
  },
  hourAxisLabel: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 9,
    textAlign: 'center',
    opacity: 0.6,
  },
  conversionBox: {
    backgroundColor: 'rgba(212, 160, 23, 0.08)',
    borderRadius: 8,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(212, 160, 23, 0.2)',
  },
  conversionTitle: {
    color: Colors.trailGold,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
  },
  conversionText: {
    color: Colors.parchmentDark,
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 17,
  },
  connectButton: {
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  connectIcon: { fontSize: 24 },
  connectTitle: {
    color: Colors.parchment,
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
  },
  connectSub: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 10,
    marginTop: 2,
  },
  connectArrow: {
    color: Colors.trailGold,
    fontSize: 20,
    marginLeft: 'auto',
  },
});