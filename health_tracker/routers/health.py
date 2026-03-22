from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from health_tracker.database import get_db
from health_tracker.models.user import User
from health_tracker.models.health_log import HealthLog
from health_tracker.schemas.schemas import SyncRequest, SyncResponse
from health_tracker.services.auth_service import get_current_user
from health_tracker.services.streak_engine import process_sync
from health_tracker.services.vitality_engine import process_user_vitality

router = APIRouter(tags=["health"])


@router.post("/sync", response_model=SyncResponse)
async def sync_health_data(
    body: SyncRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if process_user_vitality(db, user):
        db.commit()
        db.refresh(user)

    # Idempotent upsert — one row per (user_id, log_date)
    log = (
        db.query(HealthLog)
        .filter_by(user_id=user.id, log_date=body.log_date)
        .first()
    )

    if log:
        log.steps = body.steps
        log.hydration_ml = body.hydration_ml
        log.source = body.source
    else:
        log = HealthLog(
            user_id=user.id,
            log_date=body.log_date,
            steps=body.steps,
            hydration_ml=body.hydration_ml,
            source=body.source,
        )
        db.add(log)

    db.flush()

    # Run streak + achievement logic
    new_badges = process_sync(db, user, log)

    return SyncResponse(
        log_date=log.log_date,
        steps=log.steps,
        hydration_ml=log.hydration_ml,
        new_badges=new_badges,
    )
