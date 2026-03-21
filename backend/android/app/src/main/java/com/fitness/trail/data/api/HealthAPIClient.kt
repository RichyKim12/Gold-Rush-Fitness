package com.fitness.trail.data.api

import android.content.Context
import com.fitness.trail.data.health.HealthSnapshot
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.*

class HealthAPIClient private constructor(context: Context) {

    companion object {
        @Volatile
        private var instance: HealthAPIClient? = null

        fun shared(context: Context): HealthAPIClient {
            return instance ?: synchronized(this) {
                instance ?: HealthAPIClient(context.applicationContext).also { instance = it }
            }
        }
    }

    private val baseUrl = "http://localhost:8000"
    private val gson = Gson()
    private val prefs = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)

    private var token: String?
        get() = prefs.getString("auth_token", null)
        set(value) = prefs.edit().putString("auth_token", value).apply()

    val isLoggedIn: Boolean get() = token != null

    fun saveToken(token: String) {
        this.token = token
    }

    suspend fun register(email: String, password: String, displayName: String): String {
        val body = mapOf(
            "email" to email,
            "password" to password,
            "display_name" to displayName
        )
        val response: TokenResponse = post("/auth/register", body, authenticated = false)
        saveToken(response.accessToken)
        return response.accessToken
    }

    suspend fun login(email: String, password: String): String {
        val body = mapOf("email" to email, "password" to password)
        val response: TokenResponse = post("/auth/login", body, authenticated = false)
        saveToken(response.accessToken)
        return response.accessToken
    }

    suspend fun syncHealthData(snapshot: HealthSnapshot): SyncResponse {
        val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        val body = mapOf(
            "log_date" to dateFormat.format(Date(snapshot.date)),
            "steps" to snapshot.steps,
            "hydration_ml" to snapshot.hydrationMl,
            "source" to "healthconnect"
        )
        return post("/sync", body, authenticated = true)
    }

    suspend fun fetchDashboard(): DashboardResponse = get("/dashboard")

    suspend fun fetchAchievements(): List<Achievement> = get("/achievements")

    private suspend fun <T> post(path: String, body: Map<String, Any>, authenticated: Boolean): T {
        val url = URL("$baseUrl$path")
        val connection = url.openConnection() as HttpURLConnection
        connection.requestMethod = "POST"
        connection.setRequestProperty("Content-Type", "application/json")
        if (authenticated && token != null) {
            connection.setRequestProperty("Authorization", "Bearer $token")
        }
        connection.doOutput = true

        connection.outputStream.use { it.write(gson.toJson(body).toByteArray()) }

        val responseCode = connection.responseCode
        val responseBody = connection.inputStream.bufferedReader().readText()

        if (responseCode !in 200..299) {
            val error = try {
                gson.fromJson(responseBody, APIError::class.java)?.detail
            } catch (e: Exception) { null }
            throw APIClientException(responseCode, error ?: "Unknown error")
        }

        return gson.fromJson(responseBody, (T::class.java))
    }

    private suspend fun <T> get(path: String): T {
        val url = URL("$baseUrl$path")
        val connection = url.openConnection() as HttpURLConnection
        connection.requestMethod = "GET"
        if (token != null) {
            connection.setRequestProperty("Authorization", "Bearer $token")
        }

        val responseCode = connection.responseCode
        val responseBody = connection.inputStream.bufferedReader().readText()

        if (responseCode !in 200..299) {
            val error = try {
                gson.fromJson(responseBody, APIError::class.java)?.detail
            } catch (e: Exception) { null }
            throw APIClientException(responseCode, error ?: "Unknown error")
        }

        return gson.fromJson(responseBody, (T::class.java))
    }
}

data class TokenResponse(val accessToken: String)

data class SyncResponse(
    val logDate: String,
    val steps: Int,
    val hydrationMl: Double,
    val stepsGoalMet: Boolean,
    val hydrationGoalMet: Boolean,
    val newAchievements: List<String>
)

data class DashboardResponse(
    val today: String,
    val steps: Int,
    val hydrationMl: Double,
    val stepGoal: Int,
    val hydrationGoalMl: Int,
    val stepsPct: Double,
    val hydrationPct: Double,
    val totalAchievements: Int
)

data class Achievement(
    val badgeId: String,
    val name: String,
    val desc: String,
    val icon: String,
    val earnedAt: String
) {
    val id: String get() = badgeId
}

data class APIError(val detail: String)

class APIClientException(val code: Int, override val message: String) : Exception(message)
