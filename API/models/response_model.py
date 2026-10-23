from typing import Optional, Dict
from pydantic import BaseModel, Field

class ChatResponse(BaseModel):
    """
    Response model for chat API
    """
    response: str = Field(
        ...,
        description="AI-generated response or report."
    )
    session_id: str = Field(
        ...,
        description="Session ID for this conversation. Send this in follow-up requests to continue the chat."
    )
    downloads: Optional[Dict[str, str]] = Field(
        default=None,
        description="Download links for generated reports (e.g. {'pdf': '/download/file.pdf', 'markdown': '/download/file.md'})."
    )