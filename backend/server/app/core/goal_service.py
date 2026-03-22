from dataclasses import dataclass
from typing import List


@dataclass
class TierDetail:
    tier_id: int
    threshold: int
    label: str
    is_completed: bool


@dataclass
class GoalProgress:
    completed_tiers: int
    total_tiers: int
    tier_details: List[TierDetail]


class GoalService:
    """Calculates daily step goal progress across 3 tiers."""

    TIERS = [
        {"tier_id": 1, "threshold": 3000,  "label": "Rest Stop"},
        {"tier_id": 2, "threshold": 6000,  "label": "Halfway"},
        {"tier_id": 3, "threshold": 10000, "label": "Full Trail"},
    ]

    @staticmethod
    def calculate_progress(steps: int) -> GoalProgress:
        tier_details = []
        completed = 0

        for tier in GoalService.TIERS:
            is_completed = steps >= tier["threshold"]
            if is_completed:
                completed += 1
            tier_details.append(TierDetail(
                tier_id=tier["tier_id"],
                threshold=tier["threshold"],
                label=tier["label"],
                is_completed=is_completed,
            ))

        return GoalProgress(
            completed_tiers=completed,
            total_tiers=len(GoalService.TIERS),
            tier_details=tier_details,
        )
