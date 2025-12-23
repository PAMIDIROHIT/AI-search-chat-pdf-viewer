"""
PDF API Router.
Handles PDF file serving and metadata endpoints.
"""

import os
from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import FileResponse
from typing import List
from ..models.schemas import PDFMetadata, ErrorResponse
from ..services.pdf_processor import pdf_processor

router = APIRouter(prefix="/api/pdfs", tags=["pdfs"])


@router.get(
    "",
    response_model=List[PDFMetadata],
    summary="List all PDFs",
    description="Returns a list of all available PDF documents with their metadata."
)
async def list_pdfs():
    """
    List all available PDF files with metadata.
    
    Returns:
        List of PDFMetadata objects
    """
    pdf_files = pdf_processor.list_pdfs()
    result = []
    
    for filename in pdf_files:
        metadata = pdf_processor.get_metadata(filename)
        if metadata:
            result.append(metadata)
    
    return result


@router.get(
    "/{filename}",
    summary="Get PDF file",
    description="Returns the PDF file for viewing/downloading.",
    responses={
        200: {
            "description": "PDF file",
            "content": {"application/pdf": {}}
        },
        404: {"model": ErrorResponse, "description": "PDF not found"}
    }
)
async def get_pdf(filename: str):
    """
    Serve a PDF file.
    
    Args:
        filename: Name of the PDF file
        
    Returns:
        PDF file response
    """
    pdf_path = pdf_processor.get_pdf_path(filename)
    
    if not pdf_path:
        raise HTTPException(
            status_code=404,
            detail=f"PDF file '{filename}' not found"
        )
    
    return FileResponse(
        path=str(pdf_path),
        media_type="application/pdf",
        filename=filename,
        headers={
            "Content-Disposition": f"inline; filename={filename}",
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )


@router.get(
    "/{filename}/metadata",
    response_model=PDFMetadata,
    summary="Get PDF metadata",
    description="Returns metadata for a specific PDF document.",
    responses={
        404: {"model": ErrorResponse, "description": "PDF not found"}
    }
)
async def get_pdf_metadata(filename: str):
    """
    Get metadata for a specific PDF.
    
    Args:
        filename: Name of the PDF file
        
    Returns:
        PDFMetadata object
    """
    metadata = pdf_processor.get_metadata(filename)
    
    if not metadata:
        raise HTTPException(
            status_code=404,
            detail=f"PDF file '{filename}' not found"
        )
    
    return metadata


@router.get(
    "/{filename}/page/{page_number}",
    summary="Get PDF page text",
    description="Returns extracted text from a specific page of a PDF.",
    responses={
        404: {"model": ErrorResponse, "description": "PDF or page not found"}
    }
)
async def get_pdf_page(filename: str, page_number: int):
    """
    Get text content of a specific page.
    
    Args:
        filename: Name of the PDF file
        page_number: Page number (1-indexed)
        
    Returns:
        Page content with text
    """
    if page_number < 1:
        raise HTTPException(
            status_code=400,
            detail="Page number must be at least 1"
        )
    
    content = pdf_processor.get_page_content(filename, page_number)
    
    if not content:
        raise HTTPException(
            status_code=404,
            detail=f"Page {page_number} not found in '{filename}'"
        )
    
    return content


@router.get(
    "/{filename}/search",
    summary="Search PDF text",
    description="Search for text within a PDF document.",
    responses={
        404: {"model": ErrorResponse, "description": "PDF not found"}
    }
)
async def search_pdf(filename: str, q: str):
    """
    Search for text within a PDF.
    
    Args:
        filename: Name of the PDF file
        q: Search query
        
    Returns:
        List of matches with page numbers and snippets
    """
    if not q.strip():
        raise HTTPException(
            status_code=400,
            detail="Search query cannot be empty"
        )
    
    if not pdf_processor.get_pdf_path(filename):
        raise HTTPException(
            status_code=404,
            detail=f"PDF file '{filename}' not found"
        )
    
    results = pdf_processor.search_text(filename, q)
    
    return {
        "query": q,
        "filename": filename,
        "results": results,
        "total": len(results)
    }
