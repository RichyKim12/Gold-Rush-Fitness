import uuid
from sqlalchemy import Column, String, Integer, Date, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from health_tracker.database import Base


class Streak(Base):
    __tablename__ = "streaks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    metric = Column(String, nullable=False)  # "steps" | "hydration" | "combined"
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_active_date = Column(Date, nullable=True)

    __table_args__ = (
        UniqueConstraint("user_id", "metric", name="uq_user_metric"),
    )
