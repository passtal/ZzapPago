-- Active: 1767920846202@@127.0.0.1@3306@zzappago
-- ============================================
--  ZzapPago DDL
--  MySQL 8.0+
--  최종 수정: 2026-04-08 (수정자 : 최영우)
-- ============================================

-- --------------------------------------------
-- 0. 데이터베이스 생성
-- --------------------------------------------

CREATE DATABASE IF NOT EXISTS zzappago
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE zzappago;

SET FOREIGN_KEY_CHECKS = 0;

DROP Table IF EXISTS
    translations,
    exports,
    rankings,
    quiz_scores,
    learning_cards
    ;

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------
-- 1. translations  -  번역 내역 테이블
--    [STT] input_type 으로 음성/텍스트 구분
--    [위치] latitude, longitude, country_code 저장
--    [실시간] WebSocket 번역 결과도 동일하게 저장
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS translations (
    id              INT             NOT NULL AUTO_INCREMENT,
    source_lang     VARCHAR(10)     NOT NULL COMMENT '출발 언어 코드 (ko, en, ja ...)',
    target_lang     VARCHAR(10)     NOT NULL COMMENT '도착 언어 코드',
    source_text     TEXT            NOT NULL COMMENT '원문 텍스트',
    translated_text TEXT            NOT NULL COMMENT '번역된 텍스트',
    input_type      VARCHAR(10)     NOT NULL DEFAULT 'text' COMMENT '입력 방식 (text, voice)',
    latitude        DECIMAL(10,7)   NULL     COMMENT '번역 시 위도',
    longitude       DECIMAL(10,7)   NULL     COMMENT '번역 시 경도',
    country_code    VARCHAR(5)      NULL     COMMENT '위치 기반 국가 코드 (KR, US, JP ...)',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_country (country_code)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='번역 내역';

-- --------------------------------------------
-- 2. exports  -  내보내기 이력 테이블
--    [내보내기] PDF/Word/IMG 내보내기 기록
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS exports (
    id              INT             NOT NULL AUTO_INCREMENT,
    translation_id  INT             NOT NULL COMMENT '내보낸 번역 ID',
    format          VARCHAR(10)     NOT NULL COMMENT '파일 형식 (pdf, docx, png)',
    file_path       VARCHAR(500)    NOT NULL COMMENT '생성된 파일 경로',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_translation_id (translation_id),
    CONSTRAINT fk_exports_translation
        FOREIGN KEY (translation_id) REFERENCES translations (id)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='내보내기 이력';

-- --------------------------------------------
-- 3. rankings  -  랭킹 테이블
--    [랭킹] 닉네임 기반, 번역 횟수 + 퀴즈 점수 종합
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS rankings (
    id              INT             NOT NULL AUTO_INCREMENT,
    nickname        VARCHAR(50)     NOT NULL COMMENT '닉네임 (비로그인 랭킹용)',
    total_score     INT             NOT NULL DEFAULT 0  COMMENT '총 점수 (translate_count + quiz_score)',
    translate_count INT             NOT NULL DEFAULT 0  COMMENT '번역 횟수',
    quiz_score      INT             NOT NULL DEFAULT 0  COMMENT '퀴즈 총점',
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_nickname (nickname),
    INDEX idx_total_score (total_score DESC)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='랭킹';

-- --------------------------------------------
-- 4. quiz_scores  -  미니게임 점수 테이블
--    [랭킹] 퀴즈 개별 기록 → rankings.quiz_score 집계에 사용
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS quiz_scores (
    id              INT             NOT NULL AUTO_INCREMENT,
    nickname        VARCHAR(50)     NOT NULL COMMENT '닉네임',
    quiz_type       VARCHAR(30)     NOT NULL COMMENT '게임 유형 (word_match, listening, speed ...)',
    score           INT             NOT NULL DEFAULT 0  COMMENT '획득 점수',
    played_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_nickname_quiz (nickname, quiz_type),
    INDEX idx_score (score DESC)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='미니게임 점수';

-- --------------------------------------------
-- 5. learning_cards  -  학습 카드 테이블
--    [학습 카드] translations만 가지고 관리하기 보다는 별도 테이블로 학습 카드 관리
--    예) 원문/번역문 + 카드 유형 (단어장, 문장 카드 등) + 학습 횟수/마지막 학습 시간
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS learning_cards (
    id              INT             NOT NULL AUTO_INCREMENT,
    translation_id  INT             NOT NULL COMMENT '관련 번역 ID',
    source_text     TEXT            NOT NULL COMMENT '원문 텍스트',
    translated_text TEXT            NOT NULL COMMENT '번역된 텍스트',
    source_lang     VARCHAR(10)     NOT NULL COMMENT '원문 언어',
    target_lang     VARCHAR(10)     NOT NULL COMMENT '번역 언어',
    is_memorized    BOOLEAN         NOT NULL DEFAULT FALSE COMMENT '암기 여부',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',

    PRIMARY KEY (id),
    INDEX idx_translation_id (translation_id),
    INDEX idx_is_memorized (is_memorized),
    CONSTRAINT fk_learning_cards_translation
        FOREIGN KEY (translation_id) REFERENCES translations (id)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='학습 카드';
