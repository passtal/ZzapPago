from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.ranking import Ranking
from app.models.translation import Translation
from app.models.quiz_score import QuizScore


def get_rankings(db: Session, limit: int = 50) -> list[Ranking]:
    """랭킹 목록 조회 (total_score 내림차순)"""
    return (
        db.query(Ranking)
        .order_by(Ranking.total_score.desc(), Ranking.updated_at.desc())
        .limit(limit)
        .all()
    )


def refresh_ranking(nickname: str, db: Session) -> Ranking:
    """특정 닉네임의 랭킹 정보를 번역 횟수 + 퀴즈 최고점으로 갱신"""
    translate_count = (
        db.query(func.count(Translation.id))
        .filter(Translation.country_code == nickname)
        .scalar()
    ) or 0

    # nickname 기반 번역 횟수 — translations 테이블에는 nickname이 없으므로
    # 별도 집계 대신, 외부에서 전달받은 값을 사용할 수도 있음
    # 현재는 quiz_scores 합산만 사용
    quiz_total = (
        db.query(func.coalesce(func.sum(QuizScore.score), 0))
        .filter(QuizScore.nickname == nickname)
        .scalar()
    ) or 0

    ranking = db.query(Ranking).filter(Ranking.nickname == nickname).first()

    if ranking:
        ranking.quiz_score = quiz_total
        ranking.total_score = ranking.translate_count + quiz_total
    else:
        ranking = Ranking(
            nickname=nickname,
            translate_count=0,
            quiz_score=quiz_total,
            total_score=quiz_total,
        )
        db.add(ranking)

    db.commit()
    db.refresh(ranking)
    return ranking


def update_ranking_translate_count(nickname: str, db: Session) -> Ranking:
    """번역 시 해당 닉네임의 번역 횟수 +1 갱신"""
    ranking = db.query(Ranking).filter(Ranking.nickname == nickname).first()

    if ranking:
        ranking.translate_count += 1
        ranking.total_score = ranking.translate_count + ranking.quiz_score
    else:
        ranking = Ranking(
            nickname=nickname,
            translate_count=1,
            quiz_score=0,
            total_score=1,
        )
        db.add(ranking)

    db.commit()
    db.refresh(ranking)
    return ranking


def update_ranking_quiz_score(nickname: str, db: Session) -> Ranking:
    """퀴즈 점수 변경 시 quiz_score 합산 갱신"""
    quiz_total = (
        db.query(func.coalesce(func.sum(QuizScore.score), 0))
        .filter(QuizScore.nickname == nickname)
        .scalar()
    ) or 0

    ranking = db.query(Ranking).filter(Ranking.nickname == nickname).first()

    if ranking:
        ranking.quiz_score = quiz_total
        ranking.total_score = ranking.translate_count + quiz_total
    else:
        ranking = Ranking(
            nickname=nickname,
            translate_count=0,
            quiz_score=quiz_total,
            total_score=quiz_total,
        )
        db.add(ranking)

    db.commit()
    db.refresh(ranking)
    return ranking
