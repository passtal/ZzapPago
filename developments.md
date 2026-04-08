# 짭파고 (ZzapPago) — 개발 일지

> 개발 과정에서의 진행 상황, 의사결정, 이슈 및 해결 내역을 기록합니다.

---

## 📅 개발 타임라인

| 주차 | 기간 | 주요 작업 | 상태 |
|:---:|:---:|:---|:---:|
| Week 1 | 2026.04.06 ~ 04.10 | 프로젝트 기획 + 환경 구축 + 공통 인프라 | ✅ 완료 |
| Week 2 | 2026.04.13 ~ | 개별 기능 개발 시작 | ⬜ 예정 |
| Week 3 | TBD | 개별 기능 개발 (STT, TTS, WebSocket 등) | ⬜ 예정 |
| Week 4 | TBD | 핵심 번역 엔진 구현 | ⬜ 예정 |
| Week 5 | TBD | 음성 인식 (STT) / 음성 합성 (TTS) | ⬜ 예정 |
| Week 6 | TBD | 실시간 번역 (WebSocket) | ⬜ 예정 |
| Week 7 | TBD | 번역 내역 / 내보내기 기능 | ⬜ 예정 |
| Week 8 | TBD | 학습 카드 / 퀴즈 / 미니게임 | ⬜ 예정 |
| Week 9 | TBD | 랭킹 시스템 / 유료 회원 기능 | ⬜ 예정 |
| Week 10 | TBD | UI 완성 / 테스트 / 배포 | ⬜ 예정 |

---

<br>

## 📝 개발 일지

---

### 2026.04.06 (Day 1) — 프로젝트 킥오프

#### ✅ 완료 항목
- [x] 프로젝트 기획 및 기능 정의
- [x] 기술 스택 선정 (FastAPI + React 19 + MySQL)
- [x] 아키텍처 구조 설계
- [x] README.md 작성 (Durudurub 스타일)
- [x] 개발 일지 (developments.md) 생성

#### 📌 의사결정 사항

| 결정 사항 | 선택 | 이유 |
|:---|:---|:---|
| 백엔드 프레임워크 | FastAPI | 비동기 처리, 자동 API 문서화, Python AI 생태계 호환 |
| 프론트엔드 프레임워크 | React 19 + Vite + TypeScript | SPA 구축, 빠른 빌드, 타입 안전성 |
| 데이터베이스 | MySQL + Redis | Durudurub 프로젝트에서 사용 경험 있는 DB + 캐싱/세션 관리 |
| 음성 인식 (STT) | Whisper (OpenAI) + CUDA | 고품질 STT, GPU 가속 지원 |
| 번역 엔진 | OpenAI GPT API | 프롬프팅 기반 목적별 맞춤 번역 가능 |
| 음성 합성 (TTS) | gTTS + Web Speech API | 서버/클라이언트 이중 지원 |
| 인증 | JWT (PyJWT) | Stateless 인증, 확장성 |
| 파일 생성 | ReportLab / python-docx / Pillow | Python 네이티브 라이브러리로 PDF/Word/IMG 지원 |
| 실시간 통신 | FastAPI WebSocket | 실시간 번역 스트리밍 |

#### 🔍 기능 우선순위 (MoSCoW)

**Must Have (핵심)**
- 텍스트 번역 (입력 → 번역 결과 출력)
- 음성 인식 (STT → 텍스트 변환)
- 번역 결과 낭독 (TTS)
- 언어 선택 (출발어 ↔ 도착어)
- 번역 내역 저장 및 조회
- 사용자 인증 (회원가입/로그인/JWT)

**Should Have (중요)**
- 실시간 번역 (WebSocket 스트리밍)
- GPS 기반 언어 자동 감지
- 번역 내역 PDF/Word/IMG 내보내기
- 번역 목적 설정 (여행/비즈니스/일상)

**Could Have (부가)**
- 학습 카드 (번역 내역 → 카드형 퀴즈)
- 미니게임 (단어 맞추기, 문장 완성)
- 랭킹 시스템

**Won't Have (이번 버전 제외)**
- Flutter 앱 변환 (옵션 2)
- MCP 함수 서버 (옵션 1)
- 결제 시스템 (유료 회원)

#### 🛠️ 다음 할 일
- [x] 프로젝트 폴더 구조 생성 (backend / frontend)
- [x] FastAPI 초기 설정 및 Hello World
- [x] React + Vite 프로젝트 초기화
- [x] MySQL DB 설계 (DDL 작성)
- [ ] Docker Compose 구성
- [ ] .env.example 환경변수 파일 생성

---

### 2026.04.07 (Day 2) — 환경 구축 및 메인 페이지 구현

#### ✅ 완료 항목
- [x] 프로젝트 폴더 구조 생성 (backend/app, frontend/src 하위 디렉토리)
- [x] Backend: Python venv 생성, requirements.txt 작성 및 패키지 설치
- [x] Backend: FastAPI main.py 초기 설정 + CORS 미들웨어
- [x] Backend: config/ 설정 (settings.py, database.py) — MySQL 연결
- [x] Frontend: React 19 + Vite + TypeScript + Tailwind CSS 프로젝트 초기화
- [x] Frontend: 메인 페이지 UI 구현 (Navbar, HomePage, LanguageSelector, TranslateInput, TranslateOutput)
- [x] Backend: 번역 API 구현 (POST /api/v1/translate, GET /api/v1/translate/history)
- [x] Backend: OpenAI GPT-4o-mini 기반 번역 서비스 (translate_service.py)
- [x] Frontend: Axios API 클라이언트 + Vite 프록시 설정 (/api → localhost:8000)
- [x] Frontend ↔ Backend 실제 API 연동 확인
- [x] .env 환경변수 설정 (DB, OpenAI API Key)

#### 📌 의사결정 사항

| 결정 사항 | 선택 | 이유 |
|:---|:---|:---|
| 데이터베이스 | MySQL (PostgreSQL → 변경) | Durudurub 프로젝트에서 MySQL 사용 경험, 팀 익숙도 |
| ORM | SQLAlchemy 2.0 | FastAPI 공식 권장, 비동기 지원 |
| 프론트 빌드 | Vite 8.0 | CRA 대비 10배 빠른 빌드 속도 |
| 다크 테마 | 기본 다크 + emerald/sky 포인트 | 번역 서비스 특성상 장시간 사용에 적합 |

#### 🛠️ 다음 할 일
- [ ] MySQL DDL 설계 (테이블 구조 확정)
- [ ] SQLAlchemy 모델 전체 동기화
- [ ] Pydantic 스키마 확장

---

### 2026.04.08 (Day 3) — DB 설계 확정 및 모델 동기화

#### ✅ 완료 항목
- [x] MySQL DDL 설계 — 4개 테이블: translations, exports, rankings, quiz_scores
- [x] 개별 SQL 파일 생성 (DB/translations.sql, exports.sql, rankings.sql, quiz_scores.sql)
- [x] 로그인/회원가입 기능 Phase 2로 연기 → users 테이블 제거, user_id FK 전부 삭제
- [x] rankings, quiz_scores 테이블 → nickname(VARCHAR 50) 기반으로 변경
- [x] translations 테이블에 input_type, latitude, longitude, country_code 컬럼 추가
- [x] SQLAlchemy 모델 전체 동기화 완료
  - Translation 모델: 새 컬럼(input_type, latitude, longitude, country_code) 추가
  - Export 모델 신규 생성 (models/export.py)
  - Ranking 모델 신규 생성 (models/ranking.py)
  - QuizScore 모델 신규 생성 (models/quiz_score.py)
- [x] models/__init__.py — 4개 모델 전부 임포트 등록
- [x] Pydantic 스키마 동기화 및 신규 생성
  - TranslateRequest/TranslationRecord: input_type, latitude, longitude, country_code 추가
  - ExportRequest/ExportResponse 스키마 생성 (schemas/export.py)
  - RankingResponse, QuizScoreRequest/QuizScoreResponse 스키마 생성 (schemas/ranking.py)
- [x] translate_service.py — 새 컬럼(input_type, 위치 정보) 저장 반영
- [x] main.py — 전체 모델 임포트로 create_all() 반영
- [x] DB 테이블 자동 생성 테스트 통과 (4개 테이블 확인)
- [x] README.md 업데이트 (auth 관련 제거, 향후 확장 계획에 Phase 2 회원 시스템 추가)

#### 📌 의사결정 사항

| 결정 사항 | 선택 | 이유 |
|:---|:---|:---|
| 회원 시스템 | Phase 2로 연기 | 핵심 번역 기능 우선 개발, 로그인 없이도 서비스 가능 |
| 사용자 식별 | nickname 기반 | users 테이블 없이 랭킹/퀴즈 점수 관리 가능 |
| exports FK | translations(id) ON DELETE CASCADE | 번역 삭제 시 관련 내보내기도 자동 삭제 |

#### 🏁 공통 인프라 작업 완료 확인

| 공통 항목 | 상태 |
|:---|:---:|
| 프로젝트 폴더 구조 | ✅ |
| Backend 환경 (venv, FastAPI, Uvicorn) | ✅ |
| Frontend 환경 (React 19, Vite, TS, Tailwind) | ✅ |
| .env 환경변수 | ✅ |
| MySQL DB + DDL (4 테이블) | ✅ |
| SQLAlchemy 모델 전체 동기화 | ✅ |
| Pydantic 스키마/DTO 전체 생성 | ✅ |
| 메인 페이지 UI | ✅ |
| 번역 API + 프론트 연동 | ✅ |
| Vite 프록시 설정 | ✅ |

> ✅ **공통 인프라 작업 완료 — 이후 개별 기능 개발 진행**

#### 🛠️ 다음 할 일 (개별 기능 개발)

**최영우 담당**
- [ ] 음성 인식 (STT) — Whisper/Web Speech API 연동
- [ ] 위치 기반 번역 — Geolocation API + country_code 매핑
- [ ] 실시간 번역 — WebSocket 엔드포인트 구현
- [ ] 내보내기 — PDF(ReportLab) / Word(python-docx) / IMG(Pillow)
- [ ] 랭킹 시스템 — 랭킹 API + 프론트 UI

**정성준 담당**
- [ ] 텍스트 번역 고도화 (목적별 프롬프팅)
- [ ] 번역 내역 조회/관리 UI
- [ ] TTS (gTTS + Web Speech API)
- [ ] 학습 카드 UI + 퀴즈 로직
- [ ] 미니게임 (단어 맞추기, 문장 완성)

---

<br>

## 🐛 이슈 & 해결 로그

> 개발 중 발생한 이슈와 해결 방법을 기록합니다.

| # | 날짜 | 이슈 | 원인 | 해결 방법 | 상태 |
|:---:|:---:|:---|:---|:---|:---:|
| 1 | 04.07 | Frontend dev server가 workspace root에서 실행 실패 | Background terminal은 항상 workspace root에서 시작 | `npm --prefix <frontend-path> run dev` 로 실행 | ✅ 해결 |
| 2 | 04.07 | VS Code에서 TypeScript import 에러 표시 | VS Code 내장 TS(5.x)가 프로젝트 TS 6.0 대신 사용됨 | `.vscode/settings.json`에 `typescript.tsdk` 설정 | ✅ 해결 |
| 3 | 04.07 | settings.py에서 .env 파일 로드 실패 | `../.env` 상대경로가 background terminal에서 다르게 해석 | `Path(__file__).resolve().parents[3] / ".env"` 절대경로 사용 | ✅ 해결 |
| 4 | 04.07 | pydantic Settings 초기화 시 extra field 에러 | .env에 REDIS_HOST/PORT 등 Settings에 없는 변수 존재 | `model_config`에 `extra = "ignore"` 추가 | ✅ 해결 |

---

<br>

## 📦 의존성 변경 로그

> 추가/제거/업데이트된 주요 패키지를 기록합니다.

### Backend (Python)
| 날짜 | 패키지 | 버전 | 변경 유형 | 사유 |
|:---:|:---|:---:|:---:|:---|
| 04.07 | fastapi | 0.115.14 | 추가 | 백엔드 웹 프레임워크 |
| 04.07 | uvicorn | 0.34.3 | 추가 | ASGI 서버 |
| 04.07 | sqlalchemy | 2.0.49 | 추가 | ORM (MySQL 연동) |
| 04.07 | pymysql | 1.1.2 | 추가 | MySQL 드라이버 |
| 04.07 | pydantic-settings | 2.13 | 추가 | 환경변수 관리 |
| 04.07 | openai | 1.109.1 | 추가 | GPT API 번역 엔진 |
| 04.07 | python-dotenv | 1.1.1 | 추가 | .env 파일 로드 |
| 04.07 | passlib | 1.7.4 | 추가 | 비밀번호 해싱 (향후 사용) |

### Frontend (npm)
| 날짜 | 패키지 | 버전 | 변경 유형 | 사유 |
|:---:|:---|:---:|:---:|:---|
| 04.07 | react | 19.2.4 | 추가 | UI 프레임워크 |
| 04.07 | vite | 8.0.4 | 추가 | 빌드 도구 |
| 04.07 | typescript | 6.0.2 | 추가 | 타입 안전성 |
| 04.07 | tailwindcss | 4.2.2 | 추가 | 유틸리티 CSS |
| 04.07 | react-router-dom | 7.14.0 | 추가 | 클라이언트 라우팅 |
| 04.07 | axios | 1.14.0 | 추가 | HTTP 클라이언트 |
| 04.07 | lucide-react | - | 추가 | 아이콘 라이브러리 |

---

<br>

## 💡 아이디어 & 메모

### 번역 프롬프팅 전략
- 목적별 시스템 프롬프트 분리 (여행, 비즈니스, 일상, 학술 등)
- 예시: `"You are a professional travel interpreter. Translate the following naturally for a tourist visiting Japan: ..."`
- 오픈소스 번역 모델 (emo module 등) 활용 검토

### 학습 카드 아이디어
- 번역했던 문장을 기반으로 자동 퀴즈 생성
- 예: "당신이 마음에 듭니다. 2차 갈래요?" → 일본어 번역 → 나중에 카드형 퀴즈로 등장
- 스페이스드 리피티션 (간격 반복) 알고리즘 적용 검토

### 랭킹 시스템 아이디어
- 번역 횟수, 학습 점수 기반 랭킹
- 주간/월간 TOP 3 → 혜택 제공 (프리미엄 기능 무료 이용 등)
- 포트폴리오 목적으로도 활용 가능한 시각적 대시보드

### 내보내기 기능
- Python으로 PPT, PDF, Word 등 MS Office 호환 문서 생성 가능
- `ReportLab` (PDF), `python-docx` (Word), `python-pptx` (PPT), `Pillow` (이미지)
- 번역 내역 묶어서 PDF 다운로드 → "나만의 회화 노트" 컨셉

---

<br>

## 📊 주간 회고

> 매주 금요일 또는 주말에 작성합니다.

### Week 1 회고 (2026.04.06 ~ 2026.04.10)

