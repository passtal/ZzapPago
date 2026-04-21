from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schemas.ranking import RankingResponse
from app.services.ranking_service import get_rankings, update_ranking_translate_count, update_ranking_quiz_score

router = APIRouter(prefix="/rankings", tags=["랭킹"])


@router.get("/", response_model=list[RankingResponse])
def get_ranking_list(limit: int = 50, db: Session = Depends(get_db)):
    """랭킹 목록 조회"""
    return get_rankings(db, limit)


@router.post("/translate/{nickname}", response_model=RankingResponse)
def post_ranking_translate(nickname: str, db: Session = Depends(get_db)):
    """번역 시 해당 닉네임의 번역 횟수 +1"""
    return update_ranking_translate_count(nickname, db)


@router.post("/quiz/{nickname}", response_model=RankingResponse)
def post_ranking_quiz(nickname: str, db: Session = Depends(get_db)):
    """퀴즈 점수 변경 시 quiz_score 합산 갱신"""
    return update_ranking_quiz_score(nickname, db)
