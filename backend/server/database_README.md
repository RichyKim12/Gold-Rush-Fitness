# Gold Rush Fitness - Backend Server

FastAPI backend with PostgreSQL database for the Gold Rush Fitness app.

## Setup

### 1. Install Dependencies

```bash
cd backend/server
pip install -r requirements.txt
```

### 2. Configure Database

Set the `DATABASE_URL` environment variable:

```bash
# Local PostgreSQL
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/goldrush"

# Or create a .env file
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/goldrush" > .env
echo "SECRET_KEY=your-super-secret-key-change-in-production" >> .env
```

### 3. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE goldrush;
\q
```

### 4. Run Server

```bash
uvicorn app.main:app --reload
```

The server runs at `http://localhost:8000`

## Project Structure

```
backend/server/
├── app/
│   ├── api/              # API route handlers (endpoints)
│   ├── core/
│   │   ├── auth.py       # Authentication (JWT, password hashing)
│   │   ├── config.py     # Database config, settings
│   │   └── goal_service.py  # Tiered goal calculations
│   └── models/
│       ├── database.py   # SQLAlchemy models (User, DailyLog, etc.)
│       └── goal.py       # Goal tier dataclasses
├── requirements.txt
└── README.md
```

## Database Schema

### users
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| email | VARCHAR(255) | Unique email |
| password_hash | VARCHAR(255) | Bcrypt hashed password |
| display_name | VARCHAR(100) | User's display name |
| created_at | TIMESTAMP | Account creation time |

### daily_logs
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | INTEGER | Foreign key to users |
| log_date | DATE | Date of the log |
| steps | INTEGER | Step count for the day |
| hydration_ml | FLOAT | Hydration in milliliters |
| source | VARCHAR(50) | "healthconnect", "healthkit", or "manual" |

### achievements
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| badge_id | VARCHAR(50) | Unique badge identifier |
| name | VARCHAR(100) | Achievement name |
| description | VARCHAR(255) | Achievement description |
| icon | VARCHAR(50) | Emoji icon |
| tier_requirement | INTEGER | Required tier level |

### user_achievements
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | INTEGER | Foreign key to users |
| achievement_id | INTEGER | Foreign key to achievements |
| earned_at | TIMESTAMP | When achievement was earned |

## Tiered Step Goals

The app uses a 3-tier step goal system:

| Tier | Steps | Label |
|------|-------|-------|
| 1 | 3,000 | First Rest Stop |
| 2 | 6,000 | Halfway Point |
| 3 | 10,000 | Journey Complete |

### Goal Service Usage

```python
from app.core.goal_service import GoalService
from app.models.goal import DailyGoalProgress

# Calculate progress for a given step count
progress = GoalService.calculate_progress(steps=7500)

# Results:
# - completed_tiers: 2
# - total_tiers: 3
# - next_tier_threshold: 10000
# - steps_to_next_tier: 2500
# - tier_details: List of all tiers with is_completed status

# Check if user just achieved a new tier
new_tiers = GoalService.check_new_tier_achieved(
    previous_steps=2500,
    current_steps=6500
)
# Returns tier 2 achievement since 6000 was crossed
```

## Authentication

### Password Hashing
- Uses bcrypt via passlib
- Never store plain passwords

### JWT Tokens
- Algorithm: HS256
- Default expiry: 7 days
- Contains user_id in payload

### Auth Functions

```python
from app.core.auth import (
    get_password_hash,      # Hash a password
    verify_password,        # Verify password against hash
    create_access_token,    # Generate JWT token
    authenticate_user,      # Login helper
    get_current_user,       # FastAPI dependency for protected routes
)
```

## API Endpoints (To Be Implemented)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login and get JWT token |
| GET | /dashboard | Get today's progress |
| POST | /sync | Sync health data from mobile |
| GET | /achievements | Get user's achievements |
| GET | /goals | Get tiered goal details |

## Mobile App Integration

Both iOS and Android apps connect to this backend:

```kotlin
// Android - HealthAPIClient.kt
private val baseUrl = "http://localhost:8000"
```

```swift
// iOS - HealthAPIClient.swift
private let baseURL = "http://localhost:8000"
```

Update these to your deployed server URL for production.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_URL | postgresql://postgres:postgres@localhost:5432/goldrush | PostgreSQL connection string |
| SECRET_KEY | your-super-secret-key-change-in-production | JWT signing key |
