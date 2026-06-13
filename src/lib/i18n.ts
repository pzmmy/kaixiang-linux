'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ============================================================
// Translation table
// ============================================================
const translations: Record<string, Record<string, string>> = {
  zh: {
    'site.title': '开箱 Linux',
    'site.subtitle': '一键装软件，Linux 就该这么简单。',
    'search.placeholder': '搜索软件...',
    'search.noResults': '没有找到匹配的软件',
    'search.tryOther': '试试其他关键词，或清除搜索条件',
    'recipe.oneClick': '🧩 一键选:',
    'command.preview': '选好软件，生成安装命令...',
    'selectAll': '全选此分类',
    'showAll': '显示全部分类',
    'init.title': '🚀 一键初始化',
    'init.desc': '一键换源+安装中文字体+输入法+pip/npm/go/docker镜像',
    'distro.label': '发行版',
    'command.label': '命令',
    'count.format': '{0} 款',
    'btn.copy': '复制',
    'btn.download': '下载',
    'btn.preview': '预览',
    'btn.clear': '全部清空',
    'aur.helper': 'AUR 助手',
    'aur.count': '{0} 个',
    'unfree.title': '⚠ 非自由软件',
    'shortcuts.title': '快捷键',
    'shortcut.search': '搜索',
    'shortcut.nav': '导航',
    'shortcut.select': '选择',
    'shortcut.copy': '复制',
    'shortcut.download': '下载',
    'shortcut.preview': '预览',
    'shortcut.theme': '主题',
    'shortcut.clear': '清空',
    'shortcut.help': '帮助',
    'shortcut.close': '关闭',
    'tooltip.github': '在 GitHub 上查看',
    'tooltip.contribute': '参与贡献',
    'command.viewFull': '点击查看完整命令',
    'category.selectAll': '+全选',
    'docker.label': '🐳 Docker',
  },
  en: {
    'site.title': 'Kaixiang Linux',
    'site.subtitle': 'One-click software installation for Linux.',
    'search.placeholder': 'Search software...',
    'search.noResults': 'No matching software found',
    'search.tryOther': 'Try different keywords or clear search',
    'recipe.oneClick': '🧩 Quick select:',
    'command.preview': 'Select software, generate install command...',
    'selectAll': 'Select all in category',
    'showAll': 'Show all categories',
    'init.title': '🚀 One-click init',
    'init.desc': 'One-click mirror + Chinese font + IME + dev mirrors',
    'distro.label': 'Distro',
    'command.label': 'Command',
    'count.format': '{0} apps',
    'btn.copy': 'Copy',
    'btn.download': 'Download',
    'btn.preview': 'Preview',
    'btn.clear': 'Clear all',
    'aur.helper': 'AUR Helper',
    'aur.count': '{0} packages',
    'unfree.title': '⚠ Non-free software',
    'shortcuts.title': 'Shortcuts',
    'shortcut.search': 'Search',
    'shortcut.nav': 'Navigate',
    'shortcut.select': 'Select',
    'shortcut.copy': 'Copy',
    'shortcut.download': 'Download',
    'shortcut.preview': 'Preview',
    'shortcut.theme': 'Theme',
    'shortcut.clear': 'Clear',
    'shortcut.help': 'Help',
    'shortcut.close': 'Close',
    'tooltip.github': 'View on GitHub',
    'tooltip.contribute': 'Contribute',
    'command.viewFull': 'Click to view full command',
    'category.selectAll': '+Select all',
    'docker.label': '🐳 Docker',
  },
};

// ============================================================
// Context
// ============================================================
type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, ...args: string[]) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'zh',
  setLanguage: () => {},
  t: (key: string) => key,
});

// ============================================================
// Provider
// ============================================================
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');

  useEffect(() => {
    const stored = localStorage.getItem('kaixiang-language') as Language | null;
    if (stored === 'zh' || stored === 'en') {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kaixiang-language', lang);
  }, []);

  const t = useCallback((key: string, ...args: string[]): string => {
    const langTable = translations[language] || translations.zh;
    let text = langTable[key] || key;
    args.forEach((arg, i) => {
      text = text.replace(`{${i}}`, arg);
    });
    return text;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================
export function useLanguage() {
  return useContext(LanguageContext);
}
