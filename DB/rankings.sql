-- ============================================
--  rankings  -  랭킹 테이블
--  [랭킹] 번역 횟수 + 퀴즈 점수 종합 랭킹
-- ============================================

USE zzappago;

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
