from pydantic import BaseModel, Field
from datetime import datetime

class LearningCardCreateRequest(BaseModel):
	translation_id: int = Field(..., examples=[1])

class LearningCardUpdateRequest(BaseModel):
	is_memorized: bool = Field(..., examples=[True])

class LearningCardResponse(BaseModel):
	id: int
	translation_id: int
	source_lang: str
	target_lang: str
	source_text: str
	translated_text: str
	is_memorized: bool
	created_at: datetime
             
	model_config = {"from_attributes": True}
