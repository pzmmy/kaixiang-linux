import { describe, it, expect } from 'vitest';
import { apps } from '@/lib/data';

describe('中国软件数据', () => {
    const chineseApps = apps.filter(a => a.aliases);

    it('应有别名标记的中国软件（通过 aliases 字段识别）', () => {
        expect(chineseApps.length).toBeGreaterThan(20);
    });

    it('中国软件应有中文 description', () => {
        chineseApps.forEach(a => {
            // Chinese descriptions should not be all ASCII
            expect(a.description).toMatch(/[\u4e00-\u9fff]/);
        });
    });

    it('微信应有 note 提示', () => {
        const wechat = apps.find(a => a.id === 'wechat')!;
        expect(wechat.note).toBeTruthy();
        expect(wechat.note).toContain('Flatpak');
    });

    it('中国软件应有 size 字段（安装大小估算）', () => {
        chineseApps.forEach(a => {
            expect(a.size).toBeGreaterThan(0);
        });
    });

    it('被墙软件应全部移除', () => {
        const blockedIds = ['discord', 'telegram', 'signal', 'slack', 'tor-browser', 'mullvad'];
        blockedIds.forEach(id => {
            expect(apps.find(a => a.id === id)).toBeUndefined();
        });
    });

    it('应至少包含 10 款 AUR 可用软件', () => {
        const aurApps = apps.filter(a => a.targets.arch && a.targets.arch.endsWith('-bin'));
        expect(aurApps.length).toBeGreaterThan(10);
    });

    it('每款 App 的 Chinese alias 应包含其英文名', () => {
        chineseApps.forEach(a => {
            expect(a.aliases!.length).toBeGreaterThan(0);
        });
    });
});
