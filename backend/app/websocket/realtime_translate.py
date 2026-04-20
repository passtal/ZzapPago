from fastapi import WebSocket, WebSocketDisconnect
from openai import OpenAI
from app.config.settings import get_settings

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


async def handle_realtime_translate(websocket: WebSocket):
    """
    WebSocket 실시간 번역 핸들러
    클라이언트 메시지 형식: { "text": "...", "source_lang": "ko", "target_lang": "en" }
    서버 응답 형식: { "translated_text": "...", "source_text": "..." }
    """
    await websocket.accept()

    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    try:
        while True:
            data = await websocket.receive_json()

            text = data.get("text", "").strip()
            source_lang = data.get("source_lang", "ko")
            target_lang = data.get("target_lang", "en")

            if not text:
                await websocket.send_json({"translated_text": "", "source_text": ""})
                continue

            source_name = _get_lang_name(source_lang)
            target_name = _get_lang_name(target_lang)

            try:
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
                        {"role": "user", "content": text},
                    ],
                    temperature=0.3,
                    max_tokens=2000,
                )

                translated = response.choices[0].message.content.strip()

                await websocket.send_json({
                    "translated_text": translated,
                    "source_text": text,
                })
            except Exception as e:
                await websocket.send_json({
                    "translated_text": "",
                    "source_text": text,
                    "error": f"번역 실패: {str(e)}",
                })

    except WebSocketDisconnect:
        pass
