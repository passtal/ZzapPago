# 짭파고 (ZzapPago) — 개발 일지

> 개발 과정에서의 진행 상황, 의사결정, 이슈 및 해결 내역을 기록합니다.

---

## 📅 개발 타임라인

| 주차 | 기간 | 주요 작업 | 상태 |
|:---:|:---:|:---|:---:|
| Week 1 | 2026.04.06 ~ | 프로젝트 기획 및 아키텍처 설계 | 🔄 진행중 |
| Week 2 | TBD | 환경 구축 (FastAPI + React + DB) | ⬜ 예정 |
| Week 3 | TBD | 인증 시스템 (JWT) / 사용자 관리 | ⬜ 예정 |
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
- [ ] 프로젝트 폴더 구조 생성 (backend / frontend)
- [ ] FastAPI 초기 설정 및 Hello World
- [ ] React + Vite 프로젝트 초기화
- [ ] PostgreSQL DB 설계 (ERD 작성)
- [ ] Docker Compose 구성
- [ ] .env.example 환경변수 파일 생성

---

<br>

## 🐛 이슈 & 해결 로그

> 개발 중 발생한 이슈와 해결 방법을 기록합니다.

| # | 날짜 | 이슈 | 원인 | 해결 방법 | 상태 |
|:---:|:---:|:---|:---|:---|:---:|
| - | - | _아직 기록된 이슈 없음_ | - | - | - |

---

<br>

## 📦 의존성 변경 로그

> 추가/제거/업데이트된 주요 패키지를 기록합니다.

### Backend (Python)
| 날짜 | 패키지 | 버전 | 변경 유형 | 사유 |
|:---:|:---|:---:|:---:|:---|
| 2026.04.06 | _초기 설정 예정_ | - | - | - |

### Frontend (npm)
| 날짜 | 패키지 | 버전 | 변경 유형 | 사유 |
|:---:|:---|:---:|:---:|:---|
| 2026.04.06 | _초기 설정 예정_ | - | - | - |

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

### Week 1 회고 (2026.04.06 ~)
> 🚧 주말에 작성 예정
