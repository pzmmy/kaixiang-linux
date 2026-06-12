import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]" style={{ transition: 'background-color 0.5s' }}>
            <div className="text-center px-6">
                <div className="text-8xl mb-6 opacity-30">🐧</div>
                <h1 className="text-8xl font-bold text-[var(--accent)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    404
                </h1>
                <p className="text-xl text-[var(--text-secondary)] mb-2">
                    页面没找到
                </p>
                <p className="text-sm text-[var(--text-muted)] mb-8">
                    这个页面好像被 Linux 吞掉了
                </p>
                <Link
                    href="/kaixiang-linux/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
                    style={{ backgroundColor: 'var(--accent)' }}
                >
                    回首页装软件
                </Link>
            </div>
        </div>
    );
}
