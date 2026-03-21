// components/WagonScene.tsx
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Ellipse,
  Path,
  Line,
  Polygon,
  Defs,
  LinearGradient,
  Stop,
  G,
  Text as SvgText,
} from 'react-native-svg';
import { Colors } from '../constants/theme';

interface WagonSceneProps {
  progressPercent: number; // 0–100
  milesFromNext: number;
  nextMilestone: string;
}

export default function WagonScene({
  progressPercent,
  milesFromNext,
  nextMilestone,
}: WagonSceneProps) {
  const wheelAnim = useRef(new Animated.Value(0)).current;
  const dustAnim = useRef(new Animated.Value(0)).current;
  const wagonBob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Wheel spin
    Animated.loop(
      Animated.timing(wheelAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Wagon bob
    Animated.loop(
      Animated.sequence([
        Animated.timing(wagonBob, {
          toValue: -2,
          duration: 600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(wagonBob, {
          toValue: 2,
          duration: 600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Dust puff
    Animated.loop(
      Animated.timing(dustAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const wheelRotate = wheelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const dustOpacity = dustAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 0.2, 0],
  });

  const dustTranslateX = dustAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  return (
    <View style={styles.container}>
      <Svg width="100%" height="220" viewBox="0 0 380 220">
        <Defs>
          {/* Sky gradient */}
          <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#0d1b2a" />
            <Stop offset="60%" stopColor="#1b3a5c" />
            <Stop offset="100%" stopColor="#c17f3a" />
          </LinearGradient>
          {/* Ground gradient */}
          <LinearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#8b5e3c" />
            <Stop offset="100%" stopColor="#5c3d1e" />
          </LinearGradient>
          {/* Sun glow */}
          <LinearGradient id="sunGlow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#f5c842" stopOpacity="1" />
            <Stop offset="100%" stopColor="#e8873a" stopOpacity="0.6" />
          </LinearGradient>
          {/* Canvas cover */}
          <LinearGradient id="canvasGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#e8d5a8" />
            <Stop offset="100%" stopColor="#c4a96a" />
          </LinearGradient>
          {/* Wagon wood */}
          <LinearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#7a4f2c" />
            <Stop offset="100%" stopColor="#5c3520" />
          </LinearGradient>
        </Defs>

        {/* Sky */}
        <Rect x="0" y="0" width="380" height="160" fill="url(#skyGrad)" />

        {/* Sun */}
        <Circle cx="310" cy="55" r="28" fill="url(#sunGlow)" opacity="0.9" />
        <Circle cx="310" cy="55" r="20" fill="#f5c842" />

        {/* Stars (small dots) */}
        {[
          [30, 20], [70, 10], [120, 30], [160, 15], [200, 25],
          [250, 8], [20, 50], [100, 45], [180, 40], [230, 35],
        ].map(([x, y], i) => (
          <Circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity="0.6" />
        ))}

        {/* Distant mountains */}
        <Path
          d="M0 120 L40 80 L80 100 L130 60 L180 95 L220 75 L270 90 L310 65 L350 85 L380 70 L380 130 L0 130Z"
          fill="#2a4a3a"
          opacity="0.7"
        />
        <Path
          d="M0 130 L60 100 L110 115 L160 90 L210 108 L260 95 L310 110 L360 100 L380 105 L380 140 L0 140Z"
          fill="#1e3828"
          opacity="0.5"
        />

        {/* Prairie / ground */}
        <Rect x="0" y="148" width="380" height="72" fill="url(#groundGrad)" />

        {/* Trail path (ruts) */}
        <Path
          d="M0 162 Q190 158 380 165"
          stroke="#5c3d1e"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <Path
          d="M0 172 Q190 168 380 175"
          stroke="#5c3d1e"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />

        {/* Prairie grass tufts */}
        {[20, 60, 100, 250, 290, 340].map((x, i) => (
          <G key={i}>
            <Line x1={x} y1="158" x2={x - 5} y2="148" stroke="#4a6329" strokeWidth="2" />
            <Line x1={x} y1="158" x2={x} y2="146" stroke="#5a7335" strokeWidth="2" />
            <Line x1={x} y1="158" x2={x + 5} y2="149" stroke="#4a6329" strokeWidth="2" />
          </G>
        ))}

        {/* Distant destination flag */}
        <Line x1="345" y1="100" x2="345" y2="130" stroke="#c9b99a" strokeWidth="2" />
        <Polygon points="345,100 365,108 345,116" fill="#d4a017" />

        {/* Progress track on ground */}
        <Rect x="10" y="195" width="360" height="6" rx="3" fill="#3d2010" />
        <Rect
          x="10"
          y="195"
          width={Math.max(8, (progressPercent / 100) * 360)}
          height="6"
          rx="3"
          fill="#d4a017"
        />

        {/* Milestone label */}
        <SvgText
          x="370"
          y="203"
          fontSize="8"
          fill="#c9b99a"
          textAnchor="end"
          fontFamily="monospace"
        >
          {nextMilestone}
        </SvgText>
        <SvgText
          x="10"
          y="215"
          fontSize="7"
          fill="#8b6a4a"
          fontFamily="monospace"
        >
          {milesFromNext} mi to next stop
        </SvgText>
      </Svg>

      {/* Animated wagon layer (over SVG) */}
      <Animated.View
        style={[
          styles.wagonContainer,
          { transform: [{ translateY: wagonBob }] },
        ]}
      >
        {/* Dust cloud */}
        <Animated.View
          style={[
            styles.dustCloud,
            {
              opacity: dustOpacity,
              transform: [{ translateX: dustTranslateX }],
            },
          ]}
        >
          <Svg width="60" height="30" viewBox="0 0 60 30">
            <Ellipse cx="20" cy="20" rx="18" ry="10" fill="#c4956a" opacity="0.4" />
            <Ellipse cx="35" cy="18" rx="14" ry="8" fill="#c4956a" opacity="0.3" />
            <Ellipse cx="12" cy="22" rx="10" ry="6" fill="#c4956a" opacity="0.2" />
          </Svg>
        </Animated.View>

        {/* Wagon SVG */}
        <Svg width="160" height="90" viewBox="0 0 160 90">
          {/* Oxen (left) */}
          <G>
            {/* Body */}
            <Ellipse cx="25" cy="68" rx="22" ry="11" fill="#6b4423" />
            {/* Head */}
            <Ellipse cx="5" cy="62" rx="9" ry="7" fill="#7a4f2c" />
            {/* Horn */}
            <Line x1="2" y1="57" x2="-3" y2="52" stroke="#5c3d1e" strokeWidth="2" />
            <Line x1="8" y1="56" x2="10" y2="50" stroke="#5c3d1e" strokeWidth="2" />
            {/* Eye */}
            <Circle cx="3" cy="61" r="1.5" fill="#1a0f00" />
            {/* Legs */}
            <Line x1="18" y1="76" x2="16" y2="88" stroke="#5c3d1e" strokeWidth="3" strokeLinecap="round" />
            <Line x1="26" y1="77" x2="24" y2="88" stroke="#5c3d1e" strokeWidth="3" strokeLinecap="round" />
            <Line x1="34" y1="77" x2="34" y2="88" stroke="#5c3d1e" strokeWidth="3" strokeLinecap="round" />
            <Line x1="42" y1="76" x2="44" y2="88" stroke="#5c3d1e" strokeWidth="3" strokeLinecap="round" />
            {/* Yoke */}
            <Rect x="44" y="61" width="8" height="4" rx="2" fill="#4a2e10" />
          </G>

          {/* Tongue / pole */}
          <Line x1="52" y1="64" x2="78" y2="70" stroke="#4a2e10" strokeWidth="4" strokeLinecap="round" />

          {/* Wagon box */}
          <Rect x="78" y="60" width="72" height="24" rx="2" fill="url(#woodGrad2)" />
          {/* Wagon box planks */}
          {[84, 92, 100, 108, 116, 124, 132, 140].map((x, i) => (
            <Line key={i} x1={x} y1="60" x2={x} y2="84" stroke="#4a2010" strokeWidth="0.8" opacity="0.5" />
          ))}
          {/* Top rail */}
          <Rect x="76" y="57" width="76" height="5" rx="2" fill="#8b5020" />
          {/* Bottom board */}
          <Rect x="76" y="82" width="76" height="5" rx="2" fill="#6b3e18" />

          {/* Canvas cover */}
          <Path
            d="M82 58 Q118 30 150 58"
            stroke="#c4a96a"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M82 58 Q118 32 150 58"
            stroke="#e8d5a8"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          {/* Canvas ribs */}
          {[95, 110, 124, 138].map((x, i) => (
            <Path
              key={i}
              d={`M${x - 8} 58 Q${x} ${38 + Math.abs(x - 116) * 0.3} ${x + 8} 58`}
              stroke="#c4a96a"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
          ))}

          {/* Front wheel */}
          <Animated.View style={{ transform: [{ rotate: wheelRotate }] }}>
            <Svg width="30" height="30" style={{ position: 'absolute', left: 74, top: 62 }}>
              <Circle cx="15" cy="15" r="13" stroke="#3d2010" strokeWidth="3" fill="none" />
              <Circle cx="15" cy="15" r="4" fill="#3d2010" />
              {[0, 45, 90, 135].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <Line
                    key={i}
                    x1={15 + Math.cos(rad) * 4}
                    y1={15 + Math.sin(rad) * 4}
                    x2={15 + Math.cos(rad) * 12}
                    y2={15 + Math.sin(rad) * 12}
                    stroke="#5c3520"
                    strokeWidth="2"
                  />
                );
              })}
            </Svg>
          </Animated.View>

          {/* Rear wheel */}
          <Animated.View style={{ transform: [{ rotate: wheelRotate }] }}>
            <Svg width="36" height="36" style={{ position: 'absolute', left: 126, top: 58 }}>
              <Circle cx="18" cy="18" r="16" stroke="#3d2010" strokeWidth="4" fill="none" />
              <Circle cx="18" cy="18" r="5" fill="#3d2010" />
              {[0, 36, 72, 108, 144].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <Line
                    key={i}
                    x1={18 + Math.cos(rad) * 5}
                    y1={18 + Math.sin(rad) * 5}
                    x2={18 + Math.cos(rad) * 14}
                    y2={18 + Math.sin(rad) * 14}
                    stroke="#5c3520"
                    strokeWidth="2.5"
                  />
                );
              })}
            </Svg>
          </Animated.View>
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    position: 'relative',
    overflow: 'hidden',
  },
  wagonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  dustCloud: {
    position: 'absolute',
    bottom: 8,
    left: -40,
  },
});