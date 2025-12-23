"""
PDF Processing Service.
Handles PDF text extraction, metadata retrieval, and page-to-text mapping.
"""

import os
from typing import Dict, List, Optional
from pathlib import Path
import PyPDF2
from ..models.schemas import PDFMetadata, PDFPageContent


class PDFProcessor:
    """
    Service for processing PDF documents.
    Extracts text, metadata, and creates page-to-text mappings.
    """
    
    def __init__(self, pdf_directory: str = None):
        """
        Initialize PDF processor.
        
        Args:
            pdf_directory: Path to directory containing PDF files
        """
        if pdf_directory is None:
            # Default to data/pdfs relative to backend root
            self.pdf_directory = Path(__file__).parent.parent.parent / "data" / "pdfs"
        else:
            self.pdf_directory = Path(pdf_directory)
        
        # Create directory if it doesn't exist
        self.pdf_directory.mkdir(parents=True, exist_ok=True)
        
        # Cache for extracted text (filename -> {page_num: text})
        self._text_cache: Dict[str, Dict[int, str]] = {}
        # Cache for metadata
        self._metadata_cache: Dict[str, PDFMetadata] = {}
    
    def get_pdf_path(self, filename: str) -> Optional[Path]:
        """
        Get full path to a PDF file.
        
        Args:
            filename: Name of the PDF file
            
        Returns:
            Full path to the PDF or None if not found
        """
        # Security: Prevent directory traversal
        safe_filename = Path(filename).name
        pdf_path = self.pdf_directory / safe_filename
        
        if pdf_path.exists() and pdf_path.suffix.lower() == '.pdf':
            return pdf_path
        return None
    
    def list_pdfs(self) -> List[str]:
        """
        List all available PDF files.
        
        Returns:
            List of PDF filenames
        """
        return [f.name for f in self.pdf_directory.glob("*.pdf")]
    
    def get_metadata(self, filename: str) -> Optional[PDFMetadata]:
        """
        Get metadata for a PDF file.
        
        Args:
            filename: Name of the PDF file
            
        Returns:
            PDFMetadata object or None if file not found
        """
        if filename in self._metadata_cache:
            return self._metadata_cache[filename]
        
        pdf_path = self.get_pdf_path(filename)
        if not pdf_path:
            return None
        
        try:
            with open(pdf_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                info = reader.metadata
                
                metadata = PDFMetadata(
                    filename=filename,
                    title=info.get('/Title') if info else None,
                    author=info.get('/Author') if info else None,
                    num_pages=len(reader.pages),
                    file_size=pdf_path.stat().st_size
                )
                
                self._metadata_cache[filename] = metadata
                return metadata
                
        except Exception as e:
            print(f"Error reading PDF metadata: {e}")
            return None
    
    def extract_text(self, filename: str, page_number: Optional[int] = None) -> Optional[Dict[int, str]]:
        """
        Extract text from a PDF file.
        
        Args:
            filename: Name of the PDF file
            page_number: Optional specific page to extract (1-indexed)
            
        Returns:
            Dictionary mapping page numbers to text content
        """
        # Check cache first
        if filename in self._text_cache:
            if page_number:
                text = self._text_cache[filename].get(page_number)
                return {page_number: text} if text else None
            return self._text_cache[filename]
        
        pdf_path = self.get_pdf_path(filename)
        if not pdf_path:
            return None
        
        try:
            with open(pdf_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                text_map: Dict[int, str] = {}
                
                for i, page in enumerate(reader.pages, start=1):
                    if page_number and i != page_number:
                        continue
                    text = page.extract_text() or ""
                    text_map[i] = text
                
                # Cache the full extraction
                if not page_number:
                    self._text_cache[filename] = text_map
                
                return text_map
                
        except Exception as e:
            print(f"Error extracting PDF text: {e}")
            return None
    
    def get_page_content(self, filename: str, page_number: int) -> Optional[PDFPageContent]:
        """
        Get content of a specific page.
        
        Args:
            filename: Name of the PDF file
            page_number: Page number (1-indexed)
            
        Returns:
            PDFPageContent object or None if not found
        """
        text_map = self.extract_text(filename, page_number)
        if not text_map or page_number not in text_map:
            return None
        
        return PDFPageContent(
            page_number=page_number,
            text=text_map[page_number]
        )
    
    def search_text(self, filename: str, query: str) -> List[Dict]:
        """
        Search for text within a PDF.
        
        Args:
            filename: Name of the PDF file
            query: Text to search for
            
        Returns:
            List of matches with page number and snippet
        """
        text_map = self.extract_text(filename)
        if not text_map:
            return []
        
        results = []
        query_lower = query.lower()
        
        for page_num, text in text_map.items():
            if query_lower in text.lower():
                # Find the snippet around the match
                idx = text.lower().find(query_lower)
                start = max(0, idx - 100)
                end = min(len(text), idx + len(query) + 100)
                snippet = text[start:end].strip()
                
                if start > 0:
                    snippet = "..." + snippet
                if end < len(text):
                    snippet = snippet + "..."
                
                results.append({
                    "page": page_num,
                    "snippet": snippet
                })
        
        return results
    
    def clear_cache(self):
        """Clear all cached data."""
        self._text_cache.clear()
        self._metadata_cache.clear()


# Global instance
pdf_processor = PDFProcessor()
