/**
 * 国产发行版元数据
 * 用于 Deepin/UOS 等国产 Linux 发行版的专属配置
 */

export interface ChinaDistroMeta {
  id: string;
  name: string;
  nameZh: string;
  /** 底层包管理器 */
  packageManager: 'apt' | 'dnf' | 'pacman';
  /** 软件源类型 */
  repoType: string;
  /** 应用商店地址（建议用户优先使用） */
  appStoreUrl: string;
  /** 应用商店名称 */
  appStoreName: string;
  /** 备注 */
  note: string;
  /** 是否基于 debian */
  basedOnDebian: boolean;
}

/** 国产发行版元数据列表 */
export const chinaDistros: ChinaDistroMeta[] = [
  {
    id: 'deepin',
    name: 'Deepin',
    nameZh: '深度操作系统',
    packageManager: 'apt',
    repoType: 'deb',
    appStoreUrl: 'https://www.deepin.org/',
    appStoreName: '深度应用商店',
    note: 'Deepin 深度操作系统，建议优先使用深度应用商店安装软件，图形化界面更友好。',
    basedOnDebian: true,
  },
  {
    id: 'uos',
    name: 'UOS',
    nameZh: '统信 UOS',
    packageManager: 'apt',
    repoType: 'deb',
    appStoreUrl: 'https://www.chinauos.com/',
    appStoreName: 'UOS 应用商店',
    note: '统信 UOS，建议优先使用 UOS 应用商店安装软件，图形化界面更友好。',
    basedOnDebian: true,
  },
];

/**
 * 国产发行版包名差异对照表
 * 对于常用软件，国产发行版可能使用不同的包名或需要特殊处理
 * 格式: { 通用软件id: { deepin?: string, uos?: string } }
 * 如果与 debian/ubuntu 相同则无需列出
 */
export interface ChinaPackageOverride {
  appName: string;
  appId: string;
  deepin?: string;
  uos?: string;
  note?: string;
}

/** 国产发行版常用开发工具包名差异对照 */
export const chinaPackageOverrides: ChinaPackageOverride[] = [
  {
    appId: 'wps-office',
    appName: 'WPS Office',
    note: 'Deepin/UOS 应用商店内置 WPS，建议从商店安装',
  },
  {
    appId: 'wechat',
    appName: '微信',
    deepin: 'com.qq.weixin.deepin',
    uos: 'com.qq.weixin.deepin',
    note: 'Deepin/UOS 应用商店版本体验更好',
  },
  {
    appId: 'qq',
    appName: 'QQ',
    deepin: 'com.qq.qqim.deepin',
    uos: 'com.qq.qqim.deepin',
    note: 'Deepin/UOS 应用商店版本体验更好',
  },
  {
    appId: 'dingtalk',
    appName: '钉钉',
    deepin: 'com.alibabainc.dingtalk',
    note: 'Deepin 应用商店有原生版本',
  },
  {
    appId: 'feishu',
    appName: '飞书',
    note: '建议从 Deepin/UOS 应用商店安装',
  },
  {
    appId: 'netease-cloud-music',
    appName: '网易云音乐',
    deepin: 'com.163.music',
    note: 'Deepin 应用商店版本为原生适配版',
  },
  {
    appId: 'sogouime',
    appName: '搜狗输入法',
    deepin: 'sogoupinyin',
    note: 'Deepin 应用商店内置搜狗输入法',
  },
  {
    appId: 'baidunetdisk',
    appName: '百度网盘',
    deepin: 'com.baidu.baidunetdisk',
    note: 'Deepin 应用商店有原生版本',
  },
  {
    appId: 'sunlogin',
    appName: '向日葵',
    note: 'Deepin/UOS 应用商店有原生版本，建议从商店安装',
  },
  {
    appId: 'vscode',
    appName: 'VS Code',
    note: 'Deepin/UOS 可用 sudo apt install code 安装，或从应用商店安装',
  },
  {
    appId: 'docker',
    appName: 'Docker',
    note: 'Deepin/UOS 使用 sudo apt install docker.io，或使用官方脚本 curl -fsSL https://test.docker.com | sh',
  },
];

/**
 * 检查指定发行版是否为国产发行版
 */
export function isChinaDistro(distroId: string): boolean {
  return chinaDistros.some(d => d.id === distroId);
}

/**
 * 获取国产发行版元数据
 */
export function getChinaDistroMeta(distroId: string): ChinaDistroMeta | undefined {
  return chinaDistros.find(d => d.id === distroId);
}

/**
 * 获取国产发行版的应用商店提示
 */
export function getAppStoreHint(distroId: string, language: 'zh' | 'en'): string {
  const meta = getChinaDistroMeta(distroId);
  if (!meta) return '';
  if (language === 'zh') {
    return `建议优先使用「${meta.appStoreName}」安装软件（图形化界面更方便），如需命令行安装也可使用 apt。`;
  }
  return `It is recommended to use "${meta.appStoreName}" for installing software (GUI-friendly). The apt command is also available as a fallback.`;
}
