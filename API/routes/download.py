import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter()
REPORTS_DIR = "reports"


@router.get("/")
def download_root():
    return {
        "message": "Specify the filename to download: /download/{filename}. Use /reports to view available files."
    }


@router.get("/{filename}")
def download_file(filename: str):
    """
    Download a research report file (PDF or Markdown).
    """
    # Prevent directory traversal attacks
    safe_filename = os.path.basename(filename)
    filepath = os.path.join(REPORTS_DIR, safe_filename)

    if not os.path.exists(filepath):
        raise HTTPException(
            status_code=404,
            detail=f"Report file '{safe_filename}' not found. Check /reports for available files."
        )

    media_type = "application/pdf" if safe_filename.endswith(".pdf") else "text/markdown"

    return FileResponse(
        path=filepath,
        filename=safe_filename,
        media_type=media_type
    )