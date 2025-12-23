'use client';

/**
 * CitationBadge Component
 * Clickable inline citation badge that opens PDF viewer.
 */

import { motion } from 'framer-motion';
import { Citation } from '@/lib/types';

interface CitationBadgeProps {
    /** Citation number to display */
    citationId: number;
    /** Full citation data (optional, for tooltip) */
    citation?: Citation;
    /** Click handler to open PDF viewer */
    onClick: (citationId: number, citation?: Citation) => void;
}

export function CitationBadge({ citationId, citation, onClick }: CitationBadgeProps) {
    return (
        <motion.button
            onClick={() => onClick(citationId, citation)}
            className="inline-flex items-center justify-center px-1.5 py-0.5 mx-0.5 
                 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 
                 text-blue-800 dark:text-blue-200 
                 rounded cursor-pointer 
                 hover:bg-blue-200 dark:hover:bg-blue-800/60 
                 transition-colors duration-150
                 border border-blue-200 dark:border-blue-700
                 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={citation ? `${citation.document} - Page ${citation.page}` : `Citation ${citationId}`}
        >
            {citationId}
        </motion.button>
    );
}

/**
 * CitationBadgeStatic Component
 * Non-interactive citation badge for reference lists.
 */
interface CitationBadgeStaticProps {
    citationId: number;
}

export function CitationBadgeStatic({ citationId }: CitationBadgeStaticProps) {
    return (
        <span className="inline-flex items-center justify-center px-1.5 py-0.5 mx-0.5 
                     text-xs font-medium bg-blue-100 dark:bg-blue-900/40 
                     text-blue-800 dark:text-blue-200 rounded
                     border border-blue-200 dark:border-blue-700">
            {citationId}
        </span>
    );
}
