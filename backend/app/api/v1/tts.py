from io import BytesIO
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.schemas.tts import TtsRequest
from app.services.tts_service import synthesize_speech

router = APIRouter(prefix="/tts", tags=["TTS"])

@router.post("/speak")
def post_tts(req: TtsRequest):
    audio = synthesize_speech(req)
    return StreamingResponse(
        BytesIO(audio),
        media_type="audio/mpeg",
        headers={
            "Cache-Control": "no-store",
            "Content-Disposition": 'inline; filename="tts.mp3"',
        },
    )
