from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schemas.translate import TranslateRequest, TranslateResponse, TranslationRecord
from app.services.translate_service import translate_text
from app.models.translation import Translation

router = APIRouter(prefix="/translate", tags=["번역"])


@router.post("/", response_model=TranslateResponse)
def post_translate(req: TranslateRequest, db: Session = Depends(get_db)):
    """텍스트 번역 API"""
    try:
        return translate_text(req, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"번역 실패: {e}")


@router.get("/history", response_model=list[TranslationRecord])
def get_history(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """번역 내역 조회 API"""
    rows = (
        db.query(Translation)
        .order_by(Translation.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return rows
