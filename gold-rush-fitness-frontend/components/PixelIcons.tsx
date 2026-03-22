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
