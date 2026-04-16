from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.schemas.stt import STTResponse
from app.services.stt_service import transcribe_audio

router = APIRouter(prefix="/stt", tags=["음성 인식"])


@router.post("/", response_model=STTResponse)
async def speech_to_text(
    file: UploadFile = File(..., description="음성 파일 (webm, wav, mp3 등)"),
    language: str | None = Form(default=None, description="음성 언어 코드 (ko, en, ja 등)"),
):
    """음성 파일을 텍스트로 변환하는 STT API"""
    if not file.content_type or not file.content_type.startswith("audio"):
        raise HTTPException(status_code=400, detail="오디오 파일만 업로드 가능합니다.")

    try:
        text = await transcribe_audio(file, language)
        return STTResponse(text=text, language=language)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"음성 인식 실패: {e}")
