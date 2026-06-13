'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';

import { useLinuxInit } from '@/hooks/useLinuxInit';
import { useTooltip } from '@/hooks/useTooltip';
import { useKeyboardNavigation, type NavItem } from '@/hooks/useKeyboardNavigation';
import { useVerification } from '@/hooks/useVerification';
import { apps, categories, getAppsByCategory, categoryNamesZh, mirrorSources, recipes, generateInitScript } from '@/lib/data';
import { isChinaDistro, getChinaDistroMeta, getAppStoreHint } from '@/lib/data/china-distros';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { HowItWorks, GitHubLink, ContributeLink } from '@/components/header';
import { DistroSelector } from '@/components/distro';
import { MirrorSelector } from '@/components/distro/MirrorSelector';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { CategorySection } from '@/components/app';
import { CommandFooter } from '@/components/command';
import { Tooltip, GlobalStyles, LoadingSkeleton, AutoDetectBanner, useAutoDetect } from '@/components/common';
import { Sidebar } from '@/components/sidebar';
import { HardwareCheck } from '@/components/hardware';
import { WeChatGuide, WeComGuide } from '@/components/wechat';
import { PerformanceGuide } from '@/components/gaming';
import { LanguageProvider, useLanguage } from '@/lib/i18n';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

function HomeContent() {
    const { t, language, setLanguage } = useLanguage();

    const { tooltip, show: showTooltip, hide: hideTooltip, tooltipMouseEnter, tooltipMouseLeave, setTooltipRef } = useTooltip();

    const {
        selectedDistro,
        selectedApps,
        setSelectedDistro,
        toggleApp,
        clearAll,
        isAppAvailable,
        generatedCommand,
        selectedCount,
        hasYayInstalled,
        setHasYayInstalled,
        hasAurPackages,
        aurAppNames,
        isHydrated,
        selectedHelper,
        setSelectedHelper,
        hasUnfreePackages,
        unfreeAppNames,
        selectedMirror,
        setMirrorSource,
        totalSize,
    } = useLinuxInit();

    const { detectedDistro, isDismissed, dismiss: dismissBanner } = useAutoDetect();
    useEffect(() => {
        if (detectedDistro) {
            setSelectedDistro(detectedDistro);
        }
    }, [detectedDistro, setSelectedDistro]);

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    // activeCategory: when set, only this category is shown (focus mode)
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [initScriptMode, setInitScriptMode] = useState(false);
    const [includeDocker, setIncludeDocker] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setDebouncedSearch(query);
            // Clear active category when search changes (show all matching results)
            setActiveCategory(null);
        }, 120);
    }, []);

    const selectAllInCategory = useCallback((catApps: {id: string}[]) => {
        catApps.forEach(app => {
            if (isAppAvailable(app.id)) toggleApp(app.id);
        });
    }, [isAppAvailable, toggleApp]);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerClosing, setDrawerClosing] = useState(false);

    const closeDrawer = useCallback(() => {
        setDrawerClosing(true);
        setTimeout(() => {
            setDrawerOpen(false);
            setDrawerClosing(false);
        }, 250);
    }, []);

    const openDrawer = useCallback(() => {
        if (selectedCount > 0) setDrawerOpen(true);
    }, [selectedCount]);

    const [activeShortcut, setActiveShortcut] = useState<string | null>(null);
    const [showHardwareCheck, setShowHardwareCheck] = useState(false);
    const toggleHardwareCheck = useCallback(() => {
        setShowHardwareCheck(prev => !prev);
        setShowWeChat(false);
        setShowGamingGuide(false);
    }, []);
    const [showWeChat, setShowWeChat] = useState(false);
    const toggleWeChat = useCallback(() => {
        setShowWeChat(prev => !prev);
        setShowHardwareCheck(false);
        setShowGamingGuide(false);
    }, []);
    const [showGamingGuide, setShowGamingGuide] = useState(false);
    const toggleGamingGuide = useCallback(() => {
        setShowGamingGuide(prev => !prev);
        setShowHardwareCheck(false);
        setShowWeChat(false);
    }, []);

    const toggleThemeWithFlash = useCallback(() => {
        document.body.classList.add('theme-flash');
        setTimeout(() => document.body.classList.remove('theme-flash'), 150);
        const themeBtn = document.querySelector('[aria-label="Toggle theme"]') as HTMLButtonElement;
        if (themeBtn) themeBtn.click();
    }, []);

    const { isVerified, getVerificationSource } = useVerification();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;

            if (e.ctrlKey || e.altKey || e.metaKey) return;

            if (e.key === '/') {
                e.preventDefault();
                const inputs = document.querySelectorAll<HTMLInputElement>('input[placeholder="' + t('search.placeholder') + '"]');
                const visibleInput = Array.from(inputs).find(input => input.offsetParent !== null);
                if (visibleInput) visibleInput.focus();
                return;
            }

            const alwaysEnabled = ['t', 'c', '?'];
            if (selectedCount === 0 && !alwaysEnabled.includes(e.key)) return;

            switch (e.key) {
                case 'y':
                    setActiveShortcut('y');
                    setTimeout(() => setActiveShortcut(null), 150);
                    const copyBtns = document.querySelectorAll<HTMLButtonElement>('[data-action="copy"]');
                    const visibleCopyBtn = Array.from(copyBtns).find(b => b.offsetParent !== null);
                    if (visibleCopyBtn) visibleCopyBtn.click();
                    break;
                case 'd':
                    setActiveShortcut('d');
                    setTimeout(() => setActiveShortcut(null), 150);
                    const dlBtns = document.querySelectorAll<HTMLButtonElement>('[data-action="download"]');
                    const visibleDlBtn = Array.from(dlBtns).find(b => b.offsetParent !== null);
                    if (visibleDlBtn) visibleDlBtn.click();
                    break;
                case 't':
                    setActiveShortcut('t');
                    setTimeout(() => setActiveShortcut(null), 150);
                    toggleThemeWithFlash();
                    break;
                case 'c':
                    setActiveShortcut('c');
                    setTimeout(() => setActiveShortcut(null), 150);
                    clearAll();
                    break;
                case '1':
                    if (hasAurPackages) setSelectedHelper('yay');
                    break;
                case '2':
                    if (hasAurPackages) setSelectedHelper('paru');
                    break;
                case 'Tab':
                    e.preventDefault();
                    if (selectedCount > 0) {
                        if (drawerOpen) {
                            closeDrawer();
                        } else {
                            openDrawer();
                        }
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedCount, clearAll, hasAurPackages, setSelectedHelper, drawerOpen, closeDrawer, openDrawer, toggleThemeWithFlash, t]);

    const allCategoriesWithApps = useMemo(() => {
        const query = debouncedSearch.toLowerCase().trim();
        return categories
            .map(cat => {
                // If activeCategory is set, skip non-matching categories
                if (activeCategory && cat !== activeCategory) {
                    return { category: cat, apps: [] };
                }
                const categoryApps = getAppsByCategory(cat);
                const filteredApps = query
                    ? categoryApps.filter(app =>
                        app.name.toLowerCase().includes(query) ||
                        app.id.toLowerCase().includes(query) ||
                        app.description.toLowerCase().includes(query) ||
                        (app.aliases && app.aliases.some(a => a.toLowerCase().includes(query)))
                    )
                    : categoryApps;
                return { category: cat, apps: filteredApps };
            })
            .filter(c => c.apps.length > 0);
    }, [debouncedSearch, activeCategory]);

    const searchSuggestions = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return [];
        const results: Array<{ name: string; category: string; id: string }> = [];
        const seen = new Set<string>();
        for (const app of apps) {
            if (results.length >= 8) break;
            if (seen.has(app.id)) continue;
            const match = 
                app.name.toLowerCase().includes(q) ||
                app.id.toLowerCase().includes(q) ||
                app.description.toLowerCase().includes(q) ||
                (app.aliases && app.aliases.some(a => a.toLowerCase().includes(q)));
            if (match) {
                results.push({ name: app.name, category: app.category, id: app.id });
                seen.add(app.id);
            }
        }
        return results;
    }, [searchQuery]);

    const COLUMN_COUNT = 4;

    const columns = useMemo(() => {
        const cols: Array<typeof allCategoriesWithApps> = Array.from({ length: COLUMN_COUNT }, () => []);
        const heights = Array(COLUMN_COUNT).fill(0);

        allCategoriesWithApps.forEach(catData => {
            const minIdx = heights.indexOf(Math.min(...heights));
            cols[minIdx].push(catData);
            heights[minIdx] += catData.apps.length + 2;
        });

        return cols;
    }, [allCategoriesWithApps]);

    // When activeCategory is set, expand only that category; otherwise expand all
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => new Set(categories));

    // Sync expanded state with activeCategory changes
    useEffect(() => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (activeCategory) {
                // Expand only the active category
                for (const cat of next) {
                    if (cat !== activeCategory) next.delete(cat);
                }
                next.add(activeCategory);
            } else {
                // Expand all
                for (const cat of categories) {
                    next.add(cat);
                }
            }
            return next;
        });
    }, [activeCategory]);

    const toggleCategoryExpanded = useCallback((cat: string) => {
        // Clicking a category header toggles activeCategory:
        // - No active category → set it, expanding only this category
        // - Same category already active → clear it, show all
        // - Different category active → switch to new one
        setActiveCategory(prev => prev === cat ? null : cat);
    }, []);

    const navItems = useMemo(() => {
        const items: NavItem[][] = [];
        columns.forEach((colCategories) => {
            const colItems: NavItem[] = [];
            colCategories.forEach(({ category, apps: catApps }) => {
                colItems.push({ type: 'category', id: category, category });
                if (expandedCategories.has(category)) {
                    catApps.forEach(app => colItems.push({ type: 'app', id: app.id, category }));
                }
            });
            items.push(colItems);
        });
        return items;
    }, [columns, expandedCategories]);

    const { focusedItem, clearFocus, setFocusByItem, isKeyboardNavigating } = useKeyboardNavigation(
        navItems,
        toggleCategoryExpanded,
        toggleApp
    );

    if (!isHydrated) {
        return <LoadingSkeleton />;
    }

    return (
        <ErrorBoundary>
        {!isDismissed && detectedDistro && (
            <AutoDetectBanner detectedDistro={detectedDistro} onDismiss={dismissBanner} />
        )}
        <div
            className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative"
            style={{ transition: 'background-color 0.5s, color 0.5s' }}
            onClick={clearFocus}
        >
            <GlobalStyles />
            <Tooltip tooltip={tooltip} onMouseEnter={tooltipMouseEnter} onMouseLeave={tooltipMouseLeave} setRef={setTooltipRef} />

            <Sidebar
                selectedDistro={selectedDistro}
                onDistroSelect={setSelectedDistro}
                selectedApps={selectedApps}
                selectedCount={selectedCount}
                clearAll={clearAll}
                initScriptMode={initScriptMode}
                command={initScriptMode ? generateInitScript(selectedDistro, selectedMirror, includeDocker) : generatedCommand}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                searchInputRef={searchInputRef}
                searchSuggestions={searchSuggestions}
                hasAurPackages={hasAurPackages}
                aurAppNames={aurAppNames}
                selectedHelper={selectedHelper}
                setSelectedHelper={setSelectedHelper}
                hasUnfreePackages={hasUnfreePackages}
                unfreeAppNames={unfreeAppNames}
                onOpenDrawer={openDrawer}
                showHardwareCheck={showHardwareCheck}
                onToggleHardwareCheck={toggleHardwareCheck}
                showWeChat={showWeChat}
                onToggleWeChat={toggleWeChat}
                showGamingGuide={showGamingGuide}
                onToggleGamingGuide={toggleGamingGuide}
            />

            <header className="lg:hidden pt-8 sm:pt-12 pb-8 sm:pb-10 px-4 sm:px-6 relative animate-fadeIn" style={{ zIndex: 1 }}>
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="header-animate">
                            <div className="flex items-center gap-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={`${basePath}/kaixiang-logo.svg`}
                                    alt={t('site.title')}
                                    className="w-16 h-16 sm:w-[72px] sm:h-[72px] object-contain shrink-0"
                                />
                                <div className="flex flex-col justify-center">
                                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ transition: 'color 0.5s' }}>
                                        {t('site.title')}
                                    </h1>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-0.5">
                                        <p className="text-xs sm:text-sm text-[var(--text-muted)] tracking-widest uppercase opacity-80" style={{ transition: 'color 0.5s' }}>
                                            {t('site.subtitle')}
                                        </p>
                                        <span className="hidden sm:inline text-[var(--text-muted)] opacity-30 text-[10px]">•</span>
                                        <div className="hidden sm:block">
                                            <HowItWorks />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="header-controls flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                            {/* Left side on mobile: Help + Links */}
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="sm:hidden">
                                    <HowItWorks />
                                </div>
                                <GitHubLink />
                                <ContributeLink />
                            </div>

                            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-[var(--border-primary)]">
                                <MirrorSelector selectedMirror={selectedMirror} onSelect={setMirrorSource} />
                                <ThemeToggle />
                                <DistroSelector selectedDistro={selectedDistro} onSelect={setSelectedDistro} />
                            </div>

                            {/* Language toggle */}
                            <button
                                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                                className="px-2 py-1 text-xs font-semibold rounded-lg border border-[var(--border-primary)]/30 
                                    bg-[var(--bg-tertiary)] text-[var(--text-secondary)]
                                    hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]
                                    transition-all duration-200"
                                title={language === 'zh' ? 'Switch to English' : '切换到中文'}
                            >
                                {language === 'zh' ? 'EN' : '中'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="main-with-sidebar px-4 sm:px-6 pb-40 relative" style={{ zIndex: 1 }}>
                <div className="max-w-7xl mx-auto lg:pt-8">
                    {showHardwareCheck ? (
                        <HardwareCheck onClose={() => setShowHardwareCheck(false)} />
                    ) : showWeChat ? (
                        <div className="hardware-check">
                            <WeChatGuide onClose={() => setShowWeChat(false)} />
                            <div className="border-t border-[var(--border-primary)] mx-6 my-2" />
                            <WeComGuide onClose={() => setShowWeChat(false)} />
                        </div>
                    ) : showGamingGuide ? (
                        <PerformanceGuide onClose={() => setShowGamingGuide(false)} />
                    ) : (
                        <div>
                    {/* Active category chip bar */}
                    {activeCategory && (
                        <div className="flex items-center gap-2 mb-3 px-1">
                            <span className="text-sm font-medium text-[var(--accent)]">
                                📂 {language === 'zh' ? (categoryNamesZh as Record<string, string>)[activeCategory] || activeCategory : activeCategory}
                            </span>
                            <button
                                onClick={() => setActiveCategory(null)}
                                className="px-2 py-0.5 text-xs rounded-full border border-[var(--border-primary)]/30 
                                    bg-[var(--bg-tertiary)] text-[var(--text-muted)]
                                    hover:bg-[var(--bg-hover)] transition-all duration-200"
                            >
                                ✕ {t('showAll')}
                            </button>
                        </div>
                    )}
                    {/* 装机必备配方 */}
                    <div className="flex flex-wrap items-center gap-2 mb-6 px-1">
                        <span className="text-xs font-medium text-[var(--text-muted)] mr-1 whitespace-nowrap">{t('recipe.oneClick')}</span>
                        {recipes.map(recipe => (
                            <button
                                key={recipe.id}
                                onClick={() => {
                                    setInitScriptMode(false);
                                    clearAll();
                                    setTimeout(() => {
                                        recipe.apps.forEach(appId => {
                                            if (isAppAvailable(appId)) toggleApp(appId);
                                        });
                                    }, 0);
                                }}
                                className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border-primary)]/30 
                                    bg-[var(--bg-tertiary)] text-[var(--text-secondary)]
                                    hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]
                                    transition-all duration-200"
                                title={recipe.description}
                            >
                                {recipe.name}
                            </button>
                        ))}
                        <button
                            onClick={() => {
                                clearAll();
                                setInitScriptMode(true);
                            }}
                            className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-200
                                ${initScriptMode
                                    ? 'bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]/40'
                                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-primary)]/30 hover:bg-[var(--bg-hover)]'
                                }`}
                            title={language === 'zh' ? '一键换源 + 安装中文字体 + 输入法 + pip/npm/go/docker 镜像' : 'One-click mirror + Chinese font + IME + pip/npm/go/docker mirrors'}
                        >
                            {t('init.title')}
                        </button>
                        <label
                            className={`px-3 py-1.5 text-xs rounded-lg border cursor-pointer select-none transition-all duration-200 flex items-center gap-1.5
                                ${initScriptMode && includeDocker
                                    ? 'bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]/40'
                                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-primary)]/30 hover:bg-[var(--bg-hover)]'
                                }`}
                            title={language === 'zh' ? '在初始化脚本中安装 Docker CE + 配置镜像加速' : 'Install Docker CE in init script + configure mirror'}
                        >
                            <input
                                type="checkbox"
                                checked={includeDocker}
                                onChange={(e) => setIncludeDocker(e.target.checked)}
                                className="w-3 h-3 accent-[var(--accent)]"
                                disabled={!initScriptMode}
                            />
                            <span>{t('docker.label')}</span>
                        </label>
                    </div>
                    {/* 国产发行版提示：优先使用应用商店 */}
                    {isChinaDistro(selectedDistro) && (() => {
                        const meta = getChinaDistroMeta(selectedDistro);
                        if (!meta) return null;
                        return (
                            <div className="mb-6 mx-1 px-4 py-3 rounded-lg border-2 border-[var(--accent)]/30 bg-[var(--accent)]/5"
                                style={{ borderColor: '#007CFF', backgroundColor: 'rgba(0, 124, 255, 0.05)' }}>
                                <div className="flex items-start gap-3">
                                    <span className="text-lg mt-0.5 shrink-0">💡</span>
                                    <div className="text-sm leading-relaxed">
                                        <p className="font-semibold mb-1">
                                            {language === 'zh'
                                                ? `您已选择「${meta.nameZh}」`
                                                : `You selected "${meta.name}"`}
                                        </p>
                                        <p className="text-[var(--text-secondary)]">
                                            {getAppStoreHint(selectedDistro, language)}
                                        </p>
                                        <p className="text-[var(--text-muted)] text-xs mt-1">
                                            {language === 'zh'
                                                ? `应用商店地址: ${meta.appStoreUrl}`
                                                : `App store: ${meta.appStoreUrl}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                    {allCategoriesWithApps.length === 0 && searchQuery && (
                        <div className="text-center py-20 text-[var(--text-muted)]">
                            <div className="text-4xl mb-4">🔍</div>
                            <p className="text-base">{t('search.noResults')}</p>
                            <p className="text-sm mt-2 opacity-60">{t('search.tryOther')}</p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-x-4 lg:hidden items-start">
                        {(() => {
                            const mobileColumns: Array<typeof allCategoriesWithApps> = [[], []];
                            const heights = [0, 0];
                            allCategoriesWithApps.forEach(catData => {
                                const minIdx = heights[0] <= heights[1] ? 0 : 1;
                                mobileColumns[minIdx].push(catData);
                                heights[minIdx] += catData.apps.length + 2;
                            });
                            return mobileColumns.map((columnCategories, colIdx) => (
                                <div key={`mobile-col-${colIdx}`}>
                                    {columnCategories.map(({ category, apps: categoryApps }, catIdx) => (
                                        <CategorySection
                                            key={`${category}-${categoryApps.length}`}
                                            category={category}
                                            categoryApps={categoryApps}
                                            selectedApps={selectedApps}
                                            isAppAvailable={isAppAvailable}
                                            selectedDistro={selectedDistro}
                                            toggleApp={toggleApp}
                                            isExpanded={expandedCategories.has(category)}
                                            onToggleExpanded={() => toggleCategoryExpanded(category)}
                                            focusedId={isKeyboardNavigating ? focusedItem?.id : undefined}
                                            focusedType={isKeyboardNavigating ? focusedItem?.type : undefined}
                                            onTooltipEnter={showTooltip}
                                            onTooltipLeave={hideTooltip}
                                            categoryIndex={catIdx}
                                            onCategoryFocus={() => setFocusByItem('category', category)}
                                            onAppFocus={(appId) => setFocusByItem('app', appId)}
                                            isVerified={isVerified}
                                            getVerificationSource={getVerificationSource}
                                            onSelectAll={() => selectAllInCategory(categoryApps)}
                                            searchQuery={debouncedSearch}
                                            language={language}
                                        />
                                    ))}
                                </div>
                            ));
                        })()}
                    </div>

                    <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-x-8 items-start">
                        {columns.map((columnCategories, colIdx) => {
                            let globalIdx = 0;
                            for (let c = 0; c < colIdx; c++) {
                                globalIdx += columns[c].length;
                            }

                            const columnKey = `col-${colIdx}-${columnCategories.map(c => c.category).join('-')}`;

                            return (
                                <div key={columnKey}>
                                    {columnCategories.map(({ category, apps: categoryApps }, catIdx) => (
                                        <CategorySection
                                            key={`${category}-${categoryApps.length}`}
                                            category={category}
                                            categoryApps={categoryApps}
                                            selectedApps={selectedApps}
                                            isAppAvailable={isAppAvailable}
                                            selectedDistro={selectedDistro}
                                            toggleApp={toggleApp}
                                            isExpanded={expandedCategories.has(category)}
                                            onToggleExpanded={() => toggleCategoryExpanded(category)}
                                            focusedId={isKeyboardNavigating ? focusedItem?.id : undefined}
                                            focusedType={isKeyboardNavigating ? focusedItem?.type : undefined}
                                            onTooltipEnter={showTooltip}
                                            onTooltipLeave={hideTooltip}
                                            categoryIndex={globalIdx + catIdx}
                                            onCategoryFocus={() => setFocusByItem('category', category)}
                                            onAppFocus={(appId) => setFocusByItem('app', appId)}
                                            isVerified={isVerified}
                                            getVerificationSource={getVerificationSource}
                                            onSelectAll={() => selectAllInCategory(categoryApps)}
                                            searchQuery={debouncedSearch}
                                            language={language}
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
                )}
                </div>
            </main>

            <CommandFooter
                command={initScriptMode ? generateInitScript(selectedDistro, selectedMirror, includeDocker) : generatedCommand}
                selectedCount={selectedCount}
                initScriptMode={initScriptMode}
                selectedDistro={selectedDistro}
                selectedApps={selectedApps}
                hasAurPackages={hasAurPackages}
                aurAppNames={aurAppNames}
                hasYayInstalled={hasYayInstalled}
                setHasYayInstalled={setHasYayInstalled}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                searchInputRef={searchInputRef}
                clearAll={clearAll}
                selectedHelper={selectedHelper}
                setSelectedHelper={setSelectedHelper}
                hasUnfreePackages={hasUnfreePackages}
                unfreeAppNames={unfreeAppNames}
                totalSize={totalSize}
                drawerOpen={drawerOpen}
                drawerClosing={drawerClosing}
                onDrawerOpen={() => setDrawerOpen(true)}
                onDrawerClose={closeDrawer}
                activeShortcut={activeShortcut}
            />
        </div>
        </ErrorBoundary>
    );
}

export default function Home() {
    return (
        <LanguageProvider>
            <HomeContent />
        </LanguageProvider>
    );
}
