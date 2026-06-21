'use client';

import { useState, useCallback, useEffect } from 'react';

/** localStorage 存储键名 */
const STORAGE_KEY = 'kaixiang-votes';

/** 投票类型：赞成 / 反对 */
export type VoteValue = 'up' | 'down';
/** 投票映射表：应用 ID → 投票值 */
export type VoteMap = Record<string, VoteValue>;

/** 投票统计 */
export interface VoteStats {
    up: number;
    down: number;
    total: number;
}

/**
 * 从 localStorage 加载用户投票记录
 * @returns 投票映射表
 */
function loadVotes(): VoteMap {
    if (typeof window === 'undefined') return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (typeof parsed === 'object' && parsed !== null) {
                return parsed as VoteMap;
            }
        }
    } catch {
        // ignore parse errors
    }
    return {};
}

/**
 * 保存用户投票记录到 localStorage
 * @param votes - 投票映射表
 */
function saveVotes(votes: VoteMap): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
    } catch {
        // ignore storage errors
    }
}

/**
 * 应用投票 Hook — 用户可以对应用投赞成/反对票，数据保存在 localStorage
 * @returns { votes, vote, getStats }
 */
export function useVotes() {
    const [votes, setVotes] = useState<VoteMap>(() => {
        if (typeof window !== 'undefined') {
            return loadVotes();
        }
        return {};
    });

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                try {
                    setVotes(e.newValue ? JSON.parse(e.newValue) : {});
                } catch {}
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    /**
     * 对指定应用投票（切换投票：再次点击相同值取消投票）
     * @param appId - 应用 ID
     * @param value - 赞成（up）或反对（down）
     */
    const vote = useCallback((appId: string, value: VoteValue) => {
        setVotes(prev => {
            if (prev[appId] === value) return prev;
            const next = { ...prev, [appId]: value };
            saveVotes(next);
            return next;
        });
    }, []);

    /**
     * 获取指定应用的投票统计
     * @param appId - 应用 ID
     * @returns 统计对象（up/down/total）
     */
    const getStats = useCallback((appId: string): VoteStats => {
        const v = votes[appId];
        if (v === 'up') return { up: 1, down: 0, total: 1 };
        if (v === 'down') return { up: 0, down: 1, total: 1 };
        return { up: 0, down: 0, total: 0 };
    }, [votes]);

    return { votes, vote, getStats };
}
