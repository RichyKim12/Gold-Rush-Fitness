import SwiftUI

struct DashboardView: View {

    @StateObject private var sync = SyncService.shared
    @State private var dashboard: DashboardResponse?
    @State private var achievements: [Achievement] = []
    @State private var showHydrationLog = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 0) {

                    // ── Trail Header ──
                    trailHeader
                    TrailDivider()
                        .padding(.vertical, 12)

                    if sync.isSyncing {
                        HStack(spacing: 8) {
                            ProgressView()
                                .tint(TrailColor.campfire)
                            Text("Scouting the trail...")
                                .font(.trailCaption)
                                .foregroundStyle(TrailColor.dusty)
                        }
                        .padding()
                    }

                    if let d = dashboard {
                        // ── Steps → Miles Traveled ──
                        TrailProgressBar(
                            label: "Miles Traveled",
                            icon: "\u{1F9ED}",  // compass
                            value: Double(d.steps),
                            goal: Double(d.stepGoal),
                            pct: d.stepsPct,
                            fillColor: TrailColor.campfire,
                            unit: "steps"
                        )

                        // ── Hydration → Water Supply ──
                        VStack(spacing: 10) {
                            TrailProgressBar(
                                label: "Water Supply",
                                icon: "\u{1F4A7}",  // droplet
                                value: d.hydrationMl,
                                goal: Double(d.hydrationGoalMl),
                                pct: d.hydrationPct,
                                fillColor: TrailColor.river,
                                unit: "ml"
                            )

                            Button {
                                showHydrationLog = true
                            } label: {
                                HStack(spacing: 6) {
                                    Text("\u{1F3D5}")  // camping
                                    Text("Refill at River")
                                }
                            }
                            .buttonStyle(TrailButtonStyle(color: TrailColor.river))
                        }
                        .padding(.top, 4)

                        // ── Trail Status ──
                        TrailDivider()
                            .padding(.vertical, 16)
                        trailStatus(d)

                        // ── Achievements → Landmarks Discovered ──
                        if !achievements.isEmpty {
                            TrailDivider()
                                .padding(.vertical, 16)
                            landmarksSection
                        }

                    } else if !sync.isSyncing {
                        noDataView
                    }

                    if let error = sync.errorMessage {
                        Text(error)
                            .font(.trailCaption)
                            .foregroundStyle(TrailColor.danger)
                            .padding()
                    }
                }
                .padding(.vertical)
            }
            .navigationTitle("")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        Task { await sync.syncToday() }
                    } label: {
                        HStack(spacing: 4) {
                            Text("\u{1F6B6}")
                            Text("Scout")
                                .font(.trailCaption)
                                .foregroundStyle(TrailColor.parchment)
                        }
                    }
                }
            }
            .trailBackground()
        }
        .sheet(isPresented: $showHydrationLog) {
            HydrationLogView()
        }
        .task {
            await sync.syncToday()
            await loadDashboard()
        }
        .onChange(of: sync.lastSyncResult) { _ in
            Task { await loadDashboard() }
        }
    }

    // MARK: - Sub-views

    private var trailHeader: some View {
        VStack(spacing: 6) {
            Text("The Oregon Trail")
                .font(.trailTitle)
                .foregroundStyle(TrailColor.parchment)
            Text("Fitness Tracker")
                .font(.trailCaption)
                .foregroundStyle(TrailColor.dusty)
                .textCase(.uppercase)
                .tracking(4)
        }
        .padding(.top, 8)
    }

    private func trailStatus(_ d: DashboardResponse) -> some View {
        TrailCard {
            VStack(spacing: 8) {
                Text("\u{26FA} Camp Status")
                    .font(.trailHeading)
                    .foregroundStyle(TrailColor.parchment)
                    .frame(maxWidth: .infinity, alignment: .leading)

                HStack {
                    statusItem(
                        label: "Health",
                        value: overallHealth(d),
                        color: overallHealthColor(d)
                    )
                    Spacer()
                    statusItem(
                        label: "Badges",
                        value: "\(d.totalAchievements)",
                        color: TrailColor.campfire
                    )
                }
            }
        }
    }

    private func statusItem(label: String, value: String, color: Color) -> some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.trailBody)
                .foregroundStyle(color)
            Text(label)
                .font(.trailCaption)
                .foregroundStyle(TrailColor.dusty)
        }
    }

    private func overallHealth(_ d: DashboardResponse) -> String {
        let avg = (d.stepsPct + d.hydrationPct) / 2
        if avg >= 1.0 { return "Excellent" }
        if avg >= 0.7 { return "Good" }
        if avg >= 0.4 { return "Fair" }
        return "Poor"
    }

    private func overallHealthColor(_ d: DashboardResponse) -> Color {
        let avg = (d.stepsPct + d.hydrationPct) / 2
        if avg >= 1.0 { return TrailColor.prairie }
        if avg >= 0.7 { return TrailColor.campfire }
        if avg >= 0.4 { return TrailColor.dusty }
        return TrailColor.danger
    }

    private var landmarksSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("\u{1F3D4} Landmarks Discovered")
                .font(.trailHeading)
                .foregroundStyle(TrailColor.parchment)
                .padding(.horizontal)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(achievements) { badge in
                        LandmarkBadge(achievement: badge)
                    }
                }
                .padding(.horizontal)
            }
        }
    }

    private var noDataView: some View {
        TrailCard {
            VStack(spacing: 10) {
                Text("\u{1F6B6}")
                    .font(.system(size: 40))
                Text("The trail awaits...")
                    .font(.trailBody)
                    .foregroundStyle(TrailColor.parchment)
                Text("Tap Scout to begin your journey")
                    .font(.trailCaption)
                    .foregroundStyle(TrailColor.dusty)
            }
            .frame(maxWidth: .infinity)
        }
        .padding(.top, 20)
    }

    private func loadDashboard() async {
        dashboard    = try? await HealthAPIClient.shared.fetchDashboard()
        achievements = (try? await HealthAPIClient.shared.fetchAchievements()) ?? []
    }
}

// MARK: - Landmark Badge (replaces BadgeView)

struct LandmarkBadge: View {
    let achievement: Achievement

    var body: some View {
        VStack(spacing: 6) {
            Text(achievement.icon)
                .font(.largeTitle)
            Text(achievement.name)
                .font(.trailCaption)
                .foregroundStyle(TrailColor.parchment)
                .multilineTextAlignment(.center)
                .lineLimit(2)
        }
        .frame(width: 85)
        .padding(10)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(Color(red: 0.10, green: 0.08, blue: 0.06))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(TrailColor.leather.opacity(0.6), lineWidth: 1)
        )
    }
}
