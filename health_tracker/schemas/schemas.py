from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field


# ── Auth ──

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    display_name: Optional[str] = None
    timezone: str = "UTC"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    display_name: Optional[str] = None


# ── Sync ──

class SyncRequest(BaseModel):
    log_date: date
    steps: int = 0
    hydration_ml: float = 0.0
    source: str = "manual"  # "healthkit" | "health_connect" | "manual"


class SyncResponse(BaseModel):
    status: str = "ok"
    log_date: date
    steps: int
    hydration_ml: float
    new_badges: list[str] = []


# ── Dashboard ──

class StreakInfo(BaseModel):
    metric: str
    current_streak: int
    longest_streak: int
    last_active_date: Optional[date] = None


class DayRecord(BaseModel):
    date: date
    steps: int
    goalMet: bool


class DashboardResponse(BaseModel):
    playerName: str
    partySize: int = 4
    trailMiles: int
    currentStreak: int
    longestStreak: int
    totalSteps: int
    todaySteps: int
    weekHistory: list[DayRecord]
    unlockedRewards: list[str] = []
    healthScore: int = 100
    rations: str = "Filling"
    pace: str = "Steady"
    vitality: int = 100
    vitalityMax: int = 100
    dayOnTrail: int = 0


# ── History ──


class HistoryResponse(BaseModel):
    days: list[DayRecord]
    total_steps: int
    trail_miles: int


# ── Achievements ──

class AchievementOut(BaseModel):
    badge_id: str
    name: str
    description: str
    emoji: str
    earned_at: datetime


class AchievementsResponse(BaseModel):
    achievements: list[AchievementOut]
