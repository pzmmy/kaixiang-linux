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

    it('Arch 脚本应包含 pacman、fcitx5 和 archlinuxcn 源', () => {
        const script = generateInitScript('arch');
        expect(script).toContain('pacman');
        expect(script).toContain('wqy-microhei');
        expect(script).toContain('fcitx5');
        expect(script).toContain('archlinuxcn');
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

    it('应包含开发工具镜像配置（pip/npm/go/docker）', () => {
        const script = generateInitScript('ubuntu');
        expect(script).toContain('pip 已换清华源');
        expect(script).toContain('npm 已换淘宝源');
        expect(script).toContain('Go 已换代理');
        expect(script).toContain('Docker 镜像加速已配置');
        expect(script).toContain('开发工具镜像配置完成');
    });

    it('不传 mirrorId 时默认使用清华 Flatpak 源', () => {
        const script = generateInitScript('ubuntu');
        expect(script).toContain('mirrors.tuna.tsinghua.edu.cn/flathub');
    });

    it('传 mirrorId=ustc 时使用中科大 Flatpak 源', () => {
        const script = generateInitScript('ubuntu', 'ustc');
        expect(script).toContain('mirrors.ustc.edu.cn/flathub');
        expect(script).not.toContain('tuna.tsinghua.edu.cn/flathub');
    });

    it('includeDocker=true 时应包含 Docker CE 安装步骤', () => {
        const script = generateInitScript('ubuntu', undefined, true);
        expect(script).toContain('安装 Docker CE');
        expect(script).toContain('get-docker.sh');
        expect(script).toContain('usermod -aG docker');
    });

    it('includeDocker=false 时不应包含 Docker CE 安装', () => {
        const script = generateInitScript('ubuntu', undefined, false);
        expect(script).not.toContain('安装 Docker CE');
        expect(script).not.toContain('get-docker.sh');
    });

    it('includeDocker 不传时默认为 false', () => {
        const script = generateInitScript('ubuntu');
        expect(script).not.toContain('安装 Docker CE');
    });
});
