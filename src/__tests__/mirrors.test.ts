import { describe, it, expect } from 'vitest';
import { mirrorSources } from '@/lib/data';

describe('镜像源配置', () => {
    it('应有 7 个镜像选项（含无镜像）', () => {
        expect(mirrorSources.length).toBe(7);
        expect(mirrorSources[0].id).toBe('none');
    });

    it('清华源应设为默认', () => {
        // Tuna is the first real mirror (index 1)
        expect(mirrorSources[1].id).toBe('tuna');
    });

    it('每个镜像源应有名称和描述', () => {
        mirrorSources.forEach(m => {
            expect(m.name).toBeTruthy();
            expect(m.description).toBeTruthy();
        });
    });

    it('系统镜像 URL 必须以 https:// 开头', () => {
        mirrorSources.forEach(m => {
            Object.entries(m.rules).forEach(([, url]) => {
                expect(url).toMatch(/^https:\/\//);
            });
        });
    });

    it('非 none 镜像应有至少一个规则', () => {
        mirrorSources.filter(m => m.id !== 'none').forEach(m => {
            expect(Object.keys(m.rules).length).toBeGreaterThan(0);
        });
    });

    it('中科大和交大应有 flathubMirror', () => {
        const ustc = mirrorSources.find(m => m.id === 'ustc');
        const sjtug = mirrorSources.find(m => m.id === 'sjtug');
        expect(ustc?.flathubMirror).toBeTruthy();
        expect(sjtug?.flathubMirror).toBeTruthy();
    });

    it('清华和中科大应有 flathubMirror（可用）', () => {
        const tuna = mirrorSources.find(m => m.id === 'tuna');
        const ustc = mirrorSources.find(m => m.id === 'ustc');
        expect(tuna?.flathubMirror).toBeDefined();
        expect(ustc?.flathubMirror).toBeDefined();
    });

    it('非推荐镜像不应有 flathubMirror（不可用）', () => {
        const aliyun = mirrorSources.find(m => m.id === 'aliyun');
        expect(aliyun?.flathubMirror).toBeUndefined();
    });
});
