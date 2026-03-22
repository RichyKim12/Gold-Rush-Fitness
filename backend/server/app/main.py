from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date, timedelta
from app.core.config import engine, Base
from app.models.database import init_default_achievements, UserStats, DailyLog, User
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.core.config import SessionLocal

Base.metadata.create_all(bind=engine)

scheduler = BackgroundScheduler()

STEP_GOAL = 10000
HYDRATION_GOAL = 2500.0


def process_midnight():
    db = SessionLocal()
    try:
        yesterday = date.today() - timedelta(days=1)
        
        users = db.query(User).all()
        
        for user in users:
            daily_log = db.query(DailyLog).filter(
                DailyLog.user_id == user.id,
                DailyLog.log_date == yesterday
            ).first()
            
            if user.vitality is None:
                user.vitality = 100
            
            if daily_log:
                steps_met = daily_log.steps >= STEP_GOAL
                hydration_met = daily_log.hydration_ml >= HYDRATION_GOAL
                
                if steps_met and hydration_met:
                    user.vitality = min(100, user.vitality + 10)
                elif not steps_met:
                    user.vitality = max(0, user.vitality - 8)
            else:
                user.vitality = max(0, user.vitality - 8)
            
            stats = db.query(UserStats).filter(UserStats.user_id == user.id).first()
            if stats:
                stats.day_on_trail += 1
            else:
                new_stats = UserStats(
                    user_id=user.id,
                    trail_miles=0,
                    current_streak=0,
                    longest_streak=0,
                    total_steps=0,
                    health_score=100,
                    rations="Filling",
                    pace="Steady",
                    day_on_trail=1,
                )
                db.add(new_stats)
        
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error processing midnight job: {e}")
    finally:
        db.close()


@scheduler.scheduled_job("cron", hour=0, minute=0)
def midnight_job():
    process_midnight()


app = FastAPI(
    title="Gold Rush Fitness API",
    description="Backend API for the Gold Rush Fitness app",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)


@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        init_default_achievements(db)
    finally:
        db.close()
    scheduler.start()


@app.on_event("shutdown")
def on_shutdown():
    scheduler.shutdown()


@app.get("/")
def root():
    return {"message": "Gold Rush Fitness API", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
