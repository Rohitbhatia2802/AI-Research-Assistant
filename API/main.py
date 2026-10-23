from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import Routers
from API.routes.chat import router as chat_router
from API.routes.reports import router as reports_router
from API.routes.download import router as download_router


app = FastAPI(
    title="AI Research Assistant API",
    description="Backend API for AI Research Assistant built using LangChain, RAG, and FastAPI.",
    version="1.0.0"
)


# ---------------------- CORS ---------------------- #

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://frontend-mu-ten-0itybswtvi.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------- Routers ---------------------- #

app.include_router(
    chat_router,
    prefix="/chat",
    tags=["Chat"]
)

app.include_router(
    reports_router,
    prefix="/reports",
    tags=["Reports"]
)

app.include_router(
    download_router,
    prefix="/download",
    tags=["Downloads"]
)


# ---------------------- Root Endpoint ---------------------- #

@app.get("/")
def home():
    return {
        "message": "Welcome to the AI Research Assistant API 🚀"
    }