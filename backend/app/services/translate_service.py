from openai import OpenAI
from sqlalchemy.orm import Session
from app.config.settings import get_settings
from app.models.translation import Translation
from app.schemas.translate import TranslateRequest, TranslateResponse

settings = get_settings()

LANG_NAMES = {
    "ko": "Korean",
    "en": "English",
    "ja": "Japanese",
    "zh": "Chinese",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "vi": "Vietnamese",
    "th": "Thai",
    "ru": "Russian",
    "pt": "Portuguese",
    "ar": "Arabic",
}


def _get_lang_name(code: str) -> str:
    return LANG_NAMES.get(code, code)


def translate_text(req: TranslateRequest, db: Session) -> TranslateResponse:
    """OpenAI GPT를 사용하여 텍스트를 번역하고, DB에 내역을 저장한다."""
    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    source_name = _get_lang_name(req.source_lang)
    target_name = _get_lang_name(req.target_lang)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    f"You are a professional translator. "
                    f"Translate the following text from {source_name} to {target_name}. "
                    f"Return ONLY the translated text, nothing else."
                ),
            },
            {"role": "user", "content": req.text},
        ],
        temperature=0.3,
        max_tokens=2000,
    )

    translated = response.choices[0].message.content.strip()

    # DB에 번역 내역 저장
    record = Translation(
        source_lang=req.source_lang,
        target_lang=req.target_lang,
        source_text=req.text,
        translated_text=translated,
        input_type=req.input_type,
        latitude=req.latitude,
        longitude=req.longitude,
        country_code=req.country_code,
    )
    db.add(record)
    db.commit()

    return TranslateResponse(
        source_lang=req.source_lang,
        target_lang=req.target_lang,
        source_text=req.text,
        translated_text=translated,
    )
