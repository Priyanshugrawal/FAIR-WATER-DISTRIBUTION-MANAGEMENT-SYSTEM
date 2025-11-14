from fastapi import APIRouter, HTTPException
from app.schemas.rewards import (
    RewardRequest,
    RedemptionRequest,
    RedemptionResponse,
)
from app.schemas.emergency_contacts import (
    EmergencyContactRequest,
    EmergencyContactResponse,
    ServiceRequest,
    ServiceRequestResponse,
    ContactType,
)
from app.data.reward_store import reward_store
from app.data.emergency_store import emergency_store
from app.core.rewards import validate_redemption, generate_coupon_code

router = APIRouter(prefix="/rewards-emergency", tags=["rewards-emergency"])


# ===== REWARD ENDPOINTS =====
@router.post("/rewards/add")
async def add_reward(request: RewardRequest):
    """Add reward points to a citizen"""
    try:
        reward = reward_store.add_reward(
            citizen_email=request.citizen_email,
            reward_type=request.reward_type,
            points=request.points,
            description=request.description,
            related_id=request.related_id,
        )
        return {
            "success": True,
            "message": f"Reward of {reward.points} points added successfully",
            "reward_id": reward.id,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/rewards/citizen/{citizen_email}")
async def get_citizen_reward_status(citizen_email: str):
    """Get reward status and summary for a citizen"""
    try:
        summary = reward_store.get_citizen_summary(citizen_email)
        return {
            "citizen_email": citizen_email,
            "total_points": summary["total_points"],
            "current_tier": summary["current_tier"],
            "tier_benefits": summary["tier_benefits"],
            "discount_percentage": summary["discount_percentage"],
            "rewards_count": summary["rewards_count"],
            "redemptions_count": summary["redemptions_count"],
            "recent_rewards": [
                {
                    "id": r.id,
                    "type": r.reward_type.value,
                    "points": r.points,
                    "description": r.description,
                    "earned_date": r.earned_date,
                }
                for r in summary["recent_rewards"]
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/rewards/redeem")
async def redeem_points(request: RedemptionRequest) -> RedemptionResponse:
    """Redeem points for discounts or coupons"""
    try:
        # Validate points
        available_points = reward_store.get_citizen_total_points(request.citizen_email)
        is_valid, message = validate_redemption(available_points, request.points_to_use)

        if not is_valid:
            raise HTTPException(status_code=400, detail=message)

        # Process redemption
        redemption = reward_store.redeem_points(
            citizen_email=request.citizen_email,
            redemption_type=request.redemption_type,
            points_to_use=request.points_to_use,
        )

        if not redemption:
            raise HTTPException(status_code=500, detail="Failed to process redemption")

        coupon_code = generate_coupon_code()
        new_total = available_points - request.points_to_use

        return RedemptionResponse(
            success=True,
            message=f"Redeemed {request.points_to_use} points successfully",
            points_remaining=new_total,
            coupon_code=coupon_code,
            discount_amount=redemption.value,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/rewards/stats")
async def get_reward_stats():
    """Get reward system statistics"""
    stats = reward_store.get_reward_stats()
    return stats


# ===== EMERGENCY CONTACT ENDPOINTS =====
@router.get("/emergency/contacts")
async def get_all_emergency_contacts():
    """Get all verified emergency contacts"""
    try:
        contacts = emergency_store.get_verified_contacts()
        return [
            {
                "id": c.id,
                "name": c.name,
                "type": c.contact_type.value,
                "phone": c.phone,
                "email": c.email,
                "location": c.location,
                "availability": c.availability,
                "service_category": c.service_category.value,
                "experience_years": c.experience_years,
                "rating": c.rating,
                "verified": c.verified,
            }
            for c in contacts
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/emergency/contacts/type/{contact_type}")
async def get_contacts_by_type(contact_type: str):
    """Get contacts by type (plumber, electrician, etc.)"""
    try:
        contact_type_enum = ContactType(contact_type)
        contacts = emergency_store.get_contact_by_type_sorted(contact_type_enum)
        return [
            {
                "id": c.id,
                "name": c.name,
                "phone": c.phone,
                "email": c.email,
                "location": c.location,
                "availability": c.availability,
                "experience_years": c.experience_years,
                "rating": c.rating,
                "verified": c.verified,
            }
            for c in contacts
        ]
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid contact type: {contact_type}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/emergency/contacts/urgent")
async def get_emergency_contacts():
    """Get 24/7 emergency contacts"""
    try:
        contacts = emergency_store.get_emergency_contacts()
        return [
            {
                "id": c.id,
                "name": c.name,
                "type": c.contact_type.value,
                "phone": c.phone,
                "email": c.email,
                "location": c.location,
                "availability": c.availability,
                "rating": c.rating,
            }
            for c in contacts
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/emergency/request")
async def request_emergency_service(request: ServiceRequest) -> ServiceRequestResponse:
    """Request emergency service from a contact"""
    try:
        contact = emergency_store.get_contact(request.contact_id)
        if not contact:
            raise HTTPException(status_code=404, detail="Contact not found")

        service_id = f"SRV-{request.contact_id[:4]}-{hash(request.citizen_email) % 10000:04d}"

        return ServiceRequestResponse(
            success=True,
            message=f"Service request sent to {contact.name}",
            request_id=service_id,
            contact_name=contact.name,
            contact_phone=contact.phone,
            estimated_time="15-30 minutes" if "24/7" in contact.availability else "As per business hours",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/emergency/contacts/add")
async def add_emergency_contact(request: EmergencyContactRequest):
    """Add new emergency contact (admin only)"""
    try:
        contact = emergency_store.add_contact(
            {
                "name": request.name,
                "contact_type": request.contact_type,
                "phone": request.phone,
                "email": request.email,
                "location": request.location,
                "availability": request.availability,
                "service_category": request.service_category,
                "experience_years": request.experience_years,
            }
        )
        return {
            "success": True,
            "message": "Contact added successfully",
            "contact_id": contact.id,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
