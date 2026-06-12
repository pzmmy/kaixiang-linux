import { describe, it, expect } from 'vitest';
import { getIconUrl } from '@/lib/data';

describe('getIconUrl', () => {
    it('URL 类型图标直接返回', () => {
        const result = getIconUrl({ type: 'url', url: 'https://example.com/icon.svg' });
        expect(result).toBe('https://example.com/icon.svg');
    });

    it('Iconify 图标生成正确 URL', () => {
        const result = getIconUrl({ type: 'iconify', set: 'simple-icons', name: 'firefox' });
        expect(result).toBe('https://api.iconify.design/simple-icons/firefox.svg');
    });

    it('带颜色的 Iconify 图标附加 color 参数', () => {
        const result = getIconUrl({ type: 'iconify', set: 'logos', name: 'wechat', color: '#07C160' });
        expect(result).toContain('color=%2307C160');
        expect(result).toContain('logos/wechat.svg');
    });

    it('未定义颜色的 Iconify 图标无 color 参数', () => {
        const result = getIconUrl({ type: 'iconify', set: 'simple-icons', name: 'linux' });
        expect(result).not.toContain('color=');
    });
});
