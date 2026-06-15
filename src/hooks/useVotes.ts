'use client';

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'kaixiang-votes';

export type VoteValue = 'up' | 'down';
export type VoteMap = Record<string, VoteValue>;

export interface VoteStats {
    up: number;
    down: number;
    total: number;
}

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

function saveVotes(votes: VoteMap): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
    } catch {
        // ignore storage errors
    }
}

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

    const vote = useCallback((appId: string, value: VoteValue) => {
        setVotes(prev => {
            if (prev[appId] === value) return prev;
            const next = { ...prev, [appId]: value };
            saveVotes(next);
            return next;
        });
    }, []);

    const getStats = useCallback((appId: string): VoteStats => {
        const v = votes[appId];
        if (v === 'up') return { up: 1, down: 0, total: 1 };
        if (v === 'down') return { up: 0, down: 1, total: 1 };
        return { up: 0, down: 0, total: 0 };
    }, [votes]);

    return { votes, vote, getStats };
}
