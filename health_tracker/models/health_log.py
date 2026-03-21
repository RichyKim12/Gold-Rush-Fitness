import uuid
from sqlalchemy import Column, String, Integer, Float, Date, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from health_tracker.database import Base


class HealthLog(Base):
    __tablename__ = "health_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    log_date = Column(Date, nullable=False, index=True)
    steps = Column(Integer, default=0)
    hydration_ml = Column(Float, default=0.0)
    source = Column(String, default="manual")  # "healthkit" | "health_connect" | "manual"

    __table_args__ = (
        UniqueConstraint("user_id", "log_date", name="uq_user_log_date"),
    )
