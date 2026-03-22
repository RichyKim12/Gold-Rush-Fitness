# Gold Rush Fitness

> **HoosHack 2026 — Health and Wellness Category**

An Oregon Trail-themed iOS fitness tracker. Walk your steps, survive the trail, and make it to Oregon City without dying of dysentery.

---

## Features

### Trail Screen
- Animated wagon scene with real-time step data from Apple Health
- Trail progress bar and daily milestone tracking
- 7-day step heatmap
- Hydration logging (tap "Log Water" to record oz intake)
- Pull-to-refresh to sync latest health data

### Steps Screen
- Live step count pulled directly from Apple HealthKit
- 3-tier daily goal system: Rest Stop (3k), Halfway (6k), Full Trail (10k)
- Trail miles conversion (2,000 steps = 1 mile)
- Daily streak tracking

### Health Screen
- Vitality bar synced to your activity
- Hydration progress (oz logged vs. 64 oz daily goal)
- Party health stats: rations, pace, health score

### Rewards Screen
- Badge collection with unlock progress
- Trail milestone map (Fort Kearny → Oregon City)
- Daily challenges

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native + Expo (development build) |
| Navigation | Expo Router (file-based) |
| Health Data | `@kingstinct/react-native-healthkit` (Nitro modules) |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| Auth | JWT (python-jose) + bcrypt |
| State | React Context (Auth, Theme, Hydration) |
| Font | Press Start 2P (pixel retro) |

---

## Environment Setup

### Prerequisites

- macOS with Xcode 15+ installed
- Node.js 18+
- Python 3.11+
- PostgreSQL running locally
- An iPhone (physical device required — HealthKit does not work in simulators)

### 1. Clone the repo

```bash
git clone https://github.com/RichyKim12/Gold-Rush-Fitness.git
cd Gold-Rush-Fitness
```

### 2. Backend setup

```bash
cd backend/server

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install "bcrypt==4.0.1"   # pin for passlib compatibility
```

Create `backend/server/app/.env`:

```
DATABASE_URL=postgresql://<your-mac-username>@localhost:5432/health_tracker
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

Set up the database:

```bash
psql postgres -c "CREATE DATABASE health_tracker;"
```

Start the backend:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

> The backend must be accessible from your iPhone. Use your Mac's local WiFi IP (find it in System Settings → Wi-Fi → Details). Both devices must be on the same network.

### 3. Frontend setup

```bash
cd gold-rush-fitness-frontend
npm install
```

Create `gold-rush-fitness-frontend/.env`:

```
EXPO_PUBLIC_API_URL=http://<your-mac-wifi-ip>:8000
```

### 4. Xcode capabilities (required for HealthKit)

Open `gold-rush-fitness-frontend/ios/GoldRushFitness.xcworkspace` in Xcode.

Under your app target → **Signing & Capabilities**, add:
- **HealthKit** — check "Clinical Health Records" if desired
- **Background Modes** — check "Background fetch" and "Background processing"

In `Info.plist`, add:
- `NSHealthShareUsageDescription` — reason string for reading health data
- `NSHealthUpdateUsageDescription` — reason string for writing health data

### 5. Install on iPhone

Connect your iPhone via USB. In Xcode, select your device as the run target and press Run (Cmd+R). Or use Expo CLI:

```bash
npx expo run:ios --device
```

Accept the HealthKit permissions prompt when the app launches.

---

## Running the App

1. Start the backend: `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`
2. Start the frontend: `npx expo start` (for JS changes only — native changes require a full build)
3. Open on your iPhone via the dev build installed in step 5

---

## Project Structure

```
Gold-Rush-Fitness/
├── backend/
│   └── server/
│       └── app/
│           ├── api/          # FastAPI route handlers
│           ├── core/         # Auth, config, goal logic
│           └── models/       # SQLAlchemy database models
└── gold-rush-fitness-frontend/
    ├── app/
    │   ├── _layout.tsx       # Root layout + auth gate
    │   ├── (auth)/           # Login / register screens
    │   └── (tabs)/           # Trail, Steps, Health, Rewards tabs
    ├── context/              # AuthContext, ThemeContext, HydrationContext
    ├── hooks/
    │   └── useHealthData.ts  # HealthKit step query hook
    └── constants/            # Theme, colors, trail milestones
```

---

*"You have died of dysentery." — unless you keep walking.*
