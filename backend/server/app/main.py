from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import engine, Base
from app.models.database import init_default_achievements
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.core.config import SessionLocal

Base.metadata.create_all(bind=engine)

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


@app.get("/")
def root():
    return {"message": "Gold Rush Fitness API", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
