import SwiftUI

struct HydrationLogView: View {

    @StateObject private var sync = SyncService.shared
    @Environment(\.dismiss) private var dismiss

    @State private var customMl: String = ""
    @State private var showConfirmation = false
    @State private var lastLoggedAmount: Double = 0

    // Oregon Trail themed water presets
    private let presets: [(label: String, emoji: String, desc: String, ml: Double)] = [
        ("Canteen",       "\u{1FAD7}", "Small sip",       250),   // pouring liquid
        ("Tin Cup",       "\u{2615}",  "Cup of water",    350),   // hot beverage
        ("Water Barrel",  "\u{1FAA3}", "Half barrel",     500),   // bucket
        ("Full Barrel",   "\u{1F6A0}", "Fill 'er up",    1000),   // barrel
    ]

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {

                // ── River Header ──
                VStack(spacing: 6) {
                    Text("\u{1F3DE} You have reached a river")
                        .font(.trailHeading)
                        .foregroundStyle(TrailColor.parchment)
                    Text("Refill your water supply")
                        .font(.trailCaption)
                        .foregroundStyle(TrailColor.dusty)
                }
                .padding(.top, 20)
                .padding(.bottom, 12)

                TrailDivider()
                    .padding(.bottom, 16)

                // ── Quick Fill Options ──
                Text("You may:")
                    .font(.trailBody)
                    .foregroundStyle(TrailColor.parchment)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal)
                    .padding(.bottom, 10)

                VStack(spacing: 8) {
                    ForEach(Array(presets.enumerated()), id: \.offset) { index, preset in
                        Button {
                            logHydration(ml: preset.ml)
                        } label: {
                            HStack(spacing: 12) {
                                Text("\(index + 1).")
                                    .font(.trailBody)
                                    .foregroundStyle(TrailColor.dusty)
                                    .frame(width: 24, alignment: .trailing)
                                Text(preset.emoji)
                                    .font(.title3)
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(preset.label)
                                        .font(.trailBody)
                                        .foregroundStyle(TrailColor.parchment)
                                    Text("\(preset.desc) — \(Int(preset.ml)) ml")
                                        .font(.trailCaption)
                                        .foregroundStyle(TrailColor.dusty)
                                }
                                Spacer()
                            }
                            .padding(.vertical, 8)
                            .padding(.horizontal, 16)
                        }
                        .buttonStyle(.plain)
                        .disabled(sync.isSyncing)
                    }
                }
                .padding(.horizontal)

                TrailDivider()
                    .padding(.vertical, 16)

                // ── Custom Amount ──
                Text("\(presets.count + 1). Fill a custom amount")
                    .font(.trailBody)
                    .foregroundStyle(TrailColor.parchment)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal)
                    .padding(.bottom, 8)

                HStack(spacing: 12) {
                    TextField("", text: $customMl, prompt:
                        Text("Enter ml")
                            .foregroundStyle(TrailColor.dusty.opacity(0.5))
                    )
                    .font(.trailBody)
                    .foregroundStyle(TrailColor.parchment)
                    .keyboardType(.numberPad)
                    .padding(10)
                    .background(
                        RoundedRectangle(cornerRadius: 6)
                            .stroke(TrailColor.leather, lineWidth: 1)
                    )

                    Button {
                        guard let ml = Double(customMl), ml > 0 else { return }
                        logHydration(ml: ml)
                        customMl = ""
                    } label: {
                        Text("Fill")
                    }
                    .buttonStyle(TrailButtonStyle(color: TrailColor.river))
                    .disabled(Double(customMl) ?? 0 <= 0 || sync.isSyncing)
                }
                .padding(.horizontal)

                if sync.isSyncing {
                    HStack(spacing: 8) {
                        ProgressView()
                            .tint(TrailColor.river)
                        Text("Filling barrels...")
                            .font(.trailCaption)
                            .foregroundStyle(TrailColor.dusty)
                    }
                    .padding(.top, 16)
                }

                if let error = sync.errorMessage {
                    Text(error)
                        .font(.trailCaption)
                        .foregroundStyle(TrailColor.danger)
                        .padding(.top, 8)
                }

                Spacer()
            }
            .navigationTitle("")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button {
                        dismiss()
                    } label: {
                        Text("Return to trail")
                            .font(.trailCaption)
                            .foregroundStyle(TrailColor.parchment)
                    }
                }
            }
            .trailBackground()
            .overlay {
                if showConfirmation {
                    confirmationOverlay
                        .transition(.scale.combined(with: .opacity))
                }
            }
        }
    }

    // MARK: - Helpers

    private func logHydration(ml: Double) {
        lastLoggedAmount = ml
        Task {
            await sync.logManualHydration(ml: ml)
            if sync.errorMessage == nil {
                withAnimation { showConfirmation = true }
                try? await Task.sleep(for: .seconds(1.5))
                withAnimation { showConfirmation = false }
            }
        }
    }

    private var confirmationOverlay: some View {
        VStack(spacing: 10) {
            Text("\u{1F4A7}")
                .font(.system(size: 48))
            Text("+\(Int(lastLoggedAmount)) ml")
                .font(.trailStat)
                .foregroundStyle(TrailColor.river)
            Text("Water supply replenished!")
                .font(.trailCaption)
                .foregroundStyle(TrailColor.parchment)
        }
        .padding(28)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(TrailColor.background)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(TrailColor.leather, lineWidth: 2)
        )
    }
}
