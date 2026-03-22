from sqlalchemy import Column, Integer, String, Float, DateTime, Date, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.config import Base, engine
import enum


class DataSource(str, enum.Enum):
    HEALTHCONNECT = "healthconnect"
    HEALTHKIT = "healthkit"
    MANUAL = "manual"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(100), nullable=False)
    party_size = Column(Integer, default=4)
    vitality = Column(Integer, default=100)
    vitality_max = Column(Integer, default=100)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    daily_logs = relationship("DailyLog", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    stats = relationship("UserStats", back_populates="user", uselist=False, cascade="all, delete-orphan")


class UserStats(Base):
    __tablename__ = "user_stats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    trail_miles = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    total_steps = Column(Integer, default=0)
    health_score = Column(Integer, default=100)
    rations = Column(String(20), default="Filling")
    pace = Column(String(20), default="Steady")
    day_on_trail = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="stats")


class DailyLog(Base):
    __tablename__ = "daily_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    log_date = Column(Date, nullable=False, index=True)
    steps = Column(Integer, default=0)
    hydration_ml = Column(Float, default=0.0)
    source = Column(String(50), default="manual")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="daily_logs")

    __table_args__ = (
        {"schema": None},
    )


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    badge_id = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255))
    icon = Column(String(50))
    tier_requirement = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    users = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    earned_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="users")

    __table_args__ = (
        {"schema": None},
    )


def init_default_achievements(db):
    default_achievements = [
        {"badge_id": "first_steps", "name": "First Steps", "description": "Complete your first step goal", "icon": "\U0001F6B6", "tier_requirement": 1},
        {"badge_id": "rest_stop_master", "name": "Rest Stop Master", "description": "Reach 3,000 steps", "icon": "\U0001F3DE", "tier_requirement": 1},
        {"badge_id": "halfway_there", "name": "Halfway There", "description": "Reach 6,000 steps", "icon": "\U0001F3DE\U0001F3DE", "tier_requirement": 2},
        {"badge_id": "journey_complete", "name": "Journey Complete", "description": "Reach 10,000 steps - the full trail!", "icon": "\U0001F3F3", "tier_requirement": 3},
        {"badge_id": "week_warrior", "name": "Week Warrior", "description": "Complete 7 days of goals", "icon": "\U0001F525", "tier_requirement": 3},
        {"badge_id": "hydration_hero", "name": "Hydration Hero", "description": "Log 2000ml of water in one day", "icon": "\U0001F4A7", "tier_requirement": 1},
    ]
    
    for ach in default_achievements:
        existing = db.query(Achievement).filter(Achievement.badge_id == ach["badge_id"]).first()
        if not existing:
            db.add(Achievement(**ach))
    
    db.commit()
