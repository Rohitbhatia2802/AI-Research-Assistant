from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def reports():
    return {
        "message": "Reports API is working."
    }