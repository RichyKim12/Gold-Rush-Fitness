# iOS HealthKit Integration

## Files

| File | Purpose |
|------|---------|
| `HealthKitManager.swift` | Reads steps + hydration from HealthKit |
| `HealthAPIClient.swift` | Posts data to your FastAPI backend |
| `SyncService.swift` | Orchestrates HK → API, handles background sync + manual hydration |
| `DashboardView.swift` | SwiftUI UI wired to the sync service |
| `HydrationLogView.swift` | Manual hydration logging with quick-add presets |

## Xcode Setup (required steps)

### 1. Add HealthKit capability
Target → Signing & Capabilities → + Capability → **HealthKit**

### 2. Add to Info.plist
```xml
<key>NSHealthShareUsageDescription</key>
<string>We read your steps and water intake to track daily health goals.</string>

<key>NSHealthUpdateUsageDescription</key>
<string>We save hydration entries to Apple Health.</string>

<key>BGTaskSchedulerPermittedIdentifiers</key>
<array>
    <string>com.yourapp.healthsync</string>
</array>
```

### 3. Register background task in App entry point
```swift
@main
struct YourApp: App {
    init() {
        SyncService.shared.registerBackgroundTask()
    }
    var body: some Scene {
        WindowGroup { DashboardView() }
    }
}
```

### 4. Point to your backend
In `HealthAPIClient.swift`, update:
```swift
private let baseURL = "https://your-deployed-api.com"
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

Manual hydration entry
    └── SyncService.logManualHydration(ml:)
            ├── HealthKitManager.saveHydration(ml:)   → writes to Apple Health
            ├── HealthKitManager.fetchTodayData()      → re-reads totals (now includes manual)
            └── HealthAPIClient.syncManualHydration()
                    └── POST /sync (source: "manual") → { streaks, new_achievements }

~10pm background task
    └── Same flow runs silently to capture full day
```

## Notes
- HealthKit only works on **real device** — simulator returns 0 for everything
- `dietaryWater` in HealthKit is stored in **liters** — the manager converts to ml for the API
- Sync is **idempotent** — re-syncing the same day just updates the record, won't double-count
