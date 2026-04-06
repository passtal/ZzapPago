# **프로젝트 : 짭파고 (ZzapPago)** 🌐

<p align="center">
  <img src="./docs/images/banner.png" width="600" alt="짭파고 대표 이미지">
</p>

> **특정 목적에 최적화된 프로페셔널 AI 음성 인식 번역 웹 서비스**
>
> 음성 인식 · 실시간 번역 · 텍스트 낭독 · 학습 카드 · 랭킹 시스템까지 올인원 번역 플랫폼

<br>

## 📌 시연 영상

> 🚧 준비 중

<br>

---

## 📋 목차
- [1. 프로젝트 개요](#1-프로젝트-개요)
- [2. 프로젝트 구조](#2-프로젝트-구조)
- [3. 팀 구성 및 역할](#3-팀-구성-및-역할)
- [4. 기술 스택](#4-기술-스택)
- [5. 시작하기 (Getting Started)](#5-시작하기-getting-started)
- [6. 프로젝트 수행 경과](#6-프로젝트-수행-경과)
- [7. 핵심 기능 코드 리뷰](#7-핵심-기능-코드-리뷰)
- [8. 화면 UI](#8-화면-ui)
- [9. 자체 평가 의견](#9-자체-평가-의견)

---

<br>

## 1. 프로젝트 개요

### 1-1. 프로젝트 주제
- AI 기반 음성 인식 및 실시간 번역 웹 서비스 **"짭파고 (ZzapPago)"**

### 1-2. 주제 선정 배경
- 글로벌 소통 수요 증가에 따라 빠르고 정확한 번역 서비스의 필요성 대두
- 기존 번역 서비스의 한계 (범용적 번역만 제공, 특정 목적/상황에 맞는 전문 번역 부재)
- 번역 결과를 학습 자료로 재활용하는 기능의 부재

### 1-3. 기획 의도
- 단순 번역을 넘어 **특정 목적(여행, 비즈니스, 일상 등)에 최적화**된 프로페셔널 번역 제공
- GPS 위치 기반 또는 사용자 직접 설정으로 **언어 자동 감지 및 설정**
- 번역 내역을 기반으로 **학습 카드, 퀴즈, 랭킹** 등 부가 학습 기능 연동
- 번역 결과를 **PDF, Word, PNG(WEBP)** 등으로 내보내기 지원

### 1-4. 핵심 기능
| 구분 | 기능 |
|:---:|:---|
| 🎤 음성 인식 | 실시간 음성 인식 (STT) → 텍스트 변환 |
| 🌍 실시간 번역 | AI API 기반 고품질 번역 (다국어 지원) |
| 📝 텍스트 번역 | 텍스트 입력 → 번역 결과 출력 |
| 🔊 텍스트 낭독 | 번역 결과 TTS 음성 출력 |
| 📍 위치 기반 | GPS/수동 설정으로 현지 언어 자동 감지 |
| 📚 번역 내역 | 번역 기록 저장 및 관리 |
| 🃏 학습 카드 | 번역 내역 기반 카드형 퀴즈 생성 (유료) |
| 🏆 랭킹 시스템 | 번역/학습 활동 기반 랭킹 산출 |
| 📄 내보내기 | 번역 내역 PDF, Word, PNG(WEBP) 변환 다운로드 |
| 🎮 미니게임 | 언어 학습 퀴즈 및 미니게임 |

### 1-5. 기대효과
- 목적별 맞춤 번역으로 실제 상황에서의 활용도 극대화
- 번역 → 학습 → 랭킹 선순환 구조로 지속적 사용 유도
- PDF/Word 내보내기로 오프라인 학습 자료 확보
- 향후 Flutter 앱 변환 및 MCP 통계 기능 확장 가능

<br>

---

## 2. 프로젝트 구조

### 2-1. 아키텍처

```
+-----------------------------------------------------------+
|                     Client (Browser)                      |
|  +-----------------------------------------------------+  |
|  |            React 19 + Vite + TypeScript              | |
|  |                                                      | |
|  |  +------------+ +------------+ +----------+ +------+ | |
|  |  |Web Speech  | |Geolocation | | Axios /  | |Tail- | | |
|  |  |API (STT/   | |API (GPS)   | |WebSocket | |wind  | | |
|  |  |TTS)        | |            | |          | |CSS+UI| | |
|  |  +------------+ +------------+ +----------+ +------+ | |
|  +-----------------------------------------------------+  |
+-----------------------------+-----------------------------+
                              | HTTP / WebSocket
                              v
+-----------------------------------------------------------+
|               Backend (FastAPI + Uvicorn)                 |
|                                                           |
|  +--------+ +-----------+ +----------+ +---------------+  |
|  | Auth   | | Translate | | History  | | Export        |  |
|  | (JWT)  | | Engine    | | & Rank   | | (PDF/Word/IMG)|  |
|  +--------+ +-----------+ +----------+ +---------------+  |
|                                                           |
|  +-----------------------------------------------------+  |
|  |          AI / Translation API Layer                 |  |
|  |                                                     |  |
|  |  +------------+ +------------+ +-----------+        |  |
|  |  | OpenAI     | | Whisper    | | Google    |        |  |
|  |  | GPT API    | | STT API    | | TTS/gTTS  |        |  |
|  |  |(Translate) | | + CUDA     | |           |        |  |
|  |  +------------+ +------------+ +-----------+        |  |
|  +-----------------------------------------------------+  |
|                                                           |
|  +-----------------------------------------------------+  |
|  |          File Generation Layer                      |  |
|  |                                                     |  |
|  |  +------------+ +------------+ +-----------+        |  |
|  |  | ReportLab  | | python-    | | Pillow    |        |  |
|  |  | (PDF)      | | docx(Word) | | (PNG/WEBP)|        |  |
|  |  +------------+ +------------+ +-----------+        |  |
|  +-----------------------------------------------------+  |
+-----------------------------+-----------------------------+
                              |
                              v
              +----------------------------+
              |     MySQL  +  Redis        |
              |   (Main DB)    (Cache)     |
              +----------------------------+
```

### 2-2. 디렉토리 구조

```
ZzapPago/
├── backend/                           ← FastAPI 백엔드
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    ← FastAPI 앱 진입점
│   │   ├── config/                    ← 설정 (DB, CORS, 환경변수)
│   │   ├── api/                       ← API 라우터
│   │   │   ├── v1/
│   │   │   │   ├── auth.py            ← 인증 (회원가입/로그인/JWT)
│   │   │   │   ├── translate.py       ← 번역 API
│   │   │   │   ├── speech.py          ← 음성 인식/합성 API
│   │   │   │   ├── history.py         ← 번역 내역 API
│   │   │   │   ├── quiz.py            ← 학습 카드/퀴즈 API
│   │   │   │   ├── ranking.py         ← 랭킹 API
│   │   │   │   └── export.py          ← 내보내기 (PDF/Word/IMG) API
│   │   │   └── deps.py               ← 의존성 주입 (인증 체크 등)
│   │   ├── models/                    ← SQLAlchemy ORM 모델
│   │   ├── schemas/                   ← Pydantic 스키마 (DTO)
│   │   ├── services/                  ← 비즈니스 로직
│   │   │   ├── translation_service.py ← 번역 엔진 서비스
│   │   │   ├── speech_service.py      ← STT/TTS 서비스
│   │   │   ├── export_service.py      ← 파일 생성 서비스
│   │   │   └── ranking_service.py     ← 랭킹 집계 서비스
│   │   ├── core/                      ← 핵심 유틸 (JWT, Security)
│   │   └── websocket/                 ← WebSocket 실시간 번역
│   ├── alembic/                       ← DB 마이그레이션
│   ├── tests/                         ← 테스트 코드
│   ├── requirements.txt               ← Python 의존성
│   └── Dockerfile                     ← 백엔드 Docker 설정
│
├── frontend/                          ← React 프론트엔드
│   ├── src/
│   │   ├── api/                       ← Axios API 호출 모듈
│   │   ├── components/                ← 공통 UI 컴포넌트
│   │   │   ├── common/                ← 공통 (Navbar, Footer 등)
│   │   │   ├── translate/             ← 번역 관련 컴포넌트
│   │   │   ├── speech/                ← 음성 인식 UI
│   │   │   ├── quiz/                  ← 학습 카드/퀴즈 UI
│   │   │   └── ranking/               ← 랭킹 UI
│   │   ├── contexts/                  ← React Context (인증 상태 등)
│   │   ├── hooks/                     ← 커스텀 훅 (useSpeech, useTranslate)
│   │   ├── pages/                     ← 페이지별 컴포넌트
│   │   ├── layouts/                   ← 레이아웃 컴포넌트
│   │   ├── utils/                     ← 유틸리티 함수
│   │   ├── types/                     ← TypeScript 타입 정의
│   │   ├── routes.tsx                 ← React Router 라우팅
│   │   └── App.tsx                    ← 앱 진입점
│   ├── package.json                   ← npm 의존성
│   ├── vite.config.ts                 ← Vite 빌드 설정
│   ├── tailwind.config.ts             ← Tailwind 설정
│   └── Dockerfile                     ← 프론트엔드 Docker 설정
│
├── docs/                              ← 문서 및 이미지
│   ├── images/                        ← 스크린샷, 배너 등
│   └── api-spec/                      ← API 명세서
│
├── docker-compose.yml                 ← Docker Compose 설정
├── developments.md                    ← 개발 일지
├── .env.example                       ← 환경변수 예시
└── README.md                          ← 프로젝트 소개
```

### 2-3. 메뉴 구조도

```
짭파고 (ZzapPago)
├── 🏠 홈 (메인 번역 화면)
│   ├── 음성 입력 (마이크 버튼)
│   ├── 텍스트 입력
│   ├── 언어 선택 (출발어 ↔ 도착어)
│   ├── 위치 기반 자동 감지
│   └── 번역 결과 (텍스트 + 낭독 버튼)
│
├── 📚 번역 내역
│   ├── 전체 내역 조회
│   ├── 즐겨찾기 필터
│   └── 내보내기 (PDF / Word / PNG)
│
├── 🃏 학습 센터 (유료 회원)
│   ├── 학습 카드 목록
│   ├── 퀴즈 모드
│   └── 학습 통계
│
├── 🏆 랭킹
│   ├── 번역 횟수 랭킹
│   ├── 학습 점수 랭킹
│   └── 주간/월간 TOP 3
│
├── 🎮 미니게임
│   ├── 단어 맞추기
│   ├── 문장 완성하기
│   └── 속도 번역 챌린지
│
├── 👤 마이페이지
│   ├── 프로필 설정
│   ├── 언어 설정 / GPS 설정
│   ├── 구독 관리 (무료/유료)
│   └── 내보내기 다운로드 내역
│
└── ⚙️ 설정
    ├── 테마 (다크/라이트)
    ├── 알림 설정
    └── AI 모델 설정
```

<br>

---

## 3. 팀 구성 및 역할

> 본인이 맡거나 수행한 역할 하나씩 채우기

| 이름 | 역할 | 담당 업무 |
|:---:|:---:|:---|
| **최영우** | FullStack Developer | • 프로젝트 총괄 및 설계 |
| **정성준** | FullStack Developer | •  |

> 💡 인원 : **2명** &nbsp;|&nbsp; 기간 : **2026.04 ~**

<br>

---

## 4. 기술 스택

### Frontend
<div align="left">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white">
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">
  <img src="https://img.shields.io/badge/Web_Speech_API-4285F4?style=for-the-badge&logo=google&logoColor=white">
</div>

### Backend
<div align="left">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white">
  <img src="https://img.shields.io/badge/Python_3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white">
  <img src="https://img.shields.io/badge/Uvicorn-2F6B3D?style=for-the-badge">
  <img src="https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white">
  <img src="https://img.shields.io/badge/Alembic-6BA81E?style=for-the-badge">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white">
  <img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white">
</div>

### AI / STT / TTS
<div align="left">
  <img src="https://img.shields.io/badge/OpenAI_API-412991?style=for-the-badge&logo=openai&logoColor=white">
  <img src="https://img.shields.io/badge/Whisper_(STT)-412991?style=for-the-badge&logo=openai&logoColor=white">
  <img src="https://img.shields.io/badge/CUDA-76B900?style=for-the-badge&logo=nvidia&logoColor=white">
  <img src="https://img.shields.io/badge/gTTS-4285F4?style=for-the-badge&logo=google&logoColor=white">
</div>

### Database
<div align="left">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white">
</div>

### File Export
<div align="left">
  <img src="https://img.shields.io/badge/ReportLab_(PDF)-CC0000?style=for-the-badge">
  <img src="https://img.shields.io/badge/python--docx_(Word)-2B579A?style=for-the-badge&logo=microsoftword&logoColor=white">
  <img src="https://img.shields.io/badge/Pillow_(IMG)-3776AB?style=for-the-badge">
</div>

### DevOps / Tools
<div align="left">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white">
  <img src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white">
  <img src="https://img.shields.io/badge/pip-3775A9?style=for-the-badge&logo=pypi&logoColor=white">
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">
</div>

<br>

---

## 5. 시작하기 (Getting Started)

### 5-0. 사전 설치 필요 프로그램

| 프로그램 | 버전 | 다운로드 |
|:---|:---|:---|
| **Python** | 3.11 이상 | https://www.python.org/downloads/ |
| **Node.js** | 18 이상 | https://nodejs.org/ |
| **MySQL** | 8.0 이상 | https://dev.mysql.com/downloads/ |
| **Git** | 최신 | https://git-scm.com/ |

> ⚠️ Python 설치 시 **"Add to PATH" 체크 필수**

### 5-1. 프로젝트 클론

```bash
git clone <레포지토리 URL>
cd ZzapPago
```

### 5-2. 환경변수 설정

```bash
copy .env.example .env
```

`.env` 파일을 열어 본인 환경에 맞게 수정:
```env
DB_PASSWORD=본인MySQL비밀번호
JWT_SECRET_KEY=아무거나-긴-랜덤-문자열
OPENAI_API_KEY=본인-OpenAI-키
```

### 5-3. MySQL 데이터베이스 생성

```sql
CREATE DATABASE zzappago DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5-4. Backend 실행

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload
```

> ✅ http://localhost:8000 → `{"message": "ZzapPago API is running"}`
>
> 📄 API 문서: http://localhost:8000/docs

### 5-5. Frontend 실행

```bash
# 새 터미널 열고
cd frontend
npm install
npm run dev
```

> ✅ http://localhost:5173 → "짭파고 ZzapPago" 화면 확인

<br>

---

## 6. 프로젝트 수행 경과

### 5-1. 요구사항 & 기능 정의서
<details>
  <summary>요구사항 및 기능 정의서 펼치기</summary>
  
  > 🚧 준비 중
</details>

### 5-2. ERD
<details>
  <summary>ERD 펼치기</summary>
  
  > 🚧 준비 중
</details>

### 5-3. API 명세서
<details>
  <summary>API 명세서 펼치기</summary>
  
  > 🚧 FastAPI Swagger UI (`/docs`) 자동 생성 예정
</details>

<br>

---

## 7. 핵심 기능 코드 리뷰

> 🚧 개발 진행 후 업데이트 예정

### 7-1. 음성 인식 → 실시간 번역 파이프라인

### 7-2. WebSocket 기반 실시간 번역 스트리밍

### 7-3. AI 프롬프팅 기반 목적별 번역 엔진

### 7-4. 번역 내역 → 학습 카드 생성

### 7-5. 파일 내보내기 (PDF / Word / IMG)

<br>

---

## 8. 화면 UI

> 🚧 개발 진행 후 스크린샷 업데이트 예정

<br>

---

## 9. 자체 평가 의견

> 🚧 프로젝트 완료 후 작성 예정

<br>

---

## 🔮 향후 확장 계획
 
| 단계 | 내용 |
|:---:|:---|
| **옵션 1** | MCP 함수 연동 — 번역 통계 및 분석 함수 서버 구축 |
| **옵션 2** | Flutter 앱 변환 — 모바일 네이티브 앱 배포 |
| **Phase 2** | 유료 회원 시스템 — 학습 카드, 프리미엄 번역 모델 |
| **Phase 3** | 랭킹 리워드 — 상위 랭커 혜택 시스템 |