import uuid
from datetime import datetime
from app.schemas.rewards import RewardType, Tier


def generate_reward_id() -> str:
    """Generate unique reward ID"""
    return f"RWD-{uuid.uuid4().hex[:8].upper()}"


def generate_redemption_id() -> str:
    """Generate unique redemption ID"""
    return f"RED-{uuid.uuid4().hex[:8].upper()}"


def generate_coupon_code() -> str:
    """Generate unique coupon code"""
    timestamp = datetime.now().strftime("%y%m%d")
    random_code = uuid.uuid4().hex[:6].upper()
    return f"RMC-{timestamp}-{random_code}"


# Reward tiers based on points
REWARD_TIERS = [
    Tier(
        name="Bronze",
        min_points=0,
        max_points=499,
        benefits=["Basic discount on water tax", "Monthly email newsletter"],
        discount_percentage=2.0,
    ),
    Tier(
        name="Silver",
        min_points=500,
        max_points=999,
        benefits=["5% water tax discount", "Priority complaint handling", "Free leak inspection"],
        discount_percentage=5.0,
    ),
    Tier(
        name="Gold",
        min_points=1000,
        max_points=2499,
        benefits=["10% water tax discount", "VIP support", "Free maintenance service monthly", "Exclusive coupons"],
        discount_percentage=10.0,
    ),
    Tier(
        name="Platinum",
        min_points=2500,
        max_points=float("inf"),
        benefits=["15% water tax discount", "24/7 priority support", "Free plumber visits", "Monthly rewards bonus"],
        discount_percentage=15.0,
    ),
]

# Point values for different reward types
REWARD_POINTS = {
    RewardType.ON_TIME_PAYMENT: 50,
    RewardType.LEAK_REPORT: 100,
    RewardType.WATER_SAVINGS: 75,
    RewardType.REFERRAL: 150,
    RewardType.PARTICIPATION: 25,
}

# Redemption point values
REDEMPTION_POINTS = {
    "water_tax_discount_100": 200,  # ₹100 discount for 200 points
    "water_tax_discount_250": 500,
    "water_tax_discount_500": 1000,
    "rmc_coupon_500": 300,
    "rmc_coupon_1000": 600,
    "maintenance_voucher": 400,
    "priority_service": 150,
}


def calculate_tier(total_points: int) -> Tier:
    """Calculate citizen tier based on total points"""
    for tier in REWARD_TIERS:
        if tier.min_points <= total_points <= tier.max_points:
            return tier
    return REWARD_TIERS[-1]  # Return Platinum if over max


def get_reward_points(reward_type: RewardType) -> int:
    """Get point value for reward type"""
    return REWARD_POINTS.get(reward_type, 0)


def calculate_discount(total_points: int) -> float:
    """Calculate discount percentage from tier"""
    tier = calculate_tier(total_points)
    return tier.discount_percentage


def validate_redemption(available_points: int, points_needed: int) -> tuple[bool, str]:
    """Validate if redemption is possible"""
    if points_needed <= 0:
        return False, "Invalid points amount"
    if available_points < points_needed:
        return False, f"Insufficient points. You have {available_points} but need {points_needed}"
    return True, "Redemption valid"


def calculate_discount_value(points_used: int) -> float:
    """Calculate rupee value from points (1 point = ₹0.5)"""
    return points_used * 0.5
