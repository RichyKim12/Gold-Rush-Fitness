from datetime import date, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from health_tracker.database import get_db
from health_tracker.models.user import User
from health_tracker.models.health_log import HealthLog
from health_tracker.models.streak import Streak
from health_tracker.models.achievement import UserAchievement, ACHIEVEMENTS
from health_tracker.schemas.schemas import (
    DashboardResponse,
    StreakInfo,
    AchievementsResponse,
    AchievementOut,
    HistoryResponse,
    DayRecord,
)
from health_tracker.services.auth_service import get_current_user

router = APIRouter(tags=["dashboard"])


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    today = date.today()

    # Today's health log (may not exist yet)
    log = (
        db.query(HealthLog)
        .filter_by(user_id=user.id, log_date=today)
        .first()
    )
    steps = log.steps if log else 0
    hydration_ml = log.hydration_ml if log else 0.0

    # All streaks for user
    streaks = db.query(Streak).filter_by(user_id=user.id).all()
    streak_infos = [
        StreakInfo(
            metric=s.metric,
            current_streak=s.current_streak,
            longest_streak=s.longest_streak,
            last_active_date=s.last_active_date,
        )
        for s in streaks
    ]

    # Lifetime total steps
    total_steps_result = (
        db.query(func.coalesce(func.sum(HealthLog.steps), 0))
        .filter_by(user_id=user.id)
        .scalar()
    )

    return DashboardResponse(
        log_date=today,
        steps=steps,
        hydration_ml=hydration_ml,
        step_goal=user.step_goal,
        hydration_goal_ml=user.hydration_goal_ml,
        steps_met=steps >= user.step_goal,
        hydration_met=hydration_ml >= user.hydration_goal_ml,
        streaks=streak_infos,
        display_name=user.display_name,
        total_steps=int(total_steps_result),
    )


@router.get("/history", response_model=HistoryResponse)
async def get_history(
    days: int = Query(default=7, ge=1, le=90),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return recent daily logs for the frontend week heatmap and trail progress."""
    today = date.today()
    start_date = today - timedelta(days=days - 1)

    logs = (
        db.query(HealthLog)
        .filter(
            HealthLog.user_id == user.id,
            HealthLog.log_date >= start_date,
            HealthLog.log_date <= today,
        )
        .order_by(HealthLog.log_date)
        .all()
    )

    # Build a lookup by date
    log_by_date = {log.log_date: log for log in logs}

    # Fill in all days (including days with no log — 0 steps)
    day_records = []
    for i in range(days):
        d = start_date + timedelta(days=i)
        log = log_by_date.get(d)
        day_records.append(
            DayRecord(
                date=d,
                steps=log.steps if log else 0,
                goal_met=(log.steps >= user.step_goal) if log else False,
            )
        )

    # Lifetime total steps
    total_steps = int(
        db.query(func.coalesce(func.sum(HealthLog.steps), 0))
        .filter_by(user_id=user.id)
        .scalar()
    )

    # Trail miles: every 2000 steps = 1 mile (matches frontend constant)
    trail_miles = total_steps // 2000

    return HistoryResponse(
        days=day_records,
        total_steps=total_steps,
        trail_miles=trail_miles,
    )


@router.get("/achievements", response_model=AchievementsResponse)
async def get_achievements(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    earned = db.query(UserAchievement).filter_by(user_id=user.id).all()

    achievements = []
    for ua in earned:
        badge = ACHIEVEMENTS.get(ua.badge_id)
        if badge:
            achievements.append(
                AchievementOut(
                    badge_id=ua.badge_id,
                    name=badge["name"],
                    description=badge["description"],
                    emoji=badge["emoji"],
                    earned_at=ua.earned_at,
                )
            )

    return AchievementsResponse(achievements=achievements)
