from pydantic import BaseModel, Field
from datetime import datetime


class RankingResponse(BaseModel):
    id: int
    nickname: str
    total_score: int
    translate_count: int
    quiz_score: int
    updated_at: datetime

    model_config = {"from_attributes": True}


class QuizScoreRequest(BaseModel):
    nickname: str = Field(..., min_length=1, max_length=50)
    quiz_type: str = Field(..., min_length=1, max_length=30)
    score: int = Field(..., ge=0)


class QuizScoreResponse(BaseModel):
    id: int
    nickname: str
    quiz_type: str
    score: int
    played_at: datetime
    is_new_best: bool = False

    model_config = {"from_attributes": True}
