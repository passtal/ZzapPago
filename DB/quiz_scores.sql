-- ============================================
--  quiz_scores  -  미니게임 점수 테이블
--  [랭킹] 퀴즈 개별 기록 → rankings.quiz_score 집계에 사용
-- ============================================

USE zzappago;

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
