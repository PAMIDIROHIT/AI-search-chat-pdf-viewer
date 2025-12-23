"""
Chat API Router.
Handles SSE streaming chat endpoint.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from ..models.schemas import ChatRequest, ErrorResponse
from ..services.response_generator import response_generator

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post(
    "/stream",
    summary="Stream AI response",
    description="""
    Streams an AI response to the user's query using Server-Sent Events (SSE).
    
    The stream includes:
    - **tool_call**: Progress indicators for reasoning steps
    - **text_chunk**: Incremental response text
    - **citation**: References to source documents
    - **complete**: Final complete response
    
    Each event is formatted as: `data: {json}\\n\\n`
    """,
    responses={
        200: {
            "description": "SSE stream of response events",
            "content": {"text/event-stream": {}}
        },
        400: {"model": ErrorResponse, "description": "Invalid request"},
        500: {"model": ErrorResponse, "description": "Server error"}
    }
)
async def stream_chat(request: ChatRequest):
    """
    Stream AI response with tool calls and citations.
    
    Args:
        request: ChatRequest with user query
        
    Returns:
        StreamingResponse with SSE events
    """
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    async def generate():
        """Async generator for SSE events."""
        try:
            async for event in response_generator.generate_stream(request.query):
                yield event
        except Exception as e:
            # Send error event
            error_event = f'data: {{"type": "error", "content": "{str(e)}"}}\n\n'
            yield error_event
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering
        }
    )


@router.get(
    "/health",
    summary="Health check",
    description="Check if the chat service is running"
)
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "chat"}
