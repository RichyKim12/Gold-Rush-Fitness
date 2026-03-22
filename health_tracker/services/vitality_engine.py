from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

from sqlalchemy.orm import Session

from health_tracker.models.health_log import HealthLog
from health_tracker.models.user import User


def _get_user_today(user: User) -> date:
    tz_name = user.timezone or "UTC"
    try:
        tz = ZoneInfo(tz_name)
    except Exception:
        tz = ZoneInfo("UTC")
    return datetime.now(tz).date()


def process_user_vitality(db: Session, user: User) -> bool:
    """Apply daily vitality/day progression up to yesterday in user's timezone.

    This function is idempotent via user.last_vitality_processed_date.
    Returns True if user fields were changed.
    """
    today_local = _get_user_today(user)
    target_day = today_local - timedelta(days=1)

    if user.vitality_max is None:
        user.vitality_max = 100
    if user.vitality is None:
        user.vitality = user.vitality_max
    if user.day_on_trail is None:
        user.day_on_trail = 0

    # First run: establish baseline so we don't backfill historic penalties.
    if user.last_vitality_processed_date is None:
        user.last_vitality_processed_date = target_day
        return True

    if user.last_vitality_processed_date >= target_day:
        return False

    changed = False
    process_day = user.last_vitality_processed_date + timedelta(days=1)

    while process_day <= target_day:
        log = (
            db.query(HealthLog)
            .filter_by(user_id=user.id, log_date=process_day)
            .first()
        )

        steps_met = bool(log and log.steps >= user.step_goal)
        hydration_met = bool(
            log and log.hydration_ml >= user.hydration_goal_ml
        )

        delta = 10 if (steps_met and hydration_met) else -8
        next_vitality = user.vitality + delta
        user.vitality = max(0, min(user.vitality_max, next_vitality))

        user.day_on_trail += 1
        user.last_vitality_processed_date = process_day

        process_day += timedelta(days=1)
        changed = True

    return changed


def process_all_users_vitality(db: Session) -> bool:
    users = db.query(User).all()
    changed = False
    for user in users:
        if process_user_vitality(db, user):
            changed = True
    return changed
