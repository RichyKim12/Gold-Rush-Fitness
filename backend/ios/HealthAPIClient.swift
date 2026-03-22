import Foundation

class HealthAPIClient {
    
    static let shared = HealthAPIClient()
    
    private let baseURL = "http://172.25.147.19:8000"  // Your Mac's local IP
    private var token: String? {
        UserDefaults.standard.string(forKey: "auth_token")
    }
    
    // MARK: - Auth
    
    func register(email: String, password: String, displayName: String) async throws -> String {
        let body: [String: Any] = [
            "email": email,
            "password": password,
            "display_name": displayName
        ]
        let response: TokenResponse = try await post(path: "/auth/register", body: body, authenticated: false)
        saveToken(response.accessToken)
        return response.accessToken
    }
    
    func login(email: String, password: String) async throws -> String {
        let body: [String: Any] = ["email": email, "password": password]
        let response: TokenResponse = try await post(path: "/auth/login", body: body, authenticated: false)
        saveToken(response.accessToken)
        return response.accessToken
    }
    
    func saveToken(_ token: String) {
        UserDefaults.standard.set(token, forKey: "auth_token")
    }
    
    var isLoggedIn: Bool { token != nil }
    
    // MARK: - Health Sync
    
    @discardableResult
    func syncHealthData(snapshot: HealthSnapshot) async throws -> SyncResponse {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        
        let body: [String: Any] = [
            "log_date":      formatter.string(from: snapshot.date),
            "steps":         snapshot.steps,
            "hydration_ml":  snapshot.hydrationMl,
            "source":        "healthkit"
        ]
        return try await post(path: "/sync", body: body, authenticated: true)
    }
    
    // MARK: - Manual Hydration Sync

    /// Syncs a manual hydration entry. Fetches current HealthKit totals (which now
    /// include the just-saved manual entry) and posts to /sync with source "manual".
    @discardableResult
    func syncManualHydration(snapshot: HealthSnapshot) async throws -> SyncResponse {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"

        let body: [String: Any] = [
            "log_date":      formatter.string(from: snapshot.date),
            "steps":         snapshot.steps,
            "hydration_ml":  snapshot.hydrationMl,
            "source":        "manual"
        ]
        return try await post(path: "/sync", body: body, authenticated: true)
    }

    // MARK: - Dashboard
    
    func fetchDashboard() async throws -> DashboardResponse {
        return try await get(path: "/dashboard")
    }
    
    // MARK: - Achievements
    
    func fetchAchievements() async throws -> [Achievement] {
        return try await get(path: "/achievements")
    }
    
    // MARK: - Generic HTTP
    
    private func post<T: Decodable>(path: String, body: [String: Any], authenticated: Bool) async throws -> T {
        var request = URLRequest(url: URL(string: baseURL + path)!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if authenticated, let token {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        try validateResponse(response, data: data)
        return try JSONDecoder.snakeCase.decode(T.self, from: data)
    }
    
    private func get<T: Decodable>(path: String) async throws -> T {
        var request = URLRequest(url: URL(string: baseURL + path)!)
        if let token {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        let (data, response) = try await URLSession.shared.data(for: request)
        try validateResponse(response, data: data)
        return try JSONDecoder.snakeCase.decode(T.self, from: data)
    }
    
    private func validateResponse(_ response: URLResponse, data: Data) throws {
        guard let http = response as? HTTPURLResponse else { return }
        if !(200...299).contains(http.statusCode) {
            let message = (try? JSONDecoder().decode(APIError.self, from: data))?.detail ?? "Unknown error"
            throw APIClientError.serverError(http.statusCode, message)
        }
    }
}

// MARK: - Response Models

struct TokenResponse: Decodable {
    let accessToken: String
}

struct SyncResponse: Decodable {
    let logDate: String
    let steps: Int
    let hydrationMl: Double
    let stepsGoalMet: Bool
    let hydrationGoalMet: Bool
    let newAchievements: [String]
}

struct DashboardResponse: Decodable {
    let today: String
    let steps: Int
    let hydrationMl: Double
    let stepGoal: Int
    let hydrationGoalMl: Int
    let stepsPct: Double
    let hydrationPct: Double
    let totalAchievements: Int
}

struct Achievement: Decodable, Identifiable {
    var id: String { badgeId }
    let badgeId: String
    let name: String
    let desc: String
    let icon: String
    let earnedAt: String
}

struct APIError: Decodable {
    let detail: String
}

enum APIClientError: LocalizedError {
    case serverError(Int, String)
    var errorDescription: String? {
        switch self {
        case .serverError(let code, let msg): return "Error \(code): \(msg)"
        }
    }
}

// MARK: - Helpers

extension JSONDecoder {
    static var snakeCase: JSONDecoder {
        let d = JSONDecoder()
        d.keyDecodingStrategy = .convertFromSnakeCase
        return d
    }
}
