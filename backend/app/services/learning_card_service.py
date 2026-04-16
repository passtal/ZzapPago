from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.learning_cards import LearningCard
from app.models.translation import Translation
from app.schemas.learning_card import LearningCardCreateRequest

def read_learning_cards(db: Session, skip: int = 0, limit: int = 20, is_memorized: bool | None = None):
	query = db.query(LearningCard)

	if is_memorized is not None:
		query = query.filter(LearningCard.is_memorized == is_memorized)

	query = query.order_by(LearningCard.created_at.desc()).offset(skip).limit(limit)
	return query.all()

def create_learning_card(learning_card_data: LearningCardCreateRequest, db: Session):
	translation = db.query(Translation).filter(Translation.id == learning_card_data.translation_id).first()

	if not translation:
		raise HTTPException(status_code = 404, detail="해당 번역 기록을 찾을 수 없습니다.")
	
	if db.query(LearningCard).filter(LearningCard.translation_id == learning_card_data.translation_id).first():
		raise HTTPException(status_code = 409, detail="이미 학습 카드로 등록된 번역 기록입니다.")
	
	learning_card = LearningCard(
		translation_id = learning_card_data.translation_id,
		source_lang = translation.source_lang,
		target_lang = translation.target_lang,
		source_text = translation.source_text,
		translated_text = translation.translated_text
	)

	db.add(learning_card)
	db.commit()
	db.refresh(learning_card)

	return learning_card

def update_learning_card_memorized(card_id: int, is_memorized: bool, db: Session):
	learning_card = db.query(LearningCard).filter(LearningCard.id == card_id).first()

	if not learning_card:
		raise HTTPException(status_code = 404, detail="해당 학습 카드를 찾을 수 없습니다.")

	learning_card.is_memorized = is_memorized
	db.commit()
	db.refresh(learning_card)

	return learning_card
