import { ReactNode } from 'react';

/**
 * 搜索关键词高亮 — 将匹配文本包裹在 <mark> 标签中
 *
 * @param text - 原始文本
 * @param query - 搜索关键词（大小写不敏感）
 * @returns 带有 <mark> 高亮的 ReactNode
 */
export function highlightSearchText(text: string, query: string): ReactNode {
    if (!query || !query.trim()) return text;

    // Escape regex special chars in the query
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

    if (parts.length <= 1) return text;

    return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
            ? <mark key={i} className="bg-amber-400/20 text-amber-300 rounded-sm px-0.5">{part}</mark>
            : part
    );
}
