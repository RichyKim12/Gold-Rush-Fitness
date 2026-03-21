import Foundation
import BackgroundTasks

/// Orchestrates HealthKit reads → backend sync.
/// Call syncToday() on app open and register the background task for end-of-day sync.
class SyncService: ObservableObject {
    
    static let shared = SyncService()
    
    private let hk  = HealthKitManager()
    private let api = HealthAPIClient.shared
    
    @Published var lastSyncResult: SyncResponse?
    @Published var isSyncing = false
    @Published var errorMessage: String?
    
    // Background task identifier — add this to Info.plist under
    // BGTaskSchedulerPermittedIdentifiers
    static let bgTaskID = "com.yourapp.healthsync"
    
    // MARK: - Main sync
    
    func syncToday() async {
        guard api.isLoggedIn else { return }
        
        await MainActor.run { isSyncing = true }
        
        do {
            try await hk.requestAuthorization()
            let snapshot = try await hk.fetchTodayData()
            let result   = try await api.syncHealthData(snapshot: snapshot)
            
            await MainActor.run {
                lastSyncResult = result
                isSyncing = false
                scheduleBackgroundSync()  // reschedule for later today
            }
        } catch {
            await MainActor.run {
                errorMessage = error.localizedDescription
                isSyncing = false
            }
        }
    }
    
    // MARK: - Manual hydration entry

    /// Saves a manual hydration amount to Apple Health, then re-syncs today's
    /// totals to the backend so the dashboard stays accurate.
    func logManualHydration(ml: Double) async {
        guard api.isLoggedIn else { return }

        await MainActor.run { isSyncing = true }

        do {
            try await hk.requestAuthorization()
            // Write to Apple Health first
            try await hk.saveHydration(ml: ml)
            // Re-fetch totals (now includes the manual entry)
            let snapshot = try await hk.fetchTodayData()
            let result = try await api.syncManualHydration(snapshot: snapshot)

            await MainActor.run {
                lastSyncResult = result
                isSyncing = false
            }
        } catch {
            await MainActor.run {
                errorMessage = error.localizedDescription
                isSyncing = false
            }
        }
    }

    // MARK: - Background sync (runs once near end of day)
    
    func registerBackgroundTask() {
        BGTaskScheduler.shared.register(
            forTaskWithIdentifier: Self.bgTaskID,
            using: nil
        ) { task in
            self.handleBackgroundSync(task: task as! BGAppRefreshTask)
        }
    }
    
    func scheduleBackgroundSync() {
        let request = BGAppRefreshTaskRequest(identifier: Self.bgTaskID)
        // Schedule for ~10pm so the full day's data is captured
        var components = DateComponents()
        components.hour = 22
        components.minute = 0
        request.earliestBeginDate = Calendar.current.nextDate(
            after: Date(),
            matching: components,
            matchingPolicy: .nextTime
        )
        try? BGTaskScheduler.shared.submit(request)
    }
    
    private func handleBackgroundSync(task: BGAppRefreshTask) {
        task.expirationHandler = { task.setTaskCompleted(success: false) }
        Task {
            await syncToday()
            task.setTaskCompleted(success: true)
        }
    }
}
