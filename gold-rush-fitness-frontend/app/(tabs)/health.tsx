// app/(tabs)/health.tsx — Health Detail Screen
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, DAILY_STEP_GOAL } from '../../constants/theme';
import { MOCK_STATE } from '../../constants/mockData';
import HealthBar from '../../components/HealthBar';

const AILMENTS = [
  { name: 'Dysentery', risk: 'Low', emoji: '🤒', tip: 'Keep up your steps to stay fit' },
  { name: 'Exhaustion', risk: 'Medium', emoji: '😴', tip: 'You missed 2 step goals recently' },
  { name: 'Broken Leg', risk: 'Low', emoji: '🦴', tip: 'Good pace reduces injury risk' },
  { name: 'Cholera', risk: 'Low', emoji: '🤧', tip: 'Consistency keeps illness away' },
];

const RISK_COLORS: Record<string, string> = {
  Low: Colors.healthFull,
  Medium: Colors.healthGood,
  High: Colors.healthLow,
  Critical: Colors.healthEmpty,
};

export default function HealthScreen() {
  const state = MOCK_STATE;

  const daysHit = state.weekHistory.filter((d) => d.goalMet).length;
  const consistency = Math.round((daysHit / 7) * 100);

  return (
    <LinearGradient
      colors={[Colors.bgDeep, Colors.inkBrown]}
      style={styles.root}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>⚕️ Party Health Report</Text>
        <Text style={styles.screenSub}>
          A healthy party moves farther, faster
        </Text>

        {/* Overall health */}
        <View style={styles.overallCard}>
          <View style={styles.overallLeft}>
            <Text style={styles.overallScore}>{state.healthScore}</Text>
            <Text style={styles.overallUnit}>/ 100</Text>
          </View>
          <View style={styles.overallRight}>
            <Text style={styles.overallTitle}>Overall Vitality</Text>
            <Text style={styles.overallSub}>
              Based on {daysHit}/7 goals met this week
            </Text>
            <View style={styles.consistencyRow}>
              <Text style={styles.consistencyLabel}>Consistency</Text>
              <View style={styles.consistencyBar}>
                <View
                  style={[
                    styles.consistencyFill,
                    { width: `${consistency}%`, backgroundColor: Colors.healthFull },
                  ]}
                />
              </View>
              <Text style={styles.consistencyPct}>{consistency}%</Text>
            </View>
          </View>
        </View>

        {/* All health bars */}
        <View style={styles.barsCard}>
          <Text style={styles.cardTitle}>VITALS</Text>
          <HealthBar score={state.healthScore} label="Your Vitality" showDetails />
          <View style={styles.divider} />
          <HealthBar score={Math.max(0, state.healthScore - 8)} label="Oxen Strength" showDetails />
          <View style={styles.divider} />
          <HealthBar score={Math.max(0, state.healthScore - 15)} label="Wagon Condition" showDetails />
          <View style={styles.divider} />
          <HealthBar score={Math.max(0, state.healthScore + 10)} label="Morale" showDetails />
          <View style={styles.divider} />
          <HealthBar score={Math.max(0, state.healthScore - 5)} label="Food Supply" showDetails />
        </View>

        {/* How health is calculated */}
        <View style={styles.formulaCard}>
          <Text style={styles.cardTitle}>HOW IT'S CALCULATED</Text>
          <View style={styles.formulaRow}>
            <Text style={styles.formulaEmoji}>✅</Text>
            <View style={styles.formulaText}>
              <Text style={styles.formulaLabel}>Daily goal met</Text>
              <Text style={styles.formulaValue}>+10 vitality</Text>
            </View>
          </View>
          <View style={styles.formulaRow}>
            <Text style={styles.formulaEmoji}>❌</Text>
            <View style={styles.formulaText}>
              <Text style={styles.formulaLabel}>Goal missed</Text>
              <Text style={styles.formulaValue}>-8 vitality</Text>
            </View>
          </View>
          <View style={styles.formulaRow}>
            <Text style={styles.formulaEmoji}>🔥</Text>
            <View style={styles.formulaText}>
              <Text style={styles.formulaLabel}>7-day streak bonus</Text>
              <Text style={styles.formulaValue}>+15 vitality</Text>
            </View>
          </View>
          <View style={styles.formulaRow}>
            <Text style={styles.formulaEmoji}>⭐</Text>
            <View style={styles.formulaText}>
              <Text style={styles.formulaLabel}>Exceed goal by 20%+</Text>
              <Text style={styles.formulaValue}>+5 extra vitality</Text>
            </View>
          </View>
        </View>

        {/* Ailment risks */}
        <View style={styles.ailmentsCard}>
          <Text style={styles.cardTitle}>AILMENT RISK TRACKER</Text>
          {AILMENTS.map((a, i) => (
            <View key={i} style={styles.ailmentRow}>
              <Text style={styles.ailmentEmoji}>{a.emoji}</Text>
              <View style={styles.ailmentInfo}>
                <Text style={styles.ailmentName}>{a.name}</Text>
                <Text style={styles.ailmentTip}>{a.tip}</Text>
              </View>
              <View style={[
                styles.riskBadge,
                { backgroundColor: `${RISK_COLORS[a.risk]}22`, borderColor: RISK_COLORS[a.risk] }
              ]}>
                <Text style={[styles.riskText, { color: RISK_COLORS[a.risk] }]}>
                  {a.risk}
                </Text>
              </View>
            </View>
          ))}
        </View>

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
  overallCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  overallLeft: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  overallScore: {
    color: Colors.healthFull,
    fontSize: 56,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    lineHeight: 60,
  },
  overallUnit: {
    color: Colors.dirtLight,
    fontSize: 16,
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  overallRight: {
    flex: 1,
    gap: 6,
  },
  overallTitle: {
    color: Colors.parchment,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
  },
  overallSub: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 10,
  },
  consistencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  consistencyLabel: {
    color: Colors.parchmentDark,
    fontFamily: 'monospace',
    fontSize: 9,
    textTransform: 'uppercase',
  },
  consistencyBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.bgCardLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  consistencyFill: {
    height: '100%',
    borderRadius: 3,
  },
  consistencyPct: {
    color: Colors.parchment,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
  },
  barsCard: {
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
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    opacity: 0.5,
  },
  formulaCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formulaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  formulaEmoji: { fontSize: 18 },
  formulaText: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  formulaLabel: {
    color: Colors.parchmentDark,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  formulaValue: {
    color: Colors.trailGold,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ailmentsCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ailmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ailmentEmoji: { fontSize: 20 },
  ailmentInfo: { flex: 1 },
  ailmentName: {
    color: Colors.parchment,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ailmentTip: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 9,
    marginTop: 1,
  },
  riskBadge: {
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
  tipBox: {
    backgroundColor: 'rgba(212, 160, 23, 0.08)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 160, 23, 0.2)',
  },
  tipText: {
    color: Colors.parchmentDark,
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 17,
    fontStyle: 'italic',
  },
});