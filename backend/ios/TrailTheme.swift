import SwiftUI

// MARK: - Oregon Trail Color Palette

/// Colors sampled from the classic Oregon Trail game:
/// black background, warm tan/peach text, earthy browns for accents.
enum TrailColor {
    /// Deep black background — the classic CRT look
    static let background   = Color(red: 0.04, green: 0.04, blue: 0.04)
    /// Warm tan/peach — primary text color (matches the title screen text)
    static let parchment    = Color(red: 0.90, green: 0.78, blue: 0.65)
    /// Slightly darker tan — secondary/muted text
    static let dusty        = Color(red: 0.68, green: 0.56, blue: 0.44)
    /// Rich brown — decorative borders, dividers
    static let leather      = Color(red: 0.55, green: 0.38, blue: 0.24)
    /// Warm amber/orange — progress fills, highlights (like campfire glow)
    static let campfire     = Color(red: 0.92, green: 0.62, blue: 0.20)
    /// River blue — water/hydration accent
    static let river        = Color(red: 0.35, green: 0.58, blue: 0.78)
    /// Faded green — goal-met / success states
    static let prairie      = Color(red: 0.40, green: 0.62, blue: 0.32)
    /// Danger red — errors, dysentery warnings
    static let danger       = Color(red: 0.82, green: 0.22, blue: 0.18)
}

// MARK: - Trail-Themed Fonts

/// Monospaced fonts to evoke the pixel/terminal feel of the original game.
extension Font {
    /// Large title — trail header text
    static let trailTitle    = Font.system(size: 28, weight: .bold, design: .monospaced)
    /// Section headers
    static let trailHeading  = Font.system(size: 18, weight: .bold, design: .monospaced)
    /// Body/stat text
    static let trailBody     = Font.system(size: 15, weight: .medium, design: .monospaced)
    /// Small labels
    static let trailCaption  = Font.system(size: 12, weight: .regular, design: .monospaced)
    /// Large stat numbers
    static let trailStat     = Font.system(size: 32, weight: .bold, design: .monospaced)
}

// MARK: - Decorative Divider

/// The ornamental western-style divider from the Oregon Trail menus.
struct TrailDivider: View {
    var body: some View {
        HStack(spacing: 8) {
            dashedLine
            Image(systemName: "diamond.fill")
                .font(.system(size: 8))
                .foregroundStyle(TrailColor.leather)
            dashedLine
        }
        .padding(.horizontal)
    }

    private var dashedLine: some View {
        Rectangle()
            .fill(TrailColor.leather)
            .frame(height: 1)
    }
}

// MARK: - Trail Card (replaces .regularMaterial backgrounds)

/// A card with the classic dark background and leather-colored border.
struct TrailCard<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        content
            .padding()
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color(red: 0.10, green: 0.08, blue: 0.06))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(TrailColor.leather, lineWidth: 1.5)
            )
            .padding(.horizontal)
    }
}

// MARK: - Trail Progress Bar

/// A horizontal progress bar styled like a trail distance marker.
struct TrailProgressBar: View {
    let label: String
    let icon: String
    let value: Double
    let goal: Double
    let pct: Double
    let fillColor: Color
    let unit: String

    var body: some View {
        TrailCard {
            VStack(alignment: .leading, spacing: 10) {
                // Header row
                HStack {
                    Text(icon)
                        .font(.title2)
                    Text(label)
                        .font(.trailHeading)
                        .foregroundStyle(TrailColor.parchment)
                    Spacer()
                    Text("\(Int(value))")
                        .font(.trailStat)
                        .foregroundStyle(fillColor)
                    Text(unit)
                        .font(.trailCaption)
                        .foregroundStyle(TrailColor.dusty)
                        .offset(y: 6)
                }

                // Progress track
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        // Track background
                        RoundedRectangle(cornerRadius: 4)
                            .fill(TrailColor.leather.opacity(0.3))
                            .frame(height: 12)

                        // Fill
                        RoundedRectangle(cornerRadius: 4)
                            .fill(fillColor)
                            .frame(width: geo.size.width * min(pct, 1.0), height: 12)
                            .animation(.easeInOut(duration: 0.6), value: pct)

                        // Wagon marker at the fill edge
                        if pct > 0.05 {
                            Text("\u{1F6B6}")  // walking figure
                                .font(.system(size: 14))
                                .offset(x: geo.size.width * min(pct, 1.0) - 10, y: -10)
                                .animation(.easeInOut(duration: 0.6), value: pct)
                        }
                    }
                }
                .frame(height: 20)

                // Goal text
                HStack {
                    Text("Goal: \(Int(goal)) \(unit)")
                        .font(.trailCaption)
                        .foregroundStyle(TrailColor.dusty)
                    Spacer()
                    Text(pct >= 1.0 ? "GOAL REACHED!" : "\(Int(min(pct * 100, 99)))% complete")
                        .font(.trailCaption)
                        .foregroundStyle(pct >= 1.0 ? TrailColor.prairie : TrailColor.dusty)
                }
            }
        }
    }
}

// MARK: - Trail Button Style

/// Button styled like an Oregon Trail menu option.
struct TrailButtonStyle: ButtonStyle {
    var color: Color = TrailColor.campfire

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.trailBody)
            .foregroundStyle(configuration.isPressed ? color : TrailColor.parchment)
            .padding(.horizontal, 20)
            .padding(.vertical, 10)
            .background(
                RoundedRectangle(cornerRadius: 6)
                    .stroke(color, lineWidth: 1.5)
            )
            .opacity(configuration.isPressed ? 0.7 : 1.0)
    }
}

// MARK: - Trail Background Modifier

struct TrailBackground: ViewModifier {
    func body(content: Content) -> some View {
        content
            .background(TrailColor.background.ignoresSafeArea())
            .preferredColorScheme(.dark)
    }
}

extension View {
    func trailBackground() -> some View {
        modifier(TrailBackground())
    }
}
