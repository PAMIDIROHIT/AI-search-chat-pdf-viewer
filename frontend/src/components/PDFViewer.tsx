'use client';

/**
 * PDFViewer Component
 * Displays PDF documents with navigation, zoom, and text highlighting.
 * Uses dynamic imports to avoid SSR issues with react-pdf.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { PDFViewerState } from '@/lib/types';

// Dynamically import react-pdf components with SSR disabled
// This is required because react-pdf uses browser-only APIs (DOMMatrix, etc.)
const Document = dynamic(
    () => import('react-pdf').then((mod) => mod.Document),
    { ssr: false }
);

const Page = dynamic(
    () => import('react-pdf').then((mod) => mod.Page),
    { ssr: false }
);

// Import CSS only on client side
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PDFViewerProps {
    /** PDF viewer state */
    state: PDFViewerState;
    /** Handler for closing the viewer */
    onClose: () => void;
}

// Configure PDF.js worker - must be done at module level
if (typeof window !== 'undefined') {
    import('react-pdf').then((pdfjs) => {
        pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`;
    });
}

export function PDFViewer({ state, onClose }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    // Ensure we're on the client before rendering PDF
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Update page when target page changes
    useEffect(() => {
        if (state.targetPage) {
            setCurrentPage(state.targetPage);
        }
    }, [state.targetPage]);

    // Handle document load success
    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setIsLoading(false);
        setError(null);

        // Jump to target page if specified
        if (state.targetPage && state.targetPage <= numPages) {
            setCurrentPage(state.targetPage);
        }
    }, [state.targetPage]);

    // Handle document load error
    const onDocumentLoadError = useCallback((error: Error) => {
        console.error('PDF load error:', error);
        setError('Failed to load PDF document');
        setIsLoading(false);
    }, []);

    // Navigation handlers
    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(numPages, prev + 1));
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= numPages) {
            setCurrentPage(page);
        }
    };

    // Zoom handlers
    const zoomIn = () => {
        setScale(prev => Math.min(2.0, prev + 0.2));
    };

    const zoomOut = () => {
        setScale(prev => Math.max(0.5, prev - 0.2));
    };

    const resetZoom = () => {
        setScale(1.0);
    };

    if (!state.isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            aria-label="Close PDF viewer"
                        >
                            <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div>
                            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                                {state.documentName || 'PDF Document'}
                            </h3>
                            {state.targetPage && (
                                <p className="text-xs text-blue-500">
                                    Cited on page {state.targetPage}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Zoom controls */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={zoomOut}
                            disabled={scale <= 0.5}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                            aria-label="Zoom out"
                        >
                            <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>
                        <button
                            onClick={resetZoom}
                            className="px-2 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                        >
                            {Math.round(scale * 100)}%
                        </button>
                        <button
                            onClick={zoomIn}
                            disabled={scale >= 2.0}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                            aria-label="Zoom in"
                        >
                            <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* PDF Content */}
                <div className="flex-1 overflow-auto p-4">
                    {!isClient ? (
                        <div className="flex items-center justify-center h-full">
                            <motion.div
                                className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-red-500">
                                <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <p>{error}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <Document
                                file={state.documentUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={onDocumentLoadError}
                                loading={
                                    <div className="flex items-center justify-center p-8">
                                        <motion.div
                                            className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        />
                                    </div>
                                }
                            >
                                <Page
                                    pageNumber={currentPage}
                                    scale={scale}
                                    className="shadow-lg"
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                />
                            </Document>
                        </div>
                    )}

                    {/* Highlight overlay */}
                    {state.highlightText && !isLoading && !error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700"
                        >
                            <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                                Cited Text:
                            </p>
                            <p className="text-sm text-yellow-900 dark:text-yellow-100 italic">
                                &quot;{state.highlightText}&quot;
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Footer with page navigation */}
                <div className="flex items-center justify-center gap-4 px-4 py-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage <= 1}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                        aria-label="Previous page"
                    >
                        <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min={1}
                            max={numPages}
                            value={currentPage}
                            onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                            className="w-12 px-2 py-1 text-center text-sm bg-slate-100 dark:bg-slate-700 
                         text-slate-900 dark:text-slate-100 rounded border border-slate-200 dark:border-slate-600
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            of {numPages}
                        </span>
                    </div>

                    <button
                        onClick={goToNextPage}
                        disabled={currentPage >= numPages}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                        aria-label="Next page"
                    >
                        <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
