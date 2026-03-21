// components/WeekHeatmap.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, DAILY_STEP_GOAL } from '../constants/theme';
import { DayRecord } from '../constants/mockData';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface WeekHeatmapProps {
  history: DayRecord[];
}

export default function WeekHeatmap({ history }: WeekHeatmapProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⬛ This Week's Trail Log</Text>
      <View style={styles.grid}>
        {history.map((day, i) => {
          const pct = Math.min(day.steps / DAILY_STEP_GOAL, 1);
          const color =
            pct >= 1
              ? Colors.healthFull
              : pct >= 0.7
              ? Colors.trailGold
              : pct >= 0.4
              ? Colors.sunOrange
              : Colors.healthLow;

          const label = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });

          return (
            <View key={i} style={styles.dayCol}>
              <View
                style={[
                  styles.daySquare,
                  {
                    backgroundColor: color,
                    opacity: pct < 0.1 ? 0.2 : pct,
                    borderColor: day.goalMet ? Colors.trailGold : 'transparent',
                    borderWidth: day.goalMet ? 1.5 : 0,
                  },
                ]}
              >
                {day.goalMet && <Text style={styles.check}>✓</Text>}
              </View>
              <Text style={styles.dayLabel}>{label}</Text>
              <Text style={styles.stepCount}>
                {day.steps >= 1000 ? `${(day.steps / 1000).toFixed(1)}k` : day.steps}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.healthFull }]} />
          <Text style={styles.legendText}>Goal met</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.trailGold }]} />
          <Text style={styles.legendText}>70%+</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.healthLow }]} />
          <Text style={styles.legendText}>Below 40%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    color: Colors.parchment,
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
    flex: 1,
  },
  daySquare: {
    width: 36,
    height: 36,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  check: {
    color: Colors.inkDark,
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayLabel: {
    color: Colors.parchmentDark,
    fontFamily: 'monospace',
    fontSize: 9,
    textTransform: 'uppercase',
  },
  stepCount: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 8,
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendText: {
    color: Colors.parchmentDark,
    fontFamily: 'monospace',
    fontSize: 9,
  },
});
