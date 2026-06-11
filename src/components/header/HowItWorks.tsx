'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, X } from 'lucide-react';
import { analytics } from '@/lib/analytics';

// Help modal.
export function HowItWorks() {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [mounted, setMounted] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const handleOpen = () => {
        setIsClosing(false);
        setIsOpen(true);
        analytics.helpOpened();
    };

    const handleClose = () => {
        setIsClosing(true);
        analytics.helpClosed();
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 200);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.ctrlKey || e.altKey || e.metaKey) return;

            if (e.key === '?' || (e.shiftKey && e.key === '/')) {
                e.preventDefault();
                if (isOpen) {
                    handleClose();
                } else {
                    handleOpen();
                }
            }

            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const modal = (
        <>
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[99998]"
                onClick={handleClose}
                style={{
                    animation: isClosing
                        ? 'fadeOut 0.2s ease-out forwards'
                        : 'fadeIn 0.25s ease-out'
                }}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="how-it-works-title"
                className="fixed bg-[var(--bg-primary)] border border-[var(--border-primary)]/30 rounded-xl z-[99999]"
                style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '620px',
                    maxWidth: 'calc(100vw - 32px)',
                    maxHeight: 'min(85vh, 720px)',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: isClosing
                        ? 'modalSlideOut 0.2s ease-out forwards'
                        : 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    overflow: 'hidden',
                    boxShadow: '0 16px 48px -8px rgba(0, 0, 0, 0.3)',
                }}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-primary)]/15">
                    <h3 id="how-it-works-title" className="text-base font-semibold text-[var(--text-primary)]">
                        帮助
                    </h3>
                    <button
                        onClick={handleClose}
                        className="p-1.5 -mr-1 hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6" style={{ scrollbarGutter: 'stable' }}>

                    <section>
                        <h4 className="text-sm font-medium text-[var(--text-primary)] mb-4 pl-3 border-l-2 border-[var(--text-muted)]/30">快捷键</h4>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                            {[
                                ['↑↓←→', '在应用中导航'],
                                ['hjkl', 'Vim 风格导航'],
                                ['Space', '选中或取消应用'],
                                ['/', '聚焦搜索框'],
                                ['y', '复制安装命令'],
                                ['d', '下载安装脚本'],
                                ['c', '清除所有选择'],
                                ['t', '切换浅色/深色主题'],
                                ['Tab', '预览当前选择'],
                                ['Esc', '关闭此窗口'],
                                ['?', '显示此帮助'],
                                ['1 / 2', '切换 AUR 助手 (yay/paru)'],
                            ].map(([key, desc]) => (
                                <div key={key} className="flex items-center gap-3 text-sm">
                                    <kbd className="inline-flex items-center justify-center min-w-[52px] px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)]/20 rounded text-xs font-mono text-[var(--text-secondary)]">
                                        {key}
                                    </kbd>
                                    <span className="text-[var(--text-muted)]">{desc}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3 pl-3 border-l-2 border-[var(--text-muted)]/30">快速上手</h4>
                        <ol className="space-y-2 text-sm text-[var(--text-muted)] leading-relaxed">
                            <li>
                                <strong className="text-[var(--text-secondary)]">1. 选择发行版</strong> — 从顶部下拉菜单选择你的 Linux 发行版，开箱 Linux 会根据你选择的包管理器生成相应命令。
                            </li>
                            <li>
                                <strong className="text-[var(--text-secondary)]">2. 挑选软件</strong> — 浏览分类，点击软件即可选中。已选中的应用会高亮显示。支持键盘快捷键快速操作。
                            </li>
                            <li>
                                <strong className="text-[var(--text-secondary)]">3. 复制或下载</strong> — 复制安装命令到剪贴板，或下载完整的 Shell 安装脚本。下载的脚本包含错误处理，可一键安装多个软件。
                            </li>
                            <li>
                                <strong className="text-[var(--text-secondary)]">4. 在终端中运行</strong> — 打开终端，粘贴命令（Ctrl+Shift+V），按回车。脚本会自动完成剩余工作。
                            </li>
                        </ol>
                    </section>

                    <section>
                        <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3 pl-3 border-l-2 border-[var(--text-muted)]/30">注意事项</h4>
                        <ul className="space-y-2 text-sm text-[var(--text-muted)] leading-relaxed">
                            <li>
                                <strong className="text-[var(--text-secondary)]">灰色软件</strong> — 表示该软件不在当前发行版的官方仓库中。可切换到 Flatpak 或 Snap 包管理器，或悬停在信息图标上查看替代安装方式。
                            </li>
                            <li>
                                <strong className="text-[var(--text-secondary)]">Arch Linux 用户</strong> — 部分软件来自 AUR。开箱 Linux 使用 yay 或 paru 作为 AUR 助手，按 1 或 2 可随时切换。
                            </li>
                            <li>
                                <strong className="text-[var(--text-secondary)]">Homebrew 用户</strong> — 同时支持 macOS 和 Linux。图形界面应用（Casks）仅限 macOS，Linux 上会自动跳过。
                            </li>
                            <li>
                                <strong className="text-[var(--text-secondary)]">自动保存</strong> — 你的选择会自动保存在浏览器中。下次打开页面时，之前的选择仍然保留。
                            </li>
                            <li>
                                <strong className="var(--text-secondary)]">NixOS</strong> — 生成 `environment.systemPackages` 配置。如果选择了 unfree 软件，下载的脚本会包含 `allowUnfree` 注释说明。
                            </li>
                            <li>
                                <strong className="text-[var(--text-secondary)]">脚本安全</strong> — 下载的脚本是幂等的，包含错误处理和网络重试机制。用 <code className="px-1 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border-primary)]/20 rounded text-xs font-mono">bash kaixiang-*.sh</code> 安全运行。
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </>
    );

    return (
        <>
            <button
                ref={triggerRef}
                onClick={handleOpen}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs sm:text-sm transition-all duration-200 hover:scale-105 ${isOpen
                    ? 'bg-[var(--accent)]/20 text-[var(--text-primary)]'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
            >
                <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">帮助</span>
            </button>
            {isOpen && mounted && typeof document !== 'undefined' && createPortal(modal, document.body)}
        </>
    );
}
