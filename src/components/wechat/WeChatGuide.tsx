'use client';

import { X, Download, Monitor, Wine, Container, Check, AlertTriangle, ChevronDown, Terminal, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';

// ============================================================
// Chinese content (used directly; English shown alongside)
// ============================================================

interface GuideSection {
  zh: string;
  en: string;
}

interface ComparisonRow {
  zh: string[];
  en: string[];
}

const SCHEMES: Array<{ id: string; icon: React.ReactNode; zh: string; en: string }> = [
  { id: 'native', icon: <Monitor className="w-4 h-4" />, zh: '原生 Linux 版', en: 'Native Linux' },
  { id: 'wine', icon: <Wine className="w-4 h-4" />, zh: 'Wine 版', en: 'Wine Wrapper' },
  { id: 'vm', icon: <Container className="w-4 h-4" />, zh: '虚拟机版', en: 'Virtual Machine' },
];

const COMPARISON_DATA: Record<string, { zh: Record<string, string>; en: Record<string, string> }> = {
  native: {
    zh: { feature: '基础聊天、文件收发', stability: '稳定（官方维护）', resource: '~200MB 内存', install: 'Linux 原生' },
    en: { feature: 'Basic chat, file transfer', stability: 'Stable (official)', resource: '~200MB RAM', install: 'Native Linux' },
  },
  wine: {
    zh: { feature: '接近完整 Windows 体验', stability: '较稳定（依赖 Wine）', resource: '~400MB 内存', install: 'Wine 包装' },
    en: { feature: 'Near-complete Windows experience', stability: 'Fair (depends on Wine)', resource: '~400MB RAM', install: 'Wine wrapper' },
  },
  vm: {
    zh: { feature: '完整 Windows 微信', stability: '最稳定（完整系统）', resource: '2~4GB+ 内存', install: '虚拟机运行' },
    en: { feature: 'Full Windows WeChat', stability: 'Most stable (full OS)', resource: '2~4GB+ RAM', install: 'Virtual machine' },
  },
};

const INSTALL_CMDS: Record<string, { zh: string[]; en: string[] }> = {
  native: {
    zh: [
      '# Deepin / UOS（自带）',
      'sudo apt install weixin',
      '',
      '# Ubuntu / Debian（deepin-wine 移植版）',
      'wget -O- https://deepin-wine.i-m.dev/setup.sh | sh',
      'sudo apt install com.qq.weixin.deepin',
      '',
      '# Arch Linux (AUR)',
      'yay -S wechat-uos',
      '',
      '# Fedora（Flatpak）',
      'flatpak install flathub com.tencent.WeChat',
      '',
      '# openSUSE',
      'sudo zypper install wechat-uos-bin',
    ],
    en: [
      '# Deepin / UOS (built-in)',
      'sudo apt install weixin',
      '',
      '# Ubuntu / Debian (deepin-wine port)',
      'wget -O- https://deepin-wine.i-m.dev/setup.sh | sh',
      'sudo apt install com.qq.weixin.deepin',
      '',
      '# Arch Linux (AUR)',
      'yay -S wechat-uos',
      '',
      '# Fedora (Flatpak)',
      'flatpak install flathub com.tencent.WeChat',
      '',
      '# openSUSE',
      'sudo zypper install wechat-uos-bin',
    ],
  },
  wine: {
    zh: [
      '# 使用官方 Wine / crossover',
      '# 1. 安装 Wine',
      'sudo dpkg --add-architecture i386',
      'sudo apt update && sudo apt install wine wine32 wine64',
      '',
      '# 2. 下载微信 Windows 安装包',
      'wget https://dldir1.qq.com/weixin/Windows/WeChatSetup.exe',
      '',
      '# 3. 运行安装',
      'WINEPREFIX=~/.wine-wechat wine WeChatSetup.exe',
      '',
      '# 或者使用 bwrap 容器版',
      'wget -O /tmp/wechat-bwrap.sh https://raw.githubusercontent.com/vufa/deepin-wine-wechat/master/install.sh',
      'bash /tmp/wechat-bwrap.sh',
    ],
    en: [
      '# Official Wine / crossover method',
      '# 1. Install Wine',
      'sudo dpkg --add-architecture i386',
      'sudo apt update && sudo apt install wine wine32 wine64',
      '',
      '# 2. Download Windows WeChat installer',
      'wget https://dldir1.qq.com/weixin/Windows/WeChatSetup.exe',
      '',
      '# 3. Run installer',
      'WINEPREFIX=~/.wine-wechat wine WeChatSetup.exe',
      '',
      '# Or use bwrap container version',
      'wget -O /tmp/wechat-bwrap.sh https://raw.githubusercontent.com/vufa/deepin-wine-wechat/master/install.sh',
      'bash /tmp/wechat-bwrap.sh',
    ],
  },
  vm: {
    zh: [
      '# 方式一：VirtualBox（免费）',
      'sudo apt install virtualbox virtualbox-ext-pack',
      '# 创建 Windows 10/11 虚拟机并安装微信',
      '',
      '# 方式二：VMware Workstation Player（免费个人版）',
      'sudo apt install vmware-player',
      '',
      '# 方式三：QEMU/KVM + Winapps（推荐）',
      'sudo apt install qemu-kvm libvirt-daemon-system virt-manager',
      'git clone https://github.com/Fmstrat/winapps.git',
      'cd winapps && sudo make install',
    ],
    en: [
      '# Option 1: VirtualBox (free)',
      'sudo apt install virtualbox virtualbox-ext-pack',
      '# Create a Windows 10/11 VM and install WeChat',
      '',
      '# Option 2: VMware Workstation Player (free for personal use)',
      'sudo apt install vmware-player',
      '',
      '# Option 3: QEMU/KVM + Winapps (recommended)',
      'sudo apt install qemu-kvm libvirt-daemon-system virt-manager',
      'git clone https://github.com/Fmstrat/winapps.git',
      'cd winapps && sudo make install',
    ],
  },
};

const PROS_CONS: Record<string, { pros: { zh: string[]; en: string[] }; cons: { zh: string[]; en: string[] } }> = {
  native: {
    pros: {
      zh: ['官方维护，长期更新', '原生性能，资源占用低', '与桌面环境整合好', '无需额外依赖'],
      en: ['Officially maintained, regular updates', 'Native performance, low resource usage', 'Good desktop environment integration', 'No extra dependencies'],
    },
    cons: {
      zh: ['功能较少（无朋友圈、视频号等）', '部分旧版不能语音/视频', '界面较 Windows 版滞后', '部分发行版需折腾安装'],
      en: ['Limited features (no Moments, Channels)', 'Some old versions lack voice/video', 'UI lags behind Windows version', 'May require tweaking on some distros'],
    },
  },
  wine: {
    pros: {
      zh: ['接近完整的 Windows 功能', '无需 Windows 授权', '可以与 Linux 文件系统互操作', '社区支持好，问题解决方案多'],
      en: ['Near-full Windows feature set', 'No Windows license needed', 'Interoperable with Linux filesystem', 'Good community support, many solutions'],
    },
    cons: {
      zh: ['Wine 配置稍复杂', '字体/中文显示可能有问题', '偶尔崩溃或卡顿', '无法使用 Weixin 输入法'],
      en: ['Wine configuration can be tricky', 'Font / Chinese display issues possible', 'Occasional crashes or lag', 'Cannot use Weixin IME'],
    },
  },
  vm: {
    pros: {
      zh: ['100% 完整功能', '最稳定，不依赖 Linux 兼容', '可同时运行其他 Windows 软件', '游戏/视频号等全部可用'],
      en: ['100% full functionality', 'Most stable, no Linux compat concerns', 'Can run other Windows software too', 'Games, Channels, everything works'],
    },
    cons: {
      zh: ['资源占用高', '启动慢', '文件共享需额外配置', '需要 Windows 授权'],
      en: ['High resource usage', 'Slow startup', 'File sharing needs extra setup', 'Requires Windows license'],
    },
  },
};

interface WeChatGuideProps {
  onClose?: () => void;
}

export function WeChatGuide({ onClose }: WeChatGuideProps) {
  const { language } = useLanguage();
  const [activeScheme, setActiveScheme] = useState<string>('native');
  const isZh = language === 'zh';

  const T = (zh: string, en: string) => (isZh ? zh : en);

  return (
    <div className="wechat-guide">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {T('微信 Linux 安装攻略', 'WeChat on Linux — Installation Guide')}
          </h2>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            {T('三大方案对比，总有一种适合你', 'Three approaches compared — pick the one that fits')}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Scheme Toggle */}
      <div className="px-6 pb-4 pt-3">
        <div className="flex gap-2">
          {SCHEMES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveScheme(s.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-lg border transition-all flex-1 ${
                activeScheme === s.id
                  ? 'bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]/40'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] border-[var(--border-primary)]/30 hover:bg-[var(--bg-hover)]'
              }`}
            >
              {s.icon}
              <span>{isZh ? s.zh : s.en}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="px-6 pb-4">
        <h3 className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-2">
          {T('方案对比', 'Scheme Comparison')}
        </h3>
        <div className="rounded-xl border border-[var(--border-primary)] overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-[var(--bg-tertiary)]/50">
                <th className="text-left px-3 py-2 text-[var(--text-muted)] font-medium">{T('维度', 'Dimension')}</th>
                {SCHEMES.map((s) => (
                  <th key={s.id} className={`text-left px-3 py-2 font-medium ${activeScheme === s.id ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
                    {isZh ? s.zh : s.en}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['feature', 'stability', 'resource', 'install'].map((dim, idx) => (
                <tr key={dim} className={idx % 2 === 0 ? 'bg-[var(--bg-secondary)]/20' : ''}>
                  <td className="px-3 py-2 text-[var(--text-secondary)] font-medium whitespace-nowrap">
                    {T(
                      ({ feature: '功能', stability: '稳定性', resource: '资源占用', install: '安装方式' } as Record<string, string>)[dim] || dim,
                      ({ feature: 'Features', stability: 'Stability', resource: 'Resources', install: 'Install type' } as Record<string, string>)[dim] || dim,
                    )}
                  </td>
                  {SCHEMES.map((s) => {
                    const data = COMPARISON_DATA[s.id];
                    return (
                      <td key={s.id} className={`px-3 py-2 text-[var(--text-primary)] ${activeScheme === s.id ? 'bg-[var(--accent)]/5' : ''}`}>
                        {isZh ? data.zh[dim] : data.en[dim]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Scheme Details */}
      <div className="px-6 pb-4">
        <h3 className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-2">
          {T('优缺点 — ' + (isZh ? SCHEMES.find((s) => s.id === activeScheme)?.zh : SCHEMES.find((s) => s.id === activeScheme)?.en), 'Pros & Cons')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Pros */}
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-[11px] font-semibold text-green-400">{T('优点', 'Pros')}</span>
            </div>
            <ul className="space-y-1">
              {PROS_CONS[activeScheme].pros[isZh ? 'zh' : 'en'].map((item, i) => (
                <li key={i} className="text-[11px] text-[var(--text-secondary)] flex items-start gap-1.5">
                  <span className="text-green-400/60 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Cons */}
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[11px] font-semibold text-red-400">{T('缺点', 'Cons')}</span>
            </div>
            <ul className="space-y-1">
              {PROS_CONS[activeScheme].cons[isZh ? 'zh' : 'en'].map((item, i) => (
                <li key={i} className="text-[11px] text-[var(--text-secondary)] flex items-start gap-1.5">
                  <span className="text-red-400/60 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Install Commands */}
      <div className="px-6 pb-4">
        <h3 className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-2">
          {T('安装步骤', 'Installation Steps')}
        </h3>
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-primary)]/50 bg-[var(--bg-tertiary)]/30">
            <Terminal className="w-3 h-3 text-[var(--text-muted)]" />
            <span className="text-[10px] text-[var(--text-muted)] font-mono">
              {T('终端命令', 'Terminal commands')}
            </span>
          </div>
          <pre className="p-3 text-[11px] font-mono leading-relaxed text-[var(--text-secondary)] overflow-x-auto whitespace-pre">
            {INSTALL_CMDS[activeScheme][isZh ? 'zh' : 'en'].join('\n')}
          </pre>
        </div>
      </div>

      {/* Recommendation */}
      <div className="px-6 pb-6">
        <div className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm">💡</span>
            <span className="text-[11px] font-semibold text-[var(--accent)]">
              {T('推荐', 'Recommendation')}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            {T(
              '日常使用推荐「原生 Linux 版」（Deepin Wine 移植或 UOS 版），功能满足大多数场景且资源占用低。需要完整功能（朋友圈、视频号、文件管理）的用户请选择 Wine 版。游戏玩家或重度 Windows 依赖者请选择虚拟机版。',
              'For daily use, choose "Native Linux" (deepin-wine port or UOS version) — sufficient for most scenarios with low resource usage. For full features (Moments, Channels, file management), use the Wine version. Gamers or heavy Windows users should go with the VM approach.',
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
