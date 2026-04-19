from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schemas.ranking import QuizScoreRequest, QuizScoreResponse
from app.services.quiz_score_service import create_quiz_score

router = APIRouter(prefix="/quiz-score", tags=["미니 게임 점수"])

@router.post("/create", response_model=QuizScoreResponse)
def post_quiz_score(req: QuizScoreRequest, db: Session = Depends(get_db)):
    return create_quiz_score(req, db)