"""
FastAPI Application Entry Point.
AI Search Chat with PDF Citation Viewer.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .api import chat_router, pdfs_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Runs on startup and shutdown.
    """
    # Startup
    print("🚀 Starting AI Search Chat API...")
    print("📚 PDF Citation Viewer ready")
    yield
    # Shutdown
    print("👋 Shutting down AI Search Chat API...")


# Create FastAPI application
app = FastAPI(
    title="AI Search Chat API",
    description="""
    ## Perplexity-style AI Search Chat with PDF Citation Viewer
    
    This API provides:
    - **Streaming Chat**: Real-time AI responses with SSE
    - **Tool Calls**: Visible reasoning steps during response generation
    - **Citations**: Inline references to PDF documents
    - **PDF Serving**: Access to source documents
    
    ### Streaming Protocol
    
    The `/api/chat/stream` endpoint returns Server-Sent Events with the following event types:
    
    | Type | Description |
    |------|-------------|
    | `tool_call` | Reasoning step indicator (searching, analyzing, etc.) |
    | `text_chunk` | Incremental response text |
    | `citation` | Reference to PDF document with page and snippet |
    | `complete` | Final complete response |
    | `error` | Error message if something goes wrong |
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # Next.js dev server
        "http://127.0.0.1:3000",
        "http://localhost:3001",      # Alternative port
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(chat_router)
app.include_router(pdfs_router)


@app.get("/", tags=["root"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": "AI Search Chat API",
        "version": "1.0.0",
        "description": "Perplexity-style AI Search Chat with PDF Citation Viewer",
        "docs": "/docs",
        "endpoints": {
            "chat_stream": "POST /api/chat/stream",
            "list_pdfs": "GET /api/pdfs",
            "get_pdf": "GET /api/pdfs/{filename}",
            "pdf_metadata": "GET /api/pdfs/{filename}/metadata",
            "pdf_page": "GET /api/pdfs/{filename}/page/{page_number}",
            "search_pdf": "GET /api/pdfs/{filename}/search?q={query}"
        }
    }


@app.get("/health", tags=["health"])
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "services": {
            "chat": "operational",
            "pdfs": "operational"
        }
    }
