# Android Health Connect Integration

## Files

| File | Purpose |
|------|---------|
| `data/health/HealthKitManager.kt` | Reads steps + hydration from Health Connect |
| `data/api/HealthAPIClient.kt` | Posts data to your FastAPI backend |
| `data/SyncService.kt` | Orchestrates Health Connect → API, handles background sync |
| `ui/dashboard/DashboardView.kt` | Jetpack Compose UI wired to the sync service |

## Android Studio Setup

### 1. Add Health Connect capability

No special capability needed - Health Connect uses runtime permissions.

### 2. Install Health Connect App

Users need to install Health Connect from Google Play:
https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata

### 3. Point to your backend

In `HealthAPIClient.kt`, update:
```kotlin
private val baseUrl = "https://your-deployed-api.com"
```

## Data Flow

```
App opens
    └── SyncService.syncToday()
            ├── HealthKitManager.requestAuthorization()
            ├── HealthKitManager.fetchTodayData()
            │       ├── fetchSteps(for: today)      → Int
            │       └── fetchHydration(for: today)  → Double (ml)
            └── HealthAPIClient.syncHealthData(snapshot)
                    └── POST /sync  →  { streaks, new_achievements }

~10pm background task (WorkManager)
    └── Same flow runs silently to capture full day
```

## Notes

- Health Connect requires Android 6.0+ (API 28+)
- `dietaryWater` in Health Connect is stored in **milliliters** directly
- Sync is **idempotent** — re-syncing the same day just updates the record, won't double-count
- Background sync uses WorkManager with 24-hour periodic work
