from pydantic import BaseModel


class STTResponse(BaseModel):
    text: str
    language: str | None = None
