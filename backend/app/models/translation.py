from sqlalchemy import Column, Integer, String, Text, DateTime, Numeric, func
from app.config.database import Base


class Translation(Base):
    __tablename__ = "translations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_lang = Column(String(10), nullable=False)
    target_lang = Column(String(10), nullable=False)
    source_text = Column(Text, nullable=False)
    translated_text = Column(Text, nullable=False)
    input_type = Column(String(10), nullable=False, default="text")
    latitude = Column(Numeric(10, 7), nullable=True)
    longitude = Column(Numeric(10, 7), nullable=True)
    country_code = Column(String(5), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
