from pydantic import BaseModel, Field
from enum import Enum


class ContactType(str, Enum):
    PLUMBER = "plumber"
    ELECTRICIAN = "electrician"
    CIVIL_ENGINEER = "civil_engineer"
    EMERGENCY_RESPONDER = "emergency_responder"
    RMC_OFFICE = "rmc_office"


class ServiceCategory(str, Enum):
    EMERGENCY = "emergency"
    MAINTENANCE = "maintenance"
    CONSULTATION = "consultation"
    COMPLAINT = "complaint"


class EmergencyContact(BaseModel):
    id: str
    name: str
    contact_type: ContactType
    phone: str
    email: str = ""
    location: str = ""
    availability: str = "24/7"
    service_category: ServiceCategory
    experience_years: int = 0
    rating: float = 0.0
    verified: bool = False


class EmergencyContactRequest(BaseModel):
    name: str = Field(..., min_length=2)
    contact_type: ContactType
    phone: str = Field(..., regex=r"^\+?1?\d{9,15}$")
    email: str = ""
    location: str = ""
    availability: str = "24/7"
    service_category: ServiceCategory
    experience_years: int = 0


class EmergencyContactResponse(BaseModel):
    id: str
    name: str
    contact_type: str
    phone: str
    email: str
    location: str
    availability: str
    service_category: str
    experience_years: int
    rating: float
    verified: bool


class ServiceRequest(BaseModel):
    citizen_email: str
    contact_id: str
    service_type: ServiceCategory
    description: str
    urgent: bool = False
    preferred_time: str = "ASAP"


class ServiceRequestResponse(BaseModel):
    success: bool
    message: str
    request_id: str
    contact_name: str
    contact_phone: str
    estimated_time: str
