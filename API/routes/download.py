from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def download():
    return {
        "message": "Download API is working."
    }