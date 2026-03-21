import HealthKit
import Foundation

class HealthKitManager: ObservableObject {
    
    let store = HKHealthStore()
    
    // Types we need to read
    let readTypes: Set<HKObjectType> = [
        HKQuantityType(.stepCount),
        HKQuantityType(.dietaryWater),
    ]

    // Types we need to write (manual hydration entries)
    let writeTypes: Set<HKSampleType> = [
        HKQuantityType(.dietaryWater),
    ]
    
    // MARK: - Authorization
    
    func requestAuthorization() async throws {
        guard HKHealthStore.isHealthDataAvailable() else {
            throw HealthKitError.notAvailable
        }
        try await store.requestAuthorization(toShare: writeTypes, read: readTypes)
    }
    
    // MARK: - Steps
    
    func fetchSteps(for date: Date) async throws -> Int {
        let startOfDay = Calendar.current.startOfDay(for: date)
        let endOfDay   = Calendar.current.date(byAdding: .day, value: 1, to: startOfDay)!
        
        let predicate = HKQuery.predicateForSamples(
            withStart: startOfDay,
            end: endOfDay,
            options: .strictStartDate
        )
        
        return try await withCheckedThrowingContinuation { continuation in
            let query = HKStatisticsQuery(
                quantityType: HKQuantityType(.stepCount),
                quantitySamplePredicate: predicate,
                options: .cumulativeSum
            ) { _, result, error in
                if let error {
                    continuation.resume(throwing: error)
                    return
                }
                let steps = result?.sumQuantity()?.doubleValue(for: .count()) ?? 0
                continuation.resume(returning: Int(steps))
            }
            store.execute(query)
        }
    }
    
    // MARK: - Hydration
    
    func fetchHydration(for date: Date) async throws -> Double {
        let startOfDay = Calendar.current.startOfDay(for: date)
        let endOfDay   = Calendar.current.date(byAdding: .day, value: 1, to: startOfDay)!
        
        let predicate = HKQuery.predicateForSamples(
            withStart: startOfDay,
            end: endOfDay,
            options: .strictStartDate
        )
        
        return try await withCheckedThrowingContinuation { continuation in
            let query = HKStatisticsQuery(
                quantityType: HKQuantityType(.dietaryWater),
                quantitySamplePredicate: predicate,
                options: .cumulativeSum
            ) { _, result, error in
                if let error {
                    continuation.resume(throwing: error)
                    return
                }
                // Convert liters → milliliters
                let ml = (result?.sumQuantity()?.doubleValue(for: .liter()) ?? 0) * 1000
                continuation.resume(returning: ml)
            }
            store.execute(query)
        }
    }
    
    // MARK: - Save manual hydration to Apple Health

    /// Saves a manual hydration entry (in ml) to Apple Health.
    func saveHydration(ml: Double) async throws {
        let quantity = HKQuantity(unit: .liter(), doubleValue: ml / 1000.0)
        let sample = HKQuantitySample(
            type: HKQuantityType(.dietaryWater),
            quantity: quantity,
            start: Date(),
            end: Date()
        )
        try await store.save(sample)
    }

    // MARK: - Combined fetch for today

    func fetchTodayData() async throws -> HealthSnapshot {
        let today = Date()
        async let steps     = fetchSteps(for: today)
        async let hydration = fetchHydration(for: today)
        return try await HealthSnapshot(
            date: today,
            steps: steps,
            hydrationMl: hydration
        )
    }
}

// MARK: - Models

struct HealthSnapshot {
    let date: Date
    let steps: Int
    let hydrationMl: Double
}

enum HealthKitError: LocalizedError {
    case notAvailable
    var errorDescription: String? {
        switch self {
        case .notAvailable: return "HealthKit is not available on this device."
        }
    }
}
