package com.fitness.trail

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.fitness.trail.data.SyncService
import com.fitness.trail.ui.dashboard.DashboardView
import com.fitness.trail.ui.dashboard.DashboardViewModel
import com.fitness.trail.ui.theme.FitnessTrailTheme

class MainActivity : ComponentActivity() {

    private lateinit var viewModel: DashboardViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val syncService = SyncService.shared(applicationContext)
        viewModel = DashboardViewModel(applicationContext, syncService)

        setContent {
            FitnessTrailTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    DashboardView(viewModel = viewModel)
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        viewModel.requestPermissions()
    }
}
