import logging
import time
import uuid

from fastapi import APIRouter, HTTPException

from API.models.request import ChatRequest
from API.models.response_model import ChatResponse
from agent import agent

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest):
    started = time.perf_counter()

    logger.info("Chat request started")

    try:
        # Use provided session_id or generate a new one
        session_id = request.session_id or uuid.uuid4().hex[:8]

        result = agent.invoke(
            {
                "messages": [
                    {
                        "role": "user",
                        "content": request.message,
                    }
                ]
            },
            config={"configurable": {"thread_id": session_id}}
        )

        messages = result.get("messages")

        if not messages:
            raise HTTPException(
                status_code=500,
                detail="The agent returned no messages.",
            )

        from langchain_core.messages import ToolMessage

        response = None

        # If a tool (like research_tool) was executed, its ToolMessage contains
        # the actual research report formatted by report_prompt.py
        for message in reversed(messages):
            if isinstance(message, ToolMessage) or getattr(message, "type", None) == "tool":
                if message.content:
                    response = str(message.content)
                    break

        # If no tool was called (e.g. general conversation), use the AI's final response
        if not response:
            for message in reversed(messages):
                if getattr(message, "content", None):
                    response = str(message.content)
                    break

        if not response:
            raise HTTPException(
                status_code=500,
                detail="The agent returned an empty response.",
            )

        logger.info(
            "Chat request completed in %.2f seconds",
            time.perf_counter() - started,
        )

        # Detect if any file paths were saved (PDF / Markdown)
        import os
        import re

        downloads = {}
        pdf_match = re.search(r"PDF saved at:\s*([^\r\n]+)", response, re.IGNORECASE)
        if pdf_match:
            pdf_file = os.path.basename(pdf_match.group(1).strip())
            downloads["pdf"] = f"/download/{pdf_file}"

        md_match = re.search(r"Markdown saved at:\s*([^\r\n]+)", response, re.IGNORECASE)
        if md_match:
            md_file = os.path.basename(md_match.group(1).strip())
            downloads["markdown"] = f"/download/{md_file}"

        return ChatResponse(
            response=response,
            session_id=session_id,
            downloads=downloads if downloads else None
        )

    except HTTPException:
        raise

    except Exception as e:
        logger.exception(
            "Chat request failed after %.2f seconds",
            time.perf_counter() - started,
        )

        raise HTTPException(
            status_code=500,
            detail=str(e),   # During development
        )