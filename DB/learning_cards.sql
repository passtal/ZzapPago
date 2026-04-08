-- --------------------------------------------
--    learning_cards  -  학습 카드 테이블
--    [학습 카드] translations만 가지고 관리하기 보다는 별도 테이블로 학습 카드 관리
--    예) 원문/번역문 + 카드 유형 (단어장, 문장 카드 등) + 학습 횟수/마지막 학습 시간
-- --------------------------------------------

USE zzappago;

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