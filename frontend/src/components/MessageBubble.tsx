'use client';

/**
 * MessageBubble Component
 * Displays a chat message with inline citations and source cards.
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Message, Citation } from '@/lib/types';
import { parseCitations, formatTime } from '@/lib/utils';
import { CitationBadge } from './CitationBadge';
import { SourceCardList } from './SourceCard';
import { StreamingCursor } from './LoadingIndicator';

interface MessageBubbleProps {
    /** Message data */
    message: Message;
    /** Click handler for citations */
    onCitationClick: (citation: Citation) => void;
}

export function MessageBubble({ message, onCitationClick }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    // Create a map of citation IDs to citation data for quick lookup
    const citationMap = useMemo(() => {
        const map = new Map<number, Citation>();
        message.citations?.forEach(c => map.set(c.id, c));
        return map;
    }, [message.citations]);

    // Parse message content into segments with citations
    const contentSegments = useMemo(() => {
        return parseCitations(message.content);
    }, [message.content]);

    // Handle citation badge click
    const handleCitationClick = (citationId: number, citation?: Citation) => {
        const fullCitation = citation || citationMap.get(citationId);
        if (fullCitation) {
            onCitationClick(fullCitation);
        }
    };

    // Handle source card click
    const handleSourceCardClick = (citation: Citation) => {
        onCitationClick(citation);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div className={`max-w-[85%] ${isUser ? 'order-1' : ''}`}>
                {/* Message bubble */}
                <div
                    className={`px-4 py-3 rounded-2xl ${isUser
                            ? 'bg-blue-500 text-white rounded-br-md'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md shadow-sm border border-slate-200 dark:border-slate-700'
                        }`}
                >
                    {/* Message content with inline citations */}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {contentSegments.map((segment, index) => {
                            if (segment.type === 'citation' && segment.citationId) {
                                return (
                                    <CitationBadge
                                        key={`citation-${index}-${segment.citationId}`}
                                        citationId={segment.citationId}
                                        citation={citationMap.get(segment.citationId)}
                                        onClick={handleCitationClick}
                                    />
                                );
                            }
                            return <span key={`text-${index}`}>{segment.content}</span>;
                        })}

                        {/* Streaming cursor */}
                        {message.isStreaming && <StreamingCursor />}
                    </div>
                </div>

                {/* Timestamp */}
                <div className={`mt-1 text-xs text-slate-400 ${isUser ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.timestamp)}
                </div>

                {/* Source cards for assistant messages with citations */}
                {!isUser && message.citations && message.citations.length > 0 && !message.isStreaming && (
                    <SourceCardList
                        citations={message.citations}
                        onCitationClick={handleSourceCardClick}
                    />
                )}
            </div>
        </motion.div>
    );
}

/**
 * TypingIndicator Component
 * Shown when AI is about to respond.
 */
export function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-start mb-4"
        >
            <div className="px-4 py-3 bg-white dark:bg-slate-800 rounded-2xl rounded-bl-md shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-slate-400 rounded-full"
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.15,
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
