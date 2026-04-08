from pydantic import BaseModel, Field
from datetime import datetime
from decimal import Decimal
from typing import Optional


class TranslateRequest(BaseModel):
    source_lang: str = Field(..., min_length=2, max_length=10, examples=["ko"])
    target_lang: str = Field(..., min_length=2, max_length=10, examples=["en"])
    text: str = Field(..., min_length=1, max_length=5000)
    input_type: str = Field(default="text", max_length=10)
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    country_code: Optional[str] = Field(default=None, max_length=5)


class TranslateResponse(BaseModel):
    source_lang: str
    target_lang: str
    source_text: str
    translated_text: str


class TranslationRecord(BaseModel):
    id: int
    source_lang: str
    target_lang: str
    source_text: str
    translated_text: str
    input_type: str
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    country_code: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
