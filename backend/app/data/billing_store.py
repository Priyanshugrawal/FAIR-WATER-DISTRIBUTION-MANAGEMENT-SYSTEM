from datetime import datetime, timedelta
from app.schemas.billing import Bill, Payment, PaymentStatus, SupplyStatus
from app.core.billing import (
    generate_bill_id,
    generate_payment_id,
    calculate_supply_status,
    calculate_days_overdue,
)


class BillingStore:
    """In-memory store for bills and payments"""

    def __init__(self):
        self.bills: dict[str, Bill] = {}
        self.payments: dict[str, Payment] = {}
        # Index for quick lookup by citizen email
        self.bills_by_citizen: dict[str, list[str]] = {}
        self._initialize_sample_data()

    def _initialize_sample_data(self):
        """Initialize with sample bills for demo"""
        # Sample bills
        sample_bills = [
            {
                "citizen_email": "user@example.com",
                "amount": 1500.0,
                "due_date": (datetime.now() + timedelta(days=10)).strftime("%Y-%m-%d"),
                "description": "Monthly water bill - November 2025",
                "created_date": (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d"),
                "payment_status": PaymentStatus.PENDING,
            },
            {
                "citizen_email": "user@example.com",
                "amount": 1500.0,
                "due_date": (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d"),
                "description": "Monthly water bill - October 2025",
                "created_date": (datetime.now() - timedelta(days=33)).strftime("%Y-%m-%d"),
                "payment_status": PaymentStatus.PAID,
            },
            {
                "citizen_email": "citizen1@raipur.gov.in",
                "amount": 2000.0,
                "due_date": (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d"),
                "description": "Monthly water bill - November 2025",
                "created_date": (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"),
                "payment_status": PaymentStatus.PENDING,
            },
            {
                "citizen_email": "citizen2@raipur.gov.in",
                "amount": 1200.0,
                "due_date": (datetime.now() - timedelta(days=15)).strftime("%Y-%m-%d"),
                "description": "Monthly water bill - October 2025",
                "created_date": (datetime.now() - timedelta(days=43)).strftime("%Y-%m-%d"),
                "payment_status": PaymentStatus.PENDING,
            },
        ]

        for bill_data in sample_bills:
            bill_id = generate_bill_id()
            supply_status = calculate_supply_status(
                bill_data["payment_status"], bill_data["due_date"]
            )
            bill = Bill(
                id=bill_id,
                citizen_email=bill_data["citizen_email"],
                amount=bill_data["amount"],
                due_date=bill_data["due_date"],
                created_date=bill_data["created_date"],
                description=bill_data["description"],
                payment_status=bill_data["payment_status"],
                supply_status=supply_status,
            )
            self.bills[bill_id] = bill
            if bill_data["citizen_email"] not in self.bills_by_citizen:
                self.bills_by_citizen[bill_data["citizen_email"]] = []
            self.bills_by_citizen[bill_data["citizen_email"]].append(bill_id)

    def create_bill(
        self,
        citizen_email: str,
        amount: float,
        due_date: str,
        description: str = "Monthly water bill",
    ) -> Bill:
        """Create a new bill"""
        bill_id = generate_bill_id()
        bill = Bill(
            id=bill_id,
            citizen_email=citizen_email,
            amount=amount,
            due_date=due_date,
            created_date=datetime.now().strftime("%Y-%m-%d"),
            description=description,
            payment_status=PaymentStatus.PENDING,
            supply_status=SupplyStatus.ACTIVE,
        )
        self.bills[bill_id] = bill
        if citizen_email not in self.bills_by_citizen:
            self.bills_by_citizen[citizen_email] = []
        self.bills_by_citizen[citizen_email].append(bill_id)
        return bill

    def get_bills_for_citizen(self, citizen_email: str) -> list[Bill]:
        """Get all bills for a citizen"""
        bill_ids = self.bills_by_citizen.get(citizen_email, [])
        bills = [self.bills[bill_id] for bill_id in bill_ids if bill_id in self.bills]
        return bills

    def get_bill(self, bill_id: str) -> Bill | None:
        """Get a specific bill by ID"""
        return self.bills.get(bill_id)

    def get_all_bills(self) -> list[Bill]:
        """Get all bills"""
        return list(self.bills.values())

    def process_payment(
        self,
        bill_id: str,
        amount: float,
        payment_method: str,
    ) -> Payment | None:
        """Process payment for a bill"""
        bill = self.bills.get(bill_id)
        if not bill:
            return None

        # Update bill status
        bill.payment_status = PaymentStatus.PAID
        bill.supply_status = SupplyStatus.ACTIVE

        # Create payment record
        payment_id = generate_payment_id()
        payment = Payment(
            id=payment_id,
            bill_id=bill_id,
            amount=amount,
            paid_date=datetime.now().strftime("%Y-%m-%d"),
            payment_method=payment_method,
            reference_number=generate_payment_id(),
        )
        self.payments[payment_id] = payment
        return payment

    def get_payment(self, payment_id: str) -> Payment | None:
        """Get a specific payment by ID"""
        return self.payments.get(payment_id)

    def get_payments_for_bill(self, bill_id: str) -> list[Payment]:
        """Get all payments for a bill"""
        return [p for p in self.payments.values() if p.bill_id == bill_id]

    def get_citizen_summary(self, citizen_email: str) -> dict:
        """Get billing summary for a citizen"""
        bills = self.get_bills_for_citizen(citizen_email)
        pending_bills = [b for b in bills if b.payment_status == PaymentStatus.PENDING]
        total_pending = sum(b.amount for b in pending_bills)

        # Calculate supply status (most restrictive)
        supply_status = SupplyStatus.ACTIVE
        max_overdue_days = 0
        for bill in bills:
            if bill.payment_status == PaymentStatus.PENDING:
                overdue_days = calculate_days_overdue(bill.due_date)
                if overdue_days > max_overdue_days:
                    max_overdue_days = overdue_days
                    if overdue_days > 7:
                        supply_status = SupplyStatus.SUSPENDED
                    elif overdue_days > 0:
                        supply_status = SupplyStatus.LIMITED

        return {
            "bills": bills,
            "total_pending": total_pending,
            "supply_status": supply_status,
            "overdue_days": max_overdue_days,
        }


# Global instance
billing_store = BillingStore()
