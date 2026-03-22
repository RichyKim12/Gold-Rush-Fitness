// components/PixelIcons.tsx
import React from 'react';
import Svg, { Rect } from 'react-native-svg';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const P = 3;

function px(col: number, row: number, color: string, key: number) {
  return <Rect key={key} x={col * P} y={row * P} width={P} height={P} fill={color} />;
}

type PixelList = [number, number, string][];

// ─── Trail / Log ──────────────────────────────────────────────────────────────
export function TrailIcon({ size = 18, focused: _focused }: { size?: number; focused?: boolean }) {
  const pixels: PixelList = [
    [1,0,'#A0522D'],[2,0,'#A0522D'],[3,0,'#CD853F'],[4,0,'#A0522D'],[5,0,'#A0522D'],[6,0,'#A0522D'],
    [0,1,'#A0522D'],[1,1,'#CD853F'],[2,1,'#CD853F'],[3,1,'#D4A017'],[4,1,'#CD853F'],[5,1,'#CD853F'],[6,1,'#A0522D'],[7,1,'#A0522D'],
    [0,2,'#A0522D'],[1,2,'#CD853F'],[2,2,'#A0522D'],[3,2,'#A0522D'],[4,2,'#A0522D'],[5,2,'#A0522D'],[6,2,'#A0522D'],[7,2,'#A0522D'],
    [0,3,'#A0522D'],[1,3,'#CD853F'],[2,3,'#A0522D'],[3,3,'#A0522D'],[4,3,'#A0522D'],[5,3,'#A0522D'],[6,3,'#A0522D'],[7,3,'#A0522D'],
    [0,4,'#6B2F00'],[1,4,'#6B2F00'],[2,4,'#A0522D'],[3,4,'#A0522D'],[4,4,'#A0522D'],[5,4,'#A0522D'],[6,4,'#6B2F00'],[7,4,'#6B2F00'],
    [3,1,'#3B1A08'],[5,3,'#3B1A08'],
  ];
  return (
    <Svg width={size} height={size * 0.75} viewBox="0 0 24 15">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}

// ─── Steps / Boot ─────────────────────────────────────────────────────────────
export function StepsIcon({ size = 18, focused: _focused }: { size?: number; focused?: boolean }) {
  const dark   = '#3B1A08';
  const deep   = '#6B2F00';
  const mid    = '#A0522D';
  const light  = '#CD853F';
  const stitch = '#F5DEB3';
  const toe    = '#D2691E';
  const pixels: PixelList = [
    [1,0,mid],[2,0,light],[3,0,mid],[4,0,mid],
    [1,1,mid],[2,1,light],[3,1,stitch],[4,1,mid],
    [1,2,mid],[2,2,mid],[3,2,mid],[4,2,mid],
    [1,3,mid],[2,3,light],[3,3,stitch],[4,3,mid],
    [1,4,mid],[2,4,mid],[3,4,mid],[4,4,mid],
    [2,5,mid],[3,5,mid],[4,5,deep],
    [1,6,mid],[2,6,light],[3,6,mid],[4,6,mid],
    [0,7,toe],[1,7,toe],[2,7,mid],[3,7,mid],[4,7,dark],
    [0,8,deep],[1,8,deep],[2,8,deep],[3,8,deep],[4,8,dark],
  ];
  return (
    <Svg width={size} height={size * 1.5} viewBox="0 0 15 27">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}

// ─── Health / Heart ───────────────────────────────────────────────────────────
export function HealthIcon({ size = 18, focused: _focused }: { size?: number; focused?: boolean }) {
  const base   = '#cc2222';
  const bright = '#ff4444';
  const hilite = '#ff8888';
  const cross  = '#ffcccc';
  const pixels: PixelList = [
    [0,1,base],[1,0,base],[3,0,base],[4,1,base],
    [0,2,base],[1,2,bright],[2,2,bright],[3,2,bright],[4,2,base],
    [1,3,base],[2,3,bright],[3,3,base],
    [2,4,base],
    [1,1,hilite],[2,1,bright],
    [2,0,cross],[2,1,cross],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 15 15">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}

// ─── Rewards / Trophy ─────────────────────────────────────────────────────────
export function TrophyIcon({ size = 18, focused: _focused }: { size?: number; focused?: boolean }) {
  const pixels: PixelList = [
    [0,0,'#7a5000'],[0,1,'#7a5000'],[5,0,'#7a5000'],[5,1,'#7a5000'],
    [1,0,'#D4A017'],[2,0,'#f0c040'],[3,0,'#f0c040'],[4,0,'#D4A017'],
    [1,1,'#D4A017'],[2,1,'#f0c040'],[3,1,'#f0c040'],[4,1,'#D4A017'],
    [1,2,'#D4A017'],[2,2,'#f0c040'],[3,2,'#D4A017'],
    [2,3,'#D4A017'],
    [1,4,'#7a5000'],[2,4,'#D4A017'],[3,4,'#7a5000'],
    [0,5,'#7a5000'],[1,5,'#7a5000'],[2,5,'#7a5000'],[3,5,'#7a5000'],[4,5,'#7a5000'],[5,5,'#7a5000'],
    [2,0,'#fffacc'],[3,1,'#fffacc'],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}

// ─── Fire ─────────────────────────────────────────────────────────────────────
export function StreakIcon({ size = 18 }: { size?: number }) {
  const pixels: PixelList = [
    [2,0,'#D4A017'],
    [1,1,'#D4A017'],[2,1,'#f0c040'],[3,1,'#D4A017'],
    [0,2,'#e85d04'],[1,2,'#f48c06'],[2,2,'#f0c040'],[3,2,'#f48c06'],[4,2,'#e85d04'],
    [0,3,'#e85d04'],[1,3,'#f48c06'],[2,3,'#f48c06'],[3,3,'#f48c06'],[4,3,'#e85d04'],
    [1,4,'#cc2200'],[2,4,'#e85d04'],[3,4,'#cc2200'],
    [1,5,'#3B1A08'],[2,5,'#cc2200'],[3,5,'#3B1A08'],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 15 18">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}

// ─── Pin ──────────────────────────────────────────────────────────────────────
export function PinIcon({ size = 14 }: { size?: number }) {
  const pixels: PixelList = [
    [1,0,'#cc2222'],[2,0,'#ff4444'],[3,0,'#cc2222'],
    [0,1,'#cc2222'],[1,1,'#ff6666'],[2,1,'#ff4444'],[3,1,'#ff4444'],[4,1,'#cc2222'],
    [0,2,'#cc2222'],[1,2,'#ff4444'],[2,2,'#ff4444'],[3,2,'#ff4444'],[4,2,'#cc2222'],
    [1,3,'#cc2222'],[2,3,'#ff4444'],[3,3,'#cc2222'],
    [2,4,'#cc2222'],
    [2,5,'#8B4513'],
  ];
  return (
    <Svg width={size} height={size * 1.2} viewBox="0 0 15 18">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}


// ─── Target / Goal ────────────────────────────────────────────────────────────
export function TargetIcon({ size = 18 }: { size?: number }) {
  const pixels: PixelList = [
    [1,0,'#cc2222'],[2,0,'#cc2222'],[3,0,'#cc2222'],
    [0,1,'#cc2222'],[4,1,'#cc2222'],
    [0,2,'#cc2222'],[4,2,'#cc2222'],
    [0,3,'#cc2222'],[4,3,'#cc2222'],
    [1,4,'#cc2222'],[2,4,'#cc2222'],[3,4,'#cc2222'],
    [1,1,'#f5f5f5'],[2,1,'#f5f5f5'],[3,1,'#f5f5f5'],
    [1,2,'#f5f5f5'],[3,2,'#f5f5f5'],
    [1,3,'#f5f5f5'],[2,3,'#f5f5f5'],[3,3,'#f5f5f5'],
    [2,2,'#cc2222'],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 15 15">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}

// ─── Map ──────────────────────────────────────────────────────────────────────
export function MapIcon({ size = 18 }: { size?: number }) {
  const pixels: PixelList = [
    [0,0,'#CD853F'],[1,0,'#f5deb3'],[2,0,'#f5deb3'],[4,0,'#f5deb3'],[5,0,'#f5deb3'],
    [0,1,'#CD853F'],[1,1,'#f5deb3'],[2,1,'#D4A017'],[4,1,'#f5deb3'],[5,1,'#f5deb3'],
    [0,2,'#CD853F'],[1,2,'#f5deb3'],[2,2,'#f5deb3'],[4,2,'#D4A017'],[5,2,'#f5deb3'],
    [0,3,'#CD853F'],[1,3,'#D4A017'],[2,3,'#f5deb3'],[4,3,'#f5deb3'],[5,3,'#f5deb3'],
    [0,4,'#CD853F'],[1,4,'#f5deb3'],[2,4,'#f5deb3'],[4,4,'#f5deb3'],[5,4,'#CD853F'],
    [3,0,'#A0522D'],[3,1,'#A0522D'],[3,2,'#A0522D'],[3,3,'#A0522D'],[3,4,'#A0522D'],
  ];
  return (
    <Svg width={size} height={size * 0.85} viewBox="0 0 18 15">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
export function CalendarIcon({ size = 18 }: { size?: number }) {
  const pixels: PixelList = [
    [0,0,'#D4A017'],[1,0,'#3B1A08'],[2,0,'#D4A017'],[3,0,'#D4A017'],[4,0,'#3B1A08'],[5,0,'#D4A017'],
    [0,1,'#8B4513'],[1,1,'#f5deb3'],[2,1,'#f5deb3'],[3,1,'#f5deb3'],[4,1,'#f5deb3'],[5,1,'#8B4513'],
    [0,2,'#8B4513'],[1,2,'#A0522D'],[2,2,'#f5deb3'],[3,2,'#A0522D'],[4,2,'#f5deb3'],[5,2,'#8B4513'],
    [0,3,'#8B4513'],[1,3,'#f5deb3'],[2,3,'#A0522D'],[3,3,'#f5deb3'],[4,3,'#A0522D'],[5,3,'#8B4513'],
    [0,4,'#8B4513'],[1,4,'#8B4513'],[2,4,'#8B4513'],[3,4,'#8B4513'],[4,4,'#8B4513'],[5,4,'#8B4513'],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 18 15">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}


// ─── Medic / Cross (screen title) ────────────────────────────────────────────
export function MedicIcon({ size = 18 }: { size?: number }) {
  const pixels: PixelList = [
    [1,0,'#cc2222'],[2,0,'#cc2222'],[3,0,'#cc2222'],
    [0,1,'#cc2222'],[1,1,'#ff6666'],[2,1,'#ff6666'],[3,1,'#ff6666'],[4,1,'#cc2222'],
    [0,2,'#cc2222'],[1,2,'#ff6666'],[2,2,'#ffffff'],[3,2,'#ff6666'],[4,2,'#cc2222'],
    [0,3,'#cc2222'],[1,3,'#ff6666'],[2,3,'#ff6666'],[3,3,'#ff6666'],[4,3,'#cc2222'],
    [1,4,'#cc2222'],[2,4,'#cc2222'],[3,4,'#cc2222'],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 15 15">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}

// ─── Dysentery (sick face) ────────────────────────────────────────────────────
export function DysenteryIcon({ size = 20 }: { size?: number }) {
  const pixels: PixelList = [
    // face
    [1,0,'#f5c842'],[2,0,'#f5c842'],[3,0,'#f5c842'],
    [0,1,'#f5c842'],[1,1,'#f5c842'],[2,1,'#f5c842'],[3,1,'#f5c842'],[4,1,'#f5c842'],
    [0,2,'#f5c842'],[1,2,'#3B1A08'],[2,2,'#f5c842'],[3,2,'#3B1A08'],[4,2,'#f5c842'],
    [0,3,'#f5c842'],[1,3,'#f5c842'],[2,3,'#3B1A08'],[3,3,'#f5c842'],[4,3,'#f5c842'],
    [0,4,'#f5c842'],[1,4,'#3B1A08'],[2,4,'#f5c842'],[3,4,'#3B1A08'],[4,4,'#f5c842'],
    [1,5,'#f5c842'],[2,5,'#f5c842'],[3,5,'#f5c842'],
    // sweat drop
    [5,1,'#6ab0f5'],[5,2,'#6ab0f5'],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}

// ─── Exhaustion (zzz face) ────────────────────────────────────────────────────
export function ExhaustionIcon({ size = 20 }: { size?: number }) {
  const pixels: PixelList = [
    // face
    [1,0,'#f5c842'],[2,0,'#f5c842'],[3,0,'#f5c842'],
    [0,1,'#f5c842'],[1,1,'#f5c842'],[2,1,'#f5c842'],[3,1,'#f5c842'],[4,1,'#f5c842'],
    [0,2,'#f5c842'],[1,2,'#3B1A08'],[2,2,'#3B1A08'],[3,2,'#3B1A08'],[4,2,'#f5c842'],
    [0,3,'#f5c842'],[1,3,'#f5c842'],[2,3,'#f5c842'],[3,3,'#f5c842'],[4,3,'#f5c842'],
    [0,4,'#f5c842'],[1,4,'#3B1A08'],[2,4,'#3B1A08'],[3,4,'#3B1A08'],[4,4,'#f5c842'],
    [1,5,'#f5c842'],[2,5,'#f5c842'],[3,5,'#f5c842'],
    // Z's
    [5,0,'#6ab0f5'],[6,0,'#6ab0f5'],
    [6,1,'#6ab0f5'],
    [5,2,'#6ab0f5'],[6,2,'#6ab0f5'],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 21 18">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}

// ─── Dehydration (water drop) ─────────────────────────────────────────────────
export function DehydrationIcon({ size = 20 }: { size?: number }) {
  const pixels: PixelList = [
    // cracked drop outline
    [2,0,'#e07020'],
    [1,1,'#e07020'],[2,1,'#f5a040'],[3,1,'#e07020'],
    [0,2,'#e07020'],[1,2,'#f5a040'],[2,2,'#f5c880'],[3,2,'#f5a040'],[4,2,'#e07020'],
    [0,3,'#e07020'],[1,3,'#f5a040'],[2,3,'#f5a040'],[3,3,'#f5a040'],[4,3,'#e07020'],
    [1,4,'#e07020'],[2,4,'#f5a040'],[3,4,'#e07020'],
    [2,5,'#e07020'],
    // crack lines
    [2,2,'#cc5500'],[2,3,'#cc5500'],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 15 18">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}

// ─── TBD / Skull (critical unknown) ──────────────────────────────────────────
export function SkullIcon({ size = 20 }: { size?: number }) {
  const pixels: PixelList = [
    [1,0,'#d0d0d0'],[2,0,'#d0d0d0'],[3,0,'#d0d0d0'],
    [0,1,'#d0d0d0'],[1,1,'#d0d0d0'],[2,1,'#d0d0d0'],[3,1,'#d0d0d0'],[4,1,'#d0d0d0'],
    [0,2,'#d0d0d0'],[1,2,'#3B1A08'],[2,2,'#d0d0d0'],[3,2,'#3B1A08'],[4,2,'#d0d0d0'],
    [0,3,'#d0d0d0'],[1,3,'#d0d0d0'],[2,3,'#d0d0d0'],[3,3,'#d0d0d0'],[4,3,'#d0d0d0'],
    [0,4,'#d0d0d0'],[1,4,'#3B1A08'],[2,4,'#d0d0d0'],[3,4,'#3B1A08'],[4,4,'#d0d0d0'],
    [1,5,'#d0d0d0'],[2,5,'#3B1A08'],[3,5,'#d0d0d0'],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 15 18">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}

// ─── Check (formula: goal met) ────────────────────────────────────────────────
export function CheckIcon({ size = 18 }: { size?: number }) {
  const b = '#2e7d32'; // border
  const g = '#66bb6a'; // fill
  const w = '#ffffff'; // checkmark
  const pixels: PixelList = [
    [0,0,b],[1,0,b],[2,0,b],[3,0,b],[4,0,b],
    [0,1,b],[1,1,g],[2,1,g],[3,1,g],[4,1,b],
    [0,2,b],[1,2,g],[2,2,g],[3,2,w],[4,2,b],
    [0,3,b],[1,3,w],[2,3,w],[3,3,g],[4,3,b],
    [0,4,b],[1,4,b],[2,4,b],[3,4,b],[4,4,b],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 15 15">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}

// ─── X (formula: goal missed) ─────────────────────────────────────────────────
export function XIcon({ size = 18 }: { size?: number }) {
  const pixels: PixelList = [
    [0,0,'#b71c1c'],[1,0,'#b71c1c'],[2,0,'#b71c1c'],[3,0,'#b71c1c'],[4,0,'#b71c1c'],
    [0,1,'#b71c1c'],[1,1,'#ef5350'],[2,1,'#b71c1c'],[3,1,'#ef5350'],[4,1,'#b71c1c'],
    [0,2,'#b71c1c'],[1,2,'#b71c1c'],[2,2,'#ef5350'],[3,2,'#b71c1c'],[4,2,'#b71c1c'],
    [0,3,'#b71c1c'],[1,3,'#ef5350'],[2,3,'#b71c1c'],[3,3,'#ef5350'],[4,3,'#b71c1c'],
    [0,4,'#b71c1c'],[1,4,'#b71c1c'],[2,4,'#b71c1c'],[3,4,'#b71c1c'],[4,4,'#b71c1c'],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 15 15">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}

// ─── Star (formula: exceed goal) ─────────────────────────────────────────────
export function StarIcon({ size = 18 }: { size?: number }) {
  const pixels: PixelList = [
    [2,0,'#D4A017'],
    [0,1,'#D4A017'],[1,1,'#D4A017'],[2,1,'#f0c040'],[3,1,'#D4A017'],[4,1,'#D4A017'],
    [1,2,'#f0c040'],[2,2,'#f0c040'],[3,2,'#f0c040'],
    [0,3,'#D4A017'],[1,3,'#f0c040'],[2,3,'#D4A017'],[3,3,'#f0c040'],[4,3,'#D4A017'],
    [1,4,'#D4A017'],[3,4,'#D4A017'],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 15 15">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}


// ─── Coin (wagon position marker) ────────────────────────────────────────────
export function CoinIcon({ size = 18 }: { size?: number }) {
  const pixels: PixelList = [
    [1,0,'#D4A017'],[2,0,'#f0c040'],[3,0,'#D4A017'],
    [0,1,'#D4A017'],[1,1,'#f0c040'],[2,1,'#fffacc'],[3,1,'#f0c040'],[4,1,'#D4A017'],
    [0,2,'#D4A017'],[1,2,'#f0c040'],[2,2,'#D4A017'],[3,2,'#f0c040'],[4,2,'#D4A017'],
    [0,3,'#D4A017'],[1,3,'#f0c040'],[2,3,'#f0c040'],[3,3,'#f0c040'],[4,3,'#D4A017'],
    [1,4,'#D4A017'],[2,4,'#f0c040'],[3,4,'#D4A017'],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 15 15">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}

// ─── Lightning / Challenge ────────────────────────────────────────────────────
export function LightningIcon({ size = 18 }: { size?: number }) {
  const pixels: PixelList = [
    [3,0,'#f0c040'],[4,0,'#f0c040'],[5,0,'#f0c040'],
    [2,1,'#f0c040'],[3,1,'#f0c040'],[4,1,'#D4A017'],
    [1,2,'#f0c040'],[2,2,'#f0c040'],[3,2,'#D4A017'],
    [0,3,'#f0c040'],[1,3,'#f0c040'],[2,3,'#f0c040'],[3,3,'#f0c040'],[4,3,'#f0c040'],
    [1,4,'#D4A017'],[2,4,'#f0c040'],[3,4,'#f0c040'],
    [2,5,'#D4A017'],[3,5,'#f0c040'],
    [3,6,'#D4A017'],
  ];
  return (
    <Svg width={size} height={size * 1.2} viewBox="0 0 18 21">
      {pixels.map(([c, r, color], i) => px(c, r, color, i))}
    </Svg>
  );
}


// ─── Reward Badge Icons ───────────────────────────────────────────────────────

// Trail Blazer — sneaker/boot with flame
export function RewardTrailBlazer({ size = 28 }: { size?: number }) {
  const pixels: PixelList = [
    // boot
    [1,0,'#A0522D'],[2,0,'#CD853F'],[3,0,'#A0522D'],
    [1,1,'#A0522D'],[2,1,'#CD853F'],[3,1,'#F5DEB3'],[4,1,'#A0522D'],
    [1,2,'#A0522D'],[2,2,'#A0522D'],[3,2,'#A0522D'],[4,2,'#A0522D'],
    [0,3,'#D2691E'],[1,3,'#D2691E'],[2,3,'#A0522D'],[3,3,'#A0522D'],[4,3,'#6B2F00'],
    [0,4,'#6B2F00'],[1,4,'#6B2F00'],[2,4,'#6B2F00'],[3,4,'#6B2F00'],[4,4,'#3B1A08'],
    // flame beside boot
    [5,1,'#D4A017'],[6,1,'#f0c040'],
    [5,2,'#e85d04'],[6,2,'#f48c06'],[7,2,'#D4A017'],
    [5,3,'#cc2200'],[6,3,'#e85d04'],[7,3,'#e85d04'],
    [6,4,'#cc2200'],
  ];
  return <Svg width={size} height={size} viewBox="0 0 24 15">{pixels.map(([c,r,color],i)=>px(c,r,color,i))}</Svg>;
}

// Fort Kearny — castle tower
export function RewardFortKearny({ size = 28 }: { size?: number }) {
  const w = '#d0d0d0'; const g = '#888'; const k = '#333'; const y = '#D4A017';
  const pixels: PixelList = [
    [0,0,w],[2,0,w],[4,0,w],[6,0,w],
    [0,1,w],[1,1,w],[2,1,w],[3,1,w],[4,1,w],[5,1,w],[6,1,w],
    [0,2,w],[1,2,k],[2,2,w],[3,2,y],[4,2,w],[5,2,k],[6,2,w],
    [0,3,w],[1,3,w],[2,3,w],[3,3,y],[4,3,w],[5,3,w],[6,3,w],
    [0,4,g],[1,4,g],[2,4,g],[3,4,w],[4,4,g],[5,4,g],[6,4,g],
    [1,5,g],[2,5,g],[3,5,k],[4,5,g],[5,5,g],
    [2,6,g],[3,6,g],[4,6,g],
  ];
  return <Svg width={size} height={size} viewBox="0 0 21 21">{pixels.map(([c,r,color],i)=>px(c,r,color,i))}</Svg>;
}

// Chimney Rock — tall spire
export function RewardChimneyRock({ size = 28 }: { size?: number }) {
  const r = '#8B4513'; const l = '#CD853F'; const k = '#3B1A08'; const s = '#87CEEB';
  const pixels: PixelList = [
    [3,0,s],[4,0,k],
    [3,1,l],[4,1,k],
    [3,2,r],[4,2,k],
    [3,3,r],[4,3,k],
    [2,4,k],[3,4,l],[4,4,r],[5,4,k],
    [2,5,r],[3,5,r],[4,5,r],[5,5,k],
    [1,6,k],[2,6,r],[3,6,l],[4,6,r],[5,6,r],[6,6,k],
    [1,7,r],[2,7,r],[3,7,r],[4,7,r],[5,7,r],[6,7,k],
    [0,8,k],[1,8,r],[2,8,r],[3,8,r],[4,8,r],[5,8,r],[6,8,k],
  ];
  return <Svg width={size} height={size} viewBox="0 0 21 27">{pixels.map(([c,r,color],i)=>px(c,r,color,i))}</Svg>;
}

// Halfway Hero — mountain with flag
export function RewardHalfway({ size = 28 }: { size?: number }) {
  const b = '#6b9db8'; const l = '#8fbcd4'; const k = '#333'; const f = '#cc2222'; const p = '#f5deb3';
  const pixels: PixelList = [
    // flag
    [4,0,k],[5,0,f],[6,0,f],
    [4,1,k],[5,1,f],
    [4,2,k],
    // mountain left
    [3,3,k],[4,3,b],
    [2,4,k],[3,4,b],[4,4,l],[5,4,k],
    [1,5,k],[2,5,b],[3,5,l],[4,5,b],[5,5,b],[6,5,k],
    [0,6,k],[1,6,b],[2,6,b],[3,6,b],[4,6,b],[5,6,b],[6,6,b],[7,6,k],
    // snow cap
    [3,3,p],[4,3,p],[5,3,k],
  ];
  return <Svg width={size} height={size} viewBox="0 0 24 21">{pixels.map(([c,r,color],i)=>px(c,r,color,i))}</Svg>;
}

// Oregon Bound — pine tree
export function RewardOregonBound({ size = 28 }: { size?: number }) {
  const d = '#1a5c1a'; const l = '#2d8c2d'; const t = '#6B2F00'; const k = '#0d3d0d';
  const pixels: PixelList = [
    [3,0,k],[4,0,l],[5,0,k],
    [2,1,k],[3,1,l],[4,1,d],[5,1,l],[6,1,k],
    [2,2,k],[3,2,d],[4,2,l],[5,2,d],[6,2,k],
    [1,3,k],[2,3,l],[3,3,d],[4,3,l],[5,3,d],[6,3,l],[7,3,k],
    [1,4,k],[2,4,d],[3,4,l],[4,4,d],[5,4,l],[6,4,d],[7,4,k],
    [0,5,k],[1,5,l],[2,5,d],[3,5,l],[4,5,d],[5,5,l],[6,5,d],[7,5,l],[8,5,k],
    [3,6,k],[4,6,t],[5,6,k],
    [3,7,t],[4,7,t],[5,7,t],
  ];
  return <Svg width={size} height={size} viewBox="0 0 27 24">{pixels.map(([c,r,color],i)=>px(c,r,color,i))}</Svg>;
}

// Oregon City — celebration star burst
export function RewardOregonCity({ size = 28 }: { size?: number }) {
  const y = '#f0c040'; const o = '#e85d04'; const w = '#ffffff'; const k = '#7a5000';
  const pixels: PixelList = [
    [3,0,y],[4,0,y],
    [0,1,y],[1,1,y],[3,1,w],[4,1,w],[6,1,y],[7,1,y],
    [1,2,y],[2,2,y],[3,2,y],[4,2,y],[5,2,y],[6,2,y],
    [0,3,y],[1,3,y],[2,3,w],[3,3,y],[4,3,y],[5,3,w],[6,3,y],[7,3,y],
    [1,4,y],[2,4,y],[3,4,y],[4,4,y],[5,4,y],[6,4,y],
    [0,5,y],[1,5,y],[3,5,o],[4,5,o],[6,5,y],[7,5,y],
    [3,6,y],[4,6,y],
  ];
  return <Svg width={size} height={size} viewBox="0 0 24 21">{pixels.map(([c,r,color],i)=>px(c,r,color,i))}</Svg>;
}

// Streak 3 — small flame
export function RewardStreak3({ size = 28 }: { size?: number }) {
  const pixels: PixelList = [
    [2,0,'#D4A017'],
    [1,1,'#D4A017'],[2,1,'#f0c040'],[3,1,'#D4A017'],
    [0,2,'#e85d04'],[1,2,'#f48c06'],[2,2,'#f0c040'],[3,2,'#f48c06'],[4,2,'#e85d04'],
    [0,3,'#e85d04'],[1,3,'#f48c06'],[2,3,'#f48c06'],[3,3,'#f48c06'],[4,3,'#e85d04'],
    [1,4,'#cc2200'],[2,4,'#e85d04'],[3,4,'#cc2200'],
    [2,5,'#cc2200'],
  ];
  return <Svg width={size} height={size} viewBox="0 0 15 18">{pixels.map(([c,r,color],i)=>px(c,r,color,i))}</Svg>;
}

// Streak 7 — axe
export function RewardStreak7({ size = 28 }: { size?: number }) {
  const k = '#3B1A08'; const s = '#aaaaaa'; const l = '#dddddd'; const t = '#8B4513';
  const pixels: PixelList = [
    [3,0,s],[4,0,s],[5,0,k],
    [2,1,s],[3,1,l],[4,1,s],[5,1,s],[6,1,k],
    [1,2,k],[2,2,s],[3,2,l],[4,2,s],[5,2,k],
    [2,3,k],[3,3,s],[4,3,k],
    [3,4,t],[4,4,k],
    [3,5,t],
    [3,6,t],[4,6,k],
    [2,7,k],[3,7,t],[4,7,t],[5,7,k],
  ];
  return <Svg width={size} height={size} viewBox="0 0 21 24">{pixels.map(([c,r,color],i)=>px(c,r,color,i))}</Svg>;
}

// Streak 14 — crossed swords
export function RewardStreak14({ size = 28 }: { size?: number }) {
  const s = '#c0c0c0'; const l = '#ffffff'; const k = '#555'; const g = '#D4A017';
  const pixels: PixelList = [
    [0,0,s],[6,0,s],
    [0,1,s],[1,1,l],[5,1,l],[6,1,s],
    [1,2,s],[2,2,l],[4,2,l],[5,2,s],
    [2,3,s],[3,3,l],[4,3,s],
    [3,4,g],[4,4,g],
    [2,5,s],[3,5,l],[4,5,s],
    [1,6,s],[2,6,l],[4,6,l],[5,6,s],
    [0,7,s],[1,7,l],[5,7,l],[6,7,s],
    [0,8,s],[6,8,s],
  ];
  return <Svg width={size} height={size} viewBox="0 0 21 27">{pixels.map(([c,r,color],i)=>px(c,r,color,i))}</Svg>;
}

// Streak 30 — shield
export function RewardStreak30({ size = 28 }: { size?: number }) {
  const b = '#1a3a8c'; const l = '#4169e1'; const k = '#0d1f5c'; const g = '#D4A017';
  const pixels: PixelList = [
    [0,0,k],[1,0,b],[2,0,b],[3,0,b],[4,0,b],[5,0,b],[6,0,k],
    [0,1,b],[1,1,l],[2,1,l],[3,1,g],[4,1,l],[5,1,l],[6,1,b],
    [0,2,b],[1,2,l],[2,2,g],[3,2,g],[4,2,g],[5,2,l],[6,2,b],
    [0,3,b],[1,3,l],[2,3,l],[3,3,g],[4,3,l],[5,3,l],[6,3,b],
    [0,4,b],[1,4,l],[2,4,l],[3,4,l],[4,4,l],[5,4,l],[6,4,b],
    [1,5,b],[2,5,b],[3,5,l],[4,5,b],[5,5,b],
    [2,6,k],[3,6,b],[4,6,k],
    [3,7,k],
  ];
  return <Svg width={size} height={size} viewBox="0 0 21 24">{pixels.map(([c,r,color],i)=>px(c,r,color,i))}</Svg>;
}

// Streak 50 — crown
export function RewardStreak50({ size = 28 }: { size?: number }) {
  const g = '#D4A017'; const l = '#f0c040'; const k = '#7a5000'; const r = '#cc2222'; const b = '#4169e1';
  const pixels: PixelList = [
    [0,0,k],[3,0,k],[6,0,k],
    [0,1,l],[1,1,l],[2,1,g],[3,1,l],[4,1,g],[5,1,l],[6,1,l],
    [0,2,l],[1,2,g],[2,2,r],[3,2,g],[4,2,b],[5,2,g],[6,2,l],
    [0,3,g],[1,3,g],[2,3,g],[3,3,g],[4,3,g],[5,3,g],[6,3,g],
    [0,4,k],[1,4,g],[2,4,l],[3,4,g],[4,4,l],[5,4,g],[6,4,k],
    [0,5,k],[1,5,k],[2,5,k],[3,5,k],[4,5,k],[5,5,k],[6,5,k],
  ];
  return <Svg width={size} height={size} viewBox="0 0 21 18">{pixels.map(([c,r,color],i)=>px(c,r,color,i))}</Svg>;
}

// Overachiever — gold star
export function RewardOverachiever({ size = 28 }: { size?: number }) {
  const g = '#D4A017'; const l = '#f0c040'; const h = '#fffacc'; const k = '#7a5000';
  const pixels: PixelList = [
    [3,0,k],[4,0,l],[5,0,k],
    [0,1,k],[1,1,l],[2,1,l],[3,1,l],[4,1,h],[5,1,l],[6,1,l],[7,1,k],
    [1,2,k],[2,2,l],[3,2,l],[4,2,l],[5,2,l],[6,2,k],
    [0,3,k],[1,3,g],[2,3,l],[3,3,l],[4,3,l],[5,3,l],[6,3,g],[7,3,k],
    [0,4,l],[1,4,l],[2,4,k],[3,4,g],[4,4,g],[5,4,k],[6,4,l],[7,4,l],
    [0,5,k],[1,5,l],[2,5,l],[3,5,k],[4,5,k],[5,5,l],[6,5,l],[7,5,k],
    [1,6,k],[2,6,l],[3,6,l],[4,6,l],[5,6,l],[6,6,k],
  ];
  return <Svg width={size} height={size} viewBox="0 0 24 21">{pixels.map(([c,r,color],i)=>px(c,r,color,i))}</Svg>;
}
