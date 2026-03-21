// components/StepRing.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import Svg, { Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors, DAILY_STEP_GOAL } from '../constants/theme';

interface StepRingProps {
  steps: number;
  goal?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function StepRing({ steps, goal = DAILY_STEP_GOAL }: StepRingProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const percent = Math.min(steps / goal, 1);
  const radius = 54;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: percent,
      tension: 40,
      friction: 10,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const ringColor = percent >= 1 ? Colors.healthFull : percent > 0.6 ? Colors.trailGold : Colors.sunOrange;

  return (
    <View style={styles.container}>
      <Svg width="140" height="140" viewBox="0 0 140 140">
        <Defs>
          <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={ringColor} />
            <Stop offset="100%" stopColor={Colors.sunGold} />
          </LinearGradient>
        </Defs>

        {/* Track */}
        <Circle
          cx="70"
          cy="70"
          r={radius}
          stroke={Colors.healthEmpty}
          strokeWidth={strokeWidth}
          fill="none"
          opacity="0.3"
        />

        {/* Progress arc */}
        <AnimatedCircle
          cx="70"
          cy="70"
          r={radius}
          stroke="url(#ringGrad)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin="70,70"
        />

        {/* Tick marks at 25% intervals */}
        {[0, 90, 180, 270].map((angle, i) => {
          const rad = ((angle - 90) * Math.PI) / 180;
          const x1 = 70 + (radius - strokeWidth / 2 - 2) * Math.cos(rad);
          const y1 = 70 + (radius - strokeWidth / 2 - 2) * Math.sin(rad);
          return null; // Decorative ticks can be added here
        })}
      </Svg>

      {/* Center content */}
      <View style={styles.center}>
        <Text style={styles.emoji}>👢</Text>
        <Text style={styles.steps}>{steps.toLocaleString()}</Text>
        <Text style={styles.label}>steps</Text>
        <Text style={styles.goal}>/ {goal.toLocaleString()}</Text>
      </View>

      {/* Percent badge */}
      <View style={[styles.badge, { backgroundColor: percent >= 1 ? Colors.healthFull : Colors.dirtDark }]}>
        <Text style={styles.badgeText}>
          {percent >= 1 ? '✓ GOAL' : `${Math.round(percent * 100)}%`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 140,
    height: 140,
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  steps: {
    color: Colors.parchment,
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  label: {
    color: Colors.parchmentDark,
    fontFamily: 'monospace',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  goal: {
    color: Colors.dirtLight,
    fontFamily: 'monospace',
    fontSize: 9,
    opacity: 0.7,
  },
  badge: {
    position: 'absolute',
    bottom: -6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeText: {
    color: Colors.parchment,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
