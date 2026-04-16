from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schemas.learning_card import LearningCardResponse, LearningCardCreateRequest, LearningCardUpdateRequest
from app.services.learning_card_service import create_learning_card, read_learning_cards, update_learning_card_memorized

router = APIRouter(prefix="/learning-cards", tags=["학습 카드"])

@router.get("/", response_model=list[LearningCardResponse])
def get_learning_cards(skip: int = 0, limit: int = 20, is_memorized: bool | None = None, db: Session = Depends(get_db)):
	return read_learning_cards(db, skip, limit, is_memorized)

@router.post("/create", response_model=LearningCardResponse)
def post_learning_card(req: LearningCardCreateRequest, db: Session = Depends(get_db)):
	return create_learning_card(req, db)

@router.patch("/{card_id}", response_model=LearningCardResponse)
def patch_learning_card(card_id: int, req: LearningCardUpdateRequest, db: Session = Depends(get_db)):
	return update_learning_card_memorized(card_id, req.is_memorized, db)
