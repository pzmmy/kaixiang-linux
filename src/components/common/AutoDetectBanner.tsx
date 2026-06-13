'use client';

import { useEffect, useState, useCallback } from 'react';
import type { DistroId } from '@/lib/data';

const STORAGE_KEY = 'kaixiang-auto-detect-dismissed';

/**
 * User-Agent keyword → distro ID mapping.
 * Order matters: check broader/more-specific matches first.
 */
const UA_MAP: Array<[RegExp, DistroId]> = [
    [/UOS/i, 'uos'],
    [/Deepin/i, 'deepin'],
    [/openSUSE/i, 'opensuse'],
    [/Arch\s*Linux/i, 'arch'],
    [/Fedora/i, 'fedora'],
    [/Debian/i, 'debian'],
    [/Ubuntu/i, 'ubuntu'],
];

/** Friendly display names for detected distros */
const DISTRO_LABELS: Record<DistroId, string> = {
    ubuntu: 'Ubuntu',
    debian: 'Debian',
    arch: 'Arch Linux',
    fedora: 'Fedora',
    opensuse: 'OpenSUSE',
    nix: 'NixOS',
    flatpak: 'Flatpak',
    snap: 'Snap',
    homebrew: 'Homebrew',
    deepin: 'Deepin',
    uos: 'UOS 统信',
};

function detectDistroFromUA(): DistroId | null {
    if (typeof window === 'undefined') return null;
    const ua = window.navigator.userAgent;
    for (const [pattern, distroId] of UA_MAP) {
        if (pattern.test(ua)) {
            return distroId;
        }
    }
    return null;
}

export function AutoDetectBanner({
    detectedDistro,
    onDismiss,
}: {
    detectedDistro: DistroId;
    onDismiss: () => void;
}) {
    const label = DISTRO_LABELS[detectedDistro] ?? detectedDistro;

    return (
        <div
            role="alert"
            className="auto-detect-banner"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 500,
                position: 'relative',
                zIndex: 9999,
                animation: 'autoDetectSlideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: '0 2px 12px rgba(16, 185, 129, 0.3)',
            }}
        >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>🐧</span>
            <span>
                检测到你可能使用 <strong>{label}</strong>，已自动切换
            </span>
            <button
                onClick={onDismiss}
                aria-label="关闭提示"
                style={{
                    marginLeft: '8px',
                    background: 'rgba(255,255,255,0.25)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 700,
                    lineHeight: 1,
                    transition: 'background 0.15s',
                    flexShrink: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
            >
                ✕
            </button>
        </div>
    );
}

/**
 * Hook: run auto-detection once on mount.
 * Returns the detected DistroId (or null if none) and a dismiss handler.
 */
export function useAutoDetect(): {
    detectedDistro: DistroId | null;
    isDismissed: boolean;
    dismiss: () => void;
} {
    const [detectedDistro, setDetectedDistro] = useState<DistroId | null>(null);
    const [isDismissed, setIsDismissed] = useState(true); // start dismissed, show only after detection

    useEffect(() => {
        // Check localStorage first
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'true') {
                setIsDismissed(true);
                return;
            }
        } catch {
            // localStorage unavailable, treat as not dismissed
        }

        // Attempt UA detection
        const distro = detectDistroFromUA();
        if (distro) {
            setDetectedDistro(distro);
            setIsDismissed(false);
        } else {
            setIsDismissed(true);
        }
    }, []);

    const dismiss = useCallback(() => {
        setIsDismissed(true);
        try {
            localStorage.setItem(STORAGE_KEY, 'true');
        } catch {
            // ignore
        }
    }, []);

    return { detectedDistro, isDismissed, dismiss };
}
