import { describe, it, expect } from 'vitest';
import { isUnfreePackage } from '@/lib/nixUnfree';

describe('isUnfreePackage', () => {
    it('已知 unfree 包返回 true', () => {
        expect(isUnfreePackage('vscode')).toBe(true);
        expect(isUnfreePackage('google-chrome')).toBe(true);
        expect(isUnfreePackage('steam')).toBe(true);
    });

    it('已知 free 包返回 false', () => {
        expect(isUnfreePackage('firefox')).toBe(false);
        expect(isUnfreePackage('vim')).toBe(false);
        expect(isUnfreePackage('nodejs')).toBe(false);
    });

    it('部分匹配也返回 true', () => {
        // Contains 'slack' (an unfree package name)
        expect(isUnfreePackage('slack-desktop')).toBe(true);
    });

    it('大小写不敏感', () => {
        expect(isUnfreePackage('VSCode')).toBe(true);
        expect(isUnfreePackage('Google-Chrome')).toBe(true);
    });

    it('空字符串返回 false', () => {
        expect(isUnfreePackage('')).toBe(false);
    });
});
