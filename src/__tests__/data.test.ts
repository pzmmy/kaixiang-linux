import { describe, it, expect } from 'vitest';
import { distros, apps, categories, getAppsByCategory, isAppAvailable, categoryNamesZh } from '@/lib/data';

describe('发行版数据', () => {
    it('应包含 Deepin 和 UOS', () => {
        const ids = distros.map(d => d.id);
        expect(ids).toContain('deepin');
        expect(ids).toContain('uos');
    });

    it('每个发行版应有有效的前缀和图标', () => {
        distros.forEach(d => {
            expect(d.installPrefix).toBeTruthy();
            expect(d.iconUrl).toMatch(/^https?:\/\//);
        });
    });
});

describe('软件数据', () => {
    it('总数应接近 180 款', () => {
        expect(apps.length).toBeGreaterThan(170);
        expect(apps.length).toBeLessThan(200);
    });

    it('每款软件必填字段不可缺', () => {
        apps.forEach(app => {
            expect(app.id).toBeTruthy();
            expect(app.name).toBeTruthy();
            expect(app.description).toBeTruthy();
            expect(app.category).toBeTruthy();
            expect(app.icon).toBeDefined();
            expect(app.targets).toBeDefined();
        });
    });

    it('ID 和分类必须有效', () => {
        const ids = apps.map(a => a.id);
        expect(new Set(ids).size).toBe(ids.length);
        apps.forEach(a => expect(categories).toContain(a.category));
    });

    it('被墙软件已全部移除', () => {
        const blocked = ['discord', 'telegram', 'signal', 'slack', 'tor-browser', 'mullvad'];
        blocked.forEach(id => {
            expect(apps.find(a => a.id === id)).toBeUndefined();
        });
    });
});

describe('分类', () => {
    it('所有分类都有中文名', () => {
        categories.forEach(cat => {
            expect(categoryNamesZh[cat]).toBeTruthy();
            expect(categoryNamesZh[cat].length).toBeGreaterThan(1);
        });
    });

    it('每个分类至少有一款软件', () => {
        categories.forEach(cat => {
            expect(getAppsByCategory(cat).length).toBeGreaterThan(0);
        });
    });
});

describe('isAppAvailable', () => {
    it('Firefox 在 Ubuntu 和 Arch 上都可用', () => {
        const ff = apps.find(a => a.id === 'firefox')!;
        expect(isAppAvailable(ff, 'ubuntu')).toBe(true);
        expect(isAppAvailable(ff, 'arch')).toBe(true);
    });

    it('微信在 Ubuntu 官方仓库不可用', () => {
        const wechat = apps.find(a => a.id === 'wechat')!;
        expect(isAppAvailable(wechat, 'ubuntu')).toBe(false);
        expect(isAppAvailable(wechat, 'arch')).toBe(true);  // AUR
    });
});
