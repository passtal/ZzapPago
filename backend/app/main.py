from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import engine, Base
from app.models import Translation, Export, Ranking, QuizScore, LearningCard  # noqa: F401
from app.api.v1.translate import router as translate_router
from app.api.v1.stt import router as stt_router
from app.api.v1.learning_card import router as learning_card_router

# DB 테이블 자동 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ZzapPago API",
    description="AI 음성 인식 번역 서비스",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(translate_router, prefix="/api/v1")
app.include_router(learning_card_router, prefix="/api/v1")
app.include_router(stt_router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "ZzapPago API is running"}
