package com.fitness.trail.data

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.work.*
import com.fitness.trail.data.api.HealthAPIClient
import com.fitness.trail.data.api.SyncResponse
import com.fitness.trail.data.health.HealthKitManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.Calendar
import java.util.concurrent.TimeUnit

class SyncService private constructor(context: Context) : ViewModel() {

    companion object {
        @Volatile
        private var instance: SyncService? = null

        fun shared(context: Context): SyncService {
            return instance ?: synchronized(this) {
                instance ?: SyncService(context.applicationContext).also { instance = it }
            }
        }

        const val bgTaskID = "com.fitness.trail.healthsync"
    }

    private val hk = HealthKitManager(context)
    private val api = HealthAPIClient.shared(context)
    private val workManager = WorkManager.getInstance(context)

    private val _lastSyncResult = MutableStateFlow<SyncResponse?>(null)
    val lastSyncResult: StateFlow<SyncResponse?> = _lastSyncResult.asStateFlow()

    private val _isSyncing = MutableStateFlow(false)
    val isSyncing: StateFlow<Boolean> = _isSyncing.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    suspend fun hasPermissions(): Boolean = hk.requestAuthorization()

    suspend fun requestPermissions(): Boolean = hk.requestAuthorization()

    fun syncToday() {
        viewModelScope.launch {
            if (!api.isLoggedIn) return@launch

            _isSyncing.value = true
            _errorMessage.value = null

            try {
                hk.requestAuthorization()
                val snapshot = hk.fetchTodayData()
                val result = api.syncHealthData(snapshot)

                _lastSyncResult.value = result
                scheduleBackgroundSync()
            } catch (e: Exception) {
                _errorMessage.value = e.message
            }

            _isSyncing.value = false
        }
    }

    fun registerBackgroundTask() {
        workManager.cancelUniqueWork(bgTaskID)
    }

    fun scheduleBackgroundSync() {
        val constraints = Constraints.Builder()
            .setRequiresBatteryNotLow(true)
            .build()

        val currentTime = Calendar.getInstance()
        val scheduledTime = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 22)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            if (before(currentTime)) {
                add(Calendar.DAY_OF_MONTH, 1)
            }
        }

        val initialDelay = scheduledTime.timeInMillis - currentTime.timeInMillis

        val syncRequest = PeriodicWorkRequestBuilder<SyncWorker>(
            24, TimeUnit.HOURS
        )
            .setConstraints(constraints)
            .setInitialDelay(initialDelay, TimeUnit.MILLISECONDS)
            .addTag(bgTaskID)
            .build()

        workManager.enqueueUniquePeriodicWork(
            bgTaskID,
            ExistingPeriodicWorkPolicy.UPDATE,
            syncRequest
        )
    }

    private fun handleBackgroundSync() {
        viewModelScope.launch {
            syncToday()
        }
    }
}

class SyncWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    private val syncService = SyncService.shared(context)

    override suspend fun doWork(): Result {
        syncService.syncToday()
        return Result.success()
    }
}
