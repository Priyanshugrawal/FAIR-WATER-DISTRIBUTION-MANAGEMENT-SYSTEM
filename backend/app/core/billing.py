import uuid
from datetime import datetime, timedelta
from app.schemas.billing import PaymentStatus, SupplyStatus


def generate_bill_id() -> str:
    """Generate unique bill ID"""
    return f"BILL-{uuid.uuid4().hex[:8].upper()}"


def generate_payment_id() -> str:
    """Generate unique payment ID"""
    return f"PAY-{uuid.uuid4().hex[:8].upper()}"


def generate_invoice_number() -> str:
    """Generate unique invoice number"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    return f"INV-{timestamp}-{uuid.uuid4().hex[:4].upper()}"


def calculate_supply_status(payment_status: PaymentStatus, due_date: str) -> SupplyStatus:
    """
    Calculate supply status based on payment status and due date.
    
    - If paid → ACTIVE
    - If pending and not overdue → ACTIVE
    - If pending and overdue ≤ 7 days → LIMITED
    - If pending and overdue > 7 days → SUSPENDED
    """
    if payment_status == PaymentStatus.PAID:
        return SupplyStatus.ACTIVE
    
    # Parse due date
    due_datetime = datetime.strptime(due_date, "%Y-%m-%d")
    days_overdue = (datetime.now() - due_datetime).days
    
    if days_overdue <= 0:
        # Not yet due
        return SupplyStatus.ACTIVE
    elif days_overdue <= 7:
        # Overdue but within grace period
        return SupplyStatus.LIMITED
    else:
        # Significantly overdue
        return SupplyStatus.SUSPENDED


def calculate_days_overdue(due_date: str) -> int:
    """Calculate days overdue from due date"""
    due_datetime = datetime.strptime(due_date, "%Y-%m-%d")
    days = (datetime.now() - due_datetime).days
    return max(0, days)


def generate_invoice_pdf(
    invoice_number: str,
    citizen_email: str,
    amount: float,
    paid_date: str,
    payment_method: str,
    bill_id: str,
) -> str:
    """
    Generate a simple text-based invoice.
    In production, use reportlab or pypdf to generate actual PDF.
    Returns invoice content as string.
    """
    invoice_date = datetime.now().strftime("%d-%m-%Y")
    invoice_time = datetime.now().strftime("%H:%M:%S")
    
    invoice_content = f"""
===============================================
        WATER DISTRIBUTION MANAGEMENT
                    INVOICE
===============================================

Invoice Number: {invoice_number}
Invoice Date: {invoice_date}
Invoice Time: {invoice_time}

------- CUSTOMER DETAILS -------
Email: {citizen_email}
Bill ID: {bill_id}

------- PAYMENT DETAILS -------
Amount Paid: ₹{amount:.2f}
Payment Date: {paid_date}
Payment Method: {payment_method}
Status: PAID

------- TERMS & CONDITIONS -------
1. This is a computer-generated invoice
2. No signature required
3. Keep this invoice for your records
4. For queries, contact municipal office

Generated: {invoice_date} {invoice_time}
===============================================
"""
    return invoice_content
