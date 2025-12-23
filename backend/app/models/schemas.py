"""
Pydantic models for the AI Chat Application.
Defines request/response schemas for API endpoints.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    query: str = Field(..., min_length=1, max_length=10000, description="User's question or message")
    conversation_id: Optional[str] = Field(None, description="Optional conversation ID for context")


class Citation(BaseModel):
    """Citation model representing a reference to a PDF document."""
    id: int = Field(..., ge=1, description="Citation number (1-indexed)")
    document: str = Field(..., description="PDF filename")
    page: int = Field(..., ge=1, description="Page number in the PDF")
    text_snippet: str = Field(..., description="Relevant text excerpt from the PDF")
    relevance_score: Optional[float] = Field(None, ge=0, le=1, description="Relevance score 0-1")


class ToolCall(BaseModel):
    """Tool call model for showing reasoning steps."""
    tool: str = Field(..., description="Name of the tool being called")
    status: Literal["running", "completed", "error"] = Field(..., description="Current status of the tool")
    message: Optional[str] = Field(None, description="Optional message or result")


class StreamEvent(BaseModel):
    """
    Server-Sent Event model for streaming responses.
    
    Event types:
    - text_chunk: Partial response text
    - citation: Citation reference
    - tool_call: Reasoning step indicator
    - ui_component: Generative UI component (optional)
    - complete: Final complete response
    - error: Error message
    """
    type: Literal["text_chunk", "citation", "tool_call", "ui_component", "complete", "error"]
    content: Optional[str] = Field(None, description="Text content for text_chunk/complete/error types")
    citation: Optional[Citation] = Field(None, description="Citation data for citation type")
    tool_call: Optional[ToolCall] = Field(None, description="Tool call data for tool_call type")
    component_type: Optional[str] = Field(None, description="UI component type (chart, table, card)")
    component_data: Optional[dict] = Field(None, description="UI component data")


class Message(BaseModel):
    """Chat message model."""
    id: str = Field(..., description="Unique message ID")
    role: Literal["user", "assistant"] = Field(..., description="Message sender role")
    content: str = Field(..., description="Message content")
    citations: Optional[List[Citation]] = Field(None, description="Citations for assistant messages")
    timestamp: datetime = Field(default_factory=datetime.now, description="Message timestamp")


class PDFMetadata(BaseModel):
    """PDF document metadata."""
    filename: str = Field(..., description="PDF filename")
    title: Optional[str] = Field(None, description="Document title")
    author: Optional[str] = Field(None, description="Document author")
    num_pages: int = Field(..., ge=1, description="Total number of pages")
    file_size: int = Field(..., ge=0, description="File size in bytes")


class PDFPageContent(BaseModel):
    """Content of a single PDF page."""
    page_number: int = Field(..., ge=1, description="Page number")
    text: str = Field(..., description="Extracted text content")
    

class ErrorResponse(BaseModel):
    """Standard error response model."""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")
    code: Optional[str] = Field(None, description="Error code")
