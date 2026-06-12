import { describe, it, expect } from 'vitest';
import { generateInstallScript, generateCommandline } from '@/lib/generateInstallScript';
import { generateDebianScript } from '@/lib/scripts/debian';
import { generateNixConfig } from '@/lib/scripts/nix';

describe('generateInstallScript — 核心编排器', () => {
    it('未知发行版返回错误消息', () => {
        // @ts-expect-error - testing invalid input
        const script = generateInstallScript({ distroId: 'nonexistent', selectedAppIds: new Set() });
        expect(script).toContain('Error: Unknown distribution');
    });

    it('空选集返回 "No packages selected"', () => {
        const script = generateInstallScript({ distroId: 'ubuntu', selectedAppIds: new Set() });
        expect(script).toContain('No packages selected');
    });

    it('Ubuntu 生成 apt 安装脚本', () => {
        const script = generateInstallScript({ distroId: 'ubuntu', selectedAppIds: new Set(['firefox', 'vim']) });
        expect(script).toContain('install_pkg');
        expect(script).toContain('"Firefox"');
        expect(script).toContain('"Vim"');
        expect(script).toContain('print_summary');
    });

    it('Arch 生成 pacman 安装脚本', () => {
        const script = generateInstallScript({ distroId: 'arch', selectedAppIds: new Set(['firefox']) });
        expect(script).toContain('install_pkg');
        expect(script).toContain('firefox');
        expect(script).toContain('print_summary');
    });

    it('Arch 支持 yay/paru 切换', () => {
        const yayScript = generateInstallScript({ distroId: 'arch', selectedAppIds: new Set(['wechat']), helper: 'yay' });
        const paruScript = generateInstallScript({ distroId: 'arch', selectedAppIds: new Set(['wechat']), helper: 'paru' });
        expect(yayScript).toContain('"yay"');
        expect(paruScript).toContain('"paru"');
        expect(yayScript).toContain('wechat-bin');
    });

    it('Fedora 生成 dnf 安装脚本', () => {
        const script = generateInstallScript({ distroId: 'fedora', selectedAppIds: new Set(['firefox']) });
        expect(script).toContain('install_pkg');
        expect(script).toContain('firefox');
    });

    it('openSUSE 生成 zypper 安装脚本', () => {
        const script = generateInstallScript({ distroId: 'opensuse', selectedAppIds: new Set(['firefox']) });
        expect(script).toContain('install_pkg');
        expect(script).toContain('MozillaFirefox');
    });

    it('Flatpak 生成 flatpak install 脚本', () => {
        const script = generateInstallScript({ distroId: 'flatpak', selectedAppIds: new Set(['firefox']) });
        expect(script).toContain('flatpak install flathub -y');
    });

    it('Snap 生成 snap install 脚本（多软件用 &&）', () => {
        const script = generateInstallScript({ distroId: 'snap', selectedAppIds: new Set(['brave', 'chromium']) });
        expect(script).toContain('sudo snap install');
        expect(script).toContain('brave');
        expect(script).toContain('chromium');
    });

    it('Homebrew 区分 formulae 和 casks', () => {
        const script = generateInstallScript({ distroId: 'homebrew', selectedAppIds: new Set(['vim', 'firefox']) });
        expect(script).toContain('install_pkg');
        expect(script).toContain('"Vim"');
        expect(script).toContain('"Firefox"');
        expect(script).toContain('--cask');
    });

    it('Deepin/UOS 用 apt 脚本（与 Ubuntu 相同代码路径）', () => {
        const deepin = generateInstallScript({ distroId: 'deepin', selectedAppIds: new Set(['wechat', 'qq']) });
        const uos = generateInstallScript({ distroId: 'uos', selectedAppIds: new Set(['wechat', 'qq']) });
        expect(deepin).toContain('install_pkg');
        expect(deepin).toContain('com.tencent.wechat');
        expect(deepin).toContain('com.tencent.qq');
        expect(uos).toContain('install_pkg');
        expect(uos).toContain('print_summary');
    });

    it('包含 npm 目标的软件生成 npm 安装段', () => {
        const script = generateInstallScript({ distroId: 'ubuntu', selectedAppIds: new Set(['codex']) });
        expect(script).toContain('npm');
        expect(script).toContain('@openai/codex');
    });

    it('Nix 模式 npm 目标软件提示使用通用安装器', () => {
        const script = generateInstallScript({ distroId: 'nix', selectedAppIds: new Set(['gitee-cli']) });
        expect(script).toContain('Generic Installers');
    });

    it('Nix 模式：系统包 + npm 共存', () => {
        const script = generateInstallScript({ distroId: 'nix', selectedAppIds: new Set(['firefox', 'gemini-cli']) });
        expect(script).toContain('environment.systemPackages');
        expect(script).toContain('firefox');
        // gemini-cli has npm but not nix -> goes into uScript comment
        expect(script).toContain('gemini');
    });
});

describe('generateDebianScript', () => {
    it('生成 Debian 安装脚本', () => {
        const script = generateDebianScript([{ app: { id: 'vim', name: 'Vim', description: '', category: 'Dev: Editors', icon: { type: 'iconify', set: 'simple-icons', name: 'vim' }, targets: {}, size: 10 }, pkg: 'vim' }]);
        expect(script).toContain('Debian');
        expect(script).toContain('install_pkg "Vim" "vim"');
        expect(script).toContain('print_summary');
    });
});

describe('generateNixConfig', () => {
    it('空列表返回空消息', () => {
        expect(generateNixConfig([])).toContain('No packages selected');
    });

    it('生成 Nix 配置段', () => {
        const config = generateNixConfig([
            { app: { id: 'firefox', name: 'Firefox', description: '', category: 'Web Browsers', icon: { type: 'iconify', set: 'simple-icons', name: 'firefox' }, targets: {}, size: 100 }, pkg: 'firefox' },
            { app: { id: 'vim', name: 'Vim', description: '', category: 'Dev: Editors', icon: { type: 'iconify', set: 'simple-icons', name: 'vim' }, targets: {}, size: 10 }, pkg: 'vim' }
        ]);
        expect(config).toContain('environment.systemPackages');
        expect(config).toContain('firefox');
        expect(config).toContain('vim');
    });

    it('标记 unfree 包', () => {
        const config = generateNixConfig([
            { app: { id: 'vscode', name: 'VS Code', description: '', category: 'Dev: Editors', icon: { type: 'iconify', set: 'simple-icons', name: 'vscode' }, targets: {}, size: 100 }, pkg: 'vscode' },
            { app: { id: 'chrome', name: 'Chrome', description: '', category: 'Web Browsers', icon: { type: 'iconify', set: 'simple-icons', name: 'chrome' }, targets: {}, size: 100 }, pkg: 'google-chrome' }
        ]);
        expect(config).toContain('allowUnfree');
    });
});

describe('generateCommandline — 命令行预览', () => {
    it('空选集返回注释', () => {
        const cmd = generateCommandline({ distroId: 'ubuntu', selectedAppIds: new Set() });
        expect(cmd).toContain('No packages selected');
    });

    it('Ubuntu 返回 apt install 命令', () => {
        const cmd = generateCommandline({ distroId: 'ubuntu', selectedAppIds: new Set(['firefox', 'vim']) });
        expect(cmd).toContain('sudo apt install -y');
        expect(cmd).toContain('firefox');
        expect(cmd).toContain('vim');
    });

    it('Snap 多软件用 && 分隔', () => {
        const cmd = generateCommandline({ distroId: 'snap', selectedAppIds: new Set(['brave', 'chromium']) });
        expect(cmd).toContain('&&');
    });

    it('Homebrew 区分 formulae 和 casks', () => {
        const cmd = generateCommandline({ distroId: 'homebrew', selectedAppIds: new Set(['vim', 'firefox']) });
        expect(cmd).toContain('brew install vim');
        expect(cmd).toContain('--cask');
    });

    it('Arch 返回 yay 命令', () => {
        const cmd = generateCommandline({ distroId: 'arch', selectedAppIds: new Set(['firefox']) });
        expect(cmd).toContain('yay -S');
    });

    it('Fedora 返回 dnf 命令', () => {
        const cmd = generateCommandline({ distroId: 'fedora', selectedAppIds: new Set(['firefox']) });
        expect(cmd).toContain('sudo dnf install -y');
    });

    it('openSUSE 返回 zypper 命令', () => {
        const cmd = generateCommandline({ distroId: 'opensuse', selectedAppIds: new Set(['firefox']) });
        expect(cmd).toContain('sudo zypper install -y');
    });

    it('Flatpak 返回 flatpak 命令', () => {
        const cmd = generateCommandline({ distroId: 'flatpak', selectedAppIds: new Set(['firefox']) });
        expect(cmd).toContain('flatpak install flathub -y');
    });

    it('未知发行版返回默认消息', () => {
        // @ts-expect-error - testing fallback
        const cmd = generateCommandline({ distroId: 'unknown', selectedAppIds: new Set(['firefox']) });
        // No packages matched for unknown distro
        expect(cmd).toContain('No packages');
    });

    it('Nix 返回配置段（跳过命令包装）', () => {
        const cmd = generateCommandline({ distroId: 'nix', selectedAppIds: new Set(['firefox']) });
        expect(cmd).toContain('environment.systemPackages');
    });

    it('仅 script 目标的软件返回纯 script 命令', () => {
        const cmd = generateCommandline({ distroId: 'ubuntu', selectedAppIds: new Set(['opencode']) });
        // opencode only has script target, no apt target
        expect(cmd).toContain('curl');
    });

    it('不含 script 目标的 script 命令无需 &&', () => {
        const cmd = generateCommandline({ distroId: 'ubuntu', selectedAppIds: new Set(['opencode']) });
        expect(cmd).not.toContain('&&');
    });

    it('apt 命令与 script 命令用 && 连接', () => {
        // firefox (apt) + opencode (script, no apt) = cmd && script
        const cmd = generateCommandline({ distroId: 'ubuntu', selectedAppIds: new Set(['firefox', 'opencode']) });
        expect(cmd).toContain('sudo apt install -y firefox');
        expect(cmd).toContain('&&');
        expect(cmd).toContain('opencode');
    });

    it('Nix 案例：包与 npm 共存', () => {
        const cmd = generateCommandline({ distroId: 'nix', selectedAppIds: new Set(['firefox', 'gemini-cli']) });
        // firefox has nix target, gemini-cli has npm target but no nix target
        // Nix returns generateNixConfig directly
        expect(cmd).toContain('environment.systemPackages');
        expect(cmd).toContain('firefox');
    });
});
