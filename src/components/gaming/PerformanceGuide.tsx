'use client';

import { useState } from 'react';
import { ArrowLeft, Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ============================================================
   Translation data
   ============================================================ */
const T: Record<string, Record<string, string>> = {
  zh: {
    title: '🎮 游戏性能调优指南',
    subtitle: '显卡驱动 · Wine/Proton · 性能优化 — 让 Linux 成为您的游戏利器',
    back: '← 返回主页',
    copy: '复制',
    copied: '已复制',
    expandAll: '展开全部',
    collapseAll: '收起全部',
    sectionDrivers: '🖥 显卡驱动安装与配置',
    sectionWine: '🍷 Wine / Proton 游戏兼容层',
    sectionPerf: '⚡ 性能优化工具与内核调优',
    nvidiaTitle: 'NVIDIA 显卡',
    nvidiaDesc: '官方驱动 (proprietary) vs 开源驱动 (Nouveau)',
    nvidiaOfficial: '官方驱动安装 (NVIDIA proprietary driver)',
    nvidiaOfficialText: 'NVIDIA 官方闭源驱动提供最佳游戏性能、CUDA 支持和完整的 Vulkan/OpenGL 实现。推荐所有游戏玩家使用。',
    nvidiaInstall: '# Ubuntu/Debian\nsudo apt install nvidia-driver-550 nvidia-utils-550\n\n# Arch Linux\nsudo pacman -S nvidia nvidia-utils nvidia-settings\n\n# Fedora\nsudo dnf install akmod-nvidia xorg-x11-drv-nvidia-cuda\n\n# openSUSE\nsudo zypper install nvidia-video-G06 nvidia-gl-G06',
    nvidiaAll: '各发行版安装命令',
    nvidiaPrime: 'NVIDIA Prime (双显卡切换)',
    nvidiaPrimeText: '对于 NVIDIA Optimus 笔记本 (Intel/AMD 核显 + NVIDIA 独显)，使用 Prime 切换：',
    nvidiaPrimeCmd: '# 使用独显运行程序\nprime-run 程序名\n# 或\n__NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia 程序名\n\n# 设置全局独显 (仅 NVIDIA)\nsudo prime-select nvidia\n\n# 回到省电模式\nsudo prime-select intel\n\n# 查看当前模式\nprime-select query',
    nvidiaNouveau: 'Nouveau 开源驱动',
    nvidiaNouveauText: 'Nouveau 是开源的 NVIDIA 驱动，由社区逆向工程开发。性能只有官方驱动的 20-30%，不支持完整的 Vulkan，不适合游戏。仅推荐用于无法安装官方驱动的特殊情况。',
    nvidiaNouveauCmd: '# Nouveau 通常随内核自带，无额外安装\n# 如需手动安装 (Ubuntu/Debian):\nsudo apt install xserver-xorg-video-nouveau mesa-utils\n\n# 如需禁用 Nouveau 使用官方驱动:\necho "blacklist nouveau" | sudo tee /etc/modprobe.d/blacklist-nvidia-nouveau.conf',
    amdTitle: 'AMD 显卡',
    amdDesc: '开源驱动 (amdgpu + Mesa) — Linux 上最好的游戏体验',
    amdText: 'AMD 在 Linux 上拥有完美的一站式开源驱动体验。amdgpu 内核驱动 + Mesa 3D 库提供 OpenGL/Vulkan 支持，性能接近 Windows。',
    amdCmd: '# Ubuntu/Debian\nsudo apt install mesa mesa-utils mesa-vulkan-drivers libgl1-mesa-dri\n\n# Arch Linux\nsudo pacman -S mesa mesa-utils vulkan-radeon\n\n# Fedora\nsudo dnf install mesa mesa-vulkan-drivers\n\n# openSUSE\nsudo zypper install Mesa Mesa-vulkan-overlay',
    amdRadv: 'RADV vs AMDVLK',
    amdRadvText: 'RADV (Mesa 内置) 是默认的 Vulkan 驱动，持续优化中，性能通常优于 AMDVLK。AMDVLK 是 AMD 官方闭源 Vulkan 驱动。推荐游戏玩家使用 RADV。',
    amdRadvCmd: '# 安装 RADV (已包含在 Mesa 中)\n# 安装 AMDVLK (可选):\nsudo apt install amdvlk   # Ubuntu/Debian\nsudo pacman -S amdvlk     # Arch\n\n# 优先使用 RADV:\nexport VK_ICD_FILENAMES=/usr/share/vulkan/icd.d/radeon_icd.x86_64.json\n\n# 切换为 AMDVLK:\nexport VK_ICD_FILENAMES=/usr/share/vulkan/icd.d/amdvlk.json',
    intelTitle: 'Intel 核显',
    intelDesc: '开源驱动 — 开箱即用',
    intelText: 'Intel 核显使用完全开源的 i915 内核驱动 + Mesa 驱动，几乎所有发行版都默认支持。只需安装 Mesa 即可。',
    intelCmd: '# Ubuntu/Debian\nsudo apt install mesa mesa-utils mesa-vulkan-drivers intel-media-va-driver\n\n# Arch Linux\nsudo pacman -S mesa mesa-utils vulkan-intel intel-media-driver\n\n# Fedora\nsudo dnf install mesa mesa-vulkan-drivers libva-intel-driver\n\n# openSUSE\nsudo zypper install Mesa Mesa-vulkan-overlay libva-intel-driver',
    cnGpuTitle: '🇨🇳 国产显卡支持状态',
    cnGpuDesc: '摩尔线程 (Moore Threads) · 景嘉微 (Jingjia Micro)',
    mtDesc: '摩尔线程 MTT S70/S80/等',
    mtStatus: '状态: 初步支持 (2024+)',
    mtText: '摩尔线程通过开源驱动程序 "MTT GPU" 提供基础 Linux 支持。支持 X11/Wayland 显示输出，Vulkan 和 OpenGL 4.5 已部分实现。游戏兼容性有限，但持续改进中。',
    mtCmd: '# Arch Linux (AUR)\nsudo pacman -S mtt-module-dkms mtt-user\n\n# 或从 GitHub 源码编译:\ngit clone https://github.com/MooreThreads/mtt-driver.git\ncd mtt-driver\nmake && sudo make install\n\n# 官方网站: https://developer.moorethreads.com/',
    jmDesc: '景嘉微 JM7201/JM9100/等',
    jmStatus: '状态: 有限支持',
    jmText: '景嘉微显卡主要面向政企市场，Linux 驱动通过官方 RPM/DEB 包提供。支持基础 2D/3D 加速，游戏支持目前非常有限。通常预装在国产操作系统(麒麟/Deepin)中。',
    jmCmd: '# 通常由系统预装\n# 如需手动安装 (麒麟):\nsudo apt install jm-graphics-driver\n\n# 请咨询设备供应商获取最新驱动包\n# 或访问: https://www.jemetech.com/',
    wineTitle: 'Wine 安装与配置',
    wineDesc: '运行 Windows 游戏的核心兼容层',
    wineOverview: 'Wine (Wine Is Not an Emulator) 是一个兼容层，允许在 Linux 上运行 Windows 应用程序。它实现了 Windows API 调用。',
    wineInstall: '# Ubuntu/Debian\nsudo dpkg --add-architecture i386\nsudo apt update\nsudo apt install wine wine32 wine64 winehq-stable\n\n# Arch Linux\nsudo pacman -S wine wine-mono wine-gecko\n\n# Fedora\nsudo dnf install wine\n\n# openSUSE\nsudo zypper install wine',
    protonTitle: 'Proton-GE 自定义版本',
    protonDesc: 'Valve 的 Proton + GloriousEggroll 社区优化版',
    protonText: 'Proton 是 Valve 基于 Wine 改造的兼容层，集成于 Steam Play。Proton-GE (GloriousEggroll) 是社区维护的增强版，包含额外的补丁和优化，修复更多游戏。',
    protonInstall: '# 方法1: ProtonUp-Qt (推荐 - 图形界面)\nflatpak install net.davidotek.pupgui2\nflatpak run net.davidotek.pupgui2\n\n# 方法2: 通过命令行\n# 使用 protonup 工具\npip install protonup --user\nprotonup -d ~/.steam/root/compatibilitytools.d\n\n# 手动安装:\n# 1. 从 https://github.com/GloriousEggroll/proton-ge-custom/releases 下载\n# 2. 解压到 ~/.steam/root/compatibilitytools.d/\n# 3. 重启 Steam → 在游戏属性中选择 Proton-GE',
    winecfgTitle: 'Wine 配置工具',
    winecfgDesc: 'winecfg 和 winetricks',
    winecfgText: 'winecfg 是 Wine 的核心配置工具，用于设置 Windows 版本、音频、驱动等。winetricks 是辅助脚本，用于安装运行时库、字体和 DirectX 组件。',
    winecfgCmd: '# 打开 Wine 配置\nwinecfg\n\n# 在配置中:\n# - 将 Windows 版本设为 Windows 10\n# - Libraries (库) 标签页可添加 DLL 覆盖\n\n# Winetricks 常用命令:\nwinetricks --gui                    # 图形界面模式\nwinetricks corefonts                # 安装核心字体\nwinetricks vcrun2022                # Visual C++ Redist\nwinetricks d3dx11_43 d3dcompiler_47 # DirectX 组件\nwinetricks dxvk                     # DirectX 9/10/11 → Vulkan\nwinetricks vkd3d                    # DirectX 12 → Vulkan',
    dxvkTitle: 'DXVK / VKD3D 安装',
    dxvkDesc: 'DirectX → Vulkan 转换层',
    dxvkText: 'DXVK 将 Direct3D 9/10/11 转换为 Vulkan，显著提升 Wine 游戏性能。VKD3D-Proton 实现 Direct3D 12 到 Vulkan 的转换，支持最新 AAA 游戏。',
    dxvkCmd: '# DXVK 安装\n# 方法1: 通过 winetricks\nwinetricks dxvk\n\n# 方法2: 手动安装\nwget https://github.com/doitsujin/dxvk/releases/latest/download/dxvk-2.5.3.tar.gz\ntar -xzf dxvk-2.5.3.tar.gz\ncd dxvk-2.5.3\n./setup_dxvk.sh install\n\n# VKD3D-Proton 安装\n# 方法1: 通过 winetricks\nwinetricks vkd3d\n\n# 方法2: 手动安装\ngit clone --recursive https://github.com/HansKristian-Work/vkd3d-proton.git\ncd vkd3d-proton\n./setup_vkd3d_proton.sh install\n\n# 验证安装:\nwine dxdiag      # 检查 DirectX 版本\nvulkaninfo       # 检查 Vulkan 支持',
    gamemodeTitle: 'GameMode — 自动性能调度',
    gamemodeDesc: 'Feral Interactive 开发的游戏优化守护进程',
    gamemodeText: 'GameMode 在游戏启动时自动优化 CPU 调度器、I/O 优先级和 GPU 性能模式，游戏退出后恢复。目前支持数千款游戏。',
    gamemodeCmd: '# 安装\nsudo apt install gamemode          # Ubuntu/Debian\nsudo pacman -S gamemode            # Arch\nsudo dnf install gamemode          # Fedora\nsudo zypper install gamemode       # openSUSE\n\n# 配置 (~/.config/gamemode.ini):\n[general]\nrenice=10\nautostart=1\n\n[gpu]\napply_gpu_optimisations=accept_responsibility\nnv_core_clock_mhz_offset=150\nnv_mem_clock_mhz_offset=300\n\n# Steam: 在启动命令中添加 gamemoderun %command%\n# Lutris: 在 Runner 选项中启用 Feral GameMode\n# 手动使用:\ngamemoderun ./game\n\n# 验证运行状态:\ngamemoded -s',
    mangohudTitle: 'MangoHud — 性能监控',
    mangohudDesc: '类 MSI Afterburner 的 HUD 监控工具',
    mangohudText: 'MangoHud 在游戏画面中叠加显示 FPS、CPU/GPU 使用率、温度、功耗等信息。类似 Windows 上的 MSI Afterburner + RivaTuner。',
    mangohudCmd: '# 安装\nsudo apt install mangohud          # Ubuntu/Debian\nsudo pacman -S mangohud            # Arch\nsudo dnf install mangohud          # Fedora\n\n# Steam: 启动命令添加 mangohud %command%\n# Lutris: 在系统设置中启用 MangoHud\n\n# 全局启用 (环境变量):\nexport MANGOHUD=1\n\n# 配置文件 (~/.config/MangoHud/MangoHud.conf):\nlegacy_layout=false\nfps_limit=144\nfps_sampling_period=250\ncpu_stats\ngpu_stats\ncpu_temp\ngpu_temp\nram\nvram\npower\narch\n',
    cpuPerfTitle: 'CPU 性能调优',
    cpuPerfDesc: '处理器频率、调度器和性能模式',
    cpuText: '通过 CPU 频率调节器、调度器优化和 governor 设置来提升游戏性能。',
    cpuCmd: '# 查看当前 CPU 调节器\ncat /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor\n\n# 设置为性能模式\nsudo cpupower frequency-set -g performance\n# 或\necho performance | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor\n\n# 安装 cpupower 工具\nsudo apt install linux-tools-common linux-tools-$(uname -r)  # Ubuntu/Debian\nsudo pacman -S cpupower                                         # Arch\n\n# CPU 隔离 (将核心分配给游戏)\n# 编辑 /etc/default/grub:\n# GRUB_CMDLINE_LINUX_DEFAULT=\"... isolcpus=2-3 nohz_full=2-3 rcu_nocbs=2-3\"\n# 然后: sudo update-grub\n\n# 使用 cpuset 在运行时隔离:\nsudo apt install cpuset 或 sudo pacman -S cpuset\n# 示例: 将核心 2-3 分配给游戏\nsudo cset shield --cpu 2-3\nsudo cset shield --shield --pid $(pidof game)\n\n# 进程优先级:\nrenice -n -15 -p $(pidof game)  # 提高优先级\nchrt -f 50 $(pidof game)        # 设置为 FIFO 调度',
    kernelTitle: '内核参数优化',
    kernelDesc: '减少延迟，提高游戏响应',
    kernelText: '通过 sysctl 和内核参数调整来减少调度延迟、网络延迟和 I/O 延迟，提升游戏体验。',
    kernelCmd: '# sysctl 优化 (/etc/sysctl.d/99-gaming.conf)\n# 减少 swap 使用率\nvm.swappiness=10\nvm.vfs_cache_pressure=50\n\n# 减少网络延迟\nnet.core.rmem_default=262144\nnet.core.wmem_default=262144\nnet.ipv4.tcp_congestion_control=bbr\nnet.core.default_qdisc=fq\n\n# 音频延迟优化 (PipeWire/JACK)\nkernel.sched_latency_ns=6000000\nkernel.sched_migration_cost_ns=5000000\n\n# 应用设置:\nsudo sysctl --system\n\n# GRUB 内核参数优化 (/etc/default/grub):\n# GRUB_CMDLINE_LINUX_DEFAULT=\"quiet splash threadirqs preempt=full\"\n# \n# threadirqs: 强制线程化中断处理\n# preempt=full: 全面抢占 (需要 PREEMPT_RT 或 PREEMPT_DYNAMIC 内核)\n# mitigations=off: 关闭 CPU 安全漏洞缓解 (提高性能，降低安全性)\n#\n# 应用:\nsudo update-grub\n\n# 使用性能分析工具:\nsudo apt install linux-tools-common linux-tools-$(uname -r) perf-tools\nperf top                         # 实时性能分析\nperf record -g ./game            # 采样分析\nperf report                      # 查看报告',
    credits: '💡 提示: 以上命令基于常见 Linux 发行版。请根据您的实际发行版和显卡型号调整。持续关注各开源项目以获取最新更新。',
  },
  en: {
    title: '🎮 Gaming Performance Guide',
    subtitle: 'GPU Drivers · Wine/Proton · Performance Tuning — Make Linux Your Gaming Rig',
    back: '← Back to Home',
    copy: 'Copy',
    copied: 'Copied',
    expandAll: 'Expand All',
    collapseAll: 'Collapse All',
    sectionDrivers: '🖥 GPU Driver Installation & Configuration',
    sectionWine: '🍷 Wine / Proton Compatibility Layer',
    sectionPerf: '⚡ Performance Tuning & Kernel Optimization',
    nvidiaTitle: 'NVIDIA GPUs',
    nvidiaDesc: 'Proprietary driver vs Nouveau (open-source)',
    nvidiaOfficial: 'NVIDIA Proprietary Driver Installation',
    nvidiaOfficialText: 'The official NVIDIA closed-source driver provides the best gaming performance, CUDA support, and full Vulkan/OpenGL implementation. Recommended for all gamers.',
    nvidiaInstall: '# Ubuntu/Debian\nsudo apt install nvidia-driver-550 nvidia-utils-550\n\n# Arch Linux\nsudo pacman -S nvidia nvidia-utils nvidia-settings\n\n# Fedora\nsudo dnf install akmod-nvidia xorg-x11-drv-nvidia-cuda\n\n# openSUSE\nsudo zypper install nvidia-video-G06 nvidia-gl-G06',
    nvidiaAll: 'Install commands per distro',
    nvidiaPrime: 'NVIDIA Prime (Hybrid GPU Switching)',
    nvidiaPrimeText: 'For NVIDIA Optimus laptops (Intel/AMD integrated + NVIDIA dedicated), use Prime switching:',
    nvidiaPrimeCmd: '# Run a program with dGPU\nprime-run <program>\n# or\n__NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia <program>\n\n# Set global dGPU (NVIDIA only)\nsudo prime-select nvidia\n\n# Switch to power-saving mode\nsudo prime-select intel\n\n# Check current mode\nprime-select query',
    nvidiaNouveau: 'Nouveau Open-Source Driver',
    nvidiaNouveauText: 'Nouveau is the open-source NVIDIA driver, reverse-engineered by the community. Performance is only 20-30% of the proprietary driver with incomplete Vulkan support. Not suitable for gaming.',
    nvidiaNouveauCmd: '# Nouveau comes with the kernel — no extra install needed\n# Manual install (Ubuntu/Debian):\nsudo apt install xserver-xorg-video-nouveau mesa-utils\n\n# To blacklist Nouveau for proprietary driver:\necho "blacklist nouveau" | sudo tee /etc/modprobe.d/blacklist-nvidia-nouveau.conf',
    amdTitle: 'AMD GPUs',
    amdDesc: 'Open-source (amdgpu + Mesa) — the best gaming experience on Linux',
    amdText: 'AMD offers a seamless all-open-source driver experience on Linux. The amdgpu kernel driver plus Mesa 3D library provides OpenGL/Vulkan support with near-Windows performance.',
    amdCmd: '# Ubuntu/Debian\nsudo apt install mesa mesa-utils mesa-vulkan-drivers libgl1-mesa-dri\n\n# Arch Linux\nsudo pacman -S mesa mesa-utils vulkan-radeon\n\n# Fedora\nsudo dnf install mesa mesa-vulkan-drivers\n\n# openSUSE\nsudo zypper install Mesa Mesa-vulkan-overlay',
    amdRadv: 'RADV vs AMDVLK',
    amdRadvText: 'RADV (built into Mesa) is the default Vulkan driver with ongoing optimizations, generally outperforming AMDVLK. AMDVLK is AMD\'s official closed-source Vulkan driver. RADV is recommended for gamers.',
    amdRadvCmd: '# Install RADV (included in Mesa)\n# Install AMDVLK (optional):\nsudo apt install amdvlk   # Ubuntu/Debian\nsudo pacman -S amdvlk     # Arch\n\n# Prefer RADV:\nexport VK_ICD_FILENAMES=/usr/share/vulkan/icd.d/radeon_icd.x86_64.json\n\n# Switch to AMDVLK:\nexport VK_ICD_FILENAMES=/usr/share/vulkan/icd.d/amdvlk.json',
    intelTitle: 'Intel Integrated Graphics',
    intelDesc: 'Open-source — works out of the box',
    intelText: 'Intel integrated GPUs use the fully open-source i915 kernel driver + Mesa. Nearly all distros support it by default. Just install Mesa.',
    intelCmd: '# Ubuntu/Debian\nsudo apt install mesa mesa-utils mesa-vulkan-drivers intel-media-va-driver\n\n# Arch Linux\nsudo pacman -S mesa mesa-utils vulkan-intel intel-media-driver\n\n# Fedora\nsudo dnf install mesa mesa-vulkan-drivers libva-intel-driver\n\n# openSUSE\nsudo zypper install Mesa Mesa-vulkan-overlay libva-intel-driver',
    cnGpuTitle: '🇨🇳 Chinese GPU Support Status',
    cnGpuDesc: 'Moore Threads · Jingjia Micro',
    mtDesc: 'Moore Threads MTT S70/S80/etc.',
    mtStatus: 'Status: Early Support (2024+)',
    mtText: 'Moore Threads provides basic Linux support through the open-source "MTT GPU" driver. Supports X11/Wayland display output with partial Vulkan and OpenGL 4.5 implementation. Gaming compatibility is limited but improving.',
    mtCmd: '# Arch Linux (AUR)\nsudo pacman -S mtt-module-dkms mtt-user\n\n# Or build from GitHub source:\ngit clone https://github.com/MooreThreads/mtt-driver.git\ncd mtt-driver\nmake && sudo make install\n\n# Official site: https://developer.moorethreads.com/',
    jmDesc: 'Jingjia Micro JM7201/JM9100/etc.',
    jmStatus: 'Status: Limited Support',
    jmText: 'Jingjia Micro GPUs target government/enterprise markets. Linux drivers are provided through official RPM/DEB packages. Supports basic 2D/3D acceleration; gaming support is very limited. Typically pre-installed on Kylin/Deepin systems.',
    jmCmd: '# Usually pre-installed by system\n# Manual install (Kylin):\nsudo apt install jm-graphics-driver\n\n# Contact vendor for latest driver package\n# Visit: https://www.jemetech.com/',
    wineTitle: 'Wine Installation & Configuration',
    wineDesc: 'The core compatibility layer for running Windows games',
    wineOverview: 'Wine (Wine Is Not an Emulator) is a compatibility layer that allows Windows applications to run on Linux by implementing Windows API calls.',
    wineInstall: '# Ubuntu/Debian\nsudo dpkg --add-architecture i386\nsudo apt update\nsudo apt install wine wine32 wine64 winehq-stable\n\n# Arch Linux\nsudo pacman -S wine wine-mono wine-gecko\n\n# Fedora\nsudo dnf install wine\n\n# openSUSE\nsudo zypper install wine',
    protonTitle: 'Proton-GE Custom Builds',
    protonDesc: 'Valve\'s Proton + GloriousEggroll community optimized builds',
    protonText: 'Proton is Valve\'s Wine-based compatibility layer integrated into Steam Play. Proton-GE (GloriousEggroll) is a community-maintained enhanced version with additional patches and optimizations that fix more games.',
    protonInstall: '# Method 1: ProtonUp-Qt (Recommended - GUI)\nflatpak install net.davidotek.pupgui2\nflatpak run net.davidotek.pupgui2\n\n# Method 2: CLI with protonup\npip install protonup --user\nprotonup -d ~/.steam/root/compatibilitytools.d\n\n# Manual install:\n# 1. Download from https://github.com/GloriousEggroll/proton-ge-custom/releases\n# 2. Extract to ~/.steam/root/compatibilitytools.d/\n# 3. Restart Steam → select Proton-GE in game properties',
    winecfgTitle: 'Wine Configuration Tools',
    winecfgDesc: 'winecfg and winetricks',
    winecfgText: 'winecfg is Wine\'s core configuration tool for setting Windows version, audio, drivers, etc. winetricks is a helper script for installing runtimes, fonts, and DirectX components.',
    winecfgCmd: '# Open Wine configuration\nwinecfg\n\n# In the config:\n# - Set Windows version to Windows 10\n# - Libraries tab allows DLL overrides\n\n# Winetricks common commands:\nwinetricks --gui                    # GUI mode\nwinetricks corefonts                # Install core fonts\nwinetricks vcrun2022                # Visual C++ Redist\nwinetricks d3dx11_43 d3dcompiler_47 # DirectX components\nwinetricks dxvk                     # DirectX 9/10/11 → Vulkan\nwinetricks vkd3d                    # DirectX 12 → Vulkan',
    dxvkTitle: 'DXVK / VKD3D Installation',
    dxvkDesc: 'DirectX → Vulkan translation layer',
    dxvkText: 'DXVK translates Direct3D 9/10/11 to Vulkan, significantly improving Wine game performance. VKD3D-Proton implements Direct3D 12 over Vulkan, enabling the latest AAA games.',
    dxvkCmd: '# DXVK Installation\n# Method 1: via winetricks\nwinetricks dxvk\n\n# Method 2: Manual install\nwget https://github.com/doitsujin/dxvk/releases/latest/download/dxvk-2.5.3.tar.gz\ntar -xzf dxvk-2.5.3.tar.gz\ncd dxvk-2.5.3\n./setup_dxvk.sh install\n\n# VKD3D-Proton Installation\n# Method 1: via winetricks\nwinetricks vkd3d\n\n# Method 2: Manual install\ngit clone --recursive https://github.com/HansKristian-Work/vkd3d-proton.git\ncd vkd3d-proton\n./setup_vkd3d_proton.sh install\n\n# Verify installation:\nwine dxdiag      # Check DirectX version\nvulkaninfo       # Check Vulkan support',
    gamemodeTitle: 'GameMode — Automatic Performance Scheduling',
    gamemodeDesc: 'Feral Interactive\'s game optimization daemon',
    gamemodeText: 'GameMode automatically optimizes CPU scheduler, I/O priority, and GPU performance mode when a game starts, reverting settings when it exits. Supports thousands of games.',
    gamemodeCmd: '# Installation\nsudo apt install gamemode          # Ubuntu/Debian\nsudo pacman -S gamemode            # Arch\nsudo dnf install gamemode          # Fedora\nsudo zypper install gamemode       # openSUSE\n\n# Configuration (~/.config/gamemode.ini):\n[general]\nrenice=10\nautostart=1\n\n[gpu]\napply_gpu_optimisations=accept_responsibility\nnv_core_clock_mhz_offset=150\nnv_mem_clock_mhz_offset=300\n\n# Steam: Add gamemoderun %command% to launch options\n# Lutris: Enable Feral GameMode in Runner options\n# Manual use:\ngamemoderun ./game\n\n# Verify running status:\ngamemoded -s',
    mangohudTitle: 'MangoHud — Performance Overlay',
    mangohudDesc: 'MSI Afterburner-like HUD monitoring tool',
    mangohudText: 'MangoHud displays FPS, CPU/GPU usage, temperature, power draw, and more as an in-game overlay. Similar to MSI Afterburner + RivaTuner on Windows.',
    mangohudCmd: '# Installation\nsudo apt install mangohud          # Ubuntu/Debian\nsudo pacman -S mangohud            # Arch\nsudo dnf install mangohud          # Fedora\n\n# Steam: Add mangohud %command% to launch options\n# Lutris: Enable MangoHud in System Settings\n\n# Global enable (env variable):\nexport MANGOHUD=1\n\n# Configuration (~/.config/MangoHud/MangoHud.conf):\nlegacy_layout=false\nfps_limit=144\nfps_sampling_period=250\ncpu_stats\ngpu_stats\ncpu_temp\ngpu_temp\nram\nvram\npower\narch\n',
    cpuPerfTitle: 'CPU Performance Tuning',
    cpuPerfDesc: 'Frequency scaling, scheduler, and governor settings',
    cpuText: 'Boost gaming performance by adjusting CPU frequency governors, scheduler optimization, and core isolation.',
    cpuCmd: '# Check current CPU governor\ncat /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor\n\n# Set performance mode\nsudo cpupower frequency-set -g performance\n# or\necho performance | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor\n\n# Install cpupower tools\nsudo apt install linux-tools-common linux-tools-$(uname -r)  # Ubuntu/Debian\nsudo pacman -S cpupower                                         # Arch\n\n# CPU isolation (assign cores to game)\n# Edit /etc/default/grub:\n# GRUB_CMDLINE_LINUX_DEFAULT=\"... isolcpus=2-3 nohz_full=2-3 rcu_nocbs=2-3\"\n# Then: sudo update-grub\n\n# Runtime isolation with cpuset:\nsudo apt install cpuset  # or sudo pacman -S cpuset\n# Example: isolate cores 2-3 for gaming\nsudo cset shield --cpu 2-3\nsudo cset shield --shield --pid $(pidof game)\n\n# Process priority:\nrenice -n -15 -p $(pidof game)  # Higher priority\nchrt -f 50 $(pidof game)        # FIFO scheduler',
    kernelTitle: 'Kernel Parameter Optimization',
    kernelDesc: 'Reduce latency for better game responsiveness',
    kernelText: 'Tweak sysctl and kernel parameters to reduce scheduling latency, network latency, and I/O latency for a smoother gaming experience.',
    kernelCmd: '# sysctl optimization (/etc/sysctl.d/99-gaming.conf)\n# Reduce swap usage\nvm.swappiness=10\nvm.vfs_cache_pressure=50\n\n# Reduce network latency\nnet.core.rmem_default=262144\nnet.core.wmem_default=262144\nnet.ipv4.tcp_congestion_control=bbr\nnet.core.default_qdisc=fq\n\n# Audio latency optimization (PipeWire/JACK)\nkernel.sched_latency_ns=6000000\nkernel.sched_migration_cost_ns=5000000\n\n# Apply settings:\nsudo sysctl --system\n\n# GRUB kernel parameter optimization (/etc/default/grub):\n# GRUB_CMDLINE_LINUX_DEFAULT=\"quiet splash threadirqs preempt=full\"\n# \n# threadirqs: Force threaded interrupt handling\n# preempt=full: Full preemption (requires PREEMPT_RT or PREEMPT_DYNAMIC kernel)\n# mitigations=off: Disable CPU vulnerability mitigations (more performance, less security)\n#\n# Apply:\nsudo update-grub\n\n# Use performance analysis tools:\nsudo apt install linux-tools-common linux-tools-$(uname -r) perf-tools\nperf top                         # Real-time performance analysis\nperf record -g ./game            # Sampling profiling\nperf report                      # View report',
    credits: '💡 Tip: The commands above work on common Linux distros. Adjust based on your actual distro and GPU model. Stay tuned to the open-source community for the latest updates.',
  },
};

/* ============================================================
   Collapsible Section
   ============================================================ */
function CollapsibleSection({
  title,
  desc,
  defaultOpen,
  children,
}: {
  title: string;
  desc?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="border border-[var(--border-primary)]/30 rounded-xl overflow-hidden bg-[var(--bg-secondary)]/20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--bg-hover)] transition-colors text-left"
      >
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
          {desc && <p className="text-[11px] mt-0.5 text-[var(--text-muted)]">{desc}</p>}
        </div>
        <span className="text-[var(--text-muted)] shrink-0 ml-3">
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </span>
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

/* ============================================================
   Code Block with Copy
   ============================================================ */
function CodeBlock({ code, label }: { code: string; label?: string }) {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mt-2">
      {label && (
        <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 font-semibold">
          {label}
        </div>
      )}
      <div className="relative rounded-lg overflow-hidden border border-[var(--border-primary)]/20">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-[var(--bg-tertiary)]/80 
            text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]
            transition-all opacity-0 group-hover:opacity-100"
          title={language === 'zh' ? '复制' : 'Copy'}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <pre className="p-4 pr-10 overflow-x-auto text-[12px] leading-relaxed bg-[var(--bg-tertiary)]/40 text-[var(--text-secondary)] font-mono">
          <code>{code}</code>
        </pre>
      </div>
      {copied && (
        <span className="absolute right-0 -bottom-5 text-[10px] text-green-400 font-medium">
          {language === 'zh' ? '✓ 已复制' : '✓ Copied'}
        </span>
      )}
    </div>
  );
}

/* ============================================================
   Info Card
   ============================================================ */
function InfoCard({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      className="mt-3 px-4 py-3 rounded-lg border text-[12px] leading-relaxed"
      style={{
        borderColor: color ? `${color}30` : 'var(--border-primary)',
        backgroundColor: color ? `${color}08` : 'var(--bg-tertiary)',
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   Main Component
   ============================================================ */
interface PerformanceGuideProps {
  onClose: () => void;
}

export function PerformanceGuide({ onClose }: PerformanceGuideProps) {
  const { language } = useLanguage();
  const lang = language as 'zh' | 'en';
  const t = (key: string) => T[lang]?.[key] ?? T.zh[key] ?? key;

  const [allOpen, setAllOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-0 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
            bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)]/30
            hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('back')}
        </button>
        <button
          onClick={() => setAllOpen(!allOpen)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium
            bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)]/30
            hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all"
        >
          {allOpen ? t('collapseAll') : t('expandAll')}
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-sm text-[var(--text-muted)]">{t('subtitle')}</p>
      </div>

      <div className="space-y-6">
        {/* ================================================
            SECTION 1: GPU DRIVERS
            ================================================ */}
        <div>
          <h2 className="text-lg font-bold mb-3 text-[var(--text-primary)]">{t('sectionDrivers')}</h2>
          <div className="space-y-3">
            {/* NVIDIA */}
            <CollapsibleSection
              title={t('nvidiaTitle')}
              desc={t('nvidiaDesc')}
              defaultOpen={allOpen}
            >
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)] mb-3">{t('nvidiaOfficialText')}</p>
              <CodeBlock code={t('nvidiaInstall')} label={t('nvidiaAll')} />

              <div className="mt-6">
                <h4 className="text-[13px] font-semibold text-[var(--text-primary)] mb-1">{t('nvidiaPrime')}</h4>
                <p className="text-[12px] leading-relaxed text-[var(--text-secondary)] mb-1">{t('nvidiaPrimeText')}</p>
                <CodeBlock code={t('nvidiaPrimeCmd')} />
              </div>

              <div className="mt-6">
                <h4 className="text-[13px] font-semibold text-[var(--text-primary)] mb-1">{t('nvidiaNouveau')}</h4>
                <p className="text-[12px] leading-relaxed text-[var(--text-secondary)] mb-1">{t('nvidiaNouveauText')}</p>
                <CodeBlock code={t('nvidiaNouveauCmd')} />
              </div>

              <InfoCard color="#76b900">
                <strong className="text-[var(--text-primary)]">NVIDIA 驱动选择建议 / Driver recommendation:</strong>
                <span className="text-[var(--text-secondary)]">
                  {' '}{language === 'zh'
                    ? '游戏玩家强烈推荐使用官方专有驱动。如果遇到 Wayland 兼容问题，可尝试使用 X11 会话。'
                    : 'Gamers should strongly prefer the proprietary driver. If you encounter Wayland issues, try an X11 session.'}
                </span>
              </InfoCard>
            </CollapsibleSection>

            {/* AMD */}
            <CollapsibleSection
              title={t('amdTitle')}
              desc={t('amdDesc')}
              defaultOpen={allOpen}
            >
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)] mb-3">{t('amdText')}</p>
              <CodeBlock code={t('amdCmd')} label={language === 'zh' ? '各发行版安装' : 'Install per distro'} />

              <div className="mt-6">
                <h4 className="text-[13px] font-semibold text-[var(--text-primary)] mb-1">{t('amdRadv')}</h4>
                <p className="text-[12px] leading-relaxed text-[var(--text-secondary)] mb-1">{t('amdRadvText')}</p>
                <CodeBlock code={t('amdRadvCmd')} />
              </div>

              <InfoCard color="#ed1045">
                <strong className="text-[var(--text-primary)]">AMD 用户提示 / AMD tip:</strong>
                <span className="text-[var(--text-secondary)]">
                  {' '}{language === 'zh'
                    ? '建议使用最新的 Mesa 版本 (23.2+)。考虑从 Kisak Mesa PPA (Ubuntu) 或 Arch 的 mesa-git (AUR) 获取更新版本。'
                    : 'Use the latest Mesa (23.2+). Consider Kisak Mesa PPA (Ubuntu) or mesa-git (AUR) for bleeding-edge builds.'}
                </span>
              </InfoCard>
            </CollapsibleSection>

            {/* Intel */}
            <CollapsibleSection
              title={t('intelTitle')}
              desc={t('intelDesc')}
              defaultOpen={allOpen}
            >
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)] mb-3">{t('intelText')}</p>
              <CodeBlock code={t('intelCmd')} label={language === 'zh' ? '各发行版安装' : 'Install per distro'} />
            </CollapsibleSection>

            {/* Chinese GPUs */}
            <CollapsibleSection
              title={t('cnGpuTitle')}
              desc={t('cnGpuDesc')}
              defaultOpen={allOpen}
            >
              <div className="mt-2 mb-5">
                <h4 className="text-[13px] font-semibold text-[var(--text-primary)] mb-1">{t('mtDesc')}</h4>
                <p className="text-[12px] text-[var(--text-secondary)] mb-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 mr-2">{t('mtStatus')}</span>
                  {t('mtText')}
                </p>
                <CodeBlock code={t('mtCmd')} />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[var(--text-primary)] mb-1">{t('jmDesc')}</h4>
                <p className="text-[12px] text-[var(--text-secondary)] mb-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 mr-2">{t('jmStatus')}</span>
                  {t('jmText')}
                </p>
                <CodeBlock code={t('jmCmd')} />
              </div>
            </CollapsibleSection>
          </div>
        </div>

        {/* ================================================
            SECTION 2: WINE / PROTON
            ================================================ */}
        <div>
          <h2 className="text-lg font-bold mb-3 text-[var(--text-primary)]">{t('sectionWine')}</h2>
          <div className="space-y-3">
            {/* Wine Install */}
            <CollapsibleSection
              title={t('wineTitle')}
              desc={t('wineDesc')}
              defaultOpen={allOpen}
            >
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)] mb-3">{t('wineOverview')}</p>
              <CodeBlock code={t('wineInstall')} label={language === 'zh' ? '各发行版安装' : 'Install per distro'} />
            </CollapsibleSection>

            {/* Proton-GE */}
            <CollapsibleSection
              title={t('protonTitle')}
              desc={t('protonDesc')}
              defaultOpen={allOpen}
            >
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)] mb-3">{t('protonText')}</p>
              <CodeBlock code={t('protonInstall')} />
              <InfoCard color="#7209b7">
                <strong className="text-[var(--text-primary)]">Proton 推荐 / Recommendation:</strong>
                <span className="text-[var(--text-secondary)]">
                  {' '}{language === 'zh'
                    ? '安装 ProtonUP-Qt 是最简单的方式。之后再在 Steam 游戏属性 > 兼容性 中选择 GE-Proton 版本。'
                    : 'ProtonUp-Qt is the easiest way. Then in Steam game Properties > Compatibility, select GE-Proton.'}
                </span>
              </InfoCard>
            </CollapsibleSection>

            {/* Winecfg + Winetricks */}
            <CollapsibleSection
              title={t('winecfgTitle')}
              desc={t('winecfgDesc')}
              defaultOpen={allOpen}
            >
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)] mb-3">{t('winecfgText')}</p>
              <CodeBlock code={t('winecfgCmd')} />
            </CollapsibleSection>

            {/* DXVK / VKD3D */}
            <CollapsibleSection
              title={t('dxvkTitle')}
              desc={t('dxvkDesc')}
              defaultOpen={allOpen}
            >
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)] mb-3">{t('dxvkText')}</p>
              <CodeBlock code={t('dxvkCmd')} />
              <InfoCard color="#00a4ef">
                <strong className="text-[var(--text-primary)]">DXVK 提示 / Tip:</strong>
                <span className="text-[var(--text-secondary)]">
                  {' '}{language === 'zh'
                    ? '对于 Steam Proton 游戏，DXVK/VKD3D 已内置。仅在手动 Wine 前缀中需要额外安装。'
                    : 'For Steam Proton games, DXVK/VKD3D are built-in. Only install manually for custom Wine prefixes.'}
                </span>
              </InfoCard>
            </CollapsibleSection>
          </div>
        </div>

        {/* ================================================
            SECTION 3: PERFORMANCE OPTIMIZATION
            ================================================ */}
        <div>
          <h2 className="text-lg font-bold mb-3 text-[var(--text-primary)]">{t('sectionPerf')}</h2>
          <div className="space-y-3">
            {/* GameMode */}
            <CollapsibleSection
              title={t('gamemodeTitle')}
              desc={t('gamemodeDesc')}
              defaultOpen={allOpen}
            >
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)] mb-3">{t('gamemodeText')}</p>
              <CodeBlock code={t('gamemodeCmd')} />
              <InfoCard color="#ff6b35">
                <strong className="text-[var(--text-primary)]">GameMode 集成 / Integration:</strong>
                <span className="text-[var(--text-secondary)]">
                  {' '}{language === 'zh'
                    ? '在 Steam 启动选项添加 gamemoderun %command%，Heroic Games Launcher 和 Lutris 也原生支持。'
                    : 'Add gamemoderun %command% in Steam launch options; natively supported by Heroic Games Launcher and Lutris.'}
                </span>
              </InfoCard>
            </CollapsibleSection>

            {/* MangoHud */}
            <CollapsibleSection
              title={t('mangohudTitle')}
              desc={t('mangohudDesc')}
              defaultOpen={allOpen}
            >
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)] mb-3">{t('mangohudText')}</p>
              <CodeBlock code={t('mangohudCmd')} />
            </CollapsibleSection>

            {/* CPU Tuning */}
            <CollapsibleSection
              title={t('cpuPerfTitle')}
              desc={t('cpuPerfDesc')}
              defaultOpen={allOpen}
            >
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)] mb-3">{t('cpuText')}</p>
              <CodeBlock code={t('cpuCmd')} />
            </CollapsibleSection>

            {/* Kernel */}
            <CollapsibleSection
              title={t('kernelTitle')}
              desc={t('kernelDesc')}
              defaultOpen={allOpen}
            >
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)] mb-3">{t('kernelText')}</p>
              <CodeBlock code={t('kernelCmd')} />
              <InfoCard color="#ef4444">
                <strong className="text-[var(--text-primary)]">⚠️ 安全警告 / Security Warning:</strong>
                <span className="text-[var(--text-secondary)]">
                  {' '}{language === 'zh'
                    ? '关闭 CPU 安全缓解措施 (mitigations=off) 会提高性能但降低系统安全性。仅在专用游戏机上使用。'
                    : 'Disabling CPU mitigations (mitigations=off) boosts performance but lowers security. Only use on dedicated gaming machines.'}
                </span>
              </InfoCard>
            </CollapsibleSection>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 p-5 rounded-xl border border-[var(--border-primary)]/20 bg-[var(--bg-secondary)]/30">
        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{t('credits')}</p>
      </div>
    </div>
  );
}
