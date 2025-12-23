'use client';

/**
 * SourceCard Component
 * Display card for cited documents at the bottom of AI responses.
 */

import { motion } from 'framer-motion';
import { Citation } from '@/lib/types';
import { truncateText } from '@/lib/utils';

interface SourceCardProps {
    /** Citation data */
    citation: Citation;
    /** Index for animation staggering */
    index: number;
    /** Click handler to open PDF viewer */
    onClick: (citation: Citation) => void;
}

export function SourceCard({ citation, index, onClick }: SourceCardProps) {
    return (
        <motion.button
            onClick={() => onClick(citation)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex flex-col w-full text-left p-3 
                 bg-white dark:bg-slate-800 
                 border border-slate-200 dark:border-slate-700 
                 rounded-lg shadow-sm
                 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600
                 transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
            {/* Header with citation number and document name */}
            <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-5 h-5 
                         text-xs font-bold bg-blue-500 text-white rounded">
                    {citation.id}
                </span>
                <span className="flex-1 text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {citation.document}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                    Page {citation.page}
                </span>
            </div>

            {/* Snippet preview */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {truncateText(citation.text_snippet, 150)}
            </p>

            {/* Relevance indicator */}
            {citation.relevance_score !== undefined && (
                <div className="mt-2 flex items-center gap-1">
                    <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${citation.relevance_score * 100}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                        />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {Math.round(citation.relevance_score * 100)}% match
                    </span>
                </div>
            )}
        </motion.button>
    );
}

/**
 * SourceCardList Component
 * Container for multiple source cards.
 */
interface SourceCardListProps {
    citations: Citation[];
    onCitationClick: (citation: Citation) => void;
}

export function SourceCardList({ citations, onCitationClick }: SourceCardListProps) {
    if (citations.length === 0) return null;

    return (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                Sources
            </h4>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {citations.map((citation, index) => (
                    <SourceCard
                        key={`${citation.document}-${citation.page}-${citation.id}`}
                        citation={citation}
                        index={index}
                        onClick={onCitationClick}
                    />
                ))}
            </div>
        </div>
    );
}
