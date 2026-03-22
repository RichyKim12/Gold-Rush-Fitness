import uuid
from sqlalchemy import Column, String, Integer, Float, Date
from sqlalchemy.dialects.postgresql import UUID
from health_tracker.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    display_name = Column(String, nullable=True)
    timezone = Column(String, default="UTC")
    step_goal = Column(Integer, default=10000)
    hydration_goal_ml = Column(Float, default=2500.0)
    vitality = Column(Integer, default=100)
    vitality_max = Column(Integer, default=100)
    day_on_trail = Column(Integer, default=0)
    last_vitality_processed_date = Column(Date, nullable=True)
