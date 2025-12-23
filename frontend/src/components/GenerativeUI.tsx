'use client';

/**
 * GenerativeUI Components
 * Streamable UI components for displaying data alongside chat responses.
 */

import { motion } from 'framer-motion';

/**
 * InfoCard Component
 * Displays key-value information in a card format.
 */
interface InfoCardProps {
    title: string;
    items: { label: string; value: string | number }[];
    icon?: string;
}

export function InfoCard({ title, items, icon = '📊' }: InfoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 
                 rounded-xl p-4 border border-blue-200 dark:border-blue-800 shadow-sm"
        >
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{icon}</span>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
            </div>
            <div className="space-y-2">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between items-center"
                    >
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.value}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

/**
 * DataTable Component
 * Displays tabular data with animations.
 */
interface DataTableProps {
    headers: string[];
    rows: (string | number)[][];
    title?: string;
}

export function DataTable({ headers, rows, title }: DataTableProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
        >
            {title && (
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/50">
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <motion.tr
                                key={rowIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: rowIndex * 0.05 }}
                                className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            >
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="px-4 py-3 text-slate-900 dark:text-slate-100">
                                        {cell}
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}

/**
 * StatCard Component
 * Displays a single statistic with trend indicator.
 */
interface StatCardProps {
    label: string;
    value: string | number;
    change?: number;
    icon?: string;
}

export function StatCard({ label, value, change, icon = '📈' }: StatCardProps) {
    const isPositive = change !== undefined && change >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{icon}</span>
                {change !== undefined && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${isPositive
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }`}>
                        {isPositive ? '+' : ''}{change}%
                    </span>
                )}
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
        </motion.div>
    );
}

/**
 * ProgressCard Component
 * Displays progress towards a goal.
 */
interface ProgressCardProps {
    label: string;
    current: number;
    total: number;
    unit?: string;
}

export function ProgressCard({ label, current, total, unit = '' }: ProgressCardProps) {
    const percentage = Math.min(100, (current / total) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                    {current}{unit} / {total}{unit}
                </span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                />
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 text-right">
                {percentage.toFixed(0)}% complete
            </div>
        </motion.div>
    );
}

/**
 * ChartPlaceholder Component
 * Placeholder for future chart implementation.
 */
interface ChartPlaceholderProps {
    title: string;
    type: 'bar' | 'line' | 'pie';
}

export function ChartPlaceholder({ title, type }: ChartPlaceholderProps) {
    const icons = {
        bar: '📊',
        line: '📈',
        pie: '🥧',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 
                 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{icons[type]}</span>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
            </div>
            <div className="h-32 flex items-center justify-center">
                <div className="text-center text-slate-400 dark:text-slate-500">
                    <div className="text-4xl mb-2">{icons[type]}</div>
                    <p className="text-sm">Chart visualization</p>
                </div>
            </div>
        </motion.div>
    );
}

/**
 * GenerativeUIRenderer Component
 * Renders generative UI components based on type and data.
 */
interface GenerativeUIRendererProps {
    type: string;
    data: Record<string, unknown>;
}

export function GenerativeUIRenderer({ type, data }: GenerativeUIRendererProps) {
    switch (type) {
        case 'info_card':
            return (
                <InfoCard
                    title={data.title as string}
                    items={data.items as { label: string; value: string | number }[]}
                    icon={data.icon as string | undefined}
                />
            );

        case 'data_table':
            return (
                <DataTable
                    headers={data.headers as string[]}
                    rows={data.rows as (string | number)[][]}
                    title={data.title as string | undefined}
                />
            );

        case 'stat_card':
            return (
                <StatCard
                    label={data.label as string}
                    value={data.value as string | number}
                    change={data.change as number | undefined}
                    icon={data.icon as string | undefined}
                />
            );

        case 'progress_card':
            return (
                <ProgressCard
                    label={data.label as string}
                    current={data.current as number}
                    total={data.total as number}
                    unit={data.unit as string | undefined}
                />
            );

        case 'chart':
            return (
                <ChartPlaceholder
                    title={data.title as string}
                    type={data.chartType as 'bar' | 'line' | 'pie'}
                />
            );

        default:
            return null;
    }
}
