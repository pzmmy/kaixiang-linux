'use client';

import { X, Check, AlertTriangle, Terminal, Users, Shield, Image, MessageSquare, FileText, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';

interface WeComGuideProps {
  onClose?: () => void;
}

export function WeComGuide({ onClose }: WeComGuideProps) {
  const { language } = useLanguage();
  const isZh = language === 'zh';

  const T = (zh: string, en: string) => (isZh ? zh : en);

  const [activeTab, setActiveTab] = useState<string>('overview');

  const TABS = [
    { id: 'overview', zh: '概览', en: 'Overview' },
    { id: 'install', zh: '安装', en: 'Installation' },
    { id: 'faq', zh: '常见问题', en: 'FAQ' },
  ];

  return (
    <div className="wecom-guide">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {T('企业微信 Linux 安装攻略', 'WeCom (企业微信) on Linux')}
          </h2>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            {T('企业微信的 Linux 解决方案', 'WeCom Linux solutions for the workplace')}
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

      {/* Tab Bar */}
      <div className="px-6 pb-3 pt-3">
        <div className="flex gap-1.5 border-b border-[var(--border-primary)]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-[11px] font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {isZh ? tab.zh : tab.en}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="px-6 pb-6 space-y-4">
          {/* Two approaches */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-2">
              {T('两种方式', 'Two Approaches')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Wine 版 */}
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-base">🍷</span>
                  <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                    {T('Wine 版', 'Wine Version')}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-2">
                  {T(
                    '使用 deepin-wine 或官方 Wine 运行 Windows 版企业微信。功能最完整，包含工作台、审批、打卡等全部模块。适合需要完整企业微信功能的企业用户。',
                    'Run Windows WeCom via deepin-wine or official Wine. Most complete feature set including Workbench, Approvals, Clock-in etc. Best for enterprise users needing full functionality.',
                  )}
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    <Check className="w-2.5 h-2.5" />
                    {T('功能完整', 'Full features')}
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    <Check className="w-2.5 h-2.5" />
                    {T('消息稳定', 'Stable messaging')}
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    {T('依赖 Wine', 'Wine required')}
                  </span>
                </div>
              </div>

              {/* 原生 Linux 版 */}
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-base">🐧</span>
                  <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                    {T('原生 Linux 版', 'Native Linux')}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-2">
                  {T(
                    '腾讯官方提供的 Linux 原生版本（Deepin/UOS 内置）。自带简单聊天功能，轻量但功能有限。适合只需要基础聊天和消息通知的轻度用户。',
                    'Tencent\'s official native Linux version (built into Deepin/UOS). Lightweight with basic chat features. Suitable for light users who only need basic messaging and notifications.',
                  )}
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    <Check className="w-2.5 h-2.5" />
                    {T('原生轻量', 'Native & lightweight')}
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    <Check className="w-2.5 h-2.5" />
                    {T('零配置', 'Zero config')}
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    {T('功能有限', 'Limited features')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Data isolation */}
          <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Shield className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                {T('数据隔离（个人微信 vs 企业微信）', 'Data Isolation (Personal WeChat vs WeCom)')
}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              {T(
                '个人微信和企业微信使用完全独立的安装目录、配置文件和数据库。两者互不干扰，可以同时登录。Wine 版建议使用不同的 WINEPREFIX 路径（如 ~/.wine-wechat 和 ~/.wine-wecom）以避免冲突。原生 Linux 版更是在不同的系统中运行（企业微信使用独立的容器）。',
                'Personal WeChat and WeCom use completely separate installation directories, config files, and databases. They do not interfere with each other and can be logged in simultaneously. For Wine versions, use different WINEPREFIX paths (e.g. ~/.wine-wechat and ~/.wine-wecom) to avoid conflicts. Native Linux versions run in completely separate containers.',
              )}
            </p>
          </div>

          {/* Quick comparison */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-2">
              {T('快速对比', 'Quick Comparison')}
            </h3>
            <div className="rounded-xl border border-[var(--border-primary)] overflow-hidden">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-[var(--bg-tertiary)]/50">
                    <th className="text-left px-3 py-2 text-[var(--text-muted)] font-medium">{T('对比项', 'Item')}</th>
                    <th className="text-left px-3 py-2 text-[var(--text-muted)] font-medium">{T('Wine 版', 'Wine Ver.')}</th>
                    <th className="text-left px-3 py-2 text-[var(--text-muted)] font-medium">{T('原生版', 'Native Ver.')}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'chat', zh: ['聊天', '✓ 完整', '✓ 基础'], en: ['Chat', '✓ Full', '✓ Basic'] },
                    { key: 'workbench', zh: ['工作台', '✓ 支持', '✗ 不支持'], en: ['Workbench', '✓ Supported', '✗ Not supported'] },
                    { key: 'approval', zh: ['审批', '✓ 支持', '✗ 不支持'], en: ['Approvals', '✓ Supported', '✗ Not supported'] },
                    { key: 'clockin', zh: ['打卡', '✓ 支持', '✗ 不支持'], en: ['Clock-in', '✓ Supported', '✗ Not supported'] },
                    { key: 'screenshot', zh: ['截图', '✓ 支持', '△ 有限'], en: ['Screenshot', '✓ Supported', '△ Limited'] },
                    { key: 'file', zh: ['文件传输', '✓ 完整', '✓ 基础'], en: ['File transfer', '✓ Full', '✓ Basic'] },
                    { key: 'notification', zh: ['消息通知', '✓ 托盘通知', '✓ 系统通知'], en: ['Notifications', '✓ Tray', '✓ System'] },
                    { key: 'resource', zh: ['资源占用', '~300MB', '~150MB'], en: ['Resources', '~300MB', '~150MB'] },
                  ].map((row, idx) => (
                    <tr key={row.key} className={idx % 2 === 0 ? 'bg-[var(--bg-secondary)]/20' : ''}>
                      <td className="px-3 py-1.5 text-[var(--text-secondary)] font-medium whitespace-nowrap">{isZh ? row.zh[0] : row.en[0]}</td>
                      <td className="px-3 py-1.5 text-[var(--text-primary)]">{isZh ? row.zh[1] : row.en[1]}</td>
                      <td className="px-3 py-1.5 text-[var(--text-primary)]">{isZh ? row.zh[2] : row.en[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Installation */}
      {activeTab === 'install' && (
        <div className="px-6 pb-6 space-y-4">
          {/* Wine version install */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-2">
              {T('🍷 Wine 版安装', '🍷 Wine Version Installation')}
            </h3>
            <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-primary)]/50 bg-[var(--bg-tertiary)]/30">
                <Terminal className="w-3 h-3 text-[var(--text-muted)]" />
                <span className="text-[10px] text-[var(--text-muted)] font-mono">deepin-wine</span>
              </div>
              <pre className="p-3 text-[11px] font-mono leading-relaxed text-[var(--text-secondary)] overflow-x-auto whitespace-pre">
{isZh ? `# 方法一：deepin-wine（推荐 Ubuntu/Debian 用户）
wget -O- https://deepin-wine.i-m.dev/setup.sh | sh
sudo apt install com.qq.weixin.work.deepin

# 方法二：手动 Wine 安装
# 1. 安装 Wine
sudo dpkg --add-architecture i386
sudo apt update
sudo apt install wine wine32 wine64 winetricks

# 2. 创建独立的 wine prefix
export WINEPREFIX=~/.wine-wecom
winecfg  # 选择 Windows 10

# 3. 安装依赖
winetricks corefonts cjkfonts

# 4. 下载并运行企业微信安装包
wget https://dldir1.qq.com/wework/work_weixin/WeCom_Setup.exe
wine WeCom_Setup.exe

# 5. 快捷方式
echo 'WINEPREFIX=~/.wine-wecom wine "C:\\\\Program Files (x86)\\\\Tencent\\\\WXWork\\\\WXWork.exe"' > ~/wecom.sh
chmod +x ~/wecom.sh` : `# Method 1: deepin-wine (recommended for Ubuntu/Debian)
wget -O- https://deepin-wine.i-m.dev/setup.sh | sh
sudo apt install com.qq.weixin.work.deepin

# Method 2: Manual Wine installation
# 1. Install Wine
sudo dpkg --add-architecture i386
sudo apt update
sudo apt install wine wine32 wine64 winetricks

# 2. Create a dedicated wine prefix
export WINEPREFIX=~/.wine-wecom
winecfg  # Select Windows 10

# 3. Install dependencies
winetricks corefonts cjkfonts

# 4. Download & run WeCom installer
wget https://dldir1.qq.com/wework/work_weixin/WeCom_Setup.exe
wine WeCom_Setup.exe

# 5. Create shortcut
echo 'WINEPREFIX=~/.wine-wecom wine "C:\\\\Program Files (x86)\\\\Tencent\\\\WXWork\\\\WXWork.exe"' > ~/wecom.sh
chmod +x ~/wecom.sh`}
              </pre>
            </div>
          </div>

          {/* Native version install */}
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-2">
              {T('🐧 原生 Linux 版安装', '🐧 Native Linux Version Installation')}
            </h3>
            <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-primary)]/50 bg-[var(--bg-tertiary)]/30">
                <Terminal className="w-3 h-3 text-[var(--text-muted)]" />
                <span className="text-[10px] text-[var(--text-muted)] font-mono">APT / AUR</span>
              </div>
              <pre className="p-3 text-[11px] font-mono leading-relaxed text-[var(--text-secondary)] overflow-x-auto whitespace-pre">
{isZh ? `# Deepin / UOS
sudo apt install com.qq.weixin.work

# Ubuntu / Debian（deepin-wine 移植版，同上）
wget -O- https://deepin-wine.i-m.dev/setup.sh | sh
sudo apt install com.qq.weixin.work.deepin

# Arch Linux (AUR)
yay -S wecom

# Fedora / RHEL（Flatpak）
flatpak install flathub com.tencent.wework` : `# Deepin / UOS
sudo apt install com.qq.weixin.work

# Ubuntu / Debian (deepin-wine port, same as above)
wget -O- https://deepin-wine.i-m.dev/setup.sh | sh
sudo apt install com.qq.weixin.work.deepin

# Arch Linux (AUR)
yay -S wecom

# Fedora / RHEL (Flatpak)
flatpak install flathub com.tencent.wework`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab: FAQ */}
      {activeTab === 'faq' && (
        <div className="px-6 pb-6 space-y-3">
          {/* FAQ items */}
          {[
            {
              icon: <Image className="w-4 h-4" />,
              zh: { q: '截图功能无法使用？', a: 'Wine 版企业微信截图功能需要配置 X11 共享内存。可以尝试运行 winetricks --force --gui 启用相应的 DirectX 支持，或使用独立截图工具（如 Flameshot）截图后粘贴。原生 Linux 版截图功能有限，建议使用系统截图工具。' },
              en: { q: 'Screenshot not working?', a: 'WeCom screenshot via Wine requires X11 shared memory. Try running winetricks --force --gui to enable DirectX support, or use a standalone screenshot tool (e.g. Flameshot) and paste the image. The native Linux version has limited screenshot functionality — use the system screenshot tool instead.' },
            },
            {
              icon: <FileText className="w-4 h-4" />,
              zh: { q: '文件传输失败或乱码？', a: '检查 Wine 的中文字体安装：运行 winetricks cjkfonts 然后重新启动企业微信。文件路径不要包含中文或特殊字符。原生版如果文件传输失败，尝试另存为后再发送。' },
              en: { q: 'File transfer failing or garbled?', a: 'Check Wine CJK font installation: run winetricks cjkfonts then restart WeCom. Avoid Chinese characters or special characters in file paths. For the native version, try saving the file with a different name before sending.' },
            },
            {
              icon: <MessageSquare className="w-4 h-4" />,
              zh: { q: '消息通知不弹出？', a: 'Wine 版：检查系统托盘是否正常运行，安装 libnotify-bin（sudo apt install libnotify-bin）。原生版：确保桌面环境的通知权限已授予企业微信。Deepin 用户请在「控制中心 → 通知」中开启企业微信通知。' },
              en: { q: 'Notifications not showing?', a: 'Wine version: check that the system tray is working, install libnotify-bin (sudo apt install libnotify-bin). Native version: ensure notification permissions are granted to WeCom in your desktop environment. Deepin users: enable WeCom notifications in "Control Center → Notifications".' },
            },
            {
              icon: <Users className="w-4 h-4" />,
              zh: { q: '个人微信和企业微信可以同时登录吗？', a: '完全可以。两者使用独立的安装和数据目录，互不冲突。建议使用不同方式运行（例如原生版跑个人微信，Wine 版跑企业微信；或者在两个不同的 WINEPREFIX 中分别运行）。' },
              en: { q: 'Can I log in to both WeChat and WeCom at the same time?', a: 'Absolutely. They use separate installation and data directories with no conflicts. It is recommended to use different approaches (e.g. native version for personal WeChat, Wine version for WeCom; or run them in two separate WINEPREFIX directories).' },
            },
          ].map((faq, idx) => (
            <details
              key={idx}
              className="group rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/20 overflow-hidden"
            >
              <summary className="flex items-center gap-2.5 px-3.5 py-3 cursor-pointer text-[12px] font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
                <span className="text-[var(--accent)] shrink-0">{faq.icon}</span>
                <span className="flex-1">{isZh ? faq.zh.q : faq.en.q}</span>
                <span className="text-[var(--text-muted)] group-open:rotate-180 transition-transform">
                  <ChevronDown className="w-3.5 h-3.5" />
                </span>
              </summary>
              <div className="px-3.5 pb-3 pt-1 border-t border-[var(--border-primary)]/50">
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  {isZh ? faq.zh.a : faq.en.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
