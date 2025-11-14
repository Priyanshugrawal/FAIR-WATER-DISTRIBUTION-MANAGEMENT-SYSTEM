import asyncio
import json
from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.data import mock_store

router = APIRouter(prefix="/ws", tags=["realtime"])


@router.websocket("/telemetry")
async def telemetry_stream(websocket: WebSocket) -> None:
  await websocket.accept()
  try:
    while True:
      payload = {
        "type": "telemetry_snapshot",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "data": [snapshot.model_dump() for snapshot in mock_store.latest_telemetry()],
      }
      await websocket.send_text(json.dumps(payload))
      await asyncio.sleep(5)
  except WebSocketDisconnect:
    return

