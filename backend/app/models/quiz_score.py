from sqlalchemy import Column, DateTime, Integer, String, UniqueConstraint, func
from app.config.database import Base


class QuizScore(Base):
    __tablename__ = "quiz_scores"
    __table_args__ = (
        UniqueConstraint("nickname", "quiz_type", name="uq_quiz_scores_nickname_quiz_type"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    nickname = Column(String(50), nullable=False)
    quiz_type = Column(String(30), nullable=False)
    score = Column(Integer, nullable=False, default=0)
    played_at = Column(DateTime, server_default=func.now(), nullable=False)
