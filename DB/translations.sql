-- ============================================
--  translations  -  번역 내역 테이블
-- ============================================
--  모든 번역 요청/결과를 저장한다.
--  팀원 공통으로 사용하는 핵심 테이블.
-- ============================================

USE zzappago;

CREATE TABLE IF NOT EXISTS translations (
    id              INT             NOT NULL AUTO_INCREMENT,
    source_lang     VARCHAR(10)     NOT NULL COMMENT '출발 언어 코드 (ko, en, ja ...)',
    target_lang     VARCHAR(10)     NOT NULL COMMENT '도착 언어 코드',
    source_text     TEXT            NOT NULL COMMENT '원문 텍스트',
    translated_text TEXT            NOT NULL COMMENT '번역된 텍스트',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='번역 내역';
