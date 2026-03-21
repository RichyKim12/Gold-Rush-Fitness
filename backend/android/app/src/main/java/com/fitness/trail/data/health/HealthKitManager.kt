package com.fitness.trail.data.health

import android.content.Context
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.HydrationRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

class HealthKitManager(context: Context) {

    private val store = HealthConnectClient.getOrCreate(context)

    private val readTypes = setOf(
        HealthPermission.getReadPermission(StepsRecord::class),
        HealthPermission.getReadPermission(HydrationRecord::class)
    )

    suspend fun requestAuthorization(): Boolean {
        return try {
            HealthConnectClient.getOrCreate(context)
            true
        } catch (e: Exception) {
            false
        }
    }

    suspend fun fetchSteps(for date: Long): Int = withContext(Dispatchers.IO) {
        val startOfDay = Instant.ofEpochMilli(date)
        val endOfDay = startOfDay.plusMillis(86400000)

        val response = store.readRecords(
            ReadRecordsRequest(
                recordType = StepsRecord::class,
                timeRangeFilter = TimeRangeFilter.between(startOfDay, endOfDay)
            )
        )
        response.records.sumOf { it.count.toInt() }
    }

    suspend fun fetchHydration(for date: Long): Double = withContext(Dispatchers.IO) {
        val startOfDay = Instant.ofEpochMilli(date)
        val endOfDay = startOfDay.plusMillis(86400000)

        val response = store.readRecords(
            ReadRecordsRequest(
                recordType = HydrationRecord::class,
                timeRangeFilter = TimeRangeFilter.between(startOfDay, endOfDay)
            )
        )
        response.records.sumOf { it.volume.inMilliliters }
    }

    suspend fun fetchTodayData(): HealthSnapshot {
        val today = System.currentTimeMillis()
        val steps = fetchSteps(today)
        val hydration = fetchHydration(today)
        return HealthSnapshot(date = today, steps = steps, hydrationMl = hydration)
    }
}

data class HealthSnapshot(
    val date: Long,
    val steps: Int,
    val hydrationMl: Double
)
