// app/(tabs)/health.tsx — Health Detail Screen
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAppData } from '../../hooks/useAppData';
import HealthBar from '../../components/HealthBar';
import {
  MedicIcon,
  StreakIcon,
  CheckIcon,
  XIcon,
  StarIcon,
  DysenteryIcon,
  ExhaustionIcon,
  DehydrationIcon,
  SkullIcon,
  HealthIcon,
} from '../../components/PixelIcons';

type AilmentKey = 'Dysentery' | 'Exhaustion' | 'Dehyrdration' | 'TBD';

const AILMENT_ICONS: Record<AilmentKey, React.ReactNode> = {
  Dysentery:    <DysenteryIcon size={22} />,
  Exhaustion:   <ExhaustionIcon size={22} />,
  Dehyrdration: <DehydrationIcon size={22} />,
  TBD:          <SkullIcon size={22} />,
};

const AILMENTS: { name: AilmentKey; risk: string; tip: string }[] = [
  { name: 'Dysentery',    risk: 'Low',      tip: 'Keep up your steps to stay fit' },
  { name: 'Exhaustion',   risk: 'Medium',   tip: 'You missed 2 step goals recently' },
  { name: 'Dehyrdration', risk: 'High',     tip: 'Good pace reduces injury risk' },
  { name: 'TBD',          risk: 'Critical', tip: 'Consistency keeps illness away' },
];

export default function HealthScreen() {
  const { colors } = useTheme();
  const { state, isLoading, error } = useAppData();

  if (isLoading || error) {
    return (
      <LinearGradient
        colors={[colors.gradientTop, colors.gradientBottom]}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={{ color: colors.parchment, fontSize: 14 }}>{error || 'Loading health data...'}</Text>
      </LinearGradient>
    );
  }

  const RISK_COLORS: Record<string, string> = {
    Low:      colors.healthFull,
    Medium:   colors.healthGood,
    High:     colors.healthLow,
    Critical: colors.healthEmpty,
  };

  const s = makeStyles(colors);

  return (
    <LinearGradient
      colors={[colors.gradientTop, colors.gradientBottom]}
      style={s.root}
    >
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <View style={s.titleRow}>
          <HealthIcon size={22} />
          <Text style={s.screenTitle}>Health Report</Text>
        </View>

        {/* Overall health */}
        <View style={s.overallCard}>
          <View style={s.overallLeft}>
            <Text style={s.overallTitle}>Overall Vitality</Text>
          </View>
          <View style={s.overallRight}>
            <Text style={s.overallScore}>{state.healthScore}</Text>
            <Text style={s.overallUnit}>/ 100</Text>
          </View>
        </View>

        {/* Ailment risks */}
        <View style={s.ailmentsCard}>
          <Text style={s.cardTitle}>AILMENT RISK TRACKER</Text>
          {AILMENTS.map((a, i) => (
            <View key={i} style={s.ailmentRow}>
              <View style={s.ailmentIconWrap}>
                {AILMENT_ICONS[a.name]}
              </View>
              <View style={s.ailmentInfo}>
                <Text style={s.ailmentName}>{a.name}</Text>
                <Text style={s.ailmentTip}>{a.tip}</Text>
              </View>
              <View style={[
                s.riskBadge,
                {
                  backgroundColor: `${RISK_COLORS[a.risk]}22`,
                  borderColor: RISK_COLORS[a.risk],
                }
              ]}>
                <Text style={[s.riskText, { color: RISK_COLORS[a.risk] }]}>
                  {a.risk}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* How health is calculated */}
        <View style={s.formulaCard}>
          <Text style={s.cardTitle}>HOW IT'S CALCULATED</Text>
          <View style={s.formulaRow}>
            <CheckIcon size={18} />
            <View style={s.formulaText}>
              <Text style={s.formulaLabel}>Daily goal met</Text>
              <Text style={s.formulaValue}>+10 vitality</Text>
            </View>
          </View>
          <View style={s.formulaRow}>
            <XIcon size={18} />
            <View style={s.formulaText}>
              <Text style={s.formulaLabel}>Goal missed</Text>
              <Text style={s.formulaValue}>-8 vitality</Text>
            </View>
          </View>
          <View style={s.formulaRow}>
            <StreakIcon size={18} />
            <View style={s.formulaText}>
              <Text style={s.formulaLabel}>7-day streak bonus</Text>
              <Text style={s.formulaValue}>+15 vitality</Text>
            </View>
          </View>
          <View style={s.formulaRow}>
            <StarIcon size={18} />
            <View style={s.formulaText}>
              <Text style={s.formulaLabel}>Exceed goal by 20%+</Text>
              <Text style={s.formulaValue}>+5 extra vitality</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </LinearGradient>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    root: { flex: 1 },
    scroll: { padding: 16, paddingTop: 52, gap: 14 },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    screenTitle: {
      color: colors.parchment,
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: 'serif',
    },
    screenSub: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 12,
      fontStyle: 'italic',
      marginBottom: 4,
    },
    overallCard: {
      backgroundColor: colors.bgCard,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      gap: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    overallLeft: {
      flex: 1,
      gap: 6,
    },
    overallScore: {
      color: colors.healthFull,
      fontSize: 56,
      fontWeight: 'bold',
      fontFamily: 'monospace',
      lineHeight: 60,
    },
    overallUnit: {
      color: colors.dirtLight,
      fontSize: 16,
      fontFamily: 'monospace',
      marginBottom: 8,
    },
    overallRight: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 2,
    },
    overallTitle: {
      color: colors.parchment,
      fontFamily: 'monospace',
      fontSize: 14,
      fontWeight: 'bold',
    },
    overallSub: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 10,
    },
    consistencyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    consistencyLabel: {
      color: colors.parchmentDark,
      fontFamily: 'monospace',
      fontSize: 9,
      textTransform: 'uppercase',
    },
    consistencyBar: {
      flex: 1,
      height: 6,
      backgroundColor: colors.bgCardLight,
      borderRadius: 3,
      overflow: 'hidden',
    },
    consistencyFill: {
      height: '100%',
      borderRadius: 3,
    },
    consistencyPct: {
      color: colors.parchment,
      fontFamily: 'monospace',
      fontSize: 10,
      fontWeight: 'bold',
    },
    barsCard: {
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 14,
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: {
      color: colors.trailGold,
      fontFamily: 'monospace',
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 4,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      opacity: 0.5,
    },
    formulaCard: {
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 14,
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    formulaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    formulaText: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    formulaLabel: {
      color: colors.parchmentDark,
      fontFamily: 'monospace',
      fontSize: 12,
    },
    formulaValue: {
      color: colors.trailGold,
      fontFamily: 'monospace',
      fontSize: 12,
      fontWeight: 'bold',
    },
    ailmentsCard: {
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 14,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    ailmentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    ailmentIconWrap: {
      width: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ailmentInfo: { flex: 1 },
    ailmentName: {
      color: colors.parchment,
      fontFamily: 'monospace',
      fontSize: 12,
      fontWeight: 'bold',
    },
    ailmentTip: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 9,
      marginTop: 1,
    },
    riskBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      borderWidth: 1,
    },
    riskText: {
      fontFamily: 'monospace',
      fontSize: 10,
      fontWeight: 'bold',
    },
    tipBox: {
      backgroundColor: colors.bgCardLight,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tipText: {
      color: colors.parchmentDark,
      fontFamily: 'monospace',
      fontSize: 11,
      lineHeight: 17,
      fontStyle: 'italic',
    },
  });
}
