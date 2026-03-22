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
    AchievementsResponse,
    AchievementOut,
    HistoryResponse,
    DayRecord,
)
from health_tracker.services.auth_service import get_current_user
from health_tracker.services.vitality_engine import process_user_vitality

router = APIRouter(tags=["dashboard"])


@router.get("/dashboard", response_model=DashboardResponse)
@router.get("/users/me/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Comprehensive dashboard for frontend with all required fields."""
    if process_user_vitality(db, user):
        db.commit()
        db.refresh(user)

    today = date.today()
    start_date = today - timedelta(days=6)  # 7 days including today

    # Today's health log
    log = (
        db.query(HealthLog)
        .filter_by(user_id=user.id, log_date=today)
        .first()
    )
    today_steps = log.steps if log else 0

    # Lifetime total steps
    total_steps_result = (
        db.query(func.coalesce(func.sum(HealthLog.steps), 0))
        .filter_by(user_id=user.id)
        .scalar()
    )
    total_steps = int(total_steps_result)

    # Trail miles (every 2000 steps = 1 mile)
    trail_miles = total_steps // 2000

    # Week history (7 days)
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

    log_by_date = {log.log_date: log for log in logs}
    week_history = []
    for i in range(7):
        d = start_date + timedelta(days=i)
        log = log_by_date.get(d)
        goal_met = (log.steps >= user.step_goal) if log else False
        week_history.append(
            DayRecord(
                date=d.isoformat(),
                steps=log.steps if log else 0,
                goalMet=goal_met,
            )
        )

    # Streaks
    streaks = db.query(Streak).filter_by(user_id=user.id).all()
    current_streak = next(
        (s.current_streak for s in streaks if s.metric == "steps"), 0
    )
    longest_streak = next(
        (s.longest_streak for s in streaks if s.metric == "steps"), 0
    )

    # Health screen reads healthScore as vitality, so use persisted vitality.
    health_score = user.vitality if user.vitality is not None else 100

    # Unlocked rewards (mock for now)
    earned = db.query(UserAchievement).filter_by(user_id=user.id).all()
    unlocked_rewards = [ea.badge_id for ea in earned]

    return DashboardResponse(
        playerName=user.display_name or "Pioneer",
        partySize=4,
        trailMiles=trail_miles,
        currentStreak=current_streak,
        longestStreak=longest_streak,
        totalSteps=total_steps,
        todaySteps=today_steps,
        weekHistory=week_history,
        unlockedRewards=unlocked_rewards,
        healthScore=health_score,
        rations="Filling",
        pace="Steady",
        vitality=user.vitality if user.vitality is not None else 100,
        vitalityMax=(
            user.vitality_max if user.vitality_max is not None else 100
        ),
        dayOnTrail=user.day_on_trail or 0,
    )


@router.get("/history", response_model=HistoryResponse)
async def get_history(
    days: int = Query(default=7, ge=1, le=90),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return recent daily logs for the frontend week heatmap.
    """
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
