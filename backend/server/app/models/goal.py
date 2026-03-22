from dataclasses import dataclass, field
from typing import List


@dataclass
class StepGoalTier:
    """Represents a single step goal milestone."""
    tier_id: int
    threshold: int
    label: str
    is_completed: bool = False


@dataclass
class DailyStepGoal:
    """The full set of tiers for a single day."""
    tiers: List[StepGoalTier] = field(default_factory=list)

    @property
    def completed_tiers(self) -> int:
        return sum(1 for t in self.tiers if t.is_completed)

    @property
    def total_tiers(self) -> int:
        return len(self.tiers)

    @property
    def goal_met(self) -> bool:
        return self.completed_tiers >= self.total_tiers


@dataclass
class DailyGoalProgress:
    """Summary of progress toward daily step goals."""
    steps: int
    completed_tiers: int
    total_tiers: int
    tiers: List[StepGoalTier] = field(default_factory=list)

    @property
    def goal_met(self) -> bool:
        return self.completed_tiers >= self.total_tiers

    @property
    def next_tier(self):
        for tier in self.tiers:
            if not tier.is_completed:
                return tier
        return None
