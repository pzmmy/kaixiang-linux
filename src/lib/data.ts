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
        description: '使用发行版官方源，速度视网络而定',
        rules: {},
    },
    {
        id: 'tuna',
        name: '清华镜像源',
        description: '清华大学 TUNA 镜像站，速度快、更新及时',
        rules: {
            ubuntu: 'https://mirrors.tuna.tsinghua.edu.cn/ubuntu/',
            debian: 'https://mirrors.tuna.tsinghua.edu.cn/debian/',
            arch: 'https://mirrors.tuna.tsinghua.edu.cn/archlinux/',
            fedora: 'https://mirrors.tuna.tsinghua.edu.cn/fedora/',
            opensuse: 'https://mirrors.tuna.tsinghua.edu.cn/opensuse/',
        },
        flathubMirror: 'https://mirrors.tuna.tsinghua.edu.cn/flathub',
    },
    {
        id: 'aliyun',
        name: '阿里云镜像',
        description: '阿里云镜像站，国内访问快',
        rules: {
            ubuntu: 'https://mirrors.aliyun.com/ubuntu/',
            debian: 'https://mirrors.aliyun.com/debian/',
            arch: 'https://mirrors.aliyun.com/archlinux/',
            fedora: 'https://mirrors.aliyun.com/fedora/',
            opensuse: 'https://mirrors.aliyun.com/opensuse/',
        },
        flathubMirror: 'https://mirrors.aliyun.com/flathub',
    },
    {
        id: 'ustc',
        name: '中科大镜像',
        description: '中国科学技术大学镜像站',
        rules: {
            ubuntu: 'https://mirrors.ustc.edu.cn/ubuntu/',
            debian: 'https://mirrors.ustc.edu.cn/debian/',
            arch: 'https://mirrors.ustc.edu.cn/archlinux/',
            fedora: 'https://mirrors.ustc.edu.cn/fedora/',
            opensuse: 'https://mirrors.ustc.edu.cn/opensuse/',
        },
        flathubMirror: 'https://mirrors.ustc.edu.cn/flathub',
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
