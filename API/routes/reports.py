import os
from fastapi import APIRouter

router = APIRouter()
REPORTS_DIR = "reports"


@router.get("/")
def list_reports():
    """
    List all generated research reports (PDF and Markdown) with download links.
    """
    if not os.path.exists(REPORTS_DIR):
        return {"reports": []}

    reports_list = []
    for filename in sorted(os.listdir(REPORTS_DIR)):
        if filename.endswith((".pdf", ".md")):
            file_path = os.path.join(REPORTS_DIR, filename)
            file_format = "pdf" if filename.endswith(".pdf") else "markdown"
            reports_list.append(
                {
                    "filename": filename,
                    "format": file_format,
                    "download_url": f"/download/{filename}",
                    "size_kb": round(os.path.getsize(file_path) / 1024, 2),
                }
            )

    return {"reports": reports_list}