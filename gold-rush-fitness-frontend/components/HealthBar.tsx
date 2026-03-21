// components/HealthBar.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

interface HealthBarProps {
  score: number; // 0–100
  label: string;
  showDetails?: boolean;
}

function getHealthColor(score: number): string {
  if (score >= 70) return Colors.healthFull;
  if (score >= 40) return Colors.healthGood;
  if (score >= 20) return Colors.healthLow;
  return Colors.healthEmpty;
}

function getHealthLabel(score: number): string {
  if (score >= 80) return 'Excellent Health';
  if (score >= 60) return 'Good Health';
  if (score >= 40) return 'Fair Health';
  if (score >= 20) return 'Poor Health';
  return 'Critical!';
}

export default function HealthBar({ score, label, showDetails = false }: HealthBarProps) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: score / 100,
      tension: 50,
      friction: 8,
      useNativeDriver: false,
    }).start();

    if (score < 30) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.98,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [score]);

  const color = getHealthColor(score);
  const statusLabel = getHealthLabel(score);

  // Pixel-art style segments
  const segments = 20;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pulseAnim }] }]}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {showDetails && (
          <Text style={[styles.status, { color }]}>{statusLabel}</Text>
        )}
        <Text style={[styles.score, { color }]}>{score}%</Text>
      </View>

      {/* Pixel-segmented bar */}
      <View style={styles.barTrack}>
        <View style={styles.barBackground}>
          {Array.from({ length: segments }).map((_, i) => {
            const threshold = ((i + 1) / segments) * 100;
            const filled = score >= threshold;
            const segColor = getHealthColor(Math.min(score, threshold));
            return (
              <View
                key={i}
                style={[
                  styles.segment,
                  {
                    backgroundColor: filled ? segColor : Colors.healthEmpty,
                    opacity: filled ? 1 : 0.3,
                  },
                ]}
              />
            );
          })}
        </View>
        {/* Skull at empty end */}
        <Text style={styles.emptyIcon}>💀</Text>
        {/* Heart at full end */}
        <Text style={styles.fullIcon}>❤️</Text>
      </View>

      {showDetails && (
        <Text style={styles.hint}>
          Based on your consistency meeting daily step goals
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    color: Colors.parchmentDark,
    fontFamily: 'monospace',
    fontSize: 12,
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  status: {
    fontFamily: 'monospace',
    fontSize: 11,
    marginRight: 8,
  },
  score: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
  },
  barTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barBackground: {
    flex: 1,
    flexDirection: 'row',
    gap: 2,
    height: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(30, 18, 6, 0.5)',
    borderRadius: 2,
    padding: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segment: {
    flex: 1,
    height: 12,
    borderRadius: 1,
  },
  emptyIcon: {
    fontSize: 14,
  },
  fullIcon: {
    fontSize: 14,
  },
  hint: {
    color: Colors.parchmentDark,
    fontFamily: 'monospace',
    fontSize: 9,
    marginTop: 4,
    opacity: 0.6,
    fontStyle: 'italic',
  },
});