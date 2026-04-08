from pydantic import BaseModel
from datetime import datetime


class ExportRequest(BaseModel):
    translation_id: int
    format: str  # pdf, word, img


class ExportResponse(BaseModel):
    id: int
    translation_id: int
    format: str
    file_path: str
    created_at: datetime

    model_config = {"from_attributes": True}
