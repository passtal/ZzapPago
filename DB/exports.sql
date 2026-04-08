-- ============================================
--  exports  -  내보내기 이력 테이블
--  [내보내기] PDF/Word/IMG 내보내기 기록
-- ============================================

USE zzappago;

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
