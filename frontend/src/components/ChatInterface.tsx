'use client';

/**
 * ChatInterface Component
 * Main chat container with message list, input, tool call indicators, and generative UI.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, Citation, StreamEvent, ActiveToolCall, PDFViewerState, UIComponent } from '@/lib/types';
import { streamChat, getPDFUrl } from '@/lib/api';
import { generateId } from '@/lib/utils';
import { MessageBubble, TypingIndicator } from './MessageBubble';
import { ToolCallIndicator } from './LoadingIndicator';
import { PDFViewer } from './PDFViewer';
import { ThemeToggle } from './ThemeToggle';
import { GenerativeUIRenderer } from './GenerativeUI';

export function ChatInterface() {
    // Chat state
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingContent, setStreamingContent] = useState('');
    const [pendingCitations, setPendingCitations] = useState<Citation[]>([]);
    const [pendingUIComponents, setPendingUIComponents] = useState<UIComponent[]>([]);
    const [activeToolCalls, setActiveToolCalls] = useState<ActiveToolCall[]>([]);
    const [error, setError] = useState<string | null>(null);

    // PDF viewer state
    const [pdfViewerState, setPdfViewerState] = useState<PDFViewerState>({
        isOpen: false,
        documentUrl: null,
        targetPage: null,
        highlightText: null,
        documentName: null,
    });

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Auto-scroll to bottom when messages change
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingContent, scrollToBottom]);

    // Handle stream events
    const handleStreamEvent = useCallback((event: StreamEvent) => {
        switch (event.type) {
            case 'text_chunk':
                if (event.content) {
                    setStreamingContent(prev => prev + event.content);
                }
                break;

            case 'citation':
                if (event.citation) {
                    setPendingCitations(prev => {
                        // Avoid duplicates
                        if (prev.some(c => c.id === event.citation!.id)) {
                            return prev;
                        }
                        return [...prev, event.citation!];
                    });
                }
                break;

            case 'tool_call':
                if (event.tool_call) {
                    const { tool, status, message } = event.tool_call;
                    setActiveToolCalls(prev => {
                        // Update existing or add new
                        const existing = prev.find(t => t.tool === tool);
                        if (existing) {
                            return prev.map(t =>
                                t.tool === tool
                                    ? { ...t, status, message: message || t.message }
                                    : t
                            );
                        }
                        return [...prev, { tool, status, message: message || '', timestamp: new Date() }];
                    });
                }
                break;

            case 'ui_component':
                if (event.component_type && event.component_data) {
                    setPendingUIComponents(prev => [
                        ...prev,
                        { type: event.component_type!, data: event.component_data! }
                    ]);
                }
                break;

            case 'complete':
                // Finalize the streaming message
                break;

            case 'error':
                setError(event.content || 'An error occurred');
                break;
        }
    }, []);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const query = inputValue.trim();
        if (!query || isLoading) return;

        // Reset state
        setInputValue('');
        setError(null);
        setStreamingContent('');
        setPendingCitations([]);
        setPendingUIComponents([]);
        setActiveToolCalls([]);
        setIsLoading(true);

        // Add user message
        const userMessage: Message = {
            id: generateId(),
            role: 'user',
            content: query,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);

        try {
            // Start streaming
            abortControllerRef.current = await streamChat(
                query,
                handleStreamEvent,
                (err) => {
                    setError(err.message);
                    setIsLoading(false);
                },
                () => {
                    // Stream complete - add assistant message
                    setMessages(prev => [...prev, {
                        id: generateId(),
                        role: 'assistant',
                        content: '', // Will be replaced by final content
                        citations: [],
                        uiComponents: [],
                        timestamp: new Date(),
                    }]);
                    setIsLoading(false);
                }
            );
        } catch (err) {
            setError((err as Error).message);
            setIsLoading(false);
        }
    };

    // Finalize streaming message when content is complete
    useEffect(() => {
        if (!isLoading && streamingContent) {
            setMessages(prev => {
                // Update the last message with streaming content
                const newMessages = [...prev];
                const lastIndex = newMessages.length - 1;
                if (lastIndex >= 0 && newMessages[lastIndex].role === 'assistant') {
                    newMessages[lastIndex] = {
                        ...newMessages[lastIndex],
                        content: streamingContent,
                        citations: pendingCitations,
                        uiComponents: pendingUIComponents,
                        isStreaming: false,
                    };
                }
                return newMessages;
            });
            setStreamingContent('');
            setPendingCitations([]);
            setPendingUIComponents([]);
            setActiveToolCalls([]);
        }
    }, [isLoading, streamingContent, pendingCitations, pendingUIComponents]);

    // Handle citation click
    const handleCitationClick = useCallback((citation: Citation) => {
        setPdfViewerState({
            isOpen: true,
            documentUrl: getPDFUrl(citation.document),
            targetPage: citation.page,
            highlightText: citation.text_snippet,
            documentName: citation.document,
        });
    }, []);

    // Handle PDF viewer close
    const handlePdfClose = useCallback(() => {
        setPdfViewerState(prev => ({
            ...prev,
            isOpen: false,
        }));
    }, []);

    // Handle input keydown (submit on Enter, except with Shift)
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Cancel streaming
    const handleCancel = () => {
        abortControllerRef.current?.abort();
        setIsLoading(false);
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
            {/* Chat Panel */}
            <motion.div
                className="flex flex-col"
                animate={{
                    width: pdfViewerState.isOpen ? '60%' : '100%',
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
                {/* Header */}
                <header className="flex items-center justify-between px-4 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                            AI Search
                        </h1>
                    </div>
                    <ThemeToggle />
                </header>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                    <div className="max-w-3xl mx-auto min-h-full flex flex-col justify-end">
                        {/* Welcome message when no messages */}
                        {messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-12"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    How can I help you today?
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 mb-6">
                                    Ask me anything about your documents. I&apos;ll search through PDFs and cite my sources.
                                </p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {[
                                        'What does the research say about climate change?',
                                        'Explain AI technology trends',
                                        'Summarize the research findings',
                                    ].map((suggestion, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setInputValue(suggestion)}
                                            className="px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 
                                 rounded-lg border border-slate-200 dark:border-slate-700
                                 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Messages */}
                        {messages.map((message) => (
                            <div key={message.id}>
                                <MessageBubble
                                    message={message}
                                    onCitationClick={handleCitationClick}
                                />
                                {/* Render UI components for assistant messages */}
                                {message.role === 'assistant' && message.uiComponents && message.uiComponents.length > 0 && (
                                    <div className="ml-0 mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {message.uiComponents.map((component, idx) => (
                                            <GenerativeUIRenderer
                                                key={idx}
                                                type={component.type}
                                                data={component.data}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Streaming message */}
                        {isLoading && streamingContent && (
                            <div>
                                <MessageBubble
                                    message={{
                                        id: 'streaming',
                                        role: 'assistant',
                                        content: streamingContent,
                                        citations: pendingCitations,
                                        timestamp: new Date(),
                                        isStreaming: true,
                                    }}
                                    onCitationClick={handleCitationClick}
                                />
                                {/* Render pending UI components during streaming */}
                                {pendingUIComponents.length > 0 && (
                                    <div className="ml-0 mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {pendingUIComponents.map((component, idx) => (
                                            <GenerativeUIRenderer
                                                key={idx}
                                                type={component.type}
                                                data={component.data}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tool call indicators */}
                        <AnimatePresence>
                            {activeToolCalls.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="mb-4 space-y-2"
                                >
                                    {activeToolCalls.map((toolCall) => (
                                        <ToolCallIndicator
                                            key={toolCall.tool}
                                            tool={toolCall.tool}
                                            status={toolCall.status}
                                            message={toolCall.message}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Typing indicator before any content streams */}
                        {isLoading && !streamingContent && activeToolCalls.length === 0 && (
                            <TypingIndicator />
                        )}

                        {/* Error message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg"
                            >
                                <p className="font-medium">Error</p>
                                <p className="text-sm">{error}</p>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="px-4 py-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                    <form
                        onSubmit={handleSubmit}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="relative flex items-end gap-2">
                            <div className="flex-1 relative">
                                <textarea
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask anything..."
                                    disabled={isLoading}
                                    rows={1}
                                    className="w-full px-4 py-3 pr-12 bg-slate-100 dark:bg-slate-700 
                             text-slate-900 dark:text-white placeholder-slate-400
                             rounded-xl border border-slate-200 dark:border-slate-600
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             resize-none transition-colors disabled:opacity-50"
                                    style={{ minHeight: '48px', maxHeight: '120px' }}
                                />
                            </div>

                            {isLoading ? (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                             transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <p className="mt-2 text-xs text-center text-slate-400">
                            AI responses include citations to source documents. Click [1] to view the source.
                        </p>
                    </form>
                </div>
            </motion.div>

            {/* PDF Viewer Panel */}
            <AnimatePresence>
                {pdfViewerState.isOpen && (
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '40%' }}
                        exit={{ width: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="hidden md:block h-full overflow-hidden"
                    >
                        <PDFViewer state={pdfViewerState} onClose={handlePdfClose} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile PDF Viewer Overlay */}
            <AnimatePresence>
                {pdfViewerState.isOpen && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="md:hidden fixed inset-0 z-50 bg-white dark:bg-slate-900"
                    >
                        <PDFViewer state={pdfViewerState} onClose={handlePdfClose} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
