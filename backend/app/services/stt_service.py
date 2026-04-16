from openai import OpenAI
from fastapi import UploadFile
from app.config.settings import get_settings

settings = get_settings()


async def transcribe_audio(file: UploadFile, language: str | None = None) -> str:
    """OpenAI Whisper API를 사용하여 음성 파일을 텍스트로 변환한다."""
    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    audio_bytes = await file.read()

    transcription = client.audio.transcriptions.create(
        model="whisper-1",
        file=(file.filename or "audio.webm", audio_bytes),
        language=language,
    )

    return transcription.text
