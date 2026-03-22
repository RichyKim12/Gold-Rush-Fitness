// components/WagonScene.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

interface WagonSceneProps {
  progressPercent: number;
  milesFromNext: number;
  nextMilestone: string;
}

// Helper to draw a pixel block at grid position
// Each "pixel" is 4x4 real units on the SVG canvas
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

export default function WagonScene({ progressPercent, milesFromNext, nextMilestone }: WagonSceneProps) {
  const { colors } = useTheme();
  // Canvas: 95 pixels wide x 52 pixels tall (380 x 208 SVG units)
  const W = 95;
  const H = 52;

  // Color palette — classic Oregon Trail CRT colors
  const C = {
    black:      '#000000',
    skyBlue:    '#2468b0',
    skyLight:   '#5ab4e8',
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
    treeTrunk:  '#5c3010',
    treeGreen:  '#1a6e0a',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.inkBrown }]}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W * PX} ${H * PX}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ── SKY ── */}
        <Rect x={0} y={0} width={W * PX} height={26 * PX} fill={C.skyBlue} />

        {/* Sky gradient top strip (lighter) */}
        <Rect x={0} y={0} width={W * PX} height={6 * PX} fill={C.skyLight} />

        {/* ── SUN (top right) ── */}
        <G>
          <PixelRow x={78} y={3} count={4} color={C.sunYellow} />
          <PixelRow x={77} y={4} count={6} color={C.sunYellow} />
          <PixelRow x={77} y={5} count={6} color={C.sunYellow} />
          <PixelRow x={77} y={6} count={6} color={C.sunYellow} />
          <PixelRow x={78} y={7} count={4} color={C.sunYellow} />
        </G>

        {/* ── CLOUD 1 ── */}
        <G>
          <PixelRow x={10} y={7} count={5} color={C.cloudWhite} />
          <PixelRow x={8}  y={8} count={9} color={C.cloudWhite} />
          <PixelRow x={8}  y={9} count={9} color={C.cloudWhite} />
          <PixelRow x={10} y={10} count={5} color={C.cloudWhite} />
        </G>

        {/* ── CLOUD 2 ── */}
        <G>
          <PixelRow x={48} y={5} count={6} color={C.cloudWhite} />
          <PixelRow x={46} y={6} count={10} color={C.cloudWhite} />
          <PixelRow x={46} y={7} count={10} color={C.cloudWhite} />
          <PixelRow x={48} y={8} count={6} color={C.cloudWhite} />
        </G>

        {/* ── DISTANT MOUNTAINS ── */}
        <G>
          {/* Mountain 1 */}
          <PixelRow x={60} y={16} count={2} color={C.darkGray} />
          <PixelRow x={58} y={17} count={6} color={C.darkGray} />
          <PixelRow x={56} y={18} count={10} color={C.darkGray} />
          <PixelRow x={55} y={19} count={12} color={C.darkGray} />
          {/* Mountain 2 */}
          <PixelRow x={72} y={15} count={2} color={C.gray} />
          <PixelRow x={70} y={16} count={6} color={C.gray} />
          <PixelRow x={68} y={17} count={10} color={C.gray} />
          <PixelRow x={67} y={18} count={12} color={C.gray} />
          <PixelRow x={66} y={19} count={14} color={C.gray} />
        </G>

        {/* ── GROUND / GRASS ── */}
        <Rect x={0} y={26 * PX} width={W * PX} height={14 * PX} fill={C.grassGreen} />

        {/* Ground detail rows */}
        <PixelRow x={0}  y={26} count={95} color={C.grassDark} />
        <PixelRow x={0}  y={27} count={95} color={C.grassGreen} />

        {/* ── DIRT TRAIL (two ruts) ── */}
        <Rect x={0} y={32 * PX} width={W * PX} height={6 * PX} fill={C.dirtBrown} />
        <PixelRow x={0} y={32} count={95} color={C.dirtDark} />
        {/* Rut lines */}
        <PixelRow x={0} y={34} count={95} color={C.dirtDark} />
        <PixelRow x={0} y={36} count={95} color={C.dirtDark} />
        <PixelRow x={0} y={37} count={95} color={C.dirtDark} />

        {/* ── GRASS FOREGROUND ── */}
        <Rect x={0} y={38 * PX} width={W * PX} height={8 * PX} fill={C.grassGreen} />
        <PixelRow x={0} y={38} count={95} color={C.grassDark} />

        {/* Grass tufts */}
        <Pixel x={5}  y={39} color={C.grassDark} />
        <Pixel x={6}  y={38} color={C.grassDark} />
        <Pixel x={20} y={39} color={C.grassDark} />
        <Pixel x={21} y={38} color={C.grassDark} />
        <Pixel x={40} y={39} color={C.grassDark} />
        <Pixel x={41} y={38} color={C.grassDark} />
        <Pixel x={65} y={39} color={C.grassDark} />
        <Pixel x={66} y={38} color={C.grassDark} />
        <Pixel x={80} y={39} color={C.grassDark} />
        <Pixel x={81} y={38} color={C.grassDark} />

        {/* ── TREE (right side) ── */}
        <G>
          {/* Trunk */}
          <PixelRow x={85} y={24} count={2} color={C.treeTrunk} />
          <PixelRow x={85} y={25} count={2} color={C.treeTrunk} />
          <PixelRow x={85} y={26} count={2} color={C.treeTrunk} />
          {/* Foliage */}
          <PixelRow x={83} y={20} count={6} color={C.treeGreen} />
          <PixelRow x={82} y={21} count={8} color={C.treeGreen} />
          <PixelRow x={82} y={22} count={8} color={C.treeGreen} />
          <PixelRow x={83} y={23} count={6} color={C.treeGreen} />
          <PixelRow x={84} y={24} count={4} color={C.treeGreen} />
        </G>

        {/* ── OXEN (left pair) ── */}
        <G>
          {/* Ox body */}
          <PixelRow x={23}  y={28} count={8} color={C.oxWhite} />
          <PixelRow x={22}  y={29} count={10} color={C.oxWhite} />
          <PixelRow x={22}  y={30} count={10} color={C.oxWhite} />
          <PixelRow x={23}  y={31} count={8} color={C.oxWhite} />
          {/* Head */}
          <PixelRow x={20}  y={28} count={4} color={C.oxWhite} />
          <PixelRow x={20}  y={29} count={4} color={C.oxWhite} />
          {/* Horns */}
          <Pixel x={20}  y={27} color={C.oxGray} />
          <Pixel x={22}  y={26} color={C.oxGray} />
          {/* Eye */}
          <Pixel x={20}  y={28} color={C.black} />
          {/* Legs */}
          <Pixel x={24}  y={32} color={C.oxGray} />
          <Pixel x={24}  y={33} color={C.oxGray} />
          <Pixel x={26} y={32} color={C.oxGray} />
          <Pixel x={26} y={33} color={C.oxGray} />
          <Pixel x={28} y={32} color={C.oxGray} />
          <Pixel x={28} y={33} color={C.oxGray} />
          <Pixel x={30} y={32} color={C.oxGray} />
          <Pixel x={30} y={33} color={C.oxGray} />
        </G>

        {/* ── YOKE / TONGUE ── */}
        <PixelRow x={32} y={30} count={6} color={C.woodBrown} />

        {/* ── WAGON BOX ── */}
        <G>
          {/* Main box */}
          <PixelRow x={38} y={27} count={18} color={C.woodBrown} />
          <PixelRow x={38} y={28} count={18} color={C.woodBrown} />
          <PixelRow x={38} y={29} count={18} color={C.woodBrown} />
          <PixelRow x={38} y={30} count={18} color={C.woodBrown} />
          <PixelRow x={38} y={31} count={18} color={C.woodBrown} />
          {/* Plank lines */}
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
          {/* Top rail */}
          <PixelRow x={38} y={26} count={18} color={C.dirtDark} />
          {/* Bottom rail */}
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
          <PixelRow x={43} y={19} count={6} color={C.wagonCream} />
          {/* Canvas ribs (darker lines) */}
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
          {/* Outer ring */}
          <PixelRow x={39} y={32} count={4} color={C.wheelDark} />
          <PixelRow x={38} y={33} count={6} color={C.wheelDark} />
          <PixelRow x={38} y={34} count={6} color={C.wheelDark} />
          <PixelRow x={38} y={35} count={6} color={C.wheelDark} />
          <PixelRow x={39} y={36} count={4} color={C.wheelDark} />
          {/* Hub */}
          <Pixel x={40} y={34} color={C.dirtBrown} />
          <Pixel x={41} y={34} color={C.dirtBrown} />
          {/* Spokes */}
          <Pixel x={41} y={33} color={C.woodBrown} />
          <Pixel x={41} y={35} color={C.woodBrown} />
          <Pixel x={39} y={34} color={C.woodBrown} />
          <Pixel x={43} y={34} color={C.woodBrown} />
        </G>

        {/* ── REAR WHEEL (bigger) ── */}
        <G>
          {/* Outer ring */}
          <PixelRow x={50} y={31} count={6} color={C.wheelDark} />
          <PixelRow x={48} y={32} count={10} color={C.wheelDark} />
          <PixelRow x={48} y={33} count={10} color={C.wheelDark} />
          <PixelRow x={48} y={34} count={10} color={C.wheelDark} />
          <PixelRow x={48} y={35} count={10} color={C.wheelDark} />
          <PixelRow x={48} y={36} count={10} color={C.wheelDark} />
          <PixelRow x={50} y={37} count={6} color={C.wheelDark} />
          {/* Hub */}
          <PixelRow x={51} y={34} count={4} color={C.dirtBrown} />
          {/* Spokes */}
          <Pixel x={53} y={32} color={C.woodBrown} />
          <Pixel x={53} y={33} color={C.woodBrown} />
          <Pixel x={53} y={35} color={C.woodBrown} />
          <Pixel x={53} y={36} color={C.woodBrown} />
          <Pixel x={49} y={34} color={C.woodBrown} />
          <Pixel x={50} y={34} color={C.woodBrown} />
          <Pixel x={55} y={34} color={C.woodBrown} />
          <Pixel x={56} y={34} color={C.woodBrown} />
        </G>

        {/* ── DESTINATION FLAG (right) ── */}
        <G>
          {/* Pole */}
          <Pixel x={91} y={22} color={C.offWhite} />
          <Pixel x={91} y={23} color={C.offWhite} />
          <Pixel x={91} y={24} color={C.offWhite} />
          <Pixel x={91} y={25} color={C.offWhite} />
          <Pixel x={91} y={26} color={C.offWhite} />
          {/* Flag */}
          <PixelRow x={92} y={22} count={3} color={C.gold} />
          <PixelRow x={92} y={23} count={3} color={C.gold} />
          <PixelRow x={92} y={24} count={2} color={C.gold} />
        </G>

        {/* ── PROGRESS BAR (bottom strip) ── */}
        <Rect x={0} y={46 * PX} width={W * PX} height={6 * PX} fill={C.black} />
        {/* Track */}
        <Rect x={4 * PX} y={48 * PX} width={87 * PX} height={2 * PX} fill={C.darkGray} />
        {/* Fill */}
        <Rect
          x={4 * PX}
          y={48 * PX}
          width={Math.max(2, (progressPercent / 100) * 87) * PX}
          height={2 * PX}
          fill={C.gold}
        />
        {/* Wagon marker on progress bar */}
        <Pixel
          x={Math.round(4 + (progressPercent / 100) * 87)}
          y={47}
          color={C.white}
        />

      </Svg>

      {/* Miles label below scene */}
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