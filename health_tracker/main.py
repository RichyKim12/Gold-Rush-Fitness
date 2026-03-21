from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from health_tracker.database import engine, Base

# Import all models so Base.metadata knows about them
from health_tracker.models import User, HealthLog, Streak, UserAchievement  # noqa: F401

from health_tracker.routers import auth, health, dashboard

# Create tables (fine for dev — use Alembic migrations in production)
Base.metadata.create_all(bind=engine)

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


@app.get("/health", tags=["health-check"])
async def health_check():
    return {"status": "ok"}
