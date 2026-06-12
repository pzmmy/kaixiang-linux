import { describe, it, expect } from 'vitest';
import { generateInitScript, type DistroId } from '@/lib/data';

describe('generateInitScript', () => {
    it('Ubuntu 脚本应包含换源和字体安装', () => {
        const script = generateInitScript('ubuntu');
        expect(script).toContain('清华源');
        expect(script).toContain('wqy-microhei');
        expect(script).toContain('fcitx5');
        expect(script).toContain('GTK_IM_MODULE');
    });

    it('Deepin 脚本应与 Ubuntu 功能一致（apt 系）', () => {
        const ubuntu = generateInitScript('ubuntu');
        const deepin = generateInitScript('deepin');
        // Both should contain apt-based operations
        expect(deepin).toContain('wqy-microhei');
        expect(deepin).toContain('fcitx5');
        expect(deepin).toContain('GTK_IM_MODULE');
        expect(deepin).toContain('sudo apt');
    });

    it('Debian 脚本功能应与 Ubuntu 一致', () => {
        const ubuntu = generateInitScript('ubuntu');
        const debian = generateInitScript('debian');
        expect(debian).toContain('wqy-microhei');
        expect(debian).toContain('fcitx5');
    });

    it('Arch 脚本应包含 pacman 和 fcitx5', () => {
        const script = generateInitScript('arch');
        expect(script).toContain('pacman');
        expect(script).toContain('wqy-microhei');
        expect(script).toContain('fcitx5');
    });

    it('Fedora 脚本应包含 dnf', () => {
        const script = generateInitScript('fedora');
        expect(script).toContain('dnf');
        expect(script).toContain('wqy-microhei');
    });

    it('脚本应包含 #!/bin/bash shebang', () => {
        const script = generateInitScript('ubuntu');
        expect(script.startsWith('#!/bin/bash')).toBe(true);
    });

    it('所有脚本应 set -euo pipefail', () => {
        ['ubuntu', 'arch', 'fedora', 'opensuse'].forEach(id => {
            expect(generateInitScript(id as DistroId)).toContain('set -euo pipefail');
        });
    });

    it('应包含生成日期', () => {
        const script = generateInitScript('ubuntu');
        expect(script).toContain(new Date().toISOString().split('T')[0]);
    });

    it('未知发行版应返回提示', () => {
        // @ts-expect-error - testing fallback
        const script = generateInitScript('nonexistent');
        expect(script).toContain('暂不支持');
    });
});
