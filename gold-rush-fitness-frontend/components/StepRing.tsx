// components/StepRing.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { DAILY_STEP_GOAL } from '../constants/theme';
import { StepsIcon } from './PixelIcons';

interface StepRingProps {
  steps: number;
  goal?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function StepRing({ steps, goal = DAILY_STEP_GOAL }: StepRingProps) {
  const { colors } = useTheme();
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

  const ringColor = percent >= 1 ? colors.healthFull : percent > 0.6 ? colors.trailGold : colors.sunOrange;

  return (
    <View style={styles.container}>
      <Svg width="140" height="140" viewBox="0 0 140 140">
        <Defs>
          <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={ringColor} />
            <Stop offset="100%" stopColor={colors.sunGold} />
          </LinearGradient>
        </Defs>

        {/* Track */}
        <Circle
          cx="70"
          cy="70"
          r={radius}
          stroke={colors.healthEmpty}
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
      </Svg>

      {/* Center content */}
      <View style={styles.center}>
        <StepsIcon size={18} />
        <Text style={[styles.steps, { color: colors.parchment }]}>
          {steps.toLocaleString()}
        </Text>
        <Text style={[styles.label, { color: colors.parchmentDark }]}>steps</Text>
        <Text style={[styles.goal, { color: colors.dirtLight }]}>
          / {goal.toLocaleString()}
        </Text>
      </View>

      {/* Percent badge */}
      <View style={[
        styles.badge,
        {
          backgroundColor: percent >= 1 ? colors.healthFull : colors.dirtDark,
          borderColor: colors.border,
        },
      ]}>
        <Text style={[styles.badgeText, { color: colors.parchment }]}>
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
  steps: {
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
    marginTop: 2,
  },
  label: {
    fontFamily: 'monospace',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  goal: {
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
  },
  badgeText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
