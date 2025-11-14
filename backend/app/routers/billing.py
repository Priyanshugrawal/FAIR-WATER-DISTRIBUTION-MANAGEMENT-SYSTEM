from fastapi import APIRouter, HTTPException, status
from app.schemas.billing import (
    BillCreateRequest,
    PaymentRequest,
    BillResponse,
    PaymentResponse,
    CitizenBillStatus,
)
from app.data.billing_store import billing_store
from app.core.billing import (
    generate_invoice_number,
    calculate_supply_status,
    generate_invoice_pdf,
)

router = APIRouter(prefix="/billing", tags=["billing"])


@router.post("/bills/create", response_model=BillResponse)
async def create_bill(request: BillCreateRequest):
    """Create a new bill for a citizen"""
    try:
        bill = billing_store.create_bill(
            citizen_email=request.citizen_email,
            amount=request.amount,
            due_date=request.due_date,
            description=request.description,
        )
        return BillResponse(
            id=bill.id,
            citizen_email=bill.citizen_email,
            amount=bill.amount,
            due_date=bill.due_date,
            created_date=bill.created_date,
            description=bill.description,
            payment_status=bill.payment_status,
            supply_status=bill.supply_status,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/bills/{citizen_email}", response_model=CitizenBillStatus)
async def get_citizen_bills(citizen_email: str):
    """Get all bills for a citizen"""
    summary = billing_store.get_citizen_summary(citizen_email)
    bills = summary["bills"]
    bill_responses = [
        BillResponse(
            id=bill.id,
            citizen_email=bill.citizen_email,
            amount=bill.amount,
            due_date=bill.due_date,
            created_date=bill.created_date,
            description=bill.description,
            payment_status=bill.payment_status,
            supply_status=bill.supply_status,
        )
        for bill in bills
    ]
    return CitizenBillStatus(
        bills=bill_responses,
        total_pending=summary["total_pending"],
        supply_status=summary["supply_status"],
        overdue_days=summary["overdue_days"],
    )


@router.get("/bills/list/all")
async def get_all_bills():
    """Get all bills (for municipal officer)"""
    all_bills = billing_store.get_all_bills()
    return [
        {
            "id": bill.id,
            "citizen_email": bill.citizen_email,
            "amount": bill.amount,
            "due_date": bill.due_date,
            "created_date": bill.created_date,
            "description": bill.description,
            "payment_status": bill.payment_status,
            "supply_status": bill.supply_status,
        }
        for bill in all_bills
    ]


@router.post("/payments/process", response_model=PaymentResponse)
async def process_payment(request: PaymentRequest):
    """Process payment for a bill"""
    bill = billing_store.get_bill(request.bill_id)
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    if bill.payment_status.value == "paid":
        raise HTTPException(status_code=400, detail="Bill already paid")

    try:
        payment = billing_store.process_payment(
            bill_id=request.bill_id,
            amount=request.amount,
            payment_method=request.payment_method,
        )

        if not payment:
            raise HTTPException(status_code=500, detail="Payment processing failed")

        invoice_number = generate_invoice_number()

        return PaymentResponse(
            success=True,
            message="Payment processed successfully",
            bill_id=request.bill_id,
            payment_id=payment.id,
            invoice_number=invoice_number,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/invoices/{invoice_number}")
async def get_invoice(invoice_number: str):
    """Get invoice details and content"""
    # This is a simplified version - in production, store and retrieve from database
    return {
        "invoice_number": invoice_number,
        "generated": True,
        "content": "Invoice generated and ready for download",
    }


@router.get("/payments/{payment_id}")
async def get_payment(payment_id: str):
    """Get payment details"""
    payment = billing_store.get_payment(payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    return {
        "id": payment.id,
        "bill_id": payment.bill_id,
        "amount": payment.amount,
        "paid_date": payment.paid_date,
        "payment_method": payment.payment_method,
        "reference_number": payment.reference_number,
    }


@router.get("/stats/overview")
async def get_billing_stats():
    """Get billing statistics for municipal dashboard"""
    all_bills = billing_store.get_all_bills()
    total_bills = len(all_bills)
    paid_bills = len([b for b in all_bills if b.payment_status.value == "paid"])
    pending_bills = total_bills - paid_bills
    total_amount = sum(b.amount for b in all_bills)
    total_paid = sum(b.amount for b in all_bills if b.payment_status.value == "paid")
    total_pending = total_amount - total_paid

    return {
        "total_bills": total_bills,
        "paid_bills": paid_bills,
        "pending_bills": pending_bills,
        "total_amount": total_amount,
        "total_paid": total_paid,
        "total_pending": total_pending,
        "collection_rate": (total_paid / total_amount * 100) if total_amount > 0 else 0,
    }
