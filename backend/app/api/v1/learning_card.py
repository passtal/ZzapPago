from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.learning_cards import LearningCard
from app.schemas.learning_card import LearningCardResponse, LearningCardCreateRequest

router = APIRouter(prefix="/learning-cards", tags=["학습 카드"])

@router.get("/", response_model=list[LearningCardResponse])
def get_learning_cards(skip: int = 0, limit: int = 20, is_memorized: bool | None = None, db: Session = Depends(get_db)):
	query = db.query(LearningCard)

	if is_memorized is not None:
		query = query.filter(LearningCard.is_memorized == is_memorized)
	
	rows = (
		query.order_by(LearningCard.created_at.desc())
		.offset(skip)
		.limit(limit)
		.all()
	)
	return rows

@router.post("/create", response_model=LearningCardResponse)
def create_learning_card(req: LearningCardCreateRequest, db: Session = Depends(get_db)):
	return create_learning_card(req, db)