from pydantic import BaseModel, Field

class TtsRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=3000)
    lang: str = Field(..., min_length=2, max_length=10, examples=["ko"])
    slow: bool = Field(False)