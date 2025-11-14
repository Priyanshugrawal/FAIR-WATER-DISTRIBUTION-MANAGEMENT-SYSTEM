from pydantic import BaseModel, Field
from enum import Enum


class RewardType(str, Enum):
    ON_TIME_PAYMENT = "on_time_payment"
    LEAK_REPORT = "leak_report"
    WATER_SAVINGS = "water_savings"
    REFERRAL = "referral"
    PARTICIPATION = "participation"


class RedemptionType(str, Enum):
    RMC_COUPON = "rmc_coupon"
    WATER_TAX_DISCOUNT = "water_tax_discount"
    MAINTENANCE_VOUCHER = "maintenance_voucher"
    PRIORITY_SERVICE = "priority_service"


class Reward(BaseModel):
    id: str
    citizen_email: str
    reward_type: RewardType
    points: int
    description: str
    earned_date: str
    related_id: str = ""  # bill_id, incident_id, etc.


class RewardRedemption(BaseModel):
    id: str
    citizen_email: str
    redemption_type: RedemptionType
    points_used: int
    redeemed_date: str
    status: str = "completed"  # pending, completed, expired
    value: float  # discount amount or coupon value


class Tier(BaseModel):
    name: str
    min_points: int
    max_points: int
    benefits: list[str]
    discount_percentage: float


class CitizenRewardStatus(BaseModel):
    citizen_email: str
    total_points: int
    current_tier: str
    available_redemptions: list[dict]
    recent_rewards: list[Reward]
    redemption_history: list[RewardRedemption]


class RewardRequest(BaseModel):
    citizen_email: str
    reward_type: RewardType
    points: int
    description: str = ""
    related_id: str = ""


class RedemptionRequest(BaseModel):
    citizen_email: str
    redemption_type: RedemptionType
    points_to_use: int


class RedemptionResponse(BaseModel):
    success: bool
    message: str
    points_remaining: int
    coupon_code: str = ""
    discount_amount: float = 0
