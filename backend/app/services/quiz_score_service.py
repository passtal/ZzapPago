from datetime import datetime
from sqlalchemy.orm import Session
from app.models import QuizScore
from app.schemas.ranking import QuizScoreRequest
from app.services.ranking_service import update_ranking_quiz_score


def create_quiz_score(req: QuizScoreRequest, db: Session):
    quiz_score = (
        db.query(QuizScore)
        .filter(
            QuizScore.nickname == req.nickname,
            QuizScore.quiz_type == req.quiz_type,
        )
        .order_by(QuizScore.score.desc(), QuizScore.played_at.desc())
        .first()
    )

    if quiz_score and req.score <= quiz_score.score:
        return {
            "id": quiz_score.id,
            "nickname": quiz_score.nickname,
            "quiz_type": quiz_score.quiz_type,
            "score": quiz_score.score,
            "played_at": quiz_score.played_at,
            "is_new_best": False,
        }

    if quiz_score:
        quiz_score.score = req.score
        quiz_score.played_at = datetime.now()
    else:
        quiz_score = QuizScore(
            nickname=req.nickname,
            quiz_type=req.quiz_type,
            score=req.score,
        )
        db.add(quiz_score)

    db.commit()
    db.refresh(quiz_score)

    # 랭킹 자동 갱신
    update_ranking_quiz_score(req.nickname, db)

    return {
        "id": quiz_score.id,
        "nickname": quiz_score.nickname,
        "quiz_type": quiz_score.quiz_type,
        "score": quiz_score.score,
        "played_at": quiz_score.played_at,
        "is_new_best": True,
    }
