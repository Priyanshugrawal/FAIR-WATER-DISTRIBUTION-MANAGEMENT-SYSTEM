from fastapi import APIRouter

from app.services import insights

router = APIRouter(prefix="/insights", tags=["insights"])


@router.get("/summary", summary="AI insights summary")
async def get_network_summary() -> dict[str, object]:
  return insights.summarize_network_health()

