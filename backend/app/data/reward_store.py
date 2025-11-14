from datetime import datetime, timedelta
from app.schemas.rewards import Reward, RewardRedemption, RewardType, RedemptionType
from app.core.rewards import (
    generate_reward_id,
    generate_redemption_id,
    generate_coupon_code,
    calculate_tier,
    REWARD_POINTS,
    calculate_discount_value,
)


class RewardStore:
    """In-memory store for rewards and redemptions"""

    def __init__(self):
        self.rewards: dict[str, Reward] = {}
        self.redemptions: dict[str, RewardRedemption] = {}
        # Index for quick lookup
        self.rewards_by_citizen: dict[str, list[str]] = {}
        self.redemptions_by_citizen: dict[str, list[str]] = {}
        self._initialize_sample_data()

    def _initialize_sample_data(self):
        """Initialize with sample rewards"""
        sample_rewards = [
            {
                "citizen_email": "user@example.com",
                "reward_type": RewardType.ON_TIME_PAYMENT,
                "points": 50,
                "description": "November 2025 bill paid on time",
                "earned_date": (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"),
                "related_id": "BILL-A1B2C3D4",
            },
            {
                "citizen_email": "user@example.com",
                "reward_type": RewardType.LEAK_REPORT,
                "points": 100,
                "description": "Reported pipe leak at Street 12",
                "earned_date": (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d"),
                "related_id": "INC-12345",
            },
            {
                "citizen_email": "user@example.com",
                "reward_type": RewardType.WATER_SAVINGS,
                "points": 75,
                "description": "Achieved 15% water savings this month",
                "earned_date": (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d"),
                "related_id": "",
            },
            {
                "citizen_email": "citizen1@raipur.gov.in",
                "reward_type": RewardType.ON_TIME_PAYMENT,
                "points": 50,
                "description": "October 2025 bill paid on time",
                "earned_date": (datetime.now() - timedelta(days=10)).strftime("%Y-%m-%d"),
                "related_id": "BILL-E5F6G7H8",
            },
        ]

        for reward_data in sample_rewards:
            reward_id = generate_reward_id()
            reward = Reward(
                id=reward_id,
                citizen_email=reward_data["citizen_email"],
                reward_type=reward_data["reward_type"],
                points=reward_data["points"],
                description=reward_data["description"],
                earned_date=reward_data["earned_date"],
                related_id=reward_data["related_id"],
            )
            self.rewards[reward_id] = reward
            if reward_data["citizen_email"] not in self.rewards_by_citizen:
                self.rewards_by_citizen[reward_data["citizen_email"]] = []
            self.rewards_by_citizen[reward_data["citizen_email"]].append(reward_id)

        # Sample redemptions
        sample_redemptions = [
            {
                "citizen_email": "user@example.com",
                "redemption_type": RedemptionType.WATER_TAX_DISCOUNT,
                "points_used": 200,
                "redeemed_date": (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d"),
                "status": "completed",
                "value": 100.0,
            },
        ]

        for redemption_data in sample_redemptions:
            redemption_id = generate_redemption_id()
            redemption = RewardRedemption(
                id=redemption_id,
                citizen_email=redemption_data["citizen_email"],
                redemption_type=redemption_data["redemption_type"],
                points_used=redemption_data["points_used"],
                redeemed_date=redemption_data["redeemed_date"],
                status=redemption_data["status"],
                value=redemption_data["value"],
            )
            self.redemptions[redemption_id] = redemption
            if redemption_data["citizen_email"] not in self.redemptions_by_citizen:
                self.redemptions_by_citizen[redemption_data["citizen_email"]] = []
            self.redemptions_by_citizen[redemption_data["citizen_email"]].append(redemption_id)

    def add_reward(
        self,
        citizen_email: str,
        reward_type: RewardType,
        points: int,
        description: str,
        related_id: str = "",
    ) -> Reward:
        """Add a reward to a citizen"""
        reward_id = generate_reward_id()
        reward = Reward(
            id=reward_id,
            citizen_email=citizen_email,
            reward_type=reward_type,
            points=points,
            description=description,
            earned_date=datetime.now().strftime("%Y-%m-%d"),
            related_id=related_id,
        )
        self.rewards[reward_id] = reward
        if citizen_email not in self.rewards_by_citizen:
            self.rewards_by_citizen[citizen_email] = []
        self.rewards_by_citizen[citizen_email].append(reward_id)
        return reward

    def get_citizen_total_points(self, citizen_email: str) -> int:
        """Calculate total points for a citizen"""
        reward_ids = self.rewards_by_citizen.get(citizen_email, [])
        return sum(self.rewards[rid].points for rid in reward_ids if rid in self.rewards)

    def get_citizen_rewards(self, citizen_email: str) -> list[Reward]:
        """Get all rewards for a citizen"""
        reward_ids = self.rewards_by_citizen.get(citizen_email, [])
        return [self.rewards[rid] for rid in reward_ids if rid in self.rewards]

    def get_citizen_redemptions(self, citizen_email: str) -> list[RewardRedemption]:
        """Get redemption history for a citizen"""
        redemption_ids = self.redemptions_by_citizen.get(citizen_email, [])
        return [self.redemptions[rid] for rid in redemption_ids if rid in self.redemptions]

    def redeem_points(
        self,
        citizen_email: str,
        redemption_type: RedemptionType,
        points_to_use: int,
    ) -> RewardRedemption | None:
        """Redeem points for a citizen"""
        available_points = self.get_citizen_total_points(citizen_email)
        if available_points < points_to_use:
            return None

        redemption_id = generate_redemption_id()
        discount_value = calculate_discount_value(points_to_use)

        redemption = RewardRedemption(
            id=redemption_id,
            citizen_email=citizen_email,
            redemption_type=redemption_type,
            points_used=points_to_use,
            redeemed_date=datetime.now().strftime("%Y-%m-%d"),
            status="completed",
            value=discount_value,
        )
        self.redemptions[redemption_id] = redemption
        if citizen_email not in self.redemptions_by_citizen:
            self.redemptions_by_citizen[citizen_email] = []
        self.redemptions_by_citizen[citizen_email].append(redemption_id)
        return redemption

    def get_citizen_summary(self, citizen_email: str) -> dict:
        """Get complete reward summary for a citizen"""
        total_points = self.get_citizen_total_points(citizen_email)
        tier = calculate_tier(total_points)
        rewards = self.get_citizen_rewards(citizen_email)
        redemptions = self.get_citizen_redemptions(citizen_email)

        # Get recent rewards (last 5)
        recent_rewards = sorted(rewards, key=lambda r: r.earned_date, reverse=True)[:5]

        return {
            "total_points": total_points,
            "current_tier": tier.name,
            "tier_benefits": tier.benefits,
            "discount_percentage": tier.discount_percentage,
            "recent_rewards": recent_rewards,
            "redemption_history": redemptions,
            "rewards_count": len(rewards),
            "redemptions_count": len(redemptions),
        }

    def get_all_rewards(self) -> list[Reward]:
        """Get all rewards in system"""
        return list(self.rewards.values())

    def get_reward_stats(self) -> dict:
        """Get reward system statistics"""
        all_rewards = list(self.rewards.values())
        total_points_issued = sum(r.points for r in all_rewards)
        total_redemptions = sum(r.points_used for r in self.redemptions.values())
        unique_citizens = len(self.rewards_by_citizen)

        reward_type_counts = {}
        for reward in all_rewards:
            key = reward.reward_type.value
            reward_type_counts[key] = reward_type_counts.get(key, 0) + 1

        return {
            "total_points_issued": total_points_issued,
            "total_points_redeemed": total_redemptions,
            "unique_participants": unique_citizens,
            "reward_breakdown": reward_type_counts,
        }


# Global instance
reward_store = RewardStore()
