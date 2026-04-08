from sqlalchemy import Column, Integer, String, DateTime, func
from app.config.database import Base


class Ranking(Base):
    __tablename__ = "rankings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nickname = Column(String(50), nullable=False, unique=True)
    total_score = Column(Integer, nullable=False, default=0)
    translate_count = Column(Integer, nullable=False, default=0)
    quiz_score = Column(Integer, nullable=False, default=0)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
