from datetime import date, timedelta

from sqlalchemy.orm import Session

from health_tracker.models.health_log import HealthLog
from health_tracker.models.streak import Streak
from health_tracker.models.achievement import (
    UserAchievement,
    STREAK_BADGES,
)
from health_tracker.models.user import User


def update_streak(db: Session, user_id, metric: str, goal_met: bool, today: date) -> Streak:
    """Update a single streak row. Creates it if it doesn't exist."""
    streak = db.query(Streak).filter_by(user_id=user_id, metric=metric).first()

    if not streak:
        streak = Streak(user_id=user_id, metric=metric, current_streak=0, longest_streak=0)
        db.add(streak)
        db.flush()

    if streak.last_active_date == today:
        # Already processed today — no-op
        return streak

    if goal_met:
        yesterday = today - timedelta(days=1)
        if streak.last_active_date == yesterday:
            # Consecutive day — increment
            streak.current_streak += 1
        else:
            # Gap or first entry — start fresh
            streak.current_streak = 1

        streak.last_active_date = today
        if streak.current_streak > streak.longest_streak:
            streak.longest_streak = streak.current_streak
    else:
        # Goal not met today — reset
        streak.current_streak = 0

    db.flush()
    return streak


def check_and_award_achievements(
    db: Session, user_id, metric: str, current_streak: int
) -> list[str]:
    """Award badges at milestone thresholds. Returns list of newly earned badge_ids."""
    thresholds = STREAK_BADGES.get(metric, [])
    new_badges: list[str] = []

    for threshold, badge_id in thresholds:
        if current_streak >= threshold:
            # Check if already earned
            exists = (
                db.query(UserAchievement)
                .filter_by(user_id=user_id, badge_id=badge_id)
                .first()
            )
            if not exists:
                db.add(UserAchievement(user_id=user_id, badge_id=badge_id))
                db.flush()
                new_badges.append(badge_id)

    return new_badges


def award_first_sync(db: Session, user_id) -> list[str]:
    """Award 'first_sync' badge if not already earned."""
    exists = (
        db.query(UserAchievement)
        .filter_by(user_id=user_id, badge_id="first_sync")
        .first()
    )
    if not exists:
        db.add(UserAchievement(user_id=user_id, badge_id="first_sync"))
        db.flush()
        return ["first_sync"]
    return []


def process_sync(db: Session, user: User, log: HealthLog) -> list[str]:
    """
    Main entry point — called after every /sync.

    1. Determine which goals are met
    2. Update streaks for steps, hydration, combined
    3. Award milestone badges
    4. Return list of newly earned badge_ids
    """
    today = log.log_date
    new_badges: list[str] = []

    # Award first_sync badge
    new_badges.extend(award_first_sync(db, user.id))

    # Determine goal completion
    steps_met = log.steps >= user.step_goal
    hydration_met = log.hydration_ml >= user.hydration_goal_ml
    combined_met = steps_met and hydration_met

    # Update each streak
    steps_streak = update_streak(db, user.id, "steps", steps_met, today)
    hydration_streak = update_streak(db, user.id, "hydration", hydration_met, today)
    combined_streak = update_streak(db, user.id, "combined", combined_met, today)

    # Award milestone badges
    new_badges.extend(
        check_and_award_achievements(db, user.id, "steps", steps_streak.current_streak)
    )
    new_badges.extend(
        check_and_award_achievements(db, user.id, "hydration", hydration_streak.current_streak)
    )
    new_badges.extend(
        check_and_award_achievements(db, user.id, "combined", combined_streak.current_streak)
    )

    db.commit()
    return new_badges
