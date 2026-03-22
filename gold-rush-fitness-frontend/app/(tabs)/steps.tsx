// app/(tabs)/steps.tsx — Step Tracking Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { DAILY_STEP_GOAL, TRAIL_TOTAL_MILES } from '../../constants/theme';
import { useAppData } from '../../hooks/useAppData';
import StepRing from '../../components/StepRing';
import WeekHeatmap from '../../components/WeekHeatmap';

export default function StepsScreen() {
  const { colors } = useTheme();
  const { state, isLoading, error } = useAppData();
  const [selectedGoal, setSelectedGoal] = useState(DAILY_STEP_GOAL);
  const [showInfo, setShowInfo] = useState(false);

  if (isLoading || error) {
    return (
      <LinearGradient
        colors={[colors.gradientTop, colors.gradientBottom]}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={{ color: colors.parchment, fontSize: 14 }}>{error || 'Loading step data...'}</Text>
      </LinearGradient>
    );
  }

  const goals = [6000, 8000, 10000, 12000, 15000];
  const milesEarned = Math.floor(state.todaySteps / 2000);
  const stepsLeft = Math.max(0, selectedGoal - state.todaySteps);
  const minutesLeft = Math.round(stepsLeft / 100);

  const s = makeStyles(colors);

  return (
    <LinearGradient
      colors={[colors.gradientTop, colors.gradientBottom]}
      style={s.root}
    >
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header row with info button */}
        <View style={s.titleRow}>
          <View>
            <Text style={s.screenTitle}>Step Progress</Text>
            <Text style={s.screenSub}>Every step moves you down the trail</Text>
          </View>
          <TouchableOpacity style={s.infoButton} onPress={() => setShowInfo(true)}>
            <Text style={s.infoButtonText}>i</Text>
          </TouchableOpacity>
        </View>

        {/* WEEK HEATMAP */}
        <WeekHeatmap history={state.weekHistory} />

        {/* Goal selector */}
        <View style={s.goalCard}>
          <Text style={s.cardTitle}>SET DAILY GOAL</Text>
          <View style={s.goalRow}>
            {goals.map((g) => (
              <TouchableOpacity
                key={g}
                style={[s.goalChip, selectedGoal === g && s.goalChipActive]}
                onPress={() => setSelectedGoal(g)}
              >
                <Text style={[s.goalChipText, selectedGoal === g && s.goalChipTextActive]}>
                  {(g / 1000).toFixed(0)}k
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={s.goalHint}>
            {selectedGoal.toLocaleString()} steps ≈ {Math.round(selectedGoal * 0.0005)} trail miles/day
          </Text>
        </View>

        {/* Main ring */}
        <View style={s.ringCard}>
          <StepRing steps={state.todaySteps} goal={selectedGoal} />
          <View style={s.statsGrid}>
            <View style={s.statBox}>
              <Text style={s.statValue}>{state.todaySteps.toLocaleString()}</Text>
              <Text style={s.statLabel}>Steps Today</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>{milesEarned}</Text>
              <Text style={s.statLabel}>Trail Miles Earned</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>{stepsLeft.toLocaleString()}</Text>
              <Text style={s.statLabel}>Steps Remaining</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>~{minutesLeft}m</Text>
              <Text style={s.statLabel}>Est. Walk Time</Text>
            </View>
          </View>
        </View>

        {/* Connect health app */}
        <TouchableOpacity style={s.connectButton}>
          <Text style={s.connectIcon}>📱</Text>
          <View>
            <Text style={s.connectTitle}>Connect Health App</Text>
            <Text style={s.connectSub}>
              Sync real steps from Apple Health or Google Fit
            </Text>
          </View>
          <Text style={s.connectArrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Info modal */}
      <Modal
        visible={showInfo}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInfo(false)}
      >
        <Pressable style={s.modalOverlay} onPress={() => setShowInfo(false)}>
          <Pressable style={s.modalCard} onPress={() => {}}>
            <View style={s.modalHeader}>
              <View style={s.modalInfoIcon}>
                <Text style={s.modalInfoIconText}>i</Text>
              </View>
              <Text style={s.modalTitle}>Steps → Trail Miles</Text>
              <TouchableOpacity onPress={() => setShowInfo(false)} style={s.closeButton}>
                <Text style={s.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={s.modalDivider} />

            <View style={s.modalRow}>
              <Text style={s.modalEmoji}>👢</Text>
              <Text style={s.modalText}>Every <Text style={s.modalHighlight}>2,000 steps</Text> = 1 trail mile</Text>
            </View>
            <View style={s.modalRow}>
              <Text style={s.modalEmoji}>🎯</Text>
              <Text style={s.modalText}>At <Text style={s.modalHighlight}>{selectedGoal.toLocaleString()} steps/day</Text> you cover {(selectedGoal / 2000).toFixed(0)} miles</Text>
            </View>
            <View style={s.modalRow}>
              <Text style={s.modalEmoji}>🗺️</Text>
              <Text style={s.modalText}>Oregon City is <Text style={s.modalHighlight}>{TRAIL_TOTAL_MILES.toLocaleString()} miles</Text> away</Text>
            </View>
            <View style={s.modalRow}>
              <Text style={s.modalEmoji}>📅</Text>
              <Text style={s.modalText}>At this goal, you'd arrive in <Text style={s.modalHighlight}>{Math.ceil(TRAIL_TOTAL_MILES / (selectedGoal / 2000))} days</Text></Text>
            </View>

            <TouchableOpacity style={s.modalDismiss} onPress={() => setShowInfo(false)}>
              <Text style={s.modalDismissText}>Got it</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    root: { flex: 1 },
    scroll: { padding: 16, paddingTop: 52, gap: 14 },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
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
    infoButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.trailGold,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
    },
    infoButtonText: {
      color: colors.trailGold,
      fontFamily: 'monospace',
      fontSize: 13,
      fontWeight: 'bold',
      fontStyle: 'italic',
    },
    ringCard: {
      backgroundColor: colors.bgCard,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      gap: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      width: '100%',
    },
    statBox: {
      width: '47%',
      backgroundColor: colors.bgCardLight,
      borderRadius: 8,
      padding: 10,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    statValue: {
      color: colors.parchment,
      fontFamily: 'monospace',
      fontSize: 22,
      fontWeight: 'bold',
    },
    statLabel: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 9,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginTop: 2,
      textAlign: 'center',
    },
    goalCard: {
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
    },
    goalRow: {
      flexDirection: 'row',
      gap: 8,
    },
    goalChip: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 6,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.bgCardLight,
    },
    goalChipActive: {
      backgroundColor: colors.trailGold,
      borderColor: colors.trailGold,
    },
    goalChipText: {
      color: colors.parchmentDark,
      fontFamily: 'monospace',
      fontSize: 12,
      fontWeight: 'bold',
    },
    goalChipTextActive: {
      color: colors.inkDark,
    },
    goalHint: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 10,
      fontStyle: 'italic',
    },
    connectButton: {
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
    },
    connectIcon: { fontSize: 24 },
    connectTitle: {
      color: colors.parchment,
      fontFamily: 'monospace',
      fontSize: 13,
      fontWeight: 'bold',
    },
    connectSub: {
      color: colors.dirtLight,
      fontFamily: 'monospace',
      fontSize: 10,
      marginTop: 2,
    },
    connectArrow: {
      color: colors.trailGold,
      fontSize: 20,
      marginLeft: 'auto',
    },
    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
    },
    modalCard: {
      backgroundColor: colors.inkBrown,
      borderRadius: 14,
      padding: 20,
      width: '100%',
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    modalInfoIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.trailGold,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalInfoIconText: {
      color: colors.trailGold,
      fontFamily: 'monospace',
      fontSize: 12,
      fontWeight: 'bold',
      fontStyle: 'italic',
    },
    modalTitle: {
      color: colors.parchment,
      fontFamily: 'monospace',
      fontSize: 14,
      fontWeight: 'bold',
      flex: 1,
    },
    closeButton: {
      padding: 4,
    },
    closeButtonText: {
      color: colors.dirtLight,
      fontSize: 16,
    },
    modalDivider: {
      height: 1,
      backgroundColor: colors.border,
    },
    modalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    modalEmoji: { fontSize: 20 },
    modalText: {
      color: colors.parchmentDark,
      fontFamily: 'monospace',
      fontSize: 12,
      flex: 1,
      lineHeight: 18,
    },
    modalHighlight: {
      color: colors.trailGold,
      fontWeight: 'bold',
    },
    modalDismiss: {
      backgroundColor: colors.trailGold,
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: 'center',
      marginTop: 4,
    },
    modalDismissText: {
      color: colors.inkDark,
      fontFamily: 'monospace',
      fontSize: 13,
      fontWeight: 'bold',
    },
  });
}