// components/WagonScene.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import Svg, { Rect, G } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

interface WagonSceneProps {
  progressPercent: number;
  milesFromNext: number;
  nextMilestone: string;
}

const PX = 4;

function Pixel({ x, y, color }: { x: number; y: number; color: string }) {
  return <Rect x={x * PX} y={y * PX} width={PX} height={PX} fill={color} />;
}

function PixelRow({ x, y, count, color }: { x: number; y: number; count: number; color: string }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Pixel key={i} x={x + i} y={y} color={color} />
      ))}
    </>
  );
}

type SkyPeriod = 'day' | 'sunrise' | 'sunset' | 'night';

function getSkyPeriod(hour?: number): SkyPeriod {
  const h = hour ?? new Date().getHours();
  if (h >= 5 && h < 8)   return 'sunrise';
  if (h >= 8 && h < 17)  return 'day';
  if (h >= 17 && h < 20) return 'sunset';
  return 'night';
}

// Sky color palettes per period
const SKY_PALETTES: Record<SkyPeriod, { skyMain: string; skyTop: string; horizonGlow?: string }> = {
  day: {
    skyMain: '#2468b0',
    skyTop:  '#5ab4e8',
  },
  sunrise: {
    skyMain:     '#e87d3e',
    skyTop:      '#f5c162',
    horizonGlow: '#f59642',
  },
  sunset: {
    skyMain:     '#c0402a',
    skyTop:      '#e8722e',
    horizonGlow: '#f0a030',
  },
  night: {
    skyMain: '#0a0e2a',
    skyTop:  '#141830',
  },
};

export default function WagonScene({ progressPercent, milesFromNext, nextMilestone }: WagonSceneProps) {
  const { colors } = useTheme();
  const W = 95;
  const H = 52;

  // ── DEV: time-of-day tester ──────────────────────────────────────────────
  const [testHour, setTestHour] = useState<number>(new Date().getHours());
  const PERIOD_LABELS: Record<SkyPeriod, string> = {
    sunrise: '🌅 Sunrise',
    day:     '☀️  Day',
    sunset:  '🌇 Sunset',
    night:   '🌙 Night',
  };
  // ─────────────────────────────────────────────────────────────────────────

  const period = getSkyPeriod(testHour);
  const sky = SKY_PALETTES[period];

  const C = {
    black:      '#000000',
    skyBlue:    sky.skyMain,
    skyLight:   sky.skyTop,
    grassGreen: '#2e8b1a',
    grassDark:  '#1a5e0a',
    dirtBrown:  '#7a4f2c',
    dirtDark:   '#4a2e10',
    white:      '#ffffff',
    offWhite:   '#e8e8e8',
    gray:       '#888888',
    darkGray:   '#444444',
    wagonCream: '#e8d8a0',
    woodBrown:  '#8b5a2b',
    wheelDark:  '#3d2010',
    oxWhite:    '#f0f0f0',
    oxGray:     '#c0c0c0',
    gold:       '#d4a017',
    cloudWhite: '#ffffff',
    sunYellow:  '#f5c842',
    moonWhite:  '#dde8f0',
    moonGray:   '#a0b8c8',
    starWhite:  '#ffffff',
    treeTrunk:  '#5c3010',
    treeGreen:  period === 'night' ? '#0e3d06' : '#1a6e0a',
  };

  // Grass/ground tones shift at night
  const grassMain  = period === 'night' ? '#1a4e0e' : C.grassGreen;
  const grassEdge  = period === 'night' ? '#0e3008' : C.grassDark;
  // Mountain tones shift at sunset/night
  const mtn1Color  = period === 'night' ? '#111828' : (period === 'sunset' ? '#6b3020' : C.darkGray);
  const mtn2Color  = period === 'night' ? '#1a2038' : (period === 'sunset' ? '#8a4030' : C.gray);

  return (
    <View style={[styles.container, { backgroundColor: colors.inkBrown }]}>

      {/* ── DEV: time-of-day scrubber ── */}
      {/* <View style={[styles.devBar, { backgroundColor: colors.inkBrown }]}>
        <Text style={[styles.devLabel, { color: colors.trailGold }]}>
          {String(testHour).padStart(2, '0')}:00 · {PERIOD_LABELS[period]}
        </Text>
        <Slider
          style={styles.devSlider}
          minimumValue={0}
          maximumValue={23}
          step={1}
          value={testHour}
          onValueChange={(v) => setTestHour(Math.round(v))}
          minimumTrackTintColor={colors.trailGold}
          maximumTrackTintColor={colors.dirtDark ?? '#4a2e10'}
          thumbTintColor={colors.trailGold}
        />
      </View> */}
      <View style={styles.svgWrap}>
        <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W * PX} ${H * PX}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ── SKY ── */}
        <Rect x={0} y={0} width={W * PX} height={26 * PX} fill={C.skyBlue} />
        <Rect x={0} y={0} width={W * PX} height={6 * PX} fill={C.skyLight} />

        {/* Horizon glow band for sunrise/sunset */}
        {sky.horizonGlow && (
          <Rect x={0} y={20 * PX} width={W * PX} height={6 * PX} fill={sky.horizonGlow} />
        )}

        {/* ── NIGHT: STARS ── */}
        {period === 'night' && (
          <G>
            <Pixel x={3}  y={2}  color={C.starWhite} />
            <Pixel x={9}  y={4}  color={C.starWhite} />
            <Pixel x={15} y={1}  color={C.starWhite} />
            <Pixel x={22} y={3}  color={C.starWhite} />
            <Pixel x={30} y={5}  color={C.starWhite} />
            <Pixel x={37} y={2}  color={C.starWhite} />
            <Pixel x={44} y={4}  color={C.starWhite} />
            <Pixel x={52} y={1}  color={C.starWhite} />
            <Pixel x={58} y={3}  color={C.starWhite} />
            <Pixel x={65} y={5}  color={C.starWhite} />
            <Pixel x={71} y={2}  color={C.starWhite} />
            <Pixel x={6}  y={8}  color={C.starWhite} />
            <Pixel x={18} y={10} color={C.starWhite} />
            <Pixel x={26} y={7}  color={C.starWhite} />
            <Pixel x={35} y={11} color={C.starWhite} />
            <Pixel x={48} y={9}  color={C.starWhite} />
            <Pixel x={60} y={8}  color={C.starWhite} />
            <Pixel x={68} y={11} color={C.starWhite} />
            <Pixel x={75} y={7}  color={C.starWhite} />
            {/* Slightly brighter 2-pixel stars */}
            <PixelRow x={12} y={6}  count={2} color={C.starWhite} />
            <PixelRow x={42} y={8}  count={2} color={C.starWhite} />
            <PixelRow x={63} y={6}  count={2} color={C.starWhite} />
          </G>
        )}

        {/* ── NIGHT: MOON (top-right) ── */}
        {period === 'night' && (
          <G>
            {/* Full circle */}
            <PixelRow x={77} y={3} count={4} color={C.moonWhite} />
            <PixelRow x={76} y={4} count={6} color={C.moonWhite} />
            <PixelRow x={76} y={5} count={6} color={C.moonWhite} />
            <PixelRow x={76} y={6} count={6} color={C.moonWhite} />
            <PixelRow x={77} y={7} count={4} color={C.moonWhite} />
            {/* Crescent shadow — overdraws right side to create crescent */}
            <PixelRow x={79} y={3} count={2} color={C.skyBlue} />
            <PixelRow x={80} y={4} count={2} color={C.skyBlue} />
            <PixelRow x={80} y={5} count={2} color={C.skyBlue} />
            <PixelRow x={80} y={6} count={2} color={C.skyBlue} />
            <PixelRow x={79} y={7} count={2} color={C.skyBlue} />
          </G>
        )}

        {/* ── DAY: SUN (top right) ── */}
        {period === 'day' && (
          <G>
            <PixelRow x={78} y={3} count={4} color={C.sunYellow} />
            <PixelRow x={77} y={4} count={6} color={C.sunYellow} />
            <PixelRow x={77} y={5} count={6} color={C.sunYellow} />
            <PixelRow x={77} y={6} count={6} color={C.sunYellow} />
            <PixelRow x={78} y={7} count={4} color={C.sunYellow} />
          </G>
        )}

        {/* ── SUNRISE: SUN low on left horizon ── */}
        {period === 'sunrise' && (
          <G>
            {/* Sun peeking up — half circle at horizon */}
            <PixelRow x={4}  y={21} count={8} color={C.sunYellow} />
            <PixelRow x={3}  y={22} count={10} color={C.sunYellow} />
            <PixelRow x={3}  y={23} count={10} color={C.sunYellow} />
            <PixelRow x={4}  y={24} count={8} color={C.sunYellow} />
            {/* Rays */}
            <Pixel x={2}  y={20} color={C.sunYellow} />
            <Pixel x={8}  y={19} color={C.sunYellow} />
            <Pixel x={14} y={20} color={C.sunYellow} />
            <Pixel x={1}  y={23} color={C.sunYellow} />
            <Pixel x={15} y={23} color={C.sunYellow} />
          </G>
        )}

        {/* ── SUNSET: SUN low on right horizon ── */}
        {period === 'sunset' && (
          <G>
            {/* Sun sinking — half circle at horizon right side */}
            <PixelRow x={78} y={21} count={8} color={C.sunYellow} />
            <PixelRow x={77} y={22} count={10} color={C.sunYellow} />
            <PixelRow x={77} y={23} count={10} color={C.sunYellow} />
            <PixelRow x={78} y={24} count={8} color={C.sunYellow} />
            {/* Rays */}
            <Pixel x={76} y={20} color={C.sunYellow} />
            <Pixel x={82} y={19} color={C.sunYellow} />
            <Pixel x={88} y={20} color={C.sunYellow} />
            <Pixel x={75} y={23} color={C.sunYellow} />
            <Pixel x={89} y={23} color={C.sunYellow} />
          </G>
        )}

        {/* ── CLOUDS (day + sunrise only) ── */}
        {(period === 'day' || period === 'sunrise') && (
          <G>
            <PixelRow x={10} y={7}  count={5} color={C.cloudWhite} />
            <PixelRow x={8}  y={8}  count={9} color={C.cloudWhite} />
            <PixelRow x={8}  y={9}  count={9} color={C.cloudWhite} />
            <PixelRow x={10} y={10} count={5} color={C.cloudWhite} />
            <PixelRow x={48} y={5}  count={6} color={C.cloudWhite} />
            <PixelRow x={46} y={6}  count={10} color={C.cloudWhite} />
            <PixelRow x={46} y={7}  count={10} color={C.cloudWhite} />
            <PixelRow x={48} y={8}  count={6} color={C.cloudWhite} />
          </G>
        )}

        {/* Sunset clouds — orange-tinted */}
        {period === 'sunset' && (
          <G>
            <PixelRow x={10} y={7}  count={5} color="#f0b060" />
            <PixelRow x={8}  y={8}  count={9} color="#f0b060" />
            <PixelRow x={8}  y={9}  count={9} color="#f0b060" />
            <PixelRow x={10} y={10} count={5} color="#f0b060" />
            <PixelRow x={30} y={9}  count={6} color="#e89050" />
            <PixelRow x={28} y={10} count={10} color="#e89050" />
            <PixelRow x={28} y={11} count={10} color="#e89050" />
            <PixelRow x={30} y={12} count={6} color="#e89050" />
          </G>
        )}

        {/* ── DISTANT MOUNTAINS ── */}
        <G>
          <PixelRow x={60} y={16} count={2}  color={mtn1Color} />
          <PixelRow x={58} y={17} count={6}  color={mtn1Color} />
          <PixelRow x={56} y={18} count={10} color={mtn1Color} />
          <PixelRow x={55} y={19} count={12} color={mtn1Color} />
          <PixelRow x={72} y={15} count={2}  color={mtn2Color} />
          <PixelRow x={70} y={16} count={6}  color={mtn2Color} />
          <PixelRow x={68} y={17} count={10} color={mtn2Color} />
          <PixelRow x={67} y={18} count={12} color={mtn2Color} />
          <PixelRow x={66} y={19} count={14} color={mtn2Color} />
        </G>

        {/* ── GROUND / GRASS ── */}
        <Rect x={0} y={26 * PX} width={W * PX} height={14 * PX} fill={grassMain} />
        <PixelRow x={0} y={26} count={95} color={grassEdge} />
        <PixelRow x={0} y={27} count={95} color={grassMain} />

        {/* ── DIRT TRAIL ── */}
        <Rect x={0} y={32 * PX} width={W * PX} height={6 * PX} fill={C.dirtBrown} />
        <PixelRow x={0} y={32} count={95} color={C.dirtDark} />
        <PixelRow x={0} y={34} count={95} color={C.dirtDark} />
        <PixelRow x={0} y={36} count={95} color={C.dirtDark} />
        <PixelRow x={0} y={37} count={95} color={C.dirtDark} />

        {/* ── GRASS FOREGROUND ── */}
        <Rect x={0} y={38 * PX} width={W * PX} height={8 * PX} fill={grassMain} />
        <PixelRow x={0} y={38} count={95} color={grassEdge} />
        <Pixel x={5}  y={39} color={grassEdge} />
        <Pixel x={6}  y={38} color={grassEdge} />
        <Pixel x={20} y={39} color={grassEdge} />
        <Pixel x={21} y={38} color={grassEdge} />
        <Pixel x={40} y={39} color={grassEdge} />
        <Pixel x={41} y={38} color={grassEdge} />
        <Pixel x={65} y={39} color={grassEdge} />
        <Pixel x={66} y={38} color={grassEdge} />
        <Pixel x={80} y={39} color={grassEdge} />
        <Pixel x={81} y={38} color={grassEdge} />

        {/* ── TREE ── */}
        <G>
          <PixelRow x={85} y={24} count={2} color={C.treeTrunk} />
          <PixelRow x={85} y={25} count={2} color={C.treeTrunk} />
          <PixelRow x={85} y={26} count={2} color={C.treeTrunk} />
          <PixelRow x={83} y={20} count={6} color={C.treeGreen} />
          <PixelRow x={82} y={21} count={8} color={C.treeGreen} />
          <PixelRow x={82} y={22} count={8} color={C.treeGreen} />
          <PixelRow x={83} y={23} count={6} color={C.treeGreen} />
          <PixelRow x={84} y={24} count={4} color={C.treeGreen} />
        </G>

        {/* ── OXEN ── */}
        <G>
          <PixelRow x={23} y={28} count={8}  color={C.oxWhite} />
          <PixelRow x={22} y={29} count={10} color={C.oxWhite} />
          <PixelRow x={22} y={30} count={10} color={C.oxWhite} />
          <PixelRow x={23} y={31} count={8}  color={C.oxWhite} />
          <PixelRow x={20} y={28} count={4}  color={C.oxWhite} />
          <PixelRow x={20} y={29} count={4}  color={C.oxWhite} />
          <Pixel x={20} y={27} color={C.oxGray} />
          <Pixel x={22} y={26} color={C.oxGray} />
          <Pixel x={20} y={28} color={C.black} />
          <Pixel x={24} y={32} color={C.oxGray} />
          <Pixel x={24} y={33} color={C.oxGray} />
          <Pixel x={26} y={32} color={C.oxGray} />
          <Pixel x={26} y={33} color={C.oxGray} />
          <Pixel x={28} y={32} color={C.oxGray} />
          <Pixel x={28} y={33} color={C.oxGray} />
          <Pixel x={30} y={32} color={C.oxGray} />
          <Pixel x={30} y={33} color={C.oxGray} />
        </G>

        {/* ── YOKE ── */}
        <PixelRow x={32} y={30} count={6} color={C.woodBrown} />

        {/* ── WAGON BOX ── */}
        <G>
          <PixelRow x={38} y={27} count={18} color={C.woodBrown} />
          <PixelRow x={38} y={28} count={18} color={C.woodBrown} />
          <PixelRow x={38} y={29} count={18} color={C.woodBrown} />
          <PixelRow x={38} y={30} count={18} color={C.woodBrown} />
          <PixelRow x={38} y={31} count={18} color={C.woodBrown} />
          <Pixel x={42} y={27} color={C.dirtDark} />
          <Pixel x={42} y={28} color={C.dirtDark} />
          <Pixel x={42} y={29} color={C.dirtDark} />
          <Pixel x={42} y={30} color={C.dirtDark} />
          <Pixel x={46} y={27} color={C.dirtDark} />
          <Pixel x={46} y={28} color={C.dirtDark} />
          <Pixel x={46} y={29} color={C.dirtDark} />
          <Pixel x={46} y={30} color={C.dirtDark} />
          <Pixel x={50} y={27} color={C.dirtDark} />
          <Pixel x={50} y={28} color={C.dirtDark} />
          <Pixel x={50} y={29} color={C.dirtDark} />
          <Pixel x={50} y={30} color={C.dirtDark} />
          <PixelRow x={38} y={26} count={18} color={C.dirtDark} />
          <PixelRow x={38} y={32} count={18} color={C.dirtDark} />
        </G>

        {/* ── CANVAS COVER ── */}
        <G>
          <PixelRow x={39} y={22} count={16} color={C.wagonCream} />
          <PixelRow x={38} y={23} count={18} color={C.wagonCream} />
          <PixelRow x={38} y={24} count={18} color={C.wagonCream} />
          <PixelRow x={38} y={25} count={18} color={C.wagonCream} />
          <PixelRow x={39} y={21} count={14} color={C.wagonCream} />
          <PixelRow x={41} y={20} count={10} color={C.wagonCream} />
          <PixelRow x={43} y={19} count={6}  color={C.wagonCream} />
          <Pixel x={41} y={20} color={C.offWhite} />
          <Pixel x={41} y={21} color={C.offWhite} />
          <Pixel x={46} y={19} color={C.offWhite} />
          <Pixel x={46} y={20} color={C.offWhite} />
          <Pixel x={46} y={21} color={C.offWhite} />
          <Pixel x={51} y={20} color={C.offWhite} />
          <Pixel x={51} y={21} color={C.offWhite} />
        </G>

        {/* ── FRONT WHEEL ── */}
        <G>
          <PixelRow x={39} y={32} count={4} color={C.wheelDark} />
          <PixelRow x={38} y={33} count={6} color={C.wheelDark} />
          <PixelRow x={38} y={34} count={6} color={C.wheelDark} />
          <PixelRow x={38} y={35} count={6} color={C.wheelDark} />
          <PixelRow x={39} y={36} count={4} color={C.wheelDark} />
          <Pixel x={40} y={34} color={C.dirtBrown} />
          <Pixel x={41} y={34} color={C.dirtBrown} />
          <Pixel x={41} y={33} color={C.woodBrown} />
          <Pixel x={41} y={35} color={C.woodBrown} />
          <Pixel x={39} y={34} color={C.woodBrown} />
          <Pixel x={43} y={34} color={C.woodBrown} />
        </G>

        {/* ── REAR WHEEL ── */}
        <G>
          <PixelRow x={50} y={31} count={6}  color={C.wheelDark} />
          <PixelRow x={48} y={32} count={10} color={C.wheelDark} />
          <PixelRow x={48} y={33} count={10} color={C.wheelDark} />
          <PixelRow x={48} y={34} count={10} color={C.wheelDark} />
          <PixelRow x={48} y={35} count={10} color={C.wheelDark} />
          <PixelRow x={48} y={36} count={10} color={C.wheelDark} />
          <PixelRow x={50} y={37} count={6}  color={C.wheelDark} />
          <PixelRow x={51} y={34} count={4}  color={C.dirtBrown} />
          <Pixel x={53} y={32} color={C.woodBrown} />
          <Pixel x={53} y={33} color={C.woodBrown} />
          <Pixel x={53} y={35} color={C.woodBrown} />
          <Pixel x={53} y={36} color={C.woodBrown} />
          <Pixel x={49} y={34} color={C.woodBrown} />
          <Pixel x={50} y={34} color={C.woodBrown} />
          <Pixel x={55} y={34} color={C.woodBrown} />
          <Pixel x={56} y={34} color={C.woodBrown} />
        </G>

        {/* ── DESTINATION FLAG ── */}
        <G>
          <Pixel x={91} y={22} color={C.offWhite} />
          <Pixel x={91} y={23} color={C.offWhite} />
          <Pixel x={91} y={24} color={C.offWhite} />
          <Pixel x={91} y={25} color={C.offWhite} />
          <Pixel x={91} y={26} color={C.offWhite} />
          <PixelRow x={92} y={22} count={3} color={C.gold} />
          <PixelRow x={92} y={23} count={3} color={C.gold} />
          <PixelRow x={92} y={24} count={2} color={C.gold} />
        </G>

        {/* ── PROGRESS BAR ── */}
        <Rect x={0} y={46 * PX} width={W * PX} height={6 * PX} fill={C.black} />
        <Rect x={4 * PX} y={48 * PX} width={87 * PX} height={2 * PX} fill={C.darkGray} />
        <Rect
          x={4 * PX}
          y={48 * PX}
          width={Math.max(2, (progressPercent / 100) * 87) * PX}
          height={2 * PX}
          fill={C.gold}
        />
        <Pixel
          x={Math.round(4 + (progressPercent / 100) * 87)}
          y={47}
          color={C.white}
        />

      </Svg>
      </View>

      <View style={[styles.infoRow, { backgroundColor: colors.inkBrown }]}>
        <Text style={[styles.infoText, { color: colors.trailGold }]}>
          {milesFromNext} mi to {nextMilestone.split(',')[0]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  devBar: {
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 2,
    gap: 2,
  },
  devLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  devSlider: {
    width: '100%',
    height: 28,
  },
  svgWrap: {
    width: '100%',
    aspectRatio: 95 / 52,
  },
  infoRow: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  infoText: {
    fontFamily: 'monospace',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});