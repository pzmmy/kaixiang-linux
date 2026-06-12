'use client';

import { memo, useRef, useEffect } from 'react';
import { type DistroId, type AppData, type Category } from '@/lib/data';
import { analytics } from '@/lib/analytics';
import { CategoryHeader } from './CategoryHeader';
import { AppItem } from './AppItem';

// Category section.
interface CategorySectionProps {
    category: Category;
    categoryApps: AppData[];
    selectedApps: Set<string>;
    isAppAvailable: (id: string) => boolean;
    selectedDistro: DistroId;
    toggleApp: (id: string) => void;
    isExpanded: boolean;
    onToggleExpanded: () => void;
    focusedId: string | undefined;
    focusedType: 'category' | 'app' | undefined;
    onTooltipEnter: (t: string, e: React.MouseEvent) => void;
    onTooltipLeave: () => void;
    categoryIndex: number;
    onCategoryFocus?: () => void;
    onAppFocus?: (appId: string) => void;
    isVerified?: (distro: DistroId, packageName: string) => boolean;
    getVerificationSource?: (distro: DistroId, packageName: string) => 'flathub' | 'snap' | null;
    onSelectAll?: () => void;
    searchQuery?: string;
}

const categoryColors: Record<Category, string> = {
    'Web Browsers': 'orange',
    'Communication': 'blue',
    'Media': 'yellow',
    'Gaming': 'purple',
    'Office': 'indigo',
    'Creative': 'cyan',
    'System': 'red',
    'File Sharing': 'teal',
    'Security': 'green',
    'VPN & Network': 'emerald',
    'Dev: Editors': 'sky',
    'Dev: Languages': 'rose',
    'Dev: Tools': 'slate',
    'Terminal': 'zinc',
    'CLI Tools': 'gray',
    'AI Tools': 'fuchsia'
};

function CategorySectionComponent({
    category,
    categoryApps,
    selectedApps,
    isAppAvailable,
    selectedDistro,
    toggleApp,
    isExpanded,
    onToggleExpanded,
    focusedId,
    focusedType,
    onTooltipEnter,
    onTooltipLeave,
    categoryIndex,
    onCategoryFocus,
    onAppFocus,
    isVerified,
    getVerificationSource,
    onSelectAll,
    searchQuery,
}: CategorySectionProps) {
    const selectedInCategory = categoryApps.filter(a => selectedApps.has(a.id)).length;
    const isCategoryFocused = focusedType === 'category' && focusedId === category;
    const sectionRef = useRef<HTMLDivElement>(null);
    const prevAppCount = useRef(categoryApps.length);

    const color = categoryColors[category] || 'gray';

    return (
        <div ref={sectionRef} className="mb-3 md:mb-5 category-section" style={{ contentVisibility: 'auto', containIntrinsicSize: '200px' }}>
            <CategoryHeader
                category={category}
                isExpanded={isExpanded}
                isFocused={isCategoryFocused}
                onToggle={() => {
                    const willExpand = !isExpanded;
                    onToggleExpanded();
                    if (willExpand) {
                        analytics.categoryExpanded(category);
                    } else {
                        analytics.categoryCollapsed(category);
                    }
                }}
                selectedCount={selectedInCategory}
                onFocus={onCategoryFocus}
                color={color}
                onSelectAll={onSelectAll}
            />
            <div
                className={`overflow-hidden transition-[max-height,opacity] duration-500 pt-0.5 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
                {categoryApps.map((app) => (
                    <AppItem
                        key={app.id}
                        app={app}
                        isSelected={selectedApps.has(app.id)}
                        isAvailable={isAppAvailable(app.id)}
                        isFocused={focusedType === 'app' && focusedId === app.id}
                        selectedDistro={selectedDistro}
                        onToggle={() => toggleApp(app.id)}
                        onTooltipEnter={onTooltipEnter}
                        onTooltipLeave={onTooltipLeave}
                        onFocus={() => onAppFocus?.(app.id)}
                        color={color}
                        searchQuery={searchQuery}
                        isVerified={
                            (selectedDistro === 'flatpak' || selectedDistro === 'snap') &&
                            isVerified?.(selectedDistro, app.targets?.[selectedDistro] || '') || false
                        }
                        verificationSource={
                            (selectedDistro === 'flatpak' || selectedDistro === 'snap')
                                ? getVerificationSource?.(selectedDistro, app.targets?.[selectedDistro] || '') || null
                                : null
                        }
                    />
                ))}
            </div>
        </div>
    );
}

export const CategorySection = memo(CategorySectionComponent, (prevProps, nextProps) => {
    if (prevProps.categoryApps.length !== nextProps.categoryApps.length) return false;

    const prevIds = prevProps.categoryApps.map(a => a.id).join(',');
    const nextIds = nextProps.categoryApps.map(a => a.id).join(',');
    if (prevIds !== nextIds) return false;

    if (prevProps.category !== nextProps.category) return false;
    if (prevProps.isExpanded !== nextProps.isExpanded) return false;
    if (prevProps.selectedDistro !== nextProps.selectedDistro) return false;
    if (prevProps.focusedId !== nextProps.focusedId) return false;
    if (prevProps.focusedType !== nextProps.focusedType) return false;
    if (prevProps.categoryIndex !== nextProps.categoryIndex) return false;

    if (prevProps.isVerified !== nextProps.isVerified) return false;
    if (prevProps.getVerificationSource !== nextProps.getVerificationSource) return false;

    for (const app of nextProps.categoryApps) {
        if (prevProps.selectedApps.has(app.id) !== nextProps.selectedApps.has(app.id)) {
            return false;
        }
    }

    return true;
});
