import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from health_tracker.database import Base


# All available badges — add new ones here and in STREAK_BADGES
ACHIEVEMENTS = {
    "first_sync": {
        "name": "First Steps on the Trail",
        "description": "Synced your first health log",
        "emoji": "⛺",
    },
    "steps_3day": {
        "name": "Three-Day March",
        "description": "3-day step streak",
        "emoji": "🥾",
    },
    "steps_7day": {
        "name": "Week-Long Trek",
        "description": "7-day step streak",
        "emoji": "🌅",
    },
    "steps_30day": {
        "name": "Iron Legs",
        "description": "30-day step streak",
        "emoji": "🏆",
    },
    "hydration_3day": {
        "name": "Water Scout",
        "description": "3-day hydration streak",
        "emoji": "💧",
    },
    "hydration_7day": {
        "name": "River Runner",
        "description": "7-day hydration streak",
        "emoji": "🌊",
    },
    "combined_7day": {
        "name": "Trail Veteran",
        "description": "7-day combined streak (steps + hydration)",
        "emoji": "⭐",
    },
    "combined_30day": {
        "name": "Oregon Legend",
        "description": "30-day combined streak",
        "emoji": "👑",
    },
}

# Maps metric -> list of (threshold, badge_id)
STREAK_BADGES = {
    "steps": [
        (3, "steps_3day"),
        (7, "steps_7day"),
        (30, "steps_30day"),
    ],
    "hydration": [
        (3, "hydration_3day"),
        (7, "hydration_7day"),
    ],
    "combined": [
        (7, "combined_7day"),
        (30, "combined_30day"),
    ],
}


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    badge_id = Column(String, nullable=False)
    earned_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    notified = Column(Boolean, default=False)
