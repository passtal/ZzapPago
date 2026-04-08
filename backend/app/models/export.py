from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from app.config.database import Base


class Export(Base):
    __tablename__ = "exports"

    id = Column(Integer, primary_key=True, autoincrement=True)
    translation_id = Column(Integer, ForeignKey("translations.id", ondelete="CASCADE"), nullable=False)
    format = Column(String(10), nullable=False)
    file_path = Column(String(500), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
