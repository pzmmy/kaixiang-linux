import webBrowsers from './apps/web-browsers.json';
import communication from './apps/communication.json';
import devLanguages from './apps/dev-languages.json';
import devEditors from './apps/dev-editors.json';
import devTools from './apps/dev-tools.json';
import terminal from './apps/terminal.json';
import cliTools from './apps/cli-tools.json';
import media from './apps/media.json';
import creative from './apps/creative.json';
import gaming from './apps/gaming.json';
import office from './apps/office.json';
import vpnNetwork from './apps/vpn-network.json';
import security from './apps/security.json';
import fileSharing from './apps/file-sharing.json';
import system from './apps/system.json';
import aiTools from './apps/ai-tools.json';
import chinaEssentials from './apps/china-essentials.json';


export type DistroId = 'ubuntu' | 'debian' | 'arch' | 'fedora' | 'opensuse' | 'nix' | 'flatpak' | 'snap' | 'homebrew' | 'deepin' | 'uos';
export type UniversalTargetId = 'npm' | 'script';

export type Category =
    | 'Web Browsers'
    | 'Communication'
    | 'Dev: Languages'
    | 'Dev: Editors'
    | 'Dev: Tools'
    | 'Terminal'
    | 'CLI Tools'
    | 'Media'
    | 'Creative'
    | 'Gaming'
    | 'Office'
    | 'VPN & Network'
    | 'Security'
    | 'File Sharing'
    | 'System'
    | 'AI Tools';

export type IconDef =
    | { type: 'iconify'; set: string; name: string; color?: string }
    | { type: 'url'; url: string };

export interface Distro {
    id: DistroId;
    name: string;
    iconUrl: string;
    color: string;
    installPrefix: string;
}

export interface AppData {
    id: string;
    name: string;
    description: string;
    category: Category;
    icon: IconDef;
    targets: Partial<Record<DistroId | UniversalTargetId, string>>;
    unavailableReason?: string;
    note?: string;
    aliases?: string[];
    size?: number;
}

export const getIconUrl = (icon: IconDef): string => {
    if (icon.type === 'url') return icon.url;
    let url = `https://api.iconify.design/${icon.set}/${icon.name}.svg`;
    if (icon.color) {
        url += `?color=${encodeURIComponent(icon.color)}`;
    }
    return url;
};



/** 国内镜像源配置 */
export interface MirrorSource {
    id: string;
    name: string;
    /** 应用到指定发行版的镜像替换规则 */
    rules: Partial<Record<DistroId, string>>;
    /** Flatpak Flathub 镜像 URL（为空则不替换） */
    flathubMirror?: string;
    description: string;
}

export const mirrorSources: MirrorSource[] = [
    {
        id: 'none',
        name: '官方源（默认）',
        description: '使用发行版官方源，国内下载可能较慢',
        rules: {},
    },
    {
        id: 'tuna',
        name: '清华镜像源',
        description: '清华大学 TUNA 镜像站，速度快、更新及时（推荐），支持 Flatpak',
        flathubMirror: 'https://mirrors.tuna.tsinghua.edu.cn/flathub',
        rules: {
            ubuntu: 'https://mirrors.tuna.tsinghua.edu.cn/ubuntu/',
            debian: 'https://mirrors.tuna.tsinghua.edu.cn/debian/',
            arch: 'https://mirrors.tuna.tsinghua.edu.cn/archlinux/',
            fedora: 'https://mirrors.tuna.tsinghua.edu.cn/fedora/',
            opensuse: 'https://mirrors.tuna.tsinghua.edu.cn/opensuse/',
        },
    },
    {
        id: 'aliyun',
        name: '阿里云镜像',
        description: '阿里云镜像站，系统包全、速度快',
        rules: {
            ubuntu: 'https://mirrors.aliyun.com/ubuntu/',
            debian: 'https://mirrors.aliyun.com/debian/',
            arch: 'https://mirrors.aliyun.com/archlinux/',
            fedora: 'https://mirrors.aliyun.com/fedora/',
            opensuse: 'https://mirrors.aliyun.com/opensuse/',
        },
    },
    {
        id: 'ustc',
        name: '中科大镜像',
        description: '中国科学技术大学镜像站，速度好，支持 Flatpak',
        rules: {
            ubuntu: 'https://mirrors.ustc.edu.cn/ubuntu/',
            debian: 'https://mirrors.ustc.edu.cn/debian/',
            arch: 'https://mirrors.ustc.edu.cn/archlinux/',
            fedora: 'https://mirrors.ustc.edu.cn/fedora/',
            opensuse: 'https://mirrors.ustc.edu.cn/opensuse/',
        },
        flathubMirror: 'https://mirrors.ustc.edu.cn/flathub',
    },
    {
        id: 'sjtug',
        name: '上海交大镜像',
        description: 'SJTUG 镜像站，支持 Flatpak 镜像',
        rules: {
            ubuntu: 'https://mirror.sjtu.edu.cn/ubuntu/',
            debian: 'https://mirror.sjtu.edu.cn/debian/',
            arch: 'https://mirror.sjtu.edu.cn/archlinux/',
            fedora: 'https://mirror.sjtu.edu.cn/fedora/',
            opensuse: 'https://mirror.sjtu.edu.cn/opensuse/',
        },
        flathubMirror: 'https://mirror.sjtu.edu.cn/flathub',
    },
    {
        id: 'huawei',
        name: '华为云镜像',
        description: '华为云镜像站，大厂稳定',
        rules: {
            ubuntu: 'https://mirrors.huaweicloud.com/ubuntu/',
            debian: 'https://mirrors.huaweicloud.com/debian/',
            arch: 'https://mirrors.huaweicloud.com/archlinux/',
            fedora: 'https://mirrors.huaweicloud.com/fedora/',
            opensuse: 'https://mirrors.huaweicloud.com/opensuse/',
        },
    },
    {
        id: 'netease',
        name: '网易镜像',
        description: '网易 163 镜像站，老牌稳定',
        rules: {
            ubuntu: 'https://mirrors.163.com/ubuntu/',
            debian: 'https://mirrors.163.com/debian/',
            arch: 'https://mirrors.163.com/archlinux/',
        },
    },
];

/** 装机必备配方 */
export interface Recipe {
    id: string;
    name: string;
    description: string;
    icon: string;
    apps: string[];
}

/**
 * 生成一键初始化脚本（换源 + 字体 + 输入法 + 开发工具镜像 + Docker）
 * @param distroId 发行版
 * @param mirrorId 选中的镜像源 ID（影响 Flatpak 镜像）
 * @param includeDocker 是否安装 Docker CE
 */
export function generateInitScript(distroId: DistroId, mirrorId?: string, includeDocker?: boolean): string {
    const date = new Date().toISOString().split('T')[0];
    const selectedMirror = mirrorSources.find(m => m.id === mirrorId);
    const flathubUrl = selectedMirror?.flathubMirror || 'https://mirrors.tuna.tsinghua.edu.cn/flathub';

    const header = `#!/bin/bash
# ============================================================
# 开箱 Linux 一键初始化脚本
# 生成日期: ${date}
# 发行版: ${distroId}
# 用途: 换国内源 + 中文字体 + 输入法 + 开发工具镜像
# ============================================================
set -euo pipefail

# ============================================================
# 7. 开发工具国内镜像配置（通用，所有发行版适用）
# ============================================================

# --- pip 国内镜像 ---
if command -v pip3 >/dev/null 2>&1; then
    pip3 config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple 2>/dev/null && echo "✓ pip 已换清华源" || echo "⚠ pip 配置失败"
fi

# --- npm 国内镜像 ---
if command -v npm >/dev/null 2>&1; then
    npm config set registry https://registry.npmmirror.com 2>/dev/null && echo "✓ npm 已换淘宝源" || echo "⚠ npm 配置失败"
fi

# --- Go 国内镜像 ---
if command -v go >/dev/null 2>&1; then
    go env -w GOPROXY=https://goproxy.cn,direct 2>/dev/null && echo "✓ Go 已换代理" || echo "⚠ Go 配置失败"
fi

# --- Docker 镜像加速 ---
if command -v docker >/dev/null 2>&1; then
    sudo mkdir -p /etc/docker
    if [ ! -f /etc/docker/daemon.json ]; then
        echo '{"registry-mirrors":["https://docker.mirrors.ustc.edu.cn"]}' | sudo tee /etc/docker/daemon.json >/dev/null && echo "✓ Docker 镜像加速已配置" || echo "⚠ Docker 镜像配置失败"
    else
        echo "✓ Docker daemon.json 已存在，跳过"
    fi
fi

echo "✓ 开发工具镜像配置完成"

`;

    const aptMirror = `# 1. 备份并换清华源
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak 2>/dev/null || true
sudo sed -i 's|http://archive.ubuntu.com|https://mirrors.tuna.tsinghua.edu.cn|g' /etc/apt/sources.list 2>/dev/null || true
sudo sed -i 's|https://archive.ubuntu.com|https://mirrors.tuna.tsinghua.edu.cn|g' /etc/apt/sources.list 2>/dev/null || true
sudo sed -i 's|http://security.ubuntu.com|https://mirrors.tuna.tsinghua.edu.cn|g' /etc/apt/sources.list 2>/dev/null || true
sudo apt update -qq

# 2. 安装中文字体
sudo apt install -y fonts-wqy-microhei fonts-wqy-zenhei 2>/dev/null && echo "✓ 中文字体已安装" || echo "⚠ 字体安装跳过"

# 3. 安装中文输入法
sudo apt install -y fcitx5 fcitx5-chinese-addons fcitx5-configtool 2>/dev/null && echo "✓ 输入法已安装" || echo "⚠ 输入法安装跳过"

# 4. 配置输入法环境变量
grep -q 'GTK_IM_MODULE=fcitx' ~/.xprofile 2>/dev/null || {
    echo >> ~/.xprofile
    echo 'export GTK_IM_MODULE=fcitx' >> ~/.xprofile
    echo 'export QT_IM_MODULE=fcitx' >> ~/.xprofile
    echo 'export XMODIFIERS=@im=fcitx' >> ~/.xprofile
}
echo "✓ 输入法环境变量已配置"

# 5. Flatpak 镜像
sudo flatpak remote-modify flathub --url=${flathubUrl} 2>/dev/null && echo "✓ Flathub 已换源" || echo "⚠ Flatpak 未安装，跳过"
`;

    const archScript = `# 1. 配置清华源
sudo sed -i 's|#Server = http://mirror.archlinux|Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux|g' /etc/pacman.d/mirrorlist 2>/dev/null || true
echo "✓ 镜像源已配置"

# 2. 添加 archlinuxcn 源（快速安装微信/QQ等中国软件）
if ! grep -q '\[archlinuxcn\]' /etc/pacman.conf 2>/dev/null; then
    echo -e "\\n[archlinuxcn]\\nServer = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/\\$arch" | sudo tee -a /etc/pacman.conf >/dev/null
    sudo pacman-key --init 2>/dev/null || true
    sudo pacman-key --populate archlinuxcn 2>/dev/null || true
    echo "✓ archlinuxcn 源已添加"
else
    echo "✓ archlinuxcn 源已存在"
fi

# 3. 更新系统
sudo pacman -Syu --noconfirm

# 4. 安装中文字体
sudo pacman -S --noconfirm wqy-microhei wqy-zenhei 2>/dev/null && echo "✓ 中文字体已安装" || echo "⚠ 字体安装跳过"

# 5. 安装中文输入法
sudo pacman -S --noconfirm fcitx5 fcitx5-chinese-addons fcitx5-configtool 2>/dev/null && echo "✓ 输入法已安装" || echo "⚠ 输入法安装跳过"

# 6. 配置输入法环境变量
grep -q 'GTK_IM_MODULE=fcitx' ~/.xprofile 2>/dev/null || {
    echo >> ~/.xprofile
    echo 'export GTK_IM_MODULE=fcitx' >> ~/.xprofile
    echo 'export QT_IM_MODULE=fcitx' >> ~/.xprofile
    echo 'export XMODIFIERS=@im=fcitx' >> ~/.xprofile
}
echo "✓ 输入法环境变量已配置"

# 7. Flatpak 镜像
sudo flatpak remote-modify flathub --url=${flathubUrl} 2>/dev/null && echo "✓ Flathub 已换源" || echo "⚠ Flatpak 未安装，跳过"
`;

    const fedoraScript = `# 1. 换清华源
sudo sed -i 's|#baseurl=http://download.example/pub/fedora/linux|baseurl=https://mirrors.tuna.tsinghua.edu.cn/fedora|g' /etc/yum.repos.d/fedora.repo 2>/dev/null || true
echo "✓ 镜像源已配置"

# 2. 安装中文字体
sudo dnf install -y wqy-microhei-fonts 2>/dev/null && echo "✓ 中文字体已安装" || echo "⚠ 字体安装跳过"

# 3. 安装中文输入法
sudo dnf install -y fcitx5 fcitx5-chinese-addons 2>/dev/null && echo "✓ 输入法已安装" || echo "⚠ 输入法安装跳过"

# 4. 配置输入法
grep -q 'GTK_IM_MODULE=fcitx' ~/.xprofile 2>/dev/null || {
    echo >> ~/.xprofile
    echo 'export GTK_IM_MODULE=fcitx' >> ~/.xprofile
    echo 'export QT_IM_MODULE=fcitx' >> ~/.xprofile
    echo 'export XMODIFIERS=@im=fcitx' >> ~/.xprofile
}
echo "✓ 输入法环境变量已配置"

# 5. Flatpak 镜像
sudo flatpak remote-modify flathub --url=${flathubUrl} 2>/dev/null && echo "✓ Flathub 已换源" || echo "⚠ Flatpak 未安装，跳过"
`;

    let dockerSection = '';
    if (includeDocker) {
        dockerSection = `

# ============================================================
# 8. 安装 Docker CE
# ============================================================
# 检测并安装 Docker CE（仅当 docker 命令不存在时）
if ! command -v docker >/dev/null 2>&1; then
    echo "正在安装 Docker CE..."
    curl -fsSL https://test.docker.com -o /tmp/get-docker.sh 2>/dev/null && sh /tmp/get-docker.sh 2>/dev/null && {
        sudo usermod -aG docker $USER 2>/dev/null || true
        # 配置镜像加速
        sudo mkdir -p /etc/docker
        echo '{"registry-mirrors":["https://docker.mirrors.ustc.edu.cn"]}' | sudo tee /etc/docker/daemon.json >/dev/null
        echo "✓ Docker CE 已安装（镜像加速已配置）"
    } || echo "⚠ Docker 安装失败，请手动安装"
else
    echo "✓ Docker 已存在，跳过安装"
fi
`;
    }

    // Build distro-specific part
    let distroPart: string;
    switch (distroId) {
        case 'ubuntu':
        case 'debian':
        case 'deepin':
        case 'uos':
            distroPart = aptMirror;
            break;
        case 'arch':
            distroPart = archScript;
            break;
        case 'fedora':
            distroPart = fedoraScript;
            break;
        case 'opensuse':
            distroPart = `# 1. 换清华源
sudo zypper mr -da
sudo zypper ar -fcg https://mirrors.tuna.tsinghua.edu.cn/opensuse/distribution/leap/15.6/repo/oss/ TUNA-OSS
sudo zypper ar -fcg https://mirrors.tuna.tsinghua.edu.cn/opensuse/distribution/leap/15.6/repo/non-oss/ TUNA-NON-OSS
sudo zypper ref
sudo zypper install -y wqy-microhei-fonts fcitx5 fcitx5-chinese-addons

# Flatpak 镜像
sudo flatpak remote-modify flathub --url=${flathubUrl} 2>/dev/null && echo "✓ Flathub 已换源" || echo "⚠ Flatpak 未安装，跳过"
`;
            break;
        default:
            return `# 当前发行版 (${distroId}) 暂不支持一键初始化。
# 请手动配置镜像源和输入法。`;
    }

    return header + distroPart + dockerSection;
}

export const recipes: Recipe[] = [
    {
        id: 'office-cn',
        name: '办公必备',
        description: '办公套件 + 沟通协作',
        icon: 'Briefcase',
        apps: ['wps-office', 'wechat', 'qq', 'dingtalk', 'feishu', 'tencent-meeting', 'thunderbird'],
    },
    {
        id: 'dev-env',
        name: '开发环境',
        description: 'IDE + 语言 + 容器 + Git',
        icon: 'Code2',
        apps: ['vscode', 'git', 'docker', 'docker-compose', 'nodejs', 'python3', 'openjdk', 'neovim', 'lazygit', 'cmake', 'dbeaver'],
    },
    {
        id: 'social-media',
        name: '社交娱乐',
        description: '聊天 + 音乐 + 浏览器 + 下载',
        icon: 'MessageCircle',
        apps: ['wechat', 'qq', 'netease-cloud-music', 'firefox', 'chrome', 'vlc', 'baidunetdisk', 'flameshot'],
    },
    {
        id: 'daily-cn',
        name: '日常推荐',
        description: '中国用户常用软件组合',
        icon: 'Sparkles',
        apps: ['wps-office', 'wechat', 'qq', 'dingtalk', 'netease-cloud-music', 'baidunetdisk', 'sogouime', 'sunlogin', 'firefox', 'vlc', 'flameshot'],
    },
    {
        id: 'gaming',
        name: '游戏玩家',
        description: 'Steam + 游戏工具 + 性能优化',
        icon: 'Gamepad2',
        apps: ['steam', 'lutris', 'heroic', 'mangohud', 'gamemode', 'protonup', 'goverlay', 'retroarch'],
    },
];

export const distros: Distro[] = [
    { id: 'ubuntu', name: 'Ubuntu', iconUrl: 'https://api.iconify.design/simple-icons/ubuntu.svg?color=%23E95420', color: '#E95420', installPrefix: 'sudo apt install -y' },
    { id: 'debian', name: 'Debian', iconUrl: 'https://api.iconify.design/simple-icons/debian.svg?color=%23A81D33', color: '#A81D33', installPrefix: 'sudo apt install -y' },
    { id: 'arch', name: 'Arch Linux', iconUrl: 'https://api.iconify.design/simple-icons/archlinux.svg?color=%231793D1', color: '#1793D1', installPrefix: 'sudo pacman -S --needed --noconfirm' },
    { id: 'fedora', name: 'Fedora', iconUrl: 'https://api.iconify.design/simple-icons/fedora.svg?color=%2351A2DA', color: '#51A2DA', installPrefix: 'sudo dnf install -y' },
    { id: 'opensuse', name: 'OpenSUSE', iconUrl: 'https://api.iconify.design/simple-icons/opensuse.svg?color=%2373BA25', color: '#73BA25', installPrefix: 'sudo zypper install -y' },
    { id: 'nix', name: 'NixOS', iconUrl: 'https://api.iconify.design/simple-icons/nixos.svg?color=%235277C3', color: '#5277C3', installPrefix: 'nix-env -iA nixpkgs.' },
    { id: 'deepin', name: 'Deepin', iconUrl: 'https://api.iconify.design/simple-icons/deepin.svg?color=%23007CFF', color: '#007CFF', installPrefix: 'sudo apt install -y' },
    { id: 'uos', name: 'UOS 统信', iconUrl: 'https://api.iconify.design/simple-icons/deepin.svg?color=%230081FF', color: '#0081FF', installPrefix: 'sudo apt install -y' },
    { id: 'flatpak', name: 'Flatpak（通用）', iconUrl: 'https://api.iconify.design/simple-icons/flatpak.svg?color=%234A90D9', color: '#4A90D9', installPrefix: 'flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo && flatpak install flathub -y' },
    { id: 'snap', name: 'Snap（通用）', iconUrl: 'https://api.iconify.design/simple-icons/snapcraft.svg?color=%2382BEA0', color: '#82BEA0', installPrefix: 'sudo snap install' },
    { id: 'homebrew', name: 'Homebrew（通用）', iconUrl: 'https://api.iconify.design/simple-icons/homebrew.svg?color=%23FBB040', color: '#FBB040', installPrefix: 'brew install' },
];

export const apps: AppData[] = [
    ...(webBrowsers as AppData[]),
    ...(communication as AppData[]),
    ...(devLanguages as AppData[]),
    ...(devEditors as AppData[]),
    ...(devTools as AppData[]),
    ...(terminal as AppData[]),
    ...(cliTools as AppData[]),
    ...(media as AppData[]),
    ...(creative as AppData[]),
    ...(gaming as AppData[]),
    ...(office as AppData[]),
    ...(vpnNetwork as AppData[]),
    ...(security as AppData[]),
    ...(fileSharing as AppData[]),
    ...(system as AppData[]),
    ...(aiTools as AppData[]),
    ...(chinaEssentials as AppData[])
];

export const categories: Category[] = [
    'Web Browsers',
    'Communication',
    'Media',
    'Gaming',
    'Office',
    'Creative',
    'System',
    'File Sharing',
    'Security',
    'VPN & Network',
    'Dev: Editors',
    'Dev: Languages',
    'Dev: Tools',
    'Terminal',
    'CLI Tools',
    'AI Tools',
];

/** 分类中文名映射 */
export const categoryNamesZh: Record<Category, string> = {
    'Web Browsers': '网页浏览器',
    'Communication': '通讯工具',
    'Media': '影音媒体',
    'Gaming': '游戏娱乐',
    'Office': '办公软件',
    'Creative': '创意设计',
    'System': '系统工具',
    'File Sharing': '文件分享',
    'Security': '安全隐私',
    'VPN & Network': '网络工具',
    'Dev: Editors': '开发：编辑器',
    'Dev: Languages': '开发：语言环境',
    'Dev: Tools': '开发：工具',
    'Terminal': '终端模拟器',
    'CLI Tools': '命令行工具',
    'AI Tools': 'AI 工具',
};

/** 发行版中文名映射 */
export const distroNamesZh: Record<string, string> = {
    'ubuntu': 'Ubuntu',
    'debian': 'Debian',
    'arch': 'Arch Linux',
    'fedora': 'Fedora',
    'opensuse': 'OpenSUSE',
    'nix': 'NixOS',
    'deepin': 'Deepin',
    'uos': 'UOS 统信',
    'flatpak': 'Flatpak（通用）',
    'snap': 'Snap（通用）',
    'homebrew': 'Homebrew（通用）',
};

export const getAppsByCategory = (category: Category): AppData[] => {
    return apps.filter(app => app.category === category);
};

export const isAppAvailable = (app: AppData, distro: DistroId): boolean => {
    return (distro in app.targets) || 
           ('npm' in app.targets) || 
           ('script' in app.targets);
};
