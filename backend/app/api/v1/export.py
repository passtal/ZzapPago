import os
from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schemas.export import ExportRequest, ExportResponse
from app.services.export_service import create_export

router = APIRouter(prefix="/exports", tags=["내보내기"])


@router.post("/", response_model=ExportResponse)
def post_export(req: ExportRequest, db: Session = Depends(get_db)):
    """번역 결과 내보내기 (PDF/Word/IMG)"""
    return create_export(req, db)


@router.get("/download/{export_id}")
def download_export(export_id: int, db: Session = Depends(get_db)):
    """내보내기 파일 다운로드"""
    from app.models.export import Export

    export_record = db.query(Export).filter(Export.id == export_id).first()
    if not export_record:
        return {"error": "내보내기 기록을 찾을 수 없습니다."}

    if not os.path.exists(export_record.file_path):
        return {"error": "파일을 찾을 수 없습니다."}

    ext_map = {"pdf": "application/pdf", "word": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "img": "image/png"}
    media_type = ext_map.get(export_record.format, "application/octet-stream")

    return FileResponse(
        path=export_record.file_path,
        media_type=media_type,
        filename=os.path.basename(export_record.file_path),
    )
