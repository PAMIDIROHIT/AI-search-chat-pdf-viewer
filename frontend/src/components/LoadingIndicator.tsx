'use client';

/**
 * LoadingIndicator Component
 * Animated typing indicator for loading states.
 */

import { motion } from 'framer-motion';

interface LoadingIndicatorProps {
    /** Optional text to display alongside dots */
    text?: string;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
}

export function LoadingIndicator({ text, size = 'md' }: LoadingIndicatorProps) {
    const dotSize = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-3 h-3',
    }[size];

    const containerClass = {
        sm: 'gap-1',
        md: 'gap-1.5',
        lg: 'gap-2',
    }[size];

    return (
        <div className="flex items-center gap-2">
            {text && (
                <span className="text-slate-500 dark:text-slate-400 text-sm">
                    {text}
                </span>
            )}
            <div className={`flex ${containerClass}`}>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className={`${dotSize} bg-blue-500 rounded-full`}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

/**
 * StreamingCursor Component
 * Blinking cursor effect for streaming text.
 */
export function StreamingCursor() {
    return (
        <motion.span
            className="inline-block w-0.5 h-5 bg-blue-500 ml-0.5"
            animate={{ opacity: [1, 0, 1] }}
            transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "linear",
            }}
        />
    );
}

/**
 * PulseLoader Component
 * Spinning loader for page-level loading states.
 */
export function PulseLoader() {
    return (
        <div className="flex items-center justify-center p-8">
            <motion.div
                className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
        </div>
    );
}

/**
 * ToolCallIndicator Component
 * Shows the current tool being executed.
 */
interface ToolCallIndicatorProps {
    tool: string;
    status: 'running' | 'completed' | 'error';
    message: string;
}

export function ToolCallIndicator({ tool, status, message }: ToolCallIndicatorProps) {
    const icons: Record<string, string> = {
        thinking: '🧠',
        searching_documents: '🔍',
        retrieving_pdf: '📄',
        analyzing_content: '📊',
        generating_response: '✨',
    };

    const icon = icons[tool] || '⚙️';

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${status === 'completed'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : status === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
        >
            <span className="text-base">{icon}</span>
            <span className="flex-1">{message}</span>
            {status === 'running' && (
                <motion.div
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
            )}
            {status === 'completed' && (
                <span className="text-green-500">✓</span>
            )}
            {status === 'error' && (
                <span className="text-red-500">✗</span>
            )}
        </motion.div>
    );
}
