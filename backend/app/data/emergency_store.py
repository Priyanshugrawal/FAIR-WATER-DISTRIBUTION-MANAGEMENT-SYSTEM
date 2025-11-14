import uuid
from app.schemas.emergency_contacts import EmergencyContact, ContactType, ServiceCategory


def generate_contact_id() -> str:
    """Generate unique contact ID"""
    return f"CONT-{uuid.uuid4().hex[:8].upper()}"


class EmergencyContactStore:
    """In-memory store for emergency contacts"""

    def __init__(self):
        self.contacts: dict[str, EmergencyContact] = {}
        self.contacts_by_type: dict[str, list[str]] = {}
        self._initialize_sample_data()

    def _initialize_sample_data(self):
        """Initialize with sample emergency contacts"""
        sample_contacts = [
            {
                "name": "Raj's Plumbing Services",
                "contact_type": ContactType.PLUMBER,
                "phone": "+919876543210",
                "email": "raj.plumber@rmc.gov.in",
                "location": "Ward 5, Market Street",
                "availability": "24/7",
                "service_category": ServiceCategory.EMERGENCY,
                "experience_years": 15,
                "rating": 4.8,
                "verified": True,
            },
            {
                "name": "Sharma Emergency Plumber",
                "contact_type": ContactType.PLUMBER,
                "phone": "+919765432109",
                "email": "sharma.plumber@rmc.gov.in",
                "location": "Ward 10, Main Road",
                "availability": "24/7",
                "service_category": ServiceCategory.EMERGENCY,
                "experience_years": 12,
                "rating": 4.6,
                "verified": True,
            },
            {
                "name": "Expert Plumbing Hub",
                "contact_type": ContactType.PLUMBER,
                "phone": "+919654321098",
                "email": "expert.plumbing@rmc.gov.in",
                "location": "Ward 15, Industrial Area",
                "availability": "9 AM - 6 PM",
                "service_category": ServiceCategory.MAINTENANCE,
                "experience_years": 10,
                "rating": 4.5,
                "verified": True,
            },
            {
                "name": "RMC Emergency Response",
                "contact_type": ContactType.RMC_OFFICE,
                "phone": "+917554436611",
                "email": "emergency@rmc.raipur.gov.in",
                "location": "RMC Headquarters, Raipur",
                "availability": "24/7",
                "service_category": ServiceCategory.EMERGENCY,
                "experience_years": 0,
                "rating": 4.9,
                "verified": True,
            },
            {
                "name": "Municipal Maintenance Division",
                "contact_type": ContactType.CIVIL_ENGINEER,
                "phone": "+917554436612",
                "email": "maintenance@rmc.raipur.gov.in",
                "location": "RMC Technical Wing",
                "availability": "Office hours",
                "service_category": ServiceCategory.MAINTENANCE,
                "experience_years": 0,
                "rating": 4.7,
                "verified": True,
            },
            {
                "name": "Quick Fix Electrician",
                "contact_type": ContactType.ELECTRICIAN,
                "phone": "+919543210987",
                "email": "quickfix.electric@rmc.gov.in",
                "location": "Ward 20, Commercial Zone",
                "availability": "24/7",
                "service_category": ServiceCategory.EMERGENCY,
                "experience_years": 8,
                "rating": 4.4,
                "verified": True,
            },
        ]

        for contact_data in sample_contacts:
            contact_id = generate_contact_id()
            contact = EmergencyContact(
                id=contact_id,
                name=contact_data["name"],
                contact_type=contact_data["contact_type"],
                phone=contact_data["phone"],
                email=contact_data["email"],
                location=contact_data["location"],
                availability=contact_data["availability"],
                service_category=contact_data["service_category"],
                experience_years=contact_data["experience_years"],
                rating=contact_data["rating"],
                verified=contact_data["verified"],
            )
            self.contacts[contact_id] = contact
            contact_type = contact_data["contact_type"].value
            if contact_type not in self.contacts_by_type:
                self.contacts_by_type[contact_type] = []
            self.contacts_by_type[contact_type].append(contact_id)

    def add_contact(self, contact_data: dict) -> EmergencyContact:
        """Add a new emergency contact"""
        contact_id = generate_contact_id()
        contact = EmergencyContact(
            id=contact_id,
            name=contact_data["name"],
            contact_type=contact_data["contact_type"],
            phone=contact_data["phone"],
            email=contact_data.get("email", ""),
            location=contact_data.get("location", ""),
            availability=contact_data.get("availability", "24/7"),
            service_category=contact_data["service_category"],
            experience_years=contact_data.get("experience_years", 0),
            rating=0.0,
            verified=False,
        )
        self.contacts[contact_id] = contact
        contact_type = contact_data["contact_type"].value
        if contact_type not in self.contacts_by_type:
            self.contacts_by_type[contact_type] = []
        self.contacts_by_type[contact_type].append(contact_id)
        return contact

    def get_contact(self, contact_id: str) -> EmergencyContact | None:
        """Get a specific contact"""
        return self.contacts.get(contact_id)

    def get_contacts_by_type(self, contact_type: ContactType) -> list[EmergencyContact]:
        """Get all contacts of a specific type"""
        contact_ids = self.contacts_by_type.get(contact_type.value, [])
        return [self.contacts[cid] for cid in contact_ids if cid in self.contacts]

    def get_all_contacts(self) -> list[EmergencyContact]:
        """Get all emergency contacts"""
        return list(self.contacts.values())

    def get_verified_contacts(self) -> list[EmergencyContact]:
        """Get all verified emergency contacts"""
        return [c for c in self.contacts.values() if c.verified]

    def get_emergency_contacts(self) -> list[EmergencyContact]:
        """Get all emergency service contacts (24/7 and verified)"""
        return [
            c
            for c in self.contacts.values()
            if c.verified and "24/7" in c.availability and c.service_category == ServiceCategory.EMERGENCY
        ]

    def get_contact_by_type_sorted(self, contact_type: ContactType) -> list[EmergencyContact]:
        """Get contacts by type sorted by rating"""
        contacts = self.get_contacts_by_type(contact_type)
        return sorted(contacts, key=lambda c: c.rating, reverse=True)

    def update_contact_rating(self, contact_id: str, new_rating: float) -> bool:
        """Update contact rating"""
        if contact_id in self.contacts:
            # Ensure rating is between 0 and 5
            self.contacts[contact_id].rating = max(0, min(5, new_rating))
            return True
        return False


# Global instance
emergency_store = EmergencyContactStore()
