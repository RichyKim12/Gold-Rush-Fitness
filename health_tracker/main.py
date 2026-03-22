from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
import threading
from typing import Optional

from health_tracker.database import engine, Base, SessionLocal

# Import all models so Base.metadata knows about them
from health_tracker.models import (  # noqa: F401
    User,
    HealthLog,
    Streak,
    UserAchievement,
)

from health_tracker.routers import auth, health, dashboard
from health_tracker.services.vitality_engine import process_all_users_vitality

# Create tables (fine for dev — use Alembic migrations in production)
Base.metadata.create_all(bind=engine)


def ensure_runtime_columns():
    with engine.begin() as conn:
        conn.execute(
            text(
                "ALTER TABLE users "
                "ADD COLUMN IF NOT EXISTS vitality INTEGER DEFAULT 100"
            )
        )
        conn.execute(
            text(
                "ALTER TABLE users "
                "ADD COLUMN IF NOT EXISTS vitality_max INTEGER DEFAULT 100"
            )
        )
        conn.execute(
            text(
                "ALTER TABLE users "
                "ADD COLUMN IF NOT EXISTS day_on_trail INTEGER DEFAULT 0"
            )
        )
        conn.execute(
            text(
                "ALTER TABLE users "
                "ADD COLUMN IF NOT EXISTS last_vitality_processed_date DATE"
            )
        )


def run_vitality_pass():
    db = SessionLocal()
    try:
        if process_all_users_vitality(db):
            db.commit()
    except Exception as exc:
        db.rollback()
        print(f"vitality pass error: {exc}")
    finally:
        db.close()


_stop_event = threading.Event()
_worker_thread: Optional[threading.Thread] = None


def _vitality_worker():
    while not _stop_event.is_set():
        run_vitality_pass()
        _stop_event.wait(60)


app = FastAPI(
    title="Gold Rush Fitness API",
    description="Health tracking backend for the Oregon Trail fitness app",
    version="1.0.0",
)

# CORS — allow all origins in dev, tighten for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(health.router)
app.include_router(dashboard.router)


@app.on_event("startup")
async def startup_events():
    global _worker_thread
    ensure_runtime_columns()
    run_vitality_pass()
    _stop_event.clear()
    _worker_thread = threading.Thread(target=_vitality_worker, daemon=True)
    _worker_thread.start()


@app.on_event("shutdown")
async def shutdown_events():
    _stop_event.set()


@app.get("/health", tags=["health-check"])
async def health_check():
    return {"status": "ok"}
