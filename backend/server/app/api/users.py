from datetime import date, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.config import get_db
from app.core.auth import get_current_user
from app.models.database import User, UserStats, DailyLog, Achievement, UserAchievement
from app.core.goal_service import GoalService

router = APIRouter(prefix="/users", tags=["users"])


class DayRecordResponse(BaseModel):
    date: str
    steps: int
    goalMet: bool


class TierDetailResponse(BaseModel):
    tierId: int
    threshold: int
    label: str
    isCompleted: bool


class TodayGoalProgress(BaseModel):
    completedTiers: int
    totalTiers: int
    tierDetails: List[TierDetailResponse]


class SyncRequest(BaseModel):
    log_date: str
    steps: int
    hydration_ml: float
    source: str = "manual"


class SyncResponse(BaseModel):
    status: str
    steps: int
    hydration_ml: float
    vitality_change: int
    new_vitality: int


class DashboardResponse(BaseModel):
    playerName: str
    partySize: int
    trailMiles: int
    currentStreak: int
    longestStreak: int
    totalSteps: int
    todaySteps: int
    weekHistory: List[DayRecordResponse]
    unlockedRewards: List[str]
    healthScore: int
    rations: str
    pace: str
    vitality: int
    vitalityMax: int
    dayOnTrail: int
    todayGoalProgress: TodayGoalProgress


@router.get("/me/dashboard", response_model=DashboardResponse)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    
    today_log = db.query(DailyLog).filter(
        DailyLog.user_id == current_user.id,
        DailyLog.log_date == date.today()
    ).first()
    
    week_start = date.today() - timedelta(days=6)
    week_logs = db.query(DailyLog).filter(
        DailyLog.user_id == current_user.id,
        DailyLog.log_date >= week_start,
        DailyLog.log_date <= date.today()
    ).order_by(DailyLog.log_date).all()
    
    user_achievements = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id
    ).all()
    
    achievement_ids = []
    for ua in user_achievements:
        ach = db.query(Achievement).filter(Achievement.id == ua.achievement_id).first()
        if ach:
            achievement_ids.append(ach.badge_id)
    
    week_history = []
    for log in week_logs:
        goal_progress = GoalService.calculate_progress(log.steps)
        week_history.append(DayRecordResponse(
            date=log.log_date.isoformat(),
            steps=log.steps,
            goalMet=goal_progress.completed_tiers >= 3
        ))
    
    today_steps = today_log.steps if today_log else 0
    today_goal = GoalService.calculate_progress(today_steps)
    
    return DashboardResponse(
        playerName=user.display_name,
        partySize=user.party_size,
        trailMiles=stats.trail_miles if stats else 0,
        currentStreak=stats.current_streak if stats else 0,
        longestStreak=stats.longest_streak if stats else 0,
        totalSteps=stats.total_steps if stats else 0,
        todaySteps=today_steps,
        weekHistory=week_history,
        unlockedRewards=achievement_ids,
        healthScore=stats.health_score if stats else 100,
        rations=stats.rations if stats else "Filling",
        pace=stats.pace if stats else "Steady",
        vitality=user.vitality if user.vitality else 100,
        vitalityMax=user.vitality_max if user.vitality_max else 100,
        dayOnTrail=stats.day_on_trail if stats else 0,
        todayGoalProgress=TodayGoalProgress(
            completedTiers=today_goal.completed_tiers,
            totalTiers=today_goal.total_tiers,
            tierDetails=[
                TierDetailResponse(
                    tierId=t.tier_id,
                    threshold=t.threshold,
                    label=t.label,
                    isCompleted=t.is_completed
                )
                for t in today_goal.tier_details
            ]
        )
    )


@router.get("/me/stats")
def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    
    return {
        "playerName": user.display_name,
        "partySize": user.party_size,
        "trailMiles": stats.trail_miles if stats else 0,
        "currentStreak": stats.current_streak if stats else 0,
        "longestStreak": stats.longest_streak if stats else 0,
        "totalSteps": stats.total_steps if stats else 0,
        "healthScore": stats.health_score if stats else 0,
        "rations": stats.rations if stats else "Filling",
        "pace": stats.pace if stats else "Steady",
        "vitality": user.vitality,
        "vitalityMax": user.vitality_max,
    }


@router.post("/sync", response_model=SyncResponse)
def sync_health_data(
    body: SyncRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    log_date = date.fromisoformat(body.log_date)
    
    today_log = db.query(DailyLog).filter(
        DailyLog.user_id == current_user.id,
        DailyLog.log_date == log_date
    ).first()
    
    if today_log:
        today_log.steps = body.steps
        today_log.hydration_ml = body.hydration_ml
        today_log.source = body.source
    else:
        today_log = DailyLog(
            user_id=current_user.id,
            log_date=log_date,
            steps=body.steps,
            hydration_ml=body.hydration_ml,
            source=body.source,
        )
        db.add(today_log)
        db.flush()
    
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()

    # Recalculate total_steps from ALL daily logs (avoids double-counting on repeated syncs)
    from sqlalchemy import func as sqlfunc
    total_steps_result = db.query(sqlfunc.sum(DailyLog.steps)).filter(
        DailyLog.user_id == current_user.id
    ).scalar()
    real_total = int(total_steps_result or 0)

    if stats:
        stats.total_steps = real_total
        stats.trail_miles = real_total // 2000
    else:
        stats = UserStats(
            user_id=current_user.id,
            trail_miles=body.steps // 2000,
            current_streak=0,
            longest_streak=0,
            total_steps=body.steps,
            health_score=100,
            rations="Filling",
            pace="Steady",
            day_on_trail=0,
        )
        db.add(stats)
    
    db.commit()
    
    return SyncResponse(
        status="ok",
        steps=body.steps,
        hydration_ml=body.hydration_ml,
        vitality_change=0,
        new_vitality=user.vitality if user.vitality else 100,
    )
