from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum


class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    OVERDUE = "overdue"


class SupplyStatus(str, Enum):
    ACTIVE = "active"
    LIMITED = "limited"
    SUSPENDED = "suspended"


class BillCreateRequest(BaseModel):
    citizen_email: str = Field(..., description="Email of the citizen")
    amount: float = Field(..., gt=0, description="Bill amount in rupees")
    due_date: str = Field(..., description="Due date in YYYY-MM-DD format")
    description: str = Field(default="Monthly water bill", description="Bill description")


class PaymentRequest(BaseModel):
    bill_id: str = Field(..., description="ID of the bill to pay")
    amount: float = Field(..., gt=0, description="Payment amount in rupees")
    payment_method: str = Field(default="cash", description="Payment method: cash, check, online, etc.")


class Bill(BaseModel):
    id: str
    citizen_email: str
    amount: float
    due_date: str
    created_date: str
    description: str
    payment_status: PaymentStatus = PaymentStatus.PENDING
    supply_status: SupplyStatus = SupplyStatus.ACTIVE


class Payment(BaseModel):
    id: str
    bill_id: str
    amount: float
    paid_date: str
    payment_method: str
    reference_number: str


class Invoice(BaseModel):
    id: str
    bill_id: str
    citizen_email: str
    amount: float
    paid_date: str
    payment_method: str
    generated_date: str
    invoice_number: str


class BillResponse(BaseModel):
    id: str
    citizen_email: str
    amount: float
    due_date: str
    created_date: str
    description: str
    payment_status: PaymentStatus
    supply_status: SupplyStatus


class PaymentResponse(BaseModel):
    success: bool
    message: str
    bill_id: str
    payment_id: str
    invoice_number: str


class CitizenBillStatus(BaseModel):
    bills: list[BillResponse]
    total_pending: float
    supply_status: SupplyStatus
    overdue_days: int = 0
