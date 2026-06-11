'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { mirrorSources } from '@/lib/data';

export function MirrorSelector({
    selectedMirror,
    onSelect
}: {
    selectedMirror: string;
    onSelect: (id: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
    const current = mirrorSources.find(m => m.id === selectedMirror) || mirrorSources[0];

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
            });
        }
    }, [isOpen]);

    const handleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (id: string) => {
        onSelect(id);
        setIsOpen(false);
    };

    const dropdown = (
        <div
            className="fixed z-[9999] min-w-[200px] bg-[var(--bg-primary)] border border-[var(--border-primary)]/30 rounded-xl shadow-lg overflow-hidden"
            style={{
                top: dropdownPos.top,
                right: dropdownPos.right,
                animation: 'dropdownOpen 0.15s ease-out',
            }}
        >
            <div className="py-1">
                {mirrorSources.map((source) => (
                    <button
                        key={source.id}
                        onClick={() => handleSelect(source.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${selectedMirror === source.id
                            ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]'
                            : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]'
                            }`}
                    >
                        <div className="flex-1">
                            <div className="font-medium">{source.name}</div>
                            <div className="text-xs opacity-60">{source.description}</div>
                        </div>
                        {selectedMirror === source.id && (
                            <Check className="w-3.5 h-3.5 shrink-0" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <button
                ref={buttonRef}
                onClick={handleOpen}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                title={current.description}
            >
                <span className="hidden sm:inline whitespace-nowrap">{current.name}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && mounted && typeof document !== 'undefined' && createPortal(dropdown, document.body)}
        </>
    );
}
