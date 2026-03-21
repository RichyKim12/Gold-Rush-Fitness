package com.fitness.trail.ui.dashboard

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.fitness.trail.data.SyncService
import com.fitness.trail.data.api.Achievement
import com.fitness.trail.data.api.DashboardResponse
import com.fitness.trail.data.api.HealthAPIClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class DashboardUiState(
    val dashboard: DashboardResponse? = null,
    val achievements: List<Achievement> = emptyList(),
    val isSyncing: Boolean = false,
    val errorMessage: String? = null,
    val hasPermissions: Boolean = false
)

class DashboardViewModel(
    private val context: Context,
    private val syncService: SyncService
) : ViewModel() {

    private val _uiState = MutableStateFlow(DashboardUiState())
    val uiState: StateFlow<DashboardUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            syncService.isSyncing.collect { isSyncing ->
                _uiState.value = _uiState.value.copy(isSyncing = isSyncing)
            }
        }
        viewModelScope.launch {
            syncService.errorMessage.collect { error ->
                _uiState.value = _uiState.value.copy(errorMessage = error)
            }
        }
        viewModelScope.launch {
            val hasPerms = syncService.hasPermissions()
            _uiState.value = _uiState.value.copy(hasPermissions = hasPerms)
            if (hasPerms) {
                loadDashboard()
                loadAchievements()
            }
        }
    }

    fun requestPermissions() {
        viewModelScope.launch {
            val granted = syncService.requestPermissions()
            _uiState.value = _uiState.value.copy(hasPermissions = granted)
            if (granted) {
                loadDashboard()
                loadAchievements()
            }
        }
    }

    fun sync() {
        syncService.syncToday()
        loadDashboard()
        loadAchievements()
    }

    private fun loadDashboard() {
        viewModelScope.launch {
            try {
                val dashboard = HealthAPIClient.shared(context).fetchDashboard()
                _uiState.value = _uiState.value.copy(dashboard = dashboard)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(errorMessage = e.message)
            }
        }
    }

    private fun loadAchievements() {
        viewModelScope.launch {
            try {
                val achievements = HealthAPIClient.shared(context).fetchAchievements()
                _uiState.value = _uiState.value.copy(achievements = achievements)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(errorMessage = e.message)
            }
        }
    }
}
