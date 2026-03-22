from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.core.config import get_db, settings
from app.core.auth import (
    get_password_hash,
    create_access_token,
    authenticate_user,
)
from app.models.database import User, UserStats

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    display_name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    display_name: str


@router.post("/register", response_model=AuthResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    display_name = request.display_name or request.email.split("@")[0]
    
    user = User(
        email=request.email,
        password_hash=get_password_hash(request.password),
        display_name=display_name,
        party_size=4,
        vitality=100,
        vitality_max=100,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    user_stats = UserStats(
        user_id=user.id,
        trail_miles=0,
        current_streak=0,
        longest_streak=0,
        total_steps=0,
        health_score=100,
        rations="Filling",
        pace="Steady",
    )
    db.add(user_stats)
    db.commit()
    db.refresh(user_stats)
    
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes)
    )
    
    return AuthResponse(
        access_token=access_token,
        user_id=user.id,
        display_name=user.display_name
    )


@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes)
    )
    
    return AuthResponse(
        access_token=access_token,
        user_id=user.id,
        display_name=user.display_name
    )
