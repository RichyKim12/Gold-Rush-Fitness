// components/WeekHeatmap.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { DAILY_STEP_GOAL } from '../constants/theme';
import { DayRecord } from '../constants/mockData';

interface WeekHeatmapProps {
  history: DayRecord[];
}

export default function WeekHeatmap({ history }: WeekHeatmapProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, {
      backgroundColor: colors.bgCard,
      borderColor: colors.border,
    }]}>
      <Text style={[styles.title, { color: colors.parchment }]}>
        ⬛ This Week's Trail Log
      </Text>
      <View style={styles.grid}>
        {history.map((day, i) => {
          const pct = Math.min(day.steps / DAILY_STEP_GOAL, 1);
          const color =
            pct >= 1
              ? colors.healthFull
              : pct >= 0.7
              ? colors.trailGold
              : pct >= 0.4
              ? colors.sunOrange
              : colors.healthLow;

          const label = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });

          return (
            <View key={i} style={styles.dayCol}>
              <View
                style={[
                  styles.daySquare,
                  {
                    backgroundColor: color,
                    opacity: pct < 0.1 ? 0.2 : pct,
                    borderColor: day.goalMet ? colors.trailGold : 'transparent',
                    borderWidth: day.goalMet ? 1.5 : 0,
                  },
                ]}
              >
                {day.goalMet && (
                  <Text style={[styles.check, { color: colors.inkDark }]}>✓</Text>
                )}
              </View>
              <Text style={[styles.dayLabel, { color: colors.parchmentDark }]}>
                {label}
              </Text>
              <Text style={[styles.stepCount, { color: colors.dirtLight }]}>
                {day.steps >= 1000 ? `${(day.steps / 1000).toFixed(1)}k` : day.steps}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={[styles.legend, { borderTopColor: colors.border }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.healthFull }]} />
          <Text style={[styles.legendText, { color: colors.parchmentDark }]}>Goal met</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.trailGold }]} />
          <Text style={[styles.legendText, { color: colors.parchmentDark }]}>70%+</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.healthLow }]} />
          <Text style={[styles.legendText, { color: colors.parchmentDark }]}>Below 40%</Text>
        </View>
      </View>
    </View>
  );
}

// Only static layout — no colors
const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
  },
  title: {
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayLabel: {
    fontFamily: 'monospace',
    fontSize: 9,
    textTransform: 'uppercase',
  },
  stepCount: {
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
    fontFamily: 'monospace',
    fontSize: 9,
  },
}); 