# Health Tracker API — Claude Code Context

## Project Overview
A FastAPI backend for a cross-platform (iOS + Android) step and hydration tracking app with gamified streaks and achievements — inspired by apps like Vitality Streaks. iOS reads from HealthKit, Android reads from Health Connect. Both platforms POST data to this unified backend.

## Tech Stack
- **Python 3.11+**
- **FastAPI** — API framework
- **PostgreSQL** — primary database
- **SQLAlchemy 2.x** — ORM (use 2.x style where possible)
- **Alembic** — migrations (preferred over `create_all` in production)
- **Pydantic v2** — request/response validation (built into FastAPI)
- **PyJWT / passlib[bcrypt]** — auth
- **APScheduler** — scheduled jobs (streak resets, future analytics)

## Project Structure
```
gold_rush_fitness_backend/
├── CLAUDE.md
│
├── health_tracker/              # FastAPI backend (Python)
│   ├── main.py                  # App entry point, middleware, router registration
│   ├── database.py              # SQLAlchemy engine, SessionLocal, Base, get_db()
│   ├── requirements.txt
│   ├── .env.example             # Copy to .env and fill in secrets
│   │
│   ├── models/                  # SQLAlchemy ORM models
│   │   ├── user.py              # User — auth info, goals (step_goal, hydration_goal_ml)
│   │   ├── health_log.py        # HealthLog — daily steps + hydration per user
│   │   ├── streak.py            # Streak — current/longest streak per metric
│   │   └── achievement.py       # UserAchievement + ACHIEVEMENTS dict + STREAK_BADGES
│   │
│   ├── schemas/
│   │   └── schemas.py           # All Pydantic request/response models
│   │
│   ├── routers/
│   │   ├── auth.py              # POST /auth/register, POST /auth/login
│   │   ├── health.py            # POST /sync
│   │   └── dashboard.py         # GET /dashboard, GET /achievements
│   │
│   └── services/
│       ├── auth_service.py      # JWT creation/validation, password hashing, get_current_user
│       └── streak_engine.py     # Core gamification logic — streak updates + badge awards
│
├── ios/                         # iOS client (Swift / SwiftUI) — Oregon Trail themed
│   ├── TrailTheme.swift         # Theme system — colors, fonts, dividers, cards, progress bars
│   ├── HealthKitManager.swift   # HealthKit read (steps, hydration) + write (manual hydration)
│   ├── HealthAPIClient.swift    # HTTP client — auth, sync, dashboard, achievements
│   ├── SyncService.swift        # Orchestration: HK → API sync + manual hydration + background tasks
│   ├── DashboardView.swift      # Trail-themed dashboard — camp status, progress bars, landmarks
│   ├── HydrationLogView.swift   # "Refill at River" — Oregon Trail menu-style water logging
│   └── README.md                # iOS setup instructions + data flow diagrams
│
├── android/                     # Android client (Kotlin / Jetpack Compose) — Oregon Trail themed
│   ├── app/src/main/java/com/fitness/trail/
│   │   ├── MainActivity.kt         # App entry point
│   │   ├── FitnessTrailApp.kt      # WorkManager initialization
│   │   ├── data/
│   │   │   ├── SyncService.kt      # Background sync orchestration + WorkManager
│   │   │   ├── api/HealthAPIClient.kt  # HTTP client — auth, sync, dashboard, achievements
│   │   │   └── health/HealthKitManager.kt  # Health Connect integration (steps + hydration)
│   │   └── ui/
│   │       ├── theme/Color.kt      # Oregon Trail color palette (matches iOS TrailColor)
│   │       ├── theme/Theme.kt      # Always-dark Material 3 theme
│   │       ├── theme/Type.kt       # Monospace typography
│   │       └── dashboard/
│   │           ├── DashboardView.kt      # Trail-themed dashboard — camp status, progress bars
│   │           ├── DashboardViewModel.kt # MVVM state management
│   │           └── HydrationLogScreen.kt # "Refill at River" — menu-style water logging
│   ├── app/src/main/res/values/strings.xml  # Trail-themed string resources
│   └── build.gradle.kts
│
└── ios-tests/                   # Swift Package — unit tests for iOS logic
```

## Running Locally
```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # fill in DATABASE_URL and SECRET_KEY
createdb health_tracker
uvicorn main:app --reload
# Swagger UI at http://localhost:8000/docs
```

## Environment Variables
```
DATABASE_URL=postgresql://user:password@localhost/health_tracker
SECRET_KEY=<long random string>
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Create account, returns JWT |
| POST | `/auth/login` | No | Login, returns JWT |
| POST | `/sync` | Yes | Sync health data from mobile |
| GET | `/dashboard` | Yes | Today's stats + streaks |
| GET | `/achievements` | Yes | All earned badges |
| GET | `/health` | No | Health check |

All authenticated endpoints expect: `Authorization: Bearer <token>`

## Data Models

### User
- `id` UUID PK
- `email` unique
- `hashed_password`
- `display_name`, `timezone`
- `step_goal` (default 10000), `hydration_goal_ml` (default 2500)

### HealthLog
- One row per `(user_id, log_date)` — unique constraint enforced
- `steps` (int), `hydration_ml` (float)
- `source`: `"healthkit"` | `"health_connect"` | `"manual"`
- Sync is **idempotent** — re-posting same date updates the existing row

### Streak
- One row per `(user_id, metric)` — unique constraint enforced
- `metric`: `"steps"` | `"hydration"` | `"combined"`
- `current_streak`, `longest_streak`, `last_active_date`

### UserAchievement
- `badge_id` references keys in `ACHIEVEMENTS` dict in `models/achievement.py`
- `notified` bool — for future push notification queue

## Streak Logic (services/streak_engine.py)
The main entry point is `process_sync()`. Called after every `/sync`:
1. Determines if `steps_met`, `hydration_met`, `combined_met`
2. Calls `update_streak()` for each of the 3 metrics
3. Streak increment rules:
   - `last_active_date == today` → already synced, no-op
   - `last_active_date == today - 1` → consecutive, increment
   - `last_active_date` is older or None → reset to 1 (or 0 if goal not met)
4. Calls `check_and_award_achievements()` — awards badges at milestone thresholds
5. Returns list of newly earned `badge_id` strings

## Achievement Badges

| badge_id | Trigger |
|----------|---------|
| `first_sync` | First ever health log |
| `steps_3day` | 3-day step streak |
| `steps_7day` | 7-day step streak |
| `steps_30day` | 30-day step streak |
| `hydration_3day` | 3-day hydration streak |
| `hydration_7day` | 7-day hydration streak |
| `combined_7day` | 7-day combined (both goals) streak |
| `combined_30day` | 30-day combined streak |

To add a new badge: add to `ACHIEVEMENTS` dict, add threshold to `STREAK_BADGES`, no other changes needed.

## Sync Payload (from mobile)
```json
{
  "log_date": "2026-03-21",
  "steps": 9200,
  "hydration_ml": 2100.0,
  "source": "healthkit"
}
```

## Coding Conventions
- Keep files focused — one concern per file
- Use `async def` for route handlers, plain `def` for service functions (SQLAlchemy is sync)
- Always use `db.flush()` inside service functions, `db.commit()` only at the top of `process_sync()`
- All new routes go in `routers/`, business logic in `services/`
- New DB models must be imported in `main.py` before `create_all` runs
- Use Pydantic schemas for all request/response shapes — never return raw ORM objects
- Prefer `db.query(Model).filter_by(...)` for simple lookups

## What's Built

### Backend (FastAPI)
- [x] User auth (register/login with JWT)
- [x] Health data sync endpoint (idempotent upsert)
- [x] Streak engine (steps, hydration, combined)
- [x] Achievement system (8 badges)
- [x] Dashboard endpoint

### iOS Client (Swift / SwiftUI)
- [x] HealthKit authorization (read steps + hydration, write hydration)
- [x] Step count reading from Apple Health (`HKStatisticsQuery`, cumulative sum)
- [x] Hydration reading from Apple Health (liters → ml conversion)
- [x] Manual hydration entry — saves to Apple Health + syncs to backend
- [x] HydrationLogView — quick-add presets (250/350/500/1000 ml) + custom ml input
- [x] REST API client with JWT auth (register, login, sync, dashboard, achievements)
- [x] SyncService orchestration — foreground sync + background task at ~10pm
- [x] DashboardView — animated progress rings (steps/hydration) + achievement badges
- [x] Snake_case JSON decoding for FastAPI response compatibility

### Android Client (Kotlin / Jetpack Compose)
- [x] Health Connect integration (read steps + hydration)
- [x] Auth (register/login with JWT token persistence)
- [x] Sync to backend via `/sync` (source: `"healthconnect"`)
- [x] Background sync via WorkManager (daily at ~10pm)
- [x] Oregon Trail themed dashboard — progress bars, camp status, landmarks
- [x] HydrationLogScreen — "Refill at River" menu-style water logging
- [x] Always-dark theme with monospace typography
- [x] MVVM architecture with StateFlow

## What's Not Built Yet (planned)
- [ ] FastAPI backend (Python code described in CLAUDE.md but not yet created)
- [ ] Alembic migrations (currently using `create_all` — fine for dev)
- [ ] User goal update endpoint (`PATCH /users/me/goals`)
- [ ] iOS/Android goal editing UI
- [ ] iOS login/registration UI (auth methods exist, no screen yet)
- [ ] Android manual hydration → Health Connect write (read-only currently)
- [ ] Leaderboard / social features
- [ ] Push notification delivery (APNs / FCM) — `notified` flag is ready
- [ ] Weekly/monthly summary endpoint
- [ ] Deployment (Railway or Render recommended)
- [ ] Rate limiting
- [ ] Tighten CORS origins for production

## Oregon Trail Theme

The app is themed after the classic Oregon Trail game. All UI uses the retro aesthetic.

### Fitness → Trail Concept Mapping
| Fitness Concept | Trail Equivalent | Used In |
|-----------------|-----------------|---------|
| Steps | Miles Traveled | DashboardView |
| Hydration | Water Supply | DashboardView |
| Log Water | Refill at River | HydrationLogView |
| Achievements | Landmarks Discovered | DashboardView |
| Sync | Scout the trail | DashboardView toolbar |
| Overall health % | Camp Status (Excellent/Good/Fair/Poor) | DashboardView |

### Visual Design (TrailTheme.swift)
- **Background**: Near-black (#0A0A0A) — CRT monitor feel
- **Primary text**: Warm parchment tan — `TrailColor.parchment`
- **Secondary text**: Dusty brown — `TrailColor.dusty`
- **Borders/dividers**: Leather brown — `TrailColor.leather`
- **Steps accent**: Campfire amber — `TrailColor.campfire`
- **Water accent**: River blue — `TrailColor.river`
- **Success**: Prairie green — `TrailColor.prairie`
- **Error**: Danger red — `TrailColor.danger`
- **Fonts**: Monospaced system fonts (`.trailTitle`, `.trailHeading`, `.trailBody`, `.trailCaption`, `.trailStat`)

### Reusable Theme Components
- `TrailDivider` — Western ornamental divider with diamond center
- `TrailCard` — Dark card with leather-brown border
- `TrailProgressBar` — Horizontal bar with walking figure marker
- `TrailButtonStyle` — Border-only button matching the menu aesthetic
- `.trailBackground()` — View modifier for black background + dark mode

### Theming Rules for New Views
- Always use `TrailColor.*` — never raw SwiftUI colors
- Always use `.trail*` font styles — never `.body`, `.headline`, etc.
- Apply `.trailBackground()` to every root view
- Use `TrailCard` instead of `.regularMaterial` backgrounds
- Use `TrailDivider` between sections
- Menu-style numbered lists for choices (like the original game)
- Trail metaphors in all user-facing text

## iOS Architecture & Conventions

### Data Flow
```
Auto sync (app open):    HealthKit → HealthKitManager → SyncService → HealthAPIClient → POST /sync
Manual hydration:        User input → HealthKitManager.saveHydration() → Apple Health
                         → re-fetch totals → HealthAPIClient.syncManualHydration() → POST /sync (source: "manual")
Background sync (10pm):  BGAppRefreshTask → same flow as auto sync
```

### Key Patterns
- **Async/await** throughout — modern Swift concurrency, no Combine
- **Singleton services** — `HealthAPIClient.shared`, `SyncService.shared`
- **@Published state** for reactive SwiftUI binding (`isSyncing`, `lastSyncResult`, `errorMessage`)
- **HealthKit writes go to Apple Health first**, then re-read totals before syncing to backend — keeps Apple Health as source of truth
- **Snake_case decoding** — `JSONDecoder.snakeCase` extension matches FastAPI's response format
- **JWT stored in UserDefaults** — key: `"auth_token"` (Keychain recommended for production)

### Adding New iOS Features
- New views → `ios/` folder, SwiftUI
- API calls → add methods to `HealthAPIClient.swift`
- HealthKit reads/writes → add to `HealthKitManager.swift` (update `readTypes`/`writeTypes`)
- Orchestration logic → add to `SyncService.swift`
- Keep views thin — business logic belongs in services

## Android Architecture & Conventions

### Key Patterns
- **MVVM** — `DashboardViewModel` + `StateFlow` for reactive UI
- **Jetpack Compose** with Material 3 — all UI is composable functions
- **Thread-safe singletons** — `HealthAPIClient.shared(context)`, `SyncService.shared(context)`
- **WorkManager** for background sync — periodic 24h job starting at 10pm
- **Raw HttpURLConnection** with Gson — no Retrofit dependency (keeps it lightweight)
- **Health Connect** via `androidx.health.connect:connect-client`

### Android Theme Mapping to iOS
| Android (Compose) | iOS (SwiftUI) |
|---|---|
| `TrailBackground` | `TrailColor.background` |
| `Parchment` | `TrailColor.parchment` |
| `Dusty` | `TrailColor.dusty` |
| `Leather` | `TrailColor.leather` |
| `Campfire` | `TrailColor.campfire` |
| `River` | `TrailColor.river` |
| `Prairie` | `TrailColor.prairie` |
| `Danger` | `TrailColor.danger` |
| `FontFamily.Monospace` | `.system(.monospaced)` |
| `TrailCard` composable | `TrailCard` SwiftUI view |
| `TrailDivider` composable | `TrailDivider` SwiftUI view |

### Adding New Android Features
- New screens → `ui/` package, Compose `@Composable` functions
- API calls → add methods to `HealthAPIClient.kt`
- Health Connect reads/writes → add to `HealthKitManager.kt`
- State management → add to `DashboardViewModel.kt` or create new ViewModel
- String resources → `res/values/strings.xml` (use trail metaphors)

## Known Decisions & Rationale
- **PostgreSQL over InfluxDB** — step/hydration data volume doesn't justify a time-series DB yet; standard PostgreSQL with date indexing is sufficient
- **Sync is idempotent** — mobile can re-sync same day safely, no double-counting
- **Streak resets are immediate** — if goal not met today and last active was yesterday or earlier, streak goes to 0. No grace periods yet.
- **Hydration in ml throughout** — HealthKit returns liters, iOS client converts to ml before posting. Backend always stores and returns ml.
- **JWT expiry is 7 days** — adjust `ACCESS_TOKEN_EXPIRE_MINUTES` in `auth_service.py` if needed
- **Manual hydration writes to Apple Health first** — saves the entry to HealthKit, re-reads the day's cumulative total, then syncs that total to the backend. Apple Health stays the single source of truth for hydration data.
- **Manual hydration uses source "manual"** — the `/sync` payload uses `source: "manual"` to distinguish from automatic HealthKit syncs (`source: "healthkit"`). Backend treats both identically for streak/achievement logic.
- **No separate hydration endpoint needed** — manual hydration reuses the existing `/sync` endpoint since it's idempotent and already handles upserts by date. No backend changes required.
