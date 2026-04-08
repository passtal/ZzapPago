from sqlalchemy import Column, Integer, String, DateTime, func
from app.config.database import Base


class QuizScore(Base):
    __tablename__ = "quiz_scores"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nickname = Column(String(50), nullable=False)
    quiz_type = Column(String(30), nullable=False)
    score = Column(Integer, nullable=False, default=0)
    played_at = Column(DateTime, server_default=func.now(), nullable=False)
