from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class ChatRequest(BaseModel):

    """Request model for chat API"""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "message": "Research Vector database."
                },
                {
                    "message": "Now save this as PDF",
                    "session_id": "a1b2c3d4"
                }
            ]
        }
    )

    message: str = Field(
        ...,
        description="User query sent to AI Research Assistant"
    )
    session_id: Optional[str] = Field(
        default=None,
        description="Optional. Send this only for follow-up messages to continue an existing conversation."
    )