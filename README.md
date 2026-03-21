# 🪵 Gold Rush Fitness

A health & wellness app inspired by the classic Oregon Trail game. Track your daily steps, maintain your party's health, and journey from Independence, MO to Oregon City.

---

## Features

### 🗺️ Home Screen — The Trail
- **Animated wagon scene** with rolling wheels, bobbing suspension, and dust clouds
- **Sunset prairie landscape** with mountains, stars, and a golden horizon
- **Trail progress bar** showing your position between milestones
- **Party status strip** — Rations, Pace, and Party Size
- **Week heatmap** showing daily step consistency

### 👢 Steps Screen
- **Animated circular ring** tracking today's steps vs. goal
- **Goal selector** — choose 6k, 8k, 10k, 12k, or 15k daily targets
- **Hourly breakdown** bar chart
- **Trail conversion** — see how steps translate to trail miles
- Placeholder for **Health App sync** (Apple Health / Google Fit)

### ❤️ Health Screen
- **Multi-bar vitality system** — Your Health, Oxen Strength, Wagon Condition, Morale, Food Supply
- **Pixel-segmented health bars** with color coding (green → yellow → red → skull)
- **Ailment risk tracker** — Dysentery, Exhaustion, Broken Leg, Cholera
- **Health formula** explaining exactly how consistency affects your score

### 🏆 Rewards Screen
- **Trail progress map** with milestone markers (Fort Kearny, Chimney Rock, South Pass...)
- **Badge collection** grid with unlock progress for each badge
- **Filter tabs** — All / Unlocked / Locked
- **Daily challenge** system for bonus rewards

---

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo`
- iOS Simulator (Mac) or Android Emulator
- Or the [Expo Go](https://expo.dev/client) app on your phone

### Install & Run

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android
npx expo start --android
```

---

## Architecture

```
OregonTrailHealth/
├── app/
│   ├── _layout.tsx          # Root navigation
│   └── (tabs)/
│       ├── _layout.tsx      # Tab bar config
│       ├── index.tsx        # 🗺️  Home / Trail screen
│       ├── steps.tsx        # 👢  Step tracking screen
│       ├── health.tsx       # ❤️  Health detail screen
│       └── rewards.tsx      # 🏆  Rewards & badges screen
├── components/
│   ├── WagonScene.tsx       # Animated SVG wagon + landscape
│   ├── HealthBar.tsx        # Pixel-segmented health bars
│   ├── StepRing.tsx         # Animated circular step progress
│   └── WeekHeatmap.tsx      # 7-day step consistency grid
├── constants/
│   ├── theme.ts             # Colors, trail data, milestones, rewards
│   └── mockData.ts          # Mock state (replace with real data store)
└── app.config.ts            # Expo configuration
```

---

## Replacing Mock Data

The app uses `constants/mockData.ts` for all state. To wire up real data:

1. **Steps**: Replace `todaySteps` and `weekHistory` with `expo-pedometer` data
2. **Persistence**: Use `AsyncStorage` or `expo-sqlite` to store daily records
3. **Health App sync**: Use `expo-health` (iOS) or Android Health Connect
4. **Trail miles**: Calculate from cumulative step totals (`totalSteps / 2000`)

---

## Key Design Decisions

| Feature | Implementation |
|---|---|
| Step → Miles | 2,000 steps = 1 trail mile |
| Health Score | Starts at 50, +10 per goal met, -8 per miss, +15 for 7-day streak |
| Trail Length | 2,170 miles (historical Oregon Trail) |
| Milestones | 8 historical stops from Independence to Oregon City |

---

## Dependencies

- `expo` + `expo-router` — Navigation framework
- `react-native-svg` — Wagon scene and progress rings
- `expo-linear-gradient` — Background gradients
- `expo-pedometer` — Step counting (requires device)
- `expo-haptics` — Tactile feedback on badge unlock

---

*"You have died of dysentery."* — unless you keep walking! 🦺