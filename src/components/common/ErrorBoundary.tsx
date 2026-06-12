'use client';

import { Component, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-8">
                    <div className="text-center max-w-md">
                        <div className="text-5xl mb-6">⚠️</div>
                        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                            开箱 Linux 遇到了一点问题
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mb-6">
                            页面渲染异常，请刷新重试。
                            <br />
                            如果问题持续，请检查浏览器控制台。
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-5 py-2.5 rounded-lg text-sm font-medium
                                bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
                        >
                            刷新页面
                        </button>
                        {this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="text-xs text-[var(--text-muted)] cursor-pointer">
                                    技术详情
                                </summary>
                                <pre className="mt-2 p-3 rounded bg-[var(--bg-secondary)] text-xs text-[var(--text-muted)] overflow-auto max-h-40">
                                    {this.state.error.message}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
