# 짭파고 (ZzapPago) — 개발 일지

> 개발 과정에서의 진행 상황, 의사결정, 이슈 및 해결 내역을 기록합니다.

---

## 📅 개발 타임라인

| 주차 | 기간 | 주요 작업 | 상태 |
|:---:|:---:|:---|:---:|
| Week 1 | 2026.04.06 ~ 04.10 | 프로젝트 기획 + 환경 구축 + 공통 인프라 | ✅ 완료 |
| Week 2 | 2026.04.13 ~ 04.20 | 개별 기능 개발 (STT, 미니게임, 학습 카드, 퀴즈 점수, 랭킹, 실시간 번역, 위치 기반 번역, 내보내기) | ✅ 완료 |
| Week 3 | TBD | TTS, 암기 판별 게임 완성, 통합 테스트 | ⬜ 예정 |
| Week 4 | TBD | UI 완성 / 테스트 / 배포 | ⬜ 예정 |

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
- [x] Docker Compose 구성
- [x] .env.example 환경변수 파일 생성

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
- [x] MySQL DDL 설계 (테이블 구조 확정)
- [x] SQLAlchemy 모델 전체 동기화
- [x] Pydantic 스키마 확장

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
- [x] 음성 인식 (STT) — Backend API + Frontend 녹음 UI 구현
- [ ] 위치 기반 번역 — Geolocation API + country_code 매핑
- [ ] 실시간 번역 — WebSocket 엔드포인트 구현
- [ ] 내보내기 — PDF(ReportLab) / Word(python-docx) / IMG(Pillow)
- [ ] 랭킹 시스템 — 랭킹 API + 프론트 UI

**정성준 담당**
- [x] 텍스트 번역 고도화 (목적별 프롬프팅)
- [x] 번역 내역 조회/관리 UI
- [ ] TTS (gTTS + Web Speech API)
- [x] 학습 카드 UI + 퀴즈 로직
- [x] 미니게임 — 짝맞추기 완성, 암기 판별 작성 중

---

### 2026.04.16 (Day 4) — STT 음성 인식 구현 + 팀 브랜치 병합

#### ✅ 완료 항목 (최영우)
- [x] 로고 이미지 적용 — `docs/images/zzappago.png`를 `frontend/public/logo.png`로 배치
- [x] Navbar 로고: 텍스트만 "짭파고" 스타일로 정리 (이미지 로고는 이질적이라 제거)
- [x] HomePage 히어로 영역에 앵무새 로고 이미지(112px) 배치
- [x] Backend STT API 구현
  - `app/services/stt_service.py` — OpenAI Whisper API 연동 (`whisper-1` 모델)
  - `app/schemas/stt.py` — STTResponse 스키마
  - `app/api/v1/stt.py` — `POST /api/v1/stt/` 엔드포인트 (파일 업로드 + 언어 코드)
  - `main.py`에 stt_router 등록
- [x] Frontend 음성 입력 기능 구현
  - `hooks/useVoiceRecorder.ts` — MediaRecorder 기반 마이크 녹음 커스텀 훅 (mimeType 자동 감지)
  - `api/stt.ts` — STT API 호출 함수 (FormData 멀티파트 업로드)
  - `components/translate/VoiceInput.tsx` — 녹음 버튼 UI (녹음/중지/처리 상태 표시)
  - `HomePage.tsx` — 음성 탭 활성화 시 VoiceInput 컴포넌트 표시, 인식 후 자동 번역
- [x] Vite 서버 `host: true` 설정 — 모바일 테스트용 네트워크 접속 허용
- [x] `python-multipart` 패키지 추가 — FastAPI 파일 업로드에 필수 의존성

#### ✅ 완료 항목 (정성준 — 병합)
- [x] 학습 카드 기능 병합
  - `models/learning_cards.py` — LearningCard 모델
  - `schemas/learning_card.py` — CRUD 스키마 (Create/Update/Response)
  - `services/learning_card_service.py` — 학습 카드 서비스 로직
  - `api/v1/learning_card.py` — GET/POST/PATCH 엔드포인트
  - `pages/LearningCardsPage.tsx` — 학습 카드 페이지 UI
- [x] 번역 내역 페이지 고도화 (HistoryPage.tsx)
- [x] Navbar에 "학습 카드" 메뉴 추가
- [x] App.tsx 라우트 추가 (`/learning-cards`)

#### 🐛 이슈 발생 & 해결
- **python-multipart 미설치**: STT API의 `File()`, `Form()` 사용에 필요 → 서버 시작 시 크래시 → `pip install python-multipart`로 해결
- **로고 이미지 import 경로 에러**: `../../../docs/images/zzappago.png` Vite 루트 밖 → `public/logo.png`로 복사하여 해결
- **mimeType 호환성**: `"audio/webm; codecs=opus"` 공백 포함 시 일부 브라우저 미지원 → `MediaRecorder.isTypeSupported()` 자동 감지로 변경

#### 📌 의사결정 사항

| 결정 사항 | 선택 | 이유 |
|:---|:---|:---|
| STT 엔진 | OpenAI Whisper API (`whisper-1`) | 이미 OpenAI 의존성 있음, 고품질 다국어 STT |
| 녹음 방식 | MediaRecorder API (브라우저 네이티브) | 별도 라이브러리 불필요, webm/opus 형식 지원 |
| Navbar 로고 | 텍스트만 "짭파고" | 캐릭터 이미지가 36px 축소 시 이질적, 히어로 영역에서 대형 표시 |

#### 🛠️ 다음 할 일
- [ ] STT 실제 마이크 테스트 (모바일 환경)
- [ ] 위치 기반 번역 구현
- [ ] 실시간 번역 (WebSocket)
- [ ] 내보내기 기능 (PDF/Word/IMG)
- [ ] 랭킹 시스템

---

### 2026.04.16 ~ 04.20 (Day 5~6) — 미니게임 + 퀴즈 점수 + UI 리팩토링 (정성준)

#### ✅ 완료 항목 (정성준)
- [x] 미니게임 페이지 구현 (GamePage.tsx)
  - "짝맞추기" / "암기 판별" 두 가지 게임 모드 탭 UI
  - 학습 카드 데이터 기반 게임 카드 로드
- [x] 짝맞추기 게임 구현 (MatchGame.tsx)
  - 학습 카드 6쌍(12타일) 셔플 → 원문/번역 짝 맞추기
  - 타이머(경과 시간) + 틀림 페널티(+1초) + 점수 계산(100 - 경과 - 페널티)
  - 진행률 프로그레스 바 (진행 n/6, n%)
  - 게임 완료 시 결과 모달 (경과 시간, 페널티, 최종 기록, 점수, 최고 점수)
  - 점수 자동 저장 (quiz_scores 테이블) + 최고 점수 갱신 로직
  - "다시 섞기" 버튼으로 게임 리셋
- [x] 암기 판별 게임 (SwipeGame.tsx) — 스켈레톤 생성 (작성 중)
- [x] 퀴즈 점수 Backend API 구현
  - `app/api/v1/quiz_score.py` — `POST /api/v1/quiz-score/create` 엔드포인트
  - `app/services/quiz_score_service.py` — 점수 저장/갱신 서비스 (기존 최고 점수보다 높을 때만 업데이트)
  - `app/schemas/ranking.py` — QuizScoreRequest/QuizScoreResponse 스키마
  - `main.py`에 quiz_score_router 등록
- [x] QuizScore 모델에 UniqueConstraint 추가 (nickname + quiz_type 복합 유니크)
- [x] Frontend API 클라이언트 추가
  - `api/quizScore.ts` — `saveBestQuizScore()` 함수
  - `api/learningCard.ts` — CRUD API 클라이언트 (create/read/update)
- [x] App.tsx 라우트 추가 (`/game` → GamePage)
- [x] Navbar에 "미니게임" 메뉴 추가 (Gamepad2 아이콘)
- [x] UI 리팩토링
  - `MainLayout.tsx` — 공통 레이아웃 (Navbar + Outlet) 분리
  - `ParrotLogo.tsx` — SVG 앵무새 로고 컴포넌트 생성
  - `utils/languages.ts` — 언어 코드/라벨 유틸리티 (LANGUAGES, getLangLabel)
  - Navbar 모바일 대응 (햄버거 메뉴 + 드롭다운)
- [x] 번역 내역 페이지 고도화 (HistoryPage.tsx)
  - input_type별 필터 (텍스트/음성/문서/웹사이트)
  - 날짜별 그룹핑 (오늘/어제/yyyy년 m월 d일)
  - 접기/펼치기 아코디언 UI
  - "학습 카드로 저장" 버튼 (중복 저장 방지)
- [x] 학습 카드 페이지 고도화 (LearningCardsPage.tsx)
  - 암기 전/암기 완료 필터
  - 암기 상태 토글 버튼
  - 암기 완료 카운터 (n/전체)

#### 📌 의사결정 사항

| 결정 사항 | 선택 | 이유 |
|:---|:---|:---|
| 퀴즈 점수 저장 방식 | nickname+quiz_type 유니크 (최고 점수만 유지) | 랭킹 집계 용이, 불필요한 레코드 방지 |
| 게임 점수 계산 | 100 - 경과시간(초) - 페널티(초) | 빨리 + 정확하게 맞출수록 높은 점수 |
| 레이아웃 분리 | MainLayout + Outlet | 공통 Navbar 중복 제거, 라우트 구조 개선 |

#### 🛠️ 다음 할 일

**최영우 담당**
- [x] 랭킹 시스템 — 랭킹 API + 프론트 UI ✅ (04.20)
- [x] 실시간 번역 — WebSocket 엔드포인트 구현 ✅ (04.20)
- [x] 위치 기반 번역 — Geolocation API + country_code 매핑 ✅ (04.20)
- [x] 내보내기 — PDF(ReportLab) / Word(python-docx) / IMG(Pillow) ✅ (04.20)

**정성준 담당**
- [ ] TTS (gTTS + Web Speech API)
- [ ] SwipeGame (암기 판별 게임) 완성

---

### 2026.04.20 (Day 7) — 랭킹 + 실시간 번역 + 위치 기반 번역 + 내보내기 구현 (최영우)

#### ✅ 완료 항목

**1. 랭킹 시스템**
- [x] Backend 랭킹 서비스 구현 (`services/ranking_service.py`)
  - `get_rankings()` — total_score 기준 TOP N 랭킹 조회
  - `refresh_ranking()` — 닉네임 기준 전체 점수 재계산
  - `update_ranking_translate_count()` — 번역 횟수 +1 증가
  - `update_ranking_quiz_score()` — quiz_scores 테이블에서 합계 재계산
  - Ranking 레코드 미존재 시 자동 생성
- [x] Backend 랭킹 API (`api/v1/ranking.py`)
  - `GET /api/v1/rankings/` — 랭킹 목록 조회 (limit 파라미터)
  - `POST /api/v1/rankings/translate/{nickname}` — 번역 횟수 업데이트
  - `POST /api/v1/rankings/quiz/{nickname}` — 퀴즈 점수 재계산
- [x] 퀴즈 점수 저장 시 랭킹 자동 갱신 연동 (`quiz_score_service.py` 수정)
- [x] Frontend 랭킹 API 클라이언트 (`api/ranking.ts`)
- [x] Frontend 랭킹 페이지 (`pages/RankingPage.tsx`)
  - TOP 3 하이라이트 카드 (🥇🥈🥉 + 총점/번역횟수/퀴즈점수)
  - 전체 랭킹 테이블 (순위/닉네임/점수 컬럼)
- [x] App.tsx 라우트 추가 (`/ranking` → RankingPage)

**2. 실시간 번역 (WebSocket)**
- [x] Backend WebSocket 핸들러 (`websocket/realtime_translate.py`)
  - JSON 수신 `{ text, source_lang, target_lang }` → GPT-4o-mini 번역 → JSON 응답
  - WebSocketDisconnect 예외 처리
- [x] main.py에 WebSocket 엔드포인트 등록 (`/ws/translate`)
- [x] Frontend WebSocket 커스텀 훅 (`hooks/useRealtimeTranslate.ts`)
  - `ws://host/ws/translate` 자동 연결/재연결
  - 500ms 디바운스로 입력 최적화
  - `{ translatedText, isConnected, sendText }` 반환
- [x] HomePage에 "실시간" 탭 추가 (Zap 아이콘)
  - 연결 상태 인디케이터 (초록/빨강 점)
  - 실시간 입력 textarea + 번역 결과 표시
- [x] Vite 프록시에 `/ws` WebSocket 프록시 추가 (`ws: true`)

**3. 위치 기반 번역 (GPS Geolocation)**
- [x] Frontend Geolocation 커스텀 훅 (`hooks/useGeoLocation.ts`)
  - 브라우저 Geolocation API로 GPS 좌표(위도/경도) 획득
  - OpenStreetMap Nominatim 역지오코딩으로 국가 코드 파악 (무료 API)
  - 국가 코드 → 언어 코드 자동 매핑 (26개국 지원: KR→ko, US→en, JP→ja 등)
  - 에러 핸들링 (권한 거부, 위치 불가, 타임아웃)
- [x] HomePage 언어 선택 바에 위치 감지 버튼 추가 (MapPin 아이콘)
  - 클릭 시 GPS 좌표 획득 → 국가 코드 감지 → 출발어 자동 설정
  - 감지 중 로딩 애니메이션 + 감지 완료 시 국가 코드 표시
- [x] 번역 요청 시 위치 정보(latitude, longitude, country_code) 함께 전송
- [x] Frontend TranslateRequest 타입에 위치 필드 추가 (`api/translate.ts`)
- [x] Backend는 기존에 이미 지원 (TranslateRequest 스키마 + translate_service.py에서 DB 저장)

**4. 내보내기 (PDF / Word / IMG)**
- [x] Backend 내보내기 서비스 (`services/export_service.py`)
  - `export_as_pdf()` — ReportLab 기반 PDF 생성 (한글 폰트 자동 감지, A4 레이아웃)
  - `export_as_word()` — python-docx 기반 Word 문서 생성 (제목/원문/번역문 섹션)
  - `export_as_img()` — Pillow 기반 PNG 이미지 생성 (짭파고 브랜딩 헤더, #1ec800 포인트컬러)
  - 파일 저장 경로: `backend/exports/` 디렉토리 자동 생성
- [x] Backend 내보내기 API (`api/v1/export.py`)
  - `POST /api/v1/exports/` — 내보내기 생성 (translation_id + format)
  - `GET /api/v1/exports/download/{export_id}` — 파일 다운로드 (FileResponse)
- [x] main.py에 export_router 등록
- [x] Frontend 내보내기 API 클라이언트 (`api/export.ts`)
  - `createExport()` — 내보내기 생성 요청
  - `getExportDownloadUrl()` — 다운로드 URL 생성
- [x] HistoryPage에 내보내기 버튼 추가
  - 번역 기록 펼침 영역에 PDF / WORD / IMG 버튼 3개
  - 클릭 시 파일 생성 + 자동 다운로드 트리거
  - 로딩 상태 표시 (버튼별 개별 로딩)
- [x] requirements.txt에 내보내기 패키지 추가 (reportlab, python-docx, Pillow)

#### 📌 의사결정 사항

| 결정 사항 | 선택 | 이유 |
|:---|:---|:---|
| 랭킹 점수 계산 | total_score = translate_count + quiz_score | 번역 사용량 + 학습 성과 모두 반영 |
| 실시간 번역 방식 | FastAPI native WebSocket + GPT-4o-mini | 추가 라이브러리 불필요, 기존 인프라 활용 |
| 디바운스 시간 | 500ms | 너무 잦은 API 호출 방지 + 체감 지연 최소화 |
| 역지오코딩 API | OpenStreetMap Nominatim | 무료, API 키 불필요, 정확도 충분 |
| 위치 감지 UI | 출발어 옆 작은 버튼 | 자동 실행이 아닌 사용자 주도 감지 (권한 요청 UX 고려) |
| 내보내기 파일 저장 | 서버 로컬 `backend/exports/` | 간단한 구현, 추후 클라우드 스토리지로 확장 가능 |
| PDF 한글 폰트 | Windows malgun.ttf / Linux NanumGothic 자동 감지 | OS별 호환성 확보 |

#### 📂 생성/수정된 파일 목록

| 파일 | 유형 | 설명 |
|:---|:---:|:---|
| `backend/app/services/ranking_service.py` | 신규 | 랭킹 비즈니스 로직 |
| `backend/app/api/v1/ranking.py` | 신규 | 랭킹 API 엔드포인트 |
| `backend/app/websocket/realtime_translate.py` | 신규 | WebSocket 실시간 번역 핸들러 |
| `backend/app/services/export_service.py` | 신규 | 내보내기 서비스 (PDF/Word/IMG) |
| `backend/app/api/v1/export.py` | 신규 | 내보내기 API 엔드포인트 |
| `backend/app/main.py` | 수정 | ranking/export 라우터 + WebSocket 엔드포인트 등록 |
| `backend/app/services/quiz_score_service.py` | 수정 | 퀴즈 저장 시 랭킹 자동 갱신 추가 |
| `backend/requirements.txt` | 수정 | reportlab, python-docx, Pillow 추가 |
| `frontend/src/hooks/useRealtimeTranslate.ts` | 신규 | WebSocket 실시간 번역 훅 |
| `frontend/src/hooks/useGeoLocation.ts` | 신규 | GPS 위치 감지 + 역지오코딩 훅 |
| `frontend/src/api/ranking.ts` | 신규 | 랭킹 API 클라이언트 |
| `frontend/src/api/export.ts` | 신규 | 내보내기 API 클라이언트 |
| `frontend/src/pages/RankingPage.tsx` | 신규 | 랭킹 페이지 UI |
| `frontend/src/pages/HomePage.tsx` | 수정 | 실시간 탭 + 위치 감지 버튼 추가 |
| `frontend/src/pages/HistoryPage.tsx` | 수정 | 내보내기 버튼 (PDF/WORD/IMG) 추가 |
| `frontend/src/api/translate.ts` | 수정 | TranslateRequest에 위치 필드 추가 |
| `frontend/src/App.tsx` | 수정 | /ranking 라우트 추가 |
| `frontend/vite.config.ts` | 수정 | /ws WebSocket 프록시 추가 |

#### 🛠️ 다음 할 일

**최영우 담당** — ✅ 전체 완료
- [x] 랭킹 시스템
- [x] 실시간 번역 (WebSocket)
- [x] 위치 기반 번역 (GPS)
- [x] 내보내기 (PDF/Word/IMG)

**정성준 담당**
- [ ] TTS (gTTS + Web Speech API)
- [ ] SwipeGame (암기 판별 게임) 완성

**공통**
- [ ] 통합 테스트 (전체 기능 동작 확인)
- [ ] Docker Compose 빌드 테스트
- [ ] UI 최종 점검

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
| 5 | 04.16 | 백엔드 서버 시작 시 크래시 (RuntimeError) | STT API의 `File()`, `Form()`에 python-multipart 필요 | `pip install python-multipart`, requirements.txt에 추가 | ✅ 해결 |
| 6 | 04.16 | 로고 이미지 import 실패 (vite:import-analysis) | `../../../docs/images/` 경로가 Vite 루트 밖 | `frontend/public/logo.png`로 복사, 절대 경로 `/logo.png` 사용 | ✅ 해결 |
| 7 | 04.16 | MediaRecorder mimeType 미지원 에러 | `"audio/webm; codecs=opus"` 공백 포함 시 브라우저 호환 문제 | `MediaRecorder.isTypeSupported()` 로 자동 감지 | ✅ 해결 |

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
| 04.16 | python-multipart | 0.0.26 | 추가 | FastAPI 파일 업로드 (STT 음성 파일) |
| 04.20 | reportlab | 4.* | 추가 | PDF 내보내기 생성 |
| 04.20 | python-docx | 1.* | 추가 | Word(docx) 내보내기 생성 |
| 04.20 | Pillow | 11.* | 추가 | 이미지(PNG) 내보내기 생성 |

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