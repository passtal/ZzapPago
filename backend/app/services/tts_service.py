from io import BytesIO
from fastapi import HTTPException
from gtts import gTTS
from gtts.tts import gTTSError
from app.schemas.tts import TtsRequest

GTTS_LANG_MAP = {
    "ar": "ar",
    "de": "de",
    "en": "en",
    "es": "es",
    "fr": "fr",
    "ja": "ja",
    "ko": "ko",
    "pt": "pt",
    "ru": "ru",
    "th": "th",
    "vi": "vi",
    "zh": "zh-CN",
}


def _normalize_gtts_lang(lang_code: str) -> str:
    return GTTS_LANG_MAP.get(lang_code, lang_code)


def synthesize_speech(req: TtsRequest) -> bytes:
    text = req.text.strip()
    if not text: raise HTTPException(status_code=400, detail="TTS를 사용하려면 텍스트가 필요합니다.")

    buffer = BytesIO()

    try:
        tts = gTTS(text=text, lang=_normalize_gtts_lang(req.lang), slow=req.slow)
        tts.write_to_fp(buffer)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"지원되지 않는 TTS 언어: {req.lang}") from exc
    except gTTSError as exc:
        raise HTTPException(status_code=502, detail=f"gTTS 요청 실패: {exc}") from exc

    buffer.seek(0)
    return buffer.getvalue()
