import SwiftUI

@main
struct GoldRushFitnessApp: App {

    init() {
        SyncService.shared.registerBackgroundTask()
    }

    var body: some Scene {
        WindowGroup {
            DashboardView()
        }
    }
}
