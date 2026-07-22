from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def chat():
    return {
        "message": "Chat API is working."
    }